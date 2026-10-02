/**
 * MOTION.JS — Animation Engine
 * Lenis + GSAP/ScrollTrigger setup, preloader, page transitions, custom cursor,
 * magnetic buttons, ambient background, scroll-linked effects
 */

(function() {
  'use strict';

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================

  const CONFIG = {
    // Lenis
    lenis: {
      lerp: 0.12,
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
      infinite: false
    },
    // GSAP ScrollTrigger defaults
    scrollTrigger: {
      markers: false,
      scrub: 1
    },
    // Preloader
    preloader: {
      duration: 2.5,
      minDuration: 1.5,
      skipOnRepeat: true
    },
    // Custom cursor
    cursor: {
      enabled: true,
      dotSize: 8,
      ringSize: 40,
      hoverRingSize: 60,
      transitionDuration: 0.3
    },
    // Magnetic buttons
    magnetic: {
      strength: 0.3,
      radius: 80
    },
    // Ambient background
    ambient: {
      particleCount: 30,
      maxSpeed: 0.5
    }
  };

  // ==========================================================================
  // STATE
  // ==========================================================================

  let lenis = null;
  let cursor = null;
  let ambientCanvas = null;
  let ambientCtx = null;
  let ambientParticles = [];
  let ambientRAF = null;
  let prefersReducedMotion = false;
  let isTouchDevice = false;

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  // ==========================================================================
  // REDUCED MOTION & DEVICE DETECTION
  // ==========================================================================

  function detectCapabilities() {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        disableAllAnimations();
      }
    });
  }

  function disableAllAnimations() {
    if (lenis) lenis.destroy();
    if (cursor) cursor.destroy();
    if (ambientRAF) cancelAnimationFrame(ambientRAF);
    document.documentElement.style.setProperty('--duration-fast', '0ms');
    document.documentElement.style.setProperty('--duration-normal', '0ms');
    document.documentElement.style.setProperty('--duration-slow', '0ms');
    document.documentElement.style.setProperty('--duration-slower', '0ms');
  }

  // ==========================================================================
  // LENIS SMOOTH SCROLL
  // ==========================================================================

  function initLenis() {
    if (prefersReducedMotion || isTouchDevice || typeof Lenis === 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
      return null;
    }

    lenis = new Lenis(CONFIG.lenis);

    function raf(time) {
      if (lenis) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }

    return lenis;
  }

  function getLenis() {
    return lenis;
  }

  function scrollTo(target, options = {}) {
    if (lenis) {
      lenis.scrollTo(target, options);
    } else {
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', ...options });
      }
    }
  }

  // ==========================================================================
  // GSAP / SCROLLTRIGGER SETUP
  // ==========================================================================

  function initGSAP() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded');
      return false;
    }

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config(CONFIG.scrollTrigger);

      // Refresh on lenis scroll
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
      }
    }

    if (typeof SplitType !== 'undefined') {
      gsap.registerPlugin(SplitType);
    }

    // Global defaults
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.8
    });

    return true;
  }

  // ==========================================================================
  // PRELOADER
  // ==========================================================================

  function initPreloader() {
    if (prefersReducedMotion) return Promise.resolve();

    const hasVisited = CONFIG.preloader.skipOnRepeat && sessionStorage.getItem('sps-preloader-shown');
    if (hasVisited) {
      hidePreloaderImmediate();
      return Promise.resolve();
    }

    const preloader = document.querySelector('.preloader');
    if (!preloader) return Promise.resolve();

    return new Promise((resolve) => {
      const startTime = performance.now();

      // Create preloader content if not exists
      if (!preloader.querySelector('.preloader-content')) {
        preloader.innerHTML = `
          <div class="preloader-content">
            <div class="preloader-waveform" aria-hidden="true">
              <svg viewBox="0 0 400 100" preserveAspectRatio="none">
                <path class="wave-path" d="M0,50 C50,20 100,80 150,50 C200,20 250,80 300,50 C350,20 400,50 400,50" fill="none" stroke="currentColor" stroke-width="2.5"/>
              </svg>
            </div>
            <div class="preloader-text">
              <span class="preloader-percent" data-value="0">0%</span>
            </div>
            <div class="preloader-brand" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="6.5" y1="7" x2="17.5" y2="7" stroke="currentColor" stroke-width="1.5" opacity="0.5"/><line x1="6.5" y1="12" x2="17.5" y2="12" stroke="currentColor" stroke-width="1.5" opacity="0.5"/><line x1="6.5" y1="17" x2="17.5" y2="17" stroke="currentColor" stroke-width="1.5" opacity="0.5"/></svg>
            </div>
          </div>
        `;
      }

      const wavePath = preloader.querySelector('.wave-path');
      const percentEl = preloader.querySelector('.preloader-percent');

      if (!wavePath || !percentEl) {
        hidePreloaderImmediate();
        resolve();
        return;
      }

      const pathLength = wavePath.getTotalLength();
      wavePath.style.strokeDasharray = pathLength;
      wavePath.style.strokeDashoffset = pathLength;

      const tl = gsap.timeline({
        onComplete: () => {
          const elapsed = performance.now() - startTime;
          const remaining = Math.max(0, CONFIG.preloader.minDuration - elapsed);
          setTimeout(() => {
            hidePreloader(preloader).then(resolve);
          }, remaining);
        }
      });

      // Waveform draw
      tl.to(wavePath, {
        strokeDashoffset: 0,
        duration: CONFIG.preloader.duration * 0.6,
        ease: 'power2.inOut'
      });

      // Counter
      tl.to({ value: 0 }, {
        value: 100,
        duration: CONFIG.preloader.duration * 0.8,
        ease: 'power2.out',
        onUpdate: function() {
          percentEl.textContent = Math.round(this.targets()[0].value) + '%';
          percentEl.dataset.value = Math.round(this.targets()[0].value);
        }
      }, '<0.2');

      // Brand fade in
      tl.from('.preloader-brand', {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: 'back.out(1.7)'
      }, '<0.4');

      // Store visited flag
      sessionStorage.setItem('sps-preloader-shown', 'true');
    });
  }

  function hidePreloaderImmediate() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  }

  function hidePreloader(preloader) {
    return new Promise((resolve) => {
      if (!preloader) { resolve(); return; }

      gsap.to(preloader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          resolve();
        }
      });
    });
  }

  // ==========================================================================
  // CUSTOM CURSOR
  // ==========================================================================

  class CustomCursor {
    constructor() {
      if (!CONFIG.cursor.enabled || prefersReducedMotion || isTouchDevice) return;

      this.dot = null;
      this.ring = null;
      this.text = null;
      this.mouseX = 0;
      this.mouseY = 0;
      this.dotX = 0;
      this.dotY = 0;
      this.ringX = 0;
      this.ringY = 0;
      this.isHover = false;
      this.hasText = false;
      this.rafId = null;

      this.init();
    }

    init() {
      // Create cursor elements
      this.cursor = document.createElement('div');
      this.cursor.className = 'custom-cursor';
      this.cursor.innerHTML = `
        <div class="cursor-dot" aria-hidden="true"></div>
        <div class="cursor-ring" aria-hidden="true"></div>
        <span class="cursor-text" aria-hidden="true"></span>
      `;
      document.body.appendChild(this.cursor);

      this.dot = this.cursor.querySelector('.cursor-dot');
      this.ring = this.cursor.querySelector('.cursor-ring');
      this.text = this.cursor.querySelector('.cursor-text');

      // Event listeners
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      document.addEventListener('mouseenter', this.onMouseEnter.bind(this));
      document.addEventListener('mouseleave', this.onMouseLeave.bind(this));

      // Hover detection
      document.addEventListener('mouseover', this.onHover.bind(this), true);
      document.addEventListener('mouseout', this.onHoverOut.bind(this), true);

      // Start animation loop
      this.animate();
    }

    onMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }

    onMouseEnter() {
      this.cursor.style.opacity = '1';
    }

    onMouseLeave() {
      this.cursor.style.opacity = '0';
    }

    onHover(e) {
      const target = e.target.closest('a, button, .btn, .gallery-item, .card--interactive, .highlight-card, .execom-card, [data-cursor-hover]');
      if (target) {
        this.setHover(true);
        if (target.classList.contains('gallery-item') || target.dataset.cursorText) {
          this.setText(target.dataset.cursorText || 'View');
        }
      }
    }

    onHoverOut(e) {
      const target = e.target.closest('a, button, .btn, .gallery-item, .card--interactive, .highlight-card, .execom-card, [data-cursor-hover]');
      if (target) {
        this.setHover(false);
        this.setText('');
      }
    }

    setHover(hover) {
      this.isHover = hover;
      this.cursor.classList.toggle('is-hover', hover);
    }

    setText(text) {
      this.hasText = !!text;
      this.text.textContent = text;
      this.cursor.classList.toggle('has-text', this.hasText);
    }

    animate() {
      // Smooth follow for dot (instant)
      this.dotX = this.mouseX;
      this.dotY = this.mouseY;
      this.dot.style.transform = `translate(${this.dotX}px, ${this.dotY}px) translate(-50%, -50%)`;

      // Spring follow for ring
      this.ringX = lerp(this.ringX, this.mouseX, 0.15);
      this.ringY = lerp(this.ringY, this.mouseY, 0.15);
      this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px) translate(-50%, -50%)`;

      this.rafId = requestAnimationFrame(this.animate.bind(this));
    }

    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      if (this.cursor && this.cursor.parentNode) {
        this.cursor.parentNode.removeChild(this.cursor);
      }
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseenter', this.onMouseEnter);
      document.removeEventListener('mouseleave', this.onMouseLeave);
    }
  }

  function initCursor() {
    if (prefersReducedMotion || isTouchDevice) return null;
    cursor = new CustomCursor();
    return cursor;
  }

  // ==========================================================================
  // MAGNETIC BUTTONS
  // ==========================================================================

  function initMagneticButtons() {
    if (prefersReducedMotion || isTouchDevice) return;

    const magneticButtons = document.querySelectorAll('.btn--magnetic');

    magneticButtons.forEach(btn => {
      let rafId = null;
      let bounds = null;

      const onMouseMove = (e) => {
        if (!bounds) bounds = btn.getBoundingClientRect();

        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        const deltaX = (e.clientX - centerX) * CONFIG.magnetic.strength;
        const deltaY = (e.clientY - centerY) * CONFIG.magnetic.strength;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < CONFIG.magnetic.radius) {
          btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
      };

      const onMouseLeave = () => {
        btn.style.transform = 'translate(0, 0)';
        bounds = null;
      };

      btn.addEventListener('mousemove', onMouseMove);
      btn.addEventListener('mouseleave', onMouseLeave);

      // Cleanup on page transition
      btn._magneticCleanup = () => {
        btn.removeEventListener('mousemove', onMouseMove);
        btn.removeEventListener('mouseleave', onMouseLeave);
      };
    });
  }

  function cleanupMagneticButtons() {
    document.querySelectorAll('.btn--magnetic').forEach(btn => {
      if (btn._magneticCleanup) btn._magneticCleanup();
    });
  }

  // ==========================================================================
  // AMBIENT BACKGROUND (Canvas Particles)
  // ==========================================================================

  class AmbientBackground {
    constructor() {
      if (prefersReducedMotion) return;

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'ambient-canvas';
      this.canvas.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
      `;
      document.body.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.resize();
      this.initParticles();

      window.addEventListener('resize', this.resize.bind(this));
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    initParticles() {
      this.particles = [];
      for (let i = 0; i < CONFIG.ambient.particleCount; i++) {
        this.particles.push({
          x: getRandom(0, this.canvas.width),
          y: getRandom(0, this.canvas.height),
          vx: getRandom(-CONFIG.ambient.maxSpeed, CONFIG.ambient.maxSpeed),
          vy: getRandom(-CONFIG.ambient.maxSpeed, CONFIG.ambient.maxSpeed),
          radius: getRandom(0.5, 2),
          opacity: getRandom(0.1, 0.4),
          phase: getRandom(0, Math.PI * 2)
        });
      }
    }

    animate() {
      const ctx = this.ctx;
      const particles = this.particles;
      const width = this.canvas.width;
      const height = this.canvas.height;

      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.01;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw
        const radius = p.radius + Math.sin(p.phase) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 98, 155, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(0, 98, 155, 0.05)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      this.rafId = requestAnimationFrame(this.animate.bind(this));
    }

    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
      window.removeEventListener('resize', this.resize);
    }

    pause() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    resume() {
      if (!this.rafId) {
        this.animate();
      }
    }
  }

  function initAmbientBackground() {
    if (prefersReducedMotion) return null;

    // Create intersection observer to pause when off-screen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (ambientCanvas) {
          if (entry.isIntersecting) {
            ambientCanvas.resume();
          } else {
            ambientCanvas.pause();
          }
        }
      });
    }, { rootMargin: '100px' });

    // Observe main content sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    ambientCanvas = new AmbientBackground();
    return ambientCanvas;
  }

  // ==========================================================================
  // PARALLAX HELPER
  // ==========================================================================

  function initParallaxLayers() {
    if (prefersReducedMotion) return;

    const layers = document.querySelectorAll('[data-speed]');
    if (!layers.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY || window.pageYOffset;

      layers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed) || 0.1;
        const y = scrollY * speed;
        layer.style.transform = `translate3d(0, ${y}px, 0)`;
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();

    return { destroy: () => window.removeEventListener('scroll', onScroll) };
  }

  // ==========================================================================
  // MOUSE DEPTH EFFECT (Hero)
  // ==========================================================================

  function initMouseDepth(selector, layers) {
    if (prefersReducedMotion || isTouchDevice) return;

    const container = document.querySelector(selector);
    if (!container) return;

    const layerElements = layers.map(sel => container.querySelector(sel)).filter(Boolean);

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      layerElements.forEach((layer, i) => {
        const depth = (i + 1) * 15;
        layer.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
      });
    });

    container.addEventListener('mouseleave', () => {
      layerElements.forEach(layer => {
        layer.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // ==========================================================================
  // PAGE TRANSITION (Enhanced)
  // ==========================================================================

  function initPageTransition() {
    const transitionEl = document.querySelector('.page-transition');
    if (!transitionEl || prefersReducedMotion) return;

    if (transitionEl.classList.contains('is-active')) {
      gsap.to(transitionEl, {
        yPercent: 100,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          transitionEl.classList.remove('is-active');
          gsap.set(transitionEl, { yPercent: -100 });
        }
      });
    } else {
      gsap.set(transitionEl, { yPercent: -100 });
    }
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  async function init() {
    detectCapabilities();

    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduced-motion');
      return;
    }

    // Initialize in order
    initLenis();
    initGSAP();
    initCursor();
    initMagneticButtons();
    initAmbientBackground();
    initParallaxLayers();
    initPageTransition();

    await initPreloader();

    // Trigger hero animation after preloader
    document.dispatchEvent(new CustomEvent('sps:preloader-done'));
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API
  window.SPSMotion = {
    CONFIG,
    lenis: () => lenis,
    scrollTo,
    cursor: () => cursor,
    ambient: () => ambientCanvas,
    prefersReducedMotion: () => prefersReducedMotion,
    isTouchDevice: () => isTouchDevice,
    initParallaxLayers,
    initMouseDepth,
    cleanupMagneticButtons
  };
})();