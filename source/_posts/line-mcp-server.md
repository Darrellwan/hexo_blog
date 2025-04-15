---
title: LINE MCP Server 測試心得 - 一個 prompt 就讓 Line 發訊息給你
date: 2025-04-14 20:30:00
tags:
  - LINE
  - MCP
  - Claude
page_type: post
description: 透過實作 LINE MCP Server，讓 Claude 等 AI 模型直接操作 LINE Messaging API 來發送訊息，並介紹幾個測試的場景
categories: 
  - AI
id: line-mcp-server
bgImage: line_mcp_server_bg.jpg
preload:
  - line_mcp_server_bg.jpg
---

{% darrellImageCover line_mcp_server_bg line_mcp_server_bg.jpg max-800 %}

## LINE MCP Server

Line 在最近突然發佈了官方支援的 MCP Server
[Github 連結](https://github.com/line/line-bot-mcp-server)

{% darrellImage line_mcp_server-github_introduce line_mcp_server-github_introduce.png max-800 %}

主要有三個 Tools:

### 1.push_text_message

Text Message 就是最基本的文字訊息

{% darrellImage line_mcp_server-text_message line_mcp_server-text_message.png max-400 %}


### 2.push_flex_message

Flex Message 則是比較複雜的訊息，可以包含文字、圖片、按鈕等元素

{% darrellImage line_mcp_server-flex_message line_mcp_server-flex_message.png max-400 %}


### 3.get_profile

get_profile 則是取得用戶的資料，包括用戶的姓名、頭像、狀態等

{% darrellImage line_mcp_server-get_profile line_mcp_server-get_profile.png max-400 %}

## 安裝

### Github Clone

安裝上按照文件非常簡單

```
git clone git@github.com/line/line-bot-mcp-server.git

cd line-bot-mcp-server && npm install && npm run build
```

### Claude Desktop 安裝

{% darrellImage line_mcp_server-install_in_claude_desktop line_mcp_server-install_in_claude_desktop.png max-800 %}

Cursor 安裝的方式也一樣喔

1. 把 Build 好的 /dist/index.js 貼上
2. 貼上 Line Message API 的 Channel Access Token
3. 貼上自己的 Line User ID

貼上後重新啟動 Claude Desktop 看到 Tools 有列出下列就算完成

{% darrellImage line_mcp_server-claude_desktop_show_tools line_mcp_server-claude_desktop_show_tools.png max-400 %}

### 要怎麼找到自己的 Line User ID?

如果要找自己的，那其實很簡單

到 Developer Console 

[developers.line.biz](https://developers.line.biz/)

點擊 Basic Settings 最下面就能找到！

{% darrellImage line_mcp_server-check_line_user_id_in_developer_console line_mcp_server-check_line_user_id_in_developer_console.png max-800 %}

## 簡易測試

安裝完成後，你就可以在 Claude Desktop 等 MCP Client 中
用 Prompt 來發送 Line 訊息給自己

舉例:

### 明日天氣預報 (Firecrawl MCP + Line MCP)

{% darrellImage line_mcp_server-demo_weather_prompt line_mcp_server-demo_weather_prompt.png max-800 %}

可以看到 Claude 先使用了 Firecrawl MCP 來取得天氣資料
並且參考了不只一個天氣的來源網站

最後彙整資料後，很聰明的把資料組成 Flex Message 的格式用 Line 來傳送
得到下圖精美的樣子

{% darrellImage line_mcp_server-demo_weather_result line_mcp_server-demo_weather_result.png max-800 %}


### GA4 資料分析

{% darrellImage line_mcp_server-demo_ga4_analyze_prompt line_mcp_server-demo_ga4_analyze_prompt.png max-800 %}

這個 GA4 的 MCP 是我個人建立的，會用來分析我個人網站的 GA4 數據
搭配 Line 的話也是我只需要在 Claude 發送一行指令

就可以在 Line 上看到我近期的 GA4 數據分析
**注意: GA4 等相關數據如果是公司企業用，不適合直接用 Claude ChatGPT 等等來分析，會有資料上傳到模型的問題**
建議相關分析需求使用 Local 端運算模型才合適

{% darrellImage line_mcp_server-demo_ga4_analyze_result line_mcp_server-demo_ga4_analyze_result.png max-800 %}

## Line MCP Server 的限制

### 只能傳送訊息給特定使用者

目前無法動態或大量的傳送訊息給多個使用者
所以不太適合行銷的場景

例如當使用者加入購物車後，一天之內沒有結帳
就傳送的回購 Line 訊息

目前無法用 Line MCP 來做到

適合的場景還是比較像**個人使用**
取代以前 Line Notify 的功能

將 AI 模型搜集的資料和分析結果等傳送到 Line 給使用者
但必須要注意，**Line Message API 是有費用的，免費的額度是 200次/月**

用 Line MCP 後消耗的速度會變快
變且無法透過 Line MCP 本身來查詢剩餘 Quota



