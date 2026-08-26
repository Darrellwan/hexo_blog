---
title: ChatGPT Work vs Codex 完整比較：差在哪？可以只用 Codex 嗎？
pubDatetime: 2026-07-13T10:35:42+08:00
modDatetime: 2026-07-17T11:09:45+08:00
description: 新版 ChatGPT 將 Quick Chat、ChatGPT Work 與 Codex 放進同一套介面。本文用官方定位與本機、網頁版實測，比較三種模式的用途、指令執行位置、網路能力、使用額度與選擇方式。
tags:
  - ChatGPT
  - Codex
  - OpenAI
  - AI Agent
categories:
  - AI 工具
page_type: post
id: chatgpt-work-vs-codex
slug: chatgpt-work-vs-codex
bgImage: chatgpt-work-sidebar.png
ogImage: chatgpt-work-sidebar.png
draft: true
---

{% darrellImageCover chatgpt-work-vs-codex-cover chatgpt-work-sidebar.png max-800 %}

{% quickNav %}
[
  {
    "text": "三個模式怎麼分",
    "anchor": "three-modes",
    "desc": "快速問答、知識工作與技術執行"
  },
  {
    "text": "Work 和 Codex 差在哪",
    "anchor": "work-vs-codex",
    "desc": "任務、技術資訊、裝置與成品"
  },
  {
    "text": "指令到底跑在哪裡",
    "anchor": "execution-location",
    "desc": "本機、遠端與沙盒權限"
  },
  {
    "text": "可以全部用 Codex 嗎",
    "anchor": "codex-only",
    "desc": "適合直接留在 Codex 的情境"
  },
  {
    "text": "三個實際案例",
    "anchor": "three-workflows",
    "desc": "研究、簡報與網站除錯提示詞"
  },
  {
    "text": "使用額度",
    "anchor": "usage-pool",
    "desc": "Work 與 Codex 是否共用額度"
  },
  {
    "text": "10 秒選擇流程",
    "anchor": "decision-flow",
    "desc": "用三個問題快速選模式"
  },
  {
    "text": "常見問題",
    "anchor": "faq",
    "desc": "裝置、模型與使用方式"
  }
]
{% endquickNav %}

<h2 id="why-two-modes">新版 ChatGPT 為什麼突然出現兩個工作模式？</h2>

新版桌面版把 ChatGPT Work 與 Codex 合併在同一個 App 中
其實使用上真的差不多！
但對於很多人原本對於 Codex 有一個懼怕心態
現在看到 ChatGPT Work 就更願意嘗試了，因為光看名字就很像原本的 ChatGPT
其實功能和能做到的事情都升級了不少

Work 與 Codex 都有 New Task、Scheduled、Plugins、Sites、Chat、Projects 與 Tasks
而 Codex 側邊欄多了一個 Pull Request 入口

{% darrellImage800Alt "ChatGPT Work 桌面版側邊欄，顯示 New Task、Scheduled、Plugins、Sites、Chat、Projects 與 Tasks" chatgpt-work-sidebar.png max-800 %}

{% darrellImage800Alt "Codex 桌面版側邊欄，比 Work 多顯示 Pull Request 入口" codex-sidebar.png max-800 %}

<h2 id="three-modes">先搞懂三個入口，不只是 Work 與 Codex</h2>

OpenAI 其實把使用方式分成 **Chat、Work 與 Codex**
桌面版側邊欄把快速對話入口稱為 Quick chat

{% dataTable style="minimal" align="left" highlight="2" %}
[
  {
    "模式": "Quick Chat",
    "適合與典型產出": "提問、搜尋、腦力激盪，或是一般簡易問題詢問",
    "平台與限制": "一般 ChatGPT 對話，可以解釋或產生少量 code，但不會直接操作本機專案"
  },
  {
    "模式": "ChatGPT Work",
    "適合與典型產出": "研究、分析與辦公型工作，產出文件、試算表、簡報、報告或簡單網頁",
    "平台與限制": "桌面 App 可開啟本機專案或資料夾；網頁與手機版 Work 跑在雲端"
  },
  {
    "模式": "Codex",
    "適合與典型產出": "軟體開發與專案維護，產出程式碼變更、測試、除錯與 review 結果",
    "平台與限制": "Codex 模式在桌面 App 使用本機專案；手機只能從 Remote 接續支援的桌面任務"
  }
]
{% enddataTable %}

<h2 id="work-vs-codex">ChatGPT Work 和 Codex 到底差在哪？</h2>

<h3 id="difference-task">1. 任務方向不同</h3>

Work 的官方定位是較長的研究與知識工作，例如整理資料、分析內容、製作文件與簡報
Codex 則是軟體與技術任務，例如程式碼、修錯誤、執行測試

兩邊都能處理文字、檔案與多步驟工作，差別比較像：Work 要交付什麼成品，Codex 關心專案如何被修改與驗證。

<h3 id="difference-development">2. 程式碼儲存庫、Git、測試與 Pull Request 的重心不同</h3>

當任務需要在程式碼儲存庫裡跨檔修改、查看 Git diff、跑測試或 {% term def="把程式碼變更送出審查與合併的流程" %}Pull Request{% endterm %}，Codex 的工作方式更直接。
Work 可以碰本機檔案，但不等於它就是另一個 Codex。Pull Request 是介面上最明顯的差異，底下還有 repository、Git、終端機與測試流程的重心不同

<h2 id="execution-location">指令到底跑在哪裡？本機與遠端不能只看模式名稱</h2>

這次最容易誤判的地方，就是看到 Work 或 Codex 執行了 `pwd`、`git`、`curl`，便以為它一定在自己的電腦上執行
實際上，同樣是 ChatGPT，桌面 App 與網頁版分別在不同地方執行。

{% darrellImage800Alt "ChatGPT Work 網頁版與 ChatGPT App 桌面版的指令執行位置比較，網頁版使用遠端 Linux 環境，桌面版可在本機 Mac 執行" work-web-vs-desktop-runtime-infographic.png max-800 %}

用生活化的方式理解，本機執行就像 AI 在你家書房工作。檔案與工具都在同一間屋子，但{% term def="幫 AI 圈出一個安全活動範圍的保護機制，限制它能碰哪些檔案、能連哪些網路" %}沙盒{% endterm %}與授權決定它拿到哪些房間的鑰匙。遠端執行則像把指定資料送到外面的工作室，它能在那裡下指令，卻不會因此自動看到你家裡的東西。

{% darrellImage800Alt "本機與遠端執行環境的生活化比喻，本機像在自己家工作並受到房間鑰匙限制，遠端則像把資料送到外面的工作室" local-vs-remote-workspace-explained.png max-800 %}

<h3 id="local-runtime">桌面 App 實測：Work 與 Codex 都能在本機 Mac 執行</h3>

我在同一台 Mac 上分別測試已連結本機資料夾的 Work、同一個專案中的 Codex，以及全新未連結任務。五輪結果都回傳 macOS、本機路徑與相同的工具環境，也能看到本機 Git 狀態並連到外部網路。

這只能證明**目前這台電腦、帳號與 Full access 設定下的實際行為**。如果改成較低權限、企業政策或其他入口，結果可能不同。Full access 也不是另一種虛擬機，它會讓本機指令在沒有沙盒限制的情況下執行，移除檔案與網路邊界。

<h3 id="web-runtime">網頁版實測：ChatGPT Work 在遠端 Linux 環境執行</h3>

再到 ChatGPT 網頁版的 Work 執行同一組環境指紋。結果顯示工作目錄是 `/workspace/scratch/...`、作業系統是 Linux，而且看不到本機專案的 Git 與測試標記。指令是由網頁送到遠端執行環境，不是在 Chrome 裡神奇地執行，更沒有直接跑在我的 Mac。

{% darrellImage800Alt "ChatGPT Work 網頁版執行環境指紋，顯示 workspace scratch 路徑、Linux 作業系統且不是本機 Git 專案" chatgpt-work-web-runtime-command.png max-800 %}

這個遠端環境也不等於完全不能連網。這次測試中，`example.com`、GitHub API、npm registry、PyPI、Google 與 OpenAI API 都有收到 HTTP 回應。OpenAI API 回傳 `401`，意思是請求確實抵達服務，但沒有提供有效憑證。輸出中的 `remote_ip=127.0.0.1` 則比較像遠端環境內的網路代理位址，不代表這些外部網站都在本機。

{% dataTable style="minimal" align="left" %}
[
  {
    "測試網域": "example.com",
    "HTTP 狀態": "200",
    "結果": "連線成功"
  },
  {
    "測試網域": "api.github.com",
    "HTTP 狀態": "200",
    "結果": "連線成功"
  },
  {
    "測試網域": "registry.npmjs.org",
    "HTTP 狀態": "200",
    "結果": "連線成功"
  },
  {
    "測試網域": "pypi.org",
    "HTTP 狀態": "200",
    "結果": "連線成功"
  },
  {
    "測試網域": "google.com/generate_204",
    "HTTP 狀態": "204",
    "結果": "連線成功，沒有回應內容"
  },
  {
    "測試網域": "api.openai.com/v1/models",
    "HTTP 狀態": "401",
    "結果": "已連到服務，但沒有 API 憑證"
  }
]
{% enddataTable %}

{% callout warning %}
這些結果是本次帳號與任務的實測，不代表所有方案、公司政策或未來版本都會開放相同網路範圍。需要連特定服務時，仍要直接測試目標網域。
{% endcallout %}

<h3 id="verify-runtime">不要相信介面名稱，用三個指紋確認</h3>

最省時間的做法不是猜產品名稱，而是依序檢查工作目錄、作業系統與本機專案標記。看到 macOS 和自己的專案路徑，才比較像本機執行；看到 Linux、`/workspace/scratch/`，而且找不到本機標記，就應視為遠端環境。

{% darrellImage800Alt "用工作目錄、作業系統與本機專案標記判斷 AI 指令在本機或遠端執行" execution-environment-verification.png max-800 %}

<h2 id="why-split">為什麼 OpenAI 要把它們切成兩個模式？</h2>

官方說法很直接：Chat 處理問題與快速對話，Work 處理較長的研究與素材製作，Codex 處理軟體與技術工作。切開後，介面可以依任務顯示不同資訊，也能讓使用者從想要的結果開始，而不是先理解每個工具。

以下是我的推測，不是 OpenAI 官方說法：Work 很可能是把 agentic 執行能力帶給知識工作者，但不把程式碼儲存庫、Git 與終端機放在畫面中心。這也解釋了為什麼兩者看起來像同一套工作台，卻為不同成品保留獨立入口。

<h2 id="codex-only">可以全部直接使用 Codex 嗎？</h2>

**可以，但不一定最省事。** 如果我的工作涉及本機專案、程式碼、Git、終端機、跨檔修改或測試驗證，我會直接把 Codex 當預設。它也能寫文章、做研究，只是介面會保留較多技術執行資訊。

適合直接留在 Codex 的情境包括：

- 要修改或理解一個本機專案
- 要讓結果經過指令、測試或 Git diff 驗證
- 研究素材與程式碼放在同一個儲存庫
- 希望清楚看到 AI 執行了哪些步驟

不適合硬把所有事都塞進 Codex 的情境包括：

- 只問一個用完就丟的簡單問題，Quick Chat 更快
- 要在網頁／手機進行雲端 Work，之後繼續整理研究內容
- 最終交付是簡報、試算表、報告或 Site，而且不需要程式碼儲存庫流程

所以我不會把選擇理解成「學會 Codex 就能刪掉 Work」。比較實用的做法是：技術與本機執行預設用 Codex，拋棄式問答用 Quick Chat，辦公型成品與支援的雲端工作則保留 Work。

<h2 id="three-workflows">三個真實使用案例</h2>

<h3 id="workflow-research">案例一：快速比較兩個概念</h3>

**想要的結果：** 幾分鐘內理解兩個概念的差異，順便得到下一步提問方向。這種一次性解釋、翻譯、比較或腦力激盪先用 Quick Chat，因為不需要建立完整工作區。

可重用提示詞：「請用台灣繁體中文比較＿＿＿與＿＿＿，先給一句話結論，再列三個差異、各一個具體例子，以及三個後續問題。把事實與推論分開。」

如果研究開始累積多份來源、需要反覆整理成報告，就切到 Work；若資料都在本機程式碼儲存庫，則改用 Codex。

<h3 id="workflow-deck">案例二：把訪談資料做成簡報</h3>

**想要的結果：** 從逐字稿整理出受眾洞察、故事線與簡報初稿。這類成品導向工作適合 Work，因為官方就把研究、文件與簡報列為核心用途。

可重用提示詞：「讀取這三份訪談，先列出共同痛點與相反證據，再產出十頁簡報大綱。每頁包含一句標題、一個證據與講者備註，不要補猜受訪者沒說的內容。」

網頁／手機版 Work 不能直接讀電腦檔案，先確認素材是否已上傳；若要用本機自動化腳本產出簡報檔，切到 Codex 會比較順。

<h3 id="workflow-debug">案例三：修復網站錯誤並驗證</h3>

**想要的結果：** 找出錯誤來源、修改程式碼、跑測試並檢查頁面。這是 Codex 的主場，因為任務同時需要 repo、終端機與驗證紀錄。

可重用提示詞：「先讀專案指示、檢查本機檔案並重現錯誤。必要時查官方文件，找出最小原因後只修改相關檔案。完成後跑測試，列出 Git diff、精確檔案路徑與仍未驗證的風險。」

如果只是想了解錯誤訊息的意思，可以先用 Quick Chat；但一旦要動本機專案，就回到 Codex。

<h2 id="usage-pool">使用額度是否分開？</h2>

不分開計算成兩個獨立池。OpenAI 官方說明目前明確寫出：Codex、ChatGPT Work、ChatGPT for Excel 與 Workspace Agents，在方案可使用這些功能時，會共用同一個 agentic 使用量與 credits（點數）池。

這代表切到 Work 不會多拿一份獨立額度，反過來也一樣。實際可做多少任務仍會受到方案、任務複雜度與執行時間影響。官方文件沒有說 Quick Chat 免費或無限制，所以不要把它當成規避額度的方式；簡單對話也不必在沒有理由時升級成 agentic 任務。

<h2 id="decision-flow">最後給一個 10 秒選擇流程</h2>

只是想得到回答？
→ **Quick Chat**

要完成研究、簡報、報告或試算表？
→ **ChatGPT Work**

要操作本機檔案、專案、Git、終端機或測試？
→ **Codex**

{% darrellImage800Alt "Quick Chat、ChatGPT Work 與 Codex 的 10 秒模式選擇流程" chatgpt-mode-decision-flow.png max-800 %}

遇到邊界案例時，不用糾結哪個模式理論上比較強。先看最後交付物，再確認任務實際跑在本機或遠端，以及是否需要技術驗證，就能選到阻力最小的入口。

<h2 id="faq">FAQ</h2>

{% faq %}
[
  {
    "question": "Codex 可以拿來寫文章嗎？",
    "answer": "可以。Codex 能研究與撰寫文字，尤其適合文章素材、圖片與驗證腳本都在本機專案裡的情境。不需要本機或技術流程時，Work 的成品導向介面可能更清楚。"
  },
  {
    "question": "Work 能不能讀取本機檔案？",
    "answer": "要看實際執行位置。這次桌面 App 的 Work 在 Full access 下能使用本機檔案與工具；網頁版 Work 則跑在遠端 Linux 環境，只看得到上傳或連接的資料。不要只靠模式名稱判斷。"
  },
  {
    "question": "Codex 能不能在手機上使用？",
    "answer": "Codex 目前不是 ChatGPT 手機版內可直接選取的模式。Codex Remote 可以從手機監看或接續桌面任務，而 OpenAI 也另有 Codex web，不能把這些入口混為一談。"
  },
  {
    "question": "Work 與 Codex 的使用額度是否分開？",
    "answer": "不分開。OpenAI 官方說明指出，Codex、ChatGPT Work、ChatGPT for Excel 與 Workspace Agents 在可用時共用同一個 agentic 使用量與點數池。"
  },
  {
    "question": "兩者是否使用相同模型？",
    "answer": "目前引用到的 OpenAI 文件沒有確認 Work 與 Codex 使用完全相同的模型、system prompt 或輸出策略。介面與工具重疊不足以證明底層完全一致。"
  },
  {
    "question": "已經習慣 Codex，還需要學 Work 嗎？",
    "answer": "不用為了功能清單硬學，但值得知道 Work 的邊界。當交付物是文件、試算表、簡報、報告或 Site，或需要使用支援的網頁／手機 Work 時，它可能比 Codex 更省步驟。"
  },
  {
    "question": "網頁版 Work 可以執行指令與連網嗎？",
    "answer": "可以，但指令是在遠端環境執行，不是直接操作你的 Mac。這次實測能連到 GitHub、npm、PyPI、Google 與 OpenAI API；其他帳號、企業政策或目標網域仍可能有不同限制。"
  }
]
{% endfaq %}

## 相關文章

{% articleCard url="/chatgpt-work-with-apps/" title="ChatGPT 新功能：Work with Apps 一起運作" previewText="想了解 ChatGPT 桌面版如何讀取與編輯其他 App，可以從這篇開始" thumbnail="https://www.darrelltw.com/chatgpt-work-with-apps/chatgpt_work_with_apps_bg.png" %}

{% articleCard url="/claude-code-new-command-line-tool/" title="Claude Code 發佈 Command Line 的新工具" previewText="如果你正在比較終端機 AI 開發工具，這篇整理 Claude Code 的安裝、指令與價格" thumbnail="https://www.darrelltw.com/claude-code-new-command-line-tool/claude_code.jpg" %}

## 參考資料

- [OpenAI：ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex)
- [OpenAI：Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-chatgpt)
- [OpenAI：Sandbox](https://learn.chatgpt.com/docs/sandboxing?surface=app)
