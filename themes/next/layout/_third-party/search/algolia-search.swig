{%- set algolia_search_uri = theme.vendors.algolia_search or next_vendors('//cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.umd.js') %}
{%- set instant_search_uri = theme.vendors.instant_search or next_vendors('//cdn.jsdelivr.net/npm/instantsearch.js@4/dist/instantsearch.production.min.js') %}
<script src="{{ algolia_search_uri }}"></script>
<script src="{{ instant_search_uri }}"></script>

<script>
window.addEventListener('load', function() {
  var script = document.createElement('script');
  script.src = '{{ url_for('/js/algolia-search.js') }}';
  document.body.appendChild(script);
});
</script>
