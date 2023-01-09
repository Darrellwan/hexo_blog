---
title: Google Tag Manager - 進階技巧 DataLayer Variable 資料層變數的版本1和2
tags:
  - Google Tag Manager
categories:
  - Google Tag Manager
page_type: post
date: 2023-01-09 23:39:55
description: 新增一個 資料層變數(DataLayer Variable) 時，會看到下方有一個選項「資料層版本」，預設都是版本2，其實版本2和版本1有蠻大的差異，如果能了解這兩個選項的不同，就能避免在一些特殊情況下可能會搜集到錯誤資料的可能
---

{% darrellImageCover GTM_Variable_DatalayerVersion_One_Two_BG GTM_Variable_DatalayerVersion_One_Two_BG.webp max-800 %}

## 用上餐來解釋

如果我們將 DataLayer 的推送比喻成一個晚餐的上餐順序，主菜 -> 水果 -> 飲料
並且建立一個資料層變數 餐桌

{% darrellImage800 DataLayer的上餐順序 https://www.dropbox.com/s/de5qotscxar9ud5/ScreenShot_2023-01-07-18-15-24-32vHyNxq.gif?raw=1 max-800 %}

版本一會是

{% darrellImage800 出完餐後的版本一 version_1_after_serve.webp max-800 %}

版本二會是

{% darrellImage800 出完餐後的版本二 version_2_after_serve.webp max-800 %}

以 JSON 的格式來說明的話

```JavaScript
// 版本1
{
  飲料 : 檸檬紅茶
}
```

```JavaScript
// 版本2
{
  主餐 : 早餐拚盤,
  水果 : 頻果,
  飲料 : 檸檬紅茶
}
```

簡單來說 : 版本2 會將不同的參數累加在一起

以上面的例子來用一點生活化的方式來想

如果每次只上一道菜
版本一 : 服務生每次都會先將你桌上的餐點收走，才會上新的一道餐
版本二 : 服務生就會一直放在你的桌上，宛如一個桌菜

## GTM 實際測試

回到用 GTM 來舉例

我們使用 Google Tag Manager 建立兩個資料層參數 DataLayer Variable
- 點擊資料

並且推送兩個 DataLayer 事件
第一個事件中有 文字和分類
第二個事件中有 文字和網址 (沒有分類)

```JavaScript
dataLayer.push({
    event : "點擊",
    點擊資料 : {
      點擊文字 : "1234",
      點擊分類 : "分類上方"
    }
})
dataLayer.push({
    event : "點擊",
    點擊資料 : {
      點擊文字 : "5678",
      點擊網址 : "https://www.google.com/",
    }
})
```

會看到在**版本二**的情況下
原本是 文字和分類，文字和網址
在第二個點擊事件中居然是 文字+分類+網址
因為第二個點擊事件 會**累積**到第一個事件中
所以第二個點擊事件多出來的分類，就很有可能是錯誤的資料

{% darrellImage800 在GTM資料層變數版本一的狀態 gtm_preview_datalayer_in_version2.png max-800 %}

如果切換到 **版本一**
就會變成正常的情況
第二個點擊事件時，會**覆蓋**掉原本第一個點擊事件的資料

{% darrellImage800 在GTM資料層變數版本二的狀態 gtm_preview_datalayer_in_version1.png max-800 %}

## 結論

如果可以理解這些**累加**跟**覆蓋**的概念
在規劃資料追蹤時就可以知道什麼時候要切換版本一或二

**目前 GTM 新增一個資料層變數，預設的版本是二**

就目前多年的使用經驗下來，其實大部分不會造成問題或影響
只有網頁是 SPA 的架構(ReactJS, AngularJS, VueJS) 時
某些狀況可能就要稍加留意

至少當發現預覽時，資料層變數跟使用者原本預設的不太一樣，就可以回頭測試是否因為版本問題所導致

