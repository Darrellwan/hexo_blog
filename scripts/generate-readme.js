const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const dayjs = require('dayjs');
const yaml = require('js-yaml');
require('dayjs/locale/zh-tw');

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
    return { data: [], last_updated: new Date().toISOString() };
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
${posts.slice(0, 10).map(post => `
### [${post.title}](${post.url})
- 發布時間: ${dayjs(post.date).format('YYYY/MM/DD')}
${post.description ? `> ${post.description}` : ''}
`).join('\n')}

## 📊 部落格統計
![文章總數](https://img.shields.io/badge/文章總數-${posts.length}-blue?style=flat-square)
![總字數](https://img.shields.io/badge/總字數-${totalWords}+-blue?style=flat-square)
![已發布天數](https://img.shields.io/badge/已發布天數-${Math.floor((new Date() - new Date(Math.min(...posts.map(p => new Date(p.date))))) / (1000 * 60 * 60 * 24))}-blue?style=flat-square)

## 📈 近期熱門文章
\`\`\`text
${(() => {
  // 使用分析數據
  const popularPosts = analyticsData.data.slice(0, 5);
  const ranks = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  
  // 找出最大百分比作為基準
  const maxPercentage = Math.max(...popularPosts.map(p => p.percentage));
  const maxBarWidth = 30;

  return popularPosts.map((post, index) => {
    const barLength = Math.floor((post.percentage / maxPercentage) * maxBarWidth);
    const bar = '█'.repeat(barLength).padEnd(maxBarWidth, '░');
    return `${bar} ${ranks[index]} ${post['customEvent:post_title']}`;
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
    process.exit(1);
  }
}

// 只有當直接運行此文件時才執行 generateReadme
if (require.main === module) {
  generateReadme();
}

// 導出函數以便其他文件可以引用但不自動執行
module.exports = generateReadme; 