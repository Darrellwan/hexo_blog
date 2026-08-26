import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { XMLParser } from "fast-xml-parser";

const projectDir = resolve(process.cwd());
const fixtureDir = join(projectDir, "tests/fixtures/b3");
const localPath = join(projectDir, "dist/rss.xml");
const resultPath = join(fixtureDir, "rss-contract-results.json");
const liveURL = "https://www.darrelltw.com/rss.xml";
const siteOrigin = "https://www.darrelltw.com";
const snapshotDate = "2026-08-26";
const rootArticlePathPattern = /^\/[^/]+\/$/;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

const array = value => value == null ? [] : Array.isArray(value) ? value : [value];
const text = value => {
  if (value == null) return null;
  if (typeof value === "object") return value["#text"] ?? null;
  return String(value);
};
const attributes = value =>
  value && typeof value === "object"
    ? Object.fromEntries(Object.entries(value).filter(([key]) => key.startsWith("@_")))
    : {};

const walkFiles = async dir => {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(file));
    else if (entry.isFile()) files.push(file);
  }
  return files;
};

const localSourcePosts = async () => {
  const blogDir = join(projectDir, "src/data/blog");
  const files = (await walkFiles(blogDir)).filter(file => file.endsWith(".md"));
  const posts = new Map();
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const frontmatter = source.split(/^---$/m, 2)[1] ?? "";
    if (/^draft:\s*true\s*$/mi.test(frontmatter)) continue;
    const relativePath = relative(blogDir, file).split(sep).join("/");
    const slug = relativePath
      .replace(/\.md$/i, "")
      .replace(/\/index$/i, "");
    const pubDatetime = frontmatter.match(/^pubDatetime:\s*["']?([^"'\n]+)["']?\s*$/mi)?.[1]?.trim();
    posts.set(`/${slug}/`, {
      pubDatetime: pubDatetime ? new Date(pubDatetime) : null,
    });
  }
  return posts;
};

const normalizeCategory = category => ({
  value: text(category),
  domain: category?.["@_domain"] ?? null,
  attributes: attributes(category),
});

const normalizeItem = item => ({
  title: text(item.title),
  link: text(item.link),
  guid: text(item.guid),
  guidAttributes: attributes(item.guid),
  pubDate: text(item.pubDate),
  description: text(item.description),
  customImage: text(item.customImage),
  enclosure: item.enclosure
    ? { value: text(item.enclosure), attributes: attributes(item.enclosure) }
    : null,
  category: array(item.category).map(normalizeCategory),
  comments: text(item.comments),
});

const normalizeChannel = channel => ({
  title: text(channel.title),
  link: text(channel.link),
  description: text(channel.description),
  pubDate: text(channel.pubDate),
  generator: text(channel.generator),
  atomSelf: channel["atom:link"]
    ? array(channel["atom:link"])
      .map(value => ({ href: value?.["@_href"] ?? null, rel: value?.["@_rel"] ?? null }))
      .filter(value => value.rel === "self")
    : [],
  image: channel.image
    ? {
      url: text(channel.image.url),
      title: text(channel.image.title),
      link: text(channel.image.link),
    }
    : null,
});

const parseFeed = xml => {
  const channel = parser.parse(xml)?.rss?.channel;
  if (!channel) throw new Error("RSS channel is missing");
  return {
    channel: normalizeChannel(channel),
    items: array(channel.item).map(normalizeItem),
  };
};

const canonicalPath = value => {
  try {
    return new URL(value).pathname;
  } catch {
    return null;
  }
};

const urlContract = item => {
  const values = ["link", "guid", "customImage", "comments"]
    .map(field => [field, item[field]])
    .filter(([, value]) => value);
  const rootViolations = [];
  const postsViolations = [];
  const utmViolations = [];
  const commentsViolations = [];
  for (const [field, value] of values) {
    let url;
    try {
      url = new URL(value);
    } catch {
      rootViolations.push({ field, value, reason: "invalid URL" });
      continue;
    }
    if (url.origin !== siteOrigin || !url.pathname.startsWith("/")) {
      rootViolations.push({ field, value, reason: "not an absolute site-root URL" });
    }
    if (["link", "guid"].includes(field) && !rootArticlePathPattern.test(url.pathname)) {
      rootViolations.push({ field, value, reason: "article URL is not /{slug}/" });
    }
    if (url.pathname.startsWith("/posts/") || value.includes("/posts/")) {
      postsViolations.push({ field, value });
    }
    if (field !== "link" && [...url.searchParams.keys()].some(key => key.startsWith("utm_"))) {
      utmViolations.push({ field, value });
    }
  }

  const linkURL = item.link ? new URL(item.link) : null;
  const guidURL = item.guid ? new URL(item.guid) : null;
  let commentsValid = false;
  if (!item.comments) {
    commentsViolations.push({ reason: "comments element is missing" });
  } else {
    try {
      const commentsURL = new URL(item.comments);
      commentsValid =
        commentsURL.origin === siteOrigin &&
        rootArticlePathPattern.test(commentsURL.pathname) &&
        commentsURL.pathname === guidURL?.pathname &&
        commentsURL.search === "" &&
        commentsURL.hash === "#disqus_thread";
      if (!commentsValid) {
        commentsViolations.push({
          value: item.comments,
          guidPath: guidURL?.pathname ?? null,
          reason: "comments URL must match GUID path with #disqus_thread",
        });
      }
    } catch {
      commentsViolations.push({ value: item.comments, reason: "invalid comments URL" });
    }
  }
  const linkUTMValid = Boolean(
    linkURL &&
    linkURL.searchParams.get("utm_source") === "rss_feed" &&
    linkURL.searchParams.get("utm_medium") === "rss" &&
    [...linkURL.searchParams.keys()].every(key => ["utm_source", "utm_medium"].includes(key))
  );
  const canonicalMatch = Boolean(
    linkURL && guidURL &&
    linkURL.origin === siteOrigin &&
    guidURL.origin === siteOrigin &&
    linkURL.pathname === guidURL.pathname &&
    guidURL.search === "" &&
    guidURL.hash === ""
  );
  return {
    rootViolations,
    postsViolations,
    utmViolations,
    commentsViolations,
    commentsValid,
    linkUTMValid,
    canonicalMatch,
  };
};

const diffFields = [
  "title",
  "link",
  "guid",
  "pubDate",
  "description",
  "customImage",
  "enclosure",
  "category",
  "comments",
];

const main = async () => {
  const [localXML, liveResponse, sourcePosts] = await Promise.all([
    readFile(localPath, "utf8"),
    fetch(liveURL),
    localSourcePosts(),
  ]);
  if (!liveResponse.ok) throw new Error(`Live RSS fetch failed (${liveResponse.status})`);
  const [local, live] = [parseFeed(localXML), parseFeed(await liveResponse.text())];
  const localByGUID = new Map(local.items.map(item => [item.guid, item]));
  const liveByGUID = new Map(live.items.map(item => [item.guid, item]));
  const sharedGUIDs = live.items
    .map(item => item.guid)
    .filter(guid => localByGUID.has(guid));
  const liveOnly = live.items.filter(item => !localByGUID.has(item.guid)).map(item => item.guid);
  const localOnly = local.items.filter(item => !liveByGUID.has(item.guid)).map(item => item.guid);

  const fieldDiffs = [];
  for (const guid of sharedGUIDs) {
    const liveItem = liveByGUID.get(guid);
    const localItem = localByGUID.get(guid);
    const differences = [];
    for (const field of diffFields) {
      const liveValue = liveItem[field];
      const localValue = localItem[field];
      if (JSON.stringify(liveValue) !== JSON.stringify(localValue)) {
        differences.push({ field, live: liveValue, local: localValue });
      }
    }
    fieldDiffs.push({ guid, differences });
  }

  const liveSharedOrder = live.items
    .filter(item => localByGUID.has(item.guid))
    .map(item => item.guid);
  const localSharedOrder = local.items
    .filter(item => liveByGUID.has(item.guid))
    .map(item => item.guid);
  const sequenceDiffs = [];
  const sequenceLength = Math.max(liveSharedOrder.length, localSharedOrder.length);
  for (let index = 0; index < sequenceLength; index += 1) {
    if (liveSharedOrder[index] !== localSharedOrder[index]) {
      sequenceDiffs.push({
        sharedPosition: index + 1,
        liveGUID: liveSharedOrder[index] ?? null,
        localGUID: localSharedOrder[index] ?? null,
      });
    }
  }

  const localURLChecks = local.items.map(item => ({
    guid: item.guid,
    ...urlContract(item),
  }));
  const sourceDateDiffs = [];
  for (const item of local.items) {
    const slug = canonicalPath(item.guid);
    const expected = sourcePosts.get(slug)?.pubDatetime;
    const actual = new Date(item.pubDate);
    if (!expected || Number.isNaN(actual.getTime()) || expected.getTime() !== actual.getTime()) {
      sourceDateDiffs.push({
        guid: item.guid,
        expectedPubDatetime: expected?.toISOString() ?? null,
        actualPubDate: item.pubDate,
      });
    }
  }
  const chronologicalViolations = [];
  for (let index = 1; index < local.items.length; index += 1) {
    if (new Date(local.items[index - 1].pubDate) < new Date(local.items[index].pubDate)) {
      chronologicalViolations.push({
        previous: local.items[index - 1].guid,
        next: local.items[index].guid,
      });
    }
  }
  const categoryValueDiffs = [];
  const categoryDomainOnlyGUIDs = [];
  for (const guid of sharedGUIDs) {
    const liveCategories = liveByGUID.get(guid).category;
    const localCategories = localByGUID.get(guid).category;
    const liveValues = liveCategories.map(category => category.value);
    const localValues = localCategories.map(category => category.value);
    if (JSON.stringify(liveValues) !== JSON.stringify(localValues)) {
      categoryValueDiffs.push({ guid, live: liveValues, local: localValues });
    } else if (JSON.stringify(liveCategories) !== JSON.stringify(localCategories)) {
      categoryDomainOnlyGUIDs.push(guid);
    }
  }
  const categoryDomainDifferenceCount = categoryDomainOnlyGUIDs.length;
  const nonCategoryFieldDiffs = fieldDiffs.flatMap(diff =>
    diff.differences.filter(item => item.field !== "category")
      .map(item => ({ guid: diff.guid, ...item }))
  );
  const urlFailures = localURLChecks.filter(check =>
    check.rootViolations.length ||
    check.postsViolations.length ||
    check.utmViolations.length ||
    check.commentsViolations.length ||
    !check.linkUTMValid ||
    !check.canonicalMatch
  );
  const atomSelfValid =
    local.channel.atomSelf.length === 1 &&
    local.channel.atomSelf[0].rel === "self" &&
    (() => {
      try {
        const selfURL = new URL(local.channel.atomSelf[0].href);
        return selfURL.origin === siteOrigin &&
          selfURL.pathname === "/rss.xml" &&
          selfURL.search === "" &&
          selfURL.hash === "";
      } catch {
        return false;
      }
    })();

  const report = {
    generatedAt: snapshotDate,
    source: {
      local: "dist/rss.xml",
      live: liveURL,
      localSourcePosts: "src/data/blog",
      liveFetchReadOnly: true,
    },
    contract: {
      feedPath: "/rss.xml",
      canonicalPathSource: "getPath(filePath), normalized inside rss.xml.ts to one trailing slash",
      pubDateSource: "data.pubDatetime only; modDatetime is not used",
      categoryDomainPolicy: "Local category values are retained in order; domain attributes are intentionally omitted because legacy /categories/ URLs are intentional 404s.",
      channelImagePolicy: "Legacy channel image is omitted because public/image/darrell_icon_64.png is absent in Astro public output.",
    },
    local: {
      itemCount: local.items.length,
      sourcePublishedArticleCount: sourcePosts.size,
      itemCountMatchesSource: local.items.length === sourcePosts.size,
      channel: local.channel,
      itemOrder: local.items.map(item => item.guid),
      chronologicalViolations,
      sourceDateDiffs,
      urlChecks: localURLChecks,
      categoryNodeCount: local.items.reduce((total, item) => total + item.category.length, 0),
      categoryDomainCount: local.items.reduce(
        (total, item) => total + item.category.filter(category => category.domain).length,
        0
      ),
      customImageCount: local.items.filter(item => item.customImage).length,
      commentsCount: local.items.filter(item => item.comments).length,
    },
    live: {
      itemCount: live.items.length,
      channel: live.channel,
      itemOrder: live.items.map(item => item.guid),
      categoryNodeCount: live.items.reduce((total, item) => total + item.category.length, 0),
      categoryDomainCount: live.items.reduce(
        (total, item) => total + item.category.filter(category => category.domain).length,
        0
      ),
      customImageCount: live.items.filter(item => item.customImage).length,
      commentsCount: live.items.filter(item => item.comments).length,
    },
    comparison: {
      sharedGUIDCount: sharedGUIDs.length,
      liveOnly,
      localOnly,
      sharedOrderMatches: sequenceDiffs.length === 0,
      sequenceDiffs,
      fieldDiffs,
      nonCategoryFieldDiffs,
      categoryValueDiffs,
      categoryDomainOnlyGUIDs,
      categoryDomainDifferenceCount,
      intentionalCategoryDomainOnlyDiffs: categoryDomainDifferenceCount,
      channelImageDifference: {
        live: live.channel.image,
        local: local.channel.image,
        intentional: live.channel.image != null && local.channel.image == null,
      },
    },
    validation: {
      localItemCount: local.items.length,
      localItemCountMatchesPublishedArticles: local.items.length === sourcePosts.size,
      allLocalURLsRootCanonical: urlFailures.length === 0 &&
        localURLChecks.every(check => check.rootViolations.length === 0),
      allLocalURLsNoPostsPrefix: localURLChecks.every(check => check.postsViolations.length === 0),
      utmOnlyOnLink: localURLChecks.every(check => check.utmViolations.length === 0),
      allLocalLinksHaveRSSUTM: localURLChecks.every(check => check.linkUTMValid),
      allLocalGuidCanonical: localURLChecks.every(check => check.canonicalMatch),
      allLocalCommentsCanonical: localURLChecks.every(check => check.commentsValid),
      atomSelfExactRSSPath: atomSelfValid,
      pubDateUsesPubDatetime: sourceDateDiffs.length === 0,
      sortedByPubDatetimeDescending: chronologicalViolations.length === 0,
      categoryDomainOmissionIntentional: local.items.every(item =>
        item.category.every(category => Object.keys(category.attributes).length === 0)
      ),
      channelImageOmissionIntentional: live.channel.image != null && local.channel.image == null,
      urlFailures,
    },
  };
  report.passed = Object.values(report.validation)
    .filter(value => typeof value === "boolean")
    .every(Boolean);
  await writeFile(resultPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(
    `RSS B3: local ${local.items.length} items; live ${live.items.length}; shared ${sharedGUIDs.length}; local contract ${report.passed ? "passed" : "failed"}.`
  );
  console.log(
    `RSS differences: live-only ${liveOnly.length}, local-only ${localOnly.length}, non-category field diffs ${nonCategoryFieldDiffs.length}, category-domain-only items ${categoryDomainDifferenceCount}.`
  );
  if (!report.passed) process.exitCode = 1;
};

main().catch(async error => {
  const report = {
    generatedAt: snapshotDate,
    source: { local: "dist/rss.xml", live: liveURL, liveFetchReadOnly: true },
    passed: false,
    error: String(error?.stack ?? error),
  };
  await writeFile(resultPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.error(report.error);
  process.exitCode = 1;
});
