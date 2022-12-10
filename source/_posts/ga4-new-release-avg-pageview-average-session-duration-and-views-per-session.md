---
title: GA4 更新 - 每個工作階段的瀏覽次數 和 平均單次工作階段參與時間 
tags:
	- Google Analytics 4
	- GA4 New Release
categories:
	- Google Analytics 4
page_type: post
date: 2022-12-10 21:55:11
description: GA4 更新內容 - 20221205 釋出新的兩個指標，每個工作階段的瀏覽次數 和 平均單次工作階段參與時間，這兩個指標能透露更多有關使用者在網頁上停留多久，以及瀏覽的次數為何偏高或偏低
---

{% darrellImageCover GA4的新功能釋出 ga4_new_release_20221205_bg.png max-800 %}

[GA4 Google 官方文件 20221205](https://support.google.com/analytics/answer/9164320?hl=en#120522&zippy=%2Creleases)


## 在探索報表新增兩個維度可以使用 

{% darrellImage800 兩個新指標在探索報表的位置 ga4_explorere_show_new_two_parameters.png max-800 %}

## 每個工作階段的瀏覽次數

其實很明顯的，就是把瀏覽除以每個工作階段而計算出來的數字。
乍看之下沒什麼，卻是很好的顯示了哪些頁面被瀏覽的次數較多

以 Google Merchandise Store 的 demo account 截圖中就可以看到
basket 的瀏覽量高於商品頁面，算是蠻正常的現象
因為商店中只要加入購物車，就可以選擇到達 basket 頁面

這個指標可以告訴你哪些頁面可能較為吸引人，文章或商品的頁面都蠻適用的

有安裝 APP 的帳戶需要注意
這邊的瀏覽是 screen_view + page_view 的數值
所以如果顯示的維度是 app 和 web 共用的
每個工作階段的瀏覽次數 = **(screen_view + page_view) / session**

{% darrellImage800 GA4_Demo帳戶中的每個工作階段的瀏覽次數 views_per_session_in_demo_account.png max-800 %}

## 平均單次工作階段參與時間

如同上一個指標，這也是一個平均後得到的指標
**使用者參與(時間)/Session** 所得到

[使用者參與在GA4中的官方文件](https://support.google.com/analytics/answer/11109416)
該時間就是使用者開啟你網站後，有在前景使用的時間長度
大概的意思就是使用者不只有打開網頁，還是有真正的在瀏覽網頁，不是單純的開啟一個分頁但沒有在瀏覽

{% darrellImage800 GA4_Demo帳戶中的平均單次工作階段參與時間 average_session_duration_in_demo_account.png max-800 %}

## 結語

兩個平均的維度在分析網頁的瀏覽行為上都很有幫助

一個是針對瀏覽的次數
一個是針對瀏覽的時間長度

記得可以加上這兩個指標來多加分析

