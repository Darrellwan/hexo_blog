---
title: Line Notify 取消服務，有哪些其他的社群平台可以代替轉移
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

## Discord

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

### CURL 語法提供

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