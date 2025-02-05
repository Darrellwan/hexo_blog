---
title: 在 GTM 安裝 Line Tag Pixel
tags:
  - Google Tag Manager
  - Line Tag
  - DPA
categories:
  - Google Tag Manager
page_type: post
id: gtm-install-line-tag-pixel
description: 完整介紹如何在 Google Tag Manager 中安裝 Line Tag，包含basecode、轉換事件、自定義事件以及 DPA 動態廣告所需的標準事件追蹤設定。
bgImage: gtm_install_line_tag_bg
preload:
  - gtm_install_line_tag_bg
date: 2025-02-05 17:44:37
---

{% darrellImageCover gtm_install_line_tag_bg gtm_install_line_tag_bg.jpg max-800 %}

## 安裝 Basecode

{% darrellImage line_basecode_in_oa_platform line_basecode_in_oa_platform.jpg max-800 %}

路徑 **Line Official Account Manager -> Data controls -> Tracking （LINE Tag）**

如圖片所示會有個 basecode 可以複製
到 Google Tag Manager 新增一個 Custom HTML 代碼貼上
選擇在所有頁面載入即可

{% darrellImage line_basecode_install_in_google_tag_manager line_basecode_install_in_google_tag_manager.png max-800 %}

下圖中圈起來的紅色框框部分就是這組 Pixel 的 id
可以記得一下這個 id ，或許後續會使用

{% darrellImage line_basecode_check_pixel_id line_basecode_check_pixel_id.png max-800 %}

## 安裝 自定義事件和轉換

### 轉換事件

下一步就是要安裝**轉換事件**
Line 在文件的下方就有轉換事件的複製

請注意，這通常是指一種轉換行為

在電商網站中，大機率會是「購買完成」
在其他網站中，大機率會是「表單送出」

{% darrellImage line_conversion line_conversion.png max-800 %}

這邊在 GTM 用購買事件當作範例(並使用 Purchase 事件的 DataLayer)

{% darrellImage line_purchase_event_in_gtm line_purchase_event_in_gtm.png max-800 %}

### 自定義事件

{% darrellImage line_custom_event line_custom_event.png max-800 %}

文件上也可以選擇安裝自定義事件
並且可以先命名 **事件名稱**

文件的程式碼就會自動更換事件名稱產生 code 
非常的方便👍👍👍

這邊用使用者註冊(signup) 當作範例

{% darrellImage line_custom_event_in_gtm line_custom_event_in_gtm.png max-800 %}

## 安裝 DPA 標準事件

Line 的標準事件和商品參數
是當你在 LINE Ads Platform  要跑 DPA 動態廣告(Dynamic Product Ads) 時
就會需要在追蹤碼回傳商品的參數

這邊提供官方文件的截圖

{% darrellImage line_dpa_document_1 line_dpa_document_1.png max-800 %}

{% darrellImage line_dpa_document_2 line_dpa_document_2.png max-800 %}

也附上 LAP 關於 DPA 的文件連結 <a href="https://vos.line-scdn.net/lbstw-static/images/uploads/download_files/5301e4794d05a202a0dd37a621c322f5/LAP%E5%BB%A3%E5%91%8A_%E5%8B%95%E6%85%8B%E5%BB%A3%E5%91%8A%20Media%20Guide_240719.pdf"><i class="fa-solid fa-link"></i><span> LAP 關於 DPA 的文件 </span></a>

DPA 的 Code 跟前面的不太一樣

### 什麼是 DPA (Dynamic Product Ads)

嘗試用影片動畫的方式來解釋 DPA 的過程

1. 追蹤使用者和哪個商品互動
2. Ad Server 用該商品資料組合廣告素材(Catalog 是常見的方式)
3. 將廣告素材推播改使用者

Catalog 在不同平台的名字都不太一樣
Google 是利用購物廣告
Facebook 是利用商品目錄(也是命名為 Catalog)

Email Marketing 的再行銷也會利用類似的邏輯
有些是追蹤完整的商品參數，有些也是追蹤 id 回去換商品資料

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1053670395?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Line DPA Data-to-Creative Pipeline"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

### GTM-Custom JavaScript Variable

由於 Line DPA 需要的商品 id, name 是陣列形式
跟原本的 DataLayer 不同

所以使用 Custom JavaScript Variable 來轉換

{% darrellImage line_dpadetail_gtm_setting_check_datalayer line_dpadetail_gtm_setting_check_datalayer.jpg max-800 %}

如果你的網站也是使用 GTM 的標準 DataLayer，那在 GTM 預覽時應該會看到跟截圖的 Json 有九成接近
這時就可以參考下面的設定來組合出 Line DPA 要的格式

{% darrellImage line_dpa_gtm_custom_javascript_variable line_dpa_gtm_custom_javascript_variable.png max-800 %}

```
function() {
  // 讀取已經定義的 DLV-ecommerce-items 變數
  var items = {{DLV-ecommerce-items}};
  
  // 檢查資料是否為陣列
  if (Array.isArray(items)) {
    // 使用 map 來取出每個物件的 item_id
    return items.map(function(item, index) {
      // 若需要根據位置產生 "item_id1", "item_id2"... 可使用以下格式
      // return "item_id" + (index + 1);
      
      // 如果直接取出物件中的 item_id，請使用以下：
      return item.item_id;
    });
  }
  
  // 如果資料不是陣列，回傳空陣列或 undefined
  return [];
}
```

依序調整 item_id, item_name, quantity, price 後就可以得到:

{% darrellImage line_dpa_gtm_custom_javascript_variable_preview line_dpa_gtm_custom_javascript_variable_preview.png max-800 %}


### dpa_detail 
有安裝過 GA4 的電子商務追蹤碼的話，其實就等於 `view_item` 的事件
所以 GTM 的 Trigger 可以共用

產品的參數只有 `itemIds` 是必填的
其他參數都是選填(建議)

我是覺得都要做了，那就一次做到好吧!

```
<script> 
  _lt('send', 'cv', {
    type: 'dpa_detail',
    itemIds: {{CJS-item_id_array}},
    price: {{CJS-item_price_array}},
    currency: {{CJS-item_currency_array}},
    quantity: {{CJS-item_quantity_array}}
  },
  { dpa: true },
  ['ad2f6900-6442-49d6-9aac-1209a59990c5'] // 請記得替換成自己的 line pixel id
);
</script>
```

GTM 的設定如下:

{% darrellImage line_dpadetail_gtm_tag_setting line_dpadetail_gtm_tag_setting.png max-800 %}

### dpa_cart

dpa_cart 的邏輯跟一般加入購物車不一樣
他不是要追蹤 什麼東西被加入購物車
而是購物車裡面全部有哪些商品

概念圖:

{% darrellImage line_dpa_tracking_different_in_ga4_vs_dpa line_dpa_tracking_different_in_ga4_vs_dpa.png max-800 %}

簡單來說: GA4 和一般的追蹤加入購物車，就是單次被加入的商品
而 Line DPA 要的是購物車的全部(Shampoo)

這邊有兩種追蹤策略
1. 等使用者到達購物車頁面再追蹤
  購物車頁面通常會有個 begin_checkout 或是 cart 事件呈現所有購物車的商品

2. 如果怕使用者不會到購物車頁面就離開
  這時候可以跟著加入購物車的事件一起追蹤
  只是 DataLayer 就不能只用標準的 add_to_cart
  要另外做一個 DataLayer 可以得到當下購物車所有商品的事件和資料

```
<script> 
  _lt('send', 'cv', {
    type: 'dpa_cart',
    itemIds: {{CJS-item_id_array}},
    price: {{CJS-item_price_array}},
    currency: {{CJS-item_currency_array}},
    quantity: {{CJS-item_quantity_array}}
  },
  { dpa: true },
  ['ad2f6900-6442-49d6-9aac-1209a59990c5'] // 請記得替換成自己的 line pixel id
);
</script>
```

{% darrellImage line_dpa_cart_gtm_tag_setting line_dpa_cart_gtm_tag_setting.png max-800 %}

GTM 設定使用 begin_checkout 事件來示範

### Conversion

Conversion 在電商就是購買完成的事件
並且不像 GA4 還要提供訂單 ID 等相關訂單欄位，實作上比較簡單

```
<script> 
  _lt('send', 'cv', {
    type: 'Conversion',
    itemIds: {{CJS-item_id_array}},
    price: {{CJS-item_price_array}},
    currency: {{CJS-item_currency_array}},
    quantity: {{CJS-item_quantity_array}}
  },
  { dpa: true },
  ['ad2f6900-6442-49d6-9aac-1209a59990c5'] // 請記得替換成自己的 line pixel id
);
</script>
```

{% darrellImage line_dpa_conversion_gtm_tag_setting line_dpa_conversion_gtm_tag_setting.png max-800 %}

GTM 設定使用 purchase 事件來示範

### dpa_search

search 事件是在使用者用關鍵字搜尋商品時，
被搜尋到的商品列表

沒有 DataLayer 的話會比較麻煩，建議請工程師補上
或是需要額外寫 JavaScript 來從商品列表的 html 萃取商品 id

文件上有提到只需要提供 itemIds，所以把其他欄位先移除

```
<script> 
  _lt('send', 'cv', {
    type: 'search',
    itemIds: {{CJS-item_id_array}}
  },
  { dpa: true },
  ['ad2f6900-6442-49d6-9aac-1209a59990c5'] // 請記得替換成自己的 line pixel id
);
</script>
```

{% darrellImage line_dpa_search_gtm_tag_setting line_dpa_search_gtm_tag_setting.png max-800 %}

GTM 設定使用 view_item_list 事件來示範
並且限制在商品頁面等於 search 時才觸發

DPA 的追蹤程式碼相對來說都會麻煩很多
上述的介紹都是在有 GTM 標準 DataLayer 的情況下介紹的方式

另外也要確認 DataLayer 是否規格符合才能使用

安裝上有遇到問題歡迎透過下方連結聯絡，也能留言討論
