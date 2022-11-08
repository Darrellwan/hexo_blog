{%- if page.prev or page.next %}
  <nav class="pagination" role="navigation">
    {{
      custom_paginator({
        prev_text: '<i class="fa fa-angle-left"></i>',
        next_text: '<i class="fa fa-angle-right"></i>',
        prev_aria: __('accessibility.prev_page'),
        next_aria: __('accessibility.next_page'),
        mid_size : 1,
        escape   : false
      })
    }}
  </nav>
{%- endif %}
