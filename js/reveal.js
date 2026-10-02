/**
 * REVEAL.JS — Reusable Reveal Helpers
 * IntersectionObserver reveals, text splitting, counters, line drawing, marquee
 */

(function() {
  'use strict';

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================

  const CONFIG = {
    reveal: {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      staggerDelay: 120
    },
    counter: {
      duration: 2,
      ease: 'power3.out'
    },
    marquee: {
      speed: 50, // px per second
      pauseOnHover: true
    }
  };

  // ==========================================================================
  // INTERSECTION OBSERVER REVEALS
  // ==========================================================================

  let revealObserver = null;

  function initReveals(options = {}) {
    const opts = { ...CONFIG.reveal, ...options };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show all immediately
      document.querySelectorAll('.reveal, .reveal-sm, .reveal-lg, .reveal-left, .reveal-right, .reveal-scale, .clip-reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.clipPath = 'none';
      });
      document.querySelectorAll('.split-reveal > *').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // Cleanup existing observer
    if (revealObserver) revealObserver.disconnect();

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Handle stagger
          if (el.classList.contains('reveal--stagger')) {
            const staggerIndex = parseInt(el.style.getPropertyValue('--i') || '0', 10);
            el.style.transitionDelay = `${staggerIndex * opts.staggerDelay}ms`;
          }

          // Add visible class for CSS animations
          el.classList.add('is-visible');

          // Special handling for split-reveal
          if (el.classList.contains('split-reveal')) {
            el.classList.add('is-visible');
          }

          // Unobserve after reveal
          revealObserver.unobserve(el);
        }
      });
    }, {
      threshold: opts.threshold,
      rootMargin: opts.rootMargin
    });

    // Observe all reveal elements
    const revealSelectors = [
      '.reveal', '.reveal-sm', '.reveal-lg',
      '.reveal-left', '.reveal-right', '.reveal-scale',
      '.clip-reveal', '.split-reveal'
    ];

    revealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        revealObserver.observe(el);
      });
    });

    return revealObserver;
  }

  // ==========================================================================
  // TEXT SPLITTING (Lightweight alternative to SplitType)
  // ==========================================================================

  function splitText(element, options = {}) {
    const opts = {
      type: 'lines', // 'lines' | 'words' | 'chars'
      tag: 'span',
      className: 'split-part',
      ...options
    };

    if (!element) return null;

    const text = element.textContent;
    element.textContent = '';
    element.style.display = 'inline-block';

    let parts = [];

    switch (opts.type) {
      case 'lines':
        // Simple line splitting by measuring
        parts = splitIntoLines(element, text, opts);
        break;
      case 'words':
        parts = text.split(/(\s+)/).filter(s => s.length > 0);
        break;
      case 'chars':
        parts = text.split('');
        break;
    }

    const wrappers = parts.map((part, i) => {
      const wrapper = document.createElement(opts.tag);
      wrapper.className = `${opts.className} split-${opts.type}`;
      wrapper.style.display = opts.type === 'chars' ? 'inline-block' : 'inline';
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(100%)';
      wrapper.textContent = part;
      wrapper.dataset.index = i;
      element.appendChild(wrapper);
      return wrapper;
    });

    // Add container class for GSAP targeting
    element.classList.add('split-reveal');
    element.dataset.splitType = opts.type;

    return {
      element,
      parts: wrappers,
      type: opts.type,
      revert: () => {
        element.textContent = text;
        element.classList.remove('split-reveal');
        delete element.dataset.splitType;
      }
    };
  }

  function splitIntoLines(element, text, opts) {
    // Create a temporary clone to measure
    const clone = element.cloneNode(false);
    clone.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: nowrap;
      width: auto;
      font: ${window.getComputedStyle(element).font};
      letter-spacing: ${window.getComputedStyle(element).letterSpacing};
    `;
    clone.textContent = text;
    document.body.appendChild(clone);

    const singleLineWidth = clone.offsetWidth;
    document.body.removeChild(clone);

    const containerWidth = element.offsetWidth;
    if (containerWidth >= singleLineWidth || containerWidth === 0) {
      return [text]; // Single line
    }

    // Split by words and reconstruct lines
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach((word, i) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      clone.textContent = testLine;
      document.body.appendChild(clone);

      if (clone.offsetWidth > containerWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }

      document.body.removeChild(clone);
    });

    if (currentLine) lines.push(currentLine);

    return lines.length > 0 ? lines : [text];
  }

  // ==========================================================================
  // GSAP-ENHANCED SPLIT TEXT (if GSAP/SplitType available)
  // ==========================================================================

  function splitTextGSAP(element, options = {}) {
    if (typeof gsap === 'undefined' || typeof SplitType === 'undefined') {
      return splitText(element, options);
    }

    const opts = {
      type: 'lines,words,chars',
      tag: 'span',
      ...options
    };

    const split = new SplitType(element, opts);

    // Add animation classes
    element.classList.add('split-reveal');
    element.querySelectorAll('.char, .word, .line').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(100%)';
    });

    return split;
  }

  // ==========================================================================
  // ANIMATE SPLIT TEXT
  // ==========================================================================

  function animateSplitText(element, options = {}) {
    if (typeof gsap === 'undefined') {
      // CSS fallback
      element.classList.add('is-visible');
      return Promise.resolve();
    }

    const opts = {
      duration: 0.8,
      stagger: 0.03,
      ease: 'power3.out',
      delay: 0,
      ...options
    };

    const chars = element.querySelectorAll('.char, .word, .line, .split-char, .split-word, .split-line');

    return gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: opts.duration,
      stagger: opts.stagger,
      ease: opts.ease,
      delay: opts.delay
    });
  }

  // ==========================================================================
  // COUNTER ANIMATION
  // ==========================================================================

  let counterObservers = [];

  function initCounters(selector = '.counter, [data-counter]', options = {}) {
    const opts = { ...CONFIG.counter, ...options };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(selector).forEach(el => {
        const target = parseFloat(el.dataset.counter || el.textContent.replace(/[^\d.-]/g, '')) || 0;
        el.textContent = formatNumber(target);
      });
      return;
    }

    // Cleanup existing observers
    counterObservers.forEach(obs => obs.disconnect());
    counterObservers = [];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.counter || el.textContent.replace(/[^\d.-]/g, '')) || 0;
          const suffix = el.dataset.counterSuffix || '';
          const prefix = el.dataset.counterPrefix || '';
          const decimals = parseInt(el.dataset.counterDecimals || '0', 10);

          animateCounter(el, target, { prefix, suffix, decimals, ...opts });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5, rootMargin: '0px' });

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
    counterObservers.push(observer);

    return observer;
  }

  function animateCounter(element, target, options = {}) {
    const opts = { ...CONFIG.counter, ...options };

    if (typeof gsap !== 'undefined') {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration: opts.duration,
        ease: opts.ease,
        onUpdate: () => {
          element.textContent = `${opts.prefix}${formatNumber(obj.value, options.decimals)}${opts.suffix}`;
        }
      });
    } else {
      // CSS fallback - just set final value
      element.textContent = `${opts.prefix}${formatNumber(target, options.decimals)}${opts.suffix}`;
    }
  }

  function formatNumber(num, decimals = 0) {
    if (decimals > 0) {
      return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return Math.round(num).toLocaleString();
  }

  // ==========================================================================
  // LINE DRAWING (SVG Paths)
  // ==========================================================================

  function initLineDraw(selector = '.draw-line, [data-draw-line]', options = {}) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(selector).forEach(el => {
        if (el.tagName === 'path') {
          el.style.strokeDashoffset = '0';
        }
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          drawLine(el);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px' });

    document.querySelectorAll(selector).forEach(el => {
      prepareLine(el);
      observer.observe(el);
    });

    return observer;
  }

  function prepareLine(element) {
    if (element.tagName === 'path') {
      const length = element.getTotalLength();
      element.style.strokeDasharray = length;
      element.style.strokeDashoffset = length;
      element.dataset.pathLength = length;
    } else if (element.tagName === 'svg') {
      // Find all paths inside
      element.querySelectorAll('path').forEach(path => prepareLine(path));
    }
  }

  function drawLine(element, options = {}) {
    const opts = {
      duration: 1.5,
      ease: 'power2.inOut',
      ...options
    };

    if (element.tagName === 'path') {
      const length = parseFloat(element.dataset.pathLength) || element.getTotalLength();

      if (typeof gsap !== 'undefined') {
        gsap.to(element, {
          strokeDashoffset: 0,
          duration: opts.duration,
          ease: opts.ease
        });
      } else {
        element.style.transition = `stroke-dashoffset ${opts.duration}ms ${opts.ease}`;
        element.style.strokeDashoffset = '0';
      }
    } else if (element.tagName === 'svg') {
      element.querySelectorAll('path').forEach((path, i) => {
        setTimeout(() => drawLine(path, opts), i * 100);
      });
    }
  }

  // ==========================================================================
  // MARQUEE
  // ==========================================================================

  function initMarquee(selector = '.marquee', options = {}) {
    const opts = { ...CONFIG.marquee, ...options };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(selector).forEach(el => {
        el.style.animation = 'none';
      });
      return;
    }

    document.querySelectorAll(selector).forEach(marquee => {
      // Clone content for seamless loop
      const content = marquee.innerHTML;
      marquee.innerHTML = content + content;

      // Set animation duration based on width
      const width = marquee.scrollWidth / 2; // Half because we duplicated
      const duration = width / opts.speed;

      marquee.style.animationDuration = `${duration}s`;

      if (opts.pauseOnHover) {
        marquee.addEventListener('mouseenter', () => {
          marquee.style.animationPlayState = 'paused';
        });
        marquee.addEventListener('mouseleave', () => {
          marquee.style.animationPlayState = 'running';
        });
      }
    });
  }

  // ==========================================================================
  // SCROLL-TRIGGERED ANIMATIONS (GSAP)
  // ==========================================================================

  function initScrollReveals(selector = '.gsap-reveal', options = {}) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback to IntersectionObserver
      return initReveals(options);
    }

    const opts = {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrub: false,
      ...options
    };

    const elements = gsap.utils.toArray(selector);

    elements.forEach((el, i) => {
      const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : i * (opts.stagger || 0);

      if (opts.scrub) {
        // Scrubbed animation
        gsap.fromTo(el,
          { y: opts.y, opacity: opts.opacity },
          {
            y: 0,
            opacity: 1,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'bottom 20%',
              scrub: opts.scrub === true ? 1 : opts.scrub
            }
          }
        );
      } else {
        // One-time animation
        gsap.fromTo(el,
          { y: opts.y, opacity: opts.opacity },
          {
            y: 0,
            opacity: 1,
            duration: opts.duration,
            ease: opts.ease,
            delay: delay,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });
  }

  // ==========================================================================
  // PINNED SECTION HELPER
  // ==========================================================================

  function createPinnedSection(trigger, options = {}) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return null;

    const opts = {
      pin: true,
      pinSpacing: true,
      scrub: 1,
      start: 'top top',
      end: '+=200%',
      ...options
    };

    return ScrollTrigger.create({
      trigger,
      ...opts
    });
  }

  // ==========================================================================
  // TIMELINE ANIMATION (for history section)
  // ==========================================================================

  function initTimelineAnimation(timelineSelector = '.timeline', options = {}) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // CSS fallback
      document.querySelector(timelineSelector)?.classList.add('is-visible');
      document.querySelectorAll('.timeline-item').forEach(item => item.classList.add('is-active'));
      return;
    }

    const timeline = document.querySelector(timelineSelector);
    if (!timeline) return;

    const items = timeline.querySelectorAll('.timeline-item');
    const line = timeline.querySelector('::before') || timeline;

    // Animate line drawing
    gsap.fromTo(timeline,
      { '--line-progress': 0 },
      {
        '--line-progress': 1,
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
          onUpdate: (self) => {
            timeline.style.setProperty('--line-progress', self.progress);
          }
        }
      }
    );

    // Animate items
    items.forEach((item, i) => {
      const marker = item.querySelector('.timeline-marker');
      const content = item.querySelector('.timeline-content');

      gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })
        .to(marker, {
          scale: 1.2,
          backgroundColor: 'var(--color-primary)',
          borderColor: 'var(--color-primary)',
          boxShadow: '0 0 0 4px rgba(0, 98, 155, 0.2)',
          duration: 0.3
        })
        .to(content, { opacity: 1, duration: 0.3 }, '<');
    });
  }

  // ==========================================================================
  // INITIALIZATION HELPER
  // ==========================================================================

  function initAll(options = {}) {
    initReveals(options.reveal);
    initCounters(options.counterSelector, options.counter);
    initLineDraw(options.lineDrawSelector, options.lineDraw);
    initMarquee(options.marqueeSelector, options.marquee);
    initScrollReveals(options.scrollRevealSelector, options.scrollReveal);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAll());
  } else {
    initAll();
  }

  // Re-initialize on page transition
  document.addEventListener('sps:page-transition-complete', () => {
    initAll();
  });

  // Expose API
  window.SPSReveal = {
    CONFIG,
    initReveals,
    splitText,
    splitTextGSAP,
    animateSplitText,
    initCounters,
    animateCounter,
    initLineDraw,
    drawLine,
    initMarquee,
    initScrollReveals,
    createPinnedSection,
    initTimelineAnimation,
    initAll
  };
})();