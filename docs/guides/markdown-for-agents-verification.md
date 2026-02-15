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

## 部署後測試計畫

### 測試指令

```bash
# 1. 測試 Accept: text/markdown 請求
curl -H "Accept: text/markdown" https://www.darrelltw.com/n8n-gmail-node/

# 2. 測試一般瀏覽器請求（應該回傳 HTML）
curl https://www.darrelltw.com/n8n-gmail-node/

# 3. 檢查 Content-Type header
curl -I -H "Accept: text/markdown" https://www.darrelltw.com/n8n-gmail-node/
```

### 驗證清單

部署後需確認：
- [ ] `.md` 檔有正確部署到 Vercel
- [ ] `Accept: text/markdown` 請求拿到 markdown 內容
- [ ] 一般瀏覽器請求不受影響，還是拿到 HTML
- [ ] `Content-Type` response header 是 `text/markdown`
- [ ] front matter 格式正確、內容完整

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
