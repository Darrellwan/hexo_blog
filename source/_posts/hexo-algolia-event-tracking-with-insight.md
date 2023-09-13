---
title: Hexo Algolia 利用 Insight 來追蹤搜尋和點擊事件
tags:
	- Hexo
	- Algolia
categories: 
	- Hexo
page_type: post
description: 在 Hexo 的 Algolia 中啟用內建的 insight 來追蹤相關的搜尋、點擊的行為
---

{% darrellImageCover algolia_event_tracking_in_insight_bg algolia_event_tracking_in_insight_bg.png max-800 %}


## 在 Hexo 中啟用 Insight

在 Hexo 或是其他的網頁利用 JS 來安裝 Algolia 時，會有一段類似下方的 code

```=javascript
let search = instantsearch({
  indexName,
  searchClient  : algoliasearch(appID, apiKey),
  searchFunction: helper => {...},
  routing: {...},
  insights: {
    insightsInitParams: {
      useCookie: true,
    },
  },
});
```

文件有提到這個 `insights` 的啟用在 v4.55.0 版本以上才能使用

{% darrellImage800 algolia_document_insight_object algolia_document_insight_object.png max-800 %}

但其實這邊文件也沒有提供更新的資訊，其實可以像是上方的程式一樣直接使用 `insightsInitParams` 參數並啟用 `useCookie`

{% darrellImage800 algolia_document_insight_init_with_object algolia_document_insight_init_with_object.png max-800 %}

## 如何檢查自己目前使用的 Algolia JS Library 版本

按照上方的文件，總共會有兩個 JS Library 需要確認

打開網站的 Chrome Devtool (如使用其他瀏覽器，流程類似)
切換到 network 並搜尋下面的關鍵字

**algoliasearch** 

需要在 4.55 版本以上

{% darrellImage800 check_algolia_version_in_devtool check_algolia_version_in_devtool.png max-800 %}

**instantsearch** 

需要在 4.11 版本以上

{% darrellImage800 check_instantsearch_version_in_devtool check_instantsearch_version_in_devtool.png max-800 %}

## 啟用完成，檢查是否已經發出 event

到這邊其實就啟用完成了，整個過程如有版本上沒有遇到問題，那應該會非常快速
如果像是這裡使用 cdn 的方式取得 JS Library，沒有寫入固定版本的話通常都會吃到最新的版本
特別設定下方程式碼的原因是，預設是關閉的

文件上提到為了配合歐洲 GDPR 的規範，除非拿到 Cookie Consent 才能啟用這個設定，否則就會無法追蹤這些行為
```
    insightsInitParams: {
      useCookie: true,
    },
```

再來就可以開始從 Algolia 後台檢查是否有收到事件了!

{% darrellImage800 check_algolia_events_in_platform check_algolia_events_in_platform.png max-800 %}

也可以從 Devtool 的 Request 來檢查

在 network 的欄位輸入 **insights.algolia.io**

{% darrellImage800 check_algolia_events_in_devtool check_algolia_events_in_devtool.png max-800 %}


## 啟用事件追蹤的好處

事件的追蹤除了可以在後台看到一些使用的狀況外，有一些 Algolia 的進階功能是需要這些資料來進行學習的

例如這個 Algolia Recommend，就會在文件中提到需要的近90天至少需要的事件數

[Algolia_文件_Algolia Recommend](https://www.algolia.com/doc/guides/algolia-recommend/overview/#events-requirements-for-the-models)

{% darrellImage800 algolia_recommend_requirement algolia_recommend_requirement.png max-800 %}


