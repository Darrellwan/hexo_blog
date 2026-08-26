// 選單控制
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const headerRight = document.querySelector('.header-right');
    
    if (menuToggle && headerRight) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            headerRight.classList.toggle('active');
        });

        // 點擊選單外區域關閉選單
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && 
                !headerRight.contains(e.target) && 
                headerRight.classList.contains('active')) {
                menuToggle.classList.remove('active');
                headerRight.classList.remove('active');
            }
        });

        // 點擊選單項目後關閉選單 (包括導航連結和社交連結)
        headerRight.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                headerRight.classList.remove('active');
            });
        });
    }
}); 

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WH2WS5GF');