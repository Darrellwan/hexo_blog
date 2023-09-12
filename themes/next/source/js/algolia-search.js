/* global instantsearch, algoliasearch, CONFIG */

document.addEventListener('DOMContentLoaded', () => {
  const algoliaSettings = CONFIG.algolia;
  const { indexName, appID, apiKey } = algoliaSettings;

  let search = instantsearch({
    indexName,
    searchClient  : algoliasearch(appID, apiKey),
    stalledSearchDelay: 1000,
    searchFunction: helper => {
      let searchInput = document.querySelector('.search-input');
      if (searchInput.value) {
        helper.search();
      }
    },
    routing: {
      stateMapping: {
        stateToRoute(uiState) {
          const indexUiState = uiState[indexName];
          return {
            q: indexUiState.query,
            categories: indexUiState.menu && indexUiState.menu.categories,
            brand:
              indexUiState.refinementList && indexUiState.refinementList.brand,
            page: indexUiState.page,
          }
        },
        routeToState(routeState) {
          return {
            [indexName]: {
              query: routeState.q,
              menu: {
                categories: routeState.categories,
              },
              refinementList: {
                brand: routeState.brand,
              },
              page: routeState.page,
            },
          };
        },
      },
    },
    insights: {
      insightsInitParams: {
        useCookie: true,
      },
    },
  });

  window.pjax && search.on('render', () => {
    window.pjax.refresh(document.getElementById('algolia-hits'));
  });


  let timerId;
  // Registering Widgets
  search.addWidgets([
    instantsearch.widgets.configure({
      hitsPerPage: algoliaSettings.hits.per_page || 10
    }),

    instantsearch.widgets.searchBox({
      container           : '.search-input-container',
      placeholder         : algoliaSettings.labels.input_placeholder,
      // Hide default icons of algolia search
      showReset           : false,
      showSubmit          : false,
      cssClasses          : {
        input: 'search-input'
      },
      showLoadingIndicator: true,
      queryHook(query, refine) {
        clearTimeout(timerId)
        timerId = setTimeout(() => refine(query), 300)
      },
    }),

    instantsearch.widgets.stats({
      container: '#algolia-stats',
      templates: {
        text: data => {
          let stats = algoliaSettings.labels.hits_stats
            .replace(/\$\{hits}/, data.nbHits)
            .replace(/\$\{time}/, data.processingTimeMS);
          return `${stats}
            <span class="algolia-powered">
              <img src="${CONFIG.root}images/algolia-icon.svg" alt="Algolia">
            </span>
            `;
        }
      }
    }),

    instantsearch.widgets.hits({
      container: '#algolia-hits',
      templates: {
        item: (data) => {
          let link = data.permalink ? data.permalink : CONFIG.root + data.path;
          let keywords = data._highlightResult.title.matchedWords.join(",");
          return `<a href="${link}" data-insights-object-id="${data.objectID}" data-insights-position="${data.__position}" data-insights-query-id="${data.__queryID}" class="algolia-hit-item-link js-algolia-search-result" data-search-keyword="${keywords}">${data._highlightResult.title.value}</a>`;
        },
        empty: data => {
          return `<div id="algolia-hits-empty">
              ${algoliaSettings.labels.hits_empty.replace(/\$\{query}/, data.query)}
            </div>`;
        }
      },
      cssClasses: {
        item: 'algolia-hit-item'
      }
    }),

    instantsearch.widgets.pagination({
      container: '#algolia-pagination',
      scrollTo : false,
      showFirst: false,
      showLast : false,
      templates: {
        first   : '<i class="fa fa-angle-double-left"></i>',
        last    : '<i class="fa fa-angle-double-right"></i>',
        previous: '<i class="fa fa-angle-left"></i>',
        next    : '<i class="fa fa-angle-right"></i>'
      },
      cssClasses: {
        root        : 'pagination',
        item        : 'pagination-item',
        link        : 'page-number',
        selectedItem: 'current',
        disabledItem: 'disabled-item'
      }
    }),
    instantsearch.widgets.analytics({
      pushFunction(formattedParameters, state, results) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'algolia_search',
          'keyword': state.query,
          'facet_parameters': formattedParameters,
          'number_of_hits': results.nbHits,
          'process_time_ms' : results.processingTimeMS
        });
      },
      delay: 1500
    })
  ]);
  search.start();

  // Monitor main search box
  const onPopupOpen = () => {
    document.body.style.overflow = 'hidden';
    document.querySelector('.search-pop-overlay').classList.add('search-active');
    document.querySelector('.search-input').focus();
  };

  // Handle and trigger popup window
  document.querySelectorAll('.popup-trigger').forEach(element => {
    element.addEventListener('click', () => {
      onPopupOpen();
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

  window.addEventListener('load', event => {
    if(document.location.search.indexOf("?q=") > -1){
      window.setTimeout(onPopupOpen, 1500);
    }
    // const insightsMiddleware = instantsearch.middlewares.createInsightsMiddleware({
    //   insightsClient: window.aa,
    //   insightsInitParams: {
    //     useCookie: true,
    //   }
    // })
    // search.use(insightsMiddleware);
  });
});
