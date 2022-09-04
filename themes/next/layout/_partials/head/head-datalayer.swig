<script id="page-datalayer">
  {%- if page.categories and page.categories.length %}
      let category_arr = [];
      {%- for cat in page.categories.toArray() %}
        category_arr.push("{{ cat.name }}")
      {%- endfor %}
  {%- endif %}

  {%- if page.tags and page.tags.length %}
      let tags_arr = [];
      {%- for tag in page.tags.toArray() %}
        tags_arr.push("{{ tag.name }}")
      {%- endfor %}
  {%- endif %}

  let currentPageData = {
    title : "{{ page.title }}",
    page_date : "{{ page.date }}",
    page_updated : "{{ page.updated }}",
    page_categories : category_arr,
    page_tags : tags_arr,
    page_path : "{{ page.path }}",
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
    type: "{{page.page_type}}"
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(currentPageData);
  console.log("123");
</script>
