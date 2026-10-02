/**
 * RENDER.JS — Dynamic Content Rendering Engine
 * Renders home sections, history, events, execom, membership, and stats
 */

(function() {
  'use strict';

  // ==========================================================================
  // HOME PAGE RENDERERS
  // ==========================================================================

  function renderParentHistory() {
    const container = document.getElementById('parent-branch-history');
    if (!container || !window.HISTORY || !window.HISTORY.parentBranch) return;

    const pb = window.HISTORY.parentBranch;
    container.innerHTML = `
      <div class="card p-6 reveal">
        <h3 class="text-2xl font-bold mb-4" style="color: var(--color-accent);">${pb.name}</h3>
        <p class="muted mb-4">Founded on ${pb.founded} with ${pb.initialMembers} student members. Currently home to ${pb.currentMembers}+ active members across five chapters.</p>
        <div class="space-y-3">
          ${pb.description.map(para => `<p style="line-height: var(--line-height-relaxed);">${para}</p>`).join('')}
        </div>
      </div>
      <div class="card p-6 reveal" style="--i: 1">
        <h4 class="text-xl font-semibold mb-4" style="color: var(--color-primary-light);">Leadership & Guidance</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-4);">
          <li style="display: flex; gap: var(--space-3); align-items: flex-start;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); margin-top: 8px; flex-shrink: 0;"></div>
            <div>
              <strong>Inaugurated By:</strong> ${pb.inauguratedBy}
            </div>
          </li>
          <li style="display: flex; gap: var(--space-3); align-items: flex-start;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); margin-top: 8px; flex-shrink: 0;"></div>
            <div>
              <strong>Founding Counselor:</strong> ${pb.foundingCounselor}
            </div>
          </li>
          <li style="display: flex; gap: var(--space-3); align-items: flex-start;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); margin-top: 8px; flex-shrink: 0;"></div>
            <div>
              <strong>Founding Chair:</strong> ${pb.foundingChair}
            </div>
          </li>
          <li style="display: flex; gap: var(--space-3); align-items: flex-start;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); margin-top: 8px; flex-shrink: 0;"></div>
            <div>
              <strong>Current Counselor:</strong> ${pb.currentCounselor}
            </div>
          </li>
        </ul>
      </div>
    `;
  }

  function renderChapterTimeline() {
    const container = document.getElementById('chapter-timeline');
    if (!container || !window.HISTORY || !window.HISTORY.chapter) return;

    const milestones = window.HISTORY.chapter.milestones || [];
    container.innerHTML = milestones.map((item, idx) => `
      <div class="timeline-item reveal" style="--i: ${idx}">
        <div class="timeline-dot" aria-hidden="true"></div>
        <div class="timeline-content card p-6">
          <div class="timeline-date" style="font-family: var(--font-mono); color: var(--color-accent); font-size: var(--text-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-1);">${item.date}, ${item.year}</div>
          <h4 class="timeline-title" style="font-size: var(--text-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2);">${item.title}</h4>
          <p class="timeline-desc muted" style="font-size: var(--text-sm);">${item.description}</p>
        </div>
      </div>
    `).join('');
  }

  function renderSPSContent() {
    const container = document.getElementById('sps-specific-content');
    if (!container || !window.HISTORY || !window.HISTORY.chapter) return;

    const ch = window.HISTORY.chapter;
    container.innerHTML = `
      <div class="card p-6 reveal">
        <span class="section-badge mb-2">Chapter Identity</span>
        <h3 class="text-2xl font-bold mb-3">${ch.fullName}</h3>
        <p class="muted mb-4">${ch.missionStatement}</p>
      </div>
      <div class="card p-6 reveal" style="--i: 1">
        <h4 class="text-xl font-semibold mb-3" style="color: var(--color-primary-light);">Core Domain Spectrum</h4>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
          ${ch.focusAreas.map(area => `
            <span style="padding: var(--space-2) var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); font-size: var(--text-xs); font-family: var(--font-mono); color: var(--color-accent);">${area}</span>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderHighlights() {
    const container = document.getElementById('highlights-grid');
    if (!container || !window.HISTORY || !window.HISTORY.chapter) return;

    const focusAreas = [
      { title: "Audio & Speech Processing", icon: "🎙️", desc: "Filter design, spectral analysis, noise cancellation, and speech recognition algorithms." },
      { title: "Image & Video Processing", icon: "📷", desc: "Computer vision, feature extraction, compression, image restoration, and video streaming." },
      { title: "Biomedical Signal Processing", icon: "🩺", desc: "ECG/EEG analysis, medical imaging, biosensors, and physiological signal modeling." },
      { title: "Communications & Radar", icon: "📡", desc: "Wireless signal modulation, beamforming, MIMO systems, radar target detection." },
      { title: "Machine Learning Signals", icon: "🧠", desc: "Deep neural networks for acoustic models, time-series forecasting, and pattern recognition." },
      { title: "Embedded & DSP Hardware", icon: "⚡", desc: "FPGA, Microcontrollers, Raspberry Pi, and real-time DSP hardware architectures." }
    ];

    container.innerHTML = focusAreas.map((fa, i) => `
      <div class="card p-6 reveal" style="--i: ${i}">
        <div style="font-size: 2.5rem; margin-bottom: var(--space-3);">${fa.icon}</div>
        <h3 style="font-size: var(--text-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2);">${fa.title}</h3>
        <p class="muted" style="font-size: var(--text-sm); line-height: var(--line-height-normal);">${fa.desc}</p>
      </div>
    `).join('');
  }

  function renderMarquee() {
    const marquee = document.getElementById('focus-marquee');
    if (!marquee || !window.HISTORY || !window.HISTORY.chapter) return;

    const items = [...window.HISTORY.chapter.focusAreas, ...window.HISTORY.chapter.focusAreas];
    marquee.innerHTML = `
      <div style="display: flex; gap: var(--space-8); white-space: nowrap; animation: marquee-scroll 25s linear infinite;">
        ${items.map(item => `
          <span style="font-family: var(--font-heading); font-size: var(--text-xl); font-weight: var(--font-weight-bold); color: var(--color-muted); display: inline-flex; align-items: center; gap: var(--space-3);">
            <span style="color: var(--color-accent);">✦</span> ${item}
          </span>
        `).join('')}
      </div>
    `;
  }

  function renderStats() {
    const container = document.getElementById('stats-grid');
    if (!container || !window.SITE || !window.SITE.stats) return;

    const stats = [
      { label: "Events & Workshops", value: window.SITE.stats.events + "+" },
      { label: "Active Members", value: window.SITE.stats.members + "+" },
      { label: "Awards & Recognitions", value: window.SITE.stats.awards },
      { label: "Society Chapters", value: window.SITE.stats.chapters }
    ];

    container.innerHTML = stats.map((st, i) => `
      <div class="card p-6 text-center reveal" style="--i: ${i}">
        <div style="font-family: var(--font-heading); font-size: var(--text-4xl); font-weight: var(--font-weight-bold); color: var(--color-accent); margin-bottom: var(--space-1);">${st.value}</div>
        <div class="muted" style="font-size: var(--text-sm); font-weight: var(--font-weight-medium);">${st.label}</div>
      </div>
    `).join('');
  }

  // ==========================================================================
  // EVENTS PAGE RENDERER
  // ==========================================================================

  function renderEventsPage() {
    const upcomingGrid = document.getElementById('upcoming-grid');
    const pastGrid = document.getElementById('past-grid');
    const filterContainer = document.getElementById('event-filters');
    if (!window.EVENTS) return;

    const now = new Date().toISOString().split('T')[0];
    const upcoming = window.EVENTS.filter(e => e.date >= now).sort((a, b) => a.date.localeCompare(b.date));
    const past = window.EVENTS.filter(e => e.date < now).sort((a, b) => b.date.localeCompare(a.date));

    if (upcomingGrid) {
      const upcomingEmpty = document.getElementById('upcoming-empty');
      if (upcoming.length === 0) {
        upcomingGrid.style.display = 'none';
        if (upcomingEmpty) upcomingEmpty.style.display = 'block';
      } else {
        if (upcomingEmpty) upcomingEmpty.style.display = 'none';
        upcomingGrid.style.display = 'grid';
        upcomingGrid.innerHTML = upcoming.map(e => createEventCard(e)).join('');
      }
    }

    if (pastGrid) {
      pastGrid.innerHTML = past.map(e => createEventCard(e)).join('');
    }

    if (filterContainer) {
      const types = ['All', ...new Set(past.map(e => e.type))];
      filterContainer.innerHTML = types.map((t, idx) => `
        <button class="btn btn--sm ${idx === 0 ? 'btn--primary' : 'btn--secondary'} filter-btn" data-type="${t}">
          ${t}
        </button>
      `).join('');
    }
  }

  function createEventCard(event) {
    const badgeColor = event.type === 'Flagship' ? 'var(--color-accent)' : 'var(--color-primary-light)';
    return `
      <div class="card p-6 flex flex-col justify-between reveal event-card" data-type="${event.type}">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
            <span style="padding: var(--space-1) var(--space-3); background: rgba(0, 98, 155, 0.2); border: 1px solid ${badgeColor}; border-radius: var(--radius-full); font-size: var(--text-xs); color: ${badgeColor}; font-weight: var(--font-weight-semibold);">${event.type}</span>
            <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-muted);">${event.date}</span>
          </div>
          <h3 style="font-size: var(--text-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2);">${event.title}</h3>
          <p class="muted" style="font-size: var(--text-sm); margin-bottom: var(--space-4); line-height: var(--line-height-normal);">${event.description}</p>
        </div>
        <div>
          <div style="font-size: var(--text-xs); color: var(--color-muted); margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${event.venue || 'MBITS Campus'}
          </div>
          ${event.registerUrl ? `
            <a href="${event.registerUrl}" ${event.isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn--secondary btn--sm w-full text-center" style="width: 100%;">
              ${event.date >= new Date().toISOString().split('T')[0] ? 'Register Now' : 'View Details'}
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // EXECOM PAGE RENDERER
  // ==========================================================================

  function renderExecomPage() {
    const container = document.getElementById('execom-container');
    const counselorContainer = document.getElementById('counselor-spotlight');
    if (!window.EXECOM) return;

    if (counselorContainer) {
      counselorContainer.style.display = 'none'; // Hide redundant section
    }

    if (container) {
      container.innerHTML = `
        <div class="execom-poster-grid">
          ${window.EXECOM.map((m, i) => `
            <div class="execom-poster-card reveal" style="--i: ${i}">
              <img src="${m.photo}" alt="${m.alt}" class="execom-poster-img" loading="lazy">
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // ==========================================================================
  // MEMBERSHIP PAGE RENDERER
  // ==========================================================================

  function renderMembershipPage() {
    const benefitsGrid = document.getElementById('benefits-grid');
    const duesTable = document.getElementById('dues-table');
    const faqAccordion = document.getElementById('faq-accordion');

    if (benefitsGrid) {
      const benefits = [
        { icon: "🌐", title: "IEEE Xplore Access", desc: "Access thousands of signal processing journals, conference papers, and standards." },
        { icon: "🎓", title: "Student Discounts", desc: "Discounted registration for IEEE conferences, workshops, and certification courses." },
        { icon: "🤝", title: "Global Professional Network", desc: "Connect with signal processing researchers, professors, and industry leaders worldwide." },
        { icon: "🏆", title: "Scholarships & Awards", desc: "Eligibility for IEEE SPS travel grants, student paper awards, and project funding." },
        { icon: "🚀", title: "Hands-on Workshops", desc: "Exclusive access to chapter workshops, hackathons, and technical bootcamps." },
        { icon: "📜", title: "Certificates & Credentials", desc: "Earn verified IEEE certificates for event participation, leadership, and volunteering." }
      ];

      benefitsGrid.innerHTML = benefits.map((b, i) => `
        <div class="card p-6 reveal" style="--i: ${i}">
          <div style="font-size: 2.5rem; margin-bottom: var(--space-3);">${b.icon}</div>
          <h3 style="font-size: var(--text-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2);">${b.title}</h3>
          <p class="muted" style="font-size: var(--text-sm); line-height: var(--line-height-normal);">${b.desc}</p>
        </div>
      `).join('');
    }

    if (duesTable && window.SITE && window.SITE.dues) {
      const d = window.SITE.dues;
      duesTable.innerHTML = `
        <div class="card p-6 reveal">
          <h3 style="font-size: var(--text-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-4); text-align: center;">Membership Dues Breakdown</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); text-align: center;">
            <div style="padding: var(--space-4); background: var(--color-surface); border-radius: var(--radius-lg);">
              <div class="muted" style="font-size: var(--text-xs); font-family: var(--font-mono);">IEEE BASE STUDENT</div>
              <div style="font-size: var(--text-3xl); font-weight: var(--font-weight-bold); color: var(--color-accent); margin: var(--space-2) 0;">$${d.baseStudent} USD</div>
              <div class="muted" style="font-size: var(--text-xs);">Per Year</div>
            </div>
            <div style="padding: var(--space-4); background: var(--color-surface); border-radius: var(--radius-lg);">
              <div class="muted" style="font-size: var(--text-xs); font-family: var(--font-mono);">SPS CHAPTER ADD-ON</div>
              <div style="font-size: var(--text-3xl); font-weight: var(--font-weight-bold); color: var(--color-primary-light); margin: var(--space-2) 0;">$${d.spsAddOn} USD</div>
              <div class="muted" style="font-size: var(--text-xs);">Per Year</div>
            </div>
          </div>
          <p class="muted text-center" style="font-size: var(--text-xs); margin-top: var(--space-4);">
            * Dues are subject to regional half-year promotional rates. Verify on official <a href="${d.verifyUrl}" target="_blank" rel="noopener" style="color: var(--color-accent);">IEEE Dues Portal</a>.
          </p>
        </div>
      `;
    }

    if (faqAccordion) {
      const faqs = [
        { q: "Who can join IEEE SPS SBC MBITS?", a: "Any student currently enrolled at MBITS across ECE, EEE, CSE, AI, and related engineering departments can join." },
        { q: "Do I need prior experience in signal processing?", a: "No! We welcome beginners. Our workshops start from foundational signal processing to advanced AI/DSP applications." },
        { q: "How do I renew my annual membership?", a: "You can renew your membership directly through the IEEE official portal using your IEEE account credentials." }
      ];

      faqAccordion.innerHTML = faqs.map((f, idx) => `
        <div class="card p-6 reveal" style="--i: ${idx}; margin-bottom: var(--space-4);">
          <h4 style="font-size: var(--text-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-2); color: var(--color-accent);">${f.q}</h4>
          <p class="muted" style="font-size: var(--text-sm); line-height: var(--line-height-normal);">${f.a}</p>
        </div>
      `).join('');
    }
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  function init() {
    renderParentHistory();
    renderChapterTimeline();
    renderSPSContent();
    renderHighlights();
    renderMarquee();
    renderStats();

    renderEventsPage();
    renderExecomPage();
    renderMembershipPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
