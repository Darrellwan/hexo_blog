{%- set popular_posts = popular_posts_json(theme.related_posts.params, page) %}
{%- if theme.social and is_post %}
  <div class="links-of-author motion-element">
    {%- for name, link in theme.social %}
      <span class="links-of-author-item">
      {%- set sidebarURL = link.split('||')[0] | trim %}
      {%- if theme.social_icons.enable %}
        {%- set sidebarIcon = '<i class="' + link.split('||')[1] | trim + ' fa-fw"></i>' %}
      {%- else %}
        {%- set sidebarIcon = '' %}
      {%- endif %}
      {%- if theme.social_icons.enable and theme.social_icons.icons_only %}
        {%- set sidebarText = '' %}
      {%- else %}
        {%- set sidebarText = name %}
      {%- endif %}
        {{ next_url(sidebarURL, sidebarIcon + sidebarText, {title: name + ' → ' + sidebarURL}) }}
      </span>
      <br>
    {%- endfor %}
  </div>
{%- endif %}

{%- if popular_posts.json and popular_posts.json.length > 0 %}

  
  
  <div class="popular-posts-header">{{ theme.related_posts.title or __('post.related_posts') }}</div>
  <ul class="popular-posts">
  {%- for popular_post in popular_posts.json %}
  {%- if popular_post.path and popular_post.path != '' and popular_post.title and popular_post.title != '' %}
  <li class="popular-posts-item">
    {%- if popular_post.date and popular_post.date != '' %}
      <div class="popular-posts-date">{{ popular_post.date }}</div>
    {%- endif %}
    {%- if popular_post.img and popular_post.img != '' %}
      <div class="popular-posts-img"><img src="{{ popular_post.img }}"></div>
    {%- endif %}
    <div class="popular-posts-title"><a class="non-border orange-main-color js-popular-post" href="{{ popular_post.path }}" rel="bookmark">{{ popular_post.title }}</a></div>
    {%- if popular_post.excerpt and popular_post.excerpt != '' %}
      <div class="popular-posts-excerpt"><p>{{ popular_post.excerpt }}</p></div>
    {%- endif %}
  </li>
  {%- endif %}    
  <script>
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "event" : "popular_post_view",
      "post_path" : "{{ popular_post.path }}/",
      "post_title" : "{{ popular_post.title }}",
    })
  </script>
  {%- endfor %}  
  </ul>
{%- endif %}
