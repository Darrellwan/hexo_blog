---
title: Google Tag Manager 工作區過大，原來有空間大小限制
tags:
  - Google Tag Manager
categories:
  - Google Tag Manager
page_type: post
id: gtm-size-limit
description: 遇到 GTM 的工作區過大問題，代表 GTM 裡面已經包含了太多的設定，需要做一些確認和大掃除才能保持 GTM 的整潔，希望能幫助到一些遭遇到此困境的大家
bgImage: GTM-size_limit_bg.jpg
preload:
  - GTM-size_limit_bg.jpg
date: 2024-07-04 11:58:20
---

{% darrellImageCover GTM空間過大 GTM-size_limit_bg.jpg max-800 %}

## GTM 的大小空間限制

當你辛辛苦苦維護和增加一些追蹤設定到 Google Tag Manager 後，有一天卻突然發現他跳出了大小的警告，最慘的是想要發布或預覽卻彈出了工作區過大的訊息

{% darrellImage800 gtm_size_limit_warning gtm_size_limit_warning.png max-800 %}

上網查詢後會發現其實已經很多前輩有遇過，並且其實有個硬限制 : 200kb

實務上來說，其實這狀況不算少見，很多大品牌或流量較大網站，亦或是將一個 GTM 安裝在多個網站時
都很容易會遇到空間大小限制，原因是要維護的 Tags, Triggers 其實都很大量
沒有一個更好的架構和策略，常常就會讓 GTM 內的東西一直累積下去直到爆炸

另外需要提到，他其實和你的 Tags Trigger 數量不一定是最直接的關係
有的 GTM 可能 100~200 Tags 就會遇到空間不足的問題，卻有 GTM 可以到上千 Tags 才遇到
也就是說，每個 Tag 的大小是獨立計算的，沒有好好維護的單一 Tag 就很有可能佔用太多空間

## 檢查過大的問題

2024/07 之後 GA3 正式的退場，但相信很多 GTM 上應該都還有殘留一些 UA 的設定
之後會介紹一個好用的國外工具，他可以偵測 GTM 裡面的 UA 設定並幫忙做一次性的排除

現在好好來看看 GTM 的 Tags 清單
{% darrellImage800 gtm_tag_lists gtm_tag_lists.png max-800 %}

可以簡單將範例中的清單分為兩個區塊
上半部分都是只追蹤 GA4 的事件或設定，基本上這邊占的大小空間都不會太多，因為是 GTM 做好的模板

下半部分就是會比較可疑的地方 `自訂 HTML` 這種 Tag 每個幾乎都可以是一個小宇宙，
通常會使用這種 Tag 的都會是外部的廠商安裝他們服務需要的程式碼，或是自己的工程師部門幫忙維護 GTM

舉例1: 這種像是 Facebook Pixel 的程式碼大概就需要這樣的一段程式碼來運作
是非常合理的程式碼，且也是非常必要的，對於 Facebook(Meta) 的廣告優化幫助非常大
{% darrellImage800 gtm_html_tag_facebook_pixel_demo gtm_html_tag_facebook_pixel_demo.png max-800 %}

舉例2: 這算是一個極度不合理也不可能出現的案例
{% darrellImage800 gtm_html_tag_bad_example gtm_html_tag_bad_example.png max-800 %}
這個舉例拿給任何一個會寫點 JavaScript 的人大概都會覺得這是什麼鬼
不過這邊想呈現的概念是，不要在 自訂 HTML 的裡面寫太多這種無意義的程式碼
`console.log("xxx")` 可能是安裝的人員在初期需要測試時使用
但建議在上線和發佈時，最好都要移除這種對真實使用者較沒有實際功能的語法

## 處理方法
希望未來 GTM 會內建可以直接呈現每個 Tag 實際佔據多少空間(或是多少%)的功能
讓大家在遇到空間問題時能直接判斷是哪些 Tag 如此肥大

這邊有一種做法可以檢測，只是需要點時間和耐心

### 檢查版本紀錄的大小變化

{% darrellImage800 gtm_version_check_size gtm_version_check_size.png max-800 %}

截圖雖然是極端範例，但也可以輕鬆看出例如版本 3->4 , 4->5 在空間上有跳躍式的成長

{% darrellImage800 gtm_check_single_version_size_change gtm_check_single_version_size_change.png max-800 %}

點擊進入版本4
可以看到兩個資訊
1. 滑鼠移到 ? 時會跳出這個版本增加了多少大小
2. 下方可以看到這個版本調整的 Tag Trigger 等等有哪些，大概就可以猜到這些 Tag 一定有其中一個或多個佔了太多空間

### 請工程師或專業人員幫忙檢查

因為 Html 代碼裡面的 Code 對非工程師來說都比較陌生
刪除一些看似無關緊要的程式碼可能都會讓這個 Tag 整組壞去
更糟糕的情況是讓線上的使用者也體驗或觀察到一些錯誤訊息

所以可能還是需要有程式背景的人幫忙確認
確認方向大概會是下面幾點
- -> 有沒有很多看起來重複的程式碼，是否可以優化抽出
- -> 是否有寫得太複雜的 function，雖然 GTM 只能用 JS ES5 的語法，但有些寫得太冗長的邏輯還是有優化空間
- -> 有沒有忘記移除的 console 等測試語法
- -> 有沒有大範圍的註解(commnet)程式碼，這些程式碼雖然被註解但還是有佔據字元空間

等等

後續如果有找到不錯的工具或是其他發現，也會更新過來讓大家在解決空間大小上有更快更方便的做法!
