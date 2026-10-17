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
      description: "A mobile-first PWA covering billing with camera barcode scanning, inventory, customer credit ledger, supplier and expense tracking, with offline caching.",
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
      description: "An explainable music recommendation system with six composable algorithmic strategies that return a human-readable reason for each song.",
      highlights: [
        "Implemented a music recommendation REST API with six composable strategies (popularity, content, behavioural, contextual, hybrid/mood and collaborative filtering) that return a human-readable reason for each song.",
        "Designed 11 Mongoose schemas using materialized views, append-only event logs, compound indexes and aggregation pipelines for listening telemetry and cosine-similarity peer matching.",
        "Secured the API with JWT sessions in HttpOnly cookies, bcrypt hashing, Zod validation and ownership checks; deployed the client on Vercel and the API on Render.",
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
      title: "Audit Analytics & Anomaly Detection System",
      badge: "8,000 TXNS • $13.7M VOLUME • BENFORD'S LAW",
      metrics: [
        { label: "Sample Size", value: "8,000 Transactions" },
        { label: "Volume Audited", value: "$13.7M Volume" },
        { label: "Threshold Flags", value: "206 Avoidance Flags" },
        { label: "Duplicates & Weekends", value: "168 Invoices & 122 Postings" }
      ],
      description: "A forensic financial data analytics platform engineered to detect balance sheet fraud, suspicious round-tripping, and duplicate invoice disbursements.",
      highlights: [
        "Analyzed 8,000 ledger transactions ($13.7M) using a SQLite schema, SQL data-quality checks, Benford's Law and rule tests to flag 206 threshold-avoidance transactions, 168 duplicate invoices and 122 weekend postings.",
        "Detected split-invoicing under compliance thresholds and duplicate billing timestamps with zero false-negative escapes.",
        "Engineered high-density forensic analytics dashboards with Python, SQL (SQLite), and Streamlit."
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
  // 6. Cyber Bootloader Progress & Fade
  // ==========================================
  const loader = document.getElementById('cyber-loader');
  const loaderBar = document.getElementById('loader-bar-fill');
  const loaderTelemetry = document.getElementById('loader-telemetry');
  
  if (loader && loaderBar) {
    let progress = 25;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (loaderBar) loaderBar.style.width = '100%';
        if (loaderTelemetry) loaderTelemetry.textContent = 'SYSTEM_READY // ALL_CHANNELS_ACTIVE [100%]';
        setTimeout(() => {
          loader.classList.add('loaded');
        }, 320);
      } else {
        if (loaderBar) loaderBar.style.width = progress + '%';
        if (loaderTelemetry) loaderTelemetry.textContent = `ALLOCATING_SHADERS [${progress}%]`;
      }
    }, 80);
  }

  // ==========================================
  // 7. Mobile View Mode Toggle (Cards <-> 3D Cockpit)
  // ==========================================
  const mobileToggleBtn = document.getElementById('btn-mobile-view-toggle');
  const float3dBtn = document.getElementById('m-float-3d-btn');

  function toggleMobile3D(active) {
    if (active) {
      document.body.classList.add('mobile-3d-mode');
      if (mobileToggleBtn) {
        const icon = mobileToggleBtn.querySelector('.mobile-toggle-icon');
        const label = mobileToggleBtn.querySelector('.mobile-toggle-label');
        if (icon) icon.textContent = '📄';
        if (label) label.textContent = 'Cards';
      }
      if (float3dBtn) float3dBtn.style.display = 'none';
      if (window.cyberRoom) window.cyberRoom.transitionTo('overview');
    } else {
      document.body.classList.remove('mobile-3d-mode');
      if (mobileToggleBtn) {
        const icon = mobileToggleBtn.querySelector('.mobile-toggle-icon');
        const label = mobileToggleBtn.querySelector('.mobile-toggle-label');
        if (icon) icon.textContent = '🌐';
        if (label) label.textContent = '3D';
      }
      if (float3dBtn) float3dBtn.style.display = 'inline-flex';
    }
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const is3D = document.body.classList.contains('mobile-3d-mode');
      toggleMobile3D(!is3D);
    });
  }

  if (float3dBtn) {
    float3dBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobile3D(true);
    });
  }

  // Mobile Nav Pills Active Highlighter on Scroll
  const mobilePills = document.querySelectorAll('.m-nav-pill');
  if (mobilePills.length > 0) {
    mobilePills.forEach(pill => {
      pill.addEventListener('click', () => {
        mobilePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }
});
