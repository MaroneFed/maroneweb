// MARONEWEB - Script Final Perfectionné
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 MARONEWEB initialisé');
    
    // Initialisation
    initMaroneWeb();
    
    // Critical loading
    setTimeout(() => {
        document.getElementById('criticalLoading').classList.add('loaded');
        document.body.classList.add('loaded');
    }, 500);
    
    // Mobile menu
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileClose.addEventListener('click', closeMobileMenu);
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    function closeMobileMenu() {
        mobileToggle.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Header scroll effect
    const header = document.querySelector('.main-header');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Active nav link
        updateActiveNavLink();
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Pricing toggle
    const toggleOptions = document.querySelectorAll('.toggle-option');
    const oneTimePrices = document.querySelectorAll('.plan-price.one-time');
    const monthlyPrices = document.querySelectorAll('.plan-price.monthly');
    
    toggleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const plan = this.dataset.plan;
            
            toggleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            if (plan === 'one-time') {
                oneTimePrices.forEach(p => p.classList.add('active'));
                monthlyPrices.forEach(p => p.classList.remove('active'));
            } else {
                oneTimePrices.forEach(p => p.classList.remove('active'));
                monthlyPrices.forEach(p => p.classList.add('active'));
            }
        });
    });
    
    // Plan selection
    const planButtons = document.querySelectorAll('.card-button');
    const serviceSelect = document.getElementById('service');
    
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.dataset.plan;
            
            // Map plan to service
            const planMap = {
                'starter': 'Site Vitrine - 199€',
                'pro': 'Site Pro - 399€',
                'ecommerce': 'E-commerce - 799€'
            };
            
            if (planMap[plan]) {
                serviceSelect.value = planMap[plan];
                // Scroll to contact
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                // Focus on name
                document.getElementById('name').focus();
            }
        });
    });
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-button');
            const originalText = submitBtn.querySelector('.submit-text').textContent;
            
            // Show loading
            submitBtn.querySelector('.submit-text').textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            try {
                // Send to FormSubmit
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    submitBtn.querySelector('.submit-text').textContent = 'Envoyé !';
                    submitBtn.style.background = 'var(--success)';
                    
                    // Show success message
                    showNotification('🎉 Message envoyé ! Nous vous répondrons rapidement.', 'success');
                    
                    // Reset form
                    setTimeout(() => {
                        this.reset();
                        submitBtn.querySelector('.submit-text').textContent = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 2000);
                } else {
                    throw new Error('Erreur réseau');
                }
            } catch (error) {
                console.error('Erreur:', error);
                submitBtn.querySelector('.submit-text').textContent = 'Erreur';
                submitBtn.style.background = 'var(--warning)';
                
                showNotification('⚠️ Une erreur est survenue. Veuillez réessayer.', 'error');
                
                setTimeout(() => {
                    submitBtn.querySelector('.submit-text').textContent = originalText;
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

// Initialize MARONEWEB
function initMaroneWeb() {
    // Add performance CSS
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s var(--transition), transform 0.6s var(--transition);
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
        .portfolio-bubble:nth-child(4) { transition-delay: 0.4s; }
        
        .pricing-card:nth-child(1) { transition-delay: 0.1s; }
        .pricing-card:nth-child(2) { transition-delay: 0.2s; }
        .pricing-card:nth-child(3) { transition-delay: 0.3s; }
        
        .process-step:nth-child(1) { transition-delay: 0.1s; }
        .process-step:nth-child(2) { transition-delay: 0.2s; }
        .process-step:nth-child(3) { transition-delay: 0.3s; }
        .process-step:nth-child(4) { transition-delay: 0.4s; }
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
    
    // Set dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create particles
    const particles = [];
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 10));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `rgba(255, 51, 102, ${Math.random() * 0.3 + 0.1})`
        });
    }
    
    // Animation loop
    function animateParticles() {
        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            // Move particle
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
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 51, 102, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
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
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.service-card, .portfolio-bubble, .pricing-card, .process-step').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Update Active Nav Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Show Notification
function showNotification(message, type = 'success') {
    // Remove existing
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if needed
    if (!document.querySelector('#toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .notification-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                color: white;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 10000;
                transform: translateX(120%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .notification-toast.success {
                border-left: 4px solid var(--success);
            }
            
            .notification-toast.error {
                border-left: 4px solid var(--warning);
            }
            
            .notification-toast.show {
                transform: translateX(0);
            }
            
            .toast-content i {
                font-size: 1.25rem;
            }
            
            .notification-toast.success .toast-content i {
                color: var(--success);
            }
            
            .notification-toast.error .toast-content i {
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
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize animations
function initAnimations() {
    // Hero title animation
    const words = document.querySelectorAll('.word');
    words.forEach((word, index) => {
        word.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Floating devices animation
    const devices = document.querySelectorAll('.floating-device');
    devices.forEach((device, index) => {
        device.style.animationDelay = `${index * 2}s`;
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perf = performance.getEntriesByType('navigation')[0];
        if (perf) {
            const loadTime = perf.domContentLoadedEventEnd - perf.fetchStart;
            console.log(`⚡ MARONEWEB chargé en ${Math.round(loadTime)}ms`);
        }
    }
    
    // Easter egg
    console.log(`
    ╔══════════════════════════════════════╗
    ║         🚀 MARONEWEB                 ║
    ║   Création de sites web exceptionnels ║
    ║   À partir de 199€                  ║
    ║   contact@maroneweb.com             ║
    ╚══════════════════════════════════════╝
    `);
});