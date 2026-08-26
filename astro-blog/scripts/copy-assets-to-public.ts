/**
 * copy-assets-to-public.ts
 *
 * Copies all image asset directories from src/data/blog/{slug}/
 * to public/posts/{slug}/ so that co-located images are served
 * at the correct URL path /posts/{slug}/{image}.
 *
 * Run: npx tsx scripts/copy-assets-to-public.ts
 */

import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.resolve(import.meta.dirname, "../src/data/blog");
const PUBLIC_POSTS_DIR = path.resolve(import.meta.dirname, "../public/posts");

const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif",
  ".mp4", ".webm", ".mov",
]);

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function copyDir(src: string, dest: string): number {
  let count = 0;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else if (entry.isFile() && isImageFile(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

let totalFiles = 0;
let totalDirs = 0;

for (const entry of fs.readdirSync(BLOG_DIR, { withFileTypes: true })) {
  // Skip files and underscore-prefixed directories
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith("_")) continue;

  const srcDir = path.join(BLOG_DIR, entry.name);
  const destDir = path.join(PUBLIC_POSTS_DIR, entry.name);

  const count = copyDir(srcDir, destDir);
  if (count > 0) {
    console.log(`  ${entry.name}/ → public/posts/${entry.name}/ (${count} files)`);
    totalFiles += count;
    totalDirs++;
  }
}

console.log(`\nDone: ${totalFiles} files copied across ${totalDirs} directories.`);
