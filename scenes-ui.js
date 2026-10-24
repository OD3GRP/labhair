/* Radharcanna player: watch the cast act out a scene, then join in and speak one part. Loaded after app.js.
   Adults also get "Radharc nua": Claude writes a fresh scene with the same backdrops and cast, voiced by Azure. */
'use strict';

const sceneDialect = () => me().dialect || 'u';
// A scene opens once you've started its unit.
const sceneUnlocked = S => S.unit <= 1 || allLessons().some(l => l.unit.num >= S.unit && progress.done[l.id]);
const savedScenes = () => progress.scenes || [];

function openScenes(){ view = {name:'scenes'}; render(); window.scrollTo(0, 0); }
function openScene(S, mode){
  const d = sceneDialect();
  view = {name:'scene', S, d, mode: mode || 'watch', i:-1, check:null, kid:isKid(), run:0};
  render(); window.scrollTo(0, 0);
  setTimeout(() => { if (view.S === S) runScene(); }, 600);
}

/* ---------- Audio for a line ---------- */
async function sceneAudio(v, i, text){
  const S = v.S;
  if (!S.gen){
    loadAudioIndex('sc-' + v.d);
    const ix = await audioIndexes['sc-' + v.d];
    if (ix) return audioUrl('sc-' + v.d, S.id + '/' + (i + 1) + '.mp3', text);
    return null;
  }
  if (!hasAzure()) return null;
  const who = S.lines[i].who;
  try { return await azureAudio(text, {voice: who === 'a' ? 'ga-IE-OrlaNeural' : 'ga-IE-ColmNeural', lang:'ga-IE', rate:'-10%'}); } catch(e){ return null; }
}

/* ---------- Running the scene ---------- */
async function runScene(){
  const v = view; if (v.name !== 'scene') return;
  const run = ++v.run;
  const alive = () => view === v && v.run === run;
  for (let i = v.i + 1; i < v.S.lines.length; i++){
    if (!alive()) return;
    v.i = i;
    const ln = sceneLine(v.S.lines[i], v.d);
    // Join in: stop at your lines and let you say them.
    if (v.mode === 'join' && v.S.lines[i].who === v.S.you && !v.kid){ v.waiting = true; render(); return; }
    showLine(v, i, ln);
    const url = await sceneAudio(v, i, ln.ga);
    if (!alive()) return;
    const actor = document.querySelector('.stage .cast[data-who="' + v.S.lines[i].who + '"]');
    if (actor) actor.talk(true);
    if (url) await playAndWait(url); else await speakAndWait(ln.ga);
    if (actor) actor.talk(false);
    if (!alive()) return;
    await new Promise(r => setTimeout(r, url || gaVoice ? 450 : 1600));
  }
  if (alive()){ v.finished = true; render(); }
}
// Update the stage in place: who's speaking, faces, and the speech bubble.
function showLine(v, i, ln){
  const stage = document.querySelector('.stage');
  if (!stage) return;
  const line = v.S.lines[i];
  stage.querySelectorAll('.cast[data-who]').forEach(el => el.setExpr(el.dataset.who === line.who ? (line.expr || 'talking') : 'listening'));
  const b = stage.querySelector('.stage-bubble');
  const actor = stage.querySelector('.cast[data-who="' + line.who + '"]');
  b.className = 'stage-bubble ' + (actor && actor.classList.contains('right') ? 'right' : 'left');
  b.replaceChildren();
  put(b, h('b', {lang:'ga'}, ln.ga), h('small', null, ln.en), ln.d !== v.d ? h('em', null, DIALECT_NAMES[ln.d]) : null);
  b.hidden = false;
}

function stageEl(v){
  const S = v.S, B = BACKDROPS[S.backdrop];
  const roles = [...new Set(S.lines.map(l => l.who))];
  const stage = h('div', {class:'stage', role:'img', 'aria-label':B.name});
  stage.innerHTML = '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + B.svg + '</svg>';
  // Things you can tap to hear their Irish names.
  B.props.forEach((p, i) => stage.append(h('button', {type:'button', class:'prop', 'aria-label':p[4] + ' · ' + p[5], style:`left:${p[0] / 4}%;top:${p[1] / 3}%;width:${p[2] / 4}%;height:${p[3] / 3}%`, onclick:async e => {
    const tip = e.currentTarget; tip.dataset.label = p[4] + ' · ' + p[5]; tip.classList.add('show'); setTimeout(() => tip.classList.remove('show'), 1800);
    loadAudioIndex('sc-' + v.d); const ix = await audioIndexes['sc-' + v.d];
    const url = ix ? audioUrl('sc-' + v.d, 'props/' + S.backdrop + '-' + (i + 1) + '.mp3', p[4]) : null;
    if (url) playAudio(url); else speak(p[4]);
  }})));
  roles.forEach((who, k) => {
    const id = sceneCast(S, who, v.d);
    const el = castEl(id, 'neutral', 'actor ' + (k === 0 ? 'left' : 'right') + (v.i < 0 ? ' enter' : ''));
    el.dataset.who = who;
    el.addEventListener('click', () => { const i = [...S.lines.keys()].reverse().find(j => j <= v.i && S.lines[j].who === who); if (i != null) sceneAudio(v, i, sceneLine(S.lines[i], v.d).ga).then(u => u ? playAudio(u) : speak(sceneLine(S.lines[i], v.d).ga)); });
    stage.append(el);
  });
  stage.append(h('div', {class:'stage-bubble', hidden:true}));
  return stage;
}

function sceneView(){
  const v = view, S = v.S, frag = document.createDocumentFragment();
  frag.append(h('div', {class:'lhead'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Close', onclick:() => { v.run++; player.pause(); v.kid ? goHome() : openScenes(); }}, icon(I.x)),
    h('div', null, h('h2', {style:'font-size:20px;font-weight:800', lang:'ga'}, S.ga), h('p', {class:'en', style:'font-size:14px'}, S.en + (v.mode === 'join' ? ' · you’re ' + CAST[sceneCast(S, S.you, v.d)].name : '')))));
  const stage = stageEl(v);
  frag.append(stage);
  if (v.i >= 0 && !v.waiting) setTimeout(() => showLine(v, v.i, sceneLine(S.lines[v.i], v.d)), 0);
  if (v.waiting){
    const ln = sceneLine(S.lines[v.i], v.d);
    frag.append(h('section', {class:'card'},
      h('span', {class:'eyebrow', style:'color:var(--gorse-text)'}, 'Your line'),
      h('p', {class:'phrase', style:'font-size:20px'}, ln.en),
      v.check ? h('p', {class:'reveal'}, 'The line: ', h('b', {lang:'ga'}, ln.ga)) : h('button', {type:'button', class:'btn', style:'align-self:flex-start', onclick:e => { e.currentTarget.replaceWith(h('p', {class:'reveal'}, h('b', {lang:'ga'}, ln.ga))); }}, 'Show me the line'),
      v.check ? null : answerBox('Say it in Irish', (text, alts) => sceneCheck(ln.ga, text, alts)),
      resultBlock(v.check),
      h('div', {class:'row'}, v.check
        ? [h('button', {type:'button', class:'btn', onclick:() => { v.check = null; view.coach = null; render(); }}, 'Try again'),
           h('button', {type:'button', class:'btn primary grow', onclick:() => sceneContinue(ln)}, 'Ar aghaidh · Carry on')]
        : [h('button', {type:'button', class:'btn', onclick:() => sceneContinue(ln)}, 'Skip'), h('button', {type:'button', class:'btn primary grow', onclick:() => sceneCheck(ln.ga)}, 'Check')])));
  } else if (v.finished){
    frag.append(h('section', {class:'card', style:'align-items:center;text-align:center'},
      h('p', {class:'phrase', style:'font-size:22px'}, v.mode === 'join' ? 'Maith thú! You were in the scene.' : 'Críoch · The end'),
      h('div', {class:'row', style:'justify-content:center'},
        h('button', {type:'button', class:'btn', onclick:() => openScene(S, 'watch')}, '🔁 Watch again'),
        !v.kid ? h('button', {type:'button', class:'btn primary', onclick:() => openScene(S, 'join')}, '🎭 Join in') : null)));
  } else {
    frag.append(h('p', {class:'en', style:'text-align:center'}, v.kid ? 'Tap a friend to hear them again.' : 'Watch and listen. Tap a person to hear their last line, or tap things in the picture to hear their names.'));
  }
  return frag;
}
function sceneCheck(expected, text, alts){
  const v = view, said = text || answerText();
  if (!said) return;
  v.check = [said].concat(text && alts ? alts : []).map(a => grade(expected, a, !!text, soundFor(expected))).reduce((b, g) => g.score > b.score ? g : b);
  v.check.conf = text ? lastConfidence : 0;
  noteWeak(v.check);
  v.coach = window.coachFor && settings.coach !== false ? coachFor(expected, v.check, v) : null;
  render();
  if (v.coach && settings.talkBack !== false) sayEnglish(v.coach.text);
}
// Your line is said (by you); the scene carries on.
async function sceneContinue(ln){
  const v = view;
  v.waiting = false; v.check = null; v.coach = null;
  render();
  showLine(v, v.i, ln);
  await new Promise(r => setTimeout(r, 900));
  if (view === v) runScene();
}

/* ---------- The list, and new scenes from Claude ---------- */
function scenesView(){
  const frag = document.createDocumentFragment(), v = view;
  frag.append(h('div', {class:'lhead'},
    h('button', {type:'button', class:'iconbtn', 'aria-label':'Close', onclick:goHome}, icon(I.x)),
    h('h2', {style:'font-size:22px;font-weight:800'}, '🎬 Radharcanna · Scenes')));
  frag.append(h('p', {class:'en'}, 'Watch everyday chats, then join in and speak one of the parts.'));
  const list = h('div', {class:'scene-list'});
  for (const S of SCENES){
    const open = sceneUnlocked(S);
    list.append(h('button', {type:'button', class:'scene-tile', disabled: open ? null : true, onclick:() => openScene(S, 'watch')},
      h('span', {class:'scene-thumb', 'aria-hidden':'true'}, castEl(sceneCast(S, 'a', sceneDialect()), 'happy'), castEl(sceneCast(S, S.lines.some(l => l.who === 'v') ? 'v' : 'b', sceneDialect()), 'talking')),
      h('strong', {lang:'ga'}, S.ga), h('small', null, open ? S.en : '🔒 Opens in Unit ' + S.unit)));
  }
  for (const S of savedScenes()) list.append(h('button', {type:'button', class:'scene-tile', onclick:() => openScene(S, 'watch')},
    h('span', {class:'scene-thumb', 'aria-hidden':'true'}, castEl(sceneCast(S, 'a', sceneDialect()), 'happy'), castEl(sceneCast(S, 'b', sceneDialect()), 'talking')),
    h('strong', {lang:'ga'}, S.ga), h('small', null, '✨ ' + S.en)));
  frag.append(list);
  if (settings.key){
    frag.append(h('section', {class:'card'},
      h('span', {class:'eyebrow', style:'color:var(--muted)'}, 'Radharc nua · A new scene'),
      h('p', {class:'en'}, tutor().name + ' writes a fresh scene using what you’ve learned. ' + (hasAzure() ? 'Voiced by Azure.' : 'Add your Azure key in Settings to hear it.')),
      v.genError ? h('p', {class:'err'}, v.genError) : null,
      h('button', {type:'button', class:'btn primary', disabled: v.generating ? true : null, onclick:newScene}, v.generating ? 'Writing…' : '✨ Make me a scene')));
  }
  return frag;
}
async function newScene(){
  const v = view; v.generating = true; v.genError = ''; render();
  const T = tutor(), L = {checkpoint:true, unit:(course().slice().reverse().find(U => U.lessons.some(l => progress.done[l.id])) || course()[0])};
  const prompt = 'Write a short, natural everyday scene in ' + T.dialect + ' (standard spelling) for an adult beginner to watch and then join in.\n' +
    'Two local characters: "a" (a woman) and "b" (a man). The learner will later speak b’s lines.\n' +
    'Pick ONE backdrop from: ' + Object.keys(BACKDROPS).join(', ') + '.\n' +
    'Use mostly these phrases the learner knows, with tiny changes at most: ' + allowedPhrases(L).slice(0, 160).join(' | ') + '\n' +
    'Write 6 to 8 short lines that alternate a and b. Each line gets an English translation and a face, one of: happy, laughing, surprised, confused, thinking, shrug, wave, listening, talking.\n' +
    'Reply with ONLY JSON: {"ga":"Irish title","en":"English title","backdrop":"…","lines":[{"who":"a","ga":"…","en":"…","expr":"…"}]}';
  try {
    const r = await askClaude('You write warm, simple, realistic dialogues for Irish learners.', [{role:'user', content:prompt}]);
    if (!r || !Array.isArray(r.lines) || r.lines.length < 3) throw {kind:'json'};
    const S = {id:'gen-' + Date.now().toString(36), gen:true, you:'b', unit:1,
      backdrop: BACKDROPS[r.backdrop] ? r.backdrop : 'cafe', ga:String(r.ga || 'Radharc nua'), en:String(r.en || 'A new scene'),
      lines: r.lines.slice(0, 10).map(l => ({who: l.who === 'a' ? 'a' : 'b', ga:String(l.ga || ''), en:String(l.en || ''), expr: EXPRESSIONS.includes(l.expr) ? l.expr : 'talking'})).filter(l => l.ga)};
    progress.scenes = [S].concat(savedScenes()).slice(0, 20); saveProgress();
    v.generating = false;
    if (view === v) openScene(S, 'watch');
  } catch(e){ v.generating = false; v.genError = claudeErrorText(e); if (view === v) render(); }
}

VIEWS.scenes = () => scenesView();
VIEWS.scene = () => sceneView();
