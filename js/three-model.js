// ============================================================
//  EcoDrive — Modélisation 3D du pot AlgO2 (Three.js)
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
  let height = mount.clientHeight || 420;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  // Environnement (reflets métalliques réalistes)
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0.5, 1.6, 8);

  // Lumières
  scene.add(new THREE.HemisphereLight(0xffffff, 0x3a444a, 1.0));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(5, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -6; key.shadow.camera.right = 6;
  key.shadow.camera.top = 6; key.shadow.camera.bottom = -6;
  key.shadow.bias = -0.0004;
  key.shadow.radius = 6;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfe9ff, 1.1);
  rim.position.set(-6, 2, -5);
  scene.add(rim);

  // --- Matériaux ---
  const aluminium = new THREE.MeshStandardMaterial({ color: 0xc8d2d6, metalness: 1.0, roughness: 0.22, envMapIntensity: 1.3 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xeaf0f2, metalness: 1.0, roughness: 0.08, envMapIntensity: 1.5 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x5b676d, metalness: 0.85, roughness: 0.4, envMapIntensity: 1.1 });
  const algae = new THREE.MeshStandardMaterial({ color: 0x00b6a6, metalness: 0.1, roughness: 0.5, emissive: 0x00b6a6, emissiveIntensity: 0.14, envMapIntensity: 1.0 });

  // --- Assemblage du pot (axe vertical Y, puis couché à l'horizontale) ---
  const pot = new THREE.Group();

  const tube = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3.2, 64, 1, false), aluminium);
  pot.add(tube);

  // Cartouche filtrante (algues)
  const filter = new THREE.Mesh(new THREE.CylinderGeometry(1.04, 1.04, 0.95, 64), algae);
  filter.position.y = 0.55;
  pot.add(filter);

  // Nervures de renfort
  [-0.9, -0.2, 1.25].forEach((y) => {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(1.01, 0.05, 16, 64), darkMetal);
    rib.rotation.x = Math.PI / 2;
    rib.position.y = y;
    pot.add(rib);
  });

  // Tuyau d'entrée (gaz)
  const inlet = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.6, 40), aluminium);
  inlet.position.y = -2.1;
  pot.add(inlet);

  // Sortie (embout chromé)
  const outlet = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.62, 0.9, 40), chrome);
  outlet.position.y = 2.05;
  pot.add(outlet);

  // Embouts arrondis
  [-1.6, 1.6].forEach((y) => {
    const cap = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.12, 20, 64), aluminium);
    cap.rotation.x = Math.PI / 2;
    cap.position.y = y;
    pot.add(cap);
  });

  pot.rotation.z = Math.PI / 2;       // couché à l'horizontale
  pot.rotation.x = -0.15;
  scene.add(pot);

  // Ombres portées sur tout le pot
  pot.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  // Sol invisible qui ne reçoit que l'ombre douce (look "studio")
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({ opacity: 0.22 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.85;
  ground.receiveShadow = true;
  scene.add(ground);

  // --- Contrôles ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.4;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 12;
  controls.minPolarAngle = Math.PI * 0.22;
  controls.maxPolarAngle = Math.PI * 0.78;
  controls.target.set(0, 0, 0);

  function render() {
    controls.update();
    renderer.render(scene, camera);
  }

  // Boucle d'animation, en pause hors écran (économie CPU)
  let running = false;
  function start() { if (!running) { running = true; renderer.setAnimationLoop(render); } }
  function stop() { running = false; renderer.setAnimationLoop(null); }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? start() : stop()));
  }, { threshold: 0.05 });
  io.observe(mount);

  // Redimensionnement
  window.addEventListener("resize", () => {
    width = mount.clientWidth || width;
    height = mount.clientHeight || height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  // Pause au changement d'onglet
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });
}
