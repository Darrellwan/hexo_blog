const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const dayjs = require('dayjs');
const yaml = require('js-yaml');
require('dayjs/locale/zh-tw');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime); // 添加相對時間插件

// 設定時區和語言
dayjs.locale('zh-tw');

const POSTS_DIR = path.join(__dirname, '../source/_posts');
const README_PATH = path.join(__dirname, '../README.md');
const ANALYTICS_PATH = path.join(__dirname, '../data/analytics.json');

// 讀取分析數據
function getAnalyticsData() {
  try {
    const analyticsContent = fs.readFileSync(ANALYTICS_PATH, 'utf8');
    return JSON.parse(analyticsContent);
  } catch (error) {
    console.warn('無法讀取分析數據，使用空數據');
    return { 
      data: [], 
      data_30days: [],
      data_7days: [],
      last_updated: new Date().toISOString() 
    };
  }
}

// 讀取部落格配置
function getBlogConfig() {
  try {
    const configPath = path.join(__dirname, '../main.yml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    return yaml.load(configContent);
  } catch (error) {
    console.error('無法讀取 main.yml，使用預設配置');
    return {
      title: 'My Blog',
      url: 'https://example.com'
    };
  }
}

// 移除 URL 中重複的斜線並確保最後有斜線，同時加入 UTM 參數
function normalizeUrl(url, addUtm = true) {
  // 先移除重複的斜線
  const cleanUrl = url.replace(/([^:]\/)\/+/g, '$1');
  // 確保最後有斜線
  const urlWithSlash = cleanUrl.endsWith('/') ? cleanUrl : `${cleanUrl}/`;
  
  // 如果不需要加入 UTM，直接返回
  if (!addUtm) return urlWithSlash;
  
  // 加入 UTM 參數
  const utmParams = new URLSearchParams({
    'utm_source': 'github_readme',
    'utm_medium': 'referral'
  });
  
  return `${urlWithSlash}?${utmParams.toString()}`;
}

const blogConfig = getBlogConfig();
const analyticsData = getAnalyticsData();

function parseMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content.replace(/\t/g, '  ')); // 將 tab 轉換為空格
    return {
      title: data.title || '',
      date: data.date || new Date(),
      description: data.description || '',
      categories: Array.isArray(data.categories) ? data.categories : 
                 (data.categories ? [data.categories] : []),
      tags: Array.isArray(data.tags) ? data.tags : 
            (data.tags ? [data.tags] : [])
    };
  } catch (error) {
    console.warn(`警告：解析 ${filePath} 失敗`, error);
    return {
      title: path.basename(filePath, '.md'),
      date: new Date(),
      description: '',
      categories: [],
      tags: []
    };
  }
}

function countWords(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // 移除 frontmatter
    const postContent = content.replace(/^---[\s\S]*?---/, '');
    // 移除 HTML 標籤
    const textContent = postContent.replace(/<[^>]*>/g, '');
    // 計算中文字和英文字
    const chineseCount = (textContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishCount = (textContent.match(/[a-zA-Z]+/g) || []).join('').length;
    return chineseCount + englishCount;
  } catch (error) {
    console.warn(`警告：無法計算 ${filePath} 的字數`, error);
    return 0;
  }
}

async function generateReadme() {
  try {
    // 讀取所有 .md 文件
    const posts = fs.readdirSync(POSTS_DIR)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(POSTS_DIR, file);
        const postData = parseMarkdownFile(filePath);
        const url = normalizeUrl(`${blogConfig.url}/${file.replace('.md', '')}`);
        const wordCount = countWords(filePath);
        return {
          ...postData,
          url,
          wordCount
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // 計算總字數
    const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0);

    // 生成分類統計
    const categories = {};
    posts.forEach(post => {
      post.categories.forEach(cat => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
    });

    // 生成 README 內容
    const readmeContent = `# ${blogConfig.title}

## 📚 最新文章
${posts.slice(0, 10).map(post => {
  // 估算閱讀時間：假設平均閱讀速度每分鐘 500 個字
  const readingTime = Math.max(1, Math.ceil(post.wordCount / 500));
  
  return `
### [${post.title}](${post.url})
📅 ${dayjs(post.date).format('YYYY/MM/DD')} · ${dayjs(post.date).fromNow()}

${post.description ? `> ${post.description}` : ''}
`}).join('\n')}

## 📊 部落格統計
![文章總數](https://img.shields.io/badge/文章總數-${posts.length}-blue?style=flat-square)
![總字數](https://img.shields.io/badge/總字數-${totalWords}+-blue?style=flat-square)

## 📈 近期 30 天熱門文章
\`\`\`text
${(() => {
  // 使用 30 天分析數據
  const popularPosts = analyticsData.data_30days?.slice(0, 5) || analyticsData.data.slice(0, 5);
  const ranks = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  
  // 找出最大百分比作為基準
  const maxPercentage = Math.max(...popularPosts.map(p => p.percentage || 0), 1);
  const maxBarWidth = 30;

  return popularPosts.map((post, index) => {
    const barLength = Math.floor(((post.percentage || 0) / maxPercentage) * maxBarWidth);
    const bar = '█'.repeat(barLength).padEnd(maxBarWidth, '░');
    return `${bar} ${ranks[index]} ${post['customEvent:post_title'] || post.title || '無標題'}`;
  }).join('\n');
})()}
\`\`\`

## 📈 近期 7 天熱門文章
\`\`\`text
${(() => {
  // 使用 7 天分析數據
  const popularPosts = analyticsData.data_7days?.slice(0, 5) || analyticsData.data.slice(0, 5);
  const ranks = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  
  // 找出最大百分比作為基準
  const maxPercentage = Math.max(...popularPosts.map(p => p.percentage || 0), 1);
  const maxBarWidth = 30;

  return popularPosts.map((post, index) => {
    const barLength = Math.floor(((post.percentage || 0) / maxPercentage) * maxBarWidth);
    const bar = '█'.repeat(barLength).padEnd(maxBarWidth, '░');
    return `${bar} ${ranks[index]} ${post['customEvent:post_title'] || post.title || '無標題'}`;
  }).join('\n');
})()}
\`\`\`

## 🏷️ 熱門主題
${Object.entries(categories)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([cat, count]) => `![${cat}](https://img.shields.io/badge/${encodeURIComponent(cat)}-${count}-orange?style=flat-square)`)
  .join(' ')}

## 📈 更新頻率
\`\`\`text
${(() => {
  const now = new Date();
  const last6Months = Array.from({length: 6}, (_, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    return d;
  }).reverse();
  
  const monthPosts = last6Months.map(month => {
    const count = posts.filter(post => 
      new Date(post.date).getMonth() === month.getMonth() &&
      new Date(post.date).getFullYear() === month.getFullYear()
    ).length;
    return {
      month: dayjs(month).format('MM月'),
      count,
      bar: '█'.repeat(Math.min(count, 10))
    };
  });

  return monthPosts.map(({month, count, bar}) => 
    `${month} ${bar.padEnd(10, '░')} ${count}篇`
  ).join('\n');
})()}
\`\`\`

## 🔍 更多資訊
- [所有文章列表](${normalizeUrl(`${blogConfig.url}/archives/`, false)})
- [分類列表](${normalizeUrl(`${blogConfig.url}/categories/`, false)})
- [標籤列表](${normalizeUrl(`${blogConfig.url}/tags/`, false)})

<div align="center">
  <a href="https://twitter.com/DarrellMarTech" target="_blank">
    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter">
  </a>
  <a href="https://www.instagram.com/darrell_tw_/" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram">
  </a>
  <a href="https://www.threads.net/@darrell_tw_" target="_blank">
    <img src="https://img.shields.io/badge/Threads-000000?style=for-the-badge&logo=threads&logoColor=white" alt="Threads">
  </a>
</div>
`;

    // 寫入 README 文件
    fs.writeFileSync(README_PATH, readmeContent);
    console.log('✅ README 更新成功！');
  } catch (error) {
    console.error('❌ README 生成失敗：', error);
    // 輸出更詳細的錯誤信息
    console.error('錯誤詳情：', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // 嘗試檢查關鍵文件和變量
    try {
      console.error('檢查環境：');
      console.error('- posts 目錄是否存在:', fs.existsSync(POSTS_DIR));
      console.error('- README 文件是否可寫:', fs.existsSync(path.dirname(README_PATH)));
      console.error('- 分析數據內容:', JSON.stringify(analyticsData).slice(0, 200) + '...');
      
      // 輸出處理的文章數量
      if (typeof posts !== 'undefined') {
        console.error('- 成功處理的文章數量:', posts.length);
      } else {
        console.error('- posts 變量未定義');
      }
    } catch (diagError) {
      console.error('診斷過程中出現錯誤:', diagError);
    }
    
    process.exit(1);
  }
}

// 執行函數
generateReadme().catch(err => {
  console.error('頂層錯誤:', err);
  process.exit(1);
});

// 導出函數以便其他文件可以引用但不自動執行
module.exports = generateReadme; 