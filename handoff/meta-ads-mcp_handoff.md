---
name: "Meta Ads MCP 文章"
project: "blog"
slug: meta-ads-mcp
status: active
updated: 2026-08-08
type: handoff-track
project_root: "/Users/darrellwang/Darrell/code/blog"
---
> 最後更新：2026-08-08 10:47

## 本次 session 完成的事（2026-08-08）

- 完成 Meta Ads MCP OAuth 連線與核心唯讀實測。
- 確認目前可用工具為 95 個，並確認 3 個台灣廣告帳戶可查詢。
- 驗證指定期間沒有投放時，成效欄位會整段不回傳；拉到有投放的舊期間後可取得數字。
- 完成匿名化廣告數據 dashboard、CTR 排名、散布圖、CPC 與資料表；散布圖已修正座標與平均線標籤。
- 完成文章前置條件、安裝步驟、工具重點與實測段落草稿。

## 下次接手第一步

先確認使用者補齊的 Claude 介面截圖，再讀取現有文章與草稿，將前置條件、安裝步驟、95 個工具的重點說明、實測段落與匿名化 dashboard 素材整合進 `/Users/darrellwang/Darrell/code/blog/source/_posts/meta-ads-mcp.md`。

## 重要 ID / 路徑

- 交接文件：`/Users/darrellwang/Darrell/code/blog/handoff/meta-ads-mcp_handoff.md`
- 正式文章：`/Users/darrellwang/Darrell/code/blog/source/_posts/meta-ads-mcp.md`
- 專案追蹤：`/Users/darrellwang/Darrell/code/blog/task-tracker.md`
- 匿名化 dashboard：`/private/tmp/claude-501/-Users-darrellwang-Darrell-code-blog/3209ac0e-62c6-4db4-b0e5-16ba71e4e3f7/scratchpad/meta-ads-dashboard.html`
- 競品整理素材：`/private/tmp/claude-501/-Users-darrellwang-Darrell-code-blog/3209ac0e-62c6-4db4-b0e5-16ba71e4e3f7/scratchpad/meta-ads-mcp-competitive.html`
- 廣告數據素材：`/private/tmp/claude-501/-Users-darrellwang-Darrell-code-blog/3209ac0e-62c6-4db4-b0e5-16ba71e4e3f7/scratchpad/meta-ads-mcp-data.html`

## 已知限制 / 決策

- 正式文章目前尚未改寫。
- Claude 介面截圖尚未整合；使用者負責補齊截圖。
- token 消耗實測本 session 未執行。
- 文章中的 campaign 名稱與金額必須匿名化；可保留 CTR、曝光、點擊與相對倍數。
- 實測結論應寫成「指定期間沒有投放時，成效欄位不回傳」，不要直接宣稱 MCP 有 bug。
- `ACTIVE` 的複雜狀態判讀不寫入文章；已依 API 狀態對應完成判斷。

## 硬性規範

- 只把已驗證的官方資料與實際回傳寫進文章。
- 不把匿名化前的帳戶 ID、campaign 名稱或金額放入文章。
- 文章採用既有 blog 版型契約，保留前置條件、安裝步驟、工具重點與實測段落。
- dashboard 素材只能使用匿名化版本。

## ⚠️ 接手前驗證清單（開始寫 code 前必跑）

□ 確認正式文章目前狀態：
  `git -C /Users/darrellwang/Darrell/code/blog status --short -- source/_posts/meta-ads-mcp.md`

□ 確認文章目前標題與段落結構：
  `rg -n "^(title|description|date|modified):|^#|^<h2|^###" /Users/darrellwang/Darrell/code/blog/source/_posts/meta-ads-mcp.md`

□ 確認交接用 dashboard 素材仍存在：
  `ls -l /private/tmp/claude-501/-Users-darrellwang-Darrell-code-blog/3209ac0e-62c6-4db4-b0e5-16ba71e4e3f7/scratchpad/meta-ads-dashboard.html`

□ 確認使用者補齊的介面截圖實際檔名與路徑，再決定文章圖片引用方式。
