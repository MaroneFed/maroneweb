// MARONE WEB - Ultra Premium Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything
    initMarone();
    
    // Loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('loaded');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.padding = '1rem 0';
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        }
        
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
    
    // Plan selection
    const planButtons = document.querySelectorAll('.card-button');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.dataset.plan;
            const planSelect = document.getElementById('plan');
            
            // Map plan to option value
            const planMap = {
                'vitrine': 'Site Vitrine - 399€',
                'pro': 'Site Pro - 499€',
                'ecommerce': 'E-commerce - 1 249€ + 35€/mois'
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
    const successToast = document.getElementById('notificationToast');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-button');
            const originalText = submitBtn.querySelector('.submit-text').textContent;
            submitBtn.querySelector('.submit-text').textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            try {
                // Send form data using FormSubmit
                const formData = new FormData(this);
                
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success toast
                    showToast();
                    
                    // Reset form
                    this.reset();
                    
                    // Show success message
                    showNotification('🎉 Parfait ! Nous vous contactons dans l\'heure.', 'success');
                    
                    // Scroll to top
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 1000);
                } else {
                    throw new Error('Erreur réseau');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('⚠️ Une erreur est survenue. Réessayez ou appelez-nous.', 'error');
            } finally {
                // Reset button
                submitBtn.querySelector('.submit-text').textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Initialize particles
    initParticles();
    
    // Initialize animations
    initAnimations();
});

// Initialize Marone Web
function initMarone() {
    // Text animations
    initTextAnimations();
    
    // Card hover effects
    initCardEffects();
    
    // Scroll animations
    initScrollAnimations();
}

// Particles Background
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particles array
    const particles = [];
    const particleCount = 80;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
            color: `rgba(255, ${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 0.3 + 0.1})`
        });
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
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
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 0, 0, ${0.1 * (1 - distance / 100)})`;
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
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Text Animations
function initTextAnimations() {
    const titles = document.querySelectorAll('.title-line');
    titles.forEach((title, index) => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Card Effects
function initCardEffects() {
    const cards = document.querySelectorAll('.pricing-card, .portfolio-card, .info-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 2;
            const rotateX = ((centerY - y) / centerY) * 2;
            
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
    const animateElements = document.querySelectorAll('.pricing-card, .portfolio-card, .process-step, .info-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Show Toast
function showToast() {
    const toast = document.getElementById('notificationToast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Show Notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `floating-notification ${type}`;
    
    const icon = type === 'success' ? '🎉' : '⚠️';
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
            .floating-notification {
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
            
            .floating-notification.success {
                border-left: 4px solid var(--success);
            }
            
            .floating-notification.error {
                border-left: 4px solid var(--danger);
            }
            
            .floating-notification.show {
                transform: translateX(-50%) translateY(0);
            }
            
            .notification-icon {
                font-size: 1.25rem;
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
            console.log(`🚀 MARONE WEB chargé en ${perfData.domContentLoadedEventEnd - perfData.fetchStart}ms`);
        }
    }
    
    // Easter egg
    console.log(`
    ╔══════════════════════════════════════╗
    ║      MARONE WEB - SITE EXCEPTIONNEL  ║
    ║                                      ║
    ║  🚀 Sites web pro à 399€            ║
    ║  ⚡ Livraison 24h                    ║
    ║  🎯 500+ clients satisfaits         ║
    ║  📧 contact@maroneweb.com           ║
    ║                                      ║
    ╚══════════════════════════════════════╝
    `);
});

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
    .pricing-card:nth-child(1) { transition-delay: 0.1s; }
    .pricing-card:nth-child(2) { transition-delay: 0.2s; }
    .pricing-card:nth-child(3) { transition-delay: 0.3s; }
    
    .portfolio-card:nth-child(1) { transition-delay: 0.1s; }
    .portfolio-card:nth-child(2) { transition-delay: 0.2s; }
    .portfolio-card:nth-child(3) { transition-delay: 0.3s; }
    
    .process-step:nth-child(1) { transition-delay: 0.1s; }
    .process-step:nth-child(2) { transition-delay: 0.2s; }
    .process-step:nth-child(3) { transition-delay: 0.3s; }
    .process-step:nth-child(4) { transition-delay: 0.4s; }
    
    .info-card:nth-child(1) { transition-delay: 0.1s; }
    .info-card:nth-child(2) { transition-delay: 0.2s; }
    .info-card:nth-child(3) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);