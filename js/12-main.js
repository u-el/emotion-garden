// 감정정원 · 화면 다시 그리기, 식물 창, 시작
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Render ----------
function render() {
  if (g3d) g3d.update(shown()); else { readColors(); computeLayout(); kick(); }
  const own = entries.length;
  $("example-note").hidden = own > 0;
  const bloomed = entries.filter(e => stageOf(e) === 3).length;
  $("garden-stat").textContent = own ? `꽃 ${bloomed} · 자라는 중 ${own - bloomed}` : "예시";
  const thirsty = entries.filter(needsWater).length;
  const wb = $("water-all");
  wb.disabled = thirsty === 0;
  wb.textContent = thirsty ? `💧 물 주기 · ${thirsty}그루` : own ? "💧 돌봄 완료" : "💧 물 주기";
  const seen = new Set(entries.flatMap(e => e.emotions.map(x => x.n)));
  { const rares = entries.filter(e => e.rare && stageOf(e) === 3); $("guide-stat").textContent = `${TRACKED.length}종 중 ${TRACKED.filter(n => seen.has(n)).length}종 만남` + (rares.length ? ` · ✨ 희귀 꽃 ${rares.length}송이` : ""); }
  const guide = $("guide"); guide.textContent = "";
  for (const [fam, [fname, fdesc]] of Object.entries(FAMILIES)) {
    const box = document.createElement("div"); box.className = "family";
    const nm = document.createElement("div"); nm.className = "family-name"; nm.textContent = `${fname} · ${fdesc}`; box.append(nm);
    const chips = document.createElement("div"); chips.className = "chips";
    for (const [n, [name, f, col]] of Object.entries(E)) if (f === fam) chips.append(chip(name, col, seen.has(+n)));
    box.append(chips); guide.append(box);
  }
  renderLetters();
  renderWeek();
  renderBirthday();
  renderWallet();
  renderDiary();
  renderCalendar();
  renderWeather();
  setTimeout(checkStreak, 0);
  { const n = entries.length ? streakDays() : 0, gs = $("garden-stat"), base = gs.textContent.replace(/^👣 \d+일 연속 · /, ""); gs.textContent = n >= 2 ? `👣 ${n}일 연속 · ${base}` : base; }
  if (openId && $("sheet").open) { const e = shown().find(x => x.id === openId); if (e) fillSheet(e); }
}
function chip(name, col, on, s) {
  const el = document.createElement("span"); el.className = "chip" + (on ? " on" : "");
  const d = document.createElement("span"); d.className = "dot"; d.style.background = col;
  el.append(d, document.createTextNode(s ? `${name} ${"●".repeat(s)}${"○".repeat(5 - s)}` : name));
  return el;
}

// ---------- Plant sheet ----------
const sheet = $("sheet");
let openId = null;
cv.addEventListener("click", ev => {
  const r = cv.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
  let best = null, bd = 1e9;
  for (const p of layout) {
    if (x < p.x - 26 || x > p.x + 26 || y < p.base - p.vis - 30 || y > p.base + 10) continue;
    const d = Math.abs(x - p.x) + Math.abs(y - (p.base - p.vis / 2)) * 0.3;
    if (d < bd) { bd = d; best = p; }
  }
  if (best) openSheet(best.e);
});
function fillSheet(e) {
  const [y, m, d] = e.date.split("-");
  const stage = stageOf(e);
  $("sheet-date").textContent = `${y}년 ${+m}월 ${+d}일` + (e.example ? " · 예시" : "");
  $("sheet-title").textContent = e.title;
  $("sheet-stage").textContent = `${stage === 3 && e.rare ? (e.rare === "gold" ? "✨ " : "🌈 ") : ""}${bloomName(e)} · ${STAGES[stage]}` + (stage < 3 ? (e.fast && stage === 0 ? " (곧 새싹이 돋아요)" : ` (꽃까지 물 ${watersLeft(e)}번)`) : "");
  $("sheet-note").hidden = !e.note; $("sheet-note").textContent = e.note || "";
  const emos = $("sheet-emos"); emos.textContent = "";
  for (const x of e.emotions) emos.append(chip(E[x.n][0], E[x.n][2], true, x.s));
  $("sheet-diary").textContent = e.diary || "(일기 내용이 없어요)";
  $("sheet-q").hidden = !e.question; $("sheet-q").textContent = e.question ? `🌿 ${e.question}` : "";
  fillSafety($("sheet-safety"), (e.diary || "") + " " + (e.original || ""));
  const hasOrig = e.original && e.original !== e.diary;
  $("sheet-orig-box").hidden = !hasOrig; $("sheet-orig").textContent = e.original || "";
  const lb = $("sheet-letter");
  $("sheet-letter-row").hidden = !(e.letter || canGetLetter(e));
  lb.disabled = pending.has(e.id);
  lb.textContent = e.letter ? "✉️ 정원지기의 편지 읽기" : pending.has(e.id) ? "정원지기가 편지를 쓰는 중이에요…" : "✉️ 정원지기에게 편지 받기";
  const wb = $("sheet-water");
  wb.hidden = !needsWater(e); wb.disabled = false;
  $("sheet-water-done").hidden = !!e.example || stage === 3 || needsWater(e);
  $("sheet-del").hidden = !!e.example;
  $("sheet-edit").hidden = !!e.example;
}
function openSheet(e) {
  openId = e.id; fillSheet(e);
  $("sheet-view").hidden = false; $("sheet-editor").hidden = true;
  $("sheet-actions").hidden = false; $("sheet-confirm").hidden = true;
  sheet.showModal();
}
// ----- editing a planted diary -----
let edit = null;
function renderEdEmos() {
  const box = $("ed-emos"); box.textContent = "";
  edit.emotions.forEach((x, i) => {
    const row = document.createElement("div"); row.className = "emo-row";
    const nm = document.createElement("span"); nm.className = "name";
    const d = document.createElement("span"); d.className = "dot"; d.style.background = E[x.n][2];
    nm.append(d, document.createTextNode(E[x.n][0] + (i === 0 ? " · 주된 감정" : "")));
    const lv = document.createElement("span"); lv.className = "lv"; lv.setAttribute("role", "group"); lv.setAttribute("aria-label", E[x.n][0] + " 세기");
    for (let s2 = 1; s2 <= 5; s2++) { const b = document.createElement("button"); b.type = "button"; b.textContent = s2; b.setAttribute("aria-pressed", String(s2 === x.s)); b.onclick = () => { x.s = s2; renderEdEmos(); }; lv.append(b); }
    const rm = document.createElement("button"); rm.type = "button"; rm.className = "ghost x"; rm.textContent = "빼기"; rm.disabled = edit.emotions.length <= 1;
    rm.onclick = () => { edit.emotions.splice(i, 1); renderEdEmos(); renderEdPicker(!$("ed-picker").hidden); };
    row.append(nm, lv, rm); box.append(row);
  });
  $("ed-add").hidden = edit.emotions.length >= 3;
}
function renderEdPicker(open) {
  const p = $("ed-picker"); p.hidden = !open; p.textContent = ""; if (!open) return;
  for (const [fam, [fname]] of Object.entries(FAMILIES)) {
    const chips = document.createElement("div"); chips.className = "chips";
    for (const [n, [name, f, col]] of Object.entries(E)) {
      if (f !== fam) continue;
      const on = edit.emotions.some(x => x.n === +n);
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-pressed", String(on));
      const d = document.createElement("span"); d.className = "dot"; d.style.background = col; b.append(d, document.createTextNode(name));
      b.disabled = (!on && edit.emotions.length >= 3) || (on && edit.emotions.length <= 1);
      b.onclick = () => { const i = edit.emotions.findIndex(x => x.n === +n); if (i >= 0) edit.emotions.splice(i, 1); else if (edit.emotions.length < 3) edit.emotions.push({ n: +n, s: 3 }); renderEdEmos(); renderEdPicker(true); };
      chips.append(b);
    }
    const fl = document.createElement("div"); fl.className = "family-name"; fl.textContent = fname; p.append(fl, chips);
  }
}
$("sheet-edit").onclick = () => {
  const e = entries.find(x => x.id === openId); if (!e) return;
  edit = { id: e.id, emotions: e.emotions.map(x => ({ ...x })) };
  $("ed-title").value = e.title; $("ed-diary").value = e.diary || "";
  setMsg($("ed-msg"), ""); renderEdEmos(); renderEdPicker(false);
  $("sheet-view").hidden = true; $("sheet-editor").hidden = false; $("ed-title").focus();
};
$("ed-add").onclick = () => renderEdPicker($("ed-picker").hidden);
$("ed-cancel").onclick = () => { edit = null; $("sheet-editor").hidden = true; $("sheet-view").hidden = false; };
$("ed-save").onclick = async () => {
  if (!edit) return;
  const title = $("ed-title").value.trim().slice(0, 40), diary = $("ed-diary").value.trim();
  if (!title) { setMsg($("ed-msg"), "제목을 적어 주세요.", "err"); $("ed-title").focus(); return; }
  try {
    await (store || localStore).update(edit.id, { title, diary, emotions: edit.emotions.map(x => ({ n: x.n, s: x.s })), v: 2 });
    edit = null; $("sheet-editor").hidden = true; $("sheet-view").hidden = false;
    const e = entries.find(x => x.id === openId); if (e) fillSheet(e);
    setMsg($("garden-msg"), "일기를 고쳤어요.", "ok");
  } catch (err) { setMsg($("ed-msg"), "저장하지 못했어요. 다시 시도해 주세요.", "err"); }
};
$("sheet-water").onclick = async () => {
  const e = entries.find(x => x.id === openId); if (!e || !needsWater(e)) return;
  try { const st = await water(e); setMsg($("garden-msg"), st === 3 ? `${iga(plantName(e.emotions[0].n))} 피었어요 🌸` : `${STAGES[st]}로 자랐어요.`, "ok"); }
  catch (err) { setMsg($("garden-msg"), "물을 주지 못했어요. 다시 시도해 주세요.", "err"); }
};
$("sheet-letter").onclick = () => {
  const e = entries.find(x => x.id === openId); if (!e) return;
  if (e.letter) openLetter(e); else if (canGetLetter(e)) { deliverLetter(e); fillSheet(e); }
};
$("sheet-close").onclick = () => sheet.close();
sheet.addEventListener("click", ev => { if (ev.target === sheet) sheet.close(); });
$("sheet-del").onclick = () => { $("sheet-actions").hidden = true; $("sheet-confirm").hidden = false; };
$("del-no").onclick = () => { $("sheet-actions").hidden = false; $("sheet-confirm").hidden = true; };
$("del-yes").onclick = async () => {
  const id = openId; sheet.close();
  try { await (store || localStore).remove(id); setMsg($("garden-msg"), "식물을 뽑았어요.", ""); } catch (e) { setMsg($("garden-msg"), "뽑지 못했어요. 다시 시도해 주세요.", "err"); }
};

// ---------- Boot ----------
let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(render, 120); });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", render);
new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
render();
initStore();
