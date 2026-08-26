/**
 * n8n-expert Animations Controller
 * 動畫控制器 - 處理所有動態動畫效果
 * 包含：Scroll Reveal, Parallax, Counter, Progress Bar
 */

(function() {
  'use strict';

  // ============================================
  // Scroll Reveal - 捲動顯示動畫
  // ============================================

  class ScrollReveal {
    constructor() {
      this.elements = [];
      this.init();
    }

    init() {
      // 檢查是否支援 IntersectionObserver
      if (!('IntersectionObserver' in window)) {
        // Fallback: 直接顯示所有元素
        this.fallback();
        return;
      }

      // 設定 Observer
      const options = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // 提早一點觸發
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // 只觸發一次後停止觀察
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      // 觀察所有 reveal 元素
      this.observe();
    }

    observe() {
      const revealElements = document.querySelectorAll(
        '.reveal, .reveal-fade-up, .reveal-fade-down, .reveal-fade-left, .reveal-fade-right, .reveal-scale, .timeline-step'
      );

      revealElements.forEach(el => {
        this.observer.observe(el);
      });
    }

    fallback() {
      // 不支援 IntersectionObserver 時直接顯示
      const revealElements = document.querySelectorAll('.reveal, [class*="reveal-"], .timeline-step');
      revealElements.forEach(el => {
        el.classList.add('active');
      });
    }
  }

  // ============================================
  // Parallax Scrolling - 視差捲動
  // ============================================

  class ParallaxController {
    constructor() {
      this.elements = [];
      this.ticking = false;
      this.init();
    }

    init() {
      // 找到所有 parallax 元素
      this.elements = document.querySelectorAll('[data-parallax]');

      if (this.elements.length === 0) return;

      // 綁定 scroll 事件
      window.addEventListener('scroll', () => {
        this.requestTick();
      }, { passive: true });

      // 初始計算
      this.update();
    }

    requestTick() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }

    update() {
      const scrolled = window.pageYOffset;

      this.elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }
  }

  // ============================================
  // Counter Animation - 數字計數動畫
  // ============================================

  class CounterAnimation {
    constructor() {
      this.counters = [];
      this.init();
    }

    init() {
      // 找到所有 count-up 元素
      const counterElements = document.querySelectorAll('.count-up');

      if (counterElements.length === 0) return;

      // 設定 Observer
      const options = {
        root: null,
        threshold: 0.5
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            this.animateCounter(entry.target);
            entry.target.dataset.counted = 'true';
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      counterElements.forEach(el => {
        this.observer.observe(el);
      });
    }

    animateCounter(element) {
      const target = parseInt(element.dataset.count || element.textContent);
      const duration = parseInt(element.dataset.duration) || 2000;
      const start = 0;
      const increment = target / (duration / 16); // 60fps

      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = this.formatNumber(target);
          clearInterval(timer);
        } else {
          element.textContent = this.formatNumber(Math.floor(current));
        }
      }, 16);
    }

    formatNumber(num) {
      // 千分位格式化
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  // ============================================
  // Reading Progress Bar - 閱讀進度條
  // ============================================

  class ReadingProgress {
    constructor() {
      this.progressBar = null;
      this.ticking = false;
      this.init();
    }

    init() {
      // 創建進度條
      this.progressBar = document.createElement('div');
      this.progressBar.className = 'reading-progress';
      this.progressBar.style.width = '0%';
      document.body.appendChild(this.progressBar);

      // 綁定 scroll 事件
      window.addEventListener('scroll', () => {
        this.requestTick();
      }, { passive: true });

      // 初始計算
      this.update();
    }

    requestTick() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }

    update() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

      this.progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
    }
  }

  // ============================================
  // Smooth Scroll - 平滑捲動 (錨點連結)
  // ============================================

  class SmoothScroll {
    constructor() {
      this.init();
    }

    init() {
      // 找到所有錨點連結
      const links = document.querySelectorAll('a[href^="#"]');

      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');

          // 忽略 # 和空連結
          if (href === '#' || href === '') return;

          const target = document.querySelector(href);

          if (target) {
            e.preventDefault();

            // 計算目標位置 (考慮 fixed header)
            const headerOffset = 80; // 調整此值以配合你的 header 高度
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  }

  // ============================================
  // Confetti Effect - 五彩紙屑效果
  // ============================================

  class ConfettiEffect {
    constructor() {
      this.colors = ['#ff6d5a', '#60a5fa', '#a78bfa', '#34d399', '#facc15'];
    }

    trigger(count = 50) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.createConfetti();
        }, i * 30);
      }
    }

    createConfetti() {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';

      // 隨機顏色
      confetti.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];

      // 隨機位置
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';

      // 隨機大小
      const size = Math.random() * 10 + 5;
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';

      // 隨機動畫時間
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

      document.body.appendChild(confetti);

      // 動畫結束後移除
      confetti.addEventListener('animationend', () => {
        confetti.remove();
      });
    }
  }

  // ============================================
  // FAQ Accordion - 常見問題折疊
  // ============================================

  class FAQAccordion {
    constructor() {
      this.maxOpen = 3; // 最多同時開啟數量
      this.openItems = [];
      this.init();
    }

    init() {
      const faqItems = document.querySelectorAll('.faq-item');

      faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        // 設定初始高度
        if (index < this.maxOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          this.openItems.push(item);
        }

        question.addEventListener('click', () => {
          this.toggleItem(item);
        });
      });
    }

    toggleItem(item) {
      const isOpen = item.classList.contains('open');
      const answer = item.querySelector('.faq-answer');

      if (isOpen) {
        // 關閉
        item.classList.remove('open');
        answer.style.maxHeight = '0';
        this.openItems = this.openItems.filter(i => i !== item);
      } else {
        // 如果已達上限，關閉最早開啟的
        if (this.openItems.length >= this.maxOpen) {
          const oldestItem = this.openItems.shift();
          oldestItem.classList.remove('open');
          oldestItem.querySelector('.faq-answer').style.maxHeight = '0';
        }

        // 開啟
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        this.openItems.push(item);
      }
    }
  }

  // ============================================
  // Typing Effect - 打字效果 (增強版)
  // ============================================

  class TypingEffect {
    constructor(element, options = {}) {
      this.element = element;
      this.text = element.textContent;
      this.speed = options.speed || 100;
      this.delay = options.delay || 0;

      this.element.textContent = '';
      this.element.style.borderRight = '3px solid #ff6d5a';

      setTimeout(() => {
        this.type();
      }, this.delay);
    }

    type() {
      let index = 0;
      const interval = setInterval(() => {
        if (index < this.text.length) {
          this.element.textContent += this.text[index];
          index++;
        } else {
          clearInterval(interval);
          // 打字完成後持續閃爍游標
          this.element.style.animation = 'blink-caret 0.75s step-end infinite';
        }
      }, this.speed);
    }
  }

  // ============================================
  // 初始化所有動畫
  // ============================================

  function initAnimations() {
    // Scroll Reveal
    new ScrollReveal();

    // Parallax (僅在非移動裝置啟用)
    if (window.innerWidth >= 768) {
      new ParallaxController();
    }

    // Counter Animation
    new CounterAnimation();

    // Reading Progress
    new ReadingProgress();

    // Smooth Scroll
    new SmoothScroll();

    // FAQ Accordion
    new FAQAccordion();

    // Typing Effect (針對特定元素)
    const typingElements = document.querySelectorAll('.typing-effect');
    typingElements.forEach((el, index) => {
      new TypingEffect(el, {
        speed: 100,
        delay: index * 500
      });
    });

    // 五彩紙屑實例 (綁定到 window 以便其他地方調用)
    window.confetti = new ConfettiEffect();
  }

  // DOM 載入完成後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

  // 導出到 window (方便其他腳本使用)
  window.AnimationUtils = {
    ScrollReveal,
    ParallaxController,
    CounterAnimation,
    ReadingProgress,
    SmoothScroll,
    ConfettiEffect,
    FAQAccordion,
    TypingEffect
  };

})();
