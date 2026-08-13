<script id="page-datalayer">

  let category_arr = "";
  {%- if page.categories and page.categories.length %}
  category_arr = [];
      {%- for cat in page.categories.toArray() %}
        category_arr.push("{{ cat.name }}")
      {%- endfor %}
  {%- endif %}

  let tags_arr = "";
  {%- if page.tags and page.tags.length %}
  tags_arr = [];
      {%- for tag in page.tags.toArray() %}
        tags_arr.push("{{ tag.name }}")
      {%- endfor %}
  {%- endif %}

  let currentPageData = {
    title : "{{ page.title }}",
    page_date : "{{ page.date }}",
    page_id : "{{ page.id }}",
    page_updated : "{{ page.updated }}",
    page_categories : category_arr,
    page_tags : tags_arr,
    {#- page.path 是 Hexo 的輸出檔路徑（首頁是 index.html、分類頁是 categories/n8n/index.html），
        跟 GA4 內建的 page_path 形狀不同。補開頭斜線並去掉 index.html 之後，
        首頁→/、分類→/categories/n8n/、文章→/n8n-xxx/，
        才能跟 GA4 內建維度以及站內搜尋 select_item 的 item_id 對得起來 -#}
    page_path : "/{{ page.path | replace('index.html', '') }}",
    url : "{{ url }}",
    post_created : "{{ page.created }}",
    post_description : "{{ page.description }}",
    post_direction : "{{ page.direction }}",
    post_excerpt : "{{ page.excerpt }}",
    post_header : "{{ page.header }}",
    post_permalink : "{{ page.permalink }}",
    post_posted : "{{ page.posted }}",
    post_sticky : "{{ page.sticky }}",
    post_views : "{{ page.views }}",
    type: "{{page.page_type}}",
    customgtmid: "{{page.gtmid}}"
  };
  window.customizedGtmId = "{{page.gtmid}}" || false;
  window.dataLayer = window.dataLayer || [];

  (function(){
      var pageLoadStartTime = window.performance.timing.navigationStart;
      var currentTime = new Date().getTime();
      var pageLoadTime = currentTime - pageLoadStartTime;
  })()
  window.dataLayer.push(currentPageData);

  
</script>
