---
name: "GA4/Search Console MCP 安裝教學"
project: "blog"
slug: ga4-search-console-mcp-install
status: active
updated: 2026-08-03
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-08-03 11:23

## 本次 session 完成的事（2026-08-03）

- 修復文章推薦卡片：正式頁只保留 Claude 與 LINE 兩張推薦卡，並補上兩張封面。
- 修正文章卡片元件的空縮圖防呆，避免沒有 `thumbnail` 時輸出空圖片標籤。
- 建立 commit `bab027f` 並推送至 `origin/main`，正式站已更新。

## 下次接手第一步

文章與推薦卡修復都已完成。若再次接手，先讀取 task-tracker 與目前 git 狀態；`main.yml` 的既有未提交變更不屬於本工作線，只有收到新需求時才繼續修改文章。

## 重要 ID / 路徑

- 專案根目錄：`/Users/darrellwang/Darrell/code/blog`
- 文章檔案：`/Users/darrellwang/Darrell/code/blog/source/_posts/ga4-search-console-mcp-install.md`
- 交接文件：`/Users/darrellwang/Darrell/code/blog/handoff/ga4-search-console-mcp-install_handoff.md`
- task tracker：`/Users/darrellwang/Darrell/code/blog/task-tracker.md`
- 服務帳戶 JSON：`/Users/darrellwang/.claude/ga4_service_account.json`
- 正式文章網址：`https://www.darrelltw.com/ga4-search-console-mcp-install/`
- 本次修復 commit：`bab027f`
- SEO 修復 commit：`8c992b0`
- 文章相關 commit：`0185810`
- title 修復 commit：`7b618c5`（`5143e6d` 是後續 merge commit）

## 已知限制 / 決策

- 工作區仍有大量與本工作線無關的未提交與未追蹤變更，不得視為本 session 已清乾淨。
- `main.yml` 仍有本工作線開始前就存在的未提交變更，維持原狀，不納入本次 commit。
- 正式站已用瀏覽器實查：只顯示 Claude 與 LINE 兩張推薦卡，兩張封面均載入成功，沒有 Meta 卡片或空圖片來源。
- Meta 文章尚未上線，因此不作為推薦文章引用；保留移除 Meta 卡片的修改。
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

□ 確認正式文章仍正常回應：
  curl -s -o /dev/null -w "%{http_code}\n" https://www.darrelltw.com/ga4-search-console-mcp-install/

□ 確認本次推薦卡修復 commit：
  git -C /Users/darrellwang/Darrell/code/blog show --stat --oneline bab027f
