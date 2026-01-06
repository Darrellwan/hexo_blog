---
title: n8n 版本更新紀錄心得
tags:
  - n8n
  - update_log
categories:
  - n8n
page_type: post
id: n8n-update-log
description: n8n 的更新記錄(2026/01/06 更新)，包含各版本新功能、改進和修復，和我測試的心得回饋。最新測試版本為 2.3.0（Pre-release），正式版本為 2.2.3
bgImage: n8n-update_bg.jpg
preload:
  - n8n-update_bg.jpg
date: 2025-02-27 12:15:12
modified: 2026-01-06 15:30:00
sticky: 100
---

{% darrellImageCover n8n-update_bg n8n-update_bg.jpg %}

## 2.3.0 Pre-release - 2026-01-05

[Github 2.3.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.3.0)

### Data Table Node 新增 CRUD 操作
Add data table crud operations to data table node

Data Table 以前比較麻煩
你必須到介面手動建立 Table 和欄位
後續更新中加入了 csv 匯入，但如果想用 Workflow 自動建立 Table 還是做不到。
這次的更新終於解決這個痛點！


新增四個 Table 的 action ：
- **Create**：建立新的 Table，可以設定欄位名稱和類型
- **Delete**：刪除 Table
- **List**：列出所有 Table
- **Update**：更新 Table 的名稱

{% callout type="tip" title="應用場景" %}

假設你的自動化場景需要直接建立 Table
例如每月的資料 `2026-01-report`、`2026-02-report`
就可以透過自動化的方式建立!

{% endcallout %}

{% darrellImage800Alt "Data Table Node 新增 Table 層級的 CRUD 操作" n8n-2.3.0-data_table_crud.png max-800 %}

### 一鍵停止所有執行
Add Stop All Executions functionality

當你的 workflow 瀕臨被打爆的邊緣，現在可以一鍵停止所有 execution！

如果 workflow 不小心讓他大量觸發，或是這個 Server 不夠大台卻承受了大量的 request
以前會看到 execution list 有一整排執行中，卻要一個一個逐一停止

現在在 Executions 多了「Stop All」，點下去會跳出確認視窗，可以選擇要停止的類型：
- **Running**：正在執行的
- **Waiting**：等待中
- **Queued**：排隊中

選擇你想停掉的類型後就能一鍵關掉

{% darrellImage800Alt "n8n 新增 Stop All Executions 功能，可一次停止所有執行" n8n-2.3.0-stop_all_executions.png max-800 %}

### Sub-Workflow 草稿版與發佈版分離
Use draft sub-workflow version for manual execution, published for production

{% darrellImage800Alt "Sub-Workflow 版本控制流程圖：手動測試走草稿版，正式執行走發佈版" n8n-2.3.0-subworkflow_infographic.jpg max-800 %}

Sub-workflow 很方便，讓我們抽離的很多流程變成模組
但如果是用在一個服務中的 workflow 就超級麻煩

你必須得自己區分什麼是 **正式環境的觸發**
什麼是 **手動執行的觸發**
然後分別使用不同的 sub-workflow 來測試

現在 n8n 官方把這件事情變得超簡單

內建就會區分執行的來源 **正式 or 測試**
然後正式的執行單獨走正式的版本
測試的執行就用編輯中的草稿版本

這樣你就可以放心改 sub-workflow！

{% darrellImage800Alt "Sub-Workflow 現在區分草稿版和發佈版，測試和生產互不干擾" n8n-2.3.0-subworkflow_versioning.png max-800 %}

## 2.2.0 Pre-release - 2025-12-22

[Github 2.2.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.2.0)

### Webhook Node CIDR IP 白名單
Webhook Node: Use CIDR matching for IP whitelist check

Webhook 的 IP 白名單終於支援 CIDR 格式

大部分人可能不知道什麼是 CIDR，
**CIDR 是 Classless Inter-Domain Routing 的縮寫**
簡單來說就是一個 IP 地址的範圍

如果你們公司有網管或是 IT資安部門
有時候會遇到需要申請 IP 白名單的情況
那他們就會跟你說，請你提供 IP 網段、範圍或是 CIDR

好處是可以在很簡短的文字中，就表達出一段 IP 的範圍
像是一段縮寫一樣

```
192.168.1.0/24  → 包含 192.168.1.0 ~ 192.168.1.255
10.0.0.0/8     → 整個 10.x.x.x 網段
```

{% darrellImage800Alt "Webhook Node IP 白名單現在支援 CIDR 格式" n8n-2.2.0-webhook_cidr.png max-800 %}

### Guardrails Node 支援 Unicode
Guardrails Node: Handle Unicode characters

之前在 1.119.0 介紹過 Guardrails Node，可以用來防止 Prompt Injection 攻擊。

然而其實在判斷中文時會有問題
這版本終於修復！

測試的方式是使用 keyword 來偵測

例如當 prompt 包含 `母湯` 時就應該判定有問題
但是在以前是會通過檢查的

更新後現在能正確判讀中文，並把它判定成有問題
讓你可以用中文的方式篩選或判斷關鍵字

{% darrellImage800Alt "Guardrails Node 現在支援 Unicode，中文 Prompt 也能正確分析" n8n-2.2.0-guardrails_unicode.png max-800 %}

### 節點位置檢查和重疊偵測
Implement node position checks and overlap detection

貼心小更新！
這功能對於 workflow 很雜亂的場景相當有幫助
尤其是愛用 sticky note 的人

以往我們用 sticky note 圈起幾個節點
當從這些節點的中間再新增節點時
sticky note 不會跟著長大跟變寬
這時候還要手動自己調整 sticky note 的寬度

現在：再也不用了
當他偵測到你新增節點時
也會自動把 sticky note 變寬一點

{% darrellImage800Alt "n8n 編輯器新增節點重疊偵測功能" n8n-2.2.0-node_overlap_detection.png max-800 %}


## 2.1.0 Pre-release - 2025-12-15

[Github 2.1.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.1.0)

這版是 **2.1.0 Pre-release**，有很多實用的新功能和改進。

### 全新 Chat Hub 功能
Add new Chat hub feature for chatting with LLMs and your n8n agent workflows

這次新增了一個 **Chat Hub** 聊天中心功能，讓你可以直接在 n8n 內與 LLM 模型聊天，或是與你的 AI agent workflow 互動。
這個功能整合了 SerpApi Google 搜尋能力，讓 AI 可以即時搜尋資訊來回答問題。

對於想要快速測試 AI 回應或是 workflow 執行結果的人來說，這個功能蠻實用的。

使用方式：
1. 先在原本的 workflow 中的 Chat Trigger 啟用聊天 **Make Available in n8n Chat**
{% darrellImage800Alt "先在原本的 workflow 中的 Chat Trigger 啟用聊天 **Make Available in n8n Chat**" n8n-2.1.0-how_to_enable_chat_in_trigger.png max-800 %}

2. 你就會在 Chat Hub 的 Agent Workflow 看到剛剛啟用的 workflow
{% darrellImage800Alt "Chat Hub 的 Agent Workflow 看到剛剛啟用的 workflow" n8n-2.1.0-n8n_workflow_agents_calendar_agent.png max-800 %}

3. 再來就是直接在 Chat Hub 和剛剛的 AI Agent 聊天，不用再單獨進到 workflow 中測試時才能聊天詢問
{% darrellImage800Alt "直接在 Chat Hub 和剛剛的 AI Agent 聊天，不用再單獨進到 workflow 中測試時才能聊天詢問" n8n-2.1.0-n8n_calendar_agent_today_schedule.png max-800 %}


### Anthropic 模型支援 thinking mode
Anthropic model thinking mode support for AI Agent Node

AI Agent Node 現在支援 **Anthropic 的 thinking mode**，這個模式可以讓模型在回答前進行更深入的思考。
對於需要複雜推理的任務來說，這個功能可以提升 AI 的回應品質。

{% darrellImage800Alt "Anthropic 模型支援 thinking mode 的設定畫面" n8n-2.1.0-anthropic_claude_opus_settings.png max-800 %}

實測效果：
當有啟用 thinking 時能明顯感受到 AI 節點執行時間較長
用來處理較為複雜的任務時可以啟用看看，讓 AI 的回答更為精準跟完整

{% darrellImage800Alt "Anthropic 模型支援 thinking mode 的實測效果" n8n-2.1.0-anthropic_chat_model_logs.png max-800 %}

### Gemini 支援 FileSearch

Gemini 前一陣子支援了 File Search 讓 RAG 的導入更加方便
可以想像成一個簡易基礎版的 RAG，如果你需要索引的資料比較簡易
就能考慮先試試看 Gemini 的 File Search 

這次更新也在 Gemini 節點中直接可以建立和上傳 File Search 
不需要再用複雜的 `HTTP Request` 節點自己組合 API 

{% darrellImage800Alt "Gemini 節點中直接可以建立和上傳 File Search" n8n-2.1.0-n8n_upload_pdf_to_gemini_file_search_store.png max-800 %}


## 2.0.0 Pre-release - 2025-12-08

[Github 2.0.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.0.0)

這版是 **2.0 的第一個 Pre-release**，正式版還在準備中。
主要有幾個我覺得值得注意的重點整理在這邊：

### 不再支援 MySQL / MariaDB
Remove mysql and mariadb support

2.0 開始不再支援 MySQL 和 MariaDB，官方只建議使用 Postgres。
如果你是自架環境、而且還在用 MySQL / MariaDB，之後要升級到 2.0 版本前，務必要先做好資料庫的搬家。

{% darrellImage800Alt "n8n 2.0.0 不再支援 MySQL / MariaDB" n8n-2.0.0-no_longer_support_maria_mysql_db.jpg max-800 %}

### 全新運行動畫
New execution and waiting states

這次畫面帶來不少改變
例如節點連結處也改為圓形的設計
節點的執行狀態也有個更 fashion 的動畫提示，如下圖

{% darrellImage800Alt "n8n 2.0.0 全新運行動畫" n8n-2.0.0-new_execution_animation.gif max-800 %}

### 啟用模板變成發佈模板
Publish workflows

現在已經不是單純啟用 workflow 這麼簡單
而是改成發布的機制

每次發布都會有一個版本號碼
未來可以快速調整發布的版本 (類似 Google Tag Manager 或是 Git 的機制)

但**社群版只有一天的 version history**
使用上可能較為不方便

{% darrellImage800Alt "n8n 2.0.0 啟用模板變成發佈模板" n8n-2.0.0-workflow_publish_with_version.png max-800 %}

{% darrellImage800Alt "n8n 2.0.0 發佈模板列表" n8n-2.0.0-workflow_version_list.png max-800 %}



## 1.123.0 Pre-release - 2025-12-01

[Github 1.123.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.123.0)

### 新增 Time Saved 節點 (尚未開放使用)
Add the time saved node / Add time saved mode workflow setting

**Time Saved**追蹤時間節省的新節點  

以前都只能在工作流層級一次設定說：**這個 workflow 每次執行可以節省 x 分鐘**
但其實這個計算方法非常模糊
如果一個 workflow 有多種 path 可以執行，每一種省下來的時間都不一樣  
所以現在新增了 **Time Saved** 追蹤時間節省的新節點
你可以更細緻的調整每個 path 或是這個節點省下的時間

{% darrellImage800Alt "n8n 每個 workflow 可能有不同 path，不同 path 省下的時間不同" n8n-1.123.0-time_saved_per_path.png max-800 %}

由於還無法開啟測試，預計也是等到下週的 **2.0 beta** 版本才能一起測試！

{% darrellImage800Alt "n8n 1.123.0 新增的 Time Saved Node 節點設定畫面，可追蹤自動化節省的時間" n8n-1.123.0-time_saved_node.png max-800 %}

{% darrellImage800Alt "n8n 1.123.0 工作流設定中的 Time Saved Mode 功能，可設定整個工作流節省的時間" n8n-1.123.0-time_saved_workflow_setting.png max-800 %}

### Form Node 支援預設值
Form Node: Set default values

Form 節點可以**設定預設值**

這算是一個讓 Form 節點的表單更方便的功能
現在可以設定某些題目的預設答案
使用者就不用全部都重新選擇

例如你知道受眾年紀可能大部分是某個區間
就可以選擇這個區間為**預設值**

這樣就有大部分的人可以略過這題
但也要注意，可能很多人就也會懶得修改
造成答案不精準

{% darrellImage800Alt "n8n 1.123.0 Form Node 支援設定預設值，提升表單使用體驗" n8n-1.123.0-form_node_default_values.png max-800 %}

示範截圖：

{% darrellImage800Alt "n8n 1.123.0 Form Node 支援設定預設值，示範填寫表單的結果" n8n-1.123.0-form_node_default_values-demo.png max-400 %}

### Gemini Node 新增 Nano Banana Pro 模型
Gemini Node: Add support for Nano Banana Pro model

Gemini 節點現在支援 **Nano Banana Pro** 模型

這也是現在社群上討論度很高的繪圖模型
對於中文的支援程度非常好
但也要注意價格！

> Image output is priced at $120 per 1,000,000 tokens. Output images from 1024x1024px (1K) and up to 2048x2048px (2K) consume 1120 tokens and are equivalent to $0.134 per image. Output images up to 4096x4096px (4K) consume 2000 tokens and are equivalent to $0.24 per image.
[gemini-3-pro-image-preview 價格參考來源](https://ai.google.dev/gemini-api/docs/pricing#gemini-3-pro-image-preview)

2k 圖片每張大約 $0.134 ≈ NT$4.x 台幣
4k 圖片每張大約 $0.24 ≈ NT$7.x 台幣

{% darrellImage800Alt "n8n 1.123.0 Gemini Node 新增支援 Nano Banana Pro 模型" n8n-1.123.0-gemini_new_model.png max-400 %}

## 1.122.0 Pre-release - 2025-11-24

[Github 1.122.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.122.0)

### MCP Client Node（新節點）
MCP Client Node: New node

新增了 **MCP Client Node**

之前只有 MCP Client tool，只能掛載在 AI Agent 節點底下當作 tool 使用
這次是推出了單獨的 MCP Client 節點

讓你可以在一般的工作流中對特定 MCP Server 進行互動
例如我之前有建立 n8n 的 MCP 用來新增和查詢自己的模板資料

使用上的情境會蠻像是串 API 的，還在測試和尋找差異的場景

{% darrellImage800Alt "n8n 1.122.0 新增的 MCP Client Node 節點設定畫面" n8n-1.122.0-mcp_client_node.png max-800 %}

### Data Tables：支援 CSV 匯入
Allow creating data tables from csv files

Data Tables 終於可以直接從 CSV 檔案匯入

以前沒有這功能時，要建立一個現成的資料表很麻煩
要先去 workflow 建立一個簡單的 data table 模板
把 csv 想辦法用 data table 節點新增進去

非常的繞路

現在可以完全不用建立模板，直接用現有的 csv 上傳就好！

{% darrellImage800Alt "n8n Data Tables 支援從 CSV 檔案匯入資料的功能畫面" n8n-1.122.0-data_table_csv_import.png max-800 %}

{% darrellImage800Alt "n8n Data Tables 支援從 CSV 檔案匯入資料完成後的畫面" n8n-1.122.0-data_table_csv_import-done-demo.png max-800 %}

### Data Tables：支援 CSV 下載
CSV download support for data tables

有了匯入，當然也要有匯出！Data Tables 現在支援下載成 CSV 格式了。

這個功能跟上面的 CSV 匯入搭配起來
就形成了一個完整的資料管理：
- 可以從 CSV 匯入建立 Data Tables
- 在 n8n 中處理和更新資料
- 需要的時候再把資料匯出成 CSV

{% darrellImage800Alt "n8n Data Tables 支援下載成 CSV 格式的功能畫面" n8n-1.122.0-data_table_csv_download.png max-800 %}

## 1.121.0 Pre-release - 2025-11-18

[Github 1.121.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.121.0)

### Expression Editor 預覽功能
Expression Editor Preview

表達式編輯器：支援 HTML/Markdown 預覽

在寫複雜的 HTML 或 Markdown 內容到節點時（例如發送 Email 或 Slack 訊息），
以前都只能憑空想像渲染出來的樣子，或是要一直按測試。
現在終於可以在 n8n expression 直接先看看可能的樣子
另外也支援 markdown !

{% darrellImage800Alt "n8n 表達式編輯器新增 HTML 和 Markdown 預覽功能" n8n-1.121.0-expression_preview_html.png max-800 %}

### Data Table 全域搜尋
Global Row Search in Data Tables

Data Tables：全域資料搜尋

Data Tables 資料開始變多的時候，想要快速找一筆資料就變得很麻煩
現在在 Data Table 介面新增了搜尋 Bar
讓你直接模糊搜尋資料

不確定上百萬筆的資料找起來是不是也這麼順

{% darrellImage800Alt "n8n Data Table 新增全域搜尋功能，可快速查找資料" n8n-1.121.0-data_table_search.png max-800 %}

### Code Node 圖示回歸
Code Node Icon Revert

Code Node：圖示改回舊版

天！
之前 Code Node 才改成根據你選擇的語言來替換 icon (119 版本)
想不到這更新過沒多久又被改回來了

{% darrellImage800Alt "n8n Code Node 圖示改回舊版的角括號樣式" n8n-1.121.0-code_icon_change.png max-800 %}



## 1.120.0 Pre-release - 2025-11-10

[Github 1.120.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.120.0)

### Add workflow descriptions
工作流描述功能

可以幫 workflow 加上描述訊息了！

以前只能靠 workflow 名稱來理解大概在做什麼
一旦有大量類似命名的 workflow 出現，就變成很難找到想找的 workflow

現在可以直接在描述欄位寫下更詳細的用途或是教學

{% darrellImage800 n8n-1.120.0-workflow_descriptions n8n-1.120.0-workflow_descriptions.png max-800 %}

### Code Node - Update error message when using .item in Run once for all items mode
Code Node 錯誤訊息優化

當你在「Run once for all items」模式下使用 `.item` 時
以前的錯誤訊息可能不夠清楚，讓人不知道問題在哪裡
現在會給出更明確的提示，告訴你：
```
`.item` only works correctly in 'Run Once for Each Item' mode. It will always return the first item here. Use `.first()` instead.
```

{% darrellImage800 n8n-1.120.0-code_node_error_message n8n-1.120.0-code_node_error_message.png max-800 %}

### Extract from File Node - Add Skip Records With Errors option
Extract from File Node 新增跳過錯誤記錄選項

處理 csv 的檔案時，很容易遇到一些大大小小的錯誤
有時候可能就是裡面的其中幾筆資料出錯而已

現在可以開啟「Skip Records With Errors」選項
自己定義要跳過多少筆資料，而不至於整份檔案讀不到


{% darrellImage800 n8n-1.120.0-extract_from_file_skip_errors n8n-1.120.0-extract_from_file_skip_errors.png max-800 %}

## 1.119.0 Pre-release - 2025-11-03

[Github 1.119.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.119.0)

### Support dynamic node icons using expressions
動態節點圖示表達式支持

往後節點的圖示可能會隨著節點的設定而不同！
讓整體的 UI 更好理解該節點代表的意義

第一個有變化的就是大家常用的 `Code Node`
現在會根據選擇的程式語言不同
來變換對應的 icon

{% darrellImage800 n8n-1.119.0-dynamic_node_icons_using_expressions n8n-1.119.0-dynamic_node_icons_using_expressions.png max-800 %}

### Guardrails Node: Add new node
Guardrails Node（新節點）

這個新的節點目前看來跟 AI 有蠻深的關係
例如用來防止 **Prompt Injection** 攻擊
大大增加在 n8n 使用 AI 的安全性

`Guardrails` 會在 AI 節點之前先檢查輸入的 Prompt 是否安全
並且回傳 `Pass` 或 `Fail` 的結果


{% darrellImage800 n8n-1.119.0-guardrails_node_add_new_node n8n-1.119.0-guardrails_node_add_new_node.png max-800 %}

以這個設定畫面舉例，你可以選擇要檢查的規則有哪些
AI 就會先根據這個規則來依序檢查是否這個 prompt 能通過這些檢查
如果不行，就會告知哪個規則沒有通過，信心程度是多少

{% darrellImage800 n8n-1.119.0-guardrails_node_example n8n-1.119.0-guardrails_node_example.png max-800 %}

### OpenAI Node - Add Responses API support to chat model
OpenAI Node - 新增 Responses API 支援到 chat model

OpenAI Chat Model 現在可以開啟 **Responses API**

{% darrellImage800 n8n-1.119.0-openai_node_add_responses_api_support_to_chat_model n8n-1.119.0-openai_node_add_responses_api_support_to_chat_model.png max-800 %}

可以開啟 Responses API 來使用一些進階的 OpenAI 功能！
例如網頁搜尋和執行程式碼等等
就像是原本在用 ChatGPT 時可以啟用的一些功能一樣

我們用搜尋的方式來測試：
這是沒有開啟 我幫你搜尋了「darrell_tw_」，找到幾個相關的網 時的結果
AI 的回覆是 : `我沒有辦法幫你查詢...資訊`

{% darrellImage800 n8n-1.119.0-openai_node_add_responses_api_support_to_chat_model_example_1 n8n-1.119.0-openai_node_add_responses_api_support_to_chat_model_example_1.png max-800 %}

當開啟了 **Responses API** 的 **Web Search** 後
結果就不一樣了
AI 回覆：`我幫你搜尋了「...」，找到幾個相關的網路資料`

{% darrellImage800 n8n-1.119.0-openai_node_add_responses_api_support_to_chat_model_example_2 n8n-1.119.0-openai_node_add_responses_api_support_to_chat_model_example_2.png max-800 %}

是個很實用的更新，但大家使用前也可以多參考 **Responses API** 有哪些功能！
目前選項中的有：
1. Web Search
2. Code Interpreter
3. File Search

## 1.117.0 Pre-release - 2025-10-21

[Github 1.117.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.117.0)

### 自動分配憑證給其他節點
Auto-assign credentials to other nodes

超級實用的更新！

以前如果是匯入模板，或是現在可能會用 AI Workflow Builder 來生成 workflow 時

那些節點是不會預設分配憑證的，以往需要 **一個又一個手動設定**
現在只要同一個類型的節點設定一次，就會套用到全部其他一樣類型的節點！

例如匯入的模板有多個 Google Drive 節點
設定好第一個節點的憑證後
就能套用到其他 Google Drive 節點！

{% darrellImage800 n8n-1.117.0-auto_assign_credentials n8n-1.117.0-auto_assign_credentials.png max-800 %}

### OpenAI Node 重大更新：Responses API 和影片生成
OpenAI Node: Add Responses API and video generation support

OpenAI 節點迎來升級

**新增功能：**
1. 影片生成功能 - 新增 Video ，可以直接用 Sora 生成影片了！
2. Responses API - 使用 OpenAI 最新的 Responses API

{% darrellImage800 n8n-1.117.0-openai_v2_video n8n-1.117.0-openai_v2_video.png max-800 %}

### workflow匯入 URL 驗證放寬
Expand URL validation to accept any HTTPS URL for workflow import

以前從 URL 匯入 workflow 時有個限制
URL 必須要以 `.json` 結尾才能匯入

現在終於放寬限制了！
只要是 **HTTPS 開頭的 URL** 都可以嘗試匯入

例如以前用 `https://api.example.com/workflow/123` 就不行
必須是 `https://api.example.com/workflow/123.json`

{% darrellImage800 n8n-1.117.0-import_url_validation n8n-1.117.0-import_url_validation.png max-800 %}

## 1.116.0 Pre-release - 2025-10-14

[Github 1.116.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.116.0)

### Replace Node 快速替換節點
Editor: Replace Node context menu option

在編輯器中新增了「Replace Node」的右鍵選單
終於可以**快速替換節點**！
不需要刪除原本的節點再重新建立


{% darrellImage800 n8n-1.116.0-replace_node n8n-1.116.0-replace_node.png max-800 %}

### Lucide Icons 取代 FontAwesome
Rolling out Lucide icons to replace FontAwesome icons

UI 全面更新圖示系統
現在可以看到更好看的圖示
只會是一些**官方的內建節點**，像是 Google 系列的節點圖示沒有改變

{% darrellImage800 n8n-1.116.0-lucide_icons n8n-1.116.0-lucide_icons.png max-800 %}

### AI Workflow Builder (Beta)

這次更新最期待的更新！
以前雖然有 AI Assistant 來輔助 workflow 的建立
但這次官方宣佈新的 AI Workflow Builder 
看來對於 **prompt 產生 workflow** 應該會有更好的生成效果

而且未來對於 `self-host` 版本也能使用！
目前只有官方 Cloud 版本逐步推出中

非常期待能測試這個新功能

{% darrellImage800 n8n-1.116.0-ai_workflow_builder n8n-1.116.0-ai_workflow_builder.png max-800 %}


## 1.115.0 Pre-release - 2025-10-06

[Github 1.115.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.115.0)

### Gmail Node: Recipients only 回覆選項
Gmail 新增「僅回覆收件者」選項

使用 Gmail 節點的回覆功能時
以前沒有選項可以選擇要 **回覆全部** 還是 **僅回覆寄件者**

現在新增 **Recipients only** 選項
可以選擇只回覆給原始寄件者，避免打擾到其他被 CC 的人！
這樣在用自動化回覆信件時能更靈活控制回覆的對象

{% darrellImage800 n8n-1.115.0-gmail_recipients_only n8n-1.115.0-gmail_recipients_only.png max-800 %}

### 參數預覽改用等寬字體
Use monospace for param preview

這是個小但對我來說很重要的 UI 優化
現在查看參數預覽時會使用 **等寬字體（monospace）**

這對看習慣等寬字體的人來說超讚
等寬字體能把數字或英文都排得整整齊齊

{% darrellImage800 n8n-1.115.0-use_monospace_for_preview n8n-1.115.0-use_monospace_for_preview.png max-800 %}

### Anthropic Chat Model Node: Fix Sonnet 4.5 not working with default topP
修復 Sonnet 4.5 預設 topP 問題

Sonnet 4.5 是最近才發佈的新模型
之前也想要來 n8n 試用看看效果
結果發現如果用 Anthropic 的 Sonnet 4.5 chat model
都會莫名的遇到 `topP` 參數無法正常使用這個錯誤訊息，但怎麼調整也沒用

現在已經被修正了！速度超級快

{% darrellImage800 n8n-1.115.0-fix_anthropic_sonnet_4_5_top_p n8n-1.115.0-fix_anthropic_sonnet_4_5_top_p.png max-800 %}


## 1.114.0 Pre-release - 2025-09-29

[Github 1.114.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.114.0)

### Slack Node: Reply to message 修復
Slack 回覆訊息功能修復

這個版本修復了 Slack 節點中「回覆訊息」功能的問題
以前在使用 Reply to message 時好像會遇到無法正確回覆到指定訊息串
(自己測試時好像沒遇到，不過有看到 community 有人回報過)

現在看來已經修正！
至少測試時是正確的

{% darrellImage800 n8n-1.114.0-slack_reply_fix n8n-1.114.0-slack_reply_fix.png max-800 %}

### Binary data access improvements
Binary Data 存取方式大改善！

{% darrellImage800 n8n-1.114.0-binary_data_improvements n8n-1.114.0-binary_data_improvements.png max-800 %}

以前取得 Binary Data 時超級麻煩
現在**終於可以在 Expression 直接取得**

例如在 Set Field 可以選 `binary` 的 type
然後用 expression `{{ $('Download file').item.binary.data }}`
如果是上個節點的資料，也可以直接輸入 field name 來取得

### Show node update button in NDV and node creator
節點更新提示在編輯器中更明顯

現在當社群節點有新版本時
會直接在**節點的設定頁面**和**節點列表中**顯示更新按鈕

不用再跑到帳戶的設定 -> community node 才能更新
這些社群節點更新後通常都會好用很多，有在使用的話記得常常更新

{% darrellImage800 n8n-1.114.0-node_update_button n8n-1.114.0-node_update_button.png max-800 %}

## 1.113.0 Pre-release - 2025-09-23

[Github 1.113.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.113.0)

### Data Tables 成為預設模組
UI 資料表格功能正式啟用

這版本最重要的更新：新功能 **Data Tables**

{% darrellImage800 n8n-1.113.0-data_tables_default_module n8n-1.113.0-data_tables_default_module.png max-800 %}

以前要儲存資料，都還要先開一個 Google Sheet 或是 Airtable 來儲存
現在直接內建了 Data Tables
只要先設計好資料表的欄位，就能直接用來存取資料
而且速度很快！

### Node popularity scoring 改善搜尋排名
節點搜尋更智慧化

現在搜尋節點時會根據節點的受歡迎程度來排序
最常用的節點會優先顯示在搜尋結果前面

{% darrellImage800 n8n-1.113.0-node_popularity_scoring n8n-1.113.0-node_popularity_scoring.png max-800 %}

這更新也是期待很久的功能！
以前要新增一個 `webhook` 節點
通常就會打 `web` 
但這個時候，`webflow` 會在第一個...
第二個才是 `webhook`

更新後會用節點的人氣來決定排名
所以越常用的節點會在越前面

### Google Sheets Node: 新增 Expression 使用警告
Google Sheets Node: Add a warning about using expressions

Google Sheets 節點現在會在使用 expressions 時顯示警告提示
提醒使用者可能遇到的問題

{% darrellImage800 n8n-1.113.0-google_sheets_expression_warning n8n-1.113.0-google_sheets_expression_warning.png max-800 %}

這也是之前不久 n8n 踩到坑才分享的問題
如果用 Google Sheet 的 Sheet Name 想要動態寫入不同的資料表
其實是做不到的

現在 n8n 會直接在你使用 expression 時顯示警告訊息
告訴你這麼作，可能會遇到哪些問題

以後實作時要記得留意這些提醒，它造成的 bug 或錯誤可能會讓你思考人生很久

## 1.112.0 Pre-release - 2025-09-16

[Github 1.112.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.112.0)

### Gemini Node : Edit Image Using Nano Banana
Gemini Node : 使用 Nano Banana 編輯影像

以前 Gemini Node 無法直接傳入 Binary 用來編輯圖片
目前 n8n 官方新增的 **Edit Image** 這個 action
並且可以直接傳 Binary + Prompt 來調整圖片了！

原本要繞過這個限制都是用 `AI Agent` 節點，
現在也不用這麼麻煩了

{% darrellImage800 n8n-1.112.0-gemini_node_add_edit_image n8n-1.112.0-gemini_node_add_edit_image.png max-800 %}

### Perplexity Node: Update model from 'r1-1776' to 'sonar'
Perplexity Node: 更新模型從 'r1-1776' 到 'sonar'

由於 Perplexity 的 `r1-1776` 模型已經停止服務
所以目前 n8n 中的 `Perplexity` 節點也移除這個模型，並且預設使用 `Sonar`

{% darrellImage800 n8n-1.112.0-perplexity_node_replace_sonar_as_default_model n8n-1.112.0-perplexity_node_replace_sonar_as_default_model.png max-800 %}

### Gmail Trigger Node: Handle self-sent emails in inbox
Gmail Trigger Node: 處理收件匣中的自寄郵件

修正了一個重要的邏輯問題

**問題背景**
以前自己寄給自己的 Email
（例如 abc@gmail.com → abc@gmail.com）會被 Gmail Trigger 跳過
但是這在表單的情境中其實很常見

{% darrellImage800 n8n-1.112.0-gmail_trigger_handle_self_sent_emails n8n-1.112.0-gmail_trigger_handle_self_sent_emails.png max-800 %}

對於需要使用 Gmail 寄信給自己來觸發自動化流程的朋友來說
這個修正很讚

## 1.111.0 Pre-release - 2025-09-09

[Github 1.111.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.111.0)

### Fix google service accounts uploading to shared drives
修正 google service accounts 上傳至共用磁碟的問題

{% darrellImage800 n8n-1.111.0-google_drive_shared_fix n8n-1.111.0-google_drive_shared_fix.png max-800 %}

從說明才了解到原來 Google 是在今年四月改了規則
讓 Service Account 無法直接上傳到 Drive 中，因為帳號本身沒有**空間的配額**
你必須要是 **Google Workspace 帳戶**
才會有 Shared Drive 的配額功能使用
這時就能使用 Service Account 來上傳檔案到 Shared Drive 中


### **Wait Node** Allow wait node to accept 0 waiting time input 
允許 wait node 接受 0 等待時間輸入

{% darrellImage800 n8n-1.111.0-wait_node_can_input_0 n8n-1.111.0-wait_node_can_input_0.png max-800 %}

聽起來是個很雞肋的更新
但對於把怎麼使用的自由交還給使用者，我覺得還是好事一件

例如會利用前面的挑件來判斷是否需要等待
如果有符合不需要等待的情況
就讓 wait 節點用 0 秒直接通過
也不用繞過 wait 節點來打亂整個 workflow 配置


### **Google Gemini Node** Allow Nano Banana model to be selected
Google Gemini Node 可以選擇 Nano Banana 模型

{% darrellImage800 n8n-1.111.0-gemini_node_support_nano_banana_model n8n-1.111.0-gemini_node_support_nano_banana_model.png max-800 %}

Gemini 的節點能直接選擇 Nano Banana 模型啦！
但看來還是只能用在 **文生圖**
圖生圖的話這個節點不方便直接把 binary 轉 string 帶入 prompt
需要多一兩個節點來實現

目前習慣是使用 Http Request 或是 AI Agent 節點來直接 pass through binary



## 1.110.0 Pre-release - 2025-09-02

[Github 1.110.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.110.0)

這個版本主要是增加新功能和 Bug 修復，包含專案權限角色和程式碼節點功能增強

### **Added Python to Code node actions**
Code 節點 action 新增 Python

{% darrellImage800 n8n-1.110.0-code_action_add_python n8n-1.110.0-code_action_add_python.png max-800 %}

以往新增 Code 節點時，預設就會是 JavaScript 的方式
現在多了 Python 的 action，讓你在新增時就能決定是否要使用 Python
常用 Python 的人會覺得比較順手，不用再切換一次

### **Added option to restrict credential usage in HTTP request node**
HTTP Request 節點新增憑證使用限制選項

{% darrellImage800 n8n-1.110.0-http_request_add_credential_domain_limit n8n-1.110.0-http_request_add_credential_domain_limit.png max-800 %}

可以把節點應用在特定的 Domain 或是限制，以免不小心把 A 服務的 Credentials 錯誤送出到 B 服務上，
這樣等於 B 服務會看到你的 A 服務驗證資訊
非常危險！

### **Filter Node: Fix ignore case toggle not working**
Filter 節點修復忽略大小寫切換無效問題

修復了 Filter 節點中「忽略大小寫」選項切換時無法正常運作的 Bug
現在切換後會立即生效！

{% darrellImage800 n8n-1.110.0-filter_toggle_fix n8n-1.110.0-filter_toggle_fix.png max-800 %}



## 1.109.0 Pre-release - 2025-08-26

[Github 1.109.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.109.0)


這個版本主要是 Bug 修復和小幅改善，沒有太多新功能

### **Do not wait for community nodes to load**
載入時不需要等待社群節點

會讓 n8n 在介面的操作上稍微更順暢一點
調整了載入的順序，讓社群節點只有在節點搜尋時才會需要

### **editor: Fix importing curl commands with comma**
帶有逗號的 curl 指令也能順利匯入

{% darrellImage800 n8n-1.109.0-fix_curl_with_comma n8n-1.109.0-fix_curl_with_comma.png max-400 %}

這是又針對 curl 語法的匯入多了一個優化
在遇到 `,` 時，也能順利匯入

### **Slack Node: Refine label name for reply broadcast setting**
Slack 節點標籤清楚告知是不是要傳送到 Channel

{% darrellImage800 n8n-1.109.0-slack_reply_to_channel_optimize_wording n8n-1.109.0-slack_reply_to_channel_optimize_wording.png max-800 %}

只是調整顯示的文字
其實影響很大

之前在社群就蠻常有人問到說，這選項在做什麼
以前寫 `reply to thread` 的時候，會以為就是回應在下方
其實打開這選項，會變成除了回覆，還會是單獨的一條訊息

{% darrellImage800 n8n-1.109.0-slack_setting_send_to_channel n8n-1.109.0-slack_setting_send_to_channel.png max-400 %}

其實就等於 slack 在回應時是否勾選這個選項 `也傳送到 xx 頻道`

## 1.108.0 Pre-release - 2025-08-19

[Github 1.108.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.108.0)

### MCP Client Tool Node:Add Timeout config for the MCP Client tool
為 MCP Client 工具新增 Timeout 設定

{% darrellImage800 n8n-1.108.0-mcp_client_tool-add_timeout_config n8n-1.108.0-mcp_client_tool-add_timeout_config.png max-400 %}

期待已久的更新，過去就曾經發生串接 `Firecrawl` 的 mcp node 時
因為執行時間較久，超過預設的 timeout 時間導致失敗

現在可以自行延長 timeout 時間來避免這樣的錯誤了ㄅ


### Form Node:Checkboxes and Radio Buttons field types
Form 接點新增 Checkboxes 和 Radio Buttons 的選項類別

{% darrellImage800 n8n-1.108.0-form_add_checkbox_radiobuttons n8n-1.108.0-form_add_checkbox_radiobuttons.png max-400 %}

更完善表單可以使用的選項類型

Checkbox 使用者可以選擇多個選項，得到的 JSON 會是 `{ key : [value1, value2, ...] }`

### Wait Node: Add validation for wait amount and unit
Wait 節點加入對時間和單位的驗證

{% darrellImage800 n8n-1.108.0-wait_add_validate_to_number_unit n8n-1.108.0-wait_add_validate_to_number_unit.png max-800 %}

Wait 節點加強驗證時間數字和單位
測試舊版的不會特別驗證，導致有可能等待時間如果使用 `expression` 會出現非預期的等待時間


## 1.107.0 Pre-release - 2025-08-12

[Github 1.107.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.107.0)

### Production Checklist for Active Workflows - 智慧工作流程建議系統

n8n 新增了 active workflow 的建議功能
會在你的工作流程標題列顯示一個鈴鐺圖示
當系統偵測到你的工作流程可以改善時，就會主動提供建議

**三大智慧偵測功能：**
1. AI 評估建議：如果工作流程包含 AI 節點，會建議你設定評估機制
2. 錯誤處理建議：已啟用但沒設定錯誤處理的工作流程會收到提醒
3. 時間追蹤建議：協助你測量自動化真正節省了多少時間

實測功能截圖如下：

{% darrellImage800 n8n-1.107.0-activate_workflow_show_notification n8n-1.107.0-activate_workflow_show_notification.png max-400 %}

### Discord Node OAuth Custom Scopes Support

**Discord 機器人開發者的福音！**

以前使用 Discord 節點時，OAuth 權限範圍是固定的
很多進階功能都無法使用，像是列出伺服器清單等等

現在可以自訂 OAuth scopes 了
有其他 scope 的需求就能自己加入
否則原本只能使用預設的一些 scope，挺不方便

{% darrellImage800 n8n-1.107.0-discord_oauth_custom_scopes n8n-1.107.0-discord_oauth_custom_scopes.png max-800 %}

### SendAndWait Operations Security Enhancement

**安全性提升**

針對需要「Human in the loop」的工作流程，n8n 強化了安全機制

現在的這些網址會加上一個 signature 
用來驗證是否是真實的 n8n 節點發出網址
以免其他人只拿到你的 n8n 網域後就能盜用發送不對或是危險的資料

{% darrellImage800 n8n-1.107.0-sendandwait_security_token n8n-1.107.0-sendandwait_security_token.png max-400 %}

## 1.106.0 Pre-release - 2025-08-05

[Github 1.106.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.106.0)

### Store last entered cURL command for each HTTP node
為每個 HTTP 節點儲存最後輸入的 cURL 指令

**方便的更新！**

用 `CURL` 來 import 到 `request` 節點是非常方便的事情
但以前只會記得最後一個 import 的語法

現在會個別記憶！
所以如果有需要調整的話可以打開該 `request` 節點的 CURL 語法來調整就好

{% darrellImage800 n8n-1.106.0-curl_memory_in_request_node_1 n8n-1.106.0-curl_memory_in_request_node_1.png max-800 %}

{% darrellImage800 n8n-1.106.0-curl_memory_in_request_node_2 n8n-1.106.0-curl_memory_in_request_node_2.png max-800 %}

### Add CSS variable to customize input background
新增 CSS 變數以自訂輸入背景 

現在 n8n 的表單也支援客製化 input 視窗的背景顏色了

以前沒辦法，所以要是做深色背景時
都還是只能用白色的 input 視窗

現在可以一起改成深色的背景、淺色的字體！

{% darrellImage800 n8n-1.106.0-custom_input_bg_in_form n8n-1.106.0-custom_input_bg_in_form.png max-800 %}

### Google Sheets Node: Make it possible to set cell values empty on updates
使在更新時能夠將儲存格值設為空值

這是一個當你會用到，就會很重要的功能

以前如果想要更新空值，你用真的 empty 是無法更新的，變成要用空白等等的奇怪方式

現在終於支援可以直接更新空值，對一些場景來說真的方便很多

{% darrellImage800 n8n-1.106.0-google_sheet_update_empty_value n8n-1.106.0-google_sheet_update_empty_value.png max-800 %}


## 1.105.0 Pre-release - 2025-07-29

[Github 1.105.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.105.0)

### editor: Add settings icons to the node on canvas
編輯器：在畫布節點上新增設定圖示

現在節點的設定選項，會直接顯示在 Canva 的圖示中
你能一目瞭然哪些節點有設定選項！

{% darrellImage800 n8n-1.105.0-show_setting_icon_in_canva n8n-1.105.0-show_setting_icon_in_canva.png max-800 %}

{% darrellImage800 n8n-1.105.0-show_setting_icon_in_canva_2 n8n-1.105.0-show_setting_icon_in_canva_2.png max-800 %}

### editor: Release the Focus Panel 
編輯器：發布專注面板功能

新增了 Focus Pane
可以在右邊直接編輯細節像是 `Code` 
就不用再切換視窗編輯！

{% darrellImage800 n8n-1.105.0-focus_panel n8n-1.105.0-focus_panel.png max-800 %}

### RSS Read Node: Add support for custom response fields
RSS 讀取節點：新增自訂回應欄位支援

RSS 雖然有規範欄位名稱，但還是可能遇到對方使用了自定義的欄位
現在可以支援來讀取這些特殊的欄位名稱

{% darrellImage800 n8n-1.105.0-rss_custom_field n8n-1.105.0-rss_custom_field.png max-800 %}

## 1.104.0 Pre-release - 2025-07-25

[Github 1.104.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.104.0)

### New node: Anthropic Node

新增 `Anthropic` 節點
直接使用 `claude 4 sonnet` 模型的相關 API
有一些還沒有完全開放的 api endpoint 相當吸引人
例如 `improve prompt` 未來可以用來自動改善提示詞！

{% darrellImage800 n8n-1.104.0-new_node-anthropic n8n-1.104.0-new_node-anthropic.png max-800 %}

### Facebook Graph API Node: Support v23

Facebook Graph API 節點支援 v23
有使用 Facebook Graph API 的朋友可以多多參考更新了什麼

[Facebook Graph API v23 更新文件](https://developers.facebook.com/docs/graph-api/changelog/version23.0/)

{% darrellImage800 n8n-1.104.0-facebook_graph_api-support_v23 n8n-1.104.0-facebook_graph_api-support_v23.png max-800 %}

### n8n Form Node: Allow basic styling of form completion message

{% darrellImage800 n8n-1.104.0-form_ending-html_support n8n-1.104.0-form_ending-html_support.png max-800 %}

n8n Form 節點
在表單的 completion 頁面多支援了簡易的 html 排版
再也不會只有單調的 text 能用
(( 和原本的 form styling 不太一樣喔



## 1.103.0 Pre-release - 2025-07-15

[Github 1.103.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.103.0)

### New node: Google Gemini Node

新增 `Google Gemini` 節點
這樣就可以直接使用裡面的模型跟工具
除了跟文字互動以外
也能直接產生圖片、影片、分析音檔等等

{% darrellImage800 n8n-1.103.0-new_node-google_gemini n8n-1.103.0-new_node-google_gemini.png max-800 %}

### Add Cohere Chat Model node

新增 `Cohere Chat Model` 節點
是另一種像是 OpenAI 的 LLM 模型
更具體的功能跟差異目前還不太清楚

只知道如果申辦帳號，就會有一組免費的 API KEY 可以使用
詳細的免費額度如截圖，也能參考[網站文件](https://docs.cohere.com/docs/rate-limits)獲得最新資訊

{% darrellImage800 n8n-1.103.0-new_node-cohere_rate_limit n8n-1.103.0-new_node-cohere_rate_limit.png max-800 %}

簡單的實測結果是
同一段的文字 input

Cohere 的處理時間為 11.85 秒
Google Gemini 2.5 flash 的處理時間為 19.02 秒

{% darrellImage800 n8n-1.103.0-new_node-cohere_chat_model n8n-1.103.0-new_node-cohere_chat_model.png max-800 %}


### Add Agent Tool
新增 `Agent Tool` 節點

看起來是把原本的 `AI Agent` 節點又單獨變成一個 `AI Agent tool`
應該能實現所謂的超級多小 Agent 之間的互相調用
以前要做到類似的事情，需要建立不少 sub-workflow 來做一樣的事情
現在又能簡化成直接用 tool 的方式來串接

蠻值得測試這樣的應用！

{% darrellImage800 n8n-1.103.0-new_node-agent_tool n8n-1.103.0-new_node-agent_tool.png max-800 %}





## 1.102.0 Pre-release - 2025-07-08

[Github 1.102.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.102.0)

### editor: Collapse button on table view
在表格視圖上的收合按鈕

以前在看 Output 時，如果遇到資料的欄位比較大
常常很難一眼就看清楚所有資料

現在可以用收合的方式直接把欄位收起來

{% darrellImage800 n8n-1.102.0-add_collapse_button n8n-1.102.0-add_collapse_button.png max-800 %}

### Mistral AI Node: New node
Mistral AI Node: 新節點

Mistral AI 目前在 n8n 主要支援是 OCR
可以支援圖像辨識和文件辨識

下圖測試的圖片 OCR 精準度很不錯，速度也很外！

{% darrellImage800 n8n-1.102.0-new_node-mistral-ai n8n-1.102.0-new_node-mistral-ai.png max-800 %}

**不是免費服務**

建議有需要的朋友先查閱價格！
[Mistral AI 價格](https://mistral.ai/pricing#api-pricing)

### Google Sheets Node: Include all headers
Google Sheets Node: 包含所有標頭

先前如果輸入的欄位數量和 Google Sheet 原本欄位數不同
會在插入時取代掉原本的欄位

目前修正了這問題，附上前後的測試效果比較

{% darrellImage800 n8n-1.102.0-google_sheet_header n8n-1.102.0-google_sheet_header.png max-800 %}


## 1.101.0 Pre-release - 2025-07-01

[Github 1.101.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.101.0)

### editor: Add What's New notification callout 
新增 What's New 通知提示

現在可以看到一些改版資訊！

{% darrellImage800 n8n-1.101.0-what_is_new_notification n8n-1.101.0-what_is_new_notification.png max-800 %}

{% darrellImage800 n8n-1.101.0-what_is_new_notification_2 n8n-1.101.0-what_is_new_notification_2.png max-800 %}

### Don't allow multiple active workflows with same form path

不允許多個活躍的工作流程具有相同的表單路徑

{% darrellImage800 n8n-1.101.0-form_path_can_not_be_the_same n8n-1.101.0-form_path_can_not_be_the_same.png max-800 %}

`Form` 表單節點是可以自訂 webhook path 的
但現在跟 `webhook` 一樣，不允許多個 activate 的 path 重複

{% darrellImage800 n8n-1.101.0-form_path_can_not_be_the_same-set_path n8n-1.101.0-form_path_can_not_be_the_same-set_path.png max-400 %}

### Support YouTube video embeds on Sticky notes
Sticky Note Node: 支援 YouTube 影片嵌入在 Sticky notes 上

{% darrellImage800 n8n-1.101.0-put_youtube_in_sticky_note n8n-1.101.0-put_youtube_in_sticky_note.png max-800 %}

是個很實用的功能
未來如果要分享模板給別人
如果已經有影片教學怎麼使用的話
就可以直接放在模板裡面，讓需要的人直接看教學影片

語法分享
1. 取得 Youtube 影片 id
```
https://www.youtube.com/shorts/CsLboB8QNGY 
->
CsLboB8QNGY
```

2. 將語法貼入 sticky note 中
```
@[youtube]({{video_id}})
```

`{{video_id}}` 替代成剛剛取得的 Youtube 影片 id


## 1.100.0 Pre-release - 2025-06-23

[Github 1.100.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.100.0)

### Model Selector Node: 新增 AI 模型選擇節點
新增了一個專門的 Model Selector 節點，讓你可以更靈活地在不同 AI 模型之間切換，特別適合需要根據不同情境選擇最適合模型的場景。

{% darrellImage800 n8n-1.100.0-model_selector_node n8n-1.100.0-model_selector_node.png max-800 %}

### Google Ads Node: 從已棄用的 v17 API 遷移到新版本

## 1.99.0 Pre-release - 2025-06-18

[Github 1.99.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.99.0)

### core: Add number of tokens and latency automatically as metrics in evaluation 
在評估中自動添加 token 數量和延遲作為指標

{% darrellImage800 n8n-1.99.0-evaluations_add_token_metric n8n-1.99.0-evaluations_add_token_metric.png max-800 %}

增加了在 Evaluation tab 中顯示的資訊
包含的測試時使用的 token 數

{% darrellImage800 n8n-1.99.0-evaluations_add_token_metric_2 n8n-1.99.0-evaluations_add_token_metric_2.png max-800 %}


### MCP Server Trigger Node: Support for Streamable HTTP transport in MCP Server

{% darrellImage800 n8n-1.99.0-mcp_server_add_support_http_streamtable n8n-1.99.0-mcp_server_add_support_http_streamtable.png max-800 %}

MCP Server 節點中新增了 Streamable HTTP transport 的支持
使用者無須調整設定
直接使用新版的節點就好，也支援原本的 SSE 方式

### editor: Change default node names depending on node operation and resource
editor: 依據節點操作和資源來改變預設的節點名稱

超讚的改善！
以往新增 tool 時，例如 drive 就會有好幾個，掛在同一個 agent 中
這時候就需要自己慢慢重新命名

現在會根據你選的 action 來自動調整，例如 `download drive`


{% darrellImage800 n8n-1.99.0-node_name_will_change_automatically_based_on_action n8n-1.99.0-node_name_will_change_automatically_based_on_action.png max-800 %}



## 1.98.0 Pre-release - 2025-06-12

[Github 1.98.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.98.0)

這版本有大量的修復！因為在 1.97 中看到 community 上不少人在討論遇到一些大大小小的 Bug

### feat(n8n Node): Add missing filters
添加缺少的 Filter

在 n8n 節點中篩選 workflows 時可以更方便

{% darrellImage800 n8n-1.98.0-add_filter_in_n8n_node n8n-1.98.0-add_filter_in_n8n_node.png max-800 %}

### fix(RSS Read Node): Fix issue where some feeds fail to load
修復某些 feed 無法載入的問題

自己的測試之前沒有遇過類似的問題
但有修復代表就能支援更多種 feed 網址了！

{% darrellImage800 n8n-1.98.0-fix_rss_node n8n-1.98.0-fix_rss_node.png max-800 %}

### OpenAI Chat Model Node: Update default model to gpt-4.1-mini 
OpenAI Chat Model Node: 更新預設模型至 gpt-4.1-mini 

現在 OpenAI Chat Model Node 預設模型調整為 gpt-4.1-mini

這邊也附上 4o-mini 和 4.1 mini 的模型比較

{% darrellImage800 n8n-1.98.0-gpt_4.1_mini_model_compare_4o_mini n8n-1.98.0-gpt_4.1_mini_model_compare_4o_mini.png max-800 %}

4.1 mini 算是比 4o-mini 貴了一些，但在調用模型的能力上應該強大不少，另外 context 也達到一百萬
在上下文的理解上強大很多


{% darrellImage800 n8n-1.98.0-default_gpt_4.1_mini_model n8n-1.98.0-default_gpt_4.1_mini_model.png max-800 %}

### Structured Output Parser Node: Add auto-fix support to Structured Output Parser
Structured Output Parser 新增自動修復支援

這是把原本的 auto-fix 移除，變成一個可以勾選的功能
如果 output 第一次和預期的格式不符合，就會調用 LLM 進行多一輪的修復

{% darrellImage800 n8n-1.98.0-structure_output_add_auto_fix n8n-1.98.0-structure_output_add_auto_fix.png max-800 %}

這是個有開啟 Output Parser 和沒有的差異 demo

{% darrellImage800 n8n-1.98.0-structure_output_demo n8n-1.98.0-structure_output_demo.png max-800 %}

可以看到開啟後，就已經轉成完美的 JSON object 格式了
只是要先自己定義清楚希望輸出的格式是什麼
或是請 AI 幫忙產生

## 1.97.0 Pre-release - 2025-06-03

[Github 1.97.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.97.0)

這個版本主要是 Bug 修復，沒有太多新功能，但修正了一些重要的問題：

- 修正 WorkFlow 設定頁面 404 錯誤
- 改善 CORS 標頭設定
- 修正日誌檔案位置的絕對路徑支援


## 1.96.0 Pre-release - 2025-06-02

[Github 1.96.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.96.0)

### Perplexity Node: New node
Perplexity 新節點！

但 icon 居然還是壞的😂

{% darrellImage800 n8n-1.96.0-new_perplexity_node n8n-1.96.0-new_perplexity_node.png max-800 %}

{% darrellImage800 n8n-1.96.0-perplexity_node_result n8n-1.96.0-perplexity_node_result.png max-800 %}

代表現在不用在 Request 節點中自己串接 API 了！

剛好之前有儲值一點點 Perplexity 的 API 餘額，可以更方便的用在 n8n 的場景中！

這邊提供 Perplexity 的模型該怎麼選擇（由 Claude 整理）

{% darrellImage800 n8n-1.96.0-perplexity_models n8n-1.96.0-perplexity_models.png max-800 %}

### editor: Add ability to extract sub-workflows to canvas context menu
editor: 新增從 canvas 右鍵選單提取 sub-workflow 的功能


<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1090114436?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8n-extract-sub_workflow-1.96.0 update"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

超棒的更新！

今天剛好才發文說 sub-workflow 的好處
沒想到直接多了一個重要改版

1.現在要拆 sub-workflow 更簡單了！
2.把你想要拆出去的部分選起來
3.右鍵
4.選擇 **Extract to sub-workflow**
5.幫 sub-workflow 取個名字

就完成了！

### Respond to Webhook Node: Setting to configure outputs
Respond to Webhook Node: 新增設定來配置輸出

{% darrellImage800 n8n-1.96.0-custom_output_path n8n-1.96.0-custom_output_path.png max-800 %}

Respond to Webhook 多了一個選項，勾起來後可以針對 Input Output 的 path 做另外的設定
雖然暫時想不到使用的場景有哪些

但多一個 path 就代表多一種邏輯可以處理，絕對是利大於弊
反正用不到也不用一定要打開！


## 1.95.0 Pre-release - 2025-05-26

[Github 1.95.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.95.0)

### Anthropic Chat Model Node: Set the new Claude 4 Sonnet model to be the defaults
Anthropic Chat Model Node: 將新的 Claude 4 Sonnet 模型設為預設

{% darrellImage800 n8n-1.95.0-anthropic_default_4_sonnet n8n-1.95.0-anthropic_default_4_sonnet.png max-800 %}

出現新的 Claude Sonnet 4、Claude Opus 4 模型可以選了


### editor: "Executing" state in the output panel
editor: 「執行中」狀態在輸出面板中 

{% darrellImage800 n8n-1.95.0-show_execute_status_in_output n8n-1.95.0-show_execute_status_in_output.png max-800 %}

現在 run 的時候下方 log panel 的 output 會顯示一個 `Executing` 的狀態
算是改善 UI 的顯示

### Editor: Add an option to sync canvas with log view
editor: 新增一個選項來同步畫布與日誌視圖

這是一個蠻不錯的 UI 改善
現在開啟 `Sync selection with canvas`

就能看到在 canvas 選哪個節點
下方的 Log 就自動跟著顯示哪個節點的資訊！

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1087741973?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8n-update-1.95.0-Add an option to sync canvas with log view"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

## 1.94.0 Pre-release - 2025-05-20

[Github 1.94.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.94.0)

這次的更新內容蠻豐富的，修復了很多 Bug 和改善
有興趣的話可以逛逛官方更新資訊

### n8n Microsoft Teams Node: New trigger node

Teams 節點新增了幾個 Trigger Action!

1. New Chat Message
2. New Channel
3. New Chat
4. New Channel Message
5. New Team Member


{% darrellImage800 n8n-1.94.0-microsoft_teams_node_new_trigger_actions n8n-1.94.0-microsoft_teams_node_new_trigger_actions.png max-800 %}

### feat(editor): Keyboard shortcuts for the log view

Log Panel 中新增了快捷鍵

{% darrellImage800 n8n-1.94.0-log_panel_add_shortcuts n8n-1.94.0-log_panel_add_shortcuts.png max-800 %}


```bash
I -> Input
O -> Output
J -> 上一個
K -> 下一個
L -> 開啟 Log Panel
```

> 這是目前自己測試的結果，可能要等官方公布完整的快捷鍵清單才會確定

### feat(editor): Show sub workflow runs in the log view

如果是在 Workflow 執行 Sub Workflow ， Log 中可以直接看到 Sub Workflow 的執行結果
不用再切回外面的 execution 去找來看

{% darrellImage800 n8n-1.94.0-log_shows_subworkflow_execution n8n-1.94.0-log_shows_subworkflow_execution.png max-800 %}

### feat(Execute Workflow Trigger Node): Reintroduce binary data on Workflow Triggers 

Sub Workflow 的 Trigger 中，現在可以丟 binary data ！
之前沒有太研究 Sub Workflow，但是看官方的更新資訊很好笑

> We removed this prior in case it made our lives easier, but it's just proven a missing feature.

看來有點像是認命，還是得做的感覺😂

{% darrellImage800 n8n-1.94.0-subworkflow_accept_binary n8n-1.94.0-subworkflow_accept_binary.png max-800 %}






## 1.93.0 Pre-release - 2025-05-13

[Github 1.93.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.93.0)

### Community Nodes in the Nodes Panel
社區節點在節點面板中

現在只要是經過認證的 **community node** 
就可以在節點列表中被搜尋到！

{% darrellImage800 n8n-1.93.0-show_community_node_in_search n8n-1.93.0-show_community_node_in_search.png max-800 %}

### core: Change workflow deletions to soft deletes
core: 將工作流程的刪除改為軟刪除

刪除 workflow 時，現在不會直接整個刪除
而是改為 archived 的形式封存起來
在 workflow 列表中也能重新尋找這些被封存的 workflows

真心想刪除的話，找到 archived 的 workflow 
選單中就會出現 delete 了！

{% darrellImage800 n8n-1.93.0-soft_delete_archived n8n-1.93.0-soft_delete_archived.png max-800 %}

### editor: Allow jumping into sub-workflow with shortkey
editor: 允許透過快捷鍵跳入子工作流程 

如果你有使用 sub workflow
可以直接用新的快捷鍵 `Command + Click` 就能迅速開啟 sub workflow 到新的分頁編輯！

{% darrellImage800 n8n-1.93.0-open_subworkflow_quickly n8n-1.93.0-open_subworkflow_quickly.png max-800 %}

### editor: Implement 'Shared with you' section in the main navigation
editor: 實作 '與您分享' 區段 在主要導航中

一個對於 n8n 社群版來說比較沒感的更新
如果是 官方 cloud 版本就會比較有用

現在把分享給你的 workflow 和 credentials 都會集中顯示在這個 section！

{% darrellImage800 n8n-1.93.0-share_with_you_section n8n-1.93.0-share_with_you_section.png max-800 %}

## 1.92.0 Pre-release - 2025-05-05

[Github 1.92.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.92.0)

### core: Manual execution defaults to Manual trigger
core: 手動執行預設為手動觸發

{% darrellImage800 n8n-1.92.0-manual_trigger n8n-1.92.0-manual_trigger.png max-800 %}

現在有 manual trigger 也有其他 trigger 時，手動按 test workflow 就會預設是 manual 來觸發
但實際測試時，如果有 webhook trigger
還是會變成等待 webhook 觸發，這點要注意⚠️

### editor: Import form data with special characters from curl command correctly
editor: 從 curl 命令正確匯入包含特殊字元的表單數據

(借用官方 issue 的圖片)
{% darrellImage800 n8n-1.92.0-curl_import_fix_for_special_character n8n-1.92.0-curl_import_fix_for_special_character.png max-800 %}

以前偶爾會遇到這種情況，明明那段 curl 語法沒有問題
import 進去卻像圖片那樣跑掉

之前沒想到是被特殊字符害的
這次更新後應該是比較不會遇到了！

### editor: Add "Rendered" display mode to the logs view
編輯器: 新增「Rendered」顯示模式到日誌視圖

{% darrellImage800 n8n-1.92.0-log_panel_rendered n8n-1.92.0-log_panel_rendered.png max-800 %}

看起來優化了 log panel 
input output 的顯示都得到優化
和下方 1.89 的版本比起來
真的好看了許多

另外 **Log Panel** 的顯示方式已經調整了喔

需要到環境變數中加上
`N8N_ENABLE_LOGS_VIEW = true`

如果你是 Zeabur 用戶，示意圖如下

{% darrellImage800 n8n-1.92.0-setting_env_for_logs n8n-1.92.0-setting_env_for_logs.png max-800 %}


## 1.91.0 Pre-release - 2025-04-29

[Github 1.91.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.91.0)

### OpenAI Node

> OpenAI Node: Filter available models by blacklisting rather than whitelisting
> 透過黑名單過濾可用模型，而不是透過白名單

未來如果 OpenAI 推出新模型，將會自動出現在 n8n OpenAI 節點中
以前是用白名單的方式，所以新模型需要等到 n8n 那邊更新才會出現
未來就沒有這個問題了！

> Support gpt-image-1 for image generation
> 支援 gpt-image-1 用於影像生成

{% darrellImage800 n8n-1.91.0-chatgpt_generate_image_1_model_in_openai_node n8n-1.91.0-chatgpt_generate_image_1_model_in_openai_node.jpg max-800 %}

之前因為沒辦法在 OpenAI 選擇 gpt-image-1 模型
所以都用 `Request` 節點來串 API

現在可以在 OpenAI Generate Image 中直接選這個新模型來使用了喔！

⚠️ 經測試
這個節點的選項貌似沒有正確更新或調整
現在選擇 Quality 好像也沒有讓圖片品質調降
-> 目前已回報給官方，之後有後續會再跟進！

{% darrellImage800 n8n-1.91.0-chatgpt_generate_image_1_model_in_openai_node_options_error n8n-1.91.0-chatgpt_generate_image_1_model_in_openai_node_options_error.png max-400 %}

### Fix: Google Sheet Trigger

> Google Sheets Trigger Node: Filter by first data row on rowAdded event 
> 過濾第一資料列於 rowAdded 事件

[Github Issue](https://github.com/n8n-io/n8n/issues/13322)

蠻久以前的一個 Issue
使用者指定了 Sheet `Row Added` 的監聽事件
並且指定了資料欄位

可是他在 Google Sheet 新增了 200 行資料，會啟用 200 次 Trigger
他原本期待是只會觸發他指定的資料行數那筆
目前這問題已修正

{% darrellImage800 n8n-1.91.0-sheet_trigger_fix n8n-1.91.0-sheet_trigger_fix.png max-400 %}

### insights date ranges
> core: Add insights date ranges option to frontend settings
> 添加見解日期範圍選項到前端設定 

付費版本限定😭
可以在 `insight` 切換時間的大小，但 Community 版本只會出現 Lock

{% darrellImage800 n8n-1.91.0-insight_date_range_options n8n-1.91.0-insight_date_range_options.png max-400 %}


### editor 節點用 URL 也能直接開啟

> editor: Include NodeDetailsView in URL
> 在 URL 中包含 NodeDetailsView

以往 n8n 的連結都只能開啟 Workflow
現在新增了一個規則
可以直接用 `/workflow/{workflow_Id}/{node_id}` 來直接開啟節點的編輯畫面

{% darrellImage800 n8n-1.91.0-open_node_editor_with_url n8n-1.91.0-open_node_editor_with_url.png max-400 %}

這點對我來說超級有用，因為最近才做了一個模板是可以列出所有使用 AI Model 的節點列表
現在可以組合成節點的 url 讓使用者直接開啟編輯器來調整

### Prevent webhook url takeover
> 防止 Webhook URL 接管 

最近才在 Threads 跟別人聊到這個話題
如果同一個 webhook url 設定在多個 workflow 中並啟用
以前的測試結果是，最後設定的那個 workflow 才會被觸發

現在 n8n 增加一個檢查
如果新的 workflow 想要啟用，但發現這個 webhook 已經被用過
他就會跳出提示，跟你說已經被使用過，請你調整

{% darrellImage800 n8n-1.91.0-prevent_webhook_url_takeover n8n-1.91.0-prevent_webhook_url_takeover.png max-800 %}


## 1.90.0 Pre-release - 2025-04-22

[Github 1.90.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.90.0)

### core: Add scopes to API Keys
core: 為 API Keys 添加 scopes (但是 Community Edition 無法使用)

{% darrellImage800 n8n-1.90.0-api_scope n8n-1.90.0-api_scope.png max-800 %}


列出所有權限給大家參考
```
- **USER**
  - `user:read`
  - `user:list`
  - `user:create`
  - `user:changeRole`
  - `user:delete`
- **SOURCE CONTROL**
  - `sourceControl:pull`
- **SECURITY AUDIT**
  - `securityAudit:generate`
- **PROJECT**
  - `project:create`
  - `project:update`
  - `project:delete`
  - `project:list`
- **VARIABLE**
  - `variable:create`
  - `variable:delete`
  - `variable:list`
- **TAG**
  - `tag:create`
  - `tag:read`
  - `tag:update`
  - `tag:delete`
  - `tag:list`
- **WORKFLOW TAGS**
  - `workflowTags:update`
  - `workflowTags:list`
- **WORKFLOW**
  - `workflow:create`
  - `workflow:read`
  - `workflow:update`
  - `workflow:delete`
  - `workflow:list`
  - `workflow:move`
  - `workflow:activate`
  - `workflow:deactivate`
- **EXECUTION**
  - `execution:delete`
  - `execution:read`
  - `execution:list`
  - `execution:get`
- **CREDENTIAL**
  - `credential:create`
  - `credential:move`
  - `credential:delete`
```

### editor: Add drag n drop support for folders
編輯器：新增對資料夾的拖放支援

如影片支援，但我還是比較期待**可以批次轉移到資料夾，一個一個拉還是太慢了**

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1077581024?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8n update folder drop and drop"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

### editor: Show logs panel in execution history page
編輯器: 日誌詳細面板
### editor: Log details panel
編輯器: 在執行歷史頁面顯示日誌面板

兩個放在一起說明
現在連執行的歷史紀錄，都會顯示 logs 

{% darrellImage800 n8n-1.90.0-logs_show_for_execution n8n-1.90.0-logs_show_for_execution.png max-800 %}

沒有顯示的話記得要在 localStorage 中把 `N8N_LOGS_2025_SPRING` 設定為 `true`

### HTTP Request Node: Replace HttpRequest Tool with tool version of standalone HttpRequest Node
HTTP Request Node: 取代 HttpRequest Tool 為 standalone HttpRequest Node 的工具版本

新增 HttpRequest Tool 
讓 AI Agent 可以直接調用 Request 請求

{% darrellImage800 n8n-1.90.0-add_request_tool_node n8n-1.90.0-add_request_tool_node.png max-800 %}







## 1.89.0 Pre-release - 2025-04-14

[Github 1.89.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.89.0)

### xAI Grok Chat Model Node: Remove stream_options parameter

Grok3 API 終於在最近開放
但 n8n 最近版本中，會遇到一些 parameter error 的問題
看來這版已經修正！

{% darrellImage800 n8n-1.89.0-xai_grok_fix_parameter n8n-1.89.0-xai_grok_fix_parameter.png max-400 %}

### editor: Add telemetry to Insights

蠻有趣的更新，開始追蹤使用者使用 Insights 的狀況

{% darrellImage800 n8n-1.89.0-track_user_using_insights n8n-1.89.0-track_user_using_insights.png max-400 %}

### editor: Make logs applicable for all nodes

現在 Log 介面中會出現所有的節點
只是好像不會出現節點的詳細資料內容
有點可惜，不確定未來會不會有其他優化

{% darrellImage800 n8n-1.89.0-logs_for_all_node n8n-1.89.0-logs_for_all_node.png max-400 %}

## 1.88.0 Pre-release - 2025-04-10

這是目前看過最快更新的一次
前兩天才出 1.87，馬上就推出了 1.88

而且是重要的一次更新
包含了 MCP 的官方支援

### MCP Server & Client

{% darrellImage800 n8n-1.88.0-mcp_server_client n8n-1.88.0-mcp_server_client.png max-800 %}

**新增 MCP Server 節點**
**新增 MCP Client 節點**

之前其實已經有 MCP 相關的社群節點，
但這次是官方原生支援！

需要注意的事項
官方這次的 MCP 只支援 SSE
Stdio 尚未支援，但市面上大部分的 MCP Server 都是使用 Stdio
這也會讓 n8n 的官方 MCP 節點暫時無法發揮最大潛力
不確定未來是否會支援 Stdio

另外放上 Stdio 和 SSE 的比較

{% darrellImage800 n8n-1.88.0-mcp_sse_vs_stdio n8n-1.88.0-mcp_sse_vs_stdio.png max-800 %}



## 1.87.1 Pre-release - 2025-04-09

### Insights 儀表板功能程式碼實裝

{% darrellImage800 n8n-1.87.1-insights_shows_up n8n-1.87.1-insights_shows_up.png max-800 %}

前幾版更新中一直有提到的 Insights 儀表板
在更新紀錄裡提到已經有相關程式碼
但需要參數才能啟用

在 Github 相關程式碼找尋一番後(AI 沒幫我找到)
最終測試出應該是下列這個變數

```
N8N_ENABLED_MODULES=insights
```

docker 部署的話需要在 docker-compose.yml 中加入
如果你跟我一樣是在使用 Zeabur 部署

那在變數中加上

{% darrellImage800 n8n-1.87.1-enable_insights_in_zeabur n8n-1.87.1-enable_insights_in_zeabur.png max-800 %}

加上就會看到前面第一張圖的分析結果

會有幾個指標 (近七天中)
1. 執行成功的次數
2. 執行失敗的次數
3. 失敗率
4. **節省下的時間**
5. **平均的執行時間**

由於只有在測試的 n8n 環境升級到這個版本，故沒有太多的 run data 可以呈現
特別提一下這兩個指標蠻有意思的

#### Time saved

這不是什麼神奇的 AI 運算
而是需要自己到 workflow 的設定中輸入
預計這個旅程執行一次可以省下多少時間

{% darrellImage800 n8n-1.87.1-workflow_setting_time_saved n8n-1.87.1-workflow_setting_time_saved.png max-800 %}

未來如果有人問你，阿自動化幫你省下多少時間
就不用在那邊自己心算或用感覺
這個指標可以給一個明確的參考數字

#### Run time （avg.）

這指標是指說 workflow 的平均執行時間
如果你的 server 是租借的，而且用 CPU 時間等等來計費
那執行時間就是會關係到你的帳單有多貴

另外也有些人會想要優化自己的 workflow 執行的狀況
例如怎麼樣設計可以讓他更快完成工作
或是讓他更直覺簡單，那就會用這個指標當作參考依據

### Think Tool Node

這是一個連接在 AI Agent 的 Tool 節點
我們知道最近有很多模型開始會有 thinking 的功能
比較像是在開始動手處理前，先思考要怎麼做

而這個 Think Tool 不同
他是在產生答案的時候，再思考自己的答案是否有需要補充的地方

{% darrellImage800 n8n-1.87.1-think_tool n8n-1.87.1-think_tool.jpg max-800 %}

n8n 在更新 Update 上有附 Anthropic 的這份文件[The "think" tool: Enabling Claude to stop and think in complex tool use situations](https://www.anthropic.com/engineering/claude-think-tool)

{% darrellImage800 n8n-1.87.1-think_tool_vs_extend_thinking n8n-1.87.1-think_tool_vs_extend_thinking.png max-400 %}

之後有使用心得會再分享更新在這！


## 1.85.0 Pre-release - 2025-03-25

### 資料夾功能正式釋出!

{% darrellImage800 n8n-1.85.0-folder n8n-1.85.0-folder.png max-400 %}

終於有資料夾功能了，如果是自己部署版本，例如 zeabur
請注意你是否有去啟用 community version 才會出現資料夾的功能

沒有的還可以填入 Email 送出申請，系統會寄一封帶有啟用序號的信給你

{% darrellImage800 n8n-1.85.0-folder_need_registered n8n-1.85.0-folder_need_registered.png max-400 %}

另外對於資料夾功能的介紹有另外寫一篇文章

{% articleCard 
  url="/n8n-new-feature-folders/" 
  title="n8n 資料夾功能介紹" 
  previewText="n8n 的資料夾功能正式釋出，這邊分享如何使用資料夾功能，以及一些使用心得" 
  thumbnail="https://www.darrelltw.com/n8n-new-feature-folders/n8n_folder-bg.jpg" 
%}

### 節省多少時間?

{% darrellImage800 n8n-1.85.0-time_save_per_execution n8n-1.85.0-time_save_per_execution.png max-800 %}

有趣的功能，當你辛辛苦苦把 workflow 做完上線
並且每次大約節省你五分鐘的時候
記得填上這個節省的時間

看來是在未來的報表功能上會顯示 **你總共省下多少時間**

### Editor 顯示變數

{% darrellImage800 n8n-1.85.0-var_in_context n8n-1.85.0-var_in_context.png max-400 %}

這也很方便!
現在可以直接在 Editor 看到變數的 value 是多少，想用的時候可以直接參考
以前都要先放在 expression 中再來猜它是什麼

### 新增 xAI Grok Chat Model

{% darrellImage800 n8n-1.85.0-var_in_context n8n-1.85.0-var_in_context.png max-400 %}

終於可以好好利用馬斯克送的 API 點數了
AI 節點可以使用另一個 model 總是比較方便


### sendAndWait 節點增加 appendN8nAttribution 選項

{% darrellImage800 n8n-1.85.0-send_and_wait_append_n8n n8n-1.85.0-send_and_wait_append_n8n.png max-400 %}

在 sendAndWait 節點中，可以勾選要不要顯示 "This message was sent automatically with n8n"

有時候多這一行覺得蠻冗的


### 新增 command 可以移除 community node

從文件上來看，是指說可以用 n8n command 來移除 community node

n8n command 很強大，未來可以多做介紹

{% darrellImage800 n8n-1.85.0-delete_community_node_in_command_line n8n-1.85.0-delete_community_node_in_command_line.png max-400 %}


### Insight 測試中

```
core: Implement API to retrieve summary metrics (#13927) (b616ceb)
核心：實作 API 以檢索摘要指標（#13927）（b616ceb）
editor: Insights summary banner (#13424) (df474f3)
編輯：Insights 摘要橫幅 (#13424) (df474f3)
```

從這些更新 log 中，看來 n8n 後續就會有 insight 的功能 
可以當作是 n8n 的儀表板，檢視整體的運作狀況!


## 1.84.1 release

## 1.84.0 


### MongoDB Atlas Vector Store Node

新增了 MongoDB 向量資料庫節點

### 日誌視窗彈出功能

現在可以將日誌視窗彈出到獨立視窗中檢視，方便在處理複雜工作流程時同時監控運行情況
   {% darrellImage800 n8n-1.84.0-log_popup n8n-1.84.0-log_popup.png max-800 %}

### Merge Node 增強

在 combineBySql 操作中，如果使用 SELECT 查詢，現在有更好的 pairedItem 映射功能，讓資料合併更精準

### WhatsApp Trigger Node 更新

新增可選擇退出訊息狀態更新的選項，讓使用者有更多控制權
   {% darrellImage800 n8n-1.84.0-whatsapp n8n-1.84.0-whatsapp.png max-800 %}

[完整更新內容 github_n8n@1.84.0](https://github.com/n8n-io/n8n/releases)

## 1.83.2 

目前正式版已經更新到 1.83.2

## 1.83.1 

### Bug Fix 居多

1. Pin Data 後會出現 Unpin 的 button，原本沒有

{% darrellImage800 n8n-1.83.0-unpin n8n-1.83.0-unpin.png max-400 %}

2. Error view 現在可以完整寬度檢視
3. 貼上 `=test1234` 後會維持 `=test1234`，原本會因為判定成 expression 所以變成 test1234

{% darrellImage800 n8n-1.83.0-equals n8n-1.83.0-equals.png max-400 %}

4. 有些狀況 (沒 focus 到，Expression 全螢幕修改時) 用 ctrl+s 無法存檔，已調整優化

{% darrellImage800 n8n-1.83.0-save n8n-1.83.0-save.png max-400 %}

[github_n8n@1.83.0](https://github.com/n8n-io/n8n/releases)

## 1.82.2 

目前正式版已經更新到 1.82.2

## 1.82.0 

一些重要的新功能分享
但必須先說 **資料夾功能還沒下放**

### New Node: Azure Storage

{% darrellImage800 n8n-1.82.0-azure_storage.png n8n-1.82.0-azure_storage.png max-400 %}

### Workflow 自動對齊整理功能

現在有了自動對齊整理 canvas 的功能
叫做 Tidy

這是一個在各種自動化旅程 canvas 中都會有的功能
好不好用見仁見智!
一旦旅程變得複雜，有時候整理過後不見得是你要的長相

{% darrellVideoSimple n8n-1.82.0-tidy n8n-1.82.0-tidy.webm max-800 %}

### Node 編輯後變色提醒

n8n-1.82.0-node_modity

{% darrellImage800 n8n-1.82.0-node_modity n8n-1.82.0-node_modity.png max-800 %}

執行過沒問題的節點會顯示綠色
但要是後面去修改該節點，他就會以黃色警告的方式呈現
讓你可以辨別哪些節點被修改過，可以觀察有沒有錯誤產生

### 自動切換 Expression 語法

{% darrellImage800 n8n-1.82.0-chnage_to_expression_automatically.png n8n-1.82.0-chnage_to_expression_automatically.png max-800 %}

之前分享過 `=` 可以切換成 Expression
但要是貼上 `{{ $now }}` 這種語法並不會自動切換
在這個版本加上了這個功能!

## 1.81.4 Release

2025/03/03 正式把最新發布版本更新為 1.81.4

除了涵蓋 1.81.0 的新功能外
更多的是一些調整修復

### Fix

- 1.81.4
core: Do not validate email when LDAP is enabled
- 1.81.3
core: Gracefully handle missing tasks metadata 
n8n Form Trigger Node: Sanitize HTML for formNode
- 1.81.2 
editor: Add workflows to the store when fetching current page 
editor: Undo keybinding changes related to window focus/blur events
Postgres Node: Accommodate null values in query parameters for expressions

## 1.81.0 

[Github 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.81.0)

### 資料夾功能內部測試

這是本次更新最期待的項目了
由於目前的 workflows 已經非常多
性質跟分類也不同，就算有 tags 還是很雜亂

之前 n8n 官方就有提到會有 Folder 功能
沒想到蠻快就出現內測，而且如果會公布出來
就代表放出來給大家測試的時程應該也不遠

這邊先放示意圖!

{% darrellImage800 n8n_update-n8n_folder_preview n8n_update-n8n_folder_preview.png max-800 %}

### 節點快速重新命名

{% darrellVideoSimple n8n-1.81.0-rename n8n-1.81.0-rename.webm max-800 %}

如果需要命名節點，現在有個新的快捷鍵

點擊 Node 後按下空白鍵，就能直接更改節點名稱

### 節點自動連線

{% darrellVideoSimple n8n-1.81.0-autolink n8n-1.81.0-autolink.webm max-800 %}

舉個簡單的例子

A ---> B ---> C

現在把 B 刪除了
會自動連線成

A ---> C

算是大部分使用上會比較方便的版本

