---
title: Busy Tag 開箱，忙碌中勿擾
tags:
  - Busy Tag
categories:
  - Unboxing
page_type: post
id: unboxing-busytag
description: Busy Tag 是一款帶有高解析度螢幕與內建忙碌指示燈的智慧裝置，用來向同事或家人清楚地顯示您的狀態，避免不必要的干擾，還可自訂顯示 GIF、圖片或文字，與各種應用程式整合。
bgImage: busytag_bg.jpg
preload:
  - busytag_bg.jpg
date: 2025-03-12 15:30:00
---
{% darrellImageCover busytag_bg busytag_bg.jpg max-800 %}

## 什麼是 Busy Tag？

<iframe width="560" height="315" src="https://www.youtube.com/embed/hi4tONh_FBo?si=aTe4Hl_6LRLclhwT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

基本上就是一塊讓你放在電腦附近的小螢幕
可以顯示:
1. 你的忙碌狀態，是否有空
2. 你的心情，用 GIF 呈現
3. 也可以進階開發串 webhook 或寫程式，達成通知的功能

這次有幸能開到團購，跟十幾名網友一起買了 Busy Tag 來嘗試
沒特價的話大概落在 7x 美金，加上運費關稅等自行購買大約 2500 台幣左右
[Busy Tag 官網](https://www.busy-tag.com/)

## 使用說明

1. 準備一條 USB-C 線，連接 Busy Tag 和電腦
2. 下載 Busy 的軟體，有兩種可以選擇，另外兩種不能同時使用

### BusyTag Software

這適合給一般使用者
單純換圖片，換LED顏色
也可以圖片 + 文字呈現

{% darrellImage busytag-software busytag-software.png max-400 %}

### LUXAFOR PARTNER SOFTWARE

這款給一些特殊需求的使用者
例如想要有 **Webhook** **Zapier** **IFTTT** 等串接的需求

例如當 xxx 發生，就在 Busy Tag 做一種提示

{% darrellImage busytag_luxafor busytag-LUXAFOR_software.png max-400 %}

## 使用 BusyTag Software

### 官方文件

這裡是[官方文件的下載點 PDF](https://www.busy-tag.com/_files/ugd/9b04eb_7bdd6ff0aabe4ab9816f4b7db133f3c9.pdf)

{% darrellImage busytag_manual busytag_manual.png max-400 %}

蠻詳細的說明書，使用前可以先參考

以下為 AI 幫忙整理的說明書重點：

產品規格：尺寸(36×46×8mm)、重量(20g)、螢幕解析度(240×280像素)、功耗等資訊
開始使用：安裝磁鐵底座、連接設備、下載軟體的步驟
軟體選項：可以使用 Busy Tag 自家軟體或 Luxafor 合作夥伴軟體
自訂顯示內容：如何上傳和顯示自訂圖像和GIF(需符合240×280解析度且小於1MB)
功能特色：狀態指示、計時器、專注模式(番茄鐘)、LED燈光效果、自訂文字等
整合應用：與Microsoft Teams、電子郵件、Zapier、IFTTT等服務整合
系統要求：兼容Windows 10以上和macOS 10.14以上系統
故障排除：技術支援聯繫方式

### Design

{% darrellImage busytag_design busytag_design.png max-800 %}

Design 頁面可以看到已經有部分的設計可以使用
想要新增也很簡單，按下 Create New 後就能新增一個自己的設計

{% darrellImage busytag_design_1 busytag_design_1.png max-800 %}

這裡是新增 Design 的介面
可以使用單色背景或是圖片,GIF

GIF 建議要用 240x280 的尺寸，也可以直接用官方提供的工具網站來調整
[Busytag_Make GIF](https://ezgif.com/busytag)

{% darrellImage busytag_make_gif_website busytag_make_gif_website.png max-800 %}

透過這個流程就能建立好符合 Busy Tag 規範的 GIF 圖片

{% darrellImage busytag_design_2 busytag_design_2.png max-400 %}

LED 的設定就相對單純，可以選擇顏色

### Online Gallery

{% darrellImage busytag_online_gallary_1 busytag_online_gallary_1.png max-800 %}

這裡可以快速套用一些熱門的 GIF，比較像是找靈感

因為這邊的 GIF 好像也不能直接變成一個 Design 來儲存

### LED 燈光效果

{% darrellImage busytag_led busytag_led.png max-400 %}

這裡可以選擇 LED 燈光效果，也可以自己調整顏色
像是呼吸燈,閃爍,漸層,單色,警示紅藍閃爍等等

## 遇到的問題

目前使用上偶爾會有些問題

### GIF 上傳後沒反應
通常要先確認是不是有按照上面的 GIF 網站來調整過尺寸
大小也不能超過 1MB
檔案名稱也要注意，盡量保持純英文，也不要用特殊符號像是 `~!@#$%^&*()_+` 這些

### Disconnect
久久會遇到一次，使用 BusyTag 軟體時，他會顯示斷線
通常重新插拔 USB 就能解決

## 問題排查

建議大家如果有遇到問題，或是其他使用上的問題
都可以發信給官方的 Email
[Busy Tag Email](mailto:hello@busy-tag.com)

或是到官網查詢相關問題
[官網](https://www.busy-tag.com/)

## 結語

有興趣或是已經拿到手的大家，接下來就是讓你們發揮創意的時候了!
一些特殊的用法好像都需要寫程式

這邊有官方的 python 教學
[Github BusyTag](https://github.com/busy-tag)

這部分我還在摸索嘗試中，如果有成功會再來分享心得!