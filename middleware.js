/**
 * Vercel Edge Middleware for Content Negotiation
 *
 * 根據 Accept header 回傳不同格式：
 * - Accept: text/markdown → fetch 對應 .md 並回傳 (Content-Type: text/markdown)
 * - 其他 → 讓請求正常通過回傳 HTML
 *
 * 特殊路徑：
 * - `/` → 回傳 /llms.txt（沒有 root index.md）
 */

export default async function middleware(request) {
  const url = new URL(request.url);
  const acceptHeader = request.headers.get('accept') || '';

  // 只處理明確要求 markdown 的請求
  if (!acceptHeader.includes('text/markdown')) {
    return;
  }

  // 排除不需要處理的路徑（這些沒有 markdown 版本）
  const excludePaths = [
    '/_next', '/api', '/static', '/images', '/css', '/js',
    '/tools', '/links', '/favicon', '/manifest', '/robots',
    '/sitemap', '/.well-known'
  ];
  if (excludePaths.some(p => url.pathname.startsWith(p))) {
    return;
  }

  // 有副檔名的檔案（圖片等）不處理
  if (/\.[a-zA-Z0-9]+$/.test(url.pathname)) {
    return;
  }

  // 決定要 fetch 的目標
  let targetPath;
  if (url.pathname === '/' || url.pathname === '') {
    // 首頁沒有 index.md，改給 llms.txt（內容是 AI-friendly summary）
    targetPath = '/llms.txt';
  } else {
    const cleanPath = url.pathname.replace(/\/$/, '');
    targetPath = `${cleanPath}/index.md`;
  }

  const targetUrl = new URL(targetPath, request.url);
  const upstream = await fetch(targetUrl, {
    headers: { 'accept': 'text/plain' },
  });

  if (!upstream.ok) {
    // Fallback: 讓原始 HTML 請求通過
    return;
  }

  const body = await upstream.text();
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600',
      'x-content-source': targetPath,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
