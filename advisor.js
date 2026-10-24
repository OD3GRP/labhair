/* An Spideog, the advisor on your shoulder, and the talk-back coach. Loaded after app.js.
   - The robin sits in the corner of lessons and reviews. Tap it for the literal meaning, why it's built that way,
     the sound changes in each word, and how the other dialects say it.
   - After every try, the coach explains in plain English what you said and how well, and says it aloud.
   - "Tell me more" asks Claude for a fuller explanation (adults with a key), cached on the phone. */
'use strict';

/* ---------- The phrase you're on ---------- */
function currentItem(){
  const v = view;
  if (v.name === 'lesson' && v.L && !v.L.checkpoint){
    const s = v.steps[v.step], L = v.L;
    if (s === 'Abair é'){ const P = L.phrases[v.idx]; return P && {ga:P[0], en:P[1], note:P[4], L, n:v.idx + 1}; }
    if (s === 'Tóg é'){ const D = L.drills[v.idx]; if (!D) return null; const P = L.phrases.find(p => p[0] === D[1]); return {ga:D[1], en:D[0], note:P && P[4], L, n:L.phrases.length + v.idx + 1}; }
  }
  if (v.name === 'review' && !v.done && v.items[v.idx]){ const it = v.items[v.idx]; return {ga:it.ga, en:it.en, note:it.note, L:it.L, n:it.n}; }
  return null;
}

/* ---------- Sound coach: what changed at the start of a word, and why ---------- */
const NOT_LENITED = new Set(['thall', 'chuig', 'chun', 'chomh', 'thart', 'thuas', 'theas', 'thíos']);
const LENITION_SOUND = {b:'bh sounds like a v or w', c:'ch is the throaty sound in “loch”', d:'dh sounds like a soft gh or a y', f:'fh is silent', g:'gh sounds like a soft gh or a y', m:'mh sounds like a v or w', p:'ph sounds like an f', s:'sh sounds like an h', t:'th sounds like an h'};
function soundCoach(token){
  const w = token.replace(/[.,!?;:“”"()…]/g, ''), lw = w.toLowerCase();
  if (!w) return null;
  const caps = /^[a-z]+[AEIOUÁÉÍÓÚA-Z]/.test(w);   // nDoire, mBéal, hAontroim, tSasana
  let m;
  if (/^bhf/i.test(w)) return {word:w, kind:'eclipsis', base:'f' + w.slice(3), text:'Eclipsis: bh is put in front of f. Say the bh (like a w or v); the f is silent.'};
  if ((m = lw.match(/^(m)(b)|^(g)(c)|^(n)(d)|^(b)(p)|^(d)(t)|^(n)(g)/))){
    const pair = m.filter(Boolean).slice(1);
    return {word:w, kind:'eclipsis', base:w.slice(1), text:'Eclipsis: ' + pair[0] + ' is put in front of ' + pair[1] + '. Say the ' + (pair.join('') === 'ng' ? 'ng as in “sing”' : pair[0]) + ', not the ' + pair[1] + '.'};
  }
  if (/^n-/.test(w) || (/^n[AEIOUÁÉÍÓÚ]/.test(w))) return {word:w, kind:'eclipsis', base:w.replace(/^n-?/, ''), text:'Eclipsis before a vowel: an n goes in front, and you say it.'};
  if (/^t-/.test(w) || /^t[AEIOUÁÉÍÓÚ]/.test(w)) return {word:w, kind:'t-prefix', base:w.replace(/^t-?/, ''), text:'A t- goes in front of a vowel after “an” (the) with some words. Say the t.'};
  if (/^ts/.test(lw) && lw.length > 3) return {word:w, kind:'t-prefix', base:w.slice(1), text:'After “an”, some words starting with s take a t, and the s goes silent: say it with a t.'};
  if (/^h[aeiouáéíóú]/i.test(w) && (caps || ['haois', 'hálainn', 'haon', 'hocht', 'hiontach', 'huair', 'háit'].includes(lw))) return {word:w, kind:'h-prefix', base:w.slice(1), text:'An h goes in front of a vowel after words like le, go, Cá and Dé. Say the h.'};
  if ((m = lw.match(/^([bcdfgmpst])h/)) && !NOT_LENITED.has(lw) && lw.length > 2) return {word:w, kind:'lenition', base:w[0] + w.slice(2), text:'Lenition (softening): an h after the first letter. Here ' + LENITION_SOUND[m[1]] + '.'};
  return null;
}

// A few small words worth glossing when you miss them.
const GLOSS = {agam:'“at me”, how Irish says “I have”', agat:'“at you”', orm:'“on me”', ort:'“on you”', air:'“on him”', uirthi:'“on her”', liom:'“with me”', leat:'“with you”', duit:'“to you”', dom:'“to me”',
  tá:'“is” or “am”', níl:'“isn’t”', is:'“is”, for saying who or what something is', mé:'“I” or “me”', tú:'“you”', sé:'“he” or “it”', sí:'“she”', muid:'“we”', siad:'“they”', mo:'“my”', do:'“your” (or “to”)', an:'“the”', go:'a little linking word', ag:'“at”, and with an action word it makes “-ing”', i:'“in”', le:'“with”', ar:'“on”', féin:'“self”', seo:'“this”', sin:'“that”'};
const FADA_SOUND = {'á':'aw', 'é':'ay', 'í':'ee', 'ó':'oh', 'ú':'oo'};
const pickOne = a => a[Math.floor(Math.random() * a.length)];

/* ---------- The talk-back coach ---------- */
function coachFor(expected, check, v){
  const res = check.res, total = res.length;
  const ok = res.filter(r => r.s === 'ok').length, fada = res.filter(r => r.s === 'fada'), miss = res.filter(r => r.s === 'miss');
  const cur = currentItem(), note = cur && cur.ga === expected ? cur.note : null;
  const tokens = expected.split(/\s+/);
  const orig = w => tokens.find(t => toWords(t)[0] === w) || w;
  const word = w => orig(w).replace(/[.,!?;:“”"()…]/g, '');
  const lines = [];
  // Opening line: how much was there.
  if (check.score >= 0.85 && !fada.length) lines.push(pickOne(['Maith thú! That was spot on.', 'Lovely. Every word was there.', 'Go hiontach! That’s it exactly.']));
  else if (!miss.length) lines.push('Very nearly. All the words were there.');
  else lines.push('You got ' + ok + ' of ' + total + ' words' + (fada.length ? ', plus ' + (fada.length === 1 ? 'one' : fada.length) + ' with a fada slip' : '') + '.');
  // Then at most two specifics: missed words first, then fadas.
  const details = [];
  for (const r of miss){
    const sc = soundCoach(orig(r.w)), g = GLOSS[r.w];
    details.push('You missed “' + word(r.w) + '”' + (g ? ', which means ' + g : '') + '.' + (sc ? ' That’s ' + sc.base + ' with ' + (sc.kind === 'lenition' ? 'a softened start' : sc.kind === 'eclipsis' ? 'a new sound in front' : 'an extra letter in front') + '.' : ''));
  }
  for (const r of fada){
    const ch = [...r.w].find(c => FADA_SOUND[c]);
    details.push('Check the fada on “' + word(r.w) + '”' + (ch ? ': the ' + ch + ' says “' + FADA_SOUND[ch] + '”.' : '.'));
  }
  lines.push(...details.slice(0, 2));
  if (check.score < 0.85 && details.length < 2 && note && note.lit) lines.push('Word for word, it’s “' + note.lit + '”.');
  // How clearly the phone heard you (the recogniser's confidence, not a native speaker's ear).
  if (check.conf){
    if (check.conf >= 0.8) lines.push(check.score >= 0.85 ? 'The phone heard you clearly, too.' : 'The phone heard you clearly, so it’s the words, not the accent.');
    else if (check.conf >= 0.5) lines.push('The phone wasn’t fully sure what it heard, so try it a touch slower.');
    else lines.push('I couldn’t quite catch that. Try a little slower, and closer to the phone.');
  }
  return {text:lines.join(' '), expected, said:check.said, more:null};
}

// The coach's box under a result: the robin, what it said, replay, and "Tell me more".
function coachBox(v){
  const c = v.coach;
  if (!c || v.check == null) return null;
  const moreBtn = settings.key && !isKid() && !c.more ? h('button', {type:'button', class:'btn', style:'min-height:38px', onclick:() => tellMeMore(v)}, c.loading ? 'Thinking…' : 'Cén fáth? · Tell me more') : null;
  return h('div', {class:'coach', role:'status'},
    castEl('spideog', 'talking', 'coach-bird'),
    h('div', {class:'coach-body'},
      h('p', null, c.text),
      c.more ? h('p', {class:'coach-more'}, c.more) : null,
      h('div', {class:'row'},
        h('button', {type:'button', class:'btn', style:'min-height:38px', onclick:() => sayEnglish(c.more || c.text)}, icon(I.speaker, 16), 'Again'),
        moreBtn)));
}
async function tellMeMore(v){
  const c = v.coach, key = c.expected + '|' + c.said;
  const cache = store.get('labhair-why', {});
  if (cache[key]){ c.more = cache[key]; render(); if (settings.talkBack !== false) sayEnglish(c.more); return; }
  c.loading = true; render();
  const T = tutor(), cur = currentItem();
  const prompt = 'A learner of ' + T.dialect + ' tried to say: "' + c.expected + '"' + (cur ? ' (' + cur.en + ')' : '') + '.\nSpeech recognition heard: "' + c.said + '".\n' +
    'In 3 or 4 short, friendly sentences of plain English, explain what the phrase means word by word, why it is built that way (mention lenition or eclipsis only if it matters here), and what to fix in their attempt. Recognition often mishears Irish, so be kind about small differences. ' +
    'Reply with ONLY JSON: {"explain": "…"}';
  try {
    const r = await askClaude('You are a warm, clear Irish tutor who explains the how and why of the language to an adult beginner.', [{role:'user', content:prompt}]);
    c.more = String(r.explain || '').trim() || 'Sorry, I couldn’t explain that one.';
    if (r.explain){ cache[key] = c.more; const keys = Object.keys(cache); if (keys.length > 300) delete cache[keys[0]]; store.set('labhair-why', cache); }
  } catch(e){ c.more = claudeErrorText(e); }
  c.loading = false;
  if (view === v){ render(); if (settings.talkBack !== false) sayEnglish(c.more); }
}

/* ---------- The robin and its sheet ---------- */
function robinSheet(cur, onClose){
  const words = cur.ga.split(/\s+/).map(t => ({t, sc:soundCoach(t)}));
  const coachOut = h('p', {class:'sheet-coach'}, 'Tap a word to see how it changes.');
  const others = ['u', 'c', 'm'].filter(d => d !== (me().dialect || 'u')).map(d => {
    const L2 = courseFor(d).flatMap(u => u.lessons).find(l => l.id === cur.L.id);
    if (!L2) return null;
    const np = L2.phrases.length, text = cur.n <= np ? L2.phrases[cur.n - 1][0] : (L2.drills[cur.n - np - 1] || [])[1];
    if (!text) return null;
    const src = audioFor(L2, cur.n, text, d);
    return h('div', {class:'dial'}, h('span', {class:'dial-name'}, DIALECT_NAMES[d]),
      h('b', {lang:'ga'}, text), text === cur.ga ? h('small', null, 'the same as yours') : null,
      src ? h('button', {type:'button', class:'btn', style:'min-height:34px', onclick:() => playAudio(src)}, icon(I.speaker, 14)) : null);
  }).filter(Boolean);
  return h('section', {class:'sheet', role:'dialog', 'aria-label':'An Spideog explains'},
    h('div', {class:'sheet-head'}, castEl('spideog', 'happy', 'sheet-bird'),
      h('div', null, h('strong', null, 'An Spideog'), h('small', null, 'The how and the why')),
      h('button', {type:'button', class:'iconbtn', 'aria-label':'Close', onclick:onClose}, icon(I.x))),
    h('p', {class:'phrase', lang:'ga', style:'font-size:22px'}, cur.ga),
    h('p', {class:'en'}, cur.en),
    cur.note ? [h('p', null, h('span', {class:'eyebrow', style:'color:var(--gorse-text)'}, 'Word for word'), h('br'), '“' + cur.note.lit + '”'),
      h('p', null, h('span', {class:'eyebrow', style:'color:var(--green-text)'}, 'Why'), h('br'), cur.note.why)] : null,
    h('div', null, h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Sound coach'),
      h('div', {class:'words', style:'margin-top:6px'}, words.map(({t, sc}) => h('button', {type:'button', class:'w ' + (sc ? 'fada' : 'ok'), onclick:() => {
        coachOut.replaceChildren(sc ? h('span', null, h('b', null, t), ' comes from ', h('a', {href:'https://www.teanglann.ie/en/fuaim/' + encodeURIComponent(sc.base.toLowerCase()), target:'_blank', rel:'noopener'}, sc.base), '. ', sc.text)
          : h('span', null, h('b', null, t), ' has no change at the start. ', h('a', {href:'https://www.teanglann.ie/en/fuaim/' + encodeURIComponent(toWords(t)[0] || t), target:'_blank', rel:'noopener'}, 'Hear it on teanglann.ie')));
      }}, t))), coachOut),
    others.length ? h('div', null, h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'In the other dialects'), others) : null);
}
let robinOpen = false;
function afterRender(){
  document.querySelectorAll('.robin, .sheet-wrap').forEach(e => e.remove());
  const cur = currentItem();
  if (!cur || isKid()) { robinOpen = false; return; }
  const missed = view.check && view.check.score < 0.85;
  const btn = h('button', {type:'button', class:'robin' + (missed ? ' hop' : ''), 'aria-label':'Ask An Spideog why', onclick:() => { robinOpen = !robinOpen; afterRender(); }},
    castEl('spideog', missed ? 'thinking' : 'neutral'), missed ? h('span', {class:'robin-tip'}, 'Cén fáth?') : null);
  document.body.append(btn);
  if (robinOpen) document.body.append(h('div', {class:'sheet-wrap', onclick:e => { if (e.target === e.currentTarget){ robinOpen = false; afterRender(); } }},
    robinSheet(cur, () => { robinOpen = false; afterRender(); })));
}

/* ---------- Weak words ---------- */
function weakWords(){ return Object.entries(progress.weak || {}).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 12); }
function weakView(){
  const frag = document.createDocumentFragment(), list = weakWords();
  frag.append(h('div', {class:'lhead'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Close', onclick:goHome}, icon(I.x)),
    h('h2', {style:'font-size:22px;font-weight:800'}, 'Focail le cleachtadh')));
  frag.append(h('p', {class:'en'}, 'Words that keep coming up yellow or red. They drop off this list as you get them right.'));
  if (!list.length){ frag.append(h('p', {class:'note'}, 'Nothing here yet. Maith thú!')); return frag; }
  frag.append(h('div', {class:'card'}, list.map(([w, n]) => {
    const sc = soundCoach(w);
    return h('div', {class:'weak-row'},
      h('a', {href:'https://www.teanglann.ie/en/fuaim/' + encodeURIComponent(sc ? sc.base : w), target:'_blank', rel:'noopener', lang:'ga'}, icon(I.speaker, 14), w),
      h('small', null, (GLOSS[w] ? GLOSS[w] + ' · ' : '') + (sc ? sc.kind : '') ),
      h('span', {class:'chip'}, '×' + n));
  })));
  frag.append(h('button', {type:'button', class:'btn primary', onclick:() => openReview(list.slice(0, 8).map(([w]) => w))}, 'Practise these'));
  return frag;
}

VIEWS.weak = () => weakView();
