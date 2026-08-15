---
name: "n8n 接案頁 RAG 聊天助理"
project: "blog"
slug: n8n-landing-rag-chat
status: active
updated: 2026-08-15
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-08-15 16:41

## 本次 session 完成的事（2026-08-15）

- n8n 接案頁已接上 n8n preview 的 RAG 聊天工作流。
- 已建立或調整 Qdrant 語料與檢索、網址白名單、數字閘門、提示注入測試、聊天面板、loading 與取消介面。
- n8n preview 的 Agent 與多個頻道整合已建立並發布，相關實測紀錄持續更新。

## 下次接手第一步

先確認 n8n webhook 的實際串流 wire format，再核對前端是否逐段消費；接著測試正常問題、價格問題、prompt injection、錯誤數字與錯誤連結，最後決定是否保留 Cloudflare Vectorize 測試資源。

## 重要 ID / 路徑

- n8n preview 聊天 webhook：https://n8n-preview-mbp.darrelltw.com/webhook/22aeba9d-d33c-4ad2-86f5-0d64704af1ee/chat
- 聊天工作流 ID：qyEziPb6Awn1s4tS
- 專案根目錄：/Users/darrellwang/Darrell/code/blog
- 接案頁：/Users/darrellwang/Darrell/code/blog/source/n8n-expert-v2/index.html
- 聊天前端：/Users/darrellwang/Darrell/code/blog/source/n8n-expert-v2/js/chat-handler.js
- 樣式檔：/Users/darrellwang/Darrell/code/blog/source/n8n-expert-v2/styles.css
- 文章：/Users/darrellwang/Darrell/brain/articles/ai-agents/2026-08-11_n8n_build-and-manage-agents.md

## 已知限制 / 決策

- 串流回應尚未完成瀏覽器端逐段顯示的最終驗收，前端目前仍可能一次收到完整回應。
- n8n 聊天工作流的完整串流格式、第一個字時間與取消行為尚未完成端到端確認。
- RAG 聊天助理仍需測試 prompt injection、錯誤數字與錯誤連結情境。
- 新增的 Qdrant 與 Cloudflare 測試資源尚未確認是否需要刪除。
- n8n preview、Qdrant Cloud、Cloudflare 測試環境涉及金鑰與權限，尚未完成完整撤銷與清理盤點。
- Section 1 的 cwd 與 Section 2 的 git status 對應不同專案，檔案狀態需人工確認後再 commit。
- 本專案目前有 task-tracker.md；待決問題以該檔案的「🔴 待決問題」區塊為唯一來源。

## 硬性規範

- 開始寫 code 前先從實際 n8n preview 狀態確認目前工作流節點與 webhook 行為。
- 不得把一次收到完整回應誤判為串流已完成；必須完成瀏覽器端逐段顯示、第一個字時間與取消行為的端到端驗收。
- 安全測試必須涵蓋正常問題、價格問題、prompt injection、錯誤數字與錯誤連結。
- 先確認 Qdrant 與 Cloudflare 測試資源是否仍需保留，再進行任何刪除或清理。
- 開始前先 invoke `/n8n-cli` + `/n8n-workflow-dev`。

## ⚠️ 接手前驗證清單（開始寫 code 前必跑）

□ 確認 workflow 目前節點：
  n8n-cli workflow get qyEziPb6Awn1s4tS --jq '.nodes[].name'

□ 觀察 n8n webhook 的原始串流格式：
  curl -s --max-time 15 "https://n8n-preview-mbp.darrelltw.com/webhook/22aeba9d-d33c-4ad2-86f5-0d64704af1ee/chat"

□ 確認接案頁聊天前端目前的串流消費邏輯：
  rg -n "stream|ReadableStream|fetch|cancel|loading" /Users/darrellwang/Darrell/code/blog/source/n8n-expert-v2/js/chat-handler.js

□ 確認接案頁目前引用與資料閘門實作：
  rg -n "allowlist|whitelist|citation|prompt|number|URL" /Users/darrellwang/Darrell/code/blog/source/n8n-expert-v2/js/chat-handler.js /Users/darrellwang/Darrell/code/blog/source/n8n-expert-v2/index.html
