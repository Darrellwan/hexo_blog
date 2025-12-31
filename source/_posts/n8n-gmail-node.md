---
title: n8n Gmail 節點教學 - 自動化郵件發送和處理
tags:
  - n8n
  - n8n node
  - Gmail
  - 自動化
categories:
  - n8n
page_type: post
id: n8n-gmail-node
description: 完整教學 n8n Gmail 節點實現郵件自動化流程。包含 OAuth 認證設定、搜尋語法技巧、郵件發送標籤管理等功能介紹。實測信用卡帳單自動提醒、PDF 解析、Google Calendar 整合等進階案例。
bgImage: blog-n8n-gmail-bg.jpg
preload:
  - blog-n8n-gmail-bg.jpg
date: 2025-07-22 16:40:30
---

{% darrellImageCover n8n-gmail-node-bg blog-n8n-gmail-bg.jpg max-800 %}

**預計閱讀時間：** 5-10 分鐘  
**適合對象：** 已有 n8n 基礎，想學會 Gmail 節點和應用的朋友

**你將學到：**
- Gmail 節點三大操作類型完整攻略  
- Gmail 實用搜尋語法和附件處理技巧  
- n8n workflow : 信用卡帳單自動提醒完整實作  
- Gmail 常見問題解決方案

**如果趕時間，可以跳到**
{% quickNav %}
[
  {
    "text": "功能介紹",
    "anchor": "gmail-function",
    "desc": "快速了解 Gmail 節點能做什麼"
  },
  {
    "text": "信用卡帳單自動提醒", 
    "anchor": "credit-card-automation",
    "desc": "看完整實作案例"
  },
  {
    "text": "常見問題",
    "anchor": "common-issues", 
    "desc": "解決設定問題"
  }
]
{% endquickNav %}

---

<h2 id="gmail-function">Gmail 節點功能介紹</h2>

Gmail 節點提供三種主要操作類型，以使用頻率排序：

### Message 訊息操作（最常用）

Message 也就是 Email，應該是最常使用的一些 action

{% darrellImage800 n8n_gmail-message n8n_gmail-message.png max-400 %}

**發送郵件（Send）**

`Send a message` 就能用來發信
例如當前面有一個什麼名單或是 Email 註冊，你需要用 Gmail 直接發信給他

{% darrellImage800 n8n_gmail-message_send n8n_gmail-message_send.png max-400 %}

發信會用到的欄位都在截圖上
例如收信者信箱、主旨、內容等等

如果是寄送通知信給自己，那可以把收信者寫死自己的信箱
那如果是根據前面的資料來源信箱，記得拖曳資料欄位過來即可

發送郵件還有很多選項可以設定！
{% darrellImage800 n8n_gmail-message_send_option n8n_gmail-message_send_option.png max-800 %}

- **Append n8n Attribution：** 在郵件底部加入 n8n 標識
- **Attachments：** 附加檔案
- **BCC：** 密件副本收件者
- **CC：** 副本收件者  
- **Sender Name：** 自訂寄件者顯示名稱
- **Send Replies To：** 設定回覆郵件地址
- **Reply to Sender Only：** 僅回覆給原寄件者

**讀取單封、多封郵件**

{% darrellImage800 n8n_gmail-message_get-get_many n8n_gmail-message_get-get_many.png max-400 %}

用來搜尋或是直接取得郵件
**通常都會搭配搜尋**來使用
你可以搜尋特定主旨或是寄件者來篩選郵件
當然也能加上日期等等

這部分的搜尋建議可以先到 Gmail 做搜尋，確定條件能正確搜尋到，再回到 n8n 來使用

Gmail 搜尋語法小技巧：

| 語法 | 說明 | 範例 |
|----------|------|------|
| `from:` | 搜尋特定寄件者 | `from:support@example.com` |
| `to:` | 搜尋特定收件者 | `to:me` |
| `subject:` | 搜尋主旨包含特定文字 | `subject:訂單確認` |
| `has:attachment` | 有附件的郵件 | `has:attachment` |
| `is:unread` | 未讀郵件 | `is:unread` |
| `is:read` | 已讀郵件 | `is:read` |
| `is:starred` | 已加星號的郵件 | `is:starred` |
| `label:` | 特定標籤的郵件 | `label:重要` |
| `after:` | 指定日期之後的郵件 | `after:2024/1/1` |
| `before:` | 指定日期之前的郵件 | `before:2024/12/31` |

組合搜尋範例：
```
from:客服 subject:退款 is:unread
寄件者包含「客服」且主旨包含「退款」的未讀郵件

has:attachment after:2024/1/1 before:2024/12/31
2024年內有附件的郵件

from:boss@company.com is:starred
老闆寄來的已加星號郵件
```

實測建議： 先在 Gmail 網頁版測試搜尋條件，確認能找到正確郵件後，再複製相同的搜尋語法到 n8n 的 Search 欄位

{% darrellImage800 n8n_gmail-message_get_many-search_box n8n_gmail-message_get_many-search_box.png max-400 %}


**刪除郵件**
Delete Message 要謹慎使用
並不會先把 Email 移到垃圾桶
而是直接刪除！

除非很確定這真的是不重要的 Email
不然不建議直接使用 `delete` 來操作

### Label 標籤管理

{% darrellImage800 n8n_gmail-label n8n_gmail-label.png max-400 %}

Gmail 的標籤就會是電腦版左邊的這列

{% darrellImage800 n8n_gmail-label_in_pc n8n_gmail-label_in_pc.png max-800 %}

- **Create：** 建立新標籤
透過自動化來建立標籤，通常用在需要的標籤不存在時

- **Delete：** 刪除標籤
給 `Label_id` 來刪除標籤

- **Get：** 取得特定標籤
取得標籤資訊，較少用到

- **Get Many：** 取得多個標籤
列出所有標籤

### Thread 討論串

{% darrellImage800 n8n_gmail-thread n8n_gmail-thread.png max-400 %}

講到 Thread 就很有必要來說明，他跟 Message 的差異

{% darrellImage800 n8n_gmail-thread_compare_message n8n_gmail-thread_compare_message.png max-800 %}

簡單來說，Thread 就是一串 Email 
所以今天有人寄一封信給你，他不只是一封信，也是一串 Email
如果你回覆這封信，就會變成這串 Email 的第二封信

- **Get：** 取得特定討論串內容
- **Get Many：** 取得多個討論串列表
- **Reply：** 回覆討論串
- **Add Label：** 為討論串新增標籤
這如果有接入自動化，應該是蠻常使用的功能
判斷為信件的主旨或內容後，加上適當的標籤來分類

- **Remove Label：** 移除討論串標籤
- **Trash：** 將討論串移到垃圾桶
這點就是跟 Message 蠻不同的地方，你想要把這整串移動到垃圾桶，使用 Thread 的 Trash 就好！

- **Untrash：** 從垃圾桶恢復討論串

- **Delete：** 刪除討論串
和 Message 一樣，不建議直接使用 `delete`
可以先使用 `Trash` 來移動到垃圾桶


### n8n Gmail 下載附件

今天如果是想要下載處理 Email 中的附件
例如 pdf 或是 csv 檔案
記得在 Gmail 節點中先取消勾選 `Simplify`
然後再選項開啟 `Download Attachments`

{% darrellImage800 n8n_gmail-download_attachment n8n_gmail-download_attachment.png max-800 %}

這樣就能把附件下載成 `binary` 格式，後續可以直接處理使用

### n8n Gmail Trigger

Gmail Trigger - on message received 是 Gmail 相關場景中很重要的節點
他會根據 poll time 按時去監控說，是否有新的郵件進來
也能透過 `filter` 來篩選郵件

就能做到當 `電子帳單` 寄送到信箱時，啟動一個自動化工作流處理！

{% darrellImage800 n8n_gmail-message_trigger n8n_gmail-message_trigger.png max-800 %}

<h2 id="common-issues">常見問題和解決方案</h2>

### Gmail 發送頻率限制

**發送頻率限制（官方數據）：**
- 一般 Gmail 帳戶： 每日最多 500 封郵件
- Google Workspace 帳戶： 每日最多 2,000 封郵件
- API 速率限制： 每秒 250 個配額單位（每次發送消耗 100 單位）
- 大量發送定義： 每日超過 5,000 封需遵守額外規範

**重要提醒：** Google 的政策隨時可能更新，建議定期檢查 [Gmail 寄件者指南](https://support.google.com/a/answer/81126)

## 進階應用

<h3 id="credit-card-automation">信用卡帳單自動提醒</h3>

這個案例展示如何自動處理多家銀行的信用卡帳單郵件，解析帳單資訊並建立 Google Calendar 提醒。

**流程：** Gmail Trigger 接收帳單郵件 → 解析 PDF 附件 → 提取金額和日期 → 建立 Calendar 事件 → Google Sheets 記錄

{% darrellImage800 n8n_gmail-demo-credit_card n8n_gmail-demo-credit_card.png max-800 %}

支援銀行：
- 永豐銀行
- 國泰世華
- 中國信託
- 台北富邦
- 玉山銀行
- 星展銀行
- 聯邦銀行
- 台新銀行

核心功能：

1. Gmail Trigger 自動監控
```javascript
永豐: "from:(newebill.banksinopac.com.tw) 永豐銀行信用卡 電子帳單通知"
國泰: "from:(service@pxbillrc01.cathaybk.com.tw) 國泰世華銀行 月電子帳單"  
中信: "from:(ebill@estats.ctbcbank.com) 中國信託信用卡電子帳單"
```

{% darrellImage800 n8n_gmail-demo-credit_card-trigger n8n_gmail-demo-credit_card-trigger.png max-800 %}


2. PDF 附件自動解析
```javascript
// Extract From File 節點設定
{
  "operation": "pdf",
  "binaryPropertyName": "data_0", 
  "options": {
    "joinPages": true,
    "maxPages": 3,
    "password": "身分證字號" // 部分銀行需要
  }
}
```

{% darrellImage800 n8n_gmail-demo-credit_card-process_pdf n8n_gmail-demo-credit_card-process_pdf.png max-400 %}


3. 正規表達式提取帳單資訊
```javascript
// 永豐銀行範例
payment_due_date: $json["text"].match(/繳款截止日\s(\d{4}\/\d{2}\/\d{2})/)[1]
payment_amount: parseInt($json["text"].match(/本期應繳總金額\s(\d{1,3}(?:,\d{3})*)/)[1].replace(/,/g, ""))
minimum_payment: parseInt($json["text"].match(/本期最低應繳金額\s(\d{1,3}(?:,\d{3})*)/)[1].replace(/,/g, ""))
```

{% darrellImage800 n8n_gmail-demo-credit_card-set_field_bill_data n8n_gmail-demo-credit_card-set_field_bill_data.png max-800 %}

4. Google Calendar 自動建立事件
```javascript
{
  "calendar": "信用卡繳費專用日曆",
  "start": "{{ $json.payment_due_date }}",
  "summary": "{{ $json.email_subject }}",
  "description": "應繳金額: {{ $json.payment_amount }}\n最低應繳: {{ $json.minimum_payment }}",
  "reminders": [
    {"method": "popup", "minutes": 30},    
    {"method": "popup", "minutes": 1800},    
    {"method": "popup", "minutes": 3600} 
  ]
}
```

{% darrellImage800 n8n_gmail-demo-credit_card-create_calendar n8n_gmail-demo-credit_card-create_calendar.png max-800 %}


實測效果：
每月在日曆上都能看到什麼時候該繳費，要繳多少錢！
這些資訊也會同步儲存到一個 Google Sheet 中，輕鬆計算每月的信用卡總支出

{% darrellImage800 n8n_gmail-demo-credit_card-sheet_view n8n_gmail-demo-credit_card-sheet_view.png max-800 %}

{% darrellImage800 n8n_gmail-demo-credit_card-calendar_view n8n_gmail-demo-credit_card-calendar_view.png max-800 %}


注意事項：
- 部分銀行會變更 PDF 格式，可以增加 error workflow 來通知是否失敗
- 建議設定失敗通知，避免遺漏重要帳單


## 相關文章推薦

{% articleCard 
  url="https://www.darrelltw.com/tools/n8n_template/model-detail.html?model=creditcard" 
  title="別忘記繳費:信用卡帳單自動建日曆提醒" 
  previewText="n8n 模板:別忘記繳費:信用卡帳單自動建日曆提醒" 
  thumbnail="https://www.darrelltw.com/tools/n8n_template/data/bg/creditcard.webp" 
%}

{% articleCard 
  url="/n8n-webhook/" 
  title="n8n Webhook 節點完整教學" 
  previewText="學會 Webhook 節點，讓外部系統輕鬆觸發你的 Gmail 自動化流程" 
  thumbnail="https://www.darrelltw.com/n8n-webhook/blog-n8n-webhook-bg.jpg" 
%}

## 總結

Google Gemini 雖然開始支援對 Gmail 做一些 AI 處理
但是從自己的自動化經驗來看，使用 n8n 來自動化 Gmail 的一些場景能做到高度客製化
又避免了 AI 誤判的狀況

尤其 Gmail Trigger 設定後自動監測是否有新的 Email 進到信箱
並自動根據需求處理這點真的很方便！

有任何問題歡迎在下方留言