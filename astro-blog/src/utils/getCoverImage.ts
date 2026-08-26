import type { CollectionEntry } from "astro:content";
import { BLOG_PATH } from "@/content.config";

/**
 * Extract cover image URL from post's darrellImageCover tag or bgImage frontmatter.
 *
 * Image files are served from /{original-dir-name}/{filename}
 * (copied by copy-assets-to-public.ts from src/data/blog/{dir}/ to public/{dir}/).
 * We must use the original directory name, NOT the slugified post URL.
 */
export function getCoverImage(
  post: CollectionEntry<"blog">
): string | null {
  const dirName = getAssetDirName(post.filePath);
  if (!dirName) return null;

  // 1. Try bgImage from frontmatter
  if (post.data.bgImage) {
    return buildAssetUrl(dirName, post.data.bgImage);
  }

  // 2. Parse {% darrellImageCover altText filename.jpg ... %}
  if (post.body) {
    const match = post.body.match(
      /\{%\s*darrellImageCover\s+\S+\s+(\S+?)(?:\s+|%\})/
    );
    if (match?.[1]) {
      return buildAssetUrl(dirName, match[1]);
    }
  }

  return null;
}

function buildAssetUrl(dirName: string, filename: string): string {
  const assetName = filename.replace(/^\.\//, "");
  if (/^(?:https?:)?\/\//i.test(assetName) || assetName.startsWith("/")) {
    return assetName;
  }
  return `/${dirName}/${assetName}`;
}

/**
 * Get the original asset directory name from the post's filePath.
 * e.g. "src/data/blog/n8n-2.0-update/index.md" -> "n8n-2.0-update"
 *      "src/data/blog/n8n-apify-node.md" -> "n8n-apify-node"
 */
function getAssetDirName(filePath: string | undefined): string | null {
  if (!filePath) return null;

  const marker = BLOG_PATH + "/";
  const idx = filePath.indexOf(marker);
  if (idx === -1) return null;

  const relative = filePath.slice(idx + marker.length);
  // If file is inside a subdirectory: "slug/index.md" -> "slug"
  // If file is at root: "slug.md" -> "slug"
  const parts = relative.split("/");
  if (parts.length > 1) {
    return parts[0]; // directory name
  }
  return parts[0].replace(/\.md$/, ""); // filename without extension
}
