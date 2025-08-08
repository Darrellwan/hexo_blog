// Advanced Animation Controller
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (this.isReducedMotion) {
            this.disableAnimations();
            return;
        }
        
        this.setupIntersectionObservers();
        this.initializeCounterAnimations();
        this.initializeTypewriterEffect();
        this.initializeParallaxEffects();
        this.initializeHoverEffects();
    }
    
    disableAnimations() {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }
    
    setupIntersectionObservers() {
        // Main content observer
        const mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            mainObserver.observe(section);
        });
        
        // Special observer for workflow
        const workflowObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startWorkflowAnimation(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        const workflowElement = document.querySelector('.workflow-animation');
        if (workflowElement) {
            workflowObserver.observe(workflowElement);
        }
    }
    
    animateElement(element) {
        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.classList.add('animated', `animate-${animationType}`);
        }, delay);
    }
    
    startWorkflowAnimation(workflowElement) {
        const nodes = workflowElement.querySelectorAll('.node');
        const connections = workflowElement.querySelectorAll('.connection-line');
        
        // Animate nodes with stagger
        nodes.forEach((node, index) => {
            setTimeout(() => {
                node.classList.add('node-animate');
                this.addNodePulse(node, index);
            }, index * 200);
        });
        
        // Animate connections
        setTimeout(() => {
            connections.forEach((connection, index) => {
                setTimeout(() => {
                    this.animateDataFlow(connection);
                }, index * 300);
            });
        }, 600);
        
        // Start continuous data flow
        setTimeout(() => {
            this.startContinuousDataFlow(workflowElement);
        }, 2000);
    }
    
    addNodePulse(node, index) {
        const pulseDelay = (index + 1) * 2000; // Staggered pulse every 2 seconds
        
        setInterval(() => {
            if (!document.hidden) { // Only animate if page is visible
                node.classList.add('pulse-glow');
                setTimeout(() => {
                    node.classList.remove('pulse-glow');
                }, 800);
            }
        }, pulseDelay + (index * 500));
    }
    
    animateDataFlow(connection) {
        connection.classList.add('data-flowing');
        
        // Create flowing particle
        const particle = document.createElement('div');
        particle.className = 'data-particle';
        connection.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 2000);
    }
    
    startContinuousDataFlow(container) {
        const connections = container.querySelectorAll('.connection-line');
        
        setInterval(() => {
            if (!document.hidden) {
                connections.forEach((connection, index) => {
                    setTimeout(() => {
                        this.animateDataFlow(connection);
                    }, index * 400);
                });
            }
        }, 4000);
    }
    
    initializeCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = parseInt(element.dataset.duration) || 2000;
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    initializeTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.speed) || 100;
            
            const typewriterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeWriter(entry.target, text, speed);
                        typewriterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            typewriterObserver.observe(element);
        });
    }
    
    typeWriter(element, text, speed) {
        element.textContent = '';
        let i = 0;
        
        const typing = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        };
        
        typing();
    }
    
    initializeParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        const updateParallax = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        // Throttled scroll listener
        let ticking = false;
        const scrollListener = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', scrollListener, { passive: true });

        // Apply on load for initial position
        updateParallax();
    }
    
    initializeHoverEffects() {
        // Service cards magnetic effect
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
        
        // Button ripple effect
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x - 10}px;
                    top: ${y - 10}px;
                    width: 20px;
                    height: 20px;
                `;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // Utility method to add animation to any element
    addAnimation(element, animationType, delay = 0) {
        setTimeout(() => {
            element.classList.add('animated', `animate-${animationType}`);
        }, delay);
    }
    
    // Method to create floating particles
    createFloatingParticles(container, count = 5) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--accent-gradient);
                border-radius: 50%;
                opacity: 0.6;
                animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            
            container.appendChild(particle);
        }
    }
    
    // Performance optimization: pause animations when tab is not visible
    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            const animatedElements = document.querySelectorAll('.animated');
            
            if (document.hidden) {
                animatedElements.forEach(element => {
                    element.style.animationPlayState = 'paused';
                });
            } else {
                animatedElements.forEach(element => {
                    element.style.animationPlayState = 'running';
                });
            }
        });
    }
}

// Mouse trail effect - DISABLED
class MouseTrail {
    constructor() {
        // Disabled mouse trail effect
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    const mouseTrail = new MouseTrail();
    
    // Floating particles disabled
    
    // Handle visibility changes for performance
    animationController.handleVisibilityChange();
});

// Add CSS keyframes for new animations
const advancedAnimationStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .pulse-glow {
        animation: pulse-glow 0.8s ease-in-out;
    }
    
    @keyframes pulse-glow {
        0%, 100% {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        50% {
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
            transform: scale(1.02);
        }
    }
    
    .data-particle {
        position: absolute;
        width: 6px;
        height: 6px;
        background: var(--accent-primary);
        border-radius: 50%;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        animation: particle-flow 2s ease-in-out;
    }
    
    @keyframes particle-flow {
        from {
            left: 0;
            opacity: 0;
        }
        10%, 90% {
            opacity: 1;
        }
        to {
            left: 100%;
            opacity: 0;
        }
    }
    
    .node-animate {
        animation: node-entrance 0.8s ease-out;
    }
    
    @keyframes node-entrance {
        from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    .data-flowing::before {
        animation: data-flow-pulse 2s ease-in-out infinite;
    }
    
    @keyframes data-flow-pulse {
        0%, 100% {
            opacity: 0.7;
        }
        50% {
            opacity: 1;
            background: linear-gradient(to bottom, #4facfe, #00f2fe);
        }
    }
    
    .floating-particle {
        animation: float-random 4s ease-in-out infinite;
    }
    
    @keyframes float-random {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
        }
        25% {
            transform: translate(10px, -10px) rotate(90deg);
        }
        50% {
            transform: translate(-5px, -20px) rotate(180deg);
        }
        75% {
            transform: translate(-10px, -5px) rotate(270deg);
        }
    }
    
    .animated {
        animation-fill-mode: both;
    }
    
    .animate-fadeInUp {
        animation-name: fadeInUp;
        animation-duration: 0.8s;
    }
    
    .animate-fadeInLeft {
        animation-name: fadeInLeft;
        animation-duration: 0.8s;
    }
    
    .animate-fadeInRight {
        animation-name: fadeInRight;
        animation-duration: 0.8s;
    }
    
    .animate-slideInScale {
        animation-name: slideInScale;
        animation-duration: 0.6s;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .mouse-trail-dot {
            display: none;
        }
        
        .floating-particle {
            display: none;
        }
        
        .service-card {
            transform: none !important;
        }
    }
`;

// Inject advanced animation styles
const advancedStyleSheet = document.createElement('style');
advancedStyleSheet.textContent = advancedAnimationStyles;
document.head.appendChild(advancedStyleSheet);