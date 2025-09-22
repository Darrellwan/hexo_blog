# CLAUDE.md

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