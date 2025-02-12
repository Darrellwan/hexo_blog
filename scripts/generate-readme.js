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

// 讀取部落格配置
function getBlogConfig() {
  try {
    const configPath = path.join(__dirname, '../_config.yml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    return yaml.load(configContent);
  } catch (error) {
    console.error('無法讀取 _config.yml，使用預設配置');
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

async function generateReadme() {
  try {
    // 讀取所有 .md 文件
    const posts = fs.readdirSync(POSTS_DIR)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(POSTS_DIR, file);
        const postData = parseMarkdownFile(filePath);
        const url = normalizeUrl(`${blogConfig.url}/${file.replace('.md', '')}`);
        return {
          ...postData,
          url
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // 生成分類統計
    const categories = {};
    posts.forEach(post => {
      post.categories.forEach(cat => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
    });

    // 生成 README 內容
    const readmeContent = `# ${blogConfig.title}

## 🌟 部落格資訊
- 網站: [${blogConfig.title}](${normalizeUrl(blogConfig.url, false)})
- 文章總數: ${posts.length}
- 最後更新: ${dayjs().format('YYYY/MM/DD HH:mm:ss')}

## 📚 最新文章
${posts.slice(0, 10).map(post => `
### ${post.title}
${post.description ? `> ${post.description}\n` : ''}
- 發布時間: ${dayjs(post.date).format('YYYY/MM/DD')}
- 分類: ${post.categories.length > 0 ? post.categories.join(', ') : '未分類'}
- 標籤: ${post.tags.length > 0 ? post.tags.join(', ') : '無'}
- [閱讀全文](${post.url})
`).join('\n')}

## 📊 分類統計
${Object.entries(categories)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, count]) => `- ${cat}: ${count} 篇文章`)
  .join('\n')}

## 🔍 更多資訊
- [所有文章列表](${normalizeUrl(`${blogConfig.url}/archives/`, false)})
- [分類列表](${normalizeUrl(`${blogConfig.url}/categories/`, false)})
- [標籤列表](${normalizeUrl(`${blogConfig.url}/tags/`, false)})

---
*此 README 由 GitHub Action 自動生成於 ${dayjs().format('YYYY/MM/DD HH:mm:ss')}*
`;

    // 寫入 README 文件
    fs.writeFileSync(README_PATH, readmeContent);
    console.log('✅ README 更新成功！');
  } catch (error) {
    console.error('❌ README 生成失敗：', error);
    process.exit(1);
  }
}

generateReadme(); 