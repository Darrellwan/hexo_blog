---
title: n8n 爬蟲神器 Apify 教學：不會寫程式也能爬資料
tags:
  - n8n
  - n8n節點介紹
  - n8n教學
  - Apify
categories:
  - n8n
page_type: post
id: n8n-apify-node
description: 完整教學 n8n Apify 節點實現網頁爬蟲自動化。包含 API Token 設定、Run Actor 操作、Instagram 數據爬取等功能介紹。實測別人 IG 帳號發文數據自動同步到 Google Sheets 案例。
bgImage: blog-n8n-apify-node-bg.jpg
preload:
  - blog-n8n-apify-node-bg.jpg
date: 2026-01-13 17:36:00
modified: 2026-01-13 17:36:00
---

{% darrellImageCover n8n-apify-node-bg blog-n8n-apify-node-bg.jpg%}

> Apify 節點讓你在 n8n 中直接調用現成的爬蟲，自動爬取 TikTok、Instagram、Youtube 等等資料，完全不用自己從頭開始寫程式。

**預計閱讀時間：** 8-10 分鐘

**你將學到：**
- Apify 的 Actor（爬蟲程式）和 Dataset（資料集）核心概念
- API Token（金鑰）申請與 n8n Credentials（憑證）設定
- Run Actor 和 Scrape Single URL 實際操作
- 案例：Instagram 競爭對手數據自動同步到 Google Sheets

**如果趕時間，可以跳到**
{% quickNav %}
[
  {
    "text": "Apify 是什麼",
    "anchor": "what-is-apify",
    "desc": "Actor 和 Dataset 概念"
  },
  {
    "text": "設定教學",
    "anchor": "credentials-setup",
    "desc": "API Token 申請與連線"
  },
  {
    "text": "功能介紹",
    "anchor": "apify-features",
    "desc": "Run Actor、Scrape URL"
  },
  {
    "text": "實戰案例",
    "anchor": "case-study",
    "desc": "Instagram 競爭對手追蹤"
  },
  {
    "text": "常見問題",
    "anchor": "faq",
    "desc": "FAQ"
  }
]
{% endquickNav %}

---

你有沒有遇過這種情況？

想要定期追蹤競爭對手的社群數據，但每次都要手動複製貼上
更麻煩的是研究了 API 文件後卻發現，根本做不到！
像是 Meta API 只能取得自己帳號的數據。

況且這些平台也都會有很嚴格的反爬蟲機制，
就算是學過基礎的爬蟲，也會發現很難取得自己想要的資料。

**Apify 可以解決很多爬蟲的痛點**

{% darrellImage800Alt "自己寫爬蟲 vs 用 Apify 的差別" n8n_apify-comparison.webp max-800 %}


<h2 id="what-is-apify">Apify 是什麼？</h2>

他是個爬蟲的平台，你可以想像成 App Store 或 Google Play。
大家可以把自已做好的爬蟲(應用程式)上傳到 Apify。
在 Apify 中他不是叫做 App，它叫做 **Actor**（演員，但在這裡指的是「爬蟲程式」）

更有趣的是，同一種爬蟲會有多個相似的 Actor
每個 Actor 之間會因為熱門的程度或是功能的差異，而有不同的計算價格方式。

{% callout info %}
Apify 可以爬哪些網站？
- TikTok
- Instagram
- Facebook
- Threads
- X (Twitter)
- Youtube
- Amazon
- Google Maps
{% endcallout %}

{% darrellImage800Alt "Apify 首頁 - 各種現成的爬蟲 Actor" n8n_apify-homepage.jpg max-800 %}

### Actor = 爬蟲程式

Actor 可以想像成「外送平台上的餐廳」，當你想要取得一份餐點時：
- 先選餐廳（資料的平台，像是 Instagram、Youtube 等等）
- 選擇餐點（選擇 Actor，例如爬貼文還是爬帳號）
- 付款下單（設定參數並執行）
- 等餐點送到（等待爬取結果）

{% darrellImage800Alt "Apify Store 內有各種現成的爬蟲可以選擇" n8n_apify-store.png max-800 %}

### Dataset = 爬取的資料

每次 Actor 執行完，結果會存放在 Dataset（資料集）中。
像是一個 **暫存的資料表**，資料會保留 7 天讓你取用。

{% callout tip title="進階：Dataset 保留時間可以延長" %}
7 天是免費方案的預設值。如果你需要更長的保留時間，可以在 Actor 設定中調整 `datasetRetentionDays` 參數，或升級付費方案。
{% endcallout %}

### Apify vs HTTP Request：什麼時候用哪個？

如果你不知道 HTTP Request 是什麼，可以先跳過這段，直接看[設定教學](#credentials-setup)。

{% dataTable style="minimal" highlight="2" %}
[
  {"情境": "爬取靜態網頁", "推薦": "HTTP Request", "原因": "簡單直接，不需額外費用"},
  {"情境": "爬取需要 JavaScript 渲染的頁面", "推薦": "Apify", "原因": "內建 headless browser（無頭瀏覽器）"},
  {"情境": "爬取有反爬機制的網站", "推薦": "Apify", "原因": "內建 proxy（代理伺服器）和反偵測"},
  {"情境": "爬取社群平台 (Meta/X)", "推薦": "Apify", "原因": "專門的 Actor 已處理好複雜邏輯"}
]
{% enddataTable %}

---

<h2 id="credentials-setup">API Token 申請與 n8n 設定</h2>

### Step 1：取得 Apify API Token

API Token（API 金鑰）是讓 n8n 能夠連接到你的 Apify 帳號的通行證。

1. 到 [Apify Console](https://console.apify.com/) 註冊帳號（免費方案每月有 $5 USD 額度，不用綁信用卡）
2. 進入 **Settings > API & Integrations**
3. 在 **Personal API tokens** 複製 token

{% darrellImage800Alt "Apify Console 的 API Token 設定頁面" n8n_apify-api-token-setup.jpg max-800 %}

### Step 2：在 n8n 設定 Credentials

Credentials（憑證）是 n8n 用來儲存各種服務帳號資訊的地方。

1. 在 n8n 左側選單進入 **Credentials**（憑證）
2. 點選 **Add Credential**（新增憑證）並搜尋「Apify API」
3. 貼上剛才複製的 API Token
4. 點 **Save** 後測試連線

{% darrellImage800Alt "n8n 新增 Credential 搜尋 Apify" n8n_apify-credential-search.jpg max-800 %}

{% darrellImage800Alt "n8n 中填入 Apify API Key" n8n_apify-credential-config.jpg max-800 %}

相關文件可以參考 [Apify n8n 整合文件](https://docs.apify.com/platform/integrations/n8n)。

---

<h2 id="apify-features">n8n Apify 節點功能介紹</h2>

Apify 的 n8n 節點提供蠻多操作，
但我們挑選三個最常用的功能來介紹。

### Run Actor and get dataset items

這是最常用的操作——啟動 Actor、等它跑完、直接拿結果，一步到位。

{% darrellImage800Alt "Run Actor and get dataset items 設定畫面" n8n_apify-run-actor.jpg max-800 %}

{% darrellImage800Alt "Run Actor and get dataset items 完整設定" n8n_apify-run-actor-get-dataset.png max-800 %}

使用場景：
- 定時爬取社群數據
- 收集競爭對手資訊
- 取得特定關鍵字的 LinkedIn 職缺

參數說明：
- **Actor Source**：有兩種！
1. Apify Store Actors
可以用名字直接搜尋所有的 Actor
2. Recently Used Actors
只會顯示最近使用過的，例如你在 Apify 網頁版先試跑過的 Actor

{% darrellImage800Alt "在 n8n 中選擇 Actor Source 類型" n8n_apify-store-actors-selection.png max-400 %}

- **Actor**：
如果用 ID 的話取得比較麻煩：
點開 Actor 後，在 URL 中可以找到 ID，格式像 `https://console.apify.com/actors/{{actor_id}}/`
以這個例子為例
`https://console.apify.com/actors/h7sDV53CddomktSi5/input`
當中的 **h7sDV53CddomktSi5** 就是 ID
也可以直接用 list 來選或是搜尋喔

{% darrellImage800Alt "搜尋 YouTube Scraper Actor" n8n_apify-youtube-scraper-selection.png max-400 %}

- **Input JSON**：Actor 需要的 JSON（一種資料格式）參數
通常我的習慣都會是在 Apify 根據 Actor 的說明先測試
舉例這是一個 YouTube Scraper，在 Apify 網頁版可以先試跑看看參數怎麼設定：

{% darrellImage800Alt "在 n8n 中填入相同的 Input JSON" n8n_apify-youtube-input-n8n.png max-800 %}

測試成功後，把相同的 JSON 貼到 n8n 的 Input JSON 欄位：

{% darrellImage800Alt "Apify 網頁版 YouTube Scraper 的 Input 設定" n8n_apify-youtube-input-json.png max-800 %}

{% darrellImage800Alt "n8n 中直接貼上 JSON 參數" n8n_apify-input-json-paste.png max-800 %}

{% callout tip title="進階：Actor 執行失敗怎麼辦？" %}
如果 Actor 執行失敗，n8n 會顯示錯誤訊息。常見原因：
- **Input 參數格式錯誤**：檢查 JSON 是否有多餘的逗號或引號
- **額度用完**：到 Apify Console 查看剩餘額度
- **Actor 本身不穩定**：換一個類似功能的 Actor 試試

建議在 Workflow 中加入 [Error Workflow](/n8n-error-workflow/) 來處理失敗情況。
{% endcallout %}


### Scrape Single URL

這個其實是用 Apify 內建的 Website Content Crawler 來爬取單一頁面，會把內容轉成 Markdown 或 HTML。

{% darrellImage800Alt "Scrape Single URL 設定畫面" n8n_apify-scrape-url.jpg max-800 %}

{% darrellImage800Alt "Scrape Single URL 填入網址就能取得網頁 metadata" n8n_apify-scrape-url-result.png max-800 %}

適合場景：
- 新聞文章
- 部落格文章

{% callout info %}
跟 Actor 的差異在哪？
這個功能適合靜態網頁，他通常會需要自己處理 HTML 的 DOM 結構
例如我要的新聞標題在 `div` 的什麼 class 裡面
新聞內容在哪個 `div` 底下的 `p` 元素

如果要爬社群平台，還是建議用專門的 Actor。
{% endcallout %}

### Run Actor（進階用法）

跟上面不同的是，這個只負責「啟動」Actor，不會等它跑完。

什麼時候用？當 Actor 執行時間很長（例如爬幾千筆資料），可以搭配 **Apify Trigger** 來接收完成通知。

{% darrellImage800Alt "Run Actor vs Run Actor Get Dataset 的差異比喻" n8n_apify-run-actor-comparison.webp max-800 %}

{% callout info %}
舉個例子：
你去餐廳點餐時，如果是付完錢在旁邊等候餐點完成，這樣子就像是 `Run Actor and get dataset items`
但是如果他有給你一個感應器，會在餐點完成時發出通知，那就像是 `Run Actor` + `Apify Trigger` 的組合，
你手中拿的感應器就是一個 Webhook（網址回呼，當事情完成時自動通知你的機制）。
{% endcallout %}

{% callout tip title="進階：什麼時候該用 Run Actor + Trigger？" %}
當你需要爬取大量資料（例如 1000 筆以上），Actor 可能會執行超過 5 分鐘。這時候用 `Run Actor and get dataset items` 可能會 timeout（逾時）。

正確做法：
1. 用 `Run Actor` 啟動爬蟲
2. 設定 `Apify Trigger` 節點監聽完成事件
3. 完成後自動觸發後續處理

這樣可以避免 Workflow 卡住，也能處理更大量的資料。
{% endcallout %}


---

<h2 id="case-study">n8n Apify 實戰案例：Instagram 競爭對手追蹤</h2>

這個案例展示如何每週自動爬取競爭對手的 Instagram 貼文數據，並同步到 Google Sheets 做分析。

**流程：** Schedule Trigger（排程觸發器，設定每週自動執行）→ Apify Run Actor → [Set Node](/n8n-set-node/) 整理資料 → Google Sheets

{% darrellImage800Alt "Instagram 競爭對手追蹤 workflow 完整流程" n8n_apify-instagram-workflow.png max-800 %}

### Step 1：選擇 Instagram Scraper

到 [Apify Store](https://apify.com/store) 搜尋「Instagram」，官方的 `apify/instagram-scraper` 蠻穩定的：

{% dataTable style="minimal" highlight="1" %}
[
  {"可爬取類型": "posts", "說明": "貼文內容", "限制": "每帳號最多抓 20 筆（免費方案）"},
  {"可爬取類型": "comments", "說明": "貼文留言", "限制": "每篇最多 50 則"},
  {"可爬取類型": "details", "說明": "帳號詳細資訊", "限制": "粉絲數、追蹤數、簡介"},
  {"可爬取類型": "reels", "說明": "短影片", "限制": "-"}
]
{% enddataTable %}

{% callout tip title="進階：怎麼選擇 Actor？" %}
同一個平台（例如 Instagram）會有多個不同的 Actor，怎麼選？

1. **看評分和使用人數**：越多人用通常越穩定
2. **看價格**：有些 Actor 按筆數計費，有些按執行時間
3. **看維護頻率**：最近更新日期越近越好（社群平台常改版）
4. **先用免費額度測試**：跑幾次看回傳資料是否符合預期

官方 Actor（帳號名稱是 `apify/`）通常比較穩定，但價格可能較高。
{% endcallout %}

### Step 2：設定 Apify 節點

選擇 **Run Actor and get dataset items**，填入以下參數：

**Actor：** `apify/instagram-scraper`

追蹤特定帳號的設定，直接複製下面這段貼到 Input JSON 欄位：
```json
{
  "directUrls": [
    "https://www.instagram.com/competitor1/"
  ],
  "resultsType": "posts",
  "resultsLimit": 10,
  "onlyPostsNewerThan": "7 days"
}
```

把 `competitor1` 換成你想追蹤的帳號名稱就好。

{% darrellImage800Alt "Instagram Scraper 的 Input JSON 設定" n8n_apify-instagram-input.png max-800 %}

### Step 3：用 Set Node 整理資料

Instagram Scraper 回傳的資料欄位很多，用 Set Node 把需要的欄位整理出來。

**直接照著下面的截圖設定就好，不需要懂程式：**

{% darrellImage800Alt "Set Node 設定畫面 - 整理 Instagram 資料" n8n_apify-set-node-config.png max-800 %}

設定好之後，每筆資料會變成這樣的格式：
- 貼文 ID
- 帳號名稱
- 貼文內容（前 200 字）
- 按讚數
- 留言數
- Hashtag
- 貼文網址
- 發布時間

{% callout info %}
如果 Instagram 的按讚數顯示 -1，代表該用戶隱藏了按讚數，這是正常的。
{% endcallout %}


### Step 4：寫入 Google Sheets

最後用 Google Sheets 節點的 **Append Row**（新增一列）把資料寫進去。

{% darrellImage800Alt "Google Sheets Append or Update Row 設定" n8n_apify-sheets-config.png max-800 %}

{% darrellImage800Alt "爬取的 Instagram 數據寫入 Google Sheets 結果" n8n_apify-sheets-result.png max-800 %}

**實測效果和費用：**
`apify/instagram-scraper` 的價格是 $2.7 美元/1000 筆資料
所以每個月就算搜集到一千筆貼文，也都還沒超過**免費額度**。

{% darrellImage800Alt "Apify Instagram Scraper 價格方案" n8n_apify-instagram-pricing.png max-800 %}

{% callout tip title="進階：成本優化技巧" %}
如果你需要大量爬取，可以這樣省錢：

1. **減少不必要的欄位**：在 Actor Input 中設定 `fields` 只取需要的資料
2. **設定合理的 resultsLimit**：不要貪心一次爬太多
3. **避免重複爬取**：用 [n8n 的 If 節點](/n8n-if-switch/) 檢查是否已經爬過
4. **選擇便宜的 Actor**：同樣功能的 Actor 價格可能差 2-3 倍
{% endcallout %}

---

### 什麼時候不該用 Apify？

Apify 看起來很好用沒錯，但還是想分享有些不適合的場景：

免費額度 $5 聽起來蠻多的，很多時候免費額度綽綽有餘。
但如果是商用想要爬大量的數據，就得思考付費的方案是否划算？

{% dataTable style="minimal" %}
[
  {"使用頻率": "每天 50 筆", "月費估算": "~$4", "免費額度可用": "ok"},
  {"使用頻率": "每週 50 筆", "月費估算": "~$0.54", "免費額度可用": "ok"},
  {"使用頻率": "每天 200 筆", "月費估算": "~$16", "免費額度可用": "需付費"}
]
{% enddataTable %}

**有官方 API 就別硬爬**

{% callout warning %}
爬取社群平台資料有法律風險。Instagram、TikTok 的服務條款都明確禁止未授權的資料抓取，商業用途前建議先確認合規性。

**實際建議：**
- 個人研究、學習用途：風險較低
- 商業用途：建議諮詢法律顧問
- 爬取自己的帳號資料：用官方 API 更安全
{% endcallout %}

我自己使用 Apify 都是想自動化參考別人的內容時才會使用。
如果是拿來爬取自己的數據，其實就不需要 Apify
原因是大部分的社群平台都會有 API 可以抓去自己的數據
這時就會盡量用官方 API 來抓取，穩定度來說會好很多！

---

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "Apify 免費額度有多少？執行一次大概花多少？",
    "answer": "Apify 提供每月 <strong>$5 USD</strong> 免費額度（不用綁信用卡）。小量測試或是爬資料都很夠用！Instagram 爬蟲大約 $2.7/1000 筆，所以免費額度可以爬約 1800 筆。"
  },
  {
    "question": "Run Actor 和 Run Actor and get dataset items 有什麼差別？",
    "answer": "最大差別是<strong>是否等待結果</strong>：<br><br><code>Run Actor and get dataset items</code>：會等 Actor 跑完，直接拿到資料，<strong>初學者推薦用這個</strong><br><code>Run Actor</code>：只負責啟動，需搭配 Trigger 或另外撈取 Dataset<br><br>如果你的 Actor 執行時間很長（超過 5 分鐘），才需要考慮用 Run Actor + Trigger 的組合。"
  },
  {
    "question": "Scrape Single URL 可以爬任何網站嗎？",
    "answer": "理論上可以，但實際效果因網站而異：<br><br><strong>適合</strong>：靜態網頁、部落格、新聞網站<br><strong>不適合</strong>：需要登入、有反爬機制、大量 JavaScript 渲染的網站<br><br>如果要爬社群平台，還是建議用專門的 Actor。"
  }
]
{% endfaq %}

---

## 相關文章推薦

{% articleCard
  url="/n8n-webhook/"
  title="n8n Webhook 節點完整教學"
  previewText="學會 Webhook 節點，搭配 Apify Trigger 接收爬蟲完成通知"
  thumbnail="https://www.darrelltw.com/n8n-webhook/blog-n8n-webhook-bg.jpg"
%}

{% articleCard
  url="/n8n-if-switch/"
  title="n8n If 和 Switch 節點教學"
  previewText="爬取資料後，用條件判斷篩選有價值的內容"
  thumbnail="https://www.darrelltw.com/n8n-if-switch/n8n-If_Switch_bg.jpg"
%}

{% articleCard
  url="/n8n-set-node/"
  title="n8n Set 節點教學 - 資料整理的核心技巧"
  previewText="整理 Apify 回傳的原始資料，轉換成你需要的格式"
  thumbnail="https://www.darrelltw.com/n8n-set-node/blog-n8n-line-set_field-bg.jpg"
%}

---

## 總結

爬蟲一直是一個很大的學問，厲害的工程師們可以寫出各種花式的爬蟲程式。
但是 Apify 這個服務把爬蟲這件事簡化很多。

現在我們就挑選適合的 Actor 後測試幾輪，就能知道是不是真的能滿足我們的需求。
缺點有幾個：

1. 部分 Actor 價格很貴，甚至是有訂閱的費用(每月 $20 美金等等)
2. 有時候 Actor 參數設定沒問題，但跑出來的結果就是不符合我們的預期，這時只能換換看其他 Actor

整體來說還是相當推薦，畢竟在 AI 時代我們就是希望用最快最簡單的方式來取得資料

有任何 Apify 相關問題歡迎在下方留言
