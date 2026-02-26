/* ========================================
   BREWED WITH PASSION - JAVASCRIPT
   Modern Café Website Interactions
   ======================================== */

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const categoryBtns = document.querySelectorAll('.category-btn');
const menuCategories = document.querySelectorAll('.menu-category');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxImg = document.getElementById('lightbox-img');

let currentImageIndex = 1;

/* ========================================
   MOBILE MENU TOGGLE
   ======================================== */
function toggleMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

hamburger.addEventListener('click', toggleMenu);

// Close menu when nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideNav = navMenu.contains(e.target) || hamburger.contains(e.target);
    if (!isClickInsideNav && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

/* ========================================
   SMOOTH SCROLLING
   ======================================== */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ========================================
   MENU CATEGORY FILTERING
   ======================================== */
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get the category
        const category = btn.getAttribute('data-category');
        
        // Hide all menu categories
        menuCategories.forEach(cat => {
            cat.style.display = 'none';
        });
        
        // Show selected category
        const activeCategory = document.querySelector(`.menu-category[data-category="${category}"]`);
        if (activeCategory) {
            activeCategory.style.display = 'contents';
            
            // Animate menu cards
            const cards = activeCategory.querySelectorAll('.menu-card');
            cards.forEach((card, index) => {
                card.style.animation = `none`;
                setTimeout(() => {
                    card.style.animation = `fadeInUp 0.6s ease-out forwards`;
                    card.style.animationDelay = `${index * 0.1}s`;
                }, 10);
            });
        }
    });
});

/* ========================================
   GALLERY & LIGHTBOX
   ======================================== */
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        currentImageIndex = item.getAttribute('data-image');
        openLightbox();
    });
});

function openLightbox() {
    lightbox.classList.add('active');
    updateLightboxImage();
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateLightboxImage() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const totalImages = galleryItems.length;
    
    // Wrap around
    if (currentImageIndex > totalImages) {
        currentImageIndex = 1;
    }
    if (currentImageIndex < 1) {
        currentImageIndex = totalImages;
    }
    
    // Update image
    const activeItem = document.querySelector(`.gallery-item[data-image="${currentImageIndex}"]`);
    if (activeItem) {
        const img = activeItem.querySelector('.responsive-image');
        if (img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }
    }
}

lightboxClose.addEventListener('click', closeLightbox);

lightboxNext.addEventListener('click', () => {
    currentImageIndex++;
    updateLightboxImage();
});

lightboxPrev.addEventListener('click', () => {
    currentImageIndex--;
    updateLightboxImage();
});

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight') {
        currentImageIndex++;
        updateLightboxImage();
    } else if (e.key === 'ArrowLeft') {
        currentImageIndex--;
        updateLightboxImage();
    } else if (e.key === 'Escape') {
        closeLightbox();
    }
});

/* ========================================
   SCROLL ANIMATIONS (Intersection Observer)
   ======================================== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow on scroll
    if (scrollTop > 10) {
        navbar.style.boxShadow = 'var(--shadow-medium)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-light)';
    }
    
    lastScrollTop = scrollTop;
});

/* ========================================
   SCROLL PROGRESS INDICATOR
   ======================================== */
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    // You can use this for a progress bar if desired
    // For now, it's just calculated for potential use
});

/* ========================================
   PERFORMANCE - LAZY LOADING CONSIDERATION
   ======================================== */
// Native lazy loading for images (if using real images)
// Add loading="lazy" attribute to img tags in HTML

/* ========================================
   FORM VALIDATION (if contact form is added)
   ======================================== */
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add form validation logic here
            console.log('Form submitted');
        });
    });
}

// Initialize form validation when DOM is ready
document.addEventListener('DOMContentLoaded', setupFormValidation);

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Debounce function for resize events
function debounce(func, wait) {
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Add responsive adjustments here if needed
}, 250));

/* ========================================
   ACCESSIBILITY IMPROVEMENTS
   ======================================== */

// Add keyboard navigation for gallery
document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            currentImageIndex = item.getAttribute('data-image');
            openLightbox();
        }
    });
});

/* ========================================
   INITIALIZATION
   ======================================== */
console.log('Brewed With Passion - Website loaded successfully');
