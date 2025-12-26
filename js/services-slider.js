/**
 * Slider Component
 * A vanilla JavaScript slider with accessibility features
 */

class Slider {
    /**
     * Initialize the slider
     * @param {HTMLElement} element - The slider container element
     * @param {Object} options - Configuration options
     */
    constructor(element, options = {}) {
        // Elements
        this.slider = element;
        this.track = element.querySelector('.slider__track');
        this.slides = Array.from(element.querySelectorAll('.slider__slide'));
        this.prevButton = element.querySelector('.slider__arrow--prev');
        this.nextButton = element.querySelector('.slider__arrow--next');
        this.dotsContainer = element.querySelector('.slider__dots');

        // Configuration
        this.options = {
            autoplay: options.autoplay ?? true,
            autoplayInterval: options.autoplayInterval ?? 10000, // 10 seconds
            infinite: options.infinite ?? true,
            slidesToShow: options.slidesToShow ?? 1,
            slidesToScroll: options.slidesToScroll ?? 1,
            enableTouch: options.enableTouch ?? true,
            enableKeyboard: options.enableKeyboard ?? true,
            ...options
        };

        // State
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.originalSlidesCount = this.slides.length;
        this.isAnimating = false;
        this.autoplayTimer = null;
        this.touchStartX = 0;
        this.touchEndX = 0;

        // Responsive configuration
        this.breakpoints = {
            desktop: 1150
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize the slider
     */
    init() {
        if (this.totalSlides === 0) return;

        // Update slides to show based on viewport
        this.updateSlidesToShow();

        // Clone slides for infinite loop effect
        if (this.options.infinite) {
            this.cloneSlides();
        }

        // Create dots navigation
        this.createDots();

        // Setup event listeners
        this.setupEventListeners();

        // Update slider state
        this.updateSlider();

        // Initialize perspective effect
        this.updatePerspective();

        // Start autoplay if enabled
        if (this.options.autoplay) {
            this.startAutoplay();
        }

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.updateSlidesToShow();
            this.updateSlider();
            this.updatePerspective();
        }, 250));
    }

    /**
     * Clone slides for infinite loop effect
     */
    cloneSlides() {
        // Don't try to clone more slides than we have
        const slidesToClone = Math.min(Math.max(this.options.slidesToShow, 2), this.originalSlidesCount);

        // Clone first slides and append to end
        for (let i = 0; i < slidesToClone; i++) {
            if (this.slides[i]) {
                const clone = this.slides[i].cloneNode(true);
                clone.classList.add('slider__slide--clone');
                this.track.appendChild(clone);
            }
        }

        // Clone last slides and prepend to beginning
        for (let i = this.slides.length - 1; i >= Math.max(0, this.slides.length - slidesToClone); i--) {
            if (this.slides[i]) {
                const clone = this.slides[i].cloneNode(true);
                clone.classList.add('slider__slide--clone');
                this.track.insertBefore(clone, this.track.firstChild);
            }
        }

        // Update slides array to include clones
        this.allSlides = Array.from(this.track.querySelectorAll('.slider__slide'));

        // Set initial position to first real slide (after prepended clones)
        this.currentIndex = slidesToClone;

        // Set initial transform without transition
        const slideWidth = 100 / this.options.slidesToShow;
        const transformValue = -(this.currentIndex * slideWidth);
        this.track.style.transition = 'none';
        this.track.style.transform = `translateX(${transformValue}%)`;

        // Force reflow
        this.track.offsetHeight;

        // Re-enable transition
        this.track.style.transition = '';
    }

    /**
     * Update number of slides to show based on viewport
     */
    updateSlidesToShow() {
        const width = window.innerWidth;

        // Update for services slider
        if (this.slider.classList.contains('slider--services')) {
            if (width < this.breakpoints.desktop) {
                this.options.slidesToShow = 1;
                this.options.slidesToScroll = 1;
            } else {
                this.options.slidesToShow = 3;
                this.options.slidesToScroll = 1;
            }
        }

        // Update for reviews slider (same rules as services)
        if (this.slider.classList.contains('slider--reviews')) {
            if (width < this.breakpoints.desktop) {
                this.options.slidesToShow = 1;
                this.options.slidesToScroll = 1;
            } else {
                this.options.slidesToShow = 3;
                this.options.slidesToScroll = 1;
            }
        }
    }

    /**
     * Create dot navigation buttons
     */
    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';

        // Use original slide count for dots
        const totalDots = this.originalSlidesCount;

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider__dot');
            dot.setAttribute('type', 'button');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Перейти до слайду ${i + 1}`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

            if (i === 0) {
                dot.classList.add('slider__dot--active');
            }

            dot.addEventListener('click', () => {
                const offset = this.options.infinite ? Math.min(Math.max(this.options.slidesToShow, 2), this.originalSlidesCount) : 0;
                this.goToSlide(offset + i);
            });

            this.dotsContainer.appendChild(dot);
        }

        this.dots = Array.from(this.dotsContainer.querySelectorAll('.slider__dot'));
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prev());
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.next());
        }

        // Pause autoplay on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
        this.slider.addEventListener('mouseleave', () => {
            if (this.options.autoplay) {
                this.startAutoplay();
            }
        });

        // Touch events
        if (this.options.enableTouch) {
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
            this.track.addEventListener('touchend', () => this.handleTouchEnd());
        }

        // Keyboard navigation
        if (this.options.enableKeyboard) {
            this.slider.addEventListener('keydown', (e) => this.handleKeyboard(e));
        }
    }

    /**
     * Go to specific slide
     * @param {number} index - Target slide index
     */
    goToSlide(index) {
        if (this.isAnimating) return;

        this.currentIndex = index;
        this.updateSlider();
    }

    /**
     * Go to next slide(s)
     */
    next() {
        const nextIndex = this.currentIndex + this.options.slidesToScroll;
        this.goToSlide(nextIndex);
    }

    /**
     * Go to previous slide(s)
     */
    prev() {
        const prevIndex = this.currentIndex - this.options.slidesToScroll;
        this.goToSlide(prevIndex);
    }

    /**
     * Update slider position and state
     */
    updateSlider() {
        if (!this.track) return;

        this.isAnimating = true;

        // Calculate transform percentage
        const slideWidth = 100 / this.options.slidesToShow;
        const transformValue = -(this.currentIndex * slideWidth);

        this.track.style.transform = `translateX(${transformValue}%)`;

        // Update perspective classes for center slide
        this.updatePerspective();

        // Update dots
        this.updateDots();

        // Update ARIA attributes
        this.updateAriaAttributes();

        // Handle infinite loop repositioning
        if (this.options.infinite) {
            setTimeout(() => {
                this.checkAndRepositionForInfiniteLoop();
                this.isAnimating = false;
            }, 500);
        } else {
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        }
    }

    /**
     * Check if we need to reposition for infinite loop
     */
    checkAndRepositionForInfiniteLoop() {
        const offset = Math.min(Math.max(this.options.slidesToShow, 2), this.originalSlidesCount);
        const maxIndex = offset + this.originalSlidesCount;

        // If we've scrolled past the last real slide, jump to the beginning clones
        if (this.currentIndex >= maxIndex) {
            this.currentIndex = offset;
            this.jumpToSlide(this.currentIndex);
            this.updateDots(); // Update dots after repositioning
            this.updatePerspective(); // Update perspective after repositioning
        }
        // If we've scrolled before the first real slide, jump to the end clones
        else if (this.currentIndex < offset) {
            this.currentIndex = offset + this.originalSlidesCount - 1;
            this.jumpToSlide(this.currentIndex);
            this.updateDots(); // Update dots after repositioning
            this.updatePerspective(); // Update perspective after repositioning
        }
    }

    /**
     * Jump to slide without animation
     */
    jumpToSlide(index) {
        const slideWidth = 100 / this.options.slidesToShow;
        const transformValue = -(index * slideWidth);

        this.track.style.transition = 'none';
        this.track.style.transform = `translateX(${transformValue}%)`;

        // Force reflow
        this.track.offsetHeight;

        // Re-enable transition
        this.track.style.transition = '';
    }

    /**
     * Update perspective classes for center slide effect
     */
    updatePerspective() {
        // Only apply perspective effect for services and reviews sliders
        if (!this.slider.classList.contains('slider--services') &&
            !this.slider.classList.contains('slider--reviews')) return;
        if (window.innerWidth < 1150) return; // Only on desktop (3 cards)

        const allSlides = this.track.querySelectorAll('.slider__slide');

        // Remove center class from all slides
        allSlides.forEach(slide => {
            slide.classList.remove('slider__slide--center');
        });

        // Add center class to the middle visible slide
        // When showing 3 slides, the center one is at currentIndex + 1
        const centerIndex = this.currentIndex + Math.floor(this.options.slidesToShow / 2);
        if (allSlides[centerIndex]) {
            allSlides[centerIndex].classList.add('slider__slide--center');
        }
    }

    /**
     * Update active dot indicator
     */
    updateDots() {
        if (!this.dots) return;

        // Calculate which original slide we're on
        const offset = this.options.infinite ? Math.min(Math.max(this.options.slidesToShow, 2), this.originalSlidesCount) : 0;
        let realIndex = this.currentIndex - offset;

        // Normalize the index to be within the original slides range
        while (realIndex < 0) {
            realIndex += this.originalSlidesCount;
        }
        while (realIndex >= this.originalSlidesCount) {
            realIndex -= this.originalSlidesCount;
        }

        this.dots.forEach((dot, index) => {
            if (index === realIndex) {
                dot.classList.add('slider__dot--active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('slider__dot--active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    }

    /**
     * Update ARIA attributes for accessibility
     */
    updateAriaAttributes() {
        this.slides.forEach((slide, index) => {
            const isVisible = index >= this.currentIndex &&
                             index < this.currentIndex + this.options.slidesToShow;

            slide.setAttribute('aria-hidden', !isVisible);
        });

        // Update live region for screen readers
        const announcement = `Слайд ${this.currentIndex + 1} з ${this.totalSlides}`;
        this.slider.setAttribute('aria-live', 'polite');
        this.slider.setAttribute('aria-atomic', 'true');
    }

    /**
     * Start autoplay
     */
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayTimer = setInterval(() => {
            this.next();
        }, this.options.autoplayInterval);
    }

    /**
     * Stop autoplay
     */
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    /**
     * Handle touch start event
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    /**
     * Handle touch move event
     * @param {TouchEvent} e - Touch event
     */
    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }

    /**
     * Handle touch end event
     */
    handleTouchEnd() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - go to next
                this.next();
            } else {
                // Swipe right - go to previous
                this.prev();
            }
        }

        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.next();
        } else if (e.key === 'Home') {
            e.preventDefault();
            this.goToSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            this.goToSlide(this.totalSlides - this.options.slidesToShow);
        }
    }

    /**
     * Debounce utility function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Destroy the slider and cleanup
     */
    destroy() {
        this.stopAutoplay();

        // Remove event listeners
        if (this.prevButton) {
            this.prevButton.removeEventListener('click', () => this.prev());
        }
        if (this.nextButton) {
            this.nextButton.removeEventListener('click', () => this.next());
        }

        // Reset styles
        this.track.style.transform = '';
    }
}

/**
 * Initialize sliders on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sliders initialization starting...');

    // Initialize Services Slider
    const servicesSlider = document.getElementById('servicesSlider');
    console.log('servicesSlider element:', servicesSlider);

    if (servicesSlider) {
        console.log('Initializing services slider...');
        try {
            const sliderInstance = new Slider(servicesSlider, {
                autoplay: true,
                autoplayInterval: 10000,
                infinite: true,
                slidesToShow: 3, // Will be adjusted by responsive logic
                slidesToScroll: 1, // Scroll one item at a time
                enableTouch: true,
                enableKeyboard: true
            });
            console.log('Services slider initialized successfully:', sliderInstance);
        } catch (error) {
            console.error('Error initializing services slider:', error);
        }
    } else {
        console.error('servicesSlider element not found!');
    }

    // Initialize Reviews Slider
    const reviewsSlider = document.getElementById('reviewsSlider');
    console.log('reviewsSlider element:', reviewsSlider);

    if (reviewsSlider) {
        console.log('Initializing reviews slider...');
        try {
            const reviewsInstance = new Slider(reviewsSlider, {
                autoplay: true,
                autoplayInterval: 10000,
                infinite: true,
                slidesToShow: 3, // Will be adjusted by responsive logic
                slidesToScroll: 1, // Scroll one item at a time
                enableTouch: true,
                enableKeyboard: true
            });
            console.log('Reviews slider initialized successfully:', reviewsInstance);
        } catch (error) {
            console.error('Error initializing reviews slider:', error);
        }
    } else {
        console.error('reviewsSlider element not found!');
    }
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('Document already loaded, initializing immediately');
    setTimeout(() => {
        // Fallback for services slider
        const servicesSlider = document.getElementById('servicesSlider');
        if (servicesSlider && !servicesSlider.querySelector('.slider__slide--clone')) {
            console.log('Fallback: Initializing services slider...');
            new Slider(servicesSlider, {
                autoplay: true,
                autoplayInterval: 10000,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                enableTouch: true,
                enableKeyboard: true
            });
        }

        // Fallback for reviews slider
        const reviewsSlider = document.getElementById('reviewsSlider');
        if (reviewsSlider && !reviewsSlider.querySelector('.slider__slide--clone')) {
            console.log('Fallback: Initializing reviews slider...');
            new Slider(reviewsSlider, {
                autoplay: true,
                autoplayInterval: 10000,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                enableTouch: true,
                enableKeyboard: true
            });
        }
    }, 100);
}
