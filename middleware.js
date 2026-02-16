/**
 * Vercel Edge Middleware for Content Negotiation
 *
 * 根據 Accept header 回傳不同格式：
 * - Accept: text/markdown → 回傳 Markdown 原始檔
 * - 其他 → 回傳正常 HTML
 */

export default function middleware(request) {
  const url = new URL(request.url);
  const acceptHeader = request.headers.get('accept') || '';

  // 排除不需要處理的路徑
  const excludePaths = [
    '/_next',
    '/api',
    '/static',
    '/images',
    '/css',
    '/js',
    '/tools',
    '/links',
    '/favicon',
    '/manifest',
    '/robots',
    '/sitemap'
  ];

  // 檢查是否為排除路徑
  const isExcluded = excludePaths.some(path => url.pathname.startsWith(path));
  if (isExcluded) {
    return; // 讓請求正常通過
  }

  // 檢查是否為靜態檔案（副檔名）
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(url.pathname);
  if (hasFileExtension) {
    return; // 讓請求正常通過
  }

  // 檢查 Accept header 是否包含 text/markdown
  if (acceptHeader.includes('text/markdown')) {
    // 移除 trailing slash（如果有）
    const cleanPath = url.pathname.replace(/\/$/, '');

    // Rewrite 到 .md 檔案
    const markdownUrl = new URL(`${cleanPath}/index.md`, request.url);

    console.log(`[Middleware] Content negotiation: ${url.pathname} → ${cleanPath}/index.md`);

    return Response.redirect(markdownUrl, 302);
  }

  // 其他請求正常通過
  return;
}

// 設定 matcher 避免處理靜態資源
export const config = {
  matcher: [
    /*
     * 匹配所有路徑，除了：
     * - _next/static (Next.js static files，雖然 Hexo 不用但保險起見)
     * - _next/image (Next.js image optimization)
     * - favicon.ico
     * - 所有帶副檔名的檔案 (圖片、CSS、JS 等)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
