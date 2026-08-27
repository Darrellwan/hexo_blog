/**
 * Proves the migrated posts keep the anchor ids the live Hexo site publishes.
 *
 * A URL fragment never reaches the server, so a changed heading id is a broken
 * deep link that no redirect can repair. This compares the built HTML against
 * the live HTML directly, rather than recomputing ids from the markdown source:
 * the source route has to re-derive link text, smart quotes and fenced blocks,
 * and every one of those is a way for the check to be wrong about the thing it
 * is supposed to be checking.
 *
 * Reports live anchors the new build does not have. The reverse direction is
 * not a failure: posts edited since the last deploy legitimately gain headings.
 *
 *   npx tsx tests/verify-legacy-anchors.ts [--limit N]
 */
import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.resolve(import.meta.dirname, "../src/data/blog");
const DIST_DIR = path.resolve(import.meta.dirname, "../dist");
const LIVE_ORIGIN = "https://www.darrelltw.com";
const CONCURRENCY = 8;

const limitFlag = process.argv.indexOf("--limit");
const LIMIT = limitFlag === -1 ? Infinity : Number(process.argv[limitFlag + 1]);

/**
 * Every id inside the article body, not just the ones on headings: the live
 * site carries hand-written `<span id="...">` anchors that the migration moved
 * onto the heading itself, and those links must keep working too.
 */
function anchorIds(html: string): Set<string> {
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0] ?? html;
  return new Set([...article.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
}

function headingIds(html: string): string[] {
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0] ?? html;
  return [...article.matchAll(/<h[2-6]\b[^>]*\bid="([^"]*)"/g)].map(m => m[1]);
}

/**
 * Live anchors this build deliberately does not reproduce, with the reason.
 * Anything not listed here is a regression.
 */
const ACCEPTED_LOSSES = new Map<string, string>([
  [
    "claude-code-new-command-line-tool  #Pro-Plan-模型更新",
    "小標已在本機改寫為「Pro 方案模型選擇」，尚未發布；發布時本來就會換錨點",
  ],
  ...([
    "adopt-or-not-要學-n8n-cli-還是交給-AI-Agent",
    "ai-skill-AI-整合：讓-Claude-Code-直接幫你管-n8n",
    "daily-usage-日常操作：workflow、execution、credential",
    "faq-常見問題",
    "limits-目前限制",
    "setup-安裝與連線設定",
    "what-is-n8n-cli-n8n-CLI-是什麼？跟自架的-n8n-指令不一樣",
  ].map(
    tail =>
      [
        `n8n-cli-guide  #span-id-${tail}-span`,
        "小標包在 <span id> 裡造成的畸形 id，站內無人連結；作者要的 #setup 等錨點已改掛在小標本身",
      ] as [string, string]
  )),
]);

function legacyPostSlugs(): string[] {
  const slugs: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".md")) continue;
      const frontmatter = fs
        .readFileSync(full, "utf-8")
        .match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (frontmatter && /^legacyAnchors:\s*true\s*$/m.test(frontmatter[1])) {
        slugs.push(path.basename(entry.name, ".md"));
      }
    }
  };
  walk(BLOG_DIR);
  return slugs.sort();
}

async function main() {
  const slugs = legacyPostSlugs().slice(0, LIMIT);
  console.log(`檢查 ${slugs.length} 篇（legacyAnchors: true）`);

  let liveTotal = 0;
  let broken = 0;
  let unreachable = 0;
  const problems: string[] = [];
  const accepted: string[] = [];

  const queue = [...slugs];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    for (let slug = queue.shift(); slug; slug = queue.shift()) {
      const distPath = path.join(DIST_DIR, slug, "index.html");
      if (!fs.existsSync(distPath)) {
        problems.push(`${slug}: dist 沒有這一頁`);
        unreachable += 1;
        continue;
      }
      const built = anchorIds(fs.readFileSync(distPath, "utf-8"));

      let liveHtml: string;
      try {
        const response = await fetch(`${LIVE_ORIGIN}/${slug}/`);
        if (!response.ok) {
          problems.push(`${slug}: 線上回 HTTP ${response.status}`);
          unreachable += 1;
          continue;
        }
        liveHtml = await response.text();
      } catch (error) {
        problems.push(`${slug}: 抓取失敗 ${(error as Error).message}`);
        unreachable += 1;
        continue;
      }

      const liveAnchors = new Set([
        ...headingIds(liveHtml),
        ...[...liveHtml.matchAll(/<span\s+id="([^"]+)"/g)].map(m => m[1]),
      ]);
      liveTotal += liveAnchors.size;
      for (const id of liveAnchors) {
        if (built.has(id)) continue;
        const key = `${slug}  #${id}`;
        const reason = ACCEPTED_LOSSES.get(key);
        if (reason) {
          accepted.push(`${key}\n      ${reason}`);
          continue;
        }
        broken += 1;
        problems.push(key);
      }
    }
  });
  await Promise.all(workers);

  console.log(`\n線上錨點 ${liveTotal} 個`);
  console.log(`  新版建置沒有的 ${broken} 個`);
  console.log(`  已知且可接受的差異 ${accepted.length} 個`);
  if (unreachable) console.log(`  ${unreachable} 篇無法比對`);
  if (problems.length) {
    console.log("\n對不上的錨點：");
    for (const problem of problems.sort()) console.log(`  ${problem}`);
  }

  if (accepted.length) {
    console.log("\n可接受的差異：");
    for (const entry of accepted.sort()) console.log(`  ${entry}`);
  }
  if (accepted.length !== ACCEPTED_LOSSES.size) {
    console.log(
      `\n注意：白名單有 ${ACCEPTED_LOSSES.size} 筆，這次只用到 ${accepted.length} 筆，請清掉已不需要的。`
    );
  }

  if (broken || unreachable) process.exitCode = 1;
}

await main();
