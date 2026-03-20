---
title: Claude Code Channels 設定教學，用手機 Discord、Telegram 遠端操控
date: 2026-03-20 12:56:55
tags:
  - Claude Code
  - AI
  - 開發工具
  - Discord
  - Telegram
categories:
  - 工具
page_type: post
id: claude-code-channels-discord-telegram
description: Claude Code Channels 讓你從手機 Discord 或 Telegram 傳訊息給正在跑的 Claude Code，不用坐在電腦前也能讓 AI 幫你改 code、跑指令。完整 Discord Bot 和 Telegram Bot 設定教學
bgImage: claude_code_channels_bg.jpg
preload:
  - claude_code_channels_bg.jpg
---

{% darrellImageCover claude_code_channels_bg claude_code_channels_bg.jpg max-800 %}

## 不在電腦旁，也想讓 Claude 幫忙做事？

用 Claude Code 一段時間後，蠻常遇到一個情境：
人不在電腦旁邊，但突然想到「啊那個 bug 可以先讓 Claude 去查一下」或是「幫我跑個指令看結果」

以前只能等回到電腦前才能動手
現在 Claude Code 推出了 **Channels** 功能，直接用手機的 Discord 或 Telegram 傳訊息給 Claude Code session
Claude 在電腦上執行完，結果回傳到手機

{% quickNav %}
[
  {"text": "Channels vs Remote Control", "anchor": "channels-vs-remote-control", "desc": "先搞清楚這兩個不一樣的東西"},
  {"text": "前置條件", "anchor": "before-you-start", "desc": "版本、帳號、Bun 安裝"},
  {"text": "Discord 設定", "anchor": "discord-setup", "desc": "9 步完成 Discord Bot 串接"},
  {"text": "Telegram 設定", "anchor": "telegram-setup", "desc": "5 步完成 Telegram Bot 串接"},
  {"text": "Discord vs Telegram", "anchor": "discord-vs-telegram", "desc": "該選哪個？功能差異比較"},
  {"text": "使用場景", "anchor": "use-cases", "desc": "實際可以怎麼用"},
  {"text": "常見問題", "anchor": "faq", "desc": "設定卡關看這邊"}
]
{% endquickNav %}

<h2 id="channels-vs-remote-control">先搞清楚：Channels 跟 Remote Control 不一樣</h2>

Claude Code 最近同時推出了 **Remote Control** 和 **Channels** 兩個功能，很容易搞混
簡單來說：

- **Remote Control** = 你的 session 的「遠端桌面」，從手機瀏覽器或 Claude App 連回電腦繼續操作
- **Channels** = 你的 session 的「訊息收件匣」，外部事件（Discord/Telegram 訊息）推進來觸發 Claude

{% dataTable style="minimal" align="left" highlight="3" %}
[
  {"比較項目": "本質", "Remote Control": "遠端操作同一個 session", "Channels": "外部訊息推入 session"},
  {"比較項目": "介面", "Remote Control": "claude.ai/code 網頁、Claude App", "Channels": "Discord Bot、Telegram Bot"},
  {"比較項目": "遠端核准權限", "Remote Control": "✅ 可以從手機按核准", "Channels": "❌ 必須回電腦才能核准"},
  {"比較項目": "接收外部事件", "Remote Control": "❌", "Channels": "✅ 事件驅動"},
  {"比較項目": "多人使用", "Remote Control": "❌ 綁定你的帳號", "Channels": "✅ 透過 allowlist 控制"},
  {"比較項目": "啟動方式", "Remote Control": "claude --remote-control", "Channels": "claude --channels plugin:..."},
  {"比較項目": "能同時開", "Remote Control": "✅", "Channels": "✅"}
]
{% enddataTable %}

{% callout tip %}
兩者可以同時使用！需要遠端核准操作用 Remote Control，想用 Discord/Telegram 聊天介面就用 Channels
{% endcallout %}

## 架構概念

先理解一下 Channels 在做什麼，其實概念很簡單：

```
手機 Discord/Telegram
        │
        ▼
   Discord/Telegram API
        │
        ▼
   Channel Plugin（跑在你的電腦上）
        │
        ▼
   Claude Code Session（你的電腦）
        │
        ▼
   執行操作（讀檔、改 code、跑指令...）
        │
        ▼
   結果回傳到 Discord/Telegram
```

Channel 本質上是一個 {% term def="讓 Claude Code 連接外部工具和服務的標準協議" %}MCP{% endterm %} server
只是多了 `--channels` 這個啟動參數來啟用

<h2 id="before-you-start">前置條件</h2>

{% dataTable style="minimal" align="left" %}
[
  {"項目": "Claude Code 版本", "說明": "v2.1.80 以上（終端機輸入 claude --version 確認）"},
  {"項目": "登入方式", "說明": "必須用 claude.ai 帳號登入（API key 不支援 Channels）"},
  {"項目": "Bun runtime", "說明": "Channel plugin 需要 Bun 來執行"},
  {"項目": "Team/Enterprise", "說明": "管理員需先到後台開啟 channelsEnabled 設定"}
]
{% enddataTable %}

### 安裝 Bun

如果還沒裝過 {% term def="一個比 Node.js 更快的 JavaScript 執行環境" %}Bun{% endterm %}，一行指令搞定：

```bash
curl -fsSL https://bun.sh/install | bash
```

裝完確認一下版本：

```bash
bun --version
```

<h2 id="discord-setup">Discord Channel 設定</h2>

Discord 的設定步驟比較多，但每一步都不難
如果你之前沒接觸過 Discord Bot，可以先參考
{% articleCard url="/send-push-to-me/" title="Line Notify 結束服務，轉移到 Slack、Telegram、Discord" previewText="Discord Webhook 的基本設定和使用方式" thumbnail="https://www.darrelltw.com/send-push-to-me/push_yourself_bg.jpg" %}

不過這次要建的是完整的 Bot（不是 Webhook），步驟會多一些

### 第一步：建立 Discord Application

1. 打開 [Discord Developer Portal](https://discord.com/developers/applications)
2. 點右上角 **New Application**
3. 取個名字（例如 `My Claude Bot`），點 Create

<!-- 截圖：Discord Developer Portal - New Application 畫面 -->
{% darrellImage800Alt "Discord Developer Portal 建立新 Application" discord_developer_portal_new_app.png max-800 %}

### 第二步：設定 Bot 的 Message Content Intent

這一步**超級重要**，很多人會漏掉

1. 左側選單點 **機器人**（Bot）
2. 往下捲到 **特權閘道器意圖**（Privileged Gateway Intents）
3. 把 **訊息內容意圖**（Message Content Intent）打開（開關切到藍色）

<!-- 截圖：Bot 頁面 - Message Content Intent 開關 -->
{% darrellImage800Alt "開啟 Message Content Intent 才能讓 Bot 讀取訊息內容" bot_message_content_intent.png max-800 %}

{% callout warning %}
不開這個的話，Bot 收到的訊息內容會是空的，什麼都看不到
{% endcallout %}

### 第三步：取得 Bot Token

1. 還是在 **機器人**（Bot）頁面，往上捲到 **Token** 區塊
2. 點 **Reset Token**（會要你確認）
3. 複製 Token

<!-- 截圖：Bot Token Reset 按鈕位置（記得遮蔽 Token） -->
{% darrellImage800Alt "點 Reset Token 取得 Bot Token，只會顯示一次" bot_token_reset.png max-800 %}

{% callout warning %}
Token 只會顯示一次，沒複製到就要再 Reset 重新產生
{% endcallout %}

### 第四步：邀請 Bot 進你的 Discord 伺服器

Discord 規定你必須跟 Bot 在同一個伺服器，才能私訊它

1. 左側選單點 **OAuth2** → **URL 產生器**（URL Generator）
2. 範圍（Scopes）勾選 **bot**
3. Bot Permissions（機器人權限）勾這些：
   - ✅ 檢視頻道（View Channels）— 在「一般權限」
   - ✅ 傳送訊息（Send Messages）— 在「文字權限」
   - ✅ 在討論串中傳送訊息（Send Messages in Threads）— 在「文字權限」
   - ✅ 讀取訊息歷史記錄（Read Message History）— 在「文字權限」
   - ✅ 附加檔案（Attach Files）— 在「文字權限」
   - ✅ 新增反應（Add Reactions）— 在「文字權限」
4. 整合類型（Integration type）選 **Guild Install**
5. 複製最下面的 **產生的 URL**（Generated URL）
6. 在瀏覽器開啟這個 URL → 選擇你的伺服器 → 授權

<!-- 截圖：OAuth2 URL Generator - Scopes 和 Permissions 勾選狀態 -->
{% darrellImage800Alt "OAuth2 URL Generator 設定 Bot 的權限範圍" oauth2_url_generator_permissions.png max-800 %}

### 第五步：在 Claude Code 安裝 Discord Plugin

回到終端機，開啟 Claude Code，執行：

```
/plugin install discord@claude-plugins-official
```

<!-- 截圖：Claude Code 終端 - plugin install 成功畫面 -->
{% darrellImage800Alt "Claude Code 安裝 Discord plugin 成功" cc_plugin_install_discord.png max-800 %}

### 第六步：設定 Bot Token

在同一個 Claude Code session 裡，貼上第三步複製的 Token：

```
/discord:configure 你的Token貼在這裡
```

這會把 Token 存到 `~/.claude/channels/discord/.env`

{% callout tip %}
也可以手動建立 `~/.claude/channels/discord/.env` 檔案，內容寫：
`DISCORD_BOT_TOKEN=你的Token`
{% endcallout %}

### 第七步：帶 Channel Flag 重新啟動

先退出 Claude Code（`/exit` 或 Ctrl+C），然後重新啟動：

```bash
claude --channels plugin:discord@claude-plugins-official
```

`--channels` 是關鍵，沒加的話 Bot 不會連線

<!-- 截圖：claude --channels 啟動畫面 -->
{% darrellImage800Alt "用 --channels flag 啟動 Claude Code 連接 Discord" cc_channels_startup.png max-800 %}

### 第八步：配對你的 Discord 帳號

1. 去 Discord，在伺服器成員列表找到你的 Bot，右鍵 → **Message**
2. 隨便傳一句話
3. Bot 會回覆一個**配對碼**（6 個字元）
4. 回到 Claude Code，輸入：

```
/discord:access pair 配對碼貼這裡
```

<!-- 截圖：Discord 私訊 Bot - 收到配對碼 -->
{% darrellImage800Alt "Bot 回覆配對碼，複製貼到 Claude Code 完成配對" discord_pairing_code.png max-800 %}

### 第九步：鎖定存取（建議）

配對完成後，建議把 Bot 切成 allowlist 模式
這樣其他人私訊你的 Bot 不會收到配對碼：

```
/discord:access policy allowlist
```

### 設定完成！實際使用看起來像這樣

<!-- 截圖：Discord 私訊 Bot - 實際對話，傳指令後 Claude 回覆結果 -->
{% darrellImage800Alt "透過 Discord 私訊讓 Claude Code 執行任務並回傳結果" discord_actual_usage.png max-800 %}

<h2 id="telegram-setup">Telegram Channel 設定</h2>

Telegram 的流程比 Discord 簡單很多，BotFather 一條龍搞定

### 第一步：建立 Telegram Bot

1. 在 Telegram 開啟 [@BotFather](https://t.me/BotFather)
2. 傳送 `/newbot`
3. BotFather 會問兩件事：
   - **Name**：Bot 的顯示名稱（隨便取，可以有空格）
   - **Username**：Bot 的帳號，必須以 `bot` 結尾（例如 `my_claude_bot`）
4. BotFather 會回覆 Token，長得像 `123456789:AAHfiqksKZ8...`
5. 複製整串（包括前面的數字和冒號）

<!-- 截圖：BotFather 對話 - /newbot 取得 Token -->
{% darrellImage800Alt "透過 BotFather 建立 Telegram Bot 並取得 Token" telegram_botfather_newbot.png max-800 %}

### 第二步：安裝 Plugin 和設定 Token

```
/plugin install telegram@claude-plugins-official
/telegram:configure 你的Token貼在這裡
```

### 第三步：帶 Channel Flag 重新啟動

```bash
claude --channels plugin:telegram@claude-plugins-official
```

### 第四步：配對帳號

1. 在 Telegram 找到你剛建的 Bot，傳一句話
2. Bot 回覆配對碼
3. 回到 Claude Code：

```
/telegram:access pair 配對碼
```

4. 鎖定存取：

```
/telegram:access policy allowlist
```

<!-- 截圖：Telegram Bot 對話 - 配對成功後的實際使用畫面 -->
{% darrellImage800Alt "Telegram Bot 配對完成後的實際對話畫面" telegram_actual_usage.png max-800 %}

### 同時用 Discord + Telegram

如果兩個都想用，啟動時用空格分隔就好：

```bash
claude --channels plugin:discord@claude-plugins-official plugin:telegram@claude-plugins-official
```

<h2 id="discord-vs-telegram">Discord vs Telegram，該選哪個？</h2>

兩個平台的 plugin 功能差異比想像中大，不只是「你習慣用哪個 App」這麼簡單

### 支援的工具不同

Discord 有 **5 個** MCP tools，Telegram 只有 **3 個**：

{% dataTable style="minimal" align="left" highlight="4,5" %}
[
  {"工具": "reply", "Discord": "✅", "Telegram": "✅", "說明": "回覆訊息，支援附件"},
  {"工具": "react", "Discord": "✅", "Telegram": "✅", "說明": "加 emoji 反應"},
  {"工具": "edit_message", "Discord": "✅", "Telegram": "✅", "說明": "編輯之前發的訊息"},
  {"工具": "fetch_messages", "Discord": "✅", "Telegram": "❌", "說明": "拉取最近 100 筆歷史訊息"},
  {"工具": "download_attachment", "Discord": "✅", "Telegram": "❌", "說明": "下載訊息中的附件"}
]
{% enddataTable %}

`fetch_messages` 是蠻關鍵的差異，代表 Discord 的 Claude 可以回顧之前的對話脈絡
Telegram 的 Bot 只能看到「即時收到的訊息」，之前聊過什麼它不知道

### 檔案和訊息限制

{% dataTable style="minimal" align="left" %}
[
  {"比較項目": "單檔大小上限", "Discord": "25 MB", "Telegram": "50 MB"},
  {"比較項目": "每則訊息檔案數", "Discord": "最多 10 個", "Telegram": "無限制（每檔獨立訊息）"},
  {"比較項目": "單則訊息字數", "Discord": "2,000 字元", "Telegram": "4,096 字元"},
  {"比較項目": "圖片品質", "Discord": "原始品質", "Telegram": "預設壓縮（要原圖需選「以檔案方式傳送」）"},
  {"比較項目": "Emoji 反應", "Discord": "所有 Unicode + 自訂 emoji", "Telegram": "只有固定白名單（👍❤🔥 等）"}
]
{% enddataTable %}

### 設定難度

Telegram 明顯簡單很多，跟 BotFather 對話就拿到 Token
Discord 需要進 Developer Portal 建 Application、開 Intent、設 OAuth2 權限

### 什麼情境選哪個？

{% dataTable style="minimal" align="left" %}
[
  {"你的需求": "需要 Claude 回顧之前的對話", "建議": "Discord（有 fetch_messages）"},
  {"你的需求": "傳大檔案（25-50MB）", "建議": "Telegram（50MB 上限）"},
  {"你的需求": "快速設定、個人使用", "建議": "Telegram（設定最簡單）"},
  {"你的需求": "團隊多人協作", "建議": "Discord（Server + Thread 支援完整）"},
  {"你的需求": "需要下載/處理附件", "建議": "Discord（有 download_attachment）"},
  {"你的需求": "兩個都想要", "建議": "啟動時同時加兩個 plugin 就好"}
]
{% enddataTable %}

<h2 id="use-cases">實際使用場景</h2>

設定完之後，到底日常可以怎麼用？以下是幾個蠻實際的場景

### 場景一：出門在外，想到要改個東西

人在外面，突然想到某個 config 要調整
直接用手機 Discord 傳：「幫我把 main.yml 裡的 per_page 從 10 改成 15」
Claude 在電腦上改完，回傳 diff 給你確認

### 場景二：跑長任務時去做別的事

讓 Claude 跑一個比較久的任務（例如整理大量檔案）
不用盯著螢幕等，做完它會在 Discord/Telegram 通知你結果

### 場景三：手機傳截圖讓 Claude 分析

直接在 Discord 貼一張截圖
Claude 會下載到電腦上分析，然後回覆你

{% callout info %}
附件不會自動下載到電腦，Claude 需要的時候才會呼叫 download_attachment
{% endcallout %}

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "Bot 沒有回覆配對碼怎麼辦？",
    "answer": "確認三件事：(1) Claude Code 是用 --channels 參數啟動的 (2) Bot 確實在線上（Developer Portal 的 Bot 頁面可以看狀態）(3) Discord 的話，確認你跟 Bot 在同一個伺服器"
  },
  {
    "question": "Token 不見了或想換一個？",
    "answer": "Discord：回 Developer Portal → Bot → Reset Token（會產生新的，舊的立刻失效）。Telegram：跟 BotFather 說 /token 查看，或 /revoke 重新產生"
  },
  {
    "question": "Claude 執行到一半需要確認權限怎麼辦？",
    "answer": "如果遇到權限確認提示，session 會暫停等你回到電腦手動同意。如果想完全無人值守，可以用 --dangerously-skip-permissions 啟動，但只建議在你信任的環境使用"
  },
  {
    "question": "我是 Team/Enterprise 用戶但 Channel 被停用？",
    "answer": "請管理員到 claude.ai → Admin settings → Claude Code → Channels 開啟 channelsEnabled"
  },
  {
    "question": "可以讓多個人都能傳訊息給同一個 Bot 嗎？",
    "answer": "可以，用 /discord:access pair 分別配對不同的 Discord 帳號就好。但建議搭配 allowlist 模式，只允許已配對的人使用"
  }
]
{% endfaq %}

## 相關文章

{% articleCard url="/claude-code-new-command-line-tool/" title="Claude Code 發佈 Command Line 的新工具" previewText="Claude Code 完整介紹，包含價格方案、安裝教學和指令介紹" thumbnail="https://www.darrelltw.com/claude-code-new-command-line-tool/claude_code.jpg" %}

{% articleCard url="/claude-code-agent/" title="Claude Code Agent 實測，建立專屬的開發助理" previewText="用 Agent 功能建立可重複使用的開發助理" thumbnail="https://www.darrelltw.com/claude-code-agent/claude_code_agent-bg.jpg" %}

{% articleCard url="/send-push-to-me/" title="Line Notify 結束服務，轉移到 Slack、Telegram、Discord" previewText="Discord Webhook 和 Telegram Bot 的基本設定方式" thumbnail="https://www.darrelltw.com/send-push-to-me/push_yourself_bg.jpg" %}
