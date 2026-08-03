---
title: 如何在 Claude Desktop 安裝 GA4、SEO MCP
tags:
  - GA4
  - Search Console
  - MCP
categories:
  - AI
page_type: post
id: ga4-search-console-mcp-install
description: 實測和分享 GA4 , Search Console 的 MCP 安裝流程，讓 Claude Desktop 串接後就能輕鬆分析 GA4 報表和 Search Console 排名數據。
bgImage: ga4-search-console-mcp-cover.jpg
date: 2026-08-02 18:13:12
modified: 2026-08-03 17:26:48
---

{% darrellImageCover ga4-search-console-mcp-install ga4-search-console-mcp-cover.jpg max-800 %}

MCP 對於大家使用 AI 工具來說非常重要，自從 Meta Ads 出了 MCP 後
大家都能簡單用 AI 來分析 Meta 廣告的狀況

但是如果想要一起分析 GA4, SEO (Search Console) 的數據呢？
這邊推薦一個 GA4 的官方 MCP 和 Search Console 的社群版 MCP
未來就能把這三邊的資料串在一起分析

{% quickNav %}
[
  {"text": "建立 Google Cloud Project", "anchor": "create-google-cloud-project", "desc": "建立專案並啟用三個 API"},
  {"text": "建立 Service Account", "anchor": "create-service-account", "desc": "建立 JSON key 並設定資料權限"},
  {"text": "GA4 MCP 安裝", "anchor": "what-is-ga4-mcp", "desc": "官方 analytics-mcp 介紹與 JSON key 設定"},
  {"text": "GA4 MCP 能做哪些", "anchor": "ga4-mcp-tools", "desc": "run_report、即時資料等工具"},
  {"text": "安裝 Search Console MCP", "anchor": "search-console-mcp", "desc": "Claude Desktop 與 JSON key path 設定"},
  {"text": "常見問題", "anchor": "faq", "desc": "安裝雷點與限制"},
  {"text": "總結", "anchor": "summary", "desc": "Service Account 與 OAuth 的憑證差異"},
  {"text": "相關推薦", "anchor": "related", "desc": "延伸閱讀"}
]
{% endquickNav %}

<h2 id="create-google-cloud-project">建立 Google Cloud Project</h2>

這兩個 MCP 都會用到同一組 Google Cloud 設定
先建立專案，再把需要的 API 開起來

1. 到 [Google Cloud Console](https://console.cloud.google.com/) 建立或選一個專案

{% darrellImage800Alt "Google Cloud Console 新增專案畫面，填專案名稱後點建立" gcp_create_new_project.png max-800 %}

2. 啟用三個 API：

下面列出三個 API，點名稱即可個別複製：

<div class="copyable-list">
  <a class="copyable" data-copy="Analytics Admin API">Analytics Admin API</a>
  <a class="copyable" data-copy="Analytics Data API">Analytics Data API</a>
  <a class="copyable" data-copy="Search Console API">Search Console API</a>
</div>

{% darrellImage800Alt "Google Cloud Console 三個 API 的產品詳細資料頁面，包含 Analytics Admin API、Google Search Console API 和 Google Analytics Data API" gcp_enable_analytics_apis.png max-800 %}

<h2 id="create-service-account">建立 Service Account</h2>

Google Cloud Project 和 API 準備好後，再建立 Service Account 和 JSON key

1. 在 Google Cloud Console 開啟 `IAM 與管理` → `Service Accounts`，按 `Create service account`

{% darrellImage800Alt "Google Cloud Console 的 Service Accounts 頁面，標示建立服務帳戶按鈕" gcp_service_accounts_page_v2.png max-800 %}

2. 填寫服務帳戶名稱，`Service account ID` 沿用自動產生的值就好。描述寫清楚用途，接著按 `Create and continue`

{% darrellImage800Alt "Google Cloud Console 建立服務帳戶表單，標示服務帳戶名稱、帳戶 ID 和建立並繼續按鈕" gcp_create_service_account_form.png max-800 %}

3. `Grant users access to this service account` 這一步不用新增使用者或角色，直接按 `Done` 完成建立

{% darrellImage800Alt "Google Cloud Console 建立服務帳戶的選擇性權限頁面，不新增使用者或角色並按完成" gcp_service_account_optional_permissions_v2.png max-800 %}

4. 打開剛建立的 Service Account，先複製詳細資料頁上的 Service Account email。後面把它加到 GA4 和 Search Console 時會用到

{% darrellImage800Alt "Google Cloud Service Account 詳細資料頁面，標示可複製的 Service Account email" gcp_service_account_details_email_v2.png max-800 %}

5. 進入 `Keys` → `Add key` → `Create new key`

{% darrellImage800Alt "Google Cloud Console 的 Service Account Keys 頁面，展開 Add key 選單並選擇 Create new key" gcp_service_account_keys_menu_v2.png max-800 %}

6. 選 `JSON`，按 `Create`。瀏覽器會下載私密金鑰檔案，後面的兩個 MCP 都會用到它

{% darrellImage800Alt "Google Cloud Console 建立服務帳戶私密金鑰的視窗，選擇 JSON 格式並按建立" gcp_service_account_create_json_key.png max-800 %}

{% callout type="warning" title="JSON key 只會提供一次，而且有外洩風險" %}
這個 JSON 檔案只會提供這一次，遺失後不能重新下載。Google Cloud Console 也會提醒 Service Account key 有外洩風險，並建議使用 Workload Identity Federation。這篇因為要在本機讓兩個 MCP 讀取憑證，才使用 JSON key，請立刻放到安全的位置，不要放進 Git repository 或公開資料夾
{% endcallout %}


### GA4 資源分享權限給 Service Account

GA4 選好要查詢的 property，進入 `管理 → 資源存取權管理`（英文介面是 `Admin → Property Access Management`）。貼上剛剛複製的 Service Account email，角色選 **檢視者（Viewer）**，最後按 `新增`

{% darrellImage800Alt "GA4 新增角色和資料限制畫面，標示服務帳戶 email、檢視者角色和新增按鈕" ga4_property_access_add_user.png max-800 %}

### Search Console 分享權限給 Service Account

Search Console 選好 property，進入 `設定 → 使用者和權限`（英文介面是 `Settings → Users and permissions`），按 `新增使用者`。貼上剛剛複製的 Service Account email，權限選 **限制（Restricted）** 即可

{% darrellImage800Alt "Search Console 新增使用者畫面，標示服務帳戶 email、限制權限和新增按鈕" search_console_add_user_restricted.png max-800 %}


<h2 id="what-is-ga4-mcp">GA4 MCP 安裝</h2>

GA4 這邊用的是 Google 官方釋出的 MCP Server，repo 在 [googleanalytics/google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp)

前面的 Google Cloud 前置設定完成後，這一段只需要做 GA4 MCP 和 Claude Desktop 設定

前面有下載的 Service Account JSON key 路徑複製好
修改下面的 `GOOGLE_APPLICATION_CREDENTIALS` 欄位把路徑貼上就好

```json
{
  "mcpServers": {
    "google-analytics-4": {
      "command": "pipx",
      "args": ["run", "analytics-mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "這邊替換成你的檔案路徑 service_account.json"
      }
    }
  }
}
```

存檔後要**關閉 Claude Desktop再重新打開**
然後檢查連接器是否有出現 **google-analytics-4**

{% darrellImage800Alt "Claude Desktop 的 Connectors 選單，google-analytics-4 connector 已開啟" claude_desktop_connectors_ga4_enabled.png max-800 %}


<h2 id="ga4-mcp-tools">GA4 MCP 能查什麼：可用的工具清單</h2>

{% dataTable style="minimal" align="left" %}
[
  {"工具": "get_account_summaries", "用途": "列出可用的 GA4 帳號與資源"},
  {"工具": "get_property_details", "用途": "查特定資源的細節"},
  {"工具": "run_report", "用途": "取得報表資料"},
  {"工具": "run_realtime_report", "用途": "查即時資料"},
  {"工具": "run_funnel_report", "用途": "查漏斗報表"},
  {"工具": "get_custom_dimensions_and_metrics", "用途": "列出自訂維度與指標"},
  {"工具": "list_google_ads_links", "用途": "查 GA4 串接的 Google Ads 帳戶"}
]
{% enddataTable %}

我實測連上後，Claude 可以直接列出有被分享的 property，`run_report` 也能正常跑報表資料


<h2 id="search-console-mcp">Search Console MCP 安裝</h2>

{% callout warning %}
Search Console 沒有 Google 官方 MCP。這裡用的是社群維護的第三方套件
安裝前先看一下 repo 最近還有沒有更新
或是 Google 官方有推出 MCP 的話我也會盡快更新到文章中！
{% endcallout %}

目前是使用 [AminForou/mcp-gsc](https://github.com/AminForou/mcp-gsc)

也把 Service Account 加到要查詢的 property
這裡只要安裝套件，再把同一個 JSON key 的路徑放進 Claude Desktop 設定檔

設定 claude_desktop_config.json

```json
{
  "mcpServers": {
    "google-search-console": {
      "command": "uvx",
      "args": ["mcp-search-console"],
      "env": {
        "GSC_CREDENTIALS_PATH": "更換這裡的路徑 service_account.json",
        "GSC_SKIP_OAUTH": "true"
      }
    }
  }
}
```

`GSC_SKIP_OAUTH: "true"` 的設定會強制只走 Service Account，不跳出瀏覽器登入視窗

如果 **uvx** 有問題，請先和 AI 討論是否有安裝 uvx 指令

存檔後一樣要完全關閉 Claude Desktop，再重新打開檢查是否在 connector 有出現

{% darrellImage800Alt "Claude Desktop 的 Connectors 選單，google-search-console connector 已開啟" claude_desktop_connectors_search_console_enabled.png max-800 %}

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {
    "question": "GA4 和 Search Console 可以用同一個官方 MCP 嗎？",
    "answer": "不行。官方的 analytics-mcp 目前只支援 GA4，Search Console 要另外接社群維護的第三方套件。"
  },
  {
    "question": "GA4 和 Search Console 可以用同一把 Service Account 嗎？",
    "answer": "可以。同一把 Service Account key 可以分別加到 GA4 的 Property Access Management 和 Search Console 使用者權限裡，但兩邊要各自授權，不會互相繼承。"
  },
  {
    "question": "裝完 MCP Server 起不來，是什麼問題？",
    "answer": "最常見的是本機同時裝了多份 uv 或 uvx，PATH 排序讓舊版本先被執行。這點會隨著電腦和作業系統不同，建議可以請 AI 幫忙 debug，請他排查的時候方向往 uv, uvx 這些關鍵字檢查看看"
  },
  {
    "question": "MCP 連上了，但查詢時顯示查不到任何 GA4 資源或 Search Console 網站，是什麼問題？",
    "answer": "先確認錯誤訊息是什麼。如果是明確的錯誤訊息（例如認證失敗），通常是路徑或格式問題。但如果是「查詢成功、只是清單是空的」，代表 Service Account 認證其實有過，只是這組身分沒被加進 GA4 或 Search Console 的權限清單。最常見的原因是換過 JSON key 之後，忘記同步更新 claude_desktop_config.json 裡的路徑，導致 MCP 讀到的還是舊金鑰。建議打開 JSON key 檔案核對 client_email，再回 GA4/Search Console 的權限畫面逐字比對，確認兩邊是同一個 email。"
  }
]
{% endfaq %}


<h2 id="summary">總結</h2>

先建立好 Google Cloud Project 和設定 Service Account 是比較麻煩跟複雜的步驟
還要到 GA4, Search Console 授權給這個 SA 的 email

使用 Service Account 的好處是，可以把自動化身分獨立出來，只接收另外分享的 GA4 和 Search Console 權限
不過 JSON key 仍是長期有效的私密憑證，必須妥善保管

OAuth 的存取範圍則受 scope 和使用者既有資源權限限制
至於要怎麼選，取決於你要分開自動化身分，還是更在意憑證的實體管理

AI 時代如何控制 AI 會不會讀取錯誤的帳號不小心外洩出去很重要！

未來如果希望 MCP 能夠分享其他帳號，只要重複分享權限給 Email 的步驟就好！

<h2 id="related">相關推薦</h2>

{% articleCard url="/claude-desktop-new-mcp-features-review/" title="Claude MCP 應用測試心得 - Claude Desktop" previewText="從 FileSystem、Fetch 到 Google Maps，看看 Claude Desktop 的 MCP 實際使用方式。" thumbnail="https://www.darrelltw.com/claude-desktop-new-mcp-features-review/claude_desktop_mcp_bg.jpg" %}

{% articleCard url="/line-mcp-server/" title="LINE MCP Server 測試心得" previewText="用 MCP 讓 Claude 直接操作 LINE Messaging API，延伸了解 MCP 的實作場景。" thumbnail="https://www.darrelltw.com/line-mcp-server/line_mcp_server_bg.jpg" %}
