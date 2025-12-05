/**
 * n8n-expert Carousel Controller
 * 輪播控制器 - 處理 Testimonials 輪播功能
 * 支援自動播放、觸控滑動、鍵盤控制
 */

(function() {
  'use strict';

  class Carousel {
    constructor(element, options = {}) {
      this.carousel = element;
      this.track = element.querySelector('.testimonials-track') || element.querySelector('.carousel-track');
      this.slides = this.track ? Array.from(this.track.children) : [];

      if (this.slides.length === 0) {
        console.warn('Carousel: No slides found');
        return;
      }

      // 配置選項
      this.options = {
        autoPlay: options.autoPlay !== undefined ? options.autoPlay : true,
        interval: options.interval || 5000,
        transitionDuration: options.transitionDuration || 300,
        pauseOnHover: options.pauseOnHover !== undefined ? options.pauseOnHover : true,
        swipeThreshold: options.swipeThreshold || 50
      };

      // 狀態
      this.currentIndex = 0;
      this.isTransitioning = false;
      this.autoPlayTimer = null;
      this.touchStartX = 0;
      this.touchEndX = 0;

      // 初始化
      this.init();
    }

    init() {
      // 設定初始位置
      this.updateCarousel();

      // 創建控制按鈕
      this.createControls();

      // 創建指示點
      this.createDots();

      // 綁定事件
      this.bindEvents();

      // 啟動自動播放
      if (this.options.autoPlay) {
        this.startAutoPlay();
      }
    }

    createControls() {
      // 檢查是否已存在控制按鈕
      let controlsContainer = this.carousel.querySelector('.carousel-controls');

      if (!controlsContainer) {
        controlsContainer = document.createElement('div');
        controlsContainer.className = 'carousel-controls';
        this.carousel.appendChild(controlsContainer);
      }

      // 上一個按鈕
      if (!controlsContainer.querySelector('.carousel-btn-prev')) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn carousel-btn-prev';
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.setAttribute('aria-label', '上一個');
        controlsContainer.appendChild(prevBtn);

        prevBtn.addEventListener('click', () => this.prev());
      }

      // 指示點容器
      if (!controlsContainer.querySelector('.carousel-dots')) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        controlsContainer.appendChild(dotsContainer);
      }

      // 下一個按鈕
      if (!controlsContainer.querySelector('.carousel-btn-next')) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn carousel-btn-next';
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.setAttribute('aria-label', '下一個');
        controlsContainer.appendChild(nextBtn);

        nextBtn.addEventListener('click', () => this.next());
      }
    }

    createDots() {
      const dotsContainer = this.carousel.querySelector('.carousel-dots');

      if (!dotsContainer) return;

      // 清空現有點
      dotsContainer.innerHTML = '';

      // 創建指示點
      this.slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `跳到第 ${index + 1} 張`);

        if (index === this.currentIndex) {
          dot.classList.add('active');
        }

        dot.addEventListener('click', () => {
          this.goTo(index);
        });

        dotsContainer.appendChild(dot);
      });
    }

    bindEvents() {
      // 暫停/繼續播放 (hover)
      if (this.options.pauseOnHover) {
        this.carousel.addEventListener('mouseenter', () => {
          this.stopAutoPlay();
        });

        this.carousel.addEventListener('mouseleave', () => {
          if (this.options.autoPlay) {
            this.startAutoPlay();
          }
        });
      }

      // 觸控滑動
      this.track.addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].clientX;
      }, { passive: true });

      this.track.addEventListener('touchmove', (e) => {
        this.touchEndX = e.touches[0].clientX;
      }, { passive: true });

      this.track.addEventListener('touchend', () => {
        this.handleSwipe();
      });

      // 鍵盤控制
      this.carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.prev();
        } else if (e.key === 'ArrowRight') {
          this.next();
        }
      });

      // 視窗大小改變時重新計算
      window.addEventListener('resize', () => {
        this.updateCarousel(false);
      });
    }

    handleSwipe() {
      const swipeDistance = this.touchStartX - this.touchEndX;

      if (Math.abs(swipeDistance) > this.options.swipeThreshold) {
        if (swipeDistance > 0) {
          // 向左滑 - 下一張
          this.next();
        } else {
          // 向右滑 - 上一張
          this.prev();
        }
      }

      // 重置
      this.touchStartX = 0;
      this.touchEndX = 0;
    }

    next() {
      if (this.isTransitioning) return;

      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.updateCarousel();
    }

    prev() {
      if (this.isTransitioning) return;

      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.updateCarousel();
    }

    goTo(index) {
      if (this.isTransitioning || index === this.currentIndex) return;

      this.currentIndex = index;
      this.updateCarousel();
    }

    updateCarousel(animate = true) {
      if (!this.track) return;

      this.isTransitioning = animate;

      // 計算位移
      const offset = -this.currentIndex * 100;
      this.track.style.transition = animate ? `transform ${this.options.transitionDuration}ms ease-out` : 'none';
      this.track.style.transform = `translateX(${offset}%)`;

      // 更新指示點
      this.updateDots();

      // 更新 ARIA
      this.slides.forEach((slide, index) => {
        slide.setAttribute('aria-hidden', index !== this.currentIndex);
      });

      // 轉場結束後
      if (animate) {
        setTimeout(() => {
          this.isTransitioning = false;
        }, this.options.transitionDuration);
      }
    }

    updateDots() {
      const dots = this.carousel.querySelectorAll('.carousel-dot');

      dots.forEach((dot, index) => {
        if (index === this.currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    startAutoPlay() {
      this.stopAutoPlay(); // 清除現有的 timer

      this.autoPlayTimer = setInterval(() => {
        this.next();
      }, this.options.interval);
    }

    stopAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
    }

    destroy() {
      this.stopAutoPlay();
      // 移除事件監聽器 (如果需要)
    }
  }

  // ============================================
  // Auto Initialize - 自動初始化
  // ============================================

  function initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(element => {
      // 從 data attributes 讀取配置
      const options = {
        autoPlay: element.dataset.carouselAutoplay !== 'false',
        interval: parseInt(element.dataset.carouselInterval) || 5000,
        transitionDuration: parseInt(element.dataset.carouselDuration) || 300,
        pauseOnHover: element.dataset.carouselPauseOnHover !== 'false'
      };

      // 創建 carousel 實例並存儲到元素上
      element._carousel = new Carousel(element, options);
    });
  }

  // DOM 載入完成後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }

  // 導出到 window
  window.Carousel = Carousel;

})();
