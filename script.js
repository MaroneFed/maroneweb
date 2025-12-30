/* 
============================================
MARONEWEB - ULTIMATE CYBERPUNK JAVASCRIPT
Version 6.0 | MATRIX REVOLUTION
Features: 3 Atmospheres × 3D × Particles × Hacking
Performance: Optimized 60FPS × WebGL Fallback
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
    atmosphereDuration: 10000, // 10s par atmosphère
    transitionDuration: 2000,
    
    // PARTICLES
    particleCount: {
        hacking: 300,
        corporate: 200,
        creative: 250
    },
    
    // 3D
    perspective: 1000,
    depth: {
        near: 10,
        mid: 50,
        far: 100
    },
    
    // ANIMATIONS
    animationSpeed: 1,
    
    // RESEAU
    connectionCheckInterval: 5000
};

// ============================================
// 1. ÉTAT GLOBAL AVANCÉ
// ============================================

const STATE = {
    // APP
    initialized: false,
    isLoading: true,
    isOnline: navigator.onLine,
    
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
    
    // PARTICLES
    particleSystems: [],
    
    // SECTIONS
    activeSection: 'hero',
    sections: [],
    
    // AUDIO
    audioEnabled: false,
    backgroundAudio: null
};

// ============================================
// 2. CORE ENGINE - MOTEUR PRINCIPAL
// ============================================

class CyberpunkEngine {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🚀 CYBERPUNK ENGINE - Initialization...');
        
        this.setupPerformance();
        this.setupErrorHandling();
        this.checkRequirements();
        
        window.addEventListener('load', () => this.onWindowLoad());
        window.addEventListener('online', () => this.onConnectionChange(true));
        window.addEventListener('offline', () => this.onConnectionChange(false));
        
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    }
    
    setupPerformance() {
        // Performance monitoring
        if (CONFIG.debug) {
            this.setupFPSCounter();
            this.setupMemoryMonitor();
        }
        
        // Request Animation Frame optimization
        this.rAF = window.requestAnimationFrame || 
                   window.mozRequestAnimationFrame ||
                   window.webkitRequestAnimationFrame ||
                   window.msRequestAnimationFrame;
        
        this.cAF = window.cancelAnimationFrame || 
                   window.mozCancelAnimationFrame ||
                   window.webkitCancelAnimationFrame ||
                   window.msCancelAnimationFrame;
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('🚨 Global Error:', e.error);
            this.showErrorNotification('System error detected', 'warn');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('🚨 Unhandled Promise:', e.reason);
            this.showErrorNotification('Async operation failed', 'warn');
        });
    }
    
    checkRequirements() {
        const requirements = {
            webgl: this.checkWebGL(),
            webAudio: this.checkWebAudio(),
            css3d: this.checkCSS3D(),
            localStorage: this.checkLocalStorage()
        };
        
        if (CONFIG.debug) {
            console.log('📋 System Requirements:', requirements);
        }
        
        if (!requirements.webgl) {
            this.showErrorNotification('WebGL not supported - Some effects disabled');
        }
    }
    
    checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    checkWebAudio() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }
    
    checkCSS3D() {
        return 'perspective' in document.documentElement.style;
    }
    
    checkLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }
    
    onWindowLoad() {
        console.log('🌐 Window loaded');
        STATE.isOnline = navigator.onLine;
    }
    
    onDOMReady() {
        console.log('📄 DOM Ready');
        
        // Initialiser les modules
        this.initModules();
        
        // Démarrer le chargement
        this.startLoadingSequence();
    }
    
    initModules() {
        this.modules = {
            atmosphere: new AtmosphereManager(),
            particles: new ParticleSystemManager(),
            threeD: new ThreeDEngine(),
            ui: new UIManager(),
            audio: new AudioManager(),
            network: new NetworkMonitor()
        };
        
        // Initialiser chaque module
        Object.values(this.modules).forEach(module => {
            if (module.init) module.init();
        });
    }
    
    startLoadingSequence() {
        console.log('🔄 Starting loading sequence...');
        
        const loadingSteps = [
            { name: 'Core Systems', duration: 500 },
            { name: '3D Engine', duration: 800 },
            { name: 'Particle Systems', duration: 600 },
            { name: 'UI Components', duration: 700 },
            { name: 'Audio Systems', duration: 400 },
            { name: 'Network Setup', duration: 300 }
        ];
        
        let progress = 0;
        const totalSteps = loadingSteps.length;
        
        loadingSteps.forEach((step, index) => {
            setTimeout(() => {
                progress = ((index + 1) / totalSteps) * 100;
                this.updateLoaderProgress(progress, step.name);
                
                if (index === totalSteps - 1) {
                    this.completeLoading();
                }
            }, step.duration);
        });
    }
    
    updateLoaderProgress(progress, step) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressPercentage');
        const statusText = document.getElementById('progressStage');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
        
        if (statusText) {
            statusText.textContent = `> ${step}...`;
        }
    }
    
    completeLoading() {
        console.log('✅ Loading complete');
        
        STATE.isLoading = false;
        
        // Animation de sortie du loader
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
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
        // Démarrer l'atmosphère
        this.modules.atmosphere.startCycle();
        
        // Démarrer les particules
        this.modules.particles.start();
        
        // Démarrer le moteur 3D
        this.modules.threeD.start();
        
        // Démarrer les animations UI
        this.modules.ui.startAnimations();
        
        // Démarrer la boucle principale
        this.startMainLoop();
    }
    
    startMainLoop() {
        const animate = (time) => {
            // Calcul FPS
            this.calculateFPS(time);
            
            // Mettre à jour les modules
            this.updateModules(time);
            
            // Prochaine frame
            this.animationFrame = this.rAF(animate.bind(this));
        };
        
        this.animationFrame = this.rAF(animate.bind(this));
    }
    
    calculateFPS(time) {
        STATE.frameCount++;
        
        if (time >= STATE.lastTime + 1000) {
            STATE.fps = Math.round((STATE.frameCount * 1000) / (time - STATE.lastTime));
            STATE.frameCount = 0;
            STATE.lastTime = time;
            
            if (CONFIG.debug) {
                this.updateFPSCounter(STATE.fps);
            }
        }
        
        STATE.deltaTime = (time - (STATE.lastTime || time)) / 1000;
    }
    
    updateModules(time) {
        // Mettre à jour les particules
        this.modules.particles.update(time);
        
        // Mettre à jour le 3D
        this.modules.threeD.update(time);
        
        // Mettre à jour l'UI
        this.modules.ui.update(time);
        
        // Mettre à jour l'atmosphère
        this.modules.atmosphere.update(time);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `cyber-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Supprimer après délai
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    showErrorNotification(message, type = 'error') {
        if (CONFIG.debug) {
            console.error(`🚨 ${type.toUpperCase()}: ${message}`);
        }
        this.showNotification(`[SYSTEM] ${message}`, type);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warn: '⚠',
            info: 'ℹ'
        };
        return icons[type] || 'ℹ';
    }
    
    setupFPSCounter() {
        const fpsCounter = document.createElement('div');
        fpsCounter.id = 'fps-counter';
        fpsCounter.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff41;
            font-family: monospace;
            padding: 5px 10px;
            border: 1px solid #00ff41;
            z-index: 9999;
            font-size: 12px;
        `;
        document.body.appendChild(fpsCounter);
    }
    
    updateFPSCounter(fps) {
        const counter = document.getElementById('fps-counter');
        if (counter) {
            counter.textContent = `FPS: ${fps}`;
            counter.style.color = fps > 50 ? '#00ff41' : fps > 30 ? '#ffdd00' : '#ff0000';
        }
    }
    
    setupMemoryMonitor() {
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
                const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
                
                console.log(`🧠 Memory: ${usedMB}MB / ${totalMB}MB`);
                
                if (usedMB > totalMB * 0.8) {
                    this.showErrorNotification('High memory usage detected', 'warn');
                }
            }, 10000);
        }
    }
    
    onConnectionChange(online) {
        STATE.isOnline = online;
        const message = online ? 'Connection restored' : 'Connection lost';
        const type = online ? 'success' : 'error';
        this.showNotification(`[NETWORK] ${message}`, type);
    }
}

// ============================================
// 3. ATMOSPHERE MANAGER - GESTION DES 3 ATMOSPHERES
// ============================================

class AtmosphereManager {
    constructor() {
        this.atmospheres = ['hacking', 'corporate', 'creative'];
        this.currentIndex = 0;
        this.transitionProgress = 0;
        this.transitionDirection = 1;
    }
    
    init() {
        console.log('🌌 Atmosphere Manager initialized');
        
        this.setupEventListeners();
        this.createTransitionOverlay();
        
        // Initialiser l'atmosphère de départ
        this.applyAtmosphere('hacking');
    }
    
    setupEventListeners() {
        // Changement d'atmosphère manuel
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'a') {
                this.nextAtmosphere();
            }
        });
        
        // Scroll pour changer d'atmosphère
        let scrollTimeout;
        window.addEventListener('wheel', (e) => {
            if (e.deltaY > 50 && !scrollTimeout) {
                this.nextAtmosphere();
                scrollTimeout = setTimeout(() => scrollTimeout = null, 1000);
            }
        });
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
        `;
        document.body.appendChild(this.overlay);
    }
    
    startCycle() {
        // Cycle automatique des atmosphères
        setInterval(() => {
            this.nextAtmosphere();
        }, CONFIG.atmosphereDuration);
    }
    
    nextAtmosphere() {
        if (STATE.isTransitioning) return;
        
        STATE.isTransitioning = true;
        this.currentIndex = (this.currentIndex + 1) % this.atmospheres.length;
        const nextAtmosphere = this.atmospheres[this.currentIndex];
        
        console.log(`🔄 Transition to: ${nextAtmosphere}`);
        
        // Préparer la transition
        this.prepareTransition(nextAtmosphere);
        
        // Animation de transition
        this.animateTransition(() => {
            this.applyAtmosphere(nextAtmosphere);
            this.completeTransition();
        });
    }
    
    prepareTransition(nextAtmosphere) {
        // Mettre à jour l'état
        STATE.nextAtmosphere = nextAtmosphere;
        STATE.atmosphereProgress = 0;
        
        // Préparer l'overlay
        this.setOverlayColor(nextAtmosphere);
        this.overlay.style.opacity = '0';
    }
    
    animateTransition(onComplete) {
        let progress = 0;
        const duration = CONFIG.transitionDuration;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easedProgress = this.easeInOutCubic(progress);
            
            // Mettre à jour le progress
            STATE.atmosphereProgress = easedProgress;
            
            // Animation de l'overlay
            this.overlay.style.opacity = `${easedProgress * 0.7}`;
            
            // Animation du glitch
            this.applyGlitchEffect(easedProgress);
            
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
        
        // Changer la classe sur le body
        document.body.className = '';
        document.body.classList.add(`atmosphere-${atmosphere}`);
        
        // Mettre à jour les couleurs CSS
        this.updateCSSVariables(atmosphere);
        
        // Mettre à jour les particules
        if (window.cyberpunk?.modules?.particles) {
            window.cyberpunk.modules.particles.changeTheme(atmosphere);
        }
        
        // Mettre à jour l'audio
        if (window.cyberpunk?.modules?.audio) {
            window.cyberpunk.modules.audio.changeAtmosphere(atmosphere);
        }
        
        // Événement personnalisé
        document.dispatchEvent(new CustomEvent('atmosphere:change', {
            detail: { atmosphere }
        }));
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
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }
    
    setOverlayColor(atmosphere) {
        const colors = {
            hacking: 'rgba(0, 255, 65, 0.3)',
            corporate: 'rgba(124, 58, 237, 0.3)',
            creative: 'rgba(255, 0, 255, 0.3)'
        };
        
        this.overlay.style.background = `radial-gradient(circle at center, ${colors[atmosphere]}, transparent 70%)`;
    }
    
    applyGlitchEffect(progress) {
        const intensity = Math.sin(progress * Math.PI) * 20;
        
        document.body.style.transform = `
            translateX(${Math.random() * intensity - intensity/2}px)
            translateY(${Math.random() * intensity - intensity/2}px)
        `;
        
        document.body.style.filter = `
            hue-rotate(${progress * 180}deg)
            contrast(${1 + progress})
        `;
    }
    
    completeTransition() {
        STATE.isTransitioning = false;
        STATE.atmosphereProgress = 1;
        
        // Réinitialiser les transformations
        document.body.style.transform = '';
        document.body.style.filter = '';
        
        // Cacher l'overlay
        this.overlay.style.opacity = '0';
        
        // Notification
        if (window.cyberpunk) {
            window.cyberpunk.showNotification(`Atmosphere: ${STATE.currentAtmosphere.toUpperCase()}`, 'info');
        }
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    update(time) {
        // Mettre à jour les effets en cours
        if (STATE.isTransitioning) {
            // Effets supplémentaires pendant la transition
        }
    }
}

// ============================================
// 4. PARTICLE SYSTEM MANAGER - SYSTÈME DE PARTICULES AVANCÉ
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
        
        this.createCanvas();
        this.setupEventListeners();
        this.createParticleSystems();
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
        // Système Matrix Rain
        this.systems.push({
            type: 'matrix',
            particles: [],
            config: {
                count: CONFIG.particleCount.hacking,
                speed: 2,
                size: 2,
                color: '#00ff41'
            }
        });
        
        // Système Floating Tech
        this.systems.push({
            type: 'tech',
            particles: [],
            config: {
                count: CONFIG.particleCount.corporate,
                speed: 0.5,
                size: 3,
                color: '#7c3aed'
            }
        });
        
        // Système Creative Waves
        this.systems.push({
            type: 'wave',
            particles: [],
            config: {
                count: CONFIG.particleCount.creative,
                speed: 1,
                size: 4,
                color: '#ff00ff'
            }
        });
        
        // Initialiser les particules
        this.initializeParticles();
    }
    
    initializeParticles() {
        this.systems.forEach(system => {
            system.particles = [];
            
            for (let i = 0; i < system.config.count; i++) {
                const particle = this.createParticle(system.type, system.config);
                system.particles.push(particle);
            }
        });
    }
    
    createParticle(type, config) {
        const particle = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: 0,
            vy: 0,
            size: config.size,
            color: config.color,
            alpha: Math.random() * 0.5 + 0.3,
            life: 1,
            speed: config.speed,
            type: type
        };
        
        // Configuration spécifique au type
        switch (type) {
            case 'matrix':
                particle.vx = (Math.random() - 0.5) * 0.2;
                particle.vy = config.speed * (Math.random() * 0.5 + 0.5);
                particle.char = String.fromCharCode(0x30A0 + Math.random() * 96);
                break;
                
            case 'tech':
                particle.vx = Math.cos(i) * config.speed;
                particle.vy = Math.sin(i) * config.speed;
                particle.angle = Math.random() * Math.PI * 2;
                particle.radius = Math.random() * 50 + 20;
                break;
                
            case 'wave':
                particle.vx = (Math.random() - 0.5) * config.speed;
                particle.vy = (Math.random() - 0.5) * config.speed;
                particle.waveOffset = Math.random() * Math.PI * 2;
                break;
        }
        
        return particle;
    }
    
    start() {
        console.log('🌀 Particle systems started');
        this.animate();
    }
    
    animate() {
        // Clear canvas avec fondu
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mettre à jour et dessiner chaque système
        this.systems.forEach(system => {
            if (this.shouldRenderSystem(system.type)) {
                this.updateSystem(system);
                this.renderSystem(system);
            }
        });
        
        // Prochaine frame
        requestAnimationFrame(() => this.animate());
    }
    
    shouldRenderSystem(type) {
        const atmosphere = STATE.currentAtmosphere;
        
        switch (type) {
            case 'matrix':
                return atmosphere === 'hacking';
            case 'tech':
                return atmosphere === 'corporate';
            case 'wave':
                return atmosphere === 'creative';
            default:
                return false;
        }
    }
    
    updateSystem(system) {
        system.particles.forEach(particle => {
            // Mettre à jour la position selon le type
            switch (particle.type) {
                case 'matrix':
                    particle.y += particle.vy;
                    if (particle.y > this.canvas.height) {
                        particle.y = 0;
                        particle.x = Math.random() * this.canvas.width;
                    }
                    break;
                    
                case 'tech':
                    particle.angle += 0.01;
                    particle.x += Math.cos(particle.angle) * particle.speed;
                    particle.y += Math.sin(particle.angle) * particle.speed;
                    
                    // Rebond sur les bords
                    if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
                    break;
                    
                case 'wave':
                    particle.x += Math.sin(particle.waveOffset + Date.now() * 0.001) * particle.speed;
                    particle.y += Math.cos(particle.waveOffset + Date.now() * 0.001) * particle.speed;
                    particle.waveOffset += 0.01;
                    
                    // Réapparition de l'autre côté
                    if (particle.x < 0) particle.x = this.canvas.width;
                    if (particle.x > this.canvas.width) particle.x = 0;
                    if (particle.y < 0) particle.y = this.canvas.height;
                    if (particle.y > this.canvas.height) particle.y = 0;
                    break;
            }
            
            // Vieillissement
            particle.life -= 0.0005;
            if (particle.life <= 0) {
                Object.assign(particle, this.createParticle(particle.type, system.config));
            }
        });
    }
    
    renderSystem(system) {
        system.particles.forEach(particle => {
            this.ctx.save();
            
            switch (particle.type) {
                case 'matrix':
                    // Texte Matrix
                    this.ctx.font = `${particle.size}px 'Courier New', monospace`;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.globalAlpha = particle.alpha;
                    this.ctx.fillText(particle.char, particle.x, particle.y);
                    break;
                    
                case 'tech':
                    // Cercles tech
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fillStyle = particle.color;
                    this.ctx.globalAlpha = particle.alpha;
                    this.ctx.fill();
                    
                    // Glow effect
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                    const gradient = this.ctx.createRadialGradient(
                        particle.x, particle.y, particle.size,
                        particle.x, particle.y, particle.size * 3
                    );
                    gradient.addColorStop(0, `${particle.color}80`);
                    gradient.addColorStop(1, 'transparent');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fill();
                    break;
                    
                case 'wave':
                    // Formes wave
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.quadraticCurveTo(
                        particle.x + 10,
                        particle.y - 10,
                        particle.x + 20,
                        particle.y
                    );
                    this.ctx.quadraticCurveTo(
                        particle.x + 30,
                        particle.y + 10,
                        particle.x + 40,
                        particle.y
                    );
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.lineWidth = particle.size / 2;
                    this.ctx.globalAlpha = particle.alpha;
                    this.ctx.stroke();
                    break;
            }
            
            this.ctx.restore();
        });
    }
    
    changeTheme(atmosphere) {
        const themes = {
            hacking: {
                matrix: { color: '#00ff41', count: CONFIG.particleCount.hacking },
                tech: { color: '#00ff41', count: 50 },
                wave: { color: '#00ff41', count: 30 }
            },
            corporate: {
                matrix: { color: '#7c3aed', count: 30 },
                tech: { color: '#7c3aed', count: CONFIG.particleCount.corporate },
                wave: { color: '#7c3aed', count: 50 }
            },
            creative: {
                matrix: { color: '#ff00ff', count: 40 },
                tech: { color: '#ff00ff', count: 60 },
                wave: { color: '#ff00ff', count: CONFIG.particleCount.creative }
            }
        };
        
        const theme = themes[atmosphere];
        
        this.systems.forEach(system => {
            const config = theme[system.type];
            if (config) {
                system.config.color = config.color;
                
                // Ajuster le nombre de particules
                const diff = config.count - system.particles.length;
                if (diff > 0) {
                    // Ajouter des particules
                    for (let i = 0; i < diff; i++) {
                        system.particles.push(this.createParticle(system.type, system.config));
                    }
                } else if (diff < 0) {
                    // Retirer des particules
                    system.particles = system.particles.slice(0, config.count);
                }
                
                // Mettre à jour la couleur des particules existantes
                system.particles.forEach(particle => {
                    particle.color = config.color;
                });
            }
        });
    }
    
    update(time) {
        // Mettre à jour les particules en fonction du temps
    }
    
    setupEventListeners() {
        // Interaction souris
        this.canvas.addEventListener('mousemove', (e) => {
            this.onMouseMove(e);
        });
        
        this.canvas.addEventListener('click', (e) => {
            this.createExplosion(e.clientX, e.clientY);
        });
    }
    
    onMouseMove(e) {
        // Ajouter des particules au mouvement de la souris
        const system = this.systems.find(s => s.type === 'wave');
        if (system && system.particles.length < CONFIG.maxParticles) {
            const particle = this.createParticle('wave', system.config);
            particle.x = e.clientX;
            particle.y = e.clientY;
            particle.size = Math.random() * 3 + 1;
            system.particles.push(particle);
        }
    }
    
    createExplosion(x, y) {
        const system = this.systems.find(s => s.type === 'tech');
        if (system) {
            for (let i = 0; i < 20; i++) {
                const particle = this.createParticle('tech', system.config);
                particle.x = x;
                particle.y = y;
                particle.vx = (Math.random() - 0.5) * 10;
                particle.vy = (Math.random() - 0.5) * 10;
                particle.life = 1;
                system.particles.push(particle);
            }
        }
    }
}

// ============================================
// 5. 3D ENGINE - MOTEUR 3D AVANCÉ
// ============================================

class ThreeDEngine {
    constructor() {
        this.elements = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollY = 0;
    }
    
    init() {
        console.log('🎮 3D Engine initialized');
        
        this.setupEventListeners();
        this.scan3DElements();
        this.createParallaxLayers();
    }
    
    setupEventListeners() {
        // Suivi de la souris
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });
        
        // Suivi du scroll
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });
        
        // Device orientation (mobile)
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                this.onDeviceOrientation(e);
            });
        }
    }
    
    scan3DElements() {
        // Trouver tous les éléments avec des classes 3D
        const selectors = [
            '.expertise-card-3d',
            '.portfolio-item-3d',
            '.hero__title-3d',
            '.step__3d-marker',
            '.contact-form-3d'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.register3DElement(element);
            });
        });
    }
    
    register3DElement(element) {
        const bounds = element.getBoundingClientRect();
        
        this.elements.push({
            element,
            originalTransform: element.style.transform,
            depth: this.calculateDepth(element),
            position: {
                x: bounds.left + bounds.width / 2,
                y: bounds.top + bounds.height / 2
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            parallax: {
                x: 0,
                y: 0,
                intensity: Math.random() * 0.5 + 0.5
            }
        });
    }
    
    calculateDepth(element) {
        // Calculer la profondeur basée sur la position dans le DOM
        const depthClasses = {
            'depth-1': 10,
            'depth-2': 30,
            'depth-3': 60
        };
        
        for (const [className, depth] of Object.entries(depthClasses)) {
            if (element.classList.contains(className)) {
                return depth;
            }
        }
        
        // Profondeur par défaut basée sur la position
        const rect = element.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        
        return Math.max(10, 50 - (distanceFromCenter / viewportCenter) * 40);
    }
    
    createParallaxLayers() {
        // Créer des couches de parallaxe pour le background
        for (let i = 0; i < 3; i++) {
            const layer = document.createElement('div');
            layer.className = `parallax-layer layer-${i + 1}`;
            layer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -${i + 2};
                opacity: ${0.1 + i * 0.05};
            `;
            
            document.body.appendChild(layer);
            this.elements.push({
                element: layer,
                depth: -100 - i * 50,
                isParallaxLayer: true
            });
        }
    }
    
    start() {
        console.log('🔄 3D Engine started');
        this.animate();
    }
    
    animate() {
        // Mettre à jour chaque élément 3D
        this.elements.forEach(item => {
            this.updateElement(item);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateElement(item) {
        if (!item.element || !STATE.parallaxEnabled) return;
        
        const { element, depth, position, isParallaxLayer } = item;
        
        // Calculer les déplacements
        const mouseOffsetX = this.mouseX * depth * 0.1;
        const mouseOffsetY = this.mouseY * depth * 0.1;
        const scrollOffset = this.scrollY * 0.1;
        
        if (isParallaxLayer) {
            // Pour les couches de background
            const parallaxX = this.mouseX * depth * 0.05;
            const parallaxY = this.mouseY * depth * 0.05;
            const scrollParallax = this.scrollY * 0.3;
            
            element.style.transform = `
                translateX(${parallaxX}px)
                translateY(${parallaxY + scrollParallax}px)
            `;
        } else {
            // Pour les éléments interactifs
            const rotationY = this.mouseX * 5;
            const rotationX = -this.mouseY * 5;
            
            // Effet de profondeur au scroll
            const scrollDepth = Math.max(0, 1 - Math.abs(position.y - this.scrollY) / window.innerHeight);
            const depthOffset = depth * scrollDepth * 0.5;
            
            // Appliquer la transformation 3D
            element.style.transform = `
                perspective(${CONFIG.perspective}px)
                translateX(${mouseOffsetX}px)
                translateY(${mouseOffsetY}px)
                translateZ(${depthOffset}px)
                rotateX(${rotationX}deg)
                rotateY(${rotationY}deg)
                scale(${1 + scrollDepth * 0.1})
            `;
            
            // Effet de glow basé sur la profondeur
            const glowIntensity = scrollDepth * 0.5;
            if (glowIntensity > 0.1) {
                const atmosphere = STATE.currentAtmosphere;
                const colors = {
                    hacking: '#00ff41',
                    corporate: '#7c3aed',
                    creative: '#ff00ff'
                };
                
                element.style.boxShadow = `
                    0 0 ${20 * glowIntensity}px ${colors[atmosphere]}40,
                    inset 0 0 ${10 * glowIntensity}px ${colors[atmosphere]}20
                `;
            }
        }
    }
    
    onDeviceOrientation(e) {
        // Utiliser l'orientation du device pour le parallaxe
        if (e.beta && e.gamma) {
            this.mouseX = e.gamma / 45; // Normaliser entre -1 et 1
            this.mouseY = e.beta / 45;
        }
    }
    
    update(time) {
        // Mettre à jour les rotations automatiques
        this.elements.forEach(item => {
            if (item.rotation) {
                item.rotation.y = Math.sin(time * 0.001) * 5;
                item.rotation.x = Math.cos(time * 0.001) * 3;
            }
        });
    }
}

// ============================================
// 6. UI MANAGER - GESTION AVANCÉE DE L'INTERFACE
// ============================================

class UIManager {
    constructor() {
        this.components = new Map();
        this.animations = [];
    }
    
    init() {
        console.log('🎨 UI Manager initialized');
        
        this.setupNavigation();
        this.setupInteractiveElements();
        this.setupCustomCursor();
        this.setupScrollAnimations();
        this.setupFormValidation();
        this.setupNotifications();
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
                    
                    // Mettre à jour la navigation active
                    this.updateActiveNavigation(targetId);
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
        // Hover effects 3D
        document.querySelectorAll('.expertise-card-3d, .portfolio-item-3d').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.onCardHover(e.currentTarget, true);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.onCardHover(e.currentTarget, false);
            });
        });
        
        // Button effects
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = '';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
    
    setupCustomCursor() {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #00ff41;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, border-color 0.3s;
            mix-blend-mode: difference;
        `;
        
        document.body.appendChild(this.cursor);
        
        // Cursor trail
        this.cursorTrail = document.createElement('div');
        this.cursorTrail.className = 'cursor-trail';
        this.cursorTrail.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: #00ff41;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        document.body.appendChild(this.cursorTrail);
        
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.updateCursor(e);
        });
        
        // Cursor states
        document.querySelectorAll('a, button, .btn, .interactive').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.width = '40px';
                this.cursor.style.height = '40px';
                this.cursor.style.borderColor = '#ff0080';
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.style.width = '20px';
                this.cursor.style.height = '20px';
                this.cursor.style.borderColor = '#00ff41';
            });
        });
    }
    
    updateCursor(e) {
        // Main cursor
        this.cursor.style.left = `${e.clientX}px`;
        this.cursor.style.top = `${e.clientY}px`;
        
        // Trail with delay
        setTimeout(() => {
            this.cursorTrail.style.left = `${e.clientX}px`;
            this.cursorTrail.style.top = `${e.clientY}px`;
            this.cursorTrail.style.opacity = '0.5';
            
            setTimeout(() => {
                this.cursorTrail.style.opacity = '0';
            }, 300);
        }, 50);
    }
    
    setupScrollAnimations() {
        // Intersection Observer pour les animations au scroll
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animation spécifique selon le type d'élément
                    if (entry.target.classList.contains('expertise-card-3d')) {
                        this.animateExpertiseCard(entry.target);
                    } else if (entry.target.classList.contains('portfolio-item-3d')) {
                        this.animatePortfolioItem(entry.target);
                    } else if (entry.target.classList.contains('stat')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observer les éléments à animer
        document.querySelectorAll('.expertise-card-3d, .portfolio-item-3d, .stat, .process-step').forEach(el => {
            this.observer.observe(el);
        });
    }
    
    setupFormValidation() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        // Validation en temps réel
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
        
        // Soumission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (await this.validateForm(contactForm)) {
                this.submitForm(contactForm);
            }
        });
    }
    
    setupNotifications() {
        // System pour les notifications
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'notification-container';
        this.notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        
        document.body.appendChild(this.notificationContainer);
    }
    
    onCardHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-20px) scale(1.05)';
            card.style.zIndex = '100';
            
            // Effet de lumière
            const rect = card.getBoundingClientRect();
            const light = document.createElement('div');
            light.className = 'card-light';
            light.style.cssText = `
                position: absolute;
                top: ${rect.top}px;
                left: ${rect.left}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                background: radial-gradient(circle at center, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    transparent 70%);
                pointer-events: none;
                z-index: 99;
            `;
            
            document.body.appendChild(light);
            setTimeout(() => light.remove(), 300);
            
        } else {
            card.style.transform = '';
            card.style.zIndex = '';
        }
    }
    
    scrollToElement(element, offset = 80) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    updateActiveNavigation(sectionId) {
        // Mettre à jour les liens de navigation
        document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${sectionId}`);
        });
        
        // Mettre à jour l'état
        STATE.activeSection = sectionId;
    }
    
    animateExpertiseCard(card) {
        const delay = Array.from(document.querySelectorAll('.expertise-card-3d')).indexOf(card) * 100;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, delay);
    }
    
    animatePortfolioItem(item) {
        item.style.animation = 'portfolioReveal 0.6s ease-out forwards';
    }
    
    animateCounter(counter) {
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
        
        animate();
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Invalid email format';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Invalid phone number';
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, message);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = '#ff4757';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    async validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, textarea, select');
        
        for (const field of fields) {
            if (!this.validateField(field)) {
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showNotification('Please fix the errors in the form', 'error');
        }
        
        return isValid;
    }
    
    async submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Désactiver le bouton
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        try {
            // Simuler l'envoi
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Succès
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
            
            // Réinitialiser les étapes si c'est un formulaire multi-étapes
            const formSteps = form.querySelectorAll('.form-step');
            if (formSteps.length > 1) {
                formSteps.forEach((step, index) => {
                    step.style.display = index === 0 ? 'block' : 'none';
                });
            }
            
        } catch (error) {
            this.showNotification('Error sending message. Please try again.', 'error');
            console.error('Form submission error:', error);
            
        } finally {
            // Réactiver le bouton
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `ui-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">${this.getNotificationIcon(type)}</div>
            <div class="notification-content">
                <div class="notification-title">${type.toUpperCase()}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Bouton de fermeture
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.closeNotification(notification);
        });
        
        // Fermeture automatique
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
    }
    
    closeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode === this.notificationContainer) {
                this.notificationContainer.removeChild(notification);
            }
        }, 300);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || 'ℹ';
    }
    
    startAnimations() {
        // Démarrer les animations de l'UI
        this.animateHeroTitle();
        this.animateStats();
        this.animateGridItems();
    }
    
    animateHeroTitle() {
        const title = document.querySelector('.hero__title-3d');
        if (!title) return;
        
        const letters = title.textContent.split('');
        title.innerHTML = '';
        
        letters.forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `opacity 0.3s ${index * 0.05}s, transform 0.3s ${index * 0.05}s`;
            title.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 500 + index * 50);
        });
    }
    
    animateStats() {
        const stats = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.classList.add('animate');
            }, index * 200);
        });
    }
    
    animateGridItems() {
        const gridItems = document.querySelectorAll('.expertise-card-3d, .portfolio-item-3d');
        gridItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s, transform 0.5s';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    update(time) {
        // Mettre à jour les animations de l'UI
        this.animations.forEach((animation, index) => {
            if (animation.update) {
                animation.update(time);
            }
        });
    }
}

// ============================================
// 7. AUDIO MANAGER - SYSTÈME AUDIO IMMERSIF
// ============================================

class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = null;
        this.volume = 0.3;
        this.enabled = false;
    }
    
    init() {
        console.log('🎵 Audio Manager initialized');
        
        if (!this.checkWebAudioSupport()) {
            console.warn('Web Audio API not supported');
            return;
        }
        
        this.setupAudioContext();
        this.loadSounds();
        this.setupEventListeners();
    }
    
    checkWebAudioSupport() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }
    
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = this.volume;
            
            this.enabled = true;
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
        }
    }
    
    loadSounds() {
        // Sons de base
        const soundFiles = {
            hover: this.generateHoverSound(),
            click: this.generateClickSound(),
            transition: this.generateTransitionSound(),
            notification: this.generateNotificationSound()
        };
        
        Object.entries(soundFiles).forEach(([name, buffer]) => {
            this.sounds.set(name, buffer);
        });
        
        // Musiques d'ambiance par atmosphère
        this.loadAtmosphereMusic();
    }
    
    generateHoverSound() {
        // Générer un son synthétique pour le hover
        return this.generateSynthSound(800, 0.1, 'sine');
    }
    
    generateClickSound() {
        return this.generateSynthSound(1200, 0.05, 'square');
    }
    
    generateTransitionSound() {
        return this.generateSynthSound(400, 0.3, 'sawtooth');
    }
    
    generateNotificationSound() {
        return this.generateSynthSound(1000, 0.2, 'triangle');
    }
    
    generateSynthSound(frequency, duration, type) {
        if (!this.enabled) return null;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.gainNode);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        return { oscillator, gainNode };
    }
    
    loadAtmosphereMusic() {
        // Musiques synthétiques générées
        this.atmosphereMusic = {
            hacking: this.generateMatrixMusic(),
            corporate: this.generateCorporateMusic(),
            creative: this.generateCreativeMusic()
        };
    }
    
    generateMatrixMusic() {
        // Musique style Matrix
        return this.generateSequence([
            { freq: 220, duration: 0.5 },
            { freq: 277, duration: 0.5 },
            { freq: 329, duration: 0.5 },
            { freq: 415, duration: 0.5 }
        ]);
    }
    
    generateCorporateMusic() {
        // Musique électronique corporate
        return this.generateSequence([
            { freq: 261, duration: 1 },
            { freq: 329, duration: 1 },
            { freq: 392, duration: 1 },
            { freq: 523, duration: 1 }
        ]);
    }
    
    generateCreativeMusic() {
        // Musique créative expérimentale
        return this.generateSequence([
            { freq: 440, duration: 0.3 },
            { freq: 554, duration: 0.3 },
            { freq: 659, duration: 0.3 },
            { freq: 880, duration: 0.3 }
        ]);
    }
    
    generateSequence(notes) {
        if (!this.enabled) return null;
        
        const sources = [];
        notes.forEach((note, index) => {
            setTimeout(() => {
                const source = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                source.connect(gainNode);
                gainNode.connect(this.gainNode);
                
                source.frequency.value = note.freq;
                source.type = 'sine';
                
                const now = this.audioContext.currentTime;
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + note.duration);
                
                source.start(now);
                source.stop(now + note.duration);
                
                sources.push({ source, gainNode });
            }, index * 1000);
        });
        
        return sources;
    }
    
    setupEventListeners() {
        // Activation audio au premier clic
        document.addEventListener('click', () => {
            if (this.enabled && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
        
        // Sons d'interaction
        document.querySelectorAll('a, button, .btn').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playSound('hover');
            });
            
            element.addEventListener('click', () => {
                this.playSound('click');
            });
        });
    }
    
    playSound(name) {
        if (!this.enabled || !this.sounds.has(name)) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            const now = this.audioContext.currentTime;
            
            sound.oscillator.start(now);
            sound.oscillator.stop(now + 0.3);
        }
    }
    
    changeAtmosphere(atmosphere) {
        if (!this.enabled) return;
        
        // Arrêter la musique actuelle
        this.stopMusic();
        
        // Démarrer la nouvelle musique
        if (this.atmosphereMusic[atmosphere]) {
            this.music = this.atmosphereMusic[atmosphere];
            this.playTransitionSound();
        }
    }
    
    playTransitionSound() {
        this.playSound('transition');
    }
    
    stopMusic() {
        if (this.music) {
            this.music.forEach(source => {
                if (source.source) {
                    source.source.stop();
                }
            });
            this.music = null;
        }
    }
    
    setVolume(volume) {
        if (this.gainNode) {
            this.volume = Math.max(0, Math.min(1, volume));
            this.gainNode.gain.value = this.volume;
        }
    }
    
    toggle() {
        this.enabled = !this.enabled;
        
        if (this.enabled && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        return this.enabled;
    }
}

// ============================================
// 8. NETWORK MONITOR - SURVEILLANCE RÉSEAU
// ============================================

class NetworkMonitor {
    constructor() {
        this.connection = null;
        this.speed = 0;
        this.latency = 0;
    }
    
    init() {
        console.log('📡 Network Monitor initialized');
        
        this.setupConnectionMonitoring();
        this.startSpeedTest();
        this.monitorRequests();
    }
    
    setupConnectionMonitoring() {
        if (navigator.connection) {
            this.connection = navigator.connection;
            
            this.connection.addEventListener('change', () => {
                this.onConnectionChange();
            });
            
            this.updateConnectionInfo();
        }
    }
    
    startSpeedTest() {
        // Test de vitesse simplifié
        setInterval(() => {
            this.measureLatency();
        }, CONFIG.connectionCheckInterval);
    }
    
    monitorRequests() {
        // Intercepter les requêtes fetch
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const start = performance.now();
            
            try {
                const response = await originalFetch(...args);
                const end = performance.now();
                
                this.latency = end - start;
                
                if (CONFIG.debug) {
                    console.log(`🌐 Request: ${args[0]} - ${this.latency.toFixed(2)}ms`);
                }
                
                return response;
            } catch (error) {
                console.error('🌐 Request failed:', error);
                throw error;
            }
        };
    }
    
    measureLatency() {
        const start = performance.now();
        
        // Ping vers un service fiable
        fetch('https://www.google.com/favicon.ico', {
            mode: 'no-cors',
            cache: 'no-store'
        })
        .then(() => {
            const end = performance.now();
            this.latency = end - start;
            
            if (CONFIG.debug) {
                console.log(`📶 Latency: ${this.latency.toFixed(2)}ms`);
            }
        })
        .catch(() => {
            this.latency = Infinity;
        });
    }
    
    onConnectionChange() {
        if (this.connection) {
            this.updateConnectionInfo();
            
            const info = this.getConnectionInfo();
            if (window.cyberpunk) {
                window.cyberpunk.showNotification(
                    `Connection: ${info.effectiveType.toUpperCase()} | ${info.downlink}Mbps`,
                    'info'
                );
            }
        }
    }
    
    updateConnectionInfo() {
        if (this.connection) {
            this.speed = this.connection.downlink || 0;
            
            if (CONFIG.debug) {
                console.log('📶 Network Info:', this.getConnectionInfo());
            }
        }
    }
    
    getConnectionInfo() {
        if (!this.connection) return {};
        
        return {
            effectiveType: this.connection.effectiveType || 'unknown',
            downlink: this.connection.downlink || 0,
            rtt: this.connection.rtt || 0,
            saveData: this.connection.saveData || false
        };
    }
    
    isConnectionSlow() {
        return this.speed < 1 || this.latency > 1000;
    }
    
    optimizeForSlowConnection() {
        if (this.isConnectionSlow()) {
            // Réduire les effets pour les connexions lentes
            CONFIG.maxParticles = 100;
            CONFIG.animationSpeed = 0.5;
            
            if (window.cyberpunk?.modules?.particles) {
                window.cyberpunk.modules.particles.reduceParticles();
            }
            
            return true;
        }
        return false;
    }
}

// ============================================
// 9. INITIALISATION ET API GLOBALE
// ============================================

// Initialiser le moteur
const cyberpunk = new CyberpunkEngine();

// Exposer l'API globale
window.Cyberpunk = {
    // Core
    config: CONFIG,
    state: STATE,
    engine: cyberpunk,
    
    // Modules
    atmosphere: cyberpunk.modules?.atmosphere,
    particles: cyberpunk.modules?.particles,
    threeD: cyberpunk.modules?.threeD,
    ui: cyberpunk.modules?.ui,
    audio: cyberpunk.modules?.audio,
    network: cyberpunk.modules?.network,
    
    // Méthodes
    showNotification: (message, type) => cyberpunk.showNotification(message, type),
    changeAtmosphere: (name) => cyberpunk.modules?.atmosphere?.applyAtmosphere(name),
    toggleAudio: () => cyberpunk.modules?.audio?.toggle(),
    
    // Utilitaires
    getFPS: () => STATE.fps,
    getMemory: () => {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576)
            };
        }
        return null;
    }
};

// Message de démarrage
console.log(`
╔═══════════════════════════════════════════════════════╗
║      MARONEWEB CYBERPUNK ENGINE v6.0                ║
║     • 3 Dynamic Atmospheres                         ║
║     • Advanced Particle Systems                     ║
║     • Real-time 3D Effects                          ║
║     • Immersive Audio                               ║
║     • Network Optimization                          ║
║     © 2025 - All Systems Operational                ║
╚═══════════════════════════════════════════════════════╝
`);

// Fallback pour les vieux navigateurs
if (!window.requestAnimationFrame) {
    console.warn('⚠️ Using fallback animation frame');
    window.requestAnimationFrame = (callback) => {
        return setTimeout(callback, 1000 / 60);
    };
    window.cancelAnimationFrame = (id) => clearTimeout(id);
}

// Support pour les collections NodeList
if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Support pour les anciens navigateurs
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.msMatchesSelector || 
        Element.prototype.webkitMatchesSelector;
}

// ============================================
// 10. STYLES DYNAMIQUES POUR LE JS
// ============================================

// Ajouter les styles CSS générés par le JS
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .cyber-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
    }
    
    .cyber-notification.show {
        transform: translateX(0);
    }
    
    .cyber-notification.success {
        border-color: #00ff41;
        color: #00ff41;
    }
    
    .cyber-notification.error {
        border-color: #ff0080;
        color: #ff0080;
    }
    
    .cyber-notification.warn {
        border-color: #ffdd00;
        color: #ffdd00;
    }
    
    .cyber-notification.info {
        border-color: #00f7ff;
        color: #00f7ff;
    }
    
    .ui-notification {
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 350px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(20px);
    }
    
    .ui-notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .ui-notification.success {
        border-color: #00ff41;
    }
    
    .ui-notification.error {
        border-color: #ff0080;
    }
    
    .ui-notification.warning {
        border-color: #ffdd00;
    }
    
    .ui-notification.info {
        border-color: #00f7ff;
    }
    
    .notification-icon {
        font-size: 1.5rem;
        font-weight: bold;
    }
    
    .notification-content {
        flex: 1;
    }
    
    .notification-title {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.1em;
        margin-bottom: 0.25rem;
    }
    
    .notification-message {
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    @keyframes portfolioReveal {
        0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
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
    
    .error {
        border-color: #ff4757 !important;
        box-shadow: 0 0 10px rgba(255, 71, 87, 0.3) !important;
    }
    
    .error-message {
        color: #ff4757;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
`;

document.head.appendChild(dynamicStyles);

// ============================================
// FIN DU SCRIPT ULTIMATE CYBERPUNK
// ============================================