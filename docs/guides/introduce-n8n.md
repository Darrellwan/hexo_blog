# n8n 入門文章維護指南

> 文章路徑：`/source/_posts/n8n-introduction.md`
> 最後更新：2025-12-06

## 文章結構總覽

```
quickNav（9 個錨點）
├── n8n 是什麼 (#what-is-n8n)
│   ├── 名稱由來、公司背景
│   ├── 技術架構表
│   ├── 工具比較表（Zapier/Make/n8n）
│   ├── Fair-code 授權說明
│   └── 誰適合用 n8n？
├── vs 寫程式 (#why-not-code)
│   ├── 對比表
│   └── 適用時機
├── 應用場景 (#use-cases)
│   ├── 個人生活場景（+分帳、語音日報 articleCard）
│   ├── 行銷工作場景（+Gmail articleCard）
│   └── 工程/維運場景（+S3/R2、Slack articleCard）
├── 安裝部署 (#installation)
│   └── 連結到 /n8n-deployment/
├── 介面導覽 (#ui-guide)
│   ├── 左側選單表格
│   ├── 頂部工具列表格
│   ├── 畫布操作表格
│   └── 快捷鍵表格
├── 核心概念 (#core-concepts)
│   ├── Trigger（鬧鐘比喻）
│   ├── JSON（便當盒比喻）
│   ├── Expression（填空題比喻）
│   └── 常用表達式速查表
├── 實戰教學 (#hands-on)
│   ├── OpenAI API Key 申請步驟
│   ├── Credential 設定步驟
│   ├── Step 1-5 詳細教學
│   └── 3 張截圖佔位符
├── 除錯技巧 (#debugging)
│   ├── Pin Data（+articleCard）
│   ├── Executions 使用方式
│   ├── 錯誤碼對照表（7 種）
│   └── 實戰案例（+articleCard）
├── FAQ (#faq)
│   └── 6 個常見問題
└── 學習路徑 (#learning-path)
    ├── 5 個基礎節點（+articleCard）
    ├── 進階學習推薦（+articleCard）
    └── 資源連結表格
```

---

## 已連結的內部文章（22 篇）

| 文章 | 連結位置 |
|------|----------|
| `/n8n-deployment/` | 安裝部署 |
| `/n8n-line-split-expense-workflow/` | 個人生活場景 |
| `/n8n-elevenlabs-tts/` | 個人生活場景 |
| `/n8n-gmail-node/` | 行銷工作場景 |
| `/n8n-node-s3-with-cloudflare-r2/` | 工程場景 |
| `/n8n-with-slack/` | 工程場景 |
| `/n8n-with-cloudflare-turnstile-CAPTCHA/` | 工程場景 |
| `/n8n-tips-pin/` | 除錯技巧 |
| `/n8n-debug-line-invalid-json/` | 除錯技巧 |
| `/n8n-with-zeabur-timezone-issue/` | 除錯技巧 - 部署相關 |
| `/n8n-built-in-variables/` | Expression 章節 |
| `/n8n-poll-time-setting/` | 核心概念 - Trigger |
| `/n8n-new-feature-folders/` | 介面導覽 |
| `/n8n-webhook/` | 學習路徑 |
| `/n8n-set-node/` | 學習路徑 |
| `/n8n-if-switch/` | 學習路徑 |
| `/n8n-filter-node/` | 學習路徑 |
| `/n8n-merge-node/` | 學習路徑 |
| `/n8n-aggregate-split-out/` | 學習路徑 - 進階資料處理 |
| `/n8n-datatables-node/` | 學習路徑 - 進階資料處理 |
| `/n8n_structured_output_parser_node/` | 學習路徑 - AI 進階 |
| `/n8n-perplexity-node/` | 學習路徑 - AI 進階 |
| `/n8n-evaluations/` | 學習路徑 - AI 進階 |
| `/n8n-update-log/` | 學習路徑 - 資源連結 |
| `/n8n-line-message-api/` | 實戰教學 Step 4 |
| `/n8n-line-messaging-community-node/` | 實戰教學 Step 4 |

---

## 需要補充的截圖（8 張）

| 截圖 ID | 說明 | 狀態 |
|---------|------|------|
| `n8n-intro-ui-overview.png` | 介面標註總覽圖 | ⬜ 待補 |
| `n8n-intro-workflow-complete.png` | 完整工作流連線圖 | ⬜ 待補 |
| `n8n-intro-openai-credential.png` | OpenAI Credential 設定 | ⬜ 待補 |
| `n8n-intro-openai-setup.png` | OpenAI 節點 Prompt 設定 | ⬜ 待補 |
| `n8n-intro-execution-result.png` | 執行成功 LINE 通知結果 | ⬜ 待補 |
| `n8n-intro-pin-data.png` | Pin Data 操作示意 | ⬜ 待補 |
| `n8n-intro-executions-debug.png` | Executions 除錯畫面 | ⬜ 待補 |

截圖存放路徑：`/source/_posts/n8n-introduction/`

---

## 未來優化方向

### 短期（可直接執行）
- [ ] 補充 8 張截圖
- [ ] 驗證所有 articleCard 的 thumbnail URL 是否正確
- [ ] 檢查 RSS Feed URL 是否仍然有效

### 中期（需要新素材）
- [ ] 製作介面導覽 GIF 動畫
- [ ] 錄製實戰教學影片嵌入
- [ ] 新增「讀者常見問題」到 FAQ（收集留言）

### 長期（內容更新）
- [ ] 隨 n8n 版本更新介面截圖
- [ ] 新增更多應用場景範例
- [ ] 連結更多新寫的教學文章

---

## 寫作風格提醒

本文特點：
1. **白話比喻**：Trigger=鬧鐘、JSON=便當盒、Expression=填空題
2. **表格化資訊**：對比表、參數表、快捷鍵表
3. **新手友善**：每步驟有提示、常見錯誤說明
4. **內部連結豐富**：22+ 篇相關文章

---

## 版本紀錄

| 日期 | 變更內容 |
|------|----------|
| 2025-11-26 | 初版發布 |
| 2025-12-05 | 第一次大擴充：+282 行，新增 n8n vs 寫程式、除錯技巧章節、擴充所有章節細節 |
| 2025-12-06 | 新增 10 篇內部連結（共 22 篇），包含：Poll Time、Folders、Cloudflare Turnstile、LINE 社群節點、Zeabur 時區、Aggregate/Split Out、DataTables、Structured Output Parser、Perplexity、Evaluations、版本更新記錄 |
