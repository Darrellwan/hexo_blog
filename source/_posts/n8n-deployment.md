---
title: n8n 安裝部署與更新教學：Cloud、Zeabur、Docker 比較
tags:
  - n8n
  - deployment
categories:
  - n8n
page_type: post
id: n8n-deployment
description: n8n 安裝、部署、更新完整教學：官方 Cloud、Zeabur、Docker 和 Glows.ai 各方案比較，從成本、效能到更新方式，找到最適合自己的 n8n 部署方案。
bgImage: blog-n8n-deployment-bg.jpg
preload:
  - blog-n8n-deployment-bg.jpg
date: 2025-05-10 18:22:12
modified: 2026-05-16 14:28:08
---

{% darrellImageCover blog-n8n-deployment-bg blog-n8n-deployment-bg.jpg %}

<h2 id="n8n-cloud">n8n Cloud</h2>

n8n 雲端版可能是很多人的第一步，14 天的免費試用，如果有時間的話，其實真的可以做出一兩個有用的自動化
況且現在的模板越來越多，可以先馬上套用一些有興趣的模板再來做修改
一定會比自己從頭建立一個來的快，也能學到別人怎麼做自動化的！


<h3 id="ai-assist">AI 輔助</h3>

n8n 也一直在優化雲端版的功能
例如 AI 輔助模板！讓你可能達成 prompt to workflow 
提供幾個實測的範例：

```bash
# prompt
Create a workflow that receives a webhook and sends the content as a message to a Slack channel.
```

{% darrellImage800 n8n_cloud-create_template_by_ai_v1 n8n_cloud-create_template_by_ai_v1.png max-800 %}


```bash
# prompt
Create a multi-branch workflow that is triggered by a webhook with user input, looks up the user in HubSpot CRM, and based on the user's status, either creates a task in Asana for the sales team or adds the user to a Mailchimp audience. After the action, use OpenAI to generate a summary message of what was done, log the entire operation in Google Sheets, and finally notify the internal team via Slack. Include error handling and retry logic for failed API calls.
```
{% darrellImage800 n8n_cloud-create_template_by_ai_v2 n8n_cloud-create_template_by_ai_v2.png max-800 %}

其實 AI 產生的模板大方向正確
但可行性或許後續再來安排測試
厲害的是不只會產生**模板**，還會產生**註解說明**
讓使用者更能了解每個節點的作用

另外我也用中文來做嘗試

```bash
# prompt
建立一個工作流程，每天早上 9 點自動抓取一個指定 RSS 網址的最新文章，將標題與連結整理成一份簡訊內容，然後發送到指定的 Slack 頻道。
```
{% darrellImage800 n8n_cloud-create_template_by_ai_v3_chinese n8n_cloud-create_template_by_ai_v3_chinese.png max-800 %}

很不錯！說明和節點的名稱也都有用中文來命名
看來官方的 prompt 調整的有進步


<h3 id="cloud-pros">優點</h3>

官方版本的優點有很多
1. 穩定可靠：不用擔心維護的問題
2. 授權簡單：Google OAuth 直接串接，其他做法都需要自己建立 Google Cloud 專案
3. 更新容易：能簡單的更新到最新的正式版本
4. AI 輔助：如上面介紹，官方版本的 AI 產生模板或是問答有一定的水準，可能不是最好用，但很多情況應該很夠用了

<h3 id="cloud-cons">缺點</h3>

1. 最大的缺點就是付費！
但這很看個人，其實個人 Starter 方案就是大概七八百元台幣
如果真的能節省每個月幾小時以上的時間，那其實還是划算
2. 方案有限制，Starter, Pro 方案還是有限制可以啟用的 workflow 和 execution 數
如果是大量使用者，可能就會遇到這個瓶頸


<h3 id="cloud-pricing">價格和方案（2025/05）</h3>

{% darrellImage800 n8n-cloud_pricing n8n-cloud_pricing.jpg max-800 %}

> 假設台幣歐元匯率為 35:1
- **Starter 方案**：每月 €24（約 NT$840）/ 年繳的話平均每月 €20（約 NT$700）
  - 包含：2,500次執行/月、啟用5個工作流
  - 適合：小型團隊和個人項目
- **Pro 方案**：每月 €60（約 NT$2,100）/ 年繳的話平均每月 €50（約 NT$1,750）
  - 包含：10,000次執行/月、啟用15個工作流
  - 適合：中型團隊和企業
- **Enterprise 方案**：客製化價格
  - 包含：無限執行次數、企業級支持、SSO等高級功能
  - 適合：大型企業和需求複雜的團隊

<h3 id="cloud-update">Cloud 怎麼更新</h3>

如果你發現左下角出現了更新符號
請到這個網址
[https://app.n8n.cloud/manage](https://app.n8n.cloud/manage)

這邊就可以選擇想要更新的版本
會有 Beta 和 Stable 兩個版本可以選
一般建議會選擇 Stable 就好，除非你確定目前的 Beta 版本有什麼是你必須一定要馬上有的

更新介面
{% darrellImage800 n8n_cloud-how_to_update_in_cloud_version n8n_cloud-how_to_update_in_cloud_version.png max-800 %}

<h3 id="cloud-export">Cloud 版本一鍵匯出</h3>

如果想要從 Cloud 版本搬家到其他提到的部署方式
也可以在到期前一鍵匯出所有 workflows

到這個網址即可 [https://app.n8n.cloud/manage/export](https://app.n8n.cloud/manage/export)

{% darrellImage800 n8n_cloud-how_to_export_all_workflows n8n_cloud-how_to_export_all_workflows.png max-800 %}



<h2 id="zeabur">Zeabur 部署</h2>

Zeabur 相信是台灣的 n8n 使用者中討論度最高的另一個方案
因為費用非常划算，部署也相當簡單(幾乎是一鍵部署)
資料的備份和環境變數的調整都很方便

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com/referral?referralCode=darrelltw&utm_source=infoelID) 是一個專為開發者設計的部署平台，提供簡單的一鍵部署體驗，特別適合快速啟動專案。

{% darrellImage800 n8n_zeabur-templates n8n_zeabur-templates.jpg max-800 %}

<h3 id="zeabur-pros">優點</h3>

1. 價格固定：專用伺服器最低兩美金起，通常五～六美金的方案已經很夠用
2. 部署簡單：部署的模板有維護更新，也能自由選擇部署版本
3. 網域：如果 local 部署，會需要自行處理網域來接收串接資料
4. n8n 開源社群版本無限制工作流程和執行數

<h3 id="zeabur-cons">缺點</h3>

1. Google 等 OAuth 服務需要較為麻煩的設定(目前已有很多文件教學可以參考)
2. n8n 開源社群版本功能較少


<h3 id="zeabur-pricing">價格</h3>

目前部署需要先購買專用伺服器
亞洲區域常見的選擇大約在 $2-12(月) 之間

{% darrellImage800 zeabur_private_server_pricing zeabur_private_server_pricing.png max-800 %}


<h3 id="zeabur-deploy-steps">專用伺服器部署步驟</h3>

除了購買 Zeabur 的專用伺服器外，Zeabur 也支援綁定自己的私人伺服器來部署
好處是可以完全掌控硬體規格和資料存放位置，適合對資安或效能有更高要求的使用者

以下是從零開始用私人伺服器部署 n8n 的完整流程：

**Step 1. 建立專案**

進入 Zeabur 後台，點選右上角的「建立專案」

{% darrellImage800 zeabur_private_create_project zeabur_private_create_project.png max-800 %}

**Step 2. 選擇私人伺服器**

選擇你已經綁定好的伺服器，如果還沒有也可以點「購買新伺服器」或「綁定外部伺服器」透過 SSH 連接自己的機器

{% darrellImage800 zeabur_private_select_server zeabur_private_select_server.png max-800 %}

**Step 3. 部署新服務**

專案建立後會是空的，點選「部署新服務」開始加入服務

{% darrellImage800 zeabur_private_deploy_service zeabur_private_deploy_service.png max-800 %}

**Step 4. 選擇模板**

在部署方式中選擇「模板」，這裡可以從模板庫直接部署各種常見服務

{% darrellImage800 zeabur_private_select_template zeabur_private_select_template.png max-800 %}

**Step 5. 選擇 n8n 模板並部署**

在模板列表中找到 n8n，點選「部署」

{% darrellImage800 zeabur_private_n8n_template zeabur_private_n8n_template.png max-800 %}

**Step 6. 設定 Domain 和 API Key**

填入你想要的 n8n 網域名稱（會是 `xxx.zeabur.app` 的格式）
下方還可以設定 Zeabur AI Hub 的 API Key，讓 n8n 可以直接使用 Gemini、GPT、Claude、DeepSeek 等模型

{% darrellImage800 zeabur_private_domain_apikey zeabur_private_domain_apikey.png max-800 %}

**Step 7. 等待部署完成**

點下部署後，Zeabur 會自動建立 PostgreSQL 資料庫、n8n 本體和 Task Runner 三個服務
大約等待三到五分鐘就部署完成了

{% darrellImage800 zeabur_private_deploying zeabur_private_deploying.png max-800 %}

<h3 id="zeabur-update">Zeabur 怎麼更新 n8n</h3>

Zeabur 更新 n8n 版本只要改 Docker image 的標籤就好，不需要重新部署：

**Step 1. 進入 n8n 服務的「設定」頁籤**，往下捲動到「來源」區塊，點擊 `docker.io/n8nio/n8n` 那列

{% darrellImage800Alt "Zeabur 服務設定頁面，往下捲到「來源」區塊，點擊 docker.io/n8nio/n8n 那列進入版本設定" n8n-zeabur-settings-source.png max-800 %}

**Step 2.** 彈窗中找到「映像標籤」欄位，將版本號改為目標版本，點「儲存」，服務會自動重新部署

{% darrellImage800Alt "Zeabur 來源設定彈窗，在「映像標籤」欄位輸入新的 n8n 版本號，儲存後服務會自動重新部署" n8n-zeabur-version-modal.png max-800 %}

<h2 id="docker">Docker 本地部署</h2>

做為開源的 n8n ，當然也可以直接部署在自己的電腦上
就能完全免費！

但必須要知道免費的方案，伴隨而來的就是一些設定上的麻煩
例如網域、備份、電腦關機是否影響自動化等等

<h3 id="docker-pros">優點</h3>

1. 免費！
2. 可以和本機電腦的資料夾或檔案做協作
3. 執行 n8n 的硬體設備可能相對較好

<h3 id="docker-cons">缺點</h3>

1. 如果要接收 webhook 等串接，需要網域(Ngrok、Cloudflare Tunnel等額外服務)
2. 24小時有排程等工作流程，或許電腦無法關機
3. 潛在的安全性問題，n8n 服務如果對外，就算是多一個入口
要有更高的資安意識

<h3 id="docker-update">Docker 怎麼更新 n8n</h3>

Docker 更新只要重新拉取最新 image 再重啟容器就好，workflow 和資料都存在 volume 裡，不會遺失：

```bash
# 拉取最新版本
docker pull docker.io/n8nio/n8n:latest

# 重新啟動（停止舊容器並用新 image 啟動）
docker compose down && docker compose up -d
```

如果想指定版本而不是 latest：

```bash
docker pull docker.io/n8nio/n8n:2.21.0
```

把 `docker-compose.yml` 裡的 image tag 改成對應版本號再重啟即可。

<h2 id="glows-ai">Glows.ai - n8n + GPU 運算整合方案</h2>

{% darrellImage800 n8n_glowsai-intro n8n_glowsai-intro.jpg max-800 %}

Glows ai 可能大家就比較不會把他跟 n8n 連想再一起
這是一間提供雲端運算服務的平台，你可以在上面直接租用 4090、5090、H100 等 GPU 的運算服務
並且他還提供多種 Image 可以選擇

{% darrellImage800 n8n_glowsai-images n8n_glowsai-images.png max-800 %}

為什麼會提到 Glows ai 呢？

現在 AI 時代不管什麼自動化情境，都會需要 AI 來協助
不少的企業或是用戶，會有私有化運算的需求，或是需要自行訓練模型來使用
這時候就會需要運算的硬體資源

自己建置 GPU 顯卡等設備，費用不便宜，維護也是額外的麻煩
而雲端租借 GPU 服務就是另一個不錯的選擇

儲值一筆費用後，GPU 的資源也是用多少就付多少
使用上較為彈性，費用中也包含的維護這種隱性成本


對 Glows ai 有興趣的話，歡迎參考這篇文章
**透過推薦連結註冊，可以獲得試用的點數！**
{% articleCard 
  url="/glows-ai-cloud-gpu-service/" 
  title="Glows.ai 雲端 GPU 運算服務，輕鬆取得算力實現 AI 私有運算" 
  previewText="Glows.ai 提供方便的雲端 GPU 運算服務，讓你輕鬆取得高效能算力，實現 AI 私有化運算。無需自建機房，即可享有穩定、安全的 GPU 資源，是企業和個人開發 AI 應用的最佳選擇。" 
  thumbnail="https://www.darrelltw.com/glows-ai-cloud-gpu-service/glows-ai_bg.jpg" 
%}

<h3 id="glows-pros">優點</h3>

1. 可以部署本地運算模型，不用串 OpenAI 等另外花費 API 費用
2. 結合生成圖片影片聲音等地端運算服務，讓自動化的情境更豐富
3. 如有能力訓練模型，AI 輔助的自動化情境效果更好

<h3 id="glows-cons">缺點</h3>

1. 費用較高，4090 的話每天約 300 台幣左右
2. 如果有 n8n 以外的 AI 需求，需要額外維護安裝
3. 需要熟悉 command line 和 docker 的相關操作

<h3 id="glows-pricing">價格</h3>

- 4090 約每小時 0.39 美元
- 5090 約每小時 1.00 美元
- H100 約每小時 3.50 美元



<h2 id="comparison">綜合比較</h2>

這邊做一個綜合比較表！

{% darrellImage800 n8n-deployment-compare n8n-deployment-compare.png max-800 %}

<h2 id="conclusion">結論</h2>

本次介紹多種的 n8n 部署方式
希望是讓大家了解不同部署之間的差異
然而這沒有一個絕對答案，**每個用戶都會找到適合自己的方式**

如果你剛開始，可以先選一個簡單的：[n8n 官方 cloud](https://n8n.partnerlinks.io/kkuxyu5jr6p8)
然後順便去試試看 [Zeabur](https://zeabur.com/referral?referralCode=darrelltw&utm_source=infoelID) 部署
感受到其中的差異後，再決定哪一種比較適合自己也好

最後如果發現有 AI 運算的需求，那就去試試看 [Glows ai](https://reurl.cc/eGrmGj)


