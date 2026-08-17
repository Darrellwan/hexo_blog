---
slug: automation-site
status: archived
type: handoff-history
date_from: 2026-01-01
date_to: 2026-12-31
archive_reason: rotation
---

<!-- session-recap-history sha256=3d88ad2a28560f582de10d14c904dd4cc8a92ca2732832fb96fc5945f0f992c0 source=automation-site_handoff.md -->
## 本次 session 完成的事（2026-08-16）

- 建立 Astro 獨立接案站，產出首頁、案例列表、6 篇案例頁與 3 個服務頁。
- 將 v2 既有文案移植至 6 篇案例頁，未新增客戶名稱或數字。
- 部署至 Cloudflare Workers Static Assets，並綁定 `automation.darrelltw.com`。
- 補上 sitemap、robots.txt、CSP 與 noindex 保護。
- 啟用 Cloudflare Access，限制指定信箱登入。
- 完成 GTM dataLayer、GTM tags、triggers 與 GA4 版本 2 發布。
- 修復 hero 動畫，外部化 428 行 inline script，並確認線上 hero demo 正常渲染。

<!-- session-recap-history sha256=811457e90dde4f44c08a096153655ae500580f013532b616987c6deb3636fe5f source=automation-site_handoff.md -->
## 本次 session 完成的事（2026-08-17）

- 完成 automation.darrelltw.com 的獨立 Astro 站建置與 Cloudflare Workers Static Assets 部署，包含首頁、6 篇案例頁與 3 個服務頁。
- 完成 GTM dataLayer、GTM tags、triggers 與 GA4 接線及版本發布。
- 完成首頁互動程式的 CSP 修復，將 428 行 inline script 外部化至 `public/scripts/home.js`，並完成線上瀏覽器驗證。
- 完成 Cloudflare Access 應用程式與允許政策設定，站點仍維持登入保護、robots 全擋與 noindex。
- 完成表單 Worker 的 Turnstile siteverify、fail-closed、蜜罐與防重送處理，並部署 Secret；表單真單端到端通過（n8n 執行 `107294`）。
- **首頁案例卡與 FAQ 改成伺服器端渲染**（commit `b479dee`，線上版本 `38b57163`）：原本兩個區塊是空 div 由 JS 填，爬蟲讀不到任何案例連結與 FAQ 文字。現在 `index.astro` 直接從 cases collection（新增 `homeOrder`／`cardSummary`／`cardMetric`）與 `src/data/faqs.ts` 產出 HTML，`home.js` 只留裝飾用流程圖與 FAQ 開合。
- **聊天修好並實測可用**：重建 Qdrant credential（`FhSzheVbdg2hdwAx`，collection `kb_v1`），兩支 workflow（`pmZZqqc7Oik4WEKA`、`HMXBjbMlB0lAKofq`）的 `查知識庫` 節點已改掛，`activeVersionId` 與 `versionId` 一致。實測聊天端點回串流答案且數字與 FAQ 一致、閘門端點回 200、兩端點 CORS 對生產來源正確。

