/* The teacher: a fluent tutor's response to each spoken attempt. Loaded after app.js and advisor.js.
   Claude can't hear audio, so the teacher works from what the recogniser wrote down, treats it as a clue,
   and is honest when it's too garbled to judge. You mark yourself; nothing is scored automatically. */
'use strict';

async function teacherFeedback(v, chk){
  const T = tutor(), who = learner(), cur = currentItem();
  const en = cur && cur.ga === chk.expected ? cur.en : '';
  const key = chk.expected + '|' + chk.said + '|' + (me().dialect || 'u');
  const cache = store.get('labhair-teacher', {});
  if (cache[key]){
    chk.teacher = {...cache[key], cached:true};
    render();
    if (settings.talkBack !== false) speakTeacher(chk.teacher);
    return;
  }
  chk.teacher = {loading:true};
  render();
  const system = 'You are ' + T.name + ', a native speaker of ' + T.dialect + ' from ' + T.place + ' in ' + T.county + ', and a warm, expert pronunciation teacher. ' +
    'You are coaching ' + who.en + ', an adult beginner, one phrase at a time. You talk like a kind, encouraging person sitting beside them, never like a machine.';
  const prompt = 'Target phrase: "' + chk.expected + '"' + (en ? ' (' + en + ')' : '') + (soundFor(chk.expected) ? '. Pronunciation guide: ' + soundFor(chk.expected) : '') + '.\n' +
    'What the speech recogniser wrote down: "' + chk.said + '"' + (chk.alts.length > 1 ? ' (its other guesses: ' + chk.alts.slice(1, 4).map(a => '"' + a + '"').join(', ') + ')' : '') + '. ' +
    'Recogniser: ' + (chk.engine === 'azure' ? 'Azure’s Irish (ga-IE) model' : 'the phone’s built-in one, which is poor at Irish and often writes English words') + (chk.conf ? ', confidence ' + chk.conf.toFixed(2) : '') + '.\n' +
    (chk.tries.length > 1 ? 'Their earlier tries at this phrase were written down as: ' + chk.tries.slice(-4, -1).map(t => '"' + t + '"').join(', ') + '.\n' : '') +
    'How to respond:\n' +
    '- What the recogniser wrote is only a clue to what they said. You did not hear the audio, so never claim you did.\n' +
    '- If it matches or nearly matches, praise something specific about the phrase.\n' +
    '- If words are missing or different, work out which sound an English speaker most likely got wrong to produce that (broad vs slender consonants, lenited sounds like ch, bh and dh, eclipsis, long vowels marked by the fada, stress on the first syllable) and coach that one thing, using English sound-alikes.\n' +
    '- If it is unrelated (English words or nonsense), say kindly that the recogniser could not make it out, then coach the one or two trickiest sounds in this phrase anyway.\n' +
    '- If an earlier try came out worse, notice the improvement.\n' +
    '- Never mention scores, percentages, transcripts or recognisers by name.\n' +
    'Reply with ONLY JSON: {"say": "2 to 4 short sentences of natural spoken English, first person, Irish words in quotes, no markdown; this is read aloud", "tip": "one concrete mouth, tongue or sound tip, at most 20 words", "verdict": "got-it" or "nearly" or "again"}';
  try {
    const r = await askClaude(system, [{role:'user', content:prompt}]);
    const t = {say:String(r.say || '').trim(), tip:String(r.tip || '').trim(), verdict:['got-it', 'nearly', 'again'].includes(r.verdict) ? r.verdict : 'nearly'};
    if (!t.say) throw {kind:'json'};
    chk.teacher = t;
    cache[key] = t;
    const keys = Object.keys(cache); if (keys.length > 300) delete cache[keys[0]];
    store.set('labhair-teacher', cache);
    if (window.micLog) micLog('teacher', {verdict:t.verdict});
  } catch(e){ chk.teacher = {error:claudeErrorText(e)}; }
  if (view === v && v.check === chk){ render(); if (chk.teacher.say && settings.talkBack !== false) speakTeacher(chk.teacher); }
}

// The teacher speaks, with her portrait talking along.
async function speakTeacher(t){
  const p = document.querySelector('.teacher .cast');
  if (p) p.talk(true);
  await sayEnglish(t.say + (t.tip ? ' ' + t.tip : ''));
  if (p) p.talk(false);
}

// After a spoken attempt: what was heard (as a clue), compare buttons, the teacher, and mark-yourself buttons.
function spokenBlock(v, chk){
  const T = tutor(), cur = currentItem();
  const native = cur && cur.ga === chk.expected && cur.L ? audioFor(cur.L, cur.n, cur.ga) : null;
  const t = chk.teacher || {};
  const quiet = () => { settings = {...settings, talkBack:false}; saveSettings(); player.pause(); try { speechSynthesis.cancel(); } catch(e){} render(); };
  const teacher = !settings.key ? h('p', {class:'note'}, 'Add your Claude key in Settings and ' + T.name + ' will coach you on each try, like a teacher sitting beside you.')
    : settings.coach === false ? null
    : h('div', {class:'teacher'},
        castEl(T.cast, t.loading ? 'listening' : t.verdict === 'got-it' ? 'happy' : t.verdict === 'again' ? 'thinking' : 'talking'),
        h('div', {class:'teacher-body'},
          h('strong', null, T.name),
          t.loading ? h('p', {class:'typing'}, T.name + ' is thinking about how that sounded…')
            : t.error ? h('p', {class:'err'}, t.error)
            : [h('p', null, t.say), t.tip ? h('p', {class:'teacher-tip'}, '👄 ' + t.tip) : null,
               h('div', {class:'row'},
                 h('button', {type:'button', class:'btn', style:'min-height:38px', onclick:() => speakTeacher(t)}, icon(I.speaker, 16), 'Again'),
                 settings.talkBack !== false ? h('button', {type:'button', class:'btn', style:'min-height:38px', 'aria-label':'Stop her talking aloud (turn back on in Settings)', onclick:quiet}, '🔇 Quiet') : null)]));
  const suggested = {'got-it':1, nearly:0.6, again:0}[t.verdict];
  const mark = (label, score, cls) => h('button', {type:'button', class:'btn' + (cls ? ' ' + cls : '') + (suggested === score ? ' suggested' : ''), onclick:() => selfMark(v, chk, score)}, label);
  return h('div', {class:'spoken'},
    h('p', {class:'heard'}, chk.engine === 'azure' ? 'Azure heard: ' : 'Your phone heard: ', h('b', {lang:'ga'}, '“' + chk.said + '”'), h('small', null, ' · just a clue, it often mishears')),
    chk.take ? h('div', {class:'row'},
      h('button', {type:'button', class:'btn', onclick:() => playAudio(chk.take)}, icon(I.speaker, 16), 'Mise · Me'),
      native ? h('button', {type:'button', class:'btn', onclick:() => playSeq([native, chk.take])}, nativeName() + ', then me') : null) : null,
    teacher,
    h('p', {class:'legend'}, 'How did that feel? You decide.'),
    h('div', {class:'row self-mark'}, mark('↻ Again', 0), mark('〜 Nearly', 0.6), mark('✓ Got it', 1, 'primary grow')));
}

// You mark yourself. Got it and Nearly count towards review and move on; Again clears for another go.
function selfMark(v, chk, score){
  if (score === 0){ v.check = null; v.coach = null; render(); return; }
  v.noted = v.noted || {};
  if (!(chk.expected in v.noted)){ v.noted[chk.expected] = score; if (v.name !== 'scene') noteItem(chk.expected, score); }
  if (score >= 0.85){ progress.said = (progress.said || 0) + 1; saveProgress(); }
  if (window.micLog) micLog('self-marked', {expected:chk.expected, score});
  player.pause(); try { speechSynthesis.cancel(); } catch(e){}
  const next = v.onNext;
  v.check = null;
  if (next) next(score); else render();
}
