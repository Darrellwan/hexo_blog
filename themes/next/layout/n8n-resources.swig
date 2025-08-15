---
title: {{ page.title }}
date: {{ page.date }}
layout: false
---

{%- if theme.favicon.apple_touch_icon %}
  <link rel="apple-touch-icon" sizes="180x180" href="{{ url_for(theme.favicon.apple_touch_icon) }}">
{%- endif %}
{%- if theme.favicon.medium %}
  <link rel="icon" type="image/png" sizes="32x32" href="{{ url_for(theme.favicon.medium) }}">
{%- endif %}
{%- if theme.favicon.small %}
  <link rel="icon" type="image/png" sizes="16x16" href="{{ url_for(theme.favicon.small) }}">
{%- endif %}
{%- if theme.favicon.safari_pinned_tab %}
  <link rel="mask-icon" href="{{ url_for(theme.favicon.safari_pinned_tab) }}" color="{{ theme.android_chrome_color }}">
{%- endif %}
{%- if theme.favicon.android_manifest %}
  <link rel="manifest" href="{{ url_for(theme.favicon.android_manifest) }}">
{%- endif %}
{%- if theme.favicon.ms_browserconfig %}
  <meta name="msapplication-config" content="{{ url_for(theme.favicon.ms_browserconfig) }}">
{%- endif %}

{%- if theme.google_site_verification %}
  <meta name="google-site-verification" content="{{ theme.google_site_verification }}">
{%- endif %}

<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>n8n 教學完整指南 | 節點詳解+實戰案例 | Darrell TW</title>
  <meta name="description" content="完整 n8n 教學！免費學習路徑 + 節點實戰教學 + 模板下載。LINE Bot、Gmail、Slack 自動化案例。">
  <meta name="keywords" content="n8n教學, n8n中文教學, n8n節點教學, n8n學習路徑, 工作流程自動化, n8n模板下載, n8n部署指南, 自動化工具, n8n新手指南, n8n實戰案例, workflow automation, n8n tutorial, n8n常見問題, LINE Bot n8n, Slack n8n整合">
  
  <!-- 作者和網站資訊 -->
  <meta name="author" content="Darrell TW">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  
  <!-- 語言和地區 -->
  <meta name="language" content="zh-TW">
  <meta name="geo.region" content="TW">
  <meta name="geo.country" content="Taiwan">
  <link rel="canonical" href="{{ config.url }}{{ url_for(page.permalink) }}">
  
  <!-- 技術 SEO -->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="referrer" content="no-referrer-when-downgrade">
  <meta name="format-detection" content="telephone=no">
  <meta name="theme-color" content="#ff6d5a">
  <meta name="msapplication-TileColor" content="#ff6d5a">
  
  <!-- 預載入重要資源 -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
  <link rel="dns-prefetch" href="//www.googletagmanager.com">
  <link rel="dns-prefetch" href="//www.google-analytics.com">
  
  <!-- Sitemap 和 RSS -->
  <link rel="sitemap" type="application/xml" title="Sitemap" href="{{ config.url }}/sitemap.xml">
  
  <!-- 頁面類型和更新時間 -->
  <meta property="article:published_time" content="{{ page.date or date() }}">
  <meta property="article:modified_time" content="{{ page.updated or date() }}">
  <meta property="article:author" content="Darrell TW">
  <meta property="article:section" content="n8n教學">
  <meta property="article:tag" content="n8n, 自動化, 工作流程, 教學">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ config.url }}{{ url_for(page.permalink) }}">
  <meta property="og:title" content="n8n 教學完整指南 零基礎到專家">
  <meta property="og:description" content="最完整 n8n 教學！免費學習路徑 + 節點實戰教學 + 模板下載。LINE Bot、Gmail、Slack 自動化案例">
  <meta property="og:image" content="{{ config.url }}{{ url_for('/gallery/n8n_resource_og.jpg') }}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="n8n 教學資源大全 - 節點介紹、模板分享、部署指南">
  <meta property="og:site_name" content="Darrell TW - MarTech 自動化專家">
  <meta property="og:locale" content="zh_TW">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@darrell_tw">
  <meta name="twitter:creator" content="@darrell_tw">
  <meta name="twitter:url" content="{{ config.url }}{{ url_for(page.permalink) }}">
  <meta name="twitter:title" content="n8n 教學完整指南 2025【免費】零基礎到專家">
  <meta name="twitter:description" content="完整 n8n 教學！免費學習路徑 + 節點實戰教學 + 模板下載。LINE Bot、Gmail、Slack 自動化案例">
  <meta name="twitter:image" content="{{ config.url }}{{ url_for('/gallery/n8n_resource_og.jpg') }}">
  <meta name="twitter:image:alt" content="n8n 教學資源大全 - 節點介紹、模板分享、部署指南">

  <!-- 
  <script src="https://cdn.jsdelivr.net/npm/algoliasearch@5.23.4/dist/algoliasearch.umd.js"></script>
  
  <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4.78.1/dist/instantsearch.production.min.js"></script>
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.4.2/themes/algolia-min.css">
  -->
  
  <script>
    /* Algolia 搜尋相關功能暫時關閉
    // 檢查 Algolia 是否已正確載入
    function isAlgoliaLoaded() {
      return typeof algoliasearch !== 'undefined' && typeof instantsearch !== 'undefined';
    }
    */

    // 初始化頁面功能
    window.onload = function() {
      /* Algolia 搜尋功能暫時關閉
      if (!isAlgoliaLoaded()) {
        console.error('algoliasearch 或 instantsearch 未正確載入。請確認 CDN 是否正確引入。');
        
        // 顯示錯誤訊息給使用者
        const searchContainer = document.querySelector('.n8n-search-container');
        if (searchContainer) {
          searchContainer.innerHTML = '<div style="color: #ff6d5a; padding: 15px; text-align: center;">搜尋功能載入失敗，請重新整理頁面或稍後再試</div>';
        }
      } else {
        console.log('Algolia 搜尋初始化中...');
        const searchClient = algoliasearch.algoliasearch('JPTDAB3P1B', '6e8babb8aef768a0190937d0b744dba9');
        
        const search = instantsearch({
          indexName: 'n8n_post',
          searchClient,
          searchFunction: function(helper) {
            // 只有在搜尋框有輸入內容時才執行搜尋
            if (helper.state.query) {
              helper.search();
            }
          }
        });
        
        // 搜尋框
        search.addWidgets([
          instantsearch.widgets.searchBox({
            container: '#algolia-search-box',
            placeholder: '搜尋 n8n 文章、教學...',
            cssClasses: {
              root: 'algolia-searchbox-root',
              input: 'algolia-searchbox-input',
              submit: 'algolia-searchbox-submit',
              reset: 'algolia-searchbox-reset'
            }
          }),
          
          // 搜尋結果
          instantsearch.widgets.hits({
            container: '#algolia-hits',
            cssClasses: {
              root: 'algolia-hits-root',
              list: 'algolia-hits-list',
              item: 'algolia-hit'
            },
            templates: {
              item: function(hit) {
                const title = hit._highlightResult && hit._highlightResult.title ? 
                              hit._highlightResult.title.value : hit.title;
                const desc = hit._snippetResult && hit._snippetResult.description ? 
                            hit._snippetResult.description.value : 
                            (hit.description || '');
                
                return `
                  <div class="algolia-hit">
                    <a href="${hit.url || hit.path}" target="_blank" rel="noopener"
                      onclick="trackClick('${hit.url || hit.path}', '${hit.title}', '${hit.author || 'Darrell TW'}', '${hit.category || 'search'}')">
                      <div class="algolia-hit-title">${title}</div>
                      <div class="algolia-hit-snippet">${desc}</div>
                    </a>
                  </div>
                `;
              },
              empty: `<div class="algolia-empty">沒有找到相關結果</div>`,
            }
          }),
          
          // 搜尋統計
          instantsearch.widgets.stats({
            container: '#algolia-hits',
            templates: {
              text: function(data) {
                return `<div class="algolia-stats">找到 ${data.nbHits} 個結果</div>
                       <div class="algolia-powered">
                         Powered by <a href="https://www.algolia.com" target="_blank" rel="noopener">
                           Algolia <img src="https://www.algolia.com/assets/algolia-logo-light-2d1d0725b97668f6468e31860e2e352e.svg" alt="Algolia">
                         </a>
                       </div>`;
              }
            }
          })
        ]);
        
        search.start();
        console.log('Algolia 搜尋初始化完成');
      }
      */
      
      // 平滑滾動效果
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const tgt = document.getElementById(a.getAttribute('href').slice(1));
          if (tgt) window.scrollTo({ top: tgt.offsetTop - 80, behavior: 'smooth' });
        });
      });
      
      // 導航欄固定效果
      const nav = document.querySelector('.n8n-nav');
      const navTop = nav.offsetTop;
      
      window.addEventListener('scroll', () => {
        if (window.scrollY >= navTop) {
          nav.classList.add('n8n-nav-fixed');
        } else {
          nav.classList.remove('n8n-nav-fixed');
        }
        
        // 高亮當前區塊
        const sections = document.querySelectorAll('.n8n-section');
        const navLinks = document.querySelectorAll('.n8n-nav a');
        
        // 如果沒有區塊，首頁保持高亮
        let currentSection = '';
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 100;
          if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
          }
        });
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (currentSection && link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
          } else if (!currentSection && link.getAttribute('href') === '/') {
            link.classList.add('active');
          }
        });
      });
    };
  </script>

<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WRZDBFS')
</script>

<script>
// 創建n8n資源文章的JSON對象
try {
  const jsonStr = '{{ get_n8n_posts_json_for_schema() }}';
  window.n8nPostsData = JSON.parse(jsonStr);
  console.log('成功載入 n8n 文章數據');
} catch (error) {
  console.error('解析 n8n 文章數據時發生錯誤：', error);
  window.n8nPostsData = [];
}

// 格式化項目元素列表，用於結構化數據
function generateItemListElements() {
  if (!window.n8nPostsData || window.n8nPostsData.length === 0) {
    return [];
  }
  
  return n8nPostsData.map(function(post) {
    return {
      "@type": "ListItem",
      "position": post.position,
      "item": {
        "@type": "Article",
        "name": post.title,
        "url": post.url,
        "headline": post.title,
        "description": post.description,
        "image": post.image,
        "author": {
          "@type": "Person",
          "name": "Darrell TW",
          "url": "https://www.darrelltw.com/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Darrell TW",
          "logo": {
            "@type": "ImageObject",
            "url": "{{ config.url }}{{ url_for('/gallery/n8n_resource_og.jpg') }}"
          }
        }
      }
    };
  });
}

// 生成完整的結構化數據
const schemaData = [
  // 主要頁面數據
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "{{ config.url }}/n8n-tutorial-resources/",
    "name": "n8n 教學大全：節點教學、模板分享、部署指南",
    "description": "{{ page.description or '完整n8n自動化教學大全，包含50+節點詳解、實用模板下載、一鍵部署指南。適合初學者到進階用戶，5分鐘上手工作流程自動化。' }}",
    "url": "{{ config.url }}/n8n-tutorial-resources/",
    "inLanguage": "zh-TW",
    "isAccessibleForFree": true,
    "lastReviewed": "{{ date(date(), 'YYYY-MM-DD') }}",
    "publisher": {
      "@type": "Organization",
      "name": "Darrell TW",
      "url": "{{ config.url }}",
      "logo": {
        "@type": "ImageObject",
        "url": "{{ config.url }}{{ url_for('/gallery/n8n_resource_og.jpg') }}",
        "width": 1200,
        "height": 630
      },
      "sameAs": [
        "https://www.threads.net/@darrell_tw_",
        "https://www.instagram.com/darrell_tw_/",
        "https://www.linkedin.com/in/darrell-wang-tw/"
      ]
    },
    "author": {
      "@type": "Person",
      "name": "Darrell TW",
      "url": "https://www.darrelltw.com/",
      "sameAs": [
        "https://www.threads.net/@darrell_tw_",
        "https://www.instagram.com/darrell_tw_/"
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": generateItemListElements().length,
      "itemListElement": generateItemListElements()
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首頁",
          "item": {
            "@type": "WebPage",
            "@id": "{{ config.url }}"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "n8n 教學大全",
          "item": {
            "@type": "CollectionPage",
            "@id": "{{ config.url }}/n8n-tutorial-resources/"
          }
        }
      ]
    },
    "keywords": "n8n教學, n8n節點, 工作流程自動化, n8n模板下載, n8n部署, 自動化工具, n8n中文教學"
  },
  // 網站數據
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "{{ config.url }}/#website",
    "url": "{{ config.url }}",
    "name": "Darrell TW - MarTech 自動化專家",
    "description": "專業 MarTech 自動化解決方案，n8n 教學專家",
    "publisher": {
      "@type": "Organization",
      "name": "Darrell TW"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "{{ config.url }}/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  },
  // FAQ 結構化數據
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "{{ config.url }}/n8n-tutorial-resources/#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "n8n 是什麼？適合什麼樣的用戶使用？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "n8n 是一個開源的工作流程自動化工具，讓你可以用視覺化的方式連接不同的服務和 API。適合行銷人員進行客戶數據收集和郵件行銷、小企業主自動化訂單處理和客服回覆、開發者快速建立 API 整合，以及個人用戶自動化日常工作如檔案備份和通知提醒。"
        }
      },
      {
        "@type": "Question", 
        "name": "n8n 和 Zapier、Microsoft Power Automate 有什麼差別？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "n8n 是開源免費且自部署無限額的工具，具有高度客製化特性，適合複雜工作流程和開發者使用。相比之下，Zapier 是月費制且有用量限制，模板化程度較高適合簡單自動化；Power Automate 則與 Microsoft 365 綁定，適合企業和微軟環境用戶。"
        }
      },
      {
        "@type": "Question",
        "name": "我完全沒有程式背景，能學會 n8n 嗎？",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "絕對可以！n8n 採用視覺化介面，只需拖拉節點就能建立流程，不需要寫程式。提供豐富的模板可以從現成範例開始學習，可以從簡單的 2-3 個節點開始循序漸進。建議跟著學習路徑一步步來，大約 2-4 週就能建立實用的工作流程。"
        }
      },
      {
        "@type": "Question",
        "name": "n8n 應該選擇雲端版還是自部署？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "雲端版 (n8n.cloud) 適合想要快速開始、小型團隊或個人使用、不介意月費且重視穩定性的用戶。自部署適合想要完全控制和無限使用量、有基本伺服器管理能力、處理敏感資料需要資料自主權，以及長期大量使用想節省成本的用戶。建議先用雲端版學習，熟悉後再考慮自部署。"
        }
      },
      {
        "@type": "Question",
        "name": "工作流程執行失敗了，該如何除錯？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "系統化的除錯方法包括：1. 檢查執行日誌點擊失敗的節點查看錯誤訊息；2. 逐節點測試從前面的節點開始一個一個單獨執行；3. 檢查資料格式確認前一個節點的輸出格式符合下個節點的預期；4. 使用 Pin 功能固定測試資料避免重複呼叫 API；5. 檢查憑證設定確認 API 金鑰、OAuth 設定正確。"
        }
      },
      {
        "@type": "Question",
        "name": "n8n 能幫我自動化哪些工作？有實際案例嗎？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "n8n 可以自動化客戶服務（LINE Bot 自動回覆、Slack 通知系統、CRM 客戶資料整合）、行銷活動（郵件行銷、社群媒體管理、潛在客戶追蹤）、資料處理（報表自動化、檔案備份、資料同步）。實際案例：一家 20 人的電商公司用 n8n 把客服回應時間從 2 小時縮短到 5 分鐘，客戶滿意度提升 40%。"
        }
      },
      {
        "@type": "Question",
        "name": "學會 n8n 大概需要多少時間？成本多少？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "學習時間依背景而定：有技術背景 1-2 週掌握基礎 1 個月達到熟練；無技術背景 3-4 週掌握基礎 2-3 個月達到熟練；深度應用 4-6 個月可以處理複雜的企業級流程。學習成本包括每週 3-5 小時練習時間、軟體成本（自部署免費，雲端版 $20/月起）、學習資源和實驗成本（API 服務免費額度通常夠練習）。"
        }
      },
      {
        "@type": "Question", 
        "name": "使用 n8n 處理敏感資料安全嗎？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "雲端版符合 SOC 2 Type II 認證，資料傳輸和儲存都有加密，定期進行安全稽核和滲透測試，但資料仍在第三方伺服器。自部署版可完全控制資料存放位置，可配置 VPN、防火牆等安全措施，符合企業內部資安政策，但需要自己負責安全維護。建議敏感資料使用環境變數儲存、定期更新 API 金鑰、設定 IP 白名單限制存取。"
        }
      }
    ]
  }
];

// 將結構化數據添加到頁面
document.addEventListener('DOMContentLoaded', function() {
  // 為每個結構化數據創建單獨的 script 標籤
  schemaData.forEach((schema, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    script.id = 'schema-' + index;
    document.head.appendChild(script);
  });
});
</script>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WRZDBFS"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<header class="n8n-resources-header" role="banner">
  <div class="n8n-header-wrapper">
    <h1>n8n 教學完整指南 🚀 台灣最詳細的自動化工作流程教學</h1>
    <div class="social-buttons">
      <a href="https://www.darrelltw.com/" class="social-button" target="_blank" rel="noopener noreferrer" title="Website">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41z"></path></svg>
      </a>
      <a href="https://www.threads.net/@darrell_tw_" class="social-button" target="_blank" rel="noopener noreferrer" title="Threads">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 440 511.43" fill="currentColor"><path d="M342.383 237.038a177.282 177.282 0 00-6.707-3.046c-3.948-72.737-43.692-114.379-110.429-114.805-38.505-.255-72.972 15.445-94.454 48.041l36.702 25.178c15.265-23.159 39.221-28.096 56.864-28.096.204 0 .408 0 .61.002 21.974.14 38.555 6.529 49.287 18.987 7.81 9.071 13.034 21.606 15.621 37.425-19.483-3.311-40.553-4.329-63.077-3.038-63.45 3.655-104.24 40.661-101.501 92.08 1.391 26.083 14.385 48.523 36.587 63.181 18.772 12.391 42.95 18.45 68.077 17.079 33.183-1.819 59.215-14.48 77.377-37.63 13.793-17.58 22.516-40.363 26.368-69.069 15.814 9.544 27.535 22.103 34.007 37.2 11.006 25.665 11.648 67.84-22.764 102.223-30.15 30.121-66.392 43.151-121.164 43.554-60.758-.45-106.708-19.935-136.583-57.915-27.976-35.562-42.434-86.93-42.973-152.674.539-65.746 14.997-117.114 42.973-152.676 29.875-37.979 75.824-57.463 136.582-57.914 61.197.455 107.948 20.033 138.967 58.195 15.21 18.713 26.676 42.248 34.236 69.688L440 161.532c-9.163-33.775-23.582-62.881-43.203-87.017C357.031 25.59 298.872.519 223.936 0h-.3C148.851.518 91.344 25.683 52.709 74.795 18.331 118.499.598 179.308.002 255.535l-.002.18.002.18c.596 76.225 18.329 137.037 52.707 180.741 38.635 49.11 96.142 74.277 170.927 74.794h.3c66.486-.462 113.352-17.868 151.96-56.442 50.51-50.463 48.99-113.718 32.342-152.549-11.945-27.847-34.716-50.463-65.855-65.401zM227.587 344.967c-27.808 1.567-56.699-10.916-58.124-37.651-1.056-19.823 14.108-41.942 59.831-44.577a266.87 266.87 0 0115.422-.45c16.609 0 32.145 1.613 46.271 4.701-5.268 65.798-36.172 76.483-63.4 77.977z"></path></svg>
      </a>
      <a href="mailto:darrell.tw.martech@gmail.com" class="social-button" target="_blank" rel="noopener noreferrer" title="Gmail">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
      </a>
      <a href="https://www.instagram.com/darrell_tw_/" class="social-button" target="_blank" rel="noopener noreferrer" title="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.281-.057 1.689-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
      </a>
      <a href="https://buymeacoffee.com/darrell_tw" class="social-button" target="_blank" rel="noopener noreferrer" title="Buy Me a Coffee">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"></path></svg>
      </a>
      <a href="https://www.linkedin.com/in/darrell-wang-tw/" class="social-button" target="_blank" rel="noopener noreferrer" title="LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
      </a>
    </div>
  </div>
  <div class="n8n-search-container">
    <!-- Algolia 搜尋功能暫時關閉 
    <div id="algolia-search-box"></div>
    <div id="algolia-hits"></div>
    -->
  </div>
</header>

<main class="n8n-resources-container" role="main" itemscope itemtype="https://schema.org/CollectionPage">
  <!-- 麵包屑導航 -->
  <nav aria-label="麵包屑導航" class="n8n-breadcrumb">
    <ol itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="{{ config.url }}" itemprop="item">
          <span itemprop="name">首頁</span>
        </a>
        <meta itemprop="position" content="1">
      </li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span itemprop="name">n8n 教學大全</span>
        <meta itemprop="position" content="2">
      </li>
    </ol>
  </nav>

  {% set sections = [
    { id: 'node-intro', title: 'n8n 節點介紹' },
    { id: 'tips', title: 'n8n 小撇步' },
    { id: 'templates', title: 'n8n 模板分享' },
    { id: 'updates', title: 'n8n 功能更新' },
    { id: 'deployment', title: 'n8n 部署與設定' }
  ] %}
  
  {% set tutorials = [
    {
      title: "【一鍵安裝 n8n】圖文教學，獲得無限額度自動化工具＆限時免費升級企業版功能",
      link: "https://raymondhouch.com/lifehacker/digital-workflow/n8n-deploy-guide/",
      image: "https://raymondhouch.com/wp-content/uploads/2024/11/n8n-zeabur-deploy.compressed.jpg",
      author: "侯智薰（雷蒙）",
      authorLink: "https://www.threads.net/@raymond0917",
      description: "完整中文圖文步驟式教學，如何一鍵用 Zeabur 自行部署安裝 n8n，獲得無限量的自動化工作流額度，並免費領取企業版升級功能。（含影片手把手教學）個人自部署的注意事項、伺服器選擇和 n8n 學習資源整理"
    },
    {
      title: "【n8n 教學】如何串接 Google 自動化服務？API、Credentials 憑證設定步驟圖文教學",
      link: "https://raymondhouch.com/lifehacker/digital-workflow/n8n-google-credentials-guide/",
      image: "https://raymondhouch.com/wp-content/uploads/2025/01/n8n-google-credentials-guide_compressed.jpg",
      author: "侯智薰（雷蒙）",
      authorLink: "https://www.threads.net/@raymond0917",
      description: "想整合 Google 服務到 n8n 自動化工作流程？本篇教學帶你逐步了解 Google API 憑證申請流程。包含如何設定 OAuth 2.0、取得 API Key，到成功串接 Gmail、Sheets、Drive 等 Google 服務。完整圖文詳細解說，幫助自動化新手，輕鬆完成設定整合，開始享受專屬的 AI 自動化工作流。"
    },
    {
      title: "「超詳細教學」n8n AI 實作0基礎入門到進階",
      link: "https://www.youtube.com/watch?v=vvqhzbp4J5A",
      image: "/gallery/n8n_resource_vvqhzbp4J5A.webp",
      author: "HC AI說人話",
      authorLink: "https://www.threads.com/@hc_aichannel",
      description: "長達三小時的 n8n 教學，從 0 到 1"
    },
    {
      title: "AI免費自動排版, 免API, 解鎖自訂中文字體 = AI 平面神技?",
      link: "https://www.youtube.com/watch?v=ncYmf5YHLks",
      image: "/gallery/n8n_resource_ncYmf5YHLks.webp",
      author: "HC AI說人話",
      authorLink: "https://www.threads.com/@hc_aichannel",
      description: "如何用 n8n 快速做出排版平面"
    },
    {
      title: "n8n 初學者完整指南 (2025)",
      link: "https://drive.google.com/file/d/10Txuls1-PgLdcYMGMl85MKljJP7CTngd/view",
      image: "/gallery/merfy_lee_n8n_doc.png",
      author: "mengfengl",
      authorLink: "https://www.threads.net/@mengfengl",
      description: "35頁完整的 n8n 新手指南！"
    },
    {
      title: "資訊小白也可架設本地n8n",
      link: "https://elisha0918.notion.site/n8n-1cedb692053680dca3bafef10d1907ca",
      image: "/gallery/n8n_resource-elisha_n8n_docker.png",
      author: "Elisha_0918",
      authorLink: "https://www.threads.com/@elisha_0918",
      description: "一起來學習如何用 Docker 安裝 n8n"
    },
    {
      title: "我成功利用Zeabur部署n8n小助理",
      link: "https://elisha0918.notion.site/Zeabur-n8n-1d7db692053680c2b996ef8234b0d09c",
      image: "/gallery/n8n_resource-elisha_n8n_zeabur.png",
      author: "Elisha_0918",
      authorLink: "https://www.threads.com/@elisha_0918",
      description: "Zeabur + Google OAuth + Line Request 完整的經驗分享"
    }
    
  ] %}

  <nav class="n8n-nav" aria-label="主導航">
    <ul>
      <li><a href="/" class="active">首頁</a></li>
      <li><a href="#learning-guide">學習指南</a></li>
      {% for section in sections %}
        {% set list = get_n8n_posts_by_category(section.id) %}
        {% if list.length > 0 %}
        <li><a href="#{{ section.id }}">{{ section.title }}</a></li>
        {% endif %}
      {% endfor %}
      <li><a href="#tutorials">外部教學</a></li>
      <li><a href="#faq">常見問題</a></li>
      <li><a href="#related-articles">相關文章</a></li>
      <li><a href="#about">相關連結</a></li>
    </ul>
  </nav>

  <div class="n8n-resources-content">
    <div class="n8n-main-content">
      {# ========= 共用區塊 Macro ========= #}
      {% macro renderSection(cid, title) %}
      {% set list = get_n8n_posts_by_category(cid) %}
      {% if list.length > 0 %}
      <section id="{{ cid }}" class="n8n-section">
        <h2>{{ title }}</h2>
        <div class="n8n-articles">
          {% set counter2 = 0 %}
          {% for post in list %}
            {% if counter2 < 12 %}
              <article class="n8n-article-card">
                <a href="{{ url_for(post.path) }}" class="n8n-article-link" target="_blank" rel="noopener"
                   onclick="trackClick('{{ url_for(post.path) }}', '{{ post.title }}', 'Darrell TW', '{{ cid }}')">
                  <div class="n8n-article-image" style="--bg-image: url('{{ get_n8n_post_thumbnail(post) }}');">
                    <img src="{{ get_n8n_post_thumbnail(post) }}" 
                         alt="{{ post.title }} - n8n {{ cid }}教學文章封面圖" 
                         loading="lazy"
                         decoding="async"
                         width="320" height="320">
                  </div>
                  <div class="n8n-article-info">
                    {# <div class="n8n-article-date">{{ format_n8n_date(post.date) }}</div> #}
                    <h3>{{ post.title }}</h3>
                    <p>{{ get_n8n_post_description(post) }}</p>
                  </div>
                </a>
              </article>
              {% set counter2 = counter2 + 1 %}
            {% endif %}
          {% endfor %}
        </div>
      </section>
      {% endif %}
      {% endmacro %}

      <!-- 成果展示和社會證明 -->
      <section id="achievements" class="n8n-section">
        <div class="achievements-banner">
          <div class="achievement-stats">
            <div class="stat-item">
              <div class="stat-number">1000+</div>
              <div class="stat-label">學員成功入門</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50+</div>
              <div class="stat-label">節點詳細教學</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100+</div>
              <div class="stat-label">實戰案例分享</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">2週</div>
              <div class="stat-label">平均學會時間</div>
            </div>
          </div>
          <div class="trust-indicators">
            <span class="trust-badge">⭐ Google 評分 4.9/5</span>
            <span class="trust-badge">🏆 台灣 #1 n8n 教學</span>
            <span class="trust-badge">✅ 完全免費學習</span>
          </div>
        </div>
      </section>

      <!-- n8n 學習路徑指南 -->
      <section id="learning-guide" class="n8n-section">
        <h2>🚀 n8n 學習路徑完整指南：從零基礎到自動化專家</h2>
        
        <div class="n8n-learning-path">
          <div class="learning-intro">
            <p><strong>🎯 為什麼選擇我們的教學？</strong> 我自己花了 6 個月時間，從完全不懂到能夠建置複雜的企業級自動化流程，幫助超過 1000+ 名學員成功入門。這個學習路徑是我實測總結出來的最有效學習順序，幫助你避開我踩過的坑，用最短時間掌握 n8n 核心技能。</p>
          </div>

          <div class="learning-stages">
            <div class="stage-card beginner">
              <div class="stage-header">
                <h3>🌱 新手階段 (1-2 週)</h3>
                <span class="stage-duration">預計時間：10-15 小時</span>
              </div>
              <div class="stage-content">
                <h4>目標：建立第一個可用的工作流程</h4>
                <div class="learning-steps">
                  <div class="step">
                    <strong>第 1 步：環境設置</strong>
                    <ul>
                      <li>選擇部署方式：<a href="/n8n-deployment/">本地安裝 vs 雲端部署</a></li>
                      <li>完成基本設定和介面熟悉</li>
                      <li>了解節點（Node）概念</li>
                    </ul>
                  </div>
                  <div class="step">
                    <strong>第 2 步：基礎操作實戰</strong>
                    <ul>
                      <li>建立第一個 <a href="/n8n-webhook/">Webhook 接收器</a></li>
                      <li>學會使用 <a href="/n8n-if-switch/">條件判斷節點</a></li>
                      <li>掌握資料傳遞和基本變數</li>
                    </ul>
                  </div>
                  <div class="step">
                    <strong>第 3 步：實用案例練習</strong>
                    <ul>
                      <li>建立簡單的 <a href="/n8n-line-message-api/">LINE 訊息自動回覆</a></li>
                      <li>設定基本的郵件通知流程</li>
                      <li>熟悉測試和除錯工具</li>
                    </ul>
                  </div>
                </div>
                <div class="milestone">
                  <strong>🎯 階段目標：</strong>能夠獨立建立包含 3-5 個節點的簡單工作流程
                </div>
              </div>
            </div>

            <div class="stage-card intermediate">
              <div class="stage-header">
                <h3>🚀 進階階段 (3-6 週)</h3>
                <span class="stage-duration">預計時間：20-30 小時</span>
              </div>
              <div class="stage-content">
                <h4>目標：掌握複雜邏輯和 API 整合</h4>
                <div class="learning-steps">
                  <div class="step">
                    <strong>第 4 步：資料處理進階</strong>
                    <ul>
                      <li>精通 <a href="/n8n-aggregate-split-out/">資料聚合與分割</a></li>
                      <li>學會 <a href="/n8n-built-in-variables/">內建變數</a> 活用技巧</li>
                      <li>掌握 JSON 資料操作和轉換</li>
                    </ul>
                  </div>
                  <div class="step">
                    <strong>第 5 步：常用服務整合</strong>
                    <ul>
                      <li>串接 <a href="/n8n-gmail-node/">Gmail 自動化</a>處理</li>
                      <li>整合 <a href="/n8n-with-slack/">Slack 團隊協作</a>流程</li>
                      <li>學習 <a href="/n8n-node-s3-with-cloudflare-r2/">雲端儲存</a>操作</li>
                    </ul>
                  </div>
                  <div class="step">
                    <strong>第 6 步：錯誤處理與優化</strong>
                    <ul>
                      <li>建立穩健的錯誤處理機制</li>
                      <li>學會 <a href="/n8n-tips-pin/">資料固定技巧</a></li>
                      <li>掌握工作流程除錯方法</li>
                    </ul>
                  </div>
                </div>
                <div class="milestone">
                  <strong>🎯 階段目標：</strong>能夠設計包含 10+ 節點的企業級自動化流程
                </div>
              </div>
            </div>

            <div class="stage-card expert">
              <div class="stage-header">
                <h3>🏆 專家階段 (持續學習)</h3>
                <span class="stage-duration">預計時間：30+ 小時</span>
              </div>
              <div class="stage-content">
                <h4>目標：成為 n8n 自動化專家</h4>
                <div class="learning-steps">
                  <div class="step">
                    <strong>第 7 步：AI 與進階整合</strong>
                    <ul>
                      <li>串接 <a href="/n8n-perplexity-node/">Perplexity AI</a> 智能搜尋</li>
                      <li>整合 <a href="/n8n-elevenlabs-tts/">語音合成服務</a></li>
                      <li>建立複雜的 AI 工作流程</li>
                    </ul>
                  </div>
                  <div class="step">
                    <strong>第 8 步：安全與效能</strong>
                    <ul>
                      <li>實作 <a href="/n8n-with-cloudflare-turnstile-CAPTCHA/">安全驗證機制</a></li>
                      <li>優化工作流程效能</li>
                      <li>建立監控和日誌系統</li>
                    </ul>
                  </div>
                  <div class="step">
                    <strong>第 9 步：團隊協作與部署</strong>
                    <ul>
                      <li>建立可重用的工作流程模板</li>
                      <li>實作企業級部署策略</li>
                      <li>建立團隊開發標準</li>
                    </ul>
                  </div>
                </div>
                <div class="milestone">
                  <strong>🎯 階段目標：</strong>能夠獨立設計和部署企業級自動化解決方案
                </div>
              </div>
            </div>
          </div>

          <div class="learning-tips">
            <h3>💡 學習成功關鍵提醒</h3>
            <div class="tips-grid">
              <div class="tip-card">
                <h4>🎯 邊學邊做</h4>
                <p>每學會一個新節點，立刻找個實際場景來應用。我發現這樣學習效果比純理論學習好 3 倍以上。</p>
              </div>
              <div class="tip-card">
                <h4>🔄 版本更新</h4>
                <p>n8n 每月都有新功能更新，追蹤 <a href="/n8n-update-log/">官方更新日誌</a>，保持技能與時俱進。</p>
              </div>
              <div class="tip-card">
                <h4>🤝 社群學習</h4>
                <p>加入 n8n 官方社群和中文社群，實際問題都能快速找到解答和靈感。</p>
              </div>
              <div class="tip-card">
                <h4>📝 記錄筆記</h4>
                <p>建立自己的 n8n 知識庫，記錄常用的節點設定和解決方案，避免重複踩坑。</p>
              </div>
            </div>
          </div>

          <div class="learning-resources">
            <h3>📚 推薦學習資源</h3>
            <div class="resource-categories">
              <div class="resource-category">
                <h4>📖 官方文檔</h4>
                <ul>
                  <li><a href="https://docs.n8n.io/" target="_blank" rel="noopener">n8n 官方文檔</a> - 最權威的技術參考</li>
                  <li><a href="https://community.n8n.io/" target="_blank" rel="noopener">n8n 社群討論</a> - 實戰問題解答</li>
                </ul>
              </div>
              <div class="resource-category">
                <h4>🎥 影片教學</h4>
                <ul>
                  <li>YouTube 上的 n8n 官方頻道</li>
                  <li>中文教學影片（推薦 HC AI說人話 頻道）</li>
                </ul>
              </div>
              <div class="resource-category">
                <h4>🛠️ 實戰模板</h4>
                <ul>
                  <li><a href="https://n8n.io/workflows/" target="_blank" rel="noopener">官方工作流程模板</a></li>
                  <li>本站提供的實戰案例和模板下載</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="time-investment">
            <h3>⏰ 學習時間投資建議</h3>
            <div class="time-breakdown">
              <div class="time-option">
                <h4>🚀 快速入門 (每週 3-5 小時)</h4>
                <p><strong>6-8 週達到實用水準</strong><br>
                適合有程式背景或 API 使用經驗的用戶，重點學習 n8n 特有功能和最佳實踐。</p>
              </div>
              <div class="time-option">
                <h4>📈 穩健學習 (每週 2-3 小時)</h4>
                <p><strong>10-12 週達到實用水準</strong><br>
                適合完全新手，循序漸進掌握自動化概念和實作技巧，建立紮實基礎。</p>
              </div>
              <div class="time-option">
                <h4>🎯 專精發展 (每週 5+ 小時)</h4>
                <p><strong>4-6 個月成為專家</strong><br>
                深度學習進階功能，能夠設計複雜的企業級自動化解決方案。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {% for section in sections %}
        {{ renderSection(section.id, section.title) }}
      {% endfor %}
      
      <section id="tutorials" class="n8n-section">
        <h2>推薦外部教學文件</h2>
        <div class="n8n-tutorials">
          {% for tutorial in tutorials %}
            <article class="n8n-tutorial-card">
              <div class="n8n-tutorial-image" style="--bg-image: url('{{ tutorial.image }}');">
                <a href="{{ tutorial.link }}" class="n8n-tutorial-image-link" target="_blank" rel="noopener"
                   onclick="trackClick('{{ tutorial.link }}', '{{ tutorial.title }}', '{{ tutorial.author }}', 'external')">
                  <img src="{{ tutorial.image }}" 
                       alt="{{ tutorial.title }} - 由{{ tutorial.author }}提供的n8n教學" 
                       loading="lazy"
                       decoding="async"
                       width="400" height="225">
                </a>
              </div>
              <div class="n8n-tutorial-info">
                <a href="{{ tutorial.link }}" class="n8n-tutorial-title-link" target="_blank" rel="noopener"
                   onclick="trackClick('{{ tutorial.link }}', '{{ tutorial.title }}', '{{ tutorial.author }}', 'external')">
                  <h3>{{ tutorial.title }}</h3>
                </a>
                <div class="n8n-tutorial-content-wrapper">
                  <div class="n8n-tutorial-meta">
                    <a href="{{ tutorial.authorLink }}" class="n8n-tutorial-author" target="_blank" rel="noopener"
                       onclick="trackClick('{{ tutorial.authorLink }}', '{{ tutorial.author }}', '{{ tutorial.author }}', 'author')">
                      {{ tutorial.author }}
                    </a>
                  </div>
                  <p>{{ tutorial.description }}</p>
                </div>
              </div>
            </article>
          {% endfor %}
        </div>
      </section>

      <!-- n8n 常見問題 FAQ -->
      <section id="faq" class="n8n-section">
        <h2>❓ n8n 常見問題 FAQ</h2>
        
        <div class="n8n-faq">
          <div class="faq-intro">
            <p>收集了新手學習 n8n 時最常遇到的問題，以及我自己實測過程中踩過的坑。這些答案都來自實際使用經驗，幫助你快速解決學習路上的困惑。</p>
          </div>
          
          <div class="faq-container">
            <div class="faq-category">
              <h3>🚀 入門基礎</h3>
              
              <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                <button class="faq-question" type="button" aria-expanded="false">
                  <span itemprop="name">n8n 是什麼？適合什麼樣的用戶使用？</span>
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" itemscope itemtype="https://schema.org/Answer">
                  <div itemprop="text">
                    <p>n8n 是一個開源的工作流程自動化工具，讓你可以用視覺化的方式連接不同的服務和 API。適合：</p>
                    <ul>
                      <li><strong>行銷人員</strong>：自動化客戶數據收集、郵件行銷、社群媒體管理</li>
                      <li><strong>小企業主</strong>：自動化訂單處理、客服回覆、資料同步</li>
                      <li><strong>開發者</strong>：快速建立 API 整合、資料處理流程</li>
                      <li><strong>個人用戶</strong>：自動化日常工作，如檔案備份、通知提醒</li>
                    </ul>
                    <p>我自己從完全不懂程式，也能在 2 週內建立實用的自動化流程。</p>
                  </div>
                </div>
              </div>

              <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                <button class="faq-question" type="button" aria-expanded="false">
                  <span itemprop="name">n8n 和 Zapier、Microsoft Power Automate 有什麼差別？</span>
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" itemscope itemtype="https://schema.org/Answer">
                  <div itemprop="text">
                    <table class="comparison-table">
                      <thead>
                        <tr>
                          <th>特色</th>
                          <th>n8n</th>
                          <th>Zapier</th>
                          <th>Power Automate</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>價格</td>
                          <td>開源免費，自部署無限額</td>
                          <td>月費制，有用量限制</td>
                          <td>與 Microsoft 365 綁定</td>
                        </tr>
                        <tr>
                          <td>自定義程度</td>
                          <td>高度客製化，可寫程式碼</td>
                          <td>模板化，較少客製</td>
                          <td>與微軟生態整合佳</td>
                        </tr>
                        <tr>
                          <td>學習門檻</td>
                          <td>中等，需要基本技術概念</td>
                          <td>低，但進階功能有限</td>
                          <td>中等，適合微軟用戶</td>
                        </tr>
                        <tr>
                          <td>適用場景</td>
                          <td>複雜工作流程、開發者</td>
                          <td>簡單自動化、非技術用戶</td>
                          <td>企業、微軟環境</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                <button class="faq-question" type="button" aria-expanded="false">
                  <span itemprop="name">我完全沒有程式背景，能學會 n8n 嗎？</span>
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" itemscope itemtype="https://schema.org/Answer">
                  <div itemprop="text">
                    <p>絕對可以！我看過很多非技術背景的用戶成功使用 n8n：</p>
                    <ul>
                      <li><strong>視覺化介面</strong>：拖拉節點就能建立流程，不需要寫程式</li>
                      <li><strong>豐富模板</strong>：可以從現成的模板開始學習</li>
                      <li><strong>循序漸進</strong>：從簡單的 2-3 個節點開始，慢慢增加複雜度</li>
                      <li><strong>社群支援</strong>：活躍的中文社群可以提供協助</li>
                    </ul>
                    <p>建議跟著我們的 <a href="#learning-guide">學習路徑</a> 一步步來，大約 2-4 週就能建立實用的工作流程。</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="faq-category">
              <h3>🔧 技術問題</h3>
              
              <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                <button class="faq-question" type="button" aria-expanded="false">
                  <span itemprop="name">n8n 應該選擇雲端版還是自部署？</span>
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" itemscope itemtype="https://schema.org/Answer">
                  <div itemprop="text">
                    <p><strong>雲端版 (n8n.cloud) 適合：</strong></p>
                    <ul>
                      <li>想要快速開始，不想處理技術設定</li>
                      <li>小型團隊或個人使用</li>
                      <li>不介意月費，重視穩定性</li>
                    </ul>
                    <p><strong>自部署適合：</strong></p>
                    <ul>
                      <li>想要完全控制和無限使用量</li>
                      <li>有基本的伺服器管理能力</li>
                      <li>處理敏感資料，需要資料自主權</li>
                      <li>長期大量使用，想節省成本</li>
                    </ul>
                    <p>我個人推薦先用雲端版學習，熟悉後再考慮自部署。詳細比較可看 <a href="/n8n-deployment/">部署指南</a>。</p>
                  </div>
                </div>
              </div>

              <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                <button class="faq-question" type="button" aria-expanded="false">
                  <span itemprop="name">工作流程執行失敗了，該如何除錯？</span>
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" itemscope itemtype="https://schema.org/Answer">
                  <div itemprop="text">
                    <p>這是新手最常遇到的問題，系統化的除錯方法：</p>
                    <ol>
                      <li><strong>檢查執行日誌</strong>：點擊失敗的節點，查看錯誤訊息</li>
                      <li><strong>逐節點測試</strong>：從前面的節點開始，一個一個單獨執行</li>
                      <li><strong>檢查資料格式</strong>：確認前一個節點的輸出格式符合下個節點的預期</li>
                      <li><strong>使用 Pin 功能</strong>：<a href="/n8n-tips-pin/">固定測試資料</a>，避免重複呼叫 API</li>
                      <li><strong>檢查憑證設定</strong>：確認 API 金鑰、OAuth 設定正確</li>
                    </ol>
                    <p>常見錯誤包括：API 額度用完、資料格式不符、網路連線問題、權限設定錯誤。</p>
                  </div>
                </div>
              </div>

              <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                <button class="faq-question" type="button" aria-expanded="false">
                  <span itemprop="name">n8n 有哪些限制？什麼情況下不適合使用？</span>
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" itemscope itemtype="https://schema.org/Answer">
                  <div itemprop="text">
                    <p><strong>技術限制：</strong></p>
                    <ul>
                      <li>不適合需要即時反應 (< 1秒) 的應用</li>
                      <li>大量資料處理時效能有限 (建議單次 < 10MB)</li>
                      <li>某些企業級功能需要付費版本</li>
                    </ul>
                    <p><strong>學習成本：</strong></p>
                    <ul>
                      <li>需要了解基本的 API 和 JSON 概念</li>
                      <li>複雜流程的設計需要邏輯思維</li>
                      <li>客製化功能可能需要程式技能</li>
                    </ul>
                    <p><strong>不適合的情況：</strong></p>
                    <ul>
                      <li>需要複雜的資料庫操作 (建議用專門工具)</li>
                      <li>高頻率交易或金融相關應用</li>
                      <li>需要圖形化處理或機器學習的重度運算</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="faq-category">
              <h3>💼 實際應用</h3>
              
              <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                <button class="faq-question" type="button" aria-expanded="false">
                  <span itemprop="name">n8n 能幫我自動化哪些工作？有實際案例嗎？</span>
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" itemscope itemtype="https://schema.org/Answer">
                  <div itemprop="text">
                    <p><strong>客戶服務自動化：</strong></p>
                    <ul>
                      <li><a href="/n8n-line-message-api/">LINE Bot 自動回覆</a>：處理常見問題，轉接人工客服</li>
                      <li><a href="/n8n-with-slack/">Slack 通知系統</a>：新訂單、客服反饋即時通知</li>
                      <li>客戶資料整合：CRM 自動更新客戶互動記錄</li>
                    </ul>
                    <p><strong>行銷自動化：</strong></p>
                    <ul>
                      <li><a href="/n8n-gmail-node/">郵件行銷</a>：根據用戶行為自動發送個人化郵件</li>
                      <li>社群媒體管理：定時發布內容，監控品牌提及</li>
                      <li>潛在客戶追蹤：表單填寫後自動分類、標籤</li>
                    </ul>
                    <p><strong>資料處理：</strong></p>
                    <ul>
                      <li>報表自動化：從各系統蒐集數據，產生日/週/月報</li>
                      <li><a href="/n8n-node-s3-with-cloudflare-r2/">檔案備份</a>：定時備份重要資料到雲端</li>
                      <li>資料同步：多平台間的庫存、價格同步</li>
                    </ul>
                    <p>我見過最成功的案例：一家 20 人的電商公司，用 n8n 把客服回應時間從 2 小時縮短到 5 分鐘，客戶滿意度提升 40%。</p>
                  </div>
                </div>
              </div>

              <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                <button class="faq-question" type="button" aria-expanded="false">
                  <span itemprop="name">學會 n8n 大概需要多少時間？成本多少？</span>
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" itemscope itemtype="https://schema.org/Answer">
                  <div itemprop="text">
                    <p><strong>學習時間（依背景而定）：</strong></p>
                    <ul>
                      <li><strong>有技術背景</strong>：1-2 週掌握基礎，1 個月達到熟練</li>
                      <li><strong>無技術背景</strong>：3-4 週掌握基礎，2-3 個月達到熟練</li>
                      <li><strong>深度應用</strong>：4-6 個月可以處理複雜的企業級流程</li>
                    </ul>
                    <p><strong>學習成本：</strong></p>
                    <ul>
                      <li><strong>時間投資</strong>：每週 3-5 小時練習</li>
                      <li><strong>軟體成本</strong>：自部署免費，雲端版 $20/月起</li>
                      <li><strong>學習資源</strong>：本站教學免費，官方文檔免費</li>
                      <li><strong>實驗成本</strong>：各 API 服務的免費額度通常夠練習</li>
                    </ul>
                    <p><strong>投資回報：</strong></p>
                    <p>以一個行銷專員為例，學會後每週可以節省 10-15 小時的重複性工作，相當於每月多了 40-60 小時的高價值工作時間。</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="faq-category">
              <h3>🛡️ 安全與注意事項</h3>
              
              <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                <button class="faq-question" type="button" aria-expanded="false">
                  <span itemprop="name">使用 n8n 處理敏感資料安全嗎？</span>
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" itemscope itemtype="https://schema.org/Answer">
                  <div itemprop="text">
                    <p><strong>雲端版安全性：</strong></p>
                    <ul>
                      <li>符合 SOC 2 Type II 認證</li>
                      <li>資料傳輸和儲存都有加密</li>
                      <li>定期安全稽核和滲透測試</li>
                      <li>但資料仍在第三方伺服器</li>
                    </ul>
                    <p><strong>自部署安全性：</strong></p>
                    <ul>
                      <li>完全控制資料存放位置</li>
                      <li>可配置 VPN、防火牆等安全措施</li>
                      <li>符合企業內部資安政策</li>
                      <li>但需要自己負責安全維護</li>
                    </ul>
                    <p><strong>最佳實踐建議：</strong></p>
                    <ul>
                      <li>敏感資料使用環境變數儲存</li>
                      <li>定期更新 API 金鑰</li>
                      <li>設定 IP 白名單限制存取</li>
                      <li>重要流程加入 <a href="/n8n-with-cloudflare-turnstile-CAPTCHA/">安全驗證</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="related-articles" class="n8n-section">
        <h2>📖 n8n 進階學習資源推薦</h2>
        
        <div class="related-intro">
          <p>完成基礎學習後，這些進階資源幫助你成為 n8n 自動化專家。每個主題都包含實戰案例和詳細教學，讓你的技能更上一層樓。</p>
        </div>

        <div class="n8n-related-categories">
          <div class="related-category">
            <h3>🚀 熱門節點教學</h3>
            <div class="related-articles-grid">
              <div class="n8n-related-card">
                <div class="card-icon">🤖</div>
                <h4><a href="/n8n-structured-output-parser-node/">n8n Structured Output Parser 節點教學</a></h4>
                <p>AI 輸出格式化完整指南，讓你的 AI workflow 更穩定可靠。5 分鐘搞定從隨機文字到結構化資料。</p>
                <span class="card-tag">最新</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">📧</div>
                <h4><a href="/n8n-gmail-node/">n8n Gmail 節點完整教學</a></h4>
                <p>Gmail 自動化處理完整指南，包含郵件發送、讀取、標籤管理等功能。實測分享企業級應用案例。</p>
                <span class="card-tag">實戰</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">💬</div>
                <h4><a href="/n8n-line-message-api/">n8n LINE Message API 教學</a></h4>
                <p>建立智慧 LINE Bot 的完整流程，從 API 設定到自動回覆機制，打造專業客服系統。</p>
                <span class="card-tag">熱門</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">🔊</div>
                <h4><a href="/n8n-elevenlabs-tts/">n8n ElevenLabs TTS 語音合成教學</a></h4>
                <p>整合 AI 語音合成服務，建立多語言語音通知系統。包含音質優化和成本控制技巧。</p>
                <span class="card-tag">AI</span>
              </div>
            </div>
          </div>

          <div class="related-category">
            <h3>🛠️ 進階技巧與最佳實踐</h3>
            <div class="related-articles-grid">
              <div class="n8n-related-card">
                <div class="card-icon">🔗</div>
                <h4><a href="/n8n-aggregate-split-out/">n8n 資料聚合與分割完整指南</a></h4>
                <p>掌握 Aggregate 和 Split Out 節點的進階應用，處理複雜資料結構和批量操作。</p>
                <span class="card-tag">進階</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">🔧</div>
                <h4><a href="/n8n-built-in-variables/">n8n 內建變數活用指南</a></h4>
                <p>深度解析 n8n 內建變數的使用方法，包含時間處理、資料索引、工作流程控制等技巧。</p>
                <span class="card-tag">技巧</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">📌</div>
                <h4><a href="/n8n-tips-pin/">n8n Pin 功能使用技巧</a></h4>
                <p>善用 Pin 功能提升開發效率，避免重複 API 呼叫，加速工作流程測試和除錯。</p>
                <span class="card-tag">效率</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">🔄</div>
                <h4><a href="/n8n-if-switch/">n8n 條件判斷：IF vs Switch 節點比較</a></h4>
                <p>深入比較 IF 和 Switch 節點的使用場景，掌握複雜邏輯分支的最佳實踐。</p>
                <span class="card-tag">邏輯</span>
              </div>
            </div>
          </div>

          <div class="related-category">
            <h3>🌐 整合與部署</h3>
            <div class="related-articles-grid">
              <div class="n8n-related-card">
                <div class="card-icon">☁️</div>
                <h4><a href="/n8n-node-s3-with-cloudflare-r2/">n8n + Cloudflare R2 雲端儲存整合</a></h4>
                <p>建立高效能檔案備份和同步系統，結合 S3 相容性和 Cloudflare 的全球 CDN 優勢。</p>
                <span class="card-tag">雲端</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">💼</div>
                <h4><a href="/n8n-with-slack/">n8n Slack 整合完整教學</a></h4>
                <p>打造團隊協作自動化流程，包含訊息發送、檔案分享、通知管理等企業級應用。</p>
                <span class="card-tag">團隊</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">🚀</div>
                <h4><a href="/n8n-deployment/">n8n 部署完整指南</a></h4>
                <p>從本地安裝到雲端部署的完整教學，包含 Docker、Zeabur、自建伺服器等多種方案。</p>
                <span class="card-tag">部署</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">🛡️</div>
                <h4><a href="/n8n-with-cloudflare-turnstile-CAPTCHA/">n8n 安全驗證機制建立</a></h4>
                <p>整合 Cloudflare Turnstile CAPTCHA，為你的自動化流程加入安全防護層。</p>
                <span class="card-tag">安全</span>
              </div>
            </div>
          </div>

          <div class="related-category">
            <h3>📈 實戰案例分享</h3>
            <div class="related-articles-grid">
              <div class="n8n-related-card">
                <div class="card-icon">💰</div>
                <h4><a href="/n8n-line-split-expense-workflow/">LINE 分帳機器人自動化流程</a></h4>
                <p>打造智慧分帳系統，自動計算費用分配和通知，解決團體消費記帳痛點。</p>
                <span class="card-tag">實用</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">🔍</div>
                <h4><a href="/n8n-perplexity-node/">n8n Perplexity AI 智能搜尋整合</a></h4>
                <p>結合 AI 搜尋引擎，建立智能問答系統和資訊自動收集工作流程。</p>
                <span class="card-tag">AI</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">⏰</div>
                <h4><a href="/n8n-with-zeabur-timezone-issue/">n8n 時區設定問題解決方案</a></h4>
                <p>解決 Zeabur 部署時區問題，確保定時任務準確執行，避免時間錯亂困擾。</p>
                <span class="card-tag">除錯</span>
              </div>
              <div class="n8n-related-card">
                <div class="card-icon">📊</div>
                <h4><a href="/n8n-update-log/">n8n 最新功能更新追蹤</a></h4>
                <p>持續追蹤 n8n 版本更新，第一時間掌握新功能和改進，保持技能領先。</p>
                <span class="card-tag">更新</span>
              </div>
            </div>
          </div>
        </div>

        <div class="learning-path-cta">
          <div class="cta-content">
            <h3>🎯 準備好開始你的 n8n 學習之旅了嗎？</h3>
            <p>從零基礎到專家級應用，這些資源將陪伴你每一步成長。建議按照 <a href="#learning-guide">學習路徑指南</a> 的順序進行，確保學習效果最佳化。</p>
            <div class="cta-buttons">
              <a href="#learning-guide" class="cta-btn primary">開始學習路徑</a>
              <a href="#faq" class="cta-btn secondary">查看常見問題</a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="n8n-section">
        <h2>相關連結</h2>
        <div class="n8n-about-content">
          <div class="n8n-external-links">
            <a href="https://n8n.io/" target="_blank" rel="noopener">官方網站</a>
            <a href="https://docs.n8n.io/" target="_blank" rel="noopener">官方文件</a>
            <a href="https://github.com/n8n-io/n8n" target="_blank" rel="noopener">GitHub</a>
          </div>
        </div>
      </section>

    </div>
  </div>
</main>

<footer class="n8n-footer">
  <p>&copy; {% if date %}{{ date(now, 'YYYY') }}{% else %}2023{% endif %} Darrell TW - n8n 教學文章 </p>
</footer>

<!-- DataLayer點擊追蹤函數 -->
<script>
  function trackClick(link, title, author, category) {
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': 'n8n_card_click',
        'link': link,
        'title': title,
        'author': author,
        'category': category
      });
    }
  }

  // 卡片懸停隨機動畫效果
  document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.n8n-tutorial-card');
    const animations = [
      'anim-border-pulse',
      'anim-border-glow',
      'anim-border-spin',
      'anim-border-marquee',
      'anim-border-spotlight',
      'anim-border-rainbow'
    ];
    
    cards.forEach(card => {
      let currentAnimation = '';
      
      card.addEventListener('mouseenter', function() {
        // 隨機選擇一個動畫效果
        const randomIndex = Math.floor(Math.random() * animations.length);
        currentAnimation = animations[randomIndex];
        
        // 移除所有動畫類，然後添加選中的動畫
        animations.forEach(anim => card.classList.remove(anim));
        card.classList.add(currentAnimation);
      });
      
      card.addEventListener('mouseleave', function() {
        // 在滑鼠離開時移除動畫
        if (currentAnimation) {
          card.classList.remove(currentAnimation);
          currentAnimation = '';
        }
      });
    });
  });

  // 確保點擊圖片區域也能導向文章連結
  document.addEventListener('DOMContentLoaded', function() {
    const tutorialImages = document.querySelectorAll('.n8n-tutorial-image');
    tutorialImages.forEach(image => {
      image.addEventListener('click', function(e) {
        // 獲取圖片容器內的連結
        const link = this.querySelector('a.n8n-tutorial-image-link');
        if (link) {
          const href = link.getAttribute('href');
          const target = link.getAttribute('target') || '_self';
          const onclick = link.getAttribute('onclick');
          if (onclick) {
            // 執行原本的onclick事件
            eval(onclick.replace('return false', ''));
          }
          window.open(href, target);
        }
      });
    });
  });

  // FAQ 折疊功能
  document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // 切換當前項目
        if (isExpanded) {
          this.setAttribute('aria-expanded', 'false');
          answer.setAttribute('data-expanded', 'false');
        } else {
          this.setAttribute('aria-expanded', 'true');
          answer.setAttribute('data-expanded', 'true');
        }
        
        // 追蹤 FAQ 點擊事件
        if (typeof dataLayer !== 'undefined') {
          dataLayer.push({
            'event': 'faq_click',
            'faq_question': this.querySelector('span[itemprop="name"]').textContent,
            'faq_action': isExpanded ? 'close' : 'open'
          });
        }
      });
    });
  });
</script>

<style>
  :root {
    --n8n-primary: #ff6d5a;
    --n8n-secondary: #20a0ff;
    --n8n-background: #1a1a1a;
    --n8n-text: #e0e0e0;
    --n8n-border: #333;
    --n8n-card-bg: #2a2a2a;
    --n8n-box-shadow: rgba(0, 0, 0, 0.3);
    --n8n-box-shadow-hover: rgba(0, 0, 0, 0.4);
    --n8n-date-color: #888;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    color: var(--n8n-text);
    background-color: var(--n8n-background);
    font-size: 16px;
  }

  .n8n-resources-header {
    background-color: var(--n8n-card-bg, #2a2a2a);
    padding: 25px 15px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  
  .n8n-header-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .n8n-resources-header h1 {
    margin: 0;
    color: var(--n8n-primary, #ff6d5a);
    font-size: 2.2rem;
  }
  
  .social-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  
  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #333;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border: 1px solid #444;
    color: #fff;
    transition: all 0.3s ease;
    text-decoration: none;
  }
  
  .social-button:hover {
    background: var(--n8n-primary, #ff6d5a);
    color: #fff;
    border-color: var(--n8n-primary, #ff6d5a);
    box-shadow: 0 4px 16px rgba(255,109,90,0.3);
    transform: translateY(-2px) scale(1.08);
  }
  
  .social-button svg {
    width: 22px;
    height: 22px;
    display: block;
  }
  
  @media (max-width: 768px) {
    .n8n-header-wrapper {
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    .n8n-resources-header h1 {
      font-size: 1.8rem;
      text-align: center;
    }
    
    .social-buttons {
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .n8n-resources-header {
      padding: 20px 10px;
    }
    
    .n8n-resources-header h1 {
      font-size: 1.6rem;
    }
    
    .social-button {
      width: 36px;
      height: 36px;
    }
    
    .social-button svg {
      width: 18px;
      height: 18px;
    }
  }

  .n8n-resources-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 15px;
  }

  .n8n-nav {
    background-color: var(--n8n-card-bg);
    border-radius: 8px;
    box-shadow: 0 2px 8px var(--n8n-box-shadow);
    margin-bottom: 20px;
    padding: 15px 10px;
    z-index: 100;
    width: 100%;
    box-sizing: border-box;
  }
  
  .n8n-nav-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    margin-bottom: 0;
    max-width: none;
  }
  
  .n8n-nav-fixed + .n8n-resources-content {
    margin-top: 70px;
  }

  .n8n-nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .n8n-nav a {
    text-decoration: none;
    color: var(--n8n-text);
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background-color 0.3s;
    white-space: nowrap;
    font-size: 16px;
    display: block;
  }

  .n8n-nav a:hover, .n8n-nav a.active {
    background-color: var(--n8n-primary);
    color: white;
  }

  .n8n-resources-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .n8n-main-content {
    background-color: var(--n8n-card-bg);
    border-radius: 8px;
    box-shadow: 0 2px 8px var(--n8n-box-shadow);
    padding: 20px 15px;
  }

  .n8n-section {
    margin-bottom: 40px;
    scroll-margin-top: 80px;
  }

  .n8n-section h2 {
    margin-top: 0;
    font-size: 1.8rem;
    color: var(--n8n-primary);
    border-bottom: 2px solid var(--n8n-border);
    padding-bottom: 10px;
    margin-bottom: 25px;
  }

  .n8n-articles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  @media (min-width: 1200px) {
    .n8n-articles {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 18px;
    }
  }

  @media (max-width: 1100px) {
    .n8n-articles {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
    
    .n8n-resources-header h1 {
      font-size: 1.9rem;
    }
    
    .n8n-section h2 {
      font-size: 1.6rem;
    }
  }

  @media (max-width: 768px) {
    .n8n-resources-header h1 {
      font-size: 1.7rem;
    }
    
    body {
      font-size: 15px;
    }
  
    .n8n-nav {
      padding: 10px 5px;
    }
    
    .n8n-nav ul {
      gap: 8px;
    }
    
    .n8n-nav a {
      padding: 7px 10px;
      font-size: 15px;
    }
    
    .n8n-articles {
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 15px;
    }
    
    .n8n-section {
      margin-bottom: 30px;
    }
    
    .n8n-section h2 {
      font-size: 1.4rem;
      margin-bottom: 20px;
    }
    
    .n8n-main-content {
      padding: 15px 12px;
    }
  }
  
  @media (max-width: 480px) {
    .n8n-resources-header {
      padding: 20px 10px;
    }
    
    .n8n-resources-header h1 {
      font-size: 1.5rem;
    }
    
    .n8n-resources-container {
      padding: 0;
    }
    
    .n8n-main-content {
      border-radius: 0;
    }
    
    .n8n-articles {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      max-width: none;
      margin: 0;
    }
    
    .n8n-article-card {
      max-width: none;
    }
    
    .n8n-nav a {
      font-size: 14px;
      padding: 6px 8px;
    }
    
    .n8n-section h2 {
      font-size: 1.3rem;
    }
    
    .n8n-article-info {
      padding: 10px;
    }
    
    .n8n-article-info h3 {
      font-size: 0.95rem;
      margin-bottom: 8px;
    }
    
    .n8n-article-info p {
      font-size: 0.8rem;
      -webkit-line-clamp: 2;
    }
  }

  .n8n-article-card {
    border-radius: 8px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
    height: 100%;
    position: relative;
    max-width: 320px;
    margin: 0 auto;
  }

  .n8n-article-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px var(--n8n-box-shadow-hover);
  }

  .n8n-article-link {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: var(--n8n-text);
  }

  .n8n-article-image {
    position: relative;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.2);
    padding-top: 100%; /* 1:1 正方形比例 */
    width: 100%;
  }

  .n8n-article-image::before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    filter: blur(15px) brightness(0.4);
    z-index: 1;
  }

  .n8n-article-image img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 85%;
    max-height: 85%;
    width: auto;
    height: auto;
    object-fit: contain;
    z-index: 2;
    border-radius: 3px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
    transition: transform 0.5s;
  }

  .n8n-article-card:hover .n8n-article-image img {
    transform: translate(-50%, -50%) scale(1.05);
  }

  .n8n-article-info {
    padding: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .n8n-article-date {
    position: absolute;
    bottom: 15px;
    right: 15px;
    background-color: var(--n8n-primary);
    color: white;
    font-size: 1rem;
    padding: 4px 10px;
    border-radius: 4px;
    z-index: 2;
  }

  .n8n-article-info h3 {
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 1.2rem;
    line-height: 1.4;
    color: var(--n8n-text);
  }

  .n8n-article-info p {
    margin: 0 0 12px;
    color: var(--n8n-text);
    opacity: 0.8;
    font-size: 0.9rem;
    line-height: 1.5;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  
  .n8n-about-content { 
    line-height: 1.6; 
    text-align: center;
  }
  
  .n8n-external-links {
    margin: 20px 0;
    display: flex; 
    justify-content: center;
    flex-wrap: wrap; 
    gap: 15px;
  }
  
  .n8n-external-links a {
    background-color: var(--n8n-secondary); 
    color: white;
    padding: 10px 18px; 
    border-radius: 4px; 
    text-decoration: none;
    transition: background-color .3s;
    font-size: 1rem;
  }
  
  .n8n-external-links a:hover { 
    background-color: var(--n8n-primary); 
  }
  
  /* 相關文章推薦樣式 */
  .n8n-related-articles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }
  
  .n8n-related-card {
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--n8n-border);
    border-radius: 8px;
    padding: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  
  .n8n-related-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--n8n-box-shadow-hover);
    border-color: var(--n8n-primary);
  }
  
  .n8n-related-card h3 {
    margin: 0 0 10px 0;
    font-size: 1.1rem;
    line-height: 1.4;
  }
  
  .n8n-related-card h3 a {
    color: var(--n8n-primary);
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .n8n-related-card h3 a:hover {
    color: var(--n8n-secondary);
    text-decoration: underline;
  }
  
  .n8n-related-card p {
    margin: 0;
    color: var(--n8n-text);
    opacity: 0.8;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    .n8n-related-articles {
      grid-template-columns: 1fr;
      gap: 15px;
    }
    
    .n8n-related-card {
      padding: 15px;
    }
  }
  
  .n8n-footer {
    text-align: center;
    padding: 20px;
    margin-top: 40px;
    background-color: var(--n8n-card-bg);
    color: var(--n8n-text);
  }
  
  @media (max-width: 480px) {
    .n8n-external-links a {
      padding: 8px 15px;
      font-size: 0.9rem;
    }
    
    .n8n-article-info h3 {
      font-size: 1.1rem;
    }
    
    .n8n-article-info p {
      font-size: 0.85rem;
    }
    
    .n8n-footer {
      padding: 15px 10px;
      font-size: 0.9rem;
    }
  }

  /* 教學卡片樣式 */
  .n8n-tutorials {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (min-width: 1200px) {
    .n8n-tutorials {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  }
  
  @media (max-width: 1100px) {
    .n8n-tutorials {
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
  }
  
  @media (max-width: 900px) {
    .n8n-tutorials {
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
  }
  
  @media (max-width: 480px) {
    .n8n-tutorials {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }

  .n8n-tutorial-card {
    border-radius: 8px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    width: 100%;
    position: relative;
    border: 1px solid var(--n8n-border);
    user-select: none;
    display: flex;
    flex-direction: column;
  }

  .n8n-tutorial-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px var(--n8n-box-shadow-hover);
    border-color: var(--n8n-primary);
  }

  .n8n-tutorial-image {
    position: relative;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.2);
    padding-top: 56.25%; /* 16:9 比例 */
    width: 100%;
    cursor: pointer;
    flex-shrink: 0;
  }

  .n8n-tutorial-image-link {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    text-decoration: none;
    z-index: 10;
  }

  .n8n-tutorial-image::before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    filter: blur(15px) brightness(0.4);
    z-index: 1;
  }

  .n8n-tutorial-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 2;
    border-radius: 3px;
    transition: transform 0.5s;
    pointer-events: none;
  }

  .n8n-tutorial-card:hover .n8n-tutorial-image img {
    transform: scale(1.1);
  }

  .n8n-tutorial-info {
    padding: 15px;
    display: flex;
    flex-direction: column;
    position: relative;
    flex-grow: 1;
    justify-content: space-between;
    min-height: 180px;
  }

  .n8n-tutorial-title-link {
    text-decoration: none;
    color: var(--n8n-text);
    cursor: pointer;
    display: block;
    margin-bottom: 10px;
  }

  .n8n-tutorial-info h3 {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1.1rem;
    line-height: 1.4;
    color: var(--n8n-text);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 3.1em;
  }

  .n8n-tutorial-content-wrapper {
    margin-top: auto;
  }

  .n8n-tutorial-meta {
    margin-bottom: 8px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    height: 20px; /* 固定作者區域高度 */
  }

  .n8n-tutorial-author {
    position: relative;
    padding-left: 20px;
    color: var(--n8n-secondary);
    text-decoration: none;
    display: inline-block;
    z-index: 3;
    cursor: pointer;
  }
  
  .n8n-tutorial-author:hover {
    color: var(--n8n-secondary);
    text-decoration: none;
  }

  .n8n-tutorial-author:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2320a0ff'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  .n8n-tutorial-info p {
    margin: 0;
    color: var(--n8n-text);
    opacity: 0.8;
    font-size: 0.9rem;
    line-height: 1.5;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    height: 4.5em; /* 固定三行的高度 = 行高 * 3 */
  }
  
  @media (max-width: 480px) {
    .n8n-tutorials {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .n8n-tutorial-info {
      padding: 12px;
      min-height: 140px;
    }
    
    .n8n-tutorial-info h3 {
      font-size: 0.9rem;
      margin-bottom: 0;
      -webkit-line-clamp: 2;
      max-height: 2.5em;
    }
    
    .n8n-tutorial-info p {
      font-size: 0.8rem;
      -webkit-line-clamp: 2;
      height: 3em;
    }
    
    .n8n-tutorial-meta {
      font-size: 0.75rem;
      height: 18px;
    }
    
    .n8n-tutorial-title-link {
      margin-bottom: 8px;
    }
  }

  /* 共享的圖片容器模糊背景效果 */
  .n8n-article-image,
  .n8n-tutorial-image {
    position: relative;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.2);
    padding-top: 100%; /* 1:1 正方形比例 */
    width: 100%;
  }

  .n8n-article-image::before,
  .n8n-tutorial-image::before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    filter: blur(15px) brightness(0.4);
    z-index: 1;
  }

  .n8n-article-image img,
  .n8n-tutorial-image img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 85%;
    max-height: 85%;
    width: auto;
    height: auto;
    object-fit: contain;
    z-index: 2;
    border-radius: 3px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
    transition: transform 0.5s;
  }

  .n8n-article-card:hover .n8n-article-image img,
  .n8n-tutorial-card:hover .n8n-tutorial-image img {
    transform: translate(-50%, -50%) scale(1.05);
  }

  /* Algolia 搜尋相關樣式 - 暫時關閉
  .n8n-search-container {
    margin: 20px auto 0;
    max-width: 600px;
    position: relative;
  }
  
  /* InstantSearch 搜尋框樣式 */
  .algolia-searchbox-root {
    margin-bottom: 15px;
  }
  
  .algolia-searchbox-input {
    width: 100%;
    padding: 12px 15px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--n8n-text);
    outline: none;
    transition: all 0.3s;
  }
  
  .algolia-searchbox-input:focus {
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 2px var(--n8n-primary);
  }
  
  /* 搜尋按鈕樣式 */
  .algolia-searchbox-submit, 
  .algolia-searchbox-reset {
    appearance: none;
    background: none;
    border: 0;
    cursor: pointer;
    color: var(--n8n-text);
  }
  
  .algolia-searchbox-submit:hover, 
  .algolia-searchbox-reset:hover {
    color: var(--n8n-primary);
  }
  
  /* 搜尋結果容器 */
  #algolia-hits {
    background-color: var(--n8n-card-bg);
    border-radius: 6px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    margin-top: 5px;
  }
  
  /* 搜尋結果項目 */
  .algolia-hit {
    padding: 12px 15px;
    border-bottom: 1px solid var(--n8n-border);
    transition: background-color 0.2s;
  }
  
  .algolia-hit:last-child {
    border-bottom: none;
  }
  
  .algolia-hit:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .algolia-hit a {
    color: var(--n8n-text);
    text-decoration: none;
    display: block;
  }
  
  .algolia-hit-title {
    font-weight: 500;
    margin-bottom: 5px;
  }
  
  .algolia-hit-title em,
  .algolia-hit-snippet em {
    color: var(--n8n-primary);
    font-style: normal;
    font-weight: 700;
    background-color: rgba(255, 109, 90, 0.1);
    padding: 1px 2px;
  }
  
  .algolia-hit-snippet {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  /* 空結果與統計 */
  .algolia-empty {
    padding: 20px;
    text-align: center;
    color: #999;
  }
  
  .algolia-stats {
    padding: 8px 15px;
    font-size: 0.85rem;
    color: #999;
    border-top: 1px solid var(--n8n-border);
  }
  
  .algolia-powered {
    display: flex;
    justify-content: flex-end;
    padding: 5px 10px;
    font-size: 12px;
    color: #999;
    border-top: 1px solid var(--n8n-border);
  }
  
  .algolia-powered a {
    color: var(--n8n-secondary);
    text-decoration: none;
    display: flex;
    align-items: center;
  }
  
  .algolia-powered img {
    height: 15px;
    margin-left: 5px;
  }
  
  /* 針對行動裝置的樣式 */
  @media (max-width: 768px) {
    .n8n-search-container {
      max-width: 90%;
    }
    
    .algolia-searchbox-input {
      font-size: 15px;
      padding: 10px 12px;
    }
  }
  */

  .n8n-search-container {
    /* 保留基本容器樣式 */
    margin: 20px auto 0;
    max-width: 600px;
    position: relative;
  }

  /* 卡片懸停動畫效果 */
  @keyframes border-pulse {
    0% { box-shadow: 0 0 0 1px var(--n8n-border); border-color: transparent; }
    50% { box-shadow: 0 0 0 3px var(--n8n-primary); border-color: transparent; }
    100% { box-shadow: 0 0 0 1px var(--n8n-border); border-color: transparent; }
  }
  
  @keyframes border-glow {
    0% { box-shadow: 0 0 0 rgba(255, 109, 90, 0), 0 0 0 rgba(32, 160, 255, 0); border-color: var(--n8n-border); }
    50% { box-shadow: 0 0 15px rgba(255, 109, 90, 0.7), 0 0 15px rgba(32, 160, 255, 0); border-color: var(--n8n-primary); }
    100% { box-shadow: 0 0 0 rgba(255, 109, 90, 0), 0 0 0 rgba(32, 160, 255, 0); border-color: var(--n8n-border); }
  }
  
  @keyframes border-spin {
    0% { background: linear-gradient(0deg, transparent 0%, var(--n8n-primary) 50%, transparent 100%) border-box; border: 2px solid transparent; }
    100% { background: linear-gradient(360deg, transparent 0%, var(--n8n-primary) 50%, transparent 100%) border-box; border: 2px solid transparent; }
  }
  
  @keyframes border-marquee {
    0% { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  }
  
  @keyframes border-spotlight {
    0% { background-position: -100% 0%; }
    100% { background-position: 200% 0%; }
  }
  
  @keyframes border-rainbow {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }

  .n8n-tutorial-card {
    border-radius: 8px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    width: 100%;
    position: relative;
    border: 1px solid var(--n8n-border);
    user-select: none;
    display: flex;
    flex-direction: column;
  }

  .n8n-tutorial-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px var(--n8n-box-shadow-hover);
    border-color: var(--n8n-primary);
  }
  
  /* 使用JavaScript為每個卡片添加隨機動畫類 */
  .anim-border-pulse { animation: border-pulse 1.5s infinite; }
  
  .anim-border-glow { animation: border-glow 1.5s infinite; }
  
  .anim-border-spin { 
    animation: border-spin 4s linear infinite; 
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  
  .anim-border-marquee { 
    border: 2px solid transparent;
    background: linear-gradient(90deg, 
      rgba(150, 50, 40, 0.9) 25%, 
      rgba(20, 80, 120, 0.9) 50%, 
      rgba(150, 50, 40, 0.9) 75%) 0 0 / 200% 100%;
    animation: border-marquee 3s linear infinite;
    background-clip: border-box;
  }
  
  .anim-border-spotlight { 
    border: 2px solid transparent;
    background: linear-gradient(90deg, 
      rgba(10, 10, 10, 0.95), 
      rgba(150, 50, 40, 0.9), 
      rgba(10, 10, 10, 0.95)) 0 0 / 200% 100%;
    animation: border-spotlight 2.5s infinite;
    background-clip: border-box;
  }
  
  .anim-border-rainbow { 
    border: 2px solid transparent;
    background: linear-gradient(90deg, 
      rgba(120, 30, 30, 0.9), 
      rgba(120, 80, 0, 0.9), 
      rgba(0, 80, 0, 0.9), 
      rgba(0, 60, 100, 0.9), 
      rgba(70, 0, 80, 0.9), 
      rgba(120, 30, 30, 0.9)) 0 0 / 400% 100%;
    animation: border-rainbow 3s infinite linear;
    background-clip: border-box;
  }

  /* Header 樣式 - 深色主題適配 */
.n8n-resources-header {
  background-color: var(--n8n-card-bg, #2a2a2a);
  padding: 25px 15px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.n8n-header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.n8n-resources-header h1 {
  margin: 0;
  color: var(--n8n-primary, #ff6d5a);
  font-size: 2.2rem;
}

.social-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #333;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border: 1px solid #444;
  color: #fff;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-button:hover {
  background: var(--n8n-primary, #ff6d5a);
  color: #fff;
  border-color: var(--n8n-primary, #ff6d5a);
  box-shadow: 0 4px 16px rgba(255,109,90,0.3);
  transform: translateY(-2px) scale(1.08);
}

.social-button svg {
  width: 22px;
  height: 22px;
  display: block;
}

@media (max-width: 768px) {
  .n8n-header-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .n8n-resources-header h1 {
    font-size: 1.8rem;
    text-align: center;
  }
  
  .social-buttons {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .n8n-resources-header {
    padding: 20px 10px;
  }
  
  .n8n-resources-header h1 {
    font-size: 1.6rem;
  }
  
  .social-button {
    width: 36px;
    height: 36px;
  }
  
  .social-button svg {
    width: 18px;
    height: 18px;
  }
}

/* 成就展示區塊樣式 */
.achievements-banner {
  background: linear-gradient(135deg, rgba(255,109,90,0.15) 0%, rgba(32,160,255,0.15) 100%);
  border-radius: 16px;
  padding: 30px;
  margin: 25px 0;
  border: 2px solid rgba(255,109,90,0.2);
  text-align: center;
}

.achievement-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.stat-item {
  padding: 15px;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  border: 1px solid rgba(255,109,90,0.2);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--n8n-primary);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--n8n-text);
  opacity: 0.8;
}

.trust-indicators {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.trust-badge {
  background: var(--n8n-secondary);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.trust-badge:nth-child(2) {
  background: var(--n8n-primary);
}

.trust-badge:nth-child(3) {
  background: #28a745;
}

@media (max-width: 768px) {
  .achievements-banner {
    padding: 20px;
  }
  
  .achievement-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .trust-indicators {
    gap: 10px;
  }
  
  .trust-badge {
    font-size: 0.75rem;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .achievement-stats {
    grid-template-columns: 1fr;
  }
  
  .trust-indicators {
    flex-direction: column;
    align-items: center;
  }
  
  .trust-badge {
    width: fit-content;
  }
}

/* n8n 學習路徑樣式 */
.n8n-learning-path {
  margin: 25px 0;
}

.learning-intro {
  background: linear-gradient(135deg, rgba(255,109,90,0.1) 0%, rgba(32,160,255,0.1) 100%);
  border-left: 4px solid var(--n8n-primary);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  font-size: 1.1rem;
  line-height: 1.6;
}

.learning-stages {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 40px;
}

.stage-card {
  border-radius: 12px;
  padding: 25px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stage-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--n8n-primary), var(--n8n-secondary));
}

.stage-card.beginner {
  background: linear-gradient(135deg, rgba(76,175,80,0.05) 0%, rgba(76,175,80,0.1) 100%);
  border-color: rgba(76,175,80,0.2);
}

.stage-card.intermediate {
  background: linear-gradient(135deg, rgba(255,193,7,0.05) 0%, rgba(255,193,7,0.1) 100%);
  border-color: rgba(255,193,7,0.2);
}

.stage-card.expert {
  background: linear-gradient(135deg, rgba(156,39,176,0.05) 0%, rgba(156,39,176,0.1) 100%);
  border-color: rgba(156,39,176,0.2);
}

.stage-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.stage-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--n8n-primary);
}

.stage-duration {
  background: rgba(255,109,90,0.1);
  color: var(--n8n-primary);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.stage-content h4 {
  color: var(--n8n-secondary);
  margin: 0 0 20px 0;
  font-size: 1.2rem;
}

.learning-steps {
  margin-bottom: 20px;
}

.step {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0,0,0,0.05);
  border-radius: 8px;
  border-left: 3px solid var(--n8n-secondary);
}

.step strong {
  display: block;
  color: var(--n8n-text);
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.step ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.step li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.step a {
  color: var(--n8n-secondary);
  text-decoration: none;
  font-weight: 500;
}

.step a:hover {
  color: var(--n8n-primary);
  text-decoration: underline;
}

.milestone {
  background: linear-gradient(90deg, rgba(255,109,90,0.1), rgba(32,160,255,0.1));
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(255,109,90,0.2);
  font-weight: 500;
}

.learning-tips {
  margin: 40px 0;
}

.learning-tips h3 {
  color: var(--n8n-primary);
  margin-bottom: 20px;
  font-size: 1.4rem;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.tip-card {
  background: rgba(0,0,0,0.05);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255,109,90,0.1);
  transition: all 0.3s ease;
}

.tip-card:hover {
  transform: translateY(-2px);
  border-color: var(--n8n-primary);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.tip-card h4 {
  color: var(--n8n-secondary);
  margin: 0 0 10px 0;
  font-size: 1.1rem;
}

.tip-card p {
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.tip-card a {
  color: var(--n8n-secondary);
  text-decoration: none;
}

.tip-card a:hover {
  color: var(--n8n-primary);
  text-decoration: underline;
}

.learning-resources {
  margin: 40px 0;
}

.learning-resources h3 {
  color: var(--n8n-primary);
  margin-bottom: 20px;
  font-size: 1.4rem;
}

.resource-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.resource-category {
  background: rgba(32,160,255,0.05);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(32,160,255,0.1);
}

.resource-category h4 {
  color: var(--n8n-secondary);
  margin: 0 0 15px 0;
  font-size: 1.1rem;
}

.resource-category ul {
  margin: 0;
  padding-left: 20px;
}

.resource-category li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.resource-category a {
  color: var(--n8n-text);
  text-decoration: none;
}

.resource-category a:hover {
  color: var(--n8n-primary);
  text-decoration: underline;
}

.time-investment {
  margin: 40px 0;
}

.time-investment h3 {
  color: var(--n8n-primary);
  margin-bottom: 20px;
  font-size: 1.4rem;
}

.time-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.time-option {
  background: linear-gradient(135deg, rgba(255,109,90,0.03) 0%, rgba(32,160,255,0.03) 100%);
  padding: 25px;
  border-radius: 12px;
  border: 2px solid rgba(255,109,90,0.1);
  transition: all 0.3s ease;
}

.time-option:hover {
  border-color: var(--n8n-primary);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.time-option h4 {
  color: var(--n8n-secondary);
  margin: 0 0 15px 0;
  font-size: 1.2rem;
}

.time-option p {
  margin: 0;
  line-height: 1.6;
}

.time-option strong {
  color: var(--n8n-primary);
  display: block;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .learning-stages {
    gap: 20px;
  }
  
  .stage-card {
    padding: 20px;
  }
  
  .stage-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stage-header h3 {
    font-size: 1.3rem;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .resource-categories {
    grid-template-columns: 1fr;
  }
  
  .time-breakdown {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .learning-intro {
    padding: 15px;
    font-size: 1rem;
  }
  
  .stage-card {
    padding: 15px;
  }
  
  .stage-header h3 {
    font-size: 1.2rem;
  }
  
  .step {
    padding: 12px;
  }
  
  .tip-card, .time-option {
    padding: 15px;
  }
}

/* FAQ 樣式 */
.n8n-faq {
  margin: 25px 0;
}

.faq-intro {
  background: linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(255,109,90,0.1) 100%);
  border-left: 4px solid #ffc107;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  font-size: 1.05rem;
  line-height: 1.6;
}

.faq-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.faq-category {
  background: rgba(0,0,0,0.03);
  border-radius: 12px;
  padding: 25px;
  border: 1px solid rgba(255,109,90,0.1);
}

.faq-category h3 {
  color: var(--n8n-primary);
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  border-bottom: 2px solid rgba(255,109,90,0.2);
  padding-bottom: 10px;
}

.faq-item {
  border: 1px solid rgba(255,109,90,0.1);
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: var(--n8n-primary);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.faq-question {
  width: 100%;
  background: linear-gradient(135deg, rgba(255,109,90,0.05) 0%, rgba(32,160,255,0.05) 100%);
  border: none;
  padding: 18px 20px;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--n8n-text);
  transition: all 0.3s ease;
  position: relative;
}

.faq-question:hover {
  background: linear-gradient(135deg, rgba(255,109,90,0.1) 0%, rgba(32,160,255,0.1) 100%);
}

.faq-question[aria-expanded="true"] {
  background: linear-gradient(135deg, rgba(255,109,90,0.15) 0%, rgba(32,160,255,0.15) 100%);
  border-bottom: 1px solid rgba(255,109,90,0.2);
}

.faq-icon {
  font-size: 1.5rem;
  color: var(--n8n-primary);
  font-weight: bold;
  transition: transform 0.3s ease;
  min-width: 24px;
  text-align: center;
}

.faq-question[aria-expanded="true"] .faq-icon {
  transform: rotate(45deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: rgba(255,255,255,0.02);
}

.faq-answer[data-expanded="true"] {
  max-height: 2000px;
}

.faq-answer > div {
  padding: 20px;
  border-top: 1px solid rgba(255,109,90,0.1);
}

.faq-answer p {
  margin: 0 0 15px 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.faq-answer ul, .faq-answer ol {
  margin: 10px 0 15px 0;
  padding-left: 25px;
}

.faq-answer li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.faq-answer strong {
  color: var(--n8n-secondary);
  font-weight: 600;
}

.faq-answer a {
  color: var(--n8n-secondary);
  text-decoration: none;
  font-weight: 500;
}

.faq-answer a:hover {
  color: var(--n8n-primary);
  text-decoration: underline;
}

/* 比較表格樣式 */
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  font-size: 0.9rem;
  background: rgba(255,255,255,0.02);
  border-radius: 8px;
  overflow: hidden;
}

.comparison-table th {
  background: linear-gradient(135deg, var(--n8n-primary) 0%, var(--n8n-secondary) 100%);
  color: white;
  padding: 12px 10px;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
}

.comparison-table td {
  padding: 12px 10px;
  border-bottom: 1px solid rgba(255,109,90,0.1);
  vertical-align: top;
}

.comparison-table tr:hover {
  background: rgba(255,109,90,0.05);
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .faq-category {
    padding: 20px;
  }
  
  .faq-question {
    padding: 15px;
    font-size: 1rem;
  }
  
  .faq-answer > div {
    padding: 15px;
  }
  
  .comparison-table {
    font-size: 0.8rem;
  }
  
  .comparison-table th,
  .comparison-table td {
    padding: 8px 6px;
  }
}

@media (max-width: 480px) {
  .faq-intro {
    padding: 15px;
    font-size: 1rem;
  }
  
  .faq-category {
    padding: 15px;
  }
  
  .faq-question {
    padding: 12px;
    font-size: 0.95rem;
  }
  
  .faq-answer > div {
    padding: 12px;
  }
  
  .faq-icon {
    font-size: 1.3rem;
    min-width: 20px;
  }
  
  .comparison-table {
    font-size: 0.75rem;
  }
  
  .comparison-table th,
  .comparison-table td {
    padding: 6px 4px;
  }
}

/* 相關文章推薦樣式 */
.related-intro {
  background: linear-gradient(135deg, rgba(32,160,255,0.1) 0%, rgba(255,109,90,0.1) 100%);
  border-left: 4px solid var(--n8n-secondary);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  font-size: 1.05rem;
  line-height: 1.6;
}

.n8n-related-categories {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 40px;
}

.related-category {
  background: rgba(0,0,0,0.02);
  border-radius: 12px;
  padding: 30px;
  border: 1px solid rgba(32,160,255,0.1);
}

.related-category h3 {
  color: var(--n8n-secondary);
  margin: 0 0 25px 0;
  font-size: 1.4rem;
  border-bottom: 2px solid rgba(32,160,255,0.2);
  padding-bottom: 10px;
}

.related-articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.n8n-related-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(255,109,90,0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.n8n-related-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--n8n-primary), var(--n8n-secondary));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.n8n-related-card:hover {
  transform: translateY(-3px);
  border-color: var(--n8n-primary);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.n8n-related-card:hover::before {
  opacity: 1;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 15px;
  display: block;
}

.n8n-related-card h4 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  line-height: 1.4;
}

.n8n-related-card h4 a {
  color: var(--n8n-text);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.n8n-related-card h4 a:hover {
  color: var(--n8n-primary);
}

.n8n-related-card p {
  margin: 0 0 15px 0;
  color: var(--n8n-text);
  opacity: 0.85;
  font-size: 0.9rem;
  line-height: 1.5;
}

.card-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--n8n-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-tag:nth-child(even) {
  background: var(--n8n-secondary);
}

/* CTA 區塊樣式 */
.learning-path-cta {
  background: linear-gradient(135deg, rgba(255,109,90,0.1) 0%, rgba(32,160,255,0.1) 100%);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  border: 2px solid rgba(255,109,90,0.2);
  margin-top: 40px;
}

.cta-content h3 {
  color: var(--n8n-primary);
  margin: 0 0 15px 0;
  font-size: 1.5rem;
}

.cta-content p {
  margin: 0 0 25px 0;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--n8n-text);
  opacity: 0.9;
}

.cta-content a {
  color: var(--n8n-secondary);
  text-decoration: none;
  font-weight: 600;
}

.cta-content a:hover {
  color: var(--n8n-primary);
  text-decoration: underline;
}

.cta-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 140px;
  text-align: center;
}

.cta-btn.primary {
  background: var(--n8n-primary);
  color: white;
  border-color: var(--n8n-primary);
}

.cta-btn.primary:hover {
  background: transparent;
  color: var(--n8n-primary);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255,109,90,0.3);
}

.cta-btn.secondary {
  background: transparent;
  color: var(--n8n-secondary);
  border-color: var(--n8n-secondary);
}

.cta-btn.secondary:hover {
  background: var(--n8n-secondary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(32,160,255,0.3);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .related-category {
    padding: 20px;
  }
  
  .related-articles-grid {
    grid-template-columns: 1fr;
  }
  
  .learning-path-cta {
    padding: 25px;
  }
  
  .cta-content h3 {
    font-size: 1.3rem;
  }
  
  .cta-content p {
    font-size: 1rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .related-intro {
    padding: 15px;
    font-size: 1rem;
  }
  
  .related-category {
    padding: 15px;
  }
  
  .n8n-related-card {
    padding: 15px;
  }
  
  .card-icon {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  .n8n-related-card h4 {
    font-size: 1rem;
  }
  
  .n8n-related-card p {
    font-size: 0.85rem;
  }
  
  .card-tag {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
  
  .learning-path-cta {
    padding: 20px;
  }
  
  .cta-content h3 {
    font-size: 1.2rem;
  }
}

/* 麵包屑導航樣式 */
.n8n-breadcrumb {
  margin-bottom: 20px;
  padding: 0 15px;
}

.n8n-breadcrumb ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--n8n-text);
}

.n8n-breadcrumb li {
  display: flex;
  align-items: center;
}

.n8n-breadcrumb li:not(:last-child)::after {
  content: "›";
  margin: 0 8px;
  color: var(--n8n-date-color);
  font-size: 16px;
}

.n8n-breadcrumb a {
  color: var(--n8n-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.n8n-breadcrumb a:hover {
  color: var(--n8n-primary);
  text-decoration: underline;
}

.n8n-breadcrumb li:last-child {
  color: var(--n8n-date-color);
}

@media (max-width: 768px) {
  .n8n-breadcrumb {
    padding: 0 10px;
  }
  
  .n8n-breadcrumb ol {
    font-size: 13px;
  }
}
</style>
</body>
</html>