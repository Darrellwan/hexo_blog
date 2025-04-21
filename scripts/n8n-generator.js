'use strict';

// 註冊一個新的命令 generate:n8n-post
hexo.extend.console.register('generate:n8n-post', '創建一個新的 n8n 相關文章', {
  arguments: [
    { name: 'title', desc: '文章標題，使用引號包裹以避免特殊字符問題' }
  ],
  options: [
    { name: '-c, --category', desc: 'n8n 文章分類 (node-intro, tips, templates, updates, deployment)' },
    { name: '-d, --date', desc: '文章日期，格式為 YYYY-MM-DD HH:mm:ss' },
    { name: '-s, --slug', desc: '文章的 slug' }
  ]
}, function(args) {
  // 獲取標題
  const title = args._.join(' ');
  if (!title) {
    console.error('錯誤: 必須提供文章標題');
    return;
  }

  // 獲取選項
  const category = args.c || args.category;
  const date = args.d || args.date;
  const slug = args.s || args.slug;
  
  // 準備參數
  const data = {
    title: title,
    layout: 'n8n-post',
    date: date,
    slug: slug
  };
  
  // 如果指定了分類，則添加
  if (category) {
    if (['node-intro', 'tips', 'templates', 'updates', 'deployment'].includes(category)) {
      data.n8n_category = category;
    } else {
      console.warn(`警告: 無效的分類 "${category}"，將使用自動偵測`);
    }
  }
  
  // 調用 hexo 的 post 創建功能
  hexo.post.create(data, function(err, path) {
    if (err) {
      console.error(err);
      return;
    }
    
    console.log(`成功創建文章: ${path}`);
    console.log(`您可以使用以下命令編輯文章:`);
    console.log(`$ hexo edit ${path}`);
  });
}); 