# Blog Task Tracker

## 🔴 待完成

### Meta Ads MCP 文章改寫（實測 + 競品差異化）
- **建立日期**：2026-08-08
- **交接文件**：`handoff/meta-ads-mcp_handoff.md`
- **背景**：`source/_posts/meta-ads-mcp.md`（2026-06-29 寫的觀點文）從未 commit。缺封面圖、內文圖、articleCard、安裝步驟；GA4 MCP 文章 8/3 commit `bab027f` 曾移除指向本篇的推薦卡，本篇上線後要補回。
- **競品盤點**：13 站（中文最強對手 = 行銷地圖 DMAP 8/07，唯一有截圖；英文最深 = Soku）。結論：我方強項（風險判斷、不能做什麼、跟 Ads Manager 比較）競品多半也有；缺安裝步驟、前置條件、截圖；全場空白的是台灣開通實況、AI 真實回傳、AI 答錯實例。
- **本次已實測**（Claude Code 連 `mcp.facebook.com/ads`，唯讀，未做任何寫入）：
  - 工具實際載入 **95 個**，非競品全體宣稱的 29 個（4/29 發布時數字）
  - 台灣三個廣告帳戶 `is_ads_mcp_enabled` 皆 `true`、`is_queryable` 皆 `true`、幣別 TWD
  - 27 檔 campaign 查 2026 YTD 只有 7 檔回成效欄位；改拉 2020 起全期間後那 20 檔全部有花費、`stop_time` 皆早於 2026-01-01 → 確認是「查詢期間無投放則該期間 metric 欄位不回傳」，**不是 bug**，文章不得寫成 bug
  - `status` / `effective_status` / `delivery` 三欄意義不同（6 檔 status=ACTIVE 但 `delivery.status=completed`）。用戶決定此複雜情況不寫進文章
  - **方案門檻更正**：官方文件寫 Free／Pro／Max／Team／Enterprise 皆支援自訂連接器（Free 限一個），競品「需 Pro 以上」為錯誤
- **已產出**：前置條件／安裝步驟／95 工具重點／實測發現 四段草稿；匿名化 dashboard（`scratchpad/meta-ads-dashboard.html`，四張圖已截）
- **待辦**：用戶補 5 張 Claude 介面截圖（僅 OAuth 授權那張需打碼）→ 整併草稿進正式文章 → 砍重複段落調順序 → 換標題（關鍵字加觀點合一，slug 不動）→ `article-review`
- **不做**：token 消耗實測（用戶 8/8 決定跳過）；不建立測試廣告（用戶選唯讀）
- **匿名規則**：campaign 用 A–G 代號、花費改佔比、CPC 改倍數；CTR／曝光／點擊維持真實值

### 實測 n8n Facebook Graph OAuth2 token 過期行為
- **建立日期**：2026-05-20
- **背景**：n8n 2.22.0 新增 Facebook Graph OAuth2 credential（PR #27112）。Facebook OAuth2 與一般 OAuth2 不同 —— **沒有 refresh_token**。短期 token 1-2 小時、長期 token ~60 天，PR diff 沒看到 `fb_exchange_token` 邏輯，實際 token 期限未知。
- **影響**：`source/_posts/n8n-update-log.md` 2.22.0 章節的 Facebook Graph OAuth2 段落目前寫得偏樂觀（「workflow 有定期在跑就會自動延展」），需要實測確認。
- **測試方法**：
  1. 用 Facebook Access Token Debugger（https://developers.facebook.com/tools/debug/accesstoken/）查 token 性質（Expires 欄位）
  2. 或設 workflow `Node: me, Edge: accounts`，隔 3 小時 / 1 週 / 65 天再跑
- **依結果調整**：實測完回頭把文章那段改成精確說法，不要寫死「60 天閒置才過期」或「workflow 有跑就自動延展」
- **✅ 2026-06-24 完成**：n8n 研究結果與 CLI 使用規範已更新至專案文件

### n8n-expert 新版型（v2）上線決策
- **建立日期**：2026-06-22
- **背景**：用 claude.ai/design 設計稿改版 `/source/n8n-expert/` 登陸頁，新版草稿已完成（HTML/CSS/JS）& 用 agent-browser 驗證截圖確認版型與改動（hero/contact/faq/stack/footer 正常）。
- **待決定**：
  1. 用戶確認版型滿意度（2026-07-07 已提供桌面/手機全頁截圖，review 中）
  2. ~~GTM/SEO 搬移~~ ✅ 2026-07-07 實查已就緒（GTM-WRZDBFS 已裝、title/canonical/og/JSON-LD 齊全）
  3. ~~表單後端~~ ✅ 沿用正式頁後端（form-handler.js 與正式頁 byte-identical，同 n8n webhook + `n8n_consult_lead_submitted` 事件，GTM Trigger 280 零改動）
  4. 草稿上線替換時機（預留 canonical 測試環節）；**上線時必須把 `<meta name="robots" content="noindex, nofollow">` 改回 index, follow**
- **2026-07-07 內容第一波優化完成**（版型不動，截圖驗證無破版）：
  - kicker 英文裝飾字 → 中文「n8n 自動化顧問 · 企業流程自動化導入」（v1 QS 到達頁體驗修正在 v2 的延續）
  - FAQ 3 → 6 題（新增：導入價格帶 / Cloud vs 自架 / Zapier‧Make 比較），JSON-LD FAQPage 同步
  - 六張案例卡全部改為真實案例（工安協會客服、融鎰謄本、Mike 多平台發文、台南維克 AI 影片、Jeffrey/Kara 多店報表、IG Scrapper），設計稿虛構數字（↓68%、↑12×、15 分店）全數移除
  - 案例卡假按鈕「VIEW CASE STUDY」（span 不可點）→ `<a href="#contact">諮詢類似需求</a>` 真連結；案例區導言 overclaim（「點擊卡片了解 ROI」）同步修正
  - 服務卡 ERP 補 Odoo 錨點（功福案）
  - ~~FAQ 價格帶待確認~~ ✅ 2026-07-07 用戶拍板定價策略：**專案 5 萬起、常見 5–15 萬、大型 15 萬以上**；包月維護價格從 LP 移除（5,000/9,000 是 deck 未成交數字，實際維護行情參照功福 2-3 萬/月，LP 只留「可選配維運方案」不帶數字）。表單預算選項同步改為 5–15 萬 / 15–50 萬 / 50 萬以上 / 尚在評估（CRM 舊案保留舊區間詞彙，7 月起換新制）
  - 定價一致性後續：① ~~maintenance deck 重工~~ ✅ 2026-07-07 已完成（單項 5–8 萬起、包月 15,000/25,000 月，PPTX 重產；Drive Slides 仍舊價，覆蓋前不可外發——見該專案 task-tracker）；② ⚠️ 恢復 Ads 投放時：廣告文案加「專案 5 萬起」預過濾點擊、暫停「n8n 接案」關鍵字（QS=1 且與高價定位意圖錯配）
- **2026-07-07 上線前文案補強 ✅ 已執行完成**（Sonnet subagent）：`docs/plans/2026-07-07-n8n-expert-v2-copy-prelaunch-plan.md` 五項全過——hero-lede 改寫（去工程語言、帶 n8n 自動化/導入/串接關鍵字）、hero-meta 三格（10+ 專案／5萬 起價／48h 回覆）、導覽中文化（nav/Contact/trust-label）、H2 ×2 帶關鍵字、FAQ 7 題含外包（JSON-LD + JS 雙軌一致）。驗收：關鍵字覆蓋齊、noindex 未動、桌面+手機截圖無破版。→ 剩版型最終確認 + 上線替換（改 noindex）
- **2026-07-08 重大 pivot：文字優化直接上線 v1，不等 v2 版型** ✅（commit `9ceee7b` 已 push，Vercel 部署）。用戶拍板「只要改文字」：同一套文案移植到現行版 `source/n8n-expert/`——lede（5 萬起+關鍵字）、H2 ×2、FAQ 3→5 題（價格帶+外包，JSON-LD 同步）、預算選項新制、**需求類型選項改處境描述**（自動化建置/技術顧問/企業內訓/還不確定，value 用短版、form-config.js key 同步，v1/v2 四檔案一起改）。v2 版型決策照舊獨立進行，v2 的 QS 文字優勢已被 v1 追平，v2 剩純版型/設計價值
- **後續方向**：第二波 = 六篇公開版案例文 + 卡片接文章連結（吃「n8n 應用案例」搜尋意圖）；第三波 = 案例區 build 時預渲染進 HTML（現為 JS innerHTML，爬蟲風險）、blog 既有 n8n 文章內鏈、Ads sitelinks 對齊新內容
- **相關反饋**：[[feedback_chinese_ui_typography]] / [[feedback_claude_design_import_to_production]]

### darrell-voice skill 強化（照 plan 執行）
- **建立日期**：2026-07-15
- **Plan**：`docs/superpowers/plans/2026-07-15-darrell-voice-enhancement.md`（九個 task，含依賴圖與已盤點事實，執行 session 不用重查）
- **內容**：① voice-audit 機械自檢腳本＋測試 ② Threads 語料分層抽樣（原始匯出在 `~/Downloads` 三檔＋`post_predictions.json`）③ 六步 SOP 建 format-threads ④ 掛載 threads-writer / brain-to-threads / threads-post-review ⑤ FB/IG 語料 gate（見 🟡 區）⑥⑦ format-fb / format-ig ⑧ SKILL.md 維護迴路＋觸發實測 ⑨ 端到端實產一篇 Threads 給用戶盲評
- **狀態**：執行中。Task 1–3 已完成並驗證；Task 8 已寫入維護迴路與 audit 路由，Codex 新 session 觸發尚未實測。Task 4 發現 `brain-to-threads` 仍把 `creator-hub/brand_voice.md` 宣告為唯一真源，與新準源衝突，已依 plan 停下等用戶決定；Task 5 已實查本機，等 FB／IG 語料路徑。未 commit、未 push。

### reader-simulator 評測效率優化
- **建立日期**：2026-06-12
- **背景**：修好評測成本紀律後才回頭處理 n8n-cli 文章發布
- **交接文件**：`.claude/reader-sim-efficiency-handoff.md`

### 站內搜尋（local_search）＋ 相依清理
- **建立日期**：2026-08-13
- **狀態**：功能完成、外部 review 完成、四項必修已修並實測，**6 個 commit 未 push**（`db9465f` `3069e6e` `952a3b4` `6996a47` `ab04a1f` `0fbb042`）
- **已完成（本機實測通過）**：
  - 移除 5 個殭屍套件（`hexo-related-popular-posts`、`hexo-helper-seo-structured-data`、`hexo-dynamic-config`、`@vercel/analytics`、`@vercel/speed-insights`），漏洞 48 → 1；剩下的 `image-size` 無修補版且本專案不處理不受信任輸入
  - `npm update` 同 major 升版：hexo 8.1.1→8.1.2、next 主題套件 8.27→8.29（註：站台實際讀本地 `themes/next/`，node_modules 那份未使用）
  - 啟用 `hexo-generator-searchdb@1.5.0`，`search.json` 128 筆 / 936 KB（gzip 340 KB），`preload: false` 只在打開搜尋時下載
  - 搜尋 modal 改 Raycast 風（`themes/next/source/css/_custom/search.styl`），第一版被退 40 分後重做：拉開浮層與頁面的明度階差、加可見邊界、尺寸放大、標題關鍵字不再用底色方塊
  - 鍵盤層（`darrell.js`）：⌘K／⌘F 開啟、↑↓ 移動、Enter 開啟、Esc 關閉、底部快捷鍵提示
  - GA4 dataLayer：`search`（去抖動 700ms）與 `select_item`（ecommerce 結構）。⚠️ **只驗證到「有推進 dataLayer」**，GTM-WRZDBFS 的 tag／trigger 尚未設定，GA4 端未收到任何資料——不可宣稱追蹤已完成
  - 修 `local-search.js` 排序：原本只看命中總次數，長文刷單一關鍵字就能排第一；改為先比命中關鍵字種類數、再比標題命中數
- **本次修掉的坑**（都已註解在檔內）：Stylus 的 `url()` 不能餵字串變數、CSS `min()` 被 Stylus 內建數學函式攔截、`custom.styl` 會被單獨編譯成 `custom.css` 且載入順序在 `main.css` 之後（所以不能用 `+mobile()` mixin）、NexT 全域 `a` 的 `border-bottom` 會在搜尋結果畫多餘橫線
- **外部 review**（2026-08-13，codex `gpt-5.6-sol` @ max 三輪，唯讀）：給 70/100。報告在 `docs/reviews/2026-08-13-local-search-review.md`（⚠️ `docs/` 在 `.gitignore:79`，只在本機、不進版控）
  - 三條必修我逐條回源核對：手機 reduced-motion 破版與 IME 誤觸**屬實**；「GA4 未端到端驗收」屬實但是驗收缺口、不是程式碼 bug
- **本輪已修（每項都在瀏覽器實測，不只看程式碼）**：
  - 手機＋`prefers-reduced-motion` 時 modal 左偏半屏（兩個 `@media` specificity 相同、後者蓋掉 `transform:none`）：補 `(max-width:767px) and (prefers-reduced-motion:reduce)` 交集區塊。實測 x 由 -187.5 → 0
  - 注音組字時 Enter 誤開文章、↑↓ 誤移選取：加 `e.isComposing || e.keyCode === 229` 防護；追蹤層另加 `compositionstart/end`，組字中不送半成品。正常方向鍵未受影響（回歸已驗）
  - modal 開啟時 ⌘F 叫出瀏覽器原生尋找列：`preventDefault()` 移到 `isOpen()` 判斷之前
  - 中文單字（如「水」，實際 7 筆結果）不送 GA4：`MIN_TERM_LENGTH` 2 → 1
  - 選取列樣式重做兩次。**關鍵教訓**：半透明橘疊在深灰上會合成泥褐 `#523c37`，標題對比掉到 3.39:1（比一般列 11.24:1 還糟）。定案為中性不透明亮底 `#45454b`（標題 8.89:1），橘色改給關鍵字用提亮版 `#ff9d66`（純品牌橘 `#fc6423` 當小字只有 3.17:1，過不了 AA），並移除摘要關鍵字的灰底方塊
  - 三個 dataLayer 路徑格式對齊成 GA4 內建 `page_path` 的形狀：`page_path` 加開頭斜線並去掉 `index.html`、`post_path` 移除多餘斜線（`post-related.swig:49`）
- **待辦**：用戶評分視覺 → `git push`（push 後照 CLAUDE.md 流程等 Vercel 部署並驗證）→ 設定 GTM tag/trigger 讓 GA4 真的收到 `search`／`select_item`（`select_item` 頂層的 `search_term` 需另外映射 + 建 event-scoped 自訂維度才會進 GA4）
- **已知延後，未做**：
  - 無障礙整套（focus trap、關閉後焦點還給開啟按鈕、`role="dialog"`、`aria-activedescendant`、關閉鈕改真 `button`）——要動 swig 模板
  - 結果 HTML 改 `createElement` 硬化（目前索引全是自家文章，需索引被污染才可利用，非當前可攻擊）
  - 排序的 token 去重（完整片語與重複字都被算成不同關鍵字）
  - `lastSent` 關閉 modal 時不重設、大小寫未正規化——牽涉「一次搜尋互動」怎麼定義
  - 中文分類／標籤頁的 `page_path` 未做百分比編碼，與 GA4 內建維度對不上（不影響文章頁與搜尋）
  - `custom.css` 會漏出未解析的 `$orange-main`／`$link-main` 字面值（既有問題，與搜尋無關）
- **未處理**：`main.yml` 的 `search:` 設定與本 tracker 更新因同檔混有先前 session 的未提交改動，需分開處理

## 🟡 等外部

### darrell-voice 平台 format 檔待補（FB / IG）
- **建立日期**：2026-07-15
- **背景**：Threads 已用 51 篇分層樣本與 1,214 篇既有成效資料完成 `format-threads.md`；`format-fb.md` 與 `format-ig.md` 維持空殼，等各平台實際發文語料才能建。
- **等什麼**：用戶提供 FB 粉專／個人頁存檔、IG caption 存檔的確切路徑。本機只找到 `creator-hub/ig-post-templates/` 內少數跨平台範本與發布紀錄，不足以當語料庫。
- **後續**：整體強化流程見 🔴 區「darrell-voice skill 強化」的 plan（本項對應其 Task 5–7）。

### ChatGPT Work vs Codex 文章內容拍板
- **建立日期**：2026-07-13
- **狀態**：2026-07-17 已依 `darrell-voice` 重整文字，修正 Quick Chat、桌面／網頁／手機執行環境、Remote 與 Full access 敘述；補上六個網域的實測結果表，移除沒有具名來源的社群反應段落。正式文章不比較 `.venv`，並改用本機住宅／遠端工作室的生活化環境圖。
- **驗證**：`darrell-voice` voice audit 通過；`article-review` draft audit 3/3 PASS、final audit 5/5 PASS；`npm run build` 成功，重新生成的 `index.html` 與 `index.md` 均晚於文章來源，且已在生成結果確認六網域表格存在、舊社群段落不存在。依用戶要求未做無具體風險的瀏覽器巡頁。
- **待確認**：用戶確認文章內容後，才依 `commit-guide` 隔離文章相關檔案提交；如需放六網域終端機截圖，必須使用真實截圖，不從文字結果偽造。未授權 commit 與 push。

## 📋 後續方向

（無）

## ✅ 已完成

- [x] **8/12 全站文章更新日期修正（顯示為部署日的 bug）並上線**
  - 成因：`main.yml` 是 `updated_option: 'mtime'`，而 front matter 寫的是 Hexo 不認的自創欄位 `modified`，所以更新日 fallback 成檔案 mtime；Vercel 每次部署都是 fresh clone → 全站顯示部署當天。考古：2024-04-25 `d9f582d` 首次手寫 `modified`，2024-07-24 `e25fa18` 把主題顯示開關掛在 `post.modified` 上，但顯示值一直是 `post.updated`
  - 改動：29 個檔案 front matter `modified:` → `updated:`（值不動，其中 27 篇 tracked 進 commit）；`main.yml`／`_config.yml` 的 `updated_option` 改 `'date'`；`themes/next/layout/_macro/post.swig:75,85` 顯示開關改 `post.updated`；`themes/next/_config.yml` 的 `another_day` 改 `true`；`CLAUDE.md`＋`docs/guides/n8n-node-article-guide.md` 模板同步
  - codex（`gpt-5.6-sol` @ max）review 抓到真回歸：`bin/calc-n8n-update-log-stats.js:95` 也讀 `data.modified`，會 fallback 成執行時間；已改讀 `data.updated`，實跑驗證 `end_date` 正確
  - codex 另一項「fresh clone build 產出 0 bytes 文章頁」是誤報（它的測試環境沒 npm install）。線上實查 HTTP 200／187 KB／`popular-posts` 出現 12 次
  - commit：`f5af90c`（日期修正）、`38412b6`（統計腳本）、`b46ee2f`（合併遠端 README bot）皆已 push；`f5f8ac4`（CLAUDE.md 的 push 後檢查流程改用 `vercel inspect --wait`）**尚未 push**
  - 線上驗證：`claude-code-fable-5` 顯示 2026-07-26 23:04:41、`n8n-google-sheets-node` 2026-05-10、`ga4-search-console-mcp-install` 2026-08-03；沒有實質更新的 `n8n-cli-guide`／`cursor-mcp-server-guide` 已不顯示「更新於」
  - 未處理（非本次範圍）：codex 建議加 lint（禁 `modified`、驗 `updated >= date`）；`scripts/related-posts.js` 未追蹤，本機與線上跑的是兩套不同的相關文章實作（線上仍用舊 npm plugin，「移除 GA 依賴」從未上線）
  - 部分暫存手法：`CLAUDE.md`、`main.yml`、`docs/guides/n8n-node-article-guide.md`、`claude-code-new-command-line-tool.md`、`claude-managed-agents.md` 都有既有未提交改動，用 `git hash-object -w` + `git update-index --cacheinfo` 只把本次那幾行進 index，工作區未受影響（`git checkout --` 被 hook 攔下是對的）

- [x] **8/2 追加：n8n-expert 首頁文案調整與部署確認**：移除首頁 Hero 定價文案並保留 FAQ 完整說明；確認修改內容已部署至 https://www.darrelltw.com/n8n-expert/（commit `af674b4`）

- [x] **8/2 GA4/Search Console MCP 安裝教學文章完成並上線**
  - 文章 `source/_posts/ga4-search-console-mcp-install.md` 補齊全部截圖（服務帳戶建立表單、JSON key 下載、GA4 Property Access Management 加使用者、Search Console 加使用者、Claude Desktop connectors 檢查等），正式封面圖已換掉 TODO 佔位
  - Search Console Service Account 路徑本次已實測（`sites.list`／`searchAnalytics.query`／`sitemaps.list`／URL Inspection 用「限制」權限皆 200），文章內容已對應修正（原本誤寫「沒有唯讀權限」已更正）
  - QuickNav 死錨點（`install-ga4-mcp`）與標籤錯位已修正；總結段落補進 QuickNav
  - 新增全站共用 `copyable` chip 元件（`themes/next/source/css/_custom/copyable.styl` + `darrell.js`），取代原本每篇文章重複貼的複製功能 HTML/CSS/JS
  - SEO audit 抓到並修復全站性 bug：`json_ld.js` 的 BlogPosting schema `description`/`image` 抓錯欄位（原本判斷不存在的 `page.coverImage`，全站文章結構化資料都 fallback 到預設圖示）；首頁與文章頁 H1 重複（`brand.swig` 加 `is_home()` 判斷，過程中另修正 Hexo `partial()` fragment cache key 只認字串不看 locals 的坑）；全站 title 後綴過長導致 SERP 截斷風險（`main.yml` title 從 38 字砍到 5 字）
  - QuickNav 桌面版長標題換行問題已修（`nav-title` 固定寬度 160px→220px）
  - commit：文章與截圖 `0185810`、SEO schema/H1 修復 `8c992b0`、copyable chip 補齊/QuickNav 寬度 `0adfe38`、title 後綴 `7b618c5`，皆已 push；正式站 https://www.darrelltw.com/ga4-search-console-mcp-install/ 已驗證 200、title 長度、chip 樣式
  - 8/3 推薦卡修復：移除尚未上線的 Meta 文章，只保留 Claude 與 LINE 兩張推薦卡並補上正式封面；缺少 `thumbnail` 時不再輸出空圖片標籤。commit `bab027f` 已 push，Vercel production 為 `READY`，正式頁實查兩張封面均載入成功且沒有空圖片來源
  - `main.yml` 仍有 2 個跟本任務無關的既有未提交變更（`ignore: '**/*.prompt.md'`、EOF 換行符），非本次動作，維持未提交狀態待其他工作線處理

- [x] **7/26 Claude Code Fable 5 文章更新額度現況 + Opus 5 對照並上線**
  - 查官方 support：限時優惠 7/19 結束；7/20 起 Max/premium 訂閱內建（每週 50% 上限），Pro/standard 走 usage credits
  - 新增 `Opus 5 vs Fable 5` 段（anchor `opus5-vs-fable5`）與兩張 benchmark 圖：`opus5-vs-fable5-benchmark.jpg`、`opus5-vs-fable5-effort-cost.jpg`
  - draft/final audit PASS；commit `f8fcb03` 已 push；prod https://www.darrelltw.com/claude-code-fable-5/
  - session-recap 用戶選只要 recap、不開 handoff 新軌

- [x] **7/18 Article voice v2 實驗於 C1 終止，無勝出版本**
  - C1 三題各兩篇共六篇已完成；主要指標把各題最差的高風險事實加未授權步驟總數從 2 降到 0，且沒有題目變差。
  - Klaviyo r1 仍有 1 個未授權低風險事實，因此證據門檻失敗，正式結論為 C1 fail、無 winner。C2、C3、final holdout、整合與候選檔均未執行。
  - 原 `condition-report.json` 因產生器把 C0 condition ID 寫入六個 C1 source-audit 雜湊而失效，原檔保留；`condition-report-v2.json` 只修六個報告引用並通過官方 validator，原始文章與稽核證據未改。
  - 邊界比例獨立複核通過，最差樣本仍有實質操作內容，不是只剩限制聲明的空殼。
  - final holdout 維持封存、勝出版本為空、凍結後內容存取為空；正式寫作流程的凍結檔案清單驗證通過，正式寫作流程未修改。
  - Spectra 已封存在 `openspec/changes/archive/2026-07-18-article-voice-optimization-v2/`；若要再研究，另開新 change 並事前凍結規則，不得從這個封存 change 直接續跑 C2。
  - 正式報告：`/Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/runs/C1/condition-report-v2.json`
  - 終止決策：`/Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/runs/C1/c1-terminal-decision.json`
  - 未 commit、未 push。

- [x] **7/16 n8n 2.31.0 三項功能 preview 實測 + 截圖與文章修正**
  - 在 preview（`n8n-preview-mbp`，實查版本 2.31.0）實測三項：Notion API v3 Data Source Search（回傳真實 data source「哈佛商業管理雜誌」的 id/name/url）、Form Ending 多 binary（`test_1`/`test_2` 兩檔皆送達完成頁）、Form Trigger Show Headers（headers 實際出現在輸出）
  - **文章修正（重要）**：原文寫「Authorization、Cookie、X-Auth-Token 等敏感 header 會被遮蔽」，實測為**錯誤**。三重佐證：① 實測帶 `Authorization: Bearer ...` 送出，輸出完整顯示未遮罩 ② 原始碼 `execution-redaction.service.ts` 第一行 `if (!this.licenseState.isDataRedactionLicensed()) return 'none'` ③ preview 的 `dataRedaction=false`。遮蔽屬 **Enterprise Data Redaction** 授權功能，自架 Community 完全不遮 → 已改寫該段並加 warning callout
  - 多檔案下載實測：Chrome 只自動放行第一個下載，`test_2.txt` 被靜默擋下（另建兩個 probe 連結各點一次也全被擋，證明是瀏覽器 DownloadRequestLimiter 而非 n8n 問題）→ 文章該段已寫具體
  - 三張截圖已換成實際結果圖（1280x800，pngquant 壓縮），舊的設定面板圖備份在 scratchpad；`hexo generate` 驗證圖片與 callout 皆正常渲染
  - preview 上留有三個測試 workflow（`[2.31.0 Test] ...`），其中兩個 Form 已 publish 且有公開 URL，待用戶決定是否停用/刪除
  - **7/16 已 commit**：用戶確認內容後，按版本拆成 5 個 commit（2.27→2.31，含歷史累積未提交段落）：`3676e85`(2.27.0) / `e82f3d0`(2.28.0) / `18f7a48`(2.29.0) / `5e8eb10`(2.30.0) / `f9fc182`(2.31.0)。`image_dimensions.json` 用 swap-stage 只提交各版目標 entry（避免混入其他文章 churn）；2.28.0 annotated 圖與 2 張 2.31.0 多餘圖處理見交接。**尚未 push（待用戶授權）**

- [x] **7/15 session-recap handoff pipeline S0 失敗修復**
  - 7/14 執行 `/session-recap handoff` 時 S0 驗證失敗：呼叫端拿 AskUserQuestion 選項字 'Threads' 當 `--expect-term`，但該詞從未出現在用戶親手打的訊息裡，被 `verify-session.py` 的全命中檢查擋下（判定邏輯本身正確，屬呼叫端違反「逐字複製用戶原文」契約）
  - 修復：在 `session-recap/SKILL.md` 與 `handoff/SKILL.md` 的 expect-term 選詞指示加防呆（明列 AskUserQuestion 選項字、assistant 用詞、tool 結果字串都不算語料）
  - 7/15 重跑 `recap+handoff` 正式產出成功（run `dea6f2b6`，S0 通過、audit 全過、handoff 文件更新）。第一輪重跑曾因 `recap-pipeline.sh` 在執行中被外部改寫（mtime 落在執行期間，skills repo 有未 commit 的 v3 變更）出現幻影 shell 語法錯誤，與 S0 修復無關

- [x] **7/14 darrell-voice 通用聲音 skill 建立 + voice-guide 重寫**
  - 新建 `~/Darrell/skills/darrell-voice/`（SKILL.md + voice-core / extract-methodology / format-article / format-threads / format-fb / format-ig），user-level symlink 已建，7/15 實測觸發正常
  - `blog-article-writer/references/voice-guide.md` 用 26 篇文章分年代完整分析重寫（AI 痕跡平均分 2022 年 1.0 → 2026 年 4.0，2025 年為轉折點）
  - 整合 speak-human-tw（GitHub, MIT）的痕跡分類與「誤殺邊界」「假人味」概念進 voice-core / voice-guide；教訓「建 taxonomy 前先查 prior art」已寫入 memory
  - Codex 端 symlink：dry-run 顯示僅剩 darrell-voice 一個 would-create（其餘 69 unchanged），live 執行待用戶授權

- [x] **7/13 強化文章 skills 與 Codex symlink 正規化**
  - `blog-article-writer`、`article-review` 與 `codex-skill-init` 已強化並通過 20/20 測試，skill repo commit：`d7d72d0`
  - live sync 新增 24 個 project links；完成後 dry-run 為 67 個 links unchanged、3 個 invalid skipped
  - global links 在 live sync 前已是 43 個 direct canonical links，沒有把 project skill 提升到 global scope
  - skill 變更尚未 push

- [x] **7/21 修改 claude-cowork-intro.md + 本地伺服器驗證**：修改 claude-cowork-intro.md 並新增對照表與圖片；驗證本地伺服器渲染正常 | 完成日期：2026-07-21

- [x] **7/2 編輯 n8n 更新記錄文件**（`source/_posts/n8n-update-log.md`）
