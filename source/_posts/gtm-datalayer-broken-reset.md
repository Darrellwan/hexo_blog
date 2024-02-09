---
title: DataLayer 會怎麼壞掉，找出可能的原因
tags:
  - Google Tag Manager
  - DataLayer
categories:
  - Google Tag Manager
page_type: post
id: gtm-datalayer-broken-reset
description: description
date: 2024-02-07 20:59:12
bgImage: gtm-datalayer-broken-reset_bg.png
---

{% darrellImageCover gtm-datalayer-broken-reset_bg gtm-datalayer-broken-reset_bg.png max-800 %}

## 如何判斷是 dataLayer 壞掉



## 緣由

原本以為這是個罕見的案例，有可能發生但機率應該不高
只是有一天突然收到來自兩個不同公司的朋友都遇到一模一樣的問題
覺得該好好記錄下來

## 正常情況

正常情況下我們安裝 Google Tag Manager 時都會在 `<head></head>` 中貼入下面的程式碼

```
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
```
  window.dataLayer = window.dataLayer || [];
```
翻譯成白話文是
我今天想要在 window 環境下建立一個叫做 dataLayer 的變數，
如果他原本就存在那我就用原本的
如果沒有，那我初始化為一個空白陣列

## 壞掉的原因
