/**
 * GALLERY.JS — Image Gallery & Lightbox Controller
 */

(function() {
  'use strict';

  let currentIndex = 0;
  let currentFilteredList = [];

  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    const filters = document.getElementById('gallery-filters');
    if (!grid || !window.GALLERY) return;

    currentFilteredList = [...window.GALLERY];

    // Render Filters
    if (filters) {
      const tags = ['All', ...new Set(window.GALLERY.map(g => g.eventTag).filter(Boolean))];
      filters.innerHTML = tags.map((tag, idx) => `
        <button class="btn btn--sm ${idx === 0 ? 'btn--primary' : 'btn--secondary'} filter-btn" data-tag="${tag}">
          ${tag.replace(/-/g, ' ').toUpperCase()}
        </button>
      `).join('');

      filters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        const tag = btn.getAttribute('data-tag');
        filters.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('btn--primary');
          b.classList.add('btn--secondary');
        });
        btn.classList.remove('btn--secondary');
        btn.classList.add('btn--primary');

        if (tag === 'All') {
          currentFilteredList = [...window.GALLERY];
        } else {
          currentFilteredList = window.GALLERY.filter(g => g.eventTag === tag);
        }

        renderGridItems();
      });
    }

    renderGridItems();
    initLightbox();
  }

  function renderGridItems() {
    const grid = document.getElementById('gallery-grid');
    const emptyState = document.getElementById('gallery-empty');
    if (!grid) return;

    if (currentFilteredList.length === 0) {
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';

    grid.innerHTML = currentFilteredList.map((item, idx) => `
      <div class="card gallery-item reveal" style="--i: ${idx}; cursor: pointer; overflow: hidden;" data-index="${idx}">
        <img src="${item.src}" alt="${item.alt}" style="width: 100%; height: 240px; object-fit: cover; transition: transform var(--duration-normal) var(--ease-out);" loading="lazy">
        <div style="padding: var(--space-3); font-size: var(--text-xs); color: var(--color-muted); font-family: var(--font-mono);">${item.caption}</div>
      </div>
    `).join('');

    grid.querySelectorAll('.gallery-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        openLightbox(idx);
      });
    });
  }

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav.next');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    if (!lightbox || !img) return;

    currentIndex = index;
    const item = currentFilteredList[currentIndex];
    if (!item) return;

    img.src = item.src;
    img.alt = item.alt;
    if (caption) caption.textContent = item.caption;

    lightbox.classList.add('is-open');
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('is-open');
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    if (currentFilteredList.length === 0) return;
    currentIndex = (currentIndex + dir + currentFilteredList.length) % currentFilteredList.length;
    openLightbox(currentIndex);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGallery);
  } else {
    renderGallery();
  }
})();
