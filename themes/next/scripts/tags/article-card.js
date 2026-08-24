/**
 * article-card.js | Article card tag implementation
 */

'use strict';

function articleCard(args) {
  const urlMatch = args.join(' ').match(/url=["']?([^"'\s]+)["']?/);
  const titleMatch = args.join(' ').match(/title=["']?([^"']+?)["']?(?=\s+\w+=|$)/);
  const previewTextMatch = args.join(' ').match(/previewText=["']?(.*?)["']?(?=\s+\w+=|$)/);
  const thumbnailMatch = args.join(' ').match(/thumbnail=["']?([^"']+?)["']?(?=\s+\w+=|$)/);

  const url = urlMatch ? urlMatch[1] : '';
  const title = titleMatch ? titleMatch[1] : '';
  const previewText = previewTextMatch ? previewTextMatch[1] : '';
  const thumbnail = thumbnailMatch ? thumbnailMatch[1] : '';

  let isExternal = false;
  try {
    if (/^https?:\/\//.test(url)) {
      const parsedUrl = new URL(url, 'https://www.darrelltw.com');
      isExternal = !['www.darrelltw.com', 'darrelltw.com', 'localhost'].includes(parsedUrl.hostname);
    }
  } catch (e) {
    isExternal = false;
  }
  const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';

  return `<div class="article-card">
    <a href="${url}" class="article-card-link"${targetAttr}>
      <div class="article-card-content">
        <div class="article-card-text">
          <div class="article-card-title">${title}</div>
          ${previewText ? `<p class="article-card-preview">${previewText}</p>` : ''}
        </div>
        ${thumbnail ? `<div class="article-card-image">
          <img src="${thumbnail}" alt="${title}" loading="lazy" decoding="async">
        </div>` : ''}
      </div>
    </a>
  </div>`;
}

hexo.extend.tag.register('articleCard', articleCard);
