/* 
============================================
MARONEWEB - SCRIPT.JS V4.0
Version stable avec chargement garanti
Design cyberpunk optimisé
============================================ 
*/

/* 
============================================
CONFIGURATION GLOBALE
============================================ 
*/

// Configuration
const CONFIG = {
    debug: false,               // Mode debug
    animations: true,          // Activer les animations
    cursor: true,              // Curseur personnalisé
    particles: true,           // Effets particules
    lazyLoad: true,            // Chargement différé
    analytics: false,          // Analytics (désactivé pour l'instant)
    minLoadTime: 1500,         // Temps minimum de chargement (ms)
    maxLoadTime: 5000          // Temps maximum avant timeout
};

// État global
const STATE = {
    isLoading: true,
    isMenuOpen: false,
    isMobile: window.innerWidth < 768,
    assetsLoaded: 0,
    totalAssets: 0,
    loadStartTime: null,
    currentSection: 'hero'
};

// Cache DOM
const DOM = {
    // Loader
    loader: null,
    progressBar: null,
    progressText: null,
    statusText: null,
    
    // Navigation
    header: null,
    menuToggle: null,
    mobileMenu: null,
    navLinks: null,
    
    // Hero
    heroTitle: null,
    heroStats: null,
    
    // Portfolio
    portfolioGrid: null,
    filterButtons: null,
    
    // Contact
    contactForm: null,
    
    // Footer
    backToTop: null
};

/* 
============================================
INITIALISATION PRINCIPALE
============================================ 
*/

class App {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🚀 MARONEWEB - Initialisation...');
        
        // Démarrage du chargement
        STATE.loadStartTime = Date.now();
        
        // Initialiser les composants
        this.initLoader();
        this.cacheDOM();
        this.initComponents();
        
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }
    
    cacheDOM() {
        // Éléments critiques uniquement
        DOM.loader = document.getElementById('globalLoader');
        DOM.progressBar = document.getElementById('progressBar');
        DOM.progressText = document.getElementById('progressPercentage');
        DOM.statusText = document.getElementById('progressStage');
        
        // Header
        DOM.header = document.getElementById('mainHeader');
        DOM.menuToggle = document.getElementById('menuToggle');
        DOM.mobileMenu = document.getElementById('mobileMenu');
        
        // Navigation
        DOM.navLinks = document.querySelectorAll('a[href^="#"]');
        
        console.log('✅ DOM cached');
    }
    
    initLoader() {
        console.log('🔄 Initialisation du loader...');
        
        // S'assurer que le loader est visible
        if (DOM.loader) {
            DOM.loader.style.display = 'flex';
            DOM.loader.style.opacity = '1';
            DOM.loader.style.visibility = 'visible';
        }
        
        // Démarrer la simulation de chargement
        this.simulateLoading();
    }
    
    simulateLoading() {
        let progress = 0;
        const totalSteps = 100;
        const stepDuration = CONFIG.minLoadTime / totalSteps;
        
        const updateProgress = () => {
            progress += 1;
            
            // Mettre à jour la barre de progression
            if (DOM.progressBar) {
                DOM.progressBar.style.width = `${progress}%`;
            }
            
            if (DOM.progressText) {
                DOM.progressText.textContent = `${progress}%`;
            }
            
            // Mettre à jour le texte de statut
            this.updateStatusText(progress);
            
            // Continuer ou terminer
            if (progress < 100) {
                setTimeout(updateProgress, stepDuration);
            } else {
                // Forcer la complétion après un délai minimum
                setTimeout(() => this.completeLoading(), 300);
            }
        };
        
        // Démarrer
        updateProgress();
        
        // Timeout de sécurité
        setTimeout(() => {
            if (STATE.isLoading) {
                console.warn('⚠️ Timeout du loader - Forcing completion');
                this.completeLoading();
            }
        }, CONFIG.maxLoadTime);
    }
    
    updateStatusText(progress) {
        if (!DOM.statusText) return;
        
        const stages = [
            { min: 0, max: 20, text: "Initialisation système..." },
            { min: 20, max: 40, text: "Chargement des composants..." },
            { min: 40, max: 60, text: "Configuration des effets..." },
            { min: 60, max: 80, text: "Préparation de l'interface..." },
            { min: 80, max: 100, text: "Finalisation..." }
        ];
        
        const stage = stages.find(s => progress >= s.min && progress <= s.max);
        if (stage) {
            DOM.statusText.textContent = stage.text;
        }
    }
    
    completeLoading() {
        console.log('✅ Chargement terminé');
        
        STATE.isLoading = false;
        
        // Animation de disparition du loader
        if (DOM.loader) {
            DOM.loader.style.opacity = '0';
            DOM.loader.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                DOM.loader.style.display = 'none';
                this.afterLoad();
            }, 500);
        } else {
            this.afterLoad();
        }
    }
    
    onDOMReady() {
        console.log('📄 DOM prêt');
        
        // Initialiser les autres composants
        this.initNavigation();
        this.initHero();
        this.initPortfolio();
        this.initContact();
        this.initScrollEffects();
        this.initBackToTop();
    }
    
    afterLoad() {
        console.log('🎉 Application prête !');
        
        // Déclencher les animations d'entrée
        this.animateElements();
        
        // Initialiser le curseur
        if (CONFIG.cursor) {
            this.initCursor();
        }
        
        // Initialiser les particules
        if (CONFIG.particles) {
            this.initParticles();
        }
        
        // Événement custom
        document.dispatchEvent(new CustomEvent('app:ready'));
    }
    
    initComponents() {
        // Les composants sont initialisés dans onDOMReady
        console.log('⚙️ Composants prêts à être initialisés');
    }
}

/* 
============================================
COMPOSANT NAVIGATION
============================================ 
*/

class Navigation {
    constructor() {
        this.isScrolled = false;
        this.lastScrollTop = 0;
        this.threshold = 100;
        
        this.init();
    }
    
    init() {
        console.log('📍 Initialisation navigation');
        
        this.cacheDOM();
        this.setupEventListeners();
        this.setupMobileMenu();
        this.updateActiveSection();
    }
    
    cacheDOM() {
        this.scrollIndicator = document.querySelector('.scroll-indicator__bar');
        this.header = DOM.header;
    }
    
    setupEventListeners() {
        // Scroll
        window.addEventListener('scroll', () => this.onScroll());
        
        // Navigation smooth
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.onNavClick(e));
        });
    }
    
    setupMobileMenu() {
        if (!DOM.menuToggle || !DOM.mobileMenu) return;
        
        DOM.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // Fermer au clic sur les liens
        const mobileLinks = DOM.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && STATE.isMenuOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        STATE.isMenuOpen = !STATE.isMenuOpen;
        
        if (STATE.isMenuOpen) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }
    
    openMenu() {
        DOM.mobileMenu.classList.add('active');
        DOM.menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        DOM.mobileMenu.classList.remove('active');
        DOM.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        STATE.isMenuOpen = false;
    }
    
    onScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header scroll
        if (scrollTop > this.threshold) {
            if (!this.isScrolled) {
                this.isScrolled = true;
                this.header?.classList.add('scrolled');
            }
        } else {
            if (this.isScrolled) {
                this.isScrolled = false;
                this.header?.classList.remove('scrolled');
            }
        }
        
        // Scroll indicator
        if (this.scrollIndicator) {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
            this.scrollIndicator.style.width = `${progress}%`;
        }
        
        // Active section
        this.updateActiveSection();
        
        this.lastScrollTop = scrollTop;
    }
    
    onNavClick(e) {
        e.preventDefault();
        
        const href = e.currentTarget.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Fermer le menu mobile si ouvert
            if (STATE.isMenuOpen) {
                this.closeMenu();
            }
            
            // Scroll vers la cible
            this.scrollToElement(targetElement);
        }
    }
    
    scrollToElement(element, offset = 80) {
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
    
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.id;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                STATE.currentSection = sectionId;
                this.highlightNavLink(sectionId);
            }
        });
    }
    
    highlightNavLink(sectionId) {
        DOM.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${sectionId}`);
        });
    }
}

/* 
============================================
COMPOSANT HERO
============================================ 
*/

class Hero {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🌟 Initialisation Hero');
        
        this.cacheDOM();
        this.setupEventListeners();
        this.initCounters();
        this.initCanvas();
    }
    
    cacheDOM() {
        this.titleElements = document.querySelectorAll('.title-word');
        this.counters = document.querySelectorAll('.counter');
        this.canvas = document.getElementById('heroCanvas');
    }
    
    setupEventListeners() {
        // Redimensionnement canvas
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Scroll animations
        window.addEventListener('scroll', () => this.onScroll());
    }
    
    initCanvas() {
        if (!this.canvas) return;
        
        const ctx = this.canvas.getContext('2d');
        
        const resizeCanvas = () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particules simples
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `rgba(0, 243, 255, ${Math.random() * 0.3 + 0.1})`
            });
        }
        
        const animate = () => {
            if (!this.canvas) return;
            
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Rebond sur les bords
                if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
                
                // Dessiner
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }
    }
    
    initCounters() {
        if (!this.counters.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const container = document.querySelector('.hero__stats');
        if (container) observer.observe(container);
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.dataset.count) || 0;
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                const value = Math.floor(easeProgress * target);
                
                counter.textContent = value + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
        });
    }
    
    onScroll() {
        // Effet parallaxe simple
        const hero = document.querySelector('.hero');
        const scrollY = window.scrollY;
        
        if (hero && scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    }
}

/* 
============================================
COMPOSANT PORTFOLIO
============================================ 
*/

class Portfolio {
    constructor() {
        this.activeFilter = 'all';
        this.items = [];
        
        this.init();
    }
    
    init() {
        console.log('🎨 Initialisation Portfolio');
        
        this.cacheDOM();
        this.setupEventListeners();
        this.loadItems();
    }
    
    cacheDOM() {
        DOM.portfolioGrid = document.getElementById('portfolioGrid');
        DOM.filterButtons = document.querySelectorAll('.filter-btn');
        DOM.loadMoreBtn = document.getElementById('loadMoreProjects');
    }
    
    setupEventListeners() {
        // Filtres
        if (DOM.filterButtons) {
            DOM.filterButtons.forEach(button => {
                button.addEventListener('click', (e) => this.onFilterClick(e));
            });
        }
        
        // Load more
        if (DOM.loadMoreBtn) {
            DOM.loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
    }
    
    loadItems() {
        // Données statiques pour l'exemple
        this.items = [
            { 
                id: 1, 
                title: "Luxury Artisan", 
                category: ["vitrine", "design"], 
                description: "Site vitrine premium pour une marque d'artisanat de luxe.",
                stats: { engagement: "+225%", contacts: "+180%" },
                featured: true 
            },
            { 
                id: 2, 
                title: "Urban Fashion Co.", 
                category: ["ecommerce"], 
                description: "Plateforme e-commerce complète avec design mobile-first.",
                stats: { conversions: "+320%", abandon: "-40%" }
            },
            { 
                id: 3, 
                title: "TechCorp Interactive", 
                category: ["experience", "vitrine"], 
                description: "Site corporate avec animations WebGL personnalisées.",
                stats: { time: "+450%", shares: "+280%" }
            },
            { 
                id: 4, 
                title: "Nova Identity", 
                category: ["design"], 
                description: "Refonte complète de l'identité visuelle.",
                stats: { consistency: "+95%", devTime: "-60%" }
            }
        ];
        
        this.render();
    }
    
    render() {
        if (!DOM.portfolioGrid) return;
        
        const filteredItems = this.activeFilter === 'all' 
            ? this.items 
            : this.items.filter(item => item.category.includes(this.activeFilter));
        
        DOM.portfolioGrid.innerHTML = filteredItems.map(item => this.createItemHTML(item)).join('');
        
        // Initialiser les animations
        this.initItemAnimations();
    }
    
    createItemHTML(item) {
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
                                            </div>
                                            <div class="preview-hero">
                                                <h5>${item.title}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="portfolio-tags">
                            ${item.category.map(cat => `<span class="tag">${cat}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="portfolio-item__info">
                    <div class="portfolio-meta">
                        <span class="meta-category">${item.category.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' • ')}</span>
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
                        </a>
                    </div>
                </div>
            </article>
        `;
    }
    
    getStatLabel(key) {
        const labels = {
            engagement: "Temps d'engagement",
            contacts: "Demandes de contact",
            conversions: "Conversions",
            abandon: "Taux d'abandon",
            time: "Temps passé",
            shares: "Partages",
            consistency: "Cohérence",
            devTime: "Temps dev"
        };
        return labels[key] || key;
    }
    
    onFilterClick(e) {
        const button = e.currentTarget;
        const filter = button.dataset.filter;
        
        this.activeFilter = filter;
        
        // Mettre à jour les boutons actifs
        DOM.filterButtons.forEach(btn => {
            btn.classList.toggle('filter-btn--active', btn === button);
        });
        
        // Re-rendre
        this.render();
    }
    
    loadMore() {
        // Simuler le chargement de plus d'éléments
        console.log('📦 Chargement de plus de projets...');
        
        // Désactiver le bouton temporairement
        if (DOM.loadMoreBtn) {
            DOM.loadMoreBtn.disabled = true;
            DOM.loadMoreBtn.innerHTML = '<span>Chargement...</span>';
            
            setTimeout(() => {
                DOM.loadMoreBtn.disabled = false;
                DOM.loadMoreBtn.innerHTML = '<span>Charger plus de projets</span><i class="ti ti-plus"></i>';
                
                // Simuler l'ajout d'éléments
                alert('Fonctionnalité de chargement à implémenter');
            }, 1000);
        }
    }
    
    initItemAnimations() {
        const items = DOM.portfolioGrid?.querySelectorAll('.portfolio-item');
        
        if (items) {
            items.forEach((item, index) => {
                // Animation d'entrée
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
                
                // Effet hover
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateY(-10px)';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateY(0)';
                });
            });
        }
    }
}

/* 
============================================
COMPOSANT CONTACT
============================================ 
*/

class ContactForm {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        
        this.init();
    }
    
    init() {
        console.log('📧 Initialisation Contact');
        
        this.cacheDOM();
        this.setupEventListeners();
        this.showStep(1);
    }
    
    cacheDOM() {
        DOM.contactForm = document.getElementById('contactForm');
        this.formSteps = document.querySelectorAll('.form-step');
        this.nextButtons = document.querySelectorAll('[id^="nextStep"]');
        this.prevButtons = document.querySelectorAll('[id^="prevStep"]');
        this.progressSteps = document.querySelectorAll('.progress-step');
    }
    
    setupEventListeners() {
        // Boutons next/prev
        if (this.nextButtons) {
            this.nextButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.goToNext(e));
            });
        }
        
        if (this.prevButtons) {
            this.prevButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.goToPrev(e));
            });
        }
        
        // Soumission du formulaire
        if (DOM.contactForm) {
            DOM.contactForm.addEventListener('submit', (e) => this.onSubmit(e));
        }
        
        // Validation en temps réel
        this.setupValidation();
    }
    
    showStep(stepNumber) {
        // Cacher toutes les étapes
        this.formSteps.forEach(step => {
            step.style.display = 'none';
        });
        
        // Afficher l'étape courante
        const currentStep = document.getElementById(`step${stepNumber}`);
        if (currentStep) {
            currentStep.style.display = 'block';
        }
        
        // Mettre à jour la progression
        this.updateProgress(stepNumber);
    }
    
    updateProgress(stepNumber) {
        this.progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            
            step.classList.remove('progress-step--active', 'progress-step--completed');
            
            if (stepNum < stepNumber) {
                step.classList.add('progress-step--completed');
            } else if (stepNum === stepNumber) {
                step.classList.add('progress-step--active');
            }
        });
    }
    
    goToNext(e) {
        e.preventDefault();
        
        // Valider l'étape actuelle
        if (!this.validateStep(this.currentStep)) {
            this.showStepError();
            return;
        }
        
        // Sauvegarder les données
        this.saveStepData();
        
        // Passer à l'étape suivante
        this.currentStep++;
        if (this.currentStep > 3) this.currentStep = 3;
        
        this.showStep(this.currentStep);
        
        // Scroll vers le haut
        DOM.contactForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    goToPrev(e) {
        e.preventDefault();
        
        this.currentStep--;
        if (this.currentStep < 1) this.currentStep = 1;
        
        this.showStep(this.currentStep);
    }
    
    validateStep(step) {
        const currentStep = document.getElementById(`step${step}`);
        const requiredFields = currentStep?.querySelectorAll('[required]');
        
        let isValid = true;
        
        if (requiredFields) {
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    this.highlightError(field, 'Ce champ est requis');
                } else {
                    this.removeError(field);
                    
                    // Validation email
                    if (field.type === 'email' && !this.isValidEmail(field.value)) {
                        isValid = false;
                        this.highlightError(field, 'Email invalide');
                    }
                }
            });
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    highlightError(field, message) {
        field.classList.add('error');
        
        // Créer le message d'erreur
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#ff4757';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
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
                if (input.name) {
                    this.formData[input.name] = input.value;
                }
            });
        }
    }
    
    setupValidation() {
        // Validation en temps réel pour tous les champs
        const allInputs = document.querySelectorAll('input, textarea, select');
        
        allInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim()) {
                    this.removeError(input);
                }
            });
            
            input.addEventListener('input', () => {
                this.removeError(input);
            });
        });
    }
    
    async onSubmit(e) {
        e.preventDefault();
        
        // Valider la dernière étape
        if (!this.validateStep(this.currentStep)) {
            this.showStepError();
            return;
        }
        
        // Sauvegarder les données finales
        this.saveStepData();
        
        // Désactiver le bouton
        const submitBtn = DOM.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Envoi en cours...</span>';
        submitBtn.disabled = true;
        
        try {
            // Simuler l'envoi
            await this.sendForm();
            
            // Afficher le message de succès
            this.showSuccess();
            
            // Réinitialiser le formulaire
            this.resetForm();
            
        } catch (error) {
            console.error('Erreur:', error);
            this.showError();
            
        } finally {
            // Réactiver le bouton
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async sendForm() {
        // Simuler un délai d'envoi
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('📤 Données envoyées:', this.formData);
                resolve();
            }, 1500);
        });
    }
    
    showSuccess() {
        // Afficher une notification
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #00ff9d; color: #000; padding: 1rem; border-radius: 4px; z-index: 10000;">
                <strong>✅ Message envoyé !</strong>
                <p>Nous vous répondrons dans les 24h.</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    showError() {
        alert('Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.');
    }
    
    resetForm() {
        // Réinitialiser le formulaire
        if (DOM.contactForm) {
            DOM.contactForm.reset();
            this.formData = {};
            this.currentStep = 1;
            this.showStep(1);
        }
    }
}

/* 
============================================
EFFETS SCROLL & ANIMATIONS
============================================ 
*/

class ScrollEffects {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🌀 Initialisation effets scroll');
        
        this.setupScrollAnimations();
        this.setupParallax();
        this.setupCounters();
    }
    
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observer les éléments à animer
        const elements = document.querySelectorAll('.expertise-card, .portfolio-item, .stat-card');
        elements.forEach(el => observer.observe(el));
    }
    
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    setupCounters() {
        const counters = document.querySelectorAll('.counter:not([data-animated])');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    entry.target.dataset.animated = 'true';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.dataset.count) || 0;
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const start = 0;
        
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(easeOutCubic * target);
            
            counter.textContent = value + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }
}

/* 
============================================
BACK TO TOP
============================================ 
*/

class BackToTop {
    constructor() {
        this.button = null;
        this.threshold = 300;
        
        this.init();
    }
    
    init() {
        console.log('⬆️ Initialisation Back to Top');
        
        this.createButton();
        this.setupEventListeners();
        this.checkVisibility();
    }
    
    createButton() {
        this.button = document.createElement('button');
        this.button.innerHTML = '<i class="ti ti-arrow-up"></i>';
        this.button.className = 'back-to-top';
        this.button.setAttribute('aria-label', 'Retour en haut');
        
        // Styles
        this.button.style.position = 'fixed';
        this.button.style.bottom = '2rem';
        this.button.style.right = '2rem';
        this.button.style.width = '50px';
        this.button.style.height = '50px';
        this.button.style.background = 'var(--neon-cyan)';
        this.button.style.color = 'var(--void-black)';
        this.button.style.border = 'none';
        this.button.style.borderRadius = '50%';
        this.button.style.cursor = 'pointer';
        this.button.style.display = 'flex';
        this.button.style.alignItems = 'center';
        this.button.style.justifyContent = 'center';
        this.button.style.fontSize = '1.5rem';
        this.button.style.opacity = '0';
        this.button.style.transform = 'translateY(20px)';
        this.button.style.transition = 'opacity 0.3s, transform 0.3s';
        this.button.style.zIndex = '1000';
        this.button.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.5)';
        
        document.body.appendChild(this.button);
    }
    
    setupEventListeners() {
        // Click
        this.button.addEventListener('click', () => this.scrollToTop());
        
        // Scroll
        window.addEventListener('scroll', () => this.checkVisibility());
    }
    
    checkVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > this.threshold) {
            this.show();
        } else {
            this.hide();
        }
    }
    
    show() {
        this.button.style.opacity = '1';
        this.button.style.transform = 'translateY(0)';
    }
    
    hide() {
        this.button.style.opacity = '0';
        this.button.style.transform = 'translateY(20px)';
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
CURSOR PERSONNALISÉ
============================================ 
*/

class CustomCursor {
    constructor() {
        this.pos = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.speed = 0.15;
        this.isMoving = false;
        
        this.init();
    }
    
    init() {
        if (!CONFIG.cursor || STATE.isMobile) return;
        
        console.log('🖱️ Initialisation Curseur');
        
        this.createCursor();
        this.setupEventListeners();
        this.animate();
    }
    
    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor';
        
        // Styles
        this.cursor.style.position = 'fixed';
        this.cursor.style.top = '0';
        this.cursor.style.left = '0';
        this.cursor.style.width = '20px';
        this.cursor.style.height = '20px';
        this.cursor.style.background = 'var(--neon-cyan)';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.pointerEvents = 'none';
        this.cursor.style.zIndex = '9999';
        this.cursor.style.mixBlendMode = 'difference';
        this.cursor.style.transform = 'translate(-50%, -50%)';
        this.cursor.style.boxShadow = '0 0 20px var(--neon-cyan)';
        
        document.body.appendChild(this.cursor);
        
        // Aura
        this.aura = document.createElement('div');
        this.aura.className = 'cursor__aura';
        this.aura.style.position = 'absolute';
        this.aura.style.top = '50%';
        this.aura.style.left = '50%';
        this.aura.style.width = '40px';
        this.aura.style.height = '40px';
        this.aura.style.border = '1px solid var(--neon-cyan)';
        this.aura.style.borderRadius = '50%';
        this.aura.style.transform = 'translate(-50%, -50%)';
        this.aura.style.opacity = '0.5';
        this.aura.style.animation = 'pulse 2s infinite';
        
        this.cursor.appendChild(this.aura);
    }
    
    setupEventListeners() {
        // Suivi de la souris
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Événements hover
        this.setupHoverEvents();
        
        // Clic
        document.addEventListener('mousedown', () => this.onMouseDown());
        document.addEventListener('mouseup', () => this.onMouseUp());
    }
    
    onMouseMove(e) {
        this.target.x = e.clientX;
        this.target.y = e.clientY;
        
        if (!this.isMoving) {
            this.pos.x = e.clientX;
            this.pos.y = e.clientY;
            this.isMoving = true;
        }
    }
    
    onMouseDown() {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
    }
    
    onMouseUp() {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }
    
    setupHoverEvents() {
        // Éléments interactifs
        const interactiveSelectors = [
            'a',
            'button',
            '.btn',
            '.nav__link',
            '.portfolio-item',
            '.expertise-card',
            'input',
            'textarea',
            'select'
        ];
        
        interactiveSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.addEventListener('mouseenter', () => this.onHoverStart(element));
                element.addEventListener('mouseleave', () => this.onHoverEnd());
            });
        });
    }
    
    onHoverStart(element) {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        this.cursor.style.background = 'var(--neon-pink)';
        this.cursor.style.boxShadow = '0 0 30px var(--neon-pink)';
    }
    
    onHoverEnd() {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        this.cursor.style.background = 'var(--neon-cyan)';
        this.cursor.style.boxShadow = '0 0 20px var(--neon-cyan)';
    }
    
    animate() {
        if (!this.isMoving) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        const dx = this.target.x - this.pos.x;
        const dy = this.target.y - this.pos.y;
        
        this.pos.x += dx * this.speed;
        this.pos.y += dy * this.speed;
        
        this.cursor.style.left = `${this.pos.x}px`;
        this.cursor.style.top = `${this.pos.y}px`;
        
        requestAnimationFrame(() => this.animate());
    }
}

/* 
============================================
PARTICULES
============================================ 
*/

class Particles {
    constructor() {
        this.init();
    }
    
    init() {
        if (!CONFIG.particles) return;
        
        console.log('✨ Initialisation Particules');
        
        this.createCanvas();
        this.createParticles();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles-canvas';
        
        // Styles
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        const count = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000));
        
        const colors = [
            '0, 243, 255', // cyan
            '255, 0, 255', // pink
            '157, 0, 255', // purple
            '0, 255, 157'  // green
        ];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Mettre à jour la position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Rebond sur les bords
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            // Dessiner
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

/* 
============================================
FONCTIONS UTILITAIRES
============================================ 
*/

class Utils {
    static debounce(func, wait) {
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
    
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static isMobile() {
        return window.innerWidth < 768;
    }
    
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
}

/* 
============================================
INITIALISATION GLOBALE
============================================ 
*/

// Instance unique de l'application
let appInstance = null;

// Initialiser quand tout est prêt
function initApp() {
    if (appInstance) return;
    
    try {
        appInstance = new App();
        
        // Initialiser les composants après le chargement
        document.addEventListener('app:ready', () => {
            new Navigation();
            new Hero();
            new Portfolio();
            new ContactForm();
            new ScrollEffects();
            new BackToTop();
            
            if (CONFIG.cursor && !Utils.isTouchDevice()) {
                new CustomCursor();
            }
            
            if (CONFIG.particles) {
                new Particles();
            }
        });
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        
        // Fallback: cacher le loader et afficher le site
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.style.display = 'none';
        }
        
        // Afficher un message d'erreur en debug
        if (CONFIG.debug) {
            alert('Erreur d\'initialisation: ' + error.message);
        }
    }
}

// Démarrer avec un timeout de sécurité
window.addEventListener('load', () => {
    console.log('🌐 Page chargée');
    
    // Timeout de sécurité pour le loader
    setTimeout(() => {
        const loader = document.getElementById('globalLoader');
        if (loader && loader.style.display !== 'none') {
            console.warn('⚠️ Loader timeout - Forcing display');
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
        
        // Initialiser l'application
        initApp();
    }, CONFIG.maxLoadTime + 1000);
    
    // Initialiser normalement
    initApp();
});

// Support pour les anciens navigateurs
if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}

// Polyfill pour requestAnimationFrame
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback) => {
        return setTimeout(callback, 1000 / 60);
    };
    window.cancelAnimationFrame = (id) => clearTimeout(id);
}

// Exporter l'API globale
window.MARONEWEB = {
    config: CONFIG,
    state: STATE,
    utils: Utils,
    
    // Méthodes publiques
    reload: () => location.reload(),
    showLoader: () => {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.style.display = 'flex';
            loader.style.opacity = '1';
        }
    },
    hideLoader: () => {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }
};

// Message de bienvenue
console.log(`
╔══════════════════════════════════════╗
║      MARONEWEB v4.0 - READY         ║
║     Design Cyberpunk Premium         ║
║   © 2025 - Tous droits réservés      ║
╚══════════════════════════════════════╝
`);

/* 
============================================
FIN DU SCRIPT
============================================ 
*/