---
title: n8n If 和 Switch 節點教學 - 條件判斷完整指南
tags:
  - n8n  
  - n8n節點介紹
  - n8n教學
categories:
  - n8n
page_type: post
id: n8n-if-switch
description: 完整 n8n If 和 Switch 節點教學指南，包含條件判斷設定、實用案例演示、常見錯誤排除。實測分享自動化工作流程中條件邏輯的最佳實踐。
bgImage: n8n-If_Switch_bg.jpg
preload:
  - n8n-If_Switch_bg.jpg
date: 2024-12-12 11:46:24
---

{% darrellImageCover n8n-If_Switch_bg n8n-If_Switch_bg.jpg %}

這是要介紹的兩個 Node 分別是 If 和 Switch

寫程式的人應該對這兩個詞不太陌生
都是用在**條件判斷**的時候

舉幾個例子
今天要吃什麼午餐 -> 是個開放性的問題
今天午餐要不要吃麥當勞 -> Yes or No -> **If**
今天午餐吃麥當勞還是肯德基 -> 二選一 -> **Switch**

## If 節點
{% darrellImage n8n_if-case n8n_if-case.png max-400 %}

n8n 中的 If 就是單純用來判斷 條件有沒有符合
條件的設定如下:
{% darrellImage n8n_filter-setting_rule n8n_filter-setting_rule.png max-800 %}

方法非常直覺，選擇要判斷的欄位和值
{% darrellImage n8n_filter-setting_rule_demo n8n_filter-setting_rule_demo.png max-800 %}

先觀察前面的節點會傳什麼資料過來
再決定你要判斷哪個欄位
並加上判斷的條件

形態有分成字串、數字、布林值、陣列、物件和日期
請先觀察你想要比較的欄位在截圖 Step 1 其實都會顯示那個欄位是什麼**型態**

{% darrellImage n8n_filter-how_to_check_type n8n_filter-how_to_check_type.png max-400 %}

可以稍微記得一下他們的 icon
(截圖這邊用 JSON 示範資料會先把日期當成 String
所以顯示 String 的 icon)

### Convert types where required

這個選項是說如果你想要比對的型態，和原始資料的型態不一樣
n8n 會**嘗試**自動幫你轉換
轉的過去就會成功，轉不過去就填海

這裡分享一個示範關於有沒有勾選的差異
{% darrellImage n8n_filter-convert_type n8n_filter-convert_type.png max-800 %}


### Ignore case

這個選項就很好理解
選擇的話，就會忽略大小寫

{% darrellImage n8n_filter-ignore_case n8n_filter-ignore_case.png max-800 %}

舉一個例子
有些系統在搜集 Email 時是會區分大小寫的
但其實 Email 本身是沒有大小寫之分

所以今天名單裡面如果他存的是 `Test@test.com`
但你可能直覺要比對 `test@test.com`
這時沒勾選 Ignore case 就會判斷為 False 造成錯誤

## Switch 節點

If 單純判斷是或否
Switch 則是多個選項(規格)的判斷

{% darrellImage n8n_switch-show_case n8n_switch-show_case.png max-400 %}
圖例接續上面的範例資料
今天餐廳有Google評分，想要篩選出某個分數以上的餐廳

目前的餐廳分數是 4.8
設定了規則
1. 大於 4.5
2. 大於 4.0
3. 其他

Switch 的運作原理為
從第一個規則開始往下判斷
(預設) 如果遇到符合的，就往下走符合的 output

也可以透過選項 `Send data to all matching outputs` 來走全部符合的 output

### Send data to all matching outputs

直接用圖片示範有勾選和沒勾選的差異，

{% darrellImage n8n_switch-output_all_matched_rules n8n_switch-output_all_matched_rules.png max-800 %}

舉個例子: 前方判斷的資料為
使用者願意接收通知的渠道
✅ Email 
✅ Line
❌ 簡訊
✅ Push

如果勾選 Send data to all matching outputs
使用者就會在這些渠道都收到新的消息
而只有簡訊不會寄出





