/**
 * Data Table Tag Plugin for Hexo
 * 通用表格標籤，支援任意 JSON 資料，自動偵測欄位
 *
 * @syntax
 * {% dataTable [style="minimal|dark|light"] [align="auto|left|center|l,c,r"] [highlight="欄位索引"] [color="primary|secondary"] %}
 * [
 *   {"欄位1": "值1", "欄位2": "值2", ...},
 *   ...
 * ]
 * {% enddataTable %}
 *
 * @param {string} [style=minimal] - 表格樣式
 *   - minimal: 極簡線條 + Ember Glow hover（深色背景適用）
 *   - dark: 深色卡片
 *   - light: 淺色卡片
 *
 * @param {string} [align=auto] - 欄位對齊方式
 *   - auto: 第一欄置左，其餘置中（預設，適合大多數情況）
 *   - left: 全部置左
 *   - center: 全部置中
 *   - l,c,r: 精確控制每欄（l=左, c=中, r=右），例如 "l,c,c" 表示第一欄左、後兩欄中
 *
 * @param {string} [highlight] - 重點欄位索引（從 1 開始），逗號分隔
 *   - 例: highlight="2,3" 表示第 2、3 欄套用重點樣式
 *   - 重點欄位會套用 .data-table-emphasis class（避開 Hexo 的 .highlight）
 *   - 樣式：--table-highlight 顏色 + 等寬字體
 *
 * @param {string} [color=primary] - 重點欄位顏色
 *   - primary: var(--n8n-primary) #ff6d5a 橘紅
 *   - secondary: var(--n8n-secondary) #20a0ff 藍色
 *
 * @css_variables 相關 CSS 變數（定義於 _custom/data-table.styl）
 *   --table-highlight: var(--n8n-primary)           // 重點欄位顏色
 *   --table-highlight-secondary: var(--n8n-secondary) // 次要重點顏色
 *
 * @rwd 響應式設計
 *   - 表格包在 .data-table-wrapper 中，支援水平捲動
 *   - 手機上可左右滑動查看完整表格
 *
 * @example 基本用法（預設 style=minimal, align=auto）
 * {% dataTable %}
 * [{"名稱": "項目A", "數值": "100"}]
 * {% enddataTable %}
 *
 * @example 指定重點欄位
 * {% dataTable style="minimal" highlight="2,3" %}
 * [{"分支": "營業時間", "節省時間": "1 分鐘", "計算模式": "Per item"}]
 * {% enddataTable %}
 *
 * @example 使用 secondary 顏色
 * {% dataTable highlight="2" color="secondary" %}
 * [{"參數": "userId", "類型": "string"}]
 * {% enddataTable %}
 *
 * @example 精確控制對齊
 * {% dataTable align="l,c,r" %}
 * [{"名稱": "項目", "數量": "100", "金額": "$500"}]
 * {% enddataTable %}
 */

hexo.extend.tag.register('dataTable', function(args, content) {
  try {
    // 解析參數
    const argsStr = args.join(' ');
    const styleMatch = argsStr.match(/style\s*=\s*["']?(\w+)["']?/);
    const alignMatch = argsStr.match(/align\s*=\s*["']?([^"'\s]+)["']?/);
    const highlightMatch = argsStr.match(/highlight\s*=\s*["']?([\d,]+)["']?/);
    const colorMatch = argsStr.match(/color\s*=\s*["']?(\w+)["']?/);

    const style = styleMatch ? styleMatch[1] : 'minimal';
    const align = alignMatch ? alignMatch[1] : 'auto';
    const highlightCols = highlightMatch
      ? highlightMatch[1].split(',').map(n => parseInt(n.trim(), 10))
      : [];
    const color = colorMatch ? colorMatch[1] : 'primary';

    // 解析 JSON 內容
    const contentStr = Array.isArray(content) ? content.join('') : (content || '');
    const data = JSON.parse(contentStr.trim());

    if (!Array.isArray(data) || data.length === 0) {
      return '<p style="color: red;">[dataTable Error] 資料必須是非空陣列</p>';
    }

    // 從第一筆資料取得欄位名稱
    const columns = Object.keys(data[0]);

    // 處理對齊 class
    let alignClass = '';
    let customAligns = null;

    if (align === 'auto' || align === 'left' || align === 'center') {
      alignClass = `data-table--align-${align}`;
    } else if (align.includes(',')) {
      // 精確控制：l,c,r 格式
      customAligns = align.split(',').map(a => {
        const t = a.trim().toLowerCase();
        if (t === 'l' || t === 'left') return 'left';
        if (t === 'r' || t === 'right') return 'right';
        return 'center';
      });
    } else {
      alignClass = 'data-table--align-auto';
    }

    // 建立 HTML
    let html = '<div class="data-table-wrapper">\n';
    html += `<table class="data-table data-table--${style}${alignClass ? ' ' + alignClass : ''}">\n`;

    // 表頭
    html += '  <thead>\n    <tr>\n';
    columns.forEach((col, index) => {
      let style = '';
      if (customAligns && customAligns[index]) {
        style = ` style="text-align: ${customAligns[index]}"`;
      }
      html += `      <th${style}>${col}</th>\n`;
    });
    html += '    </tr>\n  </thead>\n';

    // 表身
    html += '  <tbody>\n';
    data.forEach(row => {
      html += '    <tr>\n';
      columns.forEach((col, index) => {
        const colIndex = index + 1; // 從 1 開始
        const isHighlight = highlightCols.includes(colIndex);
        let tdClass = '';

        if (isHighlight) {
          tdClass = color === 'secondary' ? 'data-table-emphasis data-table-emphasis--secondary' : 'data-table-emphasis';
        }

        let style = '';
        if (customAligns && customAligns[index]) {
          style = ` style="text-align: ${customAligns[index]}"`;
        }

        const classAttr = tdClass ? ` class="${tdClass}"` : '';
        const value = row[col] !== undefined ? row[col] : '';
        html += `      <td${classAttr}${style}>${value}</td>\n`;
      });
      html += '    </tr>\n';
    });
    html += '  </tbody>\n';

    html += '</table>\n';
    html += '</div>';

    return html;
  } catch (e) {
    return `<p style="color: red;">[dataTable Error] ${e.message}</p>`;
  }
}, { ends: true });
