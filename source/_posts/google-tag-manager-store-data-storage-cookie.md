---
title: Google Tag Manager - 利用 LocalStorage Cookie SessionStorage 來暫存資訊
date: 2022-10-20 21:55:00
tags:
	- Google Tag Manager
	- Measurement Skill
description: 網頁追蹤偶爾會需要將一些頁面上的資訊或是使用者的資訊暫存在瀏覽器上，這時常常會發現有 Cookie, LocalStorage, SessionStorage 可以選擇，這邊試圖來理解該怎麼使用以及如何挑選 !
categories: 
	- Google Tag Manager
page_type: post
---

 ![background_storage_picture](./background_storage_picture.webp)

## 為什麼需要暫存資料

有些時候我們在做追蹤時，會遇到這個頁面有資料要追蹤，但下個頁面沒有
這些資料卻必須要保留著，到下一個頁面或是某個行為時會需要

有個常見的情境為 登入會員
如果沒有適當的 DataLayer 可以使用，往往這個行為追蹤會是個災難

我們必須判斷使用者 點擊 登入的按鈕後，還要能判斷他登入成功的情境
(因為他很有可能輸入錯誤的帳號密碼，或單純不小心點擊到那個登入按鈕，這些都是我們不想要的情境)

 ![login_demo](./login_demo.png)

所以這個時候有個方法就是
1. 追蹤他點擊登入按鈕
2. 並將這個行為 暫時儲存在 LocalStorage
3. 等到之後的頁面我們確定他是登入成功的狀態，回頭檢查是不是有這個 LocalStorage
4. 如果有，我們就能確定，他有經歷過 登入成功 的行為，發送相關的追蹤程式碼後再把這個 LocalStorage 移除即可

上述的方法的確可以讓我們處理一些麻煩的情境，又能盡量符合使用者的實際行為
重點就在於，我們需要將一些暫時的資料存放在瀏覽器上
通常我們就有這三種選擇 : LocalStorage, SessionStorage, Cookie

## 如何找到瀏覽器中的這些資料

1. 開啟 Chrome DevTool
2. 點擊 tab: Application
3. 左方中可以分別找到這些項目
 ![how_to_check_cookie_storage](./how_to_check_cookie_storage.png)

## 三種儲存的差異

### Cookie

最元老的技術
行銷界近幾年會聽到 cookieless 就跟這技術有關係，簡單來說未來廣告平台將失去使用第三方 cookie 的能力，間接導致很多類似受眾的追蹤等等失去精準度

- Cookie 的長度限制 : 4096 Bytes
- 網站送出的 request 都會帶著同一個 domain 底下的 cookie

Cookie 是個方便的選擇，但也有很多地方要小心
我覺得第一點就是要知道自己儲存的`資料是不是很大量`
例如一個購物車的 JSON String. 
這就不太推薦使用 Cookie，很有可能會因為 Cookie 太長導致 Request 壞掉的

除非儲存的資料量很小，而且有時效性的需求 (例如這個 Cookie 只留存 1天或一個短時間)

以下是個範例和順便讓大家知道如何查詢一個 request 帶了哪些 cookie

1. 打開 chrome devtool，選擇 tab: `network`，選取一個 domain 是自己 domain 的 request
![how_to_check_the_cookie_in_request](./how_to_check_the_cookie_in_request.png)

2. 選擇 Cookie，就能看到所有跟著 request 送出的 cookie
![the_cookie_in_the_request](./the_cookie_in_the_request.png)


### SessionStorage

瀏覽器中的 Storage 分為兩種
SessionStorage 和 LocalStorage
前者的概念較爲複雜了一點點，所以先放在前面提到

SessionStorage 的生命週期就只有，當下這個分頁

(附圖為三個分頁，純粹重新展示一次`分頁`的概念)
![3_tabs_in_chrome](./3_tabs_in_chrome.png)

Session Storage 在不同分頁時，無法彼此共用，就算在同一個網站底下也是
而且分頁關掉的那一剎那，SessionStorage 就會跟著消失了
![session_storage_in_different_tab.webp](./session_storage_in_different_tab.webp)


### LocalStorage

LocalStorage 的概念就單純很多
可以跨分頁的儲存在同一個網站底下

並且除非去清除掉，不然就是會一直存在

下圖顯示為，存了一次資料進 LocalStorage 後，所有分頁都會出現
![local_storage_in_different_tab.webp](./local_storage_in_different_tab.webp)


### 如何使用 Cookie (JavaScript)

以下範例都從 [W3C School](https://www.w3schools.com/js/js_cookies.asp) 取得

#### 儲存 Cookie

```javascript
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
```

需要注意的是第三個參數為天數
![set_cookie.webp](./set_cookie.webp)

#### 取得 Cookie

記得之前存的 Cookie name, 或是去 DevTool 的 Cookie 列表找

```javascript
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
```
![get_cookie.webp](./get_cookie.webp)


#### 移除 Cookie

其實算是把 `setCookie` 稍微改寫一下
Expires 設定為 1970/01/01 00:00:01 而已

```javascript
function deleteCookie(cname, cvalue, exdays) {
  let expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
```

### 如何使用 Storage (JavaScript)

因為 SessionStorage 和 LocalStorage 的方式都一樣，
所以就合在一起說明

#### 取得 Storage

```javascript
sessionStorage.getItem("key");
localStorage.getItem("key");
```

#### 儲存 Storage

```javascript
sessionStorage.setItem("key", "value");
localStorage.setItem("key", "value");
```

#### 移除 Storage

```javascript
sessionStorage.removeItem("key");
localStorage.removeItem("key");
```

#### 儲存和使用 object 型態的資料

當你想儲存一個 object 或是 array 到 localStorage 或 Cookie 時
存的當下並沒有報錯和 Error
但檢查的時候就會發現它存壞了
![store_object_in_storage](./store_object_in_storage.webp)

請記得使用 [JSON.stringify()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
將 object 先存成 json sring 後再儲存
![store_object_in_storage_json_stringify](./store_object_in_storage_json_stringify.webp)

取出的時候，也要記得把 json string 再轉回 object 使用
[JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
![get_object_in_storage_json_parse](./get_object_in_storage_json_parse.webp)

### In Google Tag Manager

上述提到的三種功能
通常會在兩個地方使用到

代碼的 `自訂HTML`
![tag_manager_customhtml](./tag_manager_customhtml.webp)

變數的 `自訂 JavaScript`
![tag_manager_custom_js_variable](./tag_manager_custom_js_variable.webp)