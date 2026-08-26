# SEO 優化指引

---

## E-E-A-T 優化（Google 搜尋品質指南）

E-E-A-T = Experience（經驗）、Expertise（專業）、Authoritativeness（權威性）、Trustworthiness（可信度）

---

### 1. Experience（經驗）- 展示實際使用經驗

**Front Matter 標示最後更新時間：**
```yaml
modDatetime: "2025-11-24T23:30:00+08:00"
```

測試版本寫在正文的版本說明，不新增 schema 未定義的 front matter 欄位。

**開頭加入版本說明：**
```markdown
本文基於 **n8n 1.120.4** 版本撰寫，所有範例皆經過實測。如有版本差異請參考 [n8n 官方文檔](https://docs.n8n.io/)。
```

**文中展示個人經驗：**
- 「我自己實測下來...」
- 「大概 90% 的工作流都會用到」
- 「這是我也很常使用的功能」

---

### 2. Expertise（專業）- 展示專業知識

- **連結官方文檔**：每篇至少 1-2 個官方連結
- **技術細節準確**：確保程式碼範例可執行
- **FAQ Schema**：使用 `{% faq %}` 標籤產生結構化資料

---

### 3. Authoritativeness（權威性）- 建立權威

- **內部連結**：文中提到相關節點時加入連結（如 [n8n 內建變數教學](/n8n-built-in-variables/)）
- **外部權威連結**：n8n 官方文檔、GitHub、Community
- **相關文章推薦**：文末使用 `articleCard` 推薦 2-3 篇相關文章

---

### 4. Trustworthiness（可信度）- 增加可信度

- **更新日期**：使用 `modDatetime` 欄位顯示最後更新時間
- **版本聲明**：說明測試的 n8n 版本
- **實際截圖**：使用 `darrellImage800Alt` 提供詳細 alt 描述
- **Before/After 範例**：用實際 JSON 展示效果

---

## Description 撰寫技巧（SERP 優化）

**目標**：155 字元內，包含關鍵字，吸引點擊

### 有效模式

1. **數字強調**：「3 大技巧」「90% 工作流都會用到」
2. **功能列舉**：用頓號分隔核心功能
3. **問題導向**：「資料格式亂？用 Edit Fields 整理」

### 範例

```yaml
description: n8n Edit Fields Set 節點 3 大技巧：欄位組合格式化、$now 時間與條件判斷、Include Other Input Fields。90% 工作流都會用到的核心節點完整教學。
```

---

## SEO 強化要點

### 標題優化

- [ ] Title 包含：n8n + 節點名稱 + 教學
- [ ] H2 標題包含「n8n [節點名稱] 節點」關鍵字
- [ ] 標題用白話文（避免「數據清洗」「動態賦值」等技術詞）

### 一句話定義（Featured Snippet 友善）

```markdown
> **n8n [節點名稱] 節點**是用來 [核心功能] 的節點，可以 [具體用途]，是 n8n 自動化工作流中 [定位說明]。
```

### 連結策略

**內部連結**：文中提到其他節點時加入連結（1-2 處即可，不要過度）
```markdown
搭配 [n8n 內建變數教學](/n8n-built-in-variables/) 可以更靈活地處理資料
```

**外部連結**：

⚠️ **重要：必須用 WebFetch 驗證連結可訪問，不要假設 URL 格式**

| 節點類型 | URL 格式 | 範例 |
|---------|---------|------|
| n8n 內建節點 | `docs.n8n.io/integrations/builtin/...` | Gmail, HTTP Request |
| Community 節點 | 查各自官方文檔 | Apify → `docs.apify.com` |

**判斷方式**：
- 在 n8n 中看節點是否標示「Community」
- 或用 WebSearch 搜尋 `n8n [節點名] node documentation`

```markdown
# 內建節點範例
[Edit Fields](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set/)

# Community 節點範例（必須先驗證）
[Apify n8n 整合](https://docs.apify.com/platform/integrations/n8n)
```

---

## 結構化資料

### FAQ Schema

使用 `{% faq %}` 標籤會自動產生 FAQ Schema：

```markdown
{% faq %}
[
  {
    "question": "問題一的標題？",
    "answer": "問題一的回答。"
  }
]
{% endfaq %}
```

### 圖片 Alt 描述

使用 `darrellImage800Alt` 提供完整描述：

```markdown
{% darrellImage800Alt "n8n Gmail 節點的設定畫面，包含 OAuth 認證選項" n8n_gmail-settings.png max-800 %}
```

---

## SEO 檢查清單

- [ ] Description 80-150 字，包含具體功能關鍵字
- [ ] Tags 包含：n8n、n8n節點介紹、n8n教學
- [ ] bgImage 和 preload 欄位完整
- [ ] 開頭有一句話定義（用 `>` blockquote）
- [ ] 使用 `{% faq %}` 標籤
- [ ] 至少 1 個官方文檔連結
- [ ] 至少 2 個內部連結
- [ ] 圖片有完整 alt 描述
- [ ] quickNav 錨點與 h2 標題對應
