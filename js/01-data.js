// 감정정원 · 감정 51종, 꽃 17종, 공통 도구
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Emotion catalogue (01~39: 감정산책 목록, 40~51: 감정정원에서 더한 감정, 52: 미확인) ----------
const FAMILIES = {
  sunflower: ["해바라기", "환하게 웃는 마음"],
  camellia:  ["동백꽃", "아끼고 고마운 마음"],
  daisy:  ["둥근꽃", "따뜻하게 차오르는 마음"],
  starflower: ["별빛꽃", "반짝이며 놀라는 마음"],
  tulip:  ["꽃봉오리", "앞을 바라보는 마음"],
  dandelion: ["민들레", "가볍게 날아오르는 마음"],
  lotus:  ["연꽃", "잔잔하게 가라앉은 마음"],
  moss:   ["이끼돌", "가라앉은 고요"],
  hydrangea: ["수국", "누군가를, 그때를 그리는 마음"],
  bell:   ["초롱꽃", "고개 숙인 마음"],
  lavender: ["라벤더", "조마조마한 마음"],
  fern:   ["고사리", "흔들리는 마음"],
  wildrose: ["들장미", "누군가를 바라보는 마음"],
  thorn:  ["가시풀", "날이 선 마음"],
  willow: ["버들풀", "기운이 빠진 마음"],
  vine:   ["덩굴꽃", "관계 속에서 생긴 마음"],
  sprout: ["새싹", "아직 이름 없는 마음"],
};
const E = {
  1:["기쁨","sunflower","#f2c230"], 2:["외로움","hydrangea","#4f6db3"], 3:["불안","lavender","#5f9a92"], 4:["설렘","tulip","#f29bb5"],
  5:["만족","daisy","#f0a860"], 6:["공허","willow","#a3a9ad"], 7:["지침","willow","#c4b08c"], 8:["감사","camellia","#ec8a3c"],
  9:["슬픔","bell","#5b8fd6"], 10:["무기력","willow","#9a9182"], 11:["분노","thorn","#d6453a"], 12:["짜증","thorn","#e67a3a"],
  13:["평온","lotus","#8fb58a"], 14:["후회","bell","#7c8ea8"], 15:["그리움","hydrangea","#a68fd1"], 16:["번아웃","willow","#8a7f78"],
  17:["난처함","fern","#c7ad6f"], 18:["초조","lavender","#9aa84a"], 19:["혼란","fern","#9b8bb0"], 20:["질투","wildrose","#4f9a4a"],
  21:["부러움","wildrose","#a6c24a"], 22:["향수","hydrangea","#c3a6dd"], 23:["연민","bell","#7fb6d9"], 24:["자존감","tulip","#e0a63a"],
  25:["감탄","starflower","#f0c95a"], 26:["경외","lotus","#6c5fc0"], 27:["수치심","bell","#c06a8f"], 28:["죄책감","bell","#8b5a5a"],
  29:["기대","dandelion","#f4a98a"], 30:["희망","dandelion","#b8d45a"], 31:["신뢰","moss","#6f9d78"], 32:["혐오","thorn","#7e8a3c"],
  33:["공감적 고통","bell","#6a73c4"], 34:["안도감","lotus","#7cc2a6"], 35:["지루함","willow","#b9b4a8"], 36:["호기심","starflower","#3fb3b0"],
  37:["감격","sunflower","#ef6f6a"], 38:["사랑","camellia","#ea5f8f"], 39:["황홀","starflower","#c85bd0"], 
  40:["놀람","fern","#f4d35e"], 41:["두려움","fern","#4a5a7a"], 42:["실망","vine","#8aa1b8"], 43:["서운함","vine","#d58fa6"],
  44:["억울함","thorn","#b8433d"], 45:["답답함","thorn","#a8744a"], 46:["아쉬움","vine","#c9a0c8"], 47:["미안함","vine","#e3a587"],
  48:["뿌듯함","daisy","#f2a93b"], 49:["즐거움","sunflower","#ff8c69"], 50:["홀가분함","dandelion","#a8dcd1"], 51:["막막함","willow","#7d8590"],
  52:["미확인","sprout","#d9e0d4"],
};
const NAME_TO_NUM = Object.fromEntries(Object.entries(E).map(([n, v]) => [v[0].replace(/\s/g, ""), +n]));
const UNKNOWN = 52;
const TRACKED = Object.keys(E).map(Number).filter(n => n !== UNKNOWN);
// records saved before v2 used 40 for "미확인"; read them as 52 without rewriting stored data
const migrate = e => (e && !(e.v >= 2) && Array.isArray(e.emotions)) ? { ...e, emotions: e.emotions.map(x => x.n === 40 ? { ...x, n: UNKNOWN } : x) } : e;
const STAGES = ["씨앗", "새싹", "꽃봉오리", "꽃"];
const seedName = n => `${E[n][0]}의 ${FAMILIES[E[n][1]][0]} 씨앗`;
const plantName = n => `${E[n][0]}의 ${FAMILIES[E[n][1]][0]}`;

// ---------- Helpers ----------
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => ymd(new Date());
const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const newId = () => "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const FAST_MS = 3 * 60 * 1000; // the very first seed sprouts on its own after three minutes
const stageOf = e => { if (!Array.isArray(e.waterDays)) return 3; let st = e.waterDays.length - 1; if (e.fast && Date.now() - (e.createdAt || 0) >= FAST_MS) st += 1; return clamp(st, 0, 3); };
const watersLeft = e => !Array.isArray(e.waterDays) ? 0 : e.fast ? Math.max(0, 3 - e.waterDays.length) : Math.max(0, 3 - stageOf(e));
const bloomDay = e => Array.isArray(e.waterDays) ? e.waterDays[e.fast ? 2 : 3] : null;
const needsWater = e => !e.example && stageOf(e) < 3 && !(e.waterDays || []).includes(today());
function setMsg(el, t, kind) { el.textContent = t; el.className = "msg" + (kind ? " " + kind : ""); }
{ const d = new Date(); $("today-label").textContent = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`; }
