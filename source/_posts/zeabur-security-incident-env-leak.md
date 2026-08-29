---
title: Zeabur 資安事件：環境變數外洩後，怎麼確認災情與輪替密碼
tags:
  - Zeabur
  - 資安
categories:
  - Code Development
page_type: post
id: zeabur-security-incident-env-leak
description: Zeabur 2026 年 8 月資安事件（環境變數外洩）處理紀錄：官方確認外洩的變數清單、沒收到通知信要怎麼自己確認、用 Zeabur CLI 盤點環境變數與引用鏈、第三方 API Key 的正確撤銷順序，以及 PostgreSQL 密碼輪替時官方指南少了 -d 參數會失敗的修正做法
bgImage: blog-zeabur-security-incident-env-leak-bg.jpg
date: 2026-08-29 22:25:30
---

{% darrellImageCover zeabur-security-incident-env-leak-bg blog-zeabur-security-incident-env-leak-bg.jpg %}

{% callout type="warning" title="重點摘要" %}
**Zeabur 平台端被入侵，攻擊者拿到專案的環境變數紀錄**
- 官方已實際觀察到 Anthropic、OpenAI、OpenRouter 的 API 憑證被盜用
- 建一把新 Key 不會讓舊的失效，**一定要另外執行撤銷**
- 改 Zeabur 上的 `POSTGRES_PASSWORD` 變數，**不等於**改掉資料庫真正的密碼
- 通知信分兩批寄、判定條件不同，沒收到信不代表沒事
{% endcallout %}

{% quickNav %}
[
  {"text": "外洩了什麼", "anchor": "what-happened", "desc": "官方確認的變數清單"},
  {"text": "沒收到信不代表沒事", "anchor": "am-i-affected", "desc": "通知分兩批寄"},
  {"text": "盤點環境變數", "anchor": "inventory", "desc": "用 CLI 全撈一次"},
  {"text": "第三方 API Key 怎麼撤", "anchor": "revoke-api-key", "desc": "撤銷才算數"},
  {"text": "資料庫密碼輪替", "anchor": "rotate-db-password", "desc": "最容易做錯的一步"},
  {"text": "常見問題", "anchor": "faq", "desc": "FAQ"}
]
{% endquickNav %}

{% timeline title="時間軸" %}
[
  {"date": "8/27", "text": "Zeabur 偵測到**一組內部服務憑證遭到未授權存取**"},
  {"date": "8/28", "text": "在社群上有看到部分貼文反應收到 Zeabur 信件表示 API Key 等等相關回報"},
  {"date": "8/29", "text": "凌晨一點多，我也收到 Zeabur 寄來的「[安全事件更新] 請輪替新增確認受影響的環境變數」"}
]
{% endtimeline %}

也因此把 Zeabur 專案中的相關 ENV 環境變數重新做一次 rotate
萬幸這次沒有什麼 AI API Key 遭到盜用，還沒觀察到什麼實際的損失

但 ENV 整個外流是非常嚴重且麻煩的
除了 API Key 需要逐一輪替更換以外
也要擔心其他例如密碼等等是否可能會有 DB 被連線 dump 出去的問題

<h2 id="what-happened">這次到底外洩了什麼</h2>

攻擊者拿那組內部憑證去取得部分使用者專案的環境變數紀錄

後續官方對媒體證實的一句話最重：已經實際觀察到 **Anthropic、OpenAI、OpenRouter 的 API 憑證遭到盜用**
不是「可能外洩」，是真的有人拿去用

官方列出確認曝露的變數名稱：

```
ACCESS_TOKEN          API_SECRET            AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY CF_API_TOKEN          CLIENT_SECRET
CLOUDFLARE_API_TOKEN  DIGITALOCEAN_TOKEN    GEMINI_API_KEY
GITHUB_PAT            GITHUB_TOKEN          GOOGLE_API_KEY
LINODE_TOKEN          PRIVATE_KEY           STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY     ANTHROPIC_API_KEY     OPENROUTER_API_KEY
OPENAI_API_KEY        DATABASE_URL          JWT_SECRET
MONGODB_URI           MYSQL_PASSWORD        POSTGRES_PASSWORD
REDIS_PASSWORD        SECRET_KEY
```


另外 Zeabur 在調查期間發現 AI Hub 用的 LiteLLM 出現可疑活動
目前 AI Hub 服務已經暫停

{% callout type="info" %}
帳號密碼、個資、付款與信用卡資訊，官方表示沒有被存取的跡象
{% endcallout %}

<h2 id="am-i-affected">沒收到信不是沒事</h2>

通知分成兩批寄，兩批的判定方式不一樣
信裡自己也寫了「無論您是否收到先前的事件通知」

我這邊的實際狀況是：**兩個 Google 帳號只有其中一個收到**
有多組 Zeabur 帳號的人可能要特別注意
只查常用信箱會漏掉，也建議先把其他帳號有相關專案或是 ENV 先輪替掉


<h2 id="inventory">盤點環境變數</h2>

可以在 Zeabur 網頁逐一檢查
如果你會用 Claude Code 等 CLI 工具
可以用 Zeabur CLI 直接幫你排查

```bash
npx zeabur@latest variable list --id <SERVICE_ID> -i=false --json
```

用 postgres 模板來示範：

```
postgresql 服務的 PASSWORD   
  └─ postgresql.POSTGRES_PASSWORD = ${PASSWORD}
       ├─ n8n.DB_POSTGRESDB_PASSWORD     = ${POSTGRES_PASSWORD}
       └─ n8n-ost.DB_POSTGRESDB_PASSWORD = ${POSTGRES_PASSWORD}
```

雖然是 `POSTGRES_PASSWORD` 外流，但其實要改的是 `PASSWORD`
因為 `POSTGRES_PASSWORD` 是引用 `PASSWORD` 的


<h2 id="revoke-api-key">第三方 API Key：需要直接撤銷重新產生</h2>

這是官方特別提醒、也最容易沒做完整的一步

**建立一把新的 API Key，不會讓舊的失效**
舊 Key 沒有被撤銷之前，它一直都是可以用的

正確順序是四步，不要跳：

1. 到第三方後台**建新 Key**
2. 把新 Key 換到 Zeabur 變數上，重啟服務確認能跑
3. 回廠商後台**撤銷舊 Key**（Revoke / Delete，不是只是改名）
4. 查**log 或是 Usage 和帳單**，看撤銷之前有沒有被拿去用

各家的 Key 管理頁，以及查有沒有被盜用要看哪一頁：

{% dataTable style="minimal" align="left" %}
[
  {
    "服務": "OpenAI",
    "Key 管理頁": "platform.openai.com/api-keys",
    "查有沒有被盜用": "platform.openai.com/logs 看逐筆 API 呼叫紀錄"
  },
  {
    "服務": "Claude",
    "Key 管理頁": "platform.claude.com/settings/workspaces/default/keys",
    "查有沒有被盜用": "同一個後台的 Usage 與 Cost 頁"
  },
  {
    "服務": "OpenRouter",
    "Key 管理頁": "openrouter.ai/settings/keys",
    "查有沒有被盜用": "Activity 頁的呼叫紀錄"
  }
]
{% enddataTable %}

OpenAI 的 `/logs` 比較好用
可以看到完整的時間、模型、來源等等

目前查看來都是我平時的排程和自動化產生的紀錄
並沒有特別有其他意外的發現

<h2 id="rotate-db-password">資料庫密碼：改環境變數不等於改密碼</h2>

按照官方給的 Rotate Key 文件
不是只更新 ENV 的值而已
而是需要另外再用 `command` 去更新 DB 裡面使用的密碼
否則重新啟動服務後，會有錯誤的情況發生

### 官方那份輪替指南需要注意

Zeabur 把一份輪替指南掛在事件通知上，PostgreSQL 那行長這樣：

```sql
psql -U root -c "ALTER USER postgres WITH PASSWORD '<新密碼>';"
```

三個地方會出事：

{% dataTable style="minimal" align="left" %}
[
  {
    "問題": "ALTER USER postgres 把角色名寫死",
    "後果": "Zeabur 的 postgres 模板通常沒有 postgres 這個角色，回 role \"postgres\" does not exist"
  },
  {
    "問題": "-U root 把使用者寫死",
    "後果": "Odoo 這類模板的使用者是 odoo-admin，這行直接連不上"
  },
  {
    "問題": "沒有 -d",
    "後果": "psql 預設會連「跟使用者同名的資料庫」，而那個資料庫不存在"
  }
]
{% enddataTable %}

如果 指令少了 -d
會有個錯誤是「資料庫 root 不存在」
一般人看到會往角色跟權限的方向找，很難聯想到是預設資料庫的問題

不用管自己的 Username 是什麼，可以用一個比較通用的指令

```bash
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "ALTER USER CURRENT_USER WITH PASSWORD '<新密碼>';"
```

`$POSTGRES_USER` 跟 `$POSTGRES_DB` 是容器本來就帶的環境變數，`CURRENT_USER` 自動對應目前連線的身分
想先確認自己的使用者是誰，最快是去環境變數分頁點開 `POSTGRES_USER` 的眼睛圖示

{% darrellImage800Alt "Zeabur 環境變數分頁，標示點開 POSTGRES_USER 右側的眼睛圖示就能看到資料庫使用者帳號" zeabur_env_check_postgres_user.png max-800 %}

### 如何在 Zeabur 網頁版走一次輪替

輪替做完之後，我自己用網頁介面重新走一次流程
在「環境變數 → 編輯原始環境變數」把 `PASSWORD` 改成新值，然後就以為做完了

{% darrellImage800Alt "Zeabur 編輯變數彈窗，紅框標出 PASSWORD 的值欄位並註明換成新的，右下角是儲存按鈕" zeabur_env_password_edit_modal.png max-800 %}

存檔完回到服務狀態頁，狀態是運作中 1/1
這一頁右下角那張寫著「指令」的卡片，就是等一下要用的容器終端機入口

{% darrellImage800Alt "Zeabur postgresql 服務的服務狀態頁，狀態顯示運作中 1/1，右下角三張卡片依序是檔案、記錄、指令，其中「指令」被標號 1，那就是容器終端機的入口" zeabur_service_terminal_entry.png max-800 %}

麻煩的是**當下服務完全正常**
健康檢查回 200、log 乾淨、workflow 照跑

因為 n8n 從改變數之後就沒重啟過，目前的舊連線還是對的
這是一顆定時炸彈，下一次重啟才會炸掉噴 Error

這時候按下「全部重啟」就是直接引爆

{% darrellImage800Alt "Zeabur 專案設定的批次動作區塊，有全部暫停與全部重啟兩個按鈕" zeabur_batch_restart_all_services.png max-800 %}

所以順序要反過來
先進容器把資料庫裡面的密碼也改掉，再回來重啟

{% darrellImage800Alt "psql 執行 ALTER USER 成功的終端機畫面，上方三行是 collation version mismatch 的 WARNING、DETAIL、HINT，最下面一行 ALTER ROLE 才是真正的執行結果" zeabur_psql_alter_role_success.png max-800 %}

上面那三行 WARNING、DETAIL、HINT 看起來很像出錯，其實每次連線都會出現，跟密碼一點關係都沒有
真正的結果是最下面那行 `ALTER ROLE`
psql 成功的時候就只回一行 `ALTER ROLE`，不會跟你說「成功」

改完密碼回到 n8n 服務按「重新啟動」：

{% darrellImage800Alt "Zeabur n8n 服務狀態頁面，箭頭指向左下角的重新啟動按鈕" zeabur_service_restart_button.png max-800 %}

重啟之後大約 1~2 分鐘，資料庫端也看得到重啟後才建立的新連線


<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "我沒收到 Zeabur 的通知信，是不是就沒事？",
    "answer": "不一定<br>通知分兩批寄、判定條件不同，信裡自己也寫「無論您是否收到先前的事件通知」<br>建議現在就先查詢自己在 Zeabur 上是否有部署服務，跟是否有填入 API Key 在環境變數中"
  },
  {
    "question": "我建了新的 API Key，舊的會自動失效嗎？",
    "answer": "不會<br>一定要另外到廠商後台執行撤銷（Revoke / Delete）<br>順序建議是：建新 Key → 換上去確認服務正常 → 再撤銷舊的"
  },
  {
    "question": "Zeabur AI Hub 還能用嗎？",
    "answer": "官方在調查期間發現 AI Hub 使用的 LiteLLM 有可疑活動，已經先暫停服務<br>如果你的 workflow 有串 AI Hub，要先準備替代的模型來源"
  }
]
{% endfaq %}

## 相關文章推薦

{% articleCard url="/n8n-security-vulnerability-2025/" title="n8n 資安漏洞 CVE-2025-68613 快點來更新你的 n8n 版本！" previewText="上一次的 n8n 資安事件，含 Zeabur 平台的版本更新步驟" thumbnail="https://www.darrelltw.com/n8n-security-vulnerability-2025/n8n-security-vulnerability-2025-bg.jpg" %}

{% articleCard url="/n8n-deployment/" title="n8n 安裝部署與更新教學：Cloud、Zeabur、Docker 比較" previewText="各種部署方案的比較，也包含自架要自己扛哪些事" thumbnail="https://www.darrelltw.com/n8n-deployment/blog-n8n-deployment-bg.jpg" %}

{% articleCard url="/n8n-zeabur-ai-hub-model-router/" title="n8n AI 模型 Router 教學：Zeabur AI Hub 智慧切換模型" previewText="這次事件中被暫停的 AI Hub，之前寫過的用法介紹" thumbnail="https://www.darrelltw.com/n8n-zeabur-ai-hub-model-router/n8n-zeabur-ai-hub-model-router-bg.jpg" %}

## 參考來源

- [Zeabur 官方事件公告：Unauthorized Access to Project Environment Variable Data](https://status.zeabur.com/incident/1037896)
