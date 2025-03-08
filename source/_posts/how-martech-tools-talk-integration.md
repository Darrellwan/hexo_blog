---
title: 行銷科技工具之間的串接
tags:
  - Martech
  - Integration
categories:
  - Martech
page_type: post
id: how-martech-tools-talk-integration
description: 探索行銷科技工具之間的串接方法，無論是內建整合、API、Webhook 還是使用 iPaaS服務，選擇並了解最合適的整合方式
bgImage: how-martech-tools-talk-integration_bg.png
preload:
  - how-martech-tools-talk-integration_bg.png
date: 2024-09-19 21:07:48
---

{% darrellImageCover how-martech-tools-talk-integration_bg how-martech-tools-talk-integration_bg.png max-800 %}

# 系統串接方式介紹

在 Martech 盛行的現在，越來越多的工具推陳處新，工具之間的串接也常常會變成一個重要的問題
這邊介紹幾種工具之間的串接模式，讓大家可以在有串接的需求前，先知道工具本身提供哪些串接的方式
有初步的認識後在跟廠商或工程師提出更為準確的需求，也減少溝通之間的來回

## 1. 內建串接：體驗一鍵串接的美好
{% darrellImage800 martech_integraion_built_in martech_integraion_built_in.png max-800 %}

Built-in 內建串接會是最簡單的方法
每個平台的網站通常會有一頁是介紹自己的串接能力
裡面就會列出可以和自己平台實現一鍵串接的其他平台
大部分都會是其他較有知名度的平台

第一個例子用 Segment CDP
{% darrellImage800 segment_cdp_builtin_integration segment_cdp_builtin_integration.png max-800 %}
從這張圖片可以看到在 
[Segment CDP](https://segment.com/) 這套系統中
幾乎市面上較有國際知名的工具都已經是他內建串接的範圍內
如果這些其他工具剛好都是你們公司或企業有在使用的
那在串接上一切就會變得簡單
甚至他也提供了多種選項讓你排除過濾不想要串接的部分

{% darrellImage800 segment_cdp_catalog segment_cdp_catalog.png max-800 %}
這裡有提供他們列出的所有可串接的工具
[Segment Catalog](https://segment.com/catalog/)

- 優點: 不需要工程師花費心力串接，也沒有額外維護費用
- 缺點: 導入工具前就要評估好目前使用的工具是否都成串接，和該工具開發串接的速度與擴充性

- 場景: CDP 與 發信平台的串接
如果使用的 CDP 與發信平台有內建串接，那其他工具收集到的發信名單(例如網頁蓋板、線下活動等等)
在 CDP 蒐集好名單並且整理好的同時，就會立刻同步到發信平台的工具上
這是 CDP -> 發信平台的串接
另一段的串接例如 發信平台 -> CDP 
那 CDP 就能接收到很多發信平台的資訊，例如使用者取消訂閱，或是使用者是否有開啟信件，點擊信件等等
這樣一來兩個工具就會是個完美的串接閉環

{% darrellImage800 martech_integraion_builtin_with_cdp_email martech_integraion_builtin_with_cdp_email.png max-800 %}

## 2. API：最靈活、但需要工程串接
{% darrellImage800 martech_integraion_api martech_integraion_api.png max-800 %}

圖片上所示，通常需要有工程師來幫忙，並且需要設立一個 Server 或雲服務來當作中間串接的重要角色
會從平台取得資料，並且輸入到需要的地方
或是從資料庫取得資料，然後串接到行銷工具平台

如果沒有上述的內建串接
就要先尋找該行銷工具的 API 串接文件
大部分都會在官網可以找到
或是搜尋關鍵字 + API 
例如用 Amplitude 舉例
{% darrellImage800 chrome_find_amplitute_api_doc chrome_find_amplitute_api_doc.png max-800 %}
{% darrellImage800 amplitute_api_doc amplitute_api_doc.png max-800 %}

- 優點: 可以任意的和自己的資料庫或是其他系統做串接，並且將資料轉換為其他平台工具需要的格式，也能決定只需要同步哪些資料
- 缺點: 需要安排珍稀的工程人力(如果有)，上線後也需要一段時間做測試，同時往後需要維護中間的系統成本(Server or GCP 等雲服務的費用)

## 3. Webhook：最即時的通知事件、也需要工程串接
{% darrellImage800 martech_integraion_webhook martech_integraion_webhook.png max-800 %}

Webhook 其實和 API 是一樣的方式，只是取得資料的方向不一樣
這邊舉例 
[OneSignal](https://onesignal.com/) 在文件中提到的 [Webhook 有支援的事件](https://documentation.onesignal.com/docs/event-webhooks)
{% darrellImage800 onesignal_webhook_event onesignal_webhook_event.png max-800 %}

流程有大概兩個步驟
第一步驟是一樣需要設立一個 Server 或 Saas 服務當作 Endpoint 
會像是一個網址