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