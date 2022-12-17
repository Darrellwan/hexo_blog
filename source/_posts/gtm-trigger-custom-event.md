---
title: Google Tag Manager - 觸發條件 自訂事件 (Custom Event)
date: 2022-11-01 21:12:21
tags:
	- Google Tag Manager
	- GTM Tutorial
	- GTM 教學
description: Google Tag Manager 中的觸發條件(Trigger), 要如何設定自訂事件(Custom Event)來對應 Datalayer 中的事件
categories: 
	- Google Tag Manager
page_type: post
---

{% darrellImageCover trigger_custom_event_bg trigger_custom_event_bg.png %}

## 觸發條件 : 自訂事件

{% darrellImage trigger_custom_event trigger_custom_event.png %}

Google Tag Manager 中的有個觸發條件的類型是 **自訂事件**
這類型對於大部分的來說相對陌生，因為這算是搭配 DataLayer 使用的一個條件

以 [Google Merchandise Store](https://shop.googlemerchandisestore.com/Google+Redesign/Apparel/Google+Bike+Party+Sticker+Sheet) 舉例 
截圖顯示的是一個 **add_to_cart** 的事件，並且也攜帶了關於這個加入購物車的相關資料

{% darrellImage datalayer_demo datalayer_demo.webp %}

如果發現自己的網站也有類似的資料出現，其實透過自訂事件的 trigger，就可以輕鬆利用這個事件的時間點來觸發 Tag(代碼)
不用再額外設定一些如點擊的追蹤等等

[想參考更多 DataLayer 相關文章?](https://www.darrelltw.com/?q=datalayer&from=post)

## 設定流程

以剛剛的 add_to_cart DataLayer 舉例
如果在 預覽模式 底下看到網站有類似的 event 出現
就可以用來設定 觸發條件

{% darrellImage add_to_cart_datalayer add_to_cart_datalayer.png %}

新增一個 自訂事件 的觸發條件

{% darrellImage set_up_custom_event set_up_custom_event.png %}

並在事件名稱中填入 DataLayer 出現的 event name
請直接複製貼上並確認一模一樣

舉凡空格，大小寫不一樣等等都會讓設定失效

然後，就完成了。

設定這個觸發條件基本上就是這麼簡單，搭配 DataLayer 完整的部署將會大幅降低 GTM 的實作複雜程度

## 確認設定是否成功

接下來就是要綁定這個觸發條件來測試是否成功了
只要在想要觸發的代碼 Tag 上綁定剛剛建立的觸發條件 Trigger

{% darrellImage bind_trigger_with_tag bind_trigger_with_tag.webp %}

重新預覽後，看到先前檢查 DataLayer 的時機點中有觸發 Tag
就代表設定成功!

{% darrellImage test_success_in_preview test_success_in_preview.png %}
