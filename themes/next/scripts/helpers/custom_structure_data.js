/**
 * Builds JSON-LD structured data for current page according to its type (page or post).
 *
 * @returns {string} - JSON-LD structured data
 */
function darrellStructuredData() {
  const page = this.page;
  const darrell_structured_data = page.darrell_structured_data || false;

  if (this.is_post() && darrell_structured_data) {
    let entities = [];

    for (i = 0; i < darrell_structured_data.question.length; i++) {
      entities.push({
        "@type": "Question",
        name: darrell_structured_data.question[i],
        acceptedAnswer: {
          "@type": "Answer",
          text: darrell_structured_data.answer[i],
        },
      });
    }

    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: entities,
    };

    return (
      '<script type="application/ld+json">' + JSON.stringify(schema) + "</script>"
    );
  }
}

hexo.extend.helper.register("darrell_structured_data", darrellStructuredData);

/**
 * Builds JSON-LD structured data for current page according to its type (page or post).
 *
 * @returns {string} - JSON-LD structured data
 */
function darrellOrgStructuredData() {

  /**
   * 
   * <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "OnlineBusiness",
      "name": "我的線上書店",
      "url": "http://www.myonlinebookstore.com",
      "logo": "http://www.myonlinebookstore.com/logo.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "中山北路一段",
        "addressLocality": "台北市",
        "postalCode": "104",
        "addressCountry": "TW"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+886-2-1234-5678",
        "contactType": "客戶服務"
      },
      "founder": "張三",
      "foundingDate": "2010-01-01",
      "email": "info@myonlinebookstore.com"
    }
    </script>
   */

  schema = {
    "@context": "https://schema.org",
    "@type": "OnlineBusiness",
    "name": "Darrell Martech TW",
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
