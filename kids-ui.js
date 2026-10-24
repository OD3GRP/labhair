/* Labhair kid mode: big pictures, an animal friend who talks, and stickers. Loaded after app.js.
   Under 6: listen, say it back (recorded, never scored), tap the picture.
   6–9: the word is shown too, a gentle mic check, tap the picture, match pairs.
   10–12: short sentences (say it, then build it from English) and a scripted chat with the host. No AI anywhere. */
'use strict';

const kidDialect = () => me().dialect || 'u';
const kidSet = () => 'k-' + kidDialect();
const kidTopic = id => window.KIDS.topics.find(t => t.id === id);
const kt = x => window.kidText(x, kidDialect());
function kidAudio(T, rel, text){ loadAudioIndex(kidSet()); return audioUrl(kidSet(), T.id + '/' + rel, text); }
const wordAudio = (T, i) => kidAudio(T, (i + 1) + '.mp3', kt(T.words[i][1]));
const sentAudio = (T, i) => kidAudio(T, (T.words.length + i + 1) + '.mp3', kt(T.sentences[i][0]));
const lineAudio = (T, key) => kidAudio(T, key + '.mp3', window.KIDS.lines[key]);

// Play a clip with the host's mouth moving; falls back to the phone's Irish voice.
function kidPlay(url, host, text){
  if (url){
    playAudio(url);
    if (host){ host.talk(true); const stop = () => host.talk(false); player.onended = stop; player.onpause = stop; }
  } else if (text) speak(text);
}

/* ---------- Home ---------- */
function kidHomeView(){
  const frag = document.createDocumentFragment(), p = me(), stickers = progress.stickers || [];
  frag.append(h('div', {class:'kid-top'},
    h('span', {class:'kid-av', 'aria-hidden':'true'}, p.avatar),
    h('div', {class:'kid-hello'}, h('strong', null, 'Dia duit, ' + p.name + '!'), currentStreak() ? h('small', null, '🔥 ' + currentStreak()) : null),
    h('button', {type:'button', class:'kid-btn small', onclick:() => { view = {name:'kid', stage:'album'}; render(); }}, '⭐ ' + stickers.length),
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Switch person', onclick:() => { view = {name:'profiles'}; render(); }}, '👥')));
  frag.append(h('div', {class:'kid-grid'}, window.KIDS.topics.map(T => {
    const done = progress.done[T.id + ':' + p.band];
    return h('button', {type:'button', class:'kid-tile' + (done ? ' done' : ''), onclick:() => openKidTopic(T.id)},
      castEl(T.host, done ? 'happy' : 'neutral', 'kid-tile-host'),
      h('span', {class:'kid-tile-pic', 'aria-hidden':'true'}, T.words[0][0]),
      h('strong', {lang:'ga'}, T.ga), h('small', null, T.en), done ? h('span', {class:'kid-star', 'aria-label':'Done'}, '⭐') : null);
  })));
  return frag;
}

/* ---------- A topic, step by step ---------- */
function stagesFor(band, T){
  if (band === 'u6') return ['say', 'tap', 'done'];
  if (band === '10-12') return ['sent', 'build'].concat(window.KIDS.chats[T.id] ? ['chat'] : [], ['done']);
  return ['say', 'tap', 'match', 'done'];
}
function openKidTopic(id){
  const T = kidTopic(id), band = me().band || '6-9';
  dropTakes();
  view = {name:'kid', T, band, stages:stagesFor(band, T), si:0, i:0, takes:{}, result:null};
  render(); window.scrollTo(0, 0);
  setTimeout(() => { const host = document.querySelector('.kid-host .cast'); if (view.T === T && host) kidPlay(lineAudio(T, 'hi'), host, window.KIDS.lines.hi); }, 400);
}
function kidNext(){
  const v = view, stage = v.stages[v.si];
  const count = stage === 'sent' || stage === 'build' ? v.T.sentences.length : stage === 'chat' ? window.KIDS.chats[v.T.id].length : v.T.words.length;
  v.result = null;
  if (stage !== 'match' && v.i < count - 1) v.i++;
  else { v.si++; v.i = 0; }
  if (v.stages[v.si] === 'done') finishKidTopic();
  render(); window.scrollTo(0, 0);
}
function finishKidTopic(){
  const v = view, key = v.T.id + ':' + v.band;
  if (!progress.done[key]){
    const have = new Set(progress.stickers || []);
    const fresh = v.T.words.map(w => w[0]).filter(e => !have.has(e));
    v.sticker = fresh.length ? fresh[Math.floor(Math.random() * fresh.length)] : '⭐';
    progress.stickers = (progress.stickers || []).concat(v.sticker);
  }
  progress.done = {...progress.done, [key]: true};
  bumpStreak(); saveProgress();
}

function kidView(){
  const v = view, frag = document.createDocumentFragment();
  if (v.stage === 'album') return kidAlbum();
  const T = v.T, stage = v.stages[v.si];
  const host = castEl(T.host, v.result === 'yes' ? 'happy' : v.result === 'again' ? 'thinking' : stage === 'done' ? 'laughing' : 'listening');
  frag.append(h('div', {class:'kid-top'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Back', onclick:goHome}, icon(I.x)),
    h('div', {class:'kid-dots', 'aria-hidden':'true'}, v.stages.filter(s => s !== 'done').map((s, i) => h('i', {class: i < v.si ? 'past' : i === v.si ? 'on' : ''}))),
    h('span', {class:'kid-topic', lang:'ga'}, T.ga)));
  frag.append(h('div', {class:'kid-host'}, host, h('span', {class:'kid-host-name'}, window.KIDS.characters[T.host].name)));
  const body = ({say:kidSay, tap:kidTap, match:kidMatch, sent:kidSentence, build:kidBuild, chat:kidChat, done:kidDone})[stage];
  frag.append(body(T, host));
  return frag;
}

// Say it: a big picture, the host says the word, the child says it back.
function kidSay(T, host){
  const v = view, w = T.words[v.i], word = kt(w[1]), url = wordAudio(T, v.i), young = v.band === 'u6';
  const card = h('section', {class:'kid-card'},
    h('button', {type:'button', class:'kid-pic', 'aria-label':'Hear: ' + word, onclick:() => kidPlay(url, host, word)}, w[0]),
    young ? null : h('p', {class:'kid-word', lang:'ga'}, word),
    h('p', {class:'kid-en'}, w[2]));
  card.append(young || !SR ? kidRecorder(T, host, url) : kidMic(word, 0.3, host, T));
  card.append(h('div', {class:'kid-row'},
    h('button', {type:'button', class:'kid-btn', onclick:() => kidPlay(url, host, word)}, '🔊 Éist'),
    h('button', {type:'button', class:'kid-btn go', onclick:kidNext}, 'Ar aghaidh ➜')));
  setTimeout(() => { if (view === v) kidPlay(url, host, word); }, 300);
  return card;
}
// Under-6s: record and hear yourself next to the host. Nothing is scored.
function kidRecorder(T, host, url){
  const v = view, take = v.takes[v.si + ':' + v.i];
  const status = h('p', {class:'kid-status', role:'status'});
  const rec = h('button', {type:'button', class:'kid-mic', 'aria-label':'Record yourself', onclick:() => recorder ? stopRec(true) : startRec(rec, status, u => { v.takes[v.si + ':' + v.i] = u; if (view === v) render(); })}, h('span', null, '🎤'));
  return h('div', {class:'kid-say'}, rec,
    take ? h('button', {type:'button', class:'kid-btn', onclick:() => playSeq([url, take].filter(Boolean))}, '▶️ Mise!') : null, status);
}
// 6–12: speech recognition with a forgiving pass mark. Kids are never told they failed, just "Arís!".
function kidMic(expected, pass, host, T){
  const v = view, status = h('p', {class:'kid-status', role:'status'}, v.result === 'yes' ? '⭐ Maith thú!' : v.result === 'again' ? 'Arís! Have another go.' : 'Tap the mic and say it!');
  const btn = h('button', {type:'button', class:'kid-mic' + (v.result === 'yes' ? ' yes' : ''), 'aria-label':'Say it', onclick:() => {
    if (activeRec){ activeRec.stop(); return; }
    player.pause();
    const r = new SR(); r.lang = settings.lang; r.interimResults = false; r.maxAlternatives = 3;
    let heard = '';
    r.onresult = e => { const alts = [...e.results[0]]; heard = alts.map(a => a.transcript).join(' '); };
    r.onerror = e => { status.textContent = e.error === 'no-speech' ? 'I didn’t hear anything. Tap and try again!' : micError(e.error); };
    r.onend = () => {
      activeRec = null; btn.classList.remove('on');
      if (!heard) return;
      const ok = grade(expected, heard).score >= pass;
      v.result = ok ? 'yes' : 'again';
      if (ok){ progress.said = (progress.said || 0) + 1; saveProgress(); }
      render();
      const hostNow = document.querySelector('.kid-host .cast');
      kidPlay(lineAudio(T, ok ? 'yes' : 'again'), hostNow, window.KIDS.lines[ok ? 'yes' : 'again']);
    };
    try { r.start(); activeRec = r; btn.classList.add('on'); status.textContent = 'Ag éisteacht… 👂'; } catch(e){ status.textContent = 'Tap the mic again.'; }
  }}, h('span', null, v.result === 'yes' ? '⭐' : '🎤'));
  return h('div', {class:'kid-say'}, btn, status);
}

// Tap the picture: the host says a word; pick it from 3 (under 6) or 4 pictures.
function kidTap(T, host){
  const v = view, n = v.band === 'u6' ? 3 : 4, target = T.words[v.i], word = kt(target[1]), url = wordAudio(T, v.i);
  if (!v.choices || v.choicesFor !== v.i){
    v.choicesFor = v.i;
    v.choices = shuffle([target].concat(shuffle(T.words.filter(w => w !== target)).slice(0, n - 1)));
  }
  const grid = h('div', {class:'kid-choices'}, v.choices.map(w => h('button', {type:'button', class:'kid-choice' + (v.result === 'yes' && w === target ? ' right' : ''), 'aria-label':w[2], onclick:e => {
    if (v.result === 'yes') return;
    if (w === target){ v.result = 'yes'; render(); kidPlay(lineAudio(T, 'yes'), document.querySelector('.kid-host .cast'), window.KIDS.lines.yes); }
    else { e.currentTarget.classList.remove('shake'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('shake'); kidPlay(url, host, word); }
  }}, w[0])));
  setTimeout(() => { if (view === v && !v.result) kidPlay(url, host, word); }, 300);
  return h('section', {class:'kid-card'},
    h('p', {class:'kid-ask', lang:'ga'}, window.KIDS.lines.tap),
    h('button', {type:'button', class:'kid-btn', onclick:() => kidPlay(url, host, word)}, '🔊 Éist arís'),
    grid,
    v.result === 'yes' ? h('div', {class:'kid-row'}, h('p', {class:'kid-word', lang:'ga'}, word), h('button', {type:'button', class:'kid-btn go', onclick:kidNext}, 'Ar aghaidh ➜')) : null);
}

// Match pairs: pictures and words face down; find the pairs.
function kidMatch(T, host){
  const v = view;
  if (!v.cards){
    const pick = shuffle(T.words).slice(0, 4);
    v.cards = shuffle(pick.flatMap(w => [{w, face:w[0], kind:'pic'}, {w, face:kt(w[1]), kind:'word'}]));
    v.open = []; v.found = new Set();
  }
  const allFound = v.found.size === 4;
  const grid = h('div', {class:'kid-memory'}, v.cards.map((c, i) => {
    const shown = v.open.includes(i) || v.found.has(c.w);
    return h('button', {type:'button', class:'kid-mem' + (shown ? ' up' : '') + (v.found.has(c.w) ? ' found' : '') + (c.kind === 'word' ? ' word' : ''), 'aria-label': shown ? c.face : 'Card ' + (i + 1), onclick:() => {
      if (shown || v.open.length === 2) return;
      v.open.push(i); render();
      if (v.open.length === 2){
        const [a, b] = v.open.map(k => v.cards[k]);
        if (a.w === b.w){
          v.found.add(a.w); v.open = [];
          setTimeout(() => { render(); kidPlay(wordAudio(T, T.words.indexOf(a.w)), document.querySelector('.kid-host .cast'), kt(a.w[1])); }, 200);
        } else setTimeout(() => { v.open = []; if (view === v) render(); }, 900);
      }
    }}, shown ? c.face : '?');
  }));
  return h('section', {class:'kid-card'},
    h('p', {class:'kid-ask'}, 'Find the pairs!'), grid,
    allFound ? h('button', {type:'button', class:'kid-btn go', onclick:kidNext}, 'Maith thú! ➜') : null);
}

// 10–12: short sentences, like the grown-up Abair é.
function kidSentence(T, host){
  const v = view, s = T.sentences[v.i], ga = kt(s[0]), url = /…/.test(ga) ? null : sentAudio(T, v.i);
  setTimeout(() => { if (view === v && !v.result && url) kidPlay(url, host, ga); }, 300);
  return h('section', {class:'kid-card'},
    h('p', {class:'kid-word', lang:'ga'}, ga), h('p', {class:'kid-en'}, s[1]),
    h('button', {type:'button', class:'kid-btn', onclick:() => kidPlay(url, host, ga)}, '🔊 Éist'),
    SR ? kidMic(ga.replace(/…/g, ''), 0.7, host, T) : kidRecorder(T, host, url),
    h('button', {type:'button', class:'kid-btn go', onclick:kidNext}, 'Ar aghaidh ➜'));
}
function kidBuild(T, host){
  const v = view, s = T.sentences[v.i], ga = kt(s[0]), url = /…/.test(ga) ? null : sentAudio(T, v.i);
  return h('section', {class:'kid-card'},
    h('p', {class:'kid-en'}, 'How do you say…'), h('p', {class:'kid-word'}, s[1]),
    v.result || v.reveal ? h('p', {class:'kid-word', lang:'ga'}, ga) : h('button', {type:'button', class:'kid-btn', onclick:() => { v.reveal = true; render(); }}, '💡 Help'),
    SR ? kidMic(ga.replace(/…/g, ''), 0.7, host, T) : kidRecorder(T, host, url),
    h('button', {type:'button', class:'kid-btn go', onclick:() => { v.reveal = false; kidNext(); }}, 'Ar aghaidh ➜'));
}
// Scripted chat: the host says a line; tap a reply, hear it, then say it.
function kidChat(T, host){
  const v = view, step = window.KIDS.chats[T.id][v.i], say = kt(step.say);
  const url = kidAudio(T, 'chat' + (v.i + 1) + '.mp3', say);
  setTimeout(() => { if (view === v && v.picked == null) kidPlay(url, host, say); }, 300);
  return h('section', {class:'kid-card'},
    h('div', {class:'kid-bubble', lang:'ga'}, say), h('p', {class:'kid-en'}, step.en),
    h('div', {class:'kid-replies'}, step.replies.map((r, j) => {
      const text = kt(r[0]), rurl = /…/.test(text) ? null : kidAudio(T, 'chat' + (v.i + 1) + '-' + (j + 1) + '.mp3', text);
      return h('button', {type:'button', class:'kid-reply' + (v.picked === j ? ' on' : ''), onclick:() => { v.picked = j; render(); kidPlay(rurl, null, text); }},
        h('strong', {lang:'ga'}, text), h('small', null, r[1]));
    })),
    v.picked != null && SR ? kidMic(kt(step.replies[v.picked][0]).replace(/…/g, ''), 0.6, host, T) : null,
    v.picked != null ? h('button', {type:'button', class:'kid-btn go', onclick:() => { v.picked = null; kidNext(); }}, 'Ar aghaidh ➜') : null);
}

function kidDone(T, host){
  const v = view;
  setTimeout(() => { if (view === v) kidPlay(lineAudio(T, 'bye'), host, window.KIDS.lines.bye); }, 300);
  return h('section', {class:'kid-card kid-done'},
    h('p', {class:'kid-burst', 'aria-hidden':'true'}, '🎉'),
    h('p', {class:'kid-word', lang:'ga'}, 'Ar fheabhas!'),
    v.sticker ? h('div', null, h('p', {class:'kid-en'}, 'A new sticker!'), h('p', {class:'kid-sticker'}, v.sticker)) : h('p', {class:'kid-en'}, 'You did it again!'),
    h('div', {class:'kid-row'},
      h('button', {type:'button', class:'kid-btn', onclick:() => openKidTopic(T.id)}, '🔁 Arís'),
      h('button', {type:'button', class:'kid-btn go', onclick:goHome}, '🏠 Baile')));
}
function kidAlbum(){
  const s = progress.stickers || [], frag = document.createDocumentFragment();
  frag.append(h('div', {class:'kid-top'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Back', onclick:goHome}, icon(I.x)),
    h('span', {class:'kid-topic'}, 'Mo ghreamáin · My stickers')));
  frag.append(s.length ? h('div', {class:'kid-album'}, s.map(e => h('span', {class:'kid-sticker'}, e)))
    : h('p', {class:'kid-en', style:'text-align:center'}, 'Finish a game to win your first sticker!'));
  return frag;
}

VIEWS.kid = () => kidView();
