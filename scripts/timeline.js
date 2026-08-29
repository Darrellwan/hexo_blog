/**
 * Hexo Timeline Tag
 *
 * 用法：
 *   {% timeline title="事件時序" %}
 *   [
 *     {"date": "8/27", "text": "第一件事"},
 *     {"date": "8/29", "text": "支援 **粗體**、`程式碼`、[連結](url)"}
 *   ]
 *   {% endtimeline %}
 *
 *   title 可省略，省略時不顯示標題列。
 *
 * 欄位：
 *   - date：必填，顯示在內容上方的日期或時間
 *   - text：必填，內容，走 Markdown 算繪
 *   - level：選填，保留欄位。目前只寫進 data-level，不影響外觀。
 *            未來要做分級配色時，在 timeline.styl 覆寫 --dn-timeline-node 即可，
 *            不需要改這支程式，也不需要動已經寫好的文章。
 *
 * 樣式：themes/next/source/css/_custom/timeline.styl
 */

'use strict';

const escapeHtml = str => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

hexo.extend.tag.register('timeline', function(args, content) {
  try {
    const contentStr = Array.isArray(content) ? content.join('') : (content || '');
    const items = JSON.parse(contentStr.trim());

    if (!Array.isArray(items) || items.length === 0) {
      return '<!-- Timeline: 內容必須是非空陣列 -->';
    }

    const titleArg = args.find(arg => arg.startsWith('title='));
    const title = titleArg
      ? titleArg.replace(/^title=["']?/, '').replace(/["']?$/, '')
      : '';

    let html = '<div class="dn-timeline">\n';

    if (title) {
      html += `  <div class="dn-timeline-heading"><span>${escapeHtml(title)}</span></div>\n`;
    }

    html += '  <ol class="dn-timeline-list">\n';

    items.forEach(item => {
      // text 走 Markdown，外層 <p> 拔掉，避免多一層行距
      const rendered = hexo.render
        .renderSync({ text: String(item.text || ''), engine: 'markdown' })
        .trim()
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '');

      const level = item.level ? ` data-level="${escapeHtml(item.level)}"` : '';

      html += `    <li class="dn-timeline-item"${level}>\n`;
      html += '      <div class="dn-timeline-rail"><span class="dn-timeline-dot"></span></div>\n';
      html += '      <div class="dn-timeline-body">\n';
      html += `        <div class="dn-timeline-date">${escapeHtml(item.date || '')}</div>\n`;
      html += `        <div class="dn-timeline-text">${rendered}</div>\n`;
      html += '      </div>\n';
      html += '    </li>\n';
    });

    html += '  </ol>\n';
    html += '</div>';

    return html;
  } catch (error) {
    return `<!-- Timeline JSON Parse Error: ${error.message} -->`;
  }
}, { ends: true });
