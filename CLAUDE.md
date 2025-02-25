# CLAUDE.md - Guidance for Claude working with this repository

## Build/Run/Test Commands
- Build: `npm run build` - Generate static files using Hexo
- Clean: `npm run clean` - Clean generated files
- Server: `npm run server` - Start local development server
- Generate: `npm run generate` - Clean and generate static files, then start server
- Add Post: `npm run add_post --posttitle="Your Post Title"` - Create new post
- Test README: `npm run test-readme` - Test README generation
- Restore README: `npm run restore-readme` - Restore README from backup

## Code Style Guidelines
- **Markdown Format**: Use proper headings (### for H3), code blocks with language (```js), and horizontal rules (---)
- **Front Matter**: Required fields: title, date, tags, categories, description
- **Images**: Use custom tags: `{% darrellImage [alt] [path] %}` or `{% darrellImage800 [alt] [path] [class] %}`
- **File Organization**:
  - Posts in `/source/_posts/` with matching asset folders
  - Use kebab-case for filenames (e.g., `my-new-post.md`)
- **Post Structure**:
  - Start with a cover image using `{% darrellImageCover [alt] [path] [class] %}`
  - Use proper section headings and formatting
  - Add reference links at the end

## Hexo Configuration
- Main config: `_config.yml` and `main.yml`
- Theme config: `themes/[theme-name]/_config.yml`
- Always test locally before committing changes
- README is auto-generated - changes should be made to generation script