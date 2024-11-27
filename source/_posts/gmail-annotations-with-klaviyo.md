---
title: 在 Klaviyo 使用 Gmail 特惠註解顯示折扣碼
tags:
  - Email Marketing
categories:
  - Marketing
page_type: post
id: gmail-annotations-with-klaviyo
description: description
bgImage: bg.jpg
preload:
  - bg.jpg
date: 2024-11-27 15:41:36
---

## Gmail 特惠註解

是否很常在 Gmail 信箱看到有些 Email 會有這樣醒目的特惠標示

{% darrellImage gmail_annotations_with_discount_code_example gmail_annotations_with_discount_code_example.jpg max-800 %}

其實 Google 是有文件教學說怎麼樣加上這些註解的

<a href="https://developers.google.com/gmail/promotab/overview?hl=zh-tw"><i class="fa-solid fa-link"></i><span> Gmail 註解 </span></a>

{% darrellImage gmail_annotations_document gmail_annotations_document.png max-800 %}

文件中介紹了三種的呈現方式

### Create a deal annotation (交易註解)
```
<!-- meta 版本 -->
<div itemscope itemtype="http://schema.org/DiscountOffer">
  <meta itemprop="description" content="DESCRIPTION"/>
  <meta itemprop="discountCode" content="DISCOUNT_CODE"/>
  <meta itemprop="availabilityStarts" content="START_DATE_TIME"/>
  <meta itemprop="availabilityEnds" content="END_DATE_TIME"/>
</div>

<!-- JSON-LD 版本 -->
<script type="application/ld+json">
[{
  "@context": "http://schema.org/",
  "@type": "DiscountOffer",
  "description": "DESCRIPTION",
  "discountCode": "DISCOUNT_CODE",
  "availabilityStarts": "START_DATE_TIME",
  "availabilityEnds": "END_DATE_TIME"
}]
</script>
```

這是簡單但又直覺的方式，如一開始的截圖一樣會呈現折扣碼，描述
並且多久後過期，過期也會呈現已過期
{% darrellImage gmail_annotations_with_discount_code_expired gmail_annotations_with_discount_code_expired.jpg max-400 %}

### Create a product carousel(產品輪播介面)

{% darrellImage gmail_annotations_promotion_product_carousel gmail_annotations_promotion_product_carousel.png max-400 %}`

產品輪播和下方的單張圖片預覽
都是用 `PromotionCard` 來標示
只是內容不太一樣

{% darrellImage gmail_annotations_promotion_card_multiple_products gmail_annotations_promotion_card_multiple_products.png max-400 %}
輪播的話會有多個產品，並且需要標示產品相關資訊

```
IMAGE_URL：圖片的網址，格式為 PNG 或 JPEG，例如 https://www.example.com/image.png。支援的顯示比例為 4:5、1:1、1.91:1。針對產品輪轉介面，每張圖片都必須有專屬網址，且使用相同的顯示比例。
PROMO_URL：促銷活動的網址。使用者點選「促銷活動」分頁中的圖片後，就會造訪這個網址。
HEADLINE (選用)：1 到 2 行宣傳活動說明，會顯示在預覽圖片下方。
PRICE (選用)：促銷活動的價格。
PRICE_CURRENCY (選用)：價格的幣別，採 3 個英文字母組成的 ISO 4217 格式，例如 USD。決定使用 price 顯示的貨幣符號。
DISCOUNT_VALUE (選用)：從 price 中減去的金額，用於顯示經調整的價格。調整後的價格會顯示在原價旁邊。

舉例來說，如果 discountValue 為 25、price 為 100，而 priceCurrency 為 USD，則系統會顯示經調整的價格 $75。

POSITION (選用)：輪轉介面中卡片的位置。
```

### 圖片
注意 Ratio 是 4:5、1:1、1.91:1
如果沒有專業軟體的話，這裡用個線上服務示意

<a href="https://croppola.com/"><i class="fa-solid fa-link"></i><span> croppola </span></a>

- 1:1
{% darrellImage image_ratio_1_1 image_ratio_1_1_400.png max-400 %}
- 4:5
{% darrellImage image_ratio_4_5 image_ratio_4_5.png max-400 %}
- 1.91:1
{% darrellImage image_ratio_1_91_1 image_ratio_1_91_1.png max-400 %}


### Create a single image preview(單張圖片預覽畫面)

單張圖片比圖片輪播就更單純一點，用一張促銷的圖片來吸引使用者的注意

{% darrellImage gmail_annotations_promotion_single_image gmail_annotations_promotion_single_image.png max-400 %}
```
 // Build the first image preview in your product carousel:
  <div itemscope itemtype="http://schema.org/PromotionCard">
    <meta itemprop="image" content="IMAGE_URL"/>
    <meta itemprop="url" content="PROMO_URL"/>

    // Optionally, include the following PromotionCard properties:
    <meta itemprop="headline" content="HEADLINE"/>
    <meta itemprop="price" content="PRICE"/>
    <meta itemprop="priceCurrency" content="PRICE_CURRENCY"/>
    <meta itemprop="discountValue" content="DISCOUNT_VALUE"/>
  </div>


<!-- 
  IMAGE_URL：預覽圖片的網址，格式為 PNG 或 JPEG，例如 https://www.example.com/image.png。支援的顯示比例為 1.91:1。
  PROMO_URL：使用者點選 image 時，導向促銷活動的網址。
  HEADLINE (選用)：1 到 2 行宣傳活動說明，會顯示在預覽圖片下方。
  PRICE (選用)：促銷活動的價格。
  PRICE_CURRENCY (選用)：價格的幣別，採 3 個英文字母組成的 ISO 4217 格式，例如 USD。決定使用 price 顯示的貨幣符號。
  DISCOUNT_VALUE (選用)：從 price 中減去的金額，用於顯示經調整的價格。調整後的價格會顯示在原價旁邊。

  舉例來說，如果 discountValue 為 25、price 為 100，而 priceCurrency 為 USD，則系統會顯示經調整的價格 $75。 
-->
```
官方文件提示的都蠻清楚，這邊直接放上原先內容

## Klaviyo 使用 Gmail annotation

{% darrellImage darrelltw_klaviyo_gmail_annotation_discount darrelltw_klaviyo_gmail_annotation_discount.png max-800 %}

如何在 Klaviyo 使用 Gmail annotation，
首先上面提到 Annotation 有兩種程式碼格式:
- Meta 版本
- JSON-LD 版本

由於 JSON-LD 版本需要用 `<script>` 標籤
如果是 Drag and Drop 的話就無法特別改動 `<header>` 部分
也無法透過 html 插入，系統會檢測使用 `<script>` 標籤
最終使用 Meta 

在官方文件中，切換為微資料的 tab 後就會顯示 Meta 版本的程式碼
{% darrellImage gmail_annotaions_use_meta gmail_annotaions_use_meta.png max-800 %}

### 在模板中插入一個 Html Block
{% darrellImage klaviyo_add_html_block klaviyo_add_html_block.png max-800 %}

這邊預設原本已經有在發送的模板，
只要額外在模板的空白處插入一個 Html Block
不需要擔心這邊會造成跑版，理論上這段程式碼是不會顯示的

如果真的造成跑版，就把這段 Html Block 移到其他地方試試看

之後就貼上從文件複製的 Meta code，並把 `DESCRIPTION` `DISCOUNT_CODE` `START_DATE_TIME` `END_DATE_TIME` 替換成這次活動的相關資訊
{% darrellImage klaivyo_html_block_add_gmail_annotation klaivyo_html_block_add_gmail_annotation.png max-400 %}

完成後儲存並發送 Preview 就可以在 Gmail 看到是否成功

### 呈現或顯示問題

實測幾輪下來，就算確定提供的資料欄位都是正確的，
還是有可能會遇到 Gmail 不顯示的問題
這點算是 Gmail 系統判定是否會顯示
而不是 100% 一定會顯示成功

圖片範例就是一樣的 annotations 資料
卻在另一封沒有呈現，但在 iOS Gmail 版本又有顯示
{% darrellImage chrome_shows_annotation_sometimes_failed chrome_shows_annotation_sometimes_failed.png max-400 %}


