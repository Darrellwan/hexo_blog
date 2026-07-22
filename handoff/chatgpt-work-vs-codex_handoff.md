---
name: "ChatGPT Work 與 Codex 文章"
project: "blog"
slug: chatgpt-work-vs-codex
status: active
updated: 2026-07-17
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-07-17 17:11

## 本次 session 完成的事（2026-07-17）

- 完成 ChatGPT Work 與 Codex 文章的版型重整與內容修正。
- 補充並釐清同一個 ChatGPT Desktop App 內的 ChatGPT Work 與 Codex 模式，以及本機與網頁版 Work 執行環境的差異。
- 補充網頁版 Work 遠端 Linux 環境與公共網路連線的實測證據，並產生 4 張文章圖片。
- `article-review` draft audit 通過 3/3，`npm run build` 通過，final audit 通過 5/5。
- 完成 codex-skill-init live sync、20/20 測試與 skill 變更提交 `d7d72d0`，尚未 push。
- 文章相關檔案尚未 commit，等待用戶拍板內容。

## 下次接手第一步

先讀取文章與 task-tracker，確認目前內容與待拍板狀態。取得用戶確認後，使用 `commit-guide` 隔離文章相關檔案並提交；push 仍須另行取得授權。

## 重要 ID / 路徑

- Skill commit：`d7d72d0`
- 文章：`/Users/darrellwang/Darrell/code/blog/source/_posts/chatgpt-work-vs-codex.md`
- 文章圖片目錄：`/Users/darrellwang/Darrell/code/blog/source/_posts/chatgpt-work-vs-codex/`
- Tracker：`/Users/darrellwang/Darrell/code/blog/task-tracker.md`
- 交接文件：`/Users/darrellwang/Darrell/code/blog/handoff/chatgpt-work-vs-codex_handoff.md`

## 已知限制 / 決策

- 文章已完成格式、建置與必要內容驗證，但正式提交前仍需用戶確認文章內容。
- 文章相關檔案尚未 commit；skill commit `d7d72d0` 尚未 push。
- `image_dimensions.json` 含其他既有變更，提交時必須隔離處理。
- 不再追加沒有明確驗收價值的瀏覽器檢查；以 Markdown audit、fresh build 與 final audit 為主要驗收。
- 本專案目前有 task-tracker.md，待決事項以該檔案為唯一來源。

## 硬性規範

- ChatGPT Work 與 Codex 是同一個 ChatGPT Desktop App 內的兩種模式，不寫成兩個 App。
- 區分產品模式、執行位置、檔案存取與網路能力，不把不同層級混成同一個比較。
- 文章只描述已由實測或可靠來源支持的結論。
- 不把自動稽核通過當成內容可發布；內容拍板前不得提交文章。
- commit 前隔離 unrelated changes；未取得授權不得 push。
- Skill 本體留在 `/Users/darrellwang/Darrell/skills`；repo 內只放入口 symlink。
- 中文一律台灣繁體，禁止簡體與 em dash。

**接手前驗證清單**（第一步，code 前必跑）：

□ 確認 Blog repo 工作樹：
  git -C /Users/darrellwang/Darrell/code/blog status --short

□ 讀取目前文章與 tracker：
  /Users/darrellwang/Darrell/code/blog/source/_posts/chatgpt-work-vs-codex.md
  /Users/darrellwang/Darrell/code/blog/task-tracker.md

□ 文章若有修改，在 blog 專案根目錄重新執行：
  npm run build

□ 完成 build 後重新執行 article-review 的 draft audit 與 final freshness audit。
