{%- set brandCacheId = false %}
{%- if theme.cache.enable %}
  {%- if is_home() %}
    {%- set brandCacheId = 'header-brand-home' %}
  {%- else %}
    {%- set brandCacheId = 'header-brand-page' %}
  {%- endif %}
{%- endif %}
{{ partial('_partials/header/brand.swig', {isHome: is_home()}, {cache: brandCacheId}) }}

{{ partial('_partials/header/menu.swig', {}, {cache: theme.cache.enable}) }}

{{ partial('_partials/search/index.swig', {}, {cache: theme.cache.enable}) }}

{{- next_inject('header') }}
