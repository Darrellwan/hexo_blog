---
title: Glows.ai 雲端 GPU 運算服務，輕鬆取得算力實現 AI 私有運算
tags:
  - AI Service
categories:
  - AI
page_type: post
id: glows-ai-cloud-gpu-service
description: Glows.ai 提供方便的雲端 GPU 運算服務，讓你輕鬆取得高效能算力，實現 AI 私有化運算。無需自建機房，即可享有穩定、安全的 GPU 資源，是企業和個人開發 AI 應用的最佳選擇。
bgImage: glows-ai_bg.jpg
preload:
  - glows-ai_bg.jpg
date: 2025-02-21 18:07:26
---

{% darrellImageCover glows-ai_bg glows-ai_bg.jpg max-800 %}

## 為什麼要 Local AI?

### 資料安全

如果今天想要分析的資料是有機密性質或是隱私的?
例如公司的營運數據，訂單資料，客戶名單
把這些資料傳到 ChatGPT 等服務是有一定程度的風險
即使他們保證不會用你的資料來做運算，但某種程度上來說我們還是把資料交了出去

如果 AI 是在我們私有的環境上執行，且不會連網到其他伺服器
那就可以安心的利用這些資料來做 AI 的運算

### 控制成本

AI 運算的硬體成本在初期建置都不便宜，
為了解決這個問題
Google, Azure, AWS 也都提供了雲端租借算力的服務
就跟以前我們會需要租借 CPU Server 很像，只是變成租借 GPU 為主

今天只是想要測試一些小型的專案，花了幾十萬甚至上百萬買硬體就很不划算
可能一整年其實用不了多久
而租借的話就是 on-demand 的，用多少時間花多少錢
唯一的問題就是不用的話記得要關閉租借
否則帳單可能也會很可觀!

## Glows.ai

### 台灣公司、台灣部署

[Glows.ai](https://glows.ai) 是台灣的雲端 GPU 服務提供商
如果使用上有任何問題，或是想反饋的地方
都能更方便的聯繫，至少我們是在同一個時區和語言

使用 Google AWS Azure 等大廠的服務
通常客服的資源就沒有這麼靈活

另外 Glows.ai 提供的算力機房位於台灣本地
有部分的資安規範會要求廠商主機都在台灣，且連線速度上也更有優勢

### 價格划算

{% darrellImage800 glows_price glows_price.png max-800 %}

雲端租借服務的價格如果便宜，長久運行下來差距會相當有感
以圖片為例

Glows.ai 每小時價格 $3.50
AWS 每小時價格 $6.14

一整天 24 小時就差了 $63.36 
以目前台幣匯率 32 計算就差了 $1984 新台幣
一個月差**大約六萬塊**
這還不是用圖片中的平均浮點運算力來計算，當中的算力差距會更大

簡單來說: 可以用更便宜的價格買到更強的算力，即使GPU記憶體一樣是 40GB

** 活動優惠 **

目前 Glows.ai 針對 Nvidia 4090 的顯卡算力提供超優惠價格
**每小時約12元台幣，一個月大約 3600 元台幣**

一小時 12 元台幣有多便宜?
4090 TDP 大約 450W，電費取低一點平均 3.5 元/度
一小時的電費大概就 1.2 元
實際上大約只花了 10 元多一點 / 每小時

### 簡單易用、使用介面

#### 1. 建立 Instance

選擇需要的顯卡配備，可以選擇 4090 或是 H100
如果一開始不熟悉嘗試，建議從 4090 即可

{% darrellImage800 glows_ai-create_instance glows_ai-create_instance.png max-800 %}


#### 2. 選擇 Image

再來就可以選擇需要的映像檔
也就是說不只是單純一台乾乾淨淨的 Server
你可以挑選一些你熟悉的工具，已經預先安裝好
這樣啟動後就能直接使用，不用再花時間下載安裝操作指令等等


{% darrellImage800 glows_ai-choose_image glows_ai-choose_image.png max-800 %}

目前有的映像檔很多，列在下方

{% darrellImage800 glows_ai-choose_image_list glows_ai-choose_image_list.png max-800 %}

而且相信隨著新的模型推出，或是有其他熱門的模型
[Glows.ai](https://glows.ai) 都會幫大家更新
最近新看到的就有 DeepSeek 的模型
和包涵 n8n 的 AI 自動化工具

這邊使用兩張 4090 搭配 LLAMA-3.1 70B 模型來示範

#### 3. 啟動 Instance

前面兩步驟都選擇完並啟動後，就會看到 Server 顯示 Pending 啟動中
這邊通常在一分鐘內就能完成，大部分經驗上都在 30 秒內

{% darrellImage800 glows_ai-create_instance_pending_to_running glows_ai-create_instance_pending_to_running.png max-800 %}

啟動完成後就會看到第三步驟的畫面，
會有 Server 如何連線的資訊

#### 4. 開始使用自已專屬的 AI 服務

{% darrellImage800 glows_ai-create_enter_webui glows_ai-create_enter_webui.png max-800 %}

這邊會有你這台 Server 的資訊
包括 IP 位置，連線的指令
連線進去後，像是這個 WebUI 的介面就跟操作 ChatGPT 很像
選擇模型後就可以開始跟他對話

## 想試試看 Glow.ai ?

如果上面的介紹看完你有興趣想試試看
那現在的確是個試試的好時機

透過這個連結註冊 
<a href="https://reurl.cc/eGrmGj" style="color:rgb(116, 180, 249);"><i class="fa-solid fa-link"></i><span> 優惠連結 </span></a>
就可以得到 10點，約可以測試 3 個小時的 4090

趁現在有免費點數 + 算力優惠，可以體驗專屬於自己的 AI 算力

## 模型的選擇
<style>
    .grok-table-container {
        max-width: 1000px;
        margin: 20px auto;
        font-family: 'Arial', sans-serif;
        background-color: #1a1a1a;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        overflow-x: auto;
    }

    .grok-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 16px;
        min-width: 800px;
        table-layout: fixed;
    }

    .grok-table th,
    .grok-table td {
        padding: 16px;
        text-align: left;
        border-bottom: 1px solid #333;
    }

    .grok-table th {
        background-color: #2c3e50;
        color: #ffffff;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .grok-table-container .grok-table tbody tr {
        background-color: #1a1a1a !important;
    }

    .grok-table-container .grok-table tr:hover {
        background-color: #2d2d2d !important;
        transition: background-color 0.3s ease;
    }

    .grok-table td {
        color: #e0e0e0;
    }

    .grok-table td:nth-child(3) {
        font-size: 14px;
        color: #b0b0b0;
        line-height: 1.5;
    }

    .grok-table th:nth-child(1),
    .grok-table td:nth-child(1) {
        width: 25%;
    }
    .grok-table th:nth-child(2),
    .grok-table td:nth-child(2) {
        width: 15%;
    }
    .grok-table th:nth-child(3),
    .grok-table td:nth-child(3) {
        width: 60%;
    }

    @media (max-width: 768px) {
        .grok-table-container {
            margin: 10px 0;
            width: 100%;
            box-shadow: none;
        }

        .grok-table th,
        .grok-table td {
            padding: 12px 8px;
            font-size: 14px;
        }

        .grok-table td:nth-child(3) {
            font-size: 13px;
        }

        .grok-table th:nth-child(1),
        .grok-table td:nth-child(1) {
            width: 30%;
        }
        .grok-table th:nth-child(2),
        .grok-table td:nth-child(2) {
            width: 20%;
        }
        .grok-table th:nth-child(3),
        .grok-table td:nth-child(3) {
            width: 50%;
        }
    }
</style>
<div class="grok-table-container" itemscope itemtype="https://schema.org/Table">
<meta itemprop="about" content="AI 模型硬體需求比較表">
        <table class="grok-table">
            <thead>
                <tr>
                    <th>模型/工具</th>
                    <th>VRAM 需求(GB)</th>
                    <th>備註</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>LLaMA-3.1 8B</td>
                    <td>16 / 8-12</td>
                    <td>入門級模型的理想選擇，量化後僅需 12GB 顯卡即可運行，性能與資源需求平衡得宜。</td>
                </tr>
                <tr>
                    <td>LLaMA-3.1 70B</td>
                    <td>140 / 28-40</td>
                    <td>頂級開源大模型，量化後適用於 40GB+ 顯卡。出色的多語言處理能力，特別擅長複雜推理和長文本理解。</td>
                </tr>
                <tr>
                    <td>DeepSeek-R1 32B</td>
                    <td>64 / 12-24</td>
                    <td>中型架構的優質選擇，量化後在 24GB 顯卡上運行順暢，提供穩定可靠的性能表現。</td>
                </tr>
                <tr>
                    <td>DeepSeek-R1 70B</td>
                    <td>140 / 28-40</td>
                    <td>大規模語言模型的代表作，量化優化後資源需求適中，適合處理複雜任務。</td>
                </tr>
                <tr>
                    <td>Gemma2 9B</td>
                    <td>18 / 6-12</td>
                    <td>Google 開發的高效率模型，12GB 顯卡即可運行，適合輕量級應用場景。</td>
                </tr>
                <tr>
                    <td>TAIDE LX 8B</td>
                    <td>16 / 8-12</td>
                    <td>專為中文優化的精簡模型，量化後資源佔用低，中文處理能力出色。</td>
                </tr>
                <tr>
                    <td>Stable Diffusion XL</td>
                    <td>8-12</td>
                    <td>進階圖像生成模型，支援高品質輸出，顯存需求隨解析度提升而增加。適合專業創作需求。</td>
                </tr>
                <tr>
                    <td>FLUX (ComfyUI)</td>
                    <td>8-16</td>
                    <td>資源需求因工作負載彈性調整，提供多樣化的圖像處理功能，適合各類創作場景。</td>
                </tr>
                <tr>
                    <td>ComfyUI (通用)</td>
                    <td>8-24</td>
                    <td>模組化設計的綜合平台，資源需求取決於載入模型，支援客製化工作流程開發。</td>
                </tr>
            </tbody>
        </table>
    </div>

**此表格為 AI 幫忙整理，如果有錯誤請歡迎提出修訂**

這邊列出一些模型的介紹方便大家在選擇時有個參考
未來會持續的利用 [Glows.ai](https://glows.ai) 來測試完成一些場景
再來跟大家分享做到哪些成果!

