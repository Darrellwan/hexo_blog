---
name: "n8n 接案頁 RAG 聊天助理"
project: "blog"
slug: n8n-landing-rag-chat
status: active
updated: 2026-08-16
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-08-16 12:45

## 本次 session 完成的事（2026-08-16）

- 完成 n8n 接案頁 RAG 聊天助理的串流前端、閘門與工作流整合調整；瀏覽器端逐段串流顯示、第一個字時間與取消行為仍待最終端到端驗收。
- 建立並部署 Cloudflare Worker `n8n-chat-guard`，加入速率限制、輸入長度測試與串流轉送，並提交版本控制。
- 提交聊天前端、RAG 語料匯入腳本與 Cloudflare Worker；相關交接軌維持 active。

## 下次接手第一步

串流已驗完，**不要再重測 wire format**（見下方「已驗證完成」）。第一步是建立正式驗收題庫（20–30 題），涵蓋正常問題、價格問題、prompt injection、錯誤數字與錯誤連結。接著決定是否清理 Cloudflare 測試殘留（Vectorize index `n8n-kb-latency-test`、Worker `vectorize-latency-probe`，2026-08-16 實查都還在）。

## 重要 ID / 路徑

- n8n preview 聊天 webhook：https://n8n-preview-mbp.darrelltw.com/webhook/22aeba9d-d33c-4ad2-86f5-0d64704af1ee/chat
- 聊天工作流 ID：qyEziPb6Awn1s4tS
- 專案根目錄：/Users/darrellwang/Darrell/code/blog
- 接案頁：/Users/darrellwang/Darrell/code/blog/source/n8n-expert-v2/index.html
- 聊天前端：/Users/darrellwang/Darrell/code/blog/source/n8n-expert-v2/js/chat-handler.js
- 樣式檔：/Users/darrellwang/Darrell/code/blog/source/n8n-expert-v2/styles.css
- Cloudflare Worker 專案：/Users/darrellwang/Darrell/code/cloudfalre/n8n-chat-guard
- 文章：/Users/darrellwang/Darrell/brain/articles/ai-agents/2026-08-11_n8n_build-and-manage-agents.md

## 已驗證完成（2026-08-16 實打，不要重做）

- **串流 wire format 已確認**：NDJSON，一行一個 `{"type":"begin"|"item"|"end","content":…}`。前端 `chat-handler.js:542-565` 用 `getReader()` 逐段消費，不是一次收完。
- **端到端串流實測**：經護欄 Worker 後一題回 123 行，分散在 2.19 秒內逐步到達，未被緩衝。
- **公網託管聊天頁已關閉**：Chat Trigger `mode` 由 `hostedChat` 改為 `webhook`。改之前用瀏覽器直開 webhook 網址會拿到 3,416 bytes 的可用聊天介面。
- **來源限定**：兩支 workflow 的 `allowedOrigins` 由 `*` 改為 `http://localhost:4000`，外站 preflight 實測被擋。
- **護欄 Worker `n8n-chat-guard` 已上線**：單 IP 20 次/分、全站 60 次/分、單則 500 字、全站每日 300 題。持續灌 60 秒送出 2,700 次、通過 158 次（擋掉 94%）；每日上限暫調成 5 實測有效。

## 已知限制 / 決策

- 限速是近似計數，同一瞬間爆發的 30 個請求會整批溜過去；真正的成本天花板是每日 300 題（約 $0.45/天）。
- 前端被擋下時只顯示籠統的「機器人暫時無法回應」，不會顯示 429 的實際原因。
- 尚未做：Turnstile 人機驗證、隱私揭露（貼上警告、對話紀錄保存期）、正式驗收題庫。
- 效能：Qdrant 在 us-east-1，每次檢索固定約 1.45 秒；n8n Code node 閒置 69 秒就冷啟動，多花約 2.26 秒（熱 3.79s / 冷 6.80s，16 次實測）。用戶 2026-08-15 指示先不改。
- Cloudflare 測試殘留未清：Vectorize index `n8n-kb-latency-test`、Worker `vectorize-latency-probe`。
- Qdrant 免費叢集閒置一週會停機、四週刪除；目前叢集方案別尚未確認。
- n8n preview、Qdrant Cloud、Cloudflare 測試環境涉及金鑰與權限，尚未完成完整撤銷與清理盤點。
- Section 1 的 cwd 與 Section 2 的 git status 對應不同專案，檔案狀態需人工確認後再 commit。
- 本專案目前有 task-tracker.md；待決問題以該檔案的「🔴 待決問題」區塊為唯一來源。

## 硬性規範

- **數字閘門的規則存在兩個地方**：n8n 的 `數字閘門` 節點與前端的 `gateCheck`。改一邊一定要改另一邊，否則串流路徑與非串流路徑行為會不一致。
- **正式對外時三處來源要一起改**，漏一個聊天就整個不能用：Worker 的 `ALLOWED_ORIGIN`、workflow `qyEziPb6Awn1s4tS` 的 `網頁聊天入口`、workflow `1zqTk716qdYjYLEr` 的 `閘門資料入口`。目前都是 `http://localhost:4000`。
- **限速 binding 必須用 `[[ratelimits]]`**。舊寫法 `[[unsafe.bindings]]` + `type="ratelimit"` 部署會成功但完全不擋，40 次循序全過。正確時 deploy 輸出顯示 `Rate Limit  20 requests/60s`，錯誤時顯示 `Unsafe Metadata`。
- **限速不要自己用 KV 算次數**。讀出來 +1 再寫回去的做法在併發下失效，30 個同時的請求全部放行。
- 安全測試必須涵蓋正常問題、價格問題、prompt injection、錯誤數字與錯誤連結。
- 先確認 Qdrant 與 Cloudflare 測試資源是否仍需保留，再進行任何刪除或清理。
- 開始前先 invoke `/n8n-cli` + `/n8n-workflow-dev`。

## ⚠️ 接手前驗證清單（開始寫 code 前必跑）

□ 確認護欄 Worker 還在攔（回 400 代表 Worker 有作用，不是 n8n 回的）：
  curl -s -o /dev/null -w '%{http_code}\n' -X POST "https://n8n-preview-mbp.darrelltw.com/webhook/22aeba9d-d33c-4ad2-86f5-0d64704af1ee/chat" -H 'Content-Type: application/json' -d 'not-json'

□ 確認今天已用掉幾題（每日上限 300）：
  cd /Users/darrellwang/Darrell/code/cloudfalre/n8n-chat-guard && wrangler kv key list --namespace-id 298967fa10b248f8bbec12fdf50018b2 --remote | rg -c "req:$(date -u +%Y%m%d)"

□ 確認 workflow 目前節點：
  n8n-cli workflow get qyEziPb6Awn1s4tS --jq '.nodes[].name'

□ 確認兩支 workflow 的 allowedOrigins 還是 localhost（正式上線才改）：
  n8n-cli workflow get qyEziPb6Awn1s4tS --jq '.nodes[] | select(.name=="網頁聊天入口") | .parameters.options.allowedOrigins'
