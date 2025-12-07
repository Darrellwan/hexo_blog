---
title: n8n AI 模型 Router 教學：Zeabur AI Hub 智慧切換模型
tags:
  - n8n
  - n8n教學
  - AI
  - Zeabur
categories:
  - n8n
page_type: post
id: n8n-zeabur-ai-hub-model-router
description: n8n 搭配 Zeabur AI Hub 打造 AI 模型 Router，一個 API Key 串接 GPT、Claude、Gemini。根據問題複雜度智慧切換模型：簡單問題用便宜模型、複雜問題用強模型，省成本又兼顧品質
bgImage: n8n-zeabur-ai-hub-model-router-bg.jpg
preload:
  - n8n-zeabur-ai-hub-model-router-bg.jpg
date: 2025-12-06 13:58:28
---

{% darrellImageCover n8n-zeabur-ai-hub-model-router-bg n8n-zeabur-ai-hub-model-router-bg.jpg max-800 %}

{% quickNav %}
[
  {"text": "Zeabur AI Hub 是什麼", "anchor": "Zeabur-AI-Hub-是什麼？", "desc": "統一 API Gateway 介紹"},
  {"text": "n8n Credentials 設定", "anchor": "n8n-Credentials-設定", "desc": "API Key 與 Base URL 設定"},
  {"text": "AI 模型 Router 實作", "anchor": "實戰：在-n8n-建立一個智慧選擇模型的工作流", "desc": "動態切換模型的工作流"},
  {"text": "實測展示", "anchor": "實測展示", "desc": "簡單與複雜問題測試"},
  {"text": "常見問題", "anchor": "faq", "desc": "FAQ"}
]
{% endquickNav %}

## Zeabur AI Hub 是什麼？

簡單來說，Zeabur AI Hub 是一個**統一的 AI API Gateway**，只要儲值一次就能使用多家不同的 AI 模型，還能避免 Google 的 AI 服務收費無上限可能造成的窘境。

而自動化場景中，很多時候就會需要動態的切換模型來應對不同等級或難度的工作，這時候統一使用 Zeabur AI Hub 就是一個不錯的選擇。

### 為什麼選擇 Zeabur AI Hub？

- **統一帳單管理**：不用分別管理 OpenAI、Anthropic、Google 等多家帳單，儲值一次就能使用所有模型
- **避免無上限收費風險**：Google AI 服務沒有消費上限，用 Zeabur 可以控制預算
- **一個 API Key 切換多模型**：不用為每家服務設定不同的 Credentials，在 n8n 中管理更方便
- **OpenAI 相容格式**：大多數模型都支援 OpenAI API 格式，切換成本極低

<style>
.model-table-container {
  overflow-x: auto;
  margin: 1.5rem 0;
}
.model-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.model-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
}
.model-table td {
  padding: 10px 16px;
  border-bottom: 1px solid #e2e8f0;
}
.model-table tr:hover {
  background-color: rgba(102, 126, 234, 0.08);
}
.model-table .provider {
  font-weight: 600;
  color: #667eea;
  white-space: nowrap;
}
.model-id {
  display: inline-flex;
  align-items: center;
  background: #edf2f7;
  color: #2d3748;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
  font-size: 0.85rem;
  margin: 3px 4px 3px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}
.model-id:hover {
  background: #e2e8f0;
  border-color: #cbd5e0;
}
.model-id:active {
  transform: scale(0.95);
}
.model-id .copy-icon {
  width: 14px;
  height: 14px;
  margin-left: 6px;
  opacity: 0.5;
}
.model-id:hover .copy-icon {
  opacity: 1;
}
.model-id.copied {
  background: #c6f6d5 !important;
  border-color: #9ae6b4 !important;
  color: #22543d !important;
}
.models-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
/* Dark mode */
@media (prefers-color-scheme: dark) {
  .model-table td {
    border-bottom: 1px solid #3d4852;
  }
  .model-table tr:hover {
    background-color: rgba(102, 126, 234, 0.15);
  }
  .model-id {
    background: #2d3748;
    color: #e2e8f0;
    border-color: #4a5568;
  }
  .model-id:hover {
    background: #3d4852;
    border-color: #667eea;
  }
  .model-id.copied {
    background: #276749 !important;
    border-color: #48bb78 !important;
    color: #c6f6d5 !important;
  }
}
/* NexT theme dark mode */
.use-dark-mode .model-table td,
[data-theme="dark"] .model-table td {
  border-bottom: 1px solid #3d4852;
}
.use-dark-mode .model-table tr:hover,
[data-theme="dark"] .model-table tr:hover {
  background-color: rgba(102, 126, 234, 0.15);
}
.use-dark-mode .model-id,
[data-theme="dark"] .model-id {
  background: #2d3748;
  color: #e2e8f0;
  border-color: #4a5568;
}
.use-dark-mode .model-id:hover,
[data-theme="dark"] .model-id:hover {
  background: #3d4852;
  border-color: #667eea;
}
.use-dark-mode .model-id.copied,
[data-theme="dark"] .model-id.copied {
  background: #276749 !important;
  border-color: #48bb78 !important;
  color: #c6f6d5 !important;
}
@media (max-width: 640px) {
  .model-table {
    font-size: 0.85rem;
  }
  .model-table th, .model-table td {
    padding: 8px 10px;
  }
  .model-id {
    font-size: 0.75rem;
    padding: 3px 8px;
  }
}
</style>

<div class="model-table-container">
<table class="model-table">
<thead>
<tr><th>廠商</th><th>支援模型（點擊複製）</th></tr>
</thead>
<tbody>
<tr>
  <td class="provider">OpenAI</td>
  <td class="models-cell">
    <span class="model-id" onclick="copyModelId(this)">gpt-5<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">gpt-5-mini<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">gpt-4.1<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">gpt-4.1-mini<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">gpt-4o<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">gpt-4o-mini<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">gpt-oss-120b<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
  </td>
</tr>
<tr>
  <td class="provider">Anthropic</td>
  <td class="models-cell">
    <span class="model-id" onclick="copyModelId(this)">claude-sonnet-4-5<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">claude-haiku-4-5<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
  </td>
</tr>
<tr>
  <td class="provider">Google</td>
  <td class="models-cell">
    <span class="model-id" onclick="copyModelId(this)">gemini-2.5-pro<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">gemini-3-pro-preview<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">gemini-2.5-flash<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">gemini-2.5-flash-lite<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">gemini-2.5-flash-image<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
  </td>
</tr>
<tr>
  <td class="provider">xAI</td>
  <td class="models-cell">
    <span class="model-id" onclick="copyModelId(this)">grok-4-fast-non-reasoning<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
  </td>
</tr>
<tr>
  <td class="provider">DeepSeek</td>
  <td class="models-cell">
    <span class="model-id" onclick="copyModelId(this)">deepseek-v3.2-exp<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
  </td>
</tr>
<tr>
  <td class="provider">智譜 AI</td>
  <td class="models-cell">
    <span class="model-id" onclick="copyModelId(this)">glm-4.6<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
  </td>
</tr>
<tr>
  <td class="provider">Moonshot</td>
  <td class="models-cell">
    <span class="model-id" onclick="copyModelId(this)">kimi-k2-thinking<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
  </td>
</tr>
<tr>
  <td class="provider">Meta</td>
  <td class="models-cell">
    <span class="model-id" onclick="copyModelId(this)">llama-3.3-70b<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
  </td>
</tr>
<tr>
  <td class="provider">Alibaba</td>
  <td class="models-cell">
    <span class="model-id" onclick="copyModelId(this)">qwen-3-32<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
    <span class="model-id" onclick="copyModelId(this)">qwen3-next<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></span>
  </td>
</tr>
</tbody>
</table>
</div>

<script>
function copyModelId(el) {
  const text = el.textContent.trim();
  navigator.clipboard.writeText(text).then(() => {
    el.classList.add('copied');
    setTimeout(() => el.classList.remove('copied'), 1000);
  });
}
</script>

最新的模型清單可以到 [Zeabur AI Hub Models](https://zeabur.com/zh-TW/models) 查看

### 如何取得 API Key

如果你已經有 Zeabur 帳號，到 [AI Hub](https://zeabur.com/ai-hub) 開通服務
就能按照下方圖片指引取得 API Key

{% darrellImage800Alt "Zeabur AI Hub 取得 API Key 的介面" zeabur-ai-hub-get-api-key.png max-800 %}

## n8n Credentials 設定

因為 Zeabur AI Hub 使用 OpenAI 相容的 API 格式
所以在 n8n 中，我們可以直接用 **OpenAI** 的 credential 來設定

### 建立新的 Credential

1. 在 n8n 中建立一個 OpenAI Credential
2. 設定以下內容：
   - **API Key**：貼上 Zeabur AI Hub 的 API Key
   - **Base URL**：填入 Zeabur 的 endpoint，從下方截圖位置取得

{% darrellImage800Alt "Zeabur AI Hub 的 API Endpoint" zeabur-ai-hub-get-api-endpoint.png max-800 %}

{% darrellImage800Alt "n8n OpenAI Credential 設定 Zeabur AI Hub 的 API Key 和 Base URL" n8n-zeabur-credential-setting.png max-800 %}

設定完成後，可以看看 chat model 中是否有出現完整的模型列表。

{% darrellImage800Alt "n8n 測試 Zeabur AI Hub Credential 是否成功" n8n-zeabur-ai-hub-check_credential_success.png max-800 %}

## 實戰：在 n8n 建立一個 AI 模型 Router 工作流

這邊要分享一個進階應用：**讓 AI 自己先選擇最適合的模型**

### 整體架構

{% darrellImage800Alt "n8n 搭配 Zeabur AI Hub 動態切換模型的工作流示意圖" n8n-zeabur-dynamic-model-workflow-cover.jpg max-800 %}

{% templateCard id="n8n-ai-choose-ai-zeabur-aihub" title="Zeabur AI Hub 智慧模型 Router" description="一鍵下載 AI 模型 Router 工作流，包含完整的判斷規則和動態切換設定" thumbnail="/tools/n8n_template/data/bg/n8n-ai-choose-ai-zeabur-aihub.webp" tags="AI,Zeabur,模型選擇,成本優化" nodeCount="5" updatedAt="2025-12-06" %}

```
Chat Trigger → AI 模型 Router → AI Agent
                    ↓
         用基本的模型根據需求來判斷該用哪個模型
                    ↓
         動態切換到適合的模型回應
```

核心概念是：
- 用**便宜快速**的模型（gpt-4o-mini）來判斷問題複雜度
- 根據判斷結果，**動態切換**到最適合的模型來回答

### AI 模型 Router 節點設定

首先先建立一個 AI 節點，然後選擇 Chat Model 是 OpenAI 但換成 Zeabur AI Hub 的 credential
我這邊示範用 `gpt-4o-mini` 來當作判斷複雜程度的模型


{% darrellImage800Alt "n8n Chain LLM 節點設定作為 AI 模型 Router" n8n-zeabur-router-node.png max-800 %}

### Router Prompt 設計

Router 的 Prompt:

```
你是 Model Router，根據用戶請求內容與上下文長度，選擇最適合且最省成本的模型。

可用模型：
gemini-2.5-flash-lite、gemini-2.5-flash、claude-haiku-4-5、
claude-sonnet-4-5、gpt-4o-mini、gpt-4o、kimi-k2-thinking...

判斷規則（由上而下，符合即停止）：

1. gemini-2.5-flash-lite / grok-4-fast-non-reasoning
   - 簡單查詢、基礎翻譯、格式轉換
   - 輸入 < 8K tokens
   - 不需要推理或創意

2. claude-haiku-4-5 / gemini-2.5-flash / gpt-4o-mini
   - 文章摘要、短篇創作、簡單程式碼
   - 輸入 < 32K tokens

3. claude-sonnet-4-5 / gemini-2.5-pro / gpt-4.1-mini
   - 專業文案、複雜程式碼、中度推理
   - 輸入 < 128K tokens

4. kimi-k2-thinking / deepseek-v3.2-exp / gpt-5-mini
   - 極難數學、複雜邏輯推導、高風險領域
   - 長上下文 ≥ 128K tokens

輸出格式：僅輸出單一模型名稱
```

### Structured Output Parser 設定

為了確保 Router 輸出的格式固定，我們用 Structured Output Parser 來限制輸出格式。

**設定步驟：**
1. 在 AI 模型 Router 節點下方，連接一個 **Structured Output Parser** 子節點
2. 在 **JSON Schema Example** 欄位中，貼上以下範例：

```json
{
  "model": "gpt-4o-mini"
}
```

這樣 AI 就會被強制輸出符合這個格式的 JSON，方便後續節點取用 `output.model` 的值。

### 動態模型切換

最後一步是讓 AI Agent 使用 Router 選出的模型

在 OpenAI Chat Model 節點的 **Model** 欄位，使用表達式：

```
={{ $('AI 模型 Router').item.json.output.model }}
```

{% darrellImage800Alt "n8n OpenAI Chat Model 使用表達式動態切換模型" n8n-zeabur-dynamic-model.png max-800 %}

這樣 AI Agent 就會根據 Router 的判斷，動態使用不同的模型來回應

## 實測展示

### 案例 1：簡單問題

問題：「今天天氣如何？」

Router 判斷這是簡單查詢，選擇了 `gemini-2.5-flash-lite`（耗時 3.149s）

{% darrellImage800Alt "簡單天氣問題測試，Router 自動選擇 gemini-2.5-flash-lite 模型" n8n-zeabur-test-simple-how-is-the-weather.png max-800 %}

### 案例 2：需要深度分析的問題

問題：「幫我撰寫 n8n 的深入解析，300字內」

Router 判斷這需要專業內容產出，選擇了 `claude-sonnet-4-5`（耗時 10.087s）

{% darrellImage800Alt "深度內容撰寫測試，Router 自動選擇 claude-sonnet-4-5 模型" n8n-zeabur-test-write-n8n-article.png max-800 %}

## 延伸應用

這個架構可以根據你的需求調整：

1. 調整判斷規則：根據你的使用場景，修改 Router 的 Prompt
2. 新增/移除模型：更新可用模型清單，Zeabur 有新模型時也能馬上使用
3. 也能將判斷的情境和模型存一份到 Google Sheet 或是資料庫中，未來可以分析是否有優化可能。

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "可以用在正式環境嗎？穩定性如何？",
    "answer": "Zeabur AI Hub 是透過官方 API 轉發，穩定性取決於各家 AI 服務本身。建議在正式環境中加入錯誤處理和 fallback 機制。"
  },
  {
    "question": "如果 Router 選錯模型怎麼辦？",
    "answer": "可以調整 Router 的 Prompt 判斷規則，或在特定情境下強制指定模型。也可以記錄每次選擇結果來持續優化。"
  },
  {
    "question": "支援的模型會自動更新嗎？",
    "answer": "Zeabur 會持續新增模型，但 Router 的 Prompt 需要手動更新可用模型清單。建議定期查看 Zeabur AI Hub Models 頁面。"
  },
  {
    "question": "Zeabur AI Hub 怎麼收費？",
    "answer": "採用預付儲值制，用多少扣多少。各模型價格可在 Zeabur AI Hub Models 頁面查看，通常與原廠價格相近或略低。好處是統一管理、避免多家帳單，且可設定預算上限。"
  }
]
{% endfaq %}

## 結語

用 Zeabur AI Hub 搭配 n8n 的 AI 模型 Router，可以實現：

- 一個 API Key 存取多種 AI 模型
- 統一計費，不用管各家的帳單
- 自動選擇最適合的模型，省錢又省心

適合用在例如小助理的情境，通常助理會需要負責處理多種不同的需求：行事曆調整、天氣與報表查詢、回答複雜或是分析結果的問題。

如果只選定一種固定的模型，可能會造成偶爾太聰明但浪費太多成本，或是太笨反而無法給出正確的答案。透過 AI 模型 Router 動態切換，就能兼顧成本與品質。

## 相關文章推薦

{% articleCard
  url="/n8n_structured_output_parser_node/"
  title="n8n Structured Output Parser 節點教學"
  previewText="控制 AI 輸出格式，不再被 markdown 包裹的 JSON 困擾"
  thumbnail="https://www.darrelltw.com/n8n_structured_output_parser_node/bg-n8n-output_parser.jpg"
%}

{% articleCard
  url="/n8n-deployment/"
  title="n8n 安裝部署教學"
  previewText="官方 Cloud、Zeabur、本機部署該怎麼選？完整比較分析"
  thumbnail="https://www.darrelltw.com/n8n-deployment/blog-n8n-deployment-bg.jpg"
%}
