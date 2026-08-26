# 文章結構模板

---

## Front Matter 標準格式

```yaml
---
title: n8n [節點名稱] 節點教學 - [副標題說明核心價值]
pubDatetime: "YYYY-MM-DDTHH:mm:ss+08:00"
description: [80-150字，格式：功能說明。具體內容。實測重點。]
bgImage: blog-n8n-[節點名稱]-bg.jpg
ogImage: blog-n8n-[節點名稱]-bg.jpg
tags:
  - n8n
  - n8n節點介紹
  - n8n教學
  - [相關技術標籤，如 LINE、Gmail、Slack]
categories:
  - n8n
page_type: post
preload:
  - blog-n8n-[節點名稱]-bg.jpg
---
```

文章檔名是網址唯一來源。`n8n-[節點名稱小寫]-node.md` 對應 `/n8n-[節點名稱小寫]-node/`，front matter 不設定 `id` 或 `slug`。

只有文章有實質更新時才加入：

```yaml
modDatetime: "YYYY-MM-DDTHH:mm:ss+08:00"
```

---

## 文章類型與開場方式

**不是每篇都需要快速導覽！** 根據文章類型選擇開場方式：

| 類型 | 開場方式 | 範例檔案 |
|------|---------|---------|
| 節點完整教學 | 快速導覽型 | `n8n-gmail-node.md` |
| 概念解釋 | 直接切入 + 生活例子 | `n8n-if-switch.md` |
| 更新紀錄 | 直接列出版本 | `n8n-update-log.md` |
| 參考文檔 | 直接列出功能 | `n8n-built-in-variables.md` |
| 整合教學 | 背景說明 | `n8n-webhook.md` |

---

## 區塊 1：開場（三選一）

> 三選一是「版型」；第一行 hook 怎麼寫，參考 [VOICE.md](VOICE.md)「開場 Hook 模式庫」：
> 痛點直擊、現場敘事（「最近有人私訊問到 X」）、實測體感、交付物宣告。

### 選項 A：快速導覽型（節點完整教學用）

```markdown
{% darrellImageCover blog-n8n-xxx blog-n8n-xxx-bg.jpg max-800 %}

## 快速導覽

**預計閱讀時間：** X-X 分鐘
**適合對象：** 已有 n8n 基礎，想學會 [節點名稱] 節點和應用的朋友

**你將學到：**
- [學習點 1]
- [學習點 2]
- [學習點 3]

**如果趕時間，可以跳到**
{% quickNav %}
[
  {
    "text": "功能介紹",
    "anchor": "功能介紹錨點",
    "desc": "快速了解節點能做什麼"
  },
  {
    "text": "實戰案例",
    "anchor": "實戰案例錨點",
    "desc": "看實際應用場景"
  }
]
{% endquickNav %}
```

### 選項 B：問題導向型

```markdown
## 為什麼需要 [節點名稱] 節點？

如果你曾經遇到以下困擾：
- 用 Request 節點太麻煩：每次都要查 API 文件、手動設定 Header 和 Body
- 訊息格式容易出錯：JSON 格式稍有錯誤就無法發送
- 缺少視覺化操作：無法直觀看到可用的功能和參數

那這個節點絕對能幫上忙

我自己測試了這個節點，發現它可以：
- 簡化設定流程：視覺化介面，無需手動撰寫 JSON
- 降低出錯率：參數欄位清楚標示
- 核心功能齊全：滿足大部分使用場景
```

### 選項 C：直接切入型（概念解釋、參考文檔用）

```markdown
{% darrellImageCover blog-n8n-xxx blog-n8n-xxx-bg.jpg max-800 %}

## [節點/概念名稱]

n8n 的 [節點名稱] 應該是 [類別] 中前三名常用的節點

[用生活化比喻解釋概念]

舉幾個例子
[例子 1] -> [對應情境] -> **[節點A]**
[例子 2] -> [對應情境] -> **[節點B]**
```

---

## 區塊 2：設定與準備

```markdown
## <span id="設定錨點">API 申請與 n8n 設定</span>

### 前置準備

在開始之前，你需要先取得以下資訊：

必要項目：
- [項目 1]：從 [來源] 取得
- [項目 2]：[說明]

### 安裝/設定步驟

在 n8n 介面中，[操作說明]：

{% darrellImage800Alt "n8n xxx 節點的設定步驟畫面" n8n_xxx-設定步驟.png max-800 %}

參數說明：
- **Credential Name**：自訂名稱（例如：[範例]）
- **API Key**：貼上剛才取得的 Key
```

---

## 區塊 3：功能介紹

```markdown
## <span id="功能介紹錨點">功能介紹</span>

[節點名稱] 節點提供以下主要功能：

### 功能 1：[最常用功能名稱]

使用場景：[說明]

{% darrellImage800Alt "n8n xxx 節點功能 1 的操作畫面" n8n_xxx-功能1.png max-800 %}

[詳細操作說明，用自然語調]

### 功能 2：[第二常用功能]

[詳細說明]

### 其他功能快速參考

| 功能 | 說明 | 使用場景 |
|------|------|---------|
| [功能 A] | [簡短說明] | [場景] |
| [功能 B] | [簡短說明] | [場景] |
```

---

## 區塊 4：實戰案例

```markdown
## <span id="實戰案例錨點">實戰案例</span>

### [案例標題]

這個案例展示如何 [目標說明]

**流程：** [觸發] → [處理] → [輸出]

{% darrellImage800Alt "n8n xxx 案例的完整 workflow 畫面" n8n_xxx-案例-workflow.png max-800 %}

[詳細步驟說明]

實測效果：
[具體成果描述，包含數據]
```

---

## 區塊 5：收尾

```markdown
## 常見問題

{% faq %}
[
  {
    "question": "問題一的標題？",
    "answer": "問題一的回答，可以包含 <code>程式碼</code> 標籤。"
  },
  {
    "question": "問題二的標題？",
    "answer": "問題二的回答。"
  },
  {
    "question": "問題三的標題？",
    "answer": "問題三的回答。"
  }
]
{% endfaq %}

## 相關文章推薦

{% articleCard
  url="/n8n-相關文章/"
  title="相關文章標題"
  previewText="簡短描述"
  thumbnail="https://www.darrelltw.com/n8n-xxx/image.jpg"
%}

## 總結

[個人實測心得，2-3 段自然語調]

```

---

## 實測心得標準格式

當需要列出優缺點時，使用這個格式（不需要額外標題，直接列出）：

```markdown
優點：
- 設定簡單： 建立 Tables 和設定欄位很簡單迅速
- 費用： 這次免費更新給所有方案用戶
- 速度： 小型存取速度超快

缺點：
- 沒有備援： 資料要是不小心刪除，會真的不見
- 欄位管理： 欄位的管理介面和資料庫相比有點太陽春

適合場景：
- 小型專案想快速測試
- 如果遇到 Google Sheet 會有 rate limit 問題限制
```

---

## 截圖標籤規範

### 標籤類型

| 標籤 | 用途 | 格式 |
|------|------|------|
| `darrellImageCover` | 文章封面 | `{% darrellImageCover alt_id filename max-800 %}` |
| `darrellImage800` | 標準內文圖（alt 無空格） | `{% darrellImage800 alt_id filename max-800 %}` |
| `darrellImage800Alt` | **推薦** 標準內文圖（alt 可有空格） | `{% darrellImage800Alt "完整的 alt 描述文字" filename max-800 %}` |
| `darrellImage` | 自訂寬度圖 | `{% darrellImage alt_id filename max-400 %}` |

### 新舊標籤差異

**舊標籤 `darrellImage800`**：alt text 不能包含空格
```markdown
{% darrellImage800 n8n_gmail-設定畫面 n8n_gmail-settings.png max-800 %}
```

**新標籤 `darrellImage800Alt`（推薦）**：alt text 可以包含空格，用引號包裹
```markdown
{% darrellImage800Alt "n8n Gmail 節點的設定畫面，包含 OAuth 認證選項" n8n_gmail-settings.png max-800 %}
```

**建議**：新文章一律使用 `darrellImage800Alt`，提供更完整的 alt 描述有助於 SEO 和無障礙性。

---

## 圖片命名規則

```
n8n_{節點名稱}-{功能}_{子步驟}.png

範例：
- n8n_gmail-credentials_設定.png
- n8n_gmail-send_message.png
- n8n_datatables-insert.png
```

---

## articleCard 使用說明

**必填參數：**
- `url`：文章路徑（如 `/n8n-merge-node/`）
- `title`：文章標題
- `previewText`：簡短描述
- `thumbnail`：**必填！** 完整圖片 URL

**查找封面圖方式：**
```bash
ls /Users/darrellwang/Darrell/code/blog-astro/src/data/blog/[文章名稱]/ | rg -i 'bg'
```

**完整範例：**
```markdown
{% articleCard
  url="/n8n-merge-node/"
  title="n8n Merge 節點教學 - 資料合併完整指南"
  previewText="學會用 Merge 節點合併多個數據來源"
  thumbnail="https://www.darrelltw.com/n8n-merge-node/blog-n8n-merge-node-bg.jpg"
%}
```

---

## FAQ 標籤說明

- 使用 JSON 陣列格式，每個問題包含 `question` 和 `answer`
- 程式碼片段用 `<code>...</code>` 包起來
- 這個格式會自動產生 FAQ Schema，有助於 SEO rich snippet

---

## Callout 標籤說明

用於強調重要提醒、警告、提示等內容，取代傳統的 blockquote 或 emoji 標記。

### 基本語法

```markdown
{% callout tip %}
這是一個提示訊息
{% endcallout %}
```

### 四種類型

| 類型 | 用途 | 顏色 |
|------|------|------|
| `tip` | 小技巧、建議 | 綠色 |
| `info` | 補充資訊、說明 | 藍色 |
| `warning` | 警告、注意事項 | 橘色 |
| `error` | 錯誤、危險操作 | 紅色 |

### 自訂標題

```markdown
{% callout type="warning" title="升級前請注意" %}
建議先備份資料再進行升級
{% endcallout %}
```

### 使用時機

| 原有格式 | 建議改用 |
|---------|---------|
| `> 引用塊` + 警告內容 | `{% callout warning %}` |
| `⚠️` 開頭的提醒 | `{% callout warning %}` |
| `💡` 或「提示」 | `{% callout tip %}` |
| `**重要**` 或 `**注意**` | `{% callout info %}` |
| 錯誤說明、`❌` | `{% callout error %}` |

### 範例

```markdown
{% callout warning %}
此操作不可逆，請確認後再執行
{% endcallout %}

{% callout type="info" title="版本說明" %}
本文基於 n8n 1.70.0 版本撰寫
{% endcallout %}
```

---

## 常用寫作技巧

**1. 生活化比喻解釋技術概念**
```
Webhook 用白話文來說就是一個接收器，Webhook = Web + Hook，
可以想像成網路世界的釣竿或鉤子
```

**2. 用生活例子開頭**
```
舉幾個例子
今天要吃什麼午餐 -> 是個開放性的問題
今天午餐要不要吃麥當勞 -> Yes or No -> **If**
今天午餐吃麥當勞還是肯德基 -> 二選一 -> **Switch**
```

**3. 用「如圖」「如下」銜接截圖**
```
條件的設定如下:
{% darrellImage800Alt "n8n Filter 節點的條件設定" n8n_filter-setting_rule.png max-800 %}
```

**4. 用「-」列出功能說明**
```
- **GET**：取得資料
- **POST**：提交資料
- **PUT**：更新資源
```

**5. 用數字編號列出步驟**
```
1. 建立一個 Perplexity 節點
2. 在 credential 那邊選取新增一個 credential
```

**6. 強調重要資訊用粗體 + 驚嘆號**
```
**這個網域是沒辦法當作 webhook 的網址!**
**但不會 return 資料 !!**
**經驗上 POST >>> GET**
```
