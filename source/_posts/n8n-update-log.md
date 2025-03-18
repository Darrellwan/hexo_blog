---
title: n8n 版本更新紀錄心得
tags:
  - n8n
  - update_log
categories:
  - Automation
page_type: post
id: n8n-update-log
description: n8n 的更新記錄，包含各版本新功能、改進和修復，和我測試的心得回饋。最新測試版本為 1.84.0，正式版本為 1.83.2
bgImage: n8n-update_bg.jpg
preload:
  - n8n-update_bg.jpg
date: 2025-02-27 12:15:12
modified: 2025-03-18 18:00:15
---

{% darrellImageCover n8n-update_bg n8n-update_bg.jpg %}

## 1.84.0 Pre-release


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

## 1.83.2 Release

目前正式版已經更新到 1.83.2

## 1.83.1 Pre-release

### Bug Fix 居多

1. Pin Data 後會出現 Unpin 的 button，原本沒有

{% darrellImage800 n8n-1.83.0-unpin n8n-1.83.0-unpin.png max-400 %}

2. Error view 現在可以完整寬度檢視
3. 貼上 `=test1234` 後會維持 `=test1234`，原本會因為判定成 expression 所以變成 test1234

{% darrellImage800 n8n-1.83.0-equals n8n-1.83.0-equals.png max-400 %}

4. 有些狀況 (沒 focus 到，Expression 全螢幕修改時) 用 ctrl+s 無法存檔，已調整優化

{% darrellImage800 n8n-1.83.0-save n8n-1.83.0-save.png max-400 %}

[github_n8n@1.83.0](https://github.com/n8n-io/n8n/releases)

## 1.82.2 Release

目前正式版已經更新到 1.82.2

## 1.82.0 Pre-release

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


