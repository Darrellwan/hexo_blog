---
name: "automation.darrelltw.com 接案站"
project: "blog"
slug: automation-site
status: active
updated: 2026-08-17
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-08-17 17:39

## 本次 session 完成的事（2026-08-17）

- 完成 automation.darrelltw.com 的獨立 Astro 站建置與 Cloudflare Workers Static Assets 部署，包含首頁、6 篇案例頁與 3 個服務頁。
- 完成 GTM dataLayer、GTM tags、triggers 與 GA4 接線及版本發布。
- 完成首頁互動程式的 CSP 修復，將 428 行 inline script 外部化至 `public/scripts/home.js`，並完成線上瀏覽器驗證。
- 完成 Cloudflare Access 應用程式與允許政策設定，站點仍維持登入保護、robots 全擋與 noindex。
- 完成表單 Worker 的 Turnstile siteverify、fail-closed、蜜罐與防重送處理，並部署 Secret；production n8n 驗收仍待完成。
- 將聊天 workflow 更新至 darn8n；正式啟用仍受 Qdrant credential 與 production allowedOrigins 設定限制。

## 下次接手第一步

先在 `/Users/darrellwang/Darrell/code/automation-site` 驗證表單 Worker、darn8n 表單 workflow 與聊天 workflow 的 production 設定；確認 Qdrant credential、allowedOrigins、Turnstile siteverify、蜜罐與防重送的成功及失敗分支後，再依正式上線 runbook 審核並切換 Access、robots、noindex，最後處理 blog 的 301 轉址與舊連結清理。

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
- 表單 Worker 已部署 Turnstile siteverify、fail-closed、蜜罐與防重送邏輯，但 darn8n production workflow 的完整驗證與下游行為仍需確認。
- 聊天元件 UI 與端點已保留並指向 darn8n；正式啟用仍缺 Qdrant credential，且 allowedOrigins 尚未完成 production 設定。
- blog repo 仍有既有 dirty/untracked 內容；後續提交必須逐路徑挑選，避免混入無關變更。
- 案例沿用 v2 既有內容，不新增量化數字。
- GSC 不新增 property；可選另開子網域 URL-prefix property 單獨看數據。

## ⚠️ 接手前驗證清單（開始寫 code 前必跑）

**接手前驗證清單**（第一步，code 前必跑）：

□ 確認新站目前工作樹與最近提交：
  `git -C /Users/darrellwang/Darrell/code/automation-site status --short && git -C /Users/darrellwang/Darrell/code/automation-site log --oneline -5`

□ 確認 Astro build 與頁面產出：
  `cd /Users/darrellwang/Darrell/code/automation-site && npm run build`

□ 確認表單、Turnstile、蜜罐與聊天端點目前設定：
  `rg -n "darn8n|Turnstile|siteverify|honeypot|phone|production workflow" /Users/darrellwang/Darrell/code/automation-site/src /Users/darrellwang/Darrell/code/automation-site/public`

□ 確認 crawler、noindex 與 Access 相關設定：
  `rg -n "Disallow|noindex|X-Robots-Tag|Access" /Users/darrellwang/Darrell/code/automation-site/public /Users/darrellwang/Darrell/code/automation-site/wrangler.jsonc`

□ 確認 blog repo 既有變更，避免誤提交：
  `git -C /Users/darrellwang/Darrell/code/blog status --short`

□ 若下一步改現有 n8n workflow，先確認目前 workflow 節點清單：
  `n8n-cli workflow get <WORKFLOW_ID> --jq '.nodes[].name'`

□ 若下一步操作 Google Sheets 節點，先確認實際 tab 名稱與欄位型別：
  `gws sheets spreadsheets get --params '{"spreadsheetId":"<ID>","fields":"sheets.properties.title"}'`

## 🔴 待決問題

見 task-tracker.md 🔴 待決問題（1 項）

## 硬性規範

- 不得在案例內容中編造客戶名稱、量化數據或成效。
- blog repo 提交時只挑選本工作線相關路徑，避免混入既有 dirty 變更。
- 正式上線前必須完成 Access、robots、noindex 的切換審核。
- 表單必須維持 Turnstile 驗證、蜜罐與 fail-closed 行為；驗證失敗不得送進下游 workflow。
- 聊天 workflow 正式搬遷與端點切換完成前，不得宣稱聊天功能已可正式上線。
- 開始前先 invoke `/n8n-cli` + `/n8n-workflow-dev`（如果是 n8n 專案）。