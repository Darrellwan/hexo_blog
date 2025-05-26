---
title: n8n 踩到坑 - Line Invalid JSON 錯誤
tags:
  - n8n
  - n8n-debug
categories:
  - n8n
page_type: post
id: n8n-debug-line-invalid-json
description: n8n 踩到坑是用來記錄和說明自己和網友在 n8n 上遇到一些常見的 error 或是 bug，並且記錄一下怎麼解決，有哪些方法。這次是關於 Line Message API 中很多人在 n8n 都會遇到 invalid json 的錯誤，最有可能的原因居然就是因為一個符號？
bgImage: blog-n8n-invalid-json-bg.jpg
preload:
  - blog-n8n-invalid-json-bg.jpg
date: 2025-05-10 18:22:12
modified: 2025-05-10 18:22:12
---

{% darrellImageCover blog-n8n-invalid-json-bgblog-n8n-invalid-json-bg.jpg %}

## invalid json

在 n8n 上遇到 `JSON parameter needs to be valid JSON` 或是 `Invalid JSON` 的錯誤？

這真的是蠻多人會發問的問題
在社群上也看到很多人討論
我自己偶爾也會遇到

首先這問題的來源最有可能是因為前面接的 AI Model 來產生文字
**AI產生的格式有時候不太受控**

可能是純文字、JSON、markdown 等等
先來看看幾個常見可能

{% darrellImage800 n8n-line_invalid_json_error_message n8n-line_invalid_json_error_message.png max-800 %}

### 兩個雙引號

n8n 有個快速檢查的方式
通常應該都是用 `expression` 

那其實錯誤時，當下都有完整的 preview 可以看

Expression 右下角的按鈕可以開啟完整的 Expression preview

這時候可以很清楚的看到 Expression 的資料是什麼

{% darrellImage800 n8n-line_invalid_json-double_quotes_issue n8n-line_invalid_json-double_quotes_issue.png max-800 %}

以這個 case 來說，就是 OpenAI 的輸出裡面，已經包含了 `"` 雙引號，而如果我們在外面又用雙引號，就會是 `"" text ""` 
**兩個雙引號就會造成很常見的 invalid json**


### 文字內文包含雙引號

另外一個比較不好發現的情況

是一段文字內，裡面又包含了其他雙引號

{% darrellImage800 n8n-line_invalid_json-double_quotes_between_string n8n-line_invalid_json-double_quotes_between_string.png max-800 %}

例如 ` "輝達落腳"北士科" 地上權都審延遲 北市府竟遭新壽回：無可奉告" `

**北士科** 這幾個字的旁邊多一個雙引號，有時候是 AI 造成的，也有可能是 API 在撈資料時對方的資料就是有這個雙引號存在
那就會一樣造成 invalid json

### 把 Object 直接送出去

{% darrellImage800 n8n-line_invalid_json-send_object_as_object_object n8n-line_invalid_json-send_object_as_object_object.jpg max-800 %}

有時候可能因為 AI 的 output 不穩定，也有可能是人為因素用錯變數
導致其實會看到 **[object Object]**

這也是個常見的問題

{% darrellImage800 n8n-line_invalid_json-send_object_as_object_object_check_input n8n-line_invalid_json-send_object_as_object_object_check_input.png max-800 %}

建議可以回頭看看是不是 input 選錯，可以仔細觀察

{% darrellImage800 n8n-line_invalid_json-n8n_input_type n8n-line_invalid_json-n8n_input_type.png max-400 %}

像是 input schema 左邊都有個小小的 icon 表示他的 type 是什麼
以 Line 的 Push Message API 來說，都要用 String 的形式來送出比較不會出錯

### 用網站來檢查可能的錯誤原因

如果你檢查過上面的幾個常見錯誤，還找不到原因的話

這時候就建議找一些好用的工具來檢查

關鍵字 `JSON validator online`

[JSONLint](https://jsonlint.com/)
[jsonformatter](https://jsonformatter.curiousconcept.com/)

記得不是複製用 expression 的那格，而是預覽好的那格

{% darrellImage800 n8n-line_invalid_json-check_json_validate_online n8n-line_invalid_json-check_json_validate_online.png max-800 %}

有錯誤的話通常網站都會檢查到，並且告訴你是哪一行的第幾個字出錯

## 在 n8n 修正 json invalid

### toJsonString()

`toJsonString()` 是個不錯的內建 function

會多轉換一次字串資料

{% darrellImage800 n8n-line_invalid_json-solution-to_json_string n8n-line_invalid_json-solution-to_json_string.png max-800 %}

效果如下

`輝達落腳"北士科" 地上權都審延遲 北市府竟遭新壽回：無可奉告`

after `toJsonString()`

`"輝達落腳\"北士科\" 地上權都審延遲 北市府竟遭新壽回：無可奉告"`

除了字串的前後加上了雙引號，還會**Escape**字串內的雙引號

上面有提過

` "textext"aaa"textext" ` ❌ 這樣不行，裡面又出現雙引號

但如果是

` "textext\"aaa\"textext" ` ✅ 這樣OK，因為雙引號被Escape了

### replaceAll()

另一種做法是，當你發現 input 進來的資料無論如何都包含了雙引號，你想要直接把它移除掉的話

可以使用 `replaceAll()` 

`"{{ $json.title.replaceAll('"', '') }}"`

{% darrellImage800 n8n-line_invalid_json-solution-replace_all n8n-line_invalid_json-solution-replace_all.png max-800 %}






