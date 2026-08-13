'use strict'

const pathFn = require('path')

/**
 * 相關文章推薦 — 用 tag 重疊度排序
 * 取代 hexo-related-popular-posts plugin（移除 GA 古董依賴）
 *
 * Template 呼叫方式不變：popular_posts_json(options, post)
 * 回傳格式：{ json: [{ path, title, date, img, excerpt }], class: string }
 */
hexo.extend.helper.register('popular_posts_json', function (options, post) {
  const currentPost = post || this.page
  if (!currentPost || !currentPost.tags) {
    return { json: [], class: 'popular-posts' }
  }

  const config = this.config
  const opts = Object.assign({
    maxCount: 5,
    ulClass: 'popular-posts',
    isDate: false,
    isImage: false,
    isExcerpt: false,
  }, options)

  // 收集當前文章的所有 tag name
  const currentTags = new Set()
  currentPost.tags.each(tag => currentTags.add(tag.name))

  if (currentTags.size === 0) {
    return { json: [], class: opts.ulClass }
  }

  // 遍歷所有文章，計算 tag 重疊度
  const candidates = []
  const allPosts = this.site.posts

  allPosts.each(post => {
    // 排除自己和未發布的
    if (post.path === currentPost.path || !post.published) return

    let overlap = 0
    if (post.tags) {
      post.tags.each(tag => {
        if (currentTags.has(tag.name)) overlap++
      })
    }

    if (overlap > 0) {
      candidates.push({ post, overlap })
    }
  })

  // 先按 tag 重疊度排序，重疊度相同按日期新的優先
  candidates.sort((a, b) => {
    if (b.overlap !== a.overlap) return b.overlap - a.overlap
    return (b.post.date || 0) - (a.post.date || 0)
  })

  // 組裝輸出
  const json = []
  const limit = Math.min(opts.maxCount, candidates.length)

  for (let i = 0; i < limit; i++) {
    const p = candidates[i].post
    const item = {
      path: pathFn.join(config.root, p.path),
      title: p.title || '',
      date: '',
      img: '',
      excerpt: '',
    }

    if (opts.isDate && p.date) {
      item.date = p.date.format(config.date_format || 'YYYY-MM-DD')
    }

    if (opts.isImage) {
      item.img = p.bgImage
        ? pathFn.join(config.root, p.path.replace(/index\.html$/, ''), p.bgImage)
        : ''
    }

    if (opts.isExcerpt) {
      item.excerpt = p.description || ''
    }

    json.push(item)
  }

  return { json, class: opts.ulClass }
})
