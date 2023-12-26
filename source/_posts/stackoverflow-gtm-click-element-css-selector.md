---
title: 社群問答:CSS Selector 選擇想要的元素來做點擊追蹤
tags:
	- Google Tag Manager
	- Stack Overflow
categories:
  - Google Tag Manager
page_type: post
date: 2022-12-01 22:34:39
description: 情境是想要追蹤一些 `<a>` 連結的點擊追蹤，可是這些元素都沒有適合參考的 id, class。唯一看起來可以使用的就是 data-type 的屬性，如何使用 CSS Selector 在做到
bgImage: stackoverflow_qna_bg.png
---

{% darrellImageCover stackoverflow_gtm_ga_f&q stackoverflow_qna_bg.png max-800 %}

[Stackoverflow : Want to track click event in GTM when the element doesnt have css class or id](https://stackoverflow.com/questions/74555896/want-to-track-click-event-in-gtm-when-the-element-doesnt-have-css-class-or-id/)

## 問題: 元素沒有好的 id ,class 來選擇作為 trigger 的條件

如使用者提供的截圖
{% darrellImage800 stackoverflow_question_problem https://i.stack.imgur.com/y1lhH.jpg.png max-800 %}

```html
<div class="change-results-view">
  <a href="#" class data-type="list">...</a>
  <a href="#" class data-type="grid">...</a>
  <a href="#" class data-type="table">...</a>
</div>
```

如何選擇並追蹤這些 `<a>` 元素呢

## 定義需求和解法

首先可以看到他的問題是他想要追蹤這三顆按鈕，其實有大於一種的方式可以做到

1. 抓到 `<div class='change-results-view'>` 底下所有的 `<a>` 元素

```
div.change-results-view a
```

優點: 最快和方便的方式取得
缺點: 如果未來裡面出現其他 `<a>` 元素但其實沒有想要追蹤，任何新增的其他 `<a>`元素都會被追蹤到

2. 抓到 `<div class='change-results-view'>` 底下的 `<a>` 元素並指定 data-type
```
div.change-results-view a[data-type='list'],
div.change-results-view a[data-type='grid'],
div.change-results-view a[data-type='table']
```

優點: 最精準的方法，除非未來該元素不見，才會有抓不到的情況
缺點: 如果未來想要自動抓到新增的 `<a>` 元素，就得額外修改

## 結語

上面提到的方法一和方法二
就只差在未來想要怎麼擴充或是不須擴充等等狀況來調整
另外 **CSS Selector** 的技巧在 GTM 追蹤上也是會一直應用到的
或許上面提供的選擇方式也不是最好的，可能有其他更好的方法等待發掘
