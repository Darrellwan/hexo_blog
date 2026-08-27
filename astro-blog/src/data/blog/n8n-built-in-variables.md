---
title: n8n 內建變數 expression 解析 - $input、$json 使用陷阱與技巧
pubDatetime: 2025-01-24T21:58:52+08:00
description: n8n 內建變數 expression 攻略！深入解析 $input、$json、$workflow 參數的使用陷阱、常見錯誤與進階技巧。實測分享變數呼叫最佳實踐，避開新手常踩的雷。
tags:
  - n8n
  - n8n 教學
categories:
  - n8n
page_type: post
id: n8n-built-in-variables
preload:
  - n8n_builtin_variables_bg.jpg
slug: n8n-built-in-variables
bgImage: n8n_builtin_variables_bg.jpg
ogImage: n8n_builtin_variables_bg.jpg
legacyAnchors: true
---

{% darrellImageCover n8n_builtin_variables_bg n8n_builtin_variables_bg.jpg max-800 %}

## $input

`{{ $input }}` 是當前節點的輸入資料

{% darrellImage800 n8n_builtin_variable_input n8n_builtin_variable_input.png max-400 %}

介紹幾個常用的 function

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $input.all() }}`</a>
  取得所有輸入的資料陣列

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $input.first() }}`</a>
  取得第一筆輸入的資料

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $input.last() }}`</a>
  取得最後一筆輸入的資料
  
- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $input.all().length }}`</a>
  取得輸入資料的總數量

曾經用過的場景: 陣列資料被 Filter 過濾後只剩下 0 筆，這時 workflow 會停止在這個節點
但你如果想要接續下去，例如通知自己沒有資料符合條件
就要在 Filter 節點開啟 `Always Output Data` 選項
這時會往後丟一個 `[{}]` 的資料
但直接用 `{{ $input.all().length }}` 會得到 1
因為 `[{}]` 是一個 長度1 但包含空物件的陣列

這時就可以用 `{{ $input.all().filter(item => item.json && Object.keys(item.json).length > 0).length }}` 來篩選得到 0
- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $input.all().filter(item => item.json && Object.keys(item.json).length > 0).length }}`</a>


{% darrellImage800 n8n_builtin_variable_item_length_use_in_filter n8n_builtin_variable_item_length_use_in_filter.webp max-800 %}

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $input.item.json }}`</a>
  取得當前項目的 JSON 資料

## $json

`$json` 其實就是上方 `$input.item.json` 的縮寫
可能是因為太常用掉，n8n team 把 $json 獨立出來當作一個變數減少大家麻煩 👍👍👍

通常需要選擇資料的某一項欄位時，直接從左方拖進來
就會是 `$json` 開頭的變數，如圖:

{% darrellImage800 n8n_builtin_variable_json n8n_builtin_variable_json.png %}

{% darrellImage800 n8n_builtin_variable_json_parameters n8n_builtin_variable_json_parameters.webp max-800 %}

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $json.toJsonString() }}`</a>
- 將 JSON 物件轉換為 JSON 字串格式

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $json.keys() }}`</a>
- 獲取 JSON 物件的所有key，返回key的陣列

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $json.values() }}`</a>
- 獲取 JSON 物件的所有value，返回value的陣列

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $json.urlEncode() }}`</a>
- 將 JSON 物件進行 URL 編碼，便於用於查詢參數

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $json.isNotEmpty() }}`</a>
- 檢查 JSON 物件是否不為空

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $json.isEmpty() }}`</a>
- 檢查 JSON 物件是否為空

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $json.hasField("name") }}`</a>
- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $json.hasField("orderId") }}`</a>
- 檢查 JSON 物件是否包含特定欄位

{% darrellImage800 n8n_builtin_variable_json_hasfield n8n_builtin_variable_json_hasfield.webp max-800 %}

可以用在 Filter 節點過濾掉沒有特定欄位的資料



## $workflow

`{{ workflow }}` 是當前 workflow 的相關資訊

{% darrellImage800 n8n_builtin_variable_workflow n8n_builtin_variable_workflow.png max-400   %} 

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{% raw %}{{ $workflow.id }}{% endraw %}`</a>
  workflow 的 id

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{% raw %}{{ $workflow.name }}{% endraw %}`</a>
  workflow 的名稱

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{% raw %}{{ $workflow.active }}{% endraw %}`</a>
  workflow 是否啟用

---

## $execution

`{{ $execution }}` 是當前執行的相關資訊

{% darrellImage800 n8n_builtin_variable_execution n8n_builtin_variable_execution.png max-400   %}

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{% raw %}{{ $execution.id }}{% endraw %}`</a>
  當前執行的唯一識別碼

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{% raw %}{{ $execution.mode }}{% endraw %}`</a>
  工作流程當前所屬的執行模式

  **執行模式的差異：**
  Test: 測試
    - 用於測試和開發階段
    - 需要手動觸發執行
    - 執行數據可選擇是否保存

  Production: 正式(Active)
    - 用於自動運行的工作流程
    - 工作流程需設置為"活躍"狀態
    - 可由內部或外部事件自動觸發
    - 執行數據的保存可在設置中配置

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{% raw %}{{ $execution.resumeUrl }}{% endraw %}`</a>
  用於在工作流程中等候時恢復執行的網址(例如 Wait 節點)

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{% raw %}{{ $execution.resumeFormUrl }}{% endraw %}`</a>
  用於在表單提交後恢復執行的網址

## $today

用於取得當天 00:00:00 的時間戳

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $today.format("yyyy-MM-dd") }}`</a>
  可以取得當天 YYYY-MM-DD 的日期
  
{% darrellImage800 n8n_builtin_variable_today n8n_builtin_variable_today.png max-400 %}

### 取得民國的年月日

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this)">`{{ $today.minus(1911, "years").format('y.MM.dd') }}`</a>
  目前遇過的 API 中有極少數需要帶入的是台灣的民國年月日，這時在 n8n 也可以輕易取得
  利用 minus 扣掉 1911 年就可以取得民國
  並把 format 改為 y 取年份 , yyyy 會取得 0114 還要額外處理

{% darrellImage800 n8n_builtin_variable_today_roc_date n8n_builtin_variable_today_roc_date.png max-400 %}

---

## $runIndex

`{{ $runIndex }}` 是當前執行的索引值，從 0 開始
適合用在 Loop 後面的節點中，取得目前跑到第幾筆

{% darrellImage800 n8n_builtin_variable_runIndex n8n_builtin_variable_runIndex.png max-400 %}

---

## $prevNode

`{{ $prevNode }}` 是當前節點的前一個節點的相關資訊

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this, '{{ $prevNode.name }}')">`{{ $prevNode.name }}`</a>
  前一個節點的名稱

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this, '{{ $prevNode.outputIndex }}')">`{{ $prevNode.outputIndex }}`</a>
  前一個節點的輸出索引

  **輸出索引的含義：**
  - 表示前一個節點的輸出連接器的索引。
  - 用於多輸出節點（如 If 或 Switch 節點）時，告訴你當前輸入來自哪個輸出連接器。
  - 索引從 0 開始，第一個輸出連接器的索引是 0，第二個是 1，以此類推。
  - 在 Merge 節點中，`$prevNode.outputIndex` 始終返回 0，因為 Merge 節點總是使用第一個輸入連接器的數據。

  - 如圖所示: 
{% darrellImage800 n8n_builtin_variable_prevNode n8n_builtin_variable_prevNode.png max-400 %}

- <a class="copyable" href="javascript:void(0);" onclick="copyCode(this, '{{ $prevNode.runIndex }}')">`{{ $prevNode.runIndex }}`</a>
  前一個節點的執行索引
  - 用在 Loop 就會隨之增加，一樣從 0 開始
  
---

{% raw %}
<div id="copyNotification">複製成功！</div>
<style>
  li a.copyable {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="24" height="24" fill="white" stroke="none"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>') 12 12, copy;
    position: relative;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .copy-icon {
    width: 16px;
    height: 16px;
    opacity: 0.6;
    transition: all 0.3s ease;
  }

  .copyable:hover .copy-icon {
    opacity: 1;
    transform: scale(1.1);
  }

  .copy-icon-hover {
    position: absolute;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .copyable:hover .copy-icon-hover {
    opacity: 1;
  }

  .copyable:hover .copy-icon-default {
    opacity: 0;
  }

  #copyNotification {
    position: absolute;
    background-color: rgba(76, 175, 80, 0.85);
    color: #FFFFFF;
    padding: 4px 10px;
    border-radius: 3px;
    font-size: 12px;
    display: none;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  #copyNotification.show {
    opacity: 1;
    transform: translateY(0);
  }
</style>

<script>
    const copyIconTemplate = `
      <div class="icon-container">
        <svg class="copy-icon copy-icon-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg class="copy-icon copy-icon-hover" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      </div>`;

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.copyable').forEach(element => {
            element.insertAdjacentHTML('afterbegin', copyIconTemplate);
        });
    });

    function copyToClipboard(element, text) {
        navigator.clipboard.writeText(text).then(function() {
            showNotification(element);
        }, function(err) {
            console.error('複製失敗', err);
        });
    }

    function copyCode(element) {
        const text = element.querySelector('code').textContent;
        navigator.clipboard.writeText(text).then(function() {
            showNotification(element);
        }, function(err) {
            console.error('複製失敗', err);
        });
    }

    function showNotification(element) {
      var notification = document.getElementById('copyNotification');
      var rect = element.getBoundingClientRect();

      notification.style.position = 'absolute';
      notification.style.top = (rect.top + window.scrollY) + 'px';
      notification.style.left = (rect.right + 10 + window.scrollX) + 'px';

      notification.style.display = 'block';
      requestAnimationFrame(() => {
        notification.classList.add('show');
      });

      setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() {
          notification.style.display = 'none';
        }, 300);
      }, 2000);
    }
</script>
{% endraw %}