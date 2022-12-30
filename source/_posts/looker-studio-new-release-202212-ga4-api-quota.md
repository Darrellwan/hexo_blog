---
title: LookerStudio - 新功能釋出 Google Analytics 4 API 使用狀況
tags:
  - Google Analytics 4
  - Looker Studio
categories:
  - Looker Studio
page_type: post
date: 2022-12-30 22:02:57
description: 上個月開始 Google 突然無預警的修正了 Google Analytics 4 的 API Quota 套用在 Looker Studio 上。影響了大量的用戶無法正常使用，但目前看起來 Google 並沒有想要調整回原本的無上限版本。經過一陣子的時間後，Google 推出了一個新功能方便你查詢目前 API Quota 的使用情形，算是在這種大逆風的狀況下推出一點貼心的功能(但你還是不能隨心所欲地一直拉報表或是分享給很多用戶使用)
---

{% darrellImageCover LookerStudio202212新功能 looker_studio_new_release_202212.png max-800 %}

官方討論區關於這個問題的討論和宣達
[Link](https://support.google.com/looker-studio/thread/188075021/announcing-report-editor-improvements-ga4-request-quotas?hl=en)

### GA4 API Quote

首先需要先介紹一下這個 Google Analytics 4 Data API 的 Quota，可能很多人也是因為這次 LookerStudio 產生錯誤後才發現這個東西

[Google Analytics Data API (GA4) 配額](https://developers.google.com/analytics/devguides/reporting/data/v1/quotas)

首先，**一個好的 API 或是穩定的 API 都會有一個合理的配額(Quote)**
通常就是一秒內最多可以呼叫幾次
並且限定一天內多少
一個月內多少
任何一個條件都不能超過。

代表設計 API 的人們希望大家用一個合理的方式來取得資料，而不是隨隨便便就發送好幾千個需求給 API
這樣很容易造成 API 服務的崩潰，變成大家都不能用

有和 Google API 接觸過的開發人員應該就會知道， Google 的 API 在任何地方都是有配額的
多或是少而已，尤其像 Google Analytics 4 Data API 這種肯定全世界都在呼叫的 API

{% darrellImage800 GA4_API_Quota的總表包含GA360 ga4_api_quota.png max-800 %}

其實這邊並不用看得太精細，除非是有需要使用 GA4 Data API 用程式來做資料串接時才需要注意有沒有超過

簡單來說
標準版比較少，360版本肯定比較多，大部分多了五到十倍

### 在 LookerStudio 查詢 GA4 Data API 用量

如果 LookerStudio 有拉一個資料來源為 GA4 的圖表了

{% darrellImage800 在LookerStudio中查看API_Quota find_api_quota_in_lookerstudio.png max-800 %}

點擊這個 **Google Analytics Token Usage**
> 注 : Token 就會對應到文件的 權杖

這裡會顯示一個圖表使用了多少 Token
另外目前整個帳戶和專案各自剩下多少

{% darrellImage800 在LookerStudio中查詢API_Quota looker_studio_show_ga4_quota.png max-800 %}

其實個人或是小團隊使用的確比較難被影響
但如果是代理商是利用 Looker Studio 在提供報表就會比較棘手
另外大規模的公司如果內部多人在使用時也可能會遇到這種問題

只能說至少目前這邊看得到為何 Quota 被用完了，也能查看哪些圖表用得太多
可以重頭檢視一下整個報表呈現上的策略是不是有優化地方

社群上在這功能剛推出時也是哀嚎一片，但 Google 真的沒有想額外調整的感覺，所以被這個限制影響的人只能好好調整報表並期待 Google 未來有沒有修改了

這個年代使用免費的服務時似乎都要想一下，要是哪天這個服務變成付費了或是像這樣有限制的時候
有沒有個緊急的 Back Up Plan 會比較安心

