/* Labhair commute mode: hands-free, audio-only practice for walks and drives. Loaded after app.js.
   Each item: the English, a pause for you to say it in Irish, the Irish, another pause to repeat, the Irish once more.
   Pauses are real (silent) audio, not timers, so the sequence keeps going with the screen off.
   Lock-screen controls come from the Media Session API. */
'use strict';

// A silent WAV of the given length (8 kHz, 8-bit mono), cached by half-seconds.
const silenceCache = new Map();
function silenceUrl(sec){
  sec = Math.max(0.5, Math.round(sec * 2) / 2);
  if (silenceCache.has(sec)) return silenceCache.get(sec);
  const rate = 8000, n = Math.round(rate * sec), buf = new ArrayBuffer(44 + n), d = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) d.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); d.setUint32(4, 36 + n, true); str(8, 'WAVE'); str(12, 'fmt ');
  d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, 1, true); d.setUint32(24, rate, true);
  d.setUint32(28, rate, true); d.setUint16(32, 1, true); d.setUint16(34, 8, true); str(36, 'data'); d.setUint32(40, n, true);
  new Uint8Array(buf, 44).fill(128);
  const url = URL.createObjectURL(new Blob([buf], {type:'audio/wav'}));
  silenceCache.set(sec, url);
  return url;
}

function commuteItems(source){
  if (source === 'mix'){
    const items = learnedItems().map(it => ({ga:it.ga, en:it.en, src:audioFor(it.L, it.n, it.ga)}));
    return shuffle(items).slice(0, 20);
  }
  const L = allLessons().find(l => l.id === source);
  return L.phrases.map((p, i) => ({ga:p[0], en:p[1], src:audioFor(L, i + 1, p[0])}))
    .concat(L.drills.map((d, j) => ({ga:d[1], en:d[0], src:audioFor(L, L.phrases.length + j + 1, d[1])})));
}
function openCommute(){ view = {name:'commute', picking:true}; render(); window.scrollTo(0, 0); }
function startCommute(source){
  const title = source === 'mix' ? 'Everything so far' : allLessons().find(l => l.id === source).ga;
  view = {name:'commute', source, title, items:commuteItems(source), idx:0, playing:false, showText:true, gap:1, run:0};
  render();
  commutePlay();
}

// The loop. Bumping v.run cancels whatever sequence is running.
async function commutePlay(){
  const v = view; if (v.name !== 'commute' || !v.items) return;
  const run = ++v.run; v.playing = true; updateCommuteUI();
  const alive = () => view === v && v.run === run && v.playing;
  const wait = sec => playAndWait(silenceUrl(sec * v.gap));
  while (alive() && v.idx < v.items.length){
    const it = v.items[v.idx];
    setMediaInfo(it, v);
    updateCommuteUI();
    await sayEnglish(it.en);                             if (!alive()) return;
    await wait(2.5 + it.ga.length * 0.06);               if (!alive()) return;
    if (it.src) await playAndWait(it.src); else await speakAndWait(it.ga); if (!alive()) return;
    await wait(2 + it.ga.length * 0.06);                 if (!alive()) return;
    if (it.src) await playAndWait(it.src); else await speakAndWait(it.ga); if (!alive()) return;
    await wait(1.2);                                     if (!alive()) return;
    v.idx++;
  }
  if (alive()){ v.playing = false; v.finished = true; await sayEnglish('Maith thú! That’s the lot.'); render(); }
}
function speakAndWait(text){
  if (!gaVoice) return Promise.resolve();
  return new Promise(res => { const u = new SpeechSynthesisUtterance(text); u.voice = gaVoice; u.lang = gaVoice.lang; u.rate = 0.9; u.onend = u.onerror = () => res(); speechSynthesis.cancel(); speechSynthesis.speak(u); });
}
function commutePause(){ const v = view; v.playing = false; v.run++; player.pause(); try { speechSynthesis.cancel(); } catch(e){} updateCommuteUI(); }
function commuteStep(d){ const v = view; v.idx = Math.max(0, Math.min(v.items.length - 1, v.idx + d)); v.finished = false; commutePause(); commutePlay(); }

function setMediaInfo(it, v){
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({title:it.ga, artist:it.en, album:'Labhair · ' + v.title, artwork:[{src:'icons/icon-512.png', sizes:'512x512', type:'image/png'}]});
    navigator.mediaSession.setActionHandler('play', () => commutePlay());
    navigator.mediaSession.setActionHandler('pause', () => commutePause());
    navigator.mediaSession.setActionHandler('nexttrack', () => commuteStep(1));
    navigator.mediaSession.setActionHandler('previoustrack', () => commuteStep(-1));
  } catch(e){}
}
// Update the now-playing card in place (re-rendering would cut the audio).
function updateCommuteUI(){
  const v = view, box = document.getElementById('now');
  if (!box || !v.items) return;
  const it = v.items[Math.min(v.idx, v.items.length - 1)];
  box.querySelector('.n-count').textContent = (Math.min(v.idx + 1, v.items.length)) + ' de ' + v.items.length;
  box.querySelector('.n-en').textContent = it.en;
  const ga = box.querySelector('.n-ga'); ga.textContent = it.ga; ga.hidden = !v.showText;
  const pp = document.getElementById('pp'); pp.textContent = v.playing ? '⏸' : '▶'; pp.setAttribute('aria-label', v.playing ? 'Pause' : 'Play');
}

function commuteView(){
  const v = view, frag = document.createDocumentFragment();
  frag.append(h('div', {class:'lhead'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Close', onclick:() => { commutePause(); goHome(); }}, icon(I.x)),
    h('h2', {style:'font-size:22px;font-weight:800'}, '🎧 Éist agus Abair')));
  if (v.picking){
    frag.append(h('p', {class:'en'}, 'Hands-free practice for a walk or a drive. You hear the English, say it in Irish in the pause, then hear ' + nativeName() + ' say it twice.'));
    if (!hasAzure()) frag.append(h('p', {class:'note'}, 'Tip: with your Azure key in Settings, the English prompts keep playing with the screen off.'));
    const learned = learnedItems().length;
    const list = h('div', {class:'lessons'});
    if (learned) list.append(h('button', {type:'button', class:'lesson-row next', onclick:() => startCommute('mix')},
      h('span', {class:'badge'}, '🔀'), h('span', {class:'txt'}, h('strong', null, 'Everything so far'), h('small', null, Math.min(20, learned) + ' phrases from lessons you’ve done, mixed'))));
    for (const L of allLessons().filter(l => !l.checkpoint)) list.append(h('button', {type:'button', class:'lesson-row' + (progress.done[L.id] ? ' done' : ''), onclick:() => startCommute(L.id)},
      h('span', {class:'badge'}, progress.done[L.id] ? icon(I.check) : L.unit.num), h('span', {class:'txt'}, h('strong', {lang:'ga'}, L.ga), h('small', null, L.en))));
    frag.append(list);
    return frag;
  }
  if (v.finished){
    frag.append(h('section', {class:'card', style:'align-items:center;text-align:center'}, h('p', {class:'phrase'}, 'Maith thú!'), h('p', {class:'en'}, 'You went through ' + v.items.length + ' phrases.'),
      h('div', {class:'row'}, h('button', {type:'button', class:'btn', onclick:openCommute}, 'Pick another'), h('button', {type:'button', class:'btn primary', onclick:() => { v.idx = 0; v.finished = false; render(); commutePlay(); }}, 'Again'))));
    return frag;
  }
  const it = v.items[v.idx] || {en:'', ga:''};
  frag.append(h('section', {class:'card now', id:'now'},
    h('div', {style:'display:flex;justify-content:space-between'}, h('span', {class:'eyebrow', style:'color:var(--muted)'}, v.title), h('span', {class:'counter n-count'}, (v.idx + 1) + ' de ' + v.items.length)),
    h('p', {class:'n-en phrase', style:'font-size:22px'}, it.en),
    h('p', {class:'n-ga', lang:'ga', hidden: !v.showText}, it.ga),
    h('div', {class:'transport'},
      h('button', {type:'button', class:'iconbtn big', 'aria-label':'Previous', onclick:() => commuteStep(-1)}, '⏮'),
      h('button', {type:'button', class:'iconbtn big play', id:'pp', 'aria-label': v.playing ? 'Pause' : 'Play', onclick:() => v.playing ? commutePause() : commutePlay()}, v.playing ? '⏸' : '▶'),
      h('button', {type:'button', class:'iconbtn big', 'aria-label':'Next', onclick:() => commuteStep(1)}, '⏭')),
    h('div', {class:'row', style:'justify-content:center'},
      h('button', {type:'button', class:'btn', onclick:() => { v.showText = !v.showText; updateCommuteUI(); }}, 'Show / hide Irish'),
      h('button', {type:'button', class:'btn', onclick:e => { v.gap = v.gap === 1 ? 1.6 : v.gap === 1.6 ? 0.7 : 1; e.currentTarget.textContent = 'Pauses: ' + (v.gap === 1 ? 'normal' : v.gap > 1 ? 'long' : 'short'); }}, 'Pauses: ' + (v.gap === 1 ? 'normal' : v.gap > 1 ? 'long' : 'short')))));
  return frag;
}

VIEWS.commute = () => commuteView();
