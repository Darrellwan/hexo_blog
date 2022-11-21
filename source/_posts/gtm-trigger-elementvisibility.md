---
title: GTM - 觸發條件 元素可見度 (Element Visibility)
tags:
	- Google Tag Manager
	- GTM Tutorial
	- GTM 教學
categories:
	- Google Tag Manager
page_type: post
date: 2022-11-15 22:00:47
description: GTM 的觸發條件 - 元素可見度，是個能力強大的工具，當你想要追蹤一個網頁元素的出現，或是一個元素滾動到可視範圍中，都可以使用這個觸發條件來達成
---

{% darrellImageCover gtm_trigger_visibility_bg gtm_trigger_visibility_bg.png %}

## 觸發條件 : 元素可見度

通常會有幾種情況
- 你想要追蹤的元素突然冒出來 : pop-up (促銷內容、感謝填寫表單資訊) 等等
- 原本在網頁的下方，往下滾動 scroll 後出現在你的可視範圍中

{% darrellImage 元素可見度 trigger_visibility.png %}

這些情況的追蹤就比較適合使用這個觸發條件，
GTM 利用了自身的一些 JS 監聽程式來幫你達成這件事情。
當然有興趣的工程師也可以自己撰寫自己的監聽程式
相關的關鍵字有
listen element appear in viewport
原理大概就是判斷該元素的 X 跟 Y 在哪，並且在滾動時計算目前的可視範圍
最後計算這個 X 跟 Y 是否在可視範圍內

## 設定和選項

{% darrellImage 元素可見度的選項 visiblity_option.png %}

### 選取方式

有 ID 和 CSS 選取器，建議知道怎麼使用選取器的人都盡量使用它
用 ID 來選擇是一個表面上最安全的方式，但實際情況很容易不如預期
大部分的需求也可能是有多個元素要被套用，所以 **CSS 選取器還是最好的方式**

### 啟動此觸發條件的時機
	- 每個網頁一次
	- 每個元素一次
	- 每次元素在畫面上顯示時

這邊應該就如字面上意思，
如果只有一個元素，那選擇每個網頁一次 或 每個元素一次 基本上道理一樣

但今天如果是多個元素都要追蹤時，就建議選**每個元素一次**
> 元素就是指 HTML Dom Element 

如果今天有特別需求: 一個元素出現多次也要追蹤時，就可以選 **每次元素在畫面上顯示時**
但要先想清楚今天追蹤的目標是什麼，觸發多次往往會造成多餘的追蹤次數以及報表較難判讀

## 進階選項

{% darrellImage 元素可見度的進階選項 visiblity_option_advanced.png %}

### 最低可見百分比

也是一個好懂的選項，就是當這個元素出現在畫面中佔多少比例
這在 pop-up 就比較用不到，因為正常來說 pop-up 就是 100% 才對

而例如**某個元素捲動到畫面中時，要出現多少就可以決定**
可能今天你想要出現個 80% 就發動，就可以在這邊設定 80

這會在下面的 Demo 中展示

### 設定畫面持續時間下限

當你今天不想要元素一出現就發動時，就可以加上這個秒速

=> **當元素出現在畫面中，並且持續多久後，才要發動**

### 觀察 DOM 改變情形

這是一個強大但不見得推薦的選項，他應該是啟用了另一種監聽方式，相對來說對網頁效能有可能有較大的影響
情境會使用在，原本這個元素並沒有在網頁中，而是隨著另一個 request 或是其他方式來插入到元素中的

這邊對工程師來說可能比較好理解
1. 網頁的元素出現與否是可以靠 CSS 的 display 來控制顯示或隱藏的
但這元素就是早就在網頁中了，只是被**隱藏**
2. 另一種是這個元素本來就不在這網頁中，因為情境需要才被**新增或插入** 到網站中，
GTM 預設是不會監聽到這種元素的，他原本只會針對網頁中現有的元素作監聽

## Demo

這邊以這個網站做一個簡易的 Demo

{% darrellImage website_full_screenshot website_full_screenshot.webp %}

紅框的部分就是我的螢幕目前可視範圍，這範圍每個人的螢幕大小都不太一樣
當然手機就是個直立的形狀

黃色部份是所有的文章 block
假設今天的追蹤目標是
**所有的文章 block 出現時發動**
那目前畫面就已經出現四個元素了，還有其他六個元素在下面，要滾動往下才會出現

{% darrellImage element_in_devtool element_in_devtool.png %}
從 Chrome Devtool 可以看到元素的架構
簡易的做法可以直接使用
` article.post-block ` 來當作 CSS 選取器就好
{% darrellImage demo_trigger_setting demo_trigger_setting.png %}

從 Preview 預覽環境中可以看到，左方有四筆的 **Element Visibility**
也能看到綁定這個觸發條件的代碼發動了四次
{% darrellImage gtm_preview_fire_trigger gtm_preview_fire_trigger.png %}

這邊介紹一下這個觸發條件一起發動的 DataLayer
element 和 elementClass 這些可以使用 Click Element 的相關變數來使用
FirstTime 就是指第一次出現在畫面中的時間
LastTime 在你設定 **每個元素一次** 就會一樣不會改變
但如果你選擇了 **每次元素在畫面上顯示時** 並且觸發兩次，就會看到一個比較晚的時間點

{% darrellImage trigger_visibility_datalayer trigger_visibility_datalayer.png %}

這裡顯示一些可以拿來使用或比較的 GTM 變數(Variable)

{% darrellImage available_variable available_variable.png %}

這邊使用 JS 程式來幫觸發的元素加上邊框
可以從下方的影片中看到元素一開始並沒有加上
而是出現到大於設定的 80% 時才會有邊框

```html
<script type="text/javascript">
  (function(){
    var element = {{Click Element}};
    element.style.border = "thick solid #f8ecae";
  })()
</script>
```

{% darrellImage demo_gif demo_gif.gif %}

未來還會加上一些可以搭配使用的功能
像是取得元素的索引數字等等
