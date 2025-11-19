---
title: Google Antigravity 搭配 Gemini 3 模型還能自動化測試！Vibe Coding 新神器
date: 2025-11-19 21:52:39
tags:
  - Google
  - AI
  - Antigravity
categories:
  - 開發工具
description: "深入體驗 Google Antigravity，這款新的 Agentic AI 程式開發工具。看看它如何透過自主規劃、執行和工具整合，重新定義軟體開發流程。"
bgImage: blog-google-antigravity.jpg
preload:
  - blog-google-antigravity.jpg
---

{% darrellImageCover antigravity_cover blog-google-antigravity.jpg max-800 %}

{% quickNav %}
  [
    {
      "text": "安裝設定流程",
      "anchor": "installation",
      "desc": "6 個步驟完成初始設定"
    },
    {
      "text": "實際開發體驗",
      "anchor":
  "development-experience",
      "desc": "天氣卡片專案實測"
    },
    {
      "text": "自動化測試功能",
      "anchor": "browser-extension",
      "desc": "Chrome 擴充功能整合"
    }
  ]
  {% endquickNav %}


# Google Antigravity 搭配 Gemini 3 模型全新推出

Google 今天推出了一款名為 **Antigravity** 的全新 AI Coding 工具，
主打 "Agentic"。
也是一款基於 Visual Studio Code 開發的
用起來很像是 Cursor 和 

這篇文章將帶大家實際走一遍 Antigravity 的完整安裝與設定流程，從初次啟動到實際執行開發任務，看看它究竟有什麼過人之處。

## 第一次啟動：完整的引導流程

### Step 1: 歡迎畫面
啟動 Antigravity 後，首先會看到簡潔的歡迎畫面，顯示 "Welcome to Antigravity" 與 "Let's get you set up" 的提示。

{% darrellImageCover antigravity_cover step1-welcome-splash-screen.png max-800 %}

### Step 2: 選擇設定來源
第一個選項是選擇如何設定你的開發環境。Antigravity 提供三種方式：

{% darrellImage800Alt "Google Antigravity 初始設定畫面，提供三種設定匯入選項：Start fresh、Import from VS Code、Import from Cursor" step2-setup-import-settings.png max-800 %}

- **Start fresh**：從零開始設定
- **Import from VS Code**：從 VS Code 匯入設定
- **Import from Cursor**：從 Cursor 匯入設定

如果原本的編輯器有些特殊的個人設定，也可以直接帶到 Antigravity 中使用。

### Step 3: 選擇編輯器主題
接下來選擇你喜歡的編輯器主題，Antigravity 提供四種主題：

{% darrellImage800Alt "Google Antigravity 編輯器主題選擇畫面，提供 Dark、Tokyo Night、Light、Solarized Light 四種主題選項" step3-choose-editor-theme.png max-800 %}

- **Dark**：經典深色主題（預設選項）
- **Tokyo Night**：看起來是深藍色
- **Light**：淺色主題
- **Solarized Light**：淺色但顏色比較和諧

### Step 4: 選擇 Agent 工作模式
這是 Antigravity 最核心的設定。你需要決定 AI Agent 如何與你協作：

{% darrellImage800Alt "Google Antigravity Agent 模式選擇畫面，提供 Agent-driven、Agent-assisted、Review-driven、Custom configuration 四種開發模式" step4-agent-mode-selection.png max-800 %}

- **Agent-driven development**：AI 主導開發流程
- **Agent-assisted development**：AI 輔助開發（推薦）
- **Review-driven development**：以 Code Review 為主
- **Custom configuration**：自訂設定

右側可以設定：
- **Terminal execution policy**：終端機執行權限（Auto/Manual）
- **Review policy**：審查政策（Agent Decides/Always Ask）

### Step 5: 編輯器詳細配置
在這個步驟中，你可以設定更細節的編輯器選項：

{% darrellImage800Alt "Google Antigravity 編輯器配置畫面，可設定 Keybindings（Normal/Vim）、安裝 7 個擴充功能、安裝 Command Line 工具" step5-editor-configuration.png max-800 %}

- **Keybindings**：選擇 Normal 或 Vim 快捷鍵模式
- **Extensions**：準備會安裝的擴充套件，截圖中的七個是從 cursor 中原本就有安裝的
- **Command Line**：安裝 `agy` 命令列工具

### Step 6: Google 帳號登入
完成基本設定後，需要使用 Google 帳號登入才能開始使用 Antigravity：

{% darrellImage800Alt "Google Antigravity Google 登入畫面，要求使用者透過 Google 帳號登入以存取 Antigravity 服務" step6-google-signin.png max-800 %}

點選 "Sign in with Google" 按鈕，完成授權後就能正式進入主介面。

## Antigravity 介面

登入後，你會看到 Antigravity 的主介面：

{% darrellImage800Alt "Antigravity IDE 主介面展示三欄式佈局：左側檔案總管、中間程式碼編輯器、右側 Agent 聊天面板" antigravity-ide-overview.png max-800 %}

主介面包含幾個關鍵區域：
- 左側面板：檔案總管、搜尋、Git 等工具
- 中間區域：工作區列表（Workspaces）
- 右側面板：Antigravity Agent 聊天介面
- 頂部工具列：Open Agent Manager、Open Browser 測試 等功能

你可以點選 "Open Folder" 開啟新專案，或是從 Workspaces 中選擇已有的專案。

## 實際開發體驗

我們透過建立一個天氣卡片的方式，來建立一個網頁看看
在右側放入，請幫我們建立天氣卡片，要包含四種不同的天氣資訊
並選擇用 planning 先請他規劃怎麼做

### 規劃階段 (Implementation Plan)

Planning 完成時，他會產生一份 Implementation Plan
裡面會是他目前的規劃內容和方向

你可以先審查他規劃的是否與你相同
後續他就會根據這個規劃來思考要怎麼執行

{% darrellImage800Alt "Antigravity Agent 聊天輸入框：使用者輸入「請幫我們建立天氣卡片，要包含四種不同的天氣資訊」，並選擇 Planning 模式與 Gemini 3 Pro (High) 模型" antigravity-ide-implementation_plan.png max-800 %}

### 任務清單 Task

Agent 會將 Implementation Plan 拆解成可執行的任務清單 Task List

除了建立檔案外，就會開始實作四種天氣的動畫
再加入 JavaScript 來控制天氣的切換
最後會**自行做測試**

{% darrellImage800Alt "Google Antigravity 任務清單面板展開畫面，顯示完整的 Weather Cards 任務列表與執行步驟" feature-task-list-panel.png max-800 %}

執行的過程中也會回來更新進度，所以你可以掌握目前執行到哪裡

### 執行中的進度顯示

當 Agent 開始執行時，任務清單會即時更新狀態：

{% darrellImage800Alt "Google Antigravity 任務清單面板，顯示 Weather Cards 專案的任務進度追蹤，部分任務已完成並標記勾選" feature-task-progress-tracking.png max-800 %}

可以看到：
- 打勾： **Create implementation plan**（已完成）
- 圓圈： 多項任務正在執行中
- 框框： 等待執行的任務

## Antigravity Browser Extension

Antigravity 還提供了 Chrome 瀏覽器擴充功能：
**Antigravity Browser Extension**

{% darrellImage800Alt "Google Antigravity 瀏覽器擴充功能頁面，顯示 Antigravity Browser Extension 在 Chrome Web Store 的安裝頁面" feature-chrome-extension.png max-800 %}

安裝好後，後續需要測試時
Antigravity 會自動開啟瀏覽器，並測試網頁是否有正確運行
例如天氣動畫是否真的有動畫
不同天氣的切換按鈕可以做切換

## 結論

這次的 Google Antigravity 搭配 Gemini 3 是一個不錯的體驗
對於小型專案的建立和開發又更方便了

以往在 Cursor 例如要自動化測試，自己就需要安裝別的套件或是第三方工具
這次 Google 自己整合好 Chrome 讓整體體驗更順暢

不過 Gemini 3 模型是否能像 Claude Sonnet 4.5 在各種類型的專案都一樣表現不錯
就需要時間和大家的心得來驗證

目前 Antigravity 還在早期階段，並且是免費讓大家使用
很常會遇到 error 或是 model overloaded 的情況
也算是美中不足的地方，畢竟開發時被打斷很容易就索性不用
不如用付費的 Claude Code 穩穩定定開發

也期待 Antigravity 後續的付費方案是否能跟 Google AI Pro 或 Ultra 整併

{% darrellImage800Alt "Google AI 付費方案比較表：免費版、Google AI Pro（每月 NT$660）、Google AI Ultra（前 3 個月每月 NT$4050）三種方案的功能差異" google_ai_pro_ultra_pricing_plan.png max-800 %}

## 常見問題

Q: Antigravity 是否完全免費？
A: 目前免費使用，但經常遇到 model overloaded 錯誤，未來可能推出付費方案

Q: 與 Cursor、Claude Code 有什麼不同？
A: Antigravity 內建 Chrome 自動化測試功能是這次體驗最大不同，其餘使用體驗和 Cursor 相似，差異是模型的不同，工具本質是差不多的。Claude Code 是 Command Line 工具，和 Antigravity Cursor 不太相同。Claude Code 應該是跟 Gemini CLI 對比。

## 延伸閱讀

如果你對 AI 開發工具有興趣，推薦你閱讀以下文章：

{% articleCard
  url="/google-gemini-cli/"
  title="Google 發布 Gemini CLI Tool 免費額度超級夠用 和 Claude Code 的比較"
  previewText="Google Gemini CLI 提供免費額度讓開發者在終端機中使用 AI 助手，與 Claude Code 相比各有優勢。"
  thumbnail="https://www.darrelltw.com/google-gemini-cli/blog-gemini-cli-bg.jpg"
%}

{% articleCard
  url="/claude-code-new-command-line-tool/"
  title="Claude Code 發佈 Command Line 的新工具"
  previewText="Claude Code 推出全新的命令列工具，讓開發者能在終端機中直接使用 Claude AI 進行開發。"
  thumbnail="https://www.darrelltw.com/claude-code-new-command-line-tool/claude_code.jpg"
%}
