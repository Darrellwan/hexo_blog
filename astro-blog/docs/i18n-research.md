# 中英文雙語：研究結論

2026-08-27。這份是**分析**，沒有動任何程式碼。

## 結論先講

技術不是難點。Astro 內建的多語言路由夠用，而且**不會動到現有的中文網址**。
真正的成本是翻譯：全站 130 篇、65.8 萬字（不含空白），平均每篇 5,063 字。

所以建議**選譯**（挑幾篇翻），不要全站雙語。原因不只是工作量：
Google 的 helpful content 判斷是**站台級**的，一批單薄的翻譯頁會連帶拖累原本表現好的中文頁，
等於花大錢買扣分。

建議時機：**Phase 3 上線穩定之後再做**，不要跟搬家綁在一起。搬家的驗收基準是
「新舊站輸出一致」，加了語言維度就沒有對照組可比了。

## Astro 給什麼、不給什麼

| | 內建 | 要自己做 |
|---|---|---|
| 網址前綴規則（`/en/...`） | ✅ | |
| `Astro.currentLocale`（從網址推語言） | ✅ | |
| `getRelativeLocaleUrl()` 算對應語言的網址 | ✅ | |
| 缺翻譯時 fallback 到預設語言 | ✅ | |
| **自動產生英文頁面** | ❌ | 要自己建 `/en/` 的路由檔 |
| **hreflang 標籤** | ❌ | `@astrojs/sitemap` 的 i18n 選項可產生（見下） |
| **介面字串翻譯** | ❌ | 要自己維護一份對照表 |
| **文章怎麼分語言存放** | ❌ | 自己決定 |

關鍵一條：`prefixDefaultLocale: false`（預設值）下，**預設語言的網址不加前綴**。
所以中文維持 `/n8n-cli-guide/`，英文走 `/en/n8n-cli-guide/`，現有網址完全不動。

## 對這個站的具體衝擊

| 項目 | 影響 | 工作量 |
|---|---|---|
| 現有中文網址 | 不動 | 無 |
| 路由檔 | `src/pages/` 下 8 個檔案要有英文版（文章、列表、標籤、封存、搜尋、RSS、llms.txt、OG 圖） | 中 |
| 文章存放 | 建議另開 `src/data/blog-en/`，中文那份完全不碰 | 小 |
| 介面字串 | Layout、選單、頁尾、「更新於」、「相關文章」等，要一份翻譯表 | 中 |
| `SITE.lang` | 現在是單一常數 `zh-TW`，要改成逐頁決定 | 小 |
| 站內搜尋 | Pagefind 讀 `<html lang>` **自動分語言建索引**，零設定；但要有 `/en/search` 頁 | 小 |
| sitemap | `@astrojs/sitemap` 的 `i18n` 選項會自動產生 `xhtml:link` hreflang | 小 |
| sitemap 後處理 | `astro.config.ts` 有自訂步驟把單一 chunk 改名成 `sitemap.xml`，多語言會不會變多個 chunk 要先驗 | 小但要驗 |
| RSS | 一個語言一支 feed | 小 |
| robots.txt / llms.txt | 要分語言 | 小 |
| Markdown for Agents | `middleware.js` 的 matcher 要加 `/en/` | 小 |
| OG 圖 | 每篇英文版要自己的圖 | 小（已自動產生） |
| 小標錨點 | 英文文章自動套新規則，不需要 `legacyAnchors` | 無 |

前置工程整體估 **2-4 個工作天**，不含翻譯。

## SEO 的硬規則

這幾條做錯會扣分，不是「少加分」：

- **每頁的 hreflang 必須自我指向**。漏掉自我指向那一筆，整組 hreflang 會被 Google 直接忽略。
- **必須雙向互指**。A 指 B、B 沒指回 A → 這一對被丟掉。
- **每個語言版自我 canonical**。絕對不要把英文版 canonical 指到中文版，那會讓英文版整個不被收錄。
- **canonical 的網址必須出現在自己的 hreflang 清單裡**，否則整組 hreflang 失效。
- **只給兩邊都真的有內容的頁面掛 hreflang**。只翻介面、內文照抄原文＝重複內容。
- **x-default** 指向 fallback 頁面。
- **不要用 fallback 自動生出「英文網址、中文內容」的頁**。那是最糟的組合：
  網址宣稱英文、內容是中文，既不幫使用者也會被判重複。要用 fallback 就設成 redirect，不要 rewrite。

## 三種做法

| | A. 選譯（建議） | B. 全站雙語 | C. 英文另開站 |
|---|---|---|---|
| 做法 | 挑 10-20 篇翻成英文 | 130 篇全翻 | 英文放獨立網域或子網域 |
| 前置工程 | 2-4 天 | 2-4 天（一樣） | 另建一個站 |
| 翻譯量 | 5-10 萬字 | 65.8 萬字 | 看規模 |
| 長期維護 | 中文照常寫，想翻才翻 | 每篇都要維護兩份，改一次要改兩邊 | 兩個站各自維護 |
| SEO 風險 | 低（只有真的翻好的才掛 hreflang） | 高（單薄翻譯拖累全站） | 低但兩邊都要重新累積權重 |
| 可逆性 | 高（拿掉幾篇就好） | 低 | 低 |

C 的唯一好處是完全隔離，代價是英文站從零開始累積權重，而且你要維護兩套基礎設施。
除非英文內容的主題跟中文站差很遠，否則不值得。

## 選譯的每篇流程

前置做完之後，發一篇英文版的實際步驟：

1. 中文版照常寫、照常發。
2. 複製一份到 `src/data/blog-en/<同樣的-slug>.md`。
3. front matter 加 `translationOf: <中文-slug>`（用來產生 hreflang 與語言切換鈕）。
4. 翻譯內文。AI 起草可以，但**一定要自己潤過**：這個站的價值在「實測語氣」，
   機翻會把「實測」「蠻常用」這種味道洗掉，而那正是英文技術部落格裡的稀缺品。
5. `npm run build`。hreflang、sitemap、Pagefind 英文索引都自動處理。

沒有翻譯的文章什麼都不用做，也不會出現在英文版列表裡。

## 還沒查證的兩件事

- 開了 sitemap 的 i18n 之後，`astro.config.ts` 裡「只允許一個 sitemap chunk」的檢查會不會被觸發。
  要實際跑過才知道。
- 語言切換鈕在「這篇沒有英文版」時要怎麼表現。建議直接不顯示，不要連到英文首頁 ——
  連到不相關的頁面對使用者和 Google 都是壞訊號。

## 參考來源

- [Astro Internationalization (i18n) Routing](https://docs.astro.build/en/guides/internationalization/)
- [@astrojs/sitemap i18n](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Pagefind Multilingual search](https://pagefind.app/docs/multilingual/)
- [AstroPaper I18n（社群 fork，可當實作參考）](https://github.com/yousef8/astro-paper-i18n)
