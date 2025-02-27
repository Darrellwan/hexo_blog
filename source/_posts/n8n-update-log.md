---
title: n8n 版本更新紀錄心得
tags:
  - n8n
  - update_log
categories:
  - Automation
page_type: post
id: n8n-update-log
description: n8n 的更新記錄，包含各版本新功能、改進和修復，和我測試的心得回饋。最新測試版本為 1.81.0，正式版本為 1.80.3
bgImage: n8n-update_bg.jpg
preload:
  - n8n-update_bg.jpg
date: 2025-02-27 12:15:12
---

{% darrellImageCover n8n-update_bg n8n-update_bg.jpg %}

## 1.81.0 Pre-release

<a href="https://github.com/n8n-io/n8n/releases/tag/n8n%401.81.0" style="color:rgb(116, 180, 249);"><i class="fa-solid fa-link"></i><span> Github 更新 </span></a>

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


