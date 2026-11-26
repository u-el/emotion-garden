// 감정정원 · 이번 주 산책 지도, 한 주 편지, 편지함
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Weekly walk map ----------
const MOODS = [
  { key: "bright", name: "밝음", fams: ["daisy", "tulip", "sunflower", "camellia", "dandelion", "starflower"], color: "#f0b53c" },
  { key: "calm", name: "고요", fams: ["moss", "lotus"], color: "#7cc2a6" },
  { key: "wave", name: "출렁임", fams: ["fern", "thorn", "lavender", "wildrose"], color: "#d9704a" },
  { key: "low", name: "가라앉음", fams: ["bell", "willow", "vine", "hydrangea"], color: "#6a7fc4" },
  { key: "unknown", name: "아직 모름", fams: ["sprout"], color: "#b9c2b6" },
];
const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const STAMP = { daisy: "🌼", tulip: "🌷", bell: "🔔", fern: "🌿", thorn: "🌵", moss: "🪨", willow: "🍃", vine: "🪴", sprout: "🌱", sunflower: "🌻", camellia: "🌺", hydrangea: "💠", lotus: "🪷", dandelion: "🌾", lavender: "💜", wildrose: "🌹", starflower: "✨" };
let weekOffset = 0;
function weekStartOf(d) { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
function weekDays(offset) { const s = weekStartOf(new Date()); s.setDate(s.getDate() + offset * 7); return Array.from({ length: 7 }, (_, i) => { const d = new Date(s); d.setDate(s.getDate() + i); return ymd(d); }); }
const svgEl = (tag, attrs, parent) => { const el = document.createElementNS("http://www.w3.org/2000/svg", tag); for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v); if (parent) parent.append(el); return el; };
$("week-prev").onclick = () => { weekOffset--; render(); };
$("week-next").onclick = () => { if (weekOffset < 0) { weekOffset++; render(); } };

function renderWeek() {
  const days = weekDays(weekOffset), own = entries.length > 0, src = shown();
  const byDay = days.map(d => src.filter(e => e.date === d).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)));
  const weekEntries = byDay.flat();
  $("week-example").hidden = own;
  $("week-next").disabled = weekOffset >= 0;
  $("week-range").textContent = `${md(days[0])} – ${md(days[6]).replace(/^\d+월 /, days[0].slice(5, 7) === days[6].slice(5, 7) ? "" : "$&")}`;
  $("week-title").textContent = weekOffset === 0 ? "이번 주 산책 지도" : weekOffset === -1 ? "지난주 산책 지도" : `${-weekOffset}주 전 산책 지도`;

  // map
  const box = $("week-map"); box.textContent = "";
  const W = Math.max(280, box.clientWidth || 600), wide = W >= 560, tday = today();
  const H = wide ? 220 : 7 * 74 + 16;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "요일별 감정 산책 지도" }, box);
  const pts = days.map((_, i) => wide ? [44 + i * (W - 88) / 6, i % 2 ? 72 : 138] : [i % 2 ? 78 : 40, 40 + i * 74]);
  let dpath = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < 7; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; dpath += wide ? ` C ${(x0 + x1) / 2} ${y0}, ${(x0 + x1) / 2} ${y1}, ${x1} ${y1}` : ` C ${x0} ${(y0 + y1) / 2}, ${x1} ${(y0 + y1) / 2}, ${x1} ${y1}`; }
  svgEl("path", { d: dpath, class: "trail" }, svg);
  days.forEach((d, i) => {
    const [x, y] = pts[i], list = byDay[i], e = list[0];
    const g = svgEl("g", { class: e ? "stop" : "", tabindex: e ? "0" : "-1", role: e ? "button" : "presentation" }, svg);
    const dayLabel = `${DAYS[i]} ${+d.slice(8)}`;
    if (d === tday) svgEl("circle", { cx: x, cy: y, r: 27, class: "today-ring" }, g);
    if (e) {
      const n = e.emotions[0].n;
      svgEl("circle", { cx: x, cy: y, r: 20, fill: E[n][2] }, g);
      svgEl("circle", { cx: x, cy: y, r: 20, class: "ring" }, g);
      const t = svgEl("text", { x, y: y + 6, "text-anchor": "middle", "font-size": 17 }, g); t.textContent = STAMP[E[n][1]];
      list.slice(1, 4).forEach((x2, k) => svgEl("circle", { cx: x + 17 - k * 9, cy: y - 19, r: 5.5, fill: E[x2.emotions[0].n][2], stroke: "var(--surface)", "stroke-width": 2 }, g));
      g.setAttribute("aria-label", `${dayLabel}일 ${E[n][0]} · ${e.title}`);
      const open = () => openSheet(e);
      g.addEventListener("click", open); g.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); open(); } });
    } else {
      svgEl("circle", { cx: x, cy: y, r: 13, class: "empty-stop" }, g);
    }
    if (wide) {
      const above = i % 2 === 1;
      const dl = svgEl("text", { x, y: above ? y - 34 : y + 44, "text-anchor": "middle", class: "day" + (d === tday ? " today" : "") }, g); dl.textContent = d === tday ? "오늘" : dayLabel;
      if (e) { const fl = svgEl("text", { x, y: above ? y - 50 : y + 60, "text-anchor": "middle", class: "feel" }, g); fl.textContent = E[e.emotions[0].n][0]; }
    } else {
      const lx = 118;
      const dl = svgEl("text", { x: lx, y: y - 4, class: "day" + (d === tday ? " today" : "") }, g); dl.textContent = d === tday ? `오늘 · ${dayLabel}` : dayLabel;
      const fl = svgEl("text", { x: lx, y: y + 14, class: e ? "feel" : "sub" }, g);
      if (e) {
        fl.textContent = E[e.emotions[0].n][0] + (list.length > 1 ? ` 외 ${list.length - 1}` : "");
        const sub = svgEl("tspan", { class: "sub", dx: 8 }, fl);
        const room = Math.max(4, Math.floor((W - lx - 70) / 12));
        sub.textContent = e.title.length > room ? e.title.slice(0, room) + "…" : e.title;
      } else fl.textContent = d > tday ? "" : "쉬어 간 날";
    }
  });

  // stats
  const walked = byDay.filter(l => l.length).length;
  const waters = src.reduce((n, e) => n + (e.waterDays || []).filter(w => days.includes(w)).length, 0);
  const bloomedHere = src.filter(e => stageOf(e) === 3 && days.includes(bloomDay(e))).length;
  const stats = $("week-stats"); stats.textContent = "";
  for (const [v, l] of [[`${walked}/7`, "산책한 날"], [waters, "물 준 횟수"], [bloomedHere, "피어난 꽃"]]) {
    const c = document.createElement("div"); c.className = "week-stat";
    const b = document.createElement("b"); b.textContent = v; const sp = document.createElement("span"); sp.textContent = l;
    c.append(b, sp); stats.append(c);
  }

  // mood texture, weighted by intensity
  const weight = {}; let total = 0;
  for (const e of weekEntries) for (const x of e.emotions) { const m = MOODS.find(mm => mm.fams.includes(E[x.n][1])); weight[m.key] = (weight[m.key] || 0) + x.s; total += x.s; }
  const bar = $("mood-bar"), leg = $("mood-legend"); bar.textContent = ""; leg.textContent = "";
  if (!total) { const p = document.createElement("span"); p.style.flex = "1"; bar.append(p); const t = document.createElement("span"); t.textContent = "이 주에는 아직 기록이 없어요"; leg.append(t); }
  for (const m of MOODS) {
    if (!weight[m.key]) continue;
    const pct = Math.round(weight[m.key] / total * 100);
    const seg = document.createElement("span"); seg.style.flex = String(weight[m.key]); seg.style.background = m.color; seg.title = `${m.name} ${pct}%`; bar.append(seg);
    const it = document.createElement("span"); const dot = document.createElement("i"); dot.style.background = m.color;
    it.append(dot, document.createTextNode(`${m.name} ${pct}%`)); leg.append(it);
  }

  // frequent emotions
  const cnt = new Map();
  for (const e of weekEntries) for (const x of e.emotions) { const c = cnt.get(x.n) || { n: x.n, times: 0, sum: 0 }; c.times++; c.sum += x.s; cnt.set(x.n, c); }
  const emos = $("week-emos"); emos.textContent = "";
  const top = [...cnt.values()].sort((a, b) => b.times - a.times || b.sum - a.sum).slice(0, 6);
  if (!top.length) { const p = document.createElement("span"); p.className = "empty"; p.textContent = "감정을 기록하면 여기에 모여요."; emos.append(p); }
  for (const c of top) { const ch = chip(E[c.n][0], E[c.n][2], true); ch.append(document.createTextNode(` ${c.times}번`)); emos.append(ch); }

  // weekly letter
  const lb = $("week-letter-box"); lb.textContent = "";
  const wid = "week-" + days[0], w = weeks[wid], ownWeek = own && weekEntries.length > 0;
  if (w) {
    const card = document.createElement("div"); card.className = "week-letter";
    const meta = document.createElement("div"); meta.className = "label"; meta.style.color = "var(--stamp)"; meta.textContent = `정원지기의 한 주 편지 · ${md(ymd(new Date(w.at)))}`;
    const body = document.createElement("p"); body.className = "letter-body"; body.textContent = w.text;
    card.append(meta, body); lb.append(card);
    if (ownWeek) { const again = document.createElement("button"); again.type = "button"; again.className = "ghost"; again.textContent = weekPending ? "정원지기가 편지를 쓰는 중이에요…" : "편지 다시 받기"; again.disabled = weekPending; again.style.alignSelf = "flex-start"; again.onclick = () => requestWeekLetter(days, weekEntries); lb.append(again); }
  } else if (ownWeek) {
    const b = document.createElement("button"); b.type = "button"; b.className = "primary"; b.style.alignSelf = "flex-start";
    b.textContent = weekPending ? "정원지기가 편지를 쓰는 중이에요…" : "✉️ 정원지기에게 한 주 편지 받기"; b.disabled = weekPending;
    b.onclick = () => requestWeekLetter(days, weekEntries); lb.append(b);
  }
}
let weekPending = false;
function weekPrompt(days, list) {
  const lines = list.map(e => `- ${md(e.date)} (${DAYS[days.indexOf(e.date)]}): ${e.emotions.map(x => `${E[x.n][0]} ${x.s}`).join(", ")} / 제목 "${e.title}"\n  ${(e.diary || e.original || "").replace(/\s+/g, " ").slice(0, 280)}`).join("\n");
  return `너는 '감정정원'의 정원지기야. 사용자가 한 주 동안 쓴 감정 일기를 보고, 한 주를 돌아보는 짧은 편지를 써줘.

기간: ${md(days[0])} ~ ${md(days[6])}
감정 세기는 1~5야.
${lines}

규칙:
- 존댓말로, 따뜻하고 담백하게. 4~7문장, 400자 이내.
- 한 주 동안 감정이 어떻게 흘러갔는지 날짜나 요일을 짚으며 부드럽게 돌아봐 줘. 일기에 없는 사실은 지어내지 마.
- 잘 버틴 순간이나 작은 기쁨이 있었다면 알아봐 줘. 충고나 진단은 하지 마.
- 일기에 스스로를 해치고 싶다는 내용이 있으면, 혼자 견디지 말고 가까운 사람이나 자살예방상담전화 109에 이야기해 보라고 부드럽게 전해줘.
- 머리말 없이 본문만 쓰고, 마지막 줄은 "— 감정정원의 정원지기"로 끝내.
편지 본문만 답해.`;
}
function weekTemplate(days, list) {
  const walked = new Set(list.map(e => e.date)).size;
  const cnt = {}; for (const e of list) for (const x of e.emotions) cnt[x.n] = (cnt[x.n] || 0) + 1;
  const topN = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0];
  return `${md(days[0])}부터 ${md(days[6])}까지, 이번 주에는 ${walked}일 동안 정원을 산책했어요.
가장 자주 찾아온 마음은 ${E[topN][0]}이었어요.
어떤 마음이었든 그날그날 들여다보고 적어 준 덕분에 정원이 조금 더 풍성해졌어요.
다음 주에도 천천히, 편한 만큼만 걸어요.

— 감정정원의 정원지기`;
}
async function requestWeekLetter(days, list) {
  if (weekPending || !list.length) return;
  weekPending = true; render();
  let text = "", ai = false;
  if (sample) {
    try { const r = await sample(weekPrompt(days, list), { modelTier: "default" }); text = String(r.text || "").trim(); ai = !!text; }
    catch (err) { if (err && err.code === "not_granted") sample = null; }
  }
  if (!text) text = weekTemplate(days, list);
  try { await (store || localStore).setWeek("week-" + days[0], { text: text.slice(0, 2000), at: Date.now(), ai }); }
  catch (err) { setMsg($("garden-msg"), "한 주 편지를 받지 못했어요. 다시 시도해 주세요.", "err"); }
  finally { weekPending = false; render(); }
}

function renderLetters() {
  const box = $("letters"); box.textContent = "";
  const list = entries.filter(e => e.letter).sort((a, b) => b.letter.at - a.letter.at);
  const unread = list.filter(e => !e.letter.read).length;
  $("letters-stat").textContent = list.length ? (unread ? `새 편지 ${unread}통` : `${list.length}통`) : "";
  if (!list.length) {
    const p = document.createElement("p"); p.className = "empty";
    p.textContent = "씨앗이 꽃으로 피면 정원지기가 편지를 보내요. 섬의 우체통에 빨간 깃발이 올라가면 새 편지가 온 거예요.";
    box.append(p); return;
  }
  for (const e of list) {
    const b = document.createElement("button"); b.type = "button"; b.className = "letter-item";
    const dot = document.createElement("span"); dot.className = e.letter.read ? "" : "unread";
    const from = document.createElement("span"); from.className = "from"; from.textContent = `${iga(plantName(e.emotions[0].n))} 피었어요`;
    const when = document.createElement("span"); when.className = "when"; when.textContent = md(ymd(new Date(e.letter.at)));
    const peek = document.createElement("span"); peek.className = "peek"; peek.textContent = e.letter.text.split("\n").find(l => l.trim()) || "";
    b.append(dot, from, when, peek); b.onclick = () => openLetter(e); box.append(b);
  }
}
$("water-all").addEventListener("click", async () => {
  const todo = entries.filter(needsWater);
  if (!todo.length) return;
  const bloomed = [];
  try { for (const e of todo) if (await water(e) === 3) bloomed.push(plantName(e.emotions[0].n)); }
  catch (err) { setMsg($("garden-msg"), "물을 주지 못했어요. 다시 시도해 주세요.", "err"); return; }
  setMsg($("garden-msg"), bloomed.length ? `${iga(bloomed.join(", "))} 피었어요 🌸` : `${todo.length}그루에 물을 줬어요. 조금 더 자랐어요.`, "ok");
});
