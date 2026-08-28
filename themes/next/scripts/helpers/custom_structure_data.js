/**
 * Builds JSON-LD structured data for current page according to its type (page or post).
 * 支援兩種來源：
 * 1. front matter 的 darrell_structured_data（手動設定）
 * 2. {% faq %} 標籤的內容（直接從文章原始碼解析）
 *
 * @returns {string} - JSON-LD structured data
 */

const FAQ_BLOCK_PATTERN = /\{%\s*faq\b[^%]*%\}([\s\S]*?)\{%\s*endfaq\s*%\}/g;

// JSON-LD 只吃純文字：<br> 轉空白，其餘標籤直接拿掉，再收斂連續空白
function toPlainText(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 直接從文章原始碼解析 {% faq %} 區塊。
 * 不能改用 global.faqDataStore：那個 Map 由 tag 在 render 階段填入，
 * 增量建置命中 db.json 快取時 tag 不會執行，layout 就讀到空的 Map，
 * 導致 FAQPage schema 整批消失。原始碼在 layout 階段一定拿得到。
 */
function parseFaqFromRaw(raw) {
  const items = [];
  if (!raw) return items;

  FAQ_BLOCK_PATTERN.lastIndex = 0;
  let match;
  while ((match = FAQ_BLOCK_PATTERN.exec(raw)) !== null) {
    let parsed;
    try {
      parsed = JSON.parse(match[1].trim());
    } catch (error) {
      // 單一區塊格式壞掉就跳過，其他區塊照常輸出
      continue;
    }
    if (!Array.isArray(parsed)) continue;
    parsed.forEach(item => {
      if (!item || !item.question) return;
      items.push({
        question: toPlainText(item.question),
        answer: toPlainText(item.answer)
      });
    });
  }
  return items;
}

function darrellStructuredData() {
  const page = this.page;
  const manualFaqData = page.darrell_structured_data || false;

  const autoFaqData = parseFaqFromRaw(page.raw);

  // 如果不是文章，直接返回
  if (!this.is_post()) {
    return '';
  }

  let entities = [];

  // 優先使用手動設定的 front matter 資料
  if (manualFaqData && manualFaqData.question && manualFaqData.question.length > 0) {
    for (let i = 0; i < manualFaqData.question.length; i++) {
      entities.push({
        "@type": "Question",
        name: manualFaqData.question[i],
        acceptedAnswer: {
          "@type": "Answer",
          text: manualFaqData.answer[i],
        },
      });
    }
  }
  // 否則使用 {% faq %} 自動收集的資料
  else if (autoFaqData.length > 0) {
    autoFaqData.forEach(item => {
      entities.push({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      });
    });
  }

  // 如果沒有任何 FAQ 資料，返回空字串
  if (entities.length === 0) {
    return '';
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entities,
  };

  return (
    '<script type="application/ld+json">' + JSON.stringify(schema) + "</script>"
  );
}

hexo.extend.helper.register("darrell_structured_data", darrellStructuredData);


function darrellOrgStructuredData() {

  schema = {
    "@context": "https://schema.org",
    "@type": "OnlineBusiness",
    "name": "Darrell TW",
    "url": "https://www.darrelltw.com/",
    "logo": "https://www.darrelltw.com/images/darrell_icon_512.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "service@darrelltw.com",
      "contactType": "技術服務",
      "areaServed": ["TW", "US", "JP", "TH", "CN", "MY", "SG"],
      "availableLanguage": ["中文", "English"]
    },
    "founder": "Darrell Wang",
    "email": "service@darrelltw.com"
  };

  return (
    '<script type="application/ld+json">' + JSON.stringify(schema) + "</script>"
  );
}

hexo.extend.helper.register("darrell_org_structured_data", darrellOrgStructuredData);

function darrellWebStructuredData() {

  schema = {
    "@context" : "https://schema.org",
    "@type" : "WebSite",
    "name" : "Darrell TW",
    "url" : "https://www.darrelltw.com/",
    "sameAs" : [
      "https://x.com/darrell_tw_",
      "https://www.threads.net/@darrell_tw_",
      "https://www.instagram.com/darrell_tw_/",
      "https://medium.com/@darrell.tw.martech"
    ]
  };

  return (
    '<script type="application/ld+json">' + JSON.stringify(schema) + "</script>"
  );
}

hexo.extend.helper.register("darrell_web_structured_data", darrellWebStructuredData);