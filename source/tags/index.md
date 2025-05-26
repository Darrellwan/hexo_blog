---
title: tags
date: 2022-08-07 17:32:58
type: "tags"
layout: "tags"
---

<style>
/* 標籤頁面樣式 */
.tags-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 搜尋框樣式 */
.tag-search-container {
  position: relative;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.tag-search {
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: all 0.2s ease;
  background: #fff;
}

.tag-search:focus {
  border-color: #555;
  box-shadow: 0 0 0 2px rgba(85, 85, 85, 0.1);
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 14px;
}

/* 分類標籤樣式 */
.tag-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  justify-content: center;
}

.category-btn {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  color: #555;
  font-weight: 400;
}

.category-btn:hover {
  border-color: #999;
  color: #333;
}

.category-btn.active {
  background: #333;
  color: white;
  border-color: #333;
}

/* 標籤統計 */
.tag-stats {
  text-align: center;
  margin-bottom: 24px;
  color: #666;
  font-size: 14px;
}

.tag-count {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 4px;
}

/* 標籤網格 */
.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

.tag-card {
  background: #f8f8f8;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 10px 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.tag-card:hover {
  background: #333;
  color: white;
  border-color: #333;
  transform: translateY(-1px);
}

.tag-card:hover .tag-name {
  color: white;
}

.tag-card:hover .tag-post-count {
  color: rgba(255, 255, 255, 0.8);
}

.tag-name {
  font-weight: 500;
  color: #333;
  transition: color 0.2s ease;
}

.tag-post-count {
  color: #999;
  font-size: 12px;
  transition: color 0.2s ease;
}

.post-count-number {
  font-weight: 500;
}

/* 無結果提示 */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.no-results-icon {
  font-size: 32px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.no-results h3 {
  font-size: 16px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.no-results p {
  font-size: 14px;
  color: #999;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .tag-search-container {
    max-width: 100%;
  }
  
  .tag-categories {
    gap: 6px;
  }
  
  .category-btn {
    font-size: 12px;
    padding: 5px 12px;
  }
  
  .tags-grid {
    gap: 8px;
  }
  
  .tag-card {
    font-size: 13px;
    padding: 8px 12px;
  }
}

/* 動畫效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tag-card {
  animation: fadeIn 0.3s ease forwards;
  opacity: 0;
}

.tag-card:nth-child(n) {
  animation-delay: calc(n * 0.02s);
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .tag-search {
    background: #2a2a2a;
    border-color: #444;
    color: #ddd;
  }
  
  .tag-search:focus {
    border-color: #666;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }
  
  .category-btn {
    background: #2a2a2a;
    border-color: #444;
    color: #ddd;
  }
  
  .category-btn:hover {
    border-color: #666;
    color: #fff;
  }
  
  .category-btn.active {
    background: #fff;
    color: #333;
    border-color: #fff;
  }
  
  .tag-card {
    background: #2a2a2a;
    border-color: #444;
  }
  
  .tag-card:hover {
    background: #fff;
    color: #333;
    border-color: #fff;
  }
  
  .tag-card:hover .tag-name {
    color: #333;
  }
  
  .tag-card:hover .tag-post-count {
    color: #666;
  }
  
  .tag-name {
    color: #ddd;
  }
  
  .tag-post-count {
    color: #999;
  }
}
</style>

<div class="tags-container">
  <!-- 搜尋框 -->
  <div class="tag-search-container">
    <input 
      type="text" 
      class="tag-search" 
      id="tagSearch" 
      placeholder="搜尋標籤..."
      autocomplete="off"
    >
    <i class="fas fa-search search-icon"></i>
  </div>

  <!-- 分類按鈕 -->
  <div class="tag-categories" id="tagCategories">
    <button class="category-btn active" data-category="all">全部</button>
    <button class="category-btn" data-category="tech">技術</button>
    <button class="category-btn" data-category="analytics">分析</button>
    <button class="category-btn" data-category="marketing">行銷</button>
    <button class="category-btn" data-category="tools">工具</button>
    <button class="category-btn" data-category="automation">自動化</button>
  </div>

  <!-- 標籤統計 -->
  <div class="tag-stats">
    共有 <span class="tag-count" id="visibleTagCount">0</span> 個標籤，
    <span class="tag-count" id="totalPostCount">0</span> 篇文章
  </div>

  <!-- 標籤網格 -->
  <div class="tags-grid" id="tagsGrid">
    <!-- 標籤卡片將通過 JavaScript 動態生成 -->
  </div>

  <!-- 無結果提示 -->
  <div class="no-results" id="noResults" style="display: none;">
    <div class="no-results-icon">
      <i class="fas fa-search"></i>
    </div>
    <h3>找不到符合的標籤</h3>
    <p>請嘗試其他關鍵字或分類</p>
  </div>
</div>

<script>
// 標籤分類映射
const tagCategories = {
  'Google Analytics 4': 'analytics',
  'GA4': 'analytics',
  'Google Tag Manager': 'analytics',
  'GTM': 'analytics',
  'Looker Studio': 'analytics',
  'DataLayer': 'analytics',
  'Measurement Skill': 'analytics',
  'GA4 New Release': 'analytics',
  'GA4 Update': 'analytics',
  'GA4 證照': 'analytics',
  'GTM Tutorial': 'analytics',
  'Google Analytics Data API': 'analytics',
  'Google Tag Manager 技巧': 'analytics',
  'Google Tag Manager 教學': 'analytics',
  
  'ChatGPT': 'tech',
  'Chatgpt': 'tech',
  'Claude': 'tech',
  'AI': 'tech',
  'AI Service': 'tech',
  'API': 'tech',
  'JavaScript': 'tech',
  'Development': 'tech',
  'Cloudflare': 'tech',
  'firebase': 'tech',
  'FCM': 'tech',
  'Sora': 'tech',
  'OpenAI': 'tech',
  
  'Martech': 'marketing',
  'Email Marketing': 'marketing',
  'Email DNS': 'marketing',
  'Facebook Pixel': 'marketing',
  'Line Tag': 'marketing',
  'Stack Overflow': 'marketing',
  'DPA': 'marketing',
  '社群問答': 'marketing',
  
  'n8n': 'automation',
  'Webhook': 'automation',
  '自動化': 'automation',
  'Integration': 'automation',
  'n8n Tips': 'automation',
  'n8n 介紹': 'automation',
  'n8n-debug': 'automation',
  'n8n模板': 'automation',
  'n8n節點介紹': 'automation',
  
  'Tools': 'tools',
  'Hexo': 'tools',
  'hexo': 'tools',
  'Cursor': 'tools',
  'Chrome Devtool': 'tools',
  'Visual Studio Code': 'tools',
  '開發工具': 'tools',
  '行銷工具': 'tools',
  'Algolia': 'tools',
  'BusyTag': 'tools',
  'Simmer': 'tools',
  'Gmail': 'tools',
  'Google Chrome': 'tools',
  'Google Sheet': 'tools',
  'Google App Script': 'tools',
  'MCP': 'tools',
  'LINE': 'tools',
  'Line': 'tools',
  
  // 其他
  '3rd party cookie': 'other',
  'API Integration': 'other',
  'Cache': 'other',
  'Issue': 'other',
  'Measurement Skill': 'other',
  'Push Notification': 'other',
  'User Onboarding': 'other',
  'browser': 'other',
  'deployment': 'other',
  'git-action': 'other',
  'theme': 'other',
  'update_log': 'other',
  '活動心得': 'other'
};

// 初始化標籤數據
let allTags = [];
let filteredTags = [];

// 從頁面獲取標籤數據
function extractTagsFromPage() {
  const tagLinks = document.querySelectorAll('.tag-cloud-tags a');
  const tags = [];
  
  tagLinks.forEach(link => {
    const tagName = link.textContent.trim();
    const href = link.getAttribute('href');
    const fontSize = parseInt(link.style.fontSize) || 14;
    // 根據字體大小估算文章數量
    const postCount = Math.max(1, Math.round((fontSize - 14) * 2 + 1));
    const category = tagCategories[tagName] || 'other';
    
    tags.push({
      name: tagName,
      href: href,
      postCount: postCount,
      category: category
    });
  });
  
  // 按文章數量排序
  return tags.sort((a, b) => b.postCount - a.postCount);
}

// 渲染標籤卡片
function renderTags(tags) {
  const grid = document.getElementById('tagsGrid');
  const noResults = document.getElementById('noResults');
  
  if (tags.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    document.getElementById('visibleTagCount').textContent = '0';
    return;
  }
  
  grid.style.display = 'flex';
  noResults.style.display = 'none';
  
  grid.innerHTML = tags.map((tag, index) => `
    <a href="${tag.href}" class="tag-card" style="animation-delay: ${index * 0.02}s">
      <span class="tag-name">${tag.name}</span>
      <span class="tag-post-count">(<span class="post-count-number">${tag.postCount}</span>)</span>
    </a>
  `).join('');
  
  // 更新統計
  document.getElementById('visibleTagCount').textContent = tags.length;
  const totalPosts = tags.reduce((sum, tag) => sum + tag.postCount, 0);
  document.getElementById('totalPostCount').textContent = totalPosts;
}

// 搜尋功能
function filterTags() {
  const searchTerm = document.getElementById('tagSearch').value.toLowerCase();
  const activeCategory = document.querySelector('.category-btn.active').dataset.category;
  
  filteredTags = allTags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm);
    const matchesCategory = activeCategory === 'all' || tag.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  renderTags(filteredTags);
}

// 分類按鈕事件
document.getElementById('tagCategories').addEventListener('click', (e) => {
  if (e.target.classList.contains('category-btn')) {
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
    filterTags();
  }
});

// 搜尋框事件
document.getElementById('tagSearch').addEventListener('input', filterTags);

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
  // 隱藏原始標籤雲
  const originalTagCloud = document.querySelector('.tag-cloud');
  if (originalTagCloud) {
    originalTagCloud.style.display = 'none';
  }
  
  // 提取並初始化標籤
  allTags = extractTagsFromPage();
  filteredTags = allTags;
  renderTags(allTags);
});
</script>
