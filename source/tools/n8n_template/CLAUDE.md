# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a static n8n template sharing platform that showcases and distributes pre-built n8n workflow automation templates. The system operates as a single-page web application with the following core architecture:

### Data Layer
- `/data/workflows/` - n8n workflow JSON 檔案（28+ 個模板）
- `/data/workflow-models.json` - 模板 metadata（中文描述、設定說明、tags）
- `/data/bg/` - 預覽圖片（WebP 格式）

### Static Generation Architecture
```
model-detail.template.html  ──┐
                              ├──▶ scripts/generate-models-page.js ──▶ model/*.html (28 個靜態頁面)
workflow-models.json ─────────┘                                   ──▶ models.html (模板列表)
                                                                  ──▶ sitemap.xml
```

**重要**：修改詳情頁時，必須修改 `model-detail.template.html`，不是直接改 `model/*.html`

### Presentation Layer
- `models.html` - 模板列表頁（靜態生成 + 客戶端搜尋）
- `model/*.html` - 詳情頁（由 template 生成，勿直接修改）
- `model-detail.template.html` - 詳情頁模板（使用 `{{PLACEHOLDER}}` 變數）

### JavaScript Components
- `scripts/generate-models-page.js` - 靜態頁面生成腳本
- `workflow-visualizer.js` - n8n-demo 組件整合

## Key Technical Patterns

### Template Structure
Each template in `/data/workflow-models.json` follows this structure:
```json
{
  "id": "template-name",
  "title": "Chinese Display Name",
  "description": "Detailed Chinese description",
  "detailedDescription": ["Step-by-step functionality list"],
  "tags": ["categorization", "keywords"],
  "nodes": 4,
  "setup": {
    "prerequisites": "Required API access or credentials",
    "steps": ["Setup instructions"]
  }
}
```

### n8n Workflow Integration
- Uses n8n's official demo component for workflow visualization
- Workflows are standard n8n JSON exports with proper node connections
- All connection structures use node names (never node IDs) for proper linking

## n8n-Specific Agent Integration

### Claude Agent System
This project includes a specialized `n8n-workflow-builder` agent with three core modes:

1. **CREATE Mode** - Build new workflows from scratch
2. **OPTIMIZE Mode** - Analyze and improve existing workflows  
3. **INSPIRE Mode** - Generate creative automation ideas

### MCP Tools Integration
The agent has access to n8n MCP tools for direct workflow management:
- `mcp__n8n-mcp__create_n8n_workflow` - Upload workflows to n8n instance
- `mcp__n8n-mcp__get_n8n_workflow_by_id` - Retrieve existing workflows
- `mcp__n8n-mcp__search_n8n_workflows_by_keyword` - Search workflow library

### Critical n8n Connection Rules
When working with n8n workflows, strictly follow these connection patterns:

**CORRECT Format:**
```json
"connections": {
  "Node Display Name": {
    "main": [
      [
        {
          "node": "Target Node Display Name",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

**Key Rules:**
- Connection keys MUST use node names from the `name` field in nodes array
- Connection target values MUST reference node names (not IDs)  
- Maintain double array structure `[[{...}]]`
- Ensure exact name matching including Chinese characters and spaces

## Working with Templates

### Adding New Templates - Complete SOP

When adding a new n8n workflow template, follow this systematic process:

#### Step 1: Prepare Workflow Files
1. **Export workflow from n8n**
   - Ensure workflow is tested and functional
   - Export as JSON from n8n interface
   - Verify node connections use display names (not IDs)

2. **Place workflow JSON**
   - Save to `/data/workflows/` with naming pattern: `darrell_n8n_[name].json`
   - Example: `darrell_n8n_line_messaging_community.json`

3. **Create preview image**
   - Take screenshot of workflow canvas in n8n
   - Save to `/data/bg/` with matching name
   - Use `.jpg` or `.webp` format
   - Example: `darrell_n8n_line_messaging_community.jpg`

#### Step 2: Add Metadata to workflow-models.json

**IMPORTANT**: Always add new templates at the **TOP** of the models object to ensure they appear first in the gallery.

Use this command pattern:
```javascript
// Create a Node.js script to insert entry at top
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('...workflow-models.json', 'utf8'));

const newEntry = {
    "id": "darrell_n8n_[workflow-name]",
    "title": "中文標題",
    "description": "詳細描述（繁體中文）...",
    "detailedDescription": [
        "功能步驟 1",
        "功能步驟 2",
        // ... more steps
    ],
    "tags": ["標籤1", "標籤2", "標籤3"],
    "nodes": 7,  // 實際節點數量
    "createdAt": "2025-10-24",
    "updatedAt": "2025-10-24",
    "setup": {
        "prerequisites": "必要條件說明",
        "steps": [
            {
                "title": "步驟標題",
                "description": "步驟說明",
                "options": [
                    "選項 1",
                    "選項 2"
                ]
            }
        ]
    },
    "examples": [
        {
            "title": "範例標題",
            "description": "範例說明",
            "code": { /* 範例程式碼 */ }
        }
    ],
    "fields": { /* API 欄位定義 */ },
    "relatedArticles": [
        {
            "title": "相關文章標題",
            "url": "https://..."
        }
    ]
};

// Insert at top
const newModels = {
    [newEntry.id]: newEntry,
    ...data.models
};
data.models = newModels;

// Write back with formatting
fs.writeFileSync('...workflow-models.json', JSON.stringify(data, null, 4), 'utf8');
```

#### Step 3: Metadata Content Guidelines

**Title (標題)**
- 簡潔明確，說明核心功能
- 格式：`[服務名稱] [核心功能] 範本`
- 範例：`LINE Messaging Community 節點範本`

**Description (描述)**
- 第一段：整體功能說明（2-3 句）
- 第二段：列出 3-5 個主要功能點
- 使用繁體中文，保持專業但易懂的語調

**DetailedDescription (功能特色)**
- **限制：不超過 5 項**
- 只列出核心功能，非技術細節
- 不確定是否為特色時，先詢問用戶
- ✅ 好的範例：「接收 LINE Webhook 事件」「使用 Time Saved 追蹤效益」
- ❌ 不適合：「正確回應 200 OK」（技術細節）、「轉人工處理」（輔助流程）

**Tags (標籤)**
- 至少 5-7 個標籤
- 包含：服務名稱、功能類型、應用場景
- 範例：`["LINE", "聊天機器人", "自動回覆", "訊息推播", "客服"]`

**Nodes (節點數)**
- 計算 workflow JSON 中實際的節點數量
- 不包含 Sticky Note

**Setup Steps (設定步驟)**
- 至少 3-4 個主要步驟
- 每個步驟包含：
  - `title`: 步驟名稱
  - `description`: 步驟說明
  - `options`: 3-5 個具體操作項目（陣列）
- 按照實際設定順序排列

**Examples (範例)**
- 提供 1-2 個實際使用範例
- 包含清晰的 code 示範或參數說明

**Related Articles (相關文章)**
- 2-3 個相關資源連結
- 可包含官方文檔、教學文章等

#### Step 4: File Checklist

Before committing, verify:
- [ ] Workflow JSON 在 `/data/workflows/` 中
- [ ] 預覽圖片在 `/data/bg/` 中
- [ ] Metadata 已加入 `workflow-models.json` **最上方**
- [ ] ID 命名一致（JSON 檔名、圖片檔名、metadata ID）
- [ ] 節點數量正確
- [ ] 所有必要欄位都已填寫
- [ ] Description 使用繁體中文
- [ ] Tags 適當且完整

#### Step 5: Test Locally

```bash
# 在 hexo 環境中測試
npm run test

# 訪問模板頁面確認
# http://localhost:4000/tools/n8n_template/models.html

# 檢查：
# 1. 新模板是否出現在最上方
# 2. 預覽圖片是否正確顯示
# 3. 詳細資訊頁面是否正常
# 4. 下載連結是否有效
```

#### Quick Reference - Naming Pattern

```
Workflow JSON:  darrell_n8n_[name].json
Preview Image:  darrell_n8n_[name].webp
Metadata ID:    darrell_n8n_[name]
```

Example:
```
JSON:  darrell_n8n_line_auto_reply.json
Image: darrell_n8n_line_auto_reply.webp
ID:    darrell_n8n_line_auto_reply
```

### Template Validation
- Ensure all nodes have proper `typeVersion` and required parameters
- Verify connection structure uses node names consistently
- Test workflow visualization in the web interface
- Validate metadata completeness in workflow-models.json

## SEO Optimization & Static Generation

### Problem: Client-Side Rendering Limitations
Previously, `models.html` used client-side JavaScript to dynamically load and render templates. This created issues:
- Search engine crawlers saw empty HTML (poor SEO)
- ChatGPT and other AI crawlers couldn't index template content
- Slow first contentful paint (FCP)

### Solution: Build-Time Static Generation
We now use a Node.js script to pre-render the complete HTML at build time, while preserving client-side search and interaction features.

#### How It Works

1. **Template Data** → `/data/workflow-models.json`
2. **Generation Script** → `/scripts/generate-models-page.js`
3. **Output** → `models.html` with full pre-rendered content
4. **Enhancement** → JavaScript adds search/filter functionality

#### Usage

**When to regenerate:**
- After adding new templates to `workflow-models.json`
- After updating existing template metadata
- Before deploying to production

**Command:**
```bash
npm run n8n:generate-models
```

**What it does:**
1. Reads `/data/workflow-models.json`
2. Sorts templates (pinned → priority → weight → default)
3. Generates HTML cards for each template
4. Creates Schema.org structured data
5. Injects content into `models.html`
6. Preserves all CSS/JS for client-side interactions

**Output:**
```
🚀 開始生成 models.html...
📖 讀取 workflow-models.json...
✅ 找到 17 個模板
🔄 排序模板...
🎨 生成卡片 HTML...
📊 生成結構化數據...
📝 處理 HTML 模板...
💾 寫入 models.html...
✅ models.html 生成成功！
```

#### Progressive Enhancement Architecture

**Base Layer (SEO-friendly):**
- Complete static HTML with all template cards
- Fully crawlable by Google, ChatGPT, etc.
- No JavaScript required to see content

**Enhancement Layer (User Experience):**
- Client-side search functionality
- Tag filtering
- Dynamic image loading
- Smooth interactions

#### Integration with Build Pipeline

The generation script can be integrated into your build process:

```bash
# Current build command
npm run build

# Add to build command if needed
npm run n8n:generate-models && npm run build
```

#### Customization Options

Edit `/scripts/generate-models-page.js` to customize:

**Sorting Configuration:**
```javascript
const SORT_CONFIG = {
    defaultSortBy: 'none',      // 'nodes' | 'date' | 'title' | 'none'
    defaultSortDirection: 'desc', // 'asc' | 'desc'
    pinnedModels: [],            // ['model-id-1', 'model-id-2']
    modelWeights: {}             // { 'model-id': 100 }
};
```

**Priority System:**
1. **Pinned models** - Always at top (by array order)
2. **Model priority** - From `priority` field in JSON
3. **Custom weights** - Manual boost for specific models
4. **Default sorting** - By nodes/date/title

#### Template Structure

If you need to modify the HTML structure, the script looks for:
- `<div class="model-grid">...</div>` - Cards are inserted here
- `<script type="application/ld+json" id="workflow-models-schema">` - Schema.org data inserted here

Alternatively, use placeholders:
- `{{MODELS_CARDS}}` - For card HTML
- `{{SCHEMA_JSON}}` - For structured data

## Development Notes

### Static Site Architecture
This is a hybrid client-side/build-time application:
- **Build-time**: HTML structure and content pre-rendered
- **Client-side**: Search, filtering, and interactions enhanced with JavaScript
- **No backend dependencies**: All data from static JSON files

### n8n Demo Component Integration
The visualization system relies on n8n's official web component. The component is loaded via CDN and requires proper workflow JSON structure to render correctly.

### Chinese Language Support
All user-facing content is in Traditional Chinese. Template descriptions, setup instructions, and UI elements should maintain this language consistency.