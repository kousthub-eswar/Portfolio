/* ============================================
   MAIN.JS V3 — Ultra-Interactive Portfolio Engine
   Custom Cursor, Magnetic Pull, Ripple Effects,
   Text Scramble, Parallax, Spring Physics
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Global mouse position
  let globalMouseX = 0, globalMouseY = 0;
  document.addEventListener('mousemove', (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
  });

  // ============================================================
  // 1. CUSTOM ANIMATED CURSOR (dual-ring)
  // ============================================================
  if (!isTouchDevice && !prefersReducedMotion) {
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    const cursorRing = document.createElement('div');
    cursorRing.classList.add('cursor-ring');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    document.body.classList.add('custom-cursor');

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    function animateCursor() {
      dotX += (globalMouseX - dotX) * 0.25;
      dotY += (globalMouseY - dotY) * 0.25;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';

      ringX += (globalMouseX - ringX) * 0.1;
      ringY += (globalMouseY - ringY) * 0.1;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states — grow ring on interactive elements
    const interactiveSelectors = 'a, button, .skill-item, .tech-badge, .cs-tag, .filter-btn, .metric-badge, input, textarea, .hero-social-link, .btn-icon';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorDot.classList.add('hover');
        cursorRing.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorDot.classList.remove('hover');
        cursorRing.classList.remove('hover');
      }
    });

    // Click effect — squeeze ring
    document.addEventListener('mousedown', () => {
      cursorDot.classList.add('click');
      cursorRing.classList.add('click');
    });
    document.addEventListener('mouseup', () => {
      cursorDot.classList.remove('click');
      cursorRing.classList.remove('click');
    });

    // Text hover — blend mode spotlight
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('h1, h2, h3, .hero-name, .section-title')) {
        cursorRing.classList.add('text');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('h1, h2, h3, .hero-name, .section-title')) {
        cursorRing.classList.remove('text');
      }
    });
  }

  // ============================================================
  // 2. LOADING CURTAIN
  // ============================================================
  const curtain = document.getElementById('loading-curtain');
  if (curtain) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        curtain.classList.add('loaded');
        setTimeout(() => curtain.remove(), 800);
      }, 400);
    });
    // Fallback in case load already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        curtain.classList.add('loaded');
        setTimeout(() => curtain.remove(), 800);
      }, 400);
    }
  }

  // ============================================================
  // 3. NAVBAR
  // ============================================================
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

    // Update nav pill to active link position
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink && navPill) {
      moveNavPill(activeLink);
    }
  }

  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // ============================================================
  // 4. NAV SLIDING PILL
  // ============================================================
  const navPill = document.getElementById('nav-pill');
  const navLinksContainer = document.querySelector('.nav-links');

  function moveNavPill(target) {
    if (!navPill || !navLinksContainer) return;
    const rect = target.getBoundingClientRect();
    const parentRect = navLinksContainer.getBoundingClientRect();
    navPill.style.width = rect.width + 'px';
    navPill.style.height = rect.height + 'px';
    navPill.style.left = (rect.left - parentRect.left) + 'px';
    navPill.style.top = (rect.top - parentRect.top) + 'px';
    navPill.style.opacity = '1';
  }

  if (navPill && navLinksContainer) {
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => moveNavPill(link));
    });

    navLinksContainer.addEventListener('mouseleave', () => {
      const activeLink = document.querySelector('.nav-link.active');
      if (activeLink) {
        moveNavPill(activeLink);
      } else {
        navPill.style.opacity = '0';
      }
    });
  }

  // ============================================================
  // 5. MOBILE MENU
  // ============================================================
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

  // ============================================================
  // 6. TYPING EFFECT
  // ============================================================
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
        speed = 70 + Math.random() * 30;
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

  // ============================================================
  // 7. 3D TILT EFFECT ON CARDS
  // ============================================================
  function initTilt(selector, intensity = 8) {
    if (isTouchDevice || prefersReducedMotion) return;
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
  initTilt('.cs-card', 5);

  // ============================================================
  // 8. CARD SPOTLIGHT (Enhanced glow trail + border gradient)
  // ============================================================
  function initSpotlight(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
      const spotlight = document.createElement('div');
      spotlight.className = 'card-spotlight';
      card.prepend(spotlight);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotlight.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.07), transparent 40%)`;

        // Set CSS custom properties for border gradient
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  initSpotlight('.glass-card');

  // ============================================================
  // 9. MAGNETIC PULL — Spring Physics (fixed)
  // ============================================================
  if (!isTouchDevice && !prefersReducedMotion) {
    const magneticElements = document.querySelectorAll(
      '.btn-primary, .btn-secondary, .hero-social-link, .btn-icon, .nav-resume-btn, .filter-btn'
    );

    magneticElements.forEach(el => {
      let currentX = 0, currentY = 0;
      let targetX = 0, targetY = 0;
      let isAnimating = false;

      function animateMagnetic() {
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        currentX += dx * 0.15;
        currentY += dy * 0.15;
        el.style.transform = `translate(${currentX}px, ${currentY}px)`;

        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
          requestAnimationFrame(animateMagnetic);
        } else {
          isAnimating = false;
          if (targetX === 0 && targetY === 0) {
            el.style.transform = '';
          }
        }
      }

      function startAnim() {
        if (!isAnimating) {
          isAnimating = true;
          animateMagnetic();
        }
      }

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        targetX = (e.clientX - rect.left - rect.width / 2) * 0.3;
        targetY = (e.clientY - rect.top - rect.height / 2) * 0.3;
        startAnim();
      });

      el.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        startAnim();
      });
    });
  }

  // ============================================================
  // 10. RIPPLE EFFECT ON CLICK
  // ============================================================
  function createRipple(e, element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    element.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  document.querySelectorAll('.btn, .filter-btn, .hero-social-link, .btn-icon, .nav-resume-btn').forEach(el => {
    el.addEventListener('click', (e) => createRipple(e, el));
  });

  // ============================================================
  // 11. SCROLL REVEAL — Staggered Children
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Stagger children individually
        const staggerChildren = entry.target.querySelectorAll(
          '.skill-category, .skill-item, .cs-card, .stat-card, .timeline-item, .education-card, .contact-detail-item, .filter-btn'
        );
        staggerChildren.forEach((child, i) => {
          child.style.transitionDelay = `${i * 70}ms`;
          child.classList.add('stagger-in');
        });

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================================
  // 12. TEXT SCRAMBLE EFFECT ON SECTION TITLES
  // ============================================================
  if (!prefersReducedMotion) {
    class TextScramble {
      constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.originalHTML = el.innerHTML;
        this.triggered = false;
      }

      scramble() {
        if (this.triggered) return;
        this.triggered = true;

        // Extract text content but preserve HTML tags
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.originalHTML;
        const textContent = tempDiv.textContent || tempDiv.innerText;
        const length = textContent.length;
        let iteration = 0;
        const maxIterations = length * 2.5;

        const interval = setInterval(() => {
          let result = '';
          for (let i = 0; i < textContent.length; i++) {
            const char = textContent[i];
            if (char === ' ' || char === '\n') {
              result += char;
            } else if (i < iteration / 2.5) {
              result += textContent[i];
            } else {
              result += this.chars[Math.floor(Math.random() * this.chars.length)];
            }
          }
          this.el.textContent = result;
          iteration++;

          if (iteration >= maxIterations) {
            clearInterval(interval);
            this.el.innerHTML = this.originalHTML;
          }
        }, 22);
      }
    }

    const scrambleTargets = document.querySelectorAll('.section-title');
    const scrambleInstances = [];

    scrambleTargets.forEach(el => {
      scrambleInstances.push(new TextScramble(el));
    });

    const scrambleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(scrambleTargets).indexOf(entry.target);
          if (index >= 0) scrambleInstances[index].scramble();
          scrambleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    scrambleTargets.forEach(el => scrambleObserver.observe(el));
  }

  // ============================================================
  // 13. MOUSE PARALLAX — Hero Orbs & Floating Elements
  // ============================================================
  if (!isTouchDevice && !prefersReducedMotion) {
    const heroOrbs = document.querySelectorAll('.hero-orb');
    const floatElements = document.querySelectorAll('.about-float-element');

    let parallaxMouseX = 0, parallaxMouseY = 0;
    let parallaxCurrentX = 0, parallaxCurrentY = 0;

    document.addEventListener('mousemove', (e) => {
      parallaxMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      parallaxMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateParallax() {
      parallaxCurrentX += (parallaxMouseX - parallaxCurrentX) * 0.05;
      parallaxCurrentY += (parallaxMouseY - parallaxCurrentY) * 0.05;

      heroOrbs.forEach((orb, i) => {
        const depth = (i + 1) * 15;
        orb.style.transform = `translate(${parallaxCurrentX * depth}px, ${parallaxCurrentY * depth}px)`;
      });

      floatElements.forEach((el, i) => {
        const depth = (i + 1) * 8;
        const baseFloat = Math.sin(Date.now() / 1000 + i * 2) * 6;
        el.style.transform = `translate(${parallaxCurrentX * depth}px, ${parallaxCurrentY * depth + baseFloat}px)`;
      });

      requestAnimationFrame(animateParallax);
    }
    animateParallax();
  }

  // ============================================================
  // 14. SMOOTH SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ============================================================
  // 15. PROJECT CATEGORY FILTERS
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card, i) => {
        const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
        if (filter === 'all' || categories.includes(filter)) {
          card.style.transitionDelay = `${i * 60}ms`;
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

  // ============================================================
  // 16. QUICK SPECS MODAL
  // ============================================================
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

  // ============================================================
  // 17. CONTACT FORM (Web3Forms + Mailto Fallback)
  // ============================================================
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
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
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

  // ============================================================
  // 18. COUNTER ANIMATION
  // ============================================================
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

  // ============================================================
  // 19. NAVBAR HIDE/SHOW ON SCROLL
  // ============================================================
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

  // ============================================================
  // 20. TIMELINE DRAW ANIMATION
  // ============================================================
  const timeline = document.querySelector('.timeline');
  if (timeline && !prefersReducedMotion) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('timeline-animate');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    timelineObserver.observe(timeline);
  }

  // ============================================================
  // 21. SCROLL INDICATOR AUTO-HIDE
  // ============================================================
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    let hasScrolled = false;
    window.addEventListener('scroll', () => {
      if (!hasScrolled && window.scrollY > 100) {
        hasScrolled = true;
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
        scrollIndicator.style.transition = 'all 0.6s var(--ease-out-expo)';
      }
    }, { passive: true });
  }

  // ============================================================
  // 22. FORM INPUT GLOW ANIMATION
  // ============================================================
  document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });

  // ============================================================
  // 23. SOCIAL ICONS ROTATE ON HOVER
  // ============================================================
  if (!prefersReducedMotion) {
    document.querySelectorAll('.hero-social-link, .btn-icon').forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        const svg = icon.querySelector('svg');
        if (svg) {
          svg.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
          svg.style.transform = 'rotate(12deg) scale(1.15)';
        }
      });
      icon.addEventListener('mouseleave', () => {
        const svg = icon.querySelector('svg');
        if (svg) {
          svg.style.transform = 'rotate(0deg) scale(1)';
        }
      });
    });
  }

  // ============================================================
  // 24. TECH BADGE SHIMMER ON HOVER
  // ============================================================
  document.querySelectorAll('.tech-badge, .cs-tag, .metric-badge').forEach(badge => {
    badge.classList.add('shimmer-hover');
  });

});
