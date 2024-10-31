---
title: GA4 更新 - Benchmark - 產業資料的基準比較
tags:
  - GA4 Update
categories:
  - GA4
page_type: post
id: ga4-update-benchmark
description: GA4 更新的新功能 Benchmark 基準化資料，可以讓使用者參考類似或相同產業的數值大概落在哪個範圍，並檢視自己的表現是否有接近整體表現
bgImage: ga4_update_benchmark_bg.jpg
preload:
  - ga4_update_benchmark_bg.jpg
date: 2024-10-30 19:10:41
---

{% darrellImageCover ga4_update_benchmark_bg ga4_update_benchmark_bg.jpg max-800 %}

GA4 在 10/28 發布了關於 Benchmark 的更新，
開始可以參考同產業的基準化資料!

官方更新文件: [GA4 Benchmark](https://support.google.com/analytics/answer/9164320?hl=en&sjid=767752738139809286-AP#102824)
官方 Benchmark 介紹影片

<iframe width="560" height="315" src="https://www.youtube.com/embed/BFl6aIcz8Pg?si=OoCOz3meEEC4OrTT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 在首頁報表顯示基準化資訊

打開 GA4 的首頁報表，右邊多了一個 benchmark 的功能(類似獎牌的符號)
{% darrellImage800 ga4_benchmark_homepage_report ga4_benchmark_homepage_report.png max-800 %}

如果首頁報表選擇的指標是可以做 benchmark 的，就會看到相關的基準化資訊
{% darrellImage800 ga4_overview_report_benchmark_infomation ga4_overview_report_benchmark_infomation.png max-800 %}

以 每位活躍使用者的平均參與時間 為例，
可以看到 10/27 的值是 1分19秒，
當天的同產業比較中
- 第 75 百分位數是 52 秒
- 第 50 百分位數是 30 秒 (中位數)
- 第 25 百分位數是 12 秒

如果突然對百分位數有點不熟悉，這邊借用一張概念圖
{% darrellImage800 ga4_benchmark_percentile_concept ga4_benchmark_percentile_concept.png max-800 %}
來源: [mathsisfun](https://www.mathsisfun.com/data/percentiles.html)
簡單來說，假設以一百個人，最高的在最前面，最矮的在最後面
第 75 個人的身高就是 75% 百分位數，第 25 個人的身高就是 25% 百分位數

## 無法顯示的可能原因

如果沒顯示，按照官方影片的說法可能有以下原因

### 開啟帳戶設定選項
1. 帳戶設定的選項: **根據輸入內容和業務洞察資料建立模型** 沒有開啟
{% darrellImage800 ga4_account_setting_turn_on_Modeling_contributions_business_insights ga4_account_setting_turn_on_Modeling_contributions_business_insights.png max-800 %}

### 閥值限制
2. 資料量不足，受到閥值(threshold)的限制
這點目前沒有文件提出大約的閥值落在哪裡，後續應該會有相關討論出現

### 選擇正確的指標
3. 注意目前的指標是不是無法套用 benchmark
以下是可以使用 benchmark 的指標

- **獲客 (Acquisition)**
  - 新使用者率 (New user rate)

- **參與度 (Engagement)**
  - 平均單次工作階段參與時間 (Average engagement time per session)
  - 每位使用者的平均參與時間 (Average engagement time per user)
  - 平均工作階段持續時間 (Average session duration)
  - 參與度 (Engagement rate)
  - 每位使用者互動工作階段 (Engaged sessions per user)
  - 每位使用者的事件計數 (Event count per user)
  - 每個工作階段的事件 (Events per session)
  - 工作階段重要事件發生率 (Session key event rate)
  - 每位使用者的工作階段 (Sessions per user)
  - 使用者重要事件發生率 (User key event rate)
  - 每個工作階段的瀏覽次數 (Views per session)
  - 每個使用者的觀看 (Views per user)

- **留存率 (Retention)**
  - 跳出率 (Bounce rate)
  - 每日活躍使用人數/每月活躍使用人數 (DAU/MAU) (Daily active users / Monthly active users)
  - 每日活躍使用人數/每週活躍使用人數 (DAU/WAU) (Daily active users / Weekly active users)
  - 每週活躍使用人數/每月活躍使用人數 (WAU/MAU) (Weekly active users / Monthly active users)

- **營利 (Monetization)**
  - 每位使用者加入購物車 (Add to carts per user)
  - 每位使用者的平均收益 (ARPU) (Average revenue per user)
  - 單一付費使用者平均收益 (ARPPU) (Average revenue per paying user)
  - 每位使用者的平均購買收益 (Average purchase revenue per user)
  - 每位使用者結帳 (Checkouts per user)
  - 初次購買者比率 (FTP 比率) (First-time purchaser rate)
  - 新使用者轉換為初次購買者的數量 (First-time purchasers per new user)
  - 付費每月活躍使用者人數/每日活躍使用人數 (PMAU/DAU) (Paying monthly active users / Daily active users)
  - 付費每週活躍使用人數/每日活躍使用人數 (PWAU/DAU) (Paying weekly active users / Daily active users)
  - 每位使用者的廣告收益總額 (Total ad revenue per user)
  - 每位購買者的交易次數 (Transactions per purchaser)
  - 每個購買者的交易次數 (Transactions per user)

## 情境、案例分享

### 每個工作階段的瀏覽次數

以每個工作階段的瀏覽次數為例，目前的數值是 1.0x，
比起類似產業的範圍都還低(第 25 百分位數是 1.25)

可以解讀為，使用者讀了一頁之後換下一頁的比率過低，
網站的相似推薦功能可能需要加強，
或是引導使用者可以閱讀其他文章

{% darrellImage800 ga4_benchmark_scenario_view_per_session_low ga4_benchmark_scenario_view_per_session_low.png max-800 %}

### 平均工作階段持續時間 

截圖可以看到目前的平均工作階段持續時間偏高，
代表使用者在頁面停留的時間比較長
好的解讀來說: 使用者願意停留和閱讀，代表文章內容不算沒有價值
另一方面也有可能: 使用者需要花較長時間找到他想要的資訊，
那就要搭配其他事件或是 hotjar, clarity 等工具進行分析來證實這個假設

{% darrellImage800 ga4_benchmark_scenario_average_session_duration_high ga4_benchmark_scenario_average_session_duration_high.png max-800 %} 
