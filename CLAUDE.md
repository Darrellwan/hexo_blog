# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Git Commit 強制規則
**在執行任何 git commit 指令前，必須先使用 `commit-guide` skill 查看規範**
- 不允許在未啟用 skill 的情況下建立 commit
- 使用方式：當用戶要求 commit 時，先執行 skill 再進行操作

## Build Commands
- **Dev**: `npm run test` - clean + generate + server（本地開發常用）
- **Dev with local config**: `npm run dev` - 使用 `main.local.yml` 覆蓋設定
- **Dev with drafts**: `npm run test_draft` - 包含草稿文章
- **Dev full**: `npm run test-full` - 包含圖片處理的完整測試
- **Posts**: `npx hexo new "文章標題"` - 新增文章
- **Images**: `npm run images:process` - 處理圖片尺寸（新增圖片後執行）
- **n8n Models**: `npm run n8n:generate-models` - 產生 n8n template 頁面

## Architecture
Hexo blog for MarTech/automation. Key points:
- **Config**: `main.yml` 主設定，`main.local.yml` 本地覆蓋（不進 git）
- **Assets**: `/source/_posts/post-name/` 文章專屬資料夾
- **Custom Tags**: `/scripts/` (data-table.js, quicknav.js, faq.js 等)
- **Theme CSS**: `/themes/next/source/css/_custom/` (data-table.styl 等)
- **n8n Expert 頁面**: `/source/n8n-expert/` (獨立 SPA)
- **n8n Template 工具**: `/source/tools/n8n_template/`

## Front Matter Template
```yaml
---
title: 文章標題
tags: [tag1, tag2]
categories: [category]
page_type: post
id: lowercase-hyphenated-id  # 必須小寫+連字號
description: SEO 描述（約 150 字）
bgImage: cover-image.jpg
date: YYYY-MM-DD HH:MM:SS
modified: YYYY-MM-DD HH:MM:SS
---
```

## Custom Tags（定義於 /scripts/）
```markdown
{% darrellImageCover id filename.jpg max-800 %}
{% darrellImage800Alt "alt text" filename.png max-800 %}

{% quickNav %}
[{"text": "章節", "anchor": "anchor-id", "desc": "說明"}]
{% endquickNav %}

{% dataTable style="minimal" align="left" highlight="2,3" %}
[{"欄位1": "值1", "欄位2": "值2"}]
{% enddataTable %}

{% faq %}
[{"question": "問題", "answer": "回答"}]
{% endfaq %}

{% articleCard url="/path/" title="標題" previewText="描述" thumbnail="url" %}
```
**Note**: Anchor ID 必須使用小寫+連字號格式（如 `<h2 id="my-section">`），quickNav 才能正確對應。

## Content Workflow
1. Create post → 2. Add assets → 3. Process images → 4. Test locally

## Writing Style
- Conversational Chinese with English tech terms
- Personal testing references ("實測", "自己測試")
- Problem-solution format with screenshots
- Use emojis: ⚠️ warnings, ✅ confirmations


## n8n Quick Reference
- Switch node: Use `rules.values` structure (not `mode: "chooseBranch"`)
- LINE Bot flow: Webhook → Event Check → Router → Response
- Read `/docs/n8n-template-guide.md` for detailed patterns
- **Auto-categorization**: n8n 相關文章會由 `/scripts/index.js` 自動加上 tag 和 category，無需手動設定

## AI Development Philosophy
- **Think harder** - Always strive to dig deeper and find more nuanced solutions

## Documentation References
- `/docs/n8n-template-guide.md` - Switch node 結構、LINE Bot 流程
- `/docs/n8n-node-article-guide.md` - n8n 節點文章架構指南
- `/docs/faq-usage-guide.md` - FAQ 標籤使用指南

## n8n Expert 服務頁面

### 檔案位置
- **源碼**: `/source/n8n-expert/index.html`
- **CSS**: `/source/n8n-expert/css/` (design-system, animations, components, mobile)
- **JS**: `/source/n8n-expert/js/` (animations, carousel, mobile-interactions, form-config, form-handler, tracking)
- **圖片**: `/source/n8n-expert/images/`

### 表單提交設定
- **Webhook**: `https://darrellinfo-n8n.hnd1.zeabur.app/webhook/darrell-n8n-expert-form`
- **Turnstile Sitekey**: `0x4AAAAAABAkrCdPBH-9dmAs`
- **Turnstile 驗證 Worker**: `https://turnsite-validate-n8n-template.api-worker-darrell-martech.workers.dev/`
- Localhost 自動跳過 Turnstile，可用 `testForm({ submit: true })` 測試

### 頁面特色
- 滾動動畫：`.reveal-fade-up` + `.delay-100/200/300`
- 視差背景：`data-parallax` + `data-parallax-speed`
- SVG Inline Icons：取代 Font Awesome（symbol + use href）
- 表單互動：需求類型變更自動切換 placeholder 和範本

## n8n 更新文章撰寫流程

### 查找正確版本
- 從 GitHub Release 確認：`https://github.com/n8n-io/n8n/releases/tag/n8n%401.xxx.0`
- API 查詢最新正式版：`curl -s "https://api.github.com/repos/n8n-io/n8n/releases?per_page=20" | grep -E '"tag_name"|"prerelease"'`
- **注意**：Pre-release ≠ 正式版

### 更新文章內容
- 在文章**開頭**新增版本更新（不是附加在最後）
- 每個更新項目必須包含：
  - 中英文標題
  - 說明段落（參考既有格式）
  - **所有項目都要有**截圖佔位符：`{% darrellImage800Alt "功能說明文字" n8n-1.xxx.0-feature_name.png max-800 %}`

### 必須更新 Meta 資訊
```yaml
description: n8n 的更新記錄(2025/XX/XX 更新)，最新測試版本為 1.xxx.0，正式版本為 1.xxx.x
modified: 2025-XX-XX XX:XX:XX
```

### 檢查清單
- [ ] 版本號正確（區分 Pre-release 和正式版）
- [ ] **所有**更新項目都有配圖
- [ ] Meta description 已更新
- [ ] Meta modified 已更新