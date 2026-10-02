/**
 * EVENTS.JS — Event Filter Handling
 * Manages category filtering for past and upcoming events
 */

(function() {
  'use strict';

  function initEventsFilter() {
    const filterContainer = document.getElementById('event-filters');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      const type = btn.getAttribute('data-type');
      
      // Update active button
      filterContainer.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('btn--primary');
        b.classList.add('btn--secondary');
      });
      btn.classList.remove('btn--secondary');
      btn.classList.add('btn--primary');

      // Filter event cards
      const cards = document.querySelectorAll('#past-grid .event-card');
      cards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        if (type === 'All' || cardType === type) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventsFilter);
  } else {
    initEventsFilter();
  }
})();
