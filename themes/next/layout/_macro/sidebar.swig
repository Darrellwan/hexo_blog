{% macro render(display_toc) %}
  <div class="toggle sidebar-toggle">
    <span class="toggle-line toggle-line-first"></span>
    <span class="toggle-line toggle-line-middle"></span>
    <span class="toggle-line toggle-line-last"></span>
  </div>

  <aside class="sidebar">
    <div class="sidebar-inner">

      {%- set display_toc = page.toc.enable and display_toc %}
      {%- if display_toc %}
        {%- set toc = toc(page.content, { class: "nav", list_number: page.toc.number, max_depth: page.toc.max_depth }) %}
        {%- set display_toc = toc.length > 1 and display_toc %}
      {%- endif %}

      <ul class="sidebar-nav motion-element">
        <li class="sidebar-nav-toc">
          {{ __('sidebar.toc') }}
        </li>
        <li class="sidebar-nav-overview">
          {{ __('sidebar.overview') }}
        </li>
      </ul>

      <!--noindex-->
      <div class="post-toc-wrap sidebar-panel">
        {%- if display_toc %}
          <div class="post-toc motion-element">{{ toc }}</div>
        {%- endif %}
      </div>
      {%- if display_toc %}
      {%- else %}
      {%- endif %}
      
      <!--/noindex-->

      <div class="site-overview-wrap sidebar-panel">
        {{ partial('_partials/sidebar/site-overview.swig', {}, {cache: theme.cache.enable}) }}

        {{- next_inject('sidebar') }}
      </div>

      {%- if theme.back2top.enable and theme.back2top.sidebar %}
        <div class="back-to-top motion-element">
          <i class="fa fa-arrow-up"></i>
          <span>0%</span>
        </div>
      {%- endif %}

      {%- if theme.show_sidebar_category == true %}
      <ul class="sidebar-nav category-post">
        <li class="sidebar-category-post">          
          {{ partial('_partials/sidebar/darrellcustom-category-post.swig', {page: page}) }}
        </li>
      </ul>
      {%- endif %}


      {%- if theme.show_adsense_ad == true %}
      <ul class="sidebar-nav sense-layout">
        <li class="sidebar-sense-layout">          
          {{ partial('_partials/sidebar/darrellcustom-adSense.swig') }}
        </li>
      </ul>
      {%- endif %}
    </div>
  </aside>
  <div id="sidebar-dimmer"></div>
{% endmacro %}
