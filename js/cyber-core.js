/* ============================================================
   CYBER-CORE.JS — 3D INTERACTIVE WEBGL CENTERPIECE (Three.js)
   Geodesic wireframe nucleus with orbiting gyroscopic rings,
   pulsing quantum core, and inertia-driven mouse interaction.
   ============================================================ */

(function () {
  'use strict';

  // Check if WebGL & Three.js are available
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Skipping 3D Cyber Core initialization.');
    return;
  }

  const container = document.getElementById('cyber-core-container');
  if (!container) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Group to hold all revolving elements
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // Colors
  const COLOR_CYAN = 0x00f0ff;
  const COLOR_PURPLE = 0x7928ca;
  const COLOR_EMERALD = 0x00ff9f;

  // 1. Inner Geodesic Nucleus (Icosahedron Wireframe)
  const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
  const innerMat = new THREE.MeshBasicMaterial({
    color: COLOR_CYAN,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);
  coreGroup.add(innerCore);

  // 2. Vertex Points for Inner Nucleus
  const pointsMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.06,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });
  const pointsMesh = new THREE.Points(innerGeo, pointsMat);
  coreGroup.add(pointsMesh);

  // 3. Central Glowing Energy Sphere
  const glowGeo = new THREE.SphereGeometry(0.85, 24, 24);
  const glowMat = new THREE.MeshBasicMaterial({
    color: COLOR_PURPLE,
    wireframe: false,
    transparent: true,
    opacity: 0.28,
  });
  const glowSphere = new THREE.Mesh(glowGeo, glowMat);
  coreGroup.add(glowSphere);

  // 4. Orbiting Gyro Ring 1 (Cyan)
  const ring1Geo = new THREE.TorusGeometry(2.35, 0.02, 16, 100);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: COLOR_CYAN,
    transparent: true,
    opacity: 0.75,
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 3;
  coreGroup.add(ring1);

  // 5. Orbiting Gyro Ring 2 (Ultraviolet)
  const ring2Geo = new THREE.TorusGeometry(2.7, 0.02, 16, 100);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: COLOR_PURPLE,
    transparent: true,
    opacity: 0.65,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.x = -Math.PI / 5;
  coreGroup.add(ring2);

  // 6. Orbiting Gyro Ring 3 (Neon Emerald)
  const ring3Geo = new THREE.TorusGeometry(3.05, 0.018, 16, 100);
  const ring3Mat = new THREE.MeshBasicMaterial({
    color: COLOR_EMERALD,
    transparent: true,
    opacity: 0.55,
  });
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.rotation.z = Math.PI / 3;
  ring3.rotation.y = Math.PI / 6;
  coreGroup.add(ring3);

  // 7. Surrounding Ambient Quantum Particles
  const particleCount = 180;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const r = 2.2 + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = r * Math.cos(phi);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: COLOR_CYAN,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });
  const particleCloud = new THREE.Points(particleGeo, particleMat);
  coreGroup.add(particleCloud);

  // Mouse tracking with elastic spring damping
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;
  let curRotX = 0, curRotY = 0;

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX = (x / rect.width) * 2;
    mouseY = (y / rect.height) * 2;
    targetRotY = mouseX * 0.9;
    targetRotX = mouseY * 0.9;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Interactive Click Shockwave
  let pulseIntensity = 0;
  container.addEventListener('click', () => {
    pulseIntensity = 1.0;
  });

  // Resize handler
  function onResize() {
    if (!container) return;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onResize);

  // Animation Loop
  let isRunning = true;
  let clock = new THREE.Clock();

  function animate() {
    if (!isRunning) return;
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Constant idle rotation
    innerCore.rotation.y += 0.005;
    innerCore.rotation.x += 0.003;

    ring1.rotation.z += 0.009;
    ring2.rotation.y -= 0.008;
    ring3.rotation.x += 0.007;

    particleCloud.rotation.y += 0.002;

    // Organic pulsing of inner glow
    const pulse = Math.sin(time * 2.2) * 0.08 + 1.0;
    glowSphere.scale.set(pulse, pulse, pulse);

    // Shockwave dissipation
    if (pulseIntensity > 0.01) {
      innerCore.rotation.y += pulseIntensity * 0.08;
      glowSphere.scale.set(pulse * (1 + pulseIntensity * 0.4), pulse * (1 + pulseIntensity * 0.4), pulse * (1 + pulseIntensity * 0.4));
      pulseIntensity *= 0.92;
    }

    // Smooth inertia interpolation towards mouse target
    if (!prefersReducedMotion) {
      curRotY += (targetRotY - curRotY) * 0.06;
      curRotX += (targetRotX - curRotX) * 0.06;
      coreGroup.rotation.y = curRotY;
      coreGroup.rotation.x = curRotX;
    }

    renderer.render(scene, camera);
  }

  // IntersectionObserver for performance (pauses WebGL when scrolled away)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isRunning = entry.isIntersecting;
      if (isRunning) {
        clock.start();
        animate();
      }
    });
  }, { threshold: 0.05 });

  observer.observe(container);
  animate();
})();
