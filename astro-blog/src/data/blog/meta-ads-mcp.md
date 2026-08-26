---
title: Meta 廣告 MCP 來了！真的可以讓 AI 來投廣告了嗎？
pubDatetime: 2026-08-09T12:30:00+08:00
modDatetime: 2026-08-09T12:30:00+08:00
description: Meta Ads MCP 安裝教學與台灣帳戶實測：用 Claude 連上 mcp.facebook.com/ads，確認方案、開通條件與工具權限，從 read-only 分析開始。文中記錄 2026-08-08 當時介面顯示的 95 個工具，以及資料缺欄位時的判讀提醒。
tags:
  - Meta Ads
  - MCP
  - AI
  - 廣告投放
  - Claude
categories:
  - AI
page_type: post
id: meta-ads-mcp
slug: meta-ads-mcp
draft: true
---

{% quickNav %}
[
  {"text": "開始前的準備", "anchor": "prerequisites", "desc": "方案、權限、開通了沒"},
  {"text": "安裝步驟教學", "anchor": "install", "desc": "五步驟含截圖"},
  {"text": "有什麼工具", "anchor": "tools", "desc": "2026-08-08 當時介面顯示 95 個工具、三段權限"},
  {"text": "實測發現", "anchor": "real-test", "desc": "沒投放的期間欄位會消失"},
  {"text": "不能做什麼", "anchor": "limitations", "desc": "不要把它當自動投手"},
  {"text": "導入風險", "anchor": "risks", "desc": "權限、資料、操作安全"},
  {"text": "我的建議", "anchor": "recommendation", "desc": "先從 read-only 開始"}
]
{% endquickNav %}

如果你平常有在操作 Meta Ads，流程可能是：
打開 Meta 後台迷宮，選擇日期，一層又一層的挑選想觀看的廣告
找出哪一組花費突然變高，哪一組轉換突然少那麼多

這些動作難度不高，但是機械化的操作很花時間

尤其客戶一多，或是公司自己操廣告卻開非常多的組合來測試時更麻煩

所以 Meta Ads MCP 出現或許是上述麻煩的解答
讓 AI 直接進去幫你讀數據，做好初步的分析，或是用你需要的方式來呈現數據
你也能直接跟他討論策略跟方向，光是這些就能省下超多時間

這篇我把自己的三個 Meta 廣告帳戶實際接上去測了一輪
安裝流程、實際載入的工具、還有一個我覺得最該先知道的坑，都寫在下面

{% callout info %}
**實測日期：2026-08-08**

本文的 Claude 方案支援、Meta 帳戶開通狀態、工具數量與分析圖表，都以這一天看到的實測快照為準，後續介面可能變動。
{% endcallout %}

<h2 id="prerequisites">開始之前：先確認這三件事</h2>

這是最多人卡住的地方
不是設定太難，是根本還不能用

### 1. Claude 方案

任何方案都可以，包含免費版

Meta Ads MCP 走的是 {% term def="自己貼一個網址，把 Claude 接到外部服務的功能，不用寫程式也不用申請 API key" %}自訂連接器{% endterm %}

網路上不少文章寫「需要 Claude Pro 以上」，那個說法跟官方文件對不上。[官方說明文件](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)寫的是 Free、Pro、Max、Team、Enterprise 都能用（Claude、Cowork、Claude 桌面版都支援）

數量限制的部分，官方只寫了一句：**免費版限一個自訂連接器**

{% callout info %}
Pro、Max、Team、Enterprise 各能加幾個，官方文件沒有寫出數字（2026-08-09 查證兩篇官方說明文件）

所以我只能說「付費方案不只一個」，實際上限多少我沒有查到官方數字，也沒實測到撞牆
{% endcallout %}

Team 和 Enterprise 還有一個限制：**只有 Owner（擁有者）能新增自訂連接器**，一般成員沒辦法自己加

### 2. Meta 廣告帳戶權限

你的 Facebook 帳號要在 Business Manager 裡有該廣告帳戶的管理權限

如果你只是「廣告帳戶分析師」這種唯讀身分，連上之後可能查不到東西

### 3. 你的帳戶開通了沒

這點最容易被忽略

Meta 是分批開通，不是公告當天全球都能用，各家文章大多只轉述「美國和高消耗帳戶優先」就沒了

我實際查了自己的三個台灣廣告帳戶，`is_ads_mcp_enabled` 和 `is_queryable` 都是 `true`，幣別 TWD

{% callout type="warning" title="這只能代表我這三個帳戶" %}
分批開通的意思就是每個人結果不一樣，我開了不代表你也開了

判斷方式很簡單：照下面的步驟做完，如果連接器出現了、卻一個工具都看不到，
通常不是你設定錯，是你的帳戶還沒被排到
{% endcallout %}

<h2 id="install">安裝步驟</h2>

跟 GA4 那種要建 Service Account、下載 JSON key 的流程比起來
這個簡單很多，不用開發者帳號、不用 API key

我用 Claude 桌面版示範，整個流程五步驟

### 1. 打開設定

點左下角自己的頭像，選 `Settings`

{% darrellImage800Alt "Claude 桌面版左下角頭像選單展開，橘色箭頭標示 Settings 選項" meta_ads_mcp_settings_entry.png max-800 %}

### 2. 進 Connectors，選新增自訂連接器

左側選單找到 `Connectors`，右上角按 `Add`，選 `Add custom connector`

{% darrellImage800Alt "Claude 設定的 Connectors 頁面，橘色標號依序指出左側 Connectors 選單、右上角 Add 按鈕、以及展開後的 Add custom connector 選項" meta_ads_mcp_connectors_add_custom.png max-800 %}

### 3. 填名稱和網址

名稱自己取，網址貼上：

<div class="copyable-list">
  <a class="copyable" data-copy="https://mcp.facebook.com/ads">https://mcp.facebook.com/ads</a>
</div>

下面的 OAuth Client ID 和 Secret 兩個欄位留空就好，Meta 這邊不需要填

{% darrellImage800Alt "Claude 的 Add custom connector 對話框，橘色標號 1 指向名稱欄位填入 Meta ads，標號 2 指向網址欄位填入 mcp.facebook.com/ads" meta_ads_mcp_add_connector_dialog.png max-800 %}

### 4. 完成 Facebook 授權

按下 Add 之後會跳到 Facebook 的授權畫面

{% darrellImage800Alt "Facebook 授權畫面，標題寫著要將 Claude 重新連結到 ads MCP server 嗎，畫面上有編輯設定與繼續兩個按鈕，橘色箭頭指向繼續" meta_ads_mcp_facebook_authorize.png max-800 %}

{% callout type="warning" title="這一步請看清楚再按" %}
畫面上有「編輯設定」和「繼續」兩個按鈕

**要挑開放哪些廣告帳戶，得先按「編輯設定」**
直接按「繼續」是沿用你先前的設定

如果你手上管很多客戶帳戶，按錯就是把別的客戶資料一起開給 AI 看

另外這張圖是我重新連結時截的（我之前連過），所以文案寫「重新連結」
你第一次連的文案會不太一樣，但要確認的事情是同一件
{% endcallout %}

授權畫面下方那段小字也值得看一眼：Claude 會擁有跟你相同的廣告管理權限，花費和變更由你自己負責，Meta 不為結果擔保

### 5. 回到 Claude 啟用

授權完回到對話框，按 `+` 選 `Connectors`，確認 Meta ads 的開關是打開的

{% darrellImage800Alt "Claude 對話框的加號選單展開到 Connectors，右側清單中 Meta ads 那一列的開關為開啟狀態，橘色箭頭指向該開關" meta_ads_mcp_enable_toggle.png max-800 %}

接著問一句話測連通：

<div class="copyable-list">
  <a class="copyable" data-copy="列出我可以存取的 Meta 廣告帳戶">列出我可以存取的 Meta 廣告帳戶</a>
</div>

有回帳戶清單就是成功了

<h2 id="tools">連上之後會拿到什麼：2026-08-08 當時介面顯示 95 個工具</h2>

這裡有個數字要更正

目前中英文的教學文章幾乎都寫「29 個工具」，那是 4 月剛發布時的數字
我在 **2026-08-08** 實際連上去數，當時介面顯示 **95 個工具**。這是本次實測快照，不是永久固定的數字。

Claude 的連接器設定頁面會把當時顯示的這 95 個工具分成三組，各自可以設不同的權限

{% darrellImage800Alt "2026-08-08 當時介面顯示的 Claude Meta ads 工具權限頁面，共 95 個工具，分成 Interactive tools 4 個、Read-only tools 54 個、Write delete tools 37 個，三組都設定為 Needs approval" meta_ads_mcp_tool_permissions.png max-800 %}

{% dataTable style="minimal" align="left" highlight="1" %}
[
  {"分組": "Read-only tools", "幾個": "54", "在做什麼": "查帳戶、拉 Campaign 成效、看素材、查像素資料品質", "建議": "只開這組就夠用"},
  {"分組": "Write/delete tools", "幾個": "37", "在做什麼": "改預算、改素材、改受眾包、刪商品", "建議": "一開始設成禁止"},
  {"分組": "Interactive tools", "幾個": "4", "在做什麼": "建立 Campaign、建立 Ad Set、建立 Ad、成效趨勢分析", "建議": "前三個設成禁止；成效趨勢分析每次詢問，確認後也可允許"}
]
{% enddataTable %}

我覺得最需要注意的是 Interactive tools 這組

它只有 4 個，名字聽起來像是互動功能，實際上裡面三個是「建立 Campaign」「建立 Ad Set」「建立 Ad」
如果你照直覺以為 Write/delete 才是危險的那組，就會漏掉這三個

另外，這次 2026-08-08 實測介面顯示的 95 個工具裡，有 34 個是商品目錄相關（product feed、product set、catalog diagnostics 這類）
超過三分之一的工具是給電商用的，一般投手大概一輩子都不會用到

### 權限可以設到什麼程度

展開任何一組，每個工具後面都有三段可以選：直接允許、每次詢問、完全禁止
也可以整組一起設

{% darrellImage800Alt "Claude 工具權限頁面展開後的樣子，Interactive tools 下列出建立廣告等四個工具，每個工具右側有允許、詢問、禁止三個圖示按鈕" meta_ads_mcp_tool_permissions_expanded.png max-800 %}

預設三組都是「每次詢問」

這個設計其實幫我們把後面「先從 read-only 開始」那件事變得很好執行：不用靠自律，先把 Write/delete 那 37 個整組設成禁止，再把 Interactive 裡建立 Campaign、建立 Ad Set、建立 Ad 這三個工具設成禁止。剩下的成效趨勢分析可以設成每次詢問，確認需求後再決定是否直接允許

<h2 id="real-test">實測：我把自己的帳戶接上去問了一輪</h2>

工具連上之後，我做的第一件事是請它列出今年每一檔 Campaign 的花費、曝光、點擊

以這次帳戶在 2026-01-01 至 2026-08-08 的查詢期間來看，27 檔裡面只有 7 檔回了數字
剩下 20 檔什麼成效欄位都沒有

我換過欄位名稱、換帳戶、換排序，通通一樣

### 它不是回 0，是把欄位整個拿掉

一般會以為沒花錢就是回 `0`
實際上不是

有投放的那筆長這樣：

```json
{
  "id": "1202xxxxxxxx",
  "name": "Campaign B",
  "amount_spent": "NT$xxx TWD",
  "impressions": "3959",
  "clicks": "347"
}
```

沒投放的那筆長這樣：

```json
{
  "id": "1202xxxxxxxx",
  "name": "Campaign H"
}
```

`amount_spent`、`impressions`、`clicks` 這三個欄位直接消失
不是 `0`，不是 `null`，是這幾個 key 根本不在資料裡

{% callout type="warning" title="沒投放的期間，成效欄位不是 0，是整個消失" %}
我查這次帳戶 2026-01-01 至 2026-08-08 的期間，27 檔 Campaign 只有 7 檔回了成效數字
另外 20 檔連 `amount_spent` 這個欄位都沒有

後來把時間拉到 2020 年起再查一次，那 20 檔全部都有花費
它們只是停在去年，今年沒再跑

所以資料是對的，這不是 bug
問題出在回傳裡沒有任何地方寫「這段期間沒有投放」

AI 拿到一筆只有名字的資料，只能自己猜是零花費還是查不到

這是本次帳戶期間的資料判讀提醒，不代表其他帳戶也會是 27、7、20 這個比例。
{% endcallout %}

### 所以「幫我做今年的成效分析」這種問法很危險

我實際請它做了一次今年的分析
它產出的報告看起來很完整，有總花費、有 CTR、有 CPC、有排名

{% darrellImage800Alt "匿名化 Meta Ads 成效分析 dashboard，顯示標題、曝光、點擊、整體 CTR 與各 Campaign CTR 圖，僅用匿名的 Campaign A 到 G，未顯示帳戶 ID 或金額" meta_ads_mcp_analysis_dashboard.png max-800 %}

這張匿名化圖表只用了該期間有回傳數字的 7 檔 Campaign，因此仍須回 Meta 後台核對。

但那份報告只涵蓋 27 檔裡的 7 檔

如果我沒有回後台對過，我不會知道有七成以上的 Campaign 根本沒被算進去

而且同一份清單裡有的有數字、有的沒有，混在一起，AI 更容易搞混

比較安全的問法是把期間講死，並且要求它把「沒有回傳成效的項目」單獨列出來
不要讓它自己決定哪些該算、哪些不算

<h2 id="what-is-meta-ads-mcp">Meta Ads MCP 是什麼？</h2>

MCP（Model Context Protocol）可以想成 AI 工具連接外部服務的插頭標準。Meta Ads MCP 就是讓 Claude 透過 Meta 的連接器讀取廣告帳戶資料，省掉自己寫程式串接的前置工作。

以前要查 Campaign、Ad Set、Ads 或 Insights，通常得進 Ads Manager 手動切層級，或自己寫程式串 Meta Marketing API。現在可以直接用自然語言問：

> 幫我看過去 7 天，哪些 Campaign 花費增加但轉換下降？

重點不是 AI 突然知道所有投放策略，而是它**讀得到你的廣告資料**，能先幫你整理和提出檢查方向。想看 MCP 接進 Claude 後的其他用法，也可以延伸閱讀[Claude Desktop 的 MCP 實際使用方式](/claude-desktop-new-mcp-features-review/)。

<h2 id="quick-summary">誰適合接？</h2>

我會把它當成「廣告資料分析助理」，不是「自動投放機器人」

最有感的應該是代理商跟同時管很多組合的投手
你每天要重複檢查的那些東西，它可以先幫你看過一輪

電商行銷也蠻適合，尤其是那種「花費突然變高但 ROAS 掉了」的檢查

如果你期待的是「我給 AI 預算，它自動幫我開廣告、調預算、關素材」
那我會說先不要

<h2 id="use-cases">實際可以拿來做什麼？</h2>

### 找出異常 Campaign

我覺得這會是最實用的場景

例如：

> 找出過去 3 天花費增加超過 30%，但轉換數下降的 Campaign，並推測可能原因。

它不會直接知道真正原因，但會把檢查方向列出來：預算是不是剛被放大、素材是不是疲乏了、CPC 有沒有上升、轉換事件是不是壞掉、是不是只有某一組 Ad Set 在拖

這比丟一張報表給你看有用，至少你知道下一步要點哪裡

### 跨資料源一起看

MCP 的有趣之處在於，它不一定只能接一個服務

如果你的 AI 工具同時能讀 Meta Ads、GA4、Google Sheets，它就可以回答更接近真實業務的問題：

> 哪些 Campaign 在 Meta 後台看起來轉換不錯，但 GA4 的 engaged sessions 和實際訂單品質比較差？

這種問題你在 Ads Manager 裡面是問不出來的

### 其他常見用法

{% dataTable style="minimal" align="left" %}
[
  {"用途": "帳戶概況摘要", "怎麼問": "整理過去 7 天花費、曝光、點擊、轉換、ROAS，指出最需注意的 3 個 Campaign", "備註": "省下切層級、篩欄位的時間"},
  {"用途": "比較 Campaign", "怎麼問": "比較這三個 Campaign 過去 14 天表現，用表格整理", "備註": "重點是整理成能判斷的形式，不是讓 AI 決定加預算"},
  {"用途": "週報初稿", "怎麼問": "整理成客戶看得懂的週報，分本週成效、主要變化、下週建議", "備註": "只能當初稿，最後要人確認數據和原因"},
  {"用途": "素材疲乏檢查", "怎麼問": "找出 CTR 下降、CPC 上升、頻率增加的 Ads", "備註": "分成高風險、中風險、需要更多資料三類"}
]
{% enddataTable %}

這些問法的共通點是：**先要求 AI 整理和解釋，不要求它直接修改廣告**

<h2 id="limitations">Meta Ads MCP 不能做什麼？</h2>

MCP 這個詞最近很容易被講得太神，所以這段我想講清楚一點

### 它不知道資料有沒有缺

這就是上面實測那段的重點

它給你的東西看起來很完整，但你不知道有多少項目因為欄位不見了被漏掉
而它自己也不知道

### 它不知道你的商業脈絡

某個 Campaign ROAS 低，不代表要關掉
那可能是新客開發用的，本來就不該用短期 ROAS 評估
這件事只有你知道，資料裡沒有

轉換下降也一樣，它會給你一串可能原因，但真正的原因可能是網站變慢、Pixel 壞掉、商品缺貨、優惠剛結束、競品在大促
這些都要人去驗

還有一個更基本的：定義

- ROAS 是看 Meta 後台，還是看 GA4？
- Attribution window 幾天？
- Conversion event 是 Purchase、Lead，還是自訂事件？
- 客戶真正在意的是訂單、名單，還是有效名單？

這些沒講清楚，它照樣會給你一份看起來很合理的分析

<h2 id="risks">導入前要注意的三個風險</h2>

### 1. 權限風險

Meta 廣告帳戶通常牽涉預算、素材、受眾、成效資料

如果要把它接到 AI 工具，第一件事是確認權限，prompt 怎麼寫之後再說

好消息是這件事現在有具體做法了，就是上面那個工具權限頁面：進 Connectors 找到 Meta ads，把 Write/delete tools 那 37 個整組設成禁止，Interactive tools 裡建立 Campaign、建立 Ad Set、建立 Ad 這三個工具也設成禁止。成效趨勢分析則設成每次詢問，確認它只做分析後再考慮允許

除此之外還要確認：

- 授權時按「編輯設定」挑清楚要開放哪些廣告帳戶
- 是否用個人帳號以外的正式流程授權
- 是否有權限移除和稽核紀錄

如果你是在公司或代理商環境，更不建議用個人帳號隨便接

### 2. 資料安全風險

投放預算、轉換成本、受眾策略、素材方向、產品檔期，這些都是商業機密

如果你是幫客戶管帳戶，接之前先翻一下合約，看有沒有寫「不得將資料提供給第三方服務」
這條在代理商合約裡蠻常見的，而且它包含 AI 工具

自己公司的帳戶就自己判斷，重點是問清楚對話和資料會不會被保留

### 3. 操作安全風險

就算權限和資料都處理好了，也不代表可以直接讓它動廣告

我自己的做法是初期只給查詢，所有調整都回後台自己按

真的要往半自動走，至少先講好單次調整的預算上限，還有留下操作紀錄
代理商幫客戶管帳戶的話，這件事要先跟客戶講，不要做完才說

<h2 id="comparison">和 Ads Manager、Looker Studio 差在哪？</h2>

Meta Ads MCP 不是要取代所有工具

我會這樣分：

{% dataTable style="minimal" align="left" %}
[
  {"工具": "Meta Ads Manager", "最適合": "正式操作和細部檢查", "限制": "要人工切層級、篩欄位、整理結論"},
  {"工具": "Looker Studio", "最適合": "固定報表和例行儀表板", "限制": "臨時追問和原因分析比較不直覺"},
  {"工具": "Meta Ads MCP", "最適合": "自然語言提問、異常整理、產生檢查方向", "限制": "需要控管權限，回傳也可能缺欄位"}
]
{% enddataTable %}

如果你每天都看固定指標，Looker Studio 還是很好用
如果你要正式調整廣告，Ads Manager 還是主戰場

Meta Ads MCP 比較像是卡在中間的分析助理，適合處理「我現在想問一個臨時問題」這種情境

<h2 id="recommendation">我的建議：先從 read-only 開始</h2>

如果你問我 Meta Ads MCP 值不值得試，我會說值得

但導入順序要保守一點

實際的做法我會這樣走：

{% dataTable style="minimal" align="left" %}
[
  {"步驟": "1", "動作": "權限頁面把 Write/delete 那 37 個整組設成禁止；Interactive 裡建立 Campaign、建立 Ad Set、建立 Ad 三個工具也設成禁止；成效趨勢分析設成每次詢問", "目的": "先鎖住所有會建立或修改廣告的工具，不靠自律；分析工具則保留確認機會"},
  {"步驟": "2", "動作": "讀取過去 7 天 Campaign 成效", "目的": "先掌握整體狀況"},
  {"步驟": "3", "動作": "要求它列出沒有回傳成效的項目", "目的": "避免報告漏掉一大半"},
  {"步驟": "4", "動作": "找出花費、CPA、ROAS 異常變化", "目的": "縮小檢查範圍"},
  {"步驟": "5", "動作": "產出檢查清單，人工確認後才調整", "目的": "避免 AI 直接影響預算"}
]
{% enddataTable %}

不要一開始就追求「AI 自動幫我投廣告」

廣告投放有太多商業脈絡，不是只看後台數字就能判斷

比較務實的做法是讓 AI 省下整理資料的時間，讓人把注意力放在策略和判斷上

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "需要付費的 Claude 方案才能用嗎？",
    "answer": "不用，免費版就可以，官方明寫限一個自訂連接器。<br><br>不少教學寫「需要 Pro 以上」，那跟官方文件對不上。付費方案各能加幾個，官方沒有公布數字。<br><br>Team 和 Enterprise 比較特別，只有 Owner 能新增自訂連接器。"
  },
  {
    "question": "2026-08-08 實測時，介面顯示的是 29 個還是 95 個工具？",
    "answer": "以 2026-08-08 這次實測來看，當時介面顯示 <strong>95 個工具</strong>。這是當天的實測快照，不是永久固定的數字。29 是四月剛發布時的數字，後來大家互相抄就一直沒更新。<br><br>你也可以自己對：當時權限頁面的 54 + 37 + 4 就是當時顯示的 95 個工具。"
  },
  {
    "question": "台灣的廣告帳戶可以用了嗎？",
    "answer": "我自己三個台灣帳戶都可以，<code>is_ads_mcp_enabled</code> 和 <code>is_queryable</code> 都是 true。<br><br>但這是分批開通，我開了不代表你也開了。最快的判斷方式：照文章裝完，如果連接器出現但一個工具都沒有，就是還沒輪到你。"
  },
  {
    "question": "為什麼我問成效，它只回廣告名稱沒有數字？",
    "answer": "那段期間那些 Campaign 沒在跑。<br><br>麻煩的是它不會回 0，是把 <code>amount_spent</code>、<code>impressions</code>、<code>clicks</code> 整個拿掉，也不會跟你說為什麼。時間範圍拉長再查一次就會出來。"
  },
  {
    "question": "可以直接叫它幫我調預算嗎？",
    "answer": "技術上可以，那些工具在 Write/delete 那 37 個裡面。但我會先把那組鎖起來，等你確認過它讀資料的品質再說。"
  },
  {
    "question": "它可以取代廣告投手嗎？",
    "answer": "不能，它連自己漏掉一半資料都不知道。"
  }
]
{% endfaq %}

<h2 id="summary">總結：省掉的是第一輪整理</h2>

實際測完，我覺得它值得裝

安裝比想像中簡單很多，五個步驟、不用 API key、不用開發者帳號
權限也比想像中好控制，三組工具分開設，把 Write/delete 那 37 個和 Interactive 裡三個會建立廣告的工具鎖掉；成效趨勢分析則先每次詢問

真正省下來的是每天那段重複的整理：切層級、篩欄位、排序、然後自己看出哪裡怪怪的
這件事它做得比人快，而且不會累

但實測那段一定要記得：**它給你的資料看起來完整，不代表真的完整**

沒投放的期間欄位會消失，AI 分不出「花了 0 元」和「查不到」
你要嘛把期間講死，要嘛要求它把沒回傳成效的項目單獨列出來

我自己現在的用法是把它當第一輪，最後那個「所以要不要調」的決定還是自己下

<h2 id="related">相關文章</h2>

{% articleCard url="/ga4-search-console-mcp-install/" title="如何在 Claude Desktop 安裝 GA4、SEO MCP" previewText="用 Service Account 把 GA4 和 Search Console 接進 Claude，另一種需要建金鑰的 MCP 安裝流程。" thumbnail="https://www.darrelltw.com/ga4-search-console-mcp-install/ga4-search-console-mcp-cover.jpg" %}

{% articleCard url="/claude-desktop-new-mcp-features-review/" title="Claude MCP 應用測試心得 - Claude Desktop" previewText="從 FileSystem、Fetch 到 Google Maps，看看 Claude Desktop 的 MCP 實際使用方式。" thumbnail="https://www.darrelltw.com/claude-desktop-new-mcp-features-review/claude_desktop_mcp_bg.jpg" %}

{% articleCard url="/line-mcp-server/" title="LINE MCP Server 測試心得" previewText="用 MCP 讓 Claude 直接操作 LINE Messaging API，延伸了解 MCP 的實作場景。" thumbnail="https://www.darrelltw.com/line-mcp-server/line_mcp_server_bg.jpg" %}

## 參考資料

- [Introducing Meta Ads AI Connectors: Manage Your Meta Ads From the AI Tools You Already Use](https://www.facebook.com/business/news/meta-ads-ai-connectors)
- [Meta Marketing API](https://developers.facebook.com/documentation/ads-commerce/marketing-api)
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io/docs/getting-started/intro)
- [Get started with custom connectors using remote MCP｜Claude Help Center](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- [Use connectors to extend Claude's capabilities｜Claude Help Center](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities)
