---
title: GA4 電子商務報表-已購買的商品數為 0
tags:
  - Google Analytics 4
categories:
  - Google Analytics 4
page_type: post
id: ga4_item_name_show_zero_purchase
description: GA4 電子商務案例分享，電商報表中商品名稱已購買數量顯示為0的原因和解決方法
bgImage: ga4_item_name_show_zero_purchase_bg.jpg
preload:
  - ga4_item_name_show_zero_purchase_bg.jpg
date: 2024-10-03 12:38:00 
---

{% darrellImage800 ga4_item_name_show_zero_purchase_bg ga4_item_name_show_zero_purchase_bg.jpg max-800 %}

[English Version Please Click Here](https://medium.com/@darrell.tw.martech/abnormal-items-purchased-shows-0-in-ga4-a2509f4150bd)
<link rel="alternate" hreflang="en" href="https://medium.com/@darrell.tw.martech/abnormal-items-purchased-shows-0-in-ga4-a2509f4150bd" />

## 商品購買數異常

在 GA4 的電子商務報表中，

可以看到如果顯示的維度是**商品名稱** -> 已購買的商品數 都顯示 0
{% darrellImage800 ga4_ecommerce_report_item_purchase_0 ga4_ecommerce_report_item_purchase_0.png max-800 %}

但如果是顯示**商品 ID** -> 已購買的商品數 就看起來正常
{% darrellImage800 ga4_ecommerce_report_item_purchase_id_is_fine ga4_ecommerce_report_item_purchase_id_is_fine.png max-800 %}

## 可能的原因 GTM or DataLayer or 其他

先尋找 Purchase 事件是怎麼設定
- Google Tag Manager 那邊設定 Purchase 時有錯誤
- Gtag 請工程師埋 code
- 其他可能用到 Measurement Protocol 的方式

-> 這客戶原本我就大概知道設定的邏輯，是用 Google Tag Manager 來處理電子商務相關的設定
從 Google Tag Manager 的設定來看，是沒有問題的
他們單純使用 DataLayer 裡面的電商資料來處理

排查後發現
就是 **DataLayer 裡面的資料有問題**，
對方工程師在推送 Purchase 事件時不知道什麼原因，
在 item_name 的最後增加了一些字符，導致 GA4 的報表顯示出現了問題

範例的 view_item DataLayer
{% darrellImage800 datalayer_show_view_item datalayer_show_view_item.png max-800 %}

範例的 add_to_cart DataLayer
{% darrellImage800 datalayer_show_add_to_cart datalayer_show_add_to_cart.png max-800 %}

範例的 purchase DataLayer
{% darrellImage800 datalayer_show_purchase datalayer_show_purchase.png max-800 %}

示意的 DataLayer 中可以看到 Purchase 事件中，
item_name 的最後多了一個 "_1"
小小的一個不同就會造成 GA4 報表直接不顯示重要的指標

## 修復和解決方法

### 解決 DataLayer 中的錯誤

這裡就是和對方工程師描述一下遇到的問題和發現的狀況，
基本上應該都蠻好配合，
除非他們是刻意加上這些字符，並且有不可逆轉和不可調整的因素

### 無法解決 DataLayer，從 GTM 解決

如果上面的方式無法配合，
那就只能自己透過 Google Tag Manager 來調整，
方法就會是一樣讀取 DataLayer 的電子商務資料，
但額外多做一個變數，來改寫這個商品名稱的邏輯

以範例來說明
就是在變數中寫一段程式
把 `時尚休閒上衣-1` 改寫成 `時尚休閒上衣`
如果規則如範例這麼簡單，那處理起來會蠻輕鬆的
就怕實務上遇到很複雜的，處理的規則可能就會跟著一起變很複雜

```javascript
function() {
  var itemName = {{DL-item_name}};
  if (itemName && itemName.endsWith('_1')) {
    return itemName.slice(0, -2);
  }
  return itemName;
}

// 注意此程式碼只是示意，實際寫法會依照 DataLayer 的不同而有所調整
```

**如果用此方法，請在發布前多做測試，例如是不是其他電商事件也一起被調整到，但其實不該調整的**

## 以前的歷史資料 -> LookerStudio

上面調整好發佈，或是對方工程師調整完成後
那往後的資料應該就會開始正常顯示

只是還是有一段問題，假設這個錯誤已經發生半年或是更久了
那在看以前的數據就會很麻煩
雖然把維度切換到商品 ID 是正常的
但以這客戶的情況來說，他們還是**很仰賴商品名稱在看報表**
來觀察商品的表現

從 Looker Studio 的建立一個和電子商務一樣的報表，
也會有商品名稱的問題
{% darrellImage800 looker_studio_before_fix.png looker_studio_before_fix.png max-800 %}

以範例的狀況來調整
加上一個計算欄位 : `item name fix`
並且用上 
```
REGEXP_REPLACE(Item name, '_1$', '')
```
變可以把 `原本的商品名稱-1` 改寫成 `原本的商品名稱`

{% darrellImage800 looker_studio_fix_item_name.png looker_studio_fix_item_name.png max-800 %}

這樣一來就算是過往的錯誤資料，
也能在 Looker Studio 看到正常的商品名稱，
並且好好的分析商品的表現
{% darrellImage800 looker_studio_after_fix.png looker_studio_after_fix.png max-800 %}


