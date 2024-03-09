---
title: GA4 用超商來解釋 Event、Session 和 User 
tags:
  - Google Tag Manager
categories:
  - Google Tag Manager
page_type: post
id: ga4_session_hit_user_explain
bgImage: ga4_event_session_user_bg.jpg
description: 由於 GA4 Event Session User 的概念很重要，會影響很多維度和指標上的搭配，所以希望能透過超商來解釋這些概念
date: 2024-03-08 23:41:06
twitter-id: 1766167180578873589
---

{% darrellImageCover ga4_event_session_user_bg ga4_event_session_user_bg.jpg max-800 %}


{% darrellImage800 ga4_event_session_user_explain ga4_event_session_user_explain.png max-800 %}

## Event

以超商為比喻，在超商中可以產生的事件就有結帳、取貨、繳費或是買咖啡等等
而且每個事件可能都會有自己獨特的參數

結帳 : 商品、金額、付款方式
取貨 : 末三碼、取件件數、需要代收金額與否
繳費 : 繳費單的相關資訊、金額
咖啡 : 杯子尺寸、咖啡風味、金額

## Session

GA4 和很多分析工具或是相關數位行銷平台都會有 Session 的概念
其實就和進入超商到離開超商的這段時間

而歸因 SessionSource SessionMedium 就是使用者因為看到了什麼而造訪你的商店
像是他拿著傳單、或是折價券

但要是一個使用者短時間內進出超商那該怎麼算呢?
以 GA4 為例，就會是當使用者離開 30 分鐘後再回來，就會當作一個新的 Session

雖然定義上來看，使用者在網頁中閒置 30 分鐘就算，但因為瀏覽器較難判斷一個使用者真的是離開或是閒置

GA4 中可以調整最短 **5 分鐘最長 7小時55 分鐘**為 Session 重新計算的時間
{% darrellImage800 ga4_session_change_in_admin ga4_session_change_in_admin.png max-800 %}

## User

User 使用者這個詞其實說對也不對
比較精準的說法還是比較偏向**裝置**

當然如果這個網站或是應用程式都是 100% 登入狀態並且有實作 user_id 的追蹤的話
就可以說 User 非常貼近於真實使用者的數量

但是大部分情況下，還是要當作是裝置比較不會誤解

## 用健身房比喻

其實不只超商，健身房也是個很好的例子

有些健身房會需要刷卡或人臉辨識進出

所以一個 **使用者**
從 進入 到 離開 使用者的這段時間也就是 **Session**
他使用的每個器材就像是 **事件**

---

> 有任何意見交流歡迎透過 Twitter 或 Email:
<blockquote class="twitter-tweet" data-lang="zh-tw" data-theme="dark" data-align="center" data-cards="hidden"> <a href="https://twitter.com/DarrellMarTech/status/1766167180578873589"></a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>