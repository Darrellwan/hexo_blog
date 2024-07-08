---
title: Google Tag Manager - 進階技巧 CSS 選擇器的練習資源
date: 2022-12-17 22:51:28
tags:
	- Google Tag Manager
  - JavaScript
description: 多次在 StackOverflow 的問答中或是實務上被問到的問題，會發現很多情境都會使用到 CSS Selector(選擇器)，但這對於不常使用的人來說其實有一定的入門門檻，這邊介紹了一個用遊戲來學習 CSS Selector 的網站和教學的資源搭配使用
categories: 
	- Google Tag Manager
page_type: post
darrell_structured_data:
  type: faq
  question:
    - 什麼是 CSS Selector
    - CSS Selector 的練習和資源
  answer:
    - 一種用來選擇 CSS 和撰寫 CSS 的規則，學習 CSS 時就會利用指定標籤 class id 來套上樣式，同樣的一套選擇方式也可以用來當作選擇元素的方式
    - 這次找到一款很棒的遊戲來練習 CSS Diner 還有一個中文資源 30個你必須記住的CSS選擇器
---

{% darrellImageCover DarrellMartech_進階技巧CSS選擇器的練習資源 gtm-skill-css-selector-resource-bg.webp %}

## 什麼是 CSS Selector

一種用來選擇 CSS 和撰寫 CSS 的規則，學習 CSS 時就會利用指定標籤 class id 來套上樣式
同樣的一套選擇方式也可以用來當作選擇元素的方式

## CSS Selector 的練習和資源
這次找到一款很棒的遊戲來練習 : CSS Diner
還有一個中文資源 : 30個你必須記住的CSS選擇器

## CSS Diner : 選盤子或餐桌上的東西來過關

連結 : [https://flukeout.github.io/](https://flukeout.github.io/)

遊戲的方式其實蠻簡單的

左下角的 CSS Editor 就是讓你輸入 CSS Selector 的地方
旁邊就是目前網站的 Html 結構

{% darrellImage CSS選擇器的輸入 css-selecor-editor-and-html.png %}

**畫面上方在抖動的圖示就是這一關中，需要被選擇的元素**

{% darrellImage CSS_Diner_要選擇的Html元素 css-diner-target-dom.png %}

右邊則是關於這一關的提示

{% darrellImage CSS_Diner_提示 css-diner-tips.png %}

以第一關為例: 

選擇畫面中的兩個盤子

觀察 Html 可以發現 div.table 下就是兩個 plate 元素

> 當然現實生活中你很少會看到有元素叫做 plate，這邊應該是以遊戲化呈現所以配合情境吧
> 重點在於我們懂不懂什麼是 Html元素，說不定未來的網頁技術和框架會開始出現各式各樣的 Html 元素

像是 Google Tag Manager 的 Html Source 就可以找到這種元素
```html
<gtm-container-page enable-preview-card="true">...</gtm-container-page>
```

回到 CSS 選擇器
第一題的就是選擇 plate 元素即可
所以只要在 CSS Selector 那邊填入 plate

{% darrellImage CSS_Diner_第一題的解答 css-diner-1st-answer.png %}

最後按下 Enter 就會確認答案，對的話就會進到下一題
錯的話則會抖動告訴你，目前你的答案選了什麼，便可以知道選錯在哪裡

想回到上一題下一題或直接跳到其他題目，最右上角可以切換

總共 32 題，不確定未來是否有更新的機會，
但其實這 32 題大概已經可以 Cover 實務上 90% 以上的情境了

所以無論是 Google Tag Manger 或是前端工程師想精進這個技巧都蠻推薦的

---

## 中文資源 - 30個你必須記住的CSS選擇器

如果上面的遊戲打開，但完全不知道該如何進行的話
可能就是真的剛接觸這個領域

而且還是全英文的網站，想參考一些中文資源的話

連結 : [30個你必須記住的CSS選擇器](https://code.tutsplus.com/zh-hant/tutorials/the-30-css-selectors-you-must-memorize--net-16048)

這網站是幾乎把所有的 CSS選擇器的符號和用法列出來
如果上面的遊戲有卡關，提示也看不太懂的話，可以參考這裡看能不能更好理解一點

這份教學中有提到兼容性，是一個平常很容易被忽略的問題
現在可能比較不會碰到，但未來如果我們看到一個很新的語法出現後
記得要確認一下瀏覽器的支援程度
以免在我們最新的 Chrome 中可以使用
但使用者剛好很久沒更新 Chrome 或使用了別的比較舊版的其他瀏覽器
可能就會造成錯誤

**在 GTM 上使用任何的語法都應該避免網站出錯為最高原則，就算有可能會讓追蹤出現失誤，也要以網站能順利運行為主**

--- 

## 結語 : 不只一種解答

CSS Selector 如同很多的東西一樣，是沒有一個唯一的正確解答的
像 CSS Diner 後面的題目比較複雜，其實真的有大於一種以上的正確方式

但究竟怎麼寫比較好，這真的會因為情境和團隊等等眾多因素有關係，
像是寫其他的程式，究竟是越解短的程式碼越好，或是易讀性高的程式碼好，每個地方都不一樣
我們能做的就是掌握更多種方法，才能讓自己在不同地方或情境都能順利克服

