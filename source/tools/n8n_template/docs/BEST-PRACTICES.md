# 靜態生成最佳實踐

## 🎯 核心原則

### 1. 不要用正則處理 HTML

**原因**：HTML 是上下文相關文法（Context-Free Grammar），正則表達式無法正確解析。

**錯誤示例**：
```javascript
// ❌ 絕對避免
html.replace(/<div>(.*?)<\/div>/, newContent)
html.match(/<div class="grid">([\s\S]*?)<\/div>/)
```

**正確方案**：
```javascript
// ✅ 方案 A：使用 HTML 解析器
const cheerio = require('cheerio');
const $ = cheerio.load(html);
$('.model-grid').html(cardsHTML);

// ✅ 方案 B：使用佔位符（最簡單）
html.replace('{{PLACEHOLDER}}', content);

// ✅ 方案 C：手動深度追蹤
// （見下方實作）
```

---

## 🏗️ 推薦架構：佔位符模式

### 步驟 1：創建模板文件

```html
<!-- models.template.html -->
<!DOCTYPE html>
<html>
<head>...</head>
<body>
    <div class="container">
        <div class="model-grid">
            {{MODEL_CARDS}}
        </div>
    </div>

    <script type="application/ld+json">
        {{SCHEMA_DATA}}
    </script>
</body>
</html>
```

### 步驟 2：生成腳本

```javascript
// generate-models-page.js
const fs = require('fs');

function generate() {
    // 1. 讀取模板
    let html = fs.readFileSync('models.template.html', 'utf8');

    // 2. 生成內容
    const cardsHTML = models.map(createCard).join('\n');
    const schemaJSON = JSON.stringify(generateSchema(models), null, 2);

    // 3. 簡單替換（安全可靠）
    html = html.replace('{{MODEL_CARDS}}', cardsHTML);
    html = html.replace('{{SCHEMA_DATA}}', schemaJSON);

    // 4. 驗證
    validate(html, models.length);

    // 5. 寫入
    fs.writeFileSync('models.html', html);
}
```

---

## 🔍 驗證機制

### 必須包含的驗證

```javascript
function validate(html, expectedCount) {
    // 1. 卡片數量驗證
    const cardCount = (html.match(/class="model-card"/g) || []).length;
    if (cardCount !== expectedCount) {
        throw new Error(
            `卡片數量錯誤：預期 ${expectedCount}，實際 ${cardCount}`
        );
    }

    // 2. 結構完整性驗證
    const hasGrid = html.includes('<div class="model-grid">');
    const hasSchema = html.includes('type="application/ld+json"');

    if (!hasGrid) {
        throw new Error('缺少 model-grid 容器');
    }

    if (!hasSchema) {
        console.warn('⚠️  警告：缺少結構化數據');
    }

    // 3. 佔位符檢查（確保已替換）
    const hasPlaceholder = html.includes('{{');
    if (hasPlaceholder) {
        throw new Error('發現未替換的佔位符');
    }

    console.log('✅ 驗證通過');
}
```

---

## 🎨 手動深度追蹤實作

如果必須直接操作 HTML（無法使用佔位符），使用深度計數：

```javascript
function findMatchingClosingTag(html, openTag) {
    const startIndex = html.indexOf(openTag);
    if (startIndex === -1) {
        throw new Error(`找不到開標籤: ${openTag}`);
    }

    // 提取標籤名稱（如 "div"）
    const tagName = openTag.match(/<(\w+)/)[1];
    const openPattern = `<${tagName}`;
    const closePattern = `</${tagName}>`;

    let depth = 0;
    let pos = startIndex;

    while (pos < html.length) {
        // 檢查開標籤
        if (html.substr(pos, openPattern.length) === openPattern) {
            depth++;
            pos += openPattern.length;
        }
        // 檢查閉標籤
        else if (html.substr(pos, closePattern.length) === closePattern) {
            depth--;
            if (depth === 0) {
                return pos; // 找到匹配的閉標籤
            }
            pos += closePattern.length;
        }
        else {
            pos++;
        }
    }

    throw new Error(`找不到匹配的 ${closePattern}`);
}

// 使用
const startIndex = html.indexOf('<div class="model-grid">');
const endIndex = findMatchingClosingTag(html, '<div class="model-grid">');

const before = html.substring(0, startIndex + '<div class="model-grid">'.length);
const after = html.substring(endIndex);
const result = before + '\n' + cardsHTML + '\n' + after;
```

---

## 🚨 常見錯誤模式

### ❌ 錯誤 1：貪婪匹配

```javascript
// ❌ 會匹配到最後一個 </div>
html.replace(/<div class="grid">(.*)<\/div>/, newContent)
```

### ❌ 錯誤 2：非貪婪但遇到嵌套

```javascript
// ❌ 會在第一個 </div> 停止（我們的原始 bug）
html.replace(/<div class="grid">(.*?)<\/div>/, newContent)
```

### ❌ 錯誤 3：不驗證結果

```javascript
// ❌ 沒有驗證，可能產生錯誤的 HTML
fs.writeFileSync('output.html', html);
```

### ❌ 錯誤 4：混合靜態與動態

```javascript
// ❌ 靜態生成後，JavaScript 又清空重渲染
// generate-models-page.js
html.replace('{{CARDS}}', cardsHTML);

// models.html <script>
modelGrid.innerHTML = '';  // ❌ 清空靜態內容
modelGrid.innerHTML = generateCards();  // ❌ 重新生成
```

---

## ✅ 正確模式清單

| 模式 | 用途 | 優點 | 缺點 |
|------|------|------|------|
| **佔位符** | 一般情況 | 簡單可靠 | 需要修改模板 |
| **HTML 解析器** | 複雜 HTML | 最安全 | 需要依賴 |
| **深度追蹤** | 無法改模板 | 不需依賴 | 較複雜 |
| **DOM 操作** | 瀏覽器環境 | 最準確 | 只能客戶端 |

---

## 📚 參考資料

### 為什麼不能用正則解析 HTML？

經典 Stack Overflow 回答：
> "You can't parse [X]HTML with regex... Because HTML can't be parsed by regex. Regex is not a tool that can be used to correctly parse HTML."

**技術原因**：
- HTML 是 **Context-Free Grammar (CFG)**
- 正則只能處理 **Regular Grammar**
- CFG ⊃ Regular Grammar（CFG 更複雜）

**實例**：
```html
<div>
  <div>
    <div>...</div>
  </div>
</div>
```

正則無法「記憶」有多少個開標籤，因此無法匹配正確的閉標籤。

---

## 🎓 學習路徑

### 初學者
1. 使用佔位符模式
2. 加入基本驗證
3. 測試邊界情況

### 進階者
1. 學習 Cheerio/JSDOM
2. 理解 CFG 原理
3. 實作自定義解析器

### 專家級
1. 使用 AST 操作
2. 實作編譯器技術
3. 優化性能與記憶體

---

## 🔧 工具推薦

### HTML 解析器

```javascript
// Cheerio（類似 jQuery）
const cheerio = require('cheerio');
const $ = cheerio.load(html);
$('.model-grid').html(newContent);

// JSDOM（完整 DOM）
const jsdom = require('jsdom');
const dom = new JSDOM(html);
const grid = dom.window.document.querySelector('.model-grid');
grid.innerHTML = newContent;

// node-html-parser（輕量）
const { parse } = require('node-html-parser');
const root = parse(html);
const grid = root.querySelector('.model-grid');
grid.set_content(newContent);
```

---

## 📝 總結

1. **永遠不要用正則處理 HTML**
2. **優先使用佔位符模式**
3. **必須加入驗證機制**
4. **分離靜態生成與動態渲染**
5. **測試邊界情況**

**記住**：複雜度應該由正確的工具承擔，不是由錯誤的方法累積。
