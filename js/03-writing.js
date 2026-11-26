// 감정정원 · 감정 읽기(정원지기), 감정 고르기, 씨앗 심기, 희귀 꽃, 물 주기
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Reading emotions ----------
const EMO_LIST = Object.entries(E).map(([n, v]) => `${pad(n)}:${v[0]}`).join(", ");
function buildPrompt(text) {
  return `너는 '감정정원'의 정원지기야. 사용자가 오늘 쓴 글을 읽고 그 안의 감정을 읽어줘.

감정 목록(번호:이름): ${EMO_LIST}

규칙:
- 글에 드러난 감정을 강한 순서로 1~3개 골라 번호로 적어. 도저히 알 수 없으면 52(미확인).
- 세기는 1(아주 약함)~5(아주 강함).
- "일기": 사용자의 글을 바탕으로 사용자 본인이 쓴 1인칭 일기로 다듬어 3~6문장. 반말 일기체. 글에 없는 사건을 지어내지 말고, 느낀 감정에 부드럽게 이름을 붙여줘.
- "제목": 일기 제목, 15자 이내.
- "한마디": 정원지기가 건네는 따뜻한 한마디, 40자 이내. 충고나 진단 대신 공감.
- 글에 스스로를 해치고 싶다는 내용이 있으면, 한마디에서 혼자 견디지 말고 가까운 사람이나 자살예방상담전화 109에 이야기해 보라고 부드럽게 전해줘.

JSON 하나로만 답해:
{"감정":[{"번호":9,"세기":4}],"제목":"...","일기":"...","한마디":"..."}

${qUsed ? `사용자는 정원지기의 질문 "${qUsed}"에 답하며 썼어.

` : ""}사용자의 글:
"""
${text}
"""`;
}
function normEmos(list) {
  if (!Array.isArray(list)) list = [list];
  const out = [];
  for (const e of list.slice(0, 3)) {
    let n, s = 3;
    if (e && typeof e === "object") { n = e["번호"] ?? e.n ?? e["감정"]; s = e["세기"] ?? e.s ?? 3; } else n = e;
    if (typeof n === "string" && !/^\d+$/.test(n.trim())) n = NAME_TO_NUM[n.replace(/\s/g, "")] || UNKNOWN;
    n = parseInt(n, 10); if (!E[n]) n = UNKNOWN;
    if (!out.some(x => x.n === n)) out.push({ n, s: clamp(parseInt(s, 10) || 3, 1, 5) });
  }
  return out.length ? out : [{ n: UNKNOWN, s: 3 }];
}

let draft = null; // { emotions, title, diary, note, original }
$("read-btn").addEventListener("click", async () => {
  const text = $("walk-input").value.trim();
  const msg = $("write-msg");
  if (text.length < 5) { setMsg(msg, "조금만 더 적어 주세요. 한두 문장이면 충분해요.", "err"); return; }
  if (!sample) {
    if (!sampleChecked) { setMsg(msg, "정원지기를 부르는 중이에요. 잠시 뒤 다시 눌러 주세요.", ""); return; }
    draft = readByWords(text);
    setMsg(msg, "📖 마음 단어를 보고 감정을 골랐어요. 마음과 다르면 고쳐 주세요.", "");
    showReading(); return;
  }
  $("read-btn").disabled = true; setMsg(msg, "정원지기가 글을 읽고 있어요…");
  try {
    const r = await sample.json(buildPrompt(text), { modelTier: "default" });
    draft = {
      emotions: normEmos(r["감정"] || r.emotions || []),
      title: String(r["제목"] || "").slice(0, 40),
      diary: String(r["일기"] || text),
      note: String(r["한마디"] || ""),
      original: text,
    };
    if (!draft.title) draft.title = E[draft.emotions[0].n][0] + "의 하루";
    setMsg(msg, "");
    showReading();
  } catch (e) {
    const code = e && e.code;
    if (code === "not_granted") { sample = null; draft = readByWords(text); setMsg(msg, "📖 정원지기 대신 마음 단어를 보고 감정을 골랐어요. 마음과 다르면 고쳐 주세요.", ""); showReading(); }
    else if (code === "rate_limited") setMsg(msg, "정원지기가 잠시 쉬는 중이에요. 조금 뒤에 다시 눌러 주세요.", "err");
    else if (code !== "cancelled") { draft = readByWords(text); setMsg(msg, "📖 정원지기와 연결이 잠시 안 돼서, 마음 단어를 보고 감정을 골랐어요.", ""); showReading(); }
  } finally { $("read-btn").disabled = false; }
});
$("pick-btn").addEventListener("click", openManual);
function openManual() {
  const text = $("walk-input").value.trim();
  draft = { emotions: [], title: "", diary: text, note: "", original: text };
  showReading(); renderPicker(true);
}

function showReading() {
  $("reading").hidden = false;
  if (qUsed && draft && !draft.question) draft.question = qUsed;
  fillSafety($("r-safety"), draft.original + " " + draft.diary);
  $("r-note").hidden = !draft.note; $("r-note").textContent = draft.note;
  $("r-title").value = draft.title; $("r-diary").value = draft.diary;
  setMsg($("plant-msg"), "");
  renderDraftEmos(); renderPicker(false);
  $("reading").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}
function renderDraftEmos() {
  const box = $("r-emos"); box.textContent = "";
  $("seed-title").textContent = draft.emotions.length ? seedName(draft.emotions[0].n) : "감정을 골라 주세요";
  draft.emotions.forEach((x, i) => {
    const row = document.createElement("div"); row.className = "emo-row";
    const nm = document.createElement("span"); nm.className = "name";
    const d = document.createElement("span"); d.className = "dot"; d.style.background = E[x.n][2];
    nm.append(d, document.createTextNode(E[x.n][0] + (i === 0 ? " · 주된 감정" : "")));
    const lv = document.createElement("span"); lv.className = "lv"; lv.setAttribute("role", "group"); lv.setAttribute("aria-label", E[x.n][0] + " 세기");
    for (let s = 1; s <= 5; s++) {
      const b = document.createElement("button"); b.type = "button"; b.textContent = s;
      b.setAttribute("aria-pressed", String(s === x.s)); b.onclick = () => { x.s = s; renderDraftEmos(); };
      lv.append(b);
    }
    const rm = document.createElement("button"); rm.type = "button"; rm.className = "ghost x"; rm.textContent = "빼기";
    rm.onclick = () => { draft.emotions.splice(i, 1); renderDraftEmos(); renderPicker(!$("picker").hidden); };
    row.append(nm, lv, rm); box.append(row);
  });
  $("r-add").hidden = draft.emotions.length >= 3;
}
function renderPicker(open) {
  const p = $("picker"); p.hidden = !open; p.textContent = "";
  if (!open) return;
  const lab = document.createElement("div"); lab.className = "label"; lab.textContent = "감정은 3개까지 고를 수 있어요. 먼저 고른 감정이 씨앗이 돼요."; p.append(lab);
  for (const [fam, [fname]] of Object.entries(FAMILIES)) {
    const chips = document.createElement("div"); chips.className = "chips";
    for (const [n, [name, f, col]] of Object.entries(E)) {
      if (f !== fam) continue;
      const on = draft.emotions.some(x => x.n === +n);
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-pressed", String(on));
      const d = document.createElement("span"); d.className = "dot"; d.style.background = col;
      b.append(d, document.createTextNode(name));
      b.disabled = !on && draft.emotions.length >= 3;
      b.onclick = () => {
        const i = draft.emotions.findIndex(x => x.n === +n);
        if (i >= 0) draft.emotions.splice(i, 1); else if (draft.emotions.length < 3) draft.emotions.push({ n: +n, s: 3 });
        renderDraftEmos(); renderPicker(true);
      };
      chips.append(b);
    }
    const fl = document.createElement("div"); fl.className = "family-name"; fl.textContent = fname;
    p.append(fl, chips);
  }
}
$("r-add").addEventListener("click", () => renderPicker($("picker").hidden));
$("cancel-btn").addEventListener("click", () => { draft = null; $("reading").hidden = true; $("walk-input").focus(); });
$("plant-btn").addEventListener("click", async () => {
  if (!draft) return;
  const msg = $("plant-msg");
  if (!draft.emotions.length) { setMsg(msg, "감정을 하나 이상 골라 주세요.", "err"); renderPicker(true); return; }
  const first = entries.length === 0, plantedToday = entries.filter(x => x.date === today()).length;
  const entry = {
    id: newId(), v: 2, date: today(), createdAt: Date.now(), waterDays: [today()], ...(first ? { fast: true } : {}), ...rollRare(draft.emotions[0].s),
    emotions: draft.emotions.map(x => ({ n: x.n, s: x.s })),
    title: ($("r-title").value.trim() || E[draft.emotions[0].n][0] + "의 하루").slice(0, 40),
    diary: $("r-diary").value.trim(), note: draft.note, original: draft.original, ...(draft.question ? { question: draft.question } : {}),
  };
  try { await (store || localStore).add(entry); Music.sfx("plant"); if (plantedToday < 2) earn(5, "씨앗을 심었어요"); }
  catch (e) { setMsg(msg, "심지 못했어요. 새로고침한 뒤 다시 시도해 주세요.", "err"); return; }
  draft = null; $("reading").hidden = true; $("walk-input").value = ""; qUsed = null; $("walk-input").placeholder = "오늘 어떤 일이 있었나요? 떠오르는 대로 편하게 적어 보세요.";
  try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
  setMsg($("write-msg"), "");
  setMsg($("garden-msg"), first ? `${seedName(entry.emotions[0].n)}을 심었어요. 첫 씨앗이라 3분 뒤에 새싹이 돋아요 🌱` : `${seedName(entry.emotions[0].n)}을 심었어요. 내일부터 물을 주면 자라요.`, "ok");
  $("garden-title").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
});

// ---------- Rare flowers ----------
// decided quietly when the seed is planted, revealed when it blooms
function rollRare(s) { const r = Math.random(); if (r < 0.015) return { rare: "rainbow" }; if (r < (s >= 5 ? 0.3 : 0.04) + 0.015) return { rare: "gold" }; return {}; }
const rareName = e => e.rare === "gold" ? "금빛 " : e.rare === "rainbow" ? "무지개 " : "";
const bloomName = e => `${E[e.emotions[0].n][0]}의 ${stageOf(e) === 3 ? rareName(e) : ""}${FAMILIES[E[e.emotions[0].n][1]][0]}`;

// ---------- Watering ----------
async function water(e) {
  const days = [...(e.waterDays || []), today()];
  await (store || localStore).update(e.id, { waterDays: days });
  const st = stageOf({ ...e, waterDays: days });
  Music.sfx(st === 3 ? "bloom" : "water");
  if (!e.example) earn(st === 3 ? (e.rare ? 11 : 6) : 1, st === 3 ? (e.rare ? `${e.rare === "gold" ? "✨" : "🌈"} 희귀한 ${rareName(e)}꽃이 피었어요!` : "꽃이 피었어요") : "");
  if (st === 3) deliverLetter({ ...e, waterDays: days });
  return st;
}
