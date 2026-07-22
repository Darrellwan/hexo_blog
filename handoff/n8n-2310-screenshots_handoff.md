---
name: "n8n 2.31.0 更新截圖與 workflow 實測"
project: "blog"
slug: n8n-2310-screenshots
status: active
updated: 2026-07-16
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-07-16 23:26

## 本次 session 完成的事（2026-07-16）

- 完成三張 n8n 2.31.0 功能截圖更新：Notion Search Data Sources 使用新圖；Form Trigger Show Headers 與 Form Multiple Binary Files 以 2x 解析度重截並加上重點標註。
- 更新文章中的圖片引用，刪除舊低解析度原圖與 raw 中繼檔；`image_dimensions.json` 已更新並清理本次相關的舊 key。
- 以 `npm run images:process` 處理圖片，並在 `http://localhost:4000/n8n-update-log/` 完成本機預覽驗證，三張圖片皆正常顯示。
- 本次改動尚未提交。

## 下次接手第一步

先請使用者確認新的三張截圖（Notion Search、Form Ending、Show Headers annotated）是否可以採用；確認後依 commit-guide 拆分提交，並在取得使用者明確授權前不要 push。

## 重要 ID / 路徑

- Zeabur project ID：`69e856cbd974b2c8b6108a31`
- Zeabur service ID：`69e856cbd974b2c8b6108a33`
- Zeabur environment ID：`69e856cb28b1ec4f670609e5`
- 文章：`/Users/darrellwang/Darrell/code/blog/source/_posts/n8n-update-log.md`
- 截圖資料夾：`/Users/darrellwang/Darrell/code/blog/source/_posts/n8n-update-log/`
- 圖片尺寸資料：`/Users/darrellwang/Darrell/code/blog/source/_data/image_dimensions.json`
- 專案 task tracker：`/Users/darrellwang/Darrell/code/blog/task-tracker.md`
- 交接文件：`/Users/darrellwang/Darrell/code/blog/handoff/n8n-2310-screenshots_handoff.md`
- Form Trigger Show Headers workflow：`EZZfMSwnDXd6ay34`
- Form Ending Multiple Binary Files workflow：`Hv7tQSBVfID9Ac2J`
- Notion API v3 Data Source workflow：`rvxtalm8hBX09lft`

## 已知限制 / 決策

- 尚未 push，原因是使用者尚未完成文章審核。
- 2.28.0 的三張 `-annotated` 圖未引用，暫不提交。
- preview 上保留三個測試 workflow；其中兩個是公開表單端點，Show Headers 會把送進來的 header 存進 execution，是否停用或刪除待決定。
- Form Ending 已確認 n8n 端產生兩個檔案，但 Chrome 只自動放行第一個下載。
- 文章已修正敏感 header 未遮罩的描述；實際遮罩取決於 Enterprise Data Redaction 授權，preview 的 `dataRedaction=false`。

## 硬性規範

- 全程使用台灣繁體中文。
- 不要再次向使用者索取已提供的登入資訊。
- 截圖必須呈現功能的實際結果，不只設定面板或 `No output data` / `No input data` 佔位內容。
- commit 前確認 front matter 日期。
- push 必須等使用者明確授權。
- n8n 專案開始前先 invoke `/n8n-cli` + `/n8n-workflow-dev`。

## ⚠️ 接手前驗證清單（開始寫 code 前必跑）

□ 確認 preview 網站可用：
  `curl -sS https://n8n-preview-mbp.darrelltw.com/healthz`

□ 確認登入憑證：
  `agent-browser auth list`

□ 確認文章 2.31.0 段落與三張截圖：
  `rg -n "2\\.31\\.0" /Users/darrellwang/Darrell/code/blog/source/_posts/n8n-update-log.md`

□ 確認尚未提交的變更：
  `git -C /Users/darrellwang/Darrell/code/blog status --short`

□ 確認 workflow 目前節點：
  `n8n-cli workflow get EZZfMSwnDXd6ay34 --jq '.nodes[].name'`
  `n8n-cli workflow get Hv7tQSBVfID9Ac2J --jq '.nodes[].name'`
  `n8n-cli workflow get rvxtalm8hBX09lft --jq '.nodes[].name'`
