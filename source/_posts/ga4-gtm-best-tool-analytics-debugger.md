---
title: Analytics Debugger 教學，GA4、GTM 和 Pixel 一次檢查
tags:
  - Google Analytics 4
  - Google Tag Manager
  - Tools
categories:
  - Martech
page_type: post
id: ga4-gtm-best-tool-analytics-debugger
description: Analytics Debugger 是我幾乎每天都會開的 Chrome 擴充功能，檢查 GTM DataLayer、GA4 或 Marketing Pixels 時，不用一直翻 Network Request
bgImage: analytics_debugger_bg.png
date: 2023-05-01 21:36:19
updated: 2026-08-30 17:51:36
---

這工具好用到很久以前我就透過 Buy Me A Coffee 贊助作者了
帶著最大的敬佩並奉獻一些微小的 support

{% darrellImageCover analytics_debugger_bg analytics_debugger_bg.png max-800 %}

## Analytics Debugger 是哪一個

我每天都會碰 GTM 和 GA4
這篇介紹的是 Thyngster 的 Analytics Debugger Chrome 擴充功能
它不是 Google 官方的 Google Analytics Debugger

Chrome Web Store 目前仍是 v2.4.6，最後更新日期是 2023-09-20

{% callout info %}
部分操作截圖拍攝於 v2.3.1/v2.3.2，介面文字可能和 v2.4.6 不太一樣
{% endcallout %}

## 安裝後先按 Start Debugging

{% darrellImage800Alt "Chrome Web Store 上的 Analytics Debugger 擴充功能頁面" chrome_extension_analytics_debugger.png max-800 %}

到 [Chrome Web Store](https://chromewebstore.google.com/detail/analytics-debugger/ilnpmccnfdjdjjikgkefkcegefikecdc) 安裝 Analytics Debugger

接著到想檢查 GTM 或 GA4 的網站
按右鍵選擇 **檢查** 打開 DevTools

Windows 可以按 `Shift + Ctrl + J`
macOS 可以按 `Option + ⌘ + J`

{% darrellImage800Alt "Chrome DevTools 中的 Analytics Debugger 分頁" check_analytics_debugger_in_devtool.png max-800 %}

在 DevTools 找到 **Analytics Debugger** 分頁
就表示擴充功能已經安裝成功

{% darrellImage800Alt "Analytics Debugger 歡迎頁面上的 Start Debugging 按鈕" analytics_debugger_welcome_page.png max-800 %}

第一次打開會看到歡迎頁面
在新的網站或原本的分頁關掉後重新打開，也會再看到一次

按下 `Start Debugging` 後會重新整理頁面
也從這次載入開始收集資料

所以要在操作前先啟動

例如要檢查電商購買事件
如果完成訂單後才開啟 Analytics Debugger
訂單完成頁就會消失
這筆事件也要重新走一次

## 為什麼不直接用 GTM Preview

Analytics Debugger 把 DataLayer 和 GA4 都放在同一個 DevTools 分頁

在代理商或企業集團需要管理多組 GTM 時
光找到正確那組 GTM 和開啟 Preview 就要花不少時間

想觀察別人的網站時
也不需要那個網站的 GTM Preview 權限
直接打開 DevTools 就能先看頁面實際送出的 DataLayer

### DataLayer 和 GA4 放在一起看

{% darrellImage800Alt "Analytics Debugger 整理 DataLayer 事件與參數的畫面" analytics_debugger_vs_google_tag_manager_preview.png max-800 %}

DataLayer 的事件、參數和聚合後的值會整理在同一個畫面
不用先找到對應的 GTM Container 再開 Preview

{% darrellImage800Alt "Analytics Debugger 顯示 GA4 事件檢查畫面" analytics_debugger_check_ga4_ua.png max-800 %}

GA4 的追蹤都會以事件呈現
可以從事件確認 Measurement ID、事件參數和使用者層級資料

Analytics Debugger 也會提示 GA4 recommended event 應該搭配的參數
如果事件內容疑似含有 PII，也會在介面上提醒

{% darrellImage800Alt "Analytics Debugger 顯示 Google Store add_to_cart 的 Ecommerce 與 Items 資料" analytics_debugger_check_ga4_ecommerce.png max-800 %}

Google Store 的 `add_to_cart` 事件可以看到商品資料放在 Items 裡
這張畫面實際看到的商品資料只有必要的 `item_id`、`item_name`

UA 也叫做 GA3，現在只留歷史背景
標準 Universal Analytics 已在 2023-07-01 停止處理新資料
2024-07-01 之後也不再提供使用

## Marketing Pixels 和其他 Vendors

右上角的齒輪可以調整要檢查的 vendors

{% darrellImage800Alt "Analytics Debugger 的 vendors 設定畫面" analytics_debugger_setting.png max-800 %}

舊截圖拍攝時最多可選 4 個 vendors
v2.4.6 已提高為最多 6 個 vendors

把想檢查的項目拖曳到右側後按下 Apply
Analytics Debugger 分頁會重新載入設定

{% darrellImage800Alt "Analytics Debugger v2.4.6 的支援 vendors 列表" analytics_debugger_2_4_6_support_vendors.png max-800 %}

除了 GTM/GTAG、GA4 和 GA3
也能選 Matomo、Chartbeat、Piwik PRO、Amplitude、Tealium 或 Adobe Analytics

另外新增 Chartbeat，也修正 Amplitude 區域端點的支援

Marketing Pixels 預設不會開啟
要先到設定裡打開這個選項

{% darrellImage800Alt "Analytics Debugger 設定 Marketing Pixels 的畫面" setting_marketing_pixel_in_analytics_debugger.png max-800 %}

按下 Apply Changes 後
Analytics Debugger 分頁會載入新設定
要從頭收集事件時，再手動重新整理要檢查的網頁

目前支援五個 Marketing Pixels 平台
Google Ads、Facebook Pixel、TikTok Pixel、Twitter 和 Bing UET

{% darrellImage800Alt "Analytics Debugger 顯示 PChome Marketing Pixel 商品事件資料的畫面" check_marketing_pixel_in_analytics_debugger.png max-800 %}

以 PChome 為例
商品資訊也有顯示出來

網站裝了多種 Pixels 時
可以用篩選功能縮小範圍

{% darrellImage800Alt "Analytics Debugger 篩選 Marketing Pixel 帳戶與平台的畫面" filter_marketing_pixel_in_analytics_debugger.png max-800 %}

## Clicks Blocker 和 Command Palette

要檢查連結點擊時
最麻煩的就是一點下去分頁立刻轉到別的網站

Clicks Blocker 啟用後會攔截目前頁面的點擊
連結和按鈕可能沒有反應
這樣就能留在原頁檢查點擊追蹤有沒有成功

{% darrellImage800Alt "Analytics Debugger 顯示 Clicks Blocker 已啟用的畫面" enable_click_blocker_analytics_debugger.png max-800 %}

工具裡的命令面板叫做 Command Palette
快捷鍵是 `Ctrl + Shift + K`
Mac 也一樣使用 Ctrl，不是 Command

{% darrellImage800Alt "Analytics Debugger 的 Command Palette 命令面板" command_plate_in_analytics_debugger.png max-800 %}

v2.4.6 在 Command Palette 裡選擇 `Enable Clicks Blocker` 就能啟用 Clicks Blocker
`Clear Report` 可以清掉累積的檢查結果

檢查完記得關掉
不然之後點連結或按鈕沒有反應
可能會跑去問工程師是不是 Bug

## 使用上的限制

我當時的網站使用 Segment CDP 免費版把 Amplitude 事件轉發出去
Analytics Debugger 在這個情境下看不到原始的 Amplitude 呼叫
所以 Amplitude 區塊不會像直接放在頁面上的追蹤碼一樣出現

這是我當時的 Segment 設定情境
不代表所有 CDP 都一定偵測不到

遇到類似狀況時
要回頭檢查 CDP 的 source、destination 和最後實際送出的 request

我自己一直期待可以把多平台集中在一個地方檢查
不然每個平台都要另外裝工具，或是回到 Network Request 一筆一筆看

## 官方資料

- [Chrome Web Store](https://chromewebstore.google.com/detail/analytics-debugger/ilnpmccnfdjdjjikgkefkcegefikecdc)
- [Analytics Debugger 官方產品頁](https://www.analytics-debugger.com/en/tools/analytics-debugger-extension/)
- [Analytics Debugger 官方 changelog](https://github.com/analytics-debugger/analytics-debugger-browser-extension)
- [Google Universal Analytics 說明](https://developers.google.com/analytics/legacy/universal-analytics)
- [Google Analytics 4 troubleshooting](https://developers.google.com/analytics/devguides/collection/ga4/troubleshoot)
