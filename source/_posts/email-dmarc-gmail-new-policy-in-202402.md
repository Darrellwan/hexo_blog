---
title: Gmail Yahoo 2024/02新政策 全面驗證 DMARC 認證
tags:
  - Email Marketing
  - Email DNS
categories:
  - Marketing
page_type: post
id: email-dmarc-gmail-new-policy-in-202402
date: 2024-01-31 21:44:37
description: Gmail 和 Yahoo 等電子郵件服務供應商將在 2024/02 套用一項新政策，將會對所有在發行銷郵件的網域驗證是否有正確的 DMARC 政策，如何檢查自己的網域是否已經有設定 DMARC 和參考其他相關規定。此對象包含使用第三方電子郵件服務如 MailChimp 等網域或是自行架設電子郵件 Server和仰賴 Amazon SES 等所有用戶
---

{% darrellImageCover email-dmarc-gmail-new-policy-in-202402_bg email-dmarc-gmail-new-policy-in-202402_bg.png max-800 %}

## 檢查自己的發信網域是否有 DMARC 認證

如果平時在意自己的發信狀況的人應該都會收到自己發出的信件，
Gmail 中檢查 DMARC 的方式也相對簡單，只是平常不會知道怎麼使用

只要點開自己的信件，並在右上角(限定電腦網頁版，手機版 APP 無此功能)**顯示原始郵件**


{% darrellImage800 show_original_email_header_in_gmail show_original_email_header_in_gmail.png max-800 %}

{% darrellImage800 check_dmarc_record_in_original_email_gmail check_dmarc_record_in_original_email_gmail.png max-800 %}

如果有出現 DMARC 'PASS' 即代表這封信有通過 DMARC 驗證

其他的方法也可以靠很多網路上第三方的免費工具幫忙查詢
以 Google 關鍵字 `Dmarc lookup` 的搜尋結果

{% darrellImage800 google_search_dmarck_lookup google_search_dmarck_lookup.png max-800 %}

第一頁的前幾個服務都有提供類似的功能

{% darrellImage800 mxtool_check_dmarc mxtool_check_dmarc.png max-800 %}

MxToolBox 是個樸實好用的工具，完整的顯示目前設定的資訊，基本上看到綠色的話，代表整個 record 沒有太大問題
下方的表格也說明目前每個詳細的項目設定是什麼，以及這個設定的用途大概是哪些

{% darrellImage800 easydmarc_check_dmarc easydmarc_check_dmarc.png max-800 %}

EasyDmarc 的服務是除了檢查 DMARC record 以外
也有提供付費服務來代收 DMARC 報表，讓你不用自行處理複雜的 DMARC 報表格式
應該也有類似提供警訊等等的相關功能

看到左邊顯示綠色就代表成功，最右邊的是目前的 DMARC 政策是什麼
**中間的紅色錯誤只是在說你沒有設定他們家的服務來代收報表**，並不是真的設定錯誤

## DMARC 該怎麼設定

有和 Email 行銷工具交手過的使用者可能已經有設定過 SPF DKIM，
這些認證紀錄都是透過所謂的 DNS 或是 Domain 的設定
如果不清楚 DNS 系統，請先找內部的網管人員或是 IT 工程同事詢問，
或是自行使用的個人用戶請回想 Domain 的購買和管理是在哪個服務商
以下列舉一些較為常見的 DNS 服務商

[CloudFlare](https://dash.cloudflare.com/login)
[GoDaddy](https://tw.godaddy.com/)
[中華電信](https://dnmgt.hinet.net/DNShosting/dns_pro_c2/login.php)
[CloudMax](https://www.cloudmax.com.tw/#)

找到自己的服務後進入 DNS 紀錄的地方新增
以下用 **CloudFlare** 示範

{% darrellImage800 add_dns_record_in_cloudflare add_dns_record_in_cloudflare.png max-800 %}
新增一筆 record

{% darrellImage800 set_dmarc_record_in_cloudflare set_dmarc_record_in_cloudflare.png max-800 %}
**Name** 的地方請注意
一定為 `_dmarc` 開頭
但要先詢問清楚預計使用的發信 domain 是什麼，是否有要用特定子網域

例如
`test.com` 是主網域

設定 `_dmarc` 就是預計直接使用 `test.com` 來當作發信的網域
如果設定為 `_dmarc.marketing` 那就是使用 `marketing.test.com` 來發信

**Content**
一開始的建議都請設定
`v=DMARC1; p=none;`

簡單的說明這些值的意思
- **必填** `v=DMARC1` 表示這是一個 DMARC 記錄。固定值不變
- **必填** `p=none` 表示目前不對違反政策的郵件採取行動。其他有 quarantine, reject
- 選填 `rua=mailto:yourname@yourdomain.com` 表示報告將發送到指定的電子郵件地址。建議有需要或試著想要處理 DMARC 報表的使用者在進行設定，下面截圖提供 DMARC 報表的 XML 樣式截圖

設定好後存擋即可，等一下子(數分鐘)，在用上面提到的檢查方式確認即可


{% darrellImage800 google_dmarc_report_example google_dmarc_report_example.png max-800 %}
DMARC 報表截圖，以及相關 [Google 文件-DMARC 報表](https://support.google.com/a/answer/10032472?hl=zh-Hant#zippy=%2Cdmarc-%E5%A0%B1%E8%A1%A8%E7%AF%84%E4%BE%8B-%E5%8E%9F%E5%A7%8B-xml-%E6%A0%BC%E5%BC%8F)

## Google, Yahoo 新政策

建議請先參閱 [Google 官方的相關說明](https://support.google.com/a/answer/81126?hl=zh-Hant)

{% darrellImage800 gmail_202402_send_policy_for_all_sender gmail_202402_send_policy_for_all_sender.png max-800 %}

{% darrellImage800 gmail_202402_send_policy_for_above_5000_sends gmail_202402_send_policy_for_above_5000_sends.png max-800 %}

一些重要的項目如下

1. 電子郵件驗證: 基本的 SPF 和 DKIM 在 Email 行銷一直很重要，這樣才能驗證為自己的網域發信並提升安全性

2. DMARC驗證: DMARC 主要是在 SPF 和 DKIM 任何一項驗證失敗時，告訴收信端該如何處理這封信

3. 一鍵退訂功能: 行銷型的信件通常在最下方都要加上取消訂閱連結，另外一鍵退訂通常使用發信平台服務應該都會幫忙加上。

{% darrellImage800 easy_unsub_in_gmail easy_unsub_in_gmail.png max-800 %}

如果是自行用程式或是自己的 MailServer 在發送行銷信件，請參考文件的這個區塊加上退訂資訊

{% darrellImage800 unsub_header_gmail unsub_header_gmail.png max-800 %}

4. 垃圾郵件率閾值: 垃圾郵件比率低於 0.10%，切勿達到 0.30%，可以使用 PostMaster 來監控自己的網域發信狀況

5. 適當的郵件格式和標頭: 新要求還強調需要適當的郵件格式和使用恰當的標頭，符合一些常規即可

