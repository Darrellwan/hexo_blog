# Cloudflare headers 移植矩陣

本文件記錄根目錄 `vercel.json` 的三條 `headers` 規則，移植到 `astro-blog/public/_headers` 的結果。

官方依據：[Workers static assets — headers](https://developers.cloudflare.com/workers/static-assets/headers/)

⚠️ 這個站跑的是 **Workers Static Assets，不是 Cloudflare Pages**，兩者的 `_headers` 支援細節不完全相同，查文件時不要查到 Pages 那一份。

Workers 會套用並合併所有命中的 URL pattern，不是第一條命中後就停止；`_redirects` 比 `_headers` 先套用。移植後的兩條規則（`/*` 與 `/`）沒有同名 header 重疊，所以不需要處理值串接的問題。

## 逐條移植矩陣

| Vercel source | Vercel header 與值 | Cloudflare _headers 寫法 | 逐字相同？ | 行為差異說明 |
| --- | --- | --- | --- | --- |
| `/` | `Link: </llms.txt>; rel="describedby"; type="text/plain", </sitemap.xml>; rel="sitemap"; type="application/xml"` | `/`<br>`Link: </llms.txt>; rel="describedby"; type="text/plain", </sitemap.xml>; rel="sitemap"; type="application/xml"` | 完全相同 | Header 名稱和值相同。Cloudflare 的 broad `/*` 也會命中 `/`，所以首頁會同時收到第三列的五個 security headers。這是合併語意差異，不是 Link header 值的差異。 |
| `/(.*_bg.*)\.(jpg|jpeg|png|gif|webp|svg)$` | `Cache-Control: no-store, no-cache, must-revalidate` | **不移植**（`_headers` 裡沒有對應規則） | 無法移植 | **這條規則在線上從來沒有生效過，所以「不移植」才是維持現況。** 2026-08-27 實測 `https://www.darrelltw.com`：`/gtm-trigger-custom-event/trigger_custom_event_bg.png`、`/n8n-gmail-node/blog-n8n-gmail-bg.jpg`、`/grok-bot-review/blog-grok-bot-review-bg-800.webp` 三者與對照組（非 `_bg` 的 `n8n_gmail_credential.png`）全部回同一個值 `public, max-age=86400, must-revalidate`。原因是 Vercel 的 `source` 走 path-to-regexp 而非原生正規表示式，`\.` 與結尾的 `$` 不是那個意思。規則加於 `cc4465ee`（2024-11-12），同日 `6fd25ea1` 已修過陣列順序，所以失效原因是 pattern 本身，至今 21 個月。另外：`dist/` 裡 144 個檔名含 `_bg`（底線）、111 個含 `-bg`（連字號，`blog-*-bg-*` 的新命名），就算把 pattern 修對，也只涵蓋約一半的封面圖。**不移植的後果**：封面圖沿用平台快取（現況 24 小時），原地換圖最久 24 小時後才對所有讀者生效 —— 這正是過去 21 個月的實際行為。要修這個需求，等切換穩定後單獨做（候選：改用短 `max-age`，或讓封面圖檔名帶內容雜湊），不要夾在搬家裡改，因為搬家的驗收基準是「新舊站行為一致」。
| `/(.*)` | `Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' data: *;`<br>`X-Frame-Options: SAMEORIGIN`<br>`X-Content-Type-Options: nosniff`<br>`Referrer-Policy: no-referrer-when-downgrade`<br>`Permissions-Policy: geolocation=(self), browsing-topics=()` | `/*`<br>`Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' data: *;`<br>`X-Frame-Options: SAMEORIGIN`<br>`X-Content-Type-Options: nosniff`<br>`Referrer-Policy: no-referrer-when-downgrade`<br>`Permissions-Policy: geolocation=(self), browsing-topics=()` | 完全相同 | 五個 header 的名稱和值相同。Cloudflare 的 `/*` 也會命中 `/`，首頁會再和第一列的 Link rule 合併；這是合併語意，不是這五個 header 值的差異。 |

## 驗收時要 curl 的 URL 清單

以下是以 `astro-blog/dist` 已存在檔案為基準的五個驗收項（`tests/verify-headers.ts` 已實作這份清單）。CSS 與 JS 項目包含兩個實際 URL，兩者都要各自檢查。實際執行時，在 URL path 前加上部署的 origin（Phase 3 是 `https://next.darrelltw.com`），再使用 `curl -sSI`；本輪沒有執行 curl。

本清單只列本次 `_headers` 設定的完整 expected custom header set。Cloudflare 自動產生的 `Content-Type`、`ETag`、`Cf-Ray`、`Server` 等平台 headers 不固定，因此不列入。

### 1. 首頁

URL path：`/`

Expected custom headers：

- `Link: </llms.txt>; rel="describedby"; type="text/plain", </sitemap.xml>; rel="sitemap"; type="application/xml"`
- `Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' data: *;`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Permissions-Policy: geolocation=(self), browsing-topics=()`

### 2. 文章頁

URL path：`/2022-martech-trends-bnext/`

Expected custom headers：

- `Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' data: *;`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Permissions-Policy: geolocation=(self), browsing-topics=()`

### 3. 封面圖

URL path：`/2022-martech-trends-bnext/martech_trends_bnext_2022_bg-800.webp`

Expected custom headers：

- `Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' data: *;`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Permissions-Policy: geolocation=(self), browsing-topics=()`

（**沒有** `Cache-Control` 這一項：`_bg` 規則刻意不移植，理由見上方矩陣。）

### 4. CSS／JS 資產

URL path：`/_astro/Layout.Xt9bIqXh.css`

Expected custom headers：

- `Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' data: *;`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Permissions-Policy: geolocation=(self), browsing-topics=()`

URL path：`/_astro/ui-core.cl31pOIl.js`

Expected custom headers：

- `Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' data: *;`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Permissions-Policy: geolocation=(self), browsing-topics=()`

### 5. 404 頁

URL path：`/404.html`

Expected custom headers：

- `Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' data: *;`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Permissions-Policy: geolocation=(self), browsing-topics=()`

## 驗證狀態（2026-08-27 主線補驗）

A-headers 那一輪只產出靜態檔與本文件，沒有實測。之後主線補了這些：

- `tests/verify-headers.ts` 對線上舊站 `https://www.darrelltw.com` 跑過：**12 個路徑、61 個 header，全部相同，exit 0**。腳本用嚴格 `===` 比對，例外白名單是空的
- `_bg` 規則的失效是實測出來的，不是推論：三個不同路徑形態的 `_bg` 檔加一個非 `_bg` 對照組，四者回傳值完全一樣
- 尚未實測的部分：`_headers` 在 Cloudflare 上的實際套用結果。要等 Phase 3 部署到 `next.darrelltw.com` 之後，用同一支腳本加 `--base https://next.darrelltw.com` 重跑（腳本已支援 Access service token 的兩個環境變數）
