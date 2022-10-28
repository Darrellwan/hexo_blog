---
title: Google Tag Manager - Using Ecommerce Datalayer directly in GA4 Event tag
date: 2022-08-25 22:00:00
tags: 
	- Google Tag Manager
	- Google Analytics 4
description: Google Tag Manger 發布新功能，可以在 Google Analytics 4 的 Tag 中直接使用 Ecommerce 的 DataLayer，再也不用重新設定一個額外的 DataLayer Variable For Items
categories: 
	- Google Tag Manager
page_type: post
---

{% darrellImageCover gtm_tag_with_ecommerce_datalayer ./gtm_tag_with_ecommerce_datalayer.png %}

---

# GA4 Tag 支援使用 Ecommerce Datalayer

在逛 Linkedin 時看到 Google Tag Manager 領域中的大神 [Simo Ahava](https://www.linkedin.com/in/simoahava/) PO 了一篇關於 [Google Tag Manager 的新功能](https://www.linkedin.com/posts/simoahava_two-potentially-very-very-helpful-additions-activity-6968136889128136704-Y13t)

簡單來說就是 Google 在 GTM 中支持了兩種新功能
1. 先前我們提到的 [GA4 Ecommerce DataLayer 佈署](https://www.darrelltw.com/ga4-ecommerce-recommend-events-datalayer/?from=gtm-ga4-new-feature-use-ecommerce-datalayer)，在 GA4 Tag 要使用時，得額外建立一個 Variable 並對應到 Ecommerce 中的 Items，現在終於多了一個選項可以直接請 GTM 參考 Datalayer，或是使用額外準備好的 DataLayer variable 來讀取電子商務相關參數! 大大節省了相關的設定時間。

2. 新版的 Ecommerce DataLayer 現在也可以支援舊版 Universal Analyitcs 的 Tag 了! 之前在 GA4 和 UA 並行時，通常是保留舊版的電子商務 DataLayer 並且額外佈署一套 For GA4 的 DataLayer，也就是說網站上有可能同時存在兩種，現在 Google 讓 GTM 可以直接讀取新版的 Datalayer 並轉換成 UA 能支援的形式，再也不用請工程師維護兩套 DataLayer 了!

{% darrellImage simo_ahava_linkedin_gtm_new_feature ./simo_ahava_linkedin_gtm_new_feature.webp %}

# 如何在 GA4 Tag 直接使用 Ecommerce Datalayer

## 檢查和確認網站上的 DataLayer
請先在網站上的 Preview Mode 確認一下目前新版的 Datalayer 佈署狀況
會有一個 ecommerce 物件，和 event 一樣在同一層，
ecommerce 物件有 items，並且包含了 item_id, item_name 等相關必要的參數
[Google 的 GA4 Datalayer 文件](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#view_item_details)

{% darrellImage check_current_ecommerce_datalayer ./check_current_ecommerce_datalayer.webp %}

## Tag 裡面設定讀取 Ecommerce Datalayer

這裡使用 view_item_list 這個事件當作舉例，在 ```more setting``` 展開中可以看到 Ecommerce
勾選 Send Ecommerce Data，Source 選擇 Data Layer

中文版 GTM 為 : 
更多設定 -> 電子商務 [v] 傳送電子商務資料
  -> 資料來源  Data Layer

{% darrellImage gtm_tag_with_ecommerce_datalayer ./gtm_tag_with_ecommerce_datalayer.png %}

 ## 完成設定 檢查觸發情形

設定完成後，如果是在 GTM 的預覽模式(Preview) 檢查，可以在 Google Analytics 4 的 Debug View 中確認即時的測試資料，如圖片上中，view_item_list 這個 Event 有正確接收到，並且 Items 中也都有 DataLayer 中包含的 Items 資訊，那就代表成功!

{% darrellImage ga4_debug_view ./ga4_debug_view.webp %}

# 心得

這次的更新算是減少了行銷端或工程師在設定 Google Tag Manager 的複雜程度，
因為以往都得針對每個事件的 Items 額外做一次設定，
(其實如果懂得善用複製 Tag 的方式來做的話也還好)
現在只要確認自己網站的 DataLayer 都沒問題後，一鍵開啟相對應的設定就完成。

但網站上的 DataLayer 是否佈署正確與否更凸顯了重要性，只要有些錯誤卻又無法在短期內修正，
Google Tag Manager 這邊就還是得盡力的去修正。

[Datalayer 的佈署文章請參考](https://www.darrelltw.com/ga4-ecommerce-recommend-events-datalayer/?from=gtm-ga4-new-feature-use-ecommerce-datalayer)


