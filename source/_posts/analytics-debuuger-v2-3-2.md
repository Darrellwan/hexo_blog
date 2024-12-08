---
title: Analytics Debugger v2.3.2 更新 支援 Google Ad, Facebook Pixel 且能暫停點擊連結的跳轉
date: 2023-05-06 23:45:42
tags:
  - Google Analytics 4
  - Google Tag Manager
  - Tools
categories:
  - Martech  
description: 很重要的一個版本更新! 現在開始支援了對於 Marketing Pixel 的支援，Google Ad 和 Facebook Pixel，請記得在更新後到設定中打開這個選項，本篇文章也會介紹一些其他的更新內容
---

{% darrellImageCover analytics_debugger_bg_v2_3_2 analytics_debugger_bg_v2_3_2.png max-800 %}

[先前一篇文章已經有提到安裝和基本的教學](https://www.darrelltw.com/ga4-gtm-best-tool-analytics-debugger/?from=analytics-debuuger-v2-3-2)

## Analytics Debugger V2.3.2 更新內容

這裡直接列出一些這個版本比較重要的更新
1. 支援 Marketing Pixels: 
  - Google Ad
  - Facebook Pixel
  - Tiktok Pixel
  - Twitter
  - Bing UET

2. 新功能: Clicks Blocker

3. 支援快捷鍵啟用命令列
 
## 新功能: Marketing Pixels 的支援

請先記得，這功能目前不是預設啟用，需要先到設定裡面去開啟

{% darrellImage800 setting_marketing_pixel_in_analytics_debugger setting_marketing_pixel_in_analytics_debugger.png max-800 %}

開啟後記得下方點擊 Apply Changes，會重新整理一次 Analytics Debugger 和網頁

{% darrellImage800 check_marketing_pixel_in_analytics_debugger check_marketing_pixel_in_analytics_debugger.png max-800 %}

紅色部分是整體的資訊都正確，Pixel Helper 有檢測到的資訊 Analytics Debugger 也都有
以 Pchome 為例，商品資訊也都有顯示出來

{% darrellImage800 filter_marketing_pixel_in_analytics_debugger filter_marketing_pixel_in_analytics_debugger.png max-800 %}

如果是網站裝比較多種行銷 Pixels 的，這一塊預期可能就會很混亂
目前也有支援一些過濾的功能

也能使用最前方的 icon 來判斷是哪一種的 Marketing Pixel
並也能篩選特定的帳戶


## 新功能: Clicks Blocker

這功能對於要檢查 追蹤連結的點擊 是個非常好用的功能!

假設今天你要追蹤一個連結的點擊，但點了就會把當下的分頁轉導到別的地方
就會很難判斷自己做的追蹤有沒有成功

而 Click Blocker 只要啟動後，就能暫停所有連結轉導
也就是說你可以分心的點擊有追蹤的按鈕
它都不會將你轉導到其他網頁
(( 當然也不要忘記自己有開啟這個功能，然後去跟工程師反應說為什麼連結點了沒反應，是不是一個 Bug

  <figure lg-background-color="#282828" class="blog-images" data-src="https://darrelltwblog.s3.ap-northeast-1.amazonaws.com/ScreenShot_2023-05-06-23-02-16-AJIdh9aP.gif">
    <img alt="啟用了ClickBlocker就無法點開連結了" data-src="https://darrelltwblog.s3.ap-northeast-1.amazonaws.com/ScreenShot_2023-05-06-23-02-16-AJIdh9aP.gif" class="lazyload max-800}" sizes="(min-width: 1000px) 930px, 90vw">
  </figure>

啟用時工具上也會顯示正在使用 Click Blocker 中
{% darrellImage800 enable_click_blocker_analytics_debugger enable_click_blocker_analytics_debugger.png max-800 %}

## 新功能: 支援快捷鍵啟用命令列

不過剛剛為何沒有提到怎麼開啟 Click Blocker 的功能

因為啟用的方式需要搭配這裡介紹的命令列來啟用

只要在 Analytics Debugger 中輸入

```
Ctrl + Shift + P
```

**MacOS 也是 Ctrl !**

{% darrellImage800 command_plate_in_analytics_debugger command_plate_in_analytics_debugger.png max-800 %}

第一個 Clear Report 是會清空介面，如果使用一陣子後覺得太亂，或是莫名的有一點效能上的問題
就建議先清掉或重開 Devtool 試試看

第四個 Click Debugger 就是可以開啟剛剛上面講的新功能了

## 結語

這次的新功能對於常常使用 GTM 和埋追蹤碼的人都是很大的幫助
自己本身就一直期待有工具可以統一在一個地方上檢查多種平台，否則都要去安裝該平台的工具
或是直接使用 Network Request 一個一個檢查

上面講到的 Vendors 相信在未來的版本中都會持續更新
Command Plate 說不定未來也會有更酷的新功能出現



