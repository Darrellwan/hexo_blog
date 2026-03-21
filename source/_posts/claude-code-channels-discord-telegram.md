---
title: Claude Code Channels 設定教學，用 Discord、Telegram 遠端使用 Claude Code
date: 2026-03-20 12:56:55
tags:
  - Claude Code
  - AI
  - 開發工具
  - Discord
  - Telegram
categories:
  - Claude
page_type: post
id: claude-code-channels-discord-telegram
description: Claude Code Channels 讓你從手機 Discord 或 Telegram 傳訊息給正在跑的 Claude Code，不用坐在電腦前也能讓 AI 幫你改 code、跑指令。完整 Discord Bot 和 Telegram Bot 設定教學和幾個場景測試
bgImage: claude_code_channels_bg.jpg
preload:
  - claude_code_channels_bg.jpg
---

{% darrellImageCover claude_code_channels_bg claude_code_channels_bg.jpg max-800 %}

## 不在電腦旁，也想讓 Claude 幫忙做事？

用 Claude Code 一段時間後，蠻常遇到一個情境：
人在外面，突然想到「啊那個 bug 可以先讓 Claude 去查一下」，但電腦在家裡，只能乾等回去再說

以前只能等回到電腦前才能動手
現在 Claude Code 推出了 **Channels** 功能，直接用手機的 Discord 或 Telegram 傳訊息給 Claude Code session
Claude 在電腦上執行完，結果回傳到手機

{% quickNav %}
[
  {"text": "Channels vs Remote Control", "anchor": "channels-vs-remote-control", "desc": "先搞清楚這兩個不一樣的東西"},
  {"text": "前置條件", "anchor": "before-you-start", "desc": "版本、帳號、Bun 安裝"},
  {"text": "Discord 設定", "anchor": "discord-setup", "desc": "8 步完成 Discord Bot 串接"},
  {"text": "Telegram 設定", "anchor": "telegram-setup", "desc": "5 步完成 Telegram Bot 串接"},
  {"text": "Discord vs Telegram", "anchor": "discord-vs-telegram", "desc": "該選哪個？功能差異比較"},
  {"text": "使用場景", "anchor": "use-cases", "desc": "實際可以怎麼用"},
  {"text": "常見問題", "anchor": "faq", "desc": "設定卡關看這邊"}
]
{% endquickNav %}

<h2 id="channels-vs-remote-control">先搞清楚：Channels 跟 Remote Control 不一樣</h2>

Claude Code 最近同時推出了 **Remote Control** 和 **Channels** 兩個功能，很容易搞混
簡單來說：

- **Remote Control** = 遠端桌面，從手機瀏覽器或 Claude App 連回電腦繼續操作
- **Channels** = 訊息收件匣，Discord/Telegram 訊息從外面推進來觸發 Claude

{% dataTable style="minimal" align="left" highlight="3" %}
[
  {"比較項目": "本質", "Remote Control": "遠端操作同一個 session", "Channels": "外部訊息推入 session"},
  {"比較項目": "介面", "Remote Control": "claude.ai/code 網頁、Claude App", "Channels": "Discord Bot、Telegram Bot"},
  {"比較項目": "遠端核准權限", "Remote Control": "✅ 可以從手機按核准", "Channels": "❌ 必須回電腦才能核准"},
  {"比較項目": "接收外部事件", "Remote Control": "❌", "Channels": "✅"},
  {"比較項目": "多人使用", "Remote Control": "❌ 綁定你的帳號", "Channels": "✅ 可以透過 allowlist 控制"},
  {"比較項目": "啟動方式", "Remote Control": "claude --remote-control", "Channels": "claude --channels plugin:..."}
]
{% enddataTable %}


Channel 本質上是一個 {% term def="讓 Claude Code 連接外部工具和服務的標準協議" %}MCP{% endterm %} server
多了 `--channels` 這個啟動參數來啟用

<h2 id="before-you-start">前置條件</h2>

{% dataTable style="minimal" align="left" %}
[
  {"項目": "Claude Code 版本", "說明": "v2.1.80 以上（可用 /status 查詢）"},
  {"項目": "登入方式", "說明": "目前必須用 claude.ai 帳號登入（API key 不支援 Channels）"},
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

這次要建的是完整的 DiscordBot，步驟會比 Webhook 還要複雜一點！

### 第一步：建立 Discord 應用程式

1. 打開 [Discord Developer Portal](https://discord.com/developers/applications)
2. 點右上角 **新增應用程式(New Application)**
3. 取個名字（例如 `My Claude Bot`），點 Create

<!-- 截圖：Discord Developer Portal - New Application 畫面 -->
{% darrellImage800Alt "Discord Developer Portal 建立新 Application" discord_developer_portal_new_app.png max-800 %}

### 第二步：設定 Bot 權限和 Message Content Intent

1. 左側選單點 **機器人**（Bot）
2. 往下捲到**機器人權限**，勾選這些：
   - 檢視頻道（View Channels）— 在「一般權限」
   - 傳送訊息（Send Messages）— 在「文字權限」
   - 在討論串中傳送訊息（Send Messages in Threads）— 在「文字權限」
   - 讀取訊息歷史記錄（Read Message History）— 在「文字權限」
   - 附加檔案（Attach Files）— 在「文字權限」
   - 新增反應（Add Reactions）— 在「文字權限」

{% darrellImage800Alt "在機器人頁面勾選需要的權限" bot_permissions.png max-800 %}

3. 再往下把 **Message Content Intent** 打開

{% darrellImage800Alt "開啟 Message Content Intent 才能讓 Bot 讀取訊息內容" bot_message_content_intent.png max-800 %}

{% callout warning %}
Message Content Intent **超級重要**，很多人會漏掉。不開的話，Bot 收到的訊息內容會是空的
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

1. 左側選單點 **安裝**（Installation）
2. 確認「公會安裝」（就是伺服器安裝）有勾選，範圍選 **bot**
3. 這邊下面也需要確認權限，沒有的話再選一次那六個權限
4. 複製「安裝連結」的 URL
5. 在瀏覽器開啟 → 選「**新增至伺服器**」→ 選擇你的伺服器 → **授權**

<!-- 截圖：安裝頁面 - 完整設定流程（有標號） -->
{% darrellImage800Alt "安裝頁面設定：①勾選公會安裝 ②範圍選 bot ③確認權限 ④複製安裝連結" installation_page.png max-800 %}

開啟安裝連結後，選「**新增至伺服器**」

{% darrellImage800Alt "選擇新增至伺服器，不是新增至我的應用程式" discord_invite_choose.png max-800 %}

選擇你的伺服器，確認權限後按**授權**

{% darrellImage800Alt "選擇伺服器並確認 Bot 需要的權限" discord_invite_server.png max-800 %}

{% darrellImage800Alt "確認六個權限都有勾選，按授權完成" discord_invite_permissions.png max-800 %}

### 第五步：在 Claude Code 安裝 Discord Plugin

回到 Terminal(終端機)，開啟 Claude Code。

```
claude plugin marketplace add claude-plugins-official anthropics/claude-plugins-official
```

加完後安裝 Discord plugin：

```
claude plugin install discord@claude-plugins-official
```

{% callout error %}
如果你跟我一樣也沒有 `claude-plugins-official`
顯示錯誤訊息
```
Plugin "fakechat" not found in any marketplace
Plugin "discord" not found in any marketplace
```
那就要先安裝這個 marketplace
目前會缺少這個 marketplace 的原因未知，可能是我很久以前就開始用
{% endcallout %}


<!-- 截圖：Claude Code - plugin 安裝流程 -->
{% darrellImage800Alt "先加入 marketplace 再安裝 Discord plugin" cc_plugin_install_marketplace.png max-800 %}

### 第六步：設定 Bot Token

在同一個 Claude Code session 裡，貼上第三步複製的 Token：

```
/discord:configure 你的Token貼在這裡
```

這會把 Token 存到 `~/.claude/channels/discord/.env`


### 第七步：帶 --Channel 重新啟動

先退出 Claude Code（`/exit` 或 Ctrl+C），然後重新啟動：

```bash
claude --channels plugin:discord@claude-plugins-official
```

`--channels` 是關鍵，沒加的話 Bot 不會連線

<!-- 截圖：claude --channels 啟動畫面 -->
{% darrellImage800Alt "用 --channels flag 啟動 Claude Code 連接 Discord" cc_channels_startup.png max-800 %}

### 第八步：配對你的 Discord

1. 去 Discord，在伺服器成員列表找到你的 Bot，右鍵 → **Message**
2. 隨便傳一句話
3. Bot 會回覆一個**配對碼**（6 個字元）
4. 回到 Claude Code，輸入：

```
/discord:access pair 配對碼貼這裡
```

<!-- 截圖：Discord 私訊 Bot - 收到配對碼 -->
{% darrellImage800Alt "Bot 回覆配對碼，複製貼到 Claude Code 完成配對" discord_pairing_code.png max-800 %}

### 第九步：鎖定 Allowlist（建議）

配對完成後，建議把 Bot 切成 allowlist 模式
這樣其他人私訊你的 Bot 不會收到配對碼：

```
/discord:access policy allowlist
```

{% darrellImage800Alt "設定 allowlist 後只有已配對的帳號能使用 Bot" discord_access_allowlist.png max-800 %}

### 設定完成！

<!-- 截圖：Discord 私訊 Bot - 實際對話，傳指令後 Claude 回覆結果 -->
{% darrellImage800Alt "透過 Discord 私訊讓 Claude Code 執行任務並回傳結果" discord_actual_usage.png max-800 %}

<h2 id="telegram-setup">Telegram Channel 設定</h2>

Telegram 的流程比 Discord 簡單很多，BotFather 一條龍搞定

### 第一步：建立 Telegram Bot

1. 在 Telegram 開啟 [@BotFather](https://t.me/BotFather)
2. 傳送 `/newbot`
3. BotFather 會問：
   - **Name**：Bot 的顯示名稱（隨便取，可以有空格）
   - **Username**：Bot 的帳號，必須以 `bot` 結尾（例如 `my_claude_bot`）
4. BotFather 會回覆 Token，長得像 `123456789:AAHfiqksKZ8...`
5. 複製整串（包括前面的數字和冒號）

<!-- 截圖：BotFather 對話 - /newbot -->
{% darrellImage800Alt "在 BotFather 輸入 /newbot 開始建立 Bot" telegram_botfather_newbot.png max-800 %}

<!-- 截圖：BotFather 回覆 Token -->
{% darrellImage800Alt "BotFather 回覆 Token，複製紅框標示的那段" telegram_botfather_token.png max-800 %}

### 第二步：安裝 Plugin 和設定 Token

如果你之前設定 Discord 時已經加過 marketplace 就不用再加，直接安裝：

```
claude plugin install telegram@claude-plugins-official
```

設定 Token：

```
/telegram:configure 你的Token貼在這裡
```

<!-- 截圖：Claude Code 安裝 Telegram plugin + configure -->
{% darrellImage800Alt "安裝 Telegram plugin 並設定 Token" cc_telegram_plugin_setup.png max-800 %}

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

<!-- 截圖：Telegram 配對碼 -->
{% darrellImage800Alt "Telegram Bot 回覆配對碼，複製到 Claude Code 完成配對" telegram_pairing_code.png max-800 %}

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
  {"工具": "reply", "Discord": "✅", "Telegram": "✅", "說明": "回覆訊息"},
  {"工具": "react", "Discord": "✅", "Telegram": "✅", "說明": "emoji 反應"},
  {"工具": "edit_message", "Discord": "✅", "Telegram": "✅", "說明": "編輯之前發的訊息"},
  {"工具": "fetch_messages", "Discord": "✅", "Telegram": "❌", "說明": "讀取最近 100 筆歷史訊息"},
  {"工具": "download_attachment", "Discord": "✅", "Telegram": "❌", "說明": "下載附件(PDF 等等，圖片兩者都ok)"}
]
{% enddataTable %}

`fetch_messages` 目前還測試不出用途在哪，因為兩者都有自己的記憶。
除非是新的 Session 連線後，他需要往前讀起歷史紀錄來回想。

### 檔案和訊息限制

{% dataTable style="minimal" align="left" %}
[
  {"比較項目": "單檔大小上限", "Discord": "25 MB", "Telegram": "50 MB"},
  {"比較項目": "每則訊息檔案數", "Discord": "最多 10 個", "Telegram": "無限制"},
  {"比較項目": "單則訊息字數", "Discord": "2,000 字元", "Telegram": "4,096 字元"},
  {"比較項目": "圖片品質", "Discord": "原始品質", "Telegram": "預設壓縮（要原圖需選「以檔案方式傳送」）"},
  {"比較項目": "Emoji", "Discord": "所有 Unicode + 自訂 emoji", "Telegram": "只有固定一些"}
]
{% enddataTable %}

### 設定難度

Telegram 設定真的簡單到有點感動，跟 BotFather 聊兩句就拿到 Token
Discord 就...要進 Developer Portal 建 Application、開 Intent、設權限，步驟蠻多的但照著做不會出錯

### 什麼情境選哪個？

我覺得就看個人習慣哪個聊天平台即可！
當然也建議可以兩者都試試看，目前看起來 Discord 功能比較完整沒錯
Telegram 就稍微單調一點(但安裝真的簡單很多)

<h2 id="use-cases">實際使用場景</h2>

設定完之後，到底可以怎麼用？以下是自己實測的幾個場景

### 用 Discord 問明天天氣

直接在手機 Discord 傳「明天台北每小時的降雨機率多少」
Claude 自己去查氣象資料，整理成表格回覆

{% darrellImage800Alt "透過 Discord 問天氣，Claude 自動查詢並回覆降雨機率表格" discord_actual_usage.png max-800 %}

電腦端的 Claude Code 會顯示完整的執行過程，可以看到它怎麼找資料的

{% darrellImage800Alt "Claude Code 端顯示完整的查詢和回覆過程" cc_channels_execution.png max-800 %}

### 用 Telegram 幫忙整理信箱

傳一句「今天信箱有什麼促銷信看起來很吸引人的」
Claude 去讀信箱，整理出重點回覆到 Telegram

{% darrellImage800Alt "透過 Telegram 請 Claude 整理今天的促銷信" telegram_actual_usage.png max-800 %}

### 人在外，遠端臨時改簡報

這應該是蠻多人很需要的一個需求
人在外面通勤時突然有靈感或是需要調整簡報內容
直接在 Discord 跟 Claude 說「幫我傳 XX 簡報給我」，收到檔案確認內容後
再說「第七頁不需要 XX，幫我刪掉」，改完直接再傳回最新檔案

如果有串聯 Google 相關服務或是 CLI，還能直接上傳到 Google Drive 或是寄信給對方！

{% darrellImage800Alt "透過 Discord 遠端請 Claude 修改 PPTX 簡報內容" discord_pptx_remote_edit.png max-800 %}

### 傳 PDF 讓 Claude 分析

在 Discord 直接丟一個 PDF 檔案，問「這 PDF 在說什麼」
Claude 會下載附件分析內容回覆

{% darrellImage800Alt "Discord 可以直接傳 PDF 讓 Claude 下載分析" discord_pdf_success.png max-800 %}

{% callout warning %}
同樣的操作在 Telegram 會失敗，因為 Telegram plugin 沒有 `download_attachment` 這個 tool。這也是 Discord 和 Telegram 最大的功能差異之一
{% endcallout %}

{% darrellImage800Alt "Telegram 傳 PDF 時 Claude 無法下載附件" telegram_pdf_fail.png max-800 %}

### 測試 Claude 幫訊息按讚

兩邊都支援 `react` tool，可以請 Claude 對訊息加 emoji 反應

{% darrellImage800Alt "Discord 的 react emoji 效果" discord_react_emoji.png max-800 %}

{% darrellImage800Alt "Telegram 的 react emoji 效果" telegram_react_emoji.png max-800 %}

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "這功能要付費嗎？",
    "answer": "Channels 功能本身不用收費，Pro（$20/月）和 Max 訂閱方案都能用。Discord Bot 和 Telegram Bot 的建立也都免費。Team/Enterprise 方案需要管理員先開啟才能使用"
  },
  {
    "question": "每次都要打那一長串 --channels 指令嗎？",
    "answer": "對，每次啟動都要加 --channels 參數。可以在 shell 設定一個 alias 省事，例如 alias cc-discord='claude --channels plugin:discord@claude-plugins-official'"
  }
]
{% endfaq %}

### 已知限制

目前多個 Bot 之間無法互相溝通。每個 Bot 是獨立的 Claude Code Session。
Discord plugin 的程式碼裡直接忽略所有 Bot 發的訊息（`if (msg.author.bot) return`），
所以即使把多個 Bot 放在同一個 Discord channel，它們也不能互相討論，只會各自回答你的訊息

## 相關文章

{% articleCard url="/claude-code-new-command-line-tool/" title="Claude Code 發佈 Command Line 的新工具" previewText="Claude Code 完整介紹，包含價格方案、安裝教學和指令介紹" thumbnail="https://www.darrelltw.com/claude-code-new-command-line-tool/claude_code.jpg" %}

{% articleCard url="/claude-code-agent/" title="Claude Code Agent 實測，建立專屬的開發助理" previewText="用 Agent 功能建立可重複使用的開發助理" thumbnail="https://www.darrelltw.com/claude-code-agent/claude_code_agent-bg.jpg" %}

{% articleCard url="/send-push-to-me/" title="Line Notify 結束服務，轉移到 Slack、Telegram、Discord" previewText="Discord Webhook 和 Telegram Bot 的基本設定方式" thumbnail="https://www.darrelltw.com/send-push-to-me/push_yourself_bg.jpg" %}
