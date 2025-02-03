---
title: Google App Script 在 Google Sheet 和 ChatGPT 問答
tags: 
	- Google App Script
	- ChatGPT
description: 使用 Google App Script 自定義一個 Function 函式並透過 ChatGPT 的 API，就可以實現在自己的 Google Sheet 和 ChatGPT 進行對談
categories: 
	- Google App Script
page_type: post
date: 2022-12-13 20:51:22
---

{% darrellImageCover 來自chatGpt官網 chat_gpt_bg.png max-800 %}

本文參考 [Script para integrar OpenAI en Google Sheet](https://txetxu.dev/script-para-integrar-openai-en-google-sheet/)
他用了一個表格並先組合 X 和 Y 得到問題後，請 chatGPT 回答

理解做法後也可以實作一個，但沒那麼複雜的場景
單純的提供問題後，讓 chatGPT 回答即可

當然，如果在 Google App Script 做完後
搭配之前寫到的 
[Google App Script 測試 Webhook 的串接](https://www.darrelltw.com/google-app-script-test-webhook/?source=google-app-script-with-chatgpt-openai)

就可以將該服務應用到很多地方，
目前已經完成 Slack APP 的 bot 功能實作及時的聊天問答
需要注意的是 : Google App Script 有個麻煩的限制是無法將某個 function 丟去非同步後，先回答 Slack 的 request.
Slack 在 Event 上有個限制是三秒內需要收到 response，否則他就會重送，
但通常你丟一個問題給 chatGPT 需要五秒以上的時間他才會回答你，這邊需要透過 Google App Script 的一些彎路來繞過去解決。

可以使用 Google App Script 已外的其他環境當做串接的人，建議可以避開就先避開GAS，
其他的聊天bot 或應用程式也要注意相關的回傳 response 限制。

**記得 : chatGPT 要處理蠻久的，如果聊天機器人有數秒內的回傳限制，就要記得用非同步等機制來回應**

{% darrellImage800 在Slack中和chatGPT問答 chatgpt_in_slack.png max-800 %}

---

## 申請 openAI 帳號和 API Token

[{% darrellImage800 open_ai_website open_ai_website.png max-800 %} **點擊進入網站**](https://openai.com/api/)

先申請一個帳號
{% darrellImage800 openAI帳號申請畫面 open_ai_signup_form.png max-800 %}

再到這邊來申請一個 API KEY 即可

{% darrellImage800 openAI申請API_KEY open_ai_apikey_create.png max-800 %}

## 將 ChatGPT 做成一個 Function

```javascript
const API_KEY = "申請一個 API Token"
const NUM_TOKENS = 1024; // 回傳的字數限制

// 使用在 Google Sheet 的 Function
function openAiAsk(question) {
  let resp = _callAPI(question)
  return _parse_response(resp);
}

function _callAPI(prompt) {
  var data = {
    'prompt': prompt,
    'max_tokens': NUM_TOKENS,
    "model": "text-davinci-003",
    'temperature': 0.5, // 這邊調整為 0.0-1.0 , 以文件上乍看來說是調整回答是否有彈性或是完全依照答案 
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data),
    'headers': {
      Authorization: 'Bearer ' + API_KEY,
    },
  };

  response = UrlFetchApp.fetch(
    'https://api.openai.com/v1/completions',
    options,
  );

  return JSON.parse(response.getContentText())['choices'][0]['text']
}

function _parse_response(response) {
  var parsed_fill = response.slice(2, response.indexOf('Q:'));
  return parsed_fill;
}
```

## 在 Google Sheet 中 和ChatGPT問答

上方的程式放入 Google Sheet 的 App Script 後，加上一些必要的資訊(如 API Token)等等
授權必要的權限後，就可以開始在 Google Sheet 上使用了

{% darrellImage800 在GoogleSheet中使用Function來問答 use_chartgpt_function_in_google_sheet.png max-800 %}

不過這邊建議使用一個儲存格來使用 function 就好
如果是多格儲存格在使用，重新整理或是開啟時，會造成每一個儲存格都重新使用一次 API
會造成大量的 API 浪費
如果覺得有趣需要記下來，請複製後，在其他儲存格貼上"純文字"即可

{% darrellImage800 GoogleSheet貼上值 paste_in_only_value.png max-800 %}
