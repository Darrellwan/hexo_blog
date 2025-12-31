---
title: n8n 2.0 大更新：除了新功能，更該擔心能不能順利 Migrate
tags:
  - n8n
  - n8n更新
categories:
  - n8n
page_type: post
id: n8n-2.0-update
description: n8n 2.0 大更新要來了！包含新功能介紹、Migration Report 使用教學、Breaking Changes 詳解和常見升級問題解決方案
bgImage: n8n-2.0-update-bg.jpg
preload:
  - n8n-2.0-update-bg.jpg
date: 2025-11-26 16:17:12
modified: 2025-12-17 16:16:00
---

{% darrellImageCover n8n-2.0-update-bg n8n-2.0-update-bg.jpg %}

{% quickNav %}
[
  {"text": "2.0 新功能", "anchor": "new-features", "desc": "Autosave 和界面改進"},
  {"text": "Migration Report", "anchor": "migration-report", "desc": "檢查 workflows 是否需調整"},
  {"text": "需要注意的變更", "anchor": "common-issues", "desc": "MySQL、ExecuteCommand、Python"},
  {"text": "升級前檢查清單", "anchor": "upgrade-checklist", "desc": "確認事項列表"},
  {"text": "版本發布時間軸", "anchor": "release-timeline", "desc": "Beta、穩定版時程"},
  {"text": "相關文章", "anchor": "related-articles", "desc": "延伸閱讀"},
  {"text": "總結", "anchor": "conclusion", "desc": "升級建議"}
]
{% endquickNav %}

## 2.0.0 詳細更新紀錄歡迎參考

{% articleCard url="/n8n-update-log/" title="n8n 版本更新紀錄心得" previewText="n8n 的持續更新記錄，包含各版本新功能測試心得" thumbnail="https://www.darrelltw.com/n8n-update-log/n8n-update_bg.jpg" %}

## Beta 版本測試：

這次更新中 UI 最有感的就是節點的配色跟動畫更新了！

n8n 2.0 準備要正式發布了
距離文章撰寫的當下只剩下兩週左右的時間
大家可以先來看看更新內容
並且這次要更新到 2.0 不是單純更新就好，會有一些需要先行確認的事項。

發布時間：
- Beta 版本：2025 年 12 月 8 日
- 穩定版本：2025 年 12 月 15 日

這次更新主要著重在**安全性**和**穩定性**
移除了一些舊有的功能，並為未來的發展打下更好的基礎。

{% callout warning %}
建議先查看 Migration Report，確認有哪些 workflows 需要調整
{% endcallout %}

---

<h2 id="new-features">n8n 2.0 新功能</h2>

### Autosave 自動儲存

大家期盼已久的自動儲存會在 2.0 更新出現
這大概是每個 n8n 使用者都期待的一個功能
(老實說，這應該早就要有才對吧！？)

再也不用怕因為忘記儲存而關閉瀏覽器
導致 workflow 做到一半全部不見

### 改進的 Canvas 和 Sidebar

針對 Canvas 和 Sidebar 的更新也很令人期待
畢竟最近的版本更新後
已經看到一些配色的調整
Sidebar 的確也是很讚的更新，簡單的編輯調整不用再打開節點畫面
不確定現在這版是不是就是 2.0 版本的 Sidebar
等更新後會在第一時間寫在 n8n 更新紀錄

{% darrellImage800Alt "n8n 2.0 新的 Canvas 界面設計" n8n-2.0-new-canvas.png max-800 %}

### 一些還不知道的驚喜

如果他原文敢用 surprise 那就真的會想期待
以最近的更新方向來看

應該是真的藏了一些好用的更新在 2.0 版本中
最近幾個版本的更新都偏向優化和修復
已經很久沒推出什麼令人覺得新奇的新功能

---

<h2 id="migration-report">Migration Report 確保升級順利</h2>

這是 2.0 升級前重要的一份檢查報表
它會告訴你哪些 workflows 或設定需要調整。

### 如何找到 Migration Report

路徑：**Settings → Migration Report**

{% darrellImage800Alt "n8n Migration Report 位置，在 Settings 選單中" n8n-2.0-migration-report-location.png max-800 %}

### 如何解讀 Migration Report

Migration Report 會分為兩個層級：

1. **Workflow 層級問題** - 哪些 workflows 需要調整

{% darrellImage800Alt "n8n Migration Report Workflow 層級問題" n8n-2.0-migration-report-workflow-level.png max-800 %}

2. **Instance 層級問題** - 整個 n8n 實例的設定需要調整

{% darrellImage800Alt "n8n Migration Report Instance 層級問題" n8n-2.0-migration-report-instance-level.png max-800 %}

---

<h2 id="common-issues">需要注意的幾項變更</h2>


### 1：使用 MySQL/MariaDB 的警告

問題說明：
n8n 2.0 **停止支援** MySQL 和 MariaDB 作為資料庫。
但以前好像就是傾向不使用 MySQL，原本就建議使用 PostgreSQL 來作為資料庫
這次更動算影響不大，除非原本有因為不得抗拒因素使用 MySQL 和 MariaDB
那就會無法更新上 2.0 版本

{% darrellImage800Alt "MySQL/MariaDB 被停止支援的警告" n8n-2.0-mysql-mariadb-warning.png max-800 %}

---

### 2：ExecuteCommand Node & LocalFileTrigger Node 被停用

問題說明：
這有夠麻煩...
當初就是為了備份 Credentials 而使用 ExecuteCommand 來執行 n8n `import` 和 `export` 的指令
還有其他常見例如執行 `ffmpeg` 指令也會受到影響！

如何重新啟用：

目前看 **Migration** 文件，應該是可以從**環境變數**來設定
```
NODES_EXCLUDE=[]
```
設定為空陣列代表不排除任何節點，也就是允許所有節點（包括 ExecuteCommand）執行

{% darrellImage800Alt "ExecuteCommand Node & LocalFileTrigger Node 被停用的警告" n8n-2.0-executecommand-and-localfiletrigger-node-warning.png max-800 %}

{% callout info %}
這邊用圖片教學大家這個環境變數的設定邏輯。簡單理解就是：`NODES_EXCLUDE` 裡面填「要被排除（禁用）」的節點名稱清單。
{% endcallout %}

常見幾種寫法如下（對應下圖）：

1. 只排除 ExecuteCommand 節點
```
NODES_EXCLUDE=["n8n-nodes-base.executeCommand"]
```

2. 只排除 Read/Write Files from Disk 節點
```
NODES_EXCLUDE=["n8n-nodes-base.readWriteFile"]
```

3. 同時排除兩個節點
```
NODES_EXCLUDE=["n8n-nodes-base.executeCommand","n8n-nodes-base.readWriteFile"]
```

4. 不排除任何節點（全部允許）
```
NODES_EXCLUDE=[]
```

{% darrellImage800Alt "n8n 環境變數設定教學" n8n-2.0-exclude_nodes_setting_tutorial.png max-800 %}

和在 Zeabur 中如何設定：

如果你是用 Zeabur 部署 n8n，可以照這個流程新增環境變數：

1. 在 Zeabur 專案左側選到你的 **n8n**
2. 進到上方頁籤的 **環境變數**
3. 點 **新增環境變數**，Key 填 `NODES_EXCLUDE`
4. Value 依你要的設定填入（例如要全部允許就填 `[]`），然後按右側 **新增**

{% darrellImage800Alt "在 Zeabur 中如何設定 ExecuteCommand Node & LocalFileTrigger Node" n8n-2.0-exclude_nodes_setting_tutorial_in_zeabur.png max-800 %}

---

### 3：Python Code Node 需要調整

問題說明：
舊的 Python Code Node 因為效能和安全性問題而調整
在新版本使用 Task Runners

就像是在獨立的空間中執行 Python
而不像原本和 n8n 綁在一起

{% darrellImage800Alt "Python Code Node 新舊語法差異" n8n-2.0-python-syntax.png max-800 %}

Cloud 版本用戶應該不用擔心，官方會直接幫忙調整
而自架用戶如 Zeabur，可能會看看 Zeabur 後續調整的 docker 中是否也有隨之調整
自己架 Docker 的人就需要參考官方文件來調整了！

官方文件：[enable-task-runners-by-default](https://docs.n8n.io/2-0-breaking-changes/#enable-task-runners-by-default)


---

<h2 id="upgrade-checklist">升級前檢查清單</h2>

在升級到 n8n 2.0 之前，建議完成以下檢查：

- [ ] 已查看 Migration Report（Settings → Migration Report）
- [ ] 已備份資料庫（自架用戶）
- [ ] 已檢查 Code Node 是否使用環境變數
- [ ] 已確認資料庫類型（MySQL vs. PostgreSQL）
- [ ] 已檢查是否必須要使用 ExecuteCommand 或 LocalFileTrigger 節點
- [ ] 已檢查是否使用 Python Code Node
- [ ] 已閱讀[官方 Breaking Changes 文檔](https://docs.n8n.io/2-0-breaking-changes/)

---

<h2 id="release-timeline">版本發布時間軸</h2>

```
現在（2025/11/26）    2025/12/8        2025/12/15       2026/3/15
      ↓                  ↓                 ↓                ↓
   📖 閱讀文檔        🎯 2.0 Beta      🚀 2.0 穩定版    ⚠️ 1.x 停止支援
   檢查 Migration     在測試環境試用    正式環境升級      （預估）
```

{% darrellImage800Alt "n8n 2.0 版本發布時間軸" n8n-2.0-release-timeline.webp max-800 %}

現在～2025/12/8（約 2 週）
- 了解 Breaking Changes
- 檢查 Migration Report（Settings → Migration Report）

2025/12/8～12/15（Beta 測試期）
- 安裝 Beta 版
- 測試重要的 workflows
- 有問題就需要快點回報和確認

2025/12/15 之後（穩定版上線）
- 等上一版本確定都沒問題，再升級穩定版本
- 正式升級到 2.0

2026/3月中旬（預估）
- 1.x 版本停止支援（2.0 發布後 3 個月）
- 不再提供安全修復和 bug 修復

---

<h2 id="related-articles">相關文章推薦</h2>

{% articleCard url="/n8n-built-in-variables/" title="n8n 內建變數教學" previewText="完整介紹 n8n 內建變數的使用方式" thumbnail="https://www.darrelltw.com/n8n-built-in-variables/n8n_builtin_variables_bg.jpg" %}

{% articleCard url="/n8n-deployment/" title="n8n 部署教學" previewText="完整的 n8n 自架部署指南" thumbnail="https://www.darrelltw.com/n8n-deployment/blog-n8n-deployment-bg.jpg" %}

---

<h2 id="conclusion">總結</h2>

n8n 2.0 是一個重要的里程碑
這次和以前不一樣，不是簡單更換版本號碼就能完成的更新

而是一次架構上的調整升級
有很多好處，但也會有必要的麻煩

過往一些較不安全或是穩定性相容較差的做法就需要被調整
希望大家都能順利升級到 2.0！

如果升級過程中遇到問題
歡迎到 [n8n 官方論壇](https://community.n8n.io/) 提問
