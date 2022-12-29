---
title: Google Analytics 4 Data API - Google App Script 使用 API 的 Filter 篇
tags:
  - Google Analytics 4
  - Google App Script
  - Google Analytics Data API
categories:
  - Google Analytics 4
page_type: post
date: 2022-12-28 23:33:53
description: 在一個特別的需求下，需要將資料by一個區間下載，於是乎想要直接串 GA4 的 Data API 將資料存到 Google Sheet 中，但第一次使用時再使用 Filter 遇到了蠻大問題，想要在這裡記錄下來解法，未來能夠回來翻以外還能繼續有新的寫法，畢竟整個 Data API 都還在 Beta 階段，未來都還有被調整的空間。
---

{% darrellImageCover GA4_Data_API_在Google_App_Script的Filter使用 ga4_data_api_google_app_script_filter.webp max-800 %}

## 在 Google App Script 中使用 GA4 Data API

開啟一個新的 Google App Script
左邊側欄找到 服務
新增 Google Analytics Data API (這隻 API 才可以跑報表，另一隻 admin API 比較像是讓你檢查帳戶和資源設定等等)

{% darrellImage800 在GoogleAppScript啟用GA4_Data_API_服務 ga4_dataapi_service_enable_in_google_app_script.png max-800 %}

啟用後，就可以在程式碼中開始直接使用 Data API 了，用 Google App Script 的寫法好處就是
不用處理過多複雜的驗證和授權
只要是用來執行程式的帳戶是有需要的 GA4 帳戶的權限，就可以順利取得資料

## AnalyticsData 的使用

這邊先提供一個概念
我們在探索報表 (Explorer) 或是修改了什麼自訂義報表，是沒辦法直接用 API 去調那個報表的資料
必須**利用程式重新組合一個報表的需求**

提供你要的資料維度(Dimension)
資料指標(Metric)
和加上如果有需要的過濾器(Filter)
並重新跑一份報表，執行的 function 就叫做 runReport

最後 API 才會回傳給你這份報表的資料
這和一開始很多人的期待和想像不太一樣
不過一但有這個概念後，使用起來就會簡單不少

如果想先參考官方的文件可以看這篇
[Google : Analytics Data Service](https://developers.google.com/apps-script/advanced/analyticsdata)

---

### propertyId

```
const propertyId = 'YOUR-GA4-PROPERTY-ID';
```

這邊的 GA4 Property ID 如果不確定在哪
可以到 GA4 管理(Admin) 
資源設定
右邊就有出現 ID 並且可以直接複製

{% darrellImage800 從GA4_Admin_尋找PropertyId ga4_get_property_id_in_admin.png max-800 %}

### dimension, metric, dateRange

```javascript
const metric = AnalyticsData.newMetric();
metric.name = 'activeUsers';

const dimension = AnalyticsData.newDimension();
dimension.name = 'city';

const dateRange = AnalyticsData.newDateRange();
dateRange.startDate = '2020-03-31';
dateRange.endDate = 'today';
```

這裡的三個變數對應到的是報表的三個地方

{% darrellImage800 GA4_維度指標時間區間 ga4_dimension_metric_daterange.png max-800 %}

這邊就是看使用者對於 Google Analytics 4 或舊版 UA 維度指標的熟悉程度了

簡單的舉例的話
- 維度 : 身高 , 指標 : 公分
- 維度 : 體重 , 指標 : 公斤

要注意維度跟指標不能混搭，你選身高配公斤，他可能就會跑不出資料

需要多個維度或指標的話只要多 new 一些需要的即可

```javascript
 const dimension = AnalyticsData.newDimension();
dimension.name = 'pagePathPlusQueryString';

const dimensionTitle = AnalyticsData.newDimension();
dimensionTitle.name = "pageTitle";
```

### request and runReport

```
const request = AnalyticsData.newRunReportRequest();
request.dimensions = [dimension];
request.metrics = [metric];
request.dateRanges = dateRange;

const report = AnalyticsData.Properties.runReport(request,
    'properties/' + propertyId);
if (!report.rows) {
  console.log('No rows returned.');
  return;
}
```

這段就是把上面的要的維度跟指標組合過後
請 GA4 透過 API 幫我們 **跑一份報表(runReport)**
並得到一份資料後，判斷有沒有資料 `if (!report.rows)`

至於要怎麼使用這份資料，
這裡的舉例為將資料寫入 Google Sheet 中

## 寫入 Google Sheet

### 創建一個新的 Google Sheet

這兩行便是他會創造一個新的 Google Sheet 檔案，名稱為 `Google Analytics Report`

```javascript
const spreadsheet = SpreadsheetApp.create('Google Analytics Report');
const sheet = spreadsheet.getActiveSheet();
```

### 將資料組合為二維陣列並寫入 Sheet

這裡主要就是將報表的資料中，
header 取出來變成一個陣列
後續的資料取出來變成一個陣列

大致上資料為
`header = ["city", "activeUsers"]`
`rows = [["taipei", 10], ["taichung", 20]]`

範例，和真實資料有點區別

`sheet.appendRow(headers);`
就會把 header 裡面的資料寫入 Sheet 的第一行

```javascript
// Append the headers.
const dimensionHeaders = report.dimensionHeaders.map(
    (dimensionHeader) => {
      return dimensionHeader.name;
    });
const metricHeaders = report.metricHeaders.map(
    (metricHeader) => {
      return metricHeader.name;
    });
const headers = [...dimensionHeaders, ...metricHeaders];

sheet.appendRow(headers);

// Append the results.
const rows = report.rows.map((row) => {
  const dimensionValues = row.dimensionValues.map(
      (dimensionValue) => {
        return dimensionValue.value;
      });
  const metricValues = row.metricValues.map(
      (metricValues) => {
        return metricValues.value;
      });
  return [...dimensionValues, ...metricValues];
});
```

最後這段程式碼就是將上面的資料們寫入 Google Sheet 中
```javascript
sheet.getRange(2, 1, report.rows.length, headers.length).setValues(rows);
```

### 注意事項 

這個範例主要的流程就是
1. 設定 GA4 報表 **維度 指標 區間**
2. 建立 Google Sheet
3. 寫入 Google Sheet

所以每跑一次就會新增一份 Google Sheet, 一開始執行時需要小心
如果是想要每次都寫入同一份 Sheet 並取代，則需要修改最後 Google Sheet 的部分

## 如何在 GA4 Data API 過濾資料

上面的範例中並沒有提及如何使用過濾的功能
所以經歷過一陣子的 Google 查詢和 Stackoverflow 後
終於拚湊出了一個符合需求的寫法
`但很有可能其實有更好的寫法，未來發現後會即時更新在這`

### dimensionFilter

前三行就是宣告一個主要的 dimensionFilter 變數
創造一個 list 後宣告一個空陣列，
因為稍後會新增多個條件在裡面
這邊是用 AND 來做範例，如過要用 OR
就改成 `orGroup` 即可

5 - 18 行部分
就是有三個條件，寫成一個 array 後利用程式組合成一堆 filterExpression

20 - 33 行部分是比較麻煩的地方
我們在探索報表可以選 `not contains`
但其實在 API 中並沒有這種運算子可以使用
只能宣告成 `nonExpression` 當作排除，算是一個很意外的 point

所以在這目前看似不完美的寫法下
就是將 contain and not contain 整個拆成兩個部分
感覺應該要有更精簡的寫法才對

```javascript
const dimensionfilter = AnalyticsData.newFilterExpression()
dimensionfilter.andGroup = AnalyticsData.newFilterExpressionList()
dimensionfilter.andGroup.expressions = []

let conditions = [
  { fieldName: "pagePathPlusQueryString", operator: "CONTAINS", value: "gtm" },
  { fieldName: "pagePathPlusQueryString", operator: "CONTAINS", value: "Google-Tag-Manager" },
  { fieldName: "pagePathPlusQueryString", operator: "PARTIAL_REGEXP", value: ".*(Google-Tag-Manager|gtm|ga4).*" },
];
for (const condition of conditions) {
  const filterExpression = AnalyticsData.newFilterExpression()
  filterExpression.filter = AnalyticsData.newFilter()
  filterExpression.filter.fieldName = condition.fieldName;
  filterExpression.filter.stringFilter = AnalyticsData.newStringFilter();
  filterExpression.filter.stringFilter.value = condition.value;
  filterExpression.filter.stringFilter.matchType = condition.operator;
  dimensionfilter.andGroup.expressions.push(filterExpression)
}

let notConditions = [
  { fieldName: "pagePathPlusQueryString", operator: "CONTAINS", value: "gtm_debug" },
  { fieldName: "pagePathPlusQueryString", operator: "CONTAINS", value: "fbclid" },
];
for (const condition of notConditions) {
  const filterExpression = AnalyticsData.newFilterExpression()
  filterExpression.notExpression = AnalyticsData.newFilterExpression()
  filterExpression.notExpression.filter = AnalyticsData.newFilter()
  filterExpression.notExpression.filter.fieldName = condition.fieldName;
  filterExpression.notExpression.filter.stringFilter = AnalyticsData.newStringFilter();
  filterExpression.notExpression.filter.stringFilter.value = condition.value;
  filterExpression.notExpression.filter.stringFilter.matchType = condition.operator;
  dimensionfilter.andGroup.expressions.push(filterExpression)
}
```

## 結論跟補充

寫完一次後會發現，用 GA4 Data API 去產報表跟從介面上報表的難易度
大概有差五倍以上

尤其是過濾的條件上要怎麼寫真的是一大挑戰
不過寫成 API 的好處真的蠻多的

有時候需求是產生每個月的報表，但如果只用月當維度去拆資料又會造成資料不精準的情況下
就需要逐月的拉報表，此時用 API 設定一下區間就可以快速取得大量報表

或是拉出來的資料需要加以運算或處理
與其慢慢的匯出報表再寫 python 處理，不如一開始匯出時就處理完再寫入 Google Sheet

### 指標維度的中英對照

需要補充的點是
如果是中文版用戶
在找指標跟維度應該會蠻痛苦的

請到這個官方文件網頁
[API 維度與指標](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
找到想要的維度後，在找到其英文的版本
用中文會報錯!

