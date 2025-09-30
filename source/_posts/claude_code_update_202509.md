---
title: Claude Code 更新！ 全新 Extension for VSCode/Cursor 介面
tags:
  - Claude Code
  - AI
categories: 
  - AI
page_type: post
id: claude_code_update_202509
description: description
bgImage: bg.jpg
preload:
  - bg.jpg
date: 2025-09-30 09:57:21
---

Claude Code 在 2025/09/30 發表了 Sonnet 4.5 的新模型
同時也帶來不少的新功能

## VSCode/Cursor Extension

{% darrellImage claudecode_extension_for_vscode claudecode_extension_for_vscode.png max-800 %}

新版本來到 2.0.1

這版本最特別的地方就是大改 Claude Code 的介面

{% darrellImage claudecode_before_and_after_in_extension claudecode_before_and_after_in_extension.png max-800 %}

可以看到右邊的介面變成一個全新的介面
左邊則是原本的介面

新的介面讓你像是在使用 ChatGPT 一樣就能使用 Claude Code
而不是以前的 Command Line 介面，可能會勸退不少非開發者的朋友

## 新介面介紹

{% darrellImage claudecode_new_extension_ui claudecode_new_extension_ui.png max-800 %}

介面需分為三大塊
最上方可以檢視以前的對話歷史，和新增一個 Claude Code 

中間則是會出現一些使用上的小技巧
和一個新的圖示

下方這是重要的聊天介面
- --可以點擊或是用 `shift + tab` 來切換模式 (auto accept, plan mode)
- --**/** 選擇一些內建指令，但相對 CLI 版本可以選擇的也比較少
- --可以選擇是否要讓 Claude Code 讀取現在開啟的檔案

### Command Line 清單

{% darrellImage claudecode_command_list_1 claudecode_command_list_1.png max-400 %}
{% darrellImage claudecode_command_list_2 claudecode_command_list_2.png max-400 %}

```
- Conversations
  - New conversation  // 新對話 
  - Resume conversation // 復原以前的對話  
  - Clear conversation // 清除對話

- Manage Context
  - Mention a file  // 提及專案中的檔案
  - Attach file  // 附加新檔案(例如截圖)

- Settings
  - Select model  // 選擇模型
  - MCP   // 管理 MCP
  - Login   // 登入帳號
```

## 總結心得

Claude Code 這次更新在 VSCode , Cursor 的 Extension
用全新的介面來呈現 Claude Code

我猜是想讓非技術背景的人
用更友善的介面來使用 Claude Code
包裝成像在用 ChatGPT 一樣

以前就在想：Claude Code 好用歸好用
但要教其他人怎麼用，其實不簡單
要教 cd, mv, cp 等等指令對一般人來說不好學

新版看來能解決這樣的問題
讓更多人透過新 Extension 來嘗試 Claude Code