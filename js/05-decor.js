// 감정정원 · 꽃잎 모으기, 정원 꾸미기 상점, 소품 놓기
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Petals & decorations ----------
const DECOR = [
  { id: "mushroom", max: 5, name: "버섯 무리", icon: "🍄", price: 6, desc: "비 온 다음 날 쏙 올라온 버섯들" },
  { id: "cairn", max: 5, name: "돌탑", icon: "🪨", price: 8, desc: "소원을 하나씩 얹어 쌓은 돌탑" },
  { id: "chime", max: 5, name: "풍경", icon: "🎐", price: 10, desc: "바람에 흔들리고, 누르면 맑은 소리가 나요" },
  { id: "lamp", max: 5, name: "초롱", icon: "🏮", price: 12, desc: "밤이 되면 불이 켜져요" },
  { id: "bench", max: 3, name: "나무 벤치", icon: "🪑", price: 15, desc: "잠깐 앉아 쉬어 가는 자리" },
  { id: "birdhouse", max: 3, name: "새집", icon: "🐦", price: 18, desc: "작은 새가 놀러 오는 집" },
  { id: "pond", max: 3, name: "작은 연못", icon: "💧", price: 25, desc: "연잎이 떠 있는 동그란 연못" },
  { id: "arch", max: 3, name: "꽃 아치", icon: "🌸", price: 30, desc: "산책길 입구를 꾸미는 꽃 아치" },
  { id: "pinwheel", max: 1, name: "무지개 바람개비", icon: "🎡", reward: 7, desc: "7일 연속 산책 선물 · 바람에 빙글빙글" },
  { id: "startree", max: 1, name: "별빛 나무", icon: "🌟", reward: 30, desc: "30일 연속 산책 선물 · 밤이면 별 열매가 빛나요" },
];
const COLLECT_CAP = 20;
let petalBuffer = 0, collectBuffer = 0, petalTimer = null;
const saveProfile = patch => (store || localStore).setProfile({ ...(profile || {}), ...patch });
const petalsNow = () => ((profile && profile.petals) || 0) + petalBuffer;
const collectedToday = () => ((profile && profile.petalDay && profile.petalDay.date === today()) ? profile.petalDay.n : 0) + collectBuffer;
const collectLeft = () => !!entries.length && COLLECT_CAP - collectedToday() > 0;
function earn(n, why) {
  if (!n) return;
  petalBuffer += n; renderWallet();
  if (g3d && why) g3d.tip(`🌸 꽃잎 +${n} · ${why}`, true);
  clearTimeout(petalTimer); petalTimer = setTimeout(flushPetals, 1200);
}
function flushPetals() {
  const n = petalBuffer, c = collectBuffer; petalBuffer = 0; collectBuffer = 0;
  if (!n && !c) return;
  const base = (profile && profile.petalDay && profile.petalDay.date === today()) ? profile.petalDay.n : 0;
  saveProfile({ petals: ((profile && profile.petals) || 0) + n, petalDay: { date: today(), n: base + c } }).catch(() => { petalBuffer += n; collectBuffer += c; });
}
addEventListener("pagehide", flushPetals);
function collectPetal() {
  if (!collectLeft()) return false;
  collectBuffer++; earn(1, "");
  Music.sfx("collect");
  if (g3d) g3d.tip(`🌸 꽃잎 +1 · 오늘 ${collectedToday()}/${COLLECT_CAP}`, true);
  return true;
}
function renderWallet() {
  const n = petalsNow();
  $("wallet-chip").textContent = `🌸 ${n}`; $("wallet-chip").setAttribute("aria-label", `꽃잎 ${n}장, 정원 꾸미기 열기`);
  $("shop-balance").textContent = `🌸 ${n}장`;
  if ($("shop").open) renderShop();
}
// where each item goes when it is placed automatically: [angle, distance] (distance < 1: share of the island radius, < 0: that far in from the rim)
const DEFAULT_SPOT = { pinwheel: [1.62, -0.95], startree: [3.33, -1.05], mushroom: [0.55, 0.84], cairn: [0.2, 0.86], chime: [1.3, 0.86], lamp: [1.95, 0.86], bench: [3.05, 0.84], birdhouse: [3.6, 0.86], pond: [4.65, 0.78], arch: [-0.6, 0.9] };
const spotToPolar = (id, k = 0) => { const [a, rf] = DEFAULT_SPOT[id]; const f = rf < 0 ? 1 + rf / 6 : rf; return { a: a + k * 0.32, f: Math.min(0.92, f) }; };
const newUid = () => "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
// decorations: how many of each you own, and where each placed one stands (older saves kept one of each in `decor`)
function decorState() {
  if (profile && Array.isArray(profile.placed)) return { owned: { ...(profile.owned || {}) }, placed: profile.placed.map(x => ({ ...x })) };
  const old = (profile && profile.decor) || {}, owned = {}, placed = [];
  for (const [id, v] of Object.entries(old)) { if (!DEFAULT_SPOT[id]) continue; owned[id] = 1; if (v && v.shown) placed.push({ uid: "m" + id, id, ...spotToPolar(id), rot: 0 }); }
  return { owned, placed };
}
const saveDecor = (owned, placed, extra) => saveProfile({ owned, placed, ...(extra || {}) });
function renderShop() {
  const box = $("shop-list"); box.textContent = "";
  const { owned, placed } = decorState(), n = petalsNow();
  for (const d of DECOR) {
    const have = owned[d.id] || 0, out = placed.filter(x => x.id === d.id).length, free = have - out;
    const row = document.createElement("div"); row.className = "shop-item";
    const ic = document.createElement("div"); ic.className = "shop-icon"; ic.textContent = d.icon;
    const tx = document.createElement("div"); tx.className = "shop-text";
    const nm = document.createElement("div"); nm.className = "shop-name"; nm.textContent = d.name;
    const ds = document.createElement("div"); ds.className = "shop-desc"; ds.textContent = d.desc;
    tx.append(nm, ds);
    if (have) { const ct = document.createElement("div"); ct.className = "shop-count"; ct.textContent = `가진 ${have}/${d.max}` + (free ? ` · 놓지 않은 ${free}개` : ""); tx.append(ct); }
    const acts = document.createElement("div"); acts.className = "shop-acts";
    if (d.reward && !have) { const b = document.createElement("button"); b.type = "button"; b.className = "ghost"; b.textContent = `👣 ${d.reward}일`; b.disabled = true; b.setAttribute("aria-label", `${d.name}: ${d.reward}일 연속 산책하면 받아요`); acts.append(b); }
    if (!d.reward) {
      const b = document.createElement("button"); b.type = "button"; b.className = "primary";
      b.textContent = have >= d.max ? "최대" : `🌸 ${d.price}`; b.disabled = have >= d.max || n < d.price;
      b.setAttribute("aria-label", have >= d.max ? `${d.name}: 최대 ${d.max}개까지 가질 수 있어요` : `${d.name} 꽃잎 ${d.price}장으로 사기`);
      b.onclick = () => buyDecor(d); acts.append(b);
    }
    if (free > 0) { const b = document.createElement("button"); b.type = "button"; b.className = "ghost"; b.textContent = "놓기"; b.onclick = () => startPlacing(d.id); acts.append(b); }
    if (out > 0 && g3d && g3d.moveFromShop) { const b = document.createElement("button"); b.type = "button"; b.className = "ghost"; b.textContent = "옮기기"; b.setAttribute("aria-label", `놓아 둔 ${d.name} 옮기기`); b.onclick = () => { $("shop").close(); g3d.moveFromShop(d.id); }; acts.append(b); }
    row.append(ic, tx, acts); box.append(row);
  }
}
async function buyDecor(d) {
  const total = petalsNow(), { owned, placed } = decorState();
  if (total < d.price || (owned[d.id] || 0) >= d.max) return;
  clearTimeout(petalTimer);
  const c = collectBuffer, base = (profile && profile.petalDay && profile.petalDay.date === today()) ? profile.petalDay.n : 0;
  petalBuffer = 0; collectBuffer = 0;
  owned[d.id] = (owned[d.id] || 0) + 1;
  try {
    await saveDecor(owned, placed, { petals: total - d.price, petalDay: { date: today(), n: base + c } });
    Music.sfx("bloom");
    startPlacing(d.id);
  } catch (e) { petalBuffer = total - ((profile && profile.petals) || 0); setMsg($("shop-msg"), "사지 못했어요. 다시 시도해 주세요.", "err"); }
  renderShop();
}
// choose a spot by dragging on the island (3D); without 3D the item goes to its usual spot
function startPlacing(id, uid) {
  const d = DECOR.find(x => x.id === id);
  if (g3d && g3d.place) { if ($("shop").open) $("shop").close(); g3d.place(id, uid); return; }
  const { placed } = decorState(); addPlaced(id, spotToPolar(id, placed.filter(x => x.id === id).length));
  setMsg($("shop-msg"), `${d.icon} ${eul(d.name)} 정원에 놓았어요.`, "ok");
}
async function addPlaced(id, pos) {
  const { owned, placed } = decorState();
  if (placed.filter(x => x.id === id).length >= (owned[id] || 0)) return;
  placed.push({ uid: newUid(), id, a: pos.a, f: pos.f, rot: pos.rot || 0 });
  await saveDecor(owned, placed);
}
async function updatePlaced(uid, patch) {
  const { owned, placed } = decorState(), it = placed.find(x => x.uid === uid); if (!it) return;
  Object.assign(it, patch); await saveDecor(owned, placed);
}
async function removePlaced(uid) {
  const { owned, placed } = decorState();
  await saveDecor(owned, placed.filter(x => x.uid !== uid));
}
function openShop() { setMsg($("shop-msg"), ""); renderShop(); renderWallet(); $("shop").showModal(); }
$("wallet-chip").onclick = openShop;
$("decor-btn").onclick = openShop;
$("shop-close").onclick = () => $("shop").close();
$("shop").addEventListener("click", ev => { if (ev.target === $("shop")) $("shop").close(); });
// the first seed sprouts by itself after three minutes: refresh and celebrate when it happens
const sproutSeen = new Set();
setInterval(() => {
  const ready = entries.filter(e => e.fast && !sproutSeen.has(e.id) && (e.waterDays || []).length === 1 && Date.now() - (e.createdAt || 0) >= FAST_MS);
  if (!ready.length) { entries.filter(e => e.fast && Date.now() - (e.createdAt || 0) >= FAST_MS).forEach(e => sproutSeen.add(e.id)); return; }
  ready.forEach(e => sproutSeen.add(e.id));
  render(); Music.sfx("plant");
  setMsg($("garden-msg"), "🌱 첫 새싹이 돋았어요! 내일 물을 주면 꽃봉오리가 맺혀요.", "ok");
  if (g3d) g3d.tip("🌱 첫 새싹이 돋았어요!", true);
}, 10000);
setTimeout(() => entries.filter(e => e.fast && Date.now() - (e.createdAt || 0) >= FAST_MS).forEach(e => sproutSeen.add(e.id)), 12000);
