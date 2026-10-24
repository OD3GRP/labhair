/* Labhair: speak Ulster Irish. Plain JS, no build step. */
'use strict';

/* ---------- Small helpers ---------- */
const $app = document.getElementById('app');
function h(tag, props, ...kids){
  const el = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)){
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()){ if (k == null || k === false) continue; el.append(k.nodeType ? k : document.createTextNode(String(k))); }
  return el;
}
// Append children the way h() does: arrays flattened, null/false skipped.
function put(el, ...kids){
  for (const k of kids.flat()){ if (k == null || k === false) continue; el.append(k.nodeType ? k : document.createTextNode(String(k))); }
  return el;
}
function icon(d, size = 20){
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [k, v] of Object.entries({width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2.4', 'stroke-linecap':'round', 'stroke-linejoin':'round', 'aria-hidden':'true'})) s.setAttribute(k, v);
  s.innerHTML = d; return s;
}
const I = {
  check:'<path d="M5 12l5 5L20 7"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>',
  speaker:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'
};
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};
const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const today = () => ymd(new Date());
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return ymd(d); };

/* ---------- Answer checking ---------- */
const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const toWords = s => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[-–—]/g, ' ').replace(/[.,!?"“”:;()…]/g, ' ').split(/\s+/).filter(Boolean);
function grade(expected, said){
  const exp = toWords(expected), got = toWords(said), used = got.map(() => false);
  const res = exp.map(w => {
    let i = got.findIndex((g, j) => !used[j] && g === w);
    if (i >= 0){ used[i] = true; return {w, s:'ok'}; }
    i = got.findIndex((g, j) => !used[j] && strip(g) === strip(w));
    if (i >= 0){ used[i] = true; return {w, s:'fada'}; }
    return {w, s:'miss'};
  });
  const score = res.reduce((a, r) => a + (r.s === 'ok' ? 1 : r.s === 'fada' ? 0.5 : 0), 0) / res.length;
  return {res, score, said};
}

/* ---------- Settings and progress (stored on this phone) ---------- */
const DEFAULT_SETTINGS = { key:'', model:'claude-sonnet-5-5', lang:'ga-IE', autoSend:false, voiceCheck:'speech', azureKey:'', azureRegion:'', autoPlay:true };
let settings = {...DEFAULT_SETTINGS, ...store.get('labhair-settings', {})};
const saveSettings = () => store.set('labhair-settings', settings);
// Profiles: one per person on this phone, each with its own progress. Kids get kid mode and no settings.
// The first profile is Stiofán's and takes over the progress saved before profiles existed.
const AVATARS = ['🦊', '🐇', '🐦', '🦡', '🐬', '🐑', '🐄', '🦉', '🐝', '🐞', '🐢', '🐙'];
let profiles = store.get('labhair-profiles', null);
if (!profiles){
  profiles = {current:'p1', list:[{id:'p1', name:window.LEARNER.ga, kind:'adult', band:'', dialect:'u', avatar:'🦊'}]};
  const old = store.get('labhair-progress', null);
  if (old) store.set('labhair-progress:p1', old);
  store.set('labhair-profiles', profiles);
}
const saveProfiles = () => store.set('labhair-profiles', profiles);
const me = () => profiles.list.find(p => p.id === profiles.current) || profiles.list[0];
const isKid = () => me().kind === 'kid';
// Who Gráinne is talking to. Stiofán's vocative is in content.js; other names are used as typed.
const learner = () => me().id === 'p1' ? window.LEARNER : {ga:me().name, en:me().name, vocative:me().name};
const blankProgress = () => ({done:{}, streak:0, lastDay:'', said:0, items:{}});
const loadProgress = id => ({...blankProgress(), ...store.get('labhair-progress:' + id, {})});
let progress = loadProgress(me().id);
const saveProgress = () => store.set('labhair-progress:' + me().id, progress);
function switchProfile(id){
  profiles.current = id; saveProfiles();
  progress = loadProgress(id);
  dropTakes(); view = {name:'home'}; render(); window.scrollTo(0, 0);
}
function bumpStreak(){
  const t = today();
  if (progress.lastDay !== t){ progress.streak = progress.lastDay === yesterday() ? progress.streak + 1 : 1; progress.lastDay = t; }
}
function markDone(id){
  progress.done = {...progress.done, [id]: true};
  bumpStreak(); saveProgress();
}
const currentStreak = () => (progress.lastDay === today() || progress.lastDay === yesterday()) ? progress.streak : 0;
const allLessons = () => window.UNITS.flatMap(u => u.lessons.map(l => ({...l, unit:u})));

/* ---------- Review: a score per phrase, keyed on its Irish text ---------- */
// Leitner boxes: a pass moves an item up a box and pushes it further out; a miss sends it back to box 0, due today.
const INTERVALS = [0, 1, 3, 7, 14, 30]; // days until due again, by box
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
const itemStats = () => progress.items || (progress.items = {});
function noteItem(ga, score){
  const s = itemStats()[ga] || {box:0, due:today()};
  if (score >= 0.85){ s.box = Math.min(s.box + 1, INTERVALS.length - 1); s.due = addDays(INTERVALS[s.box]); }
  else { s.box = 0; s.due = today(); }
  s.last = score; itemStats()[ga] = s; saveProgress();
}
// Every phrase and drill answer from lessons you've finished. n matches the audio file numbering.
function learnedItems(){
  const seen = new Set(), out = [];
  for (const L of allLessons()){
    if (L.checkpoint || !progress.done[L.id]) continue;
    const add = (ga, en, sound, n) => { if (!seen.has(ga)){ seen.add(ga); out.push({ga, en, sound, L, n}); } };
    L.phrases.forEach((p, i) => add(p[0], p[1], p[2], i + 1));
    L.drills.forEach((d, j) => add(d[1], d[0], '', L.phrases.length + j + 1));
  }
  return out;
}
const isDue = it => { const s = itemStats()[it.ga]; return !s || s.due <= today(); };
// Today's set: due items first (lowest box, then worst last score), topped up with the least-practised others.
const REVIEW_SIZE = 10;
function pickReview(){
  const rank = it => { const s = itemStats()[it.ga] || {box:0, last:0}; return s.box * 10 + (s.last || 0); };
  const all = learnedItems();
  const due = all.filter(isDue).sort((a, b) => rank(a) - rank(b));
  const rest = all.filter(it => !isDue(it)).sort((a, b) => rank(a) - rank(b));
  const pick = due.concat(rest).slice(0, REVIEW_SIZE);
  for (let i = pick.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [pick[i], pick[j]] = [pick[j], pick[i]]; }
  // New or shaky items: hear and repeat. Items you know: build from the English.
  return pick.map(it => ({...it, mode: ((itemStats()[it.ga] || {}).box || 0) >= 2 ? 'build' : 'say'}));
}

/* ---------- Speech: recognition (mic) and Irish voice if the phone has one ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let activeRec = null;
function stopMic(){ if (activeRec){ try { activeRec.abort(); } catch(e){} activeRec = null; } }
function micError(code){
  return ({
    'not-allowed':'Microphone is blocked. In Chrome, tap the icon left of the address and allow the microphone, then try again.',
    'service-not-allowed':'Microphone is blocked. Allow it for this site in Chrome settings, then try again.',
    'language-not-supported':'This phone can’t recognise Irish yet. Try another language in Settings, or type your answer.',
    'no-speech':'I didn’t hear anything. Tap the mic and try again.',
    'audio-capture':'No microphone found. Check another app isn’t using it.',
    'network':'Speech recognition needs an internet connection.'
  })[code] || 'The mic stopped (' + code + '). Tap it to try again.';
}
let gaVoice = null;
function loadVoices(){ try { gaVoice = speechSynthesis.getVoices().find(v => /^ga\b|^ga-/i.test(v.lang)) || null; } catch(e){ gaVoice = null; } }
if ('speechSynthesis' in window){ loadVoices(); speechSynthesis.addEventListener('voiceschanged', loadVoices); }
function speak(text){
  if (!gaVoice) return;
  const u = new SpeechSynthesisUtterance(text); u.voice = gaVoice; u.lang = gaVoice.lang; u.rate = 0.9;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}

// Pre-made phrase audio (ABAIR). audio/index.json maps "lessonId/n.mp3" to its text; n counts phrases, then drill answers.
let audioIndex = null;
fetch('audio/index.json').then(r => r.ok ? r.json() : null).then(j => { audioIndex = j; if (j && view.name === 'lesson' && !activeRec) render(); }).catch(() => {});
function audioFor(L, n, text){
  const rel = L.id + '/' + n + '.mp3';
  return audioIndex && audioIndex.files && audioIndex.files[rel] === text ? 'audio/' + rel : null;
}
const player = new Audio();
function playAudio(src){ try { speechSynthesis.cancel(); } catch(e){} player.onended = null; player.src = src; player.currentTime = 0; player.play().catch(() => {}); }
// Play several clips one after another (native, then my take).
function playSeq(srcs){
  const [first, ...rest] = srcs;
  if (!first) return;
  playAudio(first);
  if (rest.length) player.onended = () => setTimeout(() => playSeq(rest), 350);
}
// A play button for a whole phrase: the ABAIR recording if we have one, else the phone's Irish voice, else nothing.
// Gráinne's voice: Azure Speech (ga-IE Orla) with your own key, else the phone's Irish voice, else silence.
const ttsCache = new Map();
function ssml(text){
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<speak version="1.0" xml:lang="ga-IE"><voice name="ga-IE-OrlaNeural"><prosody rate="-10%">' + esc + '</prosody></voice></speak>';
}
async function azureAudio(text){
  if (ttsCache.has(text)) return ttsCache.get(text);
  const res = await fetch('https://' + encodeURIComponent(settings.azureRegion) + '.tts.speech.microsoft.com/cognitiveservices/v1', {
    method:'POST',
    headers:{ 'Ocp-Apim-Subscription-Key':settings.azureKey, 'Content-Type':'application/ssml+xml', 'X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3' },
    body: ssml(text)
  });
  if (!res.ok) throw new Error('Azure ' + res.status);
  const url = URL.createObjectURL(await res.blob());
  ttsCache.set(text, url);
  return url;
}
async function sayGrainne(text){
  if (settings.azureKey && settings.azureRegion){
    try { playAudio(await azureAudio(text)); return; } catch(e){}
  }
  speak(text);
}
const canVoiceGrainne = () => !!(settings.azureKey && settings.azureRegion) || !!gaVoice;
function playBtn(src, text, props){
  if (!src && !gaVoice) return null;
  return h('button', {type:'button', 'aria-label':'Play: ' + text, ...props, onclick:() => src ? playAudio(src) : speak(text)}, icon(I.speaker, 16), 'Éist');
}

// The answer box: a text area plus a mic button that fills it with what you said.
function answerBox(label, onFinal){
  const ta = h('textarea', {id:'answer', rows:'2', autocomplete:'off', autocapitalize:'sentences', spellcheck:'false', lang:'ga', placeholder: SR ? 'Tap the mic and speak, or type' : 'Type your answer'});
  const status = h('p', {class:'miclabel', role:'status'}, SR ? 'Tap the mic and say it in Irish' : 'This browser has no speech recognition. Use Chrome on Android, or type.');
  let mic = null;
  if (SR){
    mic = h('button', {type:'button', class:'mic', 'aria-label':'Speak your answer', 'aria-pressed':'false', onclick: toggle}, icon(I.mic, 28));
  }
  function toggle(){
    if (activeRec){ activeRec.stop(); return; }
    // Stop any audio so the mic doesn't hear Gráinne or the phrase recording.
    player.pause(); try { speechSynthesis.cancel(); } catch(e){}
    stopRec(false);
    let finalText = '', failed = false;
    const r = new SR();
    r.lang = settings.lang; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
    r.onresult = e => {
      let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      ta.value = t;
      if (e.results[e.results.length - 1].isFinal) finalText = t;
    };
    r.onerror = e => { failed = true; status.textContent = micError(e.error); };
    r.onend = () => {
      activeRec = null; mic.classList.remove('on'); mic.setAttribute('aria-pressed', 'false');
      if (!failed) status.textContent = 'Tap the mic and say it in Irish';
      if (!failed && finalText.trim() && onFinal) onFinal(finalText.trim());
    };
    try { r.start(); activeRec = r; mic.classList.add('on'); mic.setAttribute('aria-pressed', 'true'); status.textContent = 'Ag éisteacht… · Listening. Tap again to stop.'; }
    catch(e){ status.textContent = 'Couldn’t start the mic. Tap to try again.'; }
  }
  return [h('label', {class:'lbl', for:'answer'}, label), h('div', {class:'answer'}, ta, mic), status];
}
const answerText = () => { const t = document.getElementById('answer'); return t ? t.value.trim() : ''; };

/* ---------- Record yourself (Abair é) ---------- */
const canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
let recorder = null, recTimer = null;
const takeUrls = [];
function dropTakes(){ while (takeUrls.length) URL.revokeObjectURL(takeUrls.pop()); }
// Stop recording. If keep is false (leaving the screen), the take is thrown away.
function stopRec(keep){
  if (!recorder) return;
  recorder.keep = keep;
  clearTimeout(recTimer);
  if (recorder.state === 'recording') recorder.stop();
}
function recErrorText(e){
  return e && e.name === 'NotAllowedError' ? 'Microphone is blocked. Allow it for this site in Chrome, then try again.'
    : e && e.name === 'NotFoundError' ? 'No microphone found.' : 'Couldn’t start recording. Try again.';
}
// onTake(url) gets an object URL for the recording; status is a <p> for messages.
async function startRec(btn, status, onTake){
  stopMic(); player.pause();
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true, noiseSuppression:true}}); }
  catch(e){ status.textContent = recErrorText(e); return; }
  if (!btn.isConnected){ stream.getTracks().forEach(t => t.stop()); return; } // left the screen while Chrome asked
  const chunks = [], r = new MediaRecorder(stream);
  r.keep = true;
  r.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
  r.onstop = () => {
    stream.getTracks().forEach(t => t.stop());
    if (recorder === r) recorder = null;
    if (!r.keep || !chunks.length) return;
    const url = URL.createObjectURL(new Blob(chunks, {type: r.mimeType || 'audio/webm'}));
    takeUrls.push(url); onTake(url);
  };
  r.start(); recorder = r;
  btn.classList.add('on'); btn.setAttribute('aria-pressed', 'true');
  btn.lastChild.textContent = 'Stad · Stop';
  status.textContent = 'Ag taifeadadh… · Recording. Tap Stop when you’ve said it.';
  recTimer = setTimeout(() => stopRec(true), 10000); // safety: stop after 10 seconds
}
function recordRow(native, take, onTake){
  if (!canRecord) return null;
  const status = h('p', {class:'miclabel', role:'status'}, take ? '' : 'Record yourself, then compare with Áine.');
  const btn = h('button', {type:'button', class:'btn rec', 'aria-pressed':'false', onclick:() => recorder ? stopRec(true) : startRec(btn, status, onTake)},
    h('span', {class:'dot', 'aria-hidden':'true'}), take ? 'Arís · Re-record' : 'Taifead · Record');
  return h('div', {class:'compare'},
    h('div', {class:'row'}, btn,
      take ? h('button', {type:'button', class:'btn', onclick:() => playAudio(take)}, icon(I.speaker, 16), 'Mise · Me') : null,
      take && native ? h('button', {type:'button', class:'btn primary grow', onclick:() => playSeq([native, take])}, 'Áine, then me') : null),
    status);
}

/* ---------- Claude (Gráinne) ---------- */
function parseJSON(text){
  try { return JSON.parse(text); } catch(e){}
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/); if (fence){ try { return JSON.parse(fence[1]); } catch(e){} }
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a >= 0 && b > a){ try { return JSON.parse(text.slice(a, b + 1)); } catch(e){} }
  throw {kind:'json'};
}
async function askClaude(system, messages, signal){
  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST', signal,
      headers:{ 'content-type':'application/json', 'x-api-key':settings.key, 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' },
      body: JSON.stringify({ model:settings.model, max_tokens:700, system, messages })
    });
  } catch(e){ if (e && e.name === 'AbortError') throw {kind:'cancelled'}; throw {kind:'network'}; }
  if (!res.ok){
    let msg = ''; try { msg = (await res.json()).error.message; } catch(e){}
    throw {kind: res.status === 401 ? 'key' : (res.status === 429 || res.status === 529) ? 'busy' : 'api', status:res.status, message:msg};
  }
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  return parseJSON(text);
}
function claudeErrorText(e){
  switch (e && e.kind){
    case 'key': return 'Your API key was rejected. Check it in Settings.';
    case 'busy': return 'Claude is busy or you’ve hit a rate limit. Wait a moment and tap Send again.';
    case 'network': return 'No connection. Check your internet and tap Send again.';
    case 'json': return 'Gráinne’s reply came back garbled. Tap Send again.';
    case 'api': return 'Claude returned an error (' + e.status + (e.message ? ': ' + e.message : '') + '). Check the model name in Settings.';
    default: return 'Something went wrong. Tap Send again.';
  }
}

/* ---------- Views ---------- */
let view = {name: profiles.list.length > 1 ? 'profiles' : 'home'};
const VIEWS = {home: () => isKid() ? kidHomeView() : homeView(), settings: () => settingsView(), review: () => reviewView(), profiles: () => profilesView(), lesson: () => lessonView()};
function render(){ stopMic(); stopRec(false); $app.replaceChildren((VIEWS[view.name] || VIEWS.home)()); }
const DIALECT_NAMES = {u:'Gaeilge Uladh', c:'Gaeilge Chonnacht', m:'Gaeilge na Mumhan'};
// A dialect can be chosen once its content file has loaded (content-c.js / content-m.js).
const dialectReady = d => d === 'u' || !!(window.DIALECTS && window.DIALECTS[d]);

// Kid mode home (filled in by kid mode; this is the fallback).
function kidHomeView(){
  return h('section', {class:'card', style:'align-items:center;text-align:center'},
    h('p', {style:'font-size:56px'}, me().avatar),
    h('p', {style:'font-weight:800;font-size:20px'}, 'Dia duit, ' + me().name + '!'),
    h('button', {type:'button', class:'btn', onclick:() => { view = {name:'profiles'}; render(); }}, 'Switch person'));
}
function goHome(){ if (view.chat && view.chat.ctl) view.chat.ctl.abort(); dropTakes(); view = {name:'home'}; render(); window.scrollTo(0, 0); }

function homeView(){
  const ls = allLessons(), doneCount = ls.filter(l => progress.done[l.id]).length;
  const next = ls.find(l => !progress.done[l.id]);
  const frag = document.createDocumentFragment();
  frag.append(
    h('div', {class:'top'},
      h('span', {class:'brand'}, 'Labhair'),
      h('div', {class:'row', style:'align-items:center'},
        h('span', {class:'chip'}, DIALECT_NAMES[me().dialect] || DIALECT_NAMES.u),
        h('button', {type:'button', class:'iconbtn avatar-btn', 'aria-label':'Switch person (' + me().name + ')', onclick:() => { view = {name:'profiles'}; render(); }}, me().avatar),
        h('button', {type:'button', class:'iconbtn', 'aria-label':'Settings', onclick:() => { view = {name:'settings'}; render(); }}, icon(I.gear)))),
    h('div', {class:'stats'},
      h('div', {class:'stat'}, h('b', null, currentStreak()), h('span', null, 'sraith · day streak')),
      h('div', {class:'stat'}, h('b', null, progress.said || 0), h('span', null, 'frásaí · phrases said')),
      h('div', {class:'stat'}, h('b', null, doneCount + '/' + ls.length), h('span', null, 'ceachtanna · lessons')))
  );
  if (!settings.key) frag.append(h('p', {class:'note'}, h('strong', null, 'One-time setup: '), 'add your Claude API key in Settings so you can chat with Gráinne. Lessons work without it.'));
  const learned = learnedItems();
  if (learned.length){
    const due = learned.filter(isDue).length, doneToday = progress.lastReview === today();
    frag.append(h('section', {class:'review-card', 'aria-label':'Daily review'},
      h('div', null,
        h('span', {class:'eyebrow', style:'color:var(--gorse-text)'}, 'Athbhreithniú laethúil · Daily review'),
        h('p', {class:'rc-main'}, doneToday ? 'Déanta inniu ✓ · Done for today' : due ? 'Le hathbhreithniú: ' + due : 'Níl aon rud le déanamh'),
        h('p', {class:'en', style:'font-size:14px'}, doneToday ? 'Come back tomorrow, or practise a few more now.' : due ? Math.min(due, REVIEW_SIZE) + ' phrases due · about 3 minutes' : 'Nothing due. Practise anyway?')),
      h('button', {type:'button', class:'btn ' + (doneToday || !due ? '' : 'primary'), onclick:openReview}, doneToday || !due ? 'Practise more' : 'Tosaigh · Start')));
  }
  for (const U of window.UNITS){
    const done = U.lessons.filter(l => progress.done[l.id]).length;
    frag.append(
      h('section', {class:'unit', 'aria-label':'Unit ' + U.num},
        h('span', {class:'eyebrow'}, 'Aonad ' + U.num),
        h('h1', null, U.ga),
        h('p', null, U.en),
        h('div', {class:'bar', role:'progressbar', 'aria-valuemin':'0', 'aria-valuemax':String(U.lessons.length), 'aria-valuenow':String(done)},
          h('i', {style:'width:' + Math.round(done / U.lessons.length * 100) + '%'}))),
      h('div', {class:'lessons'}, U.lessons.map((L, i) => {
        const isDone = !!progress.done[L.id], isNext = next && L.id === next.id;
        return h('button', {type:'button', class:'lesson-row' + (isDone ? ' done' : '') + (isNext ? ' next' : ''), onclick:() => openLesson(L.id)},
          h('span', {class:'badge'}, isDone ? icon(I.check) : (L.checkpoint ? '★' : String(i + 1))),
          h('span', {class:'txt'}, h('strong', {lang:'ga'}, L.ga), h('small', null, L.en + ' · ' + L.goal)));
      }))
    );
  }
  return frag;
}

function openLesson(id){
  const L = allLessons().find(l => l.id === id);
  const steps = L.checkpoint ? ['Comhrá', 'Críoch'] : ['Abair é', 'Tóg é', 'Comhrá', 'Críoch'];
  dropTakes();
  view = {name:'lesson', L, steps, step:0, idx:0, check:null, reveal:false, said:[], drills:[], takes:{},
    chat:{msgs:[{who:'g', ga:L.chat.opener, en:L.chat.openerEn}], turns:[], goalsMet:[], done:false, busy:false, error:'', ctl:null},
    review:null};
  render(); window.scrollTo(0, 0);
}

function lessonView(){
  const v = view, L = v.L, frag = document.createDocumentFragment();
  const idxInUnit = L.unit.lessons.findIndex(l => l.id === L.id) + 1;
  frag.append(
    h('div', {class:'lhead'},
      h('button', {type:'button', class:'iconbtn', 'aria-label':'Close lesson', onclick:goHome}, icon(I.x)),
      h('div', {class:'steps', style:'grid-template-columns:repeat(' + v.steps.length + ',minmax(0,1fr))'},
        v.steps.map((s, i) => h('div', {class: i < v.step ? 'past' : i === v.step ? 'on' : ''}, h('span', null, s))))),
    h('div', null,
      h('span', {class:'eyebrow', style:'color:var(--green-text)'}, 'Aonad ' + L.unit.num + ' · ' + (L.checkpoint ? 'Seicphointe' : 'Ceacht ' + idxInUnit)),
      h('h2', {style:'font-size:22px;font-weight:800', lang:'ga'}, L.ga),
      h('p', {class:'en'}, L.goal))
  );
  const s = v.steps[v.step];
  frag.append(s === 'Abair é' ? sayStep() : s === 'Tóg é' ? buildStep() : s === 'Comhrá' ? talkStep() : reviewStep());
  return frag;
}

function resultBlock(check){
  if (!check) return null;
  const msg = check.score >= 0.85 ? 'Maith thú! · Well done' : check.score >= 0.5 ? 'Beagnach! · Nearly, check the highlighted words' : 'Arís? · Have another go';
  return h('div', {style:'display:flex;flex-direction:column;gap:8px'},
    h('span', {class:'verdict'}, msg),
    h('div', {class:'words'}, check.res.map(r => h('span', {class:'w ' + r.s}, r.w))),
    h('p', {class:'heard'}, 'You said: ', h('b', {lang:'ga'}, check.said)),
    h('span', {class:'legend'}, 'Green: right · Yellow: check the fada (accent) · Red: missing or different'));
}
function doCheck(expected, text){
  const said = text || answerText();
  if (!said) return;
  view.check = grade(expected, said);
  if (view.check.score >= 0.85){ progress.said = (progress.said || 0) + 1; saveProgress(); }
  // Only the first try at each item counts towards review scheduling.
  view.noted = view.noted || {};
  if (!view.noted[expected]){ view.noted[expected] = view.check.score; noteItem(expected, view.check.score); }
  render();
}
function hearRow(P, src){
  return h('div', {class:'hear'}, 'Hear it:',
    playBtn(src, P[0]),
    P[3].map(w => h('a', {href:'https://www.teanglann.ie/en/fuaim/' + encodeURIComponent(w.toLowerCase()), target:'_blank', rel:'noopener'}, icon(I.speaker, 16), w)));
}
function advance(listKey, score, last){
  const v = view; v[listKey][v.idx] = score; v.check = null; v.reveal = false;
  if (last){ v.step++; v.idx = 0; } else v.idx++;
  render(); window.scrollTo(0, 0);
}

function sayStep(){
  const v = view, P = v.L.phrases[v.idx], last = v.idx === v.L.phrases.length - 1;
  return h('section', {class:'card', 'aria-label':'Say it'},
    h('div', {style:'display:flex;justify-content:space-between;align-items:baseline;gap:8px'},
      h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Abair é · Say it'),
      h('span', {class:'counter'}, 'Frása ' + (v.idx + 1) + ' de ' + v.L.phrases.length)),
    h('div', null, h('p', {class:'phrase', lang:'ga'}, P[0]), h('p', {class:'en'}, P[1])),
    h('p', {class:'say'}, 'Sound it out: ', h('b', null, P[2])),
    hearRow(P, audioFor(v.L, v.idx + 1, P[0])),
    recordRow(audioFor(v.L, v.idx + 1, P[0]), v.takes[v.idx], url => {
      v.takes[v.idx] = url;
      if (view !== v) return;
      const typed = answerText(); render();
      const box = document.getElementById('answer'); if (box && typed) box.value = typed;
    }),
    v.check ? null : answerBox('Now say it', text => doCheck(P[0], text)),
    resultBlock(v.check),
    h('div', {class:'row'}, v.check
      ? [h('button', {type:'button', class:'btn', onclick:() => { v.check = null; render(); }}, 'Try again'),
         h('button', {type:'button', class:'btn primary grow', onclick:() => advance('said', v.check.score, last)}, last ? 'On to Tóg é' : 'Next phrase')]
      : [h('button', {type:'button', class:'btn', onclick:() => advance('said', 0, last)}, 'Skip'),
         h('button', {type:'button', class:'btn primary grow', onclick:() => doCheck(P[0])}, 'Check')]));
}

function buildStep(){
  const v = view, D = v.L.drills[v.idx], last = v.idx === v.L.drills.length - 1;
  return h('section', {class:'card', 'aria-label':'Build it'},
    h('div', {style:'display:flex;justify-content:space-between;align-items:baseline;gap:8px'},
      h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Tóg é · Build it'),
      h('span', {class:'counter'}, (v.idx + 1) + ' de ' + v.L.drills.length)),
    h('div', null, h('p', {class:'en', style:'font-size:14px'}, 'How would you say…'), h('p', {class:'phrase'}, D[0])),
    v.reveal || v.check ? h('p', {class:'reveal'}, 'Answer: ', h('b', {lang:'ga'}, D[1]), playBtn(audioFor(v.L, v.L.phrases.length + v.idx + 1, D[1]), D[1], {class:'btn', style:'min-height:36px;margin-left:8px'}))
      : h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:() => { v.reveal = true; render(); }}, 'Show me the answer'),
    v.check ? null : answerBox('Say it in Irish', text => doCheck(D[1], text)),
    resultBlock(v.check),
    h('div', {class:'row'}, v.check
      ? [h('button', {type:'button', class:'btn', onclick:() => { v.check = null; render(); }}, 'Try again'),
         h('button', {type:'button', class:'btn primary grow', onclick:() => advance('drills', v.check.score, last)}, last ? 'On to Comhrá' : 'Next')]
      : [h('button', {type:'button', class:'btn primary grow', onclick:() => doCheck(D[1])}, 'Check')]));
}

/* ---------- Profiles and the grown-up gate ---------- */
// Press and hold for 3 seconds: easy for adults, enough to stop small hands.
function holdGate(label, onPass){
  const fill = h('i', {class:'hold-fill'});
  const btn = h('button', {type:'button', class:'btn hold', 'aria-label':label + ' (press and hold)'}, fill, h('span', null, label));
  let t = null;
  const stop = () => { clearTimeout(t); t = null; btn.classList.remove('holding'); };
  btn.addEventListener('pointerdown', e => { e.preventDefault(); btn.classList.add('holding'); t = setTimeout(() => { stop(); onPass(); }, 3000); });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) btn.addEventListener(ev, stop);
  btn.addEventListener('contextmenu', e => e.preventDefault());
  return btn;
}
function gateView(why, onPass){
  return h('section', {class:'card', style:'align-items:center;text-align:center'},
    h('p', {style:'font-size:40px'}, '🔒'),
    h('p', {style:'font-weight:800;font-size:18px'}, 'Iarr ar dhuine fásta · Ask a grown-up'),
    h('p', {class:'en'}, why),
    holdGate('Hold for 3 seconds', onPass));
}
const BANDS = {u6:'Under 6', '6-9':'6–9', '10-12':'10–12'};
function profilesView(){
  const v = view, frag = document.createDocumentFragment();
  const back = () => { view = {name:'home'}; render(); };
  frag.append(h('div', {class:'lhead'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Close', onclick:back}, icon(I.x)),
    h('h2', {style:'font-size:22px;font-weight:800'}, 'Cé atá ag foghlaim? · Who’s learning?')));
  if (isKid() && !v.unlocked){ frag.append(gateView('Switching person needs a grown-up.', () => { v.unlocked = true; render(); })); return frag; }
  if (v.edit) return frag.append(profileForm(v.edit)), frag;
  frag.append(h('div', {class:'ptiles'}, profiles.list.map(p => h('div', {class:'ptile' + (p.id === profiles.current ? ' on' : '')},
    h('button', {type:'button', class:'pick', onclick:() => switchProfile(p.id)},
      h('span', {class:'pav', 'aria-hidden':'true'}, p.avatar), h('strong', null, p.name),
      h('small', null, p.kind === 'kid' ? 'Kid · ' + BANDS[p.band] : DIALECT_NAMES[p.dialect] || DIALECT_NAMES.u)),
    h('button', {type:'button', class:'pedit', 'aria-label':'Edit ' + p.name, onclick:() => { v.edit = {...p}; render(); }}, '✎')))));
  frag.append(h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:() => { v.edit = {id:'', name:'', kind:'kid', band:'6-9', dialect:me().dialect || 'u', avatar:AVATARS[profiles.list.length % AVATARS.length]}; render(); }}, '+ Add someone'));
  return frag;
}
function profileForm(p){
  const v = view, isNew = !p.id;
  const nameIn = h('input', {type:'text', id:'pname', maxlength:'20', autocomplete:'off', value:p.name, placeholder:'Name'});
  const kindIn = h('select', {id:'pkind', onchange:() => { p.kind = kindIn.value; bandField.hidden = p.kind !== 'kid'; }},
    [['adult', 'Adult'], ['kid', 'Child']].map(([val, t]) => h('option', {value:val, selected: p.kind === val ? true : null}, t)));
  const bandIn = h('select', {id:'pband'}, Object.entries(BANDS).map(([val, t]) => h('option', {value:val, selected: p.band === val ? true : null}, t)));
  const bandField = h('div', {class:'field', hidden: p.kind !== 'kid'}, h('label', {class:'lbl', for:'pband'}, 'Age'), bandIn);
  const dialIn = h('select', {id:'pdial'}, Object.entries(DIALECT_NAMES).map(([val, t]) => h('option', {value:val, selected: p.dialect === val ? true : null, disabled: !dialectReady(val) ? true : null}, t + (dialectReady(val) ? '' : ' (coming soon)'))));
  const avatars = h('div', {class:'avatars', role:'radiogroup', 'aria-label':'Picture'}, AVATARS.map(a => h('button', {type:'button', role:'radio', 'aria-checked': a === p.avatar ? 'true' : 'false', class: a === p.avatar ? 'on' : '', onclick:e => { p.avatar = a; for (const b of avatars.children){ b.classList.toggle('on', b === e.currentTarget); b.setAttribute('aria-checked', b === e.currentTarget ? 'true' : 'false'); } }}, a)));
  const msg = h('p', {class:'miclabel', role:'status'});
  const save = () => {
    const name = nameIn.value.trim();
    if (!name){ msg.textContent = 'Add a name.'; return; }
    const out = {...p, name, kind:kindIn.value, band: kindIn.value === 'kid' ? bandIn.value : '', dialect:dialIn.value};
    if (isNew){ out.id = 'p' + Date.now().toString(36); profiles.list.push(out); }
    else profiles.list = profiles.list.map(x => x.id === out.id ? out : x);
    saveProfiles();
    if (out.id === profiles.current) progress = loadProgress(out.id);
    v.edit = null; render();
  };
  const delBox = h('div', {class:'row', hidden:true},
    h('button', {type:'button', class:'btn', onclick:() => { delBox.hidden = true; }}, 'Keep'),
    h('button', {type:'button', class:'btn primary grow', onclick:() => {
      profiles.list = profiles.list.filter(x => x.id !== p.id); localStorage.removeItem('labhair-progress:' + p.id); saveProfiles();
      v.edit = null; render();
    }}, 'Yes, delete ' + p.name));
  return h('section', {class:'card', 'aria-label': isNew ? 'Add someone' : 'Edit ' + p.name},
    h('span', {class:'eyebrow', style:'color:var(--muted)'}, isNew ? 'Duine nua · Add someone' : 'Athraigh · Edit'),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'pname'}, 'Name'), nameIn),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'pkind'}, 'Who'), kindIn), bandField,
    h('div', {class:'field'}, h('label', {class:'lbl', for:'pdial'}, 'Dialect'), dialIn),
    h('div', {class:'field'}, h('span', {class:'lbl'}, 'Picture'), avatars),
    h('div', {class:'row'},
      h('button', {type:'button', class:'btn', onclick:() => { v.edit = null; render(); }}, 'Cancel'),
      h('button', {type:'button', class:'btn primary grow', onclick:save}, 'Save')),
    msg,
    !isNew && p.id !== profiles.current ? [h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:() => { delBox.hidden = false; }}, 'Delete…'), delBox] : null);
}

/* ---------- Athbhreithniú: daily review ---------- */
function openReview(){
  const items = pickReview();
  if (!items.length) return;
  dropTakes();
  view = {name:'review', items, idx:0, check:null, reveal:false, noted:{}, takes:{}, retried:{}, done:false};
  render(); window.scrollTo(0, 0);
}
function reviewNext(){
  const v = view, it = v.items[v.idx];
  const first = it.ga in v.noted ? v.noted[it.ga] : 0;
  if (!(it.ga in v.noted)){ v.noted[it.ga] = 0; noteItem(it.ga, 0); } // skipped counts as a miss
  // A miss comes back once at the end, as hear-and-repeat.
  if (first < 0.85 && !v.retried[it.ga]){ v.retried[it.ga] = true; v.items.push({...it, mode:'say', retry:true}); }
  v.check = null; v.reveal = false; v.idx++;
  if (v.idx >= v.items.length){ v.done = true; progress.lastReview = today(); bumpStreak(); saveProgress(); }
  render(); window.scrollTo(0, 0);
}
function reviewView(){
  const v = view, frag = document.createDocumentFragment();
  const total = v.items.length, pos = Math.min(v.idx, total);
  frag.append(h('div', {class:'lhead'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Close review', onclick:goHome}, icon(I.x)),
    h('div', {class:'rbar', role:'progressbar', 'aria-valuemin':'0', 'aria-valuemax':String(total), 'aria-valuenow':String(pos)},
      h('i', {style:'width:' + Math.round(pos / total * 100) + '%'}))));
  if (v.done) return frag.append(reviewDone()), frag;
  const it = v.items[v.idx], src = audioFor(it.L, it.n, it.ga);
  const card = h('section', {class:'card', 'aria-label':'Review'},
    h('div', {style:'display:flex;justify-content:space-between;align-items:baseline;gap:8px'},
      h('span', {class:'eyebrow', style:'color:var(--muted)'}, it.retry ? 'Arís · One more go' : it.mode === 'say' ? 'Abair é · Say it' : 'Tóg é · Build it'),
      h('span', {class:'counter'}, (v.idx + 1) + ' de ' + total)));
  if (it.mode === 'say'){
    put(card, 
      h('div', null, h('p', {class:'phrase', lang:'ga'}, it.ga), h('p', {class:'en'}, it.en)),
      it.sound ? h('p', {class:'say'}, 'Sound it out: ', h('b', null, it.sound)) : null,
      h('div', {class:'hear'}, playBtn(src, it.ga)),
      recordRow(src, v.takes[v.idx], url => { v.takes[v.idx] = url; if (view === v){ const typed = answerText(); render(); const box = document.getElementById('answer'); if (box && typed) box.value = typed; } }));
  } else {
    put(card, 
      h('div', null, h('p', {class:'en', style:'font-size:14px'}, 'How would you say…'), h('p', {class:'phrase'}, it.en)),
      v.reveal || v.check ? h('p', {class:'reveal'}, 'Answer: ', h('b', {lang:'ga'}, it.ga), playBtn(src, it.ga, {class:'btn', style:'min-height:36px;margin-left:8px'}))
        : h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:() => { v.reveal = true; render(); }}, 'Show me the answer'));
  }
  put(card, 
    v.check ? null : answerBox(it.mode === 'say' ? 'Now say it' : 'Say it in Irish', text => doCheck(it.ga, text)),
    resultBlock(v.check),
    h('div', {class:'row'}, v.check
      ? [h('button', {type:'button', class:'btn', onclick:() => { v.check = null; render(); }}, 'Try again'),
         h('button', {type:'button', class:'btn primary grow', onclick:reviewNext}, v.idx === total - 1 ? 'Críochnaigh · Finish' : 'Next')]
      : [h('button', {type:'button', class:'btn', onclick:reviewNext}, 'Skip'),
         h('button', {type:'button', class:'btn primary grow', onclick:() => doCheck(it.ga)}, 'Check')]));
  frag.append(card);
  return frag;
}
function reviewDone(){
  const v = view, firsts = Object.entries(v.noted), good = firsts.filter(([, s]) => s >= 0.85).length;
  const misses = v.items.filter(it => !it.retry && v.noted[it.ga] < 0.85);
  return h('div', {style:'display:flex;flex-direction:column;gap:14px'},
    h('div', {class:'done-hero'},
      h('span', {class:'badge'}, icon(I.check, 28)),
      h('div', null, h('h1', null, 'Maith thú!'), h('p', {class:'en'}, 'Review done · streak ' + currentStreak()))),
    h('div', {class:'stats', style:'grid-template-columns:repeat(2,minmax(0,1fr))'},
      h('div', {class:'stat'}, h('b', null, good + '/' + firsts.length), h('span', null, 'right first time')),
      h('div', {class:'stat'}, h('b', null, learnedItems().filter(isDue).length), h('span', null, 'still due today'))),
    misses.length ? h('section', {class:'card'},
      h('span', {class:'eyebrow', style:'color:var(--gorse-text)'}, 'Le cleachtadh · Coming back soon'),
      h('ul', {class:'plain'}, misses.map(it => h('li', null, h('b', {lang:'ga'}, it.ga), ' · ', it.en)))) : null,
    h('div', {class:'row'},
      h('button', {type:'button', class:'btn', onclick:goHome}, 'Ar ais · Back'),
      h('button', {type:'button', class:'btn primary grow', onclick:openReview}, 'Practise more')));
}

/* ---------- Comhrá: live chat ---------- */
function allowedPhrases(L){
  const all = allLessons().filter(x => !x.checkpoint);
  const upto = L.checkpoint ? all.filter(x => x.unit.num <= L.unit.num).length : all.findIndex(x => x.id === L.id) + 1;
  return all.slice(0, upto).flatMap(x => x.phrases.map(p => p[0]).concat(x.drills.map(d => d[1])));
}
function rulesFor(L){
  const me = learner();
  return 'You are Gráinne, a warm, chatty woman from Gaoth Dobhair in Co. Donegal. You are helping ' + me.ga + ' (' + me.en + '), an adult beginner, practise speaking Ulster Irish in a short role-play.\n' +
    'Scene: ' + L.chat.scene + '\n' +
    'Their goals: ' + L.chat.goals.map(g => g[0] + ' = ' + g[1]).join('; ') + '\n' +
    'Phrases they have learned so far: ' + allowedPhrases(L).join(' | ') + '\n' +
    'Rules:\n' +
    '- Speak only Ulster Irish in standard spelling (e.g. "Cad é mar atá tú?", "Tá mé", "An dtig leat"). Use mostly the phrases above, plus at most one new simple word per turn.\n' +
    '- Keep each reply to one or two short sentences. Steer the chat so they get a natural chance at each goal.\n' +
    '- Their text comes from speech recognition, which often mishears Irish. Judge what they most likely SAID. Ignore capitals, punctuation and spelling slips a listener would not hear; only recast real grammar or word mistakes.\n' +
    '- If their Irish has a mistake, put the corrected version of what they meant in "recast" and a short, friendly English tip in "note". Otherwise leave both as "".\n' +
    '- If they speak English, put the Irish for what they meant in "recast" and gently invite them to say it in Irish.\n' +
    '- "goalsMet" lists the ids of every goal they have achieved so far in the whole chat.\n' +
    '- Set "done" to true only once every goal is met and you have closed the chat naturally.\n' +
    'Reply with ONLY a JSON object: {"reply": "your line in Irish", "english": "its English translation", "recast": "", "note": "", "goalsMet": [], "done": false}';
}
function talkStep(){
  const v = view, L = v.L, c = v.chat;
  const wrap = h('div', {style:'display:flex;flex-direction:column;gap:14px'});
  wrap.append(h('section', {class:'scene', 'aria-label':'Scene and goals'},
    h('span', {class:'eyebrow', style:'color:var(--gorse)'}, 'Comhrá · Talk'),
    h('p', null, L.chat.scene),
    h('div', {class:'goals'}, L.chat.goals.map(g => { const met = c.goalsMet.includes(g[0]); return h('span', {class:'goal' + (met ? ' met' : '')}, (met ? '✓ ' : '') + g[1]); }))));
  const list = h('div', {class:'chat'});
  for (const m of c.msgs){
    if (m.who === 'g') list.append(h('div', {class:'msg g'},
      h('div', {class:'bubble', lang:'ga'}, m.ga), m.en ? h('small', null, m.en) : null,
      canVoiceGrainne() ? h('button', {type:'button', class:'say-again', 'aria-label':'Play again: ' + m.ga, onclick:() => sayGrainne(m.ga)}, icon(I.speaker, 14), 'Éist arís · Replay') : null));
    else list.append(h('div', {class:'msg me'}, h('div', {class:'bubble', lang:'ga'}, m.text),
      m.recast ? h('div', {class:'fix'}, h('b', {lang:'ga'}, 'Níos fearr: ' + m.recast), m.note ? h('div', null, m.note) : null) : null));
  }
  if (c.busy) list.append(h('p', {class:'typing'}, 'Gráinne is replying…'));
  wrap.append(list);
  if (c.error) wrap.append(h('p', {class:'err'}, c.error));
  if (!settings.key){
    wrap.append(h('p', {class:'note'}, 'Chatting with Gráinne needs your Claude API key. ', h('button', {type:'button', class:'btn', style:'margin-top:8px', onclick:() => { view = {name:'settings', back:v}; render(); }}, 'Open Settings')));
  } else if (!c.done){
    wrap.append(h('section', {class:'card'},
      answerBox('Your reply in Irish', settings.autoSend ? () => sendChat() : null),
      h('div', {class:'row'},
        c.busy ? h('button', {type:'button', class:'btn', onclick:() => c.ctl && c.ctl.abort()}, 'Stop') : null,
        h('button', {type:'button', class:'btn primary grow', disabled: c.busy ? true : null, onclick:sendChat}, 'Seol · Send'))));
  }
  const userTurns = c.msgs.filter(m => m.who === 'me').length;
  wrap.append(h('div', {class:'row'},
    h('button', {type:'button', class:'btn ' + (c.done ? 'gorse grow' : ''), disabled: c.busy ? true : null, onclick:() => { if (c.ctl) c.ctl.abort(); v.step++; render(); window.scrollTo(0, 0); if (L.checkpoint) evaluate(); }},
      c.done ? 'Críochnaigh · Finish' : (userTurns ? 'End the chat' : 'Skip the chat'))));
  if (c.msgs.length > 1) setTimeout(() => { const box = document.getElementById('answer'); (box || list.lastElementChild)?.scrollIntoView({block:'nearest'}); }, 0);
  return wrap;
}
async function sendChat(){
  const v = view, c = v.chat, L = v.L;
  const text = answerText();
  if (!text || c.busy) return;
  c.msgs.push({who:'me', text}); c.turns.push({role:'user', content:text});
  c.busy = true; c.error = ''; render();
  c.ctl = new AbortController();
  const opener = {reply:L.chat.opener, english:L.chat.openerEn, recast:'', note:'', goalsMet:[], done:false};
  let recent = c.turns.slice(-20); if (recent[0] && recent[0].role === 'assistant') recent = recent.slice(1);
  const messages = [{role:'user', content:'Start the role-play.'}, {role:'assistant', content:JSON.stringify(opener)}].concat(recent);
  let restore = '';
  try {
    const r = await askClaude(rulesFor(L), messages, c.ctl.signal);
    if (view !== v) return;
    const mine = c.msgs[c.msgs.length - 1];
    if (typeof r.recast === 'string' && r.recast.trim()){ mine.recast = r.recast.trim(); mine.note = typeof r.note === 'string' ? r.note : ''; }
    if (typeof r.reply === 'string' && r.reply){ c.msgs.push({who:'g', ga:r.reply, en: typeof r.english === 'string' ? r.english : ''}); c.turns.push({role:'assistant', content:JSON.stringify(r)}); if (settings.autoPlay) sayGrainne(r.reply); }
    if (Array.isArray(r.goalsMet)) c.goalsMet = Array.from(new Set(c.goalsMet.concat(r.goalsMet.map(String))));
    if (r.done === true) c.done = true;
  } catch(e){
    if (view !== v) return;
    c.msgs.pop(); c.turns.pop(); restore = text;
    if (!(e && e.kind === 'cancelled')) c.error = claudeErrorText(e);
  } finally {
    if (view === v){ c.busy = false; c.ctl = null; render(); const box = document.getElementById('answer'); if (box && restore) box.value = restore; }
  }
}

/* ---------- Críoch: review ---------- */
async function evaluate(){
  const v = view, c = v.chat, L = v.L;
  if (!settings.key || !c.msgs.some(m => m.who === 'me')){ v.review = {skipped:true}; render(); return; }
  v.review = {loading:true}; render();
  const transcript = c.msgs.map(m => m.who === 'g' ? 'Gráinne: ' + m.ga : learner().ga + ': ' + m.text).join('\n');
  const system = 'You are an encouraging Ulster Irish tutor. The learner’s lines came from speech recognition, so judge what they most likely said.';
  const prompt = 'Goals: ' + L.chat.goals.map(g => g[1]).join('; ') + '\n\nTranscript:\n' + transcript +
    '\n\nReply with ONLY JSON: {"wellDone": ["two short specific things they did well"], "practise": ["two short specific things to practise, each with the correct Irish"], "score": 0-' + L.chat.goals.length + ' (one point per goal clearly achieved)}';
  try {
    const r = await askClaude(system, [{role:'user', content:prompt}]);
    if (view !== v) return;
    v.review = {wellDone: Array.isArray(r.wellDone) ? r.wellDone.map(String) : [], practise: Array.isArray(r.practise) ? r.practise.map(String) : [], score: Number(r.score)};
  } catch(e){ if (view === v) v.review = {failed:true}; }
  if (view === v) render();
}
function reviewStep(){
  const v = view, L = v.L, c = v.chat;
  if (!progress.done[L.id]) markDone(L.id);
  const passed = arr => arr.filter(x => x >= 0.85).length;
  const ls = allLessons(), nextL = ls[ls.findIndex(l => l.id === L.id) + 1];
  const wrap = h('div', {style:'display:flex;flex-direction:column;gap:14px'},
    h('div', {class:'done-hero'},
      h('span', {class:'badge'}, icon(I.check, 28)),
      h('div', null, h('h1', null, 'Maith thú!'), h('p', {class:'en'}, (L.checkpoint ? 'Unit ' + L.unit.num + ' checkpoint complete' : 'Lesson complete') + ' · streak ' + currentStreak()))));
  const stats = [];
  if (!L.checkpoint){
    stats.push(h('div', {class:'stat'}, h('b', null, passed(v.said) + '/' + L.phrases.length), h('span', null, 'phrases said well')));
    stats.push(h('div', {class:'stat'}, h('b', null, passed(v.drills) + '/' + L.drills.length), h('span', null, 'built well')));
  }
  stats.push(h('div', {class:'stat'}, h('b', null, c.goalsMet.filter(g => L.chat.goals.some(x => x[0] === g)).length + '/' + L.chat.goals.length), h('span', null, 'chat goals met')));
  wrap.append(h('div', {class:'stats', style:'grid-template-columns:repeat(' + stats.length + ',minmax(0,1fr))'}, stats));
  const fixes = c.msgs.filter(m => m.who === 'me' && m.recast);
  if (fixes.length) wrap.append(h('section', {class:'card'},
    h('span', {class:'eyebrow', style:'color:var(--gorse-text)'}, 'Le cleachtadh · To practise'),
    h('ul', {class:'plain'}, fixes.slice(0, 4).map(m => h('li', null, h('span', {lang:'ga'}, m.text), ' → ', h('b', {lang:'ga'}, m.recast))))));
  if (L.checkpoint){
    const r = v.review;
    if (r && r.loading) wrap.append(h('p', {class:'typing'}, 'Gráinne is writing your feedback…'));
    else if (r && (r.wellDone || r.practise)) wrap.append(h('section', {class:'card'},
      h('span', {class:'eyebrow', style:'color:var(--green-text)'}, 'Rinne tú go maith · You did well'),
      h('ul', {class:'plain'}, r.wellDone.map(x => h('li', null, x))),
      h('span', {class:'eyebrow', style:'color:var(--gorse-text)'}, 'Le cleachtadh · To practise'),
      h('ul', {class:'plain'}, r.practise.map(x => h('li', null, x))),
      Number.isFinite(r.score) ? h('p', {class:'verdict'}, 'Score: ' + Math.max(0, Math.min(L.chat.goals.length, Math.round(r.score))) + '/' + L.chat.goals.length) : null));
    else if (r && r.failed) wrap.append(h('p', {class:'err'}, 'Feedback didn’t come through. Your progress is saved.'));
  }
  wrap.append(h('div', {class:'row'},
    h('button', {type:'button', class:'btn', onclick:goHome}, 'Ar ais · Back'),
    nextL ? h('button', {type:'button', class:'btn primary grow', onclick:() => openLesson(nextL.id)}, 'Next: ' + nextL.ga) : null));
  return wrap;
}

/* ---------- Settings and mic test ---------- */
function settingsView(){
  const back = view.back;
  const frag = document.createDocumentFragment();
  if (isKid()){ view = {name:'home'}; return VIEWS.home(); } // kids never see settings
  const close = () => { if (back){ view = back; } else view = {name:'home'}; render(); window.scrollTo(0, 0); };
  frag.append(h('div', {class:'lhead'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Close settings', onclick:close}, icon(I.x)),
    h('h2', {style:'font-size:22px;font-weight:800'}, 'Settings')));

  // Mic test
  let testCheck = null;
  const target = 'Dia duit, cad é mar atá tú?';
  const testOut = h('div');
  const runTest = text => { testCheck = grade(target, text); testOut.replaceChildren(resultBlock(testCheck)); };
  frag.append(h('section', {class:'card', 'aria-label':'Mic test'},
    h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Mic test'),
    h('p', null, 'Say this, then see what your phone heard:'),
    h('p', {class:'phrase', lang:'ga', style:'font-size:22px'}, target),
    answerBox('What your phone heard', runTest),
    testOut,
    h('p', {class:'legend'}, 'Voice for Gráinne: ' + (settings.azureKey && settings.azureRegion ? 'Azure (Orla, Irish)' : gaVoice ? gaVoice.name + ' (Irish)' : 'none yet. Add an Azure key below'))));

  // ABAIR credit (their terms require the wording and logo)
  frag.append(h('section', {class:'card credit', 'aria-label':'Credits'},
    h('img', {src:'icons/abair-logo.svg', alt:'ABAIR', width:'72', height:'55'}),
    h('div', null,
      h('p', {lang:'ga'}, 'Úsáidtear teicneolaíocht urlabhra agus teanga ABAIR sa tionscadal seo. Tá tuilleadh eolais ar shuíomh ', h('a', {href:'https://abair.ie', target:'_blank', rel:'noopener'}, 'abair.ie'), '.'),
      h('small', null, 'Phrase audio: ABAIR speech technology, Trinity College Dublin.'))));

  // Claude key and model
  const keyIn = h('input', {type:'password', id:'key', autocomplete:'off', placeholder:'sk-ant-…', value:settings.key});
  const modelIn = h('select', {id:'model'}, ['claude-sonnet-5-5', 'claude-haiku-5-5'].map(m => h('option', {value:m, selected: settings.model === m ? true : null}, m === 'claude-sonnet-5-5' ? 'Claude Sonnet 5.5 (best Irish)' : 'Claude Haiku 5.5 (faster, cheaper)')));
  const langIn = h('select', {id:'lang'}, [['ga-IE', 'Irish (ga-IE)'], ['ga', 'Irish (ga)'], ['en-IE', 'English, Ireland (fallback)']].map(([v, t]) => h('option', {value:v, selected: settings.lang === v ? true : null}, t)));
  const autoIn = h('input', {type:'checkbox', id:'auto', checked: settings.autoSend ? true : null, style:'width:22px;height:22px'});
  const saved = h('p', {class:'miclabel', role:'status'});
  frag.append(h('section', {class:'card', 'aria-label':'Chat settings'},
    h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Gráinne and the mic'),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'key'}, 'Claude API key'), keyIn,
      h('small', null, 'Stored only on this phone and sent only to Anthropic. Get one at ', h('a', {href:'https://console.anthropic.com/settings/keys', target:'_blank', rel:'noopener'}, 'console.anthropic.com'), '.')),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'model'}, 'Model'), modelIn),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'lang'}, 'Speech recognition language'), langIn,
      h('small', null, 'If Irish isn’t recognised, try “Irish (ga)”.')),
    h('label', {class:'row', for:'auto', style:'align-items:center;font-weight:700'}, autoIn, 'Send chat replies as soon as I stop speaking'),
    h('div', {class:'row'}, h('button', {type:'button', class:'btn primary grow', onclick:() => {
      settings = {...settings, key:keyIn.value.trim(), model:modelIn.value, lang:langIn.value, autoSend:autoIn.checked};
      saveSettings(); saved.textContent = 'Saved.';
    }}, 'Save')), saved));

  // Gráinne's voice (Azure Speech)
  const azKeyIn = h('input', {type:'password', id:'azkey', autocomplete:'off', placeholder:'Azure Speech key', value:settings.azureKey});
  const azRegionIn = h('input', {type:'text', id:'azregion', autocomplete:'off', autocapitalize:'none', spellcheck:'false', placeholder:'e.g. uksouth', value:settings.azureRegion});
  const autoPlayIn = h('input', {type:'checkbox', id:'autoplay', checked: settings.autoPlay ? true : null, style:'width:22px;height:22px'});
  const voiceMsg = h('p', {class:'miclabel', role:'status'});
  const saveVoice = () => { settings = {...settings, azureKey:azKeyIn.value.trim(), azureRegion:azRegionIn.value.trim().toLowerCase().replace(/\s+/g, ''), autoPlay:autoPlayIn.checked}; saveSettings(); };
  frag.append(h('section', {class:'card', 'aria-label':'Gráinne’s voice'},
    h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Gráinne’s voice'),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'azkey'}, 'Azure Speech key'), azKeyIn,
      h('small', null, 'Stored only on this phone and sent only to Microsoft. From your Speech resource in ', h('a', {href:'https://portal.azure.com', target:'_blank', rel:'noopener'}, 'portal.azure.com'), ' → Keys and Endpoint.')),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'azregion'}, 'Azure region'), azRegionIn,
      h('small', null, 'The “Location/Region” shown next to your key.')),
    h('label', {class:'row', for:'autoplay', style:'align-items:center;font-weight:700'}, autoPlayIn, 'Play Gráinne’s replies aloud'),
    h('div', {class:'row'},
      h('button', {type:'button', class:'btn', onclick: async () => {
        saveVoice();
        if (!settings.azureKey || !settings.azureRegion){ voiceMsg.textContent = 'Add your key and region first.'; return; }
        voiceMsg.textContent = 'Testing…';
        try { playAudio(await azureAudio('Dia duit, ' + learner().vocative + '!')); voiceMsg.textContent = 'Working. You should hear Gráinne.'; }
        catch(e){ voiceMsg.textContent = 'That didn’t work (' + e.message + '). Check the key and region.'; }
      }}, icon(I.speaker, 16), 'Test'),
      h('button', {type:'button', class:'btn primary grow', onclick:() => { saveVoice(); voiceMsg.textContent = 'Saved.'; }}, 'Save')),
    voiceMsg));

  // Progress
  const confirmBox = h('div', {class:'row', hidden:true},
    h('button', {type:'button', class:'btn', onclick:() => { confirmBox.hidden = true; }}, 'Keep it'),
    h('button', {type:'button', class:'btn primary grow', onclick:() => { progress = blankProgress(); saveProgress(); confirmBox.hidden = true; resetMsg.textContent = 'Progress reset.'; }}, 'Yes, reset'));
  const resetMsg = h('p', {class:'miclabel', role:'status'});
  // Backup: every profile's progress in one file. API keys are never included.
  const fileIn = h('input', {type:'file', accept:'application/json,.json', hidden:true, onchange:() => importBackup(fileIn.files[0])});
  const importBox = h('div', {class:'row', hidden:true});
  let pending = null;
  async function importBackup(file){
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== 'labhair' || !data.profiles || !Array.isArray(data.profiles.list) || !data.progress) throw 0;
      pending = data;
      resetMsg.textContent = 'Backup from ' + String(data.exported || '').slice(0, 10) + ' with ' + data.profiles.list.length + ' people. This replaces everyone’s progress on this phone.';
      importBox.hidden = false;
    } catch(e){ resetMsg.textContent = 'That isn’t a Labhair backup file.'; }
    fileIn.value = '';
  }
  importBox.append(
    h('button', {type:'button', class:'btn', onclick:() => { importBox.hidden = true; pending = null; resetMsg.textContent = ''; }}, 'Cancel'),
    h('button', {type:'button', class:'btn primary grow', onclick:() => {
      for (const p of profiles.list) localStorage.removeItem('labhair-progress:' + p.id);
      store.set('labhair-profiles', pending.profiles);
      for (const [id, pr] of Object.entries(pending.progress)) store.set('labhair-progress:' + id, pr);
      location.reload();
    }}, 'Yes, restore'));
  const exportBackup = () => {
    saveProgress();
    const data = {app:'labhair', version:1, exported:new Date().toISOString(), profiles,
      progress:Object.fromEntries(profiles.list.map(p => [p.id, store.get('labhair-progress:' + p.id, {})]))};
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], {type:'application/json'}));
    const a = h('a', {href:url, download:'labhair-backup-' + today() + '.json'});
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    resetMsg.textContent = 'Backup saved to your Downloads.';
  };
  frag.append(h('section', {class:'card', 'aria-label':'Progress'},
    h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Progress'),
    h('p', {class:'en'}, 'Progress for everyone is saved on this phone. Back it up now and then, so a new phone or a cleared browser doesn’t lose it.'),
    h('div', {class:'row'},
      h('button', {type:'button', class:'btn', onclick:exportBackup}, 'Back up'),
      h('button', {type:'button', class:'btn', onclick:() => fileIn.click()}, 'Restore…'), fileIn),
    importBox,
    h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:() => { confirmBox.hidden = false; }}, 'Reset ' + me().name + '’s progress…'),
    confirmBox, resetMsg));
  return frag;
}

/* ---------- Start ---------- */
render();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
