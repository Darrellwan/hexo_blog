---
name: "GA4/Search Console MCP 安裝教學"
project: "blog"
slug: ga4-search-console-mcp-install
status: active
updated: 2026-07-31
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-07-31 18:34

## 本次 session 完成的事（2026-07-31）

- 建立 GA4 與 Search Console MCP 安裝教學文章草稿。
- 將 4 張 GCP 截圖插入文章。
- 修正 handoff audit 對含空格與巢狀引號路徑的辨識，15 個測試通過。
- 建立 Sublime Text HTMLPrettify 使用者設定，將 Node 路徑指向 `/opt/homebrew/bin/node`。

## 下次接手第一步

先讀文章檔案，找出仍存在的 TODO；補齊服務帳戶建立、JSON key 下載、GA4 後台授權、Search Console 後台授權截圖，以及正式封面圖。

## 重要 ID / 路徑

- 專案根目錄：`/Users/darrellwang/Darrell/code/blog`
- 文章檔案：`/Users/darrellwang/Darrell/code/blog/source/_posts/ga4-search-console-mcp-install.md`
- 服務帳戶 JSON：`/Users/darrellwang/.claude/ga4_service_account.json`
- handoff 文件：`/Users/darrellwang/Darrell/code/blog/handoff/ga4-search-console-mcp-install_handoff.md`
- task tracker：`/Users/darrellwang/Darrell/code/blog/task-tracker.md`
- audit 程式：`/Users/darrellwang/Darrell/skills/handoff/scripts/audit.py`
- audit 測試：`/Users/darrellwang/Darrell/skills/handoff/scripts/tests/test-audit.py`
- Sublime Text 設定：`/Users/darrellwang/Library/Application Support/Sublime Text 3/Packages/User/HTMLPrettify.sublime-settings`

## 已知限制 / 決策

- 文章目前仍缺服務帳戶建立、JSON key 下載、GA4 後台授權、Search Console 後台授權的實際截圖。
- 文章封面圖仍是 `TODO-cover-image.jpg` 佔位檔。
- GSC 既有實測是 OAuth；Service Account 路徑尚未實測，不得把未實測結果寫成已驗證事實。
- 教學設定採用通用、簡單的 `uvx` 裸指令寫法，不使用絕對 `uvx` 路徑。
- 工具隔離環境的檔案狀態不得當成本機事實；涉及本機狀態時必須回到使用者實際環境驗證。

## 硬性規範

- 文章中的安裝、授權與設定步驟必須以實際驗證結果為準，不得猜測。
- Service Account JSON 金鑰路徑與授權狀態必須先實測，再寫入教學。
- 客戶面或教學截圖需裁切到重點區域，並在複製出的圖片上標示，不修改原圖。
- 不得把 GSC OAuth 實測結果描述成 Service Account 實測結果。
- 修改既有檔案前先讀取目前內容；完成後檢查文章 TODO 與 git 狀態。

**接手前驗證清單**（第一步，code 前必跑）：

□ 確認文章目前仍有哪些 TODO：
  rg --line-number "TODO" /Users/darrellwang/Darrell/code/blog/source/_posts/ga4-search-console-mcp-install.md

□ 確認文章與圖片資料夾的實際 git 狀態：
  git -C /Users/darrellwang/Darrell/code/blog status --short

□ 確認服務帳戶 JSON 檔案實際存在，再進行後續授權測試：
  test -f /Users/darrellwang/.claude/ga4_service_account.json
