/* global CONFIG */

document.addEventListener('DOMContentLoaded', () => {
  // Popup Window
  let isfetched = false;
  let datas;
  let isXml = true;
  // Search DB path
  let searchPath = CONFIG.path;
  if (searchPath.length === 0) {
    searchPath = 'search.xml';
  } else if (searchPath.endsWith('json')) {
    isXml = false;
  }
  const input = document.querySelector('.search-input');
  const resultContent = document.getElementById('search-result');

  const getIndexByWord = (word, text, caseSensitive) => {
    if (CONFIG.localsearch.unescape) {
      let div = document.createElement('div');
      div.innerText = word;
      word = div.innerHTML;
    }
    let wordLen = word.length;
    if (wordLen === 0) return [];
    let startPosition = 0;
    let position = [];
    let index = [];
    if (!caseSensitive) {
      text = text.toLowerCase();
      word = word.toLowerCase();
    }
    while ((position = text.indexOf(word, startPosition)) > -1) {
      index.push({ position, word });
      startPosition = position + wordLen;
    }
    return index;
  };

  // Merge hits into slices
  const mergeIntoSlice = (start, end, index, searchText) => {
    let item = index[index.length - 1];
    let { position, word } = item;
    let hits = [];
    let searchTextCountInSlice = 0;
    while (position + word.length <= end && index.length !== 0) {
      if (word === searchText) {
        searchTextCountInSlice++;
      }
      hits.push({
        position,
        length: word.length
      });
      let wordEnd = position + word.length;

      // Move to next position of hit
      index.pop();
      while (index.length !== 0) {
        item = index[index.length - 1];
        position = item.position;
        word = item.word;
        if (wordEnd > position) {
          index.pop();
        } else {
          break;
        }
      }
    }
    return {
      hits,
      start,
      end,
      searchTextCount: searchTextCountInSlice
    };
  };

  // Highlight title and content
  const highlightKeyword = (text, slice) => {
    let result = '';
    let prevEnd = slice.start;
    slice.hits.forEach(hit => {
      result += text.substring(prevEnd, hit.position);
      let end = hit.position + hit.length;
      result += `<b class="search-keyword">${text.substring(hit.position, end)}</b>`;
      prevEnd = end;
    });
    result += text.substring(prevEnd, slice.end);
    return result;
  };

  const inputEventFunction = () => {
    if (!isfetched) return;
    let searchText = input.value.trim().toLowerCase();
    let keywords = searchText.split(/[-\s]+/);
    if (keywords.length > 1) {
      keywords.push(searchText);
    }
    let resultItems = [];
    if (searchText.length > 0) {
      // Perform local searching
      datas.forEach(({ title, content, url, weight, description }) => {
        let titleInLowerCase = title.toLowerCase();
        let contentInLowerCase = content.toLowerCase();
        let indexOfTitle = [];
        let indexOfContent = [];
        // 本地改動：記錄「命中了幾個不同的關鍵字」，供排序用。
        // 原本只累計總命中次數，導致長文只要重複提到其中一個字就能壓過
        // 同時命中全部關鍵字的文章（搜「n8n google」時 n8n 文章排不上來）。
        let matchedKeywords = 0;
        keywords.forEach(keyword => {
          const titleHits = getIndexByWord(keyword, titleInLowerCase, false);
          const contentHits = getIndexByWord(keyword, contentInLowerCase, false);
          if (titleHits.length > 0 || contentHits.length > 0) {
            matchedKeywords++;
          }
          indexOfTitle = indexOfTitle.concat(titleHits);
          indexOfContent = indexOfContent.concat(contentHits);
        });

        // Show search results
        if (indexOfTitle.length > 0 || indexOfContent.length > 0) {
          // 標題命中數要在 indexOfTitle 被 mergeIntoSlice 消耗掉之前先存起來
          let titleHitCount = indexOfTitle.length;
          // Sort index by position of keyword
          [indexOfTitle, indexOfContent].forEach(index => {
            index.sort((itemLeft, itemRight) => {
              if (itemRight.position !== itemLeft.position) {
                return itemRight.position - itemLeft.position;
              }
              return itemLeft.word.length - itemRight.word.length;
            });
          });

          let slicesOfTitle = [];
          if (indexOfTitle.length !== 0) {
            let tmp = mergeIntoSlice(0, title.length, indexOfTitle, searchText);
            slicesOfTitle.push(tmp);
          }

          let slicesOfContent = [];
          while (indexOfContent.length !== 0) {
            let item = indexOfContent[indexOfContent.length - 1];
            let { position, word } = item;
            // Cut out 100 characters
            let start = position - 20;
            let end = position + 80;
            if (start < 0) {
              start = 0;
            }
            if (end < position + word.length) {
              end = position + word.length;
            }
            if (end > content.length) {
              end = content.length;
            }
            let tmp = mergeIntoSlice(start, end, indexOfContent, searchText);
            slicesOfContent.push(tmp);
          }

          // Sort slices in content by search text's count and hits' count
          slicesOfContent.sort((sliceLeft, sliceRight) => {
            if (sliceLeft.searchTextCount !== sliceRight.searchTextCount) {
              return sliceRight.searchTextCount - sliceLeft.searchTextCount;
            } else if (sliceLeft.hits.length !== sliceRight.hits.length) {
              return sliceRight.hits.length - sliceLeft.hits.length;
            }
            return sliceLeft.start - sliceRight.start;
          });

          // Select top N slices in content
          let upperBound = parseInt(CONFIG.localsearch.top_n_per_article, 10);
          if (upperBound >= 0) {
            slicesOfContent = slicesOfContent.slice(0, upperBound);
          }

          let resultItem = '';

          if (slicesOfTitle.length !== 0) {
            resultItem += `<li><a href="${url}" class="search-result-title">${highlightKeyword(title, slicesOfTitle[0])}</a>`;
          } else {
            resultItem += `<li><a href="${url}" class="search-result-title">${title}</a>`;
          }

          if (description) {
            // 入口頁用固定摘要。它的 content 前面掛了純比對用的關鍵字，
            // 照一般做法截內文會把那串關鍵字顯示出來，看起來像關鍵字堆砌。
            resultItem += `<a href="${url}"><p class="search-result">${description}</p></a>`;
          } else {
            slicesOfContent.forEach(slice => {
              resultItem += `<a href="${url}"><p class="search-result">${highlightKeyword(content, slice)}...</p></a>`;
            });
          }

          resultItem += '</li>';
          resultItems.push({
            item: resultItem,
            id  : resultItems.length,
            // 標題沒命中就不給權重，否則入口頁的長清單只要提到關鍵字
            // 就會壓過標題直接對題的文章（搜「Gmail」時蓋掉 Gmail 節點教學）
            weight: titleHitCount > 0 ? Number(weight) || 0 : 0,
            matchedKeywords,
            titleHitCount
          });
        }
      });
    }
    if (keywords.length === 1 && keywords[0] === '') {
      resultContent.innerHTML = '<div id="no-result"><i class="fa fa-search fa-5x"></i></div>';
    } else if (resultItems.length === 0) {
      resultContent.innerHTML = '<div id="no-result"><i class="far fa-frown fa-5x"></i></div>';
    } else {
      // 本地改動：排序優先序為
      //   1. 命中的關鍵字種類數（命中全部關鍵字的優先）
      //   2. 手動權重 search_weight（front matter 設定，用來置頂旗艦文章）
      //   3. 標題命中數（標題有關鍵字比內文提到更相關）
      //   4. search.json 的原始順序，由 scripts/search-ranking.js 排成日期新到舊
      //
      // 刻意不看「內文命中次數」：長文和版本更新紀錄只要重複提到關鍵字就會壓過
      // 真正對題的短文（搜「n8n」時只提 1 次的文章 vs 提 102 次的 CLI 教學）。
      resultItems.sort((resultLeft, resultRight) => {
        if (resultLeft.matchedKeywords !== resultRight.matchedKeywords) {
          return resultRight.matchedKeywords - resultLeft.matchedKeywords;
        } else if (resultLeft.weight !== resultRight.weight) {
          return resultRight.weight - resultLeft.weight;
        } else if (resultLeft.titleHitCount !== resultRight.titleHitCount) {
          return resultRight.titleHitCount - resultLeft.titleHitCount;
        }
        return resultLeft.id - resultRight.id;
      });
      resultContent.innerHTML = `<ul class="search-result-list">${resultItems.map(result => result.item).join('')}</ul>`;
      window.pjax && window.pjax.refresh(resultContent);
    }
  };

  const fetchData = () => {
    fetch(CONFIG.root + searchPath)
      .then(response => response.text())
      .then(res => {
        // Get the contents from search data
        isfetched = true;
        datas = isXml ? [...new DOMParser().parseFromString(res, 'text/xml').querySelectorAll('entry')].map(element => {
          return {
            title  : element.querySelector('title').textContent,
            content: element.querySelector('content').textContent,
            url    : element.querySelector('url').textContent
          };
        }) : JSON.parse(res);
        // Only match articles with not empty titles
        datas = datas.filter(data => data.title).map(data => {
          data.title = data.title.trim();
          data.content = data.content ? data.content.trim().replace(/<[^>]+>/g, '') : '';
          data.url = decodeURIComponent(data.url).replace(/\/{2,}/g, '/');
          return data;
        });
        // Remove loading animation
        document.getElementById('no-result').innerHTML = '<i class="fa fa-search fa-5x"></i>';
        inputEventFunction();
      });
  };

  if (CONFIG.localsearch.preload) {
    fetchData();
  }

  if (CONFIG.localsearch.trigger === 'auto') {
    input.addEventListener('input', inputEventFunction);
  } else {
    document.querySelector('.search-icon').addEventListener('click', inputEventFunction);
    input.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        inputEventFunction();
      }
    });
  }

  // Handle and trigger popup window
  document.querySelectorAll('.popup-trigger').forEach(element => {
    element.addEventListener('click', () => {
      document.body.style.overflow = 'hidden';
      document.querySelector('.search-pop-overlay').classList.add('search-active');
      input.focus();
      if (!isfetched) fetchData();
    });
  });

  // Monitor main search box
  const onPopupClose = () => {
    document.body.style.overflow = '';
    document.querySelector('.search-pop-overlay').classList.remove('search-active');
  };

  document.querySelector('.search-pop-overlay').addEventListener('click', event => {
    if (event.target === document.querySelector('.search-pop-overlay')) {
      onPopupClose();
    }
  });
  document.querySelector('.popup-btn-close').addEventListener('click', onPopupClose);
  window.addEventListener('pjax:success', onPopupClose);
  window.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
      onPopupClose();
    }
  });
});
