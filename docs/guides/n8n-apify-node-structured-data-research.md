# n8n-apify-node.md Structured Data 研究筆記

> Ralph Loop 三輪思考紀錄

---

## Round 1：識別適合的 Structured Data 類型

### 文章特性分析

| 特性 | 內容 | 對應 Schema |
|------|------|------------|
| 文章類型 | 技術教學 | TechArticle / HowTo |
| 有步驟教學 | Step 1-4 完整流程 | HowTo |
| 有 FAQ | 4 個問答 | FAQPage |
| 有表格 | 費用比較、功能對照 | Table (非必要) |
| 有程式碼 | JSON、JavaScript | SoftwareSourceCode |
| 介紹軟體 | Apify 平台 | SoftwareApplication |

### 目前部落格已支援的 Structured Data

| Schema | 實作檔案 | 狀態 |
|--------|---------|------|
| BlogPosting | `json_ld.js` | ✅ 自動產生 |
| BreadcrumbList | `json_ld.js` | ✅ 自動產生 |
| FAQPage | `custom_structure_data.js` | ⚠️ 需手動加 front matter |
| Organization | `custom_structure_data.js` | ✅ 全站共用 |
| WebSite | `custom_structure_data.js` | ✅ 全站共用 |

### 發現的問題

1. **FAQPage 未自動連動**
   - `{% faq %}` 標籤只渲染 HTML
   - 需另外在 front matter 加 `darrell_structured_data`
   - 目前 n8n-apify-node.md 沒有加

2. **缺少 HowTo Schema**
   - 文章有明確步驟（Step 1-4）
   - 但沒有 HowTo 結構化輸出

3. **缺少 SoftwareApplication**
   - Apify 是獨立軟體/平台
   - 可增加 offers（免費方案 $5/月）

---

## Round 2：檢查現有實作細節

### FAQPage 啟用方式

根據 `custom_structure_data.js`，需在 front matter 加：

```yaml
darrell_structured_data:
  question:
    - "Apify 免費額度有多少？執行一次大概花多少？"
    - "Run Actor 和 Run Actor and get dataset items 有什麼差別？"
    - "Actor 執行時間很長會 timeout 嗎？"
    - "Scrape Single URL 可以爬任何網站嗎？"
  answer:
    - "Apify 提供每月 $5 USD 免費額度..."
    - "最大差別是是否等待結果..."
    - "n8n 預設 timeout 是 300 秒..."
    - "理論上可以，但實際效果因網站而異..."
```

### HowTo Schema 格式（Google 建議）

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "如何在 n8n 中設定 Apify 爬蟲",
  "description": "完整教學 n8n Apify 節點實現網頁爬蟲自動化",
  "totalTime": "PT10M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "n8n"
    },
    {
      "@type": "HowToTool",
      "name": "Apify"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "取得 Apify API Token",
      "text": "到 Apify Console 註冊帳號並取得 API Token",
      "url": "https://www.darrelltw.com/n8n-apify-node/#credentials-setup",
      "image": "https://www.darrelltw.com/n8n-apify-node/n8n_apify-api-token-setup.png"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "在 n8n 設定 Credentials",
      "text": "在 n8n 進入 Credentials，新增 Apify 憑證"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "選擇並設定 Actor",
      "text": "從 Apify Store 選擇需要的 Actor，設定輸入參數"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "整理資料並寫入 Google Sheets",
      "text": "用 Set Node 整理資料格式，寫入 Google Sheets"
    }
  ]
}
```

### SoftwareApplication Schema（可選）

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Apify",
  "applicationCategory": "WebApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "每月 $5 免費額度"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "100"
  }
}
```

---

## Round 3：具體實作建議

### 優先級排序

| 優先級 | Schema | 影響 | 實作難度 |
|--------|--------|------|---------|
| 🔴 高 | FAQPage | Rich Snippet 顯示 | 低（加 front matter） |
| 🔴 高 | HowTo | AI 引用 + Rich Snippet | 中（需新增 helper） |
| 🟡 中 | SoftwareApplication | AI 引用 | 中 |
| 🟢 低 | Table | 無 Rich Snippet | 低優先 |

### 建議 1：立即可做 - FAQPage（5 分鐘）

在 `n8n-apify-node.md` front matter 加入：

```yaml
darrell_structured_data:
  question:
    - "Apify 免費額度有多少？執行一次大概花多少？"
    - "Run Actor 和 Run Actor and get dataset items 有什麼差別？"
    - "Actor 執行時間很長會 timeout 嗎？"
    - "Scrape Single URL 可以爬任何網站嗎？"
  answer:
    - "Apify 提供每月 $5 USD 免費額度（不用綁信用卡）。一般 Instagram 爬蟲，每 100 筆貼文約 $0.03-0.05，免費額度蠻夠初期測試的。"
    - "最大差別是是否等待結果。Run Actor and get dataset items 會等 Actor 跑完直接拿到資料，初學者推薦用這個；Run Actor 只負責啟動，需搭配 Trigger 或另外撈取 Dataset。"
    - "n8n 預設 timeout 是 300 秒。如果 Actor 執行超過這個時間，可以用 Run Actor + Apify Trigger 分離，或減少爬取數量。實測 Instagram 爬 50 筆資料約 2-3 分鐘，通常不會超時。"
    - "理論上可以，但實際效果因網站而異。適合靜態網頁、部落格、新聞網站；不適合需要登入、有反爬機制、大量 JavaScript 渲染的網站。"
```

### 建議 2：中期優化 - HowTo Helper

新增 `/themes/next/scripts/helpers/howto_ld.js`：

1. 在 front matter 定義步驟
2. 自動產生 HowTo Schema
3. 支援圖片和預估時間

### 建議 3：長期優化 - {% faq %} 自動連動

修改 `scripts/faq.js`，讓它自動：
1. 解析 FAQ 內容
2. 注入到 page 變數
3. 讓 `darrell_structured_data` helper 自動讀取

這樣就不用手動在 front matter 重複寫 FAQ 內容。

---

## 驗證工具

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## Round 4（迭代 2）：AI 辨識的特殊考量

### 爬蟲 vs AI 的差異

| 消費者 | 讀取方式 | 重視的 Schema |
|--------|---------|--------------|
| Googlebot | 解析 JSON-LD | FAQPage, HowTo（Rich Results） |
| ChatGPT/Perplexity | 讀取全文 + Schema | 定義句、結構清晰的段落 |
| Google AI Overview | 混合 | FAQPage, HowTo + 內容品質 |

### AI 特別喜歡的結構

1. **明確的定義句**（開頭 blockquote）
   - ✅ 目前有：`> Apify 節點讓你在 n8n 中調用 2000+ 現成爬蟲...`

2. **問答格式**
   - ✅ 目前有：FAQ 區塊
   - ⚠️ 缺：FAQPage Schema 輸出

3. **比較表格**
   - ✅ 目前有：`Apify vs HTTP Request` 表格
   - 💡 可加：`ItemList` Schema（可選）

4. **步驟編號**
   - ✅ 目前有：Step 1-4
   - ⚠️ 缺：HowTo Schema

### 遺漏的 Schema 類型

| Schema | 用途 | 優先級 |
|--------|------|--------|
| `TechArticle` | 比 BlogPosting 更精準標示技術文章 | 🟡 中 |
| `DefinedTerm` | 定義 Actor、Dataset 等術語 | 🟢 低 |
| `ItemList` | 結構化表格內容 | 🟢 低 |

### TechArticle 改進

目前 `json_ld.js` 輸出 `BlogPosting`，可改為：

```javascript
// 如果是 n8n 相關文章，使用 TechArticle
const articleType = page.tags?.some(t => t.name === 'n8n')
  ? 'TechArticle'
  : 'BlogPosting';

schema = {
  "@context": "https://schema.org",
  "@type": articleType,
  // ... 其他欄位
  "proficiencyLevel": "Beginner",  // 新增
  "dependencies": "n8n 1.76.0+, Apify 帳號"  // 新增
};
```

---

## Round 5（迭代 2）：完整實作程式碼

### 1. FAQPage - 立即可做

**修改檔案：** `source/_posts/n8n-apify-node.md`

在 front matter 的 `modified:` 後面加入：

```yaml
darrell_structured_data:
  question:
    - "Apify 免費額度有多少？執行一次大概花多少？"
    - "Run Actor 和 Run Actor and get dataset items 有什麼差別？"
    - "Actor 執行時間很長會 timeout 嗎？"
    - "Scrape Single URL 可以爬任何網站嗎？"
  answer:
    - "Apify 提供每月 $5 USD 免費額度（不用綁信用卡）。一般 Instagram 爬蟲，每 100 筆貼文約 $0.03-0.05，免費額度蠻夠初期測試的。"
    - "最大差別是是否等待結果。Run Actor and get dataset items 會等 Actor 跑完直接拿到資料，初學者推薦用這個；Run Actor 只負責啟動，需搭配 Trigger 或另外撈取 Dataset。"
    - "n8n 預設 timeout 是 300 秒。如果 Actor 執行超過這個時間，可以用 Run Actor + Apify Trigger 分離，或減少爬取數量。實測 Instagram 爬 50 筆資料約 2-3 分鐘，通常不會超時。"
    - "理論上可以，但實際效果因網站而異。適合靜態網頁、部落格、新聞網站；不適合需要登入、有反爬機制、大量 JavaScript 渲染的網站。"
```

### 2. {% faq %} 自動連動 - 推薦優化

**修改檔案：** `scripts/faq.js`

```javascript
hexo.extend.tag.register('faq', function(_, content) {
  try {
    const contentStr = Array.isArray(content) ? content.join('') : (content || '');
    const faqItems = JSON.parse(contentStr.trim());

    // 🆕 自動注入到 page 變數，供 structured data helper 使用
    if (!this.page.darrell_structured_data) {
      this.page.darrell_structured_data = { question: [], answer: [] };
    }
    faqItems.forEach(item => {
      this.page.darrell_structured_data.question.push(item.question);
      // 移除 HTML 標籤，Schema 要純文字
      this.page.darrell_structured_data.answer.push(
        item.answer.replace(/<[^>]*>/g, '')
      );
    });

    // ... 原有渲染邏輯
  } catch (error) {
    return `<!-- FAQ JSON Parse Error: ${error.message} -->`;
  }
}, {ends: true});
```

這樣就不用在 front matter 重複寫 FAQ 內容。

---

## 結論

### 優先級總覽

| 項目 | 難度 | 效益 | 建議 |
|------|------|------|------|
| FAQPage front matter | 5 分鐘 | Rich Snippet + AI 引用 | ✅ 立即做 |
| {% faq %} 自動連動 | 30 分鐘 | 減少重複、自動化 | ✅ 推薦 |
| HowTo helper | 2 小時 | 步驟 Rich Snippet | 🟡 中期 |
| TechArticle 改進 | 30 分鐘 | 更精準分類 | 🟡 中期 |
| SoftwareApplication | 1 小時 | 軟體資訊卡 | 🟢 可選 |

### 立即可做（5 分鐘）

1. 加 FAQPage front matter 到 `n8n-apify-node.md`

### 推薦優化（30 分鐘）

2. 修改 `scripts/faq.js` 自動連動 FAQPage Schema

---

## 驗證步驟

### 1. 本地驗證

```bash
npm run dev
# 打開 http://localhost:4000/n8n-apify-node/
# 右鍵 > 檢視原始碼 > 搜尋 "FAQPage"
```

### 2. 線上驗證

部署後用以下工具檢查：

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema Markup Validator**: https://validator.schema.org/

### 3. 預期結果

FAQPage 加入後，Google 搜尋可能顯示：

```
n8n Apify 節點教學 - 自動化網頁爬蟲...
www.darrelltw.com › n8n-apify-node

▼ Apify 免費額度有多少？
  Apify 提供每月 $5 USD 免費額度...

▼ Run Actor 和 Run Actor and get dataset items 有什麼差別？
  最大差別是是否等待結果...
```

---

## 迭代紀錄

| 迭代 | 新增內容 |
|------|---------|
| 1 | 基礎 Schema 分析、現有支援、實作建議 |
| 2 | AI 辨識考量、TechArticle、完整程式碼、驗證步驟 |
| 3 | 行動清單、成效指標、最終結論 |

---

## Round 6（迭代 3）：行動清單

### Phase 1：立即執行（今天）

- [ ] 在 `n8n-apify-node.md` front matter 加入 `darrell_structured_data`
- [ ] 執行 `npm run dev` 驗證 FAQPage Schema 輸出
- [ ] 用 Schema Validator 檢查格式正確

### Phase 2：本週優化

- [ ] 修改 `scripts/faq.js` 自動連動 FAQPage
- [ ] 測試其他有 FAQ 的文章是否自動產生 Schema
- [ ] 部署並用 Google Rich Results Test 驗證

### Phase 3：未來考慮

- [ ] 評估 HowTo Schema 的 ROI（需新增 helper）
- [ ] 評估 TechArticle 是否比 BlogPosting 帶來更好效果
- [ ] 追蹤 Google Search Console 的 Rich Results 報告

---

## 成效指標

### 短期（1-2 週）

| 指標 | 檢查方式 |
|------|---------|
| Schema 驗證通過 | Google Rich Results Test 無錯誤 |
| 頁面收錄 | Google Search Console 顯示已收錄 |

### 中期（1-3 月）

| 指標 | 檢查方式 |
|------|---------|
| FAQ Rich Snippet | 搜尋「n8n apify」看是否顯示問答卡片 |
| AI 引用 | 在 Perplexity/ChatGPT 問相關問題，看是否引用本站 |
| 點擊率 | Google Search Console CTR 變化 |

### 追蹤工具

- **Google Search Console** > 成效 > 搜尋外觀 > FAQ
- **Perplexity.ai** 搜尋「n8n apify 教學」觀察引用來源

---

## 最終結論

### 這篇文章應該加的 Structured Data

| 優先級 | Schema | 狀態 | 效益 |
|--------|--------|------|------|
| 🔴 必做 | FAQPage | ⏳ 待加 | Google FAQ 卡片 + AI 引用 |
| 🟡 推薦 | HowTo | ❌ 需開發 | Google 步驟卡片 |
| 🟢 可選 | TechArticle | ❌ 需改 | 更精準分類 |

### 為什麼 FAQPage 最重要？

1. **實作成本最低**：只需加 front matter，5 分鐘完成
2. **Rich Snippet 效果明顯**：Google 搜尋直接顯示問答
3. **AI 引用友善**：問答格式最容易被 AI 抓取並引用
4. **已有內容**：文章已經有 4 個 FAQ，只是缺 Schema 輸出

### 下一步

執行 Phase 1 的三個任務，完成後用驗證工具確認。

---

## 研究完成

三輪思考已完成，研究筆記可作為未來其他文章的參考模板。
