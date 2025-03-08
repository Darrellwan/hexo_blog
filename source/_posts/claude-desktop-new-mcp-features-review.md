---
title: Claude Desktop MCP 應用測試心得
date: 2025-03-07 16:13:50
tags:
  - Claude
  - AI
  - 開發工具
page_type: post
description: 測試 Claude Desktop MCP(model context protocol) 的應用，包括 FileSystem、Fetch 和 Google Maps 的使用心得與注意事項，讓 Claude 幫上更多忙
categories: 
  - AI
bgImage: claude_desktop_mcp_bg.jpg
preload:
  - claude_desktop_mcp_bg.jpg
---

{% darrellImageCover claude_desktop_mcp_bg claude_desktop_mcp_bg.jpg max-800 %}

## 簡介 MCP

Model Context Protocol (MCP) 是一個讓 AI 可以變得更聰明的協議，
只要想用的工具有支援 MCP，就可以讓 AI 模型直接取用這個工具。

例如你覺得你的下載資料夾很亂，
但 AI 模型根本沒有權限可以讀取你的下載資料夾，這時該怎麼辦？

而有了 FileSystem 這個 MCP Tool，AI 模型就可以藉由 FileSystem 來存取你的下載資料夾，
不僅可以分析該怎麼整理，甚至還能直接幫你整理好。

{% darrellImage800 claude_mcp_image claude_mcp_image.jpg max-400 %}

## Claude Desktop MCP 功能

手上的工具有 Cursor 跟 Claude Desktop，
這次就先用 Claude Desktop 來試用看看，
並且挑選幾個看起來比較簡單或有興趣的 MCP Tools。
設置過程也相當簡單：


1. 開啟 Claude Desktop Settings
{% darrellImage800 claude_desktop-mcp_setting_step1 claude_desktop-mcp_setting_step1.png max-800 %}

2. 編輯那份 config json 檔案
{% darrellImage800 claude_desktop-mcp_setting_step2 claude_desktop-mcp_setting_step2.png max-800 %}

3. 貼上 MCP Server 教學的 JSON 設定，有些部分工具需要貼額外的 API Key
{% darrellImage800 claude_desktop-mcp_setting_step3 claude_desktop-mcp_setting_step3.png max-800 %}


## 主要功能介紹

### 1. FileSystem - 檔案系統操作

FileSystem 功能讓 Claude 可以讀取和操作你指定資料夾中的檔案。目前測試期間主要可以存取 downloads 資料夾，讓 Claude 協助你整理和分析檔案。

{% darrellImage800 claude_desktop-filesystem_example claude_desktop-filesystem_example.jpg max-800 %}

能夠做的事情包含：
- 讀取指定的資料夾範圍內的檔案
- 分析資料夾內的檔案類型、空間大小等等
- 新增及刪除檔案
- 一次幫你整理好整個資料夾

這功能對於整理下載資料夾超級實用。你可以直接請 Claude 幫你把檔案按照類型或日期分類整理，不用再手動一個個移動檔案了。

### 2. Fetch - 網頁讀取能力

Claude 不用再只靠現有的資訊來回答問題。Fetch 讓 Claude 可以讀取網頁內容，獲取最新的資訊。

{% darrellImage800 claude_desktop-fetch_example claude_desktop-fetch_example.jpg max-800 %}

雖然不是直接替代搜尋引擎，但對於獲取特定網站的最新資訊非常方便，而且 Claude 可以幫你整理和總結網頁內容。

### 3. Google Maps - 地圖服務整合

Google Maps 功能需要先申請 Google Maps API Key，但設定好後能做的事情還蠻多的：

{% darrellImage800 claude_desktop-google_map_example claude_desktop-google_map_example.jpg max-800 %}

- 查詢特定地址附近的餐廳、商店等
- 提供評價數量和評分資訊
- 規劃路線導航

測試的限制：
- 無法取得當下位置資訊
- 有時候回傳的資訊不完全正確，Prompt 可能有優化空間

例如，我測試查詢某家餐廳的評價時，它提供的星級評分與實際不符。建議可以多實際檢查。

## API Token 放在 MCP 專案的風險

在 Cursor 等開發環境中使用 MCP Server 專案時，特別要注意 API Token 的安全性：

**切勿將 API Token 明碼寫在程式碼中！**

如果你的 API Token 未經過環境變數處理就明碼存在專案的程式碼中，一旦上傳到 Github 等公開的 Repository，就等於把這些 Token 公開了。

這會導致嚴重的安全問題：
- 別人可以使用你的 API 配額
- 可能產生大量意外費用
- 甚至可能面臨資料安全風險

請務必使用 `.env` 檔案和環境變數來管理你的 API Keys！

## 使用心得

Claude Desktop MCP 功能讓 Claude 從單純的聊天機器人變成更實用的助手。檔案系統操作和網頁查詢功能特別好用，大幅提升了 Claude 的實用性。

特別喜歡的部分：
- FileSystem 讓 Claude 可以幫我整理雜亂的下載資料夾
- Fetch 功能讓 Claude 能夠獲取最新資訊，不再依賴過時的訓練數據
- 即使有些限制，整體來說這次的更新非常有誠意
- 未來會有更多工具加入 MCP 協議，帶來更多無限的可能性

不足的地方：
- Google Maps 功能的準確性有時候不夠理想
- 某些複雜的操作可能需要多次嘗試才能得到理想結果

## MCP Tools 列表

{% darrellImage800 mcp_io_list mcp_io_list.png max-800 %}

在 [MCP Example Servers](https://modelcontextprotocol.io/examples) 這個列表中

可以看到一些已經支援 MCP 協議的工具列表，以及可以提供什麼功能
像是

- PostgreSQL - Read-only database access with schema inspection capabilities
- GitHub - Repository management, file operations, and GitHub API integration
- Slack - Channel management and messaging capabilities

很多，大家安裝前可以看一下列表

其他列表網站

[Portkey MCP Servers](https://portkey.ai/mcp-servers)
[Github: punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)

## 參考資料

- [Claude Model Context Protocol (MCP)官方文件](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
- [Google Maps API 文件](https://developers.google.com/maps/documentation)
- [Claude Desktop 下載頁面](https://www.anthropic.com/claude)
- [MCP Example Servers](https://modelcontextprotocol.io/examples)
