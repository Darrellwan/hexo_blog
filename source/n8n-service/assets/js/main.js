// Multi-step Form Handler
class FormManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateProgress();
    }
    
    bindEvents() {
        // Next step buttons
        document.querySelectorAll('.next-step').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.validateCurrentStep()) {
                    this.nextStep();
                }
            });
        });
        
        // Previous step buttons
        document.querySelectorAll('.prev-step').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevStep();
            });
        });
        
        // Form submission
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
        
        // Input validation
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
        
        // Checkbox validation
        document.querySelectorAll('input[name="services"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.validateServices();
            });
        });
    }
    
    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Special validation for step 2 (services)
        if (this.currentStep === 2) {
            const servicesChecked = document.querySelectorAll('input[name="services"]:checked').length > 0;
            if (!servicesChecked) {
                this.showFieldError(document.querySelector('.checkbox-group'), '請至少選擇一項服務');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, '此欄位為必填');
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, '請輸入有效的 Email 地址');
                isValid = false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(field, '請輸入有效的電話號碼');
                isValid = false;
            }
        }
        
        if (isValid) {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    validateServices() {
        const servicesChecked = document.querySelectorAll('input[name="services"]:checked').length > 0;
        const checkboxGroup = document.querySelector('.checkbox-group');
        
        if (servicesChecked) {
            this.clearFieldError(checkboxGroup);
        }
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        if (field.classList.contains('checkbox-group')) {
            field.parentNode.appendChild(errorElement);
        } else {
            field.parentNode.appendChild(errorElement);
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.collectStepData();
            this.currentStep++;
            this.showStep();
            this.updateProgress();
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep();
            this.updateProgress();
        }
    }
    
    showStep() {
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add('active');
        
        // Update step indicators
        document.querySelectorAll('.step-dot').forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            
            if (index + 1 < this.currentStep) {
                dot.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                dot.classList.add('active');
            }
        });
    }
    
    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressPercent = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${progressPercent}%`;
    }
    
    collectStepData() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!this.formData[input.name]) {
                    this.formData[input.name] = [];
                }
                if (input.checked) {
                    this.formData[input.name].push(input.value);
                }
            } else {
                this.formData[input.name] = input.value;
            }
        });
    }
    
    async submitForm() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        this.collectStepData();
        
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-dots"></span> 提交中...';
        
        try {
            // Simulate API call
            await this.sendFormData();
            this.showSuccessMessage();
        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    async sendFormData() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Here you would integrate with your backend API
        // For now, we'll just log the data and show success
        console.log('Form Data:', this.formData);
        
        // You can integrate with services like:
        // - Google Forms
        // - Netlify Forms
        // - Your own backend API
        // - Email services like EmailJS
        
        return { success: true };
    }
    
    showSuccessMessage() {
        const form = document.getElementById('contactForm');
        form.innerHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <div class="success-checkmark"></div>
                </div>
                <h3>提交成功！</h3>
                <p>感謝您的諮詢，我們將在 24 小時內與您聯繫。</p>
                <div class="success-details">
                    <p><strong>您的聯絡資訊：</strong></p>
                    <p>姓名：${this.formData.name}</p>
                    <p>Email：${this.formData.email}</p>
                    <p>感興趣的服務：${this.formData.services ? this.formData.services.join(', ') : '未選擇'}</p>
                </div>
                <button type="button" class="btn btn-primary" onclick="location.reload()">
                    提交新的諮詢
                </button>
            </div>
        `;
    }
    
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <p><strong>提交失敗：</strong>${message}</p>
            <p>請檢查您的網路連接後重試，或直接聯繫我們。</p>
        `;
        
        const form = document.getElementById('contactForm');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Smooth scrolling for navigation links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Scroll reveal animation
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-reveal');
        this.init();
    }
    
    init() {
        this.observeElements();
    }
    
    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Workflow animation controller
class WorkflowAnimation {
    constructor() {
        this.init();
    }
    
    init() {
        this.startDataFlowAnimation();
    }
    
    startDataFlowAnimation() {
        const connectionLines = document.querySelectorAll('.connection-line');
        
        connectionLines.forEach((line, index) => {
            // Add staggered animation delay
            line.style.setProperty('--flow-delay', `${index * 0.5}s`);
        });
        
        // Add sparkle effects
        this.addSparkleEffects();
    }
    
    addSparkleEffects() {
        const workflowContainer = document.querySelector('.workflow-animation');
        if (!workflowContainer) return;
        
        setInterval(() => {
            this.createSparkle(workflowContainer);
        }, 3000);
    }
    
    createSparkle(container) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';
        sparkle.innerHTML = '✨';
        
        const rect = container.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        sparkle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 12px;
            pointer-events: none;
            animation: sparkle 2s ease-out forwards;
            z-index: 10;
        `;
        
        container.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
}

// Loading manager
class LoadingManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Add loading class to body
        document.body.classList.add('loading');
        
        // Remove loading class when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.remove('loading');
                this.triggerEntranceAnimations();
            }, 500);
        });
    }
    
    triggerEntranceAnimations() {
        // Add scroll reveal class to elements that should animate on scroll
        const elementsToReveal = [
            '.service-card',
            '.case-card',
            '.feature-item'
        ];
        
        elementsToReveal.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.add('scroll-reveal');
            });
        });
    }
}

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoadingManager();
    new FormManager();
    new SmoothScroll();
    new ScrollReveal();
    new WorkflowAnimation();
    
    console.log('n8n Service Page initialized successfully! 🚀');
});

// Add CSS for error states and success message
const additionalStyles = `
    .field-error {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .error {
        border-color: var(--error-color) !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
    }
    
    .form-error {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid var(--error-color);
    }
    
    .success-message {
        text-align: center;
        padding: 2rem;
        background: rgba(16, 185, 129, 0.1);
        border-radius: 1rem;
        border: 2px solid var(--success-color);
    }
    
    .success-icon {
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;
    }
    
    .success-message h3 {
        color: var(--success-color);
        margin-bottom: 1rem;
    }
    
    .success-message p {
        color: var(--text-primary);
        margin-bottom: 1rem;
    }
    
    .success-details {
        background: var(--bg-card);
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        border: 1px solid var(--border-color);
    }
    
    .success-details p {
        margin: 0.25rem 0;
        text-align: left;
        color: var(--text-secondary);
    }
    
    .loading {
        overflow: hidden;
    }
    
    .sparkle-effect {
        animation: sparkle 2s ease-out forwards;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);