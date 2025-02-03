---
title: 工具推薦-移除 GTM 中的舊版 GA設定-Tagsbuster
tags:
  - Google Tag Manager
  - Tools
categories:
  - Google Tag Manager
page_type: post
id: tool-remove-ga3-setting-in-gtm-tagsbuster
description: GA3(UA) 已經正式退場，但 Google Tag Manager 還是遺留了不少舊版 GA 的設定，推薦一個可以找出舊版 GA 設定的工具並一次輕鬆移除
bgImage: tool-remove-ga3-setting-in-gtm-tagsbuster_bg.png
preload:
  - tool-remove-ga3-setting-in-gtm-tagsbuster_bg.png
date: 2024-08-04 15:43:53
---

{% darrellImageCover tool-remove-ga3-setting-in-gtm-tagsbuster_bg tool-remove-ga3-setting-in-gtm-tagsbuster_bg.png max-800 %}

## 推薦原因

GA3(UA) 已經在 2024/07 正式退場
除了不會在搜集新的資料以外，從 GA3 的介面打開也會發現資料都已經清空

{% darrellImage800 ga3_am_i_doing_a_good_job ga3_am_i_doing_a_good_job.jpeg max-800 %}

這時也可以回頭想到 Google Tag Manager 裡面曾經虐人千百遍一大堆的 GA3 設定 (代碼、觸發條件、變數)
要是設定很少，的確可以簡單的一下移除掉
如果是大型流量的網站或是完整的追蹤架構等等
那相信 GTM 裡面會是滿滿的 GA3 設定
而且 GA4 已經推出幾年的時間來，也增加了很多 GA4 的設定
麻煩的是有些 GA3 GA4 的設定會使用一樣的觸發條件或變數

{% darrellImage800 ga3_ga4_same_trigger ga3_ga4_same_trigger.png max-800 %}

之前推薦過的 [Analytics Debugger 工具 ](https://www.darrelltw.com/ga4-gtm-best-tool-analytics-debugger/)同一作者
在近期也釋出了新的免費工具 Tagsbuster 來一鍵移除這些 GA3 設定

## Tagsbuster 工具教學

<a href="https://tagsbuster.analytics-debugger.com/"><i class="fa-solid fa-link"></i><span> Tagsbuster </span></a> 的方式是需要先匯出想要調整的 GTM JSON檔
並且分析裡面的設定關聯後來找出可以移除的設定

如何匯出 GTM 的設定檔案可以參考之前撰寫工具的教學影片

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/994685225?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="GoogleTagManager export json file"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

匯出後就可以到 
<a href="https://tagsbuster.analytics-debugger.com/"><i class="fa-solid fa-link"></i><span> Tagsbuster </span></a> 的網站選擇那個 JSON 檔案並匯入

{% darrellImage800 tagsbuster_page tagsbuster_page.png max-800 %}

{% darrellImage800 tagsbuster_howtouse_steps tagsbuster_howtouse_steps.png max-800 %}

匯入後就會看到分析的結果
並且可以選擇是否有些設定不要移除

重複確認具體要刪除的設定是否沒問題後
就可以請工具產生一個新的 GTM 設定檔案

## GTM 匯入新的設定檔案

移除 GA3 的設定後，最後的步驟就是要匯入這個新的 GTM JSON 檔案了
**這邊的步驟需要特別注意，不小心就會把 GTM 的設定完全清空**

於是也用影片的方式呈現匯入的過程
1. 匯入後回到 Workspace
2. 重新檢查刪除的這些設定是否在預期中
一定要做的其他步驟:
3. 預覽目前的變更，並走一次主要的網頁流程
4. 檢查 GA4 和其他媒體的設定是否都正常
5. 如果真的**出現問題，就不要發布設定**，並且排查問題

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/994691916?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="gtm-import-json-and-check-changes"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

