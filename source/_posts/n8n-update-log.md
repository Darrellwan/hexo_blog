---
title: n8n 版本更新紀錄心得
tags:
  - n8n
  - update_log
categories:
  - Automation
page_type: post
id: n8n-update-log
description: n8n 的更新記錄，包含各版本新功能、改進和修復，和我測試的心得回饋。最新測試版本為 1.85.0，正式版本為 1.84.1
bgImage: n8n-update_bg.jpg
preload:
  - n8n-update_bg.jpg
date: 2025-02-27 12:15:12
modified: 2025-03-25 18:00:15
---

{% darrellImageCover n8n-update_bg n8n-update_bg.jpg %}

## 1.85.0 Pre-release - 2025-03-25

### 資料夾功能正式釋出!

{% darrellImage800 n8n-1.85.0-folder n8n-1.85.0-folder.png max-400 %}

終於有資料夾功能了，如果是自己部署版本，例如 zeabur
請注意你是否有去啟用 community version 才會出現資料夾的功能

沒有的還可以填入 Email 送出申請，系統會寄一封帶有啟用序號的信給你

{% darrellImage800 n8n-1.85.0-folder_need_registered n8n-1.85.0-folder_need_registered.png max-400 %}

另外對於資料夾功能的介紹有另外寫一篇文章

{% articleCard 
  url="/n8n-new-feature-folders/" 
  title="n8n 資料夾功能介紹" 
  previewText="n8n 的資料夾功能正式釋出，這邊分享如何使用資料夾功能，以及一些使用心得" 
  thumbnail="https://www.darrelltw.com/n8n-new-feature-folders/n8n_folder-bg.jpg" 
%}

### 節省多少時間?

{% darrellImage800 n8n-1.85.0-time_save_per_execution n8n-1.85.0-time_save_per_execution.png max-800 %}

有趣的功能，當你辛辛苦苦把 workflow 做完上線
並且每次大約節省你五分鐘的時候
記得填上這個節省的時間

看來是在未來的報表功能上會顯示 **你總共省下多少時間**

### Editor 顯示變數

{% darrellImage800 n8n-1.85.0-var_in_context n8n-1.85.0-var_in_context.png max-400 %}

這也很方便!
現在可以直接在 Editor 看到變數的 value 是多少，想用的時候可以直接參考
以前都要先放在 expression 中再來猜它是什麼

### 新增 xAI Grok Chat Model

{% darrellImage800 n8n-1.85.0-var_in_context n8n-1.85.0-var_in_context.png max-400 %}

終於可以好好利用馬斯克送的 API 點數了
AI 節點可以使用另一個 model 總是比較方便


### sendAndWait 節點增加 appendN8nAttribution 選項

{% darrellImage800 n8n-1.85.0-send_and_wait_append_n8n n8n-1.85.0-send_and_wait_append_n8n.png max-400 %}

在 sendAndWait 節點中，可以勾選要不要顯示 "This message was sent automatically with n8n"

有時候多這一行覺得蠻冗的


### 新增 command 可以移除 community node

從文件上來看，是指說可以用 n8n command 來移除 community node

n8n command 很強大，未來可以多做介紹

{% darrellImage800 n8n-1.85.0-delete_community_node_in_command_line n8n-1.85.0-delete_community_node_in_command_line.png max-400 %}


### Insight 測試中

```
core: Implement API to retrieve summary metrics (#13927) (b616ceb)
核心：實作 API 以檢索摘要指標（#13927）（b616ceb）
editor: Insights summary banner (#13424) (df474f3)
編輯：Insights 摘要橫幅 (#13424) (df474f3)
```

從這些更新 log 中，看來 n8n 後續就會有 insight 的功能 
可以當作是 n8n 的儀表板，檢視整體的運作狀況!


## 1.84.1 release

## 1.84.0 


### MongoDB Atlas Vector Store Node

新增了 MongoDB 向量資料庫節點

### 日誌視窗彈出功能

現在可以將日誌視窗彈出到獨立視窗中檢視，方便在處理複雜工作流程時同時監控運行情況
   {% darrellImage800 n8n-1.84.0-log_popup n8n-1.84.0-log_popup.png max-800 %}

### Merge Node 增強

在 combineBySql 操作中，如果使用 SELECT 查詢，現在有更好的 pairedItem 映射功能，讓資料合併更精準

### WhatsApp Trigger Node 更新

新增可選擇退出訊息狀態更新的選項，讓使用者有更多控制權
   {% darrellImage800 n8n-1.84.0-whatsapp n8n-1.84.0-whatsapp.png max-800 %}

[完整更新內容 github_n8n@1.84.0](https://github.com/n8n-io/n8n/releases)

## 1.83.2 

目前正式版已經更新到 1.83.2

## 1.83.1 

### Bug Fix 居多

1. Pin Data 後會出現 Unpin 的 button，原本沒有

{% darrellImage800 n8n-1.83.0-unpin n8n-1.83.0-unpin.png max-400 %}

2. Error view 現在可以完整寬度檢視
3. 貼上 `=test1234` 後會維持 `=test1234`，原本會因為判定成 expression 所以變成 test1234

{% darrellImage800 n8n-1.83.0-equals n8n-1.83.0-equals.png max-400 %}

4. 有些狀況 (沒 focus 到，Expression 全螢幕修改時) 用 ctrl+s 無法存檔，已調整優化

{% darrellImage800 n8n-1.83.0-save n8n-1.83.0-save.png max-400 %}

[github_n8n@1.83.0](https://github.com/n8n-io/n8n/releases)

## 1.82.2 

目前正式版已經更新到 1.82.2

## 1.82.0 

一些重要的新功能分享
但必須先說 **資料夾功能還沒下放**

### New Node: Azure Storage

{% darrellImage800 n8n-1.82.0-azure_storage.png n8n-1.82.0-azure_storage.png max-400 %}

### Workflow 自動對齊整理功能

現在有了自動對齊整理 canva 的功能
叫做 Tidy

這是一個在各種自動化旅程 canva 中都會有的功能
好不好用見仁見智!
一但旅程變得複雜，有時候整理過後不見得是你要的長相

{% darrellVideoSimple n8n-1.82.0-tidy n8n-1.82.0-tidy.webm max-800 %}

### Node 編輯後變色提醒

n8n-1.82.0-node_modity

{% darrellImage800 n8n-1.82.0-node_modity n8n-1.82.0-node_modity.png max-800 %}

執行過沒問題的節點會顯示綠色
但要是後面去修改該節點，他就會以黃色警告的方式呈現
讓你可以辨別哪些節點被修改過，可以觀察有沒有錯誤產生

### 自動切換 Expression 語法

{% darrellImage800 n8n-1.82.0-chnage_to_expression_automatically.png n8n-1.82.0-chnage_to_expression_automatically.png max-800 %}

之前分享過 `=` 可以切換成 Expression
但要是貼上 `{{ $now }}` 這種語法並不會自動切換
在這個版本加上了這個功能!

## 1.81.4 Release

2025/03/03 正式把最新發布版本更新為 1.81.4

除了涵蓋 1.81.0 的新功能外
更多的是一些調整修復

### Fix

- 1.81.4
core: Do not validate email when LDAP is enabled
- 1.81.3
core: Gracefully handle missing tasks metadata 
n8n Form Trigger Node: Sanitize HTML for formNode
- 1.81.2 
editor: Add workflows to the store when fetching current page 
editor: Undo keybinding changes related to window focus/blur events
Postgres Node: Accommodate null values in query parameters for expressions

## 1.81.0 

[Github 更新](https://github.com/n8n-io/n8n/releases/tag/n8n%401.81.0)

### 資料夾功能內部測試

這是本次更新最期待的項目了
由於目前的 workflows 已經非常多
性質跟分類也不同，就算有 tags 還是很雜亂

之前 n8n 官方就有提到會有 Folder 功能
沒想到蠻快就出現內測，而且如果會公布出來
就代表放出來給大家測試的時程應該也不遠

這邊先放示意圖!

{% darrellImage800 n8n_update-n8n_folder_preview n8n_update-n8n_folder_preview.png max-800 %}

### 節點快速重新命名

{% darrellVideoSimple n8n-1.81.0-rename n8n-1.81.0-rename.webm max-800 %}

如果需要命名節點，現在有個新的快捷鍵

點擊 Node 後按下空白鍵，就能直接更改節點名稱

### 節點自動連線

{% darrellVideoSimple n8n-1.81.0-autolink n8n-1.81.0-autolink.webm max-800 %}

舉個簡單的例子

A ---> B ---> C

現在把 B 刪除了
會自動連線成

A ---> C

算是大部分使用上會比較方便的版本


