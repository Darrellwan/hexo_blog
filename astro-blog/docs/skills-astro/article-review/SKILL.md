---
name: article-review
description: Darrell Blog 正式文章的交付前品質 gate。只要要審查 src/data/blog/ 文章，或任何正式文章建立、重寫、實質更新後準備宣稱完成，就必須使用；負責以兩篇同類舊文檢查版型一致、Astro 自訂標籤、圖片與 anchor、description、建置 freshness 及桌面與手機瀏覽器畫面。它不負責撰寫初稿，寫作請使用 blog-article-writer 與適用的領域 skill。
---

# 正式文章交付審查

本 skill 是獨立的交付 gate。Astro 建置成功只證明語法可渲染，不代表文章格式、內容契約與實際畫面正確。

## 輸入

審查前取得：

- 專案本機根目錄 `/Users/darrellwang/Darrell/code/blog-astro/`；GitHub repo `Darrellwan/blog-astro`
- 目標文章絕對路徑
- 兩篇同類正式文章的絕對路徑
- 撰寫時建立的版型契約；純 review 任務沒有契約時，審查者必須補做
- 用戶已同意的格式偏差；沒有就視為無

兩篇基準必須完整讀完。只讀搜尋片段或 front matter 不算完成。

## 先判定模式

- **Findings-only review**：用戶只要求「看、檢查、分析、審查、review」，預設唯讀。執行 Gate 1 與 draft audit，回報 findings，不修改文章、不處理圖片、不重新建置，也不啟動本地服務。
- **Delivery gate**：文章是在已授權的建立、重寫或修改任務中準備交付。可在原授權範圍內修正問題，並完整執行 Gate 1 到 Gate 4。

審查指令本身不是修改授權。模式不確定時採 findings-only review。

## Gate 1：內容與版型人工審查

逐項比對目標文章與兩篇基準：

1. Front matter 欄位、`tags`／`categories` 排版、`pubDatetime`，以及實質更新時才使用的 `modDatetime`；檔名是網址唯一來源，`id`、`slug` 不參與網址推導，網址必須是帶尾斜線的 `/<檔名>/`。
2. 封面、摘要、QuickNav 的開頭順序。
3. H2／H3、anchor 與 QuickNav 對應。
4. `quickNav`、`dataTable`、`faq` 等 Custom Tag 的語法與 JSON 排版，並完整執行 [references/syntax-checklist.md](references/syntax-checklist.md)。
5. 圖片標籤、alt、檔名與文章專屬資料夾。
6. FAQ、相關文章、參考來源的收尾方式。
7. 是否出現基準沒有的文章內 `<style>` 或一次性 workaround。
8. `description` 的每個宣稱是否都能對應到正文 heading 或段落。
9. 內容事實是否有來源、實測或明確的未驗證標記。
10. 台灣繁體、台灣用詞、個人實測語氣，且沒有 `——`。

詳細錯誤範例見 [references/examples.md](references/examples.md)。遇到版型判斷或稽核失敗時讀取；既有語法與寫作檢查不可因自動 audit 通過而跳過。

## Gate 2：Draft audit

```bash
python3 /Users/darrellwang/Darrell/skills/article-review/scripts/audit.py \
  /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/target.md \
  --baseline /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/baseline-1.md \
  --baseline /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/baseline-2.md \
  --phase draft
```

Delivery gate 的任何 `FAIL` 都必須修正；findings-only review 則逐項附行號回報，不直接改檔。只有用戶明確同意偏離共同版型時，才可使用：

```bash
--allow-deviation CODE="用戶同意的原因"
```

不得自行核准例外。語法錯誤、缺圖、無效 anchor 等完整性問題不可豁免。

## Gate 3：建置與 Final audit

本 Gate 只在 delivery gate 執行。Findings-only review 不因審查而產生新的建置檔案。

1. 有新增圖片時標記「⚠️ 待補：Astro 端尚無對應指令」，目前沒有可執行的圖片壓縮 script。
2. 執行 `npm --prefix /Users/darrellwang/Darrell/code/blog-astro run build`，並以指令本身的離開碼判定建置結果。
3. 建置成功後跑 final audit，確認 `dist/<檔名>/index.html` 與 `index.md` 存在且不比來源文章舊。

```bash
python3 /Users/darrellwang/Darrell/skills/article-review/scripts/audit.py \
  /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/target.md \
  --baseline /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/baseline-1.md \
  --baseline /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/baseline-2.md \
  --phase final
```

不能只檢查 exit code。若建置 log 顯示 Custom Tag 錯誤、缺圖或文章未產出，一律算失敗。

## Gate 4：瀏覽器驗收

本 Gate 只在 delivery gate 執行。

使用 `agent-browser` 開啟實際文章 URL，分別檢查桌面與手機寬度：

- 封面、QuickNav、表格、圖片、FAQ 正常顯示
- 沒有水平溢位、裁切或文章內 CSS 副作用
- QuickNav 點擊會到正確段落
- 文章開頭與結尾符合基準

畫面被裁切或遮住等於沒有顯示。沒有瀏覽器實查，不得寫瀏覽器驗收 PASS。

## 判定

Delivery gate 只有以下項目全部通過，才能說文章完成：

- 人工內容與版型審查
- Draft audit
- Astro build
- Final freshness audit
- Desktop browser QA
- Mobile browser QA

Findings-only review 不使用「文章完成」判定，只回報必須修改、建議優化、通過項目與未驗證項目。

## 回報格式

```markdown
## 文章品質 gate

- 目標文章：/absolute/path/to/target.md
- 基準文章 1：/absolute/path/to/baseline-1.md
- 基準文章 2：/absolute/path/to/baseline-2.md
- 版型偏差：無／列出用戶已同意的偏差與理由
- 人工內容與版型審查：PASS
- Draft audit：PASS
- Astro build：PASS
- Final freshness audit：PASS
- Desktop browser QA：PASS
- Mobile browser QA：PASS
```

任何未實查項目都寫 `未驗證`，不可由其他通過項目代替。
