---
title: n8n ByCrawl 節點教學：一次爬取 15 個平台
tags:
  - n8n節點介紹
  - n8n教學
categories:
  - n8n
page_type: post
id: n8n-bycrawl-node
description: n8n ByCrawl 社群節點完整教學！一把 API Key 就能抓 Threads、IG、X、Reddit、Dcard、PTT 等 15 個平台的社群數據。包含安裝設定、功能介紹、品牌聲量監控實戰案例和定價分析。
bgImage: blog-n8n-bycrawl-node-bg.jpg
preload:
  - blog-n8n-bycrawl-node-bg.jpg
date: 2026-03-19 16:18:21
modified: 2026-04-20 16:00:00
---

{% darrellImageCover n8n-bycrawl-node-bg blog-n8n-bycrawl-node-bg.jpg %}

> ByCrawl 節點讓你在 n8n 裡面用一把 API Key，就能抓取 Threads、Instagram、X、Reddit、Dcard、PTT 等 15 個平台的社群數據。不用每個平台各自串接 API。

{% callout info %}
這篇文章假設你已經有 n8n 環境。n8n 是一個開源的自動化工具，可以用拖拉的方式串接各種服務。如果還沒裝過，可以到 [n8n 官網](https://n8n.io/) 註冊 Cloud 版（免費方案可用），或參考我們的 [安裝部署教學](/n8n-deployment/)。
{% endcallout %}

**預計閱讀時間：** 10-12 分鐘

**你將學到：**
- ByCrawl 的「一次爬取各大平台」核心概念
- 社群節點安裝與 API Key 設定
- Resource（選平台）+ Operation（選操作）的使用方式
- 實戰案例：品牌聲量監控自動化

**如果趕時間，可以跳到**
{% quickNav %}
[
  {
    "text": "ByCrawl 是什麼",
    "anchor": "what-is-bycrawl",
    "desc": "15 個平台、Credit 制度"
  },
  {
    "text": "安裝與設定",
    "anchor": "setup",
    "desc": "社群節點安裝、API Key 設定"
  },
  {
    "text": "功能介紹",
    "anchor": "features",
    "desc": "各平台操作與實測"
  },
  {
    "text": "實戰案例",
    "anchor": "case-study",
    "desc": "品牌聲量監控"
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

想要監控品牌在社群上的討論，但 Threads 要串一個 API、X 要串一個、Reddit 又是另一個。
每個平台的 API 格式都不一樣，光是搞認證就搞到頭痛。

更麻煩的是，有些平台根本沒有開放 API。
像 Dcard、PTT 這種台灣本土論壇，想要自動抓資料只能自己寫爬蟲。

**ByCrawl 就是來解決這個問題的。**

一把 API Key 搞定 15 個平台，回傳的資料格式也統一，不用再對每個平台的 API 文件。

---

<h2 id="what-is-bycrawl">ByCrawl 是什麼？</h2>

ByCrawl 是一個爬蟲資料 API 平台，串接一次後就能取得 15 個平台以上的資料。
不管你要抓 Threads Instagram 的貼文和帳號資料、還是 Dcard 的討論，或是 PTT 的貼文，都只要註冊一次服務就好。

{% callout info %}
ByCrawl 主打 15 個社群、論壇、商家平台，另外附贈 Google SERP 和 Web Fetch 兩個通用 API：

- Threads
- Instagram
- Facebook（含 Marketplace）
- X / Twitter
- Reddit
- TikTok
- LinkedIn（含職缺搜尋）
- YouTube（含字幕）
- Dcard
- PTT
- Product Hunt
- Hacker News
- Google Maps
- Trustpilot
- 104 人力銀行
- 591 租屋網
- Google SERP（Google 搜尋結果、新聞、Trends）
- Web Fetch（抓任意公開網頁、Brave Search）

另外還有 Luma（活動日曆）API，這篇教學主要聚焦在社群和通用爬蟲。
{% endcallout %}

### 跟 Apify 有什麼不同？

如果你看過我之前寫的 [Apify 教學](/n8n-apify-node/)，可能會有點好奇他們的不同。

Apify 是爬蟲的平台，上面有幾千個 {% term def="Apify 上可執行的爬蟲程式單元" %}Actor{% endterm %}，但你得**自己去找**哪個 Actor 適合你。同一個平台可能有 5-10 個不同的 Actor 甚至更多，品質參差不齊，有些資料不是你要的、有些收費超級貴，光是挑選和測試就要花不少時間。

ByCrawl 不一樣，它把所有平台的 API 都整合好了。你不用挑 Actor，直接選好平台就能馬上取得資料

{% dataTable style="minimal" highlight="1,2" %}
[
  {"比較項目": "定位", "ByCrawl": "整合好的社群 API，開箱即用", "Apify": "爬蟲市集，要自己挑 Actor"},
  {"比較項目": "上手成本", "ByCrawl": "選平台 → 選操作 → 拿資料", "Apify": "找 Actor → 比較 → 測試 → 設參數 → 等爬蟲跑完"},
  {"比較項目": "回傳速度", "ByCrawl": "通常 1-5 秒", "Apify": "看 Actor，可能 30 秒到幾分鐘"},
  {"比較項目": "資料格式", "ByCrawl": "所有平台統一格式", "Apify": "每個 Actor 格式不同"},
  {"比較項目": "台灣常見平台", "ByCrawl": "✅ Dcard、PTT、104、591", "Apify": "❌ 幾乎沒有"},
  {"比較項目": "計費方式", "ByCrawl": "Credit 制（按 API 呼叫）", "Apify": "按運算時間 + 資料量"}
]
{% enddataTable %}

簡單來說：
- 要爬社群數據，想**馬上能用**，特別是台灣平台 → ByCrawl
- 要爬電商、新聞、或需要複雜客製化爬蟲 → [Apify](/n8n-apify-node/)

### Credit 怎麼計算？

ByCrawl 用 {% term def="每次呼叫 API 會扣的點數，不同平台和操作消耗不同" %}Credit{% endterm %} 計費，每個 API 呼叫扣不同的點數。

大部分操作落在 2-4 Credit，各類型參考如下：

{% dataTable style="minimal" align="left" %}
[
  {"操作類型": "一般查詢（Threads / Reddit / Dcard / PTT）", "Credit 消耗": "2-3 pt"},
  {"操作類型": "Instagram / X / TikTok 查詢", "Credit 消耗": "2-4 pt"},
  {"操作類型": "LinkedIn 使用者 / 公司", "Credit 消耗": "3-4 pt"},
  {"操作類型": "搜尋類（按筆計費）", "Credit 消耗": "2-3 pt / 筆"},
  {"操作類型": "YouTube / TikTok 字幕", "Credit 消耗": "4 pt"}
]
{% enddataTable %}

{% callout tip %}
大部分操作都落在 2-4 Credit，預算很好抓。搜尋類是「每筆 x Credit」計費，要多拉筆數前先估一下總量。
{% endcallout %}

---

<h2 id="setup">社群節點安裝與 API Key 設定</h2>

### Step 1：安裝 ByCrawl 社群節點

在 n8n 左下角的設定圖示，點進去找到 **Community nodes**：

{% darrellImage800Alt "n8n 設定選單中的 Community nodes" n8n_bycrawl-settings-community-nodes.png max-400 %}

點選 **Install**，輸入套件名稱：

`@bycrawl/n8n-nodes-bycrawl`

{% darrellImage800Alt "安裝 ByCrawl 社群節點 - 輸入套件名稱" n8n_bycrawl-install-community-node.png max-800 %}

勾選同意後按 Install，等幾秒就裝好了。

### Step 2：取得 ByCrawl API Key

1. 到 [ByCrawl](https://www.bycrawl.com/login) 註冊帳號（有 7 天免費試用）
2. 登入後進到 **API Keys** 頁面複製 API Key（格式是 `sk_byc_` 開頭）

### Step 3：在 n8n 設定 Credential

在 workflow 裡拉一個 ByCrawl 節點，點 Credential 的「Create New」：

{% darrellImage800Alt "ByCrawl Credential 設定 - 填入 API Key" n8n_bycrawl-credential-config.png max-800 %}

貼上 API Key 後按 Save，看到綠色的「Connection tested successfully」就完成了：

{% darrellImage800Alt "ByCrawl Credential 測試成功" n8n_bycrawl-credential-success.png max-800 %}


---

<h2 id="features">ByCrawl 節點功能介紹</h2>

ByCrawl 節點的操作邏輯是：**先選平台（{% term def="節點裡的下拉選單，選你要抓哪個平台的資料" %}Resource{% endterm %}），再選操作（{% term def="選好平台後，決定你要做什麼，例如查帳號、搜尋貼文" %}Operation{% endterm %}）**。

一個節點就能切換 15 個平台，不用裝 15 個不同的節點。

### Threads — 取得使用者資料

最基本的操作，選 Resource 為 Threads，Operation 為 Get User，輸入 username 就能拿到 profile：

{% darrellImage800Alt "ByCrawl Threads Get User 執行結果" n8n_bycrawl-threads-getuser.png max-800 %}

回傳的資料包含：username、fullName、bio、followerCount、followingCount、isVerified 等等。

### Instagram — 取得帳號資料與貼文

Instagram 的 Get User 比 Threads 更豐富，一次呼叫就能拿到 profile 加上近期貼文：

{% darrellImage800Alt "ByCrawl Instagram Get User 回傳的 JSON 資料" n8n_bycrawl-instagram-getuser-output.png max-800 %}

不需要 Meta 的官方 API 授權，就能拿到**別人帳號**的公開資料。這是 ByCrawl 最大的優勢之一。

### 各平台支援的操作一覽

每個平台支援的操作不太一樣，整理如下方便查詢：

```
社群 / 論壇
├── Threads (9)          Get User、Get Post、Search Posts、Public Feed
├── Instagram (5)        Get User（含近期貼文）、Get Post、Search Tags
├── Facebook (8)         Get Page、Search Posts、Marketplace
├── X / Twitter (4)      Get User、Search Posts（Top / Latest）
├── Reddit (8)           Get Subreddit / Post / User、Search Posts
├── TikTok (6)           Get User、Search Videos、Video Subtitles
├── LinkedIn (11)        Get User / Company、Search Jobs / Users、Company Posts
├── YouTube (5)          Get Channel、Search Videos、Video Transcription
├── Dcard (4)            Get Forum、Search Posts（跨版）
└── PTT (4)              Get Board、Search Posts（指定看板）

商家 / 評論 / 職缺 / 租屋
├── Product Hunt (4)     Leaderboard、Search、Get Product / Reviews
├── Hacker News (4)      Get Stories / Item / User、Comments
├── Google Maps (3)      Search Places、Get Place、Get Reviews
├── Trustpilot (5)       Get Business、Get Reviews、Search
├── 104 人力銀行 (3)     Search Jobs、Get Job Detail、Get Company
└── 591 租屋網 (2)       Search Listings、Get Detail

通用
├── Google SERP (5)      Search、News、Trends、Finance、Shopping
└── Web Fetch (2)        Fetch URL、Web Search（Brave）
```

{% callout tip %}
591 租屋的 region（地區）和 kind（類型）已經做成中文下拉選單了，不需要自己查代碼對照表，蠻貼心的。
{% endcallout %}

---

<h2 id="taiwan-quality">台灣常見平台實測</h2>

ByCrawl 最大的賣點是台灣平台支援（Dcard、PTT、104、591）。實際抓起來品質如何？我用關鍵字「n8n」（591 是台北市整層住家）各打一次 curl 看看：

{% dataTable style="minimal" align="left" %}
[
  {"平台": "Dcard", "單次筆數": "30", "總量提示": "無", "資料新鮮度": "2025-10 最新貼文", "速度": "0.33s", "Credit": "2 pt"},
  {"平台": "PTT（Gossiping）", "單次筆數": "10", "總量提示": "prev/next page", "資料新鮮度": "當日貼文", "速度": "1.04s", "Credit": "2 pt"},
  {"平台": "104 人力銀行", "單次筆數": "10", "總量提示": "totalCount 194", "資料新鮮度": "2026-04-17（3 天內）", "速度": "1.19s", "Credit": "2 pt"},
  {"平台": "591 租屋網", "單次筆數": "10", "總量提示": "total 3,712", "資料新鮮度": "「3 小時內更新」", "速度": "1.75s", "Credit": "2 pt"}
]
{% enddataTable %}

幾個實測心得：

- **資料密度夠高**：104 光「n8n」關鍵字就 194 筆職缺、591 台北市套房 3,712 筆，拿來做監控、全量爬都夠用
- **更新夠即時**：PTT 抓到當日貼文、591 標記「3 小時內更新」，代表 ByCrawl 是即時爬不是快取
- **PTT 需要指定看板**：不能跨板搜尋，要追 Gossiping、Tech_Job、Stock 就要開 3 個節點

---

<h2 id="case-study">實戰案例：品牌聲量監控</h2>

這個案例展示如何每天自動搜尋品牌關鍵字，跨 4 個平台收集提及，用 AI 分析情緒，最後輸出到 Slack 和 Google Sheets。

**流程：** Schedule Trigger（每日 09:00）→ Config 設定關鍵字 → 4 個 ByCrawl 節點平行搜尋 → Code 合併資料 → AI 情緒分析 → Slack + Google Sheets

### Workflow 架構

完整的 workflow 大概是這樣：

前半段是 Schedule Trigger → Config → 4 個 ByCrawl 節點（Threads / X / Reddit / Dcard）平行搜尋，後半段是 AI 情緒分析 → 格式化輸出 → Slack + Google Sheets。

下面這張是後半段的截圖，AI 分析完後寫入 Google Sheets：

{% darrellImage800Alt "品牌聲量監控 workflow - AI 分析到 Google Sheets" n8n_bycrawl-brand-monitor-workflow.png max-800 %}

### 核心設計

**4 個 ByCrawl 節點平行搜尋**，每個都開啟「錯誤時繼續執行」，這樣某個平台掛掉不會影響其他平台，整個 workflow 不會因為一個 API 錯誤就停掉。

**AI 分析**用 OpenAI gpt-5-mini，prompt 要求輸出：
1. 情緒分佈（正面/中性/負面比例）
3. 互動數最高的 3 則貼文
4. 一句話趨勢總結

### 每日成本預估

{% dataTable style="minimal" %}
[
  {"平台": "Threads Search", "Credit": "3 pt", "說明": "搜尋約 15 筆"},
  {"平台": "X Search（10 筆）", "Credit": "30 pt", "說明": "3 pt/tweet，最貴的部分"},
  {"平台": "Reddit Search", "Credit": "2 pt", "說明": "最多 25 筆"},
  {"平台": "Dcard Search", "Credit": "3 pt", "說明": "最多 30 筆"},
  {"平台": "合計", "Credit": "~38 pt/天", "說明": "每月約 1,140 pt"}
]
{% enddataTable %}

X 的搜尋是按 tweet 計費（3 pt/tweet），佔了大部分成本。如果預算有限，可以把 `x_count` 調低或直接關掉 X 搜尋。

---

<h2 id="pricing">定價方案</h2>

{% dataTable style="minimal" highlight="2" %}
[
  {"方案": "Lite", "月費": "$9 USD", "每月 Credit": "1,000", "適合": "試用、單一用途"},
  {"方案": "Pro", "月費": "$29 USD", "每月 Credit": "5,000", "適合": "日常品牌監控"},
  {"方案": "Power", "月費": "$79 USD", "每月 Credit": "15,000", "適合": "多場景、高頻使用"},
  {"方案": "Elite", "月費": "$159 USD", "每月 Credit": "30,000", "適合": "企業級、全平台監控"}
]
{% enddataTable %}


以品牌聲量監控為例，每天約 38 Credit，一個月 1,140 Credit，剛好超過 Lite 方案（$9 / 月）的 1,000 Credit 額度一點點。
超額以 Credit 計費，各方案超額費率不同（Lite 約 $0.012 / credit、Pro 約 $0.006 / credit），可以依實際用量估算。

---

### 不會寫程式也能上手嗎？

雖然 ByCrawl 本身已經把 API 包得很簡化，但整套品牌聲量監控 workflow（Schedule + Config + 4 個 ByCrawl 平行搜尋 + AI 分析 + Slack / Google Sheets）對完全沒碰過 n8n 的行銷人員來說還是有門檻。
不過用 n8n 的好處會是一但建立起來後，後續的維護和調整會比較方便。
如果是用 AI vibe coding 一套來實作，還要看看自己對於 server 維護部署是否熟悉。
另外未來如果要增加功能或是調整，AI 在改 code 的時候往往有 bug 的機率也會稍微高一點。

想要類似的爬蟲服務但沒有工程資源，也可以 [找我實作和討論](/n8n-expert/)

---

### 什麼時候不該用 ByCrawl？

ByCrawl 蠻方便的沒錯，但也有些限制要注意：

**節點無法翻頁**
目前 byCrawl 社群節點的介面不支援設定分頁參數，每次搜尋只能拿到第一批結果（通常 15-30 筆）。需要翻頁的話，要把 ByCrawl 節點**換成 HTTP Request 節點**，在 URL 帶分頁參數（Dcard / Threads 用 `offset`、Reddit 用 `after`）直接打 ByCrawl API。

{% darrellImage800Alt "HTTP Request 節點 Pagination 設定 - Dcard offset 翻頁" pagination_offset_expression_settings.png max-800 %}

{% callout tip title="翻頁的實作方向（我實際 curl 測過）" %}
把 ByCrawl 節點換成 HTTP Request 節點，base URL 是 `https://api.bycrawl.com`。

**Authentication**：Generic Credential → Header Auth，Name 填 `x-api-key`、Value 填 `sk_byc_...`（注意：**不是** `Authorization: Bearer`，ByCrawl 用的是 `x-api-key` header）

**翻頁**：在 HTTP Request 節點的 Options → Pagination 設定，Mode 選「Update a Parameter in Each Request」：

對大多數監控場景來說，第一批結果已經夠用。
{% endcallout %}

**部分平台速度較慢**
TikTok 和某些 Dcard 操作，單次呼叫需要 10-40 秒；一般搜尋類操作大多 1-5 秒（我實測 Dcard Search 只要 0.3 秒）。在 workflow 裡記得把 timeout 調到 120 秒，避免 n8n 提早中斷。

**X 取最新推文要用 Search**
這個是實測才發現的坑。用 `Get User Posts` 抓某個帳號的推文會拿到「熱門推文」（按互動排序，可能是好幾年前的舊文），不是最新的。要拿最新推文必須改用 **Search Posts**，query 設為 `from:USERNAME`、Product 選 **Latest**。

{% callout info %}
如果只是要抓自己帳號的數據，建議用各平台的官方 API。ByCrawl 的優勢是抓**別人**的公開資料，或是那些沒有開放 API 的平台（Dcard、PTT、591 等）。
{% endcallout %}

---

### 我實測踩過的坑

以下都是我打 curl 跑過一輪之後記錄的，ByCrawl 文件沒寫清楚、但實際用會撞到的細節。

**1. 各平台 pagination 機制不同**

想在 n8n 跨平台翻頁，得自己 switch case：

- Dcard / Threads：`?offset=N`
- Reddit：回傳 `after` 欄位 → 下次帶 `?after={值}`
- PTT / 104：`?page=N&count=N`
- 591：`?first_row=N`

**2. 時間欄位結構不統一**

- PTT：`date: "4/20"`（只有月日，沒年份）
- 104：`appearedAt: "20260414"`（YYYYMMDD 字串）
- Dcard：`createdAt: "2025-10-21T11:08:12.512Z"`（ISO 8601）
- 591：`refreshTime: "3小時內更新"`（人類可讀字串，要 parse）

跨平台合併資料前，記得加一個 Set 或 Code 節點統一時間格式，不然排序會亂。

**3. Auth header 用 `x-api-key` 最保險**

實測 `Authorization: Bearer` 也能通，但官方文件只列 `x-api-key`。認官方的就好，免得未來出現其他問題或是錯誤。

---

### curl 快速驗證範本（給想跳過 n8n 直接測 API 的人）

不想先裝 n8n、想確認 ByCrawl API 是不是真的能抓到你要的資料？把下面指令複製到 terminal 就能測（記得把 API Key 換成自己的）。這整套指令我都實測跑過：

**先設定 API Key：**

```bash
export BYCRAWL_API_KEY='sk_byc_你的_key'
```

**1. 抓 Threads 用戶資料（~2 Credit）**

```bash
curl -H "x-api-key: $BYCRAWL_API_KEY" \
  "https://api.bycrawl.com/threads/users/zuck" | jq
```

**2. 搜尋 Dcard 貼文（~3 Credit）**

```bash
curl -H "x-api-key: $BYCRAWL_API_KEY" \
  "https://api.bycrawl.com/dcard/posts/search?q=n8n" | jq '.posts | length'
```

**3. Dcard 翻頁（offset-based，從第 31 筆開始）**

```bash
curl -H "x-api-key: $BYCRAWL_API_KEY" \
  "https://api.bycrawl.com/dcard/posts/search?q=n8n&offset=30" | jq '.posts[0].id'
```

**4. 搜尋 Reddit（注意回傳的 after 欄位是翻頁 cursor）**

```bash
curl -H "x-api-key: $BYCRAWL_API_KEY" \
  "https://api.bycrawl.com/reddit/posts/search?q=n8n&count=3" | jq '{after, first: .posts[0].id}'
```

**5. Reddit 翻頁（把上一次的 after 值帶進來）**

```bash
curl -H "x-api-key: $BYCRAWL_API_KEY" \
  "https://api.bycrawl.com/reddit/posts/search?q=n8n&count=3&after=t3_xxxxx" | jq '.after'
```

**6. 搜尋 Threads 貼文（~3 Credit / 筆）**

```bash
curl -H "x-api-key: $BYCRAWL_API_KEY" \
  "https://api.bycrawl.com/threads/posts/search?q=n8n&count=5" | jq '.posts | length'
```

{% callout tip %}
上面 6 個指令全部跑過一輪大約用掉 15-25 Credit，7 天免費試用期間跑這輪綽綽有餘。`jq` 只是拿來美化 JSON 輸出，沒裝也能跑（回傳會是一整串 JSON）。
{% endcallout %}

---

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "ByCrawl 免費試用有多少額度？",
    "answer": "ByCrawl 所有方案都提供 <strong>7 天免費試用</strong>。大部分操作 2-4 Credit，試用期間拿來實測幾個平台、跑兩三個 workflow 驗證可行性沒問題。具體免費 Credit 額度以註冊頁面顯示為準。"
  },
  {
    "question": "ByCrawl 跟直接用 HTTP Request 打 API 有什麼差別？",
    "answer": "功能上一樣！，都是打同一個 API。但社群節點有<strong>下拉選單選平台和操作</strong>，不用記 API 路徑和參數格式。而且搜尋結果會自動解構成 n8n 的 items，不用自己寫程式去拆。"
  },
  {
    "question": "可以爬取私人帳號的資料嗎？",
    "answer": "不行，ByCrawl 只能抓取<strong>公開</strong>的資料。Instagram 私人帳號、Facebook 個人帳號都無法取得。這也是合規使用的基本原則。"
  }
]
{% endfaq %}

---

## 相關文章推薦

{% articleCard
  url="/n8n-apify-node/"
  title="n8n Apify 爬蟲教學：不會寫程式也能爬資料"
  previewText="另一種社群數據爬取方案，適合需要複雜爬蟲邏輯的場景"
  thumbnail="https://www.darrelltw.com/n8n-apify-node/blog-n8n-apify-node-bg.jpg"
%}

{% articleCard
  url="/n8n-line-messaging-community-node/"
  title="n8n LINE Messaging 社群節點教學"
  previewText="另一個好用的社群節點，搭配 ByCrawl 抓到的數據推送通知"
  thumbnail="https://www.darrelltw.com/n8n-line-messaging-community-node/blog-n8n-line-messaging-node-bg.jpg"
%}

{% articleCard
  url="/n8n-set-node/"
  title="n8n Set 節點教學 - 資料整理的核心技巧"
  previewText="ByCrawl 抓到的原始資料，用 Set 節點整理成你需要的格式"
  thumbnail="https://www.darrelltw.com/n8n-set-node/blog-n8n-line-set_field-bg.jpg"
%}

---

## 總結

ByCrawl 最大的價值就是超級方便
一把服務就能拿到 15 個以上平台的資料，對於需要跨平台監控社群的人來說，省掉非常多串接的時間
特別是台灣的使用者，Dcard、PTT、104、591 這些平台的支援是其他爬蟲工具很少看到的
對於這些平台爬蟲資料有興趣的使用者都可以試試看
如果需要專案建置或是做成週報月報也可以[找我聊聊](/n8n-expert/)

有任何 ByCrawl 相關問題歡迎在下方留言！
