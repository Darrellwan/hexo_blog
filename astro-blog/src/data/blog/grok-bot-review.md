---
title: Grok Bot：有自己雲端電腦的 AI Agent
pubDatetime: 2026-08-23T13:13:00+08:00
description: xAI 推出的 Grok Bot 實測心得，每個 Bot 有自己的雲端電腦，可以開瀏覽器操作沒有 API 的網站，實測比價流程、把操作存成技能、Bot 之間互相溝通交辦，以及每天自動跑的例行任務，附三種取得方式的費用比較
tags:
  - AI Agent
  - xAI
categories:
  - AI
page_type: post
id: grok-bot-review
slug: grok-bot-review
bgImage: blog-grok-bot-review-bg.jpg
ogImage: blog-grok-bot-review-bg.jpg
---

{% darrellImageCover grok-bot-review-bg blog-grok-bot-review-bg.jpg %}

{% callout type="tip" title="重點摘要" %}
**Grok Bot = 每個 Bot 配一台自己的電腦**
- 它是真的開瀏覽器點頁面，所以沒有 API 的網站（PChome、momo）也做得動
- 示範一次就能存成技能，之後丟關鍵字重跑
- 技能是所有 Bot 共用的，Bot 也能互相傳訊息交辦
- 目前 Early Beta，只有 macOS
{% endcallout %}

{% quickNav %}
[
  {"text": "方案和費用", "anchor": "pricing", "desc": "三種取得方式"},
  {"text": "安裝與設定", "anchor": "setup", "desc": "從下載到建第一個 Bot"},
  {"text": "特色：有自己的雲端電腦", "anchor": "own-computer", "desc": "最關鍵的差異"},
  {"text": "Grok Bot vs Hermes vs 龍蝦", "anchor": "framework-comparison", "desc": "自建透天 vs 飯店公寓"},
  {"text": "錄製技能 Skill", "anchor": "teach-skill", "desc": "教一次就會"},
  {"text": "Bot 能互相溝通", "anchor": "bot-to-bot", "desc": "技能是共用的"},
  {"text": "排程設定", "anchor": "scheduled-task", "desc": "每天自己跑"},
  {"text": "實測案例：商品比價", "anchor": "price-compare-test", "desc": "拿螢幕型號跑一次"},
  {"text": "適合誰使用？", "anchor": "who-should-use", "desc": "值不值得裝"},
  {"text": "常見問題", "anchor": "faq", "desc": "FAQ"}
]
{% endquickNav %}

xAI 在 2026 年 8 月推出的 Grok Bot 非常特別
以前曾經有一段時間，社群很瘋狂提到要買 mac mini 來養龍蝦，或是現在比較流行的 hermes agent
重點都是讓 AI 可以直接**接管一台電腦來做到更全方位的助理**

而 Grok Bot 是內建提供的雲端電腦
Bot 就可以存取檔案、使用瀏覽器等等

可能你會覺得 Claude , OpenAI 等等也能做到一樣的事情？！
但他們用的 Computer Use 會直接影響使用者當下的電腦，例如 AI 在做事，你就不能操作
或是電腦關機休眠，原本安排的事情可能就沒做

{% darrellImage800Alt "Grok Bot 官網首頁，標示 Early Beta 與 Download for macOS 按鈕" grokbot_landing_page.png max-800 %}


<h2 id="pricing">方案和費用</h2>

有三種使用的方式：

{% dataTable style="minimal" align="left" %}
[
  {"方案": "Start a Trial", "費用": "免費（要綁信用卡）", "重點": "全功能，但用量非常吵，超過用量你再決定要不要付錢"},
  {"方案": "Get Pro+", "費用": "$60 / 月", "重點": "全功能，用量充足"},
  {"方案": "Get Access with Grok", "費用": "已包含在訂閱裡", "重點": "需要 SuperGrok Heavy 或 SuperGrok Plus 方案以上"}
]
{% enddataTable %}

{% darrellImage800Alt "Grok Bot 三種取得方式：免費 Trial 需綁卡、Pro+ 每月 60 美元、SuperGrok 訂閱內含" grokbot_pricing_plans.png max-800 %}

$60 一個月換算台幣接近兩千元，只有訂閱這個方案不算便宜
也可以考慮直接訂閱 SuperGrok Heavy ($300)或 Plus($100) 美金的方案
好處是你還有 Grok 的網頁跟 Grok Build 可以使用，適合重度操作 AI 的用戶才能看到並提交表單

{% darrellImage800Alt "Confirm your account link 畫面，將 SuperGrok 帳號與另一個帳號連結，說明會採用兩者較高的方案" grokbot_account_link_confirm.png max-800 %}

<h2 id="setup">安裝與設定</h2>

安裝就是標準的 macOS 流程，下載 dmg 之後把 App 拖曳安裝

{% darrellImage800Alt "Grok Bot 安裝畫面，把 Grok Bot.app 拖進 Applications 資料夾" grokbot_installer_drag_to_applications.png max-800 %}

第一次打開會先問
哪些工具是你想要串接的
可以先選一選他先幫你把外掛裝好 (但連線授權後續還是要做一次)

{% darrellImage800Alt "Grok Bot 初次設定畫面，詢問你每天都用哪些工具，可選 Google 工作區、Slack、Notion、Salesforce 等" grokbot_onboarding_tools_select.png max-800 %}

接著建第一個 Bot
取名字、選顏色、選形狀，就這樣，沒有 system prompt 之類的欄位要填

{% darrellImage800Alt "建立第一個 Bot 的畫面，可選顏色與形狀並輸入名稱，下方有三個建議的 Bot 範本" grokbot_create_first_bot.png max-800 %}

例如我先選了幾個未來想測試的工具
Slack、Trello 等等

### 外掛程式 Plugins

外掛程式就是目前現有的連接器們
數量算是非常多，國外常用的服務應該都有在裡面

{% darrellImage800Alt "Grok Bot 外掛程式市集，Gmail 與 Google Calendar 已新增，另有 Google Drive、Granola 與團隊外掛程式" grokbot_plugins_marketplace.png max-800 %}

分類列表裡除了常見的 Productivity、Sales、Design，還有 Agent Orchestration 跟 MCP

{% callout type="info" %}
外掛不是必要的沒裝任何外掛，Bot 一樣能靠瀏覽器把事情做完，但外掛們走 API 或 MCP 相對節省 Tokens
{% endcallout %}

<h2 id="own-computer">最關鍵的差異：Bot 有自己的一台電腦</h2>

每個 Bot 都配一台自己的電腦，是一套 Linux 桌面環境，桌面上有 Chrome 跟終端機和檔案管理
你在聊天室右上角點一下就能看到它的螢幕
還能看到他正在執行的動作！

{% darrellImage800Alt "Bot 的桌面畫面，Dock 上有 Chrome、終端機等應用程式，右上角有教它一項任務按鈕" grokbot_bot_own_desktop.png max-800 %}

把三個介面都打開來：

{% darrellImage800Alt "Bot 桌面實際運作畫面，同時開著 Thunar 檔案管理器、終端機與 Chrome 瀏覽器，檔案管理器停在 workspace 目錄" grokbot_bot_desktop_working.png max-800 %}

<h2 id="framework-comparison">Grok Bot vs Hermes vs 龍蝦：自建透天 vs 飯店公寓</h2>

之前大家熱烈討論要買 Mac mini 放家裡養龍蝦（OpenClaw），或是租一台 VPS 跑 Hermes Agent，但大部分非工程師的朋友基本上都在第一關卡死

這三者最大的差別，其實就像在比**「買地自己蓋透天」**跟**「住拎包入住的飯店式公寓」**：

{% darrellImage800Alt "AI Agent 核心對比圖解：拎包入住（Grok Bot）vs 自建透天（Hermes / OpenClaw 龍蝦）" grokbot_vs_hermes_openclaw_comparison.png max-800 %}

- **心智模型（自建透天 vs 拎包套房）**：OpenClaw / Hermes 就像自己買地拉水電，自由度 100% 但門檻極高；Grok Bot 則是拎包入住的精裝修公寓，點開 App 雲端電腦就已就緒
- **電腦放哪裡（自備主機 vs 24/7 雲端 VM）**：自建派需要自備常開的 Mac mini 或 VPS 伺服器；Grok Bot 跑在純雲端虛擬機上，完全不需要佔用你本機的硬體資源
- **怎麼教它做事（寫 Code 配置 vs 示範一次就學會）**：自建派需要寫 Python 程式或 YAML 設定檔；Grok Bot 只要在桌面錄影點擊一次，它就能自動萃取成技能
- **適合誰（改 Code 掌控派 vs 日常省事外包派）**：要 100% 資料私密與自由換模型選 Hermes / 龍蝦；不想碰 Linux 只想把日常瑣事外包選 Grok Bot

{% dataTable style="minimal" align="left" %}
[
  {
    "比較維度": "架設難度",
    "Grok Bot": "極低（下載 App 登入就能用）",
    "Hermes Agent": "高（要自己租 VPS、SSH、裝環境）",
    "OpenClaw (龍蝦)": "高（要管 Daemon、寫設定檔）"
  },
  {
    "比較維度": "電腦放哪裡",
    "Grok Bot": "xAI 雲端電腦（關機筆電它照樣跑）",
    "Hermes Agent": "自己的 VPS 或家裡主機",
    "OpenClaw (龍蝦)": "自己的 VPS 或家裡主機"
  },
  {
    "比較維度": "模型自由度",
    "Grok Bot": "鎖定 Grok（不能換 Claude / GPT）",
    "Hermes Agent": "完全自由（想接哪家模型都可以）",
    "OpenClaw (龍蝦)": "完全自由（支援 15+ 種平台）"
  },
  {
    "比較維度": "殺手級特色",
    "Grok Bot": "螢幕錄製直接學會、操作無 API 網頁",
    "Hermes Agent": "會自己從任務中學新技能的自主大腦",
    "OpenClaw (龍蝦)": "生態成熟、技能市集資源最多"
  },
  {
    "比較維度": "費用結構",
    "Grok Bot": "月費制（$60 Pro+ / 內含算力）",
    "Hermes Agent": "軟體免費，自付 VPS 租金與 API 費",
    "OpenClaw (龍蝦)": "軟體免費，自付 VPS 租金與 API 費"
  },
  {
    "比較維度": "適合對象",
    "Grok Bot": "不想碰 Linux / 只想把日常瑣事外包的人",
    "Hermes Agent": "想自己改 Code 的進階開發者",
    "OpenClaw (龍蝦)": "需要跨多平台自動化的重度玩家"
  }
]
{% enddataTable %}

<h2 id="teach-skill">教它一次，存成技能</h2>

右上角有一個「教它一項任務」的按鈕
點下去之後你就在 Bot 桌面上示範一次
後續他會讀取這些操作並且把**整套流程整理成技能**

我示範的是：在 PChome 跟 momo 搜同一個型號比價

{% darrellImage800Alt "Grok Bot 對話畫面，示範完成後存成比價 PChome 與 momo 技能，並列出步驟與 query 參數" grokbot_teach_task_save_skill.png max-800 %}

存完它自己複述了一次流程，重點是這幾件事：

- 步驟固定：開 PChome 搜 `{query}`、新分頁開 momo 搜同一個詞、關掉翻譯或促銷彈窗、回報兩邊價格
- 輸入只有搜尋詞，示範時用的是 `rd280u`
- **不會下單**

`{query}` 是參數，之後想比什麼
丟型號給它就好，不用再走一次示範


<h2 id="bot-to-bot">技能是共用的，Bot 之間會互相交辦</h2>

比價這件事我不想放在主要的 Bot 身上
就問它能不能交給另一個 Bot

答案是可以，而且技能本來就是全部 Bot 共用的
它接著自己傳了一則訊息給比價小幫手，交代之後這套流程由對方負責

對話框裡會直接顯示「已傳訊息給 比價小幫手」跟「訊息來自 比價小幫手」
所以 Bot 之間講了什麼，你在自己的聊天室就看得到，不用切過去確認

代表 **Bot 之間是可以互相溝通的**
未來你可以交代給一個主要的 bot
他再幫你把任務拆分給其他專精的 bot 去執行

例如一人公司裡面的 CEO 
你交代給 CEO 後就把任務轉派給對應的部門去執行！

<h2 id="scheduled-task">例行任務：讓它每天自己跑</h2>

Grok Bot 當然也內建的排程功能
排程的設定跟其他工具一樣簡單

{% darrellImage800Alt "例行任務設定畫面，包含名稱、指示、執行時機每天上午 8:00，以及執行歷史紀錄" grokbot_scheduled_task_settings.png max-800 %}

上面有啟用中的開關跟測試執行，下面有執行歷史紀錄可以看
排程頻率選單預設是每天上午 8:00

如果想要每天跑一個比價，看看有沒有變便宜
就可以設定一個每天早上 x 點執行的排程

<h2 id="price-compare-test">實測：拿 BenQ RD280U 跑一次比價</h2>

技能存好之後，我直接比價小幫手 Bot 跑一次，順便要它整理成表格

它是邊跑邊回報的，momo 先有結果，PChome 那邊還在的截圖

{% darrellImage800Alt "比價小幫手回報 momo 搜尋結果，同時右側顯示 Bot 正在操作 momo 網頁的螢幕縮圖" grokbot_price_compare_running.png max-800 %}

右邊的螢幕縮圖可以看到它人在 momo 的搜尋頁，還順手關掉了 Google 翻譯的彈窗

全部跑完的結果：

{% darrellImage800Alt "比價小幫手完整回報 BenQ RD280U 在 PChome、momo、Yahoo 購物、良興的價格與庫存狀況" grokbot_price_compare_result.png max-800 %}

要它整理成表格，它就真的輸出一張表，欄位還自己分了網站跟出貨的倉庫！

{% darrellImage800Alt "比價小幫手輸出的比價表格，欄位為網站、頻道、品名、售價、原價，列出 PChome 官方倉、PChome 南紡購物中心與 momo 的四筆商品" grokbot_price_compare_table.png max-800 %}

分「網站」跟「頻道(倉庫)」這件事很實用
PChome 底下的官方倉跟南紡購物中心是兩種不同的出貨方式
通常官方倉庫比較會有 24h 速速到貨
南紡有 14,888 跟 16,888 兩種價格

原價 16,888，主流通路現在幾乎都落在 14,888

搭配一開始提到我們可以串接 Slack, Gmail 等等
可以多做一個指令

```
如果價格低於 14,888
請用 Slack or Gmail 通知我
```

這樣你就不會錯過真的特價的時候
偶爾回來關心一下排程是不是真的有在執行就好

<h2 id="who-should-use">適合的對象和場景</h2>


### 場景參考

{% dataTable style="minimal" align="left" %}
[
  {"適合": "常要跨好幾個網站查同一件事（比價、找貨、追蹤庫存）", "先不用急": "只需要問答、寫東西、整理資料"},
  {"適合": "要處理的網站沒有 API", "先不用急": "目標服務有現成 API 或 MCP 可以接"},
  {"適合": "有固定重複的網頁操作流程", "先不用急": "每次任務內容都不一樣"}
]
{% enddataTable %}

### 適合對象

我覺得一直對龍蝦和 Hermes 有興趣
卻不知道從哪邊下手的人都蠻適合的

但目前使用的門檻還是有點高，60, 100, 300 美金都還是不小一筆花費
如果你的日常生活或是工作場景，真的覺得需要把一些工作外包給 AI 幫忙執行
例如他**每天能幫你省下 2-3 個小時**
你又換算自己的時薪假設抓 500 元

那這個 AI 助理**每個月就能幫你省下 20000 以上！**
這樣就很適合嘗試看看

或是你想知道找人幫你梳理自己有哪些工作流程適合外包給 AI
也可以找我的付費諮詢聊聊，甚至是安排一對一的陪跑或是教學！

{% ctaCard label="" variant="service-bar" title="自動化和 AI 諮詢" url="/n8n-expert/#contact" button="預約" %}{% endctaCard %}


<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "一定要付費嗎？",
    "answer": "有免費 Trial，但要先綁信用卡官方寫明沒訂閱不會扣款，用量有限制(非常小)"
  },
  {
    "question": "Windows 可以用嗎？",
    "answer": "還不行，官網目前只有 macOS 下載"
  },
  {
    "question": "它會幫我下單付錢嗎？",
    "answer": "我實測的比價技能，它在存檔時主動註明「不會下單」不過它確實有能力操作瀏覽器，所以得在 prompt 特別寫死，或是不要登錄"
  },
  {
    "question": "SuperGrok 訂閱戶要怎麼開通？",
    "answer": "選 Get Access with Grok，把 Grok 帳號跟 Grok Bot 帳號做連結，權限和用量會取兩邊較高的方案需要 SuperGrok Heavy 或 SuperGrok Plus"
  },
  {
    "question": "跟 Claude Cowork 差在哪？",
    "answer": "<a href='/claude-cowork-intro/'>Cowork</a> 是在你自己的電腦上動你的檔案，算是跟你共用一台你的電腦(Computer Use)，Grok Bot 是給 Bot 一台它自己的電腦去外面跑前者適合整理本機資料，後者適合要跨網站操作的事"
  }
]
{% endfaq %}

## 相關文章推薦

{% articleCard url="/claude-cowork-intro/" title="Claude Cowork 教學：給大眾用的 Claude Code" previewText="同樣是桌面 AI 助理，Cowork 動的是你自己電腦裡的檔案" thumbnail="https://www.darrelltw.com/claude-cowork-intro/blog-claude-cowork-intro-bg.jpg" %}

{% articleCard url="/claude-managed-agents/" title="Claude Managed Agents 實測教學：建立雲端 AI Agent" previewText="雲端託管的 AI Agent，走 API 路線的另一個做法" thumbnail="https://www.darrelltw.com/claude-managed-agents/blog-claude-managed-agents-bg.jpg" %}


## 參考來源

- [Grok Bot 官方網站](https://x.ai/)
