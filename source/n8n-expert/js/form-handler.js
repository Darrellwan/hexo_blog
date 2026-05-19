/**
 * n8n Expert Form Handler
 */
(function() {
    'use strict';

    const isLocalDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);

    if (isLocalDev) {
        document.addEventListener('DOMContentLoaded', () => {
            const turnstileContainer = document.querySelector('.cf-turnstile');
            if (turnstileContainer) {
                turnstileContainer.style.display = 'none';
            }
            console.log('%c[DEV MODE] Turnstile disabled, use testForm() to test', 'color: #ff6d5a; font-weight: bold;');
        });
    }

    window.testForm = function(options = {}) {
        if (!isLocalDev) {
            console.warn('testForm() only works on localhost');
            return;
        }

        const { submit = false, data: overrides = {} } = options;

        const defaults = {
            name: 'Test User',
            email: 'test@example.com',
            company: 'Test Company',
            type: 'Solution',
            budget: '3-10',
            description: 'Test message'
        };

        const testData = { ...defaults, ...overrides };
        const form = document.getElementById('contactForm');

        Object.entries(testData).forEach(([key, value]) => {
            const field = form.querySelector('[name="' + key + '"]');
            if (field) field.value = value;
        });

        console.log('%c[DEV] Form filled:', 'color: #4ade80;', testData);

        if (!submit) {
            console.log('%c[DEV] Run testForm({ submit: true }) to submit', 'color: #60a5fa;');
            return testData;
        }

        console.log('%c[DEV] Submitting...', 'color: #fbbf24;');
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    };

    async function verifyCaptcha() {
        if (typeof turnstile === 'undefined') {
            console.warn('[Turnstile] API not loaded, submitting without verification');
            return 'api-not-loaded';
        }

        let token;
        try {
            token = turnstile.getResponse();
        } catch (error) {
            console.warn('[Turnstile] getResponse failed (widget not rendered):', error);
            return 'widget-not-rendered';
        }

        if (!token) {
            console.warn('[Turnstile] No token available, submitting without verification');
            return 'no-token';
        }

        try {
            const validateResponse = await fetch(
                'https://turnsite-validate-n8n-template.api-worker-darrell-martech.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ 'cf-turnstile-response': token })
                }
            );
            return validateResponse.ok ? 'verified' : 'validation-failed';
        } catch (error) {
            console.warn('[Turnstile] Validation request failed:', error);
            return 'validation-error';
        }
    }

    async function handleFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');

        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        let captchaStatus = 'skipped-dev';
        if (!isLocalDev) {
            captchaStatus = await verifyCaptcha();
        } else {
            console.log('%c[DEV] Skipping Turnstile', 'color: #fbbf24;');
        }

        const originalButtonText = submitButton.innerText;
        submitButton.disabled = true;
        submitButton.innerText = 'Sending...';

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data._captcha_status = captchaStatus;

            const webhookUrl = 'https://darn8n.darrelltw.com/webhook/darrell-n8n-expert-form';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                if (typeof window.trackFormSubmit === 'function') {
                    window.trackFormSubmit(data);
                }

                // 專屬 conversion event：給 GTM → Google Ads Conversion Tag 用
                // 跟 form_submit 區隔，避免之後 GA4 報表混雜
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'n8n_consult_lead_submitted',
                    lead_source: 'n8n-expert-form',
                    service_type: data.type,
                    budget: data.budget,
                    conversion_value: 500,
                    currency: 'TWD'
                });

                form.style.display = 'none';
                successMessage.style.display = 'block';
                form.reset();
                if (!isLocalDev && typeof turnstile !== 'undefined') {
                    try { turnstile.reset(); } catch (e) { /* widget may not exist */ }
                }
            } else {
                throw new Error('Submission failed');
            }

        } catch (error) {
            console.error('Error:', error);

            if (typeof window.trackFormError === 'function') {
                window.trackFormError(error.message);
            }

            errorMessage.style.display = 'flex';
        } finally {
            submitButton.disabled = false;
            submitButton.innerText = originalButtonText;
        }
    }

    // Init
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('contactForm');
            if (form) {
                form.addEventListener('submit', handleFormSubmit);
            }
        });
    }
})();
