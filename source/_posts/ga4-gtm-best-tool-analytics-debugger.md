---
title: GA4 GTM 最推薦的套件工具 Analytics Debugger
date: 2023-05-01 21:36:19
tags:
  - Google Analytics 4
  - Google Tag Manager
  - Tool
categories:
  - Martech
description: 對於一個每天都要接觸 GTM 和 GA4 等等追蹤的分析師或是工程師來說，一些好的工具絕對能最大化節省作業的時間，最近看到一個幾乎每天都要用的工具有一個重大改版，更加確定了想要推薦它! Analytics Debugger 是一個檢查 GTM DataLayer 和 GA4 觸發的好工具，能夠節省大量時間去確認 Devtool 的 Request。更神奇的是，它也開始支援了像是 Matomo, Amplitude, Tealium IQ, Adobe Analytics 這些網站追蹤都是常用的分析平台。
---

這工具好用到很久以前我就透過 Buy Me A Coffee 贊助作者了
帶著最大的敬佩並奉獻一些微小的 support

{% darrellImageCover analytics_debugger_bg analytics_debugger_bg.png max-800 %}

# 安裝 Analytics Debugger 從 Chrome Extension

{% darrellImage800 chrome_extension_analytics_debugger chrome_extension_analytics_debugger.png max-800 %}

如同其他的 Chrome 擴充功能一樣

[點擊這裡](https://chrome.google.com/webstore/detail/analytics-debugger/ilnpmccnfdjdjjikgkefkcegefikecdc) 直接安裝就好

接著在想要檢查 GTM/GA 的網站點擊右鍵，選擇**檢查**打開 Devtool 即可
或是學習怎麼使用快捷鍵打開
- windows : Shift + CTRL + J
- macOS : Option + ⌘ + J

{% darrellImage800 open_chrome_devtool open_chrome_devtool.png max-800 %}

在 Devtool 有找到一個 tab 叫做 **Analytics Debugger** 就表示安裝成功了!

{% darrellImage800 check_analytics_debugger_in_devtool check_analytics_debugger_in_devtool.png max-800 %}

# 使用和歡迎頁面

{% darrellImage800 analytics_debugger_welcome_page analytics_debugger_welcome_page.png max-800 %}

打開時會看到一個這樣的歡迎頁面，每當你開始檢查一個新的網站，或是原本的分頁關掉時
在打開 Analytics Debugger 都會重新出現一個歡迎頁面

推測是設計按下 `Start Debugging` 時才開始運作，這樣會節省較多的 Chrome 效能
也能在使用者真的要檢查時才運作，避免浪費在背後執行

**按下 Start Debugging 會重新整理頁面**
這點必須要牢記在心，部分場景在檢查時如果記錯順序就會很麻煩

> 情境: 今天要檢查一筆電商的購買事件，偏偏沒有測試網站而且取消訂單非常麻煩
> 如果使用者先測試了訂單，並且到達訂單完成頁時才開啟 Analytics Debugger
> => 網頁重整
> 訂單完成頁就會消失
> => 檢查失敗，必須再重新下一筆訂單

所以檢查步驟前就要先啟動 Analytics Debugger

# Analytics Debugger 介面的介紹

## DataLayer

{% darrellImage800 analytics_debugger_vs_google_tag_manager_preview analytics_debugger_vs_google_tag_manager_preview.png max-800 %}

簡單用顏色介紹 Analytics Debugger 和 GTM 內建的 Preivew 比對
可以發現套件已經把所有需要的資訊都擷取出來了

1. 紅色區域: 每個 DataLayer event 和出現的順序
2. 藍色區域: 單一 DataLayer event 的內容
3. 綠色區域: DataLayer 物件的聚合和每個參數當下的值

但可能你會好奇，如果這兩者工具差不多，為何要多安裝一個擴充功能。

+ 檢查自己的網站時，少了開 Preview 的步驟。在代理商或是企業集團等等需要管理多組 GTM 時，光找到那組 GTM 和開啟 Preview 就要花費不少時間了
+ 有時看到別的網站覺得有不錯的功能時，或是想觀察別人怎麼做追蹤時，用這個工具就可以看到 DataLayer 的佈署情況，因為我們不會有那個網站的 GTM Preview 權限

而且還能一起檢查等等提到的 GA4, UA

## Google Analytics 4

{% darrellImage800 analytics_debugger_check_ga4_ua analytics_debugger_check_ga4_ua.png max-800 %}

檢查 GA4 的部分如畫面，主要分成兩大區塊
1. 紅色區域: 目前網站觸發的 GA4 事件 (因所有追蹤在GA4都是事件)
2. 綠色區域: 左邊選擇某個事件時，右邊這裡會呈現完整的事件資訊

Overview 這裡可以查看 Client ID, Session ID, Measurement ID(串流 ID), 是否為轉換事件等等

**Event Parameter 可以查看這個事件包含的所有事件參數資訊**

User Properties 可以查看使用者相關資訊是否有更新

**Ecommerce Data 可以查看如果這個事件是電商事件(查看商品、加入購物車、購買)，會有商品資訊和訂單資訊等等**

Shared Parameters 可以查看每個事件的一些公用資訊，例如瀏覽器資訊等等

{% darrellImage800 analytics_debugger_check_ga4_ecommerce analytics_debugger_check_ga4_ecommerce.png max-800 %}

這裡提供一個 Google Store 加入購物車事件的範例
可以看到觸發 GA4 的 add_to_cart 事件
很妙的是 Google 這裡只有使用必要的參數 item_id, item_name

UA aka GA3 的原理其實和 GA4 一樣，並且後面應該就也用不到了..
目前已知時程 UA 在 2023/07 後便會停止追蹤功能
但在 2024/07 前都可以下載資料喔

## 其他的追蹤工具: Adobe, Amplitute, Matomo, TealiumIQ

最近更新的 Analytics Debugger V2.3.1 中其實還支援了很多追蹤工具平台
沒聽過的人就把這些當作 : GA4 的同業即可，大部分都是需要付費的，
Matomo 算是必須自己維護伺服器來做追蹤，某種程度上也是需要一筆支出

開啟方式: 右上角的齒輪點擊

{% darrellImage800 analytics_debugger_setting analytics_debugger_setting.png max-800 %}

選擇 Vendor 後便能看到目前支援的工具和平台

把需要的拖曳到右邊 -> 按下 Apply 後重整便完成

{% darrellImage800 analytics_debugger_apply_other_vendor analytics_debugger_apply_other_vendor.png max-800 %}

# 目前已知的限制

像是目前支援的 Amplitute 中，我的網站使有使用 Amplitute 的免費版
但因為我目前是使用 Segment CDP(免費版) 來做轉發
所以工具是偵測不到的

這本來就是 Chrome 擴充功能的硬限制，只是想提醒一些有使用類似 Segment CDP 工具的使用者
為何會不像上面說的可以輕鬆檢查

使用 Segment 很方便沒錯，多種平台和工具都只要佈署一次 Segment 的 tracking code 即可
不過就也是把這些追蹤的能力外包給了 Segment，自己能控制的地方就有限，檢查也必須回到 Segment 的 source 和 destination 逐一排查

# 未來預期的更新

目前在作者釋出的消息中
未來將會加入 Google Ads, Facebook Pixel 等等廣告平台的支援
並且增加一些方便的工具，例如阻擋連結的點擊，讓你檢查點擊是否有被正確追蹤，又不會馬上被轉導到其他網頁

期待未來新版本的發布，持續的更新在這邊