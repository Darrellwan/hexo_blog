---
title: AI 寫 n8n Workflow 誰最強？GPT-4o, Claude, Gemini 實測
date: 2025-11-20 19:10:00
tags: [n8n, AI, Automation, LLM, Workflow]
categories: [Tools]
page_type: post
id: ai-models-n8n-workflow-comparison
description: 實測比較各大 AI 模型 (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro) 在生成 n8n workflow JSON 碼的表現，分析其準確度、邏輯連貫性與實用性。
---

# 大綱：AI 模型產生 n8n Workflow JSON 比較

這篇文章將探討並比較目前主流的 AI 模型在生成 n8n 自動化流程 JSON 代碼方面的表現。

## 1. 前言 (Introduction)
- **背景**：n8n 是一個強大的 workflow automation 工具，但對於新手來說，從頭建立複雜的 workflow 有一定門檻。
- **動機**：利用 LLM (Large Language Models) 直接將自然語言需求轉換為 n8n 可匯入的 JSON code，可以大幅縮短開發時間。
- **目標**：測試並找出最適合此任務的模型。

## 2. 參賽選手 (The Models)
- **GPT-4o (OpenAI)**：目前的標竿模型，通用性強。
- **Claude 3.5 Sonnet (Anthropic)**：以強大的 coding 能力和邏輯推理著稱。
- **Gemini 1.5 Pro (Google)**：擁有超長 Context Window，對於理解大型文件或複雜結構可能有優勢。

## 3. 測試方法 (Methodology)
- **Prompt 設計**：
    - 使用統一的 System Prompt，提供 n8n JSON schema 的基本結構或範例。
    - 使用相同的 User Prompt 描述需求。
- **測試案例 (Test Cases)**：
    1.  **簡單任務 (Simple)**：Webhook 接收資料 -> 寫入 Google Sheets。
    2.  **中等任務 (Medium)**：Webhook -> Filter (過濾條件) -> HTTP Request (API 呼叫) -> Slack 通知。
    3.  **複雜任務 (Complex)**：包含 Merge Node, Switch/If 邏輯判斷, 以及 Function/Code Node (JavaScript) 的處理。

## 4. 評測標準 (Evaluation Criteria)
- **JSON 有效性 (Validity)**：生成的 JSON 是否能直接貼入 n8n 且不報錯？
- **節點配置 (Node Configuration)**：參數 (Parameters) 是否正確？(例如 HTTP Method, URL, Authentication 佔位符)。
- **連接邏輯 (Connections)**：節點之間的連線 (Connections) 是否正確？主線與副線 (Main/Alternative) 是否接對？
- **幻覺 (Hallucinations)**：是否創造了不存在的節點類型或參數？

## 5. 進階評測：魔鬼藏在細節裡 (Advanced Evaluation)
- **n8n 表達式 (Expressions)**：模型是否知道何時該用 `{{ $json["id"] }}`，何時該用純文字？
- **除錯能力 (Debugging)**：當 Workflow 報錯時，誰能最快修好？
- **新舊語法 (Legacy vs Modern)**：模型是否還在用舊版 Code Node 語法？
- **安全性 (Security)**：是否會傻傻地把 API Key 寫死在 JSON 裡？

## 6. 實測結果分析 (Results & Analysis)
- **GPT-4o 表現**：
    - 優點：...
    - 缺點：...
- **Claude 3.5 Sonnet 表現**：
    - 優點：...
    - 缺點：...
- **Gemini 1.5 Pro 表現**：
    - 優點：...
    - 缺點：...

## 6. 實戰建議與總結 (Conclusion & Recommendations)
- **綜合排名**：哪個模型是目前的冠軍？
- **最佳實踐**：如何優化 Prompt 以獲得更好的結果？
- **未來展望**：n8n 官方 AI 功能與外部 LLM 的搭配使用。
