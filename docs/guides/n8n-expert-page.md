# n8n Expert 頁面設計參考

> 當需要優化 `/source/n8n-expert/` 頁面時，參考此文件

## 頁面資訊
- **位置**：`/source/n8n-expert/index.html`
- **用途**：n8n 自動化專家服務介紹、合作洽詢表單
- **OG Image**：`/source/n8n-expert/images/og-image.webp`

## 設計方向建議

### 可參考 /links/ 的設計系統
若要統一風格，可沿用 `/links/` 的極簡工業風：

| 元素 | 設定 |
|------|------|
| 背景 | `#111111` + 網格線 |
| 字體 | JetBrains Mono + Noto Sans TC |
| 配色 | 黑白灰 + 橙色 `#ff6d5a` |
| 卡片 | 水平排列、灰階→彩色 hover |
| Hover | 偏移 + 實體陰影 |

### 頁面結構建議
1. Hero 區塊（標題 + 簡介）
2. 服務項目（專案建置 / 技術諮詢 / 企業內訓）
3. 案例/成果展示
4. 合作洽詢表單
5. FAQ

## 無障礙性必備
- `prefers-reduced-motion` 支援
- `focus-visible` 樣式
- 最小字體 12px
- 觸控目標 48x48px

## 相關檔案
- Mockup 參考：`/source/links/mockup-b-dark.html`
- 表單 Webhook：`https://darrellinfo-n8n.hnd1.zeabur.app/webhook/darrell-n8n-expert-form`
- Turnstile 驗證：已設定
