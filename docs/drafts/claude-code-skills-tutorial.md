---
title: Claude Code Skills 完整教學：5 分鐘打造你的第一個 AI 技能包
date: 2026-01-16 00:24:08
tags:
  - Claude Code
  - Claude Code Skills
  - Claude Code 教學
  - AI 工具
categories:
  - AI 工具教學
page_type: post
id: claude-code-skills-tutorial
description: 從零開始學會 Claude Code Skills！包含 3 個實用範例、常見錯誤排解、FAQ。讓 AI 助手記住你的專業知識，不用每次重複說明。
bgImage: claude-code-skills-tutorial-bg.jpg
---

{% darrellImageCover claude_code_skills_cover claude-code-skills-tutorial-bg.jpg max-800 %}

{% quickNav %}
[
  {"text": "5 分鐘快速上手", "anchor": "quick-start", "desc": "最快建立第一個 Skill"},
  {"text": "Skills vs CLAUDE.md", "anchor": "skills-vs-claude-md", "desc": "什麼時候用哪個"},
  {"text": "3 個實用範例", "anchor": "three-examples", "desc": "初/中/進階完整範例"},
  {"text": "常見錯誤", "anchor": "common-errors", "desc": "Skill 沒被觸發怎麼辦"},
  {"text": "FAQ", "anchor": "faq", "desc": "5 個常見問題解答"}
]
{% endquickNav %}

## 前言：為什麼需要 Skills？

如果你用過 Claude Code 一段時間，應該有過這種經驗：

> 「每次開新專案，都要重新跟 Claude 說一次我們團隊的 coding style、commit 規範、API 串接方式...」

你可能已經知道 `CLAUDE.md` 可以存放專案指引，但它有個問題：**啟動時全部載入**，不管當前任務用不用得到。指引一長，效能就會變差。

**Skills 解決的就是這個問題**：
- 按需載入：只有相關的知識才會被載入
- 跨專案復用：一次建立，到處使用
- 自動觸發：Claude 會自己判斷什麼時候該用

簡單說，Skills = **可重複使用的專業知識包**。

---

<h2 id="quick-start">5 分鐘快速上手：建立你的第一個 Skill</h2>

不囉嗦，直接動手。我們來建立一個最簡單的 Skill：**台灣繁體中文翻譯助手**。

### Step 1：建立資料夾

在終端機執行：

```bash
mkdir -p ~/.claude/skills/translation-helper
```

這會在你的個人 Claude 設定目錄下建立一個 Skill 資料夾。

### Step 2：建立 SKILL.md

在 `~/.claude/skills/translation-helper/` 目錄下建立 `SKILL.md` 檔案：

```markdown
---
name: translation-helper
description: 台灣繁體中文翻譯助手。當使用者要求翻譯、說「翻成中文」「translate to Chinese」「幫我翻譯」時自動啟用。
---

# 台灣繁體中文翻譯規範

翻譯時請遵循以下原則：

## 基本規則
1. 使用台灣繁體中文（非簡體、非香港用語）
2. 技術專有名詞保留英文（如 API、SDK、JSON）
3. 語氣自然，避免機器翻譯感

## 常見詞彙對照
| 英文 | 台灣用法 | 避免用法 |
|------|----------|----------|
| File | 檔案 | 文件 |
| Video | 影片 | 視頻 |
| Software | 軟體 | 軟件 |
| Information | 資訊 | 信息 |
| Network | 網路 | 網絡 |

## 輸出格式
翻譯完成後，請提供：
1. 翻譯結果
2. 如有專有名詞，列出保留英文的原因
```

### Step 3：測試觸發

重新啟動 Claude Code，然後輸入：

```
幫我把這段翻成中文：The API response includes a JSON payload with user information.
```

如果 Claude 問你「是否要啟用 translation-helper？」，恭喜，你的第一個 Skill 建立成功了！

{% callout tip %}
**完整可複製版本**：上面的 SKILL.md 內容可以直接複製使用，記得把 `name` 欄位改成跟資料夾名稱一致。
{% endcallout %}

---

<h2 id="skills-vs-claude-md">Skills vs CLAUDE.md：什麼時候用哪個？</h2>

這是最多人問的問題。簡單來說：

{% dataTable style="minimal" align="left" %}
[
  {"項目": "載入時機", "CLAUDE.md": "啟動時全部載入", "Skills": "按需動態載入"},
  {"項目": "適用範圍", "CLAUDE.md": "專案固定規則", "Skills": "特定任務知識"},
  {"項目": "跨專案", "CLAUDE.md": "需複製到每個專案", "Skills": "放 ~/.claude/skills/ 全域可用"},
  {"項目": "觸發方式", "CLAUDE.md": "永遠生效", "Skills": "Claude 自動判斷"}
]
{% enddataTable %}

**一句話決策**：
- 「每次都要用」→ 放 `CLAUDE.md`
- 「特定情況才用」→ 建 Skill

### 實際範例

| 情境 | 建議 |
|------|------|
| 專案的 ESLint 設定 | CLAUDE.md |
| Git commit 格式規範 | Skill（只有 commit 時才需要）|
| API endpoint 列表 | CLAUDE.md |
| 翻譯風格指南 | Skill（只有翻譯時才需要）|

---

## 核心概念：Progressive Disclosure

Skills 最聰明的設計是 **三層漸進式載入**：

```
第一層：Metadata（~100 tokens）
  └── name + description
  └── 啟動時預載，用於判斷相關性

第二層：Instructions（建議 < 5000 tokens）
  └── SKILL.md 主體內容
  └── 相關時才載入

第三層：Resources（按需載入）
  └── scripts/、references/、assets/
  └── 需要時才讀取
```

這就像 Google Maps 導航：先給大方向，快到路口才給細節，要找加油站時才載入附近資訊。

**好處**：你可以在一個 Skill 裡打包大量知識，但不會一次塞爆 context window。

---

<h2 id="three-examples">3 個實用範例</h2>

### 範例 1：台灣繁體中文翻譯助手（初級）

上面快速上手已經示範過了，這是最簡單的 Skill 結構：

```
translation-helper/
└── SKILL.md
```

**重點**：`description` 要列出所有可能的觸發詞。

---

### 範例 2：Git Commit 規範（中級）

這個範例展示如何設計精準的觸發條件。

**目錄結構**：
```
commit-guide/
└── SKILL.md
```

**SKILL.md 內容**：

```markdown
---
name: commit-guide
description: Git commit message 規範助手。當使用者要 commit、寫 commit message、說「幫我 commit」「git commit」「提交」時啟用。
---

# Git Commit 規範

## 格式
[TYPE] 簡短描述（50 字元內）

## Type 類型
- `[NEW POST]` - 新文章
- `[UPDATE]` - 更新現有內容
- `[FIX]` - 修復錯誤
- `feat:` - 新功能
- `fix:` - Bug 修復
- `docs:` - 文件更新
- `chore:` - 雜項維護

## 範例

Good:
[UPDATE] 優化文章標題，強化 SEO 關鍵字
feat: 新增使用者登入功能

Bad:
更新了一些東西
fix bug

## 注意事項
1. 第一行不超過 50 字元
2. 使用祈使語氣（add, fix, update）
3. 不要用句號結尾
4. 如有 issue 編號，放在最後一行
```

**觸發條件設計**：
- 中文：「幫我 commit」「提交」「寫 commit message」
- 英文：「git commit」「commit changes」
- 情境：當 Claude 偵測到使用者要進行 git commit 操作時

---

### 範例 3：Code Review Checklist（進階）

這個範例展示如何整合 `scripts/` 目錄。

**目錄結構**：
```
code-review/
├── SKILL.md
└── scripts/
    └── check-todos.sh
```

**SKILL.md 內容**：

```markdown
---
name: code-review
description: Code Review 檢查清單。當使用者要求 review code、檢查程式碼、說「幫我 review」「code review」「PR review」時啟用。
---

# Code Review Checklist

## 必檢項目

### 1. 功能正確性
- [ ] 程式碼是否符合需求描述？
- [ ] 邊界條件是否處理？
- [ ] 錯誤處理是否完整？

### 2. 程式碼品質
- [ ] 命名是否清晰易懂？
- [ ] 是否有重複程式碼可抽取？
- [ ] 函式是否過長（建議 < 50 行）？

### 3. 安全性
- [ ] 是否有 SQL injection 風險？
- [ ] 使用者輸入是否有驗證？
- [ ] 敏感資訊是否外洩？

### 4. 效能
- [ ] 是否有 N+1 query 問題？
- [ ] 是否有不必要的迴圈？
- [ ] 大量資料是否有分頁？

## 輔助腳本

檢查 TODO 和 FIXME 註解：
```bash
scripts/check-todos.sh
```

## 輸出格式

Review 完成後，請提供：
1. 整體評價（通過/需修改/重寫）
2. 具體問題列表（附行號）
3. 改善建議
```

**scripts/check-todos.sh**：

```bash
#!/bin/bash
# 檢查程式碼中的 TODO 和 FIXME

echo "=== 檢查 TODO/FIXME 註解 ==="
grep -rn "TODO\|FIXME" --include="*.js" --include="*.ts" --include="*.py" .
echo "=== 檢查完成 ==="
```

{% callout info %}
**進階技巧**：scripts/ 裡的腳本會被 Claude 自動執行，所以要確保腳本是安全的。
{% endcallout %}

---

## description 寫法攻略

`description` 是 Skill 最重要的部分，它決定 Claude 什麼時候會觸發這個 Skill。

### 好壞對照表

{% dataTable style="minimal" align="left" highlight="1,3,5" %}
[
  {"寫法": "❌ 不好", "範例": "Helps with translations.", "問題": "太模糊，不知道何時觸發"},
  {"寫法": "✅ 好", "範例": "當使用者要求翻譯、說「翻成中文」「translate」時啟用", "問題": "-"},
  {"寫法": "❌ 不好", "範例": "Code review helper.", "問題": "沒有列出觸發詞"},
  {"寫法": "✅ 好", "範例": "當使用者說「review」「檢查程式碼」「PR review」時啟用", "問題": "-"},
  {"寫法": "❌ 不好", "範例": "Useful for commits.", "問題": "太籠統"},
  {"寫法": "✅ 好", "範例": "當使用者要 commit、寫 commit message、說「幫我 commit」時啟用", "問題": "-"}
]
{% enddataTable %}

### 撰寫原則

1. **列出觸發詞**：中英文都要寫
2. **描述情境**：「當使用者...時」
3. **具體明確**：避免「helpful」「useful」等模糊詞
4. **不超過 1024 字元**：這是規格限制

---

<h2 id="common-errors">常見錯誤與解法</h2>

### 問題 1：Skill 沒被觸發

**可能原因**：

1. **description 太模糊**
   - 檢查：有沒有列出具體觸發詞？
   - 解法：加入「當使用者說 XXX 時」的描述

2. **檔案位置錯誤**
   - 正確：`~/.claude/skills/skill-name/SKILL.md`
   - 錯誤：`~/.claude/commands/`（這是 Custom Commands）

3. **name 跟資料夾名稱不一致**
   - SKILL.md 裡的 `name: xxx` 必須跟資料夾名稱相同

**Debug 方法**：
重新啟動 Claude Code 後，輸入一個你預期會觸發的指令。如果 Claude 沒有問「是否啟用 XXX skill？」，就是觸發條件有問題。

---

### 問題 2：YAML frontmatter 格式錯誤

**常見錯誤**：

```yaml
# 錯誤：缺少 ---
name: my-skill
description: ...

# 錯誤：name 有大寫
---
name: My-Skill
description: ...
---

# 正確
---
name: my-skill
description: ...
---
```

**name 規則**：
- 只能用小寫字母、數字、`-`
- 不能以 `-` 開頭或結尾
- 不能有連續的 `-`

---

### 問題 3：scripts/ 無法執行

**可能原因**：

1. **沒有執行權限**
   ```bash
   chmod +x scripts/check-todos.sh
   ```

2. **路徑問題**
   - 在 SKILL.md 裡要用相對路徑：`scripts/check-todos.sh`
   - 不要用絕對路徑

3. **腳本有語法錯誤**
   - 先手動執行測試：`bash scripts/check-todos.sh`

---

<h2 id="faq">FAQ 常見問題</h2>

{% faq %}
[
  {
    "question": "Skills 跟 CLAUDE.md 有什麼不同？",
    "answer": "CLAUDE.md 是啟動時全部載入，適合專案固定規則；Skills 是按需載入，適合特定任務的專業知識。簡單說：「每次都要用」放 CLAUDE.md，「特定情況才用」建 Skill。"
  },
  {
    "question": "Skill 放在哪裡？個人 vs 專案",
    "answer": "個人層級放 ~/.claude/skills/，所有專案都能用。專案層級放 .claude/skills/，會進 git，團隊成員 pull 下來就能用。兩邊有同名 Skill 時，個人層級優先。"
  },
  {
    "question": "Skills、MCP、Custom Commands 有什麼不同？",
    "answer": "Skills 是「知識」、MCP 是「工具」、Commands 是「巨集」。想讓 AI 自動判斷用什麼專業知識 → Skills；想連接外部 API/資料庫 → MCP；想手動觸發固定流程 → Custom Commands。三者可配合使用。"
  },
  {
    "question": "團隊怎麼共用 Skills？",
    "answer": "把 Skill 放在專案的 .claude/skills/ 目錄，push 到 git repo。團隊成員 pull 下來後就能自動使用。建議在 skills/README.md 說明每個 Skill 的用途和觸發方式。"
  },
  {
    "question": "不會寫程式可以用 Skills 嗎？",
    "answer": "可以。最簡單的 Skill 只需要一個 SKILL.md 檔案，內容就是 Markdown 文字，不需要寫任何程式。scripts/ 資料夾是可選的進階功能。"
  }
]
{% endfaq %}

---

## 安全注意事項

使用 Skills 時請注意以下三點：

1. **只從信任來源安裝**：`scripts/` 裡的程式碼會被執行，下載前先檢查內容

2. **不要在 Skill 裡存放敏感資訊**：API keys、密碼等應該放環境變數，不要寫在 SKILL.md

3. **檢查 SKILL.md 內容**：確認沒有「把 .env 傳送到某網址」之類的惡意指令

---

## 延伸：Agent Skills 開放標準

2024 年底，Anthropic 將 Skills 發布為[開放標準](https://agentskills.io/)，其他 AI 工具也可以採用這個規格。

這代表：
- 你建立的 Skills **未來可能跨工具使用**，不會被鎖在單一平台
- 其他人發布的 Skills 你也能直接使用
- 社群可以共同建立 Skills 生態系

目前已有多個工具宣布支援，可以關注 [agentskills.io](https://agentskills.io/) 的最新進展。

---

## 延伸閱讀

想了解更多 Claude Code 功能？推薦閱讀：

{% articleCard url="/claude-code-agent/" title="Claude Code Agent 模式介紹" previewText="讓 AI 自動執行複雜任務的強大功能" thumbnail="https://www.darrelltw.com/claude-code-agent/claude_code_agent-bg.jpg" %}

{% articleCard url="/claude-code-new-command-line-tool/" title="Claude Code 命令列工具介紹" previewText="Anthropic 推出的全新 AI 編碼助手" thumbnail="https://www.darrelltw.com/claude-code-new-command-line-tool/claude_code.jpg" %}

---

## 總結

Skills 讓你可以把專業知識打包成可復用的模組，Claude 會自動判斷什麼時候該用。

**三個重點**：
1. 「5 分鐘就能建立第一個 Skill」
2. 「description 要寫清楚觸發條件」
3. 「遇到問題先檢查檔案位置和 name 一致性」

現在就去建立你的第一個 Skill 吧！

