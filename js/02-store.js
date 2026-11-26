// 감정정원 · 저장(내 계정 또는 이 브라우저), 백업, 쓰던 글 임시 저장
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Storage: private db rows, else this browser ----------
let entries = [], weeks = {}, profile = null, store = null, sample = null, sampleChecked = false;
const LS_KEY = "emotion-garden-v1", LS_WEEKS = "emotion-garden-weeks-v1", LS_PROFILE = "emotion-garden-profile-v1";
const localStore = {
  kind: "local",
  load() { try { entries = JSON.parse(localStorage.getItem(LS_KEY) || "[]").map(migrate); } catch (e) { entries = []; } try { weeks = JSON.parse(localStorage.getItem(LS_WEEKS) || "{}"); } catch (e) { weeks = {}; } try { profile = JSON.parse(localStorage.getItem(LS_PROFILE) || "null"); } catch (e) { profile = null; } render(); },
  save() { try { localStorage.setItem(LS_KEY, JSON.stringify(entries)); } catch (e) {} },
  async add(e) { entries.push(e); this.save(); render(); },
  async update(id, patch) { entries = entries.map(x => x.id === id ? { ...x, ...patch } : x); this.save(); render(); },
  async remove(id) { entries = entries.filter(x => x.id !== id); this.save(); render(); },
  async setWeek(id, data) { weeks[id] = data; try { localStorage.setItem(LS_WEEKS, JSON.stringify(weeks)); } catch (e) {} render(); },
  async setProfile(data) { profile = data; try { localStorage.setItem(LS_PROFILE, JSON.stringify(profile)); } catch (e) {} render(); },
};
async function initStore() {
  const c = window.claude;
  if (!c || typeof c.use !== "function") { sampleChecked = true; store = localStore; store.load(); return; }
  c.use("sample").then(s => { sample = s; sampleChecked = true; }, () => { sampleChecked = true; });
  c.use("downloads").then(d => { downloads = d; $("backup-btn").hidden = !d; }, () => {});
  try {
    const [db, user] = await Promise.all([c.use("db"), c.use("user")]);
    const uid = user ? await user.id() : null;
    if (!db || !uid) { store = localStore; store.load(); return; }
    const col = db.collection("data/users/" + uid);
    store = {
      kind: "db",
      async add(e) { const { id, ...body } = e; entries.push(e); render(); await col.doc(id).set(body); },
      async update(id, patch) { entries = entries.map(x => x.id === id ? { ...x, ...patch } : x); render(); await col.doc(id).update(patch); },
      async remove(id) { entries = entries.filter(x => x.id !== id); render(); await col.doc(id).delete(); },
      async setWeek(id, data) { weeks[id] = data; render(); await col.doc(id).set({ kind: "week", ...data }); },
      async setProfile(data) { profile = data; render(); await col.doc("profile").set({ kind: "profile", ...data }); },
    };
    let settled = false;
    const timer = setTimeout(() => { if (!settled) { settled = true; render(); } }, 10000);
    col.onSnapshot(snap => {
      settled = true; clearTimeout(timer);
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      entries = all.filter(x => !x.kind).map(migrate);
      weeks = Object.fromEntries(all.filter(x => x.kind === "week").map(({ id, kind, ...w }) => [id, w]));
      { const pr = all.find(x => x.kind === "profile"); if (pr) { const { id, kind, ...rest } = pr; profile = rest; } else profile = null; }
      render();
    }, () => { settled = true; clearTimeout(timer); setMsg($("garden-msg"), "정원을 불러오지 못했어요. 잠시 후 다시 열어 주세요.", "err"); });
  } catch (e) { store = localStore; store.load(); }
}

// ---------- Backup ----------
let downloads = null;
$("backup-btn").addEventListener("click", async () => {
  const msg = $("backup-msg");
  if (!entries.length) { setMsg(msg, "아직 심은 식물이 없어요.", ""); return; }
  const data = JSON.stringify({ app: "감정정원", version: 1, exportedAt: new Date().toISOString(), entries, weeks, profile }, null, 2);
  try { await downloads.save({ filename: `감정정원-백업-${today()}.json`, data }); setMsg(msg, `${entries.length}그루의 기록을 저장했어요.`, "ok"); }
  catch (e) { setMsg(msg, e && e.code === "cancelled" ? "" : "파일을 저장하지 못했어요. 다시 시도해 주세요.", e && e.code === "cancelled" ? "" : "err"); }
});
$("restore-input").addEventListener("change", async ev => {
  const msg = $("backup-msg"), file = ev.target.files[0]; ev.target.value = "";
  if (!file) return;
  let list;
  let wk = {};
  try { const j = JSON.parse(await file.text()); list = Array.isArray(j) ? j : j.entries; if (!Array.isArray(list)) throw 0; if (j && j.weeks && typeof j.weeks === "object") wk = j.weeks; if (j && j.profile && !(profile && profile.petals) && Number(j.profile.petals) > 0) { try { await saveProfile({ petals: Math.min(99999, Math.floor(Number(j.profile.petals))), decor: typeof j.profile.decor === "object" && j.profile.decor ? j.profile.decor : {}, ...(Array.isArray(j.profile.placed) ? { placed: j.profile.placed.filter(x => x && DEFAULT_SPOT[x.id]).slice(0, 60).map(x => ({ uid: String(x.uid || newUid()).slice(0, 24), id: x.id, a: Number(x.a) || 0, f: Math.min(0.93, Math.max(0, Number(x.f) || 0.5)), rot: Number(x.rot) || 0 })), owned: Object.fromEntries(Object.entries(j.profile.owned || {}).filter(([k]) => DEFAULT_SPOT[k]).map(([k, v]) => [k, Math.min(5, Math.max(0, Math.floor(Number(v) || 0)))])) } : {}) }); } catch (e) {} } if (j && j.profile && !hasBirthday() && Number(j.profile.birthMonth) >= 1 && Number(j.profile.birthMonth) <= 12) { const bm = Number(j.profile.birthMonth), bd = Number(j.profile.birthDay) || null; try { await saveProfile({ birthMonth: bm, birthDay: bd && bd >= 1 && bd <= 31 ? bd : null, bdayLetters: typeof j.profile.bdayLetters === "object" && j.profile.bdayLetters ? j.profile.bdayLetters : {} }); } catch (e) {} } }
  catch (e) { setMsg(msg, "감정정원 백업 파일이 아니에요. 백업 받은 .json 파일을 골라 주세요.", "err"); return; }
  let added = 0, skipped = 0;
  for (const raw of list) {
    if (!raw || typeof raw !== "object" || !/^\d{4}-\d{2}-\d{2}$/.test(String(raw.date))) { skipped++; continue; }
    const id = /^[A-Za-z0-9_-]{1,64}$/.test(String(raw.id)) ? String(raw.id) : newId();
    if (entries.some(e => e.id === id)) { skipped++; continue; }
    const entry = {
      id, date: raw.date, createdAt: Number(raw.createdAt) || Date.now(),
      emotions: normEmos(migrate(raw).emotions || []).map(x => ({ n: x.n, s: x.s })), v: 2,
      title: String(raw.title || "").slice(0, 40) || "되찾은 하루", diary: String(raw.diary || ""),
      note: String(raw.note || ""), original: String(raw.original || ""),
    };
    if (Array.isArray(raw.waterDays)) entry.waterDays = raw.waterDays.map(String).slice(0, 4);
    if (raw.fast) entry.fast = true;
    if (raw.rare === "gold" || raw.rare === "rainbow") entry.rare = raw.rare;
    if (raw.question) entry.question = String(raw.question).slice(0, 200);
    if (raw.letter && typeof raw.letter.text === "string") entry.letter = { text: raw.letter.text.slice(0, 2000), at: Number(raw.letter.at) || Date.now(), read: !!raw.letter.read, ai: !!raw.letter.ai };
    try { await (store || localStore).add(entry); added++; } catch (e) { skipped++; }
  }
  for (const [id, w] of Object.entries(wk)) {
    if (!/^(week-\d{4}-\d{2}-\d{2}|month-\d{4}-\d{2})$/.test(id) || weeks[id] || !w || typeof w.text !== "string") continue;
    try { await (store || localStore).setWeek(id, { text: w.text.slice(0, 2000), at: Number(w.at) || Date.now(), ai: !!w.ai }); } catch (e) {}
  }
  setMsg(msg, added ? `${added}그루를 정원에 되살렸어요.` + (skipped ? ` (이미 있거나 읽을 수 없는 기록 ${skipped}개는 건너뛰었어요)` : "") : "새로 더할 기록이 없어요. 이미 정원에 다 있어요.", added ? "ok" : "");
});

// ---------- Draft (this browser only) ----------
const DRAFT_KEY = "emotion-garden-draft";
try { $("walk-input").value = localStorage.getItem(DRAFT_KEY) || ""; } catch (e) {}
$("walk-input").addEventListener("input", () => { try { localStorage.setItem(DRAFT_KEY, $("walk-input").value); } catch (e) {} });
