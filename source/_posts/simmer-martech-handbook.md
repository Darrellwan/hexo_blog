---
title: Simmer 的 Martech Handbook 簡介&心得
tags:
  - Martech
categories:
  - Martech
page_type: post
id: simmer-martech-handbook
bgImage: simmer-martech-handbook.jpg
date: 2024-03-02 22:43:13
description: Simmer 發布了一份最新的 Martech Handbook，內容涵蓋行銷科技和數位行銷完整的相關知識，整體的深度和廣度都具備。適合每個或多或少有接觸相關領域，或是對 Martech 有點興趣的人都可以來閱讀和學習
---
<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

{% darrellImageCover simmer-martech-handbook simmer-martech-handbook.jpg max-800 %}

<a href="https://handbook.teamsimmer.com/"><i class='bx bx-link-external bx-flashing-hover' > Simmer - Martech Handbook </i></a>

Simo Ahava 是我開始接觸 Google Tag Manager 後從他學習到很多的一個神人
後續看到他開始自己的事業並開始開課教學非常專業的相關知識都非常厲害

想不到他在2024的最近發布了一份免費且內容豐富的 Martech Handbook
內容包含無論是行銷科技還是數位行銷都涵蓋的內容

## 章節介紹

{% darrellImage800 simmer-martech-handbook-chapters simmer-martech-handbook-chapters.png max-800 %}

主軸是想要多解釋這些日常在行銷科技或數位行銷接觸到的專業和工具中
嘗試帶大家多了解每個項目的運作原理和一些技術上的介紹

這樣可以避免自己只會一直只使用已知的功能和模式
如果多加理解裡面的原理知識，就可以融會貫通將更多的功能結合並產生更完整的解法

章節中包含 
<i class='bx bx-sm bx-group dar-primary-color' ></i> Martech 或 Technical Marketer 的介紹和其可能或需要具備的知識和能力
<i class='bx bx-sm bxl-chrome dar-primary-color' ></i> 網頁的瀏覽器是如何運作的，什麼是 request，Cookie 等等
<i class='bx bx-sm bx-info-square dar-primary-color'></i> SEO 的原理，爬蟲如何爬取網頁內容並索引、結構化資料和網站性能的重要性
<i class='bx bx-sm bx-microchip dar-primary-color' ></i> 網站追蹤或埋點、什麼是 TMS，DataLayer 的介紹
<i class='bx bx-sm bxs-data dar-primary-color'></i> 資料分析和資料工程的簡介
<i class='bx bx-sm bxl-meta dar-primary-color'></i> 數位廣告和受眾
<i class='bx bx-sm bx-bong dar-primary-color'></i> CRO的概念介紹和工具
<i class='bx bx-sm bxs-window-alt dar-primary-color'></i> 程式語言和網站開發，JavaScript 以及 SQL
<i class='bx bx-sm bxs-mask dar-primary-color'></i> 隱私權和資料安全

後面會開始嘗試記錄自己讀完的心得或加上一些相關的經驗分享
並不會直接分享出裡面的內容，希望有興趣的人還是可以進到 Martech Handbook 裡慢慢的把它完整讀過
該網頁並沒有會員登入機制，讀書的進度會直接存在該瀏覽器
所以換了瀏覽器並不會記得你讀到哪裡喔!
<a href="https://handbook.teamsimmer.com/"><i class='bx bx-link-external bx-flashing-hover' > Simmer - Martech Handbook </i></a>

## Technical Marketer

technical marketer and digital marketer

兩者一直都是在大部分接近的角色
但數位行銷人更擅長於利用創意來使用行銷工具
而科技行銷人更懂的行銷工具背後運作的邏輯和工具之間的串接
隨著時代技術的進步，兩者雖然都很重要，但相信很多人都會感受到不同的行銷工具推陳出新
每一兩年就會出現一個很大的新名詞，常常只是對這名詞有點印象，還沒來得及真的搞清楚和好好利用時
新的名詞和工具又出現了 

Technical Marketer 
在現在越來越多行銷工具的結合和使用
相信企業端會越來越重視行銷科技的結合和推動，
如何讓行銷結合科技，帶給企業更好的資源利用並為使用者帶來更良好的體驗接觸

## Web Browser & Cookie

文中有提到網址的組成
以及常常會被問到的 : 主網域和子網域怎麼辨認

有趣的是也提到了瀏覽器是如何解析一個網址的
1. .com
2. domain
3. sub-domain

**瀏覽器和網站本身是沒有狀態和記憶資訊的**

可以儲存資料的方式
1. Cookie
2. LocalStorage
3. SessionStorage

Cookie 不僅儲存資料，還是 request 的一部分，
幫助服務器識別用戶身份。近年來，隨著隱私權議題上升，
**First Party Cookie、Third Party Cookie 和 Cookie Consent** 變得更加重要。
這些變化凸顯了人們對於瀏覽器儲存資料的關注，無論是分析目的、記住登入狀態，還是廣告再行銷

Cookie 除了存資料以外，還會被 request 夾帶成資訊的一部分
這也是 server 回傳資料時會知道是誰或是什麼身份來區分不同的資訊

相信每個資訊和功能都是有好有壞，只是現在開始網站需要將選擇權還給使用者
使用者可以決定要不要被追蹤相關的紀錄
以廣告 Cookie 來說，當然使用者都可以不要被廣告 Cookie 追蹤
但這不等於你不會看到所有的廣告，廣告的版位依然存在很多網站的任何地方
只是顯示的廣告可能和你先前的瀏覽行為沒有關係

## SEO

**SEO** 除了帶來自然流量和網頁排名以外
其實更像是網站的招牌和整體門面

你的招牌辨識度是否夠高、是否能充分說明品牌帶來的商品和服務、網站內的陳列是否乾淨清楚等等
就像是在逛賣場時要是他的商品擺列很凌亂又沒有規則，可能要找個商品就得在同一區塊繞兩三圈才會找到

自己的想法是 SEO 像是運動和養身的概念，你得一直維持網站的機能和健康，他才會有更好的體質來服務使用者
絕對不是一個短期計畫的專案後就可以再也不管，
前面提到的瀏覽器和網頁相關技術都在推陳出新，使用者的習慣或裝置也會大為改變
(Apple Vision Pro 和臉書以及 HTC 的 VR 裝置未來慢慢普及的情況下，可以想像網站的設計和動線也會有不小的改變)

**結構化資料**是一個非常重要的 SEO 語法
他會讓瀏覽器更知道這個頁面資訊的內容，可能也會在搜尋頁面上呈現對應的資訊
例如食譜的網頁上加上食譜相關的結構化資料，就會像是圖片上在結果中多呈現了步驟的資料

結構化資料並不保證會讓你的網頁排名等成效更好，但一定會增加使用者想要點擊你網頁的機率

網頁速度一直是影響網站表現的一大因素
文中提到以 Amazon 為例只要進步 100 毫秒就可以為收入帶來巨大的改變

**網站速度**對於網站表現至關重要。
舉例來說，Amazon的研究顯示，網站速度每提升100毫秒，就能顯著增加收入。
優化網站速度是一個持續的過程，涉及不斷的評估和改進。
雖然新功能和套件可以提升用戶體驗，但也可能增加加載時間，因此需要平衡速度與功能。

## Tagging

這裡的 Tagging 也就是我們常說的 **安裝追蹤碼 埋碼 埋點 裝code** 等等

每個平台或廣告媒體都會有自己的一套追蹤碼來追蹤使用者的行為
並根據這些行為來區分使用者或遞送相對應的內容

以 GA4 為例，以前的 UA 頂多只能追蹤 page_view
現在的 GA4 是預設可以追蹤到 scroll 90% 的瀏覽深度
檔案下載、外部連結點擊等等的事件了

文章中也有提到 **Tag** 並不是單純的一小段程式碼而已，他可以蒐集到的資料有時候是超出想象的
像是瀏覽器資訊，IP和可能的地理資訊等等，知道有哪些資料可以取得
並且在使用者知情的情況下搜集，就可以在很多行銷場景上做活用

自己對於 **dataLayer** 簡單想到的兩大優點
1. 追蹤到事件發生的精準時機(例如表單送出成功)
2. 獲取很多網頁上不會有的資料(例如商品其他欄位，但沒有顯示在網頁上)

例如 GA4 和 **GTM** 由於都是 Google 的平台，所以 Google 有一套自己的 dataLayer 命名和格式
以加入購物車為例

<a href="https://www.darrelltw.com/ga4-ecommerce-recommend-events-datalayer/"><i class='bx bx-link'></i>  GA4 電子商務的建議事件說明 & DataLayer 規格</a>

```
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "add_to_cart",
  ecommerce: {
    currency: "{幣別}",
    value: { 價格 },
    items: [
      {
        item_id: "{商品ID}",
        item_name: "{商品名稱}",
        affiliation: "{商品聯盟(如沒有，可以直接填自家店商網站名稱)}",
        currency: "{幣別}",
        discount: { 折扣金額 },
        item_brand: "{商品品牌}",
        item_category: "{商品分類第一層}",
        item_category2: "{商品分類第二層}",
        item_category3: "{商品分類第三層}",
        item_category4: "{商品分類第四層}",
        item_category5: "{商品分類第五層}",
        item_variant: "{商品詳細資料，如尺寸或顏色}",
        price: { 價格 },
        quantity: { 數量 }
      },
    ]
  }
});
```
如果後面要開始安裝 **Meta Pixel** 時，他們要的格式為
```
<script>
    fbq('track', 'AddToCart', {content_ids: ["{商品ID}"]});
</script>
```  

幾個比較大的差異
1. 事件名稱一個是 add_to_cart 和 AddToCart
2. GA4的商品 ID 在 ecommerce 裡面的 items 的 item_id 並且是字串格式 `"商品ID"`
但在 Meta Pixel 稱為 content_ids 並且要放在陣列格式 `["商品ID"]`

這樣看似會很麻煩，其實上面提到的TMS中可以透過改寫的方式來達成，
就不用請工程師要放很多種不同的 dataLayer 格式來部屬

自己的經驗中其實 Google 這套還是有缺少一些蠻重要的欄位
例如商品的連結和圖片網址
雖然 Google 和 GA4 並不在意這些欄位，但有些像是**行銷自動化**的工具
他會發送 Email, WebPush, AppPush 等渠道時，就會需要這些圖片的欄位和網址來讓喚醒使用者

## Data

這一章節介紹了類似像 **Google Analytics** 這樣的分析系統
從蒐集資料到呈現資料時大概經過了哪些重要的步驟
其實也跟文中提到的一樣，很像是一個 **Data Pipeline**

Google 雖然佛心的提供了免費的 GA4 給大家使用，也開放了串接 BigQuery 把原始資料儲存和提取
但在每天這麼大量的資料蒐集和處理時，裡面厲害的系統架構師和工程師就得確保這些資料都能夠被處理
並保證系統的穩定性
以轉換的歸因來說，為何可能都得等到隔天的中午或下午才會看到前一天的歸因數據
透過本文其實可以更能理解 Google 在背後其實處理哪些項目，而且歸因是需要計算的，所以才會需要更久的時間來做呈現

如果公司有完整的資料科學家和資料處理分析部門
這些部門所接觸到資料就會是最全面完整的資料
例如網站上的資料，線下的資料，ERP或CRM資料等等
我覺得這些資料可以幫助你在和資料分析部門合作時，更能好好地描述你想要的資料是什麼
或是今天你想要做一份分析，你更容易去思考**資料的來源或組成**可能是什麼

以自己之前在企業端服務的經驗，那時候就很常會需要和PM跟資料部門一起協作
我會負責講解線上的行為資料目前蒐集到哪些，也去理解資料部門是用哪些資料來做線上跟線下的整合
一起找出資料該如何合併並完成PM們想像的分析結果或是提供一些數據上的洞察

ServerSide Tracking 這幾年也是一個重要的課題
像是 Meta 的 Conversion API 
Google Ads 的 Enhanced Conversion
就是希望大家多提供使用者的加密資訊來做到更好的比對

## Digital Ads

數位廣告相信是大部分人比較熟悉的領域了
文中提到的**關鍵字廣告**也是大部分人一定會操作的廣告形式

字組是否會符合使用者搜尋該關鍵字的意圖
並提供相對應的內容或產品
**競價**的概念也是廣告很有趣的一個環節
好不容易出現在搜尋列表頁中，要吸引使用者點擊又是另一個課題

幾個比較重要的關鍵字 
**RTB、SSP、DSP**
也找到另一個在說明這個概念的影片
<iframe width="560" height="315" src="https://www.youtube.com/embed/-Glgi9RRuJs?si=nXVptJueRPupllOG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

廣告的種類也是推陳出新，
例如抖音等短影片的興起，讓影片廣告也開始需要布局短影音的廣告型態，在幾秒鐘到15秒之間就要抓住使用者的注意並傳遞訊息

廣告受眾的來源最簡單的區分方式就是站內跟站外
當然有一小部份的人會跨足兩邊
站外的受眾就是透過一些基本資訊或興趣去結合
站內的受眾就是在自己的網站內產生行為的使用者
兩者在策略上跟目標都會不太相同，但最終的目的當然都是希望讓使用者消費或達成特定行為

裡面也介紹到了像是 Facebook Google 如何跨網站的追蹤使用者行為
便能精準地知道使用者到底看過哪些內容，對哪些商品有興趣，或是已經購買了哪些商品等等

