---
title: Google App Script - Cache Service 做快取
tags:
  - Google App Script
  - Cache
categories:
  - Google App Script
page_type: post
id: google-app-script-cache-service
description: 為什麼要在 Google App Script 中使用快取，什麼場景可以用快取來加速服務，並且避免可能遇到的限制。CacheService 是個簡單好用的方式，能幫助你輕鬆快取資料。
bgImage: appscript_cache_bg.jpg
preload:
  - appscript_cache_bg.jpg
date: 2024-12-22 23:48:43
---

{% darrellImageCover appscript_cache_bg appscript_cache_bg.jpg max-800 %}

在 Google App Script 也能做快取
快取能大幅度加速你的資料載入
一般來說，資料會從兩種地方來

1. 從 Google Sheet 取得
2. 用 UrlFetch 從 API 取得

這兩個取得資料的方式都需要一陣子的處理時間
Google Sheet 就算資料量不大，也都需要經過一些步驟
像是從 Sheet 取得資料，再來轉換成 JSON 格式，這時的 JSON Object 才能做後續程式碼的處理
API 類似的道理，需要網路來取得，並且有時因為資料量太大，或是對方 Server 本來就比較慢回應，會造成較久的等待時間

## 什麼時機該做快取

### 1. 資料取得速度較慢

{% darrellImage appscript_get_data_from_sheet_and_transform_json appscript_get_data_from_sheet_and_transform_json.jpg max-400%}

資料存在 Google Sheet 中，要使用時通常都會先轉成 Json Object
這個轉換的過程其實有點久，而每次取資料都要等一次這個轉換

那如果學會了快取，就可以把資料轉換後直接存起來
往後要用時就直接拿取已經轉好的資料

這就像是我們買了幾把蔥回家
每次煮飯時都只切自己需要的蔥花或蔥白時就很麻煩
要是我們一開始就把蔥都切好，並且放在容易取得的地方
這一陣子煮菜要取蔥時都非常方便


### 2. 資料不常更新

{% darrellImage appscript_which_data_fit_for_cache appscript_which_data_fit_for_cache.jpg max-400%}

如果做快取好處那麼多
為什麼還要判斷資料的更新頻率呢?

那是因為如果你的場景對資料的時效性要求很高
例如: 股票資料
你總不希望每次打開時，顯示的資料是幾分鐘前的快取對吧

所以如果你的需求是即時的資料且要求資料正確
那快取可能就沒有那麼適合

反之如果你的資料幾個小時或隔一陣子才需要更新
而中間這段期間都只需要檢視資料
那快取就會省下很多時間和效能

### 3. 測試 API 時的小訣竅

這是網友提醒我的
測試 API 時如果遇到對方有讀取限制
舉例嚴格一點: 一小時內只能10次
但我們開發時常常會一邊開發一邊測試
我們總不可能改一改超過 10 後，就需要發呆等待 1 小時的限制

而且，往往我們根本只需要同一個 Response 的資料，
重打 API 只是因為重新 run 程式
那這時把 API 的 Response 做快取
就能用一樣的資料一路測試到我們開發完成為止

我自己也常常這樣使用，畢竟等 API 回傳資料通常也要一秒鐘左右或更久
這也是一個相對加速開發的方法!

## 如何用 CacheService

AppScript 有提供自己的快取方式
只要使用 CacheService 即可，不用特別開啟什麼額外的功能

附上 Google 官方文件 [CacheService](https://developers.google.com/apps-script/reference/cache)

快取的方式其實蠻簡單

{% darrellImage appscript_cache_method appscript_cache_method.png max-800%}

這邊想先聲明: **下面提到的 key 比較不像鑰匙的概念**
而是一個編號，或是一個索引
**比較像是你寫在便利貼上的一個名稱或是標籤機印出來的標籤**
然後貼在置物櫃上，你看到就會知道裡面裝了什麼東西

{% darrellImage appscript_cache_method_demo appscript_cache_method_demo.gif max-800%}

### get(key) 用 key 去取得資料
這邊可以想像健身房或是旅遊時的置物櫃
一格一格，每一格都有一個編號
而編號的產生是我們放資料進去時決定的

### put(key, value, expirationInSeconds)
用上面的例子思考
put 就是我們放資料進去，並且決定放在哪一格
然後我們設定一個編號
之後就用這個編號去換資料回來
value 就是我們要放進去的資料
expirationInSeconds 是快取的過期時間(秒)
就像食物都有保存期限，快取的資料也都會有這個過期時間
如果你沒有設定的話，預設是 10 分鐘
最久可以到六小時

### putAll(values, expirationInSeconds)
進階的方式也可以一次分入的多個 key & value
官網的範例:
```javascript
// Puts a set of values into the cache with the keys 'foo', 'x', and 'key'.
const values = {
  foo: 'bar',
  x: 'y',
  key: 'value',
};
CacheService.getUserCache().putAll(values, 20);
```

那這樣其實就等於
```javascript
CacheService.getUserCache().put('foo', 'bar', 20);
CacheService.getUserCache().put('x', 'y', 20);
CacheService.getUserCache().put('key', 'value', 20);
```
只是可以少寫很多行程式?!
有大量資料要快取時也很方便

### remove(key)
按照編號把快取的資料刪除

### removeAll(keys)
直接用程式碼示範兩個的差異

```javascript
CacheService.getUserCache().removeAll(['foo', 'x', 'key']);
// 就會等於
CacheService.getUserCache().remove('foo');
CacheService.getUserCache().remove('x');
CacheService.getUserCache().remove('key');
```

## 使用的成效

我使用的案例:

在大約有一千多行，7欄的 Google Sheet 中
撈取前面 50 筆資料，並利用 doGet 呈現到前端

沒有快取時: 每次執行時間大約 1.5-2.0 秒
啟用快取後: 每次執行時間大約 0.4-0.5 秒

**速度提升 3-4 倍!**

{% darrellImage appscript_cache_method_performance appscript_cache_method_performance.png max-800%}

### 速度提升的好處

Google App Script 雖然方便好用，但執行的速度向來不快
而且根據最新的文件提到的限制
**有每次執行時間不能多於 6 分鐘的限制**

那快取就是一個很棒的方式來解決這個問題
不只能提升使用者的體驗，也能避免因為執行時間過長而導致執行失敗
一舉兩得!

歡迎提供更多適合做快取的情境或案例讓大家參考
