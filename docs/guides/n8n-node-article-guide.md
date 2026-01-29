# n8n 節點文章寫作指南

這份指南記錄了 n8n 節點教學文章的標準結構、寫作風格，以及未來 10 篇文章的規劃。

---

## 📋 未來 10 篇文章規劃

### 優先級排序

| # | 節點名稱 | 類型 | 難度 | 核心內容 |
|---|---------|------|------|---------|
| 1 | **HTTP Request** | 核心 | ⭐⭐ | GET/POST/PUT/DELETE、Headers、Auth、JSON Body、錯誤處理 |
| 2 | **Google Sheets** | 整合 | ⭐ | CRUD 操作、搜尋語法、與 Set 節點搭配、權限設定 |
| 3 | **Code** | 核心 | ⭐⭐⭐ | JavaScript vs Python、$input/$json 語法、常用片段、效能考量 |
| 4 | **OpenAI** | AI | ⭐⭐ | Chat/Complete 模式、Prompt 設計、Token 計算、成本優化 |
| 5 | **Loop Over Items** | 流程 | ⭐⭐ | 迴圈模式、搭配 HTTP Request、避免無限迴圈 |
| 6 | **Split in Batches** | 流程 | ⭐⭐ | 批次大小設定、Rate Limiting、大數據處理 |
| 7 | **Airtable** | 整合 | ⭐⭐ | Base/Table 概念、CRUD、Formula 欄位、與 Sheets 對比 |
| 8 | **Schedule Trigger** | 觸發 | ⭐ | Cron 語法、時區設定、執行頻率優化 |
| 9 | **Claude (Anthropic)** | AI | ⭐⭐ | API 設定、與 OpenAI 對比、長文本處理 |
| 10 | **Supabase** | 整合 | ⭐⭐⭐ | PostgreSQL 操作、即時訂閱、Auth 整合 |

### 備選清單
- Discord（通訊整合）
- PostgreSQL/MySQL（企業資料庫）
- Tesseract OCR（社群節點）
- Google Calendar（日曆整合）
- Notion（生產力工具）

---

## 📝 標準文章結構

### Front Matter 模板
```yaml
---
title: n8n [節點名稱] 節點教學 - [副標題]
tags:
  - n8n
  - n8n節點介紹
  - n8n教學
  - [相關技術標籤]
categories:
  - n8n
page_type: post
id: n8n-[節點名稱]-node
description: [150字內的 SEO 描述]
bgImage: n8n-[節點名稱]-node-bg.jpg
preload:
  - n8n-[節點名稱]-node-bg.jpg
date: [發布日期]
modified: [修改日期]
---
```

### 章節結構（250-350 行）

```markdown
{% darrellImageCover [id] [filename] %}

{% quickNav %}
[
  {"text": "功能介紹", "anchor": "features", "desc": "核心功能"},
  {"text": "設定教學", "anchor": "setup", "desc": "Credentials 設定"},
  {"text": "實戰案例", "anchor": "example", "desc": "深度案例"},
  {"text": "常見問題", "anchor": "faq", "desc": "FAQ"}
]
{% endquickNav %}

## 前言
- 這個節點解決什麼問題？
- 適合什麼場景？
- 預計閱讀時間

<h2 id="features">[節點名稱] 功能介紹</h2>

### 功能一
（詳細說明 + 截圖）

### 功能二
（詳細說明 + 截圖）

### 功能表格（其他功能快速一覽）
{% dataTable %}
[...]
{% enddataTable %}

<h2 id="setup">設定教學</h2>

### Step 1: 申請 API Key / 建立帳號
### Step 2: 在 n8n 設定 Credentials
### Step 3: 測試連線

<h2 id="example">實戰案例：[案例名稱]</h2>

### 需求說明
### Workflow 架構
### 詳細步驟
### 效果展示

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {"question": "問題1", "answer": "回答1"},
  {"question": "問題2", "answer": "回答2"},
  {"question": "問題3", "answer": "回答3"}
]
{% endfaq %}

## 相關推薦

{% articleCard ... %}

## 總結
```

---

## 🎨 寫作風格指南

### 語調特色
- **親切實測風**：「實測」「自己測試」「蠻常用」
- **問題導向開頭**：「你有沒有遇過...」「如果你需要...」
- **第一人稱經驗**：「我自己最常用的是...」「踩過的坑是...」

### 中英混用規則
- **保留英文**：節點名稱、API、JSON、Trigger、Webhook
- **用中文**：說明、步驟、比喻

### Emoji 使用
- ⚠️ 警告、注意事項
- ✅ 正確做法、推薦
- ❌ 錯誤做法、避免
- 💡 小技巧、補充說明
- 🔑 重要概念
- 📖 延伸閱讀

### 視覺元素密度
- **圖片**：每 15-20 行一張截圖
- **表格**：功能對比、語法速查
- **代碼**：5-10 個代碼片段
- **引用區塊**：技巧提示、注意事項

---

## 📦 各節點內容建議

### 1. HTTP Request（優先級最高）
```
核心內容：
├─ HTTP 方法介紹（GET/POST/PUT/DELETE）
├─ Headers 設定（Authorization、Content-Type）
├─ Body 類型（JSON、Form Data、Binary）
├─ Authentication 方式（Bearer Token、Basic Auth、OAuth）
├─ 錯誤處理（狀態碼判斷、重試邏輯）
├─ 進階技巧（分頁處理、Rate Limiting）
└─ 實戰案例：串接第三方 API（天氣/匯率/新聞）

FAQ 建議：
- 401/403/404/500 錯誤怎麼處理？
- 如何處理需要登入的 API？
- JSON 和 Form Data 怎麼選？
```

### 2. Google Sheets
```
核心內容：
├─ 連接設定（OAuth 授權流程）
├─ 讀取操作（Get Row、Get Many）
├─ 寫入操作（Append、Update）
├─ 搜尋語法（Filter by Formula）
├─ 與 Set 節點搭配整理資料
└─ 實戰案例：自動記帳/表單資料同步

FAQ 建議：
- 權限設定有哪些要注意？
- 如何處理大量資料？
- Sheets vs Airtable 怎麼選？
```

### 3. Code
```
核心內容：
├─ JavaScript vs Python 選擇
├─ $input.all() / $input.first() 語法
├─ $json 和 $node 存取
├─ 常用程式片段（日期處理、字串操作、陣列操作）
├─ 效能考量（避免阻塞、記憶體限制）
└─ 實戰案例：複雜資料轉換

FAQ 建議：
- Code vs Set 節點怎麼選？
- 可以使用外部套件嗎？
- 如何除錯 Code 節點？
```

### 4. OpenAI
```
核心內容：
├─ API Key 申請與設定
├─ Chat vs Complete 模式
├─ 模型選擇（GPT-4 vs GPT-4o-mini）
├─ Prompt 設計技巧
├─ Token 計算與成本估算
├─ 進階：Function Calling
└─ 實戰案例：AI 摘要/分類/生成

FAQ 建議：
- 費用怎麼算？
- 回應太慢怎麼辦？
- 如何控制輸出格式？
```

### 5. Loop Over Items
```
核心內容：
├─ 迴圈邏輯說明
├─ 與 Split Out 的差異
├─ 搭配 HTTP Request 批次處理
├─ 避免無限迴圈
└─ 實戰案例：批次 API 呼叫

FAQ 建議：
- 什麼時候用 Loop vs Split Out？
- 迴圈卡住怎麼辦？
```

### 6. Split in Batches
```
核心內容：
├─ Batch Size 設定原則
├─ 與 Rate Limiting 搭配
├─ 大數據處理策略
├─ Wait 節點配合
└─ 實戰案例：大量資料同步

FAQ 建議：
- Batch Size 怎麼決定？
- 處理失敗的批次怎麼重試？
```

### 7-10. 其他節點
（依照類似結構規劃）

---

## 🔧 常用標籤語法

### 圖片
```markdown
{% darrellImageCover [id] [filename] %}
{% darrellImage800 [id] [filename] max-800 %}
{% darrellImage800Alt "[alt text]" [filename] max-800 %}
```

### 導覽
```markdown
{% quickNav %}
[{"text": "章節", "anchor": "anchor-id", "desc": "說明"}]
{% endquickNav %}
```

### 表格
```markdown
{% dataTable style="minimal" align="left" highlight="2,3" %}
[{"欄位1": "值1", "欄位2": "值2"}]
{% enddataTable %}
```

### FAQ
```markdown
{% faq %}
[
  {"question": "問題", "answer": "回答"}
]
{% endfaq %}
```

### 文章卡片
```markdown
{% articleCard
  url="/path/"
  title="標題"
  previewText="描述"
  thumbnail="https://..."
%}
```

---

## 📊 已完成的節點文章

| 節點 | 文章 | 行數 | 特色 |
|------|------|------|------|
| Gmail | n8n-gmail-node.md | 338 | 搜尋語法表格、信用卡案例 |
| LINE Messaging | n8n-line-messaging-community-node.md | 305 | 社群節點安裝、6 個功能 |
| Set/Edit Fields | n8n-set-node.md | 293 | 技巧式分類、表達式速查 |
| Merge | n8n-merge-node.md | 219 | 4 種模式對比 |
| Filter | n8n-filter-node.md | 95 | 簡潔基礎教學 |
| DataTables | n8n-datatables-node.md | 226 | 原生資料存儲 |
| Perplexity | n8n-perplexity-node.md | 195 | AI 搜尋整合 |
| Time Saved | n8n-time-saved-node.md | 269 | ROI 量化追蹤 |

### 相關教學文（非節點專文）
- n8n-webhook.md - Webhook 教學
- n8n-if-switch.md - If/Switch 條件判斷
- n8n-aggregate-split-out.md - 資料合併與分割
- n8n-with-slack.md - Slack 整合

---

## 🏷️ 版本記錄

- **v1.0** (2025-12-27): 初始版本，規劃 10 篇文章
