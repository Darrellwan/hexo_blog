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
const HEXO_POSTS_DIR =
  process.env.HEXO_POSTS_DIR ?? path.resolve(import.meta.dirname, "../../source/_posts");
const IMAGE_VARIANTS_PATH = path.resolve(
  import.meta.dirname,
  "../src/data/image_variants.json"
);

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

type ResolvedLocalAsset = {
  sourcePath: string;
  sourceRoot: string;
  relativeAsset: string;
  outputSlug: string;
  publicRelativePath: string;
};

type ImageVariant = {
  width: number;
  src: string;
};

type ImageVariants = Record<string, { webp?: ImageVariant[] }>;

function readImageVariants(): ImageVariants {
  if (!fs.existsSync(IMAGE_VARIANTS_PATH)) {
    throw new Error(
      `Missing ${IMAGE_VARIANTS_PATH}. Run scripts/migrate-frontmatter.ts first.`
    );
  }

  const parsed: unknown = JSON.parse(
    fs.readFileSync(IMAGE_VARIANTS_PATH, "utf-8")
  );
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Image variants must be a top-level object: ${IMAGE_VARIANTS_PATH}`);
  }
  return parsed as ImageVariants;
}

const IMAGE_VARIANTS = readImageVariants();

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

/** Resolve `/other-post/file.png` to the owning article's asset directory. */
function resolveAbsoluteArticleTarget(
  normalizedReference: string
): Pick<ResolvedLocalAsset, "sourceRoot" | "relativeAsset" | "outputSlug"> | null {
  const rootlessReference = normalizedReference.startsWith("posts/")
    ? normalizedReference.slice("posts/".length)
    : normalizedReference;
  const segments = rootlessReference.split("/").filter(Boolean);

  // Prefer the longest article slug so nested article paths remain valid.
  for (let segmentCount = segments.length - 1; segmentCount > 0; segmentCount--) {
    const candidateSlug = segments.slice(0, segmentCount).join("/");
    if (!isSafeManagedSlug(candidateSlug)) continue;

    const flatMarkdownPath = path.join(BLOG_DIR, `${candidateSlug}.md`);
    const indexMarkdownPath = path.join(BLOG_DIR, candidateSlug, "index.md");
    const markdownPath = fs.existsSync(flatMarkdownPath)
      ? flatMarkdownPath
      : fs.existsSync(indexMarkdownPath)
        ? indexMarkdownPath
        : null;
    if (!markdownPath) continue;

    const targetArticle = articleSource(markdownPath);
    return {
      sourceRoot: path.resolve(targetArticle.assetDir),
      relativeAsset: segments.slice(segmentCount).join("/"),
      outputSlug: targetArticle.slug,
    };
  }

  return null;
}

/**
 * Resolve a local reference to its source file and public destination.
 * Absolute article paths can point at another article's asset directory.
 */
function resolveLocalAsset(
  rawReference: string,
  article: ArticleSource
): ResolvedLocalAsset | null {
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

  const isAbsoluteReference = reference.startsWith("/");
  reference = reference.replace(/^\.\//, "");

  // Accept old absolute article references while writing only the new
  // root-level output.  `/posts/` is never emitted by this script.
  const normalized = reference.replace(/^\/+/, "");
  const slugPrefix = `${toPosix(article.slug)}/`;
  const legacyPrefix = `posts/${slugPrefix}`;
  let sourceRoot = path.resolve(article.assetDir);
  let outputSlug = article.slug;
  if (normalized.startsWith(legacyPrefix)) {
    reference = normalized.slice(legacyPrefix.length);
  } else if (normalized.startsWith(slugPrefix)) {
    reference = normalized.slice(slugPrefix.length);
  } else if (isAbsoluteReference) {
    const absoluteTarget = resolveAbsoluteArticleTarget(normalized);
    if (absoluteTarget) {
      sourceRoot = absoluteTarget.sourceRoot;
      outputSlug = absoluteTarget.outputSlug;
      reference = absoluteTarget.relativeAsset;
    } else {
      reference = normalized;
    }
  } else {
    reference = normalized;
  }

  // Hexo's include field names files under source/_css/, while migration
  // stores the referenced file beside the article.
  reference = reference.replace(/^_css\//, "");
  if (!reference) return null;

  const candidate = path.resolve(sourceRoot, reference);
  if (candidate !== sourceRoot && !candidate.startsWith(`${sourceRoot}${path.sep}`)) {
    return null;
  }
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) return null;

  const relativeAsset = toPosix(path.relative(sourceRoot, candidate));
  return {
    sourcePath: candidate,
    sourceRoot,
    relativeAsset,
    outputSlug,
    publicRelativePath: path.posix.join(toPosix(outputSlug), relativeAsset),
  };
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

function parseImageTagReference(args: string): string {
  const quoteMatch = args.match(/^["']([^"']+)["']\s+(.+)$/);
  if (quoteMatch) {
    return quoteMatch[2].trim().split(/\s+/)[0] || "";
  }
  return args.trim().split(/\s+/)[1] || "";
}

/** Extract only image tags whose Hexo renderer emits a responsive source. */
function extractResponsiveImageReferences(source: string): string[] {
  const references: string[] = [];
  const responsiveTag =
    /\{%\s*(?:darrellImageCover|darrellImage800Alt)\s+([\s\S]*?)\s*%\}/gi;

  for (const match of source.matchAll(responsiveTag)) {
    const reference = parseImageTagReference(match[1]);
    if (reference) references.push(reference);
  }
  return references;
}

/** Match the same exact-path-first, unique-filename fallback as Hexo. */
function variantsForReference(
  imageReference: string,
  article: ArticleSource
): ImageVariant[] {
  if (!imageReference || imageReference.startsWith("http")) return [];

  const urlPath = imageReference.startsWith("/")
    ? imageReference
    : `/${toPosix(article.slug)}/${imageReference}`;
  const imageName = imageReference.split("/").pop();
  let key: string | null = `/_posts${urlPath}`;

  if (!IMAGE_VARIANTS[key]) {
    const matches = Object.keys(IMAGE_VARIANTS).filter(candidate =>
      candidate.endsWith(`/${imageName}`)
    );
    key = matches.length === 1 ? matches[0] : null;
  }

  return (key ? IMAGE_VARIANTS[key]?.webp : undefined) ?? [];
}

function variantRelativePath(
  originalRelativePath: string,
  variantSource: string
): string {
  const relativePath = path.posix.normalize(
    path.posix.join(path.posix.dirname(originalRelativePath), variantSource)
  );
  if (
    !relativePath ||
    relativePath === "." ||
    path.posix.isAbsolute(relativePath) ||
    relativePath.startsWith("../") ||
    relativePath.split("/").includes("..")
  ) {
    throw new Error(`Unsafe image variant path: ${variantSource}`);
  }
  return relativePath;
}

function resolveVariantSource(
  relativeVariant: string,
  sourceRoot: string,
  outputSlug: string
): string | null {
  const sourceRoots = [
    path.resolve(sourceRoot),
    path.resolve(HEXO_POSTS_DIR, outputSlug),
  ];

  for (const sourceRoot of sourceRoots) {
    const candidate = path.resolve(sourceRoot, relativeVariant);
    if (!candidate.startsWith(`${sourceRoot}${path.sep}`)) continue;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

function copyArticleAssets(article: ArticleSource): number {
  const source = fs.readFileSync(article.markdownPath, "utf-8");
  const assetsToCopy = new Map<string, string>();
  for (const reference of extractReferences(source)) {
    const resolvedAsset = resolveLocalAsset(reference, article);
    if (resolvedAsset) {
      assetsToCopy.set(
        resolvedAsset.publicRelativePath,
        resolvedAsset.sourcePath
      );
    }
  }

  for (const reference of extractResponsiveImageReferences(source)) {
    const originalAsset = resolveLocalAsset(reference, article);
    if (!originalAsset) continue;

    for (const variant of variantsForReference(reference, article)) {
      const relativeVariant = variantRelativePath(
        originalAsset.relativeAsset,
        variant.src
      );
      const variantSource = resolveVariantSource(
        relativeVariant,
        originalAsset.sourceRoot,
        originalAsset.outputSlug
      );
      if (!variantSource) {
        throw new Error(
          `Missing declared image variant referenced by ${article.slug}: ${originalAsset.outputSlug}/${relativeVariant}`
        );
      }
      assetsToCopy.set(
        path.posix.join(toPosix(originalAsset.outputSlug), relativeVariant),
        variantSource
      );
    }
  }

  if (assetsToCopy.size === 0) return 0;

  let count = 0;
  for (const [publicRelativePath, sourcePath] of assetsToCopy) {
    const destinationPath = path.resolve(PUBLIC_DIR, publicRelativePath);
    if (!destinationPath.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
      throw new Error(`Unsafe public asset destination: ${publicRelativePath}`);
    }
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
    console.log(`  ${article.slug}/ (${count} referenced files copied)`);
  }
}

writeManagedSlugs(currentArticleSlugs);

console.log(
  `\nDone: ${totalFiles} referenced files copied across ${articlesWithAssets} article directories.`
);
