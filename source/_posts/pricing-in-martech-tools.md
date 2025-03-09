---
title: 行銷工具的價格計算方式 MTU Events Subscription 
tags:
  - 行銷工具
categories:
  - Martech 
page_type: post
id: pricing_in_martech_tools
bgImage: pricing-in-martech-tools-bg.jpg
description: 數位行銷工具越來越多，而且每一種的計費方式也不太相同，介紹一些常見的指標來了解這些工具是怎麼計價的。
date: 2024-04-08 21:01:00
---

{% darrellImageCover pricing-in-martech-tools-bg pricing-in-martech-tools-bg.jpg max-800 %}

## MTU - Monthly Tracked User

以每月追蹤到的使用者為主，這邊的使用者偏向裝置，也就是一個使用者未登入的情況下，如果使用三種不同裝置和你的網站互動，就會計價為3

但像是 Mixpanel 就提到使用者是登入的情況下，就會計價為1

會不會把使用者登入後就收斂的方式就要多參考文件或是直接在報價階段問清楚會比較適合

### Amplitude, VWO, (Mixpanel)

Amplitude 是有名像是 GA4 和 Mixpanel 的分析工具，但它主要是以 MTU 當作計價

{% darrellImage800 amplitude_pricing_202404 amplitude_pricing.png max-800 %}

VWO 也是有名的 AB 測試工具

{% darrellImage800 vwo_pricing_202404 vwo_pricing.png max-800 %}

上述舉例的工具都還有功能上的 Plan 差異，也就是說一樣的 MTU，選擇更多功能的話價格就會越高

[VWO 網站上的價格](https://vwo.com/pricing/)

另外 Mixpanel 也有 MTU 計價的方式，但低消是 $10,000 美金起跳!
適合較大流量的網站，可以和 Mixpanel 討論是用 MTU 還是用 Events 計價比較划算

{% darrellImage800 mixpanel_pricing_in_mtu_202404 mixpanel_pricing_in_mtu_202404.png max-800 %}

[Amplitude 網站上的價格](https://amplitude.com/pricing)

### Segment CDP

有名的 CDP 工具 Segment 也是使用 MTU 作為主要的價格依據，豐富方便的串接性適合同時使用多種行銷工具平台的用戶達成最快速的串接

{% darrellImage800 segment_mtu_202404 segment_mtu_202404.png max-800 %}

### CleverTap - MAU - Monthly Active User

CleverTap 是一個跨渠道行銷自動化工具，但網站上會是以 MAU 當作計價方式
只是從他的文件說明來看，其實他所謂的 MAU 應該和 MTU 類似，未來如有機會試用並且找到特別不同的話會再補充

{% darrellImage800 clevertap_pricing_in_mau_202404 clevertap_pricing_in_mau_202404.png max-800 %}

{% darrellImage800 clevertap_mau_defination clevertap_mau_defination.png max-800 %}

[Clevertap 網站上的價格](https://clevertap.com/pricing/)

## Events, Hits, API Calls

以 Events 或是 API Calls 計價的方式比較直覺，像是以一個事件或是一次 API Call 就算為 1
基本的網站追蹤或是埋點通常一個裝置一次進站都會有多個事件
例如
- page_view 網頁瀏覽
- scroll 網頁捲動
- click 點擊指定按鈕
- view_item 商品瀏覽
- purchase 購買完成
- register 註冊完成

...等等

假設平均每個使用者瀏覽都會有大約 **10 個事件**
那每月 **1萬的使用者** 流量大約就會產生 **10萬個事件**

### GA4

GA4 絕大多數的使用者都會是免費版本

其實他還是有個企業用的付費版本，只是級距非常高，通常是每月流量真的很大的用戶才會評估是否購買

目前官方並沒有公開的價格級距表

有些其他網站查到的大概為 2500萬 到 5000萬以上的每月事件量開始收費，價格落在一百萬台幣起跳

這邊提供部分的 GA360 功能差異和官方文件供大家參考

{% darrellImage800 ga4_360_difference ga4_360_difference.png max-800 %}

[[GA4] Google Analytics (分析) 360 (Google Analytics (分析) 4 資源)](https://support.google.com/analytics/answer/11202874?hl=zh-Hant)

另外 GA360 需要找指定的代理商購買喔!

{% darrellImage800 ga4_360_analytics_partner ga4_360_analytics_partner.png max-800 %}

[GA360 Taiwan Partners 列表](https://enterprisemarketingportal.google/find-a-partner?certificationsFilters=Analytics&salesPartner=ANALYTICS&countriesFilter=TW&regionsFilter=APAC&a=2061857896)

進入後將左方的 Country 篩選到自己需要的國家即可

畫面中以台灣的 Partners 為主

### Mixpanel

在 MTU 的時候有提到 Mixpanel 可以在 10000 美金每年以上時用 MTU 計價
不過較小流量的客戶就會只使用 Events 數計價

{% darrellImage800 mixpanel_pricing_in_events_202404 mixpanel_pricing_in_events_202404.png max-800 %}

### Segment API Calls

雖然前面提到 Segment 是使用 MTU 作為收費依據
只是想到以免費版舉例，他也有限制 API Call 的數量

{% darrellImage800 segment_free_tier_api_call_limit segment_free_tier_api_call_limit.png max-800 %}

以這張圖為例，在 1000 的 free tier 中，就有限制 250000 的 API Calls + Object

也就是說 Segment 可以容許**最多 1000 MTU 以外，也只能容許每個 User 產生平均最多 250 個 Events**!

官網中有張圖片蠻清楚的表示 MTU 和 API Call 的關係:

{% darrellImage800 segment_api_calls_description segment_api_calls_description.png max-800 %}

[Segment - MTUs, Throughput and Billing](https://segment.com/docs/guides/usage-and-billing/mtus-and-throughput)

## Subscription

Subscription 通常會以名單的量當作計費依據

例如你有會員管理系統有 100000 個會員，你想要放入這個工具做行銷訊息的傳送，
那他們就會以 100000 作為收費依據，
但另外還是有訊息發送的上限量 (發電子信，推播)

### Convertkit

Convertkit 是國外蠻常看到在使用作為蒐集名單一個工具，他蒐集名單的方式非常多元
並且也有好用的自動化旅程來做搭配，可以讓名單的蒐集和分類做到高度自動化

{% darrellImage800 convertkit_pricing_in_subscribers_202404 convertkit_pricing_in_subscribers_202404.png max-800 %}

[Convertkit 網站上的價格](https://convertkit.com/pricing)

### MailChimp

MailChimp 應該是台灣大多數人都有聽過很有名的發信平台
完整的功能和不錯的發信表現
只是價格較類似功能的平台真的比較奢華

{% darrellImage800 mailchimp_pricing_in_subscribers_202404 mailchimp_pricing_in_subscribers_202404.png max-800 %}

[MailChimp 網站上的價格](https://mailchimp.com/pricing/marketing)

### OneSignal

OneSignal 是蠻多網站都有安裝 WebPush 一個平台，
他在 WebPush 和 AppPush 的串接真的非常方便快速
網站上提供的價格有多種

{% darrellImage800 onesignal_price_plan onesignal_price_plan.png max-800 %}

除了功能的差異性外
Enterprise、Professional 就沒有提供估價
只有 Growth 有提供計算器可以參考

{% darrellImage800 onesignal_pricing_in_subscribers_202404 onesignal_pricing_in_subscribers_202404.png max-800 %}

雖然是個跨渠道行銷工具，每個渠道除了 AppPush 以外就會各自計價，但主要還是會以 Web and App push subscribers 為主

[OneSignal 網站上的價格](https://onesignal.com/pricing#calculator)

## Send Volume

### OneSignal

像是上面提到，OneSignal 的價格也會根據發送訊息的量有關係
主要是發電子信、In-App Push
簡訊主要就要視每個國家合作的電信商為主

### SendGrid

SendGrid 在台灣雖然沒有這麼有名，不過還是有時候會聽到公司在使用
比較特別的是它的價格方案有兩種，
**一種是給工程師用**的，主要直接是串接在自己的系統服務中作為訊息的通知
這種方案就會只計算發送電子郵件的數量

**另一種方案就是給行銷人員**使用，就會有介面可以使用
就會像是 OneSignal 一樣需要計算名單的人數和訊息發送量

{% darrellImage800 sendgrid_pricing_in_subscribers_202404 sendgrid_pricing_in_subscribers_202404.png max-800 %}

[SendGrid 網站上的價格](https://sendgrid.com/en-us/marketing/sendgrid-services-cro)

## 技術面的計價: Hours

這種用小時計價的方式比較少會在行銷工具出現，
大部分都出現在所謂的雲端服務例如 GCP、AWS、Azure 上

方式為我們需要這些服務執行一段程式碼來滿足我們的需求
所以他們會根據這段**程式碼要跑多久**來當作計價的方式
例如一些串接需要工程師撰寫程式碼 Call API 來串接
假設這段程式碼要跑 50毫秒
每個月估計這段程式碼要跑 100,000 次
這個月總共就需要大約 83.3 分鐘，約1個小時又23分

### Segment Function

Segment 的免費版中就會限制 Function 的執行時間
Function 主要用來滿足當內建的串接無法滿足特別的串接需求
或是像很多台灣才有的服務並不會出現在 Segment 當作一鍵串接的平台
就可能需要用 Function 來撰寫程式碼串接!

{% darrellImageh800 segment_function_in_free_tier segment_function_in_free_tier.png max-800h %}

Segment function 就提供了 50 小時一個月的免費版，以上述的舉例來說算是非常夠用

## 其他的方式

另外還有些工具的計價方式比較特別，
希望未來有發現到就可以補充在這邊，
讓大家可以稍微理解一下這些工具是怎麼計價的

### Zapier

{% darrellImage800 zapier_pricing_in_task_202404 zapier_pricing_in_task_202404.png max-800 %}

Zapier 計價的方式就是比較特別的類型
他會以執行的 Zaps 或是也稱為 Action 當作一個單位

{% darrellImage800 alt zapier_action_example.png max-800 %}

以這張圖為例，這流程走完總共會觸發兩個 Actions
每個月執行這個流程1000次的話
就會消耗掉 2000 的 quota

[Zapier 網站上的價格](https://zapier.com/pricing)

### Hotjar

Hotjar 是一個做使用者畫面錄製的工具，
這樣就可以看到使用者是如何和網站作互動
並且觀察使用者是否按照規劃的流程走

計價模式為每天可以錄製的量為多少，以下方圖片舉例為 每天 1500個錄影
所以大流量的網站不一定要把錄製的量買到跟流量接近

可以規劃是否只需要錄製某些特定的流量和頁面即可

{% darrellImage800 hotjar_pricing_in_session_202404 hotjar_pricing_in_session_202404.png max-800 %}

[Hotjar 網站上的價格](https://www.hotjar.com/pricing/)

