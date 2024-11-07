---
title: 利用 Google App Script 串接 Threads API 並且用 Looker Studio 視覺化
tags:
  - Google App Script
  - API Integration
  - Looker Studio
categories:
  - Google App Script
page_type: post
id: google-app-script-threads-api
description: Threads API 串接不麻煩，用 Google App Script 來處理，存到 Google Sheet 後，用 Looker Studio 來視覺化
bgImage: GAS-ThreadsAPI-LookerStudio_bg.png
preload:
  - GAS-ThreadsAPI-LookerStudio_bg.png
date: 2024-11-05 14:27:20
---

<style>
  .post-body a {
    color: #68c8ff;
  }
</style>

## Meta 推出 Threads API

{% darrellImageCover GAS-ThreadsAPI-LookerStudio_bg GAS-ThreadsAPI-LookerStudio_bg.png max-800 %}

Threads API 已經推出一段時間，各路大神也都分享過很多串接經驗
甚至有一些對應的分析產品推出

像是 [Threadslytics](https://tw.threadslytics.com/)
{% darrellImage threadslytics threadslytics.png max-800 %}

除了有資料分析外，還有排程貼文的服務
有需要的朋友如果想要穩定好用，可以參考看看

最近比較有點空閒的時間，就想利用 Cursor 來嘗試看看利用 AI 的助力開發
個人用的類似分析工具，簡單的把資料撈回來並且搭配熟悉的 Looker Studio 視覺化

---

## Threads API 的準備

Threads API 的申請和文件 [Threads API 官方文件](https://developers.facebook.com/docs/threads/)
由於網路上蠻多類似的中文資源了，這邊就不想重新贅述一次
但可以提供一些詳細的資訊:

1. Threads - <a href="https://www.threads.net/@alfonsoho1995/post/DBWT2smyav_"><i class="fa-solid fa-link"></i><span> Alfonso 的 10 篇連載 </span></a>
{% darrellImage threads_alfonso_teach_threads_api threads_alfonso_teach_threads_api.png max-800 %}

2. 利用發佈不久的 ChatGPT search 功能查詢: 
[對話連結](https://chatgpt.com/share/6729dbc6-aaf0-800c-a143-2f4eb763bddf)
{% darrellImage use_search_gpt_to_find_threads_api_integration use_search_gpt_to_find_threads_api_integration.png max-800 %}

3. 使用 Perplexity Pro 的查詢:
[對話連結](https://www.perplexity.ai/search/qing-jiao-wo-zen-mo-shen-qing-DbbkHE1SSiW.7CNS2Hh0WQ#0)
{% darrellImage use_perplexity_pro_to_find_threads_api_integration use_perplexity_pro_to_find_threads_api_integration.png max-800 %}

上面的搜尋對話都可以接著繼續往下查詢
如果有遇到問題或是卡住的地方
歡迎到 IG 這邊私訊聊聊
[darrell_tw_](https://www.instagram.com/darrell_tw_/)

---

## Google App Script 串 Threads API

### 主要 main function

```
function updateAllThreadsData() {
  if (DEV_MODE) {
    Logger.log('=== 開始全部數據更新流程 ===');
    Logger.log('時間：' + new Date().toISOString());
  }
  
  try {
    // 1. 更新所有貼文的數據
    if (DEV_MODE) Logger.log('1. 開始更新貼文數據');
    getAllPostStats();
    
    // 2. 更新每日用戶數據
    if (DEV_MODE) Logger.log('2. 開始更新每日用戶數據');
    getUserInsights();
    
    // 3. 更新追蹤者數據
    if (DEV_MODE) Logger.log('3. 開始更新追蹤者數據');
    updateFollowersCount();
    
    if (DEV_MODE) {
      Logger.log('=== 全部更新流程完成 ===');
      Logger.log('完成時間：' + new Date().toISOString());
    }
    
  } catch (error) {
    Logger.log('更新過程發生錯誤：', error);
    throw error;
  }
}
```

程式碼大部分都是請 Cursor AI 幫忙，我自己只有做點調整
但我有特別說明的 prompt 有:

1. 加上 DEV_MODE，讓我在執行除錯時可以顯示盡量詳細的 log，如果有預期外的錯誤或是停住，至少可以知道目前執行到哪裡
2. 加上 try catch，未來有需要可以對錯誤做其他處理

主要執行的邏輯有三段:

1. 更新所有貼文的數據
2. 更新每日用戶數據
3. 更新追蹤者數據

### 更新貼文數據

#### 取得所有貼文

```
const url = `https://graph.threads.net/v1.0/me/threads?fields=id,shortcode,timestamp,text,is_quote_post,media_type,permalink&access_token=${ACCESS_TOKEN}`;

const response = UrlFetchApp.fetch(url, {
  method: "GET"
});
```

`取得所有貼文的回傳資料`
{% darrellImage threads_api_all_post_data threads_api_all_post_data.png max-800 %}


要使用 Threads API 表示我們需要能夠發送一個 request 過去
Google App Script 不像一般的 JavaScript 有內建的 fetch API，所以需要使用 UrlFetchApp
其實用法非常接近，只是就記得需要使用 `UrlFetchApp` 就好

後續就是處理 Response 
```
const contentText = response.getContentText();
const data = JSON.parse(contentText);

const postsWithInsights = data.data.map(post => {
  Logger.log(`正在獲取貼文 ${post.id} 的指標數據`);
  const insights = fetchPostInsights(post.id);
  // 這邊是取得單一貼文的表現數據，下面會提及
  // 取得數據後會再跟原本的貼文資料做合併

  const postWithInsights = { 
    ...post,
    insights 
  };    
  return postWithInsights;
});
```

#### 再取得單一貼文數據

這邊有個邏輯是上面的 API 要先取得所有的貼文 id, text
但沒有數據，
數據需要使用另外一個 `{postId}/insights` API 去取得

```
const METRICS = ['views', 'likes', 'replies', 'reposts', 'quotes', 'shares'];
const postStatsUrl = `https://graph.threads.net/v1.0/${postId}/insights?metric=${METRICS.join(',')}&access_token=${ACCESS_TOKEN}`;

const response = UrlFetchApp.fetch(postStatsUrl, {
  method: "GET"
});

const data = JSON.parse(response.getContentText());
if (!data || !data.data) {
  throw new Error('API 回應格式錯誤');
}

const insights = {
  views: 0,
  likes: 0,
  replies: 0,
  reposts: 0,
  quotes: 0,
  shares: 0
};

data.data.forEach(metric => {
  if (metric.values && metric.values.length > 0) {
    insights[metric.name] = metric.values[0].value || 0;
  } else if (metric.total_value) {
    insights[metric.name] = metric.total_value.value || 0;
  }
});
```
`取得單一貼文的回傳資料`
{% darrellImage threads_api_single_post_stats threads_api_single_post_stats.png max-800 %}

如果對上面的概念有點模糊，可以參考這個示意圖
{% darrellImage threads_api_concept_post_stats threads_api_concept_post_stats.png max-800 %}
到這邊為止，就處理貼文的數據部分
算是完成了三分之一
接下來要繼續處理用戶數據

### 更新每日用戶數據

[取得用戶數據 API 文件](https://developers.facebook.com/docs/threads/insights#user-insights)
{% darrellImage doc_threads_api_user_insights doc_threads_api_user_insights.png max-800 %}

用戶數據部分的指標有一些不直覺的地方
瀏覽數 Views 會是一天一天的資料
其他的都是時間區間內的總數
另外 followers_count 和 follower_demographics 不支援 since & until 的參數
代表無法取得以前的資料，只會拿到目前最新的數據

這邊用兩張圖來呈現概念
{% darrellImage doc_threads_api_user_insights_explain doc_threads_api_user_insights_explain.png max-800 %}
{% darrellImage doc_threads_api_user_insights_explain_image doc_threads_api_user_insights_explain_image.png max-800 %}

腦中如果有這些資料代表什麼意思，那後續就會更知道要怎麼處理和整理資料了

```
    // 取得日期範圍（今天往前30天）
    const days = DEV_MODE ? 10 : 30;
    const dates = [];
    for (let i = 0; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
```
首先，要決定往前處理幾天的資料
DEV_MODE 是為了快速除錯測試，只會處理 10 天
正式環境就處理 30 天

```
// 處理每一天的數據
    dates.forEach((date, index) => {
      const dateStr = Utilities.formatDate(date, 'GMT+8', 'yyyy-MM-dd');
      const startTime = Math.floor(date.setHours(0, 0, 0, 0) / 1000);
      const endTime = startTime + (24 * 60 * 60) - 1;
      
      const url = `https://graph.threads.net/v1.0/me/threads_insights?metric=views,likes,replies,reposts,quotes,followers_count&since=${startTime}&until=${endTime}&access_token=${ACCESS_TOKEN}`;
      const response = UrlFetchApp.fetch(url, {
        method: "GET",
        redirect: "follow",
        muteHttpExceptions: true
      });
      const data = JSON.parse(response.getContentText());
      const metrics = {
        views: 0,
        likes: 0,
        replies: 0,
        reposts: 0,
        quotes: 0
      };

      data.data.forEach(metric => {
        if (metric.values && metric.values.length > 0) {
          metrics[metric.name] = metric.values[0].value || 0;
        } else if (metric.total_value) {
          metrics[metric.name] = metric.total_value.value || 0;
        }
      });
    //...
      // 避免 API 請求過於頻繁
      Utilities.sleep(200);
    })
```

取得每一天的 start time 和 end time 的 timestamp
帶入 API 並取得資料，並注意 API 請求的速率，這邊降低為 200ms，也就是一秒鐘 5 次
雖然文件沒有提及 Meta 有限制，但友善的 call API 從你我做起

取得資料後整理為 Google Sheet 需要的格式存入即可

### 更新每日追蹤者數的成長

如上面概念圖片提到，追蹤者數的成長是無法溯及以往的資料
只能從開始撈的當下開始記錄
例如從 11/01 開始撈，當天的追蹤者數是 1500
那就是從 1500 開始累積紀錄了
可能到 12/01 會是 3000

邏輯就跟使用者數據一樣，處理上簡單很多，就只要處理 followers_count 即可
```
    const followersUrl = `https://graph.threads.net/v1.0/me/threads_insights?metric=followers_count&access_token=${ACCESS_TOKEN}`;
    const followersResponse = UrlFetchApp.fetch(followersUrl, { muteHttpExceptions: true });
    const followersData = JSON.parse(followersResponse.getContentText());

    followersData.data.forEach(metric => {
      if (metric.name === 'followers_count' && metric.total_value) {
        followersCount = metric.total_value.value || 0;
      }
    });
```

## Looker Studio 視覺化 Threads API 資料

{% darrellImage looker_studio_shows_threads_data looker_studio_shows_threads_data.png max-800 %}

Looker Studio 視覺化，只需要使用 Google Sheet 就好
另外這份報表也沒有用到太多進階的功能

我是把資料存成三個 tab:
一個存貼文資料
一個存用戶數據
一個存追蹤者數據
{% darrellImage google_sheet_with_data google_sheet_with_data.png max-800 %}

目前 Looker Studio 的資料只有呈現用戶數據和追蹤者數量
貼文數據未來會放入，但不想單純放上 table 而已
{% darrellImage looker_studio_with_source looker_studio_with_source.png max-800 %}

現階段的小目標是想把這份 Looker Studio 整理一下並且讓它可以被重複使用
預想是大家複製過去後，在接上自己的 Google Sheet 就完成

用一個簡短的範例介紹如何拉其中一張圖表

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1027172231?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Looker Studio 新增 Time Series Chart 呈現 Threads 資料"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
