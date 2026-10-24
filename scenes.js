// Radharcanna: illustrated everyday scenes. Watch the cast talk, then take a part yourself.
// Pure data and drawing (no DOM), so tools/make-audio.mjs can read it too. The player is in scenes-ui.js.
//   Roles: a (a woman), b (a man), v (a visitor from another dialect). Each dialect has its own locals.
//   A line's Irish is a string (the same everywhere) or {u, c, m}. Visitor lines use the visitor's dialect.
//   Audio: audio/sc-<dialect>/<sceneId>/<n>.mp3, and audio/sc-<dialect>/props/<backdrop>-<i>.mp3 for tappable things.
(function(){
  const W = window;
  W.SCENE_CAST = {
    u: {a:'ella', b:'donall', v:'danny'},     // Ulster learners meet a visitor from Kerry
    c: {a:'brid', b:'padraig', v:'seoirse'},  // Connacht learners meet one from Donegal
    m: {a:'fianait', b:'colm', v:'brid'}      // Munster learners meet one from Mayo
  };
  W.VISITOR_DIALECT = {u:'m', c:'u', m:'c'};
  W.CAST_VOICES = {ella:'ella.piper', donall:'doc.piper', seoirse:'seoirse.piper', grainne:'anb.piper', brid:'brid.piper', padraig:'pmc.piper', nora:'snc.piper',
    fianait:'fnm.piper', colm:'cmg.piper', danny:'dms.piper', maire:'nnc.piper'};

  const SKY = '#BFDDF0', INK = '#15202B';
  // Backdrops: 400×300 SVG, with things you can tap: [x, y, w, h, Irish, English].
  W.BACKDROPS = {
    shop: {name:'An siopa', svg:`<rect width="400" height="300" fill="#F3E3C3"/><rect y="230" width="400" height="70" fill="#C9A77A"/>
      <rect x="20" y="40" width="160" height="120" fill="#E8D2A6" stroke="${INK}" stroke-width="3"/><g stroke="${INK}" stroke-width="3"><path d="M20 80 H180 M20 120 H180"/></g>
      <rect x="34" y="56" width="22" height="22" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.5"/><rect x="64" y="52" width="26" height="26" rx="6" fill="#E2AE2F" stroke="${INK}" stroke-width="2.5"/><rect x="100" y="94" width="34" height="24" rx="10" fill="#C98A4B" stroke="${INK}" stroke-width="2.5"/>
      <rect x="250" y="60" width="90" height="170" fill="#2E6A4F" stroke="${INK}" stroke-width="3"/><circle cx="328" cy="150" r="5" fill="#E2AE2F"/>
      <rect x="0" y="200" width="400" height="34" fill="#8C5A35" stroke="${INK}" stroke-width="3"/>`,
      props:[[30, 50, 30, 30, 'bainne', 'milk'], [96, 90, 42, 32, 'arán', 'bread'], [250, 60, 90, 140, 'doras', 'door']]},
    'bus-stop': {name:'Stad an bhus', svg:`<rect width="400" height="300" fill="${SKY}"/><path d="M0 200 Q100 170 200 190 T400 180 V300 H0Z" fill="#7FB069"/><rect y="250" width="400" height="50" fill="#5B5F63"/>
      <g fill="#fff" opacity=".9"><ellipse cx="80" cy="50" rx="40" ry="16"/><ellipse cx="300" cy="40" rx="50" ry="18"/></g>
      <path d="M40 110 H200 V250 H190 V120 H50 V250 H40Z" fill="#9AA5AE" stroke="${INK}" stroke-width="3"/><rect x="60" y="120" width="120" height="70" fill="#D7EEF8" opacity=".6" stroke="${INK}" stroke-width="2"/>
      <path d="M300 250 V100" stroke="${INK}" stroke-width="5"/><circle cx="300" cy="90" r="20" fill="#E2AE2F" stroke="${INK}" stroke-width="3"/><text x="300" y="96" font-size="16" font-weight="800" text-anchor="middle" fill="${INK}">BUS</text>
      <g stroke="#6F8FAF" stroke-width="2" opacity=".7"><path d="M230 20 l-6 14 M260 30 l-6 14 M350 70 l-6 14 M380 20 l-6 14"/></g>`,
      props:[[280, 70, 40, 40, 'bus', 'bus'], [60, 50, 50, 20, 'scamall', 'cloud']]},
    gaa: {name:'An pháirc', svg:`<rect width="400" height="300" fill="${SKY}"/><rect y="150" width="400" height="150" fill="#5FA052"/><g stroke="#fff" stroke-width="3" opacity=".7"><path d="M0 230 H400"/></g>
      <g stroke="#fff" stroke-width="6"><path d="M290 160 V40 M350 160 V40 M290 120 H350"/></g><rect x="20" y="90" width="120" height="60" fill="#1E7A3C" stroke="${INK}" stroke-width="3"/><path d="M14 92 L80 60 L146 92Z" fill="#E2AE2F" stroke="${INK}" stroke-width="3"/>
      <circle cx="230" cy="250" r="10" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`,
      props:[[285, 40, 70, 120, 'cúl', 'goal'], [218, 238, 26, 26, 'liathróid', 'ball']]},
    cafe: {name:'An caife', svg:`<rect width="400" height="300" fill="#EADBC8"/><rect y="230" width="400" height="70" fill="#9C6B43"/>
      <rect x="30" y="30" width="140" height="90" fill="#D7EEF8" stroke="${INK}" stroke-width="3"/><path d="M100 30 V120 M30 75 H170" stroke="${INK}" stroke-width="3"/>
      <rect x="220" y="40" width="150" height="70" rx="6" fill="#1C2B35" stroke="${INK}" stroke-width="3"/><text x="295" y="70" font-size="14" fill="#E2AE2F" text-anchor="middle" font-weight="800">CAIFE · TAE</text><text x="295" y="92" font-size="12" fill="#fff" text-anchor="middle">CEAPAIRÍ</text>
      <rect x="0" y="196" width="400" height="36" fill="#6E4A2E" stroke="${INK}" stroke-width="3"/><path d="M150 186 h22 v12 a11 11 0 0 1 -22 0z" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M220 192 l30 -10 l30 10 z" fill="#F0D59A" stroke="${INK}" stroke-width="2.5"/>`,
      props:[[146, 180, 32, 26, 'cupán', 'cup'], [218, 176, 66, 22, 'ceapaire', 'sandwich'], [30, 30, 140, 90, 'fuinneog', 'window']]},
    kitchen: {name:'An chistin', svg:`<rect width="400" height="300" fill="#F4E9D8"/><rect y="230" width="400" height="70" fill="#B9855A"/>
      <rect x="250" y="60" width="120" height="80" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="262" y="72" width="96" height="56" fill="#9BC6E0"/><path d="M262 120 l30 -26 l22 18 l18 -12 l26 20 v8 h-96z" fill="#5FA052"/>
      <rect x="30" y="50" width="70" height="56" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="52" cy="72" r="9" fill="#F1C6A6" stroke="${INK}" stroke-width="2"/><circle cx="78" cy="74" r="8" fill="#E9B996" stroke="${INK}" stroke-width="2"/>
      <rect x="120" y="190" width="160" height="14" fill="#8C5A35" stroke="${INK}" stroke-width="3"/><path d="M190 172 q0 -14 14 -14 q14 0 14 14 v16 h-28z" fill="#2E6A4F" stroke="${INK}" stroke-width="2.5"/>`,
      props:[[30, 50, 70, 56, 'grianghraf', 'photo'], [186, 156, 34, 34, 'taephota', 'teapot'], [250, 60, 120, 80, 'fuinneog', 'window']]},
    beach: {name:'An trá', svg:`<rect width="400" height="300" fill="${SKY}"/><circle cx="330" cy="60" r="30" fill="#F6D04D" stroke="${INK}" stroke-width="3"/>
      <rect y="150" width="400" height="70" fill="#3E86B8"/><g stroke="#fff" stroke-width="3" fill="none" opacity=".7"><path d="M20 170 q20 -8 40 0 t40 0 M200 190 q20 -8 40 0 t40 0"/></g>
      <path d="M0 210 Q200 190 400 210 V300 H0Z" fill="#EBD39A"/><path d="M80 160 h50 l-10 14 h-30z" fill="#C0392B" stroke="${INK}" stroke-width="2.5"/><path d="M105 160 V128 l18 22z" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
      <path d="M300 262 q10 -16 22 0 q-11 8 -22 0z" fill="#F2B8A0" stroke="${INK}" stroke-width="2"/>`,
      props:[[300, 30, 60, 60, 'grian', 'sun'], [0, 150, 400, 40, 'farraige', 'sea'], [78, 126, 56, 50, 'bád', 'boat'], [296, 246, 30, 22, 'sliogán', 'shell']]}
  };

  // Pre-made scenes. unit: when it unlocks. you: the role you take in "Join in".
  W.SCENES = [
    {id:'sc-siopa', unit:1, backdrop:'shop', ga:'Sa siopa', en:'In the shop', you:'b', lines:[
      {who:'b', ga:'Dia duit!', en:'Hello!', expr:'wave'},
      {who:'a', ga:{u:'Dia is Muire duit. Cad é mar atá tú?', c:'Dia is Muire duit. Cén chaoi a bhfuil tú?', m:'Dia is Muire duit. Conas atá tú?'}, en:'Hello. How are you?', expr:'happy'},
      {who:'b', ga:{u:'Tá mé go maith, go raibh maith agat. Agus tú féin?', c:'Tá mé go maith, go raibh maith agat. Agus tú féin?', m:'Táim go maith, go raibh maith agat. Agus tú féin?'}, en:'I’m well, thanks. And yourself?', expr:'talking'},
      {who:'a', ga:{u:'Tá mé go breá.', c:'Tá mé go breá.', m:'Táim go breá.'}, en:'I’m grand.', expr:'happy'},
      {who:'b', ga:'Slán go fóill!', en:'Bye for now!', expr:'wave'},
      {who:'a', ga:'Slán!', en:'Bye!', expr:'wave'}]},
    {id:'sc-bus', unit:1, backdrop:'bus-stop', ga:'Ag stad an bhus', en:'At the bus stop', you:'b', lines:[
      {who:'a', ga:'Dia duit! Nach fuar an lá é!', en:'Hello! Isn’t it a cold day!', expr:'surprised'},
      {who:'b', ga:'Tá sé fuar, cinnte.', en:'It’s cold, all right.', expr:'shrug'},
      {who:'a', ga:{u:'Cá as tú?', c:'Cé as thú?', m:'Cad as duit?'}, en:'Where are you from?', expr:'listening'},
      {who:'b', ga:'Is as Aontroim mé. Agus tusa?', en:'I’m from Antrim. And you?', expr:'talking'},
      {who:'a', ga:{u:'Is as Dún na nGall mé.', c:'Is as Gaillimh mé.', m:'Is as Ciarraí mé.'}, en:{u:'I’m from Donegal.', c:'I’m from Galway.', m:'I’m from Kerry.'}, expr:'happy'},
      {who:'b', ga:'Seo an bus! Slán go fóill!', en:'Here’s the bus! Bye for now!', expr:'wave'}]},
    {id:'sc-cistin', unit:2, backdrop:'kitchen', ga:'Sa chistin', en:'In the kitchen', you:'b', lines:[
      {who:'a', ga:'Cé seo sa ghrianghraf?', en:'Who’s this in the photo?', expr:'thinking'},
      {who:'b', ga:'Seo mo dheartháir, Seán.', en:'This is my brother, Seán.', expr:'talking'},
      {who:'a', ga:{u:'Cá haois atá sé?', c:'Cén aois atá sé?', m:'Cén aois é?'}, en:'How old is he?', expr:'listening'},
      {who:'b', ga:'Tá sé deich mbliana d’aois.', en:'He’s ten.', expr:'talking'},
      {who:'a', ga:'Tá sé ard!', en:'He’s tall!', expr:'surprised'},
      {who:'b', ga:'Tá, agus tá sé greannmhar.', en:'He is, and he’s funny.', expr:'laughing'}]},
    {id:'sc-tra', unit:3, backdrop:'beach', ga:'Ar an trá', en:'On the beach', you:'a', lines:[
      {who:'v', ga:{u:'Dia duit! Cad é mar atá tú?', c:'Dia duit! Cén chaoi a bhfuil tú?', m:'Dia duit! Conas atá tú?'}, en:'Hello! How are you?', expr:'wave'},
      {who:'a', ga:{u:'Tá mé go maith. Cá as tú?', c:'Tá mé go maith. Cé as thú?', m:'Táim go maith. Cad as duit?'}, en:'I’m well. Where are you from?', expr:'happy'},
      {who:'v', ga:{u:'Is as Dún na nGall mé.', c:'Is as Gaillimh mé.', m:'Is as Ciarraí mé.'}, en:{u:'I’m from Donegal.', c:'I’m from Galway.', m:'I’m from Kerry.'}, expr:'talking'},
      {who:'a', ga:'Nach breá an lá é!', en:'Isn’t it a fine day!', expr:'happy'},
      {who:'v', ga:{u:'Tá. Ach beidh sé ag cur fearthainne amárach!', c:'Tá. Ach beidh sé ag báisteach amárach!', m:'Tá. Ach beidh sé ag cur báistí amárach!'}, en:'It is. But it’ll be raining tomorrow!', expr:'shrug'},
      {who:'a', ga:'Tóg go bog é! Slán!', en:'Take it easy! Bye!', expr:'wave'}]},
    {id:'sc-caife', unit:5, backdrop:'cafe', ga:'Sa chaife', en:'In the café', you:'b', lines:[
      {who:'a', ga:{u:'Dia duit! Cad é ba mhaith leat?', c:'Dia duit! Céard ba mhaith leat?', m:'Dia duit! Cad ba mhaith leat?'}, en:'Hello! What would you like?', expr:'happy'},
      {who:'b', ga:'Ba mhaith liom cupán tae, le do thoil.', en:'I’d like a cup of tea, please.', expr:'talking'},
      {who:'a', ga:'Bainne agus siúcra?', en:'Milk and sugar?', expr:'listening'},
      {who:'b', ga:{u:'Bainne, ach gan siúcra. Cá mhéad atá air?', c:'Bainne, ach gan siúcra. Cé mhéad atá air?', m:'Bainne, ach gan siúcra. Cé mhéad atá air?'}, en:'Milk, but no sugar. How much is it?', expr:'thinking'},
      {who:'a', ga:{u:'Sin trí phunt, le do thoil.', c:'Sin trí euro, le do thoil.', m:'Sin trí euro, le do thoil.'}, en:{u:'That’s three pounds, please.', c:'That’s three euro, please.', m:'That’s three euro, please.'}, expr:'talking'},
      {who:'b', ga:'Coinnigh an tsóinseáil!', en:'Keep the change!', expr:'happy'},
      {who:'a', ga:'Go raibh maith agat!', en:'Thank you!', expr:'laughing'}]},
    {id:'sc-pairc', unit:6, backdrop:'gaa', ga:'Ag an bpáirc', en:'At the pitch', you:'b', lines:[
      {who:'a', ga:'An imríonn tú peil?', en:'Do you play football?', expr:'listening'},
      {who:'b', ga:'Imrím! Is breá liom peil.', en:'I do! I love football.', expr:'happy'},
      {who:'a', ga:'Cé leis a bhfuil tú?', en:'Who do you support?', expr:'thinking'},
      {who:'b', ga:{u:'Tá mé le hAontroim!', c:'Tá mé le hAontroim!', m:'Táim le hAontroim!'}, en:'I’m for Antrim!', expr:'laughing'},
      {who:'a', ga:'Cluiche iontach a bhí ann inné.', en:'It was a great match yesterday.', expr:'happy'},
      {who:'b', ga:'Ar fheabhas! Slán go fóill!', en:'Excellent! Bye for now!', expr:'wave'}]}
  ];
  // Kids' scenes: the animal friends, watch-only. a and b are hosts from kids.js.
  W.KID_SCENES = [
    {id:'ksc-picnic', backdrop:'beach', ga:'Picnic ar an trá', en:'A picnic on the beach', cast:{a:'puifin', b:'broc'}, lines:[
      {who:'b', ga:'Dia duit, a Phuifín!', en:'Hello, Puifín!', expr:'wave'},
      {who:'a', ga:'Dia duit, a Bhroic! An bhfuil ocras ort?', en:'Hello, Broc! Are you hungry?', expr:'happy'},
      {who:'b', ga:'Tá ocras orm!', en:'I’m hungry!', expr:'surprised'},
      {who:'a', ga:'Seo úll duit.', en:'Here’s an apple for you.', expr:'talking'},
      {who:'b', ga:'Go raibh maith agat! Tá sé blasta!', en:'Thank you! It’s tasty!', expr:'laughing'}]},
    {id:'ksc-ras', backdrop:'gaa', ga:'An rás mór', en:'The big race', cast:{a:'giorria', b:'madra-rua'}, lines:[
      {who:'b', ga:'A Ghiorria! Rás?', en:'Giorria! A race?', expr:'happy'},
      {who:'a', ga:'Ceart go leor! A haon, a dó, a trí!', en:'OK! One, two, three!', expr:'talking'},
      {who:'b', ga:'Rith!', en:'Run!', expr:'laughing'},
      {who:'a', ga:'Bhuaigh mé!', en:'I won!', expr:'laughing'},
      {who:'b', ga:'Maith thú, a Ghiorria!', en:'Well done, Giorria!', expr:'happy'}]}
  ];

  // The text of a line for a learner of dialect d (visitors speak their own).
  W.sceneLine = (line, d) => {
    const dd = line.who === 'v' ? W.VISITOR_DIALECT[d] : d;
    const pick = x => (x && typeof x === 'object') ? (x[dd] || x.u) : x;
    return {ga:pick(line.ga), en:pick(line.en), d:dd};
  };
  W.sceneCast = (scene, who, d) => scene.cast ? scene.cast[who] : W.SCENE_CAST[d][who];
  W.sceneVoice = (scene, who, d) => {
    const id = W.sceneCast(scene, who, d);
    if (scene.cast && W.KIDS) return W.KIDS.characters[id].voice[d];
    return W.CAST_VOICES[id];
  };
  // Everything to record for one dialect: [{rel, text, voice, unit}] (used by tools/make-audio.mjs).
  W.sceneAudioJobs = function(d){
    const jobs = [], localA = W.CAST_VOICES[W.SCENE_CAST[d].a];
    for (const S of W.SCENES.concat(W.KID_SCENES))
      S.lines.forEach((ln, i) => jobs.push({rel:S.id + '/' + (i + 1) + '.mp3', text:W.sceneLine(ln, d).ga, voice:W.sceneVoice(S, ln.who, d), unit:S.id}));
    for (const [bid, B] of Object.entries(W.BACKDROPS))
      B.props.forEach((p, i) => jobs.push({rel:'props/' + bid + '-' + (i + 1) + '.mp3', text:p[4], voice:localA, unit:'props'}));
    return jobs;
  };
})();
