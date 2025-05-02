---
title: 用 Cloudflare Worker 和 KV 打造個人免費簡易的短網址服務
tags:
  - Cloudflare
categories:
  - Code Development
page_type: post
id: cloudflare-worker-url-shortener
description: 使用 Cloudflare Worker 和 KV 儲存快速搭建一個簡單但實用的短網址系統，無需伺服器，支援基本 API 操作和 UTM 追蹤功能。
date: 2025-05-02 13:01:00
bgImage: bg-blog-cloudflare-worker-shortenurl.png
preload:
  - bg-blog-cloudflare-worker-shortenurl.png
---
{% darrellImageCover bg-blog-cloudflare-worker-shortenurl bg-blog-cloudflare-worker-shortenurl.png max-800 %}

## Cloudflare Worker

它是個 Serverless 的服務
最大的優點就是免費的方案很夠用
而且 Cloudflare 的速度很快

如果是個人 **小用量** 的短網址需求
並且希望有 **客製化** 的可能
按照自己的使用習慣做調整
那我這幾個月時間使用的心得是蠻推薦的

整個架構主要會用到 Cloudflare Worker 和 KV

Worker 主要當作處理邏輯
KV 則是扮演類似資料庫的角色

KV = 類似 Redis 的 Key-Value 儲存
適合資料量小，但需要快速讀取的場景

### 價格

目前自己使用的方案是**免費版本**

{% darrellImage800 cloudflare_worker-kv_worker_pricing cloudflare_worker-kv_worker_pricing.png max-800 %}

雖然 KV + Worker 免費方案的讀取是到十萬/每日，
但如果未來會有其他 Worker 的用量
就要建議不要抓太緊
**不建議用這種短網址去投廣告，如果廣告流量突然暴增，可能會造成免費版本不夠使用**

## 短網址系統架構與流程

短網址系統主要處理兩種請求流程：

### API Request 流程
1. 客戶端發送 API 請求（如 POST 請求建立新短網址）
2. Cloudflare Worker 接收並處理請求
3. 驗證 API Token 確保安全性
4. 根據請求執行增刪查改操作
5. 在 KV 儲存中存取資料
6. 返回 JSON 格式的操作結果

{% darrellImage800 cloudflare_worker-api_flow cloudflare_worker-api_flow.png max-800 %}

### 短網址 流程
1. 用戶訪問短網址（如 `/abc`、`/abc/x` 或 `/abc/x/spring_sale`）
2. Cloudflare Worker 處理重定向請求
3. 從 URL 路徑中提取 ShortCode 、平台資訊和活動資訊
4. 在 KV 儲存中查詢對應的目標 URL
5. 根據查詢結果決定下一步操作
6. 如果存在對應的短網址，則添加 UTM 參數（基於平台和活動）
7. 執行 301 重定向到最終目標 URL

{% darrellImage800 cloudflare_worker-redirect_flow cloudflare_worker-redirect_flow.png max-800 %}

## 程式碼說明

讓我們直接來看完整的 Cloudflare Worker  Code 實現：

```javascript
const SOCIAL_PLATFORMS = {
  x: { source: 'x', medium: 'social' },
  facebook: { source: 'facebook', medium: 'social' },
  linkedin: { source: 'linkedin', medium: 'social' },
  instagram: { source: 'instagram', medium: 'social' },
  tiktok: { source: 'tiktok', medium: 'social' },
  threads: { source: 'threads_post', medium: 'social' },
  community: { source: 'community', medium: 'social' }
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      return url.pathname.startsWith('/api/') 
        ? handleApi(request, url, env)
        : handleRedirect(request, url, env);
    } catch (error) {
      return new Response(`錯誤: ${error.message}`, { status: 500 });
    }
  }
};

const CONFIG = {
  defaultUrl: 'https://www.darrelltw.com/', // 預設重定向 URL，若環境變數未設定時使用
  utmMedium: 'social'
};

async function handleApi(request, url, env) {
  // 驗證 API Token
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (token !== env.API_TOKEN) {
    return new Response('未授權', { status: 401 });
  }
  
  const method = request.method;
  const path = url.pathname.replace(/^\/api/, '');
  
  // 處理 POST/PUT 請求
  if ((method === 'POST' || method === 'PUT') && path === '/urls') {
    const { key, url } = await request.json();
    if (!key || !url) return new Response('缺少必要參數', { status: 400 });
    
    await env.SHORT_URLS.put(
      `/${key.replace(/^\//, '')}`, 
      url
    );
    
    return jsonResponse({ success: true });
  }
  
  // 處理 GET 請求
  if (method === 'GET' && path.startsWith('/urls/')) {
    const key = `/${path.replace('/urls/', '').replace(/^\//, '')}`;
    const value = await env.SHORT_URLS.get(key);
    
    return value 
      ? new Response(value, { headers: { 'Content-Type': 'text/plain' } })
      : new Response('找不到短網址', { status: 404 });
  }
  
  return new Response('無效的API端點', { status: 404 });
}

async function handleRedirect(request, url, env) {
  try {
    const path = url.pathname;
    // 優先使用環境變數中的預設 URL，若未設定則使用 CONFIG 中的值
    let redirectUrl = env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl;
    
    // 檢查是否有效路徑與 ShortCode 
    if (path !== '/' && path !== '') {
      const pathParts = path.split('/').filter(Boolean);
      const shortCode = pathParts[0];
      const platform = pathParts[1];
      const campaign = pathParts[2];
            
      if (shortCode) {
        let data = await env.SHORT_URLS.get(`/${shortCode}`);    
        if (data) {
          try {
            const finalUrl = new URL(data);
            
            if (platform) {
              // 使用預定義的社交平台參數
              if (SOCIAL_PLATFORMS[platform]) {
                const { source, medium } = SOCIAL_PLATFORMS[platform];
                finalUrl.searchParams.set('utm_source', source);
                finalUrl.searchParams.set('utm_medium', medium);
              } else {
                // 如果沒有預定義，則使用預設值
                finalUrl.searchParams.set('utm_source', platform);
                finalUrl.searchParams.set('utm_medium', CONFIG.utmMedium);
              }
            }
            
            // 設置 campaign 參數
            if (campaign) {
              finalUrl.searchParams.set('utm_campaign', campaign);
            }
                    
            redirectUrl = finalUrl.toString();
          } catch (error) {
            // 解析失敗，記錄錯誤並使用預設重定向
            console.error('解析短網址資料錯誤:', error);
            // 不嘗試構建 URL，直接使用預設值
            redirectUrl = env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl;
          }
        }
      }
    }    
    return Response.redirect(redirectUrl, 301);
  } catch (error) {
    console.error('重定向錯誤:', error);
    return Response.redirect(env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl, 301);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
```

### 主要處理邏輯

Worker 的入口點是 `fetch` 函數，它處理所有請求：

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      return url.pathname.startsWith('/api/') 
        ? handleApi(request, url, env)
        : handleRedirect(request, url, env);
    } catch (error) {
      return new Response(`錯誤: ${error.message}`, { status: 500 });
    }
  }
};
```

這段 Code 檢查 URL 路徑是否以 `/api/` 開頭
若是則視為 API 請求並交由 `handleApi` 處理；否則視為短網址訪問，交由 `handleRedirect` 進行重定向處理。
同時還定義了一些預設配置。

### API 管理功能

API 處理函數提供了管理短網址的接口：

```javascript
async function handleApi(request, url, env) {
  // 驗證 API Token
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (token !== env.API_TOKEN) {
    return new Response('未授權', { status: 401 });
  }
  
  const method = request.method;
  const path = url.pathname.replace(/^\/api/, '');
  
  // 處理 POST/PUT 請求
  if ((method === 'POST' || method === 'PUT') && path === '/urls') {
    const { key, url } = await request.json();
    if (!key || !url) return new Response('缺少必要參數', { status: 400 });
    
    await env.SHORT_URLS.put(
      `/${key.replace(/^\//, '')}`, 
      url
    );
    
    return jsonResponse({ success: true });
  }
  
  // 處理 GET 請求
  if (method === 'GET' && path.startsWith('/urls/')) {
    const key = `/${path.replace('/urls/', '').replace(/^\//, '')}`;
    const value = await env.SHORT_URLS.get(key);
    
    return value 
      ? new Response(value, { headers: { 'Content-Type': 'text/plain' } })
      : new Response('找不到短網址', { status: 404 });
  }
  
  return new Response('無效的API端點', { status: 404 });
}
```

API 功能主要包括：
1. 驗證授權 Token，確保只有授權用戶能夠管理短網址
2. 處理 POST/PUT 請求來創建或更新短網址：
   - 接收 key（ ShortCode ）和 url（目標網址）
   - 直接將 URL 字符串存儲在 KV 中，而不是 JSON 格式
3. 處理 GET 請求來檢索已存在的短網址信息
4. 返回適當的 JSON 響應和狀態碼

### 短網址重定向功能

重定向處理函數負責將短網址轉換為長網址：

```javascript
async function handleRedirect(request, url, env) {
  try {
    const path = url.pathname;
    // 優先使用環境變數中的預設 URL，若未設定則使用 CONFIG 中的值
    let redirectUrl = env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl;
    
    // 檢查是否有效路徑與 ShortCode 
    if (path !== '/' && path !== '') {
      const pathParts = path.split('/').filter(Boolean);
      const shortCode = pathParts[0];
      const platform = pathParts[1];
      const campaign = pathParts[2];
            
      if (shortCode) {
        let data = await env.SHORT_URLS.get(`/${shortCode}`);    
        if (data) {
          try {
            const finalUrl = new URL(data);
            
            if (platform) {
              // 使用預定義的社交平台參數
              if (SOCIAL_PLATFORMS[platform]) {
                const { source, medium } = SOCIAL_PLATFORMS[platform];
                finalUrl.searchParams.set('utm_source', source);
                finalUrl.searchParams.set('utm_medium', medium);
              } else {
                // 如果沒有預定義，則使用預設值
                finalUrl.searchParams.set('utm_source', platform);
                finalUrl.searchParams.set('utm_medium', CONFIG.utmMedium);
              }
            }
            
            // 設置 campaign 參數
            if (campaign) {
              finalUrl.searchParams.set('utm_campaign', campaign);
            }
                    
            redirectUrl = finalUrl.toString();
          } catch (error) {
            // 解析失敗，記錄錯誤並使用預設重定向
            console.error('解析短網址資料錯誤:', error);
            // 不嘗試構建 URL，直接使用預設值
            redirectUrl = env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl;
          }
        }
      }
    }    
    return Response.redirect(redirectUrl, 301);
  } catch (error) {
    console.error('重定向錯誤:', error);
    return Response.redirect(env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl, 301);
  }
}
```

重定向函數的工作流程：
1. 從 URL 路徑解析出三個部分： ShortCode 、Platform 和 Campaign
   - 使用 `path.split('/').filter(Boolean)` 處理，更靈活地支援多段式 URL
2. 根據 ShortCode 在 KV 儲存中查找對應的目標 URL
3. 使用 `new URL(data)` 直接將 KV 中的字符串作為 URL 解析
4. 根據 Platform 參數，檢查是否在 `SOCIAL_PLATFORMS` 中預定義：
   - 如果有，使用預定義的 source 和 medium 設置 UTM 參數
   - 如果沒有，則使用 Platform 名稱作為 source，預設 CONFIG.utmMedium 作為 medium
5. 如果有活動參數，則設置 utm_campaign
6. 執行 301 redirect 到最終 URL
7. 對於任何錯誤情況（包括解析 URL 失敗），直接重定向到預設 URL，確保用戶體驗不中斷

### 使用案例

現在有三種方式可以使用已創建的短網址：

- 基本訪問：`https://your-worker.domain/blog` 
- 帶平台參數：`https://your-worker.domain/blog/x`
- 帶平台和活動參數：`https://your-worker.domain/blog/x/spring_sale`

第二種方式會自動添加 UTM 來源和媒介參數，最終重定向到：
`https://example.com/my-very-long-blog-post-url?utm_source=x&utm_medium=social`

第三種方式會額外添加活動參數，最終重定向到：
`https://example.com/my-very-long-blog-post-url?utm_source=x&utm_medium=social&utm_campaign=spring_sale`

這樣可以更精準追蹤不同平台和活動的流量來源與轉換率。

## 設定步驟

### 1. 新增 Cloudflare Worker 專案

{% darrellImage800 cloudflare_worker-create_a_worker cloudflare_worker-create_a_worker.png max-800 %}

### 2. 新增 Worker 程式碼

{% darrellImage800 cloudflare_worker-edit_code cloudflare_worker-edit_code.png max-800 %}

將前面的 Code 保存到 `worker.js`。

### 3. 設定環境變數

在 Cloudflare Dashboard 設定以下環境變數來自訂短網址服務：

| 環境變數 | 說明 | 預設值 |
| --- | --- | --- |
| API_TOKEN | API 授權令牌 | 無，必須設定 |
| DEFAULT_REDIRECT_URL | 找不到短網址時的預設轉址 | 若未設定，預設為 'https://www.darrelltw.com/' |

{% darrellImage800 cloudflare_worker-kv-show_variables cloudflare_worker-kv-show_variables.png max-800 %}

### 4. 設定 KV 

{% darrellImage800 cloudflare_worker-kv-select_from_sidebar cloudflare_worker-kv-select_from_sidebar.png max-400 %}

{% darrellImage800 cloudflare_worker-kv-create_and_binding cloudflare_worker-kv-create_and_binding.png max-800 %}

先建立好 KV 空間
建立完成後，回到 Worker 設定
繫結(Binding) 剛剛的 KV 空間，ENV 現在是用 `SHORT_URLS` 來命名

### 5. 部署 Worker

直接在 Cloudflare Dashboard 中點擊「Save and Deploy」按鈕部署您的 Worker。

## 試用

### 建立短網址

使用 curl 或 Postman 等工具發送 API 請求來創建短網址：

```bash
curl -X POST https://your-worker.domain/api/urls \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"blog","url":"https://example.com/my-very-long-blog-post-url"}'
```

成功後會返回：

```json
{
  "success": true
}
```
---

或是直接在剛剛建立的 Cloudflare KV 直接新增一筆紀錄

{% darrellImage800 cloudflare_worker-kv-testing_add_index cloudflare_worker-kv-testing_add_index.png max-800 %}


在儲存短網址時，URL 直接存儲在 KV 中，這樣可以簡化重定向流程和提高效率。

### 訪問短網址

現在有三種方式可以使用已創建的短網址：

- 基本訪問：`https://your-worker.domain/blog` 
- 帶平台參數：`https://your-worker.domain/blog/x`
- 帶平台和活動參數：`https://your-worker.domain/blog/x/spring_sale`

第二種方式會自動添加 UTM 來源和媒介參數，最終重定向到：
`https://example.com/my-very-long-blog-post-url?utm_source=x&utm_medium=social`

第三種方式會額外添加活動參數，最終重定向到：
`https://example.com/my-very-long-blog-post-url?utm_source=x&utm_medium=social&utm_campaign=spring_sale`

這樣可以更精確地追蹤不同平台和活動的流量來源與轉換率。

## 搭配 n8n 自動化的場景

{% darrellImage800 cloudflare_worker-shortenurl_in_n8n cloudflare_worker-shortenurl_in_n8n.png max-800 %}

場景是當新文章 push 到 Github 後會觸發 action
action 會調用 n8n 的 workflow 來處理幾件事情

1. 產生短網址
2. 產生推文供使用者審核，審核完成會幫忙發到 X 上

其中產生短網址的部分就會直接新增一筆記錄到 KV 中
這樣後續就可以直接使用短網址了

## 總結

這個簡單的短網址系統可以輕鬆部署在 Cloudflare Worker 上，實現基本的短網址和管理功能。

進階功能可以考慮：

- 訪問統計與分析
- 短網址過期時間設定
- 批量管理工具
- 支援更多 UTM 參數（utm_id、utm_term 等）

