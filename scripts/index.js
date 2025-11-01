'use strict';

// 擴展hexo的post_new邏輯，而不是重新註冊命令
// 在文章生成前添加n8n相關的默認設置
hexo.extend.filter.register('before_post_render', function(data) {
  // 確認是否為n8n相關文章
  const isN8nPost = data.layout === 'n8n-post' || 
      (Array.isArray(data.tags) && data.tags.indexOf('n8n') >= 0) ||
      (data.tags && data.tags.data && data.tags.data.some(tag => tag.name === 'n8n')) ||
      (Array.isArray(data.categories) && data.categories.indexOf('n8n') >= 0) ||
      (data.categories && data.categories.data && data.categories.data.some(cat => cat.name === 'n8n'));
  
  if (isN8nPost) {
    // 處理標籤
    if (!data.tags) {
      // 如果沒有標籤，直接設置為數組
      data.tags = ['n8n'];
    } else if (Array.isArray(data.tags)) {
      // 如果是數組，檢查並添加
      if (!data.tags.includes('n8n')) {
        data.tags.push('n8n');
      }
    } else if (typeof data.tags === 'string') {
      // 如果是字符串，轉為數組
      data.tags = [data.tags, 'n8n'];
    } else {
      // console.log('Skip adding n8n tag - tags is already a Hexo object');
    }
    
    // 處理分類
    if (!data.categories) {
      // 如果沒有分類，直接設置為數組
      data.categories = ['n8n'];
    } else if (Array.isArray(data.categories)) {
      // 如果是數組，檢查並添加
      if (!data.categories.includes('n8n')) {
        data.categories.push('n8n');
      }
    } else if (typeof data.categories === 'string') {
      // 如果是字符串，轉為數組
      data.categories = [data.categories, 'n8n'];
    } else {
      // console.log('Skip adding n8n category - categories is already a Hexo object');
    }
    
    // 根據標題自動判斷n8n_category
    if (!data.n8n_category) {
      const title = (data.title || '').toLowerCase();
      
      if (title.includes('webhook') || title.includes('節點') || title.includes('aggregate') || 
          title.includes('split out') || title.includes('if') || title.includes('switch') || 
          title.includes('內建參數')) {
        data.n8n_category = 'node-intro';
      }
      else if (title.includes('pin data') || title.includes('timezone') || title.includes('小撇步') || 
               title.includes('tips')) {
        data.n8n_category = 'tips';
      }
      else if (title.includes('模板') || title.includes('line') || title.includes('slack')) {
        data.n8n_category = 'templates';
      }
      else if (title.includes('功能更新') || title.includes('資料夾') || title.includes('folders') || 
               title.includes('版本更新')) {
        data.n8n_category = 'updates';
      }
      else if (title.includes('部署') || title.includes('設定') || title.includes('zeabur') || 
               title.includes('安裝')) {
        data.n8n_category = 'deployment';
      }
    }
  }
  
  return data;
}); 