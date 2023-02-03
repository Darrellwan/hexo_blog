---
title: GA4 更新 - 加強搜尋列 終於可以用資料串流 ID 來搜尋 GA4 的資源了!
tags:
	- Google Analytics 4
	- GA4 New Release
categories:
	- Google Analytics 4
page_type: post
date: 2023-02-03 20:09:26
description: GA4 更新內容 - 20230130 增強對於 Property資源 和 Account帳戶 的搜尋! 如果你是在代理商管理多個 GA4 資源的情況，或是 GA360 的企業級客戶有多網站和對應的 GA4 資源要維護時，這次的更新算是大大降低的搜尋的困難度。再也不用儲存或維護 GA4 的 DataStream ID (資料串流ID) 和 Property ID (資源ID) 的對照表。
---

{% darrellImageCover GA4的新功能釋出_20230130 ga4_new_release_20230202_bg.png max-800 %}

[GA4 Google 官方文件 20230130](https://support.google.com/analytics/answer/9164320?hl=en#013023&zippy=%2Creleases)

## 搜尋 DataStream 資料串流的方式

可以輸入 Track 或是中文的 追蹤來尋找資源的資料串流資訊

{% darrellImage800 在GA4中搜尋資料串流ID search_track_keyword_in_ga4.png max-800 %}

可以發現中如果只輸入前面幾個字，就沒有辦法搜尋到，**建議可以的話，盡量使用直接複製的方式**

{% darrellImage800 在GA4中搜尋部分的資料串流ID search_part_of_datastream_id_in_ga4.png max-800 %}

{% darrellImage800 搜尋的示意圖 https://storage.googleapis.com/support-kms-prod/lOTXeTgdZWziSMh3y9bMEfOoAsB6gJq5wKWv max-800 %}

## 如何搜尋自已網站上的 GA4 資料串流 ID(Data Stream ID)

1. 從 Google Tag Assistant Legacy 套件查看

[Tag Assistant Legacy (by Google)](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)

{% darrellImage800 從TagAssistantLegacy查看資料串流id look_data_stream_id_in_google_tag_assistant_legacy_extension.png max-800 %}

2. 從 Chrome Devtool 的 Network 中搜尋

{% darrellImage800 從ChromeDevtool的Network查看資料串流id look_data_stream_id_in_devtool_network.png max-800 %}

基本上可以找到一個 G- 開頭並帶英數亂碼的編號應該就沒錯了

## 搜尋資源和帳戶的設定

這邊文件中是說可以搜尋 account 或 property 來直接開啟設定和資訊頁面
但從中文這邊貌似還沒有相對應的搜尋方式
猜測應該是 資源設定 和 帳戶設定
但目前搜尋的結果是無法直接跳轉的

{% darrellImage800 搜尋帳戶和資源文件的示意圖 https://storage.googleapis.com/support-kms-prod/BDyNkRplpaLVMBV34qLE70XOu9gNsMw96hnt max-800 %}

## 很棒的功能 輸入串流ID直接跳轉到對應的資源

如果和很多代理商的夥伴或是自己管理公司或集團內多個網站和 GA4 的安裝部署時
會發現到很多時候要切換處理另一個網站時，通常會有上面的方式找到該網站的資料串流 ID
但以前的 GA4 是無法直接透過 資料串流ID 來找到相對應的 GA4 資源的

自己的做法是維護一份每個網站的 GA4 資源ID 和對應的 資料串流ID，這樣切換網站時只要打開那份表格就可以找到相對應的 GA4 資源
現在 終於 再也不用了!

**找到串流 ID 後，直接切換到 GA4 的畫面，最上方搜尋串流ID 後就可以幫你切換到那個對應的 GA4 資源上**
雖然看似只有省了十幾秒的行為，但其實每次切換上都會讓人覺得異常的麻煩
可以直接跳轉是真的幫助很大 **Thanks you Google**

可惜的是他會打開那個串流 ID 的設定畫面，而不是那個資源的報表首頁，或許未來還會有其他的調整

{% darrellImage800 直接跳轉另一個GA4資源! https://storage.googleapis.com/support-kms-prod/D9Q6W9400z7IymYLEH0YNEVgjq7n1Ejv0YSo max-800 %}