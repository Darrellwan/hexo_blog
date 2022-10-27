---
title: Tool - 利用 Google Sheet 列出 GTM 中的所有設定資訊
date: 2022-10-18 21:05:59
tags:
	- Google Tag Manager
	- Tool Share
description: 利用 Google Sheet 和 App Script 來列出 Google Tag Manager 中所有關於 GA4 的 Tags 設定，包含其中的 Parameters、Trigger、Variable 等等，再也不用一個一個打開來檢查設定
categories: 
	- Google Tag Manager
page_type: post
---

{% darrellImageCover background_image_gtm_tool_preview ./background_image_gtm_tool_preview.png %}


## 檔案連結

請從下方打開 Google Sheet，複製一個新的 Google Sheet 即可 

<a href="https://docs.google.com/spreadsheets/d/1LwCyX_Qse-1CcB2fbQ0oNz9wQk2AD6T0KAk_QNeu8mE/edit?usp=sharing" title="Google Sheet Link" class="js-link-track" data-link-name="google sheet link">
    <img src="./google_sheet_icon.webp" alt="google_sheet_icon" style="max-width: 128px" />
</a>


## 0. 準備 - 如何從 GTM 匯出 JSON 檔案

1. 選擇上方管理 -> 右方 [匯出容器]

{% darrellImage export_from_container_step1 ./export_from_container_step1.webp %}
2. 選擇最新的版本 或是 工作區的版本

{% darrellImage export_from_container_step2 ./export_from_container_step2.webp %}
3. 選擇後，點擊匯出即可

{% darrellImage export_from_container_step3 ./export_from_container_step3.webp %}
## 1. 複製一份新的 Google Sheet

{% darrellImage copy_from_sheet_1 https://i.imgur.com/0QWbPh3.png %}
{% darrellImage copy_from_sheet_2 https://i.imgur.com/0i3qXCp.png %}


## 2. 等待上方選單 GTM Tag 出現

{% darrellImage wait_for_the_menu_shows https://i.imgur.com/9LcoACf.png %}
{% darrellImage click_the_menu_-_Read_From_JSON_File https://i.imgur.com/d3oZRQs.png %}

## 3. 授予必要的權限

{% darrellImage continue_to_authorization https://i.imgur.com/NCZ25M6.png %}
{% darrellImage Choose_an_account https://i.imgur.com/FSXlAq3.png %}
{% darrellImage Choose_advanced_to_verify https://i.imgur.com/5mJFAGG.png %}
{% darrellImage Allow_the_required_permission https://i.imgur.com/qy8lBhU.png %}

## 4. 開始使用!

1. 打開選單 GTM Tag - Read from JSON File
{% darrellImage Click_the_menu_and_item https://i.imgur.com/d3oZRQs.png %}

2. 上傳一份從 GTM 匯出的 JSON 檔案
{% darrellImage Upload_the_JSON_File https://i.imgur.com/yUETlf8.png %}

3. 稍等程式運行，結果將會出現在 Google Sheet 中
{% darrellImage The_Upload_result https://i.imgur.com/7odKdAi.png %}


