'use strict';

hexo.extend.helper.register('get_n8n_post_thumbnail', function(post) {
  // 優先使用 thumbnail 欄位
  if (post.thumbnail) {
    return post.thumbnail;
  } 
  
  // 使用 bgImage 欄位，根據規則：/{post.id}/{post.bgImage}
  if (post.bgImage && post.id) {
    return `/${post.id}/${post.bgImage}`;
  } else if (post.bgImage && post.slug) {
    // 如果沒有 id，嘗試使用 slug
    return `/${post.slug}/${post.bgImage}`;
  } else if (post.bgImage && post.path) {
    // 如果沒有 id 和 slug，從 path 中提取
    const pathParts = post.path.split('/');
    const postId = pathParts[pathParts.length - 2] || pathParts[0];
    return `/${postId}/${post.bgImage}`;
  } else if (post.bgImage) {
    // 如果只有 bgImage，使用舊的路徑
    return `/gallery/${post.bgImage}`;
  }
  
  // 檢查文章是否有特色圖片
  if (post.photos && post.photos.length > 0) {
    return post.photos[0];
  }
  
  // 如果都沒有，返回默認圖片
  return '/images/n8n-default-thumbnail.jpg';
});

hexo.extend.helper.register('get_n8n_post_description', function(post) {
  if (post.description) {
    return post.description;
  }
  
  if (post.excerpt) {
    return post.excerpt;
  }
  
  return '查看文章了解更多…';
});

// 判斷文章屬於哪個分類區塊
hexo.extend.helper.register('get_n8n_post_category_section', function(post) {
  // 如果沒有標籤或分類，返回 null
  if (!post.tags && !post.categories) {
    return null;
  }
  
  // 定義分類關鍵詞映射
  const categoryKeywords = {
    templates: ['模板', 'template', 'workflow', '範例', '工作流'],
    'node-intro': ['節點', 'node', 'if', 'switch', 'gmail', 's3', 'webhook', 'slack', 'perplexity', 'elevenlabs', 'aggregate', 'split', '節點介紹', '教學'],
    tips: ['撇步', '技巧', 'tip', 'tips', 'debug', 'n8n-debug', 'pin'],
    updates: ['更新', '新功能', 'update', 'feature', 'folders'],
    deployment: ['部署', '設定', 'deploy', 'config', 'setup', 'deployment', 'zeabur']
  };
  
  // 從標籤中檢查文章是否相關 n8n
  let tags = [];
  if (post.tags) {
    tags = post.tags.toArray().map(tag => tag.name.toLowerCase());
    
    // 如果沒有任何包含 n8n 的標籤，返回 null
    if (!tags.some(tag => tag.includes('n8n'))) {
      return null;
    }
    
    // 優先檢查 n8n-debug 標籤
    if (tags.some(tag => tag === 'n8n-debug')) {
      return 'tips';
    }
    
    // 檢查標籤是否符合某個分類
    const tagsText = tags.join(' ');
    
    // 依序檢查標籤是否符合各分類的關鍵詞
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      // 檢查每個關鍵詞
      for (const keyword of keywords) {
        // 檢查獨立標籤
        if (tags.some(tag => tag.includes(keyword))) {
          return category;
        }
        
        // 檢查標籤文字組合
        if (tagsText.includes(keyword)) {
          return category;
        }
      }
    }
  }
  
  // 從分類中檢查
  if (post.categories) {
    const categories = post.categories.toArray().map(cat => cat.name.toLowerCase());
    const categoryText = categories.join(' ');
    
    // 依序檢查分類是否符合各分類關鍵詞
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (categoryText.includes(keyword)) {
          return category;
        }
      }
    }
  }
  
  // 從標題檢查
  const title = post.title.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (title.includes(keyword)) {
        return category;
      }
    }
  }
  
  // 默認歸類為節點介紹
  return 'node-intro';
});

// 獲取特定分類的文章
hexo.extend.helper.register('get_n8n_posts_by_category', function(categoryName) {
  const self = this;
  
  const posts = this.site.posts.data.filter(post => {
    const category = self.get_n8n_post_category_section(post);
    return category === categoryName;
  });
  
  return posts.sort((a, b) => b.date - a.date);
});

// 格式化日期
hexo.extend.helper.register('format_n8n_date', function(date) {
  if (!date) return '';
  
  try {
    // 處理數字時間戳（毫秒）
    if (typeof date === 'number' || /^\d{13}$/.test(date)) {
      const dateObj = new Date(parseInt(date));
      return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    
    // 處理數字時間戳（秒）
    if (/^\d{10}$/.test(date)) {
      const dateObj = new Date(parseInt(date) * 1000);
      return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    
    // 如果是 Date 對象或可以轉換為 Date 的字符串
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    
    // 如果是字符串，嘗試直接提取日期部分
    if (typeof date === 'string') {
      // 嘗試提取 YYYY-MM-DD 格式
      const dateMatch = date.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) return dateMatch[1];
    }
  } catch (e) {
    console.error('日期格式化錯誤:', e);
  }
  
  // 如果都失敗了，返回今天的日期
  return new Date().toISOString().split('T')[0];
}); 