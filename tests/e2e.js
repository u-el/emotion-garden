// 감정정원 전체 기능 점검 (claude.ai 밖에서 실행: 이 브라우저 저장, AI 없이 마음 단어로 감정 읽기)
//
// 준비:  npm i --no-save playwright three@0.128.0
// 실행:  python3 -m http.server 8765 &   (저장소 폴더에서)
//        node tests/e2e.js [http://127.0.0.1:8765/index.html]
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const BASE = process.argv[2] || 'http://127.0.0.1:8765/index.html';
const THREE_DIR = path.dirname(require.resolve('three/package.json'));
// eight days of entries in a row, ending today, for the streak and calendar checks
const day = k => { const d = new Date(); d.setDate(d.getDate() - k); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const titles = ['친구에게 서운했던 날', '점심이 맛있었다', '발표 전날', '드디어 완주', '할머니 생각', '조용한 일요일', '지하철 지연', '새 출발'], emos = [43, 1, 3, 48, 15, 13, 11, 30];
const FIXTURE = path.join(require('os').tmpdir(), 'emotion-garden-e2e.json');
fs.writeFileSync(FIXTURE, JSON.stringify({ entries: titles.map((t, i) => ({ id: 's' + i, v: 2, date: day(7 - i), createdAt: i + 1, emotions: [{ n: emos[i], s: 3 + i % 3 }], title: t, diary: t + '. 오늘의 마음을 적어 본다.', waterDays: [day(7 - i)] })) }));
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 420, height: 880 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text()); });
  await p.route('https://cdn.jsdelivr.net/npm/three@0.128.0/**', r => { const u = new URL(r.request().url()); r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(path.join(THREE_DIR, u.pathname.replace('/npm/three@0.128.0', ''))) }); });
  await p.route('**/js/14-garden-3d.js', async r => { const res = await r.fetch(); let t = await res.text(); t = t.replace('  return { update, tip: showTip', '  window.__dbg = { camera, controls, renderer, walker, items: () => huntItems, whale, R: () => islandR, decor: () => decorGroup };\n  return { update, tip: showTip'); r.fulfill({ response: res, body: t, contentType: 'application/javascript' }); });
  await p.route('https://fonts.googleapis.com/**', r => r.abort()); await p.route('https://fonts.gstatic.com/**', r => r.abort());
  let fails = 0;
  const ok = (label, cond, extra = '') => (cond || fails++, console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? '  · ' + extra : ''}`));
  await p.goto(BASE); await p.waitForTimeout(3000);
  ok('3D garden on', await p.evaluate(() => !document.getElementById('garden3d').hidden));
  ok('first-visit guide', await p.evaluate(() => document.getElementById('guide-dlg').open));
  await p.click('#guide-skip');
  ok('question shown', (await p.textContent('#q-text')).length > 5);
  await p.fill('#walk-input', '친구가 연락을 안 해서 너무 서운했다. 그래도 일을 해내서 뿌듯했다.'); await p.click('#read-btn'); await p.waitForTimeout(300);
  ok('word reader', (await p.textContent('#seed-title')).includes('서운함'), await p.textContent('#seed-title'));
  await p.click('#plant-btn'); await p.waitForTimeout(400);
  ok('planted first seed (fast)', (await p.textContent('#garden-msg')).includes('3분'), await p.textContent('#garden-msg'));
  await p.setInputFiles('#restore-input', FIXTURE); await p.waitForTimeout(900);
  ok('restore + streak gift', (await p.textContent('#garden-msg')).includes('연속'), await p.textContent('#garden-msg'));
  ok('diary list', (await p.textContent('#diary-stat')).includes('9'), await p.textContent('#diary-stat'));
  await p.fill('#diary-search', '서운'); await p.waitForTimeout(100); ok('diary search', (await p.textContent('#diary-stat')).includes('찾음'), await p.textContent('#diary-stat')); await p.fill('#diary-search', '');
  ok('calendar summary', (await p.textContent('#cal-summary')).includes('산책'), await p.textContent('#cal-summary'));
  ok('weather chip', !(await p.evaluate(() => document.getElementById('weather-chip').hidden)), await p.textContent('#weather-chip'));
  await p.click('.diary-item'); await p.waitForTimeout(200); await p.click('#sheet-edit'); await p.fill('#ed-title', '고친 제목'); await p.click('#ed-save'); await p.waitForTimeout(300);
  ok('edit diary', (await p.textContent('#sheet-title')) === '고친 제목'); await p.click('#sheet-close');
  await p.click('#export-btn'); await p.waitForTimeout(200); ok('export text', (await p.inputValue('#export-text')).startsWith('감정정원 일기장')); await p.click('#export-x');
  const el = await p.$('#garden3d'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
  await p.click('#photo-btn'); await p.waitForTimeout(1500); ok('photo card', await p.evaluate(() => document.getElementById('photo-img').naturalWidth === 1080)); await p.click('#photo-x');
  await p.evaluate(() => { window.__dbg.controls.autoRotate = false; });
  const pt = await p.evaluate(() => { const d = window.__dbg; const v = d.whale.position.clone().project(d.camera); const r = d.renderer.domElement.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; });
  await p.mouse.click(pt[0], pt[1]); await p.waitForTimeout(300); ok('whale gift', (await p.textContent('#walk-tip')).includes('고래'), await p.textContent('#walk-tip'));
  await p.waitForTimeout(1600); // let the whale's petals save first (the shop list redraws when they do)
  await p.click('#wallet-chip'); await p.waitForTimeout(200);
  const rows = await p.$$('#shop-list .shop-item'); await (await rows[0].$('button.primary')).click(); await p.waitForTimeout(300);
  const sp = await p.evaluate(() => { const d = window.__dbg, R = d.R(); const v = new d.camera.position.constructor(Math.cos(0.4) * 0.5 * R, 0, Math.sin(0.4) * 0.5 * R).project(d.camera); const r = d.renderer.domElement.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; });
  const before = await p.evaluate(() => window.__dbg.decor().children.length);
  await p.mouse.click(sp[0], sp[1]); await p.waitForTimeout(500);
  ok('buy + place decoration', await p.evaluate(() => window.__dbg.decor().children.length) === before + 1);
  for (const t of ['밤', '낮']) { for (let i = 0; i < 4; i++) { if ((await p.getAttribute('#time-btn', 'aria-label')).includes(t)) break; await p.click('#time-btn'); } }
  await p.click('#season-btn'); await p.click('#music-btn'); await p.waitForTimeout(800); ok('music on', (await p.textContent('#music-btn')).includes('끄기')); await p.click('#music-btn');
  await p.click('#walk-btn'); await p.waitForTimeout(2300);
  const items = await p.evaluate(() => window.__dbg.items().map(c => [c.position.x, c.position.z]));
  for (const [x, z] of items) { await p.evaluate(([x, z]) => { window.__dbg.walker.x = x + 0.3; window.__dbg.walker.z = z; }, [x, z]); await p.waitForTimeout(600); }
  if (await p.evaluate(() => document.getElementById('letter').open)) await p.click('#letter-close');
  ok('walk hunt', (await p.textContent('#hunt-chip')).split('찾음').length === 3, await p.textContent('#hunt-chip'));
  await p.click('#exit-walk'); await p.waitForTimeout(1800);
  await p.selectOption('#bday-month', '2'); await p.click('#bday-save'); await p.waitForTimeout(300); ok('birthday flower', (await p.textContent('#bday-flower-name')).includes('제비꽃'));
  ok('no page errors', errs.length === 0, errs.join(' | '));
  await b.close();
  if (fails) process.exitCode = 1;
})();
