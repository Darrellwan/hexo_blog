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
  <title>{{ page.title }} - n8n資源中心 | 自動化工作流程工具</title>
  <meta name="description" content="{{ page.description or '探索n8n自動化工作流程工具的各種資源，包括節點介紹、使用技巧、模板分享、功能更新及部署設定指南。' }}">
  <meta name="keywords" content="n8n, 工作流程自動化, 自動化工具, 節點介紹, n8n模板, n8n部署">
  <link rel="canonical" href="{{ url_for(page.permalink) }}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ url_for(page.permalink) }}">
  <meta property="og:title" content="{{ page.title }} - n8n資源中心">
  <meta property="og:description" content="{{ page.description or '探索n8n自動化工作流程工具的各種資源，包括節點介紹、使用技巧、模板分享、功能更新及部署設定指南。' }}">
  <meta property="og:image" content="{{ get_n8n_post_thumbnail(page) or url_for('/gallery/n8n_resource_og.jpg') }}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="{{ url_for(page.permalink) }}">
  <meta name="twitter:title" content="{{ page.title }} - n8n資源中心">
  <meta name="twitter:description" content="{{ page.description or '探索n8n自動化工作流程工具的各種資源，包括節點介紹、使用技巧、模板分享、功能更新及部署設定指南。' }}">
  <meta name="twitter:image" content="{{ get_n8n_post_thumbnail(page) or url_for('/gallery/n8n_resource_og.jpg') }}">

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

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{{ page.title }} - n8n資源中心",
  "description": "{{ page.description or '探索n8n自動化工作流程工具的各種資源，包括節點介紹、使用技巧、模板分享、功能更新及部署設定指南。' }}",
  "publisher": {
    "@type": "Organization",
    "name": "n8n資源中心",
    "logo": {
      "@type": "ImageObject",
      "url": "{{ url_for('/gallery/n8n_resource_og.jpg') }}"
    }
  }
}
</script>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WRZDBFS"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<header class="n8n-resources-header">
  <h1>n8n教學文章</h1>
  <div class="n8n-search-container">
    <!-- Algolia 搜尋功能暫時關閉 
    <div id="algolia-search-box"></div>
    <div id="algolia-hits"></div>
    -->
  </div>
</header>

<main class="n8n-resources-container">
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
      title: "n8n 初學者完整指南 (2025)",
      link: "https://drive.google.com/file/d/10Txuls1-PgLdcYMGMl85MKljJP7CTngd/view",
      image: "/gallery/merfy_lee_n8n_doc.png",
      author: "mengfengl",
      authorLink: "https://www.threads.net/@mengfengl",
      description: "35頁完整的 n8n 新手指南！"
    }
  ] %}

  <nav class="n8n-nav" aria-label="主導航">
    <ul>
      <li><a href="/" class="active">首頁</a></li>
      {% for section in sections %}
        {% set list = get_n8n_posts_by_category(section.id) %}
        {% if list.length > 0 %}
        <li><a href="#{{ section.id }}">{{ section.title }}</a></li>
        {% endif %}
      {% endfor %}
      <li><a href="#tutorials">外部教學</a></li>
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
            {% if counter2 < 6 %}
              <article class="n8n-article-card">
                <a href="{{ url_for(post.path) }}" class="n8n-article-link" target="_blank" rel="noopener"
                   onclick="trackClick('{{ url_for(post.path) }}', '{{ post.title }}', 'Darrell TW', '{{ cid }}')">
                  <div class="n8n-article-image" style="--bg-image: url('{{ get_n8n_post_thumbnail(post) }}');">
                    <img src="{{ get_n8n_post_thumbnail(post) }}" alt="{{ post.title }} - n8n資源文章封面圖" loading="lazy">
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
                  <img src="{{ tutorial.image }}" alt="{{ tutorial.title }} - n8n教學" loading="lazy">
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
    background-color: var(--n8n-card-bg);
    padding: 25px 15px;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .n8n-resources-header h1 {
    margin: 0;
    color: var(--n8n-primary);
    font-size: 2.2rem;
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
</style>
</body>
</html>