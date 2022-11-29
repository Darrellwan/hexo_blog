---
title: GA4 電子商務的收入金額 不一致 出現小數點
tags:
  - Google Analytics 4
  - Issue
categories:
  - Google Analytics 4
page_type: post
date: 2022-11-29 21:14:18
description: GA4 的電子商務報表中，幣別明明是選擇新台幣，也確認資料送的金額數字是對的，但最後在報表的呈現卻不一樣，出現了額外的小數點，金額上也會有些微落差，原因居然是幣別的關係
---

{% darrellImageCover GA4台幣電子商務收入不一緻 ga4_revenue_inconsistency_bg.jpg %}

## 電子商務報表呈現的金額有問題

{% darrellImage GA4中的電子商務報表 revenue_report_in_ga4.png %}

原始送的資料都是整數，但在報表中處理過後多或少了一兩塊
且有小數點

確認過送的電子商務資料沒問題，幣別設定也都對

雖然差距並不大，但大型電商網站每天數千筆到數萬筆訂單時整體的差距還是略有影響

## 找到問題的原因，卻暫時沒有方法解決

在社群求助之後才知道，原來這在幾個月前就有人發現了

其實 Google 也有把**狀況** 敘述在他們的文件中
 
[[GA4] 幣別參考資料](https://support.google.com/analytics/answer/9796179?hl=zh-Hant)

{% darrellImage GA4文件中的幣別說明 ga4_document_about_currency.png %}

{% darrellImage GA4文件:使用當地幣別 ga4_in_local_currency.png %}

簡單來說

> 當你傳入非美元的金額時，GA4 會先幫你轉為美元儲存在 GA4 的系統中
> 但在報表呈現時，又會以處理時的匯率轉成新台幣

所以一進一出中無形被轉換的兩次幣別，也是導致最後呈現在報表上的金額不同的原因

目前從社群中看起來 Google 還沒有要修正這個問題，或是不確定他們是否將這個情形視為一個問題

後續如有更新也會再更新在此篇文章中!
