window.dataLayer = window.dataLayer || [];

const isLocalDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const track = (event, params = {}) => {
    const payload = { event, ...params };
    window.dataLayer.push(payload);
    if (isLocalDev) console.log('%c[Track]', 'color: #8b5cf6', event, params);
};

// 統一的點擊追蹤 (事件委派)
document.addEventListener('click', (e) => {
    const el = e.target;
    
    // CTA 按鈕
    const cta = el.closest('.btn-primary, .btn-secondary');
    if (cta) {
        track('cta_click', {
            text: cta.textContent.trim(),
            location: cta.closest('section')?.id || 'hero',
            href: cta.href || null
        });
    }
    
    // 導覽
    const nav = el.closest('.nav-menu a, .mobile-menu a');
    if (nav) {
        track('nav_click', {
            item: nav.textContent.trim(),
            href: nav.getAttribute('href')
        });
    }
    
    // 外部連結
    const link = el.closest('a[href^="http"]');
    if (link && !link.href.includes(location.hostname)) {
        track('outbound_click', {
            url: link.href,
            text: link.textContent.trim() || link.ariaLabel || 'icon'
        });
    }
    
    // 服務卡片
    const service = el.closest('.service-card');
    if (service) {
        track('service_click', {
            name: service.querySelector('h3')?.textContent.trim()
        });
    }
});

// 表單追蹤
const form = document.getElementById('contactForm');
if (form) {
    let started = false;
    form.addEventListener('focusin', () => {
        if (started) return;
        started = true;
        track('form_start', { form: 'contact' });
    }, { once: true });
}

// 區塊曝光 (統一 Intersection Observer)
const observed = new Set();
const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting || observed.has(target)) return;
        observed.add(target);
        
        const id = target.id || target.dataset.trackName;
        if (target.matches('section[id]')) {
            track('section_view', { section: id });
        } else if (target.matches('.portfolio-card')) {
            track('portfolio_view', {
                name: target.querySelector('h3')?.textContent.trim()
            });
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('section[id], .portfolio-card').forEach(el => observer.observe(el));

// 滾動深度
const scrollThresholds = [25, 50, 75, 100];
const hitThresholds = new Set();

window.addEventListener('scroll', () => {
    const pct = Math.round(scrollY / (document.body.scrollHeight - innerHeight) * 100);
    scrollThresholds.forEach(t => {
        if (pct >= t && !hitThresholds.has(t)) {
            hitThresholds.add(t);
            track('scroll_depth', { percent: t });
        }
    });
}, { passive: true });

// 匯出給表單使用
window.trackFormSubmit = (data) => track('form_submit', {
    form: 'contact',
    service_type: data.type,
    budget: data.budget
});

window.trackFormError = (msg) => track('form_error', { message: msg });

if (isLocalDev) console.log('%c[Track] Ready', 'color: #8b5cf6; font-weight: bold');
