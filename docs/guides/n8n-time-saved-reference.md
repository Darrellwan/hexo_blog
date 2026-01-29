# n8n Time Saved 功能參考資料

> 建立日期：2025-12-20
> 用途：撰寫 n8n Time Saved 教學文章的參考文獻

---

## 功能概述

**Time Saved** 是 n8n **Insights** 功能的一部分，用於追蹤和計算工作流程自動化節省的時間，幫助用戶量化 ROI。

### 版本資訊
| 項目 | 內容 |
|------|------|
| 正式釋出 | n8n 2.1.0 (2025年12月15日) |
| 相關 PR | #22607（收集 dynamic/fixed time saved）、#22650（啟用 Time Saved node） |
| 合併日期 | 2025年12月3日（PR #22607）、12月9日（PR #22650） |

---

## 兩種計算方式

### 1. Fixed Time Saved（固定時間）
- **位置**: Workflow Settings → Estimated time saved
- **設定方式**: 輸入每次執行節省的分鐘數（整數）
- **適用情境**: 每次執行路徑相同的簡單工作流程
- **進入方式**: 三點選單 → Settings

### 2. Dynamic Time Saved（動態時間）
- **方式**: 使用 **Time Saved Node** 節點
- **優勢**: 根據實際執行路徑計算，適用分支邏輯複雜的工作流程
- **加總邏輯**: 多個 Time Saved Node 會自動累加

---

## Time Saved Node 參數

| 參數 | 說明 | 選項 |
|------|------|------|
| Time saved | 節省的分鐘數 | 數字（分鐘） |
| Calculation mode | 計算模式 | `Once`（整批計算一次）或 `Per item`（分鐘數 × 項目數量） |

### Calculation Mode 詳解
- **Once**: 無論處理多少筆資料，都只計算一次設定的分鐘數
- **Per item**: 設定的分鐘數會乘以輸入項目數量
  - 例如：設定 2 分鐘，處理 10 筆資料 → 總共節省 20 分鐘

---

## 資料顯示位置

| 位置 | 內容 | 可用方案 |
|------|------|----------|
| Summary Banner | 過去 7 天的執行次數、失敗率、節省時間 | 所有方案 |
| Insights Dashboard | 詳細視覺化圖表、per-workflow 指標、歷史比較 | Pro / Enterprise |

### Dashboard 時間範圍
- **Pro**: 7 天、14 天
- **Enterprise**: 24 小時 ~ 1 年

---

## 限制與注意事項

1. **僅追蹤 Production Executions**
   - 不含手動執行（Manual Executions）
   - 不含子工作流程（Sub-workflows）

2. **子工作流程不支援**
   - 目前 Time Saved 不會計算子工作流程的節省時間
   - n8n 團隊計畫在未來版本加入

3. **最小單位**
   - 目前只能設定整數分鐘
   - 社群有人要求支援 0.5 分鐘等小數值

---

## Fixed vs Dynamic 比較

| 項目 | Fixed | Dynamic |
|------|-------|---------|
| 設定位置 | Workflow Settings | Time Saved Node |
| 彈性 | 低（固定值） | 高（按路徑計算） |
| 適用情境 | 線性流程 | 分支複雜流程 |
| Per item 支援 | ❌ | ✅ |
| 多路徑支援 | ❌ | ✅（多節點累加） |

---

## 官方來源連結

### 文件
- [n8n Insights Documentation](https://docs.n8n.io/insights/)
- [n8n Workflow Settings](https://docs.n8n.io/workflows/settings/)

### GitHub PR
- [PR #22607 - Collect dynamic and fixed time saved insights](https://github.com/n8n-io/n8n/pull/22607)
- [PR #22650 - Enable time saved node for testing](https://github.com/n8n-io/n8n/pull/22650)

### 社群討論
- [How to use the "Estimated time saved" option](https://community.n8n.io/t/how-to-use-the-estimated-time-saved-option/97621)
- [Estimated time saved only in minutes](https://community.n8n.io/t/estimated-time-saved-only-in-minutes/186449)

---

## 文章大綱備用

### 標題方案
- `n8n Time Saved Node 教學 - 追蹤自動化工作流 ROI`
- `n8n Insights 與 Time Saved 節點 - 量化你的自動化價值`

### 建議結構
1. 封面 + 開場（痛點：老闆問 ROI 答不出來）
2. 快速導覽
3. Insights 功能概述
4. Fixed Time Saved 設定教學
5. Dynamic Time Saved（Time Saved Node）設定教學
6. 兩種方式比較表
7. 實際案例：客戶報價單自動化（不同路徑不同時間）
8. FAQ（4-5 題）
9. 相關文章推薦

### 需要準備的截圖
1. `blog-n8n-time-saved-cover.jpg` - 封面圖
2. `n8n-time-saved-workflow-settings.png` - Workflow Settings 設定畫面
3. `n8n-time-saved-node-panel.png` - Time Saved Node 設定面板
4. `n8n-time-saved-node-in-workflow.png` - Node 在工作流程中的位置
5. `n8n-insights-summary-banner.png` - Summary Banner 顯示
6. `n8n-insights-dashboard.png` - Insights Dashboard（如有 Pro）
7. `n8n-time-saved-use-case-workflow.png` - 案例工作流程截圖

---

## FAQ 參考答案

**Q: 為什麼 Insights Dashboard 看不到資料？**
A: 確認是 Production Execution（非手動執行），且需累積足夠執行次數才會顯示。

**Q: 子工作流程的 Time Saved 會計算嗎？**
A: 目前不支援，n8n 團隊計畫在未來版本加入。

**Q: Calculation mode 的 Per item 如何計算？**
A: 設定的分鐘數會乘以輸入項目數量。例如設定 2 分鐘，處理 10 筆資料，總共節省 20 分鐘。

**Q: 我是免費版，可以用這功能嗎？**
A: 可以！Summary Banner 所有方案都能看到過去 7 天的數據，但 Insights Dashboard 僅 Pro/Enterprise 可用。
