---
title: Google Optimize 建立實驗與透過 Google Tag Manager 來安裝
tags:
  - Google Tag Manager
categories:
  - Google Tag Manager
page_type: post
date: 2023-01-19 21:13:06
description: 免費的 AB 測試工具中，Google Optimize 一直都是個不錯的選擇。除了簡單介紹實驗的建立以外，會提到如何使用 Google Tag Manager 安裝和串接 Google Analytics 4 來查看數據。
---

{% darrellImageCover GoogleOptimize安裝教學 google_optimize_install_and_connect_ga4_bg.webp max-800 %}

> 圖片來源 : 水墨 PNG圖片素材由ginny001设计 [link](https://zh.pngtree.com/freepng/2023-year-of-the-rabbit-chinese-new-year-ink-rabbit_8817015.html?sol=downref&id=bef)

## AB Test

AB 測試以簡單的方式來闡述的話，我們創造出兩個或多個以上的版本，並隨機分配來觀察**哪一個版本更符合我們的期待**

所以首先，我們得先知道想要改善或提升的目標是什麼，這樣才知道哪個版本的效果比較好

以下方圖片舉例:

我們可以優化的目標可能有 

1. 文章排版是否影響使用者閱讀完整文章的意願
2. 文章排版是否影響使用者按讚或評論的意願

每次一個實驗盡量以少量目標為基礎就好，太多的目標和變數將會使整個實驗更難去確認成效

{% darrellImage800 簡易的AB測試示意圖 ab_test_with_variant.png max-800 %}

## 常見的 AB 測試工具

- [👆 Optimizely](https://www.optimizely.com/)
- [👆 VWO](https://vwo.com/)
- [👆 Google Optimize](https://optimize.google.com/optimize/home/)
- [👆 Adobe Target](https://business.adobe.com/tw/products/target/adobe-target.html)
- [👆 AB Tasty](https://www.abtasty.com/)

這邊提到的工具大部分都是付費版沒錯，不過有興趣想使用或挑選的大家也可以先看看這些耳熟能詳的工具究竟厲害在哪，
如果只是想一開始試用免費版工具來測試看看，也可以比較知道大家功能上的差異或是使用起來順手程度

## Google Optimize vs Google Optimize 360

[官方文件](https://support.google.com/optimize/answer/7084762?hl=en#)
下表將兩者皆可項目剔除，只保留差異項目並使用 Google 翻譯

很明顯**付費版就是在一些目標和實驗等數量上有更多可以使用**，適合大公司有多部分或多網站需求要同時進行時能一起支援並測試。  

<table class="nice-table">
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Optimize</font></font></th>
      <th class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Optimize 360</font></font></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">專為...</font></font></th>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">中小型企業開始嘗試</font></font></td>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">具有更複雜測試需求的大型企業和企業</font></font></td>
    </tr>
    <tr>
      <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">GA受眾</font></font></th>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">–</font></font></td>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">V</font></font></td>
    </tr>
    <tr>
      <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">多變量測試 (MVT)</font></font></th>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">多達 16 種組合</font></font></td>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">多達 36 種組合</font></font></td>
    </tr>
    <tr>
      <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">實驗目標</font></font></th>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">最多 3 個預配置</font></font></td>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">最多 10 個預配置，</font></font><br><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
      啟動後可額外使用</font></font></td>
    </tr>
    <tr>
      <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">同時實驗</font></font></th>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">最多 5 個</font></font></td>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">超過 100*</font></font></td>
    </tr>
    <tr>
      <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">同時個人化</font></font></th>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">高達10</font></font></td>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">超過 100*</font></font></td>
    </tr>
    <tr>
      <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">管理</font></font></th>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">無限用戶的基本管理</font></font></td>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Analytics 360 全方位套件管理</font></font></td>
    </tr>
    <tr>
      <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">實施服務</font></font></th>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">–</font></font></td>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">V</font></font></td>
    </tr>
    <tr>
      <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">支持與服務</font></font></th>
      <td class="align-center">
      <p><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">自助服務中心和</font></font><br><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
        社區論壇</font></font><br>
        <a href="https://marketingplatform.google.com/about/partners/find-a-partner" target="_blank" rel="noopener"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">認證合作夥伴</font></font></a></p>
      </td>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">企業級服務、</font></font><br><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
      支持和 SLA</font></font></td>
    </tr>
    <tr>
      <th><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">付款方式</font></font></th>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">自由</font></font></td>
      <td class="align-center"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">每月開具發票</font></font></td>
    </tr>
  </tbody>
</table>

## 開始使用 Google Optimize

第一次使用或建立一個新的 optimize 容器時，後續就會先建立第一個實驗

{% darrellImage800 Google_Optimize_選擇實驗類型 google_optimize_create_experiment.png max-800 %}

中間如何設定一個實驗，因篇幅後續會另外有新的一篇文章來提到這些設定
且每個網站結構和差異較大，建議大家可以直接試用看看，編輯變化的介面其實很簡易
他會直接開啟網頁讓你設定和修改網頁上的元素

{% darrellImage800 Google_Optimize_建立目標和子類 google_optimize_set_up_experience.png max-800 %}

另外設定的中間可以串接 Google Analytics 4

{% darrellImage800 Google_Optimize_串接_Google_Analytics_4 google_optimize_connect_ga4.png max-800 %}

## Google Optimize 安裝與防閃爍 Anti Flicker

安裝 Optimize 容器到網站上有兩種方式

1. 透過 Google Tag Manager 安裝 [文件](https://support.google.com/optimize/answer/6314801)

2. 直接將程式碼安裝在 `<head>` 標籤中 [文件](https://support.google.com/optimize/answer/7513085)

{% darrellImage800 Google_Optimize_安裝_Code google_optimize_install_code.png max-800 %}

兩者其實不算是一樣的選擇，是有一點差異存在

在之前的文章[Google Tag Manager - 觸發條件 網頁瀏覽、Dom就緒、視窗已載入](https://www.darrelltw.com/gtm-trigger-pageview-domready-windowload/)有提到，GTM 的載入是會比較慢一點點
如果 Optimize 是跟著 GTM 安裝，也就會稍微慢一點才套用

**這時可能會出現一個奇怪的狀態**

使用者會先看到 原先的版本 -> 再看到變體的版本

範例狀況如下
{% darrellImage800 GoogleOptimize造成閃爍 google_optimize_filcker.gif max-800 %}

這時就可以考慮安裝 [Anti Flicker 的程式碼](https://support.google.com/optimize/answer/7100284)
但需要**謹慎評估**

用一些數字來舉例

第一秒鐘網頁載入 (使用者看到原版本)
第三秒鐘GTM載入+Optimize載入 (使用者看到閃爍，變成實驗版本)

如果加上 Anti Flicker 程式碼

第一秒鐘網頁載入-但因為 Anti Flicker 網頁是白畫面
第三秒鐘GTM載入+Optimize載入 (使用者直接看到實驗版本)

看似解決了閃爍的問題，但其實使用者等待網頁載入的時間實際拉長到第三秒
不耐煩的使用者搞不好就關掉網頁了



