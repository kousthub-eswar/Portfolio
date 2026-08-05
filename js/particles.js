/* ============================================
   PARTICLES V2 — Premium constellation network
   with enhanced visuals and mouse interactivity
   ============================================ */

class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 180 };
    this.animationId = null;
    this.isRunning = false;

    this.config = {
      particleCount: 100,
      particleMinRadius: 0.8,
      particleMaxRadius: 2.5,
      particleSpeed: 0.25,
      lineDistance: 140,
      lineOpacity: 0.12,
      mouseLineDistance: 220,
      mouseLineOpacity: 0.3,
      colors: [
        { r: 99, g: 102, b: 241 },   // indigo
        { r: 139, g: 92, b: 246 },    // violet
        { r: 6, g: 182, b: 212 },     // cyan
        { r: 168, g: 85, b: 247 },    // purple
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
      Math.floor((this.displayWidth * this.displayHeight) / 10000)
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
        opacity: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.015 + 0.003,
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

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  drawParticle(p, time) {
    const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.35 + 0.65;
    const { r, g, b } = p.color;

    // Outer glow
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.radius * 4 * pulse, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.04 * pulse})`;
    this.ctx.fill();

    // Core
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * pulse})`;
    this.ctx.fill();
  }

  drawLines() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
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
          this.ctx.lineWidth = 0.6;
          this.ctx.stroke();
        }
      }

      // Mouse connections
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
          this.ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  updateParticles() {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.displayWidth) p.vx *= -1;
      if (p.y < 0 || p.y > this.displayHeight) p.vy *= -1;

      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius && dist > 0) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.vx += (dx / dist) * force * 0.025;
          p.vy += (dy / dist) * force * 0.025;
        }
      }

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const maxSpeed = this.config.particleSpeed * 2.5;
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }
    }
  }

  animate(time) {
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
    this.updateParticles();
    this.drawLines();
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
  }, { threshold: 0.1 });
  const hero = document.getElementById('hero');
  if (hero) obs.observe(hero);
});
