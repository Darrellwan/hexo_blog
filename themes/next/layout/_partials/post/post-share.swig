{# 社群分享按鈕 #}
{%- set shareUrl = config.url + '/' + post.path %}
<div class="post-share">
  <span class="post-share-label">分享這篇文章</span>
  <div class="post-share-buttons">
    {# Facebook #}
    <a class="post-share-btn post-share-facebook"
       href="https://www.facebook.com/sharer/sharer.php?u={{ shareUrl | urlencode }}"
       target="_blank"
       rel="noopener noreferrer"
       title="分享到 Facebook">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>

    {# X (Twitter) #}
    <a class="post-share-btn post-share-x"
       href="https://twitter.com/intent/tweet?url={{ shareUrl | urlencode }}&text={{ post.title | urlencode }}"
       target="_blank"
       rel="noopener noreferrer"
       title="分享到 X">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
      </svg>
    </a>

    {# LinkedIn #}
    <a class="post-share-btn post-share-linkedin"
       href="https://www.linkedin.com/sharing/share-offsite/?url={{ shareUrl | urlencode }}"
       target="_blank"
       rel="noopener noreferrer"
       title="分享到 LinkedIn">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    </a>

    {# Threads #}
    <a class="post-share-btn post-share-threads"
       href="https://threads.net/intent/post?text={{ post.title | urlencode }}%20{{ shareUrl | urlencode }}"
       target="_blank"
       rel="noopener noreferrer"
       title="分享到 Threads">
      <i class="fa-brands fa-threads"></i>
    </a>

    {# LINE #}
    <a class="post-share-btn post-share-line"
       href="https://line.me/R/msg/text/{{ post.title | urlencode }}%0A{{ shareUrl | urlencode }}"
       target="_blank"
       rel="noopener noreferrer"
       title="分享到 LINE">
      <i class="fa-brands fa-line"></i>
    </a>

    {# 複製連結 #}
    <button class="post-share-btn post-share-copy"
            onclick="copyPostLink()"
            title="複製連結">
      <i class="fa-solid fa-link"></i>
      <span class="post-share-copy-tooltip">已複製！</span>
    </button>
  </div>
</div>
