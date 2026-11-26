// 감정정원 · 배경음악, 자연 소리, 효과음 (브라우저가 직접 연주)
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// ---------- Music: a generative ambient score played live by the browser ----------
const Music = (() => {
  const KEYS = {
    spring: { root: 60, steps: [0, 2, 4, 7, 9], chords: [[0, 4, 7, 11], [9, 12, 16, 19], [5, 9, 12, 16], [7, 11, 14, 17]] },
    summer: { root: 62, steps: [0, 2, 4, 7, 9], chords: [[0, 4, 7, 14], [5, 9, 12, 16], [-3, 0, 4, 7], [7, 11, 14, 19]] },
    autumn: { root: 57, steps: [0, 3, 5, 7, 10], chords: [[0, 3, 7, 10], [5, 8, 12, 15], [-4, 0, 3, 7], [-2, 2, 5, 9]] },
    winter: { root: 64, steps: [0, 2, 7, 9, 11], chords: [[0, 7, 11, 14], [-3, 4, 9, 12], [-7, 0, 4, 11], [-5, 2, 7, 11]] },
  };
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const env = () => (g3d && g3d.env) ? g3d.env() : { sky: skyForNow(), season: seasonForNow() };
  let ctx = null, master, music, amb, sfxBus, verb, delay, on = false, timer = null;
  let nextNote = 0, nextChord = 0, chordIdx = 0, nextBird = 0, nextBug = 0, wind = null, windGain = null, noiseBuf = null, rainSrc = null, rainGain = null;
  let volume = 0.6;
  try { const v = parseFloat(localStorage.getItem("emotion-garden-volume")); if (v >= 0 && v <= 1) volume = v; } catch (e) {}
  $("music-vol").value = Math.round(volume * 100);

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.connect(master);
    // soft hall reverb from a generated impulse
    verb = ctx.createConvolver();
    const len = ctx.sampleRate * 3.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    verb.buffer = ir; const verbOut = ctx.createGain(); verbOut.gain.value = 0.55; verb.connect(verbOut).connect(comp);
    delay = ctx.createDelay(2); delay.delayTime.value = 0.42; const fb = ctx.createGain(); fb.gain.value = 0.32; const dTone = ctx.createBiquadFilter(); dTone.type = "lowpass"; dTone.frequency.value = 2200;
    delay.connect(dTone).connect(fb).connect(delay); const dOut = ctx.createGain(); dOut.gain.value = 0.35; dTone.connect(dOut).connect(comp);
    music = ctx.createGain(); music.gain.value = 0.8; music.connect(comp); music.connect(verb);
    amb = ctx.createGain(); amb.gain.value = 0.7; amb.connect(comp); amb.connect(verb);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(comp); sfxBus.connect(verb);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0); let b = 0; for (let i = 0; i < nd.length; i++) { b = 0.97 * b + 0.03 * (Math.random() * 2 - 1); nd[i] = b * 6; }
  }
  function tone(freq, t, dur, { type = "sine", gain = 0.1, attack = 0.02, bus = music, pan = 0, toDelay = false, glideTo = 0 } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + Math.min(dur, 0.25));
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); let out = g; if (p) { p.pan.value = pan; g.connect(p); out = p; }
    out.connect(bus); if (toDelay) out.connect(delay);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function pad(notes, t, dur, night) {
    const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = night ? 650 : 1000; f.Q.value = 0.5;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 3); g.gain.setValueAtTime(0.05, t + dur - 3.5); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    f.connect(g).connect(music);
    notes.forEach((m, i) => {
      for (const det of [-6, 6]) { const o = ctx.createOscillator(); o.type = i === 0 ? "triangle" : "sine"; o.frequency.value = mtof(m); o.detune.value = det; o.connect(f); o.start(t); o.stop(t + dur + 0.1); }
    });
  }
  function schedule() {
    if (!ctx) return;
    const now = ctx.currentTime, ahead = now + 0.6, { sky, season } = env(), key = KEYS[season] || KEYS.spring, night = sky === "night";
    // if timers were paused (app in background), never replay the missed notes all at once
    if (nextNote < now - 0.2) nextNote = now + 0.3;
    if (nextChord < now - 0.2) nextChord = now + 0.1;
    if (nextBird < now - 0.2) nextBird = now + 2 + Math.random() * 4;
    if (nextBug < now - 0.2) nextBug = now + 1;
    while (nextChord < ahead) {
      const ch = key.chords[chordIdx++ % key.chords.length];
      pad(ch.map(x => key.root - 12 + x), nextChord, 10.5, night); nextChord += 8;
    }
    while (nextNote < ahead) {
      const oct = night ? 0 : 12, pick = () => key.root + oct + key.steps[Math.floor(Math.random() * key.steps.length)] + (Math.random() < 0.25 ? 12 : 0);
      const n1 = pick();
      tone(mtof(n1), nextNote, 2.8, { gain: night ? 0.05 : 0.07, attack: 0.01, pan: Math.random() * 0.8 - 0.4, toDelay: true });
      tone(mtof(n1) * 2, nextNote, 1.2, { gain: 0.012, attack: 0.005 });
      if (Math.random() < 0.22) tone(mtof(pick()), nextNote + 0.38, 2.4, { gain: 0.045, toDelay: true, pan: Math.random() * 0.8 - 0.4 });
      nextNote += (night ? 2.6 : 1.4) + Math.random() * (night ? 3 : 2.2);
    }
    // nature: birds by day, crickets at night, wind in winter (and lightly in autumn)
    const birds = !night && sky !== "dusk" && season !== "winter", bugs = night && season !== "winter";
    if (birds) while (nextBird < ahead) {
      const pan = Math.random() * 1.6 - 0.8, base = 2300 + Math.random() * 1500, n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) tone(base, nextBird + i * 0.13, 0.1, { gain: 0.018, attack: 0.008, bus: amb, pan, glideTo: base * (1.25 + Math.random() * 0.3) });
      nextBird += 4 + Math.random() * 7;
    } else nextBird = Math.max(nextBird, now);
    if (bugs) while (nextBug < ahead) {
      const pan = Math.random() * 1.4 - 0.7;
      for (let i = 0; i < 3; i++) tone(4300, nextBug + i * 0.045, 0.035, { gain: 0.006, attack: 0.004, bus: amb, pan });
      nextBug += 0.8 + Math.random() * 0.9;
    } else nextBug = Math.max(nextBug, now);
    const windLevel = season === "winter" ? 0.14 : season === "autumn" ? 0.05 : 0;
    if (windLevel && !wind) {
      wind = ctx.createBufferSource(); wind.buffer = noiseBuf; wind.loop = true;
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 420; bp.Q.value = 0.6;
      windGain = ctx.createGain(); windGain.gain.value = 0.0001; wind.connect(bp).connect(windGain).connect(amb); wind.start();
    }
    if (wind) {
      const target = windLevel ? windLevel * (0.5 + Math.random() * 0.8) : 0.0001;
      windGain.gain.setTargetAtTime(target, now, 1.8);
      if (!windLevel && windGain.gain.value < 0.001) { wind.stop(); wind = null; }
    }
    const raining = env().weather === "rain";
    if (raining && !rainSrc) {
      rainSrc = ctx.createBufferSource(); rainSrc.buffer = noiseBuf; rainSrc.loop = true; rainSrc.playbackRate.value = 1.7;
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1400; const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 7000;
      rainGain = ctx.createGain(); rainGain.gain.value = 0.0001; rainSrc.connect(hp).connect(lp).connect(rainGain).connect(amb); rainSrc.start();
    }
    if (rainSrc) {
      rainGain.gain.setTargetAtTime(raining ? 0.09 : 0.0001, now, 1.2);
      if (!raining && rainGain.gain.value < 0.001) { rainSrc.stop(); rainSrc = null; }
    }
  }
  async function start() {
    if (!ctx) build();
    try { await ctx.resume(); } catch (e) {}
    const t = ctx.currentTime; nextNote = t + 0.4; nextChord = t + 0.1; nextBird = t + 2; nextBug = t + 1;
    master.gain.cancelScheduledValues(t); master.gain.setTargetAtTime(volume, t, 0.8);
    clearInterval(timer); timer = setInterval(schedule, 200); schedule();
    on = true; quiet = false; sync();
  }
  function stop() {
    if (!ctx) return;
    const t = ctx.currentTime; master.gain.cancelScheduledValues(t); master.gain.setTargetAtTime(0.0001, t, 0.4);
    clearInterval(timer); timer = null; on = false; sync();
    setTimeout(() => { if (!on && ctx) ctx.suspend().catch(() => {}); }, 1500);
  }
  function sync() {
    $("music-btn").textContent = on ? "🎵 음악 끄기" : "🎵 음악 켜기"; $("music-btn").setAttribute("aria-pressed", String(on));
    setIcon($("music-chip"), on ? "musicOn" : "musicOff", on ? "음악 끄기" : "음악 켜기"); $("music-chip").setAttribute("aria-pressed", String(on));
    $("music-vol-wrap").hidden = !on;
  }
  const toggle = () => { const was = on; if (was) stop(); else start(); if (g3d && g3d.tip) g3d.tip(was ? "🔇 음악을 껐어요" : "🎵 음악을 켰어요", true); };
  sync();
  $("music-btn").addEventListener("click", toggle);
  $("music-chip").addEventListener("click", toggle);
  $("music-vol").addEventListener("input", () => {
    volume = $("music-vol").value / 100;
    try { localStorage.setItem("emotion-garden-volume", String(volume)); } catch (e) {}
    if (on && ctx) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.1);
  });
  // leaving the app: silence first, then suspend. A phone can freeze the page a moment after it is hidden while the
  // speaker is still open; it then repeats the last bit of sound as a "beep". So the fade is very short, it starts at
  // the earliest sign (losing focus), and the suspend follows right away.
  let quiet = false;
  function fadeOut(sec) {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), t);
    master.gain.linearRampToValueAtTime(0.0001, t + sec); master.gain.setValueAtTime(0, t + sec + 0.005);
  }
  function hush() {
    if (!ctx || !on) return;
    clearInterval(timer); timer = null; quiet = true;
    fadeOut(0.025);
    if (wind) { try { wind.stop(ctx.currentTime + 0.04); } catch (e) {} wind = null; }
    if (rainSrc) { try { rainSrc.stop(ctx.currentTime + 0.04); } catch (e) {} rainSrc = null; }
    setTimeout(() => { if (quiet && ctx) ctx.suspend().catch(() => {}); }, 40);
  }
  function wake() {
    if (!ctx || !on || document.hidden) return;
    quiet = false;
    ctx.resume().then(() => {
      if (quiet) return;
      const t = ctx.currentTime;
      nextNote = t + 0.6; nextChord = t + 0.2; nextBird = t + 3; nextBug = t + 2;
      master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(0.0001, t); master.gain.setTargetAtTime(volume, t + 0.1, 0.8);
      clearInterval(timer); timer = setInterval(schedule, 200);
    }).catch(() => {});
  }
  // losing focus comes before the page is hidden when the app goes to the background: turn the sound down then,
  // and bring it back if the page comes straight back (a tap on the page also counts)
  let blurHush = null;
  addEventListener("blur", () => { if (!ctx || !on || quiet) return; fadeOut(0.03); clearTimeout(blurHush); blurHush = setTimeout(() => { if (!document.hasFocus()) hush(); }, 400); });
  function unblur() { clearTimeout(blurHush); if (!ctx || !on || document.hidden) return; if (quiet) wake(); else { const t = ctx.currentTime; master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), t); master.gain.setTargetAtTime(volume, t, 0.3); } }
  addEventListener("focus", unblur);
  document.addEventListener("pointerdown", unblur, true);
  document.addEventListener("visibilitychange", () => { if (document.hidden) hush(); else wake(); });
  addEventListener("pagehide", hush);
  addEventListener("pageshow", wake);
  document.addEventListener("freeze", hush);
  function sfx(name) {
    if (!on || !ctx) return;
    const t = ctx.currentTime + 0.02, key = KEYS[env().season] || KEYS.spring, r = key.root + 12;
    if (name === "water") for (let i = 0; i < 3; i++) tone(1300 - i * 180, t + i * 0.11, 0.18, { gain: 0.06, attack: 0.004, bus: sfxBus, glideTo: 420 - i * 40, pan: (i - 1) * 0.3 });
    if (name === "plant") { tone(mtof(r - 12), t, 0.6, { type: "triangle", gain: 0.08, bus: sfxBus }); tone(mtof(r + key.steps[2]), t + 0.12, 1.6, { gain: 0.06, bus: sfxBus, toDelay: true }); }
    if (name === "bloom") key.steps.concat([12, 14]).forEach((st, i) => tone(mtof(r + st), t + i * 0.09, 1.8, { gain: 0.06, bus: sfxBus, toDelay: true, pan: (i / 6) - 0.5 }));
    if (name === "whale") { const w0 = mtof(key.root - 24); tone(w0, t, 2.6, { type: "sine", gain: 0.09, attack: 0.5, bus: sfxBus, toDelay: true, glideTo: w0 * 1.5 }); tone(w0 * 1.5, t + 1.6, 2.8, { type: "sine", gain: 0.07, attack: 0.6, bus: sfxBus, toDelay: true, glideTo: w0 * 1.12 }); tone(w0 * 3, t + 0.3, 1.8, { type: "triangle", gain: 0.012, attack: 0.4, bus: sfxBus, glideTo: w0 * 4 }); }
    if (name === "collect") { tone(mtof(r + 24), t, 0.5, { gain: 0.05, bus: sfxBus, toDelay: true }); tone(mtof(r + 28), t + 0.07, 0.6, { gain: 0.04, bus: sfxBus, toDelay: true }); }
    if (name === "chime") for (let i = 0; i < 4; i++) { const m = r + 12 + key.steps[Math.floor(Math.random() * key.steps.length)]; tone(mtof(m), t + i * 0.13 + Math.random() * 0.05, 2.6, { gain: 0.045, bus: sfxBus, toDelay: true, pan: Math.random() - 0.5 }); tone(mtof(m) * 2.76, t + i * 0.13, 0.8, { gain: 0.01, bus: sfxBus }); }
    if (name === "letter") { for (const [m, d] of [[r + 16, 0], [r + 11, 0.32]]) { tone(mtof(m), t + d, 2.4, { gain: 0.07, bus: sfxBus, toDelay: true }); tone(mtof(m) * 2.76, t + d, 0.8, { gain: 0.012, bus: sfxBus }); } }
  }
  return { sfx, isOn: () => on };
})();
