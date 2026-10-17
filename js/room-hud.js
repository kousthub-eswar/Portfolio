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
      title: "BillMate — Point-of-Sale & Retail Management System",
      badge: "REACT 19 • SUPABASE • POSTGRESQL RPCs • PWA • VITEST",
      metrics: [
        { label: "Data Integrity", value: "Atomic PostgreSQL RPCs" },
        { label: "Hardware & Scanning", value: "Camera Barcode & 80mm ESC/POS" },
        { label: "Multi-User Security", value: "Supabase Auth & RLS" },
        { label: "Testing & Deploy", value: "Vitest Tests • Vercel" }
      ],
      description: "A deployed mobile-first Progressive Web App engineered for high-throughput retail checkout, instant camera barcode scanning, customer credit ledger, and offline caching.",
      highlights: [
        "Developed a mobile-first PWA covering billing with camera barcode scanning, inventory, customer credit ledger, supplier and expense tracking, with offline caching.",
        "Engineered atomic sales and inventory updates using PostgreSQL RPC functions, preventing stock and sales desync, and secured multi-user data with Supabase Auth and Row-Level Security.",
        "Structured data access into reusable service modules with Vitest unit tests; auto-deployed on Vercel."
      ],
      links: [
        { text: "Live Demo", url: "https://bill-mate-one.vercel.app/", primary: true },
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar/BillMate", primary: false }
      ]
    },
    tunesense: {
      title: "TuneSense — Explainable Music Recommendation System",
      badge: "6 STRATEGIES • 11 MONGOOSE SCHEMAS • EVALUATION SUITE",
      metrics: [
        { label: "Recommendation API", value: "6 Composable Strategies" },
        { label: "Database Modeling", value: "11 Mongoose Schemas" },
        { label: "Authentication & Security", value: "JWT in HttpOnly + Zod" },
        { label: "Evaluation Suite", value: "Precision@K, Recall@K, NDCG" }
      ],
      description: "An explainable music recommendation system with six composable algorithmic strategies that return a transparent human-readable reason for each suggested song.",
      highlights: [
        "Implemented a music recommendation REST API with six composable strategies (popularity, content, behavioral, contextual, hybrid/mood, and collaborative filtering) that return human-readable reasons (e.g., 'Matches high danceability & tempo of your favorites').",
        "Designed 11 Mongoose schemas using materialized views, append-only event logs, compound indexes, and aggregation pipelines for listening telemetry and cosine-similarity peer matching.",
        "Secured the API with JWT sessions in HttpOnly cookies, bcrypt hashing, Zod schema validation, and ownership checks; deployed the client on Vercel and the API on Render.",
        "Authored staged verification suites and an offline evaluation framework (Precision@K, Recall@K, NDCG)."
      ],
      links: [
        { text: "Live Demo", url: "https://tunesense-sepia.vercel.app/", primary: true },
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar/tunesense", primary: false }
      ]
    },
    clubhub: {
      title: "Campus ClubHub — Student Club & Event Portal",
      badge: "REACT 19 • TYPESCRIPT • VITE • TAILWIND CSS",
      metrics: [
        { label: "Authentication Flow", value: "Domain-Segregated Auth" },
        { label: "Digital Passes", value: "Real-Time SVG QR Codes" },
        { label: "Calendar Sync", value: "Google Calendar & .ics" },
        { label: "Organizer Dashboard", value: "Live KPIs & CSV Export" }
      ],
      description: "A student club and event portal streamlining role-segregated student and organizer authentication, digital ticketing passes, and administrative capacity tracking.",
      highlights: [
        "Developed role-segregated student and organizer authentication flows based on institutional email domains, with digital event passes using real-time SVG QR codes and Google Calendar/.ics sync.",
        "Created an organizer console with live registration KPIs, real-time attendee rosters and CSV export.",
        "Architected with React 19, TypeScript, Vite, and Tailwind CSS for rapid sub-second interaction and responsive mobile views."
      ],
      links: [
        { text: "Live Demo", url: "https://campusclubhub.vercel.app/", primary: true },
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar/college-event-hub", primary: false }
      ]
    },
    auditanalytics: {
      title: "Audit Analytics — Forensic Financial Anomaly Detection",
      badge: "8,000 TXNS • SYNTHETIC DATASET • BENFORD'S LAW • SQLITE",
      metrics: [
        { label: "Sample Size", value: "8,000 Transactions (Synthetic)" },
        { label: "Volume Simulated", value: "$13.7M Simulated Volume" },
        { label: "Threshold Flags", value: "206 Avoidance Flags" },
        { label: "Duplicate Checks", value: "168 Duplicate Invoices" }
      ],
      description: "A forensic financial data analytics platform analyzing an 8,000-transaction synthetic dataset to detect accounting anomalies and threshold avoidance.",
      highlights: [
        "Analyzed an 8,000-transaction synthetic ledger ($13.7M simulated volume) using a SQLite schema, SQL data-quality checks, Benford's Law and rule tests to flag 206 threshold-avoidance transactions, 168 duplicate invoices and 122 weekend postings.",
        "Engineered interactive forensic analytics dashboards with Python, SQL (SQLite), and Streamlit."
      ],
      links: [
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar/audit-analytics", primary: true }
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
    if (projectActionBtn) projectActionBtn.dataset.project = key;
    if (projectMetricsEl) {
      projectMetricsEl.innerHTML = data.metrics.map(m => `
        <div class="flyout-metric-chip">
          <strong>${m.value}</strong>
          <span>${m.label}</span>
        </div>
      `).join('');
    }
    const liveBtn = document.getElementById('flyout-project-live-btn');
    const githubBtn = document.getElementById('flyout-project-github-btn');
    if (liveBtn) {
      const demoLink = data.links.find(l => l.text.toLowerCase().includes('demo'));
      if (demoLink) {
        liveBtn.href = demoLink.url;
        liveBtn.style.display = 'inline-flex';
        liveBtn.textContent = 'Live Demo \u2192';
      } else {
        liveBtn.style.display = 'none';
      }
    }
    if (githubBtn) {
      const ghLink = data.links.find(l => l.text.toLowerCase().includes('github'));
      if (ghLink) {
        githubBtn.href = ghLink.url;
        githubBtn.style.display = 'inline-flex';
        githubBtn.textContent = 'GitHub \u2192';
      } else {
        githubBtn.style.display = 'none';
      }
    }
  }

  // Initialize first project tab
  displayProjectInFlyout('billmate');

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

  const flyoutSpecBtn = document.getElementById('flyout-project-spec-btn');
  if (flyoutSpecBtn) {
    flyoutSpecBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSpecModal(flyoutSpecBtn.dataset.project || 'billmate');
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-spec-btn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      openSpecModal(btn.dataset.project || 'billmate');
    }
  }, true);

  if (modalClose) {
    modalClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      modal.classList.remove('active');
    });
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

  // ==========================================
  // 6. 3D Cockpit Mode Toggle (Clean 2D <-> 3D Workstation)
  // ==========================================
  const enterCockpitButtons = document.querySelectorAll('.btn-enter-cockpit, #nav-enter-3d, #hero-enter-3d, #float-enter-3d');
  const exitCockpitBtn = document.getElementById('hud-exit-cockpit');

  function enterCockpit() {
    document.body.classList.add('cockpit-mode');
    if (window.cyberRoom) {
      window.cyberRoom.transitionTo('overview');
    }
  }

  function exitCockpit() {
    document.body.classList.remove('cockpit-mode');
    allFlyouts.forEach(f => f && f.classList.remove('active'));
  }

  enterCockpitButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      enterCockpit();
    });
  });

  if (exitCockpitBtn) {
    exitCockpitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      exitCockpit();
    });
  }

  // Keyboard navigation & ESC handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const isModalOpen = modal && modal.classList.contains('active');
      const isCmdOpen = cmdOverlay && cmdOverlay.classList.contains('active');
      if (isModalOpen || isCmdOpen) return;

      if (document.body.classList.contains('cockpit-mode')) {
        const anyFlyoutActive = Array.from(allFlyouts).some(f => f && f.classList.contains('active'));
        if (anyFlyoutActive) {
          if (window.cyberRoom) window.cyberRoom.transitionTo('overview');
        } else {
          exitCockpit();
        }
      }
    }
  });

  // ==========================================
  // 7. Interactive 1-Click Email Copy Helper
  // ==========================================
  const copyEmailBtns = document.querySelectorAll('.btn-copy-email');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'kousthubeswar@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Copied to Clipboard!</span>`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('copied');
        }, 2200);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  });

  // ==========================================
  // 8. Contact Quick Form Pre-fill
  // ==========================================
  const contactForm = document.getElementById('quick-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name')?.value || '';
      const email = document.getElementById('cf-email')?.value || '';
      const role = document.getElementById('cf-role')?.value || 'Opportunity';
      const msg = document.getElementById('cf-message')?.value || '';

      const subject = encodeURIComponent(`[Portfolio Contact] ${role} - ${name}`);
      const body = encodeURIComponent(`Hi Kousthub,\n\nName: ${name}\nEmail: ${email}\nRole/Topic: ${role}\n\nMessage:\n${msg}\n`);
      window.location.href = `mailto:kousthubeswar@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
