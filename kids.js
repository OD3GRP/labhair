// Kid mode content. Four animal friends each host topics; every topic has picture words (for under-6s and 6–9s)
// and short sentences (for 10–12s). Words are the same in all three dialects unless a topic gives a per-dialect form.
// Audio: audio/k-<dialect>/<topicId>/<n>.mp3 — words 1..W, then sentences W+1.., then the host's lines (hi, well done).
window.KIDS = {
  characters: {
    puifin:      {name:'Puifín', en:'the puffin', voice:{u:'ella.piper', c:'brid.piper', m:'fnm.piper'}},
    giorria:     {name:'Giorria', en:'the hare', voice:{u:'anb.piper', c:'snc.piper', m:'nnc.piper'}},
    'madra-rua': {name:'Madra Rua', en:'the fox', voice:{u:'seoirse.piper', c:'pmc.piper', m:'dms.piper'}},
    broc:        {name:'Broc', en:'the badger', voice:{u:'doc.piper', c:'pmc.piper', m:'cmg.piper'}}
  },
  // What each host says (same in every dialect).
  lines: {
    hi: 'Dia duit! Éist agus abair!',             // Hello! Listen and say!
    tap: 'Cá bhfuil sé?',                          // Where is it?
    yes: 'Maith thú!',                             // Well done!
    again: 'Arís!',                                // Again!
    bye: 'Ar fheabhas! Slán go fóill!'             // Excellent! Bye for now!
  },
  lineEn: {hi:'Hello! Listen and say!', tap:'Where is it?', yes:'Well done!', again:'Again!', bye:'Excellent! Bye for now!'},
  // words: [emoji, Irish, English]   sentences (10–12): [Irish, English] or {u:[…], c:[…], m:[…]} where dialects differ
  topics: [
    {id:'k-dathanna', host:'puifin', ga:'Dathanna', en:'Colours',
      words:[['🔴','dearg','red'], ['🔵','gorm','blue'], ['🟡','buí','yellow'], ['🟢','glas','green'], ['⚫','dubh','black'], ['⚪','bán','white']],
      sentences:[['Is maith liom dearg.','I like red.'], ['Tá an fharraige gorm.','The sea is blue.'], ['Tá an ghrian buí.','The sun is yellow.'], ['Cén dath é seo?','What colour is this?']]},
    {id:'k-farraige', host:'puifin', ga:'An Fharraige', en:'The sea',
      words:[['🐟','iasc','fish'], ['⛵','bád','boat'], ['🦀','portán','crab'], ['🐋','míol mór','whale'], ['🐚','sliogán','shell'], ['🏖️','trá','beach']],
      sentences:[['Feicim bád.','I see a boat.'], ['Tá an portán beag.','The crab is small.'], ['Tá an míol mór mór!','The whale is big!'], ['Téimid chun na trá.','We go to the beach.']]},
    {id:'k-aimsir', host:'puifin', ga:'An Aimsir', en:'Weather',
      words:[['☀️','grian','sun'], ['🌧️',{u:'fearthainn', c:'báisteach', m:'báisteach'},'rain'], ['❄️','sneachta','snow'], ['💨','gaoth','wind'], ['☁️','scamall','cloud'], ['🌈','tuar ceatha','rainbow']],
      sentences:[[{u:'Tá sé ag cur fearthainne.', c:'Tá sé ag báisteach.', m:'Tá sé ag cur báistí.'},'It’s raining.'], ['Tá an ghrian ag taitneamh.','The sun is shining.'], ['Tá sé fuar.','It’s cold.'], ['Feicim tuar ceatha!','I see a rainbow!']]},
    {id:'k-corp', host:'giorria', ga:'Mo Chorp', en:'My body',
      words:[['👃','srón','nose'], ['👂','cluas','ear'], ['👁️','súil','eye'], ['👄','béal','mouth'], ['✋','lámh','hand'], ['🦶','cos','foot']],
      sentences:[['Seo mo shrón.','This is my nose.'], ['Tá dhá chluas agam.','I have two ears.'], ['Ardaigh do lámh!','Put up your hand!'], ['Bain do bhróga díot.','Take off your shoes.']]},
    {id:'k-gniomhartha', host:'giorria', ga:'Bog!', en:'Move!',
      words:[['🦘','Léim!','Jump!'], ['🏃','Rith!','Run!'], ['🪑','Suigh síos!','Sit down!'], ['🧍','Seas suas!','Stand up!'], ['💃','Damhsaigh!','Dance!'], ['😴','Codail!','Sleep!']],
      sentences:[['Léim go hard!','Jump high!'], ['Rith go tapa!','Run fast!'], ['Suigh síos, le do thoil.','Sit down, please.'], ['Is maith liom damhsa.','I like dancing.']]},
    {id:'k-mothuchain', host:'giorria', ga:'Mar a Mhothaím', en:'Feelings',
      words:[['😀','sona','happy'], ['😢','brónach','sad'], ['😴','tuirseach','tired'], ['😠','crosta','cross'], ['😨','scanraithe','scared'], ['😋','ocras','hungry']],
      sentences:[[{u:'Tá mé sona.', c:'Tá mé sona.', m:'Táim sona.'},'I’m happy.'], ['Tá ocras orm.','I’m hungry.'], [{u:'Tá mé tuirseach.', c:'Tá mé tuirseach.', m:'Táim tuirseach.'},'I’m tired.'], [{u:'Cad é mar atá tú?', c:'Cén chaoi a bhfuil tú?', m:'Conas atá tú?'},'How are you?']]},
    {id:'k-ainmhithe', host:'madra-rua', ga:'Ainmhithe', en:'Animals',
      words:[['🐶','madra','dog'], ['🐱','cat','cat'], ['🐄','bó','cow'], ['🐑','caora','sheep'], ['🐴','capall','horse'], ['🐷','muc','pig']],
      sentences:[['Tá madra agam.','I have a dog.'], ['Feicim bó.','I see a cow.'], ['Is maith liom capaill.','I like horses.'], ['Cá bhfuil an cat?','Where’s the cat?']]},
    {id:'k-uimhreacha', host:'madra-rua', ga:'Uimhreacha', en:'Numbers',
      words:[['1️⃣','a haon','one'], ['2️⃣','a dó','two'], ['3️⃣','a trí','three'], ['4️⃣','a ceathair','four'], ['5️⃣','a cúig','five'], ['6️⃣','a sé','six']],
      sentences:[[{u:'Cá mhéad atá ann?', c:'Cé mhéad atá ann?', m:'Cé mhéad atá ann?'},'How many are there?'], ['Tá trí cinn ann.','There are three.'], [{u:'Tá mé sé bliana d’aois.', c:'Tá mé sé bliana d’aois.', m:'Táim sé bliana d’aois.'},'I’m six.'], ['A haon, a dó, a trí!','One, two, three!']]},
    {id:'k-bia', host:'broc', ga:'Bia', en:'Food',
      words:[['🍎','úll','apple'], ['🍌','banana','banana'], ['🍞','arán','bread'], ['🧀','cáis','cheese'], ['🥛','bainne','milk'], ['💧','uisce','water']],
      sentences:[['Is maith liom úlla.','I like apples.'], ['Ba mhaith liom bainne, le do thoil.','I’d like milk, please.'], ['Tá tart orm.','I’m thirsty.'], ['Tá sé seo blasta!','This is tasty!']]},
    {id:'k-teach', host:'broc', ga:'An Teach', en:'The house',
      words:[['🚪','doras','door'], ['🪟','fuinneog','window'], ['🛏️','leaba','bed'], ['🪑','cathaoir','chair'], ['📖','leabhar','book'], ['☕','cupán','cup']],
      sentences:[[{u:'Druid an doras.', c:'Dún an doras.', m:'Dún an doras.'},'Close the door.'], ['Oscail an fhuinneog.','Open the window.'], ['Seo mo leaba.','This is my bed.'], ['Cá bhfuil mo leabhar?','Where’s my book?']]},
    {id:'k-teaghlach', host:'broc', ga:'Mo Theaghlach', en:'My family',
      words:[['👩','mamaí','mammy'], ['👨','daidí','daddy'], ['👦','deartháir','brother'], ['👧','deirfiúr','sister'], ['👵','mamó','granny'], ['👴','daideo','grandad']],
      sentences:[['Seo mo mhamaí.','This is my mammy.'], ['Tá deartháir agam.','I have a brother.'], ['Is breá liom mo mhamó.','I love my granny.'], ['Cé seo?','Who’s this?']]},
    {id:'k-beannachtai', host:'giorria', ga:'Dia duit!', en:'Hello and goodbye',
      words:[['👋','Dia duit!','Hello!'], ['🙋','Slán!','Bye!'], ['🙏','Go raibh maith agat!','Thank you!'], ['⭐','Maith thú!','Well done!'], ['🌙','Oíche mhaith!','Good night!'], ['😊','Le do thoil.','Please.']],
      sentences:[[{u:'Cad é an t-ainm atá ort?', c:'Cén t-ainm atá ort?', m:'Cad is ainm duit?'},'What’s your name?'], ['Is mise …','I’m …'], [{u:'Cad é mar atá tú?', c:'Cén chaoi a bhfuil tú?', m:'Conas atá tú?'},'How are you?'], [{u:'Tá mé go maith.', c:'Tá mé go maith.', m:'Táim go maith.'},'I’m well.']]}
  ],
  // Scripted chats for 10–12s: the host says a line, you pick a reply (then say it). No AI.
  chats: {
    'k-beannachtai': [
      {say:{u:'Dia duit! Cad é mar atá tú?', c:'Dia duit! Cén chaoi a bhfuil tú?', m:'Dia duit! Conas atá tú?'}, en:'Hello! How are you?',
        replies:[[{u:'Tá mé go maith!', c:'Tá mé go maith!', m:'Táim go maith!'},'I’m well!'], [{u:'Tá mé tuirseach.', c:'Tá mé tuirseach.', m:'Táim tuirseach.'},'I’m tired.']]},
      {say:{u:'Cad é an t-ainm atá ort?', c:'Cén t-ainm atá ort?', m:'Cad is ainm duit?'}, en:'What’s your name?', replies:[['Is mise …','I’m …']]},
      {say:'Maith thú! Slán go fóill!', en:'Well done! Bye for now!', replies:[['Slán!','Bye!']]}
    ],
    'k-bia': [
      {say:'Dia duit! An bhfuil ocras ort?', en:'Hello! Are you hungry?', replies:[['Tá ocras orm!','I’m hungry!'], ['Tá tart orm.','I’m thirsty.']]},
      {say:'Cad é ba mhaith leat?', en:'What would you like?', replies:[['Ba mhaith liom úll, le do thoil.','I’d like an apple, please.'], ['Ba mhaith liom bainne, le do thoil.','I’d like milk, please.']]},
      {say:'Seo duit!', en:'Here you are!', replies:[['Go raibh maith agat!','Thank you!']]}
    ],
    'k-ainmhithe': [
      {say:'An bhfuil peata agat?', en:'Do you have a pet?', replies:[['Tá madra agam.','I have a dog.'], ['Tá cat agam.','I have a cat.'], ['Níl peata agam.','I don’t have a pet.']]},
      {say:'Is maith liom madraí! An maith leatsa capaill?', en:'I like dogs! Do you like horses?', replies:[['Is maith!','Yes!'], ['Ní maith.','No.']]},
      {say:'Ar fheabhas! Slán go fóill!', en:'Excellent! Bye for now!', replies:[['Slán!','Bye!']]}
    ]
  }
};

// Pick the dialect form of a word or line.
window.kidText = (x, d) => (x && typeof x === 'object' && !Array.isArray(x)) ? (x[d] || x.u) : x;

// Everything kid mode needs recorded for one dialect: [{rel, text, voice, unit}] (used by tools/make-audio.mjs).
window.kidAudioJobs = function(d){
  const K = window.KIDS, jobs = [];
  const add = (rel, text, voice, unit) => { if (text && !/…/.test(text)) jobs.push({rel, text, voice, unit}); };
  for (const T of K.topics){
    const voice = K.characters[T.host].voice[d];
    T.words.forEach((w, i) => add(T.id + '/' + (i + 1) + '.mp3', window.kidText(w[1], d), voice, T.id));
    T.sentences.forEach((s, i) => add(T.id + '/' + (T.words.length + i + 1) + '.mp3', window.kidText(s[0], d), voice, T.id));
    for (const [key, line] of Object.entries(K.lines)) add(T.id + '/' + key + '.mp3', line, voice, T.id);
    (K.chats[T.id] || []).forEach((step, i) => {
      add(T.id + '/chat' + (i + 1) + '.mp3', window.kidText(step.say, d), voice, T.id);
      step.replies.forEach((r, j) => add(T.id + '/chat' + (i + 1) + '-' + (j + 1) + '.mp3', window.kidText(r[0], d), voice, T.id));
    });
  }
  return jobs;
};
