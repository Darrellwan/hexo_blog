---
title: GA4 電子商務的建議事件說明 & DataLayer 規格
date: 2022-08-15 22:36:53
tags: 
	- Google Tag Manager
	- Google Analytics 4
	- DataLayer
description: GA4 在電子商務的推薦事件，Datalayer 該如何準備，以及這些事件該在什麼時機點觸發
categories: 
	- Google Tag Manager
page_type: post
---

## Google 上的建議事件清單

[[GA4] 建議事件](https://support.google.com/analytics/answer/9267735?hl=zh-Hant)

{% img left	https://www.darrelltw.com/ga4-ecommerce-recommend-events-datalayer/ga4_document_suggest_events.png ga4_document_suggest_events %}

在 Google 官方文件中，有提到一些產業的建議事件，電子商務(線上銷售)的事件列表並沒有提供很詳細的解釋，以及 Datalayer 該如何準備。
希望在本文中可以更清楚地提供說明

文章中不會按照官方文件的順序，而是盡量以真實場景的順序來呈現

---

## 瀏覽 -> 加入購物車 -> 結帳過程 -> 購買完成

這邊為電子商務事件中最基本也最重要的事件流程 !

共用參數以及參數解釋 :

| **Name** | **Type**          | **Required** | **Example value**         | **解釋**                                                                                            |
| -------- | ----------------- | ------------ | ------------------------- | --------------------------------------------------------------------------------------------------- |
| currency | string            | Yes\*        | USD                       | 幣別 : 新台幣為 TWD，國際幣別可參考 [ISO_4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) |
| value    | number            | Yes\*        | 7\.77                     | 商品價格，請用純數字，不可加 $ 或是 NTD                                                             |
| items    | Array&lt;Item&gt; | Yes          | The items for the event\. | 商品詳細資訊，請參考 Items                                                                          |

---

## view_item - 商品瀏覽

### 觸發時機點

請於瀏覽商品頁面時觸發，商品頁面如
{% darrellImage product_detail_page product_detail_page.webp %}
[Source:Google 商店](https://store.google.com/tw/product/usb_c_30w_charger?hl=zh-TW)

### DataLayer

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "view_item",
  ecommerce: {
    currency: "{幣別}",
    value: { 價格 },
    items: [
      {
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
        price: { 價格 },
        quantity: { 數量 },
      },
    ],
  },
});
```

---

## add_to_cart - 加入購物車

### 觸發時機點

請在商品加入購物車完成時觸發
通常頁面上會有一兩個以上的加入購物車按鈕
分別於**商品詳細頁** 或是 **商品列表頁**中

且請工程師注意是否有 ajax 等 request 判斷是否加入購物車完成
不要在按鈕點擊的一開始就觸發

{% darrellImage add_to_cart_demo add_to_cart_demo.webp %}
來源 : [Shopify 範例商家](https://www.shopify.com/tw/examples) [phoneloops](https://phoneloops.com/)

### DataLayer

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "add_to_cart",
  ecommerce: {
    currency: "{幣別}",
    value: { 價格 },
    items: [
      {
        item_id: "{商品ID}",
        item_name: "{商品名稱}",
        affiliation: "{商品聯盟(如沒有，可以直接填自家店商網站名稱)}",
        currency: "{幣別}",
        discount: { 折扣金額 },
        item_brand: "{商品品牌}",
        item_category: "{商品分類第一層}",
        item_category2: "{商品分類第二層}",
        item_category3: "{商品分類第三層}",
        item_category4: "{商品分類第四層}",
        item_category5: "{商品分類第五層}",
        item_variant: "{商品詳細資料，如尺寸或顏色}",
        price: { 價格 },
        quantity: { 數量 },
      },
    ],
  },
});
```

剩下事件建置中

## begin_checkout - 開始結帳

### 觸發時機點

通常為進入到結帳頁面時觸發
以 Shopify 的頁面來說
有 basket 頁面和 checkout 頁面
通常會以 checkout 頁面為主，不過這地方有點見仁見智
理論上把 basket 頁面當作 begin_checkout 也沒問題
或是做一個 custom_event 叫 basket_page 等等讓你方便辨識是在 basket 頁面

**注意 DataLayer 中的 Items 為購物車中的所有商品，贈品等 0 元商品可視需求加入或移除**

{% darrellImage begin_checkout_demo begin_checkout_demo.png %}
來源 : [Shopify 範例商家](https://www.shopify.com/tw/examples) [nonadrinks](https://www.nonadrinks.com/)

### DataLayer

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "begin_checkout",
  ecommerce: {
    currency: "{幣別}",
    value: { 價格 },
    items: [
      {
        item_id: "{商品ID}",
        item_name: "{商品名稱}",
        affiliation: "{商品聯盟(如沒有，可以直接填自家店商網站名稱)}",
        currency: "{幣別}",
        discount: { 折扣金額 },
        item_brand: "{商品品牌}",
        item_category: "{商品分類第一層}",
        item_category2: "{商品分類第二層}",
        item_category3: "{商品分類第三層}",
        item_category4: "{商品分類第四層}",
        item_category5: "{商品分類第五層}",
        item_variant: "{商品詳細資料，如尺寸或顏色}",
        price: { 價格 },
        quantity: { 數量 },
      },
    ],
  },
});
```

## purchase - 購買完成

### 觸發時機點

絕大多數情況下，會在訂單完成時的訂單感謝頁面觸發
但無論有沒有訂單完成業，其實影響不大

希望就是在訂單確認成立的那一時刻，API 回拋訂單資訊時觸發
因為 Purchase 事件需要

**訂單編號**
**訂單金額**
**訂單商品項目**

**注意 DataLayer 中的 Items 為購物車中的所有商品，贈品等 0 元商品可視需求加入或移除**

{% darrellImage demo_thanksyou_page demo_thanksyou_page.png %}

### DataLayer

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "purchase",
  ecommerce: {
    transaction_id: "{訂單編號}",
    affiliation: "{聯盟}",
    value: { 訂單總金額 },
    tax: { 稅額 },
    shipping: { 運費 },
    currency: "{幣別}",
    coupon: "{折扣碼}",
    items: [
      {
        item_id: "{商品ID}",
        item_name: "{商品名稱}",
        affiliation: "{商品聯盟(如沒有，可以直接填自家店商網站名稱)}",
        currency: "{幣別}",
        discount: { 折扣金額 },
        item_brand: "{商品品牌}",
        item_category: "{商品分類第一層}",
        item_category2: "{商品分類第二層}",
        item_category3: "{商品分類第三層}",
        item_category4: "{商品分類第四層}",
        item_category5: "{商品分類第五層}",
        item_variant: "{商品詳細資料，如尺寸或顏色}",
        price: { 價格 },
        quantity: { 數量 },
      }
    ],
  },
});
```

剩下事件建置中
