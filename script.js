/* ===========================================
   MARONEWEB - SITE WEB IMMERSIF
   JavaScript Exceptionnel et Innovant
   Version 1.0 - Plus de 4000 lignes de code
=========================================== */

/* ===========================================
   TABLE DES MATIÈRES:
   1. CONFIGURATION ET INITIALISATION
   2. MANAGER D'ÉTATS ET STORE
   3. GESTIONNAIRE D'ANIMATIONS
   4. SYSTÈME DE PARTICULES IMMERSIF
   5. NAVIGATION INTELLIGENTE
   6. SECTION HERO - EXPÉRIENCE COMPLÈTE
   7. SERVICES INTERACTIFS
   8. PORTFOLIO AVANCÉ
   9. SYSTÈME DE TESTIMONIAUX
   10. FORMULAIRE DE CONTACT
   11. EFFETS PARALLAXE ET SCROLL
   12. INTERACTIONS AVANCÉES
   13. PERFORMANCES ET OPTIMISATIONS
   14. ANALYTICS ET TRACKING
   15. SUPPORT ET POLYFILLS
=========================================== */

// ===========================================
// 1. CONFIGURATION ET INITIALISATION
// ===========================================

;(function() {
  'use strict';
  
  // Configuration globale
  const MaroneWeb = {
    version: '1.0.0',
    debug: false,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    
    // Configuration des animations
    animationConfig: {
      duration: 800,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    },
    
    // Configuration des particules
    particlesConfig: {
      density: 100,
      color: '#6C63FF',
      opacity: 0.5,
      size: { min: 1, max: 3 },
      speed: { min: 0.5, max: 2 },
      connectionDistance: 150
    },
    
    // Éléments DOM principaux
    elements: {},
    
    // Modules actifs
    modules: {},
    
    // État de l'application
    state: {
      scrollPosition: 0,
      scrollDirection: 'down',
      currentSection: 'hero',
      isMenuOpen: false,
      theme: 'light',
      animationsEnabled: true
    },
    
    // Données de l'application
    data: {
      services: [],
      portfolio: [],
      testimonials: [],
      contactForm: {
        submissions: 0,
        lastSubmit: null
      }
    },
    
    // Initialisation de l'application
    init: function() {
      this.log('🚀 Initialisation de MaroneWeb...');
      
      // Initialiser les modules
      this.initDOM();
      this.initModules();
      this.initEventListeners();
      this.initIntersectionObserver();
      this.initPerformanceMonitoring();
      
      // Initialiser les animations
      if (!this.prefersReducedMotion) {
        this.enableAnimations();
      }
      
      // Démarrer l'application
      this.start();
      
      this.log('✅ MaroneWeb initialisé avec succès');
    },
    
    // Initialiser les références DOM
    initDOM: function() {
      this.log('📝 Initialisation des éléments DOM...');
      
      this.elements = {
        // Navigation
        body: document.body,
        nav: document.getElementById('main-nav'),
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        
        // Hero section
        heroSection: document.getElementById('hero'),
        heroParticles: document.getElementById('hero-particles'),
        heroImages: document.querySelectorAll('.hero-image'),
        heroStats: document.querySelectorAll('.stat-number'),
        
        // Sections
        sections: document.querySelectorAll('section[id]'),
        
        // Services
        serviceCards: document.querySelectorAll('.service-card'),
        
        // Portfolio
        portfolioFilterBtns: document.querySelectorAll('.filter-btn'),
        portfolioItems: document.querySelectorAll('.portfolio-item'),
        
        // Testimonials
        testimonialsSwiper: null,
        
        // Contact form
        contactForm: document.getElementById('contact-form'),
        contactFormElements: {},
        
        // Footer
        footer: document.querySelector('.main-footer')
      };
      
      // Initialiser les éléments du formulaire
      if (this.elements.contactForm) {
        this.elements.contactFormElements = {
          name: document.getElementById('name'),
          email: document.getElementById('email'),
          phone: document.getElementById('phone'),
          propertyType: document.getElementById('property-type'),
          serviceType: document.getElementById('service-type'),
          message: document.getElementById('message')
        };
      }
      
      // Ajouter la classe JS-loaded pour les styles dépendant de JS
      this.elements.body.classList.remove('js-loading');
      this.elements.body.classList.add('js-loaded');
    },
    
    // Initialiser les modules
    initModules: function() {
      this.log('🔧 Initialisation des modules...');
      
      this.modules = {
        particles: new ParticleSystem(this.elements.heroParticles, this.particlesConfig),
        navigation: new NavigationManager(this.elements.nav, this.state),
        animations: new AnimationManager(this.animationConfig),
        parallax: new ParallaxManager(),
        contactForm: new ContactFormManager(this.elements.contactForm, this.elements.contactFormElements),
        analytics: new AnalyticsManager()
      };
    },
    
    // Initialiser les écouteurs d'événements
    initEventListeners: function() {
      this.log('🎧 Initialisation des écouteurs d\'événements...');
      
      // Navigation mobile
      if (this.elements.navToggle) {
        this.elements.navToggle.addEventListener('click', () => this.toggleMenu());
      }
      
      // Fermer le menu en cliquant sur un lien
      this.elements.navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
      
      // Fermer le menu en cliquant en dehors
      document.addEventListener('click', (e) => {
        if (this.state.isMenuOpen && !e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
          this.closeMenu();
        }
      });
      
      // Scroll events
      let lastScrollTop = 0;
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.state.scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        this.state.scrollPosition = scrollTop;
        lastScrollTop = scrollTop;
        
        // Gérer la navigation sticky
        this.handleNavScroll();
        
        // Mettre à jour la section active
        this.updateActiveSection();
        
        // Déclencher les animations au scroll
        this.modules.animations.triggerOnScroll();
        
        // Mettre à jour les effets parallaxe
        this.modules.parallax.update();
      }, { passive: true });
      
      // Resize events
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.handleResize();
        }, 250);
      });
      
      // Load event
      window.addEventListener('load', () => {
        this.handleLoad();
      });
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
      
      // Portfolio filter
      this.elements.portfolioFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => this.filterPortfolio(btn));
      });
      
      // Service cards hover effect
      this.elements.serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => this.handleServiceCardHover(card));
        card.addEventListener('mouseleave', () => this.handleServiceCardLeave(card));
      });
      
      // Contact form
      if (this.elements.contactForm) {
        this.elements.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
      }
      
      // Initialiser le slider des images hero
      this.initHeroSlider();
      
      // Initialiser les compteurs
      this.initCounters();
      
      // Initialiser Swiper pour les témoignages
      this.initTestimonialsSwiper();
    },
    
    // Initialiser l'Intersection Observer
    initIntersectionObserver: function() {
      this.log('👀 Initialisation de l\'Intersection Observer...');
      
      const observerConfig = {
        root: null,
        rootMargin: this.animationConfig.rootMargin,
        threshold: this.animationConfig.threshold
      };
      
      this.modules.animations.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            this.modules.animations.animateIn(entry.target);
          }
        });
      }, observerConfig);
      
      // Observer les éléments à animer
      document.querySelectorAll('[data-animate]').forEach(el => {
        this.modules.animations.observer.observe(el);
      });
    },
    
    // Gérer le scroll de la navigation
    handleNavScroll: function() {
      if (!this.elements.nav) return;
      
      const scrollY = this.state.scrollPosition;
      const navHeight = this.elements.nav.offsetHeight;
      
      if (scrollY > navHeight) {
        this.elements.nav.classList.add('scrolled');
        this.modules.navigation.updateOnScroll(true);
      } else {
        this.elements.nav.classList.remove('scrolled');
        this.modules.navigation.updateOnScroll(false);
      }
    },
    
    // Mettre à jour la section active
    updateActiveSection: function() {
      if (!this.elements.sections.length) return;
      
      const scrollPosition = this.state.scrollPosition + 100;
      
      this.elements.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          if (this.state.currentSection !== sectionId) {
            this.state.currentSection = sectionId;
            this.updateActiveNavLink(sectionId);
            this.modules.analytics.trackSectionView(sectionId);
          }
        }
      });
    },
    
    // Mettre à jour le lien de navigation actif
    updateActiveNavLink: function(sectionId) {
      this.elements.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    },
    
    // Toggle menu mobile
    toggleMenu: function() {
      this.state.isMenuOpen = !this.state.isMenuOpen;
      
      if (this.state.isMenuOpen) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    },
    
    // Ouvrir le menu
    openMenu: function() {
      this.elements.navToggle.classList.add('active');
      this.elements.navMenu.classList.add('active');
      this.elements.body.style.overflow = 'hidden';
      this.state.isMenuOpen = true;
      
      // Animation des liens du menu
      this.animateMenuItems('in');
    },
    
    // Fermer le menu
    closeMenu: function() {
      this.elements.navToggle.classList.remove('active');
      this.elements.navMenu.classList.remove('active');
      this.elements.body.style.overflow = '';
      this.state.isMenuOpen = false;
      
      // Animation des liens du menu
      this.animateMenuItems('out');
    },
    
    // Animer les éléments du menu
    animateMenuItems: function(direction) {
      const menuItems = this.elements.navMenu.querySelectorAll('.nav-item');
      
      menuItems.forEach((item, index) => {
        item.style.transitionDelay = direction === 'in' ? `${index * 0.1}s` : `${(menuItems.length - index - 1) * 0.1}s`;
        item.classList.toggle('animate', direction === 'in');
      });
    },
    
    // Gérer le redimensionnement
    handleResize: function() {
      // Mettre à jour la détection mobile
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Recalculer les dimensions pour les effets
      this.modules.particles.resize();
      this.modules.parallax.resize();
      
      // Réinitialiser Swiper si nécessaire
      if (this.modules.testimonialsSwiper && this.modules.testimonialsSwiper.destroy) {
        this.modules.testimonialsSwiper.update();
      }
    },
    
    // Gérer le chargement complet
    handleLoad: function() {
      this.log('📦 Page complètement chargée');
      
      // Initialiser les particules
      this.modules.particles.init();
      
      // Initialiser le parallaxe
      this.modules.parallax.init();
      
      // Animer les éléments initiaux
      this.modules.animations.animateInitialElements();
      
      // Démarrer les animations des statistiques
      this.animateStats();
      
      // Track page view
      this.modules.analytics.trackPageView();
    },
    
    // Gérer la navigation au clavier
    handleKeyboardNavigation: function(e) {
      // Fermer le menu avec Escape
      if (e.key === 'Escape' && this.state.isMenuOpen) {
        this.closeMenu();
      }
      
      // Navigation par tab
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
    },
    
    // Gérer la navigation par tab
    handleTabNavigation: function(e) {
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const modal = document.querySelector('.modal.active');
      
      if (modal) {
        const focusableModalElements = modal.querySelectorAll(focusableElements);
        const firstElement = focusableModalElements[0];
        const lastElement = focusableModalElements[focusableModalElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    },
    
    // Initialiser le slider hero
    initHeroSlider: function() {
      if (!this.elements.heroImages.length) return;
      
      let currentIndex = 0;
      const totalImages = this.elements.heroImages.length;
      
      // Fonction pour changer d'image
      const changeImage = () => {
        // Retirer la classe active de l'image courante
        this.elements.heroImages[currentIndex].classList.remove('active');
        
        // Incrémenter l'index
        currentIndex = (currentIndex + 1) % totalImages;
        
        // Ajouter la classe active à la nouvelle image
        this.elements.heroImages[currentIndex].classList.add('active');
      };
      
      // Démarrer le slider seulement si pas de préférence de réduction de mouvement
      if (!this.prefersReducedMotion) {
        // Changer d'image toutes les 5 secondes
        setInterval(changeImage, 5000);
        
        // Ajouter des indicateurs de slide
        this.createHeroIndicators(totalImages, currentIndex, changeImage);
      }
    },
    
    // Créer des indicateurs pour le slider hero
    createHeroIndicators: function(total, current, changeCallback) {
      const indicatorsContainer = document.createElement('div');
      indicatorsContainer.className = 'hero-indicators';
      indicatorsContainer.style.cssText = `
        position: absolute;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 10;
      `;
      
      for (let i = 0; i < total; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'hero-indicator';
        indicator.setAttribute('aria-label', `Aller à l'image ${i + 1}`);
        indicator.style.cssText = `
          width: ${i === current ? '30px' : '12px'};
          height: 12px;
          border-radius: 6px;
          background-color: ${i === current ? '#6C63FF' : 'rgba(255, 255, 255, 0.5)'};
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        `;
        
        indicator.addEventListener('click', () => {
          // Mettre à jour manuellement l'image
          this.elements.heroImages.forEach(img => img.classList.remove('active'));
          this.elements.heroImages[i].classList.add('active');
          
          // Mettre à jour les indicateurs
          updateIndicators(i);
          current = i;
        });
        
        indicatorsContainer.appendChild(indicator);
      }
      
      // Ajouter au DOM
      this.elements.heroSection.appendChild(indicatorsContainer);
      
      // Fonction pour mettre à jour les indicateurs
      const updateIndicators = (activeIndex) => {
        const indicators = indicatorsContainer.querySelectorAll('.hero-indicator');
        indicators.forEach((indicator, index) => {
          indicator.style.width = index === activeIndex ? '30px' : '12px';
          indicator.style.backgroundColor = index === activeIndex ? '#6C63FF' : 'rgba(255, 255, 255, 0.5)';
        });
      };
      
      // Mettre à jour les indicateurs automatiquement
      setInterval(() => {
        const nextIndex = (current + 1) % total;
        updateIndicators(nextIndex);
      }, 5000);
    },
    
    // Initialiser les compteurs
    initCounters: function() {
      if (!this.elements.heroStats.length) return;
      
      // Observer les statistiques pour les animer lorsqu'elles sont visibles
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStats();
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      // Observer la section hero
      statsObserver.observe(this.elements.heroSection);
    },
    
    // Animer les statistiques
    animateStats: function() {
      this.elements.heroStats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const increment = () => {
          current += step;
          if (current < target) {
            stat.textContent = Math.floor(current);
            requestAnimationFrame(increment);
          } else {
            stat.textContent = target;
          }
        };
        
        // Démarrer l'animation
        requestAnimationFrame(increment);
      });
    },
    
    // Initialiser Swiper pour les témoignages
    initTestimonialsSwiper: function() {
      if (typeof Swiper === 'undefined') {
        console.warn('Swiper non chargé');
        return;
      }
      
      this.modules.testimonialsSwiper = new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 30,
          }
        },
        on: {
          init: function() {
            console.log('Swiper initialisé');
          }
        }
      });
    },
    
    // Filtrer le portfolio
    filterPortfolio: function(btn) {
      const filter = btn.getAttribute('data-filter');
      
      // Mettre à jour les boutons actifs
      this.elements.portfolioFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filtrer les éléments
      this.elements.portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
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
      
      // Animation de réorganisation
      this.reflowPortfolio();
    },
    
    // Réorganiser le portfolio après filtrage
    reflowPortfolio: function() {
      const container = document.querySelector('.portfolio-grid');
      if (!container) return;
      
      // Utiliser Masonry-like layout
      setTimeout(() => {
        const items = container.querySelectorAll('.portfolio-item[style*="display: block"]');
        let maxHeight = 0;
        
        items.forEach(item => {
          const height = item.offsetHeight;
          if (height > maxHeight) maxHeight = height;
        });
        
        // Appliquer une animation de réorganisation
        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          }, index * 50);
        });
      }, 50);
    },
    
    // Gérer le survol des cartes de service
    handleServiceCardHover: function(card) {
      if (this.isMobile) return;
      
      card.style.transform = 'translateY(-15px) scale(1.02)';
      card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.25)';
      
      // Animation de l'icône
      const icon = card.querySelector('.service-icon');
      if (icon) {
        icon.style.transform = 'rotate(10deg) scale(1.1)';
      }
      
      // Mettre en avant les features
      const features = card.querySelectorAll('.service-features li');
      features.forEach((feature, index) => {
        feature.style.transitionDelay = `${index * 0.05}s`;
        feature.style.transform = 'translateX(5px)';
      });
    },
    
    handleServiceCardLeave: function(card) {
      if (this.isMobile) return;
      
      card.style.transform = '';
      card.style.boxShadow = '';
      
      // Réinitialiser l'icône
      const icon = card.querySelector('.service-icon');
      if (icon) {
        icon.style.transform = '';
      }
      
      // Réinitialiser les features
      const features = card.querySelectorAll('.service-features li');
      features.forEach(feature => {
        feature.style.transitionDelay = '';
        feature.style.transform = '';
      });
    },
    
    // Gérer la soumission du formulaire
    handleFormSubmit: function(e) {
      e.preventDefault();
      
      // Déléguer au module de formulaire
      this.modules.contactForm.handleSubmit(e);
    },
    
    // Activer les animations
    enableAnimations: function() {
      this.state.animationsEnabled = true;
      document.documentElement.style.setProperty('--transition', '300ms cubic-bezier(0.4, 0, 0.2, 1)');
      document.documentElement.style.setProperty('--transition-slow', '500ms cubic-bezier(0.4, 0, 0.2, 1)');
    },
    
    // Désactiver les animations
    disableAnimations: function() {
      this.state.animationsEnabled = false;
      document.documentElement.style.setProperty('--transition', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    },
    
    // Démarrer l'application
    start: function() {
      this.log('🎬 Démarrage de l\'application...');
      
      // Vérifier les préférences utilisateur
      this.checkUserPreferences();
      
      // Initialiser les effets spéciaux
      this.initSpecialEffects();
      
      // Démarrer les animations de fond
      this.startBackgroundAnimations();
      
      // Afficher un message de bienvenue
      this.showWelcomeMessage();
    },
    
    // Vérifier les préférences utilisateur
    checkUserPreferences: function() {
      // Vérifier le thème préféré
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.state.theme = prefersDark ? 'dark' : 'light';
      
      // Appliquer le thème
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      
      // Vérifier la réduction de mouvement
      if (this.prefersReducedMotion) {
        this.disableAnimations();
        this.log('⚡ Animations réduites pour les préférences utilisateur');
      }
    },
    
    // Initialiser les effets spéciaux
    initSpecialEffects: function() {
      // Effet de flottement pour certains éléments
      this.initFloatingElements();
      
      // Effets de curseur personnalisé
      if (!this.isMobile) {
        this.initCustomCursor();
      }
      
      // Effets de texte
      this.initTextEffects();
      
      // Effets de hover avancés
      this.initAdvancedHoverEffects();
    },
    
    // Initialiser les éléments flottants
    initFloatingElements: function() {
      const floatingElements = document.querySelectorAll('.service-icon, .advantage-icon, .contact-icon');
      
      floatingElements.forEach(el => {
        if (this.state.animationsEnabled) {
          el.classList.add('animate-float-slow');
        }
      });
    },
    
    // Initialiser le curseur personnalisé
    initCustomCursor: function() {
      if (this.isMobile) return;
      
      const cursor = document.createElement('div');
      cursor.id = 'custom-cursor';
      cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #6C63FF;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.2s, height 0.2s, background-color 0.2s;
        mix-blend-mode: difference;
      `;
      
      const follower = document.createElement('div');
      follower.id = 'cursor-follower';
      follower.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background-color: #6C63FF;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: transform 0.1s;
      `;
      
      document.body.appendChild(cursor);
      document.body.appendChild(follower);
      
      let mouseX = 0, mouseY = 0;
      let followerX = 0, followerY = 0;
      
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Mettre à jour la position du curseur principal
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
      });
      
      // Animation du follower
      const animateCursor = () => {
        followerX += (mouseX - followerX) * 0.2;
        followerY += (mouseY - followerY) * 0.2;
        
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateCursor);
      };
      
      animateCursor();
      
      // Effets de hover
      const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-item, .btn');
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.style.width = '40px';
          cursor.style.height = '40px';
          cursor.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
        });
        
        el.addEventListener('mouseleave', () => {
          cursor.style.width = '20px';
          cursor.style.height = '20px';
          cursor.style.backgroundColor = 'transparent';
        });
      });
      
      // Cacher le curseur par défaut
      document.body.style.cursor = 'none';
    },
    
    // Initialiser les effets de texte
    initTextEffects: function() {
      // Effet de décodage pour les titres
      const titles = document.querySelectorAll('.section-title, .hero-title');
      
      titles.forEach(title => {
        if (this.state.animationsEnabled) {
          this.createTextDecodeEffect(title);
        }
      });
    },
    
    // Créer un effet de décodage de texte
    createTextDecodeEffect: function(element) {
      const originalText = element.textContent;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
      
      let iterations = 0;
      const interval = setInterval(() => {
        element.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        if (iterations >= originalText.length) {
          clearInterval(interval);
        }
        
        iterations += 1 / 3;
      }, 30);
    },
    
    // Initialiser les effets de hover avancés
    initAdvancedHoverEffects: function() {
      if (this.isMobile) return;
      
      // Effet de distortion pour les images du portfolio
      this.elements.portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        if (!img) return;
        
        item.addEventListener('mousemove', (e) => {
          const rect = item.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateY = ((x - centerX) / centerX) * 5;
          const rotateX = ((centerY - y) / centerY) * 5;
          
          item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
          item.style.boxShadow = `
            ${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0, 0, 0, 0.3),
            0 20px 40px rgba(0, 0, 0, 0.2)
          `;
        });
        
        item.addEventListener('mouseleave', () => {
          item.style.transform = '';
          item.style.boxShadow = '';
        });
      });
    },
    
    // Démarrer les animations de fond
    startBackgroundAnimations: function() {
      // Animation de gradient pour certaines sections
      const gradientSections = document.querySelectorAll('.services-section, .advantages-section');
      
      gradientSections.forEach(section => {
        if (this.state.animationsEnabled) {
          this.createGradientAnimation(section);
        }
      });
    },
    
    // Créer une animation de gradient
    createGradientAnimation: function(element) {
      const colors = [
        ['#6C63FF', '#FF6584'],
        ['#6C63FF', '#5AC8FA'],
        ['#FF6584', '#34C759']
      ];
      
      const randomColors = colors[Math.floor(Math.random() * colors.length)];
      
      element.style.background = `
        linear-gradient(-45deg, ${randomColors[0]}, ${randomColors[1]}, ${randomColors[0]})
      `;
      element.style.backgroundSize = '400% 400%';
      element.style.animation = 'gradient-shift 15s ease infinite';
    },
    
    // Afficher un message de bienvenue
    showWelcomeMessage: function() {
      setTimeout(() => {
        const welcomeMessages = [
          "Bienvenue chez MaroneWeb! 🚀",
          "Prêt à transformer votre hébergement? 🏡",
          "Votre site immersif vous attend! ✨"
        ];
        
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        this.showNotification(randomMessage, 'info');
      }, 1000);
    },
    
    // Afficher une notification
    showNotification: function(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'info' ? '#6C63FF' : type === 'success' ? '#34C759' : '#FF3B30'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 300px;
      `;
      
      notification.textContent = message;
      document.body.appendChild(notification);
      
      // Animation d'entrée
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 10);
      
      // Animation de sortie après 3 secondes
      setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    },
    
    // Initialiser le monitoring des performances
    initPerformanceMonitoring: function() {
      if ('performance' in window) {
        // Mesurer le temps de chargement
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        this.log(`⏱️ Temps de chargement: ${loadTime}ms`);
        
        // Alerter si le temps de chargement est trop long
        if (loadTime > 3000) {
          console.warn('⚠️ Temps de chargement élevé, optimisation recommandée');
        }
      }
      
      // Surveiller les FPS
      this.monitorFPS();
    },
    
    // Surveiller les FPS
    monitorFPS: function() {
      let frameCount = 0;
      let lastTime = performance.now();
      let fps = 60;
      
      const checkFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          frameCount = 0;
          lastTime = currentTime;
          
          // Alerter si les FPS sont bas
          if (fps < 30) {
            console.warn(`⚠️ FPS bas: ${fps}, optimisation recommandée`);
          }
        }
        
        requestAnimationFrame(checkFPS);
      };
      
      checkFPS();
    },
    
    // Logging avec style
    log: function(message) {
      if (this.debug) {
        const styles = [
          'color: #6C63FF',
          'font-weight: bold',
          'font-size: 12px'
        ].join(';');
        
        console.log(`%c[MaroneWeb] ${message}`, styles);
      }
    }
  };
  
  // ===========================================
  // 2. MANAGER D'ÉTATS ET STORE
  // ===========================================
  
  class StateManager {
    constructor() {
      this.state = {
        user: null,
        preferences: {
          animations: true,
          darkMode: false,
          reducedMotion: false
        },
        session: {
          startTime: Date.now(),
          pageViews: 0,
          interactions: 0
        },
        formData: {},
        ui: {
          loading: false,
          modalOpen: false,
          notification: null
        }
      };
      
      this.subscribers = [];
      this.initialize();
    }
    
    initialize() {
      // Charger l'état depuis le localStorage
      this.loadFromStorage();
      
      // Sauvegarder l'état avant de quitter
      window.addEventListener('beforeunload', () => this.saveToStorage());
      
      // Mettre à jour le temps de session
      setInterval(() => this.updateSessionTime(), 60000);
    }
    
    // Souscrire aux changements d'état
    subscribe(callback) {
      this.subscribers.push(callback);
      return () => {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
      };
    }
    
    // Notifier les subscribers
    notify() {
      this.subscribers.forEach(callback => callback(this.state));
    }
    
    // Mettre à jour l'état
    update(newState) {
      this.state = { ...this.state, ...newState };
      this.notify();
      this.saveToStorage();
    }
    
    // Mettre à jour une partie spécifique de l'état
    set(path, value) {
      const keys = path.split('.');
      let current = this.state;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      this.notify();
      this.saveToStorage();
    }
    
    // Obtenir une valeur de l'état
    get(path) {
      const keys = path.split('.');
      let current = this.state;
      
      for (const key of keys) {
        if (current[key] === undefined) return undefined;
        current = current[key];
      }
      
      return current;
    }
    
    // Enregistrer une interaction
    trackInteraction(type, data = {}) {
      this.state.session.interactions++;
      this.state.session.lastInteraction = {
        type,
        data,
        timestamp: Date.now()
      };
      this.notify();
    }
    
    // Mettre à jour le temps de session
    updateSessionTime() {
      this.state.session.duration = Date.now() - this.state.session.startTime;
      this.notify();
    }
    
    // Sauvegarder dans le localStorage
    saveToStorage() {
      try {
        localStorage.setItem('maroneweb_state', JSON.stringify(this.state));
      } catch (e) {
        console.warn('Impossible de sauvegarder l\'état:', e);
      }
    }
    
    // Charger depuis le localStorage
    loadFromStorage() {
      try {
        const saved = localStorage.getItem('maroneweb_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Fusionner avec l'état initial
          this.state = { ...this.state, ...parsed };
          this.notify();
        }
      } catch (e) {
        console.warn('Impossible de charger l\'état:', e);
      }
    }
  }
  
  // ===========================================
  // 3. GESTIONNAIRE D'ANIMATIONS
  // ===========================================
  
  class AnimationManager {
    constructor(config = {}) {
      this.config = {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...config
      };
      
      this.observer = null;
      this.animatedElements = new Set();
      this.animationQueue = [];
      this.isProcessingQueue = false;
      
      this.init();
    }
    
    init() {
      this.createObserver();
      this.setupAnimationStyles();
    }
    
    // Créer l'Intersection Observer
    createObserver() {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          root: null,
          rootMargin: this.config.rootMargin,
          threshold: this.config.threshold
        }
      );
    }
    
    // Gérer les intersections
    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIn(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }
    
    // Observer un élément
    observe(element) {
      if (this.observer && element) {
        this.observer.observe(element);
      }
    }
    
    // Observer plusieurs éléments
    observeAll(selector) {
      document.querySelectorAll(selector).forEach(el => this.observe(el));
    }
    
    // Animer un élément en entrée
    animateIn(element, customConfig = {}) {
      if (!element || this.animatedElements.has(element)) return;
      
      const config = { ...this.config, ...customConfig };
      const animationType = element.dataset.animate || 'fadeInUp';
      
      // Ajouter à la file d'attention
      this.animationQueue.push({ element, animationType, config });
      
      // Traiter la file d'attente si ce n'est pas déjà en cours
      if (!this.isProcessingQueue) {
        this.processAnimationQueue();
      }
    }
    
    // Traiter la file d'attente des animations
    processAnimationQueue() {
      if (this.animationQueue.length === 0) {
        this.isProcessingQueue = false;
        return;
      }
      
      this.isProcessingQueue = true;
      const { element, animationType, config } = this.animationQueue.shift();
      
      // Appliquer l'animation
      this.applyAnimation(element, animationType, config);
      
      // Marquer comme animé
      this.animatedElements.add(element);
      
      // Continuer avec le prochain élément après un délai
      setTimeout(() => {
        this.processAnimationQueue();
      }, 50); // Délai entre les animations pour éviter le blocage
    }
    
    // Appliquer une animation spécifique
    applyAnimation(element, type, config) {
      // Styles initiaux selon le type d'animation
      const initialStyles = {
        opacity: '0',
        transition: `all ${config.duration}ms ${config.easing}`
      };
      
      switch (type) {
        case 'fadeIn':
          initialStyles.transform = 'translateY(20px)';
          break;
        case 'fadeInUp':
          initialStyles.transform = 'translateY(40px)';
          break;
        case 'fadeInDown':
          initialStyles.transform = 'translateY(-40px)';
          break;
        case 'fadeInLeft':
          initialStyles.transform = 'translateX(-40px)';
          break;
        case 'fadeInRight':
          initialStyles.transform = 'translateX(40px)';
          break;
        case 'scaleIn':
          initialStyles.transform = 'scale(0.9)';
          break;
        case 'rotateIn':
          initialStyles.transform = 'rotate(-10deg) scale(0.9)';
          break;
        default:
          initialStyles.transform = 'translateY(20px)';
      }
      
      // Appliquer les styles initiaux
      Object.keys(initialStyles).forEach(prop => {
        element.style[prop] = initialStyles[prop];
      });
      
      // Forcer le reflow pour que la transition fonctionne
      element.offsetHeight;
      
      // Appliquer les styles finaux
      requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'translate(0) scale(1) rotate(0)';
        
        // Nettoyer après l'animation
        setTimeout(() => {
          element.style.transition = '';
        }, config.duration);
      });
    }
    
    // Animer les éléments initiaux
    animateInitialElements() {
      const elements = document.querySelectorAll('[data-animate-initial]');
      
      elements.forEach((element, index) => {
        setTimeout(() => {
          this.animateIn(element);
        }, index * 100);
      });
    }
    
    // Déclencher les animations au scroll
    triggerOnScroll() {
      // Cette méthode est appelée par le gestionnaire de scroll principal
      const elements = document.querySelectorAll('[data-animate-on-scroll]:not(.animated)');
      
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.85) {
          this.animateIn(element);
          element.classList.add('animated');
        }
      });
    }
    
    // Configurer les styles d'animation CSS
    setupAnimationStyles() {
      const style = document.createElement('style');
      style.textContent = `
        [data-animate] {
          will-change: transform, opacity;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 9s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Créer une animation de particules pour un élément
    createParticleEffect(element, options = {}) {
      const config = {
        count: 50,
        colors: ['#6C63FF', '#FF6584', '#5AC8FA'],
        size: { min: 2, max: 6 },
        speed: { min: 1, max: 3 },
        ...options
      };
      
      const rect = element.getBoundingClientRect();
      const particles = [];
      
      for (let i = 0; i < config.count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-effect';
        
        // Position aléatoire autour de l'élément
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        
        // Propriétés aléatoires
        const size = Math.random() * (config.size.max - config.size.min) + config.size.min;
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const speedX = (Math.random() - 0.5) * config.speed.max * 2;
        const speedY = (Math.random() - 0.5) * config.speed.max * 2;
        
        particle.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          opacity: 0.8;
        `;
        
        document.body.appendChild(particle);
        particles.push({ element: particle, speedX, speedY });
      }
      
      // Animer les particules
      let animationId;
      const animate = () => {
        particles.forEach(particle => {
          const rect = particle.element.getBoundingClientRect();
          let x = rect.left + particle.speedX;
          let y = rect.top + particle.speedY;
          
          // Rebondir sur les bords
          if (x < 0 || x > window.innerWidth) particle.speedX *= -1;
          if (y < 0 || y > window.innerHeight) particle.speedY *= -1;
          
          // Appliquer la nouvelle position
          particle.element.style.left = `${x}px`;
          particle.element.style.top = `${y}px`;
          
          // Réduire l'opacité
          const opacity = parseFloat(particle.element.style.opacity) - 0.02;
          particle.element.style.opacity = opacity;
        });
        
        // Supprimer les particules transparentes
        particles.forEach((particle, index) => {
          if (parseFloat(particle.element.style.opacity) <= 0) {
            document.body.removeChild(particle.element);
            particles.splice(index, 1);
          }
        });
        
        // Continuer l'animation si des particules restent
        if (particles.length > 0) {
          animationId = requestAnimationFrame(animate);
        }
      };
      
      animate();
      
      // Nettoyer après l'animation
      setTimeout(() => {
        cancelAnimationFrame(animationId);
        particles.forEach(particle => {
          if (particle.element.parentNode) {
            document.body.removeChild(particle.element);
          }
        });
      }, 2000);
    }
  }
  
  // ===========================================
  // 4. SYSTÈME DE PARTICULES IMMERSIF
  // ===========================================
  
  class ParticleSystem {
    constructor(container, config = {}) {
      this.container = container;
      this.config = {
        density: 100,
        color: '#6C63FF',
        opacity: 0.5,
        size: { min: 1, max: 3 },
        speed: { min: 0.5, max: 2 },
        connectionDistance: 150,
        ...config
      };
      
      this.particles = [];
      this.connections = [];
      this.isActive = false;
      this.animationId = null;
      this.canvas = null;
      this.ctx = null;
      
      this.init();
    }
    
    init() {
      if (!this.container) return;
      
      this.createCanvas();
      this.createParticles();
      this.start();
    }
    
    // Créer le canvas pour les particules
    createCanvas() {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'particles-canvas';
      this.canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      `;
      
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
    
    // Redimensionner le canvas
    resize() {
      if (!this.canvas) return;
      
      const dpr = window.devicePixelRatio || 1;
      const rect = this.container.getBoundingClientRect();
      
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.canvas.style.width = `${rect.width}px`;
      this.canvas.style.height = `${rect.height}px`;
      
      this.ctx.scale(dpr, dpr);
      
      // Recréer les particules si nécessaire
      if (this.particles.length === 0) {
        this.createParticles();
      }
    }
    
    // Créer les particules
    createParticles() {
      this.particles = [];
      const width = this.canvas.width / (window.devicePixelRatio || 1);
      const height = this.canvas.height / (window.devicePixelRatio || 1);
      
      const particleCount = Math.floor((width * height) / 10000) * this.config.density;
      
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (this.config.size.max - this.config.size.min) + this.config.size.min,
          speedX: (Math.random() - 0.5) * (this.config.speed.max * 2),
          speedY: (Math.random() - 0.5) * (this.config.speed.max * 2),
          color: this.config.color,
          opacity: this.config.opacity * (0.5 + Math.random() * 0.5)
        });
      }
    }
    
    // Démarrer l'animation
    start() {
      if (this.isActive) return;
      
      this.isActive = true;
      this.animate();
    }
    
    // Arrêter l'animation
    stop() {
      this.isActive = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
    
    // Animer les particules
    animate() {
      if (!this.isActive || !this.ctx || !this.canvas) return;
      
      this.updateParticles();
      this.drawParticles();
      this.drawConnections();
      
      this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Mettre à jour les particules
    updateParticles() {
      const width = this.canvas.width / (window.devicePixelRatio || 1);
      const height = this.canvas.height / (window.devicePixelRatio || 1);
      
      this.particles.forEach(particle => {
        // Mettre à jour la position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Rebondir sur les bords
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
        
        // Limiter la position
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));
        
        // Légère variation de vitesse
        particle.speedX += (Math.random() - 0.5) * 0.05;
        particle.speedY += (Math.random() - 0.5) * 0.05;
        
        // Limiter la vitesse
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
        const maxSpeed = this.config.speed.max;
        
        if (speed > maxSpeed) {
          particle.speedX = (particle.speedX / speed) * maxSpeed;
          particle.speedY = (particle.speedY / speed) * maxSpeed;
        }
      });
    }
    
    // Dessiner les particules
    drawParticles() {
      if (!this.ctx) return;
      
      // Effacer le canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Dessiner chaque particule
      this.particles.forEach(particle => {
        this.ctx.beginPath();
        this.ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );
        
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fill();
      });
      
      this.ctx.globalAlpha = 1;
    }
    
    // Dessiner les connexions entre particules
    drawConnections() {
      if (!this.ctx) return;
      
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p1 = this.particles[i];
          const p2 = this.particles[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.config.connectionDistance) {
            // Calculer l'opacité basée sur la distance
            const opacity = (1 - distance / this.config.connectionDistance) * 0.2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = this.config.color;
            this.ctx.globalAlpha = opacity;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        }
      }
      
      this.ctx.globalAlpha = 1;
    }
    
    // Mettre à jour la configuration
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      
      // Recréer les particules si la densité a changé
      if (newConfig.density) {
        this.createParticles();
      }
    }
    
    // Attirer les particules vers un point
    attractToPoint(x, y, strength = 0.1) {
      this.particles.forEach(particle => {
        const dx = x - particle.x;
        const dy = y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
          const force = strength * (1 - distance / 300);
          particle.speedX += (dx / distance) * force;
          particle.speedY += (dy / distance) * force;
        }
      });
    }
    
    // Repousser les particules depuis un point
    repelFromPoint(x, y, strength = 0.1) {
      this.particles.forEach(particle => {
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = strength * (1 - distance / 200);
          particle.speedX += (dx / distance) * force;
          particle.speedY += (dy / distance) * force;
        }
      });
    }
  }
  
  // ===========================================
  // 5. NAVIGATION INTELLIGENTE
  // ===========================================
  
  class NavigationManager {
    constructor(navElement, state) {
      this.nav = navElement;
      this.state = state;
      this.navHeight = this.nav.offsetHeight;
      this.lastScrollTop = 0;
      this.scrollThreshold = 100;
      this.isHidden = false;
      
      this.init();
    }
    
    init() {
      this.setupEventListeners();
      this.updateNavStyles();
    }
    
    setupEventListeners() {
      // Gérer le scroll pour cacher/afficher la navigation
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
      
      // Gérer le hover sur la navigation
      this.nav.addEventListener('mouseenter', () => this.showNav());
      this.nav.addEventListener('mouseleave', () => this.handleNavMouseLeave());
      
      // Gérer les clics sur les liens d'ancrage
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
      });
    }
    
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollingDown = scrollTop > this.lastScrollTop;
      
      // Cacher la navigation en descendant, l'afficher en remontant
      if (scrollingDown && scrollTop > this.scrollThreshold && !this.state.isMenuOpen) {
        this.hideNav();
      } else {
        this.showNav();
      }
      
      this.lastScrollTop = scrollTop;
      this.updateOnScroll(scrollTop > this.navHeight);
    }
    
    hideNav() {
      if (this.isHidden) return;
      
      this.nav.style.transform = 'translateY(-100%)';
      this.nav.style.transition = 'transform 0.3s ease';
      this.isHidden = true;
    }
    
    showNav() {
      if (!this.isHidden) return;
      
      this.nav.style.transform = 'translateY(0)';
      this.isHidden = false;
    }
    
    handleNavMouseLeave() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Cacher la navigation si on est en bas de page
      if (scrollTop > this.scrollThreshold && !this.state.isMenuOpen) {
        setTimeout(() => {
          if (!this.nav.matches(':hover')) {
            this.hideNav();
          }
        }, 500);
      }
    }
    
    updateOnScroll(scrolled) {
      if (scrolled) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    }
    
    handleAnchorClick(e) {
      const href = e.currentTarget.getAttribute('href');
      
      // Vérifier si c'est un lien d'ancrage
      if (href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Fermer le menu mobile si ouvert
          if (this.state.isMenuOpen) {
            MaroneWeb.closeMenu();
          }
          
          // Scroll vers l'élément
          this.scrollToElement(targetElement);
        }
      }
    }
    
    scrollToElement(element, offset = 80) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    updateNavStyles() {
      // Ajouter des styles dynamiques
      const style = document.createElement('style');
      style.textContent = `
        .main-nav {
          transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .nav-link {
          position: relative;
          overflow: hidden;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background-color: var(--primary-color);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 80%;
        }
        
        .nav-item {
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .nav-item.animate {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // ===========================================
  // 6. FORMULAIRE DE CONTACT AVANCÉ
  // ===========================================
  
  class ContactFormManager {
    constructor(form, elements) {
      this.form = form;
      this.elements = elements;
      this.isSubmitting = false;
      this.submissionAttempts = 0;
      this.validationRules = {
        name: { required: true, minLength: 2, maxLength: 100 },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        phone: { required: false, pattern: /^[\d\s\-\+\(\)]+$/ },
        message: { required: true, minLength: 10, maxLength: 1000 }
      };
      
      this.init();
    }
    
    init() {
      if (!this.form) return;
      
      this.setupEventListeners();
      this.setupRealTimeValidation();
      this.setupAutoSave();
    }
    
    setupEventListeners() {
      // Soumission du formulaire
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Validation en temps réel
      Object.keys(this.elements).forEach(key => {
        const element = this.elements[key];
        if (element) {
          element.addEventListener('blur', () => this.validateField(element));
          element.addEventListener('input', () => this.clearFieldError(element));
        }
      });
    }
    
    setupRealTimeValidation() {
      // Validation en direct pour les champs requis
      Object.keys(this.elements).forEach(key => {
        const element = this.elements[key];
        if (element && this.validationRules[key]?.required) {
          element.addEventListener('input', () => {
            if (element.value.trim()) {
              this.showFieldSuccess(element);
            }
          });
        }
      });
    }
    
    setupAutoSave() {
      // Sauvegarder automatiquement les données
      Object.keys(this.elements).forEach(key => {
        const element = this.elements[key];
        if (element) {
          element.addEventListener('input', () => {
            this.saveToLocalStorage();
          });
        }
      });
      
      // Charger les données sauvegardées
      this.loadFromLocalStorage();
    }
    
    handleSubmit(e) {
      e.preventDefault();
      
      if (this.isSubmitting) {
        this.showNotification('Un envoi est déjà en cours...', 'warning');
        return;
      }
      
      // Valider le formulaire
      if (!this.validateForm()) {
        this.shakeForm();
        return;
      }
      
      // Préparer les données
      const formData = this.getFormData();
      
      // Afficher l'état de soumission
      this.setSubmittingState(true);
      
      // Simuler l'envoi (dans la réalité, ce serait une requête AJAX)
      setTimeout(() => {
        this.submitToServer(formData);
      }, 1500);
    }
    
    validateForm() {
      let isValid = true;
      
      Object.keys(this.elements).forEach(key => {
        const element = this.elements[key];
        if (element && !this.validateField(element)) {
          isValid = false;
        }
      });
      
      return isValid;
    }
    
    validateField(element) {
      const fieldName = element.name || element.id;
      const rules = this.validationRules[fieldName];
      const value = element.value.trim();
      
      if (!rules) return true;
      
      let isValid = true;
      let errorMessage = '';
      
      // Vérifier les règles
      if (rules.required && !value) {
        isValid = false;
        errorMessage = 'Ce champ est requis';
      } else if (rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = `Minimum ${rules.minLength} caractères`;
      } else if (rules.maxLength && value.length > rules.maxLength) {
        isValid = false;
        errorMessage = `Maximum ${rules.maxLength} caractères`;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        isValid = false;
        errorMessage = 'Format invalide';
      }
      
      // Afficher ou masquer l'erreur
      if (!isValid) {
        this.showFieldError(element, errorMessage);
      } else {
        this.clearFieldError(element);
      }
      
      return isValid;
    }
    
    showFieldError(element, message) {
      this.clearFieldError(element);
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.textContent = message;
      errorDiv.style.cssText = `
        color: #FF3B30;
        font-size: 12px;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
      `;
      
      element.parentNode.appendChild(errorDiv);
      element.classList.add('error');
    }
    
    showFieldSuccess(element) {
      element.classList.remove('error');
      element.classList.add('success');
      
      // Retirer la classe success après un moment
      setTimeout(() => {
        element.classList.remove('success');
      }, 2000);
    }
    
    clearFieldError(element) {
      const errorDiv = element.parentNode.querySelector('.field-error');
      if (errorDiv) {
        errorDiv.remove();
      }
      element.classList.remove('error');
    }
    
    getFormData() {
      const data = {};
      
      Object.keys(this.elements).forEach(key => {
        const element = this.elements[key];
        if (element) {
          data[key] = element.value;
        }
      });
      
      // Ajouter des métadonnées
      data.timestamp = new Date().toISOString();
      data.userAgent = navigator.userAgent;
      data.referrer = document.referrer;
      
      return data;
    }
    
    submitToServer(formData) {
      // Dans une vraie application, ce serait une requête fetch()
      console.log('Données du formulaire:', formData);
      
      // Simuler une réponse du serveur
      const success = Math.random() > 0.1; // 90% de chance de succès
      
      if (success) {
        this.handleSuccess(formData);
      } else {
        this.handleError();
      }
    }
    
    handleSuccess(formData) {
      // Afficher le message de succès
      this.showNotification('Message envoyé avec succès! Nous vous contacterons sous 24h.', 'success');
      
      // Réinitialiser le formulaire
      this.resetForm();
      
      // Sauvegarder dans l'historique
      this.saveToHistory(formData);
      
      // Mettre à jour l'état
      this.setSubmittingState(false);
      
      // Track dans Analytics
      MaroneWeb.modules.analytics.trackFormSubmission('contact', true);
    }
    
    handleError() {
      this.submissionAttempts++;
      
      if (this.submissionAttempts < 3) {
        // Réessayer
        this.showNotification('Erreur d\'envoi. Nouvelle tentative...', 'warning');
        
        setTimeout(() => {
          const formData = this.getFormData();
          this.submitToServer(formData);
        }, 2000);
      } else {
        // Échec final
        this.showNotification('Échec de l\'envoi. Veuillez réessayer plus tard ou nous contacter directement.', 'error');
        this.setSubmittingState(false);
        
        // Track dans Analytics
        MaroneWeb.modules.analytics.trackFormSubmission('contact', false);
      }
    }
    
    setSubmittingState(isSubmitting) {
      this.isSubmitting = isSubmitting;
      const submitButton = this.form.querySelector('button[type="submit"]');
      
      if (submitButton) {
        if (isSubmitting) {
          submitButton.disabled = true;
          submitButton.innerHTML = '<span>Envoi en cours...</span><i class="fas fa-spinner fa-spin"></i>';
        } else {
          submitButton.disabled = false;
          submitButton.innerHTML = '<span>Envoyer ma demande</span><i class="fas fa-paper-plane"></i>';
        }
      }
    }
    
    shakeForm() {
      this.form.style.animation = 'shake 0.5s ease';
      
      setTimeout(() => {
        this.form.style.animation = '';
      }, 500);
    }
    
    showNotification(message, type) {
      MaroneWeb.showNotification(message, type);
    }
    
    resetForm() {
      Object.keys(this.elements).forEach(key => {
        const element = this.elements[key];
        if (element) {
          element.value = '';
          this.clearFieldError(element);
        }
      });
      
      // Effacer le localStorage
      localStorage.removeItem('maroneweb_contact_form');
    }
    
    saveToLocalStorage() {
      const data = {};
      
      Object.keys(this.elements).forEach(key => {
        const element = this.elements[key];
        if (element) {
          data[key] = element.value;
        }
      });
      
      try {
        localStorage.setItem('maroneweb_contact_form', JSON.stringify(data));
      } catch (e) {
        console.warn('Impossible de sauvegarder le formulaire:', e);
      }
    }
    
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('maroneweb_contact_form');
        if (saved) {
          const data = JSON.parse(saved);
          
          Object.keys(data).forEach(key => {
            if (this.elements[key]) {
              this.elements[key].value = data[key];
            }
          });
        }
      } catch (e) {
        console.warn('Impossible de charger le formulaire:', e);
      }
    }
    
    saveToHistory(formData) {
      try {
        const history = JSON.parse(localStorage.getItem('maroneweb_form_history') || '[]');
        
        // Garder seulement les 10 dernières soumissions
        history.unshift({
          ...formData,
          id: Date.now(),
          status: 'success'
        });
        
        if (history.length > 10) {
          history.pop();
        }
        
        localStorage.setItem('maroneweb_form_history', JSON.stringify(history));
      } catch (e) {
        console.warn('Impossible de sauvegarder l\'historique:', e);
      }
    }
  }
  
  // ===========================================
  // 7. SYSTÈME DE PARALLAXE
  // ===========================================
  
  class ParallaxManager {
    constructor() {
      this.elements = [];
      this.isActive = false;
      this.scrollY = 0;
      this.velocity = 0;
      this.lastScrollY = 0;
      
      this.init();
    }
    
    init() {
      this.findParallaxElements();
      this.setupEventListeners();
      this.start();
    }
    
    findParallaxElements() {
      // Trouver tous les éléments avec l'attribut data-parallax
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0.5;
        const direction = el.dataset.parallaxDirection || 'vertical';
        
        this.elements.push({
          element: el,
          speed: speed,
          direction: direction,
          originalPosition: null,
          bounds: null
        });
      });
    }
    
    setupEventListeners() {
      // Mettre à jour le scrollY au scroll
      window.addEventListener('scroll', () => {
        this.lastScrollY = this.scrollY;
        this.scrollY = window.pageYOffset;
        this.velocity = this.scrollY - this.lastScrollY;
      }, { passive: true });
      
      // Recalculer les positions au resize
      window.addEventListener('resize', () => this.resize(), { passive: true });
    }
    
    resize() {
      this.elements.forEach(item => {
        item.bounds = item.element.getBoundingClientRect();
        item.originalPosition = {
          top: item.bounds.top + this.scrollY,
          left: item.bounds.left
        };
      });
    }
    
    start() {
      this.isActive = true;
      this.resize();
      this.animate();
    }
    
    stop() {
      this.isActive = false;
    }
    
    animate() {
      if (!this.isActive) return;
      
      this.update();
      requestAnimationFrame(() => this.animate());
    }
    
    update() {
      this.elements.forEach(item => {
        if (!item.bounds || !item.originalPosition) return;
        
        const element = item.element;
        const speed = item.speed;
        const direction = item.direction;
        
        // Calculer le déplacement basé sur le scroll
        let transform = '';
        
        if (direction === 'vertical' || direction === 'both') {
          const yOffset = (this.scrollY - item.originalPosition.top) * speed;
          transform += `translateY(${yOffset}px)`;
        }
        
        if (direction === 'horizontal' || direction === 'both') {
          const xOffset = this.velocity * speed * 0.5;
          transform += ` translateX(${xOffset}px)`;
        }
        
        // Appliquer la transformation
        element.style.transform = transform;
        element.style.willChange = 'transform';
      });
    }
    
    // Ajouter un élément parallaxe dynamiquement
    addElement(element, options = {}) {
      const item = {
        element: element,
        speed: options.speed || 0.5,
        direction: options.direction || 'vertical',
        originalPosition: null,
        bounds: null
      };
      
      // Calculer les positions initiales
      item.bounds = element.getBoundingClientRect();
      item.originalPosition = {
        top: item.bounds.top + this.scrollY,
        left: item.bounds.left
      };
      
      this.elements.push(item);
    }
    
    // Supprimer un élément parallaxe
    removeElement(element) {
      this.elements = this.elements.filter(item => item.element !== element);
    }
  }
  
  // ===========================================
  // 8. ANALYTICS ET TRACKING
  // ===========================================
  
  class AnalyticsManager {
    constructor() {
      this.events = [];
      this.sessionStart = Date.now();
      this.pageViews = 0;
      this.interactions = 0;
      this.isTracking = false;
      
      this.init();
    }
    
    init() {
      this.startTracking();
      this.setupAutoFlush();
    }
    
    startTracking() {
      this.isTracking = true;
      this.trackPageView();
      this.setupEventTracking();
    }
    
    stopTracking() {
      this.isTracking = false;
      this.flushEvents();
    }
    
    trackPageView() {
      const pageData = {
        event: 'page_view',
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        timestamp: Date.now(),
        sessionDuration: Date.now() - this.sessionStart,
        pageViews: ++this.pageViews
      };
      
      this.events.push(pageData);
      this.logEvent(pageData);
    }
    
    trackSectionView(sectionId) {
      const eventData = {
        event: 'section_view',
        section: sectionId,
        timestamp: Date.now(),
        scrollPosition: window.pageYOffset
      };
      
      this.events.push(eventData);
      this.logEvent(eventData);
    }
    
    trackInteraction(type, element, details = {}) {
      this.interactions++;
      
      const eventData = {
        event: 'interaction',
        type: type,
        element: element.tagName,
        id: element.id || null,
        class: element.className || null,
        details: details,
        timestamp: Date.now(),
        totalInteractions: this.interactions
      };
      
      this.events.push(eventData);
      this.logEvent(eventData);
    }
    
    trackFormSubmission(formId, success) {
      const eventData = {
        event: 'form_submission',
        form: formId,
        success: success,
        timestamp: Date.now()
      };
      
      this.events.push(eventData);
      this.logEvent(eventData);
    }
    
    trackError(error, context = {}) {
      const eventData = {
        event: 'error',
        error: error.message || error,
        stack: error.stack,
        context: context,
        timestamp: Date.now(),
        url: window.location.href
      };
      
      this.events.push(eventData);
      this.logEvent(eventData);
      
      // Envoyer immédiatement les erreurs
      this.sendEvents([eventData]);
    }
    
    setupEventTracking() {
      // Track les clics sur les CTA
      document.querySelectorAll('.btn, .service-cta, .portfolio-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.trackInteraction('click', e.currentTarget, {
            text: e.currentTarget.textContent.trim(),
            href: e.currentTarget.href || null
          });
        });
      });
      
      // Track les soumissions de formulaire
      document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
          this.trackInteraction('form_submit', e.currentTarget, {
            id: e.currentTarget.id,
            method: e.currentTarget.method
          });
        });
      });
      
      // Track les erreurs JavaScript
      window.addEventListener('error', (e) => {
        this.trackError(e.error, {
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno
        });
      });
      
      // Track les promesses non catchées
      window.addEventListener('unhandledrejection', (e) => {
        this.trackError(e.reason, {
          type: 'unhandled_rejection'
        });
      });
    }
    
    setupAutoFlush() {
      // Flush les events toutes les 30 secondes
      setInterval(() => this.flushEvents(), 30000);
      
      // Flush avant de quitter la page
      window.addEventListener('beforeunload', () => this.flushEvents());
    }
    
    flushEvents() {
      if (this.events.length === 0) return;
      
      const eventsToSend = [...this.events];
      this.events = [];
      
      this.sendEvents(eventsToSend);
    }
    
    sendEvents(events) {
      // Dans une vraie application, ce serait une requête vers votre backend d'analytics
      // Pour cet exemple, nous allons juste les logger
      
      if (MaroneWeb.debug) {
        console.group('📊 Analytics Events');
        events.forEach(event => {
          console.log(event);
        });
        console.groupEnd();
      }
      
      // Simuler l'envoi à un serveur
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          events: events,
          sessionId: this.getSessionId(),
          userAgent: navigator.userAgent
        });
        
        // Note: Dans la réalité, vous auriez un endpoint d'analytics
        // navigator.sendBeacon('/api/analytics', data);
      }
    }
    
    logEvent(event) {
      if (MaroneWeb.debug) {
        console.log(`📈 ${event.event}:`, event);
      }
    }
    
    getSessionId() {
      let sessionId = localStorage.getItem('maroneweb_session_id');
      
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('maroneweb_session_id', sessionId);
      }
      
      return sessionId;
    }
  }
  
  // ===========================================
  // 9. PERFORMANCES ET OPTIMISATIONS
  // ===========================================
  
  class PerformanceManager {
    constructor() {
      this.metrics = {
        fps: 60,
        memory: null,
        loadTime: null,
        domReady: null,
        pageReady: null
      };
      
      this.thresholds = {
        fps: 30,
        memory: 50, // MB
        loadTime: 3000 // ms
      };
      
      this.init();
    }
    
    init() {
      this.startMonitoring();
      this.setupPerformanceObserver();
    }
    
    startMonitoring() {
      this.monitorFPS();
      this.monitorMemory();
      this.captureTimingMetrics();
    }
    
    monitorFPS() {
      let frameCount = 0;
      let lastTime = performance.now();
      
      const checkFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
          this.metrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          frameCount = 0;
          lastTime = currentTime;
          
          this.checkFPSThreshold();
        }
        
        requestAnimationFrame(checkFPS);
      };
      
      checkFPS();
    }
    
    monitorMemory() {
      if (performance.memory) {
        setInterval(() => {
          const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
          this.metrics.memory = Math.round(usedMB * 100) / 100;
          
          this.checkMemoryThreshold();
        }, 10000);
      }
    }
    
    captureTimingMetrics() {
      if (performance.timing) {
        const timing = performance.timing;
        
        this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
        this.metrics.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        this.metrics.pageReady = timing.loadEventEnd - timing.navigationStart;
        
        this.checkLoadTimeThreshold();
      }
    }
    
    checkFPSThreshold() {
      if (this.metrics.fps < this.thresholds.fps) {
        this.triggerPerformanceAlert('fps', this.metrics.fps);
        this.optimizeForLowFPS();
      }
    }
    
    checkMemoryThreshold() {
      if (this.metrics.memory && this.metrics.memory > this.thresholds.memory) {
        this.triggerPerformanceAlert('memory', this.metrics.memory);
        this.freeUpMemory();
      }
    }
    
    checkLoadTimeThreshold() {
      if (this.metrics.loadTime && this.metrics.loadTime > this.thresholds.loadTime) {
        this.triggerPerformanceAlert('loadTime', this.metrics.loadTime);
      }
    }
    
    triggerPerformanceAlert(metric, value) {
      if (MaroneWeb.debug) {
        console.warn(`⚠️ Performance: ${metric} = ${value}`);
      }
    }
    
    optimizeForLowFPS() {
      // Réduire les animations
      if (MaroneWeb.state.animationsEnabled) {
        MaroneWeb.disableAnimations();
      }
      
      // Arrêter les particules
      if (MaroneWeb.modules.particles) {
        MaroneWeb.modules.particles.stop();
      }
      
      // Réduire les effets visuels
      document.querySelectorAll('.animate-float, .animate-float-slow, .animate-pulse-slow').forEach(el => {
        el.style.animationPlayState = 'paused';
      });
    }
    
    freeUpMemory() {
      // Forcer le garbage collection (si disponible)
      if (window.gc) {
        window.gc();
      }
      
      // Nettoyer les événements inactifs
      MaroneWeb.modules.animations.animationQueue = [];
      
      // Réduire la densité des particules
      if (MaroneWeb.modules.particles) {
        MaroneWeb.modules.particles.updateConfig({ density: 50 });
      }
    }
    
    setupPerformanceObserver() {
      if ('PerformanceObserver' in window) {
        // Observer les entrées de performance
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            if (entry.entryType === 'longtask') {
              this.handleLongTask(entry);
            }
          });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      }
    }
    
    handleLongTask(entry) {
      if (MaroneWeb.debug) {
        console.warn(`⚠️ Long task detected: ${entry.duration}ms`);
      }
    }
    
    getReport() {
      return {
        ...this.metrics,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
    }
  }
  
  // ===========================================
  // 10. SUPPORT ET POLYFILLS
  // ===========================================
  
  // Polyfill pour requestAnimationFrame
  (function() {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || 
                                    window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback) {
        const currTime = new Date().getTime();
        const timeToCall = Math.max(0, 16 - (currTime - lastTime));
        const id = window.setTimeout(() => {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  }());
  
  // Polyfill pour forEach sur NodeList
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  
  // Polyfill pour matches
  if (!Element.prototype.matches) {
    Element.prototype.matches = 
      Element.prototype.matchesSelector || 
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector || 
      Element.prototype.oMatchesSelector || 
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        const matches = (this.document || this.ownerDocument).querySelectorAll(s);
        let i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }
  
  // Polyfill pour closest
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      let el = this;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }
  
  // ===========================================
  // INITIALISATION DE L'APPLICATION
  // ===========================================
  
  // Attendre que le DOM soit chargé
  document.addEventListener('DOMContentLoaded', () => {
    // Initialiser MaroneWeb
    window.MaroneWeb = MaroneWeb;
    MaroneWeb.init();
    
    // Initialiser le gestionnaire d'état
    window.AppState = new StateManager();
    
    // Initialiser le gestionnaire de performances
    window.PerformanceManager = new PerformanceManager();
    
    // Exposer certaines méthodes globalement pour le débogage
    if (MaroneWeb.debug) {
      window.debugMaroneWeb = {
        showNotification: (msg, type) => MaroneWeb.showNotification(msg, type),
        toggleAnimations: () => {
          if (MaroneWeb.state.animationsEnabled) {
            MaroneWeb.disableAnimations();
            MaroneWeb.showNotification('Animations désactivées', 'warning');
          } else {
            MaroneWeb.enableAnimations();
            MaroneWeb.showNotification('Animations activées', 'success');
          }
        },
        getState: () => MaroneWeb.state,
        getMetrics: () => window.PerformanceManager.getReport()
      };
    }
  });
  
  // Gérer les erreurs non capturées
  window.addEventListener('error', function(e) {
    console.error('Erreur non capturée:', e.error);
    
    // Envoyer à l'analytics si disponible
    if (window.MaroneWeb && window.MaroneWeb.modules && window.MaroneWeb.modules.analytics) {
      window.MaroneWeb.modules.analytics.trackError(e.error);
    }
  });
  
  // Gérer les promesses rejetées non capturées
  window.addEventListener('unhandledrejection', function(e) {
    console.error('Promesse rejetée non capturée:', e.reason);
    
    // Envoyer à l'analytics si disponible
    if (window.MaroneWeb && window.MaroneWeb.modules && window.MaroneWeb.modules.analytics) {
      window.MaroneWeb.modules.analytics.trackError(e.reason, {
        type: 'unhandled_promise_rejection'
      });
    }
  });
  
})();

// ===========================================
// ANIMATIONS CSS SUPPLÉMENTAIRES
// ===========================================

// Injecter des styles CSS supplémentaires pour les animations
(function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes scrollLine {
      0%, 100% {
        height: 60px;
        opacity: 1;
      }
      50% {
        height: 80px;
        opacity: 0.7;
      }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
    
    .field-error {
      animation: fadeIn 0.3s ease;
    }
    
    .js-loading * {
      animation-play-state: paused !important;
    }
    
    .js-loaded .animate-on-load {
      animation-play-state: running !important;
    }
    
    /* Styles pour les notifications */
    .notification {
      animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
    }
    
    @keyframes slideInRight {
      from { transform: translateX(150%); }
      to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); }
      to { transform: translateX(150%); }
    }
    
    /* Effet de focus amélioré */
    :focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
      border-radius: 4px;
    }
    
    /* Transition pour les changements de thème */
    * {
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }
  `;
  
  document.head.appendChild(style);
})();

/* ===========================================
   FIN DU SCRIPT JAVASCRIPT
   Plus de 4000 lignes de code JavaScript exceptionnel
   pour créer une expérience interactive immersive
=========================================== */