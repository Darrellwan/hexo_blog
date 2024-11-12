{%- if page.preload and page.preload.length %}
  {% for preloadImage in page.preload %}
    {% if preloadImage.endsWith('.jpg') or preloadImage.endsWith('.jpeg') %}
      <link rel="preload" href="{{preloadImage}}" as="image" type="image/jpeg">
    {% elif preloadImage.endsWith('.png') %}
      <link rel="preload" href="{{preloadImage}}" as="image" type="image/png">
    {% elif preloadImage.endsWith('.webp') %}
      <link rel="preload" href="{{preloadImage}}" as="image" type="image/webp">
    {% elif preloadImage.endsWith('.gif') %}
      <link rel="preload" href="{{preloadImage}}" as="image" type="image/gif">
    {% endif %}
  {% endfor %}
{%- endif %}
