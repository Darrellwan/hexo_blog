---
name: "automation.darrelltw.com 接案站"
project: "blog"
slug: automation-site
status: active
updated: 2026-08-17
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-08-17 21:30

## 現在的狀態一句話

**功能面已經齊了**：表單、聊天、首頁 SEO 三條線都實測通過。站台仍未公開（Access ＋ robots 全擋 ＋ noindex），剩下的是「要不要上線」與收尾，不是「還不能上線」。

## 本次 session 完成的事（2026-08-17）

- 完成 automation.darrelltw.com 的獨立 Astro 站建置與 Cloudflare Workers Static Assets 部署，包含首頁、6 篇案例頁與 3 個服務頁。
- 完成 GTM dataLayer、GTM tags、triggers 與 GA4 接線及版本發布。
- 完成首頁互動程式的 CSP 修復，將 428 行 inline script 外部化至 `public/scripts/home.js`，並完成線上瀏覽器驗證。
- 完成 Cloudflare Access 應用程式與允許政策設定，站點仍維持登入保護、robots 全擋與 noindex。
- 完成表單 Worker 的 Turnstile siteverify、fail-closed、蜜罐與防重送處理，並部署 Secret；表單真單端到端通過（n8n 執行 `107294`）。
- **首頁案例卡與 FAQ 改成伺服器端渲染**（commit `b479dee`，線上版本 `38b57163`）：原本兩個區塊是空 div 由 JS 填，爬蟲讀不到任何案例連結與 FAQ 文字。現在 `index.astro` 直接從 cases collection（新增 `homeOrder`／`cardSummary`／`cardMetric`）與 `src/data/faqs.ts` 產出 HTML，`home.js` 只留裝飾用流程圖與 FAQ 開合。
- **聊天修好並實測可用**：重建 Qdrant credential（`FhSzheVbdg2hdwAx`，collection `kb_v1`），兩支 workflow（`pmZZqqc7Oik4WEKA`、`HMXBjbMlB0lAKofq`）的 `查知識庫` 節點已改掛，`activeVersionId` 與 `versionId` 一致。實測聊天端點回串流答案且數字與 FAQ 一致、閘門端點回 200、兩端點 CORS 對生產來源正確。

## 下次接手第一步

**不必再驗表單、Turnstile、蜜罐、防重送、allowedOrigins 或 Qdrant——這些 8/17 都驗完了**（證據見上方「本次 session 完成的事」）。第一步是跟 Darrell 確認首頁 hero 那兩個沒有佐證的數字（「10+ 專案實戰經驗」「300+ hrs」）要留、要改還是拿掉，因為那是流量進來第一眼看到的東西，決定了再上線比較不會回頭改。確認後依 `docs/plans/2026-08-17-automation-launch-redirect-runbook.md` 執行正式上線切換。

⚠️ runbook 的順序陷阱：**必須先做第 2 步的 Link in Bio 圖片搬移，再加第 1 步的 301 規則**，否則 `/n8n-expert/images/og-image.webp` 會被 `/n8n-expert/:path*` 那條吃掉，Link in Bio 卡片圖變破圖。

## 重要 ID / 路徑

- 專案根目錄：`/Users/darrellwang/Darrell/code/blog`
- 新站專案：`/Users/darrellwang/Darrell/code/automation-site`
- 交接文件：`/Users/darrellwang/Darrell/code/blog/handoff/automation-site_handoff.md`
- 計畫文件：`/Users/darrellwang/Darrell/code/blog/docs/plans/2026-08-15-automation-site-plan.md`
- 正式上線 runbook：`/Users/darrellwang/Darrell/code/blog/docs/plans/2026-08-17-automation-launch-redirect-runbook.md`
- GitHub 私有 repo：`Darrellwan/automation-site`
- 線上網址：`https://automation.darrelltw.com/`
- n8n 主機：`https://darn8n.darrelltw.com`
- GTM container：`GTM-K4GHVMVP`
- Cloudflare Access application ID：`6183db05-3dfe-4cf4-a367-10106af256f5`

## 已知限制 / 決策

- 新站目前仍處於 robots 全擋、`X-Robots-Tag: noindex` 與 Cloudflare Access 保護狀態，尚未正式公開上線。
- 表單與聊天兩條線 8/17 都已端到端實測通過，不需要重驗。
- **Qdrant API key 在 `~/Downloads/darn8n_api_key.txt`**（Darrell 2026-08-13 用檔案交付）。前一版交接誤判成「金鑰遺失、卡在 Darrell」，實際是搜尋範圍不夠。宣稱任何金鑰不存在之前，要一併搜 `~/.claude/projects` 逐字稿與 `~/Downloads`。
- blog repo 仍有既有 dirty/untracked 內容；後續提交必須逐路徑挑選，避免混入無關變更。**blog 分支領先 origin 9、落後 2**，push 前先 pull，且會一併帶出另一 session 的 RAG chat commits。
- 尚未處理的技術債：手機版主導覽全隱藏無替代入口、聊天 timeout 在等閘門前被清掉、KV 去重讀寫競態、表單無 rate limit。這些不擋上線。
- Darrell 已明示不處理：Slack 4 則測試通知、`/n8n-service/` 那條找不到來源的 301（代價是上線後兩跳）、GA4 DebugView 驗收。
- 案例沿用 v2 既有內容，不新增量化數字。
- GSC 不新增 property；可選另開子網域 URL-prefix property 單獨看數據。

## ⚠️ 接手前驗證清單（開始寫 code 前必跑）

**接手前驗證清單**（第一步，code 前必跑）：

□ 確認新站目前工作樹與最近提交：
  `git -C /Users/darrellwang/Darrell/code/automation-site status --short && git -C /Users/darrellwang/Darrell/code/automation-site log --oneline -5`

□ 確認 Astro build 與頁面產出：
  `cd /Users/darrellwang/Darrell/code/automation-site && npm run build`

□ 確認保護狀態仍在（未公開前每次接手都要看，回 302 才對）：
  `curl -sS -o /dev/null -w '%{http_code}\n' https://automation.darrelltw.com/`

□ 確認 blog repo 既有變更與分支落差，避免誤提交：
  `git -C /Users/darrellwang/Darrell/code/blog status --short && git -C /Users/darrellwang/Darrell/code/blog rev-list --left-right --count origin/main...HEAD`

□ 若下一步改現有 n8n workflow，先確認目前節點清單與 credential：
  `n8n-cli workflow get <WORKFLOW_ID> --json | python3 -c "import json,sys; w=json.load(sys.stdin); [print(n['name'], n.get('credentials')) for n in w['nodes']]"`

□ 聊天若疑似壞掉，先用真實 payload 打兩個端點再判斷（送空 `{}` 會讓閘門那支在 `算問題向量` 報 500，那是測法錯不是壞掉）：
  `curl -sS -X POST https://darn8n.darrelltw.com/webhook/chat-gate-data -H 'Content-Type: application/json' -d '{"chatInput":"n8n 導入大概要多少錢？"}'`

## 🔴 待決問題

**卡在 Darrell（3 項）**

1. 首頁 hero 的「10+ 專案實戰經驗」「300+ hrs 每年幫客戶省下的工時」沒有佐證，要留／改／拿掉需 Darrell 判斷。
2. 外部入口連結：Threads／IG／X 個人檔案、電子報頁尾、確認有無 Google Ads 指向 `/n8n-expert/`。
3. 決定正式公開的時間點（功能面已無阻擋）。

## 硬性規範

- 不得在案例內容中編造客戶名稱、量化數據或成效。
- blog repo 提交時只挑選本工作線相關路徑，避免混入既有 dirty 變更。
- 正式上線前必須完成 Access、robots、noindex 的切換審核。
- 表單必須維持 Turnstile 驗證、蜜罐與 fail-closed 行為；驗證失敗不得送進下游 workflow。
- 開始前先 invoke `/n8n-cli` + `/n8n-workflow-dev`（如果是 n8n 專案）。
- **不得把本文件或 task-tracker 寫的「卡在 Darrell」當成已查證的事實複述給用戶**，先自己驗一次再說。2026-08-17 就是這樣把「Qdrant 金鑰遺失」講了兩輪，實際金鑰一直在 `~/Downloads`。