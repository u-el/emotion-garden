// 감정정원 · 정원지기와 이야기하기
// (js/ 폴더의 파일들은 번호 순서대로 불러와요. 앞 파일에서 만든 이름을 뒤 파일에서 그대로 써요.)

// The conversation lives only in this page: it is not saved, and closing the window starts over.
const chat = { history: [], busy: false, ctl: null };
const CHAT_MAX = 300;

function gardenContext() {
  const recent = entries.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
    .map(e => `- ${md(e.date)} "${e.title}": ${e.emotions.map(x => `${E[x.n][0]}(${x.s})`).join(", ")}`).join("\n");
  const thirsty = entries.filter(needsWater).length, bloomed = entries.filter(e => stageOf(e) === 3).length;
  const w = mindWeather(), ev = eventNow();
  return [
    `오늘: ${md(today())}`,
    `정원: 식물 ${entries.length}그루, 핀 꽃 ${bloomed}송이, 물을 기다리는 식물 ${thirsty}그루, 마음 날씨 ${w.label}` + (ev ? `, 지금 ${EVENTS[ev].name} 중` : ""),
    entries.length ? `최근 일기:\n${recent}` : "아직 일기가 없어요.",
  ].join("\n");
}
function chatInstructions() {
  return `너는 '감정정원'이라는 감정 일기 게임의 정원지기야. 밀짚모자를 쓰고 하늘에 떠 있는 작은 섬 정원을 돌보는 다정한 존재야.
사용자와 짧게 이야기를 나눠 줘.

말하는 법:
- 존댓말로, 따뜻하고 담백하게. 한 번에 2~4문장, 200자 이내.
- 사용자의 마음을 먼저 알아주고, 필요하면 한 가지만 부드럽게 물어봐 줘.
- 상담사나 의사가 아니니 진단하거나 처방하지 마. 오래 힘든 마음이면 믿을 만한 사람이나 전문가와 이야기해 보길 권해 줘.
- 스스로를 해치고 싶다는 말이 나오면, 혼자 견디지 말고 자살예방상담전화 109(24시간)나 가까운 사람에게 꼭 이야기해 보라고 분명하고 다정하게 전해 줘.
- 정원 이야기(꽃, 물 주기, 하늘고래, 계절)를 가끔 자연스럽게 섞어도 좋아. 정원 기록에 없는 사실은 지어내지 마.
- 일기를 써 보라고 지나치게 권하지는 마.

정원 기록:
${gardenContext()}`;
}
function chatBubble(role, text) {
  const div = document.createElement("div"); div.className = role === "user" ? "chat-me" : "chat-g";
  if (role !== "user") { const n = document.createElement("b"); n.textContent = "정원지기"; div.append(n); }
  const p = document.createElement("p"); p.textContent = text; div.append(p);
  $("chat-log").append(div); $("chat-log").scrollTop = $("chat-log").scrollHeight;
  return p;
}
function openChat() {
  if (!$("chat-dlg").open) {
    if (!chat.history.length) {
      $("chat-log").textContent = "";
      const hello = entries.length ? `안녕하세요. ${gardenerLine()} 오늘은 어떤 이야기를 하고 싶어요?` : "안녕하세요, 저는 이 정원의 정원지기예요. 오늘 마음이 어떤지 편하게 들려주세요.";
      chat.history.push({ role: "assistant", content: hello }); chatBubble("assistant", hello);
    }
    $("chat-note").textContent = sample ? "대화는 저장되지 않아요. 창을 닫았다 열면 이어지고, 새로고침하면 사라져요." : "지금은 정원지기가 짧게만 대답할 수 있어요. (claude.ai에 로그인하면 더 이야기할 수 있어요)";
    $("chat-dlg").showModal();
  }
  setTimeout(() => $("chat-input").focus(), 50);
}
function fallbackReply(text) {
  const r = readByWords(text), fam = E[r.emotions[0].n][1];
  return r.emotions[0].n === UNKNOWN ? "이야기해 줘서 고마워요. 그 마음을 조금 더 들려줄래요? 오늘 있었던 일을 일기로 적어 두면 정원에 씨앗으로 심을 수도 있어요." : `${iga(E[r.emotions[0].n][0])} 느껴져요. ${FAMILY_NOTE[fam]}`;
}
async function sendChat() {
  const box = $("chat-input"), text = box.value.trim().slice(0, CHAT_MAX);
  if (!text || chat.busy) return;
  box.value = ""; chat.busy = true; $("chat-send").disabled = true;
  chatBubble("user", text); chat.history.push({ role: "user", content: text });
  fillSafety($("chat-safety"), chat.history.filter(m => m.role === "user").map(m => m.content).join(" "));
  const p = chatBubble("assistant", "…");
  let reply = "";
  if (sample) {
    // the request carries no memory, so send the instructions and the recent turns each time (it must start and end with the person)
    const turns = chat.history.slice(-12), msgs = [];
    for (const m of turns) { if (!msgs.length && m.role !== "user") continue; msgs.push({ role: m.role, content: m.content }); }
    msgs[0] = { role: "user", content: chatInstructions() + "\n\n사용자: " + msgs[0].content };
    chat.ctl = new AbortController();
    try {
      const r = await sample(msgs, { modelTier: "default", cache: false, signal: chat.ctl.signal, onText: ({ text: t }) => { p.textContent = t || "…"; $("chat-log").scrollTop = $("chat-log").scrollHeight; } });
      reply = String(r.text || "").trim();
    } catch (err) {
      if (err && err.code === "not_granted") sample = null;
      if (err && err.code === "rate_limited") reply = "잠깐 쉬었다가 다시 이야기해요. 조금 뒤에 말을 걸어 주세요.";
    }
  }
  if (!reply) reply = fallbackReply(text);
  p.textContent = reply; chat.history.push({ role: "assistant", content: reply });
  chat.busy = false; $("chat-send").disabled = false; box.focus();
}
$("chat-send").addEventListener("click", sendChat);
$("chat-input").addEventListener("keydown", ev => { if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); sendChat(); } });
$("chat-x").addEventListener("click", () => { if (chat.ctl) chat.ctl.abort(); $("chat-dlg").close(); });
$("chat-reset").addEventListener("click", () => { if (chat.ctl) chat.ctl.abort(); chat.history = []; chat.busy = false; $("chat-send").disabled = false; $("chat-safety").hidden = true; $("chat-dlg").close(); openChat(); });
$("chat-btn").addEventListener("click", openChat);
