/* ============================================================
   CYBER-ROOM.JS — FULL-SCREEN 3D INTERACTIVE WORKSTATION ROOM
   Built with Three.js (WebGL). Features procedural 3D workstation,
   curved code monitors, glowing server racks, dynamic raycasting,
   and cinematic smooth camera zoom transitions to each station.
   ============================================================ */

(function initCyberRoom() {
  'use strict';

  const container = document.getElementById('webgl-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // WebGL Availability Check & Graceful Fallback
  function isWebGLSupported() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLSupported()) {
    console.info("WebGL not supported or disabled. Defaulting gracefully to clean 2D portfolio.");
    container.style.display = 'none';
    document.querySelectorAll('.btn-enter-cockpit, .float-cockpit-btn').forEach(el => el.style.display = 'none');
    return;
  }

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070f);
  scene.fog = new THREE.FogExp2(0x05070f, 0.045);

  let width = window.innerWidth;
  let height = window.innerHeight;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  
  // Default Overview Camera Transform
  const CAMERA_VIEWS = {
    overview: {
      pos: new THREE.Vector3(0, 2.2, 5.2),
      target: new THREE.Vector3(0, 0.9, 0)
    },
    projects: {
      pos: new THREE.Vector3(0, 1.35, 1.9),
      target: new THREE.Vector3(0, 1.25, 0)
    },
    skills: {
      pos: new THREE.Vector3(2.1, 1.4, 2.1),
      target: new THREE.Vector3(1.7, 1.1, 0.2)
    },
    experience: {
      pos: new THREE.Vector3(-2.0, 1.4, 2.1),
      target: new THREE.Vector3(-1.6, 1.1, 0.2)
    },
    contact: {
      pos: new THREE.Vector3(0.5, 1.1, 1.6),
      target: new THREE.Vector3(0.4, 0.82, 0.5)
    }
  };

  camera.position.copy(CAMERA_VIEWS.overview.pos);
  const currentTarget = CAMERA_VIEWS.overview.target.clone();
  camera.lookAt(currentTarget);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // Group to hold all interactive props
  const interactiveObjects = [];
  const roomGroup = new THREE.Group();
  scene.add(roomGroup);

  // ==========================================
  // LIGHTING SYSTEM
  // ==========================================
  const ambientLight = new THREE.AmbientLight(0x101828, 1.5);
  scene.add(ambientLight);

  // Main screen glow light (Cyan)
  const monitorLight = new THREE.PointLight(0x00f0ff, 2.8, 6);
  monitorLight.position.set(0, 1.4, 0.5);
  scene.add(monitorLight);

  // Server rack glow light (Purple & Emerald)
  const serverLight = new THREE.PointLight(0xa855f7, 2.5, 5);
  serverLight.position.set(1.8, 1.2, 0.5);
  scene.add(serverLight);

  // Vertical monitor glow light (Emerald / Warm)
  const leftMonitorLight = new THREE.PointLight(0x00ff9f, 2.0, 4);
  leftMonitorLight.position.set(-1.6, 1.3, 0.5);
  scene.add(leftMonitorLight);

  // Overhead soft spot
  const overheadSpot = new THREE.SpotLight(0xffffff, 2.0, 10, Math.PI / 4, 0.5, 1);
  overheadSpot.position.set(0, 4.5, 2);
  overheadSpot.target.position.set(0, 1, 0);
  scene.add(overheadSpot);
  scene.add(overheadSpot.target);

  // Window exterior ambient moonlight
  const windowLight = new THREE.DirectionalLight(0x1e3a8a, 1.2);
  windowLight.position.set(4, 3, -4);
  scene.add(windowLight);

  // ==========================================
  // MATERIALS REPOSITORY
  // ==========================================
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x0c101a,
    roughness: 0.35,
    metalness: 0.8
  });

  const deskWoodMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.25,
    metalness: 0.5
  });

  const glowingCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const glowingPurpleMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
  const glowingGreenMat = new THREE.MeshBasicMaterial({ color: 0x00ff9f });
  const glowingRedMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });

  // Glass Material for PC Tower & Desk details
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.85,
    thickness: 0.4,
    transparent: true,
    opacity: 0.75
  });

  // ==========================================
  // ROOM ENVIRONMENT (FLOOR & WALLS)
  // ==========================================
  // Floor with subtle grid
  const floorGeo = new THREE.PlaneGeometry(16, 16);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x05070e,
    roughness: 0.6,
    metalness: 0.4
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  roomGroup.add(floor);

  // Grid Helper on floor
  const gridHelper = new THREE.GridHelper(16, 32, 0x00f0ff, 0x111c30);
  gridHelper.position.y = 0.005;
  gridHelper.material.opacity = 0.22;
  gridHelper.material.transparent = true;
  roomGroup.add(gridHelper);

  // Back Wall with Cyberpunk Window & Blinds
  const wallGeo = new THREE.PlaneGeometry(16, 8);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x070b16, roughness: 0.8 });
  const backWall = new THREE.Mesh(wallGeo, wallMat);
  backWall.position.set(0, 4, -2.5);
  roomGroup.add(backWall);

  // Window with Cyber City Glow
  const windowFrameGeo = new THREE.BoxGeometry(4.5, 2.8, 0.1);
  const windowFrame = new THREE.Mesh(windowFrameGeo, darkMetalMat);
  windowFrame.position.set(2.2, 3.2, -2.44);
  roomGroup.add(windowFrame);

  const cityBackdropGeo = new THREE.PlaneGeometry(4.3, 2.6);
  const cityBackdropMat = new THREE.MeshBasicMaterial({
    color: 0x091b3a,
    emissive: 0x002244
  });
  const cityBackdrop = new THREE.Mesh(cityBackdropGeo, cityBackdropMat);
  cityBackdrop.position.set(2.2, 3.2, -2.38);
  roomGroup.add(cityBackdrop);

  // Neon strip under ceiling
  const ceilingStripGeo = new THREE.BoxGeometry(14, 0.06, 0.06);
  const ceilingStrip = new THREE.Mesh(ceilingStripGeo, glowingCyanMat);
  ceilingStrip.position.set(0, 5.8, -2.4);
  roomGroup.add(ceilingStrip);

  // ==========================================
  // THE DEVELOPER DESK
  // ==========================================
  const deskTopGeo = new THREE.BoxGeometry(4.4, 0.08, 1.8);
  const deskTop = new THREE.Mesh(deskTopGeo, deskWoodMat);
  deskTop.position.set(0, 0.8, 0);
  deskTop.receiveShadow = true;
  deskTop.castShadow = true;
  roomGroup.add(deskTop);

  // Desk Legs
  const legGeo = new THREE.BoxGeometry(0.1, 0.8, 1.6);
  const leftLeg = new THREE.Mesh(legGeo, darkMetalMat);
  leftLeg.position.set(-2.05, 0.4, 0);
  roomGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, darkMetalMat);
  rightLeg.position.set(2.05, 0.4, 0);
  roomGroup.add(rightLeg);

  // Large Desk Mat
  const matGeo = new THREE.BoxGeometry(2.4, 0.01, 0.9);
  const matMat = new THREE.MeshStandardMaterial({ color: 0x0f1523, roughness: 0.8 });
  const deskMat = new THREE.Mesh(matGeo, matMat);
  deskMat.position.set(0, 0.845, 0.15);
  roomGroup.add(deskMat);

  // RGB Cyber Edge Trim around Desk Top
  const deskTrim = new THREE.Mesh(
    new THREE.BoxGeometry(4.44, 0.015, 1.84),
    glowingCyanMat
  );
  deskTrim.position.set(0, 0.76, 0);
  roomGroup.add(deskTrim);

  // ==========================================
  // 1. MAIN CURVED ULTRA-WIDE CODE MONITOR (PROJECTS)
  // ==========================================
  const monitorGroup = new THREE.Group();
  monitorGroup.name = 'projects';
  monitorGroup.userData = { section: 'projects', label: 'Featured Projects' };

  // Back-monitor Ambilight casting onto back wall
  const ambilight = new THREE.PointLight(0x00f0ff, 2.0, 3.8);
  ambilight.position.set(0, 1.45, -0.6);
  monitorGroup.add(ambilight);

  // Monitor Stand
  const standBaseGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.03, 24);
  const standBase = new THREE.Mesh(standBaseGeo, darkMetalMat);
  standBase.position.set(0, 0.855, -0.4);
  monitorGroup.add(standBase);

  const standPoleGeo = new THREE.BoxGeometry(0.08, 0.55, 0.08);
  const standPole = new THREE.Mesh(standPoleGeo, darkMetalMat);
  standPole.position.set(0, 1.1, -0.42);
  monitorGroup.add(standPole);

  // Ultra-wide Screen Housing
  const screenHousingGeo = new THREE.BoxGeometry(2.2, 0.95, 0.06);
  const screenHousing = new THREE.Mesh(screenHousingGeo, darkMetalMat);
  screenHousing.position.set(0, 1.45, -0.32);
  monitorGroup.add(screenHousing);

  // Display Screen Mesh (Canvas Texture for Code & Project Previews)
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1024;
  screenCanvas.height = 512;
  const ctx = screenCanvas.getContext('2d');

    const projectCodeMap = {
      billmate: {
        title: 'FEATURED: BillMate — POS & Retail PWA',
        tags: '[React 19] [TypeScript] [Supabase Atomic RPCs] [Vitest]',
        lines: [
          '// Atomic PostgreSQL RPC: Eliminate inventory concurrency race conditions',
          'CREATE OR REPLACE FUNCTION process_retail_sale(payload JSONB) RETURNS VOID AS $$',
          'BEGIN',
          '  PERFORM pg_advisory_xact_lock(payload->>\'store_id\');',
          '  UPDATE inventory SET stock = stock - (item->>\'qty\')::int ...',
          '  INSERT INTO invoices VALUES (...) RETURNING invoice_id;',
          'END; $$ LANGUAGE plpgsql;',
          '>> Status: Tested with Vitest • Atomic PostgreSQL RPCs • Deployed on Vercel',
          '>> CLICK TO OPEN LIVE SYSTEM SPECS & DEMO &rarr;'
        ]
      },
      tunesense: {
        title: 'FEATURED: TuneSense — Music Recommender',
        tags: '[React] [TypeScript] [Node.js/Express] [MongoDB] [Zod] [Tailwind]',
        lines: [
          '// 6 Composable Strategies: Popularity, Content, Behavioral, Context, Hybrid, Collab',
          '// 11 Mongoose Schemas: Materialized Views, Event Logs, Cosine Similarity Vectors',
          'export const computeAcousticDistance = (songA, songB) => {',
          '  const vA = [songA.energy, songA.valence, songA.danceability, songA.acousticness];',
          '  const vB = [songB.energy, songB.valence, songB.danceability, songB.acousticness];',
          '  return dotProduct(vA, vB) / (magnitude(vA) * magnitude(vB));',
          '};',
          '',
          '>> Offline Evaluation Suite: Precision@K • Recall@K • NDCG active',
          '>> CLICK TO INSPECT RECOMMENDATION PIPELINE SPECS &rarr;'
        ]
      },
      clubhub: {
        title: 'FEATURED: Campus ClubHub — Event Platform',
        tags: '[React 19] [TypeScript] [Vite] [Tailwind CSS] [Real-Time SVG QRs]',
        lines: [
          '// Domain-Segregated Institutional Auth with Real-Time SVG QR Event Passes',
          'const generateSecureTicketPass = async (ticketId, attendeeId, eventId) => {',
          '  const payload = `${ticketId}:${attendeeId}:${eventId}:${SECRET_KEY}`;',
          '  const signature = crypto.createHash(\'sha256\').update(payload).digest(\'hex\');',
          '  return await qrcode.toDataURL(JSON.stringify({ ticketId, signature }));',
          '};',
          '',
          '>> Organizer Console: Live Registration KPIs • Attendee Rosters • CSV Export',
          '>> CLICK TO INSPECT EVENT ARCHITECTURE SPECS &rarr;'
        ]
      },
      auditanalytics: {
        title: 'Audit Analytics — Forensic Anomaly Detection',
        tags: '[Python] [SQL (SQLite)] [Streamlit] [8,000 Synthetic Txns / $13.7M Simulated]',
        lines: [
          '# Forensic First-Digit Benford Distribution & Chi-Square Goodness-of-Fit',
          'def benford_goodness_of_fit(transactions_df):',
          '  first_digits = transactions_df[\'amount\'].astype(str).str[0].astype(int)',
          '  observed = first_digits.value_counts(normalize=True).sort_index()',
          '  expected = np.log10(1 + 1 / np.arange(1, 10))',
          '  chi_sq, p_val = scipy.stats.chisquare(f_obs=observed, f_exp=expected)',
          '  return {\'chi_square\': chi_sq, \'p_value\': p_val, \'fraud_flag\': p_val < 0.05}',
          '',
          '>> Synthetic Dataset: 8,000 Txns ($13.7M) • Benford First-Digit • 206 Flags'
        ]
      }
    };

    function renderMonitorTexture(projectKey) {
      const p = projectCodeMap[projectKey || 'billmate'] || projectCodeMap.billmate;
      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, 1024, 512);

      // Top terminal bar
      ctx.fillStyle = '#0c1322';
      ctx.fillRect(0, 0, 1024, 44);
      
      // Dot buttons
      ctx.fillStyle = '#ff5f56'; ctx.beginPath(); ctx.arc(24, 22, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffbd2e'; ctx.beginPath(); ctx.arc(46, 22, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#27c93f'; ctx.beginPath(); ctx.arc(68, 22, 7, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 15px JetBrains Mono, monospace';
      ctx.fillText('kousthub-eswar/portfolio • bash 80x24 • Active', 100, 28);

      // Main Code & Project Info
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 30px Space Grotesk, sans-serif';
      ctx.fillText(p.title, 40, 100);

      ctx.fillStyle = '#00ff9f';
      ctx.font = '17px JetBrains Mono, monospace';
      ctx.fillText(p.tags, 40, 140);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px JetBrains Mono, monospace';

      p.lines.forEach((l, idx) => {
        ctx.fillStyle = l.startsWith('>>') ? '#ffb800' : (l.startsWith('//') || l.startsWith('#') ? '#475569' : '#e2e8f0');
        ctx.fillText(l, 40, 185 + idx * 28);
      });

      // Glowing border inside screen
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, 1016, 504);

      if (screenTexture) screenTexture.needsUpdate = true;
    }

  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  renderMonitorTexture('billmate');
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
  const screenDisplay = new THREE.Mesh(new THREE.PlaneGeometry(2.14, 0.9), screenMat);
  screenDisplay.position.set(0, 1.45, -0.288);
  monitorGroup.add(screenDisplay);

  roomGroup.add(monitorGroup);
  interactiveObjects.push(screenDisplay);
  screenDisplay.userData = { section: 'projects', group: monitorGroup };

  // ==========================================
  // 2. SERVER RACK WITH BLINKING LEDS (SKILLS & BACKEND)
  // ==========================================
  const serverRackGroup = new THREE.Group();
  serverRackGroup.name = 'skills';
  serverRackGroup.position.set(1.7, 0.84, -0.1);

  // Server Chassis
  const rackChassisGeo = new THREE.BoxGeometry(0.55, 1.1, 0.7);
  const rackChassis = new THREE.Mesh(rackChassisGeo, darkMetalMat);
  rackChassis.position.set(0, 0.55, 0);
  serverRackGroup.add(rackChassis);

  // Acrylic Front Door
  const rackDoorGeo = new THREE.BoxGeometry(0.52, 1.05, 0.02);
  const rackDoor = new THREE.Mesh(rackDoorGeo, glassMat);
  rackDoor.position.set(0, 0.55, 0.36);
  serverRackGroup.add(rackDoor);

  // Server Blades & Blinking LEDs
  const ledMeshes = [];
  for (let b = 0; b < 5; b++) {
    const bladeGeo = new THREE.BoxGeometry(0.5, 0.16, 0.65);
    const blade = new THREE.Mesh(bladeGeo, new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9 }));
    blade.position.set(0, 0.18 + b * 0.2, 0);
    serverRackGroup.add(blade);

    // 4 LEDs per blade
    for (let l = 0; l < 4; l++) {
      const ledGeo = new THREE.BoxGeometry(0.02, 0.02, 0.01);
      const isGreen = (b + l) % 2 === 0;
      const ledMat = isGreen ? glowingGreenMat.clone() : glowingCyanMat.clone();
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-0.18 + l * 0.12, 0.18 + b * 0.2, 0.34);
      serverRackGroup.add(led);
      ledMeshes.push(led);
    }
  }

  roomGroup.add(serverRackGroup);
  interactiveObjects.push(rackChassis, rackDoor);
  rackChassis.userData = { section: 'skills', group: serverRackGroup };
  rackDoor.userData = { section: 'skills', group: serverRackGroup };

  // ==========================================
  // 3. VERTICAL SECONDARY CODE MONITOR (EXPERIENCE & ABOUT)
  // ==========================================
  const verticalMonGroup = new THREE.Group();
  verticalMonGroup.name = 'experience';
  verticalMonGroup.position.set(-1.6, 0.855, -0.15);
  verticalMonGroup.rotation.y = 0.38;

  // Vertical Screen
  const vertHousing = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.15, 0.05), darkMetalMat);
  vertHousing.position.set(0, 0.58, 0);
  verticalMonGroup.add(vertHousing);

  const vertCanvas = document.createElement('canvas');
  vertCanvas.width = 400;
  vertCanvas.height = 700;
  const vctx = vertCanvas.getContext('2d');

  vctx.fillStyle = '#080d1a';
  vctx.fillRect(0, 0, 400, 700);
  vctx.fillStyle = '#00ff9f';
  vctx.font = 'bold 22px Space Grotesk, sans-serif';
  vctx.fillText('LEADERSHIP & EXP', 25, 45);
  vctx.fillStyle = '#94a3b8';
  vctx.font = '14px JetBrains Mono, monospace';
  vctx.fillText('Matrix Club • Co-Secretary', 25, 75);
  vctx.fillText('Jan 2025 – Jan 2026', 25, 100);

  vctx.fillStyle = '#00f0ff';
  vctx.fillRect(25, 120, 350, 2);

  vctx.fillStyle = '#e2e8f0';
  vctx.font = '13px Inter, sans-serif';
  const expLines = [
    '• Co-Secretary — Matrix Club',
    '  Led 10+ members across 10+ events',
    '  reaching 100+ participants.',
    '• Riviera / GraVITas Org Comm',
    '  Coordinated fest logistics.',
    '• Edvensoft Solutions',
    '  Marketing Intern (May–Jun \'25)',
    '',
    'EDUCATION:',
    '• VIT Vellore — B.Tech CSE \'27',
    '  CGPA: 8.48 / 10.0',
    '• Narayana CO Campus — 88%',
    '',
    'CLICK TO INSPECT DETAILS →'
  ];

  expLines.forEach((el, idx) => {
    vctx.fillStyle = el.startsWith('•') ? '#cbd5e1' : (el.startsWith('CLICK') ? '#00f0ff' : '#64748b');
    vctx.fillText(el, 25, 155 + idx * 26);
  });

  const vertTexture = new THREE.CanvasTexture(vertCanvas);
  const vertDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.1), new THREE.MeshBasicMaterial({ map: vertTexture }));
  vertDisplay.position.set(0, 0.58, 0.03);
  verticalMonGroup.add(vertDisplay);

  roomGroup.add(verticalMonGroup);
  interactiveObjects.push(vertDisplay);
  vertDisplay.userData = { section: 'experience', group: verticalMonGroup };

  // ==========================================
  // 4. SMARTPHONE ON DESK (CONTACT & RESUME)
  // ==========================================
  const phoneGroup = new THREE.Group();
  phoneGroup.name = 'contact';
  phoneGroup.position.set(0.65, 0.852, 0.45);
  phoneGroup.rotation.y = -0.25;

  const phoneBodyGeo = new THREE.BoxGeometry(0.18, 0.015, 0.35);
  const phoneBody = new THREE.Mesh(phoneBodyGeo, new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 }));
  phoneGroup.add(phoneBody);

  const phoneScreenGeo = new THREE.PlaneGeometry(0.16, 0.32);
  const phoneCanvas = document.createElement('canvas');
  phoneCanvas.width = 256;
  phoneCanvas.height = 512;
  const pctx = phoneCanvas.getContext('2d');
  pctx.fillStyle = '#060a14';
  pctx.fillRect(0, 0, 256, 512);
  pctx.fillStyle = '#00f0ff';
  pctx.font = 'bold 22px Space Grotesk';
  pctx.fillText('INCOMING CALL', 35, 60);
  pctx.fillStyle = '#fff';
  pctx.font = 'bold 28px Space Grotesk';
  pctx.fillText('Kousthub E.', 35, 110);
  pctx.fillStyle = '#00ff9f';
  pctx.font = '16px JetBrains Mono';
  pctx.fillText('● Available for SDE', 35, 150);
  pctx.fillStyle = '#ffb800';
  pctx.fillText('Click to Contact / Resume', 20, 460);

  const phoneTexture = new THREE.CanvasTexture(phoneCanvas);
  const phoneScreen = new THREE.Mesh(phoneScreenGeo, new THREE.MeshBasicMaterial({ map: phoneTexture }));
  phoneScreen.rotation.x = -Math.PI / 2;
  phoneScreen.position.y = 0.009;
  phoneGroup.add(phoneScreen);

  roomGroup.add(phoneGroup);
  interactiveObjects.push(phoneBody, phoneScreen);
  phoneBody.userData = { section: 'contact', group: phoneGroup };
  phoneScreen.userData = { section: 'contact', group: phoneGroup };

  // ==========================================
  // 5. KEYBOARD, MOUSE & COFFEE MUG DETAILS
  // ==========================================
  // Mechanical Keyboard
  const kbGeo = new THREE.BoxGeometry(0.85, 0.025, 0.28);
  const kb = new THREE.Mesh(kbGeo, darkMetalMat);
  kb.position.set(-0.15, 0.855, 0.32);
  roomGroup.add(kb);

  // RGB backlight strip under keyboard
  const kbGlow = new THREE.Mesh(new THREE.BoxGeometry(0.87, 0.008, 0.3), glowingCyanMat);
  kbGlow.position.set(-0.15, 0.846, 0.32);
  roomGroup.add(kbGlow);

  // Mouse & Mousepad
  const mouseGeo = new THREE.BoxGeometry(0.1, 0.035, 0.16);
  const mouse = new THREE.Mesh(mouseGeo, darkMetalMat);
  mouse.position.set(0.48, 0.86, 0.3);
  mouse.rotation.y = -0.05;
  roomGroup.add(mouse);

  // Coffee Mug
  const mugGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.16, 24);
  const mugMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.3 });
  const mug = new THREE.Mesh(mugGeo, mugMat);
  mug.position.set(-0.85, 0.92, 0.3);
  roomGroup.add(mug);

  // Liquid Coffee
  const coffeeGeo = new THREE.CircleGeometry(0.07, 24);
  const coffeeMat = new THREE.MeshBasicMaterial({ color: 0x3f2008 });
  const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.set(-0.85, 0.99, 0.3);
  roomGroup.add(coffee);

  // Floating 3D Navigation Pins / Holograms (High-DPI Cyber Badges)
  const pinsByStation = {};

  function createHologramPin(text, pos, color, sectionKey) {
    const pinGroup = new THREE.Group();
    pinGroup.position.copy(pos);

    const canvas = document.createElement('canvas');
    canvas.width = 460;
    canvas.height = 120;
    const pctx = canvas.getContext('2d');

    // Outer cyber container
    pctx.fillStyle = 'rgba(7, 14, 28, 0.94)';
    pctx.strokeStyle = color;
    pctx.lineWidth = 4;
    pctx.beginPath();
    pctx.roundRect(6, 6, 448, 108, 22);
    pctx.fill();
    pctx.stroke();

    // Glowing status indicator dot
    pctx.fillStyle = color;
    pctx.shadowColor = color;
    pctx.shadowBlur = 14;
    pctx.beginPath();
    pctx.arc(42, 60, 11, 0, Math.PI * 2);
    pctx.fill();
    pctx.shadowBlur = 0; // reset

    // Text label
    pctx.fillStyle = '#f8fafc';
    pctx.font = '700 28px "Space Grotesk", sans-serif';
    pctx.textAlign = 'left';
    pctx.fillText(text, 70, 52);

    // Click To Zoom Monospace Subtitle
    pctx.fillStyle = color;
    pctx.font = '600 13px "JetBrains Mono", monospace';
    pctx.fillText('✦ CLICK TO ZOOM', 70, 88);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.0, 0.26, 1);
    sprite.userData = { section: sectionKey, baseScale: 1.0 };
    interactiveObjects.push(sprite);
    pinGroup.add(sprite);

    pinsByStation[sectionKey] = sprite;
    roomGroup.add(pinGroup);
    return pinGroup;
  }

  const pinProjects = createHologramPin('PROJECTS', new THREE.Vector3(0, 2.25, -0.2), '#00f0ff', 'projects');
  const pinSkills = createHologramPin('BACKEND & DB', new THREE.Vector3(2.1, 2.3, 0.1), '#a855f7', 'skills');
  const pinExp = createHologramPin('BIO & VIT', new THREE.Vector3(-2.0, 2.25, 0.1), '#ffb800', 'experience');
  const pinContact = createHologramPin('CONTACT / CV', new THREE.Vector3(0.5, 1.35, 0.45), '#00ff9f', 'contact');

  // ==========================================
  // CAMERA ANIMATION & INTERACTION SYSTEM
  // ==========================================
  let isTransitioning = false;
  let currentStation = 'overview';

  function transitionToStation(stationKey) {
    const view = CAMERA_VIEWS[stationKey];
    if (!view) return;
    if (currentStation === stationKey && !isTransitioning) return;

    currentStation = stationKey;
    isTransitioning = true;

    // Immediately update HUD active buttons
    document.querySelectorAll('.hud-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === stationKey);
    });

    const resetBtn = document.getElementById('hud-reset-view');
    if (resetBtn) {
      resetBtn.style.display = stationKey === 'overview' ? 'none' : 'inline-flex';
    }

    // Adjust light intensities to prevent text washout on flyouts
    if (stationKey === 'overview') {
      monitorLight.intensity = 2.8;
      serverLight.intensity = 2.5;
    } else if (stationKey === 'skills') {
      serverLight.intensity = 1.3;
    } else if (stationKey === 'contact') {
      monitorLight.intensity = 1.5;
    }

    // Immediately signal flyouts to hide while camera moves
    window.dispatchEvent(new CustomEvent('stationTransitionStart', { detail: { station: stationKey } }));

    // Show pins only in overview
    const showPins = (stationKey === 'overview');
    pinProjects.visible = showPins;
    pinSkills.visible = showPins;
    pinExp.visible = showPins;
    pinContact.visible = showPins;

    // Use GSAP if available, or fall back to native smooth lerp
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(currentTarget);

      gsap.to(camera.position, {
        x: view.pos.x,
        y: view.pos.y,
        z: view.pos.z,
        duration: 1.15,
        ease: 'power3.inOut'
      });

      gsap.to(currentTarget, {
        x: view.target.x,
        y: view.target.y,
        z: view.target.z,
        duration: 1.15,
        ease: 'power3.inOut',
        onUpdate: () => camera.lookAt(currentTarget),
        onComplete: () => {
          isTransitioning = false;
          window.dispatchEvent(new CustomEvent('stationChanged', { detail: { station: stationKey } }));
        }
      });
    } else {
      // Custom Animation Fallback
      const startPos = camera.position.clone();
      const startTarget = currentTarget.clone();
      const startTime = performance.now();
      const duration = 1000;

      function step() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

        camera.position.lerpVectors(startPos, view.pos, ease);
        currentTarget.lerpVectors(startTarget, view.target, ease);
        camera.lookAt(currentTarget);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          isTransitioning = false;
          window.dispatchEvent(new CustomEvent('stationChanged', { detail: { station: stationKey } }));
        }
      }
      step();
    }
  }

  // Expose global controller
  window.cyberRoom = {
    transitionTo: transitionToStation,
    getStation: () => currentStation,
    updateMonitor: renderMonitorTexture
  };

  // Raycasting for Mouse Clicks on 3D Objects ONLY (attached to renderer canvas)
  const raycaster = new THREE.Raycaster();
  const mouseCoords = new THREE.Vector2();

  renderer.domElement.addEventListener('click', (e) => {
    // Only process clicks when 3D cockpit mode is active
    if (!document.body.classList.contains('cockpit-mode')) return;
    if (e.target !== renderer.domElement) return;

    mouseCoords.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseCoords.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouseCoords, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      let targetSection = null;
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (obj.userData && obj.userData.section) {
          targetSection = obj.userData.section;
          break;
        }
      }
      if (targetSection && targetSection !== currentStation) {
        transitionToStation(targetSection);
      }
    }
  });

  // Cursor Hover Feedback
  window.addEventListener('mousemove', (e) => {
    if (!document.body.classList.contains('cockpit-mode')) return;
    if (isTransitioning) return;

    mouseCoords.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseCoords.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouseCoords, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      document.body.style.cursor = 'pointer';
      let hoveredSection = null;
      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData && intersects[i].object.userData.section) {
          hoveredSection = intersects[i].object.userData.section;
          break;
        }
      }
      Object.keys(pinsByStation).forEach(k => {
        const sprite = pinsByStation[k];
        if (sprite) {
          if (k === hoveredSection) {
            sprite.scale.set(1.16, 0.3, 1);
          } else {
            sprite.scale.set(1.0, 0.26, 1);
          }
        }
      });
    } else {
      document.body.style.cursor = 'default';
      Object.values(pinsByStation).forEach(sprite => {
        if (sprite) sprite.scale.set(1.0, 0.26, 1);
      });
    }

    // Subtle parallax when in overview mode
    if (currentStation === 'overview') {
      const targetX = CAMERA_VIEWS.overview.pos.x + mouseCoords.x * 0.25;
      const targetY = CAMERA_VIEWS.overview.pos.y + mouseCoords.y * 0.15;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(currentTarget);
    }
  });

  // Keyboard navigation & ESC to reset view
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      transitionToStation('overview');
    } else if (e.key === '1') {
      transitionToStation('projects');
    } else if (e.key === '2') {
      transitionToStation('skills');
    } else if (e.key === '3') {
      transitionToStation('experience');
    } else if (e.key === '4') {
      transitionToStation('contact');
    }
  });

  // ==========================================
  // RENDER LOOP & BLINKING LEDS
  // ==========================================
  const clock = new THREE.Clock();
  let initialFrameRendered = false;

  function animate() {
    requestAnimationFrame(animate);

    const isCockpit = document.body.classList.contains('cockpit-mode');
    // If not in cockpit mode and initial atmospheric frame already rendered, idle to conserve CPU/GPU
    if (!isCockpit && initialFrameRendered) {
      return;
    }
    if (!isCockpit && !initialFrameRendered) {
      initialFrameRendered = true;
    }

    const time = clock.getElapsedTime();

    // Blinking Server LEDs
    ledMeshes.forEach((led, idx) => {
      const blinkSpeed = 4 + (idx % 5);
      const on = Math.sin(time * blinkSpeed + idx) > 0.1;
      led.visible = on;
    });

    // Floating animation on hologram pins (skip if user prefers reduced motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const bob = Math.sin(time * 2) * 0.04;
      pinProjects.position.y = 2.1 + bob;
      pinSkills.position.y = 1.8 + bob;
      pinExp.position.y = 1.8 + bob;
      pinContact.position.y = 1.15 + bob;

      // Monitor glow pulsing
      monitorLight.intensity = 2.4 + Math.sin(time * 3) * 0.35;
      serverLight.intensity = 2.2 + Math.cos(time * 2.5) * 0.3;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Resize
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
})();
