<header class="post-header">

{%- if page.header !== false %}
  <h1 class="post-title" itemprop="name headline">
  {{- page.title }}
  {{- post_edit(page.source) }}
  </h1>
{%- endif %}

<div class="post-meta">
  {%- if page.description %}
    <div class="post-description">{{ page.description }}</div>
  {%- endif %}
  
  {%- if page.breadcrumb !== false %}
    {% include '_partials/page/breadcrumb.swig' %}
  {%- endif %}
</div>

</header>
