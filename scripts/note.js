/**
 * Hexo Callout Tag
 *
 * 用法：
 *   {% note type="tip" title="自訂標題" %}
 *   內容文字，支援 **粗體**、`程式碼`、[連結](url)
 *   {% endnote %}
 *
 *   簡化語法（使用預設標題）：
 *   {% note warning %}
 *   內容文字
 *   {% endnote %}
 *
 * 類型：
 *   - tip: 提示（綠色）
 *   - info: 資訊（藍色）
 *   - warning: 警告（橙色）
 *   - error: 錯誤（紅色）
 */

'use strict';

const defaultTitles = {
  tip: '提示',
  info: '補充說明',
  warning: '注意事項',
  error: '錯誤'
};

hexo.extend.tag.register('note', function(args, content) {
  const argsStr = args.join(' ');

  // 解析參數
  let type = 'tip';
  let title = '';

  // 嘗試解析 type="value" 格式
  const typeMatch = argsStr.match(/type\s*=\s*["']?(\w+)["']?/);
  if (typeMatch) {
    type = typeMatch[1];
  } else {
    // 簡化語法：{% note warning %}
    const simpleType = args[0];
    if (simpleType && ['tip', 'info', 'warning', 'error'].includes(simpleType)) {
      type = simpleType;
    }
  }

  // 嘗試解析 title="value" 格式
  const titleMatch = argsStr.match(/title\s*=\s*["']([^"']+)["']/);
  if (titleMatch) {
    title = titleMatch[1];
  } else {
    // 使用預設標題
    title = defaultTitles[type] || defaultTitles.tip;
  }

  // 驗證類型
  if (!['tip', 'info', 'warning', 'error'].includes(type)) {
    type = 'tip';
  }

  // 渲染 Markdown 內容
  const renderedContent = hexo.render.renderSync({ text: content, engine: 'markdown' });

  // 生成 HTML
  const html = `
<div class="note note-${type}">
  <div class="note-title">${title}</div>
  <div class="note-content">${renderedContent}</div>
</div>
`;

  return html;
}, { ends: true });
