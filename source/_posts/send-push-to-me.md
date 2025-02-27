---
title: Line Notify 結束服務，轉移到 Slack、Telegram、Discord
tags:
  - Development
  - Push Notification
categories:
  - Martech
page_type: post
id: send_push_to_me
description: Line Notify 宣布要停止服務，如果正在使用或是打算使用，替代方案和如何串接 Slack、Telegram、Discord 
bgImage: push_yourself_bg.jpg
preload:
  - push_yourself_bg.jpg
date: 2024-10-07 22:36:11
modified: 2025-01-22 11:18:11
---

{% darrellImageCover push_yourself_bg push_yourself_bg.jpg max-800 %}

## 前言

[LINE Notify結束服務公告](https://notify-bot.line.me/closing-announce)

Line Notify 宣布要停止服務了，
預計於 **2025年3月31日結束**，
需要轉移的大家，剩下五個多月可以轉移

自己原本比較常使用 Slack 來做類似的推播，同時也串了 Line Notify
在 Thread 上轉貼訊息後發現很多人也推薦其他的服務像是 Telegram、Discord 等等

<div id="thread_post" style="display: flex; justify-content: center; margin: auto; padding: auto;">
<blockquote class="text-post-media" data-text-post-permalink="https://www.threads.net/@darrell_tw_/post/DAz8OChy_-9" data-text-post-version="0" id="ig-tp-DAz8OChy_-9" style=" background:#FFF; border-width: 1px; border-style: solid; border-color: #00000026; border-radius: 16px; max-width:540px; margin: 1px; min-width:270px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"> <a href="https://www.threads.net/@darrell_tw_/post/DAz8OChy_-9" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%; font-family: -apple-system, BlinkMacSystemFont, sans-serif;" target="_blank"> <div style=" padding: 40px; display: flex; flex-direction: column; align-items: center;"><div style=" display:block; height:32px; width:32px; padding-bottom:20px;"> <svg aria-label="Threads" height="32px" role="img" viewBox="0 0 192 192" width="32px" xmlns="http://www.w3.org/2000/svg"> <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" /></svg></div> <div style=" font-size: 15px; line-height: 21px; color: #999999; font-weight: 400; padding-bottom: 4px; "> 由 @darrell_tw_ 發佈</div> <div style=" font-size: 15px; line-height: 21px; color: #000000; font-weight: 600; "> 在 Threads 查看</div></div></a></blockquote>
<script async src="https://www.threads.net/embed.js"></script>
</div>

## Discord Webhook

Discord 是目前設置的經驗來說非常簡單的，基本上沒有什麼複雜的權限和 Key 要注意，
簡單的產生個 Bot 和取得 webhook URL 就可以開始使用了。

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

## Slack

### 建立 Slack App

Slack 也是一樣需要先建立個 App，
workspace 這邊可以進入到管理頁面
{% darrellImage800 manage_slack_app_in_workspace manage_slack_app_in_workspace.png max-800 %}

接著就能建立一個 App 了
{% darrellImage800 create_app_in_slack create_app_in_slack.png max-800 %}

要開啟 Incoming Webhook 的功能
{% darrellImage800 enable_webhook_in_slack_app enable_webhook_in_slack_app.png max-800 %}

選擇要傳送的 channel
{% darrellImage800 select_channel_for_webhook_push select_channel_for_webhook_push.png max-800 %}

最後就能拿到這個 Webhook URL 
{% darrellImage800 slack_get_webhook_url slack_get_webhook_url.png max-800 %}

### 發送訊息給 Slack Bot
介面上面很貼心就已經附上了 CURL 語法測試
{% darrellImage800 send_slack_via_postman send_slack_via_postman.png max-800 %}

成功就會看到訊息跟通知，並且回傳一個 Status Code 200 加上 ok 非常簡潔有力的回應
{% darrellImage800 slack_notification_in_ios slack_notification_in_ios.jpg max-800 %}

### CURL 語法
```
curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/{換成你的webhook URL}'
```

### Slack Block Kit Builder

[Block Kit Builder](https://app.slack.com/block-kit-builder/)
可以用來排版訊息格式的工具，並且也內建了多個模組可以選擇!
{% darrellImage800 slack_block_kit_builder slack_block_kit_builder.png max-800 %}

測試時按下右上角的 Send to Slack 按鈕，
就能即時看到送出的訊息會長什麼樣子

列出幾個模組提供參考
{% darrellImage800 slack_block_kit_builder_templates slack_block_kit_builder_templates.png max-800 %}

這邊是我用來推播給自己氣象資訊用的格式
{% darrellImage800 darrelltw_slack_message_usage darrelltw_slack_message_usage.png max-800 %}


## Line Messagge API

如果你的需求或環境不適合轉移到其他服務平台上
且願意付費，那 Line Messagge API 就是唯一的最佳解

### 計費

{% darrellImage800 line_message_api_pricing line_message_api_pricing.png max-800 %}

免費方案是 200 次發送/$0/月
中用量 3000 次發送/$800/月
高用量 6000 次發送/$1200/月

### 使用方式

由於這需要技術上的串接，
我的另外一篇有提到如何用 n8n 這個自動化工具來串接 Line Messgae API

{% articleCard 
  url="/n8n-line-message-api/" 
  title="n8n 串接 Line Messgae API" 
  previewText="Line Notify 的替代方案之一 Line Message API，介紹怎麼用 n8n 的 Request 來發送和接收 webhook，也會提供模板範例" 
  thumbnail="https://www.darrelltw.com/n8n-line-message-api/n8n-line-message-api-bg.jpg" 
%}
