/**
 * Term tooltip - mobile click support
 * 手機版點擊顯示/隱藏 tooltip
 */
(function() {
  function initTermTooltip() {
    document.addEventListener('click', function(e) {
      // 點擊 term 時切換 active
      if (e.target.classList.contains('term-tooltip')) {
        // 先關閉其他已開啟的 tooltip
        document.querySelectorAll('.term-tooltip.active').forEach(function(el) {
          if (el !== e.target) {
            el.classList.remove('active');
          }
        });
        e.target.classList.toggle('active');
      } else {
        // 點擊其他地方關閉所有 tooltip
        document.querySelectorAll('.term-tooltip.active').forEach(function(el) {
          el.classList.remove('active');
        });
      }
    });
  }

  // 確保 DOM 已載入
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTermTooltip);
  } else {
    initTermTooltip();
  }
})();

/**
 * Heading anchor links - click to copy URL with hash
 */
(function() {
  function copyHeadingLink(id, indicator) {
    var url = window.location.origin + window.location.pathname + '#' + id;
    navigator.clipboard.writeText(url).then(function() {
      indicator.classList.add('copied');
      setTimeout(function() { indicator.classList.remove('copied'); }, 1500);
    });
  }

  function initHeadingAnchors() {
    document.querySelectorAll('.post-body h2[id], .post-body h3[id]').forEach(function(el) {
      if (el.querySelector('.header-anchor')) return;

      var a = document.createElement('a');
      a.className = 'header-anchor';
      a.href = '#' + el.id;
      a.title = '複製連結';
      a.innerHTML = '<i class="fa fa-link fa-fw"></i>';

      a.addEventListener('click', function(e) {
        e.preventDefault();
        copyHeadingLink(el.id, a);
      });

      el.insertBefore(a, el.firstChild);

      el.addEventListener('click', function(e) {
        if (e.target === a || a.contains(e.target)) return;
        copyHeadingLink(el.id, a);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeadingAnchors);
  } else {
    initHeadingAnchors();
  }
})();

/**
 * Copyable inline chips - click <a class="copyable" data-copy="...">text</a> to copy
 * 使用方式：<a class="copyable" data-copy="要複製的文字">顯示文字</a>
 */
(function() {
  function showCopyNotification(target, text) {
    var notification = document.getElementById('copyable-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'copyable-notification';
      document.body.appendChild(notification);
    }
    notification.textContent = text || '複製成功！';

    var rect = target.getBoundingClientRect();
    notification.style.position = 'absolute';
    notification.style.top = (rect.top + window.scrollY) + 'px';
    notification.style.left = (rect.right + 10 + window.scrollX) + 'px';
    notification.style.display = 'block';

    requestAnimationFrame(function() {
      notification.classList.add('show');
    });

    clearTimeout(notification._hideTimer);
    notification._hideTimer = setTimeout(function() {
      notification.classList.remove('show');
      setTimeout(function() { notification.style.display = 'none'; }, 300);
    }, 2000);
  }

  function initCopyableChips() {
    document.addEventListener('click', function(e) {
      var el = e.target.closest('.copyable');
      if (!el) return;
      e.preventDefault();

      var text = el.dataset.copy || el.textContent.trim();
      navigator.clipboard.writeText(text).then(function() {
        showCopyNotification(el, '複製成功！');
      }).catch(function(err) {
        console.error('複製失敗', err);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyableChips);
  } else {
    initCopyableChips();
  }
})();

/**
 * 複製文章連結到剪貼簿
 */
function copyPostLink() {
  const url = window.location.href;

  navigator.clipboard.writeText(url).then(function() {
    // 顯示複製成功提示
    const btn = document.querySelector('.post-share-copy');
    btn.classList.add('copied');

    // 2 秒後隱藏提示
    setTimeout(function() {
      btn.classList.remove('copied');
    }, 2000);
  }).catch(function(err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    const btn = document.querySelector('.post-share-copy');
    btn.classList.add('copied');
    setTimeout(function() {
      btn.classList.remove('copied');
    }, 2000);
  });
}

/**
 * Local search - 鍵盤操作層
 *
 * 1. ⌘K / Ctrl+K 與 ⌘F / Ctrl+F 開啟搜尋 modal
 *    ⌘F 會蓋掉瀏覽器原生的頁內尋找；按 Esc 關閉即可恢復原生行為。
 *    要停用 ⌘F 只需把 SEARCH_HOTKEYS 裡的 'f' 移除。
 * 2. ↑ / ↓ 在結果間移動，Enter 開啟選中項（Raycast 式整列選取）
 * 3. 注入底部快捷鍵提示列
 *
 * 開啟一律轉發給主題既有的 .popup-trigger click handler，
 * 不自行操作 .search-active，避免和 local-search.js 的 fetchData / focus 邏輯不同步。
 */
(function() {
  const SEARCH_HOTKEYS = ['k', 'f'];

  function getOverlay() {
    return document.querySelector('.search-pop-overlay');
  }

  function isOpen() {
    const overlay = getOverlay();
    return !!overlay && overlay.classList.contains('search-active');
  }

  function openSearch() {
    const trigger = document.querySelector('.popup-trigger');
    if (trigger) trigger.click();
  }

  function getRows() {
    return Array.from(document.querySelectorAll('#search-result .search-result-list > li'));
  }

  function selectRow(rows, index) {
    rows.forEach(function(row) {
      row.classList.remove('is-selected');
    });
    if (index < 0 || index >= rows.length) return;
    const row = rows[index];
    row.classList.add('is-selected');
    row.scrollIntoView({ block: 'nearest' });
  }

  function currentIndex(rows) {
    return rows.findIndex(function(row) {
      return row.classList.contains('is-selected');
    });
  }

  function injectFooter() {
    const popup = document.querySelector('.search-popup');
    if (!popup || popup.querySelector('.search-footer')) return;

    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const mod = isMac ? '⌘' : 'Ctrl';
    const hints = [
      [[mod + 'K'], '開啟搜尋'],
      [['↑', '↓'], '移動'],
      [['↵'], '開啟'],
      [['Esc'], '關閉']
    ];

    const footer = document.createElement('div');
    footer.className = 'search-footer';
    hints.forEach(function(pair) {
      const hint = document.createElement('span');
      hint.className = 'search-footer-hint';
      pair[0].forEach(function(key) {
        const kbd = document.createElement('kbd');
        kbd.className = 'search-key';
        kbd.textContent = key;
        hint.appendChild(kbd);
      });
      const label = document.createElement('span');
      label.textContent = pair[1];
      hint.appendChild(label);
      footer.appendChild(hint);
    });
    popup.appendChild(footer);
  }

  function initSearchKeyboard() {
    if (!getOverlay()) return;
    injectFooter();

    // 開啟快捷鍵
    document.addEventListener('keydown', function(e) {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
      if (SEARCH_HOTKEYS.indexOf(e.key.toLowerCase()) === -1) return;
      // preventDefault 要在 isOpen 判斷之前：modal 已經開著時再按一次 ⌘F，
      // 若這裡直接 return 就會讓瀏覽器原生的頁內尋找列跳出來壓在 modal 上面。
      e.preventDefault();
      if (isOpen()) {
        const input = document.querySelector('.search-popup input.search-input');
        if (input) input.focus();
        return;
      }
      openSearch();
    });

    // 結果導覽
    document.addEventListener('keydown', function(e) {
      if (!isOpen()) return;
      // 中文輸入法組字期間，Enter 是「確認候選字」、↑↓ 是「換候選字」，
      // 都不該被搜尋結果導覽攔走。isComposing 是標準屬性，keyCode 229 是
      // 舊版瀏覽器在組字時的通用值，兩個都擋才涵蓋得完整。
      if (e.isComposing || e.keyCode === 229) return;
      if (['ArrowDown', 'ArrowUp', 'Enter'].indexOf(e.key) === -1) return;

      const rows = getRows();
      if (!rows.length) return;

      if (e.key === 'Enter') {
        const index = currentIndex(rows);
        if (index === -1) return;
        const link = rows[index].querySelector('a.search-result-title');
        if (!link) return;
        e.preventDefault();
        // 用 click() 而不是直接改 location：讓鍵盤選取和滑鼠點擊
        // 走同一條事件路徑，GA4 的 select_item 只需要掛一個 click 委派。
        link.click();
        return;
      }

      e.preventDefault();
      const index = currentIndex(rows);
      const next = e.key === 'ArrowDown'
        ? (index + 1) % rows.length
        : (index <= 0 ? rows.length - 1 : index - 1);
      selectRow(rows, next);
    });

    // 重新查詢後清掉舊的選取狀態
    const result = document.getElementById('search-result');
    if (result && window.MutationObserver) {
      new MutationObserver(function() {
        const rows = getRows();
        if (rows.length && currentIndex(rows) === -1) selectRow(rows, 0);
      }).observe(result, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchKeyboard);
  } else {
    initSearchKeyboard();
  }
})();

/**
 * Local search - GA4 dataLayer 追蹤
 *
 * 送兩個 GA4 建議事件到 GTM（容器 GTM-WRZDBFS）：
 *
 * 1. search        — 讀者停止輸入後送出，參數 search_term
 *                    去抖動 700ms + 去重，避免每按一個鍵就送一次
 * 2. select_item   — 點擊搜尋結果時送出（GA4 的 ecommerce 類事件，
 *                    參數要包在 ecommerce 物件裡）
 *                    先 push ecommerce: null 清掉前一次的值，
 *                    這是 GTM 官方建議做法，否則物件會互相合併殘留
 *
 * 鍵盤 Enter 走 link.click()，所以會被同一個 click 委派接到，不需另外處理。
 */
(function() {
  const LIST_ID = 'site_search';
  const LIST_NAME = 'Site Search Results';
  const DEBOUNCE_MS = 700;
  // 設 1 不設 2：中文一個字就是有效搜尋（搜「水」實測有 7 筆結果），
  // 門檻設 2 會讓這類查詢完全不進 GA4，事件數跟實際搜尋行為對不起來。
  const MIN_TERM_LENGTH = 1;

  function dl() {
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
  }

  function currentTerm() {
    const input = document.querySelector('.search-popup input.search-input');
    return input ? input.value.trim() : '';
  }

  function initSearchTracking() {
    const input = document.querySelector('.search-popup input.search-input');
    const result = document.getElementById('search-result');
    if (!input || !result) return;

    // ---- search ----
    let timer = null;
    let lastSent = '';
    let composing = false;

    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        const term = currentTerm();
        if (term.length < MIN_TERM_LENGTH || term === lastSent) return;
        lastSent = term;
        dl().push({
          event      : 'search',
          search_term: term
        });
      }, DEBOUNCE_MS);
    }

    // 注音／拼音組字期間，input 事件帶的是還沒選字的中間字串（「ㄕㄨㄟ」）。
    // 組字時不排程，等 compositionend 拿到定稿的字再送，避免 GA4 收到半成品。
    input.addEventListener('compositionstart', function() {
      composing = true;
      clearTimeout(timer);
    });

    input.addEventListener('compositionend', function() {
      composing = false;
      schedule();
    });

    input.addEventListener('input', function() {
      if (composing) return;
      schedule();
    });

    // ---- select_item ----
    result.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link || !result.contains(link)) return;

      const row = link.closest('li');
      if (!row) return;

      const rows = Array.from(result.querySelectorAll('.search-result-list > li'));
      const titleLink = row.querySelector('a.search-result-title');
      let itemId = link.getAttribute('href') || '';
      try {
        itemId = new URL(link.href, window.location.origin).pathname;
      } catch (err) {
        // 保留原始 href
      }

      dl().push({ ecommerce: null });
      dl().push({
        event      : 'select_item',
        search_term: currentTerm(),
        ecommerce  : {
          item_list_id  : LIST_ID,
          item_list_name: LIST_NAME,
          items         : [{
            item_id       : itemId,
            item_name     : titleLink ? titleLink.textContent.trim() : '',
            item_list_id  : LIST_ID,
            item_list_name: LIST_NAME,
            index         : rows.indexOf(row) + 1
          }]
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchTracking);
  } else {
    initSearchTracking();
  }
})();
