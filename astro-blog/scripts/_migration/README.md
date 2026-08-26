# 一次性遷移工具（已完成，僅供考古）

這兩支腳本把 Hexo 的文章搬進 Astro。**遷移已經完成，正常情況下不要再跑。**

| 腳本 | 當時做的事 |
|---|---|
| `migrate-frontmatter.ts` | 讀 `../../../source/_posts`，轉換 front matter、複製文章資產與圖片尺寸／變體 JSON，寫進 `src/data/blog/` |
| `validate.ts` | 拿 Hexo 的 `public/` 對 Astro 的 `dist/` 比對路由與內容，遷移期間用來抓漏 |

## 為什麼封存

`src/data/blog/` 的 markdown 從 2026-08-27 起**進版控，而且是內容的唯一來源**。
要改文章就直接改那裡的 markdown。

`migrate-frontmatter.ts` 是 `writeFile` 直接覆寫，重跑會把 Astro 這邊的所有手動修改
蓋回 Hexo 版本，**而且不會問你**。它也只覆寫、不刪除，Hexo 那邊刪掉的圖片會留在
`src/data/blog/` 變成孤兒（遷移收尾時清掉 1 個）。

`validate.ts` 另外有個不能當最終驗收 gate 的理由：它比對時會把 `-` 和 `_` 互換再猜一次
（見計畫文件阻擋 1），這會**掩蓋真正的斷鏈**；custom tag 清單也不完整。獨立 repo 需要的是
只讀 frozen manifest 做 exact match 的 deterministic validator，那是另一支東西
（`scripts/freeze-manifest.ts` 產出的 `tests/fixtures/frozen/build-manifest.json` 是它的基準）。

## 真的需要重跑的時候

只有一種情況：切換上線之前，凍結的 Hexo repo 又補了內容進去。那時要先確認
Astro 這邊沒有任何手動修改會被蓋掉，再跑：

```bash
npx tsx scripts/_migration/migrate-frontmatter.ts
git status --short src/data/blog   # 看清楚它改了什麼再決定要不要留
```

兩支腳本都吃環境變數覆寫來源路徑（`HEXO_POSTS_DIR`、`HEXO_PUBLIC`、`ASTRO_DIST` 等），
所以也能在不動主 checkout 的前提下跑唯讀比對。

決策脈絡：`docs/plans/2026-08-26-astro-standalone-repo-cutover.md`（在舊 Hexo repo 裡）阻擋 2。
