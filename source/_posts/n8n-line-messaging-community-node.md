---
title: n8n Line Messaging 社群節點教學
tags:
  - n8n
  - n8n節點介紹
  - n8n教學
categories:
  - n8n
page_type: post
id: n8n-line-messaging-community-node
description: n8n LINE Messaging 社群節點完整教學!使用 @aotoki/n8n-nodes-line-messaging 簡化 LINE Bot 開發,視覺化介面降低出錯率。涵蓋安裝設定、4 大核心功能操作、常見問題排解,以及與 HTTP Request 的使用時機比較
bgImage: blog-n8n-line-messaging-node-bg.jpg
preload:
  - blog-n8n-line-messaging-node-bg.jpg
date: 2025-10-21 13:23:12
modified: 2025-10-30 16:50:12
---

{% darrellImageCover blog-n8n-line-messaging-node blog-n8n-line-messaging-node-bg.jpg max-800 %}

## 快速導覽

預計閱讀時間：10-12 分鐘
適合對象：已有 n8n 基礎，想要自動化 LINE 訊息發送

你將學到：
- n8n Line Messaging 社群節點安裝和設定
- 4 大核心功能操作（發送、回覆、群發、用戶資料）
- 節點功能限制與 HTTP Request 替代方案

如果趕時間，可以跳到
{% quickNav %}
[
  {
    "text": "節點安裝設定",
    "anchor": "n8n-setup",
    "desc": "社群節點安裝、Credential 建立、測試串接"
  },
  {
    "text": "4 大核心功能",
    "anchor": "features",
    "desc": "Send、Multicast、Reply、Get Profile"
  },
  {
    "text": "常見問題",
    "anchor": "faq",
    "desc": "Error 401、JSON 錯誤、Reply Token 失效"
  }
]
{% endquickNav %}

---

## 為什麼需要 LINE Messaging 社群節點？

如果你曾經遇到以下困擾：
- 用 Request 節點太麻煩：每次都要查 API 文件、手動設定 Header 和 Body
- 訊息格式容易出錯：JSON 格式稍有錯誤就無法發送
- 缺少視覺化操作：無法直觀看到可用的功能和參數

那這個社群節點絕對能幫上忙！

我自己測試了 @aotoki/n8n-nodes-line-messaging 這個社群節點，發現它可以：
- 簡化設定流程：視覺化介面，無需手動撰寫 JSON
- 降低出錯率：參數欄位清楚標示，減少 90% 的格式錯誤
- 核心功能齊全：4 大核心功能滿足大部分使用場景（發送、回覆、群發、用戶資料）

接下來會手把手帶你完成設定，預計 20 分鐘就能跑出第一個成功案例！

---

## <span id="n8n-setup">n8n LINE Messaging 節點安裝和設定</span>

### 前置準備

在開始之前，你需要先取得以下資訊：

必要項目：
- Channel Access Token：從 [LINE Developers Console](https://developers.line.biz/console/) 取得
- User ID（測試用）：可從 LINE Developers Console 或透過 Webhook 取得

完整的 LINE Bot 設定教學請參考：
{% articleCard
  url="/n8n-line-message-api/"
  title="n8n LINE 訊息發送實戰 - Request 節點替代 LINE Notify"
  previewText="包含 LINE Developers Console 完整設定步驟"
  thumbnail="https://www.darrelltw.com/n8n-line-message-api/n8n-line-message-api-bg.jpg"
%}

---

### 安裝社群節點

在 n8n 介面中，點擊右上角的設定圖示 → Community nodes：

搜尋 **Line Messaging**

點擊 `Install Node` 進行安裝：

{% darrellImage800 n8n_line_messaging-install_node n8n_line_messaging-install_node.png max-800 %}

安裝完成後，在節點列表搜尋 LINE 就會看到新節點：

### 建立 Credentials

新增一個 LINE Messaging 節點後，點擊 Credential 欄位建立憑證：

填入你的 Channel Access Token：

{% darrellImage800 n8n_line_messaging-credential_settings n8n_line_messaging-credential_settings.png max-600 %}

參數說明：
- Credential Name：自訂名稱（例如：LINE Bot - 客服）
- Channel Access Token：貼上 Official Account 的 Channel Access Token
- Channel Secret：貼上 Official Account 的 Channel Secret

### 測試串接是否成功

設定完成後，新增一個簡單的測試 workflow：

選擇 Send Message 功能，填入：
- To：你的 User ID
- Message Type：Text
- Text：Hello from n8n!

點擊「Execute Node」執行後，檢查你的 LINE 是否收到訊息：

{% darrellImage800 n8n_line_messaging-test_result n8n_line_messaging-test_result.png max-400 %}

看到訊息就代表設定成功！

---

## <span id="features">LINE Messaging 節點功能介紹</span>

LINE Messaging 提供以下主要功能：

### 功能 1：Send Message（發送訊息）

使用場景：主動推播訊息給特定使用者

支援的訊息功能：
- Text Messages (V2)：純文字訊息，支援 Quote Token 和 Quick Reply
- Quick Replies：快速回覆按鈕（Postback 和 Message 動作）
- Quote Messages：引用回覆先前的訊息

**重要提醒**：此社群節點目前主要支援文字訊息，如需發送圖片、影片、Flex Message 等其他類型，建議使用 HTTP Request 節點搭配 LINE Messaging API。

設定步驟：


{% darrellImage800 n8n_line_messaging-send_message_setting n8n_line_messaging-send_message_setting.png max-800 %}

重要參數說明：
- UserId：接收者 User ID（格式：U 開頭）

**進階技巧：一次發送多則訊息**

LINE API 允許一次發送最多 5 則訊息，費用只算 1 則！

{% darrellImage800 n8n_line_messaging-send_message-max_5_messages n8n_line_messaging-send_message-max_5_messages.png max-800 %}

---

### 功能 2：Multicast（群發訊息）

使用場景：同時發送訊息給多個使用者（最多 500 人）
設定邏輯和 Send Message 相同，只是將 `User IDs` 改為多個使用者而已

{% darrellImage800 n8n_line_messaging-multicast_message_setting n8n_line_messaging-multicast_message_setting.png max-800 %}

---

### 功能 3：Reply Message（回覆訊息）

使用場景：收到使用者訊息後回覆訊息（搭配 Trigger 使用）

與 Send Message 的差異：
- Reply 使用 Reply Token（從 Webhook or Trigger 取得）
- Reply Token 只能使用一次，且有時效性（約 60 秒）
- 不計費！（免費回覆）

{% darrellImage800 n8n_line_messaging-reply_message_setting n8n_line_messaging-reply_message_setting.png max-800 %}

流程說明：
LINE Messaging Trigger 節點接收事件，取得 `replyToken` 並使用 Reply Message 節點回覆

{% darrellImage800 n8n_line_messaging-reply_message_workflow n8n_line_messaging-reply_message_workflow.png max-800 %}


---

### 功能 4：Get Profile（取得用戶資料）

使用場景：取得 LINE 用戶的個人資料（顯示名稱、頭像、狀態訊息）

關鍵參數：
- User ID：要查詢的用戶 ID

回傳資料：
- `displayName`：用戶名稱
- `pictureUrl`：頭像圖片網址
- `statusMessage`：狀態

{% darrellImage800 n8n_line_messaging-get_profile_setting n8n_line_messaging-get_profile_setting.png max-800 %}
---

### 功能 5: Flex Message 支援！

使用場景：取得 LINE 用戶的個人資料（顯示名稱、頭像、狀態訊息）

關鍵參數：
- User ID：要查詢的用戶 ID

回傳資料：
- `displayName`：用戶名稱
- `pictureUrl`：頭像圖片網址
- `statusMessage`：狀態

{% darrellImage800 n8n_line_messaging-get_profile_setting n8n_line_messaging-get_profile_setting.png max-800 %}
---

### 功能 6： Loading Animation

使用場景：顯示 Loading Animation，讓使用者清楚知道訊息已經被接收且正在處理中。
不然有些場景如果套用 AI 會有幾十秒的等待時間，使用者可能誤以為沒有處理又大量傳送訊息。

關鍵參數：
- User ID：要查詢的用戶 ID

回傳資料：
- `displayName`：用戶名稱
- `pictureUrl`：頭像圖片網址
- `statusMessage`：狀態

{% darrellImage800 n8n_line_messaging-get_profile_setting n8n_line_messaging-get_profile_setting.png max-800 %}

---

### LINE Messaging Trigger（Webhook）

用途：接收 LINE Webhook 事件，取得 `replyToken`、類型、來源與訊息內容來做後續自動化的串接

常見事件：`message`、`follow`、`unfollow`、`join`、`leave`、`postback`

快速設定：
1. 在節點取得（或啟用）Webhook URL，填入 LINE Developers Console 的 Webhook 設定。
2. 在節點中勾選要監聽的事件。

常見搭配：
- 取得 `replyToken` 後，直接接「Reply Message」節點回覆。
- 收到用戶訊息後，可搭配 Switch 節點進行關鍵字判斷與分流。

{% darrellImage800 n8n_line_messaging-trigger_setting n8n_line_messaging-trigger_setting.png max-800 %}

{% darrellImage800 n8n_line_messaging-trigger_setting_in_line_developer n8n_line_messaging-trigger_setting_in_line_developer.png max-800 %}

---

## <span id="faq">常見問題和解決方案</span>

| 問題 | 原因 | 解決方式 |
|------|------|---------|
| Error 401: Invalid Access Token | Token 錯誤或失效 | 1. 檢查 Credential 中的 Token<br>2. 回 LINE Developers Console 重新發行<br>3. 確認複製時沒有空格或換行 |
| Invalid JSON Error | JSON 格式錯誤 / 訊息參數設定不正確 | 1. 檢查訊息參數格式是否正確<br>2. 確認 Message Type 和訊息內容相符<br>3. 使用 n8n 的 Expression Editor 驗證 JSON 格式 |
| Reply Token 已失效 | Reply Token 超過 60 秒或已使用過 | 1. Reply Token 只能使用一次<br>2. 確保在收到 Webhook 後 60 秒內回覆<br>3. 如需延遲回覆，改用 Send Message |

取得正確 User ID 的方法：
- 使用 Webhook 接收訊息，從中取得 `userId`
- 使用「Get Profile」功能確認

---

## 相關文章推薦

{% articleCard
  url="/n8n-line-message-api/"
  title="n8n LINE 訊息發送實戰 - Request 節點替代 LINE Notify"
  previewText="詳細 Webhook 設定、Reply API 完整教學"
  thumbnail="https://www.darrelltw.com/n8n-line-message-api/n8n-line-message-api-bg.jpg"
%}

{% articleCard
  url="/n8n-webhook/"
  title="n8n Webhook 節點完整教學"
  previewText="學會接收外部數據，與 LINE Messaging 完美搭配"
  thumbnail="https://www.darrelltw.com/n8n-webhook/blog-n8n-webhook-bg.jpg"
%}

---

## 總結

這次新認證的 LINE Messaging 社群節點
對於新手和沒有串接過的人來說
**是個更方便的選擇**

把需要填入的資料都清楚的標示出來
以往需要搭配 LINE Messaging API 文件和 n8n 的 Request 節點來猜要填什麼

只是可惜無法使用 `Flex Message`
這在訊息的美觀和實用程度就降低了不少
例如像是 loading 動畫一樣要用 Request 來發送 API 等等

新手可以先利用這個節點來串接看看
習慣順手之後可以再來挑戰 LINE Messaging API 的完整版