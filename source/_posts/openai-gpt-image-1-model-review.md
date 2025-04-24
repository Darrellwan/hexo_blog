---
title: OpenAI GPT-Image-1 API 產圖 API 發布，測試心得和參數介紹
tags:
  - ChatGPT
  - OpenAI
categories:
  - AI
page_type: post
id: openai-gpt-image-1-model-review
description: 詳解OpenAI最新GPT-Image-1模型！完整介紹API參數設置、價格結構、實用範例和Postman整合技巧，一起快速上手。
bgImage: blog-chatgpt-image-1_model_bg.jpg
preload:
  - blog-chatgpt-image-1_model_bg.jpg
date: 2025-04-24 12:33:52
---

{% darrellImageCover blog-chatgpt-image-1_model_bg blog-chatgpt-image-1_model_bg.jpg max-800 %}

之前在 ChatGPT 體驗了新的產圖模型
大家真的對吉卜力的風格很瘋狂
現在這一套模型終於可以使用 API 

所以有更多的自動化流程可以納入產生圖片的功能來服務了！

## API 價格

{% darrellImage800 gpt_1_image_pricing gpt_1_image_pricing.png max-800 %}

蠻訝異的是價格沒有想像中的貴
產生圖片時可以選擇**品質跟尺寸**
就可以節省 output 的 token 數量

文字 input $5.00 / 1M tokens
圖片 input $10.00 / 1M tokens
圖片 output $40.00 / 1M tokens

## API Curl 語法

```
curl --location 'https://api.openai.com/v1/images/generations' \
--header 'Authorization: Bearer {{你的 API Token}}' \
--header 'Content-type: application/json' \
--data '{
  "model": "gpt-image-1",
  "prompt": "A childrens book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter.",
  "n": 1,
  "size": "1024x1024",
  "output_format": "jpeg",
  "output_compression": 50,
  "quality": "low",
  "moderation": "low"
}'
```

{% darrellImage800 gpt_1_image-curl_snippet gpt_1_image-curl_snippet.png max-800 %}

### Postman 顯示圖片的方法

如果你跟我一樣是使用 Postman 來測試這個 API
那有個方法可以讓你直接在 Postman 看到圖片喔

在 `Scripts` 加上這段語法

```
let jsonData = pm.response.json();
let base64 = jsonData.data[0].b64_json;

let html = `
  <html>
    <body>
      <img src="data:image/png;base64,${base64}" style="max-width: 100%;"/>
    </body>
  </html>
`;

pm.visualizer.set(html);
```

{% darrellImage800 gpt_1_image-curl_script_show_image gpt_1_image-curl_script_show_image.png max-800 %}

這樣就能直接顯示 API 產生的圖片了！

{% darrellImage800 gpt_1_image-curl_script_show_image_demo gpt_1_image-curl_script_show_image_demo.jpg max-800 %}


## API 參數

gpt-image-1 可以使用的參數有不少
而很多參數會影響產出圖片的品質和 token 數量

### prompt

文字描述欲生成的圖片，最大長度為 4000 個字元。通過提供詳細、清晰的描述來獲得最佳結果。


### output_compression

壓縮等級 (0-100%) 用於生成的圖片。此參數僅支援 `gpt-image-1` 模型搭配 `webp` 或 `jpeg` 輸出格式，預設值為 100。

### output_format

生成圖片的返回格式。此參數僅支援 `gpt-image-1` 模型，必須是 `png`、`jpeg` 或 `webp` 之一，預設為 `png`。

### quality

生成圖片的品質等級：
- `auto`（預設值）會自動為指定模型選擇最佳品質
- `gpt-image-1` 支援 `high`、`medium` 和 `low`

### size

生成圖片的尺寸，必須是以下之一：
- 一般尺寸：`1024x1024`、`1536x1024`（橫向）
- 肖像尺寸：`1024x1536`（直向）
- 或根據模型使用 `auto`（預設值）

### n

請求生成的圖片數量，介於 1-10 之間。預設為 1。增加數量會相應增加 token 消耗。

### moderation

內容審核設置，可選值為 `auto`（預設）或 `low`：
- `auto`: 標準審核強度，會過濾明顯不適當的內容
- `low`: 降低審核強度，允許更廣泛的主題，但仍會過濾違規內容

{% darrellImage800 gpt_1_image-post_parameters gpt_1_image-post_parameters.png max-800 %}

## API 應用場景

目前在 n8n + Line 的場景串上了 gpt-image-1 的產生圖片 API

需要比較特別處理的地方會是
API 只會產生 base64 的圖片資料

需要透過 n8n 先上傳到 cloudflare 的 R2 空間儲存後
再回傳給 Line Message 的 Reply API

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1078210160?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8nLineChatGPTImageDemo"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>
