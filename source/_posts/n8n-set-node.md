---
title: n8n Edit Fields (Set) 節點教學 - 組合欄位、動態表達式、Include Fields
date: 2025-11-24 23:45:31
modified: 2025-11-24 23:45:31
tags:
  - n8n
  - n8n節點介紹
  - n8n教學
  - 數據處理
description: n8n Edit Fields Set 節點 3 大技巧：欄位組合格式化、$now 時間與條件判斷、Include Other Input Fields。90% 工作流都會用到的核心節點完整教學。
categories:
  - n8n
page_type: post
cover: blog-n8n-line-set_field-bg.jpg
bgImage: blog-n8n-line-set_field-bg.jpg
preload:
  - blog-n8n-line-set_field-bg.jpg
id: n8n-set-node
---

{% darrellImageCover n8n-set-node-cover blog-n8n-line-set_field-bg.jpg max-800 %}

> **n8n Edit Fields (Set) 節點**是用來新增、修改、刪除工作流數據欄位的核心節點，可以進行數據清洗、格式轉換、動態賦值等操作，是 n8n 自動化工作流中最常用的節點之一。

本文基於 **n8n 1.120.4** 版本撰寫，所有範例皆經過實測。如有版本差異請參考 [n8n 官方文檔](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set/)。

Set 節點大概是我在 n8n 裡面最常用的節點，幾乎每個工作流都會用到。
它的功能看似簡單，但實際上能做的事情超級多。

{% quickNav %}
[
  {"text": "Set 節點介紹", "anchor": "set-node-intro", "desc": "Edit Fields 是什麼"},
  {"text": "欄位整理", "anchor": "tip-1-data-cleaning", "desc": "組合欄位、格式轉換"},
  {"text": "動態表達式", "anchor": "tip-2-dynamic-expression", "desc": "$now 時間、條件判斷"},
  {"text": "Include Fields", "anchor": "tip-3-output-control", "desc": "保留原有欄位"},
  {"text": "Manual vs JSON", "anchor": "quick-start", "desc": "兩種模式的差異"}
]
{% endquickNav %}

---

<h2 id="set-node-intro">n8n Edit Fields (Set) 節點是什麼？</h2>

Set 節點在新版 n8n 裡面改名叫 **[Edit Fields](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set/)**，但功能是一樣的。
它的核心任務就是：**新增、修改、刪除數據欄位**，就是調整 JSON 裡面的數據欄位。

{% darrellImage800Alt "n8n Edit Fields Set 節點介面，顯示 Manual Mapping 模式的欄位設定畫面" n8n-set_field_node-interface.png max-800 %}

我自己實測下來，大概 90% 的 workflow 都會用到 Set 節點，特別是在：
- HTTP Request 節點之後，整理 API 回傳的雜亂數據
- 傳送資料給其他服務之前，把格式調整成對方 API 需要的格式
- 在工作流中間，把不同來源的數據整合成統一格式

**用個比喻來說**：Set 節點就像是今天你取得一塊原木
需要將木頭先做初步的整理，把不需要的部份先去除掉
再把它做後續的加工應用。

{% darrellImage800Alt "n8n Edit Fields Set 節點比喻，原木比喻 Set 節點的功能" n8n-set_field_node-wood-metaphor.webp max-800 %}

---

<h2 id="tip-1-data-cleaning">技巧一：欄位的整理</h2>

這是 Set 節點最常用的功能，幫你整理欄位

### 組合欄位 - 把分散的數據合併

常見的場景：API 回傳的姓名是分開的 `first_name` 和 `last_name`，但你需要完整的 `full_name`。

**設定方式：**
1. 新增一個欄位，命名為 `full_name`
2. 值設定為表達式：`{{ $json.firstname }} {{ $json.lastname }}`

{% darrellImage800Alt "n8n Set 節點組合欄位範例，將 first_name 和 last_name 合併成 full_name" n8n-set-node-combine-fields.png max-800 %}

Before：
```json
{
  "firstname": "Darrell",
  "lastname": "Wang"
}
```

After：
```json
{
  "full_name": "Darrell Wang"
}
```

### Expression 轉換字串的格式

有時候數據格式不統一會造成後面混亂，Set 節點可以幫你強制轉換：

| 需求 | 表達式 | 範例結果 |
|------|--------|----------|
| 全部轉大寫 | `{{ $json.name.toUpperCase() }}` | `DARRELL` |
| 全部轉小寫 | `{{ $json.email.toLowerCase() }}` | `darrell@example.com` |
| 去除空白 | `{{ $json.input.trim() }}` | 移除頭尾空白 |
| 替換字元 | `{{ $json.phone.replace(/-/g, '') }}` | `0912-345678` → `0912345678` |

{% darrellImage800Alt "n8n Set 節點格式化範例，使用 toUpperCase 和 toLowerCase 轉換字串格式" n8n-set-node-format.png max-800 %}


---

<h2 id="tip-2-dynamic-expression">技巧二：動態表達式與時間</h2>

Set 節點不只能設定靜態值，還能用表達式加入動態的資料欄位，例如當下。

### 取得當前時間

很多場景需要記錄「這筆資料是什麼時候處理的」，用 `{{ $now }}` 就能輕鬆搞定：

```
{{ $now.toISO() }}              → 2025-11-24T22:49:12.943+08:00
{{ $now.format('yyyy-MM-dd') }} → 2025-11-24
{{ $now.minus(1911, "years").format('y.MM.dd') }} → 114.11.24 (民國年月日)
```

{% darrellImage800Alt "n8n Set 節點時間戳範例，使用 $now 和 toFormat 產生自動時間記錄" n8n-set-node-timestamp.png max-800 %}

### 條件判斷

這是我也很常使用的功能！
可以在 Set 節點裡面做簡單的 If/Else 判斷
不用再另外多寫一個 `Code` 節點來做整理

`{{ 條件 ? 如果為真 : 如果為假 }}`

**範例：根據分數判斷等級**
```
{{ $json.vip_score >= 80 ? 'VIP' : '一般會員' }}
```

**範例：根據金額判斷是否免運**
```
{{ $json.total >= 1000 ? '免運費' : '運費 60 元' }}
```

{% darrellImage800Alt "n8n Set 節點三元運算符範例，根據分數條件判斷 VIP 或一般會員" n8n-set-node-ternary.png max-800 %}

```
{{ $json.score >= 90 ? 'A' : $json.score >= 80 ? 'B' : 'C' }}
```

### 引用先前節點的數據

除了用 `$json` 取得前一個節點的數據，還能跨節點取值（更多內建變數請參考 [n8n 內建變數教學](/n8n-built-in-variables/)）：

| 語法 | 說明 |
|------|------|
| `$json.欄位名` | 取得直接上游節點的欄位 |
| `$('節點名稱').item.json.欄位` | 取得指定節點的欄位 |

{% darrellImage800Alt "n8n Set 節點跨節點引用範例，使用 $json 和 $() 語法取得上游數據" n8n-set-node-reference.png max-800 %}

通常會這樣用的原因
例如我後面想要接 `Google Sheets` 節點儲存資料
但我不想要手動比對欄位

我會先用一個 `Set` 節點整理好所有欄位資料
再讓他直接存進去，這時候在 Sheet 節點會選 `Map Automatically` 模式

{% darrellImage800Alt "n8n Google Sheets 節點設定 Map Automatically 模式，提示需先用 Edit Fields 整理欄位名稱" n8n-set-node-reference-to-sheet.png max-800 %}

---

<h2 id="tip-3-output-control">技巧三：Include Other Input Fields</h2>

這是 Set 節點的另一種使用方式
通常我們拿到很多欄位，我們會用上面介紹的方式篩選我們需要的欄位

但有時候其實是我們需要 **增加** 現有的欄位
例如原本只有 `id`, `name` 但我們需要增加時間欄位

這時就會勾選 **Include Other Input Fields** 來保留原本的所有欄位！

{% darrellImage800Alt "n8n Set 節點 Include Other Input Fields 選項，開啟後保留原本的所有欄位" n8n-set-node-include-other-input-fields.png max-800 %}

**什麼時候該開啟？**

新增現有欄位，但要保存原本的所有欄位時！

---

<h2 id="quick-start">Manual vs JSON 模式的不同之處</h2>

### Manual vs JSON 模式

Set 節點有兩種操作模式，各有優缺點：

| 模式 | 適合對象 | 優點 | 缺點 |
|------|----------|------|------|
| Manual Mapping | 大部分使用者 | 拖拉點選，視覺化操作 | 欄位多時比較慢 |
| JSON Output | 特殊情況 | 批量設定，可複製貼上 | 需要熟悉 JSON 語法 |

{% darrellImage800Alt "n8n Set 節點兩種模式比較，Manual Mapping 視覺化操作 vs JSON Output 批量設定" n8n-set-node-modes.png max-800 %}

這裡也示範一個 `JSON Output` 的情境

{% darrellImage800Alt "n8n Set 節點 JSON Output 範例，將原始 JSON 資料轉換為特定格式" n8n-set_field_node-json-output.png max-800 %}

```json
{
  "user": {
    "ids": {
      "system_uid": "{{ $json.uid }}" 
    },
    "profile": {
      "email_address": "{{ $json.email }}",
      "full_name": "{{ $json.firstname }} {{ $json.lastname }}"
    },
    "security": {
      "hash": "{{ $json.password }}"
    }
  }
}
```

可以快速的將原本的資料轉換成一個多層 Level 的 JSON 格式
也不用手動一個一個拖拉設定欄位
如果搭配 AI 並且需要處理多個欄位時，**速度會快很多**


**建議：**
- 剛開始用 Manual Mapping 熟悉功能
- 只有一次真的要處理超多欄位時，再嘗試使用 JSON Output 模式

## 常見問題

{% faq %}
[
  {
    "question": "Set 節點和 Code 節點該怎麼選？",
    "answer": "簡單的數據轉換（組合欄位、格式化、設定預設值）用 Set 節點就夠了，介面直觀好維護。但如果需要複雜邏輯（迴圈、條件巢狀）或處理超過 1000 筆數據，建議用 Code 節點，效能會更好。"
  },
  {
    "question": "Set 節點能處理陣列（Array）數據嗎？",
    "answer": "可以，但需要搭配表達式。例如用 <code>{{ $json.items.map(item => item.name) }}</code> 提取陣列中每個物件的 name 欄位，或用 <code>.filter()</code>、<code>.find()</code> 等方法處理陣列。"
  },
  {
    "question": "Set 節點處理大量數據會變慢嗎？",
    "answer": "會。Set 節點的表達式解析有額外開銷，當數據量超過 1000 筆時會明顯變慢。這時候建議改用 Code 節點，用原生 JavaScript 處理效能更好。"
  }
]
{% endfaq %}

---

## 總結

Set 節點看似平凡無奇，但其實真的是很常用到的節點

三個核心功能：
1. **欄位整理**：組合欄位、格式轉換
2. **動態表達式**：$now 時間、條件判斷、跨節點引用
3. **Include Other Input Fields**：保留原有欄位並新增

另外也想分享整理資料欄位的另一個好處
就是他會節省資料傳遞的記憶體使用量

例如一開始傳進來一大坨資料
但其實你只會用到 1/5 的欄位

如果沒有 Set 節點先整理過
那這一大坨資料就會傳遞到每個節點
會讓 n8n 的記憶體用量增加不少

---

## 相關文章

{% articleCard
  url="/n8n-merge-node/"
  title="n8n Merge 節點教學 - 資料合併完整指南"
  previewText="學會用 Merge 節點合併多個數據來源"
  thumbnail="https://www.darrelltw.com/n8n-merge-node/blog-n8n-merge-node-bg.jpg"
%}

{% articleCard
  url="/n8n-if-switch/"
  title="n8n If 和 Switch 節點教學 - 條件判斷完整指南"
  previewText="當邏輯更複雜時，用 IF 和 Switch 節點來分流"
  thumbnail="https://www.darrelltw.com/n8n-if-switch/n8n-If_Switch_bg.jpg"
%}

{% articleCard
  url="/n8n-built-in-variables/"
  title="n8n 內建變數教學 - $json $now $input 完整指南"
  previewText="$json、$now、$input 等內建變數的完整說明"
  thumbnail="https://www.darrelltw.com/n8n-built-in-variables/n8n_builtin_variables_bg.jpg"
%}
