---
title: n8n Poll Time 教學 - 優化 Trigger 效率
tags:
  - n8n
  - n8n tips
  - 效能優化
categories:
  - n8n
page_type: post
id: n8n-poll-time-setting
description: n8n Poll Time完整教學！場景對應設定、成本計算、Rate Limit避雷。
bgImage: n8n_polltime-bg.jpg
preload:
  - n8n_polltime-bg.jpg
date: 2025-09-21 15:50:00
---

{% darrellImageCover n8n_polltime-bg n8n_polltime-bg.jpg max-800 %}

**預計閱讀時間：** 3 分鐘
**適合對象：** 已有 n8n 基礎，想更加了解 poll time的朋友
{% quickNav %}
[
    {
      "text": "什麼是 Poll Time",
      "anchor": "what-is-poll-time",
      "desc": "基本概念"
    },
    {
      "text": "該設定多久?",
      "anchor": "performance-impact",
      "desc": "頻率建議"
    },
    {
      "text": "預設一分鐘要改嗎?",
      "anchor": "api-limits-costs",
      "desc": "成本考量"
    }
  ]
{% endquickNav %}

---

<h2 id="what-is-poll-time">什麼是 Poll Time</h2>

### 基本概念

Poll Time 是 n8n Trigger 節點中用來設定**多久跟對方確認一次**的參數。

{% callout warning %}
只有使用 **Polling Trigger** 的節點才會有這個設定，例如：
- RSS Feed Read
- Google Sheets Trigger
- Google Drive Trigger
- Gmail Trigger
- 第三方 API 的監控節點
{% endcallout %}

{% darrellImage800 n8n_polltime-trigger_use_polltime n8n_polltime-trigger_use_polltime.png max-400 %}

### 運作原理

Trigger 會按照設定的時間間隔，主動向外部服務「詢問」是否有新的資料：

```
每 X 段時間 → 檢查新郵件 → 有新郵件就觸發 workflow
```

這就是為什麼叫做 "Poll"（定期確認）的原因。

---

<h2 id="performance-impact">該設定多久?</h2>

### 場景的頻率

如果是每日上傳報表或是收到 email
那就設定為每天的固定時間就好

例如固定早上九點-九點半會收到信件
那可以設定早上十點去檢查一次信件來觸發工作流

{% darrellImage800 n8n_polltime-how_many_times_when_change_setting n8n_polltime-how_many_times_when_change_setting.jpg max-400 %}

---

<h2 id="api-limits-costs">預設一分鐘要改嗎?</h2>

會有兩個層面的問題:成本和 API Rate Limit

### API Rate Limit

絕大多數的 API 其實都有 Rate Limit，例如每小時 50次、每天 1000次
而且這些規則可以同時存在
以上面的規則為例
就算我們每天都打 API 49 次：一個月就是 1470 次，那還是超過 1000 次限制
我們會在第 21 天在超過限制，每個月 22 開始就壞了❌

### 成本

Server 的費用也是需要考量
假設是 Zeabur，我們每使用一次 trigger 或許就會造成 cpu 跟 記憶體的使用
而 Zeabur 的計費方式也會計算記憶體的使用量

所以我們每分鐘都觸發，一天就是 1440 次，一個月就是 43200 次
比起一天 1 次，一個月就只有 30 次

再假設一次的費用是 0.01 台幣
那就是 432 塊 vs 0.3 塊

相差甚遠！

{% darrellImage800 n8n_polltime-time_table n8n_polltime-time_table.jpg max-400 %}

---

## 相關文章推薦

{% articleCard
  url="/n8n-tips-pin/"
  title="n8n 小撇步 - Pin Data"
  previewText="降低測試時的 API 調用，避免重複觸發外部服務"
  thumbnail="https://www.darrelltw.com/n8n-tips-pin/n8n_pin_bg.jpg"
%}

{% articleCard
  url="/n8n-webhook/"
  title="n8n Webhook 節點完整教學"
  previewText="即時觸發替代方案，無需輪詢等待"
  thumbnail="https://www.darrelltw.com/n8n-webhook/blog-n8n-webhook-bg.jpg"
%}

