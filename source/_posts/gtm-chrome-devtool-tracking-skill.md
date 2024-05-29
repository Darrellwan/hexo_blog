---
title: Chrome Devtool 在追蹤上的一些特殊技巧
tags:
  - Google Tag Manager
  - Google Chrome
categories:
  - Google Tag Manager
page_type: post
id: gtm_chrome_devtool_tracking_skill
description: description
date: 2024-05-29 19:30:48
bgImage: gtm-get-datalayer-value-by-js-bg.jpg
---


## 讓網頁的連結暫時不要跳轉到下一頁

有時候我們想要追蹤**連結**的點擊，但有時候因為他點了就會換到下一頁
無法好好檢視我們追蹤的程式碼或是狀態等等是否如預期執行
這時候就可以用下面的程式碼貼在 Chrome Devtool -> Console 中就

就會在點擊連擊的當下跳出一個 confirm 視窗，選否就不會跳轉到下一頁了

```
window.onbeforeunload = function(){ 
   return "Tracking?"; 
};
```

{% darrellImage800 put_code_in_console_for_block_alink put_code_in_console_for_block_alink.png max-800 %}

{% darrellImage800  {% darrellImage800 put_code_in_console_for_block_alink put_code_in_console_for_block_alink.png max-800 %}.png max-800 %}

## 快速測試 CSS Selector
```
$$("Your_css_selector")
```

CSS Selector 在 Google Tag Manager 中是一個很重要的技巧
他可以讓我們在一個 Selector 選擇到多個元素
而不是要針對每個元素都建立一個 Trigger 來對應

在 Chrome Devtool 中也不用每次都要打落落長的
`document.querySelectorAll("Selector")` 來測試自己目前的 Selector 對不對
可以輕鬆地使用
`$$("Selector")` 就能達到一樣的效果

{% darrellImage800 demo_of_using_$$_to_test_css_selector demo_of_using_$$_to_test_css_selector.png max-800 %}

## 快速使用上一個指令

那如果我想要在 Devtool 的 console 中快速使用我上一個指令
就只需要在 console 中按 **方向鍵上**
就能快速選到上一個指令
也可以持續多按幾下，就會逐一跑出來剛剛使用過的

{% darrellImage800 select_last_command_in_chrome_devtool select_last_command_in_chrome_devtool.gif max-800 %}
