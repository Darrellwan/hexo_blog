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
---


{% darrellImageCover claude-cowork-intro-bg blog-claude-cowork-intro-bg.jpg %}

{% callout type="tip" title="重點摘要" %}
**Claude Cowork = 給非工程師用的 Claude Code**
- 圖形化介面，不用學終端機指令
- 能直接讀取、編輯、建立電腦上的檔案
- Claude Pro（$20/月）以上即可使用，目前僅支援 macOS
{% endcallout %}

最近應該蠻多人看到 Claude Code 被說多好用，但自己要使用時往往只能硬著頭皮學 Command Line 介面
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

## 什麼是 Claude Cowork？

Claude Cowork 是 Anthropic 推出的桌面 AI 工具，基於 Claude Code，
Cowork 專為非開發者設計，不用寫程式就能使用。

它最大的特色是你只要授權它存取特定資料夾，它就能**讀取、編輯、建立**檔案。

{% darrellImage800Alt "Claude Cowork 主介面，左下角選擇資料夾，右下角選擇模型" cowork_main_interface.png max-800 %}

介面很直覺，左下角選擇要授權的資料夾，右下角選擇模型（建議用 Opus 4.5），然後就可以開始跟 Cowork 對話了。

{% callout type="info" %}
2025/01/17 更新：Cowork 已開放給 Claude Pro（$20/月）以上方案使用，不再限定 Max 訂閱。
目前僅支援 macOS，Windows 版本預計之後推出。
{% endcallout %}

## Claude Code vs Cowork 差在哪？

很多人會問：「這跟 Claude Code 有什麼不同？」

簡單來說，**Cowork 就是給非工程師用的 Claude Code**。技術上兩者用的是同一個底層引擎（Claude Agent SDK），差別在於：

{% dataTable style="minimal" %}
[
  {"項目": "介面", "Claude Code": "終端機（Command Line）", "Cowork": "圖形化介面"},
  {"項目": "目標用戶", "Claude Code": "工程師", "Cowork": "一般用戶"},
  {"項目": "安全機制", "Claude Code": "需自行設定", "Cowork": "內建 sandbox（沙盒隔離）"},
  {"項目": "學習門檻", "Claude Code": "需懂基本指令", "Cowork": "選資料夾就能用"}
]
{% enddataTable %}

如果你已經會用 Claude Code，Cowork 對你來說可能沒有太大吸引力。
但如果你是想讓 AI 幫忙處理檔案，又不想碰終端機的人，Cowork 就是為你設計的。

## 使用前的安全提醒

{% callout type="warning" %}
Cowork 能直接存取你的檔案，使用前請注意：

1. **不要授權敏感資料夾** - 避免給它存取財務文件、密碼檔案等
2. **指令要明確** - 模糊的指令可能導致誤刪檔案

Anthropic 有內建防護機制，但建議先用測試資料夾試用，熟悉後再處理重要檔案。
{% endcallout %}

## 實測三大應用場景

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

