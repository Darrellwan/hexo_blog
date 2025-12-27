#!/usr/bin/env node

/**
 * 靜態生成 models.html
 * 解決 SEO 問題：生成包含完整內容的 HTML，而非客戶端動態渲染
 *
 * 使用方式：
 * npm run n8n:generate-models
 */

const fs = require('fs');
const path = require('path');

// 路徑配置
const ROOT_DIR = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT_DIR, 'data', 'workflow-models.json');
const OUTPUT_PATH = path.join(ROOT_DIR, 'models.html');
const TEMPLATE_PATH = path.join(ROOT_DIR, 'models.template.html');
const DETAIL_TEMPLATE_PATH = path.join(ROOT_DIR, 'model-detail.template.html');
const DETAIL_OUTPUT_DIR = path.join(ROOT_DIR, 'model');

// 排序配置（從原始 HTML 中提取）
const SORT_CONFIG = {
    defaultSortBy: 'date',
    defaultSortDirection: 'desc',
    pinnedModels: [],
    modelWeights: {}
};

// SEO 配置
const SEO_CONFIG = {
    baseUrl: 'https://www.darrelltw.com/tools/n8n_template/',
    canonicalUrl: 'https://www.darrelltw.com/tools/n8n_template/models.html',
    ogImage: 'https://www.darrelltw.com/tools/n8n_template/model-template-og-c.png',
    twitterImage: 'https://www.darrelltw.com/tools/n8n_template/twitter-card.jpg',
    twitterHandle: '@darrell_tw_',
    siteName: 'DarrellTW n8n 模板庫'
};

/**
 * 生成單個模板卡片 HTML
 * @param {object} model - 模板資料
 * @param {string} id - 模板 ID
 * @param {number} index - 卡片索引（用於判斷是否為高優先級圖片）
 */
function createModelCard(model, id, index) {
    const tagsHTML = model.tags.map(tag => `<span class="glass-tag">${tag}</span>`).join('');

    // LCP 優化：前 6 張使用 eager loading，其餘使用 lazy loading
    const loadingAttr = index < 6 ? ' loading="eager"' : ' loading="lazy"';
    // 前 6 張設為最高優先級
    const fetchPriorityAttr = index < 6 ? ' fetchpriority="high"' : '';
    // 所有圖片使用非同步解碼
    const decodingAttr = ' decoding="async"';

    // 圖片路徑（優先使用 webp）
    const imageUrl = `data/bg/${id}.webp`;

    // 格式化日期 (e.g., "2023-11-22" -> "Nov 22")
    const dateObj = new Date(model.updatedAt || model.createdAt);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    return `
            <article class="glass-card" data-nodes="${model.nodes || 0}" data-title="${model.title}" data-date="${model.updatedAt}" data-tags="${model.tags.join(' ')}">
                <div class="card-img-wrapper">
                    <img src="${imageUrl}" alt="${model.title}" class="card-img" width="400" height="400"${loadingAttr}${fetchPriorityAttr}${decodingAttr} onerror="this.src='https://placehold.co/400x400/222/FFF?text=n8n'">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${model.title}</h3>
                    <p class="card-desc">${formatDescription(model.detailedDescription)}</p>
                    <div class="card-tags">
                        ${tagsHTML}
                    </div>
                    <div class="card-footer">
                        <div class="node-count">
                            <div class="node-dot"></div>
                            ${model.nodes || 0} Nodes
                        </div>
                        <span class="date">${dateStr}</span>
                    </div>
                </div>
                <a href="model/${id}.html" class="card-link" aria-label="${model.title}" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;"></a>
            </article>`;
}

/**
 * 格式化描述文字
 */
function formatDescription(description) {
    if (!description) return '';
    const descStr = String(description);
    return descStr.split('\n').join(' ');
}

/**
 * 智能排序模型（複製原始邏輯）
 */
function sortModels(modelEntries) {
    return modelEntries.sort((a, b) => {
        // 1. 檢查置頂模型
        const aPinIndex = SORT_CONFIG.pinnedModels.indexOf(a.id);
        const bPinIndex = SORT_CONFIG.pinnedModels.indexOf(b.id);

        if (aPinIndex !== -1 && bPinIndex !== -1) {
            return aPinIndex - bPinIndex;
        }
        if (aPinIndex !== -1) return -1;
        if (bPinIndex !== -1) return 1;

        // 2. 檢查優先級
        const aPriority = a.model.priority || 0;
        const bPriority = b.model.priority || 0;

        if (aPriority !== bPriority) {
            return bPriority - aPriority;
        }

        // 3. 檢查權重
        const aWeight = SORT_CONFIG.modelWeights[a.id] || 0;
        const bWeight = SORT_CONFIG.modelWeights[b.id] || 0;

        if (aWeight !== bWeight) {
            return bWeight - aWeight;
        }

        // 4. 默認排序
        if (SORT_CONFIG.defaultSortBy === 'none') {
            return 0;
        }

        const isAsc = SORT_CONFIG.defaultSortDirection === 'asc';

        switch (SORT_CONFIG.defaultSortBy) {
            case 'nodes':
                const aNodes = a.model.nodes || 0;
                const bNodes = b.model.nodes || 0;
                return isAsc ? aNodes - bNodes : bNodes - aNodes;

            case 'date':
                const aDate = a.model.updatedAt || a.model.createdAt || '';
                const bDate = b.model.updatedAt || b.model.createdAt || '';
                return isAsc
                    ? aDate.localeCompare(bDate)
                    : bDate.localeCompare(aDate);

            case 'title':
                return isAsc
                    ? a.model.title.localeCompare(b.model.title)
                    : b.model.title.localeCompare(a.model.title);

            default:
                return 0;
        }
    });
}

/**
 * 生成結構化數據（Schema.org）
 * 使用 SoftwareApplication 類型以提升 SEO 效果
 */
function generateSchemaData(modelEntries) {
    const itemListElements = modelEntries.map(({ id, model }, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
            "@type": "SoftwareApplication",
            "name": model.title,
            "description": model.description,
            "applicationCategory": "BusinessApplication",
            "applicationSubCategory": "WorkflowAutomation",
            "operatingSystem": "n8n",
            "softwareVersion": model.version || "1.0",
            "datePublished": model.createdAt,
            "dateModified": model.updatedAt,
            "author": {
                "@type": "Person",
                "name": "Darrell Wang",
                "url": "https://www.darrelltw.com"
            },
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "TWD",
                "availability": "https://schema.org/InStock"
            },
            "keywords": model.tags.join(', '),
            "url": `https://darrelltw.com/tools/n8n_template/model/${id}.html`,
            "screenshot": `https://www.darrelltw.com/tools/n8n_template/data/bg/darrell_workflow_template_${id}.jpg`,
            "featureList": model.detailedDescription.slice(0, 5)
        }
    }));

    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "DarrellTW n8n 自動化模板庫",
        "description": "免費 n8n 自動化工作流程模板集合，包含 LINE Bot、AI 圖像生成、Google Sheets 整合等實用範例",
        "numberOfItems": modelEntries.length,
        "itemListElement": itemListElements
    };
}

/**
 * 生成 SEO Meta 標籤
 */
function generateSEOMetaTags(templateCount) {
    const title = `n8n 模板分享 | Darrell`;
    const description = `探索 ${templateCount}+ 個免費 n8n 自動化模板：LINE Bot、AI 圖像生成、Google Sheets 整合、Instagram 自動發文等。一鍵下載即用，大幅提升工作效率！`;

    return `
    <!-- SEO Meta Tags (Auto-generated by generate-models-page.js) -->
    <link rel="canonical" href="${SEO_CONFIG.canonicalUrl}">

    <!-- LCP Optimization: Preload critical images -->
    <link rel="preload" as="image" href="data/bg/n8n_line_messaging_community.webp" fetchpriority="high">
    <link rel="preload" as="image" href="data/bg/n8n-sora2-prompt-to-video.webp" fetchpriority="high">
    <link rel="preload" as="image" href="data/bg/darrell-n8n-demo-datatables.webp" fetchpriority="high">

    <!-- Open Graph (Facebook, LinkedIn, Instagram, Threads) -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SEO_CONFIG.siteName}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${SEO_CONFIG.canonicalUrl}">
    <meta property="og:image" content="${SEO_CONFIG.ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Darrell n8n 模板庫 - ${templateCount}+ 個自動化工作流程">
    <meta property="og:locale" content="zh_TW">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="${SEO_CONFIG.twitterHandle}">
    <meta name="twitter:creator" content="${SEO_CONFIG.twitterHandle}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${SEO_CONFIG.twitterImage}">
    <meta name="twitter:image:alt" content="Darrell n8n 模板庫">
`;
}

/**
 * 讀取 HTML 模板
 */
function loadTemplate() {
    // 如果存在獨立模板文件，使用它；否則使用當前的 models.html
    if (fs.existsSync(TEMPLATE_PATH)) {
        console.log('📄 使用模板文件：models.template.html');
        return fs.readFileSync(TEMPLATE_PATH, 'utf8');
    } else if (fs.existsSync(OUTPUT_PATH)) {
        console.log('📄 使用現有文件作為模板：models.html');
        return fs.readFileSync(OUTPUT_PATH, 'utf8');
    } else {
        throw new Error('找不到模板文件！請確保 models.html 或 models.template.html 存在');
    }
}

/**
 * 生成單個詳情頁
 */
function generateDetailPages(models) {
    console.log('📄 開始生成詳情頁...');
    
    if (!fs.existsSync(DETAIL_TEMPLATE_PATH)) {
        throw new Error(`找不到詳情頁模板：${DETAIL_TEMPLATE_PATH}`);
    }

    if (!fs.existsSync(DETAIL_OUTPUT_DIR)) {
        fs.mkdirSync(DETAIL_OUTPUT_DIR, { recursive: true });
    }

    const template = fs.readFileSync(DETAIL_TEMPLATE_PATH, 'utf8');

    Object.entries(models).forEach(([id, model]) => {
        let html = template;
        
        // 格式化日期
        const dateObj = new Date(model.updatedAt || model.createdAt);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

        // 構建標籤 HTML
        const tagsHTML = (model.tags || []).map(tag => `<span class="glass-tag">${tag}</span>`).join('');

        // 構建特色列表 HTML
        const featuresHTML = (model.detailedDescription || [])
            .map(f => `<li>${f}</li>`)
            .join('');

        // 構建設置說明 HTML
        let setupHTML = '<p>暫無設置說明</p>';
        if (model.setup) {
            if (Array.isArray(model.setup.steps)) {
                setupHTML = `
                    <p><strong>預先設定：</strong>${model.setup.prerequisites || '無'}</p>
                    <ol>${model.setup.steps.map(step => `<li><strong>${step.title}</strong>: ${step.description}<ul>${(step.options || []).map(opt => `<li>${opt}</li>`).join('')}</ul></li>`).join('')}</ol>
                `;
            }
        }

        // 構建延伸閱讀 HTML（內嵌在功能特色區塊）
        let relatedArticlesInline = '';
        if (model.relatedArticles && model.relatedArticles.length > 0) {
            const articlesListHTML = model.relatedArticles.map(article => `
                        <a href="${article.url}" class="related-item" target="_blank" rel="noopener">
                            <span>${article.title}</span>
                            <span class="related-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                </svg>
                            </span>
                        </a>`).join('');

            relatedArticlesInline = `
                    <div class="related-section">
                        <div class="related-title">
                            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                            深入了解
                        </div>
                        <div class="related-list">${articlesListHTML}
                        </div>
                    </div>`;
        }

        // 讀取 Workflow JSON
        let workflowJSON = '{}';
        try {
            const workflowPath = path.join(ROOT_DIR, 'data', 'workflows', `${id}.json`);
            if (fs.existsSync(workflowPath)) {
                workflowJSON = fs.readFileSync(workflowPath, 'utf8');
            } else {
                console.warn(`⚠️  找不到 Workflow JSON: ${id}`);
            }
        } catch (e) {
            console.warn(`⚠️  讀取 Workflow JSON 失敗: ${id}`, e);
        }

        // 準備 SoftwareApplication Schema 所需變數
        const descriptionEscaped = (model.description || '').replace(/\n/g, ' ').replace(/"/g, '\\"').substring(0, 500);
        const createdAt = model.createdAt || dateStr;
        const updatedAt = model.updatedAt || dateStr;
        const featuresJSON = JSON.stringify(model.detailedDescription || []);

        // 生成 HowTo Schema（如果有 setup 步驟）
        let howToSchema = '';
        if (model.setup && model.setup.steps && model.setup.steps.length > 0) {
            const steps = model.setup.steps.map((step, index) => ({
                "@type": "HowToStep",
                "position": index + 1,
                "name": step.title,
                "text": step.description + (step.options ? ' ' + step.options.join(', ') : '')
            }));

            const howToData = {
                "@context": "https://schema.org",
                "@type": "HowTo",
                "name": `如何設定 ${model.title}`,
                "description": model.setup.prerequisites || `${model.title} 的完整設定教學`,
                "totalTime": "PT15M",
                "estimatedCost": {
                    "@type": "MonetaryAmount",
                    "currency": "TWD",
                    "value": "0"
                },
                "step": steps
            };

            howToSchema = `<script type="application/ld+json">
    ${JSON.stringify(howToData, null, 2).replace(/\n/g, '\n    ')}
    </script>`;
        }

        // 替換變數
        html = html
            .replace(/{{TITLE}}/g, model.title)
            .replace(/{{DESCRIPTION}}/g, model.description || '')
            .replace(/{{DESCRIPTION_ESCAPED}}/g, descriptionEscaped)
            .replace(/{{ID}}/g, id)
            .replace(/{{NODES}}/g, model.nodes || 0)
            .replace(/{{DATE}}/g, dateStr)
            .replace(/{{CREATED_AT}}/g, createdAt)
            .replace(/{{UPDATED_AT}}/g, updatedAt)
            .replace(/{{TAGS_HTML}}/g, tagsHTML)
            .replace(/{{FEATURES_HTML}}/g, featuresHTML)
            .replace(/{{FEATURES_JSON}}/g, featuresJSON)
            .replace(/{{HOWTO_SCHEMA}}/g, howToSchema)
            .replace(/{{SETUP_HTML}}/g, setupHTML)
            .replace(/{{RELATED_ARTICLES_INLINE}}/g, relatedArticlesInline)
            .replace(/{{WORKFLOW_JSON}}/g, () => workflowJSON);

        // 寫入文件
        const outputPath = path.join(DETAIL_OUTPUT_DIR, `${id}.html`);
        fs.writeFileSync(outputPath, html, 'utf8');
    });

    console.log(`✅ 已生成 ${Object.keys(models).length} 個詳情頁\n`);
}

/**
 * 主函數：生成靜態 HTML
 */
function generateModelsPage() {
    console.log('🚀 開始生成 models.html...\n');

    // 1. 讀取數據
    console.log('📖 讀取 workflow-models.json...');
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const models = data.models;
    console.log(`✅ 找到 ${Object.keys(models).length} 個模板\n`);

    // 2. 準備模型數據
    let modelEntries = Object.entries(models).map(([id, model]) => {
        model.id = id;
        return { id, model };
    });

    // 3. 排序
    console.log('🔄 排序模板...');
    modelEntries = sortModels(modelEntries);

    // 4. 生成卡片 HTML
    console.log('🎨 生成卡片 HTML...');
    const cardsHTML = modelEntries.map(({ id, model }, index) => createModelCard(model, id, index)).join('\n');

    // 5. 生成結構化數據
    console.log('📊 生成結構化數據...');
    const schemaData = generateSchemaData(modelEntries);
    const schemaJSON = JSON.stringify(schemaData, null, 2);

    // 6. 讀取並處理模板
    console.log('📝 處理 HTML 模板...');
    let html = loadTemplate();

    // 替換 model-grid 內容
    // 使用標記查找而非正則表達式（避免嵌套 div 問題）
    const gridStart = '<div class="model-grid">';
    const gridStartIndex = html.indexOf(gridStart);

    if (gridStartIndex === -1) {
        throw new Error('找不到 <div class="model-grid">');
    }

    // 從 model-grid 開始計算嵌套深度
    let depth = 0;
    let pos = gridStartIndex;
    let gridEndIndex = -1;

    while (pos < html.length) {
        if (html.substr(pos, 4) === '<div') {
            depth++;
            pos += 4;
        } else if (html.substr(pos, 6) === '</div>') {
            depth--;
            if (depth === 0) {
                gridEndIndex = pos;
                break;
            }
            pos += 6;
        } else {
            pos++;
        }
    }

    if (gridEndIndex === -1) {
        throw new Error('找不到匹配的 </div>');
    }

    // 替換內容
    const before = html.substring(0, gridStartIndex + gridStart.length);
    const after = html.substring(gridEndIndex);
    html = before + '\n' + cardsHTML + '\n            ' + after;

    // 替換結構化數據
    if (html.includes('{{SCHEMA_JSON}}')) {
        html = html.replace('{{SCHEMA_JSON}}', schemaJSON);
    } else {
        // 替換 <script type="application/ld+json" id="workflow-models-schema"> 的內容
        html = html.replace(
            /(<script type="application\/ld\+json" id="workflow-models-schema">)([\s\S]*?)(<\/script>)/,
            `$1${schemaJSON}$3`
        );
    }

    // 替換總數
    // 尋找 <span class="stat-number" id="totalCount">3</span> 並替換數字
    html = html.replace(
        /(<span class="stat-number" id="totalCount">)(\d+)(<\/span>)/,
        `$1${modelEntries.length}$3`
    );

    // 6. 注入 SEO Meta 標籤
    console.log('🔖 注入 SEO Meta 標籤...');
    const seoTags = generateSEOMetaTags(modelEntries.length);

    // 先移除舊的 SEO Meta Tags（避免重複）
    html = html.replace(/<!-- SEO Meta Tags \(Auto-generated by generate-models-page\.js\) -->[\s\S]*?(?=<meta name="description"|<link rel="apple-touch-icon"|<link rel="preconnect"|<link rel="icon"|<style>)/g, '');

    // 在 </title> 後插入 SEO 標籤
    const titleEndTag = '</title>';
    const titleEndIndex = html.indexOf(titleEndTag);

    if (titleEndIndex !== -1) {
        const insertPosition = titleEndIndex + titleEndTag.length;
        const before = html.substring(0, insertPosition);
        const after = html.substring(insertPosition);
        html = before + seoTags + after;
        console.log('✅ SEO 標籤已注入（Open Graph + Twitter Card + Canonical + LCP Preload）');
    } else {
        console.warn('⚠️  警告：找不到 </title> 標籤，SEO 標籤未注入');
    }

    // 7. 寫入文件
    console.log('💾 寫入 models.html...');
    fs.writeFileSync(OUTPUT_PATH, html, 'utf8');

    console.log('\n✅ models.html 生成成功！');
    console.log(`📍 文件位置：${OUTPUT_PATH}`);
    console.log(`📦 包含 ${modelEntries.length} 個模板卡片`);
    console.log(`🔍 SEO 友好：爬蟲可直接讀取完整內容\n`);

    // 8. 生成詳情頁
    generateDetailPages(models);

    // 9. 生成 Sitemap
    generateSitemap(models);

    // 10. 生成 Images Sitemap
    generateImagesSitemap(models);
}

/**
 * 生成 Sitemap.xml
 */
function generateSitemap(models) {
    console.log('🗺️  開始生成 Sitemap...');
    const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
    
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

    Object.entries(models).forEach(([id, model]) => {
        const date = new Date(model.updatedAt || model.createdAt).toISOString().split('T')[0];
        
        // 詳情頁
        sitemapContent += `
  <!-- 模型詳情頁 - ${id} -->
  <url>
    <loc>https://www.darrelltw.com/tools/n8n_template/model/${id}.html</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    sitemapContent += `</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
    console.log(`✅ Sitemap 生成成功！ (${Object.keys(models).length + 1} URLs)`);
}

/**
 * 生成 Images Sitemap（用於 Google Images 索引）
 */
function generateImagesSitemap(models) {
    console.log('📸 開始生成 Images Sitemap...');
    const IMAGES_SITEMAP_PATH = path.join(ROOT_DIR, 'images-sitemap.xml');

    let content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- 模板列表頁的所有預覽圖 -->
  <url>
    <loc>https://www.darrelltw.com/tools/n8n_template/models.html</loc>`;

    Object.entries(models).forEach(([id, model]) => {
        const title = model.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const caption = (model.description || '').substring(0, 100).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, ' ');
        content += `
    <image:image>
      <image:loc>https://www.darrelltw.com/tools/n8n_template/data/bg/${id}.webp</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${caption}</image:caption>
    </image:image>`;
    });

    content += `
  </url>
`;

    // 每個詳情頁的預覽圖
    Object.entries(models).forEach(([id, model]) => {
        const title = model.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const caption = (model.description || '').substring(0, 100).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, ' ');
        content += `
  <url>
    <loc>https://www.darrelltw.com/tools/n8n_template/model/${id}.html</loc>
    <image:image>
      <image:loc>https://www.darrelltw.com/tools/n8n_template/data/bg/${id}.webp</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${caption}</image:caption>
    </image:image>
  </url>`;
    });

    content += `
</urlset>`;

    fs.writeFileSync(IMAGES_SITEMAP_PATH, content, 'utf8');
    console.log(`✅ Images Sitemap 生成成功！ (${Object.keys(models).length + 1} URLs, ${Object.keys(models).length * 2} images)`);
}

// 執行生成
try {
    generateModelsPage();
} catch (error) {
    console.error('❌ 生成失敗：', error.message);
    console.error(error.stack);
    process.exit(1);
}
