/* ============================================================
   SPATIAL-CORE.JS — Three.js 3D Floating Glass & Monogram Core
   Renders an interactive, floating multi-layered holographic
   glass card cluster with refractive materials, iridescent
   rim lighting, and smooth mouse-inertia tilt.
   ============================================================ */

(function initSpatialCore() {
  'use strict';

  const container = document.getElementById('spatial-3d-canvas');
  if (!container || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const width = container.clientWidth || 460;
  const height = container.clientHeight || 460;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Group for all rotating elements
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f0ff, 3, 20);
  cyanLight.position.set(4, 3, 4);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0xa855f7, 3, 20);
  purpleLight.position.set(-4, -3, 3);
  scene.add(purpleLight);

  const topRimLight = new THREE.DirectionalLight(0xffffff, 1.2);
  topRimLight.position.set(0, 6, 2);
  scene.add(topRimLight);

  // ==========================================
  // 1. Layered Floating Glass Slabs
  // ==========================================
  const slabGeometry = new THREE.BoxGeometry(3.2, 2.0, 0.12);

  // Frosted glass material with refraction and wireframe rim
  const glassMaterial1 = new THREE.MeshPhysicalMaterial({
    color: 0x0a1628,
    metalness: 0.1,
    roughness: 0.15,
    transmission: 0.88,
    thickness: 0.6,
    transparent: true,
    opacity: 0.85,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const glassMaterial2 = glassMaterial1.clone();
  glassMaterial2.color.setHex(0x130e2e);

  const glassMaterial3 = glassMaterial1.clone();
  glassMaterial3.color.setHex(0x041f2a);

  // Edges geometry for glowing borders
  const edgesGeometry = new THREE.EdgesGeometry(slabGeometry);
  const cyanEdgeMaterial = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.8,
    linewidth: 2
  });
  const purpleEdgeMaterial = new THREE.LineBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.8,
    linewidth: 2
  });

  // Bottom Slab
  const slab1 = new THREE.Mesh(slabGeometry, glassMaterial1);
  const edges1 = new THREE.LineSegments(edgesGeometry, purpleEdgeMaterial);
  slab1.add(edges1);
  slab1.position.set(0, -0.45, -0.4);
  slab1.rotation.set(0.4, -0.3, 0.15);
  mainGroup.add(slab1);

  // Middle Slab
  const slab2 = new THREE.Mesh(slabGeometry, glassMaterial2);
  const edges2 = new THREE.LineSegments(edgesGeometry, cyanEdgeMaterial);
  slab2.add(edges2);
  slab2.position.set(0, 0, 0);
  slab2.rotation.set(0.4, -0.3, 0.15);
  mainGroup.add(slab2);

  // Top Floating Slab
  const slab3 = new THREE.Mesh(slabGeometry, glassMaterial3);
  const edges3 = new THREE.LineSegments(edgesGeometry, cyanEdgeMaterial);
  slab3.add(edges3);
  slab3.position.set(0, 0.45, 0.4);
  slab3.rotation.set(0.4, -0.3, 0.15);
  mainGroup.add(slab3);

  // ==========================================
  // 2. Central Developer Hexagon Monogram Badge
  // ==========================================
  const hexShape = new THREE.Shape();
  const hexRadius = 0.85;
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = hexRadius * Math.cos(angle);
    const y = hexRadius * Math.sin(angle);
    if (i === 0) hexShape.moveTo(x, y);
    else hexShape.lineTo(x, y);
  }
  hexShape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3
  };

  const hexGeometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
  const hexMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.08
  });

  const hexBadge = new THREE.Mesh(hexGeometry, hexMaterial);
  hexBadge.position.set(0.8, 0.5, 0.7);
  hexBadge.rotation.set(0.4, -0.3, 0.15);
  mainGroup.add(hexBadge);

  // Glowing Hexagon Edge
  const hexEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(hexGeometry),
    new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 })
  );
  hexBadge.add(hexEdges);

  // ==========================================
  // 3. Orbiting Data Particles
  // ==========================================
  const particleCount = 80;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 6;
    particlePos[i + 1] = (Math.random() - 0.5) * 5;
    particlePos[i + 2] = (Math.random() - 0.5) * 4;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.04,
    transparent: true,
    opacity: 0.75
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  mainGroup.add(particles);

  // ==========================================
  // Mouse & Scroll Parallax Dynamics
  // ==========================================
  let targetRotationX = 0;
  let targetRotationY = 0;
  let currentRotationX = 0;
  let currentRotationY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    if (x >= -2 && x <= 2 && y >= -2 && y <= 2) {
      targetRotationY = x * 0.45;
      targetRotationX = -y * 0.35;
    }
  });

  let isVisible = true;
  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(container);

  // Animation Loop with Smooth Damping
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Floating idle bobbing
    slab1.position.y = -0.45 + Math.sin(time * 1.5) * 0.06;
    slab2.position.y = 0 + Math.sin(time * 1.5 + 1) * 0.08;
    slab3.position.y = 0.45 + Math.sin(time * 1.5 + 2) * 0.1;
    hexBadge.position.y = 0.5 + Math.sin(time * 1.5 + 2) * 0.1;

    // Smooth inertia interpolation
    currentRotationX += (targetRotationX - currentRotationX) * 0.06;
    currentRotationY += (targetRotationY - currentRotationY) * 0.06;

    mainGroup.rotation.x = currentRotationX;
    mainGroup.rotation.y = currentRotationY;

    // Gentle continuous slow spin
    particles.rotation.y = time * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Resize
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
})();
