/**
 * remark-hexo-tags
 * Parses Hexo {% %} tag syntax and converts to HTML.
 * Each tag renderer is an independent function for future MDX migration (Plan B).
 */

import type { Plugin } from "unified";
import type { Root, Paragraph, Text, Html } from "mdast";
import { visit } from "unist-util-visit";

// ============================================
// Slug derivation helper
// ============================================

/**
 * Derive the post slug from a markdown file's absolute path.
 * e.g. /abs/path/src/data/blog/n8n-apify-node.md → "n8n-apify-node"
 * e.g. /abs/path/src/data/blog/subdir/post.md → "subdir/post"  (for nested)
 * Matches the logic in getPath().
 */
export function derivePostSlug(filePath: string): string {
  const BLOG_PATH_MARKER = "src/data/blog/";
  const idx = filePath.indexOf(BLOG_PATH_MARKER);
  if (idx === -1) return "";
  const relative = filePath.slice(idx + BLOG_PATH_MARKER.length); // e.g. "n8n-apify-node.md"
  // Remove .md extension and return
  return relative.replace(/\.md$/, "");
}

// ============================================
// HTML escaping helper
// ============================================

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ============================================
// Render functions (reusable for MDX Plan B)
// ============================================

export function renderImage(
  altText: string,
  imageSrc: string,
  className: string,
  isCover: boolean = false,
  postSlug: string = ""
): string {
  if (!altText || !imageSrc) return "";

  // For absolute URLs or already-absolute paths, use as-is.
  // For relative image filenames, prefix with /{slug}/ so they resolve correctly.
  let src: string;
  if (imageSrc.startsWith("http") || imageSrc.startsWith("/")) {
    src = imageSrc;
  } else if (postSlug) {
    src = `/${postSlug}/${imageSrc.replace(/^\.\//, "")}`;
  } else {
    src = imageSrc;
  }

  const safeAlt = escapeHtml(altText);
  const safeSrc = escapeHtml(src);

  if (isCover) {
    return `<figure class="blog-images blog-cover-image ${className}" style="overflow: hidden;">
  <img alt="${safeAlt}" src="${safeSrc}" loading="eager" decoding="async" style="display: block; width: 100%; height: auto;">
</figure>`;
  }

  return `<figure class="blog-images ${className}" style="overflow: hidden;">
  <img alt="${safeAlt}" src="${safeSrc}" loading="lazy" decoding="async" style="display: block; width: 100%; height: auto;">
</figure>`;
}

export function renderVideoSimple(
  altText: string,
  videoSrc: string,
  className: string = "max-800"
): string {
  if (!altText || !videoSrc) return "";
  const id = "video-" + Math.random().toString(36).substr(2, 9);
  const safeSrc = escapeHtml(videoSrc);
  return `<div class="darrell-video-container" style="max-width: 800px; margin: 0 auto; position: relative; aspect-ratio: 16/9;">
  <video id="${id}" controls width="100%" style="display: block; aspect-ratio: 16/9;" src="${safeSrc}">
    您的瀏覽器不支援影片播放。
  </video>
</div>`;
}

const CTA_VARIANTS = new Set([
  "editorial-line",
  "signature-card",
  "side-note",
  "inline-link",
  "service-bar",
]);

function isSafeCtaUrl(value: string): boolean {
  // Keep the Hexo tag's relative/http(s) contract while refusing executable
  // schemes and control characters in an HTML attribute.
  return (
    !/^(?:javascript|data|vbscript):/i.test(value.trim()) &&
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}

/** Render the CTA card emitted by scripts/cta-card.js in the Hexo source. */
export function renderCtaCard(
  title: string,
  url: string,
  button: string = "立即預約",
  variant: string = "",
  label: string = "",
  body: string = ""
): string {
  const normalizedTitle = title.trim();
  const normalizedUrl = url.trim();
  if (!normalizedTitle || !normalizedUrl || !isSafeCtaUrl(normalizedUrl)) {
    return "";
  }

  const safeTitle = escapeHtml(normalizedTitle);
  const safeUrl = escapeHtml(normalizedUrl);
  const safeButton = escapeHtml(button.trim() || "立即預約");
  const safeLabel = escapeHtml(label.trim());
  const safeVariant = CTA_VARIANTS.has(variant) ? variant : "";
  const bodyText = body.trim();
  const renderedBody = bodyText
    ? `<div class="dn-cta-text">${renderInlineMarkdown(escapeHtml(bodyText))}</div>`
    : "";
  const bodyMarkup = renderedBody
    ? `<div class="dn-cta-body">${renderedBody}</div>`
    : "";
  const isExternal = /^https?:\/\//.test(normalizedUrl);
  const linkAttrs = isExternal ? ' target="_blank" rel="noopener"' : "";
  const variantClass = safeVariant ? ` dn-cta--${safeVariant}` : "";
  const noBodyClass = bodyMarkup ? "" : " dn-cta--no-body";
  const previewLabel = safeLabel
    ? `<p class="dn-cta-preview-label">${safeLabel}</p>`
    : "";

  // Keep the generated fragment on one line. Markdown treats indented tags
  // nested under an inline HTML element as a code block; a compact fragment
  // guarantees that the CTA remains real HTML after remark parsing.
  return `<div class="dn-cta-preview">${previewLabel}<aside class="dn-cta${variantClass}${noBodyClass}"><span class="dn-cta-mark" aria-hidden="true">D</span>${bodyMarkup}<div class="dn-cta-offer"><p class="dn-cta-title">${safeTitle}</p><a class="dn-cta-action" href="${safeUrl}"${linkAttrs}>${safeButton}<span class="dn-cta-arrow" aria-hidden="true">→</span></a></div></aside></div>`;
}

// ============================================
// Block tag render functions
// ============================================

const CALLOUT_DEFAULTS: Record<string, string> = {
  tip: "提示",
  info: "補充說明",
  warning: "注意事項",
  error: "錯誤",
};

/** Convert basic inline markdown syntax to HTML for use inside rendered blocks */
function renderInlineMarkdown(text: string): string {
  // Process line by line: blank lines become paragraph breaks
  const lines = text.split("\n");
  const paragraphs: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.trim() === "") {
      if (current.length > 0) {
        paragraphs.push(current.join("<br>"));
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) paragraphs.push(current.join("<br>"));

  const renderParagraph = (p: string): string => {
    // **bold**
    p = p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // *italic*
    p = p.replace(/\*(.+?)\*/g, "<em>$1</em>");
    // `code`
    p = p.replace(/`([^`]+)`/g, "<code>$1</code>");
    // [text](url)
    p = p.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      if (url.startsWith('javascript:')) return escapeHtml(text);
      return `<a href="${escapeHtml(url)}">${text}</a>`;
    });
    return p;
  };

  if (paragraphs.length <= 1) {
    return renderParagraph(paragraphs[0] || "");
  }
  return paragraphs.map((p) => `<p>${renderParagraph(p)}</p>`).join("\n");
}

export function renderCallout(type: string, title: string, content: string): string {
  const validTypes = ["tip", "info", "warning", "error"];
  if (!validTypes.includes(type)) type = "tip";
  if (!title) title = CALLOUT_DEFAULTS[type] || CALLOUT_DEFAULTS.tip;

  return `<div class="dn-note dn-note-${type}">
  <div class="dn-note-title">${title}</div>
  <div class="dn-note-content">${renderInlineMarkdown(content)}</div>
</div>`;
}

export function renderTerm(definition: string, text: string): string {
  const escapedDef = definition
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const escapedText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<span class="term-tooltip" data-def="${escapedDef}">${escapedText}<span class="term-icon"></span></span>`;
}

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export function renderFaq(items: FaqItem[]): string {
  let html = '<div class="faq-container">\n';

  const hasCategories = items.some((item) => item.category);
  if (hasCategories) {
    const grouped: Record<string, FaqItem[]> = {};
    items.forEach((item) => {
      const cat = item.category || "其他";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });
    Object.entries(grouped).forEach(([category, catItems]) => {
      html += `<div class="faq-category"><h3 class="faq-category-title">${category}</h3>\n`;
      html += renderFaqItems(catItems);
      html += "</div>\n";
    });
  } else {
    html += renderFaqItems(items);
  }

  html += "</div>\n";
  html += getFaqScript();
  return html;
}

function renderFaqItems(items: FaqItem[]): string {
  let html = "";
  items.forEach((item, i) => {
    const id = `faq-${Date.now()}-${i}`;
    html += `<div class="faq-item">
  <div class="faq-question" data-faq-id="${id}">
    <span class="faq-icon">❓</span>
    <span class="faq-question-text">${item.question}</span>
    <span class="faq-toggle"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
  </div>
  <div class="faq-answer" id="${id}">
    <div class="faq-answer-content">
      <div class="faq-answer-text">${item.answer}</div>
    </div>
  </div>
</div>\n`;
  });
  return html;
}

function getFaqScript(): string {
  return `<script>
(function() {
  function initFaq() {
    document.querySelectorAll('.faq-question').forEach(function(q) {
      if (q.dataset.faqBound) return;
      q.dataset.faqBound = '1';
      q.addEventListener('click', function() {
        var id = this.getAttribute('data-faq-id');
        var answer = document.getElementById(id);
        var item = this.closest('.faq-item');
        if (item.classList.contains('active')) {
          item.classList.remove('active');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaq);
  } else {
    initFaq();
  }
  document.addEventListener('astro:page-load', initFaq);
})();
</script>`;
}

interface DataTableOptions {
  style: string;
  align: string;
  highlightCols: number[];
  color: string;
}

export function renderDataTable(data: Record<string, string>[], options: DataTableOptions): string {
  const { style, align, highlightCols, color } = options;
  if (!Array.isArray(data) || data.length === 0) return "";

  const columns = Object.keys(data[0]);
  let alignClass = "";
  let customAligns: string[] | null = null;

  if (["auto", "left", "center"].includes(align)) {
    alignClass = `data-table--align-${align}`;
  } else if (align.includes(",")) {
    customAligns = align.split(",").map((a) => {
      const t = a.trim().toLowerCase();
      if (t === "l" || t === "left") return "left";
      if (t === "r" || t === "right") return "right";
      return "center";
    });
  } else {
    alignClass = "data-table--align-auto";
  }

  let html = '<div class="data-table-wrapper">\n';
  html += `<table class="data-table data-table--${style}${alignClass ? " " + alignClass : ""}">\n`;
  html += "  <thead>\n    <tr>\n";
  columns.forEach((col, i) => {
    const s = customAligns?.[i] ? ` style="text-align: ${customAligns[i]}"` : "";
    html += `      <th${s}>${col}</th>\n`;
  });
  html += "    </tr>\n  </thead>\n  <tbody>\n";
  data.forEach((row) => {
    html += "    <tr>\n";
    columns.forEach((col, i) => {
      const colIdx = i + 1;
      const isHL = highlightCols.includes(colIdx);
      let cls = "";
      if (isHL) cls = color === "secondary" ? "data-table-emphasis data-table-emphasis--secondary" : "data-table-emphasis";
      const s = customAligns?.[i] ? ` style="text-align: ${customAligns[i]}"` : "";
      const clsAttr = cls ? ` class="${cls}"` : "";
      html += `      <td${clsAttr}${s}>${row[col] ?? ""}</td>\n`;
    });
    html += "    </tr>\n";
  });
  html += "  </tbody>\n</table>\n</div>";
  return html;
}

export function renderQuickNav(items: { anchor: string; text: string; desc?: string }[]): string {
  let html = '<nav class="quick-nav">\n  <strong class="nav-heading">本文目錄</strong>\n  <ul class="nav-list">\n';
  items.forEach((item) => {
    html += `    <li class="nav-item">\n      <a href="#${escapeHtml(item.anchor)}" class="nav-link">\n        <span class="nav-title">${escapeHtml(item.text)}</span>`;
    if (item.desc) html += `\n        <span class="nav-desc">${escapeHtml(item.desc)}</span>`;
    html += "\n      </a>\n    </li>\n";
  });
  html += "  </ul>\n</nav>";
  return html;
}

export function renderArticleCard(url: string, title: string, previewText: string, thumbnail: string): string {
  const safeUrl = escapeHtml(url);
  const safeTitle = escapeHtml(title);
  const safePreview = escapeHtml(previewText);
  const safeThumb = escapeHtml(thumbnail);
  return `<div class="article-card">
  <a href="${safeUrl}" class="article-card-link">
    <div class="article-card-content">
      <div class="article-card-text">
        <div class="article-card-title">${safeTitle}</div>
        ${previewText ? `<p class="article-card-preview">${safePreview}</p>` : ""}
      </div>
      ${thumbnail ? `<div class="article-card-image"><img src="${safeThumb}" alt="${safeTitle}"></div>` : ""}
    </div>
  </a>
</div>`;
}

export function renderTemplateCard(
  url: string,
  id: string,
  title: string,
  description: string,
  thumbnail: string,
  tags: string[],
  nodeCount: string,
  updatedAt: string
): string {
  const tagsHtml = tags.map((t) => `<span class="template-tag">${escapeHtml(t)}</span>`).join("");
  const href = escapeHtml(url || `/tools/n8n_template/model-detail.html?model=${id}`);
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeThumb = escapeHtml(thumbnail);
  return `<div class="template-card">
  <a href="${href}" class="template-card-link">
    <div class="template-card-content">
      <div class="template-card-text">
        <div class="template-card-title">${safeTitle}</div>
        ${description ? `<p class="template-card-description">${safeDesc}</p>` : ""}
        ${tags.length ? `<div class="template-card-tags">${tagsHtml}</div>` : ""}
        <div class="template-card-meta">
          ${nodeCount ? `<span>${escapeHtml(nodeCount)} 個節點</span>` : ""}
          ${updatedAt ? `<span>更新於 ${escapeHtml(updatedAt)}</span>` : ""}
        </div>
      </div>
      ${thumbnail ? `<div class="template-card-image"><img src="${safeThumb}" alt="${safeTitle}"></div>` : ""}
    </div>
  </a>
</div>`;
}

// ============================================
// Parser helpers
// ============================================

/** Parse key="value" or key='value' or key=value attribute from args string */
function parseAttr(argsStr: string, key: string): string {
  // Match key="value" or key='value'
  const quotedMatch = argsStr.match(new RegExp(`${key}=["']([^"']*)["']`));
  if (quotedMatch) return quotedMatch[1];
  // Match key=value (no quotes, until space or end)
  const unquotedMatch = argsStr.match(new RegExp(`${key}=([^\\s%]+)`));
  if (unquotedMatch) return unquotedMatch[1];
  return "";
}

/** Parse Hexo's key=value arguments, including unquoted values with spaces. */
function parseTagArg(argsStr: string, key: string): string {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const keyPattern = `(?:^|\\s)${escapedKey}\\s*=\\s*`;
  const quotedMatch =
    argsStr.match(new RegExp(`${keyPattern}"([^"]*)"`)) ||
    argsStr.match(new RegExp(`${keyPattern}'([^']*)'`));
  if (quotedMatch) return quotedMatch[1];

  const keyMatch = new RegExp(keyPattern).exec(argsStr);
  if (!keyMatch) return "";

  const value = argsStr.slice(keyMatch.index + keyMatch[0].length);
  const nextArgument = value.search(
    /(?:^|\s+)[A-Za-z][A-Za-z0-9_-]*\s*=\s*/
  );
  return (nextArgument === -1 ? value : value.slice(0, nextArgument)).trim();
}

/** Parse {% tag "quoted arg" arg2 %} with quote support */
function parseQuotedArgs(argsStr: string): { altText: string; imageSrc: string; className: string } {
  const quoteMatch = argsStr.match(/^["']([^"']+)["']\s+(.+)$/);
  if (quoteMatch) {
    const remaining = quoteMatch[2].trim().split(/\s+/);
    return { altText: quoteMatch[1], imageSrc: remaining[0] || "", className: remaining[1] || "" };
  }
  const parts = argsStr.trim().split(/\s+/);
  return { altText: parts[0] || "", imageSrc: parts[1] || "", className: parts[2] || "" };
}

/** Process a single line looking for inline {% tag %} */
function processInlineTags(text: string, postSlug: string = ""): string | null {
  // Image tags (all variants)
  const imageTagRe =
    /\{%\s*(darrellImageCover|darrellImage800Alt|darrellImage800|darrellImageh800|darrellImage|darrellOnlyImage)\s+(.*?)\s*%\}/g;

  let result = text;
  let hasMatch = false;

  result = result.replace(imageTagRe, (_, tagName, argsStr) => {
    hasMatch = true;
    const parsed = parseQuotedArgs(argsStr);
    const isCover = tagName === "darrellImageCover";
    const defaultClass =
      tagName === "darrellImage800" || tagName === "darrellImage800Alt"
        ? "max-800"
        : tagName === "darrellImageh800"
          ? "max-800h"
          : tagName === "darrellImageCover"
            ? "max-1024"
            : "max-1024";
    const className = parsed.className || defaultClass;
    return renderImage(parsed.altText, parsed.imageSrc, className, isCover, postSlug);
  });

  // Video tags
  const videoTagRe =
    /\{%\s*(darrellVideoSimple|darrellVideoGradient|darrellVideoLightbox|darrellVideo|video)\s+(.*?)\s*%\}/g;
  result = result.replace(videoTagRe, (_, tagName, argsStr) => {
    hasMatch = true;
    if (tagName === "video") {
      const src = argsStr.trim();
      return src
        ? `<video src="${escapeHtml(src)}" preload="metadata" controls playsinline poster="">Sorry, your browser does not support the video tag.</video>`
        : "";
    }
    const parts = argsStr.trim().split(/\s+/);
    return renderVideoSimple(parts[0] || "", parts[1] || "", parts[2] || "max-800");
  });

  return hasMatch ? result : null;
}

/** Process inline tags in raw source text (before remark parsing).
 * This prevents remark from auto-linking URLs inside {% %} tags.
 * Also ensures generated HTML blocks have blank lines around them
 * so remark treats them as block-level elements. */
function processInlineTagsInSource(text: string, postSlug: string = ""): string {
  const lines = text.split("\n");
  const result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const processed = processInlineTags(lines[i], postSlug);
    if (processed !== null) {
      // Ensure blank line before HTML block if previous line is non-empty
      if (result.length > 0 && result[result.length - 1].trim() !== "") {
        result.push("");
      }
      result.push(processed);
      // Ensure blank line after HTML block if next line is non-empty
      if (i + 1 < lines.length && lines[i + 1].trim() !== "") {
        result.push("");
      }
    } else {
      result.push(lines[i]);
    }
  }
  return result.join("\n");
}

/** Process block tags: {% tag %}...{% endtag %} spanning multiple lines */
function processBlockTags(fullText: string): string {
  let result = fullText;

  // CTA card: {% ctaCard title="..." url="..." ... %}...{% endctaCard %}
  result = result.replace(
    /\{%\s*ctaCard\s*(.*?)\s*%\}([\s\S]*?)\{%\s*endctaCard\s*%\}/g,
    (_, argsStr, body) =>
      renderCtaCard(
        parseTagArg(argsStr, "title"),
        parseTagArg(argsStr, "url"),
        parseTagArg(argsStr, "button") || "立即預約",
        parseTagArg(argsStr, "variant"),
        parseTagArg(argsStr, "label"),
        body
      )
  );

  // Callout: {% callout type %} ... {% endcallout %}
  result = result.replace(
    /\{%\s*callout\s+(.*?)\s*%\}([\s\S]*?)\{%\s*endcallout\s*%\}/g,
    (_, argsStr, body) => {
      let type = "tip";
      let title = "";
      const typeMatch = argsStr.match(/type\s*=\s*["']?(\w+)["']?/);
      if (typeMatch) type = typeMatch[1];
      else {
        const simple = argsStr.trim().split(/\s+/)[0];
        if (["tip", "info", "warning", "error"].includes(simple)) type = simple;
      }
      const titleMatch = argsStr.match(/title\s*=\s*["']([^"']+)["']/) || argsStr.match(/title\s*=\s*(\S+)/);
      if (titleMatch) title = titleMatch[1];
      return renderCallout(type, title, body.trim());
    }
  );

  // Term: {% term def="..." %}text{% endterm %}
  result = result.replace(
    /\{%\s*term\s+(.*?)\s*%\}([\s\S]*?)\{%\s*endterm\s*%\}/g,
    (_, argsStr, body) => {
      let def = "";
      const defMatch = argsStr.match(/def\s*=\s*["']?(.+?)["']?\s*$/);
      if (defMatch) def = defMatch[1];
      else {
        // Hexo strips quotes: def=word1 word2 word3
        const defStart = argsStr.indexOf("def=");
        if (defStart !== -1) def = argsStr.slice(defStart + 4).replace(/^["']|["']$/g, "").trim();
      }
      return renderTerm(def, body.trim());
    }
  );

  // FAQ: {% faq %}JSON{% endfaq %}
  result = result.replace(
    /\{%\s*faq\s*%\}([\s\S]*?)\{%\s*endfaq\s*%\}/g,
    (_, body) => {
      try {
        const items = JSON.parse(body.trim());
        return renderFaq(items);
      } catch (e) {
        return `<!-- FAQ JSON Parse Error: ${(e as Error).message} -->`;
      }
    }
  );

  // DataTable: {% dataTable style="minimal" %}JSON{% enddataTable %}
  result = result.replace(
    /\{%\s*dataTable\s*(.*?)\s*%\}([\s\S]*?)\{%\s*enddataTable\s*%\}/g,
    (_, argsStr, body) => {
      try {
        const styleMatch = argsStr.match(/style\s*=\s*["']?(\w+)["']?/);
        const alignMatch = argsStr.match(/align\s*=\s*["']?([^"'\s]+)["']?/);
        const highlightMatch = argsStr.match(/highlight\s*=\s*["']?([\d,]+)["']?/);
        const colorMatch = argsStr.match(/color\s*=\s*["']?(\w+)["']?/);
        const data = JSON.parse(body.trim());
        return renderDataTable(data, {
          style: styleMatch?.[1] || "minimal",
          align: alignMatch?.[1] || "auto",
          highlightCols: highlightMatch ? highlightMatch[1].split(",").map(Number) : [],
          color: colorMatch?.[1] || "primary",
        });
      } catch (e) {
        return `<!-- dataTable Error: ${(e as Error).message} -->`;
      }
    }
  );

  // QuickNav: {% quickNav %}JSON{% endquickNav %}
  result = result.replace(
    /\{%\s*quickNav\s*%\}([\s\S]*?)\{%\s*endquickNav\s*%\}/g,
    (_, body) => {
      try {
        const items = JSON.parse(body.trim());
        return renderQuickNav(items);
      } catch (e) {
        return `<!-- QuickNav Error: ${(e as Error).message} -->`;
      }
    }
  );

  // ArticleCard: {% articleCard url="..." title="..." previewText="..." thumbnail="..." %}
  result = result.replace(
    /\{%\s*articleCard\s+([\s\S]*?)\s*%\}/g,
    (_, argsStr) => {
      const url = parseAttr(argsStr, "url");
      const title = parseAttr(argsStr, "title");
      const previewText = parseAttr(argsStr, "previewText");
      const thumbnail = parseAttr(argsStr, "thumbnail");
      return renderArticleCard(url, title, previewText, thumbnail);
    }
  );

  // TemplateCard: {% templateCard url="..." title="..." ... %}
  result = result.replace(
    /\{%\s*templateCard\s+([\s\S]*?)\s*%\}/g,
    (_, argsStr) => {
      const url = parseAttr(argsStr, "url");
      const id = parseAttr(argsStr, "id");
      const title = parseAttr(argsStr, "title");
      const desc = parseAttr(argsStr, "description");
      const thumb = parseAttr(argsStr, "thumbnail");
      const tagsStr = parseAttr(argsStr, "tags");
      const tags = tagsStr ? tagsStr.split(",").map((t: string) => t.trim()) : [];
      const nodeCount = parseAttr(argsStr, "nodeCount");
      const updatedAt = parseAttr(argsStr, "updatedAt");
      return renderTemplateCard(url, id, title, desc, thumb, tags, nodeCount, updatedAt);
    }
  );

  // Raw blocks: {% raw %}...{% endraw %} — strip tags, keep content
  result = result.replace(
    /\{%\s*raw\s*%\}([\s\S]*?)\{%\s*endraw\s*%\}/g,
    (_, body) => body
  );

  // Hexo legacy {% img %} tag
  result = result.replace(
    /\{%\s*img\s+(.*?)\s*%\}/g,
    (_, argsStr) => {
      const parts = argsStr.trim().split(/\s+/);
      const src = parts[0] || "";
      return `<img src="${src}" loading="lazy">`;
    }
  );

  return result;
}

// ============================================
// Remark plugin
// ============================================

/**
 * Preprocesses raw markdown source to replace block tags before remark parses the AST.
 * This must run before parsing so multi-line blocks (faq, dataTable, quickNav, callout)
 * are replaced in the source string rather than being split into separate paragraph nodes.
 */
export function preprocessMarkdownSource(source: string, postSlug: string = ""): string {
  // Strip front matter before processing
  const fmMatch = source.match(/^---[\s\S]*?---\n/);
  const frontMatter = fmMatch ? fmMatch[0] : "";
  const body = fmMatch ? source.slice(frontMatter.length) : source;

  // Process block tags first (faq, callout, dataTable, etc.)
  let processed = processBlockTags(body);
  // Process inline tags (images, videos) BEFORE remark parsing
  // so that URLs inside {% %} tags don't get auto-linked by remark
  processed = processInlineTagsInSource(processed, postSlug);
  return frontMatter + processed;
}

/**
 * Remark plugin that preprocesses the source string before the AST is built.
 * This handles block tags that span multiple lines (faq, dataTable, quickNav, callout).
 * Uses re-parse approach: preprocess file.value, then rebuild the AST.
 */
export const remarkHexoPreprocess: Plugin<[], Root> = function (this: any) {
  const processor = this;
  return function (tree: Root, file: any) {
    const src = String(file.value || "");
    if (!src.includes("{%")) return;

    // Derive post slug from file path for correct image URL resolution
    const filePath: string = file.history?.[0] || file.path || "";
    const postSlug = derivePostSlug(filePath);

    const processed = preprocessMarkdownSource(src, postSlug);
    if (processed === src) return;

    // Re-parse with preprocessed source and replace tree content
    const newTree = processor.parse(processed) as Root;
    // Replace all children in place
    tree.children = newTree.children;
  };
};

const remarkHexoTags: Plugin<[], Root> = () => {
  return (tree: Root, file: any) => {
    // Derive post slug from file path for correct image URL resolution
    const filePath: string = file?.history?.[0] || file?.path || "";
    const postSlug = derivePostSlug(filePath);

    // Process text nodes for inline tags
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || index === undefined) return;

      const processed = processInlineTags(node.value, postSlug);
      if (processed !== null) {
        // Replace text node with HTML node
        (parent.children as any)[index] = {
          type: "html",
          value: processed,
        } as Html;
      }
    });

    // Process paragraph nodes that might still contain block tags
    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      if (!parent || index === undefined) return;

      // Collect text content of this paragraph
      const textParts: string[] = [];
      node.children.forEach((child) => {
        if (child.type === "text") textParts.push(child.value);
        else if (child.type === "html") textParts.push(child.value);
      });
      const fullText = textParts.join("");

      // Check if it contains any {% %} tags
      if (fullText.includes("{%")) {
        const processed = processBlockTags(fullText);
        if (processed !== fullText) {
          (parent.children as any)[index] = { type: "html", value: processed } as Html;
        }
      }
    });

    // Also process html nodes that might contain tags
    visit(tree, "html", (node: Html) => {
      if (node.value.includes("{%")) {
        const processed = processBlockTags(node.value);
        const inlineProcessed = processInlineTags(processed, postSlug);
        node.value = inlineProcessed !== null ? inlineProcessed : processed;
      } else {
        const processed = processInlineTags(node.value, postSlug);
        if (processed !== null) {
          node.value = processed;
        }
      }
    });
  };
};

export default remarkHexoTags;
