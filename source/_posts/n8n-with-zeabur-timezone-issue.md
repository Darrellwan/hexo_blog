---
title: n8n 小撇步 - Timezone 問題如何在 Zeabur 設定
tags:
  - n8n
  - n8n Tips
categories:
  - Automation
page_type: post
id: n8n-with-zeabur-timezone-issue
description: 記錄一下在 Zeabur 上處理 n8n 時區問題的方法，從單一 workflow 到一次性解決，讓你的自動化流程不再跑錯時間！
bgImage: n8n-with-zeabur-timezone-issue.jpg
preload:
  - n8n-with-zeabur-timezone-issue.jpg
date: 2025-02-06 12:59:34
---

{% darrellImageCover n8n-with-zeabur-timezone-issue n8n-with-zeabur-timezone-issue.jpg max-800 %}

## Schedule Trigger 跑的時間不對 - 時區問題

{% darrellImage800 n8n-default-timezone.jpg n8n-default-timezone.jpg max-800 %}

在我們好不容易規劃好整個 workflow 後
終於要設定每天固定的時間執行
隔天或下一次預期要跑的時間過後才發現，怎麼沒有跑?!
或是我設定在早上，怎麼在凌晨就跑了

工程師的直覺應該就是時區

我們在 Schedule Trigger 做一次 Test Run 的時候他會顯示 n8n 目前的時間是什麼時候

{% darrellImage800 n8n_schedule_trigger_current_time n8n_schedule_trigger_current_time.png max-800 %}

## 調整 n8n workflow 時區

那這時就代表應該有地方可以調整時區
我們可以找到 workflow 右上角的設定

{% darrellImage800 n8n_workflow_setting_timezone n8n_workflow_setting_timezone.jpg max-800 %}

這邊就可以將時區調整回 Asis/Taipei 

{% darrellImage800 n8n_workflow_setting_timezone_to_taipei n8n_workflow_setting_timezone_to_taipei.png max-800 %}

設定好後再回到 Schedule Trigger 重跑一次
就會發現時間正確

{% darrellImage800 n8n_schedule_trigger_current_time_fixed n8n_schedule_trigger_current_time_fixed.png max-800 %}

## 在 Zeabur 一勞永逸的調整方式

我們上方的設定其實只針對單一個 workflow 調整
之後新開的 workflow 還是預設在紐約時間

可是 n8n 又沒有其他選項可以調整時區了
這問題困擾了一陣子

後來終於找到方法，要回到 Zeabur 調整變數的設定

### Step1: 備份 n8n

由於我們是要調整 Server 相關的變數設定
最好都要先備份一次

{% darrellImage800 n8n_suspened_and_backup n8n_suspened_and_backup.png max-800 %}

備份要跑一下，跑完後會出現成功的提示

{% darrellImage800 n8n_backup_success n8n_backup_success.png max-800 %}

### Step2: 調整變數設定

再來我們就可以開始調整變數了
只有一項需要調整!

Key:
`GENERIC_TIMEZONE`
Value:
`Asia/Taipei`

{% darrellImage800 n8n_add_generic_timezone_in_zeabur n8n_add_generic_timezone_in_zeabur.jpg max-800 %}

請注意貼的 Key & Value 不要貼錯，可能會造成無法預期的問題
貼上存檔後，Restart n8n service 並等它一下

### 成果測試

直接到 workflow 新開一個，並直接測試新的 Schedule Trigger 是否會顯示台北時區
就不用每次按照上面原本的 workflow 重新設定

{% darrellImage800 n8n_test_timezone_in_new_workflow n8n_test_timezone_in_new_workflow.png max-800 %}

## 常見問題

### Q1: 設定後排程依然不對？
請檢查：  
✅ 環境變數名稱是否正確
✅ 時區代碼是否正確  
✅ 是否已重新部署服務

還有遇到什麼其他 n8n 的問題嗎?
歡迎到下方連結找我討論








