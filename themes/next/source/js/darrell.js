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
