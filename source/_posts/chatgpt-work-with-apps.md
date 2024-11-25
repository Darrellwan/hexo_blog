---
title: ChatGPT 新功能 - Work with Apps 一起運作
tags:
  - ChatGPT
  - AI
categories:
  - ChatGPT
page_type: post
id: chatgpt-work-with-apps
description: Work with Apps 一起運作，讓 ChatGPT 開始讀取 VSCode 的程式碼並且透過終端機來自動執行測試
bgImage: chatgpt_work_with_apps_bg.png
preload:
  - chatgpt_work_with_apps_bg.png
date: 2024-11-25 15:07:13
---
{% darrellImageCover chatgpt_work_with_apps_bg chatgpt_work_with_apps_bg.png max-800 %}

## 在 MacOS 讓 ChatGPT 和其他 App 一起運作

在 2024/11 測試的當下，目前這個功能只有在 Plus 和 Enterprise 版本才能使用，
並且只有 MacOS 才有支援

對開發者來說最棒的是現在 chatGPT 可以讀到 VSCode 裡面選取的程式碼了，
再也不用複製貼上，但必須說和 CursorAI 相比還是有一段差距，
畢竟 CursorAI 是有能力讀取整個專案或是多個程式碼文件來給建議或協作的。

## 目前支援的 Apps

{% darrellImage chatgpt_work_with_apps_support_apps chatgpt_work_with_apps_support_apps.png max-400 %}

- VSCode
- Terminal
- iTerm
- 文字編輯工具
- XCode

只有 VSCode 和 iTerm 不是 MacOS 原生 App，但也可以看出這兩個 Apps 對開發者來說有多麽重要

{% darrellImage chatgpt_work_with_apps_support_apps_icon chatgpt_work_with_apps_support_apps_icon.png max-800 %} 

## 啟用步驟

{% darrellImage chatgpt_work_with_apps_support_apps_steps_of_enable chatgpt_work_with_apps_support_apps_steps_of_enable.png max-400 %}

啟用步驟也蠻簡單，只要點擊啟用後就可以了
目前測試起來，啟用後就可以回到 ChatGPT 的 App ��透過 Prompt 使用這些功能

## 跨越 APP 的操作

這次示範的情境是，
原本有一隻 Python 程式碼之前已經透過 ChatGPT 幫忙產生

該程式碼就是簡單的計算機功能，但多一些有趣的互動情境

### 請 ChatGPT 測試程式碼

{% darrellImage python_calculator_example python_calculator_example.png max-400 %}

通常我們寫完程式後，都會自己執行看看是否正確執行
那現在 ChatGPT 可以調用終端機後
就可以直接請 ChatGPT 幫忙測試看看
並且包含多種的情境來測試

```
1.加法 (5 + 3)：
- 結果：8
- 小吐槽：看起來很簡單的計算啊～

2.減法 (10 - 20)：
- 結果：-10
- 小吐槽：減掉壓力，也減掉煩惱！

3.乘法 (-4 * 5)：
- 結果：-20
- 小吐槽：乘法讓人感覺很有力量！

4.除法 (50 / 10)：
- 結果：5.0
- 小吐槽：小心別掉進無限循環的深淵哦～

5.除法 (10 / 0)：
- 結果：錯誤處理正常
- 提示：喂喂喂，除以零是要毀滅宇宙嗎？

6.加法 (大數字加法 1e10 + 1e10)：
- 結果：20000000000.0
- 小吐槽：看起來很簡單的計算啊～

7.乘法 (0 * 100)：
- 結果：0
- 小吐槽：乘法讓人感覺很有力量！

8.減法 (-5 - (-10))：
- 結果：5
- 小吐槽：減掉壓力，也減掉煩惱！
```

### VSCode 的限制

雖然 ChatGPT 可以查看 VSCode 的程式碼，但還無法直接修改 VSCode 的程式碼
不確定是否 Prompt 寫法有問題，還是現階段就是個限制

### 未來的想像

可以預見未來 ChatGPT 可以調用更多不同的 APP
現在能使用 Terminal 終端機，其實應該就有很多可能
只是現階段還沒測試出來，或是想像力還不到
本篇文章會密切注意社群的討論或更新

