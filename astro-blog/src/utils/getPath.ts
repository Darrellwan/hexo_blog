import { BLOG_PATH } from "@/content.config";

/**
 * Get the canonical URL path of a blog post, with the trailing slash the
 * legacy site and every canonical tag use.
 *
 * The markdown filename is the source of truth for the URL.  Do not accept an
 * `id` fallback: it can be derived from frontmatter and would reintroduce the
 * legacy hyphen/underscore mismatch.
 */
export function getPath(filePath: string | undefined): string {
  if (!filePath) {
    throw new Error("Blog file path is required to derive its canonical URL.");
  }
  const normalizedFilePath = filePath.replace(/\\/g, "/");
  const marker = `${BLOG_PATH}/`;
  const markerIndex = normalizedFilePath.lastIndexOf(marker);
  if (markerIndex < 0) {
    throw new Error(`Blog file path must be inside ${BLOG_PATH}: ${filePath}`);
  }

  const segments = normalizedFilePath
    .slice(markerIndex + marker.length)
    .replace(/\.md$/i, "")
    .split("/")
    .filter(segment => segment !== "" && !segment.startsWith("_"));

  // Support the conventional nested `slug/index.md` shape while preserving
  // every filename character, including legacy underscores.
  if (segments.at(-1) === "index") segments.pop();
  if (segments.length === 0) {
    throw new Error(`Blog file path has no canonical slug: ${filePath}`);
  }

  return `/${segments.join("/")}/`;
}
