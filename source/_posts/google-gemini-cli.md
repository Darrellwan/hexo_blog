---
title: Google 發布 Gemini CLI Tool 免費額度超級夠用 和 Claude Code 的比較
tags:
  - Gemini
categories:
  - AI
page_type: post
id: google-gemini-cli
description: Google 推出免費 Gemini CLI 命令行工具。安裝教學，並與 Claude Code 做同樣 prompt 比較
bgImage: blog-gemini-cli-bg.jpg
preload:
  - blog-gemini-cli-bg.jpg
date: 2025-06-26 00:40:04
---

{% darrellImageCover blog-gemini-cli-bg blog-gemini-cli-bg.jpg %}

Google 推出 Gemini CLI 工具
看來 Claude Code 終於遇到競爭對手

## 安裝

[Github 官方文件](https://github.com/google-gemini/gemini-cli)

```
npx https://github.com/google-gemini/gemini-cli

# 或是

npm install -g @google/gemini-cli
```

到 Google AI Studio 申請 API Key

{% darrellImage800 gemini-generate_api_key gemini-generate_api_key.png max-800 %}

之後在 Command Line 使用下面指令即可

```
export GEMINI_API_KEY="YOUR_API_KEY"
```

也可以在 Gemini CLI 中使用 Authenicate 來登入授權

```
/auth 
# 進入後選擇想要的流程即可
```

{% darrellImage800 gemini-generate_login_auth gemini-generate_login_auth.png max-800 %}


## Gemini Command

### auth

可以變更登入的方式，不一定要使用 API KEY，也可以直接用 Google 登入的模式

### about

顯示當前資訊

```
About Gemini CLI                                                                       │
│                                                                                        │
│ CLI Version                   0.1.1                                                    │
│ Git Commit                    852210e1 (local modifications)                           │
│ Model                         gemini-2.5-pro                                           │
│ Sandbox                       no sandbox                                               │
│ OS                            darwin        
```
 
### chat

管理對話聊天記錄

save + tag 可以把對話加上標籤

之後就可以用 

`/chat resume tag` 來回復對話

也能用 `/chat list` 來列出記憶的對話

{% darrellImage800 gemini_cli-chat gemini_cli-chat.png max-800 %}

### compress

壓縮目前對話紀錄，節省 input token 

```
✦ Chat history compressed from 2644 to 195 tokens.
```

範例中節省了超過 90% 的 input token

### doc 

會開啟 Google Gemini 的文件連結
```
https://goo.gle/gemini-cli-docs
```

### editor
調整 Editor 的設定

{% darrellImage800 gemini_cli-editor gemini_cli-editor.png max-800 %}

### help

列出 gemini-cli 的相關指令

### mcp 

可以定義 mcp 的工具來使用
mcp 都需要靠 setting.json 來設定

而該檔案有許多種層級
- 用戶設定 scope
`~/.config/gemini/settings.json`

- 專案設定 scope
`./project-name/.gemini/settings.json`

```json

// Line MCP Server範例
{
  "mcpServers": {
    "line-chatbot": {
      "command": "/opt/homebrew/bin/node",
      "args": [
        "/xxx/dist/index.js"
      ],
      "env": {
        "CHANNEL_ACCESS_TOKEN" : "xxx",
        "DESTINATION_USER_ID" : "line_uid"
      }
    }
  }
}
```

### mcp 測試

以下是使用 Line MCP Server 來示範

``` json
// prompt
line push_flex_message about how to use gemini cli     
```

{% darrellImage800 gemini_cli-mcp_line_sending gemini_cli-mcp_line_sending.png max-800 %}

正常觸發，且設計的 Line Flex 模板不算非常陽春

### quit

退出 Gemini CLI

### stats 

目前使用狀況

{% darrellImage800 gemini_cli-stat gemini_cli-stat.png max-800 %}

### theme 

變更色系風格

{% darrellImage800 gemini_cli-theme gemini_cli-theme.png max-800 %}

### tools

列出目前可用的工具

{% darrellImage800 gemini_cli-tools gemini_cli-tools.png max-800 %}

調用工具前一樣會詢問是否同意要使用該工具，例如使用 `WebFetch`

{% darrellImage800 gemini_cli-tools_web_fetch gemini_cli-tools_web_fetch.png max-800 %}

## 試用成果:天氣動畫成效

這是一般拿來測試 AI 模型的一個範例
請他繪製天氣模型
可以看到就算是 **Gemini-2.5-pro** 效果還是差強人意

{% darrellImage800 gemini_cli-weather_animation gemini_cli-weather_animation.png max-800 %}

這邊用 **Claude Code** 來對比一下效果，這種偏前端和美感的還是 Claude 比較擅長

{% darrellImage800 claude_code-weather_animation claude_code-weather_animation.png max-800 %}

## 使用額度

一分鐘內可以使用 **60 次** 模型
一整天內可以使用 **1000 次** 模型

這個價格可以說是超級佛心！
還是使用 `gemini-2.5-pro` 模型
真的不知道這種免費方案可以試用多久

{% darrellImage800 blog-gemini-cli-pricing blog-gemini-cli-pricing.jpg max-800 %}







