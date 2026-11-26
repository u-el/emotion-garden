// 감정정원 · 3D 재료와 도구: 색 보정, 재질, 그림 질감, 빛 번짐, 줄기와 잎, 꽃잎 고리
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// 3D 정원과 꽃 모양 파일들이 함께 쓰는 재료와 도구를 한 번에 만들어요.
function make3DKit(T, renderer) {
  const lin = c => new T.Color(c).convertSRGBToLinear();
  const coarse = matchMedia("(pointer: coarse)").matches;
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

  function stemTube(h, bend, r = 0.035, to) {
    const end = to || new T.Vector3(0, h, 0);
    const curve = new T.QuadraticBezierCurve3(new T.Vector3(0, 0, 0), new T.Vector3(bend, h * 0.5, 0), end);
    return { m: mesh(new T.TubeGeometry(curve, 12, r, 7, false), mat(LEAF)), curve };
  }
  function leafMesh(size, col) { const l = mesh(new T.SphereGeometry(1, 14, 8), mat(col || LEAF)); l.scale.set(size * 0.45, size * 0.08, size * 0.2); return l; }
  function addLeaf(g, y, ang, size, col) { const l = leafMesh(size, col); l.position.set(Math.cos(ang) * size * 0.35, y, Math.sin(ang) * size * 0.35); l.rotation.set(0, -ang, 0.45); g.add(l); }
  function petalRing(parent, n, len, wid, col, tilt, y = 0, off = 0, thick = 0.03) {
    for (let i = 0; i < n; i++) {
      const pv = new T.Group(); pv.rotation.y = i / n * 6.283 + off; pv.position.y = y;
      const pt = mesh(new T.SphereGeometry(1, 14, 8), mat(col)); pt.scale.set(wid, thick, len);
      pt.position.z = len * 0.85; pv.rotation.x = 0; const lift = new T.Group(); lift.rotation.x = -tilt; lift.add(pt); pv.add(lift); parent.add(pv);
    }
  }
  function bladeLeaf(g, h, ang, col) { const l = mesh(new T.SphereGeometry(1, 12, 8), mat(col || LEAF)); l.scale.set(0.045, h, 0.012); l.position.set(Math.cos(ang) * 0.06, h * 0.9, Math.sin(ang) * 0.06); l.rotation.set(Math.sin(ang) * 0.25, 0, -Math.cos(ang) * 0.25); g.add(l); }
  return { T, lin, coarse, mat, mesh, BARK, LEAF, SOIL, SOIL_DARK, GRASS, STONE, grassTex, grassTopMat, soilSideMat, bladeMat, tmpObj, glow, rnd, stemTube, leafMesh, addLeaf, petalRing, bladeLeaf };
}
