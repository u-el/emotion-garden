// 감정정원 · 식물 모양: 감정별 17종의 씨앗, 새싹, 꽃봉오리, 꽃과 희귀 꽃, 12달 생일꽃
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// 일기 하나(e)를 받아 정원에 심을 식물 모양을 만들어요. 땅에 닿는 곳이 y = 0이에요.
function buildPlant3D(K, e) {
  const { T, lin, mat, mesh, glow, rnd, stemTube, leafMesh, addLeaf, petalRing, bladeLeaf, LEAF, SOIL, STONE, BARK, SOIL_DARK } = K;
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

// 생일 달(m)의 탄생화 모양을 만들어요.
function buildBirthFlower3D(K, m) {
  const { T, lin, mat, mesh, glow, rnd, stemTube, leafMesh, addLeaf, petalRing, bladeLeaf, LEAF, SOIL, STONE, BARK, SOIL_DARK } = K;
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
