/* global hexo */

'use strict';

const path = require('path');

// Add comment
hexo.extend.filter.register('theme_inject', injects => {
  let theme = hexo.theme.config;
  if (!theme.disqusjs.enable || !theme.disqusjs.shortname || !theme.disqusjs.apikey) return;

  injects.comment.raw('disqusjs', `
  <div class="comments">
    <div id="disqus_thread">
      <noscript>Please enable JavaScript to view the comments powered by Disqus.</noscript>
    </div>
  </div>
  `, {}, {cache: true});

  injects.bodyEnd.file('disqusjs', path.join(hexo.theme_dir, 'layout/_third-party/comments/disqusjs.swig'));

  // 確認是否為文章頁面
  if (typeof is_post !== 'undefined' && is_post) {
    // 在這裡放置 disqusjs 的初始化代碼
    // 例如：
    // disqusjs.init();
  }
});
