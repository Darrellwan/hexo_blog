---
title: Claude Code 發佈 Command Line 的新工具
date: 2025-02-25 08:49:50
tags:
  - Claude
  - AI
  - 開發工具
page_type: post
description: 快速嘗試 Claude Code，介紹安裝和指令，以及一些簡易的操作方式，也分享測試時的花費
categories: 
  - 工具
bgImage: claude_code.jpg
preload:
  - claude_code.jpg
---

{% darrellImageCover claude_code_bg claude_code.jpg max-800 %}

## Claude Code

[Claude Code](https://github.com/anthropics/claude-code) 是 Anthropic 公司最近推出的 CLI 工具，讓開發者可以在終端機中直接與 Claude AI 模型互動。
讓我們用一種全新的 Command Line 方式來跟 Claude 和專案的程式碼互動

## 主要功能

1. 程式碼協助 - 快速產生、優化或重構程式碼
2. 錯誤診斷 - 幫助找出並修正程式中的錯誤
3. 文件生成 - 自動為函數和類別生成文件
4. 專案理解 - 分析程式專案結構並提供修改建議

## 安裝方式

```bash
# 使用 npm 安裝
npm install -g @anthropic-ai/claude-code

# 安裝完成後
claude
```

安裝完成後會有一系列的初始設定
要在網頁版登入 Anthropic 的帳號
並且**需要 API Key 和 綁定信用卡**

使用的過程中會根據上下文的方式產生 API 費用

{% darrellImage800 claude_code_cost claude_code_cost.png max-800 %}

最後到你需要啟用 Claude Code 的專案資料夾
一開始他會先掃描一次專案，產生一份文件

{% darrellImage800 claude_code_init claude_code_init.png max-800 %}


### Claude.md 檔案

`Claude.md` 像是一個專案的簡介
我不確定是給專案成員閱讀的
還是讓 Claude Code 用來快速理解專案的一個方式

很酷的是，專案更新後，可以重新跑一次 `claude init` 來更新專案的文件!

{% darrellImage800 claude_code_md claude_code_md.png max-800 %}

## 操作介紹

### 指令列表

Claude Code 提供了不少指令：

```bash
# 對話管理
/clear    # 清除所有對話歷史，完全釋放上下文空間
/compact  # 壓縮對話歷史但保留重要內容摘要，適合長對話

# 輔助功能
/help     # 顯示所有可用指令和幫助
/cost     # 顯示當前會話的總費用和時間
/doctor   # 檢查 Claude Code 安裝狀態是否健康

# 版本控制整合
/pr-comments  # 取得 GitHub PR 的評論
/review       # 審查 PR 並提供意見

# 配置與設定
/config          # 開啟設定面板
/terminal-setup  # 安裝 Shift+Enter 快捷鍵綁定（僅支援 iTerm2 和 VSCode）
/init            # 初始化新的 CLAUDE.md 文件，記錄程式庫文件

# 帳號管理
/login   # 切換 Anthropic 帳號
/logout  # 登出目前的 Anthropic 帳號

# 反饋
/bug      # 提交關於 Claude Code 的意見反饋
```


### 串連工作流程

Claude Code 可以跟其他命令一起用，讓工作更輕鬆：

```bash
# 讓 Claude 幫你寫 git 提交訊息
git diff | claude "幫我寫一個簡短的 commit 訊息"

# 翻譯錯誤訊息並提供解決方案
npm run build 2>&1 | claude "解釋這個錯誤並提供解決方法"

# 把日誌轉成簡單報告
cat access.log | claude "幫我統計這個網站日誌，找出最常被訪問的頁面和錯誤"
```

範例
```bash
# 快速理解專案文件
cat README.md | claude "告訴我你看到什麼，這個專案的主要功能和如何設置"
```
{% darrellImage800 claude_code_with_git_command claude_code_with_git_command.png max-800 %}


## 使用心得與限制

Claude Code 強大的地方在於他是指令模式
像 Cursor 雖然是 UI 方便
但在上面介紹到
你可以在一個指令的 output 後直接丟給 claude code 來處理
甚至直接分析 access.log 的內容

限制上應該還是在大型的專案
如果有過多的上下文需要學習
會有處理時間跟 API Cost 的問題

### 短暫測試的花費

為了測試儲值五美金
一兩個小時的測試後發現快用了一半! 
有比想樣中的快，但用 command line 就是有種順的感覺

{% darrellImage800 claude_code_cost_remaining claude_code_cost_remaining.png max-400 %}

## 結論

喜歡用 Command Line 的工程師都蠻值得一試的
先儲值一點即可 (最低 5 美金起跳)

## 參考資料

- [Claude Code Github](https://github.com/anthropics/claude-code)
- [Claude Code 官方文件](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)

