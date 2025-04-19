// 選單控制
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navButtons = document.querySelector('.nav-buttons');
    
    if (menuToggle && navButtons) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navButtons.classList.toggle('active');
        });

        // 點擊選單外區域關閉選單
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && 
                !navButtons.contains(e.target) && 
                navButtons.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navButtons.classList.remove('active');
            }
        });

        // 點擊選單項目後關閉選單
        navButtons.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navButtons.classList.remove('active');
            });
        });
    }
}); 

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WH2WS5GF');