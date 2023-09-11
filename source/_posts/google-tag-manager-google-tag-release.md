---
title: Google Tag 釋出，GA4 的 Configuration Tag 不見了
date: 2023-09-10 22:53:14
tags:
  - Google Tag Manager
categories:
  - Google Tag Manager
page_type: post
description: Google Tag Manager 最近有個蠻大的更新，以前的 GA4 Configuration Tag 不見了，取而代之的是全新的 Google Tag 代碼， 變數中也多了 Google 代碼：事件設定、Google 代碼：配置設定。這個全新的設計帶來了和以前不太一樣的設定邏輯，也在一些場景中有更好的設定方式。
include:
  # Include any file and subfolder in 'source/_css/'.
  - "_css/custom.css"
---

<link rel="stylesheet" href="./custom.css" />

{% darrellImageCover GTM的新功能_Google_Tag_更新 google-tag-manager-google-tag-release_bg.png max-800 %}

## Google Tag - Google 代碼

首先在 Google Tag Manager 新增 Google Tag 和 GA4 Event Tag 的步驟有點不太一樣了

相關的 Tag 都被收在 Google Analytics 中

{% darrellImage800 new_google_tag_in_gtm_how_to_find_it_step1 new_google_tag_in_gtm_how_to_find_it_step1.png max-800 %}

{% darrellImage800 new_google_tag_in_gtm_how_to_find_it_step2 new_google_tag_in_gtm_how_to_find_it_step2.png max-800 %}

在這邊就可以找到這次更新的 **Google 代碼**

{% darrellImage800 google_tag_setting_in_gtm google_tag_setting_in_gtm.png max-800 %}

和以前差不多，只要填入 GA4 的 串流 ID 即可，
補充 : 這裡的新設計就是為了以後不是只有支援 GA4，連同 Google Ads 和任何其他 Google 相關的追蹤碼都可以共用這邊
可以感受到 Google 的目標也是想要整合這些很多種不同的代碼，讓以後可以用一個代碼就蒐集到所有相關需要的資料，並且和不同的服務共用

下方的設定中也多出了兩個新的部分
1. 配置設定
2. 共用事件設定

## 變數 : Google Tag - 配置設定

下方表格列出官方文件提到可以配置的參數和說明
[文件-在 Google 代碼管理工具中重複使用配置設定](https://support.google.com/google-ads/answer/13438166?hl=zh-Hant&sjid=3723850005492115424-AP)

<div id="gtm_gtag_config_settings_area" style="text-align: right;margin: 1rem;">
  <span class="select_desc">如果想快速篩選，請選擇右邊的選單!</span>
  <select id="gtm_gtag_config_settings_filter_select" class="classic">
    <option value="all">All</option>
    <option value="googleads">Google Ads</option>
    <option value="ga4">GA4</option>
    <option value="merchantcenter">Merchant Center</option>
  </select>
</div>

<div id="gtm_gtag_config_settings">

| 名稱                         | <div class="w-100px"> 類型</div>    | <div class="w-100px">預設值</div>  | 說明                                                                                                      | Google Ads | GA4 | Merchant Center |
| ---------------------------- | ------- | ------------- | --------------------------------------------------------------------------------------------------------- | ---------- | --- | --------------- |
| ads_data_redaction           | 布林值  | false         | 使用同意聲明模式參數，即可在同意聲明遭拒時遮蓋所有請求中的廣告點擊 ID (例如 &gclid、&dclid、&wbraid 等)。 | x          |     |                 |
| allow_ad_personalization_signals | 布林值 | true      | 設為 false 可停用廣告個人化功能。                                                                      | x          | x   | x               |
| allow_google_signals         | 布林值  | true          | 預設值為 `true`。如要停用所有廣告功能，請將 `allow_google_signals` 設為 `false`。                     | x          | x   |                 |
| allow_interest_groups        | 布林值  | true          | 您可以透過 [Privacy Sandbox API](https://developer.chrome.com/docs/privacy-sandbox/fledge-api/) 設定，選擇不儲存興趣群組資料。    | x          | x   | x               |
| campaign_content             | 字串    | 未定義        | 用於 A/B 測試和指定內容廣告。使用 `campaign_content` 可區分連到同一個網址的不同廣告或連結。注意：設定這個值會覆寫 `utm_content` 查詢參數。 |            | x   | x               |
| campaign_id                  | 字串    | 未定義        | 用於識別這個參照連結網址參照的廣告活動。使用 `campaign_id` 可識別特定廣告活動。注意：設定這個值會覆寫 `utm_id` 查詢參數。     |            | x   | x               |
| campaign_medium              | 字串    | 未定義        | 使用 `campaign_medium` 可識別電子郵件或單次點擊出價等媒介。注意：設定這個值會覆寫 `utm_medium` 查詢參數。                  |            | x   | x               |
| campaign_name                | 字串    | 未定義        | 用於關鍵字分析。使用 `campaign_name` 可識別特定的產品促銷或策略性廣告活動。注意：設定這個值會覆寫 `utm_name` 查詢參數。   |            | x   | x               |
| campaign_source              | 字串    | 未定義        | 使用 `campaign_source` 可識別搜尋引擎、電子報名稱或其他來源。注意：設定這個值會覆寫 `utm_source` 查詢參數。                |            | x   | x               |
| campaign_term                | 字串    | 未定義        | 用於付費搜尋。使用 `campaign_term` 可記錄這則廣告的關鍵字。注意：設定這個值會覆寫 `utm_term` 查詢參數。                |            | x   | x               |
| client_id                    | 字串    | 針對每位使用者隨機產生的值。 | 以匿名方式識別瀏覽器執行個體。根據預設，這個值會儲存為第一方 Analytics (分析) Cookie，有效期限為兩年。           |            | x   |                 |
| content_group                | 字串    | 未定義        | 內容群組可用來將網頁和畫面分類到自訂值區。[進一步瞭解內容群組](https://support.google.com/analytics/answer/11523339)。                |            | x   |                 |
| conversion_linker            | 布林值  | true          | 使用這個參數可停用 Google Ads 和 Floodlight 的轉換連結。如果設為 false，可停用轉換連結。                      | x          |     |                 |
| cookie_domain                | 字串    | 'uto'         | 指定用來儲存數據分析 Cookie 的網域。如要在不指定網域的情況下設定 Cookie，請設為 'none'。設為 'auto' (預設值)，即可將 Cookie 設為頂層網域加上一個子網域 (eTLD +1)。舉例來說，如果將 `cookie_domain` 設為 'auto'，https://example.com 就會使用 example.com 做為網域，且 https://subdomain.example.com 也會使用 example.com 做為網域。 | x | x | x |
| cookie_expires               | 數字    | 63072000      | 每次 Google Analytics (分析) 收到命中資料時，Cookie 到期時間就會更新為目前時間加上 cookie_expires 欄位中的值。也就是說，如果使用兩年的時間做為預設值 (63072000 秒)，且使用者每個月都造訪您的網站，則相關 Cookie 永遠不會過期。如果將 cookie_expires 時間設為 0 (零) 秒，該 Cookie 就會轉換為以工作階段為單位，並在目前的瀏覽器工作階段結束後到期。注意：如果設定的 Cookie 到期時間過短，系統會浮報使用者人數，導致評估品質降低。 | x | x | x |
| cookie_flags                 | 字串    | 未定義        | 設定時可將其他標記附加到 Cookie。標記必須以半形分號分隔。請參閱 [寫入新的 Cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#write_a_new_cookie) 一節，查看幾個可設定的標記範例。 | x | x | x |
| cookie_path                  | 字串    | '/'           | 指定用來儲存 Google 代碼 Cookie 的子路徑。                                                            | x          | x   | x               |
| cookie_prefix                | 字串    | 未定義        | 指定要在廣告和數據分析 Cookie 名稱前面加上的前置字元。例如，您可以將開頭為 _gcl_aw 的廣告 Cookie 重新命名為 `<your-prefix>_aw`。       | x          | x   | x               |
| cookie_update                | 布林值  | true          | 如果將 cookie_update 設為 true： GA4 和 Merchant Center 會在每次載入網頁時更新 Cookie，而 Cookie 到期時間也會隨之更新，根據最近一次造訪網站的時間進行設定。舉例來說，如果將 Cookie 到期時間設為一週，而使用者每五天就使用同一個瀏覽器造訪網站，則 Cookie 到期時間會在每次造訪時更新，且永遠不會過期。 Google Ads 和 Floodlight 會以原始到期日更新 Cookie，因此仍與首次造訪的時間相關。 如果設為 false，系統就不會在每次載入網頁時更新 Cookie，而是會根據使用者首次造訪網站的時間，決定 Cookie 到期時間。 | x | x | x |
| customer_lifetime_value      | 字串    | 未定義        | 指定系統將客戶計為回訪客戶的時間範圍。                                                                | x | | |
| groups                       | 字串    | 未定義        | 您可以建立一組目標 (例如產品、帳戶和資源)，然後將事件轉送至該群組。如要將事件傳送到群組，則必須在事件代碼中設定 [send_to](/tagmanager/answer/13438771#send-to) 參數。 | x | x | x |
| ignore_referrer              | 布林值  | false         | 設定為 `true`，告訴 Analytics (分析) 不應將參照網址顯示為流量來源。 [瞭解使用這個欄位的時機](https://support.google.com/analytics/answer/10327750#set-parameter)。 | | x | x |
| language                     | 字串    | [navigator.language](https://developer.mozilla.org/zh-Hant/docs/Web/API/Navigator/language) | 指定使用者的語言偏好設定。                                                          | x | x | x |
| new_customer                 | 布林值  | 未定義        | 提供 Google Ads 廣告活動的獲取新客報表。如需導入詳情，請參閱 [Google Ads 說明](https://support.google.com/google-ads/answer/12077475#zippy=%2Cinstall-with-google-tag-manager)。 | x | | |
| page_hostname                | 字串    | [location.hostname](https://developer.mozilla.org/en-US/docs/Web/API/Location/hostname) | 設定網站的主機名稱。您可以使用這個參數覆寫自動設定的值。                         | | x | x |
| page_location                | 字串    | [document.location](https://developer.mozilla.org/en-US/docs/Web/API/Document/location) | 指定網頁的完整網址。您可以使用這個參數覆寫自動設定的值。                       | x | x | x |
| page_path                    | 字串    | [location.pathname](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) | 指定網頁路徑 (/ 後方的字串)。您可以使用這個參數覆寫自動設定的值。                | | x | x |
| page_referrer                | 字串    | [document.referrer](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) | 指定為網頁帶來流量的推薦連結來源。這個值也會用於計算流量來源。您可以使用這個參數覆寫自動設定的值。 | x | x | x |
| page_title                   | 字串    | [document.title](https://developer.mozilla.org/en-US/docs/Web/API/Document/title) | 網頁或文件的標題。您可以使用這個參數覆寫自動設定的值。                         | x | x | x |
| send_page_view               | 布林值  | true          | 設為 false 即可防止預設程式碼片段傳送 page_view 事件。                                     | | x | | |
| screen_resolution            | 字串    | [window.screen](https://developer.mozilla.org/en-US/docs/Web/API/Window/screen) | 指定螢幕的解析度。應為兩個正整數，並以 x 分隔。舉例來說，如果是 800 x 600 像素的螢幕，這個值會是「800x600」。根據使用者的 [window.screen](https://developer.mozilla.org/en-US/docs/Web/API/Window/screen) 值計算得出。 | | x | x |
| server_container_url         | 字串    | 未定義        | 指定標記伺服器的網址。如要進一步瞭解伺服器端代碼，請參閱 [本文](https://developers.google.com/tag-platform/tag-manager/server-side)。 | x | x | x |
| user_id                      | 字串    | 未定義        | 為使用者指定網站擁有者/程式庫使用者所提供的已知 ID。ID 不得為 PII (個人識別資訊)。這個值不得儲存在 Google Analytics (分析) Cookie 或其他 Analytics (分析) 提供的儲存空間中。長度上限為 256 個字元。 | | x | | |
| user_properties              | 物件    | 未定義        | 使用者屬性是用來描述使用者族群區隔的屬性，例如語言偏好設定或地理位置。每項專案最多可以額外設定 25 個使用者屬性。 [瞭解如何設定使用者屬性](/tagmanager//answer/13438771#user-properties)。 | | x | |

</div>

## 變數 : Google Tag - 共用事件設定

[文件-在 Google 代碼管理工具中重複使用事件設定](https://support.google.com/tagmanager/answer/13438771)

<div id="gtm_gtag_event_settings">

| 名稱 | <div class="w-100px">類型</div> | <div class="w-100px">預設值</div> | 說明 | Google Ads | GA4 | Merchant Center |
|------|------|--------|------|------------|----|-----------------|
| achievement_id | 字串 | 未定義 | 已解鎖的成就 ID。這是 [unlock_achievement](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#unlock_achievement) 事件的一部分，用於評估遊戲體驗。 |  | x |  |
| aw_feed_country | 字串 | 未定義 | 與上傳項目所屬動態饋給相關的國家/地區。請使用 CLDR 地域代碼，例如 'US'。[「透過購物車資料回報的轉換」報表](https://support.google.com/google-ads/answer/9028614?hl=zh-Hant#zippy=%2Cinstall-with-google-tag-manager)的一部分。 | x |  |  |
| aw_language | 字串 | 未定義 | 上傳項目所屬動態饋給採用的語言。請使用 ISO 639-1 語言代碼。[「透過購物車資料回報的轉換」報表](https://support.google.com/google-ads/answer/9028614?hl=zh-Hant#zippy=%2Cinstall-with-google-tag-manager)的一部分。 | x |  |  |
| aw_merchant_id | 整數 | 未定義 | Merchant Center ID。如果您在多個 Merchant Center 帳戶有同個項目，且想指定要從哪個帳戶擷取項目資料 (例如銷貨成本)，請提供這項參數。[「透過購物車資料回報的轉換」報表](https://support.google.com/google-ads/answer/9028614?hl=zh-Hant#zippy=%2Cinstall-with-google-tag-manager)的一部分。 | x |  |  |
| content_group | 字串 | 未定義 | 內容群組可用來將網頁和畫面分類到自訂值區。[瞭解詳情](https://support.google.com/analytics/answer/11523339) |  | x | x |
| content_id | 字串 | 未定義 | 所選內容 ID，例如 'C_12345'。屬於 [select_content](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#select_content) 事件的一部分。 |  | x | x |
| content_type | 字串 | 未定義 | 內容類型，例如 'image'。屬於 [share](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#share) 和 [select_content](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#select_content) 事件。 |  | x |  |
| coupon | 字串 | 未定義 | 與事件相關聯的優待券名稱/代碼。事件層級與項目層級的 coupon 參數各自獨立。 |  | x |  |
| country | 字串 | 未定義 | 用來擷取使用者所在國家/地區的參數。請使用 ISO 3166-1 alpha-2 格式 (例如 'US' 代表美國)。 | x |  |  |
| currency | 字串 | 未定義 | 與事件相關聯的項目幣別，採用 [3 個字母的 ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) 格式。如已設定 value，則還需要使用 currency 才能準確計算收益指標。 | x | x | x |
| delivery_postal_code | 數字 | 未定義 | 訂單運送地址中郵遞區號的區域前置碼 (標示區域的部分)。區域前置碼用來判斷商家配送服務的準時送達情形。提交這項資料時，建議只提供郵遞區號的前 3 碼。這是 Google Ads 轉換追蹤的一部分，用於 [驗證運送資料](https://support.google.com/merchants/answer/10363251?hl=zh-Hant#zippy=%2Cinstall-with-google-tag-manager)。 | x |  | x |
| discount | 數字 | 未定義 | 與項目相關聯的折扣金額。 | x | x |  |
| estimated_delivery_date | 字串 | 未定義 | 在 [客戶的購物車資料](https://support.google.com/google-ads/answer/9028614) 中，訂單承諾的最晚送達日期 (最長運送時間)。如果訂單含有「免運費」和「快速到貨」商品 (包含新狀態或維護狀態)，Google 會以該日期為運送速度的驗證依據。注意：這個參數採用的是 [國際日期格式](https://www.w3.org/QA/Tips/iso-date) (YYYY-MM-DD)。在這裡提交的日期應以 delivery_postal_code 參數所設位置的日期和時區為準。這是 Google Ads 轉換追蹤的一部分，用於 [驗證運送資料](https://support.google.com/merchants/answer/10363251?hl=zh-Hant#zippy=%2Cinstall-with-google-tag-manager)。 | x |  |  |
| group_id | 字串 | 未定義 | 群組 ID，例如 'G_12345'。這是 [join_group](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#join_group) 事件的一部分，用來評估特定群組或社交功能的熱門程度。 |  | x |  |
| items | 陣列<Item> | 未定義 | 列出事件的項目。這是包含子參數的電子商務參數。您可以找到以下項目的子參數：Google Ads：[透過購物車資料回報的轉換](https://support.google.com/google-ads/answer/9028614) GA4：[項目參數參考資料](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#add_payment_info_item) | x | x | x |
| language | 字串 | [navigator.language](https://developer.mozilla.org/zh-Hant/docs/Web/API/Navigator/language) | 指定使用者的語言偏好設定。 | x | x | x |
| method | 字串 | 未定義 | 使用者選擇的做法，例如 'email'。這是 [login](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#login)、[share](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#share) 和 [sign_up](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#sign_up) 事件的一部分。 |  | x |  |
| payment_type | 字串 | 未定義 | 客戶選擇的付款方式，例如 'credit card'。 |  | x |  |
| score | 數字 | 未定義 | 使用者的分數。這是 [post_score](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#post_score) 事件的一部分，用於評估遊戲內分數。 |  | x |  |
| search_term | 字串 | 未定義 | 搜尋的字詞。這是 [search](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#search) 事件的一部分。 |  | x |  |
| send_to<a id="send-to"></a> | 字串 | 未定義 | 指定 Google 代碼目的地 ID。可與 [groups](/tagmanager/answer/13438166#groups) 設定參數搭配使用。 | x | x | x |
| shipping | 數字 | 未定義 | 與交易相關聯的運費，例如 60。 | x | x | x |
| shipping_tier | 字串 | 未定義 | 選取配送已購商品的運送層級，例如 'Ground' (陸運)、'Air' (空運)、'Next-day' (隔日)。 | x | x | x |
| tax | 數字 | 未定義 | 與交易相關聯的稅金費用，例如 30。 |  | x | x |
| transaction_id | 字串 | 未定義 | 交易的專屬 ID，例如 'T_12345'。[transaction_id](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#transaction_id) 參數可避免單筆購買產生重複事件。 | x | x | x |
| user_data | 物件 | 未定義 | 此參數用於停止自動收集使用者提供的資料。如要停止收集特定網頁的資料，請將 [user_data](https://support.google.com/tagmanager/answer/12131703?#Data&amp;zippy=%2Callow-user-provided-data-capabilities) 設為 null。如要完全停用使用者定義的資料收集功能，請[使用 Google 代碼設定](https://support.google.com/tagmanager/answer/12131703?#Data&amp;zippy=%2Callow-user-provided-data-capabilities)。 | x |  |  |
| user_properties | 物件 | 未定義 | 用來傳送額外 Google Analytics (分析) 使用者屬性的參數。[瞭解如何設定使用者屬性](#user-properties)。 |  | x |  |
| value | 數字 | 未定義 | 事件金額，例如 390。必須設定 value 才能產生有意義的報表，以及填入「購買者」[預測目標對象](https://support.google.com/analytics/answer/9805833)。如已設定 value，則要一併設定 currency。 | x | x | x |
| virtual_currency_name | 字串 | 未定義 | 虛擬貨幣的名稱。這是 [earn_virtual_currency](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#earn_virtual_currency) 和 [spend_virtual_currency](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#spend_virtual_currency) 事件的一部分。 |  | x |  |

</div>

## 目前已知的好處

雖然在配置設定和以前沒什麼太大改變，但是共用事件設定就帶來了一些好處

例如有多個事件的追蹤設定，舉例為 **click_header, click_center, click_footer**
它們各自都有參數
`click_url, click_text, click_type` 等等
以前都要一個一個設定，或是偷懶複製一個 Tag 
但如果其中的參數要修改，就必須得把所有找的到的 Event 都檢查一次，並且逐一修改

現在有了 Google Tag 共用事件設定後，就可以把這種同一類型的參數都蒐集在一起，
並且讓所有相關事件共用這個變數，未來就算要修改，
也只需要修改一個變數即可!

可惜現在也只有一個階層可以設定，如果以後可以支援 Parnet Child 這種繼承的架構，那整個 GA4 的事件追蹤相信能更輕鬆且好管理

Google 能夠踏出這一步修改已經很讓人驚艷，就算沒有改到非常完美，也期待它未來有陸陸續續的更新

<script>
    (function(){

        function filterTable(selectSelector, tableSelectors) {
            const filterSelect = document.querySelector(selectSelector);
            filterSelect.addEventListener("change", function () {
                const selectedValue = filterSelect.value.toLowerCase();
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event : "darrell_track_event",
                    event_name : "user_select_option",
                    custom_value : selectedValue
                })
                tableSelectors.forEach(tableSelector => {
                    const tableRows = document.querySelectorAll(`${tableSelector} tbody tr`);
                    const tableHeader = document.querySelector(`${tableSelector} thead`);

                    tableRows.forEach(function (row) {
                        const cells = Array.from(row.querySelectorAll("td"));
                        const googleAdsCell = cells[4].textContent.toLowerCase();
                        const ga4Cell = cells[5].textContent.toLowerCase();
                        const merchantCenterCell = cells[6].textContent.toLowerCase();

                        const showGoogleAds = selectedValue === "all" || (selectedValue === "googleads" && googleAdsCell === "");
                        const showGA4 = selectedValue === "all" || (selectedValue === "ga4" && ga4Cell === "");
                        const showMerchantCenter = selectedValue === "all" || (selectedValue === "merchantcenter" && merchantCenterCell === "");

                        cells[4].style.display = showGoogleAds ? "" : "none";
                        cells[5].style.display = showGA4 ? "" : "none";
                        cells[6].style.display = showMerchantCenter ? "" : "none";

                        row.style.display = (showGoogleAds || showGA4 || showMerchantCenter) ? "" : "none";
                    });

                    tableHeader.querySelector("th:nth-child(5)").style.display = (selectedValue === "googleads" || selectedValue === "all" ) ? "" : "none";
                    tableHeader.querySelector("th:nth-child(6)").style.display = (selectedValue === "ga4" || selectedValue === "all" ) ? "" : "none";
                    tableHeader.querySelector("th:nth-child(7)").style.display = (selectedValue === "merchantcenter" || selectedValue === "all" ) ? "" : "none";
                });
            });
        }

        filterTable("#gtm_gtag_config_settings_filter_select", ["#gtm_gtag_config_settings", "#gtm_gtag_event_settings"])


    })()
</script>