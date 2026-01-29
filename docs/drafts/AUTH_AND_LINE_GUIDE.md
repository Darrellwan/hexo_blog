---
title: 部署你的第一個 AI 應用：從免費 Server 到 Moltbot/Clawdbot 與 LINE Bot 完整指南
tags:
  - 部署
  - LINE Bot
  - Antigravity
  - Moltbot
  - Clawdbot
categories:
  - 教學
page_type: post
id: deployment-auth-line-guide
description: 從免費 VPS 到付費平台，完整比較部署選擇。加上 Moltbot（Clawdbot）、Antigravity 登入與 LINE Bot 設定，0 元開始你的 AI 應用之旅。
---

## 前言

想部署自己的 AI 應用或 LINE Bot，但不知道從哪裡開始？

這篇整理了社群實測的部署經驗，從完全免費到花一點錢買方便的選項都有，讓你根據自己的需求選擇。

---

## 部署選擇

### 免費方案（需要自己動手裝）

{% dataTable %}
[
  {"平台": "Oracle 免費 Server", "規格": "視情況", "難度": "較高", "備註": "名額有限，要搶"},
  {"平台": "AWS Free Tier", "規格": "2G+", "難度": "較高", "備註": "12 個月免費"},
  {"平台": "GCP Free Tier", "規格": "視方案", "難度": "較高", "備註": "有免費額度"},
  {"平台": "Azure Free Tier", "規格": "視方案", "難度": "較高", "備註": "有免費額度"}
]
{% enddataTable %}

**安裝難度較高**，就是一台全新的 VPS 得自己動手裝。

{% callout tip %}
開好 SSH 後可以請 Claude Code 連進去自動幫你裝，基本上不太需要插手，除非一些指令因為有互動需要自己跑。
{% endcallout %}

### 付費方案（買方便）

{% dataTable %}
[
  {"平台": "Zeabur", "價格": "$5/月起", "優點": "有模板、介面跑指令方便"},
  {"平台": "Hostinger", "價格": "視方案", "優點": "VPS 類服務"}
]
{% enddataTable %}

有模板的話安裝速度真的快很多，需要跑指令也能從 Zeabur 介面開起來跑。

---

## Moltbot：開源的個人 AI 助手

如果你想要一個「Claude 加上手」的 AI 助手，[Moltbot](https://github.com/steipete/moltbot)（前身 Clawdbot）是目前最熱門的開源選擇。

### 它能做什麼？

- **執行實際任務**：不只聊天，還能操作檔案、跑指令、控制瀏覽器
- **持久記憶**：跨對話記得你說過的事
- **多平台支援**：WhatsApp、Telegram、Slack、Discord、Signal、iMessage
- **50+ 整合**：行事曆、Email、智慧家電等

{% callout warning %}
目前 Moltbot **不支援 LINE**。如果你需要 LINE Bot，請參考下方的 LINE Bot 設定章節。
{% endcallout %}

### 部署方式

1. 準備一台 VPS（上面提到的免費或付費方案都可以）
2. Clone GitHub repo
3. 設定 Claude API Key
4. 連接你想用的通訊平台

詳細步驟可參考 [Moltbot 官方文件](https://docs.clawd.bot/)。

{% callout tip %}
Moltbot 會吃蠻多 Claude API 用量的，開始玩之前建議先設好 usage limit。
{% endcallout %}

---

## Antigravity 登入與模型切換

### 登入流程

1. 前往 [Antigravity](https://antigravity.google.com) 網站
2. 點擊登入，使用 Google 帳號
3. 授權必要權限即可開始使用

### 省錢技巧：切換模型

{% callout warning %}
Antigravity Pro 方案光聊天而已就燒很快！
{% endcallout %}

**解決方法**：使用 `/models` 指令切換到其他模型

搭配 Codex 流量，可以做到 **0 元嘗試**，一邊探索 AI 的各種用途。

---

## LINE Bot 基礎設定

### 步驟 1：建立 LINE 官方帳號

1. 前往 [LINE Official Account Manager](https://manager.line.biz/)
2. 建立新的官方帳號
3. 進入設定 > Messaging API > 啟用

### 步驟 2：取得 Channel Access Token

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 選擇你的 Channel
3. 在 Messaging API 頁籤找到 Channel Access Token
4. 點擊 Issue 產生 Token

### 步驟 3：設定 Webhook

1. 在 LINE Developers Console 設定 Webhook URL
2. 格式：`https://你的網域/webhook/line`
3. 點擊 Verify 測試連線
4. 啟用「Use webhook」

---

## 相關文章

{% articleCard url="/n8n-line-message-api/" title="LINE Message API + n8n 實戰" previewText="從零開始的 LINE Bot 開發" %}

{% articleCard url="/n8n-deployment/" title="n8n 部署方案完整比較" previewText="Cloud、Zeabur、Docker 怎麼選" %}

{% articleCard url="/google-antigravity-ide/" title="Google Antigravity IDE 完整介紹" previewText="Google 的 AI Agent 開發平台" %}
