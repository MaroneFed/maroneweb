// Initialisation lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du curseur personnalisé
    initCustomCursor();
    
    // Gestion du menu responsive
    initMobileMenu();
    
    // Gestion du scroll et animations
    initScrollAnimations();
    
    // Gestion du formulaire de contact
    initContactForm();
    
    // Gestion du bouton "back to top"
    initBackToTop();
    
    // Animation des éléments au chargement
    animateOnLoad();
});

// Curseur personnalisé
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Vérifier si l'appareil a un curseur (pas un écran tactile)
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });
        
        // Effet sur les liens et boutons
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-item, .pricing-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
                cursorFollower.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.backgroundColor = 'transparent';
            });
        });
        
        // Effet sur les éléments flottants
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(3)';
                cursorFollower.style.transform = 'scale(2.5)';
                cursorFollower.style.borderColor = getComputedStyle(element).backgroundColor;
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.borderColor = 'rgba(37, 99, 235, 0.3)';
            });
        });
    } else {
        // Cacher le curseur personnalisé sur les appareils tactiles
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }
}

// Menu mobile
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fermer le menu en cliquant sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Animations au défilement
function initScrollAnimations() {
    // Animation de la navbar au scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Ajouter une ombre à la navbar quand on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '15px 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '20px 0';
        }
        
        // Cacher/montrer la navbar au scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        
        // Mettre à jour l'état des liens de navigation
        updateActiveNavLink();
        
        // Gérer le bouton "back to top"
        const backToTop = document.getElementById('backToTop');
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .pricing-card, .contact-item');
    animateElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// Mettre à jour le lien actif dans la navigation
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

// Formulaire de contact
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            // Ici, normalement, on enverrait les données à un serveur
            // Pour l'exemple, on simule un envoi réussi
            
            // Animation de succès
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
            submitBtn.style.backgroundColor = '#10b981';
            
            // Réinitialiser le formulaire après 3 secondes
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.innerHTML = 'Envoyer le message';
            }, 3000);
            
            // Animation de confirmation
            const confirmation = document.createElement('div');
            confirmation.className = 'confirmation-message';
            confirmation.innerHTML = `
                <div style="position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); z-index: 10000; animation: slideIn 0.5s ease;">
                    <i class="fas fa-check-circle"></i> Votre message a été envoyé avec succès !
                </div>
            `;
            
            document.body.appendChild(confirmation);
            
            setTimeout(() => {
                confirmation.remove();
            }, 4000);
        });
    }
}

// Bouton "back to top"
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animations au chargement
function animateOnLoad() {
    // Animation du titre
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            line.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 300 * index);
    });
    
    // Animation des éléments flottants
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'scale(0)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 1000 + (300 * index));
    });
    
    // Animation de l'écran
    const screen = document.querySelector('.screen');
    setTimeout(() => {
        screen.style.transition = 'transform 1s ease';
        screen.style.transform = 'rotateY(-10deg) rotateX(5deg)';
    }, 1500);
}

// Ajout de styles CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    /* Animation pour les cartes de services */
    .service-card {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .service-card.animate-in {
        animation: fadeUp 0.6s ease forwards;
    }
    
    @keyframes fadeUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Animation pour les éléments du portfolio */
    .portfolio-item {
        opacity: 0;
        transform: scale(0.9);
    }
    
    .portfolio-item.animate-in {
        animation: scaleIn 0.6s ease forwards;
    }
    
    @keyframes scaleIn {
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;

document.head.appendChild(style);