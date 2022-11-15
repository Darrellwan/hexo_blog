
{%- if page.categories and page.categories.length %}
    {%- for cat in page.categories.toArray() %}
        <ul class="sidebar-nav motion-element">
            <li class="sidebar-nav-active category-post-name">
                <a href="{{ url_for(cat.path) }}" itemprop="url" rel="index">{{cat.name}} 相關文章</a>               
            </li>
        </ul>
        {%- set postByCategory = site.categories.findOne({name: cat.name}).posts.sort('date', -1)  %}  
        <div>
        {{ list_posts(postByCategory, {class:"sidebar-category-post", amount:6}) }}
        </div>
    {%- endfor %}
{%- endif %}