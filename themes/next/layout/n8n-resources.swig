---
title: {{ page.title }}
date: {{ page.date }}
layout: false
---
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WRZDBFS')
</script>

<div class="n8n-resources-container">
  {% set sections = [
    { id: 'node-intro', title: 'n8n 節點介紹' },
    { id: 'tips', title: 'n8n 小撇步' },
    { id: 'templates', title: 'n8n 模板分享' },
    { id: 'updates', title: 'n8n 功能更新' },
    { id: 'deployment', title: 'n8n 部署與設定' }
  ] %}

  <nav class="n8n-nav">
    <ul>
      <li><a href="/" class="active">首頁</a></li>
      {% for section in sections %}
        {% set list = get_n8n_posts_by_category(section.id) %}
        {% if list.length > 0 %}
        <li><a href="#{{ section.id }}">{{ section.title }}</a></li>
        {% endif %}
      {% endfor %}
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
              <div class="n8n-article-card">
                <a href="{{ url_for(post.path) }}" class="n8n-article-link">
                  <div class="n8n-article-image">
                    <img src="{{ get_n8n_post_thumbnail(post) }}" alt="{{ post.title }}">
                  </div>
                  <div class="n8n-article-info">
                    {# <div class="n8n-article-date">{{ format_n8n_date(post.date) }}</div> #}
                    <h3>{{ post.title }}</h3>
                    <p>{{ get_n8n_post_description(post) }}</p>
                  </div>
                </a>
              </div>
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

      <section id="about" class="n8n-section">
        <h2>相關連結</h2>
        <div class="n8n-about-content">
          <div class="n8n-external-links">
            <a href="https://n8n.io/" target="_blank">官方網站</a>
            <a href="https://docs.n8n.io/" target="_blank">官方文件</a>
            <a href="https://github.com/n8n-io/n8n" target="_blank">GitHub</a>
          </div>
        </div>
      </section>

    </div>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
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
  }

  .n8n-resources-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .n8n-nav {
    background-color: var(--n8n-card-bg);
    border-radius: 8px;
    box-shadow: 0 2px 8px var(--n8n-box-shadow);
    margin-bottom: 20px;
    padding: 15px;
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
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .n8n-nav a {
    text-decoration: none;
    color: var(--n8n-text);
    font-weight: 500;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.3s;
    white-space: nowrap;
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
    padding: 20px;
  }

  .n8n-section {
    margin-bottom: 60px;
    scroll-margin-top: 80px;
  }

  .n8n-section h2 {
    margin-top: 0;
    font-size: 1.8rem;
    color: var(--n8n-primary);
    border-bottom: 2px solid var(--n8n-border);
    padding-bottom: 10px;
    margin-bottom: 30px;
  }

  .n8n-articles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
  }

  @media (max-width: 1100px) {
    .n8n-articles {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .n8n-nav ul {
      gap: 10px;
    }
    
    .n8n-articles {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
  }

  .n8n-article-card {
    border-radius: 8px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
    height: 100%;
    position: relative;
    max-width: 280px;
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
    padding-top: 100%; /* 改回 1:1 正方形 */
    width: 100%;
  }

  .n8n-article-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  .n8n-article-card:hover .n8n-article-image img {
    transform: scale(1.05);
  }

  .n8n-article-info {
    padding: 12px;
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
    margin-bottom: 8px;
    font-size: 1.1rem;
    line-height: 1.4;
    color: var(--n8n-text);
  }

  .n8n-article-info p {
    margin: 0 0 12px;
    color: var(--n8n-text);
    opacity: 0.8;
    font-size: 0.85rem;
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
    padding: 8px 15px; 
    border-radius: 4px; 
    text-decoration: none;
    transition: background-color .3s;
  }
  
  .n8n-external-links a:hover { 
    background-color: var(--n8n-primary); 
  }
</style>