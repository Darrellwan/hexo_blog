---
name: "n8n SEO 救援與教學頁改版"
project: "blog"
slug: n8n-seo-rescue
status: active
updated: 2026-08-20
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-08-20 17:18

## 本次 session 完成的事（2026-08-20）

- 完成 7–8 月 Google 搜尋排名與 n8n 關鍵字下滑原因診斷，區分搜尋熱潮退燒、n8n hub 頁競爭力不足，以及少數 AI 文章內容老化。
- 將 n8n 教學 hub 頁改成入門指南加資源導覽並部署上線，完成內容、模板、meta、轉址與 AI 文章內鏈。
- 修正 hub 頁失效的聯絡表單連結，改至 `/n8n-expert/#contact`，並將舊 `contact.html` 轉址至服務頁。
- 建立並推送 hub 改版 commit `548d3aa`。
- 建立並推送死表單修正 commit `6df3eb5`。

## 下次接手第一步

在 `/Users/darrellwang/Darrell/code/blog` 執行 `bin/gsc-query-trajectory.py`，回看「n8n 教學」是否回到前 10；接著搜尋站內是否仍有指向舊 Zeabur n8n 實例的前端表單與 webhook。

## 重要 ID / 路徑

- 專案根目錄：`/Users/darrellwang/Darrell/code/blog`
- 交接文件：`/Users/darrellwang/Darrell/code/blog/handoff/n8n-seo-rescue_handoff.md`
- Task tracker：`/Users/darrellwang/Darrell/code/blog/task-tracker.md`
- GSC 軌跡工具：`/Users/darrellwang/Darrell/code/blog/bin/gsc-query-trajectory.py`
- GSC 射程內關鍵字工具：`/Users/darrellwang/Darrell/code/blog/bin/gsc-n8n-striking-distance.py`
- GSC 憑證：`/Users/darrellwang/.claude/ga4_gsc_service_account.json`
- Hub 頁：`https://www.darrelltw.com/n8n-tutorial-resources/`
- 服務頁：`https://www.darrelltw.com/n8n-expert/`
- Hub 來源：`/Users/darrellwang/Darrell/code/blog/source/n8n-tutorial-resources/index.md`
- Hub 模板：`/Users/darrellwang/Darrell/code/blog/themes/next/layout/n8n-resources.swig`

## 已知限制 / 決策

- n8n head 字「n8n」目前不值得投入；優先觀察有學習意圖且能接到服務漏斗的「n8n 教學」。
- 趨勢型 AI 文章預設壽命較短，後續需依實際內容更新後再標示更新日期。
- 尚未全面掃描站內是否仍有指向舊 Zeabur n8n 實例的前端表單。
- 新站 automation.darrelltw.com 尚未正式公開，首頁數字佐證、外部入口連結與公開時間仍待決定。

## 硬性規範

- 任何部署或事故摘要都必須回查部署平台時間軸、git commit、正式站回應與必要的瀏覽器結果後才能定稿。
- n8n 實例遷移後，必須搜尋站內所有舊主機網域與 webhook URL，逐頁檢查表單提交、轉址與正式站端到端結果。
- 不得把短期搜尋熱潮退燒誤判成排名下滑；分析時必須拆分搜尋量變化與真實排名變化。
- 若是 n8n 專案，開始前先 invoke `/n8n-cli` + `/n8n-workflow-dev`。

## 🔴 待決問題

見 task-tracker.md 🔴 待決問題（1 項）。

## ⚠️ 接手前驗證清單（開始寫 code 前必跑）

□ 確認專案目前工作區與最近提交：
  cd /Users/darrellwang/Darrell/code/blog && git status --short && git log -3 --oneline

□ 確認 GSC 工具存在且查看使用方式：
  cd /Users/darrellwang/Darrell/code/blog && python3 bin/gsc-query-trajectory.py --help

□ 確認站內是否仍有舊 Zeabur 網域或 webhook：
  cd /Users/darrellwang/Darrell/code/blog && rg -n -i "zeabur\.app|webhook" source/ themes/ scripts/

□ 確認 hub 與舊 contact 網址目前回應：
  curl -sI https://www.darrelltw.com/n8n-tutorial-resources/
  curl -sI https://www.darrelltw.com/tools/n8n_template/contact.html
