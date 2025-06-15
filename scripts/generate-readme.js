const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const dayjs = require('dayjs');
const yaml = require('js-yaml');
require('dayjs/locale/zh-tw');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

// 設定時區和語言
dayjs.locale('zh-tw');

const POSTS_DIR = path.join(__dirname, '../source/_posts');
const README_PATH = path.join(__dirname, '../README.md');
const ANALYTICS_PATH = path.join(__dirname, '../data/analytics.json');
const CONFIG_PATH = path.join(__dirname, '../main.yml');

// 讀取分析數據
function getAnalyticsData() {
  try {
    if (!fs.existsSync(ANALYTICS_PATH)) {
      console.warn('⚠️  分析數據檔案不存在，使用空數據');
      return createEmptyAnalyticsData();
    }
    
    const analyticsContent = fs.readFileSync(ANALYTICS_PATH, 'utf8');
    const data = JSON.parse(analyticsContent);
    
    // 驗證數據結構
    if (!data.data || !Array.isArray(data.data)) {
      console.warn('⚠️  分析數據格式不正確，使用空數據');
      return createEmptyAnalyticsData();
    }
    
    console.log(`✅ 成功讀取分析數據，包含 ${data.data.length} 筆記錄`);
    return data;
  } catch (error) {
    console.warn('⚠️  無法讀取分析數據：', error.message);
    return createEmptyAnalyticsData();
  }
}

function createEmptyAnalyticsData() {
  return { 
    data: [], 
    data_30days: [],
    data_7days: [],
    last_updated: new Date().toISOString() 
  };
}

// 讀取部落格配置
function getBlogConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      console.warn('⚠️  配置檔案不存在，使用預設配置');
      return getDefaultConfig();
    }
    
    const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config = yaml.load(configContent);
    
    if (!config.title || !config.url) {
      console.warn('⚠️  配置檔案缺少必要欄位，使用預設配置');
      return getDefaultConfig();
    }
    
    console.log(`✅ 成功讀取部落格配置：${config.title}`);
    return config;
  } catch (error) {
    console.warn('⚠️  無法讀取配置檔案：', error.message);
    return getDefaultConfig();
  }
}

function getDefaultConfig() {
  return {
    title: 'Darrell TW',
    url: 'https://www.darrelltw.com'
  };
}

// 移除 URL 中重複的斜線並確保最後有斜線，同時加入 UTM 參數
function normalizeUrl(url, addUtm = true) {
  try {
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
  } catch (error) {
    console.warn(`⚠️  URL 正規化失敗：${url}`, error.message);
    return url;
  }
}

function parseMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content.replace(/\t/g, '  ')); // 將 tab 轉換為空格
    
    return {
      title: data.title || path.basename(filePath, '.md'),
      date: data.date || new Date(),
      description: data.description || '',
      categories: Array.isArray(data.categories) ? data.categories : 
                 (data.categories ? [data.categories] : []),
      tags: Array.isArray(data.tags) ? data.tags : 
            (data.tags ? [data.tags] : [])
    };
  } catch (error) {
    console.warn(`⚠️  解析 ${path.basename(filePath)} 失敗：`, error.message);
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
    // 移除 HTML 標籤和 Markdown 語法
    const textContent = postContent
      .replace(/<[^>]*>/g, '') // 移除 HTML 標籤
      .replace(/!\[.*?\]\(.*?\)/g, '') // 移除圖片
      .replace(/\[.*?\]\(.*?\)/g, '') // 移除連結
      .replace(/```[\s\S]*?```/g, '') // 移除程式碼區塊
      .replace(/`.*?`/g, '') // 移除行內程式碼
      .replace(/#{1,6}\s/g, '') // 移除標題符號
      .replace(/[*_]{1,2}(.*?)[*_]{1,2}/g, '$1'); // 移除粗體斜體
    
    // 計算中文字和英文字
    const chineseCount = (textContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishCount = (textContent.match(/[a-zA-Z]+/g) || []).join('').length;
    return chineseCount + englishCount;
  } catch (error) {
    console.warn(`⚠️  無法計算 ${path.basename(filePath)} 的字數：`, error.message);
    return 0;
  }
}

function generatePopularPostsChart(posts, title) {
  if (!posts || posts.length === 0) {
    return `## ${title}\n\`\`\`text\n暫無數據\n\`\`\`\n`;
  }

  const ranks = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  const maxPercentage = Math.max(...posts.map(p => p.percentage || 0), 1);
  const maxBarWidth = 30;

  const chart = posts.slice(0, 5).map((post, index) => {
    const barLength = Math.floor(((post.percentage || 0) / maxPercentage) * maxBarWidth);
    const bar = '█'.repeat(barLength).padEnd(maxBarWidth, '░');
    const postTitle = post['customEvent:post_title'] || post.title || '無標題';
    return `${bar} ${ranks[index]} ${postTitle}`;
  }).join('\n');

  return `## ${title}\n\`\`\`text\n${chart}\n\`\`\`\n`;
}

function generateUpdateFrequencyChart(posts) {
  const now = new Date();
  
  // 生成過去6個月的月份，確保不重複
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6Months.push(d);
  }
  
  const monthPosts = last6Months.map(month => {
    const count = posts.filter(post => {
      const postDate = new Date(post.date);
      return postDate.getMonth() === month.getMonth() &&
             postDate.getFullYear() === month.getFullYear();
    }).length;
    
    return {
      month: dayjs(month).format('MM月'),
      year: month.getFullYear(),
      count,
      bar: '█'.repeat(Math.min(count, 10))
    };
  });

  const chart = monthPosts.map(({month, count, bar}) => 
    `${month} ${bar.padEnd(10, '░')} ${count}篇`
  ).join('\n');

  return `## 📈 更新頻率\n\`\`\`text\n${chart}\n\`\`\`\n`;
}

async function generateReadme() {
  console.log('🚀 開始生成 README...');
  
  try {
    // 檢查必要目錄
    if (!fs.existsSync(POSTS_DIR)) {
      throw new Error(`文章目錄不存在：${POSTS_DIR}`);
    }

    const blogConfig = getBlogConfig();
    const analyticsData = getAnalyticsData();

    // 讀取所有 .md 文件
    console.log('📖 讀取文章檔案...');
    const postFiles = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
    console.log(`📚 找到 ${postFiles.length} 篇文章`);

    const posts = postFiles.map(file => {
      const filePath = path.join(POSTS_DIR, file);
      const postData = parseMarkdownFile(filePath);
      const url = normalizeUrl(`${blogConfig.url}/${file.replace('.md', '')}`);
      const wordCount = countWords(filePath);
      return {
        ...postData,
        url,
        wordCount,
        filename: file
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    // 計算統計資料
    const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0);
    console.log(`📊 總字數：${totalWords.toLocaleString()}`);

    // 生成分類統計
    const categories = {};
    posts.forEach(post => {
      post.categories.forEach(cat => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
    });

    // 生成 README 內容
    console.log('✍️  生成 README 內容...');
    const readmeContent = `# ${blogConfig.title}

## 📚 最新文章
${posts.slice(0, 10).map(post => {
  const readingTime = Math.max(1, Math.ceil(post.wordCount / 500));
  
  return `
### [${post.title}](${post.url})
📅 ${dayjs(post.date).format('YYYY/MM/DD')} · ${dayjs(post.date).fromNow()}

${post.description ? `> ${post.description}` : ''}
`}).join('\n')}

## 📊 部落格統計
![文章總數](https://img.shields.io/badge/文章總數-${posts.length}-blue?style=flat-square)
![總字數](https://img.shields.io/badge/總字數-${totalWords.toLocaleString()}+-blue?style=flat-square)
![最後更新](https://img.shields.io/badge/最後更新-${dayjs().format('YYYY/MM/DD')}-green?style=flat-square)

${generatePopularPostsChart(analyticsData.data_30days || analyticsData.data, '📈 近期 30 天熱門文章')}

${generatePopularPostsChart(analyticsData.data_7days || analyticsData.data, '📈 近期 7 天熱門文章')}

## 🏷️ 熱門主題
${Object.entries(categories)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([cat, count]) => `![${cat}](https://img.shields.io/badge/${encodeURIComponent(cat)}-${count}-orange?style=flat-square)`)
  .join(' ')}

${generateUpdateFrequencyChart(posts)}

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

---
*此 README 由 [GitHub Actions](https://github.com/${process.env.GITHUB_REPOSITORY || 'user/repo'}/actions) 自動生成，最後更新：${dayjs().format('YYYY-MM-DD HH:mm:ss')}*
`;

    // 寫入 README 文件
    console.log('💾 寫入 README 檔案...');
    fs.writeFileSync(README_PATH, readmeContent);
    
    console.log('✅ README 更新成功！');
    console.log(`📈 統計資訊：`);
    console.log(`   - 文章總數：${posts.length}`);
    console.log(`   - 總字數：${totalWords.toLocaleString()}`);
    console.log(`   - 分類數量：${Object.keys(categories).length}`);
    console.log(`   - 最新文章：${posts[0]?.title || '無'}`);
    
  } catch (error) {
    console.error('❌ README 生成失敗：', error.message);
    console.error('🔍 錯誤詳情：', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'),
      name: error.name
    });
    
    // 環境診斷
    console.error('🔧 環境診斷：');
    console.error(`   - Posts 目錄存在：${fs.existsSync(POSTS_DIR)}`);
    console.error(`   - README 目錄可寫：${fs.existsSync(path.dirname(README_PATH))}`);
    console.error(`   - 配置檔案存在：${fs.existsSync(CONFIG_PATH)}`);
    console.error(`   - 分析檔案存在：${fs.existsSync(ANALYTICS_PATH)}`);
    
    process.exit(1);
  }
}

if (require.main === module) {
  generateReadme().catch(err => {
    console.error('💥 頂層錯誤：', err);
    process.exit(1);
  });
}

module.exports = generateReadme; 