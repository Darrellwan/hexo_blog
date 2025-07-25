---
title: Claude Code Agent 實測，建立專屬的開發助理
date: 2025-07-25 13:18:17
modified: 2025-07-25 16:29:17
tags:
  - Claude Code
  - Claude Code Agent
  - AI
  - 開發工具
page_type: post
description: Claude Code 新推出的 Agent 功能讓你可以建立專屬的開發 Agent，透過自然語言指令自動處理重複性的程式設計任務。不再需要每次重新解釋需求，讓 Claude Code Agent 記住你的開發模式。
categories: 
  - 工具
bgImage: claude_code_agent-bg.jpg
preload:
  - claude_code_agent-bg.jpg
---

{% darrellImageCover claude_code_agent_bg claude_code_agent-bg.jpg max-800 %}

## Claude Code Agent 是什麼？

Claude Code 在近期發布了一個新功能 **/agent**
讓你可以自定義開發上的 AI 助理

差別是什麼呢？

假設我們使用 Claude Code 時都有一些預設的場景跟需求
例如我的是請 Claude Code 建立 `n8n workflow` 
那我不可能每次都寫一大堆提示詞教他怎麼建立

之前我們會使用 `/command` 來把一些預設操作寫成一個指令
我就用了 `/n8n-create-workflow` 來讓他知道說當我使用這個指令
就是要來建立 n8n 的模板，他會依照 command 裡面的提示詞知道整個流程是什麼

跟 n8n 相關的不會只有這個 `command`，我就建立了三四個
而 Agent 就能用來一次把所有 n8n 相關的開發集中於一身
未來只要派他出場就能處理 n8n 的大小開發

## 建立 Agent 

### Step 1: 進入 Agent 管理介面
輸入 `/agents`
{% darrellImage800 claude_code_agent-create_step_1 claude_code_agent-create_step_1.png max-400 %}

### Step 2: 選擇 Create Agent
{% darrellImage800 claude_code_agent-create_step_2 claude_code_agent-create_step_2.png max-400 %}

### Step 3: 選擇 Agent 範圍
Project - 會是只有這個專案的層級能使用
Personal - 會是全域都能使用
{% darrellImage800 claude_code_agent-create_step_3 claude_code_agent-create_step_3.png max-400 %}

### Step 4: 選擇建立方式
建議用 `Generate with Claude`
{% darrellImage800 claude_code_agent-create_step_4 claude_code_agent-create_step_4.png max-400 %}

### Step 5: 定義 Agent 專業領域

這是最關鍵的步驟！你需要清楚描述這個 Agent 的職責和觸發條件。

{% darrellImage800 claude_code_agent-create_step_5 claude_code_agent-create_step_5.png max-400 %}

Claude 會根據你的描述自動產生 Agent 配置檔案，儲存在：
- project：`.claude/agents/<name>.md`  
- personal：`~/.claude/agents/<name>.md`

## 調整 Agent

現在要 edit agent 比較麻煩，我這邊測試是只會打開編輯器要我自己修改
其實還是可以請 `claude code` 幫忙，直接指出這個 agent 的 md 位置就好！

像是剛剛建立的 agent 就會在 `~/.claude/agents/n8n-workflow-builder.md`

{% darrellImage800 claude_code_agent-agent_md_location claude_code_agent-agent_md_location.png max-400 %}

## 實際測試分享

### 案例一：n8n workflow builder
先前分享過用 Claude Desktop 搭配 n8n mcp 來做到 vibe n8n
用指令來直接建立 n8n 模板並自動上傳

```md
主要功能：
  - n8n 自動化工作流程設計與建構專家
  - 將商業需求轉換為實際的 n8n 實作方案

  核心能力：
  1. 工作流程設計 - 分析需求並設計最佳 n8n 架構
  2. 技術實作 - 提供具體節點配置和連接結構
  3. 創意發想 - 根據行業或使用案例生成自動化想法
  4. 最佳化建議 - 遵循 n8n 最佳實踐，考慮效能和維護性
  5. 品質保證 - 驗證工作流程邏輯和錯誤處理

  工作流程創建優先順序：
  1. 優先：MCP 上傳 - 直接上傳到 n8n 實例
  2. 輔助：建立 JSON - 可創建暫時檔案供參考
  3. 避免：自動收錄 - 不會自動加入模板庫，除非用戶明確要求

  關鍵技術要點：
  - 使用節點名稱（非 ID）建立連接
  - 正確的連接格式和資料流設計
  - 包含錯誤處理和邊緣案例考量
  - 研究現有模板以確保結構正確性
```

#### 成果

這次出了比較困難的題目給他
請他根據我目前現有的 workflow 去思考靈感
自己創造出一個新的 workflow

{% darrellImage800 claude_code_agent-vibe_n8n_demo claude_code_agent-vibe_n8n_demo.png max-800 %}

{% darrellImage800 claude_code_agent-vibe_n8n_demo_result claude_code_agent-vibe_n8n_demo_result.png max-800 %}

成果意外的好，至少 workflow 的架構正確
裡面使用的 API 就要非常小心驗證，畢竟這不在原本的模板裡面
可能就很容易出現幻覺

## 結語

你也是 **Claude Code** 的重度使用者嗎？
會想用 Agent 來完成哪些事情？

