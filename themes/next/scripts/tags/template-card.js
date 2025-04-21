/**
 * template-card.js | Template card tag implementation
 */

'use strict';

function templateCard(args) {
  const urlMatch = args.join(' ').match(/url=["']?([^"'\s]+)["']?/);
  const idMatch = args.join(' ').match(/id=["']?([^"'\s]+)["']?/);
  const titleMatch = args.join(' ').match(/title=["']?([^"']+?)["']?(?=\s+\w+=|$)/);
  const descriptionMatch = args.join(' ').match(/description=["']?(.*?)["']?(?=\s+\w+=|$)/);
  const thumbnailMatch = args.join(' ').match(/thumbnail=["']?([^"']+?)["']?(?=\s+\w+=|$)/);
  const tagsMatch = args.join(' ').match(/tags=["']?(.*?)["']?(?=\s+\w+=|$)/);
  const nodeCountMatch = args.join(' ').match(/nodeCount=["']?(\d+)["']?/);
  const updatedAtMatch = args.join(' ').match(/updatedAt=["']?(.*?)["']?(?=\s+\w+=|$)/);

  const url = urlMatch ? urlMatch[1] : '';
  const id = idMatch ? idMatch[1] : '';
  const title = titleMatch ? titleMatch[1] : '';
  const description = descriptionMatch ? descriptionMatch[1] : '';
  const thumbnail = thumbnailMatch ? thumbnailMatch[1] : '';
  const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : [];
  const nodeCount = nodeCountMatch ? nodeCountMatch[1] : '';
  const updatedAt = updatedAtMatch ? updatedAtMatch[1] : '';

  const tagsHtml = tags.map(tag => `<span class="template-tag">${tag}</span>`).join('');

  return `<div class="template-card">
    <a href="${url || `/tools/n8n_template/model-detail.html?model=${id}`}" class="template-card-link">
      <div class="template-card-content">
        <div class="template-card-text">
          <div class="template-card-title">${title}</div>
          ${description ? `<p class="template-card-description">${description}</p>` : ''}
          ${tags.length ? `<div class="template-card-tags">${tagsHtml}</div>` : ''}
          <div class="template-card-meta">
            ${nodeCount ? `<span class="template-node-count">${nodeCount} 個節點</span>` : ''}
            ${updatedAt ? `<span class="template-updated-at">更新於 ${updatedAt}</span>` : ''}
          </div>
        </div>
        <div class="template-card-image">
          <img src="${thumbnail}" alt="${title}">
        </div>
      </div>
    </a>
  </div>`;
}

hexo.extend.tag.register('templateCard', templateCard); 