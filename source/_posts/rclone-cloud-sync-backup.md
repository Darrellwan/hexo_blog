---
title: rclone - 雲端同步與檔案備份的瑞士刀 搭配 Claude Code 超好用
tags:
  - rclone
  - 雲端備份
  - 檔案同步
categories:
  - 工具教學
page_type: post
id: rclone-cloud-sync-backup
description: rclone 實測教學：Google Drive 和 Cloudflare R2 設定、copy/sync/move 指令差異比較、rclone.conf 設定檔解析，以及用 crontab 做每日自動雲端備份。
bgImage: rclone-cloud-sync-backup-bg.jpg
date: 2026-03-03 21:19:28
---

{% darrellImageCover rclone_cover rclone-cloud-sync-backup-bg.jpg max-800 %}

現代人很常會同時使用這些線上的儲存服務：Google Drive、OneDrive、Dropbox，或是公司會用 {% term def="Amazon 的雲端儲存服務，很多公司拿來放檔案或網站資源" %}AWS S3{% endterm %}

那這些儲存空間的管理就會變成一個麻煩，我們可能要各自登入這些服務的網頁，然後下載再上傳等等。

現在 AI 的時代，除了 ChatGPT 可以快速幫我們回答問題以外，也會開始有人使用像是 Claude Code、Codex 等等這種 CLI 工具。
這類工具最強大的地方是可以直接管理電腦的檔案。

如果我們今天想要讓 AI 幫忙處理電腦的檔案和 Google Drive 這種線上服務同步，那 **rclone** 就能幫上忙！

{% quickNav %}
[
  {"text": "安裝設定", "anchor": "installation", "desc": "三平台安裝 + Google Drive 設定"},
  {"text": "核心指令", "anchor": "core-commands", "desc": "copy/sync/move 差異比較"},
  {"text": "常用場景", "anchor": "use-cases", "desc": "備份排程與多雲同步"},
  {"text": "FAQ", "anchor": "faq", "desc": "常見問題解答"}
]
{% endquickNav %}

## rclone 是什麼

rclone 是一個開源的 {% term def="在終端機執行的程式，不需要圖形介面" %}CLI 工具{% endterm %}，用 Go 語言寫成。你可以把它想像成「雲端版的 {% term def="Linux/macOS 內建的檔案同步工具，常用於本地或 SSH 連線的備份" %}rsync{% endterm %}」，或是雲端儲存的瑞士刀。

**支援的服務超過 70 種**，包括：
- Google Drive、OneDrive、Dropbox
- AWS S3、Azure Blob、Google Cloud Storage
- {% term def="透過 SSH 加密的檔案傳輸協定" %}SFTP{% endterm %}、{% term def="傳統的檔案傳輸協定，沒有加密" %}FTP{% endterm %}、{% term def="透過網頁協定存取檔案的方式，像 NAS 常用" %}WebDAV{% endterm %}
- ...還有更多

核心功能有四個：**複製、同步、搬移、掛載**。
通常複製和搬移很常使用，同步的話要小心可能會刪除檔案

{% darrellImage800Alt "rclone 透過 CLI 連接多種雲端儲存服務" rclone_concept_overview.jpg max-800 %}

<h2 id="installation">安裝與設定</h2>

### 安裝

常見的三個作業系統都支援：

{% dataTable style="minimal" align="left" %}
[
  {"系統": "macOS", "安裝指令": "`brew install rclone`"},
  {"系統": "Linux", "安裝指令": "`curl https://rclone.org/install.sh | sudo bash`"},
  {"系統": "Windows", "安裝指令": "`winget install Rclone.Rclone`"}
]
{% enddataTable %}

安裝完驗證一下：

```bash
rclone version
# rclone v1.68.2
```

### 設定 Google Drive（互動式）

rclone 用「{% term def="rclone 對雲端服務的稱呼，一個 remote 就是一個已設定好的雲端連線" %}remote{% endterm %}」的概念管理不同的雲端服務。設定一個新的 remote：

```bash
rclone config
```

會進入互動模式，照著選：
```
n) New remote
name> gdrive
Storage> drive  # 選 Google Drive
...
```

設定完成後，測試連線：

```bash
rclone lsd gdrive:
# 會列出 Google Drive 根目錄的資料夾
```

{% darrellImage800Alt "rclone lsd 列出 Google Drive 資料夾" rclone_lsd_list_folders.jpg max-800 %}

{% callout tip %}
`lsd` = list directories，只列出資料夾。`ls` 則會列出所有檔案。
{% endcallout %}

### 設定 Cloudflare R2（S3 Compatible）

如果你用的是 {% term def="Cloudflare 的物件儲存服務，相容 S3 API，免除出流量費用" %}Cloudflare R2{% endterm %} 或其他 S3 相容的儲存服務，設定方式類似：

```bash
rclone config
```

```
n) New remote
name> r2
Storage> s3
provider> Cloudflare
access_key_id> 你的 Access Key
secret_access_key> 你的 Secret Key
region> auto
endpoint> https://你的accountid.r2.cloudflarestorage.com
```

需要準備的資訊：

{% dataTable style="minimal" align="left" %}
[
  {"項目": "Access Key ID", "從哪裡拿": "Cloudflare Dashboard → R2 → Manage R2 API Tokens"},
  {"項目": "Secret Access Key", "從哪裡拿": "建立 API Token 時產生，只顯示一次"},
  {"項目": "Account ID", "從哪裡拿": "Dashboard 右側欄，或網址列上的那串 ID"},
  {"項目": "Region", "從哪裡拿": "填 `auto`，R2 會自動分配最近的節點"}
]
{% enddataTable %}

到 Cloudflare Dashboard 的 R2 頁面，點「管理 R2 API 權杖」，然後選「建立 User API 權杖」：

{% darrellImage800Alt "Cloudflare R2 API Token 管理頁面" r2_api_tokens_create_page.png max-800 %}

權限選擇「物件讀取和寫入」就夠用了，如果只需要備份到特定 bucket，可以在下方「指定貯體」選擇：

{% darrellImage800Alt "R2 API Token 權限設定 - 選擇物件讀取和寫入" r2_api_token_permissions.png max-800 %}

建立完成後會顯示 Access Key ID、Secret Access Key 和 Endpoint，這三個就是 rclone 設定需要的資訊：

{% darrellImage800Alt "R2 API Token 建立完成 - Access Key、Secret 和 Endpoint" r2_api_token_credentials.png max-800 %}

{% callout warning %}
Secret Access Key 只會顯示一次，記得馬上複製存好！
{% endcallout %}

R2 API Token 的完整申請流程可以參考這篇：

{% articleCard url="/n8n-node-s3-with-cloudflare-r2/" title="n8n 雲端儲存方案 - S3 節點串接 Cloudflare R2 實戰" previewText="包含 R2 API Token 申請步驟和 S3 相容設定" thumbnail="https://www.darrelltw.com/n8n-node-s3-with-cloudflare-r2/blog-n8n-s3-node-bg.jpg" %}

設定完一樣測試連線：

```bash
rclone lsd r2:
# 會列出你所有的 R2 bucket
```

{% callout tip %}
其他 S3 相容服務（如 Backblaze B2、Wasabi）設定方式幾乎一樣，只要換 provider 和 endpoint 就好。
{% endcallout %}

實測一下上傳、更新、檢視的完整流程：

```bash
# 1. 上傳檔案到 R2
echo "hello rclone" > /tmp/test.txt
rclone copy /tmp/test.txt r2:my-bucket/ --progress

# 2. 更新檔案（修改後重新上傳）
echo "hello rclone updated" > /tmp/test.txt
rclone copy /tmp/test.txt r2:my-bucket/ --progress

# 3. 檢視檔案內容
rclone cat r2:my-bucket/test.txt
```

{% darrellImage800Alt "rclone 上傳、更新、檢視 R2 檔案的終端畫面" rclone_r2_upload_update_cat.png max-800 %}

到 Cloudflare Dashboard 也能確認檔案已經上傳成功：

{% darrellImage800Alt "Cloudflare R2 Dashboard 物件預覽畫面" r2_dashboard_object_preview.png max-800 %}

### 進階：直接編輯設定檔

其實 `rclone config` 互動模式做的事情，就是把設定寫進一個叫 `rclone.conf` 的檔案。熟了之後可以直接編輯這個檔案，不用每次都一步步選。

查看設定檔位置：

```bash
rclone config file
# /Users/你的名字/.config/rclone/rclone.conf
```

打開來長這樣：

```ini
[gdrive]
type = drive
token = {"access_token":"..."}

[r2]
type = s3
provider = Cloudflare
access_key_id = 你的key
secret_access_key = 你的secret
endpoint = https://xxx.r2.cloudflarestorage.com
```

每個 `[名稱]` 就是一個 remote，下面是連線參數。要新增 remote 就直接加一組，改參數也直接改。

如果是 {% term def="持續整合/持續部署，讓程式碼自動測試、自動上線的流程" %}CI/CD{% endterm %} 或 Docker 環境，也可以用環境變數，完全不需要設定檔：

```bash
export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID=xxx
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY=xxx
export RCLONE_CONFIG_R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com

rclone lsd r2:  # 直接就能用
```

環境變數格式：`RCLONE_CONFIG_{REMOTE名稱}_{參數大寫}`

<h2 id="core-commands">核心指令對比</h2>

rclone 最重要的三個指令：`copy`、`sync`、`move`。很多人搞混，這邊用表格對比：

{% dataTable style="minimal" align="left" highlight="2" %}
[
  {"指令": "copy", "行為": "複製來源到目的地", "目的地多餘檔案": "保留", "來源檔案": "保留", "適用場景": "備份、單向複製"},
  {"指令": "sync", "行為": "讓目的地與來源完全一致", "目的地多餘檔案": "刪除", "來源檔案": "保留", "適用場景": "鏡像同步"},
  {"指令": "move", "行為": "搬移來源到目的地", "目的地多餘檔案": "保留", "來源檔案": "刪除", "適用場景": "遷移、清理"}
]
{% enddataTable %}

### 關鍵差異

- **copy**：最安全，只會新增，不會刪除任何東西
- **sync**：會讓目的地「長得跟來源一樣」，**目的地多出來的檔案會被刪掉**
- **move**：搬完就刪，適合遷移場景

{% callout warning %}
`sync` 會刪除目的地的多餘檔案！第一次用務必加 `--dry-run` 先模擬。
{% endcallout %}

{% darrellImage800Alt "rclone copy vs sync 差異比較圖" rclone_copy_vs_sync_diff.png max-800 %}

### 實測範例

把本地 `/backup` 資料夾複製到 Google Drive：

```bash
# 先用 --dry-run 看看會做什麼
rclone copy /backup gdrive:/backup --dry-run
```

{% darrellImage800Alt "rclone copy --dry-run 模擬執行結果" rclone_copy_dry_run.jpg max-800 %}

可以看到它列出了會複製哪些檔案，但因為是 dry-run，實際上沒有傳輸任何東西。

確認沒問題後，加上 `--progress` 實際執行：

```bash
rclone copy /backup gdrive:/backup --progress
```

{% darrellImage800Alt "rclone copy --progress 實際傳輸進度" rclone_copy_progress.jpg max-800 %}

`--progress` 會顯示即時進度，傳完後可以到 Google Drive 確認檔案有沒有到：

{% darrellImage800Alt "Google Drive 確認備份檔案已到位" gdrive_backup_result.jpg max-800 %}

### 常用參數

{% dataTable style="minimal" align="left" %}
[
  {"參數": "`--dry-run`", "說明": "模擬執行，不實際操作"},
  {"參數": "`--progress`", "說明": "顯示即時傳輸進度"},
  {"參數": "`--exclude`", "說明": "排除特定檔案，如 `--exclude \"*.tmp\"`"},
  {"參數": "`--transfers 4`", "說明": "同時傳輸數量（預設 4）"},
  {"參數": "`--log-file`", "說明": "輸出 log 到檔案"}
]
{% enddataTable %}

<h2 id="use-cases">常用場景</h2>

### 場景 1：每日自動備份

用 {% term def="Linux/macOS 的排程工具，可設定指令在特定時間自動執行" %}crontab{% endterm %} 排程每天凌晨 2 點備份：

```bash
# 編輯 crontab
crontab -e

# 加入這行
0 2 * * * /usr/bin/rclone sync /home/user/documents gdrive:/backup/documents --log-file /var/log/rclone.log
```

這樣每天會自動把 `documents` 同步到 Google Drive，還有 log 可以追蹤。

{% callout info %}
crontab 中要用絕對路徑，`/usr/bin/rclone` 而不是 `rclone`。
{% endcallout %}

### 場景 2：多雲備份

同一份資料備份到多個雲端，只需要一行指令就完成惹！

```bash
# 先備份到 Google Drive
rclone copy /important gdrive:/backup

# 再備份到 Dropbox
rclone copy /important dropbox:/backup

# 或是寫成 script
#!/bin/bash
for remote in gdrive dropbox onedrive; do
  rclone copy /important $remote:/backup --progress
done
```

### 場景 2.5：搭配 Claude Code 備份

這篇文章的圖片就是用 Claude Code + rclone 備份的，只要跟它說：

> 幫我把這篇文章的圖片全部備份到 R2 的 rclone bucket

Claude Code 就會自己組出 `rclone copy` 指令並執行：

{% darrellImage800Alt "Claude Code 執行 rclone copy 備份圖片到 R2" claude_code_rclone_copy_to_r2.png max-800 %}

到 Cloudflare R2 Dashboard 確認，13 個檔案全部到齊：

{% darrellImage800Alt "R2 Dashboard 確認備份檔案已上傳" r2_dashboard_backup_files.png max-800 %}

再也不需要自己辛辛苦苦的組合指令
用口語化的方式請 AI 幫忙就好

### 場景 3：雲端搬家

從 Dropbox 整個搬到 Google Drive：

```bash
rclone copy dropbox:/ gdrive:/from-dropbox --progress
```

如此一來就能把 Dropbox 直接都搬家到 Google Drive
不然自己慢慢下載再上傳有夠累人

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "rclone 和 rsync 有什麼差別？",
    "answer": "rsync 主要用於機器對機器的檔案同步（例如透過 SSH 備份到另一台伺服器），而 rclone 專門針對雲端服務設計，支援 Google Drive、S3 等 70+ 種雲端儲存的 API。簡單說：伺服器之間同步用 rsync，牽涉到雲端服務就用 rclone。"
  },
  {
    "question": "OAuth token 過期怎麼辦？",
    "answer": "跑 `rclone config reconnect gdrive:` 重新授權即可。Google Drive 的 token 通常會自動更新，但如果出現權限錯誤就需要手動重連。"
  },
  {
    "question": "sync 誤刪檔案可以救嗎？",
    "answer": "可能會救不回來！建議養成習慣：先跑 `--dry-run` 看要做什麼，確認沒問題再執行。如果真的誤刪，只能從雲端服務的垃圾桶或版本歷史救回。(部分雲端服務可能沒有內建備份功能，或是要另外付費才有)"
  }
]
{% endfaq %}
