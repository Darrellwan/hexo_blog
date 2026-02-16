# Markdown for Agents 驗證報告

**Date:** 2026-02-16
**Status:** ✅ 實作完成並驗證通過

---

## 實作內容

### 1. Hexo Plugin
- **檔案：** `/scripts/markdown-generator.js`
- **功能：** Build 時自動複製 Markdown 原始檔到 `public/{permalink}/index.md`
- **觸發：** `after_generate` filter

### 2. Vercel Rewrite
- **檔案：** `/vercel.json`
- **功能：** 偵測 `Accept: text/markdown` header，自動導向 `index.md`
- **優先順序：** 放在 rewrites 最前面

---

## 本地測試結果

### Build 測試
```bash
npm run build
```

**結果：** ✅ 成功產生 119 個 markdown 檔案

**Console 輸出：**
```
[Markdown for Agents] Generated: n8n-gmail-node/index.md
[Markdown for Agents] Generated: claude-code-new-command-line-tool/index.md
...
[Markdown for Agents] Generated 119 markdown files
```

### 檔案結構驗證

```
public/n8n-gmail-node/
├── index.html          # 原本的 HTML
├── index.md            # 新增的 Markdown
├── blog-n8n-gmail-bg.jpg
└── [其他圖片...]
```

### Content-Type 測試

```bash
curl -I http://localhost:4000/n8n-gmail-node/index.md
```

**結果：** ✅ 正確回傳
```
HTTP/1.1 200 OK
Content-Type: text/markdown; charset=UTF-8
Content-Length: 11564
```

### 內容完整性測試

**檢查項目：**
- [x] Front matter 保留完整
- [x] 自訂標籤保留（`{% darrellImage %}` 等）
- [x] 中文內容正常顯示
- [x] 檔案大小合理

**範例：**
```yaml
---
title: n8n Gmail 節點教學 - 自動化郵件發送和處理
tags:
  - n8n
  - Gmail
categories:
  - n8n
page_type: post
id: n8n-gmail-node
description: 完整教學 n8n Gmail 節點實現郵件自動化流程...
---
```

### 多篇文章驗證

| 文章 | Markdown 檔案 | 大小 | 狀態 |
|------|--------------|------|------|
| n8n-gmail-node | ✅ | 11,564 bytes | 正常 |
| claude-code-new-command-line-tool | ✅ | 12,407 bytes | 正常 |
| n8n-update-log | ✅ | 88,641 bytes | 正常 |

---

## 部署後測試結果

### Edge Middleware 實作

**日期：** 2026-02-16
**方案：** Vercel Edge Middleware（取代 vercel.json rewrites）

#### 為何改用 Middleware

`vercel.json` 的 header-based rewrites **無法用於純靜態網站**：
- Vercel 優先檢查靜態檔案，找到 `index.html` 就直接回傳
- Rewrites 規則只在 dynamic routes 生效
- 靜態檔案會繞過 rewrite 檢查

Middleware 在**請求進入前**執行，可以攔截並處理所有請求。

### 功能測試

```bash
# 測試 1: Accept: text/markdown
curl -I -H "Accept: text/markdown" https://www.darrelltw.com/n8n-gmail-node/
# HTTP/2 302
# location: /n8n-gmail-node/index.md

# 測試 2: 正常請求
curl -I https://www.darrelltw.com/n8n-gmail-node/
# HTTP/2 200
# content-type: text/html; charset=utf-8

# 測試 3: 實際內容
curl -L -H "Accept: text/markdown" https://www.darrelltw.com/n8n-gmail-node/ | head -20
# 成功拿到 markdown front matter 和內容
```

**結果：** ✅ 所有測試通過

### 效能測試

| 文章 | Markdown | HTML | 差異 |
|------|----------|------|------|
| n8n-gmail-node | 0.268s | 0.610s | **-0.34s** |
| claude-code-new-command-line-tool | 0.514s | 0.720s | **-0.21s** |
| n8n-update-log | 0.348s | 0.983s | **-0.63s** |

**結論：** Markdown 請求**反而更快**（.md 檔案比完整 HTML 小很多）

### Cache 行為

```
cf-cache-status: DYNAMIC
```

- Middleware 每次都會執行（需檢查 header）
- 不影響靜態檔案的 CDN cache
- Redirect 後的 `.md` 檔案可以被 CDN cache

### 驗證清單

- [x] `.md` 檔有正確部署到 Vercel
- [x] `Accept: text/markdown` 請求拿到 markdown 內容（302 → .md）
- [x] 一般瀏覽器請求不受影響，拿到 HTML
- [x] `Content-Type` response header 是 `text/markdown`
- [x] front matter 格式正確、內容完整
- [x] 效能測試通過（無延遲，甚至更快）
- [x] 多篇文章測試通過

---

## 技術細節

### Hexo Plugin 實作要點

1. **路徑處理：** 使用 `post.path` 取得 permalink，移除首尾斜線
2. **目錄處理：** 使用 `fs.mkdirSync(recursive: true)` 確保目錄存在
3. **錯誤處理：** Try-catch 包裹檔案操作，避免單一檔案錯誤影響整體 build

### Vercel Rewrite 規則

```json
{
  "source": "/:path*",
  "has": [
    {
      "type": "header",
      "key": "accept",
      "value": "(.*)text/markdown(.*)"
    }
  ],
  "destination": "/:path*/index.md"
}
```

**說明：**
- `/:path*` 匹配所有路徑
- `has` 條件：檢查 `Accept` header 是否包含 `text/markdown`
- `destination` 導向對應的 `index.md`

---

## 參考資料

- [Cloudflare — Introducing Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/)
- [Vercel — Making agent-friendly pages with content negotiation](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation)
- [Vercel — How to serve documentation for agents](https://vercel.com/kb/guide/how-to-serve-documentation-for-agents)
