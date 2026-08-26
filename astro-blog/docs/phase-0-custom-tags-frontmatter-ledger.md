# Phase 0 自訂標籤與 front matter ledger

更新日：2026-08-26

## 盤點範圍與來源

本 ledger 以 `/Users/darrellwang/Darrell/code/blog/source/_posts/*.md` 做唯讀盤點，共 130 篇；這是本次可取得的完整來源。B2 worktree 的 `source/_posts/` 只有 128 篇，少了 `chatgpt-work-vs-codex.md` 與 `meta-ads-mcp.md`，因此不能只用 worktree 的檔案數當完整盤點結果。遷移腳本預設仍指向 B2 worktree 的相對路徑，驗證完整來源時以 `HEXO_POSTS_DIR` 指向上述主 repo 來源、以 `ASTRO_BLOG_DIR` 指向暫存輸出，絕不寫入主 repo。

掃描時把 front matter 結束分隔線後的空白及清單縮排中的 tab 納入處理；因此 `n8n-perplexity-node.md` 的 `--- ` 也能被遷移。所有 130 篇均成功遷移，沒有跳過或錯誤。

## 自訂標籤去向

下表的次數是開啟標籤次數；結束標籤（例如 `endcallout`）視為同一個區塊語法，不另列為 handler。檔案數是至少出現一次的文章數。

| 標籤 | 次數／檔案數 | 去向 | 理由與輸出 |
|---|---:|---|---|
| `darrellImageCover` | 119／118 | 轉換 | `remark-hexo-tags.ts` 的圖片 handler，輸出 cover figure；相對資產改用 `/{slug}/`。 |
| `darrellImage800` | 736／75 | 轉換 | 輸出圖片 figure，保留 `max-800` 或文章指定 class。 |
| `darrellImage800Alt` | 361／25 | 轉換 | 支援含空白的引號 alt，輸出圖片 figure。 |
| `darrellImage` | 265／37 | 轉換 | 輸出一般圖片 figure。 |
| `darrellImageh800` | 1／1 | 轉換 | 輸出圖片 figure，使用 `max-800h`。 |
| `darrellVideoSimple` | 3／1 | 轉換 | 輸出可控制播放的影片容器；來源 URL 先 escape。 |
| `video` | 0／0 | 轉換（validator coverage） | 目前 130 篇沒有使用；plugin 已支援 Hexo 內建的 plain video 語法，validator 也納入名稱，避免日後新增文章漏驗。 |
| `callout` / `endcallout` | 92／23 | 轉換 | 輸出 `dn-note` 區塊，支援 tip、info、warning、error。 |
| `term` / `endterm` | 50／13 | 轉換 | 輸出 `term-tooltip`，定義與文字均 escape。 |
| `faq` / `endfaq` | 19／19 | 轉換 | 解析 JSON 後輸出 FAQ markup 與互動腳本。 |
| `dataTable` / `enddataTable` | 67／17 | 轉換 | 解析 JSON 後輸出 data table markup。 |
| `quickNav` / `endquickNav` | 24／24 | 轉換 | 解析 JSON 後輸出文章目錄。 |
| `articleCard` | 78／34 | 轉換 | 輸出文章推薦卡片，屬性與文字 escape。 |
| `templateCard` | 2／2 | 轉換 | 輸出 n8n 範本卡片，屬性與文字 escape。 |
| `ctaCard` / `endctaCard` | 1／1 | 轉換 | 新增 handler，沿用 Hexo 的 variant 白名單、label、title、button、站內／外連結行為；缺 title 或 URL 時不輸出，HTML 屬性與 CTA body escape。 |
| `raw` / `endraw` | 8／1 | 轉換 | 移除 raw wrapper、保留其中的原文；validator 對 Astro HTML 做 `{%` 殘留檢查。 |
| `img` | 1／1 | 轉換 | 支援 Hexo legacy img 語法，輸出 lazy image。 |

目前掃到的所有開啟標籤都有對應處理；沒有未處理而被默默略過的 `{% %}` 標籤。`darrellVideo`、`darrellVideoGradient`、`darrellVideoLightbox`、`darrellOnlyImage` 是 Hexo handler／Astro plugin 已支援但本次 130 篇沒有使用的零次標籤。

CTA 的實際唯一用例依來源快照不同：B2 worktree 是
`source/_posts/grok-bot-review.md:234`，完整 130 篇唯讀來源是
`/Users/darrellwang/Darrell/code/blog/source/_posts/grok-bot-review.md:289`；兩者是同一個
`service-bar` CTA。計畫文字所列的第 289 行因此只對完整來源成立。

## Front matter 欄位去向

次數以完整 130 篇來源為準。掃到 **20 個**頂層 front matter 欄位；所有標為「保留」的欄位都由 `migrate-frontmatter.ts` 輸出，並在 `src/content.config.ts` schema 接住；「轉換」欄位由目標欄位接住。

| 來源欄位 | 出現篇數 | 分類 | Astro 去向與理由 |
|---|---:|---|---|
| `title` | 130 | 保留 | 原值寫入 `title`，文章標題必要。 |
| `id` | 85 | 保留 | 原值保留供內容追溯；不再拿來推導 URL，避免連字號／底線不一致。 |
| `slug` | 2 | 轉換 | 目標 `slug` 一律由 `.md` 檔名導出；檔名是 canonical URL source of truth。 |
| `tags` | 130 | 保留 | 正規化成字串陣列，缺值才使用 `others` 預設。 |
| `categories` | 130 | 保留 | 正規化成字串陣列。 |
| `page_type` | 127 | 保留 | 原值寫入 schema；目前值都是 `post`，頁型路由仍由 Astro 決定。 |
| `date` | 130 | 轉換 | 轉為 `pubDatetime`，補台灣時區 `+08:00`。 |
| `description` | 130 | 保留 | 原值寫入 `description`，缺值寫空字串以滿足 schema。 |
| `updated` | 31 | 轉換 | 優先轉為 `modDatetime`；`modified` 也支援作為 fallback。 |
| `bgImage` | 94 | 轉換 | 原檔名保留在 `bgImage` 供 cover resolver，並產生同值（必要時補副檔名）的 `ogImage`。 |
| `preload` | 67 | 保留 | 保留圖片清單，避免遷移丟失文章指定的 preload 資訊。 |
| `socialText` | 1 | 保留 | 原值保留供社群分享 metadata 後續接線。 |
| `twitter-id` | 1 | 保留 | 以字串保留完整 ID，避免 JavaScript safe integer 造成 `1766167180578873589` 被四捨五入。 |
| `comments` | 1 | 保留 | 保留 Hexo 的布林開關，未來 comments 接線可直接使用。 |
| `include` | 1 | 保留 | 保留 `['_css/custom.css']` 清單；文章資產同步會把它解析成文章旁的 CSS。 |
| `darrell_structured_data` | 1 | 保留 | 保留巢狀 `type`、`question`、`answer`，供 FAQ JSON-LD 接線。實際檔案是 `google-tag-manager-skills-css-selector-resource.md`。 |
| `ai_assistance` | 1 | 保留 | 原值 `10%` 以字串保留，避免百分比被當數字。 |
| `cover` | 1 | 保留 | 原值保留供 cover metadata 後續接線；現有 OG fallback 仍以 `bgImage`／`ogImage` 為主。 |
| `coverImage` | 1 | 保留 | `visual-studio-install-and-why.md` 的原始 cover URL 原值保留，供 cover metadata 後續接線。 |
| `sticky` | 1 | 保留 | `n8n-update-log.md` 的值 `100` 寫入 schema；目前已可用，之後由 Layout 接到 GTM dataLayer。 |

`no_ads` 是 Astro 端此次已存在的欄位，不在這 130 篇 Hexo來源中；本次保留 `content.config.ts` 既有 schema 定義，沒有刪除或重排。

計畫文字所列的 `google-tag-manager-skills-mcp-claude-code.md` 在完整來源不存在；實際使用 `darrell_structured_data` 的文章是上表所列的 CSS selector resource 文章。CSS include 的實際來源是 `google-tag-manager-google-tag-release.md`，且值是 `_css/custom.css`。

## 驗證規則

- `scripts/validate.ts` 只用 canonical slug 的單一路徑做 exact match；不做大小寫、連字號／底線、去標點或相似度修正。
- validator 的 custom-tag coverage 明列 `video` 與 `raw`，並會報告 Astro HTML 內任何殘留 `{% ... %}`。
- `migrate-frontmatter.ts` 預設來源為 B2 worktree 的 `source/_posts`；`HEXO_POSTS_DIR` 與 `ASTRO_BLOG_DIR` 僅供唯讀來源／暫存輸出驗證，不改主 repo。

## 執行偏差與依賴

- 遷移 parser 使用專案既有 lockfile 所記錄的 `yaml@2.8.3`（目前是 Astro 工具鏈的 transitive dependency）；本次沒有改 `package.json` 或 lockfile，也沒有執行重新安裝。正常依 lockfile 的開發相依性安裝時可取得它；若未來要讓 migration script 脫離 Astro 工具鏈單獨執行，應再把依賴政策獨立決定。
- `hello-to-hexo` 的程式碼範例含 Swig `{%- ... %}` 文字；這不是未轉換的 Hexo tag（validator 的 tag pattern 只匹配 `{%` 後接標籤名稱），所以不列為殘留 handler。驗收時應以未轉換 tag pattern，而非把程式碼範例誤判成 Hexo block。
