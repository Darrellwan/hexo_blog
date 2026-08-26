/**
 * Freeze the build output into a manifest that later phases compare against.
 *
 * Blocker 1 (URLs must not silently move) and blocker 6 (sitemap / robots / RSS
 * continuity) both need one fixed baseline: the exact set of URLs this build
 * publishes, plus a content hash for every document whose bytes form a public
 * contract. Phase 3 acceptance re-runs this script and diffs the result, so a
 * route that disappears or a contract file that drifts fails loudly instead of
 * reaching the cutover unnoticed.
 *
 * Excluded on purpose:
 *   - `_astro/` bundles and `pagefind/` indexes carry content hashes in their
 *     own file names and change on every build. Their counts are recorded in
 *     the summary; their bytes are not a contract.
 *   - `.DS_Store`, which Finder writes into any directory it opens.
 *
 * Usage: npx tsx scripts/freeze-manifest.ts [--out <path>]
 */
import { createHash } from "node:crypto";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const DIST_DIR = new URL("../dist/", import.meta.url).pathname;
const DEFAULT_OUT = new URL(
  "../tests/fixtures/frozen/build-manifest.json",
  import.meta.url
).pathname;

const EXCLUDED_PREFIXES = ["_astro", "pagefind"];
const DOCUMENT_EXTENSIONS = new Set(["html", "md", "txt", "xml", "json"]);
const CONTRACT_FILES = new Set([
  "_redirects",
  "_headers",
  "robots.txt",
  "sitemap.xml",
  "rss.xml",
  "llms.txt",
]);

const listFiles = async (directory: string): Promise<string[]> => {
  const found: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await listFiles(path)));
    else if (entry.isFile() && entry.name !== ".DS_Store") found.push(path);
  }
  return found;
};

/** dist/foo/index.html serves /foo/; every other file serves its own path. */
const toURL = (relativePath: string): string => {
  const posixPath = relativePath.split(sep).join("/");
  if (posixPath === "index.html") return "/";
  if (posixPath.endsWith("/index.html")) {
    return `/${posixPath.slice(0, -"index.html".length)}`;
  }
  return `/${posixPath}`;
};

const classify = (relativePath: string, extension: string): string => {
  const posixPath = relativePath.split(sep).join("/");
  if (CONTRACT_FILES.has(posixPath)) return "contract";
  if (extension === "html") return "page";
  if (extension === "md") return "markdown";
  if (DOCUMENT_EXTENSIONS.has(extension)) return "document";
  return "asset";
};

const outFlagIndex = process.argv.indexOf("--out");
const outPath = outFlagIndex === -1 ? DEFAULT_OUT : process.argv[outFlagIndex + 1];

const allFiles = (await listFiles(DIST_DIR)).sort();
const summary: Record<string, number> = {};
const skipped: Record<string, number> = {};
const entries: Array<{
  url: string;
  kind: string;
  bytes: number;
  sha256: string;
}> = [];

for (const path of allFiles) {
  const relativePath = relative(DIST_DIR, path);
  const topSegment = relativePath.split(sep)[0];
  if (EXCLUDED_PREFIXES.includes(topSegment)) {
    skipped[topSegment] = (skipped[topSegment] ?? 0) + 1;
    continue;
  }
  const extension = relativePath.includes(".")
    ? relativePath.split(".").pop()!.toLowerCase()
    : "";
  const bytes = await readFile(path);
  const kind = classify(relativePath, extension);
  summary[kind] = (summary[kind] ?? 0) + 1;
  entries.push({
    url: toURL(relativePath),
    kind,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}

entries.sort((a, b) => a.url.localeCompare(b.url));

const duplicates = entries
  .map(entry => entry.url)
  .filter((url, index, all) => all.indexOf(url) !== index);
if (duplicates.length > 0) {
  throw new Error(`Two files claim the same URL: ${duplicates.join(", ")}`);
}

await mkdir(join(outPath, ".."), { recursive: true });
await writeFile(
  outPath,
  `${JSON.stringify({ summary, skipped, total: entries.length, entries }, null, 2)}\n`,
  "utf8"
);

console.log(`Wrote ${entries.length} URLs to ${outPath}`);
console.log(`  by kind:  ${JSON.stringify(summary)}`);
console.log(`  skipped:  ${JSON.stringify(skipped)}`);
