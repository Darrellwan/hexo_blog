# automation.darrelltw.com 上線導流腳本

狀態：**已備妥，尚未套用。** 這份文件裡的每一項都還沒改進 repo。
建立日期：2026-08-17
對應計畫：`docs/plans/2026-08-15-automation-site-plan.md`（Phase 2 步驟 7–8、Phase 5）

轉址對應決定（Darrell 2026-08-17）：舊接案頁**全部導向新站首頁** `https://automation.darrelltw.com/`。
理由：舊頁內容含三種服務、案例與表單，與新站首頁最接近；一條規則涵蓋，不會有漏網路徑。

---

## 0. 前置條件（全部為真才可執行，否則排名會掉）

- [ ] 新站已移除 Cloudflare Access 應用程式（`6183db05-3dfe-4cf4-a367-10106af256f5`）
- [ ] 新站 `public/_headers` 已移除 `X-Robots-Tag: noindex, nofollow`
- [ ] 新站 `robots.txt` 已放行、`sitemap.xml` 可匿名存取
- [ ] 匿名 `curl -I https://automation.darrelltw.com/` 回 200（不是 302）
- [ ] 諮詢表單在正式狀態下實際送出成功一次

順序鐵則：**上面全綠之後才做第 1 步。** 反過來做，Google 從舊頁跟過去會撞到擋索引的新站。

---

## 1. blog 的 301 轉址（`vercel.json`）

把下列物件併進現有的 `redirects` 陣列（現有那條 `/n8n-resources` 保留）。

```json
{ "source": "/n8n-expert", "destination": "https://automation.darrelltw.com/", "statusCode": 301 },
{ "source": "/n8n-expert/:path*", "destination": "https://automation.darrelltw.com/", "statusCode": 301 },
{ "source": "/n8n-expert-v2/:path*", "destination": "https://automation.darrelltw.com/", "statusCode": 301 },
{ "source": "/n8n-service/:path*", "destination": "https://automation.darrelltw.com/", "statusCode": 301 }
```

必須用 `statusCode: 301`。**不要用 `permanent: true`** —— 那會送出 308，不是 301。

⚠️ 執行第 1 步之前，先做第 2 步的 Link in Bio 圖片搬移，否則 `/n8n-expert/images/og-image.webp` 會被上面第二條規則吃掉，Link in Bio 的卡片圖變成破圖。

---

## 2. 站內連結改寫（6 處）

### 2-1 主選單（影響每一頁，最優先）
`themes/next/_config.yml:127`

```
改前：n8n_service: /n8n-expert/ || fa fa-solid fa-briefcase highlight-n8n
改後：n8n_service: https://automation.darrelltw.com/ || fa fa-solid fa-briefcase highlight-n8n
```

### 2-2 給 AI agent 讀的服務頁連結
`source/llms.txt:52`

```
改前：- **服務頁面**: [n8n 自動化專家](https://www.darrelltw.com/n8n-expert/)
改後：- **服務頁面**: [Darrell 自動化顧問](https://automation.darrelltw.com/)
```

### 2-3 Link in Bio 卡片（2 處 + 1 張圖）
`source/links/index.html:695-696`

```
改前：<a href="/n8n-expert/" class="card premium">
改後：<a href="https://automation.darrelltw.com/" class="card premium">

改前：background-image: url('/n8n-expert/images/og-image.webp')
改後：background-image: url('/links/og-n8n-expert.webp')
```

圖片要先搬過去，讓 Link in Bio 自帶資源、不再相依於即將被轉址的資料夾：

```bash
cp source/n8n-expert/images/og-image.webp source/links/og-n8n-expert.webp
```

### 2-4 舊的 meta refresh 中繼頁
`source/n8n-service/index.html`（第 12、15、48、53 行都指向 `/n8n-expert/`）

第 1 步的 `/n8n-service/:path*` 轉址會在伺服器端攔截，這個檔案不會再被讀到。
**直接刪掉整個 `source/n8n-service/` 資料夾**，避免留著一份會造成轉址接力的死檔。

### 2-5 文章內導流連結（2 篇，共 3 處）

| 檔案 | 行 | 改前 | 改後 |
|---|---|---|---|
| `source/_posts/n8n-cli-guide.md` | 286 | `[n8n 顧問服務](/n8n-expert/)` | `[n8n 顧問服務](https://automation.darrelltw.com/)` |
| `source/_posts/n8n-bycrawl-node.md` | 333 | `[找我實作和討論](/n8n-expert/)` | `[找我實作和討論](https://automation.darrelltw.com/)` |
| `source/_posts/n8n-bycrawl-node.md` | 506 | `[找我聊聊](/n8n-expert/)` | `[找我聊聊](https://automation.darrelltw.com/)` |

改文章不要動 front matter 的 `date`；這種連結替換不是實質更新，**不要加 `updated`**。

---

## 3. 只有 Darrell 能改的外部入口

這幾個不在 repo 裡，程式碼改不到：

- [ ] Threads `@darrell_tw_` 個人檔案連結
- [ ] Instagram `@darrell_tw_` 個人檔案連結
- [ ] X / Twitter `@darrell_tw_` 個人檔案連結
- [ ] 電子報頁尾／歡迎信裡的服務連結
- [ ] 名片、簡報、講師介紹用的網址
- [ ] Google Search Console：送出新站 sitemap（`https://automation.darrelltw.com/sitemap-index.xml`）
- [ ] 確認有沒有 Google Ads 或其他投放指向 `/n8n-expert/`（有的話廣告到達網址要一起換）

Search Console 的「變更網址」工具**不適用**本案（那個工具是整個網域搬家用的，這裡只搬一個區塊），靠 301 傳遞權重即可。

---

## 4. 驗收（每條都要實跑，不能只看設定）

```bash
for u in /n8n-expert /n8n-expert/ /n8n-expert/index.html /n8n-expert/images/og-image.webp \
         /n8n-expert-v2/ /n8n-service/ /n8n-service ; do
  printf "%-38s " "$u"
  curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" "https://www.darrelltw.com$u"
done
```

通過標準：

- 每條都回 **301**（不是 302、不是 308）
- `Location` 一律是 `https://automation.darrelltw.com/`
- **沒有轉址接力**：一次到位，不能出現先跳 `/n8n-expert/` 再跳新站
- 不存在的路徑不要被規則吃掉導向首頁以外的地方
- `/links/` 仍回 200，卡片圖不是破圖
- 主選單「n8n 服務」點下去直接到新站

---

## 5. 回滾

新站出現 5xx、表單中斷或轉址錯誤時：

1. 從 `vercel.json` 移除第 1 步那四條規則 → push → Vercel 重新部署（舊頁立刻復活，因為 `source/n8n-expert/` 還在）
2. 新站 Worker 可用 `npx wrangler rollback` 退回前一版

**所以 `source/n8n-expert/` 資料夾在轉址穩定運作至少一個月之前不要刪。** 那是回滾的唯一退路。

---

## 6. 未解事項（動手前要先查清楚）

**`/n8n-service/` 現在已經有一條 301 指向 `/n8n-expert/`，但那條規則不在這個 repo 裡。**

實測：`curl -sI https://www.darrelltw.com/n8n-service/` 回 301、`Location: /n8n-expert/`，
但 `vercel.json` 只有 `/n8n-resources` 一條，repo 內也搜不到任何 `n8n-service` 的轉址設定。
`source/n8n-service/index.html` 是一個 meta refresh 頁，那是前端跳轉、產生不了 301。

未驗證的推測：它可能設在 Vercel 專案後台的 Redirects，也可能設在 Cloudflare 的 Redirect Rules
（`www.darrelltw.com` 走 Cloudflare 代理）。目前手上的 API token 沒有這兩處的讀取權限，查不到。

**沒找到來源就執行第 1 步的話**，那條舊規則會先把 `/n8n-service/` 導到 `/n8n-expert/`，
再被新規則導到新站，變成兩跳的轉址接力——正是計畫第 93 行要求避免的情況。
上線前請到 Vercel 專案設定與 Cloudflare 的 Rules 兩處各看一次，找到就刪掉。
