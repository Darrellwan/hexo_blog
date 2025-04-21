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