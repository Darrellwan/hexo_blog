---
title: GA4 Ecommerce Recommend Events DataLayer
date: 2022-08-15 22:36:53
tags: 
	- Google Tag Manager
	- Google Analytics 4
description: GA4 在電子商務的推薦事件，Datalayer 該如何準備
categories: 
	- Google Tag Manager

---


# Google 上的建議事件清單

[[GA4] 建議事件](https://support.google.com/analytics/answer/9267735?hl=zh-Hant)

{% img left	https://darrelltw.com/ga4-ecommerce-recommend-events-datalayer/ga4_document_suggest_events.png ga4_document_suggest_events %}

在 Google 官方文件中，有提到一些產業的建議事件，電子商務(線上銷售)的事件列表並沒有提供很詳細的解釋，以及 Datalayer 該如何準備。
希望在本文中可以更清楚地提供說明

文章中不會按照官方文件的順序，而是盡量以真實場景的順序來呈現

---

# 瀏覽 -> 加入購物車 -> 結帳過程 -> 購買完成

這邊為電子商務事件中最基本也最重要的事件流程 !

## view_item - 商品瀏覽

| **Name** | **Type** | **Required** | **Example value** | **解釋** | 
|---|---|---|---|---|
| currency | string | Yes\* | USD | 幣別 : 新台幣為TWD，國際幣別可參考 [ISO_4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) |
| value | number | Yes\* | 7\.77 | 商品價格，請用純數字，不可加 $ 或是 NTD |
| items | Array&lt;Item&gt; | Yes | The items for the event\. | 商品詳細資訊，請參考 Items |

請於瀏覽商品頁面時觸發，商品頁面如

https://shop.googlemerchandisestore.com/Google+Redesign/Google+Inspired+Red+Notebook

DataLayer

```javascript

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "view_item",
  ecommerce: {
    currency: "{幣別}",
    value: {價格},
    items: [{
      item_id: "{商品ID}",
      item_name: "{商品名稱}",
      affiliation: "{商品聯盟(如沒有，可以直接填自家店商網站名稱)}",
      currency: "{幣別}",
      item_brand: "{商品品牌}",
      item_category: "{商品分類第一層}",
      item_category2: "{商品分類第二層}",
      item_category3: "{商品分類第三層}",
      item_category4: "{商品分類第四層}",
      item_category5: "{商品分類第五層}",
      item_variant: "{商品詳細資料，如尺寸或顏色}",
      price: {價格},
      quantity: {數量}
    }]
  }
});

```

---

剩下事件建置中
