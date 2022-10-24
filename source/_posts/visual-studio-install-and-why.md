---
title: 從 Sublime Text 跳到 Visual Studio Code
date: 2022-08-21 11:00:00
tags: 
	- Visual Studio Code
	- Stack Overflow
description: 為何從 Sublime Text 轉換到 Visual Studio Code
categories: 
	- Code Development
coverImage : https://darrelltw.com/visual-studio-install-and-why/vs_code_logo.png
page_type: post
---

# 從 Sublime Text 的轉移

從 2020 到 2022 年來，發現身邊的人用 Visual Studio Code 的同事和朋友比例越來越高，，
雖然也還沒覺得自己使用 Sublime Text 有哪些不足或很不好用的地方，但還是很好奇 VS Code 有什麼迷人之處。
因此決定強迫自己跳脫 Sublime Text 的舒適圈，並學習看看 Visual Studio Code 與見證他的好用之處

--- 

# Visual Studio Code 的流行

{% darrellImage google_trend ./google_trend.png %}

從 [Google Trend](https://trends.google.com.tw/trends/explore?date=all&q=%2Fm%2F0b6h18n,%2Fm%2F0134xwrk,%2Fm%2F0_x5x3g,EMACS,%2Fm%2F07zh7#TIMESERIES) 中可以看到，Visual Studio 從 2018 開始的搜尋聲量開始大量上升，
並且超過一些當時也還是很紅的 Sublime Text, Vim, Atom 等等，並且從此一路長紅，到 2022 的今天已經遠遠超過其他編輯器和開發環境，在2022年初甚至又暴漲了一波。

開發人員非常熟悉的 Stack Overflow，其實每年也會公布一些和開發人員息息相關的報告和趨勢，以下是 [2022 年的報告](https://survey.stackoverflow.co/2022/#technology-most-popular-technologies)

{% darrellImage stackoverflow_2022 ./stackoverflow_2022_.webp %}

也能看到 Visual Studio Code 的領先程度，在大量工程師的投票之中還是穩居第一，
雖然這份投票和報告並不能代表全部工程師和相關人士的喜好，但應該也已經呈現絕大部分的情況了!

--- 

# 最一開始的嘗試心得

實際安裝完到開始使用並且完成這篇文章目前不超過兩天的心得 : 
1. 介面乾淨，有一種介於純文字編輯器和IDE的中間
2. 大量的套件可以安裝，安裝的過程感覺比 Sublime Text 更順暢
3. 搜尋功能蠻好用且快速，某些場景如只找特定檔案或是排除檔案會需要再多學習
4. GUI 介面支援 Git 的 commit，pull and push，也能簡易控制 File 的 Stage 狀態
5. 有內建的 Terminal，這點對一些需要指令操作的語言或框架方便很多，Hexo 就常常需要用指令重新建立靜態檔案和啟動 Local Server

未來也會多花點時間和心思更快上手這個工具，總覺得自己才使用不到這個工具 5% 的潛力，至少很多快捷鍵也還沒摸熟。

---

# 套件 Extensions

Visual Studio Code 有很方便的套件市集 Extensions Marketplace 可以搜尋套件和安裝，
這邊先列出我在第一時間搜尋到已經安裝的套件，都是一些排序上最多人安裝且應該會蠻實用的套件們 :

## [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

非常直白，就是自動補上 html 結尾符號
輸入
```html
  <div> 
```
會自動幫忙補成

```html
  <div> (指標會自動放在這裡) </div>
```
## [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

和 Auto Close Tag 的功能非常像，只是會幫忙處理 html Tag 的重新命名

```html
  <p><span></span></p> 
```
改任意一個 `<p>` 都會把對應的 tag 一起更改

```html
  <div><span></span></div> 
```

## [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

程式碼對齊的好工具，編輯到一個段落想好好的排序和整理程式碼時，
右鍵選擇 Format Document 或是只想整理選擇的段落 Format Selection

## [Rainbow Brackets](https://marketplace.visualstudio.com/items?itemName=2gua.rainbow-brackets)

也是很簡單卻很好用的功能，當程式碼有時充滿 Bracket {} 時，很容易迷失在找對應的括號中，有了這個套件後，每組對應的括號都會有自已的顏色，
可以因此少花費很多心力在這上面

{% darrellImage rainbow_brackets.webp ./rainbow_brackets.webp %}
