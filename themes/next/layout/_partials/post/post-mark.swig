{%- if is_post() %}
  <script id="mark-js" src="https://cdn.jsdelivr.net/gh/julmot/mark.js/dist/mark.min.js"></script>
  <script id="mark-js-execute">
    function initMark() {
      const context = document.querySelector('.post-toc');
      if (context) {
        const markInstance = new Mark(context);
        markInstance.mark('n8n', {
          className: 'highlight-n8n'
        });
      }
    }
    document.addEventListener('DOMContentLoaded', initMark);
  </script>
{%- endif %}