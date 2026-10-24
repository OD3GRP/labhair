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
const DEFAULT_SETTINGS = { key:'', model:'claude-sonnet-5-5', lang:'ga-IE', autoSend:false, voiceCheck:'speech' };
let settings = {...DEFAULT_SETTINGS, ...store.get('labhair-settings', {})};
const saveSettings = () => store.set('labhair-settings', settings);
let progress = {done:{}, streak:0, lastDay:'', said:0, ...store.get('labhair-progress', {})};
const saveProgress = () => store.set('labhair-progress', progress);
function markDone(id){
  progress.done = {...progress.done, [id]: true};
  const t = today();
  if (progress.lastDay !== t){ progress.streak = progress.lastDay === yesterday() ? progress.streak + 1 : 1; progress.lastDay = t; }
  saveProgress();
}
const currentStreak = () => (progress.lastDay === today() || progress.lastDay === yesterday()) ? progress.streak : 0;
const allLessons = () => window.UNITS.flatMap(u => u.lessons.map(l => ({...l, unit:u})));

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
let view = {name:'home'};
function render(){ stopMic(); $app.replaceChildren(view.name === 'home' ? homeView() : view.name === 'settings' ? settingsView() : lessonView()); }
function goHome(){ if (view.chat && view.chat.ctl) view.chat.ctl.abort(); view = {name:'home'}; render(); window.scrollTo(0, 0); }

function homeView(){
  const ls = allLessons(), doneCount = ls.filter(l => progress.done[l.id]).length;
  const next = ls.find(l => !progress.done[l.id]);
  const frag = document.createDocumentFragment();
  frag.append(
    h('div', {class:'top'},
      h('span', {class:'brand'}, 'Labhair'),
      h('div', {class:'row', style:'align-items:center'},
        h('span', {class:'chip'}, 'Gaeilge Uladh'),
        h('button', {type:'button', class:'iconbtn', 'aria-label':'Settings', onclick:() => { view = {name:'settings'}; render(); }}, icon(I.gear)))),
    h('div', {class:'stats'},
      h('div', {class:'stat'}, h('b', null, currentStreak()), h('span', null, 'sraith · day streak')),
      h('div', {class:'stat'}, h('b', null, progress.said || 0), h('span', null, 'frásaí · phrases said')),
      h('div', {class:'stat'}, h('b', null, doneCount + '/' + ls.length), h('span', null, 'ceachtanna · lessons')))
  );
  if (!settings.key) frag.append(h('p', {class:'note'}, h('strong', null, 'One-time setup: '), 'add your Claude API key in Settings so you can chat with Gráinne. Lessons work without it.'));
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
  view = {name:'lesson', L, steps, step:0, idx:0, check:null, reveal:false, said:[], drills:[],
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
  render();
}
function hearRow(P){
  return h('div', {class:'hear'}, 'Hear it:',
    gaVoice ? h('button', {type:'button', onclick:() => speak(P[0])}, icon(I.speaker, 16), 'Éist') : null,
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
    hearRow(P),
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
    v.reveal || v.check ? h('p', {class:'reveal'}, 'Answer: ', h('b', {lang:'ga'}, D[1]), gaVoice ? h('button', {type:'button', class:'btn', style:'min-height:36px;margin-left:8px', onclick:() => speak(D[1])}, 'Éist') : null)
      : h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:() => { v.reveal = true; render(); }}, 'Show me the answer'),
    v.check ? null : answerBox('Say it in Irish', text => doCheck(D[1], text)),
    resultBlock(v.check),
    h('div', {class:'row'}, v.check
      ? [h('button', {type:'button', class:'btn', onclick:() => { v.check = null; render(); }}, 'Try again'),
         h('button', {type:'button', class:'btn primary grow', onclick:() => advance('drills', v.check.score, last)}, last ? 'On to Comhrá' : 'Next')]
      : [h('button', {type:'button', class:'btn primary grow', onclick:() => doCheck(D[1])}, 'Check')]));
}

/* ---------- Comhrá: live chat ---------- */
function allowedPhrases(L){
  const all = allLessons().filter(x => !x.checkpoint);
  const upto = L.checkpoint ? all.filter(x => x.unit.num <= L.unit.num).length : all.findIndex(x => x.id === L.id) + 1;
  return all.slice(0, upto).flatMap(x => x.phrases.map(p => p[0]).concat(x.drills.map(d => d[1])));
}
function rulesFor(L){
  const me = window.LEARNER;
  return 'You are Gráinne, a warm, chatty woman from Gaoth Dobhair in Co. Donegal. You are helping ' + me.ga + ' (' + me.en + '), an adult beginner, practise speaking Ulster Irish in a short role-play.\n' +
    'Scene: ' + L.chat.scene + '\n' +
    'His goals: ' + L.chat.goals.map(g => g[0] + ' = ' + g[1]).join('; ') + '\n' +
    'Phrases he has learned so far: ' + allowedPhrases(L).join(' | ') + '\n' +
    'Rules:\n' +
    '- Speak only Ulster Irish in standard spelling (e.g. "Cad é mar atá tú?", "Tá mé", "An dtig leat"). Use mostly the phrases above, plus at most one new simple word per turn.\n' +
    '- Keep each reply to one or two short sentences. Steer the chat so he gets a natural chance at each goal.\n' +
    '- His text comes from speech recognition, which often mishears Irish. Judge what he most likely SAID. Ignore capitals, punctuation and spelling slips a listener would not hear; only recast real grammar or word mistakes.\n' +
    '- If his Irish has a mistake, put the corrected version of what he meant in "recast" and a short, friendly English tip in "note". Otherwise leave both as "".\n' +
    '- If he speaks English, put the Irish for what he meant in "recast" and gently invite him to say it in Irish.\n' +
    '- "goalsMet" lists the ids of every goal he has achieved so far in the whole chat.\n' +
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
      gaVoice ? h('button', {type:'button', class:'say-again', onclick:() => speak(m.ga)}, 'Éist · Hear it') : null));
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
    if (typeof r.reply === 'string' && r.reply){ c.msgs.push({who:'g', ga:r.reply, en: typeof r.english === 'string' ? r.english : ''}); c.turns.push({role:'assistant', content:JSON.stringify(r)}); speak(r.reply); }
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
  const transcript = c.msgs.map(m => m.who === 'g' ? 'Gráinne: ' + m.ga : window.LEARNER.ga + ': ' + m.text).join('\n');
  const system = 'You are an encouraging Ulster Irish tutor. The learner’s lines came from speech recognition, so judge what he most likely said.';
  const prompt = 'Goals: ' + L.chat.goals.map(g => g[1]).join('; ') + '\n\nTranscript:\n' + transcript +
    '\n\nReply with ONLY JSON: {"wellDone": ["two short specific things he did well"], "practise": ["two short specific things to practise, each with the correct Irish"], "score": 0-' + L.chat.goals.length + ' (one point per goal clearly achieved)}';
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
    h('p', {class:'legend'}, 'Voice for Gráinne: ' + (gaVoice ? gaVoice.name + ' (Irish)' : 'no Irish voice on this phone, so use the teanglann.ie links'))));

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

  // Progress
  const confirmBox = h('div', {class:'row', hidden:true},
    h('button', {type:'button', class:'btn', onclick:() => { confirmBox.hidden = true; }}, 'Keep it'),
    h('button', {type:'button', class:'btn primary grow', onclick:() => { progress = {done:{}, streak:0, lastDay:'', said:0}; saveProgress(); confirmBox.hidden = true; resetMsg.textContent = 'Progress reset.'; }}, 'Yes, reset'));
  const resetMsg = h('p', {class:'miclabel', role:'status'});
  frag.append(h('section', {class:'card', 'aria-label':'Progress'},
    h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Progress'),
    h('p', {class:'en'}, 'Your progress is saved on this phone.'),
    h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:() => { confirmBox.hidden = false; }}, 'Reset progress…'),
    confirmBox, resetMsg));
  return frag;
}

/* ---------- Start ---------- */
render();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
