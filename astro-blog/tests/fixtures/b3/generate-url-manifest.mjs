import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { XMLParser } from "fast-xml-parser";
import kebabcase from "lodash.kebabcase";
import slugify from "slugify";

const astroDir = resolve(process.cwd());
const repoDir = resolve(astroDir, "..");
const distDir = join(astroDir, "dist");
const sourcePostsDir = join(repoDir, "source/_posts");
const astroBlogDir = join(astroDir, "src/data/blog");
const publicDir = join(astroDir, "public");
const outputPath = join(astroDir, "tests/fixtures/b3/url-manifest.json");
const liveBaseURL = "https://www.darrelltw.com";
const liveSitemapURL = `${liveBaseURL}/sitemap.xml`;
const liveRssURL = `${liveBaseURL}/rss.xml`;
const approvedToolEntryPath = "/tools/n8n_template/models.html";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

const array = value => (value == null ? [] : Array.isArray(value) ? value : [value]);
const trimSlash = value => value.replace(/\/+$/, "");
const withSlash = value => `${trimSlash(value)}/`;
const slugifyStr = value => /[^\x00-\x7F]/.test(value)
  ? kebabcase(value)
  : slugify(value, { lower: true });
const isInside = (candidate, parent) =>
  candidate === parent || candidate.startsWith(`${parent}${sep}`);

const outputFileForURL = url => {
  const encodedPathname = url.split(/[?#]/, 1)[0];
  const pathname = decodeURIComponent(encodedPathname);
  if (pathname === "/") return join(distDir, "index.html");
  if (pathname.endsWith("/")) return join(distDir, pathname.slice(1), "index.html");
  return join(distDir, pathname.slice(1));
};

const outputExists = async url => {
  try {
    const file = outputFileForURL(url);
    if (!isInside(file, distDir)) return false;
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
};

const walkFiles = async dir => {
  const entries = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, item.name);
    if (item.isDirectory()) entries.push(...await walkFiles(file));
    else if (item.isFile()) entries.push(file);
  }
  return entries;
};

const fetchText = async url => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Live fetch failed: ${url} (${response.status})`);
  return response.text();
};

const addEntryFactory = () => {
  const entries = new Map();
  const add = (oldUrl, details) => {
    const normalizedURL = oldUrl.startsWith("/") ? oldUrl : `/${oldUrl}`;
    const existing = entries.get(normalizedURL);
    if (existing) {
      existing.sources = [...new Set([...(existing.sources ?? []), ...(details.sources ?? [])])];
      existing.kinds = [...new Set([...(existing.kinds ?? []), ...(details.kinds ?? [])])];
      if (details.note && !existing.note) existing.note = details.note;
      return;
    }
    entries.set(normalizedURL, {
      oldUrl: normalizedURL,
      expectedStatus: details.expectedStatus,
      ...(details.newUrl ? { newUrl: details.newUrl } : {}),
      kinds: details.kinds ?? [],
      sources: details.sources ?? [],
      ...(details.note ? { note: details.note } : {}),
    });
  };
  return { add, entries };
};

const classifyLiveURL = (pathname, localExists, tagCanonicalPaths) => {
  const normalizedPath = decodeURIComponent(pathname);
  if (
    normalizedPath === "/n8n-service/" ||
    normalizedPath === "/n8n-resources/"
  ) {
    return {
      expectedStatus: "redirect-308",
      newUrl: normalizedPath === "/n8n-service/"
        ? "/n8n-expert/"
        : "/n8n-tutorial-resources/",
      note: "Observed in the checked-in public/_redirects contract.",
    };
  }
  if (
    normalizedPath === "/categories/" ||
    normalizedPath.startsWith("/categories/") ||
    normalizedPath === "/resume/" ||
    normalizedPath === "/n8n-expert-v2/" ||
    normalizedPath === "/html5-video-demo/"
  ) {
    return {
      expectedStatus: "intentional-404",
      note: "Intentional 404 decision from the cutover plan.",
    };
  }
  if (normalizedPath === "/404") {
    return {
      expectedStatus: "intentional-404",
      note: "The live /404 error document is not a retained content route.",
    };
  }
  if (normalizedPath.startsWith("/tags/")) {
    if (normalizedPath === "/tags/") {
      return localExists
        ? { expectedStatus: "retained-200" }
        : {
          expectedStatus: "retained-200",
          note: "The tag index is a retained route; the observed status is recorded by the manifest checker.",
        };
    }
    const canonicalPath = tagCanonicalPaths.get(normalizedPath) ??
      `/tags/${slugifyStr(normalizedPath.slice("/tags/".length, -1))}/`;
    if (canonicalPath !== normalizedPath) {
      return {
        expectedStatus: "redirect-308",
        newUrl: canonicalPath,
        note: "Proposed continuity contract for a legacy tag URL; the observed status is recorded by the manifest checker.",
      };
    }
  }
  if (localExists) return { expectedStatus: "retained-200" };
  return {
    expectedStatus: "retained-200",
    note: "Expected continuity state; the observed status is recorded by the manifest checker.",
  };
};

const main = async () => {
  const [sitemapXML, rssXML] = await Promise.all([
    fetchText(liveSitemapURL),
    fetchText(liveRssURL),
  ]);
  const sitemapURLs = array(parser.parse(sitemapXML)?.urlset?.url)
    .map(url => new URL(url.loc).pathname);
  const rssItems = array(parser.parse(rssXML)?.rss?.channel?.item);

  const tagCanonicalPaths = new Map();
  for (const item of rssItems) {
    for (const category of array(item.category)) {
      const domain = category?.["@_domain"];
      if (!domain) continue;
      const domainPath = withSlash(new URL(domain).pathname);
      if (!domainPath.startsWith("/tags/")) continue;
      const decodedDomainPath = decodeURIComponent(domainPath);
      const label = typeof category === "string" ? category : category?.["#text"] ?? "";
      if (!tagCanonicalPaths.has(decodedDomainPath) && label) {
        const canonicalPath = `/tags/${slugifyStr(label)}/`;
        tagCanonicalPaths.set(decodedDomainPath, canonicalPath);
        tagCanonicalPaths.set(domainPath, canonicalPath);
      }
    }
  }

  const { add, entries } = addEntryFactory();
  const addSitemapURL = async pathname => {
    const classification = classifyLiveURL(
      pathname,
      await outputExists(pathname),
      tagCanonicalPaths
    );
    add(pathname, {
      ...classification,
      kinds: [pathname.startsWith("/tags/") ? "tag-or-pagination" : "live-sitemap"],
      sources: ["live-sitemap-2026-08-26"],
    });
  };
  for (const pathname of sitemapURLs) await addSitemapURL(pathname);

  const customImages = [];
  const tagDomains = new Map();
  const categoryDomains = new Map();
  for (const item of rssItems) {
    const linkPath = new URL(item.link).pathname;
    add(linkPath, {
      expectedStatus: "retained-200",
      kinds: ["article", "live-rss"],
      sources: ["live-rss-2026-08-26"],
      note: "Live RSS article inventory row; the observed status is recorded by the manifest checker.",
    });
    if (item.customImage) customImages.push(new URL(item.customImage).pathname);
    for (const category of array(item.category)) {
      const domain = category?.["@_domain"];
      if (!domain) continue;
      const domainPath = withSlash(new URL(domain).pathname);
      const taxonomy = domainPath.startsWith("/tags/") ? tagDomains : categoryDomains;
      const existing = taxonomy.get(domainPath) ?? {
        count: 0,
        label: typeof category === "string" ? category : category?.["#text"] ?? "",
      };
      existing.count += 1;
      taxonomy.set(domainPath, existing);
    }
  }

  for (const imagePath of customImages) {
    add(imagePath, {
      expectedStatus: "retained-200",
      kinds: ["live-custom-image", "article-asset"],
      sources: ["live-rss-2026-08-26"],
      note: "Live RSS custom-image inventory row; the observed status is recorded by the manifest checker.",
    });
  }

  // The old site used /page/N/ for the home pagination. The live sitemap's
  // /posts/ pages establish the current last page; the /page/N/ mappings are
  // proposed continuity entries because no checked-in B3 redirect exists.
  const legacyConfig = await readFile(join(repoDir, "main.yml"), "utf8");
  const perPageMatch = legacyConfig.match(/index_generator:\s*[\s\S]*?\n\s+per_page:\s*(\d+)/);
  if (!perPageMatch) throw new Error("main.yml index_generator.per_page is required for the URL manifest");
  const indexPerPage = Number(perPageMatch[1]);
  const lastLegacyPage = Math.ceil(rssItems.length / indexPerPage);
  for (let page = 2; page <= Math.max(lastLegacyPage, 1); page++) {
    add(`/page/${page}/`, {
      expectedStatus: "redirect-308",
      newUrl: `/posts/${page}/`,
      kinds: ["home-pagination"],
      sources: ["legacy-route-contract"],
      note: "Proposed continuity contract: map legacy /page/N/ to the Astro /posts/N/ page; the observed status is recorded by the manifest checker.",
    });
  }

  const publishedDates = rssItems
    .map(item => new Date(item.pubDate))
    .filter(date => !Number.isNaN(date.getTime()));
  const yearMonths = new Set();
  const taipeiFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
  });
  for (const date of publishedDates) {
    const parts = Object.fromEntries(
      taipeiFormatter.formatToParts(date)
        .filter(part => part.type === "year" || part.type === "month")
        .map(part => [part.type, part.value])
    );
    yearMonths.add(parts.year);
    yearMonths.add(`${parts.year}/${parts.month}`);
  }
  for (const yearMonth of yearMonths) {
    const [year, month] = yearMonth.split("/");
    const pathname = month ? `/${year}/${month}/` : `/${year}/`;
    add(pathname, {
      expectedStatus: "retained-200",
      kinds: [month ? "month-archive" : "year-archive"],
      sources: ["legacy-route-contract", "live-rss-2026-08-26"],
      note: "Proposed continuity contract: retain the legacy year/month archive; the observed status is recorded by the manifest checker.",
    });
  }

  for (const [tagPath, { count, label }] of tagDomains) {
    const tagName = tagPath.slice("/tags/".length);
    const canonicalTagPath = tagCanonicalPaths.get(tagPath) ??
      `/tags/${slugifyStr(label || tagName.slice(0, -1))}/`;
    const pages = Math.ceil(count / 10);
    for (let page = 2; page <= pages; page++) {
      add(`/tags/${tagName}page/${page}/`, {
        expectedStatus: "redirect-308",
      newUrl: `${canonicalTagPath}${page}/`,
        kinds: ["tag-pagination-old-format"],
        sources: ["legacy-route-contract", "live-rss-2026-08-26"],
        note: "Proposed continuity contract: map legacy /tags/<tag>/page/N/ to Astro /tags/<tag>/N/; the observed status is recorded by the manifest checker.",
      });
    }
  }

  // Preserve a case-sensitive legacy tag example even when the live snapshot
  // currently exposes only its lowercase canonical form.
  add("/tags/Google-Analytics-4/", {
    expectedStatus: "redirect-308",
    newUrl: "/tags/google-analytics-4/",
    kinds: ["tag-original-case"],
    sources: ["legacy-route-contract"],
    note: "Proposed continuity contract for the legacy original-case tag URL; the observed status is recorded by the manifest checker.",
  });
  add("/tags/Google-Analytics-4/page/2/", {
    expectedStatus: "redirect-308",
    newUrl: "/tags/google-analytics-4/2/",
    kinds: ["tag-pagination-original-case"],
    sources: ["legacy-route-contract"],
    note: "Proposed continuity contract for the legacy original-case paginated tag URL; the observed status is recorded by the manifest checker.",
  });

  const sourceAssetFiles = (await walkFiles(sourcePostsDir)).filter(file => {
    const name = file.split(sep).at(-1) ?? "";
    return !name.endsWith(".md") && name !== ".DS_Store";
  });
  for (const file of sourceAssetFiles) {
    const relativePath = relative(sourcePostsDir, file).split(sep).join("/");
    const pathname = `/${relativePath}`;
    add(pathname, {
        expectedStatus: "retained-200",
        kinds: ["source-post-asset"],
        sources: ["source/_posts"],
      note: "Source asset inventory row; the observed status is recorded by the manifest checker.",
    });
  }

  const localBlogFiles = (await walkFiles(astroBlogDir)).filter(file => file.endsWith(".md"));
  for (const file of localBlogFiles) {
    const relativePath = relative(astroBlogDir, file).split(sep).join("/");
    const slug = relativePath.replace(/\.md$/i, "");
    const source = await readFile(file, "utf8");
    const isDraft = /^draft:\s*true\s*$/mi.test(source.split(/^---$/m, 2)[1] ?? "");
    add(`/${slug}/`, {
      expectedStatus: "retained-200",
      kinds: ["local-content"],
      sources: ["astro-blog/src/data/blog"],
      note: isDraft
        ? "Draft source is intentionally not published; retained-200 is the continuity expectation."
        : undefined,
    });
  }

  // Root-level and independent public files are part of the migration URL
  // inventory, but generated article copies are covered by source/_posts rows.
  for (const file of await walkFiles(publicDir)) {
    const relativePath = relative(publicDir, file).split(sep).join("/");
    if (relativePath.startsWith(".") || relativePath === "_redirects") continue;
    const segments = relativePath.split("/");
    const isRootFile = segments.length === 1;
    const isPublicHTML = relativePath.endsWith(".html");
    const isIndependentEntry = isPublicHTML || relativePath.endsWith("/sitemap.xml");
    if (!isRootFile && !isIndependentEntry) continue;
    const pathname = relativePath === "index.html"
      ? "/"
      : relativePath.endsWith("/index.html")
        ? `/${relativePath.slice(0, -"index.html".length)}`
        : `/${relativePath}`;
    const kind = pathname === approvedToolEntryPath
      ? "approved-tool-entry"
      : pathname.startsWith("/tools/")
        ? "tool-static"
        : isRootFile
          ? "root-static"
          : "independent-static";
    add(pathname, {
      expectedStatus: "retained-200",
      kinds: [kind],
      sources: ["astro-blog/public"],
    });
  }

  const outputEntries = [...entries.values()]
    .sort((left, right) => left.oldUrl.localeCompare(right.oldUrl))
    .map(entry => ({
      ...entry,
      kinds: entry.kinds.sort(),
      sources: entry.sources.sort(),
    }));
  const kindCounts = Object.fromEntries(
    [...new Set(outputEntries.flatMap(entry => entry.kinds))].map(kind => [
      kind,
      outputEntries.filter(entry => entry.kinds.includes(kind)).length,
    ])
  );
  const statusCounts = Object.fromEntries(
    ["retained-200", "redirect-308", "intentional-404"].map(status => [
      status,
      outputEntries.filter(entry => entry.expectedStatus === status).length,
    ])
  );

  await writeFile(
    outputPath,
    `${JSON.stringify({
      generatedAt: "2026-08-26",
      generatedBy: "tests/fixtures/b3/generate-url-manifest.mjs",
      liveSources: {
        sitemap: liveSitemapURL,
        rss: liveRssURL,
        fetchedReadOnly: true,
        liveSitemapURLCount: sitemapURLs.length,
        liveRssItemCount: rssItems.length,
        liveCustomImageCount: customImages.length,
        liveTagDomainCount: tagDomains.size,
        liveCategoryDomainCount: categoryDomains.size,
      },
      localSources: {
        astroContentFileCount: localBlogFiles.length,
        sourcePostAssetCount: sourceAssetFiles.length,
        publicInventoryRootAndEntries: outputEntries.filter(entry =>
          entry.kinds.some(kind => kind === "root-static" || kind === "independent-static")
        ).length,
        publicInventoryStaticHTML: outputEntries.filter(entry =>
          entry.kinds.some(kind => kind === "tool-static" || kind === "approved-tool-entry")
        ).length,
      },
      statusVocabulary: ["retained-200", "redirect-308", "intentional-404"],
      inventory: {
        entryCount: outputEntries.length,
        statusCounts,
        kindCounts,
      },
      entries: outputEntries,
    }, null, 2)}\n`,
    "utf8"
  );
  console.log(
    `Generated ${outputEntries.length} URL manifest entries: ${JSON.stringify(statusCounts)}; source assets=${sourceAssetFiles.length}.`
  );
};

main().catch(error => {
  console.error(error?.stack ?? error);
  process.exitCode = 1;
});
