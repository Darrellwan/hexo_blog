---
title: DataLayer 壞掉影響 Google Tag Manager 的追蹤，排查可能的原因
tags:
  - Google Tag Manager
  - DataLayer
categories:
  - Google Tag Manager
page_type: post
id: gtm-datalayer-broken-reset
description: 在短短的一天中居然有不同的人同時問了 dataLayer 怪怪的，也剛好都可以用同樣的方式排查和確認問題，到底是什麼造成 dataLayer 壞掉
date: 2024-02-07 20:59:12
bgImage: gtm-datalayer-broken-reset_bg.png
---

{% darrellImageCover gtm-datalayer-broken-reset_bg gtm-datalayer-broken-reset_bg.png max-800 %}

## 緣由

原本以為這是個罕見的案例，有可能發生但機率應該不高
只是有一天突然收到來自兩個不同公司的朋友都遇到一模一樣的問題
覺得該好好記錄下來

## 正常情況

正常情況下我們安裝 Google Tag Manager 時都會在 `<head></head>` 中貼入下面的程式碼

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM代碼');</script>
<!-- End Google Tag Manager -->
```

這段程式碼除了載入 Google Tag Manager 的 JavaScirpt 以外，也對 dataLayer 這個變數做了一個初始化和監聽
在有安裝 GTM 的情況下正確對 dataLayer 的宣告方式為
```js
  window.dataLayer = window.dataLayer || [];
```
翻譯成白話文是
我今天想要在 window 環境下建立一個叫做 dataLayer 的變數，
如果他原本就存在那我就用原本的
如果沒有，那我初始化為一個空白陣列

## 如何判斷是 DataLayer 壞掉

### 沒有看到 Container Load 載入

{% darrellImage gtm_preview_not_showing_container_load gtm_preview_not_showing_container_load.png %}

### 推送的 DataLayer 沒有出現在 Preview 中

{% darrellImage datalayer_push_not_show_in_preview datalayer_push_not_show_in_preview.png %}

上面兩種狀況其實不太好發現，常常我們只會以為是應該發送 DataLayer 的程式碼壞掉
殊不知是因為 DataLayer 本身壞了，讓新的事件無法正常輸入和出現在預覽畫面中

## 壞掉的原因

而為什麼 DataLayer 會壞掉? 
在程式語言中，他應該就是個簡單的陣列(Array)
請技術人員在正確的時機點推送正確的資訊到一個陣列中應該是一件非常簡單的事情

而往往是這個看似簡單的事物會造成誤會

**正確的宣告變數和推送資料**
```js
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(...)
```

**會造成錯誤的寫法**
```js
  window.dataLayer = [];
  window.dataLayer.push(...)
```

兩個方法中最大的差異就只有第一行不同的宣告方式
第二種會錯誤是因為它不顧一切的把 `dataLayer` 這個參數會強制替換成全新的
而不是參考原本舊有的

用一種方式來比喻的話
一個學期就只會寫一本聯絡簿(先假設這一本一定可以記錄整個學期)
所以可以從這聯絡簿知道這學期從頭到尾每天的一切
但如果有一天開始突然直接用一本全新的
就會造成前面的紀錄完全消失，如此一來會造成一些麻煩例如紀錄不連貫

## 結語

請非技術人員再給工程師相關的埋碼文件時
要在上面特別請工程師注意 dataLayer 變數的宣告

```js
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(...)
```

只要在每個需要追蹤的程式碼文件都有落實這種宣告方式
或是封裝成一個公用的 Function 來處理追蹤相關的程式
在未來就不會有類似相關的問題出現，或是至少可以肯定不是自己的工程師造成的
可以直接檢查是否有外部廠商在 Google Tag Manager 中自行推了錯誤的 dataLayer 程式碼



