---
title: Google Tag Manager - 觸發條件 點擊和連結點擊 (All Click, Link Click)
tags:
	- Google Tag Manager
	- GTM Tutorial
	- GTM 教學
categories:
  - Google Tag Manager
page_type: post
date: 2022-11-30 22:17:23
description: Google Tag Manager 中的觸發條件(Trigger), 要如何設定點擊和連結點擊，兩者的差異以及該選哪一個
---

{% darrellImageCover GTM所有元素點擊連結元素點擊觸發條件_bg GTM-Trigger-Click_Link-BG.jpg max-800 %}

## 建議先知道的事情! Click 相關變數設定

### 開啟點擊相關的內建變數

由於新建立的 GTM 容器預設參數只有一些跟網頁和網址相關的內建變數

{% darrellImage800 GTM預設的內建變數 gtm_builtin_variables.png max-800 %}

跟點擊有關的變數得自行先去開啟
不熟的話可以先全部開啟沒關係

{% darrellImage800 GTM設定click相關的內建變數 gtm_configure_click_related_variables.png max-800 %}

另外要是確定自己的容器 Container 是全新的，或之前都沒有設定過 Click 相關的觸發條件
亦或是下方的教學中，點擊按鈕沒有在預覽模式出現相關點擊資訊
只要先建立一個所有元素的觸發條件即可 如圖

{% darrellImage800 GTM設定一個全新的點擊所有元素條件 gtm_configure_new_all_click_trigger.png max-800 %}

### 測試按鈕區

> 測試按鈕1 : 文字

<a id='test-link' class='link' href='https://www.darrelltw.com' style='color:#7bc5ff'>
  <span id='test-link-span' class='span-text'>⏎測試點擊文字</span>
</a>

> 測試按鈕2 : 圖片

<a id='test-link2' class='link' href='https://www.darrelltw.com'>
  <img id='test-image-id' class='test-image-class' src="./fake_button.png">
</a>

這裡有兩個算是蠻常見的連結按鈕類型
一個是圖片加上連結的版本
另一個是文字加上連結的版本
用這兩個測試連結來解釋一下剛剛開啟的點擊變數分別代表什麼意思

{% darrellImage800 fake_image_a_tag fake_image_a_tag.png max-800 %}

{% darrellImage800 alt fake_span_a_tag.png max-800 %}

### 點擊相關的內建變數解釋

{% darrellImage800 內建變數對照真實html click_builtin_variable_mapping_html.png max-800 %}

點擊到的元素請以 Google Tag Manager 當下判斷為主

- Click Classes : 該元素的 class 屬性
- Click Element : 該元素 (**這不是單純的字串，無法用 包含 來比較, 只能使用 CSS 選擇器**)
- Click ID : 該元素的 id 屬性
- Click Target : 該元素的 target 屬性 (一般出現在 `<a>` 元素)
- Click Text : 該元素的 innerText 屬性
- Click URL : 該元素的 href 屬性 (一般出現在 `<a>` 元素)

可以善加利用這些變數用來篩選追蹤目標要的元素
或是把屬性套用在代碼中當作變數

## 觸發條件 : 點擊:所有元素 All Elements

所有元素是一個比較好理解的觸發條件

**基本上就是你能點到的全部元素都可以算**

以範例的點擊按鈕為例

```html
<a id="test-link" class="link" href="https://www.darrelltw.com" style="color:#7bc5ff">
  <span id="test-link-span" class="span-text">⏎測試點擊文字</span>
</a>
```

在 GTM 的預覽模式中，它偵測到你點擊了這個 `<span>` 並且在變數上顯示了相關資訊

{% darrellImage800 GTM預覽模式偵測點擊 gtm_preview_click.png max-800 %}

但當其實你想追蹤的這個 `<span>` 的父層元素 `<a>` 時就很麻煩，而且這是日常情境中很常遇到的狀況

這也因此有了下方的 (僅連結) 觸發條件

## 觸發條件 : 點擊:僅連結 Just Links

這個觸發條件就是只鎖定在 `<a>` 的元素有沒有被點擊到

也可以用來解決上方 所有元素 沒偵測到 `<a>` 的問題

同樣的按鈕在開啟僅連結的觸發條件下

{% darrellImage800 GTM預覽比較僅連結和所有連結 gtm_preview_with_click_and_link_click.png max-800 %}

這邊的預覽模式是在一樣按下上方的文字測試連結後

兩個觸發條件都一起偵測到了

只是可以看到說
所有元素 依然是偵測到 `<span>`
但 僅連結 偵測到的是 `<a>`

所以變數上 click id, click class, click element, click url 都不一樣了

只有 click text 是相同
那是因為兩個元素的 innerText 的確都會顯示 ⏎測試點擊文字

## 結語與應用

一開始想要追蹤點擊時，除了分不清楚要使用哪一個觸發條件外
也會常常因為這種 a 元素和其他元素包在一起時
GTM 偵測到的點擊元素和我們預期的不同

比較快的方式就是隨時注意預覽模式中
Click 這個事件偵測到的元素是什麼
如果剛好這元素上都沒有什麼 class id 可以參考
那就只能參考 Click Element

{% darrellImage800 GTM預覽模式中的ClickElement gtm_preview_click_element_show.png max-800 %}

這邊會建議從最後面開始找
截圖為例他就會告訴你 
這是一個 `<a>` 元素
在 `<div class=post-body>` 底下
也在...底下
依此類推
相信就比較能清楚知道這個被點擊的元素對應到的是畫面上的哪個元素
