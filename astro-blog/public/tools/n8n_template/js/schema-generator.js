/**
 * 為 n8n 模板網站生成 Schema.org 結構化數據
 * 從 workflow-models.json 讀取數據並生成 CollectionPage 結構化數據
 */
function generateSchemaOrgData() {
  // 檢查主腳本是否已經生成了結構化數據
  if (window.schemaGeneratorExecuted) {
    console.log('主腳本已經生成了結構化數據，跳過 schema-generator.js 的執行');
    return;
  }
  
  console.log('開始生成結構化數據...');
  
  // 獲取元素放置 schema.org 數據的元素
  const schemaScriptElement = document.getElementById('workflow-models-schema');
  console.log('找到現有腳本元素:', schemaScriptElement ? true : false);
  
  // 如果已經有內容，則跳過
  if (schemaScriptElement && schemaScriptElement.textContent.trim()) {
    console.log('腳本元素已有內容，跳過生成');
    return;
  }
  
  // 從 JSON 文件加載模板數據
  fetch('data/workflow-models.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('成功獲取 workflow-models.json');
      return response.json();
    })
    .then(data => {
      if (!data || !data.models) {
        throw new Error('數據格式無效或沒有找到 models 對象');
      }
      
      console.log('成功解析 JSON 數據，找到模型數量:', Object.keys(data.models).length);
      
      // 生成 Schema.org 數據結構
      const schemaData = buildSchemaOrgStructure(data.models);
      console.log('生成 Schema.org 數據完成');
      
      // 將 JSON 數據添加到腳本元素
      if (schemaScriptElement) {
        schemaScriptElement.textContent = JSON.stringify(schemaData);
        console.log('已更新現有腳本元素');
      } else {
        // 如果沒有找到指定元素，創建一個新元素
        console.log('未找到現有腳本元素，創建新元素');
        const newScript = document.createElement('script');
        newScript.type = 'application/ld+json';
        newScript.id = 'workflow-models-schema';
        newScript.textContent = JSON.stringify(schemaData);
        document.head.appendChild(newScript);
        console.log('已將新腳本元素添加到 head 中');
      }
    })
    .catch(error => {
      console.error('生成結構化數據時發生錯誤:', error);
    });
}

/**
 * 構建 Schema.org 結構化數據
 * @param {Object} models - 模板數據對象
 * @return {Object} - 結構化數據對象
 */
function buildSchemaOrgStructure(models) {
  // 將模板對象轉換為數組，方便處理
  const modelArray = Object.entries(models).map(([id, model]) => {
    return { id, ...model };
  });
  
  // 創建 ItemList 的元素數組
  const itemListElements = modelArray.map((model, index) => {
    // 從模板描述中提取前200個字符作為簡短描述
    const shortDescription = model.description 
      ? model.description.split('\n')[0].substring(0, 200) + '...'
      : '';
    
    // 將字符串數組合併為單個描述字符串
    const detailedDesc = Array.isArray(model.detailedDescription) 
      ? model.detailedDescription.join('。 ') 
      : model.detailedDescription || '';
    
    return {
      "@type": "SoftwareApplication",
      "position": index + 1,
      "name": model.title,
      "description": shortDescription,
      "applicationCategory": "工作流程自動化工具",
      "operatingSystem": "Web",
      "author": {
        "@type": "Person",
        "name": "DarrellTW"
      },
      "offers": {
       "@type": "Offer",
       "price": "0",
       "priceCurrency": "TWD",
       "availability": "https://schema.org/InStock"
      },
      "datePublished": model.createdAt || "",
      "dateModified": model.updatedAt || model.createdAt || "",
      "softwareVersion": "1.0",
      "keywords": model.tags.join(", "),
      "url": `https://darrelltw.com/tools/n8n_template/model-detail.html?model=${model.id}`
    };
  });
  
  // 構建完整的 Schema.org 結構
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": "Darrell n8n 自動化工作流程模板分享集合",
    "description": "免費 n8n 自動化模板資源，包含多種實用工作流程範例，一鍵下載立即使用。探索提升效率的自動化解決方案！",
    "keywords": "n8n, 自動化, 工作流程, 模板, API整合, 效率工具",
    "author": {
      "@type": "Person",
      "name": "DarrellTW",
      "url": "https://www.darrelltw.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DarrellTW",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.darrelltw.com/tools/n8n_template/favicon/android-chrome-192x192.png"
      }
    },
    "inLanguage": "zh-TW",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": itemListElements.length,
      "itemListElement": itemListElements
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首頁",
          "item": "https://www.darrelltw.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "工具集",
          "item": "https://www.darrelltw.com/tools/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "n8n 模板分享",
          "item": "https://www.darrelltw.com/tools/n8n_template/models.html"
        }
      ]
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.darrelltw.com/tools/n8n_template/models.html?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
}

// 確保在 DOM 完全加載後執行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', generateSchemaOrgData);
} else {
  // 如果 DOM 已經加載完成，直接執行
  generateSchemaOrgData();
}

// 添加一個備用方法，確保腳本能夠執行
window.addEventListener('load', function() {
  const schemaScript = document.getElementById('workflow-models-schema');
  // 如果還沒有生成，再嘗試一次
  if (!schemaScript || !schemaScript.textContent) {
    console.log('在 window.load 事件中再次嘗試生成數據');
    generateSchemaOrgData();
  }
});
