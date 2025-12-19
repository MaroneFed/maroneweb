// MARONEWEB - Version ULTRA STYLÉE
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    initMaroneWeb();
    
    // Loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('loaded');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.classList.add('loaded');
        }, 500);
    }, 1500);
    
    // Mobile menu
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileClose.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    function closeMobileMenu() {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Header scroll effect
    const header = document.querySelector('.main-header');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        // Header effect
        if (window.scrollY > 50) {
            header.style.padding = '1rem 0';
            header.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.padding = '1.5rem 0';
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        }
        
        // Back to top
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Animate stats
        animateStats();
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav
                updateActiveNav(this);
            }
        });
    });
    
    // Stats counter animation
    function animateStats() {
        const stats = document.querySelectorAll('.stat-value');
        const heroSection = document.getElementById('hero');
        const rect = heroSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                if (!stat.classList.contains('animated')) {
                    animateCounter(stat, target);
                    stat.classList.add('animated');
                }
            });
        }
    }
    
    // Counter animation
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validation du select
            const serviceSelect = document.getElementById('service');
            if (!serviceSelect.value) {
                showNotification('Veuillez sélectionner un service', 'error');
                serviceSelect.focus();
                return;
            }
            
            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            try {
                // Envoi via FormSubmit
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Envoyé !';
                    submitBtn.style.background = 'var(--success)';
                    
                    // Show success notification
                    showNotification('🎉 Demande envoyée ! Nous vous répondrons sous 24h.', 'success');
                    
                    // Reset form after delay
                    setTimeout(() => {
                        this.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 2000);
                } else {
                    throw new Error('Erreur réseau');
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur';
                submitBtn.style.background = 'var(--warning)';
                
                showNotification('⚠️ Une erreur est survenue. Réessayez ou contactez-nous.', 'error');
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
    
    // Initialize particles
    initParticles();
    
    // Initialize animations
    initAnimations();
});

// Initialize MaroneWeb
function initMaroneWeb() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                        transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Stagger animations */
        .service-card:nth-child(1) { transition-delay: 0.1s; }
        .service-card:nth-child(2) { transition-delay: 0.2s; }
        .service-card:nth-child(3) { transition-delay: 0.3s; }
        
        .portfolio-bubble:nth-child(1) { transition-delay: 0.1s; }
        .portfolio-bubble:nth-child(2) { transition-delay: 0.2s; }
        .portfolio-bubble:nth-child(3) { transition-delay: 0.3s; }
        
        .pricing-card:nth-child(1) { transition-delay: 0.1s; }
        .pricing-card:nth-child(2) { transition-delay: 0.2s; }
        .pricing-card:nth-child(3) { transition-delay: 0.3s; }
        
        .process-step:nth-child(1) { transition-delay: 0.1s; }
        .process-step:nth-child(2) { transition-delay: 0.2s; }
        .process-step:nth-child(3) { transition-delay: 0.3s; }
        .process-step:nth-child(4) { transition-delay: 0.4s; }
        
        .info-card:nth-child(1) { transition-delay: 0.1s; }
        .info-card:nth-child(2) { transition-delay: 0.2s; }
        .info-card:nth-child(3) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
    
    // Initialize scroll animations
    initScrollAnimations();
}

// Particles Background
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particles array
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 60 : 100;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
            color: i % 3 === 0 ? 'rgba(255, 51, 102, 0.3)' : 
                   i % 3 === 1 ? 'rgba(51, 102, 255, 0.3)' : 
                   'rgba(0, 214, 143, 0.3)'
        });
    }
    
    // Animation loop
    function animate() {
        // Clear with fade effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Draw connections
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elements = document.querySelectorAll(
        '.service-card, .portfolio-bubble, .pricing-card, .process-step, .info-card'
    );
    
    elements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Update Active Nav
function updateActiveNav(clickedLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
}

// Show Notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if needed
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(10, 10, 10, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 1.25rem 1.75rem;
                color: white;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                transform: translateX(120%);
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 400px;
            }
            
            .notification.success {
                border-left: 4px solid var(--success);
            }
            
            .notification.error {
                border-left: 4px solid var(--warning);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content i {
                font-size: 1.5rem;
            }
            
            .notification.success .notification-content i {
                color: var(--success);
            }
            
            .notification.error .notification-content i {
                color: var(--warning);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Show
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}

// Initialize animations
function initAnimations() {
    // Animate hero elements
    const floatElements = document.querySelectorAll('.float-element');
    floatElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
    });
}

// Performance check
window.addEventListener('load', () => {
    // Log performance
    if ('performance' in window) {
        const perf = performance.getEntriesByType('navigation')[0];
        if (perf) {
            const loadTime = perf.domContentLoadedEventEnd - perf.fetchStart;
            console.log(`🚀 MARONEWEB chargé en ${Math.round(loadTime)}ms`);
        }
    }
    
    // Easter egg
    console.log(`
    ╔══════════════════════════════════════════╗
    ║            MARONEWEB                     ║
    ║    Création de sites web exceptionnels   ║
    ║    contact@maroneweb.fr                  ║
    ║    +33 1 23 45 67 89                     ║
    ║                                          ║
    ║    "Le web n'a jamais été aussi beau"    ║
    ╚══════════════════════════════════════════╝
    `);
});