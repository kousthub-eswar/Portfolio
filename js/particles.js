/* ============================================
   CYBER-AURORA FLUID VORTEX & PARTICLE ENGINE
   Gravitational field, hyperspace shockwaves,
   and dynamic node constellation network.
   ============================================ */

class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.shockwaves = [];
    this.mouse = { x: null, y: null, prevX: null, prevY: null, vx: 0, vy: 0, radius: 220, isDown: false };
    this.animationId = null;
    this.isRunning = false;

    // Cyber-Aurora Palette
    this.config = {
      particleCount: 110,
      particleMinRadius: 1.0,
      particleMaxRadius: 3.0,
      particleSpeed: 0.35,
      lineDistance: 150,
      lineOpacity: 0.15,
      mouseLineDistance: 240,
      mouseLineOpacity: 0.35,
      colors: [
        { r: 0, g: 240, b: 255 },   // Electric Cyan
        { r: 0, g: 255, b: 159 },   // Neon Laser Emerald
        { r: 121, g: 40, b: 202 },  // Hyper Ultraviolet
        { r: 255, g: 45, b: 85 },   // Laser Sunset Rose
        { r: 56, g: 239, b: 125 },  // Bright Mint
      ],
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.addEventListeners();
    this.start();
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(dpr, dpr);
    this.displayWidth = rect.width;
    this.displayHeight = rect.height;
  }

  createParticles() {
    this.particles = [];
    const count = Math.min(
      this.config.particleCount,
      Math.floor((this.displayWidth * this.displayHeight) / 8500)
    );

    for (let i = 0; i < count; i++) {
      const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
      this.particles.push({
        x: Math.random() * this.displayWidth,
        y: Math.random() * this.displayHeight,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        radius: Math.random() * (this.config.particleMaxRadius - this.config.particleMinRadius) + this.config.particleMinRadius,
        color: color,
        baseColor: color,
        opacity: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  addEventListeners() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.createParticles();
      }, 200);
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.mouse.prevX !== null) {
        this.mouse.vx = x - this.mouse.prevX;
        this.mouse.vy = y - this.mouse.prevY;
      }

      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
      this.mouse.x = x;
      this.mouse.y = y;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
      this.mouse.prevX = null;
      this.mouse.prevY = null;
    });

    // Hyperspace shockwave burst on click
    window.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      // Only trigger if click is near hero area
      if (e.clientY < window.innerHeight * 1.2) {
        this.shockwaves.push({
          x: cx,
          y: cy,
          radius: 10,
          maxRadius: 280,
          opacity: 0.9,
          speed: 7,
          color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)]
        });

        // Spawn explosive emitter particles
        const burstCount = 18;
        for (let i = 0; i < burstCount; i++) {
          const angle = (Math.PI * 2 / burstCount) * i + (Math.random() * 0.4);
          const speed = 2.5 + Math.random() * 3.5;
          const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];

          this.particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 2.8 + 1.2,
            color: color,
            baseColor: color,
            opacity: 0.95,
            pulseSpeed: 0.03,
            pulseOffset: Math.random() * Math.PI * 2,
            life: 1.0,
            isBurst: true,
          });
        }
      }
    });
  }

  drawParticle(p, time) {
    const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.4 + 0.6;
    const { r, g, b } = p.color;

    // Glowing outer aura
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.radius * 4.5 * pulse, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.06 * pulse})`;
    this.ctx.fill();

    // Vibrant core
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * pulse})`;
    this.ctx.shadowBlur = 12;
    this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  drawLines() {
    const count = this.particles.length;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.config.lineDistance) {
          const opacity = (1 - dist / this.config.lineDistance) * this.config.lineOpacity;
          const c1 = this.particles[i].color;
          const c2 = this.particles[j].color;

          const gradient = this.ctx.createLinearGradient(
            this.particles[i].x, this.particles[i].y,
            this.particles[j].x, this.particles[j].y
          );
          gradient.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, ${opacity})`);
          gradient.addColorStop(1, `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${opacity})`);

          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 0.75;
          this.ctx.stroke();
        }
      }

      // Dynamic mouse connection beams
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.particles[i].x - this.mouse.x;
        const dy = this.particles[i].y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.config.mouseLineDistance) {
          const opacity = (1 - dist / this.config.mouseLineDistance) * this.config.mouseLineOpacity;
          const c = this.particles[i].color;

          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity * 1.2})`;
          this.ctx.lineWidth = 1.2;
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, 0.5)`;
          this.ctx.stroke();
          this.ctx.shadowBlur = 0;
        }
      }
    }
  }

  drawShockwaves() {
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.opacity *= 0.94;

      const { r, g, b } = sw.color;
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${sw.opacity})`;
      this.ctx.lineWidth = 2.5 * (1 - sw.radius / sw.maxRadius);
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Distort particles in shockwave path
      for (const p of this.particles) {
        const dx = p.x - sw.x;
        const dy = p.y - sw.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - sw.radius) < 30) {
          const force = 3.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      if (sw.opacity <= 0.01 || sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Burst particle decay
      if (p.isBurst) {
        p.life -= 0.012;
        p.opacity = p.life * 0.95;
        p.vx *= 0.96;
        p.vy *= 0.96;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
      }

      // Edge bouncing
      if (p.x < 0 || p.x > this.displayWidth) p.vx *= -1;
      if (p.y < 0 || p.y > this.displayHeight) p.vy *= -1;

      // Gravitational Vortex Pull from Cursor
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius && dist > 0) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          // Gravitational swirl physics
          const angle = Math.atan2(dy, dx);
          const tangentAngle = angle + Math.PI / 2;

          p.vx += (dx / dist) * force * 0.035 + Math.cos(tangentAngle) * force * 0.025;
          p.vy += (dy / dist) * force * 0.035 + Math.sin(tangentAngle) * force * 0.025;

          // Drag velocity transfer
          if (Math.abs(this.mouse.vx) > 0.5 || Math.abs(this.mouse.vy) > 0.5) {
            p.vx += this.mouse.vx * 0.015 * force;
            p.vy += this.mouse.vy * 0.015 * force;
          }
        }
      }

      // Speed clamp with friction damping
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const maxSpeed = this.config.particleSpeed * (p.isBurst ? 5 : 2.5);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
      p.vx *= 0.992;
      p.vy *= 0.992;
    }
  }

  animate(time) {
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
    this.updateParticles();
    this.drawLines();
    this.drawShockwaves();
    for (const p of this.particles) this.drawParticle(p, time);
    this.animationId = requestAnimationFrame((t) => this.animate(t));
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate(0);
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.isRunning = false;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pn = new ParticleNetwork('hero-particles');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? pn.start() : pn.stop());
  }, { threshold: 0.05 });
  const hero = document.getElementById('hero');
  if (hero) obs.observe(hero);
});
