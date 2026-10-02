/**
 * HERO.JS — Hero Section Animations
 * GSAP intro timeline, SVG background layers, parallax, mouse depth,
 * circuit trace pulse, shooting stars, scroll cue
 */

(function() {
  'use strict';

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================

  const CONFIG = {
    timeline: {
      cardScale: { duration: 1, ease: 'power3.out' },
      navDrop: { duration: 0.8, ease: 'power3.out', delay: 0.2 },
      badge: { duration: 0.8, ease: 'power3.out', delay: 0.4 },
      headline: { duration: 1, ease: 'power3.out', stagger: 0.06, delay: 0.6 },
      subtext: { duration: 0.8, ease: 'power3.out', delay: 1.2 },
      cta: { duration: 0.8, ease: 'power3.out', delay: 1.4 },
      scrollCue: { duration: 0.8, ease: 'power3.out', delay: 1.8 }
    },
    parallax: {
      layers: [
        { selector: '.wave-layer--far', speed: 0.15 },
        { selector: '.wave-layer--mid', speed: 0.3 },
        { selector: '.circuit-layer', speed: 0.25 },
        { selector: '.pulse-layer', speed: 0.5 }
      ]
    },
    mouseDepth: {
      maxOffset: 30,
      layers: ['.wave-layer--far', '.wave-layer--mid', '.circuit-layer', '.pulse-layer']
    },
    shootingStars: {
      count: 5,
      interval: { min: 3000, max: 8000 }
    }
  };

  // ==========================================================================
  // STATE
  // ==========================================================================

  let heroTimeline = null;
  let parallaxRAF = null;
  let shootingStarInterval = null;
  let prefersReducedMotion = false;
  let isInitialized = false;

  // ==========================================================================
  // SVG BACKGROUND GENERATION
  // ==========================================================================

  function generateWavePath(amplitude, frequency, points, width, height) {
    let path = `M 0 ${height / 2}`;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y = height / 2 + Math.sin((i / points) * frequency * Math.PI * 2) * amplitude;
      path += ` Q ${x - 20} ${y} ${x} ${y}`;
    }
    path += ` L ${width} ${height} L 0 ${height} Z`;
    return path;
  }

  function generateCircuitPath(width, height) {
    const paths = [];
    const rows = 4;
    const cols = 8;

    for (let r = 0; r < rows; r++) {
      const y = (height / (rows + 1)) * (r + 1);
      let path = `M 0 ${y}`;

      for (let c = 0; c <= cols; c++) {
        const x = (c / cols) * width;
        const variance = (Math.random() - 0.5) * 30;
        const cy = y + variance;

        if (c % 2 === 0) {
          path += ` L ${x} ${cy}`;
        } else {
          path += ` Q ${x - width / cols / 2} ${cy} ${x} ${cy}`;
        }
      }

      paths.push(path);
    }

    // Vertical connections
    for (let c = 1; c < cols; c += 2) {
      const x = (c / cols) * width;
      const y1 = (height / (rows + 1)) * 1;
      const y2 = (height / (rows + 1)) * rows;
      paths.push(`M ${x} ${y1} L ${x} ${y2}`);
    }

    return paths.join(' ');
  }

  function createHeroBackground() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    const width = 1440; // Base width for SVG viewBox
    const height = 900; // Base height

    // Wave layers (hills)
    const farWave = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    farWave.className = 'hero-bg-layer wave-layer wave-layer--far';
    farWave.setAttribute('viewBox', `0 0 ${width} ${height}`);
    farWave.setAttribute('data-speed', '0.15');
    farWave.innerHTML = `
      <defs>
        <linearGradient id="wave-far" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#00629B" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#004066" stop-opacity="0.05"/>
        </linearGradient>
      </defs>
      <path class="wave-path" d="${generateWavePath(80, 1.5, 8, width, height)}" fill="url(#wave-far)"/>
    `;

    const midWave = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    midWave.className = 'hero-bg-layer wave-layer wave-layer--mid';
    midWave.setAttribute('viewBox', `0 0 ${width} ${height}`);
    midWave.setAttribute('data-speed', '0.3');
    midWave.innerHTML = `
      <defs>
        <linearGradient id="wave-mid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0088CC" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#00629B" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <path class="wave-path" d="${generateWavePath(120, 2, 10, width, height)}" fill="url(#wave-mid)"/>
    `;

    // Circuit traces
    const circuitLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    circuitLayer.className = 'hero-bg-layer circuit-layer';
    circuitLayer.setAttribute('viewBox', `0 0 ${width} ${height}`);
    circuitLayer.setAttribute('data-speed', '0.25');
    circuitLayer.innerHTML = `
      <defs>
        <style>
          .circuit-path { stroke: #00629B; stroke-opacity: 0.15; stroke-width: 1.5; fill: none; animation: circuit-pulse 4s ease-in-out infinite; }
        </style>
      </defs>
      <g class="circuit-paths">
        ${generateCircuitPath(width, height).split(' ').map(p => `<path class="circuit-path" d="${p}"/>`).join('')}
      </g>
    `;

    // Shooting stars / pulse lines
    const pulseLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pulseLayer.className = 'hero-bg-layer pulse-layer';
    pulseLayer.setAttribute('viewBox', `0 0 ${width} ${height}`);
    pulseLayer.setAttribute('data-speed', '0.5');
    pulseLayer.innerHTML = `
      <defs>
        <style>
          .pulse-line { stroke: #FFB800; stroke-opacity: 0.6; stroke-width: 2; fill: none; stroke-linecap: round; animation: shooting-star 6s ease-in-out infinite; }
        </style>
      </defs>
      <g class="pulse-lines"></g>
    `;

    // Clear and append
    heroBg.innerHTML = '';
    heroBg.appendChild(farWave);
    heroBg.appendChild(midWave);
    heroBg.appendChild(circuitLayer);
    heroBg.appendChild(pulseLayer);

    // Create shooting stars dynamically
    createShootingStars(pulseLayer, width, height);

    // Initialize interactive live signal canvas
    initHeroCanvasVisualizer();
  }

  function createShootingStars(container, width, height) {
    const linesGroup = container.querySelector('.pulse-lines');
    if (!linesGroup) return;

    for (let i = 0; i < CONFIG.shootingStars.count; i++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const x1 = Math.random() * width * 0.3;
      const y1 = Math.random() * height * 0.6;
      const length = 100 + Math.random() * 200;
      const angle = -0.3 - Math.random() * 0.4; // Upward angle
      const x2 = x1 + Math.cos(angle) * length;
      const y2 = y1 + Math.sin(angle) * length;
      const delay = Math.random() * 6;
      const duration = 4 + Math.random() * 4;

      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.classList.add('pulse-line');
      line.style.animationDelay = `${delay}s`;
      line.style.animationDuration = `${duration}s`;

      linesGroup.appendChild(line);
    }
  }

  function initHeroCanvasVisualizer() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    let canvas = heroBg.querySelector('#hero-signal-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'hero-signal-canvas';
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '1';
      heroBg.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = 0;

    function resize() {
      width = canvas.width = heroBg.clientWidth;
      height = canvas.height = heroBg.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
      const rect = heroBg.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
    });

    let phase = 0;
    const numBars = 36;
    const numNodes = 20;
    const nodes = [];

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * (width || 1000),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Sine Signal Wave 1 (Cyan)
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.45)';
      for (let x = 0; x <= width; x += 6) {
        const waveMouse = Math.sin((x + mouseX * 0.2) * 0.008) * 15;
        const y = height * 0.5 + Math.sin(x * 0.008 + phase) * 45 + Math.cos(x * 0.015 - phase * 0.5) * 20 + waveMouse;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Draw Sine Signal Wave 2 (Gold)
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 184, 0, 0.4)';
      for (let x = 0; x <= width; x += 6) {
        const y = height * 0.55 + Math.sin(x * 0.012 - phase * 1.2) * 35 + Math.sin(x * 0.005 + phase * 0.8) * 25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. Draw Spectrum Bars at Bottom
      const barWidth = width / numBars;
      for (let i = 0; i < numBars; i++) {
        const barHeight = Math.abs(Math.sin(phase * 2 + i * 0.3)) * 55 + Math.abs(Math.cos(i * 0.5)) * 25;
        const x = i * barWidth;
        const y = height - barHeight;

        const grad = ctx.createLinearGradient(0, height, 0, y);
        grad.addColorStop(0, 'rgba(0, 210, 255, 0.02)');
        grad.addColorStop(1, 'rgba(0, 210, 255, 0.3)');

        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      }

      // 4. Draw Vector Nodes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 210, 255, 0.7)';
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(0, 210, 255, ${0.25 * (1 - dist / 130)})`;
            ctx.stroke();
          }
        }
      }

      phase += 0.02;
      requestAnimationFrame(render);
    }

    render();
  }

  // ==========================================================================
  // HERO TIMELINE (GSAP)
  // ==========================================================================

  function playHeroTimeline() {
    if (typeof gsap === 'undefined') {
      // CSS fallback - just add visible classes
      document.querySelectorAll('.hero-badge, .hero-headline .line, .hero-subtext, .hero-cta .btn, .scroll-cue')
        .forEach(el => el.classList.add('is-visible'));
      return;
    }

    const heroCard = document.querySelector('.hero-card');
    const navBar = document.querySelector('.nav-bar');
    const badge = document.querySelector('.hero-badge');
    const headlineLines = document.querySelectorAll('.hero-headline .line');
    const subtext = document.querySelector('.hero-subtext');
    const cta = document.querySelector('.hero-cta .btn');
    const scrollCue = document.querySelector('.scroll-cue');

    if (!heroCard) return;

    // Kill existing timeline
    if (heroTimeline) heroTimeline.kill();

    heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Card scale in
    heroTimeline.fromTo(heroCard,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: CONFIG.timeline.cardScale.duration, ease: CONFIG.timeline.cardScale.ease }
    );

    // 2. Nav drop
    if (navBar) {
      heroTimeline.fromTo(navBar,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: CONFIG.timeline.navDrop.duration, ease: CONFIG.timeline.navDrop.ease },
        CONFIG.timeline.navDrop.delay
      );
    }

    // 3. Badge
    if (badge) {
      heroTimeline.fromTo(badge,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: CONFIG.timeline.badge.duration, ease: CONFIG.timeline.badge.ease },
        CONFIG.timeline.badge.delay
      );
    }

    // 4. Headline lines (split by chars for GSAP)
    if (headlineLines.length && typeof SplitType !== 'undefined') {
      headlineLines.forEach((line, i) => {
        // Split if not already split
        if (!line.querySelector('.char')) {
          new SplitType(line, { types: 'chars', tag: 'span', charClass: 'char' });
        }
        const chars = line.querySelectorAll('.char');
        chars.forEach(c => { c.style.opacity = 0; c.style.transform = 'translateY(100%)'; });

        heroTimeline.fromTo(chars,
          { y: '100%', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: 'power3.out' },
          CONFIG.timeline.headline.delay + i * 0.3
        );
      });
    } else if (headlineLines.length) {
      // CSS fallback
      headlineLines.forEach((line, i) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(30px)';
        line.style.transition = `all ${CONFIG.timeline.headline.duration}s ${CONFIG.timeline.headline.ease}`;
        setTimeout(() => {
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        }, (CONFIG.timeline.headline.delay + i * 0.3) * 1000);
      });
    }

    // 5. Subtext
    if (subtext) {
      heroTimeline.fromTo(subtext,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: CONFIG.timeline.subtext.duration, ease: CONFIG.timeline.subtext.ease },
        CONFIG.timeline.subtext.delay
      );
    }

    // 6. CTA
    if (cta) {
      heroTimeline.fromTo(cta,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: CONFIG.timeline.cta.duration, ease: CONFIG.timeline.cta.ease },
        CONFIG.timeline.cta.delay
      );
    }

    // 7. Scroll cue
    if (scrollCue) {
      heroTimeline.fromTo(scrollCue,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: CONFIG.timeline.scrollCue.duration, ease: CONFIG.timeline.scrollCue.ease },
        CONFIG.timeline.scrollCue.delay
      );
    }
  }

  // ==========================================================================
  // PARALLAX SCROLL
  // ==========================================================================

  function initParallax() {
    if (prefersReducedMotion) return;

    const layers = CONFIG.parallax.layers.map(l => ({
      el: document.querySelector(l.selector),
      speed: l.speed
    })).filter(l => l.el);

    if (!layers.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY || window.pageYOffset;

      layers.forEach(layer => {
        const y = scrollY * layer.speed;
        layer.el.style.transform = `translate3d(0, ${y}px, 0)`;
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

    parallaxRAF = { destroy: () => window.removeEventListener('scroll', onScroll) };
  }

  // ==========================================================================
  // MOUSE DEPTH EFFECT
  // ==========================================================================

  function initMouseDepth() {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

    const heroCard = document.querySelector('.hero-card');
    if (!heroCard) return;

    const layers = CONFIG.mouseDepth.layers.map(sel => heroCard.querySelector(sel)).filter(Boolean);
    if (!layers.length) return;

    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      layers.forEach((layer, i) => {
        const depth = (i + 1) * (CONFIG.mouseDepth.maxOffset / layers.length);
        const tx = x * depth;
        const ty = y * depth;
        const currentTransform = layer.style.transform;
        // Preserve existing parallax transform
        const parallaxMatch = currentTransform.match(/translate3d\(0,\s*([-\d.]+)px,\s*0\)/);
        const parallaxY = parallaxMatch ? parseFloat(parallaxMatch[1]) : 0;
        layer.style.transform = `translate3d(${tx}px, ${parallaxY + ty}px, 0)`;
      });
    });

    heroCard.addEventListener('mouseleave', () => {
      layers.forEach((layer, i) => {
        const currentTransform = layer.style.transform;
        const parallaxMatch = currentTransform.match(/translate3d\(0,\s*([-\d.]+)px,\s*0\)/);
        const parallaxY = parallaxMatch ? parseFloat(parallaxMatch[1]) : 0;
        layer.style.transform = `translate3d(0, ${parallaxY}px, 0)`;
      });
    });
  }

  // ==========================================================================
  // SCROLL CUE FADE
  // ==========================================================================

  function initScrollCue() {
    const scrollCue = document.querySelector('.scroll-cue');
    if (!scrollCue) return;

    let hasScrolled = false;

    function onScroll() {
      if (!hasScrolled && (window.scrollY || window.pageYOffset) > 100) {
        hasScrolled = true;
        scrollCue.classList.add('hidden');
        window.removeEventListener('scroll', onScroll);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ==========================================================================
  // HERO ENTRANCE TRIGGER
  // ==========================================================================

  function onPreloaderDone() {
    if (isInitialized) return;
    isInitialized = true;

    createHeroBackground();
    playHeroTimeline();
    initParallax();
    initMouseDepth();
    initScrollCue();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  function init() {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Show everything immediately
      document.querySelectorAll('.hero-badge, .hero-headline .line, .hero-subtext, .hero-cta .btn, .scroll-cue')
        .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      createHeroBackground(); // Still create background, just no animation
      return;
    }

    // Wait for preloader to finish
    document.addEventListener('sps:preloader-done', onPreloaderDone);

    // Fallback if preloader doesn't fire (e.g., on sub-pages)
    if (!document.querySelector('.preloader') || document.querySelector('.preloader').style.display === 'none') {
      setTimeout(onPreloaderDone, 100);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize on page transition
  document.addEventListener('sps:page-transition-complete', () => {
    isInitialized = false;
    init();
  });

  // Expose API
  window.SPSHero = {
    CONFIG,
    playHeroTimeline,
    initParallax,
    initMouseDepth,
    createHeroBackground,
    createShootingStars
  };
})();