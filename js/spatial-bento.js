/* ============================================================
   SPATIAL-BENTO.JS — Interactive Bento Studio Engine
   Card spotlights, 3D tilt physics, modal deep-dives,
   skill category filters, and keyboard command palette.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================
  // 1. Bento Card Spotlight Tracking & 3D Tilt
  // ============================================================
  const bentoCards = document.querySelectorAll('.bento-card');

  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables for radial spotlight
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle 3D perspective tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // ============================================================
  // 2. Dynamic Tagline Typing Animation
  // ============================================================
  const typedEl = document.getElementById('bento-typed-text');
  if (typedEl) {
    const roles = [
      'Full-Stack & Systems Engineer',
      'React & TypeScript Specialist',
      'PostgreSQL RPC & Backend Architect',
      'Explainable AI & ML Developer'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typedEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typedEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 30 : 65;

      if (!isDeleting && charIdx === currentRole.length) {
        speed = 2200; // Pause at end of text
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 400;
      }

      setTimeout(typeLoop, speed);
    }

    typeLoop();
  }

  // ============================================================
  // 3. Technical Project Specs Modal
  // ============================================================
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');
  const modalClose = document.getElementById('modal-close');

  const projectSpecs = {
    billmate: {
      title: "BillMate — Point-of-Sale & Retail Management System",
      badge: "REACT 19 • SUPABASE • POSTGRESQL RPCs • PWA • VITEST",
      metrics: [
        { label: "Data Integrity", value: "Atomic PostgreSQL RPCs" },
        { label: "Hardware & Scanning", value: "Camera Barcode & 80mm ESC/POS" },
        { label: "Multi-User Security", value: "Supabase Auth & RLS" },
        { label: "Testing & Deploy", value: "Vitest Tests • Vercel" }
      ],
      description: "A mobile-first Progressive Web App covering billing with camera barcode scanning, inventory, customer credit ledger, supplier and expense tracking, with offline caching.",
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
        "Implemented a music recommendation REST API with six composable strategies (popularity, content, behavioral, contextual, hybrid/mood, and collaborative filtering) that return human-readable reasons for each song.",
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
        "Architected with React 19, TypeScript, Vite, and Tailwind CSS for rapid interaction and responsive mobile views."
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
        "Analyzed an 8,000-transaction synthetic ledger ($13.7M simulated volume) using a SQLite schema, SQL data-quality checks, and Benford's Law distribution testing to flag 206 threshold-avoidance transactions, 168 duplicate invoices and 122 weekend postings.",
        "Detected split-invoicing under compliance thresholds and duplicate billing timestamps across synthetic test sets.",
        "Rendered interactive audit risk dashboards using Streamlit, Plotly, and vectorized Pandas calculations."
      ],
      links: [
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar/audit-analytics", primary: true }
      ]
    }
  };

  document.querySelectorAll('.open-spec-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.dataset.project;
      const data = projectSpecs[key];
      if (!data) return;

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
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================================
  // 4. Command Palette (Ctrl+K / Cmd+K)
  // ============================================================
  const cmdOverlay = document.getElementById('cmd-overlay');
  const cmdInput = document.getElementById('cmd-input');
  const cmdList = document.getElementById('cmd-list');
  const cmdTriggers = document.querySelectorAll('.cmd-trigger-btn');

  if (cmdOverlay && cmdInput && cmdList) {
    function openPalette() {
      cmdOverlay.classList.add('active');
      cmdInput.value = '';
      filterItems('');
      setTimeout(() => cmdInput.focus(), 50);
      document.body.style.overflow = 'hidden';
    }

    function closePalette() {
      cmdOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    cmdTriggers.forEach(b => b.addEventListener('click', openPalette));

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cmdOverlay.classList.contains('active')) closePalette();
        else openPalette();
      }
      if (e.key === 'Escape' && cmdOverlay.classList.contains('active')) {
        closePalette();
      }
    });

    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) closePalette();
    });

    const items = cmdList.querySelectorAll('.cmd-item');

    function filterItems(q) {
      const term = q.toLowerCase().trim();
      items.forEach(it => {
        const text = it.textContent.toLowerCase();
        it.style.display = text.includes(term) ? 'flex' : 'none';
      });
    }

    cmdInput.addEventListener('input', (e) => filterItems(e.target.value));

    items.forEach(it => {
      it.addEventListener('click', () => {
        const action = it.dataset.action;
        closePalette();

        if (action === 'navigate') {
          const target = document.querySelector(it.dataset.target);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'resume') {
          const link = document.createElement('a');
          link.href = 'assets/resume.pdf';
          link.download = 'Kousthub_Resume.pdf';
          link.click();
        } else if (action === 'project') {
          const btn = document.querySelector(`.open-spec-btn[data-project="${it.dataset.project}"]`);
          if (btn) btn.click();
        }
      });
    });
  }

  // ============================================================
  // 5. Tech Stack Filter Tabs in Bento Cell
  // ============================================================
  const filterBtns = document.querySelectorAll('.stack-tab');
  const stackItems = document.querySelectorAll('.tech-pill');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;

      stackItems.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.style.display = 'inline-flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ============================================================
  // 6. Smooth Navbar Scroll spy & Active indicator
  // ============================================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Nav Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
});
