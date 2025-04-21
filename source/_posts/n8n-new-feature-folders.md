---
title: n8n 新功能 - 資料夾 Folders
tags:
  - n8n
  - Webhook
  - API
  - 自動化
categories:
  - n8n
page_type: post
id: n8n-new-feature-folders
description: 終於等到了！n8n 資料夾功能開放，如何整理混亂的工作流程、建立多層資料夾結構，以及避免踩雷。
bgImage: n8n_folder-bg.jpg
preload:
  - n8n_folder-bg.jpg
date: 2025-03-22 15:01:23
---

{% darrellImageCover n8n_folder-bg n8n_folder-bg.jpg %}

萬眾期盼的 n8n 資料夾功能終於推出!
來看看如何使用資料夾整理一下已經混亂爆炸的 n8n workflows

## 建立 Folder

{% darrellImage800 n8n_folder-create_folder n8n_folder-create_folder.png max-400 %}

從 Dashboard 有兩個地方可以建立 Folder

都蠻直覺好找的

## n8n Folder Breadcrumbs

實測發現，n8n Folder 資料夾是可以多層的

例如 

`第一層資料夾` -> `第二層資料夾` -> `第三層資料夾`

上方也有 Breadcrumbs 可以挑轉

{% darrellImage800 n8n_folder-breadcrumbs n8n_folder-breadcrumbs.png max-400 %}

## 將 Workflow 移動到 Folder

{% darrellImage800 n8n_folder-move_workflow_to_folder n8n_folder-move_workflow_to_folder.png max-400 %}

可惜的是目前無法批次將 Workflow 移動到 Folder

需要 one by one 的設定

{% darrellImage800 n8n_folder-move_workflow_to_folder_step2 n8n_folder-move_workflow_to_folder_step2.png max-400 %}

先階段的測試中，也無法直接選擇 Folder

需要用輸入搜尋的方式來尋找資料夾

**這邊就有個雷要小心**

### 雷:資料夾的重複命名

由於 workflow 移動到 folder 是用搜尋 folder 名稱的方式
代表如果你有多層的資料夾，其中的 child 資料夾都用一樣的名字
你當下就會無法判斷要移動到哪裡才是對的

{% darrellImage800 n8n_folder-duplicate_folder_name n8n_folder-duplicate_folder_name.png max-400 %}

## 資料夾的資訊

{% darrellImage800 n8n_folder-information_about_folder n8n_folder-information_about_folder.png max-400 %}

## 刪除資料夾

當你要刪除的資料夾底下包涵 workflow 或是其他 folders 時
系統會跳出一個提示視窗
請你確定是要轉移到其他資料夾，或是直接刪除

{% darrellImage800 n8n_folder-confirm_to_delete_or_transfer n8n_folder-confirm_to_delete_or_transfer.png max-400 %}

## 對 n8n Folder 的期待

- 目前無法批次將 workflow 移動到 folder，還是有點麻煩
- 或是有拖曳 workflow 到 folder 的功能，會蠻方便的



















