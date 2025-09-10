/**
 * Simple Certificate Slider
 * Author: Md Nahid Hasan
 * Description: A lightweight, responsive certificate slider
 */

// Slider configuration
const sliderConfig = {
    currentSlide: 0,
    itemsPerView: 3,
    totalItems: 0,
    maxSlides: 0
};

// DOM elements
let container, prevBtn, nextBtn, indicators, progressBar;

/**
 * Initialize the slider when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
});

/**
 * Initialize slider elements and setup
 */
function initializeSlider() {
    // Get DOM elements
    container = document.getElementById('certificateContainer');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    indicators = document.getElementById('sliderIndicators');
    progressBar = document.getElementById('progressBar');
    
    if (!container) return; // Exit if slider not found
    
    // Calculate initial values
    updateItemsPerView();
    sliderConfig.totalItems = container.children.length;
    sliderConfig.maxSlides = Math.ceil(sliderConfig.totalItems / sliderConfig.itemsPerView);
    
    // Setup slider
    createIndicators();
    setupEventListeners();
    updateSlider();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
}

/**
 * Calculate how many items to show based on screen size
 */
function updateItemsPerView() {
    const width = window.innerWidth;
    if (width < 768) {
        sliderConfig.itemsPerView = 1; // Mobile
    } else if (width < 1024) {
        sliderConfig.itemsPerView = 2; // Tablet
    } else {
        sliderConfig.itemsPerView = 3; // Desktop
    }
}

/**
 * Create indicator dots
 */
function createIndicators() {
    if (!indicators) return;
    
    indicators.innerHTML = '';
    
    for (let i = 0; i < sliderConfig.maxSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot';
        dot.onclick = () => goToSlide(i);
        indicators.appendChild(dot);
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Navigation buttons
    if (prevBtn) prevBtn.onclick = previousSlide;
    if (nextBtn) nextBtn.onclick = nextSlide;
    
    // Touch/swipe for mobile
    setupTouchEvents();
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') previousSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

/**
 * Setup touch/swipe events for mobile
 */
function setupTouchEvents() {
    let startX = 0;
    
    container.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    container.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        // Swipe threshold
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
        }
    });
}

/**
 * Update slider display
 */
function updateSlider() {
    // Move container
    const slideWidth = 344; // 320px + 24px gap
    const translateX = -(sliderConfig.currentSlide * slideWidth * sliderConfig.itemsPerView);
    container.style.transform = `translateX(${translateX}px)`;
    
    // Update navigation buttons
    updateButtons();
    
    // Update indicators
    updateIndicators();
    
    // Update progress bar
    updateProgress();
}

/**
 * Update navigation button states
 */
function updateButtons() {
    if (prevBtn) {
        prevBtn.disabled = sliderConfig.currentSlide === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = sliderConfig.currentSlide >= sliderConfig.maxSlides - 1;
    }
}

/**
 * Update indicator dots
 */
function updateIndicators() {
    if (!indicators) return;
    
    const dots = indicators.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        if (index === sliderConfig.currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * Update progress bar
 */
function updateProgress() {
    if (!progressBar) return;
    
    const progress = ((sliderConfig.currentSlide + 1) / sliderConfig.maxSlides) * 100;
    progressBar.style.width = progress + '%';
}

/**
 * Go to previous slide
 */
function previousSlide() {
    if (sliderConfig.currentSlide > 0) {
        sliderConfig.currentSlide--;
        updateSlider();
    }
}

/**
 * Go to next slide
 */
function nextSlide() {
    if (sliderConfig.currentSlide < sliderConfig.maxSlides - 1) {
        sliderConfig.currentSlide++;
        updateSlider();
    }
}

/**
 * Go to specific slide
 */
function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < sliderConfig.maxSlides) {
        sliderConfig.currentSlide = slideIndex;
        updateSlider();
    }
}

/**
 * Handle window resize
 */
function handleResize() {
    const oldItemsPerView = sliderConfig.itemsPerView;
    updateItemsPerView();
    
    // Recalculate if items per view changed
    if (oldItemsPerView !== sliderConfig.itemsPerView) {
        sliderConfig.maxSlides = Math.ceil(sliderConfig.totalItems / sliderConfig.itemsPerView);
        
        // Adjust current slide if needed
        if (sliderConfig.currentSlide >= sliderConfig.maxSlides) {
            sliderConfig.currentSlide = sliderConfig.maxSlides - 1;
        }
        
        createIndicators();
        updateSlider();
    }
}

/**
 * Open certificate modal (for clicking on certificates)
 */
function openCertificate(imageSrc, title) {
    // Set modal content
    const modalImg = document.getElementById('modalCertificateImg');
    const modalTitle = document.getElementById('certificateModalLabel');
    
    if (modalImg) modalImg.src = imageSrc;
    if (modalTitle) modalTitle.textContent = title;
    
    // Show modal (Bootstrap)
    const modal = document.getElementById('certificateModal');
    if (modal && typeof bootstrap !== 'undefined') {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}