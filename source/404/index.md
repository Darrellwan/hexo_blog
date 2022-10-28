---
title: 404
date: 2022-08-19 14:04:35
comments: false
permalink: /404.html
---


很抱歉，你目前存取的頁面並不存在。

預計將在約 <span id="timeout">5</span> 秒後返回首頁。

如果你很急著想看文章，你可以 **[點這裡](https://israynotarray.com/)** 返回首頁。

<script>
let countTime = 5;

function count() {
  
  document.getElementById('timeout').textContent = countTime;
  countTime -= 1;
  if(countTime === 0){
    location.href = 'https://www.darrelltw.com/';
  }
  setTimeout(() => {
    count();
  }, 1000);
}

count();
</script>
