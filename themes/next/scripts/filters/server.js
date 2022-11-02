// hexo.extend.filter.register('server_middleware', function(app) {
//     let allowDomains = [
//         "http://cdn.jsdelivr.net",
//         "https://cdnjs.cloudflare.com",
//         "https://fonts.googleapis.com",
//         "https://www.gstatic.com"
//     ];
//     let allowDomainStr = allowDomains.join(" ") ;
    
//     let cspStr = `default-src 'self'; script-src *; object-src 'none'`
//     app.use((req, res, next) => {
//         res.setHeader('Content-Security-Policy',cspStr)
//         next();
//     });
// }, 1);

