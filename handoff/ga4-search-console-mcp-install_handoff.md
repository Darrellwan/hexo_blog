---
name: "GA4/Search Console MCP 安裝教學"
project: "blog"
slug: ga4-search-console-mcp-install
status: active
updated: 2026-08-02
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-08-02 23:57

## 本次 session 完成的事（2026-08-02）

- 完成 GA4/Search Console MCP 教學文章的截圖、內容、QuickNav 與 SEO 修復，並部署至正式站。
- 將 GA4 與 Search Console connector 截圖放入文章，保留原始未裁切版本。
- 將文章內 API 複製功能重構為共用 copyable 元件，三個 API 可各自複製，並完成本機瀏覽器驗證。
- 修正 BlogPosting 結構化資料、文章頁 H1、QuickNav 與全站 title 後綴。

## 下次接手第一步

先讀取 task-tracker 與目前 git 狀態，確認文章完成狀態、`main.yml` 未提交變更的實際內容，以及是否需要補做正式站圖片的自然滾動瀏覽器驗證；再更新 task-tracker 與本交接文件中的文章狀態。

## 重要 ID / 路徑

- 專案根目錄：`/Users/darrellwang/Darrell/code/blog`
- 文章檔案：`/Users/darrellwang/Darrell/code/blog/source/_posts/ga4-search-console-mcp-install.md`
- 交接文件：`/Users/darrellwang/Darrell/code/blog/handoff/ga4-search-console-mcp-install_handoff.md`
- task tracker：`/Users/darrellwang/Darrell/code/blog/task-tracker.md`
- 服務帳戶 JSON：`/Users/darrellwang/.claude/ga4_service_account.json`
- 正式文章網址：`https://www.darrelltw.com/ga4-search-console-mcp-install/`
- SEO 修復 commit：`8c992b0`
- 文章相關 commit：`0185810`
- title 修復 commit：`5143e6d`

## 已知限制 / 決策

- 工作區仍有大量與本工作線無關的未提交與未追蹤變更，不得視為本 session 已清乾淨。
- `main.yml` 的新鮮 git status 仍有未提交變更；需確認是否屬於本工作線或其他內容。
- 正式站圖片網址目前已確認回應 200，但尚未完成自然滾動瀏覽器截圖驗證。
- Search Console 使用「限制」權限已實測可讀取網站清單、關鍵字報表、sitemap 與 URL Inspection 資料。
- GCP IAM 角色與 GA4/Search Console 後台使用者權限是兩套獨立系統；IAM 選填角色可留空。

## 硬性規範

- 修改既有檔案前先讀取目前內容，完成後檢查文章 TODO 與 git 狀態。
- 所有教學步驟與技術值必須先實測或從現有檔案逐字核對，不得猜測。
- 不得把 GSC OAuth 實測結果描述成 Service Account 實測結果。
- 不得把工具隔離環境的檔案狀態當成本機事實。
- 教學截圖若需處理，只能在複製出的圖上修改，不得改動原圖。
- 設定寫法維持通用、簡單，不使用絕對 `uvx` 路徑。

**接手前驗證清單**（第一步，code 前必跑）：

□ 確認 task tracker 與待決問題區塊：
  rg --line-number -A20 "🔴 待決問題" /Users/darrellwang/Darrell/code/blog/task-tracker.md

□ 確認文章目前沒有 TODO：
  rg --line-number "TODO" /Users/darrellwang/Darrell/code/blog/source/_posts/ga4-search-console-mcp-install.md

□ 確認目前 git 狀態：
  git -C /Users/darrellwang/Darrell/code/blog status --short

□ 確認 `main.yml` 未提交變更內容：
  git -C /Users/darrellwang/Darrell/code/blog diff -- main.yml

□ 若要進行正式站圖片驗證，先確認文章網址回應：
  curl -s -o /dev/null -w "%{http_code}\n" https://www.darrelltw.com/ga4-search-console-mcp-install/
