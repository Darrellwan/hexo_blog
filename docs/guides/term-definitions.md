# Term Tooltip 常用定義庫

> 寫作時使用 `{% term def="定義" %}名詞{% endterm %}` 標籤的參考資料

---

## 通用技術名詞

| 專有名詞 | 定義 |
|---------|------|
| API | Application Programming Interface，讓不同軟體之間溝通的介面 |
| JSON | JavaScript Object Notation，輕量化的資料交換格式，常用於 API 傳輸 |
| Webhook | 一種讓外部服務主動通知你的機制，當事件發生時自動呼叫指定網址 |
| timeout | 當程式執行超過預設時間上限時自動停止的機制 |
| rate limit | API 服務限制單位時間內的請求次數，防止濫用和過載 |
| endpoint | API 的存取網址，通常代表一個特定功能或資源 |
| payload | 傳送給 API 的資料內容，通常是 JSON 格式 |
| callback | 當某個事件完成後，系統自動呼叫的函式或網址 |

---

## n8n 專用名詞

| 專有名詞 | 定義 |
|---------|------|
| Credentials | n8n 用來儲存各種服務帳號資訊（如 API Key）的安全機制 |
| Switch Node | n8n 條件判斷節點，根據不同條件執行不同的分支路徑 |
| Execute Workflow | n8n 節點，用於從主工作流呼叫其他獨立的子工作流 |
| Expression | n8n 中用來動態取得資料的語法，以 {{ }} 包裹 |
| Pinned Data | n8n 的測試功能，固定節點輸出資料，方便重複測試後續節點 |
| Execution | n8n 工作流的一次完整執行，包含所有節點的輸入輸出紀錄 |

---

## AI 相關名詞

| 專有名詞 | 定義 |
|---------|------|
| tokens | AI 計費單位，大約 1 個中文字 = 2-3 tokens |
| Context Window | AI 模型能同時處理的文字量上限，超過會遺忘較早的內容 |
| Streaming | 串流輸出，AI 邊生成邊回傳結果，不用等全部完成 |
| prompt | 給 AI 的指令或提示詞，用來引導 AI 產生特定回應 |
| hallucination | AI 編造不存在的資訊，看起來很像真的但其實是錯的 |
| fine-tuning | 用特定資料集調整 AI 模型，讓它更擅長特定任務 |
| embedding | 把文字轉換成數字向量的技術，用於語意搜尋和比對 |

---

## 使用範例

```markdown
# 正確用法
使用 {% term def="API 服務限制單位時間內的請求次數" %}rate limit{% endterm %} 來保護服務。

# 錯誤用法（重複說明）
使用 {% term def="API 服務限制單位時間內的請求次數" %}rate limit{% endterm %}（API 限流）來保護服務。
```

---

## 新增定義注意事項

1. **定義要簡潔**：控制在 30 字以內，太長會影響閱讀體驗
2. **用白話解釋**：避免用專業術語解釋專業術語
3. **針對目標讀者**：這個部落格的讀者主要是行銷人和自動化初學者
4. **可加上例子**：如「大約 1 個中文字 = 2-3 tokens」
