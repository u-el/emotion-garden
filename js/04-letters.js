// 감정정원 · 꽃 편지, 편지지, 생일꽃
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Gardener's letters ----------
const eul = w => { const c = w.charCodeAt(w.length - 1); return w + (c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 ? "을" : "를"); };
const iga = w => { const c = w.charCodeAt(w.length - 1); return w + (c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 ? "이" : "가"); };
const md = d => { const [, m, dd] = String(d).split("-"); return `${+m}월 ${+dd}일`; };
const pending = new Set();
function letterPrompt(e) {
  const emos = e.emotions.map(x => `${E[x.n][0]}(세기 ${x.s})`).join(", ");
  return `너는 '감정정원'의 정원지기야. 사용자가 며칠 전 심은 감정 씨앗이 오늘 꽃으로 피었어. 그 사람에게 짧은 편지를 써줘.

- 심은 날: ${md(e.date)}
- 그날의 감정: ${emos}
- 피어난 꽃: ${plantName(e.emotions[0].n)}
- 물을 준 날: ${(e.waterDays || []).filter(d => /^\d{4}-/.test(d)).map(md).join(", ")}
- 오늘: ${md(today())}
- 그날의 일기 제목: ${e.title}
- 그날의 일기:
"""
${(e.diary || e.original || "").slice(0, 1500)}
"""

규칙:
- 존댓말로, 따뜻하고 담백하게. 5~8문장, 350자 이내.
- 꽃이 피었다는 소식으로 시작하고, 그날의 감정을 다시 떠올려 줘. 일기에 없는 사실은 지어내지 마.
- 며칠이 지난 지금 그 마음은 어떤지 부드럽게 물어봐 줘. 충고나 진단은 하지 마.
- 일기에 스스로를 해치고 싶다는 내용이 있으면, 혼자 견디지 말고 가까운 사람이나 자살예방상담전화 109에 이야기해 보라고 부드럽게 전해줘.
- 머리말 없이 본문만 쓰고, 마지막 줄은 "— 감정정원의 정원지기"로 끝내.
편지 본문만 답해.`;
}
function templateLetter(e) {
  const flower = plantName(e.emotions[0].n), feel = E[e.emotions[0].n][0];
  const care = Math.max(1, (e.waterDays || []).length - 1);
  return `${iga(flower)} 피었어요.

${md(e.date)}, '${e.title}'(이)라고 적었던 날 심은 씨앗이에요. 그날 마음 한쪽에 있던 ${feel}을(를) 기억해요.
${care}번의 물을 주며 돌봐준 덕분에 오늘 꽃이 되었어요.

며칠이 지난 지금, 그 마음은 어떤가요? 어떤 마음이든 이 정원에서는 꽃이 될 수 있어요.
오늘의 마음도 편하게 들려주세요.

— 감정정원의 정원지기`;
}
async function deliverLetter(e) {
  if (e.example || e.letter || pending.has(e.id)) return;
  pending.add(e.id);
  let text = "", ai = false;
  if (sample) {
    try { const r = await sample(letterPrompt(e), { modelTier: "default" }); text = String(r.text || "").trim(); ai = !!text; }
    catch (err) { if (err && err.code === "not_granted") sample = null; }
  }
  if (!text) text = templateLetter(e);
  try {
    await (store || localStore).update(e.id, { letter: { text: text.slice(0, 2000), at: Date.now(), read: false, ai } });
    setMsg($("garden-msg"), `✉️ 정원지기의 편지가 도착했어요. 우체통이나 편지함에서 읽어 보세요.`, "ok");
    setTimeout(() => Music.sfx("letter"), 900);
    if (g3d) g3d.tip("✉️ 정원지기의 편지가 도착했어요");
  } catch (err) { setMsg($("garden-msg"), "편지를 받지 못했어요. 그날의 식물을 눌러 다시 받아 보세요.", "err"); }
  finally { pending.delete(e.id); render(); }
}
const canGetLetter = e => !e.example && !e.letter && Array.isArray(e.waterDays) && e.waterDays.length >= 2 && stageOf(e) === 3;
let letterId = null;
function openLetter(e) {
  letterId = e.id;
  $("letter-meta").textContent = `${md(ymd(new Date(e.letter.at)))}에 도착한 편지`;
  $("letter-title").textContent = `${iga(bloomName(e))} 피었어요`;
  $("letter-stamp").textContent = e.rare ? (e.rare === "gold" ? "🌟" : "🌈") : (STAMP[E[e.emotions[0].n][1]] || "🌸");
  $("letter-body").textContent = e.letter.text; $("letter-diary").hidden = false;
  if ($("sheet").open) $("sheet").close();
  $("letter").showModal();
  if (!e.letter.read) (store || localStore).update(e.id, { letter: { ...e.letter, read: true } }).catch(() => {});
}
function openMailbox() {
  const withLetters = entries.filter(e => e.letter).sort((a, b) => b.letter.at - a.letter.at);
  const e = withLetters.find(x => !x.letter.read) || withLetters[0];
  if (e) { openLetter(e); return true; }
  return false;
}
$("letter-close").onclick = () => $("letter").close();
$("letter").addEventListener("click", ev => { if (ev.target === $("letter")) $("letter").close(); });
$("letter-diary").onclick = () => { const e = entries.find(x => x.id === letterId); $("letter").close(); if (e) openSheet(e); };
function showPaper(meta, title, stamp, body, withDiary) {
  letterId = null;
  $("letter-meta").textContent = meta; $("letter-title").textContent = title; $("letter-stamp").textContent = stamp; $("letter-body").textContent = body;
  $("letter-diary").hidden = !withDiary;
  if ($("sheet").open) $("sheet").close();
  $("letter").showModal();
}

// ---------- Birthday flower ----------
const BIRTH = {
  1: { name: "카네이션", lang: "사랑과 존경", icon: "🌸" },
  2: { name: "제비꽃", lang: "겸손과 성실", icon: "💜" },
  3: { name: "수선화", lang: "새로운 시작", icon: "🌼" },
  4: { name: "데이지", lang: "순수와 희망", icon: "🌼" },
  5: { name: "은방울꽃", lang: "다시 찾은 행복", icon: "🔔" },
  6: { name: "장미", lang: "사랑과 아름다움", icon: "🌹" },
  7: { name: "수련", lang: "청순한 마음", icon: "🪷" },
  8: { name: "글라디올러스", lang: "굳은 결심", icon: "🌺" },
  9: { name: "과꽃", lang: "추억", icon: "💐" },
  10: { name: "코스모스", lang: "조화", icon: "🌸" },
  11: { name: "국화", lang: "진실", icon: "🌼" },
  12: { name: "포인세티아", lang: "축복", icon: "❤️" },
};
const hasBirthday = () => !!(profile && profile.birthMonth);
const isBirthMonth = () => hasBirthday() && new Date().getMonth() + 1 === profile.birthMonth;
const isBirthday = () => !!profile && !!profile.birthDay && isBirthMonth() && new Date().getDate() === profile.birthDay;
function daysUntilBirthday() {
  if (!profile || !profile.birthDay) return null;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  let next = new Date(now.getFullYear(), profile.birthMonth - 1, profile.birthDay);
  if (next < now) next = new Date(now.getFullYear() + 1, profile.birthMonth - 1, profile.birthDay);
  return Math.round((next - now) / 86400000);
}
{ const m = $("bday-month"), d = $("bday-day");
  for (let i = 1; i <= 12; i++) { const o = document.createElement("option"); o.value = i; o.textContent = `${i}월 · ${BIRTH[i].name}`; m.append(o); }
  const o0 = document.createElement("option"); o0.value = ""; o0.textContent = "모름"; d.append(o0);
  for (let i = 1; i <= 31; i++) { const o = document.createElement("option"); o.value = i; o.textContent = `${i}일`; d.append(o); } }
let bdayEditing = false;
$("bday-edit").onclick = () => { bdayEditing = true; if (profile) { $("bday-month").value = profile.birthMonth; $("bday-day").value = profile.birthDay || ""; } renderBirthday(); };
$("bday-cancel").onclick = () => { bdayEditing = false; renderBirthday(); };
$("bday-save").onclick = async () => {
  const m = Number($("bday-month").value), d = Number($("bday-day").value) || null;
  if (d && d > new Date(2024, m, 0).getDate()) { setMsg($("bday-msg"), `${m}월에는 ${d}일이 없어요. 날짜를 다시 골라 주세요.`, "err"); return; }
  try { await saveProfile({ birthMonth: m, birthDay: d, bdayLetters: (profile && profile.bdayLetters) || {} }); bdayEditing = false; renderBirthday(); setMsg($("bday-msg"), ""); Music.sfx("bloom"); if (g3d) g3d.tip(`${BIRTH[m].icon} ${iga(BIRTH[m].name)} 생일꽃 섬에 피었어요`); }
  catch (e) { setMsg($("bday-msg"), "저장하지 못했어요. 다시 시도해 주세요.", "err"); }
};
function openBirthdayCard() {
  if (!hasBirthday()) { $("bday-title").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
  const b = BIRTH[profile.birthMonth], left = daysUntilBirthday();
  const year = String(new Date().getFullYear()), letter = profile.bdayLetters && profile.bdayLetters[year];
  if (isBirthday() && letter) { showPaper(`${md(today())} · 생일 편지`, "생일 축하해요 🎂", b.icon, letter.text, false); return; }
  const when = left === null ? `${profile.birthMonth}월에 태어난 당신의 꽃이에요.` : left === 0 ? "오늘이 생일이에요! 🎂" : `생일까지 ${left}일 남았어요.`;
  showPaper(`${profile.birthMonth}월의 탄생화`, b.name, b.icon, `꽃말: ${b.lang}\n\n${when}\n\n${isBirthMonth() ? "생일 달이라 꽃이 반짝반짝 빛나고 있어요." : "생일 달이 오면 꽃이 반짝반짝 빛나요."}`, false);
}
let bdayPending = false;
async function ensureBirthdayLetter() {
  if (!isBirthday() || bdayPending || !store) return;
  const year = String(new Date().getFullYear());
  if (profile.bdayLetters && profile.bdayLetters[year]) return;
  bdayPending = true;
  const b = BIRTH[profile.birthMonth];
  const recent = entries.filter(e => (Date.now() - new Date(e.date).getTime()) < 40 * 86400000);
  const cnt = {}; for (const e of recent) for (const x of e.emotions) cnt[x.n] = (cnt[x.n] || 0) + 1;
  const topE = Object.entries(cnt).sort((a, c) => c[1] - a[1]).slice(0, 3).map(([n]) => E[n][0]);
  let text = "", ai = false;
  if (sample) {
    try {
      const r = await sample(`너는 '감정정원'의 정원지기야. 오늘은 이 정원 주인의 생일이야. 짧은 생일 편지를 써줘.

- 생일꽃: ${b.name} (꽃말: ${b.lang})
- 최근 한 달 동안 자주 찾아온 감정: ${topE.length ? topE.join(", ") : "기록 없음"}
- 지금까지 심은 씨앗: ${entries.length}그루

규칙:
- 존댓말로, 따뜻하고 담백하게. 4~6문장, 300자 이내.
- 생일 축하로 시작하고, 생일꽃과 꽃말을 자연스럽게 엮어 줘.
- 최근 감정은 가볍게만 짚고, 충고나 진단은 하지 마.
- 머리말 없이 본문만 쓰고, 마지막 줄은 "— 감정정원의 정원지기"로 끝내.
편지 본문만 답해.`, { modelTier: "default" });
      text = String(r.text || "").trim(); ai = !!text;
    } catch (err) { if (err && err.code === "not_granted") sample = null; }
  }
  if (!text) text = `생일 축하해요! 🎂

오늘 생일꽃 섬의 ${iga(b.name)} 가장 환하게 피었어요. ${b.name}의 꽃말은 '${b.lang}'이래요.
${entries.length ? `지금까지 ${entries.length}그루의 마음을 이 정원에 심어 주었지요. 어떤 마음이든 소중히 들여다봐 준 당신 덕분에 정원이 이만큼 자랐어요.` : "이 정원에서 당신의 마음들이 하나씩 꽃 피기를 기다리고 있어요."}
오늘 하루는 당신을 위한 날이에요. 편안하고 따뜻한 하루 보내요.

— 감정정원의 정원지기`;
  try { await store.setProfile({ ...profile, bdayLetters: { ...(profile.bdayLetters || {}), [year]: { text: text.slice(0, 2000), at: Date.now(), ai } } }); setTimeout(() => Music.sfx("letter"), 600); }
  catch (e) {} finally { bdayPending = false; }
}
$("bday-banner-btn").onclick = openBirthdayCard;
function renderBirthday() {
  const has = hasBirthday() && !bdayEditing;
  $("bday-view").hidden = !has; $("bday-form").hidden = has;
  $("bday-cancel").hidden = !hasBirthday();
  $("bday-edit").hidden = !has;
  $("bday-save").textContent = hasBirthday() ? "바꾸기" : "생일꽃 심기";
  if (hasBirthday()) {
    const b = BIRTH[profile.birthMonth], left = daysUntilBirthday();
    $("bday-flower-icon").textContent = b.icon;
    $("bday-flower-name").textContent = `${profile.birthMonth}월의 탄생화 · ${b.name}`;
    $("bday-flower-lang").textContent = `꽃말: ${b.lang}`;
    $("bday-stat").textContent = isBirthday() ? "오늘이 생일이에요 🎂" : left === null ? `${profile.birthMonth}월생` : `생일까지 ${left}일`;
  } else $("bday-stat").textContent = "";
  const year = String(new Date().getFullYear()), letter = profile && profile.bdayLetters && profile.bdayLetters[year];
  $("bday-banner").hidden = !isBirthday();
  if (isBirthday()) {
    $("bday-banner-sub").textContent = letter ? `${iga(BIRTH[profile.birthMonth].name)} 활짝 피었어요. 정원지기의 생일 편지가 도착했어요.` : "정원지기가 생일 편지를 쓰고 있어요…";
    $("bday-banner-btn").hidden = !letter;
    ensureBirthdayLetter();
  }
}
