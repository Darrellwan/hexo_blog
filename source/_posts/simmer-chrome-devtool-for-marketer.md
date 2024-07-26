---
title: TeamSimmer - Chrome DevTools For Digital Marketers 課程分享
tags:
  - Martech
  - Simmer
  - Chrome Devtool
categories:
  - Martech
page_type: post
id: simmer-chrome-devtool-for-marketer
description: Team Simmer 的新課程：Chrome DevTools For Digital Marketers，課程簡介和一些上課的心得分享
bgImage: teamsimmer-chrome_devtool_for_digital_marketers_bg.jpg
preload:
  - teamsimmer-chrome_devtool_for_digital_marketers_bg.jpg
date: 2024-07-26 22:00:07
---

{% darrellImageCover teamsimmer-chrome_devtool_for_digital_marketers_bg teamsimmer-chrome_devtool_for_digital_marketers_bg.jpg max-800 %}

之前介紹過 Simo Ahava 以及他們的 Team Simmer 一個優質的免費內容
<a href="https://www.darrelltw.com/simmer-martech-handbook/"><i class='bx bx-link-external bx-flashing-hover' > Simmer 的 Martech Handbook 簡介&心得 </i></a>

這次全新推出了新課程 : <a href="https://www.teamsimmer.com/all-courses/chrome-devtools-for-digital-marketers/"><i class='bx bx-link-external bx-flashing-hover' > Chrome DevTools For Digital Marketers </i></a>

剛好跟到了新課程的優惠，於是就購入並且上完這整趟課程

## 課程內容簡介

附上網頁的課程大綱，
除了簡介和最後的總結，
總共有七大章節，每個章節又會有三個左右的小節影片

{% darrellImage800 simmer-chrome-devtool-for-marketer_lesson_outline lesson_outline.png max-800 %}

### Inspect And Modify The Web Page

主要是講解 Devtool 如何對網頁上的 DOM 操作
或是尋找網頁上的某個按鈕或區塊，並找到對應的 CSS Selector 路徑
相信這是蠻多有接觸 Devtool 或是前端工程師都很熟悉的部分

有時候做網頁時會先在 Devtool 調一下顏色、佈局等等
確認滿意後再回到程式碼修改

在行銷科技的領域中
有些電子報平台有內建搜集名單的表單功能
就可以知道表單放在網頁上大概會長什麼樣子

檢查蓋板工具的彈出和外觀也可以用 Devtool 檢查 DOM 的功能

{% darrellImage800 chrome_devtool_element_in_darrelltw chrome_devtool_element.png max-800 %}


### Execute And Debug JavaScript

這一章節就偏向工程師領域多一點
首先 JavaScript 就是一個在瀏覽器和網頁的一大部分

例如網頁新放上功能後，並且運作不正常
一般的使用者就只會發現，這功能好像沒在運作
好一點的體驗是會彈出一個錯誤訊息，但這時又要看錯誤訊息寫得清不清楚
大部分都只會寫個 `xxx error` , `錯誤，請聯絡xxx` 等等

如果會使用 Devtool 的 console 和 source 來檢查 JavaScript
大部分應該就很快知道問題錯在哪
這時再回報給開發的工程師，對方就能很快定位錯誤和修正

修 Bug 蠻常的情況: 找觸發 Bug 的原因 >>> 修 Bug

{% darrellImage800 chrome_devtool_console_tool_in_darrelltw chrome_devtool_console_tool.png max-800 %}

### Manipulate Loaded Resources

現在的網頁除了做好自己的功能外
只要有引入一些行銷科技相關的工具
例如 GTM, GA4, Meta Pixel 等等
這些會算是網頁 **額外載入的資源**

Devtool 厲害的地方在於他有很多方式可以控制這些載入資源
自己以前最常使用的方式是在自己的瀏覽器暫時阻擋某個資源載入

情境:
> 有客戶說網站有問題，懷疑是我們的 GTM 造成的
> 這時先用上面提到的方式重現 Bug 
> 並且把 **GTM 暫時不要載入** 
> 如果 Bug 還在，基本上就可以99%確定不是 GTM 造成的
> 有空閒的話可以再利用 Devtool 幫客戶找出可能的問題點回報給他們
```
:)) hello haha <3  :p ^3^
```

{% darrellImage800 chrome_devtool_source_in_darrelltw chrome_devtool_source.png max-800 %}

### Inspect Network Traffic

追蹤網頁的 requests 在 行銷科技也很重要

例如GA4，因為我們在GA4追蹤的每個事件其實都是一個一個的 request 從我們的瀏覽器發送到 Google 去做紀錄，在經過他們的處理後呈現在 GA4 報表上。

如果我們的網站是一個出貨地，那 request 就像是物流的送貨大哥，Devtool 的 Network(網路) 就是一個可以讓我們檢查物流送出去的貨物內容對不對，有沒有正確的送到我們指定的地方。

任何需要安裝程式碼或俗稱埋碼的工具都會需要用這種方式來檢查，當然有些工具平台在他們那邊可以做確認，像是 GA4 的 Debug view，但是Devtool 的好處是你除了可以發現錯誤，也能更快反查錯誤的原因

只用 Debugview 發現錯誤後還是得回頭用Devtool 確認，或直接請工程師幫忙處理

{% darrellImage800 chrome_devtool_network_in_darrelltw chrome_devtool_network.png max-800 %}

###  Analyze Page Performance

檢查網頁的效能就比較屬於進階應用
網頁跑的很慢或是一直有些不在預料內的程式在執行時
就可以用 Performance 來監控網頁到底在執行什麼東西

{% darrellImage800 chrome_devtool_performance_in_darrelltw chrome_devtool_performance.png max-800 %}

###  Interact With Browser Storage

儲存部分包含了大家都很熟悉的 Cookies 

無論是所謂的第一方或第三方 cookie 都可以在這邊檢查
主要是可以看看這些cookie 的值是什麼
像 GA4 所謂的 client id (cid) 也是 GA4 用來記錄裝置的 id，
也是儲存在 cookie 裡面

課程中提到的是在 AB測試的應用，學會後便能輕鬆的切換自己的對照組實驗組來測試

{% darrellImage800 chrome_devtool_appllication_cookie_in_darrelltw chrome_devtool_appllication_cookie.png max-800 %}

###  Useful DevTools Resources

這一段會介紹一些額外的 Devtool 好用工具
例如切換手機板，可以快速模擬檢視網頁在手機裝置的瀏覽狀況

也有提到 Lighthouse，一個可以完整測試網頁載入速度的工具
像是 Google 會很在意網頁的載入，和一些相關的指標 (有時候會含在 SEO 的領域，因為網頁的載入也可能會影響 Google 排名)

{% darrellImage800 chrome_devtool_lighthouse_in_darrelltw chrome_devtool_lighthouse.png max-800 %}

## 這堂課適合的人:

### 埋code的夥伴

如果一週有兩天以上需要打開 GTM 來埋 Code 或是檢查網站追蹤正確與否

那這堂課會讓你學到一些技巧而可以加速整個流程

如果不是工程師 : 那你有將能做到更多或更深的排查，並且能提供更詳細的資料給工程師並合作的更流暢

如果已經是工程師，但對 Devtool 略知一二，這堂課更能打通你在 Devtool 的任督二脈，Debug 的更快

### PM 

工作經驗中有遇到 PM 除了專案管理以外

也需要做一些功能上線後的檢查

課程中有一節就有提到一個好方法，讓 Devtool 怎麼記住你操作的步驟並且自動重現

這樣只需要手動操作一次，後續無論要檢查自動幾次都可以放著讓 Devtool 自己跑

### 任何想多學點技能加快工作的 Life Hacker

這點就比較見仁見智

身為工程師和技術顧問當然知道 Devtool 有多重要

但回頭想想其實現在每個人每天都是開著瀏覽器在上班工作

學會 Devtool 後真的就是多了一些別人不會的技能和手段

最理想的情況是你學會一個技能後，開啟了更多優化工作流程的想像，並且實踐它

Devtool 目前不只有 Chrome 可以用，任何以 Chromium 開發的瀏覽器例如

Brave、微軟的 Edge 等等也都可以通用

而 Safari、Firefox 雖然不是跟 Chrome 同樣的核心，但他們的檢查工具其實也都是略有不同，相信六成以上是可以通用的

{% darrellImage800 three_browswers_in_darrelltw three_browswers.png max-800 %}
