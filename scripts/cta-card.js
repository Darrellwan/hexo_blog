/**
 * Hexo CTA Card Tag
 *
 * 文章內的行動呼籲元件，用在段落結尾要讀者做一件事的時候（預約、報名、填表）。
 *
 * 用法：
 *   {% ctaCard label="版本 A｜極簡雙線" variant="editorial-line" title="想知道哪些工作適合外包給 AI？" url="/n8n-expert/#contact" button="預約免費診斷" %}{% endctaCard %}
 *   內文可放在開始與結束 tag 之間，支援 Markdown。
 *
 * 參數：
 *   - title：卡片標題，必填
 *   - url：按鈕連結，必填
 *   - button：按鈕文字，預設「立即預約」
 *   - variant：白名單中的視覺版本，可省略
 *   - label：比較用標籤，會顯示在 CTA 外層，可省略
 */

'use strict';

/** Hexo 會保留或移除引號，兩種都要吃得下 */
function parseArg(args, name) {
  const argsStr = args.join(' ');
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keyPattern = `(?:^|\\s)${escapedName}\\s*=\\s*`;
  const quotedMatch = argsStr.match(new RegExp(`${keyPattern}"([^"]*)"`))
    || argsStr.match(new RegExp(`${keyPattern}'([^']*)'`));
  if (quotedMatch) {
    return quotedMatch[1];
  }

  // Hexo 去掉引號後，值可能跨越多個 args token；讀到下一個 name= 為止。
  const keyMatch = new RegExp(keyPattern).exec(argsStr);
  if (!keyMatch) {
    return '';
  }

  const value = argsStr.slice(keyMatch.index + keyMatch[0].length);
  const nextArgument = value.search(/\s+[A-Za-z][A-Za-z0-9_-]*\s*=\s*/);
  return (nextArgument === -1 ? value : value.slice(0, nextArgument)).trim();
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CTA_VARIANTS = new Set([
  'editorial-line',
  'signature-card',
  'side-note',
  'inline-link',
  'service-bar'
]);

hexo.extend.tag.register('ctaCard', function(args, content) {
  const title = parseArg(args, 'title');
  const url = parseArg(args, 'url');
  const button = parseArg(args, 'button') || '立即預約';
  const rawVariant = parseArg(args, 'variant');
  const variant = CTA_VARIANTS.has(rawVariant) ? rawVariant : '';
  const label = parseArg(args, 'label');

  // 缺標題或連結就不輸出，不要產生一個點不動的元件
  if (!title || !url) {
    return '';
  }

  const body = (content || '').trim();
  const renderedBody = body
    ? `<div class="dn-cta-text">${hexo.render.renderSync({ text: body, engine: 'markdown' })}</div>`
    : '';
  const bodyMarkup = renderedBody
    ? `<div class="dn-cta-body">${renderedBody}</div>`
    : '';

  // 外部連結才開新分頁，站內連結維持同頁
  const isExternal = /^https?:\/\//.test(url);
  const linkAttrs = isExternal ? ' target="_blank" rel="noopener"' : '';
  const variantClass = variant ? ` dn-cta--${variant}` : '';
  const noBodyClass = bodyMarkup ? '' : ' dn-cta--no-body';
  const previewLabel = label
    ? `<p class="dn-cta-preview-label">${escapeHtml(label)}</p>`
    : '';

  return `
<div class="dn-cta-preview">
  ${previewLabel}
  <aside class="dn-cta${variantClass}${noBodyClass}">
    <span class="dn-cta-mark" aria-hidden="true">D</span>
    ${bodyMarkup}
    <div class="dn-cta-offer">
      <p class="dn-cta-title">${escapeHtml(title)}</p>
      <a class="dn-cta-action" href="${escapeHtml(url)}"${linkAttrs}>${escapeHtml(button)}<span class="dn-cta-arrow" aria-hidden="true">→</span></a>
    </div>
  </aside>
</div>
`;
}, { ends: true });
