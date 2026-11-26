// 감정정원 · 3D 미니어처 섬: 섬, 하늘과 날씨, 하늘 친구들, 정원지기, 계절, 식물 심기, 누르기, 산책 모드
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
  let lite = false; try { lite = localStorage.getItem("emotion-garden-lite") === "1"; } catch (e) {}
  if (lite) renderer.setPixelRatio(1);
  const K = make3DKit(T, renderer);
  const { lin, coarse, mat, mesh, BARK, LEAF, SOIL, SOIL_DARK, GRASS, STONE, grassTex, grassTopMat, soilSideMat, bladeMat, tmpObj, glow, rnd, stemTube, leafMesh, addLeaf, petalRing, bladeLeaf } = K;

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
  scene.add(sun); if (lite) sun.castShadow = false;


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
      blades.instanceColor.needsUpdate = true; island.add(blades); island.userData.blades = blades; blades.visible = !lite;
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
    island.add(cloudRing); cloudRing.visible = !lite;
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

  function buildPlant(e) { return buildPlant3D(K, e); }

  function buildBirthFlower(m) { return buildBirthFlower3D(K, m); }
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
  function buildDecor(id) { return buildDecor3D(K, id, { decorGlows, chimeStrips, pinwheels }); }
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
    school.visible = !night && !lite;
    if (school.visible) {
      const sa = still ? 3.6 : -now / 1000 * 0.12, sr = R * 1.32, cy = 2.2 + Math.sin(now / 3000) * 0.4;
      const cx = Math.cos(sa) * sr, cz = Math.sin(sa) * sr, dir = new T.Vector3(Math.sin(sa), 0, -Math.cos(sa));
      fishes.forEach(f => { const u = f.userData; f.position.set(cx + u.off.x + Math.sin(now / 700 + u.ph) * 0.12, cy + u.off.y + Math.sin(now / 500 + u.ph) * 0.08, cz + u.off.z); f.lookAt(f.position.clone().sub(dir)); u.tail.rotation.y = still ? 0 : Math.sin(now / 150 + u.ph) * 0.5; });
    }
    // jellyfish rise at night, then start again below
    for (const j of jellies) {
      const u = j.userData; j.visible = night && !lite;
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
    if (fall) fall.visible = !wet && !lite;
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
    const want = ok && !lite ? Math.min(8, flowers.length) : 0;
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
  // ---- seasonal events ----
  let eventDeco = null, eventKey = "";
  function syncEvent() {
    const k = eventNow(), key = `${k}|${islandR}`;
    if (key === eventKey) return; eventKey = key;
    if (eventDeco) { world.remove(eventDeco.group); eventDeco = null; }
    if (k) { eventDeco = buildEvent3D(K, k, islandR); world.add(eventDeco.group); }
  }
  function gardenerTalk() {
    const bub = $("g-bubble"); bub.textContent = "";
    const b = document.createElement("b"); b.textContent = "정원지기 "; bub.append(b, document.createTextNode(gardenerLine()));
    const talk = document.createElement("button"); talk.type = "button"; talk.className = "talk"; talk.textContent = "💬 이야기하기"; talk.onclick = () => { bub.hidden = true; openChat(); }; bub.append(talk);
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
      f.add(glow("#ffe27a", 0.5, 0.85)); f.visible = !lite || i % 3 === 0; flies.add(f);
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
    scene.add(fall); stepFall(0, 0); if (weatherKey === "rain" || lite) fall.visible = false;
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
    syncEvent();
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
  let lastNow = 0, lastDraw = 0, perf = { frames: 0, time: 0 }, chimeKick = 0;
  // light mode: lower resolution, no shadows, fewer moving effects, 30 frames a second
  function setLite(v, why, byUser) {
    lite = !!v;
    try { localStorage.setItem("emotion-garden-lite", lite ? "1" : byUser ? "off" : "0"); } catch (e) {}
    renderer.setPixelRatio(lite ? 1 : Math.min(window.devicePixelRatio || 1, 2)); resize();
    sun.castShadow = !lite;
    if (island) { if (island.userData.blades) island.userData.blades.visible = !lite; }
    if (cloudRing) cloudRing.visible = !lite;
    if (fall) fall.visible = !lite && weatherKey !== "rain";
    rain.count = lite ? Math.floor(RAIN_N / 3) : RAIN_N;
    flies.children.forEach((f, i) => { f.visible = !lite || i % 3 === 0; });
    syncLiteBtn();
    if (why) showTip(why);
  }
  function syncLiteBtn() { const b = $("lite-btn"); b.textContent = lite ? "🍃 가벼운 모드 켜짐" : "🍃 가벼운 모드"; b.setAttribute("aria-pressed", String(lite)); }
  $("lite-btn").addEventListener("click", () => setLite(!lite, lite ? "🌳 효과를 모두 다시 켰어요" : "🍃 가벼운 모드: 효과를 줄여 배터리와 발열을 아껴요", true));
  function lowerQuality() {
    let userOff = false; try { userOff = localStorage.getItem("emotion-garden-lite") === "off"; } catch (e) {}
    if (!lite && !userOff) setLite(true, "🍃 화면이 버벅여서 가벼운 모드로 바꿨어요. 아래 '가벼운 모드'로 끌 수 있어요");
  }
  function tick(now) {
    requestAnimationFrame(tick);
    visible = onScreen();
    if (!visible || document.hidden) { lastNow = 0; return; }
    if (lite && now - lastDraw < 30) return;
    lastDraw = now;
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
    if (eventDeco) eventDeco.step(now, SKIES[skyKey].night, reduce.matches);
    if (!reduce.matches) for (const pw of pinwheels) pw.rotation.z -= dt * 2.4;
    if (chimeStrips.length) { const kick = chimeKick ? Math.max(0, 1 - (now - chimeKick) / 2500) : 0; chimeStrips.forEach((cs, i) => { cs.rotation.z = (reduce.matches ? 0 : Math.sin(now / 700 + i) * 0.12) + Math.sin(now / 120) * 0.35 * kick; }); }
    if (!reduce.matches) {
      for (const f of floaters) { f.position.y = f.userData.baseY + Math.sin(now / 2200 + f.userData.phase) * 0.18; f.rotation.y += dt * 0.06; }
      if (birthIslet) { birthIslet.position.y = birthIslet.userData.baseY + Math.sin(now / 2600) * 0.15; }
      if (sparkles && sparkles.visible) sparkles.children.forEach((sp, i) => { if (sp.userData.r) { const a = sp.userData.a + now / 1800; sp.position.set(Math.cos(a) * sp.userData.r, Math.sin(now / 700 + i) * 0.25, Math.sin(a) * sp.userData.r); sp.material.opacity = 0.4 + 0.6 * Math.abs(Math.sin(now / 500 + i)); } });
      if (cloudRing) cloudRing.rotation.y += dt * 0.012;
    }
    // watch the first seconds (after a 2 s warm-up while shaders compile) and switch to light mode if the device struggles
    if (perf && dt > 0) { perf.warm = (perf.warm || 0) + dt; if (perf.warm > 2) { perf.frames++; perf.time += dt; if (perf.time > 4) { if (perf.frames / perf.time < 24) lowerQuality(); perf = null; } } }
    if (mailEnvelope && mailEnvelope.visible) { mailEnvelope.position.y = 1.35 + (reduce.matches ? 0 : Math.sin(now / 600) * 0.06); mailEnvelope.rotation.y = reduce.matches ? 0 : now / 1400; }
    if (mode === "orbit") controls.update(); else if (mode === "walk") stepWalk(dt, now); else stepTransition(now);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
  $("garden-hint").textContent = "드래그해서 정원을 돌려 보고, 두 손가락이나 휠로 확대해요. 식물을 누르면 그날의 일기가 열려요. 오래된 식물일수록 섬 가운데에 있어요.";
  syncLiteBtn(); if (lite) rain.count = Math.floor(RAIN_N / 3);
  return { update, tip: showTip, place, setLite: v => setLite(v), lite: () => lite, weather, snapshot, env: () => ({ sky: skyKey, season: seasonKey, weather: weatherKey }) };
}
let g3d = null;
try { g3d = initGarden3D(); } catch (e) { g3d = null; $("garden3d").hidden = true; cv.hidden = false; }
if (!g3d) $("lite-btn").hidden = true; // light mode only matters for the 3D garden
