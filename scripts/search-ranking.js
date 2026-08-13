/**
 * Search Ranking Enhancer
 *
 * 取代 hexo-generator-searchdb 的 search.json 輸出（同一個 path，本 script 較晚註冊所以覆蓋它）。
 *
 * 原本的 search.json 有兩個問題：
 * 1. 順序是檔名字母序，而前端 local-search.js 排到最後是照這個順序，
 *    等於讓檔名決定排名（搜「n8n」時 n8n-datatables 永遠贏 n8n-time-saved）
 * 2. field: post 只收文章，主選單上的三個 n8n 入口頁完全搜不到
 *
 * 所以這裡改成：文章依日期新到舊排列、補上 weight 欄位、把入口頁加進索引。
 *
 * 為什麼是 generator 而不是 after_generate filter：
 * Hexo 是在 after_generate 之後才把 search.json 寫進 public/，
 * filter 在 clean build（Vercel 每次部署都是 fresh clone）時根本讀不到檔案。
 */

const fs = require('fs');
const path = require('path');
const { stripHTML } = require('hexo-util');

/**
 * 手動加進搜尋索引的入口頁。
 *
 * 這三頁都在主選單上（themes/next/_config.yml 的 menu），但都不是 Hexo post：
 * 模板頁在 skip_render 的 tools/** 底下，接案頁是沒有 front matter 的純 HTML。
 *
 * - title       搜尋結果顯示的標題，刻意不用網頁 <title>（那有「| Darrell TW」後綴）
 * - description 搜尋結果顯示的固定摘要。入口頁的說明不該隨搜尋字浮動，
 *               而且沒有它的話 keywords 會被當成摘要顯示出來，看起來像關鍵字堆砌
 * - keywords    補頁面本身沒寫、但讀者會搜的詞（接案頁全文沒有「接案」二字），只供比對不顯示
 * - sourceFile  相對 source/ 的檔案，拿來抽內文。留空代表只靠 title 與 keywords 命中
 * - weight      1 代表標題命中時排在所有文章前面。不想置頂就改成 0
 */
const EXTRA_PAGES = [
  {
    url        : '/n8n-tutorial-resources/',
    title      : 'n8n 教學：節點介紹、模板、部署指南',
    description: 'n8n 教學總覽頁，把節點介紹、小撇步、模板、功能更新、部署設定的文章整理成一頁。',
    keywords   : 'n8n 教學 n8n 入門 n8n 新手 n8n 中文教學 n8n 節點 n8n 部署',
    // 這頁的內文是 n8n-resources.swig 產生的 34 篇文章標題清單，generator 階段拿不到。
    // 不抽也好：那些文章本來就各自在索引裡，重複收錄只會製造雜訊。
    sourceFile : null,
    weight     : 1
  },
  {
    url        : '/tools/n8n_template/models.html',
    title      : 'n8n 模板分享',
    description: '可直接下載匯入的 n8n 自動化模板，涵蓋 AI Chatbot、Google 服務、LINE、備份等情境。',
    keywords   : 'n8n 模板 n8n template n8n 範本 n8n workflow 下載',
    sourceFile : 'tools/n8n_template/models.html',
    weight     : 1
  },
  {
    url        : '/n8n-expert/',
    title      : 'n8n 自動化專家：企業導入、技術顧問、內訓課程',
    description: '企業流程自動化建置、一對一技術顧問與企業內訓：流程診斷、工作流設計、API 串接、AI Agent 開發。',
    keywords   : 'n8n 接案 n8n 外包 n8n 顧問 n8n 企業導入 n8n 內訓 n8n 服務 n8n 客製',
    sourceFile : 'n8n-expert/index.html',
    weight     : 1
  }
];

// 抽出可搜尋的純文字。
// nav/header/footer 一定要拿掉：這幾頁互相連結，導覽列會把彼此的名字寫進內文，
// 造成搜「n8n 接案」時模板頁因為導覽列有那四個字而贏過真正的接案頁。
const extractText = html => stripHTML(
  html
    // 這些頁是 layout: false 的純 HTML，開頭的 front matter 要先拿掉，
    // 否則「--- layout: false ---」會被當成內文
    .replace(/^\s*---[\s\S]*?---\s*/, '')
    .replace(/<(script|style|nav|header|footer)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
)
  .replace(/\s+/g, ' ')
  .trim();

hexo.extend.generator.register('search-ranking', function(locals) {
  const config = this.config;
  const searchPath = (config.search && config.search.path) || 'search.json';

  // 文章索引，欄位與 hexo-generator-searchdb 一致
  const entries = locals.posts.toArray().map(post => {
    const entry = {
      title  : post.title,
      url    : encodeURI(config.root + post.path),
      // 移除程式碼區塊的行號欄，否則行號會混進搜尋內容
      content: stripHTML(post.content.replace(/<td class="gutter">[\s\S]*?<\/td>/g, '')),
      _time  : post.date ? post.date.valueOf() : 0
    };
    if (post.categories && post.categories.length > 0) {
      entry.categories = post.categories.map(category => category.name);
    }
    if (post.tags && post.tags.length > 0) {
      entry.tags = post.tags.map(tag => tag.name);
    }
    // 只在有設定時寫入，避免整份 json 塞滿 "weight":0
    const weight = Number(post.search_weight) || 0;
    if (weight !== 0) {
      entry.weight = weight;
    }
    return entry;
  });

  // 日期新到舊。前端排序分數平手時會沿用這個順序，等於「新文優先」
  entries.sort((left, right) => right._time - left._time);
  entries.forEach(entry => delete entry._time);

  // 入口頁靠 weight 取勝，不參與日期排序，直接接在文章後面
  EXTRA_PAGES.forEach(page => {
    let text = '';
    if (page.sourceFile) {
      const filePath = path.join(this.source_dir, page.sourceFile);
      if (fs.existsSync(filePath)) {
        text = extractText(fs.readFileSync(filePath, 'utf8'));
      } else {
        console.warn(`[Search Ranking] Source file not found: ${page.sourceFile}`);
      }
    }
    entries.push({
      title      : page.title,
      url        : page.url,
      // keywords 放在前面純粹是為了比對，讀者看到的摘要走 description
      content    : `${page.keywords} ${text}`.trim(),
      description: page.description,
      weight     : page.weight
    });
  });

  console.log(
    `[Search Ranking] ${locals.posts.length} posts by date, `
    + `${EXTRA_PAGES.length} entry pages, `
    + `${entries.filter(entry => entry.weight).length} pinned`
  );

  return {
    path: searchPath,
    data: JSON.stringify(entries)
  };
});
