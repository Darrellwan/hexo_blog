# Blog Task Tracker

## 🔴 待完成

### automation.darrelltw.com 接案站獨立（新站已部署、上線前保護中）
- **建立日期**：2026-08-16
- **狀態**（8/17 傍晚更新）：新站已部署，**表單與聊天兩條線都實測可用**（聊天的 Qdrant credential 已於 8/17 傍晚重建並驗過）。**未正式公開**（robots 全擋＋noindex header＋Cloudflare Access 允許本人三信箱）
- **計畫**：`docs/plans/2026-08-15-automation-site-plan.md`（docs/ gitignored，僅本機）；**交接**：`handoff/automation-site_handoff.md`
- **已完成（均實測驗證）**：
  - 新 repo `Darrellwan/automation-site`（Astro）→ Cloudflare Workers Static Assets＋Custom Domain `automation.darrelltw.com`
  - v2 深色設計原樣移植（中途 codex 擅自重做淺色版已抓回修正）；hero demo 動畫被 CSP 擋 inline script 已修（外部化 `home.js`）
  - 案例內頁 ×6（v2 portfolio 文案、未編造數據）、服務頁 ×3、sitemap＋robots、`_headers` 安全 header
  - 表單前端 fail-closed＋蜜罐 phone 欄位；聊天端點改指 darn8n；聊天 workflow 已搬 darn8n（此列為 8/16 當下狀態，credential 與 allowedOrigins 已於 8/17 補齊，見下方 8/17 完成區）
  - GTM `GTM-K4GHVMVP` 埋碼（外部檔繞 CSP）＋GTM 內 GA4 接線已發布 v2（GA4 tag `G-6TBPT8PQEJ`＋`form_submit_success`/`chat_open` 事件）
  - blog 側止血：`main.yml` exclude 已 commit（`ac72c83`），防 push 後 v2 原始檔公開
- **2026-08-17 完成（automation-site 共 9 個 commit；前 8 個已 push＋部署＝線上版本 `38b57163`，第 9 個 `e78684b` 只改註解、尚未 push）**：
  - **表單驗證改做在新站自己的 Worker，不是 n8n 節點**（`worker/index.js` 的 `/api/contact`）。決策理由：原本那支 n8n workflow `GYmyA5jBvqisBjgJ` 同時服務部落格 `/n8n-expert/`、`/n8n-expert-v2/`、`/links/`，直接加驗證會擋掉舊頁的真實詢問單。Secret 存 Cloudflare Worker secret，Darrell 自己貼（後台加完**必須部署才生效**，這點踩過）
  - Worker 功能：siteverify＋Turnstile hostname 核對＋蜜罐 `phone` 丟棄＋KV `FORM_DEDUPE` 10 分鐘去重＋欄位 2000 字上限＋必填檢查＋siteverify 5s／n8n 10s 逾時＋上游失敗回 502＋secret 未設定 fail closed（503）
  - **表單真單端到端通過**：n8n 執行 `107294`，payload 帶 `source: automation-site`＋`verified: true`（只有經過 Worker 才會有），Slack／Gmail 草稿／通知信／Sheet 四個出口全跑
  - SEO：五頁 title／description 前置 `n8n`（原本五頁 title 一個 n8n 都沒有，301 導過來會相關性不匹配）；`ProfessionalService` 改用固定站根＋`@id`（原本每頁都把該頁 canonical 當公司網址）；新增 `Person`；首頁 H1 改「用 n8n 讓工作自動運轉」
  - 文案：頁尾標語與全站 6 處把客群縮成「行銷人／中小企業／要會看 code」的用詞改掉；移除點了會落空的頁尾「維運訂閱」連結
  - 修 bug：下拉選單箭頭 hover 時鋪成整排（`background` 簡寫洗掉 `no-repeat`）；FAQ 點擊被 CSP 擋（inline onclick 改事件委派）；新增 `404.html`
  - 聊天數字查核從 **fail open 改 fail closed**：閘門 webhook 失敗時原本會把模型講的價格原封放上畫面，現在含金額或工期的回覆改走罐頭回覆（`gateScrub` 判斷式已用檔內真實函式測 7 情境全過）
  - 聊天兩支 workflow（`pmZZqqc7Oik4WEKA`、`HMXBjbMlB0lAKofq`）`allowedOrigins` 改成 `https://automation.darrelltw.com,http://localhost:4321` 並啟用
  - codex 全站唯讀 review（`gpt-5.6-sol` @ max）：2 紅／13 黃／3 綠，報告在 `~/.codex-handoff/inbox/`。13 黃已修 6 條
  - 導流腳本 `docs/plans/2026-08-17-automation-launch-redirect-runbook.md`（commit `851dc94`，`docs/` 被 gitignore 故用 `-f`）
  - 測試資料已清：Sheet 4 列、Gmail 4 草稿＋2 通知信（Slack 4 則未清，Darrell 2026-08-17 指示不用管）
  - **首頁案例卡與 FAQ 改成伺服器端渲染**（commit `b479dee`，已 push＋部署，線上版本 `38b57163`）：`index.astro` 直接從 cases collection（新增 `homeOrder`／`cardSummary`／`cardMetric` 三欄）與新檔 `src/data/faqs.ts` 產出 HTML；`home.js` 少 100 行，只留依 slug 對應的裝飾用流程圖（`CASE_DIAGRAMS`）與 FAQ 開合。實查 `dist/index.html`：6 條 `/cases/{slug}/` 連結、6 個標題、7 題 FAQ 問答全在靜態 HTML（原本一個都沒有）。瀏覽器實測版型不變、FAQ 開合與 aria 正常、hero 動畫與 scroll reveal 未受影響、console 無錯誤。未加 FAQPage 結構化資料（Google 已限縮 FAQ rich results 到政府／醫療類站）
  - **✅ 聊天已修好、整條線實測可用（2026-08-17 傍晚）**：Qdrant credential 重建完成（新 ID `FhSzheVbdg2hdwAx`，名稱 `Qdrant Cloud - kb_v1`），兩支 workflow（`pmZZqqc7Oik4WEKA`、`HMXBjbMlB0lAKofq`）的 `查知識庫` 節點已改掛新 credential，線上實查 `activeVersionId` = `versionId`（跑的就是新版）。實測：聊天端點問「n8n 導入多少錢」回串流答案且數字與 FAQ 一致（代表真的有檢索到知識庫）；閘門端點帶 `{"chatInput":"..."}` 回 200 與 contextPairs／pagePairs；兩個端點的 CORS preflight 對 `https://automation.darrelltw.com` 回 204 且 allow-origin 正確，換成其他來源不會被放行。知識庫 collection `kb_v1` 完好，不需重建
  - **key 的下落（供日後查）**：Qdrant API key 一直都在 `~/Downloads/darn8n_api_key.txt`（Darrell 2026-08-13 用檔案交付），實測帶這把打叢集 `/collections` 回 200。前一版交接誤判成「金鑰遺失、卡在 Darrell」，是因為只搜了專案目錄與環境變數名，沒搜對話紀錄。**教訓：宣稱某金鑰不存在之前，要一併搜 `~/.claude/projects` 逐字稿與 `~/Downloads`**
  - **三份文件對齊到已驗證狀態**：`chat-handler.js` 第 15–16 行過期註解（原寫「生產 workflow 尚未搬移」）改成兩支 workflow ID＋credential＋驗收日期（commit `e78684b`）；交接文件的「下次接手第一步」原本叫人去驗已經驗完的東西，改成真實下一步並補上 runbook 的順序陷阱；tracker 同步（blog commit `12e7e39`，只含 tracker 與交接兩檔）

- **🔴 待決問題（卡在 Darrell，3 項）**：
  1. **首頁 hero 兩個數字沒有佐證**——「10+ 專案實戰經驗」「300+ hrs 每年幫客戶省下的工時」要留、改成有佐證的說法、還是拿掉。這是流量進來第一眼看到的東西，決定了再上線比較不會回頭改
  2. **外部入口連結**：Threads／IG／X 個人檔案、電子報頁尾、確認有無 Google Ads 指舊網址（都在 Darrell 帳號裡）
  3. **正式公開的時間點**——功能面已無阻擋（表單、聊天、首頁 SEO 三條線都實測過）
- **待辦（可做）**：手機版主導覽全隱藏無替代入口；聊天 timeout 在等閘門前被清掉；KV 去重讀寫競態；表單無 rate limit；正式上線切換（撤 Access/robots/noindex → 依 runbook 跑 301 與舊連結清理，⚠️ 必須先搬 Link in Bio 圖片再加 301，否則 og-image 被 `/n8n-expert/:path*` 吃掉變破圖）
- **Darrell 已明示不處理**：GA4 DebugView 驗收（不需要）；`/n8n-service/` 那條不在 repo 裡的 301 來源（不用管，代價是上線後會變兩跳轉址）
- ⚠️ **blog 分支 push 落差會變動，不要引用寫死數字**：2026-08-18 00:45 為領先 10／落後 2；當日已 `git pull --no-rebase` 產生合併 commit `ab18b09`（工作區 43 個既有髒檔擋住 rebase，故走 merge）。2026-08-20 06:05 重查為**領先 1／落後 1**（另一 session 已把先前那批推上去，並新增 `da0f8fa`／`63d340f` 兩顆 n8n 2.36.0 commit）。push 前一律重跑 `git rev-list --left-right --count origin/main...HEAD`
- **push 影響範圍已查**：`main.yml` 的 `exclude` 已排除 `n8n-expert-v2/**`，這批 commit 推上去對正式站只會改到 README，不會讓 v2 原始檔公開

- **2026-08-20 完成：新站設計健檢與四個改版提案（未動 automation-site 任何程式碼）**
  - 對本機 dev server 實際畫面做視覺健檢（桌機 1440×900、手機 390×844，先捲完全頁觸發所有 scroll reveal 才截圖），不是憑記憶或看原始碼推斷
  - 交付 canvas：https://claude.ai/code/artifact/d4cdffa9-2cfd-4243-84e5-320aec431a0e（10 個發現＋四個提案，每個提案都是「現在的樣子 vs 改完的樣子」並排對照）
  - 提案 01 首頁憑證列**直接對應下方 🔴 待決問題 1**：把「10+ 專案」「300+ hrs」換成訪客查得到的三格（文章數／GA4 讀者數／n8n 社群身分），真實數字留 `[ ]` 等 Darrell 填
  - 提案 02 價格從 FAQ 折疊搬成獨立第 03 段（文案原封沿用 FAQ 現有內容，未新增未確認價格）＋中段 CTA；提案 03 案例卡補產業標籤（`industry` 欄位是現成資料，只有 /cases/ 在用）與一行成效；提案 04 手機選單鈕＋底部固定 CTA，同時處理「工時」被拆行（中文誤用 JetBrains Mono＋0.16em 字距＋全大寫）
  - 提案全部沿用現有色票、字體、元件與圓角，沒有引入新視覺語彙；**尚未實作**，等 Darrell 決定要做哪幾項

### n8n AI Assistant 自架（獨立文章 + upstream issue）
- **建立日期**：2026-08-12
- **狀態**：sandbox 已跑通、issue 已送出、文章草稿完成待補圖，**未 commit**
- **文章草稿**：`docs/drafts/n8n-instance-ai-assistant-selfhosted.md`（391 行，尚未公開，用戶指定先放 docs）
- **素材**：`docs/drafts/n8n-instance-ai-assets/`（修復 patch、issue 內文、裁切好的錯誤截圖兩版）
- **upstream issue**：[n8n-io/n8n#36093](https://github.com/n8n-io/n8n/issues/36093)（帳號 darrell-tw，OPEN）。送出時未附圖，要補需上網頁拖曳
- **核心發現（文章護城河，網路上查不到）**：
  - 官方兩份文件打架：使用手冊寫「Cloud only」，部署文件有完整自架步驟；**實測自架 Community 版無 license 可跑**
  - 官方文件環境變數名稱**寫錯**：文件寫 `N8N_INSTANCE_AI_SANDBOX_API_URL`，原始碼實際讀 `N8N_SANDBOX_SERVICE_URL` / `N8N_SANDBOX_SERVICE_API_KEY`
  - OpenAI 驗證必失敗：`verifyModel()` 寫死 `maxOutputTokens: 8`，Responses API 下限 16。`model-factory.ts:84-85` 決定無 baseURL 就走 Responses API，故**所有** OpenAI 模型皆中；繞法＝用環境變數設模型跳過驗證
  - OpenRouter 驗證會過但對話會炸（路由到第三方上游，tool schema 不相容）
  - reasoning effort 寫死在 `apply-agent-thinking.ts`（openai=high、anthropic=medium），無 env 可覆蓋
- **已驗證**：修復 patch 在 n8n master 666fde3c 上，回歸測試 master 紅（`expected 8 to be greater than or equal to 16`）、修完 30 綠
- **未驗證**：`256` 這個新值沒有實際打過 OpenAI（key 已刪），只從 API 規格推論
- **待辦**：撤銷兩把外洩的 OpenAI key（尾數 `nksA`、`gTgA`）→ 文章補封面圖與截圖、查三張 articleCard 的 `bgImage` → 決定發布時機 → update-log 的「之後補連結」要指回本篇
- **環境**：sandbox 在 mbp-old colima（`~/n8n-sandbox/`），**無開機自動啟動**，重開機要手動 `colima start`

### n8n 2.34.0 更新紀錄（寫完待 commit）
- **建立日期**：2026-08-10
- **狀態**：文章已寫完、圖已處理、本地預覽驗證通過，**用戶 review 中，尚未 commit**
- **已完成**：
  - preview 站（`https://n8n-preview-mbp.darrelltw.com/`）升到 2.34.0，`/rest/settings` 確認 `versionCli=2.34.0`、enterprise flags 全 false（與自架 Community 讀者環境一致）
  - `source/_posts/n8n-update-log.md` 新增 2.34.0 章節，三項：HTTP Simplified Custom Auth 憑證、OpenAI Chat Model Extra Body、Schedule 非整除分鐘間隔修復
  - 四張截圖裁切至與舊圖同規格（1008x720 / 838x755 / 960x700）並經 pngquant 壓縮；`npm run images:process` 已更新 `source/_data/image_dimensions.json`
  - meta 已更新：description 改 2026/08/10、最新測試版 2.34.0、正式版 2.33.7；`updated: 2026-08-10 18:16:56`（欄位名 8/12 由 `modified` 改成 `updated`，見已完成區「文章更新日期修正」）
- **驗收結果**：
  - Simplified Custom Auth：**PASS**。範本 `{{apiKey}}` 自動生成欄位卡片，存檔後連線測試回 `The service accepted the credential`；Test URL 用 postman-echo，token 為假值
  - OpenAI Extra Body：**部分 PASS**。Options 有此選項且 JSON 存得進去；**參數是否真的送達 API 未測**，文章已標明並註記 PR 附有 LM Studio debug log
  - Schedule 每 N 分鐘：**未實測**（等滿一輪成本太高）。文章用 warning callout 標明，觸發序列引用 PR #35062 的 `ScheduleTrigger.node.test.ts`；只驗證了設定畫面無新選項
- **待辦**：用戶 review → commit（repo 有大量無關既有變更，須逐路徑挑本次檔案）→ 授權後 push → Vercel 部署驗證
- **可選未納入**：2.34.0 另修了多行密鑰貼上被吃掉換行、且改用表達式模式繞過會覆蓋遺失私鑰的 bug（PR #35157）。用戶選寫 3 項故未納入，可補一段警語
- **已排除**：Workflow Review 系列（#35041 / #35199 / #35233 / #35390）為 Enterprise 限定（`workflow-reviews.ee/` + `feat:workflowReviews` 授權），自架 Community 看不到
- **已知既有問題（非本次造成）**：手機版水平溢出來自舊章節「NVIDIA Nemotron 加入 Chat Model 節點」的表格（寬 505px）

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
- **2026-08-16 決策定案：v2 不在 blog 內上線，已拆成獨立站 `automation.darrelltw.com`**（見上方「automation.darrelltw.com 接案站獨立」條目），本項的版型上線決策由獨立站取代
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

### 文章圖片壓縮（建立自動化，還清一半技術債）
- **建立日期**：2026-08-13
- **狀態**：✅ 71 張已壓縮並 push 上線（`5fd4266`、`9172a36`），讀者端省下約 14.6MB。全站仍有 87 張未壓縮
- **起點**：用戶問「n8n-update-log 新的圖片為何沒壓縮，需要我口頭告知才會做嗎」。**答案是不需要，而且這不是偶發**——專案根本沒有任何自動壓縮流程
- **根因**：`npm run images:process` 名字像在處理圖片，實際上只用 `image-size` 讀長寬寫進 `image_dimensions.json`（`scripts/generate-image-dimensions.js`），完全不碰檔案內容；`npm run build` 也一樣。壓縮一直靠人手動跑 pngquant，而 skill 的圖片章節從沒寫過這一步
- **已完成**：
  - `n8n-update-log/` 43 張：6117KB → 1281KB（省 79%）
  - 全站 200KB 以上 21 張：13379KB → 3617KB（省 73%）。最大幾張：martech 工具生態圖 1624→493KB、GA4 權限截圖 743→197KB
  - 新增 `scripts/compress-images.js` + `npm run images:compress`：讀 PNG 檔頭 color type 判斷壓過沒有（3=palette），**重跑會全部跳過不會反覆有損壓縮**（已實測）；支援限縮單篇與 `--min-kb=N`；先壓到暫存檔、確認變小才取代原圖
  - 寫進 `n8n-update-write` skill：`references/images.md` 新增「步驟 5.4：壓縮圖片」標明不需用戶要求，`SKILL.md` Phase 5 commit 前再確認一次
  - 記憶 `feedback_image_optimization.md` 已改為「壓縮是預設動作，不是選配」
- **畫質驗證**：目視檢查壓縮率最差的兩張 infographic（1374→422KB、1624→493KB），色塊與文字乾淨、無色帶。infographic 壓縮率約 70%，UI 截圖 80-85%
- **剩餘**：
  - 全站 87 張未壓縮、6324KB，**全在 200KB 以下**（推估再省約 5MB，但 87 個檔案換 5MB，效益比這批差很多）
  - `chatgpt-work-vs-codex/` 4 張 infographic 已壓縮但**未追蹤**，屬於進行中文章，刻意沒 commit
  - `the_martech_handbook/martech_talent.png` **內容是 WebP、副檔名叫 .png**，線上以 `Content-Type: image/png` 回應（瀏覽器靠 sniffing 仍顯示得出來）。要正名需同時改檔名、文章引用與舊 URL 相容
  - 既有 bug（非本次造成）：`scripts/generate-image-dimensions.js:199` 附近 `main()` 在 `require.main` guard 之外又被呼叫一次，等於每次 `images:process` 跑兩遍

### 站內搜尋（local_search）＋ 相依清理
- **建立日期**：2026-08-13
- **狀態**：✅ 已 push 並部署上線，正式站實測通過（2026-08-13，第二輪排序改動同日上線）。過程中造成一次約 4 分鐘的正式站事故，已修復，見下方「事故」段
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
- **🔴 事故：移除套件導致正式站所有文章頁空白（2026-08-13，約 4 分鐘）**
  - **現象**：push 後正式站每個文章頁 HTTP 200 但 **0 bytes**（真 Chrome 實測 `document.title` 空、body 0 字元）；首頁與分類頁正常
  - **根因**：`db9465f` 移除 `hexo-related-popular-posts`，但 `post-related.swig:1` 呼叫的 `popular_posts_json()` 替代實作 `scripts/related-posts.js` **從未進版控**。本機有該檔所以建置正常，Vercel 是乾淨 checkout → helper 未定義 → 文章頁渲染失敗。首頁／分類頁不含 `post-related.swig` 故倖免
  - **修復**：`b4f81d9` 把 `scripts/related-posts.js` 加入版控並 push，部署後真瀏覽器驗證恢復（正文 6717 字、熱門文章 5 筆）
  - **兩個早就存在的警訊我都沒接住**：① 本 tracker 第 155 行先前 session 已明寫「`scripts/related-posts.js` 未追蹤，本機與線上跑的是兩套不同實作」；② 更早一次 codex review 報過「fresh clone build 產出 0 bytes 文章頁」，當時被判**誤報**（因套件尚在、線上實查正常）——那個觀察其實成立，只是要等移除套件才觸發
  - **防線**：移除套件前先 `git ls-files --error-unmatch <替代實作>`；掃 `git ls-files --others --exclude-standard | rg "^(scripts/|themes/[^/]+/scripts/).*\.js$"`。已寫入記憶 `feedback_verify_against_clean_checkout.md`。**被判誤報的 review finding 要連前提一起記錄，前提改變時重新評估**
- **上線後實測（正式站真瀏覽器）**：文章頁正文 6717 字、熱門文章 5 筆；`page_path=/n8n-google-sheets-node/`、`post_path=/n8n-cli-guide/` 皆為單斜線；搜尋 42 筆、選取列 `rgb(69,69,75)`、標題近白、關鍵字 `rgb(255,157,102)` 且底色 transparent；`search` 事件送出一次
- **第二輪：排序改新文優先 + 入口頁納入索引（2026-08-13 下午，`d693573` 已 push 上線）**
  - **起點**：用戶問「搜『n8n』的排序怎麼來的」。實查後發現排序**實質上只看標題命中數**，之後直接沿用 `search.json` 的順序，而那個順序是**檔名字母序**（`n8n-datatables` < `n8n-security` < `n8n-time-saved`，與線上結果逐筆吻合）
  - **根因是上游 typo**：`mergeIntoSlice` 回傳 `searchTextCount`，但呼叫端讀成 `tmp.searchTextCountInSlice` → `undefined` → 累加成 `NaN`。排序時 `NaN !== NaN` 恆真，comparator 回傳 `NaN` 被 JS 規範當 0，於是**第四層 hitCount 永遠跑不到**。已比對初始 commit `086abe8`，確認是 NexT 上游就有、非本地改壞
  - **新排序**：命中關鍵字種類數 → `search_weight`（front matter 手動置頂）→ 標題命中數 → 日期新到舊。壞掉的 `searchTextCount` 層與被它擋住的 hitCount 層一併移除（刻意不看內文命中次數：長文與更新紀錄靠重複提關鍵字就會壓過對題短文）
  - **改用 generator 產 `search.json`**（`scripts/search-ranking.js`，取代 searchdb 輸出）。**關鍵教訓**：原本寫成 `after_generate` filter，但 Hexo 是在 after_generate **之後**才把 search.json 寫進 `public/`，clean build 時 filter 根本讀不到檔案——Vercel 每次部署都是 fresh clone，等於線上永遠不會生效。本機因為 `public/` 有上一輪殘留才「看起來正常」
  - **三個 n8n 入口頁納入索引**：教學 `/n8n-tutorial-resources/`、模板 `/tools/n8n_template/models.html`、接案 `/n8n-expert/`。它們原本全都搜不到（模板頁在 `skip_render` 的 `tools/**`、接案頁沒有 front matter）
  - **三個實作陷阱（都已修並註解在檔內）**：① weight 放在標題命中之前太強勢，搜「Gmail」時入口頁的長清單會壓過《n8n Gmail 節點教學》→ 改成標題沒命中就不給權重 ② 入口頁互相連結，導覽列把彼此名字寫進內文，搜「n8n 接案」時模板頁贏過真正的接案頁 → 抽內文時移除 `nav/header/footer` ③ 接案頁全文無「接案」二字，補的比對關鍵字會被當摘要顯示出來（連 `--- layout: false ---` 都露出）→ 入口頁改走固定 `description` 欄位
  - **結果列間隔**：列間距 3px → 10px、摘要行高 1.7 → 1.5 且上緣 5px → 2px（標題與摘要收成一組），並加 1px 分隔線 `rgba(255,255,255,.06)`。線畫在**間距正中間**（`top:-5px`）而非列邊緣，落在 hover 圓角背景範圍外，所以選中列不必特地把線藏起來
  - **線上驗證**：`search.json` 129 筆（126 文章 + 3 入口頁）、三個入口頁 weight 都在、前 3 筆為最新文章；真瀏覽器搜「n8n 接案」→ 接案頁第一；三個入口頁 URL 皆 200
- **待辦**：用戶評分視覺 → 設定 GTM tag/trigger 讓 GA4 真的收到 `search`／`select_item`（`select_item` 頂層的 `search_term` 需另外映射 + 建 event-scoped 自訂維度才會進 GA4）
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
  - 未處理（非本次範圍）：codex 建議加 lint（禁 `modified`、驗 `updated >= date`）
  - ✅ **已解決（2026-08-13）**：`scripts/related-posts.js` 未追蹤這條，在移除 `hexo-related-popular-posts` 後直接引爆正式站文章頁全白，已由 `b4f81d9` 加入版控。第 152 行那個「被判誤報的 fresh clone 0 bytes」也是同一件事，詳見「站內搜尋」條目的事故段
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
