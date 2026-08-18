/* ============================================
   MAIN.JS V4 — NEXT-GEN INTERACTIVE ENGINE
   Web Audio API Synth, Holographic Specular Shine,
   Interactive Hacker Terminal, Elastic Physics
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Global mouse position
  let globalMouseX = window.innerWidth / 2, globalMouseY = window.innerHeight / 2;
  document.addEventListener('mousemove', (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
  });

  // ============================================================
  // 1. WEB AUDIO API SYNTHESIZER (Futuristic Sci-Fi Audio FX)
  // ============================================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('kg_portfolio_sound') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.04) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) { }
    }

    playHover() {
      this.playTone(850, 'sine', 0.04, 0.02);
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      } catch (e) { }
    }

    playSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.12, 0.04), i * 70);
      });
    }

    playKey() {
      this.playTone(1200 + Math.random() * 400, 'sine', 0.03, 0.015);
    }

    /* ---- Ambient Generative Drone Soundscape ---- */
    startAmbient() {
      if (!this.enabled || this.ambientActive) return;
      this.init();
      if (!this.ctx) return;

      try {
        this.ambientActive = true;

        // Sub bass pad
        this.ambOsc1 = this.ctx.createOscillator();
        this.ambOsc1.type = 'sine';
        this.ambOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1

        // Harmonic overtone
        this.ambOsc2 = this.ctx.createOscillator();
        this.ambOsc2.type = 'sine';
        this.ambOsc2.frequency.setValueAtTime(110, this.ctx.currentTime); // A2

        // LFO for gentle amplitude modulation
        this.ambLFO = this.ctx.createOscillator();
        this.ambLFO.type = 'sine';
        this.ambLFO.frequency.setValueAtTime(0.15, this.ctx.currentTime);

        this.ambLFOGain = this.ctx.createGain();
        this.ambLFOGain.gain.setValueAtTime(0.004, this.ctx.currentTime);

        // Biquad filter for scroll-reactive warmth
        this.ambFilter = this.ctx.createBiquadFilter();
        this.ambFilter.type = 'lowpass';
        this.ambFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
        this.ambFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

        // Stereo panner for mouse-reactive spatialization
        this.ambPanner = this.ctx.createStereoPanner();
        this.ambPanner.pan.setValueAtTime(0, this.ctx.currentTime);

        // Master gain (very quiet)
        this.ambGain1 = this.ctx.createGain();
        this.ambGain1.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambGain1.gain.linearRampToValueAtTime(0.012, this.ctx.currentTime + 3);

        this.ambGain2 = this.ctx.createGain();
        this.ambGain2.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambGain2.gain.linearRampToValueAtTime(0.006, this.ctx.currentTime + 4);

        // Wire it up
        this.ambLFO.connect(this.ambLFOGain);
        this.ambLFOGain.connect(this.ambGain1.gain);

        this.ambOsc1.connect(this.ambGain1);
        this.ambOsc2.connect(this.ambGain2);

        this.ambGain1.connect(this.ambFilter);
        this.ambGain2.connect(this.ambFilter);

        this.ambFilter.connect(this.ambPanner);
        this.ambPanner.connect(this.ctx.destination);

        this.ambOsc1.start();
        this.ambOsc2.start();
        this.ambLFO.start();
      } catch (e) { }
    }

    stopAmbient() {
      if (!this.ambientActive) return;
      try {
        const now = this.ctx.currentTime;
        this.ambGain1.gain.linearRampToValueAtTime(0, now + 2);
        this.ambGain2.gain.linearRampToValueAtTime(0, now + 2);
        setTimeout(() => {
          try {
            this.ambOsc1.stop();
            this.ambOsc2.stop();
            this.ambLFO.stop();
          } catch (e) { }
          this.ambientActive = false;
        }, 2500);
      } catch (e) {
        this.ambientActive = false;
      }
    }

    /** Update ambient filter/pan based on scroll and mouse position */
    updateAmbient(scrollProgress, mouseXNorm) {
      if (!this.ambientActive || !this.ambFilter) return;
      try {
        const now = this.ctx.currentTime;
        // Scroll down = warmer (lower cutoff): 600 → 200
        const cutoff = 600 - scrollProgress * 400;
        this.ambFilter.frequency.linearRampToValueAtTime(Math.max(cutoff, 100), now + 0.1);
        // Mouse X panning: -1 (left) to 1 (right)
        this.ambPanner.pan.linearRampToValueAtTime(mouseXNorm * 0.5, now + 0.1);
      } catch (e) { }
    }
  }

  const sound = new SoundEngine();

  // Sound Toggle Button Logic
  const soundToggleBtn = document.getElementById('sound-toggle');
  function updateSoundButton() {
    if (!soundToggleBtn) return;
    if (sound.enabled) {
      soundToggleBtn.innerHTML = '<span>🔊 Audio ON</span>';
      soundToggleBtn.classList.remove('muted');
      soundToggleBtn.setAttribute('aria-label', 'Mute Sound Effects');
    } else {
      soundToggleBtn.innerHTML = '<span>🔇 Audio OFF</span>';
      soundToggleBtn.classList.add('muted');
      soundToggleBtn.setAttribute('aria-label', 'Enable Sound Effects');
    }
  }

  if (soundToggleBtn) {
    updateSoundButton();
    soundToggleBtn.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      localStorage.setItem('kg_portfolio_sound', sound.enabled);
      if (sound.enabled) {
        sound.init();
        sound.playSuccess();
        sound.startAmbient();
      } else {
        sound.stopAmbient();
      }
      updateSoundButton();
    });

    // Start ambient if sound was previously enabled
    if (sound.enabled) {
      // Defer to first user interaction
      const startAmbientOnce = () => {
        sound.startAmbient();
        document.removeEventListener('click', startAmbientOnce);
        document.removeEventListener('scroll', startAmbientOnce);
      };
      document.addEventListener('click', startAmbientOnce);
      document.addEventListener('scroll', startAmbientOnce);
    }
  }

  // Attach sound triggers to interactive elements
  const audioHoverSelectors = 'a, button, .filter-btn, .skill-item, .tech-badge, .cs-card, .stat-card';
  document.querySelectorAll(audioHoverSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => sound.playHover());
    el.addEventListener('click', () => sound.playClick());
  });

  // ============================================================
  // 2. CUSTOM ANIMATED DUAL-RING CURSOR
  // ============================================================
  if (!isTouchDevice && !prefersReducedMotion) {
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    const cursorRing = document.createElement('div');
    cursorRing.classList.add('cursor-ring');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    document.body.classList.add('custom-cursor');

    let dotX = globalMouseX, dotY = globalMouseY;
    let ringX = globalMouseX, ringY = globalMouseY;

    function animateCursor() {
      dotX += (globalMouseX - dotX) * 0.28;
      dotY += (globalMouseY - dotY) * 0.28;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';

      ringX += (globalMouseX - ringX) * 0.12;
      ringY += (globalMouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveSelectors = 'a, button, .skill-item, .tech-badge, .cs-tag, .filter-btn, .metric-badge, input, textarea, .hero-social-link, .btn-icon, .term-input';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorDot.classList.add('hover');
        cursorRing.classList.add('hover');
      }
      if (e.target.closest('h1, h2, h3, .hero-name, .section-title')) {
        cursorRing.classList.add('text');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorDot.classList.remove('hover');
        cursorRing.classList.remove('hover');
      }
      if (e.target.closest('h1, h2, h3, .hero-name, .section-title')) {
        cursorRing.classList.remove('text');
      }
    });

    document.addEventListener('mousedown', () => {
      cursorDot.classList.add('click');
      cursorRing.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
      cursorDot.classList.remove('click');
      cursorRing.classList.remove('click');
    });
  }

  // ============================================================
  // 3. LOADING CURTAIN
  // ============================================================
  const curtain = document.getElementById('loading-curtain');
  if (curtain) {
    const hideCurtain = () => {
      setTimeout(() => {
        curtain.classList.add('loaded');
        setTimeout(() => curtain.remove(), 700);
      }, 350);
    };

    if (document.readyState === 'complete') hideCurtain();
    else window.addEventListener('load', hideCurtain);
  }

  // ============================================================
  // 4. NAVBAR & ACTIVE NAVIGATION HIGHLIGHT
  // ============================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navPill = document.getElementById('nav-pill');
  const navLinksContainer = document.querySelector('.nav-links');

  function moveNavPill(target) {
    if (!navPill || !navLinksContainer || !target) return;
    const rect = target.getBoundingClientRect();
    const parentRect = navLinksContainer.getBoundingClientRect();
    navPill.style.width = rect.width + 'px';
    navPill.style.height = rect.height + 'px';
    navPill.style.left = (rect.left - parentRect.left) + 'px';
    navPill.style.top = (rect.top - parentRect.top) + 'px';
    navPill.style.opacity = '1';
  }

  // ============================================================
  // 4A. SCROLL VELOCITY TRACKER
  //     Drives: chromatic aberration, nav pill stretch, ambient audio
  // ============================================================
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();
  let scrollVelocity = 0;
  let scrollVelocitySmooth = 0;

  function trackScrollVelocity() {
    const now = performance.now();
    const dt = now - lastScrollTime;
    if (dt > 0) {
      const rawVelocity = Math.abs(window.scrollY - lastScrollY) / (dt / 16);
      scrollVelocity = Math.min(rawVelocity, 30);
      scrollVelocitySmooth += (scrollVelocity - scrollVelocitySmooth) * 0.15;

      // Drive chromatic aberration via CSS custom property
      document.documentElement.style.setProperty('--scroll-velocity', scrollVelocitySmooth.toFixed(2));

      // Drive nav pill elastic stretch
      if (navPill) {
        const stretchX = 1 + scrollVelocitySmooth * 0.008;
        const stretchY = 1 - scrollVelocitySmooth * 0.003;
        navPill.style.transform = `scaleX(${stretchX.toFixed(3)}) scaleY(${stretchY.toFixed(3)})`;
      }

      // Drive ambient audio modulation
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
      const mouseXNorm = (globalMouseX / window.innerWidth) * 2 - 1;
      sound.updateAmbient(scrollProgress, mouseXNorm);

      lastScrollY = window.scrollY;
      lastScrollTime = now;
    }
    requestAnimationFrame(trackScrollVelocity);
  }
  requestAnimationFrame(trackScrollVelocity);

  function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 160;
      if (window.scrollY >= top && window.scrollY < top + section.offsetHeight) {
        current = section.getAttribute('id');
      }
    });

    let foundActive = false;
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        foundActive = true;
        if (navPill && !navLinksContainer.matches(':hover')) {
          moveNavPill(link);
        }
      }
    });

    if (!foundActive && navPill && !navLinksContainer.matches(':hover')) {
      navPill.style.opacity = '0';
    }
  }

  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  if (navPill && navLinksContainer) {
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => moveNavPill(link));
    });
    navLinksContainer.addEventListener('mouseleave', () => {
      const activeLink = document.querySelector('.nav-link.active');
      if (activeLink) moveNavPill(activeLink);
      else navPill.style.opacity = '0';
    });
  }

  // Mobile Menu
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
  // 5. DYNAMIC TYPING EFFECT
  // ============================================================
  const typedElement = document.getElementById('typed-text');
  if (typedElement) {
    const strings = [
      'Backend Developer',
      'Java & Spring Boot Engineer',
      'Database Architect (PostgreSQL)',
      'Full-Stack Product Builder',
      'CS Student @ VIT Vellore',
    ];
    let stringIndex = 0, charIndex = 0, isDeleting = false, speed = 75;

    function type() {
      const current = strings[stringIndex];
      if (isDeleting) {
        typedElement.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        speed = 30;
      } else {
        typedElement.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        speed = 65 + Math.random() * 25;
      }

      if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        speed = 350;
      }
      setTimeout(type, speed);
    }
    setTimeout(type, 700);
  }

  // ============================================================
  // 6. 3D HOLOGRAPHIC FOIL & CARD TILT
  // ============================================================
  function initHolographicCards(selector, intensity = 8) {
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

        // Calculate specular reflection angle
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
        card.style.setProperty('--holo-angle', angle + 'deg');
        card.style.transition = 'transform 0.08s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  initHolographicCards('.glass-card', 6);
  initHolographicCards('.skill-category', 6);
  initHolographicCards('.stat-card', 10);
  initHolographicCards('.cs-card', 6);
  initHolographicCards('.education-card', 4);
  initHolographicCards('.timeline-card', 5);

  // ============================================================
  // 7. ELASTIC MAGNETIC PULL PHYSICS
  // ============================================================
  if (!isTouchDevice && !prefersReducedMotion) {
    const magneticElements = document.querySelectorAll(
      '.btn-primary, .btn-secondary, .hero-social-link, .btn-icon, .nav-resume-btn, .filter-btn, .sound-toggle-btn'
    );

    magneticElements.forEach(el => {
      let currentX = 0, currentY = 0;
      let targetX = 0, targetY = 0;
      let isAnimating = false;

      function animate() {
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        currentX += dx * 0.18;
        currentY += dy * 0.18;
        el.style.transform = `translate(${currentX}px, ${currentY}px)`;

        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
          requestAnimationFrame(animate);
        } else {
          isAnimating = false;
          if (targetX === 0 && targetY === 0) el.style.transform = '';
        }
      }

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        targetX = (e.clientX - rect.left - rect.width / 2) * 0.35;
        targetY = (e.clientY - rect.top - rect.height / 2) * 0.35;
        if (!isAnimating) {
          isAnimating = true;
          animate();
        }
      });

      el.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        if (!isAnimating) {
          isAnimating = true;
          animate();
        }
      });
    });
  }

  // ============================================================
  // 8. RIPPLE EFFECT ON CLICKS
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

  document.querySelectorAll('.btn, .filter-btn, .hero-social-link, .btn-icon, .nav-resume-btn, .sound-toggle-btn').forEach(el => {
    el.addEventListener('click', (e) => createRipple(e, el));
  });

  // ============================================================
  // 9. SCROLL REVEAL (Staggered Children & Title Entrance)
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        const staggerChildren = entry.target.querySelectorAll(
          '.skill-category, .skill-item, .cs-card, .stat-card, .timeline-item, .education-card, .filter-btn'
        );
        staggerChildren.forEach((child, i) => {
          child.style.transitionDelay = `${i * 60}ms`;
          child.classList.add('stagger-in');
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================================
  // 9A. CINEMATIC TEXT-SPLIT CHARACTER ANIMATION
  // ============================================================
  if (!prefersReducedMotion) {
    const splitTargets = document.querySelectorAll('.section-title');
    splitTargets.forEach(title => {
      // Don't re-split if already split
      if (title.querySelector('.char-split')) return;

      const html = title.innerHTML;
      // Handle the gradient-text span preservation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      function splitTextNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const fragment = document.createDocumentFragment();
          let charIndex = 0;
          for (const char of text) {
            const span = document.createElement('span');
            span.className = char === ' ' ? 'char-split space' : 'char-split';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${charIndex * 30}ms`;
            fragment.appendChild(span);
            charIndex++;
          }
          node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Process children of elements like <span class="gradient-text">
          const children = Array.from(node.childNodes);
          children.forEach(child => splitTextNode(child));
        }
      }

      const children = Array.from(tempDiv.childNodes);
      title.innerHTML = '';
      children.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          splitTextNode(child);
          const spans = document.createDocumentFragment();
          // Already processed, but since we replace, re-process from tempDiv
        } else {
          title.appendChild(child);
        }
      });

      // Simpler approach: directly work on title
      title.innerHTML = html; // Reset
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }

      let globalCharIdx = 0;
      textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const frag = document.createDocumentFragment();
        for (const char of text) {
          const span = document.createElement('span');
          span.className = char.trim() === '' ? 'char-split space' : 'char-split';
          span.textContent = char.trim() === '' ? '\u00A0' : char;
          span.style.transitionDelay = `${globalCharIdx * 28}ms`;
          frag.appendChild(span);
          globalCharIdx++;
        }
        textNode.parentNode.replaceChild(frag, textNode);
      });
    });
  }

  // ============================================================
  // 12. PARALLAX MOUSE DEPTH LAYERS
  // ============================================================
  if (!isTouchDevice && !prefersReducedMotion) {
    const heroOrbs = document.querySelectorAll('.hero-orb');
    const floatElements = document.querySelectorAll('.about-float-element');

    let pMouseX = 0, pMouseY = 0;
    let pCurX = 0, pCurY = 0;

    document.addEventListener('mousemove', (e) => {
      pMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      pMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateParallax() {
      pCurX += (pMouseX - pCurX) * 0.05;
      pCurY += (pMouseY - pCurY) * 0.05;

      heroOrbs.forEach((orb, i) => {
        const depth = (i + 1) * 16;
        orb.style.transform = `translate(${pCurX * depth}px, ${pCurY * depth}px)`;
      });

      floatElements.forEach((el, i) => {
        const depth = (i + 1) * 10;
        const bounce = Math.sin(Date.now() / 1000 + i * 2) * 6;
        el.style.transform = `translate(${pCurX * depth}px, ${pCurY * depth + bounce}px)`;
      });

      requestAnimationFrame(animateParallax);
    }
    animateParallax();
  }

  // ============================================================
  // 12A. CURSOR GLOW TRAIL (Comet Tail Effect)
  // ============================================================
  if (!isTouchDevice && !prefersReducedMotion) {
    const trailColors = [
      'rgba(0, 240, 255, 0.7)',
      'rgba(0, 255, 159, 0.7)',
      'rgba(121, 40, 202, 0.7)',
      'rgba(56, 239, 125, 0.7)',
      'rgba(0, 229, 255, 0.7)',
    ];
    let lastTrailTime = 0;
    let trailMouseX = 0, trailMouseY = 0;
    let prevTrailX = 0, prevTrailY = 0;

    document.addEventListener('mousemove', (e) => {
      trailMouseX = e.clientX;
      trailMouseY = e.clientY;
    });

    function spawnTrailDot() {
      const now = performance.now();
      const dx = trailMouseX - prevTrailX;
      const dy = trailMouseY - prevTrailY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 3 && now - lastTrailTime > 30) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail-dot';
        const color = trailColors[Math.floor(Math.random() * trailColors.length)];
        const size = 4 + Math.min(speed * 0.15, 8);
        dot.style.left = (trailMouseX - size / 2) + 'px';
        dot.style.top = (trailMouseY - size / 2) + 'px';
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.background = `radial-gradient(circle, ${color}, transparent)`;
        dot.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        document.body.appendChild(dot);

        dot.addEventListener('animationend', () => dot.remove());
        lastTrailTime = now;
      }

      prevTrailX = trailMouseX;
      prevTrailY = trailMouseY;
      requestAnimationFrame(spawnTrailDot);
    }
    requestAnimationFrame(spawnTrailDot);
  }

  // ============================================================
  // 13. PROJECT FILTERS & MODAL
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
          card.style.transitionDelay = `${i * 50}ms`;
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

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
    clubhub: {
      tag: "Web App // Architecture Specs",
      title: "Campus ClubHub — Student Club & Event Portal",
      description: "Campus ClubHub is a role-segregated event platform that streamlines club event management with digital passes, real-time dashboards, and institutional auth flows.",
      highlights: [
        "Role-Based Authentication: Separate student and organizer flows based on institutional email domains.",
        "Digital Event Passes: Real-time SVG QR code generation for instant pass creation and verification.",
        "Calendar Integration: Google Calendar and .ics sync for seamless door verification workflows.",
        "Organizer Console: Live occupancy/registration KPIs, real-time attendee rosters, and CSV data export."
      ],
      specs: [
        { label: "Frontend", val: "React 19 + TypeScript" },
        { label: "Build Tool", val: "Vite" },
        { label: "Styling", val: "Tailwind CSS" },
        { label: "Architecture", val: "Role-Segregated SPA" }
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
    sound.playSuccess();
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.modal);
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
  // 14. STAT COUNTER ANIMATIONS
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isDecimal = target % 1 !== 0;
        const duration = 1600;
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
  // 15. TIMELINE DRAW & SCROLL INDICATOR
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

  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      }
    }, { passive: true });
  }

  // ============================================================
  // 16. CONTACT FORM SUBMISSION
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

      showFormStatus('Transmitting message across network...', 'info');
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
          showFormStatus('Message transmitted successfully! 🚀', 'success');
          sound.playSuccess();
          contactForm.reset();
        } else {
          throw new Error('Fallback to mailto');
        }
      } catch (err) {
        const mailto = `mailto:kousthubeswar@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        window.open(mailto, '_blank');
        showFormStatus('Opening email client... Thanks for connecting! 🚀', 'success');
        sound.playSuccess();
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

});
    }
  }

});
