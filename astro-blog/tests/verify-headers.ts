/**
 * Checks the deployed Astro routes return the security and discovery headers
 * configured for the migrated site.
 *
 * The script checks response headers only. It sends HEAD requests so it does
 * not load any response body into memory, and it keeps HTTP status separate
 * from header comparison because a 2xx, 3xx or 404 response can still carry
 * the headers under test.
 *
 *   npx tsx tests/verify-headers.ts [--base https://example.com]
 */
import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve(import.meta.dirname, "../dist");
const DEFAULT_BASE = "https://www.darrelltw.com";
const CONCURRENCY = 8;

const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' data: *;",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer-when-downgrade",
  "Permissions-Policy": "geolocation=(self), browsing-topics=()",
} as const;

const ROOT_LINK =
  '</llms.txt>; rel="describedby"; type="text/plain", </sitemap.xml>; rel="sitemap"; type="application/xml"';
// The vercel.json `_bg` Cache-Control rule is deliberately not ported, so no
// Cache-Control value is asserted on cover images. Measured 2026-08-27: that
// rule never fired on the live Vercel site, and it targets `_bg` while more
// than a third of the cover images are named `-bg`. The evidence and the
// decision are in docs/cloudflare-headers-matrix.md.

type HeaderExpectations = Readonly<Record<string, string>>;

type Target = {
  path: string;
  distPath: string;
  headers: HeaderExpectations;
};

type HeaderCheck = {
  target: Target;
  name: string;
  expected: string;
  actual: string | null;
  matches: boolean;
  acceptedReason: string | null;
};

type TargetResult = {
  target: Target;
  url: string;
  status: number | null;
  checks: HeaderCheck[];
  error: string | null;
};

/**
 * Explicitly approved exceptions, keyed by "route header-name".
 *
 * Keep this empty unless a specific mismatch has an approved reason. An
 * exception records the difference; it never changes the strict comparison.
 */
const ACCEPTED_EXCEPTIONS = new Map<string, string>();

const TARGETS: Target[] = [
  {
    path: "/",
    distPath: "index.html",
    headers: { ...SECURITY_HEADERS, Link: ROOT_LINK },
  },
  {
    path: "/gtm-trigger-custom-event/",
    distPath: "gtm-trigger-custom-event/index.html",
    headers: SECURITY_HEADERS,
  },
  {
    path: "/tags/3rd-party-cookie/",
    distPath: "tags/3rd-party-cookie/index.html",
    headers: SECURITY_HEADERS,
  },
  {
    path: "/archives/",
    distPath: "archives/index.html",
    headers: SECURITY_HEADERS,
  },
  {
    // Kept as a target so cover images stay covered by the security headers.
    path: "/gtm-trigger-custom-event/trigger_custom_event_bg.png",
    distPath: "gtm-trigger-custom-event/trigger_custom_event_bg.png",
    headers: SECURITY_HEADERS,
  },
  {
    path: "/_astro/Layout.Xt9bIqXh.css",
    distPath: "_astro/Layout.Xt9bIqXh.css",
    headers: SECURITY_HEADERS,
  },
  {
    path: "/_astro/ui-core.cl31pOIl.js",
    distPath: "_astro/ui-core.cl31pOIl.js",
    headers: SECURITY_HEADERS,
  },
  {
    path: "/404.html",
    distPath: "404.html",
    headers: SECURITY_HEADERS,
  },
  {
    path: "/llms.txt",
    distPath: "llms.txt",
    headers: SECURITY_HEADERS,
  },
  {
    path: "/sitemap.xml",
    distPath: "sitemap.xml",
    headers: SECURITY_HEADERS,
  },
  {
    path: "/robots.txt",
    distPath: "robots.txt",
    headers: SECURITY_HEADERS,
  },
  {
    path: "/gtm-trigger-custom-event/index.md",
    distPath: "gtm-trigger-custom-event/index.md",
    headers: SECURITY_HEADERS,
  },
];

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function baseFromArgs(): URL {
  const baseFlag = process.argv.findIndex(
    argument => argument === "--base" || argument.startsWith("--base=")
  );
  const rawBase =
    baseFlag === -1
      ? DEFAULT_BASE
      : process.argv[baseFlag].startsWith("--base=")
        ? process.argv[baseFlag].slice("--base=".length)
        : process.argv[baseFlag + 1];

  if (!rawBase || rawBase.startsWith("--")) {
    throw new Error("--base 後面需要完整的 http(s) URL");
  }

  const base = new URL(rawBase);
  if (base.protocol !== "http:" && base.protocol !== "https:") {
    throw new Error(`--base 只接受 http(s) URL：${rawBase}`);
  }

  // Keep a trailing slash so URL resolution preserves an optional base path.
  base.pathname = `${base.pathname.replace(/\/+$/, "")}/`;
  base.search = "";
  base.hash = "";
  return base;
}

function targetUrl(base: URL, route: string): string {
  return new URL(route.replace(/^\/+/, ""), base).toString();
}

function missingDistPaths(): string[] {
  return TARGETS.flatMap(target => {
    const localPath = path.join(DIST_DIR, target.distPath);
    try {
      return fs.statSync(localPath).isFile()
        ? []
        : [`${target.path}（${target.distPath} 不是檔案）`];
    } catch {
      return [`${target.path}（${target.distPath} 不存在）`];
    }
  });
}

function exceptionKey(target: Target, headerName: string): string {
  return `${target.path} ${headerName}`;
}

function compareHeaders(target: Target, response: Response): HeaderCheck[] {
  return Object.entries(target.headers).map(([name, expected]) => {
    // Fetch Headers.get is case-insensitive for header names. Do not trim or
    // otherwise normalise the value: the acceptance check is strict ===.
    const actual = response.headers.get(name);
    const matches = actual === expected;
    return {
      target,
      name,
      expected,
      actual,
      matches,
      acceptedReason: matches
        ? null
        : (ACCEPTED_EXCEPTIONS.get(exceptionKey(target, name)) ?? null),
    };
  });
}

async function fetchTarget(
  target: Target,
  base: URL,
  requestHeaders: Record<string, string>
): Promise<TargetResult> {
  const url = targetUrl(base, target.path);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: requestHeaders,
    });
    return {
      target,
      url,
      status: response.status,
      checks: compareHeaders(target, response),
      error: null,
    };
  } catch (error) {
    return {
      target,
      url,
      status: null,
      checks: [],
      error: errorMessage(error),
    };
  }
}

function targetOrder(target: Target): number {
  return TARGETS.indexOf(target);
}

function displayValue(value: string | null): string {
  return value === null ? "（未回傳）" : JSON.stringify(value);
}

async function main() {
  const base = baseFromArgs();
  const missing = missingDistPaths();
  if (missing.length) {
    console.log("無法開始 header 驗收，以下受測路徑不在 astro-blog/dist/：");
    for (const item of missing.sort()) console.log(`  ${item}`);
    process.exitCode = 1;
    return;
  }

  const clientId = process.env.CF_ACCESS_CLIENT_ID;
  const clientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
  const requestHeaders: Record<string, string> = {};
  if (clientId && clientSecret) {
    requestHeaders["CF-Access-Client-Id"] = clientId;
    requestHeaders["CF-Access-Client-Secret"] = clientSecret;
  }

  console.log(`檢查 ${TARGETS.length} 個路徑：${base.toString()}`);
  console.log(
    requestHeaders["CF-Access-Client-Id"]
      ? "CF Access：已帶入 client headers"
      : "CF Access：未帶入 client headers"
  );

  const queue = [...TARGETS];
  const results: TargetResult[] = [];
  const workers = Array.from(
    { length: Math.min(CONCURRENCY, TARGETS.length) },
    async () => {
      for (let target = queue.shift(); target; target = queue.shift()) {
        results.push(await fetchTarget(target, base, requestHeaders));
      }
    }
  );
  await Promise.all(workers);

  results.sort((a, b) => targetOrder(a.target) - targetOrder(b.target));
  const checks = results.flatMap(result => result.checks);
  const unequal = checks.filter(check => !check.matches);
  const failures = unequal.filter(check => !check.acceptedReason);
  const accepted = unequal.filter(check => check.acceptedReason);
  const fetchFailures = results.filter(result => result.error);
  const matching = checks.filter(check => check.matches).length;

  console.log("\n各路徑統計：");
  for (const result of results) {
    if (result.error) {
      console.log(`  ${result.target.path}：抓取失敗`);
      continue;
    }
    const pathMatching = result.checks.filter(check => check.matches).length;
    console.log(
      `  ${result.target.path}：HTTP ${result.status}，${pathMatching}/${result.checks.length} 個 header 相同`
    );
  }

  console.log(`\nHeader 統計：${matching} 個相同、${unequal.length} 個不相同`);

  if (fetchFailures.length) {
    console.log("\n抓取失敗（沒有可供比對的 response）：");
    for (const result of fetchFailures) {
      console.log(`  ${result.target.path}`);
      console.log(`    URL：${result.url}`);
      console.log(`    原因：${result.error}`);
    }
  }

  if (unequal.length) {
    console.log("\nHeader 不符：");
    for (const check of unequal) {
      console.log(`  ${check.target.path} → ${check.name}`);
      console.log(`    預期：${displayValue(check.expected)}`);
      console.log(`    實際：${displayValue(check.actual)}`);
      console.log("    是否相同：否");
      if (check.acceptedReason) {
        console.log(`    白名單理由：${check.acceptedReason}`);
      }
    }
  }

  if (accepted.length) {
    console.log(`\n白名單接受 ${accepted.length} 個已知差異`);
  }

  const usedExceptionKeys = new Set(
    accepted.map(check => exceptionKey(check.target, check.name))
  );
  const unusedExceptions = [...ACCEPTED_EXCEPTIONS.keys()].filter(
    key => !usedExceptionKeys.has(key)
  );
  if (unusedExceptions.length) {
    console.log("\n注意：以下白名單例外這次沒有用到，請清掉已不需要的設定：");
    for (const key of unusedExceptions.sort()) console.log(`  ${key}`);
  }

  if (failures.length || fetchFailures.length) process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  console.log(`驗收腳本無法執行：${errorMessage(error)}`);
  process.exitCode = 1;
}
