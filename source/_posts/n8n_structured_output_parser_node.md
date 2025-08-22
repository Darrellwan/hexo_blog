---
title: n8n Structured Output Parser 節點教學 - AI 輸出格式化
tags:
  - n8n
  - n8n節點介紹
  - AI
categories:
  - n8n
page_type: post
id: n8n_structured_output_parser_node
slug: n8n_structured_output_parser_node
description: AI 輸出格式總是亂七八糟？n8n Structured Output Parser 節點快速解決！節點教學包和實際操作流程介紹，未來輕鬆固定 AI 輸出的格式
bgImage: bg-n8n-output_parser.jpg
preload:
  - bg-n8n-output_parser.jpg
date: 2025-08-22 22:05:50
---

{% darrellImageCover bg-n8n-output_parser bg-n8n-output_parser.jpg max-800 %}

## 前言

用 n8n 串接 AI 模型時，最難的地方就是控制輸出的格式。
以往我們都會靠 prompt 加上：
`請幫我輸出以下的 json 格式`

可是往往會拿到下面這種惱人的格式
```
\```
{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com"
}
\```
```

{% darrellImage800 n8n-ai_agnet_use_code_handle_output n8n-ai_agnet_use_code_handle_output.png max-400 %}

然後後面就要加上一個 `code` 節點
請 ChatGPT 來幫忙產生一段程式碼把這些字串改為 JSON 格式
其實在 n8n 中早就有一個節點可以簡簡單單解決這件事情
那就是本篇文章的主角 **Structured Output Parser** !

## 如何新增 Structured Output Parser 節點

如果你單獨新增一個 Structured Output parser 節點
你會發現無法直接連到現有的 AI Agent 節點中

{% darrellImage800 n8n-structured_output_parser-can_not_link n8n-structured_output_parser-can_not_link.png max-800 %}

其實他的啟用方式比較特別，要先在 AI 節點中找到一個選項：

{% darrellImage800 n8n-ai_require_specific_output_format n8n-ai_require_specific_output_format.png max-800 %}

勾選後，就可以在 AI 節點中新增 Structured Output parser 節點

{% darrellImage800 n8n-structured_output_parser-link_to_ai n8n-structured_output_parser-link_to_ai.png max-800 %}

這樣就算是成功的新增節點了

## 設定教學

### 基礎設定

節點的設定非常簡單
**只需要貼上你預期的輸出格式即可**

{% darrellImage800 n8n-structured_output-setting n8n-structured_output-setting.png max-800 %}

### 進階設定 : Auto-Fix Format

Auto-Fix Format 會在第一次 Parse 失敗時，
調用 AI 模型來幫忙修正

例如你預期的格式是
```
{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com"
}
```

但 AI 給的格式是
```
{
  "name": {"first_name": "John", "last_name": "Doe"},
  "age": 30,
  "email": "john.doe@example.com"
}
```

由於 key 不同，第一次的 parse 便會失敗
這時他會把 AI 給的格式丟給 AI 模型來修正

{% darrellImage800 n8n-structured_output-auto_fix_format n8n-structured_output-auto_fix_format.png max-800 %}

## 實戰使用過程

假設我們今天要在 n8n 做一個 **新聞摘要** 的 workflow

我們會先在 ChatGPT 請他幫我們產生一個 prompt

### 1. 產生 prompt

{% darrellImage800 n8n-chatgpt_generate_prompt n8n-chatgpt_generate_prompt.png max-800 %} 

```
你是一個摘要助手：
我會提供一篇或多篇文章給你，
請你為每篇文章做出**快速摘要**，並以 JSON Array 格式回傳。

輸出格式範例：
[
  {
    "title": "文章標題",
    "summary": "這篇文章的重點摘要"
  }
]

規則：
- 不要額外輸出文字，僅回傳 JSON 陣列
- 每篇文章一個物件
- `title` 使用文章的標題或可辨識名稱（如果有）
- `summary` 使用簡短句子或條列重點
```

### 2. 加入 AI Agent 節點

{% darrellImage800 n8n-ai_agnet_node_with_prompt n8n-ai_agnet_node_with_prompt.png max-800 %}

新增 n8n AI Agent 節點，並且放入前面產生的 prompt

### 3. 新增 Structured Output Parser 節點

AI Agent 節點想把選項 **Require Specific Output Format** 打勾

新增 Structured Output Parser 節點，並連線到 AI Agent 節點

{% darrellImage800 n8n-structured_output_parser-link_to_ai_agent n8n-structured_output_parser-link_to_ai_agent.png max-800 %}

### 4. 加上指定的 output Format

再來就可以把原本在 ChatGPT 產生的 prompt 中
那段預期輸出的格式複製到 Structured Output Parser 節點來設定

{% darrellImage800 n8n-structured_output_parser-add_output_format n8n-structured_output_parser-add_output_format.png max-800 %}

### 5. 測試

簡單的加上節點和預期輸出後，基本上就設定完成了
現在可以來執行看看 workflow 並檢查是否會真的幫我們處理 output Format

執行的時候如果像截圖這樣，看到節點有亮綠色，代表 output parser 節點有正常運作

{% darrellImage800 n8n-structured_output_parser-test_execution n8n-structured_output_parser-test_execution.png max-800 %}

最後我們來檢查一下 workflow 執行的 JSON

{% darrellImage800 n8n-structured_output_parser-output_json_check n8n-structured_output_parser-output_json_check.png max-400 %}

能看到 `output` 裡面是一個 JSON Array，包含了一個 json object `title` 和 `summary`
後續就能直接把這些資料欄位做使用，像是整理在 google sheet 裡面：

{% darrellImage800 n8n-structured_output_parser-use_output_parser n8n-structured_output_parser-use_output_parser.png max-800 %}

## 結語

Structured Output Parser 節點在跟 n8n 的 AI 節點搭配非常方便簡單
真是一個我好想早一點學會的節點！

另外這節點還有進階的 `auto-fix` 可以使用
如果未來遇到 AI 輸出格式較為複雜，或是可能會有兩三種格式的時候
就可以請 AI 來幫忙修正自己的 output，當中也會有一些 prompt 可以另外調整

等未來遇到相關的問題和經驗時，會再來補充

對於這節點有任何問題，歡迎下方留言或是從社群媒體找到我