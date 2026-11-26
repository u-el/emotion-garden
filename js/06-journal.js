// 감정정원 · 마음 안전 안내, 오늘의 질문, 일기장, 감정 달력, 연속 산책, 숨은 찾기, 첫 안내
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Safety: gentle help when a diary mentions self-harm (works without AI) ----------
const RISK = /(죽고\s*싶|자살|자해|사라지고\s*싶|없어지고\s*싶|살기\s*싫|살고\s*싶지\s*않|목숨을\s*끊|끝내고\s*싶|극단적\s*선택|죽어\s*버리|뛰어내리|손목을)/;
function fillSafety(el, text) {
  const show = RISK.test(String(text || ""));
  el.hidden = !show; el.textContent = "";
  if (!show) return;
  const b = document.createElement("b"); b.textContent = "혼자 견디지 않아도 괜찮아요";
  const p = document.createElement("span"); p.textContent = "지금 마음이 많이 힘들다면, 이야기를 들어 줄 사람과 연결될 수 있어요. 24시간 전화할 수 있어요.";
  const ul = document.createElement("ul");
  for (const [num, label] of [["109", "자살예방상담전화"], ["1577-0199", "정신건강위기상담전화"], ["1388", "청소년상담전화 (문자 #1388)"], ["119 · 112", "지금 위험하다면"]]) {
    const li = document.createElement("li"); const n = document.createElement("span"); n.className = "num"; n.textContent = num;
    li.append(n, document.createTextNode(" " + label)); ul.append(li);
  }
  el.append(b, p, ul);
}
$("walk-input").addEventListener("input", () => { if ($("reading").hidden) return; fillSafety($("r-safety"), $("walk-input").value); });

// ---------- Today's question from the gardener ----------
const QUESTIONS = [
  "오늘 고마웠던 작은 일 하나는 무엇이었나요?", "오늘 가장 오래 머문 감정은 무엇이었나요?", "오늘 나를 웃게 한 순간이 있었나요?",
  "요즘 자주 떠오르는 사람이 있나요?", "오늘 몸은 어땠나요? 피곤했나요, 가벼웠나요?", "오늘 하고 싶었지만 못 한 말이 있나요?",
  "오늘 나에게 해 주고 싶은 말은?", "오늘 하루를 날씨로 표현하면 어떤 날씨였나요?", "요즘 나를 가장 지치게 하는 것은 무엇인가요?",
  "오늘 먹은 것 중에 기억에 남는 게 있나요?", "오늘 누군가에게 받은 다정함이 있었나요?", "오늘 스스로 잘했다고 느낀 순간은?",
  "요즘 기다리고 있는 일이 있나요?", "오늘 마음이 쿵 내려앉은 순간이 있었나요?", "오늘 들은 말 중에 마음에 남은 말은?",
  "지금 이 순간 가장 원하는 건 무엇인가요?", "오늘 내 마음을 가장 흔든 일은 무엇이었나요?", "어제의 나와 오늘의 나는 무엇이 달랐나요?",
  "요즘 내가 아끼는 작은 습관이 있나요?", "오늘 걱정했던 일은 실제로 어땠나요?", "오늘 본 풍경 중에 기억하고 싶은 장면은?",
  "최근에 마음이 편안했던 장소는 어디였나요?", "오늘 미뤄 둔 감정이 있다면 어떤 감정인가요?", "오늘 하루, 나에게 몇 점을 주고 싶나요? 왜인가요?",
  "누군가에게 서운했던 일이 있었나요?", "오늘 새로 알게 된 것이 있나요?", "요즘 나를 설레게 하는 것은 무엇인가요?",
  "오늘 혼자 있는 시간은 어땠나요?", "지금 내려놓고 싶은 것이 있나요?", "오늘 가장 나다웠던 순간은 언제였나요?",
  "요즘 자주 듣는 노래가 있나요? 어떤 기분일 때 듣나요?", "오늘 나를 화나게 한 일이 있었다면, 그 밑에는 어떤 마음이 있었을까요?",
  "내일의 나에게 부탁하고 싶은 것은?", "오늘 참았던 것이 있다면 무엇인가요?", "요즘 내가 고마운 사람은 누구인가요?",
  "오늘 가장 조용했던 순간은 언제였나요?", "최근에 용기를 낸 일이 있나요?", "오늘 하루를 한 단어로 표현한다면?",
  "어린 시절의 나에게 지금 해 주고 싶은 말은?", "오늘 마음속에 핀 꽃이 있다면 어떤 꽃일까요?",
];
let qIdx = Math.floor(hash(today() + "q") * QUESTIONS.length), qUsed = null;
function showQuestion() { $("q-text").textContent = QUESTIONS[qIdx % QUESTIONS.length]; }
showQuestion();
$("q-next").onclick = () => { qIdx = (qIdx + 1) % QUESTIONS.length; showQuestion(); if (qUsed) { qUsed = QUESTIONS[qIdx]; $("walk-input").placeholder = qUsed; } };
$("q-use").onclick = () => { qUsed = QUESTIONS[qIdx % QUESTIONS.length]; $("walk-input").placeholder = qUsed + " 떠오르는 대로 적어 보세요."; $("walk-input").focus(); };

// ---------- Diary book: list and search ----------
let diaryLimit = 10;
$("diary-search").addEventListener("input", () => { diaryLimit = 10; renderDiary(); });
$("diary-more").onclick = () => { diaryLimit += 10; renderDiary(); };
function hl(text, q) {
  const frag = document.createDocumentFragment();
  if (!q) { frag.append(text); return frag; }
  const low = text.toLowerCase(), ql = q.toLowerCase(); let i = 0, j;
  while ((j = low.indexOf(ql, i)) >= 0) { frag.append(text.slice(i, j)); const m = document.createElement("mark"); m.textContent = text.slice(j, j + q.length); frag.append(m); i = j + q.length; }
  frag.append(text.slice(i)); return frag;
}
function renderDiary() {
  const q = $("diary-search").value.trim(), box = $("diary-list"); box.textContent = "";
  const all = entries.slice().sort((a, b) => (b.date + String(b.createdAt || 0).padStart(15, "0")).localeCompare(a.date + String(a.createdAt || 0).padStart(15, "0")));
  const list = q ? all.filter(e => [e.title, e.diary, e.original, e.question, ...e.emotions.map(x => E[x.n][0])].some(t => t && String(t).toLowerCase().includes(q.toLowerCase()))) : all;
  $("diary-stat").textContent = all.length ? (q ? `${list.length}편 찾음` : `${all.length}편`) : "";
  if (!all.length) { const p = document.createElement("p"); p.className = "empty"; p.textContent = "씨앗을 심으면 그날의 일기가 여기에 차곡차곡 모여요."; box.append(p); $("diary-more").hidden = true; return; }
  if (!list.length) { const p = document.createElement("p"); p.className = "empty"; p.textContent = `"${q}"이(가) 들어간 일기가 없어요.`; box.append(p); $("diary-more").hidden = true; return; }
  for (const e of list.slice(0, diaryLimit)) {
    const b = document.createElement("button"); b.type = "button"; b.className = "diary-item";
    const top = document.createElement("div"); top.className = "diary-top";
    const t = document.createElement("span"); t.className = "diary-title"; t.append(hl(e.title, q));
    const d = document.createElement("span"); d.className = "diary-date"; const [y, m, dd] = e.date.split("-"); d.textContent = `${y}. ${+m}. ${+dd}.`;
    top.append(t, d);
    const em = document.createElement("div"); em.className = "diary-emos";
    for (const x of e.emotions) { const sp = document.createElement("span"); const i = document.createElement("i"); i.style.background = E[x.n][2]; sp.append(i, hl(E[x.n][0], q)); em.append(sp); }
    const body = String(e.diary || e.original || "").replace(/\s+/g, " ");
    const pk = document.createElement("div"); pk.className = "diary-peek";
    if (q && body.toLowerCase().includes(q.toLowerCase())) { const at = body.toLowerCase().indexOf(q.toLowerCase()); pk.append(hl((at > 18 ? "…" : "") + body.slice(Math.max(0, at - 18), at + 60), q)); }
    else pk.textContent = body.slice(0, 80) || "(일기 내용이 없어요)";
    b.append(top, em, pk); b.onclick = () => openSheet(e); box.append(b);
  }
  $("diary-more").hidden = list.length <= diaryLimit;
}

// ---------- Emotion calendar ----------
let calOffset = 0;
$("cal-prev").onclick = () => { calOffset--; renderCalendar(); };
$("cal-next").onclick = () => { if (calOffset < 0) { calOffset++; renderCalendar(); } };
function renderCalendar() {
  const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + calOffset);
  const Y = base.getFullYear(), M = base.getMonth(), days = new Date(Y, M + 1, 0).getDate(), lead = (new Date(Y, M, 1).getDay() + 6) % 7;
  $("cal-range").textContent = `${Y}년 ${M + 1}월`; $("cal-next").disabled = calOffset >= 0;
  const box = $("cal"); box.textContent = "";
  for (const d of DAYS) { const h = document.createElement("div"); h.className = "dow"; h.textContent = d; box.append(h); }
  for (let i = 0; i < lead; i++) { const c = document.createElement("div"); c.className = "day out"; box.append(c); }
  const src = shown(), tday = today(), cnt = {}; let walked = 0;
  for (let d = 1; d <= days; d++) {
    const key = `${Y}-${pad(M + 1)}-${pad(d)}`, list = src.filter(e => e.date === key);
    const c = document.createElement(list.length ? "button" : "div"); c.className = "day" + (list.length ? " has" : "") + (key === tday ? " today" : "");
    const num = document.createElement("span"); num.textContent = d; c.append(num);
    if (list.length) {
      walked++;
      const main = list.reduce((a, e) => (e.emotions[0].s > a.emotions[0].s ? e : a), list[0]), n = main.emotions[0].n;
      c.style.background = `color-mix(in srgb, ${E[n][2]} 70%, var(--surface))`;
      const ic = document.createElement("span"); ic.className = "emo-ic"; ic.textContent = STAMP[E[n][1]]; c.append(ic);
      if (list.length > 1) { const mo = document.createElement("span"); mo.className = "more"; mo.textContent = `+${list.length - 1}`; c.append(mo); }
      c.type = "button"; c.setAttribute("aria-label", `${M + 1}월 ${d}일 ${list.map(e => E[e.emotions[0].n][0]).join(", ")}`);
      c.onclick = () => openSheet(main);
      for (const e of list) for (const x of e.emotions) cnt[x.n] = (cnt[x.n] || 0) + 1;
    }
    box.append(c);
  }
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => E[n][0]);
  renderMonthLetter(Y, M);
  $("cal-summary").textContent = walked ? `이 달에는 ${walked}일 산책했어요.` + (top.length ? ` 자주 찾아온 마음: ${top.join(", ")}` : "") : "이 달에는 아직 기록이 없어요. 날짜를 누르면 그날의 일기가 열려요.";
}

// ---------- Walking streak and rewards ----------
const STREAK_REWARDS = [
  { d: 3, petals: 10, label: "3일 연속 산책" },
  { d: 7, decor: "pinwheel", label: "7일 연속 산책" },
  { d: 14, petals: 30, label: "14일 연속 산책" },
  { d: 30, decor: "startree", label: "30일 연속 산책" },
];
function streakDays() {
  const act = new Set(entries.flatMap(e => [e.date, ...(e.waterDays || [])]));
  const d = new Date(); if (!act.has(ymd(d))) d.setDate(d.getDate() - 1);
  let n = 0; while (act.has(ymd(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
let claiming = false;
async function checkStreak() {
  if (claiming || !store || !entries.length) return;
  const n = streakDays(), claimed = (profile && profile.streakClaimed) || {};
  const due = STREAK_REWARDS.find(r => n >= r.d && !claimed[r.d]);
  if (!due) return;
  claiming = true;
  try {
    const patch = { streakClaimed: { ...claimed, [due.d]: true } };
    if (due.decor) { const st = decorState(); st.owned[due.decor] = 1; if (!st.placed.some(x => x.id === due.decor)) st.placed.push({ uid: newUid(), id: due.decor, ...spotToPolar(due.decor), rot: 0 }); patch.owned = st.owned; patch.placed = st.placed; }
    await saveProfile(patch);
    const dd = due.decor && DECOR.find(x => x.id === due.decor);
    if (due.petals) earn(due.petals, `${due.label} 선물`);
    Music.sfx("bloom");
    setMsg($("garden-msg"), `👣 ${due.label}! ${dd ? `${dd.icon} ${eul(dd.name)} 선물로 받았어요. 정원에 놓였어요.` : `꽃잎 ${due.petals}장을 선물로 받았어요.`}`, "ok");
    if (g3d && dd) g3d.tip(`👣 ${due.label} 선물 · ${dd.icon} ${dd.name}`, true);
  } catch (e) {} finally { claiming = false; }
}

// ---------- Hidden things on the walk ----------
const NOTES = [
  "천천히 가도 괜찮아요. 꽃도 하루아침에 피지 않으니까요.", "오늘 하루를 버텨 낸 당신, 그걸로 충분해요.", "마음에도 쉬는 날이 필요해요.",
  "흐린 날이 있어야 맑은 날이 더 반가워요.", "당신이 느끼는 모든 마음은 이유가 있어요.", "작은 기쁨을 알아보는 눈이 당신에게 있어요.",
  "잘하지 않아도 돼요. 그냥 오늘을 살아 낸 걸로 충분해요.", "누군가에게 당신은 이미 고마운 사람이에요.", "울고 싶은 날엔 울어도 괜찮아요.",
  "내일의 걱정은 내일의 정원지기에게 맡겨요.", "당신의 속도로 걸으면 돼요.", "가끔은 아무것도 하지 않는 것도 돌봄이에요.",
  "지나간 마음도 이 정원에서는 거름이 돼요.", "오늘의 당신에게 작은 박수를 보내요.", "바람이 불어도 뿌리는 단단해요.",
];
const hunt = () => (profile && profile.hunt && profile.hunt.date === today()) ? profile.hunt : { date: today() };
async function whaleHello() {
  Music.sfx("whale");
  if (!entries.length) { if (g3d) g3d.tip("🐋 하늘고래가 인사해요", true); return; }
  if (profile && profile.whaleDay === today()) { if (g3d) g3d.tip("🐋 하늘고래가 반갑게 꼬리를 흔들어요", true); return; }
  try { await saveProfile({ whaleDay: today() }); earn(3, "하늘고래의 선물 🐋"); } catch (e) {}
}
async function foundHidden(kind) {
  const h = hunt(); if (h[kind]) return;
  try { await saveProfile({ hunt: { ...h, [kind]: true } }); } catch (e) { return; }
  if (kind === "clover") { earn(3, "네잎클로버를 찾았어요 🍀"); Music.sfx("collect"); }
  else { earn(2, ""); Music.sfx("letter"); showPaper(`${md(today())} · 산책길에서 주운 쪽지`, "📜 누군가 남긴 쪽지", "📜", NOTES[Math.floor(hash(today() + "note") * NOTES.length)] + "\n\n— 감정정원의 정원지기", false); }
}

// ---------- First-visit guide ----------
const GUIDE = [
  { art: "✍️", title: "오늘의 마음을 적어요", body: "오늘 있었던 일과 느낌을 편하게 적어요.\n정원지기가 감정을 읽고 어울리는 씨앗을 골라줘요.\n막막하면 '오늘의 질문'에 답해 보세요." },
  { art: "🌱", title: "씨앗을 심고 물을 줘요", body: "하루 한 번 물을 주면 씨앗 → 새싹 → 꽃봉오리 → 꽃으로 자라요.\n꽃이 피면 정원지기의 편지가 와요.\n첫 씨앗은 3분 뒤에 새싹이 돋아요." },
  { art: "🏝️", title: "정원을 둘러봐요", body: "섬을 손가락으로 돌려 보고, 꽃을 누르면 그날의 일기가 열려요.\n떨어지는 반짝이는 꽃잎을 모아 정원을 꾸미고,\n섬 안으로 들어가 산책하며 숨은 네잎클로버도 찾아보세요." },
];
let guideStep = 0;
function renderGuide() {
  const g = GUIDE[guideStep];
  $("guide-art").textContent = g.art; $("guide-step-title").textContent = g.title; $("guide-step-body").textContent = g.body;
  $("guide-dots").textContent = ""; GUIDE.forEach((_, i) => { const d = document.createElement("span"); if (i === guideStep) d.className = "on"; $("guide-dots").append(d); });
  $("guide-prev").hidden = guideStep === 0; $("guide-next").textContent = guideStep === GUIDE.length - 1 ? "시작하기" : "다음";
}
function closeGuide() { $("guide-dlg").close(); try { localStorage.setItem("emotion-garden-guided", "1"); } catch (e) {} }
function openGuide() { guideStep = 0; renderGuide(); $("guide-dlg").showModal(); }
$("guide-next").onclick = () => { if (guideStep < GUIDE.length - 1) { guideStep++; renderGuide(); } else { closeGuide(); $("walk-input").focus(); } };
$("guide-prev").onclick = () => { if (guideStep > 0) { guideStep--; renderGuide(); } };
$("guide-skip").onclick = closeGuide;
$("help-btn").onclick = openGuide;
$("peek-btn").onclick = () => { const g = $("garden3d").hidden ? $("garden-title") : $("garden3d"); g.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" }); };
setTimeout(() => {
  let seen = false; try { seen = localStorage.getItem("emotion-garden-guided") === "1"; } catch (e) {}
  if (!seen && !entries.length && !document.querySelector("dialog[open]")) openGuide();
}, 2500);
