# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Run/Test Commands
- **Development**: `npm run server` - Start dev server with main.yml config
- **Development with drafts**: `npm run server_custom_draft` - Include draft posts
- **Test locally**: `npm run test` - Clean + generate + serve (full development environment)
- **Production build**: `npm run build` - Full build with image processing
- **Generate**: `npm run generate` - Clean + process + generate + serve
- **Clean**: `npm run clean` - Clean generated files
- **Content creation**: `npm run add_post --posttitle="Your Post Title"` - Create new post
- **Draft creation**: `npm run add_draft --posttitle="Your Post Title"` - Create draft
- **Image processing**: `npm run images:process` - Generate image dimensions data
- **Force image reprocess**: `npm run images:force-process` - Regenerate all dimensions
- **Custom sitemap**: `npm run n8n-sitemap` - Generate n8n content sitemap
- **README management**: `npm run update-readme` - Auto-generate README from template

## Architecture Overview
This is a **Hexo static site generator blog** focused on MarTech, automation, and AI topics. Key architectural components:

- **Primary config**: `main.yml` (overrides standard `_config.yml`)
- **Custom image system**: Advanced image processing with automatic dimension detection
- **Content types**: GTM tutorials, n8n automation guides, GA4 content, general MarTech
- **Asset organization**: Post-specific asset folders in `/source/_posts/post-name/`
- **Custom Hexo plugins**: Image tags, video tags, sitemap generation, dimension processing

## Custom Image and Media Tags
**Image Tags** (all support lightbox and lazy loading):
- `{% darrellImage [alt] [path] [class] %}` - Standard lightbox image
- `{% darrellImage800 [alt] [path] [class] %}` - 800px max width image
- `{% darrellImageCover [alt] [path] [class] %}` - Cover images (no lazy load)
- `{% darrellOnlyImage [alt] [path] [class] %}` - Simple image without lightbox

**Video Tags**:
- `{% darrellVideo [alt] [path] [poster] [class] %}` - Video with lightbox
- `{% darrellVideoSimple [alt] [path] [class] %}` - Simple video player

**Important**: Always run `npm run images:process` after adding new images to generate dimension data for optimal loading.

## Content Creation Workflow
1. **Create post**: Use `npm run add_post --posttitle="Title"` (creates scaffolded post)
2. **Add assets**: Place images in matching asset folder (`/source/_posts/post-name/`)
3. **Process images**: Run `npm run images:process` to generate dimensions
4. **Test locally**: Use `npm run test` for full development environment
5. **Front matter**: Include required fields: title, date, tags, categories, description
6. **Post structure**: Start with `{% darrellImageCover %}`, use proper headings, end with references

## File Organization
- **Posts**: `/source/_posts/` with kebab-case filenames
- **Assets**: Post-specific folders (`/source/_posts/post-name/`)
- **Drafts**: `/source/_drafts/` for work-in-progress content
- **Data**: `/source/_data/` contains `image_dimensions.json` (auto-generated)
- **Theme**: `/themes/next/` with custom configurations
- **Scripts**: `/scripts/` contains custom Hexo generators and helpers

## Configuration Files
- **`main.yml`**: Primary Hexo configuration (used instead of `_config.yml`)
- **`themes/next/_config.yml`**: NexT theme customization
- **`package.json`**: Build scripts and dependencies
- **`/source/_data/image_dimensions.json`**: Auto-generated image dimension data

## Writing Style Guidelines
**Voice and Tone**:
- Conversational and approachable technical writing with personal experience emphasis
- Use casual expressions like "蠻多人", "這真的是", "算是蠻" for friendly tone
- Reference personal testing frequently: "實測", "自己測試", "我自己"
- Community-oriented: mention user feedback, forum discussions, social media interactions

**Content Structure**:
- Problem-solution format: identify common issues first, then provide solutions
- Step-by-step tutorials with clear hierarchical headings (## and ###)
- Comprehensive coverage from basic setup to advanced usage and troubleshooting
- Progressive disclosure: start with basics, build to advanced implementations

**Language Style**:
- Natural mix of Chinese explanations with English technical terms
- Use emojis for emphasis: ⚠️ for warnings, ✅ for confirmations, ❌ for errors
- Direct, encouraging communication without unnecessary jargon
- Proactive discussion of common pitfalls and error prevention

**Technical Approach**:
- Show, don't just tell: extensive screenshots, code examples, visual demonstrations
- Focus on practical, real-world applications over theoretical concepts
- Include cost considerations, pricing analysis, and free tier information
- Version-aware content with update notes and feature comparisons
- Hands-on testing and personal verification of all recommendations

## Development Notes
- **Local testing**: Always use `npm run test` before committing
- **Image optimization**: The build process automatically handles responsive images and lazy loading
- **README**: Auto-generated from template - modify generation script, not README directly
- **Content scaffolds**: Use specialized templates for GTM and n8n posts
- **Performance**: Image dimensions are pre-calculated for optimal loading performance