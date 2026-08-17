/* ============================================
   FLUID CURSOR WAKE — Active Theory-Inspired
   Fullscreen ink-trail fluid simulation via Canvas 2D.
   Mouse velocity drives colorful metaball blobs
   that bloom, advect, and fade across the viewport.
   ============================================ */

(function () {
  'use strict';

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice || prefersReducedMotion) return;

  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });

  // Cyber-aurora palette (matches particles.js)
  const palette = [
    { r: 0, g: 240, b: 255 },   // Electric Cyan
    { r: 0, g: 255, b: 159 },   // Neon Emerald
    { r: 121, g: 40, b: 202 },  // Ultraviolet
    { r: 255, g: 45, b: 85 },   // Laser Rose
    { r: 56, g: 239, b: 125 },  // Bright Mint
  ];

  let width, height, dpr;
  let mouseX = -1000, mouseY = -1000;
  let prevMouseX = -1000, prevMouseY = -1000;
  let mouseVX = 0, mouseVY = 0;
  let blobs = [];
  let animId = null;

  const MAX_BLOBS = 200;
  const SPAWN_INTERVAL = 16; // ms between spawns
  let lastSpawnTime = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function onMouseMove(e) {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseVX = mouseX - prevMouseX;
    mouseVY = mouseY - prevMouseY;
  }

  function onMouseLeave() {
    mouseX = -1000;
    mouseY = -1000;
    mouseVX = 0;
    mouseVY = 0;
  }

  function spawnBlob(x, y, vx, vy) {
    if (blobs.length >= MAX_BLOBS) return;

    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed < 1.5) return; // Only spawn on meaningful movement

    const color = palette[Math.floor(Math.random() * palette.length)];
    const sizeFactor = Math.min(speed / 8, 1); // 0..1 based on speed

    blobs.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: vx * 0.15 + (Math.random() - 0.5) * 1.5,
      vy: vy * 0.15 + (Math.random() - 0.5) * 1.5,
      radius: 20 + sizeFactor * 60 + Math.random() * 20,
      maxRadius: 40 + sizeFactor * 100,
      color: color,
      opacity: 0.12 + sizeFactor * 0.18,
      life: 1.0,
      decay: 0.008 + Math.random() * 0.006,
      growth: 1.0 + sizeFactor * 0.8,
    });
  }

  function update(timestamp) {
    // Spawn new blobs at mouse position
    if (mouseX > 0 && mouseY > 0 && timestamp - lastSpawnTime > SPAWN_INTERVAL) {
      const speed = Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY);
      const count = Math.min(Math.floor(speed / 4), 4);
      for (let i = 0; i < Math.max(1, count); i++) {
        spawnBlob(mouseX, mouseY, mouseVX, mouseVY);
      }
      lastSpawnTime = timestamp;
    }

    // Update blobs
    for (let i = blobs.length - 1; i >= 0; i--) {
      const b = blobs[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.97;
      b.vy *= 0.97;
      b.radius += b.growth;
      b.growth *= 0.97;
      b.life -= b.decay;
      b.opacity = Math.max(0, b.life * b.opacity);

      if (b.life <= 0 || b.opacity < 0.001) {
        blobs.splice(i, 1);
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Render each blob as a radial gradient circle
    for (const b of blobs) {
      const { r, g, bb } = b.color;
      const alpha = b.opacity * b.life;
      if (alpha < 0.002) continue;

      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      grad.addColorStop(0, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${alpha})`);
      grad.addColorStop(0.4, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${alpha * 0.5})`);
      grad.addColorStop(1, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, 0)`);

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  function loop(timestamp) {
    update(timestamp);
    render();
    animId = requestAnimationFrame(loop);
  }

  // Visibility-based performance optimization
  function onVisibilityChange() {
    if (document.hidden) {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    } else {
      if (!animId) {
        animId = requestAnimationFrame(loop);
      }
    }
  }

  // Init
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseleave', onMouseLeave);
  document.addEventListener('visibilitychange', onVisibilityChange);
  animId = requestAnimationFrame(loop);
})();
