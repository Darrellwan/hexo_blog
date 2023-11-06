---
title: GA4 報表有時候數字對不起來，很有可能是遇到資料閾值 
date: 2023-11-04 17:57:34
tags:
	- Google Analytics 4
categories:
	- Google Analytics 4
page_type: post
description: GA4 的報表加一個維度後，數字就對不起來了，這個非常反直覺的問題來自於 Google 的 Thresholds 資料閾值。
---

{% darrellImageCover ga4-data-thresholds_bg ga4-data-thresholds_bg.png max-800 %}

## 問題: 報表上的小提示

如同官方文件提供的截圖，其實有時候無論是內建報表或是探索報表，當遇到資料閾值或是其他可能的狀況時都會有這個小圖示提醒你

{% darrellImage800 ga4-data-thresholds-example-from-document ga4-data-thresholds-example-from-document.png max-800 %}

## 報表的數字會變動

舉一個實際的情境

在探索報表拉了一個維度，指標使用 使用者
Total Users 是 4377

{% darrellImage800 one_dimension_with_users one_dimension_with_users.png max-800 %}

但只要加上一個維度 例如性別
Total Users 就只剩下 3802

{% darrellImage800 city_dimension_and_gender_with_users city_dimension_and_gender_with_users.png max-800 %}

**一樣的條件，一樣的時間範圍，只是加了一個維度數字就突然對不上**

此時也可以看到右上角跳出了警告的圖示，意思是 GA4 已經為這份報表套用 資料閾值 了

{% darrellImage800 alt explorer_report_shows_data_thresholds.png max-800 %}

## 建議做法

因為資料閾值是無法避免的，想要解決只有目前官方建議的下列方式:

### 調整日期範圍

把日期範圍拉大，盡量讓資料量越多來超來超過這個閾值

例如閾值是 50，只有當這條資料超過 50 時才會顯示

這點對流量比較小的使用者來說就比較麻煩了

### 匯出至 BigQuery

這個做法的原理是

Google Signal 的資料並不會匯出到 BigQuery

所以 BigQuery 可以算出較原始的資料沒錯

但還是會跟你在 GA4 上報表看到的會有落差!

### (最新做法 2023-10更新) 停用報表中的 Google 信號

在 GA4 的設定中多出一個選項

{% darrellImage800 change_apply_google_signal_to_ga4_report change_apply_google_signal_to_ga4_report.png max-800 %}

關掉之後在報表上就會大幅降低遇到資料閾值的問題，

應該是因為 Google 收到了大量來自使用者關於報表資料的問題和反饋後，就把這個選擇的權利重新賦予回了使用者身上。

### 更換報表識別模式

也可以在資源的設定中找到報表的識別類型

這邊也可以選擇 `依據裝置` 

只會以裝置ID來判斷使用者(會比較接近瀏覽器的數量，用Cookie來判斷)

不過要是帳號有在使用 user_id 來判斷使用者登入跨裝置，這個方式就會稍微失真，所以也不是一個最好的做法，

觀察完數字後還是記得要切回原本的選項比較好。

{% darrellImage800 change_report_identity change_report_identity.png max-800 %}

## 未來展望

盡管 Google 在 2023年10月 釋出了更新讓使用者們選擇是否要在報表套用 Google Signal 的資料來解決資料閾值的問題，

但還是希望未來有更簡便的作法，例如在報表上可以直接切換，或是用更直觀的方式呈現數字不同是因為資料閾值。

國外的技術論壇 StackOverflow 也常常會有人問到類似的問題 [google analytics 4 api dimension restricting metrics](https://stackoverflow.com/questions/77332638/google-analytics-4-api-dimension-restricting-metrics/77343729)


