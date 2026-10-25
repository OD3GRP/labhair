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
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const today = () => ymd(new Date());
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return ymd(d); };

/* ---------- Answer checking ---------- */
const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const toWords = s => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[-–—]/g, ' ').replace(/[.,!?"“”:;()…]/g, ' ').split(/\s+/).filter(Boolean);
// Sound-alike keys. Chrome's Irish recogniser often writes what it hears in English spelling ("cony" for chónaí),
// so we compare rough sound skeletons: Irish spelling rules on one side, English on the other, vowels merged.
function irishKey(w){
  let s = strip(w.toLowerCase()).replace(/['’-]/g, '');
  s = s.replace(/^bhf/, 'v').replace(/^mb/, 'm').replace(/^gc/, 'g').replace(/^nd/, 'n').replace(/^ng/, 'n').replace(/^bp/, 'b').replace(/^dt/, 'd').replace(/^t(?=s)/, '').replace(/^h(?=[aeiou])/, '');
  s = s.replace(/bh|mh/g, 'v').replace(/ph/g, 'f').replace(/fh/g, '').replace(/th|sh/g, 'h').replace(/ch/g, 'k').replace(/dh|gh/g, 'g');
  s = s.replace(/s(?=[aeiou]*[ei])/g, 'S').replace(/t(?=[ei])/g, 'C').replace(/d(?=[ei])/g, 'J').replace(/c/g, 'k');
  return s.replace(/[aeiouy]+/g, 'a').replace(/(.)\1+/g, '$1');
}
function englishKey(w){
  let s = w.toLowerCase().replace(/['’-]/g, '').replace(/([aeiou])[wy]/g, '$1').replace(/([aeiou])[wy]$/, '$1');
  s = s.replace(/tch/g, 'C').replace(/ch/g, 'C').replace(/sh/g, 'S').replace(/ph/g, 'f').replace(/wh/g, 'w').replace(/[wv]/g, 'v').replace(/ck/g, 'k')
    .replace(/c(?=[eiy])/g, 's').replace(/[cq]/g, 'k').replace(/x/g, 'ks').replace(/gh/g, 'g').replace(/j/g, 'J');
  return s.replace(/[aeiouy]+/g, 'a').replace(/(.)\1+/g, '$1');
}
function lev(a, b){
  const d = Array.from({length:a.length + 1}, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
// How alike a heard word sounds to the expected Irish word (0–1), trying the heard word as Irish and as English spelling.
function soundSim(expectedWord, heard){
  const k = irishKey(expectedWord);
  if (!k) return 0;
  return Math.max(...[irishKey(heard), englishKey(heard)].map(h => h ? 1 - lev(k, h) / Math.max(k.length, h.length) : 0));
}
// spoken: the answer came from the mic, where a missing fada is the recogniser's spelling, not the speaker's mistake.
function grade(expected, said, spoken, sound){
  const exp = toWords(expected), got = toWords(said), used = got.map(() => false);
  const res = exp.map(w => {
    let i = got.findIndex((g, j) => !used[j] && g === w);
    if (i >= 0){ used[i] = true; return {w, s:'ok'}; }
    i = got.findIndex((g, j) => !used[j] && strip(g) === strip(w));
    if (i >= 0){ used[i] = true; return {w, s: spoken ? 'ok' : 'fada'}; }
    return {w, s:'miss'};
  });
  // Second pass: two expected words heard as one ("Cé seo" → "Keisha"). If a pair of missing neighbours sounds like one heard word, both count.
  for (let k = 0; k + 1 < res.length; k++){
    const a = res[k], b = res[k + 1];
    if (a.s !== 'miss' || b.s !== 'miss') continue;
    let best = 0, at = -1;
    got.forEach((g, j) => { if (!used[j]){ const s = soundSim(a.w + b.w, g); if (s > best){ best = s; at = j; } } });
    if (at >= 0 && best >= 0.7){ used[at] = true; a.s = b.s = 'close'; a.heard = b.heard = got[at]; k++; }
  }
  // Third pass: for words still missing, accept a heard word (or two run together) that sounds close.
  res.forEach(r => {
    if (r.s !== 'miss') return;
    const need = irishKey(r.w).length >= 3 ? 0.65 : 0.99;
    let best = 0, at = -1, two = false;
    got.forEach((g, j) => {
      if (used[j]) return;
      const s1 = soundSim(r.w, g); if (s1 > best){ best = s1; at = j; two = false; }
      if (j + 1 < got.length && !used[j + 1]){ const s2 = soundSim(r.w, g + got[j + 1]); if (s2 > best){ best = s2; at = j; two = true; } }
    });
    if (at >= 0 && best >= need){ used[at] = true; if (two) used[at + 1] = true; r.s = 'close'; r.heard = two ? got[at] + ' ' + got[at + 1] : got[at]; }
  });
  // Whole-phrase check against the sound-it-out line ("JEE-a gwitch"): if what the phone wrote sounds like
  // the pronunciation guide, the remaining words count as close too. This catches Ulster sounds spelling rules miss.
  if (sound && res.some(r => r.s === 'miss')){
    const a = englishKey(sound.replace(/[^a-z\s]/gi, ' ').replace(/\s+/g, '')), b = englishKey(got.join(''));
    if (a && b && 1 - lev(a, b) / Math.max(a.length, b.length) >= 0.7) res.forEach(r => { if (r.s === 'miss'){ r.s = 'close'; r.heard = r.heard || said; } });
  }
  const score = res.reduce((a, r) => a + (r.s === 'ok' ? 1 : r.s === 'close' ? 0.9 : r.s === 'fada' ? 0.75 : 0), 0) / res.length;
  // Lots of English-looking words usually means the phone's Irish recogniser isn't really working.
  const englishish = got.filter(g => /[jkqvwxyz]/.test(g) || /^(the|a|to|and|i|you|it|is|of|in|my|me|do|go|we|he|she|they|what|this|that|for|on|at|with)$/.test(g)).length;
  return {res, score, said, english: got.length > 0 && englishish / got.length >= 0.5};
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
// The course in this person's dialect (course.js applies the Connacht/Munster overrides).
const course = () => window.courseFor(me().dialect);
const tutor = () => window.tutorFor(me().dialect);
const allLessons = () => course().flatMap(u => u.lessons.map(l => ({...l, unit:u})));

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
    const add = (ga, en, sound, n, note) => { if (!seen.has(ga)){ seen.add(ga); out.push({ga, en, sound, L, n, note}); } };
    L.phrases.forEach((p, i) => add(p[0], p[1], p[2], i + 1, p[4]));
    L.drills.forEach((d, j) => add(d[1], d[0], '', L.phrases.length + j + 1, null));
  }
  return out;
}
const isDue = it => { const s = itemStats()[it.ga]; return !s || s.due <= today(); };
// Today's set: due items first (lowest box, then worst last score), topped up with the least-practised others.
const REVIEW_SIZE = 10;
// words: limit the set to items containing any of these words (the weak-words practice).
function pickReview(words){
  const rank = it => { const s = itemStats()[it.ga] || {box:0, last:0}; return s.box * 10 + (s.last || 0); };
  let all = learnedItems();
  if (words && words.length) all = all.filter(it => toWords(it.ga).some(w => words.includes(w)));
  const due = all.filter(isDue).sort((a, b) => rank(a) - rank(b));
  const rest = all.filter(it => !isDue(it)).sort((a, b) => rank(a) - rank(b));
  const pick = due.concat(rest).slice(0, REVIEW_SIZE);
  for (let i = pick.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [pick[i], pick[j]] = [pick[j], pick[i]]; }
  // New or shaky items: hear and repeat. Items you know: build from the English, or every third one, listen and pick the meaning.
  let n = 0;
  return pick.map(it => {
    const box = (itemStats()[it.ga] || {}).box || 0;
    return {...it, mode: box === 0 ? 'say' : (n++ % 3 === 2 ? 'listen' : box >= 2 ? 'build' : 'say')};
  });
}

/* ---------- Speech: recognition (mic) and Irish voice if the phone has one ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let activeRec = null;
function stopMic(){
  if (activeRec){ try { activeRec.abort(); } catch(e){} activeRec = null; }
  if (window.activeListen) activeListen.cancel();   // Azure recognition (listen.js)
}
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

// Pre-made audio (ABAIR), in sets: 'u' (Ulster, audio/), 'c' and 'm' (audio/c/, audio/m/), and kids' sets 'k-u', 'k-c', 'k-m'.
// Each set's index.json maps "<id>/<n>.mp3" to its text (n counts phrases, then drill answers), with a voice per set or per file.
// URLs carry ?h=<hash of text and voice>, so a regenerated file gets a new URL and the long-lived audio cache never serves a stale one.
const AUDIO_CACHE = 'labhair-audio';
const audioIndexes = {};
const audioBase = set => set === 'u' ? 'audio/' : 'audio/' + set + '/';
const hashStr = s => { let x = 5381; for (const ch of s) x = ((x * 33) ^ ch.codePointAt(0)) >>> 0; return x.toString(36); };
function loadAudioIndex(set){
  if (set in audioIndexes) return audioIndexes[set];
  audioIndexes[set] = fetch(audioBase(set) + 'index.json').then(r => r.ok ? r.json() : null).catch(() => null)
    .then(j => { audioIndexes[set] = j; if (j && !activeRec && !recorder && !window.activeListen && ['lesson', 'review', 'kid', 'story', 'together'].includes(view.name)) render(); return j; });
  return null;
}
function audioUrl(set, rel, text){
  const ix = audioIndexes[set];
  if (!ix || typeof ix.then === 'function' || !ix.files || ix.files[rel] !== text) return null;
  const voice = (ix.voices && ix.voices[rel]) || ix.voice || '';
  return audioBase(set) + rel + '?h=' + hashStr(text + '|' + voice);
}
function audioFor(L, n, text, set){
  set = set || me().dialect || 'u';
  loadAudioIndex(set);
  return audioUrl(set, L.id + '/' + n + '.mp3', text);
}
// Download every clip for the sets this phone's people use, so lessons work offline. Only missing files are fetched.
async function warmAudio(){
  if (!('caches' in window)) return;
  const sets = new Set();
  // Each person's course (or kids') audio, plus the scenes and stories in their dialect.
  for (const p of profiles.list){
    const d = p.dialect || 'u';
    if (p.kind === 'kid') sets.add('k-' + d); else { sets.add(d); sets.add('st-' + d); }
    sets.add('sc-' + d);
  }
  const cache = await caches.open(AUDIO_CACHE), want = new Set();
  let complete = true;
  for (const set of sets){
    loadAudioIndex(set);
    const ix = await audioIndexes[set];
    if (!ix || !ix.files){ complete = false; continue; }
    for (const [rel, text] of Object.entries(ix.files)){
      const url = new URL(audioUrl(set, rel, text), location.href).href;
      want.add(url);
      if (!(await cache.match(url))) { try { await cache.add(url); } catch(e){} }
    }
  }
  // Tidy away clips no one here needs any more (only when every index loaded, so offline never deletes anything).
  if (complete) for (const req of await cache.keys()) if (!want.has(req.url)) await cache.delete(req);
}
const warmSoon = () => setTimeout(() => warmAudio().catch(() => {}), 3000);
const player = new Audio();
// rate < 1 slows a clip down (pitch is kept); the "Mall" chip uses 0.75.
function playAudio(src, rate){
  try { speechSynthesis.cancel(); } catch(e){}
  player.onended = null; player.onpause = null; player.onerror = null; player.src = src;
  player.defaultPlaybackRate = player.playbackRate = rate || 1;
  player.currentTime = 0; player.play().catch(() => {});
}
// Play a clip and resolve when it ends (or fails), for things that run in sequence.
function playAndWait(src, rate){
  return new Promise(res => { playAudio(src, rate); player.onended = () => res(); player.onerror = () => res(); });
}
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
const IRISH_VOICE = {voice:'ga-IE-OrlaNeural', lang:'ga-IE', rate:'-10%'};
const ENGLISH_VOICE = {voice:'en-IE-EmilyNeural', lang:'en-IE', rate:'0%'};
function ssml(text, v){
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<speak version="1.0" xml:lang="' + v.lang + '"><voice name="' + v.voice + '"><prosody rate="' + v.rate + '">' + esc + '</prosody></voice></speak>';
}
const hasAzure = () => !!(settings.azureKey && settings.azureRegion);
async function azureAudio(text, v){
  v = v || IRISH_VOICE;
  const key = v.voice + '|' + text;
  if (ttsCache.has(key)) return ttsCache.get(key);
  const res = await fetch('https://' + encodeURIComponent(settings.azureRegion) + '.tts.speech.microsoft.com/cognitiveservices/v1', {
    method:'POST',
    headers:{ 'Ocp-Apim-Subscription-Key':settings.azureKey, 'Content-Type':'application/ssml+xml', 'X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3' },
    body: ssml(text, v)
  });
  if (!res.ok) throw new Error('Azure ' + res.status);
  const url = URL.createObjectURL(await res.blob());
  ttsCache.set(key, url);
  return url;
}
// English speech for the talk-back coach and commute mode: Azure's Irish-English voice, else the phone's English voice.
// Resolves when it has finished speaking.
let enVoice = null;
function loadEnVoice(){ try { const vs = speechSynthesis.getVoices(); enVoice = vs.find(v => /^en-IE/i.test(v.lang)) || vs.find(v => /^en-GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null; } catch(e){} }
if ('speechSynthesis' in window){ loadEnVoice(); speechSynthesis.addEventListener('voiceschanged', loadEnVoice); }
async function sayEnglish(text){
  if (hasAzure()){
    try { return await playAndWait(await azureAudio(text, ENGLISH_VOICE)); } catch(e){}
  }
  if (!('speechSynthesis' in window)) return;
  return new Promise(res => {
    const u = new SpeechSynthesisUtterance(text);
    if (enVoice){ u.voice = enVoice; u.lang = enVoice.lang; } else u.lang = 'en-IE';
    u.onend = u.onerror = () => res();
    player.pause(); speechSynthesis.cancel(); speechSynthesis.speak(u);
  });
}
// The tutor speaks: a ready-made clip if there is one (her opening line, in the dialect's ABAIR voice), else Azure, else the phone.
// Her portrait's mouth moves while she talks. Resolves when she's finished.
async function sayGrainne(text, src){
  const flap = on => { const p = document.querySelector('.cast.portrait'); if (p) p.talk(on); };
  let url = src || null;
  if (!url && hasAzure()){ try { url = await azureAudio(text); } catch(e){} }
  flap(true);
  if (url) await playAndWait(url); else await speakAndWait(text);
  flap(false);
}
function speakAndWait(text){
  if (!gaVoice) return Promise.resolve();
  return new Promise(res => { const u = new SpeechSynthesisUtterance(text); u.voice = gaVoice; u.lang = gaVoice.lang; u.rate = 0.9; u.onend = u.onerror = () => res(); speechSynthesis.cancel(); speechSynthesis.speak(u); });
}
const canVoiceGrainne = () => !!(settings.azureKey && settings.azureRegion) || !!gaVoice;
function playBtn(src, text, props){
  if (!src && !gaVoice) return null;
  return h('button', {type:'button', 'aria-label':'Play: ' + text, ...props, onclick:() => src ? playAudio(src) : speak(text)}, icon(I.speaker, 16), 'Éist');
}
// The same clip at three-quarter speed, for long phrases.
function slowBtn(src, text, props){
  if (!src) return null;
  return h('button', {type:'button', 'aria-label':'Play slowly: ' + text, ...props, onclick:() => playAudio(src, 0.75)}, '🐢 Mall');
}

// How sure the recogniser was about the last thing you said (0–1, or 0 if it didn't say). Typed answers reset it.
let lastConfidence = 0;
// True while hands-free chat opens the mic by itself; if Chrome wants a tap for that, we say so kindly.
let autoMic = false;
// The answer box: a text area plus a mic button that fills it with what you said.
function answerBox(label, onFinal){
  const azure = window.useAzureSTT && useAzureSTT(), canMic = !!SR || azure;
  const ta = h('textarea', {id:'answer', rows:'2', autocomplete:'off', autocapitalize:'sentences', spellcheck:'false', lang:'ga', placeholder: canMic ? 'Tap the mic and speak, or type' : 'Type your answer'});
  const status = h('p', {class:'miclabel', role:'status'}, canMic ? 'Tap the mic and say it in Irish' : 'This browser has no speech recognition. Use Chrome on Android, or type.');
  let mic = null;
  if (canMic){
    mic = h('button', {type:'button', class:'mic', 'aria-label':'Speak your answer', 'aria-pressed':'false', onclick: toggle}, icon(I.mic, 28));
  }
  // Azure: record, let it find the end of your speech, then send it off. Tap again to finish early.
  async function toggleAzure(){
    if (window.activeListen){ micLog('azure: tapped to finish'); activeListen.stop(); return; }
    micLog('mic tapped', {engine:'azure', view:view.name, version:document.body.dataset.version || ''});
    player.pause(); try { speechSynthesis.cancel(); } catch(e){}
    stopRec(false);
    const L = azureListen(st => {
      status.textContent = st === 'checking' ? 'Ag seiceáil… · Checking what you said' : st === 'hearing' ? 'Ag éisteacht… · Keep going, I’ll stop when you pause' : 'Ag éisteacht… · Listening. Say it now.';
      if (st === 'checking') mic.classList.remove('on');
    });
    mic.classList.add('on'); mic.setAttribute('aria-pressed', 'true');
    try {
      const r = await L.promise;
      mic.classList.remove('on'); mic.setAttribute('aria-pressed', 'false');
      ta.value = r.text; lastConfidence = r.confidence;
      const take = r.audio ? URL.createObjectURL(r.audio) : null; if (take) takeUrls.push(take);
      micLog('azure: heard', {text:r.text, conf:r.confidence, alts:r.alts.length});
      status.textContent = 'Tap the mic and say it in Irish';
      autoMic = false;
      if (r.text.trim() && onFinal) onFinal(r.text.trim(), r.alts, take);
    } catch(e){
      mic.classList.remove('on'); mic.setAttribute('aria-pressed', 'false');
      if (e.code !== 'cancelled') status.textContent = listenError(e);
      autoMic = false;
    }
  }
  function toggle(){
    if (azure) return toggleAzure();
    if (activeRec){ activeRec.stop(); return; }
    // Stop any audio so the mic doesn't hear Gráinne or the phrase recording.
    player.pause(); try { speechSynthesis.cancel(); } catch(e){}
    stopRec(false);
    let finalText = '', failed = false;
    micLog('mic tapped', {engine:'chrome', lang:settings.lang, view:view.name, azureKey:hasAzure(), stt:settings.stt || 'azure'});
    const r = new SR();
    r.lang = settings.lang; r.interimResults = true; r.continuous = false; r.maxAlternatives = 5;
    let alts = [];
    r.onresult = e => {
      let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      ta.value = t;
      const last = e.results[e.results.length - 1];
      if (last.isFinal){
        finalText = t; lastConfidence = last[0].confidence || 0;
        // Every guess the recogniser offered for the last bit, so grading can use the best one.
        const before = t.slice(0, t.length - last[0].transcript.length);
        alts = [...last].map(a => before + a.transcript);
      }
    };
    r.onerror = e => { failed = true; micLog('chrome: error', {error:e.error, message:e.message}); status.textContent = autoMic && e.error === 'not-allowed' ? 'Your turn: tap the mic to reply.' : micError(e.error); autoMic = false; };
    r.onend = () => {
      activeRec = null; mic.classList.remove('on'); mic.setAttribute('aria-pressed', 'false');
      if (!failed) status.textContent = 'Tap the mic and say it in Irish';
      micLog('chrome: ended', {heard:finalText, failed, conf:lastConfidence});
      if (!failed && finalText.trim() && onFinal) onFinal(finalText.trim(), alts);
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
// Whose voice the phrase audio is in, for this person's dialect.
const nativeName = () => ({u:'Áine', c:'Sibéal', m:'Neasa'})[me().dialect] || 'Áine';
// Shadowing: record while the native clip plays, so you speak along with her. Stops just after she finishes.
async function startShadow(btn, status, native, onTake){
  await startRec(btn, status, onTake);
  if (!recorder) return;
  status.textContent = 'Speak along with ' + nativeName() + '… (earphones help)';
  await playAndWait(native);
  setTimeout(() => stopRec(true), 700);
}
// Both clips at once: your take over hers.
const together = new Audio();
function playTogether(native, take){ playAudio(native); together.src = take; together.currentTime = 0; together.play().catch(() => {}); }
function recordRow(native, take, onTake){
  if (!canRecord) return null;
  const who = nativeName();
  const status = h('p', {class:'miclabel', role:'status'}, take ? '' : 'Record yourself, then compare with ' + who + '. Or speak along with her.');
  const btn = h('button', {type:'button', class:'btn rec', 'aria-pressed':'false', onclick:() => recorder ? stopRec(true) : startRec(btn, status, onTake)},
    h('span', {class:'dot', 'aria-hidden':'true'}), take ? 'Arís · Re-record' : 'Taifead · Record');
  const shadow = native ? h('button', {type:'button', class:'btn', onclick:() => { if (!recorder) startShadow(btn, status, native, onTake); }}, '🎙️ Labhair léi · Speak along') : null;
  return h('div', {class:'compare'},
    h('div', {class:'row'}, btn, take ? null : shadow,
      take ? h('button', {type:'button', class:'btn', onclick:() => playAudio(take)}, icon(I.speaker, 16), 'Mise · Me') : null,
      take && native ? h('button', {type:'button', class:'btn primary grow', onclick:() => playSeq([native, take])}, who + ', then me') : null),
    take && native ? h('div', {class:'row'}, shadow, h('button', {type:'button', class:'btn', onclick:() => playTogether(native, take)}, '🎧 Le chéile · Together')) : null,
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
function render(){ stopMic(); stopRec(false); document.body.classList.toggle('kidmode', isKid()); $app.replaceChildren((VIEWS[view.name] || VIEWS.home)()); if (window.afterRender) afterRender(); }
const DIALECT_NAMES = {u:'Gaeilge Uladh', c:'Gaeilge Chonnacht', m:'Gaeilge na Mumhan'};
// A dialect can be chosen once its content file has loaded (content-c.js / content-m.js).
const dialectReady = d => d === 'u' || !!(window.DIALECTS && window.DIALECTS[d]);
// Kid mode views (kidHomeView, VIEWS.kid) live in kids-ui.js.
function goHome(){ if (view.chat && view.chat.ctl) view.chat.ctl.abort(); dropTakes(); view = {name:'home'}; render(); window.scrollTo(0, 0); }

function homeView(){
  const ls = allLessons(), doneCount = ls.filter(l => progress.done[l.id]).length;
  const next = ls.find(l => !progress.done[l.id]);
  const frag = document.createDocumentFragment();
  frag.append(
    h('div', {class:'top'},
      h('span', {class:'brand'}, 'Labhair'),
      h('div', {class:'row', style:'align-items:center'},
        h('span', {class:'chip', title:DIALECT_NAMES[me().dialect] || DIALECT_NAMES.u},
          h('span', {class:'long'}, DIALECT_NAMES[me().dialect] || DIALECT_NAMES.u), h('span', {class:'short'}, (DIALECT_NAMES[me().dialect] || DIALECT_NAMES.u).split(' ').pop())),
        h('button', {type:'button', class:'iconbtn avatar-btn', 'aria-label':'Switch person (' + me().name + ')', onclick:() => { view = {name:'profiles'}; render(); }}, me().avatar),
        h('button', {type:'button', class:'iconbtn', 'aria-label':'Settings', onclick:() => { view = {name:'settings'}; render(); }}, icon(I.gear)))),
    h('div', {class:'stats'},
      h('div', {class:'stat'}, h('b', null, currentStreak()), h('span', null, 'sraith · day streak')),
      h('div', {class:'stat'}, h('b', null, progress.said || 0), h('span', null, 'frásaí · phrases said')),
      h('div', {class:'stat'}, h('b', null, doneCount + '/' + ls.length), h('span', null, 'ceachtanna · lessons')))
  );
  if (!settings.key) frag.append(h('p', {class:'note'}, h('strong', null, 'One-time setup: '), 'add your Claude API key in Settings so you can chat with ' + tutor().name + '. Lessons work without it.'));
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
  frag.append(h('div', {class:'tools'},
    h('button', {type:'button', class:'tool', onclick:() => openCommute()}, h('span', {'aria-hidden':'true'}, '🎧'), h('strong', null, 'Hands-free'), h('small', null, 'For a walk or the car')),
    h('button', {type:'button', class:'tool', onclick:() => openStories()}, h('span', {'aria-hidden':'true'}, '📖'), h('strong', null, 'Stories'), h('small', null, 'Read along, tap words')),
    window.togetherCard ? togetherCard() : null,
    h('button', {type:'button', class:'tool', onclick:() => openScenes()}, h('span', {'aria-hidden':'true'}, '🎬'), h('strong', null, 'Scenes'), h('small', null, 'Watch, then join in')),
    canFreeChat() ? h('button', {type:'button', class:'tool', onclick:() => openFreeChat()}, h('span', {'aria-hidden':'true'}, '💬'), h('strong', null, 'Free chat'), h('small', null, 'Talk about anything with ' + tutor().name)) : null,
    Object.keys(progress.weak || {}).length ? h('button', {type:'button', class:'tool', onclick:() => { view = {name:'weak'}; render(); window.scrollTo(0, 0); }}, h('span', {'aria-hidden':'true'}, '🎯'), h('strong', null, 'Weak words'), h('small', null, Object.keys(progress.weak).length + ' to practise')) : null));
  for (const U of course()){
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

// id, or a lesson object (the free chat isn't in the course).
function openLesson(id){
  const L = typeof id === 'object' ? id : allLessons().find(l => l.id === id);
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
  if (check.spoken) return window.spokenBlock ? spokenBlock(view, check) : null;
  const msg = check.score >= 0.85 ? 'Maith thú! · Well done' : check.score >= 0.5 ? 'Beagnach! · Nearly, check the highlighted words' : 'Arís? · Have another go';
  return h('div', {style:'display:flex;flex-direction:column;gap:8px'},
    h('span', {class:'verdict'}, msg),
    h('div', {class:'words'}, check.res.map(r => h('span', {class:'w ' + r.s, title: r.heard ? 'Heard as “' + r.heard + '”' : null}, r.w))),
    h('p', {class:'heard'}, 'You said: ', h('b', {lang:'ga'}, check.said)),
    check.english && check.score < 0.85 ? h('p', {class:'note'}, 'The phone seems to have heard English words. Its Irish recogniser may not be working well: try Settings → Speech recognition language, or type your answer.') : null,
    h('span', {class:'legend'}, 'Green: right · Yellow: check the fada · Blue: sounded close (the phone may have misheard) · Red: missing or different'),
    window.coachBox ? coachBox(view) : null);
}
// The sound-it-out guide for a phrase, if the course has one.
function soundFor(ga){ for (const L of allLessons()) for (const p of (L.phrases || [])) if (p[0] === ga) return p[2]; return ''; }
function doCheck(expected, text, alts, take){
  const said = text || answerText();
  if (!said) return;
  // Spoken: the transcript is only a clue, so nothing is marked automatically. The teacher (advisor.js) responds,
  // and you mark yourself (selfMark) when you're happy.
  if (text){
    const v = view;
    v.attempts = v.attempts || {};
    const tries = v.attempts[expected] = (v.attempts[expected] || []).concat(text);
    v.check = {spoken:true, expected, said:text, alts:alts || [], conf:lastConfidence, take:take || null, engine: window.useAzureSTT && useAzureSTT() ? 'azure' : 'phone', tries};
    v.coach = null;
    if (window.micLog) micLog('spoken attempt', {expected, said:text, conf:lastConfidence, engine:v.check.engine});
    render();
    if (window.teacherFeedback && settings.key && settings.coach !== false) teacherFeedback(v, v.check);
    return;
  }
  view.check = [said].concat(text && alts ? alts : []).map(a => grade(expected, a, !!text, soundFor(expected))).reduce((b, g) => g.score > b.score ? g : b);
  view.check.conf = text ? lastConfidence : 0;   // typed answers have no recogniser confidence
  if (view.check.score >= 0.85){ progress.said = (progress.said || 0) + 1; saveProgress(); }
  // Only the first try at each item counts towards review scheduling.
  view.noted = view.noted || {};
  if (!view.noted[expected]){ view.noted[expected] = view.check.score; noteItem(expected, view.check.score); }
  noteWeak(view.check);
  if (window.micLog) micLog('graded', {expected, said:view.check.said, score:Math.round(view.check.score * 100), english:!!view.check.english});
  // The talk-back coach (advisor.js) explains the result, and says it aloud if that's switched on.
  view.coach = window.coachFor && settings.coach !== false ? coachFor(expected, view.check, view) : null;
  render();
  if (view.coach && settings.talkBack !== false) sayEnglish(view.coach.text);
}
// Weak words: each miss or fada slip adds a point, each clean hit takes one away.
function noteWeak(check){
  const w = progress.weak || (progress.weak = {});
  for (const r of check.res){
    if (r.s === 'ok'){ if (w[r.w]) { w[r.w]--; if (!w[r.w]) delete w[r.w]; } }
    else w[r.w] = (w[r.w] || 0) + 1;
  }
  saveProgress();
}
function hearRow(P, src){
  return h('div', {class:'hear'}, 'Hear it:',
    playBtn(src, P[0]), slowBtn(src, P[0]),
    P[3].map(w => h('a', {href:'https://www.teanglann.ie/en/fuaim/' + encodeURIComponent(w.toLowerCase()), target:'_blank', rel:'noopener'}, icon(I.speaker, 16), w)));
}
function advance(listKey, score, last){
  const v = view; v[listKey][v.idx] = score; v.check = null; v.reveal = false;
  if (last){ v.step++; v.idx = 0; } else v.idx++;
  render(); window.scrollTo(0, 0);
}

function sayStep(){
  const v = view, P = v.L.phrases[v.idx], last = v.idx === v.L.phrases.length - 1;
  v.onNext = score => advance('said', score, last);
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
    v.check ? null : answerBox('Now say it', (text, alts, take) => doCheck(P[0], text, alts, take)),
    resultBlock(v.check),
    v.check && v.check.spoken ? null : h('div', {class:'row'}, v.check
      ? [h('button', {type:'button', class:'btn', onclick:() => { v.check = null; render(); }}, 'Try again'),
         h('button', {type:'button', class:'btn primary grow', onclick:() => advance('said', v.check.score, last)}, last ? 'On to Tóg é' : 'Next phrase')]
      : [h('button', {type:'button', class:'btn', onclick:() => advance('said', 0, last)}, 'Skip'),
         h('button', {type:'button', class:'btn primary grow', onclick:() => doCheck(P[0])}, 'Check')]));
}

function buildStep(){
  const v = view, D = v.L.drills[v.idx], last = v.idx === v.L.drills.length - 1;
  v.onNext = score => advance('drills', score, last);
  return h('section', {class:'card', 'aria-label':'Build it'},
    h('div', {style:'display:flex;justify-content:space-between;align-items:baseline;gap:8px'},
      h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Tóg é · Build it'),
      h('span', {class:'counter'}, (v.idx + 1) + ' de ' + v.L.drills.length)),
    h('div', null, h('p', {class:'en', style:'font-size:14px'}, 'How would you say…'), h('p', {class:'phrase'}, D[0])),
    v.reveal || v.check ? h('p', {class:'reveal'}, 'Answer: ', h('b', {lang:'ga'}, D[1]), playBtn(audioFor(v.L, v.L.phrases.length + v.idx + 1, D[1]), D[1], {class:'btn', style:'min-height:36px;margin-left:8px'}))
      : h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:() => { v.reveal = true; render(); }}, 'Show me the answer'),
    v.check ? null : answerBox('Say it in Irish', (text, alts, take) => doCheck(D[1], text, alts, take)),
    resultBlock(v.check),
    v.check && v.check.spoken ? null : h('div', {class:'row'}, v.check
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
    saveProfiles(); warmSoon();
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
function openReview(words){
  const items = pickReview(Array.isArray(words) ? words : null);
  if (!items.length) return;
  dropTakes();
  view = {name:'review', items, idx:0, check:null, reveal:false, noted:{}, takes:{}, retried:{}, done:false};
  render(); window.scrollTo(0, 0);
}
// Listening: hear it, pick what it means from four.
function listenCard(card, it, src){
  const v = view;
  if (!v.options || v.optionsFor !== v.idx){
    const others = shuffle(learnedItems().filter(x => x.en !== it.en)).slice(0, 3).map(x => x.en);
    v.options = shuffle([it.en].concat(others)); v.optionsFor = v.idx; v.picked = null;
    setTimeout(() => { if (view === v && src) playAudio(src); }, 250);
  }
  const answered = v.picked != null;
  put(card,
    h('p', {class:'en', style:'font-size:14px'}, 'What does ' + nativeName() + ' say?'),
    h('div', {class:'hear'}, playBtn(src, it.ga), slowBtn(src, it.ga)),
    h('div', {class:'options'}, v.options.map(o => h('button', {type:'button', class:'option' + (answered && o === it.en ? ' right' : '') + (answered && o === v.picked && o !== it.en ? ' wrong' : ''), disabled: answered ? true : null, onclick:() => {
      v.picked = o;
      if (!(it.ga in v.noted)){ const s = o === it.en ? 1 : 0; v.noted[it.ga] = s; noteItem(it.ga, s); }
      render();
    }}, o))),
    answered ? h('p', {class:'reveal'}, h('b', {lang:'ga'}, it.ga), ' · ', it.en) : null,
    answered ? h('div', {class:'row'}, h('button', {type:'button', class:'btn primary grow', onclick:() => { v.options = null; reviewNext(); }}, v.idx === v.items.length - 1 ? 'Críochnaigh · Finish' : 'Next')) : null);
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
  v.onNext = () => reviewNext();
  const it = v.items[v.idx], src = audioFor(it.L, it.n, it.ga);
  const mode = it.mode === 'listen' && !src ? 'build' : it.mode;   // no audio, no listening
  const card = h('section', {class:'card', 'aria-label':'Review'},
    h('div', {style:'display:flex;justify-content:space-between;align-items:baseline;gap:8px'},
      h('span', {class:'eyebrow', style:'color:var(--muted)'}, it.retry ? 'Arís · One more go' : mode === 'say' ? 'Abair é · Say it' : mode === 'listen' ? 'Éist · Listen' : 'Tóg é · Build it'),
      h('span', {class:'counter'}, (v.idx + 1) + ' de ' + total)));
  if (mode === 'listen'){ listenCard(card, it, src); frag.append(card); return frag; }
  if (mode === 'say'){
    put(card, 
      h('div', null, h('p', {class:'phrase', lang:'ga'}, it.ga), h('p', {class:'en'}, it.en)),
      it.sound ? h('p', {class:'say'}, 'Sound it out: ', h('b', null, it.sound)) : null,
      h('div', {class:'hear'}, playBtn(src, it.ga), slowBtn(src, it.ga)),
      recordRow(src, v.takes[v.idx], url => { v.takes[v.idx] = url; if (view === v){ const typed = answerText(); render(); const box = document.getElementById('answer'); if (box && typed) box.value = typed; } }));
  } else {
    put(card, 
      h('div', null, h('p', {class:'en', style:'font-size:14px'}, 'How would you say…'), h('p', {class:'phrase'}, it.en)),
      v.reveal || v.check ? h('p', {class:'reveal'}, 'Answer: ', h('b', {lang:'ga'}, it.ga), playBtn(src, it.ga, {class:'btn', style:'min-height:36px;margin-left:8px'}))
        : h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:() => { v.reveal = true; render(); }}, 'Show me the answer'));
  }
  put(card, 
    v.check ? null : answerBox(mode === 'say' ? 'Now say it' : 'Say it in Irish', (text, alts, take) => doCheck(it.ga, text, alts, take)),
    resultBlock(v.check),
    v.check && v.check.spoken ? null : h('div', {class:'row'}, v.check
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
  const me = learner(), T = tutor();
  return 'You are ' + T.name + ', a warm, chatty woman from ' + T.place + ' in ' + T.county + '. You are helping ' + me.ga + ' (' + me.en + '), an adult beginner, practise speaking ' + T.dialect + ' in a short role-play.\n' +
    'Scene: ' + L.chat.scene + '\n' +
    (L.chat.goals.length ? 'Their goals: ' + L.chat.goals.map(g => g[0] + ' = ' + g[1]).join('; ') + '\n'
      : 'There are no set goals: just chat naturally about their life, family, the weather and plans, and ask one simple question each turn to keep it going.\n') +
    'Phrases they have learned so far: ' + allowedPhrases(L).join(' | ') + '\n' +
    (memory().length ? 'Things you remember about them from earlier chats (bring one up naturally if it fits): ' + memory().join('; ') + '\n' : '') +
    'Rules:\n' +
    '- Speak only ' + T.dialect + ' in standard spelling (e.g. ' + T.examples + '). Use mostly the phrases above, plus at most one new simple word per turn.\n' +
    '- Keep each reply to one or two short sentences. Steer the chat so they get a natural chance at each goal.\n' +
    '- Their text comes from speech recognition, which often mishears Irish. Judge what they most likely SAID. Ignore capitals, punctuation and spelling slips a listener would not hear; only recast real grammar or word mistakes.\n' +
    '- If their Irish has a mistake, put the corrected version of what they meant in "recast" and a short, friendly English tip in "note". Otherwise leave both as "".\n' +
    '- If they speak English, put the Irish for what they meant in "recast" and gently invite them to say it in Irish.\n' +
    '- "goalsMet" lists the ids of every goal they have achieved so far in the whole chat.\n' +
    '- Set "done" to true only once every goal is met and you have closed the chat naturally.\n' +
    '- "mood" is your face as you say your line: one of happy, laughing, surprised, confused, thinking, listening, neutral.\n' +
    '- "remember" lists any NEW short facts about them worth remembering for future chats, in English (e.g. "has a brother called Seán"). Usually [].\n' +
    'Reply with ONLY a JSON object: {"reply": "your line in Irish", "english": "its English translation", "recast": "", "note": "", "goalsMet": [], "done": false, "mood": "happy", "remember": []}';
}
// What the tutor remembers about this person, kept on the phone with their progress.
const memory = () => progress.memory || [];
function remember(facts){
  if (!Array.isArray(facts)) return;
  const m = memory().slice();
  for (const f of facts.map(String).map(s => s.trim()).filter(Boolean)) if (!m.some(x => x.toLowerCase() === f.toLowerCase())) m.push(f.slice(0, 120));
  progress.memory = m.slice(-25); saveProgress();
}
// Free chat: an open conversation using everything learned so far.
function canFreeChat(){ return allLessons().filter(l => l.unit.num === 1 && !l.checkpoint).every(l => progress.done[l.id]) || !!progress.done['u1-cp']; }
function openFreeChat(){
  const T = tutor(), units = course();
  const last = [...units].reverse().find(U => U.lessons.some(l => progress.done[l.id])) || units[0];
  openLesson({id:'free', free:true, checkpoint:true, ga:'Comhrá saor', en:'Free chat', goal:'Talk about anything you like', unit:last,
    chat:{scene:T.name + ' rings you for a chat. Talk about anything you like.', opener:T.free[0], openerEn:T.free[1], goals:[]}});
}
function talkStep(){
  const v = view, L = v.L, c = v.chat;
  const wrap = h('div', {style:'display:flex;flex-direction:column;gap:14px'});
  const T = tutor(), openerSrc = L.free ? null : audioFor(L, 'opener', L.chat.opener);
  wrap.append(h('section', {class:'scene', 'aria-label':'Scene and goals'},
    h('div', {class:'scene-top'}, castEl(T.cast, c.busy ? 'listening' : c.mood || 'happy', 'portrait'),
      h('div', null, h('span', {class:'eyebrow', style:'color:var(--gorse)'}, 'Comhrá · Talk with ' + T.name), h('p', null, L.chat.scene))),
    L.chat.goals.length ? h('div', {class:'goals'}, L.chat.goals.map(g => { const met = c.goalsMet.includes(g[0]); return h('span', {class:'goal' + (met ? ' met' : '')}, (met ? '✓ ' : '') + g[1]); })) : null));
  // Her opening line plays by itself the first time, in the dialect's ABAIR voice when we have it.
  if (c.msgs.length === 1 && !c.openerPlayed && settings.autoPlay && (openerSrc || canVoiceGrainne())){
    c.openerPlayed = true;
    setTimeout(() => { if (view === v) sayGrainne(L.chat.opener, openerSrc); }, 500);
  }
  const list = h('div', {class:'chat'});
  for (const [i, m] of c.msgs.entries()){
    if (m.who === 'g') list.append(h('div', {class:'msg g'},
      h('div', {class:'bubble', lang:'ga'}, m.ga), m.en ? h('small', null, m.en) : null,
      (i === 0 && openerSrc) || canVoiceGrainne() ? h('button', {type:'button', class:'say-again', 'aria-label':'Play again: ' + m.ga, onclick:() => sayGrainne(m.ga, i === 0 ? openerSrc : null)}, icon(I.speaker, 14), 'Éist arís · Replay') : null));
    else list.append(h('div', {class:'msg me'}, h('div', {class:'bubble', lang:'ga'}, m.text),
      m.recast ? h('div', {class:'fix'}, h('b', {lang:'ga'}, 'Níos fearr: ' + m.recast), m.note ? h('div', null, m.note) : null) : null));
  }
  if (c.busy) list.append(h('p', {class:'typing'}, tutor().name + ' is replying…'));
  wrap.append(list);
  if (c.error) wrap.append(h('p', {class:'err'}, c.error));
  if (!settings.key){
    wrap.append(h('p', {class:'note'}, 'Chatting with ' + tutor().name + ' needs your Claude API key. ', h('button', {type:'button', class:'btn', style:'margin-top:8px', onclick:() => { view = {name:'settings', back:v}; render(); }}, 'Open Settings')));
  } else if (!c.done){
    wrap.append(h('section', {class:'card'},
      answerBox('Your reply in Irish', settings.autoSend || settings.handsFree ? () => sendChat() : null),
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
  let restore = '', spoken = '';
  try {
    const r = await askClaude(rulesFor(L), messages, c.ctl.signal);
    if (view !== v) return;
    const mine = c.msgs[c.msgs.length - 1];
    if (typeof r.recast === 'string' && r.recast.trim()){ mine.recast = r.recast.trim(); mine.note = typeof r.note === 'string' ? r.note : ''; }
    if (typeof r.reply === 'string' && r.reply){ c.msgs.push({who:'g', ga:r.reply, en: typeof r.english === 'string' ? r.english : ''}); c.turns.push({role:'assistant', content:JSON.stringify(r)}); spoken = r.reply; }
    if (Array.isArray(r.goalsMet)) c.goalsMet = Array.from(new Set(c.goalsMet.concat(r.goalsMet.map(String))));
    if (r.done === true) c.done = true;
    if (typeof r.mood === 'string' && window.EXPRESSIONS && EXPRESSIONS.includes(r.mood)) c.mood = r.mood;
    remember(r.remember);
  } catch(e){
    if (view !== v) return;
    c.msgs.pop(); c.turns.pop(); restore = text;
    if (!(e && e.kind === 'cancelled')) c.error = claudeErrorText(e);
  } finally {
    if (view === v){ c.busy = false; c.ctl = null; render(); const box = document.getElementById('answer'); if (box && restore) box.value = restore; }
  }
  // She says it, then (hands-free) the mic opens for your answer.
  if (spoken && settings.autoPlay && view === v){
    await sayGrainne(spoken);
    if (settings.handsFree && view === v && !c.done && !c.busy && !activeRec){
      const mic = document.querySelector('.answer .mic');
      if (mic){ autoMic = true; mic.click(); }
    }
  }
}

/* ---------- Críoch: review ---------- */
async function evaluate(){
  const v = view, c = v.chat, L = v.L;
  if (!settings.key || !c.msgs.some(m => m.who === 'me')){ v.review = {skipped:true}; render(); return; }
  v.review = {loading:true}; render();
  const transcript = c.msgs.map(m => m.who === 'g' ? tutor().name + ': ' + m.ga : learner().ga + ': ' + m.text).join('\n');
  const system = 'You are an encouraging ' + tutor().dialect + ' tutor. The learner’s lines came from speech recognition, so judge what they most likely said.';
  let prompt = 'Goals: ' + L.chat.goals.map(g => g[1]).join('; ') + '\n\nTranscript:\n' + transcript +
    '\n\nReply with ONLY JSON: {"wellDone": ["two short specific things they did well"], "practise": ["two short specific things to practise, each with the correct Irish"], "score": 0-' + L.chat.goals.length + ' (one point per goal clearly achieved)}';
  if (!L.chat.goals.length) prompt = prompt.replace(/, "score": .*}$/, '}');
  try {
    const r = await askClaude(system, [{role:'user', content:prompt}]);
    if (view !== v) return;
    v.review = {wellDone: Array.isArray(r.wellDone) ? r.wellDone.map(String) : [], practise: Array.isArray(r.practise) ? r.practise.map(String) : [], score: Number(r.score)};
  } catch(e){ if (view === v) v.review = {failed:true}; }
  if (view === v) render();
}
function reviewStep(){
  const v = view, L = v.L, c = v.chat;
  if (L.free){ bumpStreak(); saveProgress(); } else if (!progress.done[L.id]) markDone(L.id);
  const passed = arr => arr.filter(x => x >= 0.85).length;
  const ls = allLessons(), nextL = L.free ? null : ls[ls.findIndex(l => l.id === L.id) + 1];
  const wrap = h('div', {style:'display:flex;flex-direction:column;gap:14px'},
    h('div', {class:'done-hero'},
      h('span', {class:'badge'}, icon(I.check, 28)),
      h('div', null, h('h1', null, 'Maith thú!'), h('p', {class:'en'}, (L.checkpoint ? 'Unit ' + L.unit.num + ' checkpoint complete' : 'Lesson complete') + ' · streak ' + currentStreak()))));
  const stats = [];
  if (!L.checkpoint){
    stats.push(h('div', {class:'stat'}, h('b', null, passed(v.said) + '/' + L.phrases.length), h('span', null, 'phrases said well')));
    stats.push(h('div', {class:'stat'}, h('b', null, passed(v.drills) + '/' + L.drills.length), h('span', null, 'built well')));
  }
  if (L.chat.goals.length) stats.push(h('div', {class:'stat'}, h('b', null, c.goalsMet.filter(g => L.chat.goals.some(x => x[0] === g)).length + '/' + L.chat.goals.length), h('span', null, 'chat goals met')));
  wrap.append(h('div', {class:'stats', style:'grid-template-columns:repeat(' + stats.length + ',minmax(0,1fr))'}, stats));
  const fixes = c.msgs.filter(m => m.who === 'me' && m.recast);
  if (fixes.length) wrap.append(h('section', {class:'card'},
    h('span', {class:'eyebrow', style:'color:var(--gorse-text)'}, 'Le cleachtadh · To practise'),
    h('ul', {class:'plain'}, fixes.slice(0, 4).map(m => h('li', null, h('span', {lang:'ga'}, m.text), ' → ', h('b', {lang:'ga'}, m.recast))))));
  if (L.checkpoint){
    const r = v.review;
    if (r && r.loading) wrap.append(h('p', {class:'typing'}, tutor().name + ' is writing your feedback…'));
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
  const runTest = text => { testCheck = grade(target, text, true); testOut.replaceChildren(resultBlock(testCheck)); };
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
  const ver = h('p', {class:'legend', style:'text-align:center'}, 'Labhair');
  if ('caches' in window) caches.keys().then(k => { const v = k.filter(x => /^labhair-v\d+$/.test(x)).sort((a, b) => parseInt(a.slice(9)) - parseInt(b.slice(9))).pop(); if (v){ ver.textContent = 'Labhair ' + v.replace('labhair-', ''); document.body.dataset.version = v; } }).catch(() => {});
  frag.append(ver);

  // Claude key and model
  const keyIn = h('input', {type:'password', id:'key', autocomplete:'off', placeholder:'sk-ant-…', value:settings.key});
  const modelIn = h('select', {id:'model'}, ['claude-sonnet-5-5', 'claude-haiku-5-5'].map(m => h('option', {value:m, selected: settings.model === m ? true : null}, m === 'claude-sonnet-5-5' ? 'Claude Sonnet 5.5 (best Irish)' : 'Claude Haiku 5.5 (faster, cheaper)')));
  const langIn = h('select', {id:'lang'}, [['ga-IE', 'Irish (ga-IE)'], ['ga', 'Irish (ga)'], ['en-IE', 'English, Ireland (fallback)']].map(([v, t]) => h('option', {value:v, selected: settings.lang === v ? true : null}, t)));
  const sttIn = h('select', {id:'stt'}, [['azure', 'Azure Irish (best, needs Azure key)'], ['chrome', 'The phone’s own recogniser']].map(([v, t]) => h('option', {value:v, selected: (settings.stt || 'azure') === v ? true : null}, t)));
  const autoIn = h('input', {type:'checkbox', id:'auto', checked: settings.autoSend ? true : null, style:'width:22px;height:22px'});
  const handsIn = h('input', {type:'checkbox', id:'hands', checked: settings.handsFree ? true : null, style:'width:22px;height:22px'});
  const saved = h('p', {class:'miclabel', role:'status'});
  frag.append(h('section', {class:'card', 'aria-label':'Chat settings'},
    h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Gráinne and the mic'),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'key'}, 'Claude API key'), keyIn,
      h('small', null, 'Stored only on this phone and sent only to Anthropic. Get one at ', h('a', {href:'https://console.anthropic.com/settings/keys', target:'_blank', rel:'noopener'}, 'console.anthropic.com'), '.')),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'model'}, 'Model'), modelIn),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'stt'}, 'Speech recognition'), sttIn,
      h('small', null, 'Azure uses a proper Irish model with your Azure key (set it below). The phone’s own recogniser often hears Irish as English.')),
    h('div', {class:'field'}, h('label', {class:'lbl', for:'lang'}, 'Phone recogniser language'), langIn,
      h('small', null, 'If Irish isn’t recognised, try “Irish (ga)”.')),
    h('label', {class:'row', for:'auto', style:'align-items:center;font-weight:700'}, autoIn, 'Send chat replies as soon as I stop speaking'),
    h('label', {class:'row', for:'hands', style:'align-items:center;font-weight:700'}, handsIn, 'Hands-free chat: open the mic when she finishes speaking'),
    h('div', {class:'row'}, h('button', {type:'button', class:'btn primary grow', onclick:() => {
      settings = {...settings, key:keyIn.value.trim(), model:modelIn.value, lang:langIn.value, stt:sttIn.value, autoSend:autoIn.checked, handsFree:handsIn.checked};
      saveSettings(); saved.textContent = 'Saved.';
    }}, 'Save')), saved));

  // Mic check: a live level meter, a test with whichever recogniser is in use, and the log to copy for troubleshooting
  if (window.azureListen){
    const meter = h('i'), bar = h('div', {class:'meter', 'aria-hidden':'true'}, meter);
    const result = h('p', {class:'miclabel', role:'status'});
    const logBox = h('pre', {class:'miclog'});
    const showLog = () => { let log = []; try { log = JSON.parse(localStorage.getItem('labhair-miclog') || '[]'); } catch(e){} logBox.textContent = log.length ? log.map(x => JSON.stringify(x)).join('\n') : 'Nothing logged yet. Try the mic in a lesson, or tap Test below.'; };
    const facts = () => ({version:document.body.dataset.version || '', engine: useAzureSTT() ? 'azure' : (SR ? 'chrome' : 'none'), azureKey:hasAzure(), region:settings.azureRegion || '', stt:settings.stt || 'azure', chromeSR:!!SR, lang:settings.lang, ua:navigator.userAgent.slice(0, 90)});
    showLog();
    frag.append(h('section', {class:'card', 'aria-label':'Mic check'},
      h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Mic check · troubleshooting'),
      h('p', {class:'en', style:'font-size:14px'}, 'Tap Test, say “Dia duit, cad é mar atá tú?”, then pause. The bar should jump when you speak.'),
      bar,
      h('div', {class:'row'},
        h('button', {type:'button', class:'btn primary', onclick:async e => {
          const btn = e.currentTarget;
          if (window.activeListen){ activeListen.stop(); return; }
          micLog('mic check started', facts());
          window.onMicLevel = rms => { meter.style.width = Math.min(100, Math.round(rms * 600)) + '%'; };
          if (!useAzureSTT()){ result.textContent = 'Azure isn’t in use (' + (hasAzure() ? 'Settings says use the phone’s recogniser' : 'no Azure key and region saved') + '). Use the Mic test above for the phone’s recogniser.'; window.onMicLevel = null; showLog(); return; }
          btn.textContent = 'Stop';
          const L = azureListen(st => { result.textContent = st === 'checking' ? 'Sending to Azure…' : st === 'hearing' ? 'Hearing you…' : 'Listening… speak now'; });
          try { const r = await L.promise; result.textContent = 'Azure heard: “' + r.text + '” (confidence ' + Math.round(r.confidence * 100) + '%)'; }
          catch(err){ result.textContent = err.code === 'cancelled' ? 'Stopped.' : listenError(err) + ' [' + err.code + (err.status ? ' ' + err.status : '') + ']'; }
          window.onMicLevel = null; meter.style.width = '0'; btn.textContent = 'Test'; showLog();
        }}, '🎙️ Test'),
        h('button', {type:'button', class:'btn', onclick:async () => {
          const text = 'Labhair mic log\n' + JSON.stringify(facts()) + '\n' + logBox.textContent;
          try { await navigator.clipboard.writeText(text); result.textContent = 'Copied. Paste it into your chat with Claude.'; }
          catch(e){ result.textContent = 'Couldn’t copy automatically: press and hold the log below to select it.'; }
        }}, '📋 Copy log'),
        h('button', {type:'button', class:'btn', onclick:() => { localStorage.removeItem('labhair-miclog'); showLog(); result.textContent = 'Log cleared.'; }}, 'Clear')),
      result, logBox));
  }

  // An Spideog and the coach: each part can be switched off
  const tog = (id, key, label) => {
    const box = h('input', {type:'checkbox', id, checked: settings[key] !== false ? true : null, style:'width:22px;height:22px', onchange:() => { settings = {...settings, [key]: box.checked}; saveSettings(); }});
    return h('label', {class:'row', for:id, style:'align-items:center;font-weight:700'}, box, label);
  };
  frag.append(h('section', {class:'card', 'aria-label':'An Spideog and the coach'},
    h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'An Spideog and the coach'),
    tog('robin', 'robin', 'Show An Spideog (the robin) in lessons'),
    tog('coachnotes', 'coach', 'Show the coach’s notes after each try'),
    tog('talkback', 'talkBack', 'Say the coach’s notes out loud'),
    h('small', {class:'legend'}, 'Changes save straight away.')));

  // What the tutor remembers about this person
  if (memory().length){
    const memList = h('ul', {class:'plain'}, memory().map(f => h('li', null, f)));
    frag.append(h('section', {class:'card', 'aria-label':'What she remembers'},
      h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'What ' + tutor().name + ' remembers about you'),
      memList,
      h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:e => { progress.memory = []; saveProgress(); memList.replaceChildren(); e.currentTarget.textContent = 'Forgotten'; }}, 'Forget all of this')));
  }

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
    h('label', {class:'row', for:'autoplay', style:'align-items:center;font-weight:700'}, autoPlayIn, 'Play ' + tutor().name + '’s replies aloud'),
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

/* ---------- Start (after every script has loaded, so kid mode and the rest are in place) ---------- */
document.addEventListener('DOMContentLoaded', () => render());
// Updates: check whenever the app comes back to the front. When a new version takes over,
// Home reloads straight away; anywhere else a bar offers to reload, so a lesson isn't cut off.
if ('serviceWorker' in navigator){
  const hadController = !!navigator.serviceWorker.controller;
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') navigator.serviceWorker.getRegistration().then(r => r && r.update()).catch(() => {}); });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return;
    if (view.name === 'home' && !activeRec && !recorder){ location.reload(); return; }
    if (document.querySelector('.update-bar')) return;
    document.body.append(h('div', {class:'update-bar', role:'status'}, 'A new version of Labhair is ready.', h('button', {type:'button', class:'btn primary', onclick:() => location.reload()}, 'Reload')));
  });
}
warmSoon();
