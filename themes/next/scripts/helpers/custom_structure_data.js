/**
 * Builds JSON-LD structured data for current page according to its type (page or post).
 * 支援兩種來源：
 * 1. front matter 的 darrell_structured_data（手動設定）
 * 2. {% faq %} 標籤自動收集的 _autoFaqData
 *
 * @returns {string} - JSON-LD structured data
 */
function darrellStructuredData() {
  const page = this.page;
  const manualFaqData = page.darrell_structured_data || false;

  // 從全域 Map 讀取 FAQ 資料（由 {% faq %} tag 填入）
  const sourceKey = page.source;
  const autoFaqData = (global.faqDataStore && global.faqDataStore.get(sourceKey)) || [];

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