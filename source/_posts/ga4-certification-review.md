---
title: GA4 證照的準備方向
date: 2022-11-06 09:12:01
tags: 
	- Google Analytics 4
	- GA4 證照
description: GA4 的證照已經出現一陣子了，希望能透過這次對於題目的回顧，提供給一些大家準備的方向
categories: 
	- Google Analytics 4
page_type: post
---

{% darrellImage ga4_certification_review_bg ga4_certification_review_bg.png %}

## 自行分類的題目和分佈

再重新看了一次題目後，有自己把 50題分類成下面幾個種類，和出現的題數

<table><thead><tr><td>category</td><td>count</td><td>percentage</td></tr></thead><tbody><tr><td>config or admin</td><td>10</td><td>20.00%</td></tr><tr><td>google product</td><td>8</td><td>16.00%</td></tr><tr><td>report</td><td>7</td><td>14.00%</td></tr><tr><td>dimension or metric</td><td>6</td><td>12.00%</td></tr><tr><td>ga4 feature</td><td>6</td><td>12.00%</td></tr><tr><td>stream or sdk</td><td>4</td><td>8.00%</td></tr><tr><td>report - explore</td><td>3</td><td>6.00%</td></tr><tr><td>360 feature</td><td>2</td><td>4.00%</td></tr><tr><td>attribution</td><td>2</td><td>4.00%</td></tr><tr><td>data source</td><td>2</td><td>4.00%</td></tr></tbody></table>

50 題中需要**答對40題才會及格**，這裡的題目分佈應該每次都不太一樣，建議可以當作一個參考即可

簡單說明一下自己的分類

### Config & Admin : 一些在 GA4 帳戶設定和資源設定的地方
{% darrellImage ga4_admin_config ga4_admin_config.webp %}

這次的佔比這邊佔了蠻大一塊，印象中以前也是差不多這樣子
不過這邊大部分就是測試看看你對於這些設定的地方是否熟悉在哪
建議可以將這些地方都打開來看一看，不太清楚的就搭配文件

### Google Product 連結
{% darrellImage ga4_product_connect ga4_product_connect.png %}

蠻頻繁的會出現 Google Ads 連結的題目
主要的功能有 GA4 的受眾可以直接打包到 Google Ads
並且能在 GA4 看到 Google Ads 的成效
其他如 
    - Search Console : 連結 Google 搜尋的資料
    - BigQuery : Google 的 DataWarehouse，連結後 GA4 會將蒐集到的 raw data 放進去，使用者可以透過 SQL 語言查詢資料
    - 還有 DV360, Merchant Center, Google Play, Search Ads 360 也都是和廣告有關的產品，可以先稍微知道產品本身在做什麼就好

### Report : 內建報表
{% darrellImage ga4_report ga4_report.webp %}

這部分就比較單純，當想看某個東西時，該到哪張報表
雖然有點死背，不過都是一些蠻常見的東西，比較不會特別考一個很少用到的指標維度

### Dimension & Metric : 指標和維度

{% darrellImage ga4_dimension_metric ga4_dimension_metric.png %}
[Google 文件](https://support.google.com/analytics/topic/11151952?hl=zh-Hant&ref_topic=9228654)

用一些例子當作說明
維度(Dimension): 班級 | 指標(Metric): 學生人數
維度(Dimension): 班級 | 指標(Metric): 某科平均分數

回到分析本身，通常可以從一個問句得到裡面的維度和指標
1111 每個**品牌**的**訂單數**
> 品牌就是維度
> 訂單數就是指標

另外也要知道使用者屬性和事件參數的差異
使用者屬性 = UA 舊版GA 的自訂參數(使用者範圍)

自己在思考時通常是判斷這個屬性是否會跟著使用者一直存在
**使用者屬性** -> 會員等級 : 無論這個使用者今天有沒有下單，他的會員等級都是維持在同一個等級，直到他滿足一個條件後才會更改
**事件參數** -> 訂單編號 : 只有在下訂單的當下，才會產生訂單編號

Google 會自動搜集的使用者屬性，也可以當作一些參考 [文件](https://support.google.com/analytics/answer/9268042?hl=zh-Hant)
{% darrellImage ga4_auto_collect_user_property ga4_auto_collect_user_property.webp %}

### GA4 Features : GA4 的新功能和特色

這個分類主要是一些 GA4 才有的新功能
相信很多人都已經從很多網站或介紹中知道相關的資訊
這裡舉例部分的功能和特色

1. GA4 : Event 和 Session 的差異，以前在 UA 中都會以 Session 當作一個主要的維度來分析，
到了 GA4 後，雖然還是有 Session 的概念，不過主要會以 Event 當作分析的維度

2. Google Signal : Google 提供的黑科技來幫助分析使用者資訊
> Google 信號是指來自網站和應用程式的工作階段資料，Google 會將這類網站和應用程式與已登入 Google 帳戶並啟用廣告個人化的使用者建立關聯。將資料與這些已登入使用者建立關聯，是為了啟用跨裝置報表、跨裝置再行銷，以及能將跨裝置轉換匯出至 Google Ads 的功能。

{% darrellImage ga4_new_features ga4_new_features.webp %}

### Data Stream & SDK

新的 Data Stream 也是可以多加理解的地方
因為目前 GA4 支援了多平台的搜集，所以 Data Stream 像是一個控制這些搜集入口的地方
另外也要知道 APP 的搜集資料和網頁不太一樣，需要使用到 APP SDK 來搜集[SDK 文件](https://support.google.com/analytics/answer/9353532?hl=zh-Hant)

至於怎麼使用... 就留給工程師來處理吧
APP 的 SDK 不像網站版可以使用 GTM 自行設定，絕大部分都需要 **開發APP的工程師來實作** 

{% darrellImage ga4_data_stream ga4_data_stream.png %}

### Report - Explore 探索報表

{% darrellImage ga4_explore ga4_explorer.webp %}

Explore 探索報表主要有幾種報表

任意形式探索 - Free-form exploration
路徑探索 - Path exploration
使用者探索 - User exploration
區隔重疊 - Segment overlap
程序探索 - Funnel exploration
同類群組探索 - Cohort exploration

[Google文件](https://support.google.com/analytics/answer/7579450?hl=zh-Hant#zippy=%2Cin-this-article)

這邊建議可以看看文件或是實際去操作一次，
是個強大的功能但需要不少學習成本

{% darrellImage ga4_explorer_6_type ga4_explorer_6_type.webp %}

### 360 Feature - GA 360 的獨有功能

[GA360 的官方文件](https://support.google.com/analytics/topic/10985992?hl=en&ref_topic=9143232)

雖然 GA360 和我們一般使用者的距離很遙遠 $$$
不過題目偶爾都會出現一小部分(一題 or 兩題)

主要可以參考一下 GA360 在配額上提高了多少
以及理解一下 **Roll-up Property(綜覽資源)** 和 **SubProperty(子資源)** 的差異

- Roll-up Property(綜覽資源)
{% darrellImage ga4_rollup_property ga4_rollup_property.webp %}

- SubProperty(子資源)
{% darrellImage ga4_subproperty ga4_subproperty.webp %}
[圖片來源](https://support.google.com/analytics/answer/9679158?hl=zh-Hant#zippy=%2Csubproperties%2Croll-up-properties%2Ccost-considerations%2Cglobal-enterprise-with-regions-and-subregions%2Cparent-company-with-several-brands%2Centerprise-company-with-several-complementary-lines-of-business%2C%E7%B6%9C%E8%A6%BD%E8%B3%87%E6%BA%90%2C%E5%AD%90%E8%B3%87%E6%BA%90%2C%E8%B2%BB%E7%94%A8%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A0%85%2C%E6%93%81%E6%9C%89%E5%A4%9A%E5%80%8B%E5%93%81%E7%89%8C%E7%9A%84%E6%AF%8D%E5%85%AC%E5%8F%B8%2C%E6%95%B8%E6%A2%9D%E6%A5%AD%E5%8B%99%E7%B7%9A%E5%BD%BC%E6%AD%A4%E4%BA%92%E8%A3%9C%E7%9A%84%E4%BC%81%E6%A5%AD)


### Attribution 歸因

主要的歸因模式有下列這些 : 
- 跨管道最終點擊
- 跨管道最初點擊
- 跨管道線性
- 跨管道根據排序
- 跨管道時間衰減

要特別知道的事情是這些歸因都會忽略直接流量(direct)
有關這些歸因的[文件](https://support.google.com/analytics/answer/10596866?hl=zh-Hant#zippy=%2Cin-this-article%2C%E6%9C%AC%E6%96%87%E5%85%A7%E5%AE%B9)

### Data Source 資料來源

除了我們上面有提到 Data Stream 和 SDK 搜集線上的行為資料
還有一些其他的方式來將資料匯入或是送進 GA4 中

- Data Import 資料匯入 [文件](https://support.google.com/analytics/answer/10071301?hl=zh-Hant)
    可以接受 CSV 檔案的上傳
    今年十月的更新中也加入了 SFTP 的上傳!

- Measurement Protocol
    以前 UA 就有的功能，只是 GA4 看起來尚在完善中
    該功能不同於資料匯入，而是讓你可以傳入一些資料 (但無法從你的網站上搜集到的)
    > 1. 例如商家的 POS 機 (刷條碼的那台機器)
    > 2. 表單的送出成功 (如果你的表單是送到自己的伺服器，並且無法從網站得知是否有送出成功，就會考慮請工程師從伺服器端利用 Measurement Protocol 直接送資料到 GA4 中)

希望這些整理資料有所幫助，後續也會持續更新一些新資訊到這邊來
