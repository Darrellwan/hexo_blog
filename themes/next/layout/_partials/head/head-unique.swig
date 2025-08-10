{{ custom_open_graph() }}
{{ canonical() }}
{# Exports some front-matter variables to Front-End #}
<script id="page-configurations">
  CONFIG.page = {
    sidebar: {{ page.sidebar | json }},
    isHome : {{ is_home() }},
    isPost : {{ is_post() }},
    lang   : '{{ page.lang }}'
  };
</script>
{{ json_ld() }}
{{ breadcrumb_ld() }}
{{ darrell_org_structured_data() }}
{{ darrell_web_structured_data() }}