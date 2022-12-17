---
title: Google Tag Manager - 變數 對照表(Lookup Table) 介紹和如何使用
date: 2022-11-10 23:01:13
tags:
    - Google Tag Manager
    - GTM Tutorial
    - GTM 教學
description: GTM 的變數 - 對照表(Lookup Table)，可以幫助你在有明確規則的狀況下改寫變數中的值，用來去蕪存菁或是直接改成想要的資料格式。只需要注意他的運算規則是等於(==)而不是包含
categories: 
    - Google Tag Manager
page_type: post
---
{% darrellImage gtm_lookuptable_bg gtm_lookuptable_bg.webp %}

遇到和討論過幾次 Lookup Table 對照表的問題，決定來整理成一篇目前已知的用法和一些避免踩雷的地方

---

### 是用 等於 來判斷，不是包含

以 Page Path 舉例，網頁的路徑是一個可以很複雜的變數

{% darrellImage gtm_preview_path gtm_preview_path.png %}

這邊就要另外提到，網址的每個部分是什麼

{% darrellImage url_structure url_structure.png %}

以圖片為例，這個網址的 path 就是
`/ga4-certification-review/`

包含最前面和最後面的 **/**

所以如果今天想要用 對照表 這個變數來根據 path 產生一個新的值
就需要完整的填入 
`/ga4-certification-review/`

{% darrellImage preview_with_right_and_wrong preview_with_right_and_wrong.png %}

---

### 重複的比較項目

另一個情況是當設定的項目太多，
不小心有重複的比較項目時會有什麼結果

{% darrellImage preview_with_duplicate_setting preview_with_duplicate_setting.png %}

幸運的是不會回報錯誤，只是它會是取最下面的那個重複項目
如圖片所示
設定了兩個一模一樣的比對
最後呈現的下面的那筆

用程式來說明的話可能比較像是
```javascript

// 假裝是個 Custom JavaScript Variable 自訂 JavaScript 變數

function () {
  var result = ""
  if({{path}} == "/ga4-certification-review/"){
    result = "GA4 證照的準備";
  }
  if({{path}} == "/ga4-certification-review/"){
    result = "測試";
  }
  return result;	
}
```

---

Lookup Table 對照表在規則明確下的確算方便好用，也不用工程師寫程式來做複雜的判斷，
只是實務上通常的判斷規則都會複雜許多

例如是可能要用包含來判斷，或是正規表達等等
這些情境就還是建議使用 **Custom JavaScript Variable - 自訂JavsScript** 來做判斷，
只是就需要工程師的幫忙

未來如有其他 Lookup Table 的常見問題和範例也會持續補充
