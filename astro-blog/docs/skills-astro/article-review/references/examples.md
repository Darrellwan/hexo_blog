# 文章版型 gate 範例

## 1. 封面與開頭順序

### Before

兩篇同類基準文章都以 `darrellImageCover` 開場，目標文章卻直接放 QuickNav：

```markdown
{% quickNav %}
[
  {"text": "功能比較", "anchor": "comparison", "desc": "先看差異"}
]
{% endquickNav %}
```

### After

```markdown
{% darrellImageCover article-cover article-cover.jpg max-800 %}

{% quickNav %}
[
  {"text": "功能比較", "anchor": "comparison", "desc": "先看差異"}
]
{% endquickNav %}
```

原則：兩篇基準一致的開頭 pattern 直接繼承。圖片不適合作封面時，先向用戶提出偏離理由，不自行省略。

## 2. Custom Tag JSON 排版

### Before

```markdown
{% dataTable style="minimal" align="left" %}
[{"模式":"Work","用途":"文件"},{"模式":"Codex","用途":"程式碼"}]
{% enddataTable %}
```

### After

```markdown
{% dataTable style="minimal" align="left" %}
[
  {"模式": "Work", "用途": "文件"},
  {"模式": "Codex", "用途": "程式碼"}
]
{% enddataTable %}
```

原則：Astro 能解析不代表符合專案格式。JSON 維持可讀、可 review、容易逐列修改的排版。

## 3. 文章內一次性 CSS

### Before

```html
<style>
@media (max-width: 640px) {
  #comparison ~ .data-table-wrapper .data-table { min-width: 960px; }
}
</style>
```

### After

先找相同元件在 theme CSS 或其他文章中的既有解法。若確實需要新樣式，放進正確的共用 CSS，確認影響範圍並做桌面／手機驗收。只有文章本身具備無法共用的特殊需求，而且用戶同意時，才保留文章內 style 並在稽核命令明列例外原因。

原則：局部 workaround 不是預設解法，尤其不能在沒有查既有 pattern 前直接加入。

## 4. 文章結尾缺少既有區塊

### Before

```markdown
<h2 id="faq">常見問題</h2>

{% faq %}
[
  {"question": "怎麼選？", "answer": "看最後交付物。"}
]
{% endfaq %}
```

文章到 FAQ 就結束，但兩篇同類基準都有相關文章與參考來源。

### After

```markdown
<h2 id="related">相關文章</h2>

{% articleCard
  url="/related-post/"
  title="相關文章標題"
  previewText="這篇文章能補充什麼"
  thumbnail="https://www.darrelltw.com/related-post/cover.jpg"
%}

<h2 id="sources">參考來源</h2>

- [官方文件](https://example.com/docs)
```

原則：基準文章共同具備的收尾區塊不能無聲消失；不適用時先說明原因。

## 5. 建置通過但輸出過期

### Before

來源文章在 11:13 修改，`dist/<檔名>/index.html` 仍是 10:51 的舊輸出，卻沿用先前的 build PASS。

### After

重新建置後執行 `audit.py --phase final`，確認 HTML 與 Markdown 產物時間都不早於來源文章，再做瀏覽器驗收。

原則：驗證只對當時的來源版本有效。來源變更後，舊的建置與畫面檢查全部失效。
