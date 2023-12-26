---
title: Google Chrome 第三方 Cookie 在 2024 年的計畫與終結
tags:
  - 3rd party cookie
  - browser
categories:
  - Martech
page_type: post
id: 2024_3rd_party_cookie_in_google_chrome
description: 2024年起，Google將逐步淘汰第三方Cookie，並開始推出更注重使用者隱私的 Privacy Sandbox，和整體目前的時間軸
date: 2023-12-15 16:50:19
bgImage: google_chrome_3rd_party_cookie_bg.png
---

{% darrellImageCover google_chrome_3rd_party_cookie_bg google_chrome_3rd_party_cookie_bg.png max-800 %}

## 時程

先前參與 2023 年的數位時代 Martech 高峰會時有講者多次提到第三方 Cookie 將於 2024 年消失，的確 Google 目前的計畫看起來將在 2024 的 Q4 全面啟用新的三方 Cookie 機制。
目前尚未有延後的消息，相信這會取決於 Q1 到 Q3 的測試中是否順利

{% darrellImage800 google_chrome_3rd_party_cookie_timeline_2024 google_chrome_3rd_party_cookie_timeline_2024.png max-800 %}

## 1% 測試 - 2024Q1

從 2024 Q1 開始
將會有 1% 的 Chrome 瀏覽器停用 第三方 Cookie，Google 應該將會對這些瀏覽器上測試新的功能和觀察成效的歸因判定
根據相關文章提到，這1%的人會在 Chrome 收到通知並套用這項測試

{% darrellImage800 chrome_v120_3rd_party_release chrome_v120_3rd_party_release.png max-800 %}
同樣的在 Chrome 版本 120 中的更新也提到類似的資訊

現在 Devtool 開發者工具 裡面的 tab: Issue 會可以勾選顯示網站目前的三方 Cookie 狀況

{% darrellImage800 chrome_v120_issue_tab_shows_3rd_party_cookie_status chrome_v120_issue_tab_shows_3rd_party_cookie_status.png max-800 %}

上面會列出一些未來將會被影響的 Cookie，大概就是這些第三方 Cookie，和沒有正確標示 **same-site** 屬性的第一方 Cookie

## Google 提出的解決方案

整體的大專案名稱目前命名為 **Privacy Sandbox**
簡單來說就是為了 **增強網絡隱私的計劃**
因為是一個很大的議題，所以裡面包含了很多種功能和要做到的事情

{% darrellImage800 google_pricacy_sandbox_chinese_2 google_pricacy_sandbox_chinese_2.png max-800 %}

{% darrellImage800 google_pricacy_sandbox_chinese_1 google_pricacy_sandbox_chinese_1.png max-800 %}

可以看到淘汰第三方 Cookie 可以算是裡面的其中一個項目而已，並且有眾多的新功能API 來支持和取代

以行銷相關這邊就有
- Topics API
- Protected Audience API
- Attribution Reporting API

雖然說是用來取代第三方 Cookie，不過可以預期精準的程度還是一定不及以前的三方 Cookie
以 Protected Audience API 舉例，整體決定一個版位用 bid 競價的方式來呈現什麼廣告一樣本身沒有太大的改變
只是過程中需要透過這個 Protected Audience API 在瀏覽器加入一些 相關 的資訊(透過程式碼) 來得知使用者的興趣
類似 Topics API，未來更熟悉和理解相關 API 後會再盡可能詳細說明

其他的多種功能大部分就是為了隱私權而設置，大意上就是讓大家更難得知目前在瀏覽網站的人是誰(For 匿名使用者)
很仰賴工具提供的資訊，例如 Google Signal 的使用者國家、性別、年齡、興趣等等這些都是透過瀏覽器的相關資訊去推測的，
可能就會有所影響

## 測試網頁擴充工具 : Privacy Sandbox Analysis Tool 

https://chromewebstore.google.com/detail/privacy-sandbox-analysis/ehbnpceebmgpanbbfckhoefhdibijkef
[{% darrellImage800 google_chrome_extension_privacy_sandbox_tool google_chrome_extension_privacy_sandbox_tool.png max-800 %}](https://chromewebstore.google.com/detail/privacy-sandbox-analysis/ehbnpceebmgpanbbfckhoefhdibijkef)

安裝後，在網站開啟 Devtool 會多出一個 tab : Privacy sandbox

從介面上來看，應該是方便檢查上面的那些功能啟用後，目前瀏覽器所記錄到的資訊和狀況

{% darrellImage800 google_chrome_extension_privacy_sandbox_screenshot google_chrome_extension_privacy_sandbox_screenshot.png max-800 %}

## 相關文件

### [Google - 為逐步淘汰第三方 Cookie 做好準備](https://developers.google.com/privacy-sandbox/3pcd?hl=zh-tw)
-> 偏向工程師導向，主要是處理第一方 Cookie 該如何設定，如果有多個子網域和網站需要管理，並且需要透過 Cookie 來交換或存取資料，該怎麼設定
-> 可以強制開啟 淘汰第三方 Cookie 的狀態來模擬並測試故障情形，
1.稽核第三方 Cookie 使用情形。
2.測試故障情形。
3.如果是依網站儲存資料的跨網站 Cookie (例如嵌入內容)，則可以考慮使用 Partitioned 和 CHIPS。
4.若要針對一小群有意義的連結網站進行跨網站 Cookie，請考慮使用相關網站集。
5.如果是其他第三方 Cookie 用途，請改用相關的網路 API。

### [Google - Topics API](https://developers.google.com/privacy-sandbox/relevance/topics/developer-guide)
-> 該 API 的介紹，Topics API 看起來是針對瀏覽過的網頁在一定的時間後計算該瀏覽器的興趣標籤
也可以在 Chrome 的網址列貼上 `chrome://topics-internals/`
就能看到目前計算和歷史的標籤有哪些

### [Google - Protected Audience API](https://developers.google.com/privacy-sandbox/relevance/protected-audience#overview)
-> 偏向廣告業的工程師導向，解釋該 API 的運作方式。主要可能以 DSP 和 SSP 相關的大廠為主

### [Goolge - Attribution Reporting](https://developers.google.com/privacy-sandbox/relevance/attribution-reporting)
-> 偏向廣告業的工程師導向，解釋該 API 的運作方式。有提到通常不會直接使用到該 API，除非有需要想要直接串接 (一般廣告主和網站所有者皆不需要)
