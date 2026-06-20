// ============================================================
//  EcoDrive — Modélisation 3D du pot AlgO2 (Three.js)
//  La coque en aluminium s'ouvre pour révéler la cartouche d'algues.
//  Repli automatique sur le visuel SVG si la 3D échoue.
// ============================================================
const mount = document.getElementById("model3d-canvas");

if (mount) {
  initThree().catch((err) => {
    console.warn("[EcoDrive 3D] indisponible, repli SVG :", err);
    showFallback();
  });
}

function showFallback() {
  const svg = (window.ECODRIVE && window.ECODRIVE.potSVG)
    ? window.ECODRIVE.potSVG("#00B6A6", false)
    : "";
  mount.classList.add("is-fallback");
  mount.innerHTML =
    '<div class="model3d-fallback">' + svg +
    '<p>Aperçu du pot AlgO2<br><small>(visualisation 3D non disponible sur ce navigateur)</small></p></div>';
}

async function initThree() {
  const THREE = await import("three");
  const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");

  let width = mount.clientWidth || 600;
  let height = mount.clientHeight || 460;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0.6, 1.7, 8.5);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x3a444a, 1.0));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(5, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1; key.shadow.camera.far = 30;
  key.shadow.camera.left = -6; key.shadow.camera.right = 6;
  key.shadow.camera.top = 6; key.shadow.camera.bottom = -6;
  key.shadow.bias = -0.0004; key.shadow.radius = 6;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfe9ff, 1.1);
  rim.position.set(-6, 2, -5);
  scene.add(rim);

  // --- Matériaux ---
  const aluminium = new THREE.MeshStandardMaterial({ color: 0xc8d2d6, metalness: 1.0, roughness: 0.22, envMapIntensity: 1.3, side: THREE.DoubleSide });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xeaf0f2, metalness: 1.0, roughness: 0.08, envMapIntensity: 1.5 });
  const algae = new THREE.MeshStandardMaterial({ color: 0x00b6a6, metalness: 0.1, roughness: 0.5, emissive: 0x00b6a6, emissiveIntensity: 0.22 });
  const groove = new THREE.MeshStandardMaterial({ color: 0x00897e, metalness: 0.1, roughness: 0.7 });

  const pot = new THREE.Group();
  const LEN = 3.3;

  // --- Cartouche d'algues (intérieur) ---
  const cartridge = new THREE.Group();
  cartridge.add(new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, LEN - 0.3, 48), algae));
  for (let y = -1.25; y <= 1.25; y += 0.36) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.055, 14, 56), groove);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    cartridge.add(ring);
  }
  pot.add(cartridge);

  // --- Coque aluminium en deux demi-cylindres (s'ouvrent) ---
  const topShell = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, LEN, 64, 1, true, 0, Math.PI), aluminium);
  const bottomShell = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, LEN, 64, 1, true, Math.PI, Math.PI), aluminium);
  pot.add(topShell, bottomShell);

  // --- Embouts (anneaux) + tuyaux ---
  [-LEN / 2, LEN / 2].forEach((y) => {
    const ringEnd = new THREE.Mesh(new THREE.TorusGeometry(0.97, 0.1, 20, 64), aluminium);
    ringEnd.rotation.x = Math.PI / 2;
    ringEnd.position.y = y;
    pot.add(ringEnd);
  });
  const inlet = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.6, 40), aluminium);
  inlet.position.y = -LEN / 2 - 0.55;
  pot.add(inlet);
  const outlet = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.9, 40), chrome);
  outlet.position.y = LEN / 2 + 0.4;
  pot.add(outlet);

  pot.rotation.z = Math.PI / 2;   // couché à l'horizontale
  pot.rotation.x = -0.12;
  scene.add(pot);
  pot.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  // Sol invisible (ombre douce, look studio)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.22 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.9;
  ground.receiveShadow = true;
  scene.add(ground);

  // --- Contrôles ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 13;
  controls.minPolarAngle = Math.PI * 0.22;
  controls.maxPolarAngle = Math.PI * 0.78;
  controls.target.set(0, 0, 0);

  const clock = new THREE.Clock();
  function render() {
    // Ouverture/fermeture automatique et fluide de la coque
    const t = clock.getElapsedTime();
    let x = (Math.sin(t * 0.55) + 1) / 2;       // 0..1
    x = x * x * x * (x * (x * 6 - 15) + 10);     // smootherstep
    const off = x * 1.25;
    topShell.position.x = off;                   // monte (après rotation du groupe)
    bottomShell.position.x = -off;               // descend
    controls.update();
    renderer.render(scene, camera);
  }

  let running = false;
  function start() { if (!running) { running = true; renderer.setAnimationLoop(render); } }
  function stop() { running = false; renderer.setAnimationLoop(null); }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? start() : stop()));
  }, { threshold: 0.05 });
  io.observe(mount);

  window.addEventListener("resize", () => {
    width = mount.clientWidth || width;
    height = mount.clientHeight || height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });
}
