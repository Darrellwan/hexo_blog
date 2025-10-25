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

// 排序配置（從原始 HTML 中提取）
const SORT_CONFIG = {
    defaultSortBy: 'none',
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
 */
function createModelCard(model, id) {
    const tagsHTML = model.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    return `
                <div class="model-card" data-nodes="${model.nodes || 0}" data-title="${model.title}" data-date="${model.updatedAt}">
                    <div class="card-banner"></div>
                    <div class="card-header">
                        <h3 class="card-title">${model.title}</h3>
                    </div>
                    <div class="card-image" id="card-image-${id}">
                        即將上傳 1:1 比例圖片
                    </div>
                    <div class="card-content">
                        <div class="card-description">${formatDescription(model.detailedDescription)}</div>
                        <div class="tag-container">
                            ${tagsHTML}
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="metric">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                            <span>${model.nodes || 0} 個節點</span>
                        </div>
                        <div class="metric">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM4.5 7.5A.5.5 0 0 0 4 8v4a.5.5 0 0 0 1 0V8a.5.5 0 0 0-.5-.5zm7 0a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 1 0V8a.5.5 0 0 0-.5-.5z"/>
                            </svg>
                            <span>${model.updatedAt}</span>
                        </div>
                    </div>
                    <a href="model-detail.html?model=${id}" class="card-link" aria-label="${model.title}"></a>
                </div>`;
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
            "url": `https://darrelltw.com/tools/n8n_template/model-detail.html?model=${id}`,
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
    const title = `n8n 自動化模板分享 - ${templateCount}+ 免費工作流程範例 | Darrell`;
    const description = '探索 23+ 個免費 n8n 自動化模板：LINE Bot、AI 圖像生成、Google Sheets 整合、Instagram 自動發文等。一鍵下載即用，大幅提升工作效率！';

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
    const cardsHTML = modelEntries.map(({ id, model }) => createModelCard(model, id)).join('\n');

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
}

// 執行生成
try {
    generateModelsPage();
} catch (error) {
    console.error('❌ 生成失敗：', error.message);
    console.error(error.stack);
    process.exit(1);
}
