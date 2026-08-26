#!/usr/bin/env python3
"""Audit a Darrell blog post against two comparable published baselines."""

from __future__ import annotations

import argparse
import json
import re
import shlex
import sys
from pathlib import Path


REQUIRED_FRONTMATTER = (
    "title",
    "tags",
    "categories",
    "page_type",
    "description",
    "bgImage",
    "pubDatetime",
)
NONEMPTY_FRONTMATTER = (
    "title",
    "page_type",
    "description",
    "bgImage",
    "pubDatetime",
)
# modDatetime 只有文章真的有實質更新時才寫，所以不列為必要欄位。
# 但一旦寫了就不能是空的，否則頁面會顯示空白的更新日期。
OPTIONAL_NONEMPTY_FRONTMATTER = ("modDatetime",)
DEPRECATED_FRONTMATTER = ("date", "updated", "modified")
JSON_TAGS = ("quickNav", "dataTable", "faq")
ASSET_TAGS = (
    "darrellImageCover",
    "darrellImage800Alt",
    "darrellImage800",
    "darrellImageh800",
    "darrellImage",
    "darrellOnlyImage",
)


class Audit:
    def __init__(self, allowed: dict[str, str]) -> None:
        self.allowed = allowed
        self.failures: list[tuple[str, str]] = []
        self.warnings: list[tuple[str, str]] = []
        self.passes: list[str] = []

    def fail(self, code: str, message: str, overridable: bool = False) -> None:
        if overridable and code in self.allowed:
            self.warnings.append((code, f"已核准偏差：{message}；原因：{self.allowed[code]}"))
            return
        self.failures.append((code, message))

    def passed(self, message: str) -> None:
        self.passes.append(message)

    def report(self) -> int:
        for code, message in self.failures:
            print(f"FAIL [{code}] {message}")
        for code, message in self.warnings:
            print(f"WARN [{code}] {message}")
        for message in self.passes:
            print(f"PASS {message}")
        print(
            f"SUMMARY failures={len(self.failures)} warnings={len(self.warnings)} "
            f"passes={len(self.passes)} status={'FAIL' if self.failures else 'PASS'}"
        )
        return 1 if self.failures else 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compare one formal Astro post with two fully-read comparable baselines."
    )
    parser.add_argument("target", type=Path)
    parser.add_argument("--baseline", action="append", type=Path, required=True)
    parser.add_argument("--phase", choices=("draft", "final"), default="draft")
    parser.add_argument(
        "--allow-deviation",
        action="append",
        default=[],
        metavar='CODE="reason"',
        help="Allow one user-approved baseline deviation. Integrity failures cannot be allowed.",
    )
    return parser.parse_args()


def parse_allowances(values: list[str]) -> dict[str, str]:
    allowed: dict[str, str] = {}
    for value in values:
        if "=" not in value:
            raise ValueError(f"偏差必須使用 CODE=reason：{value}")
        code, reason = value.split("=", 1)
        code = code.strip()
        reason = reason.strip().strip('"').strip("'")
        if not code or not reason:
            raise ValueError(f"偏差 code 與原因不可為空：{value}")
        allowed[code] = reason
    return allowed


def read_post(path: Path) -> tuple[str, dict[str, str], str, list[str]]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return text, {}, text, []
    try:
        end = next(i for i, line in enumerate(lines[1:], 1) if line.strip() == "---")
    except StopIteration:
        return text, {}, text, []

    raw_frontmatter = lines[1:end]
    frontmatter: dict[str, str] = {}
    for line in raw_frontmatter:
        match = re.match(r"^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$", line)
        if match:
            frontmatter[match.group(1)] = (match.group(2) or "").strip().strip('"').strip("'")
    body = "\n".join(lines[end + 1 :])
    return text, frontmatter, body, raw_frontmatter


def infer_repo_root(path: Path) -> Path | None:
    for parent in (path.parent, *path.parents):
        if (parent / "src" / "data" / "blog").is_dir():
            return parent
    return None


def frontmatter_list_style(lines: list[str], field: str) -> str:
    for index, line in enumerate(lines):
        match = re.match(rf"^{re.escape(field)}:\s*(.*)$", line)
        if not match:
            continue
        value = match.group(1).strip()
        if value.startswith("["):
            return "inline"
        for following in lines[index + 1 :]:
            if re.match(r"^[A-Za-z][A-Za-z0-9_-]*:", following):
                break
            if re.match(r"^\s+-\s+", following):
                return "block"
        return "empty"
    return "missing"


def json_blocks(body: str, tag: str) -> list[str]:
    pattern = re.compile(
        rf"{{%\s*{re.escape(tag)}(?:\s+[^%]*?)?\s*%}}(.*?){{%\s*end{re.escape(tag)}\s*%}}",
        re.DOTALL,
    )
    return [match.group(1).strip() for match in pattern.finditer(body)]


def json_is_multiline(block: str) -> bool:
    return len([line for line in block.splitlines() if line.strip()]) > 1


def parse_json_blocks(body: str, tag: str, audit: Audit, label: str) -> list[object]:
    parsed: list[object] = []
    for index, block in enumerate(json_blocks(body, tag), 1):
        try:
            parsed.append(json.loads(block))
        except json.JSONDecodeError as error:
            audit.fail(
                f"INVALID_{tag.upper()}_JSON",
                f"{label} 的 {tag} 第 {index} 個區塊不是有效 JSON：{error.msg}",
            )
    return parsed


def has_tag(body: str, tag: str) -> bool:
    return bool(re.search(rf"{{%\s*{re.escape(tag)}(?:\s|%}})", body))


def heading_texts(body: str) -> list[str]:
    markdown = re.findall(r"^#{2,3}\s+(.+?)\s*$", body, re.MULTILINE)
    html = re.findall(r"<h[23]\b[^>]*>(.*?)</h[23]>", body, re.DOTALL | re.IGNORECASE)
    return [re.sub(r"<[^>]+>", "", item).strip() for item in markdown + html]


def has_related_section(body: str) -> bool:
    return any(re.search(r"相關文章|相關推薦|延伸閱讀", heading) for heading in heading_texts(body))


def has_sources_section(body: str) -> bool:
    return any(re.search(r"參考來源|參考資料|官方資料參考|資料來源", heading) for heading in heading_texts(body))


def extract_ids(body: str) -> set[str]:
    return set(re.findall(r"\bid=[\"']([^\"']+)[\"']", body))


def asset_filenames(body: str) -> list[tuple[str, str]]:
    names: list[tuple[str, str]] = []
    tags = "|".join(map(re.escape, ASSET_TAGS))
    for match in re.finditer(rf"{{%\s*({tags})\s+(.+?)\s*%}}", body):
        tag, raw_args = match.groups()
        try:
            args = shlex.split(raw_args)
        except ValueError:
            continue
        if not args:
            continue
        filename = args[-2] if len(args) >= 2 and args[-1].startswith("max-") else args[-1]
        names.append((tag, filename))
    return names


def check_target_integrity(
    target: Path,
    text: str,
    frontmatter: dict[str, str],
    body: str,
    raw_frontmatter: list[str],
    audit: Audit,
) -> None:
    if not raw_frontmatter:
        audit.fail("FRONTMATTER", "目標文章缺少完整的 --- front matter")
        return

    missing = [field for field in REQUIRED_FRONTMATTER if field not in frontmatter]
    if missing:
        audit.fail("FRONTMATTER_FIELDS", f"缺少必要欄位：{', '.join(missing)}")
    else:
        audit.passed("必要 front matter 欄位完整")

    empty = [field for field in NONEMPTY_FRONTMATTER if not frontmatter.get(field)]
    if empty:
        audit.fail("EMPTY_FRONTMATTER_FIELDS", f"必要欄位不可為空：{', '.join(empty)}")

    empty_optional = [
        field
        for field in OPTIONAL_NONEMPTY_FRONTMATTER
        if field in frontmatter and not frontmatter.get(field)
    ]
    if empty_optional:
        audit.fail(
            "EMPTY_FRONTMATTER_FIELDS",
            f"欄位有寫就不可為空：{', '.join(empty_optional)}",
        )

    deprecated = [field for field in DEPRECATED_FRONTMATTER if field in frontmatter]
    if deprecated:
        audit.fail(
            "DEPRECATED_FRONTMATTER",
            f"欄位已停用：{', '.join(deprecated)}；發佈時間改用 pubDatetime，實質更新時間改用 modDatetime",
        )

    if "——" in text:
        audit.fail("EM_DASH", "文章含有禁止的 em dash「——」")
    if "Screenshot_" in text:
        audit.fail("SCREENSHOT_NAME", "文章仍引用系統自動產生的 Screenshot_ 檔名")

    parsed: dict[str, list[object]] = {}
    for tag in JSON_TAGS:
        parsed[tag] = parse_json_blocks(body, tag, audit, "目標文章")

    ids = extract_ids(body)
    invalid_ids = sorted(item for item in ids if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", item))
    if invalid_ids:
        audit.fail("INVALID_ANCHOR_ID", f"anchor id 不是小寫連字號格式：{', '.join(invalid_ids)}")

    quicknav_anchors: list[str] = []
    for value in parsed["quickNav"]:
        if not isinstance(value, list):
            audit.fail("QUICKNAV_SHAPE", "quickNav JSON 必須是陣列")
            continue
        for item in value:
            if not isinstance(item, dict) or not isinstance(item.get("anchor"), str):
                audit.fail("QUICKNAV_SHAPE", "quickNav 每一項都必須有字串 anchor")
                continue
            quicknav_anchors.append(item["anchor"])
    missing_anchors = sorted(set(quicknav_anchors) - ids)
    if missing_anchors:
        audit.fail("QUICKNAV_ANCHOR", f"QuickNav 找不到對應 id：{', '.join(missing_anchors)}")
    elif quicknav_anchors:
        audit.passed("QuickNav anchors 全部有對應 id")

    asset_dir = target.with_suffix("")
    missing_assets: list[str] = []
    bg_image = frontmatter.get("bgImage", "")
    if bg_image and not re.match(r"https?://", bg_image) and not (asset_dir / bg_image).is_file():
        missing_assets.append(bg_image)
    for _, filename in asset_filenames(body):
        if re.match(r"https?://", filename):
            continue
        if not (asset_dir / filename).is_file():
            missing_assets.append(filename)
    if missing_assets:
        audit.fail("MISSING_ASSET", f"文章專屬資料夾缺少圖片：{', '.join(sorted(set(missing_assets)))}")
    else:
        audit.passed("front matter 與正文引用圖片皆存在")


def check_baseline_consensus(
    target_frontmatter_lines: list[str],
    target_body: str,
    baselines: list[tuple[Path, dict[str, str], str, list[str]]],
    audit: Audit,
) -> None:
    for field in ("tags", "categories"):
        baseline_styles = [frontmatter_list_style(lines, field) for _, _, _, lines in baselines]
        if len(set(baseline_styles)) == 1:
            expected = baseline_styles[0]
            actual = frontmatter_list_style(target_frontmatter_lines, field)
            if expected in ("inline", "block") and actual != expected:
                audit.fail(
                    f"FM_{field.upper()}_STYLE",
                    f"兩篇基準的 {field} 都使用 {expected} list，目標文章使用 {actual}",
                    overridable=True,
                )

    for tag in JSON_TAGS:
        baseline_blocks = [json_blocks(body, tag) for _, _, body, _ in baselines]
        if not all(blocks for blocks in baseline_blocks):
            continue
        baseline_multiline = all(json_is_multiline(block) for blocks in baseline_blocks for block in blocks)
        target_blocks = json_blocks(target_body, tag)
        if baseline_multiline and target_blocks and any(not json_is_multiline(block) for block in target_blocks):
            audit.fail(
                f"MINIFIED_{tag.upper()}",
                f"兩篇基準的 {tag} JSON 都是多行排版，目標文章含單行壓縮區塊",
                overridable=True,
            )

    baseline_cover = all(has_tag(body, "darrellImageCover") for _, _, body, _ in baselines)
    if baseline_cover and not has_tag(target_body, "darrellImageCover"):
        audit.fail(
            "MISSING_COVER",
            "兩篇基準正文都有 darrellImageCover，目標文章沒有",
            overridable=True,
        )

    baseline_inline_style = any(re.search(r"<style\b", body, re.IGNORECASE) for _, _, body, _ in baselines)
    if re.search(r"<style\b", target_body, re.IGNORECASE) and not baseline_inline_style:
        audit.fail(
            "INLINE_STYLE",
            "目標文章新增了兩篇基準都沒有的文章內 <style>",
            overridable=True,
        )

    if all(has_related_section(body) for _, _, body, _ in baselines) and not has_related_section(target_body):
        audit.fail(
            "MISSING_RELATED",
            "兩篇基準都有相關文章／延伸閱讀，目標文章沒有",
            overridable=True,
        )

    if all(has_sources_section(body) for _, _, body, _ in baselines) and not has_sources_section(target_body):
        audit.fail(
            "MISSING_SOURCES",
            "兩篇基準都有參考來源區塊，目標文章沒有",
            overridable=True,
        )


def check_final_freshness(
    repo_root: Path | None,
    target: Path,
    audit: Audit,
) -> None:
    if repo_root is None:
        audit.fail("REPO_ROOT", "無法從目標文章推導包含 src/data/blog 的 repo root")
        return

    blog_root = repo_root / "src" / "data" / "blog"
    try:
        relative = target.relative_to(blog_root).with_suffix("")
    except ValueError:
        audit.fail("POST_PATH", f"目標文章不在 {blog_root}：{target}")
        return

    path_parts = list(relative.parts)
    if path_parts and path_parts[-1] == "index":
        path_parts.pop()
    if not path_parts:
        audit.fail("POST_PATH", f"目標文章檔名無法推導網址：{target}")
        return

    output_dir = repo_root / "dist" / Path(*path_parts)
    artifacts = (output_dir / "index.html", output_dir / "index.md")
    for artifact in artifacts:
        if not artifact.is_file():
            audit.fail("MISSING_RENDER", f"final phase 缺少建置產物：{artifact}")
            continue
        if artifact.stat().st_mtime < target.stat().st_mtime:
            audit.fail("STALE_RENDER", f"建置產物比來源文章舊：{artifact}")
        else:
            audit.passed(f"建置產物 freshness 正常：{artifact.name}")


def main() -> int:
    args = parse_args()
    try:
        allowed = parse_allowances(args.allow_deviation)
    except ValueError as error:
        print(f"ERROR {error}", file=sys.stderr)
        return 2

    audit = Audit(allowed)
    target = args.target.expanduser().resolve()
    baseline_paths = [path.expanduser().resolve() for path in args.baseline]

    if len(baseline_paths) != 2:
        audit.fail("BASELINE_COUNT", f"必須剛好提供兩篇基準文章，目前是 {len(baseline_paths)} 篇")
    if len(set(baseline_paths)) != len(baseline_paths):
        audit.fail("BASELINE_DUPLICATE", "兩篇基準文章不可重複")
    if target in baseline_paths:
        audit.fail("BASELINE_TARGET", "目標文章不能拿自己當基準")
    if not target.is_file():
        audit.fail("TARGET_MISSING", f"目標文章不存在：{target}")
        return audit.report()

    missing_baselines = [path for path in baseline_paths if not path.is_file()]
    if missing_baselines:
        audit.fail("BASELINE_MISSING", f"基準文章不存在：{', '.join(map(str, missing_baselines))}")
        return audit.report()

    target_text, target_frontmatter, target_body, target_frontmatter_lines = read_post(target)
    baselines: list[tuple[Path, dict[str, str], str, list[str]]] = []
    for path in baseline_paths:
        _, frontmatter, body, frontmatter_lines = read_post(path)
        baselines.append((path, frontmatter, body, frontmatter_lines))
        print(f"BASELINE {path}")

        if not frontmatter_lines:
            audit.fail("BASELINE_FRONTMATTER", f"基準文章缺少完整 front matter：{path}")
            continue
        missing = [field for field in REQUIRED_FRONTMATTER if field not in frontmatter]
        if missing:
            audit.fail(
                "BASELINE_FRONTMATTER",
                f"基準文章缺少必要欄位 {', '.join(missing)}：{path}",
            )
        empty = [field for field in NONEMPTY_FRONTMATTER if not frontmatter.get(field)]
        if empty:
            audit.fail(
                "BASELINE_FRONTMATTER",
                f"基準文章必要欄位為空 {', '.join(empty)}：{path}",
            )

    check_target_integrity(
        target,
        target_text,
        target_frontmatter,
        target_body,
        target_frontmatter_lines,
        audit,
    )
    if len(baselines) == 2:
        check_baseline_consensus(target_frontmatter_lines, target_body, baselines, audit)

    if args.phase == "final":
        check_final_freshness(infer_repo_root(target), target, audit)

    return audit.report()


if __name__ == "__main__":
    raise SystemExit(main())
