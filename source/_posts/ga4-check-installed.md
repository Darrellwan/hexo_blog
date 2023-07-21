---
title: 檢查網站是否安裝 GA4
date: 2023-07-21 22:47:54
tags:
	- Google Analytics 4
categories:
	- Google Analytics 4
page_type: post
description: GA4 的強制升級和 UA 的停止蒐集資料已經從七月一號開始了，雖然很多人的舊版UA其實都還是有持續在蒐集資料，這並不是 Google 又有延期，官方的意思是這個程序需要一段時間，所以會在未來有一天慢慢的停止。本文希望幫助對於 GA4 不熟的人怎麼快速且正確地確認是否網站已經有安裝 GA4，沒有的話可以趕快找到相關負責的人或是自己趕快完成 GA4 的安裝。
---

{% darrellImageCover GA4的新功能釋出使用者購物歷程報表 ga4-check_installed.png max-800 %}

如果到這個階段還不確定自己網站是否已經安裝 GA4，那其實蠻有可能就是平常比較少在觀察 GA 數據的用戶，或是沒有叫專職的行銷人員甚至工程師在幫忙維護這塊，亦有可能都是由廠商在幫忙維護。
所以想說可以提供一些簡單的方法確認網站是否有安裝 GA4，以及是否自己有相關的 GA4 的權限。
至少發現如果真的沒已，還可以立刻動起來去處理好這件事情，以免等到真的舊版 UA 停止蒐集了資料，又想看資料卻沒資料可以查看時就會有點可惜。


## 用 Analytics Debugger 套件檢查

先前的文章有提到一個檢查 GA4 和相關網路行銷數據追蹤的工具
[Analytics Debugger 介紹](https://www.darrelltw.com/ga4-gtm-best-tool-analytics-debugger/?internal_from=ga4-check-installed)

如果有安裝這個工具，檢查起來會輕鬆很多

{% darrellImage800 use_analytics_debugger_to_check_measurement_id use_analytics_debugger_to_check_measurement_id.png max-800 %}

只要像圖中一樣在 GA4 的 TAB 中出現一組 **G-** 開頭的亂數，就代表這個網站目前安裝了 GA4 並且在蒐集數據中
例如這張圖就表示有在蒐集
**page_view**
**scroll**
等等事件

如果沒有安裝 GA4 的話就會像是下圖這樣

{% darrellImage800 use_analytics_debugger_and_no_ga4 use_analytics_debugger_and_no_ga4.png max-800 %}

會發現 GA4 的 tab 是半透明或是灰灰的狀態
代表套件沒有偵測到 GA4 的相關追蹤程式碼

## 用 Chrome Devtool 檢查

如果不想安裝套件，或是有些資安較嚴格的公司不允許安裝此類套件
也可以直接使用 chrome 的 devtool 來檢查

只是方法會稍微麻煩一點

0. 打開網頁後，點擊右鍵，有一個檢查

{% darrellImage800 right_click_to_open_chrome_devtool right_click_to_open_chrome_devtool.png max-800 %}

1. 通常會顯示在瀏覽器的右方或下方，並且選擇 network 或是 網路

2. 在搜尋欄位打上 **tid=G-**

3. 只要下方有出現一筆或多筆這樣的資料，就表示蠻有可能有安裝的

{% darrellImage800 check_ga4_request_in_chrome_devtool check_ga4_request_in_chrome_devtool.png max-800 %}

4. 要完整確認是否為 GA4 的追蹤訊號，需要點擊一下這筆資料，並打開 payload (酬載)

{% darrellImage800 use_devtool_to_check_ga4_measurement_id use_devtool_to_check_ga4_measurement_id.png max-800 %}

只要能夠看到這筆資料為

```
collect?v=2&tid=G-xxxxxxxxx
```

**G-xxxxxxxxx** 這個亂數就會是一個 GA4 的 MeasurmentID (評估ID，可以在 GA4 的資料串流中找到)

{% darrellImage800 measurement_id_in_ga4 measurement_id_in_ga4.png max-800 %}

## 確認自己是否有該 GA4 的相關權限

如果上方有找到一組 或可能有多組的 評估ID
可以複製該 ID 到 GA4 中來搜尋

以前文章有提到該段內容
[GA4 更新 - 加強搜尋列 終於可以用資料串流 ID 來搜尋 GA4 的資源了!](https://www.darrelltw.com/ga4-new-release-search-datastream-property-info/?internal_from=ga4-check-installed)

{% darrellImage800 find_ga4_by_measurement_id find_ga4_by_measurement_id.png max-800 %}

簡單來說只要在上方搜尋列貼上這組ID
並且有出現如上圖的選項，點擊後也能順利瀏覽該 GA4 資源的報表和數據，就代表是有權限的
但這邊就不細分是否為管理者或是其他權限了，主要還是以可以檢查到有安裝GA4 和有權限瀏覽資料為主


