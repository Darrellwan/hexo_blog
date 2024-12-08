---
title: Chatgpt 幫你寫程式 - 實現一個類似 wappalyzer 的分析功能
tags:
  - Chatgpt
  - Martech
  - Tools
categories:
  - Martech
page_type: post
date: 2023-02-15 22:15:43
description: 最近接收到一個需求，想要實現類似 wappalyzer 這樣可以分析出網站上安裝了哪些工具的功能。其實大概知道一個架構和寫法，只是自己從頭慢慢寫到完成也是要花一大段時間，不如用來測試 Chatgpt 到底能怎麼幫忙
---

{% darrellImageCover 請chatgpt幫忙coding bg_chatgpt_hello_world.png max-800 %}

## wappalyzer 的功能

{% darrellImage800 wappalyzer_screenshot wappalyzer_screenshot.png max-800 %}

[套件安裝的網址](https://chrome.google.com/webstore/detail/wappalyzer-technology-pro/gppongmhjkpfnbhagpmjfkannfbllamg?hl=zh-TW)

這個套件可能有不少人知道也安裝了，就是一個可以偵測說一個網站基本上用了哪些明顯的技術
並且安裝了哪些第三方的工具! 
雖然你可能看不出來對方真實的使用情況(也有可能只是忘了移除)
但至少可以一虧其樣貌

厲害是的他有不錯的分類
就算是安裝了你不知道的工具，也能大概知道和哪些工具類似

當你改天看到一個網站有一個厲害的彈窗 popup，或是什麼很酷炫的功能時
或許都能從這工具找到靈感 (如果那功能是來自一個第三方工具)

## wappalyzer 運作的可能邏輯

wappalyzer 作為一個瀏覽器的擴充工具，卻可以掃描到那麼多資訊
其實也代表這類資訊大部分是暴露在網站的 Html 上面的。

反向來思考
當我們安裝了例如 Google Analytics 4, Mixpanel, Amplitute, Algolia 等等工具
其實很明顯的都會有一個 `<script src="xxx">`
從這線索中幾乎就能找到大部分的第三方工具了

## chatGPT 在 coding 的應用

目前對於 Chatgpt 的使用都比較像是
我今天想要做到一件事情
- 如果我知道怎麼做，但我可能會好奇 chatgpt 能不能提供一個新的方向
- 如果我不知道該怎麼做，可能還是要得先自己做一些調查，或是和 chatgpt 詢問一個大方向，並先加以理解

原因在我相信直接和 Chatgpt 要解答，他或許能生成一個，但我們可能就因此偷懶不去完全理解，或是無條件的相信他的答案
對我自己來說都還是有疑慮和風險的，所以我希望他就是能給我一些新觀點，或是處理掉一些瑣碎的雜事，但也不能因此讓我變得太懶惰

--- 

回到實踐這個功能的實作，我希望當大家請 chatgpt 幫你寫程式時
自己腦中大概要有個方向，或是有把握要能讀懂 chatgpt 寫出來的程式碼 (目前看起來他都寫得算好懂)

下列是一些我的提問方向，並不會完整紀錄這隻程式碼生成的詳細對談

1. 最一開始的提問
```
Please provide the JS code to scrape website's 3rd party tracking js library
```

回答
```javascript
async function scrapeTrackingLibraries() {
  const trackingLibraries = [];
  const scriptTags = Array.from(document.getElementsByTagName('script'));

  for (const scriptTag of scriptTags) {
    if (!scriptTag.src) {
      continue;
    }

    const scriptTagHost = new URL(scriptTag.src).host;

    if (!scriptTagHost.endsWith('3rdpartytracker.com')) {
      continue;
    }

    trackingLibraries.push(scriptTagHost);
  }

  return trackingLibraries;
}
```
這個答案有對的部分也有錯的部分
整體方向是對的，他去讀 document 並且取回所有的 script tag。
並一一解析裡面的 src
只是 12~14 這邊就錯了，他誤會了 3rdpartytracker 是一個特定的 domain。

此時看到他寫錯其實不用慌，請勇敢地挑戰它
**直接指明他哪裡錯誤，他就會立刻產生一個修正的版本給你**

後面有略過了一些部分就是我原本想要在 google app scirpt 上面做
但 `UrlFetchApp.fetch` 在這個需求上不能滿足

我希望我掃瞄 script src 的時候是網頁到 完全載入的時候
而 Google App Script 的 fetch 基本上就是幾乎到 dom ready 就回傳 html 了
[對於網頁載入時間點有興趣的話，另一篇文章有提到這個概念](https://www.darrelltw.com/gtm-trigger-pageview-domready-windowload/)

{% darrellImage800 chartgpt_coding_ask_fetch_in_gas chartgpt_coding_ask_fetch_in_gas.png max-800 %}

我直接請 chatgpt 給我一些其他有別於 Google App Script 的方式，它提到了 `Puppeteer`
以前有用過的印象，大概知道他是用來調用瀏覽器相關的功能
於是就請它給個範例:

{% darrellImage800 chatgpt_coding_puppeteer_demo chatgpt_coding_puppeteer_demo.png max-800 %}

但這份 code 讀完後還是有蠻多地方要改進的
後續有請它調整了下面幾項
- 使用 headless, 並且 array 的網址要排除重複
- 只需要 src 裡面中的 hostname, 不需要整行網址
- 它預想所有的網址都是完整的 https:// 開頭，但有部分不是，請它加上這段的判斷
- 我想要等瀏覽器載入的完整一點，所以想要開啟後五秒再關閉瀏覽器，以取得更完整的 script src
- 它提供的程式碼也是會報錯的，不確定是不是跟他的資料停在 2021 有關，有些 function 會報 `is not a function` ，這時可以自己找，也可以請它試著修修看

到這邊其實整份程式碼就完成的差不多了，整體花掉的時間大約一兩小時
詳細的程式碼已在 [Github 上 : scrapeTrackingLibraries.js ](https://github.com/Darrellwan/martech_tools/blob/main/scrapeTrackingLibraries.js)

**注意: 如要試跑該程式，請記得這算是某種程度上的爬蟲，請不要對單一網站在短時間內大量執行，擁有一顆善良的心**

---

## 總結

chatgpt 在 coding 的幫忙整體來說有很大的優點

一般像是上述的情形有時候 Google 和 StackOverflow 必須花費好幾倍的時間來尋找
因為不一定世界上有很多人跟我們有一樣的需求，同一隻程式碼可能得拆解很多部分，並且每個部分獨立去查資料後再拚湊在一起
chatgpt 就可以大量節省這方面的時間，並快速給出一個 prototype

使用的過程中也會發現，提問變成一個很重要的技能，**懂的問問題並且問好問題一直都不是一件太容易的事情**
這次的體驗得到的是，盡量把問題一次問清楚，塞在同一個問題都沒關係(有點反人性，人與人之間較不會這樣提問)
但同時也很考驗，你對於想做出來的那個東西，有多了解和可以考慮到多少細節

如果我很熟悉 Puppeteer，那我可能一開始就會請他直接使用 Puppeteer
並且我也沒有考慮到網址可能會沒有 https:// 等 protocol 的開頭

但像是後面我想單獨爬 Google Analytics 4 的 request 時，我可能就預測到瀏覽器開啟時得等久一點
因為 GA4 的新機制導致 request 不是當下發生就發送，多事件時他會打包一成一個 request

如果可以，多嘗試應用 chatgpt，也多少培養自己使用這類型 AI 的輔助技能
未來有更多更厲害的模型出現時，就比較能駕輕就熟的去體驗

