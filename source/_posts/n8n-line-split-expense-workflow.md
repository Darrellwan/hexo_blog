---
title: n8n 模板分享 - 打造 LINE 共同記帳機器人 自動處理日本收據
date: 2025-04-20 15:30:00
tags:
  - n8n
  - n8n 模板
  - LINE
categories:
  - Automation
page_type: post
id: n8n-line-split-expense-workflow
description: 透過 n8n 工作流平台結合 LINE 機器人和 AI 技術，打造一個專為日本旅行設計的自動化記帳系統。只需拍照上傳日本收據，就會自動翻譯日文、換算匯率，並提供分帳功能，讓旅行的記帳變得簡單。
bgImage: blog-n8n-line_expense_japan-bg.jpg
preload:
  - blog-n8n-line_expense_japan-bg.jpg
thumbnail: /gallery/thumbnails/n8n-line-split-expense.jpg
---

{% darrellImageCover blog-n8n-line_expense_japan-bg blog-n8n-line_expense_japan-bg.jpg max-800 %}

## 前因

這次自動化的原因是發現會去日本大約一週以上
記得在日本任何消費大部分都會有收據
但收據上都是日文

記帳這件事情就變得很麻煩
1. 你得拍照給 AI 請他翻譯項目和取得金額
2. 在複製到自己的記帳(可能是記帳程式，也可能是 Google Sheet)

這樣逐一操作其實也蠻麻煩
於是就用 n8n 直接做成一個可以在 Line 的群組上使用的 Bot
讓我們可以直接拍照上傳收據，他就接著處理完辨識和紀錄到需要的地方(模板會以 Google Sheet 示範)

{% templateCard id="line-receipt-auto-record" title="Line 收據AI辨識自動記帳工作流" description="自動處理收據照片並提取資訊進行記帳的 n8n 工作流模板" thumbnail="/tools/n8n_template/data/bg/n8n_japan_receipt_ai_recognition_expense_sharing.webp" tags="Line,AI,記帳,自動化" nodeCount="12" updatedAt="2025-04-21" %} 

## 主要功能

這個 LINE 共同記帳機器人具有以下專為日本旅行設計的功能：

1. **收據辨識**：拍照上傳日本收據，AI 自動辨識日文內容
2. **文字輸入**：除了拍照外，也支援直接輸入文字記錄消費
3. **自動翻譯**：將日文收據內容翻譯為繁體中文，方便閱讀和記錄
4. **匯率換算**：自動將日圓金額換算為新台幣（固定匯率 1 日圓 = 0.22 新台幣）
5. **多人拆帳**：支援單獨記帳或多人平均拆帳，自動計算每人應付金額
6. **資料存儲**：所有記帳資料自動儲存到 Google Sheets 中，方便後續查詢和統計

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1077097375?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8n line ai expense tracker"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

## 技術架構

{% darrellImage blog-n8n-line_expense-structure blog-n8n-line_expense-structure.png max-800 %}

整個系統使用了以下技術和服務：

- **n8n**：作為工作流自動化平台，處理所有業務邏輯
- **LINE Messaging API**：接收用戶訊息並發送回覆，適合旅行中的即時使用
- **OpenAI API**：提供 AI 能力，用於辨識日文收據、翻譯內容
- **Google Sheets API**：作為資料儲存庫，記錄所有消費和拆帳信息
- **Slack**：用於系統日誌和錯誤報告

## 工作流程設計

整個工作流程大致可以分為三個主要部分：

### 1. 接收和處理 LINE 訊息

工作流程從 LINE Webhook 開始，當使用者在日本拍攝收據並發送到 LINE 時，n8n 會接收到這個事件。系統會先判斷收到的是什麼類型的訊息：

- 1️⃣ 如果是圖片（日本收據照片），會先取得圖片內容，然後傳送給 AI 模型辨識
- 2️⃣ 如果是文字，則直接傳給 AI 模型處理
- 3️⃣ 如果是用戶對之前記帳的回應（選擇拆帳、單獨或重試），則會進入拆帳處理流程

{% darrellImage n8n_line_check_first_step_is_image_or_split n8n_line_check_first_step_is_image_or_split.png max-400 %}

{% darrellImage n8n_line_check_message_is_text_or_not n8n_line_check_message_is_text_or_not.png max-800 %}


### 2. AI 辨識和記帳

AI 辨識部分使用 OpenAI 的模型，專門配置了處理日文收據的提示詞，從照片中提取以下資訊：

- **品項**：購買的日本商品或服務名稱（自動翻譯為中文）
- **金額**：消費的日圓金額，並自動換算為新台幣
- **日期時間**：消費發生的時間
- **地點**：消費發生的日本商店或場所名稱（自動翻譯為中文）

系統會將這些經過處理的資訊整理後寫入 Google Sheets 的主記帳表中，並回傳給用戶確認訊息，同時提供拆帳選項。

{% darrellImage n8n_ai_image_text_recognize_prompt_model n8n_ai_image_text_recognize_prompt_model.png max-800 %}

{% darrellImage n8n_check_ai_result_and_record_in_google_sheet n8n_check_ai_result_and_record_in_google_sheet.png max-800 %}

### 3. 拆帳處理

當用戶選擇拆帳選項後，系統會：

1. 查詢原始記帳資料
2. 從用戶資料表中獲取同行旅伴的資訊
3. 根據旅伴人數平均分配金額（處理無法整除的情況）
4. 為每個旅伴創建一條記帳記錄
5. 將所有拆帳記錄寫入 Google Sheets 的拆帳表中

{% darrellImage n8n_split_or_retry_flow n8n_split_or_retry_flow.png max-800 %}

## 關鍵節點詳解


### AI Agent 節點

使用 OpenAI 的模型來分析日本收據圖片或文字。系統精心設計了提示詞，專門針對日本收據的特點，讓 AI 能夠準確提取記帳所需的資訊，並進行日圓換算與日文翻譯。提示詞包含以下規則：

```
請嚴格遵守以下規則進行收據資訊擷取與填寫：

1. 品項（item）：若收據上有多個品項，請將品項名稱用「逗號」分隔填入此欄位。

2. 金額（amount）：填寫收據上顯示的總金額（含稅）。若圖片上的貨幣單位為日圓（¥），請將金額換算為新台幣（TWD），匯率為「1 JPY = 0.22 TWD」，並四捨五入至整數。

3. 日期時間（datetime）：
   - 若圖片中有明確的記帳時間，請將其轉換為「yyyy-MM-dd HH:mm:ss」格式。
   - 若無法找到明確時間，使用現在時間。

4. 地點（place）：填寫完整店名與地址。若地址不完整或未提供，至少填寫店名。

5. 翻譯規則：
   - 所有日文內容請翻譯為繁體中文。
   - 若遇到特殊的日文品牌名（如：「クナイプ」、「きき湯」等非食品品牌），請保留其真實商品特性，避免誤譯。
```

### 分帳邏輯

系統使用 JavaScript 來處理拆帳金額的計算，確保金額可以平均分配：

```javascript
const amount = $('Sheet-get_data').item.json.amount;
const count = $('Aggregate').item.json.line_user_id.length;
const base = Math.floor(amount / count);
const remainder = amount % count;
return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
```

這段 code 確保了即使金額不能被平均分配，剩餘的金額也會被合理分配給每位旅伴。

## 使用測試心得

這次回過頭計算一下
剛好在日本這趟旅程中執行了快 100 次的記帳自動化
每次預計省下 1-2 分鐘的話
大約就省下 150 分鐘左右(1.5 小時 -> 取平均)

那時用了 ChatGPT 4o 的模型來做圖片分析跟翻譯
API 費用從 console 看來**不到 50 元台幣**
回台後把這個模板改成用 GPT-4.1 mini，有望再省下不少 API 成本

之前用 4o 遇到的問題時 10 筆可能會有一兩次翻譯商品的部分錯誤的比較嚴重
沒有啤酒的也會翻譯出啤酒，或是辨識的時候偶爾會有問題
改用 4.1 mini 希望未來的測試會有所改善

{% darrellImage n8n-use_expense_workflow_result_with_analyze n8n-use_expense_workflow_result_with_analyze.png max-800 %}

## 可以改進的方向

目前系統已經能夠滿足日本旅行的基本記帳需求，但仍有改進空間：

1. **動態匯率**：接入即時匯率API，替代固定匯率換算
2. **多種貨幣支持**：擴展到其他國家的貨幣和語言
3. **旅行統計分析**：提供每日消費趨勢、消費類別分析等功能

{% darrellImage blog-n8n-line_expense_future_features blog-n8n-line_expense_future_features.png max-800 %}

## 結語

做自動化好玩的地方：就是在解決這種自己實際會遇到的麻煩事情
思考一下哪些事情看起來很麻煩、又很重複性
再去想整個過程到底做了哪些事情
拆解後，再去看看工具能怎麼幫上你
接著就嘗試去做做看，遇到什麼困難或卡住
歡迎透過下方連結找我討論！

{% darrellImage automation_thinking_by_chatgpt automation_thinking_by_chatgpt.jpg max-800 %}

