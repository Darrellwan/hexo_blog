---
title: n8n Merge 節點教學-解決多來源資料合併的問題
tags:
  - n8n
  - n8n節點介紹
  - n8n教學
categories:
  - n8n
page_type: post
id: n8n-merge-node
description: n8n Merge 節點完整教學！學會 Append、Combine、Choose Branch、SQL Query 選項的差異，深入了解 Matching Fields、Position 和 All Possible Combinations 的用法
bgImage: blog-n8n-merge-node-bg.jpg
preload:
  - blog-n8n-merge-node-bg.jpg
date: 2025-10-27 21:02:29
---

## 快速導覽

{% quickNav %}
[
  {
    "text": "什麼時候該用 Merge？",
    "anchor": "什麼時候該用-Merge-節點？",
    "desc": "從實際場景理解 Merge 的應用時機"
  },
  {
    "text": "Merge 模式選擇",
    "anchor": "Merge-模式選擇",
    "desc": "Append、Combine、SQL Query、Choose Branch 完整說明"
  }
]
{% endquickNav %}

## 什麼時候該用 Merge 節點？

**為什麼需要 Merge？**
最直觀的例子就從不同的地方搜集資料，然後合併在一起處理
下面用兩個場景來舉例：

### 場景 1：從多個平台抓取任務清單

例如工作清單散落在 Trello、Asana、Notion 三個平台
想要每天早上把三個平台的待辦事項整合成一份清單
一起發送 Slack 通知給自己

{% darrellImage800 n8n_merge_node-example1_notion_asana_trello_slack n8n_merge_node-example1_notion_asana_trello_slack.png max-800 %}

- Trello 回傳 10 筆、Asana 回傳 5 筆、Notion 回傳 8 筆
- 用 **Merge (Append 模式)** 把三個平台的任務堆疊成一個清單（共 23 筆）
- 用 **Aggregate 節點**將 23 筆任務聚合成一筆訊息
- 最後發送到 Slack
**使用模式：Append**

### 場景 2：客戶資料要對應他的訂單記錄

1. 電商訂單列表 : (user_id + 訂單資訊)
2. 客戶列表 : (user_id + 客戶資訊)

這時候就可以用 Merge 來把兩份資料合在一起
由於兩者都有 **user_id** 欄位可以當作合併的 `key`

就可以用 Combine 模式搭配 Matching Fields 來合併

{% darrellImage800 n8n_merge_node-example2_sheet_order_member_data n8n_merge_node-example2_sheet_order_member_data.png max-800 %}

## Merge 模式選擇

### Append

`Append` 的效果為將不同的資料堆疊在一起，跟合併不太一樣

例如有兩個資料陣列是
`["a", "a", "a"]`
`["b", "b", "b"]`

如果用 `Append` 合併，會得到
`["a", "a", "a", "b", "b", "b"]`

可以想像成把兩條隊伍整合成一條更長的隊伍！

{% darrellImage800 n8n_merge_node-use_append_example n8n_merge_node-use_append_example.png max-800 %}

### Combine

Combine 和 Append 就不太一樣了
如果說 Append 是將兩條隊伍整合成一條更長的隊伍
那 Combine 就是將兩條隊伍合併兩兩一排，但長度維持一樣

示意圖如下：
{% darrellImage800 n8n_merge_node-explain_append_combine n8n_merge_node-explain_append_combine.jpg max-800 %}

而 Combine 又有幾種組合的模式可以選！

#### Matching Fields

`Matching Fields` 就是會把欄位根據 key 做對應合併
以前面的舉例二來說：
訂單和會員的資料根據 `user_id` 做對應合併

這樣就能同時知道每一筆訂單的會員資料是什麼

{% darrellImage800 n8n_merge_node-use_matching_field_example n8n_merge_node-use_matching_field_example.png max-800 %}

比較好的情況就是兩份資料都有欄位叫做 `user_id`
這樣直接用 `user_id` 合併就行

不過有時候會是不同的欄位名稱，例如：
訂單的 `user_id` 叫做 `customer_id`
這樣一樣可以先選 `Matching Fields` 
然後勾起 `Fields To Match Have Different Names` 
也就是說：**可以用這兩個不同的欄位名稱合併** 

{% darrellImage800 n8n_merge_node-Fields_To_Match_Have_Different_Names n8n_merge_node-Fields_To_Match_Have_Different_Names.png max-800 %}


#### Position

`Position` 就是會把兩份資料按照**順序**合併在一起
其實跟前面的示意圖展示的很像
例如：
資料A : [{"green":"🟢"}, {"green":"🟢"}, {"green":"🟢"}]
資料B : [{"blue":"🔵"}, {"blue":"🔵"}, {"blue":"🔵"}]

如果用 `Position` 合併，會得到
```
[
  {
    "green": "🟢",
    "blue": "🔵"
  },
  {
    "green": "🟢",
    "blue": "🔵"
  },
  {
    "green": "🟢",
    "blue": "🔵"
  }
]
```

{% darrellImage800 n8n_merge_node-combine_position-demo n8n_merge_node-combine_position-demo.png max-800 %}

#### All Possible Combinations

`All Possible Combinations` 就是會把兩份資料的所有組合都合併在一起
有一個數學名詞叫做 笛卡爾積 (Cartesian Product)
這邊舉一個簡單的例子：
假設有商品會是三種尺寸搭配三種顏色
那它的規格就會有 9 種組合 (3種尺寸 * 3種顏色)

在 n8n 的世界中你也可以用 `All Possible Combinations` 快速得到這樣的組合

{% darrellImage800 n8n_merge_node-combine_matching_all_possible n8n_merge_node-combine_matching_all_possible.png max-800 %}

### SQL Query

這就算是比較進階的用法了
適合 **熟悉 SQL 且上述的合併方法都無法滿足需求** 時再使用

{% darrellImage800 n8n_merge_node-sql_query n8n_merge_node-sql_query.png max-800 %}

SQL 小學堂
```sql
SELECT input1.score, input2.name 
FROM input1 
LEFT JOIN input2 ON input1.student_id  == input2.student_id
```

兩個資料 input 會分別是 `input1` 和 `input2`
所以我們有 `Left Join` 的方式來合併，用 `student_id` 來當作合併的依據
只取出 `input1.score` 和 `input2.name` 兩個欄位

### Choose Branch

這個選項就比較 Tricky 
他的本質跟 `Merge` 就不太一樣
**不是用來合併資料，而是用來等待和控制流程**

{% darrellImage800 n8n_merge_node-choose_branch n8n_merge_node-choose_branch.png max-800 %}

以截圖的例子來說明
`Merge` 會等到兩條 input 都執行完畢，才輸出你選擇的其中一邊資料

為什麼要這樣呢？
目前比較合理的推測是 `input1` 可能是我們主要的資料
只是我們需要等到 `input2` 執行完畢，才確保狀態或是資料是完整的
然後繼續處理 `input` 的資料

這邊我會想等到改天真的用到這樣的情境時再好好補充！

和 AI 的討論過程中有個比較符合的情境是
> 當我們今天有個主要的資料需要提交申請，但申請前我們需要驗證資料正確，所以我得等到驗證的分支跑完後，才應該繼續提交主要資料做後續的申請。

## 相關文章推薦

{% articleCard
  url="/n8n-if-switch/"
  title="n8n If 和 Switch 節點教學 - 條件判斷完整指南"
  previewText="學會條件判斷節點，與 Merge 節點搭配使用"
  thumbnail="https://www.darrelltw.com/n8n-if-switch/n8n-If_Switch_bg.jpg"
%}

{% articleCard
  url="/n8n-aggregate-split-out/"
  title="n8n Aggregate 和 Split Out 節點教學"
  previewText="學會資料聚合與拆分，補足 Merge 節點的應用場景"
  thumbnail="https://www.darrelltw.com/n8n-aggregate-split-out/n8n-splitout_aggregation_bg.jpg"
%}

## 總結

**Merge** 節點算是蠻多人學習 n8n 時的一個小難關
原因是資料合併的概念其實有點抽象
不像 `IF` 這種判斷是或否比較單純
但又其實蠻常會用到的！

希望這篇文章有打開大家對 Merge 的想像和認識
