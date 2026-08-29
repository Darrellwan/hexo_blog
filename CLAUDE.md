<!-- SPECTRA:START v1.0.2 -->

# Spectra Instructions

This project uses Spectra for Spec-Driven Development(SDD). Specs live in `openspec/specs/`, change proposals in `openspec/changes/`.

## Use `$spectra-*` skills when:

- A discussion needs structure before coding → `$spectra-discuss`
- User wants to plan, propose, or design a change → `$spectra-propose`
- Tasks are ready to implement → `$spectra-apply`
- There's an in-progress change to continue → `$spectra-ingest`
- User asks about specs or how something works → `$spectra-ask`
- Implementation is done → `$spectra-archive`
- Commit only files related to a specific change → `$spectra-commit`

## Workflow

discuss? → propose → apply ⇄ ingest → archive

- `discuss` is optional — skip if requirements are clear
- Requirements change mid-work? `ingest` → resume `apply`

## Parked Changes

Changes can be parked（暫存）— temporarily moved out of `openspec/changes/`. Parked changes won't appear in `spectra list` but can be found with `spectra list --parked`. To restore: `spectra unpark <name>`. The `$spectra-apply` and `$spectra-ingest` skills handle parked changes automatically.

<!-- SPECTRA:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Astro 遷移交接
進行中的 Hexo → Astro 遷移，詳細交接文件在 `.claude/handoff.md`，新 session 開始前先讀。

### Astro 模板殘留清理
`astro-blog/` 內仍有 AstroPaper 模板預設值待替換：
- `src/pages/about.md` — 整頁是模板內容（satnaing），需改寫為 Darrell 的自介
- 其他檔案如發現 `satnaing`、`astro-paper` 等字串，一律替換

## Git Commit 強制規則
**在執行任何 git commit 指令前，必須先使用 `commit-guide` skill 查看規範**
- 格式：`[TYPE] 簡短描述`（50 字元內，英文）
- Type：`[NEW POST]` 新文章、`[UPDATE]` 更新、`[FIX]` 修復、`feat:` 新功能、`chore:` 雜項

### 文章 commit 前必查：日期
commit 文章前，**必須確認 front matter 的 `date` 和 `updated` 是正確日期**，不是預設或舊值。
```bash
rg "^date:|^updated:" source/_posts/<file>.md
```
⚠️ 欄位名必須是 `updated`（Hexo 標準欄位），**不是 `modified`**。`modified` 是舊自創欄位，Hexo 不讀，會讓更新日期 fallback 成檔案 mtime（Vercel 每次部署都是 fresh clone，mtime 會變成部署日，導致全站文章顯示「今天更新」）。沒有實質更新的文章就不要寫 `updated`，主題會自動不顯示「更新於」。

### Push 必須等用戶授權
commit 完成後**不能自動 push**，必須回報「commit 完成，確認要 push 嗎？」，等用戶明確說「push」才推。

### git revert 會刪除 commit 新增的檔案
`git revert` 不只撤銷修改，也會**刪除該 commit 新增的所有檔案**。
- 例：commit 包含「新增圖片 + 修改文章」→ revert 後圖片消失、文章回舊版
- 需要撤銷 push 但保留新增檔案 → 用 `git checkout <commit-hash> -- <files>` 把檔案撿回來
- **Why:** 2026-05-09 revert 後 n8n-google-sheets-node.md 和所有圖片消失，需手動補救

## Push 後自動檢查流程（強制）
git push 完成後，**不需要問用戶**，自動執行以下步驟：
1. 查最新部署拿 URL：`vercel ls --format json | jq -r '.deployments[0] | .url'`（比 `gh api` 穩定，不依賴 GitHub webhook）
2. **背景**跑 `vercel inspect <url> --wait --timeout 10m` 等部署完成。`--wait` 會阻塞到結束，背景指令結束時 Claude 會被自動叫醒＝事件通知。
   ⚠️ **禁止自己寫輪詢迴圈**（`for i in $(seq 1 30); do vercel ls; sleep 15; done`）。那是每 15 秒發一次網路請求＋佔自己的 turn，`--wait` 把輪詢交給 CLI 自己的 process。
   `--timeout` 預設只有 3m，這個專案含圖片處理常超過，一定要自己加大。
3. 部署成功後，用 `agent-browser` 開啟對應頁面確認改動正常；只驗日期／meta 這類純文字輸出時，`curl` + `rg` 就夠，不必開瀏覽器
4. **效能抽查（改動涉及圖片、版型、腳本時才跑；純文字改動跳過）**：`npx lighthouse <正式站文章URL> --preset=perf --output=json --quiet --chrome-flags="--headless"`，回報效能分、LCP、CLS。⚠️ 一定打 www.darrelltw.com 正式站，不打本機 build；效能分數單次有 ±10 浮動，別當精確值，重點看 CLS 與「比上次大幅退步」。lighthouse 打本機的教訓與 Access 站的打法見 memory `feedback_local_lighthouse_not_the_site`
5. 回報檢查結果給用戶

**禁止用 `vercel deploy` 部署**：它上傳本機工作目錄，會把未追蹤檔案一起送上線。部署一律走 git push 觸發 GitHub 整合。

## Build Commands
- **Dev**: `npm run dev` - clean + generate + server（本地開發常用）
- **Dev with drafts**: `npm run test_draft` - 包含草稿文章
- **Dev full**: `npm run test-full` - 含圖片處理的完整開發流程
- **Build**: `npm run build` - 完整建置（images + hexo generate + n8n-sitemap + n8n-snapshots）
- **Posts**: `npx hexo new "文章標題"` - 新增文章
- **Images（新增/修改圖片後用這個）**: `npm run images:post -- <文章slug>` - 一鍵按正確順序跑 compress → webp → dimensions。**改單篇一律帶 slug**。三支腳本也可單獨跑（`images:compress` / `images:webp` / `images:process`），都有增量快取；`images:webp -- --force` 全站重壓（改 cwebp 參數時才用）
- **n8n Models**: `npm run n8n:generate-models` - 產生 n8n template 頁面

## Architecture
Hexo 8.0 blog for MarTech/automation. **Node.js**: `^20.17.0 || >=22.9.0`

- **Config**: `main.yml` 主設定，`main.local.yml` 本地覆蓋（不進 git）
- **Assets**: `/source/_posts/post-name/` 文章專屬資料夾
  - 截圖命名：`{功能}_{描述}.png`（如 `cowork_plugin_button_location.png`）
  - 禁止使用系統自動產生的名稱（如 `Screenshot_20260201_...`）
- **Custom Tags**: `/scripts/` (data-table.js, quicknav.js, faq.js, note.js)
- **Theme CSS**: `/themes/next/source/css/_custom/`
- **獨立頁面**: `/source/n8n-expert/`、`/source/n8n-2025-wrapped/` 等
  - 使用 `layout: false` front-matter 繞過 Hexo 渲染
  - 在 `main.yml` 的 `skip_render` 加入路徑
- **n8n Template 工具**: `/source/tools/n8n_template/`
- **Documentation**: `/docs/drafts/` 備存草稿、`/docs/guides/` 知識文件
- **正式文章**: 用戶要「文章 md」或正式文章時，直接建立在 `/source/_posts/`；`/docs/drafts/` 只在用戶明確要求草稿或備存時使用。
- **Auto-categorization**: n8n 相關文章由 `/scripts/index.js` 自動加 tag/category

## Claude Code Skills
專案內建 7 個 skills（定義於 `.claude/skills/`，已 gitignore）：
- `commit-guide` - Git commit 規範（必用）
- `article-review` - 文章語法審查（檢查 dataTable、callout、term 等最新寫法）
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
updated: YYYY-MM-DD HH:MM:SS   # 只在文章有實質更新時才寫；欄位名不可用 modified
---
```

### Front Matter description 規範
`description`（約 150 字 SEO 描述）必須精確對應文章**實際涵蓋**的功能。
- **禁止**：寫文章沒提到的功能（避免讀者期望落差、SEO 誤導）
- **Commit 前**：對照 description 和文章 heading 清單，確認每個描述點都有對應 section
- **Why:** 2026-05-09 n8n-google-sheets-node 的 description 包含「OAuth2 vs Service Account」和「AI Agent Tool」，但文章根本沒這兩段

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

{% term def="解釋文字" %}專有名詞{% endterm %}
```
- **重要**：加了 term 後，移除原本的括號說明，避免重複
- 適用：技術名詞、縮寫、需要解釋的概念
- 樣式：橘色底線，hover 顯示深色 tooltip
- **白話原則**：用一般人聽得懂的說明，不要用技術定義
  - ❌ 「Model Context Protocol，Anthropic 發布的開放協議」
  - ✅ 「讓 Claude 能連接你的工具（如 HubSpot、Notion）的技術標準」
- 常用定義參考：`/docs/guides/term-definitions.md`

### 進階內容標示
對於新手可跳過的進階內容，加上 callout 提示：
```markdown
{% callout info %}
這段是進階內容，新手可以先跳過
{% endcallout %}
```

**Note**: Anchor ID 必須使用小寫+連字號格式（如 `<h2 id="my-section">`）

## Writing Style
- 台灣繁體中文，技術詞保留英文
- 個人測試語氣（「實測」「自己測試」「其實」「蠻」）
- 問題解決導向，搭配截圖
- **禁止使用「——」（em dash）**：這是明顯的 AI 寫作痕跡，改用逗號、句號或直接斷句
- Emoji：⚠️ 警告、✅ 確認、💡 提示

## Debug 原則
- **先找已有的正確實作**：當某功能壞掉但類似功能正常時，先查正常的那個怎麼做，直接複製方法，不要猜測或亂試
- 例：Social Share 的 icon 壞掉 → 先看 Social Links 用什麼（Font Awesome），直接用同樣方式
- **Heading anchor 沒有出現**：CSS `.header-anchor` 樣式存在於 theme，但 `main.yml` 的 `permalink: false` 讓 Hexo 不產生對應 HTML 元素。`permalink: false` 的原始原因不明（勿輕易改動，先確認影響範圍）。現行解法：在 `darrell.js` 用 JS 全域 inject，selector 鎖 `.post-body h2[id]`，先判斷 `.header-anchor` 是否已存在再 inject

## 寫作 review 原則

### 用戶二次質疑 = 重查源頭，不要只改措詞

讀者（用戶）對某項敘述的**第二次質疑**——例如先說「你確定嗎」、再說「一般做法不是 X 嗎」——是強烈的 recheck signal，**不應該**：
- 反射式認為「用戶誤解」
- 只把措詞改溫和一點再交
- 沒去查 PR diff / 官方文件 / 實測就回答

**正確做法**：第二次質疑時立刻回到源頭——
1. 該功能的 PR diff（看實際 code 行為）
2. 廠商官方文件（看 spec）
3. 必要時實測（debugger / endpoint 呼叫）

往往會發現第一次回答是「直覺誤判」而非「措詞不準」。

**Why:** 2026-05-20 寫 n8n 2.22.0 Facebook OAuth2 段落，第一次寫「token 自動延展」被用戶質疑「一年沒用會怎樣」我只補了「需 reconnect」；第二次質疑「一般 OAuth 不是自動 refresh」才去看 PR diff + Facebook 文件，發現根本是「Meta 政策不發 refresh_token」的設計差異，不是措詞問題。

**How to apply:** 寫部落格、文章、技術說明時，用戶第二次質疑 = 停下來查源頭。先確認自己是否真的查過 PR / 文件 / 實測，沒查就先說「我沒實測，先暫停下定論」。

## 獨立頁面設計紀錄

### /links/ - Link in Bio 頁面
**位置**：`/source/links/index.html`
**風格**：極簡工業風（深色）
**Mockup**：`/source/links/mockup-b-dark.html`

| 元素 | 設定 |
|------|------|
| 背景 | `#111111` + 網格線 |
| 字體 | JetBrains Mono（標題/標籤）+ Noto Sans TC |
| 配色 | 黑白灰 + 藍色 `#3b82f6` |
| 卡片 | 左圖右文、Premium 預設藍框 |
| Hover | 上移 `translateY(-4px)` + 陰影 |
| 版面 | 左對齊、打破對稱 |

**設計原則**（來自 UI/UX Pro Max + Frontend Design 分析）：
- 必備：`prefers-reduced-motion`、`focus-visible` 樣式
- 避免 AI 感：不用紫藍漸層、不完美對稱、用 Mono 字體增加技術感

### /n8n-expert/ - 專家服務頁面
詳見：`/docs/guides/n8n-expert-page.md`

## Markdown for Agents

實作 AI Agent 可透過 `Accept: text/markdown` 取得文章原始內容：

- **實作方式**：Vercel Edge Middleware (`/middleware.js`)
- **原因**：`vercel.json` rewrites 無法用於純靜態網站（Vercel 優先檢查靜態檔案）
- **效能**：無負面影響（< 1ms overhead），HTML 請求不受影響
- **成本**：$0（省下 Cloudflare Pro $240/年）

**技術細節：**

### Vercel Header-based Rewrites 限制
- `vercel.json` 的 `rewrites` with `has: [{ type: "header" }]` 無法用於 Hexo 靜態網站
- **原因**：Vercel 執行順序是 Static Files → Rewrites → Functions
- 靜態檔案存在時，直接回傳，繞過 rewrite 規則
- **解決方案**：使用 Edge Middleware 在請求進入前攔截

### Edge Middleware 實作
```
Request → Middleware → Static Files → Functions
          ↑ 在這裡攔截！
```

- 檢查 `Accept: text/markdown` header
- **fetch-and-serve**：middleware 內部 `await fetch('/{path}/index.md')` 拿到內容後，用 `Content-Type: text/markdown; charset=utf-8` 直接回 200（**不能用 302 redirect**，grader 不 follow redirect 會判失敗）
- 首頁 `/` 特例：沒有 root index.md，改 serve `/llms.txt`
- Matcher 排除靜態資源（圖片、CSS、JS）和 `/tools/`、`/links/`、`/.well-known/` 等非文章路徑
- 執行成本極低（< 1ms）

### Hexo 會自動產生 122+ 個 `{slug}/index.md`
Hexo build 時觸發 `[Markdown for Agents] Generated` plugin，把每篇文章額外輸出一份 `.md` 版本到 `public/{slug}/index.md`。middleware 就是 fetch 這些檔案。**首頁沒有對應的 md**，所以才特別 route 到 llms.txt。

### Agent Discovery：robots.txt + Link Header
**robots.txt Content-Signal**（宣告 AI 使用偏好）：
```
Content-Signal: ai-train=no, search=yes, ai-input=yes
```
`ai-input=yes` 表示允許 AI 引用內容回答問題 — 跟 llms.txt 意圖一致，帶來源流量。

**Link response header**（`vercel.json` 的 `/` 路徑）：
```
Link: </llms.txt>; rel="describedby"; type="text/plain", </sitemap.xml>; rel="sitemap"; type="application/xml"
```
⚠️ `rel` 值**必須用 IANA registered relation types**，不要自創。isitagentready 認可的 agent-useful rel 清單：`api-catalog`、`service-desc`、`service-doc`、`describedby`。靜態部落格用 `describedby` 指向 llms.txt 最合用。

### Hexo 自訂標籤對 AI 的影響
- Hexo 自訂標籤（如 `{% darrellImage %}`）AI Agent 看不懂
- 但主要文字內容完整（90%+），影響有限
- AI 可從檔名推測內容（如 `n8n_gmail-message.png` → Gmail 訊息截圖）
- **建議**：保持現狀，不需轉換成標準 Markdown

**參考文件：**
- `/docs/guides/markdown-for-agents-verification.md` - 完整驗證報告
- `/docs/guides/markdown-for-agents-performance.md` - 效能與成本分析
- `/docs/guides/middleware-impact-analysis.md` - Middleware 對 HTML 請求的影響
- `/docs/guides/markdown-custom-tags-issue.md` - 自訂標籤影響評估

---

## Documentation References
- `/docs/guides/speculation-rules-architecture.md` - Speculation Rules API 架構與實作指南
- `/docs/guides/hexo-to-astro-migration-plan.md` - Hexo → Astro 遷移計畫（備用方案，暫不執行）
- `/docs/guides/n8n-template-guide.md` - Switch node 結構、LINE Bot 流程
- `/docs/guides/n8n-node-article-guide.md` - n8n 節點文章架構指南
- `/docs/guides/faq-usage-guide.md` - FAQ 標籤使用指南
- `/docs/guides/term-definitions.md` - Term Tooltip 常用定義庫
- `/docs/guides/n8n-expert-page.md` - n8n 專家服務頁面設計參考
