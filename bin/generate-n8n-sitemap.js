const fs = require('fs');
const path = require('path');

// 定義路徑
const modelsPath = path.join(__dirname, '../source/tools/n8n_template/data/workflow-models.json');
const sitemapPath = path.join(__dirname, '../source/tools/n8n_template/sitemap.xml');

// 讀取 workflow-models.json
const modelsData = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));
const models = modelsData.models;

// 生成 sitemap XML
let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 主頁 -->
  <url>
    <loc>https://www.darrelltw.com/tools/n8n_template/models.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
`;

// 為每個模型添加動態 URL 和靜態快照 URL
for (const modelId in models) {
  const model = models[modelId];
  const lastmod = model.updatedAt || new Date().toISOString().split('T')[0];
  
  // 添加主要 URL (model-detail.html?model=xxx)
  sitemapContent += `  <!-- 模型詳情頁 - ${modelId} -->
  <url>
    <loc>https://www.darrelltw.com/tools/n8n_template/model-detail.html?model=${modelId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
`;

  // 添加靜態快照 URL (snapshots/xxx.html) - 但優先級稍低
  sitemapContent += `  <!-- 模型快照頁 - ${modelId} -->
  <url>
    <loc>https://www.darrelltw.com/tools/n8n_template/snapshots/${modelId}.html</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
`;
}

// 添加視覺化頁面
sitemapContent += `  <!-- 視覺化頁面 -->
  <url>
    <loc>https://www.darrelltw.com/tools/n8n_template/visualize.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

// 寫入 sitemap.xml
fs.writeFileSync(sitemapPath, sitemapContent);

console.log('N8N Workflows Sitemap 已生成完成!'); 