---
title: n8n AI Agent + LINE Bot 完整實作教學 - 7 步驟打造智能助理
tags:
  - n8n
  - n8n教學
  - AI Agent
  - LINE Bot
categories:
  - n8n
page_type: post
id: n8n-ai-agent-line-bot
description: 用 n8n AI Agent 打造 LINE 智能助理的完整教學。7 步驟從 Webhook 設定到天氣查詢、行事曆串接，讓你的 LINE Bot 能自動判斷問題並回覆。
bgImage: blog-n8n-ai-agent-node-bg.jpg
date: 2026-01-24 12:00:00
modified: 2026-01-24 12:00:00
---

{% darrellImageCover blog-n8n-ai-agent-line-bot-bg blog-n8n-ai-agent-node-bg.jpg max-800 %}

**預計閱讀時間：** 10-15 分鐘

**你將學到：**
- 用 Webhook 接收 LINE 訊息
- 設定 AI Agent 讓 LINE Bot 能「理解」語意
- 加入天氣查詢和行事曆 Tool
- 讓 Agent 自動判斷該用哪個工具回覆

{% quickNav %}
[
  {"text": "前置條件", "anchor": "prerequisites", "desc": "需要準備什麼"},
  {"text": "完成效果", "anchor": "demo", "desc": "成品展示"},
  {"text": "Step 1-2", "anchor": "step-1", "desc": "Webhook + Agent"},
  {"text": "Step 3-5", "anchor": "step-3", "desc": "Memory + Tools"},
  {"text": "Step 6-7", "anchor": "step-6", "desc": "LINE 回覆 + 測試"}
]
{% endquickNav %}

---

<h2 id="prerequisites">前置條件</h2>

開始之前，請確認你已經準備好：

1. **一個能用的 n8n**（Cloud 或 Self-hosted 都可以）
2. **OpenAI API Key**（用來驅動 AI Agent 的腦袋）
3. **LINE Messaging API Channel**（用來收發 LINE 訊息）

如果還沒準備好，可以參考這兩篇：

{% articleCard
  url="/n8n-ai-agent-node/"
  title="n8n AI Agent 教學 - 用「管家」概念秒懂 AI Agent"
  previewText="AI Agent 核心概念、5 分鐘快速上手、價格比較"
  thumbnail="https://www.darrelltw.com/n8n-ai-agent-node/blog-n8n-ai-agent-node-bg.jpg"
%}

{% articleCard
  url="/n8n-line-message-api/"
  title="n8n LINE Message API 串接教學"
  previewText="從建立 Channel 到串接 Webhook 的完整教學"
  thumbnail="https://www.darrelltw.com/n8n-line-message-api/n8n-line-message-api-bg.jpg"
%}

---

<h2 id="demo">完成後的效果</h2>

這個案例會展示 AI Agent 最厲害的地方：**自己判斷該用哪個工具**。

{% dataTable style="minimal" %}
[
  {"你問": "明天台北天氣如何？", "Agent 判斷": "呼叫天氣 Tool", "回覆": "明天 18-24°C，多雲，建議帶薄外套"},
  {"你問": "我明天有什麼會議？", "Agent 判斷": "呼叫行事曆 Tool", "回覆": "10:00 週會、14:00 客戶提案"},
  {"你問": "你好", "Agent 判斷": "不需要 Tool", "回覆": "你好！有什麼我可以幫你的嗎？"}
]
{% enddataTable %}

### 架構

```
LINE Webhook
    ↓
AI Agent
  ├── Tool 1: 天氣查詢
  ├── Tool 2: 行事曆查詢
  └── 一般對話（不需工具）
    ↓
LINE Reply
```

{% darrellImage800Alt "LINE 智能助理完整工作流畫面" ai-agent-line-workflow.png max-800 %}

---

<h2 id="step-1">Step 1：建立 LINE Webhook 接收訊息</h2>

正式上線要用 **Webhook** 節點取代 Chat Trigger，這樣才能接收 LINE 傳來的訊息。

1. 在 n8n 新增 **Webhook** 節點，Method 選 **POST**
2. 複製 Webhook 的 **Production URL**

{% darrellImage800Alt "n8n Webhook 節點設定" ai-agent-line-step1-webhook.png max-800 %}

3. 到 [LINE Developers Console](https://developers.line.biz/) → 你的 Messaging API Channel
4. 在 **Webhook URL** 欄位貼上剛才複製的 URL → 點「Verify」確認連線成功

{% darrellImage800Alt "LINE Developers Console 貼上 Webhook URL" ai-agent-line-step1-line-webhook.png max-800 %}

{% callout tip %}
如果還沒建立 LINE Messaging API Channel，可以參考上方的「n8n LINE Message API 串接教學」。
{% endcallout %}

---

## Step 2：設定 AI Agent + Chat Model

1. 新增 **AI Agent** 節點，連接到 Webhook
2. 設定 Chat Model（選 OpenAI GPT-5 mini，成本最低）
3. 在 **System Message** 加入角色設定：

{% darrellImage800Alt "AI Agent 連接到 Webhook 節點" ai-agent-line-step2-agent.png max-800 %}

```
你是一個友善的 LINE 智能助理。

規則：
1. 用繁體中文回覆
2. 回覆簡潔，不超過 100 字
3. 不確定使用者的意思時，先確認再回答
4. 查詢天氣時，加上穿著建議
```

{% callout info %}
如果還沒設定 OpenAI Credential，請參考 [AI Agent 教學的「5 分鐘快速上手」](/n8n-ai-agent-node/#quick-start)，裡面有詳細的 API Key 申請和 Credential 建立步驟。
{% endcallout %}

---

<h2 id="step-3">Step 3：加入 Memory（對話記憶）</h2>

沒有 Memory 的話，Agent 每次對話都是全新的，不會記得你之前說過什麼。

1. 點擊 AI Agent 節點下方的 **Memory** 區塊
2. 選擇 **Window Buffer Memory**
3. **Session Key** 設定為 `{{ $json.body.events[0].source.userId }}`

{% darrellImage800Alt "設定 Memory 和 Session Key" ai-agent-line-step3-memory.png max-800 %}

{% callout info %}
Session Key 是什麼？簡單說，就是用來區分「誰的對話記憶」的識別碼。用 LINE 的 userId 當 Session Key，就能確保每個使用者的對話記憶各自獨立、不會混在一起。
{% endcallout %}

---

## Step 4：加入天氣查詢 Tool

這是 Agent 最有感的功能——讓它能幫你查天氣。

1. 點擊 AI Agent 節點下方的 **Tools** 區塊 → 選 **HTTP Request Tool**
2. 設定 API URL：`https://api.openweathermap.org/data/2.5/weather?q={city}&appid={YOUR_API_KEY}&units=metric&lang=zh_tw`
3. 到 [OpenWeatherMap](https://openweathermap.org/api) 註冊免費帳號，取得 API Key

{% darrellImage800Alt "加入 HTTP Request Tool 並設定天氣 API" ai-agent-line-step4-weather-tool.png max-800 %}

**Tool 描述（很重要！）**：
```
查詢指定城市的即時天氣資訊。
輸入：城市名稱（如：Taipei、Tokyo）
輸出：溫度、天氣狀況、濕度
使用時機：當使用者詢問天氣、氣溫、需不需要帶傘時使用
```

{% callout tip %}
Tool 描述寫得越清楚，Agent 越知道什麼時候該用這個工具。描述模糊的話，Agent 會亂用或乾脆不用。
{% endcallout %}

---

## Step 5：加入行事曆 Tool（選用）

如果想讓 Agent 也能查你的行程：

1. 在 Tools 區塊再加一個 → 選 **Google Calendar Tool**
2. 建立 Google OAuth Credential（需要 Google Cloud Console 設定 OAuth）
3. 授權存取你的行事曆

{% darrellImage800Alt "加入 Google Calendar Tool" ai-agent-line-step5-calendar-tool.png max-800 %}

**Tool 描述：**
```
查詢使用者的 Google Calendar 行程。
輸入：日期（如：today、tomorrow、2026-01-25）
輸出：當天所有會議的時間和標題
使用時機：當使用者詢問行程、會議、今天有什麼事時使用
```

---

<h2 id="step-6">Step 6：回覆 LINE 訊息</h2>

Agent 處理完之後，要把回覆送回 LINE。

1. 新增 **HTTP Request** 節點，連接到 AI Agent 的輸出
2. 設定如下：

- **Method**: POST
- **URL**: `https://api.line.me/v2/bot/message/reply`
- **Headers**: `Authorization: Bearer {YOUR_CHANNEL_ACCESS_TOKEN}`
- **Body (JSON)**:

```json
{
  "replyToken": "{{ $('Webhook').item.json.body.events[0].replyToken }}",
  "messages": [
    {
      "type": "text",
      "text": "{{ $json.output }}"
    }
  ]
}
```

{% darrellImage800Alt "HTTP Request 回覆 LINE 訊息的設定" ai-agent-line-step6-reply.png max-800 %}

{% callout info %}
`replyToken` 是 LINE 每次收到訊息時產生的一次性 token，用來回覆該則訊息。`$json.output` 是 AI Agent 產出的回覆文字。
{% endcallout %}

---

## Step 7：啟用工作流並測試

1. 點擊右上角的 **Activate** 開關，啟用工作流
2. 到 LINE 傳訊息測試：「台北今天天氣如何？」
3. Agent 應該會自動呼叫天氣 Tool 並回覆結果

{% darrellImage800Alt "啟用工作流並在 LINE 測試" ai-agent-line-step7-activate.png max-800 %}

### 沒有回應？檢查這些

- Webhook URL 是否正確貼到 LINE Console
- 工作流是否已啟用（右上角開關）
- OpenAI API Key 是否有效（餘額是否足夠）
- LINE Channel Access Token 是否正確

---

## Tool 描述怎麼寫？

這個蠻重要的。

Tool 描述是讓 Agent 知道「什麼時候該用這個工具」的關鍵。
寫不清楚的話，Agent 就會亂用或不用。

### 好的描述 vs 壞的描述

{% dataTable style="minimal" %}
[
  {"類型": "壞的描述", "範例": "處理天氣資料", "問題": "Agent 不知道什麼時候該用"},
  {"類型": "好的描述", "範例": "查詢指定城市的即時天氣。輸入：城市名稱。輸出：溫度、天氣狀況。使用時機：使用者問天氣時", "問題": "無"}
]
{% enddataTable %}

### 描述的三個重點

1. **輸入**：明確說明需要什麼參數
2. **輸出**：說明會回傳什麼資料
3. **使用時機**：告訴 Agent 在什麼情境下該用這個 Tool

描述寫清楚，Agent 就能自己判斷該用哪個。

---

## 常見問題

{% faq %}
[
  {
    "question": "可以用其他 AI 模型嗎？（Claude、Gemini）",
    "answer": "可以。n8n 支援多種 Chat Model，設定方式一樣，只是 Credential 不同。建議先用 GPT-5 mini 測試，確認流程正常後再換其他模型。"
  },
  {
    "question": "Agent 不調用工具，直接亂回答？",
    "answer": "通常是 Tool 描述太模糊。確保描述包含「輸入格式」「輸出內容」「使用時機」三個要素。"
  },
  {
    "question": "對話記憶不見了？",
    "answer": "最常見原因是 Session Key 不一致。確保用 <code>{{ $json.body.events[0].source.userId }}</code> 當 Session Key，這樣同一個 LINE 用戶的對話記憶才會連貫。"
  },
  {
    "question": "LINE 群組訊息也能用嗎？",
    "answer": "可以，但 Session Key 建議改用 <code>groupId + userId</code> 的組合，避免不同群組的對話記憶混在一起。"
  }
]
{% endfaq %}

---

## 相關文章推薦

{% articleCard
  url="/n8n-ai-agent-node/"
  title="n8n AI Agent 教學 - 用「管家」概念秒懂 AI Agent"
  previewText="AI Agent 核心概念、價格比較、Multi-Agent 進階用法"
  thumbnail="https://www.darrelltw.com/n8n-ai-agent-node/blog-n8n-ai-agent-node-bg.jpg"
%}

{% articleCard
  url="/n8n-line-message-api/"
  title="n8n LINE Message API 串接教學"
  previewText="從建立 Channel 到串接 Webhook 的完整教學"
  thumbnail="https://www.darrelltw.com/n8n-line-message-api/n8n-line-message-api-bg.jpg"
%}

{% articleCard
  url="/n8n-webhook/"
  title="n8n Webhook 節點完整教學"
  previewText="學會 Webhook 節點，接收外部訊息觸發工作流"
  thumbnail="https://www.darrelltw.com/n8n-webhook/blog-n8n-webhook-bg.jpg"
%}
