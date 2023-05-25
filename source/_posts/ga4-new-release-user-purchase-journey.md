---
title: GA4 更新 - 使用者購物歷程 一眼看出使用者在購物過程中的流失
date: 2023-05-25 00:10:13
tags:
	- Google Analytics 4
	- GA4 New Release
categories:
	- Google Analytics 4    
page_type: post
description: 使用者購物歷程是一個最近才剛更新的報表，不需要自己額外建立，已經出現在 GA4 的報表中。可以依序看到 session_start -> 商品瀏覽 -> 加入購物車 -> 結帳 -> 購買的流程，需注意的是該 Funnel Report 使用 Close Funnel，所以需要完全符合這個步驟的流程才會納入報表裡
---

{% darrellImageCover GA4的新功能釋出使用者購物歷程報表 ga4-new-release-user-purchase-journey_bg.png max-800 %}

轉移的倒數階段，電商的用戶們應該都已經做好 GA4 的電商追蹤了，這兩個月的更新中也包含了內建這個電商用戶很需要的功能: 使用者購物歷程
用來看到使用者在整個過程中的流失率

## 使用者購物歷程報表 

{% darrellImage800 使用者購物歷程報表_圖片 ga4-user-purchase-journey-overview.png max-800 %}

借用 GA4 Demo Account 的資料來當作範例

可以看到是一個五個步驟的 Funnel Report
第一步為 工作階段開始 (Session Start)
幾乎會是使用者一進站就觸發的第一個事件

{% darrellImage800 使用者購物歷程報表_第二步驟 ga4-user-purchase-journey-overview_step2.png max-800 %}
第二步為查看產品 (view_item)
使用者開始瀏覽商品時觸發的事件

滑鼠移到圖表上時，會清楚顯示這個步驟剩下的使用者人數，以及和**上一步驟相比的占比**


---

{% darrellImage800 使用者購物歷程報表_第三步驟 ga4-user-purchase-journey-overview_step3.png max-800 %}
第三步為加入購物車 (add_to_cart)
使用者將商品點擊加入購物車
請注意無論是商品內頁，或是商品列表都算
但在這個 Funnel Report 中並不太會採計從商品列表頁 加入購物車的使用者
原因是他們並沒有查看產品 **和封閉式漏斗有關**

---

{% darrellImage800 使用者購物歷程報表_第四步驟 ga4-user-purchase-journey-overview_step4.png max-800 %}
第四步為開始結帳 (begin_checkout)
為使用者進入了結帳流程，通常為購物車列表頁面或是輸入金物流等資訊時

---

{% darrellImage800 使用者購物歷程報表_第五步驟 ga4-user-purchase-journey-overview_step5.png max-800 %}
第五步為購買 (purchase)
應該使用者購買完成成立訂單時觸發

---

## 封閉式漏斗

{% darrellImage800 GA4_漏斗探索_說明 GA4_funnelreport_explain.png max-800 %}
[官方文件](https://support.google.com/analytics/answer/9327974?hl=zh-Hant)


GA4 的漏斗報表有兩種
- 開放式
- 封閉式

所謂的漏斗報表，就代表我們會預設使用者經過哪些事件作為一個漏斗的階段
以使用者購物歷程報表舉例，就是把最常見的電商事件作為一個漏斗
而該報表使用的封閉式代表
**使用者必須完全符合這五個事件的順序**才會被記錄
而所謂的開放式就會變成
**使用者只要符合這個順序就可以，不需要完全五個事件都有才算，但也不能跳過其中的步驟**
例如設定的漏斗為 A>B>C
A>C 就不算
A>B, B>C 就會算入

這邊在探索報表的漏斗報表也會是一樣的概念
有了開放式報表和封閉式報表的了解後
相信在探索報表就不會因為切換這個選項而對於數字劇烈的變化感到疑惑

