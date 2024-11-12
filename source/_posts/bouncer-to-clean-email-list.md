---
title: bouncer_to_clean_email_list
tags:
  - Martech
categories:
  - Martech
page_type: post
id: bouncer_to_clean_email_list
description: description
bgImage: bouncer_api_introduction_bg.png
preload:
  - bouncer_api_introduction_bg.png
date: 2024-09-26 14:46:31
---
{% darrellImageCover bouncer_api_introduction_bg bouncer_api_introduction_bg.png max-800 %}

## API 

{% darrellImage800 bouncer_api_doc bouncer_api_doc.png max-800 %}

文件:[Bouncer API](https://docs.usebouncer.com/introduction)

Bouncer 的 API 串接也是非常簡單
1. 首先要先取得 API Key
{% darrellImage800 bouncer_generate_api_key bouncer_generate_api_key.png max-800 %}

2. 選擇要用哪種 API 
- Single
  - 單一 Email 驗證，這個 API 的 Rate Limit 是 1000 requests 每分鐘，所以要是想要短時間內驗證大量 Emails，就要考慮下面的 Batch 或是 Batch Sync
- Batch
  - 批次 Email 驗證，非同步，會回傳一個 batchId，可以透過 batchId 用其他 API 確認狀況和結果
- Batch Sync
  - 批次 Email 驗證並且是同步方式，會直接回傳結果 (注意: 如果 Server 的計費方式使有 CPU 啟用時間，那這隻 request 會佔用較長的 CPU 啟用時間，而產生較高的 Server 費用)

```
得到的結果

[
    {
        "email": "darrellwang@gmail.com",
        "status": "deliverable",
        "reason": "accepted_email",
        "domain": {
            "name": "gmail.com",
            "acceptAll": "no",
            "disposable": "no",
            "free": "yes"
        },
        "account": {
            "role": "no",
            "disabled": "no",
            "fullMailbox": "no"
        },
        "dns": {
            "type": "MX",
            "record": "gmail-smtp-in.l.google.com."
        },
        "provider": "google.com",
        "score": 100,
        "toxic": "no"
    },
    {
        "email": "darrellwang@gmaii.com",
        "status": "unknown",
        "reason": "unknown",
        "domain": {
            "name": "gmaii.com",
            "acceptAll": "unknown",
            "disposable": "no",
            "free": "no"
        },
        "account": {
            "role": "no",
            "disabled": "unknown",
            "fullMailbox": "unknown"
        },
        "dns": {
            "type": "MX",
            "record": "localhost."
        },
        "provider": "other",
        "didYouMean": "darrellwang@gmail.com",
        "toxic": "unknown"
    }
]

// 結果的名詞可以參考下方的解釋
```

## 串接 - Klaviyo

Bouncer 在串接 Klaviyo 非常方便!
算是我們先前在串接文章中提到的 **內建串接**
只需要將 Klaviyo 的 API Key 填入 Bouncer 即可

{% darrellImage800 klaviyo_generate_api_key klaviyo_generate_api_key.png max-800 %}

再來只要到 Bouncer 的 Integration 頁面中設定 Klaviyo 的 API Key 就好

{% darrellImage800 bouncer_set_integration bouncer_set_integration.png max-800 %}

串接完成後，就可以在 Bouncer 看到 Klaviyo 的 Email List 了!

{% darrellImage800 bouncer_choose_klaviyo_list bouncer_choose_klaviyo_list.png max-800 %}
{% darrellImage800 bouncer_choose_one_of_list bouncer_choose_one_of_list.png max-800 %}

從列出的 Email List 中選擇一個，並且執行驗證
後續等一下(可能會視 Email List 大小而有不同時間)，就可以在 Bouncer 看到驗證後的結果

{% darrellImage800 bouncer_list_result bouncer_list_result.png max-800 %}

這是個小型的測試用 List
還好結果看來非常乾淨，名單中沒有問題的 Email

## Bouncer 結果名詞解釋

想參考官方文件原文介紹的可以到這

[Terminology](https://docs.usebouncer.com/terminology)

<style>
.green-text {
  color: #008000;
}
.red-text {
  color: #FF0000;
}
.yellow-text {
  color: #FFD700;
}
.orange-text {
  color: #FFA500;
}
</style>

### Status

| Status        | 描述                                                                                   |
|---------------|----------------------------------------------------------------------------------------|
| <span class="green-text">Deliverable</span>   | 收件人的電子郵件提供商已確認該電子郵件地址存在，且發送是安全的。                                      |
| <span class="orange-text">Risky</span>         | 該電子郵件地址可能導致彈回或低互動，潛在風險類型包括 Accept All、Full Mailbox 或 Disposable。                      |
| <span class="red-text">Undeliverable</span> | 該電子郵件地址的語法不正確或不存在。                                                                 |
| <span class="yellow-text">Unknown</span>       | 我們無法從電子郵件提供商獲得回應。對於狀態為 Unknown 的電子郵件及特定列表中的重複電子郵件，將不收取 Credits。 |

---

### Reason

| Status        | Reason              | 描述                                                                                                                                                            |
|---------------|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span class="green-text">Deliverable</span>   | ACCEPTED EMAIL      | 電子郵件地址已被接受。                                                                                                                                                 |
| <span class="orange-text">Risky</span>         | LOW DELIVERABILITY  | 此電子郵件地址看似可投遞，但無法保證投遞率，通常是由於收件人服務器設置為 catch_all / accept_all 或收件箱已滿所致。                                                     |
| <span class="orange-text">Risky</span>         | LOW QUALITY         | 此電子郵件地址存在質量問題，可能成為風險或低價值地址，通常是因為它是一次性或臨時電子郵件。                                                                     |
| <span class="red-text">Undeliverable</span> | INVALID EMAIL       | 指定的電子郵件地址語法無效。                                                                                                                                               |
| <span class="red-text">Undeliverable</span> | INVALID DOMAIN      | 電子郵件的域名不存在或缺乏有效的 DNS 記錄。                                                                                                                                  |
| <span class="red-text">Undeliverable</span> | REJECTED EMAIL      | 電子郵件地址被 SMTP 服務器拒絕，表示該電子郵件地址不存在。                                                                                                                            |
| <span class="yellow-text">Unknown</span>       | DNS ERROR           | 我們無法解析 DNS 記錄或域名配置錯誤。                                                                                                                                           |
| <span class="yellow-text">Unknown</span>       | TIMEOUT             | 驗證所需的時間超過了允許的時間範圍。                                                                                                                                               |
| <span class="yellow-text">Unknown</span>       | UNSUPPORTED         | 此電子郵件由不支持的電子郵件服務提供商托管。                                                                                                                                      |
| <span class="yellow-text">Unknown</span>       | UNAVAILABLE SMTP    | SMTP 服務器無法處理我們的請求或我們無法連接到它。                                                                                                                              |
| <span class="yellow-text">Unknown</span>       | UNKNOWN             | 發生了意外錯誤。                                                                                                                                                           |

---

### Domain details

| Domain details | 描述                                                                                               |
|----------------|----------------------------------------------------------------------------------------------------|
| Accept all     | 域已設置為接受所有電子郵件，雖然服務器會回應電子郵件是有效的，但仍有可能導致彈回。                                   |
| Disposable     | 臨時電子郵件，通常有效期為 72 小時。                                                                      |
| Free           | 來自免費域的電子郵件，例如 hotmail.com 或 gmail.com。                                                   |

---

### Account details

| Account details | 描述                                                                                                         |
|-----------------|--------------------------------------------------------------------------------------------------------------|
| Role            | 基於角色的電子郵件地址，未分配給特定個人，而是分配給某個職位或一群人，例如 info@ 或 support@。                                       |
| Disabled        | 帳戶存在但已被禁用，無法接收電子郵件。                                                                        |
| Full mailbox    | 此收件人的收件箱已滿，可能會產生軟彈回。                                                                     |

---

### Other

| Other          | 描述                                                                                                                                                                                                                                                                                                                   |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Provider       | 處理此域的 SMTP 通信的基礎設施提供商名稱。可以是電子郵件服務提供商，也可以是保護底層基礎設施的反垃圾郵件過濾器提供商名稱。                                                                                                                                                                                           |
| Did You Mean | 如果您提供的電子郵件地址似乎無法投遞或質量較低，Bouncer 可能會提出正確的建議並在 didYouMean 欄位中返回。請注意，這尚未完全驗證，您可能需要對建議的電子郵件地址進行額外驗證。                                                                                                                                          |
| Toxic/Abuse    | 如果已檢查有害性，此標誌將顯示 "yes"、"no" 或 "unknown"。含義如下：<br>- yes - 電子郵件或其域在我們的列表中被發現，表示涉及垃圾郵件、濫用或欺詐。<br>- unknown - 在我們的任何列表中都未找到，雖然可能存在模糊性。                                                                |
| Toxicity       | 如果已檢查有害性，則其值範圍為 0 到 5。含義如下：<br>- 0 - 未在我們的任何電子郵件有害性列表中找到。<br>- 1-5 - 值越高，與發送到此電子郵件相關的有害性和風險越高。<br>電子郵件或其域在我們的列表中被發現，表示涉及垃圾郵件、濫用、由訴訟者或投訴者擁有，或是垃圾郵件陷阱。 |
| Score          | 分數表示電子郵件不會彈回的可能性。<br>分數 98 表示在發件人具有良好聲譽的情況下，電子郵件有 98% 的機會被成功投遞。                                                                                                                                                                                                 |