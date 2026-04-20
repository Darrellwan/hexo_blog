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

/**
 * 解析 Accept header，回傳依 q-value 排序後的 type 清單
 * 例："text/html;q=0.9, text/markdown" → [{type:"text/markdown",q:1},{type:"text/html",q:0.9}]
 */
function parseAccept(acceptHeader) {
  return acceptHeader
    .split(',')
    .map(part => {
      const [rawType, ...params] = part.trim().split(';');
      const type = rawType.trim().toLowerCase();
      const qParam = params.find(p => p.trim().startsWith('q='));
      const q = qParam ? parseFloat(qParam.trim().slice(2)) : 1.0;
      return { type, q };
    })
    .sort((a, b) => b.q - a.q);
}

/**
 * 從排序後的 Accept 清單找出最優先能服務的格式
 * 能服務：text/markdown、text/html、text/*、*\/*
 * 回傳 "markdown" | "html" | null（null 代表完全不支援 → 406）
 */
function negotiate(accepts) {
  for (const { type } of accepts) {
    if (type === 'text/markdown') return 'markdown';
    if (type === 'text/html') return 'html';
    if (type === 'text/*' || type === '*/*') return 'html'; // 萬用字元預設給 HTML
  }
  return null; // 完全不支援
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const acceptHeader = request.headers.get('accept') || '';

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

  // 沒有 Accept header → 正常通過
  if (!acceptHeader) return;

  const accepts = parseAccept(acceptHeader);
  const result = negotiate(accepts);

  // 完全不支援的格式 → 406 Not Acceptable
  if (result === null) {
    return new Response('Not Acceptable', {
      status: 406,
      headers: {
        'content-type': 'text/plain',
        'vary': 'Accept',
      },
    });
  }

  // 最高優先是 HTML → 正常通過（讓 Vercel 回傳靜態 HTML）
  if (result === 'html') {
    return;
  }

  // result === 'markdown'：fetch 對應 .md 並回傳
  let targetPath;
  if (url.pathname === '/' || url.pathname === '') {
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
    return;
  }

  const body = await upstream.text();
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'vary': 'Accept',
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
