  {##################}
  {### POST BLOCK ###}
  {##################}
  <article itemscope itemtype="http://schema.org/Article" class="post-block{%- if is_index %} is-index{%- endif %}" lang="{{ post.lang or config.language }}">
    <link itemprop="mainEntityOfPage" href="{{ post.permalink }}">
    <meta itemprop="image" content="https://www.darrelltw.com/images/logo.png">

    <span hidden itemprop="author" itemscope itemtype="http://schema.org/Person">
      <meta itemprop="image" content="{{ url_for(theme.avatar.url or theme.images + '/avatar.gif') }}">
      <meta itemprop="name" content="{{ author }}">
      <link itemprop="url" href="{{ authorLink }}">
      <meta itemprop="description" content="{{ description }}">
    </span>

    <span hidden itemprop="publisher" itemscope itemtype="http://schema.org/Organization">
      <meta itemprop="name" content="{{ title }}">
    </span>

    {%- if post.header !== false %}
      <header class="post-header{%- if is_index %} has-thumbnail{%- endif %}">

        {#- 首頁文章縮圖 -#}
        {%- if is_index %}
        {%- if post.bgImage %}
          {%- set thumbnailUrl = config.url + '/' + post.path + post.bgImage %}
        {%- else %}
          {%- set thumbnailUrl = config.url + '/images/n8n-default-thumbnail.jpg' %}
        {%- endif %}
        <div class="post-thumbnail">
          <a href="{{ url_for(post.path) }}" class="post-thumbnail-link">
            <img src="{{ thumbnailUrl }}"
                 alt="{{ post.title }}"
                 class="lazyload"
                 loading="lazy">
          </a>
        </div>
        {%- endif %}
        {#- 文章內容區塊 -#}
        <div class="post-header-content">
        {%- if is_index %}
        <h2 class="post-title" itemprop="name headline">
          {{ next_url(post.path, post.title or __('post.untitled'), {class: 'post-title-link', itemprop: 'url'}) }}
        </h2>
        {%- endif %}
        {%- if not is_index %}
        <h1 class="post-title{%- if post.direction and post.direction.toLowerCase() === 'rtl' %} rtl{%- endif %}" itemprop="name headline">
          {%- if post.link %}
            {%- set postTitleIcon = '<i class="fa fa-external-link-alt"></i>' %}
            {%- set postText = post.title or post.link %}
            {{ next_url(post.link, postText + postTitleIcon, {class: 'post-title-link post-title-link-external', itemprop: 'url'}) }}
          {%- else %}
            {{- post.title }}
            {{- post_edit(post.source) }}
          {%- endif %}
        </h1>
        {%- endif %}

        <div class="post-meta">

          {%- set date_diff = date(post.date) != date(post.updated) %}
          {%- set time_diff = time(post.date) != time(post.updated) %}
          {%- set datetime_diff = date_diff or time_diff %}

          {%- if post.description and is_index %}
            <div class="post-description is-index">{{ post.description }}</div>
          {%- endif %}

          {%- if theme.post_meta.created_at %}
            <span class="post-meta-item">
              <span class="post-meta-item-icon">
                <i class="far fa-calendar"></i>
              </span>
              <span class="post-meta-item-text">{{ __('post.posted') }}</span>

              {%- if not date_diff and time_diff and theme.post_meta.updated_at.enable and theme.post_meta.updated_at.another_day and post.modified %}
                {%- set create_title = __('post.created') + __('symbol.colon') + full_date(post.date) + ' / ' + __('post.modified') + __('symbol.colon') + time(post.updated) %}
              {% else %}
                {%- set create_title = __('post.created') + __('symbol.colon') + full_date(post.date) %}
              {%- endif %}

              <time title="{{ create_title }}" itemprop="dateCreated datePublished" datetime="{{ moment(post.date).format() }}">{{ date(post.date) }}</time>
            </span>
          {%- endif %}

          {%- if theme.post_meta.updated_at.enable and datetime_diff and post.modified %}
            {%- set display_updated = not theme.post_meta.updated_at.another_day or theme.post_meta.updated_at.another_day and date_diff %}

            {%- if display_updated or not theme.post_meta.created_at %}
              <span class="post-meta-item">
                <span class="post-meta-item-icon">
                  <i class="far fa-calendar-check"></i>
                </span>
                <span class="post-meta-item-text">{{ __('post.edited') }}</span>
                <time title="{{ __('post.modified') + __('symbol.colon') + full_date(post.updated) }}" itemprop="dateModified" datetime="{{ moment(post.updated).format() }}">{{ date(post.updated) }}</time>
              </span>
            {%- endif %}
          {%- endif %}

          {%- if post.categories and post.categories.length and theme.post_meta.categories %}
            <span class="post-meta-item t-post-meta-category">
              <span class="post-meta-item-icon">
                <i class="far fa-folder"></i>
              </span>
              {%- for cat in post.categories.toArray() %}
                <span itemprop="about" itemscope itemtype="http://schema.org/Thing">
                  <a href="{{ url_for(cat.path) }}" itemprop="url" rel="index"><span itemprop="name">{{ cat.name }}</span></a>
                </span>

                {%- set cat_length = post.categories.length %}
                {%- if cat_length > 1 and loop.index !== cat_length %}
                  , 
                {%- endif %}
              {%- endfor %}
            </span>
          {%- endif %}

          {# LeanCloud PageView #}
          {%- if theme.leancloud_visitors.enable or (theme.valine.enable and theme.valine.appid and theme.valine.appkey and theme.valine.visitor) %}
            <span id="{{ url_for(post.path) }}" class="post-meta-item leancloud_visitors" data-flag-title="{{ post.title }}" title="{{ __('post.views') }}">
              <span class="post-meta-item-icon">
                <i class="fa fa-eye"></i>
              </span>
              <span class="post-meta-item-text">{{ __('post.views') + __('symbol.colon') }}</span>
              <span class="leancloud-visitors-count"></span>
            </span>
          {%- endif %}

          {%- if theme.firestore.enable %}
            <span class="post-meta-item" title="{{ __('post.views') }}">
              <span class="post-meta-item-icon">
                <i class="fa fa-users"></i>
              </span>
              <span class="post-meta-item-text">{{ __('post.views') + __('symbol.colon') }}</span>
              <span class="firestore-visitors-count"></span>
            </span>
          {%- endif %}

          {%- if not is_index and theme.busuanzi_count.enable and theme.busuanzi_count.post_views %}
            <span class="post-meta-item" title="{{ __('post.views') }}" id="busuanzi_container_page_pv" style="display: none;">
              <span class="post-meta-item-icon">
                <i class="{{ theme.busuanzi_count.post_views_icon }}"></i>
              </span>
              <span class="post-meta-item-text">{{ __('post.views') + __('symbol.colon') }}</span>
              <span id="busuanzi_value_page_pv"></span>
            </span>
          {%- endif %}

          {{- next_inject('postMeta') }}

          {%- if config.symbols_count_time.symbols %}
          {%- if theme.symbols_count_time.separated_meta %}<br>{%- endif %}
            <span class="post-meta-item" title="{{ __('symbols_count_time.count') }}">
              <span class="post-meta-item-icon">
                <i class="far fa-file-word"></i>
              </span>
              {%- if theme.symbols_count_time.item_text_post %}
                <span class="post-meta-item-text">{{ __('symbols_count_time.count') + __('symbol.colon') }}</span>
              {%- endif %}
              <span>{{ symbolsCount(post) }}</span>
            </span>
          {%- endif %}

          {%- if config.symbols_count_time.time %}
            <span class="post-meta-item" title="{{ __('symbols_count_time.time') }}">
              <span class="post-meta-item-icon">
                <i class="far fa-clock"></i>
              </span>
              {%- if theme.symbols_count_time.item_text_post %}
                <span class="post-meta-item-text">{{ __('symbols_count_time.time') }} &asymp;</span>
              {%- endif %}
              <span>{{ symbolsTime(post, config.symbols_count_time.awl, config.symbols_count_time.wpm, __('symbols_count_time.time_minutes')) }}</span>
            </span>
          {%- endif %}

          {%- if post.ai_assistance %}
            <span class="post-meta-item">
              <span class="post-meta-item-icon">
                <i class="fas fa-robot"></i>
              </span>
              <span class="post-meta-item-text">AI 輔助 </span>
              <span>{{ post.ai_assistance }}</span>
            </span>
          {%- endif %}

          {%- if post.description and (not theme.excerpt_description or not is_index) %}
            <div class="post-description">{{ post.description }}</div>
          {%- endif %}

        </div>
        </div>{#- end post-header-content -#}
      </header>
    {%- endif %}

    {%- if not is_index %}
    {########################}
    {### MOBILE TOC START ###}
    {########################}
    {%- set display_mobile_toc = page.toc.enable and not is_index %}
    {%- if display_mobile_toc %}
      {%- set mobile_toc = toc(post.content, { class: "nav", list_number: page.toc.number, max_depth: page.toc.max_depth }) %}
      {%- set display_mobile_toc = mobile_toc.length > 1 and display_mobile_toc %}
    {%- endif %}

    {%- if display_mobile_toc %}
    <style>
      .mobile-toc-container { display: none; background: var(--content-bg-color); border: 1px solid var(--border-color,#e8e8e8); border-radius: 6px; margin: 16px 0; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
      @media (max-width: 991px) { .mobile-toc-container { display: block !important; } }
      @media (min-width: 992px) { .mobile-toc-container { display: none !important; } }
      .mobile-toc-header { padding: 12px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: var(--content-bg-color); border-radius: 6px 6px 0 0; transition: background-color .2s ease; user-select: none; }
      .mobile-toc-header:hover { background: var(--card-bg-color,#f8f9fa); }
      .mobile-toc-header .fa-list { color: var(--link-color,#3498db); margin-right: 8px; font-size: 14px; }
      .mobile-toc-title { flex: 1; font-weight: 500; color: var(--text-color); font-size: 14px; }
      .mobile-toc-toggle { color: var(--text-color-light,#666); transition: transform .2s ease; font-size: 12px; }
      .mobile-toc-toggle.active { transform: rotate(180deg); }
      .mobile-toc-content { max-height: 0; overflow: hidden; transition: max-height .3s ease-out; border-top: 1px solid var(--border-color,#e8e8e8); }
      .mobile-toc-content.active { max-height: 80vh; overflow-y: auto; }
      .mobile-toc { padding: 8px 12px 12px 12px; }
      .mobile-toc ol { list-style: none; margin: 0; padding: 0; }
      .mobile-toc ol ol { padding-left: 16px; margin-top: 2px; }
      .mobile-toc .nav-item { margin: 2px 0; line-height: 1.4; }
      .mobile-toc .nav-item a { color: var(--text-color); text-decoration: none; display: block; padding: 6px 8px; border-radius: 3px; transition: all .2s ease; border-bottom: none !important; font-size: 13px; }
      .mobile-toc .nav-item a:hover { background: var(--card-bg-color,#f8f9fa); color: var(--link-color,#3498db); }
      .mobile-toc .nav-item a:before { display: none !important; }
      .mobile-toc .active > a { background: var(--link-color,#3498db); color: #fff; }
      .mobile-toc .active > a:hover { background: var(--link-hover-color,#2980b9); color: #fff; }
    </style>
    <div class="mobile-toc-container">
      <div class="mobile-toc-header" onclick="toggleMobileTOC()">
        <i class="fa fa-list"></i>
        <span class="mobile-toc-title">{{ __('sidebar.toc') }}</span>
        <i class="fa fa-chevron-down mobile-toc-toggle"></i>
      </div>
      <div class="mobile-toc-content" id="mobile-toc-content">
        <div class="mobile-toc">{{ mobile_toc }}</div>
      </div>
    </div>
    {%- endif %}
    {######################}
    {### MOBILE TOC END ###}
    {######################}

    {#################}
    {### POST BODY ###}
    {#################}
    <div class="post-body{%- if post.direction and post.direction.toLowerCase() === 'rtl' %} rtl{%- endif %}" itemprop="articleBody">

      {# Gallery support #}
      {%- if is_index and post.photos and post.photos.length %}
        <div class="post-gallery" itemscope itemtype="http://schema.org/ImageGallery">
          {%- for photo in post.photos %}
            <img src="{{ url_for(photo) }}" itemprop="contentUrl">
          {%- endfor %}
        </div>
      {%- endif %}

      {%- if is_index %}
        {%- if post.description and theme.excerpt_description %}
          <p>{{ post.description }}</p>
          <!--noindex-->
          {%- if theme.read_more_btn %}
            <div class="post-button">
              <a class="btn" href="{{ url_for(post.path) }}">
                {{ __('post.read_more') }} &raquo;
              </a>
            </div>
          {%- endif %}
          <!--/noindex-->
        {% elif post.excerpt %}
          {{ post.excerpt }}
          <!--noindex-->
          {%- if theme.read_more_btn %}
            <div class="post-button">
              <a class="btn" href="{{ url_for(post.path) }}#more" rel="contents">
                {{ __('post.read_more') }} &raquo;
              </a>
            </div>
          {%- endif %}
          <!--/noindex-->
        {% else %}
          {{ post.content }}
        {%- endif %}
      {% else %}
        {{ post.content }}
      {%- endif %}
    </div>

    {#####################}
    {### END POST BODY ###}
    {#####################}

    {%- if theme.related_posts.enable and (theme.related_posts.display_in_home or not is_index) %}
      {{ partial('_partials/post/post-related.swig') }}
    {%- endif %}    
    {%- endif %}

    {%- if not is_index %}
      {{- next_inject('postBodyEnd') }}

      {%- if post.reward_settings.enable %}
        {{ partial('_partials/post/post-reward.swig') }}
      {%- endif %}

      {%- if theme.creative_commons.license and theme.creative_commons.post %}
        {{ partial('_partials/post/post-copyright.swig') }}
      {%- endif %}

      {%- if theme.follow_me %}
        {{ partial('_partials/post/post-followme.swig', {}, {cache: theme.cache.enable}) }}
      {%- endif %}

      {# 社群分享按鈕 #}
      {{ partial('_partials/post/post-share.swig') }}

      <footer class="post-footer">
        {%- if post.tags and post.tags.length %}
          {%- if theme.tag_icon %}
            {%- set tag_indicate = '<i class="fa fa-tag"></i>' %}
          {% else %}
            {%- set tag_indicate = '#' %}
          {%- endif %}
          <div class="post-tags">
            {%- for tag in post.tags.toArray() %}
              <a href="{{ url_for(tag.path) }}" rel="tag">{{ tag_indicate }} {{ tag.name }}</a>
            {%- endfor %}
          </div>
          <div class="post-tags">
            <div id="buymeacoffee-place"></div>
          </div>
        {%- endif %}

        {{ partial('_partials/post/post-footer.swig', {}, {cache: theme.cache.enable}) }}

        
      </footer>
    {% else %}
      <footer class="post-footer">
      </footer>
    {%- endif %}


  </article>
  {{ partial('_partials/post/post-mark.swig') }}
  {######################}
  {### END POST BLOCK ###}
  {######################}
