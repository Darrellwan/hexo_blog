import { readFile, access } from "node:fs/promises";
import { join, resolve } from "node:path";

const projectDir = resolve(process.cwd());
const distDir = resolve(process.argv[2] ?? join(projectDir, "dist"));
const fixtureDir = resolve(projectDir, "tests/fixtures/b3");
const manifestPath = join(fixtureDir, "url-manifest.json");
const resultPath = join(fixtureDir, "url-manifest-results.json");
const snapshotDate = "2026-08-26";

const exists = async path => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const outputFileForURL = url => {
  const encodedPathname = url.split(/[?#]/, 1)[0];
  const pathname = decodeURIComponent(encodedPathname);
  const outputFile = pathname === "/"
    ? join(distDir, "index.html")
    : pathname.endsWith("/")
      ? join(distDir, pathname.slice(1), "index.html")
      : join(distDir, pathname.slice(1));
  const normalizedOutputFile = resolve(outputFile);
  const normalizedDistDir = resolve(distDir);
  if (
    normalizedOutputFile !== normalizedDistDir &&
    !normalizedOutputFile.startsWith(`${normalizedDistDir}/`)
  ) {
    throw new Error(`Manifest URL escapes dist: ${url}`);
  }
  return normalizedOutputFile;
};

const redirectRuleForURL = (redirects, url, target) => {
  const expected = `${url} ${target} 308`;
  return redirects
    .split(/\r?\n/)
    .map(line => line.trim())
    .some(line => line === expected);
};

const mismatchClass = result => {
  if (result.kinds?.includes("article") && result.kinds?.includes("live-rss")) {
    return "live-rss-content-dependency";
  }
  if (result.kinds?.includes("source-post-asset")) return "source-post-asset-inventory";
  if (result.kinds?.some(kind => kind.includes("archive") || kind.includes("pagination"))) {
    return "proposed-continuity-route";
  }
  if (result.kinds?.includes("local-content")) return "local-content-state";
  if (result.kinds?.some(kind => kind.startsWith("live-"))) return "live-sitemap-dependency";
  return "other-route-state";
};

const main = async () => {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const redirectsPath = join(distDir, "_redirects");
  const redirects = (await exists(redirectsPath))
    ? await readFile(redirectsPath, "utf8")
    : "";
  const results = [];
  for (const entry of manifest.entries) {
    const outputFile = outputFileForURL(entry.oldUrl);
    const outputExists = entry.expectedStatus === "redirect-308"
      ? redirectRuleForURL(redirects, entry.oldUrl, entry.newUrl)
      : await exists(outputFile);
    results.push({
      ...entry,
      outputFile,
      observedStatus: entry.expectedStatus === "redirect-308"
        ? (outputExists ? "redirect-308" : "missing-redirect")
        : entry.expectedStatus === "retained-200"
          ? (outputExists ? "retained-200" : "missing-200")
          : (outputExists ? "unexpected-output" : "intentional-404"),
      passed: entry.expectedStatus === "redirect-308"
        ? outputExists
        : entry.expectedStatus === "retained-200"
          ? outputExists
          : !outputExists,
    });
  }

  const mismatches = results.filter(result => !result.passed);
  const missingPublishedArticles = results.filter(
    result => result.kinds?.includes("article") && result.observedStatus === "missing-200"
  ).map(result => result.oldUrl);
  const report = {
    generatedAt: snapshotDate,
    source: "tests/fixtures/b3/url-manifest.json + local dist/_redirects",
    expectedStatusVocabulary: manifest.statusVocabulary,
    passed: mismatches.length === 0,
    inventory: manifest.inventory,
    liveSources: manifest.liveSources,
    localSources: manifest.localSources,
    totals: {
      entries: results.length,
      passed: results.filter(result => result.passed).length,
      mismatches: mismatches.length,
      missingPublishedArticles,
      mismatchesByExpectedStatus: Object.fromEntries(
        manifest.statusVocabulary.map(status => [
          status,
          mismatches.filter(result => result.expectedStatus === status).length,
        ])
      ),
      mismatchesByClass: Object.fromEntries(
        [...new Set(mismatches.map(mismatchClass))].map(kind => [
          kind,
          mismatches.filter(result => mismatchClass(result) === kind).length,
        ])
      ),
    },
    results,
  };

  await import("node:fs/promises").then(({ writeFile }) =>
    writeFile(resultPath, `${JSON.stringify(report, null, 2)}\n`, "utf8")
  );
  console.log(
    `URL manifest B3: ${report.totals.passed}/${report.totals.entries} passed; ${report.totals.mismatches} current mismatches; report ${report.passed ? "passed" : "failed"}.`
  );
  console.log(
    `Missing published article sample (${report.totals.missingPublishedArticles.length}): ${report.totals.missingPublishedArticles.join(", ") || "none"}`
  );
  if (!report.passed) process.exitCode = 1;
};

main().catch(error => {
  console.error(error?.stack ?? error);
  process.exitCode = 1;
});
