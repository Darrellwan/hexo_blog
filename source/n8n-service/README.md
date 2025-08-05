---
title: n8n 服務頁面
date: 2025-08-05
type: page
---

# n8n 服務頁面

這是一個專業的 n8n 自動化解決方案服務頁面，提供企業內訓、一對一教學和自動化建置諮詢服務。

## 🎯 功能特色

### 🎨 視覺設計
- **現代化設計**：簡潔專業的介面設計，符合 n8n 自動化主題
- **響應式佈局**：完美適配桌面、平板和手機裝置
- **品牌色彩**：採用 n8n 品牌色彩搭配專業灰階配色
- **自動化動畫**：工作流程節點動畫、數據流動效果

### 🚀 動畫效果
- **工作流程視覺化**：模擬 n8n 節點連接和數據傳遞
- **滾動觸發動畫**：內容區塊進場動畫
- **懸停互動效果**：卡片 3D 傾斜、按鈕漣漪效果
- **鼠標追蹤粒子**：桌面版鼠標軌跡特效
- **浮動粒子系統**：背景裝飾性動畫

### 📝 多步驟表單
- **三步驟設計**：基本資訊 → 需求類型 → 專案詳情
- **即時驗證**：輸入格式檢查和錯誤提示
- **進度指示**：視覺化進度條和步驟指示器
- **資料收集**：完整的客戶需求和聯絡資訊收集

### 📱 使用者體驗
- **無障礙設計**：支援螢幕閱讀器和鍵盤導航
- **效能優化**：圖片延遲載入、動畫效能優化
- **載入狀態**：表單提交載入動畫
- **成功回饋**：提交成功確認頁面

## 📁 檔案結構

```
n8n-service/
├── index.html              # 主頁面
├── assets/
│   ├── css/
│   │   ├── main.css        # 主要樣式
│   │   └── animations.css  # 動畫效果
│   ├── js/
│   │   ├── main.js         # 主要功能
│   │   └── animations.js   # 進階動畫控制
│   └── images/             # 圖片資源目錄
└── README.md               # 專案說明文件
```

## 🎯 頁面區塊

### 1. Hero Section（主視覺區）
- **品牌標題**：n8n 自動化解決方案專家
- **服務標語**：企業流程自動化 · 工作流程優化 · 數位轉型諮詢
- **動畫工作流程**：視覺化展示自動化流程
- **行動召喚按鈕**：立即諮詢、查看案例

### 2. Services Section（服務項目）
- **企業內訓**：n8n 平台教育訓練
- **一對一家教**：個人化指導教學
- **企業自動化建置**：完整解決方案（推薦服務）

### 3. Cases Section（成功案例）
- **電商訂單資料轉換拋接**
- **社群多平台發文**
- **LINE 智能客服**
- **社群數據分析**

### 4. Contact Section（聯絡表單）
- **多步驟表單設計**
- **服務選擇和需求收集**
- **預算和時程評估**

### 5. Footer（頁尾）
- **品牌資訊和連結**
- **版權聲明**

## 🛠 技術實作

### CSS 特色
- **CSS Grid & Flexbox**：現代化佈局技術
- **CSS Variables**：主題色彩管理
- **CSS Animations**：流暢的動畫效果
- **Media Queries**：響應式設計

### JavaScript 功能
- **ES6+ 語法**：現代 JavaScript 開發
- **類別模組化**：功能分離和重用
- **Intersection Observer**：滾動動畫觸發
- **表單驗證**：即時輸入驗證

### 動畫系統
- **關鍵幀動畫**：CSS @keyframes
- **JavaScript 動畫**：互動式動畫控制
- **效能優化**：requestAnimationFrame 使用
- **無障礙考量**：prefers-reduced-motion 支援

## 🚀 使用方式

### 本地開發
1. 直接用瀏覽器開啟 `index.html`
2. 或使用本地伺服器（如 Live Server）

### 部署
- 上傳所有檔案至網頁伺服器
- 確保所有資源路徑正確
- 設定 HTTPS（推薦）

## 🎨 客製化

### 修改色彩主題
在 `main.css` 中調整 CSS 變數：
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #333;
}
```

### 調整動畫效果
在 `animations.css` 中修改動畫參數：
```css
.node {
  animation-duration: 0.6s; /* 調整動畫時長 */
  animation-delay: 0.2s;     /* 調整延遲時間 */
}
```

### 表單整合
在 `main.js` 的 `sendFormData()` 方法中整合後端 API：
```javascript
async sendFormData() {
  // 整合您的後端 API
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(this.formData)
  });
}
```

## 📊 效能優化

- **圖片優化**：使用 WebP 格式和延遲載入
- **CSS 壓縮**：生產環境壓縮 CSS 檔案
- **JavaScript 優化**：使用 webpack 或 Rollup 打包
- **快取策略**：設定適當的 HTTP 快取標頭

## 🔧 瀏覽器支援

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📝 授權

© 2025 Darrell Wang. All rights reserved.

---

## 🚀 快速開始

1. 下載或 clone 此專案
2. 用瀏覽器開啟 `index.html`
3. 開始體驗完整的 n8n 服務頁面功能！

有任何問題或建議，歡迎聯絡：[您的聯絡方式]