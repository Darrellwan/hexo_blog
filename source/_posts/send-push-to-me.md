---
title: Line Notify 結束服務公告，有哪些其他的社群平台可以代替轉移
tags:
  - Development
  - Push Notification
categories:
  - Martech
page_type: post
id: send_push_to_me
description: Line Notify 發佈要停止服務的震撼彈，如果正在使用或是打算使用，這裡整理出幾個可以考慮替代的方案和如何串接
bgImage: push_yourself_bg.png
preload:
  - push_yourself_bg.png
date: 2024-10-08 22:36:11
---

{% darrellImage800 push_yourself_bg push_yourself_bg.png max-800 %}

Discord 是目前設置的經驗來說非常簡單的，基本上沒有什麼複雜的權限和 Key 要注意，
簡單的產生個 Bot 和取得 webhook URL 就可以開始使用了。

## Discord Webhook

### 建立 Bot，取得 webhook網址

{% darrellImage800 setup_discord_webhook_url_quickly setup_discord_webhook_url_quickly.png max-800 %}

只要簡單一個步驟就能快速建立 Bot 和取得 webhook URL

### 發送通知

以 Postman 當作舉例，只要把 URL 換成上面拿到的 webhook URL 
並用下面的範例 json payload 送出即可!
請注意送出後右邊的 response 顯示空白是正常的，只會顯示 Status Code 204 

{% darrellImage800 send_push_to_discord send_push_to_discord.png max-800 %}

iOS 端接收到的通知如下圖

{% darrellImage800 discord_push_in_ios discord_push_in_ios.jpg max-800 %}

{% darrellImage800 push_content_in_discord push_content_in_discord.jpeg max-800 %}

### CURL 語法

```
curl --location 'https://discord.com/api/webhooks/換成你的webhook URL' \
--header 'Content-Type: application/json' \
--data '{
    "content": "測試訊息",
    "embeds": [
      {
        "title": "Embed Title",
        "description": "This is an embed description.",
        "color": 2123412,
        "image": {
          "url": "圖片網址"
        }
      }
    ]
  }'
```

相關的訊息 Payload 可以參考 [Discord API 文件](https://discord.com/developers/docs/resources/webhook#execute-webhook)
例如上方範例使用的就是夾帶了一個 Embed 的 Object 

[Discord embed-object](https://discord.com/developers/docs/resources/message#embed-object)
可以嘗試增加或修改欄位來看看不同的效果

### 預覽調整訊息的工具

下面介紹的工具是如果你想要建立一個較複雜的訊息
想要有個地方先排版或預覽訊息的樣式
那可以先到這些工具的介面來調整
最後複製 JSON payload 回去程式端發送

https://discohook.org/

{% darrellImage800 discohook_website discohook_website.png max-800 %}

https://toolscord.com/webhook

{% darrellImage800 toolscord_website toolscord_website.png max-800 %}

文章後續會加上 Slack 和 Telegram 的介紹，
如果內容有幫助歡迎訂閱，會在補完後發送 Email 通知!

## Telegram Bot Webhook

### 找 BotFather 建立 Bot

在 Telegram 中可以搜尋到 BotFather，開始聊天後他就會詢問你是否要建立 Bot
{% darrellImage800 telegram_find_botfather telegram_find_botfather.png max-800 %}

會有個互動式對話引導你建立
1. 輸入 /newbot
2. 輸入 Bot 的名稱
3. 輸入 Bot 的 username (username 需要是唯一的，並且要是 bot 結尾)
4. 最後會提供 API Token
{% darrellImage800 telegram_create_bot telegram_create_bot.png max-800 %}

### 和 Bot 一起建立群組，取得 chat_id

這邊會是比較麻煩的地方
好像需要先和 Bot 一起建立一個群組或是 Channel
並且用 getUpdates 來取得 chat_id

```
https://api.telegram.org/bot{剛剛取得的API Token}/getUpdates
```

發送後會拿到一個 JSON 的 response
```JSON
{
    "ok": true,
    "result": [
        {
            "update_id": xxx,
            "message": {
                "message_id": 4,
                "from": {...},
                "chat": {
                    "id": -1111111111, // 需要的 chat_id
                    "title": "DarrellTW_webhook",
                    "type": "group",
                    "all_members_are_administrators": true
                },
                "date": 1728343722,
                "group_chat_created": true
            }
        }
    ]
}
```
### 發送訊息給 Telegram Bot

利用 Postman 發送訊息給 Telegram Bot
```
POST https://api.telegram.org/bot{剛剛取得的API Token}/sendMessage
```
{% darrellImage800 send_api_to_telegram_in_postman send_api_to_telegram_in_postman.png max-800 %}

發送成功後，訊息通知就會顯示在電腦和手機上
{% darrellImage800 telegram_bot_message_in_iphone telegram_bot_message_in_iphone.jpg max-800 %}
{% darrellImage800 telegram_bot_message_in_mac telegram_bot_message_in_mac.png max-800 %}

### CURL 語法

```
curl --location 'https://api.telegram.org/bot{剛剛取得的API Token}/sendMessage' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'chat_id=-1111111111' \
--data-urlencode 'text=Hello, this is a test message!'
```

### 訊息 Payload 文件

[Telegram Bot API - sendMessage](https://core.telegram.org/bots/api#sendmessage)

目前沒有找到一些可以預覽調整訊息的工具或服務，
有找到一個 GitHub 上的專案，但因為更新時間已經是八年前，就沒有深入研究了
網址 [Playground](https://github.com/nadam/playground)

提供一個請 chatGPT 幫忙產生的 payload
```
{
  "chat_id": "-4545338933",
  "text": "\uD83D\uDC4B *歡迎！* \n\n\uD83C\uDFC3\u200D\u2642\uFE0F *快速操作：*",
  "parse_mode": "MarkdownV2",
  "disable_web_page_preview": true,
  "reply_markup": {
    "inline_keyboard": [
      [
        {
          "text": "\uD83D\uDC68\u200D\uD83C\uDFEB 聯繫我們",
          "url": "https://t.me/username"
        },
        {
          "text": "\u2B50 給我們評價",
          "callback_data": "rate_us"
        }
      ],
      [
        {
          "text": "\uD83D\uDD17 瀏覽我們的網站",
          "url": "https://example.com"
        }
      ]
    ]
  }
}
```
訊息的樣式會是:
{% darrellImage800 advanced_telegram_message_payload advanced_telegram_message_payload.png max-800 %}



