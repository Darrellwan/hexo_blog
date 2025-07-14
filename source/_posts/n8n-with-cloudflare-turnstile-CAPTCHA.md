---
title: n8n 串接 Cloudflare Turnstile CAPTCHA 驗證
tags:
  - n8n
categories:
  - n8n
page_type: post
id: n8n-with-cloudflare-turnstile-CAPTCHA
description: 防止 vibe coding 表單被機器人攻擊？使用 Cloudflare Turnstile + n8n 打造表單驗證系統。包含前端 HTML、後端 API 驗證、webhook 設定，完整驗證流程實作教學。
bgImage: blog-n8n-cloudflare_turnstile.jpg
preload:
  - blog-n8n-cloudflare_turnstile.jpg
date: 2025-07-14 14:37:18
---

{% darrellImageCover blog-n8n-cloudflare_turnstile blog-n8n-cloudflare_turnstile.jpg %}

## 背景

雖然 n8n 有 form 節點當作表單來接收資料
但由於他的樣式客製化程度較低
只能簡單調整一些顏色

那把 vibe coding 出一個簡單又漂亮的表單就是個不錯的選擇

{% darrellImage800 n8n_form-vs-vibecoding-form n8n_form-vs-vibecoding-form.png max-800 %}

這時就能利用 vibe coding 的表單 `POST` 到 n8n 的 `webhook` 節點來接收表單資料
後續就可以傳送信件並且將名單存到你需要的地方(Google Sheet、Airtable、CRM 系統等等)

{% darrellImage800 n8n_webhook_received_from_form n8n_webhook_received_from_form.png max-800 %}

只是做了表單放到網路上後
過沒多久就發現，奇怪，這網址明明還沒有公布給別人
為什麼開始一堆人已經填表單送資料
而且都是一些沒看過的 emails ?!

## Cloudflare Turnstile 驗證

這時候就會需要一個驗證機制來防止機器人或惡意填寫
Cloudflare Turnstile 就能用來解決這個問題

或許你對 Cloudflare Turnstile 這個名詞不熟悉
但對這個圖案會覺得很眼熟

{% darrellImage800 google_recaptcha-vs-cloudflare_turnstile google_recaptcha-vs-cloudflare_turnstile.jpg max-400 %}

其實他的功能就跟 Google reCAPTCHA 一樣
做一個簡易的機器人驗證，如果不是真人
你是用爬蟲或是用 `n8n Request`, `cURL` 等等來操作，就會被擋下來

### 原理說明

{% darrellImage800 cloudflare_turnstile_principle cloudflare_turnstile_principle.png max-800 %}

用「蝦皮店到店取貨」來比喻 Cloudflare Turnstile 的驗證流程

四步驟流程

1️⃣ 訂單生成取貨碼
比喻： 網購訂單到店後，系統自動生成取貨碼「AB1234」簡訊通知
技術： Widget 產生 Token
說明： 前端 Widget 向 Cloudflare 請求驗證 token，綁定特定網域

2️⃣ 到店輸入取貨碼
比喻： 到蝦皮取貨機上輸入取貨碼「AB1234」準備驗證身分
技術： 表單提交 + Token
說明： 用戶填寫表單時，token 會自動附加在表單資料中一起送出

3️⃣ 蝦皮取貨機系統驗證
比喻： 取貨機連線蝦皮後台確認「代碼有效、未取過」顯示訂單資訊
技術： Siteverify API
說明： 後端接收表單後，必須用 secret 向 Cloudflare API 驗證 token 真偽

4️⃣ 取貨成功
比喻： 取貨機打開指定櫃門，取出包裹，代碼失效無法重複使用
技術： 處理表單資料
說明： 驗證通過後處理表單，token 同時失效防止重複攻擊

### 申請 cloudflare turnstile

1. 登入你的 cloudflare 帳號後
左邊有個 Turnstile 

{% darrellImage800 cloudflare_overview_turnstile cloudflare_overview_turnstile.png max-800 %}

2. 再來新增小工具

{% darrellImage800 cloudflare_turnstile_create_first_tool cloudflare_turnstile_create_first_tool.png max-800 %}

3. 新增完工具之後就要來輸入網域了
我這邊示範的網址是

`https://demo-cloudflare-turnstile.pages.dev/`

那網域這邊就要填寫

`demo-cloudflare-turnstile.pages.dev`

簡單來說：前面的 `https://` 不要，最後的 `/` 或是 `?` 等等都不要了

{% darrellImage800 cloudflare_turnstile_create_first_tool_step2 cloudflare_turnstile_create_first_tool_step2.png max-800 %}

4. 最後點擊建立，小工具新增完成！

{% darrellImage800 cloudflare_turnstile_create_first_tool_step3 cloudflare_turnstile_create_first_tool_step3.png max-800 %}

### Turnstile 網站金鑰跟秘密金鑰

建立完小工具後就能取得 **網站金鑰** & **秘密金鑰** 了

這兩個雖然都叫做金鑰，但是保密程度大不同

`網站金鑰` 是讓你放在網站上的
所以其實每個使用者都能看到，這沒關係

`秘密金鑰` 是讓你放在所謂的後端做驗證
這邊我們用 n8n 當作後端
所以會放在 n8n 的處理 workflow 中

{% darrellImage800 cloudflare_turnstile-find_secrets cloudflare_turnstile-find_secrets.png max-800 %}

## 前端表單實作

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Form with Cloudflare Turnstile</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Test Signup</h1>
            
            <form id="emailForm" class="email-form">
                <div class="form-group" data-step-target="1">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email address" required>
                    <div class="step-indicator">
                        <div class="pulse-dot"></div>
                        <span class="indicator-text">開始這裡！Start here!</span>
                    </div>
                </div>
                
                <div class="form-group turnstile-section" data-step-target="2">
                    <div class="turnstile-wrapper">
                      <!-- 這邊要換成你的網站金鑰 -->
                        <div class="cf-turnstile" 
                             data-sitekey="{{你的網站金鑰}}" 
                             data-callback="onTurnstileSuccess"
                             data-theme="dark"
                             data-size="normal"
                             data-language="zh-TW"></div>
                    </div>
                    <div class="step-indicator" style="display: none;">
                        <div class="pulse-dot"></div>
                        <span class="indicator-text">等待驗證完成 Wait for verification</span>
                    </div>
                </div>
                
                <div class="form-group" data-step-target="3">
                    <button type="submit" id="submitBtn" class="send-btn" disabled>
                        <span class="btn-text">Subscribe</span>
                        <div class="spinner" id="spinner"></div>
                    </button>
                </div>
            </form>
            
            <div id="message" class="message"></div>
        </div>
    </div>
    
    <script>
        let turnstileToken = null;

        function onTurnstileSuccess(token) {
            turnstileToken = token;
            document.getElementById('submitBtn').disabled = false;
        }

        document.getElementById('emailForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            
            if (!email || !turnstileToken) {
                alert('Please enter email and complete verification');
                return;
            }
            
            try {
                // 這邊的 url 要改成你自己的 n8n webhook url
                const response = await fetch('{{n8n webhook url}}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        'cf-turnstile-response': turnstileToken
                    })
                });
                
                if (response.ok) {
                    alert('Success! Email submitted.');
                    this.reset();
                    turnstileToken = null;
                    document.getElementById('submitBtn').disabled = true;
                    if (window.turnstile) {
                        window.turnstile.reset();
                    }
                } else {
                    alert('Error: Submission failed.');
                }
            } catch (error) {
                alert('Network error. Please try again.');
            }
        });
    </script>
    <script src="script.js"></script>
</body>
</html>
```

這邊用簡單的 html 來示範
需要替換的地方
- `{{你的網站金鑰}}`
- `{{n8n webhook url}}`

## 後端 n8n 實作

上面有填寫 n8n webhook url 的話
代表已經有在 n8n 新增一個 workflow
並且設定好一個 `webhook` 節點了！

這邊建議直接把 workflow **activate** 然後使用 `production URL` 來做
後續就不用重新修改 url 然後再上版一次

### webhook 資料解析

{% darrellImage800 n8n_webhook_cloudflare_turnstile_payload n8n_webhook_cloudflare_turnstile_payload.png max-800 %}

可以從截圖中看到
除了原本表單欄位中的 `email` 之外
還多了一個 `cf-turnstile-response` 的欄位

這就是 Cloudflare Turnstile 的驗證 token
那為什麼還需要後端用 `秘密金鑰` 來驗證一次呢？

因為我們也無法看出這是不是真的 Cloudflare Turnstile 產生的
假設今天有人用程式化的方式在自動提交你的表單
他也只需要產生一段假的 `cf-turnstile-response` 就好

這時我們就需要做第二次驗證
把我們拿到的 `cf-turnstile-response` 跟 `秘密金鑰` **一起傳到 Cloudflare 的 API 做驗證**

### Request 呼叫 Cloudflare API 驗證

{% darrellImage800 n8n_request_send_cloudflare_to_challenge n8n_request_send_cloudflare_to_challenge.png max-800 %}

這邊要做的事情就比較簡單
可以直接用下面這個 node json 複製到你們的 n8n 中貼上
然後修改
1. cloudflare 的 `secret` 要換成你自己的 `秘密金鑰`
2. 把 `response` 換成 `cf-turnstile-response`，欄位可能不同，建議重新拖曳一次

```JSON
{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        "sendBody": true,
        "contentType": "form-urlencoded",
        "bodyParameters": {
          "parameters": [
            {
              "name": "secret"
            },
            {
              "name": "response",
              "value": "={{ $json.body['cf-turnstile-response'] }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -760,
        40
      ],
      "id": "7e1f3458-b775-4b76-91b2-020562f81178",
      "name": "HTTP Request-cf-challenge1"
    }
  ],
  "connections": {},
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "fddb3e91967f1012c95dd02bf5ad21f279fc44715f47a7a96a33433621caa253"
  }
}
```

### 成功驗證結果

如果驗證成功，將會看到回傳的 `JSON` 中有一個 `"success" : true`
就代表 Cloudflare Turnstile 確認剛剛這個前端傳回來的 token 是沒問題的
也表示不是什麼人為或造假的 token


{% darrellImage800 n8n_request_send_cloudflare_to_challenge_success n8n_request_send_cloudflare_to_challenge_success.png max-800 %}


## 加上 Cloudflare Turnstile 的 n8n workflow

{% darrellImage800 n8n_verified_by_cloudflare_turnstile_full_workflow n8n_verified_by_cloudflare_turnstile_full_workflow.png max-800 %}

其實相比原本的也非常簡單
只是加上兩個節點
一個做驗證
另一個做 `IF` 的判斷是否驗證成功
後續就可以一樣接上自己的自動化流程了！








