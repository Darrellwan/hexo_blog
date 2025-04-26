---
title: 利用 n8n 的 s3 節點連接 Cloudflare R2 儲存服務
tags:
  - n8n
  - n8n節點介紹
  - Cloudflare
categories:
  - n8n
page_type: post
id: n8n-node-s3-with-cloudflare-r2
description: 介紹如何在 n8n 中使用 s3 節點連接 Cloudflare R2 儲存服務，包含 API Token 申請、權限設定、上傳下載檔案，適合想將自動化流程與雲端儲存整合的使用者。
bgImage: blog-n8n-s3-node-bg.jpg
preload:
  - blog-n8n-s3-node-bg.jpg
date: 2025-04-25 00:02:03
---
{% darrellImageCover n8n-node-s3-with-cloudflare-r2-bg blog-n8n-s3-node-bg.jpg max-800 %}

## n8n s3 節點

{% darrellImage800 n8n_s3_node-compare_to_aws_s3 n8n_s3_node-compare_to_aws_s3.png max-800 %}

在 n8n 節點搜尋 s3 節點時，會出現兩種長得很像的節點

一個是 s3
另一個是 aws s3 

我們今天介紹的是第一種

### 什麼是 s3?

s3 是 AWS 推出的物件儲存服務
命名的由來是 `Simple Storage Service`
是個讓你簡單儲存檔案的服務

**s3 漸漸變成一種標準**

n8n 的 s3 節點意思就是只要其他服務
有支援 `s3` 這個標準
就可以使用這個節點來做檔案的存取

目前已知有支援 s3 的服務：

- Cloudflare R2
- Backblaze B2
- Minio
- Wasabi
- Digital Ocean spaces

## Cloudflare R2 與 s3 節點整合

[Cloudflare R2](https://developers.cloudflare.com/r2/) 是 Cloudflare 推出的物件儲存服務

適合需要頻繁讀取檔案的使用情境
而 n8n 透過內建的 s3 節點就可以輕鬆整合 R2 服務，做到檔案上傳、下載和管理等操作

## 選擇 Cloudflare R2 的原因

最大的原因肯定是費用

{% darrellImage800 n8n_s3_node-cloudflare_r2_pricing n8n_s3_node-cloudflare_r2_pricing.png max-800 %}

儲存 : 每月 10gb 內免費！

Class A 操作 : 每月 100 萬次免費
`Class A` 就是上傳、修改等等操作檔案，還有列出目錄清單

Class B 操作 : 每月 1000 萬次免費
`Class B` 就是下載、刪除等等取得檔案

## 申請 Cloudflare R2 API Token 與權限設定

要使用 n8n 連接 R2，首先需要申請 API Token。以下是詳細步驟：

### 1. 建立 R2 儲存桶

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 選擇 **R2** 服務
3. 點選 **Create bucket** 建立新的儲存桶
4. 輸入儲存桶名稱（例如：`my-n8n-bucket`）
5. 選擇儲存區域（如有需要）
6. 點選 **Create bucket** 完成建立

### 2. 申請 API Token

1. 在 Cloudflare 控制面板中，選擇 **R2**
2. 從 **API** 下拉選單中選擇 [**Manage API tokens**](https://dash.cloudflare.com/?to=/:account/r2/api-tokens)
3. 選擇建立權杖類型：
   * **Create User API token**：綁定於個人用戶，繼承個人權限，如果用戶被移除則失效

在建立 Token 時，您可以選擇以下權限類型：

| 權限類型 | 描述 | 適用場景 |
| --- | --- | --- |
| Admin Read & Write | 允許建立、列出和刪除儲存桶，編輯儲存桶設定，讀取、寫入和列出物件 | 需要完整管理 R2 的場景 |
| Admin Read only | 允許列出儲存桶和查看儲存桶設定，讀取和列出物件 | 只需讀取資料的場景 |
| Object Read & Write | 允許讀取、寫入和列出特定儲存桶中的物件 | 只需操作檔案而不需管理儲存桶的場景 |
| Object Read only | 允許讀取和列出特定儲存桶中的物件 | 只需讀取檔案的場景 |

### 3. 取得存取資訊

建立 API Token 後，您將獲得：

{% darrellImage800 n8n_s3_node-get_keys_in_cloudflare_r2 n8n_s3_node-get_keys_in_cloudflare_r2.png max-800 %}

* **Access Key ID**
* **Secret Access Key**

**重要提醒**：Secret Access Key 只會顯示一次，請務必妥善保存！

除了 Access Key 外，您還需要 R2 的端點網址：
* 格式為：`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
* 您的 Account ID 可在 Cloudflare 儀表板中找到

### 4. 在 n8n 中設定 s3 Credentials

取得 R2 的 API Token 後，接下來在 n8n 中設定 s3 Credentials：

1. 在 n8n 中，點選左側選單的 **Credentials**
2. 點選 **Add Credential** 按鈕
3. 搜索並選擇 **s3**
4. 填入以下資訊：
   * **Credential Name**：為憑證命名（例如：`Cloudflare R2`）
   * **s3 Endpoint**：輸入 `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
   * **Region**：輸入 `apac`
   * **Access Key ID**：貼上您的 Access Key ID
   * **Secret Access Key**：貼上您的 Secret Access Key

5. 點選 **Save** 儲存憑證

### Cloudflare R2 API + n8n s3 憑證設定 影片教學

<iframe width="560" height="315" src="https://www.youtube.com/embed/DTvC6upM3CQ?si=ostw5zI0UGHsDBRA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 使用 s3 節點操作 R2 儲存桶

設定好 Credentials 後，就可以在工作流程中使用 s3 節點操作 R2 儲存桶：

### 用 n8n s3 來上傳檔案

n8n 的 s3 節點可以操作下列權限：

{% darrellImage800 n8n_s3_node-s3_capability n8n_s3_node-s3_capability.png max-1024 %}


如果 API 有設定 admin 的話還可以操作 Bucket
但考量大部分情況都只有上傳下載檔案，故權限只有 Bucket 內的檔案和資料夾行為

檔案
* 上傳檔案 (Upload)
* 下載檔案 (Download)
* 刪除檔案 (Delete)
* 列出所有檔案 (Get All)
* 複製檔案 (Copy)

資料夾
* 建立資料夾 (Create)
* 刪除資料夾 (Delete)
* 列出所有資料夾 (Get All)

### 上傳檔案範例

以下是使用 s3 節點上傳檔案到 R2 的設定範例：

1. 新增 **s3** 節點
2. 選擇您的 **s3 Credential**
3. 設定節點參數：
   * **Resource**：選擇 `File`
   * **Operation**：選擇 `Upload`
   * **Bucket Name**：輸入您的儲存桶名稱
   * **Binary Property**：選擇含有檔案的來源欄位（例如：`data`）
   * **File Name**：設定上傳後的檔案名稱
   * **Make Public**：根據需求決定是否公開檔案

執行後，檔案就會被上傳到您的 R2 儲存桶中。

{% darrellImage800 n8n_s3_node-s3_upload_file_demo n8n_s3_node-s3_upload_file_demo.png max-800 %}

## 實用案例分享

### 案例：GPT-image-1 產生圖片後傳送到 Line Message API

{% darrellImage800 n8n_s3_node-ai_image_upload_line_demo n8n_s3_node-ai_image_upload_line_demo.jpg max-800 %}

要將圖片傳送到 Line Message API 需要一個網址
而 GPT-image-1 產生圖片後只會給一個 base64 的資料格式

所以我們可以透過 n8n 先將 base64 的資料轉換成圖片檔案
再透過 n8n s3 節點上傳到 Cloudflare R2 取得網址
就能將圖片網址用來傳送 Line Message API

1. 使用 **Webhook** 接收 LINE 的訊息通知
2. 使用 **HTTP Request** 下載圖片
3. 使用 **s3** 節點將圖片上傳到 R2
4. 使用 **HTTP Request** 節點回覆含有圖片 URL 的訊息

{% darrellImage800 n8n_s3_node-line_prompt_to_image_demo n8n_s3_node-line_prompt_to_image_demo.png max-800 %}

