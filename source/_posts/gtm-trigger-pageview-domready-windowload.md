---
title: Google Tag Manager - 觸發條件 網頁瀏覽、Dom就緒、視窗已載入
tags:
  - Google Tag Manager
  - GTM Tutorial
  - GTM 教學
categories:
  - Google Tag Manager
page_type: post
date: 2022-11-21 22:51:08
description: GTM 的觸發條件 - 網頁瀏覽(Page View)、Dom就緒(Dom Ready)、視窗已載入(Window Loaded)三個觸發條件由於非常接近，直接綜合在一起寫，也可以發現說其實這三個觸發條件是有順序關聯的，希望能好好解釋這三者的差異
---

{% darrellImageCover gtm_trigger_pageview_bg gtm_trigger_pageview_bg.png %}

## 順序

{% darrellImage gtm_trigger_demo_preview_sort gtm_trigger_demo_preview_sort.png %}

是否有發現，每當在預覽模式時，這三者的順序其實並不會改變，
只有在網站裝了很多的 GTM 時，會發現有很多個 `Container Loaded`

對照
- Container Loaded : 網頁瀏覽
- DOM Ready : Dom 就緒
- Window Loaded : 視窗已載入


已蓋房子的比喻來說
- Container Loaded : 是開始蓋房子
- DOM Ready : 是房子的隔間已經安排好
- Window Loaded : 像是所有的裝潢完成

{% darrellImage browser_html_domready_windowload browser_html_domready_windowload.png %}
[從 It邦幫忙 引用，重新認識 JavaScript: Day 16 那些你知道與不知道的事件們](https://ithelp.ithome.com.tw/articles/10192175)

這邊比較重要的點而且建議要先了解的
1. 三者的順序關係
2. 預覽模式的 **Container Loaded** = 觸發條件的**網頁瀏覽**

這會對未來在設定相關的觸發條件非常有幫助

## 觸發條件 : 網頁瀏覽

### 時機點

最早的觸發時間點
在工程師的世界中大概就是 GTM 被載入的時間點
大家如果有印象的話，會記得 GTM 的安裝會需要提供一組 Code 或 ID 給工程師或平台

Code :
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TBNSVFB');</script>
<!-- End Google Tag Manager -->
```
ID : `GTM-TBNSVFB`

這邊就是可能的時間點示意圖

{% darrellImage gtm_loading_timing gtm_loading_timing.png %}

如果 GTM 放入的地方就是 `<head></head>` 之間的話，那應該是會比較貼近理想的時機點
只是每個網站和寫法都不盡相同
不會放在一樣的地方就會在一樣的時機點載入，影響的元素很多
包含網站本身的速度，網站其他程式碼載入的數量和他們的載入時間
雖然大部分都會以非同步的方式載入，但都或多或少有影響

當然，最重要的還有**使用者本身的網路環境**
WIFI, 都市中的5G, 山上的4G 就真的是天差地遠

### 應用 (GA4, Facebook Pixel, 各大廣告媒體程式碼)

這個觸發條件算是最有可能被使用也一定會被使用的

一般來說像是設定 GA4 的 Configuration Tag 通常就會選擇這個觸發條件

當然還有很多類似的 Facebook Pixel Code 例如這樣
```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '{your-pixel-id-goes-here}');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none" 
       src="https://www.facebook.com/tr?id={your-pixel-id-goes-here}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
```

還有一些廠商提供的 JS Code 等等
只要是追蹤網頁瀏覽類型的，幾乎都會設定在網頁瀏覽的觸發條件

這邊用 Facebook (Meta) Pixel 來講解除了追蹤網頁瀏覽之外，為何要設定在最早的觸發條件
1. 越快觸發越好，以免使用者開了就馬上關掉網頁 
2. 他定義了一個 fbq 的函示 fucntion 給網頁，這個 fbq 是後面用來追蹤其他**事件**會使用的

Facebook 在追蹤商品瀏覽時
會使用一段程式碼像是
```
fbq("track", "viewContent")
```

但是只要上面 Pixel Code 還沒載入，就沒有 fbq 的函示可以使用，最後就會 error 且沒有蒐集到該事件
這是常常會發生的一個順序問題，只要在安裝時稍加留意這些時機點
應該就能避免掉這些問題

另外請在 GTM 發布後再額外安排一輪完整的測試
**GTM 的預覽模式 和發布後的實際狀況會有一段時間點的落差，有時候在預覽模式沒問題的狀況發布後反而會有問題**

---

## 觸發條件 : Dom就緒 Dom Ready

### 時機點

以工程師的語言來說，就是所有的 Dom 都已經載入完成了

{% darrellImage dom_ready_demo dom_ready_demo.webp %}

以這種圖庫網站當作範例的話
只要紅框處 以及其他大大小小的 Dom (可以想像成一個接著一個的框框)
都排好位置時，就是 Dom Ready 的時機點了
裡面的圖片可能因為網路關係還在慢慢載入，但沒有載入完成沒關係
這網站這次的 
DomReady 時間大約在 15 秒
Window Loaded 大約在 30 秒左右

也就是說後面的圖片陸陸續續多載了 15 秒

### 應用

Dom Ready 的應用以我的經驗來說
通常會在一些 Coding 的範圍內

可能有些追蹤的場景是需要工程師幫忙寫一些 Dom 的 Click Listener 或是其他的 Listener
但這時他們需要對這些元素作綁定
要做綁定就必須得等到元素出現 => Dom Ready 理論上就是幾乎所有網頁元素的出現點

少數的例外就是這個 Dom 是從 Ajax 或其他方式後續載入的，這就沒辦法靠這個觸發條件順利做綁定

---

## 觸發條件 : 視窗已載入 Window Loaded

### 時機點

視窗已載入通常來說就是最慢的時間點了
如剛剛在 Dom 就緒有提到，一個圖庫的網站可以差到 15 秒
但載入快速的網站可能差不到 1 秒

{% darrellImage devtool_check_domready_windowload_time devtool_check_domready_windowload_time.png %}
可以在 Chrome Devtool -> Network 下看到網站在兩個階段的載入時間

### 應用

通常會選到這個觸發條件就是很明確知道某些追蹤場景要等到這個時間點才觸發
或是前面兩個追蹤條件一直會有偶爾搜集不到資料的情況，窮途末路的情況下才會嘗試這個

但其實實務案例上還是算會出現，因為網站真的千百種，為了要搜集到資料真的會什麼方法都嘗試看看
有時候為了增進使用者體驗，也會把一些比較無關緊要的套件或是工具往後放到這裡
例如這個網站有在使用的 OptiMonk
是一個除了跳蓋板的工具外，下方的表單和首頁左側的表單(電腦版)其實也是該工具提供的
這些工具晚點載入就沒有關係


