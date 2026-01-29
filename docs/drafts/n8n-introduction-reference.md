---
title: n8n 給新手的入門：從 0 到 1，免費打造你的個人自動化軍隊
tags:
  - n8n
  - automation
  - no-code
  - n8n教學
  - n8n入門
categories:
  - n8n
page_type: post
id: n8n-introduction
description: 2025 最新 n8n 入門教學！專為零基礎新手設計，4 個循序漸進的實作練習，從 Hello World 到 AI 新聞助理。包含部署方式選擇指南、常見錯誤避坑、結構化學習計劃、Zapier/Make 比較、10 個 FAQ 完整解答。
bgImage: n8n-introduction-bg.jpg
preload:
  - n8n-introduction-bg.jpg
date: 2025-11-26 09:00:00
modified: 2025-12-27 10:00:00
---

{% darrellImageCover n8n-introduction-bg n8n-introduction-bg.jpg %}

{% quickNav %}
[
  {"text": "n8n 是什麼", "anchor": "what-is-n8n", "desc": "名稱由來、公司背景"},
  {"text": "快速開始", "anchor": "quick-start", "desc": "5 分鐘啟動"},
  {"text": "練習一", "anchor": "practice-1", "desc": "Hello World"},
  {"text": "練習二", "anchor": "practice-2", "desc": "抓取 API 數據"},
  {"text": "練習三", "anchor": "practice-3", "desc": "定時任務 + RSS"},
  {"text": "練習 3.5", "anchor": "practice-3-5", "desc": "發送通知"},
  {"text": "練習四", "anchor": "practice-4", "desc": "AI 新聞助理（進階）"},
  {"text": "避坑指南", "anchor": "common-mistakes", "desc": "新手常犯錯誤"},
  {"text": "學習計劃", "anchor": "learning-plan", "desc": "週次規劃"},
  {"text": "安全提醒", "anchor": "security-tips", "desc": "使用注意事項"},
  {"text": "FAQ", "anchor": "faq", "desc": "常見問題"}
]
{% endquickNav %}

## 前言：為什麼現在每個人都需要自動化？

### 現狀：AI 工具很多，但還是要手動複製貼上？
在這個 AI 大爆發的時代，我們手邊有 ChatGPT 幫忙寫文案、有 Midjourney 幫忙畫圖、有各種 SaaS 工具幫忙管理專案。但你有沒有發現，我們還是花大量的時間在「搬運資料」？

把 Email 的內容複製到 Notion？把客戶填單的資料 Key 到 Excel？收到 Slack 通知再去開 Jira？這些重複性高、價值低的工作，正在吞噬我們寶貴的時間。

### 解決方案：n8n 是將這些 AI 和工具串聯起來的膠水
如果說各個 AI 工具是強大的「大腦」，那麼 **n8n** 就是連接這些大腦的「神經網路」。它能讓你的工具之間自動對話，讓資料自動流動，就像是你雇用了一個 24 小時不休息的數位管家。

### 本文承諾

看完這篇指南，你將：

| 練習 | 時間 | 你會學到 | 門檻 |
|------|------|----------|------|
| **練習一** | 5 分鐘 | 建立第一個工作流、認識 JSON | ⭐ 零門檻 |
| **練習二** | 10 分鐘 | 抓取 API 資料、表達式拖拉 | ⭐ 零門檻 |
| **練習三** | 15 分鐘 | 定時觸發、處理 RSS 新聞 | ⭐ 零門檻 |
| **練習 3.5** | 5-30 分鐘 | 發送真實通知（Slack/LINE） | ⚠️ 需設定 |
| **練習四** | 30 分鐘 | 結合 AI 摘要新聞 | 💰 進階選做 |

> 💡 **設計理念**：前三個練習都是**零門檻**，不需要申請任何 API Key！確保你能順利完成核心學習，獲得成就感後再挑戰進階。

<h2 id="what-is-n8n">n8n 是什麼？與 Zapier/Make 有何不同？</h2>

### 定義與名稱由來

n8n（發音：n-eight-n）是一個基於節點 (Node-based) 的工作流自動化工具。這個名字來自「**nodemation**」（Node + Automation）的縮寫，中間有 8 個字母，所以簡稱 n8n。

透過視覺化的介面，你可以像「連連看」一樣，將不同的網路服務串接起來。

### 公司背景

n8n 由德國工程師 **Jan Oberhauser** 於 2019 年創立，總部位於德國柏林。截至 2024 年，n8n 已獲得超過 5,000 萬美元的融資，並擁有超過 400 萬次的 Docker 下載量。

這是一個真正由社群驅動的專案，GitHub 上有超過 4 萬顆星星，是目前最活躍的開源自動化工具之一。

### 市面工具比較表

| 特性 | Zapier | Make (Integromat) | n8n |
| :--- | :--- | :--- | :--- |
| **易用性** | ⭐⭐⭐⭐⭐ (最簡單) | ⭐⭐⭐⭐ (視覺化強) | ⭐⭐⭐ (邏輯較硬核) |
| **費用** | 昂貴 (按 Task 計費) | 中等 (按 Operation 計費) | **免費 (自架版)** / 付費 (雲端版) |
| **複雜度** | 適合線性流程 | 適合分支流程 | **適合複雜邏輯與資料處理** |
| **部署** | 僅雲端 SaaS | 僅雲端 SaaS | **SaaS / Docker / Desktop** |
| **最大優勢** | 生態系最大，無腦上手 | 介面漂亮，除錯方便 | **開源、隱私、無限制執行** |

### Fair-code 授權

n8n 採用 **Fair-code** 授權模式：個人和小團隊可以**免費**使用，只有大企業（年營收超過 $1M 或超過 10 個用戶）才需要付費。對於一般用戶來說，這幾乎等於免費！

### 誰適合用 n8n？

| 適合的人 | 原因 |
| :--- | :--- |
| 🧑‍💻 **獨立開發者** | 免費、強大、可自訂 |
| 📊 **行銷人員** | 不用寫程式也能串接各種工具 |
| 🏢 **新創團隊** | 節省 SaaS 訂閱費用 |
| 🔒 **重視隱私的人** | 資料可以完全留在自己的伺服器 |
| 🤖 **AI 愛好者** | 內建多種 AI 節點，輕鬆串接 LLM |

**不太適合的情況：**
- 完全不想碰任何技術設定（建議用 Zapier）
- 公司已經有現成的自動化系統且運作良好
- 只需要非常簡單的單一自動化（用 IFTTT 可能更快）

<h2 id="why-not-code">為什麼不直接寫程式？</h2>

你可能會想：「我會寫 Python/JavaScript，為什麼要用 n8n？」這是個好問題！

### n8n vs 寫程式對比

| 面向 | 寫程式 | n8n |
|------|--------|-----|
| **學習曲線** | 需要程式基礎 | 拖拉即可上手 |
| **開發時間** | 數小時~數天 | 數分鐘~數小時 |
| **維護成本** | 需讀懂程式碼才能修改 | 視覺化流程一目了然 |
| **錯誤處理** | 需自己寫 try-catch | 內建重試、錯誤分支 |
| **執行環境** | 需自己架設 cron、伺服器 | 內建排程、監控、執行紀錄 |
| **團隊協作** | 需要 code review | 非工程師也能看懂流程 |

### 什麼時候該寫程式？

- 需要極致效能優化（每秒處理數萬筆資料）
- 非常特殊的商業邏輯，沒有現成節點可用
- 已經有現成的程式碼庫，只是要加個小功能

> 💡 **最佳實踐**：很多人會混合使用！用 n8n 處理流程編排和 API 串接，遇到複雜的資料處理再用 Code 節點寫一小段程式。

<h2 id="use-cases">n8n 到底可以拿來做什麼？（三大應用場景）</h2>

很多新手卡關不是因為工具難學，而是「不知道可以用來做什麼」。以下分享三個常見的應用場景，並附上實戰教學連結：

### 1. 個人生活場景

*   **自動記帳**：收到電子發票 Email → 自動解析金額與店家 → 寫入 Google Sheets
*   **資訊焦慮救星**：每天早上自動抓取科技新聞 RSS → 用 AI 總結重點 → 發送 Line 給自己
*   **生日提醒**：從 Google Contacts 抓取朋友生日 → 提前 3 天發 Line 提醒自己準備禮物

**進階範例：Line 分帳助理**
收到 Line 群組的分帳訊息 → 自動計算每人應付金額 → 產生分帳結果回傳
{% articleCard
  url="/n8n-line-split-expense-workflow/"
  title="n8n 實作：Line 分帳助理工作流"
  previewText="收到分帳訊息自動計算每人金額，再也不用手動算數學！"
  thumbnail="https://www.darrelltw.com/n8n-line-split-expense-workflow/blog-n8n-line_expense_japan-bg.jpg"
%}

**進階範例：AI 語音日報**
每天早上抓取天氣 + 新聞 → 用 AI 生成語音播報 → 像廣播一樣聽新聞
{% articleCard
  url="/n8n-elevenlabs-tts/"
  title="n8n 串接 ElevenLabs 語音合成教學"
  previewText="用 AI 把文字變成自然的語音，打造個人專屬的語音助理！"
  thumbnail="https://www.darrelltw.com/n8n-elevenlabs-tts/blog-n8n-elevenlabs-node-bg.jpg"
%}

### 2. 行銷工作場景

*   **名單自動化**：Facebook Lead Ads 有人填單 → 寫入 Hubspot CRM → 寄送歡迎 Email → 通知業務 Slack
*   **社群自動發文**：部落格發布新文章 → 自動生成不同風格的貼文 → 同步發送到 Facebook 粉絲頁、Threads 和 Twitter
*   **競品監控**：監控競爭對手網站變化 → 截圖存到 Google Drive → 通知團隊

**進階範例：Email 自動處理**
收到特定主旨的 Email → 解析內容 → 自動分類並寫入對應的試算表
{% articleCard
  url="/n8n-gmail-node/"
  title="n8n Gmail 節點完整教學"
  previewText="自動讀取、分類、回覆 Email，告別手動整理信箱的日子！"
  thumbnail="https://www.darrelltw.com/n8n-gmail-node/blog-n8n-gmail-bg.jpg"
%}

### 3. 工程/維運場景

*   **伺服器監控**：網站掛掉 → Webhook 觸發 n8n → 檢查狀態 → 發送 Telegram 緊急通知
*   **CI/CD 通知**：GitHub Action 完成 → 判斷成功或失敗 → 發送部署結果到 Slack

**進階範例：自動備份到雲端**
每天定時備份資料庫 → 上傳到 Cloudflare R2 / AWS S3 → 發送備份報告
{% articleCard
  url="/n8n-node-s3-with-cloudflare-r2/"
  title="n8n 串接 S3/Cloudflare R2 雲端儲存"
  previewText="自動化備份檔案到雲端，資料安全有保障！"
  thumbnail="https://www.darrelltw.com/n8n-node-s3-with-cloudflare-r2/blog-n8n-s3-node-bg.jpg"
%}

**進階範例：Slack 整合通知**
各種事件（錯誤日誌、用戶註冊、訂單完成）→ 整合發送到 Slack 頻道
{% articleCard
  url="/n8n-with-slack/"
  title="n8n 串接 Slack 完整教學"
  previewText="把所有通知集中到 Slack，團隊協作更有效率！"
  thumbnail="https://www.darrelltw.com/n8n-with-slack/n8n-with-slack_bg.jpg"
%}

**進階範例：表單驗證防護**
防止機器人惡意提交表單 → 整合 Cloudflare Turnstile 驗證
{% articleCard
  url="/n8n-with-cloudflare-turnstile-CAPTCHA/"
  title="n8n 表單防護 - Cloudflare Turnstile 驗證"
  previewText="vibe coding 表單被機器人攻擊？用 Turnstile + n8n 打造驗證系統！"
  thumbnail="https://www.darrelltw.com/n8n-with-cloudflare-turnstile-CAPTCHA/blog-n8n-cloudflare_turnstile.jpg"
%}

<h2 id="quick-start">快速開始：5 分鐘啟動 n8n</h2>

### 最簡單的方式：Desktop App（推薦新手）

1. 前往 [n8n 官網下載頁](https://n8n.io/get-started/)
2. 下載對應系統的安裝檔（Windows / Mac）
3. 安裝後雙擊開啟，完成！

> 💡 **新手提示**：Desktop App 最適合學習和練習。完成本文所有練習後，再考慮雲端部署也不遲！

### 其他部署方式

| 方式 | 適合對象 | 費用 |
|------|----------|------|
| **Desktop App** | 新手學習、本機練習 | 免費 |
| **n8n Cloud** | 不想管伺服器的人 | $20/月起 |
| **Self-Hosted** | 進階玩家、重視隱私 | 免費~低成本 |

### 我該選哪種部署方式？（決策指南）

> 💡 **新手建議**：先用 Desktop App 完成本文練習，熟悉後再考慮部署選擇。

#### 快速決策問答

**Q1: 你需要 24 小時自動執行嗎？（例如定時抓新聞）**
- ❌ 不需要 → Desktop App（免費、學習最佳）
- ✅ 需要 → 繼續 Q2

**Q2: 你願意處理技術設定嗎？**
- ❌ 完全不想碰 → n8n Cloud（最省心）
- ✅ 可以花點時間 → Zeabur / Self-Hosted

**Q3: 你有多少預算？**
- 免費 → Zeabur 免費方案（美國機房，稍慢但夠用）
- $5 美元/月 → Zeabur Developer Plan（台北機房）
- $20 美元/月 → n8n Cloud Starter（官方維護、Google OAuth 最簡單）

#### 成本與功能對比

{% dataTable style="minimal" highlight="3" %}
[
  {"部署方式": "Desktop App", "月費": "免費", "執行限制": "無限", "24hr 運行": "❌", "OAuth 設定": "—", "適合對象": "學習練習"},
  {"部署方式": "Zeabur 免費", "月費": "免費", "執行限制": "無限", "24hr 運行": "✅", "OAuth 設定": "需自建", "適合對象": "預算有限"},
  {"部署方式": "Zeabur Dev", "月費": "~$5", "執行限制": "無限", "24hr 運行": "✅", "OAuth 設定": "需自建", "適合對象": "個人進階"},
  {"部署方式": "n8n Cloud", "月費": "$20起", "執行限制": "2,500/月", "24hr 運行": "✅", "OAuth 設定": "一鍵完成", "適合對象": "省時優先"}
]
{% enddataTable %}

> ⚠️ **注意**：n8n Cloud 有執行次數限制（Starter 2,500 次/月）。如果你的自動化會頻繁執行，自架版更划算。

#### 常見情境建議

| 你的情況 | 推薦方案 | 理由 |
|----------|----------|------|
| 剛開始學 n8n | Desktop App | 免費、無風險、本文練習都能完成 |
| 想每天自動發送摘要 | Zeabur Dev ($5) | 便宜、台北機房快 |
| 需要串接 Google 服務（Sheets、Gmail） | n8n Cloud ($20) | OAuth 設定最簡單 |
| 公司內部使用、重視資料隱私 | Self-Hosted | 資料不離開自己的伺服器 |

> 📖 **詳細教學**：各方案的完整設定步驟，請參考下方連結

{% articleCard
  url="/n8n-deployment/"
  title="n8n 安裝部署教學 - 官方Cloud、Zeabur、本機部署該怎麼選?"
  previewText="詳細比較各種部署方式的成本、效能和適用場景。"
  thumbnail="https://www.darrelltw.com/n8n-deployment/blog-n8n-deployment-bg.jpg"
%}

---

接下來，讓我們動手做！以下練習都可以在 Desktop App 上完成。

<h2 id="ui-guide">介面導覽：五分鐘看懂操作台</h2>

{% darrellImage800 n8n-intro-ui-overview n8n-introduction/n8n-intro-ui-overview.png max-800 %}

當你進入 n8n 後，會看到幾個主要區域。讓我們一一認識：

### 左側選單

| 區域 | 功能 |
| :--- | :--- |
| **Workflows** | 所有工作流的清單，可以新增、搜尋、分類 |
| **Credentials** | 統一管理 API Key。設定一次，所有工作流都能共用 |
| **Variables** | 全域變數，適合存放常用的設定值 |
| **Executions** | 查看每次執行的紀錄（成功/失敗），除錯必備！ |

> 📖 **新功能**：n8n 新增了 Folders 資料夾功能！詳見 [Folders 資料夾功能實測](/n8n-new-feature-folders/)

### 頂部工具列

| 按鈕 | 功能 |
| :--- | :--- |
| **Save** | 儲存當前工作流 |
| **Test Workflow** | 手動測試執行一次 |
| **Active** 開關 | 開啟 = 工作流正式上線；關閉 = 暫停 |

### 畫布操作

| 操作 | 方式 |
| :--- | :--- |
| **新增節點** | 點擊 `+` 按鈕，或在空白處點擊 |
| **連接節點** | 從節點右側的小圓點拖拉到下一個節點 |
| **縮放畫布** | 滑鼠滾輪，或按 `Ctrl/Cmd + 滾輪` |
| **平移畫布** | 按住空白處拖拉，或按住 `空白鍵 + 拖拉` |
| **選取多個節點** | 按住 `Shift` + 點擊，或框選 |

### 常用快捷鍵

學會這些快捷鍵，操作效率翻倍！

| 快捷鍵 | 功能 |
| :--- | :--- |
| `Ctrl/Cmd + S` | 儲存工作流 |
| `Ctrl/Cmd + Enter` | 執行工作流 |
| `Ctrl/Cmd + A` | 選取所有節點 |
| `Ctrl/Cmd + C / V` | 複製 / 貼上節點 |
| `Delete` | 刪除選取的節點 |
| `Tab` | 開啟節點搜尋面板 |
| `Ctrl/Cmd + Z` | 復原上一步 |

> 💡 **新手小技巧**：剛開始不用記這些快捷鍵，先用滑鼠點擊就好。等你熟悉操作後，再慢慢學快捷鍵來加速。

<h2 id="core-concepts">核心運作邏輯（重要！）</h2>

要精通 n8n，你只需要理解三個概念。放心，我會用最白話的方式解釋：

### 1. Trigger (觸發器) — 就像「鬧鐘」

> 💡 **白話解釋**：就像你設鬧鐘叫你起床，Trigger 就是「叫醒」工作流的鬧鐘。沒有鬧鐘響，你就不會起床；沒有 Trigger 觸發，工作流就不會執行。

每一個工作流都需要一個「開始的理由」：
*   **Schedule**：定時觸發 (例如：每天早上 9 點) — 就像固定時間響的鬧鐘
*   **Webhook**：被外部呼叫時觸發 (例如：當網站有新訂單) — 就像有人按門鈴
*   **App Events**：當特定 App 發生事件時 (例如：當 Google Sheets 新增一行) — 就像收到新訊息通知

> 📖 **進階學習**：想更精準控制 Trigger 的執行頻率？參考 [n8n Poll Time 教學](/n8n-poll-time-setting/)

### 2. Data (JSON) — 就像「便當盒」

> 💡 **白話解釋**：JSON 就像一個便當盒，裡面有飯、菜、肉，每個格子放不同東西。n8n 的每個節點傳出來的資料，就是裝在這個「便當盒」裡。

**別被嚇到！**你通常不需要自己寫 JSON。你只需要知道：
- 資料是以「物件 (Object)」的形式存在
- 每個物件有一堆「屬性 (Key)」和「值 (Value)」

```json
{
  "飯": "白飯",
  "主菜": "雞腿",
  "配菜": "青菜"
}
```

上面這個例子，`"飯"` 是屬性 (Key)，`"白飯"` 是值 (Value)。就這麼簡單！

### 3. Expression (表達式) — 就像「填空題」

> 💡 **白話解釋**：不用寫程式！只要像填空題一樣，把前面節點的資料「拖」進去就好。

當你要在 B 節點使用 A 節點的資料時（例如：把 A 抓到的「天氣」填入 B 的「Line 訊息」），只需要**拖拉 (Drag and Drop)**！

直接從 Input Data 面板把你要的欄位拖到參數框裡，n8n 會自動幫你生成對應的表達式。完全不用自己寫程式碼。

### 常用表達式速查表

雖然可以拖拉，但了解一些常用表達式會讓你更靈活：

| 用途 | 表達式 | 說明 |
|------|--------|------|
| 取前一節點欄位 | `{{ $json.fieldName }}` | 最基本的用法 |
| 取特定節點的值 | `{{ $('節點名稱').item.json.field }}` | 跨節點取值 |
| 當前時間 | `{{ $now }}` | 取得當前時間戳 |
| 格式化日期 | `{{ $now.format('YYYY-MM-DD') }}` | 輸出如 2025-01-15 |
| 條件判斷 | `{{ $json.status === 'active' ? '啟用' : '停用' }}` | 三元運算符 |
| 字串組合 | `{{ '您好 ' + $json.name + '！' }}` | 串接字串 |
| 取陣列第一項 | `{{ $json.items[0].name }}` | 索引從 0 開始 |
| 工作流名稱 | `{{ $workflow.name }}` | 取得當前工作流名稱 |

> 📖 **想學更多？** 完整的表達式教學請參考 [n8n 內建變數與表達式教學](/n8n-built-in-variables/)

---

## 動手做！循序漸進的練習

接下來是本文的重頭戲：**四個由淺入深的實作練習**。前三個都是零門檻，不需要任何 API Key！

<h2 id="practice-1">練習一：Hello World（5 分鐘）⭐ 零門檻</h2>

**目標**：建立你人生中第一個 n8n 工作流，認識節點和 JSON 的概念。

**工作流結構**：
```
Manual Trigger → Edit Fields (Set)
```

### Step 1: 建立新工作流

1. 開啟 n8n，點擊右上角的 **Create Workflow**
2. 給工作流取個名字：`My First Workflow`

{% darrellImage800 n8n-intro-practice1-create n8n-introduction/n8n-intro-practice1-create.png max-800 %}

### Step 2: 新增 Manual Trigger

1. 點擊畫布中央的 **+** 按鈕
2. 搜尋 `Manual Trigger`，點擊新增
3. 不需要任何設定，這個節點就是「手動按一下就觸發」

> 💡 **為什麼用 Manual Trigger？** 練習時用手動觸發最方便，不用等定時器。正式上線再換成 Schedule Trigger。

### Step 3: 新增 Edit Fields (Set) 節點

1. 從 Manual Trigger 右側的小圓點**拖拉出一條線**
2. 在彈出的選單中搜尋 `Edit Fields`（舊版叫 Set）
3. 點擊 **Add Field** → **String**，設定以下欄位：

| Name | Value |
|------|-------|
| `greeting` | `Hello, n8n!` |
| `message` | `這是我的第一個工作流！` |

4. 再加一個欄位，這次用**表達式**：
   - 點擊 **Add Field** → **String**
   - Name: `timestamp`
   - 點擊 Value 欄位右邊的 **Expression** 按鈕
   - 輸入：`{{ $now }}`

{% darrellImage800 n8n-intro-practice1-set n8n-introduction/n8n-intro-practice1-set.png max-800 %}

### Step 4: 執行並查看結果

1. 點擊右上角的 **Test Workflow** 按鈕
2. 看到每個節點都顯示綠色勾勾 ✅ 就成功了！
3. 點擊 Edit Fields 節點，查看 **Output** 面板

你應該會看到類似這樣的 JSON 輸出：

```json
{
  "greeting": "Hello, n8n!",
  "message": "這是我的第一個工作流！",
  "timestamp": "2025-01-15T08:30:00.000Z"
}
```

{% darrellImage800 n8n-intro-practice1-result n8n-introduction/n8n-intro-practice1-result.png max-800 %}

### 練習一學到了什麼？

✅ 學會建立新工作流
✅ 認識「節點」的概念（Trigger → 處理）
✅ 看懂 JSON 輸出格式（Key-Value 結構）
✅ 使用第一個表達式 `{{ $now }}`

> 🎉 **恭喜！** 你完成了第一個 n8n 工作流！這個看似簡單的練習，其實已經涵蓋了 n8n 90% 的核心操作。

---

<h2 id="practice-2">練習二：抓取真實數據（10 分鐘）⭐ 零門檻</h2>

**目標**：學會使用 HTTP Request 節點抓取外部 API 資料，並練習表達式取值。

**工作流結構**：
```
Manual Trigger → HTTP Request → Edit Fields
```

### Step 1: 建立新工作流

建立一個新工作流，命名為 `Fetch API Data`。

### Step 2: 新增 HTTP Request 節點

1. 新增 Manual Trigger（同練習一）
2. 拖拉出一條線，搜尋 `HTTP Request`
3. 設定以下參數：

| 參數 | 值 |
|------|-----|
| **Method** | GET |
| **URL** | `https://jsonplaceholder.typicode.com/users/1` |

4. 點擊 **Test step** 測試這個節點

> 💡 **JSONPlaceholder 是什麼？** 這是一個免費的假 API，專門給開發者練習用。不需要申請任何 Key！

你應該會看到一個 User 的完整資料：

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "city": "Gwenborough"
  }
}
```

{% darrellImage800 n8n-intro-practice2-http n8n-introduction/n8n-intro-practice2-http.png max-800 %}

### Step 3: 用 Edit Fields 整理資料

1. 從 HTTP Request 拖拉出一條線，新增 `Edit Fields`
2. 這次我們要練習**拖拉取值**！
3. 點擊 **Add Field** → **String**，Name 填 `user_name`
4. 在 Value 欄位，點擊 **Expression** 按鈕
5. 從左側的 **Input Data** 面板，找到 `name` 欄位，**直接拖拉到 Value 框中**

n8n 會自動生成表達式：`{{ $json.name }}`

{% darrellImage800 n8n-intro-practice2-drag n8n-introduction/n8n-intro-practice2-drag.png max-800 %}

6. 繼續新增更多欄位：

| Name | Expression |
|------|------------|
| `user_name` | `{{ $json.name }}` |
| `user_email` | `{{ $json.email }}` |
| `city` | `{{ $json.address.city }}` |

> 💡 **巢狀取值**：注意 `city` 在 `address` 物件裡面，所以要用 `$json.address.city` 來取得。

### Step 4: 認識 Pin Data 功能

這是 n8n 最實用的功能之一！

1. 點擊 HTTP Request 節點
2. 在節點上方找到 **Pin** 圖釘圖示，點擊它
3. 節點會變成紫色，表示資料已被「釘住」

**Pin Data 的好處**：
- 之後測試時，不會真的再去呼叫 API
- 省時間、省錢（如果是付費 API）
- 確保測試資料一致

{% darrellImage800 n8n-intro-practice2-pin n8n-introduction/n8n-intro-practice2-pin.png max-800 %}

### 練習二學到了什麼？

✅ 學會使用 HTTP Request 抓取 API 資料
✅ 理解 JSON 的巢狀結構（`$json.address.city`）
✅ 學會表達式的拖拉操作（不用手打！）
✅ 認識 Pin Data 功能

{% articleCard
  url="/n8n-tips-pin/"
  title="n8n Pin Data 功能完整教學"
  previewText="學會用 Pin Data 讓你的測試效率提升 10 倍！"
  thumbnail="https://www.darrelltw.com/n8n-tips-pin/n8n_pin_bg.jpg"
%}

---

<h2 id="practice-3">練習三：定時任務 + RSS 新聞（15 分鐘）⭐ 零門檻</h2>

**目標**：學會定時觸發，並處理真實的 RSS 新聞資料。

**工作流結構**：
```
Schedule Trigger → HTTP Request (RSS) → Edit Fields
```

### Step 1: 建立新工作流

建立一個新工作流，命名為 `RSS News Fetcher`。

### Step 2: 新增 Schedule Trigger

1. 點擊 **+** 按鈕，搜尋 `Schedule Trigger`
2. 設定觸發時間：
   - **Trigger Interval**: Every Day
   - **Hour**: 8
   - **Minute**: 0

這樣設定後，工作流會在每天早上 8:00 自動執行。

> 💡 **測試技巧**：練習時可以先設成「Every Minute」，這樣不用等太久。測完再改回 Every Day。

{% darrellImage800 n8n-intro-practice3-schedule n8n-introduction/n8n-intro-practice3-schedule.png max-800 %}

### Step 3: 抓取 RSS 新聞

1. 新增 `HTTP Request` 節點
2. 設定參數：

| 參數 | 值 |
|------|-----|
| **Method** | GET |
| **URL** | `https://www.ithome.com.tw/rss` |

3. 點擊 **Test step**

你會看到 n8n 自動把 RSS（XML 格式）轉換成 JSON！每一則新聞都有 `title`、`link`、`description` 等欄位。

{% darrellImage800 n8n-intro-practice3-rss n8n-introduction/n8n-intro-practice3-rss.png max-800 %}

### Step 4: 整理新聞資料

1. 新增 `Edit Fields` 節點
2. 我們來提取新聞的重要欄位：

| Name | Expression | 說明 |
|------|------------|------|
| `news_title` | `{{ $json.rss.channel.item[0].title }}` | 第一則新聞標題 |
| `news_link` | `{{ $json.rss.channel.item[0].link }}` | 新聞連結 |
| `fetch_time` | `{{ $now.format('YYYY-MM-DD HH:mm') }}` | 抓取時間 |

> 💡 **陣列取值**：`item[0]` 表示取第一則新聞。`item[1]` 就是第二則，以此類推。

### Step 5: 執行並查看結果

點擊 **Test Workflow**，查看 Edit Fields 的輸出：

```json
{
  "news_title": "AI 技術突破：新模型效能提升 50%",
  "news_link": "https://www.ithome.com.tw/news/...",
  "fetch_time": "2025-01-15 08:00"
}
```

### 練習三學到了什麼？

✅ 學會 Schedule Trigger 定時觸發
✅ 理解 RSS/XML 自動轉 JSON
✅ 學會從陣列中取值（`item[0]`、`item[1]`）
✅ 學會日期格式化（`$now.format()`）

> 🎉 **到目前為止**，你已經完成了三個零門檻的練習！你已經掌握了 n8n 的核心操作：Trigger、HTTP Request、Edit Fields、表達式。接下來的練習會需要設定外部服務，但核心概念都是一樣的。

---

<h2 id="practice-3-5">練習 3.5：發送真實通知（20-30 分鐘）⚠️ 需設定外部服務</h2>

**目標**：接上真實的通知管道，讓工作流能發送訊息給你。

現在你的工作流會抓新聞，但結果只能在 n8n 裡看。讓我們把它變成**真正實用的自動化**——每天早上自動發送新聞到你的手機！

### 選擇你的通知管道

根據你的使用習慣，選擇一個：

| 選項 | 設定時間 | 適合對象 |
|------|----------|----------|
| **A. Slack Webhook** | 約 5 分鐘 | 想快速看到成果的人 |
| **B. LINE Messaging API** | 約 20-30 分鐘 | 台灣用戶日常使用 |

---

### 選項 A：Slack Webhook（簡易版）

如果你有在用 Slack，這是最快的設定方式。

#### Step 1: 建立 Slack Incoming Webhook

1. 前往 [Slack API](https://api.slack.com/apps)
2. 點擊 **Create New App** → **From scratch**
3. 取個名字（如：n8n-news），選擇你的 Workspace
4. 在左側選單點擊 **Incoming Webhooks** → 開啟 **Activate**
5. 點擊 **Add New Webhook to Workspace**
6. 選擇要發送到的頻道
7. 複製 **Webhook URL**（長得像 `https://hooks.slack.com/services/...`）

#### Step 2: 在 n8n 發送訊息

1. 在練習三的工作流中，從 Edit Fields 後面新增 `HTTP Request` 節點
2. 設定：

| 參數 | 值 |
|------|-----|
| **Method** | POST |
| **URL** | 貼上你的 Slack Webhook URL |
| **Body Content Type** | JSON |
| **Body** | 見下方 |

Body 內容：
```json
{
  "text": "📰 今日新聞：{{ $json.news_title }}\n🔗 {{ $json.news_link }}"
}
```

3. 執行測試，你的 Slack 頻道應該會收到訊息！

{% darrellImage800 n8n-intro-practice35-slack n8n-introduction/n8n-intro-practice35-slack.png max-800 %}

---

### 選項 B：LINE Messaging API（完整版）

如果你希望通知發送到 LINE，設定會複雜一些，但日常使用更方便。

> ⚠️ **注意**：LINE Notify 已於 2024 年停止新用戶註冊。本教學使用 LINE Messaging API。

由於 LINE 的設定較為詳細，我已經寫了專文完整教學：

{% articleCard
  url="/n8n-line-message-api/"
  title="n8n LINE 訊息發送實戰 - Request 節點替代 LINE Notify"
  previewText="LINE Notify 替代方案實戰！包含 Webhook 設定、Token 取得、常見錯誤排除。"
  thumbnail="https://www.darrelltw.com/n8n-line-message-api/n8n-line-message-api-bg.jpg"
%}

完成 LINE 設定後，回來繼續練習三的工作流，加上 LINE 發送節點即可。

> 💡 **社群節點推薦**：如果覺得用 HTTP Request 設定 LINE 太複雜，可以試試視覺化介面更直覺的社群節點：

{% articleCard
  url="/n8n-line-messaging-community-node/"
  title="n8n LINE Messaging 社群節點教學"
  previewText="比官方 HTTP Request 更簡單的 LINE 整合方式！"
  thumbnail="https://www.darrelltw.com/n8n-line-messaging-community-node/blog-n8n-community-line-messaging.jpg"
%}

### 練習 3.5 學到了什麼？

✅ 學會設定外部服務的 Credentials
✅ 完成真實可用的通知自動化
✅ 理解 Webhook 的基本概念

---

<h2 id="practice-4">練習四：AI 新聞助理（30 分鐘）💰 進階選做</h2>

> ⚠️ **此練習需要 OpenAI API Key（付費）**。如果你只是想學習 n8n，可以跳過這個練習。前三個練習已經涵蓋了 n8n 的核心操作！

這個練習會在練習三的基礎上，加入 AI 來自動摘要新聞內容。

**目標**：每天早上，自動抓取科技新聞 RSS，請 AI 幫我寫成摘要，並發送通知。

**工作流結構**：
```
Schedule Trigger → HTTP Request (RSS) → OpenAI → LINE/Slack
```

{% darrellImage800 n8n-intro-workflow-complete n8n-introduction/n8n-intro-workflow-complete.png max-800 %}

### 事前準備：設定 OpenAI API Key

在使用 OpenAI 節點之前，你需要先申請 API Key 並在 n8n 中設定：

#### 1. 申請 OpenAI API Key

1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 登入或註冊帳號（需要綁定付款方式）
3. 點擊左側選單的 **API Keys**
4. 點擊 **Create new secret key**
5. 為 Key 取個名字（例如：n8n）
6. **立即複製 Key**（只會顯示一次，之後無法再查看！）

> ⚠️ **費用提醒**：OpenAI API 是按用量計費的。GPT-4o-mini 非常便宜，每天跑一次大約只需要幾分錢美金。

#### 2. 在 n8n 設定 Credential

{% darrellImage800 n8n-intro-openai-credential n8n-introduction/n8n-intro-openai-credential.png max-800 %}

1. 點擊左側選單 → **Credentials**
2. 點擊 **Add Credential**
3. 搜尋 `OpenAI`，選擇 **OpenAI API**
4. 在 **API Key** 欄位貼上剛才複製的 Key
5. 點擊 **Save**

設定完成後，所有工作流都可以使用這個 Credential，不用重複設定。

### Step 1: 沿用練習三的工作流

1. 開啟練習三建立的 `RSS News Fetcher` 工作流
2. 或者新建一個工作流，重新設定 Schedule Trigger → HTTP Request (RSS)
3. 在 HTTP Request 後面加入 OpenAI 節點

### Step 2: 新增 OpenAI 節點

{% darrellImage800 n8n-intro-openai-setup n8n-introduction/n8n-intro-openai-setup.png max-800 %}

新增 `OpenAI` 節點，讓 AI 幫你摘要新聞重點。

*   **Resource**: `Chat`
*   **Operation**: `Complete`
*   **Model**: `gpt-4o-mini` (便宜又好用，每天跑一次成本幾乎可忽略)
*   **Prompt**:
    ```
    請幫我摘要以下新聞標題與內容，用繁體中文列點說明重點：

    {{$json.rss.channel.item}}
    ```

> 💡 **表達式技巧**：不用手打 `{{$json.rss...}}`！點擊輸入框右邊的 `Expression` 按鈕，從左側 Input Data 面板直接拖拉你要的欄位進來即可。

### Step 3: 發送通知（LINE 或 Slack）

如果你已經完成練習 3.5 的通知設定，這裡只需要把 OpenAI 的輸出接到通知節點即可。

**訊息內容**：把 OpenAI 生成的 `content` 拖曳進來

> 📖 **還沒設定通知？** 回到練習 3.5，選擇 Slack 或 LINE 進行設定。

### Step 4: 測試與啟用

{% darrellImage800 n8n-intro-execution-result n8n-introduction/n8n-intro-execution-result.png max-800 %}

1. 點擊右上角的 **Test Workflow** 按鈕
2. 等待幾秒鐘，檢查每個節點是否都顯示綠色勾勾 ✅
3. 確認 Line 收到訊息後，點擊右上角的 **Active** 開關，讓工作流正式上線！

> ❌ **常見錯誤**：如果 OpenAI 節點報錯，通常是 API Key 沒設定好。到左側選單的 Credentials 檢查你的 OpenAI 憑證是否正確。

### 練習四學到了什麼？

✅ 學會申請和設定 OpenAI API Key
✅ 認識 AI 節點的基本使用方式
✅ 完成結合 AI 的進階自動化工作流

> 🎉 **恭喜！** 你已經完成了所有練習！從最簡單的 Hello World 到結合 AI 的新聞助理，你已經掌握了 n8n 的核心技能。

---

<h2 id="common-mistakes">新手常犯 5 大錯誤（避坑指南）</h2>

學會操作後，來看看新手最容易踩的坑，避免你走冤枉路：

### 1. 忘記開啟 Active 開關

**症狀**：工作流設定好了，但從來沒有自動執行過。

**原因**：右上角的 **Active** 開關沒有打開。n8n 預設是關閉的，只有打開後工作流才會自動執行。

**解決**：點擊右上角的 Active 開關，變成藍色就對了！

{% darrellImage800 n8n-intro-mistake-active n8n-introduction/n8n-intro-mistake-active.png max-800 %}

### 2. Test URL vs Production URL 搞混

**症狀**：Webhook 測試時正常，但正式上線後收不到資料。

**原因**：n8n 的 Webhook 有兩種 URL：
- `/webhook-test/...`：測試用，只在你點擊「Listen for test event」時有效
- `/webhook/...`：正式用，Active 開啟後才有效

**解決**：正式使用時，務必複製 **Production URL**，不要用 Test URL。

### 3. Pin Data 忘記取消

**症狀**：正式環境一直拿到舊資料，不會更新。

**原因**：你在測試時 Pin 了某個節點的資料，上線前忘記取消。

**解決**：上線前檢查所有節點，如果看到**紫色的 Pin 圖示**，記得取消它。

### 4. Schedule Trigger 時區問題

**症狀**：設定每天早上 8:00 執行，但實際執行時間不對。

**原因**：n8n 預設使用 UTC 時區，台灣是 UTC+8。

**解決**：
- 如果用 Zeabur 部署，參考 [Zeabur 時區問題解決](/n8n-with-zeabur-timezone-issue/)
- 或者設定時手動換算時區（台灣 8:00 = UTC 0:00）

### 5. API Key 過期或錯誤

**症狀**：節點報錯 `401 Unauthorized`。

**原因**：API Key 輸入錯誤、過期、或者權限不足。

**解決**：
1. 到左側選單的 **Credentials**
2. 找到對應的憑證，點擊編輯
3. 重新貼上正確的 API Key
4. 點擊 **Test** 按鈕驗證

> 💡 **除錯心法**：遇到錯誤不要怕！先看錯誤訊息，再去 Executions 查看詳細資料。80% 的問題都能從 Input/Output 資料中找到答案。

---

<h2 id="learning-plan">結構化學習計劃</h2>

完成本文的練習後，接下來怎麼繼續學習？這裡提供一個結構化的學習計劃：

### 第一週：基礎入門

| 天 | 學習內容 | 時間 | 成果 |
|----|----------|------|------|
| Day 1 | 完成練習一~二 | 30 分 | 建立前兩個工作流 |
| Day 2 | 完成練習三 | 30 分 | 學會定時觸發 + RSS |
| Day 3 | 學習 Webhook 節點 | 45 分 | 理解兩種 Trigger 模式 |
| Day 4 | 學習 If/Switch 節點 | 45 分 | 學會條件判斷 |
| Day 5 | 自由練習 | 1 小時 | 組合已學節點做個小專案 |
| 週末 | 完成練習 3.5 | 1 小時 | 發送真實通知到手機 |

{% articleCard
  url="/n8n-webhook/"
  title="n8n Webhook 節點完整教學"
  previewText="學會 Webhook 就能串接任何外部服務！"
  thumbnail="https://www.darrelltw.com/n8n-webhook/blog-n8n-webhook-bg.jpg"
%}

{% articleCard
  url="/n8n-if-switch/"
  title="n8n If/Switch 條件判斷節點教學"
  previewText="讓工作流會「思考」！根據不同條件走不同路徑。"
  thumbnail="https://www.darrelltw.com/n8n-if-switch/n8n-If_Switch_bg.jpg"
%}

### 第二週：核心技能強化

| 天 | 學習內容 | 時間 | 成果 |
|----|----------|------|------|
| Day 1 | Filter 節點 | 30 分 | 學會篩選資料 |
| Day 2 | Merge 節點 | 45 分 | 學會合併多來源資料 |
| Day 3 | 練習四（選做） | 1 小時 | 接觸 AI 節點 |
| Day 4 | 除錯技巧深化 | 30 分 | 精通 Executions 分析 |
| Day 5 | 實戰練習 | 1 小時 | 建立自己的實用工作流 |

{% articleCard
  url="/n8n-filter-node/"
  title="n8n Filter 節點篩選資料教學"
  previewText="只保留你需要的資料！學會各種篩選條件的設定方式。"
  thumbnail="https://www.darrelltw.com/n8n-filter-node/n8n-filter-node-bg.jpg"
%}

{% articleCard
  url="/n8n-merge-node/"
  title="n8n Merge 節點合併資料教學"
  previewText="學會合併來自不同來源的資料，建立更複雜的自動化流程。"
  thumbnail="https://www.darrelltw.com/n8n-merge-node/blog-n8n-merge-node-bg.jpg"
%}

### 第三週以後：依興趣選擇主題

| 興趣方向 | 推薦學習 |
|----------|----------|
| **AI 整合** | OpenAI 節點、Perplexity、Structured Output Parser |
| **資料處理** | Aggregate、Split Out、DataTables |
| **通訊整合** | Gmail、Slack、LINE 進階用法 |
| **雲端儲存** | S3、Cloudflare R2 |

{% articleCard
  url="/n8n_structured_output_parser_node/"
  title="n8n Structured Output Parser 節點教學"
  previewText="AI 輸出格式總是亂七八糟？這個節點一次解決！"
  thumbnail="https://www.darrelltw.com/n8n_structured_output_parser_node/bg-n8n-output_parser.jpg"
%}

{% articleCard
  url="/n8n-aggregate-split-out/"
  title="n8n Aggregate 與 Split Out 節點實測"
  previewText="多筆資料合併、陣列分割的實戰技巧與踩雷經驗分享！"
  thumbnail="https://www.darrelltw.com/n8n-aggregate-split-out/n8n-splitout_aggregation_bg.jpg"
%}

---

<h2 id="debugging">除錯技巧精華</h2>

當工作流出問題時，n8n 提供了強大的除錯工具。（Pin Data 的用法已在練習二介紹過，這裡就不重複了！）

### Executions：工作流的「錄影回放」

{% darrellImage800 n8n-intro-executions-debug n8n-introduction/n8n-intro-executions-debug.png max-800 %}

每次工作流執行，n8n 都會記錄下來。你可以在 **Executions** 頁面查看：

- **執行時間**：什麼時候執行的
- **執行狀態**：成功 ✅ 還是失敗 ❌
- **每個節點的資料**：輸入了什麼、輸出了什麼

**除錯流程**：
1. 進入 Executions 頁面
2. 找到失敗的執行紀錄
3. 點擊進入，查看每個節點的 Input/Output 資料
4. 找出是哪個節點出錯、輸入資料有什麼問題

### 常見錯誤訊息解讀

當你遇到錯誤時，別慌！看看錯誤訊息，通常能找到線索：

| 錯誤碼 | 常見原因 | 解決方案 |
|--------|----------|----------|
| **401 Unauthorized** | API Key 錯誤或過期 | 到 Credentials 重新設定 API Key |
| **403 Forbidden** | 權限不足 | 確認 API 有對應的存取權限 |
| **404 Not Found** | 資源不存在 | 檢查 URL 或 ID 是否正確 |
| **429 Too Many Requests** | 頻率限制 | 加入 Wait 節點，降低執行頻率 |
| **500 Internal Server Error** | 第三方服務問題 | 等待服務恢復，或聯繫服務商 |
| **ECONNREFUSED** | 連線被拒絕 | 檢查網路設定、防火牆 |
| **ETIMEDOUT** | 連線逾時 | 增加 Timeout 設定，檢查網路 |

### 部署相關問題

| 問題 | 常見原因 | 解決方案 |
|------|----------|----------|
| **Schedule Trigger 時間不對** | n8n 時區設定錯誤 | 參考 [Zeabur 時區問題解決](/n8n-with-zeabur-timezone-issue/) |

### 實戰案例：LINE 訊息發送失敗

這是很多人會遇到的問題，讓我們用實際案例來示範除錯流程：

**問題描述**：LINE 節點回傳 "Invalid JSON" 錯誤

**除錯步驟**：
1. 進入 Executions，找到失敗的執行
2. 點擊 LINE 節點，查看 Input Data
3. 發現輸入的訊息包含特殊字元（例如未處理的換行符號 `\n`）
4. **解決方案**：在 LINE 節點前加一個 Edit Fields 節點，清理特殊字元

{% articleCard
  url="/n8n-debug-line-invalid-json/"
  title="n8n 除錯實戰：解決 LINE Invalid JSON 錯誤"
  previewText="一步步帶你找出 LINE 訊息發送失敗的原因並修復！"
  thumbnail="https://www.darrelltw.com/n8n-debug-line-invalid-json/blog-n8n-invalid-json-bg.jpg"
%}

> 💡 **除錯心法**：遇到錯誤不要怕，養成習慣先看 Executions 的資料。80% 的問題都能從 Input/Output 資料中找到答案。

<h2 id="security-tips">安全小提醒</h2>

使用 n8n 時，有幾點安全事項值得注意：

1. **不要匯入來路不明的模板** - 惡意模板可能藏有危險的表達式
2. **定期更新 n8n 版本** - 官方會修復安全漏洞
3. **妥善保管 API Key** - 不要把 Credentials 分享給不信任的人

> 🔐 **延伸閱讀**：最近發現的 n8n 安全漏洞與修復方式：

{% articleCard
  url="/n8n-security-vulnerability-2025/"
  title="n8n 資安漏洞 CVE-2025-68613"
  previewText="CVSS 9.9 高風險漏洞懶人包：快速檢查版本並更新"
  thumbnail="https://www.darrelltw.com/n8n-security-vulnerability-2025/n8n-security-vulnerability-2025-bg.jpg"
%}

<h2 id="faq">常見問題 FAQ</h2>

{% faq %}
[
  {
    "question": "n8n 一定要會寫程式嗎？",
    "answer": "不用！90% 的操作都是透過拖拉完成。n8n 的設計理念就是讓不會寫程式的人也能輕鬆建立自動化流程。只有非常進階的客製化需求才需要寫一點 JavaScript。"
  },
  {
    "question": "n8n Cloud 和自架版差在哪？",
    "answer": "主要差在成本和維護。Cloud 版月費約 $20 美元起，但免維護；自架版可以完全免費（用 Zeabur 等平台），但需要自己處理更新和備份。新手建議先用 Desktop App 練習，熟悉後再考慮部署方式。"
  },
  {
    "question": "n8n 可以串接 ChatGPT 嗎？",
    "answer": "可以！n8n 內建 OpenAI 節點，支援 GPT-4、GPT-4o-mini 等模型。只需要申請 OpenAI API Key，在 Credentials 設定後就能使用。本文的練習四就是串接 OpenAI 的完整範例。"
  },
  {
    "question": "工作流壞掉怎麼除錯？",
    "answer": "左側選單的 Executions（執行紀錄）是你的好朋友！它會記錄每次執行的輸入輸出資料，讓你一目了然哪個節點出錯、錯在哪裡。點進去看詳細資料，通常就能找到問題。"
  },
  {
    "question": "n8n 會不會很吃主機資源？",
    "answer": "相對輕量！1GB RAM 通常足夠跑大多數工作流。除非你要同時跑非常多複雜的流程，否則不太需要擔心效能問題。Zeabur 的免費方案就足以應付一般個人使用。"
  },
  {
    "question": "n8n 支援哪些服務？",
    "answer": "超過 400+ 個內建整合！包括 Google 全家桶、Slack、Notion、Airtable、Telegram、Line、各大 CRM、資料庫等。如果沒有內建，也可以用 HTTP Request 節點串接任何有 API 的服務。"
  },
  {
    "question": "Desktop App 和雲端版有什麼差別？",
    "answer": "Desktop App 完全免費，適合學習和本機練習，但電腦關機工作流就會停止。雲端版（包括自架）可以 24 小時運行，適合需要定時觸發的自動化任務。建議先用 Desktop App 練習，熟悉後再考慮部署。"
  },
  {
    "question": "LINE Notify 還能用嗎？",
    "answer": "LINE Notify 已於 2024 年停止新用戶註冊。如果你要在 n8n 發送 LINE 通知，請改用 LINE Messaging API。本站有完整的設定教學文章可以參考。"
  },
  {
    "question": "學會本文的練習後，下一步該學什麼？",
    "answer": "建議依序學習：Webhook 節點（接收外部訊號）、If/Switch 節點（條件判斷）、Filter 節點（篩選資料）、Merge 節點（合併資料）。這四個節點加上本文教的內容，就能處理 80% 的自動化需求了！"
  },
  {
    "question": "n8n 的工作流可以分享給別人嗎？",
    "answer": "可以！n8n 支援匯出工作流為 JSON 檔案，別人匯入後就能直接使用。官方也有 Templates Library 收錄數千個現成範本，是學習的好資源。"
  }
]
{% endfaq %}

### 遇到問題去哪找答案？

| 資源 | 說明 |
| :--- | :--- |
| [n8n 官方論壇](https://community.n8n.io/) | 社群非常活躍，幾乎所有問題都能找到解答 |
| [Templates Library](https://n8n.io/workflows/) | 官方收集的數千個現成範本，複製回來改最快！ |
| [n8n 官方文件](https://docs.n8n.io/) | 節點參數、API 文件等技術細節 |
| [n8n 版本更新記錄](/n8n-update-log/) | 追蹤 n8n 最新功能與改進 |
| 本站 n8n 教學 | 持續更新中，歡迎收藏！ |

## 結語

自動化不只是為了省時間，更是為了**釋放你的腦力**去處理更有價值的事情。n8n 就像是一盒強大的樂高積木，門檻不高，但能蓋出多壯觀的城堡，完全取決於你的想像力。

希望這篇指南能成為你自動化旅程的起點。如果你對 n8n 有興趣，歡迎持續關注我的部落格，我會分享更多進階的實戰技巧！

  Happy Automating! 🚀