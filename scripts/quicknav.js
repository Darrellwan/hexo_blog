/**
 * Quick Navigation Tag Plugin for Hexo
 * Usage: {% quickNav %}
 * navItems
 * {% endquickNav %}
 */

hexo.extend.tag.register('quickNav', function(_, content) {
  try {
    const contentStr = Array.isArray(content) ? content.join('') : (content || '');
    const navItems = JSON.parse(contentStr.trim());
    
    let html = '<nav class="quick-nav">\n';
    html += '  <strong class="nav-heading">本文目錄</strong>\n';
    html += '  <ul class="nav-list">\n';
    
    navItems.forEach(item => {
      html += `    <li class="nav-item">\n`;
      html += `      <a href="#${item.anchor}" class="nav-link">\n`;
      html += `        <span class="nav-title">${item.text}</span>\n`;
      if (item.desc) {
        html += `        <span class="nav-desc">${item.desc}</span>\n`;
      }
      html += `      </a>\n`;
      html += `    </li>\n`;
    });
    
    html += '  </ul>\n';
    html += '</nav>';
    html += `
<script>
document.addEventListener('DOMContentLoaded', function() {
  const quickNavLinks = document.querySelectorAll('.quick-nav .nav-link');
  quickNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
</script>`;
    
    return html;
  } catch (error) {
    return `<!-- QuickNav JSON Parse Error: ${error.message} -->`;
  }
}, {ends: true});