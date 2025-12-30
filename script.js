/* 
============================================
MARONEWEB - ULTIMATE CYBERPUNK JAVASCRIPT V6.1 (CORRIGÉ)
Version 6.1 | BUG FIX EDITION
============================================ 
*/

'use strict';

// ============================================
// 0. CONFIGURATION NUCLEAIRE
// ============================================

const CONFIG = {
    // PERFORMANCE
    debug: false,
    fps: 60,
    maxParticles: 500,
    
    // ATMOSPHERES
    atmosphereDuration: 15000, // 15s par atmosphère
    transitionDuration: 2000,
    
    // PARTICLES
    particleCount: {
        hacking: 200,
        corporate: 150,
        creative: 180
    },
    
    // 3D
    perspective: 1000,
    depth: {
        near: 10,
        mid: 50,
        far: 100
    },
    
    // ANIMATIONS
    animationSpeed: 1
};

// ============================================
// 1. ÉTAT GLOBAL AVANCÉ
// ============================================

const STATE = {
    // APP
    initialized: false,
    isLoading: true,
    isOnline: true,
    
    // ATMOSPHERE
    currentAtmosphere: 'hacking',
    nextAtmosphere: 'corporate',
    atmosphereTimer: null,
    isTransitioning: false,
    atmosphereProgress: 0,
    
    // 3D
    mouse: { x: 0, y: 0 },
    scroll: 0,
    parallaxEnabled: true,
    
    // PERFORMANCE
    fps: 60,
    frameCount: 0,
    lastTime: 0,
    deltaTime: 0,
    
    // SECTIONS
    activeSection: 'hero'
};

// ============================================
// 2. CORE ENGINE SIMPLIFIÉ
// ============================================

class CyberpunkEngine {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🚀 CYBERPUNK ENGINE - Initialization...');
        
        this.setupErrorHandling();
        
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            setTimeout(() => this.onDOMReady(), 100);
        }
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('🚨 Global Error:', e.message);
            this.showErrorNotification('System error: ' + e.message, 'warn');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('🚨 Unhandled Promise:', e.reason);
        });
    }
    
    onDOMReady() {
        console.log('📄 DOM Ready');
        
        // Cacher les erreurs CORS pour les fichiers locaux
        this.suppressLocalFileErrors();
        
        // Initialiser les modules
        this.initModules();
        
        // Démarrer le chargement
        this.startLoadingSequence();
    }
    
    suppressLocalFileErrors() {
        // Ignorer les erreurs de fichiers manquants en local
        if (window.location.protocol === 'file:') {
            console.log('📁 Running in local file mode');
        }
    }
    
    initModules() {
        this.modules = {
            atmosphere: new AtmosphereManager(),
            particles: new ParticleSystemManager(),
            threeD: new ThreeDEngine(),
            ui: new UIManager(),
            audio: new AudioManager()
        };
        
        // Initialiser chaque module
        Object.values(this.modules).forEach(module => {
            if (module.init) {
                try {
                    module.init();
                } catch (error) {
                    console.error('Module init error:', error);
                }
            }
        });
    }
    
    startLoadingSequence() {
        console.log('🔄 Starting loading sequence...');
        
        const loader = document.getElementById('globalLoader');
        if (!loader) {
            this.completeLoading();
            return;
        }
        
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressPercentage');
        const statusText = document.getElementById('progressStage');
        
        const steps = [
            { progress: 20, text: 'Initializing core systems...' },
            { progress: 40, text: 'Loading 3D engine...' },
            { progress: 60, text: 'Setting up particle systems...' },
            { progress: 80, text: 'Preparing UI components...' },
            { progress: 100, text: 'Launching cyberpunk interface...' }
        ];
        
        let currentStep = 0;
        
        const updateProgress = () => {
            if (currentStep >= steps.length) {
                this.completeLoading();
                return;
            }
            
            const step = steps[currentStep];
            
            if (progressBar) {
                progressBar.style.width = `${step.progress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${step.progress}%`;
            }
            
            if (statusText) {
                statusText.textContent = `> ${step.text}`;
            }
            
            currentStep++;
            setTimeout(updateProgress, 500);
        };
        
        updateProgress();
    }
    
    completeLoading() {
        console.log('✅ Loading complete');
        
        STATE.isLoading = false;
        
        // Animation de sortie du loader
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.8s ease';
            
            setTimeout(() => {
                loader.style.display = 'none';
                this.onAppReady();
            }, 800);
        } else {
            this.onAppReady();
        }
    }
    
    onAppReady() {
        console.log('🎉 Application Ready!');
        
        STATE.initialized = true;
        
        // Démarrer les systèmes
        this.startSystems();
        
        // Événement personnalisé
        document.dispatchEvent(new CustomEvent('cyberpunk:ready'));
        
        // Initialisation complète
        this.showNotification('System Online', 'success');
    }
    
    startSystems() {
        try {
            // Démarrer l'atmosphère
            if (this.modules.atmosphere) {
                this.modules.atmosphere.startCycle();
            }
            
            // Démarrer les particules
            if (this.modules.particles) {
                this.modules.particles.start();
            }
            
            // Démarrer le moteur 3D
            if (this.modules.threeD) {
                this.modules.threeD.start();
            }
            
            // Démarrer les animations UI
            if (this.modules.ui) {
                this.modules.ui.startAnimations();
            }
            
        } catch (error) {
            console.error('Error starting systems:', error);
        }
    }
    
    showNotification(message, type = 'info') {
        console.log(`📢 ${type}: ${message}`);
        
        // Notification simple dans la console pour l'instant
        if (type === 'error') {
            console.error(message);
        } else if (type === 'warn') {
            console.warn(message);
        }
    }
    
    showErrorNotification(message, type = 'error') {
        this.showNotification(message, type);
    }
}

// ============================================
// 3. ATMOSPHERE MANAGER CORRIGÉ
// ============================================

class AtmosphereManager {
    constructor() {
        this.atmospheres = ['hacking', 'corporate', 'creative'];
        this.currentIndex = 0;
        this.isAnimating = false;
    }
    
    init() {
        console.log('🌌 Atmosphere Manager initialized');
        
        // Créer l'overlay de transition
        this.createTransitionOverlay();
        
        // Initialiser l'atmosphère de départ
        setTimeout(() => {
            this.applyAtmosphere('hacking');
        }, 100);
    }
    
    createTransitionOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'atmosphere-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s;
            background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
        `;
        document.body.appendChild(this.overlay);
    }
    
    startCycle() {
        // Attendre un peu avant de commencer le cycle
        setTimeout(() => {
            setInterval(() => {
                this.nextAtmosphere();
            }, CONFIG.atmosphereDuration);
        }, 5000);
    }
    
    nextAtmosphere() {
        if (STATE.isTransitioning || this.isAnimating) return;
        
        STATE.isTransitioning = true;
        this.isAnimating = true;
        
        this.currentIndex = (this.currentIndex + 1) % this.atmospheres.length;
        const nextAtmosphere = this.atmospheres[this.currentIndex];
        
        console.log(`🔄 Transition to: ${nextAtmosphere}`);
        
        // Animation de transition
        this.animateTransition(() => {
            this.applyAtmosphere(nextAtmosphere);
            this.completeTransition();
        });
    }
    
    animateTransition(onComplete) {
        let progress = 0;
        const duration = CONFIG.transitionDuration;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            // Easing
            const easedProgress = this.easeInOutCubic(progress);
            
            // Mettre à jour l'overlay
            this.overlay.style.opacity = `${easedProgress * 0.7}`;
            
            // Effet de glitch léger
            if (progress < 0.9) {
                document.body.style.transform = `
                    translateX(${Math.random() * 4 - 2}px)
                    translateY(${Math.random() * 4 - 2}px)
                `;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    applyAtmosphere(atmosphere) {
        console.log(`🎨 Applying atmosphere: ${atmosphere}`);
        
        // Mettre à jour l'état
        STATE.currentAtmosphere = atmosphere;
        
        // Supprimer toutes les classes d'atmosphère
        document.body.classList.remove('atmosphere-hacking', 'atmosphere-corporate', 'atmosphere-creative');
        
        // Ajouter la nouvelle classe
        document.body.classList.add(`atmosphere-${atmosphere}`);
        
        // Mettre à jour les couleurs CSS
        this.updateCSSVariables(atmosphere);
    }
    
    updateCSSVariables(atmosphere) {
        const root = document.documentElement;
        
        const variables = {
            hacking: {
                '--primary': '#00ff41',
                '--secondary': '#ff0080',
                '--accent': '#00f7ff',
                '--bg': '#000000',
                '--grid': 'rgba(0, 255, 65, 0.05)'
            },
            corporate: {
                '--primary': '#7c3aed',
                '--secondary': '#00d4ff',
                '--accent': '#ff6b00',
                '--bg': '#0a0a15',
                '--grid': 'rgba(124, 58, 237, 0.05)'
            },
            creative: {
                '--primary': '#ff00ff',
                '--secondary': '#00ff88',
                '--accent': '#ffdd00',
                '--bg': '#000011',
                '--grid': 'rgba(255, 0, 255, 0.05)'
            }
        };
        
        const theme = variables[atmosphere];
        if (theme) {
            Object.entries(theme).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        }
    }
    
    completeTransition() {
        STATE.isTransitioning = false;
        this.isAnimating = false;
        
        // Réinitialiser les transformations
        document.body.style.transform = '';
        
        // Cacher l'overlay
        this.overlay.style.opacity = '0';
        
        console.log(`✅ Atmosphere changed to: ${STATE.currentAtmosphere}`);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// ============================================
// 4. PARTICLE SYSTEM MANAGER CORRIGÉ
// ============================================

class ParticleSystemManager {
    constructor() {
        this.systems = [];
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
    }
    
    init() {
        console.log('✨ Particle System initialized');
        
        try {
            this.createCanvas();
            this.createParticleSystems();
        } catch (error) {
            console.error('Error initializing particle system:', error);
        }
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticleSystems() {
        // Système simple pour commencer
        this.particles = [];
        
        // Créer des particules selon l'atmosphère actuelle
        this.createParticlesForAtmosphere('hacking');
    }
    
    createParticlesForAtmosphere(atmosphere) {
        this.particles = [];
        
        let count, color, type;
        
        switch(atmosphere) {
            case 'hacking':
                count = 150;
                color = '#00ff41';
                type = 'matrix';
                break;
            case 'corporate':
                count = 100;
                color = '#7c3aed';
                type = 'circle';
                break;
            case 'creative':
                count = 120;
                color = '#ff00ff';
                type = 'wave';
                break;
            default:
                count = 100;
                color = '#00ff41';
                type = 'matrix';
        }
        
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(type, color));
        }
    }
    
    createParticle(type, color) {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            color: color,
            alpha: Math.random() * 0.5 + 0.3,
            type: type,
            life: 1,
            speed: Math.random() * 0.5 + 0.5
        };
    }
    
    start() {
        console.log('🌀 Particle systems started');
        this.animate();
    }
    
    animate() {
        if (!this.canvas || !this.ctx) return;
        
        // Clear canvas avec fondu
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mettre à jour et dessiner les particules
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        // Prochaine frame
        requestAnimationFrame(() => this.animate());
    }
    
    updateParticle(p) {
        // Mettre à jour la position
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;
        
        // Rebond sur les bords
        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        
        // Vieillissement
        p.life -= 0.001;
        if (p.life <= 0) {
            p.x = Math.random() * this.canvas.width;
            p.y = Math.random() * this.canvas.height;
            p.life = 1;
        }
        
        // Comportement selon le type
        switch(p.type) {
            case 'matrix':
                p.vy = Math.abs(p.vy) * 1.5; // Descend plus vite
                break;
            case 'circle':
                // Mouvement circulaire
                p.vx = Math.cos(Date.now() * 0.001 + p.x * 0.01) * p.speed;
                p.vy = Math.sin(Date.now() * 0.001 + p.y * 0.01) * p.speed;
                break;
            case 'wave':
                // Mouvement ondulatoire
                p.vx = Math.sin(p.y * 0.01 + Date.now() * 0.001) * p.speed;
                p.vy = Math.cos(p.x * 0.01 + Date.now() * 0.001) * p.speed;
                break;
        }
    }
    
    drawParticle(p) {
        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        
        switch(p.type) {
            case 'matrix':
                // Caractère matrix
                this.ctx.font = `${p.size * 2}px 'Courier New', monospace`;
                this.ctx.fillStyle = p.color;
                this.ctx.fillText('0', p.x, p.y);
                break;
                
            default:
                // Cercle par défaut
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    changeTheme(atmosphere) {
        this.createParticlesForAtmosphere(atmosphere);
    }
}

// ============================================
// 5. 3D ENGINE SIMPLIFIÉ
// ============================================

class ThreeDEngine {
    constructor() {
        this.elements = [];
        this.mouseX = 0;
        this.mouseY = 0;
    }
    
    init() {
        console.log('🎮 3D Engine initialized');
        
        this.setupEventListeners();
        this.scan3DElements();
    }
    
    setupEventListeners() {
        // Suivi de la souris
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });
    }
    
    scan3DElements() {
        // Trouver les éléments avec des effets 3D
        const selectors = [
            '.expertise-card-3d',
            '.portfolio-item-3d',
            '.hero__title-3d'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.register3DElement(element);
            });
        });
    }
    
    register3DElement(element) {
        this.elements.push({
            element,
            depth: this.calculateDepth(element)
        });
    }
    
    calculateDepth(element) {
        // Profondeur basée sur les classes
        if (element.classList.contains('depth-1')) return 20;
        if (element.classList.contains('depth-2')) return 40;
        if (element.classList.contains('depth-3')) return 60;
        return 30; // Profondeur par défaut
    }
    
    start() {
        console.log('🔄 3D Engine started');
        this.animate();
    }
    
    animate() {
        this.elements.forEach(item => {
            this.updateElement(item);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateElement(item) {
        if (!item.element) return;
        
        const { element, depth } = item;
        const rotateY = this.mouseX * 5;
        const rotateX = -this.mouseY * 5;
        
        element.style.transform = `
            perspective(${CONFIG.perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(${depth}px)
        `;
    }
}

// ============================================
// 6. UI MANAGER SIMPLIFIÉ
// ============================================

class UIManager {
    constructor() {
        this.components = new Map();
    }
    
    init() {
        console.log('🎨 UI Manager initialized');
        
        this.setupNavigation();
        this.setupInteractiveElements();
        this.setupScrollAnimations();
    }
    
    setupNavigation() {
        // Navigation smooth
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            });
        });
        
        // Menu mobile
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
        }
    }
    
    setupInteractiveElements() {
        // Hover effects
        document.querySelectorAll('.expertise-card-3d, .portfolio-item-3d').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform += ' scale(1.05)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = element.style.transform.replace(' scale(1.05)', '');
            });
        });
    }
    
    setupScrollAnimations() {
        // Animation au scroll simple
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observer les éléments à animer
        document.querySelectorAll('.expertise-card-3d, .portfolio-item-3d, .stat').forEach(el => {
            observer.observe(el);
        });
    }
    
    scrollToElement(element, offset = 80) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    startAnimations() {
        // Animer les compteurs
        this.animateCounters();
        
        // Animer les titres
        this.animateTitles();
    }
    
    animateCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const target = parseInt(counter.dataset.count) || 0;
            const duration = 2000;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.floor(progress * target);
                
                counter.textContent = value + (counter.dataset.suffix || '');
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            // Démarrer après un délai
            setTimeout(animate, 500);
        });
    }
    
    animateTitles() {
        const titles = document.querySelectorAll('.hero__title-3d, .section-title');
        titles.forEach(title => {
            title.style.opacity = '0';
            title.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                title.style.transition = 'opacity 0.8s, transform 0.8s';
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 300);
        });
    }
}

// ============================================
// 7. AUDIO MANAGER BASIQUE
// ============================================

class AudioManager {
    constructor() {
        this.enabled = false;
    }
    
    init() {
        console.log('🎵 Audio Manager initialized');
        this.enabled = false; // Désactivé par défaut
    }
    
    changeAtmosphere(atmosphere) {
        // Pour l'instant, pas d'audio
        return;
    }
}

// ============================================
// 8. INITIALISATION SIMPLIFIÉE
// ============================================

// Attendre que la page soit chargée
window.addEventListener('load', () => {
    console.log('🌐 Window loaded');
    
    // Initialiser le moteur
    const cyberpunk = new CyberpunkEngine();
    
    // Exposer l'API globale
    window.Cyberpunk = {
        config: CONFIG,
        state: STATE,
        engine: cyberpunk,
        
        // Méthodes simples
        showNotification: (message, type) => {
            console.log(`${type}: ${message}`);
        },
        
        changeAtmosphere: (name) => {
            if (cyberpunk.modules?.atmosphere) {
                cyberpunk.modules.atmosphere.applyAtmosphere(name);
            }
        }
    };
});

// Polyfills pour compatibilité
if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.msMatchesSelector || 
        Element.prototype.webkitMatchesSelector;
}

// Message de démarrage
console.log(`
╔═══════════════════════════════════════════════════════╗
║      MARONEWEB CYBERPUNK ENGINE v6.1                ║
║     • 3 Dynamic Atmospheres                         ║
║     • Particle Systems                             ║
║     • 3D Effects                                  ║
║     • Smooth Animations                           ║
║     © 2025 - All Systems Operational              ║
╚═══════════════════════════════════════════════════════╝
`);

// ============================================
// 9. STYLES DYNAMIQUES
// ============================================

// Ajouter les styles CSS générés par le JS
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .atmosphere-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9998;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s;
        background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Effets d'atmosphère */
    .atmosphere-hacking .expertise-card-3d:hover,
    .atmosphere-hacking .portfolio-item-3d:hover {
        box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
    }
    
    .atmosphere-corporate .expertise-card-3d:hover,
    .atmosphere-corporate .portfolio-item-3d:hover {
        box-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
    }
    
    .atmosphere-creative .expertise-card-3d:hover,
    .atmosphere-creative .portfolio-item-3d:hover {
        box-shadow: 0 0 30px rgba(255, 0, 255, 0.3);
    }
    
    /* Animation des compteurs */
    .counter {
        display: inline-block;
    }
`;

document.head.appendChild(dynamicStyles);

// ============================================
// FONCTIONS UTILITAIRES SUPPLEMENTAIRES
// ============================================

// Fonction pour vérifier si un élément est dans le viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Fonction pour créer un effet de glitch
function createGlitchEffect(element, duration = 100) {
    const originalText = element.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let interval = setInterval(() => {
        let glitched = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() > 0.9) {
                glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitched += originalText[i];
            }
        }
        element.textContent = glitched;
    }, 50);
    
    setTimeout(() => {
        clearInterval(interval);
        element.textContent = originalText;
    }, duration);
}

// Fonction pour générer un effet de néon
function createNeonGlow(element, color = '#00ff41') {
    element.style.textShadow = `
        0 0 5px ${color},
        0 0 10px ${color},
        0 0 20px ${color},
        0 0 40px ${color}
    `;
}

// ============================================
// CODE D'INITIALISATION DIRECT
// ============================================

// Démarrer immédiatement si la page est déjà chargée
if (document.readyState === 'complete') {
    setTimeout(() => {
        new CyberpunkEngine();
    }, 100);
}

// ============================================
// FIN DU SCRIPT CORRIGÉ
// ============================================