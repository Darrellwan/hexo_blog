# Claude Cowork 文章補充素材

> 這份文件是給 Darrell 回來更新文章時用的參考素材，不會直接發布。
> 建立日期：2026-02-28

---

## 一、Scheduled Tasks（排程任務）— 2026/02/25 新功能

### 功能概述

Anthropic 於 2026/02/25 推出 Cowork Scheduled Tasks，讓使用者設定一次 prompt，Claude 就會按照排程自動執行。不需要寫程式碼或 API。

**官方公告**：https://x.com/claudeai/status/2026720870631354429
**Help Center**：https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-cowork

### 支援的排程頻率

| 頻率 | 說明 |
|------|------|
| Hourly | 每小時執行 |
| Daily | 每日執行 |
| Weekly | 每週執行 |
| Weekdays | 僅平日（週一～週五） |
| Manual | 手動觸發 |

### 設定方式

**方式 1：/schedule 指令**
1. 在 Cowork 對話中輸入 `/schedule`
2. 描述你要排程的任務
3. Claude 可能會用 AskUserQuestion 確認細節
4. 確認任務名稱、排程、描述後點「Schedule」

**方式 2：側邊欄 Scheduled 頁面**
1. 點左側邊欄「Scheduled」
2. 點「+ New task」
3. 填寫：任務名稱、描述、詳細 prompt、頻率、模型選擇（可選）、工作資料夾（可選）
4. 點「Save」

### 常見應用場景

- **每日簡報**：「彙整過去 24 小時的 Slack 訊息、email、行事曆事件」
- **每週報告**：從 Google Drive、試算表或連接的工具編譯資料
- **定期研究**：追蹤特定主題、競品、產業新聞
- **檔案整理**：定期整理指定資料夾
- **團隊更新**：從專案管理工具生成進度報告

### 重要限制

- **電腦必須開著、Claude Desktop 必須開著**才會執行
- 如果電腦休眠或 app 關閉，該次排程會被跳過
- 電腦醒來或 app 重新開啟後，會自動補跑一次
- 每個排程任務都作為獨立的 Cowork session 運行

### 方案支援

所有付費方案都可使用：Pro、Max、Team、Enterprise。

### 建議文章可補充的內容

- 在「進階功能」區塊後新增一個 `<h2 id="scheduled-tasks">` 段落
- 包含：功能說明 + 兩種設定方式 + 截圖 + 限制提醒
- 可以實測一個場景（例如：每天早上自動彙整 Slack 未讀）
- FAQ 可新增：「排程任務會在電腦關機時執行嗎？」

---

## 二、Navtoor 的 Cowork 教學觀點（補充視角）

### 來源

Navtoor (@heynavtoor) 在 X 上發了一篇完整的 Cowork 入門指南。
原文：https://x.com/heynavtoor/status/2026717574776631556
Brain 存檔：`~/Darrell/brain/articles/blogs/2026-02-27_navtoor_claude-cowork-complete-guide.md`

### 值得參考的觀點

#### 1. Context Files 策略（你的文章目前沒提到）

Navtoor 提出一個實用的方法：建一個「Claude Context」資料夾，裡面放三個 .md 檔：

- **about-me.md** — 你是誰、你做什麼、你的角色
- **brand-voice.md** — 你的溝通風格、慣用語、不喜歡的表達
- **working-style.md** — 你希望 Claude 怎麼配合你（先問問題？長輸出還是短輸出？）

**核心觀點**：「Stop thinking about better prompts and start thinking about better files.」
Prompt 是一次性技能，會隨模型進步貶值；Context 是累積性資產，越用越好。

> 這跟 Claude Code 的 CLAUDE.md 概念相同，但對 Cowork 用戶來說是一個很好的入門框架。

#### 2. AskUserQuestion 的使用策略

Navtoor 建議在每個非簡單任務的 prompt 結尾加上：

```
DO NOT start working yet. First, ask me clarifying questions so we can define the approach together. Only begin once we've aligned.
```

**核心觀點**：ChatGPT 訓練你寫更好的 prompt，Cowork 訓練你給更好的 context。一個會貶值，一個會增值。

#### 3. 使用心得數據

- 作者說 Cowork 覆蓋了他約 **60% 的知識工作**
- 典型工作迴圈：描述需求 → Claude 問 3 個問題 → 回答 → 20 分鐘後拿到成品
- 他每天早上第一個打開的工具就是 Cowork（在 email、Notion 之前）

#### 4. 誠實缺點清單（與你文章的 FAQ 可以互補）

| 缺點 | Navtoor 的描述 | 你文章目前有提到？ |
|------|---------------|------------------|
| 沒有跨 session 記憶 | 每次都重新開始，靠 context files 解決 | ❌ 沒提 |
| 關 app 任務就斷 | 電腦休眠沒事，關 app 才會斷 | ❌ 沒提 |
| 用量比普通聊天快 | Agent 模式消耗更多配額 | ❌ 沒提 |
| 只有桌面版 | 沒有手機版、沒有跨裝置同步 | ✅ 有提（結語中） |
| 不能生圖 | 要用 Gemini Imagen | ❌ 沒提 |
| 研究預覽階段 | Agent safety 仍在開發中 | ✅ 有提 |

### 建議文章可補充的內容

- 在安全提醒或結語處補充「跨 session 無記憶」的解法（context files）
- FAQ 補充：配額消耗、關 app 任務中斷、不能生圖
- 可考慮新增一個「進階使用技巧」段落，放 context files 策略和 AskUserQuestion 技巧

---

## 三、更新文章的建議優先順序

1. **【必做】新增 Scheduled Tasks 段落** — 這是重大新功能，讀者會想知道
2. **【建議】補充 Context Files 策略** — 實用技巧，提升文章深度
3. **【建議】更新 FAQ** — 補充配額、記憶、關 app 等常見問題
4. **【可選】更新 modified 日期和參考來源**
5. **【可選】quickNav 加入 Scheduled Tasks 的錨點

---

## 四、參考連結

- [Schedule recurring tasks in Cowork — Help Center](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-cowork)
- [Claude 官方公告推文](https://x.com/claudeai/status/2026720870631354429)
- [The Decoder 報導](https://the-decoder.com/claudes-cowork-desktop-app-now-runs-scheduled-tasks-so-your-ai-assistant-works-while-you-sleep/)
- [TechRadar 報導](https://www.techradar.com/pro/claude-cowork-can-now-handle-all-your-recurring-work-tasks)
- [Navtoor 原文](https://x.com/heynavtoor/status/2026717574776631556)
