import { createServer } from "node:http";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

const projectDir = resolve(process.cwd());
const distDir = resolve(process.argv[2] ?? join(projectDir, "dist"));
const fixtureDir = resolve(projectDir, "tests/fixtures/b3");
const queryPath = join(fixtureDir, "pagefind-queries.json");
const resultPath = join(fixtureDir, "pagefind-results.json");
const port = 4326;
const snapshotDate = "2026-08-26";

const forbiddenPrefixes = [
  "/n8n-expert-v2/",
  "/html5-video-demo/",
  "/categories/",
  "/resume/",
  "/search/",
];

const approvedToolURL = "/tools/n8n_template/models.html";
const entryPageURLs = [
  "/n8n-tutorial-resources/",
  approvedToolURL,
  "/n8n-expert/",
];

const isInside = (candidate, parent) =>
  candidate === parent || candidate.startsWith(`${parent}${sep}`);

const walkFiles = async dir => {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(file));
    else if (entry.isFile()) files.push(file);
  }
  return files;
};

const publishedArticleURLs = async () => {
  const blogDir = join(projectDir, "src/data/blog");
  const files = (await walkFiles(blogDir)).filter(file => file.endsWith(".md"));
  const urls = [];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const frontmatter = source.split(/^---$/m, 2)[1] ?? "";
    if (/^draft:\s*true\s*$/mi.test(frontmatter)) continue;
    const relativePath = relative(blogDir, file).split(sep).join("/");
    const slug = relativePath
      .replace(/\.md$/i, "")
      .replace(/\/index$/i, "");
    urls.push(`/${slug}/`);
  }
  return urls.sort();
};

const normalizedPageURL = rawURL => {
  const pathname = new URL(rawURL, "http://127.0.0.1").pathname;
  return pathname || "/";
};

const isForbiddenURL = url =>
  forbiddenPrefixes.some(prefix => url.startsWith(prefix)) ||
  (url.startsWith("/tools/") && url !== approvedToolURL);

const serveDist = async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url ?? "/", "http://127.0.0.1").pathname
    );
    const candidate = resolve(distDir, `.${pathname}`);
    if (!isInside(candidate, distDir)) throw new Error("path escaped dist");
    const file = await stat(candidate);
    if (!file.isFile()) throw new Error("not a file");
    response.statusCode = 200;
    response.end(await readFile(candidate));
  } catch {
    response.statusCode = 404;
    response.end("Not found");
  }
};

const readPagefindPageCount = async () => {
  const entryPath = join(distDir, "pagefind/pagefind-entry.json");
  const entry = JSON.parse(await readFile(entryPath, "utf8"));
  return Object.values(entry.languages).reduce(
    (total, language) => total + Number(language.page_count ?? 0),
    0
  );
};

const verifyRequiredEntryPages = async () => {
  const entryPages = [
    "n8n-tutorial-resources/index.html",
    "tools/n8n_template/models.html",
    "n8n-expert/index.html",
  ];
  const missing = [];
  for (const page of entryPages) {
    const html = await readFile(join(distDir, page), "utf8");
    if (!/<main\b[^>]*data-pagefind-body[^>]*>/i.test(html)) missing.push(page);
  }
  return missing;
};

const main = async () => {
  if (!existsSync(distDir)) throw new Error(`Missing build output: ${distDir}`);

  const fixture = JSON.parse(await readFile(queryPath, "utf8"));
  const server = createServer(serveDist);
  await new Promise((resolvePromise, rejectPromise) => {
    server.once("error", rejectPromise);
    server.listen(port, "127.0.0.1", resolvePromise);
  });

  const report = {
    generatedAt: snapshotDate,
    source: "dist/pagefind/pagefind.js",
    intentionalDifference: fixture.intentionalDifference,
    indexedPageCount: await readPagefindPageCount(),
    requiredEntryPagesMissing: await verifyRequiredEntryPages(),
    expectedIndexedUrls: [],
    indexedUrls: [],
    forbiddenIndexedUrls: [],
    missingExpectedUrls: [],
    extraIndexedUrls: [],
    expectedIndexedPageCount: 0,
    fullIndexPass: false,
    queries: [],
    passed: false,
  };

  try {
    const pagefindURL = pathToFileURL(join(distDir, "pagefind/pagefind.js"));
    const pagefind = await import(`${pagefindURL.href}?b3=${Date.now()}`);
    await pagefind.options({
      basePath: `http://127.0.0.1:${port}/pagefind/`,
    });

    const expectedIndexedUrls = [
      ...(await publishedArticleURLs()),
      ...entryPageURLs,
    ].sort();
    const allResults = await pagefind.search(null);
    const indexedUrls = [];
    for (const result of allResults.results) {
      const data = await result.data();
      indexedUrls.push(normalizedPageURL(data.raw_url ?? data.url));
    }
    const uniqueIndexedUrls = [...new Set(indexedUrls)].sort();
    const expectedSet = new Set(expectedIndexedUrls);
    const indexedSet = new Set(uniqueIndexedUrls);
    report.expectedIndexedUrls = expectedIndexedUrls;
    report.indexedUrls = uniqueIndexedUrls;
    report.expectedIndexedPageCount = expectedIndexedUrls.length;
    report.forbiddenIndexedUrls = uniqueIndexedUrls.filter(isForbiddenURL);
    report.missingExpectedUrls = expectedIndexedUrls.filter(url => !indexedSet.has(url));
    report.extraIndexedUrls = uniqueIndexedUrls.filter(url => !expectedSet.has(url));
    report.allResultsCount = allResults.results.length;
    report.fullIndexPass =
      report.indexedPageCount === report.expectedIndexedPageCount &&
      report.allResultsCount === report.expectedIndexedPageCount &&
      report.indexedUrls.length === report.expectedIndexedPageCount &&
      report.forbiddenIndexedUrls.length === 0 &&
      report.missingExpectedUrls.length === 0 &&
      report.extraIndexedUrls.length === 0;

    for (const query of fixture.queries) {
      const search = await pagefind.search(query.query);
      const top3 = [];
      for (const [index, result] of search.results.slice(0, 3).entries()) {
        const data = await result.data();
        top3.push({
          rank: index + 1,
          url: data.raw_url ?? data.url,
          title: data.meta?.title ?? "",
          excerpt: data.excerpt ?? "",
          score: result.score,
        });
      }

      const top3URLs = top3.map(result => result.url);
      const expectedMatch = query.expectedAnyTop3.some(url =>
        top3URLs.includes(url)
      );
      const acceptableTop3 = query.acceptableTop3 ?? query.expectedAnyTop3;
      const unexpectedTop3 = top3URLs.filter(url => !acceptableTop3.includes(url));
      const allTop3Acceptable =
        top3.length === 3 &&
        new Set(top3URLs).size === 3 &&
        unexpectedTop3.length === 0;
      const forbiddenResults = top3URLs.filter(url =>
        isForbiddenURL(url)
      );
      const passed =
        (query.expectedAnyTop3.length === 0 || expectedMatch) &&
        allTop3Acceptable &&
        forbiddenResults.length === 0;
      report.queries.push({
        query: query.query,
        top3Rule: query.top3Rule,
        expectedAnyTop3: query.expectedAnyTop3,
        acceptableTop3,
        resultCount: search.unfilteredResultCount,
        top3,
        expectedMatch,
        allTop3Acceptable,
        unexpectedTop3,
        forbiddenResults,
        passed,
      });
    }

    report.passed =
      report.fullIndexPass &&
      report.requiredEntryPagesMissing.length === 0 &&
      report.queries.every(query => query.passed);
  } finally {
    await new Promise(resolvePromise => server.close(resolvePromise));
  }

  await writeFile(resultPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(
    `Pagefind B3: ${report.queries.filter(query => query.passed).length}/${report.queries.length} queries passed; full index ${report.indexedUrls.length}/${report.expectedIndexedPageCount} pages ${report.fullIndexPass ? "passed" : "failed"}.`
  );
  if (!report.fullIndexPass) {
    console.error(
      `FAIL full index: forbidden=${report.forbiddenIndexedUrls.length} missing=${report.missingExpectedUrls.length} extra=${report.extraIndexedUrls.length}`
    );
  }
  if (!report.passed) {
    for (const query of report.queries.filter(query => !query.passed)) {
      console.error(
        `FAIL ${query.query}: expected=${query.expectedAnyTop3.join(", ")} top3=${query.top3.map(result => result.url).join(", ")}`
      );
    }
    process.exitCode = 1;
  }
};

main().catch(async error => {
  const report = {
    generatedAt: snapshotDate,
    source: "dist/pagefind/pagefind.js",
    passed: false,
    error: String(error?.stack ?? error),
  };
  const { writeFile } = await import("node:fs/promises");
  await writeFile(resultPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.error(report.error);
  process.exitCode = 1;
});
