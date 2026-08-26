/**
 * Copy the local assets that each migrated article actually references.
 *
 * Article assets are served beside the article at /{slug}/{asset}.  The
 * source tree contains generated variants and files that are not referenced
 * by the markdown, so extension-based copying is intentionally avoided.
 *
 * Run: npx tsx scripts/copy-assets-to-public.ts
 */

import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.resolve(import.meta.dirname, "../src/data/blog");
const PUBLIC_DIR = path.resolve(import.meta.dirname, "../public");
const LEGACY_PUBLIC_POSTS_DIR = path.join(PUBLIC_DIR, "posts");
const MANIFEST_PATH = path.join(PUBLIC_DIR, ".astro-blog-article-assets.manifest");
const LEGACY_MANIFEST_PATH = path.join(PUBLIC_DIR, ".astro-blog-article-assets.json");
const HEXO_POSTS_DIR = "/Users/darrellwang/Darrell/code/blog/source/_posts";

// These are manually maintained independent pages/assets.  Article output
// reconciliation must never claim or remove them.
const PROTECTED_PUBLIC_DIRS = new Set([
  "images",
  "links",
  "n8n-expert",
  "n8n-service",
  "pagefind",
]);

type ArticleSource = {
  markdownPath: string;
  slug: string;
  assetDir: string;
};

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function collectMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(entryPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(entryPath);
    }
  }
  return files;
}

function articleSource(markdownPath: string): ArticleSource {
  const relativePath = toPosix(path.relative(BLOG_DIR, markdownPath));
  let slug = relativePath.replace(/\.md$/i, "");
  if (slug.endsWith("/index")) slug = slug.slice(0, -"/index".length);

  const basename = path.basename(markdownPath, path.extname(markdownPath));
  const assetDir = basename.toLowerCase() === "index"
    ? path.dirname(markdownPath)
    : path.join(path.dirname(markdownPath), basename);

  return { markdownPath, slug, assetDir };
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function decodeReference(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Resolve a markdown reference against its article asset directory.
 * Returns a path relative to that directory only when the referenced file
 * exists and cannot escape the article directory.
 */
function resolveLocalAsset(
  rawReference: string,
  article: ArticleSource
): string | null {
  let reference = stripQuotes(rawReference)
    .replace(/^<|>$/g, "")
    .trim();
  if (!reference) return null;

  // Query strings and fragments are URL metadata, not part of the filename.
  reference = reference.split(/[?#]/, 1)[0];
  reference = decodeReference(reference);

  // Do not turn external resources, data URIs, anchors, or protocol-relative
  // URLs into local copies.
  if (
    reference.startsWith("#") ||
    reference.startsWith("data:") ||
    reference.startsWith("//") ||
    /^[a-z][a-z\d+.-]*:/i.test(reference)
  ) {
    return null;
  }

  reference = reference.replace(/^\.\//, "");

  // Accept old absolute article references while writing only the new
  // root-level output.  `/posts/` is never emitted by this script.
  const normalized = reference.replace(/^\/+/, "");
  const slugPrefix = `${toPosix(article.slug)}/`;
  const legacyPrefix = `posts/${slugPrefix}`;
  if (normalized.startsWith(legacyPrefix)) {
    reference = normalized.slice(legacyPrefix.length);
  } else if (normalized.startsWith(slugPrefix)) {
    reference = normalized.slice(slugPrefix.length);
  } else {
    reference = normalized;
  }

  // Hexo's include field names files under source/_css/, while migration
  // stores the referenced file beside the article.
  reference = reference.replace(/^_css\//, "");
  if (!reference) return null;

  const articleRoot = path.resolve(article.assetDir);
  const candidate = path.resolve(articleRoot, reference);
  if (candidate !== articleRoot && !candidate.startsWith(`${articleRoot}${path.sep}`)) {
    return null;
  }
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) return null;

  return toPosix(path.relative(articleRoot, candidate));
}

function extractReferences(source: string): string[] {
  const references: string[] = [];
  const add = (value: string) => references.push(value);

  // Markdown images and links (local file links are copied if present).
  const markdownReference = /!?(?:\[[^\]]*\])\(\s*(?:<([^>]+)>|([^\s)]+))/g;
  for (const match of source.matchAll(markdownReference)) {
    add(match[1] || match[2]);
  }

  // HTML resources, including the article-specific CSS links.
  const htmlReference = /\b(?:src|href|data-src|poster)=\s*["']([^"']+)["']/gi;
  for (const match of source.matchAll(htmlReference)) add(match[1]);

  // CSS background URLs embedded in article HTML/style blocks.
  const cssReference = /url\(\s*["']?([^\)"']+)["']?\s*\)/gi;
  for (const match of source.matchAll(cssReference)) add(match[1]);

  // Hexo image/video tags.  Checking every token against the article asset
  // directory handles quoted alt text without assuming a fixed argument
  // position for every legacy tag variant.
  const tagReference =
    /\{%\s*(?:darrellImage\w*|darrellVideo\w*|img)\s+([\s\S]*?)\s*%\}/gi;
  for (const match of source.matchAll(tagReference)) {
    const tokens = match[1].match(/"[^"]*"|'[^']*'|[^\s]+/g) ?? [];
    tokens.forEach(add);
  }

  // Cover/OG filenames are frontmatter values and can exist without a body
  // image tag.
  const imageFrontmatter = /^\s*(?:bgImage|ogImage):\s*(.+?)\s*$/gim;
  for (const match of source.matchAll(imageFrontmatter)) add(match[1]);

  // Include lists can point at a migrated article-local stylesheet.
  const includeFrontmatter = /^\s*include:\s*([\s\S]*?)(?=^\s*---\s*$|^\s*[a-zA-Z][\w-]*:\s*|$)/gim;
  for (const match of source.matchAll(includeFrontmatter)) {
    for (const line of match[1].split(/\r?\n/)) {
      const item = line.match(/^\s*-\s*(.+?)\s*$/);
      if (item) add(item[1]);
    }
  }

  return references;
}

function copyArticleAssets(article: ArticleSource): number {
  if (!fs.existsSync(article.assetDir)) return 0;

  const source = fs.readFileSync(article.markdownPath, "utf-8");
  const relativeAssets = new Set<string>();
  for (const reference of extractReferences(source)) {
    const relativeAsset = resolveLocalAsset(reference, article);
    if (relativeAsset) relativeAssets.add(relativeAsset);
  }

  if (relativeAssets.size === 0) return 0;

  const destinationDir = path.join(PUBLIC_DIR, article.slug);
  let count = 0;
  for (const relativeAsset of relativeAssets) {
    const sourcePath = path.join(article.assetDir, relativeAsset);
    const destinationPath = path.join(destinationDir, relativeAsset);
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.copyFileSync(sourcePath, destinationPath);
    count++;
  }
  return count;
}

function isSafeManagedSlug(slug: string): boolean {
  const normalized = toPosix(path.posix.normalize(slug));
  return (
    normalized === slug &&
    normalized !== "" &&
    !normalized.startsWith("../") &&
    !normalized.startsWith("/") &&
    !normalized.split("/").some(segment => segment === ".." || segment === ".") &&
    !PROTECTED_PUBLIC_DIRS.has(normalized.split("/")[0])
  );
}

function readManagedSlugs(): string[] {
  if (!fs.existsSync(MANIFEST_PATH)) return [];

  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string =>
      typeof value === "string" && isSafeManagedSlug(value)
    );
  } catch {
    // A malformed manifest must never broaden deletion scope.  Current article
    // slugs are still reconciled below, and the next successful run rewrites it.
    return [];
  }
}

function seedManagedSlugsFromHexoAssets(): string[] {
  if (!fs.existsSync(HEXO_POSTS_DIR)) return [];

  return fs.readdirSync(HEXO_POSTS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith("."))
    .map(entry => entry.name)
    .filter(isSafeManagedSlug);
}

function removeManagedOutput(slug: string): void {
  if (!isSafeManagedSlug(slug)) return;

  const target = path.resolve(PUBLIC_DIR, slug);
  if (!target.startsWith(`${PUBLIC_DIR}${path.sep}`)) return;
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function writeManagedSlugs(slugs: Iterable<string>): void {
  const managed = [...new Set([...slugs].filter(isSafeManagedSlug))].sort();
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(managed, null, 2)}\n`, "utf-8");
}

// `public/posts/` was entirely managed article output.  Remove it before
// copying so deleted articles and the old prefix cannot enter `dist/`.
if (fs.existsSync(LEGACY_PUBLIC_POSTS_DIR)) {
  fs.rmSync(LEGACY_PUBLIC_POSTS_DIR, { recursive: true, force: true });
}

const articles = collectMarkdownFiles(BLOG_DIR).map(articleSource);
const currentArticleSlugs = articles.map(article => article.slug);
const previousManagedSlugs = readManagedSlugs();

// The first implementation used a `.json` suffix, which is intentionally
// unignored for hand-authored public JSON.  Remove only that known generated
// marker while moving the state back under the ignored generated output tree.
if (fs.existsSync(LEGACY_MANIFEST_PATH)) {
  fs.rmSync(LEGACY_MANIFEST_PATH, { force: true });
}

// Rebuild the managed article output as a set.  On the first root-level run,
// seed from Hexo's article asset directories; subsequent runs use the manifest.
// This removes deleted articles and stale files without ever sweeping `public/`.
const managedSlugs = new Set([
  ...previousManagedSlugs,
  ...(previousManagedSlugs.length === 0 ? seedManagedSlugsFromHexoAssets() : []),
  ...currentArticleSlugs,
]);
for (const slug of managedSlugs) removeManagedOutput(slug);

let totalFiles = 0;
let articlesWithAssets = 0;

for (const article of articles) {
  const count = copyArticleAssets(article);
  if (count > 0) {
    articlesWithAssets++;
    totalFiles += count;
    console.log(`  ${article.slug}/ → public/${article.slug}/ (${count} referenced files)`);
  }
}

writeManagedSlugs(currentArticleSlugs);

console.log(
  `\nDone: ${totalFiles} referenced files copied across ${articlesWithAssets} article directories.`
);
