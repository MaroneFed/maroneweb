/* 
============================================
MARONEWEB - SCRIPT.JS ULTRA PREMIUM
Version: 3.0 | Plus de 4000 lignes
Fonctionnalités complètes et optimisées
============================================ 
*/

/* 
============================================
TABLE DES MATIÈRES
1. CONFIGURATION & VARIABLES GLOBALES
2. LOADING SCREEN AVANCÉ
3. CURSOR PERSONNALISÉ
4. NAVIGATION & HEADER
5. MOBILE MENU
6. HERO SECTION ANIMATIONS
7. CLIENTS MARQUEE & TESTIMONIALS
8. PORTFOLIO FILTERS & LOAD MORE
9. PROCESSUS TIMELINE
10. PRICING TOGGLE
11. CONTACT FORM MULTI-ÉTAPES
12. FORM VALIDATION & SUBMISSION
13. ANIMATIONS AU SCROLL
14. COUNTERS ANIMÉS
15. SMOOTH SCROLL
16. BACK TO TOP
17. MODALS & POPUPS
18. COOKIE CONSENT
19. PERFORMANCE MONITORING
20. ERROR HANDLING
21. UTILITY FUNCTIONS
22. INITIALIZATION
============================================ 
*/

/* 
============================================
1. CONFIGURATION & VARIABLES GLOBALES
============================================ 
*/

// Configuration globale
const CONFIG = {
    debug: false,
    performance: true,
    animations: true,
    lazyLoad: true,
    smoothScroll: true,
    cursor: true,
    particles: true,
    formValidation: true,
    analytics: true,
    version: '3.0.0'
};

// État global de l'application
const STATE = {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLoading: true,
    isMenuOpen: false,
    isScrolling: false,
    scrollDirection: 'down',
    lastScrollY: 0,
    currentTheme: 'dark',
    formStep: 1,
    assetsLoaded: 0,
    totalAssets: 0,
    scrollProgress: 0,
    mousePosition: { x: 0, y: 0 },
    activeSection: 'hero'
};

// Cache des éléments DOM
const DOM = {
    // Loading
    loader: null,
    progressBar: null,
    progressPercentage: null,
    progressStage: null,
    loaderTips: null,
    loaderCanvas: null,
    
    // Cursor
    cursor: null,
    cursorInner: null,
    cursorOuter: null,
    cursorText: null,
    
    // Navigation
    header: null,
    menuToggle: null,
    mobileMenu: null,
    menuClose: null,
    navLinks: null,
    
    // Hero
    heroCanvas: null,
    heroTitleWords: null,
    heroStats: null,
    
    // Clients
    marqueeTrack: null,
    testimonialSlides: null,
    testimonialDots: null,
    testimonialPrev: null,
    testimonialNext: null,
    
    // Portfolio
    portfolioGrid: null,
    filterButtons: null,
    loadMoreBtn: null,
    
    // Contact
    contactForm: null,
    formSteps: null,
    formProgressSteps: null,
    nextStepBtns: null,
    prevStepBtns: null,
    
    // Modals
    successModal: null,
    cookieModal: null,
    
    // Misc
    backToTop: null,
    counters: null
};

// Données de l'application
const DATA = {
    tips: [
        "Préparation de l'expérience unique...",
        "Chargement des animations 3D...",
        "Optimisation des performances...",
        "Initialisation des interactions...",
        "Configuration des effets visuels..."
    ],
    
    testimonials: [
        {
            text: "MARONEWEB a transformé notre présence digitale. Leur approche sur-mesure et leur attention aux détails ont dépassé nos attentes. Notre nouveau site a augmenté notre engagement de 300%.",
            author: "Sarah Chen",
            role: "Directrice Marketing • Luxury Group",
            rating: 5
        },
        {
            text: "Une collaboration exceptionnelle. L'équipe de MARONEWEB a su comprendre notre vision et l'a transformée en une expérience digitale qui représente parfaitement notre marque.",
            author: "Thomas Moreau",
            role: "CEO • Innovate Tech",
            rating: 5
        },
        {
            text: "La méthodologie claire et les livrables réguliers de MARONEWEB ont rendu le processus transparent et rassurant. Nous étions impliqués à chaque étape.",
            author: "Alexandre Dubois",
            role: "Directeur Technique • FinTech Solutions",
            rating: 5
        }
    ],
    
    portfolioItems: [
        {
            id: 1,
            title: "Luxury Artisan",
            category: ["vitrine", "design"],
            description: "Site vitrine premium pour une marque d'artisanat de luxe, avec animations 3D personnalisées et design minimaliste.",
            stats: { engagement: "+225%", contacts: "+180%" },
            featured: true
        },
        {
            id: 2,
            title: "Urban Fashion Co.",
            category: ["ecommerce"],
            description: "Plateforme e-commerce complète avec design mobile-first, intégrations de paiement et système de gestion avancé.",
            stats: { conversions: "+320%", abandon: "-40%" },
            featured: false
        },
        {
            id: 3,
            title: "TechCorp Interactive",
            category: ["experience", "vitrine"],
            description: "Site corporate avec animations WebGL personnalisées et parcours utilisateur immersif pour une marque tech.",
            stats: { time: "+450%", shares: "+280%" },
            featured: false
        },
        {
            id: 4,
            title: "Nova Identity",
            category: ["design"],
            description: "Refonte complète de l'identité visuelle et création d'un design system pour une startup de la tech.",
            stats: { consistency: "+95%", devTime: "-60%" },
            featured: false
        }
    ],
    
    // Plus d'items pour le load more
    morePortfolioItems: [
        {
            id: 5,
            title: "HealthTech Platform",
            category: ["experience", "vitrine"],
            description: "Plateforme de santé numérique avec tableau de bord personnalisé et visualisation de données.",
            stats: { users: "+200%", retention: "+40%" },
            featured: false
        },
        {
            id: 6,
            title: "Eco Fashion Store",
            category: ["ecommerce", "design"],
            description: "Boutique en ligne éco-responsable avec focus sur l'expérience utilisateur durable.",
            stats: { sales: "+180%", returns: "-25%" },
            featured: false
        }
    ]
};

/* 
============================================
2. LOADING SCREEN AVANCÉ
============================================ 
*/

class LoadingManager {
    constructor() {
        this.progress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.stages = [
            { name: 'Initialisation...', weight: 10 },
            { name: 'Chargement des polices...', weight: 15 },
            { name: 'Chargement des images...', weight: 30 },
            { name: 'Configuration des animations...', weight: 20 },
            { name: 'Préparation de l\'expérience...', weight: 25 }
        ];
        this.currentStage = 0;
        this.stageProgress = 0;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
        this.startLoading();
    }
    
    cacheDOM() {
        DOM.loader = document.getElementById('globalLoader');
        DOM.progressBar = document.getElementById('progressBar');
        DOM.progressPercentage = document.getElementById('progressPercentage');
        DOM.progressStage = document.getElementById('progressStage');
        DOM.loaderTips = document.getElementById('currentTip');
        DOM.loaderCanvas = document.getElementById('loaderCanvas');
        
        // Initialiser les tips
        this.updateTip();
    }
    
    setupEventListeners() {
        window.addEventListener('load', () => this.onWindowLoad());
        document.addEventListener('DOMContentLoaded', () => this.onDOMContentLoaded());
    }
    
    startLoading() {
        STATE.isLoading = true;
        
        // Compter les assets à charger
        this.countAssets();
        
        // Démarrer les animations
        this.startAnimations();
        
        // Simuler le chargement si aucun asset
        if (this.totalAssets === 0) {
            this.simulateLoading();
        }
    }
    
    countAssets() {
        // Images
        const images = document.querySelectorAll('img');
        this.totalAssets += images.length;
        
        // Fonts
        this.totalAssets += 2; // Google Fonts
        
        // Scripts externes
        const scripts = document.querySelectorAll('script[src]');
        this.totalAssets += scripts.length;
        
        // Styles externes
        const styles = document.querySelectorAll('link[rel="stylesheet"]');
        this.totalAssets += styles.length;
    }
    
    simulateLoading() {
        let simulatedProgress = 0;
        const interval = setInterval(() => {
            simulatedProgress += Math.random() * 10;
            this.updateProgress(simulatedProgress);
            
            if (simulatedProgress >= 100) {
                clearInterval(interval);
                this.completeLoading();
            }
        }, 200);
    }
    
    updateProgress(value) {
        this.progress = Math.min(100, Math.max(0, value));
        
        // Mettre à jour la barre de progression
        if (DOM.progressBar) {
            DOM.progressBar.style.width = `${this.progress}%`;
        }
        
        // Mettre à jour le pourcentage
        if (DOM.progressPercentage) {
            DOM.progressPercentage.textContent = `${Math.round(this.progress)}%`;
        }
        
        // Mettre à jour l'étape
        this.updateStage();
        
        // Changer le tip aléatoirement
        if (Math.random() > 0.8) {
            this.updateTip();
        }
    }
    
    updateStage() {
        const totalWeight = this.stages.reduce((sum, stage) => sum + stage.weight, 0);
        let accumulatedWeight = 0;
        
        for (let i = 0; i < this.stages.length; i++) {
            accumulatedWeight += this.stages[i].weight;
            if (this.progress <= (accumulatedWeight / totalWeight) * 100) {
                if (this.currentStage !== i) {
                    this.currentStage = i;
                    if (DOM.progressStage) {
                        DOM.progressStage.textContent = this.stages[i].name;
                    }
                }
                break;
            }
        }
    }
    
    updateTip() {
        if (DOM.loaderTips && DATA.tips.length > 0) {
            const randomTip = DATA.tips[Math.floor(Math.random() * DATA.tips.length)];
            DOM.loaderTips.innerHTML = `<i class="ti ti-sparkles"></i><span>${randomTip}</span>`;
        }
    }
    
    startAnimations() {
        // Animation des lettres du logo
        this.animateLogoLetters();
        
        // Animation des particules si activé
        if (CONFIG.particles && DOM.loaderCanvas) {
            this.initParticles();
        }
    }
    
    animateLogoLetters() {
        const letters = document.querySelectorAll('.loader__letter');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.animation = 'letterReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            }, index * 100);
        });
    }
    
    initParticles() {
        const canvas = DOM.loaderCanvas;
        const ctx = canvas.getContext('2d');
        
        // Ajuster la taille du canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const particles = [];
        const particleCount = 50;
        
        // Créer les particules
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: `rgba(124, 58, 237, ${Math.random() * 0.5 + 0.2})`
            });
        }
        
        // Fonction d'animation
        const animate = () => {
            if (!STATE.isLoading) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Rebond sur les bords
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                // Dessiner la particule
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    onAssetLoaded() {
        this.loadedAssets++;
        const progress = (this.loadedAssets / this.totalAssets) * 100;
        this.updateProgress(progress);
        
        if (this.loadedAssets >= this.totalAssets) {
            this.completeLoading();
        }
    }
    
    onDOMContentLoaded() {
        // Compter les éléments supplémentaires
        const videos = document.querySelectorAll('video');
        const iframes = document.querySelectorAll('iframe');
        
        this.totalAssets += videos.length + iframes.length;
        
        // Mettre à jour la progression
        this.updateProgress(30); // 30% après DOMContentLoaded
    }
    
    onWindowLoad() {
        this.updateProgress(80); // 80% après window.load
        
        // Attendre un peu pour l'effet
        setTimeout(() => {
            this.completeLoading();
        }, 1000);
    }
    
    completeLoading() {
        this.updateProgress(100);
        
        // Animation de fin
        setTimeout(() => {
            // Cacher le loader avec animation
            if (DOM.loader) {
                DOM.loader.classList.add('loaded');
                
                // Réinitialiser le body
                document.body.classList.remove('no-js');
                document.body.classList.add('js-loaded');
                
                // Mettre à jour l'état
                STATE.isLoading = false;
                
                // Déclencher les événements post-chargement
                this.triggerAfterLoad();
            }
        }, 800);
    }
    
    triggerAfterLoad() {
        // Déclencher l'événement personnalisé
        const event = new CustomEvent('maroneweb:loaded', {
            detail: {
                timestamp: Date.now(),
                config: CONFIG,
                state: STATE
            }
        });
        document.dispatchEvent(event);
        
        // Initialiser les autres composants
        if (window.App) {
            window.App.initComponents();
        }
    }
}

/* 
============================================
3. CURSOR PERSONNALISÉ
============================================ 
*/

class CustomCursor {
    constructor() {
        this.pos = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        this.speed = 0.15;
        this.isMoving = false;
        this.isHovering = false;
        this.isClicking = false;
        this.lastClick = 0;
        
        this.init();
    }
    
    init() {
        if (!CONFIG.cursor || STATE.isMobile) return;
        
        this.cacheDOM();
        this.setupEventListeners();
        this.animate();
    }
    
    cacheDOM() {
        DOM.cursor = document.getElementById('cursor');
        DOM.cursorInner = DOM.cursor?.querySelector('.cursor__inner');
        DOM.cursorOuter = DOM.cursor?.querySelector('.cursor__outer');
        DOM.cursorText = DOM.cursor?.querySelector('.cursor__text');
    }
    
    setupEventListeners() {
        // Suivre la souris
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Événements de clic
        document.addEventListener('mousedown', () => this.onMouseDown());
        document.addEventListener('mouseup', () => this.onMouseUp());
        
        // Événements hover
        this.setupHoverEvents();
    }
    
    setupHoverEvents() {
        // Éléments interactifs
        const interactiveElements = [
            'a',
            'button',
            '.btn',
            '.nav__link',
            '.portfolio-item',
            '.expertise-card',
            '.filter-btn',
            '.testimonial-controls button',
            'input',
            'textarea',
            'select'
        ];
        
        interactiveElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.addEventListener('mouseenter', () => this.onHoverStart(element));
                element.addEventListener('mouseleave', () => this.onHoverEnd());
            });
        });
        
        // Text hover
        document.querySelectorAll('[data-cursor-text]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const text = e.target.dataset.cursorText || 'Voir';
                this.setText(text);
            });
            element.addEventListener('mouseleave', () => this.clearText());
        });
    }
    
    onMouseMove(e) {
        this.targetPos.x = e.clientX;
        this.targetPos.y = e.clientY;
        
        if (!this.isMoving) {
            this.pos.x = e.clientX;
            this.pos.y = e.clientY;
            this.isMoving = true;
        }
    }
    
    onMouseDown() {
        this.isClicking = true;
        this.lastClick = Date.now();
        
        if (DOM.cursor) {
            DOM.cursor.classList.add('cursor--click');
        }
    }
    
    onMouseUp() {
        this.isClicking = false;
        
        if (DOM.cursor) {
            DOM.cursor.classList.remove('cursor--click');
        }
    }
    
    onHoverStart(element) {
        this.isHovering = true;
        
        if (DOM.cursor) {
            DOM.cursor.classList.add('cursor--hover');
            
            // Style spécifique pour certains éléments
            if (element.classList.contains('btn--primary')) {
                DOM.cursor.classList.add('cursor--primary');
            }
        }
    }
    
    onHoverEnd() {
        this.isHovering = false;
        
        if (DOM.cursor) {
            DOM.cursor.classList.remove('cursor--hover', 'cursor--primary', 'cursor--text');
        }
    }
    
    setText(text) {
        this.isHovering = true;
        
        if (DOM.cursor && DOM.cursorText) {
            DOM.cursor.classList.add('cursor--text');
            DOM.cursorText.textContent = text;
        }
    }
    
    clearText() {
        if (DOM.cursor && DOM.cursorText) {
            DOM.cursor.classList.remove('cursor--text');
            DOM.cursorText.textContent = '';
        }
    }
    
    animate() {
        if (!this.isMoving || !DOM.cursor) return;
        
        // Interpolation fluide
        const dx = this.targetPos.x - this.pos.x;
        const dy = this.targetPos.y - this.pos.y;
        
        this.pos.x += dx * this.speed;
        this.pos.y += dy * this.speed;
        
        // Mettre à jour la position
        DOM.cursor.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
        
        // Continuer l'animation
        requestAnimationFrame(() => this.animate());
    }
    
    hide() {
        if (DOM.cursor) {
            DOM.cursor.classList.add('cursor--hidden');
        }
    }
    
    show() {
        if (DOM.cursor) {
            DOM.cursor.classList.remove('cursor--hidden');
        }
    }
}

/* 
============================================
4. NAVIGATION & HEADER
============================================ 
*/

class Navigation {
    constructor() {
        this.isScrolled = false;
        this.lastScrollTop = 0;
        this.scrollThreshold = 100;
        this.headerHeight = 80;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
        this.updateActiveSection();
    }
    
    cacheDOM() {
        DOM.header = document.getElementById('mainHeader');
        DOM.menuToggle = document.getElementById('menuToggle');
        DOM.navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
        DOM.scrollIndicator = document.getElementById('scrollIndicator');
    }
    
    setupEventListeners() {
        // Scroll
        window.addEventListener('scroll', () => this.onScroll());
        
        // Resize
        window.addEventListener('resize', () => this.onResize());
        
        // Navigation
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.onNavLinkClick(e));
        });
        
        // Header scroll indicator
        this.updateScrollIndicator();
    }
    
    onScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Direction du scroll
        STATE.scrollDirection = scrollTop > this.lastScrollTop ? 'down' : 'up';
        this.lastScrollTop = scrollTop;
        
        // Header sticky
        this.updateHeaderState(scrollTop);
        
        // Scroll indicator
        this.updateScrollIndicator();
        
        // Section active
        this.updateActiveSection();
        
        // Performance
        STATE.isScrolling = true;
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            STATE.isScrolling = false;
        }, 100);
    }
    
    updateHeaderState(scrollTop) {
        if (scrollTop > this.scrollThreshold) {
            if (!this.isScrolled) {
                this.isScrolled = true;
                DOM.header?.classList.add('scrolled');
            }
            
            // Cacher/montrer le header selon la direction
            if (scrollTop > this.headerHeight) {
                if (STATE.scrollDirection === 'down' && !STATE.isMenuOpen) {
                    DOM.header?.classList.add('header--hidden');
                } else {
                    DOM.header?.classList.remove('header--hidden');
                }
            }
        } else {
            if (this.isScrolled) {
                this.isScrolled = false;
                DOM.header?.classList.remove('scrolled', 'header--hidden');
            }
        }
    }
    
    updateScrollIndicator() {
        if (!DOM.scrollIndicator) return;
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
        DOM.scrollIndicator.style.width = `${progress}%`;
        
        // Mettre à jour l'état global
        STATE.scrollProgress = progress;
    }
    
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (STATE.activeSection !== sectionId) {
                    STATE.activeSection = sectionId;
                    this.highlightNavLink(sectionId);
                    
                    // Déclencher l'événement
                    const event = new CustomEvent('section:change', {
                        detail: { section: sectionId }
                    });
                    document.dispatchEvent(event);
                }
            }
        });
    }
    
    highlightNavLink(sectionId) {
        DOM.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
                
                // Mettre à jour l'élément parent si nécessaire
                const parentItem = link.closest('.nav__item, .mobile-menu__item');
                if (parentItem) {
                    parentItem.classList.add('active');
                }
            } else {
                link.classList.remove('active');
                const parentItem = link.closest('.nav__item, .mobile-menu__item');
                if (parentItem) {
                    parentItem.classList.remove('active');
                }
            }
        });
    }
    
    onNavLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Vérifier si c'est un lien d'ancrage
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Fermer le menu mobile s'il est ouvert
                if (STATE.isMenuOpen && window.MobileMenu) {
                    window.MobileMenu.close();
                }
                
                // Scroll fluide vers la section
                this.scrollToElement(targetElement);
            }
        }
    }
    
    scrollToElement(element, offset = 80) {
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
    
    onResize() {
        // Mettre à jour la hauteur du header
        this.headerHeight = DOM.header?.offsetHeight || 80;
        
        // Mettre à jour l'état responsive
        this.updateResponsiveState();
    }
    
    updateResponsiveState() {
        const width = window.innerWidth;
        
        STATE.isMobile = width < 768;
        STATE.isTablet = width >= 768 && width < 1024;
        STATE.isDesktop = width >= 1024;
        
        // Ajuster le curseur sur mobile
        if (STATE.isMobile && window.Cursor) {
            window.Cursor.hide();
        } else if (window.Cursor) {
            window.Cursor.show();
        }
    }
}

/* 
============================================
5. MOBILE MENU
============================================ 
*/

class MobileMenu {
    constructor() {
        this.isAnimating = false;
        this.animationDuration = 600;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
    }
    
    cacheDOM() {
        DOM.mobileMenu = document.getElementById('mobileMenu');
        DOM.menuToggle = document.getElementById('menuToggle');
        DOM.menuClose = document.getElementById('menuClose');
    }
    
    setupEventListeners() {
        // Bouton toggle
        if (DOM.menuToggle) {
            DOM.menuToggle.addEventListener('click', () => this.toggle());
        }
        
        // Bouton close
        if (DOM.menuClose) {
            DOM.menuClose.addEventListener('click', () => this.close());
        }
        
        // Fermer en cliquant sur l'overlay
        const overlay = DOM.mobileMenu?.querySelector('.mobile-menu__overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && STATE.isMenuOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        if (this.isAnimating) return;
        
        if (STATE.isMenuOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        if (this.isAnimating || STATE.isMenuOpen) return;
        
        this.isAnimating = true;
        STATE.isMenuOpen = true;
        
        // Mettre à jour le bouton burger
        DOM.menuToggle?.classList.add('active');
        
        // Afficher le menu
        DOM.mobileMenu?.classList.add('active');
        
        // Bloquer le scroll du body
        document.body.style.overflow = 'hidden';
        
        // Animation d'entrée
        setTimeout(() => {
            this.isAnimating = false;
            
            // Focus trap
            this.setupFocusTrap();
        }, this.animationDuration);
    }
    
    close() {
        if (this.isAnimating || !STATE.isMenuOpen) return;
        
        this.isAnimating = true;
        STATE.isMenuOpen = false;
        
        // Mettre à jour le bouton burger
        DOM.menuToggle?.classList.remove('active');
        
        // Cacher le menu
        DOM.mobileMenu?.classList.remove('active');
        
        // Rétablir le scroll du body
        document.body.style.overflow = '';
        
        // Retirer le focus trap
        this.removeFocusTrap();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.animationDuration);
    }
    
    setupFocusTrap() {
        // Focus sur le premier élément interactif
        const firstFocusable = DOM.mobileMenu?.querySelector('button, a, input, textarea, select');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Trap focus dans le menu
        this.focusTrap = (e) => {
            if (!DOM.mobileMenu?.contains(e.target) && e.key === 'Tab') {
                e.preventDefault();
                firstFocusable?.focus();
            }
        };
        
        document.addEventListener('keydown', this.focusTrap);
    }
    
    removeFocusTrap() {
        if (this.focusTrap) {
            document.removeEventListener('keydown', this.focusTrap);
            this.focusTrap = null;
        }
    }
}

/* 
============================================
6. HERO SECTION ANIMATIONS
============================================ 
*/

class HeroAnimations {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.floatingElements = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
        this.initAnimations();
    }
    
    cacheDOM() {
        DOM.heroCanvas = document.getElementById('heroCanvas');
        DOM.heroTitleWords = document.querySelectorAll('.title-word');
        DOM.heroStats = document.querySelectorAll('.counter');
    }
    
    setupEventListeners() {
        // Redimensionnement du canvas
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Animation au scroll
        window.addEventListener('scroll', () => this.onScroll());
    }
    
    initAnimations() {
        // Initialiser le canvas
        if (DOM.heroCanvas) {
            this.initCanvas();
        }
        
        // Animer les titres
        this.animateTitles();
        
        // Animer les statistiques
        if (DOM.heroStats.length > 0) {
            this.initCounters();
        }
        
        // Animer les éléments flottants
        this.animateFloatingElements();
    }
    
    initCanvas() {
        this.canvas = DOM.heroCanvas;
        this.ctx = this.canvas.getContext('2d');
        
        // Ajuster la taille
        this.resizeCanvas();
        
        // Créer les particules
        this.createParticles();
        
        // Démarrer l'animation
        this.animate();
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        
        // Redessiner les particules
        this.createParticles();
    }
    
    createParticles() {
        this.particles = [];
        const count = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / 10000));
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.getRandomColor(),
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            '124, 58, 237', // Primary
            '6, 182, 212',  // Secondary
            '245, 158, 11', // Accent
            '255, 255, 255' // White
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animate() {
        if (!this.canvas || !this.ctx) return;
        
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Animer et dessiner les particules
        this.particles.forEach(particle => {
            // Mettre à jour la position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Rebond sur les bords
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            // Dessiner la particule
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Continuer l'animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    animateTitles() {
        DOM.heroTitleWords.forEach((word, index) => {
            // Animation déjà gérée par CSS, on ajoute juste un délai
            word.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    initCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        // Observer le conteneur des statistiques
        const statsContainer = document.querySelector('.hero__stats');
        if (statsContainer) {
            observer.observe(statsContainer);
        }
    }
    
    startCounters() {
        DOM.heroStats.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const suffix = counter.dataset.suffix || '';
            const duration = 2000; // 2 secondes
            const step = Math.ceil(target / (duration / 16)); // 60fps
            
            let current = 0;
            const increment = () => {
                current += step;
                if (current >= target) {
                    current = target;
                    counter.textContent = target + suffix;
                } else {
                    counter.textContent = current + suffix;
                    requestAnimationFrame(increment);
                }
            };
            
            // Démarrer avec un léger délai pour l'effet
            setTimeout(() => {
                requestAnimationFrame(increment);
            }, Math.random() * 500);
        });
    }
    
    animateFloatingElements() {
        const elements = document.querySelectorAll('.floating-element');
        
        elements.forEach(element => {
            // Animation CSS déjà en place, on ajoute des interactions
            element.addEventListener('mouseenter', () => {
                element.style.animationPlayState = 'paused';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.animationPlayState = 'running';
            });
        });
    }
    
    onScroll() {
        // Effet parallaxe sur le hero
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero');
        
        if (hero && scrollY < window.innerHeight) {
            const speed = 0.5;
            hero.style.transform = `translateY(${scrollY * speed}px)`;
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

/* 
============================================
7. CLIENTS MARQUEE & TESTIMONIALS
============================================ 
*/

class ClientsSection {
    constructor() {
        this.marqueeSpeed = 0.5;
        this.isPaused = false;
        this.currentTestimonial = 0;
        this.testimonialInterval = null;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
        this.initMarquee();
        this.initTestimonials();
    }
    
    cacheDOM() {
        DOM.marqueeTrack = document.getElementById('marqueeTrack');
        DOM.testimonialSlides = document.querySelectorAll('.testimonial-slide');
        DOM.testimonialDots = document.querySelectorAll('.testimonial-dot');
        DOM.testimonialPrev = document.querySelector('.testimonial-prev');
        DOM.testimonialNext = document.querySelector('.testimonial-next');
    }
    
    setupEventListeners() {
        // Pause marquee au hover
        if (DOM.marqueeTrack) {
            DOM.marqueeTrack.addEventListener('mouseenter', () => this.pauseMarquee());
            DOM.marqueeTrack.addEventListener('mouseleave', () => this.resumeMarquee());
        }
        
        // Contrôles témoignages
        if (DOM.testimonialPrev) {
            DOM.testimonialPrev.addEventListener('click', () => this.prevTestimonial());
        }
        
        if (DOM.testimonialNext) {
            DOM.testimonialNext.addEventListener('click', () => this.nextTestimonial());
        }
        
        // Dots témoignages
        DOM.testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToTestimonial(index));
        });
        
        // Auto-play témoignages
        this.startAutoPlay();
    }
    
    initMarquee() {
        if (!DOM.marqueeTrack) return;
        
        // Dupliquer le contenu pour un défilement infini
        const content = DOM.marqueeTrack.innerHTML;
        DOM.marqueeTrack.innerHTML += content;
        
        // Démarrer l'animation
        this.animateMarquee();
    }
    
    animateMarquee() {
        if (!DOM.marqueeTrack || this.isPaused) return;
        
        const scrollPos = DOM.marqueeTrack.scrollLeft;
        const width = DOM.marqueeTrack.scrollWidth / 2;
        
        // Si on a défilé la moitié du contenu, revenir au début
        if (scrollPos >= width) {
            DOM.marqueeTrack.scrollLeft = 0;
        } else {
            DOM.marqueeTrack.scrollLeft += this.marqueeSpeed;
        }
        
        requestAnimationFrame(() => this.animateMarquee());
    }
    
    pauseMarquee() {
        this.isPaused = true;
    }
    
    resumeMarquee() {
        this.isPaused = false;
        this.animateMarquee();
    }
    
    initTestimonials() {
        if (DOM.testimonialSlides.length === 0) return;
        
        // Afficher le premier témoignage
        this.showTestimonial(0);
    }
    
    showTestimonial(index) {
        // Valider l'index
        if (index < 0) index = DOM.testimonialSlides.length - 1;
        if (index >= DOM.testimonialSlides.length) index = 0;
        
        // Cacher tous les témoignages
        DOM.testimonialSlides.forEach(slide => {
            slide.classList.remove('testimonial-slide--active');
        });
        
        // Afficher le témoignage sélectionné
        DOM.testimonialSlides[index].classList.add('testimonial-slide--active');
        
        // Mettre à jour les dots
        DOM.testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('testimonial-dot--active', i === index);
        });
        
        // Mettre à jour l'état
        this.currentTestimonial = index;
        
        // Redémarrer l'auto-play
        this.restartAutoPlay();
    }
    
    prevTestimonial() {
        this.showTestimonial(this.currentTestimonial - 1);
    }
    
    nextTestimonial() {
        this.showTestimonial(this.currentTestimonial + 1);
    }
    
    goToTestimonial(index) {
        this.showTestimonial(index);
    }
    
    startAutoPlay() {
        this.testimonialInterval = setInterval(() => {
            this.nextTestimonial();
        }, 5000); // Change toutes les 5 secondes
    }
    
    restartAutoPlay() {
        if (this.testimonialInterval) {
            clearInterval(this.testimonialInterval);
        }
        this.startAutoPlay();
    }
    
    stopAutoPlay() {
        if (this.testimonialInterval) {
            clearInterval(this.testimonialInterval);
            this.testimonialInterval = null;
        }
    }
}

/* 
============================================
8. PORTFOLIO FILTERS & LOAD MORE
============================================ 
*/

class PortfolioManager {
    constructor() {
        this.activeFilter = 'all';
        this.visibleItems = 4;
        this.allItems = [...DATA.portfolioItems, ...DATA.morePortfolioItems];
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
        this.renderPortfolio();
    }
    
    cacheDOM() {
        DOM.portfolioGrid = document.getElementById('portfolioGrid');
        DOM.filterButtons = document.querySelectorAll('.filter-btn');
        DOM.loadMoreBtn = document.getElementById('loadMoreProjects');
    }
    
    setupEventListeners() {
        // Filtres
        DOM.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.onFilterClick(e));
        });
        
        // Load more
        if (DOM.loadMoreBtn) {
            DOM.loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
    }
    
    renderPortfolio() {
        if (!DOM.portfolioGrid) return;
        
        // Filtrer les items
        const filteredItems = this.filterItems();
        
        // Trier: featured d'abord
        filteredItems.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        
        // Limiter le nombre d'items visibles
        const visibleItems = filteredItems.slice(0, this.visibleItems);
        
        // Générer le HTML
        DOM.portfolioGrid.innerHTML = visibleItems.map(item => this.createPortfolioItemHTML(item)).join('');
        
        // Mettre à jour le bouton load more
        this.updateLoadMoreButton(filteredItems.length);
        
        // Initialiser les animations
        this.initItemAnimations();
    }
    
    filterItems() {
        if (this.activeFilter === 'all') {
            return this.allItems;
        }
        
        return this.allItems.filter(item => 
            item.category.includes(this.activeFilter)
        );
    }
    
    createPortfolioItemHTML(item) {
        const statsHTML = Object.entries(item.stats || {})
            .map(([key, value]) => `
                <div class="stat">
                    <div class="stat__value">${value}</div>
                    <div class="stat__label">${this.getStatLabel(key)}</div>
                </div>
            `).join('');
        
        return `
            <article class="portfolio-item" data-category="${item.category.join(' ')}" data-id="${item.id}">
                ${item.featured ? `
                    <div class="portfolio-item__featured">
                        <span>Projet vedette</span>
                        <i class="ti ti-star"></i>
                    </div>
                ` : ''}
                
                <div class="portfolio-item__preview">
                    <div class="preview-container">
                        <div class="device-preview">
                            <div class="device device--macbook">
                                <div class="device__screen">
                                    <div class="screen-content">
                                        <div class="project-preview">
                                            <div class="preview-nav">
                                                <div class="nav-brand">${item.title.split(' ')[0]}</div>
                                                <div class="nav-menu">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div class="preview-hero">
                                                <h5>${item.title}</h5>
                                                <p>${item.description.substring(0, 50)}...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="device__base"></div>
                            </div>
                        </div>
                        
                        <div class="portfolio-tags">
                            ${item.category.map(cat => `<span class="tag">${this.formatCategory(cat)}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="portfolio-item__info">
                    <div class="portfolio-meta">
                        <span class="meta-category">${this.getCategoryLabel(item.category)}</span>
                        <span class="meta-year">2024</span>
                    </div>
                    
                    <h3 class="portfolio-title">${item.title}</h3>
                    
                    <p class="portfolio-description">
                        ${item.description}
                    </p>
                    
                    <div class="portfolio-stats">
                        ${statsHTML}
                    </div>
                    
                    <div class="portfolio-actions">
                        <a href="#casestudy-${item.id}" class="btn btn--primary">
                            <span>Voir l'étude de cas</span>
                            <i class="ti ti-external-link"></i>
                        </a>
                        <a href="#contact" class="link-arrow">
                            <span>Projet similaire</span>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }
    
    getStatLabel(key) {
        const labels = {
            engagement: 'Temps d\'engagement',
            contacts: 'Demandes de contact',
            conversions: 'Conversions mobile',
            abandon: 'Taux d\'abandon',
            time: 'Temps passé',
            shares: 'Partages sociaux',
            consistency: 'Cohérence visuelle',
            devTime: 'Temps de développement',
            users: 'Utilisateurs actifs',
            retention: 'Rétention',
            sales: 'Ventes',
            returns: 'Retours'
        };
        
        return labels[key] || key;
    }
    
    formatCategory(cat) {
        const formatted = {
            vitrine: 'Site Vitrine',
            design: 'Design',
            ecommerce: 'E-commerce',
            experience: 'Expérience'
        };
        
        return formatted[cat] || cat;
    }
    
    getCategoryLabel(categories) {
        return categories.map(cat => this.formatCategory(cat)).join(' • ');
    }
    
    initItemAnimations() {
        const items = DOM.portfolioGrid?.querySelectorAll('.portfolio-item');
        
        if (items) {
            items.forEach((item, index) => {
                // Animation d'entrée
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('animate-fade-in-up');
                
                // Effet hover
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateY(-10px)';
                    item.style.boxShadow = 'var(--glow-primary)';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateY(0)';
                    item.style.boxShadow = 'none';
                });
            });
        }
    }
    
    onFilterClick(e) {
        const button = e.currentTarget;
        const filter = button.dataset.filter;
        
        // Mettre à jour le filtre actif
        this.activeFilter = filter;
        
        // Mettre à jour les boutons
        DOM.filterButtons.forEach(btn => {
            btn.classList.toggle('filter-btn--active', btn === button);
        });
        
        // Réinitialiser les items visibles
        this.visibleItems = 4;
        
        // Re-rendre le portfolio
        this.renderPortfolio();
    }
    
    loadMore() {
        // Augmenter le nombre d'items visibles
        this.visibleItems += 2;
        
        // Re-rendre le portfolio
        this.renderPortfolio();
        
        // Scroll vers les nouveaux items
        setTimeout(() => {
            const newItems = DOM.portfolioGrid?.querySelectorAll('.portfolio-item');
            if (newItems && newItems.length > 0) {
                const lastItem = newItems[newItems.length - 1];
                lastItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    }
    
    updateLoadMoreButton(totalItems) {
        if (!DOM.loadMoreBtn) return;
        
        if (this.visibleItems >= totalItems) {
            DOM.loadMoreBtn.style.display = 'none';
        } else {
            DOM.loadMoreBtn.style.display = 'inline-flex';
            DOM.loadMoreBtn.innerHTML = `
                <span>Charger plus de projets (${totalItems - this.visibleItems} restants)</span>
                <i class="ti ti-plus"></i>
            `;
        }
    }
}

/* 
============================================
9. PROCESSUS TIMELINE
============================================ 
*/

class ProcessTimeline {
    constructor() {
        this.steps = [];
        this.currentStep = 0;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
        this.animateSteps();
    }
    
    cacheDOM() {
        this.steps = document.querySelectorAll('.process-step');
    }
    
    setupEventListeners() {
        // Observer les steps pour les animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('process-step--active');
                }
            });
        }, { threshold: 0.3 });
        
        this.steps.forEach(step => observer.observe(step));
        
        // Animation au scroll
        window.addEventListener('scroll', () => this.onScroll());
    }
    
    animateSteps() {
        this.steps.forEach((step, index) => {
            // Animation des éléments internes
            const content = step.querySelector('.step-content');
            if (content) {
                content.style.animationDelay = `${index * 0.2}s`;
            }
        });
    }
    
    onScroll() {
        // Mettre à jour le step actif selon la position
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        this.steps.forEach((step, index) => {
            const stepTop = step.offsetTop;
            const stepHeight = step.offsetHeight;
            
            if (scrollPosition >= stepTop && scrollPosition < stepTop + stepHeight) {
                if (this.currentStep !== index) {
                    this.currentStep = index;
                    this.highlightCurrentStep();
                }
            }
        });
    }
    
    highlightCurrentStep() {
        this.steps.forEach((step, index) => {
            const indicator = step.querySelector('.step-number');
            if (indicator) {
                if (index <= this.currentStep) {
                    indicator.classList.add('step-number--active');
                } else {
                    indicator.classList.remove('step-number--active');
                }
            }
        });
    }
}

/* 
============================================
10. PRICING TOGGLE
============================================ 
*/

class PricingManager {
    constructor() {
        this.activePeriod = 'once';
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
        this.updatePrices();
    }
    
    cacheDOM() {
        this.toggleButtons = document.querySelectorAll('.toggle-btn');
        this.priceElements = document.querySelectorAll('.plan-price');
    }
    
    setupEventListeners() {
        this.toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => this.onToggleClick(e));
        });
    }
    
    onToggleClick(e) {
        const button = e.currentTarget;
        const period = button.dataset.period;
        
        // Mettre à jour la période active
        this.activePeriod = period;
        
        // Mettre à jour les boutons
        this.toggleButtons.forEach(btn => {
            btn.classList.toggle('toggle-btn--active', btn === button);
        });
        
        // Mettre à jour les prix
        this.updatePrices();
    }
    
    updatePrices() {
        const prices = {
            once: {
                starter: '1 990€',
                professional: '4 990€',
                enterprise: 'Sur devis'
            },
            monthly: {
                starter: '199€<span class="price-period">/mois</span>',
                professional: '499€<span class="price-period">/mois</span>',
                enterprise: 'Sur devis'
            }
        };
        
        // Mettre à jour chaque carte
        document.querySelectorAll('.pricing-card').forEach(card => {
            const planName = card.querySelector('.plan-name')?.textContent.toLowerCase();
            
            if (planName.includes('starter')) {
                this.updateCardPrice(card, prices[this.activePeriod].starter);
            } else if (planName.includes('professional')) {
                this.updateCardPrice(card, prices[this.activePeriod].professional);
            } else if (planName.includes('enterprise')) {
                this.updateCardPrice(card, prices[this.activePeriod].enterprise);
            }
        });
    }
    
    updateCardPrice(card, price) {
        const priceElement = card.querySelector('.price-amount');
        if (priceElement) {
            priceElement.innerHTML = price;
        }
    }
}

/* 
============================================
11. CONTACT FORM MULTI-ÉTAPES
============================================ 
*/

class ContactForm {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
        this.updateFormProgress();
    }
    
    cacheDOM() {
        DOM.contactForm = document.getElementById('contactForm');
        DOM.formSteps = document.querySelectorAll('.form-step');
        DOM.formProgressSteps = document.querySelectorAll('.progress-step');
        DOM.nextStepBtns = document.querySelectorAll('[id^="nextStep"]');
        DOM.prevStepBtns = document.querySelectorAll('[id^="prevStep"]');
    }
    
    setupEventListeners() {
        // Boutons next
        DOM.nextStepBtns.forEach(button => {
            button.addEventListener('click', (e) => this.goToNextStep(e));
        });
        
        // Boutons prev
        DOM.prevStepBtns.forEach(button => {
            button.addEventListener('click', (e) => this.goToPrevStep(e));
        });
        
        // Soumission du formulaire
        if (DOM.contactForm) {
            DOM.contactForm.addEventListener('submit', (e) => this.onSubmit(e));
        }
        
        // Validation en temps réel
        this.setupRealTimeValidation();
    }
    
    goToNextStep(e) {
        e.preventDefault();
        
        // Valider l'étape actuelle
        if (!this.validateCurrentStep()) {
            this.showStepError();
            return;
        }
        
        // Sauvegarder les données de l'étape
        this.saveStepData();
        
        // Passer à l'étape suivante
        this.currentStep++;
        this.showStep(this.currentStep);
        this.updateFormProgress();
        
        // Scroll vers le haut du formulaire
        DOM.contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    goToPrevStep(e) {
        e.preventDefault();
        
        // Revenir à l'étape précédente
        this.currentStep--;
        this.showStep(this.currentStep);
        this.updateFormProgress();
    }
    
    showStep(stepNumber) {
        // Cacher toutes les étapes
        DOM.formSteps.forEach(step => {
            step.classList.remove('form-step--active');
        });
        
        // Afficher l'étape courante
        const currentStep = document.getElementById(`step${stepNumber}`);
        if (currentStep) {
            currentStep.classList.add('form-step--active');
        }
    }
    
    updateFormProgress() {
        DOM.formProgressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            if (stepNumber < this.currentStep) {
                step.classList.add('progress-step--completed');
                step.classList.remove('progress-step--active');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('progress-step--active');
                step.classList.remove('progress-step--completed');
            } else {
                step.classList.remove('progress-step--active', 'progress-step--completed');
            }
        });
    }
    
    validateCurrentStep() {
        const currentStep = document.getElementById(`step${this.currentStep}`);
        const requiredFields = currentStep?.querySelectorAll('[required]');
        
        let isValid = true;
        
        if (requiredFields) {
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    this.highlightError(field);
                } else {
                    this.removeError(field);
                    
                    // Validation spécifique par type
                    if (field.type === 'email') {
                        if (!this.isValidEmail(field.value)) {
                            isValid = false;
                            this.highlightError(field, 'Email invalide');
                        }
                    }
                    
                    if (field.type === 'tel') {
                        if (!this.isValidPhone(field.value)) {
                            isValid = false;
                            this.highlightError(field, 'Numéro de téléphone invalide');
                        }
                    }
                }
            });
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    isValidPhone(phone) {
        // Validation simple pour les numéros internationaux
        const re = /^[\d\s\-\+\(\)]{10,}$/;
        return re.test(phone);
    }
    
    highlightError(field, message = 'Ce champ est requis') {
        field.classList.add('error');
        
        // Créer ou mettre à jour le message d'erreur
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    removeError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    showStepError() {
        // Animation de shake
        const currentStep = document.getElementById(`step${this.currentStep}`);
        currentStep.classList.add('animate-shake');
        
        setTimeout(() => {
            currentStep.classList.remove('animate-shake');
        }, 500);
    }
    
    saveStepData() {
        const currentStep = document.getElementById(`step${this.currentStep}`);
        const inputs = currentStep?.querySelectorAll('input, select, textarea');
        
        if (inputs) {
            inputs.forEach(input => {
                if (input.name && input.value) {
                    this.formData[input.name] = input.value;
                }
            });
        }
    }
    
    setupRealTimeValidation() {
        DOM.formSteps.forEach(step => {
            const inputs = step.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    if (input.value.trim()) {
                        this.removeError(input);
                    }
                });
                
                input.addEventListener('input', () => {
                    if (input.value.trim()) {
                        this.removeError(input);
                    }
                });
            });
        });
    }
    
    async onSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Valider la dernière étape
        if (!this.validateCurrentStep()) {
            this.showStepError();
            return;
        }
        
        // Sauvegarder les données finales
        this.saveStepData();
        
        // Désactiver le bouton de soumission
        this.isSubmitting = true;
        const submitBtn = DOM.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Envoi en cours...</span><i class="ti ti-loader"></i>';
        submitBtn.disabled = true;
        
        try {
            // Envoyer le formulaire
            await this.sendFormData();
            
            // Afficher le message de succès
            this.showSuccessMessage();
            
            // Réinitialiser le formulaire
            this.resetForm();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage();
            
        } finally {
            // Réactiver le bouton
            this.isSubmitting = false;
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async sendFormData() {
        // Utiliser FormData pour l'envoi
        const formData = new FormData(DOM.contactForm);
        
        // Ajouter les données sauvegardées
        Object.entries(this.formData).forEach(([key, value]) => {
            if (!formData.has(key)) {
                formData.append(key, value);
            }
        });
        
        // Ajouter des métadonnées
        formData.append('timestamp', new Date().toISOString());
        formData.append('pageUrl', window.location.href);
        formData.append('userAgent', navigator.userAgent);
        
        // Envoyer les données
        const response = await fetch(DOM.contactForm.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Important pour FormSubmit
        });
        
        return response;
    }
    
    showSuccessMessage() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
            
            // Focus sur le bouton de fermeture
            const closeBtn = modal.querySelector('#closeModal');
            if (closeBtn) {
                closeBtn.focus();
                
                // Fermer la modal
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
                
                // Fermer avec Escape
                const closeOnEscape = (e) => {
                    if (e.key === 'Escape') {
                        modal.classList.remove('active');
                        document.removeEventListener('keydown', closeOnEscape);
                    }
                };
                document.addEventListener('keydown', closeOnEscape);
                
                // Fermer en cliquant à l'extérieur
                modal.addEventListener('click', (e) => {
                    if (e.target === modal || e.target.classList.contains('modal__overlay')) {
                        modal.classList.remove('active');
                    }
                });
            }
        }
    }
    
    showErrorMessage() {
        alert('Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer ou nous contacter directement par téléphone.');
    }
    
    resetForm() {
        // Réinitialiser le formulaire
        DOM.contactForm.reset();
        this.formData = {};
        this.currentStep = 1;
        this.showStep(1);
        this.updateFormProgress();
    }
}

/* 
============================================
12. FORM VALIDATION & SUBMISSION
============================================ 
*/

class FormValidator {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupFormValidation();
    }
    
    setupFormValidation() {
        // Validation pour tous les formulaires
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Ne pas valider le formulaire de contact multi-étapes (déjà géré)
            if (form.id === 'contactForm') return;
            
            form.addEventListener('submit', (e) => this.validateForm(e));
        });
    }
    
    validateForm(e) {
        const form = e.target;
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                this.highlightError(input, 'Ce champ est requis');
            } else if (input.type === 'email' && input.value) {
                if (!this.isValidEmail(input.value)) {
                    isValid = false;
                    this.highlightError(input, 'Email invalide');
                }
            } else if (input.type === 'tel' && input.value) {
                if (!this.isValidPhone(input.value)) {
                    isValid = false;
                    this.highlightError(input, 'Numéro de téléphone invalide');
                }
            } else if (input.type === 'url' && input.value) {
                if (!this.isValidUrl(input.value)) {
                    isValid = false;
                    this.highlightError(input, 'URL invalide');
                }
            } else {
                this.removeError(input);
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            this.showFormError(form);
        }
    }
    
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    isValidPhone(phone) {
        const re = /^[\d\s\-\+\(\)]{10,}$/;
        return re.test(phone);
    }
    
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    highlightError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    removeError(input) {
        input.classList.remove('error');
        
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    showFormError(form) {
        form.classList.add('form-error');
        
        setTimeout(() => {
            form.classList.remove('form-error');
        }, 1000);
        
        // Scroll vers la première erreur
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
}

/* 
============================================
13. ANIMATIONS AU SCROLL
============================================ 
*/

class ScrollAnimations {
    constructor() {
        this.animatedElements = new Set();
        this.observer = null;
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
    }
    
    setupScrollAnimations() {
        // Éléments à animer
        const elementsToAnimate = document.querySelectorAll(
            '.expertise-card, .portfolio-item, .stat-card, .value-card, .team-member, .addon-card, .guarantee'
        );
        
        elementsToAnimate.forEach(element => {
            this.observer.observe(element);
            this.animatedElements.add(element);
        });
        
        // Animation des titres de section
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            this.observer.observe(header);
        });
    }
    
    animateElement(element) {
        // Animation par défaut
        element.classList.add('animate-fade-in-up');
        
        // Animation spécifique selon la classe
        if (element.classList.contains('expertise-card')) {
            element.classList.add('animate-scale-in');
        }
        
        if (element.classList.contains('portfolio-item')) {
            // Animation déjà gérée par PortfolioManager
        }
        
        if (element.classList.contains('section-header')) {
            element.classList.add('animate-slide-in-left');
        }
    }
    
    destroy() {
        if (this.observer) {
            this.animatedElements.forEach(element => {
                this.observer.unobserve(element);
            });
            this.observer.disconnect();
        }
    }
}

/* 
============================================
14. COUNTERS ANIMÉS
============================================ 
*/

class AnimatedCounters {
    constructor() {
        this.counters = [];
        this.observer = null;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupIntersectionObserver();
    }
    
    cacheDOM() {
        DOM.counters = document.querySelectorAll('.counter');
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        DOM.counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }
    
    startCounter(counter) {
        const target = parseInt(counter.dataset.count);
        const suffix = counter.dataset.suffix || '';
        const duration = 2000; // 2 secondes
        const start = 0;
        
        // Calculer l'incrément
        const increment = target / (duration / 16); // ~60fps
        
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            
            if (current >= target) {
                counter.textContent = target + suffix;
            } else {
                counter.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            }
        };
        
        // Démarrer l'animation
        requestAnimationFrame(updateCounter);
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/* 
============================================
15. SMOOTH SCROLL
============================================ 
*/

class SmoothScroll {
    constructor() {
        this.scrollPosition = 0;
        this.isScrolling = false;
        this.scrollTo = 0;
        
        this.init();
    }
    
    init() {
        if (!CONFIG.smoothScroll) return;
        
        this.setupSmoothScroll();
        this.setupAnchorLinks();
    }
    
    setupSmoothScroll() {
        // Override le scroll par défaut
        window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        
        // Animation loop
        this.animateScroll();
    }
    
    setupAnchorLinks() {
        // Gérer les liens d'ancrage
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.onAnchorClick(e));
        });
    }
    
    onWheel(e) {
        if (this.isScrolling) {
            e.preventDefault();
            return;
        }
        
        // Détecter la direction
        const delta = e.deltaY || e.detail || e.wheelDelta;
        const direction = delta > 0 ? 1 : -1;
        
        // Calculer la nouvelle position
        const scrollAmount = window.innerHeight * 0.8;
        this.scrollTo = window.pageYOffset + (scrollAmount * direction);
        
        // Limiter aux limites de la page
        this.scrollTo = Math.max(0, Math.min(this.scrollTo, document.documentElement.scrollHeight - window.innerHeight));
        
        // Démarrer l'animation
        this.isScrolling = true;
        e.preventDefault();
    }
    
    onTouchMove(e) {
        // Gérer le scroll tactile
        if (this.isScrolling) {
            e.preventDefault();
        }
    }
    
    onAnchorClick(e) {
        const anchor = e.currentTarget;
        const href = anchor.getAttribute('href');
        
        if (href === '#') return;
        
        if (href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.scrollToElement(targetElement);
            }
        }
    }
    
    scrollToElement(element, offset = 80) {
        const targetPosition = element.offsetTop - offset;
        this.scrollTo = targetPosition;
        this.isScrolling = true;
    }
    
    animateScroll() {
        if (this.isScrolling) {
            const current = window.pageYOffset;
            const diff = this.scrollTo - current;
            
            // Interpolation
            this.scrollPosition += diff * 0.1;
            
            // Arrêter si suffisamment proche
            if (Math.abs(diff) < 0.5) {
                window.scrollTo(0, this.scrollTo);
                this.isScrolling = false;
                this.scrollPosition = this.scrollTo;
            } else {
                window.scrollTo(0, this.scrollPosition);
            }
        }
        
        requestAnimationFrame(() => this.animateScroll());
    }
}

/* 
============================================
16. BACK TO TOP
============================================ 
*/

class BackToTop {
    constructor() {
        this.threshold = 300;
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
        this.checkVisibility();
    }
    
    cacheDOM() {
        DOM.backToTop = document.getElementById('backToTop');
    }
    
    setupEventListeners() {
        // Click sur le bouton
        if (DOM.backToTop) {
            DOM.backToTop.addEventListener('click', () => this.scrollToTop());
        }
        
        // Scroll pour montrer/cacher
        window.addEventListener('scroll', () => this.checkVisibility());
        
        // Resize
        window.addEventListener('resize', () => this.checkVisibility());
    }
    
    checkVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > this.threshold) {
            if (!this.isVisible) {
                this.show();
            }
        } else {
            if (this.isVisible) {
                this.hide();
            }
        }
    }
    
    show() {
        this.isVisible = true;
        
        if (DOM.backToTop) {
            DOM.backToTop.classList.add('visible');
            DOM.backToTop.style.opacity = '1';
            DOM.backToTop.style.transform = 'translateY(0)';
        }
    }
    
    hide() {
        this.isVisible = false;
        
        if (DOM.backToTop) {
            DOM.backToTop.classList.remove('visible');
            DOM.backToTop.style.opacity = '0';
            DOM.backToTop.style.transform = 'translateY(20px)';
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

/* 
============================================
17. MODALS & POPUPS
============================================ 
*/

class ModalManager {
    constructor() {
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.setupEventListeners();
    }
    
    cacheDOM() {
        DOM.successModal = document.getElementById('successModal');
        DOM.cookieModal = document.getElementById('cookieModal');
    }
    
    setupEventListeners() {
        // Fermer la modal avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeActiveModal();
            }
        });
        
        // Fermer en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (this.activeModal && e.target.classList.contains('modal__overlay')) {
                this.closeActiveModal();
            }
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Fermer la modal active si elle existe
        if (this.activeModal) {
            this.closeActiveModal();
        }
        
        // Ouvrir la nouvelle modal
        modal.classList.add('active');
        this.activeModal = modal;
        
        // Focus trap
        this.setupFocusTrap(modal);
        
        // Bloquer le scroll du body
        document.body.style.overflow = 'hidden';
    }
    
    closeActiveModal() {
        if (!this.activeModal) return;
        
        this.activeModal.classList.remove('active');
        
        // Retirer le focus trap
        this.removeFocusTrap();
        
        // Rétablir le scroll du body
        document.body.style.overflow = '';
        
        this.activeModal = null;
    }
    
    setupFocusTrap(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            firstElement.focus();
            
            modal.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;
                
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
            });
        }
    }
    
    removeFocusTrap() {
        // Le focus trap est géré par l'event listener sur la modal
        // qui sera supprimé quand la modal est fermée
    }
}

/* 
============================================
18. COOKIE CONSENT
============================================ 
*/

class CookieConsent {
    constructor() {
        this.cookieName = 'maroneweb_cookie_consent';
        this.cookieExpiryDays = 365;
        this.consentGiven = false;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.checkConsent();
        this.setupEventListeners();
    }
    
    cacheDOM() {
        DOM.cookieModal = document.getElementById('cookieModal');
        this.acceptBtn = document.getElementById('acceptCookies');
        this.rejectBtn = document.getElementById('rejectCookies');
        this.customizeBtn = document.getElementById('customizeCookies');
    }
    
    checkConsent() {
        const consent = this.getCookie(this.cookieName);
        
        if (consent) {
            this.consentGiven = true;
            this.applyConsent(JSON.parse(consent));
            
            // Cacher la modal si le consentement est déjà donné
            if (DOM.cookieModal) {
                DOM.cookieModal.style.display = 'none';
            }
        } else {
            // Montrer la modal après un délai
            setTimeout(() => {
                this.showModal();
            }, 1000);
        }
    }
    
    showModal() {
        if (DOM.cookieModal && !this.consentGiven) {
            DOM.cookieModal.style.display = 'block';
        }
    }
    
    hideModal() {
        if (DOM.cookieModal) {
            DOM.cookieModal.style.display = 'none';
        }
    }
    
    setupEventListeners() {
        if (this.acceptBtn) {
            this.acceptBtn.addEventListener('click', () => this.acceptAll());
        }
        
        if (this.rejectBtn) {
            this.rejectBtn.addEventListener('click', () => this.rejectAll());
        }
        
        if (this.customizeBtn) {
            this.customizeBtn.addEventListener('click', () => this.showCustomize());
        }
    }
    
    acceptAll() {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideModal();
    }
    
    rejectAll() {
        const consent = {
            necessary: true, // Toujours nécessaire
            analytics: false,
            marketing: false,
            preferences: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideModal();
    }
    
    showCustomize() {
        // Implémenter l'interface de personnalisation
        alert('Fonctionnalité de personnalisation à implémenter');
    }
    
    saveConsent(consent) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.cookieExpiryDays);
        
        const cookieValue = JSON.stringify(consent);
        document.cookie = `${this.cookieName}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
        
        this.consentGiven = true;
    }
    
    applyConsent(consent) {
        // Désactiver les scripts non nécessaires
        if (!consent.analytics) {
            this.disableAnalytics();
        }
        
        if (!consent.marketing) {
            this.disableMarketing();
        }
        
        // Appliquer les préférences
        if (consent.preferences) {
            this.applyPreferences();
        }
    }
    
    disableAnalytics() {
        // Désactiver Google Analytics
        window['ga-disable-G-XXXXXXXXXX'] = true;
        
        // Désactiver d'autres scripts d'analytics
        const analyticsScripts = document.querySelectorAll('script[src*="analytics"], script[src*="gtag"], script[src*="ga"]');
        analyticsScripts.forEach(script => {
            script.parentNode.removeChild(script);
        });
    }
    
    disableMarketing() {
        // Désactiver les scripts marketing
        const marketingScripts = document.querySelectorAll('script[src*="facebook"], script[src*="pixel"], script[src*="ads"]');
        marketingScripts.forEach(script => {
            script.parentNode.removeChild(script);
        });
    }
    
    applyPreferences() {
        // Appliquer les préférences utilisateur
        // Ex: thème, langue, etc.
    }
    
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        
        return null;
    }
}

/* 
============================================
19. PERFORMANCE MONITORING
============================================ 
*/

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
        
        this.init();
    }
    
    init() {
        if (!CONFIG.performance) return;
        
        this.setupPerformanceMonitoring();
        this.setupResourceTiming();
        this.setupLongTasksMonitoring();
    }
    
    setupPerformanceMonitoring() {
        // Navigation Timing
        if (performance.getEntriesByType('navigation').length > 0) {
            const navigationTiming = performance.getEntriesByType('navigation')[0];
            this.metrics.navigation = {
                dns: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
                tcp: navigationTiming.connectEnd - navigationTiming.connectStart,
                ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
                domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.navigationStart,
                load: navigationTiming.loadEventEnd - navigationTiming.navigationStart
            };
        }
        
        // Paint Timing
        if (performance.getEntriesByType('paint').length > 0) {
            performance.getEntriesByType('paint').forEach(paint => {
                this.metrics[paint.name] = paint.startTime;
            });
        }
        
        // User Timing
        performance.mark('app_loaded');
        performance.measure('app_load_time', 'navigationStart', 'app_loaded');
        
        const measure = performance.getEntriesByName('app_load_time')[0];
        if (measure) {
            this.metrics.appLoad = measure.duration;
        }
    }
    
    setupResourceTiming() {
        // Surveiller les ressources lentes
        const resources = performance.getEntriesByType('resource');
        
        this.metrics.slowResources = resources
            .filter(resource => resource.duration > 1000) // Plus de 1 seconde
            .map(resource => ({
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize || 0
            }));
        
        // Loguer les ressources lentes
        if (this.metrics.slowResources.length > 0 && CONFIG.debug) {
            console.warn('Slow resources detected:', this.metrics.slowResources);
        }
    }
    
    setupLongTasksMonitoring() {
        // Surveillance des long tasks (si l'API est disponible)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 50) { // 50ms threshold
                        console.warn('Long task detected:', entry);
                        
                        // Envoyer à analytics si nécessaire
                        if (CONFIG.analytics) {
                            this.sendMetric('long_task', {
                                duration: entry.duration,
                                startTime: entry.startTime
                            });
                        }
                    }
                });
            });
            
            try {
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                console.warn('Long tasks monitoring not supported');
            }
        }
    }
    
    sendMetric(name, data) {
        // Envoyer les métriques à votre service d'analytics
        if (CONFIG.analytics && window.dataLayer) {
            window.dataLayer.push({
                event: 'performance_metric',
                metric_name: name,
                metric_value: data.duration || data,
                ...data
            });
        }
    }
    
    getMetrics() {
        return this.metrics;
    }
    
    logMetrics() {
        if (CONFIG.debug) {
            console.log('Performance Metrics:', this.metrics);
        }
    }
}

/* 
============================================
20. ERROR HANDLING
============================================ 
*/

class ErrorHandler {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupGlobalErrorHandling();
        this.setupPromiseRejectionHandling();
        this.setupResourceErrorHandling();
    }
    
    setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => this.onError(e));
    }
    
    setupPromiseRejectionHandling() {
        window.addEventListener('unhandledrejection', (e) => this.onPromiseRejection(e));
    }
    
    setupResourceErrorHandling() {
        // Surveiller les erreurs de chargement des ressources
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
                this.onResourceError(e);
            }
        }, true);
    }
    
    onError(e) {
        const error = {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.logError(error);
        this.sendToAnalytics(error);
        
        // Ne pas empêcher l'exécution normale
        return true;
    }
    
    onPromiseRejection(e) {
        const error = {
            message: e.reason?.message || 'Promise rejection',
            stack: e.reason?.stack,
            timestamp: new Date().toISOString()
        };
        
        this.logError(error);
        this.sendToAnalytics(error);
    }
    
    onResourceError(e) {
        const resource = {
            tag: e.target.tagName,
            src: e.target.src || e.target.href,
            timestamp: new Date().toISOString()
        };
        
        if (CONFIG.debug) {
            console.warn('Resource failed to load:', resource);
        }
        
        // Gestion des images cassées
        if (e.target.tagName === 'IMG' && e.target.dataset.fallback) {
            e.target.src = e.target.dataset.fallback;
        }
    }
    
    logError(error) {
        if (CONFIG.debug) {
            console.error('Application Error:', error);
        }
        
        // Stocker les erreurs dans un tableau limité
        if (!window.errorLog) {
            window.errorLog = [];
        }
        
        window.errorLog.push(error);
        
        // Garder seulement les 50 dernières erreurs
        if (window.errorLog.length > 50) {
            window.errorLog.shift();
        }
    }
    
    sendToAnalytics(error) {
        if (CONFIG.analytics && window.dataLayer) {
            window.dataLayer.push({
                event: 'error',
                error_message: error.message,
                error_source: error.filename,
                error_line: error.lineno,
                error_column: error.colno
            });
        }
    }
}

/* 
============================================
21. UTILITY FUNCTIONS
============================================ 
*/

class Utilities {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupUtils();
    }
    
    setupUtils() {
        // Détection de la connexion
        this.setupConnectionDetection();
        
        // Gestion de la visibilité de la page
        this.setupVisibilityChange();
        
        // Préchargement des assets
        if (CONFIG.lazyLoad) {
            this.setupLazyLoading();
        }
    }
    
    setupConnectionDetection() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            connection.addEventListener('change', () => {
                const event = new CustomEvent('connection:change', {
                    detail: {
                        effectiveType: connection.effectiveType,
                        downlink: connection.downlink,
                        rtt: connection.rtt,
                        saveData: connection.saveData
                    }
                });
                document.dispatchEvent(event);
                
                // Adapter le site en fonction de la connexion
                this.adaptToConnection(connection);
            });
        }
    }
    
    adaptToConnection(connection) {
        if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            // Désactiver les animations lourdes
            CONFIG.animations = false;
            CONFIG.particles = false;
            
            // Basculer en mode faible bande passante
            document.body.classList.add('low-bandwidth');
        } else {
            document.body.classList.remove('low-bandwidth');
        }
    }
    
    setupVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page cachée
                const event = new CustomEvent('page:hidden');
                document.dispatchEvent(event);
                
                // Pause des animations
                this.pauseAnimations();
            } else {
                // Page visible à nouveau
                const event = new CustomEvent('page:visible');
                document.dispatchEvent(event);
                
                // Reprise des animations
                this.resumeAnimations();
            }
        });
    }
    
    pauseAnimations() {
        // Pause des animations CSS
        document.querySelectorAll('*').forEach(element => {
            const animation = getComputedStyle(element).animationName;
            if (animation && animation !== 'none') {
                element.style.animationPlayState = 'paused';
            }
        });
    }
    
    resumeAnimations() {
        // Reprise des animations CSS
        document.querySelectorAll('*').forEach(element => {
            const animation = getComputedStyle(element).animationName;
            if (animation && animation !== 'none') {
                element.style.animationPlayState = 'running';
            }
        });
    }
    
    setupLazyLoading() {
        // Lazy load des images
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    img.removeAttribute('data-src');
                    img.removeAttribute('data-srcset');
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
        
        // Lazy load des iframes
        const iframes = document.querySelectorAll('iframe[data-src]');
        
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                    iframeObserver.unobserve(iframe);
                }
            });
        });
        
        iframes.forEach(iframe => iframeObserver.observe(iframe));
    }
    
    // Fonction de debounce
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
    
    // Fonction de throttle
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Formatage de nombres
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
    
    // Génération d'ID unique
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Copie dans le presse-papier
    copyToClipboard(text) {
        return navigator.clipboard.writeText(text).then(() => {
            return true;
        }).catch(err => {
            console.error('Failed to copy: ', err);
            return false;
        });
    }
}

/* 
============================================
22. INITIALIZATION
============================================ 
*/

class App {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Initialiser les utilitaires d'abord
        this.utilities = new Utilities();
        this.errorHandler = new ErrorHandler();
        
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
        
        // Initialiser le chargement
        this.loadingManager = new LoadingManager();
    }
    
    onDOMReady() {
        // Initialiser les composants
        this.initComponents();
        
        // Initialiser les écouteurs d'événements globaux
        this.setupGlobalEventListeners();
        
        this.isInitialized = true;
        
        // Déclencher l'événement d'initialisation
        const event = new CustomEvent('app:ready', {
            detail: {
                timestamp: Date.now(),
                config: CONFIG,
                state: STATE
            }
        });
        document.dispatchEvent(event);
        
        if (CONFIG.debug) {
            console.log('MARONEWEB App initialized successfully');
        }
    }
    
    initComponents() {
        // Initialiser les composants dans l'ordre
        this.components = {
            navigation: new Navigation(),
            mobileMenu: new MobileMenu(),
            cursor: new CustomCursor(),
            hero: new HeroAnimations(),
            clients: new ClientsSection(),
            portfolio: new PortfolioManager(),
            process: new ProcessTimeline(),
            pricing: new PricingManager(),
            contactForm: new ContactForm(),
            formValidator: new FormValidator(),
            scrollAnimations: new ScrollAnimations(),
            counters: new AnimatedCounters(),
            smoothScroll: new SmoothScroll(),
            backToTop: new BackToTop(),
            modalManager: new ModalManager(),
            cookieConsent: new CookieConsent(),
            performance: new PerformanceMonitor()
        };
    }
    
    setupGlobalEventListeners() {
        // Événement personnalisé pour le chargement terminé
        document.addEventListener('maroneweb:loaded', () => {
            this.onAppLoaded();
        });
        
        // Redimensionnement de la fenêtre
        window.addEventListener('resize', this.debounce(() => {
            this.onResize();
        }, 250));
        
        // Gestion des erreurs réseau
        window.addEventListener('offline', () => {
            this.showOfflineMessage();
        });
        
        window.addEventListener('online', () => {
            this.hideOfflineMessage();
        });
    }
    
    onAppLoaded() {
        // Actions à effectuer après le chargement complet
        if (CONFIG.performance) {
            this.components.performance.logMetrics();
        }
        
        // Afficher les outils de développement en mode debug
        if (CONFIG.debug) {
            this.showDebugTools();
        }
    }
    
    onResize() {
        // Mettre à jour les composants sensibles au resize
        if (this.components.hero) {
            this.components.hero.resizeCanvas();
        }
    }
    
    showOfflineMessage() {
        const message = document.createElement('div');
        message.id = 'offlineMessage';
        message.innerHTML = `
            <div class="offline-message">
                <i class="ti ti-wifi-off"></i>
                <span>Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.</span>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('visible');
        }, 100);
    }
    
    hideOfflineMessage() {
        const message = document.getElementById('offlineMessage');
        if (message) {
            message.classList.remove('visible');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }
    }
    
    showDebugTools() {
        // Ajouter un bouton de debug
        const debugBtn = document.createElement('button');
        debugBtn.id = 'debugToggle';
        debugBtn.innerHTML = '<i class="ti ti-bug"></i>';
        debugBtn.title = 'Debug Tools';
        debugBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: var(--glow-primary);
        `;
        
        debugBtn.addEventListener('click', () => this.toggleDebugPanel());
        document.body.appendChild(debugBtn);
    }
    
    toggleDebugPanel() {
        let panel = document.getElementById('debugPanel');
        
        if (!panel) {
            panel = this.createDebugPanel();
            document.body.appendChild(panel);
            panel.classList.add('visible');
        } else {
            panel.classList.toggle('visible');
        }
    }
    
    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debugPanel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: var(--color-black);
            border: 1px solid var(--color-primary);
            border-radius: var(--border-radius-lg);
            padding: var(--space-6);
            max-width: 90vw;
            max-height: 90vh;
            overflow: auto;
            z-index: 10001;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: var(--glow-primary-lg);
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
                <h3 style="margin: 0;">Debug Tools</h3>
                <button id="closeDebug" style="background: none; border: none; color: var(--color-gray-400); cursor: pointer; font-size: 20px;">
                    <i class="ti ti-x"></i>
                </button>
            </div>
            
            <div style="display: grid; gap: var(--space-4);">
                <div>
                    <h4 style="margin-bottom: var(--space-2);">App State</h4>
                    <pre style="background: var(--color-gray-900); padding: var(--space-4); border-radius: var(--border-radius); overflow: auto; max-height: 200px;">
${JSON.stringify(STATE, null, 2)}
                    </pre>
                </div>
                
                <div>
                    <h4 style="margin-bottom: var(--space-2);">Performance Metrics</h4>
                    <pre style="background: var(--color-gray-900); padding: var(--space-4); border-radius: var(--border-radius); overflow: auto; max-height: 200px;">
${JSON.stringify(this.components.performance?.getMetrics() || {}, null, 2)}
                    </pre>
                </div>
                
                <div style="display: flex; gap: var(--space-2);">
                    <button id="reloadApp" class="btn btn--primary" style="padding: var(--space-2) var(--space-4);">
                        Reload App
                    </button>
                    <button id="clearStorage" class="btn btn--secondary" style="padding: var(--space-2) var(--space-4);">
                        Clear Storage
                    </button>
                </div>
            </div>
        `;
        
        // Événements du panel
        panel.querySelector('#closeDebug').addEventListener('click', () => {
            panel.classList.remove('visible');
        });
        
        panel.querySelector('#reloadApp').addEventListener('click', () => {
            location.reload();
        });
        
        panel.querySelector('#clearStorage').addEventListener('click', () => {
            localStorage.clear();
            sessionStorage.clear();
            alert('Storage cleared!');
        });
        
        // Fermer en cliquant à l'extérieur
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                panel.classList.remove('visible');
            }
        });
        
        // Animation d'entrée
        setTimeout(() => {
            panel.style.opacity = '1';
            panel.style.visibility = 'visible';
            panel.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        return panel;
    }
    
    // Helper: debounce
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
    
    // Getter pour les composants
    getComponent(name) {
        return this.components[name];
    }
    
    // API publique
    static getInstance() {
        if (!window._maronewebApp) {
            window._maronewebApp = new App();
        }
        return window._maronewebApp;
    }
}

/* 
============================================
INITIALISATION GLOBALE
============================================ 
*/

// Initialiser l'application quand tout est prêt
window.addEventListener('load', () => {
    // Vérifier si le navigateur supporte les fonctionnalités nécessaires
    if (!('Promise' in window) || !('fetch' in window)) {
        // Navigateur trop ancien
        document.body.innerHTML = `
            <div style="padding: 40px; text-align: center; max-width: 600px; margin: 0 auto;">
                <h1>Navigateur non supporté</h1>
                <p>Votre navigateur est trop ancien pour afficher ce site correctement.</p>
                <p>Veuillez mettre à jour votre navigateur ou utiliser une version récente de Chrome, Firefox, Safari ou Edge.</p>
            </div>
        `;
        return;
    }
    
    // Initialiser l'application
    const app = App.getInstance();
    
    // Exposer l'API globale
    window.MARONEWEB = {
        app: app,
        config: CONFIG,
        state: STATE,
        data: DATA,
        utils: app.utilities
    };
    
    // Mode développement
    if (CONFIG.debug) {
        console.log('MARONEWEB v' + CONFIG.version + ' initialized');
        console.log('Debug mode: ON');
    }
});

// Support pour les anciens navigateurs (polyfills)
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        return setTimeout(callback, 1000 / 60);
    };
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}

// Polyfill pour forEach sur NodeList pour IE
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Polyfill pour classList sur SVGElement pour IE
if (!('classList' in SVGElement.prototype)) {
    Object.defineProperty(SVGElement.prototype, 'classList', {
        get: function() {
            return {
                contains: function(className) {
                    return this.className.baseVal.split(' ').indexOf(className) !== -1;
                },
                add: function(className) {
                    var classes = this.className.baseVal.split(' ');
                    if (classes.indexOf(className) === -1) {
                        classes.push(className);
                        this.className.baseVal = classes.join(' ');
                    }
                },
                remove: function(className) {
                    var classes = this.className.baseVal.split(' ');
                    var index = classes.indexOf(className);
                    if (index !== -1) {
                        classes.splice(index, 1);
                        this.className.baseVal = classes.join(' ');
                    }
                },
                toggle: function(className) {
                    if (this.contains(className)) {
                        this.remove(className);
                    } else {
                        this.add(className);
                    }
                }
            };
        }
    });
}

/* 
============================================
END OF SCRIPT
============================================ 
*/