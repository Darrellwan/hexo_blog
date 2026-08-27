/**
 * Exercises the heading anchor rules end to end through Astro's own markdown
 * processor, so the assertions cover frontmatter handling, `{#id}` stripping
 * and Astro's `rehypeHeadingIds` deferring to the id we set.
 *
 *   npx tsx tests/heading-anchors.ts
 */
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkHeadingAnchors from "../src/plugins/remark-heading-anchors";

const processor = await createMarkdownProcessor({
  remarkPlugins: [remarkHeadingAnchors],
});

async function render(markdown: string, frontmatter: Record<string, unknown>) {
  const { code } = await processor.render(markdown, { frontmatter });
  return code;
}

function idsOf(html: string): string[] {
  return [...html.matchAll(/<h[1-6]\b[^>]*\bid="([^"]*)"/g)].map(m => m[1]);
}

type Case = {
  name: string;
  markdown: string;
  frontmatter: Record<string, unknown>;
  expected: string[];
  /** Text that must survive into the rendered heading. */
  keepsText?: string;
  /** Text that must not appear anywhere in the output. */
  dropsText?: string;
};

const cases: Case[] = [
  {
    name: "legacy 保留 Hexo 的版號寫法與大小寫",
    markdown: "## 1.100.0 Pre-release - 2025-06-23\n\n## Analytics Debugger V2.4.6\n",
    frontmatter: { legacyAnchors: true },
    expected: ["1-100-0-Pre-release-2025-06-23", "Analytics-Debugger-V2-4-6"],
  },
  {
    name: "legacy 保留全形標點（線上就是這樣）",
    markdown: "## Data Tables：支援 CSV 下載\n\n## MCP Client Node（新節點）\n",
    frontmatter: { legacyAnchors: true },
    expected: ["Data-Tables：支援-CSV-下載", "MCP-Client-Node（新節點）"],
  },
  {
    name: "legacy 套用 typographer 的彎引號",
    markdown: "## Don't allow multiple active workflows\n\n## editor: \"Executing\" state\n",
    frontmatter: { legacyAnchors: true },
    expected: [
      "Don’t-allow-multiple-active-workflows",
      "editor-“Executing”-state",
    ],
  },
  {
    name: "legacy 重複小標依 Hexo 規則編號 -2、-3",
    markdown: "## 安裝\n\n## 安裝\n\n## 安裝\n",
    frontmatter: { legacyAnchors: true },
    expected: ["安裝", "安裝-2", "安裝-3"],
  },
  {
    // Hexo's `anchors.level: 2` meant h1 never took part in the numbering, so
    // the h2 keeps the bare slug and the h1 is the one that gets suffixed.
    name: "legacy 的 h1 不佔用 h2 的錨點",
    markdown: "# 安裝\n\n## 安裝\n",
    frontmatter: { legacyAnchors: true },
    expected: ["安裝-2", "安裝"],
  },
  {
    name: "新文章的 h1 照文件順序參與編號",
    markdown: "# 安裝\n\n## 安裝\n",
    frontmatter: {},
    expected: ["安裝", "安裝-2"],
  },
  {
    name: "新文章：版號完整、全形標點折成連字號、轉小寫",
    markdown: "## 1.100.0 Pre-release - 2025-06-23\n\n## Data Tables：支援 CSV 下載\n",
    frontmatter: {},
    expected: ["1-100-0-pre-release-2025-06-23", "data-tables-支援-csv-下載"],
  },
  {
    name: "新文章不套 typographer（渲染出來就是直引號）",
    markdown: "## Don't do this\n",
    frontmatter: {},
    expected: ["don-t-do-this"],
  },
  {
    name: "手寫錨點勝過自動規則，且不出現在標題文字裡",
    markdown: "## 為什麼要用 Merge 節點 {#why-merge}\n",
    frontmatter: {},
    expected: ["why-merge"],
    keepsText: "為什麼要用 Merge 節點",
    dropsText: "{#why-merge}",
  },
  {
    name: "手寫錨點在 legacy 文章一樣有效",
    markdown: "## 安裝與連線設定 {#setup}\n",
    frontmatter: { legacyAnchors: true },
    expected: ["setup"],
    dropsText: "{#setup}",
  },
  {
    name: "自動錨點不會撞到後面才出現的手寫錨點",
    markdown: "## setup\n\n## 安裝 {#setup}\n",
    frontmatter: {},
    expected: ["setup-2", "setup"],
  },
];

let failures = 0;
for (const testCase of cases) {
  const html = await render(testCase.markdown, testCase.frontmatter);
  const actual = idsOf(html);
  const problems: string[] = [];

  if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
    problems.push(`  預期 ${JSON.stringify(testCase.expected)}\n  實際 ${JSON.stringify(actual)}`);
  }
  if (testCase.keepsText && !html.includes(testCase.keepsText)) {
    problems.push(`  標題文字遺失：${testCase.keepsText}`);
  }
  if (testCase.dropsText && html.includes(testCase.dropsText)) {
    problems.push(`  這段不該出現在輸出：${testCase.dropsText}`);
  }

  if (problems.length) {
    failures += 1;
    console.log(`✗ ${testCase.name}`);
    for (const problem of problems) console.log(problem);
  } else {
    console.log(`✓ ${testCase.name}`);
  }
}

console.log(`\n${cases.length - failures}/${cases.length} 通過`);
if (failures) process.exitCode = 1;
