# n8n Template Development Guide

這份指南記錄了建立 n8n 工作流程模板的最佳實踐，以及從實際錯誤中學到的重要經驗。

## 📋 Switch Node 正確結構 (Critical Reference)

**⚠️ 常見錯誤：使用錯誤的 Switch node 結構**

### ❌ 錯誤結構 (不要使用)
```json
{
  "parameters": {
    "mode": "chooseBranch",
    "options": {
      "conditions": {
        "options": { "caseSensitive": false },
        "conditions": [
          {
            "leftValue": "={{ $json.body.events[0].message.text }}",
            "rightValue": "help",
            "operator": { "type": "string", "operation": "contains" }
          }
        ]
      }
    }
  }
}
```

### ✅ 正確結構 (務必使用)
```json
{
  "parameters": {
    "rules": {
      "values": [
        {
          "conditions": {
            "options": {
              "caseSensitive": false,
              "leftValue": "",
              "typeValidation": "strict",
              "version": 1
            },
            "conditions": [
              {
                "leftValue": "={{ $json.body.events[0].message.text.toLowerCase().trim() }}",
                "rightValue": "help",
                "operator": {
                  "type": "string",
                  "operation": "contains"
                },
                "id": "help-condition"
              }
            ],
            "combinator": "and"
          }
        },
        {
          "conditions": {
            "options": {
              "caseSensitive": false,
              "leftValue": "",
              "typeValidation": "strict",
              "version": 1
            },
            "conditions": [
              {
                "leftValue": "={{ $json.body.events[0].message.text.toLowerCase().trim() }}",
                "rightValue": "menu",
                "operator": {
                  "type": "string",
                  "operation": "contains"
                },
                "id": "menu-condition"
              }
            ],
            "combinator": "and"
          }
        }
      ]
    },
    "options": {}
  },
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3
}
```

## 🔑 Switch Node 關鍵要素

1. **使用 `rules.values` 陣列結構**
   - 每個規則是陣列中的一個物件
   - 每個規則包含 `conditions` 物件

2. **條件結構要求**
   - `conditions.options`: 包含 `caseSensitive`, `typeValidation`, `version`
   - `conditions.conditions[]`: 條件陣列
   - `conditions.combinator`: 通常是 "and" 或 "or"

3. **單一條件格式**
   - `leftValue`: 要比較的值 (通常使用表達式)
   - `rightValue`: 比較目標值
   - `operator.type`: 資料類型 (如 "string")
   - `operator.operation`: 操作類型 (如 "contains", "equals")
   - `id`: 唯一識別碼

## 📱 LINE Bot 工作流程模式

### 基本架構
```
Webhook → Event Type Check → Command Router → Response Nodes
```

### 1. Webhook 設定
```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "line-bot-webhook",
    "options": {}
  },
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2
}
```

### 2. 事件類型檢查 (If Node)
```json
{
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "typeValidation": "strict",
        "version": 2
      },
      "conditions": [
        {
          "leftValue": "={{ $json.body.events[0].type }}",
          "rightValue": "message",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    }
  },
  "type": "n8n-nodes-base.if",
  "typeVersion": 2.2
}
```

### 3. 命令路由 (Switch Node)
使用上述正確的 Switch node 結構，根據訊息內容路由到不同的回應節點。

## 🎨 Flex Message 範本

### Bubble 結構 (單一卡片)
```json
{
  "type": "flex",
  "altText": "替代文字",
  "contents": {
    "type": "bubble",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "標題",
          "weight": "bold",
          "size": "xl",
          "color": "#ffffff"
        }
      ],
      "backgroundColor": "#007bff",
      "paddingAll": "md"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "內容文字",
          "wrap": true
        }
      ]
    }
  }
}
```

### Carousel 結構 (多張卡片)
```json
{
  "type": "flex",
  "altText": "選單",
  "contents": {
    "type": "carousel",
    "contents": [
      // bubble 1
      {
        "type": "bubble",
        // ... bubble 內容
      },
      // bubble 2
      {
        "type": "bubble",
        // ... bubble 內容
      }
    ]
  }
}
```

## 🔧 最佳實踐

### 文字處理
- **Case-insensitive 比對**: 使用 `toLowerCase().trim()`
- **彈性匹配**: 使用 `contains` 而非 `equals`
- **表達式範例**: `={{ $json.body.events[0].message.text.toLowerCase().trim() }}`

### 錯誤處理
1. **事件類型檢查**: 確保只處理 "message" 類型事件
2. **預設回應**: 為未匹配的命令提供友善的預設回應
3. **Fallback 路由**: Switch node 的最後一個空規則作為 fallback

### 訊息設計
1. **Accessibility**: 所有 Flex message 都要包含 `altText`
2. **一致性**: 統一的色彩配置和樣式
3. **互動性**: 適當使用按鈕和 action

## 📄 模板結構建議

### 基本 LINE Bot 模板應包含：
1. **Documentation Node**: 說明文件
2. **Webhook**: 接收 LINE 訊息
3. **Event Filter**: 篩選訊息事件
4. **Command Router**: Switch node 命令路由
5. **Response Nodes**: 各種回應類型
   - Help Response (說明)
   - Menu Response (選單)
   - Status Response (狀態)
   - Contact Response (聯絡資訊)
   - Default Response (預設回應)
6. **Push Notification**: 主動推播功能

### 擴展功能模板：
- **Database Integration**: 資料庫查詢
- **External API**: 第三方 API 整合
- **Scheduler**: 定時推播
- **Analytics**: 使用統計追蹤

## 🚨 常見錯誤與解決方案

### 1. Switch Node 結構錯誤
**症狀**: Switch node 無法正確路由
**原因**: 使用了 `mode: "chooseBranch"` 而非 `rules.values` 結構
**解決**: 參考上述正確結構重新配置

### 2. Flex Message 格式錯誤
**症狀**: LINE 收不到訊息或顯示異常
**原因**: JSON 結構不符合 LINE Flex Message 規範
**解決**: 檢查 `type`, `altText`, `contents` 是否正確

### 3. 命令匹配失敗
**症狀**: 輸入命令但沒有對應回應
**原因**: 大小寫敏感或空白字元問題
**解決**: 使用 `toLowerCase().trim()` 處理輸入

### 4. 事件處理範圍過廣
**症狀**: 非訊息事件也被處理導致錯誤
**原因**: 沒有在 Switch node 前加入事件類型檢查
**解決**: 使用 If node 先篩選 `type === "message"`

## 📚 參考資源

- [LINE Flex Message Simulator](https://developers.line.biz/flex-simulator/)
- [n8n Node Documentation](https://docs.n8n.io/integrations/builtin/)
- [LINE Messaging API Reference](https://developers.line.biz/en/reference/messaging-api/)

## 🏷️ 版本記錄

- **v1.0** (2025-06-20): 初始版本，包含 Switch node 正確結構
- 基於實際錯誤經驗建立，修正 Switch node 結構問題