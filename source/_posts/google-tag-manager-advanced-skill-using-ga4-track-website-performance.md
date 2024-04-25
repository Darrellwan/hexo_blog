---
title: 利用 GA4 GTM 來追蹤網頁載入時間 - GTM 進階技巧
tags:
  - Google Tag Manager
  - Google Tag Manager 技巧
  - JavaScript
  - Google Analytics 4
categories:
  - Google Tag Manager
page_type: post
date: 2022-12-23 23:38:02
modified: 2024-04-25 22:11:05
description: 以前使用舊版的GA中看得到使用者的網頁載入時間，目前在 GA4 預設是沒有這個功能的，於是找到了可以使用 JavaScript 來取得相關的載入時間後，用GA4 的 event 來搜集相關訊息 
---


{% darrellImageCover GTM-進階-網頁載入時間 GTM-進階-網頁載入時間.webp max-800 %}

[文章內容主要來源 Performance Timing tracking with Google Analytics 4-DAVID VALLEJO](https://www.thyngster.com/performance-timing-tracking-with-google-analytics-4#extra-how-sitespeedsample-works)

DAVID VALLEJO 也是我最常用用來檢查 GA4/GTM 的擴充功能作者
未來一定會有一篇文章在好好介紹這個工具

[Chrome 擴充工具 : GTM/GA Debugger](https://chrome.google.com/webstore/detail/gtmga-debugger/ilnpmccnfdjdjjikgkefkcegefikecdc)

{% darrellImage800 extension_gtm_ga_debugger extension_gtm_ga_debugger.png max-800 %}

---

## 利用 window.performance 來取得載入時間

1. 首先建立一個 Tag, 並選擇 CustomHtml
並可先思考一下網站流量大小，來修改 siteSpeedSampleRate 的數值
建議如果月流量超過 10 萬以上 page views 或 sessions 
就可能先設定個 5~10 來小量追蹤 5% - 10% 的用戶
確保沒有造成大量影響 

```JavaScript
(function() {

    // <建議調整>這裡設定 1~100 來決定多少 % 的流量需要追蹤載入時間，因為追蹤該時間勢必也會影響一點效能，擔心的話可以先從小部分流量測試
    var siteSpeedSampleRate = 100;
    var gaCookiename = '_ga';
    // <不建議調整>如果一開始 GTM 有指名要使用其他的 DataLayer 名稱才需要改
    var dataLayerName = 'dataLayer';

    var shouldItBeTracked = function(siteSpeedSampleRate) {
        if (!siteSpeedSampleRate)
            siteSpeedSampleRate = 1;
        var hashId = function(a) {
            var b = 1, c;
            if (a)
                for (b = 0,
                c = a.length - 1; 0 <= c; c--) {
                    var d = a.charCodeAt(c);
                    b = (b << 6 & 268435455) + d + (d << 14);
                    d = b & 266338304;
                    b = 0 != d ? b ^ d >> 21 : b
                }
            return b
        }
        var clientId = ('; ' + document.cookie).split('; '+gaCookiename+'=').pop().split(';').shift().split(/GA1\.[0-9]\./)[1];
        if(!clientId) return !1;
        var b = Math.min(siteSpeedSampleRate, 100);        
        return hashId(clientId) % 100 >= b ? !1 : !0
    }

    if (shouldItBeTracked(siteSpeedSampleRate)) {
        var pt = window.performance || window.webkitPerformance;
        pt = pt && pt.timing;
        if (!pt)
            return;
        if (pt.navigationStart === 0 || pt.loadEventStart === 0)
            return;
        var timingData = {
            "page_load_time": pt.loadEventStart - pt.navigationStart,
            "page_download_time": pt.responseEnd - pt.responseStart,
            "dns_time": pt.domainLookupEnd - pt.domainLookupStart,
            "redirect_response_time": pt.fetchStart - pt.navigationStart,
            "server_response_time": pt.responseStart - pt.requestStart,
            "tcp_connect_time": pt.connectEnd - pt.connectStart,
            "dom_interactive_time": pt.domInteractive - pt.navigationStart,
            "content_load_time": pt.domContentLoadedEventStart - pt.navigationStart
        };
        if (Object.values(timingData).filter(function(e) {
            if (e < 0)
                return e;
        }).length > 0)
            return;
        window[dataLayerName] && window[dataLayerName].push({
            "event": "performance_timing",
            "timing": timingData
        })
    }
}
)() 
```

已在註解上加上一點中文解釋可以設定的部分

其中有個 function 是 **shouldItBeTracked()**
當你設定 `siteSpeedSampleRate` 為 1~99 時其實這段才算是有發揮作用
他會利用 GA Client ID 做一些運算後判斷這個使用者要不要被追蹤網頁載入時間

這邊比較重要是他使用到 Cliend ID 來判斷的話就代表這個使用者(瀏覽器裝置)會中的話就是會中
不會因為他重新整理一百次後然後算中間的機率來判斷

另外 timingData 這個物件裡面就是包含了很多個時間的參數，總共有八個維度
解釋一些比較重要的時間

> **page_load_time** : 網頁載入時間，會接近 window load 的時機點
> **content_load_time** : Dom Ready 的時機點
> **server_response_time** : Server 回應的時間，如果伺服器放在比較遙遠的地方這個時間點就會比較高

下圖為這個網站實際測試到的時間
{% darrellImage800 網站實測載入時間在DataLayer中 time_datalayer_event.png max-800 %}

如果想要快速試試看的話，可以將下面的 Code 貼到 Chrome Devtool 中看一下 console 出來的狀況

``` JavaScript
var pt = window.performance || window.webkitPerformance;
pt = pt && pt.timing;

var timingData = {
    "page_load_time": pt.loadEventStart - pt.navigationStart,
    "page_download_time": pt.responseEnd - pt.responseStart,
    "dns_time": pt.domainLookupEnd - pt.domainLookupStart,
    "redirect_response_time": pt.fetchStart - pt.navigationStart,
    "server_response_time": pt.responseStart - pt.requestStart,
    "tcp_connect_time": pt.connectEnd - pt.connectStart,
    "dom_interactive_time": pt.domInteractive - pt.navigationStart,
    "content_load_time": pt.domContentLoadedEventStart - pt.navigationStart
};

console.log(JSON.stringify(timingData, null, 2))
```

## Google Tag Manager 設定相關的 DataLayer 和 GA4 Event

有了 DataLayer 後事情一切就變得很簡單了

1. 建立一個 自訂事件的觸發條件(Custom Event Trigger) : `performance_timing`

2. 建立一些 資料層參數 (DataLayer Variable) : 
 - page_load_time
 - page_download_time
 - dns_time
 - redirect_response_time
 - server_response_time
 - tcp_connect_time
 - dom_interactive_time
 - content_load_time
 

最多就這八個，不過我自己是只取 page_load_time, content_load_time
主要衡量網頁的 DomReady 時間和 window load 時間
比較能夠知道手機版的用戶如果在 4G 環境下是不是會有比較慢的狀況，或是慢多少

注意 : 這邊並沒有辦法區分使用者的網路環境是 Wifi 還是行動網路
只能先假設行動版的用戶速度會比桌機版用戶慢一些

## GA4 的自訂定義 -> 自訂指標

這邊因為送進去的是數字時間
所以建立相對應的**自訂指標** 未來就可以在報表上觀察

> 管理 > 自訂定義 > 新增自訂指標

{% darrellImage800 GA4在自訂指標中新增 add_custom_metric_in_google_analytics_4.png max-800 %}

**注意，免費版 GA4 帳戶中這邊只能設定 50 個自訂維度，請謹慎使用**

## 補充

[如何設定 自訂事件的觸發條件](https://www.darrelltw.com/gtm-trigger-custom-event/)

**如何設定 資料層參數**

{% darrellImage800 Google_Tag_Manager_如何設定資料曾變數 how_to_create_datalayer_variable.png max-800 %}


