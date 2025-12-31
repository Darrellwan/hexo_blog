# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Git Commit 強制規則
**在執行任何 git commit 指令前，必須先使用 `commit-guide` skill 查看規範**
- 不允許在未啟用 skill 的情況下建立 commit
- 格式：`[TYPE] 簡短描述`（50 字元內，英文）
- Type：`[NEW POST]` 新文章、`[UPDATE]` 更新、`[FIX]` 修復、`feat:` 新功能、`chore:` 雜項

## Build Commands
- **Dev**: `npm run test` - clean + generate + server（本地開發常用）
- **Dev with drafts**: `npm run test_draft` - 包含草稿文章
- **Build**: `npm run build` - 完整建置（images + hexo generate + n8n-sitemap + n8n-snapshots）
- **Posts**: `npx hexo new "文章標題"` - 新增文章
- **Images**: `npm run images:process` - 處理圖片尺寸（新增圖片後執行）
- **n8n Models**: `npm run n8n:generate-models` - 產生 n8n template 頁面

## Architecture
Hexo blog for MarTech/automation. **Node.js**: `^20.17.0 || >=22.9.0`

- **Config**: `main.yml` 主設定，`main.local.yml` 本地覆蓋（不進 git）
- **Assets**: `/source/_posts/post-name/` 文章專屬資料夾
- **Custom Tags**: `/scripts/` (data-table.js, quicknav.js, faq.js 等)
- **Theme CSS**: `/themes/next/source/css/_custom/`
- **獨立頁面**: `/source/n8n-expert/`、`/source/n8n-2025-wrapped/` 等
  - 使用 `layout: false` front-matter 繞過 Hexo 渲染
  - 在 `main.yml` 的 `skip_render` 加入路徑
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

{% callout tip %}                        # 類型：tip/info/warning/error
內容文字，支援 Markdown
{% endcallout %}

{% callout type="warning" title="自訂標題" %}  # 完整語法
內容
{% endcallout %}

{% articleCard url="/path/" title="標題" previewText="描述" thumbnail="url" %}
```
**Note**: Anchor ID 必須使用小寫+連字號格式（如 `<h2 id="my-section">`）

## Writing Style
- 台灣繁體中文，技術詞保留英文
- 個人測試語氣（「實測」「自己測試」）
- 問題解決導向，搭配截圖
- Emoji：⚠️ 警告、✅ 確認、💡 提示

## n8n Quick Reference
- Switch node: 使用 `rules.values` 結構
- LINE Bot: Webhook → Event Check → Router → Response
- **Auto-categorization**: n8n 相關文章由 `/scripts/index.js` 自動加 tag/category

## Documentation References
- `/docs/n8n-template-guide.md` - Switch node 結構、LINE Bot 流程
- `/docs/n8n-node-article-guide.md` - n8n 節點文章架構指南
- `/docs/faq-usage-guide.md` - FAQ 標籤使用指南
