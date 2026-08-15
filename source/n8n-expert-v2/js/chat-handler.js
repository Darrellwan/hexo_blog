/* ==========================================================================
   n8n Expert v2 — 自訂聊天面板（localhost 限定，取代 @n8n/chat widget）

   純手寫 HTML/CSS/JS，不依賴任何第三方套件或 CDN。
   對齊 styles.css 的 Editorial Tech Dark 設計系統（CSS 變數 + .dtchat- 前綴）。

   安全：後端回應一律先 HTML escape 再套用最小 markdown 規則，絕不直接
   innerHTML = 回應原文；連結一律加 target="_blank" rel="noopener noreferrer"。

   穩健性：整段初始化包在 try/catch，聊天功能壞掉不能影響頁面其他功能。
   ========================================================================== */
(function () {
  'use strict';

  try {
    if (!['localhost', '127.0.0.1'].includes(window.location.hostname)) return;

    var CHAT_ENDPOINT = 'https://n8n-preview-mbp.darrelltw.com/webhook/22aeba9d-d33c-4ad2-86f5-0d64704af1ee/chat';
    /* 串流模式下，n8n 的回應由 Agent 直接吐出，後面接什麼節點都改不了它——
       這是實測結果：streaming 時 Chat 節點直接報錯，responseNodes 又完全不串流。
       所以伺服器端的數字閘門擋不到訪客畫面，改由這支端點把「這一輪允許出現的
       數字＋單位」先送過來，前端邊收邊擋。兩邊的比對規則必須逐字一致。 */
    var GATE_ENDPOINT = 'https://n8n-preview-mbp.darrelltw.com/webhook/chat-gate-data';
    var TIMEOUT_MS = 45000;

    var GATE_FALLBACK = '這部分我怕給你不準的數字，所以先不回答。報價與時程請填寫下方的諮詢表單，Darrell 會依實際需求評估後給正式報價。';

    /* ---------------- 數字閘門（與 n8n「數字閘門」節點同一套規則） ---------------- */

    var UNITS = '工作天|個月|美金|USD|萬|元|週|天|小時|分鐘|次|筆|人|年|個|種|篇|%';
    var COMMIT_UNITS = '工作天|個月|美金|USD|萬|元|週|天';
    var PAIR_RE = new RegExp('(\\d+(?:\\.\\d+)?)\\s*(' + UNITS + ')', 'g');
    var COMMIT_RE = new RegExp('(\\d+(?:\\.\\d+)?)\\s*(' + COMMIT_UNITS + ')', 'g');
    var COMMIT_CONTEXT = /(報價|收費|多少錢|預算|導入|承接|合作|上線|工期|時程)/;
    var CJK_MONEY = /[〇零一二三四五六七八九十兩]{1,4}\s*(萬|元|週|個月|工作天)/;

    function gateNormalize(s) {
      return String(s || '')
        .replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
        .replace(/(\d),(\d)/g, '$1$2');
    }

    function gatePairs(s, re) {
      var out = [];
      var m;
      re.lastIndex = 0;
      while ((m = re.exec(s)) !== null) {
        var n = Number(m[1]);
        out.push((isFinite(n) ? String(n) : m[1]) + '|' + m[2]);
      }
      return out;
    }

    // 回傳擋下的理由，沒問題就回 null
    function gateCheck(text, gateData) {
      if (!gateData) return null;
      var t = gateNormalize(text)
        .replace(/^\s*\d+[.、)]\s/gm, '')
        .replace(/n8n/gi, '')
        .replace(/gpt-?\d[\w.-]*/gi, '')
        .replace(/\[[^\]]*\]\([^)]*\)/g, '');

      if (CJK_MONEY.test(t)) return '中文數字金額或工期';

      var ctx = gateData.contextPairs || [];
      var ps = gatePairs(t, PAIR_RE);
      for (var i = 0; i < ps.length; i++) {
        if (ctx.indexOf(ps[i]) === -1) return '「' + ps[i].replace('|', ' ') + '」不在檢索原文裡';
      }
      if (COMMIT_CONTEXT.test(t)) {
        var pp = gateData.pagePairs || [];
        var cs = gatePairs(t, COMMIT_RE);
        for (var j = 0; j < cs.length; j++) {
          if (pp.indexOf(cs[j]) === -1) return '承諾數字「' + cs[j].replace('|', ' ') + '」不在接案頁內容裡';
        }
      }
      return null;
    }

    /* 只放行「已經確定安全」的那一段。
       句子還沒寫完就先看到數字的話，數字會先出現在畫面上、句子寫完才被判定違規——
       那等於閘門形同虛設。所以未完成句子裡從第一個數字之後全部押著。 */
    var CJK_NUM = /[〇零一二三四五六七八九十兩]/;

    /* 哪個位置開始要押著。
       阿拉伯數字一律押——「3」先出現、「萬」還沒到的話，光看「3」是過關的，
       等「萬」到了才判違規，那一瞬間數字已經在畫面上了。
       中文數字只在它還黏在緩衝區尾巴（可能後面正要接「萬／元／週」）時才押。
       不這樣分的話，「涵蓋以下六個類型」的「六」會把整段話卡住——
       2026-08-15 實測就是這個 bug 讓訪客多等了好幾秒。 */
    function holdFrom(tail) {
      var d = tail.search(/[0-9０-９]/);
      var c = tail.search(CJK_NUM);
      if (c !== -1 && c < tail.length - 4) c = -1;   // 早就過去了，後面沒接單位
      if (d === -1) return c;
      if (c === -1) return d;
      return Math.min(d, c);
    }

    function safePrefix(buf) {
      var lastEnd = -1;
      ['。', '！', '？', '\n'].forEach(function (ch) {
        var p = buf.lastIndexOf(ch);
        if (p > lastEnd) lastEnd = p;
      });
      var head = buf.slice(0, lastEnd + 1);
      var tail = buf.slice(lastEnd + 1);
      var d = holdFrom(tail);
      if (d === -1) return buf;
      return head + tail.slice(0, d);
    }

    // 只有真的含數字時才需要等閘門資料；純文字段落不必等
    function needsGate(text) {
      return /[0-9０-９]/.test(text) || CJK_MONEY.test(text);
    }

    /* ---------------- 最小 markdown → HTML（含 escape） ---------------- */

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    /* 出處連結白名單。
       語料庫裡實際存在的 13 個網址，逐字比對，其餘一律不渲染成連結。
       2026-08-14 模型在沒有呼叫任何檢索工具的情況下捏造出 https://www.darrell.com/service
       （連網域都不是我們的）。system prompt 寫「不可以自己組網址」擋不住這種事，
       只有這份白名單擋得住。語料庫加新文章後要重新產生：
         python3 -c "import json;print(sorted({json.loads(l)['metadata']['source_url'] for l in open('chunks.jsonl')}))"
       忘了更新的後果是新文章的連結退化成純文字，不會變成壞連結——失敗方向是安全的。 */
    var ALLOWED_URLS = [
      'https://www.darrelltw.com/n8n-apify-node/',
      'https://www.darrelltw.com/n8n-datatables-node/',
      'https://www.darrelltw.com/n8n-deployment/',
      'https://www.darrelltw.com/n8n-expert-v2/',
      'https://www.darrelltw.com/n8n-gmail-node/',
      'https://www.darrelltw.com/n8n-google-sheets-node/',
      'https://www.darrelltw.com/n8n-line-message-api/',
      'https://www.darrelltw.com/n8n-line-messaging-community-node/',
      'https://www.darrelltw.com/n8n-node-s3-with-cloudflare-r2/',
      'https://www.darrelltw.com/n8n-security-vulnerability-2025/',
      'https://www.darrelltw.com/n8n-webhook/',
      'https://www.darrelltw.com/n8n-with-cloudflare-turnstile-CAPTCHA/',
      'https://www.darrelltw.com/n8n-with-slack/'
    ];

    function isAllowedUrl(url) {
      // 容忍結尾少一個斜線，其餘一律逐字比對
      var u = url.replace(/#.*$/, '');
      return ALLOWED_URLS.indexOf(u) !== -1 || ALLOWED_URLS.indexOf(u + '/') !== -1;
    }

    function inlineMd(line) {
      // 連結：[文字](https://...) — 只接受 http/https，且網址必須在白名單裡；
      // 不在白名單的只留文字，連結整個丟掉。
      line = line.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (whole, text, url) {
        if (!isAllowedUrl(url)) return text;
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
      });
      // 粗體：**文字**
      line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      return line;
    }

    function markdownToHtml(raw) {
      var escaped = escapeHtml(raw).replace(/\r\n/g, '\n');

      /* 出處連結有時候會被接在句尾的同一行（「…請參考這裡。- [標題](網址)」）。
         清單只認行首的 `-`，所以那個減號會原封不動印在畫面上。
         模型時好時壞，所以在這裡把它推到自己那一行，不靠 prompt 保證。 */
      escaped = escaped.replace(
        /(\S)[ \t]*-[ \t]+(?=\[[^\]]+\]\(https?:)/g,
        '$1\n\n- '
      );

      var lines = escaped.split('\n');
      var html = '';
      var paraBuf = [];
      var i = 0;

      function flushPara() {
        if (paraBuf.length) {
          html += '<p>' + paraBuf.map(inlineMd).join('<br>') + '</p>';
          paraBuf = [];
        }
      }

      while (i < lines.length) {
        var line = lines[i];
        var ulMatch = /^[-*]\s+(.*)$/.exec(line);
        var olMatch = /^\d+\.\s+(.*)$/.exec(line);

        if (ulMatch) {
          flushPara();
          var ulItems = [];
          while (i < lines.length) {
            var m = /^[-*]\s+(.*)$/.exec(lines[i]);
            if (!m) break;
            ulItems.push('<li>' + inlineMd(m[1]) + '</li>');
            i++;
          }
          html += '<ul>' + ulItems.join('') + '</ul>';
          continue;
        }

        if (olMatch) {
          flushPara();
          var olItems = [];
          while (i < lines.length) {
            var m2 = /^\d+\.\s+(.*)$/.exec(lines[i]);
            if (!m2) break;
            olItems.push('<li>' + inlineMd(m2[1]) + '</li>');
            i++;
          }
          html += '<ol>' + olItems.join('') + '</ol>';
          continue;
        }

        if (line.trim() === '') {
          flushPara();
          i++;
          continue;
        }

        paraBuf.push(line);
        i++;
      }
      flushPara();
      return html || '<p></p>';
    }

    /* ---------------- DOM 建構 ---------------- */

    function svg(pathD, viewBox) {
      var ns = 'http://www.w3.org/2000/svg';
      var el = document.createElementNS(ns, 'svg');
      el.setAttribute('viewBox', viewBox || '0 0 24 24');
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', 'currentColor');
      el.setAttribute('stroke-width', '2');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      var path = document.createElementNS(ns, 'path');
      path.setAttribute('d', pathD);
      el.appendChild(path);
      return el;
    }

    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'dtchat-toggle';
    toggleBtn.setAttribute('aria-label', '開啟聊天視窗');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-controls', 'dtchat-panel');

    var iconOpen = svg('M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z');
    iconOpen.classList.add('dtchat-icon-open');
    var iconClose = svg('M18 6 6 18M6 6l12 12');
    iconClose.classList.add('dtchat-icon-close');
    var dot = document.createElement('span');
    dot.className = 'dtchat-toggle-dot';
    dot.setAttribute('aria-hidden', 'true');

    toggleBtn.appendChild(iconOpen);
    toggleBtn.appendChild(iconClose);
    toggleBtn.appendChild(dot);

    var panel = document.createElement('div');
    panel.className = 'dtchat-panel';
    panel.id = 'dtchat-panel';
    panel.dataset.open = 'false';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'n8n 自動化小幫手');

    var header = document.createElement('div');
    header.className = 'dtchat-header';

    var titleWrap = document.createElement('div');
    var title = document.createElement('div');
    title.className = 'dtchat-header-title';
    title.textContent = 'n8n 自動化小幫手';
    var sub = document.createElement('div');
    sub.className = 'dtchat-header-sub';
    sub.textContent = '問我技術問題，或 Darrell 的服務內容';
    titleWrap.appendChild(title);
    titleWrap.appendChild(sub);

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'dtchat-close';
    closeBtn.setAttribute('aria-label', '關閉聊天視窗');
    closeBtn.appendChild(svg('M18 6 6 18M6 6l12 12'));

    header.appendChild(titleWrap);
    header.appendChild(closeBtn);

    var body = document.createElement('div');
    body.className = 'dtchat-body';
    body.id = 'dtchat-body';
    body.setAttribute('aria-live', 'polite');
    body.setAttribute('role', 'log');

    var footer = document.createElement('div');
    footer.className = 'dtchat-footer';

    var input = document.createElement('textarea');
    input.className = 'dtchat-input';
    input.rows = 1;
    input.placeholder = '問我 n8n 技術問題或服務內容';
    input.setAttribute('aria-label', '輸入訊息');

    var sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.className = 'dtchat-send';
    sendBtn.setAttribute('aria-label', '送出訊息');
    sendBtn.appendChild(svg('M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z'));

    footer.appendChild(input);
    footer.appendChild(sendBtn);

    /* 這行字擋不住任何技術攻擊，但它是截圖爭議發生時唯一站得住的東西。
       擺在輸入框下方而不是折疊起來——看不到的免責等於沒有免責。 */
    var disclaimer = document.createElement('div');
    disclaimer.className = 'dtchat-disclaimer';
    disclaimer.textContent = 'AI 生成內容，可能有誤。報價與時程以正式報價單為準。';

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);
    panel.appendChild(disclaimer);

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    /* ---------------- 訊息渲染 ---------------- */

    function scrollToBottom() {
      body.scrollTop = body.scrollHeight;
    }

    function appendMessage(role, rawText) {
      var row = document.createElement('div');
      row.className = 'dtchat-row dtchat-row-' + role;
      var bubble = document.createElement('div');
      bubble.className = 'dtchat-bubble';
      if (role === 'bot') {
        bubble.innerHTML = markdownToHtml(rawText);
      } else {
        bubble.textContent = rawText;
      }
      row.appendChild(bubble);
      body.appendChild(row);
      scrollToBottom();
      return row;
    }

    function appendSystem(text) {
      var row = document.createElement('div');
      row.className = 'dtchat-row dtchat-row-system';
      var bubble = document.createElement('div');
      bubble.className = 'dtchat-bubble';
      bubble.textContent = text;
      row.appendChild(bubble);
      body.appendChild(row);
      scrollToBottom();
      return row;
    }

    /* 等待動畫：像素格微光。
       刻意不寫「正在查詢知識庫」之類的階段字樣 —— n8n 是一次回完整答案、
       中途不回報進度，寫了就是在畫面上宣稱一件我們沒有依據的事。
       取消做在同一個泡泡裡，不另外浮一顆按鈕：等待跟中止是同一件事的兩面，
       拆成兩個獨立元件看起來像兩個不相干的東西。 */
    var GRID_COLS = 8;
    var GRID_ROWS = 3;
    // 每欄延遲＝週期÷欄數，微光掃到最後一欄時第一欄剛好接上，中間不會出現全暗的空檔
    var SHIMMER_CYCLE = 1.2;

    function appendTyping() {
      var wrap = document.createElement('div');
      wrap.className = 'dtchat-typing-wrap';

      var row = document.createElement('div');
      row.className = 'dtchat-row dtchat-row-bot';
      var bubble = document.createElement('div');
      bubble.className = 'dtchat-bubble dtchat-bubble-loading';

      var loader = document.createElement('div');
      loader.className = 'dtchat-loader';
      loader.setAttribute('role', 'status');
      loader.setAttribute('aria-live', 'polite');
      loader.setAttribute('aria-label', '正在產生回覆');

      var grid = document.createElement('div');
      grid.className = 'dtchat-grid';
      grid.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < GRID_COLS * GRID_ROWS; i++) {
        var cell = document.createElement('span');
        // 微光由左掃到右：同一欄同時亮，所以延遲只看欄號、不看列號
        cell.style.animationDelay = ((i % GRID_COLS) * (SHIMMER_CYCLE / GRID_COLS)).toFixed(3) + 's';
        grid.appendChild(cell);
      }

      var cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'dtchat-cancel';
      cancelBtn.textContent = '取消';
      cancelBtn.addEventListener('click', function () {
        if (state.controller) state.controller.abort();
      });

      loader.appendChild(grid);
      loader.appendChild(cancelBtn);
      bubble.appendChild(loader);
      row.appendChild(bubble);

      wrap.appendChild(row);
      body.appendChild(wrap);
      scrollToBottom();
      return wrap;
    }

    function removeRow(row) {
      if (row && row.parentNode) row.parentNode.removeChild(row);
    }

    /* ---------------- 送出邏輯 ---------------- */

    var sessionId = null;
    function getSessionId() {
      if (!sessionId) {
        sessionId = 'dtchat-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      }
      return sessionId;
    }

    var state = { sending: false, controller: null, timedOut: false };

    function setSendingUI(sending) {
      state.sending = sending;
      sendBtn.disabled = sending;
      input.disabled = sending;
    }

    function autoResize() {
      input.style.height = 'auto';
      var needed = input.scrollHeight;
      input.style.height = Math.min(needed, 96) + 'px';
      // 只有內容真的超過上限才給捲軸，避免單行狀態就出現一條軌道
      input.style.overflowY = needed > 96 ? 'auto' : 'hidden';
    }

    function handleSend() {
      var text = input.value.trim();
      if (!text || state.sending) return;

      input.value = '';
      autoResize();
      appendMessage('user', text);
      setSendingUI(true);

      var typingRow = appendTyping();

      var controller = new AbortController();
      state.controller = controller;
      state.timedOut = false;

      var timer = setTimeout(function () {
        state.timedOut = true;
        controller.abort();
      }, TIMEOUT_MS);

      /* 兩個請求同時發。閘門資料只做檢索、不呼叫模型，約 1.9 秒回來；
         第一個字要 2.8 秒，所以資料一定比它早到，不會真的卡住畫面。 */
      var gateData = null;
      var gatePromise = fetch(GATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: text }),
        signal: controller.signal
      })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { gateData = d; return d; })
        .catch(function () { gateData = null; return null; });

      var botRow = null;
      var botBubble = null;
      var buf = '';
      var shown = '';
      var blocked = null;

      function ensureBubble() {
        if (botRow) return;
        removeRow(typingRow);
        botRow = appendMessage('bot', '');
        botBubble = botRow.querySelector('.dtchat-bubble');
      }

      function render() {
        if (blocked) return;
        var safe = safePrefix(buf);
        if (safe === shown) return;
        // 已放行的內容必須先確定過關；沒拿到閘門資料就先不放行帶數字的段落
        if (!gateData && needsGate(safe)) return;
        var why = gateCheck(safe, gateData);
        if (why) {
          blocked = why;
          ensureBubble();
          botBubble.innerHTML = markdownToHtml(GATE_FALLBACK);
          controller.abort();
          return;
        }
        shown = safe;
        ensureBubble();
        botBubble.innerHTML = markdownToHtml(shown);
        scrollToBottom();
      }

      fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId: getSessionId(),
          chatInput: text
        }),
        signal: controller.signal
      })
        .then(function (res) {
          if (!res.ok || !res.body) {
            clearTimeout(timer);
            removeRow(typingRow);
            appendSystem('機器人暫時無法回應，建議直接填下方的諮詢表單，我們會盡快回覆你。');
            return null;
          }
          // n8n 串流是 NDJSON，一行一個 {"type":"item","content":"…"}
          var reader = res.body.getReader();
          var decoder = new TextDecoder();
          var pending = '';

          function pump() {
            return reader.read().then(function (r) {
              if (r.done) return;
              pending += decoder.decode(r.value, { stream: true });
              var lines = pending.split('\n');
              pending = lines.pop();
              lines.forEach(function (line) {
                if (!line.trim()) return;
                var evt;
                try { evt = JSON.parse(line); } catch (e) { return; }
                if (evt.type === 'item' && typeof evt.content === 'string') {
                  buf += evt.content;
                  render();
                }
              });
              if (blocked) return;
              return pump();
            });
          }
          return pump().then(function () { return true; });
        })
        .then(function (ok) {
          if (ok !== true) return;
          clearTimeout(timer);
          return gatePromise.then(function () {
            if (blocked) return;
            // 收完整段再驗一次，並補上模型漏掉的技術文章連結
            var why = gateCheck(buf, gateData);
            ensureBubble();
            if (why) {
              blocked = why;
              botBubble.innerHTML = markdownToHtml(GATE_FALLBACK);
              return;
            }
            var final = buf.replace(/\s+$/, '');
            if (!final) {
              removeRow(botRow);
              appendSystem('沒有收到有效回覆，建議直接填下方的諮詢表單。');
              return;
            }
            var isTech = gateData && gateData.blogTop >= 0.45 && gateData.blogTop > gateData.pageTop;
            if (isTech && gateData.topBlogUrl && !/\]\(https?:/.test(final)) {
              final += '\n\n- [' + gateData.topBlogTitle + '](' + gateData.topBlogUrl + ')';
            }
            botBubble.innerHTML = markdownToHtml(final);
            scrollToBottom();
          });
        })
        .catch(function () {
          if (blocked) return;
          clearTimeout(timer);
          removeRow(typingRow);
          if (controller.signal.aborted) {
            if (state.timedOut) {
              appendSystem('等太久了，機器人可能正在冷啟動。建議直接填下方的諮詢表單，我們會盡快回覆你。');
            } else {
              appendSystem('已取消送出。');
            }
          } else {
            appendSystem('網路連線好像有問題，請確認網路後再試一次，或直接填下方的諮詢表單。');
          }
        })
        .finally(function () {
          setSendingUI(false);
          state.controller = null;
          input.focus();
        });
    }

    /* ---------------- 開關與鍵盤事件 ---------------- */

    var welcomed = false;

    function openPanel() {
      panel.dataset.open = 'true';
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', '關閉聊天視窗');
      if (!welcomed) {
        appendMessage('bot', '嗨！我是 Darrell 的 n8n 小幫手 👋\n\n可以問我 n8n 技術問題，或是 Darrell 提供哪些服務。');
        welcomed = true;
      }
      autoResize();
      setTimeout(function () { input.focus(); }, 50);
    }

    function closePanel() {
      panel.dataset.open = 'false';
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', '開啟聊天視窗');
      toggleBtn.focus();
    }

    toggleBtn.addEventListener('click', function () {
      if (panel.dataset.open === 'true') closePanel();
      else openPanel();
    });
    closeBtn.addEventListener('click', closePanel);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.dataset.open === 'true') {
        closePanel();
      }
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    input.addEventListener('input', autoResize);
    sendBtn.addEventListener('click', handleSend);

    /* ---------------- 手機鍵盤：visualViewport 修正面板高度/位置 ---------------- */

    function updateViewportVars() {
      if (!window.visualViewport) return;
      var vv = window.visualViewport;
      var kbInset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty('--dtchat-kb-inset', kbInset + 'px');
      document.documentElement.style.setProperty('--dtchat-vh', vv.height + 'px');
    }
    if (window.visualViewport) {
      updateViewportVars();
      window.visualViewport.addEventListener('resize', updateViewportVars);
      window.visualViewport.addEventListener('scroll', updateViewportVars);
    }
  } catch (err) {
    // 聊天面板初始化失敗絕不能拖垮頁面其他功能，靜默失敗即可。
    if (window.console && console.warn) {
      console.warn('[dtchat] 聊天面板初始化失敗，已略過。', err);
    }
  }
})();
