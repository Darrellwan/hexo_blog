/**
 * n8n-expert Mobile Interactions
 * 手機互動 - 處理手機專屬功能
 * 包含：Bottom Sheet, Quick Contact Bar, Touch Gestures
 */

(function() {
  'use strict';

  // ============================================
  // Bottom Sheet - 底部彈出面板
  // ============================================

  class BottomSheet {
    constructor(element, options = {}) {
      this.sheet = element;
      this.backdrop = null;
      this.isOpen = false;
      this.isDragging = false;

      this.options = {
        closeOnBackdrop: options.closeOnBackdrop !== undefined ? options.closeOnBackdrop : true,
        dragToClose: options.dragToClose !== undefined ? options.dragToClose : true,
        dragThreshold: options.dragThreshold || 100
      };

      this.startY = 0;
      this.currentY = 0;

      this.init();
    }

    init() {
      // 創建背景遮罩
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'bottom-sheet-backdrop';
      document.body.appendChild(this.backdrop);

      // 綁定事件
      this.bindEvents();
    }

    bindEvents() {
      // 背景點擊關閉
      if (this.options.closeOnBackdrop) {
        this.backdrop.addEventListener('click', () => {
          this.close();
        });
      }

      // 拖曳關閉
      if (this.options.dragToClose) {
        this.sheet.addEventListener('touchstart', (e) => {
          this.startDrag(e);
        }, { passive: true });

        this.sheet.addEventListener('touchmove', (e) => {
          this.onDrag(e);
        }, { passive: false });

        this.sheet.addEventListener('touchend', () => {
          this.endDrag();
        });
      }
    }

    startDrag(e) {
      // 只有在頂部區域才允許拖曳
      const rect = this.sheet.getBoundingClientRect();
      const touchY = e.touches[0].clientY;

      if (touchY - rect.top < 60) { // 頂部 60px 範圍
        this.isDragging = true;
        this.startY = touchY;
      }
    }

    onDrag(e) {
      if (!this.isDragging) return;

      this.currentY = e.touches[0].clientY;
      const deltaY = this.currentY - this.startY;

      // 只允許向下拖曳
      if (deltaY > 0) {
        e.preventDefault();
        this.sheet.style.transform = `translateY(${deltaY}px)`;
      }
    }

    endDrag() {
      if (!this.isDragging) return;

      const deltaY = this.currentY - this.startY;

      if (deltaY > this.options.dragThreshold) {
        this.close();
      } else {
        // 回彈
        this.sheet.style.transform = '';
      }

      this.isDragging = false;
      this.startY = 0;
      this.currentY = 0;
    }

    open() {
      if (this.isOpen) return;

      this.sheet.classList.add('open');
      this.backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';

      this.isOpen = true;

      // 觸發事件
      this.sheet.dispatchEvent(new CustomEvent('bottomsheet:open'));
    }

    close() {
      if (!this.isOpen) return;

      this.sheet.classList.remove('open');
      this.backdrop.classList.remove('open');
      document.body.style.overflow = '';

      this.isOpen = false;

      // 觸發事件
      this.sheet.dispatchEvent(new CustomEvent('bottomsheet:close'));
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    destroy() {
      this.backdrop.remove();
    }
  }

  // ============================================
  // Quick Contact Bar - 快速聯絡列
  // ============================================

  class QuickContactBar {
    constructor() {
      this.bar = null;
      this.init();
    }

    init() {
      // 只在手機版顯示
      if (window.innerWidth >= 768) return;

      // 檢查是否已存在
      if (document.querySelector('.mobile-quick-contact')) return;

      // 創建快速聯絡列
      this.bar = this.createBar();
      document.body.appendChild(this.bar);

      // 為 body 加上 class
      document.body.classList.add('has-quick-contact');

      // 視窗大小改變時處理
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && this.bar) {
          this.destroy();
        } else if (window.innerWidth < 768 && !this.bar) {
          this.init();
        }
      });
    }

    createBar() {
      const bar = document.createElement('div');
      bar.className = 'mobile-quick-contact';

      // 單一 CTA 按鈕 - 免費諮詢
      const contactLink = document.createElement('a');
      contactLink.href = '#contact';
      contactLink.className = 'quick-contact-primary';
      contactLink.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
        <span>免費諮詢</span>
      `;

      bar.appendChild(contactLink);

      return bar;
    }

    destroy() {
      if (this.bar) {
        this.bar.remove();
        this.bar = null;
        document.body.classList.remove('has-quick-contact');
      }
    }
  }

  // ============================================
  // Touch Gestures - 觸控手勢
  // ============================================

  class TouchGestures {
    constructor(element, callbacks = {}) {
      this.element = element;
      this.callbacks = callbacks;

      this.startX = 0;
      this.startY = 0;
      this.endX = 0;
      this.endY = 0;
      this.threshold = 50; // 最小滑動距離

      this.init();
    }

    init() {
      this.element.addEventListener('touchstart', (e) => {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      }, { passive: true });

      this.element.addEventListener('touchmove', (e) => {
        this.endX = e.touches[0].clientX;
        this.endY = e.touches[0].clientY;
      }, { passive: true });

      this.element.addEventListener('touchend', () => {
        this.handleGesture();
      });
    }

    handleGesture() {
      const deltaX = this.endX - this.startX;
      const deltaY = this.endY - this.startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // 判斷是水平還是垂直滑動
      if (absDeltaX > absDeltaY && absDeltaX > this.threshold) {
        // 水平滑動
        if (deltaX > 0) {
          this.onSwipeRight();
        } else {
          this.onSwipeLeft();
        }
      } else if (absDeltaY > absDeltaX && absDeltaY > this.threshold) {
        // 垂直滑動
        if (deltaY > 0) {
          this.onSwipeDown();
        } else {
          this.onSwipeUp();
        }
      }

      // 重置
      this.startX = 0;
      this.startY = 0;
      this.endX = 0;
      this.endY = 0;
    }

    onSwipeLeft() {
      if (this.callbacks.onSwipeLeft) {
        this.callbacks.onSwipeLeft();
      }
    }

    onSwipeRight() {
      if (this.callbacks.onSwipeRight) {
        this.callbacks.onSwipeRight();
      }
    }

    onSwipeUp() {
      if (this.callbacks.onSwipeUp) {
        this.callbacks.onSwipeUp();
      }
    }

    onSwipeDown() {
      if (this.callbacks.onSwipeDown) {
        this.callbacks.onSwipeDown();
      }
    }
  }

  // ============================================
  // Mobile Menu - 手機選單
  // ============================================

  class MobileMenu {
    constructor() {
      this.menuButton = null;
      this.menu = null;
      this.isOpen = false;

      this.init();
    }

    init() {
      this.menuButton = document.querySelector('[data-mobile-menu-toggle]');
      this.menu = document.querySelector('[data-mobile-menu]');

      if (!this.menuButton || !this.menu) return;

      this.menuButton.addEventListener('click', () => {
        this.toggle();
      });

      // 點擊選單項目後關閉
      const menuLinks = this.menu.querySelectorAll('a');
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.close();
        });
      });

      // 點擊外部關閉
      document.addEventListener('click', (e) => {
        if (this.isOpen &&
            !this.menu.contains(e.target) &&
            !this.menuButton.contains(e.target)) {
          this.close();
        }
      });
    }

    open() {
      if (this.isOpen) return;

      this.menu.classList.add('open');
      this.menuButton.classList.add('active');
      document.body.style.overflow = 'hidden';

      this.isOpen = true;
    }

    close() {
      if (!this.isOpen) return;

      this.menu.classList.remove('open');
      this.menuButton.classList.remove('active');
      document.body.style.overflow = '';

      this.isOpen = false;
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  // ============================================
  // Viewport Height Fix - 解決手機瀏覽器位址列問題
  // ============================================

  function fixViewportHeight() {
    // 計算實際的 viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // 視窗大小改變時更新
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }, 100);
    });
  }

  // ============================================
  // Prevent Pull-to-Refresh - 防止下拉刷新 (可選)
  // ============================================

  function preventPullToRefresh() {
    let startY = 0;

    document.addEventListener('touchstart', (e) => {
      startY = e.touches[0].pageY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      const y = e.touches[0].pageY;

      // 在頂部且向下滑動
      if (document.documentElement.scrollTop === 0 && y > startY) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // ============================================
  // 初始化所有手機互動功能
  // ============================================

  function initMobileInteractions() {
    // 只在手機裝置執行
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    if (!isMobile) return;

    // Quick Contact Bar
    new QuickContactBar();

    // Mobile Menu (如果有)
    new MobileMenu();

    // Viewport Height Fix
    fixViewportHeight();

    // Bottom Sheet (自動偵測並初始化)
    const bottomSheets = document.querySelectorAll('[data-bottom-sheet]');
    bottomSheets.forEach(sheet => {
      const instance = new BottomSheet(sheet);

      // 綁定觸發按鈕
      const triggerId = sheet.dataset.bottomSheetTrigger;
      if (triggerId) {
        const trigger = document.querySelector(`[data-bottom-sheet-trigger="${triggerId}"]`);
        if (trigger) {
          trigger.addEventListener('click', () => {
            instance.open();
          });
        }
      }

      // 存儲實例到元素上
      sheet._bottomSheet = instance;
    });

    // Touch Gestures for Portfolio (手機版滑動)
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid && window.innerWidth < 768) {
      // Portfolio 已經用 CSS 處理了滑動，這裡不需要額外處理
      // 如果需要自定義手勢，可以在這裡添加
    }
  }

  // DOM 載入完成後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileInteractions);
  } else {
    initMobileInteractions();
  }

  // 導出到 window
  window.MobileUtils = {
    BottomSheet,
    QuickContactBar,
    TouchGestures,
    MobileMenu,
    fixViewportHeight,
    preventPullToRefresh
  };

})();
