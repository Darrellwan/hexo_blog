{% import 'menu-item.swig' as menu_item with context %}

<nav class="site-nav">
{%- if theme.menu %}
  <ul id="menu" class="main-menu menu">
    {%- for name, path in theme.menu %}
      {%- set respath = path %}
      {%- if path == '[object Object]' %}
        {# Main Menu (default menu item for Submenu) #}
        {%- for subname, subpath in path %}
          {%- set itemName = subname | lower %}
          {%- set respath = subpath %}
          {%- if itemName == 'default' %}
            {%- set itemName = name | lower %}
            {{ menu_item.render(name, itemName, respath) }}
          {%- endif %}
        {%- endfor %}
      {% else %}
        {# Main Menu (standard menu items) #}
        {%- set itemName = name | lower %}
        {{- menu_item.render(name, itemName, respath) | trim }}
      {%- endif %}
    {%- endfor %}

    {%- if theme.algolia_search.enable or theme.local_search.enable %}
      <li class="menu-item menu-item-search">
        <a role="button" class="popup-trigger">
          {%- if theme.menu_settings.icons %}<i class="fa fa-search fa-fw"></i>{%- endif %}{{ __('menu.search') }}
        </a>
      </li>
    {%- endif %}

    {%- if theme.social %}
      <div class="links-of-author motion-element">
        {%- for name, link in theme.social %}
          <span class="links-of-author-item">
          {%- set sidebarURL = link.split('||')[0] | trim %}
          {%- if theme.social_icons.enable %}
            {%- set sidebarIcon = '<i class="' + link.split('||')[1] | trim + ' fa-fw"></i>' %}
          {%- else %}
            {%- set sidebarIcon = '' %}
          {%- endif %}
          {%- if theme.social_icons.enable and theme.social_icons.icons_only %}
            {%- set sidebarText = '' %}
          {%- else %}
            {%- set sidebarText = name %}
          {%- endif %}
            {{ next_url(sidebarURL, sidebarIcon + sidebarText, {title: name + ' → ' + sidebarURL}) }}
          </span>
          <br>
        {%- endfor %}
      </div>
    {%- endif %}
  </ul>
{%- endif %}
</nav>
