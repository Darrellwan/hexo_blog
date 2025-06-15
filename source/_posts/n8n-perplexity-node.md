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

## 用 CURL 測試 perplexity API

```
curl --location 'https://api.perplexity.ai/chat/completions' \
--header 'Authorization: Bearer YOUR_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "model": "sonar",
    "messages": [
      {
        "role": "system",
        "content": "Be precise and concise."
      },
      {
        "role": "user",
        "content": "What are the latest news about Taiwan today? reply in zhtw"
      }
    ],
    "search_context_size": "medium",
    "max_tokens": 1500,
    "temperature": 0.7
  }'
```

如果想先用 Postman 或 CURL 測試的話，可以用上面這段 code 跑跑看
得到的 response :

```
{
    "id": "df3b49f4-81f0-4c6b-be36-b06c42b6466b",
    "model": "sonar",
    "created": 1749464425,
    "usage": {
        "prompt_tokens": 19,
        "completion_tokens": 235,
        "total_tokens": 254,
        "search_context_size": "low"
    },
    "citations": [
        "https://www.youtube.com/watch?v=jjnIm0RRLIM",
        "https://www.youtube.com/watch?v=hn8FyOkfCRQ",
        "https://www.youtube.com/watch?v=wBCwfBE-3-A",
        "https://newstaiwan.net/2025/06/09/324479/",
        "https://money.udn.com/money/story/5612/8794181"
    ],
    "search_results": [
        {
            "title": "2025/06/09 今日上午晴朗炎熱西部及宜蘭午後局部陣雨－民視新聞",
            "url": "https://www.youtube.com/watch?v=jjnIm0RRLIM",
            "date": "2025-06-09"
        },
        {
            "title": "2025-06-09【POP撞新聞】黃暐瀚專訪曾文生「2028中火 ... - YouTube",
            "url": "https://www.youtube.com/watch?v=hn8FyOkfCRQ",
            "date": "2025-06-09"
        },
        {
            "title": "'25.06.09【財經一路發】台灣金融培訓協會理事長林昌興談「非農優 ...",
            "url": "https://www.youtube.com/watch?v=wBCwfBE-3-A",
            "date": "2025-06-09"
        },
        {
            "title": "拍出反詐創意！新竹「2025反詐視界」全國徵件開跑總獎金64萬",
            "url": "https://newstaiwan.net/2025/06/09/324479/",
            "date": "2025-06-09"
        },
        {
            "title": "台灣虎航6月起3航線開復航限時促銷單程未稅500起",
            "url": "https://money.udn.com/money/story/5612/8794181",
            "date": "2025-06-09"
        }
    ],
    "object": "chat.completion",
    "choices": [
        {
            "index": 0,
            "finish_reason": "stop",
            "message": {
                "role": "assistant",
                "content": "今日台灣的最新新聞包括：\n\n1. **天氣預報**：今日台灣各地多雲到晴，午後西半部地區及東半部山區有局部短暫雷陣雨，中南部地區及北部山區可能有局部大雨[1]。\n\n2. **財經新聞**：台灣金融培訓協會理事長林昌興討論非農數據優於預期對股市的影響[3]。\n\n3. **交通新聞**：台灣虎航於6月9日起推出高雄-濟州島、台中-濟州島單程未稅新台幣500元起的限時促銷，桃園-石垣島航線則於6月11日起單程未稅1,599元起[5]。\n\n4. **公共安全**：新竹市政府於新竹市影像博物館舉辦「2025反詐視界─全國影片競賽」，徵集反詐創意影片[4]。"
            },
            "delta": {
                "role": "assistant",
                "content": ""
            }
        }
    ]
}
```

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





