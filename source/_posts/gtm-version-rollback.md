---
title: Google Tag Manager - 容器版本的回復和代碼的還原
date: 2022-10-25 20:00:00
tags:
	- Google Tag Manager
	- Measurement Skill
description: 隨著 GTM 容器的使用，創造了數十個或是上百個版本，同一個代碼的程式甚至經歷過無數次的修改，其實可以一次將整個容器回復到特定的版本，也可以只讓某一個代碼來回復
categories: 
	- Google Tag Manager
page_type: post
bgImage: container_rollback_background.webp

---
{% darrellImageCover container_rollback_background ./container_rollback_background.webp %}

## GTM 的版本

如何找到版本
{% darrellImage 版本的按鈕位置 ./container_version_location.webp %}

版本列表
{% darrellImage 版本概覽 ./container_version_overview.webp %}

這邊除了能看到整個列表外，也能個別看到每個版本的修改紀錄，
不過如果以前發佈版本的時候，沒有將註記或是名稱寫清楚的話，
通常就會變大海撈針，一個一個的打開可能才會找到你要的版本

{% darrellImage 版本變更紀錄 ./container_version_single_detail.webp %}

如果不確定現在自己網站上的 GTM 版本
有能從 Devtool 中的 Request 來查詢
圖中範例的就是版本4
{% darrellImage 從Devtool檢查GTM版本 lookup_container_version_in_console.webp %}

## Container 容器回復到某個版本

直接選擇舊的版本，點擊右方三個點後，選擇發布!
{% darrellImage 發布舊版本 choose_old_version_and_publish.webp %}
{% darrellImage 按下發布 publish_the_old_version.webp %}

可以看到 GTM 的 UI 中已經顯示上線版本是舊的版本
{% darrellImage 在UI中檢查版本 check_publish_version_in_ui.webp %}

這時建議可以再用 network 確認一次實際的版本，
原因是現在的網頁很多都有快取，很有可能就算發佈了新版本，線上的使用者要到未來才會陸續套用到更動
{% darrellImage 在Network中檢查版本 check_publish_version_in_network.webp %}
(此時要是發現一直都是之前的版本，一兩天都沒有更新，建議詢問工程師或相關人員關於網站的快取機制，以及是否有機會清除 CDN 或 Server 的快取)

## 單一或部分的 Tag 回復到舊版本

假設今天的需求是將某個 Tag 從版本４ 回復到 版本2
最直覺的做法當然會是將版本2的 Tag 開起來並複製程式碼或是記得設定
並設定到最新的版本工作區中

不過一但程式碼變得比較複雜或是不只一個 Tag，有很多的 Tag 都有類似的需求是
就可以用匯出和匯入的功能來完成

{% darrellImage Tag在V4的版本 tag_in_v4.webp %}
{% darrellImage Tag在V2的版本 tag_in_v2.webp %}

### 匯出舊版本

選擇需要的版本，右方三個點並選擇匯出
{% darrellImage 從GTM匯出舊版本 export_v2.webp %}

選取需要的設定，Tag 或 Trigger Variable
右上角匯出即可
會下載一份 JSON 檔案，請留著等等的步驟會馬上用到
{% darrellImage 選擇需要的代碼或設定 select_tag_in_v2.webp %}

### 匯入剛剛的設定

點擊上方的管理，並選擇匯入容器
{% darrellImage 開始匯入 click_import_version.webp %}

匯入剛剛那份匯出的檔案，檔名通常是 GTM-xxxxxx.json
如圖檢查匯入的設定模式，這邊選擇錯誤通常就要把整個工作區移除重來
建議這裡只要操作上沒有那麼有把握，就可以停下來詢問
{% darrellImage 檢查匯入的細項 check_import_detail.webp %}

檢查匯入的項目是否有成功
{% darrellImage 匯入成功 import_result.webp %}




