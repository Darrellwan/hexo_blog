import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { XMLParser } from "fast-xml-parser";

const projectDir = resolve(process.cwd());
const repoDir = resolve(projectDir, "..");
const distDir = join(projectDir, "dist");
const resultPath = join(projectDir, "tests/fixtures/b3/sitemap-results.json");
const snapshotDate = "2026-08-26";
const siteOrigin = "https://www.darrelltw.com";
const requiredEntryPaths = [
  "/n8n-tutorial-resources/",
  "/n8n-expert/",
  "/tools/n8n_template/models.html",
];

const walkFiles = async dir => {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(file));
    else if (entry.isFile()) files.push(file);
  }
  return files;
};

const main = async () => {
  const rootFiles = await readdir(distDir);
  const rootSitemapFiles = rootFiles.filter(name => /^sitemap(?:-.+)?\.xml$/.test(name));
  const sitemapXML = await readFile(join(distDir, "sitemap.xml"), "utf8");
  const rssXML = await readFile(join(distDir, "rss.xml"), "utf8");
  const locs = [...sitemapXML.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const locPaths = locs.map(loc => {
    try {
      return new URL(loc).pathname;
    } catch {
      return null;
    }
  });
  const rssChannel = new XMLParser({ ignoreAttributes: false }).parse(rssXML)?.rss?.channel;
  const rssItems = rssChannel?.item == null
    ? []
    : Array.isArray(rssChannel.item) ? rssChannel.item : [rssChannel.item];
  const rssGUIDPaths = rssItems.map(item => {
    const guid = typeof item.guid === "object" ? item.guid["#text"] : item.guid;
    try {
      return new URL(guid).pathname;
    } catch {
      return null;
    }
  });
  const sitemapPathSet = new Set(locPaths.filter(Boolean));
  const invalidLocs = locs.filter(loc => {
    try {
      const url = new URL(loc);
      return url.origin !== siteOrigin || url.protocol !== "https:";
    } catch {
      return true;
    }
  });
  const forbiddenLocs = locPaths.filter(path =>
    path == null ||
    path === "/404" ||
    path.startsWith("/categories/") ||
    /(?:^|\/)index(?:\.html)?\/?$/.test(path)
  );
  const missingRSSGUIDPaths = rssGUIDPaths.filter(path => !sitemapPathSet.has(path));
  const missingRequiredEntryPaths = requiredEntryPaths.filter(path => !sitemapPathSet.has(path));
  const scanRoots = [join(repoDir, "source"), join(projectDir, "src"), distDir];
  const matches = [];
  for (const root of scanRoots) {
    for (const file of await walkFiles(root)) {
      if (!/\.(?:html|js|mjs|md|ts|xml|txt|yml|yaml)$/.test(file)) continue;
      const text = await readFile(file, "utf8");
      if (/sitemap-index\.xml|sitemap-0\.xml/.test(text)) matches.push(file);
    }
  }
  const report = {
    generatedAt: snapshotDate,
    rootSitemapFiles,
    urlset: /<urlset\b/.test(sitemapXML),
    sitemapIndex: /<sitemapindex\b/.test(sitemapXML),
    locCount: locs.length,
    urlCount: (sitemapXML.match(/<url>/g) ?? []).length,
    uniqueLocCount: new Set(locs).size,
    invalidLocs,
    forbiddenLocs,
    localRSSGuidCount: rssGUIDPaths.length,
    missingRSSGUIDPaths,
    requiredEntryPaths,
    missingRequiredEntryPaths,
    forbiddenIndexReferences: matches.map(file => file.replace(`${repoDir}/`, "")),
    passed: rootSitemapFiles.length === 1 &&
      rootSitemapFiles[0] === "sitemap.xml" &&
      /<urlset\b/.test(sitemapXML) &&
      !/<sitemapindex\b/.test(sitemapXML) &&
      locs.length === new Set(locs).size &&
      invalidLocs.length === 0 &&
      forbiddenLocs.length === 0 &&
      rssGUIDPaths.length === 120 &&
      missingRSSGUIDPaths.length === 0 &&
      missingRequiredEntryPaths.length === 0 &&
      matches.length === 0,
  };
  await writeFile(resultPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Sitemap B3: ${report.passed ? "passed" : "failed"}; ${report.urlCount} URLs; root files ${rootSitemapFiles.join(", ")}.`);
  if (!report.passed) process.exitCode = 1;
};

main().catch(async error => {
  const report = { generatedAt: snapshotDate, passed: false, error: String(error?.stack ?? error) };
  await writeFile(resultPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.error(report.error);
  process.exitCode = 1;
});
