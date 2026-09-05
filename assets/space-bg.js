/* ============================================================
   GLOBAL FULL-PAGE SPACE BACKGROUND (Three.js)
   Redsan Digitals: Shared across Home, Workshop & Blog
   ============================================================ */
let spaceBgStarted = false;

function initGlobalSpaceBg() {
  if (spaceBgStarted) return;
  const bgCanvas = document.getElementById('space-bg-canvas');
  if (!bgCanvas || typeof THREE === 'undefined') return;
  spaceBgStarted = true;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
  } catch (e) {
    console.warn("WebGL not supported for space bg:", e);
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 12;

  // Star Field 1: Ambient deep space star dust
  const isSmallScreen = window.innerWidth <= 680;
  const starCount = isSmallScreen ? 650 : 1300;
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const colWhite = new THREE.Color(0xffffff);
  const colRed = new THREE.Color(0xE2231A);
  const colSoftBlue = new THREE.Color(0xa6b8e8);

  for (let i = 0; i < starCount; i++) {
    const r = 8 + Math.random() * 34;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);

    const pick = Math.random();
    let c = colWhite;
    if (pick > 0.88) c = colRed;
    else if (pick > 0.78) c = colSoftBlue;

    starColors[i * 3]     = c.r;
    starColors[i * 3 + 1] = c.g;
    starColors[i * 3 + 2] = c.b;
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: isSmallScreen ? 0.05 : 0.042,
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // Star Field 2: Floating foreground dust specks
  const dustCount = isSmallScreen ? 160 : 380;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3]     = (Math.random() - 0.5) * 32;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 32;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 24;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.028,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });
  const dustField = new THREE.Points(dustGeo, dustMat);
  scene.add(dustField);

  // Interactive mouse/touch movement
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;
  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.35;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.35;
  }, { passive: true });

  let clock = new THREE.Clock();
  function animateSpace() {
    requestAnimationFrame(animateSpace);
    const delta = Math.min(clock.getDelta(), 0.05);

    starField.rotation.y += 0.025 * delta;
    starField.rotation.x += 0.01 * delta;

    dustField.rotation.y -= 0.018 * delta;
    dustField.rotation.z += 0.012 * delta;

    targetRotY += (mouseX - targetRotY) * 0.05;
    targetRotX += (mouseY - targetRotX) * 0.05;

    const scrollY = window.scrollY;
    camera.position.x = targetRotY * 1.8;
    camera.position.y = -targetRotX * 1.8 - (scrollY * 0.0008);
    camera.lookAt(0, - (scrollY * 0.0008), 0);

    renderer.render(scene, camera);
  }
  animateSpace();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

// Auto-start on pages that do not have the cinematic reveal overlay
if (typeof window !== 'undefined') {
  const checkAutoStart = function() {
    const hasCinema = document.getElementById('rsd-cinema');
    if (!hasCinema) {
      initGlobalSpaceBg();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAutoStart);
  } else {
    checkAutoStart();
  }
}
