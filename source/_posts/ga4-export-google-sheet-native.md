---
title: Google Analytics 4 支援資料直接匯出到 Google Sheet (Google 官方釋出)
date: 2023-08-17 22:14:21
tags:
	- Google Analytics 4
	- Google Sheet
categories:
	- Google Analytics 4
page_type: post
description: Google Analytics 4 終於釋出了對於 Google Sheet 的支援，現在可以直接在 Google Sheet 取得 GA4 的資料匯出了! 再也不用自己寫程式在 Google App Script 來串接 GA4 Data API。
---

{% darrellImageCover 在Google_Sheet使用GA官方套件取得GA4資料 bg_ga4_google_sheet_get_ga4_data.png max-800 %}

## 安裝 Google Sheet 的 GA4 Reports Builder 套件

{% darrellImage800 google_worksapce_ga4_report_builder google_worksapce_ga4_report_builder.png max-800 %}

請先打開 [ GA4 Reports Builder - Google Workspace Marketplace](https://workspace.google.com/marketplace/app/ga4_reports_builder_for_google_analytics/589269949355)

{% darrellImage800 google_worksapce_ga4_report_builder_install_success google_worksapce_ga4_report_builder_install_success.png max-800 %}

照著安裝的指示同意相關權限後
看到這個畫面表示安裝成功!

接著到 Google Sheet 打開一個空白的來開始測試

[Google Sheet](https://docs.google.com/spreadsheets/)

## 在 Google Sheet 打開 GA4 Reports Builder

{% darrellImage800 open_ga4_report_builder_in_google_sheet open_ga4_report_builder_in_google_sheet.png max-800 %}

如圖片所示
1. 打開 擴充功能 (Extension)
2. 選擇 GA4 Report Builder ....
3. 選擇 Create new report

Run Report 會等到我們設定好 Create new report 後才會選擇並開始跑資料

如果有用過以前 GA3 版本或是 Super Metric，會覺得接下來的設定相對熟悉

## 設定報表

{% darrellImage800 setting_report_ga4_report_builder_in_google_sheet setting_report_ga4_report_builder_in_google_sheet.png max-800 %}

1. 將這份報表取個名，請不要取太長，他之後會是下方一個 tab 的名字
2. 選擇想要跑資料的 GA4 Account(帳戶) -> Property(資源)
3. 選擇想要跑資料的 起訖日期，有多種選擇 例如幾天前，或是直接選定一個日期

再來會是比較麻煩或難懂的部分
要選擇維度和指標

{% darrellImage800 setting_report_dimension_metric_ga4_report_builder_in_google_sheet setting_report_dimension_metric_ga4_report_builder_in_google_sheet.png max-800 %}

這邊熟悉的人應該沒什麼問題，如果不太確認要選擇什麼
建議先回到 GA4 的探索報表中重新摸索一下，並且在這裡查詢有關於[維度、指標的文件](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema?hl=en)

**強烈建議使用英文的文件**，如果不太能明白意思，可以先查看中文的說明
但在 API Name 跟 UI Name 一定要切回英文去找對應的名稱
因為在 Google Sheet 這裡只會有英文的欄位名稱可以選擇

以截圖為例
維度 : 工作階段來源, 工作階段媒介
指標 : 事件數, 工作階段數, 轉換數

=>
> 可以快速了解這個時間區間內，網站的來源媒介大致的流量個別是多少

按下 `Create Report` 後，就會出現下圖的一個 report 設定摘要

{% darrellImage800 check_report_setting check_report_setting.png max-800 %}

## 取得報表資料

{% darrellImage800 open_ga4_report_builder_in_google_sheet open_ga4_report_builder_in_google_sheet.png max-800 %}

前面提到的 run report 在設定完成後就可以選取

等到跑完後會有下圖的提示

{% darrellImage800 run_report_success_in_google_sheet_ga4_report_builder run_report_success_in_google_sheet_ga4_report_builder.png max-800 %}

然後下方的 sheet 會新增一個跟剛剛報表命名一樣的

打開後的資料解說:

{% darrellImage800 the_report_result_and_explain the_report_result_and_explain.png max-800 %}

## 優點和限制

能夠不需要寫程式就直接在 Google Sheet 撈到 GA4 裡面的資料相信對於大部分的 GA4 使用人員都是好事
會有在 Google Sheet 的需求很常就是因為還有一些需求或場景可能需要比對資料
或是有一些進階的運算

以前只有寫程式撈 Data API 或是從探索報表下載
現在設定一次 GA4 Report Builder 後未來只需要 run report 就可以更新資料!

但目前有一個蠻大的限制，就是無法加上過濾條件
應該在不久的未來就會更新這部分的限制

以往在寫程式撈 Data API 時 Filter 也一直是最麻煩和最花時間的地方

或許可以研究看看是不是在 report 的設定摘要那邊就可以自己加上一些過濾條件
也期待這個工具未來的更新，是不是會有定期自動更新等等的新功能

