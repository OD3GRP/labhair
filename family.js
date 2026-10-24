/* Scéalta (stories) and Le chéile (the family challenge). Loaded after app.js and kids-ui.js.
   Stories: read along with the narrator, tap any word for its meaning.
   Le chéile: one phrase a day for the whole household. When a grown-up and a child have both said it, the children get a sticker. */
'use strict';

/* ---------- Scéalta ---------- */
const storyUnlocked = S => S.unit <= 1 || allLessons().some(l => l.unit.num >= S.unit && progress.done[l.id]);
function openStories(){ view = {name:'stories'}; render(); window.scrollTo(0, 0); }
function storyAudio(S, i, text){ const set = 'st-' + (me().dialect || 'u'); loadAudioIndex(set); return audioUrl(set, S.id + '/' + (i + 1) + '.mp3', text); }
function storiesView(){
  const frag = document.createDocumentFragment();
  frag.append(h('div', {class:'lhead'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Close', onclick:goHome}, icon(I.x)),
    h('h2', {style:'font-size:22px;font-weight:800'}, '📖 Scéalta · Stories')));
  frag.append(h('p', {class:'en'}, 'Short stories made from what you’ve learned. Listen, read along, and tap any word to see what it means.'));
  frag.append(h('div', {class:'lessons'}, STORIES.map(S => {
    const open = storyUnlocked(S);
    return h('button', {type:'button', class:'lesson-row' + (progress.done[S.id] ? ' done' : ''), disabled: open ? null : true, onclick:() => { view = {name:'story', S, i:-1}; render(); window.scrollTo(0, 0); }},
      h('span', {class:'badge'}, progress.done[S.id] ? icon(I.check) : S.pic), h('span', {class:'txt'}, h('strong', {lang:'ga'}, S.ga), h('small', null, open ? S.en : '🔒 Opens in Unit ' + S.unit)));
  })));
  return frag;
}
function storyView(){
  const v = view, S = v.S, d = me().dialect || 'u', frag = document.createDocumentFragment();
  const tip = h('p', {class:'story-tip', role:'status'}, 'Tap a word to see what it means.');
  const glossOf = t => { const k = t.toLowerCase().replace(/['’]/g, '’').replace(/[.,!?;:“”"()…]/g, ''); return S.gloss[k] || S.gloss[k.replace(/’/g, "'")]; };
  frag.append(h('div', {class:'lhead'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Close', onclick:() => { v.run = (v.run || 0) + 1; player.pause(); openStories(); }}, icon(I.x)),
    h('div', null, h('h2', {style:'font-size:20px;font-weight:800', lang:'ga'}, S.ga), h('p', {class:'en', style:'font-size:14px'}, S.en))));
  const lines = S.lines.map((l, i) => {
    const ga = storyLine(l[0], d), en = storyLine(l[1], d);
    return h('div', {class:'story-line' + (i === v.i ? ' on' : ''), 'data-i':String(i)},
      h('p', {lang:'ga', class:'story-ga'}, ga.split(/\s+/).flatMap(t => [h('button', {type:'button', class:'sw', onclick:e => {
        e.stopPropagation();
        const g = glossOf(t), sc = window.soundCoach ? soundCoach(t) : null;
        tip.replaceChildren();
        put(tip, h('b', {lang:'ga'}, t.replace(/[.,!?;:“”"()…]/g, '')), ' · ', g || 'no note for this one', sc ? h('small', null, ' (' + sc.kind + ': from ' + sc.base + ')') : null);
      }}, t), ' '])),
      v.showEn ? h('p', {class:'en', style:'font-size:14px'}, en) : null,
      h('button', {type:'button', class:'say-again', 'aria-label':'Hear this line', onclick:() => { const u = storyAudio(S, i, ga); u ? playAudio(u) : speak(ga); }}, icon(I.speaker, 14), 'Éist'));
  });
  frag.append(h('section', {class:'card story'}, h('p', {class:'story-pic', 'aria-hidden':'true'}, S.pic), lines, tip));
  frag.append(h('div', {class:'row'},
    h('button', {type:'button', class:'btn', onclick:() => { v.showEn = !v.showEn; render(); }}, v.showEn ? 'Hide English' : 'Show English'),
    h('button', {type:'button', class:'btn primary grow', onclick:() => readStory(v)}, '▶ Léigh dom · Read it to me')));
  return frag;
}
async function readStory(v){
  const run = v.run = (v.run || 0) + 1, d = me().dialect || 'u';
  for (let i = 0; i < v.S.lines.length; i++){
    if (view !== v || v.run !== run) return;
    v.i = i;
    document.querySelectorAll('.story-line').forEach(el => el.classList.toggle('on', el.dataset.i === String(i)));
    const ga = storyLine(v.S.lines[i][0], d), u = storyAudio(v.S, i, ga);
    if (u) await playAndWait(u); else await speakAndWait(ga);
    await new Promise(r => setTimeout(r, 500));
  }
  if (view === v && v.run === run){ progress.done = {...progress.done, [v.S.id]: true}; bumpStreak(); saveProgress(); }
}

/* ---------- Le chéile: the family phrase of the day ---------- */
const daysSince = () => Math.floor(new Date(today() + 'T12:00:00').getTime() / 864e5);
function phraseOfTheDay(){
  const pool = KIDS.topics.flatMap(T => T.sentences.map((s, i) => ({T, i, s}))).filter(x => !/…/.test(kidText(x.s[0], 'u')));
  return pool[daysSince() % pool.length];
}
const familyOn = () => profiles.list.some(p => p.kind === 'kid') && profiles.list.some(p => p.kind === 'adult');
const progressOf = id => id === me().id ? progress : {...blankProgress(), ...store.get('labhair-progress:' + id, {})};
const saidToday = id => !!(progressOf(id).together || {})[today()];
// Once a grown-up and a child have both said today's phrase, every child who said it gets a sticker (once a day).
function awardTogether(){
  const said = profiles.list.filter(p => saidToday(p.id));
  if (!said.some(p => p.kind === 'adult') || !said.some(p => p.kind === 'kid')) return false;
  for (const p of said.filter(p => p.kind === 'kid')){
    const pr = progressOf(p.id), key = 'together-' + today();
    if (pr.done[key]) continue;
    pr.done = {...pr.done, [key]: true};
    pr.stickers = (pr.stickers || []).concat('🤝');
    if (p.id === me().id){ progress = pr; saveProgress(); } else store.set('labhair-progress:' + p.id, pr);
  }
  return true;
}
function openTogether(){ view = {name:'together'}; render(); window.scrollTo(0, 0); }
function togetherCard(){
  if (!familyOn()) return null;
  const done = saidToday(me().id);
  return h('button', {type:'button', class:isKid() ? 'kid-tile together' : 'tool', onclick:openTogether},
    h('span', {'aria-hidden':'true'}, '👪'), h('strong', null, 'Le chéile'), h('small', null, done ? 'Said today ✓' : 'Say today’s phrase together'));
}
function togetherView(){
  const v = view, x = phraseOfTheDay(), d = me().dialect || 'u', ga = kidText(x.s[0], d);
  // Audio comes from the kids' set in this person's dialect.
  const set = 'k-' + d; loadAudioIndex(set);
  const url = audioUrl(set, x.T.id + '/' + (x.T.words.length + x.i + 1) + '.mp3', ga);
  const frag = document.createDocumentFragment();
  frag.append(h('div', {class:'lhead'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Close', onclick:goHome}, icon(I.x)),
    h('h2', {style:'font-size:22px;font-weight:800'}, '👪 Le chéile · Together')));
  const host = castEl(x.T.host, v.said ? 'laughing' : 'happy');
  const who = profiles.list.map(p => h('span', {class:'chip'}, p.avatar + ' ' + p.name + (saidToday(p.id) ? ' ✓' : '')));
  const complete = awardTogether();
  frag.append(h('section', {class:'kid-card'},
    h('div', {class:'kid-host'}, host),
    h('p', {class:'kid-en'}, 'Today’s phrase for everyone:'),
    h('p', {class:'kid-word', lang:'ga'}, ga), h('p', {class:'kid-en'}, x.s[1]),
    h('button', {type:'button', class:'kid-btn', onclick:() => kidPlay(url, host, ga)}, '🔊 Éist'),
    saidToday(me().id) ? h('p', {class:'kid-status'}, '✓ You said it today!') :
      h('div', {class:'kid-say'},
        h('button', {type:'button', class:'kid-mic', 'aria-label':'I said it', onclick:() => {
          progress.together = {...(progress.together || {}), [today()]: true}; bumpStreak(); saveProgress();
          v.said = true; render();
        }}, h('span', null, '🗣️')),
        h('p', {class:'kid-status'}, 'Say it out loud, then tap!')),
    h('div', {class:'row', style:'justify-content:center'}, who),
    complete ? h('p', {class:'kid-status'}, '🤝 Everyone’s said it. Sticker time for the kids!') : h('p', {class:'kid-en'}, 'When a grown-up and a child have both said it, the children get a sticker.')));
  return frag;
}

VIEWS.stories = () => storiesView();
VIEWS.story = () => storyView();
VIEWS.together = () => togetherView();
