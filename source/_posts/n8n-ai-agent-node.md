---
title: n8n AI Agent 教學 - 用「管家」概念打造 LINE 智能助理
tags:
  - n8n
  - n8n教學
  - n8n節點介紹
  - AI Agent
categories:
  - n8n
page_type: post
id: n8n-ai-agent-node
description: n8n AI Agent 完整教學！用「管家」比喻秒懂核心概念，5 分鐘快速上手。實戰打造 LINE 智能助理（查天氣、查行事曆）。含價格比較、參數設定、Multi-Agent 進階應用。
bgImage: ai-agent-node-bg.jpg
date: 2026-01-17 22:00:00
modified: 2026-01-24 12:00:00
---

{% darrellImageCover ai-agent-node-bg.jpg ai-agent-node-bg.jpg max-800 %}

{% quickNav %}
[
  {"text": "前置準備", "anchor": "prerequisites", "desc": "n8n 部署 + API Key"},
  {"text": "5 分鐘上手", "anchor": "quick-start", "desc": "建立第一個 Agent"},
  {"text": "LINE 智能助理", "anchor": "line-assistant", "desc": "查天氣、查行程"},
  {"text": "進階設定", "anchor": "advanced", "desc": "參數、Structured Output"},
  {"text": "錯誤處理", "anchor": "error-handling", "desc": "Fallback、Retry、Error Workflow"},
  {"text": "Human-in-the-loop", "anchor": "human-in-the-loop", "desc": "人工審核、Send and Wait"}
]
{% endquickNav %}

---

你有沒有這種經驗？

早上出門前想知道要不要帶傘，打開 ChatGPT 問天氣。
下午要開會，又開 ChatGPT 問今天有什麼行程。
這些事情 ChatGPT 都做得到，但問題是**你每天都要自己去問**。

**n8n AI Agent 不一樣。**

你只要設定一次，它每天會自動：
1. 查你的行事曆
2. 查明天的天氣
3. 在前一晚把整理好的資訊推送給你

不用你開口，時間到了就做好。

---

<h2 id="concept">用「管家」秒懂 AI Agent</h2>

把 AI Agent 想成你的「私人管家」：

{% dataTable style="minimal" %}
[
  {"概念": "AI Agent", "比喻": "管家", "說明": "協調一切，自己決定怎麼做"},
  {"概念": "Chat Model", "比喻": "管家的腦袋", "說明": "聰明的管家 vs 普通的管家"},
  {"概念": "Memory", "比喻": "管家的記憶", "說明": "記得你之前說過什麼"},
  {"概念": "Tools", "比喻": "服務人員", "說明": "廚師、司機、園丁，各司其職"}
]
{% enddataTable %}

### 管家需要什麼才能工作？

繼續用管家的比喻來看 AI Agent 的組成：

- **Chat Model（必要）**：管家的腦袋。用 OpenAI、Anthropic 或 Gemini 都可以。
- **Memory（選填）**：管家的記憶。讓他記得你之前說過什麼。
- **Tools（建議至少 1 個）**：管家能用的服務。例如天氣查詢、行事曆、資料庫。

沒有 Tools 的話，管家只會聊天，不會幫你做事。

---

<h2 id="prerequisites">前置準備</h2>

開始之前，你需要準備兩件事：**一個能用的 n8n** 和 **OpenAI API Key**。

### n8n 是什麼？

簡單說，n8n 是一個視覺化的自動化工具，讓你用「拖拉節點」的方式建立工作流程，不需要寫程式。

### 部署方式怎麼選？

{% dataTable style="minimal" %}
[
  {"方式": "n8n Cloud", "難度": "⭐", "費用": "€24/月起", "適合": "不想碰技術的人"},
  {"方式": "Zeabur", "難度": "⭐⭐", "費用": "約 NT$150/月", "適合": "想省錢又不想裝 Docker"},
  {"方式": "Docker Self-hosted", "難度": "⭐⭐⭐", "費用": "伺服器費用", "適合": "有技術背景、想完全掌控"}
]
{% enddataTable %}

新手建議先用 **n8n Cloud** 免費試用 14 天，或用 **Zeabur** 一鍵部署。

{% articleCard
  url="/n8n-deployment/"
  title="n8n 安裝部署教學 - 官方Cloud、Zeabur、本機部署該怎麼選?"
  previewText="三種部署方式完整比較，手把手帶你安裝"
  thumbnail="https://www.darrelltw.com/n8n-deployment/blog-n8n-deployment-bg.jpg"
%}

{% callout tip %}
OpenAI API Key 的申請方式會在下一節「5 分鐘快速上手」的 Step 1 詳細說明，這邊先確保 n8n 可以用就好。
{% endcallout %}

---

<h2 id="quick-start">5 分鐘快速上手</h2>

其實設定蠻簡單的，跟著做就行。

### Step 1：申請 OpenAI API Key

AI Agent 的「腦袋」需要 AI 模型，這邊用 OpenAI 當範例。

1. 到 [platform.openai.com](https://platform.openai.com/) 註冊帳號
2. 點選左側選單的 **API Keys** → **Create new secret key**

{% darrellImage800Alt "OpenAI Platform 首頁" ai-agent-openai-platform.png max-800 %}

{% darrellImage800Alt "OpenAI 建立 API Key 的頁面" ai-agent-openai-create-key.png max-800 %}

{% callout warning %}
API Key 建立後只會顯示一次！請馬上複製貼到安全的地方（例如密碼管理器）。如果忘記了，只能刪掉重新建立。
{% endcallout %}

3. 到 **Settings → Billing** 加入付款方式，儲值至少 $5 美金

{% darrellImage800Alt "OpenAI Billing 設定頁面" ai-agent-openai-billing.png max-800 %}

實測一般用量一個月大概 $3-10 美金，蠻便宜的。

### Step 2：建立工作流

開啟 n8n，建立新的工作流。
加入 **Chat Trigger** 節點。

{% callout info %}
Chat Trigger 是什麼？它是 n8n 內建的聊天測試介面觸發器。加入後，你可以直接在 n8n 畫面右上角按「Chat」按鈕跟 Agent 對話，方便開發時測試。正式上線時會換成 {% term def="一種讓外部服務主動通知你的機制，當事件發生時自動呼叫指定網址" %}Webhook{% endterm %} 節點接收外部訊息（例如 LINE）。
{% endcallout %}

{% darrellImage800Alt "n8n 空白畫布加入 Chat Trigger 節點" ai-agent-step1-chat-trigger.png max-800 %}

### Step 3：加入 AI Agent + 設定 Chat Model

從節點選單搜尋「AI Agent」，把它連接到 Chat Trigger。

{% darrellImage800Alt "AI Agent 節點連接到 Chat Trigger" ai-agent-step2-connect.png max-800 %}

接著設定 Chat Model：

1. 點擊 AI Agent 節點下方的 **Chat Model** 區塊
2. 選擇 **OpenAI Chat Model**
3. 建立 Credential：點擊 **Create New Credential** → 貼上剛才的 API Key

{% darrellImage800Alt "n8n 設定 OpenAI Credential" ai-agent-openai-credential.png max-800 %}

4. Model 選擇 **GPT-5 mini**（成本最低，回應速度快）

{% darrellImage800Alt "選擇 Chat Model 設定畫面" ai-agent-step3-chat-model.png max-800 %}

### Step 4：測試對話

點擊右上角的「Chat」按鈕，開始對話測試。

{% darrellImage800Alt "n8n 內建聊天測試介面" ai-agent-step4-test-chat.png max-800 %}

這樣就完成了！Agent 現在可以聊天，但還沒有工具可以用。

接下來加入 Tools 讓它能真的幫你做事。

---

<h2 id="pricing">價格怎麼選？</h2>

蠻多人問這個的，所以整理一下。

使用 AI Agent 的成本分兩塊：**n8n 平台** + **AI 模型 API**

### n8n 平台費用

{% dataTable style="minimal" %}
[
  {"方案": "Self-hosted", "月費": "免費", "執行次數": "無限", "說明": "需自行架設伺服器"},
  {"方案": "Zeabur", "月費": "約 NT$150", "執行次數": "無限", "說明": "一鍵部署"},
  {"方案": "Cloud Starter", "月費": "€24（約 NT$840）", "執行次數": "2,500 次/月", "說明": "官方託管"}
]
{% enddataTable %}

詳細比較請參考：[n8n 安裝部署教學](/n8n-deployment/)，這篇有詳細的平台比較和安裝教學。

### AI 模型費用（另計）

{% dataTable style="minimal" %}
[
  {"模型": "GPT-5 mini", "輸入": "$0.25/1M {% term def="AI 計費單位，大約 1 個中文字 = 2-3 tokens，1000 tokens 約等於 750 個英文單字" %}tokens{% endterm %}", "輸出": "$2/1M tokens", "月成本估算": "約 $3-10"},
  {"模型": "GPT-5.2", "輸入": "$1.75/1M tokens", "輸出": "$14/1M tokens", "月成本估算": "約 $15-50"},
  {"模型": "Claude Sonnet 4.5", "輸入": "$3/1M tokens", "輸出": "$15/1M tokens", "月成本估算": "約 $10-30"}
]
{% enddataTable %}

### 新手建議

- **最省錢**：Zeabur + GPT-5 mini，月成本約 NT$250-500
- **最穩定**：Cloud Starter + GPT-5 mini，月成本約 NT$1,000-1,200

---

<h2 id="line-assistant">實戰：LINE 智能小助理</h2>

接下來做個實際的案例。

這個案例會展示 AI Agent 最厲害的地方：**自己判斷該用哪個工具**。

### 完成後的效果

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

想跟著做出這個 LINE 智能助理？完整的 7 步驟教學（含 Webhook 設定、Memory、Tool 串接、LINE 回覆）請看這篇：

{% articleCard
  url="/n8n-ai-agent-line-bot/"
  title="n8n AI Agent + LINE Bot 完整實作教學"
  previewText="7 步驟打造 LINE 智能助理：Webhook、Memory、天氣查詢、行事曆串接"
  thumbnail="https://www.darrelltw.com/n8n-ai-agent-node/ai-agent-node-bg.jpg"
%}

### Tool 描述怎麼寫？

這個蠻重要的。

Tool 描述是讓 Agent 知道「什麼時候該用這個工具」的關鍵。
寫不清楚的話，Agent 就會亂用或不用。

**天氣查詢 Tool：**
```
查詢指定城市的天氣預報。
輸入：城市名稱（如：台北、東京）
輸出：溫度、天氣狀況、穿著建議
```

**行事曆 Tool：**
```
查詢使用者的 Google Calendar 行程。
輸入：日期（如：明天、下週一）
輸出：當天所有會議的時間和標題
```

描述寫清楚，Agent 就能自己判斷該用哪個。

---

## 常見問題

{% faq %}
[
  {
    "question": "不會寫程式能用嗎？",
    "answer": "可以。n8n 是視覺化介面，用拖拉的方式建立工作流，不需要寫程式碼。"
  },
  {
    "question": "OpenAI API 要付費嗎？",
    "answer": "要，但很便宜。儲值 $5 美金大概可以用 1-2 個月（一般聊天用量）。GPT-5 mini 的費用是輸入 $0.25/百萬 tokens、輸出 $2/百萬 tokens，一次對話大概花不到 $0.01。"
  },
  {
    "question": "Self-hosted 和 Cloud 差在哪？",
    "answer": "Cloud 是官方託管，不用管伺服器但有執行次數限制（€24/月 2,500 次）。Self-hosted 免費無限次，但要自己架設和維護伺服器。新手建議先用 Cloud 免費試用 14 天，或用 Zeabur 一鍵部署（約 NT$150/月、無執行次數限制）。"
  },
  {
    "question": "Agent 不調用工具，直接亂回答？",
    "answer": "通常是 Tool 描述太模糊。<br><br>錯誤範例：<code>處理資料</code><br>正確範例：<code>根據訂單編號查詢出貨狀態，輸入格式 ORD-XXXXX，回傳物流狀態和預計到貨日</code>"
  },
  {
    "question": "對話記憶不見了？",
    "answer": "最常見原因是 {% term def="對話識別碼，用來區分不同使用者的對話，保持記憶連貫性" %}Session Key{% endterm %} 不一致。確保每次對話用相同的 sessionId（例如 LINE 的 userId）。"
  }
]
{% endfaq %}

---

以上是入門內容。

如果你的 Agent 已經能正常運作，想要調校效果或加入更複雜的架構，請繼續往下閱讀。

---

<h2 id="advanced">進階：參數設定</h2>

設定好 Agent 後，你可能會想：「怎麼讓它回答更準確？」「怎麼讓它更快？」

這時候就要調整參數了。其實大部分情況用預設值就夠了，但如果想微調可以看看下面這些。

### 核心參數

{% dataTable style="minimal" %}
[
  {"參數": "System Message", "說明": "Agent 的行為準則", "建議值": "依需求自訂"},
  {"參數": "Max Iterations", "說明": "最大重試次數", "建議值": "10（可降到 5 加速）"},
  {"參數": "Return Intermediate Steps", "說明": "輸出推理過程", "建議值": "除錯時開啟"}
]
{% enddataTable %}

### System Message 範例

```
你是一個友善的 LINE 智能助理。

規則：
1. 用繁體中文回覆
2. 回覆簡潔，不超過 100 字
3. 不確定使用者的意思時，先確認再回答
4. 查詢天氣時，加上穿著建議
```

### Structured Output（結構化輸出）

如果你的 Agent 需要輸出固定格式的 JSON 給後續節點處理，可以開啟 AI Agent 節點裡的 **Require Specific Output Format** 選項。

搭配 **{% term def="讓 AI 依照固定格式（如 JSON）回傳結果的功能" %}Structured Output{% endterm %} Parser** 子節點，你可以定義 JSON Schema，強制 Agent 回傳符合格式的資料。輸出不符格式時，節點會自動重試，不會直接觸發工作流錯誤。

適合的場景：
- Agent 回傳結果要送進資料庫
- 後續節點需要解析特定欄位（如 `category`、`priority`）
- 多語系系統需要固定的回應結構

---

<h2 id="error-handling">進階：錯誤處理</h2>

Agent 在測試時沒問題，上線後可能遇到 API timeout、模型 rate limit 或回應格式錯誤。
做好錯誤處理可以避免工作流「默默壞掉」沒人發現。

### Error Workflow（錯誤通知工作流）

n8n 可以設定獨立的 Error Workflow，當主工作流出錯時自動觸發通知。

設定方式：**Settings** → **Error Workflow** → 選擇通知用的工作流

這個錯誤工作流可以串接 Slack、Email 或 LINE 通知，讓你第一時間知道 Agent 出狀況。

### 節點層級的錯誤設定

每個節點的 **Settings** 分頁都有三個實用選項：

{% dataTable style="minimal" %}
[
  {"設定": "Continue on Error", "效果": "出錯時繼續執行後續節點", "適用": "非關鍵步驟，壞了不影響主流程"},
  {"設定": "Retry on Error", "效果": "自動重試（可設次數和間隔）", "適用": "API timeout、rate limit 等暫時性錯誤"},
  {"設定": "Error Output", "效果": "錯誤時走另一條路徑", "適用": "需要針對錯誤做不同處理"}
]
{% enddataTable %}

### Fallback Model（備用模型）

AI Agent 節點內建 fallback 機制。在 Chat Model 設定裡，你可以指定備用模型。
當主模型（例如 GPT-5）掛掉或超過 {% term def="API 服務限制單位時間內的請求次數，防止濫用和過載" %}rate limit{% endterm %} 時，自動切換到備用模型（例如 GPT-5 mini）繼續運作。

### Retry 策略建議

實務上建議用指數退避（Exponential Backoff）策略：

- 第一次重試等 1 秒
- 第二次等 2 秒
- 第三次等 4 秒

只重試「暫時性錯誤」（timeout、rate limit、503），不重試「永久性錯誤」（401 認證失敗、400 格式錯誤）。

---

## 進階：Multi-Agent 協作

一個 Agent 不夠用怎麼辦？

例如你的客服系統需要處理三種問題：訂單查詢、技術支援、一般諮詢。
每種問題需要不同的知識庫和處理邏輯。

這時候可以用多個 Agent 分工合作。

### 實作方式：Execute Workflow

在 n8n 裡，Multi-Agent 的實作核心是 **{% term def="n8n 節點，用於從主工作流呼叫其他獨立的子工作流" %}Execute Workflow{% endterm %}** 節點。

每個子 Agent 是一個獨立的工作流，主 Agent 透過 Execute Workflow 節點呼叫它們。這樣做的好處是每個 Agent 可以獨立開發、測試、維護。

### 三種模式

{% dataTable style="minimal" %}
[
  {"模式": "Sequential（串行）", "說明": "依序執行，前一個的輸出是後一個的輸入", "適用": "資料驗證 → 分析 → 報告產生"},
  {"模式": "Parallel（平行）", "說明": "同時執行多個 Agent，各自處理不同面向", "適用": "同時分析情緒 + 提取實體 + 分類意圖"},
  {"模式": "Hierarchical（階層式）", "說明": "門衛 Agent 判斷意圖後分派給專責 Agent", "適用": "客服分流、複雜任務拆解"}
]
{% enddataTable %}

### 實際案例：客服系統（Hierarchical 模式）

```
主 Agent（判斷問題類型）
  ├── 訂單查詢 Agent → 查詢資料庫
  ├── 技術支援 Agent → 查詢知識庫
  └── 一般諮詢 Agent → 直接回覆
```

主 Agent 的 System Message 負責判斷使用者意圖，再透過 Execute Workflow 把請求丟給對應的子工作流處理。每個子工作流有自己的 AI Agent、專屬的 Tools 和 System Message。

{% callout tip %}
n8n 官方有提供 Multi-Agent 範例模板，可以直接匯入修改。在 n8n 模板庫搜尋「multi-agent」就能找到。
{% endcallout %}

---

<h2 id="human-in-the-loop">進階：Human-in-the-loop</h2>

不是所有事情都能讓 AI 自己決定。

有些場景需要人工介入：金額超過門檻的操作、AI 信心度低的回覆、敏感內容的審核。
n8n 支援「Send and Wait」模式，讓工作流暫停等待人類確認後再繼續。

### 怎麼用？

n8n 有 10+ 個節點支援 Send and Wait 操作，包含：

- **Slack**：傳送審核訊息，等待人員按按鈕確認
- **Email**：寄出審核信，收到回覆後繼續流程
- **LINE**：推送確認訊息給主管

工作流會暫停在該節點，直到收到人類的回應才往下走。

### 適用場景

- 客服升級：AI 無法處理時，轉交真人客服
- 內容審核：AI 產生的回覆，經人工確認後才送出
- 訂單確認：金額超過一定門檻，需要主管核准
- 資料修改：涉及刪除或修改重要資料前，先確認

---

## 進階：MCP 整合

如果你有用 Claude Desktop 或 Cursor，可能會想：「能不能讓這些工具也用 n8n 的 Tool？」

可以。用 MCP（Model Context Protocol）就行。

這是 Anthropic 發布的開放協議，讓不同 AI 工具共用同一套 Tools。

### n8n 的 MCP 節點

{% dataTable style="minimal" %}
[
  {"節點": "MCP Server Trigger", "用途": "讓外部 AI 呼叫 n8n 工作流"},
  {"節點": "MCP Client Tool", "用途": "讓 n8n Agent 使用外部 MCP 工具"}
]
{% enddataTable %}

---

## 踩雷紀錄

這些是我自己測試時遇到的問題，整理給大家參考。

{% dataTable style="minimal" %}
[
  {"問題": "對話記憶消失", "原因": "Session Key 每次都不同", "解法": "用固定的 userId"},
  {"問題": "Agent 不用工具", "原因": "Tool 描述太模糊", "解法": "寫清楚輸入格式和用途"},
  {"問題": "回應很慢", "原因": "Tools 太多或模型太慢", "解法": "減少 Tools、換快的模型"},
  {"問題": "Token 超過限制", "原因": "對話歷史太長", "解法": "Memory 設定 Context Window 為 5-10 條"}
]
{% enddataTable %}

---

## 進階常見問題

{% faq %}
[
  {
    "question": "Token 超過限制怎麼辦？",
    "answer": "1. Memory 設定 {% term def="AI 模型能同時處理的文字量上限，超過會遺忘較早的內容" %}Context Window{% endterm %} 為 5-10 條<br>2. 精簡 Tool 描述<br>3. 換用支援更大 context 的模型"
  },
  {
    "question": "Queue Mode 下 Memory 不 work？",
    "answer": "Queue Mode 需要改用 Redis 或 Postgres Memory。Simple Memory 只存在單一 worker 的記憶體中。"
  },
  {
    "question": "怎麼讓 Agent 回覆更快？",
    "answer": "1. 減少 Tools 數量<br>2. 換更快的模型（如 Groq）<br>3. Max Iterations 從 10 降到 5<br>4. 開啟 {% term def="串流輸出，AI 邊生成邊回傳結果，不用等全部完成" %}Streaming{% endterm %}"
  }
]
{% endfaq %}

---

## 相關文章推薦

{% articleCard
  url="/n8n-deployment/"
  title="n8n 安裝部署教學 - 官方Cloud、Zeabur、本機部署該怎麼選?"
  previewText="n8n 部署教學：官方 Cloud、Zeabur、Docker 方案完整比較"
  thumbnail="https://www.darrelltw.com/n8n-deployment/blog-n8n-deployment-bg.jpg"
%}

{% articleCard
  url="/n8n-webhook/"
  title="n8n Webhook 節點完整教學"
  previewText="學會 Webhook 節點，接收 LINE 訊息觸發 AI Agent"
  thumbnail="https://www.darrelltw.com/n8n-webhook/blog-n8n-webhook-bg.jpg"
%}

{% articleCard
  url="/n8n-if-switch/"
  title="n8n If 和 Switch 節點教學"
  previewText="條件判斷節點，搭配 AI Agent 處理不同類型的請求"
  thumbnail="https://www.darrelltw.com/n8n-if-switch/n8n-If_Switch_bg.jpg"
%}

---

## 總結

AI Agent 適合需要「自動判斷 + 執行多個步驟」的場景。

我自己測試下來，最常用的組合是 LINE Bot + AI Agent + 天氣/行事曆 Tool。
設定完之後，就不用每次都手動查天氣或看行程了。

**缺點要先講清楚：**

1. **成本比純規則判斷高** - 每次對話都要呼叫 AI API，一個月下來大概 $10-30 美金
2. **回應速度較慢** - Agent 需要思考該用哪個 Tool，大概 2-5 秒才會回覆
3. **偶爾會誤判** - Tool 描述寫不清楚的話，Agent 可能用錯工具或不用工具

如果你的場景是固定流程（例如：收到關鍵字 A 就回覆 B），用 Switch 節點會更快更便宜。

但如果你想讓 LINE Bot 能「理解」使用者在問什麼，AI Agent 還是目前最好的選擇。

有問題歡迎在下方留言！
