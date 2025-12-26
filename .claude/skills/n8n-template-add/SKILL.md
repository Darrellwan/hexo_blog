---
name: n8n-template-add
description: 新增 n8n workflow 模板到模板庫的標準化流程。當用戶要新增 n8n 模板、上傳 workflow JSON、加入新模板、或處理 /source/tools/n8n_template/data/workflows/ 中的新檔案時自動啟用。
---

# 新增 n8n Workflow 模板 SOP

## Quick Checklist

在開始前，確認以下項目：

- [ ] Workflow JSON 檔案已準備好
- [ ] 檔名格式：`n8n-xxx-xxx.json`（小寫+連字號）
- [ ] 預覽圖片已準備（webp 格式）
- [ ] 了解 workflow 功能（用於撰寫 metadata）

---

## Phase 1: 檔案準備

### 1.1 Workflow JSON 命名

**格式**：`n8n-[功能描述].json`

| 正確 | 錯誤 |
|------|------|
| `n8n-ai-news-daily-digest.json` | `[Darrell][Template]AI News.json` |
| `n8n-github-backup-workflow.json` | `github_backup.json` |

**放置路徑**：`/source/tools/n8n_template/data/workflows/`

### 1.2 預覽圖片

**格式**：與 JSON 同名的 `.webp` 檔案
**路徑**：`/source/tools/n8n_template/data/bg/`
**尺寸**：建議 640x640 或更大

```
# 範例
JSON:  n8n-ai-news-daily-digest.json
Image: n8n-ai-news-daily-digest.webp
```

### 1.3 計算節點數

讀取 workflow JSON，計算 `nodes` 陣列長度，**排除 Sticky Notes**：

```javascript
// 排除 stickyNote 類型
nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote').length
```

---

## Phase 2: Metadata 撰寫

### 2.1 新增位置

在 `/source/tools/n8n_template/data/workflow-models.json` 的 `models` 對象**最上方**新增。

### 2.2 必填欄位

```json
{
    "id": "n8n-xxx-xxx",           // 與檔名相同（不含 .json）
    "title": "中文標題",            // 簡潔明確，10-20 字
    "description": "詳細描述...",   // 含主要功能列表，100-200 字
    "detailedDescription": [...],  // 步驟陣列，6-10 項
    "tags": [...],                 // 5-7 個關鍵字
    "nodes": 18,                   // 節點數（排除 Sticky Notes）
    "createdAt": "YYYY-MM-DD",
    "updatedAt": "YYYY-MM-DD",
    "setup": {...},                // 設定步驟
    "examples": [...],             // 使用範例（可選）
    "fields": {},                  // API 欄位（可選）
    "relatedArticles": []          // 相關文章（目前模板不支援顯示）
}
```

### 2.3 Tags 撰寫原則

- **數量**：5-7 個，不要太多
- **類型**：涵蓋技術、功能、平台
- **SEO**：考慮用戶搜尋關鍵字

| 好的 Tags | 避免的 Tags |
|-----------|-------------|
| AI, RSS, Gmail, 每日摘要, 自動化 | GPT-4o-mini, OpenAI Blog, MIT Tech Review |

**原則**：移除重複概念（Email≈Gmail）、過於細節的技術名詞

### 2.4 Description 結構

```
第一段：一句話說明核心功能

主要功能：

功能1：說明
功能2：說明
功能3：說明
```

### 2.5 Setup Steps 結構

```json
"setup": {
    "prerequisites": "所需 API 或服務",
    "steps": [
        {
            "title": "步驟標題",
            "description": "步驟說明",
            "options": ["操作1", "操作2", "操作3"]
        }
    ]
}
```

---

## Phase 3: 生成頁面

執行生成腳本：

```bash
npm run n8n:generate-models
```

**生成產物**：
- `models.html` - 模板列表頁
- `/model/[id].html` - 詳情頁
- `sitemap.xml` - SEO sitemap
- Schema.org 結構化數據

---

## Phase 4: 測試驗證

### 4.1 啟動本地測試

```bash
npm run dev
```

如果 port 4000 被佔用：
```bash
lsof -ti:4000 | xargs kill -9
npm run dev
```

### 4.2 檢查項目

- [ ] 模板列表頁：新模板是否出現在最上方
- [ ] 預覽圖片：是否正確顯示
- [ ] 詳情頁：功能特色、設置說明是否完整
- [ ] 下載按鈕：是否能下載 JSON

**測試網址**：
- 列表：`http://localhost:4000/tools/n8n_template/models.html`
- 詳情：`http://localhost:4000/tools/n8n_template/model/[id].html`

---

## Phase 5: 提交

### 5.1 Git Add

只加入相關檔案：

```bash
git add \
  source/tools/n8n_template/data/workflows/[id].json \
  source/tools/n8n_template/data/bg/[id].webp \
  source/tools/n8n_template/model/[id].html \
  source/tools/n8n_template/data/workflow-models.json \
  source/tools/n8n_template/models.html \
  source/tools/n8n_template/sitemap.xml \
  source/_data/image_dimensions.json
```

### 5.2 Commit Message

使用 `feat:` 類型（非文章功能）：

```
feat: add [模板名稱] workflow template

簡短說明模板功能

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 常見問題

### Q: relatedArticles 會顯示嗎？
目前 model-detail.template.html **不支援**顯示 relatedArticles，但可以先填寫，未來擴充時可用。

### Q: 預覽圖片沒有怎麼辦？
執行 generate-models 後會使用 placeholder 圖片，之後補上即可。

### Q: Tags 應該放多少個？
建議 5-7 個。太少無法覆蓋搜尋，太多會稀釋重點。

---

## 相關檔案路徑

| 檔案 | 路徑 |
|------|------|
| Workflow JSON | `/source/tools/n8n_template/data/workflows/` |
| 預覽圖片 | `/source/tools/n8n_template/data/bg/` |
| Metadata | `/source/tools/n8n_template/data/workflow-models.json` |
| 生成腳本 | `/source/tools/n8n_template/scripts/generate-models-page.js` |
| 詳情頁模板 | `/source/tools/n8n_template/model-detail.template.html` |
