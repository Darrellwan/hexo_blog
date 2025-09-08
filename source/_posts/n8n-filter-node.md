---
title: n8n Filter 節點教學 - 資料篩選與條件判斷
tags:
  - n8n
  - n8n節點介紹
  - n8n教學
  - 資料篩選
categories:
  - n8n
page_type: post
id: n8n-filter-node
description: 解析 n8n Filter 節點與 If/Switch 節點差異，包含 AND/OR 邏輯判斷、Ignore case 設定等進階功能。實測各種資料類型篩選方法，提升自動化流程效率。
bgImage: n8n-filter-node-bg.jpg
preload:
  - n8n-filter-node-bg.jpg
date: 2025-09-08 18:12:13
ai_assistance: 10%
---
{% darrellImageCover n8n-filter-node-bg n8n-filter-node-bg.jpg max-800 %}

## Filter 節點介紹

### 什麼是 Filter 節點？
Filter 節點會用來篩選資料
例如你取得 100 筆資料，假設你只想要 `status = true` 的資料時
就可以利用 `Filter` 來做過濾

{% darrellImage n8n_filter-demo_filter_data_by_status_true n8n_filter-demo_filter_data_by_status_true.png max-800 %}

> 以圖片為例：
> 有 10 資料，被篩選後
> 只剩下 5 筆 status = true 的資料

### 與 If/Switch 節點的差異：
- **If 節點**：用於流程分岔，根據條件決定執行路徑
    true 或 false 各自接續流程處理
- **Switch 節點**：多路徑分岔，類似 case 語句
    不只 true 或 false，多種條件性的流程處理
- **Filter 節點**：資料篩選，移除不符合條件的項目
    只會篩選資料，只留下需要資料

適合場景：
- 從大量資料中篩選特定項目
- 移除無效或空值資料
- 根據條件清理資料集

### 進階設定 - 多個 and 或是 or 條件
在 Filter 節點中，可以設定多個 and 或是 or 條件
{% darrellImage n8n_filter-advanced_setting_1 n8n_filter-advanced_setting_1.png max-800 %}

例如你想要留下的是名字包含 A 或 B 或 C 的資料時
就會設定 
- `name contains "A"`
or 
- `name contains "B"`
or
- `name contains "C"`

**跟 and 的差異是什麼?**
如果上方的條件設定成 **and**

那就變成這個名字要同時包含 A、B、C 才會留下
兩者的意思差距很大！

或是我們舉例性別：
一個人可能是男生 **或是** 女生
但一個人可能不會同時是男生又是女生 (我們先撇開生理X心理Y的情況)

### 進階設定 - Ignore case

在 Filter 節點中，可以設定 Ignore case 來**忽略大小寫**
{% darrellImage n8n_filter-advanced_setting_2 n8n_filter-advanced_setting_2.png max-800 %}

以上圖舉例，我們是用 大寫 A 來篩選 名字有大寫 A 的資料
但如果我們想要的資料同時有小寫 a 跟大寫 A 時
用 `Ignore case` 就能方便同時篩選到大小寫 A a 的資料了！



## 相關文章推薦

{% articleCard 
  url="/n8n-if-switch/" 
  title="n8n If 和 Switch 節點教學 - 條件判斷完整指南" 
  previewText="學會條件判斷節點，讓你的 Filter 節點與邏輯判斷更靈活運用" 
  thumbnail="https://www.darrelltw.com/n8n-if-switch/n8n-If_Switch_bg.jpg" 
%}

{% articleCard 
  url="/n8n-built-in-variables/" 
  title="n8n 內建變數完全解析 - $input、$json 使用陷阱與技巧" 
  previewText="掌握 n8n 內建變數，在 Filter 節點中正確取得和過濾資料" 
  thumbnail="https://www.darrelltw.com/n8n-built-in-variables/n8n_builtin_variables_bg.jpg" 
%}

