---
title: n8n Aggregate 和 Split Out
tags:
  - n8n
categories:
  - n8n
page_type: post
id: n8n-aggregate-split-out
description: n8n 的 Aggregate 和 Split Out 節點，可以將多個資料合併成一個，或是相反將一個資料拆成多組資料，對於 n8n 的核心處理資料很重要也很常用到
bgImage: n8n-splitout_aggregation_bg.jpg
preload:
  - n8n-splitout_aggregation_bg.jpg
date: 2025-01-15 20:36:01
---
{% darrellImageCover n8n-splitout_aggregation_bg n8n-splitout_aggregation_bg.jpg max-800 %}

## Aggregate

{% darrellImage800 n8n_demo_aggregate_concept_gif n8n_demo_aggregate_concept_gif.gif max-800 %}

Aggregate 的用法會是把多個 items 合併為一個 item

### 模式: Individual Fields

這個模式允許你挑選其中一個或多個欄位
並把這個欄位合併成一個 Array
例如把訂單編號單獨取出來變成一個陣列

{% darrellImage800 n8n_aggregate_mode_Individual_Fields n8n_aggregate_mode_Individual_Fields.png max-800 %}

### 模式: All ltem Data(Into a Single List)

這個模式是把 Items 集合在一個新的變數底下
例如把五筆訂單 -> 集合成一個訂單們

{% darrellImage800 n8n_aggregate_mode_All_Item_Data_Into_a_Single_List n8n_aggregate_mode_All_Item_Data_Into_a_Single_List.png max-800 %}

{% darrellImage800 n8n_aggregate_mode_All_Item_Data_Into_a_Single_List_AllFields n8n_aggregate_mode_All_Item_Data_Into_a_Single_List_AllFields.png max-800 %}

### 範例: OpenAI 問答

通常我們要把資料丟給 OpenAI 時，我們會需要把資料整合在一起
例如: 前面有五筆資料，我們要把它合併成一筆大資料，並請 OpenAI 分析
{% darrellImage800 n8n_aggregate_chatgpt_use_case n8n_aggregate_chatgpt_use_case.png max-800 %}

那 Aggregate 到底做了什麼?
{% darrellImage800 n8n_aggregate_how_it_work n8n_aggregate_how_it_work.png max-800 %}

可以看到圖片的左邊是 30筆資料，而他們被 Aggregate 合併到一個叫做 Data 的資料中
Output 也只剩下一個 Item

{% darrellImage800 n8n_demo_aggregate_concept n8n_demo_aggregate_concept.jpg max-800 %}
概念圖如上
所以要是沒有先 Aggregate 的話，OpenAI 就是會個別收到這些資料，變成逐筆分析，而不是一次的分析全部


## Split Out

{% darrellImage800 n8n_demo_split_out_concept n8n_demo_split_out_concept.gif max-800 %}

Split Out 的用法就會是 Aggregate 的相反，把一個 item 裡的資料拆成多個 items

### 設定: Destination Field Name

Destination Field Name 可以重新設定輸出的欄位名稱
用同樣的範例

原本的欄位名稱是 `body.data` 
用這個設定就可以改寫為 `test`

{% darrellImage800 n8n_demo_split_out_field_name n8n_demo_split_out_field_name.png max-800 %}

### 範例: Webhook 接收資料

例如用在 webhook 收到一筆資料時
其中的 data 裡面是 `["a", "b", "c", "d", "e"]`
如果我們要分別對 `a, b, c, d, e` 做處理，就使用 Split Out

{% darrellImage800 n8n_demo_split_out n8n_demo_split_out.png max-800 %}

