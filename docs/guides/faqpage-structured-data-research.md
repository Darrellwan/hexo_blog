# FAQPage Structured Data 政策變化研究報告

> 研究時間：2026-01-11
> 涵蓋範圍：2023-2025 年 Google 政策變化與 AI 搜尋影響

---

## 一、重大時間線

### 2023 年 8 月 8 日：Google 官方公告

Google 宣布限縮 FAQ 和 HowTo rich results 的顯示範圍。

**FAQ Rich Results 變更：**
> "FAQ rich results are only available for well-known, authoritative government and health websites. For all other sites, this rich result will no longer be shown regularly."

**HowTo Rich Results 變更：**
- 僅限桌面版顯示，行動版完全移除

**來源：**
- [Changes to HowTo and FAQ rich results - Google Search Central Blog](https://developers.google.com/search/blog/2023/08/howto-faq-changes)

---

### 2023 年 8 月：John Mueller 回應

Google Search Advocate John Mueller 在 Twitter 上回應社群反彈時，引用了「公地悲劇」（Tragedy of the Commons）概念：

> "Independent of abuse / over-use, things can change on the web / with users / with focus shifts, and it's important to clean up from time to time. (And it's a good reminder to read up about the tragedy of the commons :-))"

**意義解讀：**
Mueller 暗示 FAQ schema 被大量網站濫用（塞關鍵字、無關內容），導致 Google 必須限制這個功能，這正是「公地悲劇」的典型案例——當所有人都過度使用公共資源，最終所有人都失去這個資源。

**來源：**
- [Schema App: Changes to FAQ and How-to rich results on Google](https://www.schemaapp.com/schema-app-news/changes-to-faq-and-how-to-rich-results-on-google/)
- [Teckle Digital: Goodbye, FAQ Schema](https://www.teckledigital.com/blog/faq-rich-results-removed-from-google-search/)

---

### 2023 年 9 月 14 日：HowTo 完全廢棄

Google 將 HowTo rich results 從桌面版也移除，等於完全廢棄這個功能。

**來源：**
- [Google Search Central Blog - August 2023 Update](https://developers.google.com/search/blog/2023/08/howto-faq-changes)

---

### 2024 年：FAQ Rich Results 實質停用

即使是符合「政府或健康網站」條件的網站，FAQ rich snippets 也幾乎看不到了。

**來源：**
- [Search Engine Land: The rise and fall of FAQ schema](https://searchengineland.com/faq-schema-rise-fall-seo-today-463993)

---

### 2025 年 6 月 12 日：結構化資料簡化公告

Google 宣布淘汰 7 種結構化資料類型，但 **FAQPage schema 仍然保留支援**。

**來源：**
- [Engage Coders: Google Ends Support for 7 Structured Data Features in 2025](https://www.engagecoders.com/google-retires-7-structured-data-features-to-streamline-search-results/)

---

## 二、Google 官方現行規定

### FAQPage 資格限制

根據 [Google 官方 FAQPage 文件](https://developers.google.com/search/docs/appearance/structured-data/faqpage)：

| 條件 | 說明 |
|------|------|
| 網站類型 | 僅限「知名、權威的政府或健康網站」 |
| 內容要求 | FAQ 必須完整顯示在頁面上（可用手風琴摺疊） |
| 禁止用途 | 廣告目的、使用者提交的問答 |
| 唯一性 | 同一個 FAQ 不能標記在多個頁面 |

### 違規後果

根據 [Google Structured Data Policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)：

> "Violating a quality guideline can prevent syntactically correct structured data from being displayed as a rich result in Google Search, or possibly cause it to be marked as spam."

**可能的處罰：**
- Rich result 不顯示
- 被標記為 spam
- 手動處置（Manual Action）

---

## 三、為什麼 Google 限制 FAQ Schema？

### 1. 濫用氾濫

許多網站將 FAQ schema 用於：
- 塞入大量關鍵字
- 重複無關內容
- 佔據過多 SERP 空間

### 2. 使用者體驗

FAQ rich results 讓搜尋結果頁面變得過於複雜，降低使用者體驗。

### 3. SGE/AI Overview 策略轉變

Google 在 2023 年 5 月推出 Search Generative Experience (SGE)，開始將答案直接整合到搜尋結果中，減少對傳統 rich results 的依賴。

**來源：**
- [Schema App Analysis](https://www.schemaapp.com/schema-app-news/changes-to-faq-and-how-to-rich-results-on-google/)
- [Milestone Internet Blog](https://blog.milestoneinternet.com/google-update/the-impact-of-googles-changes-to-faq-and-how-to-schema-on-marketers/)

---

## 四、AI 搜尋引擎的逆向趨勢

### 學術研究：GEO（Generative Engine Optimization）

**論文：** "GEO: Generative Engine Optimization"
**發表：** ACM SIGKDD 2024（知識發現與資料探勘頂級會議）
**作者：** Princeton University & Georgia Tech 研究團隊

**核心發現：**
- GEO 可提升內容在 AI 引擎中的可見度達 **40%**
- 結構化資料（包括 FAQPage）顯著提高被引用機率

**來源：**
- [arXiv: GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735)
- [ACM Digital Library](https://dl.acm.org/doi/10.1145/3637528.3671900)

---

### AI 搜尋引用率統計

| 數據 | 來源 |
|------|------|
| FAQPage schema 頁面被 AI Overview 引用機率提高 **3.2 倍** | [Frase.io](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo) |
| 有 Article/FAQ schema 的網站引用率提高 **28%** | [Superprompt.com](https://superprompt.com/blog/ai-traffic-up-527-percent-how-to-get-cited-by-chatgpt-claude-perplexity-2025) |
| AI 流量（來自 ChatGPT/Perplexity）年增長 **527%** | [Superprompt.com](https://superprompt.com/blog/ai-traffic-up-527-percent-how-to-get-cited-by-chatgpt-claude-perplexity-2025) |
| ChatGPT 週活躍用戶達 **8 億**（2025 年 10 月） | [Superprompt.com](https://superprompt.com/blog/ai-traffic-up-527-percent-how-to-get-cited-by-chatgpt-claude-perplexity-2025) |
| 僅 **12.4%** 網站有實作結構化資料 | [Frase.io](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo) |

---

### AI 平台差異

| 平台 | 偏好內容類型 | 引用特性 |
|------|-------------|---------|
| ChatGPT | 權威、中立、有外部引用的內容 | 訓練資料為主，較少即時引用 |
| Perplexity | 對話式、經驗分享、實用範例 | 即時搜尋，提供可點擊引用連結 |
| Google AI Overview | 結構化內容、FAQ、HowTo | 74% 引用來自前 10 名結果 |

**來源：**
- [The Digital Bloom: 2025 AI Visibility Report](https://thedigitalbloom.com/learn/2025-ai-citation-llm-visibility-report/)
- [Wellows: Google AI Overviews Ranking Factors](https://wellows.com/blog/google-ai-overviews-ranking-factors/)

---

## 五、Google AI Overview 相關數據

### 顯示比例

| 時間 | AI Overview 出現比例 |
|------|---------------------|
| 2024 年中 | 25% |
| 2025 年 7 月（高峰） | 25% |
| 2025 年平均 | 15-16% |
| 2025 年資訊型查詢 | **88.1%** |

### 對傳統 CTR 的影響

- 有 AI Overview 的查詢，Organic CTR 下降 **61%**
- 但被 AI Overview 引用的品牌，Organic 點擊增加 **35%**

**來源：**
- [Dataslayer: Google AI Overviews Impact 2025](https://www.dataslayer.ai/blog/google-ai-overviews-the-end-of-traditional-ctr-and-how-to-adapt-in-2025)
- [Single Grain: Google AI Overviews Guide](https://www.singlegrain.com/search-everywhere-optimization/google-ai-overviews-the-ultimate-guide-to-ranking-in-2025/)

---

## 六、結論與建議

### FAQPage Schema 現況總結

| 面向 | 2023 年前 | 2025 年現況 |
|------|----------|------------|
| Google Rich Snippets | ✅ 廣泛顯示 | ❌ 僅政府/健康網站 |
| Google 是否支援 | ✅ 支援 | ✅ 仍支援（不會懲罰） |
| AI 搜尋引用 | N/A | ✅ 高引用率 |
| 實作價值 | 高（SEO） | 中高（AI 優化） |

### 給 n8n-apify-node.md 的建議

**不建議加 FAQPage 的理由：**
1. 不是政府/健康網站，不會顯示 Rich Snippets
2. 需要手動重複寫 FAQ 內容

**建議加 FAQPage 的理由：**
1. AI 搜尋引用率提高 3.2 倍
2. 僅 12.4% 網站有實作，有競爭優勢
3. Google 不會懲罰（只是不顯示）
4. 未來 AI 搜尋流量持續成長

### 最終建議

**可以加，但期望要調整：**
- 不要期待 Google 顯示 FAQ 卡片
- 主要效益是 AI 搜尋引用
- 確保 FAQ 內容有實際價值（避免「公地悲劇」重演）

---

## 七、參考文獻完整列表

### Google 官方文件

1. [FAQPage Structured Data Documentation](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
2. [Changes to HowTo and FAQ rich results (2023/08)](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
3. [Structured Data Policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
4. [March 2024 Core Update and Spam Policies](https://developers.google.com/search/blog/2024/03/core-update-spam-policies)

### 學術研究

5. [GEO: Generative Engine Optimization - arXiv](https://arxiv.org/abs/2311.09735)
6. [GEO: Generative Engine Optimization - ACM SIGKDD 2024](https://dl.acm.org/doi/10.1145/3637528.3671900)
7. [Princeton University: GEO Publication](https://collaborate.princeton.edu/en/publications/geo-generative-engine-optimization/)

### 產業分析

8. [Search Engine Land: The rise and fall of FAQ schema](https://searchengineland.com/faq-schema-rise-fall-seo-today-463993)
9. [Frase.io: Are FAQ Schemas Important for AI Search, GEO & AEO?](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)
10. [Schema App: Changes to FAQ and How-to rich results](https://www.schemaapp.com/schema-app-news/changes-to-faq-and-how-to-rich-results-on-google/)
11. [Milestone Internet: Impact of Google's Changes to FAQ and How-To Schema](https://blog.milestoneinternet.com/google-update/the-impact-of-googles-changes-to-faq-and-how-to-schema-on-marketers/)

### AI 搜尋流量數據

12. [Superprompt: AI Traffic Surges 527% in 2025](https://superprompt.com/blog/ai-traffic-up-527-percent-how-to-get-cited-by-chatgpt-claude-perplexity-2025)
13. [The Digital Bloom: 2025 AI Visibility Report](https://thedigitalbloom.com/learn/2025-ai-citation-llm-visibility-report/)
14. [Wellows: Google AI Overviews Ranking Factors 2025](https://wellows.com/blog/google-ai-overviews-ranking-factors/)

### Google AI Overview 影響

15. [Dataslayer: Google AI Overviews Impact 2025](https://www.dataslayer.ai/blog/google-ai-overviews-the-end-of-traditional-ctr-and-how-to-adapt-in-2025)
16. [Single Grain: Google AI Overviews Ultimate Guide](https://www.singlegrain.com/search-everywhere-optimization/google-ai-overviews-the-ultimate-guide-to-ranking-in-2025/)

### 其他參考

17. [Engage Coders: Google Ends Support for 7 Structured Data Features in 2025](https://www.engagecoders.com/google-retires-7-structured-data-features-to-streamline-search-results/)
18. [GetPassionfruit: FAQ Schema for AI Answers](https://www.getpassionfruit.com/blog/faq-schema-for-ai-answers)
19. [Seer Interactive: FAQ Reduced Visibility & No More HowTo](https://www.seerinteractive.com/insights/google-faq-updates-and-howto-rich-results)
20. [Teckle Digital: Goodbye, FAQ Schema](https://www.teckledigital.com/blog/faq-rich-results-removed-from-google-search/)
