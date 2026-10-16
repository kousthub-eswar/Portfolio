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
      title: "BillMate — POS & Retail Management PWA",
      badge: "LIVE PWA • VITEST AUDITED",
      metrics: [
        { label: "Data Integrity", value: "Atomic RPCs" },
        { label: "Hardware Support", value: "Thermal 80mm & Esc/POS" },
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
      title: "TuneSense — Explainable Music Recommendation System",
      badge: "6 ALGORITHMS • 11 MONGOOSE SCHEMAS",
      metrics: [
        { label: "Algorithms", value: "6 Recommendation Engines" },
        { label: "Schema Models", value: "11 Mongoose Schemas" },
        { label: "Vector Math", value: "Cosine Similarity" },
        { label: "Security", value: "JWT + Zod Strict" }
      ],
      description: "An end-to-end full-stack music intelligence platform delivering transparent, explainable recommendations based on acoustic feature extraction and user taste profiles.",
      highlights: [
        "Built 6 distinct recommendation pipelines including Content-Based Filtering, Hybrid Weighted Blend, Cosine Vector Distance, and Acoustic Attribute Matching.",
        "Architected 11 strict Mongoose schemas with compound indexes to optimize millisecond-level similarity scoring.",
        "Developed an interactive radar chart visualizer explaining exactly WHY each song was recommended (energy, valence, danceability, acousticness).",
        "Enforced end-to-end type validation using Zod schemas and cryptographically signed JWT auth tokens."
      ],
      links: [
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar/TuneSense", primary: true }
      ]
    },
    clubhub: {
      title: "Campus ClubHub — Role-Segregated Event Portal",
      badge: "PRODUCTION CAMPUS SYSTEM",
      metrics: [
        { label: "Access Control", value: "Role-Segregated" },
        { label: "Passes", value: "Cryptographic SVG QRs" },
        { label: "Architecture", value: "MERN Stack" },
        { label: "Real-time", value: "Sub-Second Ticket Check" }
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
      title: "Audit Analytics System — Forensic Ledger Anomaly Detection",
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
        "Detected split-invoicing under compliance thresholds and duplicate billing timestamps with zero false-negative escapes on synthetic test sets.",
        "Rendered high-density interactive audit risk dashboards using Streamlit, Plotly, and vectorized Pandas calculations."
      ],
      links: [
        { text: "GitHub Source", url: "https://github.com/kousthub-eswar", primary: true }
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
