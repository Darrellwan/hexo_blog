/**
 * Finds internal links whose `#fragment` points at nothing.
 *
 * These are the links the site controls, so unlike an external deep link they
 * can simply be fixed. Runs over `dist/`, so it checks what actually ships,
 * including anchors written inside quickNav blocks and article cards.
 *
 *   npx tsx tests/verify-internal-anchors.ts
 */
import fs from "node:fs";
import path from "node:path";
import { SITE } from "../src/config";

const DIST_DIR = path.resolve(import.meta.dirname, "../dist");

const htmlFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });

/** `dist/foo/index.html` -> `/foo/`, `dist/foo.html` -> `/foo.html`. */
const urlOf = (file: string): string => {
  const relative = path.relative(DIST_DIR, file);
  return relative.endsWith("index.html")
    ? `/${relative.slice(0, -"index.html".length)}`
    : `/${relative}`;
};

const idsIn = (html: string): Set<string> =>
  new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));

const pages = new Map<string, Set<string>>();
const files = htmlFiles(DIST_DIR);
for (const file of files) {
  pages.set(urlOf(file), idsIn(fs.readFileSync(file, "utf-8")));
}

/** Strip the site origin so absolute self-links resolve like relative ones. */
const origin = new URL(SITE.website).origin;

/**
 * `href` values arrive HTML-escaped. `&#x26;` contains a literal `#`, so an
 * ordinary query string reads as a fragment until the entities are decoded.
 */
const decodeEntities = (value: string): string =>
  value
    .replace(/&#x26;|&#38;|&amp;/gi, "&")
    .replace(/&#x2F;|&#47;/gi, "/")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");

const normalise = (href: string, from: string): string | null => {
  let target = href;
  if (target.startsWith(origin)) target = target.slice(origin.length);
  if (target.startsWith("http://") || target.startsWith("https://")) return null;
  if (target.startsWith("#")) return from + target;
  if (!target.startsWith("/")) return null;
  return target;
};

let checked = 0;
const dead: string[] = [];

for (const file of files) {
  const from = urlOf(file);
  const html = fs.readFileSync(file, "utf-8");

  for (const match of html.matchAll(/href="([^"]*)"/g)) {
    const href = decodeEntities(match[1]);
    if (!href.includes("#")) continue;
    const resolved = normalise(href, from);
    if (resolved === null) continue;

    const hashIndex = resolved.indexOf("#");
    const fragment = decodeURIComponent(resolved.slice(hashIndex + 1));
    // `href="#"` is a deliberate no-op link, not a target.
    if (fragment === "") continue;
    const pageUrl = resolved.slice(0, hashIndex).split("?")[0] || "/";

    const targetIds = pages.get(pageUrl);
    checked += 1;
    if (!targetIds) {
      dead.push(`${from}\n    → ${pageUrl}#${fragment}  （頁面不存在）`);
    } else if (!targetIds.has(fragment)) {
      dead.push(`${from}\n    → ${pageUrl}#${fragment}  （錨點不存在）`);
    }
  }
}

console.log(`檢查 ${files.length} 頁、${checked} 個帶 # 的站內連結`);
console.log(`失效 ${dead.length} 個`);
if (dead.length) {
  console.log("\n失效連結：");
  for (const entry of [...new Set(dead)].sort()) console.log(`  ${entry}`);
  process.exitCode = 1;
}
