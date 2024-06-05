---
title: ChatGPT 在網頁版無法使用，沒有錯誤訊息卻都無法回答問題
tags:
  - ChatGPT
categories:
  - ChatGPT
page_type: post
id: chatgpt-broken-in-web-browser
bgImage: ChatGPT-broken-in-browser-bg.png
description: ChatGPT 壞掉或是問答沒有反應嗎? 最近的錯誤狀況和網路上搜尋的狀態都不太相同，沒有明顯的錯誤訊息，但就是一直無法問答，最後發現可能只是語言的設定問題!
date: 2024-03-10 23:28:37
modified: 2024-06-05 21:06:03
preload: 
 - ChatGPT-broken-in-browser-bg.png
---

{% darrellImageCover ChatGPT-broken-in-browser-bg ChatGPT-broken-in-browser-bg.png max-800 %}

## 快速檢查是否為 ChatGPT 端的問題

### OpenAI downdetector
<a href="https://downdetector.com/status/openai/"><i class="fa-solid fa-link"></i><span> Downdetector OpenAI </span></a>
{% darrellImage800 down_detector_thumbnail down_detector_thumbnail.png max-800 %}

### Status OpenAI
<a href="https://status.openai.com/"><i class="fa-solid fa-link"></i><span> Status OpenAI </span></a>
{% darrellImage800 openai_status_thumbnail openai_status_thumbnail.png max-800 %}

## 202406 ChatGPT is at capacity right now

最近突然遭遇到一次大規模的 ChatGPT is at capacity right now
主要的原因就是 ChatGPT 大當機，伺服器突然無法處理大量的請求

<video autoplay loop muted playsinline>
    <source src="./chatgpt_down_20240604.webm" type="video/webm">
    <img src="https://i.imgur.com/le2dqA4.gif" alt="Fallback GIF">
</video>



這次發生的時間長達五個小時之久
還好這次發生的時間算是台灣的深夜，影響的範圍應該沒有白天來的多

{% darrellImage800 chatgpt_status_down_in_20240604 chatgpt_status_down_in_20240604.png max-800 %}

## 202405 更新 - 空白畫面 - server error

最近遇到的新問題是打開會呈現空白畫面，左邊的聊天紀錄也都讀取不出來

想要下的 prompt 送出後也沒反應

{% darrellImage800 chatgpt_empty_ui chatgpt_empty_ui.png max-800 %}

打開了 Chrome 的 Devtool 發現報了很多 503 error
此類錯誤來自 chatgpt 的 server error，作為使用者的我們暫時只能耐心等待修復

{% darrellImage800 chatgpt_openai_user_report_error chatgpt_openai_user_report_error.png max-800 %}

從這個網站也看到這一兩個小時有大量的使用者回報遇到錯誤

<a href="https://downdetector.com/status/openai/"><i class="fa-solid fa-link"></i><span> Downdetector OpenAI </span></a>

官方的 Status 也提到目前有遇到問題
```
Investigating - We are currently investigating this issue.
May 03, 2024 - 00:18 PDT
```
<a href="https://status.openai.com/"><i class="fa-solid fa-link"></i><span> Status OpenAI </span></a>

未來有遇到錯誤的人也可以參考上面兩個連結，看看是不是大規模性的問題
而不是單純個人的電腦或瀏覽器造成錯誤!

## 空白畫面 & 解決方式

從 ChatGPT 開始火熱至今，本來就經歷過大大小小的問題，但這次發現壞掉的狀況很奇怪

一樣的帳號在手機版 APP 沒有問題，而且如果會影響到 plus 用戶應該不會有任何通知

彷彿在網路上無法找到太多資料，就思考是否其實是一小部分的人會遇到的問題

後來在 ChatGPT 的官方論壇碰碰運氣

討論的熱度很低，但還是有零星的發問和回答

{% darrellImage800 chatgpt-community chatgpt-community.png max-800 %}

<a href="https://community.openai.com/"><i class="fa-solid fa-link"></i><span> ChatGPT 官方論壇 </span></a>

目前整理下來，可能有效的方式有兩種

1. 清除 Cookie 和 OpenAI 在瀏覽器上的相關資料

這方法有不少人都反應做了也沒有效果，我自己的測試也是一樣

2. **更改語言設定**

看到這方法時覺得好像有點合理，因為自己就是用繁體中文的語言在使用

{% darrellImage800 find-solution-in-community find-solution-in-community.png max-800 %}

所以想立刻分享這個對我來說有用的方式!

如果清除 Cookie 和資料都沒有用，來更改一下語言設定試試看吧

目前發現如果切換回英文有時候又會遇到沒有回應的狀況

暫時可能都會先保持用英文來使用

---

本文內容同步分享於 IG、X

<blockquote class="twitter-tweet" data-lang="zh-tw" data-theme="dark" data-align="center" data-cards="hidden"> <a href="https://twitter.com/DarrellMarTech/status/1766297215935586357"></a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

