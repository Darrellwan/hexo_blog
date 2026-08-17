---
name: "automation.darrelltw.com 接案站"
project: "blog"
slug: automation-site
status: active
updated: 2026-08-18
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-08-18 00:39

## 現在的狀態一句話

**功能面已經齊了**：表單、聊天、首頁 SEO 三條線都實測通過。站台仍未公開（Access ＋ robots 全擋 ＋ noindex），剩下的是外部連結、首頁數字與正式公開決策，不是功能驗收阻擋。

## 本次 session 完成的事（2026-08-18）

- 修正 `chat-handler.js` 過期註解，改成反映兩支 production workflow 已完成搬遷與驗收的狀態。
- 更新本交接文件與 `task-tracker.md`，對齊 Qdrant credential、聊天 workflow、首頁 SEO 與目前正式上線準備狀態。
- automation-site 建立 commit `e78684b`；blog 建立 commit `12e7e39`；兩者目前都尚未 push。

## 下次接手第一步

先確認首頁 hero 的「10+ 專案實戰經驗」與「300+ hrs 每年幫客戶省下的工時」要留、修改或移除；再確認外部入口連結與正式公開時間點。取得決定後，依 `/Users/darrellwang/Darrell/code/blog/docs/plans/2026-08-17-automation-launch-redirect-runbook.md` 執行正式上線切換。

執行 runbook 時，必須先搬移 Link in Bio 圖片，再加入 301 規則，避免 `/n8n-expert/images/og-image.webp` 被 `/n8n-expert/:path*` 吃掉而造成破圖。

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
- Qdrant credential：`FhSzheVbdg2hdwAx`
- 聊天 workflow：`pmZZqqc7Oik4WEKA`、`HMXBjbMlB0lAKofq`
- Cloudflare 線上版本：`38b57163`

## 已知限制 / 決策

- 新站目前仍處於 robots 全擋、`X-Robots-Tag: noindex` 與 Cloudflare Access 保護狀態，尚未正式公開。
- 表單與聊天兩條線已端到端實測通過，不需要重驗；閘門端點測試必須使用真實格式 `{"chatInput":"..."}`，空 `{}` 會造成測法錯誤的 500。
- Qdrant API key 在 `~/Downloads/darn8n_api_key.txt`。宣稱任何金鑰不存在之前，要先搜尋逐字稿與 `~/Downloads`。
- blog repo 仍有既有 dirty/untracked 內容；提交必須逐路徑挑選。blog push 前要先處理分支落差，且可能一併帶出其他 session 的 RAG chat commits。
- 尚未處理的技術債：手機版主導覽無替代入口、聊天 timeout 在等閘門前被清掉、KV 去重讀寫競態、表單無 rate limit。這些不擋上線。
- Darrell 已明示不處理 Slack 測試通知、`/n8n-service/` 那條找不到來源的 301，以及 GA4 DebugView 驗收。
- 案例沿用既有內容，不新增未佐證的客戶名稱、量化數字或成效。

## ⚠️ 接手前驗證清單（開始寫 code 前必跑）

**接手前驗證清單**（第一步，code 前必跑）：

□ 確認新站工作樹與最近提交：
  `git -C /Users/darrellwang/Darrell/code/automation-site status --short && git -C /Users/darrellwang/Darrell/code/automation-site log --oneline -5`

□ 確認 Astro build 與頁面產出：
  `cd /Users/darrellwang/Darrell/code/automation-site && npm run build`

□ 確認保護狀態仍在：
  `curl -sS -o /dev/null -w '%{http_code}\n' https://automation.darrelltw.com/`

□ 確認 blog repo 變更與分支落差：
  `git -C /Users/darrellwang/Darrell/code/blog status --short && git -C /Users/darrellwang/Darrell/code/blog rev-list --left-right --count origin/main...HEAD`

□ 若下一步改現有 n8n workflow，先確認節點與 credential：
  `n8n-cli workflow get <WORKFLOW_ID> --json | python3 -c "import json,sys; w=json.load(sys.stdin); [print(n['name'], n.get('credentials')) for n in w['nodes']]"`

□ 若要操作 Google Sheets 節點，先確認實際 tab 名稱與欄位型別，再修改 build script 或字串處理。

## 🔴 待決問題

見 task-tracker.md 🔴 待決問題（專案目前有待決項目）。

## 硬性規範

- 不得在案例內容中編造客戶名稱、量化數據或成效。
- blog repo 提交時只挑選本工作線相關路徑，避免混入既有 dirty 變更。
- 正式上線前必須完成 Access、robots、noindex 的切換審核。
- 表單必須維持 Turnstile 驗證、蜜罐與 fail-closed 行為；驗證失敗不得送進下游 workflow。
- 開始前先 invoke `/n8n-cli` + `/n8n-workflow-dev`（如果是 n8n 專案）。
- 不得把交接文件或 task-tracker 寫的「卡在 Darrell」當成已查證的事實，先自行驗證。
