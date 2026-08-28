/**
 * FAQ Tag Plugin for Hexo
 * Usage: {% faq %}
 * [
 *   {
 *     "question": "問題標題",
 *     "answer": "回答內容",
 *     "category": "分類" (optional)
 *   }
 * ]
 * {% endfaq %}
 */

// 全域 Map 儲存 FAQ 資料。
// 注意：FAQPage schema 已改由 themes/next/scripts/helpers/custom_structure_data.js
// 直接解析文章原始碼產生，不再讀這個 Map。增量建置命中 db.json 快取時本 tag 不會執行，
// Map 會是空的，靠它產 schema 會整批消失。這裡保留只供其他用途。
// Key: source path, Value: FAQ items array
global.faqDataStore = global.faqDataStore || new Map();

hexo.extend.tag.register('faq', function(_, content) {
  try {
    const contentStr = Array.isArray(content) ? content.join('') : (content || '');
    const faqItems = JSON.parse(contentStr.trim());

    // 🆕 存到全域 Map，用 source path 作為 key
    const sourceKey = this.source || this.path;
    if (sourceKey) {
      const existing = global.faqDataStore.get(sourceKey) || [];
      faqItems.forEach(item => {
        existing.push({
          question: item.question,
          // 移除 HTML 標籤，JSON-LD 要純文字
          answer: (item.answer || '').replace(/<[^>]*>/g, '')
        });
      });
      global.faqDataStore.set(sourceKey, existing);
    }

    let html = '<div class="faq-container">\n';

    // 如果有分類，按分類分組
    const hasCategories = faqItems.some(item => item.category);

    if (hasCategories) {
      // 按分類分組
      const grouped = {};
      faqItems.forEach(item => {
        const cat = item.category || '其他';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
      });

      // 渲染每個分類
      Object.entries(grouped).forEach(([category, items]) => {
        html += `  <div class="faq-category">\n`;
        html += `    <h3 class="faq-category-title">${category}</h3>\n`;
        html += renderFaqItems(items);
        html += `  </div>\n`;
      });
    } else {
      // 無分類直接渲染
      html += renderFaqItems(faqItems);
    }

    html += '</div>\n';
    html += getFaqScript();

    return html;
  } catch (error) {
    return `<!-- FAQ JSON Parse Error: ${error.message} -->`;
  }
}, {ends: true});

function renderFaqItems(items) {
  let html = '';
  items.forEach((item, index) => {
    const uniqueId = `faq-${Date.now()}-${index}`;
    html += `    <div class="faq-item">\n`;
    html += `      <div class="faq-question" data-faq-id="${uniqueId}">\n`;
    html += `        <span class="faq-icon">❓</span>\n`;
    html += `        <span class="faq-question-text">${item.question}</span>\n`;
    html += `        <span class="faq-toggle"><i class="fa fa-chevron-down"></i></span>\n`;
    html += `      </div>\n`;
    html += `      <div class="faq-answer" id="${uniqueId}">\n`;
    html += `        <div class="faq-answer-content">\n`;
    html += `          <div class="faq-answer-text">${item.answer}</div>\n`;
    html += `        </div>\n`;
    html += `      </div>\n`;
    html += `    </div>\n`;
  });
  return html;
}

function getFaqScript() {
  return `
<script>
document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqId = this.getAttribute('data-faq-id');
      const answer = document.getElementById(faqId);
      const toggle = this.querySelector('.faq-toggle');
      const item = this.closest('.faq-item');

      // 切換展開/收合狀態
      const isActive = item.classList.contains('active');

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});
</script>`;
}
