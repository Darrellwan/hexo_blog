---
name: blog-article-writer
description: Darrell Blog 正式文章的通用撰寫流程。只要要在 blog-astro 專案建立、重寫或實質更新 src/data/blog/ 文章就必須使用，包含產品介紹、比較文、教學文與非 n8n 主題；動筆前強制完整讀兩篇同類正式文章並建立版型契約，完成後交給 article-review 驗收。n8n 類文章仍須同時使用對應的 n8n 寫作 skill。
---

# Blog 正式文章撰寫

把舊文章視為版型 source of truth。內容可以是新的，文章骨架、Custom Tag 寫法與收尾方式不可由 agent 現場發明。

## 觸發與分工

- 建立、重寫或實質更新 `src/data/blog/*.md`：使用本 skill。
- 純粹審查既有文章：使用 `article-review`，不必啟動本 skill。
- n8n 節點教學：本 skill + `n8n-article-writer`。
- n8n 版本更新：本 skill + `n8n-update-write`。
- 所有正式文章交付前：必須再使用 `article-review`。

領域 skill 決定「寫什麼」，本 skill 決定「如何符合這個 Blog 的文章格式」，`article-review` 決定「能不能交付」。

## Step 0：確認交付契約

動手前用一句話確認：

1. 受眾是誰。
2. 範圍對齊用戶最初要求，不被後續子話題取代。
3. 交付幾篇，預設一篇。

正式文章放在 `/Users/darrellwang/Darrell/code/blog-astro/src/data/blog/`。只有用戶明確要求草稿或備存，才放 `docs/drafts/`。

## Step 1：讀需求與專案規則

1. 完整讀用戶指定的 plan、來源與素材清單。
2. 確認本機 repo 是 `/Users/darrellwang/Darrell/code/blog-astro/`，GitHub repo 是 `Darrellwan/blog-astro`；再讀 repo 的 `AGENTS.md`、`CLAUDE.md` 與文章規範。
3. 若有 domain skill，先讀完該 skill 再研究與撰寫。
4. 檢查目標文章與圖片資料夾是否已存在；未取得覆蓋授權時，不覆蓋既有檔案。

## Step 2：建立兩篇基準文章

在建立文章檔或修改正文前：

1. 從 `src/data/blog/` 選兩篇近期且文章類型最接近的正式文章。
2. **完整讀完兩篇。** 只看 front matter、搜尋片段或 heading 清單都不算完成。
3. 明確列出兩個絕對路徑。
4. 依 [references/baseline-contract.md](references/baseline-contract.md) 建立版型契約。

兩篇文章出現矛盾 pattern 時，選較新或使用較多的一邊，另一邊標成舊 pattern。不得把兩種格式混成第三種新格式。

缺少兩篇完整基準與版型契約時，**停止撰寫**。不能用「我知道 Astro」或「建置應該會過」代替。

## Step 3：先複製骨架，再填內容

依版型契約建立文章骨架，至少確認：

- Front matter 欄位、list 排版、`pubDatetime`，以及實質更新時才使用的 `modDatetime`
- 檔名就是網址唯一來源；不設定 `id` 或 `slug`，並確認 `<檔名>.md` 對應 `/<檔名>/`
- 開頭順序：封面、摘要、QuickNav
- H2／H3 與小寫連字號 anchor
- `quickNav`、`dataTable`、`faq` 的 JSON 排版
- 圖片 Custom Tag 與文章專屬資料夾
- FAQ、相關文章與參考來源的收尾順序

沒有先完成骨架，不直接從空白檔自由發揮。

## Step 4：撰寫內容

- **先讀完 [references/voice-guide.md](references/voice-guide.md) 再動筆**：短句斷行、砍 hedging 與 meta 句、小節寧少勿多、直球結論。寫完每個大段用該文件的自檢問句過一次。
- 依「先痛點、再解法」「用對比強調差異」「具體舉例」撰寫。
- 台灣繁體中文，技術詞保留英文，維持個人實測語氣。
- 禁止使用 `——`。
- `description` 只能描述正文真的涵蓋的內容，完成後逐項對照 heading。
- Custom Tag 的 JSON 延續基準文章的可讀多行格式，不壓成單行。
- 圖片放在 `src/data/blog/<檔名（不含 .md）>/`，使用專案既有圖片標籤與具體 alt。
- 新增文章內 `<style>`、新 Custom Tag 或一次性 workaround 前，先找共用實作；若仍需偏離，先取得用戶同意。
- 不補猜產品事實。對會變動或未提供的資料，先查官方來源或標為未驗證。

## Step 5：撰寫中自檢

完成初稿後先檢查：

1. 每個 QuickNav anchor 都有對應 heading。
2. 每張本地圖片都實際存在。
3. 表格、FAQ 與 callout 使用專案最新語法。
4. `description` 沒有超出正文內容。
5. 文章的開頭、主體與收尾都符合兩篇基準的共同慣例。

## Step 6：交給 article-review

必須把以下資料交給 `article-review`：

- 目標文章絕對路徑
- 基準文章 1 絕對路徑
- 基準文章 2 絕對路徑
- 版型契約
- 已獲用戶同意的偏差與理由；沒有就寫「無」

由 `article-review` 執行 draft audit、Astro 建置、final freshness audit 與瀏覽器驗收。任一項未通過，不得宣稱完成。

## 回報格式

```markdown
## Blog 文章撰寫

- 目標文章：/absolute/path/to/target.md
- 基準文章 1：/absolute/path/to/baseline-1.md
- 基準文章 2：/absolute/path/to/baseline-2.md
- Domain skill：無／n8n-article-writer／n8n-update-write
- 版型偏差：無／列出用戶已同意的偏差
- article-review：PASS／未通過／未驗證
```

只要有一項沒實查，就寫 `未驗證`。
