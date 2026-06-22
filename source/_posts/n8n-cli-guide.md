---
title: n8n CLI 教學 - 用終端機管理 workflow，備份、批次操作、AI 整合
tags:
  - n8n
  - n8n教學
  - n8n CLI
  - 自動化
categories:
  - n8n
page_type: post
id: n8n-cli-guide
description: n8n 官方 CLI 工具（@n8n/cli）實測教學：從安裝、API key 連線設定，到 workflow 備份、execution 錯誤排查、批次停用，再用 skill install 讓 Claude Code 直接幫你管理 n8n。包含指令安全分級、npm 同名套件陷阱、--id-only 改版注意事項與目前限制整理。
bgImage: blog-n8n-cli-guide-bg.jpg
preload:
  - blog-n8n-cli-guide-bg.jpg
date: 2026-06-22 14:00:00
modified: 2026-06-22 14:00:00
---

{% darrellImageCover blog-n8n-cli-guide blog-n8n-cli-guide-bg.jpg max-800 %}

> n8n CLI（@n8n/cli）是官方 2026 年 3 月推出的終端機工具：透過 API 連到你跑著的 n8n，不用開瀏覽器就能管理 workflow、execution、credential，還能讓 Claude Code 這類 AI 工具直接幫你操作 n8n。

想像你要把十幾個確定不用的 workflow 停用。
網頁上的流程是：打開列表、點進 workflow、關掉 Active、退回列表，
重複十幾次，大概要五分鐘。

n8n 官方在 2026 年 3 月推出了 CLI 工具，同樣的事一行指令、十幾秒跑完。
這個時候推出 CLI 的原因很明顯：結合 AI

你跟 Claude Code 說「幫我把所有 archive 的 workflow 全部刪掉」，
它會自己組指令、跑完、回報結果，這在 n8n 平台上需要一筆一筆刪除！

這篇是我用了兩個多月的實測整理：

## 快速導覽

**適合對象：** 已經有一個跑著的 n8n（Cloud 或自架都算），想更有效率管理它的朋友

{% quickNav %}
[
  {"text": "n8n CLI 是什麼", "anchor": "what-is-n8n-cli", "desc": "跟 n8n 指令差在哪"},
  {"text": "安裝設定", "anchor": "setup", "desc": "5 分鐘連上你的 n8n"},
  {"text": "日常操作", "anchor": "daily-usage", "desc": "備份、查 execution、管 credential"},
  {"text": "AI 整合", "anchor": "ai-skill", "desc": "讓 Claude Code 直接幫你管 n8n"},
  {"text": "要不要導入", "anchor": "adopt-or-not", "desc": "自己學還是找人弄"}
]
{% endquickNav %}

{% callout info %}
這篇中後段都是終端機指令，比較適合至少開過終端機的讀者。
完全不碰指令的人
可以讓 AI 替你打指令，請直接跳到 [AI 整合](#ai-skill)。
{% endcallout %}

## <span id="what-is-n8n-cli">n8n CLI 是什麼？跟自架的 n8n 指令不一樣</span>

先解決一個很多人會混淆的點。

有些人可能用過 `n8n export:workflow`、`n8n import:credentials` 這類指令，
那是裝在「伺服器上」的 n8n 本體指令，要登入主機才能跑。

這篇講的 n8n CLI 是 2026 年 3 月底隨 n8n 2.14 推出的新工具，
套件名稱叫 [`@n8n/cli`](https://www.npmjs.com/package/@n8n/cli)，
[官方文件](https://docs.n8n.io/api/n8n-cli/)也有獨立的頁面。

你可以把它想成遙控器：n8n CLI 則是從任何一台電腦遙控你的 n8n，只要有 API key、連得到網路。

{% dataTable style="minimal" align="left" %}
[
  {"比較": "跑在哪", "n8n 本體指令": "n8n 所在的主機", "n8n CLI（@n8n/cli）": "任何一台電腦"},
  {"比較": "連線方式", "n8n 本體指令": "直接操作資料庫", "n8n CLI（@n8n/cli）": "透過 n8n API"},
  {"比較": "n8n Cloud 能用嗎", "n8n 本體指令": "不行", "n8n CLI（@n8n/cli）": "可以（付費方案）"},
  {"比較": "適合做什麼", "n8n 本體指令": "搬家、匯出匯入、維運", "n8n CLI（@n8n/cli）": "日常管理、批次操作、接 AI 工具"}
]
{% enddataTable %}

{% callout type="info" title="版本說明" %}
本文基於 @n8n/cli 0.7.0（目前的 latest 版）撰寫，文中所有指令都實測過。
這個工具還掛著 beta 標籤、更新蠻快的，新版指令如果長不一樣，以 <code>--help</code> 為準。
{% endcallout %}

## <span id="setup">安裝與連線設定</span>

### 前置準備

需要的東西只有兩樣：

- 一個跑著的 n8n（Cloud 付費方案或自架都可以，還沒有的話可以先看[部署方式比較這篇](/n8n-deployment/)）
- n8n 的 API key：到 n8n 的 **Settings → n8n API → Create an API key** 建立，設個名稱跟過期時間就好

{% darrellImage800Alt "n8n Settings 中建立 API key 的設定畫面" n8n_cli-api_key_setting.png max-800 %}

API key 建立後**只會完整顯示一次**，記得先複製起來。

### 安裝

不熟終端機也沒關係：Mac 開內建的「終端機」（Terminal）、Windows 開 PowerShell，
把下面的指令貼上去按 Enter 就好。

只是想試試看，可以用 npx 免安裝直接跑：

```bash
npx @n8n/cli workflow list
```

確定會常用的話，建議直接裝成全域指令：

```bash
npm install -g @n8n/cli
```

{% darrellImage800Alt "npm install -g @n8n/cli 安裝完成的終端機輸出" n8n_cli-npm_install.png max-800 %}

電腦沒有 npm 的話，代表還沒裝 {% term def="執行 JavaScript 的環境，裝好後會附帶 npm 這個安裝工具，到 nodejs.org 下載安裝包點兩下就好" %}Node.js{% endterm %}，先裝它就有了
（裝完重開一個新的終端機視窗，回來接著跑就行）。

### 連上你的 n8n

跑 `login`，它會互動式地問你 URL 跟 API key：

```bash
n8n-cli login
```

URL 就是你平常開 n8n 網頁的那個網址（Cloud 是 `https://xxxxxx.app.n8n.cloud`，
自架就是你平常開 n8n 用的網域，像 Zeabur 部署的就是它配給你的 `xxx.zeabur.app` 網址）。
設定完用 `config show` 確認有連上：

```bash
$ n8n-cli config show
URL:      https://xxxxxx.app.n8n.cloud/
API Key:  ****jgs4
```

{% darrellImage800Alt "n8n-cli login 互動式設定流程，輸入 URL 和 API key 後登入成功" n8n_cli-login.png max-800 %}

不用擔心設定很麻煩，整個流程大概 2-3 分鐘內搞定。

## <span id="daily-usage">日常操作：workflow、execution、credential</span>

### 查 workflow

```bash
$ n8n-cli workflow list --limit 3 --format table
ID                NAME                                    ACTIVE  UPDATEDAT
----------------  --------------------------------------  ------  ------------------------
05cNg6KPUeW9ebca  My workflow 27                          false   2025-06-04T02:42:27.608Z
09Lj0O0LZ5wq0OIc  Learning-LoopOverItems and accumulated  false   2025-06-17T06:07:50.406Z
03VUjcChtQNyC8CO  My workflow 138                         false   2025-12-06T04:06:47.587Z
```

{% darrellImage800Alt "n8n-cli workflow list --format table 指令輸出結果" n8n_cli-workflow_list.png max-800 %}

常用的過濾參數：

- `--active`：只看啟用中的
- `--name`：用名稱過濾
- `--tag`：用標籤過濾

輸出有三種格式：`table`、`json`、`id-only`。
有個貼心的設計：當你把輸出 pipe 給其他指令時，它會自動切成 JSON。
而且內建 `--jq` 過濾器，不用另外安裝 jq 就能直接撈欄位：

```bash
n8n-cli workflow list --jq '.[].name'
```

### 查 execution：debug 利器

這是我自己用最多的部分。
每次都要打開執行列表頁面查詢失敗的 execution
現在 AI 一下就把失敗的撈出來和幫你檢查為什麼出錯：

```bash
n8n-cli execution list --status error --limit 10
```

`--status` 可以過濾 `error`、`success`、`running`、`waiting`、`canceled`，
`--workflow` 可以鎖定特定 workflow。
找到問題那筆之後：

- `execution get <id>`：拿完整的執行細節 JSON，每個節點的輸出都在裡面
- `execution retry <id>`：把那筆失敗的執行重新跑一次（背後呼叫的是 n8n API 的 retry 端點）

對常常需要 debug 的人來說，光這功能就值得裝了。

### credential：查得到、建得了，但拿不到裡面的憑證金鑰

`credential list` 列出所有憑證，`credential create` 可以建新的。
比較特別的是 `credential schema`：

```bash
n8n-cli credential schema slackApi
```

會回傳這種 credential 需要哪些欄位的 JSON 結構。
用指令建 credential 最卡的就是不知道格式長怎樣，這個指令直接給你規格書。

{% callout type="info" %}
<code>credential get</code> 只會回傳 metadata，拿不到裡面存的 token 或密碼。
這是刻意的安全設計，不可能用 CLI 把憑證直接匯出。
{% endcallout %}

## <span id="ai-skill">AI 整合：讓 Claude Code 直接幫你管 n8n</span>

這是我覺得最有趣的部分，也是**不想學指令的人最該看的一段**。

CLI 內建 `skill install` 指令，
會幫 Claude Code、Cursor、Windsurf 裝好一份「怎麼用 n8n-cli」的操作說明（skill）：

```bash
n8n-cli skill install                  # 裝到目前專案
n8n-cli skill install --global         # 裝到全域
n8n-cli skill install --target=cursor  # 指定其他 AI 工具
```

跑完後就會在你使用的 AI 工具裡面多一份關於 `n8n-cli` 的 skill 可以用
你可能或多或少聽過 skill 或是已經用的駕輕就熟
例如我用 Claude Code，我安裝好這個 Skill 後
Claude Code 就能透過這個 Skill (說明書) 去理解 `n8n-cli` 該怎麼使用

設定完成後的日常長這樣：

我平常 debug 就是直接跟 Claude Code 說「幫我看今天哪些 execution 失敗」，
它會自己組出 `execution list --status error`、讀結果、回報哪個 workflow 出事，
連 workflow JSON 都能直接撈出來分析是哪個節點設定有問題。

{% darrellImage800Alt "Claude Code 透過 n8n CLI 查詢失敗 execution 並分析原因的實際對話畫面" n8n_cli-claude_code_debug.png max-800 %}


## 哪些指令能放心跑？

官方文件把這個工具定位在「實驗、本地開發、個人專案」。
白話翻譯是「指令語法還會變，別把它焊死在正式環境的流程裡」，
不是「用了會出事」。

其實照指令的性質分三級，就很好判斷：

{% dataTable style="minimal" align="left" highlight="1" %}
[
  {"分級": "唯讀查詢", "指令": "list、get、schema、audit、config show", "建議": "隨便跑，自己的、公司的、客戶的 n8n 都安全"},
  {"分級": "會動到資料", "指令": "create、update、delete、activate、deactivate、retry", "建議": "自己的 n8n 隨意；別人的環境先 list 確認範圍再動手"},
  {"分級": "自動化排程", "指令": "排進 cron / CI 的任何指令", "建議": "鎖定版本安裝（@0.7.0），升版人工確認過語法再換"}
]
{% enddataTable %}

## 其他功能快速參考

上面講的是日常最常碰的部分，剩下的指令用表格整理：

{% dataTable style="minimal" align="left" %}
[
  {"指令": "data-table", "功能": "管理 n8n 內建資料表，支援批次新增、更新、upsert、刪除 rows", "誰用得到": "有用 Data Table 存資料的人"},
  {"指令": "project", "功能": "建立專案、管理成員、跨 project 搬移 workflow", "誰用得到": "團隊協作的用戶"},
  {"指令": "tag", "功能": "建立、改名、刪除標籤", "誰用得到": "想整理 workflow 的人"},
  {"指令": "variable", "功能": "管理 instance 層級的變數", "誰用得到": "多環境部署的人"},
  {"指令": "user", "功能": "查使用者清單", "誰用得到": "管理員"},
  {"指令": "audit", "功能": "產出資安稽核報告，可挑 credentials、nodes 等五種類別", "誰用得到": "自架的人都該定期跑"},
  {"指令": "source-control", "功能": "從 Git 拉最新版本", "誰用得到": "有開 source control 的團隊"}
]
{% enddataTable %}

`data-table` 管的就是 [Data Table 節點](/n8n-datatables-node/)存的那些資料，
rows 的批次新增、更新、upsert 都能從終端機做。

## <span id="adopt-or-not">要學 n8n cli 還是交給 AI Agent</span>

在這個充滿 AI 的時代
如果你是個人用途，需要用 n8n 幫忙處理一些自動化
那會建議多先學會 n8n 後，再讓 AI 幫忙操控 `n8n cli` 即可

相當是你把一些無聊或是重複的 n8n 操作轉移給 AI 來幫忙
而你自已還是需要設計或是主導自動化流程的開發

但你如果是企業主或是商家
你沒有那麼多的時間跟人力來學習 n8n 
而什麼都交給 `AI Agent` 又很浪費 token 時

還是建議可以找找相關的自動化顧問來做討論
例如報表的自動化就牽涉到要串接哪些資料，是否需要整理跟清理
這些或許 AI 都做得到，但每天重複跑，又伴隨大量的資料時
用 AI 所消耗的花費就很可觀，又完全是浪費的
建立好 n8n 等相關流程後，每天的運作都可以接近 0 token 

相關服務參考 : [n8n 顧問服務](/n8n-expert/)，需要的話可以聊聊。

## <span id="limits">目前限制</span>

誠實說，它還在 beta，這些坑先知道再上：

- **指令還在變**： `--id-only` 改版就是例子，舊教學的範例可能直接報錯。文中指令都以 0.7.0 實測為準
- **沒有 archive 指令**： n8n 介面上的 workflow 封存功能，API 已經支援，CLI 還沒跟上
- **沒有 folder 操作**： 資料夾的整理還是得回網頁拖拉
- **一次只能記一組連線**： 設定檔只存一台 n8n，管多台的解法見下方

### 多台 n8n 怎麼切換

設定檔一次只能存一台，對同時管自己跟客戶 n8n 的人蠻不方便的。
目前最乾淨的解法是環境變數搭 shell alias，一鍵切換（實測過可用）：

```bash
# 放進 ~/.zshrc 或 ~/.bashrc
alias n8n-home='N8N_URL=https://home.example.com N8N_API_KEY=$N8N_KEY_HOME n8n-cli'
alias n8n-client='N8N_URL=https://client.example.com N8N_API_KEY=$N8N_KEY_CLIENT n8n-cli'
```

之後 `n8n-home workflow list` 查自己的、`n8n-client execution list --status error` 查客戶的，
互不打架，也不會動到 `login` 存的那組設定。

{% darrellImage800Alt "n8n-main 和 n8n-preview 兩個 alias 各自連到不同 instance，回傳不同的 workflow 列表" n8n_cli-multi_instance_alias.png max-800 %}

## <span id="faq">常見問題</span>

{% faq %}
[
  {
    "question": "n8n Cloud 可以用 n8n CLI 嗎？免費試用也行嗎？",
    "answer": "可以，任何付費方案都行、不分等級：到 Settings → n8n API 建立 API key 就連得上，用法跟自架完全一樣。但官方文件寫明<strong>免費試用期間不開放 API</strong>，所以試用帳號還用不了。"
  },
  {
    "question": "為什麼我裝的 n8n-cli 指令跟教學長得不一樣？",
    "answer": "很可能裝到 npm 上的第三方同名套件了。官方套件要裝 <code>@n8n/cli</code>（注意有 @n8n 前綴），裝完之後指令名稱才是 <code>n8n-cli</code>。先 <code>npm uninstall -g n8n-cli</code> 再 <code>npm install -g @n8n/cli</code> 就好。"
  },
  {
    "question": "CLI 拿得到 credential 裡面存的密碼或 token 嗎？",
    "answer": "拿不到。<code>credential get</code> 只回傳名稱、類型這些 metadata，不會吐出 secrets，這是 n8n API 本身的安全設計。反過來要注意的是：API key 本身是全權限（非 Enterprise 沒有唯讀 key），所以 key 要當密碼保管。"
  },
  {
    "question": "n8n CLI 要錢嗎？",
    "answer": "CLI 本身不用錢，跟著 n8n 主專案一起開發發布。真正的門檻是你要有一個能建立 API key 的 n8n：自架免費，Cloud 要付費方案。"
  }
]
{% endfaq %}

## 相關文章推薦

{% articleCard
  url="/n8n-deployment/"
  title="n8n 安裝部署與更新教學：Cloud、Zeabur、Docker 比較"
  previewText="還沒有自己的 n8n？先從這篇挑一個適合你的部署方式"
  thumbnail="https://www.darrelltw.com/n8n-deployment/blog-n8n-deployment-bg.jpg"
%}

{% articleCard
  url="/n8n-update-log/"
  title="n8n 版本更新紀錄心得"
  previewText="持續更新的 n8n 版本重點整理，n8n CLI 就是在 2.14 登場的"
  thumbnail="https://www.darrelltw.com/n8n-update-log/n8n-update_bg.jpg"
%}

## 總結

n8n CLI 已經用了好幾個月，讓 AI 接手大部分的 n8n 管理工作，
尤其搭配 Claude Code 之後，調整 workflow 或是測試幾乎都可以讓 AI 代勞！
我們只要確認節點的設定是否合理，是否有用最佳的方式去做 workflow 就好
畢竟 AI 還是很常會亂作一通
結果可能都是對的，但 AI 拉出來的 workflow 很多時候非常繞路或是效能不佳

適合場景：
- workflow 多到網頁管理開始煩的人
- 已經在用 Claude Code 或 Cursor，想讓 AI 直接幫忙協助 n8n 的人
