
{%- if page.categories and page.categories.length %}
    {%- for cat in page.categories.toArray() %}
        <ul class="sidebar-nav motion-element">
            <li class="sidebar-nav-active">
               {{cat.name}}
            </li>
        </ul>
        {%- set postByCategory = site.categories.findOne({name: cat.name}).posts.sort('date', -1)  %}  
        {{ list_posts(postByCategory, {class:"sidebar-category-post"}) }}
    {%- endfor %}
{%- endif %}