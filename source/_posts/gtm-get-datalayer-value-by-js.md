---
title: 社群問答:使用 JavaScript 取得 DataLayer 的資料
tags:
  - Google Tag Manager
categories:
  - Google Tag Manager
  - DataLayer
  - 社群問答
	- Stack Overflow
page_type: post
id: gtm-get-datalayer-value-by-js
bgImage: gtm-get-datalayer-value-by-js-bg.jpg
description: Stackoverflow 中有人提問在 Google Tag Manager 如何使用 Custom JavaScript 來取得 DataLayer 中的資料，有兩種方法可以達成這個需求，一個是使用一般的 JavaScript，另一種是使用 Google Tag Manager 的特殊物件
date: 2024-04-26 08:19:14
---

{% darrellImageCover gtm-get-datalayer-value-by-js-bg gtm-get-datalayer-value-by-js-bg.jpg max-800 %}

<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

## 問題

前陣子在 StackOverflow 中看到有人發問
如何讓 Custom JavaScript Variable 像是 DataLayer Variable 有一樣的效果
<a href="https://stackoverflow.com/questions/78260657/to-make-data-layer-variable-and-custom-java-script-variable-work-the-same-in-gtm/78266515#78266515"><i class='bx bx-link-external bx-flashing-hover' > to make data layer variable and Custom java script variable work the same in GTM </i></a>

{% darrellImage800 stackoverflow-question stackoverflow-question.png max-800 %}

## 問題的反思

每個人在 Google Tag Manager 中會遇到的情境可能有百百種
但像是這個情境就比較讓人會想要懷疑

為什麼明明有 DataLayer Variable 可以方便的用來取得 DataLayer 中的資料
還需要使用 Custom JavaScript 來比較麻煩的取得呢?!

這邊提問的人雖然沒有說明為什麼有這樣的情境
只是想說有提問就代表有需求才對

## 解答

### 方法 1 : 一般 JavaScript

使用 JavaScript 取得 DataLayer 中的值有兩個方法
DataLayer 在 JavaScript 中就是一個單純的陣列，
只是裡面包含了很多物件

{% darrellImage800 datalayer-is-an-array-in-javascript datalayer-is-an-array-in-javascript.png max-800 %}

那就可以使用一般 JavaScript 的操作來取得特定 Key 的資料

```js
var latestValue = null;
var key = "";
for (var i = window.dataLayer.length - 1; i >= 0; i--) {
    if (window.dataLayer[i][key] !== undefined) {
        latestValue = window.dataLayer[i][key];
        break;
    }
}
console.log(latestValue);
```
{% darrellImage800 get-datalayer-value-in-js-solution-1 get-datalayer-value-in-js-solution-1.png max-800 %}


### 方法 2 : google_tag_manager 物件

另一個方法就較為特殊
他是利用 `google_tag_manager` 這個 JavaScript 物件來操作

`google_tag_manager` 變數是 GTM.js 載入後就會有的一個變數
但大部分情況是不會對他操作來取得資料才對

這方法較為簡單，也可以看到其實這個特殊物件本身就內建對於 dataLayer 取資料的能力
只是要將 gtm id 替換為自己的 gtm id 就好

```js
var key = "";
var variableValue = google_tag_manager["GTM-XXXXXX"].dataLayer.get(key);
console.log(variableValue);
```
{% darrellImage800 get-datalayer-value-in-js-solution-2 get-datalayer-value-in-js-solution-2.png max-800 %}
