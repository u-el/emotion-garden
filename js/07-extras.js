// 감정정원 · 마음 날씨, 마음 단어 읽기, 한 달 편지, 일기장 내보내기, 정원 사진
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Mood weather: the last few days of feelings become the garden's weather ----------
const VALENCE = { daisy: 1, sunflower: 1, camellia: 0.9, starflower: 0.9, tulip: 0.8, dandelion: 0.8, lotus: 0.7, moss: 0.6, sprout: 0, fern: -0.6, lavender: -0.6, thorn: -0.7, wildrose: -0.6, vine: -0.7, hydrangea: -0.8, bell: -1, willow: -0.9 };
function moodScore(fromDay, toDay) {
  let sum = 0, w = 0;
  for (const e of entries) {
    const age = Math.round((new Date(today()) - new Date(e.date)) / 86400000);
    if (age < fromDay || age > toDay) continue;
    for (const x of e.emotions) { sum += VALENCE[E[x.n][1]] * x.s; w += x.s; }
  }
  return w ? sum / w : null;
}
function mindWeather() {
  const now = moodScore(0, 2), before = moodScore(3, 6);
  if (now === null) return { key: "clear", icon: "☀️", label: "맑음", why: "최근 기록이 없어서 맑은 하늘이에요." };
  if (now <= -0.35) return { key: "rain", icon: "🌧️", label: "보슬비", why: "요 며칠 마음이 무거웠나 봐요. 정원에 보슬비가 내려요. 비가 그치면 꽃은 더 잘 자라요." };
  if (now >= 0.2 && before !== null && before <= -0.35) return { key: "rainbow", icon: "🌈", label: "무지개", why: "비 온 뒤에 무지개가 떴어요. 힘든 날들을 지나 마음이 조금 개었네요." };
  if (now > 0.15) return { key: "clear", icon: "☀️", label: "맑음", why: "요즘 마음이 맑아서 정원도 맑아요." };
  return { key: "cloudy", icon: "⛅", label: "구름 조금", why: "여러 마음이 섞여서 구름이 조금 꼈어요." };
}
let lastWeather = "";
function renderWeather() {
  const w = mindWeather(), chip = $("weather-chip");
  chip.hidden = !entries.length; chip.textContent = `${w.icon} 마음 날씨: ${w.label}`; chip.title = w.why;
  if (g3d && g3d.weather) g3d.weather(w.key);
  if (entries.length && lastWeather && lastWeather !== w.key && g3d) g3d.tip(`${w.icon} 마음 날씨가 ${w.label}${(c => c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 && (c - 0xac00) % 28 !== 8 ? "으로" : "로")(w.label.charCodeAt(w.label.length - 1))} 바뀌었어요`, true);
  lastWeather = w.key;
}

// ---------- Reading feelings from words (works without AI) ----------
const WORDS = {
  1: ["기쁘", "기뻤", "기뻐", "행복", "좋았", "웃었", "웃음"], 2: ["외롭", "외로", "혼자", "쓸쓸"], 3: ["불안", "걱정", "염려"], 4: ["설레", "설렜", "두근"],
  5: ["만족", "흡족", "괜찮았"], 6: ["공허", "허전", "허무", "텅 빈"], 7: ["지쳤", "지친", "지쳐", "피곤", "힘들", "녹초"], 8: ["감사", "고마", "고맙"],
  9: ["슬프", "슬펐", "슬퍼", "울었", "눈물", "울컥"], 10: ["무기력", "의욕이 없", "하기 싫", "귀찮"], 11: ["화가", "화났", "화나", "분노", "열받"], 12: ["짜증", "신경질", "거슬"],
  13: ["평온", "평화", "차분", "잔잔", "여유"], 14: ["후회", "말걸", "할걸"], 15: ["그립", "그리워", "보고 싶", "보고싶"], 16: ["번아웃", "소진", "탈진"],
  17: ["난처", "곤란", "어색"], 18: ["초조", "조급", "긴장", "떨렸", "떨려"], 19: ["혼란", "헷갈", "모르겠", "복잡"], 20: ["질투", "샘나"],
  21: ["부럽", "부러워"], 22: ["추억", "옛날", "어릴 때", "그 시절"], 23: ["안쓰", "불쌍", "안타깝"], 24: ["자신감", "자존감"],
  25: ["감탄", "대단", "멋지", "멋있"], 26: ["경이", "웅장", "압도"], 27: ["창피", "부끄", "수치"], 28: ["죄책감", "내 탓", "잘못했"],
  29: ["기대", "기다려", "기다리"], 30: ["희망", "잘될", "나아질", "할 수 있"], 31: ["믿음", "믿을", "든든"], 32: ["역겹", "혐오", "싫다", "싫어"],
  33: ["마음이 아팠", "마음 아팠", "같이 아팠"], 34: ["다행", "안도", "안심", "한숨 돌"], 35: ["지루", "심심", "따분"], 36: ["궁금", "호기심", "신기"],
  37: ["감격", "벅차", "뭉클", "감동"], 38: ["사랑", "애정"], 39: ["황홀", "꿈같", "꿈 같"], 40: ["놀랐", "놀라", "깜짝"],
  41: ["무섭", "무서", "두렵", "두려", "겁"], 42: ["실망", "허탈"], 43: ["서운", "섭섭"], 44: ["억울"], 45: ["답답", "갑갑"],
  46: ["아쉽", "아쉬"], 47: ["미안", "죄송"], 48: ["뿌듯", "해냈", "성취"], 49: ["즐거", "즐겁", "재밌", "재미있", "신났", "신나"], 50: ["홀가분", "후련", "개운"],
  51: ["막막", "앞이 안 보", "어떻게 해야"],
};
const FAMILY_NOTE = {
  daisy: "따뜻하게 차오르는 마음이 보여요. 오늘의 좋은 순간을 오래 간직해요.", tulip: "앞을 바라보는 마음이 느껴져요. 그 마음이 잘 자라길 바라요.",
  bell: "고개 숙인 마음이 있었네요. 오늘은 스스로를 조금 더 다정하게 대해 줘요.", fern: "마음이 많이 흔들렸나 봐요. 천천히 숨 한번 쉬어 가요.",
  thorn: "날이 선 마음이 있었네요. 그럴 만한 이유가 있었을 거예요.", moss: "고요한 마음이 느껴져요. 이 평온이 오래 머물기를.",
  willow: "기운이 많이 빠진 하루였네요. 오늘은 푹 쉬어도 괜찮아요.", vine: "관계 속에서 마음이 많이 쓰였네요. 그 마음도 소중해요.",
  sprout: "아직 이름 붙이기 어려운 마음이네요. 그대로 심어 두어도 괜찮아요.",
  sunflower: "환하게 웃은 하루였네요. 그 빛이 오래 머물기를.", camellia: "아끼고 고마운 마음이 느껴져요. 그 마음을 전해 보는 건 어때요?",
  starflower: "반짝이는 순간을 만났네요. 그 설렘을 기억해요.", dandelion: "마음이 한결 가벼워졌네요. 가볍게 날아올라요.",
  lotus: "잔잔한 마음이 느껴져요. 이 고요가 오래 머물기를.", hydrangea: "누군가를, 그때를 그리는 마음이네요. 그리움도 사랑의 다른 모양이에요.",
  lavender: "조마조마한 마음이 있었네요. 천천히 숨을 고르며 지금 여기에 머물러요.", wildrose: "누군가를 바라보는 마음이 있었네요. 당신만의 꽃도 이미 피고 있어요.",
};
function readByWords(text) {
  const t = text.replace(/\s+/g, " "), strong = /(너무|정말|진짜|엄청|완전|많이|아주|무척)/g;
  const scores = [];
  for (const [n, stems] of Object.entries(WORDS)) {
    let hits = 0, boost = 0;
    for (const st of stems) { let i = t.indexOf(st); while (i >= 0) { hits++; const before = t.slice(Math.max(0, i - 8), i); if (strong.test(before)) boost++; strong.lastIndex = 0; if (/(안 |못 )$/.test(before)) hits -= 0.7; i = t.indexOf(st, i + st.length); } }
    if (hits > 0.5) scores.push({ n: +n, hits, s: clamp(Math.round(2 + hits + boost), 1, 5) });
  }
  scores.sort((a, b) => b.hits - a.hits || b.s - a.s);
  const emotions = scores.slice(0, 3).map(x => ({ n: x.n, s: x.s }));
  if (!emotions.length) emotions.push({ n: UNKNOWN, s: 3 });
  const first = (text.split(/[.!?\n。]/).map(x => x.trim()).find(Boolean) || "").slice(0, 15);
  return { emotions, title: first || E[emotions[0].n][0] + "의 하루", diary: text, note: FAMILY_NOTE[E[emotions[0].n][1]], original: text, byWords: true };
}

// ---------- Monthly letter (stored with the weekly letters) ----------
let monthPending = false;
function monthEntries(Y, M) { const pre = `${Y}-${pad(M + 1)}-`; return entries.filter(e => e.date.startsWith(pre)).sort((a, b) => a.date.localeCompare(b.date)); }
function renderMonthLetter(Y, M) {
  const box = $("month-letter-box"); box.textContent = "";
  const id = `month-${Y}-${pad(M + 1)}`, w = weeks[id], list = monthEntries(Y, M);
  if (w) {
    const card = document.createElement("div"); card.className = "week-letter";
    const meta = document.createElement("div"); meta.className = "label"; meta.style.color = "var(--stamp)"; meta.textContent = `정원지기의 ${M + 1}월 편지 · ${md(ymd(new Date(w.at)))}`;
    const body = document.createElement("p"); body.className = "letter-body"; body.textContent = w.text; card.append(meta, body); box.append(card);
  }
  if (list.length >= 3) {
    const b = document.createElement("button"); b.type = "button"; b.className = w ? "ghost" : "primary"; b.style.marginTop = "10px";
    b.textContent = monthPending ? "정원지기가 편지를 쓰는 중이에요…" : w ? "한 달 편지 다시 받기" : `✉️ 정원지기에게 ${M + 1}월 편지 받기`; b.disabled = monthPending;
    b.onclick = () => requestMonthLetter(Y, M); box.append(b);
  } else if (!w && list.length) { const p2 = document.createElement("p"); p2.className = "hint"; p2.textContent = `이 달에 일기가 3편 넘게 쌓이면 정원지기의 한 달 편지를 받을 수 있어요. (지금 ${list.length}편)`; box.append(p2); }
}
async function requestMonthLetter(Y, M) {
  const list = monthEntries(Y, M); if (monthPending || list.length < 3) return;
  monthPending = true; render();
  let text = "", ai = false;
  if (sample) {
    const lines = list.slice(-40).map(e => `- ${md(e.date)}: ${e.emotions.map(x => `${E[x.n][0]} ${x.s}`).join(", ")} / "${e.title}" ${(e.diary || e.original || "").replace(/\s+/g, " ").slice(0, 120)}`).join("\n");
    try {
      const r = await sample(`너는 '감정정원'의 정원지기야. 사용자가 ${Y}년 ${M + 1}월 한 달 동안 쓴 감정 일기를 보고, 한 달을 돌아보는 편지를 써줘.\n\n${lines}\n\n규칙:\n- 존댓말로, 따뜻하고 담백하게. 5~8문장, 500자 이내.\n- 한 달 동안 감정이 어떻게 흘러갔는지 초반, 중반, 후반을 짚으며 부드럽게 돌아봐 줘. 일기에 없는 사실은 지어내지 마.\n- 잘 지나온 순간이나 작은 기쁨을 알아봐 주고, 다음 달을 향한 짧은 응원을 건네. 충고나 진단은 하지 마.\n- 일기에 스스로를 해치고 싶다는 내용이 있으면, 혼자 견디지 말고 가까운 사람이나 자살예방상담전화 109에 이야기해 보라고 부드럽게 전해줘.\n- 머리말 없이 본문만 쓰고, 마지막 줄은 "— 감정정원의 정원지기"로 끝내.\n편지 본문만 답해.`, { modelTier: "default" });
      text = String(r.text || "").trim(); ai = !!text;
    } catch (err) { if (err && err.code === "not_granted") sample = null; }
  }
  if (!text) {
    const cnt = {}; for (const e of list) for (const x of e.emotions) cnt[x.n] = (cnt[x.n] || 0) + 1;
    const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => E[n][0]);
    text = `${M + 1}월 한 달 동안 ${new Set(list.map(e => e.date)).size}일, ${list.length}편의 마음을 이 정원에 심어 주었어요.\n가장 자주 찾아온 마음은 ${top.join(", ")}${(c => c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 ? "이었어요" : "였어요")(top.join("").charCodeAt(top.join("").length - 1))}.\n어떤 날은 무겁고 어떤 날은 가벼웠겠지만, 그 모든 날을 들여다봐 준 덕분에 정원이 이만큼 자랐어요.\n다음 달에도 당신의 속도로 천천히 걸어가요.\n\n— 감정정원의 정원지기`;
  }
  try { await (store || localStore).setWeek(`month-${Y}-${pad(M + 1)}`, { text: text.slice(0, 2500), at: Date.now(), ai }); Music.sfx("letter"); }
  catch (err) { setMsg($("garden-msg"), "한 달 편지를 받지 못했어요. 다시 시도해 주세요.", "err"); }
  finally { monthPending = false; render(); }
}

// ---------- Export the diary book as plain text ----------
function diaryText() {
  const list = entries.slice().sort((a, b) => (a.date + String(a.createdAt || 0).padStart(15, "0")).localeCompare(b.date + String(b.createdAt || 0).padStart(15, "0")));
  const out = [`감정정원 일기장`, `${md(today())} 내보냄 · ${list.length}편`, ""];
  for (const e of list) {
    const [y, m, d] = e.date.split("-");
    out.push("────────────────────", `${y}년 ${+m}월 ${+d}일 · ${e.title}`, `감정: ${e.emotions.map(x => `${E[x.n][0]}(${x.s})`).join(", ")} · ${plantName(e.emotions[0].n)}`);
    if (e.question) out.push(`질문: ${e.question}`);
    out.push("", e.diary || e.original || "(내용 없음)");
    if (e.original && e.original !== e.diary) out.push("", "[내가 처음 쓴 글]", e.original);
    if (e.note) out.push("", `정원지기의 한마디: ${e.note}`);
    if (e.letter && e.letter.text) out.push("", "[꽃이 피었을 때 받은 편지]", e.letter.text);
    out.push("");
  }
  return out.join("\n");
}
$("export-btn").onclick = async () => {
  const msg = $("backup-msg");
  if (!entries.length) { setMsg(msg, "아직 내보낼 일기가 없어요.", ""); return; }
  const text = diaryText();
  if (downloads) {
    try { await downloads.save({ filename: `감정정원-일기장-${today()}.txt`, data: text }); setMsg(msg, `일기 ${entries.length}편을 파일로 저장했어요.`, "ok"); return; }
    catch (e) { if (e && e.code === "cancelled") return; }
  }
  $("export-text").value = text; setMsg($("export-msg"), ""); $("export-dlg").showModal();
};
$("export-x").onclick = () => $("export-dlg").close();
$("export-copy").onclick = () => {
  const ta = $("export-text");
  try { navigator.clipboard.writeText(ta.value).then(() => setMsg($("export-msg"), "복사했어요. 메모장에 붙여넣어 주세요.", "ok"), () => { ta.select(); setMsg($("export-msg"), "글을 선택해 두었어요. 길게 눌러 복사하세요.", ""); }); }
  catch (e) { ta.select(); setMsg($("export-msg"), "글을 선택해 두었어요. 길게 눌러 복사하세요.", ""); }
};

// ---------- Garden photo card ----------
let photoBlob = null;
async function makePhoto() {
  if (!g3d || !g3d.snapshot) { setMsg($("garden-msg"), "이 화면에서는 3D 정원 사진을 만들 수 없어요.", "err"); return; }
  const shot = g3d.snapshot(), envNow = g3d.env(), skyC = SKIES[envNow.sky];
  const img = new Image(); img.src = shot.url; await img.decode();
  const W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, skyC.top); g.addColorStop(1, skyC.bottom); x.fillStyle = g; x.fillRect(0, 0, W, H);
  // the garden, cropped to a rounded square
  const box = { x: 60, y: 190, w: 960, h: 900 }, sc = Math.max(box.w / img.width, box.h / img.height), sw = box.w / sc, sh = box.h / sc;
  x.save(); x.beginPath(); x.roundRect ? x.roundRect(box.x, box.y, box.w, box.h, 36) : x.rect(box.x, box.y, box.w, box.h); x.clip();
  x.fillStyle = "rgba(255,255,255,0.12)"; x.fillRect(box.x, box.y, box.w, box.h);
  x.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, box.x, box.y, box.w, box.h); x.restore();
  const ink = envNow.sky === "night" ? "#eef2ff" : "#23302a", soft = envNow.sky === "night" ? "rgba(238,242,255,0.75)" : "rgba(35,48,42,0.7)";
  const d = new Date(), mList = monthEntries(d.getFullYear(), d.getMonth());
  x.fillStyle = soft; x.font = '500 34px "Gowun Dodum", sans-serif'; x.fillText(`${d.getFullYear()}년 ${d.getMonth() + 1}월의 정원`, 64, 92);
  x.fillStyle = ink; x.font = '700 76px "Hahmlet", serif'; x.fillText("감정정원", 60, 165);
  const cnt = {}; for (const e of mList) for (const y2 of e.emotions) cnt[y2.n] = (cnt[y2.n] || 0) + 1;
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => +n);
  const bloomed = entries.filter(e => stageOf(e) === 3).length, w = mindWeather();
  x.font = '500 36px "Gowun Dodum", sans-serif'; x.fillStyle = ink;
  x.fillText(`🌸 꽃 ${bloomed}송이 · 🌱 이 달 ${mList.length}편 · ${w.icon} ${w.label}`, 64, 1160);
  if (top.length) {
    x.fillStyle = soft; x.fillText("자주 찾아온 마음", 64, 1228);
    let cx = 64 + x.measureText("자주 찾아온 마음").width + 24;
    x.font = '600 34px "Gowun Dodum", sans-serif';
    for (const n of top) { x.fillStyle = E[n][2]; x.beginPath(); x.arc(cx + 13, 1216, 13, 0, 7); x.fill(); x.fillStyle = ink; x.fillText(E[n][0], cx + 34, 1228); cx += 34 + x.measureText(E[n][0]).width + 30; }
  }
  x.fillStyle = soft; x.font = '400 26px "Gowun Dodum", sans-serif'; x.fillText("오늘의 마음을 적으면, 그 마음이 꽃으로 피어나는 작은 정원", 64, 1296);
  photoBlob = await new Promise(res => c.toBlob(res, "image/png"));
  $("photo-img").src = URL.createObjectURL(photoBlob);
  $("photo-save").hidden = !downloads;
  $("photo-hint").textContent = downloads ? "지금 보이는 시간, 계절, 각도 그대로 찍혔어요. 섬을 돌려서 다른 각도로 다시 찍을 수도 있어요." : "폰에서는 이미지를 길게 눌러 저장할 수 있어요. 섬을 돌려서 다른 각도로 다시 찍을 수도 있어요.";
  setMsg($("photo-msg"), ""); $("photo-dlg").showModal(); Music.sfx("collect");
}
$("photo-btn").onclick = makePhoto;
$("photo-chip").onclick = makePhoto;
$("photo-x").onclick = () => $("photo-dlg").close();
$("photo-save").onclick = async () => {
  if (!photoBlob || !downloads) return;
  try { await downloads.save({ filename: `감정정원-${today()}.png`, data: photoBlob }); setMsg($("photo-msg"), "사진을 저장했어요.", "ok"); }
  catch (e) { if (!(e && e.code === "cancelled")) setMsg($("photo-msg"), "저장하지 못했어요. 이미지를 길게 눌러 저장해 보세요.", "err"); }
};
