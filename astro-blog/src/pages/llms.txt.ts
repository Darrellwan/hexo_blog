import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@/config";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sortedPosts = getSortedPosts(posts);
  const siteUrl = SITE.website.replace(/\/$/, "");

  const lines = [
    `# ${SITE.title} | 技術文件與知識庫`,
    "",
    `> ${SITE.desc}`,
    "> 這份索引提供 AI Agent 讀取本站文章原文的入口。",
    "",
    "## 使用說明",
    "",
    "每篇文章都提供 HTML 頁面與原始 Markdown。需要完整內容時，請讀取文章連結下的 `index.md`。",
    "",
    "## 文章索引",
    "",
    ...sortedPosts.map(post => {
      const articleUrl = `${siteUrl}${getPath(post.filePath)}/`;
      const markdownUrl = `${articleUrl}index.md`;
      const description = post.data.description?.trim();
      return [
        `- [${post.data.title}](${articleUrl})`,
        `  - Markdown: ${markdownUrl}`,
        `  - ${description || "原始 Markdown 文章"}`,
      ].join("\n");
    }),
    "",
    "## 其他入口",
    "",
    `- [文章列表](${siteUrl}/posts/)`,
    `- [RSS](${siteUrl}/rss.xml)`,
    `- [作者與服務](${siteUrl}/about/)`,
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
