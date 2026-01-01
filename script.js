/* ===========================================
   MARONEWEB - AGENCE DE SITES WEB IMMERSIFS
   Fichier JavaScript principal - Version Ultra Premium
   =========================================== */

/* ===========================================
   TABLE DES MATIÈRES
   ===========================================
   1. Initialisation et Configuration
   2. Gestion de la Navigation
   3. Animations et Effets Visuels
   4. Portfolio et Filtrage
   5. Carousel de Témoignages
   6. Formulaire de Contact
   7. Compteurs Animés
   8. FAQ Interactive
   9. Effets de Parallaxe
   10. Gestion du Scroll
   11. Initialisation de fullPage.js
   12. Système de Particules
   13. Cursor Personnalisé
   14. Préchargement des Assets
   15. Optimisations Performances
   16. Analytics et Tracking
   17. Gestion des Erreurs
   18. Compatibilité Navigateurs
   =========================================== */

(function() {
  'use strict';

  /* ===========================================
     1. INITIALISATION ET CONFIGURATION
     =========================================== */
  
  // Configuration globale
  const CONFIG = {
    debug: false,
    enableParticles: true,
    enableCursorEffect: true,
    enableAnimations: true,
    scrollOffset: 100,
    animationSpeed: 1,
    particleCount: 100,
    apiEndpoint: 'https://api.maroneweb.com/contact',
    recaptchaKey: '6LcKx8QpAAAAAI7cCJ8Cq6Yv6jQ9lLq8Y6qXx6Yv',
    gaTrackingId: 'UA-XXXXX-Y'
  };

  // État de l'application
  const APP_STATE = {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    scrolled: false,
    currentSection: 0,
    formSubmitting: false,
    particlesActive: false,
    animationsLoaded: false,
    prefersReducedMotion: false
  };

  // Éléments DOM globaux
  const DOM = {
    body: null,
    html: null,
    nav: null,
    mobileMenuBtn: null,
    mobileMenu: null,
    navLinks: [],
    sections: [],
    contactForm: null,
    testimonialSlides: [],
    portfolioItems: [],
    filterButtons: [],
    faqQuestions: [],
    counters: [],
    particlesContainer: null,
    customCursor: null,
    cursorDot: null
  };

  /* ===========================================
     2. INITIALISATION DE L'APPLICATION
     =========================================== */

  /**
   * Initialise l'application complète
   */
  function initApp() {
    log('🚀 Initialisation de MaroneWeb...');
    
    // Vérifier les préférences de réduction de mouvement
    APP_STATE.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Récupérer les éléments DOM
    cacheDOM();
    
    // Détecter le type d'appareil
    detectDevice();
    
    // Initialiser les composants
    initComponents();
    
    // Initialiser les événements
    initEvents();
    
    // Initialiser les animations
    initAnimations();
    
    // Initialiser les effets spéciaux
    initSpecialEffects();
    
    // Initialiser le tracking
    initAnalytics();
    
    log('✅ Application initialisée avec succès');
  }

  /**
   * Cache les éléments DOM fréquemment utilisés
   */
  function cacheDOM() {
    DOM.body = document.body;
    DOM.html = document.documentElement;
    DOM.nav = document.querySelector('.main-nav');
    DOM.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    DOM.mobileMenu = document.getElementById('mobileMenu');
    DOM.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    DOM.sections = document.querySelectorAll('.section');
    DOM.contactForm = document.getElementById('contactForm');
    DOM.testimonialSlides = document.querySelectorAll('.testimonial-slide');
    DOM.portfolioItems = document.querySelectorAll('.portfolio-item');
    DOM.filterButtons = document.querySelectorAll('.filter-btn');
    DOM.faqQuestions = document.querySelectorAll('.faq-question');
    DOM.counters = document.querySelectorAll('.stat-number');
    DOM.particlesContainer = document.createElement('div');
    DOM.customCursor = document.createElement('div');
    DOM.cursorDot = document.createElement('div');
    
    log('📋 DOM mis en cache');
  }

  /**
   * Détecte le type d'appareil
   */
  function detectDevice() {
    const width = window.innerWidth;
    
    APP_STATE.isMobile = width < 768;
    APP_STATE.isTablet = width >= 768 && width < 1024;
    APP_STATE.isDesktop = width >= 1024;
    
    log(`📱 Détection appareil: Mobile=${APP_STATE.isMobile}, Tablet=${APP_STATE.isTablet}, Desktop=${APP_STATE.isDesktop}`);
  }

  /* ===========================================
     3. GESTION DE LA NAVIGATION
     =========================================== */

  /**
   * Initialise la navigation
   */
  function initNavigation() {
    // Menu mobile
    if (DOM.mobileMenuBtn) {
      DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Fermer le menu mobile en cliquant sur un lien
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Fermer le menu mobile en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
      if (DOM.mobileMenu && DOM.mobileMenu.classList.contains('open') && 
          !DOM.mobileMenu.contains(e.target) && 
          !DOM.mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Navigation smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#!') return;
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          scrollToElement(targetElement);
        }
      });
    });

    // Mettre à jour la navigation active
    updateActiveNav();

    log('🗺️ Navigation initialisée');
  }

  /**
   * Basculer le menu mobile
   */
  function toggleMobileMenu() {
    if (!DOM.mobileMenu) return;
    
    const isOpen = DOM.mobileMenu.classList.contains('open');
    
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  /**
   * Ouvrir le menu mobile
   */
  function openMobileMenu() {
    DOM.mobileMenu.classList.add('open');
    DOM.mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
    DOM.body.style.overflow = 'hidden';
    
    // Animation d'entrée
    gsap.fromTo(DOM.mobileMenu, 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
    
    log('📱 Menu mobile ouvert');
  }

  /**
   * Fermer le menu mobile
   */
  function closeMobileMenu() {
    DOM.mobileMenu.classList.remove('open');
    DOM.mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    DOM.body.style.overflow = '';
    
    log('📱 Menu mobile fermé');
  }

  /**
   * Faire défiler vers un élément
   */
  function scrollToElement(element, offset = 100) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    log(`🎯 Défilement vers ${element.id || element.className}`);
  }

  /**
   * Met à jour la navigation active
   */
  function updateActiveNav() {
    const scrollPosition = window.scrollY + 200;
    
    // Parcourir toutes les sections
    DOM.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Mettre à jour les liens de navigation
        DOM.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
        
        APP_STATE.currentSection = Array.from(DOM.sections).indexOf(section);
        log(`📍 Section active: ${sectionId}`);
      }
    });
  }

  /* ===========================================
     4. ANIMATIONS ET EFFETS VISUELS
     =========================================== */

  /**
   * Initialise les animations
   */
  function initAnimations() {
    if (APP_STATE.prefersReducedMotion || !CONFIG.enableAnimations) {
      log('⚡ Animations désactivées (préférence utilisateur)');
      return;
    }

    // Initialiser GSAP
    if (typeof gsap !== 'undefined') {
      initGSAPAnimations();
    }

    // Observer pour les animations au scroll
    initIntersectionObserver();

    // Animer les compteurs
    animateCounters();

    log('🎬 Animations initialisées');
  }

  /**
   * Initialise les animations GSAP
   */
  function initGSAPAnimations() {
    // Animation du hero
    gsap.from('.hero-title', {
      duration: 1.5,
      y: 100,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.5
    });

    gsap.from('.hero-description', {
      duration: 1.5,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.8
    });

    gsap.from('.hero-buttons', {
      duration: 1.5,
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      delay: 1.1
    });

    // Animation des appareils flottants
    gsap.from('.floating-device-1', {
      duration: 2,
      x: -100,
      y: -100,
      opacity: 0,
      rotate: -30,
      ease: 'power3.out',
      delay: 1.5
    });

    gsap.from('.floating-device-2', {
      duration: 2,
      x: 100,
      y: 50,
      opacity: 0,
      rotate: 30,
      ease: 'power3.out',
      delay: 1.8
    });

    gsap.from('.floating-device-3', {
      duration: 2,
      x: -50,
      y: 100,
      opacity: 0,
      rotate: -15,
      ease: 'power3.out',
      delay: 2.1
    });

    // Animation des cartes de services
    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: i * 0.2
      });
    });

    // Animation des avantages
    gsap.utils.toArray('.advantage-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: i * 0.1
      });
    });

    // Animation du formulaire
    gsap.from('.contact-form-container', {
      scrollTrigger: {
        trigger: '.contact-form-container',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      duration: 1.5,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    });

    log('🌀 Animations GSAP configurées');
  }

  /**
   * Initialise l'Intersection Observer pour les animations
   */
  function initIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Ajouter une classe d'animation
          entry.target.classList.add('animated');
          
          // Animation spécifique selon le type d'élément
          if (entry.target.classList.contains('stat-number')) {
            animateCounter(entry.target);
          }
          
          // Arrêter d'observer une fois animé
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer les éléments à animer
    const elementsToAnimate = document.querySelectorAll(
      '.service-card, .advantage-card, .portfolio-item, .testimonial-card, .step-content, .info-card'
    );
    
    elementsToAnimate.forEach(el => observer.observe(el));
    
    log('👁️ Intersection Observer initialisé');
  }

  /**
   * Anime les compteurs
   */
  function animateCounters() {
    DOM.counters.forEach(counter => {
      // Créer un observer pour chaque compteur
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(counter);
            observer.unobserve(counter);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(counter);
    });
  }

  /**
   * Anime un compteur individuel
   */
  function animateCounter(counterElement) {
    const target = parseInt(counterElement.getAttribute('data-count') || counterElement.textContent);
    const duration = 2000; // 2 secondes
    const step = target / (duration / 16); // 60fps
    
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      counterElement.textContent = Math.floor(current).toLocaleString();
    }, 16);
    
    log(`🔢 Compteur animé: ${target}`);
  }

  /* ===========================================
     5. PORTFOLIO ET FILTRAGE
     =========================================== */

  /**
   * Initialise le filtrage du portfolio
   */
  function initPortfolioFilter() {
    if (DOM.filterButtons.length === 0) return;

    DOM.filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Mettre à jour les boutons actifs
        DOM.filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Récupérer le filtre
        const filter = this.getAttribute('data-filter');
        
        // Filtrer les éléments
        filterPortfolioItems(filter);
        
        // Animation
        animatePortfolioFilter();
        
        log(`🎨 Portfolio filtré: ${filter}`);
      });
    });

    log('🖼️ Filtrage portfolio initialisé');
  }

  /**
   * Filtre les éléments du portfolio
   */
  function filterPortfolioItems(filter) {
    if (filter === 'all') {
      // Afficher tous les éléments
      DOM.portfolioItems.forEach(item => {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 10);
      });
      return;
    }

    // Filtrer par catégorie
    DOM.portfolioItems.forEach(item => {
      const category = item.getAttribute('data-category');
      
      if (category === filter) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }

  /**
   * Anime le filtrage du portfolio
   */
  function animatePortfolioFilter() {
    // Animation avec GSAP
    gsap.fromTo('.portfolio-item', 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );
  }

  /* ===========================================
     6. CAROUSEL DE TÉMOIGNAGES
     =========================================== */

  /**
   * Initialise le carousel de témoignages
   */
  function initTestimonialCarousel() {
    if (DOM.testimonialSlides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = DOM.testimonialSlides.length;
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    // Afficher le premier slide
    showSlide(currentSlide);

    // Événements boutons précédent/suivant
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
      });
    }

    // Événements dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });

    // Auto-rotation (toutes les 8 secondes)
    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }, 8000);

    log('💬 Carousel de témoignages initialisé');
  }

  /**
   * Affiche un slide spécifique
   */
  function showSlide(index) {
    // Masquer tous les slides
    DOM.testimonialSlides.forEach(slide => {
      slide.classList.remove('active', 'prev');
      slide.style.opacity = '0';
      slide.style.transform = 'translateX(100px)';
    });

    // Mettre à jour les dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Afficher le slide actif
    const activeSlide = DOM.testimonialSlides[index];
    if (activeSlide) {
      activeSlide.classList.add('active');
      gsap.to(activeSlide, {
        duration: 0.8,
        opacity: 1,
        x: 0,
        ease: 'power3.out'
      });
    }

    // Animation du slide précédent
    const prevIndex = (index - 1 + DOM.testimonialSlides.length) % DOM.testimonialSlides.length;
    const prevSlide = DOM.testimonialSlides[prevIndex];
    if (prevSlide) {
      prevSlide.classList.add('prev');
      gsap.to(prevSlide, {
        duration: 0.8,
        opacity: 0,
        x: -100,
        ease: 'power3.out'
      });
    }
    
    log(`🔄 Slide de témoignage: ${index + 1}/${DOM.testimonialSlides.length}`);
  }

  /* ===========================================
     7. FORMULAIRE DE CONTACT
     =========================================== */

  /**
   * Initialise le formulaire de contact
   */
  function initContactForm() {
    if (!DOM.contactForm) return;

    // Validation en temps réel
    const inputs = DOM.contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearFieldError);
    });

    // Soumission du formulaire
    DOM.contactForm.addEventListener('submit', handleFormSubmit);

    // Bouton nouvelle demande
    const newRequestBtn = document.getElementById('newRequest');
    if (newRequestBtn) {
      newRequestBtn.addEventListener('click', resetForm);
    }

    log('📝 Formulaire de contact initialisé');
  }

  /**
   * Valide un champ du formulaire
   */
  function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // Réinitialiser l'état du champ
    clearFieldError({ target: field });
    
    let isValid = true;
    let errorMessage = '';
    
    // Validation selon le type de champ
    switch (fieldName) {
      case 'name':
        if (value.length < 2) {
          isValid = false;
          errorMessage = 'Le nom doit contenir au moins 2 caractères';
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Veuillez entrer une adresse email valide';
        }
        break;
        
      case 'phone':
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (value && !phoneRegex.test(value)) {
          isValid = false;
          errorMessage = 'Veuillez entrer un numéro de téléphone valide';
        }
        break;
        
      case 'property-type':
      case 'service':
        if (!value) {
          isValid = false;
          errorMessage = 'Ce champ est requis';
        }
        break;
        
      case 'message':
        if (value.length < 10) {
          isValid = false;
          errorMessage = 'Le message doit contenir au moins 10 caractères';
        }
        break;
    }
    
    // Afficher ou masquer l'erreur
    if (!isValid) {
      showFieldError(field, errorMessage);
    }
    
    return isValid;
  }

  /**
   * Affiche une erreur pour un champ
   */
  function showFieldError(field, message) {
    // Supprimer les erreurs existantes
    clearFieldError({ target: field });
    
    // Créer l'élément d'erreur
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: #F87171;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      padding: 0.25rem 0.5rem;
      background: rgba(248, 113, 113, 0.1);
      border-radius: 0.25rem;
      animation: slide-in-up 0.3s ease;
    `;
    
    // Insérer après le champ
    field.parentNode.appendChild(errorElement);
    
    // Style du champ en erreur
    field.style.borderColor = '#F87171';
    field.style.boxShadow = '0 0 0 3px rgba(248, 113, 113, 0.1)';
    
    // Animation
    gsap.fromTo(errorElement, 
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
  }

  /**
   * Efface l'erreur d'un champ
   */
  function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (errorElement) {
      gsap.to(errorElement, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => errorElement.remove()
      });
    }
    
    // Réinitialiser le style du champ
    field.style.borderColor = '';
    field.style.boxShadow = '';
  }

  /**
   * Valide tout le formulaire
   */
  function validateForm() {
    let isValid = true;
    
    const requiredFields = DOM.contactForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!validateField({ target: field })) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  /**
   * Gère la soumission du formulaire
   */
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Vérifier si déjà en cours d'envoi
    if (APP_STATE.formSubmitting) return;
    
    // Valider le formulaire
    if (!validateForm()) {
      showToast('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }
    
    // Démarrer l'envoi
    APP_STATE.formSubmitting = true;
    
    // Afficher le spinner
    const submitBtn = DOM.contactForm.querySelector('.btn-submit');
    const submitText = submitBtn.querySelector('.submit-text');
    const spinner = submitBtn.querySelector('.spinner');
    
    submitText.style.opacity = '0.5';
    spinner.classList.remove('hidden');
    
    // Récupérer les données du formulaire
    const formData = new FormData(DOM.contactForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // Simulation d'envoi (remplacer par un vrai appel API)
      await simulateApiCall(data);
      
      // Succès
      showFormSuccess();
      log('✅ Formulaire soumis avec succès', data);
      
      // Tracking Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          'event_category': 'Contact',
          'event_label': 'Formulaire principal'
        });
      }
      
    } catch (error) {
      // Erreur
      showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
      log('❌ Erreur lors de l\'envoi du formulaire:', error);
    } finally {
      // Réinitialiser l'état
      APP_STATE.formSubmitting = false;
      submitText.style.opacity = '1';
      spinner.classList.add('hidden');
    }
  }

  /**
   * Simule un appel API
   */
  function simulateApiCall(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulation: 90% de succès, 10% d'erreur
        if (Math.random() > 0.1) {
          resolve({ success: true, message: 'Formulaire envoyé avec succès' });
        } else {
          reject(new Error('Erreur serveur simulée'));
        }
      }, 1500);
    });
  }

  /**
   * Affiche le message de succès du formulaire
   */
  function showFormSuccess() {
    const formSuccess = document.getElementById('formSuccess');
    const formContainer = DOM.contactForm.parentNode;
    
    if (formSuccess && formContainer) {
      // Cacher le formulaire
      DOM.contactForm.classList.add('hidden');
      
      // Afficher le message de succès
      formSuccess.classList.remove('hidden');
      
      // Animation
      gsap.fromTo(formSuccess,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      
      // Réinitialiser le formulaire
      DOM.contactForm.reset();
    }
  }

  /**
   * Réinitialise le formulaire
   */
  function resetForm() {
    const formSuccess = document.getElementById('formSuccess');
    const formContainer = DOM.contactForm.parentNode;
    
    if (formSuccess && formContainer) {
      // Cacher le message de succès
      formSuccess.classList.add('hidden');
      
      // Afficher le formulaire
      DOM.contactForm.classList.remove('hidden');
      
      // Animation
      gsap.fromTo(DOM.contactForm,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }

  /* ===========================================
     8. FAQ INTERACTIVE
     =========================================== */

  /**
   * Initialise la FAQ
   */
  function initFAQ() {
    if (DOM.faqQuestions.length === 0) return;

    DOM.faqQuestions.forEach(question => {
      question.addEventListener('click', toggleFAQAnswer);
      
      // Ouvrir la première question par défaut
      if (question.parentElement === DOM.faqQuestions[0].parentElement) {
        setTimeout(() => {
          question.click();
        }, 1000);
      }
    });

    log('❓ FAQ interactive initialisée');
  }

  /**
   * Bascule la réponse de la FAQ
   */
  function toggleFAQAnswer(e) {
    const question = e.currentTarget;
    const answer = question.nextElementSibling;
    const isOpen = question.classList.contains('active');
    
    // Fermer toutes les autres réponses
    DOM.faqQuestions.forEach(q => {
      if (q !== question) {
        q.classList.remove('active');
        const otherAnswer = q.nextElementSibling;
        otherAnswer.classList.remove('open');
        gsap.to(otherAnswer, { height: 0, duration: 0.3 });
      }
    });
    
    // Basculer l'état actuel
    if (isOpen) {
      question.classList.remove('active');
      answer.classList.remove('open');
      gsap.to(answer, { height: 0, duration: 0.3 });
    } else {
      question.classList.add('active');
      answer.classList.add('open');
      gsap.fromTo(answer, 
        { height: 0 },
        { height: answer.scrollHeight, duration: 0.3 }
      );
    }
  }

  /* ===========================================
     9. EFFETS DE PARALLAXE
     =========================================== */

  /**
   * Initialise les effets de parallaxe
   */
  function initParallaxEffects() {
    if (APP_STATE.prefersReducedMotion) return;

    // Effet parallaxe sur les appareils flottants
    window.addEventListener('mousemove', (e) => {
      if (APP_STATE.isMobile) return;
      
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      // Appliquer un léger effet aux appareils
      const devices = document.querySelectorAll('.floating-device');
      devices.forEach((device, index) => {
        const speed = 0.05 * (index + 1);
        const x = (mouseX - 0.5) * 20 * speed;
        const y = (mouseY - 0.5) * 20 * speed;
        
        gsap.to(device, {
          duration: 1,
          x: x,
          y: y,
          ease: 'power2.out'
        });
      });
    });

    // Effet parallaxe au scroll
    window.addEventListener('scroll', () => {
      if (APP_STATE.isMobile) return;
      
      const scrollY = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        const yPos = -(scrollY * speed);
        
        element.style.transform = `translateY(${yPos}px)`;
      });
    });

    log('🌌 Effets parallaxe initialisés');
  }

  /* ===========================================
     10. GESTION DU SCROLL
     =========================================== */

  /**
   * Initialise la gestion du scroll
   */
  function initScrollManagement() {
    // Gestion de la navbar au scroll
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      
      // Navbar sticky
      if (scrollPosition > 100) {
        DOM.nav.classList.add('scrolled');
        APP_STATE.scrolled = true;
      } else {
        DOM.nav.classList.remove('scrolled');
        APP_STATE.scrolled = false;
      }
      
      // Mettre à jour la navigation active
      updateActiveNav();
      
      // Animation progressive des éléments
      animateOnScroll();
    });

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    log('📜 Gestion du scroll initialisée');
  }

  /**
   * Anime les éléments au scroll
   */
  function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      // Vérifier si l'élément est dans la vue
      if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
        if (!element.classList.contains('animated')) {
          element.classList.add('animated');
          
          // Animation spécifique selon le type d'élément
          const animationType = element.getAttribute('data-animation') || 'fade-up';
          animateElement(element, animationType);
        }
      }
    });
  }

  /**
   * Anime un élément avec un effet spécifique
   */
  function animateElement(element, animationType) {
    const animations = {
      'fade-up': {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      },
      'fade-left': {
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
      },
      'fade-right': {
        from: { opacity: 0, x: 50 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
      },
      'scale': {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
      },
      'rotate': {
        from: { opacity: 0, rotation: -10 },
        to: { opacity: 1, rotation: 0, duration: 0.8, ease: 'power3.out' }
      }
    };
    
    const animation = animations[animationType] || animations['fade-up'];
    
    gsap.fromTo(element, animation.from, animation.to);
  }

  /* ===========================================
     11. SYSTÈME DE PARTICULES
     =========================================== */

  /**
   * Initialise le système de particules
   */
  function initParticleSystem() {
    if (!CONFIG.enableParticles || APP_STATE.isMobile) return;
    
    // Créer le conteneur de particules
    DOM.particlesContainer.className = 'particles';
    document.body.appendChild(DOM.particlesContainer);
    
    // Générer les particules
    generateParticles();
    
    // Animer les particules
    animateParticles();
    
    APP_STATE.particlesActive = true;
    log('✨ Système de particules initialisé');
  }

  /**
   * Génère les particules
   */
  function generateParticles() {
    const particleCount = CONFIG.particleCount;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Taille aléatoire
      const size = Math.random() * 5 + 1;
      
      // Position aléatoire
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Couleur aléatoire (gradient)
      const hue = Math.floor(Math.random() * 360);
      const color = `hsla(${hue}, 70%, 60%, ${Math.random() * 0.2 + 0.05})`;
      
      // Appliquer les styles
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${x}%;
        top: ${y}%;
        animation-duration: ${Math.random() * 20 + 10}s;
        animation-delay: ${Math.random() * 5}s;
      `;
      
      DOM.particlesContainer.appendChild(particle);
    }
  }

  /**
   * Anime les particules
   */
  function animateParticles() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
      // Animation de flottement
      gsap.to(particle, {
        x: `+=${(Math.random() - 0.5) * 100}`,
        y: `+=${(Math.random() - 0.5) * 100}`,
        rotation: Math.random() * 360,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      // Animation d'opacité
      gsap.to(particle, {
        opacity: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  /* ===========================================
     12. CURSOR PERSONNALISÉ
     =========================================== */

  /**
   * Initialise le cursor personnalisé
   */
  function initCustomCursor() {
    if (!CONFIG.enableCursorEffect || APP_STATE.isMobile) return;
    
    // Créer les éléments du curseur
    DOM.customCursor.className = 'custom-cursor';
    DOM.cursorDot.className = 'cursor-dot';
    
    document.body.appendChild(DOM.customCursor);
    document.body.appendChild(DOM.cursorDot);
    
    // Suivre la souris
    document.addEventListener('mousemove', (e) => {
      DOM.customCursor.style.left = `${e.clientX}px`;
      DOM.customCursor.style.top = `${e.clientY}px`;
      
      // Délai pour le dot (effet de traînée)
      setTimeout(() => {
        DOM.cursorDot.style.left = `${e.clientX}px`;
        DOM.cursorDot.style.top = `${e.clientY}px`;
      }, 100);
    });
    
    // Effets au survol
    const interactiveElements = document.querySelectorAll(
      'a, button, .service-card, .advantage-card, .portfolio-item, .btn'
    );
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        DOM.customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        DOM.customCursor.style.borderColor = '#6C63FF';
        DOM.customCursor.style.background = 'rgba(108, 99, 255, 0.1)';
      });
      
      el.addEventListener('mouseleave', () => {
        DOM.customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        DOM.customCursor.style.borderColor = '#6C63FF';
        DOM.customCursor.style.background = 'transparent';
      });
    });
    
    // Cacher le curseur par défaut
    document.body.style.cursor = 'none';
    
    // Afficher le curseur personnalisé
    DOM.customCursor.style.opacity = '1';
    DOM.cursorDot.style.opacity = '1';
    
    log('🖱️ Cursor personnalisé initialisé');
  }

  /* ===========================================
     13. PRÉCHARGEMENT DES ASSETS
     =========================================== */

  /**
   * Préchage les assets critiques
   */
  function preloadAssets() {
    // Images critiques
    const criticalImages = [
      'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
    // Polices
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
    
    log('📦 Assets critiques préchargés');
  }

  /* ===========================================
     14. OPTIMISATIONS PERFORMANCES
     =========================================== */

  /**
   * Applique les optimisations de performance
   */
  function applyPerformanceOptimizations() {
    // Désactiver les animations si le périphérique est lent
    if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) {
      CONFIG.enableAnimations = false;
      CONFIG.enableParticles = false;
      log('⚡ Animations désactivées (CPU limité)');
    }
    
    // Utiliser requestAnimationFrame pour les animations fluides
    window.requestAnimationFrame = window.requestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   function(callback) { return setTimeout(callback, 1000/60); };
    
    // Désactiver le zoom sur mobile pour de meilleures performances
    if (APP_STATE.isMobile) {
      document.addEventListener('touchmove', function(e) {
        if (e.scale !== 1) {
          e.preventDefault();
        }
      }, { passive: false });
    }
    
    // Lazy loading pour les images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
    
    log('🚀 Optimisations de performance appliquées');
  }

  /* ===========================================
     15. ANALYTICS ET TRACKING
     =========================================== */

  /**
   * Initialise Google Analytics
   */
  function initAnalytics() {
    // Google Analytics (simulé)
    window.dataLayer = window.dataLayer || [];
    
    function gtag() {
      dataLayer.push(arguments);
    }
    
    gtag('js', new Date());
    gtag('config', CONFIG.gaTrackingId);
    
    // Tracking des événements
    trackUserEvents();
    
    log('📊 Analytics initialisé');
  }

  /**
   * Track les événements utilisateur
   */
  function trackUserEvents() {
    // Clics sur CTA
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('click', function() {
        const label = this.textContent.trim() || 'Bouton';
        logEvent('cta_click', 'Engagement', label);
      });
    });
    
    // Soumission de formulaire (déjà tracké dans handleFormSubmit)
    
    // Vue des sections
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.id || 'unknown_section';
          logEvent('section_view', 'Navigation', sectionName);
        }
      });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.section').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  /**
   * Log un événement (simulé pour Analytics)
   */
  function logEvent(action, category, label) {
    if (CONFIG.debug) {
      console.log(`📊 Event: ${category} - ${action} - ${label}`);
    }
    
    // Ici, vous enverriez les données à Google Analytics
    // gtag('event', action, { 'event_category': category, 'event_label': label });
  }

  /* ===========================================
     16. GESTION DES ERREURS
     =========================================== */

  /**
   * Initialise la gestion des erreurs
   */
  function initErrorHandling() {
    // Capture les erreurs globales
    window.addEventListener('error', handleGlobalError);
    
    // Capture les promesses non gérées
    window.addEventListener('unhandledrejection', handlePromiseRejection);
    
    log('⚠️ Gestion des erreurs initialisée');
  }

  /**
   * Gère les erreurs globales
   */
  function handleGlobalError(event) {
    console.error('❌ Erreur globale:', event.error);
    
    // Envoyer l'erreur à un service de monitoring
    if (CONFIG.debug) {
      showToast('Une erreur est survenue', 'error');
    }
    
    return false;
  }

  /**
   * Gère les rejets de promesses non gérés
   */
  function handlePromiseRejection(event) {
    console.error('❌ Promesse rejetée:', event.reason);
    
    // Envoyer l'erreur à un service de monitoring
    if (CONFIG.debug) {
      showToast('Une erreur asynchrone est survenue', 'error');
    }
  }

  /* ===========================================
     17. COMPATIBILITÉ NAVIGATEURS
     =========================================== */

  /**
   * Vérifie la compatibilité du navigateur
   */
  function checkBrowserCompatibility() {
    // Vérifier les APIs modernes
    const missingAPIs = [];
    
    if (!('IntersectionObserver' in window)) {
      missingAPIs.push('IntersectionObserver');
    }
    
    if (!('fetch' in window)) {
      missingAPIs.push('Fetch API');
    }
    
    if (!('Promise' in window)) {
      missingAPIs.push('Promises');
    }
    
    if (missingAPIs.length > 0) {
      console.warn(`⚠️ APIs manquantes: ${missingAPIs.join(', ')}`);
      showBrowserWarning(missingAPIs);
    }
    
    log('🌐 Compatibilité navigateur vérifiée');
  }

  /**
   * Affiche un avertissement pour les navigateurs anciens
   */
  function showBrowserWarning(missingAPIs) {
    const warning = document.createElement('div');
    warning.className = 'browser-warning';
    warning.innerHTML = `
      <div class="warning-content">
        <i class="fas fa-exclamation-triangle"></i>
        <div>
          <h3>Votre navigateur n'est pas à jour</h3>
          <p>Certaines fonctionnalités peuvent ne pas fonctionner correctement. 
          Veuillez mettre à jour votre navigateur pour une expérience optimale.</p>
          <div class="warning-actions">
            <button class="btn btn-sm" id="dismissWarning">Compris</button>
            <a href="https://browsehappy.com/" class="btn btn-sm btn-primary" target="_blank">Mettre à jour</a>
          </div>
        </div>
      </div>
    `;
    
    // Styles
    warning.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: linear-gradient(135deg, #FF6584, #FF9A9E);
      color: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      animation: slide-in-up 0.5s ease;
    `;
    
    document.body.appendChild(warning);
    
    // Bouton de fermeture
    document.getElementById('dismissWarning').addEventListener('click', () => {
      gsap.to(warning, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => warning.remove()
      });
    });
  }

  /* ===========================================
     18. UTILITAIRES
     =========================================== */

  /**
   * Affiche un toast notification
   */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'error' ? '#F87171' : type === 'success' ? '#4ADE80' : '#60A5FA'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s ease;
      max-width: 300px;
    `;
    
    document.body.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 10);
    
    // Animation de sortie
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
    
    log(`🍞 Toast: ${message}`);
  }

  /**
   * Log dans la console avec formatage
   */
  function log(message, ...args) {
    if (CONFIG.debug) {
      console.log(`%cMaroneWeb%c ${message}`, 
        'background: linear-gradient(135deg, #6C63FF, #36D1DC); color: white; padding: 2px 6px; border-radius: 3px;',
        'color: inherit;',
        ...args
      );
    }
  }

  /* ===========================================
     19. INITIALISATION DES COMPOSANTS
     =========================================== */

  /**
   * Initialise tous les composants
   */
  function initComponents() {
    initNavigation();
    initScrollManagement();
    initPortfolioFilter();
    initTestimonialCarousel();
    initContactForm();
    initFAQ();
    initParallaxEffects();
  }

  /**
   * Initialise les événements
   */
  function initEvents() {
    // Redimensionnement de la fenêtre
    window.addEventListener('resize', handleResize);
    
    // Touche Échap pour fermer le menu mobile
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
    
    // Clic sur le body pour fermer certains menus
    document.body.addEventListener('click', (e) => {
      // Fermer le menu mobile si clic à l'extérieur
      if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-btn')) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Gère le redimensionnement de la fenêtre
   */
  function handleResize() {
    detectDevice();
    
    // Réinitialiser les effets sur mobile
    if (APP_STATE.isMobile) {
      if (APP_STATE.particlesActive) {
        DOM.particlesContainer.remove();
        APP_STATE.particlesActive = false;
      }
      
      if (CONFIG.enableCursorEffect) {
        document.body.style.cursor = '';
        if (DOM.customCursor.parentNode) {
          DOM.customCursor.parentNode.removeChild(DOM.customCursor);
        }
        if (DOM.cursorDot.parentNode) {
          DOM.cursorDot.parentNode.removeChild(DOM.cursorDot);
        }
      }
    } else {
      // Réactiver les effets sur desktop
      if (CONFIG.enableParticles && !APP_STATE.particlesActive) {
        initParticleSystem();
      }
      
      if (CONFIG.enableCursorEffect && !document.querySelector('.custom-cursor')) {
        initCustomCursor();
      }
    }
    
    log('🔄 Redimensionnement traité');
  }

  /**
   * Initialise les effets spéciaux
   */
  function initSpecialEffects() {
    if (CONFIG.enableParticles) {
      initParticleSystem();
    }
    
    if (CONFIG.enableCursorEffect) {
      initCustomCursor();
    }
    
    // Effet de texte dégradé animé
    animateTextGradients();
    
    // Effet de hover sur les cartes
    initCardHoverEffects();
    
    log('✨ Effets spéciaux initialisés');
  }

  /**
   * Anime les dégradés de texte
   */
  function animateTextGradients() {
    const gradientTexts = document.querySelectorAll('.text-gradient');
    
    gradientTexts.forEach(text => {
      // Animation du dégradé
      const style = document.createElement('style');
      style.textContent = `
        @keyframes gradient-shift-${Date.now()} {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(style);
      
      text.style.animation = `gradient-shift-${Date.now()} 5s ease infinite`;
      text.style.backgroundSize = '200% 200%';
    });
  }

  /**
   * Initialise les effets de hover sur les cartes
   */
  function initCardHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .advantage-card, .portfolio-item');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  /* ===========================================
     20. POINT D'ENTRÉE PRINCIPAL
     =========================================== */

  // Attendre que le DOM soit chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Exposer certaines fonctions globalement (pour le débogage)
  window.MaroneWeb = {
    init: initApp,
    showToast: showToast,
    config: CONFIG,
    state: APP_STATE
  };

  log('🚀 MaroneWeb JavaScript chargé');

})();

/* ===========================================
   EXTENSIONS ET POLYFILLS
   =========================================== */

// Polyfill pour forEach sur NodeList (pour IE)
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// Polyfill pour closest (pour IE)
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// Polyfill pour matches (pour IE)
if (!Element.prototype.matches) {
  Element.prototype.matches = 
    Element.prototype.matchesSelector || 
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector || 
    Element.prototype.oMatchesSelector || 
    Element.prototype.webkitMatchesSelector ||
    function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}

/* ===========================================
   CODE POUR FULLPAGE.JS (si utilisé)
   =========================================== */

// Note: Pour utiliser fullPage.js, décommentez le code ci-dessous
// et assurez-vous d'inclure la bibliothèque dans votre HTML

/*
function initFullPage() {
  if (typeof fullpage !== 'undefined') {
    new fullpage('#fullpage', {
      licenseKey: 'YOUR_KEY_HERE',
      autoScrolling: true,
      scrollHorizontally: true,
      navigation: true,
      navigationPosition: 'right',
      navigationTooltips: ['Accueil', 'Services', 'Avantages', 'Portfolio', 'Témoignages', 'Processus', 'Contact'],
      showActiveTooltip: true,
      slidesNavigation: true,
      controlArrows: false,
      scrollingSpeed: 700,
      onLeave: function(origin, destination, direction) {
        // Mettre à jour la navigation
        updateFullPageNav(destination.index);
        
        // Animation de la section
        animateSection(destination.item);
      }
    });
    
    log('📄 fullPage.js initialisé');
  }
}

function updateFullPageNav(index) {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach((link, i) => {
    if (i === index) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function animateSection(section) {
  // Animation d'entrée pour la section
  gsap.from(section, {
    duration: 0.8,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  });
}
*/

/* ===========================================
   SERVICE WORKER PWA (optionnel)
   =========================================== */

// Décommentez pour activer PWA
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ ServiceWorker enregistré avec succès:', registration.scope);
      })
      .catch(error => {
        console.log('❌ Échec d\'enregistrement du ServiceWorker:', error);
      });
  });
}
*/

/* ===========================================
   FIN DU FICHIER JAVASCRIPT
   =========================================== */