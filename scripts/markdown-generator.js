/**
 * Markdown for Agents Generator
 *
 * 在 Hexo build 時，將每篇文章的 Markdown 原始檔複製到 public/ 對應路徑
 * 讓 AI agent 可以透過 Accept: text/markdown header 取得原始內容
 */

const fs = require('fs');
const path = require('path');

hexo.extend.filter.register('after_generate', function() {
  const sourceDir = this.source_dir;
  const publicDir = this.public_dir;
  const posts = this.locals.get('posts');

  posts.forEach(post => {
    // 取得文章的原始 Markdown 路徑
    const sourcePath = path.join(sourceDir, post.source);

    // 取得文章的 permalink（例如：n8n-teaching-intro/）
    // 移除開頭的 / 和結尾的 /
    const permalink = post.path.replace(/^\/|\/$/g, '');

    // 目標路徑：public/{permalink}/index.md
    const targetDir = path.join(publicDir, permalink);
    const targetPath = path.join(targetDir, 'index.md');

    // 確保目標目錄存在
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 複製 Markdown 檔案
    try {
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`[Markdown for Agents] Generated: ${permalink}/index.md`);
      }
    } catch (err) {
      console.error(`[Markdown for Agents] Error copying ${sourcePath}:`, err);
    }
  });

  console.log(`[Markdown for Agents] Generated ${posts.length} markdown files`);
});
