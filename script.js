// Marone Web - Premium Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything
    initMaroneWeb();
    
    // Preloader
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('loaded');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2000);
    
    // Mobile Menu
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const overlayLinks = document.querySelectorAll('.overlay-link');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    closeMenu.addEventListener('click', closeMobileMenu);
    overlayLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    function closeMobileMenu() {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Navigation scroll effect
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Pricing toggle
    const toggleOptions = document.querySelectorAll('.toggle-option');
    const monthlyPrices = document.querySelectorAll('.plan-price.monthly');
    const yearlyPrices = document.querySelectorAll('.plan-price.yearly');
    
    toggleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const plan = this.dataset.plan;
            
            toggleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            if (plan === 'monthly') {
                monthlyPrices.forEach(p => p.classList.add('active'));
                yearlyPrices.forEach(p => p.classList.remove('active'));
            } else {
                monthlyPrices.forEach(p => p.classList.remove('active'));
                yearlyPrices.forEach(p => p.classList.add('active'));
            }
        });
    });
    
    // Plan selection
    const planButtons = document.querySelectorAll('.card-cta');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.dataset.plan;
            const planSelect = document.getElementById('plan');
            
            // Map plan to option value
            const planMap = {
                'starter': '35€/mois - Starter',
                'pro': '399€ - Pro',
                'ecommerce': '1249€ - E-commerce'
            };
            
            if (planMap[plan]) {
                planSelect.value = planMap[plan];
                // Scroll to contact form
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                // Focus on name field
                document.getElementById('name').focus();
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('quoteForm');
    const successToast = document.getElementById('successToast');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-button');
            const originalText = submitBtn.querySelector('.submit-text').textContent;
            submitBtn.querySelector('.submit-text').textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Send email via FormSubmit
            fetch(this.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    // Show success toast
                    showToast();
                    
                    // Reset form
                    this.reset();
                    
                    // Show success message
                    showNotification('Devis envoyé ! Nous vous contactons dans les 2 heures.', 'success');
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
            })
            .finally(() => {
                // Reset button
                submitBtn.querySelector('.submit-text').textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Initialize particles
    initParticles();
    
    // Initialize animations
    initAnimations();
});

// Initialize Marone Web
function initMaroneWeb() {
    // Premium cursor
    initPremiumCursor();
    
    // Text animations
    initTextAnimations();
    
    // Card hover effects
    initCardEffects();
    
    // Scroll animations
    initScrollAnimations();
}

// Premium Cursor
function initPremiumCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'marone-cursor';
    document.body.appendChild(cursor);
    
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Trail with delay
        setTimeout(() => {
            trail.style.left = `${e.clientX}px`;
            trail.style.top = `${e.clientY}px`;
        }, 100);
    });
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .benefit-card, .pricing-card, .portfolio-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
    
    // Click effect
    document.addEventListener('click', (e) => {
        cursor.classList.add('click');
        setTimeout(() => cursor.classList.remove('click'), 300);
    });
}

// Text Animations
function initTextAnimations() {
    const words = document.querySelectorAll('.title-word');
    words.forEach((word, index) => {
        word.style.animationDelay = `${index * 0.1}s`;
    });
}

// Card Effects
function initCardEffects() {
    const cards = document.querySelectorAll('.benefit-card, .pricing-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 3;
            const rotateX = ((centerY - y) / centerY) * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.benefit-card, .pricing-card, .portfolio-item, .timeline-step, .info-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Update Active Nav Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const overlayLinks = document.querySelectorAll('.overlay-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 100) && 
            window.scrollY < (sectionTop + sectionHeight - 100)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
    
    // Update overlay links
    overlayLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

// Particles Background
function initParticles() {
    const particlesContainer = document.getElementById('heroParticles');
    if (!particlesContainer) return;
    
    particlesJS('heroParticles', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#FF3B30"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#FF3B30",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 200,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// Animations
function initAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s var(--transition), transform 0.6s var(--transition);
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Staggered animations */
        .benefit-card:nth-child(1) { transition-delay: 0.1s; }
        .benefit-card:nth-child(2) { transition-delay: 0.2s; }
        .benefit-card:nth-child(3) { transition-delay: 0.3s; }
        
        .pricing-card:nth-child(1) { transition-delay: 0.1s; }
        .pricing-card:nth-child(2) { transition-delay: 0.2s; }
        .pricing-card:nth-child(3) { transition-delay: 0.3s; }
        
        .portfolio-item:nth-child(1) { transition-delay: 0.1s; }
        .portfolio-item:nth-child(2) { transition-delay: 0.2s; }
        .portfolio-item:nth-child(3) { transition-delay: 0.3s; }
        
        .timeline-step:nth-child(1) { transition-delay: 0.1s; }
        .timeline-step:nth-child(2) { transition-delay: 0.2s; }
        .timeline-step:nth-child(3) { transition-delay: 0.3s; }
        .timeline-step:nth-child(4) { transition-delay: 0.4s; }
    `;
    document.head.appendChild(style);
}

// Show Toast
function showToast() {
    const toast = document.getElementById('successToast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? '✓' : '✕';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not present
    if (!document.querySelector('.notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(-100%);
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                color: white;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 10000;
                transition: transform 0.3s var(--transition);
            }
            
            .notification.success {
                border-left: 4px solid var(--success);
            }
            
            .notification.error {
                border-left: 4px solid var(--danger);
            }
            
            .notification.show {
                transform: translateX(-50%) translateY(0);
            }
            
            .notification-icon {
                font-size: 1.25rem;
                font-weight: bold;
            }
            
            .notification.success .notification-icon {
                color: var(--success);
            }
            
            .notification.error .notification-icon {
                color: var(--danger);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Show
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Performance monitoring
window.addEventListener('load', () => {
    // Track performance
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log(`🚀 Marone Web loaded in ${perfData.domContentLoadedEventEnd - perfData.fetchStart}ms`);
        }
    }
});

// Easter egg - Console message
console.log(`
🚀 MARONE WEB - Premium Web Development
🔗 Site: https://maroneweb.com
📧 Contact: martin.federer08@gmail.com
💎 Création de sites web Apple-Level
🎯 Conversions maximales garanties
`);