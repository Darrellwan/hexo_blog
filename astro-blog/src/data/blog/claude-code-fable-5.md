---
title: Claude Code Fable 5 限時限量回歸，該怎麼用
pubDatetime: 2026-07-03T16:35:59+08:00
modDatetime: 2026-07-26T23:04:41+08:00
description: Claude Code Fable 5 使用建議，整理 2026/07 額度規則、Opus 5 與 Fable 5 的 benchmark 對照，以及哪些任務值得用 Fable、怎麼切換模型與控制成本。
tags:
  - Claude Code
  - Claude
categories:
  - Claude
page_type: post
id: claude-code-fable-5
slug: claude-code-fable-5
bgImage: blog-claude-code-fable-5-bg.jpg
ogImage: blog-claude-code-fable-5-bg.jpg
---

{% darrellImageCover claude-code-fable-5-bg blog-claude-code-fable-5-bg.jpg %}

{% quickNav %}
[
  {"text": "額度現況", "anchor": "202607-return", "desc": "時間限制結束後各方案怎麼用"},
  {"text": "什麼時候用", "anchor": "answer-first", "desc": "什麼時候值得用 Fable 5"},
  {"text": "Opus 5 對照", "anchor": "opus5-vs-fable5", "desc": "Benchmark 與成本曲線"},
  {"text": "使用方法", "anchor": "how-to-use", "desc": "切換模型、任務背景、effort"},
  {"text": "方法論與限制", "anchor": "methodology-and-limits", "desc": "工作流程、成本與政策邊界"},
  {"text": "常見問題", "anchor": "faq", "desc": "額度、方案與模型差異"}
]
{% endquickNav %}


<h2 id="202607-return">額度現況（2026/07 更新）</h2>

### Fable 的去留？

Fable 5 七月初回歸時，官方先給了一段**訂閱額度內可用**的限時優惠
一路將試用的時間又延長到 **7/19 23:59:59 PT**

最後定案的方式是：
- **Max, Team premium** 以上方案將能繼續使用，額度一樣是 weekly limit 的 50%
- 其他方案都改為 Extra Usage Credit (API 計價) 收費，使用完畢後需要另外儲值
- Pro 方案會贈送 $100 美元額度的 Credit

{% dataTable style="minimal" align="left" %}
[
  {"方案": "Max、Team premium、Enterprise premium", "現在怎麼用": "使用訂閱方案額度", "還有上限嗎": "有，每週用量的 50%"},
  {"方案": "Pro、Team standard", "現在怎麼用": "走 usage credits，另外計費", "還有上限嗎": "錢包決定你的上限"},
  {"方案": "Free", "現在怎麼用": "不能用", "還有上限嗎": "—"}
]
{% enddataTable %}

Usage Credit 的 API 計價超級貴：約 **$10 / M input、$50 / M output**
可能幾個問答來回，就會把 $100 美元的贈送額度用完

### 怎麼查自己還剩多少

在 claude.ai 的設定頁可以看到，Fable 會獨立列一條每週用量：

{% darrellImage800Alt "claude.ai 網頁版 Plan usage limits 彈窗，Fable 顯示獨立的每週用量進度條與剩餘額度" fable5-usage-limit-web.png max-800 %}

或是在 Claude Code 裡直接打 `/usage`，終端機也會顯示同樣的資訊：

{% darrellImage800Alt "Claude Code CLI usage 畫面，Current week Fable 顯示本週已使用百分比與重置時間" fable5-usage-limit-cli.png max-800 %}

政策這類東西可能會一變再變，歡迎參考最新官方說明：
[Claude Fable 5 on your plan](https://support.claude.com/en/articles/15424964-claude-fable-5-on-your-plan)


<h2 id="answer-first">什麼時候該用 Fable 5？</h2>

如果你只是想問一個答案、改一小段文案、補一個已知解法的小 bug，Fable 5 通常不是最划算的選擇。

Fable 5 真正值得用的情境，是一個新專案的策略完整規劃，或是將現有的系統做一次完整的回顧和改善。
這類工作通常有幾個特色：範圍比較大、牽涉超多檔案、需要多輪驗證。

{% dataTable style="minimal" align="left" %}
[
  {"你的任務": "快速問答、摘要、小段改寫", "建議": "不用 Fable", "原因": "任務太短，模型能力用不上"},
  {"你的任務": "已知解法的小 bug", "建議": "不用 Fable", "原因": "先用 Sonnet / Opus 或直接手改更有效率"},
  {"你的任務": "跨檔案重構、長時間 debugging", "建議": "適合", "原因": "需要讀上下文、建立假設、分階段驗證"},
  {"你的任務": "模糊需求變成計畫，再一路推到實作", "建議": "適合", "原因": "Fable 5 的價值在長任務規劃與自我校正"},
  {"你的任務": "多 agent 工作流", "建議": "適合", "原因": "可以把它當 orchestrator，但仍要設 verifier 來驗證"}
]
{% enddataTable %}


<h2 id="opus5-vs-fable5">Opus 5 vs Fable 5</h2>

Anthropic 在台灣時間 7/24 推出了最新的 **Opus 5** 模型
就 Benchmark 來看，Opus 5 可能在不少場景都能接近或是超越 Fable 5

{% darrellImage800Alt "Opus 5 與 Fable 5、Opus 4.8、GPT-5.6 Sol 的多項 benchmark 對照表" opus5-vs-fable5-benchmark.jpg max-800 %}

下圖可以看到寫程式的場景中，Opus 5 在成本或效能上可能都超過 Fable 5
(但要注意這是 Benchmark，我會建議參考就好！)

{% darrellImage800Alt "Frontier-Bench agentic coding：不同 effort 等級下分數與每次成本對照，Opus 5、Fable 5、Opus 4.8、GPT-5.6 Sol" opus5-vs-fable5-effort-cost.jpg max-800 %}

所以大家也不用太糾結自己的方案有沒有 **Fable 5** 可以使用
現在 Opus 5 使用體感和社群的 Feedback 都是比以前的 4.8 好上不少
未來 Fable 5.1 已經有傳聞要在 2026年 8月推出，到時再來看看新版 Fable 能進步多少！

<h2 id="how-to-use">在 Claude Code 裡使用 Fable 5</h2>

第一步驟：用 `/model` 來切換到 Fable

但切換之前你要先想想：
Fable 5 的重點不是「一句話下對就會成功」，而是讓它先理解任務邊界，再分階段負責到底。

### 先定義任務背景，不要只丟命令

我不建議把 Fable 5 當成「比較強的自動補完」
它更適合先理解完整任務背景，為什麼要做、不能做什麼、要怎麼驗證

任務交代時至少要包含四件事：

1. **目標**：這次工作最後要交付什麼結果。 (類似 `/goal`)
2. **背景**：為什麼要做，現在的痛點或限制是什麼。
3. **邊界**：哪些檔案、流程、使用者行為不能被影響。
4. **驗證方式**：完成後要用測試、畫面、log、資料比對，還是手動流程確認。

### 用 effort 當成本控制器

{% dataTable style="minimal" align="left" %}
[
  {"effort": "medium / low", "適合任務": "整理、摘要、格式化、已明確的小任務", "提醒": "用 Fable 5 + medium 的話那這個情境可能就不適合 Fable"},
  {"effort": "xhigh", "適合任務": "重大架構、不可逆風險、長時間疑難排解", "提醒": "用在真正高風險的決策點，不要全程開著燒"},
  {"effort": "ultracode", "適合任務": "要讓他調用其他 agent 去全面翻修或調查", "提醒": "ultracode 不是真的思考程度更高，只是 xhigh + /workflow 去動態調用 agent"}
]
{% enddataTable %}

{% callout warning %}
用 ultracode 時，記得在 prompt 裡明確限制子 agent 只用 Sonnet 等級的模型。如果放著讓它派出大量 Fable agent 去做事，那就是過度浪費。
{% endcallout %}

<h2 id="methodology-and-limits">方法與限制</h2>

### Goal → Plan → Execute → Verify → Handoff

{% darrellImage800Alt "Claude Code Fable 5 工作流：Goal、Plan、Execute、Verify、Handoff，每一輪都用證據校正" fable5-claude-code-workflow.png max-800 %}

1. Goal：先定義任務完成長什麼樣
2. Plan：拆階段，不急著改
3. Execute：每階段只做對應 scope
4. Verify：跑測試，或用手動驗證補上
5. Handoff：把已完成、未完成、風險寫清楚

這是我會把 Fable 5 放進 Claude Code 的基本流程。它不是靠一句完美指令解決所有事，而是每一輪都讓模型根據環境回饋更新判斷。


### 成本與政策邊界

成本部分前面已經講過小任務不值得用。

再對一下現在的計費：

- **Max / premium**：Fable 還在訂閱裡，但每週最多 50%，燒完就得 credits 或換模型
- **Pro / standard**：Fable 走 {% term def="訂閱方案內建額度之外，另外加值付費購買的用量" %}usage credits{% endterm %}，訂閱週額度不再包它
- **API / usage credits 單價**：約 $10 / M input、$50 / M output，大概是 Opus 級的 2 倍

額度可以在這裡查：[Usage 設定](https://claude.ai/settings/usage)
有 credits 需求的，Billing 也一起看：[Billing 設定](https://claude.ai/settings/billing)

這裡再補兩個不是效率問題的邊界。

第一，公司和企業要先確認資料保留與合規限制。Fable 有 **30 天 data retention** 的安全監控要求，不要因為模型能力強就直接上傳客戶個資

第二，高風險資安、生物相關請求，可能被直接降級到其他模型來回答，這段不會用 Fable 價格計費

最後的判斷不是 **Fable 5 比其他模型強，所以全部切過去**
而是這個任務是否真的很複雜，或需要策略發想。

### 省用量小技巧

前面有提到除了使用 `sonnet` `haiku` 等模型幫忙執行
可以省一些 Claude 的使用額度以外

如果你也有訂閱 OpenAI 的 **plus** 或是以上的方案
你也能用 `codex cli` 來分擔 `claude code cli` 的工作

只要安裝 [codex-plugin-cc](https://github.com/openai/codex-plugin-cc)

{% darrellImage800Alt "codex-plugin-cc 安裝說明頁" codex_plugin_for_claude_code.png max-800 %}

就可以在 prompt 提到 `執行時請使用 /codex:rescue 來幫忙執行`
讓 Fable 去調用 Codex 做事情！


### 官方資料參考
- Anthropic Claude Fable 官方頁面：https://www.anthropic.com/claude/fable
- 各方案怎麼用 Fable：https://support.claude.com/en/articles/15424964-claude-fable-5-on-your-plan
- Pro / Team standard 一次性 free credits：https://support.claude.com/en/articles/15862783

<h2 id="faq">常見問題</h2>

{% faq %}
[
  {"question": "Claude Fable 5 是什麼？跟 Opus 差在哪？", "answer": "Fable 5 是 Anthropic 的 Mythos 級公開模型，原本定位在 Opus 之上。2026/07/24 的 Opus 5 推出後，官方 benchmark 顯示不少場景已接近或超越 Fable 5，而且通常更省成本。Fable 仍適合特別長、特別難的硬仗，但日常 agent 任務可以先試 Opus 5。"},
  {"question": "Fable 5 跟 Mythos 5 有什麼不同？", "answer": "兩者共用同一個底層模型。Fable 5 是一般用戶可以用的版本，針對高風險能力多了額外的安全措施；Mythos 5 只開放給通過 Anthropic 審核的組織。在 Claude Code 裡你接觸到的是 Fable 5。"},
  {"question": "Fable 5 限時可用到什麼時候？之後還能用嗎？", "answer": "7/1 到 7/19 的「訂閱內可用」限時優惠已結束。7/20 起：Max 與 premium 席次把 Fable 納入訂閱標準功能，但仍有每週 50% 上限；Pro 與 standard 席次改走 usage credits。模型本身還在，不是下架。"},
  {"question": "Max 方案還有時間限制嗎？", "answer": "沒有時間限制那檔優惠了，但量的限制還在。你可以把最多 50% 的每週用量花在 Fable；燒到上限後，要嘛 credits 續用，要嘛換 Sonnet / Opus。"},
  {"question": "Pro 方案現在怎麼用 Fable？", "answer": "Pro 的訂閱週額度不再包含 Fable，要啟用 usage credits。合格 Pro / Team standard 有一次性 $100 free credits，需在 2026/8/2 前領取，credits 到 9/17 到期。也可考慮升級 Max。"},
  {"question": "什麼任務不該用 Fable 5？", "answer": "單輪問答、小段改寫、已知解法的小 bug、批次格式轉換，這些用 Sonnet、Opus 或直接寫腳本更划算。判斷原則很簡單：任務越長、unknown 越多、越需要驗證，才越值得開 Fable 5。"},
  {"question": "有 Opus 5 了還需要搶 Fable 5 嗎？", "answer": "多數情況不用硬搶。Opus 5 在多項 benchmark 已接近或超越 Fable，成本曲線也常更划算。Max 還有 Fable 額度可以留給最難的長任務；Pro 或 credits 有限的，日常先用 Opus 5 就好。"}
]
{% endfaq %}

## 相關文章

{% articleCard
  url="/claude-code-agent/"
  title="Claude Code Agent 實測，建立專屬的開發助理"
  previewText="想把研究、實作、review 拆給 subagent 分工，先從建立自己的 Agent 開始"
  thumbnail="https://www.darrelltw.com/claude-code-agent/claude_code_agent-bg.jpg"
%}

{% articleCard
  url="/claude-managed-agents/"
  title="Claude Managed Agents 實測教學：建立雲端 AI Agent"
  previewText="不想自己架基礎架構，用 Anthropic 的雲端託管服務跑 Agent"
  thumbnail="https://www.darrelltw.com/claude-managed-agents/blog-claude-managed-agents-bg.jpg"
%}

{% articleCard
  url="/claude-code-new-command-line-tool/"
  title="Claude Code 發佈 Command Line 的新工具"
  previewText="還沒用過 Claude Code？從安裝、指令到價格方案的入門整理"
  thumbnail="https://www.darrelltw.com/claude-code-new-command-line-tool/claude_code.jpg"
%}
