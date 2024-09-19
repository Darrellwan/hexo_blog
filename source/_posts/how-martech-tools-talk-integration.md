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
<a href="https://segment.com/"><i class="fa-solid fa-link"></i><span> Segment CDP </span></a> 這套系統中
幾乎市面上較有國際知名的工具都已經是他內建串接的範圍內
如果這些其他工具剛好都是你們公司或企業有在使用的
那在串接上一切就會變得簡單
甚至他也提供了多種選項讓你排除過濾不想要串接的部分

{% darrellImage800 segment_cdp_catalog segment_cdp_catalog.png max-800 %}
這裡有提供他們列出的所有可串接的工具
<a href="https://segment.com/catalog/"><i class="fa-solid fa-link"></i><span> Segment Catalog </span></a>

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
<a href="https://onesignal.com/"><i class="fa-solid fa-link"></i><span> OneSignal </span></a> 在文件中提到的 <a href="https://documentation.onesignal.com/docs/event-webhooks"><i class="fa-solid fa-link"></i><span>  Webhook 有支援的事件 </span></a>
{% darrellImage800 onesignal_webhook_event onesignal_webhook_event.png max-800 %}

流程有大概兩個步驟
第一步驟是一樣需要設立一個 Server 或 Saas 服務當作 Endpoint 
會像是一個網址
```
https://my-service-to-receive-webhook.a.run.app/onesignal
```
第二步驟是到行銷工具平台 如 OneSignal 在設定需要收到通知的事件
以圖片舉例，簡訊或是Email 通知等等，要在發送、送達、點擊、發送失敗、取消訂閱的時候回傳這個事件到我們的 Endpoint 中
我們就能在第一步驟啟動的 Server 中接收到這些事件，並且轉寫成我們其他平台需要的資料來回拋


## 4. 其他串接方式：花錢買串接服務、省下工程人力和維護成本
{% darrellImage800 martech_integraion_ipaas martech_integraion_ipaas.png max-800 %}

Zapier 或許是一個蠻多人已經有聽過或是正在使用的工具，
他其實屬於一種 iPaaS 的服務，iPaaS 是基於雲端的整合平台，
提供簡單的拖放式介面，讓行銷人員也能輕鬆進行應用整合。

{% darrellImage800 zapier_website_demo_mailchimp_hubspot zapier_website_demo_mailchimp_hubspot.png max-800 %}
以這個圖片來說，Zapier 提供了 Mailchimp 和 Hubspot 的串接
當 Mailchimp 有新的特定訂閱者時，Zapier 會接收到這個資訊，並且幫忙把這個新的聯絡人加入到 Hubspot 中
背後的原理就是 Zapier 在接收 Mailchimp 的 Webhook 後，把資料轉換成 Hubspot 的 API 格式後送出給 Hubspot
幫忙處理這些中間麻煩的串接，並收取費用

## 5. 如何選擇適合的串接方式

### 首選: 內建串接

會優先選擇內建串接主要是因為它就是**最簡單方便且不用額外付費**
相信 99% 的場景下使用內建串接都能解決問題
特別案例只有內建串接的資料多了或少了另一個平台工具非常重要的資料或欄位
才會放棄內建串接來選擇 API、Webhook 等其他方式串接

### 替代選擇: API、Webhook、Zapier

當使用的平台工具沒有提供內建串接，
這時就只能選擇 API、Webhook、Zapier 等其他串接方式

有工程資源: API 和 Webhook 
好處是維護成本的費用較低，基本上都會低於 Zapier 這種服務
只是也可能需要把工程師的時間成本也考量進去

沒有工程資源且有預算: Zapier
Zapier 應該能應付大部分的串接需求，台灣這邊如果使用的是一些台灣當地的行銷科技平台，
就比較有可能不在 Zapier 的串接範圍內，雖然 Zapier 也有提供一些服務可以模擬 API Webhook 的功能來串接，但對於非技術背景的人來說就算有拖拉式的 UI 可能也沒那麼好上手



