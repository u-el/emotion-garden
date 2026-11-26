// 감정정원 · 계절 행사: 겨울 축제, 설날, 벚꽃 축제, 추석
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

const EVENTS = {
  winter: { name: "겨울 축제", icon: "🎄", hello: "12월이에요! 정원에 겨울 축제가 열렸어요. 눈사람과 반짝이 전구를 찾아보세요." },
  seollal: { name: "설날", icon: "🧧", hello: "새해 복 많이 받으세요! 나무에 복주머니가 열리고 하늘에 연이 날아요." },
  cherry: { name: "벚꽃 축제", icon: "🌸", hello: "벚꽃 축제가 열렸어요. 산책길을 따라 꽃등이 켜졌어요." },
  chuseok: { name: "추석", icon: "🌕", hello: "한가위예요. 커다란 보름달에 소원을 빌어 보세요. 송편도 준비했어요." },
};
// 설날과 추석은 음력이라 해마다 날짜가 달라요. 그날 앞 3일부터 뒤 2일까지 행사가 열려요.
const LUNAR_DAYS = {
  seollal: ["2026-02-17", "2027-02-07", "2028-01-27", "2029-02-13", "2030-02-03", "2031-01-23"],
  chuseok: ["2026-09-25", "2027-09-15", "2028-10-03", "2029-09-22", "2030-09-12", "2031-10-01"],
};
let eventPreview = null;
function eventNow(d = new Date()) {
  if (eventPreview) return eventPreview === "off" ? null : eventPreview;
  const m = d.getMonth() + 1, day = d.getDate(), t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  for (const [key, list] of Object.entries(LUNAR_DAYS)) {
    for (const s of list) { const diff = Math.round((t - new Date(s + "T00:00:00")) / 86400000); if (diff >= -3 && diff <= 2) return key; }
  }
  if (m === 12) return "winter";
  if (m === 4 && day <= 14) return "cherry";
  return null;
}
const EVENT_ORDER = ["winter", "seollal", "cherry", "chuseok", "off"];
$("event-btn").addEventListener("click", () => previewNextEvent());
function previewNextEvent() {
  const i = eventPreview ? EVENT_ORDER.indexOf(eventPreview) : -1;
  eventPreview = EVENT_ORDER[(i + 1) % EVENT_ORDER.length];
  render();
  const ev = EVENTS[eventPreview];
  if (g3d) g3d.tip(ev ? `${ev.icon} ${ev.name} 미리보기` : "행사 미리보기를 껐어요", true);
  $("event-btn").textContent = ev ? `🎉 미리보기: ${ev.name}` : "🎉 행사 미리보기";
}
function greetEvent() {
  const key = eventNow(); if (!key || eventPreview) return;
  const stamp = `${today()}|${key}`;
  try { if (localStorage.getItem("emotion-garden-event") === stamp) return; localStorage.setItem("emotion-garden-event", stamp); } catch (e) {}
  setTimeout(() => { if (g3d) g3d.tip(`${EVENTS[key].icon} ${EVENTS[key].hello}`); }, 1800);
}

// Builds the decorations for one event on an island of radius R. Returns the group and a step(now, night, still) to animate it.
function buildEvent3D(K, key, R) {
  const { T, lin, mat, mesh, glow, rnd } = K;
  const g = new T.Group(), movers = [], blinkers = [];
  const r = rnd("event" + key);
  const at = (ang, f, y = 0) => new T.Vector3(Math.cos(ang) * R * f, y, Math.sin(ang) * R * f);
  const treeTop = ang => at(ang, 0.8, 2.0); // the two seasonal trees stand at these angles
  if (key === "winter") {
    // snowman
    const sm = new T.Group(); sm.position.copy(at(2.95, 0.62)); sm.rotation.y = -2.95 - Math.PI / 2;
    const snow = mat("#f7fbff", { roughness: 0.9 });
    [[0.32, 0.3], [0.23, 0.78], [0.16, 1.12]].forEach(([rr, y]) => { const b = mesh(new T.SphereGeometry(rr, 20, 14), snow); b.position.y = y; sm.add(b); });
    for (const sx of [-1, 1]) { const eye = mesh(new T.SphereGeometry(0.022, 8, 6), mat("#1f1f22")); eye.position.set(sx * 0.055, 1.16, 0.145); sm.add(eye); }
    const nose = mesh(new T.ConeGeometry(0.025, 0.13, 8), mat("#f08a2c")); nose.rotation.x = Math.PI / 2; nose.position.set(0, 1.11, 0.2); sm.add(nose);
    const scarf = mesh(new T.TorusGeometry(0.17, 0.04, 8, 18), mat("#d24b4b")); scarf.rotation.x = Math.PI / 2; scarf.position.y = 0.98; sm.add(scarf);
    const hat = mesh(new T.CylinderGeometry(0.11, 0.12, 0.16, 16), mat("#2c2c34")); hat.position.y = 1.32; sm.add(hat);
    const brim = mesh(new T.CylinderGeometry(0.17, 0.17, 0.02, 18), mat("#2c2c34")); brim.position.y = 1.25; sm.add(brim);
    for (const sx of [-1, 1]) { const arm = mesh(new T.CylinderGeometry(0.012, 0.016, 0.42, 5), mat("#6b4f3a")); arm.position.set(sx * 0.32, 0.86, 0); arm.rotation.z = sx * -1.0; sm.add(arm); }
    for (let i = 0; i < 3; i++) { const bt = mesh(new T.SphereGeometry(0.02, 8, 6), mat("#1f1f22")); bt.position.set(0, 0.68 + i * 0.1, 0.225 - Math.abs(i - 1) * 0.01); sm.add(bt); }
    g.add(sm);
    // gift boxes
    [["#c4553f", "#f6d36a"], ["#4f8fc4", "#ffffff"], ["#6f9a68", "#f2c14e"]].forEach(([c1, c2], i) => {
      const s = 0.18 + i * 0.04, box = new T.Group(); box.position.copy(at(3.15 + i * 0.12, 0.66 + (i % 2) * 0.05)); box.rotation.y = r() * 3;
      const b = mesh(new T.BoxGeometry(s, s * 0.8, s), mat(c1)); b.position.y = s * 0.4; box.add(b);
      const rb1 = mesh(new T.BoxGeometry(s * 1.02, s * 0.82, s * 0.18), mat(c2)); rb1.position.y = s * 0.4; box.add(rb1);
      const rb2 = mesh(new T.BoxGeometry(s * 0.18, s * 0.82, s * 1.02), mat(c2)); rb2.position.y = s * 0.4; box.add(rb2);
      const bow = mesh(new T.TorusGeometry(s * 0.14, s * 0.04, 6, 12), mat(c2)); bow.position.y = s * 0.85; box.add(bow);
      g.add(box);
    });
    // string lights wound around both trees, and a star on top of one
    const bulbs = ["#ff5a5a", "#ffd84a", "#6bd36b", "#4fb3ff", "#ff9ad5"];
    for (const ang of [2.5, 4.1]) {
      const c = treeTop(ang);
      for (let i = 0; i < 26; i++) {
        const t = i / 26, a = t * 6.283 * 2.2, rad = 0.78 - t * 0.35, p = new T.Vector3(c.x + Math.cos(a) * rad, 1.35 + t * 1.15, c.z + Math.sin(a) * rad);
        const col = bulbs[i % bulbs.length];
        const bulb = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), new T.MeshStandardMaterial({ color: lin(col), emissive: lin(col), emissiveIntensity: 1.2 }));
        bulb.position.copy(p); g.add(bulb);
        const gl = glow(col, 0.5, 0.6); gl.position.copy(p); g.add(gl); blinkers.push({ gl, bulb, ph: i * 0.7 });
      }
    }
    const star = new T.Group(); star.position.copy(treeTop(2.5)); star.position.y = 2.75;
    const sm2 = new T.MeshStandardMaterial({ color: lin("#ffe066"), emissive: lin("#ffcc33"), emissiveIntensity: 1.1, metalness: 0.3 });
    for (let i = 0; i < 5; i++) { const pt = mesh(new T.ConeGeometry(0.05, 0.16, 4), sm2); const a = i / 5 * 6.283; pt.position.set(Math.sin(a) * 0.08, Math.cos(a) * 0.08, 0); pt.rotation.z = -a; star.add(pt); }
    star.add(glow("#ffe9a0", 0.9, 0.8)); g.add(star); movers.push(now => { star.rotation.y = now / 1500; });
  }
  if (key === "seollal") {
    // lucky pouches hanging from both trees
    const pouchCols = ["#d6453a", "#3d6ab8", "#e98fb0", "#6aa86a", "#f0b53c"];
    for (const ang of [2.5, 4.1]) {
      const c = treeTop(ang);
      for (let i = 0; i < 5; i++) {
        const a = i / 5 * 6.283 + ang, p = new T.Vector3(c.x + Math.cos(a) * 0.62, 1.55 + (i % 2) * 0.25, c.z + Math.sin(a) * 0.62);
        const pouch = new T.Group(); pouch.position.copy(p);
        const string = mesh(new T.CylinderGeometry(0.004, 0.004, 0.22, 4), mat("#f6d36a")); string.position.y = 0.11; pouch.add(string);
        const bag = mesh(new T.SphereGeometry(0.13, 14, 10), mat(pouchCols[(i + (ang > 3 ? 2 : 0)) % 5])); bag.scale.set(1, 1.1, 0.8); bag.position.y = -0.04; pouch.add(bag);
        const neck = mesh(new T.CylinderGeometry(0.03, 0.05, 0.05, 10), mat(pouchCols[(i + 1) % 5])); neck.position.y = 0.06; pouch.add(neck);
        const tie = mesh(new T.TorusGeometry(0.035, 0.008, 6, 12), mat("#f6d36a")); tie.rotation.x = Math.PI / 2; tie.position.y = 0.05; pouch.add(tie);
        g.add(pouch); movers.push(now => { pouch.rotation.z = Math.sin(now / 900 + i) * 0.12; });
      }
    }
    // a kite (방패연 style) flying above the island on a long string
    const kite = new T.Group(); const kiteBase = at(5.2, 1.25, 5.2);
    const sail = mesh(new T.PlaneGeometry(0.7, 0.85), new T.MeshStandardMaterial({ color: lin("#f4efe2"), side: T.DoubleSide, roughness: 0.8 })); kite.add(sail);
    const circle = mesh(new T.CircleGeometry(0.14, 20), mat("#d6453a", { side: T.DoubleSide })); circle.position.z = 0.003; kite.add(circle);
    const band = mesh(new T.PlaneGeometry(0.7, 0.12), mat("#3d6ab8", { side: T.DoubleSide })); band.position.set(0, 0.36, 0.002); kite.add(band);
    for (let i = 0; i < 6; i++) { const tail = mesh(new T.PlaneGeometry(0.06, 0.22), mat(i % 2 ? "#d6453a" : "#3d6ab8", { side: T.DoubleSide })); tail.position.set((i % 2 ? 0.08 : -0.08), -0.55 - i * 0.18, 0); kite.add(tail); }
    kite.position.copy(kiteBase); g.add(kite);
    const lineGeo = new T.BufferGeometry().setFromPoints([at(5.2, 0.7, 0.05), kiteBase]);
    const kiteLine = new T.Line(lineGeo, new T.LineBasicMaterial({ color: lin("#8a8a8a"), transparent: true, opacity: 0.6 })); g.add(kiteLine);
    movers.push((now, still) => { if (still) return; kite.position.set(kiteBase.x + Math.sin(now / 1700) * 0.4, kiteBase.y + Math.sin(now / 1100) * 0.25, kiteBase.z); kite.rotation.set(-0.3, Math.sin(now / 2100) * 0.3, Math.sin(now / 1300) * 0.2); lineGeo.setFromPoints([at(5.2, 0.7, 0.05), kite.position.clone().add(new T.Vector3(0, -0.4, 0))]); });
  }
  if (key === "cherry") {
    // paper flower lanterns on poles along the stepping-stone path
    const cols = ["#ffd1e0", "#ffffff", "#ffb3cc"];
    for (let i = 0; i < 6; i++) {
      const t = i / 5, ang = -0.6 + Math.sin(t * 3) * 0.12 + (i % 2 ? 0.16 : -0.16), f = 0.95 - t * 0.5;
      const post = new T.Group(); post.position.copy(at(ang, f));
      const pole = mesh(new T.CylinderGeometry(0.02, 0.025, 1.1, 6), mat("#6b4f3a")); pole.position.y = 0.55; post.add(pole);
      const arm = mesh(new T.BoxGeometry(0.22, 0.02, 0.02), mat("#6b4f3a")); arm.position.set(0.1, 1.08, 0); post.add(arm);
      const col = cols[i % cols.length], lm = new T.MeshStandardMaterial({ color: lin(col), emissive: lin(col), emissiveIntensity: 0.4, roughness: 0.6 });
      const lan = mesh(new T.SphereGeometry(0.11, 16, 12), lm); lan.scale.y = 1.2; lan.position.set(0.2, 0.92, 0); post.add(lan);
      const gl = glow("#ffd6e6", 1.0, 0.3); gl.position.copy(lan.position); post.add(gl); blinkers.push({ gl, bulb: lan, ph: i, soft: true });
      g.add(post);
    }
  }
  if (key === "chuseok") {
    // a huge full moon in the sky
    const moon = new T.Mesh(new T.SphereGeometry(1.3, 32, 24), new T.MeshBasicMaterial({ color: lin("#fff3c4") }));
    moon.position.set(-R * 1.1, 4.6, -R * 1.3); g.add(moon);
    const halo = glow("#fff0b0", 6, 0.55); halo.position.copy(moon.position); g.add(halo);
    for (const [x, y, rr] of [[-0.35, 0.3, 0.22], [0.3, -0.2, 0.3], [0.15, 0.45, 0.14]]) { const crater = new T.Mesh(new T.CircleGeometry(rr, 18), new T.MeshBasicMaterial({ color: lin("#f0dfa2") })); crater.position.copy(moon.position).add(new T.Vector3(x, y, 1.31)); crater.lookAt(moon.position.clone().add(new T.Vector3(x, y, 5))); g.add(crater); }
    movers.push((now, still, night) => { halo.material.opacity = night ? 0.75 : 0.35; moon.lookAt(0, 0, 0); });
    // a low table with a plate of songpyeon, and a little moon rabbit
    const tbl = new T.Group(); tbl.position.copy(at(3.0, 0.6)); tbl.rotation.y = -3.0;
    const top = mesh(new T.CylinderGeometry(0.34, 0.34, 0.05, 24), mat("#8a5a3a")); top.position.y = 0.26; tbl.add(top);
    for (let i = 0; i < 4; i++) { const leg = mesh(new T.BoxGeometry(0.04, 0.24, 0.04), mat("#6b4f3a")); const a = i * Math.PI / 2 + Math.PI / 4; leg.position.set(Math.cos(a) * 0.24, 0.12, Math.sin(a) * 0.24); tbl.add(leg); }
    const plate = mesh(new T.CylinderGeometry(0.22, 0.18, 0.03, 24), mat("#f4f0e6")); plate.position.y = 0.3; tbl.add(plate);
    ["#ffffff", "#f7c6d6", "#a8d08a", "#ffffff", "#f7c6d6", "#a8d08a", "#ffe9a8"].forEach((c, i) => { const sp = mesh(new T.SphereGeometry(0.045, 12, 8, 0, 6.29, 0, Math.PI / 2), mat(c)); sp.scale.set(1.4, 0.9, 0.8); const a = i / 7 * 6.283; sp.position.set(Math.cos(a) * 0.1 * (i % 2 ? 1 : 0.5), 0.315, Math.sin(a) * 0.1 * (i % 2 ? 1 : 0.5)); sp.rotation.y = a; tbl.add(sp); });
    g.add(tbl);
    const rab = new T.Group(); rab.position.copy(at(3.25, 0.62)); rab.rotation.y = -3.25 + Math.PI / 2;
    const fur = mat("#f7f4ee");
    const rb = mesh(new T.SphereGeometry(0.14, 16, 12), fur); rb.scale.set(1, 0.9, 1.2); rb.position.y = 0.13; rab.add(rb);
    const rh = mesh(new T.SphereGeometry(0.09, 14, 10), fur); rh.position.set(0, 0.27, -0.12); rab.add(rh);
    for (const sx of [-1, 1]) { const ear = mesh(new T.SphereGeometry(0.03, 8, 6), fur); ear.scale.set(1, 3.2, 0.6); ear.position.set(sx * 0.04, 0.42, -0.12); ear.rotation.z = sx * 0.15; rab.add(ear);
      const eye = mesh(new T.SphereGeometry(0.012, 6, 4), mat("#c44a5a")); eye.position.set(sx * 0.04, 0.29, -0.2); rab.add(eye); }
    const tail = mesh(new T.SphereGeometry(0.04, 8, 6), fur); tail.position.set(0, 0.14, 0.16); rab.add(tail);
    g.add(rab); movers.push((now, still) => { rab.position.y = still ? 0 : Math.max(0, Math.sin(now / 350)) * 0.06; });
  }
  g.traverse(o => { o.raycast = () => {}; });
  function step(now, night, still) {
    for (const bl of blinkers) {
      const on = bl.soft ? 0.55 + 0.45 * Math.sin(now / 900 + bl.ph) : (Math.sin(now / 420 + bl.ph) > -0.2 ? 1 : 0.35);
      bl.gl.material.opacity = (night ? 0.9 : 0.35) * (still ? 0.8 : on);
      bl.bulb.material.emissiveIntensity = (night ? 1.4 : 0.6) * (still ? 1 : on);
    }
    for (const f of movers) f(now, still, night);
  }
  return { group: g, step };
}
