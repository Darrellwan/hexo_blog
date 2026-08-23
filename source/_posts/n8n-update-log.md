---
title: n8n 版本更新紀錄心得
tags:
  - n8n
  - update_log
categories:
  - n8n
page_type: post
id: n8n-update-log
description: n8n 的更新記錄（2026/08/19 更新），包含各版本新功能、改進和修復，和我測試的心得回饋。最新測試版本為 2.36.0（Pre-release），正式版本為 2.35.4
bgImage: n8n-update_bg.jpg
date: 2025-02-27 12:15:12
updated: 2026-08-19 23:20:00
sticky: 100
---

{% darrellImageCover n8n-update_bg n8n-update_bg.jpg %}

{% callout type="info" title="歷史版本快速索引" %}
本篇收錄 **n8n 2.x 最新版本更新紀錄**。  
若要查詢 **n8n 0.x ~ 1.x 歷史版本紀錄與節點演進**，請前往：[n8n 1.0 歷史版本更新紀錄存檔](/n8n-update-log-v1/)。
{% endcallout %}

## 2.36.0 Pre-release - 2026-08-18

[Github 2.36.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.36.0)

### OpenRouter 可以指定要用哪一家供應商了
feat(lmChatOpenRouter Node): Add provider routing options

OpenRouter 是個中間商
你選一個模型，背後常常有好幾家供應商在跑，價格、速度、會不會拿你的資料去訓練，每個 provider 狀況都不太一樣

以前 n8n 的 OpenRouter 節點只能選模型，選不了背後的 Provider
幫你配到哪家就用那一家

這版在 Options 底下多了一組 **Provider Routing**，展開有八個欄位：

{% dataTable style="minimal" align="left" %}
[
  {"欄位": "Order", "作用": "指定優先順序，填供應商代號用逗號隔開，例如 anthropic,openai,google"},
  {"欄位": "Only", "作用": "白名單，只准這幾家跑"},
  {"欄位": "Ignore", "作用": "黑名單，這幾家跳過"},
  {"欄位": "Sort", "作用": "按 Price、Throughput 或 Latency 排序"},
  {"欄位": "Allow Fallbacks", "作用": "首選掛掉時要不要自動換備援，預設開"},
  {"欄位": "Require Parameters", "作用": "只用支援你這次請求全部參數的供應商"},
  {"欄位": "Data Collection", "作用": "選 Deny 就只走不收集你資料的供應商"},
  {"欄位": "Zero Data Retention (ZDR)", "作用": "更嚴格，只走完全不留紀錄的端點"}
]
{% enddataTable %}

{% darrellImage800Alt "n8n 2.36.0 的 OpenRouter Chat Model 節點，Options 加入 Provider Routing 後展開子選項清單，依序是 Order、Allow Fallbacks、Require Parameters、Data Collection、Zero Data Retention (ZDR)、Only、Ignore、Sort" n8n-2.36.0-openrouter_provider_routing.png max-800 %}

會用到的大概是這幾種情況：

- 資料不想要外流 → 開 **Zero Data Retention**，或把 Data Collection 設成 Deny
- 想降低成本 → **Sort** 選 Price
- 想要回應速度快 → **Sort** 選 Latency
- 單純討厭某一家 → 把它丟進 **Ignore**

### 錯過的排程，可以決定要不要補跑
feat(Schedule Trigger Node): Add "If Execution Is Missed" option

自架 n8n 一定會遇到這種事
更新版本、重開機、或是機器半夜掛掉
這段時間該跑的排程就不會跑了，隔天才發現然後要自己補跑

新版多了節點設定，開節點的 **Settings** 分頁就有「If Execution Is Missed」，三個選項：

{% dataTable style="minimal" align="left" %}
[
  {"選項": "Don't Run Missed Executions", "行為": "錯過就算了，不補跑（預設值）"},
  {"選項": "Run the Most Recent Missed Execution", "行為": "整個節點只補跑一次，跑最後錯過的那一輪"},
  {"選項": "Run the Most Recent Missed Execution Per Rule", "行為": "每條規則各自補跑一次"}
]
{% enddataTable %}

{% darrellImage800Alt "n8n 2.36.0 Schedule Trigger 節點的 Settings 分頁，If Execution Is Missed 下拉展開顯示三個選項，底下是 Missed Execution Grace Period (Seconds) 欄位，面板最下方標示 Schedule Trigger node version 1.4 (Latest)" n8n-2.36.0-schedule_missed_execution.png max-800 %}

{% callout type="warning" title="兩個前提，不知道的話會設了半天沒反應" %}
**一、要開 durable scheduler 環境變數，它預設是關的。**
這兩個欄位只對「資料庫排程」生效，也就是把接下來要跑的排程先寫進資料庫，重啟不會掉、多台機器也不會重複跑。要開的話環境變數加這兩個：

```
N8N_SCHEDULER_ENABLED=true
N8N_USE_WORKFLOW_PUBLICATION_SERVICE=true
```

**二、舊的 Schedule Trigger 節點看不到這兩個欄位。** 它綁在節點版本 1.4，只有這版之後新加的節點才會出現。手上已經在跑的排程要用，得刪掉重新加一個。
{% endcallout %}

### Discord 節點可以踢人、禁言、Ban 了
feat(Discord Node): Add member moderation actions

以前 Discord 節點對成員只能做三件事：**列出成員、加角色、移除角色**
想自動處理洗版帳號，得自己接 HTTP Request 打 Discord API，參數還要翻文件自己湊

這版 member 資源一次補四個操作上去，變成七個：

{% dataTable style="minimal" align="left" %}
[
  {"操作": "Ban", "做什麼": "封鎖成員，可以順便清掉他最近的訊息"},
  {"操作": "Unban", "做什麼": "解除封鎖"},
  {"操作": "Kick", "做什麼": "把人踢出伺服器（他還能再加回來）"},
  {"操作": "Timeout", "做什麼": "暫時禁言，時間到自動解除"},
  {"操作": "Get Many", "做什麼": "列出成員（舊有）"},
  {"操作": "Role Add", "做什麼": "加角色（舊有）"},
  {"操作": "Role Remove", "做什麼": "移除角色（舊有）"}
]
{% enddataTable %}

{% darrellImage800Alt "n8n 2.36.0 節點面板中 Discord 的動作清單，搜尋 member 後顯示 7 個動作：Ban a member、Kick a member、Timeout a member、Get many members、Unban a member、Remove a role from a member、Add a role to a member" n8n-2.36.0-discord_member_actions.png max-800 %}

不過這些操作只在 Connection Type 選 Bot Token 或 OAuth2 時才看得到
用 Webhook 那種連法沒有，畢竟 Webhook 本來就只能發訊息

四個新操作都有 **Reason** 欄位，而且是下拉選單，不用自己輸入
預設就三個：可疑或垃圾帳號、帳號被盜、違反伺服器規則，選 Other 才會跳出讓你自己輸入
填的內容會寫進 Discord 伺服器的稽核紀錄，之後回頭查誰被處理過就有東西可以對

Ban 另外有個 **Delete Message History**，封鎖的同時把這個人最近的訊息一起清掉
從「不清除」到「前 7 天」共七段：

{% darrellImage800Alt "n8n 2.36.0 Discord 節點 Ban 操作的設定畫面，Resource 為 Member、Operation 為 Ban，Delete Message History 下拉展開顯示 No Cleanup、Previous Hour、Previous 6 Hours、Previous 12 Hours、Previous 24 Hours、Previous 3 Days、Previous 7 Days" n8n-2.36.0-discord_ban_cleanup.png max-800 %}

如此一來就能做到 Discord 全自動社群管理
不像在 Line 上常常遇到詐騙帳號跟訊息，卻還是只能讓管理員手動處理

## 2.35.0 Pre-release - 2026-08-11

[Github 2.35.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.35.0)

n8n Agents 持續更新中，新增 Discord 可以當做介面使用(目前也支援 Slack, Linear, Telegram)

### AI Assistant 開始開放給社群版！
feat: Add self-hosted AI Assistant onboarding

以前 AI Assistant 都只有 Cloud 或是官方版本才能使用
現在終於下放給 Community 社群版本使用
也就是說
**大家都可以直接在 n8n 介面請 AI 幫忙你設定節點啦！**

2.35.0 會有一個設定精靈引導你設定
環境變數加上 `N8N_ENABLED_MODULES=instance-ai`
開 `/assistant`，會先看到這個畫面

{% darrellImage800Alt "n8n 自架版 AI Assistant 入口畫面，標示 Preview，列出建立編輯 workflow、除錯失敗執行、詢問 n8n 問題三項能力，下方有 Set up 按鈕" n8n-2.35.0-assistant-setup.png max-800 %}

按 Set up 進去總共三步：接模型、接 code sandbox、選配網頁搜尋
每一步都會即時打一次驗證，設定沒走完之前，一般成員看不到這個功能

不過驗證這關要先提醒一下，模型選 OpenAI 的話**現在一定過不了**
不是你的 key 有問題，是 n8n 送出去的那個測試請求參數不合法，換幾把 key、換哪個型號都一樣
可以直接用環境變數設模型跳過驗證
這是我在 2.35.0 實測的狀況，之後版本應該就會修掉
完整的原因和繞法我會另外寫一篇分享

第一步的說明寫得很直白：**The Assistant runs on a model you pay for directly**
你的 prompt、workflow，還有它讀到的執行資料，都是用 API 的方式跟 AI 溝通
要注意選的模型能力如何，但也要注意價格是否會太貴

支援的模型清單也蠻完整的，可以參考截圖

{% darrellImage800Alt "AI Assistant 的 Connect a model 步驟，Provider 選 OpenAI，Model 下拉展開顯示 GPT-5.6 Sol Recommended 排第一，往下依序是 Terra、5.6、Luna、5.5、5.5 Pro、5.4 mini、5.4 nano" n8n-2.35.0-assistant-model-list.png max-800 %}

注意 Recommended 的模型都很聰明，但都非常昂貴
如果不是公司願意補助 API 的話勁量不要使用
個人嘗試可以先用 gpt-5.6-lunar 試試看

### n8n Agents 更新

n8n Agents 現在自架社群版也能設定，環境變數加上 `N8N_ENABLED_MODULES=agents`

接進 workflow 之後長這樣，一個全新節點就把模型、工具和 skill 全包起來：

{% darrellImage800Alt "n8n 畫布上三個節點：LINE Messaging Trigger 接到 n8n Agent 測試機節點（內含 GPT-5.6 Luna、Get current datetime 工具、n8n-agent-能力說明 skill），再接到 Line Messaging reply，全部顯示執行成功" n8n-2.35.0-agent-line-workflow.png max-800 %}

從 LINE、Telegram、Slack 丟訊息進去，它會自己判斷要不要用工具，再從同一條線回話：

{% darrellImage800Alt "LINE 對話畫面，使用者問你能幫我改 n8n 的 workflow 嗎，agent 回覆分兩種情況說明自己能做和不能做的事" n8n-2.35.0-agent-line-reply.png max-800 %}

這版跟 Agents 有關的更新很多，我挑三個看得到的

#### 新增 Discord 當作 Channel
（feat: Add Discord as an agent chat channel）

升級前的 Channels 只有這些

{% darrellImage800Alt "2.34.0 的 Channels 彈窗，只有 Slack、Telegram、Linear 三個選項，Telegram 顯示 Connected" n8n-2.35.0-agent-channels-before.png max-800 %}

升上 2.35.0 之後多了 Discord

{% darrellImage800Alt "2.35.0 的 Channels 彈窗，Slack、Telegram、Linear 之外多了 Discord，各自有 Connect 按鈕" n8n-2.35.0-agent-channels-after.png max-800 %}

#### Instructions 欄位新增 Markdown 工具列
feat(editor): Add more Markdown editor toolbar options）

以前寫 agent 的 Instructions 只能靠 Markdown 語法自己貼
這版工具列補上底線、引用、程式碼區塊、清單、待辦清單和連結編輯
寬度不夠時可以橫向移動

雖然大部分的 Instructions 我們已經很少手動編輯了
但讓 AI 產生的 Markdown 語法貼在這也能至少有個好看的排版
自己想要微調也不會那麽痛苦

{% darrellImage800Alt "Agent 編輯畫面的 Instructions 欄位，上方 Markdown 工具列有標題、粗體、斜體、刪除線、底線、引用、程式碼區塊、連結、有序清單、項目清單、待辦清單、復原、重做等按鈕" n8n-2.35.0-agent-markdown-toolbar.png max-800 %}

#### token 用量計算更精準
（feat(core): Add local agent token counting）

以前是拿字元數去估 token，這版改成在本機用 tiktoken 實算
OpenAI 的模型走 `o200k_base`，其他供應商走 `cl100k_base`
從估算變成現在有更精準的算法！

Sessions 列表可以直接看到每一輪消耗多少：

{% darrellImage800Alt "Agent 的 Sessions 分頁，一筆 Telegram 來源的對話紀錄顯示時間 Aug 11 17:31:10、token 數 10,830t、耗時 14.8s" n8n-2.35.0-agent-sessions-token.png max-800 %}

工具回傳值太多時的截斷門檻也會靠這個預估的 Token 攔截（50,000 token）

### AI Agent 節點：工具還沒跑，模型的碎話就先黏進答案
fix(AI Agent Node): Stop pre-tool-call text leaking into agent responses

AI Agent 要用工具時，n8n 其實會跟模型講兩次話
第一次問「這件事你要怎麼做」，模型回「我要用計算機」；第二次把計算機算出來的答案送回去，讓模型組一句給人看的回話

問題出在第一次。有些模型除了說「我要用計算機」，還會順便多講一句心裡話
那句話只是它的過程，不該給使用者看到，但舊版會把它直接黏在最後答案的前面，中間連空格都沒有

回報者實際看到的畫面是這樣：

```
Room 1101Work order created successfully!
```

`Room 1101` 是模型的碎念，`Work order created successfully!` 才是真正的結果，兩句擠成一團

測試時 prompt 寫
```
先用一句話說出你接下來要做什麼，然後一定要呼叫 Calculator 算出 1234 * 5678
```
用 **gpt-5.6-luna** 當作模型時會看到以下的輸出同時包含這兩種：

{% dataTable style="minimal" align="left" %}
[
  {"第一次 call": "文字", "內容": "我接下來會計算 1234 × 5678。"},
  {"第一次 call": "工具呼叫", "內容": "Calculator，參數 1234 * 5678"},
  {"第一次 call": "第二次呼叫的產出", "內容": "7006652"}
]
{% enddataTable %}

AI Agent 節點最終輸出只有 `7006652`，那句「我接下來會計算 1234 × 5678。」沒有被附上
以前舊版的話就會全部輸出： `我接下來會計算 1234 × 5678。7006652`

所以會不會踩到這個 bug，跟選用哪一種模型有關
PR 的兩個回報者用的是 Claude Sonnet 4.5 和 Qwen，都是比較會邊講邊做的模型

### Merge 節點搜 append、combine 可以被找到
feat(Merge Node): Add "Append" and "Combine" search aliases

Append & Combined 是大家用 Merge 時裡面的選項
有些人可能很習慣知道自己要 `append` 但搜尋 `append` 會說沒這個節點
一定要去找 `Merge` 才可以

現在直接搜尋 `appedn` 也會出現，直覺很多！

{% darrellImage800Alt "n8n 節點面板搜尋 append，Merge 節點出現在第一個，說明文字為 Merges data of multiple streams once data from both is available" n8n-2.35.0-merge-search-append.png max-800 %}

### MCP server 節點：換新版協定，回傳也可以只拿要用的
feat(core): Support the MCP 2026-07-28 discovery handshake on the instance server

把 Claude Code 或 Cursor 接上自己的 n8n，走的就是 n8n 內建的 MCP server
連線時會跳出這張同意畫面，可以選 All、Read only 或自己挑 scope：

{% darrellImage800Alt "n8n 的 MCP 授權畫面，標題為 Claude Code 要求存取你的 n8n instance，Scopes 可選 All、Read only、Custom，顯示 11 of 11 scopes selected，下方要求確認回呼網址可信任" n8n-2.35.0-mcp-oauth-consent.png max-800 %}

這版跟上 MCP 新版協定，改成 stateless
拿掉了連線時的握手，client 改成每次請求都把自己的協定版本和身分塞在 `params._meta` 裡
舊版 client 還是認得出來，不用急著調整

另一個是 `get_workflow_details` 多了 detailLevel 參數，可以填 full 或 execution，這個才是省 token 的

最有感的是「先查再跑」這種流程：
AI 只是想執行你的某個 workflow，得先查一下 trigger 是什麼、要餵什麼參數
這樣會把整個 workflow json 都塞到 context 裡面

現在填 execution 就只拿執行需要的資料
整個 json payload 大小差很多
兩種模式差在哪一張表看完：

{% dataTable style="minimal" align="l,c,c" %}
[
  {"回傳的內容": "名稱、ID、是否啟用", "execution": "✅", "full（預設）": "✅"},
  {"回傳的內容": "節點數量、trigger 數量", "execution": "✅", "full（預設）": "✅"},
  {"回傳的內容": "tag、所在資料夾、你的權限", "execution": "✅", "full（預設）": "✅"},
  {"回傳的內容": "怎麼觸發它（webhook 網址、要帶什麼認證）", "execution": "✅", "full（預設）": "✅"},
  {"回傳的內容": "nodes：每個節點的完整設定", "execution": "❌", "full（預設）": "✅"},
  {"回傳的內容": "connections：節點之間怎麼接", "execution": "❌", "full（預設）": "✅"},
  {"回傳的內容": "nodeGroups：畫布上的節點群組", "execution": "❌", "full（預設）": "✅"},
  {"回傳的內容": "activeVersion + meta：已發布版本的內容和中繼資料", "execution": "❌", "full（預設）": "✅"}
]
{% enddataTable %}

關鍵是 execution 沒有拿掉「怎麼觸發它」，AI 還是知道要餵什麼進去，只是不用再吞整張圖
n8n 在程式碼註解裡也寫得很直接：回應大小主要就是被 nodes 和 connections 撐起來的，只是要執行的話跳過就好



## 2.34.0 Pre-release - 2026-08-04

[Github 2.34.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.34.0)

這版我挑了三個更新

HTTP 自訂認證憑證是最有感的，以前要自己手打 JSON，現在變成填表單
OpenAI 節點多了 Extra Body，串第三方相容模型終於能傳自家參數
排程「每 N 分鐘」則是修掉一個很多人踩到、但幾乎不會發現的坑

### HTTP 自訂認證從手打 JSON 變成填表單
feat(HTTP Request Node): Add Simplified Custom Auth generic credential

要串一個 n8n 沒有內建節點的 API，通常會卡在認證這關

以前 Generic Credential Type 就 Basic Auth、Header Auth、Query Auth 那幾種
遇到「header 要帶 `Authorization: Bearer xxx`、query 還要再補一個版本號」這種組合，只能自己想辦法拼

2.34.0 新增 **Simplified Custom Auth**
做法是先寫一段 JSON 範本，會變動的地方用 `{{ }}` 標起來：

```json
{"headers":{"Authorization":"Bearer {{apiKey}}"}}
```

n8n 會掃這段範本，每個 `{{ }}` 自動變成下面 Fields 區的一張欄位卡片
Label 會自動帶（`apiKey` 變成 Api Key），還能自己補 Hint、選要不要當密碼遮起來：

{% darrellImage800Alt "Simplified Custom Auth 的 Edit setup 畫面，Auth template 填入 JSON 範本後，Fields 區自動長出 apiKey 的欄位卡片，可設定 Label、Hint 和 Secret" n8n-2.34.0-custom-auth-template.png max-800 %}

範本設定完收起來，畫面就只剩下要填的那格

我把 Test URL 指到 postman-echo，填一個假 token 存檔
n8n 會拿這組憑證去打一次真實請求，回來顯示 **The service accepted the credential**：

{% darrellImage800Alt "Simplified Custom Auth 存檔後顯示綠色橫幅 The service accepted the credential，Api Key 欄位以圓點遮罩" n8n-2.34.0-custom-auth-result.png max-800 %}

這句話寫得蠻精準
它只說「服務接受了」，沒說「驗證通過」，因為有些 API 就算 token 是錯的也照樣回 200

以前建這種憑證沒有測試按鈕，打錯字要等 workflow 跑起來才知道
現在存檔當下就知道，省事很多

### OpenAI 節點可以傳自訂參數了
feat(OpenAI Chat Model Node): Add optional extraBody option

現在很多模型服務都說自己相容 OpenAI 格式，像 Qwen、vLLM、LM Studio
但這些服務常常多幾個 OpenAI 官方沒有的參數，例如 Qwen 的 `enable_thinking`

以前 n8n 的 OpenAI Chat Model 節點只認官方那組參數
想多傳一個就沒地方放，只能放棄這個節點，改用 HTTP Request 自己組請求

2.34.0 在 Options 裡加了 **Extra Body**
填一段 JSON 進去，就會跟著 chat completion 請求一起送出：

{% darrellImage800Alt "OpenAI Chat Model 節點的 Options 新增 Extra Body 欄位，填入 enable_thinking 和 top_k 的 JSON" n8n-2.34.0-openai-extra-body.png max-800 %}

我在 2.34.0 確認了這個選項存在、也能正常存進 JSON
但參數是不是真的送到對方 API，要架一台相容服務看它收到什麼才算數，這段我沒測
PR 裡作者有附 LM Studio 的 debug log，參數確實出現在請求 body

如果你在用 LM Studio 或其他 OpenAI 相容服務，這個更新可以省掉一整個 HTTP Request 節點

### 排程設「每 50 分鐘」，以前根本不是每 50 分鐘
fix(Schedule Node): Run non-dividing minute intervals by elapsed time

這個是這版最容易踩到、又最不容易發現的

Schedule Trigger 選 Minutes 填一個數字，看起來就是「每隔這麼多分鐘跑一次」
但只要那個數字沒辦法整除 60，實際行為跟你想的不一樣

舊版是把它翻成 cron 的「分鐘數能被 50 整除」，所以一小時內只會在 :00 和 :50 觸發：

{% dataTable style="minimal" align="left" %}
[
  {"版本": "舊版", "觸發時間": "12:00 → 12:50", "實際間隔": "50 分鐘"},
  {"版本": "舊版", "觸發時間": "12:50 → 13:00", "實際間隔": "10 分鐘"},
  {"版本": "2.34.0", "觸發時間": "12:50 → 13:40 → 14:30", "實際間隔": "每次都是 50 分鐘"}
]
{% enddataTable %}

設定畫面完全沒變，一樣是填一個數字：

{% darrellImage800Alt "Schedule Trigger 的 Trigger Interval 選 Minutes、Minutes Between Triggers 填 50，畫面與舊版相同" n8n-2.34.0-schedule-minutes.png max-800 %}

改的是底層算法，從「看時鐘的分鐘數」改成「算實際過了幾分鐘」

填 15、30 這種能整除 60 的不受影響，行為跟以前一樣
會受影響的是 7、45、50 這種除不盡的數字

{% callout type="warning" title="這項我沒有等滿一輪實測" %}
上面的觸發序列是從 PR 附的測試檔（`ScheduleTrigger.node.test.ts`）來的，裡面直接寫死了 50 分鐘的預期觸發時間

要在自己的環境確認，等待成本太高，我這次只驗證了設定畫面沒有變動
{% endcallout %}

如果你手上有排程填的是這種數字，值得去 Executions 對一下實際時間

## 2.33.0 Pre-release - 2026-07-28

[Github 2.33.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.33.0)

這版我最後挑了三個更新

HTTP Request 的改動最實用，發生錯誤後終於拿得到 API 真正回傳的內容，debug 會省事很多
OAuth 自訂權限比較偏公司使用，Package export 自動帶入子工作流則更進階，而且目前還是 Beta

### HTTP Request 發生錯誤後也會保留 API 回傳內容
fix(HTTP Request Node): Include error body in continueOnFail mode

以前把 HTTP Request 的 **On Error** 設成 **Continue**
workflow 是會繼續跑，但 API 到底回了什麼，不太好直接交給後面的節點處理

debug 時還得從一長串錯誤訊息裡面找 response body，蠻麻煩的

2.33.0 的 HTTP Request node version 4.5 多了一個 `details`
錯誤的 status code、response body，還有目前跑到哪一筆 item 都會保留下來

我實際呼叫 DummyJSON 的 [HTTP 422 測試端點](https://dummyjson.com/http/422/Validation%20failed%3A%20email%20is%20required)
故意讓 API 回傳 `Validation failed: email is required`，再把 **On Error** 設成 **Continue**

結果節點成功輸出 1 item
`details.httpCode` 是 `422`，`details.body` 也完整留下 `status`、`title`、`type`、`detail` 和 `message`：

{% darrellImage800Alt "HTTP Request 節點將 On Error 設為 Continue，收到 HTTP 422 後仍輸出 1 item，details.body 完整保留 API 回傳的錯誤內容" n8n-2.33.0-http-request-error-body.png max-800 %}

這個更新我覺得蠻實用
後面的節點可以直接用 `{{$json.details.body.message}}` 讀錯誤原因，或用 `{{$json.details.httpCode}}` 判斷狀態碼

要重試、發通知或走其他分支都方便很多

### Google 和 Microsoft OAuth 可以自訂權限範圍
feat(credentials): Add support for custom Google and Microsoft OAuth scopes

以前使用 Google 或 Microsoft 的 OAuth credential
n8n 會直接帶入節點預設需要的整組權限

如果公司會逐項審核 OAuth 權限，之前很難直接在 credential 畫面裡面調整

2.33.0 新增 **Custom Scopes**
開啟後就能修改 **Enabled Scopes**，刪掉不需要的權限，或補上公司要求的額外 scope

這次涵蓋的 credential 有：

- **Google 共 19 種**：Gmail、Google Workspace Admin、Google Ads、Google Analytics、Google Books、Google Business Profile、Google Chat、Google Cloud Natural Language、Google Contacts、Google Docs、Google Drive、Google Firebase Cloud Firestore、Google Firebase Realtime Database、Google Perspective、Google Sheets Trigger、Google Slides、Google Tasks、Google Translate、YouTube
- **Microsoft 共 4 種**：Azure Monitor、Dynamics、Graph Security、Azure Storage

Google 這邊我先用 Gmail OAuth2 credential 測試
開啟 Custom Scopes 後，原本需要的 Gmail scopes 已經先填進 Enabled Scopes

這點蠻重要，不然每個 scope 都要自己從空白開始查，真的蠻麻煩的

{% darrellImage800Alt "Gmail OAuth2 credential 開啟 Custom Scopes，畫面顯示修改權限可能讓節點無法運作的警告，Enabled Scopes 已預填 Gmail 權限" n8n-2.33.0-google-custom-scopes.png max-800 %}

Microsoft 這邊我另外打開 **Microsoft Azure Monitor OAuth2 API** 實測
Enabled Scopes 預設是 `{resource}/.default`

`{resource}` 會帶入上方選擇的 Resource，例如截圖中的 Azure Log Analytics：

{% darrellImage800Alt "Microsoft Azure Monitor OAuth2 credential 開啟 Custom Scopes，警告說明 resource placeholder，Enabled Scopes 顯示 resource/.default" n8n-2.33.0-microsoft-custom-scopes.png max-800 %}

如果公司有最小權限原則，或 Microsoft Entra 管理員會逐項審核 scope，這個功能就蠻有用的

我的建議是先保留預設值
真的需要縮小權限時，再確認 API 需要哪些 scope，刪太多會讓節點直接報錯

### Package export 可以自動帶入子工作流
feat(cli): Automatically include sub-workflows in package export

Package export 可以把 workflow 和依賴的資源包成 `.n8np` 檔案
搬到另一個 n8n 環境時，可以把相關資源一起帶走

以前主 workflow 只要有用 **Execute Sub-workflow** 呼叫其他 workflow
漏匯出其中一個，通常都是匯入後才發現流程少了一塊

2.33.0 新增 `include-in-package` 處理方式
用 CLI 匯出時，n8n 會去找主 workflow 指定的子工作流，一起放進同一個 package：

```bash
n8n-cli package export \
  --workflow-id=<workflow-id> \
  --output=workflow.n8np \
  --missing-workflow-dependency-policy=include-in-package
```

如果子工作流又呼叫下一層，n8n 也會繼續往下找
遇到循環呼叫則不會一直重複打包

{% callout type="warning" title="目前仍是 Beta，而且沒有操作畫面" %}
這項功能走 n8n CLI，不是在 editor 裡按一個匯出按鈕

我原本想直接跑一次，但測試用的 2.33.0 Docker 映像裡沒有另外安裝 `@n8n/cli`
執行 `n8n-cli` 只會得到 `executable file not found in $PATH`

目前比較適合已經在使用 Package CLI 的進階使用者，不建議為了這一項就直接改正式環境的匯出流程
{% endcallout %}

還有一個限制
這個功能只能追蹤 workflow 設定裡面已經寫好 ID 的子工作流

如果 workflow ID 是執行時才由 expression 決定，匯出工具沒辦法預先知道要帶哪一個
這種情況還是要自己檢查 package 內容

## 2.31.0 Pre-release - 2026-07-14

[Github 2.31.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.31.0)

### Notion 節點改用 API v3，Database 和 Data Source 分開
feat(Notion Node): Migrate to new API and overhaul the node

Notion 這次不是單純把 API 版本號往前升，而是把原本的 Database 資料模型拆得更清楚。

以前在 n8n 裡選一個 Database，就可以直接用 Database ID 查詢裡面的頁面。
新版的 Notion API 把 Database 當成 container
真正用來描述欄位、內容和查詢的部分，改由 **Data Source** 負責。

簡單看差異：

{% dataTable style="minimal" align="left" %}
[
  {"以前的做法": "Database Search / Get Many", "Notion v3": "Data Source Search / Get"},
  {"以前的做法": "使用 database_id 查詢頁面", "Notion v3": "使用 data_source_id 查詢 Database Page"},
  {"以前的做法": "Block append 使用 after", "Notion v3": "改用 position.after_block"},
  {"以前的做法": "使用 archived 表示封存", "Notion v3": "改用 in_trash"}
]
{% enddataTable %}

這版也新增幾個 action ：

- Data Source：Get、Search
- Page：Get Markdown、Update Markdown
- Block：Get Markdown
- Database Page：Download Files
- 建立頁面或追加 Block 時，可以用 Block Builder、JSON Blocks 或 Markdown

實際跑一次 Data Source 的 Search，它會把工作區裡的 Data Source 直接列出來，回傳 `id`、`name`、`url`。
這個 `id` 就是新版拿來查 Database Page 的 `data_source_id`：

{% darrellImage800Alt "Notion 節點 Resource 選 Data Source、Operation 選 Search，輸出回傳 data source 的 id、name 和 url" n8n-2.31.0-notion_data_source_search.png max-800 %}

### Form Ending 可以一次回傳多個檔案
feat(Form Node): Support multiple files when returning binary from form ending

Form Ending 的 **Return Binary File**

以前只能指定一個 binary 欄位，現在可以在 **Input Data Field Name(s)** 填入多個 binary 欄位名稱
讓完成頁個別觸發下載。

假設上游資料裡有兩個 binary 欄位：

```text
test_1
test_2
```

Form Ending 可以這樣設定：

```text
Operation: Completion
Respond With: Return Binary File
Input Data Field Name(s): test_1, test_2
```

送出表單後，瀏覽器會分別下載這兩個檔案。只填 `test_1` 就只下載一個；如果填入不存在的 binary 欄位，Form Ending 會報錯提醒找不到檔案。

實測時可以打開 Form Ending 節點確認，左邊 INPUT 會看到 `test_1`、`test_2` 兩個 binary 欄位，欄位說明也直接寫了可以用逗號分隔多個欄位名稱：

{% darrellImage800Alt "Form Ending 節點 Input Data Field Name(s) 填 test_1, test_2，INPUT 面板顯示 test_1.txt 與 test_2.txt 兩個 binary 檔案" n8n-2.31.0-form_multiple_binary_files-annotated.png max-800 %}

這個功能適合用在表單流程最後要回傳多個檔案的情境

但是在使用者端下載時，可能會有個問題
就是 Chrome 預設不能一次下載多個檔案(安全考量)

所以有這個需求的話，可能要再訊息上面提醒使用者
先允許這個網站的**多重下載**

### Form Trigger 可以顯示請求 headers
feat(Form Trigger Node): Add "Show Headers" option

Form Trigger 新增 **Options → Show Headers**。開啟後，使用者送出表單時，這次 HTTP request 的 headers 會一起出現在節點的輸出資料

這對 debug 或根據來源做判斷分流很方便
也可以協助確認瀏覽器或第三方服務實際送了哪些 header

{% darrellImage800Alt "Form Trigger 開啟 Show Headers 後，輸出的 headers 欄位完整顯示 authorization、x-auth-token、x-demo 等請求標頭" n8n-2.31.0-form_trigger_show_headers-annotated.png max-800 %}


{% callout warning %}
自架 Community 版開啟 Show Headers，等於把整包 header 原封不動寫進 execution 資料，token 也一樣。看得到 execution 記錄的人就看得到 token，這種 execution 別留太久。
{% endcallout %}

## 2.30.0 Pre-release - 2026-07-07

[Github 2.30.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.30.0)

這版 **2.30.0 Pre-release** 我會先看 5 個更新：Webhook URL 設定變清楚、Data Table 可以只清資料、Send and Wait 回覆多了時間戳、AI Assistant 比較懂節點和 credential，最後是 Private Credentials 的團隊協作補強。

這版不是那種「一看就很炫」的大改版，但有幾個點很貼近 self-host 或團隊使用 n8n 時會遇到的麻煩。

### Webhook URL 可以用新的 N8N_WEBHOOK_URL 統一設定
feat: Add unified N8N_WEBHOOK_URL for production and test webhook URLs

這個更新看起來只是多一個環境變數，但對 self-host 其實蠻重要。

以前 n8n 有兩種 webhook URL：

- **Test URL**：在 editor 裡測試用
- **Production URL**：workflow 啟用後，外部服務正式呼叫用

如果你的 n8n editor 和 webhook 對外網址剛好一樣，平常可能完全感覺不到問題。像很多人是 `https://n8n.example.com` 同時拿來開 editor，也拿來接 webhook，這種就不太會遇到。

會出問題的是這種架構：

- Editor 放在 `https://n8n-admin.example.com`
- Webhook 對外希望走 `https://hooks.example.com`
- 或 self-host 時 editor 是內網 / localhost，但 webhook 是 public URL

以前比較容易變成 production URL 看起來是對的，但 test URL 還是跟著 editor 的網址跑。結果你在 editor 裡複製測試 URL 給第三方服務，第三方根本打不到。

2.30.0 新增 **`N8N_WEBHOOK_URL`**，可以統一指定 Test URL 和 Production URL 要用的公開 webhook base URL。

```bash
N8N_EDITOR_BASE_URL=https://n8n-admin.example.com
N8N_WEBHOOK_URL=https://hooks.example.com
```

這樣 editor 還是走 admin 網域，但 Test URL 和 Production URL 都會走 `hooks.example.com`。

{% callout type="warning" title="WEBHOOK_URL 還能用，但建議換掉" %}
舊的 `WEBHOOK_URL` 目前還能用，但 n8n 已經把它標成 deprecated，啟動時會提醒改用 `N8N_WEBHOOK_URL`。如果你有維護 docker compose、Kubernetes env 或部署文件，這版可以順手改成新的命名。
{% endcallout %}

### Data Table 可以只清掉 rows，不刪整張表
feat(editor): Improve data table node

Data Table 節點這次補了一個很實用的操作：**Clear**。

這裡的 Clear 不是刪掉整張 Data Table，而是把表裡面的 rows 清空，表本身的結構、欄位和 table ID 都會保留。

差別在這裡：

{% dataTable style="minimal" align="left" highlight="2" %}
[
  {"操作": "Delete table", "結果": "整張 Data Table 被刪掉，ID 和欄位結構也不見", "適合情境": "這張表真的不用了"},
  {"操作": "Clear rows", "結果": "只刪資料列，保留同一張表和欄位結構", "適合情境": "暫存表、測試資料、每天重跑的 staging table"}
]
{% enddataTable %}

我會把它用在這種情境：每天先把暫存 Data Table 清空，再重新匯入 CRM、表單或 API 抓回來的最新資料。以前如果用刪表重建的方式，很容易牽動後面節點的 table reference；現在 Clear rows 比較像是「清內容」，不會動到 workflow 依賴的那張表。

同一波更新也把 table operation 裡原本的 **Update** 改名成 **Rename**，這個改名比較合理，因為它做的其實是改表名，不是更新資料。

### Send and Wait 回覆多了 respondedAt
feat: Include response timestamp in Send and Wait responses

Send and Wait 類型的流程，現在回傳資料裡會多一個 **`respondedAt`**。

以前你可以知道使用者按了 approve、reject，或填了什麼文字，但如果想知道「他到底幾點回覆」就沒那麼直接。現在回覆裡會直接帶 ISO timestamp。

這個看起來小，但後面可以做的事不少：

- 計算使用者等了多久才回覆
- 記錄主管核准時間，方便稽核
- 判斷 SLA 是否超時
- 把回覆時間寫進 Notion、Google Sheets、CRM 或內部系統

例如採購申請、內容上線審核、客服升級案件，光知道「已核准」有時不夠，你還會想知道是哪個時間點核准的。

這次不是只有某一個節點支援，而是 Send and Wait 的回覆處理共用補強，所以 Slack、Telegram、Discord、WhatsApp、Google Chat、Gmail、Outlook、Email、Microsoft Teams 和 Chat Trigger 這類路徑都吃得到。

### AI Assistant 比較懂 community node 和 credential
feat(core): Support community node type definitions in AI Assistant

這版也有兩個跟 AI Assistant 有關的更新，我覺得可以放在一起看。

第一個是 AI Assistant 現在可以從目前這台 n8n instance 讀取 community node、custom node 和 MCP registry node 的 type definition。以前比較像只能靠 n8n 內建節點的知識，遇到你自己裝的 community node，就容易回答得很空。

第二個是 HTTP Request node 的 credential 建議變聰明一點。以前 AI 可能看到你要打 Stripe、OpenAI、Anthropic、Gemini 這類 API，就直接做 generic header auth。現在如果 n8n 裡已經有對應的 predefined credential，AI Assistant 會優先建議使用現成 credential，而不是自己亂組 header。

這對實務差很多。因為 generic auth 雖然可以用，但比較容易變成：

- token 寫在某個欄位裡，不好管理
- 換 token 時要到處找
- 權限和連線狀態看不清楚
- 團隊協作時不知道誰的 credential 在被使用

我會把這個更新理解成：AI Assistant 不只是會幫你生一段 workflow，它開始更懂「這台 n8n 實際裝了什麼節點、有哪些比較正式的認證方式」。

### Private Credentials 團隊協作變順
feat(core): Re-enable sharing private credentials

最後是 credential 相關的團隊協作更新。

以前 Private Credentials 的限制比較卡：你不一定想讓同事看到 secret，但又希望他可以在同一個 workflow 裡用這個 credential 架構，自己完成 connect 或 reconnect。

2.30.0 重新支援分享 private credentials，搭配新的 credential 介面狀態，會把幾種狀態分得比較清楚：

- 沒連線：顯示 connect
- 已連線：顯示 connected
- 要斷開：有 disconnect confirmation
- 沒權限看 secret：欄位是 read-only，但可以依權限顯示 connect / reconnect banner

這對團隊裡的 OAuth credential 特別有用。管理者可以先建好 credential 的基本設定，不一定要把 client secret 攤開給每個人；使用者如果有 `credential:connect` 權限，就能自己連自己的帳號。

講白一點，以前比較像「要嘛你看得到全部 secret，要嘛你什麼都不能動」。現在比較接近「設定由管理者管，實際連線可以讓使用者自己完成」。

## 2.29.0 Pre-release - 2026-06-30

[Github 2.29.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.29.0)

這版 **2.29.0 Pre-release** 我挑了兩個更新：一個是蠻嚇人的排程 bug 修復，另一個是 Slack 節點的實用功能補強。

如果你的 workflow 有用到「每 N 個月」這種排程，或最近改過排程間隔的單位，建議先看第一個修復；如果你常用 Slack 節點發通知，第二個補強應該蠻用得到。

### 排程可能默默停止觸發，你完全不會發現
Schedule Node: Fix schedules that permanently stop firing

這算是這版最讓我在意的一個修復。

Schedule Trigger 在兩種情況下會**永久停止觸發**，而且完全不會報錯、不會留下失敗的 execution，workflow 看起來一切正常，其實已經停了：

- 用「Every N Months」設定間隔 12 個月以上（例如每 12 個月、每 24 個月觸發一次），只有第一次會準時跑，之後就再也不會觸發
- 排程間隔的單位改過（例如從「天」改成「小時」），殘留的舊設定會讓時間判斷永久卡住

每天發的日報、每月的帳務彙整，都可能已經默默停了好幾週才被發現。這種完全沒有警示的 bug 最讓人不安，升級後建議心裡有個底。

{% callout type="warning" title="升級後要做什麼" %}
大部分情況下次啟用 workflow 時會自動修復。如果你用過「Every N Months」或最近改過排程間隔的單位，建議手動關掉再打開一次該 workflow，確保重新註冊排程。
{% endcallout %}

另外順手修了一個相關的執行崩潰：手動測試 workflow 時，如果起點節點剛好被停用（disabled），以前可能會直接讓那次測試整個崩潰，現在會顯示清楚的錯誤訊息，不會炸掉。

{% darrellImage800Alt "n8n Schedule Trigger 節點的 Every N Months 排程間隔設定" n8n-2.29.0-schedule_trigger_bug.png max-800 %}

### Slack 節點新增排程訊息和用 Email 查使用者
Slack Node: Add schedule message and look up user by email operations

Slack 節點這次補了兩個蠻實用的操作。

**排程訊息（Message → Schedule）**

以前要讓 Slack 訊息晚點發，得另外接 Schedule Trigger 或 Wait 節點，等於多蓋一段子流程。現在 Message 資源新增 **Schedule** 操作，直接指定 **Post At** 時間（可以排到未來 120 天內），時間到了 Slack 會自動幫你發出。

同時也補了管理用的 **Delete Scheduled** 和 **Get Many Scheduled**，可以查詢或取消還沒發出的排程訊息。

**用 Email 查使用者（User → Look Up by Email）**

以前要從一個 email 找到對應的 Slack user ID，得先用 Get Many 撈出所有使用者，再自己寫邏輯比對，workspace 人一多這樣做很沒效率。現在新增 **Look Up by Email** 操作，填一個 Email 欄位，直接拿到對應使用者。

我會拿來用在：
- 排程訊息：例行提醒、定時發送報表摘要、避免半夜或非上班時間發通知
- Email 查使用者：從表單或 CRM 拿到 email 後，直接找到人發 Slack 私訊，不用手動維護 email 對 Slack ID 的對照表

{% darrellImage800Alt "Slack 節點 Message 資源新增 Schedule 操作，可設定 Post At 時間" n8n-2.29.0-slack_schedule_message.png max-800 %}

{% darrellImage800Alt "Slack 節點 User 資源新增 Look Up by Email 操作" n8n-2.29.0-slack_lookup_by_email.png max-800 %}

## 2.28.0 Pre-release - 2026-06-23

[Github 2.28.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.28.0)

這版 **2.28.0 Pre-release** 我先看三個已經能實測的更新，都是很貼近日常自動化痛點的小補強。

Webhook 可以先把不需要的請求擋掉，AI Agent 可以直接把 PDF 交給支援的模型處理，Telegram 節點則開始支援 Rich Message 和 Draft，讓 bot 訊息更像正式產品。

### Webhook 節點新增 Only Run If 條件
feat(Webhook Node): Add "Only Run If" option to filter requests

Webhook 最麻煩的地方不是收到請求，而是收到一堆「你其實不想處理」的請求。

例如同一個第三方服務只能打同一支 Webhook，但裡面有 `lead.created`、`lead.updated`、`campaign.clicked` 等不同事件。以前 n8n 還是會先建立 execution，進到 workflow 之後你再用 IF 節點判斷，不符合條件就結束。

結果是 execution 紀錄裡多了一堆沒價值的執行，正式環境看 log 會很亂，execution 數量也會被灌高。

這次 Webhook 節點新增 **Only Run If** 選項，可以直接在 Webhook 收到請求時先判斷 expression。條件不符合就不啟動 workflow，也不產生 execution。

我會把它用在這幾種情境：
- 只處理特定 `eventType`，其他事件直接忽略
- 只接某個 campaign 或來源渠道的資料
- 第三方服務不能設定細緻條件，只好在 n8n 入口先過濾
- 測試環境和正式環境共用類似 payload，需要先用 header 或欄位分流

這不是拿來取代安全驗證的功能。如果你要防止外部亂打 Webhook，還是要搭配驗證機制。但如果問題是「來源是真的，只是事件太雜」，Only Run If 會很實用。

{% darrellImage800Alt "Webhook 節點 Options 新增 Only Run If 欄位，可以用 expression 先過濾請求" n8n-2.28.0-webhook_only_run_if-watermarked.png max-800 %}

### AI Agent 可以直接傳遞 PDF 給模型
feat(AI Agent Node): Add binary PDF passthrough for models with native PDF support

以前要讓 AI Agent 讀 PDF，通常要先用 **Extract from File** 把 PDF 轉成純文字，再丟給模型。

這樣能用，但多一個節點，也可能把 PDF 裡的表格、排版或文件結構弄丟。

現在 AI Agent 的 Options 裡新增 **Automatically Passthrough Binary PDFs**。開啟後，PDF binary 會直接傳給支援原生 PDF input 的模型，例如 Google Gemini 或 Claude。

這個差異在分析文件時蠻明顯。像合約、報表、簡報、發票 PDF 這類資料，內容不只是文字，表格位置、段落層級、頁面排版也會影響理解。直接 passthrough 給模型，有機會保留更多文件上下文。

{% callout type="warning" title="注意：模型本身也要支援 PDF" %}
這個選項不是把所有模型都變成會讀 PDF。它比較像是讓 n8n 不再先把 PDF 攤平成文字，而是把檔案交給原本就支援 PDF input 的模型。預設是關閉的，所以既有 workflow 不會被影響。
{% endcallout %}

我會優先拿來做這幾種 workflow：
- 上傳合約 PDF，讓 Agent 摘要風險條款
- 分析財務報表或簡報，保留表格和頁面脈絡
- 處理表單掃描檔，比單純抽文字更容易保留原始結構

{% darrellImage800Alt "AI Agent 節點 Options 開啟 Automatically Passthrough Binary PDFs，PDF 可以直接傳給支援的模型" n8n-2.28.0-ai_agent_pdf_passthrough-watermarked.png max-800 %}

### Telegram 節點支援 Rich Message 和 Draft
feat(Telegram Node): Add rich message and message draft operations

Telegram 節點這次新增三個 Message 操作：
- **Send Rich Message**
- **Send Message Draft**
- **Send Rich Message Draft**

以前 Telegram 節點比較像「把一段文字送出去」。如果要做 AI Bot 或正式通知，很容易看起來像純文字 log，不太像產品訊息。

**Send Rich Message** 可以送出比較完整的格式內容，像 heading、清單、表格、引用區塊，支援 Markdown 或 HTML。拿來做報表摘要、客服回覆、任務通知，閱讀體驗會比純文字好很多。

Draft 則是比較有趣的新能力，可以先顯示「正在生成」的草稿效果，等內容準備好再送出正式訊息。Draft 比較像短時間的預覽狀態，不是正式送出的訊息，所以很適合拿來處理等待感。

我會把 Rich Message 和 Draft 拆成兩種用途：
- Rich Message：用在最終回覆，讓內容有標題、清單、表格和引用
- Draft：用在長時間處理的流程，例如 AI 正在查資料、整理文件、產生摘要時，先讓使用者看到 bot 有在處理

如果你有用 n8n 做 Telegram Bot，這版開始可以把訊息做得更像正式產品，而不是只有純文字通知。

{% darrellImage800Alt "Telegram 節點 Operation 下拉新增 Send Rich Message、Send Message Draft、Send Rich Message Draft" n8n-2.28.0-telegram_rich_message_draft-watermarked.png max-800 %}

## 2.27.0 Pre-release - 2026-06-16

[Github 2.27.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.27.0)

這版 **2.27.0 Pre-release** 主要有 Anthropic 串流選項、GitHub 節點新增組織成員操作，另外也包含不少安全性修復和效能改善。

{% callout type="warning" title="升級注意：這版有 DB Migration" %}
這版包含一個資料庫 migration，會在 `execution_entity` 表上新增索引。大型 instance 可能需要幾分鐘才能完成，期間資料庫仍可正常使用。
{% endcallout %}

### GitHub 節點新增取得組織成員
feat(GitHub Node): Introduce get members operation on organization resource

GitHub 節點的 Organization 資源新增了 **Get Members** 操作，可以列出指定 GitHub 組織的所有成員。

之前要取得組織成員清單，只能用 HTTP Request 節點自己打 GitHub API，現在直接在 GitHub 節點選 Organization → Get Members 就能拿到。

適合用在：
- 定期稽核哪些人在 GitHub 組織裡
- 新人入職時同步帳號到其他系統
- 比對組織成員和公司人員名單

{% darrellImage800Alt "GitHub 節點 Organization 資源新增 Get Members 操作" n8n-2.27.0-github_get_org_members.png max-800 %}

### Anthropic 模型節點新增串流選項
LmChatAnthropic Node: Add streaming option

在 AI Agent workflow 裡用 Anthropic 模型，現在可以開啟 **Stream Responses** 選項。

開啟後，模型回應改用串流方式傳輸，不用等整個回應生成完才收到資料，對於生成長文字的場景更即時。預設是**關閉**的，不影響後續節點接收的資料格式，向後相容沒問題。

{% darrellImage800Alt "Anthropic Chat Model 節點新增 Stream Responses 開關" n8n-2.27.0-anthropic_streaming.png max-800 %}

## 2.24.0 Pre-release - 2026-06-02

[Github 2.24.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.24.0)

這版 **2.24.0 Pre-release** 沒有特別大的新功能，但修了幾個讓人頭痛的 bug，加上一個 Form Trigger 的實用新選項。

### Postgres 節點：SELECT 無結果改回傳空陣列
Postgres Node: Return empty array for SELECTs that match no rows

這是個讓很多人踩到的雷。
之前用 Postgres 節點執行 `SELECT`，如果沒有任何符合條件的資料，節點回傳的不是空陣列 `[]`，而是 `{ "success": true }`。

要用這個 return 的結果來判斷到底有沒有資料，非常麻煩跟不直覺
現在改成回傳空陣列，可以直接判斷陣列裡面的資料長度是否為 0 或是大於 0 !

{% darrellImage800Alt "Postgres 節點 SELECT 查詢無結果時，現在正確回傳空陣列 [] 而不是 { success: true }" n8n-2.24.0-postgres_select_empty_array.png max-800 %}

### AI Tool 節點預設改為 Continue on Error
Make AI tool nodes continue on error by default

在 n8n 用 AI Agent 搭配 Tool 的時候，之前只要 Tool 出錯，整個 workflow 就直接停掉
Agent 節點完全不知道發生什麼事，也沒辦法嘗試用別的方式繼續。

現在 Tool 節點的預設行為改成 **Continue on Error**：工具出錯時，錯誤訊息會被包成 `{ error: "..." }` 傳回給 AI Agent，workflow 繼續跑。Agent 收到之後可以自己決定要重試或是回報給使用者。

{% darrellImage800Alt "AI Tool 節點出錯時，錯誤訊息傳給 Agent，節點顯示紅色，workflow 不中斷" n8n-2.24.0-ai_tool_continue_on_error.png max-800 %}

### Form 表單觸發器新增 n8n 用戶驗證
Form Trigger Node: Add n8n user authentication option

如果你有在用 Form Trigger 做內部工具，之前的選項只有：完全開放或 Basic Auth（要另外管理授權）。
這次加了第三種：**n8n User Auth**。設定後，只有能登入這個 n8n 的用戶才能看到並提交表單，沒登入的人會被導向 n8n 登入頁

還有個 **Include User in Output** 選項（預設開啟），提交表單時會把用戶的 id、email、姓名一起帶進 workflow，方便記錄是誰填的。
適合用在內部表單搜集資料時，讓有開權限的人進來填寫表單

{% darrellImage800Alt "Form Trigger 節點的 Authentication 設定新增 n8n User Auth 選項，下方有 Include User in Output 切換" n8n-2.24.0-form_trigger_n8n_user_auth.png max-800 %}

## 2.22.0 Pre-release - 2026-05-19

[Github 2.22.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.22.0)

這版是 **2.22.0 Pre-release**，重點有 Crypto 節點補上加解密功能、NVIDIA Nemotron 新的 AI Chat Model 節點、以及 Facebook Graph API 支援 OAuth2 認證。

### Crypto 節點新增加解密 Action
feat(Crypto Node): Add encryption and decryption actions

之前在 n8n 想做「加密一段字串再存到 Google Sheets / Notion / Supabase」這種事，沒有現成節點，只能進 Code 節點自己用 Node.js 的 `crypto` 模組刻。

這次 Crypto 節點終於補上了 **Encrypt** 和 **Decrypt** 兩個 action，原本只有 Hash、Hmac、Sign、Generate。

{% darrellImage800Alt "Crypto 節點 Action 下拉新增 Encrypt（用 Passphrase 或 Public Key 加密）和 Decrypt（用 Passphrase 或 Private Key 解密）兩個選項" n8n-2.22.0-crypto_encrypt_decrypt_actions.png max-800 %}

支援兩種模式：

**對稱加密（Symmetric）**：用同一組 Passphrase 加解密，4 種演算法可選

**非對稱加密（Asymmetric）**：用 RSA-OAEP-SHA256，公鑰加密、私鑰解密。

### NVIDIA Nemotron 加入 Chat Model 節點
feat(core): Add NVIDIA Nemotron Models with cloud and self-hosted NIM support

n8n 這次新增了 **NVIDIA Nemotron Chat Model** 節點，可以在 AI Agent 裡選用 NVIDIA 自家的 Nemotron 模型。

{% darrellImage800Alt "AI Agent 節點透過 Chat Model 接口連接到 NVIDIA Nemotron Chat Model 節點" n8n-2.22.0-nvidia_nemotron_chat_model.png max-800 %}

**支援兩種部署方式**：

{% dataTable align="left" %}
[
  {"部署方式": "<strong>NVIDIA 雲端</strong>", "Base URL": "<code>https://integrate.api.nvidia.com/v1</code>", "適合誰": "想用開源模型但不想自己架推理服務的人，註冊 <a href=\"https://build.nvidia.com/\">build.nvidia.com</a> 就有免費額度（約 1,000 次推理）"},
  {"部署方式": "<strong>自架 NIM</strong>", "Base URL": "自家 GPU 伺服器，如 <code>http://localhost:8000/v1</code>", "適合誰": "有 NVIDIA GPU（A100 / H100 / RTX 4090）的話，資料就不用上傳到雲端模型"}
]
{% enddataTable %}

### Facebook Graph API 節點支援 OAuth2 認證
feat(Facebook Graph API Node): Add OAuth2 support

之前在 n8n 連 Facebook Graph API，要先去 [Meta for Developers](https://developers.facebook.com/) 的 APP 找到方法產生 Access Token 貼過來。

這次新增了 **Facebook Graph OAuth2 API** credential，認證流程從「自己找 token、貼上、過期」變成「點一下 Connect、跳授權頁同意就完成」。

{% darrellImage800Alt "Facebook Graph OAuth2 API credential 設定畫面，需填入 Client ID、Client Secret，可選自訂 Scope" n8n-2.22.0-facebook_graph_oauth2_credential.png max-800 %}

目前實測這個 Token 無法使用在粉絲專頁上，只能授權使用在個人帳號上
所以想取得粉絲專頁的貼文成效或是發文的話，無法使用這個 OAuth 方式來授權

## 2.21.0 Pre-release - 2026-05-12

[Github 2.21.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.21.0)

這版是 **2.21.0 Pre-release**，重點有 Jira 支援 OAuth2 登入、Notion 資料庫突破 100 筆限制、Google Sheets Append 修復配額超量問題、以及 14 個 Trigger 節點加入 Webhook 簽名驗證。

### Jira 節點支援 OAuth2 認證
feat(Jira Node): Add OAuth2 (3LO) support

以前要在 n8n 連 Jira，流程是：去 Atlassian 帳號設定頁手動建一個 API token、複製那串字、貼回 n8n。Token 本身不會自動更新，過期或被撤銷就要重建一次。

這次新增了 `Cloud (OAuth2)` 認證選項，設定流程：
1. 到 Atlassian Developer Console 建一個 OAuth2 App，拿到 Client ID 和 Client Secret
2. 在 n8n 建立 `Jira SW Cloud OAuth2 API` credential，填入 Client ID、Client Secret 和 Atlassian 網址（例如 `https://yourcompany.atlassian.net`）
3. 點 Connect，跳出 Atlassian 授權頁，同意後自動完成

OAuth2 的好處是 token 自動更新，不用擔心哪天突然失效。設定比 API token 多一步（要先在 Atlassian 建 OAuth2 App），但之後維護起來省事很多。

{% darrellImage800Alt "Jira SW Cloud OAuth2 API credential 設定畫面，需填入 Client ID、Client Secret 和 Atlassian 網址" n8n-2.21.0-jira_oauth2_credential.png max-800 %}

### Notion Get Many 突破 100 筆限制
fix(Notion Node): Paginate Get Many operations beyond 100-item API cap

Notion API 有個限制：每次最多回傳 100 筆資料。

以前在 n8n 用 Notion 節點的 Get Many，就算你設 Limit 為 150，實際上只會拿到 100 筆，而且沒有任何錯誤訊息，你根本不知道資料被切掉了。如果你的 Notion 資料庫有 200 筆，跑完 workflow 可能以為拿到全部，其實只有一半。

這次修復後，n8n 會自動分頁查詢直到拿齊。設 150 就真的拿 150 筆、開 Return All 就拿全部，不用自己寫 pagination 邏輯。

{% darrellImage800Alt "Notion 節點 Get Many 設定 Limit 為 150，現在會真正回傳 150 筆而不被 100 筆上限截斷" n8n-2.21.0-notion_get_many_pagination.png max-800 %}

### Google Sheets Append 解決配額超量問題
fix(Google Sheets Node): Reduce duplicate API calls in append operation to avoid quota limits

在 Loop 裡跑 Google Sheets 的 Append Row，跑一段時間後會遇到 **429 Too Many Requests**，然後整個 workflow 就停了。

原因是每次 Append 一筆資料，n8n 內部會打 **3 次** Google Sheets API，三個函式各自去讀同一件事：試算表的標題列（欄位名稱），沒有共用結果。

Google Sheets 讀取配額是 60 次/分鐘，等於每分鐘只能 Append 約 20 筆就觸發限制。

這次修復改成只讀 1 次，同樣配額可以跑 60 次 Append，是之前的 3 倍。如果你有跑過 Loop + Append 遇到 429，更新後就可以解除這個瓶頸了。

{% darrellImage800Alt "Google Sheets 節點 Append Row 操作，這次修復讓每次 Append 的 API 呼叫從 3 次降為 1 次，有效避免配額超量" n8n-2.21.0-google_sheets_append_row.png max-800 %}

### 14 個 Trigger 節點加入 Webhook 簽名驗證
Multiple Trigger Nodes: Add webhook request verification

以前這些 Trigger 節點收到 webhook 就執行，不會驗證「這個請求真的是服務本身發的嗎？」只要有人知道你的 webhook URL，就能發假請求觸發 workflow。

這次 n8n 替以下 14 個 Trigger 節點加入 HMAC 簽名驗證，不合法的請求直接 401 拒絕。對你來說**不需要額外設定**，只要 credential 有效，驗證自動啟用：

Acuity Scheduling、Asana、Cal.com、Calendly、Customer.io、Figma、Formstack、GitLab、MailerLite、Mautic、Onfleet、Taiga、Trello、Twilio

## 2.20.0 Pre-release - 2026-05-05

[Github 2.20.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.20.0)

這版是 **2.20.0 Pre-release**，重點有 Claude Opus 4.7+ 自適應思考模式、MCP 環境變數管理、以及 Notion 新域名支援。

### Claude Opus 4.7+ 新增自適應思考模式
fix(Anthropic Chat Model Node): Add adaptive thinking mode for Claude Opus 4.7+

Claude Opus 4.7 推出後，n8n 也終於推出更新來配合新的思考模式 Adaptive！

這次更新新增了三個模式：
- **Disabled**：不思考
- **Adaptive（推薦）**：讓 Claude 自己決定要想多久，設定努力程度（Effort）就好
- **Manual**：舊版固定預算模式，Opus 4.7+ 會顯示友善錯誤訊息提醒你切換

Adaptive 模式的 Effort 等級：
- Opus 系列：Low / Medium / High / X-High / Max
- 其他系列：Low / Medium / High

{% darrellImage800Alt "n8n Anthropic Chat Model 節點新增 Adaptive 思考模式，可設定 Effort 等級" n8n-2.20.0-anthropic_adaptive_thinking.png max-800 %}

### MCP 功能改用環境變數管理
feat(core): Manage MCP settings via environment variables

之前要開關 n8n 的 MCP 功能，只能進 Settings 頁面手動開關。

這次加了兩個環境變數：
- `N8N_MCP_ENABLED=true/false`：控制 MCP 功能開關
- `N8N_MCP_MANAGED_BY_ENV=true`：把 UI 的 MCP 開關鎖成唯讀

啟用 `N8N_MCP_MANAGED_BY_ENV=true` 後，Settings 裡的開關會顯示目前狀態但不能手動改，避免有人在介面亂動造成設定不一致。

讓 n8n mcp 的管理上多了另一種方式，需要的話就在 env 直接設定啟用與否就好，不需要個別做設定

{% darrellImage800Alt "在 n8n Variables 新增 N8N_MCP_MANAGED_BY_ENV=true 設定，讓 MCP 開關由環境變數控制" n8n-2.20.0-mcp_env_managed.png max-800 %}

### Notion 節點支援新版 app.notion.com 網址
fix(Notion Node): Support app.notion.com URL format for page and block ID extraction

Notion 最近把網址從 `notion.so` 換成 `app.notion.com`，但 n8n 的 Notion 節點只認舊的網域，直接貼新 URL 會 error

> Invalid URL, could not find block ID or page ID

這次修復兩種網域都支援，從 Notion 複製連結直接貼上就行，不用手動把 domain 改回 `notion.so`。

{% darrellImage800Alt "n8n Notion 節點現在支援 app.notion.com 新版網址格式，貼上直接用不報錯" n8n-2.20.0-notion_url_fix.png max-800 %}

## 2.18.0 Pre-release - 2026-04-21

[Github 2.18.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.18.0)

### 收藏 Workflow、資料夾、專案
feat(editor): Add favoriting for projects, folders, workflows and data tables

workflow 多了之後，最頭痛的就是找。每次要開常用的幾個，都要滾半天或靠搜尋，
偏偏那幾個名字又記不住在哪個資料夾。

這次加了收藏功能，workflow、資料夾、專案都可以點星號加入收藏。
左側 sidebar 會出現專屬的 **Favorites** 區塊，按類型分組顯示，點一下直接跳過去。

{% darrellImage800Alt "n8n sidebar 顯示 Favorites 收藏區塊，按類型分組列出常用 workflow" n8n-2.18.0-favorites_sidebar.png max-800 %}

常用的 workflow 終於不用每次從頭找了。

### MiniMax Chat Model 節點
feat(MiniMax Chat Model Node): Add MiniMax Chat Model sub-node

又多了一個可以接的 AI 模型，這次是 **MiniMax**，中國的 AI 公司，API 相容 OpenAI 格式。

跟其他 LangChain 子節點一樣，直接接到 AI Agent 或 Chain 上用。
Credentials 需要 API Key（從 platform.minimax.io 申請），有國際區和中國區可以選。

支援 7 個模型，都有一般版和高速版：
- MiniMax-M2.7 / M2.7-highspeed
- MiniMax-M2.5 / M2.5-highspeed
- MiniMax-M2.1 / M2.1-highspeed
- MiniMax-M2

比較特別的是有個 **Hide Thinking** 選項（預設開啟），
會自動把模型的 `<think>` 推理過程濾掉，output 乾淨不帶思考過程。

{% darrellImage800Alt "n8n MiniMax Chat Model 節點設定畫面，可選模型和區域" n8n-2.18.0-minimax_chat_model.png max-800 %}

### Schedule Node 觸發失效可以自動修復了
fix(Schedule Node): Use elapsed-time check to self-heal after missed triggers

這個修復比看起來嚴重很多。

以前 Schedule Node 用的是嚴格比對（`===`）判斷要不要觸發。
只要錯過一次觸發時間（n8n 重啟、Redis failover、切換主節點），
`lastExecution` 的值就會永久卡住，之後完全不會觸發，**最長可以沉默 364 天**。

問題是完全無聲，沒有錯誤、沒有通知，你只會發現資料不知道什麼時候開始沒更新了。

另外改排程間隔也會觸發同樣的 bug：舊的 `lastExecution` 跟新設定不匹配，
workflow 就永久停擺。

這次把比對邏輯改成 elapsed-time 檢查（`>=`），只要超過設定的間隔就觸發，
下次 cron tick 就會自動修復，不用手動停用再重新啟用。

{% darrellImage800Alt "Schedule Node 修復後可自動偵測並補跑錯過的排程觸發" n8n-2.18.0-schedule_self_heal.png max-800 %}

## 2.16.0 Pre-release - 2026-04-07

[Github 2.16.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.16.0)

### Chat Trigger 自動記錄 Execution Data
feat(Chat Trigger Node): Auto-add highlighted execution data

以前跑完 AI workflow，想在執行紀錄裡看到「AI 回了什麼」「用了哪個 tool」這些重點，
你得自己手動加一個 Execution Data 節點，然後設定要記錄哪些欄位。

現在只要 workflow 裡有 Chat Trigger、Respond To Chat、Tools Agent 這些 AI 節點，
系統會**自動把重要資訊標記出來**，直接顯示在執行紀錄的摘要上。

節點也有提供設定可以關掉，預設開啟。

{% darrellImage800Alt "Chat Trigger 自動記錄 highlighted execution data" n8n-2.16.0-chat_trigger_auto_execution_data.png max-800 %}

### Notion 支援 OAuth 連線
feat(Notion Node): Add support for OAuth

之前要串 Notion，只能用 Internal Integration Token，
得到 Notion 後台建 Integration、複製 Token、再手動把 Integration 加到每個要存取的 Database 頁面。

現在多了 OAuth 選項，流程跟串 Google、Slack 一樣：

**Step 1**：到 Notion 後台建一個 Public Integration，設定 OAuth redirect URI

{% darrellImage800Alt "Notion 後台建立 Public Integration，設定 OAuth domains" n8n-2.16.0-notion_oauth_integration.png max-800 %}

**Step 2**：在 n8n 的 Credential 選 OAuth2，填入 Client ID 和 Secret，按 Connect to Notion

{% darrellImage800Alt "n8n Notion OAuth2 Credential 設定畫面" n8n-2.16.0-notion_oauth_credential.png max-800 %}

**Step 3**：Notion 會跳出授權頁面，確認權限後選擇要授權的頁面

{% darrellImage800Alt "Notion OAuth 授權確認頁面，顯示權限列表" n8n-2.16.0-notion_oauth.png max-800 %}

{% darrellImage800Alt "選擇要授權 n8n 存取的 Notion 頁面" n8n-2.16.0-notion_oauth_select_pages.png max-800 %}

整個流程比以前直覺很多，對不熟 API Token 的人來說方便不少。

### Data Table MCP 工具
feat(core): Data table MCP tool

n8n 的 MCP Server 又多了新工具，這次是讓 AI 可以直接操作 Data Table。

新增了 7 個 MCP 工具：
- `search-data-tables` - 搜尋現有表格
- `create-data-table` - 建立新表格
- `rename-data-table` - 改名
- `add-data-table-column` / `delete-data-table-column` / `rename-data-table-column` - 管理欄位
- `add-data-table-rows` - 寫入資料

搭配 Claude Code 或其他 MCP Client 使用的話，
AI 可以幫你建表、設計欄位結構、寫入資料，不用自己開 n8n 操作或是匯入。

{% darrellImage800Alt "n8n MCP Server 新增 Data Table 操作工具" n8n-2.16.0-data_table_mcp_tool.png max-800 %}

## 2.15.0 Pre-release - 2026-03-30

[Github 2.15.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.15.0)

### Error Workflow 依賴關係顯示
Support error workflows in workflow dependency

之前在 2.14.0 介紹了 Dependency 功能，
可以看到 Workflow 和對應的 Credential

這次更新補上了兩個新的 Dependency：
- **Error workflow**：這個 Workflow 的錯誤由誰處理
- **Error handler for**：誰把這個 Workflow 當成 Error Handler

而且是**雙向**的。
假設 A 設定 B 為 Error Workflow，那 A 的面板會顯示「Error workflow: B」，B 的面板也會顯示「Error handler for: A」。

這樣要改 Error Workflow 的時候，很直覺能看到誰影響誰。

{% darrellImage800Alt "Dependency 面板新增 Error Workflow 依賴顯示" n8n-2.15.0-error_workflow_dependency.png max-800 %}

### Workflow Archive / Unarchive API
Public API endpoints for workflow archive and unarchive

目前想要 Archive workflow 都需要打開 n8n 來操作
這次補上了兩個 Public API 端點，未來可以透過 API 封存 Workflow
期待他們也更新到 `n8n-cli` 中

```
POST /api/v1/workflows/{id}/archive
```

Archive 後 Workflow 會：
- 立即停用（如果正在 active）
- 無法編輯或執行
- 資料不會消失（soft delete）

Unarchive 後會恢復成**停用狀態**，不會自動重新啟用，需要另外手動 activate。
如果你有用 API 管理 Workflow，例如定期清理不用的自動化，現在可以用 API 封存而不用真的刪除。

{% darrellImage800Alt "Workflow Archive/Unarchive API 端點" n8n-2.15.0-workflow_archive_api.png max-800 %}

### MCP 新增測試 Workflow 工具
Implement Test workflow MCP tool

n8n 的 MCP Server 新增了兩個工具，讓 AI Agent 可以直接測試你的 Workflow。

**`prepare_test_pin_data`**：告訴 AI 每個節點需要什麼格式的輸入資料。
它會優先從你之前的執行紀錄推導 schema，如果沒有紀錄就從節點定義去猜（大概能涵蓋 55% 的節點）。

**`test_workflow`**：用 AI 生成的測試資料直接跑 Workflow。
Trigger 和有 Credential 的節點會用假資料替代，Set、If、Code 這些邏輯節點正常執行。

跟在 UI 上手動按 Test 的差別是：不用開瀏覽器，AI 可以自動化整個測試流程。
搭配 Claude Code 這漾的 MCP Client 使用，開發 Workflow 的時候 AI 可以邊改邊測。

需要先啟用 n8n MCP Server 才能使用。
加上之前版本新增的 `update_workflow`、`archive_workflow`、`search_projects`、`search_folders`，目前 n8n MCP Server 已經有 18 個工具了。

{% darrellImage800Alt "n8n MCP Server v2.15.0 共 18 個工具，本次新增 6 個" n8n-2.15.0-mcp_server_tools.png max-800 %}

## 2.14.0 Pre-release - 2026-03-24

[Github 2.14.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.14.0)

這版是 **2.14.0 Pre-release**，n8n 推出了客戶端 CLI 工具，不用 SSH 進伺服器就能管 workflow。Credential 和 Workflow 列表頁也能看到依賴關係了，刪東西前終於知道誰在用。

### n8n CLI 
Add @n8n/cli: a client CLI to manage n8n from the terminal

n8n 本來就有 CLI（`n8n start`、`n8n export` 那些），但那是要在 n8n 伺服器上跑的。

這次的 `@n8n/cli` 不太一樣，是透過 REST API 遠端操作，
在自己電腦裝好、設定 API Key 就能用，不用另外連線到 n8n 的伺服器中。

```bash
# 不想裝也行，npx 直接跑
npx @n8n/cli workflow list

# 或全域安裝
npm install -g @n8n/cli

# 設定連線
n8n-cli config set-url https://你的n8n網址
n8n-cli config set-api-key n8n_api_xxxxx
```

目前有 **54 個指令**，Workflow、Execution、Credential、Project、Tag、Variable、Data Table 都能操作。

幾個蠻實用的用法：

```bash
# 列出啟用中的 workflow
n8n-cli workflow list --active

# 查最近失敗的 execution
n8n-cli execution list --status=error --limit=5

# 內建 jq 語法篩選
n8n-cli workflow get <id> --jq '.nodes[].name'
```

蠻貼心的是 pipe 的時候會自動切成 JSON 輸出，不用再加 `--json`，跟其他工具串接很方便。

另外有個 **`skill install`** 指令，可以把 n8n CLI 的使用說明裝進 Claude Code，
裝完之後 AI 就比較知道怎麼幫你操作

```bash
n8n-cli skill install
```

目前是 Beta（v0.2.0），官方文件還沒上 docs.n8n.io，不過套件裡有附完整文件。
npm：https://www.npmjs.com/package/@n8n/cli

{% darrellImage800Alt "n8n 客戶端 CLI 工具指令總覽，涵蓋 Workflow、Execution、Credential 等操作" n8n-2.14.0-n8n_cli.png max-800 %}

### Credential 和 Workflow 顯示依賴關係
Display workflow, credential and data table dependencies

Workflow 多了之後，要刪一個 Credential 都不確定有多少 workflow 在使用。

現在 Credential 的列表頁會多一個數字，
點下去就能看到有哪些 workflow 在用它：

點清單裡的項目可以直接跳過去，多的時候也有搜尋框。
刪東西之前先看一下這個數字就好。

{% darrellImage800Alt "Credential 列表顯示依賴關係數字，點開可看到哪些 Workflow 在使用" n8n-2.14.0-dependency_display.png max-800 %}

### Execution 頁面新增版本資訊
Add history version info to execution page / Add new execution filter by workflow version

Execution 頁面多了兩個跟版本有關的功能。

第一個是 Execution 詳情頁多了**版本標籤**，
直接告訴你這次執行是用哪個版本的 workflow 跑的。
點標籤可以跳到 Workflow History 看那個版本的內容。

第二個是 Execution 列表頁的篩選器多了 **Version 下拉選單**，
可以只看某個版本的執行紀錄。

workflow 改版後如果出問題，直接篩出舊版的 execution 來比對就好，
不用在一大堆紀錄裡面翻。

{% darrellImage800Alt "Execution 詳情頁顯示 Version 標籤，可以看到這次執行用的 workflow 版本" n8n-2.14.0-execution_version_info.png max-800 %}

{% darrellImage800Alt "Execution 篩選器新增 Version 下拉選單，可篩選特定版本的執行紀錄" n8n-2.14.0-execution_version_filter.png max-800 %}

## 2.12.0 Pre-release - 2026-03-09

[Github 2.12.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.12.0)

這版是 **2.12.0 Pre-release**，Personal Agent 也能設建議提示詞了、Expression 的 `?.` 自動完成修好了、Dark Mode 的拖曳把手也終於看得到了。

### Personal Agent 建議提示詞
feat(core): Add suggested prompts to Personal Agents on Chat hub

上一版在 Chat Trigger 加了建議提示詞，這版把同樣的功能也加到 **Personal Agent** 了。

在建立或編輯 Personal Agent 時，可以在 Editor 裡面設定最多 **6 個建議提示詞**，
每個都可以搭配一個 icon，使用者在 Chat Hub 開新對話時就會看到這些提示詞按鈕。

{% darrellImage800Alt "Personal Agent Editor 中的 Suggestions 設定，Chat Hub 上會顯示建議提示詞按鈕" n8n-2.12.0-personal_agent_suggested_prompts.png max-800 %}

### Expression 自動完成支援 `?.` 可選鏈語法
fix(editor): Fix expression autocomplete for optional chaining

之前在 Expression 欄位打 `?.` 的時候，auto fill 會壞掉，
沒辦法正常跳出後面可用的欄位名稱。

`?.` 是 JavaScript 的語法，處理可能是 null 或 undefined 的值時蠻常用的，
像 `$json.data?.name`：如果 `json` 裡面沒有 `data` 就不會錯誤！


{% darrellImage800Alt "Expression 自動完成現在正確支援 ?. 可選鏈語法" n8n-2.12.0-expression_optional_chaining.png max-800 %}

### Dark Mode 拖曳把手對比度改善
fix(editor): Improve NDV panel drag handle contrast in dark mode

用 Dark Mode 的人應該有注意到，節點設定面板上方那個調整寬度的拖曳框框（`|`）非常不明顯，深灰色跟黑色背景有點太接近。
調了顏色好，現在如果要拖曳視窗大小有稍微對眼睛負擔小一點哈哈哈。

{% darrellImage800Alt "Dark Mode 下 NDV 拖曳把手對比度改善，左邊是改之前幾乎看不到，右邊是改之後" n8n-2.12.0-ndv_drag_handle_dark_mode.png max-800 %}

## 2.11.0 Pre-release - 2026-03-03

[Github 2.11.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.11.0)

這版是 **2.11.0 Pre-release**，Chat Hub 可以設定建議提示詞、Data Table 總覽頁多了搜尋和排序功能。

### Chat Trigger 建議提示詞
feat(Chat Trigger Node): Add Suggested prompts, shown on Chat hub

Chat Hub 新增了 **Suggested Prompts** 功能，可以在 Chat Trigger 設定幾個建議提示詞，
使用者開新對話時就會看到這些**提示詞**，點一下就自動填入輸入框。

設定方式：
1. 打開 Chat Trigger 節點
2. 開啟 `availableInChat`（讓 workflow 出現在 Chat Hub）
3. 在新的 `suggestedPrompts` 欄位加入提示詞，每個還可以配一個 emoji 圖示

點擊提示詞後不會自動送出，使用者可以先修改再按 Enter，這個設計不錯，可以讓使用者再稍微改一下。

{% darrellImage800Alt "Chat Trigger 節點的 Suggestions 設定，可以加入建議提示詞和 emoji 圖示" n8n-2.11.0-chat_suggested_prompts_setting.png max-800 %}

{% darrellImage800Alt "Chat Hub 顯示建議提示詞，使用者點一下就能開始對話" n8n-2.11.0-chat_suggested_prompts_hub.png max-800 %}

### Data Table 總覽頁搜尋和排序
feat(editor): Add searching and sorting to data table overviews

Data Table 越建越多之後，要找某一張表變得有點麻煩。

這次 Data Table 列表頁面加了 **搜尋框** 和 **排序功能**：
- 搜尋：直接輸入名稱就能篩選
- 排序：可以用名稱、建立日期、大小來排

排序的選擇還會記住，下次打開頁面會自動套用上次的設定。

{% darrellImage800Alt "Data Table 總覽頁新增搜尋和排序功能" n8n-2.11.0-data_table_search_sort.png max-800 %}

### Loop Over Items 的 Replace Me 變更明顯了
Update Replace Me placeholder in Loop Over Items

以前新增 Loop Over Items 節點時，loop 輸出會接一個「Replace Me」節點，
但那個節點長得跟一般節點一樣，我們得把它刪除才能建立我們要的節點

現在改成點一下就能替換，整個流程變順暢很多。
很多人應該不見得會使用右鍵選單的替換節點功能，所以官方直接改成點一下就能換！

{% darrellImage800Alt "以前的 Replace Me 是實心節點，需要先刪除才能換" n8n-2.11.0-loop_replace_me_before.png max-800 %}

{% darrellImage800Alt "現在改成虛線框加號，點擊可以直接更換節點" n8n-2.11.0-loop_replace_me_after.png max-800 %}

## 2.10.0 Pre-release - 2026-02-23

[Github 2.10.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.10.0)

這版是 **2.10.0 Pre-release**，Canvas Chat 終於支援串流回應、Data Table 匯入 CSV 可以先整理欄位、多分頁編輯同一個 workflow 不會再互相覆蓋了。

### Canvas Chat 支援串流回應
feat: Enable streaming in canvas chat

Chat Trigger 的 Response Mode 多了一個 **「Streaming」** 選項，
選了之後回應會像 ChatGPT 一樣**即時串流顯示**。

設定方式：
1. 點開 Chat Trigger 節點
2. Options → Response Mode 選 **「Streaming」**
3. 用 Test chat 測試，就能看到串流效果

對測試 AI Agent workflow 來說蠻有感的，以前需要乾等到所有回覆完成才能看到結果
現在會很快就到回覆，然後他會依序顯示完整的答案

{% darrellImage800Alt "Chat Trigger 新增 Streaming Response Mode，回應即時串流顯示" n8n-2.10.0-canvas_chat_streaming.png max-800 %}

### Data Table 匯入 CSV 可刪除和重命名欄位
editor: Allow discarding and renaming columns during CSV import

之前把 CSV 匯入 Data Table 時，所有欄位全部照吃，
如果有不需要的欄位（像是 phone_number、notes 之類的），匯進去之後還得另外刪除。

現在匯入前會多一個步驟，讓你可以：
- **取消勾選**不需要的欄位
- **重命名**欄位名稱（例如把 `full_name` 改成 `name`）

匯入完就是乾淨的資料，不用再多一道步驟。

{% darrellImage800Alt "CSV 匯入現在可以勾選保留的欄位和重命名" n8n-2.10.0-csv_import_columns.png max-800 %}

### Tab 級別編輯鎖定
feat: Add tab scoped collaboration

以前同一個 workflow 在多個分頁打開，每個分頁都能編輯，
最後存檔的那個會蓋掉其他分頁的改動，超級可怕！
例如原本在第一個分頁改了 A -> B -> C
但另一個分頁改的 A -> D
結果就是 B -> C 都不見

現在同一個 workflow **只有一個分頁能編輯**，
其他分頁會顯示「Editing in another tab」
讓你知道說已經有其他分頁在編輯這個 workflow 了

{% darrellImage800Alt "同一個 workflow 在其他分頁會顯示 Editing in another tab" n8n-2.10.0-tab_scoped_collaboration.png max-800 %}

## 2.9.0 Pre-release - 2026-02-16

[Github 2.9.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.9.0)

這版是 **2.9.0 Pre-release**，Chat Hub 可以掛任何工具了、Sticky Note 終於能自訂顏色、Data Table 下載 CSV 也能排除系統欄位。

### Chat Hub 開放使用所有 n8n 工具
feat(core): Support most tools on Chat hub

之前 Chat Hub 只能用幾個預設的搜尋工具（Google Search、Wikipedia 之類的）
想用其他工具就得自己建 workflow 接 AI Agent。

現在直接開放所有具
可以看到有 **275 個工具**可以選擇
包含 Google Sheets、Gmail、Google Calendar、HTTP Request、甚至 MCP Client Tool 都有。

設定方式：
1. 進 Chat Hub
2. 在輸入框點「+ Tools」
3. 搜尋或瀏覽你要的工具，點「+ Add」
4. 設定好 Credential 就能用了

同一個工具還能建多份不同設定（例如兩個不同的 Gmail 帳號），也可以隨時開關切換。

其實就是把 Chat Hub 從一個單純的聊天介面，變成一個可以直接連到工具使用的小助手。

{% darrellImage800Alt "Chat Hub 現在可以掛載 275 個 n8n 工具，包含 Google Sheets、Gmail 等" n8n-2.9.0-chat_hub_tools.png max-800 %}

### Sticky Note 自訂顏色
feat(editor): Add custom color picker for sticky notes

以前 Sticky Note 只有 7 個預設顏色可以選，workflow 一複雜起來，顏色根本不夠分類。

現在多了 color picker，可以直接選一個自己喜歡的顏色。

對 workflow 管理蠻有幫助的，例如：
- 紅色 = 注意事項
- 綠色 = 已完成的區塊
- 藍色 = 待測試
- 自訂色 = 你自己的分類邏輯

另外貼心提醒：深色模式不能選淺色，會看不到字
感覺之後官方應該會讓我們設定文字的顏色才對，不然淺色跟深色模式顏色會互相衝突。

{% darrellImage800Alt "Sticky Note 新增自訂顏色選擇器，支援色譜選擇和 RGB 輸入" n8n-2.9.0-sticky_note_color_picker.png max-800 %}

### Data Table 下載 CSV 可排除系統欄位
feat(core): Allow downloading data table data without system columns

之前從 Data Table 下載 CSV，系統欄位（id、createdAt、updatedAt）一定會跟著匯出。
如果你只是要純資料，每次都得手動刪這三個欄位，有夠煩

現在下載時會跳出一個選項：**Include system columns (id, createdAt, updatedAt)**
取消勾選就能下載乾淨的資料，不用再後處理。

{% darrellImage800Alt "Data Table 下載 CSV 現在可以選擇是否包含系統欄位" n8n-2.9.0-data_table_download_csv.png max-800 %}

## 2.8.0 Pre-release - 2026-02-10

[Github 2.8.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.8.0)

這版是 **2.8.0 Pre-release**，Chat Hub 終於支援審批按鈕、社群節點在模板裡不再顯示問號、還有 Code Node 的 pairedItem 自動對應修復。

### Chat Hub 支援 Send and Wait 審批按鈕
editor: Support Chat node's 'Send and Wait for Response' mode approval buttons on Chat hub

之前在 Chat Hub 裡觸發包含 Send and Wait 的 workflow，審批按鈕是顯示不出來的。
你只能跑去 email 或其他管道點 Approve，蠻不方便的。

現在 Chat Hub 會直接渲染審批按鈕，點了就能繼續執行 workflow。

設定方式：
1. Chat Trigger 的 Response Mode 設為 **「Using Response Nodes」**
2. 接一個 Chat Node，Operation 選 **「Send and Wait for Response」**
3. Response Type 選 Approval，設定按鈕文字
4. Activate workflow 後從 Chat Hub 觸發

按下按鈕後，workflow 會從 Chat Node 繼續往下跑，你可以用後面的節點判斷使用者按了 Approve 還是 Reject。

{% darrellImage800Alt "Chat Hub 現在支援 Send and Wait 的審批按鈕" n8n-2.8.0-chat_hub_approval_buttons.png max-800 %}

### 模板中未安裝的社群節點可正常預覽
editor: Preview not installed community tools

以前匯入一個用了社群節點的模板（例如 Tavily），如果你還沒安裝那個節點，畫面上就只會顯示一個 **「?」圖示**，沒有連接點，完全看不出這是什麼節點。

現在就算沒安裝，節點也會正常顯示圖示、名稱和連接點，讓你看得懂整個模板的流程結構。
而且可以直接從模板裡安裝缺少的社群節點，不用另外跑去 Settings 找。

{% darrellImage800Alt "未安裝的社群節點現在能在模板中正常顯示圖示和連接點" n8n-2.8.0-community_node_preview.png max-800 %}

### Code Node 聚合輸出自動對應 pairedItem
core: Auto set pairedItem when N input items create 1 output item

這個修復蠻重要的。如果你有用 Code Node 把多筆資料合併成一筆輸出：

```javascript
const items = $input.all();
return [{
  json: {
    total: items.length,
    combined: items.map(i => i.json)
  }
}];
```

之前在後面的節點用 `$('Code').item` 取資料會直接報錯，被迫改用 `$('Code').first()` 繞路。

原因是 Code Node 把多筆合成一筆的時候，pairedItem 的對應關係斷掉了，後面的節點不知道這筆輸出對應到哪筆輸入。

現在 n8n 會自動處理這個對應，`$('Code').item` 可以正常使用了。

{% darrellImage800Alt "Code Node 聚合多筆輸入為單筆輸出時，pairedItem 現在會自動對應" n8n-2.8.0-paired_item_auto.png max-800 %}

## 2.7.0 Pre-release - 2026-02-02

[Github 2.7.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.7.0)

### MySQL 連線錯誤能使用「Continue on Fail」
fix(MySQL Node): Support "Continue on Error" for connection-related errors

以前用 MySQL Node 時，就算開了「Continue on Fail」設定，資料庫連不上時整個 Workflow 還是會直接炸掉。

現在修好了！資料庫斷線或是遇到什麼問題，可以正確的額外處理這個錯誤

{% dataTable %}
[
  {"Continue on Fail 設定": "❌ 關閉", "資料庫斷線時的行為": "正常拋出錯誤，Workflow 停止"},
  {"Continue on Fail 設定": "✅ 開啟", "資料庫斷線時的行為": "輸出錯誤訊息，Workflow 繼續執行"}
]
{% enddataTable %}

這樣就能做備援流程了，例如：資料庫掛掉時發 Slack 通知、改用快取資料、或記錄 Log 等待之後重試。

{% darrellImage800Alt "MySQL Node 的 Continue on Fail 現在對連線錯誤也有效了" n8n-2.7.0-mysql_continue_on_fail.png max-800 %}

### FormTrigger 新增 IP 白名單功能
feat(FormTrigger Node): Support ip filtering for the FormTrigger node

如果你有用 FormTrigger 做內部表單，之前只能靠 Basic Auth 保護。問題是：帳密要分享給所有同事，而且每次填都要輸入，蠻麻煩的。

現在多了一個選項：**IP 白名單**。
設定方式：Form Trigger Node → Options → IP(s) Allowlist

支援的格式：
- 單一 IP：`203.1.2.3`
- 多個 IP：`203.1.2.3, 10.0.0.5`（逗號分隔）
- CIDR 網段：`192.168.0.0/16`、`10.0.0.0/8`
- IPv6：`2001:db8::/32`

不在白名單內的 IP 會直接收到 403 Forbidden 錯誤，連表單都看不到。

適合的場景：
- 內部簽核：限公司對外 IP
- 合作夥伴：限對方公司 IP
- 測試環境：限開發團隊 IP 或 VPN 網段

{% callout info %}
IP 白名單就是「只允許特定 IP 進入」的門禁清單。每台連上網路的裝置都有一個 IP 位址，就像門牌號碼一樣。設定白名單後，只有名單上的 IP 才能打開你的表單，其他人連頁面都看不到。
{% endcallout %}

{% darrellImage800Alt "FormTrigger 新增 IP 白名單功能，可限制特定 IP 才能存取表單" n8n-2.7.0-formtrigger_ip_allowlist.png max-800 %}

### Crypto Node 金鑰可以存 Credential 管理
feat(Crypto Node): Add credentials for Hmac and Sign operations

以前用 Crypto 節點時，Secret Key 只能直接寫在節點裡面。
這樣有很大的問題：
- 匯出 Workflow 時 Key 會跟著出去
- 執行記錄可能看到 Key

現在 Crypto Node 有專屬的 Credential 類型了！

設定方式：
1. Credentials → Add Credential → 選「Crypto」
2. 填入 Hmac Secret 或 Private Key（看你用哪個功能）
3. Crypto Node 選擇剛建的 Credential

如果你有在用 Crypto Node 驗證 Webhook 簽名（LINE、Stripe 等），建議把金鑰搬進 Credential，更安全。

{% darrellImage800Alt "Crypto Node 現在可以選擇 Credential，不用直接輸入金鑰" n8n-2.7.0-crypto_node_select.png max-800 %}

{% darrellImage800Alt "Crypto Credential 設定頁面，填入 Hmac Secret 後會以密碼形式顯示" n8n-2.7.0-crypto_credential.png max-800 %}


## 2.6.0 Pre-release - 2026-01-27

[Github 2.6.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.6.0)

### AI Agent 的 HITL 工具終於能正常等待
feat(core): Generate HITL tool nodes for sendAndWait operations

{% callout info %}
HITL（Human-in-the-Loop）= 人機協作，讓 AI 執行到某步驟時暫停等人確認
{% endcallout %}

如果你有在用 AI Agent 搭配「人工審核」的工作流程，之前的問題會是：

在下面的 Tool 掛上 Slack 或 Telegram 節點
選了 **Send and Wait for Response**
結果根本沒作用，
因為沒有正確處理「等待」的機制。

現在修好了！

當 AI Agent 呼叫有 sendAndWait 操作的工具時：
1. 會正確暫停執行，發送通知給你
2. 等你回覆後，AI Agent 才會繼續處理

{% dataTable %}
[
  {"情境": "Slack 節點單獨使用 sendAndWait", "以前": "✅ 正常等待", "現在": "✅ 正常等待"},
  {"情境": "Slack 當 AI Agent 工具", "以前": "❌ 不會等", "現在": "✅ 會等了"}
]
{% enddataTable %}

{% darrellImage800Alt "AI Agent 使用 HITL 工具時現在會正確等待人類回覆" n8n-2.6.0-hitl_tool_fix.png max-800 %}

### 工作流程列表頁新增 Unpublish 選項
feat(editor): Add unpublish to workflow list

現在直接在** Workflow列表**就能直接 Unpublish
不用再特地點開 Workflow 來做取消發布

{% darrellImage800Alt "工作流程列表頁新增 Unpublish 選項" n8n-2.6.0-workflow_unpublish.png max-800 %}

### Slack 節點新增 User Group 成員操作
feat(editor): New operations in the Slack node

{% callout info %}
User Group 是 Slack 的群組功能，可以一次 @ 提及整個群組（如 @designers），群組內所有人都會收到通知
{% endcallout %}

{% darrellImage800Alt "Slack User Group 說明：可以一次通知多名使用者" n8n-2.6.0-slack_usergroup_info.png max-800 %}

Slack 節點在 User Group 資源下新增了兩個操作：

**Get Users**：取得 User Group 的成員列表

**Add Users**：把使用者加入 User Group

這對需要管理 Slack 群組成員的自動化場景蠻有用的，例如：
- 新員工入職時自動加入相關群組
- 定期同步部門成員到對應的 User Group

{% darrellImage800Alt "Slack 節點新增 User Group 成員操作" n8n-2.6.0-slack_usergroup_operations.png max-800 %}

## 2.5.0 Pre-release - 2026-01-20

[Github 2.5.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.5.0)

### Data Table Node 新增排序功能
Add Order By feature (Data Table Node)

Data Table 節點內建排序功能

以前如果想要對 Data Table 的資料排序
我通常後面還要接一個 `Sort Node` 來排序資料
現在直接在取資料的同時就能指定**排序方式**

使用方式很簡單：
- **欄位名稱**：選擇你要排序的欄位（例如 `name`、`date`、`amount`）
- **排序方向**：`ASC`（小到大）或 `DESC`（大到小）


{% darrellImage800Alt "Data Table Node 新增 Order By 排序功能" n8n-2.5.0-data_table_order_by.png max-800 %}

### Autosave 自動重試機制
Implement exponential backoff (Autosave)

2.4.x 推出了自動儲存功能，這次針對「儲存失敗」的情況做優化

如果網路不穩或伺服器暫時有問題，自動儲存的功能就會失效
(但使用者的我們可能沒發現！)，結果什麼都沒存到

現在 n8n 會自動幫你重試：
1. 第一次失敗 → 等 2 秒後重試
2. 還是失敗 → 等 4、8、16 秒，最多 32 秒後重試

等待時間會越來越長，給網路和伺服器喘息的空間
一旦網路恢復，就會自動儲存成功

畫面右下角會顯示類似這樣的提示：
{% darrellImage800Alt "Autosave 失敗時會自動重試，顯示 Retrying in 8s" n8n-2.5.0-autosave_retry.png max-800 %}

讓你知道說現在其實還沒存檔，不要任意地關閉視窗或瀏覽器！


### OpenAI 預設模型更新為 GPT-5-mini
Update default model to gpt-5-mini (LmChatOpenAi Node)

OpenAI Chat Model 節點的預設模型從 `gpt-4o-mini` 更新為 `gpt-5-mini`

模型當然是越新越好，隨著 `gpt-5-mini` 已經推出這麼久
終於等到預設模型的改動了！

這只是預設值的更新，你還是能切換成自己需要的模型來使用

{% darrellImage800Alt "OpenAI Chat Model 預設模型改為 gpt-5-mini" n8n-2.5.0-openai_gpt5_mini_default.png max-800 %}

## 2.4.0 Pre-release - 2026-01-12

[Github 2.4.0 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%402.4.0)

### 工作流自動儲存
Autosave workflows

n8n 終於可以**自動儲存**啦！
這肯定是很多人使用 n8n 的第一天就很期待的功能
再也沒有因為忘記存檔而消失的悲劇了

自動儲存的觸發時機：
- 你移動節點位置
- 你修改節點設定
- 你新增或刪除節點

最棒的是這樣要是你編輯到一版想要回到原本的版本
你就可以馬上挑選想要的版本來復原

假設你現在有 1-7 版本
你想要 Restore 回版本2
選擇版本2 Restore 後他就會變成最新的版本 8
你的版本3-7 不會直接消失！

{% darrellImage800Alt "n8n 現在支援工作流自動儲存，不用擔心忘記存檔" n8n-2.4.0-autosave_workflows.png max-800 %}

### 集合 UI 大改版
Overhaul (nested) collection UI

有些節點的設定較為冗長複雜
例如 `HTTP Request` 節點常常就會需要設定一大堆 `Header` `Body` 的 parameters

UI 上做了一點優化，讓整體設定時可以更簡單一點
可以參考下面截圖：

{% darrellImage800Alt "n8n 集合 UI 重構，嵌套結構更清楚" n8n-2.4.0-collection_ui_overhaul.png max-800 %}

### ChatHub 模型選擇改進
Improve model selection dropdown in ChatHub

也是 UI 的優化
過去選擇模型時受限於視窗較小，
遇到像是 `Google` 這種超多模型時，選擇起來就比較麻煩

現在改善了 UI 的呈現方式，看起來有稍微好選一點
重點還支援 **搜尋**功能
直接輸入關鍵字即可！

{% darrellImage800Alt "ChatHub 模型選擇加入搜尋和分組功能" n8n-2.4.0-chathub_model_dropdown.png max-800 %}

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




---

{% articleCard url="/n8n-update-log-v1/" title="n8n 1.0 歷史版本更新紀錄心得（0.x ~ 1.x 存檔）" previewText="完整收錄 n8n 0.x ~ 1.123.0 時代的歷史更新、重要節點演進與測試心得回顧" thumbnail="https://www.darrelltw.com/n8n-update-log/n8n-update_bg.jpg" %}
