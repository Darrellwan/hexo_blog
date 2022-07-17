<script id="page-datalayer">
  let currentPageData = {
    title : "{{ page.title }}",
    page_date : "{{ page.date }}",
    page_updated : "{{ page.updated }}",
    page_categories : "{{ page.categories }}",
    page_tags : "{{ page.tags }}",
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
  window.dataLayer.push(currentPageData)
</script>
