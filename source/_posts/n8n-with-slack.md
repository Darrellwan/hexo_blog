---
title: n8n Slack 整合實測 - 訊息發送與觸發器設定完整流程
tags:
  - n8n
  - Slack整合
  - n8n實測
  - 完整流程
categories:
  - n8n
page_type: post
id: n8n-with-slack
description: n8n Slack 整合實戰指南！從 OAuth 認證設定到訊息發送、Trigger 觸發器配置，實測分享完整流程與常見問題解決。適合 No-Code 初學者，不需程式經驗即可上手。
bgImage: n8n-with-slack_bg.jpg
preload:
  - n8n-with-slack_bg.jpg
date: 2024-12-08 17:57:04
---

{% darrellImageCover n8n-with-slack_bg n8n-with-slack_bg.jpg %}

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

## Credentials 設定

{% darrellImage n8n_set_slack_credentials n8n_set_slack_credentials.png max-800 %}

n8n 設定 Slack 的 Credentials 有兩種方式

### OAuth

{% darrellImage n8n_set_slack_credentials_oauth_step1 n8n_set_slack_credentials_oauth_step1.png max-400 %}
{% darrellImage n8n_set_slack_credentials_oauth_success n8n_set_slack_credentials_oauth_success.png max-800 %}

這是最簡單直覺的方式，只要登入 Slack 並授權即可
優缺點:   
✅ 不需要管理 Access Token
✅ 自動處理好需要的權限，Slack 的 Permissions 繁多複雜，稍後 Access Token 會提到
❌ 無法客製化調整權限
❌ 無法當作 Slack 的相關 Trigger 使用

### Access Token

想要取得 Token 就必須得完成下面幾個部分

1. 到 Slack 新增一個 APP
{% darrellImage n8n_slack_create_app n8n_slack_create_app.png max-800 %}
2. 調整要取得權限的 Scope
{% darrellImage n8n_slack_app_set_scope n8n_slack_app_set_scope.png max-800 %}
Scope 這邊要注意，前面優缺點有提到，要設定的選項蠻多的
n8n 有提供文件參考哪些需要設定:

[查看需要的 Slack Scopes 設定清單](https://docs.n8n.io/integrations/builtin/credentials/slack/#scopes)

<div class="copy-scopes">
  <p>點擊下方文字即可複製所需的 Scope：</p>
  <div class="scope-text">
    <div class="scope-item"><span>channels:read</span></div>
    <div class="scope-item"><span>chat:write</span></div>
    <div class="scope-item"><span>files:read</span></div>
    <div class="scope-item"><span>files:write</span></div>
    <div class="scope-item"><span>groups:read</span></div>
    <div class="scope-item"><span>im:read</span></div>
    <div class="scope-item"><span>mpim:read</span></div>
    <div class="scope-item"><span>reactions:read</span></div>
    <div class="scope-item"><span>reactions:write</span></div>
    <div class="scope-item"><span>usergroups:read</span></div>
    <div class="scope-item"><span>usergroups:write</span></div>
    <div class="scope-item"><span>users:read</span></div>
  </div>

  <div class="scope-warning">
    <p>以下 Scopes 不適用於 Bot Token：</p>
    <div class="scope-text bot-invalid">
      <div class="scope-item"><span>users.profile:write</span></div>
      <div class="scope-item"><span>stars:write</span></div>
      <div class="scope-item"><span>stars:read</span></div>
      <div class="scope-item"><span>channels:write</span></div>
    </div>
  </div>
</div>

<style>
.copy-scopes {
  margin: 20px 0;
  padding: 15px;
  background: #2d2d2d;
  border-radius: 5px;
  color: #fff;
}
.scope-text {
  padding: 10px;
  background: #1e1e1e;
  border-radius: 4px;
  margin-top: 10px;
  font-family: monospace;
}
.scope-warning {
  margin-top: 20px;
}
.scope-warning p {
  color: #ff9800;
  margin-bottom: 5px;
}
.bot-invalid {
  border-left: 3px solid #ff9800;
}
.scope-item {
  padding: 8px 10px;
}
.scope-item span {
  color: #e0e0e0;
  cursor: pointer;
  user-select: none;
}
.scope-item span:hover {
  color: #fff;
}
.scope-item span.copied {
  color: #66bb6a;
  text-shadow: 0 0 8px rgba(102, 187, 106, 0.3);
}
</style>

<script>
document.querySelector('.copy-scopes').addEventListener('click', function(e) {
  if (e.target.tagName === 'SPAN') {
    const scope = e.target.textContent.replace(' (複製成功)', '');
    navigator.clipboard.writeText(scope).then(() => {
      if (!e.target.classList.contains('copied')) {
        e.target.textContent = scope + ' (複製成功)';
        e.target.classList.add('copied');
      }
    });
  }
});
</script>

3. 將 APP 安裝到 workspace
4. 取得 Access Token
{% darrellImage n8n_slack_app_reinstall_app_get_token n8n_slack_app_reinstall_app_get_token.png max-800 %}
5. 將 Token 填入 n8n 的 Credentials
{% darrellImage n8n_slack_paste_access_token n8n_slack_paste_access_token.png max-800 %}
6. 如果要發送訊息到某個 Channel 需要先邀請 App 進入 Channel
{% darrellImage n8n_slack_send_message_invite_bot_to_channel n8n_slack_send_message_invite_bot_to_channel.png max-800 %}

## 發送訊息

Credentials 設定好後，就可以建立 Node 來發送訊息
{% darrellImage n8n_slack_send_message_setting n8n_slack_send_message_setting.png max-800 %}

1. 選擇剛剛建立好的 credentials
2. 選擇要發送的 Channel
   這裡先以 Channel 為示範，如果選擇 User 則是發送訊息給特定使用者
3. 填入要發送的訊息，測試時可以先用固定文字
{% darrellImage n8n_slack_send_message_setting_step2 n8n_slack_send_message_setting_step2.png max-400 %}

4. 按下 Test Action 後測試，看到截圖這樣就代表成功
{% darrellImage n8n_slack_send_message_test_success n8n_slack_send_message_test_success.png max-400 %}

## Slack Trigger

Slack 除了可以當 action，也能當 Trigger 來觸發
這裡會用 app mention 來示範
也就是說當我們在 Slack Channel @APP 時，他就會觸發 n8n 的 workflow

### 設定步驟

{% darrellImage n8n_slack-set_trigger_on_bot_app_mentioned n8n_slack-set_trigger_on_bot_app_mentioned.png max-800 %}

首先一樣新增一個 Node
1. 選擇需要的 Slack Trigger，總共有八種可以選
這裡先選擇 On bot app mention
2. 確認 Trigger 是剛剛選擇的
3. 選擇一個 Channel，後續就需要在這個 Channel 來 @{你的app}
如果這個步驟無法選擇，那可能是權限有問題，請確認你在 Slack 設定的權限是否都是上面建議的那些
4. 你會得到一個 Webhook URL，這個 URL 需要在 Slack 貼上做驗證如下圖

{% darrellImage n8n_slack-check_webhook_url n8n_slack-check_webhook_url.png max-800 %}

5. 驗證成功後，看到 Verified 代表設定成功

### 測試觸發

測試蠻簡單的，先在 n8n 把 Trigger 點擊 Test Step
接著就會看到他開始監聽
由於他監聽的事件是 app mentioned
那我們就要到剛剛指定的 Channel 來 @APP 觸發

{% darrellImage n8n_slack-test_slack_trigger n8n_slack-test_slack_trigger.png max-400 %}

回到 Slack 並且 @APP 發送訊息後，回到 n8n 就能看到這些資訊了

{% darrellImage n8n_slack-get_test_information n8n_slack-get_test_information.png max-400 %}

幾個 Schema 可以提一下，方便未來使用
user: 發送訊息的 User ID，如果你想要讓 App Mention 該使用者，就會需要這個 ID
channel: Channel 的 ID，如果想要單獨發送訊息回到這個 Channel，就要使用這個 ID
text: 使用者發訊息的內容，如果要根據內容來往下處理，就會需要提取這個內容來判斷
team: workspace 的 ID
ts: 發送訊息的時間戳記，但如果你想要 App 回覆訊息時 Reply 在該訊息下，就要使用這個時間戳記

時間戳記的使用方式如下圖
{% darrellImage n8n_slack-post_message_to_reply n8n_slack-post_message_to_reply.png max-400 %}

## 成果

目前展示的場景很簡單

在 @APP 發送訊息後，將訊息內容直接丟給 OpenAI API 的 4o-mini 模型來做回應
選擇 4o-mini 的原因不外呼是因為 API 的價格便宜，回應速度也很快

原本想測試 Perplexity 的 API 但貌似在 n8n 還沒有直接支援
得改用 n8n 的 Http Request 來做，並且還要額外處理回應的內容格式

{% darrellImage n8n_slack-demo_success n8n_slack-demo_success.png max-400 %}

希望這篇能夠幫到對於 n8n 和 Slack 有興趣的人，有問題的話也歡迎來信
或私訊 [IG](https://www.instagram.com/darrell_tw_/) 
