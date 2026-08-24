{# Speculation Rules API for Instant Navigation #}
<script type="speculationrules">
{
  "prerender": [
    {
      "where": {
        "and": [
          { "href_matches": "/*" },
          { "not": { "href_matches": "/tools/*" } },
          { "not": { "href_matches": "/links/*" } },
          { "not": { "href_matches": "/n8n-expert/*" } },
          { "not": { "href_matches": "/n8n-expert-v2/*" } },
          { "not": { "href_matches": "/n8n-tutorial-resources/*" } },
          { "not": { "href_matches": "/email_subscribe/*" } },
          { "not": { "href_matches": "/404/*" } },
          { "not": { "href_matches": "/categories/*" } },
          { "not": { "href_matches": "/tags/*" } },
          { "not": { "href_matches": "/archives*" } },
          { "not": { "href_matches": "/page/*" } },
          { "not": { "href_matches": "/*.pdf" } },
          { "not": { "selector_matches": "[href*='?']" } },
          { "not": { "selector_matches": "[href*='#']" } },
          { "not": { "selector_matches": ".menu-item a" } },
          { "not": { "selector_matches": "[target=_blank]" } },
          { "not": { "selector_matches": "[rel~=nofollow]" } },
          { "not": { "selector_matches": ".no-prerender" } }
        ]
      },
      "eagerness": "moderate"
    }
  ]
}
</script>
