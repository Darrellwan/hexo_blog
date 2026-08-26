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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Paths ─────────────────────────────────────────────────────────────────
const HEXO_POSTS_DIR = "/Users/darrellwang/Darrell/code/blog/source/_posts";
const ASTRO_BLOG_DIR = path.resolve(__dirname, "../src/data/blog");

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Very simple YAML front matter parser that handles:
 * - key: value (scalar)
 * - key: "quoted value"
 * - Sequence items under a key (indented - item)
 * - Inline sequences: [a, b, c]
 * - Trailing whitespace on values
 *
 * We intentionally avoid pulling in js-yaml to keep this zero-dep
 * beyond Node builtins (tsx handles TS compilation).
 */
function parseFrontMatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  // Split off the front matter block
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, unknown> = {};

  const lines = yamlBlock.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }

    // Top-level key
    const keyMatch = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (!keyMatch) {
      i++;
      continue;
    }

    const key = keyMatch[1];
    let valueRaw = keyMatch[2].trim();

    // Check if next lines are sequence items (YAML list)
    const nextLineIsSequence =
      i + 1 < lines.length && /^\s+-\s/.test(lines[i + 1]);

    if (valueRaw === "" && nextLineIsSequence) {
      // Collect sequence items
      const items: string[] = [];
      i++;
      while (i < lines.length && /^\s+-\s/.test(lines[i])) {
        const itemMatch = lines[i].match(/^\s+-\s+(.*)/);
        if (itemMatch) {
          items.push(stripQuotes(itemMatch[1].trim()));
        }
        i++;
      }
      data[key] = items;
      continue;
    }

    // Inline array: [a, b, c]
    if (valueRaw.startsWith("[") && valueRaw.endsWith("]")) {
      const inner = valueRaw.slice(1, -1);
      data[key] = inner
        .split(",")
        .map(s => stripQuotes(s.trim()))
        .filter(Boolean);
      i++;
      continue;
    }

    // Scalar value
    if (valueRaw !== "") {
      data[key] = stripQuotes(valueRaw);
    }
    // valueRaw empty + no sequence → treat as null / skip
    i++;
  }

  return { data, content };
}

function stripQuotes(s: string): string {
  // Remove surrounding single or double quotes
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
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

/** Serialize a value as YAML (simple scalar / array). */
function toYamlValue(val: unknown): string {
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    return "\n" + val.map(v => `  - ${yamlScalar(String(v))}`).join("\n");
  }
  return yamlScalar(String(val));
}

/** Quote a scalar if it contains special characters. */
function yamlScalar(s: string): string {
  // If it contains chars that break YAML, wrap in double quotes
  if (/[:#{}\[\],&*?|<>=!%@`]/.test(s) || s.includes("\n") || s.trim() !== s) {
    // Escape inner double quotes
    return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return s;
}

/** Build new front matter string from an object. */
function buildFrontMatter(fields: Record<string, unknown>): string {
  const lines = ["---"];
  for (const [key, val] of Object.entries(fields)) {
    if (val === undefined || val === null || val === "") continue;
    lines.push(`${key}: ${toYamlValue(val)}`);
  }
  lines.push("---");
  return lines.join("\n") + "\n";
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

  // title – strip surrounding quotes
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

  // slug from id
  if (hex.id) {
    astro.slug = String(hex.id).trim();
  }

  // ogImage from bgImage
  if (hex.bgImage) {
    astro.ogImage = String(hex.bgImage).trim();
  }

  // page_type → omit
  // preload → omit

  // ── Write output ──
  const filename = path.basename(hexoFile);
  const destFile = path.join(destDir, filename);
  const newContent = buildFrontMatter(astro) + content;
  fs.writeFileSync(destFile, newContent, "utf-8");

  return "migrated";
}

function main() {
  console.log("=== Hexo → Astro Front Matter Migration ===\n");

  // Ensure destination exists
  fs.mkdirSync(ASTRO_BLOG_DIR, { recursive: true });

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

  if (errors.length > 0) {
    console.log(`\nErrors:`);
    errors.forEach(e => console.log(e));
  }

  console.log("\nDone.");
}

main();
