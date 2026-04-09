---
title: Claude Managed Agents 實測：簡單快速建立自己的雲端 AI Agent
tags:
  - Claude
  - AI Agent
  - Anthropic
  - AI
categories:
  - Claude
page_type: post
id: claude-managed-agents
description: Anthropic 推出 Claude Managed Agents，讓開發者用 Console 或 API 在雲端建立、部署生產等級的 AI Agent。實測 Quickstart 流程，從建立 Agent 到跑出第一個 Session 和心得分享。
bgImage: blog-claude-managed-agents-bg.jpg
date: 2026-04-09 10:43:34
modified: 2026-04-09 10:43:34
---

{% darrellImageCover claude-managed-agents-bg blog-claude-managed-agents-bg.jpg %}

{% callout type="tip" title="重點摘要" %}
**Claude Managed Agents = 雲端版的 AI Agent 託管服務**
- Anthropic 官方提供的 Agent 建置服務，不用自己處理基礎架構
- 四個核心概念：Agent、Environment、Session、Events
- 定價：標準 API token 費 + 每小時 $0.08 主動運行費

{% endcallout %}

{% quickNav %}
[
  {"text": "Claude Managed Agents 是什麼", "anchor": "what-is-managed-agents", "desc": "簡單介紹"},
  {"text": "Console 介面", "anchor": "console-overview", "desc": "先看長什麼樣"},
  {"text": "Quickstart 實測", "anchor": "quickstart-walkthrough", "desc": "從零建立第一個 Agent"},
  {"text": "Template 範本", "anchor": "templates", "desc": "官方 Agent 範本"},
  {"text": "實測結果", "anchor": "check-results", "desc": "Debug 和 Transcript"},
  {"text": "技術架構", "anchor": "architecture", "desc": "大腦與雙手解耦"},
  {"text": "定價", "anchor": "pricing", "desc": "費用怎麼算"},
  {"text": "跟其他方案比", "anchor": "comparison", "desc": "自建 vs 託管 vs OpenClaw"}
]
{% endquickNav %}

<h2 id="what-is-managed-agents">Claude Managed Agents 是什麼？</h2>

簡單講就是一套 {% term def="讓不同軟體之間溝通的介面，這裡指 Anthropic 提供的程式呼叫方式" %}API{% endterm %}，讓你可以在 Anthropic 的雲端建立和跑 AI Agent（[Anthropic Console](https://platform.claude.com/dashboard)）
不用自己架伺服器、處理{% term def="一個獨立的執行環境，可以想成一台虛擬電腦" %}容器{% endterm %}、處理工具整合這些基礎架構的事

Managed Agents 把這套能力開放成 API，讓大家可以自己打造各種 AI Agent

### 四大核心概念

{% dataTable style="minimal" align="left" %}
[
  {"概念": "Agent", "說明": "定義模型、System Prompt、工具、MCP Server"},
  {"概念": "Environment", "說明": "Agent 跑的雲端容器，可設定 plugins 和網路存取"},
  {"概念": "Session", "說明": "Agent 在環境中執行任務的一個實例"},
  {"概念": "Events", "說明": "應用程式和 Agent 之間傳遞的訊息流"}
]
{% enddataTable %}

把它想成：
- **Agent** 員工，有特定的技能和知識
- **Environment** 員工的辦公室，裝了什麼軟體、能不能上網
- **Session** 是他接到一個任務開始工作的過程
- **Events** 是整個工作過程的完整紀錄，包括對話、工具使用、思考過程

<h2 id="why-managed-agents">為什麼需要 Managed Agents？</h2>

現在要自己從零做一個能用的 AI Agent 真的很麻煩

你需要處理一堆跟「AI 本身」無關的事：
- Agent 要跑在哪裡？（自己的電腦 or 伺服器）
- 跑到一半掛了怎麼辦？（錯誤恢復）
- Key 怎麼保管才安全？（安全性）

Managed Agents 把這些雜事全包，你只要專心定義「Agent」就好
Anthropic 官方宣稱可以把開發時間從幾個月縮短到幾天


<h2 id="console-overview">Console</h2>

登入 Anthropic Console 後，左側選單多了一個 **Managed Agents** 區塊，標著 New

{% darrellImage800Alt "Anthropic Console 左側選單，Managed Agents 區塊標示 New" claude_console_navigation_menu.png max-400 %}

底下有五個子項目：
- **Quickstart** — 引導式設定 Agent
- **Agents** — 管理所有 Agent 設定
- **Sessions** — 查看 Session
- **Environments** — 管理雲端環境
- **Credential vaults** — 管理 API 金鑰等敏感資料

<h2 id="quickstart-walkthrough">Quickstart 實測：從零建立第一個 Agent</h2>

Quickstart 的引導做得蠻好的，會一步步帶你建立一個 Agent
整個過程我大概花了 10-15 分鐘

<h3 id="create-agent">Step 1：建立 Agent Config</h3>

第一步是設定 Agent 的定義，一開始會跳出 Browse Templates 讓你選

{% darrellImage800Alt "Browse templates 頁面，顯示多種預建 Agent 範本" console_browse_templates.png max-800 %}

我先選擇用 Deep Researcher 這個 Template

{% darrellImage800Alt "Agent Config 設定畫面，左側說明右側 YAML 設定" multi_step_web_research_agent_configuration.png max-800 %}

設定是用 YAML 格式，主要幾個欄位：

{% dataTable style="minimal" align="left" noHeader %}
[
  {"欄位": "name", "值": "Deep researcher"},
  {"欄位": "model", "值": "claude-sonnet-4-6"},
  {"欄位": "system_prompt", "值": "指示 Agent 怎麼做研究（分解問題、搜尋、閱讀、綜合）"},
  {"欄位": "tools", "值": "agent_toolset_20260401（內建工具包）"},
  {"欄位": "template", "值": "deep-research"}
]
{% enddataTable %}

System Prompt 的設計，它會要求 Agent：
1. 把問題分解成 3-5 個子問題
2. 搜尋權威來源
3. 完整閱讀來源內容（不是只看摘要）
4. 綜合成有引用的報告

{% darrellImage800Alt "Deep researcher Template 完整內容" deep_researcher_template_content.png max-800 %}

<h3 id="choose-internet-access">設定網路存取層級</h3>

因為 Deep Researcher 需要上網查資料，所以會問你要什麼程度的網路存取

{% darrellImage800Alt "選擇網路存取層級：Unrestricted、Limited、Something else" internet_access_level_selection_ui.png max-400 %}

三個選項：
- **Unrestricted** — 完全不限制（測試的時候可以先選這個）
- **Limited** — 有限制的存取
- **Something else** — 自訂

<h3 id="create-environment">Step 2：建立 Environment</h3>

接下來是建立 Agent 要跑的雲端環境

{% darrellImage800Alt "建立雲端環境的 API 呼叫範例" agent_session_mcp_servers_test_run_ui.png max-400 %}


確認 Environment is ready 就可以進下一步

<h3 id="run-session">Step 3：建立 Session 並送出訊息</h3>

現在有了 Agent 和 Environment，就可以建立 Session 開始跑了

收到 `session.status_idle` 事件就代表 Agent 做完了

送出訊息後，Agent 會自動開始工作：
1. 分解問題
2. 用 Web Search 搜尋相關資料
3. 用 Web Fetch 讀取完整內容
4. 綜合成報告回覆

{% darrellImage800Alt "Agent 完成研究後產出的完整報告，包含定價、案例、市場分析" ai_agent_market_analysis_and_pricing_discussion.png max-800 %}

<h3 id="check-results">Step 4：看結果 — Debug 和 Transcript</h3>

跑完之後可以在 Console 的 Preview 頁面看到完整紀錄

### Transcript 分頁

{% darrellImage800Alt "Transcript 分頁顯示完整對話紀錄和工具呼叫" claude_managed_agents_deep_research_session.png max-800 %}

Transcript 會顯示：
- User 的輸入
- Agent 使用哪些 tools
- 每個步驟的 token 消耗量
- Agent 的回覆

我測試問了「什麼是 Claude Managed Agents」，整個流程大約 1 分 18 秒完成

### Debug 分頁

{% darrellImage800Alt "Debug 分頁顯示完整事件時間軸" claude_managed_agents_interaction_preview.png max-800 %}

Debug 分頁更詳細，會列出每個事件的時間軸：

{% dataTable style="minimal" align="left" %}
[
  {"事件": "Session running", "說明": "Session 啟動"},
  {"事件": "User 輸入", "說明": "收到使用者訊息"},
  {"事件": "Model request", "說明": "開始推理"},
  {"事件": "Thinking", "說明": "思考過程（Extended Thinking）"},
  {"事件": "Tool 呼叫", "說明": "web_search × 2、web_fetch × 1"},
  {"事件": "Model 輸出", "說明": "產生回覆"},
  {"事件": "Session idle", "說明": "等待下一個輸入"}
]
{% enddataTable %}

每個事件都有精確的時間戳和 token 消耗（input/output/cache read/write），對 debug 和成本監控很有幫助

{% darrellImage800Alt "Debug 事件列表的完整版本" ai_agent_interaction_claude_managed_agents.png max-800 %}

<h2 id="templates">官方 Template 範本</h2>

除了 Deep Researcher，Anthropic 還提供了不少 Template 讓你快速開始

{% dataTable style="minimal" align="left" highlight="1" %}
[
  {"Template": "Deep researcher", "用途": "多步驟網路研究，自動搜尋和引用來源"},
  {"Template": "Structured extractor", "用途": "把非結構化文字轉成 JSON"},
  {"Template": "Field monitor", "用途": "掃描軟體 blog，產生變更摘要"},
  {"Template": "Support agent", "用途": "客服自動回覆"},
  {"Template": "Incident commander", "用途": "Sentry 警報 → Linear issue → Slack 通知"},
  {"Template": "Feedback miner", "用途": "從 Slack/Notion 分類使用者回饋"},
  {"Template": "Sprint retro facilitator", "用途": "從 Linear 拉 sprint 資料，綜合成回顧文件"},
  {"Template": "Support-to-eng escalator", "用途": "讀 Intercom 對話，重現 bug 並建 Jira issue"},
  {"Template": "Data analyst", "用途": "資料分析"},
  {"Template": "Blank agent config", "用途": "空白起點，自己從頭寫(可以用 prompt 對話建立)"}
]
{% enddataTable %}

<h2 id="architecture">技術架構：大腦與雙手解耦</h2>

Anthropic 部落格分享了一個蠻有趣的設計哲學：**Decoupling the brain from the hands**

把 Agent 拆成三個獨立的部分：

- **大腦（Brain）**：Claude 模型 + {% term def="負責管理 AI 模型呼叫流程的控制程式，像是一個調度員" %}Harness{% endterm %}（呼叫模型的循環邏輯）
- **雙手（Hands）**：{% term def="一個隔離的安全環境，程式在裡面跑不會影響外面的系統" %}沙箱{% endterm %}容器 + 工具執行環境  
- **Session Log**：持久化的事件記錄，獨立存在

### 為什麼要這樣拆？

過去的做法是把所有東西放在同一個容器裡
機器掛了就全部不見，工作進度也會跟著消失

分開之後，容器變成「可替換的消耗品」：
- **容器壞掉** → 系統自動開一個新的容器，從記錄檔回復進度
- **控制程式壞掉** → 用 `wake(sessionId)` 重新啟動，工作進度不會遺失

### 安全設計

Credentials 存在 Vault 裡，不會暴露在 Sandbox 執行環境中
就算容器被入侵，也拿不到 API Key

為什麼要這樣設計？Anthropic 工程部落格提到，舊架構把所有東西放同一個容器，prompt injection 只要讓 Claude 讀自己的環境變數就能拿到全部 token。Vault + Proxy 架構從結構上消滅了這個攻擊面

**網路隔離**也有兩種模式：
- **Unrestricted** — 完整對外存取（有安全黑名單）
- **Limited** — 白名單制，只允許指定的 HTTPS 域名，官方建議生產環境用這個

每個 Session 有獨立的容器，Session 之間不共享檔案系統，Credentials 永遠不會出現在容器的環境變數裡

### 內建工具

Managed Agents 內建的工具列表：

{% dataTable style="minimal" align="left" %}
[
  {"工具": "Bash Shell", "用途": "執行指令"},
  {"工具": "檔案操作", "用途": "Read / Write / Edit / Glob / Grep"},
  {"工具": "Web Search & Fetch", "用途": "搜尋和讀取網頁"},
  {"工具": "MCP Servers", "用途": "連接外部服務"},
  {"工具": "Prompt Caching", "用途": "自動快取最佳化"},
  {"工具": "Session Tracing", "用途": "追蹤每個工具呼叫"},
  {"工具": "Checkpointing", "用途": "中斷後可恢復"}
]
{% enddataTable %}

### Research Preview 功能

除了上面的基本功能，Anthropic 還準備了三個更進階的功能
目前是 {% term def="還在測試階段的功能，需要另外向 Anthropic 申請才能使用" %}Research Preview{% endterm %}，需要填表申請才能用

**1. 多 Agent 協作**

想像你派一個「主管 Agent」出去，他可以再指派工作給其他「專員 Agent」
例如：主管負責拆解任務，一個專員負責搜尋資料，另一個負責寫報告
各 Agent 有自己獨立的工作記憶，不會互相干擾

**2. 品質管控**

你設定好「什麼叫做做得好」的標準，系統會自動檢查 Agent 的成果
沒達標就自動重做，最多可以迭代 20 次，等於內建了一個品管機制

**3. 跨任務記憶**

Agent 做完一個任務後，會記住學到的東西
下次接到類似任務時，會自動參考之前的經驗
跟 Claude Code 的 memory 功能概念一樣，只是變成 API 版本

<h2 id="pricing">價格怎麼算</h2>

{% dataTable style="minimal" align="left" %}
[
  {"項目": "模型推理", "費用": "標準 API token 費（跟直接呼叫 Claude API 一樣）"},
  {"項目": "主動運行", "費用": "$0.08 / 小時（Agent 在雲端跑的時間）"},
  {"項目": "網頁瀏覽", "費用": "$10 / 1,000 次"}
]
{% enddataTable %}

{% dataTable style="minimal" %}
[
  {"時間": "每小時", "美元": "$0.08", "台幣（約）": "NT$2.5"},
  {"時間": "每天（24hr）", "美元": "$1.92", "台幣（約）": "NT$60"},
  {"時間": "每月（30天）", "美元": "$57.60", "台幣（約）": "NT$1,800"}
]
{% enddataTable %}

一個月全天跑也才不到兩千台幣
重點是通常也不會全天跑，有需要啟動時才會收費

{% callout tip %}
運行費只在 Session 狀態為 `running` 時才計費（毫秒精度）
- **running**：Agent 正在思考、呼叫工具、等待工具回應 → 算
- **idle**：Agent 做完了，等你傳下一個訊息 → 不算
- **terminated**：Session 結束 → 不算
{% endcallout %}

### 實測費用拆解

實際跑了 3 個 Session，從 Console 的 Cost 頁面可以看到總花費：

{% darrellImage800Alt "Console Cost 頁面顯示 Total token cost $2.19，Session runtime $0.01" console_cost_dashboard.png max-400 %}

{% darrellImage800Alt "Sessions 頁面，3 個 Deep researcher Session 都在 Idle 狀態" console_sessions_list.png max-800 %}

透過 Session Event Log，可以拆解出每個問答實際經過了什麼：

**簡單問答（問一個問題 → Agent 搜尋 → 回覆）**

{% dataTable style="minimal" align="left" %}
[
  {"步驟": "2 次 Web Search（平行）", "說明": "搜尋相關資料"},
  {"步驟": "1 次 Web Fetch", "說明": "讀取官方文件全文"},
  {"步驟": "產生回覆", "說明": "約 2,200 tokens 的完整報告"}
]
{% enddataTable %}

3 輪 model 推理、3 次 tool call、50 秒完成，費用約 **$0.14（NT$4.5）**

**複雜任務（研究 + 發送到 Slack，含錯誤重試）**

19 次 tool call、15 輪 model 推理、25 分鐘，費用約 **$1.48（NT$47）**
中間因為 Slack 訊息太長被拒絕，Agent 自動拆成分段重送

{% callout error %}
最大花費反而不是 output token，而是 **cache creation**（佔 75%）。每次 Agent 讀到新資料（搜尋結果、網頁內容）都要寫入快取。Session runtime 費用（$0.01）幾乎可以忽略。
{% endcallout %}

### 早期採用案例

根據 Anthropic 的文章，已經有幾家公司在用了：

{% dataTable style="minimal" align="left" %}
[
  {"公司": "Notion", "用途": "讓使用者直接在 Notion 裡委派任務給 AI，支援數十個任務同時並行"},
  {"公司": "Rakuten", "用途": "跨部門（產品、行銷、財務、HR）部署 Agent，每個部門一週內上線，整合 Slack/Teams"},
  {"公司": "Sentry", "用途": "AI 找出 bug 後，Agent 接力寫修復程式碼並自動開 PR，從標記到修復一氣呵成"},
  {"公司": "Asana", "用途": "建立「AI Teammates」，在專案管理流程中與人類協同作業"}
]
{% enddataTable %}


<h2 id="comparison">跟其他做法比一比</h2>

現在要讓 AI Agent 跑起來，大概有三種路線：

{% dataTable style="minimal" align="left" colWidth="15%,25%,30%,30%" %}
[
  {"面向": "架構模式", "自行開發": "Agent SDK", "OpenClaw": "開源框架，自己架伺服器", "Managed Agents": "Anthropic 幫你管雲端環境"},
  {"面向": "怎麼建立", "自行開發": "工具呼叫循環、錯誤恢復、context 管理都自己處理", "OpenClaw": "安裝、更新、安全性、伺服器維護", "Managed Agents": "幾乎不用，Anthropic 全包"},
  {"面向": "模型", "自行開發": "Claude", "OpenClaw": "任意模型", "Managed Agents": "Claude"},
  {"面向": "上手時間", "自行開發": "長", "OpenClaw": "長", "Managed Agents": "快"},
  {"面向": "費用", "自行開發": "API Token", "OpenClaw": "VPS 月費（$10-20/月）+ AI 模型費用", "Managed Agents": "API Token + $0.08/hr 執行費用 + $10/千次 網頁搜尋"},
  {"面向": "安裝難度", "自行開發": "⭐⭐⭐⭐⭐", "OpenClaw": "⭐⭐⭐⭐", "Managed Agents": "⭐"}
]
{% enddataTable %}

<h2 id="thoughts">心得</h2>

實際走完 Quickstart 之後，我的感受是
看起來還在很早起的一個概念，設定上只能用 `YAML` 和 `json` 還是稍微複雜
就算可以用 prompt 輔導建立，但未來應該有更簡易的設定邏輯和方式

還有一些 Beta 的功能看起來是下一步讓他更好用的核心
`多 Agent 協作`和`跨任務記憶` 等等都是現在 AI Agent 熱門的議題
如果 Anthropic 做到簡單設定又品質穩定，那貴一點的費用我相信不少公司還是願意買單


<h2 id="faq">常見問題</h2>

{% faq %}
[
  {"question": "Managed Agents 目前是免費的嗎？", "answer": "不是，需要付標準 API token 費加上每小時 $0.08 的運行費用。網頁瀏覽另外算 $10/千次。"},
  {"question": "需要什麼才能開始用？", "answer": "你需要一個 Anthropic API 帳號，開啟 <a href='https://platform.claude.com/dashboard' target='_blank'>Console 頁面</a> 就能開始。"},
  {"question": "跟 Claude Code 有什麼不同？", "answer": "Claude Code 是本機端的開發工具，Managed Agents 是雲端 API 服務。"},
  {"question": "可以連接自己的 MCP Server 嗎？", "answer": "可以，Managed Agents 支援 MCP Server 整合，你可以在 Agent 設定中加入 MCP Server。"},
  {"question": "Session 中斷了怎麼辦？", "answer": "Managed Agents 有 Checkpointing 機制，可以從 Session Log 恢復，不會遺失進度。"}
]
{% endfaq %}
