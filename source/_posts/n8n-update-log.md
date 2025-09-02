---
title: n8n 版本更新紀錄心得
tags:
  - n8n
  - update_log
categories:
  - n8n
page_type: post
id: n8n-update-log
description: n8n 的更新記錄(2025/09/02 更新)，包含各版本新功能、改進和修復，和我測試的心得回饋。最新測試版本為 1.110.0，正式版本為 1.109.1
bgImage: n8n-update_bg.jpg
preload:
  - n8n-update_bg.jpg
date: 2025-02-27 12:15:12
modified: 2025-09-02 12:10:00
sticky: 100
---

{% darrellImageCover n8n-update_bg n8n-update_bg.jpg %}

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


