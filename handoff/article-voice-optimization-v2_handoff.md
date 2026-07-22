---
name: "Article voice 優化"
project: "blog"
slug: article-voice-optimization-v2
status: active
updated: 2026-07-18
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-07-18

## 本次 session 完成的事（2026-07-18）

- 接手檢查發現原 `condition-report.json` 無法通過官方 validator：六個 C1 source audit 的 SHA-256 都引用到產生器以 C0 condition ID 算出的舊值。
- 保留原失效報告與所有原始文章／稽核證據，新增版本化 finalizer、4 個回歸測試、`condition-report-v2.json`、修復紀錄與終止決策。
- v2 正式報告通過官方 validator。C1 主要指標由 2 降至 0 且沒有題目變差，但 Klaviyo r1 仍有 1 個未授權低風險事實，因此證據門檻與整體 C1 判定失敗。
- 獨立複核最差邊界比例樣本，確認仍有實質操作內容，不是只剩限制聲明的空殼。
- 依預先登記的停止規則結束實驗：無勝出版本，不執行 C2、C3、final holdout、整合或候選檔；holdout 維持封存，正式寫作流程未修改。
- 62 個實驗測試、正式報告驗證、凍結檔案驗證與 Spectra 驗證通過；Spectra change 已封存。

## 下次接手第一步

這條工作線沒有待續步驟，不得從封存 change 直接跑 C2。若未來要再研究，先另開新 change、重新凍結規則與資料，再從新的開發條件開始；不得開啟本次 final holdout。

## 重要 ID／路徑

- 工作線：`article-voice-optimization-v2`
- 交接文件：`/Users/darrellwang/Darrell/code/blog/handoff/article-voice-optimization-v2_handoff.md`
- Task tracker：`/Users/darrellwang/Darrell/code/blog/task-tracker.md`
- Spectra 封存：`/Users/darrellwang/Darrell/code/blog/openspec/changes/archive/2026-07-18-article-voice-optimization-v2/`
- C1 正式報告：`/Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/runs/C1/condition-report-v2.json`
- C1 原失效報告：`/Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/runs/C1/condition-report.json`
- 報告修復紀錄：`/Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/runs/C1/condition-report-v2-repair.json`
- 邊界獨立複核：`/Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/runs/C1/boundary-review.json`
- C1 終止決策：`/Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/runs/C1/c1-terminal-decision.json`
- C1 減法卡：`/Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/conditions/c1.md`
- C1 跑計畫：`/Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/conditions/c1-run-plan.json`
- C1 執行腳本：`/Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/scripts/run_c1.py`

## 已知限制／決策

- C1 的主要指標達標，但 6 篇只有 5 篇可比較；Klaviyo r1 的 1 個未授權低風險事實讓證據門檻與整體條件失敗。
- 原 `condition-report.json` 是保留的失效歷史，不得當正式判決；正式判決只看 `condition-report-v2.json` 與 `c1-terminal-decision.json`。
- 缺少選用的 `audit-decisions.json` 已記為身世紀錄缺口；它不是凍結 validator 的必要證據，也不改變重算後的失敗結論。
- Runtime 由 0.144.4 偏移至 0.144.5；使用者已明確表示不需處理，C0 凍結紀錄未修改。
- C1 在 freeze-root 之外執行，runtime deviation 已記於 run-record.runtime_deviation。
- final holdout 為 sealed、勝出版本為 null、凍結後內容存取為空。
- 未 commit、未 push、未修改正式寫作流程。

## 硬性規範

- 範圍只限 Article voice。
- 每次實驗只動一個變因；失敗改動不得繼承。
- 未授權敘述必須可回溯至 source packet，不得自行補猜機制。
- 動既有檔案前先讀實際檔案、caller 與共用 pattern。
- 不得從本次封存 change 繼續 C2／C3；新研究必須另開 change。
- 不 commit、不 push；若未來要提交，仍需取得使用者另行授權。
- holdout 保持封存，不得讀取內容或生成文章。

## ⚠️ 接手前驗證清單（開始寫 code 前必跑）

□ 確認 task tracker 已列為完成：
  `rg -n 'Article voice v2|C1 終止|無勝出版本' /Users/darrellwang/Darrell/code/blog/task-tracker.md`

□ 重跑 C1 正式報告 validator：
  `python3 /Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/scripts/validate_condition_report.py /Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/runs/C1/condition-report-v2.json`

□ 確認凍結檔案未漂移：
  `python3 /Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/scripts/validate-frozen-manifests.py`

□ 確認 holdout 仍為 sealed 且凍結後內容存取為空；只能讀 state 與 access log，不得讀 packet 內容：
  `jq '{state, unique_development_winner, opened_at}' /Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/holdout-state.json`
  `jq '{post_freeze_content_access}' /Users/darrellwang/Darrell/skills/darrell-voice/tests/article-ablation/holdout-access-log.json`

□ 確認工作樹狀態：
  `git -C /Users/darrellwang/Darrell/code/blog status --short`

□ 確認 Spectra 只存在於封存目錄：
  `test -d /Users/darrellwang/Darrell/code/blog/openspec/changes/archive/2026-07-18-article-voice-optimization-v2 && test ! -e /Users/darrellwang/Darrell/code/blog/openspec/changes/article-voice-optimization-v2`
