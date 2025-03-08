---
title: n8n 用 Request 發送 LINE Message API
tags:
  - n8n
  - Line
categories:
  - Automation
page_type: post
id: n8n-line-message-api
description: Line Notify 的替代方案之一 Line Message API，介紹怎麼用 n8n 的 Request 來發送和接收 webhook，也會提供模板範例
bgImage: n8n-line-message-api-bg.jpg
preload:
  - n8n-line-message-api-bg.jpg
date: 2025-01-16 18:25:40
---
{% darrellImageCover n8n-line-message-api-bg n8n-line-message-api-bg.jpg max-800 %}


## n8n Line Message API Template


[Line Message API : Push Message & Reply](https://n8n.io/workflows/2733-line-message-api-push-message-and-reply/)

{% darrellImage800 n8n_line_message_api_template n8n_line_message_api_template.png max-800 %}

[n8n workflow search result](https://n8n.io/workflows/?q=line%20message%20api)

{% darrellImage800 n8n_line_message_api_template_search_result n8n_line_message_api_template_search_result.png max-800 %}

## 如何使用 n8n Template(影片)

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1047439697?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true&amp;loop=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8n how to use template"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

## Line Messsage API 

Line Notify 即將於 2025-03-31 停止服務，
或是相信之前已經有不少人在使用 Line Message API 來推播
這次由於自動化的需求，就用了 n8n 來串
用起來覺得很方便，或許其他人也有這樣的需求
就打算把它做成一個 **n8n 的 Template**
未來想使用的人可以馬上套用

### Line 後台

首先我們先假設你已經有官方帳號了

Line 的後台其實有兩種，但兩者都會用到
這篇文章會只關注在如果要用官方帳號來發送 Message API
有哪些要注意的地方

1. 官方帳號
[Line OA 官方帳號 後台](https://manager.line.biz/)

{% darrellImage800 n8n_line_oa_platform n8n_line_oa_platform.png max-400 %}
- \- 可以更改顯示名稱和頭像
- \- 可以設定 Webhook

2. 開發者後台
[Line Developer Console](https://developers.line.biz/console/)
{% darrellImage800 n8n_line_developer_console n8n_line_developer_console.png max-400 %}
- \- 可以取得自己的 Line UID
- \- 可以取得不過期的 Token
- \- 也可以設定 Webhook (還多了測試的功能)

### n8n 設定 Webhook 
Developer Console 的 Webhook 設定在這裡，貼上後可以按下 Verify
成功的話會顯示 `Success`
{% darrellImage800 n8n_line_developer_console_set_webhook n8n_line_developer_console_set_webhook.png max-800 %}

從 n8n 取得 Webhook URL:
{% darrellImage800 n8n_line_meesage_get_n8n_webhook_url n8n_line_meesage_get_n8n_webhook_url.png max-800 %}

要注意: n8n 的 webhook 有分兩種: `Test` 和 `Production`
可以先貼上 `Test` 的 URL 來測試，先不要按 Verify
回到 n8n 啟用 Listen for test event 後，再回到 Line 按 Verify

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1047453276?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true&amp;loop=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8n how to test webhook url in line message"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

### 取得 Token
下滑一點就會看到 `Channel access token`
這邊可以產生 `long-lived` 的 Token，意思是指不會過期

會過期的 Token 相對麻煩很多，因為過一陣子要回來更新
相反 `long-lived` 雖然不會過期，**但就要負責保管好，一但被盜用就很麻煩**
要記得回到這邊重新發行一個新的 token

{% darrellImage800 n8n_line_developer_console_get_token n8n_line_developer_console_get_token.png max-800 %}


### n8n 設定 Credentials

拿到 Token 後就能回到 n8n 設定 Credentials 了
設定這個的原因是 Token 在很多 Request 節點都會用到
每次都要貼上 Token 有點麻煩，統一管理比較好

詳細步驟圖解:
{% darrellImage800 n8n_line_set_auth_token n8n_line_set_auth_token.png max-800 %}

注意!
Value 的值需要加上
`Bearer ` 最後的空格也是必須的

### 取得自己的 Line UID

另外在 `Basic` 的下方也會有一個 `Your user ID`
這是你自己的 Line UID，用來做**推播的測試時會用到**
可以先記起來

{% darrellImage800 n8n_line_developer_console_get_token_get_uid n8n_line_developer_console_get_token_get_uid.png max-400 %}

## Line Push Message

Push Message 就是我們主動推播訊息給使用者
可以是單一使用者，或是一個群組，又或是多個甚至所有使用者
{% darrellImage800 n8n_line_send_message_to_different_users n8n_line_send_message_to_different_users.jpg max-800 %}

### Send push message 

[官方文件](https://developers.line.biz/en/reference/messaging-api/#send-push-message)  

發送訊息給單一使用者，也是這個 n8n 範例中的場景
官方範例的 CURL 和解釋:  
```
curl -v -X POST https://api.line.me/v2/bot/message/push \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer {channel access token}' \ // 前面取得的 Channel access token
-H 'X-Line-Retry-Key: {UUID}' \
-d '{
    "to": "${使用者的 Line UID}",
    "messages":[
        { // 第一則訊息
            "type":"text",  // 訊息類別是文字
            "text":"Hello, world1" // 訊息內容
        },
        { // 第二則訊息
            "type":"text", // 訊息類別是文字
            "text":"Hello, world2" // 訊息內容
        }
    ]
}'
```

參數解說:
{% darrellImage800 n8n_line_send_message_api_payload n8n_line_send_message_api_payload.png max-800 %}

- **to: 送給誰(可以是使用者、群組、聊天室)**
  - - 使用者 U 開頭
  - - 群組 C 開頭
  - - 聊天室 R 開頭
- **messages: 訊息內容(一次最多五筆，費用還是只算一則)**
- **notificationDisabled: 是否要推播**
  - - true: 使用者不會收到推播通知
  - - false: 使用者會收到推播通知（除非使用者在 LINE 或裝置上關閉了通知）
  - - 預設值: false
- **customAggregationUnits: 訊息的聚合稱，區分大小寫**

### n8n request 設定

{% darrellImage800 n8n_line_request_send_message n8n_line_request_send_message.png max-800 %}

Request 節點一樣是 Post
網址固定為
`https://api.line.me/v2/bot/message/push`

如上面說明，填入 to: ${使用者的 Line UID}, messages: 訊息內容 就可以發送了喔!

## Line Webhook 事件

[Line Webhook 官方文件](https://developers.line.biz/en/docs/messaging-api/receiving-messages/#webhook-event-in-one-on-one-talk-or-group-chat)

Line Developer Console 的 Webhook 設定了 n8n 的 Webhook URL 之後，我們會收到各式各樣的事件訊息。以下是主要的事件類型：

### Message 事件
- `text`: 收到文字訊息
- `image`: 收到圖片
- `video`: 收到影片
- `audio`: 收到音訊
- `file`: 收到檔案
- `location`: 收到位置資訊
- `sticker`: 收到貼圖

### 好友相關事件
- `follow`: 使用者加入好友
- `unfollow`: 使用者封鎖或刪除好友

### 群組相關事件
- `join`: Bot 被邀請加入群組或聊天室
- `leave`: Bot 被移出群組或聊天室
- `memberJoined`: 新成員加入群組或聊天室
- `memberLeft`: 成員離開群組或聊天室

### 其他事件
- `postback`: 使用者點擊按鈕後的回傳事件
- `beacon`: 使用者進入 LINE Beacon 的範圍
- `accountLink`: 使用者連結帳號的結果
- `things`: IoT 裝置相關事件
- `unsend`: 使用者收回訊息

每個事件都會包含以下基本資訊：
- `type`: 事件類型
- `timestamp`: 事件發生時間
- `source`: 事件來源（使用者、群組或聊天室）
- `webhookEventId`: 事件的唯一識別碼
- `deliveryContext`: 訊息傳遞狀態

### Webhook JSON 範例 

#### Join - Bot 加入群組、聊天室

```json
{
  "body": {
    "destination": "UXXXXXXXXXXXX5",
    "events": [
      {
        "type": "join", // BOT 被邀請加入群組
        "webhookEventId": "01JXXXXXXXXX17M",
        "deliveryContext": {
          "isRedelivery": false
        },
        "timestamp": 1737002845413,
        "source": {
          "type": "group",
          "groupId": "CXXXXXXXXXXXXf" // 群組的 ID
        },
        "replyToken": "2XXXXXXXXXXXXd",
        "mode": "active"
      }
    ]
  }
}
```



#### Message - Bot 接收到訊息
```json
{
  "body": {
    "destination": "UXXXXXXXXXXXX",
    "events": [
      {
        "type": "message", // 收到訊息
        "message": {
          "type": "text",
          "id": "5XXXXXXXXXXX6",
          "quotedMessageId": "5XXXXXXXXXXX4",
          "quoteToken": "sXXXXXXXXXXXA",
          "text": "@使用者名稱 \n應該XXXXXXX", // 訊息內容
          "mention": { // 因為訊息有提到某個使用者，所以會有 mention 的資訊
            "mentionees": [
              {
                "index": 0,
                "length": 11,
                "userId": "UXXXXXXXXXXXX",
                "type": "user",
                "isSelf": false
              }
            ]
          }
        },
        "webhookEventId": "0XXXXXXXXXXXX6",
        "deliveryContext": {
          "isRedelivery": false
        },
        "timestamp": 1736899005863,
        "source": { // 來自哪裡，哪個群組和哪個使用者發送的
          "type": "group",
          "groupId": "CXXXXXXXXXXXX",
          "userId": "UXXXXXXXXXXXX"
        },
        "replyToken": "5XXXXXXXXXXXX", // 如果要回覆，需要這個 Token
        "mode": "active"
      }
    ]
  }
}
```

### Webhook 用途

最直接的用途就會是下面用到的 Reply API
Webhook 資料有 `replyToken`
就可以用在 Reply API 

多加一些資料判斷後
就能做到例如:
只要有人傳送了 包含或等於 "XXX" 那 Bot 就會執行什麼任務並回傳特定訊息

{% darrellImage800 n8n_line_reply_api_with_reply_token n8n_line_reply_api_with_reply_token.png max-800 %}

## Line Reply API

[Reply MessageAPI 官方文件](https://developers.line.biz/en/reference/messaging-api/#send-reply-message)

參數的介紹:
{% darrellImage800 n8n_line_reply_api_payload n8n_line_reply_api_payload.png max-800 %}

### n8n request 設定

{% darrellImage800 n8n_line_reply_api_n8n_setting_request n8n_line_reply_api_n8n_setting_request.png max-800 %}

新增一個 Request 後
網址固定為 `https://api.line.me/v2/bot/message/reply`
Method 選擇 `POST`

Body JSON:
```
{
  "replyToken": "{{ $('Webhook from Line Message1').item.json.body.events[0].replyToken }}",
  "messages": [
    {
      "type": "text",
      "text": "收到您的訊息 : {{ $('Webhook from Line Message1').item.json.body.events[0].message.text }}"
    }
  ]
}
```
{% darrellImage800 n8n_line_reply_api_n8n_setting_request_json n8n_line_reply_api_n8n_setting_request_json.png max-800 %}

這個示範是直接回傳收到的訊息內容
示意圖:
{% darrellImage800 n8n_line_reply_api_n8n_setting_request_json_result n8n_line_reply_api_n8n_setting_request_json_result.png max-400 %}

---

以上就是這次 Line Message API <-> n8n 的分享
如果操作上有問題，歡迎透過下方社群連結或信箱聯絡




