---
title: GA4 找到並移除不想要的 referral 網域
tags:
  - Google Analytics 4
categories:
  - Google Analytics 4
page_type: post
id: ga4-unwanted-referrals
description: 排除參照連結網址是防止自己的流量來源媒介被擾亂的重要步驟，並且提供台灣常見的連結一鍵複製並可以照著說明來設定排除
bgImage: GA4-unwanted_referrals_bg.jpg
preload:
  - GA4-unwanted_referrals_bg.jpg
date: 2024-09-08 22:32:25
---

{% darrellImageCover GA4-unwanted_referrals_bg GA4-unwanted_referrals_bg.jpg max-800 %}

## 為什麼要加金物流 domain 排除?

幫客戶排查 GA4 的流量來源媒介時，
最常先去看的就是把 medium 媒介 篩選成 referral
並看看目前有哪些網域的 referral 可以被移除

該被移除的網域有
1. 金物流
2. 登入三方會員時會經過的網域
3. localhost、192.168 等內部 IP

如果不把這些 domain 加入排除清單，會有什麼狀況呢?

{% darrellImage800 GA4-unwanted_referrals GA4-unwanted_referrals.png max-800 %}

簡單來說就是會造成一開始進來的 source/medium 來源媒介被替換掉
這算是在歸因上很嚴重的事情，
因為判讀報表時就無法知道這些被歸類到金物流的來源媒介
到底原本是付費渠道還是自然搜尋等等

## 把網域加入排除清單

這邊有影片的方式快速展示如何排除
步驟上還算簡單
1. 進入設定 admin
2. 選擇資料串流 data stream
3. 選擇 Google 代碼 -> 進行代碼設定
4. 點擊更多 -> 列出不適用的參照連結網址
5. 開始設定需要排除的網址

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1007409135?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="GoogleTagManager export json file"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

## 台灣有哪些網域適合被排除

下方整理出適合被排除的網域，**點擊網址後會自動複製**!

<h3>【金流系統】</h3>
<ul>
    <li>綠界 => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('pay.ecpay.com.tw')">pay.ecpay.com.tw</a> / <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('payment.ecpay.com.tw')">payment.ecpay.com.tw</a></li>
    <li>藍新 => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('core.newebpay.com')">core.newebpay.com</a></li>
    <li>PayNow => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('paynow.com.tw')">paynow.com.tw</a></li>
    <li>LINE Pay => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('web-pay.line.me')">web-pay.line.me</a></li>
    <li>PayPal => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('paypal.com')">paypal.com</a></li>
    <li>Stripe => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('hooks.stripe.com')">hooks.stripe.com</a></li>
    <li>國泰世華銀行 => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('3ds.cathaybk.com.tw')">3ds.cathaybk.com.tw</a></li>
    <li>聯合信用卡中心 => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('emv3ds-acs.nccc.com.tw')">emv3ds-acs.nccc.com.tw</a></li>
</ul>

<h3>【物流系統】</h3>
<ul>
    <li>7-11 => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('ec.shopping7.com.tw')">ec.shopping7.com.tw</a> / <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('emap.pcsc.com.tw')">emap.pcsc.com.tw</a></li>
    <li>全家 => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('mfme.map.com.tw')">mfme.map.com.tw</a> / <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('mfme2.map.com.tw')">mfme2.map.com.tw</a></li>
    <li>萊爾富 => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('ecmap.hilife.com.tw')">ecmap.hilife.com.tw</a></li>
    <li>黑貓宅到店 => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('appservice.ezcat.com.tw')">appservice.ezcat.com.tw</a></li>
    <li>ezShip => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('ezship.com.tw')">ezship.com.tw</a></li>
</ul>

<h3>【會員登入】</h3>
<ul>
    <li>LINE => <a class="copyable" href="javascript:void(0);" onclick="copyToClipboard('access.line.me')">access.line.me</a></li>
</ul>
<div id="copyNotification">複製成功！</div>

<style>
  li a.copyable {
    cursor: copy;
    position: relative;
    text-decoration: none;
  }
  #copyNotification {
    background-color: #282828;
    color: white;
    padding: 15px;
    border-radius: 5px;
    display: none;
    transition: opacity 0.5s ease-in-out;
  }
</style>

<script>
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('已複製：' + text);
            showNotification();
        }, function(err) {
            console.error('複製失敗', err);
        });
    }
    function showNotification() {
      var notification = document.getElementById('copyNotification');
      notification.style.display = 'block';
      notification.style.opacity = '1';

      setTimeout(function() {
          notification.style.opacity = '0';
          setTimeout(function() {
              notification.style.display = 'none';
          }, 500);
      }, 2500);
    }
</script>