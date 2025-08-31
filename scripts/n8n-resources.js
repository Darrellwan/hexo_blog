'use strict';

// 註冊自定義的n8n分類助手函數
hexo.extend.helper.register('get_n8n_posts_by_category', function(category) {
  const posts = this.site.posts.data;
  
  // 過濾出n8n相關的文章
  const n8nPosts = posts.filter(post => {
    // 檢查文章是否包含 n8n 標籤
    if (post.tags && post.tags.data) {
      for (const tag of post.tags.data) {
        if (tag.name === 'n8n') {
          return true;
        }
      }
    }
    
    // 或者檢查是否在 n8n 分類下
    if (post.categories && post.categories.data) {
      for (const cat of post.categories.data) {
        if (cat.name === 'n8n') {
          return true;
        }
      }
    }
    
    return false;
  });

  // 定義分類對應關係
  const categoryMap = {
    'node-intro': ['Webhook', 'Aggregate', 'Split Out', 'If', 'Switch', '內建參數', '節點介紹'],
    'tips': ['Pin Data', 'Timezone', '小撇步', 'tips', 'debug', 'n8n-debug'],
    'templates': ['模板分享', '模板', 'LINE', 'Slack'],
    'updates': ['功能更新', '資料夾', 'Folders', '版本更新'],
    'deployment': ['部署', '設定', 'Zeabur', '安裝']
  };
  
  // 根據提供的分類，過濾出相對應的文章
  return n8nPosts.filter(post => {
    // 檢查文章是否有 n8n-debug 標籤
    const hasDebugTag = post.tags && post.tags.data && 
      post.tags.data.some(tag => tag.name === 'n8n-debug');
    

    
    // 如果文章有 n8n-debug 標籤，只歸類到 tips
    if (hasDebugTag) {
      return category === 'tips';
    }
    
    // 檢查自定義分類 (如有)
    if (post.n8n_category === category) {
      return true;
    }
    
    // 獲取文章標題
    const title = post.title || '';
    
    // 檢查文章標題是否包含該分類的關鍵字
    for (const keyword of categoryMap[category] || []) {
      if (title.includes(keyword)) {
        return true;
      }
    }
    
    // 檢查文章標籤是否包含該分類的關鍵字
    if (post.tags && post.tags.data) {
      for (const tag of post.tags.data) {
        for (const keyword of categoryMap[category] || []) {
          if (tag.name.includes(keyword)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }).sort((a, b) => b.date - a.date); // 按日期倒序排列
});

// 註冊一個生成 n8n 文章 JSON 數據的助手函數，用於結構化資料
hexo.extend.helper.register('get_n8n_posts_json_for_schema', function() {
  const sections = [
    { id: 'tips', title: 'n8n 小撇步' },
    { id: 'node-intro', title: 'n8n 節點介紹' },
    { id: 'templates', title: 'n8n 模板分享' },
    { id: 'updates', title: 'n8n 功能更新' },
    { id: 'deployment', title: 'n8n 部署與設定' }
  ];
  
  let allPosts = [];
  let position = 0;
  
  // 先收集所有文章，避免重複
  const processedPosts = new Set();
  
  // 遍歷每個分類獲取文章
  for (const section of sections) {
    const posts = this.get_n8n_posts_by_category(section.id);
    if (posts && posts.length > 0) {
      for (const post of posts) {
        // 避免重複處理同一篇文章
        const postKey = post.path || post.title;
        if (processedPosts.has(postKey)) {
          continue;
        }
        processedPosts.add(postKey);
        
        position++;
        allPosts.push({
          position: position,
          title: post.title,
          url: this.config.url + this.url_for(post.path),
          description: this.get_n8n_post_description(post),
          image: this.config.url + this.get_n8n_post_thumbnail(post),
          category: section.id
        });
      }
    }
  }
  
  // 將文章資訊轉換為 JSON 字串，處理特殊字符，確保在前端可以正確解析
  // 注意：對於標題和描述中的引號，我們先確保它們在 JSON.stringify 前就被正確處理
  allPosts.forEach(post => {
    post.title = post.title.replace(/"/g, '\\"');
    post.description = post.description.replace(/"/g, '\\"');
  });
  
  return JSON.stringify(allPosts);
});

// 註冊獲取所有n8n文章的助手函數
hexo.extend.helper.register('get_all_n8n_posts', function() {
  const posts = this.site.posts.data;
  
  // 過濾出n8n相關的文章
  return posts.filter(post => {
    // 檢查文章是否包含 n8n 標籤
    if (post.tags && post.tags.data) {
      for (const tag of post.tags.data) {
        if (tag.name === 'n8n') {
          return true;
        }
      }
    }
    
    // 或者檢查是否在 n8n 分類下
    if (post.categories && post.categories.data) {
      for (const cat of post.categories.data) {
        if (cat.name === 'n8n') {
          return true;
        }
      }
    }
    
    return false;
  }).sort((a, b) => b.date - a.date); // 按日期倒序排列
});

// 獲取n8n文章的封面圖片
hexo.extend.helper.register('get_n8n_post_thumbnail', function(post) {
  // 優先使用文章指定的縮圖
  if (post.thumbnail) {
    return post.thumbnail;
  }
  
  // 其次使用文章的背景圖片
  if (post.bgImage) {
    return `/gallery/${post.bgImage}`;
  }
  
  // 最後使用默認圖片
  return '/gallery/n8n-default-thumbnail.jpg';
});

// 獲取n8n文章的描述
hexo.extend.helper.register('get_n8n_post_description', function(post) {
  // 優先使用文章的描述
  if (post.description) {
    return post.description;
  }
  
  // 其次截取文章內容
  if (post.content) {
    // 移除HTML標籤
    const plainText = post.content.replace(/<[^>]+>/g, '');
    // 截取前100個字符
    return plainText.substring(0, 100) + '...';
  }
  
  // 最後使用默認描述
  return 'n8n 相關文章';
});

// 獲取最新的n8n文章並生成HTML列表
hexo.extend.helper.register('latest_n8n_articles', function(limit = 6) {
  const posts = this.site.posts.data;
  
  // 過濾出n8n相關的文章
  const n8nPosts = posts.filter(post => {
    // 檢查文章是否包含 n8n 標籤
    if (post.tags && post.tags.data) {
      for (const tag of post.tags.data) {
        if (tag.name === 'n8n') {
          return true;
        }
      }
    }
    
    // 或者檢查是否在 n8n 分類下
    if (post.categories && post.categories.data) {
      for (const cat of post.categories.data) {
        if (cat.name === 'n8n') {
          return true;
        }
      }
    }
    
    return false;
  }).sort((a, b) => b.date - a.date).slice(0, limit); // 按日期倒序排列並限制數量
  
  // 生成HTML輸出
  let html = '<div class="latest-n8n-articles">';
  
  for (const post of n8nPosts) {
    html += '<div class="article-item">';
    
    // 文章封面
    if (post.thumbnail) {
      html += `<img src="${post.thumbnail}" alt="${post.title}">`;
    } else if (post.bgImage) {
      html += `<img src="/gallery/${post.bgImage}" alt="${post.title}">`;
    } else {
      html += `<img src="/gallery/n8n-default-thumbnail.jpg" alt="${post.title}">`;
    }
    
    // 文章信息
    html += '<div class="article-info">';
    html += `<h3><a href="${this.url_for(post.path)}">${post.title}</a></h3>`;
    
    // 文章描述
    html += '<p>';
    if (post.description) {
      html += post.description;
    } else if (post.excerpt) {
      html += post.excerpt;
    } else {
      html += '查看文章了解更多...';
    }
    html += '</p>';
    
    // 發布日期
    html += '<div class="article-meta">';
    html += `<span>發布於 ${this.date(post.date, 'YYYY-MM-DD')}</span>`;
    html += '</div>';
    
    html += '</div>'; // 結束 article-info
    html += '</div>'; // 結束 article-item
  }
  
  html += '</div>'; // 結束 latest-n8n-articles
  
  return html;
});

// 根據分類顯示n8n文章列表
hexo.extend.helper.register('n8n_category_articles', function(category, limit = 6) {
  const posts = this.get_n8n_posts_by_category(category).slice(0, limit);
  
  // 生成HTML輸出
  let html = '<div class="n8n-articles">';
  
  for (const post of posts) {
    html += '<div class="n8n-article-card">';
    
    // 文章封面
    html += `<img src="${this.get_n8n_post_thumbnail(post)}" alt="${post.title}">`;
    
    // 文章信息
    html += '<div class="n8n-article-info">';
    html += `<h3><a href="${this.url_for(post.path)}">${post.title}</a></h3>`;
    
    // 文章描述
    html += `<p>${this.get_n8n_post_description(post)}</p>`;
    
    // 發布日期
    html += '<div class="n8n-article-meta">';
    html += `<span>發布於 ${this.date(post.date, 'YYYY-MM-DD')}</span>`;
    html += '</div>';
    
    html += '</div>'; // 結束 n8n-article-info
    html += '</div>'; // 結束 n8n-article-card
  }
  
  html += '</div>'; // 結束 n8n-articles
  
  return html;
});

// ========================================
// Schema.org 結構化資料生成 Helper 函數
// ========================================

// 生成主要 CollectionPage 結構化資料
hexo.extend.helper.register('generate_n8n_collection_schema', function() {
  const allPosts = this.get_all_n8n_posts();
  
  // 生成文章項目列表
  const itemListElements = allPosts.map((post, index) => {
    return {
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "name": post.title,
        "url": `${this.config.url}${this.url_for(post.path)}`,
        "headline": post.title,
        "description": this.get_n8n_post_description(post),
        "image": `${this.config.url}${this.get_n8n_post_thumbnail(post)}`,
        "author": {
          "@type": "Person",
          "name": "Darrell TW",
          "url": "https://www.darrelltw.com/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Darrell TW",
          "logo": {
            "@type": "ImageObject",
            "url": `${this.config.url}${this.url_for('/gallery/n8n_resource_og.jpg')}`
          }
        },
        "datePublished": post.date.format('YYYY-MM-DD'),
        "dateModified": (post.updated || post.date).format('YYYY-MM-DD')
      }
    };
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${this.config.url}/n8n-tutorial-resources/`,
    "name": "n8n 教學：節點教學、模板分享、部署指南",
    "description": "n8n自動化教學，包含節點、實用模板、部署。適合初學者到進階用戶，快速上手自動化。",
    "url": `${this.config.url}/n8n-tutorial-resources/`,
    "inLanguage": "zh-TW",
    "isAccessibleForFree": true,
    "lastReviewed": this.date(new Date(), 'YYYY-MM-DD'),
    "publisher": {
      "@type": "Organization",
      "name": "Darrell TW",
      "url": this.config.url,
      "logo": {
        "@type": "ImageObject",
        "url": `${this.config.url}${this.url_for('/gallery/n8n_resource_og.jpg')}`,
        "width": 1200,
        "height": 630
      },
      "sameAs": [
        "https://www.threads.net/@darrell_tw_",
        "https://www.instagram.com/darrell_tw_/",
        "https://www.linkedin.com/in/darrell-wang-tw/"
      ]
    },
    "author": {
      "@type": "Person",
      "name": "Darrell TW",
      "url": "https://www.darrelltw.com/",
      "sameAs": [
        "https://www.threads.net/@darrell_tw_",
        "https://www.instagram.com/darrell_tw_/"
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "n8n 教學文章清單",
      "numberOfItems": allPosts.length,
      "itemListElement": itemListElements
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首頁",
          "item": {
            "@type": "WebPage",
            "@id": this.config.url
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "n8n 教學",
          "item": {
            "@type": "CollectionPage",
            "@id": `${this.config.url}/n8n-tutorial-resources/`
          }
        }
      ]
    },
    "keywords": "n8n教學, n8n節點, 工作流程自動化, n8n模板下載, n8n部署, 自動化工具, n8n中文教學"
  };

  return JSON.stringify(schema, null, 2);
});

// 生成網站結構化資料
hexo.extend.helper.register('generate_website_schema', function() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${this.config.url}/#website`,
    "url": this.config.url,
    "name": "Darrell TW - MarTech 自動化專家",
    "description": "專業 MarTech 自動化解決方案，n8n 教學專家",
    "publisher": {
      "@type": "Organization",
      "name": "Darrell TW"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${this.config.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return JSON.stringify(schema, null, 2);
});

// 生成外部教學資源結構化資料
hexo.extend.helper.register('generate_external_tutorials_schema', function() {
  // 定義外部教學資源
  const externalTutorials = [
    {
      title: "【一鍵安裝 n8n】圖文教學，獲得無限額度自動化工具＆限時免費升級企業版功能",
      link: "https://raymondhouch.com/lifehacker/digital-workflow/n8n-deploy-guide/",
      image: "https://raymondhouch.com/wp-content/uploads/2024/11/n8n-zeabur-deploy.compressed.jpg",
      author: "侯智薰（雷蒙）",
      authorLink: "https://www.threads.net/@raymond0917",
      description: "完整中文圖文步驟式教學，如何一鍵用 Zeabur 自行部署安裝 n8n",
      type: "Article"
    },
    {
      title: "【n8n 教學】如何串接 Google 自動化服務？API、Credentials 憑證設定步驟圖文教學",
      link: "https://raymondhouch.com/lifehacker/digital-workflow/n8n-google-credentials-guide/",
      image: "https://raymondhouch.com/wp-content/uploads/2025/01/n8n-google-credentials-guide_compressed.jpg",
      author: "侯智薰（雷蒙）",
      authorLink: "https://www.threads.net/@raymond0917",
      description: "想整合 Google 服務到 n8n 自動化工作流程？本篇教學帶你逐步了解 Google API 憑證申請流程",
      type: "Article"
    },
    {
      title: "「超詳細教學」n8n AI 實作0基礎入門到進階",
      link: "https://www.youtube.com/watch?v=vvqhzbp4J5A",
      image: `${this.config.url}/gallery/n8n_resource_vvqhzbp4J5A.webp`,
      author: "HC AI說人話",
      authorLink: "https://www.threads.com/@hc_aichannel",
      description: "長達三小時的 n8n 教學，從 0 到 1",
      type: "VideoObject"
    },
    {
      title: "AI免費自動排版, 免API, 解鎖自訂中文字體 = AI 平面神技?",
      link: "https://www.youtube.com/watch?v=ncYmf5YHLks",
      image: `${this.config.url}/gallery/n8n_resource_ncYmf5YHLks.webp`,
      author: "HC AI說人話",
      authorLink: "https://www.threads.com/@hc_aichannel",
      description: "AI自動設計海報，免費免API調用",
      type: "VideoObject"
    },
    {
      title: "【n8n 教學】郵件自動化：設定 Gmail 自動分類與回覆",
      link: "https://www.youtube.com/watch?v=MKs36wpJn0Y",
      image: `${this.config.url}/gallery/n8n_resource_MKs36wpJn0Y.webp`,
      author: "HC AI說人話",
      authorLink: "https://www.threads.com/@hc_aichannel",
      description: "利用 n8n 建立智能郵件處理系統",
      type: "VideoObject"
    }
  ];

  const itemListElements = externalTutorials.map((tutorial, index) => {
    return {
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": tutorial.type,
        "name": tutorial.title,
        "url": tutorial.link,
        "image": tutorial.image,
        "author": {
          "@type": "Person",
          "name": tutorial.author
        },
        "description": tutorial.description,
        ...(tutorial.type === "VideoObject" ? { "thumbnailUrl": tutorial.image } : {})
      }
    };
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "外部 n8n 教學資源",
    "description": "優質的外部 n8n 教學文章和影片資源",
    "numberOfItems": externalTutorials.length,
    "itemListElement": itemListElements
  };

  return JSON.stringify(schema, null, 2);
});

// 生成完整的結構化資料 HTML 標籤
hexo.extend.helper.register('generate_n8n_schemas_html', function() {
  let html = '';
  
  // 主要頁面結構化資料
  html += '<script type="application/ld+json">\n';
  html += this.generate_n8n_collection_schema();
  html += '\n</script>\n\n';
  
  // 網站結構化資料
  html += '<script type="application/ld+json">\n';
  html += this.generate_website_schema();
  html += '\n</script>\n\n';
  
  // 外部教學資源結構化資料
  html += '<script type="application/ld+json">\n';
  html += this.generate_external_tutorials_schema();
  html += '\n</script>';
  
  return html;
}); 