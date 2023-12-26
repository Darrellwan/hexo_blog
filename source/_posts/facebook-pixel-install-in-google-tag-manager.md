---
title: Facebook Pixel 利用 GTM 安裝和注意事項避免重複觸發
date: 2023-12-03 19:46:45
tags:
	- Google Tag Manager
	- Facebook Pixel
categories:
	- Pixel Tracking
page_type: post
id: facebook-pixel-install-in-google-tag-manager
description: Facebook Pixel 像素是一個很常見安裝在網站上的程式碼，只是 Meta 在 Pixel像素 的安裝文件中只提到最簡易的安裝方式，這種方式促使只要網站上安裝超過一組 Pixel ID 就會造成重複觸發或是互相干擾的情況，這裡也會提供在 Google Tag Manager 或是 hardcode 上可以避免的方式
bgImage: facebook_pixel_install_in_google_tag_manager_bg.png
---

{% darrellImageCover facebook_pixel_install_in_google_tag_manager_bg facebook_pixel_install_in_google_tag_manager_bg.png max-800 %}

## 取得像素 Pixel ID

如果你已經有相關像素，或是你第一次建立廣告帳戶
都可以參考 臉書的相關文件來建立 Pixel [如何設定及安裝 Meta 像素](https://www.facebook.com/business/help/952192354843755?id=1205376682832142)

{% darrellImage800 取得Meta像素程式碼 get_facebook_pixel_code.png max-800 %}

{% darrellImage800 取得Meta像素ID get_facebook_pixel_id.png max-800 %}

不過你是電商網站，並且是使用電商平台如 Shopline, 91App, CyberBiz 等等，這邊就不太建議使用 GTM 的方式來安裝
(有些平台可能甚至不願意開放 GTM 權限給你)

建議你直接在電商的後台管理介面中插入 Pixel ID 即可
這些電商平台的相關教學

[Shopline 绑定 Facebook Pixel 像素代码](https://help.shopline.com/hc/zh-cn/articles/900005804243-%E7%BB%91%E5%AE%9A-Facebook-Pixel-%E5%83%8F%E7%B4%A0%E4%BB%A3%E7%A0%81-)
[91APP 推出新版 Facebook 商業擴充套件，助您輕鬆管理 FB 數位資產](https://www.91app.com/blog/manage-your-facebook-assets-through-facebook-business-extension/)
[CyberBiz FACEBOOK 商業擴充套件－STEP.1-1 初步設定](https://www.cyberbiz.io/support/?p=11341)

## 在 GTM 安裝 Facebook Pixel 

確定要安裝在 GTM 
並且從上面複製到 Facebook Pixel Code 之後

新增一個 **Tag 代碼 - CustomHtml 自訂Html**
觸發條件選 **All Pages**

{% darrellImage800 insert_facebook_pixel_code_in_gtm insert_facebook_pixel_code_in_gtm.png max-800 %}

官方文件
[如何設定及安裝 Meta 像素](https://www.facebook.com/business/help/952192354843755?id=1205376682832142)

## 標準事件、自訂事件

### 標準事件

這邊先列出標準事件的列表
```
新增付款資料, AddPaymentInfo
加到購物車, AddToCart
加到願望清單, AddToWishlist
完成註冊, CompleteRegistration
聯絡資料, Contact
自訂產品, CustomizeProduct
捐款, Donate
尋找分店地點, FindLocation
開始結帳, InitiateCheckout
潛在顧客, Lead
購買, Purchase
排程, Schedule
搜尋, Search
開始試用, StartTrial
提交申請, SubmitApplication
訂閱, Subscribe
瀏覽內容, ViewContent
```

只要使用這些英文的事件名稱，就會算是標準事件
它的完整 pixel 事件追蹤碼格式如下
```
fbq('track', '{{標準事件}}');

fbq('track', 'AddPaymentInfo')
fbq('track', 'AddToCart')
fbq('track', 'AddToWishlist')
fbq('track', 'CompleteRegistration')
fbq('track', 'Contact')
fbq('track', 'CustomizeProduct')
fbq('track', 'Donate')
fbq('track', 'FindLocation')
fbq('track', 'InitiateCheckout')
fbq('track', 'Lead')
fbq('track', 'Purchase')
fbq('track', 'Schedule')
fbq('track', 'Search')
fbq('track', 'StartTrial')
fbq('track', 'SubmitApplication')
fbq('track', 'Subscribe')
fbq('track', 'ViewContent')
```

如果你需要傳送金額或商品資訊
可以參考下面這個文件

[Meta 像素-參考資料](https://developers.facebook.com/docs/meta-pixel/reference/)

其實 contents 和 content_ids, content_name 可以選一種方式發送即可

{% darrellImage800 facebook_pixel_contents_content_ids facebook_pixel_contents_content_ids.png max-800 %}

### 自訂事件
自訂事件就比較好分辨，
不在上方列表的事件名稱，**就都是 自訂事件**

```
fbq('trackCustom', '{{自訂事件}}');

// 例如

fbq('trackCustom', 'Hi');
fbq('trackCustom', 'Hello');
```

這邊不同就是第一個參數從 track 變成 trackCustom
後面一樣加上參數名稱
另外如果有其他的額外參數想要放入，直接以 Object {} 的形式放在第三個參數就好

```
fbq('trackCustom', 'Hi', {name: 'Bob'});
fbq('trackCustom', 'Hello', {name: 'Jack'});
```

## 避免觸發的進階技巧

一但網站上安裝超過一組的 Facebook Pixel Code 時
原先上面官方文件提到的方式就會開始或多或少的出現一些問題
最麻煩的自己的 Pixel ID 會接收到其他人或是廠商觸發的事件
這本身有好有壞，如果別人的安裝方式正確且完整，那就剛好搭上好的順發車

但如果對方安裝的事件和參數自己根本不需要，或是不太正確
那被影響到就會很冤枉，且沒有方式可以避免!

### 範例

官方範例:
{% darrellImage800 facebook_mutiple_pixel_tracking_demo facebook_mutiple_pixel_tracking_demo.png max-800 %}

這邊截圖的橘色和紫色部分其實都會造成問題
因為 Pixel A 和 Pixel B 先後都被 init (類似註冊的概念)
後面觸發的任何事件，都會以 **廣播** 的方式發送給任何有 init 的 Pixel ID

橘色的標準事件 PageView 會同時發送給 A 和 B, 所以 A 其實多觸發了一次的 PageView
紫色的自訂事件 Step4 通常預期只會發送給 B, 但其實還是同時發送給 A 和 B, A 收到了一個不在預期內的事件

### 解決方式

其實官方的文件一直都有該如何解決這問題的方案
該文章甚至早在 2017 年就已經出現
[Facebook - Accurate Event Tracking with Multiple Pixels](https://developers.facebook.com/ads/blog/post/v2/2017/11/28/event-tracking-with-multiple-pixels-tracksingle/)

但自己一直覺得應該把這個做為預設的方式，現實世界中一個網站要安裝大於一個的 Facebook Pixel 其實非常常見
例如原本找了廣告代理商 A, 後面換成代理商 B 最後改為自己找團隊來操作廣告
這樣基本上最少就有三組 Facebook Pixel Code 在網站上
很容易就算沒有和該廠商合作，也沒發現他們的 Pixle Code 一直沒有移除，隨著時間網站上就會慢慢累積多組 Code

{% darrellImage800 facebook_mutiple_pixel_tracking_solution facebook_mutiple_pixel_tracking_solution.png max-800 %}

一樣針對 標準事件和自訂事件 都有各自需要些微調整的地方

```
// 標準事件

fbq('track', 'Purchase', {
	'value': 4,
	'currency': 'GBP'
});

fbq('trackSingle', '<PIXEL_A>', 'Purchase', {
	value: 4,
	currency: 'GBP',
});

將原本的 track 改為 trackeSingle
並在後面多放上 `pixel_id`
這樣就可以讓該事件，只發送給標示的 pixel_id
```

```
// 自訂事件

fbq('trackCustom', 'Step4');

fbq('trackSingleCustom', '<PIXEL_B>', 'Step4',{});

和標準事件很像
把 trackCustom 改為 trackSingleCustom, 並在後面多一個欄位是指定的 `pixel_id`
其餘都和原本的方式一樣
```

其實整個方式對於工程師來說算是很簡單的，
所以也希望如果有機會需要在 GTM 或是直接放在前端 code 上的 facebook pixel
如果都能使用這套避免重複觸發的方式來安裝，那就會大幅降低彼此之間的影響

安裝精準且資料豐富正確的 Facebook Pixel Code 都會很好的幫助廣告的成效
且讓操作廣告的人在廣告後台可以安排更多不同的受眾策略
例如 瀏覽過 商品名稱包含xxx 且價格介於 ooo 到 yyy 的人來當作受眾



