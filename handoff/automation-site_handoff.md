---
name: "automation.darrelltw.com 接案站"
project: "blog"
slug: automation-site
status: active
updated: 2026-08-16
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-08-16 15:57

## 本次 session 完成的事（2026-08-16）

- 建立 Astro 獨立接案站，產出首頁、案例列表、6 篇案例頁與 3 個服務頁。
- 將 v2 既有文案移植至 6 篇案例頁，未新增客戶名稱或數字。
- 部署至 Cloudflare Workers Static Assets，並綁定 `automation.darrelltw.com`。
- 補上 sitemap、robots.txt、CSP 與 noindex 保護。
- 啟用 Cloudflare Access，限制指定信箱登入。
- 完成 GTM dataLayer、GTM tags、triggers 與 GA4 版本 2 發布。
- 修復 hero 動畫，外部化 428 行 inline script，並確認線上 hero demo 正常渲染。

## 下次接手第一步

先檢查 `/Users/darrellwang/Darrell/code/automation-site` 目前的視覺修復結果，對照 v2 原版截圖與線上頁面；確認 build、首頁、案例內頁與 hero 動畫都正常後，再確認聊天 workflow 是否已搬至 darn8n，以及 Turnstile 與正式公開上線前的保護設定。

## 重要 ID / 路徑

- 專案根目錄：`/Users/darrellwang/Darrell/code/blog`
- 新站專案：`/Users/darrellwang/Darrell/code/automation-site`
- 交接文件：`/Users/darrellwang/Darrell/code/blog/handoff/automation-site_handoff.md`
- 計畫文件：`/Users/darrellwang/Darrell/code/blog/docs/plans/2026-08-15-automation-site-plan.md`
- GitHub 私有 repo：`Darrellwan/automation-site`
- 線上網址：`https://automation.darrelltw.com/`
- n8n 主機：`https://darn8n.darrelltw.com`
- GTM container：`GTM-K4GHVMVP`

## 已知限制 / 決策

- 新站目前仍處於 robots 全擋、`X-Robots-Tag: noindex` 與 Cloudflare Access 保護狀態，尚未正式公開上線。
- 聊天元件 UI 已保留，端點 host 已改成 `darn8n.darrelltw.com`；production chat workflow 搬遷仍需確認。
- Turnstile hostname、Secret Key 與 n8n siteverify workflow 的實際設定仍需完成。
- blog repo 仍有既有 dirty/untracked 內容；後續提交必須逐路徑挑選，避免混入無關變更。
- 案例沿用 v2 既有內容，不新增量化數字。
- GSC 不新增 property；可選另開子網域 URL-prefix property 單獨看數據。

## 硬性規範

- 不得在案例內容中編造客戶名稱、量化數據或成效。
- blog repo 提交時只挑選本工作線相關路徑，避免混入既有 dirty 變更。
- 正式上線前必須完成 Access、robots、noindex 的切換審核。
- 表單必須維持 Turnstile 驗證、蜜罐與 fail-closed 行為；驗證失敗不得送進下游 workflow。
- 聊天 workflow 正式搬遷與端點切換完成前，不得宣稱聊天功能已可正式上線。

## ⚠️ 接手前驗證清單（開始寫 code 前必跑）

□ 確認新站目前工作樹與最近提交：
  `git -C /Users/darrellwang/Darrell/code/automation-site status --short && git -C /Users/darrellwang/Darrell/code/automation-site log --oneline -5`

□ 確認 Astro build 與頁面產出：
  `cd /Users/darrellwang/Darrell/code/automation-site && npm run build`

□ 確認表單、Turnstile、蜜罐與聊天端點目前設定：
  `rg -n "darn8n|Turnstile|siteverify|honeypot|phone|production workflow" /Users/darrellwang/Darrell/code/automation-site/src /Users/darrellwang/Darrell/code/automation-site/public`

□ 確認 crawler、noindex 與 Access 相關設定：
  `rg -n "Disallow|noindex|X-Robots-Tag|Access" /Users/darrellwang/Darrell/code/automation-site/public /Users/darrellwang/Darrell/code/automation-site/wrangler.jsonc`

□ 確認 blog repo 既有變更，避免誤提交：
  `git -C /Users/darrellwang/Darrell/code/blog status --short`
