# 文章語法與寫作 Checklist

自動 audit 不會取代這份人工檢查。逐項檢查並附行號回報。

## DataTable

- 資料性表格優先使用 `{% dataTable %}`，簡單對照才保留 Markdown table。
- JSON 必須有效，排版延續兩篇基準文章。
- `style`、`align`、`highlight` 只使用專案已支援的參數。

```markdown
{% dataTable style="minimal" align="left" %}
[
  {"欄位": "A", "值": "B"}
]
{% enddataTable %}
```

## Callout

- 類型只用 `tip`、`info`、`warning`、`error`。
- 有自訂標題時使用完整的 `type` 與 `title` 語法。

```markdown
{% callout tip %}
內容
{% endcallout %}

{% callout type="warning" title="自訂標題" %}
內容
{% endcallout %}
```

## Term tooltip

- 技術名詞第一次出現時要有一般讀者看得懂的解釋。
- 適合的英文括號解釋改用 `{% term %}`。
- 加上 term 後移除原本括號說明，避免重複。
- 常用定義先查 `/Users/darrellwang/Darrell/code/blog-astro/docs/guides/term-definitions.md`。

```markdown
使用 {% term def="API 服務限制單位時間內的請求次數" %}rate limit{% endterm %} 保護服務。
```

## FAQ

- FAQ 使用 `{% faq %}`，不使用 Markdown table 假裝 FAQ。
- JSON 必須是陣列，每項都有 `question` 與 `answer`。
- 排版延續兩篇基準文章，不壓成單行。

## 圖片

- 封面依基準使用 `darrellImageCover`。
- 內文圖優先使用 `darrellImage800Alt`，alt 必須具體描述畫面。
- 檔案放在 `src/data/blog/<文章檔名（不含 .md）>/`。
- 不使用 `Screenshot_...` 等系統自動檔名。
- front matter `bgImage` 與正文引用的圖片都必須實際存在。

## Anchor 與 QuickNav

- 手動 `id` 使用小寫連字號，不使用大寫或底線。
- 每個 QuickNav `anchor` 都有唯一且存在的對應 `id`。
- QuickNav 文字與實際 heading 意思一致。

## ArticleCard

- `thumbnail` 必須讀取被推薦文章的真實 `bgImage`，不能由 slug 猜測。
- `url` 必須對應實際 permalink。
- `title` 與 `previewText` 不宣稱目標文章沒有的內容。

## 寫作風格

- 不使用 `——`。
- 避免「終極教學」「完全指南」「一文搞懂」「深入淺出」等 AI 氣味詞。
- 刪除或改寫「哈哈哈」「貌似」「還以為」與 `...` 尾音。
- 中文句中的半形 `?`、`!` 改成全形「？」「！」。
- 一個 H2 區塊最多一個驚嘆號，且只放在明確結果或警告。
- 設問後立刻回答，不把答案藏在文章外。
- 對比與排比必須服務內容，不用「不用 X、不用 Y、不用 Z」當空泛結語。

## 快速搜尋

```bash
rg -n '^\|' /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/target.md
rg -n '哈哈|貌似|還以為|——|\.\.\.' /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/target.md
rg -n '[一-龥][?!]' /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/target.md
rg -n 'articleCard|darrellImage|quickNav|dataTable|faq|term' /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/target.md
```
