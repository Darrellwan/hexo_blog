---
title: n8n Perplexity 節點教學
tags:
  - n8n
  - n8n node
categories:
  - n8n
page_type: post
id: n8n-perplexity-node
description: n8n 內建節點支援 Perplexity ！分享 API key 申請教學、Pro 用戶的免費五美金額度。如何在 n8n 使用 Perplexity 節點和不同模型之間的比較
bgImage: blog-n8n-perplexity-node-bg.jpg
preload:
  - blog-n8n-perplexity-node-bg.jpg
date: 2025-06-09 17:16:51
--- 

{% darrellImageCover blog-n8n-perplexity-node blog-n8n-perplexity-node-bg.jpg %}

## perplexity API Key 申請教學

如果你是 Perplexity 的 **Pro**用戶

每個月可以領到五美金的 API 額度

這剛好可以用在 n8n 的 perplexity 節點上

首先到 [https://www.perplexity.ai/account/api](https://www.perplexity.ai/account/api) 申請 API Key

{% darrellImage800 n8n_perplexity-apply_api_key_step_1 n8n_perplexity-apply_api_key_step_1.png max-800 %}

接著到 API 金鑰建立一組 API Key
**記得複製，稍等會用到**

{% darrellImage800 n8n_perplexity-apply_api_key_step_1 n8n_perplexity-apply_api_key_step_1.png max-800 %}


{% darrellImage800 n8n_perplexity-apply_api_key_step_2 n8n_perplexity-apply_api_key_step_2.png max-800 %}

**Perplexity Pro** 用戶確認自己的 API 餘額

{% darrellImage800 n8n_perplexity-check_remain_api_point n8n_perplexity-check_remain_api_point.png max-800 %}

{% darrellImage800 n8n_perplexity-api_remain n8n_perplexity-api_remain.png max-800 %}

## n8n perplexity credential 建立

記得剛剛複製的 API Key 嗎?

現在回到 n8n 中

1. 建立一個 Perplexity 節點
2. 在 credential 那邊選取新增一個 credential

{% darrellImage800 n8n_perplexity-set_credential n8n_perplexity-set_credential.png max-400 %}

{% darrellImage800 n8n_perplexity-set_credential_step2 n8n_perplexity-set_credential_step2.png max-400 %}

## 試用 n8n Perplexity

{% darrellImage800 n8n_perplexity-run_perplexity_node n8n_perplexity-run_perplexity_node.png max-800 %}

最後就能順利使用 Perplexity 節點了！

這邊先用 `Sonar Pro` 模型
並使用這個 prompt 做 demo
```
darrell_tw website infomation
response in zhtw
```

也可以換成自己的帳號或網站
看看 Perplexity 會怎麼總結關於你的訊息

## Perplexity model 比較

模型的比較我請 Claude 幫忙做一張精美的資訊圖
讓大家參考什麼樣的場景選擇哪個模型
如沒有特殊需求，可以先試試看 Sonar 是否就夠用

畢竟如果是 Pro 贈送的五美金額度，其實不算多
很可能撐不到一個月！

{% darrellImage800 n8n_perplexity-run_perplexity_model_compare n8n_perplexity-run_perplexity_model_compare.png max-800 %}

### 快速選擇

| 模型 | 特色 | 用途 |
|------|------|------|
| **Sonar** | 極速、低成本 | 日常問答、客服 |
| **Sonar Pro** | 多次搜尋、高準確 | 企業決策、專業分析 |
| **Sonar Reasoning** | 多步推理、快速 | 故障診斷、學習輔助 |
| **Sonar Reasoning Pro** | 深度推理、複雜情境 | 戰略規劃、系統設計 |
| **Deep Research** | 長篇報告 | 投資研究、學術論文 |
| **R1-1776** | 離線運作 | 機密處理 |

> 註 : R1-1776 的離線只是不會把你的資料放到網路上搜尋，但你的資料仍然會傳送到 Perplexity 的雲端伺服器進行處理，不建議上傳敏感資料

### 價格表

{% darrellImage800 n8n_perplexity-run_perplexity_model_pricing n8n_perplexity-run_perplexity_model_pricing.png max-800 %}





