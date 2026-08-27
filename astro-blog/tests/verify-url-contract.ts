/**
 * Compare every legacy public URL with the checked-in Astro build contract.
 *
 * The legacy URL inventory deliberately has two independent sources:
 * the live sitemap and routes generated from the legacy source/configuration.
 * New-site state is never inferred from a slug rule. It is read from dist or
 * from the checked-in _redirects file.
 *
 *   npx tsx astro-blog/tests/verify-url-contract.ts
 */
import fs from "node:fs";
import path from "node:path";
import { parse as parseFrontMatter } from "hexo-front-matter";
import { slugize } from "hexo-util";

const TESTS_DIR = path.resolve(import.meta.dirname);
const ASTRO_DIR = path.resolve(TESTS_DIR, "..");
const REPO_DIR = path.resolve(ASTRO_DIR, "..");
const SOURCE_DIR = path.join(REPO_DIR, "source");
const POSTS_DIR = path.join(SOURCE_DIR, "_posts");
const DIST_DIR = path.join(ASTRO_DIR, "dist");
const REDIRECTS_PATH = path.join(ASTRO_DIR, "public", "_redirects");
const REPORT_PATH = path.join(ASTRO_DIR, "docs", "url-contract.md");
const LIVE_ORIGIN = "https://www.darrelltw.com";
const LIVE_SITEMAP_URL = `${LIVE_ORIGIN}/sitemap.xml`;
const TIME_ZONE = "Asia/Taipei";
const CONCURRENCY = 8;
const REQUEST_TIMEOUT_MS = 20_000;

type ExpectedState = "200" | "308" | "intentional-404" | "舊站已 404" | "缺口";

type LegacyPost = {
  file: string;
  date: Date;
  tags: string[];
  categories: string[];
};

type InventoryEntry = {
  pathname: string;
  sources: Set<string>;
};

type RedirectRule = {
  source: string;
  target: string;
  status: number;
  line: number;
};

type LiveResult = {
  status: number | null;
  error?: string;
};

type ContractResult = {
  pathname: string;
  expected: ExpectedState;
  evidence: string;
  live: LiveResult;
};

const INTENTIONAL_404 = new Map<string, string>([
  ["/n8n-expert-v2/", "決策 5 不搬"],
  ["/html5-video-demo/", "決策 5 不搬"],
  ["/categories/", "決策 5 不搬"],
  ["/resume/", "決策 5 不搬"],
  ["/OneSignalSDKWorker.js", "決策 5 不搬"],
  ["/sw.js", "決策 5 不搬"],
  // Hexo build 產物，不是內容。新站沒有對等輸出，切換後 404 才是正確結果。
  ["/search.json", "Hexo 舊搜尋索引，已由 Pagefind 取代"],
  ["/rss2_template.xml", "Hexo RSS 樣板檔，不是對外內容"],
  ["/404/", "Hexo 把 404 頁掛在這個網址且回 200；新站由 not_found_handling 供應 404.html 並回真正的 404"],
]);

function trimYamlValue(value: string): string {
  return value
    .replace(/\s+#.*$/, "")
    .trim()
    .replace(/^(['"])(.*)\1$/, "$2");
}

function readTopLevelScalar(config: string, key: string): string | undefined {
  const expression = new RegExp(`^${key}:\\s*(.*?)\\s*$`, "m");
  const match = config.match(expression);
  return match ? trimYamlValue(match[1]) : undefined;
}

function readSectionScalar(
  config: string,
  section: string,
  key: string
): string | undefined {
  let active = false;
  for (const line of config.split(/\r?\n/)) {
    const sectionMatch = line.match(/^([^\s#][^:]*):\s*(?:#.*)?$/);
    if (sectionMatch) {
      active = sectionMatch[1] === section;
      continue;
    }
    if (!active) continue;
    const valueMatch = line.match(new RegExp(`^\\s+${key}:\\s*(.*?)\\s*$`));
    if (valueMatch) return trimYamlValue(valueMatch[1]);
  }
  return undefined;
}

function readSectionList(
  config: string,
  section: string,
  key: string
): string[] {
  const values: string[] = [];
  let active = false;
  let reading = false;

  for (const line of config.split(/\r?\n/)) {
    const sectionMatch = line.match(/^([^\s#][^:]*):\s*(?:#.*)?$/);
    if (sectionMatch) {
      active = sectionMatch[1] === section;
      reading = false;
      continue;
    }
    if (!active) continue;
    if (line.match(new RegExp(`^\\s+${key}:\\s*$`))) {
      reading = true;
      continue;
    }
    if (reading) {
      const itemMatch = line.match(/^\s+-\s+(.*?)\s*$/);
      if (itemMatch) {
        values.push(trimYamlValue(itemMatch[1]));
        continue;
      }
      if (/^\s+\S/.test(line) && !/^\s+-\s+/.test(line)) reading = false;
    }
  }

  return values;
}

function readNumber(
  config: string,
  section: string | undefined,
  key: string,
  fallback: number
): number {
  const raw = section
    ? readSectionScalar(config, section, key)
    : readTopLevelScalar(config, key);
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function readBoolean(
  config: string,
  section: string,
  key: string,
  fallback: boolean
): boolean {
  const raw = readSectionScalar(config, section, key);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return fallback;
}

function normalizeRoute(value: string): string {
  const route = value.startsWith("/") ? value : `/${value}`;
  if (route === "/") return route;
  return route.endsWith("/") || path.extname(route) ? route : `${route}/`;
}

function routeJoin(base: string, ...segments: Array<string | number>): string {
  const baseParts = base.split("/").filter(Boolean);
  const parts = [...baseParts, ...segments.map(String).filter(Boolean)];
  return `/${parts.join("/")}/`;
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function sitemapPathnames(xml: string): string[] {
  const paths: string[] = [];
  for (const match of xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)) {
    const loc = decodeXmlEntities(match[1].trim());
    const parsed = new URL(loc, LIVE_ORIGIN);
    paths.push(parsed.pathname || "/");
  }
  return paths;
}

function walkFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function frontMatterOf(file: string): Record<string, unknown> {
  return parseFrontMatter(fs.readFileSync(file, "utf8")) as Record<
    string,
    unknown
  >;
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap(item => stringList(item))
      .map(item => item.trim())
      .filter(Boolean);
  }
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  return value == null ? [] : [String(value).trim()].filter(Boolean);
}

function legacyPosts(): LegacyPost[] {
  return walkFiles(POSTS_DIR)
    .filter(file => file.endsWith(".md") && !file.endsWith(".prompt.md"))
    .map(file => {
      const frontMatter = frontMatterOf(file);
      if (frontMatter.draft === true || frontMatter.published === false) {
        return null;
      }
      const date = new Date(String(frontMatter.date ?? ""));
      if (Number.isNaN(date.getTime())) {
        throw new Error(`文章缺少可解析的 date：${path.relative(REPO_DIR, file)}`);
      }
      return {
        file,
        date,
        tags: stringList(frontMatter.tags),
        categories: stringList(frontMatter.categories),
      } satisfies LegacyPost;
    })
    .filter((post): post is LegacyPost => post !== null);
}

function addInventory(
  inventory: Map<string, InventoryEntry>,
  pathname: string,
  source: string
): void {
  const normalized = normalizeRoute(pathname);
  const existing = inventory.get(normalized);
  if (existing) {
    existing.sources.add(source);
    return;
  }
  inventory.set(normalized, { pathname: normalized, sources: new Set([source]) });
}

function collectSourcePageRoutes(
  inventory: Map<string, InventoryEntry>
): void {
  for (const entry of fs.readdirSync(SOURCE_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    if (entry.name.startsWith("_")) continue;

    const directory = path.join(SOURCE_DIR, entry.name);
    const indexFile = ["index.md", "index.html"]
      .map(name => path.join(directory, name))
      .find(file => fs.existsSync(file));
    if (!indexFile) continue;

    let route = `/${entry.name}/`;
    if (indexFile.endsWith(".md")) {
      const permalink = frontMatterOf(indexFile).permalink;
      if (typeof permalink === "string" && permalink.trim()) {
        route = normalizeRoute(permalink.trim());
      }
    }
    addInventory(
      inventory,
      route,
      `source/${entry.name}/${path.basename(indexFile)} 產生`
    );
  }
}

function collectRootScatteredFiles(
  inventory: Map<string, InventoryEntry>
): void {
  for (const entry of fs.readdirSync(SOURCE_DIR, { withFileTypes: true })) {
    if (entry.name === ".DS_Store" || entry.name.startsWith("_")) continue;
    const fullPath = path.join(SOURCE_DIR, entry.name);
    if (entry.isFile()) {
      addInventory(inventory, `/${entry.name}`, `source/${entry.name}`);
      continue;
    }
    if (entry.name !== ".well-known") continue;
    for (const file of walkFiles(fullPath)) {
      const relativePath = path.relative(SOURCE_DIR, file).split(path.sep).join("/");
      if (path.basename(file) === ".DS_Store") continue;
      addInventory(inventory, `/${relativePath}`, `source/${relativePath}`);
    }
  }
}

function collectConfiguredGeneratedRoutes(
  inventory: Map<string, InventoryEntry>,
  config: string
): void {
  const sitemapPath = readSectionScalar(config, "sitemap", "path");
  if (sitemapPath) addInventory(inventory, sitemapPath, "main.yml sitemap.path");

  const searchPath = readSectionScalar(config, "search", "path");
  if (searchPath) addInventory(inventory, searchPath, "main.yml search.path");

  for (const feedPath of readSectionList(config, "feed", "path")) {
    addInventory(inventory, feedPath, "main.yml feed.path");
  }
}

function collectGeneratedRoutes(
  inventory: Map<string, InventoryEntry>,
  posts: LegacyPost[],
  config: string
): void {
  const paginationDir = readTopLevelScalar(config, "pagination_dir") || "page";
  const indexPath = readSectionScalar(config, "index_generator", "path") ?? "";
  const indexPerPage = readNumber(
    config,
    "index_generator",
    "per_page",
    readNumber(config, undefined, "per_page", 10)
  );
  const totalIndexPages = indexPerPage ? Math.ceil(posts.length / indexPerPage) : 1;
  for (let page = 2; page <= totalIndexPages; page += 1) {
    addInventory(
      inventory,
      routeJoin(indexPath, paginationDir, page),
      "main.yml index_generator + source/_posts 分頁"
    );
  }

  const archiveEnabled = readBoolean(config, "archive_generator", "enabled", true);
  if (archiveEnabled) {
    const archiveDir = readTopLevelScalar(config, "archive_dir") || "archives";
    const archivePerPage = readNumber(
      config,
      "archive_generator",
      "per_page",
      readNumber(config, undefined, "per_page", 10)
    );
    addInventory(inventory, routeJoin(archiveDir), "main.yml archive_dir + archive_generator");
    const totalArchivePages = archivePerPage
      ? Math.ceil(posts.length / archivePerPage)
      : 1;
    for (let page = 2; page <= totalArchivePages; page += 1) {
      addInventory(
        inventory,
        routeJoin(archiveDir, paginationDir, page),
        "main.yml archive_generator.per_page 分頁"
      );
    }

    const formatParts = new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
    });
    const years = new Set<string>();
    const yearMonths = new Set<string>();
    for (const post of posts) {
      const parts = Object.fromEntries(
        formatParts
          .formatToParts(post.date)
          .filter(part => part.type === "year" || part.type === "month")
          .map(part => [part.type, part.value])
      ) as { year?: string; month?: string };
      if (!parts.year || !parts.month) continue;
      years.add(parts.year);
      yearMonths.add(`${parts.year}/${parts.month}`);
    }

    if (readBoolean(config, "archive_generator", "yearly", true)) {
      for (const year of years) {
        addInventory(
          inventory,
          routeJoin(archiveDir, year),
          "main.yml archive_generator.yearly + source/_posts date"
        );
      }
    }
    if (readBoolean(config, "archive_generator", "monthly", true)) {
      for (const yearMonth of yearMonths) {
        const [year, month] = yearMonth.split("/");
        addInventory(
          inventory,
          routeJoin(archiveDir, year, month),
          "main.yml archive_generator.monthly + source/_posts date"
        );
      }
    }
  }

  const tagDir = readTopLevelScalar(config, "tag_dir") || "tags";
  const tagPerPage = readNumber(
    config,
    "tag_generator",
    "per_page",
    readNumber(config, undefined, "per_page", 10)
  );
  const tagPageCounts = new Map<string, number>();
  for (const post of posts) {
    const countsForPost = new Set<string>();
    for (const tag of post.tags) {
      const tagPath = routeJoin(tagDir, encodeURIComponent(slugize(tag)));
      countsForPost.add(tagPath);
      addInventory(
        inventory,
        tagPath,
        `source/_posts front matter tag「${tag}」`
      );
    }
    for (const tagPath of countsForPost) {
      tagPageCounts.set(tagPath, (tagPageCounts.get(tagPath) ?? 0) + 1);
    }
  }
  for (const [tagPath, count] of tagPageCounts) {
    const totalPages = tagPerPage ? Math.ceil(count / tagPerPage) : 1;
    for (let page = 2; page <= totalPages; page += 1) {
      addInventory(
        inventory,
        routeJoin(tagPath, paginationDir, page),
        "main.yml tag_generator + source/_posts tags 分頁"
      );
    }
  }

  const categoryDir = readTopLevelScalar(config, "category_dir") || "categories";
  addInventory(inventory, routeJoin(categoryDir), "main.yml category_dir");
  for (const post of posts) {
    for (const category of post.categories) {
      addInventory(
        inventory,
        routeJoin(categoryDir, encodeURIComponent(slugize(category))),
        `source/_posts front matter category「${category}」`
      );
    }
  }

  collectConfiguredGeneratedRoutes(inventory, config);
  collectSourcePageRoutes(inventory);
  collectRootScatteredFiles(inventory);
}

function redirectPattern(pattern: string): RegExp {
  let expression = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    if (character === "*") {
      expression += ".*";
    } else {
      expression += character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`${expression}$`);
}

function parseRedirects(contents: string): RedirectRule[] {
  const rules: RedirectRule[] = [];
  contents.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const fields = trimmed.split(/\s+/);
    if (fields.length < 3) return;
    const status = Number(fields[fields.length - 1]);
    if (!Number.isInteger(status)) return;
    rules.push({
      source: fields[0],
      target: fields[1],
      status,
      line: index + 1,
    });
  });
  return rules;
}

function matchingRedirect(
  pathname: string,
  rules: RedirectRule[]
): RedirectRule | undefined {
  return rules.find(rule => redirectPattern(rule.source).test(pathname));
}

function outputPathForURL(pathname: string): string {
  const rawPath = pathname.split(/[?#]/, 1)[0] || "/";
  const decodedPath = decodeURIComponent(rawPath);
  const relativePath = decodedPath === "/"
    ? "index.html"
    : decodedPath.endsWith("/")
      ? `${decodedPath.slice(1)}index.html`
      : decodedPath.slice(1);
  const candidate = path.resolve(DIST_DIR, relativePath);
  const root = path.resolve(DIST_DIR);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    throw new Error(`URL 逸出 dist：${pathname}`);
  }
  return candidate;
}

function relativeDistPath(file: string): string {
  return path.relative(ASTRO_DIR, file).split(path.sep).join("/");
}

function intentionalReason(pathname: string): string | undefined {
  const exact = INTENTIONAL_404.get(pathname);
  if (exact) return exact;
  if (pathname === "/categories/" || pathname.startsWith("/categories/")) {
    return "決策 5 不搬（/categories/ 路徑群組）";
  }
  return undefined;
}

function classify(
  entry: InventoryEntry,
  redirectRules: RedirectRule[]
): { expected: ExpectedState; evidence: string } {
  const intentional = intentionalReason(entry.pathname);
  if (intentional) {
    return {
      expected: "intentional-404",
      evidence: `${intentional}；來源：${[...entry.sources].join("、")}`,
    };
  }

  const redirect = matchingRedirect(entry.pathname, redirectRules);
  if (redirect) {
    if (redirect.status === 308) {
      return {
        expected: "308",
        evidence: `_redirects 第 ${redirect.line} 行（${redirect.source} → ${redirect.target}）`,
      };
    }
    return {
      expected: "缺口",
      evidence: `命中 _redirects 第 ${redirect.line} 行，但 status 是 ${redirect.status}，不是 308；來源：${[...entry.sources].join("、")}`,
    };
  }

  const outputPath = outputPathForURL(entry.pathname);
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).isFile()) {
    return {
      expected: "200",
      evidence: `${relativeDistPath(outputPath)} 存在；來源：${[...entry.sources].join("、")}`,
    };
  }

  return {
    expected: "缺口",
    evidence: `${relativeDistPath(outputPath)} 不存在，且未命中 _redirects 308；來源：${[...entry.sources].join("、")}`,
  };
}

async function fetchLive(pathname: string): Promise<LiveResult> {
  try {
    const response = await fetch(`${LIVE_ORIGIN}${pathname}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return { status: response.status };
  } catch (error) {
    return {
      status: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function fetchAll(
  entries: InventoryEntry[]
): Promise<Map<string, LiveResult>> {
  const queue = [...entries];
  const results = new Map<string, LiveResult>();
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    for (let entry = queue.shift(); entry; entry = queue.shift()) {
      results.set(entry.pathname, await fetchLive(entry.pathname));
    }
  });
  await Promise.all(workers);
  return results;
}

function liveStatusText(live: LiveResult): string {
  return live.status === null
    ? `抓取失敗（${live.error ?? "未知錯誤"}）`
    : `HTTP ${live.status}`;
}

function resultEvidence(result: ContractResult): string {
  return `${result.evidence}；舊站 ${liveStatusText(result.live)}`;
}

function writeReport(results: ContractResult[]): void {
  const rows = results
    .slice()
    .sort((left, right) => left.pathname.localeCompare(right.pathname))
    .map(
      result =>
        `| ${result.pathname} | ${result.expected} | ${resultEvidence(result)} |`
    );
  const generatedAt = new Date().toISOString();
  const markdown = [
    "# 舊站 URL 對照結果",
    "",
    "> 本表由 `tests/verify-url-contract.ts` 產生。新版狀態只依 `dist/` 實際檔案與 `public/_redirects` 實際規則判定，舊站狀態逐條抓取線上回應。",
    "",
    `產生時間：${generatedAt}`,
    "",
    "| 舊 URL | 預期新狀態 | 依據 |",
    "|---|---|---|",
    ...rows,
    "",
  ].join("\n");
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, markdown, "utf8");
}

async function main(): Promise<void> {
  const config = fs.readFileSync(path.join(REPO_DIR, "main.yml"), "utf8");
  const redirectRules = parseRedirects(fs.readFileSync(REDIRECTS_PATH, "utf8"));
  const posts = legacyPosts();
  const inventory = new Map<string, InventoryEntry>();

  const sitemapResponse = await fetch(LIVE_SITEMAP_URL, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!sitemapResponse.ok) {
    throw new Error(`抓取 sitemap 失敗：HTTP ${sitemapResponse.status}`);
  }
  for (const pathname of sitemapPathnames(await sitemapResponse.text())) {
    addInventory(inventory, pathname, "live sitemap.xml");
  }

  collectGeneratedRoutes(inventory, posts, config);
  const entries = [...inventory.values()];
  const liveResults = await fetchAll(entries);
  const results = entries.map(entry => {
    const classification = classify(entry, redirectRules);
    return {
      pathname: entry.pathname,
      expected: classification.expected,
      evidence: classification.evidence,
      live: liveResults.get(entry.pathname) ?? {
        status: null,
        error: "沒有取得回應結果",
      },
    } satisfies ContractResult;
  });

  // 舊站自己就回 404 的網址不可能是搬家造成的退化，降級後才不會淹沒真正的缺口。
  for (const result of results) {
    if (result.expected === "缺口" && result.live.status === 404) {
      result.expected = "舊站已 404";
      result.evidence = `${result.evidence}；舊站本來就 404，不是搬家造成的`;
    }
  }

  writeReport(results);

  const count = (state: ExpectedState) =>
    results.filter(result => result.expected === state).length;
  const gaps = results
    .filter(result => result.expected === "缺口")
    .sort((left, right) => left.pathname.localeCompare(right.pathname));
  const liveErrors = results.filter(result => result.live.status === null);

  console.log("舊站 URL → 新站狀態驗收");
  console.log(`總數：${results.length}`);
  console.log(`200：${count("200")}`);
  console.log(`308：${count("308")}`);
  console.log(`預期 404：${count("intentional-404")}`);
  console.log(`舊站已 404：${count("舊站已 404")}`);
  console.log(`缺口：${gaps.length}`);
  if (liveErrors.length) {
    console.log(`舊站回應無法取得：${liveErrors.length}`);
  }

  if (gaps.length) {
    console.log("\n缺口清單：");
    for (const gap of gaps) {
      console.log(`  ${gap.pathname}：舊站 ${liveStatusText(gap.live)}`);
    }
  }

  console.log(`\n完整對照表：${path.relative(REPO_DIR, REPORT_PATH)}`);
  if (gaps.length || liveErrors.length) process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
}
