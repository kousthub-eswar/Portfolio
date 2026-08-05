/* ============================================
   MAIN.JS V2 — 3D Tilt, Magnetic Buttons,
   Spotlight Cards, Parallax, Enhanced Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Custom Cursor Glow (follows mouse globally) ----
  const cursorGlow = document.createElement('div');
  cursorGlow.id = 'cursor-glow';
  cursorGlow.style.cssText = `
    position: fixed;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    opacity: 0;
  `;
  document.body.appendChild(cursorGlow);

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.opacity = '1';
  });

  function updateCursorGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(updateCursorGlow);
  }
  updateCursorGlow();

  // ---- Navbar ----
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top && window.scrollY < top + section.offsetHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // ---- Mobile Menu ----
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Typing Effect (enhanced) ----
  const typedElement = document.getElementById('typed-text');
  if (typedElement) {
    const strings = [
      'Backend Developer',
      'Systems Thinker',
      'Java Enthusiast',
      'CS Student @ VIT',
      'Problem Solver',
      'Database Architect',
    ];
    let stringIndex = 0, charIndex = 0, isDeleting = false, speed = 80;

    function type() {
      const current = strings[stringIndex];
      if (isDeleting) {
        typedElement.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        speed = 35;
      } else {
        typedElement.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        speed = 70 + Math.random() * 30; // slight randomization for natural feel
      }

      if (!isDeleting && charIndex === current.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        speed = 400;
      }
      setTimeout(type, speed);
    }
    setTimeout(type, 800);
  }

  // ---- 3D Tilt Effect on Cards ----
  function initTilt(selector, intensity = 8) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -intensity;
        const rotateY = ((x - centerX) / centerX) * intensity;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  initTilt('.skill-category', 6);
  initTilt('.stat-card', 10);
  initTilt('.education-card', 4);
  initTilt('.timeline-card', 5);

  // ---- Card Spotlight Effect (cursor light on glass cards) ----
  function initSpotlight(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
      // Create spotlight element
      const spotlight = document.createElement('div');
      spotlight.className = 'card-spotlight';
      card.prepend(spotlight);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotlight.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.08), transparent 60%)`;
      });
    });
  }

  initSpotlight('.glass-card');

  // ---- Parallax Floating Elements ----
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const offset = el.getBoundingClientRect().top + scrollY;
      const translate = (scrollY - offset) * speed;
      el.style.transform = `translateY(${translate}px)`;
    });
  });

  // ---- Scroll Reveal (stagger children) ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---- Project Category Filters ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

  // ---- Quick Specs Modal Logic ----
  const modalData = {
    billmate: {
      tag: "POS System // Architecture Specs",
      title: "BillMate — POS & Retail Management",
      description: "BillMate was architected to solve stock sync anomalies and offline transaction issues for small retail merchants.",
      highlights: [
        "PostgreSQL Stored Procedures (RPCs): Atomic inventory deduct + sale record creation to eliminate race conditions.",
        "Supabase Auth & RLS: Strict row-level isolation ensuring multi-tenant store privacy.",
        "Offline PWA Capability: Service workers cache static assets & offline queue syncs data on reconnection.",
        "Module Breakdown: Sales Terminal, Item Catalog, Supplier Ledger, Expense Tracker, & Customer Credit Logs."
      ],
      specs: [
        { label: "Frontend", val: "React 18 + Vite" },
        { label: "Database", val: "PostgreSQL 15" },
        { label: "Backend BaaS", val: "Supabase" },
        { label: "Architecture", val: "Relational RPC" }
      ]
    },
    turf: {
      tag: "Mobile App // Architecture Specs",
      title: "Turf — Sports Event Coordination",
      description: "Turf addresses local community sports organization through real-time game hosting, player discovery, and venue booking.",
      highlights: [
        "Cross-Platform Native UI: Built using React Native & Expo for smooth 60fps performance on iOS & Android.",
        "Real-Time Chat Engine: Supabase Realtime Channels for group messaging and event updates.",
        "Geolocation & Search: Location-filtered match finding and venue availability.",
        "Payment & Cost Splitting: Automated per-player calculation for turf rentals."
      ],
      specs: [
        { label: "Framework", val: "React Native + Expo" },
        { label: "Language", val: "TypeScript" },
        { label: "Realtime DB", val: "Supabase Subscriptions" },
        { label: "Target", val: "iOS & Android" }
      ]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body-content');

  function openModal(projectKey) {
    const data = modalData[projectKey];
    if (!data || !projectModal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-header">
        <span class="modal-tag">${data.tag}</span>
        <h3 class="modal-title">${data.title}</h3>
      </div>
      <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.98rem;">${data.description}</p>
      
      <div class="modal-section">
        <h4>⚡ Technical Highlights & System Architecture</h4>
        <ul>
          ${data.highlights.map(h => `<li style="margin-bottom: 8px;">${h}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-section">
        <h4>🛠️ Core Tech Stack</h4>
        <div class="modal-specs-grid">
          ${data.specs.map(s => `
            <div class="spec-box">
              <div class="label">${s.label}</div>
              <div class="val">${s.val}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalKey = btn.dataset.modal;
      openModal(modalKey);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ---- Contact Form (Web3Forms API + Mailto Fallback) ----
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('#contact-name').value.trim();
      const email = contactForm.querySelector('#contact-email').value.trim();
      const message = contactForm.querySelector('#contact-message').value.trim();
      const submitBtn = contactForm.querySelector('.form-submit');

      if (!name || !email || !message) {
        showFormStatus('Please fill in all required fields.', 'error');
        return;
      }

      showFormStatus('Sending message...', 'info');
      if (submitBtn) submitBtn.disabled = true;

      try {
        // Submit via Web3Forms free API
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', // Fallbacks to mailto if key is placeholder
            name: name,
            email: email,
            message: message,
            subject: `Portfolio Contact from ${name}`
          })
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
          showFormStatus('Message sent successfully! Thanks for reaching out. 🚀', 'success');
          contactForm.reset();
        } else {
          // Fallback to mailto if API key is unconfigured or failed
          throw new Error('Fallback to mailto');
        }
      } catch (err) {
        const mailto = `mailto:kousthubeswar@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        window.open(mailto, '_blank');
        showFormStatus('Opening email client... Thanks for reaching out! 🚀', 'success');
        contactForm.reset();
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  function showFormStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `form-status ${type}`;
    if (type !== 'info') {
      setTimeout(() => { formStatus.className = 'form-status'; }, 6000);
    }
  }

  // ---- Counter Animation ----
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isDecimal = target % 1 !== 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCount(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = eased * target;
          el.textContent = isDecimal ? current.toFixed(2) + suffix : Math.floor(current) + suffix;
          if (progress < 1) requestAnimationFrame(updateCount);
        }

        requestAnimationFrame(updateCount);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ---- Magnetic Button Effect ----
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform += ` translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ---- Navbar hide/show on scroll direction ----
  let lastScrollY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > lastScrollY && window.scrollY > 300) {
          navbar.style.transform = 'translateY(-100%)';
        } else {
          navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
        ticking = false;
      });
      ticking = true;
    }
  });

  // ---- Hero Terminal Widget Logic ----
  const terminalBody = document.getElementById('terminal-body');
  const termTabs = document.querySelectorAll('.term-tab');

  const termContents = {
    status: `
      <div class="term-line"><span class="term-prompt">$</span> <span>java -version</span></div>
      <div class="term-line"><span class="term-success">✔</span> <span>openjdk 21.0.2 2026-01-20 LTS</span></div>
      <div class="term-line"><span class="term-prompt">$</span> <span>./check_system_health.sh</span></div>
      <div class="term-line"><span class="term-comment">// Querying PostgreSQL RPC Database...</span></div>
      <div class="term-line"><span class="term-success">✔</span> <span>DB Transaction Isolation: READ COMMITTED</span></div>
      <div class="term-line"><span class="term-success">✔</span> <span>Academia: B.Tech CSE @ VIT Vellore (CGPA: 8.48)</span></div>
      <div class="term-line"><span class="term-success">✔</span> <span>Status: Open for SDE & Analyst Roles (2027)</span></div>
    `,
    code: `
      <div class="term-line"><span class="term-keyword">public class</span> <span class="term-prompt">Developer</span> {</div>
      <div class="term-line" style="padding-left: 16px;"><span class="term-keyword">private String</span> name = <span class="term-string">"Kousthub Gadikota"</span>;</div>
      <div class="term-line" style="padding-left: 16px;"><span class="term-keyword">private String[]</span> stack = {<span class="term-string">"Java"</span>, <span class="term-string">"PostgreSQL"</span>, <span class="term-string">"Spring Boot"</span>};</div>
      <div class="term-line" style="padding-left: 16px;"><span class="term-keyword">public void</span> <span class="term-prompt">buildScalableSystems</span>() {</div>
      <div class="term-line" style="padding-left: 32px;"><span class="term-prompt">System.out.println</span>(<span class="term-string">"Production ready code!"</span>);</div>
      <div class="term-line" style="padding-left: 16px;">}</div>
      <div class="term-line">}</div>
    `
  };

  if (terminalBody) {
    terminalBody.innerHTML = termContents.status;

    termTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        termTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const key = tab.dataset.term;
        if (termContents[key]) {
          terminalBody.innerHTML = termContents[key];
        }
      });
    });
  }

  // ---- Command Palette (Ctrl + K / Cmd + K) ----
  const cmdOverlay = document.getElementById('cmd-overlay');
  const cmdInput = document.getElementById('cmd-input');
  const cmdList = document.getElementById('cmd-list');
  const openCmdBtn = document.getElementById('open-cmd-btn');

  function openCommandPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.add('active');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
    filterCmdItems('');
  }

  function closeCommandPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.remove('active');
  }

  function filterCmdItems(query) {
    if (!cmdList) return;
    const items = cmdList.querySelectorAll('.cmd-item');
    const q = query.toLowerCase().trim();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  }

  if (openCmdBtn) openCmdBtn.addEventListener('click', openCommandPalette);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdOverlay && cmdOverlay.classList.contains('active')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === 'Escape' && cmdOverlay && cmdOverlay.classList.contains('active')) {
      closeCommandPalette();
    }
  });

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => filterCmdItems(e.target.value));
  }

  if (cmdOverlay) {
    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) closeCommandPalette();
    });
  }

  if (cmdList) {
    cmdList.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        const target = item.dataset.target;

        closeCommandPalette();

        if (action === 'goto' && target) {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'copy-email') {
          navigator.clipboard.writeText('kousthubeswar@gmail.com');
          showFormStatus('Email address copied to clipboard! 📋', 'success');
        } else if (action === 'download-resume') {
          const a = document.createElement('a');
          a.href = 'assets/resume.pdf';
          a.download = 'Kousthub_Resume.pdf';
          a.click();
        } else if (action === 'open-github') {
          window.open('https://github.com/kousthub-eswar', '_blank');
        }
      });
    });
  }

});


