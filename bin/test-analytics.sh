#!/bin/bash

# 開啟除錯模式
set -x

# 創建測試數據目錄
mkdir -p data

# 模擬測試數據
test_data='{
    "30days": [
      {
        "customEvent:post_title": "Line Notify 結束服務，轉移到 Slack、Telegram、Discord",
        "sessions": "756"
      },
      {
        "customEvent:post_title": "Claude Code 發佈 Command Line 的新工具",
        "sessions": "679"
      },
      {
        "customEvent:post_title": "n8n 用 Request 發送 LINE Message API",
        "sessions": "462"
      },
      {
        "customEvent:post_title": "ChatGPT 在網頁版無法使用，沒有錯誤訊息卻都無法回答問題",
        "sessions": "217"
      },
      {
        "customEvent:post_title": "Claude Desktop MCP 應用測試心得",
        "sessions": "173"
      },
      {
        "customEvent:post_title": "ChatGPT 新功能 - Work with Apps 一起運作",
        "sessions": "171"
      },
      {
        "customEvent:post_title": "Google App Script 測試 Webhook 的串接",
        "sessions": "114"
      },
      {
        "customEvent:post_title": "n8n 串接 Slack、發送訊息、用 Slack 觸發 workflow",
        "sessions": "109"
      },
      {
        "customEvent:post_title": "Glows.ai 雲端 GPU 運算服務，輕鬆��得算力實現 AI 私有運算",
        "sessions": "83"
      },
      {
        "customEvent:post_title": "在 Cursor 中打造 MCP Server，從實作中學習 MCP",
        "sessions": "64"
      },
      {
        "customEvent:post_title": "n8n 版本更新紀錄心得",
        "sessions": "61"
      },
      {
        "customEvent:post_title": "Facebook Pixel 利用 GTM 安裝和注意事項避免重複觸發",
        "sessions": "60"
      },
      {
        "customEvent:post_title": "n8n 小撇步 - Timezone 問題如何在 Zeabur 設定",
        "sessions": "58"
      },
      {
        "customEvent:post_title": "n8n 內建參數介紹",
        "sessions": "56"
      },
      {
        "customEvent:post_title": "Google App Script 用 Gmail 發有質感美觀的信",
        "sessions": "49"
      },
      {
        "customEvent:post_title": "n8n Aggregate 和 Split Out",
        "sessions": "44"
      },
      {
        "customEvent:post_title": "Google Tag Manager - 觸發條件 點擊和連結點擊 (All Click, Link Click)",
        "sessions": "41"
      },
      {
        "customEvent:post_title": "利用 Google App Script 串接 Threads API 並且用 Looker Studio 視覺化",
        "sessions": "36"
      },
      {
        "customEvent:post_title": "Google Analytics 4 支援資料直接匯出到 Google Sheet (Google 官方釋出)",
        "sessions": "30"
      },
      {
        "customEvent:post_title": "n8n 小撇步 - Pin Data",
        "sessions": "30"
      },
      {
        "customEvent:post_title": "Claude MCP 應用測試心得 - Claude Desktop",
        "sessions": "25"
      },
      {
        "customEvent:post_title": "Google App Script 在 Google Sheet 和 ChatGPT 問答",
        "sessions": "24"
      },
      {
        "customEvent:post_title": "n8n If 和 Switch",
        "sessions": "24"
      },
      {
        "customEvent:post_title": "在 GTM 安裝 Line Tag Pixel",
        "sessions": "23"
      },
      {
        "customEvent:post_title": "Google Tag Manager - 觸發條件 自訂事件 (Custom Event)",
        "sessions": "19"
      },
      {
        "customEvent:post_title": "GA4 找到並移除不想要的 referral 網域",
        "sessions": "18"
      },
      {
        "customEvent:post_title": "Google Tag Manager - 觸發條件 元素可見度 (Element Visibility)",
        "sessions": "17"
      },
      {
        "customEvent:post_title": "GA4 更新 - 每個工作階段的瀏覽次數 和 平均單次工作階段參與時間",
        "sessions": "14"
      },
      {
        "customEvent:post_title": "GA4 電子商務的建議事件說明 & DataLayer 規格",
        "sessions": "12"
      },
      {
        "customEvent:post_title": "GA4 更新 - 使用者購物歷程 一眼看出使用者在購物過程中的流失",
        "sessions": "11"
      }
    ],
    "7days": [
      {
        "customEvent:post_title": "Claude Code 發佈 Command Line 的新工具",
        "sessions": "407"
      },
      {
        "customEvent:post_title": "Line Notify 結束服務，轉移到 Slack、Telegram、Discord",
        "sessions": "226"
      },
      {
        "customEvent:post_title": "Claude Desktop MCP 應用測試心得",
        "sessions": "173"
      },
      {
        "customEvent:post_title": "n8n 用 Request 發送 LINE Message API",
        "sessions": "127"
      },
      {
        "customEvent:post_title": "在 Cursor 中打造 MCP Server，從實作中學習 MCP",
        "sessions": "64"
      },
      {
        "customEvent:post_title": "ChatGPT 新功能 - Work with Apps 一起運作",
        "sessions": "62"
      },
      {
        "customEvent:post_title": "ChatGPT 在網頁版無法使用，沒有錯誤訊息卻都無法回答問題",
        "sessions": "56"
      },
      {
        "customEvent:post_title": "Google App Script 測試 Webhook 的串接",
        "sessions": "29"
      },
      {
        "customEvent:post_title": "n8n 版本更新紀錄心得",
        "sessions": "27"
      },
      {
        "customEvent:post_title": "Claude MCP 應用測試心得 - Claude Desktop",
        "sessions": "25"
      },
      {
        "customEvent:post_title": "n8n 串接 Slack、發送訊息、用 Slack 觸發 workflow",
        "sessions": "24"
      },
      {
        "customEvent:post_title": "Facebook Pixel 利用 GTM 安裝和注意事項避免重複觸發",
        "sessions": "20"
      },
      {
        "customEvent:post_title": "n8n 內建參數介紹",
        "sessions": "19"
      },
      {
        "customEvent:post_title": "Glows.ai 雲端 GPU 運算服務，輕鬆取得算力實現 AI 私有運算",
        "sessions": "14"
      },
      {
        "customEvent:post_title": "利用 Google App Script 串接 Threads API 並且用 Looker Studio 視覺化",
        "sessions": "14"
      },
      {
        "customEvent:post_title": "n8n Aggregate 和 Split Out",
        "sessions": "13"
      },
      {
        "customEvent:post_title": "n8n 小撇步 - Timezone 問題如何在 Zeabur 設定",
        "sessions": "12"
      },
      {
        "customEvent:post_title": "Google Tag Manager - 觸發條件 點擊和連結點擊 (All Click, Link Click)",
        "sessions": "9"
      },
      {
        "customEvent:post_title": "Google App Script 在 Google Sheet 和 ChatGPT 問答",
        "sessions": "8"
      },
      {
        "customEvent:post_title": "Google Analytics 4 支援資料直接匯出到 Google Sheet (Google 官方釋出)",
        "sessions": "7"
      },
      {
        "customEvent:post_title": "Google App Script 用 Gmail 發有質感美觀的信",
        "sessions": "6"
      },
      {
        "customEvent:post_title": "在 GTM 安裝 Line Tag Pixel",
        "sessions": "6"
      },
      {
        "customEvent:post_title": "GA4 更新 - 使用者購物歷程 一眼看出使用者在購物過程中的流失",
        "sessions": "5"
      },
      {
        "customEvent:post_title": "Google Tag Manager - 觸發條件 元素可見度 (Element Visibility)",
        "sessions": "5"
      },
      {
        "customEvent:post_title": "n8n If 和 Switch",
        "sessions": "5"
      },
      {
        "customEvent:post_title": "GA4 更新 - 每個工作階段的瀏覽次數 和 平均單次工作階段參與時間",
        "sessions": "4"
      },
      {
        "customEvent:post_title": "GA4 電子商務的建議事件說明 & DataLayer 規格",
        "sessions": "4"
      },
      {
        "customEvent:post_title": "Google Tag Manager - 觸發條件 自訂事件 (Custom Event)",
        "sessions": "4"
      },
      {
        "customEvent:post_title": "n8n 小撇步 - Pin Data",
        "sessions": "4"
      },
      {
        "customEvent:post_title": "Chatgpt 幫你寫程式 - 實現一個類似 wappalyzer 的分析功能",
        "sessions": "3"
      }
    ]
  }'

# 驗證初始測試數據
echo "驗證初始測試數據..." >&2
if ! echo "$test_data" | jq empty 2>/dev/null; then
  echo "錯誤：初始測試數據不是有效的 JSON" >&2
  echo "$test_data" | jq empty
  exit 1
fi

# 將測試數據寫入臨時文件
echo "$test_data" > temp_data.json

# 讀取測試數據並驗證
raw_data=$(cat temp_data.json)
echo "驗證讀取的數據..." >&2
if ! echo "$raw_data" | jq empty 2>/dev/null; then
  echo "錯誤：讀取的數據不是有效的 JSON" >&2
  echo "$raw_data" | jq empty
  exit 1
fi

# 處理時期數據
process_period_data() {
  local period=$1
  echo "處理 $period 數據..." >&2
  
  # 驗證 period 數據存在
  if ! echo "$raw_data" | jq "has(\"$period\")" > /dev/null 2>&1; then
    echo "錯誤：找不到 $period 數據" >&2
    return 1
  fi
  
  local data
  data=$(echo "$raw_data" | jq --arg period "$period" '.[$period]')
  
  # 驗證數據格式
  if [ -z "$data" ] || [ "$data" = "null" ]; then
    echo "錯誤：$period 數據為空或 null" >&2
    return 1
  fi
  
  # 計算總訪問量
  local total_sessions
  total_sessions=$(echo "$data" | jq '[.[].sessions | tonumber] | add // 0')
  
  # 驗證總訪問量
  if [ -z "$total_sessions" ] || [ "$total_sessions" = "null" ]; then
    echo "錯誤：無法計算總訪問量" >&2
    return 1
  fi
  
  # 添加百分比並排序
  local processed_data
  processed_data=$(echo "$data" | jq --arg total "$total_sessions" '
    map(
      . + {
        "sessions": (.sessions | tonumber),
        "percentage": ((.sessions | tonumber) / ($total | tonumber) * 100 | round * 0.1)
      }
    ) | sort_by(-.sessions)
  ')
  
  # 驗證處理後的數據
  if ! echo "$processed_data" | jq empty 2>/dev/null; then
    echo "錯誤：處理後的數據不是有效的 JSON" >&2
    return 1
  fi
  
  echo "$processed_data"
}

# 處理兩個時期的數據
echo "開始處理 30 天數據..." >&2
processed_30days=$(process_period_data "30days")
if [ $? -ne 0 ]; then
  echo "處理 30 天數據時發生錯誤" >&2
  exit 1
fi

echo "開始處理 7 天數據..." >&2
processed_7days=$(process_period_data "7days")
if [ $? -ne 0 ]; then
  echo "處理 7 天數據時發生錯誤" >&2
  exit 1
fi

# 添加時間戳記和完整數據
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# 使用 jq 來建構最終的 JSON
echo "建構最終 JSON..." >&2
json_with_timestamp=$(jq -n \
  --arg timestamp "$timestamp" \
  --argjson data30 "$processed_30days" \
  --argjson data7 "$processed_7days" \
  '{
    data: [],
    data_30days: $data30,
    data_7days: $data7,
    last_updated: $timestamp
  }')

# 確保輸出是有效的 JSON
echo "驗證最終 JSON..." >&2
if echo "$json_with_timestamp" | jq empty 2>/dev/null; then
  echo "$json_with_timestamp" > data/analytics.json
  echo "Analytics data updated successfully" >&2
else
  echo "Error: Failed to generate valid JSON output" >&2
  echo "最終 JSON 內容：" >&2
  echo "$json_with_timestamp" >&2
  exit 1
fi

# 清理臨時文件
rm temp_data.json

# 如果有 README 生成腳本，執行它
if [ -f "scripts/generate-readme.js" ]; then
  echo "Generating README..." >&2
  node scripts/generate-readme.js
fi 