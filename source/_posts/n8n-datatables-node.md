---
title: n8n DataTables 節點教學 - 直接把資料存在 n8n 裡
tags:
  - n8n
  - n8n節點介紹
  - n8n教學
categories:
  - n8n
page_type: post
id: n8n-datatables-node
description: n8n 推出 DataTables！ 原生數據存儲無需外部資料庫，支援完整 insert、update、get、delete。
bgImage: blog-n8n-datatables-bg.jpg
preload:
  - blog-n8n-datatables-bg.jpg
date: 2025-09-25 17:31:05
---

{% darrellImageCover blog-n8n-datatables-bg blog-n8n-datatables-bg.jpg max-800 %}

**預計閱讀時間：** 5-8 分鐘
**適合對象：** 已有 n8n 基礎，想學 DataTables 如何操作

**你將學到：**
- n8n DataTables Beta 環境需求和建立第一個資料表
- 7 種 Actions 完整介紹（Insert、Get、Update、Upsert、Delete、If Row Exists 等）
- 表單模板實際操作，從資料收集到 CRUD 操作的完整流程
- 個人實測心得：優缺點分析和適合使用的場景建議

**如果趕時間，可以跳到**
{% quickNav %}
[
  {
    "text": "環境需求設定",
    "anchor": "datatables-setup",
    "desc": "版本確認和建立資料表"
  },
  {
    "text": "7 種 Actions 介紹",
    "anchor": "practical-cases",
    "desc": "完整 CRUD 操作演示"
  },
  {
    "text": "表單模板示範",
    "anchor": "template-demo",
    "desc": "實際操作和模板下載"
  }
]
{% endquickNav %}

---

<h2 id="datatables-setup">n8n DataTables 環境需求</h2>

### 版本要求和 Beta 功能啟用

n8n DataTables 是在 **v1.113.0** 正式推出的 Beta 功能，解決了長期以來用戶需要外部資料庫的痛點。

{% callout warning %}
- 需要 n8n 1.113.0 或更高版本
- 目前仍為 Beta 功能，建議在測試環境先試用
{% endcallout %}

首先確認你的 n8n 版本：

{% darrellImage800 n8n-how_to_check_version n8n-how_to_check_version.png max-800 %}

### 建立第一個 DataTable

在 n8n 介面中，你會看到新的 **Data tables** 選單
點擊 `Create Data table` 後可以建立新的數據表格：

{% darrellImage800 n8n_datatables-menu_create_table n8n_datatables-menu_create_table.png max-600 %}

**建立步驟：**
1. **Table Name：** 輸入表格名稱（例如：`orders`、`users`）

{% darrellImage800 n8n_datatables-add_table_name n8n_datatables-add_table_name.png max-800 %}

2. **新增欄位：** 定義欄位名稱和類型

{% darrellImage800 n8n_datatables-add_field_name_and_type n8n_datatables-add_field_name_and_type.png max-800 %}

欄位的部分有四種 type 可以選擇
- String : 字串，一般文字
- Number : 數字，數字
- Boolean : 布林值，true 或 false
- Date : 日期

{% darrellImage800 n8n_datatables-field_type n8n_datatables-field_type.png max-800 %}

這四種形態會影響資料的比對或是計算使用
可以先在前面建立時思考一下場景

示範中我們依序建立四個欄位：
- email : `String`
- review_stars : `Number`
- subscribe : `Boolean`
- birthday : `Date`

<h2 id="practical-cases">7 種 Actions 介紹</h2>

DataTable 節點提供完整的資料庫操作功能：

{% darrellImage800 n8n_datatables-operations n8n_datatables-operations.png max-800 %}

### **Insert - 新增資料**
用於新增資料，例如新訂單、新用戶註冊：
{% darrellImage800 n8n_datatables-insert n8n_datatables-insert.png max-800 %}

搭配測試的分享模板
我們會使用 n8n form 來搜集名單和資料

{% darrellImage800 n8n_datatables-form_demo_collect_data n8n_datatables-form_demo_collect_data.png max-800 %}

{% darrellImage800 n8n_datatables-form_demo_collect_data_insert n8n_datatables-form_demo_collect_data_insert.png max-800 %}

--- 

### **Get Row(s) - 查詢資料**

搜尋和提取符合條件的資料：

{% darrellImage800 n8n_datatables-get n8n_datatables-get.png max-400 %}

#### 篩選欄位的條件和進階選項
String 字串的篩選有幾種

- Equal : 等於xxx
- Not Equal : 不等於xxx
- Contains(Case-Sensitive) : 包含xxx(區分大小寫)
- Contains(Case-Insensitive) : 包含xxx(不區分大小寫)

`Return All` 為是否要回傳所有符合的資料
`Limit` 為限制要回傳的筆數，預設會限制 50 筆

### **If row exists** & **If row does not exist**

{% darrellImage800 n8n_datatables-action_row_exists n8n_datatables-action_row_exists.png max-400 %}

這節點蠻特別的，單純用來判斷搜尋的資料在不在
**但不會 return 資料 !!**

{% darrellImage800 n8n_datatables-action_row_exists_demo n8n_datatables-action_row_exists_demo.png max-400 %}

If 和 If not 就互為相反
場景：只需要判斷是否資料存在，類似 n8n 的 `IF` 節點使用

### **Update - 更新資料** & **Upsert - 插入或更新**
Update 和 Upsert 可以一起討論
兩者都是用在**更新資料**
區別是 Upsert 會在資料不存在的情況下，直接新增一筆資料

如果沒有 Upsert 的話，以往要判斷新增或更新會很麻煩
例如我今天有一筆 email 為 `test222@test.com` 的資料

到底要新增還是更新，得先去查詢這筆資料存在與否
如果存在 -> 更新
如果不存在 -> 新增

而 `Upsert` 就主動做到上述的事情
如果沒有 `test222@test.com` 的 email 資料，就自動新增一筆

{% darrellImage800 n8n_datatables-upsert n8n_datatables-upsert.png max-800 %}

### **Delete - 刪除資料**
根據條件刪除不需要的資料

{% callout warning %}
請注意條件是否正確，如果條件設定錯誤就會刪除掉不該被刪除的資料。

目前 `Data Tables` **沒有提供資料備份或是救援的機制**，如果誤刪會真的不見。建議刪除前要三思！
{% endcallout %}

---

<h2 id="template-demo">表單模板示範</h2>

{% darrellImage800 n8n_datatables-template_demo n8n_datatables-template_demo.png max-800 %}

這邊也準備一個簡易的 n8n 模板給大家嘗試 Data Tables
如果你平時有需要用表單搜集資料
那 Data Tables 也是個不錯的資料儲存方案

可以先根據文章的引導和模板來嘗試摸索

{% articleCard
  url="/source/tools/n8n_template/model-detail.html?model=darrell-n8n-demo-datatables"
  title="n8n Webhook 節點完整教學"
  previewText="學會接收外部數據，與 DataTables 完美搭配"
  thumbnail="https://www.darrelltw.com/tools/n8n_template/data/bg/darrell-n8n-demo-datatables.webp"
%}

## 個人實測心得

優點：
- 設定簡單： 建立 Tables 和設定欄位很簡單迅速
- 費用： 這次免費更新給所以方案用戶
- 速度： 小型存取速度超快

缺點：
- 沒有備援： 資料要是不小心刪除，會真的不見
- 欄位管理： 欄位的管理介面和資料庫相比有點太陽春
- 欄位型態： 目前支援的欄位型態只有四種

適合場景：
- 小型專案想快速測試
- 如果遇到 Google Sheet 會有 rate limit 問題限制

---

## 相關文章推薦

{% articleCard
  url="/n8n-webhook/"
  title="n8n Webhook 節點完整教學"
  previewText="學會接收外部數據，與 DataTables 完美搭配"
  thumbnail="https://www.darrelltw.com/n8n-webhook/blog-n8n-webhook-bg.jpg"
%}

{% articleCard
  url="/n8n-gmail-node/"
  title="n8n Gmail 節點教學"
  previewText="郵件通知自動化，DataTables 數據觸發郵件發送"
  thumbnail="https://www.darrelltw.com/n8n-gmail-node/blog-n8n-gmail-bg.jpg"
%}