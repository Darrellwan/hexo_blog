---
title: n8n 部署-官方Cloud、Zeabur、本機部署和Glows.ai 該怎麼選
tags:
  - n8n
  - deployment
categories:
  - n8n
page_type: post
id: n8n-deployment
description: n8n 部署全攻略：官方 Cloud、Zeabur、Docker 和 Glows.ai 方案完整比較，從成本、效能到擴展性，掌握各種部署方式的關鍵差異，找到屬於自己合適的部署方式。
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
讓使用者更能了解每個節點的組用

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
2. 授權簡單：Googel OAuth 直接串接，其他做法都需要自己建立 Google Cloud 專案
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


## Zeabur 部署

Zeabur 相信是台灣的 n8n 使用者中討論度最高的另一個方案
因為費用非常划算，部署也相當簡單(幾乎是一鍵部署)
資料的備份和環境變數的調整都很方便

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com/referral?referralCode=darrelltw&utm_source=infoelID) 是一個專為開發者設計的部署平台，提供簡單的一鍵部署體驗，特別適合快速啟動專案。

{% darrellImage800 n8n_zeabur-templates n8n_zeabur-templates.jpg max-800 %}

### 優點

1. 價格划算：開發者帳戶只需要五美元
2. 部署簡單：部署的模板有維護更新，也能自由選擇部署版本
3. 支援即時：有 Discord 可以詢問遇到的問題
4. 網域：如果 local 部署，會需要自行處理網率來接收串接資料
5. n8n 開源社群版本無限制旅程和執行數！

### 缺點

1. 還是需要一點費用
2. Google 等 OAuth 服務需要較為麻煩的設定(目前已有很多文件教學可以參考)
3. n8n 開源社群版本功能較少

### 價格(2025/05)

{% darrellImage800 n8n_zeabur-price n8n_zeabur-price.jpg max-800 %}

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
2. 24小時有排程等旅程，或許電腦無法關機
3. 潛在的安全性問題，n8n 服務如果對外，就算是多一個入口
要有更高的資安意識


## Glows.ai - n8n + GPU 運算整合方案

{% darrellImage800 n8n_glowsai-intro n8n_glowsai-intro.jpg max-800 %}

Glows ai 可能大家就比較不會把他跟 n8n 連想再一起
這是一間提供雲端運算服務的平台，你可以在上面直接租用 4090, 5090, H100 等 GPU 的運算服務
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

## 選擇適合自己的部署方案

<style>:root{--primary:#ff6d00;--primary-light:#ff9e40;--primary-dark:#c43e00;--background:#1a1a1a;--card-bg:#2a2a2a;--card-highlight:#303030;--text:#e0e0e0;--text-muted:#9e9e9e;--border:#444;--accent-blue:#4a6cf7;--accent-green:#4caf50;--accent-purple:#9c27b0;--accent-orange:#ff9800;--shadow:0 4px 15px rgba(0,0,0,0.3);--transition:all 0.3s ease;}*{box-sizing:border-box;margin:0;padding:0;}.n8n-selector{font-family:'Noto Sans TC',-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.6;color:var(--text);background-color:#232323;margin:0 auto;border-radius:12px;box-shadow:var(--shadow);padding:25px;border:1px solid var(--border);max-width:1100px;}.n8n-title{color:var(--primary);text-align:center;margin-bottom:10px;font-size:28px;}.n8n-subtitle{text-align:center;color:var(--text-muted);margin-bottom:25px;font-size:16px;}.filter-section{margin-bottom:30px;}.filter-title{font-size:18px;font-weight:600;margin-bottom:12px;color:var(--text);display:flex;align-items:center;}.filter-title svg{margin-right:8px;}.btn-group{display:flex;gap:4px;margin-bottom:15px;width:100%;}.filter-btn{background-color:#333;border:1px solid var(--border);color:var(--text);padding:10px 0;border-radius:6px;cursor:pointer;font-size:14px;transition:var(--transition);outline:none;font-weight:500;flex:1;text-align:center;white-space:nowrap;min-width:0;}.filter-btn:hover{background-color:#3a3a3a;transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,0.25);}.filter-btn.active{background-color:var(--primary);color:white;border-color:var(--primary-dark);box-shadow:0 0 15px rgba(255,109,0,0.4);}.reset-btn{background-color:transparent;border:1px solid var(--border);color:var(--text-muted);padding:10px 20px;border-radius:6px;cursor:pointer;font-size:14px;transition:var(--transition);display:block;margin:0 auto 20px;}.reset-btn:hover{background-color:#383838;border-color:#555;color:var(--text);}.platforms-container{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:25px;margin-top:30px;}.platform-card{border-radius:12px;box-shadow:var(--shadow);overflow:hidden;transition:var(--transition);background:var(--card-bg);border:1px solid var(--border);position:relative;opacity:1;transform:scale(1);display:flex;flex-direction:column;height:auto;}.platform-card.hidden{display:none;}.platform-card.dimmed{opacity:0.3;transform:scale(0.98);}.platform-card::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;background-image:url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='%23aaa'/%3E%3Ccircle cx='25' cy='15' r='1.5' fill='%23999'/%3E%3Ccircle cx='40' cy='10' r='1' fill='%23aaa'/%3E%3Ccircle cx='55' cy='25' r='2' fill='%23888'/%3E%3Ccircle cx='70' cy='20' r='1' fill='%23aaa'/%3E%3Ccircle cx='85' cy='30' r='1.5' fill='%23999'/%3E%3Ccircle cx='15' cy='40' r='2' fill='%23888'/%3E%3Ccircle cx='30' cy='35' r='1' fill='%23aaa'/%3E%3Ccircle cx='45' cy='45' r='1.5' fill='%23999'/%3E%3Ccircle cx='60' cy='40' r='1' fill='%23aaa'/%3E%3Ccircle cx='75' cy='45' r='2' fill='%23888'/%3E%3Ccircle cx='90' cy='40' r='1' fill='%23aaa'/%3E%3Ccircle cx='5' cy='60' r='1.5' fill='%23999'/%3E%3Ccircle cx='20' cy='55' r='1' fill='%23aaa'/%3E%3Ccircle cx='35' cy='65' r='2' fill='%23888'/%3E%3Ccircle cx='50' cy='60' r='1' fill='%23aaa'/%3E%3Ccircle cx='65' cy='70' r='1.5' fill='%23999'/%3E%3Ccircle cx='80' cy='65' r='1' fill='%23aaa'/%3E%3Ccircle cx='95' cy='75' r='2' fill='%23888'/%3E%3Ccircle cx='10' cy='90' r='1' fill='%23aaa'/%3E%3Ccircle cx='25' cy='85' r='1.5' fill='%23999'/%3E%3Ccircle cx='40' cy='95' r='2' fill='%23888'/%3E%3Ccircle cx='55' cy='90' r='1' fill='%23aaa'/%3E%3Ccircle cx='70' cy='85' r='1.5' fill='%23999'/%3E%3Ccircle cx='85' cy='95' r='1' fill='%23aaa'/%3E%3C/svg%3E");background-size:400px 400px;opacity:0;z-index:10;pointer-events:none;}.platform-card.thanos-snap{animation:thanosSnap 2s ease-out forwards;}.platform-card.thanos-snap::before{animation:dustParticles 2s ease-out forwards;}@keyframes dustParticles{0%{background-position:0% 0%;opacity:0;}10%{opacity:0.2;}60%{opacity:0.5;}100%{background-position:100% 100%;opacity:0;}}@keyframes thanosSnap{0%{opacity:1;filter:grayscale(0);transform:scale(1) rotate(0deg);}10%{opacity:0.95;filter:grayscale(0.2);transform:scale(0.99) rotate(0deg);}15%{filter:grayscale(0.3);}30%{opacity:0.8;transform:scale(0.97) rotate(1deg);filter:grayscale(0.5);}45%{opacity:0.6;filter:grayscale(0.7);}60%{opacity:0.4;filter:grayscale(0.9);transform:scale(0.9) rotate(2deg);}80%{opacity:0.2;}100%{opacity:0;filter:grayscale(1);transform:scale(0.7) rotate(3deg);}}.platform-card.highlighted{transform:scale(1.03);box-shadow:0 0 25px rgba(255,109,0,0.3);border:2px solid var(--primary);z-index:1;}.card-header{padding:15px 20px;background:linear-gradient(45deg,var(--primary-dark),var(--primary));color:white;}.platform-name{font-size:20px;font-weight:bold;margin:0;}.platform-price{font-size:14px;opacity:0.9;margin-top:5px;}.best-match-badge{position:absolute;top:15px;right:15px;background-color:#ffab00;color:#333;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.2);display:none;}.platform-card.highlighted .best-match-badge{display:block;}.card-body{padding:20px;flex:1;}.tags-container{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:15px;}.tag{font-size:12px;padding:4px 10px;border-radius:20px;background-color:#333;color:var(--text);}.tag.ai{background-color:rgba(74,108,247,0.2);color:#a0b1ff;border:1px solid #4a6cf7;}.tag.free{background-color:rgba(76,175,80,0.2);color:#a5d6a7;border:1px solid #4caf50;}.tag.local{background-color:rgba(255,152,0,0.2);color:#ffcc80;border:1px solid #ff9800;}.tag.gpu{background-color:rgba(156,39,176,0.2);color:#ce93d8;border:1px solid #9c27b0;}.tag.unlimited{background-color:rgba(63,81,181,0.2);color:#9fa8da;border:1px solid #3f51b5;}.tag.private{background-color:rgba(0,121,107,0.2);color:#80cbc4;border:1px solid #00796b;}.tag.performance{background-color:rgba(198,40,40,0.2);color:#ef9a9a;border:1px solid #c62828;}.features-list{list-style-type:none;padding:0;margin:0;}.feature-item{padding:8px 0;display:flex;align-items:flex-start;font-size:14px;border-bottom:1px solid #3a3a3a;}.feature-item:last-child{border-bottom:none;}.feature-item:before{content:"✓";color:var(--primary);margin-right:8px;font-weight:bold;}.selected-filters{display:flex;flex-wrap:wrap;gap:10px;margin:0 auto 25px;max-width:800px;min-height:40px;padding:10px 15px;background-color:#2c2c2c;border-radius:8px;border:1px solid #444;}.filter-chip{display:flex;align-items:center;gap:5px;background-color:rgba(255,109,0,0.2);color:var(--primary-light);padding:5px 12px;border-radius:20px;font-size:14px;border:1px solid rgba(255,109,0,0.3);}.remove-filter{cursor:pointer;font-weight:bold;margin-left:5px;}.empty-filter-message{color:var(--text-muted);font-style:italic;margin:0;text-align:center;}.recommendation-section{margin-top:30px;padding:20px;background-color:rgba(255,109,0,0.1);border-radius:10px;border:1px solid rgba(255,109,0,0.2);display:none;}.recommendation-title{font-size:18px;font-weight:bold;color:var(--primary);margin-bottom:15px;}.recommendation-text{font-size:16px;line-height:1.6;}.filter-btn:active,.reset-btn:active{transform:scale(0.98);}.dust-particle{position:absolute;background-color:#aaa;border-radius:50%;width:2px;height:2px;pointer-events:none;opacity:0.8;transform:translate(-50%,-50%);animation:floatAway 2s ease-out forwards;}.particles-container{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:100;}@media(max-width:768px){.platforms-container{grid-template-columns:1fr;}.filter-btn{padding:8px 5px;font-size:12px;}.btn-group{flex-wrap:wrap;}}
.filter-btn.disabled {
  opacity: 0.45;
  cursor: not-allowed;
  background-color: #222;
  position: relative;
  overflow: hidden;
  border: 1px dashed #444;
}
.filter-btn.disabled::before {
  content: "不相容";
  position: absolute;
  background-color: rgba(255, 60, 0, 0.7);
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 2px;
  top: 0;
  right: 0;
  transform: translate(30%, -30%) rotate(20deg);
  pointer-events: none;
}
.filter-btn.disabled::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(80, 80, 80, 0.1) 5px,
    rgba(80, 80, 80, 0.1) 10px
  );
  pointer-events: none;
}
.tooltip {
  position: relative;
  display: inline-block;
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: rgba(30, 30, 30, 0.95);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -100px;
  opacity: 0;
  transition: opacity 0.3s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  font-size: 12px;
  line-height: 1.4;
  pointer-events: none;
  border: 1px solid #444;
}
.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
.platform-card.thanos-snap {
  animation: thanosSnap 2s ease-out forwards;
}
@keyframes thanosSnap {
  0% {
    opacity: 1;
    filter: grayscale(0);
    transform: scale(1) rotate(0deg);
  }
  10% {
    opacity: 0.95;
    filter: grayscale(0.2);
    transform: scale(0.99) rotate(0deg);
  }
  15% {
    filter: grayscale(0.3);
  }
  30% {
    opacity: 0.8;
    transform: scale(0.97) rotate(1deg);
    filter: grayscale(0.5);
  }
  45% {
    opacity: 0.6;
    filter: grayscale(0.7);
  }
  60% {
    opacity: 0.4;
    filter: grayscale(0.9);
    transform: scale(0.9) rotate(2deg);
  }
  80% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
    filter: grayscale(1);
    transform: scale(0.7) rotate(3deg);
  }
}
</style>
<div class="particles-container" id="particles-container"></div>
<div class="n8n-selector">
<p class="n8n-subtitle">選擇適合您需求的部署方案，輕鬆開始自動化工作流程</p>
<div class="selected-filters" id="selected-filters"><p class="empty-filter-message">尚未選擇任何篩選條件，點擊下方按鈕開始篩選</p></div>
<div class="filter-section">
<div class="filter-title"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#FF6D00"/></svg>您的身份</div>
<div class="btn-group identity-group">
<button class="filter-btn" data-filter="identity" data-value="individual">個人用戶</button>
<button class="filter-btn" data-filter="identity" data-value="small-team">小型團隊</button>
<button class="filter-btn" data-filter="identity" data-value="mid-team">中型團隊</button>
<button class="filter-btn" data-filter="identity" data-value="enterprise">大型企業</button>
</div>
<div class="filter-title"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="#FF6D00"/></svg>每月預算</div>
<div class="btn-group budget-group">
<button class="filter-btn" data-filter="budget" data-value="free">完全免費</button>
<button class="filter-btn" data-filter="budget" data-value="low">預算 (100-1000元)</button>
<button class="filter-btn" data-filter="budget" data-value="high">預算 (1000元以上)</button>
</div>
<div class="filter-title"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="#FF6D00"/></svg>技術能力</div>
<div class="btn-group tech-group">
<button class="filter-btn" data-filter="tech" data-value="none">無技術基礎</button>
<button class="filter-btn" data-filter="tech" data-value="basic">基礎技術能力</button>
<button class="filter-btn" data-filter="tech" data-value="advanced">專業技術能力</button>
</div>
<div class="filter-title"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="#FF6D00"/></svg>需求</div>
<div class="btn-group needs-group">
<button class="filter-btn" data-filter="needs" data-value="ai">AI輔助</button>
<button class="filter-btn" data-filter="needs" data-value="unlimited">無限工作流</button>
<button class="filter-btn" data-filter="needs" data-value="local">本地檔案</button>
<button class="filter-btn" data-filter="needs" data-value="private">私有部署</button>
</div>
</div>
<button id="reset-filters" class="reset-btn">重置所有篩選條件</button>
<div class="platforms-container" id="platforms-container"></div>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
  const platforms = [
    {
      "name": "n8n Cloud",
      "identity": ["individual", "small-team", "mid-team", "enterprise"],
      "budget": ["low", "high"],
      "tech": ["none", "basic", "advanced"],
      "needs": ["ai"],
      "price": "NT$ 840 / 月起",
      "tags": ["ai", "穩定可靠", "官方支援"],
      "features": [
        "官方雲端服務，穩定可靠",
        "14天免費試用期",
        "AI輔助生成工作流模板",
        "自動更新到最新版本",
        "簡單的OAuth授權設定"
      ]
    },
    {
      "name": "Zeabur",
      "identity": ["individual", "small-team", "mid-team", "enterprise"],
      "budget": ["low"],
      "tech": ["basic", "advanced"],
      "needs": ["unlimited", "private"],
      "price": "NT$ 150 / 月",
      "tags": ["unlimited", "一鍵部署", "private"],
      "features": [
        "價格實惠，一鍵快速部署",
        "社群版無限制工作流程",
        "Discord技術支援",
        "方便的備份與還原",
        "適合預算有限的用戶"
      ]
    },
    {
      "name": "Docker 本地部署",
      "identity": ["individual", "small-team", "mid-team", "enterprise"],
      "budget": ["free", "low", "high"],
      "tech": ["advanced"],
      "needs": ["unlimited", "local", "private"],
      "price": "完全免費",
      "tags": ["free", "local", "private", "unlimited"],
      "features": [
        "完全免費的自建方案",
        "可直接存取本機檔案系統",
        "完全客製化與控制",
        "社群版無限制工作流程",
        "需要較高技術能力維護"
      ]
    },
    {
      "name": "Glows.ai",
      "identity": ["individual", "small-team", "mid-team", "enterprise"],
      "budget": ["high"],
      "tech": ["basic", "advanced"],
      "needs": ["ai", "unlimited"],
      "price": "約 NT$ 300 / 天",
      "tags": ["gpu", "ai", "unlimited"],
      "features": [
        "GPU運算資源",
        "AI模型私有化部署",
        "彈性按需計費模式",
        "支援4090、5090、H100等GPU",
        "適合需要大量運算的團隊"
      ]
    }
  ];
  const platformsContainer = document.getElementById('platforms-container');
  const recommendationSection = document.getElementById('recommendation-section');
  const recommendationText = document.getElementById('recommendation-text');
  const particlesContainer = document.getElementById('particles-container');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const resetButton = document.getElementById('reset-filters');
  const selectedFiltersContainer = document.getElementById('selected-filters');
  const selectedFilters = { identity: [], budget: [], tech: [], needs: [] };
  const filterLabels = {
    identity: { individual: '個人用戶', 'small-team': '小型團隊', 'mid-team': '中型團隊', enterprise: '大型企業' },
    budget: { free: '完全免費', low: '預算 (100-1000元)', high: '預算 (1000元以上)' },
    tech: { none: '無技術基礎', basic: '基礎技術能力', advanced: '專業技術能力' },
    needs: { ai: 'AI輔助', unlimited: '無限工作流', local: '本地檔案', private: '私有部署' }
  };
  const platformDescriptions = {
    'n8n Cloud': '官方雲端服務適合注重穩定性且希望有AI輔助的團隊，無需技術背景也能輕鬆上手。',
    'Zeabur': '一鍵部署平台適合有基本技術知識、預算有限但需要無限工作流的用戶。',
    'Docker 本地部署': '完全免費的自建方案，適合有專業技術能力、需要訪問本地檔案且重視私有部署的用戶。',
    'Glows.ai': '雲端GPU運算服務，適合需要處理AI運算、生成大量媒體內容的團隊。'
  };
  function createTagClass(tag) {
    let className = 'tag';
    if (tag === 'ai' || tag === 'AI輔助') className += ' ai';
    if (tag === 'free' || tag === '免費') className += ' free';
    if (tag === 'local' || tag === '本地檔案') className += ' local';
    if (tag === 'gpu' || tag === 'GPU運算') className += ' gpu';
    if (tag === 'unlimited' || tag === '無限工作流') className += ' unlimited';
    if (tag === 'private' || tag === '私有部署') className += ' private';
    return `<span class="${className}">${tag}</span>`;
  }
  function createPlatformCard(platform) {
    return `
      <div class="platform-card" data-name="${platform.name}">
        <div class="best-match-badge" style="display:none">最佳選擇</div>
        <div class="card-header">
          <h3 class="platform-name">${platform.name}</h3>
          <div class="platform-price">${platform.price}</div>
        </div>
        <div class="card-body">
          <div class="tags-container">
            ${platform.tags.map(createTagClass).join('')}
          </div>
          <ul class="features-list">
            ${platform.features.map(feature => `<li class="feature-item">${feature}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
  function updatePlatformsDisplay(filteredPlatforms, bestMatchName) {
    platformsContainer.innerHTML = '';
    if (filteredPlatforms.length === 0) {
      platformsContainer.innerHTML = '<div class="no-platform-tip" style="padding:40px 0;text-align:center;color:#ff6d00;font-size:18px;">沒有符合條件的部署方案，請調整篩選條件</div>';
      return;
    }
    filteredPlatforms.forEach(platform => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = createPlatformCard(platform);
      const platformCard = tempDiv.firstElementChild;
      if (platform.name === bestMatchName) {
        platformCard.classList.add('highlighted');
        platformCard.querySelector('.best-match-badge').style.display = 'block';
      }
      platformsContainer.appendChild(platformCard);
    });
  }
  function applyFilters() {
    return platforms.filter(platform => {
      for (const filterType in selectedFilters) {
        if (selectedFilters[filterType].length === 0) continue;
        const platformValues = platform[filterType] || [];
        if (filterType === 'needs') {
          if (!selectedFilters[filterType].every(value => platformValues.includes(value))) 
            return false;
        } else {
          if (!selectedFilters[filterType].some(value => platformValues.includes(value))) 
            return false;
        }
      }
      return true;
    });
  }
  function calculateBestMatch(filteredPlatforms) {
    let bestMatch = null;
    let highestScore = 0;
    filteredPlatforms.forEach(platform => {
      let score = 0;
      let criteriaCount = 0;
      for (const filterType in selectedFilters) {
        if (selectedFilters[filterType].length === 0) continue;
        criteriaCount++;
        const platformValues = platform[filterType] || [];
        if (filterType === 'needs') {
          score += selectedFilters[filterType].filter(value => 
            platformValues.includes(value)).length / selectedFilters[filterType].length;
        } else {
          if (selectedFilters[filterType].some(value => platformValues.includes(value))) 
            score++;
        }
      }
      if (criteriaCount > 0 && score / criteriaCount > highestScore) {
        highestScore = score / criteriaCount;
        bestMatch = platform.name;
      }
    });
    return bestMatch;
  }
  function thanosSnap(card) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'dust-particle';
      const x = Math.random() * card.offsetWidth;
      const y = Math.random() * card.offsetHeight;
      particle.style.left = `${card.offsetLeft + x}px`;
      particle.style.top = `${card.offsetTop + y}px`;
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      particlesContainer.appendChild(particle);
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 2000);
    }
    card.classList.add('thanos-snap');
    setTimeout(() => {
      card.style.display = 'none';
    }, 2000);
  }
  function updateFilterState(previousCards, filteredPlatformNames) {
    const previousCardsList = Array.from(previousCards);
    previousCardsList.forEach(card => {
      const platformName = card.getAttribute('data-name');
      if (!filteredPlatformNames.includes(platformName)) {
        thanosSnap(card);
      }
    });
    let hasActiveFilters = false;
    for (const filterType in selectedFilters) {
      if (selectedFilters[filterType].length > 0) {
        hasActiveFilters = true;
        break;
      }
    }
    if (hasActiveFilters) {
      selectedFiltersContainer.innerHTML = '';
      for (const filterType in selectedFilters) {
        selectedFilters[filterType].forEach(filterValue => {
          const filterChip = document.createElement('div');
          filterChip.className = 'filter-chip';
          filterChip.innerHTML = `${filterLabels[filterType][filterValue]}<span class="remove-filter" data-type="${filterType}" data-value="${filterValue}">✕</span>`;
          selectedFiltersContainer.appendChild(filterChip);
        });
      }
      document.querySelectorAll('.remove-filter').forEach(removeBtn => {
        removeBtn.addEventListener('click', function() {
          const filterType = this.getAttribute('data-type');
          const filterValue = this.getAttribute('data-value');
          const valueIndex = selectedFilters[filterType].indexOf(filterValue);
          if (valueIndex > -1) {
            selectedFilters[filterType].splice(valueIndex, 1);
          }
          document.querySelector(`.filter-btn[data-filter="${filterType}"][data-value="${filterValue}"]`).classList.remove('active');
          updateFilterDisplay();
          updateAvailableOptions();
        });
      });
    } else {
      selectedFiltersContainer.innerHTML = '<p class="empty-filter-message">尚未選擇任何篩選條件，點擊下方按鈕開始篩選</p>';
    }
  }
  function updateAvailableOptions() {
    const filteredPlatforms = applyFilters();
    const availableOptions = {
      identity: new Set(),
      budget: new Set(),
      tech: new Set(),
      needs: new Set()
    };
    filteredPlatforms.forEach(platform => {
      for (const filterType in availableOptions) {
        (platform[filterType] || []).forEach(value => {
          availableOptions[filterType].add(value);
        });
      }
    });
    filterButtons.forEach(button => {
      const filterType = button.getAttribute('data-filter');
      const filterValue = button.getAttribute('data-value');
      if (selectedFilters[filterType].length > 0 && !selectedFilters[filterType].includes(filterValue)) {
        if (!availableOptions[filterType].has(filterValue)) {
          button.disabled = true;
          button.classList.add('disabled');
          if (button.querySelector('.tooltiptext')) {
            button.querySelector('.tooltiptext').remove();
          }
          if (!button.classList.contains('tooltip')) {
            button.classList.add('tooltip');
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltiptext';
            let tipMessage = '';
            if (filterType === 'identity') {
              tipMessage = `與您已選擇的預算或技術能力不相容的身份類型`;
            } else if (filterType === 'budget') {
              tipMessage = `與您已選擇的身份或技術能力不相容的預算選項`;
            } else if (filterType === 'tech') {
              tipMessage = `與您已選擇的身份或預算不相容的技術能力選項`;
            } else if (filterType === 'needs') {
              tipMessage = `與您已選擇的其他條件不相容的需求`;
            }
            tooltip.textContent = tipMessage;
            button.appendChild(tooltip);
          }
        } else {
          button.disabled = false;
          button.classList.remove('disabled');
          if (button.classList.contains('tooltip')) {
            button.classList.remove('tooltip');
            if (button.querySelector('.tooltiptext')) {
              button.querySelector('.tooltiptext').remove();
            }
          }
        }
      } else {
        button.disabled = false;
        button.classList.remove('disabled');
        if (button.classList.contains('tooltip')) {
          button.classList.remove('tooltip');
          if (button.querySelector('.tooltiptext')) {
            button.querySelector('.tooltiptext').remove();
          }
        }
      }
    });
  }
  function updateFilterDisplay() {
    const previousCards = document.querySelectorAll('.platform-card');
    const filteredPlatforms = applyFilters();
    const bestMatchName = calculateBestMatch(filteredPlatforms);
    updatePlatformsDisplay(filteredPlatforms, bestMatchName);
    updateFilterState(previousCards, filteredPlatforms.map(platform => platform.name));
    if (bestMatchName && recommendationText) {
      recommendationText.textContent = platformDescriptions[bestMatchName] || 
        `根據您的選擇，${bestMatchName}是最適合您的部署方案。`;
      if (recommendationSection) {
        recommendationSection.style.display = 'block';
      }
    } else {
      if (recommendationSection) {
        recommendationSection.style.display = 'none';
      }
    }
  }
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filterType = this.getAttribute('data-filter');
      const filterValue = this.getAttribute('data-value');
      if (filterType === 'identity' || filterType === 'budget' || filterType === 'tech') {
        if (this.classList.contains('active')) {
          this.classList.remove('active');
          selectedFilters[filterType] = [];
        } else {
          document.querySelectorAll(`.filter-btn[data-filter="${filterType}"]`).forEach(btn => {
            btn.classList.remove('active');
          });
          selectedFilters[filterType] = [];
          this.classList.add('active');
          selectedFilters[filterType].push(filterValue);
        }
      } else {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
          selectedFilters[filterType].push(filterValue);
        } else {
          const valueIndex = selectedFilters[filterType].indexOf(filterValue);
          if (valueIndex > -1) {
            selectedFilters[filterType].splice(valueIndex, 1);
          }
        }
      }
      updateFilterDisplay();
      updateAvailableOptions();
    });
  });
  resetButton.addEventListener('click', function() {
    filterButtons.forEach(button => {
      button.classList.remove('active');
      button.disabled = false;
      button.classList.remove('disabled');
    });
    for (const filterType in selectedFilters) {
      selectedFilters[filterType] = [];
    }
    updateFilterDisplay();
  });
  updateFilterDisplay();
});
</script>

## 結論

本次介紹多種的 n8n 部署方式
希望是讓大家了解不同部署之間的差異
然而這沒有一個絕對答案，**每個用戶都會找到適合自己的方式**

如果你剛開始，可以先選一個簡單的：[n8n 官方 cloud](https://n8n.partnerlinks.io/kkuxyu5jr6p8)
然後順便去試試看 [Zeabur](https://zeabur.com/referral?referralCode=darrelltw&utm_source=infoelID) 部署
感受到其中的差異後，再決定哪一種比較適合自己也好

最後如果發現有 AI 運算的需求，那就去試試看 [Glows ai](https://reurl.cc/eGrmGj)


