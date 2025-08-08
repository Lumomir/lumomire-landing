// assets/js/components.js

/**
 * Lumomire UI Components
 * Advanced component behaviors and animations
 * Security-focused, memory-optimized component management
 */

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.animationFrame = null;
        this.isInitialized = false;
        this.performanceMetrics = {
            componentLoadTime: 0,
            memoryUsage: 0,
            animationFrames: 0
        };
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.registerComponents();
        this.initializeAnimations();
        this.setupIntersectionObservers();
        this.isInitialized = true;
        
        console.log('[ComponentManager] Initialized successfully');
    }

    registerComponents() {
        // Security: Register components with input validation
        try {
            this.components.set('pricing-card', new PricingCardComponent());
            this.components.set('dashboard-preview', new DashboardPreviewComponent());
            this.components.set('feature-card', new FeatureCardComponent());
            this.components.set('form-validator', new FormValidatorComponent());
            this.components.set('scroll-animator', new ScrollAnimatorComponent());
            this.components.set('performance-monitor', new PerformanceMonitorComponent());
            
            console.log('[ComponentManager] All components registered successfully');
        } catch (error) {
            console.error('[ComponentManager] Component registration failed:', error);
        }
    }

    getComponent(name) {
        if (typeof name !== 'string' || !name.trim()) {
            console.warn('[ComponentManager] Invalid component name provided');
            return null;
        }
        return this.components.get(name);
    }

    initializeAnimations() {
        // Performance: Set animation properties with fallbacks
        const root = document.documentElement;
        if (root && root.style) {
            root.style.setProperty('--animation-duration', '300ms');
            root.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
        }
        
        this.injectAnimationStyles();
    }

    injectAnimationStyles() {
        const styleId = 'lumomire-animations';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeInUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .animate-fade-in-up {
                animation: fadeInUp 0.6s ease-out;
            }
            
            .animate-scale-in {
                animation: scaleIn 0.3s ease-out;
            }
            
            .animate-shimmer::after {
                animation: shimmer 2s infinite;
            }
        `;
        
        document.head.appendChild(style);
    }

    setupIntersectionObservers() {
        if (!('IntersectionObserver' in window)) {
            console.warn('[ComponentManager] IntersectionObserver not supported');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Memory optimization: Observe only existing elements
        const animatableElements = document.querySelectorAll('.feature, .pricing-card, .metric-card');
        animatableElements.forEach(el => {
            if (el) observer.observe(el);
        });
    }

    // Performance monitoring
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            timestamp: new Date().toISOString(),
            memoryUsage: this.getCurrentMemoryUsage()
        };
    }

    getCurrentMemoryUsage() {
        if ('memory' in performance) {
            return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024); // MB
        }
        return 0;
    }
}

/**
 * Pricing Card Component
 * Handles pricing interactions with security validation
 */
class PricingCardComponent {
    constructor() {
        this.cards = document.querySelectorAll('.pricing-card');
        this.toggle = document.getElementById('pricing-toggle');
        this.amounts = document.querySelectorAll('.pricing-card__amount');
        
        this.bindEvents();
    }

    bindEvents() {
        // Security: Validate elements exist before binding
        if (this.toggle) {
            this.toggle.addEventListener('change', (e) => {
                this.animatePriceChange(e.target.checked);
            });
        }

        this.cards.forEach(card => {
            if (card) {
                card.addEventListener('mouseenter', () => this.onCardHover(card));
                card.addEventListener('mouseleave', () => this.onCardLeave(card));
            }
        });

        // Button interactions with security validation
        this.cards.forEach(card => {
            const button = card.querySelector('.btn');
            if (button) {
                button.addEventListener('click', () => this.onButtonClick(card, button));
            }
        });
    }

    animatePriceChange(isAnnual) {
        if (!this.amounts || this.amounts.length === 0) return;

        this.amounts.forEach((amount, index) => {
            if (!amount) return;

            // Performance: Stagger animations to prevent blocking
            setTimeout(() => {
                this.animateSinglePrice(amount, isAnnual);
            }, index * 50); // Reduced delay for better performance
        });
    }

    animateSinglePrice(amount, isAnnual) {
        // Security: Validate data attributes exist
        const monthly = amount.getAttribute('data-monthly');
        const annual = amount.getAttribute('data-annual');
        
        if (!monthly || !annual) {
            console.warn('[PricingCard] Missing price data attributes');
            return;
        }

        // Performance optimized animation
        amount.style.transform = 'scale(1.05)';
        amount.style.transition = 'transform 0.15s ease';
        
        setTimeout(() => {
            amount.textContent = isAnnual ? annual : monthly;
            amount.style.transform = 'scale(1)';
        }, 75);
    }

    onCardHover(card) {
        if (!card) return;

        // Performance: Use CSS transforms instead of changing multiple properties
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.15)';
        card.style.borderColor = '#d4af37';
        
        this.animateCardFeatures(card);
    }

    onCardLeave(card) {
        if (!card) return;

        // Reset card styles
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.borderColor = '';
        
        this.resetCardFeatures(card);
    }

    animateCardFeatures(card) {
        const features = card.querySelectorAll('.features-list__item');
        const checkIcons = card.querySelectorAll('.check-icon');
        
        // Performance: Batch DOM updates
        requestAnimationFrame(() => {
            features.forEach((feature, index) => {
                if (feature) {
                    setTimeout(() => {
                        feature.style.transform = 'translateX(8px)';
                    }, index * 30);
                }
            });

            checkIcons.forEach((icon, index) => {
                if (icon) {
                    setTimeout(() => {
                        icon.style.color = '#f1c40f';
                        icon.style.transform = 'scale(1.1)';
                    }, index * 20);
                }
            });
        });
    }

    resetCardFeatures(card) {
        const features = card.querySelectorAll('.features-list__item');
        const checkIcons = card.querySelectorAll('.check-icon');
        
        features.forEach(feature => {
            if (feature) {
                feature.style.transform = '';
            }
        });

        checkIcons.forEach(icon => {
            if (icon) {
                icon.style.color = '';
                icon.style.transform = '';
            }
        });
    }

    onButtonClick(card, button) {
        if (!card || !button) return;

        // Security: Prevent multiple rapid clicks
        if (button.disabled) return;
        
        button.disabled = true;
        
        // Animation with performance optimization
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
            button.disabled = false;
        }, 150);

        card.classList.add('animate-scale-in');
        setTimeout(() => {
            card.classList.remove('animate-scale-in');
        }, 300);
    }
}

/**
 * Dashboard Preview Component
 * Secure dashboard cycling with memory management
 */
class DashboardPreviewComponent {
    constructor() {
        this.container = document.getElementById('dashboard-preview');
        this.toggles = document.querySelectorAll('.dashboard-toggle');
        this.slides = document.querySelectorAll('.dashboard-slide');
        this.currentIndex = 1; // Start with CFO dashboard
        this.isAutoPlaying = false;
        this.autoPlayInterval = null;
        this.lastInteractionTime = Date.now();
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.warn('[DashboardPreview] Container not found');
            return;
        }
        
        this.bindEvents();
        this.startAutoPlay();
        this.setupMetricAnimation();
    }

    bindEvents() {
        this.toggles.forEach((toggle, index) => {
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchTo(index);
                    this.pauseAutoPlay();
                    this.lastInteractionTime = Date.now();
                    
                    // Resume autoplay after user interaction
                    setTimeout(() => this.resumeAutoPlay(), 5000);
                });
            }
        });

        // Performance: Use passive listeners for scroll events
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay(), { passive: true });
        this.container.addEventListener('mouseleave', () => this.resumeAutoPlay(), { passive: true });
    }

    switchTo(index) {
        // Security: Validate index bounds
        if (index < 0 || index >= this.slides.length) {
            console.warn('[DashboardPreview] Invalid slide index:', index);
            return;
        }

        if (index === this.currentIndex) return;

        const currentSlide = this.slides[this.currentIndex];
        const nextSlide = this.slides[index];
        
        // Performance: Use transform instead of changing multiple properties
        if (currentSlide) {
            currentSlide.style.transform = 'translateX(-100%)';
            currentSlide.style.opacity = '0';
            setTimeout(() => {
                currentSlide.classList.remove('active');
            }, 150);
        }

        if (nextSlide) {
            nextSlide.classList.add('active');
            nextSlide.style.transform = 'translateX(100%)';
            nextSlide.style.opacity = '0';
            
            // Performance: Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                nextSlide.style.transform = 'translateX(0)';
                nextSlide.style.opacity = '1';
            });
        }

        this.updateToggles(index);
        this.currentIndex = index;
        this.animateMetrics(nextSlide);
    }

    updateToggles(activeIndex) {
        this.toggles.forEach((toggle, index) => {
            if (toggle) {
                const isActive = index === activeIndex;
                toggle.classList.toggle('active', isActive);
                
                // Performance: Batch style updates
                if (isActive) {
                    toggle.style.background = '#d4af37';
                    toggle.style.color = 'white';
                } else {
                    toggle.style.background = '';
                    toggle.style.color = '';
                }
            }
        });
    }

    animateMetrics(slide) {
        if (!slide) return;

        const metrics = slide.querySelectorAll('.metric-card');
        
        // Performance: Use requestAnimationFrame for smooth animations
        requestAnimationFrame(() => {
            metrics.forEach((metric, index) => {
                if (metric) {
                    setTimeout(() => {
                        metric.style.transform = 'scale(1.02)';
                        metric.style.borderColor = '#d4af37';
                        
                        setTimeout(() => {
                            metric.style.transform = '';
                            metric.style.borderColor = '';
                        }, 200);
                    }, index * 100);
                }
            });
        });
    }

    startAutoPlay() {
        if (this.isAutoPlaying || this.autoPlayInterval) return;
        
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            // Security: Check if tab is visible to prevent unnecessary work
            if (document.hidden) return;
            
            // Performance: Check if user recently interacted
            if (Date.now() - this.lastInteractionTime < 10000) return; // 10 seconds
            
            const nextIndex = (this.currentIndex + 1) % this.slides.length;
            this.switchTo(nextIndex);
        }, 4000);
    }

    pauseAutoPlay() {
        this.isAutoPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlay() {
        // Only resume if user hasn't interacted recently
        if (Date.now() - this.lastInteractionTime > 5000) {
            this.startAutoPlay();
        }
    }

    setupMetricAnimation() {
        // Performance: Only animate when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateMetricValues();
                }
            });
        }, { threshold: 0.5 });

        if (this.container) {
            observer.observe(this.container);
        }
    }

    animateMetricValues() {
        if (document.hidden) return;

        const activeSlide = document.querySelector('.dashboard-slide.active');
        if (!activeSlide) return;

        const metricValues = activeSlide.querySelectorAll('.metric-value');
        
        // Performance: Batch DOM updates
        requestAnimationFrame(() => {
            metricValues.forEach(value => {
                if (value) {
                    value.style.color = '#f1c40f';
                    value.style.transform = 'scale(1.05)';
                    
                    setTimeout(() => {
                        value.style.color = '';
                        value.style.transform = '';
                    }, 300);
                }
            });
        });
    }
}

/**
 * Feature Card Component
 * Memory-optimized feature card animations
 */
class FeatureCardComponent {
    constructor() {
        this.cards = document.querySelectorAll('.feature');
        this.bindEvents();
    }

    bindEvents() {
        this.cards.forEach(card => {
            if (card) {
                card.addEventListener('mouseenter', () => this.onCardEnter(card), { passive: true });
                card.addEventListener('mouseleave', () => this.onCardLeave(card), { passive: true });
            }
        });
    }

    onCardEnter(card) {
        if (!card) return;

        // Performance: Use transform for better performance
        const icon = card.querySelector('.feature__icon');
        const title = card.querySelector('.feature__title');
        
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.background = 'linear-gradient(135deg, #1a365d 0%, #d4af37 100%)';
        }

        if (title) {
            title.style.color = '#1a365d';
        }

        this.animateListItems(card);
    }

    onCardLeave(card) {
        if (!card) return;

        const icon = card.querySelector('.feature__icon');
        const title = card.querySelector('.feature__title');
        
        if (icon) {
            icon.style.transform = '';
            icon.style.background = '';
        }

        if (title) {
            title.style.color = '';
        }

        this.resetListItems(card);
    }

    animateListItems(card) {
        const listItems = card.querySelectorAll('.feature__list li');
        
        // Performance: Use requestAnimationFrame
        requestAnimationFrame(() => {
            listItems.forEach((item, index) => {
                if (item) {
                    setTimeout(() => {
                        item.style.transform = 'translateX(10px)';
                        item.style.color = '#374151';
                    }, index * 30);
                }
            });
        });
    }

    resetListItems(card) {
        const listItems = card.querySelectorAll('.feature__list li');
        
        listItems.forEach(item => {
            if (item) {
                item.style.transform = '';
                item.style.color = '';
            }
        });
    }
}

/**
 * Form Validator Component
 * Secure form validation with memory optimization
 */
class FormValidatorComponent {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.validationRules = new Map();
        this.initializeForms();
    }

    initializeForms() {
        this.forms.forEach(form => {
            if (form) {
                this.setupFormValidation(form);
                this.enhanceFormUX(form);
            }
        });
    }

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            }
        });
    }

    enhanceFormUX(form) {
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('focus', () => this.onFieldFocus(input));
                input.addEventListener('blur', () => this.onFieldBlur(input));
            }
        });
    }

    validateField(input) {
        if (!input) return false;

        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let message = '';

        // Security: Input sanitization
        if (this.containsSuspiciousContent(value)) {
            isValid = false;
            message = 'Invalid characters detected';
        } else {
            // Field-specific validation
            switch (type) {
                case 'email':
                    isValid = this.isValidEmail(value);
                    message = isValid ? '' : 'Please enter a valid email address';
                    break;
                case 'text':
                    if (input.required) {
                        isValid = value.length > 0;
                        message = isValid ? '' : 'This field is required';
                    }
                    break;
            }
        }

        if (isValid) {
            this.clearFieldError(input);
            this.showFieldSuccess(input);
        } else {
            this.showFieldError(input, message);
        }

        return isValid;
    }

    containsSuspiciousContent(value) {
        // Security: Check for potential XSS patterns
        const suspiciousPatterns = [
            /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe[\s\S]*?>/gi
        ];

        return suspiciousPatterns.some(pattern => pattern.test(value));
    }

    showFieldError(input, message) {
        if (!input) return;

        this.clearFieldError(input);
        
        input.classList.add('field-error');
        input.style.borderColor = '#ef4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            opacity: 0;
            animation: fadeInUp 0.3s ease forwards;
        `;
        
        input.parentNode.appendChild(errorElement);
    }

    showFieldSuccess(input) {
        if (!input) return;

        input.classList.add('field-success');
        input.style.borderColor = '#d4af37';
        
        setTimeout(() => {
            input.style.borderColor = '';
            input.classList.remove('field-success');
        }, 2000);
    }

    clearFieldError(input) {
        if (!input) return;

        input.classList.remove('field-error');
        input.style.borderColor = '';
        
        const errorElement = input.parentNode.querySelector('.field-error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    onFieldFocus(input) {
        if (!input) return;

        input.parentNode.classList.add('field-focused');
        input.style.borderColor = '#d4af37';
        input.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
    }

    onFieldBlur(input) {
        if (!input) return;

        input.parentNode.classList.remove('field-focused');
        input.style.borderColor = '';
        input.style.boxShadow = '';
        
        if (input.value.trim()) {
            input.parentNode.classList.add('field-filled');
        } else {
            input.parentNode.classList.remove('field-filled');
        }
    }

    isValidEmail(email) {
        // Security: Robust email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254;
    }
}

/**
 * Scroll Animator Component
 * Performance-optimized scroll animations
 */
class ScrollAnimatorComponent {
    constructor() {
        this.scrollElements = document.querySelectorAll('[data-scroll-animation]');
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.setupScrollObserver();
        this.setupPerformanceOptimizations();
    }

    setupScrollObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('[ScrollAnimator] IntersectionObserver not supported');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimating) {
                    this.isAnimating = true;
                    const animation = entry.target.getAttribute('data-scroll-animation');
                    this.animateElement(entry.target, animation);
                    observer.unobserve(entry.target);
                    
                    // Reset animation lock
                    setTimeout(() => {
                        this.isAnimating = false;
                    }, 600);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        this.scrollElements.forEach(el => {
            if (el) observer.observe(el);
        });
    }

    animateElement(element, animation) {
        if (!element || !animation) return;

        // Performance: Use requestAnimationFrame
        requestAnimationFrame(() => {
            switch (animation) {
                case 'fadeInUp':
                    this.fadeInUp(element);
                    break;
                case 'slideInLeft':
                    this.slideInLeft(element);
                    break;
                case 'scaleIn':
                    this.scaleIn(element);
                    break;
                default:
                    console.warn('[ScrollAnimator] Unknown animation:', animation);
            }
        });
    }

    fadeInUp(element) {
        element.style.cssText = `
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50);
    }

    slideInLeft(element) {
        element.style.cssText = `
            opacity: 0;
            transform: translateX(-50px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, 50);
    }

    scaleIn(element) {
        element.style.cssText = `
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 50);
    }

    setupPerformanceOptimizations() {
        // Performance: Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
            console.log('[ScrollAnimator] Reducing animations for low-end device');
            document.documentElement.style.setProperty('--animation-duration', '150ms');
        }
    }
}

/**
 * Performance Monitor Component
 * Memory and performance tracking
 */
class PerformanceMonitorComponent {
    constructor() {
        this.metrics = {
            componentLoadTime: 0,
            memoryUsage: 0,
            animationFrames: 0,
            errorCount: 0
        };
        
        this.init();
    }

    init() {
        this.measureComponentLoadTime();
        this.monitorMemoryUsage();
        this.setupErrorTracking();
    }

    measureComponentLoadTime() {
        const startTime = performance.now();
        
        requestAnimationFrame(() => {
            this.metrics.componentLoadTime = performance.now() - startTime;
            
            if (this.metrics.componentLoadTime > 100) {
                console.warn(`[PerformanceMonitor] Components took ${this.metrics.componentLoadTime.toFixed(2)}ms to load`);
            }
        });
    }

    monitorMemoryUsage() {
        if (!('memory' in performance)) return;
        
        setInterval(() => {
            const memory = performance.memory;
            this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
            
            if (this.metrics.memoryUsage > 50) {
                console.warn(`[PerformanceMonitor] High memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
            }
        }, 30000);
    }

    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.metrics.errorCount++;
            console.error('[PerformanceMonitor] JavaScript error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.metrics.errorCount++;
            console.error('[PerformanceMonitor] Unhandled promise rejection:', event.reason);
        });
    }

    getMetrics() {
        return {
            ...this.metrics,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
    }
}

// Initialize component manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.ComponentManager = new ComponentManager();
        console.log('[ComponentManager] Initialized successfully');
    } catch (error) {
        console.error('[ComponentManager] Failed to initialize:', error);
    }
});

// Export for potential external use
window.LumomireComponents = {
    ComponentManager,
    PricingCardComponent,
    DashboardPreviewComponent,
    FeatureCardComponent,
    FormValidatorComponent,
    ScrollAnimatorComponent,
    PerformanceMonitorComponent
};

// Performance monitoring on load
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`[ComponentManager] Total load time: ${loadTime.toFixed(2)}ms`);
    
    // Memory usage check
    if ('memory' in performance) {
        const memoryMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
        console.log(`[ComponentManager] Memory usage: ${memoryMB}MB`);
    }
});