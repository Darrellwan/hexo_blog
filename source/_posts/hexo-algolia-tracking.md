---
title: Hexo Algolia 心得 和GTM實作追蹤站內搜尋事件
date: 2022-10-27 21:22:15
tags:
	- Hexo
    - Algolia
	- Google Tag Manager
description: 終於也使用了 Algolia 來當作這個網站的搜尋引擎，雖然他有支援一些 UA 的追蹤，還是想把他的 DataLayer 如何實作寫出來，讓需要的人可以客製自己的 search dataLayer 來使用
categories: 
	- Hexo
page_type: post

---
{% darrellImageCover hexo_algolia_tracking_cover ./hexo_algolia_tracking_cover.webp %}


## 選用 Algolia

目前看過一些 Hexo 前輩的分享，大概就是分為 local 做 index 索引的方式或是直接使用像是 Algolia 這種服務，評估後再流量不大的情況下有免費的版本可以使用。
相對划算且方便，未來真的如果需要自己實作或轉移服務，也會更了解需要注意到哪些細節。

## 在 Hexo 安裝 Algolia

這在網路上已經有相對大量的教學，就不再重新贅述一次。
我自己是參考這邊文章來安裝的

[將Hexo NexT 改成Algolia 搜尋 - 是Ray 不是Array](https://israynotarray.com/hexo/20191225/2266233686/)

但這篇主要是講解使用 `hexo-algoliasearch` 這個套件來安裝
其實還有另一個是 `hexo-algolia`
有興趣的人可以研究一下兩者差異，印象中是 `hexo-algolia` 支援的索引範圍不太一樣

這邊的索引機制和碰過 Database 對某個 field 做 index 的方式算是類似的
就是把部分的資料全部蒐集起來，並放在相對速度較快的地方使用較厲害的演算法，在最短的時間內找到相對應的內容

像是你要對文章標題搜尋關鍵字，當然也可以自己寫 JS 實作
```javascript
let posts = [{
    title: "文章標題",
    link: "文章連結",
    // ...其他需要的欄位
}];
let keyword = "使用者輸入的關鍵字";

let findPostFromKeyword(keyword){
    // 對 posts 各種迴圈然後回傳跟關鍵字有關的文章
}
```

其實水應該是很深，因為還要判斷一些無效字元像是 "a" "the" ... 等等

## 安裝注意事項 : Algolia AdminAPI Key 的保護

一開始照著教學做都沒什麼問題，
沒想太多就部署上去了，結果過沒多久就收到一封精美的信:

{% darrellImage gitguardian_remind_admin_key gitguardian_remind_admin_key.webp %}

**一個不小心把 algolia 的 admin API key 推上去啦!**
通常這種事情可大可小，基本上使用一個服務都會有一些相對應的 key。
每個 key 的權限也不太一樣，
嚴重與否的判斷通常對我來說有個準則:
admin 這種的或是你也一時之間搞不太懂這 key 可以幹嘛的
就不要讓他進去版本控制 (git github gitlab) 都算
Github 比較麻煩是因為只要是公開的 Repository 其實大家都看得到
也就是説大家都知道你的 key 啦
{% darrellImage meme_leaked_information meme_leaked_information.jpeg %}

這邊的做法是將 Hexo 原先的 config 設定檔拆成一個主要的和另一個儲存敏感資料的
後續會有另一篇專門在說這該怎麼做到的

## Algolia 推送 DataLayer

Algolia 在搜尋時可以看到目前預設的版型是
在彈出的視窗中 輸入 關鍵字後
會很快的顯示搜尋到比對成功的資訊

在追蹤的定義來說 : **使用者完成了一個搜尋的動作**

這樣的使用流程在追蹤上來說真的算是蠻困難的
因為網址也沒有變化，也沒有按下什麼搜尋的按鈕可以監聽

搜尋後發現官方的文件中就有教學該怎麼運用 GTM 的 DataLayer
[官分文件 Plug with Google Tag Manager (GTM)](https://www.algolia.com/doc/api-reference/widgets/analytics/js/#plug-with-google-tag-manager-gtm)
{% darrellImage algolia_document_shows_datalayer algolia_document_shows_datalayer.webp %}

在 Hexo 的專案資料夾找到這隻 JS 檔案

| 相對路徑 : themes/next/source/js/algolia-search.js

{% darrellImage code_algolia_datalay code_algolia_datalay.webp %}

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
    'event': 'algolia_search',
    'keyword': state.query, // 搜尋的關鍵字
    'facet_parameters': formattedParameters,
    'number_of_hits': results.nbHits, // 搜尋結果數
    'process_time_ms' : results.processingTimeMS // 搜尋時間
});
```

DataLayer 裡面的內容我有稍微改過，主要就是把處理時間也加了進來
有興趣也可以把 state 跟 results 這兩個變數 console 出來看看裡面還有哪些內容

## 實作 GA4 的 search 事件

[GA4 devguides-Search](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#search)

GA4 在文件上推薦的事件為 `search` 用來表示搜尋
也可以看到推薦的參數名稱為 `search_term`
{% darrellImage ga4_recommend_search ga4_recommend_search.webp %}

所以在 GTM 的設定就相對單純

建立對應的 **Trigger**
{% darrellImage gtm_search_trigger gtm_search_trigger.webp %}

然後建立一個 **GA4 event tag**
{% darrellImage gtm_search_tag gtm_search_tag.webp %}
這邊多了兩個參數是用來追蹤 datalayer 有提供的搜尋結果數 和 搜尋消耗的時間
一個可以幫助我們分析說都搜尋不到結果的搜尋字詞
是不是因為我們下的字眼和使用者的預期不符合

第二個是如果搜尋時間拉長了，是否因為 index 過後的量開始累積變大
讓 Algolia 的反應時間變慢了，並針對這個狀況來優化

|待後續資料進入 GA4 再放上報表的截圖供參考