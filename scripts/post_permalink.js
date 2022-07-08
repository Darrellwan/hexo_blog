'use strict';

// {% post_permalink [slug] %}
hexo.extend.tag.register('post_permalink', function (args) {
  const slug = args.shift();
  if (!slug) return this.permalink;

  const post = hexo.model('Post').findOne({slug: slug});
  if (!post) return;

  return post.permalink;
});