---
title: Google Tag Manager - 代碼(Tag) GA4 Field To Set 設定事件參數
date: 2022-10-04 19:15:36
tags: 
	- Google Tag Manager
	- Google Analytics 4
description: 當決大部分的 GA4 Event 都需要設定相同的 Event Parameter 時，利用 Field To Set 可以只設定一次就解決 !
categories: 
	- Google Tag Manager
page_type: post
---

{% darrellImageCover introduce_field_to_set ./introduce_field_to_set.png %}

---

# User Property 的限制

有些時候因為特殊場景，發現到少數幾個參數幾乎在全部的事件都會需要被追蹤
但又因為一些先天上的限制導致無法使用 User Property

{% darrellImage ga4_user_property_limit ./ga4_user_property_limit.png %}

GA4 User Property 的長度限制 :
Key - 24 字元
Value - 36 字元

24字元就是 A 打到 Z 再扣掉 YZ
```
abcdefghijklmnopqrstuvwx
```

36字元就是 A 打到 Z 後再加上 ABCDEFGHIJ
```
abcdefghijklmnopqrstuvwxyzabcdefghij
```

---

# 大量使用 Event Parameter

開始在每個 Event 加上一個特定的 Parameter 後

一但數量超過 10 個或是 20 個

設定起來就會覺得非常繁瑣

這時發現到如果一開始的 GA4 Configuration 使用 Field To Set，看起來就可以一勞永逸

---

# Field To Set

{% darrellImage field_to_set ./field_to_set.png %}

[Google 官方文件連結](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters?client_type=gtag)

Field To Set 在 GA4 Configuration 的下方

UserId 也是在這裡設定

範例中填入兩個參數，其中一個是固定的值，另一個是讀取 Cookie

{% darrellImage check_event_parameter ./check_event_parameter.png %}

Preview 後就可以發現，送出去的每個 Event 都會包含這兩個參數了

未來就不用再每個事件上單獨設定 !
