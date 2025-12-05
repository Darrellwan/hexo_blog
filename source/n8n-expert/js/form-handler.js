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

    async function handleFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');

        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        if (!isLocalDev) {
            const token = turnstile.getResponse();
            if (!token) {
                errorMessage.textContent = 'Please complete the security check';
                errorMessage.classList.remove('hidden');
                return;
            }

            try {
                const validateResponse = await fetch(
                    'https://turnsite-validate-n8n-template.api-worker-darrell-martech.workers.dev/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ 'cf-turnstile-response': token })
                    }
                );

                if (!validateResponse.ok) {
                    throw new Error('Security check failed');
                }
            } catch (error) {
                console.error('Turnstile validation error:', error);
                errorMessage.style.display = 'flex';
                return;
            }
        } else {
            console.log('%c[DEV] Skipping Turnstile', 'color: #fbbf24;');
        }

        const originalButtonText = submitButton.innerText;
        submitButton.disabled = true;
        submitButton.innerText = 'Sending...';

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const webhookUrl = 'https://darrellinfo-n8n.hnd1.zeabur.app/webhook/darrell-n8n-expert-form';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                if (typeof window.trackFormSubmit === 'function') {
                    window.trackFormSubmit(data);
                }

                form.style.display = 'none';
                successMessage.style.display = 'block';
                form.reset();
                if (!isLocalDev && typeof turnstile !== 'undefined') {
                    turnstile.reset();
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
