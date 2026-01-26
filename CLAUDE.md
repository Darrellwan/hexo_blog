# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Commit 強制規則
**在執行任何 git commit 指令前，必須先使用 `commit-guide` skill 查看規範**
- 格式：`[TYPE] 簡短描述`（50 字元內，英文）
- Type：`[NEW POST]` 新文章、`[UPDATE]` 更新、`[FIX]` 修復、`feat:` 新功能、`chore:` 雜項

## Build Commands
- **Dev**: `npm run test` - clean + generate + server（本地開發常用）
- **Dev with drafts**: `npm run test_draft` - 包含草稿文章
- **Dev full**: `npm run test-full` - 含圖片處理的完整開發流程
- **Build**: `npm run build` - 完整建置（images + hexo generate + n8n-sitemap + n8n-snapshots）
- **Posts**: `npx hexo new "文章標題"` - 新增文章
- **Images**: `npm run images:process` - 處理圖片尺寸（新增圖片後執行）
- **n8n Models**: `npm run n8n:generate-models` - 產生 n8n template 頁面

## Architecture
Hexo 8.0 blog for MarTech/automation. **Node.js**: `^20.17.0 || >=22.9.0`

- **Config**: `main.yml` 主設定，`main.local.yml` 本地覆蓋（不進 git）
- **Assets**: `/source/_posts/post-name/` 文章專屬資料夾
- **Custom Tags**: `/scripts/` (data-table.js, quicknav.js, faq.js, note.js)
- **Theme CSS**: `/themes/next/source/css/_custom/`
- **獨立頁面**: `/source/n8n-expert/`、`/source/n8n-2025-wrapped/` 等
  - 使用 `layout: false` front-matter 繞過 Hexo 渲染
  - 在 `main.yml` 的 `skip_render` 加入路徑
- **n8n Template 工具**: `/source/tools/n8n_template/`
- **Documentation**: `/docs/` 存放指南和研究筆記
- **Auto-categorization**: n8n 相關文章由 `/scripts/index.js` 自動加 tag/category

## Claude Code Skills
專案內建 6 個 skills（定義於 `.claude/skills/`，已 gitignore）：
- `commit-guide` - Git commit 規範（必用）
- `n8n-node-research` - 節點研究資料搜集
- `n8n-article-writer` - n8n 教學文章撰寫
- `n8n-update-write` - n8n 版本更新紀錄（6 階段流程 + 評分系統）
- `n8n-template-ideation` - n8n template 點子發想
- `n8n-template-add` - 新增 n8n 模板到模板庫

### n8n-update-write 流程
1. **Phase 1** 版本檢查（快速模式：用戶給連結可跳過）
2. **Phase 2** 內容研究 + 5 標準評分（實用性/話題性/痛點/截圖/類型）
3. **Phase 2.5** 深度分析（痛點/行為/場景/對象）
4. **Phase 3** 建議確認
5. **Phase 4** 內容撰寫
6. **Phase 5** 圖片處理 + 視覺化設計（Infographic）
7. **Phase 6** Commit + Push

### 寫作三原則（FORMAT.md）
1. **先痛點，再解法** - 讓讀者先有共鳴
2. **用對比強調差異** - 以前 vs 現在、表格對照
3. **具體舉例** - 說明應用場景

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
- 個人測試語氣（「實測」「自己測試」「其實」「蠻」）
- 問題解決導向，搭配截圖
- **禁止使用「——」（em dash）**：這是明顯的 AI 寫作痕跡，改用逗號、句號或直接斷句
- Emoji：⚠️ 警告、✅ 確認、💡 提示

## Documentation References
- `/docs/n8n-template-guide.md` - Switch node 結構、LINE Bot 流程
- `/docs/n8n-node-article-guide.md` - n8n 節點文章架構指南
- `/docs/faq-usage-guide.md` - FAQ 標籤使用指南
