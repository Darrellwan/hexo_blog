# CLAUDE.md

## ⚠️ Git Commit 強制規則
**在執行任何 git commit 指令前，必須先使用 `commit-guide` skill 查看規範**
- 不允許在未啟用 skill 的情況下建立 commit
- 使用方式：當用戶要求 commit 時，先執行 skill 再進行操作

## Build Commands
- **Dev**: `npm run test` - Full development environment
- **Posts**: `npm run add_post --posttitle="Title"` - New post
- **Images**: `npm run images:process` - Process after adding images

## Architecture
Hexo blog for MarTech/automation. Key points:
- Config: `main.yml` (not `_config.yml`)
- Assets: `/source/_posts/post-name/` folders
- Custom tags: `{% darrellImage %}`, `{% darrellVideo %}`

## Content Workflow
1. Create post → 2. Add assets → 3. Process images → 4. Test locally

## Writing Style
- Conversational Chinese with English tech terms
- Personal testing references ("實測", "自己測試")
- Problem-solution format with screenshots
- Use emojis: ⚠️ warnings, ✅ confirmations


## n8n Quick Reference
- Switch node: Use `rules.values` structure (not `mode: "chooseBranch"`)
- LINE Bot flow: Webhook → Event Check → Router → Response
- Read `/docs/n8n-template-guide.md` for detailed patterns

## AI Development Philosophy
- **Think harder** - Always strive to dig deeper and find more nuanced solutions
- 記得 css 的位置和剛剛的重點
- 記得 article 怎麼用, anchor 怎麼設定

## n8n 更新文章撰寫流程

### 查找正確版本
- 從 GitHub Release 確認：`https://github.com/n8n-io/n8n/releases/tag/n8n%401.xxx.0`
- API 查詢最新正式版：`curl -s "https://api.github.com/repos/n8n-io/n8n/releases?per_page=20" | grep -E '"tag_name"|"prerelease"'`
- **注意**：Pre-release ≠ 正式版

### 更新文章內容
- 在文章**開頭**新增版本更新（不是附加在最後）
- 每個更新項目必須包含：
  - 中英文標題
  - 說明段落（參考既有格式）
  - **所有項目都要有**截圖佔位符：`{% darrellImage800Alt "功能說明文字" n8n-1.xxx.0-feature_name.png max-800 %}`

### 必須更新 Meta 資訊
```yaml
description: n8n 的更新記錄(2025/XX/XX 更新)，最新測試版本為 1.xxx.0，正式版本為 1.xxx.x
modified: 2025-XX-XX XX:XX:XX
```

### 檢查清單
- [ ] 版本號正確（區分 Pre-release 和正式版）
- [ ] **所有**更新項目都有配圖
- [ ] Meta description 已更新
- [ ] Meta modified 已更新