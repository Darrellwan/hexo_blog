---
title: n8n 小撇步 - Pin Data
tags:
  - n8n
  - n8n Tips
categories:
  - n8n
page_type: post
id: n8n-tips-pin
description: 了解 n8n 的小撇步：利用 Pin 功能鎖定輸出資料，降低 API 重複呼叫的風險，提升自動化流程測試效率並節省資源。
bgImage: n8n_pin_bg.jpg
preload:
  - n8n_pin_bg.jpg
date: 2025-02-03 14:43:32
---

{% darrellImageCover n8n_pin_bg n8n_pin_bg.jpg max-800 %}

## Pin Data 是什麼

每個節點都會有 Input & Output 的資料 (除了 Trigger 以外)

像 Request 就是會發送一次 Request 也等於是 Call 一次 API
如果 API 是有一些限制的
例如 Rate Limit (一定秒數內只能發送幾次)
或是 Usage (每天或每月最多發送幾次)
遇到限制嚴格的 API 在 n8n 測試上就會非常麻煩

這時可以把這次輸出的資料**釘選(Pin)**起來
後續的測試時就會直接輸出這份資料，不用重新 call 一次 API 或發送 Request!

{% darrellImage800 n8n_pin_demo n8n_pin_demo.png max-800 %}

## 使用 Pin 

{% darrellImage800 n8n_how_to_pin n8n_how_to_pin.png max-800 %}

Pin 的使用方式很簡單，只要在需要的節點上點擊右鍵
選擇 Pin
節點變成紫色後
就代表該節點的資料會直接輸出

## 適合的場景

### TDX 運輸 API

{% darrellImage800 n8n_tdx_api_pricing n8n_tdx_api_pricing.png max-800 %}

TDX 的 API 在免費版一個月只有給三點
每一點對於每種 API 的消耗次數不同

基礎服務是 1500次/1點
進階服務是 200次/1點

把 API 輸出的資料先 Pin 起來做後續串接的測試，
就不用浪費點數在測試上

### AI 相關節點

如果 AI 的 Prompt 節點已經調整的差不多
要做後續的串接測試

會發現每次經過 AI 的節點都會等很久
另外 AI 的 API 也根據不同的模型有不同的費用

這時也適合先暫時把 output Pin 起來
影片可以顯示出 Pin 前後的差異:


<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1052909965?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8n pin before after in openAi model"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

## 注意事項

由於使用 Pin 都是在測試資料或開發中途比較多
如果最後整個 workflow 要轉正式上線
就要記得把 Pin 過的節點都取消

不然在正式環境中以為會得到正確最新的資料
但因為 Pin 導致都拿到一樣的舊資料
在某些場景可能會造成大麻煩



