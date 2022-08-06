---
title: GTM - Rewrite Items In Datalayer (From Stackoverflow )
date: 2022-07-31 22:49:43
tags: 
	- stackoverflow
	- google-tag-manager
	- google analytics 4
	- datalayer
	- items
description: 如何改寫 Datalyer 的 Items ，符合 Google Analytics 4 的 Items 規格
categories: 
	- Google Tag Manager
	- Googel Analytics 4
	- Stack Overflow
---


# Stack Overflow 上面的提問

[Stack Overflow 原文連結](https://stackoverflow.com/questions/73098387/can-ecommerce-item-for-ga4-add-to-cart-event-have-custom-parameters/)

提問的人發現他網站上的 DataLayer 中 Items 的架構和 Google Analytics 4 中要求的不同

```javascript
// 他網站中的
items: [
    {
      id: "SKU_12345",
      name: "Stan and Friends Tee",
      brand: "Google",
      category: "Apparel",
      item_id: "SKU_12345",
      item_name: "Stan and Friends Tee",
      item_brand: "Google",
      affiliation: "Google Merchandise Store",
      currency: "USD",
      price: 9.99,
      quantity: 1
    }
  ]
```

```javascript
// GA4 中需要的
items: [
    {
      item_id: "SKU_12345",
      item_name: "Stan and Friends Tee",
      affiliation: "Google Merchandise Store",
      currency: "USD",
      item_brand: "Google",
      item_category: "Apparel",
      price: 9.99,
      quantity: 1
    }
  ]
```



---

# 利用 Custom Variable 來解決問題 !

其實較正確的解決方法應該是去網站上修改 DataLayer. 是個比較根本的解決方法，
不過其實在 Google Tag Manager 也能改寫來完成
這邊利用的是 ```Custom Variable``` 

```javascript
function(){
  var yourItem = {{DLV-items}}
  var ga4Item = yourItem.map(function(o){
    return {
      item_id: o.id,
      item_name: o.name,
      affiliation:o.affiliation,
      currency: o.currency,
      item_brand: o.item_brand,
      item_category: o.category,
      price: o.price,
      quantity: o.quantity
    }
  })
  return ga4Item;
}

```

就是把 Datalayer 中的 Item 取出來，並透過 Array Map 的方式來重新改寫，
主要是把所有的 Key 改成 GA4 的規則，賦予相對應的值就能解決

{% img left	https://i.stack.imgur.com/SXa7e.png google_tag_manager_preview_datalayer %}

---

# 延伸思考 : Universal Analytics 的 Datalayer (Ecommerce)


[Google: Universal Analytics Datalayer](https://developers.google.com/analytics/devguides/collection/ua/gtm/enhanced-ecommerce#details)
在這個時期應該蠻多人會遇到說，網站上原本只有原本舊版GA (Universal Analytics) 的 Datalayer。 
偏偏又是在電商平台或是缺少工程人力幫忙時，怎麼能順利的將資料沿用到 Google Analytics 4 上。

其實按照這個解決方法，也可以沿用到這個情境上，提醒的地方是比較麻煩的地方會在物件層級上的不同 :
需要取得 ecommerce.detail.products，尤其中間的 detail 在加入購物車 或是 購買事件時又會不一樣。
未來會在新的文章中提供比較完整的做法，或許也能提供 Google Tag Manager 的 json 檔供直接匯入使用。

