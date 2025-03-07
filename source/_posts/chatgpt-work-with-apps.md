---
title: ChatGPT 新功能 - Work with Apps 一起運作
tags:
  - ChatGPT
  - AI
categories:
  - ChatGPT
page_type: post
id: chatgpt-work-with-apps
description: Work with Apps 一起運作，讓 ChatGPT 開始讀取 VSCode 的程式碼並且透過終端機來自動執行測試，更新 ChatGPT 可以直接編輯 VSCode, Cursor 的程式碼
bgImage: chatgpt_work_with_apps_bg.png
preload:
  - chatgpt_work_with_apps_bg.png
modified: 2025-03-07 10:25:08
date: 2024-11-25 15:07:13
---
{% darrellImageCover chatgpt_work_with_apps_bg chatgpt_work_with_apps_bg.png max-800 %}

## 2025/03/07 更新

### 直接編輯 VSCode, Cursor 的程式碼

OpenAI 在最近更新了消息
**ChatGPT for macOS can now edit code directly in IDEs**

代表 ChatGPT 終於不是只能讀取 IDE 的程式碼了，現在還能實現直接編輯的效果

#### 安裝與更新

安裝如下方文章提到，但如果是先前安裝過的人
要檢查看看自己的 VSCode 套件是否有更新喔
最新版本的檢查方式:

{% darrellImage check_vscode_extension_version check_vscode_extension_version.png max-800 %}

#### 運作效果

實際運作效果不錯，就是真的省略了複製程式碼過去的步驟
尤其當你的程式碼是比較長
他會分段修改時，以前得一段一段複製
現在他直接幫你處理好!

{% darrellImage work_with_cursor_edit_code work_with_cursor_edit_code.png max-800 %}

#### 缺點

無法看到其他程式碼，還是只能處理 Cursor 當下開啟的程式碼檔案
不像在 Cursor 能直接透過 Agent 或 Edit 來處理整個專案裡面的多隻程式碼


## 在 MacOS 讓 ChatGPT 和其他 App 一起運作

在 2024/11 測試的當下，目前這個功能只有在 Plus 和 Enterprise 版本才能使用，
並且只有 MacOS 才有支援

對開發者來說最棒的是現在 chatGPT 可以讀到 VSCode 裡面選取的程式碼了，
再也不用複製貼上，但必須說和 CursorAI 相比還是有一段差距，
畢竟 CursorAI 是有能力讀取整個專案或是多個程式碼文件來給建議或協作的。


## 目前支援的 Apps

### 20241126 更新
新增了下列 Apps:

<div style="max-width: 600px; overflow-x: auto;">
  <table style="width: 100%;">
    <thead>
      <tr>
        <th style="width: 30%;">類別</th>
        <th>應用程式</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>VS Code Forks</strong></td>
        <td>
          <ul style="margin: 0; padding-left: 20px;">
            <li>VS Code Insiders</li>
            <li>VS Codium</li>
            <li>Cursor</li>
            <li>Windsurf</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><strong>JetBrains IDEs</strong></td>
        <td>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Android Studio</li>
            <li>IntelliJ</li>
            <li>PyCharm</li>
            <li>WebStorm</li>
            <li>PHPStorm</li>
            <li>CLion</li>
            <li>Rider</li>
            <li>RubyMine</li>
            <li>AppCode</li>
            <li>GoLand</li>
            <li>DataGrip</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><strong>其他應用程式</strong></td>
        <td>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Panic’s Nova (編輯器)</li>
            <li>Prompt (終端機)</li>
            <li>TextMate</li>
            <li>BBEdit</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

{% darrellImage chatgpt_work_with_apps_support_apps_1128 chatgpt_work_with_apps_support_apps_1128.png max-400 %}

- VSCode
- Terminal
- iTerm
- 文字編輯工具
- XCode

更新過後涵蓋了大量的開發者 APP
像是 APP 工程師要是同時在 Mac 開發 iOS 和 Android 
就能共同使用 ChatGPT 來協助

{% darrellImage chatgpt_work_with_apps_support_apps_icon chatgpt_work_with_apps_support_apps_icon.png max-800 %} 

## 啟用步驟

### VSCode & Cursor 要安裝擴充套件

請先到這個頁面下載擴充套件

[How to install the Work with Apps Visual Studio Code extension](https://help.openai.com/en/articles/10128592-how-to-install-the-work-with-apps-visual-studio-code-extension)

Cursor 也是 VSCode Based 的 App，所以安裝同一個擴充套件就好

#### 步驟1 : Command + Shift + P 開啟控制列
貼上 `Extensions: Install from VSIX…` 並選擇

{% darrellImage install_vscode_extension_step1 install_vscode_extension_step1.png max-800 %}

#### 步驟2 : 選擇下載的 vsix 檔案
安裝完成後就可以正常在 ChatGPT 啟用了

{% darrellImage install_vscode_extension_step2 install_vscode_extension_step2.png max-800 %}

### 一般啟用步驟:

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

### 請 ChatGPT 解釋程式碼(影片)

在 Cursor 選取需要 ChatGPT 幫忙的程式碼
並且使用快捷鍵
`option + shift + 1`
chatGPT 的對話視窗就會從下方彈出了!

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1034097665?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="GoogleTagManager export json file"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

### VSCode 的限制

雖然 ChatGPT 可以查看 VSCode 的程式碼，但還無法直接修改 VSCode 的程式碼
不確定是否 Prompt 寫法有問題，還是現階段就是個限制

### 未來的想像

可以預見未來 ChatGPT 可以調用更多不同的 APP
現在能使用 Terminal 終端機，其實應該就有很多可能
只是現階段還沒測試出來，或是想像力還不到
本篇文章會密切注意社群的討論或更新

