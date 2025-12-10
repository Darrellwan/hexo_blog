---
title: Claude Code 發佈 Command Line 的新工具
date: 2025-02-25 08:49:50
modified: 2025-08-09 20:50:00
tags:
  - Claude
  - AI
  - 開發工具
page_type: post
description: 介紹安裝 Claude Code和指令，以及一些簡易的操作方式，最新的價格方案，以及使用心得
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

## 202512 更新

### 2.0.64 更新 - /stats 指令

用簡單圖示呈現你近 31 天的使用狀況

1. 每天的使用量
2. 連續的使用天數
3. 使用的尖峰時刻
4. 不同模型的使用狀況

{% darrellImage800Alt "Claude Code /stats 指令" claude_code-stats_command_2.png max-400 %}


{% darrellImage800Alt "Claude Code /stats 指令" claude_code-stats_command.png max-400 %}

### Pro Plan 使用 Opus 4.5 模型
**Pro** 方案現在也能使用 Opus 4.5 模型了！

{% darrellImage800Alt "Claude Code Pro 方案現在也能使用 Opus 4.5 模型了！" claude_code-pro_can_use_opus_model.png max-800 %}

### -usage 指令

以前有提到使用第三方的 ccusage 來監控使用量
現在 Claude Code 內建 -usage 指令
直接查看當前的使用量剩餘多少

{% darrellImage800Alt "Claude Code -usage 指令" claude_code-pro_can_use_opus_model_alt.png max-800 %}


## Claude Code 價格 - 202508 更新

目前價格除了以前要用 API 儲值以外，也包含在 訂閱 Claude 的 Pro 以上方案中

分別有三種訂閱方式：

### Claude Pro
每月 20 美金
用量為大約 每 5 小時約可送 10–40 次指令，僅支援 Sonnet 4。

### Claude Max 100
每月 100 美金
用量為大約 每 5 小時約可送 50–200 次指令，可用 Opus 4 / Sonnet 4

### Claude Max 200
每月 200 美金
用量為大約 每 5 小時約可送 200–800 次指令，可用 Opus 4 / Sonnet 4。

### 比較表格
| 方案 | 月費 | 用量（每 5 小時） | 可用模型 |
|---|---|---|---|
| Claude Pro | 每月 20 美金 | 10–40 次指令 | Sonnet 4 |
| Claude Max 100 | 每月 100 美金 | 50–200 次指令 | Opus 4 / Sonnet 4 |
| Claude Max 200 | 每月 200 美金 | 200–800 次指令 | Opus 4 / Sonnet 4 |

### 價格心得
其實仔細觀察可以發現 20 美金和 100 美金的用量是剛好 5 倍
但 200 美金的用量是 5 美金的 40 倍。

所以 20 美金要再往上升級的話，200 美金是比較划算的選擇(價格比 100 美金多 2 倍，但用量是 4 倍！)

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

### plan mode & auto accept

在對話框可以切換 plan mode 模式或是 auto accpet 模式
mac os : **shift + tab**
windows: **alt + m**

{% darrellImage800 claude_code-change_mode_in_windows_macos claude_code-change_mode_in_windows_macos.png max-400 %}

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

## 更新 20250312 : 應用範例

### Youtube
這是一位創作者 巴斯 的 Youtube 影片 : 如何用 Claude Code提升開發效率並簡化 Git 工作流
<div style="max-width: 800px; margin: 0 auto;">
  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/Zf5_Igx2wV8?si=vpZFL57RCftOqqY8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </div>
</div>

### Threads: Claude Code 整理 Download 資料夾的使用範例
<blockquote class="text-post-media" data-text-post-permalink="https://www.threads.net/@darrell_tw_/post/DG5ETJ7xAe7" data-text-post-version="0" id="ig-tp-DG5ETJ7xAe7" style=" background:#FFF; border-width: 1px; border-style: solid; border-color: #00000026; border-radius: 16px; max-width:540px; margin: 1px; min-width:270px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"> <a href="https://www.threads.net/@darrell_tw_/post/DG5ETJ7xAe7" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%; font-family: -apple-system, BlinkMacSystemFont, sans-serif;" target="_blank"> <div style=" padding: 40px; display: flex; flex-direction: column; align-items: center;"><div style=" display:block; height:32px; width:32px; padding-bottom:20px;"> <svg aria-label="Threads" height="32px" role="img" viewBox="0 0 192 192" width="32px" xmlns="http://www.w3.org/2000/svg"> <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" /></svg></div><div style=" font-size: 15px; line-height: 21px; color: #000000; font-weight: 600; "> 在 Threads 查看</div></div></a></blockquote>
<script async src="https://www.threads.net/embed.js"></script>

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

## ccusage 監控 claude code 使用量

如果你已經成為 Claude Code 的愛好者
並且為此升級到 Pro 方案

這邊有一個超棒的工具可以讓你隨時監控目前 Claude Code 的使用量

打開 command line tool 輸入

```
npm install -g ccusage
```

就安裝好了！

使用方法也超級簡單

```
# 查看每日使用量
ccusage 

# 查看每月使用量
ccusage --monthly

# 查看各自的 session 使用量
ccusage --session
```

{% darrellImage800 claude_code-daily claude_code-daily.png max-800 %}

### Raycast 用戶推薦 ccusage extension

1. 首先到 Raycast 的 Store 搜尋 ccusage 並且安裝

{% darrellImage800 claude_code-raycast_install_ccusage-step1 claude_code-raycast_install_ccusage-step1.png max-800 %}

{% darrellImage800 claude_code-raycast_install_ccusage-step2 claude_code-raycast_install_ccusage-step2.png max-800 %}

{% darrellImage800 claude_code-raycast_install_ccusage-step3 claude_code-raycast_install_ccusage-step3.png max-800 %}

2. 安裝完成除了可以直接在 raycast 使用 ccusage 來看使用量
還可以啟用 menu bar 讓你更方便檢查

{% darrellImage800 claude_code-raycast_enable_ccusage_menubar claude_code-raycast_enable_ccusage_menubar.png max-800 %}

{% darrellImage800 claude_code-raycast_ccusage_menubar claude_code-raycast_ccusage_menubar.png max-800 %}

這樣未來想要檢查，滑鼠往上稍微移動一下就能看到使用狀況
非常方便

## 結論

喜歡用 Command Line 的工程師都蠻值得一試的

## 參考資料

- [Claude Code Github](https://github.com/anthropics/claude-code)
- [Claude Code 官方文件](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)

