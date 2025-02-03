---
title: Google App Script 用 Gmail 發有質感美觀的信
tags:
  - Google App Script
  - ChatGPT
  - Gmail
categories:
  - Google App Script
page_type: post
id: google-app-script-gmail-nice-email-template
description: 學習如何在 Google App Script 中使用 HTML 發送美觀的電子郵件，並運用 ChatGPT 快速生成電子郵件模板
bgImage: google-app-script-gmail-nice-email-template_bg.jpg
preload:
  - google-app-script-gmail-nice-email-template_bg.jpg
date: 2024-12-14 23:01:47
---
{% darrellImageCover google-app-script-gmail-nice-email-template_bg google-app-script-gmail-nice-email-template_bg.jpg max-800 %}

在 Google App Script 中用 Gmail 來發送 Email 是大家蠻常做的
但你知道在 App Script 中，其實可以利用 Html 來發送好看的電子郵件嗎?

{% darrellImage googleappscript-html_vs_plain_text googleappscript-html_vs_plain_text.png max-800%}

## 利用 AI 產生 Email 模板

在沒有 AI 輔助的時代，要產生一份略有質感的 Email Template 蠻麻煩的
頂多就是找到好看的模板再加以調整成自己喜歡的風格或是色系

但現在，只是要一先簡單的 prompt 就能快速產生還算滿意的 Email Template
我的 prompt 會有幾個步驟

1. 告知 ChatGPT 我是要用在 Google App Script 並且用 Gmail 功能發送
2. 這是一封 Email Template，產生的 Html 要以 Email 的方向做優化
3. 色系和風格: 我比較偷懶的話會直接丟網址請他分析這個網站的 style

{% darrellImage googleappscript-ask_chatgpt_to_generate_email_template googleappscript-ask_chatgpt_to_generate_email_template.png max-800 %}

## 在 App Script 新增 Email 的 Html 模板

{% darrellImage googleappscript-create_email_html_file googleappscript-create_email_html_file.png max-800 %}

我自己比較喜歡把這種 Email Template 單獨為一個 Html 檔案

1. 新增一個檔案
2. 命名為 `emailTemplate.html`
3. 把剛剛 ChatGPT 產生的 Html 貼上

## 用 App Script 發送 Gmail

再來就要處理 App Script 寫程式發送 Gmail 
並且是用我們剛剛新增的 Html 檔案裡面的 Template

`sendArticleListEmail()` 這個 function 主要處理發送

`getArticles()` 是用來產生文章資料的
如果沒有文章或是想要快速的測試，可以先用我這邊的範例資料

```javascript
function getArticles() {
  return [
    {
      title: "n8n If 和 Switch",
      link: "https://www.darrelltw.com/n8n-if-switch",
      description: "深入了解 n8n 的 If 和 Switch 節點，條件判斷是每個自動化腳本都會遇到的。",
    },
    {
      title: "n8n 串接 Slack、發送訊息、用 Slack 觸發 workflow",
      link: "https://www.darrelltw.com/n8n-slack-workflow",
      description: "Slack 是多人常用的通訊工具，用 n8n 串接 Slack 的教學對非技術人員十分友好。",
    },
    {
      title: "CompressX MacOS 強大的壓縮圖片工具(需付費)",
      link: "https://www.darrelltw.com/compressx-macos",
      description: "CompressX 是壓縮圖片的好工具，操作簡單且壓縮率高，非常值得價格。",
    },
    {
      title: "在 Klaviyo 使用 Gmail 促銷標註顯示折扣碼",
      link: "https://www.darrelltw.com/klaviyo-gmail-promotion",
      description: "學習如何在 Gmail 促銷標註中顯示折扣碼或活動圖片的操作。",
    },
    {
      title: "ChatGPT 新功能 - Work with Apps 一起運作",
      link: "https://www.darrelltw.com/chatgpt-work-with-apps",
      description: "讓 ChatGPT 讀取 VSCode 程式碼，並透過終端機自動執行測試。",
    },
    {
      title: "利用 Bouncer 來清理電子報的無效用戶",
      link: "https://www.darrelltw.com/bouncer-clean-email",
      description: "使用 Bouncer 清理無效 Email 用戶，提升電子報寄送成功率和開信率。",
    },
    {
      title: "利用 Google App Script 串接 Threads API 並且用 Looker Studio 視覺化",
      link: "https://www.darrelltw.com/threads-api-google-app-script",
      description: "使用 Google App Script 處理 Threads API，並在 Looker Studio 中視覺化。",
    },
    {
      title: "GA4 更新 - Benchmark - 產業資料的基準比較",
      link: "https://www.darrelltw.com/ga4-benchmark-update",
      description: "GA4 新功能 Benchmark 提供產業基準比較，檢視自身表現。",
    },
    {
      title: "Line Notify 結束服務，轉移到 Slack、Telegram、Discord",
      link: "https://www.darrelltw.com/line-notify-end-service",
      description: "Line Notify 停止服務，介紹替代方案與串接方式。",
    },
    {
      title: "GA4 電子商務報表-已購買的商品數為 0",
      link: "https://www.darrelltw.com/ga4-ecommerce-issues",
      description: "GA4 電子商務案例，商品數量顯示為 0 的原因與解決方法。",
    }
  ];
}

function sendArticleListEmail() {
  const articles = getArticles(); // 獲取文章資料
  const recipient = "darrell.tw.martech@gmail.com";
  const subject = "每週精選文章推薦";

  // 動態生成文章列表 HTML
  let articleItems = "";
  articles.forEach(article => {
    articleItems += `
      <li class="article-item">
        <a href="${article.link}" class="article-title">${article.title}</a>
        <p class="article-description">${article.description}</p>
      </li>
    `;
  });

  // 從 HTML 檔案加載範本，並插入動態內容
  const emailHtml = HtmlService.createTemplateFromFile('emailTemplate');
  emailHtml.articleItems = articleItems; // 將動態內容傳遞給範本

  const htmlOutput = emailHtml.evaluate().getContent(); // 生成完整的 HTML

  GmailApp.sendEmail(recipient, subject, "", { htmlBody: htmlOutput });
}
```

### 執行和授權

第一次執行
或是更改到程式需要額外的授權時
都需要重新做一次授權

步驟稍長，這邊用影片呈現過程

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1039219234?badge=0&&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="GoogleTagManager export json file"></iframe></div><script async src="https://player.vimeo.com/api/player.js"></script>

授權完成後看到最下方的提示 `通知	執行完畢` 就代表執行成功

## 成果
ChatGPT 在第一次產生的 Email Template 可能沒有非常完美
但已經比純文字的 Email 內容好很多了!

想要加以調整的話，會建議把整段 Html 丟回給 ChatGPT
並且重新許願你想要調整的方向，多試個兩三事通常就會得到讓你滿意的結果

{% darrellImage googleappscript-send_email_successfully googleappscript-send_email_successfully.png max-800 %}


