# FAQ 組件使用指南

## 基本用法

### 簡單 FAQ（無分類）

```markdown
{% faq %}
[
  {
    "question": "n8n 是什麼？",
    "answer": "n8n 是一個開源的工作流自動化工具，可以讓你連接不同的服務和 API，建立自動化流程。它提供了超過 400 個節點，支援各種常見的服務整合。"
  },
  {
    "question": "如何開始使用 n8n？",
    "answer": "你可以選擇三種方式：1️⃣ 使用 <strong>n8n Cloud</strong> 雲端版本 2️⃣ 使用 <code>npx n8n</code> 本地安裝 3️⃣ 使用 Docker 部署。建議新手先從雲端版開始體驗。"
  },
  {
    "question": "n8n 免費嗎？",
    "answer": "n8n 本身是開源且免費的。如果你選擇自己架設（Self-hosted），完全免費。n8n Cloud 則提供免費方案（每月 5000 次執行），適合個人使用和測試。"
  }
]
{% endfaq %}
```

---

## 進階用法（帶分類）

### 分類 FAQ

```markdown
{% faq %}
[
  {
    "category": "基礎設定",
    "question": "如何取得 Google Sheets API 金鑰？",
    "answer": "前往 <a href='https://console.cloud.google.com'>Google Cloud Console</a> → 建立專案 → 啟用 Google Sheets API → 建立憑證（服務帳號或 OAuth 2.0）。詳細步驟可參考我的教學文章。"
  },
  {
    "category": "基礎設定",
    "question": "Credential 設定錯誤怎麼辦？",
    "answer": "常見原因：❌ API 金鑰過期 ❌ 權限不足 ❌ 網域限制。建議先在 n8n 中點擊「Test Connection」確認連線狀態。"
  },
  {
    "category": "進階應用",
    "question": "如何處理大量資料？",
    "answer": "使用 <code>Split In Batches</code> 節點分批處理，避免單次執行超過記憶體限制。建議每批處理 100-500 筆資料，並加入 <code>Wait</code> 節點避免 API rate limit。"
  },
  {
    "category": "進階應用",
    "question": "工作流執行失敗如何除錯？",
    "answer": "開啟 <strong>Error Trigger</strong> 節點捕捉錯誤，搭配 <code>IF</code> 節點判斷錯誤類型，並用 <strong>Line Notify</strong> 或 <strong>Email</strong> 節點發送通知。實測發現這樣可以減少 80% 的問題排查時間。"
  },
  {
    "category": "常見問題",
    "question": "為什麼我的工作流沒有自動執行？",
    "answer": "檢查以下幾點：\n\n✅ Workflow 是否已啟用（Active）\n✅ Trigger 節點設定是否正確\n✅ n8n 服務是否正常運行\n✅ Webhook URL 是否正確\n\n如果使用 Cron Trigger，確認時區設定正確。"
  }
]
{% endfaq %}
```

---

## 樣式特色

### 視覺設計
- ✨ **平滑動畫**：使用 cubic-bezier 曲線，展開收合更流暢
- 🎨 **配色一致**：延續網站橘色主題 + 深色背景
- 💡 **Hover 效果**：懸停時有微妙的背景變化和陰影
- 📱 **RWD 響應式**：手機版自動調整字體和間距

### 互動體驗
- 🖱️ **點擊展開/收合**：類似手風琴效果
- 🔄 **圖示旋轉動畫**：箭頭展開時會旋轉 180 度
- 📍 **視覺層次**：問題用 ❓、答案用 ✅ emoji 標示

### 內容支援
- **粗體文字**：使用 `<strong>` 會自動套用橘色
- **程式碼**：使用 `<code>` 會有深色背景和藍色文字
- **連結**：使用 `<a>` 會有下底線和 hover 效果
- **列表**：支援 `<ul>` 和 `<ol>`

---

## 使用場景建議

### 1. 節點教學文章
在「常見問題」章節使用，取代純文字表格：

```markdown
## 常見問題

{% faq %}
[
  {
    "question": "這個節點支援哪些資料格式？",
    "answer": "支援 JSON、CSV、XML 三種格式..."
  }
]
{% endfaq %}
```

### 2. 實用案例補充
在案例後面補充常見疑問：

```markdown
## 實用案例：自動化發票通知

（案例說明...）

### 常見問題

{% faq %}
[
  {
    "question": "如何避免重複發送通知？",
    "answer": "使用 Google Sheets 記錄已發送的發票編號..."
  }
]
{% endfaq %}
```

### 3. 故障排除指南
按照錯誤類型分類：

```markdown
{% faq %}
[
  {
    "category": "連線錯誤",
    "question": "401 Unauthorized",
    "answer": "API 金鑰無效或過期..."
  },
  {
    "category": "連線錯誤",
    "question": "429 Too Many Requests",
    "answer": "超過 API 呼叫限制..."
  },
  {
    "category": "資料處理",
    "question": "資料格式不符",
    "answer": "使用 Function 節點轉換..."
  }
]
{% endfaq %}
```

---

## 撰寫建議

### ✅ 好的做法
- 問題簡潔明確（10-20 字）
- 答案提供實際解決方案，不只是理論
- 加入個人實測經驗（「實測發現...」）
- 使用 emoji 增加可讀性
- 適當使用 `<strong>` 和 `<code>` 標籤

### ❌ 避免的做法
- 問題太長（超過 30 字）
- 答案只有一兩句話（太簡略）
- 過度使用技術術語（新手看不懂）
- 答案中沒有實際操作步驟
- 所有 FAQ 都沒有分類（超過 5 個建議分類）

---

## 實際範例

這是一個完整的 n8n 節點文章 FAQ 範例：

```markdown
## 常見問題

{% faq %}
[
  {
    "category": "設定相關",
    "question": "Gmail 節點一直顯示授權失敗？",
    "answer": "檢查以下步驟：<br><br>1️⃣ 確認 Google Cloud Console 已啟用 Gmail API<br>2️⃣ OAuth 2.0 redirect URI 是否正確設定<br>3️⃣ 重新授權 Credential（有時 token 會過期）<br><br>實測發現，<strong>90% 的問題</strong>都是 redirect URI 設定錯誤。"
  },
  {
    "category": "設定相關",
    "question": "如何取得 OAuth Client ID？",
    "answer": "前往 <a href='https://console.cloud.google.com/apis/credentials'>Google Cloud Console</a> → 憑證 → 建立憑證 → OAuth 2.0 用戶端 ID → 選擇「網頁應用程式」→ 複製 Client ID 和 Secret 到 n8n。"
  },
  {
    "category": "功能使用",
    "question": "可以一次發送多封郵件嗎？",
    "answer": "可以！使用 <code>Split In Batches</code> 節點搭配 Gmail 節點。建議每批發送 10-20 封，並在中間加入 <code>Wait</code> 節點（等待 2-3 秒），避免觸發 Gmail 的垃圾郵件偵測機制。"
  },
  {
    "category": "功能使用",
    "question": "支援發送附件嗎？",
    "answer": "支援！Gmail 節點的 <strong>Attachments</strong> 欄位可以接收：<br><br>✅ Google Drive 檔案連結<br>✅ n8n 內部 binary data<br>✅ 外部 URL（會自動下載）<br><br>實測單封郵件最多支援 25MB 附件。"
  },
  {
    "category": "錯誤排除",
    "question": "發送郵件後顯示「Invalid email address」？",
    "answer": "常見原因：<br><br>❌ 收件者欄位包含空值<br>❌ Email 格式不正確（缺少 @ 或 domain）<br>❌ 使用了中文全形符號<br><br>建議在 Gmail 節點前加入 <code>IF</code> 節點驗證 email 格式，使用正則表達式：<code>/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/</code>"
  }
]
{% endfaq %}
```

---

## 更新記錄

- **2025-11-20**：初版發布
  - 支援基本 FAQ 和分類 FAQ
  - 加入動畫效果和 Hover 互動
  - 支援手機版 RWD
  - 支援深色/淺色主題自動切換
