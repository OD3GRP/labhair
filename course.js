// Builds the course for a dialect: Ulster (content.js) with that dialect's overrides applied.
// Overrides live in content-c.js (Connacht) and content-m.js (Munster) as window.DIALECTS[d]:
//   { tutor:{name, place, county, voice}, swap:{'Gráinne':'Nóra', …}, lessons:{ '<lessonId>': {ga, goal, phrases:{n:[…]}, drills:{n:[…]}, chat:{…}} } }
// Phrase and drill numbers are 1-based, matching the audio file numbers. Lesson ids never change.
// Used by app.js and by tools/make-audio.mjs.
(function(){
  const cache = {};
  const swapText = (s, swap) => {
    if (typeof s !== 'string' || !swap) return s;
    for (const [a, b] of Object.entries(swap)) s = s.split(a).join(b);
    return s;
  };
  window.TUTORS = {
    u: {name:'Gráinne', cast:'grainne', place:'Gaoth Dobhair', county:'Co. Donegal', dialect:'Ulster Irish', examples:'"Cad é mar atá tú?", "Tá mé", "An dtig leat", "fosta", "Slán go fóill"',
      free:['Haigh! Cad é mar atá tú inniu? Cad é atá ag tarlú?', 'Hi! How are you today? What’s happening?']}
  };
  window.courseFor = function(d){
    if (!d || d === 'u' || !(window.DIALECTS && window.DIALECTS[d])) return window.UNITS;
    if (cache[d]) return cache[d];
    const D = window.DIALECTS[d], sw = D.swap || {};
    const units = window.UNITS.map(U => ({...U, lessons: U.lessons.map(L => {
      const o = (D.lessons || {})[L.id] || {};
      const out = {...L, ga: o.ga || L.ga, en: o.en || swapText(L.en, sw), goal: o.goal || swapText(L.goal, sw)};
      if (L.phrases) out.phrases = L.phrases.map((p, i) => (o.phrases && o.phrases[i + 1]) || p);
      if (L.drills) out.drills = L.drills.map((x, i) => (o.drills && o.drills[i + 1]) || x);
      const c = L.chat;
      out.chat = {...c, scene: swapText(c.scene, sw), goals: c.goals.map(g => [g[0], swapText(g[1], sw)]), ...(o.chat || {})};
      return out;
    })}));
    return (cache[d] = units);
  };
  window.tutorFor = d => (window.DIALECTS && window.DIALECTS[d] && window.DIALECTS[d].tutor) || window.TUTORS.u;
})();
