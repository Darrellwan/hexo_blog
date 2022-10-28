/* global hexo */

'use strict';

const points = require('../events/lib/injects-point');

hexo.extend.filter.register('theme_inject', injects => {
  let filePath = hexo.theme.config.custom_file_path;

  if (!filePath) return;

  points.views.forEach(key => {
    if (filePath[key]) {
      injects[key].file('custom', filePath[key]);
    }
  });

  points.styles.forEach(key => {
    if (filePath[key]) {
      injects[key].push(filePath[key]);
    }
  });

}, 99);

hexo.extend.filter.register('server_middleware', function(app){
  app.use(function(req, res, next){
      res.setHeader('X-Powered-By', 'HexoDarrell');
      res.setHeader('123', '456');
    next();
  });
});
