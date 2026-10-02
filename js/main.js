/**
 * MAIN.JS — Core Site Functionality
 * Navigation, mobile menu, smooth anchors, shared nav/footer injection
 */

(function() {
  'use strict';

  // ==========================================================================
  // SHARED NAV & FOOTER INJECTION
  // ==========================================================================

  function injectNav() {
    const navPlaceholder = document.getElementById('site-nav');
    if (!navPlaceholder || !window.SITE) return;

    const navLinks = window.SITE.navLinks.map(link => {
      const isCurrent = window.location.pathname.endsWith(link.href) ||
                       (link.href === 'index.html' && window.location.pathname.endsWith('/')) ||
                       (link.href === 'index.html#history' && window.location.hash === '#history');
      return `<li><a href="${link.href}" class="nav-link${isCurrent ? ' nav-link--active' : ''}" data-transition="page">${link.label}</a></li>`;
    }).join('');

    navPlaceholder.innerHTML = `
      <nav class="nav-bar" role="navigation" aria-label="Main navigation">
        <a href="index.html" class="nav-logo" aria-label="${window.SITE.name} - Home">
          <span class="nav-logo-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <line x1="6.5" y1="7" x2="17.5" y2="7" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
              <line x1="6.5" y1="12" x2="17.5" y2="12" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
              <line x1="6.5" y1="17" x2="17.5" y2="17" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
            </svg>
          </span>
          <span class="nav-logo-text">IEEE <span>SPS SBC</span></span>
        </a>
        <ul class="nav-links" role="menubar">
          ${navLinks}
        </ul>
        <a href="membership.html" class="btn btn--primary btn--magnetic nav-cta" data-transition="page">Join Us</a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="nav-overlay" aria-label="Toggle menu">
          <span class="nav-toggle-line" aria-hidden="true"></span>
          <span class="nav-toggle-line" aria-hidden="true"></span>
          <span class="nav-toggle-line" aria-hidden="true"></span>
        </button>
      </nav>
      <div class="nav-overlay" id="nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div class="nav-overlay-content">
          <ul class="nav-overlay-links" role="menubar">
            ${window.SITE.navLinks.map(link => `
              <li role="none"><a href="${link.href}" class="nav-overlay-link" role="menuitem" data-transition="page">${link.label}</a></li>
            `).join('')}
          </ul>
          <a href="membership.html" class="btn btn--primary btn--lg nav-overlay-cta" data-transition="page">Join SPS SBC</a>
        </div>
      </div>
    `;
  }

  function injectFooter() {
    const footerPlaceholder = document.getElementById('site-footer');
    if (!footerPlaceholder || !window.SITE) return;

    const { social, address, email, name, seo } = window.SITE;

    footerPlaceholder.innerHTML = `
      <footer class="site-footer" role="contentinfo">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="index.html" class="footer-logo" aria-label="${name} - Home">
                <span class="footer-logo-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    <line x1="6.5" y1="7" x2="17.5" y2="7" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
                    <line x1="6.5" y1="12" x2="17.5" y2="12" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
                    <line x1="6.5" y1="17" x2="17.5" y2="17" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
                  </svg>
                </span>
                <span class="footer-logo-text">IEEE <span>SPS SBC</span></span>
              </a>
              <p class="footer-tagline">${seo.defaultDescription}</p>
              <div class="footer-social" role="list" aria-label="Social media links">
                ${social.linkedin ? `<a href="${social.linkedin}" class="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>` : ''}
                ${social.instagram ? `<a href="${social.instagram}" class="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>` : ''}
                ${social.youtube ? `<a href="${social.youtube}" class="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>` : ''}
              </div>
            </div>

            <div>
              <h4 class="footer-heading">Quick Links</h4>
              <ul class="footer-links" role="list">
                <li><a href="index.html" class="footer-link">Home</a></li>
                <li><a href="index.html#history" class="footer-link">History</a></li>
                <li><a href="events.html" class="footer-link">Events</a></li>
                <li><a href="gallery.html" class="footer-link">Gallery</a></li>
                <li><a href="execom.html" class="footer-link">Execom</a></li>
                <li><a href="membership.html" class="footer-link">Membership</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-heading">IEEE Resources</h4>
              <ul class="footer-links" role="list">
                <li><a href="https://ieeexplore.ieee.org" target="_blank" rel="noopener noreferrer" class="footer-link">IEEE Xplore</a></li>
                <li><a href="https://collabratec.ieee.org" target="_blank" rel="noopener noreferrer" class="footer-link">IEEE Collabratec</a></li>
                <li><a href="https://www.ieee.org/membership/join/dues.html" target="_blank" rel="noopener noreferrer" class="footer-link">Membership Dues Portal</a></li>
                <li><a href="https://signalprocessingsociety.org" target="_blank" rel="noopener noreferrer" class="footer-link">Signal Processing Society</a></li>
                <li><a href="https://ieee.org" target="_blank" rel="noopener noreferrer" class="footer-link">IEEE Global</a></li>
              </ul>
            </div>

            <div>
              <h4 class="footer-heading">Contact</h4>
              <ul class="footer-contact" role="list">
                <li class="footer-contact-item">
                  <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <address class="footer-contact-text" style="font-style: normal;">${address.line1}<br>${address.line2}<br>${address.line3}</address>
                </li>
                <li class="footer-contact-item">
                  <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <a href="mailto:${email}" class="footer-contact-text">${email}</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <p class="footer-copyright">&copy; ${new Date().getFullYear()} ${name}. All rights reserved.</p>
            <nav class="footer-legal" aria-label="Legal links">
              <a href="#" class="footer-legal-link">Privacy Policy</a>
              <a href="#" class="footer-legal-link">Terms of Use</a>
            </nav>
          </div>
        </div>
      </footer>
    `;
  }

  // ==========================================================================
  // MOBILE MENU TOGGLE
  // ==========================================================================

  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const overlay = document.getElementById('nav-overlay');
    const overlayLinks = document.querySelectorAll('.nav-overlay-link');

    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isOpen);
      overlay.classList.toggle('is-open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    overlayLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // ==========================================================================
  // NAV SCROLL STATE (solid/transparent)
  // ==========================================================================

  let lastScrollY = 0;
  let ticking = false;

  function updateNavScroll() {
    const nav = document.querySelector('.nav-bar');
    if (!nav) return;

    const scrollY = window.scrollY || window.pageYOffset;

    // Solid background after 60px scroll
    if (scrollY > 60) {
      nav.classList.add('nav--solid');
    } else {
      nav.classList.remove('nav--solid');
    }

    // Hide on scroll down, show on scroll up
    if (scrollY > lastScrollY && scrollY > 200) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateNavScroll);
      ticking = true;
    }
  }

  // ==========================================================================
  // SMOOTH ANCHOR SCROLLING
  // ==========================================================================

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.nav-bar')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without scroll
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  // ==========================================================================
  // PAGE TRANSITION HANDLING
  // ==========================================================================

  function initPageTransitions() {
    const transitionEl = document.querySelector('.page-transition');
    if (!transitionEl) return;

    // Handle internal links with data-transition="page"
    document.querySelectorAll('a[data-transition="page"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || this.target === '_blank') return;

        e.preventDefault();

        // Start transition
        transitionEl.classList.add('is-active');

        // Navigate after wipe in
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    });

    // Wipe out on page load
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        transitionEl.classList.remove('is-active');
      } else {
        transitionEl.classList.remove('is-active');
      }
    });
  }

  // ==========================================================================
  // SCROLL PROGRESS BAR
  // ==========================================================================

  function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  function init() {
    // Remove no-js class for CSS fallbacks
    document.documentElement.classList.remove('no-js');

    // Inject shared components
    injectNav();
    injectFooter();

    // Initialize modules
    initMobileMenu();
    initSmoothAnchors();
    initPageTransitions();
    initScrollProgress();

    // Nav scroll listener (will be enhanced by motion.js if Lenis is used)
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for other scripts
  window.SPSMain = {
    injectNav,
    injectFooter,
    initMobileMenu,
    initSmoothAnchors
  };
})();