---
title: n8n Google Sheets 節點教學
tags:
  - n8n
  - n8n節點介紹
  - n8n教學
  - Google Sheets
  - 自動化
categories:
  - n8n
page_type: post
id: n8n-google-sheets-node
description: n8n Google Sheets 節點完整教學。6 個操作怎麼選（含決策樹）、Trigger polling 限制說明，以及 Gmail 電子發票 AI 自動解析去重實戰案例。
bgImage: blog-n8n-google-sheets-bg.jpg
preload:
  - blog-n8n-google-sheets-bg.jpg
date: 2026-05-09 10:00:00
modified: 2026-05-10 10:00:00
---

{% darrellImageCover n8n-google-sheets-node-bg blog-n8n-google-sheets-bg.jpg max-800 %}

**預計閱讀時間：** 8-12 分鐘
**適合對象：** 已經有 n8n 基礎，想把試算表當資料庫用的朋友

**你將學到：**
- Google Sheets 節點 6 個操作怎麼選（含決策樹）
- Append、Get Rows、Append or Update 三大核心操作實測
- Google Sheets Trigger 的 polling 限制與對策
- 掛 AI Agent 當 Tool 的新玩法
- 實戰：Gmail 電子發票自動去重記錄

**如果趕時間，可以跳到**
{% quickNav %}
[
  {
    "text": "功能介紹",
    "anchor": "features",
    "desc": "6 個操作 + 決策樹"
  },
  {
    "text": "Trigger 節點",
    "anchor": "trigger",
    "desc": "polling 限制要知道"
  },
  {
    "text": "實戰教學",
    "anchor": "setup",
    "desc": "OAuth 與憑證"
  },
  {
    "text": "實戰案例",
    "anchor": "example",
    "desc": "Gmail 發票自動記錄"
  },
  {
    "text": "錯誤修正",
    "anchor": "errors",
    "desc": "503 / 429 常見錯誤"
  },
  {
    "text": "常見問題",
    "anchor": "faq",
    "desc": "踩坑解法"
  }
]
{% endquickNav %}

---

<h2 id="features">Google Sheets 節點功能介紹</h2>

你有沒有遇過類似的場景：
每天從 Email 收來的訂單要一筆一筆複製到 Google Sheets 中，或是要手動 key in 其他系統的資料到 Google Sheets

Google Sheets 其實是一個好用的「輕量資料庫」，對個人和小團隊來說很多時候比真的建一個資料庫還方便。

n8n 的 Google Sheets 節點可以幫你自動化這些流程。這篇會帶你看完 6 個操作、 1 個 Gmail 電子發票實戰案例，實測完你會發現大部分 Excel / Google Sheets 日常都能自動化掉。

### Resource 二層結構：Document vs Sheet Within Document

n8n 把 Google Sheets 節點的操作拆成兩層：

{% dataTable style="minimal" align="left" %}
[
  {"Resource": "Document（整份試算表層）", "能做什麼": "新增一份新的、刪除整個檔案", "使用情境": "自動化建立報表檔、每月新開一份"},
  {"Resource": "Sheet Within Document（單 sheet 內）", "能做什麼": "Append / Append or Update / Get Rows / Update / Delete / Clear 等 6 種操作", "使用情境": "日常資料讀寫，95% 時間都在這層"}
]
{% enddataTable %}

{% darrellImage800Alt "Google Sheets 節點 Resource 選單" google_sheets_account_sheet_within_document.png max-800 %}

大部分時間都會使用 **Sheet Within Document** ，但 Document 層在「自動化每月產生一份新報表」這種場景就會派上用場。

### 操作 1：Append Row

最簡單的新增操作：把資料加到試算表最後一列，不管前面有幾筆。

{% darrellImage800Alt "Google Sheets Append Row 設定畫面" n8n_google_sheets_append_row_parameters.png max-800 %}

**關鍵參數：**

- **Document**：選試算表（列表 / URL / ID 三種選法都可以）
- **Sheet**：選 sheet 分頁
- **Mapping Column Mode**：資料怎麼對應到欄位（下面有獨立專區詳說）

Append 適合無腦新增的情境，例如 log 或是大量資料搜集。
資料直接新增到最後一列，我自己常用在紀錄執行的情況確認，
用 Append 的好處是如果看到重複的資料，代表可能被重複觸發等等，也需要多加確認觀察

{% callout error %}
如果是同一筆資料已經存在，還是會新增一筆新的，無法判斷比較，有這種需求請用 Append or Update Row。
{% endcallout %}

### 操作 2：Get Rows

讀整個 sheet 的資料，或用欄位值做簡單篩選。

**關鍵參數：**

- **Data Location on Sheet**：自動偵測 header row、第一筆資料列和最後一列，不同格式的試算表可以自訂
- **Filters**：用欄位值做精確比對，每個條件是 `Column` + `Value`
- **Combine Filters**：多個條件用 `AND` 或 `OR` 組合

**Filters 適合的情境：**

- `城市` 等於 `台北`
- `狀態` 等於 `active`
- 多條件精確比對：加多個 filter，再用 `Combine Filters` 選 `AND` 或 `OR`

目前在 Google Sheet 的 Get Rows 對於篩選資料的彈性還是很不夠
例如簡單篩選多個值得比較，像是時間欄位 > 某個日期等等
通常會全部撈回來再用 `Filter`, `If` 等等節點再做篩選
跟一般資料庫的用法這點比較麻煩

### 操作 3：Append or Update Row

實際跑 n8n 這段時間，6 個操作裡面 {% term def="有就更新、沒有就新增，避免資料重複寫入" %}Append or Update Row{% endterm %} 是最常用的一個。

**核心概念：** n8n 拿進來的資料，去 Sheet 裡找有沒有一樣的值。找到就更新那一列，找不到就 Append 新的一列。

{% darrellImage800Alt "Google Sheets Append or Update Row 設定畫面" n8n_append_or_update_row_google_sheets_settings.png max-800 %}

**關鍵參數：Column to Match on**

這是 Update 的關鍵。下拉選單會列出 Sheet 的所有 header，你選哪個當比對欄位，就決定了資料去重的比較邏輯。

{% darrellImage800Alt "Column to Match on 下拉選單示意" google_sheets_column_match_dropdown.png max-800 %}

⚠️ **Match 欄位必須唯一，不然會改錯人**

好的範例：用「訂單編號」「發票號碼」「Email」這種本來就不會重複的欄位。
不好的範例：用「金額」當 Match Column，兩筆金額一樣的訂單會互相覆蓋。

**什麼時候該用 Append or Update Row**

- Gmail 觸發的 workflow，怕同一封信重複觸發寫入
- 排程每小時抓 API，怕同一筆資料重複進試算表
- 客戶資料同步，同一個 email 只要留最新的一筆

後面的實戰案例就是 Append or Update Row 的經典用法（Gmail 電子發票去重），想直接看實作可以跳過去。


### 其他操作一覽

剩下 3 個操作使用頻率較低，用表格帶過：

{% dataTable style="minimal" align="left" %}
[
  {"操作": "Update Row", "說明": "更新指定列", "什麼時候用": "只需要更新，不需要新增"},
  {"操作": "Delete Rows or Columns", "說明": "刪除整列或整欄", "什麼時候用": "清理舊資料、移除不要的欄位"},
  {"操作": "Clear", "說明": "清空內容但保留欄位格式與 header", "什麼時候用": "每月清空重寫、保留欄位結構"}
]
{% enddataTable %}

💡 Clear 和 Delete 差在哪：Clear 會把整個 Sheet 都清空；Delete 是刪除整列或整欄

### 決策樹：我該選哪個 operation？

6 個操作看完可能還是霧煞煞，這張決策樹幫你快速選：

{% darrellImage800Alt "Google Sheets 節點 Operation 決策樹" sheets_operation_decision_tree.webp max-800 %}

**文字版速查：**

- 寫入怕重複（發票、訂單、Email） → **Append or Update**
- 寫入不怕重複（log、留言） → **Append Row**
- 讀取 → **Get Rows**（簡單精確比對用 Filters；複雜條件接 Filter 節點）
- 修改已知列 → **Update Row**
- 清內容留格式 → **Clear**
- 刪整列整欄 → **Delete Rows or Columns**

---

<h2 id="trigger">Google Sheets Trigger 節點</h2>

先釐清一件事：`Google Sheets Trigger` 和上面介紹的 `Google Sheets` 節點是**兩個完全不同的節點**，在 n8n 節點列表裡要分開搜尋。Trigger 節點的用途是「監聽 Sheet 有沒有新資料或被修改」，自動觸發 workflow。

{% darrellImage800Alt "Google Sheets Trigger 事件選單" triggers_on_row_added_updated_google_sheets.png max-800 %}

**3 個事件類型：**

- **Row Added**：有新的一列加進去才觸發
- **Row Updated**：有既有列被修改才觸發
- **Row Added or Updated**：兩種都觸發（最常用）

{% darrellImage800Alt "Google Sheets Trigger Row Added 下拉選單" n8n_google_sheets_trigger_row_added_dropdown.png max-800 %}

還有一個蠻實用的進階參數：`Columns to Watch`。填了某幾個欄位名稱之後，只有**那幾欄的值變動**才觸發，其他欄位改了不管。這個在「有幾十欄但只想監聽狀態欄」這類場景很省事。

{% darrellImage800Alt "Google Sheets Trigger polling 時間設定" n8n_google_sheets_trigger_poll_times_dropdown.png max-800 %}

{% callout warning %}
**Trigger 最快只能 1 分鐘觸發一次。** 這是 {% term def="n8n 定期詢問外部服務有沒有新資料，而不是等外部服務主動通知" %}polling{% endterm %} 的硬限制，不是設定問題。如果你的需求是「同事改了試算表某格就要馬上發 Slack 通知」這種即時場景，等 1 分鐘才跑通常是不夠的。即時需求的做法：在 Google Apps Script 裡用 `onEdit` ⭐ 觸發器，有變動就打 n8n 的 Webhook URL，這樣可以做到秒級觸發。
{% endcallout %}

---

<h2 id="setup">實戰教學</h2>

### 案例的需求

財政部每次開電子發票都會寄一封 Email。月底想統計這個月花了多少，一封一封開來看很麻煩，但手動複製到 Excel 更煩。加上 Gmail Trigger 有時候會重複觸發同一封信，直接 Append 的話同一筆發票就進去兩筆，對帳更亂。

這個 workflow 的解法：**讓 AI 解析發票內容、用 Append or Update 寫進 Google Sheets**，發票號碼當 unique key，不管重複觸發幾次，Sheet 裡都只有一筆。

### 實戰範例：AI 自動解析發票寫進 Sheets

{% darrellImage800Alt "Gmail 電子發票轉存 Google Sheets workflow 示意" gmail_ai_workflow_diagram.png max-800 %}

整體流程是：**Gmail Trigger → 解析附件 → AI 結構化解析 → Google Sheets Append or Update**。

AI Parser 的部分（用 xAI Grok 從 XML 格式的電子發票抓出欄位）這篇先跳過，重點放 Google Sheets 那段。想看完整 workflow 含 AI 設定的，可以去模板庫：

{% articleCard url="/tools/n8n_template/model/gmail_parse_invoice_to_sheet_and_analyze.html" title="Gmail 電子發票轉存 Google Sheet + AI 分析消費" previewText="自動解析財政部電子發票 Email，用 AI 抽取發票號碼、商家、金額，Append or Update 寫進 Google Sheets，附 xAI 消費分析。" thumbnail="https://www.darrelltw.com/tools/n8n_template/data/bg/gmail_parse_invoice_to_sheet_and_analyze.webp" %}

### 重點 1：為什麼用 Append or Update 不用 Append？

Gmail Trigger 偶爾會重複抓到同一封信（例如你更改了 workflow 重新執行）。用 Append 的話，同一張發票就進去兩筆，對帳時就麻煩了。

改用 **Append or Update Row**，以「發票號碼」當比對欄位。相同發票號碼進來的時候，n8n 找到那列就 update，找不到才 append 新的一列。不管 Gmail Trigger 重複幾次，Sheet 裡的發票號碼永遠不會重複。

### 重點 2：Column to Match on 設定

Column to Match on 下拉選單會列出你試算表的所有 header，選「**發票號碼**」就對了。

不要選「金額」當 match column：不同店家的發票金額可能一樣（例如剛好都是 79 元），選金額當比對欄位的話，新的 79 元發票進來就會把舊的那筆蓋掉。

### 重點 3：Mapping mode 選 Define below

AI 輸出的 JSON 欄位名通常和你 Sheet 的 header 不一致。舉例：AI 輸出 `invoice_number`，但 Sheet header 叫「發票號碼」，Auto-map 就對不上了。

這個 workflow 統一用 **Define below（逐欄手動對應）**，每一欄用 expression 明確指定 AI 輸出的哪個 key 對應 Sheet 的哪個欄位，上游怎麼命名都無所謂。

---

<h2 id="errors">常見錯誤修正</h2>

### 503 Service Unavailable：開 Retry On Fail

執行時偶爾會出現 503，是 Google 服務端的暫時性問題
這很麻煩，因為目前觀察的出現頻率可能是幾天突然出現一次
必須要在設定時就先加以排除或是防範！

修法：節點的 **Settings**，開啟 **Retry On Fail**，Max Tries 設 3、Wait Between Tries 設 2000（2 秒）
意思是失敗的話，我們會等待兩秒再試一次，最多嘗試三次
你也可以調整頻率跟次數，如果資料很重要，也可以把 **on error** 另外錯誤處理的設定

{% darrellImage800Alt "Google Sheets 節點 Settings tab：Retry On Fail 開啟、Max Tries 3、Wait 2000ms" n8n_google_sheets_retry_on_fail_settings.png max-800 %}

### 429 Too Many Requests：開 Minimise API Calls

大量寫入時被 rate limit 擋住，出現 429。解法：Append / Append or Update 節點的 **Options** 裡開啟 **Minimise API Calls**，n8n 會把多筆資料合併成一次 API 請求送出，減少打 Google API 的次數。

---

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "OAuth 授權一直失敗，一直跳 redirect_uri_mismatch，怎麼辦？",
    "answer": "九成是 redirect URI 不一致造成的。做法：先去 n8n Credentials 設定畫面，把 OAuth Redirect URL 完整複製起來（注意 http/https、結尾有沒有斜線），然後回 Google Cloud Console → APIs & Services → Credentials → 找你的 OAuth 用戶端 ID → 編輯 → 把剛才複製的 URI 貼進「已授權的重新導向 URI」。兩邊必須完全一致，包含大小寫。"
  },
  {
    "question": "執行 Append Row 或 Append or Update Row 的時候出現 Service unavailable 錯誤，是什麼問題？",
    "answer": "這個 503 錯誤是 Google 服務端的暫時性問題，不是你的 API 配額超過（配額超過是 HTTP 429，完全不同的錯）。解法：節點 Settings tab 開啟 Retry On Fail，Max Tries 設 3、Wait Between Tries 設 2000（2 秒），絕大多數情況自動重試就過了。"
  },
  {
    "question": "用 Get Rows 讀資料，只讀到一半就沒了，後面的資料呢？",
    "answer": "先到 Get Many 的 Options 檢查 Data Location on Sheet，尤其是「Read Rows Until」。新版 n8n 通常會自動偵測到 sheet 最後一列；如果你用的是舊 workflow 或讀取範圍被改過，把「Read Rows Until」明確設成「Last Row In Sheet」再測。另一個方式是把試算表裡不小心留下的空列清掉，讓資料連續。"
  },
  {
    "question": "大量寫入試算表很慢，有辦法加速嗎？Google Sheets API 有限制嗎？",
    "answer": "Google Sheets API 的配額限制是：每分鐘每個專案 300 個請求、每分鐘每個使用者 60 個請求（沒有明文的單次 request size 硬性限制，但官方建議 payload 控制在 2MB 以內比較穩）。大量寫入建議兩個做法：1. 在 Append / Append or Update 節點的 Options 打開「Minimise API Calls」，可以少打幾次 API；2. 前面加 Split in Batches 節點，把大批資料拆成每批 20-30 筆，批次之間加個 Wait 節點等 1-2 秒，避免一次送太多請求被 rate limit 擋。"
  },
  {
    "question": "Google Sheets Trigger 為什麼要等 1 分鐘才觸發？能不能快一點？",
    "answer": "這是 polling 的硬限制，Trigger 節點每隔一段時間才去問 Google 有沒有新資料，最短間隔就是 1 分鐘，設定裡改不了。想要秒級即時觸發，做法是：在 Google Apps Script 裡設一個 onEdit 或 onChange 觸發器，有變動就用 UrlFetchApp 打你的 n8n Webhook URL，n8n 這邊改用 Webhook Trigger 接。這樣可以做到幾秒內觸發。"
  }
]
{% endfaq %}

---

## 相關推薦

{% articleCard url="/n8n-gmail-node/" title="n8n Gmail 節點教學 - 自動化收發信與附件處理" previewText="搭配本文實戰案例使用，Gmail Trigger 的設定方式、附件下載、Filter 等進階功能都在這篇。" thumbnail="https://www.darrelltw.com/n8n-gmail-node/blog-n8n-gmail-bg.jpg" %}

{% articleCard url="/n8n-line-split-expense-workflow/" title="用 n8n 自動記錄 LINE 分帳到 Google Sheets" previewText="另一個 Google Sheets 記帳場景：出遊費用透過 LINE 機器人自動拆算、記錄試算表，不用手動算。" thumbnail="https://www.darrelltw.com/n8n-line-split-expense-workflow/blog-n8n-line_expense_japan-bg.jpg" %}

{% articleCard url="/n8n-set-node/" title="n8n Set 節點教學 - 整理欄位、重命名、清理資料" previewText="在 Append / Append or Update 之前用 Set 節點整理欄位名稱，讓上游資料和 Sheet header 對上，Auto-map 才能正常運作。" thumbnail="https://www.darrelltw.com/n8n-set-node/blog-n8n-line-set_field-bg.jpg" %}

---

## 總結

Google Sheets 節點是 n8n 裡用途最廣的節點之一，對個人和小團隊來說它就是一個隨手可用的輕量資料庫。搞懂 Append、Get Rows、Append or Update 三個核心操作，加上 Mapping mode 怎麼選，大部分日常試算表自動化都能搞定。遇到需要監聽變動的場景，Trigger 節點可以接上，只是要記住 1 分鐘 polling 的限制。想再往上走，4.x 的 AI Agent Tool 整合也已經就位，等我之後出 AI Agent 專文再一起玩。
