---
title: n8n 語音自動化實測 - ElevenLabs TTS 節點應用場景
tags:
  - n8n
  - n8n節點介紹
  - ElevenLabs
categories:
  - n8n
page_type: post
id: n8n-elevenlabs-tts
description: n8n 語音自動化實戰！ElevenLabs TTS 節點完整安裝與使用教學，包含 API 設定、聲音選擇、品質優化技巧。實測分享多種自動化場景應用。
bgImage: blog-n8n-elevenlabs-node-bg.jpg
preload:
  - blog-n8n-elevenlabs-node-bg.jpg
date: 2025-06-14 21:07:19
---

{% darrellImageCover blog-n8n-elevenlabs-node blog-n8n-elevenlabs-node-bg.jpg %}

## API Key 申請

建立帳號後，在個人資料設定那找到 **API Key** 選項

{% darrellImage800 n8n_elevenlabs-setting_find_api_key n8n_elevenlabs-setting_find_api_key.png max-800 %}

找到後就能建立 API Key 了！

{% darrellImage800 n8n_elevenlabs-create_api_key n8n_elevenlabs-create_api_key.png max-400 %}


## n8n 安裝 elevenlabs 社群節點和新增 credentials

{% darrellImage800 n8n_elevenlabs-find_elevenlabs_node n8n_elevenlabs-find_elevenlabs_node.png max-800 %}

{% darrellImage800 n8n_elevenlabs-install_elevenlabs_node n8n_elevenlabs-install_elevenlabs_node.png max-400 %}

在 n8n 的節點列表中搜尋 **elevenlabs** 就會出現 elevenlabs 的社群節點
新版 n8n 中已經可以直接從這邊搜尋和安裝 **官方認證** 的社群節點！

安裝完成就能新增 Credentials 
非常簡單，貼上 API Key 就好

{% darrellImage800 n8n_elevenlabs-create_elevenlabs_credentials n8n_elevenlabs-create_elevenlabs_credentials.png max-800 %}


## 使用 elevenlabs 節點

### Text to Speech（TTS）

文字轉語音，應該是最多人知道且常用的情境
給一段文字，並選擇一個聲音後
就會產生一個音檔

{% darrellImage800 n8n_elevenlabs-text_to_speech n8n_elevenlabs-text_to_speech.png max-800 %}

### Speech to Text（STT）

語音轉文字也是超多人在敲碗的功能

通常用在錄音檔案轉文字，並且希望能夠分離不同的演講者

{% darrellImage800 n8n_elevenlabs-speech_to_text n8n_elevenlabs-speech_to_text.png max-800 %}

這個結果是蠻慘的

1. 首先無法有選項轉為繁體中文
2. 也無法識別不同講者的聲音

這邊的音檔是使用其中一個 NotebookLM 來測試的，所以男女聲音分別很明顯
發音也算清楚，無法分離講者是真的比較可惜

### Speech to Speech（STS）

聲音轉聲音，這個功能就能用在你今天影片錄製的聲音不滿意時
可以替換成 AI 的其他聲音來呈現

### Voice 相關功能

{% darrellImage800 n8n_elevenlabs-voice_features n8n_elevenlabs-voice_features.png max-800 %}

這邊可以列出所有的聲音有哪些
目前 2025-06-15 測試時有 21 種聲音

另外也能在網站上來試聽這些聲音

{% darrellImage800 n8n_elevenlabs-voice_preview_in_website n8n_elevenlabs-voice_preview_in_website.png max-800 %}

適合不適合中文就只能測試才知道，畢竟這些聲音都還是以英文為出發點做訓練跟優化的
測試當下 API 還是只能用 V2，如果未來能用 V3 搭配新的聲音或許品質會好很多！

{% darrellImage800 n8n_elevenlabs-v3_alpha_release n8n_elevenlabs-v3_alpha_release.png max-800 %}

## Pricing 價格

{% darrellImage800 n8n_elevenlabs-pricing_table n8n_elevenlabs-pricing_table.png max-800 %}

免費版對於小用量用戶來說蠻夠用的
提一些 API 相關的費用

Text to Speech: 除了用量本身包含的 Characters 或分鐘數以外，只有 **Creator Plan** 以上才可以額外付費購買額外的 Characters 上限
Speech to Text: 也是需要 **Creator Plan** 以上才可以額外購買額度
Voice Clone: 需要 **Starter Plan** 才能付費使用！

## n8n 應用場景

### 每日摘要新聞，並提供語音播報

以前看過蠻多場景是用 API 搭配 AI 來整理摘要每日新聞
現在有了 ElevenLabs 這樣的 TTS 
就可以直接把摘要轉成語音的方式來播報！

{% darrellImage800 n8n_elevenlabs-demo-news_summary_with_voice n8n_elevenlabs-demo-news_summary_with_voice.png max-400 %}

除了可以在 Line 上，當然也可以在 Slack 或 Telegram 上使用

{% darrellImage800 n8n_elevenlabs-demo-news_summary_with_voice_slack n8n_elevenlabs-demo-news_summary_with_voice_slack.png max-400 %}

{% darrellImage800 n8n_elevenlabs-demo-news_summary_with_voice_telegram n8n_elevenlabs-demo-news_summary_with_voice_telegram.png max-400 %}

想試聽的人可以播放看看
```
【國際】,東田納西州反特朗普「No Kings」抗議活動日益擴大，全美多地計畫於近期舉行示威，表達對前總統軍事閱兵游行的反對立場。【社會經濟】,印度一名母親與其男友因涉及一歲女童致死案被判刑，女童屍體藏於衣櫃，母親判刑25年，男友囚禁近50年，彰顯兒童保護法執行力度。【社會經濟】,墨西哥契亞帕斯州皮希希阿潘發生規模4.1地震，國家地震局立即發布初步數據，提醒民眾注意安全。
```
<audio controls>
    <source src="https://pub-c093258f61a1463ea03e1a40c141968a.r2.dev/2025-06-15_news.mp3" type="audio/mpeg">
    您的瀏覽器不支援音訊播放。
</audio>

目前使用版本的 V2 對於中文還是聽起來很不自然，很像機器人在唸稿

### 其他可能場景

其實 TTS 一旦可以應用，一切都會變得非常簡單
只要在需要的地方，把文字傳入轉成語音，最後透過通訊軟體回傳
甚至將 mp3 檔案放到網路上或變成 podcast 都是有可能的
未來 V3 如果聲音夠自然的話就能往這個方向前進

之後也要來試試看 OpenAI 的 Whisper 來試試看轉文字的效果
轉文字辨識講者這需求有不少人在詢問
怎麼方便又便宜會是現在關注的重點
