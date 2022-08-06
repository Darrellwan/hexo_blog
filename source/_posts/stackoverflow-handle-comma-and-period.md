---
title: GTM - Handle comma and period - 處理價格的小數點和逗點 (From Stackoverflow )
date: 2022-08-06 13:59:00
tags: 
	- stackoverflow
	- google-tag-manager
	- google analytics 4
	- price
description: 利用 Google Tag Manager 傳送 Price 價格資料給 Google Analytics 4 時，因為逗點和小數點的問題導致價格無法順利追蹤
categories: 
	- Google Tag Manager
	- Googel Analytics 4
	- Stack Overflow
---

# Stack Overflow 上面的提問

[Stack Overflow 原文連結](https://stackoverflow.com/questions/73233184/how-to-replace-comma-with-a-dot-in-gtm-for-json-structured-data)

提問者想要利用 Google Tag Manager 來生成 Schema.org 相關優化 SEO 和爬蟲爬取網頁商品資訊的 JSON。
[Google 的相關文件 : 產品 結構化資料](https://developers.google.com/search/docs/advanced/structured-data/product)

發現說價格的處理上一直有點問題，價格一直顯示是 ```12,5``` ，但應該要是 ```12.5```。
其實他也想到了解決的方法，就是要使用
```
value.replace(",", ".")
```
只是不確定說在 Google Tag Manager 該怎麼處理。


---

# 利用 GTM 中的 Custom Variable 來解決問題 !

和之前的文章中 [Rewrite Items In Datalayer](https://hexo.darrelltw.site/stackoverflow-gtm-rewrite-items-in-datalayer/) 其實用的方法一樣，
都是利用 Customer Variable 來處理。

## 首先，先知道原本的 Price 該怎麼取得

先回頭找找目前的 Price 怎麼取得，
有可能為一個 DataLayer Variable，也有可能是其他的變數

這邊的舉例為我先用另一個 Custom Variable 來回傳一個
```12,5``` 的變數
命名為 : Product-price

所以我要使用這個變數，就得在其他的 Custom Variable 使用 {{Product-price}}。

## 利用 JavaScript 來調整

```JavaScript
function(){
    var price = {{Product-price}};
    return price.replace("," , ".");
}
````

最直接的寫法就會是這樣，危險的地方就會是沒有處理例外狀況。
可能的情況有
1. 要是數字裡面有兩個(含)以上的 comma, 數字就會變得混亂
	例如 : 1,234,567 會變成 1.234,567
{% img left	https://hexo.darrelltw.site/stackoverflow-handle-comma-and-period/only_replace_first_comma.png only_replace_first_comma %}
	=> 解法 : 如果有多個 comma 要處理，請使用 [JavaScript replaceAll](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll)

2. 呈上，如果最後轉出來的價格為 1.234.567 那基本上還是個無效的價格數字，這時最好回頭去詢問工程師或是檢查網站上的程式碼，直接調整成正確的價格格式 : 1234.567 (不要包含逗點)

---

# 延伸思考 : 結構化資料

通常會思考或使用結構化資料 Structured Data，就是為了一些 SEO 的優化或是爬蟲的方便辨識等等。

像是電商網站中，會有大量的產品資訊，但怎麼讓 Google 可以搜尋到這個產品的圖片跟價格等等資訊，並讓 Google 知道這是一個 **產品**

{% img left	https://hexo.darrelltw.site/stackoverflow-handle-comma-and-period/google_product_from_structure_data.png google_product_from_structure_data %}

當搜尋了 **電腦螢幕** ，發現可以切換到 **Shopping** 這個 tab，裡面就包含了大量的螢幕商品資訊。
也就是說這些產品的網頁資訊都包含了 Product 的結構化資料

可以裡用 [Google 測試結構化資料](https://developers.google.com/search/docs/advanced/structured-data) 來反查別人怎麼做的 : 


{% img left	https://hexo.darrelltw.site/stackoverflow-handle-comma-and-period/google_product_from_structure_data_result.png google_product_from_structure_data_result %}

{% img left	https://hexo.darrelltw.site/stackoverflow-handle-comma-and-period/google_product_from_structure_data_result_products.png google_product_from_structure_data_result_products %}

可以看到 Google 檢索這個 Pchome24 的螢幕商品時取得了哪些商品資訊，所以他可能就出現在了 Google 的購物搜尋中，
大家也可以多利用結構化資料，來曝光自己的商品資訊。