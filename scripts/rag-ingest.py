#!/usr/bin/env python3
"""Clean Hexo blog posts and a landing page into RAG-ready chunks.

The script reads a fixed set of n8n blog posts plus the n8n-expert-v2
landing page, strips Hexo shortcode tags, normalizes hand-written HTML
headers, and cuts the remaining text into overlapping markdown-aware
chunks. Output is JSON Lines, one chunk per line.

Standard library only. Do not add third-party dependencies.
"""

import argparse
import html
import json
import re
import sys
from pathlib import Path

# --------------------------------------------------------------------------
# Constants (edit here when the source list or chunk shape needs to change)
# --------------------------------------------------------------------------

# The 12 posts to ingest. Filenames only, relative to source/_posts/.
TARGET_POST_FILENAMES = [
    "n8n-line-message-api.md",
    "n8n-line-messaging-community-node.md",
    "n8n-google-sheets-node.md",
    "n8n-gmail-node.md",
    "n8n-apify-node.md",
    "n8n-datatables-node.md",
    "n8n-with-slack.md",
    "n8n-deployment.md",
    "n8n-webhook.md",
    "n8n-security-vulnerability-2025.md",
    "n8n-with-cloudflare-turnstile-CAPTCHA.md",
    "n8n-node-s3-with-cloudflare-r2.md",
]

POSTS_DIR = Path("source/_posts")
LANDING_PAGE_PATH = Path("source/n8n-expert-v2/index.html")

BASE_URL = "https://www.darrelltw.com"
LANDING_PAGE_URL = f"{BASE_URL}/n8n-expert-v2/"

# Prose chunk shape (character-based, CJK counts as 1 char each).
CHUNK_SIZE = 500
CHUNK_OVERLAP = 75

# Hexo tags that get deleted entirely, including their content.
# darrellImage covers every variant: darrellImage, darrellImage800,
# darrellImage800Alt, darrellImageCover, ...
SELF_CLOSING_TAGS_TO_DROP = [
    "darrellImage\\w*",
    "darrellVideoSimple",
    "articleCard",
    "templateCard",
]
BLOCK_TAGS_TO_DROP = [
    "quickNav",
]

# Hexo tags whose shell is removed but inner content is kept.
SHELL_TAGS_TO_UNWRAP = [
    "callout",
    "raw",
]


# --------------------------------------------------------------------------
# Frontmatter
# --------------------------------------------------------------------------

FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\n(.*)\Z", re.DOTALL)


def parse_frontmatter(text):
    """Split a Hexo post into (frontmatter_dict, body_text).

    Frontmatter parsing here only needs a handful of scalar/list fields,
    so this is a small hand-rolled YAML subset reader, not a real
    YAML parser (no third-party deps allowed).
    """
    m = FRONTMATTER_RE.match(text)
    if not m:
        raise ValueError("post has no --- frontmatter block")
    fm_text, body = m.group(1), m.group(2)

    fm = {"tags": []}
    lines = fm_text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        km = re.match(r"^(\w+):\s*(.*)$", line)
        if not km:
            i += 1
            continue
        key, value = km.group(1), km.group(2).strip()
        if key == "tags":
            # tags is a YAML list on following lines: "  - foo"
            tags = []
            j = i + 1
            while j < len(lines) and re.match(r"^\s*-\s*(.+)$", lines[j]):
                tags.append(re.match(r"^\s*-\s*(.+)$", lines[j]).group(1).strip())
                j += 1
            fm["tags"] = tags
            i = j
            continue
        if key in ("id", "title", "date", "updated"):
            fm[key] = value
        i += 1
    return fm, body


def frontmatter_date_only(value):
    """Take 'YYYY-MM-DD HH:MM:SS' (or already-bare date) down to 'YYYY-MM-DD'."""
    if not value:
        return None
    return value.split(" ")[0].strip()


# --------------------------------------------------------------------------
# Step 2: normalize hand-written HTML headers
# --------------------------------------------------------------------------

HTML_HEADER_RE = re.compile(r"<h([23])(?:\s[^>]*)?>(.*?)</h\1>", re.DOTALL)


def normalize_html_headers(body):
    def repl(m):
        level = int(m.group(1))
        text = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        return f"{'#' * level} {text}"

    return HTML_HEADER_RE.sub(repl, body)


# --------------------------------------------------------------------------
# Step 3: extract {% faq %} and {% dataTable %} blocks
# --------------------------------------------------------------------------


def _find_block(body, tag_name):
    """Find the first {% tag ...%}...{% endtag %} block.

    Returns (full_match_text, args_str, inner_content, start, end) or None.
    Hexo tag args can contain no '%}' themselves, so a non-greedy match
    up to the first '%}' is safe for the opening tag.
    """
    open_re = re.compile(r"\{%\s*" + tag_name + r"\b([^%]*)%\}", re.DOTALL)
    end_re = re.compile(r"\{%\s*end" + tag_name + r"\s*%\}")

    om = open_re.search(body)
    if not om:
        return None
    em = end_re.search(body, om.end())
    if not em:
        return None
    inner = body[om.end():em.start()]
    return body[om.start():em.end()], om.group(1), inner, om.start(), em.end()


def nearest_headings(text, pos):
    """Return (h2, h3) -- whichever ##/### markdown headings are in effect
    right before position pos in text. Used to give a faq/table chunk the
    same breadcrumb context a prose chunk from the same section would get.
    """
    before = text[:pos]
    h2 = None
    h3 = None
    last_h2_end = -1
    for m in re.finditer(r"^##\s+(.*)$", before, re.MULTILINE):
        h2 = m.group(1).strip()
        last_h2_end = m.end()
    for m in re.finditer(r"^###\s+(.*)$", before, re.MULTILINE):
        if m.start() > last_h2_end:
            h3 = m.group(1).strip()
    return h2, h3


def extract_json_tag_blocks(body, tag_name, content_type, make_texts_fn):
    """Pull every {% tag %}...JSON...{% endtag %} block out of body.

    On success: make_texts_fn(data) returns a list of chunk texts for that
    one block (faq -> one text per Q&A pair; dataTable -> one text for the
    whole table); each becomes a (content_type, text, h2, h3) tuple, and
    the block is removed from body. h2/h3 are the headings in effect right
    before the tag in the ORIGINAL (pre-extraction) body, for breadcrumbs.
    On JSON parse failure: the block is NOT dropped. Only the {% tag %} /
    {% endtag %} wrapper is stripped, so the raw inner text stays in body
    and flows through the normal prose pipeline (term expansion included).
    """
    chunks = []
    failures = []
    out = []
    pos = 0
    original = body
    while True:
        found = _find_block(body[pos:], tag_name)
        if not found:
            out.append(body[pos:])
            break
        full, _args, inner, start, end = found
        abs_start = pos + start
        out.append(body[pos:pos + start])
        h2, h3 = nearest_headings(original, abs_start)
        try:
            data = json.loads(inner.strip())
            for text in make_texts_fn(data):
                chunks.append((content_type, text, h2, h3))
        except (json.JSONDecodeError, ValueError) as e:
            failures.append({"tag": tag_name, "error": str(e), "snippet": inner.strip()[:200]})
            # Retreat to prose: keep the inner content, drop only the tag shell.
            out.append(inner)
        pos = pos + end
    return "".join(out), chunks, failures


def faq_json_to_texts(items):
    """One {% faq %} block -> one chunk per Q&A pair (not one big block)."""
    texts = []
    for item in items:
        q = (item.get("question") or "").strip()
        raw_answer = item.get("answer") or ""
        # <br> is a line break, not word-glue: turn it into a newline before
        # stripping the rest of the tags, or "用這個Run Actor" runs together.
        raw_answer = re.sub(r"<br\s*/?>", "\n", raw_answer)
        a = re.sub(r"<[^>]+>", "", raw_answer)
        a = re.sub(r"\n{2,}", "\n", a).strip()
        texts.append(f"Q: {q}\nA: {a}")
    return texts


def datatable_json_to_markdown(rows):
    """One {% dataTable %} block -> one chunk holding the whole table."""
    if not rows:
        return []
    columns = list(rows[0].keys())
    header = "| " + " | ".join(columns) + " |"
    sep = "| " + " | ".join(["---"] * len(columns)) + " |"
    body_lines = []
    for row in rows:
        cells = [str(row.get(col, "")).replace("\n", " ").replace("|", "/") for col in columns]
        body_lines.append("| " + " | ".join(cells) + " |")
    return ["\n".join([header, sep] + body_lines)]


# --------------------------------------------------------------------------
# Step 4: expand {% term def="..." %}word{% endterm %}
# --------------------------------------------------------------------------

TERM_RE = re.compile(
    r'\{%\s*term\s+def="((?:[^"\\]|\\.)*)"\s*%\}(.*?)\{%\s*endterm\s*%\}',
    re.DOTALL,
)


def expand_term_tags(body):
    def repl(m):
        definition = m.group(1)
        word = m.group(2)
        return f"{word}（{definition}）"

    return TERM_RE.sub(repl, body)


# --------------------------------------------------------------------------
# Step 5: unwrap callout / raw shells (keep inner content)
# --------------------------------------------------------------------------


def unwrap_shell_tags(body, tag_names):
    for tag_name in tag_names:
        open_re = re.compile(r"\{%\s*" + tag_name + r"\b[^%]*%\}\n?")
        end_re = re.compile(r"\{%\s*end" + tag_name + r"\s*%\}\n?")
        body = open_re.sub("", body)
        body = end_re.sub("", body)
    return body


# --------------------------------------------------------------------------
# Step 6: delete decorative tags entirely
# --------------------------------------------------------------------------


def delete_self_closing_tags(body, patterns):
    for pattern in patterns:
        tag_re = re.compile(r"\{%\s*(?:" + pattern + r")\b.*?%\}\n?", re.DOTALL)
        body = tag_re.sub("", body)
    return body


def delete_block_tags(body, tag_names):
    for tag_name in tag_names:
        block_re = re.compile(
            r"\{%\s*" + tag_name + r"\s*%\}.*?\{%\s*end" + tag_name + r"\s*%\}\n?",
            re.DOTALL,
        )
        body = block_re.sub("", body)
    return body


# --------------------------------------------------------------------------
# Residual raw HTML that is not a Hexo tag at all.
#
# Some posts embed live page markup directly (a Slack "copy scope" widget
# with its own <div>/<style>/<script>, Vimeo <iframe> embeds, and one
# hand-written FAQPage <script type="application/ld+json"> block that
# duplicates the real {% faq %} block further down in the same post).
# None of this is covered by the explicit Hexo-tag rules above, so it is
# handled here: <style>/<script> content carries no prose value and is
# dropped outright; remaining tags (<div>, <p>, <li>, <span>, <iframe>...)
# are stripped but their inner text is kept, same treatment as the landing
# page fragments below. This is a judgment call beyond the explicit
# instructions -- flagged in the report.
#
# This step (and everything from term expansion through decorative-tag
# deletion) is applied ONLY outside fenced ``` code blocks. Several posts
# embed literal <script>/<html> as teaching example code inside a fence
# (e.g. n8n-with-cloudflare-turnstile-CAPTCHA.md's front-end sample) --
# that code must survive byte-for-byte, not get cleaned like live markup.
# --------------------------------------------------------------------------

STYLE_BLOCK_RE = re.compile(r"<style\b[^>]*>.*?</style>", re.DOTALL)
SCRIPT_BLOCK_RE = re.compile(r"<script\b[^>]*>.*?</script>", re.DOTALL)
# Only matches well-formed tags (starts with a letter right after < or </),
# so stray "<" / ">" used as plain less-than/greater-than in prose (e.g.
# "< 5 分鐘") is never mistaken for a tag.
GENERIC_TAG_RE = re.compile(r"</?[a-zA-Z][\w-]*(?:\s+[^<>]*)?/?>")
HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)


def html_to_readable_text(fragment):
    """Turn a fixed-ish HTML fragment into readable markdown-ish text.

    Regex-only by design (no third-party HTML parser allowed) -- this only
    has to survive the specific, stable widget/embed markup actually
    present in these posts and the landing page, not arbitrary HTML.
    """
    text = HTML_COMMENT_RE.sub("", fragment)
    text = re.sub(r"<h2[^>]*>(.*?)</h2>", lambda m: "\n\n## " + re.sub(r"<[^>]+>", "", m.group(1)).strip() + "\n\n", text, flags=re.DOTALL)
    text = re.sub(r"<h3[^>]*>(.*?)</h3>", lambda m: "\n\n### " + re.sub(r"<[^>]+>", "", m.group(1)).strip() + "\n\n", text, flags=re.DOTALL)
    text = re.sub(r"<h4[^>]*>(.*?)</h4>", lambda m: "\n\n#### " + re.sub(r"<[^>]+>", "", m.group(1)).strip() + "\n\n", text, flags=re.DOTALL)
    text = re.sub(r"<li[^>]*>(.*?)</li>", lambda m: "\n- " + re.sub(r"<[^>]+>", "", m.group(1)).strip(), text, flags=re.DOTALL)
    text = re.sub(r"<p[^>]*>(.*?)</p>", lambda m: "\n\n" + re.sub(r"<[^>]+>", "", m.group(1)).strip() + "\n\n", text, flags=re.DOTALL)
    text = GENERIC_TAG_RE.sub(" ", text)
    text = html.unescape(text)
    text = re.sub(r"[ \t]+", " ", text)
    text = "\n".join(line.strip() for line in text.split("\n"))
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


CODE_FENCE_SPLIT_RE = re.compile(r"(```.*?```)", re.DOTALL)


def split_by_code_fences(body):
    """Split body into alternating [non-fence, fence, non-fence, ...] parts.

    Every target post has a balanced (even) count of ``` markers, so this
    split always lands on fence boundaries; odd-index parts are fences.
    """
    return CODE_FENCE_SPLIT_RE.split(body)


def clean_non_fence_text(text):
    text = expand_term_tags(text)
    text = unwrap_shell_tags(text, SHELL_TAGS_TO_UNWRAP)
    text = delete_self_closing_tags(text, SELF_CLOSING_TAGS_TO_DROP)
    text = delete_block_tags(text, BLOCK_TAGS_TO_DROP)
    text = STYLE_BLOCK_RE.sub("", text)
    text = SCRIPT_BLOCK_RE.sub("", text)
    text = html_to_readable_text(text)
    return text


def clean_body(body):
    """Run term expansion, shell unwrap, decorative deletion, and residual
    HTML cleanup -- everywhere EXCEPT inside fenced ``` code blocks, which
    pass through untouched.
    """
    parts = split_by_code_fences(body)
    out = []
    for i, part in enumerate(parts):
        out.append(part if i % 2 == 1 else clean_non_fence_text(part))
    return "".join(out)


# --------------------------------------------------------------------------
# Step 7: heading-aware chunker
#
# Only a change of ## (h2) section forces a hard chunk break. ### (h3)
# subsections do NOT force a break on their own -- they pack together with
# their neighbors until the size budget is hit. The first version of this
# chunker treated every ##/### line as a forced boundary, which produced a
# tiny standalone chunk per h3 subsection (median ~130 chars against a
# 500-char target) since most subsections in these tutorials are short.
# Packing across h3 boundaries (but never across h2) fixes that directly,
# rather than patching it with a post-hoc "merge small chunks" pass.
#
# Every surviving chunk is prefixed with a "【title › h2 › h3】" breadcrumb
# so it is self-identifying even when retrieved out of context and short.
# Chunks with no real content of their own left after headings/dividers
# are stripped out (an empty section husk, e.g. a "## 常見問題" heading
# whose FAQ items were already pulled into their own faq chunks) are
# dropped rather than shipped as noise.
# --------------------------------------------------------------------------

SENTENCE_SPLIT_RE = re.compile(r"(?<=[。！？.!?])\s*")
H2_RE = re.compile(r"^##\s+(.*)$")
H3_RE = re.compile(r"^###\s+(.*)$")

# Budget reserved for the breadcrumb line so packed content + breadcrumb
# rarely blows far past CHUNK_SIZE. A typical breadcrumb for these posts
# ("【n8n Google Sheets 節點教學 › 常見錯誤修正 › OAuth 授權失敗】") runs
# well under this; it is a budget, not a byte-exact guarantee.
BREADCRUMB_RESERVE = 70

# Below this many substantive characters (headings / "---" dividers /
# whitespace stripped out), a chunk carries nothing retrievable of its
# own -- drop it instead of shipping an empty husk.
MIN_SUBSTANTIVE_CHARS = 30


def split_long_unit(text, size):
    """Hard-split a unit (paragraph or sentence) that alone exceeds size."""
    pieces = []
    start = 0
    while start < len(text):
        pieces.append(text[start:start + size])
        start += size
    return pieces


def pack_units(units, size, overlap):
    """Greedily pack plain text units (sentences) into chunks. Used only
    as the sub-splitter for an oversized non-code paragraph that DOES have
    sentence boundaries; heading-aware packing lives in
    pack_units_with_headings below.
    """
    chunks = []
    current = ""
    for unit in units:
        unit = unit.strip()
        if not unit:
            continue
        if len(unit) > size:
            if current:
                chunks.append(current.strip())
                current = ""
            chunks.extend(split_long_unit(unit, size))
            continue
        candidate = (current + "\n\n" + unit) if current else unit
        if len(candidate) <= size:
            current = candidate
        else:
            if current:
                chunks.append(current.strip())
            tail = current[-overlap:] if current and overlap > 0 else ""
            current = (tail + "\n\n" + unit) if tail else unit
            if len(current) > size:
                for sub in split_long_unit(current, size):
                    chunks.append(sub)
                current = ""
    if current.strip():
        chunks.append(current.strip())
    return chunks


def split_document_units(text):
    """Walk the document in order, yielding (unit_text, h2, h3) tuples.

    A unit is one heading line, one fenced ``` code block (always atomic:
    a code sample can contain its own blank lines, e.g. between two JS
    snippets, so splitting on blank lines alone would scatter one sample
    across several disconnected units), or one blank-line-delimited
    paragraph. h2/h3 record whichever heading is in effect at the START of
    that unit -- a heading unit's own h2/h3 is itself -- so a later
    chunk that only continues a section (rather than opening it) can still
    be tagged with the section it belongs to.
    """
    units = []
    cur_h2 = None
    cur_h3 = None
    parts = CODE_FENCE_SPLIT_RE.split(text)
    for i, part in enumerate(parts):
        if i % 2 == 1:
            if part.strip():
                units.append((part.strip(), cur_h2, cur_h3))
            continue
        for para in re.split(r"\n\s*\n", part):
            para = para.strip()
            if not para:
                continue
            first_line = para.split("\n", 1)[0]
            h2m = H2_RE.match(first_line)
            h3m = H3_RE.match(first_line)
            if h2m:
                cur_h2 = h2m.group(1).strip()
                cur_h3 = None
            elif h3m:
                cur_h3 = h3m.group(1).strip()
            units.append((para, cur_h2, cur_h3))
    return units


def looks_like_markdown_table(text):
    """True if every non-blank line is a '| ... |' table row.

    A markdown table has no blank lines inside it, so it is already one
    paragraph unit by the blank-line split -- but its rows are full of
    literal '.' characters (emails, version numbers, dates: "before:
    2024/12/31", "support@example.com") that the sentence splitter would
    misread as sentence ends, shredding the table into fragments glued
    back together with fake paragraph breaks. Treat it as atomic instead,
    the same way a fenced code block is atomic.
    """
    lines = [l for l in text.split("\n") if l.strip()]
    return bool(lines) and all(l.strip().startswith("|") for l in lines)


def pack_units_with_headings(units, size, overlap):
    """Greedily pack (text, h2, h3) units into (chunk_text, h2, h3) chunks.

    Only a change of h2 forces a hard break (handled naturally: once a new
    h2 unit is packed into a fresh chunk, have_heading locks that chunk's
    label to it) -- ### subsections pack together with their neighbors
    until the size budget is hit. A fenced code block or a markdown table
    is atomic: it is flushed as its own chunk if it does not fit, and even
    if it alone exceeds size it is NEVER torn -- an oversized whole chunk
    beats a code sample or table cut mid-token (e.g. a domain name split
    at an internal dot).
    """
    chunks = []
    current = []
    current_h2 = None
    current_h3 = None
    have_heading = False

    def current_len():
        return sum(len(u) for u in current) + 2 * max(0, len(current) - 1)

    def flush(carry_overlap=True):
        nonlocal current, current_h2, current_h3, have_heading
        if not current:
            return
        text = "\n\n".join(current).strip()
        if text:
            chunks.append((text, current_h2, current_h3))
        tail = text[-overlap:] if carry_overlap and overlap > 0 and text else ""
        current = [tail] if tail else []
        current_h2 = None
        current_h3 = None
        have_heading = False

    for unit, h2, h3 in units:
        unit = unit.strip()
        if not unit:
            continue
        if len(unit) > size:
            flush(carry_overlap=False)
            if unit.startswith("```") or looks_like_markdown_table(unit):
                chunks.append((unit, h2, h3))
            else:
                sentences = [s for s in SENTENCE_SPLIT_RE.split(unit) if s.strip()]
                if len(sentences) <= 1:
                    for piece in split_long_unit(unit, size):
                        chunks.append((piece, h2, h3))
                else:
                    for sub in pack_units(sentences, size, overlap):
                        chunks.append((sub, h2, h3))
            continue
        prospective = current_len() + (2 if current else 0) + len(unit)
        if current and prospective > size:
            flush()
        if not have_heading:
            current_h2, current_h3 = h2, h3
            have_heading = True
        current.append(unit)
    flush(carry_overlap=False)
    return [c for c in chunks if c[0].strip()]


def format_breadcrumb(*parts):
    clean = [p.strip() for p in parts if p and p.strip()]
    if not clean:
        return ""
    return "【" + " › ".join(clean) + "】"


def is_substantive(text, min_chars=MIN_SUBSTANTIVE_CHARS):
    stripped = re.sub(r"^#{1,6}\s.*$", "", text, flags=re.MULTILINE)
    stripped = re.sub(r"^-{3,}\s*$", "", stripped, flags=re.MULTILINE)
    stripped = re.sub(r"\s+", "", stripped)
    return len(stripped) >= min_chars


def markdown_chunk(text, title, size=CHUNK_SIZE, overlap=CHUNK_OVERLAP, dropped_out=None):
    """Chunk text with the heading-aware packer above, then prefix every
    surviving chunk with a breadcrumb. dropped_out, if given a list, gets
    the raw text of every chunk dropped as an empty-husk (see module
    docstring for this section) for reporting.
    """
    text = text.strip()
    if not text:
        return []

    units = split_document_units(text)
    content_budget = max(size - BREADCRUMB_RESERVE, 200)
    raw_chunks = pack_units_with_headings(units, content_budget, overlap)

    result = []
    for chunk_text, h2, h3 in raw_chunks:
        if not is_substantive(chunk_text):
            if dropped_out is not None:
                dropped_out.append(chunk_text)
            continue
        breadcrumb = format_breadcrumb(title, h2, h3)
        result.append(f"{breadcrumb}\n\n{chunk_text}" if breadcrumb else chunk_text)
    return result


# --------------------------------------------------------------------------
# Post pipeline
# --------------------------------------------------------------------------


def build_post_chunks(post_path, errors, failures, dropped):
    raw = post_path.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(raw)

    post_id = fm.get("id")
    filename_id = post_path.stem
    if post_id != filename_id:
        errors.append(f"{post_path.name}: frontmatter id '{post_id}' != filename '{filename_id}'")
        return []

    title = fm.get("title", "")
    tags_str = ",".join(fm.get("tags", []))
    updated = frontmatter_date_only(fm.get("updated") or fm.get("date"))
    source_url = f"{BASE_URL}/{post_id}/"

    body = normalize_html_headers(body)

    body, faq_raw_chunks, faq_failures = extract_json_tag_blocks(
        body, "faq", "faq", faq_json_to_texts
    )
    body, table_raw_chunks, table_failures = extract_json_tag_blocks(
        body, "dataTable", "table", datatable_json_to_markdown
    )
    for f in faq_failures + table_failures:
        f["source_id"] = post_id
        failures.append(f)

    # Term expansion, shell unwrap, decorative-tag deletion, and residual
    # raw-HTML cleanup, applied everywhere except inside ``` code fences.
    body = clean_body(body)

    def meta(content_type, chunk_index):
        return {
            "source_id": post_id,
            "source_url": source_url,
            "title": title,
            "tags": tags_str,
            "content_type": content_type,
            "source_authority": "blog",
            "updated": updated,
            "chunk_index": chunk_index,
        }

    chunks = []
    idx = 0
    for prose_text in markdown_chunk(body, title, dropped_out=dropped):
        chunks.append({"text": prose_text, "metadata": meta("prose", idx)})
        idx += 1
    for content_type, text, h2, h3 in faq_raw_chunks + table_raw_chunks:
        h2_label = h2 or ("常見問題" if content_type == "faq" else "資料表")
        breadcrumb = format_breadcrumb(title, h2_label, h3)
        full_text = f"{breadcrumb}\n\n{text}" if breadcrumb else text
        chunks.append({"text": full_text, "metadata": meta(content_type, idx)})
        idx += 1
    return chunks


# --------------------------------------------------------------------------
# Landing page pipeline
# --------------------------------------------------------------------------


def extract_section_html(html_text, section_id):
    start_re = re.compile(r'<section\s+id="' + re.escape(section_id) + r'"[^>]*>')
    sm = start_re.search(html_text)
    if not sm:
        return None
    end = html_text.find("</section>", sm.end())
    if end == -1:
        return None
    return html_text[sm.end():end]


def extract_js_array(html_text, var_name):
    """Grab the raw text of `const VAR = [ ... ];` (brace/bracket-balanced)."""
    marker_re = re.compile(r"const\s+" + var_name + r"\s*=\s*\[")
    m = marker_re.search(html_text)
    if not m:
        return None
    depth = 1
    i = m.end()
    while i < len(html_text) and depth > 0:
        if html_text[i] == "[":
            depth += 1
        elif html_text[i] == "]":
            depth -= 1
        i += 1
    return html_text[m.end():i - 1]


def extract_portfolio(html_text):
    array_text = extract_js_array(html_text, "PORTFOLIO")
    if array_text is None:
        return []
    titles = re.findall(r'title:\s*"((?:[^"\\]|\\.)*)"', array_text)
    descs = re.findall(r'desc:\s*"((?:[^"\\]|\\.)*)"', array_text)
    tags_lists = re.findall(r"tags:\s*\[([^\]]*)\]", array_text)
    metrics = re.findall(r'metric:\s*"((?:[^"\\]|\\.)*)"', array_text)
    items = []
    for i in range(len(titles)):
        tags = re.findall(r'"((?:[^"\\]|\\.)*)"', tags_lists[i]) if i < len(tags_lists) else []
        items.append({
            "title": titles[i],
            "desc": descs[i] if i < len(descs) else "",
            "tags": tags,
            "metric": metrics[i] if i < len(metrics) else "",
        })
    return items


def extract_faqs_js(html_text):
    array_text = extract_js_array(html_text, "FAQS")
    if array_text is None:
        return []
    pattern = re.compile(
        r'\{\s*q:\s*"((?:[^"\\]|\\.)*)"\s*,\s*a:\s*"((?:[^"\\]|\\.)*)"\s*\}'
    )
    return [(q, a) for q, a in pattern.findall(array_text)]


LANDING_PAGE_TITLE = "n8n 自動化導入顧問服務"


def build_landing_chunks(html_path, dropped):
    html_text = html_path.read_text(encoding="utf-8")
    chunks = []

    def meta(source_id, content_type, chunk_index):
        return {
            "source_id": source_id,
            "source_url": LANDING_PAGE_URL,
            "title": LANDING_PAGE_TITLE,
            "tags": "n8n,automation,顧問服務",
            "content_type": content_type,
            "source_authority": "page",
            "updated": None,
            "chunk_index": chunk_index,
        }

    # #services
    services_html = extract_section_html(html_text, "services")
    if services_html is not None:
        text = html_to_readable_text(services_html)
        for i, part in enumerate(markdown_chunk(text, LANDING_PAGE_TITLE, dropped_out=dropped)):
            chunks.append({"text": part, "metadata": meta("page-services", "page", i)})

    # #process
    process_html = extract_section_html(html_text, "process")
    if process_html is not None:
        text = html_to_readable_text(process_html)
        for i, part in enumerate(markdown_chunk(text, LANDING_PAGE_TITLE, dropped_out=dropped)):
            chunks.append({"text": part, "metadata": meta("page-process", "page", i)})

    # PORTFOLIO JS array (#portfolioGrid is populated client-side, empty in HTML)
    portfolio = extract_portfolio(html_text)
    if portfolio:
        lines = []
        for item in portfolio:
            tags = "、".join(item["tags"])
            lines.append(
                f"### {item['title']}\n\n{item['desc']}\n\n標籤：{tags}｜成效：{item['metric']}"
            )
        text = "\n\n".join(lines)
        for i, part in enumerate(markdown_chunk(text, LANDING_PAGE_TITLE, dropped_out=dropped)):
            chunks.append({"text": part, "metadata": meta("page-portfolio", "page", i)})

    # FAQS JS array (#faqList is populated client-side, empty in HTML).
    # The JSON-LD FAQPage block near the top of <head> duplicates this same
    # 7-question set -- intentionally NOT read, to avoid double-counting.
    faqs = extract_faqs_js(html_text)
    faq_breadcrumb = format_breadcrumb(LANDING_PAGE_TITLE, "常見問題")
    for i, (q, a) in enumerate(faqs):
        text = f"{faq_breadcrumb}\n\nQ: {q}\nA: {a}"
        chunks.append({"text": text, "metadata": meta("page-faq", "faq", i)})

    return chunks


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description="Chunk n8n blog posts + landing page for RAG ingest.")
    parser.add_argument("--dry-run", action="store_true", required=True, help="Only write chunks.jsonl locally, no network calls.")
    parser.add_argument("--out", required=True, help="Output path for chunks.jsonl.")
    args = parser.parse_args()

    errors = []
    failures = []
    dropped = []
    all_chunks = []

    for filename in TARGET_POST_FILENAMES:
        post_path = POSTS_DIR / filename
        if not post_path.exists():
            errors.append(f"MISSING FILE: {filename}")
            continue
        all_chunks.extend(build_post_chunks(post_path, errors, failures, dropped))

    if not LANDING_PAGE_PATH.exists():
        errors.append(f"MISSING FILE: {LANDING_PAGE_PATH}")
    else:
        all_chunks.extend(build_landing_chunks(LANDING_PAGE_PATH, dropped))

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        for chunk in all_chunks:
            f.write(json.dumps(chunk, ensure_ascii=False) + "\n")

    print(f"Wrote {len(all_chunks)} chunks to {out_path}")
    if errors:
        print("\nERRORS:")
        for e in errors:
            print(f"  - {e}")
    if failures:
        print("\nJSON PARSE FAILURES (retreated to prose):")
        for fl in failures:
            print(f"  - {fl['source_id']} [{fl['tag']}]: {fl['error']}")
    if dropped:
        print(f"\nDROPPED {len(dropped)} empty-husk chunks (headers/dividers with no substantive content):")
        for d in dropped:
            print(f"  - {d!r}")

    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
