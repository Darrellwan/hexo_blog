---
title: n8n 版本更新紀錄心得
tags:
  - n8n
  - update_log
categories:
  - n8n
page_type: post
id: n8n-update-log
description: n8n 的更新記錄(2025/04/29更新)，包含各版本新功能、改進和修復，和我測試的心得回饋。最新測試版本為 1.91.0，正式版本為 1.89.2
bgImage: n8n-update_bg.jpg
preload:
  - n8n-update_bg.jpg
date: 2025-02-27 12:15:12
modified: 2025-05-13 11:01:15
---

{% darrellImageCover n8n-update_bg n8n-update_bg.jpg %}

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

之前因為沒辦法在 OpneAI 選擇 gpt-image-1 模型
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
如果你跟我一樣是在是使用 Zeabur 部署

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
他是在產生答案的時候，再思考自已的答案是否有需要補充的地方

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

現在有了自動對齊整理 canva 的功能
叫做 Tidy

這是一個在各種自動化旅程 canva 中都會有的功能
好不好用見仁見智!
一但旅程變得複雜，有時候整理過後不見得是你要的長相

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


