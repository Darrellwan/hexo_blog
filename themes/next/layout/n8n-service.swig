---
title: {{ page.title }}
date: {{ page.date }}
layout: false
---

{%- if theme.favicon.apple_touch_icon %}
  <link rel="apple-touch-icon" sizes="180x180" href="{{ url_for(theme.favicon.apple_touch_icon) }}">
{%- endif %}
{%- if theme.favicon.medium %}
  <link rel="icon" type="image/png" sizes="32x32" href="{{ url_for(theme.favicon.medium) }}">
{%- endif %}
{%- if theme.favicon.small %}
  <link rel="icon" type="image/png" sizes="16x16" href="{{ url_for(theme.favicon.small) }}">
{%- endif %}
{%- if theme.favicon.safari_pinned_tab %}
  <link rel="mask-icon" href="{{ url_for(theme.favicon.safari_pinned_tab) }}" color="{{ theme.android_chrome_color }}">
{%- endif %}
{%- if theme.favicon.android_manifest %}
  <link rel="manifest" href="{{ url_for(theme.favicon.android_manifest) }}">
{%- endif %}
{%- if theme.favicon.ms_browserconfig %}
  <meta name="msapplication-config" content="{{ url_for(theme.favicon.ms_browserconfig) }}">
{%- endif %}

{%- if theme.google_site_verification %}
  <meta name="google-site-verification" content="{{ theme.google_site_verification }}">
{%- endif %}

<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>n8n 自動化服務 - 一對一家教、企業內訓、客製化流程 | Darrell TW</title>
  <meta name="description" content="提供專業的 n8n 自動化服務，包含一對一家教、團體內訓、自動化服務合作與客製化流程開發。協助您打造高效的工作流程自動化解決方案。">
  <meta name="keywords" content="n8n, 自動化服務, 一對一家教, 企業內訓, 客製化流程, 工作流程自動化">
  <link rel="canonical" href="{{ url_for(page.permalink) }}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ url_for(page.permalink) }}">
  <meta property="og:title" content="n8n 自動化服務 - 一對一家教、企業內訓、客製化流程 | Darrell TW">
  <meta property="og:description" content="提供專業的 n8n 自動化服務，包含一對一家教、團體內訓、自動化服務合作與客製化流程開發。協助您打造高效的工作流程自動化解決方案。">
  <meta property="og:image" content="{{ url_for('/gallery/n8n_service_og.jpg') }}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="{{ url_for(page.permalink) }}">
  <meta name="twitter:title" content="n8n 自動化服務 - 一對一家教、企業內訓、客製化流程 | Darrell TW">
  <meta name="twitter:description" content="提供專業的 n8n 自動化服務，包含一對一家教、團體內訓、自動化服務合作與客製化流程開發。協助您打造高效的工作流程自動化解決方案。">
  <meta name="twitter:image" content="{{ url_for('/gallery/n8n_service_og.jpg') }}">

  <script>
    // 初始化頁面功能
    window.onload = function() {
      // 平滑滾動效果
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const tgt = document.getElementById(a.getAttribute('href').slice(1));
          if (tgt) window.scrollTo({ top: tgt.offsetTop - 80, behavior: 'smooth' });
        });
      });
      
      // 服務卡片動畫
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('.service-card, .form-step').forEach(card => {
        observer.observe(card);
      });
      
      // 表單步驟控制
      initializeForm();
    };
    
    function initializeForm() {
      const form = document.getElementById('service-form');
      const steps = document.querySelectorAll('.form-step');
      const progressBar = document.querySelector('.progress-fill');
      const stepIndicators = document.querySelectorAll('.step-indicator');
      let currentStep = 0;
      
      // 設定即時驗證
      setupRealtimeValidation();
      
      // 更新進度條
      function updateProgress() {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = progress + '%';
        
        // 更新步驟指示器
        stepIndicators.forEach((indicator, index) => {
          if (index <= currentStep) {
            indicator.classList.add('active');
          } else {
            indicator.classList.remove('active');
          }
        });
      }
      
      // 顯示特定步驟
      function showStep(stepIndex) {
        steps.forEach((step, index) => {
          if (index === stepIndex) {
            step.classList.add('active');
            step.style.display = 'block';
            setTimeout(() => {
              step.style.opacity = '1';
              step.style.transform = 'translateY(0)';
            }, 50);
          } else {
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px)';
            setTimeout(() => {
              step.classList.remove('active');
              step.style.display = 'none';
            }, 300);
          }
        });
        updateProgress();
        
        // 在第四步時檢查是否需要顯示預算
        if (stepIndex === 3) {
          updateBudgetVisibility();
        }
      }
      
      // 下一步
      window.nextStep = function() {
        if (validateStep(currentStep)) {
          if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
          }
        }
      }
      
      // 上一步
      window.prevStep = function() {
        if (currentStep > 0) {
          currentStep--;
          showStep(currentStep);
        }
      }
      
      // 驗證步驟
      function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const allFields = currentStepElement.querySelectorAll('input, select, textarea');
        let isValid = true;
        let errorMessages = [];
        
        allFields.forEach(field => {
          const fieldValue = field.value.trim();
          const isRequired = field.hasAttribute('required');
          
          // 跳過隱藏欄位
          if (field.type === 'hidden') return;
          
          field.classList.remove('error');
          
          // 基本必填驗證
          if (isRequired && !fieldValue) {
            field.classList.add('error');
            isValid = false;
            errorMessages.push(`${field.previousElementSibling.textContent.replace(' *', '')} 為必填欄位`);
            return;
          }
          
          // 只有在有值的情況下才進行格式驗證
          if (fieldValue) {
            // Email 驗證
            if (field.type === 'email') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(fieldValue)) {
                field.classList.add('error');
                isValid = false;
                errorMessages.push('請輸入有效的電子郵件地址');
              }
            }
            
            // 電話驗證（台灣手機號碼）
            if (field.type === 'tel') {
              const cleanPhone = fieldValue.replace(/[-\s]/g, '');
              const phoneRegex = /^09\d{8}$/;
              if (!phoneRegex.test(cleanPhone)) {
                field.classList.add('error');
                isValid = false;
                errorMessages.push('請輸入有效的台灣手機號碼（例：0912345678）');
              }
            }
          }
        });
        
        // 顯示錯誤訊息
        if (!isValid && errorMessages.length > 0) {
          showErrorMessage(errorMessages[0]);
        }
        
        return isValid;
      }
      
      // 顯示錯誤訊息
      function showErrorMessage(message) {
        const existingError = document.querySelector('.error-toast');
        if (existingError) {
          existingError.remove();
        }
        
        const errorToast = document.createElement('div');
        errorToast.className = 'error-toast';
        errorToast.textContent = message;
        document.body.appendChild(errorToast);
        
        setTimeout(() => {
          errorToast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
          errorToast.classList.remove('show');
          setTimeout(() => errorToast.remove(), 300);
        }, 3000);
      }
      
      // 設定即時驗證
      function setupRealtimeValidation() {
        // Email 欄位即時驗證
        const emailField = document.getElementById('email');
        if (emailField) {
          emailField.addEventListener('blur', function() {
            validateField(this);
          });
          
          emailField.addEventListener('input', function() {
            // 移除錯誤狀態當使用者開始輸入
            if (this.classList.contains('error')) {
              this.classList.remove('error');
              removeFieldError(this);
            }
          });
        }
        
        // 電話欄位即時驗證
        const phoneField = document.getElementById('phone');
        if (phoneField) {
          phoneField.addEventListener('blur', function() {
            if (this.value.trim()) { // 只有在有值的時候才驗證
              validateField(this);
            }
          });
          
          phoneField.addEventListener('input', function() {
            // 移除錯誤狀態當使用者開始輸入
            if (this.classList.contains('error')) {
              this.classList.remove('error');
              removeFieldError(this);
            }
          });
        }
      }
      
      // 驗證單一欄位
      function validateField(field) {
        const fieldValue = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Email 驗證
        if (field.type === 'email' && fieldValue) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = '請輸入有效的電子郵件地址';
          }
        }
        
        // 電話驗證（台灣手機號碼）
        if (field.type === 'tel' && fieldValue) {
          const cleanPhone = fieldValue.replace(/[-\s]/g, '');
          const phoneRegex = /^09\d{8}$/;
          if (!phoneRegex.test(cleanPhone)) {
            isValid = false;
            errorMessage = '請輸入有效的電話（例：0912345678）';
          }
        }
        
        // 顯示或移除錯誤
        if (!isValid) {
          field.classList.add('error');
          showFieldError(field, errorMessage);
        } else {
          field.classList.remove('error');
          removeFieldError(field);
        }
        
        return isValid;
      }
      
      // 顯示欄位錯誤訊息
      function showFieldError(field, message) {
        removeFieldError(field); // 先移除舊的錯誤訊息
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error-message';
        errorElement.textContent = message;
        field.parentElement.appendChild(errorElement);
      }
      
      // 移除欄位錯誤訊息
      function removeFieldError(field) {
        const existingError = field.parentElement.querySelector('.field-error-message');
        if (existingError) {
          existingError.remove();
        }
      }
      
      // 服務選擇
      const serviceCards = document.querySelectorAll('.service-option');
      serviceCards.forEach(card => {
        card.addEventListener('click', function() {
          serviceCards.forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
          document.getElementById('selected-service').value = this.dataset.service;
          
          // 當進入第四步時更新預算可見性
          if (currentStep === 3) {
            updateBudgetVisibility();
          }
        });
      });
      
      // 預算範圍滑桿
      const budgetSlider = document.getElementById('budget-range');
      const budgetDisplay = document.getElementById('budget-display');
      const budgetGroup = document.querySelector('.budget-group');
      
      // 根據服務類型決定是否顯示預算
      function updateBudgetVisibility() {
        const selectedService = document.getElementById('selected-service').value;
        if (selectedService === 'consulting' || selectedService === 'custom') {
          budgetGroup.style.display = 'block';
        } else {
          budgetGroup.style.display = 'none';
        }
      }
      
      if (budgetSlider) {
        budgetSlider.addEventListener('input', function() {
          const value = this.value;
          const budgetTexts = ['尚未確定', '< NT$ 30,000', 'NT$ 30,000 - 50,000', 'NT$ 50,000 - 100,000', 'NT$ 100,000 - 200,000', '> NT$ 200,000'];
          budgetDisplay.textContent = budgetTexts[value];
          
          // 更新滑桿填充效果
          const percentage = (value / 5) * 100;
          this.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percentage}%, var(--border-color) ${percentage}%, var(--border-color) 100%)`;
        });
        
        // 初始化滑桿樣式
        budgetSlider.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) 0%, var(--border-color) 0%, var(--border-color) 100%)`;
      }
      
      // 表單提交
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
          // 收集所有表單數據
          const formData = new FormData(form);
          const data = Object.fromEntries(formData);
          
          // 處理服務名稱
          const serviceNames = {
            'tutoring': '一對一家教',
            'training': '團體內訓',
            'consulting': '自動化服務合作',
            'custom': '客製自動化流程'
          };
          data.serviceName = serviceNames[data.service] || data.service;
          
          // 處理預算顯示
          if (data.budget) {
            const budgetTexts = ['尚未確定', '< NT$ 30,000', 'NT$ 30,000 - 50,000', 'NT$ 50,000 - 100,000', 'NT$ 100,000 - 200,000', '> NT$ 200,000'];
            data.budgetText = budgetTexts[data.budget] || '尚未確定';
          }
          
          // 顯示提交動畫
          const submitBtn = form.querySelector('.submit-btn');
          submitBtn.innerHTML = '<span class="loading-spinner"></span> 提交中...';
          submitBtn.disabled = true;
          
          // 模擬提交 - 顯示提交的資料
          console.log('表單數據:', data);
          
          // 模擬提交成功
          setTimeout(() => {
            showSuccessMessage(data);
          }, 2000);
        }
      });
      
      // 顯示成功訊息
      function showSuccessMessage(data) {
        const formContainer = document.querySelector('.form-container');
        
        // 建立提交資料摘要
        let summaryHTML = '<div class="submission-summary">';
        summaryHTML += '<h4>您提交的資訊：</h4>';
        summaryHTML += '<div class="summary-items">';
        
        // 基本資訊
        summaryHTML += `<div class="summary-item"><strong>服務類型：</strong>${data.serviceName}</div>`;
        summaryHTML += `<div class="summary-item"><strong>姓名：</strong>${data.name}</div>`;
        if (data.company) {
          summaryHTML += `<div class="summary-item"><strong>公司/組織：</strong>${data.company}</div>`;
        }
        summaryHTML += `<div class="summary-item"><strong>電子郵件：</strong>${data.email}</div>`;
        if (data.phone) {
          summaryHTML += `<div class="summary-item"><strong>聯絡電話：</strong>${data.phone}</div>`;
        }
        
        // 需求資訊
        if (data.current_situation) {
          summaryHTML += `<div class="summary-item"><strong>目前狀況：</strong>${data.current_situation}</div>`;
        }
        if (data.expected_outcome) {
          summaryHTML += `<div class="summary-item"><strong>期望目標：</strong>${data.expected_outcome}</div>`;
        }
        if (data.timeline) {
          const timelineText = {
            'immediate': '立即開始',
            '1month': '1 個月內',
            '3months': '3 個月內',
            'flexible': '時間彈性'
          };
          summaryHTML += `<div class="summary-item"><strong>預計時程：</strong>${timelineText[data.timeline] || data.timeline}</div>`;
        }
        
        // 預算（如果有）
        if (data.budgetText && (data.service === 'consulting' || data.service === 'custom')) {
          summaryHTML += `<div class="summary-item"><strong>預算範圍：</strong>${data.budgetText}</div>`;
        }
        
        // 其他資訊
        if (data.additional_info) {
          summaryHTML += `<div class="summary-item"><strong>補充說明：</strong>${data.additional_info}</div>`;
        }
        if (data.newsletter === 'yes') {
          summaryHTML += `<div class="summary-item"><strong>訂閱電子報：</strong>是</div>`;
        }
        
        summaryHTML += '</div></div>';
        
        formContainer.innerHTML = `
          <div class="success-message">
            <div class="success-animation">
              <div class="success-icon">
                <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
                  <path fill="none" stroke="currentColor" stroke-width="3" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
              <div class="success-ripple"></div>
            </div>
            <h3>感謝您的諮詢！</h3>
            <p class="success-subtitle">我們已收到您的需求，將在 24 小時內與您聯繫。</p>
            
            <div class="contact-info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="info-content">
                <p class="info-label">我們將透過以下方式聯繫您</p>
                <p class="info-value">${data.email}</p>
                ${data.phone ? `<p class="info-value">${data.phone}</p>` : ''}
              </div>
            </div>
            
            ${summaryHTML}
            
            <div class="success-actions">
              <button onclick="location.reload()" class="btn btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 4v6h6M23 20v-6h-6"/>
                  <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
                </svg>
                重新填寫
              </button>
              <a href="/" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                返回首頁
              </a>
            </div>
          </div>
        `;
      }
      
      // 初始化顯示第一步
      showStep(0);
    }
  </script>

<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WRZDBFS')
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "n8n 自動化服務",
  "provider": {
    "@type": "Person",
    "name": "Darrell TW"
  },
  "description": "提供專業的 n8n 自動化服務，包含一對一家教、團體內訓、自動化服務合作與客製化流程開發",
  "serviceType": ["教育訓練", "技術諮詢", "軟體開發"],
  "areaServed": {
    "@type": "Country",
    "name": "Taiwan"
  }
}
</script>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WRZDBFS"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<nav class="service-nav">
  <div class="nav-container">
    <a href="/" class="nav-logo">Darrell TW</a>
    <div class="nav-links">
      <a href="/n8n-tutorial-resources/">n8n 教學文件</a>
      <a href="#services">服務項目</a>
      <a href="#contact" class="nav-cta">立即諮詢</a>
    </div>
  </div>
</nav>

<main class="service-container">
  <div class="page-header">
    <h1>n8n 自動化服務</h1>
    <p>專業的工作流程自動化解決方案，讓您的業務運作更高效、更智能</p>
  </div>

  <section id="services" class="services-section">
    <div class="section-header">
      <h2>服務項目</h2>
      <p>提供全方位的 n8n 自動化服務，滿足不同需求</p>
    </div>
    
    <div class="services-grid">
      <div class="service-card" data-service="tutoring">
        <div class="service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 10H7"></path>
            <path d="M19 6H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2z"></path>
            <path d="M12 14v7"></path>
            <path d="M8 21h8"></path>
            <circle cx="17" cy="10" r="1" fill="currentColor"></circle>
            <path d="M5 10h.01"></path>
          </svg>
        </div>
        <h3>一對一家教</h3>
        <p>客製化的個人教學計畫，從基礎概念到進階技巧，依照您的學習步調和需求調整課程內容。</p>
        <ul class="service-features">
          <li>彈性的上課時間安排</li>
          <li>量身定制的課程內容</li>
          <li>實作導向的教學方式</li>
          <li>課後持續支援與解答</li>
        </ul>
      </div>
      
      <div class="service-card" data-service="training">
        <div class="service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 20v-2a4 4 0 00-3-3.87"></path>
            <path d="M16 3.13a4 4 0 010 7.75"></path>
          </svg>
        </div>
        <h3>團體內訓</h3>
        <p>為企業團隊設計的完整培訓方案，提升整體團隊的自動化能力，加速數位轉型。</p>
        <ul class="service-features">
          <li>系統化的課程規劃</li>
          <li>團隊協作實戰演練</li>
          <li>企業案例分析討論</li>
          <li>培訓成效追蹤評估</li>
        </ul>
      </div>
      
      <div class="service-card" data-service="consulting">
        <div class="service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <polyline points="17 11 19 13 23 9"></polyline>
          </svg>
        </div>
        <h3>自動化服務合作</h3>
        <p>協助企業評估、規劃並導入 n8n 自動化解決方案，優化現有工作流程，提升營運效率。</p>
        <ul class="service-features">
          <li>流程分析與優化建議</li>
          <li>技術架構規劃設計</li>
          <li>系統整合與部署支援</li>
          <li>長期維護合作方案</li>
        </ul>
      </div>
      
      <div class="service-card" data-service="custom">
        <div class="service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            <path d="M12 17.77V22"></path>
            <path d="M8.5 12.5L7 14"></path>
            <path d="M15.5 12.5L17 14"></path>
          </svg>
        </div>
        <h3>客製自動化流程</h3>
        <p>根據您的特定業務需求，設計開發專屬的自動化工作流程，完美契合您的營運模式。</p>
        <ul class="service-features">
          <li>需求分析與流程設計</li>
          <li>客製化節點開發</li>
          <li>第三方服務整合</li>
          <li>完整文件與教育訓練</li>
        </ul>
      </div>
    </div>
  </section>
  
  <section id="contact" class="contact-section">
    <div class="section-header">
      <h2>立即開始您的自動化之旅</h2>
      <p>填寫表單，讓我們瞭解您的需求</p>
    </div>
    
    <div class="form-container">
      <!-- 進度條 -->
      <div class="form-progress">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="step-indicators">
          <div class="step-indicator active">1</div>
          <div class="step-indicator">2</div>
          <div class="step-indicator">3</div>
          <div class="step-indicator">4</div>
        </div>
      </div>
      
      <form id="service-form" action="" method="POST">
        <!-- 步驟 1: 選擇服務 -->
        <div class="form-step active">
          <h3>選擇您需要的服務</h3>
          <div class="service-options">
            <div class="service-option" data-service="tutoring">
              <div class="option-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 10H7"></path>
                  <path d="M19 6H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2z"></path>
                  <path d="M12 14v7"></path>
                  <path d="M8 21h8"></path>
                  <circle cx="17" cy="10" r="1" fill="currentColor"></circle>
                  <path d="M5 10h.01"></path>
                </svg>
              </div>
              <h4>一對一家教</h4>
              <p>個人化教學方案</p>
            </div>
            <div class="service-option" data-service="training">
              <div class="option-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 20v-2a4 4 0 00-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 010 7.75"></path>
                </svg>
              </div>
              <h4>團體內訓</h4>
              <p>企業團隊培訓</p>
            </div>
            <div class="service-option" data-service="consulting">
              <div class="option-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <polyline points="17 11 19 13 23 9"></polyline>
                </svg>
              </div>
              <h4>自動化服務合作</h4>
              <p>導入解決方案</p>
            </div>
            <div class="service-option" data-service="custom">
              <div class="option-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  <path d="M12 17.77V22"></path>
                  <path d="M8.5 12.5L7 14"></path>
                  <path d="M15.5 12.5L17 14"></path>
                </svg>
              </div>
              <h4>客製自動化流程</h4>
              <p>專屬流程開發</p>
            </div>
          </div>
          <input type="hidden" id="selected-service" name="service" required>
          <div class="form-navigation">
            <button type="button" class="btn btn-primary" onclick="nextStep()">下一步</button>
          </div>
        </div>
        
        <!-- 步驟 2: 基本資訊 -->
        <div class="form-step">
          <h3>請告訴我們您的基本資訊</h3>
          <div class="form-group">
            <label for="name">姓名 *</label>
            <input type="text" id="name" name="name" required placeholder="請輸入您的姓名">
          </div>
          <div class="form-group">
            <label for="company">公司/組織</label>
            <input type="text" id="company" name="company" placeholder="請輸入公司或組織名稱">
          </div>
          <div class="form-group">
            <label for="email">電子郵件 *</label>
            <input type="email" id="email" name="email" required placeholder="example@email.com">
          </div>
          <div class="form-group">
            <label for="phone">聯絡電話</label>
            <input type="tel" id="phone" name="phone" placeholder="0912-345-678">
          </div>
          <div class="form-navigation">
            <button type="button" class="btn btn-secondary" onclick="prevStep()">上一步</button>
            <button type="button" class="btn btn-primary" onclick="nextStep()">下一步</button>
          </div>
        </div>
        
        <!-- 步驟 3: 需求詳情 -->
        <div class="form-step">
          <h3>請描述您的需求</h3>
          <div class="form-group">
            <label for="current-situation">目前的狀況或挑戰</label>
            <textarea id="current-situation" name="current_situation" rows="3" placeholder="請簡述您目前遇到的問題或想要改善的流程"></textarea>
          </div>
          <div class="form-group">
            <label for="expected-outcome">期望達成的目標</label>
            <textarea id="expected-outcome" name="expected_outcome" rows="3" placeholder="請描述您希望透過自動化達成什麼目標"></textarea>
          </div>
          <div class="form-group">
            <label for="timeline">預計時程</label>
            <select id="timeline" name="timeline">
              <option value="">請選擇</option>
              <option value="immediate">立即開始</option>
              <option value="1month">1 個月內</option>
              <option value="3months">3 個月內</option>
              <option value="flexible">時間彈性</option>
            </select>
          </div>
          <div class="form-navigation">
            <button type="button" class="btn btn-secondary" onclick="prevStep()">上一步</button>
            <button type="button" class="btn btn-primary" onclick="nextStep()">下一步</button>
          </div>
        </div>
        
        <!-- 步驟 4: 預算與其他 -->
        <div class="form-step">
          <h3>最後一步</h3>
          <div class="form-group budget-group" style="display: none;">
            <label for="budget-range">專案預算範圍</label>
            <div class="budget-slider">
              <div class="budget-track">
                <input type="range" id="budget-range" name="budget" min="0" max="5" value="0">
                <div class="budget-markers">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="budget-display" id="budget-display">尚未確定</div>
              <div class="budget-hint">請選擇您的預算範圍，有助於我們提供更適合的方案</div>
            </div>
          </div>
          <div class="form-group">
            <label for="additional-info">其他補充說明</label>
            <textarea id="additional-info" name="additional_info" rows="3" placeholder="如有其他想要告訴我們的資訊，請在此填寫"></textarea>
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" name="newsletter" value="yes">
              <span>我願意接收 n8n 相關的教學資訊與更新</span>
            </label>
          </div>
          <div class="form-navigation">
            <button type="button" class="btn btn-secondary" onclick="prevStep()">上一步</button>
            <button type="submit" class="btn btn-primary submit-btn">提交諮詢</button>
          </div>
        </div>
      </form>
    </div>
  </section>
</main>

<footer class="service-footer">
  <p>&copy; {% if date %}{{ date(now, 'YYYY') }}{% else %}2025{% endif %} Darrell TW - n8n 自動化服務</p>
</footer>

<style>
  :root {
    --primary-color: #ff6d5a;
    --secondary-color: #20a0ff;
    --accent-color: #ffd93d;
    --bg-dark: #0a0a0a;
    --bg-card: #1a1a1a;
    --bg-hover: #2a2a2a;
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --border-color: #333333;
    --gradient-primary: linear-gradient(135deg, #ff6d5a 0%, #ff8e53 100%);
    --gradient-secondary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
    --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
    --success-color: #4caf50;
    --error-color: #f44336;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    padding-top: 60px;
  }
  
  /* 導航列 */
  .service-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 1rem 0;
    transition: all 0.3s ease;
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
    text-decoration: none;
    transition: transform 0.3s ease;
  }
  
  .nav-logo:hover {
    transform: scale(1.05);
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  
  .nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .nav-links a:hover {
    color: var(--text-primary);
  }
  
  .nav-cta {
    background: var(--gradient-primary);
    color: white !important;
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    transition: all 0.3s ease;
  }
  
  .nav-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 109, 90, 0.3);
  }
  
  /* 頁面標題 */
  .page-header {
    text-align: center;
    padding: 3rem 0;
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .page-header p {
    font-size: 1.25rem;
    color: var(--text-secondary);
  }
  
  /* 主要內容容器 */
  .service-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  /* Section 通用樣式 */
  section {
    padding: 3rem 0;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .section-header h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .section-header p {
    font-size: 1.125rem;
    color: var(--text-secondary);
  }
  
  /* 服務卡片 */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .service-card {
    background: var(--bg-card);
    border-radius: 20px;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
    opacity: 0;
    transform: translateY(30px);
  }
  
  .service-card.animate-in {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.6s ease;
  }
  
  .service-card:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: 0 10px 30px rgba(255, 109, 90, 0.2);
  }
  
  .service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  .service-card:hover::before {
    transform: scaleX(1);
  }
  
  .service-icon {
    width: 60px;
    height: 60px;
    background: var(--gradient-primary);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .service-icon svg {
    width: 30px;
    height: 30px;
    stroke: white;
    fill: none;
  }
  
  .service-icon svg circle[fill="currentColor"] {
    fill: white;
  }
  
  .service-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .service-card p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
  
  .service-features {
    list-style: none;
    margin-bottom: 2rem;
  }
  
  .service-features li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: var(--text-secondary);
  }
  
  .service-features li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-weight: bold;
  }
  
  /* 表單容器 */
  .form-container {
    max-width: 800px;
    margin: 0 auto;
    background: var(--bg-card);
    border-radius: 30px;
    padding: 3rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
  }
  
  /* 進度條 */
  .form-progress {
    margin-bottom: 3rem;
  }
  
  .progress-bar {
    height: 4px;
    background: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 2rem;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--gradient-primary);
    width: 25%;
    transition: width 0.5s ease;
  }
  
  .step-indicators {
    display: flex;
    justify-content: space-between;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .step-indicator {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-hover);
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: all 0.3s ease;
  }
  
  .step-indicator.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    transform: scale(1.1);
  }
  
  /* 表單步驟 */
  .form-step {
    display: none;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  }
  
  .form-step.active {
    display: block;
  }
  
  .form-step h3 {
    font-size: 1.75rem;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  /* 服務選項 */
  .service-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .service-option {
    background: var(--bg-hover);
    border: 2px solid var(--border-color);
    border-radius: 15px;
    padding: 2rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .service-option:hover {
    border-color: var(--primary-color);
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 109, 90, 0.2);
  }
  
  .service-option.selected {
    background: rgba(255, 109, 90, 0.1);
    border-color: var(--primary-color);
  }
  
  .option-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .option-icon svg {
    width: 40px;
    height: 40px;
    stroke: var(--primary-color);
    transition: all 0.3s ease;
  }
  
  .service-option:hover .option-icon svg {
    transform: scale(1.1);
    stroke: var(--primary-color);
  }
  
  .service-option.selected .option-icon svg {
    stroke: var(--primary-color);
    filter: drop-shadow(0 0 8px rgba(255, 109, 90, 0.5));
  }
  
  .service-option h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .service-option p {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  
  /* 表單群組 */
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 1rem;
    background: var(--bg-hover);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(255, 109, 90, 0.1);
  }
  
  .form-group input.error,
  .form-group select.error,
  .form-group textarea.error {
    border-color: var(--error-color);
  }
  
  /* 欄位錯誤訊息 */
  .field-error-message {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    animation: fadeIn 0.3s ease;
  }
  
  .field-error-message::before {
    content: '⚠';
    margin-right: 0.5rem;
    font-size: 1rem;
  }
  
  /* 預算滑桿 */
  .budget-group {
    transition: all 0.3s ease;
  }
  
  .budget-slider {
    margin-top: 1.5rem;
  }
  
  .budget-track {
    position: relative;
    padding: 20px 0;
  }
  
  #budget-range {
    width: 100%;
    height: 8px;
    background: var(--border-color);
    border-radius: 4px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  #budget-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(255, 109, 90, 0.3);
    border: 3px solid var(--bg-card);
    position: relative;
    z-index: 2;
  }
  
  #budget-range::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(255, 109, 90, 0.3);
    border: 3px solid var(--bg-card);
    position: relative;
    z-index: 2;
  }
  
  #budget-range::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(255, 109, 90, 0.6);
  }
  
  #budget-range::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(255, 109, 90, 0.6);
  }
  
  .budget-markers {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }
  
  .budget-markers span {
    width: 2px;
    height: 12px;
    background: var(--border-color);
    display: block;
    position: relative;
  }
  
  .budget-markers span::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: var(--bg-hover);
    border-radius: 50%;
    border: 1px solid var(--border-color);
  }
  
  .budget-display {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 1.25rem;
    color: var(--primary-color);
    font-weight: 600;
    padding: 12px 24px;
    background: rgba(255, 109, 90, 0.1);
    border-radius: 30px;
    display: inline-block;
    margin-left: 50%;
    transform: translateX(-50%);
    border: 1px solid rgba(255, 109, 90, 0.3);
    transition: all 0.3s ease;
  }
  
  .budget-hint {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
    opacity: 0.8;
  }
  
  /* 核取方塊 */
  .checkbox-group label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .checkbox-group input[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
  }
  
  /* 表單導航 */
  .form-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    gap: 1rem;
  }
  
  .form-navigation .btn:only-child {
    margin-left: auto;
  }
  
  /* 按鈕樣式 */
  .btn {
    padding: 0.875rem 2rem;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-block;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .btn-primary {
    background: var(--gradient-primary);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 109, 90, 0.3);
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 109, 90, 0.4);
  }
  
  .btn-secondary {
    background: transparent;
    color: var(--text-secondary);
    border: 2px solid var(--border-color);
  }
  
  .btn-secondary:hover {
    border-color: var(--text-primary);
    color: var(--text-primary);
  }
  
  /* 載入動畫 */
  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* 成功訊息 */
  .success-message {
    text-align: center;
    padding: 3rem;
    animation: fadeIn 0.5s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 成功動畫容器 */
  .success-animation {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 2rem;
  }
  
  .success-icon {
    width: 100px;
    height: 100px;
    background: var(--success-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: scaleIn 0.5s ease 0.2s both;
    box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
  }
  
  .success-icon svg {
    width: 60px;
    height: 60px;
    color: white;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: checkmark 0.8s ease 0.5s forwards;
  }
  
  @keyframes checkmark {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  .success-ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--success-color);
    transform: translate(-50%, -50%);
    opacity: 0.3;
    animation: ripple 2s ease 0.8s infinite;
  }
  
  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.3;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }
  
  @keyframes scaleIn {
    from {
      transform: translate(-50%, -50%) scale(0);
    }
    to {
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  .success-message h3 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .success-subtitle {
    font-size: 1.125rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
  
  /* 聯絡資訊卡片 */
  .contact-info-card {
    background: var(--bg-hover);
    border-radius: 16px;
    padding: 1.5rem;
    margin: 2rem auto;
    max-width: 500px;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
  }
  
  .contact-info-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(255, 109, 90, 0.1);
  }
  
  .info-icon {
    width: 48px;
    height: 48px;
    background: rgba(255, 109, 90, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .info-icon svg {
    width: 24px;
    height: 24px;
    stroke: var(--primary-color);
  }
  
  .info-content {
    text-align: left;
  }
  
  .info-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }
  
  .info-value {
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 500;
    margin: 0;
  }
  
  /* 下一步時間軸 */
  .next-steps {
    margin: 3rem auto;
    max-width: 600px;
  }
  
  .next-steps h4 {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    color: var(--text-primary);
  }
  
  .steps-timeline {
    position: relative;
    padding-left: 2rem;
  }
  
  .steps-timeline::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 24px;
    bottom: 24px;
    width: 2px;
    background: var(--border-color);
  }
  
  .timeline-item {
    position: relative;
    padding-bottom: 2rem;
    opacity: 0;
    animation: slideIn 0.5s ease forwards;
  }
  
  .timeline-item:nth-child(1) { animation-delay: 0.8s; }
  .timeline-item:nth-child(2) { animation-delay: 1s; }
  .timeline-item:nth-child(3) { animation-delay: 1.2s; }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .timeline-dot {
    position: absolute;
    left: -20px;
    top: 4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 3px solid var(--border-color);
    transition: all 0.3s ease;
  }
  
  .timeline-item.completed .timeline-dot {
    background: var(--success-color);
    border-color: var(--success-color);
    box-shadow: 0 0 0 6px rgba(76, 175, 80, 0.2);
  }
  
  .timeline-content h5 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
    color: var(--text-primary);
  }
  
  .timeline-content p {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0;
  }
  
  /* 按鈕圖示 */
  .btn svg {
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.5rem;
  }
  
  /* 錯誤提示 */
  .error-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--error-color);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
    z-index: 1001;
    max-width: 300px;
  }
  
  .error-toast.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* 提交摘要 */
  .submission-summary {
    background: var(--bg-hover);
    border-radius: 12px;
    padding: 1.5rem;
    margin: 2rem 0;
    text-align: left;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .submission-summary h4 {
    margin-bottom: 1rem;
    color: var(--primary-color);
    font-size: 1.1rem;
  }
  
  .summary-items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .summary-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.95rem;
  }
  
  .summary-item:last-child {
    border-bottom: none;
  }
  
  .summary-item strong {
    color: var(--text-primary);
    margin-right: 0.5rem;
  }
  
  .success-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  /* Footer */
  .service-footer {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
    border-top: 1px solid var(--border-color);
    margin-top: 4rem;
  }
  
  /* 響應式設計 */
  @media (max-width: 768px) {
    .nav-links a:not(.nav-cta) {
      display: none;
    }
    
    .page-header h1 {
      font-size: 2rem;
    }
    
    .services-grid {
      grid-template-columns: 1fr;
    }
    
    .form-container {
      padding: 2rem;
    }
    
    .service-options {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .section-header h2 {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 480px) {
    .nav-container {
      padding: 0 1rem;
    }
    
    .service-container {
      padding: 0 1rem;
    }
    
    .form-container {
      padding: 1.5rem;
      border-radius: 20px;
    }
    
    .service-options {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .form-navigation {
      flex-direction: column;
    }
    
    .form-navigation .btn {
      width: 100%;
    }
    
    .service-card {
      padding: 2rem;
    }
  }
</style>
</body>
</html> 