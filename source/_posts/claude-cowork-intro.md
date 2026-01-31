---
title: Claude Cowork 教學：給大眾用的 Claude Code
tags:
  - Claude
  - AI
  - 自動化
  - 生產力工具
categories:
  - AI工具
page_type: post
id: claude-cowork-intro
description: Claude Cowork 是 Anthropic 推出的桌面 AI 助理，能自動整理檔案、處理文件，還能學習你的工作流程。實測三大應用場景，看看它如何提升工作效率。
bgImage: blog-claude-cowork-intro-bg.jpg
date: 2026-01-17 15:33:17
modified: 2026-01-31 10:00:00
---


{% darrellImageCover claude-cowork-intro-bg blog-claude-cowork-intro-bg.jpg %}

{% callout type="tip" title="重點摘要" %}
**Claude Cowork = 給非工程師用的 Claude Code**
- 圖形化介面，不用學終端機指令
- 能直接讀取、編輯、建立電腦上的檔案
- Claude Pro（$20/月）以上即可使用，目前僅支援 macOS
{% endcallout %}

{% quickNav %}
[
  {"text": "什麼是 Cowork", "anchor": "what-is-cowork", "desc": "基本介紹"},
  {"text": "Code vs Cowork", "anchor": "code-vs-cowork", "desc": "兩者差異比較"},
  {"text": "安全提醒", "anchor": "safety-tips", "desc": "使用前注意事項"},
  {"text": "實測場景", "anchor": "use-cases", "desc": "三大應用場景"},
  {"text": "進階功能", "anchor": "advanced-features", "desc": "連接器與 Chrome 整合"},
  {"text": "Plugins", "anchor": "plugins", "desc": "11 個官方 plugins 介紹"},
  {"text": "常見問題", "anchor": "faq", "desc": "FAQ"}
]
{% endquickNav %}

最近應該蠻多人看到 Claude Code 被說多好用，但自己要使用時往往只能硬著頭皮學 {% term def="終端機指令介面，透過文字輸入指令來操作電腦" %}Command Line{% endterm %} 介面
或是需要用 Cursor 或 Antigravity 然後使用 Claude Code 的 extension 

開始使用這些工具之前可能就會想問：
**這不是工程師在用的嗎？對我來說是不是太難？**

Claude Cowork 的誕生就解決了這個大問題！

Claude Code 好用的地方在於它能直接存取電腦上的檔案
這時候 AI 跟你的協作方式就比 ChatGPT 還有效率很多

以前要處理或分析某個檔案，你需要先把資料上傳給 ChatGPT 再請他幫你分析
得到分析結果後再自己轉存到其他檔案
你也無法請 ChatGPT 直接幫你改這個檔案的內容
(例如 Excel 直接加一個欄位或是多一個分頁的資料)

現在推出 Claude Cowork
你一樣可以用圖形化介面來操作，就好像是一個可以直接存取你電腦某個資料夾的 ChatGPT

<h2 id="what-is-cowork">什麼是 Claude Cowork？</h2>

Claude Cowork 是 Anthropic 推出的桌面 AI 工具，基於 Claude Code，
Cowork 專為非開發者設計，不用寫程式就能使用。

它最大的特色是你只要授權它存取特定資料夾，它就能**讀取、編輯、建立**檔案。

{% darrellImage800Alt "Claude Cowork 主介面，左下角選擇資料夾，右下角選擇模型" cowork_main_interface.png max-800 %}

介面很直覺，左下角選擇要授權的資料夾，右下角選擇模型（建議用 Opus 4.5），然後就可以開始跟 Cowork 對話了。

{% callout type="info" %}
2025/01/17 更新：Cowork 已開放給 Claude Pro（$20/月）以上方案使用，不再限定 Max 訂閱。
目前僅支援 macOS，Windows 版本預計之後推出。
{% endcallout %}

<h2 id="code-vs-cowork">Claude Code vs Cowork 差在哪？</h2>

很多人會問：「這跟 Claude Code 有什麼不同？」

簡單來說，**Cowork 就是給非工程師用的 Claude Code**。技術上兩者用的是同一個底層引擎（{% term def="Anthropic 開發的 AI Agent 框架，讓開發者能建立具備自主決策能力的 AI 應用" %}Claude Agent SDK{% endterm %}），差別在於：

{% dataTable style="minimal" %}
[
  {"項目": "介面", "Claude Code": "終端機（Command Line）", "Cowork": "圖形化介面"},
  {"項目": "目標用戶", "Claude Code": "工程師", "Cowork": "一般用戶"},
  {"項目": "安全機制", "Claude Code": "需自行設定", "Cowork": "內建 {% term def="一種安全隔離技術，讓程式在受限的環境中執行，避免影響系統" %}sandbox{% endterm %}"},
  {"項目": "學習門檻", "Claude Code": "需懂基本指令", "Cowork": "選資料夾就能用"}
]
{% enddataTable %}

如果你已經會用 Claude Code，Cowork 對你來說可能沒有太大吸引力。
但如果你是想讓 AI 幫忙處理檔案，又不想碰終端機的人，Cowork 就是為你設計的。

<h2 id="safety-tips">使用前的安全提醒</h2>

{% callout type="warning" %}
Cowork 能直接存取你的檔案，使用前請注意：

1. **不要授權敏感資料夾** - 避免給它存取財務文件、密碼檔案等
2. **{% term def="給 AI 的指令或提示詞，用來引導 AI 產生特定回應" %}prompt{% endterm %} 要明確** - 模糊的指令可能導致誤刪檔案

Anthropic 有內建防護機制，但建議先用測試資料夾試用，熟悉後再處理重要檔案。
{% endcallout %}

<h2 id="use-cases">實測三大應用場景</h2>

### 場景 1：下載資料夾自動整理

大家的下載資料夾應該都是非常的亂，把他交給 Cowork 處理

它會自動掃描檔案，依類型和內容分類到不同資料夾。

我請 Cowork 分析我的下載資料夾，它會自動執行多個指令來掃描檔案結構、分析檔案類型和找出重複檔案：

{% darrellImage800Alt "Cowork 自動掃描下載資料夾的執行過程" cowork_downloads_cleanup_process.png max-800 %}

分析完成後，Cowork 會給出詳細的報告，包含資料夾大小、檔案數量，以及優先清理建議：

{% darrellImage800Alt "Cowork 分析結果報告，顯示資料夾大小和清理建議" cowork_downloads_analysis_result.png max-800 %}

實測結果：我的下載資料夾有約 3,700 個檔案，Cowork 找出了約 1.4 GB 可以立即刪除的檔案。

### 場景 2：把 PDF 轉換成 PowerPoint 簡報

之前有好幾份 PDF 文件
如果想要轉成簡報，還得自己先閱讀過後，從頭開始建立 PPT 簡報
現在居然只要簡單一行 prompt 
他就能生成一個蠻完整的簡報給我

{% darrellImage800Alt "Cowork 將 PDF 轉換成 PowerPoint 簡報的執行過程" cowork_pdf_to_ppt_process.png max-800 %}

### 場景 3：批次檔案重命名

請 Cowork 把照片依拍攝日期重新命名，它會分析檔案屬性，批次處理重命名。
整理大量照片、文件檔案時特別好用。

{% darrellImage800Alt "Cowork 批次重命名照片檔案的執行過程" cowork_rename_files_process.png max-800 %}

## 其他應用場景

除了上面實測的場景，Cowork 還可以做到：

- **品牌簡報自動生成** - 自動套用品牌資產和視覺風格
- **社群媒體影片編輯** - 長影片轉短影片（適合 LinkedIn、IG）
- **數據分析報表** - 從資料檔案提取數據生成圖表和分析
- **費用報表** - 從收據照片自動生成 Excel 費用表

例如我把 Threads 數據的 Excel 丟給 Cowork，
請它分析哪些內容類型表現最好，它就自動產出完整的分析報告：

{% darrellImage800Alt "Cowork 自動產出的 Threads 數據分析報告" cowork_data_analysis_report.png max-800 %}

<h2 id="advanced-features">進階功能：連接器與 Chrome 整合</h2>

Cowork 不只能處理本機檔案，還能透過 **{% term def="連接器，用來串接外部服務和工具的功能模組" %}Connectors{% endterm %}** 連接外部服務，以及搭配 **Claude in Chrome** 執行瀏覽器任務。

### 連接器 (Connectors)

Connectors 讓 Claude Cowork 可以存取外部工具和資料
透過 {% term def="讓 Claude 能連接你的工具（如 HubSpot、Notion）的技術標準" %}MCP{% endterm %} 來實現，目前已經支援超多種整合

{% darrellImage800Alt "Claude Connectors 設定頁面，顯示 Google Drive、Gmail、GitHub 等官方連接器的連線狀態" cowork_connectors_settings.png max-800 %}

**官方預建連接器**：

{% dataTable style="minimal" %}
[
  {"連接器": "Gmail", "功能": "讀取、發送郵件", "狀態": "✅ 可用"},
  {"連接器": "GitHub", "功能": "程式碼倉庫管理", "狀態": "✅ 可用"},
  {"連接器": "Microsoft 365", "功能": "Office 文件處理", "狀態": "✅ 可用"},
  {"連接器": "Google Drive", "功能": "雲端檔案存取", "狀態": "⏳ 尚未上線"},
  {"連接器": "Google Calendar", "功能": "日曆管理", "狀態": "⏳ 尚未上線"}
]
{% enddataTable %}

**第三方連接器**（部分列舉）：
- **生產力**：Asana、ClickUp、Notion、Jira、Confluence
- **設計**：Figma
- **資料分析**：Snowflake、Amplitude
- **行銷**：HubSpot、ActiveCampaign、Bitly

{% darrellImage800Alt "Claude Connectors 市集介面，顯示多種第三方連接器如 Circleback、Day AI、Fireflies 等" cowork_connectors_marketplace.png max-800 %}

### Chrome 瀏覽器整合

搭配 **Claude in Chrome** 擴充功能，Cowork 可以在瀏覽器中執行任務：

- 點擊按鈕、填寫表單
- 導覽網頁分頁
- 批次處理網頁任務（如取消電子報訂閱）
- 網頁資料擷取

例如我請 Cowork 幫我瀏覽自己的網站，看看有哪些文章：

{% darrellImage800Alt "Claude in Chrome 擴充功能瀏覽 Darrell TW 網站的畫面" cowork_chrome_browse_website.png max-800 %}

它會自動開啟瀏覽器、捲動頁面，最後整理出文章清單給我：

{% darrellImage800Alt "Cowork 搭配 Chrome 瀏覽網站後列出文章清單的執行結果" cowork_chrome_article_list.png max-800 %}

{% callout type="warning" %}
Chrome 整合有兩個限制：
1. **速度較慢**：需要截圖往返處理，不如本機操作流暢
2. **安全考量**：避免在銀行、金融等敏感網站使用
3. **瀏覽器限制**：僅支援 Chrome，不支援 Brave、Arc 等其他瀏覽器
{% endcallout %}

<h2 id="plugins">Plugins （2026/01/30 新功能）</h2>

Anthropic 在 2026/01/30 推出 **Cowork Plugins**，讓 Claude 能在特定工作領域變得更專業。

### 什麼是 Plugins？

Plugins 讓 Claude 成為特定領域的專家，提供相關技能的專業知識。

每個 Plugin 由三個部分組成：
- **Skills**：自動載入的專業知識，Claude 會在相關情境自動套用
- **Commands**：斜線指令，手動觸發特定工作流程
- **Connectors**：{% term def="讓 Claude 能連接你的工具（如 HubSpot、Notion）的技術標準" %}MCP{% endterm %} 整合，連接外部工具


### 官方 11 個 Plugins 一覽

{% dataTable style="minimal" align="left" %}
[
  {"Plugin": "productivity", "用途": "任務管理、日曆、工作流程", "整合工具": "Slack、Notion、Asana"},
  {"Plugin": "sales", "用途": "客戶研究、通話準備、CRM 更新", "整合工具": "HubSpot、Salesforce"},
  {"Plugin": "customer-support", "用途": "工單處理、回覆草稿、知識庫查詢", "整合工具": "Intercom、Zendesk"},
  {"Plugin": "product-management", "用途": "PRD 撰寫、路線圖規劃", "整合工具": "Linear、Jira、Figma"},
  {"Plugin": "marketing", "用途": "內容創作、活動規劃、素材設計", "整合工具": "Canva、HubSpot"},
  {"Plugin": "legal", "用途": "合約審查、合規評估", "整合工具": "Box、Jira"},
  {"Plugin": "finance", "用途": "日記帳、財務報表、預算分析", "整合工具": "Snowflake、BigQuery"},
  {"Plugin": "data", "用途": "SQL 查詢、資料視覺化", "整合工具": "Snowflake、Hex"},
  {"Plugin": "enterprise-search", "用途": "跨工具統一搜尋", "整合工具": "Slack、Notion、Guru"},
  {"Plugin": "bio-research", "用途": "文獻搜尋、基因分析", "整合工具": "PubMed、Benchling"},
  {"Plugin": "cowork-plugin-management", "用途": "建立/管理其他 plugins", "整合工具": "—"}
]
{% enddataTable %}

{% darrellImage800Alt "Cowork Plugin Marketplace，顯示 10 個官方 plugins" cowork_plugin_marketplace.png max-800 %}

### 安裝與使用

1. Cowork 介面左下角有個 Plugin 的按鈕：

{% darrellImage800Alt "Cowork 介面左下角的 Plugins 按鈕位置" cowork_plugin_button_location.png max-800 %}

2. 點進去後，就能瀏覽所有可用的 plugins：

{% darrellImage800Alt "Browse plugins 介面，可以瀏覽和安裝各種 plugins" cowork_plugin_browse_list.png max-800 %}

安裝後，Plugin 提供的 Commands 會直接顯示在主介面，方便你快速使用：

{% darrellImage800Alt "安裝 Data plugin 後的 Cowork 介面，顯示 6 個斜線指令" cowork_plugin_commands_interface.png max-800 %}

### 實際應用範例

**Data Plugin 應用場景**：
裡面有資料分析、統計分析、資料視覺化等技能可以使用。

實測用 Data plugin 分析 Threads 發文數據，直接產出完整的統計報表：

{% darrellImage800Alt "Data plugin 分析 Threads 發文數據的結果，顯示近一個月發文統計" cowork_plugin_data_analysis_result.png max-800 %}

### 自訂 Plugins

{% callout info %}
這段是進階內容，目前要自訂 Plugin 難度較高
{% endcallout %}

官方 plugins 可以在 [GitHub](https://github.com/anthropics/knowledge-work-plugins) 上找到完整 source code。

除了從 Marketplace 安裝，你也可以上傳自己打包的 plugin：

1. 在 Plugins 管理介面點選「+」
2. 選擇「Upload local plugin」
3. 拖曳或選擇 `.zip` 檔案

{% darrellImage800Alt "上傳自訂 Plugin 介面，可拖曳 .zip 檔案或點選瀏覽" cowork_plugin_upload_local.png max-800 %}

{% callout type="warning" %}
自訂 plugin 不受 Anthropic 審核，安裝前請確認來源可信任。
{% endcallout %}

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "Cowork 和 Claude Code 有什麼不同？",
    "answer": "兩者的底層其實很像，差別在介面：Claude Code 是終端機指令，Cowork 是圖形化介面。"
  },
  {
    "question": "Cowork 支援 Windows 嗎？",
    "answer": "目前僅支援 macOS。Anthropic 表示 Windows 版本預計 2026 年中推出，但尚未公布確切時間。"
  },
  {
    "question": "Cowork 會刪掉我的檔案嗎？",
    "answer": "會！請非常小心，Claude 在永久刪除任何檔案前都需要你的明確許可，會跳出權限提示讓你確認。建議先用測試資料夾試用，避免授權敏感資料夾。"
  },
  {
    "question": "Plugins 是免費的嗎？",
    "answer": "是的，官方 11 個 plugins 都是開源免費的，可以從 GitHub 下載或直接從 Cowork 介面安裝。不過使用 plugins 會消耗你的 Claude 配額。"
  },
  {
    "question": "可以自己開發 Plugins 嗎？",
    "answer": "可以！Plugins 只是 markdown 和 JSON 檔案，不需要寫程式。可以用 cowork-plugin-management plugin 協助建立，或直接 fork 官方 GitHub repo 修改。"
  }
]
{% endfaq %}

## 結語

Claude Cowork 特別適合經常處理檔案整理、文件製作的人，特別是不會寫程式的一般用戶。目前需要 Claude Pro 以上的訂閱（macOS）才能使用。

蠻推薦給常常為檔案整理頭痛的人，能省下不少時間。

目前 Cowork 還是研究預覽階段，Anthropic 計畫依使用回饋快速迭代，未來會加入跨裝置同步並推出 Windows 版本。

有訂閱 Claude Pro 方案以上的大家，
一定要來試試看 Cowork，肯定能帶給你一些 wow 的時刻

## 相關文章推薦

{% articleCard url="/claude-code-agent/" title="Claude Code Agent 實測，建立專屬的開發助理" previewText="深入了解 Claude Code Agent 如何幫助開發者建立專屬的 AI 開發助理" thumbnail="https://www.darrelltw.com/claude-code-agent/claude_code_agent-bg.jpg" %}

{% articleCard url="/claude-code-new-command-line-tool/" title="Claude Code 發佈 Command Line 的新工具" previewText="Claude Code 推出全新的命令列工具，讓開發流程更順暢" thumbnail="https://www.darrelltw.com/claude-code-new-command-line-tool/claude_code.jpg" %}

{% articleCard url="/claude_code_update_202509/" title="Claude Code 更新！ 全新 Extension for VSCode/Cursor 介面" previewText="Claude Code 重大更新，VSCode 和 Cursor 擴充功能全新改版" thumbnail="https://www.darrelltw.com/claude_code_update_202509/blog-claudecode-update-202509-bg.jpg" %}

## 參考來源

- [Introducing Cowork - Claude Blog](https://claude.com/blog/cowork-research-preview)
- [Getting Started with Cowork - Claude Help Center](https://support.claude.com/en/articles/13345190-getting-started-with-cowork)
- [Introducing Anthropic Labs](https://www.anthropic.com/news/introducing-anthropic-labs)
- [Cowork Plugins - Claude Blog](https://claude.com/blog/cowork-plugins)
- [knowledge-work-plugins - GitHub](https://github.com/anthropics/knowledge-work-plugins)
- [TechCrunch: Anthropic brings agentic plugins to Cowork](https://techcrunch.com/2026/01/30/anthropic-brings-agentic-plugins-to-cowork/)


