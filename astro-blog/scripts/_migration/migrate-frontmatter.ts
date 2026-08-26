/**
 * migrate-frontmatter.ts
 *
 * Migrates Hexo blog posts to Astro format:
 * - Converts front matter fields
 * - Copies asset directories
 * - Preserves existing test-*.md files in src/data/blog/
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Paths ─────────────────────────────────────────────────────────────────
const HEXO_POSTS_DIR =
  process.env.HEXO_POSTS_DIR ?? path.resolve(__dirname, "../../../source/_posts");
const ASTRO_BLOG_DIR =
  process.env.ASTRO_BLOG_DIR ?? path.resolve(__dirname, "../../src/data/blog");
const HEXO_DATA_DIR =
  process.env.HEXO_DATA_DIR ?? path.resolve(__dirname, "../../../source/_data");
const ASTRO_DATA_DIR =
  process.env.ASTRO_DATA_DIR ?? path.dirname(ASTRO_BLOG_DIR);
const IMAGE_METADATA_FILES = [
  "image_dimensions.json",
  "image_variants.json",
] as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Parse the complete YAML front matter block, including nested objects and
 * arrays such as darrell_structured_data. The yaml package is already a
 * transitive dependency of Astro, so migration does not add an install step.
 */
function parseFrontMatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  // Split off the front matter block
  const match = raw.match(
    /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/
  );
  if (!match) {
    return { data: {}, content: raw };
  }

  // Several legacy posts use a tab for list indentation. YAML 1.2 rejects
  // tabs in indentation, so normalize only the front matter block before
  // parsing; the markdown body remains byte-for-byte unchanged.
  const parsed = parseYaml(match[1].replace(/\t/g, "  "), {
    intAsBigInt: true,
  });
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Front matter must contain a top-level YAML object");
  }

  return {
    data: normalizeYamlValue(parsed) as Record<string, unknown>,
    content: match[2],
  };
}

/** Keep large YAML integers exact instead of silently rounding them in JS. */
function normalizeYamlValue(value: unknown): unknown {
  if (typeof value === "bigint") {
    const numberValue = Number(value);
    return Number.isSafeInteger(numberValue) ? numberValue : value.toString();
  }
  if (Array.isArray(value)) return value.map(normalizeYamlValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, normalizeYamlValue(nested)])
    );
  }
  return value;
}

/**
 * Convert "YYYY-MM-DD HH:MM:SS" (Taiwan time, UTC+8) to ISO 8601 string.
 * If already ISO-like, just return with +08:00 appended.
 */
function toISO8601Taiwan(dateStr: string): string {
  if (!dateStr) return "";
  const trimmed = String(dateStr).trim();

  // Already has timezone info → return as-is
  if (/[+-]\d{2}:\d{2}$/.test(trimmed) || trimmed.endsWith("Z")) {
    return trimmed;
  }

  // "YYYY-MM-DD HH:MM:SS" or "YYYY-MM-DD"
  const m = trimmed.match(
    /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}:\d{2}))?/
  );
  if (m) {
    const datePart = m[1];
    const timePart = m[2] || "00:00:00";
    return `${datePart}T${timePart}+08:00`;
  }

  return trimmed;
}

/** Build new front matter string from an object. */
function buildFrontMatter(fields: Record<string, unknown>): string {
  return `---\n${stringifyYaml(fields, { lineWidth: 0 }).trimEnd()}\n---\n`;
}

/** Recursively copy a directory. */
function copyDirRecursive(src: string, dest: string): number {
  if (!fs.existsSync(src)) return 0;
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

/** Keep Astro's generated image metadata in sync with the Hexo authority. */
function copyImageMetadata(): number {
  fs.mkdirSync(ASTRO_DATA_DIR, { recursive: true });

  for (const filename of IMAGE_METADATA_FILES) {
    const sourcePath = path.join(HEXO_DATA_DIR, filename);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Missing Hexo image metadata: ${sourcePath}`);
    }

    const parsed: unknown = JSON.parse(fs.readFileSync(sourcePath, "utf-8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`Image metadata must be a top-level object: ${sourcePath}`);
    }

    fs.copyFileSync(sourcePath, path.join(ASTRO_DATA_DIR, filename));
  }

  return IMAGE_METADATA_FILES.length;
}

/** Resolve an extensionless Hexo bgImage to the real article-local asset. */
function resolveOgImageFilename(value: string, hexoFile: string): string {
  const filename = value.trim();
  if (path.extname(filename)) return filename;

  const assetDir = path.join(
    path.dirname(hexoFile),
    path.basename(hexoFile, path.extname(hexoFile))
  );
  for (const extension of [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]) {
    if (fs.existsSync(path.join(assetDir, `${filename}${extension}`))) {
      return `${filename}${extension}`;
    }
  }

  return filename;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function migratePost(
  hexoFile: string,
  destDir: string
): "migrated" | "skipped" | "error" {
  const raw = fs.readFileSync(hexoFile, "utf-8");
  const { data: hex, content } = parseFrontMatter(raw);

  if (!hex.title && !hex.date) {
    // Not a proper post
    return "skipped";
  }

  // ── Field mapping ──
  const astro: Record<string, unknown> = {};

  // title – the YAML parser already strips surrounding quotes
  if (hex.title) {
    astro.title = String(hex.title).trim();
  }

  // pubDatetime
  if (hex.date) {
    astro.pubDatetime = toISO8601Taiwan(String(hex.date));
  }

  // modDatetime – prefer "modified", fall back to "updated"
  const modRaw = hex.modified || hex.updated;
  if (modRaw) {
    astro.modDatetime = toISO8601Taiwan(String(modRaw));
  }

  // description
  if (hex.description) {
    astro.description = String(hex.description).trim();
  } else {
    astro.description = "";
  }

  // tags
  if (hex.tags) {
    astro.tags = Array.isArray(hex.tags)
      ? hex.tags.map(t => String(t))
      : [String(hex.tags)];
  } else {
    astro.tags = ["others"];
  }

  // categories (optional)
  if (hex.categories) {
    astro.categories = Array.isArray(hex.categories)
      ? hex.categories.map(c => String(c))
      : [String(hex.categories)];
  }

  // Preserve source metadata that still has value to Astro or its future
  // consumers. The explicit field transforms above take precedence over
  // their Hexo names; unknown fields are retained so a new source field
  // cannot disappear silently during a migration rerun.
  const transformedFields = new Set([
    "title",
    "date",
    "updated",
    "modified",
    "description",
    "tags",
    "categories",
    "bgImage",
    "slug",
  ]);
  for (const [key, value] of Object.entries(hex)) {
    if (!transformedFields.has(key) && value !== undefined) {
      astro[key] = value;
    }
  }

  // Canonical slug comes from the Hexo markdown filename, not frontmatter
  // `id`.  Some legacy posts use underscores in `id` even though their
  // source filename (and public URL) uses hyphens.
  const filename = path.basename(hexoFile);
  astro.slug = filename.replace(/\.md$/i, "");

  // ogImage from bgImage
  if (hex.bgImage) {
    const ogImage = resolveOgImageFilename(String(hex.bgImage), hexoFile);
    astro.bgImage = String(hex.bgImage).trim();
    astro.ogImage = ogImage;
  }

  // ── Write output ──
  const destFile = path.join(destDir, filename);
  const newContent = buildFrontMatter(astro) + content;
  fs.writeFileSync(destFile, newContent, "utf-8");

  return "migrated";
}

function main() {
  console.log("=== Hexo → Astro Front Matter Migration ===\n");

  // Ensure destination exists
  fs.mkdirSync(ASTRO_BLOG_DIR, { recursive: true });

  // Image dimensions prevent CLS, while variants drive responsive <picture>
  // markup. Both files are generated Hexo data and must migrate as a pair.
  const imageMetadataFilesCopied = copyImageMetadata();

  // ── Step 1: Collect test-*.md files to preserve ──
  const preserved = new Set<string>();
  for (const f of fs.readdirSync(ASTRO_BLOG_DIR)) {
    if (f.match(/^test-.+\.md$/)) {
      preserved.add(f);
    }
  }
  console.log(`Preserving ${preserved.size} test-*.md file(s).`);

  // ── Step 2: Migrate .md files ──
  const hexoEntries = fs.readdirSync(HEXO_POSTS_DIR, { withFileTypes: true });
  const mdFiles = hexoEntries
    .filter(e => e.isFile() && e.name.endsWith(".md"))
    .map(e => e.name);

  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const filename of mdFiles) {
    // Skip if it's a test file in destination (we preserve those)
    if (preserved.has(filename)) {
      skippedCount++;
      continue;
    }

    const hexoPath = path.join(HEXO_POSTS_DIR, filename);
    try {
      const result = migratePost(hexoPath, ASTRO_BLOG_DIR);
      if (result === "migrated") {
        migratedCount++;
      } else {
        skippedCount++;
      }
    } catch (err) {
      errorCount++;
      errors.push(`  ${filename}: ${(err as Error).message}`);
    }
  }

  // ── Step 3: Copy asset directories ──
  const assetDirs = hexoEntries.filter(e => e.isDirectory());
  let dirsCopied = 0;
  let totalFilesCopied = 0;

  for (const dir of assetDirs) {
    // Skip internal/system dirs
    if (dir.name.startsWith(".")) continue;

    const srcDir = path.join(HEXO_POSTS_DIR, dir.name);
    const destDir = path.join(ASTRO_BLOG_DIR, dir.name);
    const filesCopied = copyDirRecursive(srcDir, destDir);
    if (filesCopied > 0) {
      dirsCopied++;
      totalFilesCopied += filesCopied;
    }
  }

  // ── Report ──
  console.log(`\nResults:`);
  console.log(`  Posts migrated:   ${migratedCount}`);
  console.log(`  Posts skipped:    ${skippedCount}`);
  console.log(`  Errors:           ${errorCount}`);
  console.log(`  Asset dirs copied: ${dirsCopied}`);
  console.log(`  Asset files copied: ${totalFilesCopied}`);
  console.log(`  Image metadata files copied: ${imageMetadataFilesCopied}`);

  if (errors.length > 0) {
    console.log(`\nErrors:`);
    errors.forEach(e => console.log(e));
  }

  console.log("\nDone.");
}

main();
