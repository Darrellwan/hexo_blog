# 舊站 URL 對照結果

> 本表由 `tests/verify-url-contract.ts` 產生。新版狀態只依 `dist/` 實際檔案與 `public/_redirects` 實際規則判定，舊站狀態逐條抓取線上回應。

產生時間：2026-08-27T03:59:57.790Z

| 舊 URL | 預期新狀態 | 依據 |
|---|---|---|
| / | 200 | dist/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /.well-known/brave-rewards-verification.txt | 200 | dist/.well-known/brave-rewards-verification.txt 存在；來源：source/.well-known/brave-rewards-verification.txt；舊站 HTTP 200 |
| /2022-martech-trends-bnext/ | 200 | dist/2022-martech-trends-bnext/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /2024-3rd-party-cookie-in-google-chrome/ | 200 | dist/2024-3rd-party-cookie-in-google-chrome/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /404.html | 200 | dist/404.html 存在；來源：source/404/index.md 產生；舊站 HTTP 308 |
| /404/ | intentional-404 | Hexo 把 404 頁掛在這個網址且回 200；新站由 not_found_handling 供應 404.html 並回真正的 404；來源：live sitemap.xml；舊站 HTTP 200 |
| /4b2a024905b2b1bbfd53d66fef2e9eed.txt | 200 | dist/4b2a024905b2b1bbfd53d66fef2e9eed.txt 存在；來源：source/4b2a024905b2b1bbfd53d66fef2e9eed.txt；舊站 HTTP 200 |
| /ads.txt | 200 | dist/ads.txt 存在；來源：source/ads.txt；舊站 HTTP 200 |
| /analytics-debuuger-v2-3-2/ | 200 | dist/analytics-debuuger-v2-3-2/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /archives/ | 200 | dist/archives/index.html 存在；來源：main.yml archive_dir + archive_generator；舊站 HTTP 200 |
| /archives/2022/ | 缺口 | dist/archives/2022/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.yearly + source/_posts date；舊站 HTTP 200 |
| /archives/2022/07/ | 缺口 | dist/archives/2022/07/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2022/08/ | 缺口 | dist/archives/2022/08/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2022/09/ | 缺口 | dist/archives/2022/09/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2022/10/ | 缺口 | dist/archives/2022/10/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2022/11/ | 缺口 | dist/archives/2022/11/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2022/12/ | 缺口 | dist/archives/2022/12/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/ | 缺口 | dist/archives/2023/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.yearly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/01/ | 缺口 | dist/archives/2023/01/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/02/ | 缺口 | dist/archives/2023/02/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/04/ | 缺口 | dist/archives/2023/04/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/05/ | 缺口 | dist/archives/2023/05/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/07/ | 缺口 | dist/archives/2023/07/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/08/ | 缺口 | dist/archives/2023/08/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/09/ | 缺口 | dist/archives/2023/09/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/10/ | 缺口 | dist/archives/2023/10/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/11/ | 缺口 | dist/archives/2023/11/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2023/12/ | 缺口 | dist/archives/2023/12/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/ | 缺口 | dist/archives/2024/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.yearly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/01/ | 缺口 | dist/archives/2024/01/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/02/ | 缺口 | dist/archives/2024/02/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/03/ | 缺口 | dist/archives/2024/03/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/04/ | 缺口 | dist/archives/2024/04/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/05/ | 缺口 | dist/archives/2024/05/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/06/ | 缺口 | dist/archives/2024/06/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/07/ | 缺口 | dist/archives/2024/07/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/08/ | 缺口 | dist/archives/2024/08/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/09/ | 缺口 | dist/archives/2024/09/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/10/ | 缺口 | dist/archives/2024/10/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/11/ | 缺口 | dist/archives/2024/11/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2024/12/ | 缺口 | dist/archives/2024/12/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/ | 缺口 | dist/archives/2025/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.yearly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/01/ | 缺口 | dist/archives/2025/01/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/02/ | 缺口 | dist/archives/2025/02/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/03/ | 缺口 | dist/archives/2025/03/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/04/ | 缺口 | dist/archives/2025/04/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/05/ | 缺口 | dist/archives/2025/05/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/06/ | 缺口 | dist/archives/2025/06/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/07/ | 缺口 | dist/archives/2025/07/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/08/ | 缺口 | dist/archives/2025/08/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/09/ | 缺口 | dist/archives/2025/09/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/10/ | 缺口 | dist/archives/2025/10/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/11/ | 缺口 | dist/archives/2025/11/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2025/12/ | 缺口 | dist/archives/2025/12/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2026/ | 缺口 | dist/archives/2026/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.yearly + source/_posts date；舊站 HTTP 200 |
| /archives/2026/01/ | 缺口 | dist/archives/2026/01/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2026/03/ | 缺口 | dist/archives/2026/03/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2026/04/ | 缺口 | dist/archives/2026/04/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2026/05/ | 缺口 | dist/archives/2026/05/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2026/06/ | 缺口 | dist/archives/2026/06/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2026/07/ | 缺口 | dist/archives/2026/07/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/2026/08/ | 缺口 | dist/archives/2026/08/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.monthly + source/_posts date；舊站 HTTP 200 |
| /archives/page/2/ | 缺口 | dist/archives/page/2/index.html 不存在，且未命中 _redirects 308；來源：main.yml archive_generator.per_page 分頁；舊站 HTTP 200 |
| /bouncer-to-clean-email-list/ | 200 | dist/bouncer-to-clean-email-list/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /categories/ | intentional-404 | 決策 5 不搬；來源：live sitemap.xml、main.yml category_dir、source/categories/index.md 產生；舊站 HTTP 200 |
| /categories/%E5%B7%A5%E5%85%B7/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「工具」；舊站 HTTP 200 |
| /categories/AI-%E5%B7%A5%E5%85%B7/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：source/_posts front matter category「AI 工具」；舊站 HTTP 404 |
| /categories/AI/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「AI」；舊站 HTTP 200 |
| /categories/ChatGPT/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「ChatGPT」；舊站 HTTP 200 |
| /categories/Claude/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Claude」；舊站 HTTP 200 |
| /categories/Code-Development/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Code Development」；舊站 HTTP 200 |
| /categories/Google-Analytics-4/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Google Analytics 4」；舊站 HTTP 200 |
| /categories/Google-App-Script/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Google App Script」；舊站 HTTP 200 |
| /categories/Google-Tag-Manager/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Google Tag Manager」；舊站 HTTP 200 |
| /categories/Hexo/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Hexo」；舊站 HTTP 200 |
| /categories/Looker-Studio/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Looker Studio」；舊站 HTTP 200 |
| /categories/Marketing/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Marketing」；舊站 HTTP 200 |
| /categories/Martech/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Martech」；舊站 HTTP 200 |
| /categories/n8n/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「n8n」；舊站 HTTP 200 |
| /categories/Pixel-Tracking/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Pixel Tracking」；舊站 HTTP 200 |
| /categories/Unboxing/ | intentional-404 | 決策 5 不搬（/categories/ 路徑群組）；來源：live sitemap.xml、source/_posts front matter category「Unboxing」；舊站 HTTP 200 |
| /chatgpt-broken-in-web-browser/ | 200 | dist/chatgpt-broken-in-web-browser/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /chatgpt-coding-assistant-3rdparty-detect/ | 200 | dist/chatgpt-coding-assistant-3rdparty-detect/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /chatgpt-sora-create-image-with-text/ | 200 | dist/chatgpt-sora-create-image-with-text/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /chatgpt-work-with-apps/ | 200 | dist/chatgpt-work-with-apps/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /claude_code_update_202509/ | 200 | dist/claude_code_update_202509/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /claude-code-agent/ | 200 | dist/claude-code-agent/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /claude-code-channels-discord-telegram/ | 200 | dist/claude-code-channels-discord-telegram/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /claude-code-fable-5/ | 200 | dist/claude-code-fable-5/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /claude-code-new-command-line-tool/ | 200 | dist/claude-code-new-command-line-tool/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /claude-cowork-intro/ | 200 | dist/claude-cowork-intro/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /claude-desktop-new-mcp-features-review/ | 200 | dist/claude-desktop-new-mcp-features-review/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /claude-managed-agents/ | 200 | dist/claude-managed-agents/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /cloudflare-worker-url-shortener/ | 200 | dist/cloudflare-worker-url-shortener/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /cursor-mcp-server-guide/ | 200 | dist/cursor-mcp-server-guide/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /email_subscribe/ | 200 | dist/email_subscribe/index.html 存在；來源：live sitemap.xml、source/email_subscribe/index.md 產生；舊站 HTTP 200 |
| /email-dmarc-gmail-new-policy-in-202402/ | 200 | dist/email-dmarc-gmail-new-policy-in-202402/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /facebook-pixel-install-in-google-tag-manager/ | 200 | dist/facebook-pixel-install-in-google-tag-manager/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /firebase_notification_click_any_link/ | 200 | dist/firebase_notification_click_any_link/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-certification-announced/ | 200 | dist/ga4-certification-announced/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-certification-review/ | 200 | dist/ga4-certification-review/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-check-installed/ | 200 | dist/ga4-check-installed/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-countdown-less-then-80-days/ | 200 | dist/ga4-countdown-less-then-80-days/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-data-thresholds/ | 200 | dist/ga4-data-thresholds/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-ecommerce-recommend-events-datalayer/ | 200 | dist/ga4-ecommerce-recommend-events-datalayer/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-export-google-sheet-reports-builder/ | 200 | dist/ga4-export-google-sheet-reports-builder/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-gtm-best-tool-analytics-debugger/ | 200 | dist/ga4-gtm-best-tool-analytics-debugger/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-issue-ecommerce-revenue-inconsistency/ | 200 | dist/ga4-issue-ecommerce-revenue-inconsistency/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-item-name-show-zero-purchase/ | 200 | dist/ga4-item-name-show-zero-purchase/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-new-release-avg-pageview-average-session-duration-and-views-per-session/ | 200 | dist/ga4-new-release-avg-pageview-average-session-duration-and-views-per-session/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-new-release-search-datastream-property-info/ | 200 | dist/ga4-new-release-search-datastream-property-info/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-new-release-user-purchase-journey/ | 200 | dist/ga4-new-release-user-purchase-journey/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-parameter-name-value-limit/ | 200 | dist/ga4-parameter-name-value-limit/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-search-console-mcp-install/ | 200 | dist/ga4-search-console-mcp-install/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-session-hit-user-explain/ | 200 | dist/ga4-session-hit-user-explain/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-unwanted-referrals/ | 200 | dist/ga4-unwanted-referrals/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /ga4-update-benchmark/ | 200 | dist/ga4-update-benchmark/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /glows-ai-cloud-gpu-service/ | 200 | dist/glows-ai-cloud-gpu-service/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gmail-annotations-with-klaviyo/ | 200 | dist/gmail-annotations-with-klaviyo/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-analytics-data-api-filter-in-google-app-script/ | 200 | dist/google-analytics-data-api-filter-in-google-app-script/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-antigravity-ide/ | 200 | dist/google-antigravity-ide/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-app-script-cache-service/ | 200 | dist/google-app-script-cache-service/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-app-script-gmail-nice-email-template/ | 200 | dist/google-app-script-gmail-nice-email-template/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-app-script-test-webhook/ | 200 | dist/google-app-script-test-webhook/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-app-script-threads-api/ | 200 | dist/google-app-script-threads-api/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-app-script-with-chatgpt-openai/ | 200 | dist/google-app-script-with-chatgpt-openai/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-gemini-cli/ | 200 | dist/google-gemini-cli/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-optimize-install-and-connect-ga4/ | 200 | dist/google-optimize-install-and-connect-ga4/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-tag-manager-advanced-skill-using-ga4-track-website-performance/ | 200 | dist/google-tag-manager-advanced-skill-using-ga4-track-website-performance/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-tag-manager-ga4-configuration-fieldtoset/ | 200 | dist/google-tag-manager-ga4-configuration-fieldtoset/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-tag-manager-google-tag-release/ | 200 | dist/google-tag-manager-google-tag-release/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-tag-manager-skills-css-selector-resource/ | 200 | dist/google-tag-manager-skills-css-selector-resource/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-tag-manager-store-data-storage-cookie/ | 200 | dist/google-tag-manager-store-data-storage-cookie/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /google-tag-manager-variable-datalayer-version-one-and-two/ | 200 | dist/google-tag-manager-variable-datalayer-version-one-and-two/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /grok-bot-review/ | 200 | dist/grok-bot-review/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-chrome-devtool-tracking-skill/ | 200 | dist/gtm-chrome-devtool-tracking-skill/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-datalayer-broken-reset/ | 200 | dist/gtm-datalayer-broken-reset/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-ga4-new-feature-use-ecommerce-datalayer/ | 200 | dist/gtm-ga4-new-feature-use-ecommerce-datalayer/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-get-datalayer-value-by-js/ | 200 | dist/gtm-get-datalayer-value-by-js/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-install-line-tag-pixel/ | 200 | dist/gtm-install-line-tag-pixel/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-size-limit/ | 200 | dist/gtm-size-limit/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-trigger-all-click-link-click/ | 200 | dist/gtm-trigger-all-click-link-click/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-trigger-custom-event/ | 200 | dist/gtm-trigger-custom-event/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-trigger-elementvisibility/ | 200 | dist/gtm-trigger-elementvisibility/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-trigger-pageview-domready-windowload/ | 200 | dist/gtm-trigger-pageview-domready-windowload/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-variable-lookuptable-introduce/ | 200 | dist/gtm-variable-lookuptable-introduce/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /gtm-version-rollback/ | 200 | dist/gtm-version-rollback/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /hello-to-hexo/ | 200 | dist/hello-to-hexo/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /hexo-algolia-event-tracking-with-insight/ | 200 | dist/hexo-algolia-event-tracking-with-insight/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /hexo-algolia-tracking/ | 200 | dist/hexo-algolia-tracking/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /how-martech-tools-talk-integration/ | 200 | dist/how-martech-tools-talk-integration/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /how-to-ask-google-tag-manager-question/ | 200 | dist/how-to-ask-google-tag-manager-question/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /html5-video-demo/ | intentional-404 | 決策 5 不搬；來源：live sitemap.xml、source/html5-video-demo/index.md 產生；舊站 HTTP 200 |
| /line-mcp-server/ | 200 | dist/line-mcp-server/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /links/ | 200 | dist/links/index.html 存在；來源：source/links/index.html 產生；舊站 HTTP 200 |
| /llms.txt | 200 | dist/llms.txt 存在；來源：source/llms.txt；舊站 HTTP 200 |
| /looker-studio-new-release-202212-ga4-api-quota/ | 200 | dist/looker-studio-new-release-202212-ga4-api-quota/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /manifest.json | 200 | dist/manifest.json 存在；來源：live sitemap.xml、source/manifest.json；舊站 HTTP 200 |
| /n8n_structured_output_parser_node/ | 200 | dist/n8n_structured_output_parser_node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-2-0-update/ | 200 | dist/n8n-2-0-update/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-aggregate-split-out/ | 200 | dist/n8n-aggregate-split-out/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-apify-node/ | 200 | dist/n8n-apify-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-built-in-variables/ | 200 | dist/n8n-built-in-variables/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-bycrawl-node/ | 200 | dist/n8n-bycrawl-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-cli-guide/ | 200 | dist/n8n-cli-guide/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-datatables-node/ | 200 | dist/n8n-datatables-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-debug-line-invalid-json/ | 200 | dist/n8n-debug-line-invalid-json/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-deployment/ | 200 | dist/n8n-deployment/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-elevenlabs-tts/ | 200 | dist/n8n-elevenlabs-tts/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-evaluations/ | 200 | dist/n8n-evaluations/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-expert-v2/ | intentional-404 | 決策 5 不搬；來源：source/n8n-expert-v2/index.html 產生；舊站 HTTP 404 |
| /n8n-expert/ | 200 | dist/n8n-expert/index.html 存在；來源：live sitemap.xml、source/n8n-expert/index.html 產生；舊站 HTTP 200 |
| /n8n-filter-node/ | 200 | dist/n8n-filter-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-gmail-node/ | 200 | dist/n8n-gmail-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-google-sheets-node/ | 200 | dist/n8n-google-sheets-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-if-switch/ | 200 | dist/n8n-if-switch/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-line-message-api/ | 200 | dist/n8n-line-message-api/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-line-messaging-community-node/ | 200 | dist/n8n-line-messaging-community-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-line-split-expense-workflow/ | 200 | dist/n8n-line-split-expense-workflow/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-merge-node/ | 200 | dist/n8n-merge-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-new-feature-folders/ | 200 | dist/n8n-new-feature-folders/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-node-s3-with-cloudflare-r2/ | 200 | dist/n8n-node-s3-with-cloudflare-r2/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-perplexity-node/ | 200 | dist/n8n-perplexity-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-poll-time-setting/ | 200 | dist/n8n-poll-time-setting/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-resources/ | 308 | _redirects 第 5 行（/n8n-resources/ → /n8n-tutorial-resources/）；舊站 HTTP 200 |
| /n8n-security-vulnerability-2025/ | 200 | dist/n8n-security-vulnerability-2025/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-service/ | 308 | _redirects 第 6 行（/n8n-service/ → /n8n-expert/）；舊站 HTTP 301 |
| /n8n-set-node/ | 200 | dist/n8n-set-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-time-saved-node/ | 200 | dist/n8n-time-saved-node/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-tips-pin/ | 200 | dist/n8n-tips-pin/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-tutorial-resources/ | 200 | dist/n8n-tutorial-resources/index.html 存在；來源：live sitemap.xml、source/n8n-tutorial-resources/index.md 產生；舊站 HTTP 200 |
| /n8n-update-log-v1/ | 200 | dist/n8n-update-log-v1/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-update-log/ | 200 | dist/n8n-update-log/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-webhook/ | 200 | dist/n8n-webhook/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-with-cloudflare-turnstile-CAPTCHA/ | 200 | dist/n8n-with-cloudflare-turnstile-CAPTCHA/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-with-slack/ | 200 | dist/n8n-with-slack/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-with-zeabur-timezone-issue/ | 200 | dist/n8n-with-zeabur-timezone-issue/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /n8n-zeabur-ai-hub-model-router/ | 200 | dist/n8n-zeabur-ai-hub-model-router/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /OneSignalSDKWorker.js | intentional-404 | 決策 5 不搬；來源：source/OneSignalSDKWorker.js；舊站 HTTP 200 |
| /openai-gpt-image-1-model-review/ | 200 | dist/openai-gpt-image-1-model-review/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /page/2/ | 308 | _redirects 第 103 行（/page/2/ → /posts/2/）；舊站 HTTP 200 |
| /page/3/ | 308 | _redirects 第 104 行（/page/3/ → /posts/3/）；舊站 HTTP 200 |
| /page/4/ | 308 | _redirects 第 105 行（/page/4/ → /posts/4/）；舊站 HTTP 200 |
| /page/5/ | 308 | _redirects 第 106 行（/page/5/ → /posts/5/）；舊站 HTTP 200 |
| /page/6/ | 308 | _redirects 第 107 行（/page/6/ → /posts/6/）；舊站 HTTP 200 |
| /page/7/ | 308 | _redirects 第 108 行（/page/7/ → /posts/7/）；舊站 HTTP 200 |
| /postiz-zeabur-threads-tutorial/ | 200 | dist/postiz-zeabur-threads-tutorial/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /pricing-in-martech-tools/ | 200 | dist/pricing-in-martech-tools/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /rclone-cloud-sync-backup/ | 200 | dist/rclone-cloud-sync-backup/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /resume-page.html | 200 | dist/resume-page.html 存在；來源：source/resume-page.html；舊站 HTTP 308 |
| /resume/ | intentional-404 | 決策 5 不搬；來源：live sitemap.xml、source/resume/index.md 產生；舊站 HTTP 200 |
| /robots.txt | 200 | dist/robots.txt 存在；來源：source/robots.txt；舊站 HTTP 200 |
| /rss.xml | 200 | dist/rss.xml 存在；來源：main.yml feed.path；舊站 HTTP 200 |
| /rss2_template.xml | intentional-404 | Hexo RSS 樣板檔，不是對外內容；來源：source/rss2_template.xml；舊站 HTTP 200 |
| /search.json | intentional-404 | Hexo 舊搜尋索引，已由 Pagefind 取代；來源：main.yml search.path；舊站 HTTP 200 |
| /send-push-to-me/ | 200 | dist/send-push-to-me/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /simmer-chrome-devtool-for-marketer/ | 200 | dist/simmer-chrome-devtool-for-marketer/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /simmer-martech-handbook/ | 200 | dist/simmer-martech-handbook/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /sitemap.xml | 200 | dist/sitemap.xml 存在；來源：main.yml sitemap.path；舊站 HTTP 200 |
| /stackoverflow-gtm-click-element-css-selector/ | 200 | dist/stackoverflow-gtm-click-element-css-selector/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /stackoverflow-gtm-rewrite-items-in-datalayer/ | 200 | dist/stackoverflow-gtm-rewrite-items-in-datalayer/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /stackoverflow-handle-comma-and-period/ | 200 | dist/stackoverflow-handle-comma-and-period/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /storylane-demo-website-new-feature/ | 200 | dist/storylane-demo-website-new-feature/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /sw.js | intentional-404 | 決策 5 不搬；來源：source/sw.js；舊站 HTTP 200 |
| /tags/ | 200 | dist/tags/index.html 存在；來源：live sitemap.xml、source/tags/index.md 產生；舊站 HTTP 200 |
| /tags/%E5%AE%8C%E6%95%B4%E6%B5%81%E7%A8%8B/ | 200 | dist/tags/完整流程/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「完整流程」；舊站 HTTP 200 |
| /tags/%E5%BB%A3%E5%91%8A%E6%8A%95%E6%94%BE/ | 舊站已 404 | dist/tags/廣告投放/index.html 不存在，且未命中 _redirects 308；來源：source/_posts front matter tag「廣告投放」；舊站本來就 404，不是搬家造成的；舊站 HTTP 404 |
| /tags/%E6%95%88%E8%83%BD%E5%84%AA%E5%8C%96/ | 200 | dist/tags/效能優化/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「效能優化」；舊站 HTTP 200 |
| /tags/%E6%95%B8%E6%93%9A%E8%99%95%E7%90%86/ | 200 | dist/tags/數據處理/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「數據處理」；舊站 HTTP 200 |
| /tags/%E6%AA%94%E6%A1%88%E5%90%8C%E6%AD%A5/ | 200 | dist/tags/檔案同步/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「檔案同步」；舊站 HTTP 200 |
| /tags/%E6%B4%BB%E5%8B%95%E5%BF%83%E5%BE%97/ | 200 | dist/tags/活動心得/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「活動心得」；舊站 HTTP 200 |
| /tags/%E7%94%9F%E7%94%A2%E5%8A%9B%E5%B7%A5%E5%85%B7/ | 200 | dist/tags/生產力工具/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「生產力工具」；舊站 HTTP 200 |
| /tags/%E7%A4%BE%E7%BE%A4%E5%95%8F%E7%AD%94/ | 200 | dist/tags/社群問答/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「社群問答」；舊站 HTTP 200 |
| /tags/%E8%87%AA%E5%8B%95%E5%8C%96/ | 200 | dist/tags/自動化/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「自動化」；舊站 HTTP 200 |
| /tags/%E8%A1%8C%E9%8A%B7%E5%B7%A5%E5%85%B7/ | 200 | dist/tags/行銷工具/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「行銷工具」；舊站 HTTP 200 |
| /tags/%E8%B3%87%E5%AE%89/ | 200 | dist/tags/資安/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「資安」；舊站 HTTP 200 |
| /tags/%E8%B3%87%E6%96%99%E7%AF%A9%E9%81%B8/ | 200 | dist/tags/資料篩選/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「資料篩選」；舊站 HTTP 200 |
| /tags/%E9%96%8B%E7%99%BC%E5%B7%A5%E5%85%B7/ | 200 | dist/tags/開發工具/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「開發工具」；舊站 HTTP 200 |
| /tags/%E9%9B%B2%E7%AB%AF%E5%82%99%E4%BB%BD/ | 200 | dist/tags/雲端備份/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「雲端備份」；舊站 HTTP 200 |
| /tags/3rd-party-cookie/ | 200 | dist/tags/3rd-party-cookie/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「3rd party cookie」；舊站 HTTP 200 |
| /tags/AI-Agent/ | 308 | _redirects 第 10 行（/tags/AI-Agent/ → /tags/ai-agent/）；舊站 HTTP 200 |
| /tags/AI-Service/ | 308 | _redirects 第 11 行（/tags/AI-Service/ → /tags/ai-service/）；舊站 HTTP 200 |
| /tags/AI/ | 308 | _redirects 第 9 行（/tags/AI/ → /tags/ai/）；舊站 HTTP 200 |
| /tags/AI/page/2/ | 308 | _redirects 第 90 行（/tags/AI/page/2/ → /tags/ai/）；舊站 HTTP 200 |
| /tags/Algolia/ | 308 | _redirects 第 12 行（/tags/Algolia/ → /tags/algolia/）；舊站 HTTP 200 |
| /tags/Anthropic/ | 308 | _redirects 第 13 行（/tags/Anthropic/ → /tags/anthropic/）；舊站 HTTP 200 |
| /tags/Antigravity-2-0/ | 308 | _redirects 第 15 行（/tags/Antigravity-2-0/ → /tags/antigravity-2-0/）；舊站 HTTP 200 |
| /tags/Antigravity-CLI/ | 308 | _redirects 第 16 行（/tags/Antigravity-CLI/ → /tags/antigravity-cli/）；舊站 HTTP 200 |
| /tags/Antigravity/ | 308 | _redirects 第 14 行（/tags/Antigravity/ → /tags/antigravity/）；舊站 HTTP 200 |
| /tags/API-Integration/ | 308 | _redirects 第 17 行（/tags/API-Integration/ → /tags/api-integration/）；舊站 HTTP 200 |
| /tags/Apify/ | 308 | _redirects 第 18 行（/tags/Apify/ → /tags/apify/）；舊站 HTTP 200 |
| /tags/browser/ | 200 | dist/tags/browser/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「browser」；舊站 HTTP 200 |
| /tags/BusyTag/ | 308 | _redirects 第 19 行（/tags/BusyTag/ → /tags/busytag/）；舊站 HTTP 200 |
| /tags/Cache/ | 308 | _redirects 第 20 行（/tags/Cache/ → /tags/cache/）；舊站 HTTP 200 |
| /tags/Chatgpt/ | 308 | _redirects 第 21 行（/tags/Chatgpt/ → /tags/chatgpt/）；舊站 HTTP 200 |
| /tags/ChatGPT/ | 308 | _redirects 第 22 行（/tags/ChatGPT/ → /tags/chatgpt/）；舊站 HTTP 200 |
| /tags/Chrome-Devtool/ | 308 | _redirects 第 23 行（/tags/Chrome-Devtool/ → /tags/chrome-devtool/）；舊站 HTTP 200 |
| /tags/Claude-API/ | 308 | _redirects 第 25 行（/tags/Claude-API/ → /tags/claude-api/）；舊站 HTTP 404 |
| /tags/Claude-Code-Agent/ | 308 | _redirects 第 27 行（/tags/Claude-Code-Agent/ → /tags/claude-code-agent/）；舊站 HTTP 200 |
| /tags/Claude-Code/ | 308 | _redirects 第 26 行（/tags/Claude-Code/ → /tags/claude-code/）；舊站 HTTP 200 |
| /tags/Claude-Managed-Agents/ | 308 | _redirects 第 28 行（/tags/Claude-Managed-Agents/ → /tags/claude-managed-agents/）；舊站 HTTP 404 |
| /tags/Claude/ | 308 | _redirects 第 24 行（/tags/Claude/ → /tags/claude/）；舊站 HTTP 200 |
| /tags/cloudflare-turnstile/ | 200 | dist/tags/cloudflare-turnstile/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「cloudflare turnstile」；舊站 HTTP 200 |
| /tags/cloudflare/ | 200 | dist/tags/cloudflare/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「cloudflare」；舊站 HTTP 200 |
| /tags/Cloudflare/ | 308 | _redirects 第 29 行（/tags/Cloudflare/ → /tags/cloudflare/）；舊站 HTTP 200 |
| /tags/Codex/ | 308 | _redirects 第 30 行（/tags/Codex/ → /tags/codex/）；舊站 HTTP 404 |
| /tags/Cursor/ | 308 | _redirects 第 31 行（/tags/Cursor/ → /tags/cursor/）；舊站 HTTP 200 |
| /tags/DataLayer/ | 308 | _redirects 第 32 行（/tags/DataLayer/ → /tags/datalayer/）；舊站 HTTP 200 |
| /tags/deployment/ | 200 | dist/tags/deployment/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「deployment」；舊站 HTTP 200 |
| /tags/Development/ | 308 | _redirects 第 33 行（/tags/Development/ → /tags/development/）；舊站 HTTP 200 |
| /tags/Discord/ | 308 | _redirects 第 34 行（/tags/Discord/ → /tags/discord/）；舊站 HTTP 200 |
| /tags/DPA/ | 308 | _redirects 第 35 行（/tags/DPA/ → /tags/dpa/）；舊站 HTTP 200 |
| /tags/ElevenLabs/ | 308 | _redirects 第 36 行（/tags/ElevenLabs/ → /tags/elevenlabs/）；舊站 HTTP 200 |
| /tags/Email-DNS/ | 308 | _redirects 第 37 行（/tags/Email-DNS/ → /tags/email-dns/）；舊站 HTTP 200 |
| /tags/Email-Marketing/ | 308 | _redirects 第 38 行（/tags/Email-Marketing/ → /tags/email-marketing/）；舊站 HTTP 200 |
| /tags/Facebook-Pixel/ | 308 | _redirects 第 39 行（/tags/Facebook-Pixel/ → /tags/facebook-pixel/）；舊站 HTTP 200 |
| /tags/FCM/ | 308 | _redirects 第 40 行（/tags/FCM/ → /tags/fcm/）；舊站 HTTP 200 |
| /tags/firebase/ | 200 | dist/tags/firebase/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「firebase」；舊站 HTTP 200 |
| /tags/GA4-%E8%AD%89%E7%85%A7/ | 308 | _redirects 第 44 行（/tags/GA4-%E8%AD%89%E7%85%A7/ → /tags/ga4-%E8%AD%89%E7%85%A7/）；舊站 HTTP 200 |
| /tags/GA4-New-Release/ | 308 | _redirects 第 42 行（/tags/GA4-New-Release/ → /tags/ga4-new-release/）；舊站 HTTP 200 |
| /tags/GA4-Update/ | 308 | _redirects 第 43 行（/tags/GA4-Update/ → /tags/ga4-update/）；舊站 HTTP 200 |
| /tags/GA4/ | 308 | _redirects 第 41 行（/tags/GA4/ → /tags/ga4/）；舊站 HTTP 200 |
| /tags/Gemini-CLI/ | 308 | _redirects 第 46 行（/tags/Gemini-CLI/ → /tags/gemini-cli/）；舊站 HTTP 200 |
| /tags/Gemini/ | 308 | _redirects 第 45 行（/tags/Gemini/ → /tags/gemini/）；舊站 HTTP 200 |
| /tags/git-action/ | 200 | dist/tags/git-action/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「git-action」；舊站 HTTP 200 |
| /tags/Gmail/ | 308 | _redirects 第 47 行（/tags/Gmail/ → /tags/gmail/）；舊站 HTTP 200 |
| /tags/Google-Analytics-4/ | 308 | _redirects 第 49 行（/tags/Google-Analytics-4/ → /tags/google-analytics-4/）；舊站 HTTP 200 |
| /tags/Google-Analytics-4/page/2/ | 308 | _redirects 第 91 行（/tags/Google-Analytics-4/page/2/ → /tags/google-analytics-4/2/）；舊站 HTTP 200 |
| /tags/Google-Analytics-4/page/3/ | 308 | _redirects 第 92 行（/tags/Google-Analytics-4/page/3/ → /tags/google-analytics-4/）；舊站 HTTP 200 |
| /tags/Google-Analytics-Data-API/ | 308 | _redirects 第 50 行（/tags/Google-Analytics-Data-API/ → /tags/google-analytics-data-api/）；舊站 HTTP 200 |
| /tags/Google-App-Script/ | 308 | _redirects 第 51 行（/tags/Google-App-Script/ → /tags/google-app-script/）；舊站 HTTP 200 |
| /tags/Google-Chrome/ | 308 | _redirects 第 52 行（/tags/Google-Chrome/ → /tags/google-chrome/）；舊站 HTTP 200 |
| /tags/Google-Sheet/ | 308 | _redirects 第 53 行（/tags/Google-Sheet/ → /tags/google-sheet/）；舊站 HTTP 200 |
| /tags/Google-Sheets/ | 308 | _redirects 第 54 行（/tags/Google-Sheets/ → /tags/google-sheets/）；舊站 HTTP 200 |
| /tags/Google-Tag-Manager-%E6%8A%80%E5%B7%A7/ | 308 | _redirects 第 56 行（/tags/Google-Tag-Manager-%E6%8A%80%E5%B7%A7/ → /tags/google-tag-manager-%E6%8A%80%E5%B7%A7/）；舊站 HTTP 200 |
| /tags/Google-Tag-Manager-%E6%95%99%E5%AD%B8/ | 308 | _redirects 第 57 行（/tags/Google-Tag-Manager-%E6%95%99%E5%AD%B8/ → /tags/google-tag-manager-%E6%95%99%E5%AD%B8/）；舊站 HTTP 200 |
| /tags/Google-Tag-Manager/ | 308 | _redirects 第 55 行（/tags/Google-Tag-Manager/ → /tags/google-tag-manager/）；舊站 HTTP 200 |
| /tags/Google-Tag-Manager/page/2/ | 308 | _redirects 第 93 行（/tags/Google-Tag-Manager/page/2/ → /tags/google-tag-manager/2/）；舊站 HTTP 200 |
| /tags/Google-Tag-Manager/page/3/ | 308 | _redirects 第 94 行（/tags/Google-Tag-Manager/page/3/ → /tags/google-tag-manager/）；舊站 HTTP 200 |
| /tags/Google-Tag-Manager/page/4/ | 308 | _redirects 第 95 行（/tags/Google-Tag-Manager/page/4/ → /tags/google-tag-manager/）；舊站 HTTP 200 |
| /tags/Google/ | 308 | _redirects 第 48 行（/tags/Google/ → /tags/google/）；舊站 HTTP 200 |
| /tags/GTM-Tutorial/ | 308 | _redirects 第 58 行（/tags/GTM-Tutorial/ → /tags/gtm-tutorial/）；舊站 HTTP 200 |
| /tags/hexo/ | 200 | dist/tags/hexo/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「hexo」；舊站 HTTP 200 |
| /tags/Hexo/ | 308 | _redirects 第 59 行（/tags/Hexo/ → /tags/hexo/）；舊站 HTTP 200 |
| /tags/Integration/ | 308 | _redirects 第 60 行（/tags/Integration/ → /tags/integration/）；舊站 HTTP 200 |
| /tags/Issue/ | 308 | _redirects 第 61 行（/tags/Issue/ → /tags/issue/）；舊站 HTTP 200 |
| /tags/JavaScript/ | 308 | _redirects 第 62 行（/tags/JavaScript/ → /tags/javascript/）；舊站 HTTP 200 |
| /tags/Line-Tag/ | 308 | _redirects 第 64 行（/tags/Line-Tag/ → /tags/line-tag/）；舊站 HTTP 200 |
| /tags/LINE/ | 308 | _redirects 第 63 行（/tags/LINE/ → /tags/line/）；舊站 HTTP 200 |
| /tags/Looker-Studio/ | 308 | _redirects 第 65 行（/tags/Looker-Studio/ → /tags/looker-studio/）；舊站 HTTP 200 |
| /tags/Martech/ | 308 | _redirects 第 66 行（/tags/Martech/ → /tags/martech/）；舊站 HTTP 200 |
| /tags/MCP/ | 308 | _redirects 第 67 行（/tags/MCP/ → /tags/mcp/）；舊站 HTTP 200 |
| /tags/Measurement-Skill/ | 308 | _redirects 第 68 行（/tags/Measurement-Skill/ → /tags/measurement-skill/）；舊站 HTTP 200 |
| /tags/Meta-Ads/ | 308 | _redirects 第 69 行（/tags/Meta-Ads/ → /tags/meta-ads/）；舊站 HTTP 404 |
| /tags/n8n-%E6%95%99%E5%AD%B8/ | 200 | dist/tags/n8n-教學/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n 教學」；舊站 HTTP 200 |
| /tags/n8n-%E6%96%B0%E5%8A%9F%E8%83%BD/ | 200 | dist/tags/n8n-新功能/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n-新功能」、source/_posts front matter tag「n8n 新功能」；舊站 HTTP 200 |
| /tags/n8n-CLI/ | 308 | _redirects 第 70 行（/tags/n8n-CLI/ → /tags/n8n-cli/）；舊站 HTTP 200 |
| /tags/n8n-debug/ | 200 | dist/tags/n8n-debug/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n-debug」；舊站 HTTP 200 |
| /tags/n8n-insights/ | 200 | dist/tags/n8n-insights/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n-insights」；舊站 HTTP 200 |
| /tags/n8n-node/ | 200 | dist/tags/n8n-node/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n node」；舊站 HTTP 200 |
| /tags/n8n-tips/ | 200 | dist/tags/n8n-tips/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n tips」；舊站 HTTP 200 |
| /tags/n8n-Tips/ | 308 | _redirects 第 71 行（/tags/n8n-Tips/ → /tags/n8n-tips/）；舊站 HTTP 200 |
| /tags/n8n/ | 200 | dist/tags/n8n/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n」；舊站 HTTP 200 |
| /tags/n8n/page/2/ | 308 | _redirects 第 98 行（/tags/n8n/page/2/ → /tags/n8n/2/）；舊站 HTTP 200 |
| /tags/n8n/page/3/ | 308 | _redirects 第 99 行（/tags/n8n/page/3/ → /tags/n8n/）；舊站 HTTP 200 |
| /tags/n8n/page/4/ | 308 | _redirects 第 100 行（/tags/n8n/page/4/ → /tags/n8n/）；舊站 HTTP 200 |
| /tags/n8n%E5%AF%A6%E6%B8%AC/ | 200 | dist/tags/n8n實測/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n實測」；舊站 HTTP 200 |
| /tags/n8n%E6%95%99%E5%AD%B8/ | 200 | dist/tags/n8n教學/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n教學」；舊站 HTTP 200 |
| /tags/n8n%E6%95%99%E5%AD%B8/page/2/ | 308 | _redirects 第 96 行（/tags/n8n%E6%95%99%E5%AD%B8/page/2/ → /tags/n8n%E6%95%99%E5%AD%B8/）；舊站 HTTP 200 |
| /tags/n8n%E6%9B%B4%E6%96%B0/ | 200 | dist/tags/n8n更新/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n更新」；舊站 HTTP 200 |
| /tags/n8n%E6%A8%A1%E6%9D%BF/ | 200 | dist/tags/n8n模板/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n模板」；舊站 HTTP 200 |
| /tags/n8n%E7%AF%80%E9%BB%9E/ | 200 | dist/tags/n8n節點/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n節點」；舊站 HTTP 200 |
| /tags/n8n%E7%AF%80%E9%BB%9E%E4%BB%8B%E7%B4%B9/ | 200 | dist/tags/n8n節點介紹/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「n8n節點介紹」；舊站 HTTP 200 |
| /tags/n8n%E7%AF%80%E9%BB%9E%E4%BB%8B%E7%B4%B9/page/2/ | 308 | _redirects 第 97 行（/tags/n8n%E7%AF%80%E9%BB%9E%E4%BB%8B%E7%B4%B9/page/2/ → /tags/n8n%E7%AF%80%E9%BB%9E%E4%BB%8B%E7%B4%B9/）；舊站 HTTP 200 |
| /tags/OpenAI/ | 308 | _redirects 第 72 行（/tags/OpenAI/ → /tags/openai/）；舊站 HTTP 200 |
| /tags/postiz/ | 200 | dist/tags/postiz/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「postiz」；舊站 HTTP 200 |
| /tags/Push-Notification/ | 308 | _redirects 第 73 行（/tags/Push-Notification/ → /tags/push-notification/）；舊站 HTTP 200 |
| /tags/rclone/ | 200 | dist/tags/rclone/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「rclone」；舊站 HTTP 200 |
| /tags/S3%E4%B8%B2%E6%8E%A5/ | 308 | _redirects 第 74 行（/tags/S3%E4%B8%B2%E6%8E%A5/ → /tags/s3%E4%B8%B2%E6%8E%A5/）；舊站 HTTP 200 |
| /tags/Search-Console/ | 308 | _redirects 第 75 行（/tags/Search-Console/ → /tags/search-console/）；舊站 HTTP 200 |
| /tags/Simmer/ | 308 | _redirects 第 76 行（/tags/Simmer/ → /tags/simmer/）；舊站 HTTP 200 |
| /tags/Slack%E6%95%B4%E5%90%88/ | 308 | _redirects 第 77 行（/tags/Slack%E6%95%B4%E5%90%88/ → /tags/slack%E6%95%B4%E5%90%88/）；舊站 HTTP 200 |
| /tags/Sora/ | 308 | _redirects 第 78 行（/tags/Sora/ → /tags/sora/）；舊站 HTTP 200 |
| /tags/Stack-Overflow/ | 308 | _redirects 第 79 行（/tags/Stack-Overflow/ → /tags/stack-overflow/）；舊站 HTTP 200 |
| /tags/Telegram/ | 308 | _redirects 第 80 行（/tags/Telegram/ → /tags/telegram/）；舊站 HTTP 200 |
| /tags/theme/ | 200 | dist/tags/theme/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「theme」；舊站 HTTP 200 |
| /tags/threads/ | 200 | dist/tags/threads/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「threads」；舊站 HTTP 200 |
| /tags/Tools/ | 308 | _redirects 第 81 行（/tags/Tools/ → /tags/tools/）；舊站 HTTP 200 |
| /tags/update-log/ | 200 | dist/tags/update-log/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「update_log」；舊站 HTTP 200 |
| /tags/User-Onboarding/ | 308 | _redirects 第 82 行（/tags/User-Onboarding/ → /tags/user-onboarding/）；舊站 HTTP 200 |
| /tags/Visual-Studio-Code/ | 308 | _redirects 第 83 行（/tags/Visual-Studio-Code/ → /tags/visual-studio-code/）；舊站 HTTP 200 |
| /tags/Webhook/ | 308 | _redirects 第 84 行（/tags/Webhook/ → /tags/webhook/）；舊站 HTTP 200 |
| /tags/xAI/ | 308 | _redirects 第 85 行（/tags/xAI/ → /tags/xai/）；舊站 HTTP 200 |
| /tags/zeabur/ | 200 | dist/tags/zeabur/index.html 存在；來源：live sitemap.xml、source/_posts front matter tag「zeabur」；舊站 HTTP 200 |
| /tags/Zeabur/ | 308 | _redirects 第 86 行（/tags/Zeabur/ → /tags/zeabur/）；舊站 HTTP 200 |
| /the_martech_handbook/ | 200 | dist/the_martech_handbook/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /tool-compressx/ | 200 | dist/tool-compressx/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /tool-google-tag-manager-list-information/ | 200 | dist/tool-google-tag-manager-list-information/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /tool-hash-sha256.html | 200 | dist/tool-hash-sha256.html 存在；來源：source/tool-hash-sha256.html；舊站 HTTP 308 |
| /tool-remove-ga3-setting-in-gtm-tagsbuster/ | 200 | dist/tool-remove-ga3-setting-in-gtm-tagsbuster/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /unboxing-busytag/ | 200 | dist/unboxing-busytag/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
| /visual-studio-install-and-why/ | 200 | dist/visual-studio-install-and-why/index.html 存在；來源：live sitemap.xml；舊站 HTTP 200 |
