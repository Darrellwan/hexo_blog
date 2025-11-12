---
title: n8n 安裝部署教學 - 官方Cloud、Zeabur、本機部署和Glows.ai 該怎麼選?
tags:
  - n8n
  - deployment
categories:
  - n8n
page_type: post
id: n8n-deployment
description: n8n 部署教學：官方 Cloud、Zeabur、Docker 和 Glows.ai 方案完整比較，從成本、效能到擴展性，掌握各種部署方式的關鍵差異，找到屬於自己合適的部署方式。
bgImage: blog-n8n-deployment-bg.jpg
preload:
  - blog-n8n-deployment-bg.jpg
date: 2025-05-10 18:22:12
modified: 2025-05-10 18:22:12
---

{% darrellImageCover blog-n8n-deployment-bg blog-n8n-deployment-bg.jpg %}

## n8n Cloud

n8n 雲端版可能是很多人的第一步，14 天的免費試用，如果有時間的話，其實真的可以做出一兩個有用的自動化
況且現在的模板越來越多，可以先馬上套用一些有興趣的模板再來做修改
一定會比自己從頭建立一個來的快，也能學到別人怎麼做自動化的！


### AI 輔助

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


### 優點

官方版本的優點有很多
1. 穩定可靠：不用擔心維護的問題
2. 授權簡單：Google OAuth 直接串接，其他做法都需要自己建立 Google Cloud 專案
3. 更新容易：能簡單的更新到最新的正式版本
4. AI 輔助：如上面介紹，官方版本的 AI 產生模板或是問答有一定的水準，可能不是最好用，但很多情況應該很夠用了

### 缺點

1. 最大的缺點就是付費！
但這很看個人，其實個人 Starter 方案就是大概七八百元台幣
如果真的能節省每個月幾小時以上的時間，那其實還是划算
2. 方案有限制，Starter, Pro 方案還是有限制可以啟用的 workflow 和 execution 數
如果是大量使用者，可能就會遇到這個瓶頸


### 價格和方案（2025/05）

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

### Cloud 怎麼更新

如果你發現左下角出現了更新符號
請到這個網址
[https://app.n8n.cloud/manage](https://app.n8n.cloud/manage)

這邊就可以選擇想要更新的版本
會有 Beta 和 Stable 兩個版本可以選
一般建議會選擇 Stable 就好，除非你確定目前的 Beta 版本有什麼是你必須一定要馬上有的

更新介面
{% darrellImage800 n8n_cloud-how_to_update_in_cloud_version n8n_cloud-how_to_update_in_cloud_version.png max-800 %}

### Cloud 版本一鍵匯出

如果想要從 Cloud 版本搬家到其他提到的部署方式
也可以在到期前一鍵匯出所有 workflows

到這個網址即可 [https://app.n8n.cloud/manage/export](https://app.n8n.cloud/manage/export)

{% darrellImage800 n8n_cloud-how_to_export_all_workflows n8n_cloud-how_to_export_all_workflows.png max-800 %}



## Zeabur 部署

Zeabur 相信是台灣的 n8n 使用者中討論度最高的另一個方案
因為費用非常划算，部署也相當簡單(幾乎是一鍵部署)
資料的備份和環境變數的調整都很方便

2025/10 更新: Zeabur 推出了全新的免費方案，現在不一定要從 5美金的付費方案才能使用了！

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com/referral?referralCode=darrelltw&utm_source=infoelID) 是一個專為開發者設計的部署平台，提供簡單的一鍵部署體驗，特別適合快速啟動專案。

{% darrellImage800 n8n_zeabur-templates n8n_zeabur-templates.jpg max-800 %}

### 優點

1. 價格划算：直接使用免費方案，或是開發者方案只需要五美元
2. 部署簡單：部署的模板有維護更新，也能自由選擇部署版本
3. 支援即時：有 Discord 可以詢問遇到的問題
4. 網域：如果 local 部署，會需要自行處理網率來接收串接資料
5. n8n 開源社群版本無限制工作流程和執行數！
6. Zeabur 是個雲端部署平台，基於 AWS 等機房，還能架設 Wordpress、MySQL 或是 vibe coding 的其他服務！

### 缺點

1. 免費方案的機房較遠，付費方案可以選擇近距離的機房
2. Google 等 OAuth 服務需要較為麻煩的設定(目前已有很多文件教學可以參考)
3. n8n 開源社群版本功能較少

{% darrellImage800 n8n_zeabur-free_plan_server n8n_zeabur-free_plan_server.png max-800 %}

圖片中列出可以選的 Server 有 AWS 台北、香港、東京等等
免費方案能選擇的只有 Silicon Valley(美國)、Jakarta (印尼)

### 價格(2025/10)

{% darrellImage800 n8n_zeabur-price n8n_zeabur-price.png max-800 %}

建議可以直接使用 $5 美元的 developer plan

## Docker 本地部署

做為開源的 n8n ，當然也可以直接部署在自己的電腦上
就能完全免費！

但必須要知道免費的方案，伴隨而來的就是一些設定上的麻煩
例如網域、備份、電腦關機是否影響自動化等等

### 優點

1. 免費！
2. 可以和本機電腦的資料夾或檔案做協作
3. 執行 n8n 的硬體設備可能相對較好

### 缺點

1. 如果要接收 webhook 等串接，需要網域(Ngrok、Cloudflare Tunnel等額外服務)
2. 24小時有排程等工作流程，或許電腦無法關機
3. 潛在的安全性問題，n8n 服務如果對外，就算是多一個入口
要有更高的資安意識


## Glows.ai - n8n + GPU 運算整合方案

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

### 優點

1. 可以部署本地運算模型，不用串 OpenAI 等另外花費 API 費用
2. 結合生成圖片影片聲音等地端運算服務，讓自動化的情境更豐富
3. 如有能力訓練模型，AI 輔助的自動化情境效果更好

### 缺點

1. 費用較高，4090 的話每天約 300 台幣左右
2. 如果有 n8n 以外的 AI 需求，需要額外維護安裝
3. 需要熟悉 command line 和 docker 的相關操作

### 價格(2025/05)

- 4090 約每小時 0.39 美元
- 5090 約每小時 1.00 美元
- H100 約每小時 3.50 美元



## 綜合比較

這邊做一個綜合比較表！

{% darrellImage800 n8n-deployment-compare n8n-deployment-compare.png max-800 %}

## 結論

本次介紹多種的 n8n 部署方式
希望是讓大家了解不同部署之間的差異
然而這沒有一個絕對答案，**每個用戶都會找到適合自己的方式**

如果你剛開始，可以先選一個簡單的：[n8n 官方 cloud](https://n8n.partnerlinks.io/kkuxyu5jr6p8)
然後順便去試試看 [Zeabur](https://zeabur.com/referral?referralCode=darrelltw&utm_source=infoelID) 部署
感受到其中的差異後，再決定哪一種比較適合自己也好

最後如果發現有 AI 運算的需求，那就去試試看 [Glows ai](https://reurl.cc/eGrmGj)


