/**
 * Astro Middleware for Content Negotiation
 *
 * 根據 Accept header 回傳不同格式：
 * - Accept: text/markdown → 302 redirect 到 /{path}/index.md
 * - 其他 → 讓請求正常通過，回傳 HTML
 */

import { defineMiddleware } from "astro:middleware";

// 排除不需要處理的路徑前綴
const EXCLUDED_PREFIXES = [
  "/_astro",
  "/api",
  "/static",
  "/images",
  "/css",
  "/js",
  "/tools",
  "/links",
  "/favicon",
  "/manifest",
  "/robots",
  "/sitemap",
];

// 有副檔名的路徑（圖片、CSS、JS 等靜態資源）
const HAS_FILE_EXTENSION = /\.[a-zA-Z0-9]+$/;

export const onRequest = defineMiddleware(({ request }, next) => {
  const url = new URL(request.url);
  const acceptHeader = request.headers.get("accept") ?? "";

  // 排除特定路徑前綴
  const isExcluded = EXCLUDED_PREFIXES.some(prefix =>
    url.pathname.startsWith(prefix)
  );
  if (isExcluded) {
    return next();
  }

  // 排除帶副檔名的靜態資源路徑
  if (HAS_FILE_EXTENSION.test(url.pathname)) {
    return next();
  }

  // 檢查 Accept header 是否包含 text/markdown
  if (acceptHeader.includes("text/markdown")) {
    // 移除 trailing slash（若有）
    const cleanPath = url.pathname.replace(/\/$/, "");

    // 302 redirect 到對應的 .md 檔案
    const markdownUrl = new URL(`${cleanPath}/index.md`, request.url);

    console.log(
      `[Middleware] Content negotiation: ${url.pathname} → ${cleanPath}/index.md`
    );

    return Response.redirect(markdownUrl, 302);
  }

  // 其他請求正常通過
  return next();
});
