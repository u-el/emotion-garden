// 감정정원 · 예시 정원, 3D를 쓸 수 없을 때의 2D 정원
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Example garden shown only while empty ----------
const EXAMPLES = (() => {
  const ex = [];
  const spec = [[-20,[[13,3]],"햇살 좋은 오후",3],[-16,[[3,4],[18,2]],"발표 전날",3],[-12,[[34,4]],"무사히 끝난 발표",3],[-9,[[8,3],[1,2]],"친구의 쪽지",3],
    [-6,[[7,4],[10,2]],"긴 하루",3],[-4,[[15,3],[22,2]],"옛 사진",2],[-2,[[36,3]],"새 동네 산책",1],[0,[[30,4],[4,2]],"다시 시작",0]];
  for (const [off, emos, title, st] of spec) {
    const d = new Date(); d.setDate(d.getDate() + off);
    ex.push({ id: "ex" + off, example: true, date: ymd(d), waterDays: Array(st + 1).fill("x"),
      emotions: emos.map(([n, s]) => ({ n, s })), title, note: "",
      diary: "예시 일기예요. 오늘의 산책에 글을 쓰고 씨앗을 심으면 이 자리에 내 일기가 들어와요." });
  }
  return ex;
})();
const shown = () => (entries.length ? entries : EXAMPLES);

// ---------- Garden drawing ----------
const cv = $("garden"), ctx = cv.getContext("2d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
let W = 0, H = 0, layout = [], bands = [], colors = {}, fireflies = [];
const BAND = 190, GROUND = 34;

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  for (const k of ["sky-top", "sky-bottom", "soil", "path", "leaf", "fg", "muted", "glow", "water"]) colors[k] = cs.getPropertyValue("--" + k).trim();
}
function computeLayout() {
  const list = [...shown()].sort((a, b) => (a.date + String(a.createdAt || 0).padStart(15, "0")).localeCompare(b.date + String(b.createdAt || 0).padStart(15, "0")));
  const months = new Map();
  for (const e of list) { const m = e.date.slice(0, 7); if (!months.has(m)) months.set(m, []); months.get(m).push(e); }
  W = cv.clientWidth || 600; bands = []; layout = [];
  let y = 0;
  for (const [m, items] of months) {
    bands.push({ m, y, count: items.length });
    const dayCount = {};
    for (const e of items) {
      const day = +e.date.slice(8, 10); const k = dayCount[day] = (dayCount[day] || 0) + 1;
      const r = hash(e.id || e.title);
      const x = 28 + ((day - 1) / 30) * (W - 56) + (k - 1) * 16 + (r - 0.5) * 8;
      const main = e.emotions[0]; const fam = E[main.n][1];
      const h = (fam === "moss" ? 26 : fam === "sprout" ? 30 : 44) + main.s * (fam === "moss" ? 6 : 14) * Math.min(1, W / 520 + 0.3);
      const stage = stageOf(e);
      const vis = stage === 3 ? h : stage === 2 ? h * 0.65 + 10 : stage === 1 ? 24 : 12;
      layout.push({ e, x: clamp(x, 20, W - 20), base: y + BAND - GROUND + 6 + r * 10, h, vis, stage, phase: r * 6.28, fam,
        color: E[main.n][2], accent: e.emotions[1] ? E[e.emotions[1].n][2] : null, s: main.s, thirsty: needsWater(e) });
    }
    y += BAND;
  }
  if (!bands.length) { bands.push({ m: today().slice(0, 7), y: 0, count: 0 }); y = BAND; }
  H = y; layout.sort((a, b) => a.base - b.base);
  const dpr = window.devicePixelRatio || 1;
  cv.style.height = H + "px"; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fireflies = Array.from({ length: Math.round(W / 60) * bands.length }, (_, i) => ({ x: hash("fx" + i) * W, y: hash("fy" + i) * (H - 40), p: hash("fp" + i) * 6.28 }));
}
function drawBand(b) {
  const g = ctx.createLinearGradient(0, b.y, 0, b.y + BAND);
  g.addColorStop(0, colors["sky-top"]); g.addColorStop(1, colors["sky-bottom"]);
  ctx.fillStyle = g; ctx.fillRect(0, b.y, W, BAND);
  const gy = b.y + BAND - GROUND;
  ctx.fillStyle = colors.soil; ctx.beginPath(); ctx.moveTo(0, gy + 8);
  for (let x = 0; x <= W; x += 20) ctx.lineTo(x, gy + 8 + Math.sin(x / 60 + b.y) * 4);
  ctx.lineTo(W, b.y + BAND); ctx.lineTo(0, b.y + BAND); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = colors.path; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.setLineDash([2, 13]);
  ctx.beginPath(); for (let x = 8; x <= W - 8; x += 6) { const yy = gy + 20 + Math.sin(x / 90 + b.y) * 4; x === 8 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke();
  ctx.setLineDash([]);
  const [yy, mm] = b.m.split("-");
  ctx.fillStyle = colors.fg; ctx.font = '700 15px "Hahmlet", serif'; ctx.textBaseline = "top";
  ctx.fillText(`${yy}년 ${+mm}월`, 14, b.y + 12);
  ctx.fillStyle = colors.muted; ctx.font = '13px "Gowun Dodum", sans-serif';
  ctx.fillText(b.count ? `${b.count}그루` : "아직 비어 있는 땅", 14, b.y + 32);
}
function stem(len, curve) {
  ctx.strokeStyle = colors.leaf; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(curve, -len / 2, 0, -len); ctx.stroke();
}
function leaf(y, dir, size, col) {
  ctx.fillStyle = col || colors.leaf; ctx.beginPath(); ctx.moveTo(0, y);
  ctx.quadraticCurveTo(dir * size, y - size * 0.9, dir * size * 1.3, y - size * 0.2);
  ctx.quadraticCurveTo(dir * size * 0.6, y + size * 0.1, 0, y); ctx.fill();
}
function drawYoung(p) {
  const c = p.color;
  if (p.stage === 0) {
    ctx.fillStyle = colors.path; ctx.beginPath(); ctx.ellipse(0, 0, 13, 6, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, -5, 4, 5.5, 0.3, 0, 7); ctx.fill();
  } else if (p.stage === 1) {
    ctx.fillStyle = colors.path; ctx.beginPath(); ctx.ellipse(0, 0, 11, 4, 0, Math.PI, 0); ctx.fill();
    stem(16, 2); ctx.save(); ctx.translate(0, -16); leaf(0, -1, 8); leaf(0, 1, 8, c); ctx.restore();
  } else {
    const len = p.h * 0.65; stem(len, 4); leaf(-len * 0.35, -1, 9); leaf(-len * 0.55, 1, 8);
    const r = 4 + p.s; ctx.fillStyle = c; ctx.beginPath();
    ctx.moveTo(0, -len - r * 2.4); ctx.quadraticCurveTo(r * 1.3, -len - r * 0.8, 0, -len); ctx.quadraticCurveTo(-r * 1.3, -len - r * 0.8, 0, -len - r * 2.4); ctx.fill();
    ctx.fillStyle = colors.leaf; ctx.beginPath(); ctx.moveTo(-r * 0.8, -len - 1); ctx.quadraticCurveTo(0, -len - r * 1.2, r * 0.8, -len - 1); ctx.lineTo(0, -len + 2); ctx.closePath(); ctx.fill();
  }
}
function drawPlant(p, t) {
  const sway = reduce.matches ? 0 : Math.sin(t / 1300 + p.phase) * 0.035 * (1 + p.s / 3) * (p.stage === 0 ? 0 : 1);
  const h = p.h, c = p.color, a = p.accent || "rgba(255,255,255,0.75)";
  ctx.save(); ctx.translate(p.x, p.base); ctx.rotate(sway);
  if (p.stage < 3) { drawYoung(p); ctx.restore(); return; }
  switch ({ sunflower: "daisy", camellia: "daisy", starflower: "daisy", dandelion: "tulip", lotus: "moss", hydrangea: "bell", lavender: "fern", wildrose: "thorn" }[p.fam] || p.fam) {
    case "daisy": {
      stem(h, 6); leaf(-h * 0.35, -1, 10); leaf(-h * 0.55, 1, 9);
      const r = 7 + p.s * 1.6; ctx.translate(0, -h); ctx.fillStyle = c;
      for (let i = 0; i < 10; i++) { ctx.save(); ctx.rotate(i * Math.PI / 5); ctx.beginPath(); ctx.ellipse(0, -r * 0.75, r * 0.35, r * 0.75, 0, 0, 7); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = p.accent || "#7a5a2a"; ctx.beginPath(); ctx.arc(0, 0, r * 0.42, 0, 7); ctx.fill();
      break;
    }
    case "tulip": {
      stem(h, -5); leaf(-h * 0.25, 1, 12); leaf(-h * 0.4, -1, 10);
      const r = 6 + p.s * 1.4; ctx.translate(0, -h);
      ctx.fillStyle = c; ctx.beginPath();
      ctx.moveTo(-r, -r * 0.2); ctx.quadraticCurveTo(-r * 1.05, r * 1.1, 0, r * 0.9); ctx.quadraticCurveTo(r * 1.05, r * 1.1, r, -r * 0.2);
      ctx.lineTo(r * 0.5, -r * 1.1); ctx.lineTo(0, -r * 0.3); ctx.lineTo(-r * 0.5, -r * 1.1); ctx.closePath(); ctx.fill();
      ctx.fillStyle = a; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.ellipse(0, r * 0.2, r * 0.28, r * 0.55, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
      break;
    }
    case "bell": {
      ctx.strokeStyle = colors.leaf; ctx.lineWidth = 2.4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-4, -h * 0.7, h * 0.35, -h); ctx.stroke();
      leaf(-h * 0.3, -1, 10);
      const n = 1 + Math.ceil(p.s / 2), r = 5 + p.s * 1.3;
      for (let i = 0; i < n; i++) {
        const tt = 0.55 + i * (0.45 / n); const bx = h * 0.35 * tt * tt, by = -h * (0.4 + 0.6 * tt);
        ctx.strokeStyle = colors.leaf; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 2, by + r * 0.6); ctx.stroke();
        ctx.fillStyle = i === n - 1 && p.accent ? a : c;
        ctx.beginPath(); ctx.moveTo(bx + 2 - r * 0.55, by + r * 0.6); ctx.quadraticCurveTo(bx + 2, by - r * 0.2, bx + 2 + r * 0.55, by + r * 0.6);
        ctx.lineTo(bx + 2 + r * 0.8, by + r * 1.6); ctx.quadraticCurveTo(bx + 2, by + r * 1.3, bx + 2 - r * 0.8, by + r * 1.6); ctx.closePath(); ctx.fill();
      }
      break;
    }
    case "fern": {
      const fronds = 2 + Math.ceil(p.s / 2);
      for (let f = 0; f < fronds; f++) {
        const ang = (f - (fronds - 1) / 2) * 0.32, len = h * (0.75 + 0.25 * Math.cos(ang * 2)), sg = Math.sign(ang || 1);
        ctx.save(); ctx.rotate(ang);
        ctx.strokeStyle = colors.leaf; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.25 * sg, -len * 0.6, len * 0.3 * sg, -len); ctx.stroke();
        ctx.fillStyle = f % 2 ? c : (p.accent || c);
        for (let k = 3; k < 11; k++) { const q = k / 11, lx = len * 0.3 * sg * q * q, ly = -len * q, sz = 6 * (1 - q) + 2;
          ctx.beginPath(); ctx.ellipse(lx - sz, ly, sz, 1.8, -0.4, 0, 7); ctx.ellipse(lx + sz, ly, sz, 1.8, 0.4, 0, 7); ctx.fill(); }
        ctx.restore();
      }
      break;
    }
    case "thorn": {
      const w = 6 + p.s * 1.3;
      ctx.fillStyle = colors.leaf; ctx.beginPath(); ctx.moveTo(-w, 0); ctx.lineTo(-w * 0.8, -h + w); ctx.quadraticCurveTo(0, -h - w * 0.6, w * 0.8, -h + w); ctx.lineTo(w, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = c; ctx.lineWidth = 1.6;
      for (let k = 1; k < 7; k++) { const yy = -h * k / 7, side = k % 2 ? -1 : 1; ctx.beginPath(); ctx.moveTo(side * w * 0.85, yy); ctx.lineTo(side * (w + 6), yy - 4); ctx.stroke(); }
      ctx.fillStyle = c; ctx.beginPath();
      for (let i = 0; i < 5; i++) { const an = i * 1.2566 - Math.PI / 2; ctx.lineTo(Math.cos(an) * w * 0.9, -h - 2 + Math.sin(an) * w * 0.9); ctx.lineTo(Math.cos(an + 0.63) * w * 0.35, -h - 2 + Math.sin(an + 0.63) * w * 0.35); }
      ctx.closePath(); ctx.fill();
      if (p.accent) { ctx.fillStyle = a; ctx.beginPath(); ctx.arc(0, -h - 2, 2.5, 0, 7); ctx.fill(); }
      break;
    }
    case "moss": {
      const w = 14 + p.s * 3;
      ctx.fillStyle = colors.muted; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(0, -h * 0.3, w, h * 0.45, 0, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1;
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, -h * 0.45, w * 0.9, h * 0.38, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = p.accent || colors.leaf;
      for (let i = 0; i < 7; i++) { const dx = (hash(p.e.id + i) - 0.5) * w * 1.4; ctx.beginPath(); ctx.arc(dx, -h * 0.5 - hash(p.e.title + i) * h * 0.3, 1.8, 0, 7); ctx.fill(); }
      ctx.strokeStyle = colors.leaf; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(w * 0.2, -h * 0.78); ctx.quadraticCurveTo(w * 0.25, -h - 4, w * 0.4, -h - 8); ctx.stroke();
      break;
    }
    case "willow": {
      ctx.strokeStyle = colors.leaf; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -h); ctx.stroke();
      const n = 4 + p.s;
      for (let i = 0; i < n; i++) {
        const side = i % 2 ? 1 : -1, spread = (6 + i * 2.2) * side, drop = h * (0.45 + 0.1 * (i % 3));
        ctx.strokeStyle = i % 3 === 0 && p.accent ? a : c; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(0, -h); ctx.quadraticCurveTo(spread * 1.2, -h - 6, spread, -h + drop); ctx.stroke();
      }
      break;
    }
    case "vine": {
      ctx.strokeStyle = "#8a6a4a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -h); ctx.stroke();
      ctx.strokeStyle = colors.leaf; ctx.lineWidth = 1.8; ctx.beginPath();
      for (let t = 0; t <= 1.001; t += 0.04) { const yy = -h * t, xx = Math.sin(t * 14) * 5; t === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); } ctx.stroke();
      for (let i = 0; i < 2 + Math.ceil(p.s / 2); i++) {
        const t = 0.35 + i * 0.2, yy = -h * Math.min(0.98, t), xx = Math.sin(t * 14) * 5 + (i % 2 ? 6 : -6);
        ctx.fillStyle = i === 1 && p.accent ? a : c; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx - 5, yy - 7); ctx.quadraticCurveTo(xx, yy - 10, xx + 5, yy - 7); ctx.closePath(); ctx.fill();
      }
      break;
    }
    default: {
      stem(h * 0.7, 2); ctx.save(); ctx.translate(0, -h * 0.7);
      ctx.fillStyle = colors.leaf; ctx.beginPath(); ctx.ellipse(-7, -3, 8, 4, -0.5, 0, 7); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(7, -3, 8, 4, 0.5, 0, 7); ctx.fill(); ctx.restore();
    }
  }
  ctx.restore();
}
function drawDrop(p, t) {
  const bob = reduce.matches ? 0 : Math.sin(t / 500 + p.phase) * 2.5;
  const x = p.x, y = p.base - p.vis - 16 + bob;
  ctx.fillStyle = colors.water; ctx.beginPath(); ctx.moveTo(x, y - 7);
  ctx.quadraticCurveTo(x + 5.5, y, x, y + 4); ctx.quadraticCurveTo(x - 5.5, y, x, y - 7); ctx.fill();
}
function frame(t) {
  ctx.clearRect(0, 0, W, H);
  for (const b of bands) drawBand(b);
  for (const p of layout) drawPlant(p, t || 0);
  for (const p of layout) if (p.thirsty) drawDrop(p, t || 0);
  if (colors.glow && !/,\s*0\)$/.test(colors.glow)) {
    for (const f of fireflies) {
      const fx = f.x + Math.sin(t / 2100 + f.p) * 12, fy = f.y + Math.cos(t / 1700 + f.p) * 8, al = 0.35 + 0.65 * Math.max(0, Math.sin(t / 900 + f.p * 3));
      const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, 7); g.addColorStop(0, colors.glow); g.addColorStop(1, "rgba(255,236,150,0)");
      ctx.globalAlpha = reduce.matches ? 0.7 : al; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx, fy, 7, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    }
  }
}
let raf = 0;
function loop(t) { frame(t); raf = (reduce.matches || document.hidden) ? 0 : requestAnimationFrame(loop); }
function kick() { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }
document.addEventListener("visibilitychange", () => { if (!document.hidden && !g3d) kick(); });
