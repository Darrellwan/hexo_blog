# n8n AI Agent 研究筆記

> 研究日期：2026-01-05（更新：2026-01-17）| 節點類型：AI

---

## 一句話定位

AI Agent 是 n8n 的「智慧調度中心」，讓 LLM 自主決定使用哪些工具來完成複雜任務，不需要你一步步指定流程。

---

## 核心比喻：私人管家

| 概念 | 比喻 | 一句話 |
|------|------|--------|
| AI Agent | 管家 | 協調一切，決定怎麼做 |
| Chat Model | 管家的能力 | 聰明管家 vs 笨管家 |
| Memory | 管家的記憶 | 記得你喜歡什麼 |
| Tools | 服務人員 | 廚師、司機、園丁 |
| Tool 描述 | 職責說明 | 管家要知道誰負責什麼 |
| Session Key | 認得你是誰 | 換客人 = 新記憶 |

**延伸運用**：
- AI Agent = 資深管家：你說「安排明天的行程」，他自己決定要查日曆、訂餐廳、還是叫車
- LLM Chain = Siri：你要一個一個說「查日曆」「訂餐廳」「叫車」
- 沒有 Memory = 金魚管家，每次對話都忘記之前講過什麼
- Streaming = 管家邊做邊跟你說進度（體驗好）

---

## 可直接用於文章（複製貼上區）

### AI Agent vs Basic LLM Chain

{% dataTable %}
[
  {"特性": "決策能力", "AI Agent": "自主決定使用哪些工具", "Basic LLM Chain": "按預設順序執行"},
  {"特性": "工具調用", "AI Agent": "動態選擇 0-N 個", "Basic LLM Chain": "固定流程"},
  {"特性": "適用場景", "AI Agent": "複雜、多步驟任務", "Basic LLM Chain": "簡單、單一任務"}
]
{% enddataTable %}

### 核心參數速查表

{% dataTable %}
[
  {"參數": "Prompt", "說明": "輸入來源", "建議值": "Automatic 或 Define below"},
  {"參數": "Require Specific Output Format", "說明": "啟用 Output Parser", "建議值": "需要 JSON 時開啟"},
  {"參數": "System Message", "說明": "Agent 行為準則", "建議值": "依需求自訂"},
  {"參數": "Max Iterations", "說明": "最大重試次數", "建議值": "10（可降到 5 加速）"},
  {"參數": "Return Intermediate Steps", "說明": "輸出推理過程", "建議值": "除錯時開啟"},
  {"參數": "Enable Streaming", "說明": "即時串流（需 v1.106.3+）", "建議值": "開啟"}
]
{% enddataTable %}

### Chat Model 價格比較（2026 年 1 月）

{% dataTable %}
[
  {"模型": "GPT-5.2", "輸入價格": "$1.75/1M", "輸出價格": "$14/1M", "特色": "400K context、多模態、推理強"},
  {"模型": "GPT-5 mini", "輸入價格": "$0.25/1M", "輸出價格": "$2/1M", "特色": "性價比首選"},
  {"模型": "Claude Opus 4.5", "輸入價格": "$5/1M", "輸出價格": "$25/1M", "特色": "最強推理、長程編碼"},
  {"模型": "Claude Sonnet 4.5", "輸入價格": "$3/1M", "輸出價格": "$15/1M", "特色": "平衡性能與成本"},
  {"模型": "Gemini 3 Pro", "輸入價格": "$2/1M", "輸出價格": "$12/1M", "特色": "200K context"},
  {"模型": "Gemini 3 Flash", "輸入價格": "$0.50/1M", "輸出價格": "$3/1M", "特色": "快速便宜"},
  {"模型": "Groq Llama 4 Scout", "輸入價格": "$0.11/1M", "輸出價格": "$0.34/1M", "特色": "極速 460 T/s"},
  {"模型": "Ollama", "輸入價格": "免費", "輸出價格": "免費", "特色": "本地部署"}
]
{% enddataTable %}

### 常見問題 FAQ

{% faq %}
[
  {
    "category": "基礎概念",
    "question": "AI Agent 和 Basic LLM Chain 有什麼差別？",
    "answer": "AI Agent 可以<strong>自主決定使用哪些工具</strong>。<br><br>✅ <strong>AI Agent</strong>：動態選擇工具，適合複雜任務<br>✅ <strong>Basic LLM Chain</strong>：按順序執行，適合簡單任務"
  },
  {
    "category": "基礎概念",
    "question": "應該選擇哪個 Chat Model？",
    "answer": "入門首選 <strong>GPT-5 mini</strong>，月成本約 $3-10。<br><br>💰 預算敏感 → GPT-5 mini 或 Gemini 3 Flash<br>🧠 複雜推理 → GPT-5.2 或 Claude Opus 4.5<br>⚡ 極速回應 → Groq Llama 4<br>🔒 資料隱私 → Ollama"
  },
  {
    "category": "設定問題",
    "question": "Memory 對話紀錄不見了？",
    "answer": "最常見是 <strong>Session Key 不一致</strong>。<br><br>✅ 每次對話用相同 <code>sessionId</code><br>✅ 不要用 <code>{{ $now }}</code> 當 Key<br>✅ Queue Mode 需改用 Redis/Postgres"
  },
  {
    "category": "設定問題",
    "question": "Agent 不調用工具，直接亂回答？",
    "answer": "<strong>Tool 描述太模糊</strong>！<br><br>❌ <code>處理資料</code><br>✅ <code>根據訂單 ID 查詢狀態，格式 ORD-XXXXX</code>"
  },
  {
    "category": "效能優化",
    "question": "Token 超過限制？",
    "answer": "1️⃣ Memory Context Window 設 5-10 條<br>2️⃣ 精簡 Tool 描述<br>3️⃣ 換用 GPT-5.2（400K tokens）或 Gemini 3 Pro（200K tokens）"
  },
  {
    "category": "效能優化",
    "question": "回應很慢怎麼辦？",
    "answer": "✅ 開啟 Streaming<br>✅ 減少 Tools 數量<br>✅ 換用 Groq（極速）<br>✅ Max Iterations 從 10 降到 5"
  }
]
{% endfaq %}

### 架構圖（可直接用於文章）

```
AI Agent (Root Node)
├── 🤖 Chat Model (必須)
│   └── OpenAI / Anthropic / Gemini / Groq / Ollama
├── 🧠 Memory (選填)
│   └── Simple Memory / Redis / Postgres
├── 🔧 Tools (建議 1+)
│   ├── Calculator / Wikipedia / SerpApi
│   └── Workflow Tool / Code Tool / HTTP Request
└── 📋 Output Parser (選填)
    └── Structured / Auto-fixing / Item List
```

---

## 需要改寫的素材

### 案例靈感

1. **基礎對話 Agent** - [Build your first AI agent](https://n8n.io/workflows/6270-build-your-first-ai-agent/)
   - 重點：Chat Trigger + AI Agent + OpenAI + SerpApi
   - 可用於：入門教學的第一個案例

2. **Email 摘要 Agent** - [15 AI Agent Examples](https://blog.n8n.io/ai-agents-examples/)
   - 重點：Schedule + Gmail + OpenAI + Slack
   - 可用於：展示定時觸發 + AI 處理的組合

3. **SQL Agent** - 官方文檔
   - 重點：自然語言查資料庫
   - 可用於：進階案例，展示 Agent 的強大能力

4. **客服 Agent**（進階）
   - 重點：Email Trigger → AI Agent（含 Memory + Workflow Tool）→ Human Review → Send Reply
   - 可用於：深度案例，展示完整的生產環境應用

### 踩雷紀錄

| 問題 | 解法 | 來源 |
|------|------|------|
| Session Key 用 `{{ $now }}`，每次都是新對話 | 用固定的 userId 或 sessionId | 社群討論 |
| Tool 描述太模糊，Agent 不調用 | 描述要具體：輸入格式、輸出內容 | 官方文檔 |
| Streaming 沒效果 | 觸發節點和 Agent 節點都要開啟 | 官方文檔 |
| Queue Mode 下 Memory 不 work | 改用 Redis/Postgres Memory | 社群討論 |

### 競品比較

| 比較項目 | AI Agent | Basic LLM Chain | Information Extractor |
|---------|----------|-----------------|----------------------|
| 決策能力 | 自主決定 | 固定流程 | 固定流程 |
| 工具調用 | 動態 0-N 個 | 無 | 無 |
| 輸出格式 | 彈性 | 彈性 | 結構化 JSON |
| 適用場景 | 複雜任務 | 簡單問答 | 資料擷取 |

### 版本演進資訊

- **v1.82.0 之前**：6 種 Agent 類型
- **v1.82.0 之後**：統一為 **Tools Agent**（推薦）
- **v1.106.3+**：支援 Streaming

### $fromAI() 用法範例

```javascript
// 讓 Agent 自動填入工具參數
$fromAI("order_id", "訂單編號，格式如 ORD-12345")

// Webhook 傳入的 Session Key
{{ $json.body.userId }}

// Chat Trigger 的 Session Key
{{ $('Chat Trigger').item.json.sessionId }}
```

---

## Multi-Agent 協作（2026-01 補充）

### 什麼是 Multi-Agent？

Multi-Agent 系統由多個專門化的 AI Agent 組成，每個 Agent 負責特定領域（資料分析、內容生成、API 整合），而非單一通用 Agent 處理所有事務。

### n8n 中的實現方式

| 模式 | 說明 | 適用場景 |
|------|------|---------|
| **Routing（路由）** | 每條路徑呼叫獨立的子工作流，各有自己的 Agent 和 Tools | 任務類型明確可分類 |
| **Orchestrator（協調者）** | 主 Agent 透過 AI Agent Tool 節點呼叫其他 Agent | 需要動態決策的複雜任務 |
| **Hierarchical（階層式）** | 主協調 Agent + 專業子 Agent + 子工作流 | 企業級大型系統 |

### Multi-Agent vs 單一 Agent

{% dataTable %}
[
  {"特性": "任務分配", "單一 Agent": "所有任務由一個 Agent 處理", "Multi-Agent": "任務分配給專門 Agent"},
  {"特性": "模型選擇", "單一 Agent": "統一使用一個模型", "Multi-Agent": "簡單任務用小模型，複雜任務用大模型"},
  {"特性": "執行方式", "單一 Agent": "依序處理", "Multi-Agent": "可平行處理"},
  {"特性": "錯誤隔離", "單一 Agent": "錯誤影響整體", "Multi-Agent": "錯誤隔離在單一 Agent"},
  {"特性": "維護難度", "單一 Agent": "簡單", "Multi-Agent": "較複雜，需協調邏輯"}
]
{% enddataTable %}

### 實際案例

- **客服系統**：主 Agent 判斷問題類型 → 路由到「訂單查詢 Agent」或「技術支援 Agent」
- **內容生產**：研究 Agent → 撰寫 Agent → 編輯 Agent（流水線式）
- **資料分析**：同時呼叫多個資料來源 Agent，彙整結果

### 參考連結

- [Multi-agent system: Frameworks & step-by-step tutorial](https://blog.n8n.io/multi-agent-systems/)
- [Scalable multi-agent chat using @mentions](https://n8n.io/workflows/3473-scalable-multi-agent-chat-using-mentions/)

---

## LINE 整合案例（2026-01 補充）

### LINE + AI Agent 架構

```
LINE Webhook → n8n Webhook 節點 → AI Agent → HTTP Request → LINE Reply
```

### 關鍵設定

| 設定項目 | 說明 |
|---------|------|
| **Webhook URL** | 複製 n8n Webhook URL，貼到 LINE Developer Console |
| **Channel Access Token** | 在 LINE Developer Console 取得，用於回覆訊息 |
| **Session Key** | 用 `userId` 作為 Session Key，確保同一用戶的對話記憶連貫 |
| **Respond to Webhook** | Webhook 設定改為「Respond using 'Respond to Webhook' node」|

### 常見問題

{% faq %}
[
  {
    "category": "LINE 整合",
    "question": "LINE Webhook 收不到訊息？",
    "answer": "1️⃣ 確認 Webhook URL 已正確貼到 LINE Developer Console<br>2️⃣ 確認工作流已啟用（Active）<br>3️⃣ 移除 URL 中的 <code>/test</code> 部分"
  },
  {
    "category": "LINE 整合",
    "question": "AI Agent 沒有回覆？",
    "answer": "1️⃣ Webhook 設定改為 <code>Respond using 'Respond to Webhook' node</code><br>2️⃣ 在 AI Agent 後加入 <code>Respond to Webhook</code> 節點<br>3️⃣ 確認有加入 HTTP Request 節點呼叫 LINE Reply API"
  }
]
{% endfaq %}

### 官方範例模板

- [LINE Counseling Chatbot](https://n8n.io/workflows/2975-build-your-own-counseling-chatbot-on-line-to-support-mental-health-conversations/) - 心理諮商聊天機器人
- [LINE + Google Sheets + Gemini AI](https://n8n.io/workflows/3600-line-chatbot-with-google-sheets-memory-and-gemini-ai/) - 用 Google Sheets 當記憶體
- [LINE BOT + AI Agent 檔案查詢](https://n8n.io/workflows/2874-line-bot-google-sheets-file-lookup-with-ai-agent/) - 自然語言查詢 Google Drive 檔案

---

## MCP 整合（2026-01 補充）

### 什麼是 MCP？

**Model Context Protocol (MCP)** 是 Anthropic 發布的開放協議，標準化 AI 助手與外部工具/資料來源的互動方式。

### MCP 三大能力

| 能力 | 說明 |
|------|------|
| **Resources** | 類似檔案的資料來源 |
| **Tools** | LLM 可呼叫的函式 |
| **Prompts** | 預寫的提示模板 |

### n8n 的 MCP 節點

| 節點 | 用途 | 說明 |
|------|------|------|
| **MCP Server Trigger** | n8n 作為 MCP Server | 將 n8n 工作流暴露為 MCP 工具，供外部 AI Agent 呼叫 |
| **MCP Client Tool** | n8n 作為 MCP Client | 連接外部 MCP Server，讓 n8n AI Agent 使用其工具 |

### MCP vs 傳統 Tool

{% dataTable %}
[
  {"特性": "工具發現", "傳統 Tool": "需手動配置每個工具", "MCP": "自動發現可用工具"},
  {"特性": "跨平台", "傳統 Tool": "僅限 n8n 內使用", "MCP": "可與 Claude、Cursor 等共用"},
  {"特性": "標準化", "傳統 Tool": "n8n 特有格式", "MCP": "開放標準協議"}
]
{% enddataTable %}

### 參考連結

- [n8n MCP Integration](https://n8n.io/integrations/categories/ai/model-context-protocol/)
- [n8n MCP Step-by-Step Guide 2026](https://generect.com/blog/n8n-mcp/)
- [GitHub: n8n-mcp](https://github.com/czlonkowski/n8n-mcp) - Claude Desktop/Cursor 整合

---

## 截圖建議清單（2026-01 補充）

撰寫文章時需要準備的截圖：

### 基礎設定截圖

| 截圖內容 | 建議檔名 | 優先級 |
|---------|---------|--------|
| Chat Trigger + AI Agent 連接畫面 | `ai-agent-basic-setup.png` | ⭐⭐⭐ |
| AI Agent 節點設定面板 | `ai-agent-node-settings.png` | ⭐⭐⭐ |
| Chat Model 選擇畫面 | `ai-agent-chat-model-selection.png` | ⭐⭐ |
| Simple Memory 設定 | `ai-agent-memory-config.png` | ⭐⭐ |
| Tool 連接示意 | `ai-agent-tools-connection.png` | ⭐⭐⭐ |

### 進階功能截圖

| 截圖內容 | 建議檔名 | 優先級 |
|---------|---------|--------|
| Streaming 設定 | `ai-agent-streaming-config.png` | ⭐ |
| Output Parser 設定 | `ai-agent-output-parser.png` | ⭐ |
| 執行結果畫面 | `ai-agent-execution-result.png` | ⭐⭐ |

### LINE 整合截圖（台灣市場差異化）

| 截圖內容 | 建議檔名 | 優先級 |
|---------|---------|--------|
| LINE Developer Console Webhook 設定 | `line-webhook-setup.png` | ⭐⭐⭐ |
| LINE + AI Agent 完整工作流 | `line-ai-agent-workflow.png` | ⭐⭐⭐ |
| LINE 聊天實測畫面 | `line-chat-demo.png` | ⭐⭐ |

---

## 參考連結

**官方文檔**：
- [AI Agent Node](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)
- [Tools Agent](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/tools-agent/)
- [Workflow Tool](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolworkflow/)
- [Streaming](https://docs.n8n.io/workflows/streaming/)
- [Common Issues](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/common-issues/)

**案例教學**：
- [15 AI Agent Examples](https://blog.n8n.io/ai-agents-examples/)
- [Build your first AI agent](https://n8n.io/workflows/6270-build-your-first-ai-agent/)

**Multi-Agent**：
- [Multi-agent system: Frameworks & tutorial](https://blog.n8n.io/multi-agent-systems/)
- [AI Agentic workflows guide](https://blog.n8n.io/ai-agentic-workflows/)

**LINE 整合**：
- [LINE Counseling Chatbot](https://n8n.io/workflows/2975-build-your-own-counseling-chatbot-on-line-to-support-mental-health-conversations/)
- [LINE + Google Sheets + Gemini AI](https://n8n.io/workflows/3600-line-chatbot-with-google-sheets-memory-and-gemini-ai/)
- [LINE BOT + AI Agent 檔案查詢](https://n8n.io/workflows/2874-line-bot-google-sheets-file-lookup-with-ai-agent/)

**MCP 整合**：
- [n8n MCP Integration](https://n8n.io/integrations/categories/ai/model-context-protocol/)
- [n8n MCP Step-by-Step Guide 2026](https://generect.com/blog/n8n-mcp/)

**SEO 競品分析（2026-01）**：
- [Strapi - How to Build AI Agents with n8n](https://strapi.io/blog/build-ai-agents-n8n)
- [C# Corner - Multi-Agent in 10 Minutes](https://www.c-sharpcorner.com/article/from-zero-to-multi-agent-ai-in-10-minutes-with-n8n/)

---

*下一步：使用 n8n-article-writer skill 撰寫文章*
