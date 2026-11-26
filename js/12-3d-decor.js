// 감정정원 · 정원 꾸미기 소품 모양: 버섯, 돌탑, 풍경, 초롱, 벤치, 새집, 연못, 꽃 아치, 바람개비, 별빛 나무
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// 소품 모양을 만들어요. 움직이거나 빛나는 부분은 sinks의 목록에 넣어 정원이 움직이게 해요.
function buildDecor3D(K, id, sinks) {
  const { T, lin, mat, mesh, glow, petalRing, LEAF, STONE, BARK } = K;
  const { decorGlows, chimeStrips, pinwheels } = sinks;
  let chimeStrip = null, pinwheel = null;
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
