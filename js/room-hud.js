/* ============================================================
   ROOM-HUD.JS — 3D Cyber Room Glass HUD & Interactive Overlay
   Controls camera station switching, project specs modals,
   tech stack filters, and global command palette.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================
  // 1. HUD Navigation & Camera Station Teleports
  // ============================================================
  const hudButtons = document.querySelectorAll('.hud-nav-btn');
  const resetBtn = document.getElementById('hud-reset-view');

  // Prevent UI container clicks from propagating to canvas
  const uiOverlays = document.querySelectorAll('.hud-topbar, .hud-bottom-bar, .station-flyout, #project-modal, #cmd-overlay');
  uiOverlays.forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  hudButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetView = btn.dataset.view;
      if (window.cyberRoom && targetView) {
        window.cyberRoom.transitionTo(targetView);
      }
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.cyberRoom) window.cyberRoom.transitionTo('overview');
    });
  }

  // ==========================================
  // 2. Station Overlays (Interactive Flyouts)
  // ==========================================
  const flyoutProjects = document.getElementById('flyout-projects');
  const flyoutSkills = document.getElementById('flyout-skills');
  const flyoutExp = document.getElementById('flyout-experience');
  const flyoutContact = document.getElementById('flyout-contact');
  const allFlyouts = [flyoutProjects, flyoutSkills, flyoutExp, flyoutContact];

  // Immediately hide panels when camera begins moving
  window.addEventListener('stationTransitionStart', () => {
    allFlyouts.forEach(f => f && f.classList.remove('active'));
  });

  // Reveal corresponding panel when camera arrives at target station
  window.addEventListener('stationChanged', (e) => {
    const station = e.detail.station;
    allFlyouts.forEach(f => f && f.classList.remove('active'));

    if (station === 'projects' && flyoutProjects) {
      flyoutProjects.classList.add('active');
    } else if (station === 'skills' && flyoutSkills) {
      flyoutSkills.classList.add('active');
    } else if (station === 'experience' && flyoutExp) {
      flyoutExp.classList.add('active');
    } else if (station === 'contact' && flyoutContact) {
      flyoutContact.classList.add('active');
    }
  });

  // Dedicated Flyout Close Buttons
  document.querySelectorAll('.flyout-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.cyberRoom) window.cyberRoom.transitionTo('overview');
    });
  });

  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-action="close-flyout"]');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      if (window.cyberRoom) {
        window.cyberRoom.transitionTo('overview');
      }
    }
  }, true);

  // ==========================================
  // 3. Project Selector in Projects Flyout
  // ==========================================
  const projectData = {
    billmate: {
      title: "BillMate — Point-of-Sale & Retail PWA",
      badge: "LIVE PWA • VITEST PASSED",
      metrics: [
        { label: "Data Integrity", value: "Atomic RPCs" },
        { label: "Printing Engine", value: "ESC/POS 80mm" },
        { label: "Test Coverage", value: "Vitest Passed" },
        { label: "Stack", value: "React 19 / TS / Supabase" }
      ],
      description: "A production-grade Progressive Web App engineered for high-throughput retail checkout, instant barcode scanning, and multi-channel receipt generation.",
      highlights: [
        "Eliminated inventory race conditions using atomic PostgreSQL RPC stored procedures with row-level locks.",
        "Integrated camera and USB barcode scanner pipeline with sub-100ms product lookup across thousands of SKUs.",
        "Engineered browser-native 80mm ESC/POS thermal printing and dynamic SVG QR invoice rendering.",
        "Offline-capable service worker architecture guaranteeing continuous checkout during store connectivity drops."
      ],
      links: [
        { text: "Live Demo", url: "https://bill-mate.vercel.app/", primary: true },
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar/BillMate", primary: false }
      ]
    },
    tunesense: {
      title: "TuneSense — Music Recommendation Engine",
      badge: "6 ALGORITHMS • 11 MONGOOSE SCHEMAS",
      metrics: [
        { label: "Engines", value: "6 Recommendation Pipelines" },
        { label: "Models", value: "11 Mongoose Schemas" },
        { label: "Math", value: "Cosine Similarity Vectors" },
        { label: "Auth", value: "JWT + Zod Strict" }
      ],
      description: "An end-to-end full-stack music intelligence platform delivering transparent, explainable recommendations based on acoustic feature extraction and user taste profiles.",
      highlights: [
        "Built 6 distinct recommendation pipelines including Content-Based Filtering, Hybrid Weighted Blend, and Cosine Distance.",
        "Architected 11 strict Mongoose schemas with compound indexes to optimize millisecond-level similarity scoring.",
        "Developed an interactive radar chart visualizer explaining exactly WHY each song was recommended (energy, valence, danceability).",
        "Enforced end-to-end type validation using Zod schemas and cryptographically signed JWT auth tokens."
      ],
      links: [
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar/TuneSense", primary: true }
      ]
    },
    clubhub: {
      title: "Campus ClubHub — Event Management Portal",
      badge: "PRODUCTION CAMPUS SYSTEM",
      metrics: [
        { label: "Access Control", value: "Role-Segregated" },
        { label: "Passes", value: "Cryptographic SVG QRs" },
        { label: "Architecture", value: "MERN Stack" },
        { label: "Speed", value: "Sub-Second Ticket Check" }
      ],
      description: "A comprehensive university event management platform streamlining registrations, ticket validations, and club administrative operations across academic bodies.",
      highlights: [
        "Implemented secure role-based access control (Admins, Club Leads, Student Attendees).",
        "Generated tamper-evident SVG QR code event passes with cryptographic verification payloads.",
        "Integrated an administrative dashboard with live registration capacity tracking and CSV export."
      ],
      links: [
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar/Campus-ClubHub", primary: true }
      ]
    },
    auditanalytics: {
      title: "Audit Analytics System — Ledger Anomaly Detection",
      badge: "8,000 TXNS • $13.7M AUDITED",
      metrics: [
        { label: "Sample Size", value: "8,000 Transactions" },
        { label: "Capital Audited", value: "$13.7M Vol" },
        { label: "Algorithm", value: "Benford's Law (Chi-Sq)" },
        { label: "Stack", value: "Python / Pandas / Streamlit" }
      ],
      description: "A forensic financial data analytics platform engineered to detect balance sheet fraud, suspicious invoice round-tripping, and duplicate disbursements.",
      highlights: [
        "Executed digit-distribution goodness-of-fit testing using Benford's Law and Chi-Square divergence across 8,000 transactions totaling $13.7M.",
        "Detected split-invoicing under compliance thresholds and duplicate billing timestamps with zero false-negative escapes.",
        "Rendered high-density interactive audit risk dashboards using Streamlit, Plotly, and vectorized Pandas calculations."
      ],
      links: [
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar", primary: true }
      ]
    }
  };

  // Switcher buttons in Projects Flyout
  const projectTabs = document.querySelectorAll('.project-selector-tab');
  const projectTitleEl = document.getElementById('flyout-project-title');
  const projectDescEl = document.getElementById('flyout-project-desc');
  const projectMetricsEl = document.getElementById('flyout-project-metrics');
  const projectActionBtn = document.getElementById('flyout-project-spec-btn');

  function displayProjectInFlyout(key) {
    const data = projectData[key];
    if (!data) return;

    if (projectTitleEl) projectTitleEl.textContent = data.title;
    if (projectDescEl) projectDescEl.textContent = data.description;
    if (projectMetricsEl) {
      projectMetricsEl.innerHTML = data.metrics.map(m => `
        <div class="flyout-metric-chip">
          <strong>${m.value}</strong>
          <span>${m.label}</span>
        </div>
      `).join('');
    }
    if (projectActionBtn) {
      projectActionBtn.dataset.project = key;
    }
  }

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      displayProjectInFlyout(tab.dataset.project);
      if (window.cyberRoom && typeof window.cyberRoom.updateMonitor === 'function') {
        window.cyberRoom.updateMonitor(tab.dataset.project);
      }
    });
  });

  // ==========================================
  // 4. Technical Specs Modal
  // ==========================================
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');
  const modalClose = document.getElementById('modal-close');

  function openSpecModal(key) {
    const data = projectData[key];
    if (!data || !modalBody || !modal) return;

    modalBody.innerHTML = `
      <div class="modal-spec-header">
        <span class="modal-spec-badge">${data.badge}</span>
        <h2>${data.title}</h2>
        <p class="modal-spec-desc">${data.description}</p>
      </div>

      <div class="modal-spec-metrics">
        ${data.metrics.map(m => `
          <div class="modal-metric-card">
            <span class="metric-val">${m.value}</span>
            <span class="metric-lbl">${m.label}</span>
          </div>
        `).join('')}
      </div>

      <div class="modal-spec-section">
        <h3>Architectural Highlights & Engineering Impact</h3>
        <ul class="modal-spec-list">
          ${data.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-spec-actions">
        ${data.links.map(l => `
          <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn ${l.primary ? 'btn-primary' : 'btn-secondary'}">
            ${l.text} &rarr;
          </a>
        `).join('')}
      </div>
    `;

    modal.classList.add('active');
  }

  document.addEventListener('click', (e) => {
    const specBtn = e.target.closest('.open-spec-btn');
    if (specBtn) {
      e.preventDefault();
      openSpecModal(specBtn.dataset.project);
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // ==========================================
  // 5. Command Palette (Ctrl + K)
  // ==========================================
  const cmdOverlay = document.getElementById('cmd-overlay');
  const cmdInput = document.getElementById('cmd-input');
  const cmdList = document.getElementById('cmd-list');
  const cmdTriggers = document.querySelectorAll('.cmd-trigger-btn');

  if (cmdOverlay && cmdInput && cmdList) {
    function openCmd() {
      cmdOverlay.classList.add('active');
      cmdInput.value = '';
      filterCmd('');
      setTimeout(() => cmdInput.focus(), 50);
    }

    function closeCmd() {
      cmdOverlay.classList.remove('active');
    }

    cmdTriggers.forEach(b => b.addEventListener('click', openCmd));

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cmdOverlay.classList.contains('active')) closeCmd();
        else openCmd();
      }
      if (e.key === 'Escape' && cmdOverlay.classList.contains('active')) {
        closeCmd();
      }
    });

    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) closeCmd();
    });

    const items = cmdList.querySelectorAll('.cmd-item');
    function filterCmd(query) {
      const q = query.toLowerCase().trim();
      items.forEach(it => {
        it.style.display = it.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
      });
    }

    cmdInput.addEventListener('input', (e) => filterCmd(e.target.value));

    items.forEach(it => {
      it.addEventListener('click', () => {
        const action = it.dataset.action;
        closeCmd();

        if (action === 'view' && window.cyberRoom) {
          window.cyberRoom.transitionTo(it.dataset.view);
        } else if (action === 'project') {
          openSpecModal(it.dataset.project);
        } else if (action === 'resume') {
          const a = document.createElement('a');
          a.href = 'assets/resume.pdf';
          a.download = 'Kousthub_Resume.pdf';
          a.click();
        }
      });
    });
  }
});
