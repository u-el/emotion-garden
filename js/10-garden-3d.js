// 감정정원 · 3D 미니어처 섬: 식물, 소품, 하늘 친구들, 날씨, 산책 모드
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Miniature 3D garden ----------
const SKIES = {
  dawn:  { top: "#f1c4bd", bottom: "#fbe8d5", sun: "#ffd3b3", sunI: 0.95, hs: "#ffe6d8", hg: "#6b5a4a", hi: 0.7, night: false, label: "🌅 새벽 정원" },
  day:   { top: "#a7d0ee", bottom: "#e7f2ea", sun: "#fff3df", sunI: 0.85, hs: "#e2f1ff", hg: "#5a6a4a", hi: 0.55, night: false, label: "☀️ 낮 정원" },
  dusk:  { top: "#9a86c8", bottom: "#f4b896", sun: "#ffb07a", sunI: 0.9, hs: "#dcc6f0", hg: "#4a3a3a", hi: 0.6, night: false, label: "🌇 노을 정원" },
  night: { top: "#0a1124", bottom: "#253350", sun: "#9fb4ff", sunI: 0.35, hs: "#5a6c9c", hg: "#1c1c26", hi: 0.7, night: true, label: "🌙 밤 정원" },
};
const SKY_ORDER = ["dawn", "day", "dusk", "night"];
// one line-icon set for the round buttons on the garden (24px grid, drawn with the button's text colour)
const ICONS = {
  day: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
  dawn: '<path d="M3 18h18M7 18a5 5 0 0 1 10 0M12 4v5M9.5 6.5 12 4l2.5 2.5M4.6 12.6l1.4 1M19.4 12.6l-1.4 1"/>',
  dusk: '<path d="M3 18h18M7 18a5 5 0 0 1 10 0M12 4v5M9.5 6.5 12 9l2.5-2.5M4.6 12.6l1.4 1M19.4 12.6l-1.4 1"/>',
  night: '<path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z"/><path d="M17 4.5v2M16 5.5h2"/>',
  spring: '<circle cx="12" cy="11" r="2.2"/><path d="M12 8.8c-1.6-2.4-.4-4.6 0-4.8.4.2 1.6 2.4 0 4.8zM14.1 10.3c2.6-1 4.3.7 4.3 1.1-.4.3-2.8.9-4.3-1.1zM13.3 12.9c1.5 2.3.4 4.5-.1 4.6-.3-.4-1.3-2.6.1-4.6zM10.7 12.9c-1.4 2 -.4 4.2-.1 4.6.5-.1 1.6-2.3.1-4.6zM9.9 10.3c-1.5 2-3.9 1.4-4.3 1.1 0-.4 1.7-2.1 4.3-1.1zM12 17.5V21"/>',
  summer: '<path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14z"/><path d="M5 19 13 11M9 15h3.5M11 13v-3"/>',
  autumn: '<path d="M12 3l1.6 3.4 2.6-1.2-.6 3.6 3.4-.6-1.6 3 2.6 1.4-4 1.4.6 2.2-3.6-1L12 19l-1-3.8-3.6 1 .6-2.2-4-1.4 2.6-1.4-1.6-3 3.4.6-.6-3.6 2.6 1.2z"/><path d="M12 19v2.5M12 9v7"/>',
  winter: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.6 4.6 12 6.4l2.4-1.8M9.6 19.4 12 17.6l2.4 1.8M4.6 10.4l2.8.3-.6 2.9M19.4 13.6l-2.8-.3.6-2.9M4.6 13.6l2.8-.3-.6-2.9M19.4 10.4l-2.8.3.6 2.9"/>',
  musicOn: '<path d="M9 17.5V6l10-2v11.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>',
  musicOff: '<path d="M9 17.5V6l10-2v11.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/><path d="M3.5 3.5l17 17"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  camera: '<path d="M4 8h3l1.6-2.2h6.8L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.4"/>',
  collapse: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
};
function setIcon(btn, name, label) {
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
  btn.setAttribute("aria-label", label); btn.title = label;
}
const SEASONS = {
  spring: { label: "🌸 봄", grass: "#9ec488", tuft: "#86b56c", canopy: ["#f7c4d4", "#f2adc4", "#fbd8e3", "#f5bccf"], fall: "petal" },
  summer: { label: "🌿 여름", grass: "#77b465", tuft: "#5c9c50", canopy: ["#4f9a4f", "#62af59", "#3f8a45", "#57a352"], fall: "fluff" },
  autumn: { label: "🍂 가을", grass: "#b5ab72", tuft: "#9c8c52", canopy: ["#d9572f", "#e8913a", "#c8402c", "#f0b53c"], fall: "leaf" },
  winter: { label: "❄️ 겨울", grass: "#edf2f4", tuft: "#d8e1e4", canopy: null, fall: "snow" },
};
const SEASON_ORDER = ["spring", "summer", "autumn", "winter"];
function seasonForNow() { const m = new Date().getMonth() + 1; return m >= 3 && m <= 5 ? "spring" : m <= 8 && m >= 6 ? "summer" : m >= 9 && m <= 11 ? "autumn" : "winter"; }
function skyForNow() { const h = new Date().getHours(); return h >= 5 && h < 7 ? "dawn" : h >= 7 && h < 17 ? "day" : h >= 17 && h < 19 ? "dusk" : "night"; }

function initGarden3D() {
  const T = window.THREE;
  if (!T || !T.OrbitControls) return null;
  const host = $("garden3d");
  let renderer;
  try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return null; }
  if (!renderer.getContext()) return null;
  host.hidden = false; cv.hidden = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
  host.append(renderer.domElement);
  const lin = c => new T.Color(c).convertSRGBToLinear();
  const coarse = matchMedia("(pointer: coarse)").matches;

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 300);
  camera.position.set(13, 11, 15);
  const controls = new T.OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, enablePan: false, minDistance: 5, maxDistance: 40,
    maxPolarAngle: Math.PI * 0.46, minPolarAngle: 0.2, autoRotate: !reduce.matches, autoRotateSpeed: 0.45, rotateSpeed: 0.7 });
  controls.target.set(0, -0.9, 0);
  let resumeTimer;
  controls.addEventListener("start", () => { controls.autoRotate = false; clearTimeout(resumeTimer); });
  controls.addEventListener("end", () => { clearTimeout(resumeTimer); resumeTimer = setTimeout(() => { controls.autoRotate = !reduce.matches; }, 9000); });

  const hemi = new T.HemisphereLight(0xffffff, 0x444444, 0.7); scene.add(hemi);
  const rim = new T.DirectionalLight(0xffffff, 0.35); rim.position.set(-10, 7, -12); scene.add(rim);
  const sun = new T.DirectionalLight(0xffffff, 1); sun.position.set(8, 16, 6); sun.castShadow = true;
  const SHADOW = coarse ? 1024 : 2048;
  sun.shadow.mapSize.set(SHADOW, SHADOW); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02;
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 50 });
  scene.add(sun);

  const matCache = new Map();
  const mat = (c, opts) => {
    const key = c + JSON.stringify(opts || {});
    if (!opts && SPECIAL[c]) return SPECIAL[c];
    if (!matCache.has(key)) { const m0 = new T.MeshStandardMaterial(Object.assign({ color: lin(c), roughness: 0.78, flatShading: c === SOIL_DARK }, opts || {})); m0.userData.hex = c; matCache.set(key, m0); }
    return matCache.get(key);
  };
  const mesh = (geo, m, shadow = true) => { const o = new T.Mesh(geo, m); o.castShadow = shadow; o.receiveShadow = true; return o; };
  const BARK = "#6b4f3a", LEAF = "#5b8a5e", SOIL = "#7a634a", SOIL_DARK = "#5e4a37", GRASS = "#86b37a", STONE = "#a7a69b";
  // painted textures, drawn once on canvases (grey-scale so material colours tint them)
  function canvasTex(size, draw, rep) {
    const c = document.createElement("canvas"); c.width = c.height = size; draw(c.getContext("2d"), size);
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]);
    t.encoding = T.sRGBEncoding; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 1); return t;
  }
  let tSeed = 7; const tr = () => (tSeed = (tSeed * 16807) % 2147483647) / 2147483647;
  const grassTex = canvasTex(512, (x, n) => {
    x.fillStyle = "#e9e9e9"; x.fillRect(0, 0, n, n);
    for (let i = 0; i < 2600; i++) { const v = Math.round(212 + tr() * 43); x.strokeStyle = `rgb(${v},${v},${v})`; x.lineWidth = 1 + tr() * 1.5; const px = tr() * n, py = tr() * n, a = -1.57 + (tr() - 0.5) * 0.9, l = 3 + tr() * 7; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
    for (let i = 0; i < 40; i++) { const v = Math.round(205 + tr() * 50); x.fillStyle = `rgba(${v},${v},${v},0.35)`; x.beginPath(); x.arc(tr() * n, tr() * n, 10 + tr() * 30, 0, 7); x.fill(); }
  });
  const soilTex = canvasTex(256, (x, n) => {
    for (let y = 0; y < n; y += 4) { const v = Math.round(185 + tr() * 55); x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(0, y, n, 4); }
    for (let i = 0; i < 260; i++) { const v = Math.round(150 + tr() * 105); x.fillStyle = `rgb(${v},${v},${v})`; x.beginPath(); x.ellipse(tr() * n, tr() * n, 1.5 + tr() * 4, 1 + tr() * 2.5, 0, 0, 7); x.fill(); }
  }, [10, 1]);
  const stoneTex = canvasTex(256, (x, n) => {
    x.fillStyle = "#dedede"; x.fillRect(0, 0, n, n);
    for (let i = 0; i < 500; i++) { const v = Math.round(170 + tr() * 85); x.fillStyle = `rgba(${v},${v},${v},0.6)`; x.beginPath(); x.arc(tr() * n, tr() * n, 2 + tr() * 9, 0, 7); x.fill(); }
  });
  const grassTopMat = new T.MeshStandardMaterial({ color: lin(GRASS), map: grassTex, roughness: 0.95 });
  const soilSideMat = new T.MeshStandardMaterial({ color: lin(SOIL), map: soilTex, roughness: 0.95 });
  const bladeMat = new T.MeshStandardMaterial({ color: lin(GRASS), roughness: 0.9 });
  const SPECIAL = { [STONE]: new T.MeshStandardMaterial({ color: lin(STONE), map: stoneTex, roughness: 0.9, flatShading: true }) };
  const tmpObj = new T.Object3D();
  const glowTex = canvasTex(128, (x, n) => { const g = x.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.22, "rgba(255,255,255,0.5)"); g.addColorStop(0.55, "rgba(255,255,255,0.12)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, n, n); });
  function glow(color, size, opacity) {
    const sp = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: lin(color), transparent: true, opacity, blending: T.AdditiveBlending, depthWrite: false }));
    sp.scale.set(size, size, 1); sp.raycast = () => {}; return sp;
  }
  const rnd = (seed) => { let s = Math.floor(hash(seed) * 2 ** 31) || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

  // ---- island ----
  const world = new T.Group(); scene.add(world);
  let island = null, islandR = 0; const pathStones = [], canopies = [], snowCaps = [], obstacles = [];
  let mailbox = null, mailFlag = null, mailEnvelope = null, mailUnread = 0;
  const floaters = []; let cloudRing = null;
  const cloudMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.9, depthWrite: false });
  function buildIsland(R) {
    if (island) { world.remove(island); island.traverse(o => o.geometry && o.geometry.dispose()); }
    island = new T.Group(); islandR = R; pathStones.length = 0; canopies.length = 0; snowCaps.length = 0; obstacles.length = 0;
    const r = rnd("island" + R);
    const top = new T.CylinderGeometry(R, R * 0.97, 0.35, 64, 1);
    grassTex.repeat.set(R / 2.2, R / 2.2);
    const grass = mesh(top, grassTopMat, false); grass.position.y = -0.17; island.add(grass);
    const soil = mesh(new T.CylinderGeometry(R * 0.97, R * 0.9, 0.9, 48, 1), soilSideMat, false); soil.position.y = -0.8; island.add(soil);
    const cone = new T.ConeGeometry(R * 0.9, R * 0.95, 20, 3); cone.rotateX(Math.PI);
    const cp = cone.attributes.position;
    for (let i = 0; i < cp.count; i++) { const y = cp.getY(i); if (y < R * 0.47) { cp.setX(i, cp.getX(i) * (0.85 + r() * 0.3)); cp.setZ(i, cp.getZ(i) * (0.85 + r() * 0.3)); cp.setY(i, y + (r() - 0.5) * 0.4); } }
    cone.computeVertexNormals();
    const under = mesh(cone, mat(SOIL_DARK), false); under.position.y = -1.25 - R * 0.475; island.add(under);
    // stepping-stone path from the rim toward the centre (the future walking entrance)
    for (let i = 0; i < 9; i++) {
      const t = i / 8, ang = -0.6 + Math.sin(t * 3) * 0.12, rad = R * (0.97 - t * 0.55);
      const st = mesh(new T.CylinderGeometry(0.32 + r() * 0.1, 0.36, 0.08, 7), mat(STONE), false);
      st.position.set(Math.cos(ang) * rad, 0.03, Math.sin(ang) * rad); st.rotation.y = r() * 3; st.userData.path = true; pathStones.push(st); island.add(st);
    }
    // rocks and grass tufts
    for (let i = 0; i < 4 + Math.round(R / 2); i++) {
      let a = r() * 6.28; const d = R * (0.78 + r() * 0.17);
      if (Math.abs(Math.atan2(Math.sin(a + 0.6), Math.cos(a + 0.6))) < 0.6) a += 1.4; // keep the path entrance clear
      const rock = mesh(new T.IcosahedronGeometry(0.25 + r() * 0.35, 0), mat(STONE)); rock.scale.y = 0.6;
      rock.position.set(Math.cos(a) * d, 0.05, Math.sin(a) * d); rock.rotation.set(r(), r() * 3, r()); island.add(rock);
    }
    {
      const bladeGeo = new T.ConeGeometry(0.016, 0.22, 3); bladeGeo.translate(0, 0.11, 0);
      const nB = Math.round(R * R * (coarse ? 9 : 14));
      const blades = new T.InstancedMesh(bladeGeo, bladeMat, nB); blades.receiveShadow = true;
      for (let i = 0; i < nB; i++) {
        const a = r() * 6.28, d = Math.sqrt(r()) * R * 0.96;
        tmpObj.position.set(Math.cos(a) * d, -0.01, Math.sin(a) * d);
        tmpObj.rotation.set((r() - 0.5) * 0.5, r() * 6.28, (r() - 0.5) * 0.5);
        const h = 0.45 + r() * 0.75; tmpObj.scale.set(1, h, 1); tmpObj.updateMatrix(); blades.setMatrixAt(i, tmpObj.matrix);
        const v = 0.72 + r() * 0.4; blades.setColorAt(i, new T.Color(v, v * (1 + (r() - 0.5) * 0.12), v * 0.92));
      }
      blades.instanceColor.needsUpdate = true; island.add(blades);
    }
    // floating islets and clouds around the diorama
    floaters.length = 0;
    for (let i = 0; i < 3; i++) {
      const fi = new T.Group(), fr = 0.45 + r() * 0.4, fa = 1.2 + i * 2.1 + r() * 0.5, fd = R * (1.35 + r() * 0.25);
      const ft = mesh(new T.CylinderGeometry(fr, fr * 0.95, 0.16, 20), grassTopMat, false);
      const fu = mesh(new T.ConeGeometry(fr * 0.92, fr * 1.6, 7), mat(SOIL_DARK), false); fu.rotation.x = Math.PI; fu.position.y = -0.88 * fr - 0.08;
      fi.add(ft, fu);
      if (r() < 0.7) { const fs = mesh(new T.IcosahedronGeometry(fr * 0.35, 0), mat(STONE)); fs.position.set(fr * 0.2, 0.12, 0); fs.scale.y = 0.7; fi.add(fs); }
      fi.position.set(Math.cos(fa) * fd, -0.6 + r() * 1.8, Math.sin(fa) * fd);
      fi.userData = { baseY: fi.position.y, phase: r() * 6.28 }; floaters.push(fi); island.add(fi);
    }
    cloudRing = new T.Group();
    for (let i = 0; i < 5; i++) {
      const cl = new T.Group(), ca = i / 5 * 6.283 + r() * 0.6, cd = R * (1.5 + r() * 0.5);
      for (let k = 0; k < 4; k++) { const puff = new T.Mesh(new T.SphereGeometry(0.5 + r() * 0.45, 14, 10), cloudMat); puff.position.set((k - 1.5) * 0.55, r() * 0.25, (r() - 0.5) * 0.4); puff.scale.y = 0.65; cl.add(puff); }
      cl.position.set(Math.cos(ca) * cd, -2.2 + r() * 2.6, Math.sin(ca) * cd); cl.rotation.y = -ca; cl.scale.setScalar(0.7 + r() * 0.45);
      cloudRing.add(cl);
    }
    island.add(cloudRing);
    // two seasonal trees on the rim
    for (const ta of [2.5, 4.1]) {
      const tree = new T.Group(), td = R * 0.8;
      tree.position.set(Math.cos(ta) * td, 0, Math.sin(ta) * td);
      const trunk = mesh(new T.CylinderGeometry(0.1, 0.16, 1.7, 6), mat(BARK)); trunk.position.y = 0.85; tree.add(trunk);
      const ends = [];
      for (let b = 0; b < 4; b++) {
        const ba = b * 1.57 + r() * 0.5, len = 0.7 + r() * 0.3;
        const br = mesh(new T.CylinderGeometry(0.035, 0.06, len, 5), mat(BARK));
        br.position.set(Math.cos(ba) * len * 0.3, 1.45 + b * 0.12, Math.sin(ba) * len * 0.3);
        br.rotation.set(Math.sin(ba) * 0.8, 0, -Math.cos(ba) * 0.8); tree.add(br);
        ends.push(new T.Vector3(Math.cos(ba) * len * 0.6, 1.7 + b * 0.12 + len * 0.3, Math.sin(ba) * len * 0.6));
      }
      ends.push(new T.Vector3(0, 2.25, 0));
      ends.forEach((v, i) => {
        const cn = mesh(new T.IcosahedronGeometry(0.45 + r() * 0.25, 1), mat("#ffffff", { flatShading: true })); cn.position.copy(v); cn.rotation.set(r(), r(), r());
        cn.userData.canopy = i; canopies.push(cn); tree.add(cn);
        const cap = mesh(new T.SphereGeometry(0.12, 6, 4), mat("#f7fafb")); cap.scale.set(1.6, 0.45, 1.6); cap.position.set(v.x * 0.85, v.y - 0.2, v.z * 0.85);
        snowCaps.push(cap); tree.add(cap);
      });
      const trunkCap = mesh(new T.SphereGeometry(0.11, 6, 4), mat("#f7fafb")); trunkCap.scale.y = 0.4; trunkCap.position.y = 2.0; snowCaps.push(trunkCap); tree.add(trunkCap);
      obstacles.push({ x: tree.position.x, z: tree.position.z, r: 0.45 });
      island.add(tree);
    }
    // mailbox beside the path entrance
    {
      const mb = new T.Group(), ma = -0.6 - 0.45, mdist = R * 0.9;
      mb.position.set(Math.cos(ma) * mdist, 0, Math.sin(ma) * mdist); mb.rotation.y = -ma;
      const post = mesh(new T.BoxGeometry(0.08, 0.72, 0.08), mat(BARK)); post.position.y = 0.36;
      const body = mesh(new T.BoxGeometry(0.26, 0.22, 0.4), mat("#c4553f")); body.position.y = 0.82;
      const roof = mesh(new T.CylinderGeometry(0.13, 0.13, 0.4, 12, 1, false, 0, Math.PI), mat("#c4553f")); roof.rotation.x = Math.PI / 2; roof.rotation.y = Math.PI / 2; roof.position.y = 0.93;
      const slot = mesh(new T.BoxGeometry(0.27, 0.03, 0.12), mat("#5e2a20")); slot.position.set(0, 0.86, 0.15);
      mailFlag = new T.Group(); mailFlag.position.set(0.14, 0.78, -0.08);
      const pole = mesh(new T.BoxGeometry(0.02, 0.26, 0.02), mat("#e8b23c")); pole.position.y = 0.13;
      const cloth = mesh(new T.BoxGeometry(0.015, 0.08, 0.11), mat("#e8b23c")); cloth.position.set(0, 0.22, -0.05);
      mailFlag.add(pole, cloth);
      mailEnvelope = new T.Group();
      const env = mesh(new T.BoxGeometry(0.26, 0.17, 0.02), mat("#fbf7ee")); const seal = mesh(new T.CylinderGeometry(0.03, 0.03, 0.03, 10), mat("#c4553f")); seal.rotation.x = Math.PI / 2; seal.position.z = 0.015;
      mailEnvelope.add(env, seal, glow("#fff1c4", 0.9, 0.55)); mailEnvelope.position.y = 1.35;
      mb.add(post, body, roof, slot, mailFlag, mailEnvelope);
      mb.traverse(o => { o.userData.mailbox = true; });
      mailbox = mb; obstacles.push({ x: mb.position.x, z: mb.position.z, r: 0.35 });
      island.add(mb);
    }
    // stone lantern on the rim
    const lantern = new T.Group();
    const la = 0.9, ld = R * 0.82;
    lantern.position.set(Math.cos(la) * ld, 0, Math.sin(la) * ld); obstacles.push({ x: lantern.position.x, z: lantern.position.z, r: 0.4 });
    const p1 = mesh(new T.CylinderGeometry(0.28, 0.34, 0.16, 6), mat(STONE)); p1.position.y = 0.08;
    const p2 = mesh(new T.CylinderGeometry(0.09, 0.11, 0.7, 6), mat(STONE)); p2.position.y = 0.5;
    const p3 = mesh(new T.CylinderGeometry(0.24, 0.2, 0.1, 6), mat(STONE)); p3.position.y = 0.9;
    const box = mesh(new T.CylinderGeometry(0.17, 0.17, 0.3, 6), lanternMat); box.position.y = 1.1;
    const roof = mesh(new T.ConeGeometry(0.38, 0.28, 6), mat(STONE)); roof.position.y = 1.39;
    const knob = mesh(new T.SphereGeometry(0.06, 6, 4), mat(STONE)); knob.position.y = 1.56;
    lantern.add(p1, p2, p3, box, roof, knob);
    lanternGlow = glow("#ffc46b", 2.6, 0); lanternGlow.position.y = 1.1; lantern.add(lanternGlow);
    lanternLight.position.set(lantern.position.x, 1.15, lantern.position.z);
    island.add(lantern);
    world.add(island);
    fitCamera();
  }
  function fitCamera() {
    const R = islandR || 6, tv = Math.tan((camera.fov * Math.PI / 180) / 2);
    const dist = Math.max(R * 2.3, (R * 1.12) / (tv * camera.aspect), 10);
    controls.maxDistance = dist * 1.6; controls.minDistance = Math.max(3.5, R * 0.45);
    const dir = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(controls.target).addScaledVector(dir, dist);
  }
  const lanternMat = new T.MeshStandardMaterial({ color: lin(0xfff1c4), emissive: lin(0xffc46b), emissiveIntensity: 0, roughness: 0.6, flatShading: true });
  const lanternLight = new T.PointLight(lin(0xffc46b), 0, 8, 2); scene.add(lanternLight);
  let lanternGlow = null;

  // ---- plant builders (base at y = 0) ----
  function stemTube(h, bend, r = 0.035, to) {
    const end = to || new T.Vector3(0, h, 0);
    const curve = new T.QuadraticBezierCurve3(new T.Vector3(0, 0, 0), new T.Vector3(bend, h * 0.5, 0), end);
    return { m: mesh(new T.TubeGeometry(curve, 12, r, 7, false), mat(LEAF)), curve };
  }
  function leafMesh(size, col) { const l = mesh(new T.SphereGeometry(1, 14, 8), mat(col || LEAF)); l.scale.set(size * 0.45, size * 0.08, size * 0.2); return l; }
  function addLeaf(g, y, ang, size, col) { const l = leafMesh(size, col); l.position.set(Math.cos(ang) * size * 0.35, y, Math.sin(ang) * size * 0.35); l.rotation.set(0, -ang, 0.45); g.add(l); }

  function buildPlant(e) {
    const g = new T.Group();
    const main = e.emotions[0], fam = E[main.n][1], c = E[main.n][2];
    const acc = e.emotions[1] ? E[e.emotions[1].n][2] : null;
    const k = 0.62 + main.s * 0.13, stage = stageOf(e), r = rnd(e.id || e.title);
    let top = 0.3;
    if (stage === 0) {
      const mound = mesh(new T.SphereGeometry(0.3, 10, 6, 0, 6.29, 0, Math.PI / 2), mat(SOIL)); mound.scale.y = 0.45; g.add(mound);
      const seed = mesh(new T.SphereGeometry(0.09, 8, 6), mat(c)); seed.scale.set(0.8, 1.2, 0.8); seed.position.y = 0.16; seed.rotation.z = 0.5; g.add(seed);
      top = 0.3;
    } else if (stage === 1) {
      const mound = mesh(new T.SphereGeometry(0.24, 10, 6, 0, 6.29, 0, Math.PI / 2), mat(SOIL)); mound.scale.y = 0.35; g.add(mound);
      const s = stemTube(0.42, 0.03); g.add(s.m);
      addLeaf(g, 0.42, 0.3, 0.38); addLeaf(g, 0.42, 0.3 + Math.PI, 0.38, c);
      top = 0.55;
    } else if (stage === 2) {
      const h = 1.1 * k; g.add(stemTube(h, 0.06).m);
      addLeaf(g, h * 0.35, r() * 6, 0.45); addLeaf(g, h * 0.55, r() * 6, 0.4);
      const bud = mesh(new T.SphereGeometry(0.13 * k, 16, 12), mat(c)); bud.scale.y = 1.7; bud.position.y = h + 0.14 * k; g.add(bud);
      for (let i = 0; i < 3; i++) { const sp = mesh(new T.ConeGeometry(0.05, 0.16, 4), mat(LEAF)); sp.position.set(Math.cos(i * 2.1) * 0.07, h + 0.02, Math.sin(i * 2.1) * 0.07); sp.rotation.set(Math.sin(i * 2.1) * 0.5, 0, -Math.cos(i * 2.1) * 0.5); g.add(sp); }
      top = h + 0.4 * k;
    } else {
      switch (fam) {
        case "daisy": {
          const h = 1.5 * k; g.add(stemTube(h, 0.1).m); addLeaf(g, h * 0.3, r() * 6, 0.5); addLeaf(g, h * 0.5, r() * 6, 0.45);
          const head = new T.Group(); head.position.y = h; head.rotation.x = 0.35;
          const pr = 0.24 * k;
          for (let i = 0; i < 11; i++) { const pt = mesh(new T.SphereGeometry(1, 14, 8), mat(c)); pt.scale.set(pr * 0.38, 0.035, pr * 0.9); const a = i / 11 * 6.283; pt.position.set(Math.sin(a) * pr, 0, Math.cos(a) * pr); pt.rotation.y = a; head.add(pt); }
          const ctr = mesh(new T.SphereGeometry(pr * 0.45, 16, 10), mat(acc || "#7a5a2a")); ctr.scale.y = 0.55; head.add(ctr);
          g.add(head); top = h + 0.35;
          break;
        }
        case "tulip": {
          const h = 1.35 * k; g.add(stemTube(h, -0.08).m); addLeaf(g, h * 0.2, 0.5, 0.65); addLeaf(g, h * 0.3, 3.6, 0.55);
          const pts = [[0, 0], [0.11, 0.02], [0.17, 0.1], [0.18, 0.22], [0.15, 0.33], [0.1, 0.4]].map(([x, y]) => new T.Vector2(x * k * 1.3, y * k * 1.3));
          const cup = mesh(new T.LatheGeometry(pts, 18), mat(c, { side: T.DoubleSide })); cup.position.y = h - 0.02; g.add(cup);
          if (acc) { const in1 = mesh(new T.SphereGeometry(0.06 * k, 6, 5), mat(acc)); in1.position.y = h + 0.12 * k; g.add(in1); }
          top = h + 0.6 * k;
          break;
        }
        case "bell": {
          const h = 1.45 * k, end = new T.Vector3(0.55 * k, h, 0);
          const s = stemTube(h, -0.1, 0.035, end); g.add(s.m); addLeaf(g, h * 0.3, 3.1, 0.5);
          const n = 1 + Math.ceil(main.s / 2);
          for (let i = 0; i < n; i++) {
            const p = s.curve.getPoint(0.55 + i * (0.45 / n));
            const bell = mesh(new T.ConeGeometry(0.13 * k, 0.24 * k, 16, 1, true), mat(i === n - 1 && acc ? acc : c, { side: T.DoubleSide }));
            bell.position.set(p.x + 0.02, p.y - 0.2 * k, p.z); g.add(bell);
            const tip = mesh(new T.SphereGeometry(0.03, 5, 4), mat(c)); tip.position.set(p.x + 0.02, p.y - 0.06 * k, p.z); g.add(tip);
          }
          top = h + 0.2;
          break;
        }
        case "fern": {
          const n = 3 + Math.ceil(main.s / 2);
          for (let f = 0; f < n; f++) {
            const fr = new T.Group(); fr.rotation.y = f / n * 6.283 + r() * 0.4; fr.rotation.z = 0;
            const L = (1.1 + r() * 0.3) * k;
            const curve = new T.QuadraticBezierCurve3(new T.Vector3(0, 0, 0), new T.Vector3(L * 0.15, L * 0.75, 0), new T.Vector3(L * 0.6, L * 0.95, 0));
            fr.add(mesh(new T.TubeGeometry(curve, 8, 0.02, 4, false), mat(LEAF)));
            for (let q = 2; q < 10; q++) {
              const t = q / 10, p = curve.getPoint(t), sz = 0.16 * (1 - t) + 0.05;
              for (const side of [-1, 1]) { const lf = mesh(new T.SphereGeometry(1, 5, 4), mat(f % 2 && acc ? acc : c)); lf.scale.set(sz, 0.02, 0.04); lf.position.set(p.x, p.y, side * sz * 0.9); lf.rotation.y = side * 0.4; fr.add(lf); }
            }
            g.add(fr);
          }
          top = 1.2 * k;
          break;
        }
        case "thorn": {
          const h = 1.2 * k, w = 0.2 * k;
          const body = mesh(new T.CylinderGeometry(w * 0.9, w, h, 14), mat(LEAF)); body.position.y = h / 2; g.add(body);
          const cap = mesh(new T.SphereGeometry(w * 0.9, 8, 5, 0, 6.29, 0, Math.PI / 2), mat(LEAF)); cap.position.y = h; g.add(cap);
          const arm = mesh(new T.CylinderGeometry(w * 0.55, w * 0.6, h * 0.4, 7), mat(LEAF)); arm.position.set(w * 1.3, h * 0.55, 0); g.add(arm);
          const armJ = mesh(new T.CylinderGeometry(w * 0.5, w * 0.5, w * 1.3, 6), mat(LEAF)); armJ.rotation.z = Math.PI / 2; armJ.position.set(w * 0.75, h * 0.38, 0); g.add(armJ);
          for (let i = 0; i < 14; i++) { const a = i * 2.4, y = 0.15 + (i / 14) * h * 0.85; const sp = mesh(new T.ConeGeometry(0.02, 0.12, 3), mat(c)); sp.position.set(Math.cos(a) * w, y, Math.sin(a) * w); sp.rotation.set(0, 0, 0); sp.lookAt(new T.Vector3(Math.cos(a) * 3, y, Math.sin(a) * 3)); sp.rotateX(Math.PI / 2); g.add(sp); }
          for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283; const pt = mesh(new T.SphereGeometry(1, 6, 4), mat(c)); pt.scale.set(0.05, 0.03, 0.12); pt.position.set(Math.sin(a) * 0.1, h + w * 0.9, Math.cos(a) * 0.1); pt.rotation.y = a; g.add(pt); }
          if (acc) { const ct = mesh(new T.SphereGeometry(0.05, 6, 4), mat(acc)); ct.position.y = h + w * 0.95; g.add(ct); }
          top = h + w + 0.2;
          break;
        }
        case "moss": {
          const rk = mesh(new T.IcosahedronGeometry(0.42 * k, 0), mat(STONE)); rk.scale.y = 0.6; rk.position.y = 0.12; rk.rotation.y = r() * 3; g.add(rk);
          const moss = mesh(new T.SphereGeometry(0.4 * k, 18, 10, 0, 6.29, 0, Math.PI / 2), mat(c)); moss.scale.y = 0.55; moss.position.y = 0.2 * k; g.add(moss);
          for (let i = 0; i < 6; i++) { const d = mesh(new T.SphereGeometry(0.035, 5, 4), mat(acc || LEAF)); const a = r() * 6.28, rr = r() * 0.3 * k; d.position.set(Math.cos(a) * rr, 0.2 * k + 0.2 * k * (1 - rr / (0.35 * k)), Math.sin(a) * rr); g.add(d); }
          const sp = stemTube(0.3, 0.05, 0.02); sp.m.position.set(0.1, 0.3 * k, 0); g.add(sp.m);
          top = 0.55 * k + 0.2;
          break;
        }
        case "willow": {
          const h = 1.5 * k; g.add(stemTube(h, 0.05, 0.05).m);
          const n = 7 + main.s;
          for (let i = 0; i < n; i++) {
            const a = i / n * 6.283 + r() * 0.3, spread = (0.3 + r() * 0.25) * k, drop = (0.7 + r() * 0.4) * k;
            const curve = new T.QuadraticBezierCurve3(new T.Vector3(0, h, 0), new T.Vector3(Math.cos(a) * spread * 0.8, h + 0.18, Math.sin(a) * spread * 0.8), new T.Vector3(Math.cos(a) * spread, h - drop, Math.sin(a) * spread));
            g.add(mesh(new T.TubeGeometry(curve, 10, 0.018, 4, false), mat(i % 3 === 0 && acc ? acc : c)));
          }
          top = h + 0.3;
          break;
        }
        case "vine": {
          // a morning-glory-like vine winding up a little bamboo stake
          const h = 1.45 * k;
          const stake = mesh(new T.CylinderGeometry(0.025, 0.03, h + 0.15, 8), mat("#b89a6a")); stake.position.y = (h + 0.15) / 2; g.add(stake);
          const turns = 2.6, pts = [];
          for (let i = 0; i <= 60; i++) { const t = i / 60, a = t * turns * 6.283; pts.push(new T.Vector3(Math.cos(a) * 0.09, t * h, Math.sin(a) * 0.09)); }
          const helix = new T.CatmullRomCurve3(pts);
          g.add(mesh(new T.TubeGeometry(helix, 80, 0.016, 6, false), mat(LEAF)));
          for (let i = 0; i < 7; i++) {
            const t = 0.12 + i * 0.12, p = helix.getPoint(t), a = t * turns * 6.283;
            const lf = mesh(new T.SphereGeometry(1, 12, 8), mat(LEAF)); lf.scale.set(0.1, 0.015, 0.075);
            lf.position.set(p.x + Math.cos(a) * 0.07, p.y, p.z + Math.sin(a) * 0.07); lf.rotation.set(0, -a, 0.5); g.add(lf);
          }
          const nf = 1 + Math.ceil(main.s / 2);
          for (let i = 0; i < nf; i++) {
            const t = 0.45 + i * (0.5 / nf), p = helix.getPoint(t), a = t * turns * 6.283 + 0.6;
            const fl = new T.Group(); fl.position.set(p.x + Math.cos(a) * 0.1, p.y, p.z + Math.sin(a) * 0.1);
            fl.lookAt(new T.Vector3(Math.cos(a) * 3, p.y + 1.2, Math.sin(a) * 3));
            const trumpet = mesh(new T.ConeGeometry(0.13 * k, 0.18 * k, 18, 1, true), mat(i === nf - 1 && acc ? acc : c, { side: T.DoubleSide }));
            trumpet.rotation.x = -Math.PI / 2; trumpet.position.z = 0.05; fl.add(trumpet);
            const throat = mesh(new T.SphereGeometry(0.03, 10, 8), mat("#fff4d6")); throat.position.z = -0.03; fl.add(throat);
            g.add(fl);
          }
          top = h + 0.2;
          break;
        }
        case "sunflower": {
          const h = 1.9 * k; g.add(stemTube(h, 0.12, 0.045).m);
          for (const [y, a, sz] of [[0.3, 0.5, 0.7], [0.5, 3.4, 0.65], [0.7, 1.9, 0.55]]) addLeaf(g, h * y, a, sz);
          const hd = new T.Group(); hd.position.y = h; hd.rotation.x = 0.95; g.add(hd);
          const disk = mesh(new T.CylinderGeometry(0.15 * k, 0.15 * k, 0.05, 28), mat("#5a3a1e")); hd.add(disk);
          for (let i = 0; i < 40; i++) { const a = i * 2.39996, rr = Math.sqrt(i / 40) * 0.13 * k; const sd = mesh(new T.SphereGeometry(0.012, 6, 4), mat(acc || "#3a2412")); sd.position.set(Math.cos(a) * rr, 0.03, Math.sin(a) * rr); hd.add(sd); }
          petalRing(hd, 18, 0.13 * k, 0.04 * k, c, 0.12, 0, 0, 0.02); petalRing(hd, 18, 0.12 * k, 0.038 * k, c, 0.3, -0.01, 0.17, 0.02);
          top = h + 0.25; break;
        }
        case "camellia": {
          const h = 0.9 * k; g.add(stemTube(h, 0.05, 0.04).m);
          const glossy = mat("#2f5d3a", { roughness: 0.35 });
          for (let i = 0; i < 9; i++) { const lf = mesh(new T.SphereGeometry(1, 14, 8), glossy); lf.scale.set(0.16, 0.03, 0.08); const a = i * 2.1, y = h * (0.45 + (i % 4) * 0.15); lf.position.set(Math.cos(a) * 0.13, y, Math.sin(a) * 0.13); lf.rotation.set(0.3, -a, 0.35); g.add(lf); }
          const spots = [[0, h + 0.05, 0], [0.16, h * 0.8, 0.08], [-0.14, h * 0.7, -0.06]].slice(0, 1 + Math.ceil(main.s / 2));
          spots.forEach(([x, y, z], i) => { const hd = new T.Group(); hd.position.set(x, y, z); hd.rotation.set(-0.3 + i * 0.4, i, 0); g.add(hd);
            petalRing(hd, 6, 0.1 * k, 0.07 * k, c, 0.5, 0, 0, 0.025); petalRing(hd, 5, 0.075 * k, 0.055 * k, i === 0 && acc ? acc : c, 0.95, 0.015, 0.5, 0.025);
            for (let j = 0; j < 7; j++) { const st = mesh(new T.CylinderGeometry(0.004, 0.004, 0.05, 4), mat("#f6d36a")); const a = j / 7 * 6.283; st.position.set(Math.cos(a) * 0.015, 0.035, Math.sin(a) * 0.015); hd.add(st); } });
          top = h + 0.25; break;
        }
        case "starflower": {
          const h = 1.35 * k; g.add(stemTube(h, 0.06, 0.025).m); addLeaf(g, h * 0.3, 1.2, 0.4);
          const shine = new T.MeshStandardMaterial({ color: lin(c), emissive: lin(c), emissiveIntensity: 0.45, roughness: 0.35 }); shine.userData.hex = c;
          const hd = new T.Group(); hd.position.y = h; hd.rotation.x = 0.3; g.add(hd);
          for (let i = 0; i < 5; i++) { const pv = new T.Group(); pv.rotation.y = i / 5 * 6.283; const pt = mesh(new T.ConeGeometry(0.06 * k, 0.24 * k, 4), shine); pt.rotation.x = Math.PI / 2; pt.scale.y = 1; pt.scale.x = 0.35; pt.position.z = 0.12 * k; pv.add(pt); hd.add(pv); }
          const ctr = mesh(new T.SphereGeometry(0.04 * k, 12, 8), mat(acc || "#fff6c8")); hd.add(ctr);
          const sp = glow(c, 0.7, 0.5); hd.add(sp);
          top = h + 0.2; break;
        }
        case "dandelion": {
          const h = 1.25 * k; g.add(stemTube(h, 0.08, 0.018).m);
          for (let i = 0; i < 6; i++) { const lf = mesh(new T.SphereGeometry(1, 10, 6), mat(LEAF)); lf.scale.set(0.24, 0.015, 0.045); const a = i * 1.05; lf.position.set(Math.cos(a) * 0.14, 0.04, Math.sin(a) * 0.14); lf.rotation.y = -a; g.add(lf); }
          const hd = new T.Group(); hd.position.y = h; g.add(hd);
          const core = mesh(new T.SphereGeometry(0.03 * k, 10, 8), mat(acc || "#d8cfa8")); hd.add(core);
          const n = 46, R0 = 0.16 * k;
          for (let i = 0; i < n; i++) { const y = 1 - (i + 0.5) / n * 2, rr = Math.sqrt(1 - y * y), a = i * 2.39996; const dir = new T.Vector3(Math.cos(a) * rr, y, Math.sin(a) * rr);
            const st = mesh(new T.CylinderGeometry(0.0025, 0.0025, R0, 3), mat("#f4f1e8")); st.position.copy(dir).multiplyScalar(R0 / 2); st.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir); hd.add(st);
            const tuft = mesh(new T.SphereGeometry(0.014, 6, 4), mat(i % 3 ? "#ffffff" : c)); tuft.position.copy(dir).multiplyScalar(R0); hd.add(tuft); }
          top = h + 0.22; break;
        }
        case "lotus": {
          const pond = mesh(new T.CylinderGeometry(0.42, 0.42, 0.04, 30), new T.MeshStandardMaterial({ color: lin("#4f8fc4"), roughness: 0.12, metalness: 0.2 })); pond.position.y = 0.02; g.add(pond);
          for (const [x, z, rr] of [[0.22, 0.12, 0.13], [-0.2, -0.14, 0.11], [0.02, -0.26, 0.09]]) { const pad = mesh(new T.CylinderGeometry(rr, rr, 0.012, 20, 1, false, 0.3, 5.8), mat("#5f9e5a")); pad.position.set(x, 0.045, z); g.add(pad); }
          const hd = new T.Group(); hd.position.set(-0.04, 0.08, 0.04); hd.scale.setScalar(k); g.add(hd);
          petalRing(hd, 8, 0.15, 0.06, c, 0.35, 0, 0, 0.03); petalRing(hd, 8, 0.13, 0.055, c, 0.75, 0.02, 0.39, 0.03); petalRing(hd, 6, 0.1, 0.045, acc || c, 1.15, 0.04, 0.2, 0.03);
          const pod = mesh(new T.CylinderGeometry(0.05, 0.035, 0.05, 14), mat("#e6c23a")); pod.position.y = 0.05; hd.add(pod);
          top = 0.45; break;
        }
        case "hydrangea": {
          const h = 1.05 * k; g.add(stemTube(h, 0.05, 0.035).m);
          for (const [y, a] of [[0.35, 0.4], [0.5, 2.5], [0.62, 4.4]]) addLeaf(g, h * y, a, 0.6);
          const heads = [[0, h + 0.1, 0, 1]].concat(main.s >= 3 ? [[0.22, h * 0.82, 0.1, 0.75]] : []).concat(main.s >= 5 ? [[-0.2, h * 0.78, -0.08, 0.7]] : []);
          heads.forEach(([x, y, z, sc2]) => { const hd = new T.Group(); hd.position.set(x, y, z); hd.scale.setScalar(sc2 * k); g.add(hd);
            const n = 34, R0 = 0.2;
            for (let i = 0; i < n; i++) { const yy = 1 - (i + 0.5) / n * 1.4, rr = Math.sqrt(Math.max(0, 1 - yy * yy)), a = i * 2.39996; const dir = new T.Vector3(Math.cos(a) * rr, yy, Math.sin(a) * rr).normalize();
              const fl = new T.Group(); fl.position.copy(dir).multiplyScalar(R0); fl.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
              const col = i % 4 === 0 && acc ? acc : c;
              for (let q = 0; q < 4; q++) { const pt = mesh(new T.SphereGeometry(1, 8, 6), mat(col)); pt.scale.set(0.035, 0.008, 0.035); const qa = q * Math.PI / 2; pt.position.set(Math.cos(qa) * 0.03, 0, Math.sin(qa) * 0.03); fl.add(pt); }
              hd.add(fl); } });
          top = h + 0.35; break;
        }
        case "lavender": {
          const n = 4 + main.s, lav = "#" + new T.Color(c).lerp(new T.Color("#9b7fd4"), 0.6).getHexString(), lavAcc = acc ? "#" + new T.Color(acc).lerp(new T.Color("#9b7fd4"), 0.4).getHexString() : lav;
          for (let i = 0; i < n; i++) {
            const a = i / n * 6.283 + r() * 0.4, lean = 0.08 + r() * 0.12, h = (0.9 + r() * 0.4) * k;
            const end = new T.Vector3(Math.cos(a) * lean, h, Math.sin(a) * lean);
            const s2 = stemTube(h, Math.cos(a) * 0.04, 0.009, end); s2.m.material = mat("#7f9a7a"); g.add(s2.m);
            for (let q = 0; q < 9; q++) { const t2 = 0.68 + q * 0.04, pnt = s2.curve.getPoint(Math.min(1, t2)); const fl = mesh(new T.SphereGeometry(0.022 * (1 - q * 0.05), 8, 6), mat(i % 3 === 0 && acc ? lavAcc : lav)); fl.material.userData.hex = c; fl.scale.y = 1.3; fl.position.copy(pnt); g.add(fl); }
          }
          for (let i = 0; i < 6; i++) { const lf = mesh(new T.SphereGeometry(1, 8, 6), mat("#8fa88a")); lf.scale.set(0.012, 0.18, 0.012); const a = i * 1.05; lf.position.set(Math.cos(a) * 0.05, 0.15, Math.sin(a) * 0.05); lf.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4); g.add(lf); }
          top = 1.3 * k; break;
        }
        case "wildrose": {
          const bushR = 0.2 * k, rose = "#" + new T.Color(c).lerp(new T.Color("#e8648a"), 0.6).getHexString(), roseAcc = acc ? "#" + new T.Color(acc).lerp(new T.Color("#e8648a"), 0.4).getHexString() : rose;
          for (let i = 0; i < 5; i++) { const a = i * 1.26, b2 = mesh(new T.IcosahedronGeometry(bushR * (0.42 + (i % 3) * 0.08), 1), mat("#3f6b3f", { flatShading: true })); b2.position.set(Math.cos(a) * bushR * 0.55, bushR * (0.55 + (i % 2) * 0.3), Math.sin(a) * bushR * 0.55); g.add(b2); }
          for (let i = 0; i < 14; i++) { const a = i * 2.39996, lf = mesh(new T.SphereGeometry(1, 8, 6), mat("#4f8a4f")); lf.scale.set(0.05, 0.012, 0.03); lf.position.set(Math.cos(a) * bushR * 0.95, bushR * (0.4 + (i % 5) * 0.22), Math.sin(a) * bushR * 0.95); lf.rotation.y = -a; g.add(lf); }
          for (let i = 0; i < 10; i++) { const a = i * 2.3, th = mesh(new T.ConeGeometry(0.012, 0.06, 4), mat("#7a4a3a")); th.position.set(Math.cos(a) * bushR * 1.05, bushR * (0.5 + (i % 4) * 0.25), Math.sin(a) * bushR * 1.05); th.lookAt(new T.Vector3(Math.cos(a) * 3, th.position.y, Math.sin(a) * 3)); th.rotateX(Math.PI / 2); g.add(th); }
          const nRose = 2 + Math.ceil(main.s / 2);
          for (let i = 0; i < nRose; i++) { const a = i * 2.4 + 0.3, hd = new T.Group(); hd.position.set(Math.cos(a) * bushR * 0.95, bushR * (1.0 + (i % 2) * 0.35), Math.sin(a) * bushR * 0.95); hd.lookAt(new T.Vector3(Math.cos(a) * 3, hd.position.y + 1.5, Math.sin(a) * 3)); hd.rotateX(Math.PI / 2); g.add(hd);
            petalRing(hd, 5, 0.085 * k, 0.07 * k, i === 0 && acc ? roseAcc : rose, 0.3, 0, 0, 0.022); hd.traverse(o => { if (o.material && o.material.userData.hex === rose) o.material.userData.hex = c; }); const ctr = mesh(new T.SphereGeometry(0.022, 8, 6), mat("#f6d36a")); ctr.position.y = 0.012; hd.add(ctr); }
          top = bushR * 1.9 + 0.1; break;
        }
        default: {
          g.add(stemTube(0.5, 0.03).m); addLeaf(g, 0.5, 0.3, 0.45); addLeaf(g, 0.5, 0.3 + Math.PI, 0.45, c);
          top = 0.65;
        }
      }
    }
    if (stage === 3) { const fg = glow(c, 1.0, 0); fg.position.y = Math.max(0.3, top - 0.2); fg.userData.flowerGlow = true; g.add(fg); g.userData.glow = fg; }
    if (stage === 3 && e.rare) {
      const RAIN7 = ["#ff6b6b", "#ffa94d", "#ffe066", "#69db7c", "#4dabf7", "#748ffc", "#da77f2"]; let ri = 0;
      const goldMat = side => new T.MeshStandardMaterial({ color: lin("#f3c64f"), metalness: 0.7, roughness: 0.28, emissive: lin("#7a5a00"), emissiveIntensity: 0.3, side });
      const gm = { [T.FrontSide]: goldMat(T.FrontSide), [T.DoubleSide]: goldMat(T.DoubleSide) };
      g.traverse(o => { if (o.isMesh && o.material && o.material.userData && o.material.userData.hex === c) {
        if (e.rare === "gold") o.material = gm[o.material.side] || gm[T.FrontSide];
        else { const m2 = o.material.clone(); m2.color = lin(RAIN7[ri++ % 7]); if (m2.emissive && m2.emissiveIntensity) m2.emissive = m2.color.clone(); o.material = m2; } } });
      const tw = new T.Group(); tw.position.y = Math.max(0.3, top - 0.1);
      for (let i = 0; i < 5; i++) { const sp = glow(e.rare === "gold" ? "#ffe9a0" : RAIN7[i], 0.18, 0.8); sp.userData.a = i / 5 * 6.283; tw.add(sp); }
      g.add(tw); g.userData.twinkle = tw;
    }
    g.traverse(o => { o.userData.entryId = e.id; });
    g.userData.top = top; g.userData.fam = fam;
    return g;
  }

  // ---- birthday flowers (one shape per month) ----
  function petalRing(parent, n, len, wid, col, tilt, y = 0, off = 0, thick = 0.03) {
    for (let i = 0; i < n; i++) {
      const pv = new T.Group(); pv.rotation.y = i / n * 6.283 + off; pv.position.y = y;
      const pt = mesh(new T.SphereGeometry(1, 14, 8), mat(col)); pt.scale.set(wid, thick, len);
      pt.position.z = len * 0.85; pv.rotation.x = 0; const lift = new T.Group(); lift.rotation.x = -tilt; lift.add(pt); pv.add(lift); parent.add(pv);
    }
  }
  function bladeLeaf(g, h, ang, col) { const l = mesh(new T.SphereGeometry(1, 12, 8), mat(col || LEAF)); l.scale.set(0.045, h, 0.012); l.position.set(Math.cos(ang) * 0.06, h * 0.9, Math.sin(ang) * 0.06); l.rotation.set(Math.sin(ang) * 0.25, 0, -Math.cos(ang) * 0.25); g.add(l); }
  function buildBirthFlower(m) {
    const g = new T.Group(); let top = 1.2;
    const head = (h, tiltX = 0.3) => { const hd = new T.Group(); hd.position.y = h; hd.rotation.x = tiltX; g.add(hd); return hd; };
    switch (m) {
      case 1: { // carnation
        g.add(stemTube(1.0, 0.06).m); addLeaf(g, 0.35, 1, 0.5); addLeaf(g, 0.55, 4, 0.45);
        const hd = head(1.0, 0.2);
        [[13, 0.15, 0.55], [12, 0.13, 0.85], [11, 0.11, 1.1], [9, 0.09, 1.35], [7, 0.06, 1.5]].forEach(([n, l, t], i) => petalRing(hd, n, l, l * 0.6, i % 2 ? "#f6a8c2" : "#ef7fa6", t, i * 0.03, i * 0.35, 0.028));
        top = 1.2; break;
      }
      case 2: { // violets: a clump of nodding flowers, buds and heart-shaped leaves
        const DEEP = "#4f2d9a", MID = "#7350c4", LIGHT = "#9a7ad8", r2 = rnd("violet");
        const heart = new T.Shape();
        heart.moveTo(0, 0); heart.bezierCurveTo(-0.03, 0.04, -0.13, 0.08, -0.11, 0.16); heart.bezierCurveTo(-0.09, 0.22, -0.02, 0.22, 0, 0.17);
        heart.bezierCurveTo(0.02, 0.22, 0.09, 0.22, 0.11, 0.16); heart.bezierCurveTo(0.13, 0.08, 0.03, 0.04, 0, 0);
        const leafGeo = new T.ShapeGeometry(heart, 10); leafGeo.translate(0, -0.17, 0); // notch at the origin, tip pointing away
        for (let i = 0; i < 10; i++) {
          const a = i / 10 * 6.283 + r2() * 0.3, d = 0.05 + r2() * 0.08, sc = 0.7 + r2() * 0.35;
          const pv = new T.Group(); pv.position.set(Math.cos(a) * d, 0.03 + r2() * 0.05, Math.sin(a) * d); pv.rotation.y = -a + Math.PI / 2;
          const lf = mesh(leafGeo, mat(i % 3 ? "#3f7a45" : "#4f8a4f", { side: T.DoubleSide })); lf.scale.setScalar(sc); lf.rotation.x = -Math.PI / 2 - 0.35 - r2() * 0.3; pv.add(lf);
          const pet = mesh(new T.CylinderGeometry(0.006, 0.008, 0.06, 5), mat(LEAF)); pet.position.y = -0.02; pv.add(pet);
          g.add(pv);
        }
        const petal = (w, h, col) => { const m2 = mesh(new T.SphereGeometry(1, 16, 10), mat(col)); m2.scale.set(w, h, 0.012); return m2; };
        function violet() {
          const f = new T.Group();
          for (const sx of [-1, 1]) { const up = petal(0.045, 0.07, DEEP); up.position.set(sx * 0.032, 0.055, -0.006); up.rotation.z = -sx * 0.35; f.add(up); }
          for (const sx of [-1, 1]) { const sd = petal(0.055, 0.04, MID); sd.position.set(sx * 0.058, 0.0, 0.004); sd.rotation.z = sx * 0.25; f.add(sd);
            const beard = mesh(new T.SphereGeometry(0.006, 8, 6), mat("#d9c8f5")); beard.position.set(sx * 0.026, 0.0, 0.015); f.add(beard); }
          const low = petal(0.06, 0.06, MID); low.position.set(0, -0.045, 0.012); f.add(low);
          const edge = petal(0.05, 0.045, LIGHT); edge.position.set(0, -0.06, 0.008); f.add(edge);
          const throat = mesh(new T.SphereGeometry(0.015, 12, 8), mat("#efe6ff")); throat.scale.set(1, 1.3, 0.35); throat.position.set(0, -0.02, 0.022); f.add(throat);
          for (const vx of [-0.016, 0, 0.016]) { const v = mesh(new T.BoxGeometry(0.0022, 0.03, 0.002), mat("#2e1760")); v.position.set(vx, -0.05, 0.026); v.rotation.z = vx * 8; f.add(v); }
          const eye = mesh(new T.SphereGeometry(0.009, 8, 6), mat("#f6c431")); eye.position.set(0, -0.004, 0.03); f.add(eye);
          return f;
        }
        const spots = [[0, 0, 0.5], [0.13, 0.06, 0.42], [-0.12, 0.08, 0.38], [0.05, -0.13, 0.45], [-0.08, -0.1, 0.34], [0.15, -0.07, 0.3]];
        spots.forEach(([x, z, h], i) => {
          const out = Math.atan2(z, x) || r2() * 6.28, dx = Math.cos(out), dz = Math.sin(out);
          const tip = new T.Vector3(x + dx * 0.05, h, z + dz * 0.05);
          const curve = new T.QuadraticBezierCurve3(new T.Vector3(x * 0.4, 0, z * 0.4), new T.Vector3(x, h * 1.12, z), tip);
          g.add(mesh(new T.TubeGeometry(curve, 12, 0.007, 5, false), mat(LEAF)));
          const f = violet(); f.position.copy(tip); f.position.y -= 0.03;
          f.lookAt(new T.Vector3(tip.x + dx, tip.y - 0.25, tip.z + dz)); f.scale.setScalar(0.95 + (i % 3) * 0.08); g.add(f);
        });
        for (const [x, z, h] of [[-0.03, 0.14, 0.33], [0.1, 0.15, 0.27]]) {
          const curve = new T.QuadraticBezierCurve3(new T.Vector3(x * 0.4, 0, z * 0.4), new T.Vector3(x, h * 1.1, z), new T.Vector3(x + 0.03, h, z + 0.03));
          g.add(mesh(new T.TubeGeometry(curve, 10, 0.006, 5, false), mat(LEAF)));
          const bud = mesh(new T.SphereGeometry(0.022, 12, 8), mat(DEEP)); bud.scale.set(0.8, 1.6, 0.8); bud.position.set(x + 0.03, h - 0.03, z + 0.03); bud.rotation.x = 0.5; g.add(bud);
        }
        top = 0.62; break;
      }
      case 3: { // daffodil
        g.add(stemTube(1.05, 0.05).m); for (const a of [0, 2.1, 4.2]) bladeLeaf(g, 0.4, a);
        const hd = head(1.05, 1.25);
        petalRing(hd, 6, 0.17, 0.08, "#fffaf0", 0.12);
        const cup = mesh(new T.CylinderGeometry(0.075, 0.05, 0.12, 18, 1, true), mat("#f6c431", { side: T.DoubleSide })); cup.position.y = 0.06; hd.add(cup);
        top = 1.2; break;
      }
      case 4: { // daisy
        g.add(stemTube(0.95, 0.08).m); addLeaf(g, 0.3, 2, 0.45);
        const hd = head(0.95, 0.35);
        petalRing(hd, 18, 0.17, 0.035, "#ffffff", 0.08); petalRing(hd, 14, 0.13, 0.03, "#f6f2fa", 0.2, 0.01, 0.2);
        const c = mesh(new T.SphereGeometry(0.07, 16, 10), mat("#f2c230")); c.scale.y = 0.55; hd.add(c);
        top = 1.1; break;
      }
      case 5: { // lily of the valley
        for (const a of [0.4, 3.5]) { const l = mesh(new T.SphereGeometry(1, 14, 8), mat(LEAF)); l.scale.set(0.13, 0.42, 0.03); l.position.set(Math.cos(a) * 0.08, 0.38, Math.sin(a) * 0.08); l.rotation.y = -a; l.rotation.z = Math.cos(a) * 0.15; g.add(l); }
        const end = new T.Vector3(0.35, 0.8, 0), s2 = stemTube(0.85, -0.1, 0.018, end); g.add(s2.m);
        for (let i = 0; i < 6; i++) { const p = s2.curve.getPoint(0.4 + i * 0.1); const b = mesh(new T.SphereGeometry(0.045, 12, 10, 0, 6.29, 0, 2.1), mat("#fbfbf6", { side: T.DoubleSide })); b.rotation.x = Math.PI; b.position.set(p.x, p.y - 0.06, p.z); g.add(b); }
        top = 0.95; break;
      }
      case 6: { // rose
        g.add(stemTube(1.0, 0.05).m); addLeaf(g, 0.4, 1.4, 0.45); addLeaf(g, 0.6, 4.3, 0.4);
        const hd = head(1.0, 0.15);
        const bud = mesh(new T.SphereGeometry(0.06, 14, 10), mat("#b81f37")); bud.scale.y = 1.4; bud.position.y = 0.06; hd.add(bud);
        [[5, 0.07, 1.35], [6, 0.1, 1.1], [7, 0.13, 0.8], [8, 0.15, 0.5]].forEach(([n, l, t], i) => petalRing(hd, n, l, l * 0.8, i < 2 ? "#c8283f" : "#d63a4f", t, 0.02 - i * 0.01, i * 0.5, 0.03));
        top = 1.2; break;
      }
      case 7: { // water lily on a little pond
        const pond = mesh(new T.CylinderGeometry(0.55, 0.55, 0.04, 32), new T.MeshStandardMaterial({ color: lin("#4f8fc4"), roughness: 0.15, metalness: 0.2 })); pond.position.y = 0.02; g.add(pond);
        for (const [x, z, r] of [[0.25, 0.15, 0.16], [-0.22, -0.18, 0.13], [0.05, -0.3, 0.1]]) { const pad = mesh(new T.CylinderGeometry(r, r, 0.015, 20, 1, false, 0.3, 5.8), mat("#5f9e5a")); pad.position.set(x, 0.05, z); g.add(pad); }
        const hd = new T.Group(); hd.position.set(-0.05, 0.06, 0.05); g.add(hd);
        petalRing(hd, 8, 0.13, 0.05, "#f7b8cf", 0.35); petalRing(hd, 8, 0.11, 0.045, "#f4a0bf", 0.75, 0.02, 0.4);
        const c = mesh(new T.SphereGeometry(0.04, 12, 8), mat("#f2c230")); c.position.y = 0.04; hd.add(c);
        top = 0.4; break;
      }
      case 8: { // gladiolus
        g.add(stemTube(1.45, 0.04).m); for (const a of [0.5, 2.6, 4.7]) bladeLeaf(g, 0.6, a);
        for (let i = 0; i < 7; i++) { const y = 0.75 + i * 0.1, sz = 0.11 - i * 0.008, side = i % 2 ? 1 : -1;
          const hd = new T.Group(); hd.position.set(side * 0.05, y, 0); hd.rotation.set(1.2, 0, side * 0.5); g.add(hd);
          petalRing(hd, 5, sz, sz * 0.7, i % 2 ? "#f06a4a" : "#f4825f", 0.4, 0, i); }
        top = 1.55; break;
      }
      case 9: { // aster
        g.add(stemTube(0.95, 0.06).m); addLeaf(g, 0.4, 1.8, 0.4);
        const hd = head(0.95, 0.3);
        petalRing(hd, 26, 0.16, 0.022, "#9a6ad6", 0.1); petalRing(hd, 20, 0.12, 0.02, "#b48ae6", 0.3, 0.01, 0.15);
        const c = mesh(new T.SphereGeometry(0.06, 14, 10), mat("#f2c230")); c.scale.y = 0.6; hd.add(c);
        top = 1.1; break;
      }
      case 10: { // cosmos
        const s2 = stemTube(1.3, 0.15, 0.022); g.add(s2.m);
        for (let i = 0; i < 4; i++) { const p = s2.curve.getPoint(0.2 + i * 0.15); const l = mesh(new T.SphereGeometry(1, 8, 6), mat(LEAF)); l.scale.set(0.16, 0.01, 0.015); l.position.copy(p); l.rotation.y = i * 1.7; g.add(l); }
        const hd = head(1.3, 0.4);
        petalRing(hd, 8, 0.17, 0.085, "#f39ac4", 0.1);
        const c = mesh(new T.SphereGeometry(0.045, 12, 8), mat("#e0a020")); c.scale.y = 0.6; hd.add(c);
        top = 1.45; break;
      }
      case 11: { // chrysanthemum pompom
        g.add(stemTube(0.9, 0.05).m); addLeaf(g, 0.35, 0.7, 0.45); addLeaf(g, 0.55, 3.6, 0.4);
        const hd = head(0.95, 0.15);
        [[16, 0.13, 0.15], [15, 0.115, 0.45], [14, 0.1, 0.75], [12, 0.085, 1.05], [9, 0.065, 1.35]].forEach(([n, l, t], i) => petalRing(hd, n, l, 0.03, i % 2 ? "#f2c230" : "#f5d34f", t, i * 0.02, i * 0.25, 0.022));
        top = 1.15; break;
      }
      default: { // poinsettia
        for (let i = 0; i < 6; i++) { const l = mesh(new T.SphereGeometry(1, 12, 8), mat(LEAF)); l.scale.set(0.2, 0.02, 0.08); const pv = new T.Group(); pv.rotation.y = i * 1.05; l.position.x = 0.18; l.rotation.z = -0.25; pv.position.y = 0.35; pv.add(l); g.add(pv); }
        g.add(stemTube(0.45, 0.02, 0.04).m);
        const hd = head(0.48, 0);
        petalRing(hd, 6, 0.2, 0.07, "#d32b2b", 0.12); petalRing(hd, 6, 0.14, 0.055, "#e03a35", 0.3, 0.02, 0.5);
        for (let i = 0; i < 5; i++) { const d = mesh(new T.SphereGeometry(0.018, 8, 6), mat("#f2c230")); d.position.set(Math.cos(i * 1.26) * 0.03, 0.04, Math.sin(i * 1.26) * 0.03); hd.add(d); }
        top = 0.7;
      }
    }
    g.userData.top = top; return g;
  }
  let birthIslet = null, birthKey = "", sparkles = null;
  function syncBirthIslet() {
    const key = hasBirthday() ? `${profile.birthMonth}|${islandR}` : "";
    if (key === birthKey) { if (sparkles) sparkles.visible = isBirthMonth(); return; }
    birthKey = key;
    if (birthIslet) { world.remove(birthIslet); birthIslet = null; sparkles = null; }
    if (!hasBirthday()) return;
    const R = islandR, bi = new T.Group(), ang = 1.7, dist = R * 1.28;
    bi.position.set(Math.cos(ang) * dist, 0.35, Math.sin(ang) * dist);
    const top = mesh(new T.CylinderGeometry(1.0, 0.96, 0.22, 36), grassTopMat, false); top.position.y = -0.11;
    const under = mesh(new T.ConeGeometry(0.95, 1.7, 9), mat(SOIL_DARK), false); under.rotation.x = Math.PI; under.position.y = -1.07;
    const ring = mesh(new T.TorusGeometry(0.38, 0.06, 8, 24), mat(STONE)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.03;
    const sign = new T.Group(); sign.position.set(0.55, 0, 0.35);
    const post = mesh(new T.BoxGeometry(0.04, 0.4, 0.04), mat(BARK)); post.position.y = 0.2;
    const board = mesh(new T.BoxGeometry(0.3, 0.17, 0.03), mat("#d9b98a")); board.position.y = 0.42; board.rotation.y = -0.5;
    sign.add(post, board);
    const flScale = profile.birthMonth === 2 ? 2.3 : 1.45;
    const fl = buildBirthFlower(profile.birthMonth); fl.scale.setScalar(flScale);
    bi.add(top, under, ring, sign, fl);
    sparkles = new T.Group(); sparkles.position.y = fl.userData.top * flScale * 0.75;
    for (let i = 0; i < 8; i++) { const sp = glow("#fff4c2", 0.22, 0.9); sp.userData.a = i / 8 * 6.283; sp.userData.r = 0.45 + (i % 3) * 0.12; sparkles.add(sp); }
    sparkles.add(glow("#ffe9b0", 1.6, 0.45)); sparkles.visible = isBirthMonth(); bi.add(sparkles);
    bi.traverse(o => { o.userData.birthday = true; });
    bi.userData.baseY = 0.35; birthIslet = bi; world.add(bi);
  }

  // ---- decorations bought with petals ----
  const decorObstacles = [], decorGlows = [], chimeStrips = [], pinwheels = []; let decorGroup = null, decorKey = "", chimeStrip = null, pinwheel = null;
  function buildDecor(id) {
    const g = new T.Group(); let r = 0.35;
    switch (id) {
      case "mushroom":
        [[0, 0, 0.32, 0.17], [0.2, 0.1, 0.22, 0.12], [-0.15, 0.14, 0.18, 0.1], [0.08, -0.17, 0.14, 0.08]].forEach(([x, z, h, cr]) => {
          const st = mesh(new T.CylinderGeometry(cr * 0.35, cr * 0.45, h, 12), mat("#f4ecdc")); st.position.set(x, h / 2, z); g.add(st);
          const cap = mesh(new T.SphereGeometry(cr, 18, 10, 0, 6.29, 0, Math.PI / 2), mat("#d6483c")); cap.position.set(x, h - 0.01, z); cap.scale.y = 0.75; g.add(cap);
          for (let i = 0; i < 5; i++) { const dt = mesh(new T.SphereGeometry(cr * 0.12, 8, 6), mat("#fffaf0")); const a = i * 1.26; dt.position.set(x + Math.cos(a) * cr * 0.6, h + cr * 0.42, z + Math.sin(a) * cr * 0.6); g.add(dt); }
        }); r = 0.3; break;
      case "cairn":
        [[0.34, 0.11], [0.27, 0.1], [0.21, 0.09], [0.15, 0.08], [0.1, 0.07]].reduce((y, [w, hh], i) => { const st = mesh(new T.SphereGeometry(w, 14, 8), mat(STONE)); st.scale.y = hh / w * 1.6; st.position.set((i % 2 ? 0.02 : -0.02), y + hh * 0.8, 0); st.rotation.y = i; g.add(st); return y + hh * 1.55; }, 0);
        r = 0.35; break;
      case "chime": {
        const post = mesh(new T.CylinderGeometry(0.035, 0.045, 1.5, 8), mat(BARK)); post.position.y = 0.75; g.add(post);
        const arm = mesh(new T.BoxGeometry(0.4, 0.04, 0.04), mat(BARK)); arm.position.set(0.18, 1.45, 0); g.add(arm);
        chimeStrip = new T.Group(); chimeStrip.position.set(0.34, 1.43, 0);
        const bell = mesh(new T.SphereGeometry(0.08, 16, 10, 0, 6.29, 0, 1.9), mat("#b98a3c", { metalness: 0.6, roughness: 0.35, side: T.DoubleSide })); bell.position.y = -0.08; chimeStrip.add(bell);
        const strip = mesh(new T.BoxGeometry(0.07, 0.24, 0.005), mat("#f4f0e4")); strip.position.y = -0.28; chimeStrip.add(strip);
        const tie = mesh(new T.CylinderGeometry(0.004, 0.004, 0.12, 4), mat("#9a2c2c")); tie.position.y = -0.14; chimeStrip.add(tie);
        g.add(chimeStrip); chimeStrips.push(chimeStrip); g.userData.chime = true; r = 0.25; break;
      }
      case "lamp": {
        const post = mesh(new T.CylinderGeometry(0.03, 0.04, 1.3, 8), mat(BARK)); post.position.y = 0.65; g.add(post);
        const arm = mesh(new T.BoxGeometry(0.32, 0.035, 0.035), mat(BARK)); arm.position.set(0.14, 1.27, 0); g.add(arm);
        const lmat = new T.MeshStandardMaterial({ color: lin("#e2553f"), emissive: lin("#ff8a4c"), emissiveIntensity: 0, roughness: 0.7 });
        const paper = mesh(new T.SphereGeometry(0.15, 18, 12), lmat); paper.scale.y = 1.25; paper.position.set(0.28, 1.02, 0); g.add(paper);
        for (const y of [0.83, 1.21]) { const rim = mesh(new T.CylinderGeometry(0.08, 0.08, 0.03, 12), mat("#3a2a20")); rim.position.set(0.28, y, 0); g.add(rim); }
        const gl = glow("#ffb070", 1.8, 0); gl.position.set(0.28, 1.02, 0); g.add(gl);
        decorGlows.push({ sprite: gl, mat: lmat }); r = 0.25; break;
      }
      case "bench": {
        for (let i = 0; i < 3; i++) { const b = mesh(new T.BoxGeometry(0.9, 0.035, 0.09), mat(i % 2 ? "#9c6b45" : "#a87650")); b.position.set(0, 0.36, -0.1 + i * 0.1); g.add(b); }
        for (let i = 0; i < 2; i++) { const b = mesh(new T.BoxGeometry(0.9, 0.08, 0.03), mat("#9c6b45")); b.position.set(0, 0.55 + i * 0.12, -0.17); b.rotation.x = -0.12; g.add(b); }
        for (const x of [-0.38, 0.38]) for (const z of [-0.12, 0.12]) { const l = mesh(new T.BoxGeometry(0.05, 0.36, 0.05), mat("#6b4f3a")); l.position.set(x, 0.18, z); g.add(l); }
        for (const x of [-0.38, 0.38]) { const l = mesh(new T.BoxGeometry(0.05, 0.4, 0.04), mat("#6b4f3a")); l.position.set(x, 0.56, -0.17); g.add(l); }
        r = 0.5; break;
      }
      case "birdhouse": {
        const post = mesh(new T.CylinderGeometry(0.035, 0.045, 1.1, 8), mat(BARK)); post.position.y = 0.55; g.add(post);
        const box = mesh(new T.BoxGeometry(0.26, 0.26, 0.24), mat("#e9d6b0")); box.position.y = 1.22; g.add(box);
        const roof = mesh(new T.ConeGeometry(0.25, 0.18, 4), mat("#5d7fa6")); roof.position.y = 1.44; roof.rotation.y = Math.PI / 4; g.add(roof);
        const hole = mesh(new T.CircleGeometry(0.045, 16), mat("#3a2a20")); hole.position.set(0, 1.24, 0.121); g.add(hole);
        const perch = mesh(new T.CylinderGeometry(0.01, 0.01, 0.08, 6), mat(BARK)); perch.rotation.x = Math.PI / 2; perch.position.set(0, 1.16, 0.15); g.add(perch);
        const bird = new T.Group(); bird.position.set(0.05, 1.53, 0.02);
        const bb = mesh(new T.SphereGeometry(0.06, 14, 10), mat("#7aa6c8")); bb.scale.set(1, 0.9, 1.3); bird.add(bb);
        const bh = mesh(new T.SphereGeometry(0.04, 12, 8), mat("#7aa6c8")); bh.position.set(0, 0.04, 0.06); bird.add(bh);
        const beak = mesh(new T.ConeGeometry(0.012, 0.04, 6), mat("#f2b33c")); beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.04, 0.11); bird.add(beak);
        const belly = mesh(new T.SphereGeometry(0.045, 10, 8), mat("#f3e2c6")); belly.position.set(0, -0.01, 0.04); bird.add(belly);
        g.add(bird); g.userData.bird = bird; r = 0.25; break;
      }
      case "pond": {
        const water = mesh(new T.CylinderGeometry(0.55, 0.55, 0.04, 36), new T.MeshStandardMaterial({ color: lin("#4f8fc4"), roughness: 0.1, metalness: 0.25 }), false); water.position.y = 0.01; g.add(water);
        for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; const st = mesh(new T.SphereGeometry(0.09 + (i % 3) * 0.02, 10, 6), mat(STONE)); st.scale.y = 0.55; st.position.set(Math.cos(a) * 0.6, 0.03, Math.sin(a) * 0.6); g.add(st); }
        for (const [x, z, rr] of [[0.2, 0.1, 0.12], [-0.18, -0.15, 0.1]]) { const pad = mesh(new T.CylinderGeometry(rr, rr, 0.012, 20, 1, false, 0.3, 5.8), mat("#5f9e5a")); pad.position.set(x, 0.04, z); g.add(pad); }
        const lot = new T.Group(); lot.position.set(0.2, 0.05, 0.1); petalRing(lot, 7, 0.06, 0.025, "#f7b8cf", 0.6); g.add(lot);
        r = 0.65; break;
      }
      case "pinwheel": {
        const stick = mesh(new T.CylinderGeometry(0.02, 0.025, 1.1, 8), mat("#f3efe6")); stick.position.y = 0.55; g.add(stick);
        pinwheel = new T.Group(); pinwheel.position.set(0, 1.08, 0.05);
        ["#ef5a5a", "#f6c431", "#5ab27a", "#5a8fe0"].forEach((col, i) => {
          const bl = new T.Shape(); bl.moveTo(0, 0); bl.lineTo(0.22, 0.02); bl.lineTo(0.02, 0.2); bl.lineTo(0, 0);
          const m2 = mesh(new T.ShapeGeometry(bl), mat(col, { side: T.DoubleSide })); m2.rotation.z = i * Math.PI / 2; pinwheel.add(m2);
        });
        const pin = mesh(new T.SphereGeometry(0.03, 10, 8), mat("#ffffff")); pin.position.z = 0.01; pinwheel.add(pin);
        g.add(pinwheel); pinwheels.push(pinwheel); r = 0.2; break;
      }
      case "startree": {
        const trunk = mesh(new T.CylinderGeometry(0.06, 0.1, 1.2, 8), mat("#5d4a6e")); trunk.position.y = 0.6; g.add(trunk);
        for (const [x, y, z, rr] of [[0, 1.35, 0, 0.45], [0.28, 1.15, 0.1, 0.3], [-0.25, 1.2, -0.1, 0.32], [0.05, 1.6, -0.05, 0.3]]) {
          const cn = mesh(new T.IcosahedronGeometry(rr, 1), mat("#3d4f8a", { flatShading: true })); cn.position.set(x, y, z); g.add(cn);
        }
        const starMat = new T.MeshStandardMaterial({ color: lin("#fff3b0"), emissive: lin("#ffd95a"), emissiveIntensity: 0.6, roughness: 0.4 });
        for (let i = 0; i < 9; i++) {
          const a = i * 2.4, yy = 1.05 + (i % 4) * 0.17, rr = 0.42 - (i % 4) * 0.05;
          const st = mesh(new T.OctahedronGeometry(0.05, 0), starMat); st.position.set(Math.cos(a) * rr, yy, Math.sin(a) * rr); g.add(st);
          const gl = glow("#ffe27a", 0.45, 0.25); gl.position.copy(st.position); g.add(gl); decorGlows.push({ sprite: gl, mat: starMat, always: true });
        }
        r = 0.4; break;
      }
      case "arch": {
        const arc = mesh(new T.TorusGeometry(0.62, 0.035, 8, 36, Math.PI), mat("#8a6a4a")); arc.position.y = 0.9; g.add(arc);
        for (const x of [-0.62, 0.62]) { const leg = mesh(new T.CylinderGeometry(0.035, 0.04, 0.9, 8), mat("#8a6a4a")); leg.position.set(x, 0.45, 0); g.add(leg); }
        const cols = ["#f4a6c0", "#fff1f5", "#f6c431", "#c9a0e6", "#ff8c69"];
        for (let i = 0; i < 26; i++) {
          const t = i / 25, a = Math.PI * t, onLeg = i < 4 || i > 21;
          const px = onLeg ? (i < 4 ? -0.62 : 0.62) : Math.cos(a) * 0.62, py = onLeg ? 0.25 + (i < 4 ? i : 25 - i) * 0.17 : 0.9 + Math.sin(a) * 0.62;
          const f = mesh(new T.SphereGeometry(0.05 + (i % 3) * 0.012, 10, 8), mat(cols[i % cols.length])); f.position.set(px + (Math.random() - 0.5) * 0.04, py, (i % 2 ? 0.04 : -0.04)); g.add(f);
          if (i % 2) { const lf = mesh(new T.SphereGeometry(1, 8, 6), mat(LEAF)); lf.scale.set(0.06, 0.015, 0.035); lf.position.set(px, py - 0.05, i % 4 ? 0.06 : -0.06); g.add(lf); }
        }
        g.userData.archLegs = true; r = 0; break;
      }
    }
    g.userData.r = r; return g;
  }
  const baseYaw = (id, a) => id === "arch" ? -a + Math.PI / 2 : -a - Math.PI / 2;
  function syncDecor() {
    const { placed } = decorState();
    const key = JSON.stringify(placed) + "|" + islandR;
    if (key === decorKey) return;
    decorKey = key;
    if (decorGroup) world.remove(decorGroup);
    decorObstacles.length = 0; decorGlows.length = 0; chimeStrips.length = 0; pinwheels.length = 0;
    decorGroup = new T.Group();
    for (const it of placed) {
      if (!DECOR.some(d => d.id === it.id)) continue;
      const d = buildDecor(it.id), rad = it.f * islandR;
      const x = Math.cos(it.a) * rad, z = Math.sin(it.a) * rad, yaw = baseYaw(it.id, it.a) + (it.rot || 0) * Math.PI / 4;
      d.position.set(x, 0, z); d.rotation.y = yaw;
      if (d.userData.archLegs) { const sx = Math.cos(yaw) * 0.62, sz = -Math.sin(yaw) * 0.62; decorObstacles.push({ x: x + sx, z: z + sz, r: 0.15 }, { x: x - sx, z: z - sz, r: 0.15 }); }
      else decorObstacles.push({ x, z, r: d.userData.r });
      // a generous invisible touch area, so thin things like the chime post are easy to tap
      const tr = Math.max(0.32, d.userData.r || 0.7), touch = new T.Mesh(new T.CylinderGeometry(tr, tr, it.id === "pond" ? 0.3 : 1.5, 10), hitMat);
      touch.position.y = it.id === "pond" ? 0.15 : 0.75; d.add(touch);
      d.traverse(o => { o.userData.decor = it.id; o.userData.decorUid = it.uid; });
      decorGroup.add(d);
    }
    world.add(decorGroup); applySky();
    if (selectedUid && !placed.some(x => x.uid === selectedUid)) hideDecorBar();
  }

  // ---- placing and arranging decorations ----
  let placing = null, selectedUid = null;
  const planeY0 = new T.Plane(new T.Vector3(0, 1, 0), 0), hitPt = new T.Vector3();
  function islandPoint(ev) {
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (!ray.ray.intersectPlane(planeY0, hitPt)) return null;
    const r = Math.hypot(hitPt.x, hitPt.z); if (r > islandR * 0.96) return null;
    const f = Math.min(0.93, r / islandR), a = Math.atan2(hitPt.z, hitPt.x);
    return { a, f, x: Math.cos(a) * f * islandR, z: Math.sin(a) * f * islandR };
  }
  function ghostOf(id) {
    const g = buildDecor(id);
    g.traverse(o => { if (o.material) { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.55; o.material.depthWrite = false; } o.castShadow = false; o.raycast = () => {}; });
    const ring = new T.Mesh(new T.RingGeometry(0.42, 0.5, 32), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, side: T.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; ring.raycast = () => {}; g.add(ring);
    g.visible = false; return g;
  }
  function place(id, uid) {
    if (mode !== "orbit") { showTip("섬 위로 돌아온 다음 놓을 수 있어요", true); return; }
    endPlace(); hideDecorBar();
    const d = DECOR.find(x => x.id === id);
    placing = { id, uid: uid || null, ghost: ghostOf(id) }; world.add(placing.ghost);
    controls.autoRotate = false; host.classList.add("placing");
    $("place-text").textContent = `${d.icon} ${uid ? "옮길" : "놓을"} 자리를 눌러 주세요`;
    $("place-bar").hidden = false; $("walk-btn").hidden = true;
  }
  function endPlace() {
    if (!placing) return;
    world.remove(placing.ghost); placing = null; host.classList.remove("placing");
    $("place-bar").hidden = true; if (mode === "orbit") $("walk-btn").hidden = false;
  }
  $("place-cancel").addEventListener("click", endPlace);
  renderer.domElement.addEventListener("pointermove", ev => {
    if (!placing) return;
    const pt = islandPoint(ev); placing.ghost.visible = !!pt;
    if (pt) { placing.ghost.position.set(pt.x, 0, pt.z); placing.ghost.rotation.y = baseYaw(placing.id, pt.a); }
  });
  function showDecorBar(uid) {
    const it = decorState().placed.find(x => x.uid === uid); if (!it) return;
    const d = DECOR.find(x => x.id === it.id);
    selectedUid = uid; $("decor-name").textContent = `${d.icon} ${d.name}`; $("decor-bar").hidden = false; $("walk-btn").hidden = true;
  }
  function hideDecorBar() { selectedUid = null; $("decor-bar").hidden = true; if (mode === "orbit" && !placing) $("walk-btn").hidden = false; }
  $("decor-x").addEventListener("click", hideDecorBar);
  $("decor-move").addEventListener("click", () => { const it = decorState().placed.find(x => x.uid === selectedUid); if (it) place(it.id, it.uid); });
  $("decor-rot").addEventListener("click", () => { const it = decorState().placed.find(x => x.uid === selectedUid); if (it) updatePlaced(it.uid, { rot: ((it.rot || 0) + 1) % 8 }).catch(() => showTip("돌리지 못했어요. 다시 시도해 주세요.", true)); });
  $("decor-del").addEventListener("click", () => { const it = decorState().placed.find(x => x.uid === selectedUid); if (!it) return; const d = DECOR.find(x => x.id === it.id); hideDecorBar(); removePlaced(it.uid).then(() => showTip(`${d.icon} ${eul(d.name)} 치웠어요. 상점에서 다시 놓을 수 있어요`, true), () => showTip("치우지 못했어요. 다시 시도해 주세요.", true)); });

  // ---- hidden clover and note for the walk ----
  let huntGroup = null, huntKey = "", huntItems = [];
  function syncHunt() {
    const h = hunt(), key = `${today()}|${islandR}|${!!h.clover}|${!!h.note}|${entries.length > 0}`;
    if (key === huntKey) return; huntKey = key;
    if (huntGroup) world.remove(huntGroup); huntGroup = new T.Group(); huntItems = [];
    if (!entries.length) { world.add(huntGroup); return; }
    const taken = [...plants.values()].map(p => [p.group.position.x, p.group.position.z]).concat(obstacles.concat(decorObstacles).map(o => [o.x, o.z]));
    const spot = seed => { for (let k = 0; k < 40; k++) { const a = hash(seed + k) * 6.283, d = (0.35 + hash(seed + "d" + k) * 0.5) * islandR; const x = Math.cos(a) * d, z = Math.sin(a) * d; if (taken.every(([tx, tz]) => Math.hypot(tx - x, tz - z) > 0.9)) { taken.push([x, z]); return [x, z]; } } return [0, 0]; };
    if (!h.clover) {
      const c = new T.Group(); const [x, z] = spot(today() + "clover"); c.position.set(x, 0.02, z);
      for (let i = 0; i < 4; i++) { const lf = mesh(new T.SphereGeometry(1, 12, 8), mat("#3f9a4a")); lf.scale.set(0.06, 0.012, 0.055); const a = i * Math.PI / 2 + 0.4; lf.position.set(Math.cos(a) * 0.05, 0.16, Math.sin(a) * 0.05); c.add(lf); }
      const st = mesh(new T.CylinderGeometry(0.006, 0.006, 0.16, 5), mat(LEAF)); st.position.y = 0.08; c.add(st);
      const sh = glow("#d8ffb0", 0.35, 0.35); sh.position.y = 0.17; c.add(sh);
      c.add(new T.Mesh(new T.SphereGeometry(0.4, 8, 6), hitMat));
      c.userData.hunt = "clover"; c.traverse(o => { o.userData.huntItem = c; }); huntItems.push(c); huntGroup.add(c);
    }
    if (!h.note) {
      const c = new T.Group(); const [x, z] = spot(today() + "note"); c.position.set(x, 0.05, z);
      const roll = mesh(new T.CylinderGeometry(0.035, 0.035, 0.2, 12), mat("#efe2c4")); roll.rotation.z = Math.PI / 2; c.add(roll);
      const rib = mesh(new T.TorusGeometry(0.037, 0.008, 6, 14), mat("#c4553f")); rib.rotation.y = Math.PI / 2; c.add(rib);
      const sh = glow("#fff1c4", 0.35, 0.35); sh.position.y = 0.05; c.add(sh);
      c.add(new T.Mesh(new T.SphereGeometry(0.4, 8, 6), hitMat));
      c.userData.hunt = "note"; c.traverse(o => { o.userData.huntItem = c; }); huntItems.push(c); huntGroup.add(c);
    }
    huntGroup.visible = mode === "walk"; world.add(huntGroup);
    syncHuntChip();
  }
  function syncHuntChip() {
    const h = hunt(), chip = $("hunt-chip");
    chip.hidden = !(mode === "walk" && entries.length);
    chip.textContent = `오늘의 숨은 찾기 · 🍀 ${h.clover ? "찾음" : "?"} · 📜 ${h.note ? "찾음" : "?"}`;
    if (!h.clover || !h.note) chip.title = "가까이 걸어가거나 눌러서 주워요";
  }
  function stepHunt(now) {
    if (!huntGroup) return;
    huntGroup.visible = mode === "walk";
    if (mode !== "walk") return;
    for (const c of huntItems) {
      if (c.userData.done) continue;
      if (!reduce.matches) c.rotation.y = now / 1500;
      if (Math.hypot(c.position.x - walker.x, c.position.z - walker.z) < 0.8) { c.userData.done = true; c.visible = false; foundHidden(c.userData.hunt); }
    }
  }

  // ---- shimmering petals to collect ----
  const collects = []; let nextSpawn = performance.now() + 8000;
  const hitMat = new T.MeshBasicMaterial({ visible: false });
  const COLLECT_LOOK = { spring: ["#ffb3cc", "petal"], summer: ["#fff6c8", "fluff"], autumn: ["#ffc34a", "leaf"], winter: ["#cfe9ff", "flake"] };
  function spawnCollect() {
    const [col, kind] = COLLECT_LOOK[seasonKey] || COLLECT_LOOK.spring;
    const c = new T.Group();
    const geo = kind === "flake" ? new T.OctahedronGeometry(0.1, 0) : kind === "fluff" ? new T.SphereGeometry(0.07, 12, 8) : new T.SphereGeometry(1, 14, 8);
    const body = new T.Mesh(geo, new T.MeshStandardMaterial({ color: lin(col), emissive: lin(col), emissiveIntensity: 0.6, roughness: 0.4 }));
    if (kind === "petal" || kind === "leaf") body.scale.set(kind === "leaf" ? 0.13 : 0.1, 0.02, kind === "leaf" ? 0.09 : 0.07);
    const halo = glow(col, 0.9, 0.85);
    const hit = new T.Mesh(new T.SphereGeometry(0.55, 8, 6), hitMat);
    c.add(body, halo, hit);
    const a = Math.random() * 6.283, d = Math.sqrt(Math.random()) * islandR * 0.8;
    c.position.set(Math.cos(a) * d, 5 + Math.random() * 1.5, Math.sin(a) * d);
    c.userData = { collect: true, phase: Math.random() * 6.28, halo, body, born: performance.now(), dying: 0 };
    c.traverse(o => { o.userData.collect = c; });
    collects.push(c); scene.add(c);
  }
  function stepCollects(dt, now) {
    if (now > nextSpawn) {
      nextSpawn = now + 14000 + Math.random() * 18000;
      if (collects.length < 2 && collectLeft()) spawnCollect();
    }
    for (let i = collects.length - 1; i >= 0; i--) {
      const c = collects[i], u = c.userData;
      if (u.dying) {
        const k = Math.min(1, (now - u.dying) / 450);
        u.halo.scale.setScalar(0.9 + k * 2.2); u.halo.material.opacity = 0.85 * (1 - k); u.body.visible = false;
        c.position.y += dt * 1.2;
        if (k >= 1) { scene.remove(c); collects.splice(i, 1); }
        continue;
      }
      c.position.y -= dt * 0.3;
      if (!reduce.matches) { c.position.x += Math.sin(now / 900 + u.phase) * dt * 0.35; c.position.z += Math.cos(now / 1100 + u.phase) * dt * 0.25; u.body.rotation.x += dt * 1.6; u.body.rotation.z += dt * 1.1; }
      u.halo.material.opacity = 0.55 + 0.35 * Math.sin(now / 300 + u.phase);
      if (c.position.y < 0.12) { u.halo.material.opacity *= 0.95; if (c.position.y < -0.2) { scene.remove(c); collects.splice(i, 1); } }
    }
  }

  // ---- sky creatures: a whale, a school of little fish by day, jellyfish lanterns by night ----
  const sky = new T.Group(); scene.add(sky);
  function shade(geo, top, bottom, axis = 1) {
    // vertex colours: darker back, pale belly
    const pos = geo.attributes.position, cols = [], ct = lin(top), cb = lin(bottom); let mn = Infinity, mx = -Infinity;
    for (let i = 0; i < pos.count; i++) { const v = axis === 1 ? pos.getY(i) : pos.getX(i); mn = Math.min(mn, v); mx = Math.max(mx, v); }
    for (let i = 0; i < pos.count; i++) { const v = axis === 1 ? pos.getY(i) : pos.getX(i), t0 = Math.min(1, Math.max(0, ((v - mn) / (mx - mn || 1) - 0.3) / 0.35)), k = t0 * t0 * (3 - 2 * t0); const c = cb.clone().lerp(ct, k); cols.push(c.r, c.g, c.b); }
    geo.setAttribute("color", new T.Float32BufferAttribute(cols, 3)); return geo;
  }
  // whale: a smooth lathe body lying along +z, flukes on a hinged tail
  const whale = new T.Group(), whaleBody = new T.Group(), whaleTail = new T.Group();
  {
    const prof = [[0, -1.5], [0.18, -1.38], [0.34, -1.05], [0.48, -0.55], [0.55, 0], [0.52, 0.45], [0.42, 0.85], [0.27, 1.15], [0.13, 1.35], [0.06, 1.48], [0, 1.52]].map(([r, y]) => new T.Vector2(r, y));
    const bg = new T.LatheGeometry(prof, 28); bg.rotateX(Math.PI / 2); bg.scale(1, 0.82, 1); shade(bg, "#3d6294", "#eef3f8");
    const wMat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.05 });
    const body = new T.Mesh(bg, wMat); body.castShadow = true; whaleBody.add(body);
    for (const sx of [-1, 1]) { const fin = new T.Mesh(new T.SphereGeometry(1, 16, 10), mat("#5a7aa4")); fin.scale.set(0.3, 0.035, 0.12); fin.position.set(sx * 0.58, -0.2, -0.5); fin.rotation.set(0.2, sx * 0.5, sx * -0.45); whaleBody.add(fin);
      const eye = new T.Mesh(new T.SphereGeometry(0.045, 10, 8), mat("#1c2433")); eye.position.set(sx * 0.4, -0.02, -0.95); whaleBody.add(eye); }
    for (let i = 0; i < 7; i++) { const gr = new T.Mesh(new T.TorusGeometry(0.3 - i * 0.012, 0.008, 4, 18, Math.PI * 0.5), mat("#c9d6e6")); gr.rotation.set(0, 0, Math.PI * 1.25); gr.position.set(0, -0.12 - i * 0.002, -0.95 + i * 0.1); gr.scale.set(1.4, 0.9, 1); whaleBody.add(gr); }
    whaleTail.position.set(0, 0.02, 1.42); whaleBody.add(whaleTail);
    for (const sx of [-1, 1]) { const fl = new T.Mesh(new T.SphereGeometry(1, 18, 10), mat("#3d6294")); fl.scale.set(0.42, 0.035, 0.17); fl.position.set(sx * 0.34, 0, 0.16); fl.rotation.y = sx * 0.45; whaleTail.add(fl); }
    const spots = new T.Group();
    for (let i = 0; i < 14; i++) { const sp = glow("#8fe3ff", 0.16, 0); const z = -1.1 + i * 0.17, side = i % 2 ? 1 : -1; sp.position.set(side * (0.34 - Math.abs(z) * 0.12), 0.3 - Math.abs(z) * 0.08, z); spots.add(sp); }
    whaleBody.add(spots); whaleBody.userData.spots = spots;
    const hit = new T.Mesh(new T.CylinderGeometry(0.7, 0.7, 3.4, 10), new T.MeshBasicMaterial({ visible: false })); hit.rotation.x = Math.PI / 2; whaleBody.add(hit);
    whale.add(whaleBody); whale.scale.setScalar(1.15);
    whale.traverse(o => { o.userData.whale = true; });
    sky.add(whale);
  }
  // a school of little sky fish
  const school = new T.Group(), fishes = [];
  {
    const cols = ["#f4a259", "#f6d06e", "#7cc7c2", "#f2b5c8", "#9bb6ef"];
    for (let i = 0; i < 9; i++) {
      const f = new T.Group();
      const bg = new T.SphereGeometry(0.11, 14, 10); bg.scale(0.55, 0.75, 1.3);
      const b = new T.Mesh(bg, mat(cols[i % cols.length])); f.add(b);
      const tail = new T.Mesh(new T.ConeGeometry(0.07, 0.13, 3), mat(cols[i % cols.length])); tail.rotation.x = -Math.PI / 2; tail.position.z = 0.17; tail.scale.x = 0.25; f.add(tail);
      f.userData = { off: new T.Vector3((Math.random() - 0.5) * 0.9, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.9), ph: Math.random() * 6.28, tail };
      school.add(f); fishes.push(f);
    }
    sky.add(school);
  }
  // jellyfish lanterns that drift up at night
  const jellies = [];
  {
    const jc = ["#ff9ad5", "#8fe3ff", "#c3a6ff", "#9dffcf", "#ffd28f"];
    for (let i = 0; i < 6; i++) {
      const j = new T.Group(), col = jc[i % jc.length];
      const bell = new T.Mesh(new T.SphereGeometry(0.22, 18, 10, 0, 6.29, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: lin(col), emissive: lin(col), emissiveIntensity: 0.9, transparent: true, opacity: 0.7, roughness: 0.3, side: T.DoubleSide, depthWrite: false }));
      bell.scale.y = 0.8; j.add(bell);
      for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283; const curve = new T.CatmullRomCurve3([new T.Vector3(Math.cos(a) * 0.1, 0, Math.sin(a) * 0.1), new T.Vector3(Math.cos(a) * 0.12, -0.22, Math.sin(a) * 0.12 + 0.03), new T.Vector3(Math.cos(a) * 0.08, -0.46, Math.sin(a) * 0.08 - 0.03)]); const t2 = new T.Mesh(new T.TubeGeometry(curve, 8, 0.008, 4), new T.MeshBasicMaterial({ color: lin(col), transparent: true, opacity: 0.6 })); j.add(t2); }
      j.add(glow(col, 1.1, 0.55));
      j.userData = { ph: Math.random() * 6.28, a: Math.random() * 6.28, d: 0, y: -3 - Math.random() * 3, sp: 0.18 + Math.random() * 0.12 };
      j.visible = false; jellies.push(j); sky.add(j);
    }
  }
  function stepSky(dt, now) {
    const R = islandR || 6, still = reduce.matches, night = SKIES[skyKey].night;
    // whale: a slow wide loop with a gentle rise and fall, tail beating
    const wt = now / 1000 * 0.05, wr = R * 1.25, ang = still ? 1.2 : wt;
    const wy = 4.3 + (still ? 0 : Math.sin(now / 5200) * 0.6);
    whale.position.set(Math.cos(ang) * wr, wy, Math.sin(ang) * wr);
    const tang = new T.Vector3(-Math.sin(ang), (still ? 0 : Math.cos(now / 5200) * 0.6 / 5.2 / (0.05 * wr)), Math.cos(ang));
    whale.lookAt(whale.position.clone().sub(tang)); // the head points along -z of the body
    whaleTail.rotation.x = still ? 0 : Math.sin(now / 900) * 0.35;
    whaleBody.rotation.x = still ? 0 : Math.sin(now / 900 - 0.8) * 0.05;
    whaleBody.userData.spots.children.forEach((sp, i) => { sp.material.opacity = night ? 0.5 + 0.4 * Math.sin(now / 600 + i) : 0; });
    // fish school by day
    school.visible = !night;
    if (school.visible) {
      const sa = still ? 3.6 : -now / 1000 * 0.12, sr = R * 1.32, cy = 2.2 + Math.sin(now / 3000) * 0.4;
      const cx = Math.cos(sa) * sr, cz = Math.sin(sa) * sr, dir = new T.Vector3(Math.sin(sa), 0, -Math.cos(sa));
      fishes.forEach(f => { const u = f.userData; f.position.set(cx + u.off.x + Math.sin(now / 700 + u.ph) * 0.12, cy + u.off.y + Math.sin(now / 500 + u.ph) * 0.08, cz + u.off.z); f.lookAt(f.position.clone().sub(dir)); u.tail.rotation.y = still ? 0 : Math.sin(now / 150 + u.ph) * 0.5; });
    }
    // jellyfish rise at night, then start again below
    for (const j of jellies) {
      const u = j.userData; j.visible = night;
      if (!night) continue;
      if (!u.d) u.d = R * (0.6 + Math.random() * 0.8);
      if (!still) { u.y += dt * u.sp; u.a += dt * 0.03; }
      if (u.y > 7) { u.y = -4 - Math.random() * 2; u.a = Math.random() * 6.28; u.d = R * (0.6 + Math.random() * 0.8); }
      j.position.set(Math.cos(u.a) * u.d, u.y, Math.sin(u.a) * u.d);
      j.children[0].scale.set(1 + Math.sin(now / 500 + u.ph) * 0.08, 0.8 - Math.sin(now / 500 + u.ph) * 0.08, 1 + Math.sin(now / 500 + u.ph) * 0.08);
    }
  }

  // ---- mood weather: rain, clouds, rainbow ----
  let weatherKey = "clear";
  const RAIN_N = coarse ? 220 : 360, rainData = [];
  const rain = new T.InstancedMesh(new T.BoxGeometry(0.012, 0.32, 0.012), new T.MeshBasicMaterial({ color: lin("#c9d8ea"), transparent: true, opacity: 0.55, depthWrite: false }), RAIN_N);
  rain.visible = false; scene.add(rain);
  for (let i = 0; i < RAIN_N; i++) rainData.push({ a: Math.random() * 6.283, d: Math.sqrt(Math.random()), y: Math.random() * 9 - 2, v: 5 + Math.random() * 2 });
  const rainbow = new T.Group();
  ["#ff5a5a", "#ff9f43", "#ffd84a", "#6bd36b", "#4fb3ff", "#5a6cff", "#b06bff"].forEach((c, i) => {
    const band = new T.Mesh(new T.TorusGeometry(1, 0.022, 6, 64, Math.PI), new T.MeshBasicMaterial({ color: lin(c), transparent: true, opacity: 0.5, depthWrite: false }));
    band.scale.setScalar(1 - i * 0.045); rainbow.add(band);
  });
  rainbow.visible = false; scene.add(rainbow);
  function weather(k) { if (k === weatherKey) return; weatherKey = k; applySky(); }
  function applyWeather(s) {
    const wet = weatherKey === "rain", dim = wet ? 0.55 : weatherKey === "cloudy" ? 0.25 : 0;
    if (dim) {
      const grey = s.night ? "#2a3140" : "#8792a0";
      host.style.background = `linear-gradient(color-mix(in srgb, ${s.top} ${Math.round((1 - dim) * 100)}%, ${grey}), color-mix(in srgb, ${s.bottom} ${Math.round((1 - dim) * 100)}%, ${grey}))`;
      hemi.intensity *= 1 - dim * 0.35; sun.intensity *= 1 - dim * 0.7;
      cloudMat.color.lerp(lin(s.night ? "#30384a" : "#a9b2bd"), dim); cloudMat.opacity = Math.min(1, cloudMat.opacity + dim * 0.2);
    }
    rain.visible = wet;
    if (fall) fall.visible = !wet;
    const R = islandR || 6;
    rainbow.visible = weatherKey === "rainbow" && !s.night;
    rainbow.scale.setScalar(R * 1.45); rainbow.position.set(0, -1.2, -R * 0.9);
    rainbow.children.forEach(b => { b.material.opacity = skyKey === "dusk" ? 0.32 : 0.48; });
  }
  function stepWeather(dt, now) {
    if (!rain.visible) return;
    const R = (islandR || 6) * 1.15;
    for (let i = 0; i < RAIN_N; i++) {
      const r = rainData[i];
      if (!reduce.matches) r.y -= r.v * dt;
      if (r.y < -2.5) { r.y = 7 + Math.random() * 2; r.a = Math.random() * 6.283; r.d = Math.sqrt(Math.random()); }
      tmpObj.position.set(Math.cos(r.a) * r.d * R, r.y, Math.sin(r.a) * r.d * R); tmpObj.rotation.set(0.12, 0, 0.05); tmpObj.scale.set(1, 1, 1); tmpObj.updateMatrix();
      rain.setMatrixAt(i, tmpObj.matrix);
    }
    rain.instanceMatrix.needsUpdate = true;
  }
  // ---- a photo of the garden as it looks right now ----
  function snapshot() {
    const tip = $("walk-tip"); const wasHidden = tip.hidden;
    renderer.render(scene, camera);
    return { url: renderer.domElement.toDataURL("image/png"), w: renderer.domElement.width, h: renderer.domElement.height, restore: wasHidden };
  }

  // ---- butterflies over blooming flowers, birds around bird houses ----
  const butterflies = [];
  const wingShape = new T.Shape(); wingShape.moveTo(0, 0); wingShape.bezierCurveTo(0.05, 0.1, 0.16, 0.12, 0.17, 0.03); wingShape.bezierCurveTo(0.18, -0.05, 0.1, -0.1, 0, -0.02);
  const wingGeo = new T.ShapeGeometry(wingShape, 8); wingGeo.rotateX(-Math.PI / 2);
  const BF = ["#ffd166", "#f78fb3", "#9bdeac", "#a0c4ff", "#ffb4a2", "#cdb4db", "#ffffff", "#fcbf49"];
  for (let i = 0; i < 8; i++) {
    const b = new T.Group(), m2 = mat(BF[i], { side: T.DoubleSide });
    const lw = new T.Mesh(wingGeo, m2), rw = new T.Mesh(wingGeo, m2); rw.scale.x = -1;
    const lp = new T.Group(), rp = new T.Group(); lp.add(lw); rp.add(rw);
    const body = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.12, 6), mat("#3a2f2a")); body.rotation.x = Math.PI / 2;
    b.add(lp, rp, body); b.scale.setScalar(1.7); b.userData = { lp, rp, ph: Math.random() * 6.28, target: null, until: 0 };
    b.visible = false; butterflies.push(b); sky.add(b);
  }
  const birds = [];
  function flyingBird() {
    const g = new T.Group();
    const body = new T.Mesh(new T.SphereGeometry(0.06, 12, 8), mat("#7aa6c8")); body.scale.set(0.9, 0.85, 1.4); g.add(body);
    const head = new T.Mesh(new T.SphereGeometry(0.04, 10, 8), mat("#7aa6c8")); head.position.set(0, 0.03, -0.08); g.add(head);
    const beak = new T.Mesh(new T.ConeGeometry(0.012, 0.035, 6), mat("#f2b33c")); beak.rotation.x = -Math.PI / 2; beak.position.set(0, 0.03, -0.125); g.add(beak);
    const lw = new T.Group(), rw = new T.Group();
    for (const [w2, sx] of [[lw, 1], [rw, -1]]) { const wm = new T.Mesh(new T.BoxGeometry(0.14, 0.008, 0.07), mat("#6a96b8")); wm.position.x = sx * 0.07; w2.add(wm); g.add(w2); }
    g.userData = { lw, rw, ph: Math.random() * 6.28 }; return g;
  }
  function stepCritters(dt, now) {
    const s = SKIES[skyKey], ok = !s.night && seasonKey !== "winter" && weatherKey !== "rain", still = reduce.matches;
    const flowers = [...plants.values()].filter(p => p.group.userData.glow);
    const want = ok ? Math.min(8, flowers.length) : 0;
    butterflies.forEach((b, i) => {
      const u = b.userData; b.visible = i < want;
      if (!b.visible) { u.target = null; return; }
      if (!u.target || now > u.until) {
        const f = flowers[Math.floor(Math.random() * flowers.length)];
        u.target = new T.Vector3(f.group.position.x + (Math.random() - 0.5) * 0.4, f.group.userData.top * PS + 0.15 + Math.random() * 0.4, f.group.position.z + (Math.random() - 0.5) * 0.4);
        u.until = now + 3500 + Math.random() * 4000;
        if (!u.placed) { b.position.copy(u.target).add(new T.Vector3(1, 1, 0)); u.placed = true; }
      }
      if (!still) {
        const to = u.target.clone().sub(b.position), dist = to.length();
        if (dist > 0.05) { to.normalize().multiplyScalar(Math.min(dist, dt * 0.9)); b.position.add(to); b.rotation.y = Math.atan2(-to.x, -to.z); }
        b.position.y += Math.sin(now / 180 + u.ph) * 0.004;
      }
      const flap = still ? 0.4 : Math.sin(now / 70 + u.ph) * 0.9; u.lp.rotation.z = flap; u.rp.rotation.z = -flap;
    });
    // one bird per bird house, looping around it by day
    const houses = decorGroup ? decorGroup.children.filter(c => c.userData.decor === "birdhouse") : [];
    while (birds.length < houses.length) { const nb = flyingBird(); birds.push(nb); sky.add(nb); }
    birds.forEach((bd, i) => {
      const h = houses[i]; bd.visible = !!h && !s.night && weatherKey !== "rain";
      if (!bd.visible) return;
      const u = bd.userData, a = still ? u.ph : now / 1600 + u.ph, r = 1.1;
      bd.position.set(h.position.x + Math.cos(a) * r, 1.9 + Math.sin(now / 900 + u.ph) * 0.25, h.position.z + Math.sin(a) * r);
      bd.rotation.y = -a; const flap = still ? 0.3 : Math.sin(now / 90 + u.ph) * 0.8; u.lw.rotation.z = flap; u.rw.rotation.z = -flap;
    });
  }

  // ---- the gardener: a little figure who strolls the island, checks on thirsty plants and talks when tapped ----
  const gardener = new T.Group(), gBody = new T.Group(), gArmL = new T.Group(), gArmR = new T.Group(), gLegL = new T.Group(), gLegR = new T.Group();
  const gProps = {};
  {
    const skin = mat("#f2c9a5"), apron = mat("#6f9a68"), shirt = mat("#f4efe2"), boot = mat("#6b4f3a"), straw = mat("#e3c77d"), band = mat("#c4553f");
    // legs and boots
    for (const [leg, sx] of [[gLegL, -1], [gLegR, 1]]) { leg.position.set(sx * 0.07, 0.22, 0); const l = mesh(new T.CylinderGeometry(0.045, 0.05, 0.2, 10), mat("#5b6b8a")); l.position.y = -0.09; const bt = mesh(new T.SphereGeometry(0.06, 12, 8), boot); bt.scale.set(1, 0.6, 1.4); bt.position.set(0, -0.19, 0.02); leg.add(l, bt); gBody.add(leg); }
    // body: shirt with an apron, round and soft
    const torso = mesh(new T.CylinderGeometry(0.13, 0.16, 0.3, 18), shirt); torso.position.y = 0.4; gBody.add(torso);
    const apr = mesh(new T.CylinderGeometry(0.135, 0.165, 0.26, 18, 1, true, -1.2, 2.4), apron); apr.position.y = 0.39; gBody.add(apr);
    const pocket = mesh(new T.BoxGeometry(0.08, 0.06, 0.01), mat("#5c8656")); pocket.position.set(0, 0.36, 0.158); gBody.add(pocket);
    // arms
    for (const [arm, sx] of [[gArmL, -1], [gArmR, 1]]) { arm.position.set(sx * 0.16, 0.52, 0); const a = mesh(new T.CylinderGeometry(0.035, 0.035, 0.2, 8), shirt); a.position.y = -0.1; const hd = mesh(new T.SphereGeometry(0.04, 10, 8), skin); hd.position.y = -0.21; arm.add(a, hd); arm.rotation.z = sx * 0.15; gBody.add(arm); }
    // head with rosy cheeks and a straw hat
    const head = new T.Group(); head.position.y = 0.7; gBody.add(head); gProps.head = head;
    const face = mesh(new T.SphereGeometry(0.15, 22, 16), skin); head.add(face);
    for (const sx of [-1, 1]) { const eye = mesh(new T.SphereGeometry(0.018, 8, 6), mat("#2a2420")); eye.position.set(sx * 0.055, 0.015, 0.138); head.add(eye); const ch = mesh(new T.SphereGeometry(0.028, 8, 6), mat("#f3a0a0")); ch.scale.z = 0.4; ch.position.set(sx * 0.085, -0.035, 0.125); head.add(ch); }
    const smile = mesh(new T.TorusGeometry(0.03, 0.007, 6, 12, Math.PI), mat("#8a4a3a")); smile.rotation.z = Math.PI; smile.position.set(0, -0.04, 0.142); head.add(smile);
    const brim = mesh(new T.CylinderGeometry(0.27, 0.27, 0.02, 28), straw); brim.position.y = 0.09; head.add(brim);
    const crown = mesh(new T.CylinderGeometry(0.12, 0.15, 0.12, 22), straw); crown.position.y = 0.15; head.add(crown);
    const hb = mesh(new T.CylinderGeometry(0.152, 0.152, 0.03, 22), band); hb.position.y = 0.11; head.add(hb);
    // watering can in the right hand
    const can = new T.Group(); can.position.set(0.05, -0.24, 0.06); gArmR.add(can); gProps.can = can;
    const tank = mesh(new T.CylinderGeometry(0.06, 0.065, 0.1, 14), mat("#7fb0c8", { metalness: 0.4, roughness: 0.4 })); can.add(tank);
    const spout = mesh(new T.CylinderGeometry(0.008, 0.014, 0.14, 6), mat("#7fb0c8", { metalness: 0.4, roughness: 0.4 })); spout.rotation.x = Math.PI / 2 - 0.6; spout.position.set(0, 0.02, 0.09); can.add(spout);
    const handle = mesh(new T.TorusGeometry(0.04, 0.008, 6, 14, Math.PI), mat("#7fb0c8")); handle.position.y = 0.05; handle.rotation.y = Math.PI / 2; can.add(handle);
    // extras that come and go with the weather and the hour
    const lantern = new T.Group(); lantern.position.set(0, -0.26, 0.04); gArmL.add(lantern);
    const lp = mesh(new T.SphereGeometry(0.045, 12, 10), new T.MeshStandardMaterial({ color: lin("#ffe2a8"), emissive: lin("#ffb35a"), emissiveIntensity: 1.4 })); lantern.add(lp, glow("#ffc46b", 0.9, 0.85)); gProps.lantern = lantern;
    const umbrella = new T.Group(); umbrella.position.set(0, 0.05, 0); gArmL.add(umbrella);
    const stick = mesh(new T.CylinderGeometry(0.008, 0.008, 0.62, 6), mat("#5a4a3a")); stick.position.y = 0.3; umbrella.add(stick);
    const canopy = mesh(new T.ConeGeometry(0.34, 0.14, 12, 1, true), mat("#e46a6a", { side: T.DoubleSide })); canopy.position.y = 0.62; umbrella.add(canopy); gProps.umbrella = umbrella;
    const scarf = mesh(new T.TorusGeometry(0.12, 0.035, 8, 18), mat("#d24b4b")); scarf.rotation.x = Math.PI / 2; scarf.position.y = 0.56; gBody.add(scarf); gProps.scarf = scarf;
    const thought = glow("#7db8ff", 0.5, 0); thought.position.y = 1.15; gBody.add(thought); gProps.thought = thought;
    const drop = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), new T.MeshStandardMaterial({ color: lin(0x5aa0e6), emissive: lin(0x1d5fa8), emissiveIntensity: 0.5, roughness: 0.15, transparent: true, opacity: 0.92 })); drop.position.y = 1.15; drop.scale.y = 1.3; gBody.add(drop); gProps.drop = drop;
    const hit = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 1.0, 10), new T.MeshBasicMaterial({ visible: false })); hit.position.y = 0.5; gBody.add(hit);
    gardener.add(gBody); gardener.scale.setScalar(1.25);
    gardener.traverse(o => { o.userData.gardener = true; if (o.isMesh) o.castShadow = true; });
    world.add(gardener);
  }
  const gState = { target: null, mode: "walk", until: 0, x: 1, z: 1, yaw: 0, bubbleUntil: 0, plantId: null };
  function gardenerPickTarget(now) {
    const R = islandR || 6;
    const thirsty = [...plants.entries()].filter(([id]) => { const e = entries.find(x => x.id === id); return e && needsWater(e); });
    const blooms = [...plants.values()].filter(p => p.group.userData.glow);
    let spot, kind = "stroll", plantId = null;
    if (thirsty.length && Math.random() < 0.75) { const [id, p] = thirsty[Math.floor(Math.random() * thirsty.length)]; spot = p.group.position; kind = "thirsty"; plantId = id; }
    else if (blooms.length && Math.random() < 0.6) { spot = blooms[Math.floor(Math.random() * blooms.length)].group.position; kind = "admire"; }
    if (spot) { const a = Math.random() * 6.283; gState.target = { x: spot.x + Math.cos(a) * 0.55, z: spot.z + Math.sin(a) * 0.55, fx: spot.x, fz: spot.z }; }
    else { const a = Math.random() * 6.283, d = Math.sqrt(Math.random()) * R * 0.8; gState.target = { x: Math.cos(a) * d, z: Math.sin(a) * d }; }
    const rr = Math.hypot(gState.target.x, gState.target.z), lim = R * 0.88; if (rr > lim) { gState.target.x *= lim / rr; gState.target.z *= lim / rr; }
    gState.kind = kind; gState.plantId = plantId; gState.mode = "walk";
  }
  function stepGardener(dt, now) {
    const s = SKIES[skyKey], still = reduce.matches, night = s.night, wet = weatherKey === "rain";
    gProps.lantern.visible = night && !wet; gProps.umbrella.visible = wet; gProps.scarf.visible = seasonKey === "winter";
    gProps.can.visible = !wet;
    if (!gState.target) gardenerPickTarget(now);
    const speed = (night ? 0.32 : 0.45) * (still ? 0 : 1);
    let walking = false;
    if (gState.mode === "walk") {
      const dx = gState.target.x - gState.x, dz = gState.target.z - gState.z, d = Math.hypot(dx, dz);
      if (d < 0.05 || still) { gState.mode = "stay"; gState.until = now + (gState.kind === "thirsty" ? 5000 : gState.kind === "admire" ? 3500 : 2000) + Math.random() * 2000; }
      else { const step = Math.min(d, speed * dt); gState.x += dx / d * step; gState.z += dz / d * step; gState.yaw = Math.atan2(dx, dz); walking = true; }
    } else {
      if (gState.target.fx !== undefined) gState.yaw = Math.atan2(gState.target.fx - gState.x, gState.target.fz - gState.z);
      if (now > gState.until) { gState.target = null; }
    }
    gardener.position.set(gState.x, 0, gState.z);
    let dy = gState.yaw - gardener.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); gardener.rotation.y += dy * Math.min(1, dt * 6);
    const sw = walking ? Math.sin(now / 160) : 0;
    gLegL.rotation.x = sw * 0.5; gLegR.rotation.x = -sw * 0.5;
    gArmL.rotation.x = -sw * 0.4; gArmR.rotation.x = sw * 0.4;
    gBody.position.y = walking ? Math.abs(sw) * 0.025 : 0;
    const staying = gState.mode === "stay";
    // checking a thirsty plant: lean in and show a water drop; admiring: lean and nod
    const lean = staying && gState.kind !== "stroll" ? 0.28 : 0;
    gBody.rotation.x += (lean - gBody.rotation.x) * Math.min(1, dt * 4);
    gProps.head.rotation.x = staying && gState.kind === "admire" && !still ? Math.sin(now / 500) * 0.12 : 0;
    const showDrop = staying && gState.kind === "thirsty";
    gProps.drop.visible = showDrop; gProps.thought.material.opacity = showDrop ? 0.5 : 0;
    if (showDrop) gProps.drop.position.y = 1.15 + (still ? 0 : Math.sin(now / 300) * 0.04);
    // keep the speech bubble over their head
    const bub = $("g-bubble");
    if (!bub.hidden) {
      if (now > gState.bubbleUntil || mode !== "orbit" && mode !== "walk") { bub.style.opacity = 0; if (now > gState.bubbleUntil + 400) bub.hidden = true; }
      const v = gardener.position.clone(); v.y += 1.25 * gardener.scale.y; v.project(camera);
      const r = renderer.domElement.getBoundingClientRect(), hr = host.getBoundingClientRect();
      bub.style.left = `${clamp((v.x + 1) / 2 * r.width + (r.left - hr.left), 130, hr.width - 130)}px`; bub.style.top = `${Math.max(60, (1 - v.y) / 2 * r.height + (r.top - hr.top))}px`;
      bub.style.visibility = v.z < 1 ? "visible" : "hidden";
    }
  }
  function gardenerTalk() {
    const bub = $("g-bubble"); bub.textContent = "";
    const b = document.createElement("b"); b.textContent = "정원지기 "; bub.append(b, document.createTextNode(gardenerLine()));
    bub.hidden = false; bub.style.opacity = 1; gState.bubbleUntil = performance.now() + 6000;
    gState.mode = "stay"; gState.until = performance.now() + 4000;
    const dx = camera.position.x - gState.x, dz = camera.position.z - gState.z; gState.yaw = Math.atan2(dx, dz); gState.target = gState.target || { x: gState.x, z: gState.z }; delete gState.target.fx;
    Music.sfx("collect");
  }

  // ---- water drops & fireflies ----
  const dropMat = new T.MeshStandardMaterial({ color: lin(0x5aa0e6), emissive: lin(0x1d5fa8), emissiveIntensity: 0.5, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.92 });
  function makeDrop() {
    const d = new T.Group();
    const b = new T.Mesh(new T.SphereGeometry(0.09, 10, 8), dropMat);
    const t = new T.Mesh(new T.ConeGeometry(0.088, 0.16, 10), dropMat); t.position.y = 0.11;
    d.add(b, t, glow("#7db8ff", 0.55, 0.5)); return d;
  }
  const flyMat = new T.MeshBasicMaterial({ color: 0xffeb8a, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false });
  const flies = new T.Group(); scene.add(flies);
  function buildFlies(R) {
    while (flies.children.length) flies.remove(flies.children[0]);
    const r = rnd("flies");
    for (let i = 0; i < 26; i++) {
      const f = new T.Mesh(new T.SphereGeometry(0.035, 6, 4), flyMat);
      f.userData = { a: r() * 6.28, d: Math.sqrt(r()) * R, y: 0.5 + r() * 2.6, p: r() * 6.28 };
      f.add(glow("#ffe27a", 0.5, 0.85)); flies.add(f);
    }
  }

  // ---- sky / time of day ----
  let skyKey = skyForNow(), skyManual = false;
  function applySky() {
    const s = SKIES[skyKey];
    host.style.background = `linear-gradient(${s.top}, ${s.bottom})`;
    hemi.color.copy(lin(s.hs)); hemi.groundColor.copy(lin(s.hg)); hemi.intensity = s.hi * 1.15;
    sun.color.copy(lin(s.sun)); sun.intensity = s.sunI * 1.25;
    rim.color.copy(lin(s.top)); rim.intensity = s.night ? 0.25 : 0.4;
    cloudMat.color.copy(lin(s.night ? "#3b4252" : skyKey === "dusk" ? "#f6dcdc" : skyKey === "dawn" ? "#fff0ea" : "#ffffff")); cloudMat.opacity = s.night ? 0.55 : 0.9;
    renderer.toneMappingExposure = s.night ? 1.25 : 1.12;
    if (lanternGlow) lanternGlow.material.opacity = s.night ? 0.95 : skyKey === "dusk" ? 0.4 : 0;
    for (const dg of decorGlows) { dg.sprite.material.opacity = s.night ? 0.9 : skyKey === "dusk" ? 0.35 : dg.always ? 0.2 : 0; dg.mat.emissiveIntensity = s.night ? 1.6 : skyKey === "dusk" ? 0.6 : dg.always ? 0.5 : 0; }
    for (const p of plants.values()) if (p.group.userData.glow) { const star = p.group.userData.fam === "starflower"; p.group.userData.glow.material.opacity = s.night ? (star ? 0.95 : 0.5) : skyKey === "dusk" ? (star ? 0.45 : 0.15) : (star ? 0.15 : 0); if (star) p.group.userData.glow.scale.setScalar(s.night ? 1.8 : 1.1); }
    flies.visible = s.night;
    lanternMat.emissiveIntensity = s.night ? 1.4 : skyKey === "dusk" ? 0.6 : 0;
    lanternLight.intensity = s.night ? 1.6 : skyKey === "dusk" ? 0.5 : 0;
    setIcon($("time-btn"), skyKey, s.label.replace(/^\S+\s/, ""));
    if (scene.fog) scene.fog.color.copy(lin(s.bottom));
    applyWeather(s);
  }
  $("time-btn").addEventListener("click", () => { skyManual = true; skyKey = SKY_ORDER[(SKY_ORDER.indexOf(skyKey) + 1) % 4]; applySky(); showTip(SKIES[skyKey].label, true); });
  setInterval(() => { if (!skyManual && skyForNow() !== skyKey) { skyKey = skyForNow(); applySky(); } }, 60000);

  // ---- seasons ----
  let seasonKey = seasonForNow(), seasonManual = false, fall = null;
  const fallData = [];
  const dummy = new T.Object3D();
  function buildFall() {
    if (fall) { scene.remove(fall); fall.geometry.dispose(); fall.material.dispose(); fall = null; }
    const kind = SEASONS[seasonKey].fall, R = islandR || 6, n = Math.round(clamp(R * 16, 70, 180));
    const geo = kind === "snow" ? new T.SphereGeometry(0.035, 5, 4) : kind === "fluff" ? new T.SphereGeometry(0.03, 5, 4) : new T.PlaneGeometry(kind === "leaf" ? 0.16 : 0.11, kind === "leaf" ? 0.12 : 0.08);
    const m = new T.MeshStandardMaterial({ color: 0xffffff, side: T.DoubleSide, roughness: 0.8, transparent: kind === "fluff", opacity: kind === "fluff" ? 0.85 : 1, emissive: kind === "snow" || kind === "fluff" ? 0x445566 : 0x000000 });
    fall = new T.InstancedMesh(geo, m, n);
    const rr = rnd("fall" + seasonKey); fallData.length = 0;
    const cols = kind === "leaf" ? SEASONS.autumn.canopy : kind === "petal" ? ["#f9c9d8", "#f5b3c8", "#ffe1ea"] : ["#ffffff"];
    for (let i = 0; i < n; i++) {
      const a = rr() * 6.283, d = Math.sqrt(rr()) * (R + 1);
      fallData.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, y: rr() * 7, p: rr() * 6.28, sp: 0.6 + rr() * 0.8, rx: rr() * 6, ry: rr() * 6 });
      fall.setColorAt(i, lin(cols[i % cols.length]));
    }
    fall.instanceColor.needsUpdate = true;
    fall.userData.kind = kind;
    scene.add(fall); stepFall(0, 0); if (weatherKey === "rain") fall.visible = false;
  }
  function stepFall(dt, now) {
    if (!fall) return;
    const kind = fall.userData.kind, R = (islandR || 6) + 1, still = reduce.matches;
    const vy = kind === "snow" ? -0.55 : kind === "leaf" ? -0.42 : kind === "petal" ? -0.3 : 0.1;
    for (let i = 0; i < fallData.length; i++) {
      const f = fallData[i];
      if (!still) {
        f.y += vy * f.sp * dt;
        const sway = kind === "snow" ? 0.15 : kind === "fluff" ? 0.12 : 0.45;
        f.x += Math.sin(now / 1100 + f.p) * sway * dt; f.z += Math.cos(now / 1300 + f.p) * sway * dt;
        f.rx += dt * 2.2 * f.sp; f.ry += dt * 1.6;
        if (kind === "fluff" ? f.y > 6 : f.y < -0.05) { const a = f.p * 7 + now / 997, d = Math.sqrt((Math.sin(now + i) + 1) / 2) * R; f.x = Math.cos(a) * d; f.z = Math.sin(a) * d; f.y = kind === "fluff" ? 0.1 : 6.5 + Math.random(); }
      }
      dummy.position.set(f.x, f.y, f.z); dummy.rotation.set(f.rx, f.ry, f.rx * 0.5); dummy.updateMatrix();
      fall.setMatrixAt(i, dummy.matrix);
    }
    fall.instanceMatrix.needsUpdate = true;
  }
  function applySeason() {
    const se = SEASONS[seasonKey];
    grassTopMat.color.copy(lin(se.grass));
    bladeMat.color.copy(lin(se.tuft));
    for (const c of canopies) { c.visible = !!se.canopy; if (se.canopy) c.material = mat(se.canopy[c.userData.canopy % se.canopy.length], { flatShading: true }); }
    for (const c of snowCaps) c.visible = !se.canopy;
    setIcon($("season-btn"), seasonKey, se.label.replace(/^\S+\s/, "") + " 정원");
    buildFall();
  }
  $("season-btn").addEventListener("click", () => { seasonManual = true; seasonKey = SEASON_ORDER[(SEASON_ORDER.indexOf(seasonKey) + 1) % 4]; applySeason(); showTip(SEASONS[seasonKey].label + " 정원", true); });
  setInterval(() => { if (!seasonManual && seasonForNow() !== seasonKey) { seasonKey = seasonForNow(); applySeason(); } }, 60000);

  // ---- sync plants with entries ----
  const PS = 1.5;
  const plants = new Map(); // id -> {group, key, drop, phase, grow}
  let firstSync = true;
  function update(list) {
    const sorted = [...list].sort((a, b) => (a.date + String(a.createdAt || 0).padStart(15, "0")).localeCompare(b.date + String(b.createdAt || 0).padStart(15, "0")));
    const spacing = 1.7;
    const R = Math.max(4.5, Math.ceil(spacing * Math.sqrt(sorted.length + 1) + 1.8));
    if (R !== islandR) { buildIsland(R); buildFlies(R); applySeason(); }
    syncBirthIslet();
    syncDecor();
    syncHunt();
    const seen = new Set();
    sorted.forEach((e, i) => {
      seen.add(e.id);
      const key = JSON.stringify([stageOf(e), e.emotions]);
      let p = plants.get(e.id);
      if (!p || p.key !== key) {
        const grown = p && p.key !== key;
        if (p) world.remove(p.group);
        const group = buildPlant(e);
        p = { group, key, phase: hash(e.id) * 6.28, drop: p ? p.drop : null, grow: grown || (!firstSync && !p) ? performance.now() : 0 };
        group.scale.setScalar(PS); plants.set(e.id, p); world.add(group);
      }
      // phyllotaxis: oldest at the centre, newest toward the rim
      const ang = i * 2.39996 + 0.3, rad = spacing * Math.sqrt(i + 0.6);
      p.group.position.set(Math.cos(ang) * rad, 0, Math.sin(ang) * rad);
      p.group.rotation.y = hash(e.id + "r") * 6.28;
      const thirsty = needsWater(e);
      if (thirsty && !p.drop) { p.drop = makeDrop(); p.drop.traverse(o => { o.userData.entryId = e.id; }); world.add(p.drop); }
      if (!thirsty && p.drop) { world.remove(p.drop); p.drop = null; }
    });
    for (const [id, p] of plants) if (!seen.has(id)) { world.remove(p.group); if (p.drop) world.remove(p.drop); plants.delete(id); }
    firstSync = false;
    syncFullWater();
    mailUnread = list.filter(e => e.letter && !e.letter.read && !e.example).length;
    if (mailFlag) mailFlag.rotation.z = mailUnread ? 0 : -Math.PI / 2;
    if (mailEnvelope) mailEnvelope.visible = mailUnread > 0;
    applySky();
  }

  // ---- picking ----
  const ray = new T.Raycaster(), ndc = new T.Vector2();
  let down = null;
  renderer.domElement.addEventListener("pointerdown", ev => { down = { x: ev.clientX, y: ev.clientY, t: performance.now() }; });
  renderer.domElement.addEventListener("pointerup", ev => {
    if (!down) return;
    const moved = Math.hypot(ev.clientX - down.x, ev.clientY - down.y), dt = performance.now() - down.t; down = null;
    if (moved > 8 || dt > 600) return;
    if (placing) {
      const pt = islandPoint(ev);
      if (!pt) { showTip("섬 위를 눌러 주세요", true); return; }
      const { id, uid } = placing, d = DECOR.find(x => x.id === id);
      endPlace();
      (uid ? updatePlaced(uid, { a: pt.a, f: pt.f }) : addPlaced(id, pt)).then(() => { Music.sfx("plant"); showTip(`${d.icon} ${eul(d.name)} ${uid ? "옮겼어요" : "놓았어요"}`, true); }, () => showTip("놓지 못했어요. 다시 시도해 주세요.", true));
      return;
    }
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const targets = mode === "orbit" ? [...pathStones] : []; if (mailbox) targets.push(mailbox); if (birthIslet) targets.push(birthIslet); targets.push(whale); if (decorGroup) targets.push(decorGroup); targets.push(gardener); collects.forEach(c => { if (!c.userData.dying) targets.unshift(c); }); if (mode === "walk") huntItems.forEach(c => { if (!c.userData.done) targets.unshift(c); }); for (const p of plants.values()) { targets.push(p.group); if (p.drop) targets.push(p.drop); }
    const hit = ray.intersectObjects(targets, true)[0];
    if (hit && hit.object.userData.path) { enterWalk(); return; }
    if (hit && hit.object.userData.huntItem) {
      const c = hit.object.userData.huntItem;
      if (c.userData.done) return;
      if (Math.hypot(c.position.x - walker.x, c.position.z - walker.z) > 4.5) { showTip(c.userData.hunt === "clover" ? "🍀 저기 뭔가 있어요! 조금 더 가까이 가 보세요" : "📜 저기 뭔가 있어요! 조금 더 가까이 가 보세요", true); return; }
      c.userData.done = true; c.visible = false; foundHidden(c.userData.hunt); return;
    }
    if (hit && hit.object.userData.collect && hit.object.userData.collect.userData) { const c = hit.object.userData.collect; if (!c.userData.dying && collectPetal()) c.userData.dying = performance.now(); return; }
    if (hit && hit.object.userData.decor) {
      const d = DECOR.find(x => x.id === hit.object.userData.decor);
      if (d.id === "chime") { Music.sfx("chime"); chimeKick = performance.now(); }
      if (mode === "orbit" && hit.object.userData.decorUid) showDecorBar(hit.object.userData.decorUid); else showTip(`${d.icon} ${d.name}`, true);
      return;
    }
    if (mode === "orbit" && selectedUid) hideDecorBar();
    if (hit && hit.object.userData.gardener) { gardenerTalk(); return; }
    if (hit && hit.object.userData.whale) { whaleHello(); return; }
    if (hit && hit.object.userData.birthday) { openBirthdayCard(); return; }
    if (hit && hit.object.userData.mailbox) { if (!openMailbox()) showTip("아직 편지가 없어요. 꽃을 피우면 정원지기가 편지를 보내요"); return; }
    const id = hit && hit.object.userData.entryId;
    const e = id && shown().find(x => x.id === id);
    if (e) openSheet(e);
  });


  // ---- walk mode ----
  let mode = "orbit", trans = null, orbitSaved = null;
  const walker = { x: 0, z: 0, yaw: 0, pitch: -0.03, dist: 0 };
  // eye height while walking: low (between the grass), normal (flower height), high (looking over the garden)
  const EYES = [{ h: 0.55, label: "낮게", pitch: -0.03 }, { h: 1.3, label: "보통", pitch: -0.14 }, { h: 2.4, label: "높게", pitch: -0.32 }];
  let eyeIdx = 1; try { const v = parseInt(localStorage.getItem("emotion-garden-eye"), 10); if (v >= 0 && v <= 2) eyeIdx = v; } catch (e) {}
  let eyeH = EYES[eyeIdx].h;
  const SPEED = 1.25, keys = new Set(), joyVec = { x: 0, y: 0 };
  function syncEyeBtn() { $("eye-btn").textContent = `👀 ${EYES[eyeIdx].label}`; $("eye-btn").setAttribute("aria-label", `눈높이 ${EYES[eyeIdx].label}, 눌러서 바꾸기`); }
  syncEyeBtn();
  $("eye-btn").addEventListener("click", () => {
    eyeIdx = (eyeIdx + 1) % EYES.length; syncEyeBtn();
    try { localStorage.setItem("emotion-garden-eye", String(eyeIdx)); } catch (e) {}
    walker.pitch = EYES[eyeIdx].pitch;
    showTip(`👀 눈높이 ${EYES[eyeIdx].label}`, true);
  });
  const eyeQuat = (yaw, pitch) => new T.Quaternion().setFromEuler(new T.Euler(pitch, yaw, 0, "YXZ"));
  function startTransition(toPos, toQuat, toFov, done) {
    trans = { t0: performance.now(), dur: reduce.matches ? 1 : 1500, fromPos: camera.position.clone(), fromQuat: camera.quaternion.clone(), fromFov: camera.fov, toPos, toQuat, toFov, done };
    mode = "transition";
  }
  function stepTransition(now) {
    if (!trans) return;
    const x = Math.min(1, (now - trans.t0) / trans.dur), e = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    camera.position.lerpVectors(trans.fromPos, trans.toPos, e);
    camera.quaternion.copy(trans.fromQuat).slerp(trans.toQuat, e);
    camera.fov = trans.fromFov + (trans.toFov - trans.fromFov) * e; camera.updateProjectionMatrix();
    if (x >= 1) { const d = trans.done; trans = null; d(); }
  }
  function enterWalk() {
    if (mode !== "orbit") return;
    endPlace(); hideDecorBar();
    orbitSaved = { pos: camera.position.clone(), quat: camera.quaternion.clone(), fov: camera.fov };
    controls.enabled = false; controls.autoRotate = false;
    const a = -0.6 + 0.32, rad = islandR * 0.88; // just beside the stepping stones
    walker.x = Math.cos(a) * rad; walker.z = Math.sin(a) * rad; walker.yaw = Math.atan2(walker.x, walker.z); walker.pitch = EYES[eyeIdx].pitch; eyeH = EYES[eyeIdx].h;
    host.classList.add("walking"); resize();
    $("walk-btn").hidden = true;
    scene.fog = new T.Fog(new T.Color(SKIES[skyKey].bottom), 5, islandR * 3 + 6);
    startTransition(new T.Vector3(walker.x, eyeH, walker.z), eyeQuat(walker.yaw, walker.pitch), 62, () => {
      mode = "walk"; $("exit-walk").hidden = false; $("joy").hidden = false; $("eye-btn").hidden = false; syncHuntChip(); syncFullWater();
      showTip(matchMedia("(pointer: coarse)").matches ? "왼쪽 아래 동그라미로 걷고, 화면을 끌어서 둘러봐요" : "WASD나 방향키로 걷고, 마우스로 끌어서 둘러봐요");
    });
  }
  function exitWalk() {
    if (mode !== "walk") return;
    $("exit-walk").hidden = true; $("joy").hidden = true; $("eye-btn").hidden = true; $("hunt-chip").hidden = true; $("near").hidden = true; nearId = null; keys.clear(); joyVec.x = joyVec.y = 0;
    startTransition(orbitSaved.pos, orbitSaved.quat, orbitSaved.fov, () => {
      mode = "orbit"; scene.fog = null; host.classList.remove("walking"); resize();
      controls.enabled = true; controls.update(); $("walk-btn").hidden = false; syncFullWater();
    });
  }
  $("walk-btn").addEventListener("click", enterWalk);
  // full-screen garden: CSS fills the view everywhere; the Fullscreen API is a bonus where the browser allows it
  let full = false, nativeFull = false;
  function setFull(v) {
    if (v === full) return;
    full = v; host.classList.toggle("full", v);
    document.documentElement.style.overflow = v ? "hidden" : "";
    setIcon($("full-btn"), v ? "collapse" : "expand", v ? "작게 보기" : "화면 가득 보기"); $("full-btn").setAttribute("aria-pressed", String(v));
    syncFullWater();
    if (v && host.requestFullscreen) host.requestFullscreen({ navigationUI: "hide" }).then(() => { nativeFull = true; }, () => {});
    if (!v && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    if (!v) nativeFull = false;
    resize();
  }
  setIcon($("full-btn"), "expand", "화면 가득 보기");
  setIcon($("photo-chip"), "camera", "정원 사진 찍기");
  $("full-btn").addEventListener("click", () => setFull(!full));
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && nativeFull) { nativeFull = false; setFull(false); } });
  addEventListener("keydown", ev => { if (ev.code === "Escape" && full && mode === "orbit" && !document.querySelector("dialog[open]")) setFull(false); });
  function syncFullWater() {
    const n = entries.filter(needsWater).length, b = $("full-water");
    b.hidden = !(full && mode === "orbit" && n > 0);
    b.textContent = `💧 물 주기 · ${n}그루`;
  }
  $("full-water").addEventListener("click", () => $("water-all").click());
  $("exit-walk").addEventListener("click", exitWalk);
  let tipTimer;
  function showTip(t, short) { const el = $("walk-tip"); el.classList.toggle("center", !!short); el.textContent = t; el.hidden = false; el.style.opacity = 1; clearTimeout(tipTimer); tipTimer = setTimeout(() => { el.style.opacity = 0; setTimeout(() => { el.hidden = true; }, 600); }, 4200); }

  // look around by dragging the view
  let look = null;
  renderer.domElement.addEventListener("pointerdown", ev => { if (mode === "walk") { look = { id: ev.pointerId, x: ev.clientX, y: ev.clientY }; } });
  renderer.domElement.addEventListener("pointermove", ev => {
    if (!look || ev.pointerId !== look.id || mode !== "walk") return;
    walker.yaw -= (ev.clientX - look.x) * 0.006; walker.pitch = clamp(walker.pitch - (ev.clientY - look.y) * 0.004, -0.7, 0.9);
    look.x = ev.clientX; look.y = ev.clientY;
  });
  const endLook = ev => { if (look && ev.pointerId === look.id) look = null; };
  renderer.domElement.addEventListener("pointerup", endLook); renderer.domElement.addEventListener("pointercancel", endLook);

  // joystick
  const joy = $("joy"), knob = $("knob");
  let joyId = null;
  function joyMove(ev) {
    const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, max = r.width / 2 - 12;
    let dx = ev.clientX - cx, dy = ev.clientY - cy; const len = Math.hypot(dx, dy);
    if (len > max) { dx *= max / len; dy *= max / len; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`; joyVec.x = dx / max; joyVec.y = -dy / max;
  }
  joy.addEventListener("pointerdown", ev => { joyId = ev.pointerId; joy.setPointerCapture(ev.pointerId); joyMove(ev); ev.preventDefault(); });
  joy.addEventListener("pointermove", ev => { if (ev.pointerId === joyId) joyMove(ev); });
  const joyEnd = ev => { if (ev.pointerId !== joyId) return; joyId = null; joyVec.x = joyVec.y = 0; knob.style.transform = ""; };
  joy.addEventListener("pointerup", joyEnd); joy.addEventListener("pointercancel", joyEnd);

  // keyboard
  const KEYMAP = { KeyW: "f", ArrowUp: "f", KeyS: "b", ArrowDown: "b", KeyA: "l", ArrowLeft: "l", KeyD: "r", ArrowRight: "r" };
  addEventListener("keydown", ev => {
    if (mode !== "walk" || (ev.target.closest && ev.target.closest("textarea, input, dialog"))) return;
    if (ev.code === "Escape") { exitWalk(); return; }
    const k = KEYMAP[ev.code]; if (k) { keys.add(k); ev.preventDefault(); }
  });
  addEventListener("keyup", ev => { const k = KEYMAP[ev.code]; if (k) keys.delete(k); });
  addEventListener("blur", () => keys.clear());

  // nearby plant card
  let nearId = null, nearKey = "";
  function updateNear() {
    let best = null, bd = 1e9;
    const fx = -Math.sin(walker.yaw), fz = -Math.cos(walker.yaw);
    for (const [id, p] of plants) {
      const dx = p.group.position.x - walker.x, dz = p.group.position.z - walker.z, d = Math.hypot(dx, dz);
      if (d > 1.6) continue;
      const facing = d < 0.6 ? 1 : (dx * fx + dz * fz) / d; // prefer plants in front of you
      if (facing < 0.35) continue;
      const score = d - facing * 0.5;
      if (score < bd) { bd = score; best = id; }
    }
    const e = best && shown().find(x => x.id === best);
    const key = e ? e.id + stageOf(e) + needsWater(e) : "";
    if (key === nearKey) return;
    nearKey = key; nearId = e ? e.id : null;
    $("near").hidden = !e; if (!e) return;
    const st = stageOf(e), [, m, d] = e.date.split("-");
    $("near-name").textContent = `${plantName(e.emotions[0].n)} · ${STAGES[st]}`;
    $("near-date").textContent = `${+m}월 ${+d}일 · ${e.title}`;
    $("near-water").hidden = !needsWater(e);
  }
  $("near-open").addEventListener("click", () => { const e = nearId && shown().find(x => x.id === nearId); if (e) openSheet(e); });
  $("near-water").addEventListener("click", async () => {
    const e = nearId && entries.find(x => x.id === nearId); if (!e || !needsWater(e)) return;
    try { const st = await water(e); showTip(st === 3 ? `${iga(plantName(e.emotions[0].n))} 피었어요 🌸` : `${STAGES[st]}로 자랐어요`); }
    catch (err) { showTip("물을 주지 못했어요. 다시 시도해 주세요."); }
  });

  function stepWalk(dt, now) {
    let fx = joyVec.y, sx = joyVec.x;
    if (keys.has("f")) fx += 1; if (keys.has("b")) fx -= 1; if (keys.has("r")) sx += 1; if (keys.has("l")) sx -= 1;
    const mag = Math.min(1, Math.hypot(fx, sx));
    if (mag > 0.05) {
      const n = Math.hypot(fx, sx) || 1, f = fx / n * mag, s2 = sx / n * mag;
      const sy = Math.sin(walker.yaw), cy = Math.cos(walker.yaw);
      const step = SPEED * dt;
      walker.x += (-sy * f + cy * s2) * step; walker.z += (-cy * f - sy * s2) * step;
      walker.dist += step * mag;
      for (const p of plants.values()) {
        const dx = walker.x - p.group.position.x, dz = walker.z - p.group.position.z, d = Math.hypot(dx, dz), min = 0.42;
        if (d < min && d > 1e-4) { walker.x = p.group.position.x + dx / d * min; walker.z = p.group.position.z + dz / d * min; }
      }
      for (const o of obstacles.concat(decorObstacles)) {
        const dx = walker.x - o.x, dz = walker.z - o.z, d = Math.hypot(dx, dz);
        if (d < o.r && d > 1e-4) { walker.x = o.x + dx / d * o.r; walker.z = o.z + dz / d * o.r; }
      }
      const rr = Math.hypot(walker.x, walker.z), lim = islandR * 0.93;
      if (rr > lim) { walker.x *= lim / rr; walker.z *= lim / rr; }
    }
    const bob = reduce.matches ? 0 : Math.sin(walker.dist * 9) * 0.022;
    eyeH += (EYES[eyeIdx].h - eyeH) * Math.min(1, dt * 4); // glide smoothly to a new eye height
    camera.position.set(walker.x, eyeH + bob * (eyeH / 0.55) * 0.6, walker.z);
    camera.quaternion.copy(eyeQuat(walker.yaw, walker.pitch));
    updateNear();
  }
  // ---- loop ----
  function resize() {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    if (islandR && mode === "orbit") fitCamera();
  }
  new ResizeObserver(resize).observe(host); resize();
  let visible = true;
  // render only while the garden is on screen; checked directly each frame (an observer can miss a change)
  const onScreen = () => { if (host.classList.contains("full")) return true; const r = host.getBoundingClientRect(); return r.bottom > -80 && r.top < (window.innerHeight || 800) + 80 && r.width > 0; };
  const easeOutBack = x => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
  let lastNow = 0, perf = { frames: 0, time: 0 }, chimeKick = 0;
  function lowerQuality() {
    renderer.setPixelRatio(1); resize();
    sun.shadow.mapSize.set(512, 512); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  }
  function tick(now) {
    requestAnimationFrame(tick);
    visible = onScreen();
    if (!visible || document.hidden) { lastNow = 0; return; }
    const still = reduce.matches;
    for (const p of plants.values()) {
      const g = p.group;
      if (!still) { g.rotation.z = Math.sin(now / 1400 + p.phase) * 0.04; g.rotation.x = Math.cos(now / 1700 + p.phase) * 0.03; }
      if (g.userData.twinkle && !still) g.userData.twinkle.children.forEach((sp, i) => { const a = sp.userData.a + now / 1200; sp.position.set(Math.cos(a) * 0.22, Math.sin(now / 400 + i) * 0.08, Math.sin(a) * 0.22); sp.material.opacity = 0.4 + 0.6 * Math.abs(Math.sin(now / 350 + i)); });
      if (p.grow) { const x = Math.min(1, (now - p.grow) / 900); g.scale.setScalar(PS * Math.max(0.05, easeOutBack(x))); if (x >= 1) { p.grow = 0; g.scale.setScalar(PS); } }
      if (p.drop) { p.drop.position.set(g.position.x, g.userData.top * g.scale.y + 0.35 + (still ? 0 : Math.sin(now / 450 + p.phase) * 0.08), g.position.z); p.drop.rotation.y = now / 900; }
    }
    if (flies.visible) for (const f of flies.children) {
      const u = f.userData, a = u.a + (still ? 0 : now / 9000);
      f.position.set(Math.cos(a) * u.d + Math.sin(now / 1300 + u.p) * 0.3, u.y + (still ? 0 : Math.sin(now / 900 + u.p) * 0.25), Math.sin(a) * u.d);
      f.material.opacity = still ? 0.8 : 0.35 + 0.65 * Math.max(0, Math.sin(now / 700 + u.p * 3));
    }
    const dt = Math.min(0.05, (now - (lastNow || now)) / 1000); lastNow = now;
    stepFall(dt, now);
    stepCollects(dt, now);
    stepHunt(now);
    stepSky(dt, now);
    stepWeather(dt, now);
    stepCritters(dt, now);
    stepGardener(dt, now);
    if (!reduce.matches) for (const pw of pinwheels) pw.rotation.z -= dt * 2.4;
    if (chimeStrips.length) { const kick = chimeKick ? Math.max(0, 1 - (now - chimeKick) / 2500) : 0; chimeStrips.forEach((cs, i) => { cs.rotation.z = (reduce.matches ? 0 : Math.sin(now / 700 + i) * 0.12) + Math.sin(now / 120) * 0.35 * kick; }); }
    if (!reduce.matches) {
      for (const f of floaters) { f.position.y = f.userData.baseY + Math.sin(now / 2200 + f.userData.phase) * 0.18; f.rotation.y += dt * 0.06; }
      if (birthIslet) { birthIslet.position.y = birthIslet.userData.baseY + Math.sin(now / 2600) * 0.15; }
      if (sparkles && sparkles.visible) sparkles.children.forEach((sp, i) => { if (sp.userData.r) { const a = sp.userData.a + now / 1800; sp.position.set(Math.cos(a) * sp.userData.r, Math.sin(now / 700 + i) * 0.25, Math.sin(a) * sp.userData.r); sp.material.opacity = 0.4 + 0.6 * Math.abs(Math.sin(now / 500 + i)); } });
      if (cloudRing) cloudRing.rotation.y += dt * 0.012;
    }
    if (perf && dt > 0) { perf.frames++; perf.time += dt; if (perf.time > 4) { if (perf.frames / perf.time < 32) lowerQuality(); perf = null; } }
    if (mailEnvelope && mailEnvelope.visible) { mailEnvelope.position.y = 1.35 + (reduce.matches ? 0 : Math.sin(now / 600) * 0.06); mailEnvelope.rotation.y = reduce.matches ? 0 : now / 1400; }
    if (mode === "orbit") controls.update(); else if (mode === "walk") stepWalk(dt, now); else stepTransition(now);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
  $("garden-hint").textContent = "드래그해서 정원을 돌려 보고, 두 손가락이나 휠로 확대해요. 식물을 누르면 그날의 일기가 열려요. 오래된 식물일수록 섬 가운데에 있어요.";
  return { update, tip: showTip, place, weather, snapshot, env: () => ({ sky: skyKey, season: seasonKey, weather: weatherKey }) };
}
let g3d = null;
try { g3d = initGarden3D(); } catch (e) { g3d = null; $("garden3d").hidden = true; cv.hidden = false; }
