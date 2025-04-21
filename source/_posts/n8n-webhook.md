---
title: n8n Webhook 節點
tags:
  - n8n
  - Webhook
  - API
  - 自動化
categories:
  - n8n
page_type: post
id: n8n-webhook
description: 一起來學 n8n Webhook 打造自動化流程！設定接收、處理資料，並提供案例和程式碼範例。
bgImage: blog-n8n-webhook-bg.jpg
preload:
  - blog-n8n-webhook-bg.jpg
date: 2025-03-19 18:01:02
---
{% darrellImageCover blog-n8n-webhook-bg blog-n8n-webhook-bg.jpg max-800 %}

## Webhook 節點

n8n 的 webhook 節點應該是 Trigger 節點中前三名常用的節點，另外還有 Schedule 的排程也是熱門的節點

Webhook 用白話文來說就是一個接收器，Webhook = Web + Hook，可以想像成網路世界的釣竿或鉤子
當有資訊傳送到這個鉤子時，他就會把這個資訊拉出來，讓你可以做後續的處理

{% darrellImage800 n8n-webhook_example_diff_api_webhook n8n-webhook_example_diff_api_webhook.png max-800 %}

這邊是之前寫過介紹 API 和 Webhook 差異的文章!
{% articleCard 
  url="/google-app-script-test-webhook/" 
  title="Google App Script 測試 Webhook 的串接" 
  previewText="使用 Google App Script 的 doGet, doPost function 來測試收到 get post request 的情形，很常利用在一些 webhook 的串接時想要有個臨時的地方測試" 
  thumbnail="https://www.darrelltw.com/google-app-script-test-webhook/API.png" 
%}

### 為什麼需要使用 Webhook？

Webhook 在自動化工作流程中扮演著關鍵角色，特別適用於以下場景：

1. **接收資料**：當外部系統有新事件發生時，可以立即通知你的 n8n 工作流程
2. **建立簡單的 API 端點**：快速建立接收和處理資料的端點，無需寫複雜的後端 code
3. **處理第三方 callback**：接收來自通訊軟體等服務的 callback 請求

## n8n Webhook 基本設定

### Webhook網址

{% darrellImage800 n8n-webhook-setting_webhook_url n8n-webhook-setting_webhook_url.png max-800 %}

通常建立好一個 webhook 節點後，網址也已經隨機產生好了
上方會看到 Test 和 Production 兩個網址，這兩個網址的差異就是測試時使用的和上線正式環境的不同

兩者的網址長得非常像
中間會有個 `/webhook-test/` vs `/webhook/` 的差異而已

測試和上線時如果需要去調整網址的設定，要留意是否有調整到正確的網址

#### 自定義 webhook 網址

{% darrellImage800 n8n-webhook-setting_webhook_url_customize n8n-webhook-setting_webhook_url_customize.png max-800 %}

不想要亂糟糟的亂數，可以直接修改 **path** 來調整 webhook 網址
但要注意命名上需要特別一點，不要像是 `test` 等未來很容易重複的網址
目前測試同個 workflow 有兩個 webhook 設定一樣的網址，只有新的那個會被觸發
雖然不會造成錯誤，但還是會造成一定程度上的困擾
建議要分開設定

### HTTP 方法選擇


Webhook 節點支援多種 HTTP 方法，包括：
- **GET**：取得資料
- **POST**：提交資料
- **PUT**：更新資源
- **DELETE**：刪除資源
- **PATCH**：部分更新資源
- **HEAD**：類似 GET 但不返回內容

根據需求選擇適合的方法，
如果沒有特殊需求，建議選 GET 或 POST 即可
**經驗上 POST >>> GET**

兩者的差別在於你會接收到什麼資料

GET 通常會接收到 query string 的資料
POST 通常會接收到 body 的資料

{% darrellImage800 n8n-webhook-setting_method n8n-webhook-setting_method.png max-400 %}

### Response

n8n 提供三種回應方式：

#### Immediately
立即回應：不等待工作流程完成，立即返回「Workflow got started」
Webhook 節點在執行後立即回應，回傳預設的回應碼和訊息，例如「Workflow got started」。​

#### When Last Node Finishes
等待最後節點完成：等待整個工作流程執行完成，返回最後節點的資料

Webhook 節點會等待整個工作流程執行完畢後，再回傳最後執行的節點所產生的資料。​

#### Using [Respond to Webhook] Node
使用「回應 Webhook 節點」：通過專門的節點自定義回應內容，最靈活的選項

Webhook 節點會根據工作流程中 'Respond to Webhook' 節點的設定來回應，可以在該節點中自訂回應的內容和格式。

{% darrellImage800 n8n-webhook-response_method n8n-webhook-response_method.png max-800 %}

## 案例：接收來自 Line 的 Webhook 資料

{% darrellImage800 n8n-webhook-line_message_api_webhook n8n-webhook-line_message_api_webhook.png max-800 %}

### 測試連結-Verify

Line 的 Message API 可以啟用 Webhook 
這時就要放入連結來 Verify 
下面用影片來示範如何 Verify 測試環境的連結

比較麻煩的地方是
n8n 在測試時都需要先按下 Listen for test event 
那時候才能被 Post 資料(接收資料)

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1067242382?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Line verify n8n Webhook"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

### 接收 Line 訊息資料

這裡示範如何接受訊息資料，一樣先按下 `Listen for test event` 
然後到 Line 的對話欄中輸入訊息
送出後，n8n 就會收到這筆資料

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1067249970?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8n-line webhook demo receive message"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

### 善用 PIN data

好不容易接受到來自 Line 的 Webhook 資料了
後續要做 n8n 旅程的設定時
如果可以重複使用這筆資料
那請記得要先 `Pin` 起來

後續的旅程調整就可以一直使用這筆資料來觸發
**不需要重複的去 line 發送訊息，超級麻煩**

{% darrellImage800 n8n-webhook-line_message_api_webhook_pin n8n-webhook-line_message_api_webhook_pin.png max-800 %}

{% darrellImage800 n8n-webhook-line_message_api_webhook_pin_flow n8n-webhook-line_message_api_webhook_pin_flow.png max-800 %}

n8n <-> Line Message API 在先前的文章有提過
也有一篇專門介紹 Pin Data 的文章


{% articleCard 
  url="/n8n-line-message-api" 
  title="n8n 用 Request 發送 LINE Message API" 
  previewText="" 
  thumbnail="https://www.darrelltw.com/n8n-line-message-api/n8n-line-message-api-bg.jpg" 
%}


{% articleCard 
  url="/n8n-tips-pin/" 
  title="n8n 小撇步 - Pin Data" 
  previewText="" 
  thumbnail="https://www.darrelltw.com/n8n-tips-pin/n8n_pin_bg.jpg" 
%}

### 常見問題:不能用 localhost 當作網域

如果你的 n8n 不是用 cloud 版本也不是建立在 zeabur 等服務上
而是在本機運行，那通常你可能會覺得你的網域就是 `localhost`

**這個網域是沒辦法當作 webhook 的網址!**

這時候你會需要像是 ngrok 來建立一個臨時的網域
並用這個網域來當作 webhook 的網址



## n8n Webhook Options

{% darrellImage800 n8n-webhook-options n8n-webhook-options.png max-800 %}

Webhook 節點提供了許多的設定選項，
點選 Add Option 就可以看到有哪些設定


### Allowed Origins (CORS)
跨域請求的設定，可以輸入允許的網域清單（用逗號分隔）
預設值是 * ，代表允許所有來源

### Field Name for Binary Data
接收 Binary 資料時，檔案的欄位名稱
通常是 data

### Ignore Bots
忽略來自Bots的請求，例如連結預覽器和網路爬蟲
應該是有一些簡易的檢測機制

### IP(s) Whitelist
IP 白名單功能，可以限制只有特定 IP 才能呼叫 webhook
- 用逗號分隔多個 IP
- 非白名單 IP 會收到 403 錯誤
- 留空則允許所有 IP

### Raw Body
開啟後，會把收到的 Body 資料多回傳一個原始格式

### Response 相關設定
- **No Response Body**：不回傳回應內容
- **Response Code**：設定 Response Code，預設 200
- **Response Data**：自訂回應資料
- **Response Headers**：設定自訂的回應 Headers

## 總結

n8n 的 Webhook 節點非常強大，也很常用到
希望這篇能多少幫助到剛開始嘗試 webhook 節點的朋友

更多的 n8n 資訊也可以到下方追蹤我的 Threads 或是訂閱 Email
有任何問題歡迎到下方的任何一個渠道留言或來信

## 參考資源

- [n8n Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
