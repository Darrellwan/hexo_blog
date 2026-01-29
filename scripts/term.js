/**
 * Term Tooltip 標籤
 * 用於在文章中標記專有名詞，hover/click 時顯示解釋
 *
 * 使用方式：
 * {% term def="解釋文字" %}專有名詞{% endterm %}
 *
 * 渲染結果：
 * <span class="term-tooltip" data-def="解釋文字">專有名詞</span>
 */

hexo.extend.tag.register('term', function(args, content) {
  // Hexo 會移除引號並以空格分割，所以 def="a b c" 會變成 ['def=a', 'b', 'c']
  // 找到 def= 開頭的 arg 的索引，然後把後面的內容都合併
  let definition = '';
  const defIndex = args.findIndex(arg => arg.startsWith('def='));

  if (defIndex !== -1) {
    // 取得 def= 後面的值，並合併所有後續 args（直到遇到下一個 key= 或結束）
    const defValue = args[defIndex].replace(/^def=["']?/, '').replace(/["']?$/, '');
    const remainingArgs = args.slice(defIndex + 1);

    // 合併所有不是 key=value 格式的後續參數
    const additionalParts = [];
    for (const arg of remainingArgs) {
      if (arg.includes('=')) break; // 遇到下一個參數就停止
      additionalParts.push(arg);
    }

    definition = [defValue, ...additionalParts].join(' ').replace(/["']$/, '');
  }

  // HTML 轉義函數
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // 對 def 和 content 都做 XSS 轉義
  const escapedDef = escapeHtml(definition);
  const escapedContent = escapeHtml(content);

  return `<span class="term-tooltip" data-def="${escapedDef}">${escapedContent}<span class="term-icon"></span></span>`;
}, { ends: true });
