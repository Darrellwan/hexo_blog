const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// 定義目錄路徑
const modelsJsonPath = path.join(__dirname, '../source/tools/n8n_template/data/workflow-models.json');
const outputDir = path.join(__dirname, '../source/tools/n8n_template/snapshots');

// 確保輸出目錄存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 讀取模型數據
const modelsData = JSON.parse(fs.readFileSync(modelsJsonPath, 'utf8'));
const models = modelsData.models;

// HTML 模板基本結構
const generateHtmlTemplate = (modelId, title, description, tags, createdAt, updatedAt, schemaData) => {
  // 處理描述文字，移除多餘的換行和空格
  const cleanDescription = description.replace(/\n+/g, ' ').trim();
  const shortDescription = cleanDescription.length > 150 
    ? cleanDescription.substring(0, 147) + '...' 
    : cleanDescription;

  // 將標籤陣列轉為逗號分隔的字串
  const tagsString = Array.isArray(tags) ? tags.join(', ') : '';

  // 生成頁面標題
  const pageTitle = `${title} - n8n 自動化模板 | Darrell 自動化工具`;

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${shortDescription}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${shortDescription}">
  <meta property="og:url" content="https://www.darrelltw.com/tools/n8n_template/model-detail.html?model=${modelId}">
  <meta property="og:image" content="https://www.darrelltw.com/images/darrell_icon_512.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Darrell 自動化工具">
  <meta property="og:locale" content="zh_TW">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${shortDescription}">
  <meta name="twitter:image" content="https://www.darrelltw.com/images/darrell_icon_512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="robots" content="noindex">
  <link rel="canonical" href="https://www.darrelltw.com/tools/n8n_template/model-detail.html?model=${modelId}">
  <script type="application/ld+json">
  ${JSON.stringify(schemaData, null, 2)}
  </script>
  <meta http-equiv="refresh" content="0;url=https://www.darrelltw.com/tools/n8n_template/model-detail.html?model=${modelId}">
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <p>標籤: ${tagsString}</p>
  <p>建立於: ${createdAt}</p>
  <p>更新於: ${updatedAt}</p>
  <a href="https://www.darrelltw.com/tools/n8n_template/model-detail.html?model=${modelId}">查看詳情</a>
</body>
</html>`;
};

// 生成每個模型的靜態 HTML 快照
async function generateSnapshots() {
  console.log('開始生成 HTML 快照...');

  for (const [modelId, model] of Object.entries(models)) {
    // 生成基本的結構化數據
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": model.title || `n8n 模板 - ${modelId}`,
      "applicationCategory": "工作流程自動化",
      "operatingSystem": "跨平台",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "TWD"
      },
      "description": model.description || "n8n 自動化工作流程模板",
      "datePublished": model.createdAt || new Date().toISOString().split('T')[0],
      "dateModified": model.updatedAt || new Date().toISOString().split('T')[0],
      "keywords": Array.isArray(model.tags) ? model.tags.join(", ") : "自動化,n8n,工作流程",
      "url": `https://www.darrelltw.com/tools/n8n_template/model-detail.html?model=${modelId}`
    };

    // 生成 HTML 內容
    const htmlContent = generateHtmlTemplate(
      modelId,
      model.title || `未命名模板 - ${modelId}`,
      model.description || "無描述",
      model.tags || [],
      model.createdAt || "未知",
      model.updatedAt || "未知",
      schemaData
    );

    // 寫入靜態 HTML 文件
    const outputPath = path.join(outputDir, `${modelId}.html`);
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`已生成 ${modelId}.html`);
  }

  console.log('HTML 快照生成完成!');
}

// 將這段程式碼
generateSnapshots().catch(console.error);

// 修改為：
if (require.main === module) {
  // 只有當此檔案被直接執行時才會運行
  generateSnapshots().catch(console.error);
}

module.exports = generateSnapshots; 