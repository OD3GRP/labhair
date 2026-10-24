// Scéalta: short original stories built from the course phrases, read by the dialect's voice. Tap any word for its meaning.
// Pure data (no DOM) so tools/make-audio.mjs can read it. Audio: audio/st-<dialect>/<storyId>/<n>.mp3.
// A line's Irish is a string or {u, c, m}. gloss maps a word (lower case) to its English.
(function(){
  const W = window;
  W.STORIES = [
    {id:'st-sean', unit:1, ga:'Is mise Seán', en:'I’m Seán', pic:'👋', lines:[
      ['Is mise Seán.', 'I’m Seán.'],
      ['Is as Gaoth Dobhair mé.', 'I’m from Gaoth Dobhair.'],
      [{u:'Tá mé i mo chónaí i mBéal Feirste anois.', c:'Tá mé i mo chónaí i mBéal Feirste anois.', m:'Tá cónaí orm i mBéal Feirste anois.'}, 'I live in Belfast now.'],
      [{u:'Tá mé ag obair i siopa.', c:'Tá mé ag obair i siopa.', m:'Táim ag obair i siopa.'}, 'I work in a shop.'],
      ['Gach maidin, deirim “Dia duit!” le gach duine.', 'Every morning, I say “Hello!” to everyone.'],
      ['Deir siad “Dia is Muire duit!” liom.', 'They say “Hello!” back to me.'],
      [{u:'Tá mé sona i mBéal Feirste.', c:'Tá mé sona i mBéal Feirste.', m:'Táim sona i mBéal Feirste.'}, 'I’m happy in Belfast.']],
      gloss:{is:'is (for who someone is)', mise:'me (strong form)', as:'from', mé:'I, me', tá:'is, am', táim:'I am', i:'in', mo:'my', chónaí:'living (from cónaí)', cónaí:'living, dwelling', orm:'on me', mbéal:'Béal (eclipsed after i)', feirste:'of Belfast (Béal Feirste = Belfast)', anois:'now', ag:'at; with a verb, “-ing”', obair:'work', siopa:'shop', gach:'every', maidin:'morning', deirim:'I say', dia:'God', duit:'to you', le:'with, to', duine:'person', deir:'says', siad:'they', muire:'Mary', liom:'with me, to me', sona:'happy', gaoth:'wind (Gaoth Dobhair)', dobhair:'of water (Gaoth Dobhair)'}},
    {id:'st-aine', unit:2, ga:'Teaghlach Áine', en:'Áine’s family', pic:'👨‍👩‍👧‍👦', lines:[
      ['Seo Áine.', 'This is Áine.'],
      ['Tá teaghlach mór aici.', 'She has a big family.'],
      ['Tá beirt deartháireacha agus deirfiúr amháin aici.', 'She has two brothers and one sister.'],
      ['Tá a deartháir Seán ard agus greannmhar.', 'Her brother Seán is tall and funny.'],
      ['Tá a deirfiúr Róisín sé bliana d’aois.', 'Her sister Róisín is six.'],
      ['Tá gruaig dhonn ar Róisín, agus tá sí cineálta.', 'Róisín has brown hair, and she’s kind.'],
      ['Is breá le hÁine a teaghlach.', 'Áine loves her family.']],
      gloss:{seo:'this', tá:'is', teaghlach:'family', mór:'big', aici:'at her (she has)', beirt:'two (people)', deartháireacha:'brothers', agus:'and', deirfiúr:'sister', amháin:'one, only', a:'her', deartháir:'brother', ard:'tall', greannmhar:'funny', sé:'six', bliana:'years', 'd’aois':'of age', gruaig:'hair', dhonn:'brown (from donn)', ar:'on', sí:'she', cineálta:'kind', is:'is', breá:'fine; is breá le = loves', le:'with', hÁine:'Áine (h after le)', háine:'Áine (h after le)'}},
    {id:'st-fliuch', unit:3, ga:'Lá fliuch', en:'A wet day', pic:'🌧️', lines:[
      [{u:'Inniu, tá sé ag cur fearthainne.', c:'Inniu, tá sé ag báisteach.', m:'Inniu, tá sé ag cur báistí.'}, 'Today, it’s raining.'],
      [{u:'Tá fuacht orm agus tá mé fliuch go craiceann.', c:'Tá fuacht orm agus tá mé fliuch go craiceann.', m:'Tá fuacht orm agus táim fliuch go craiceann.'}, 'I’m cold, and I’m soaked to the skin.'],
      ['Ní maith liom an geimhreadh!', 'I don’t like the winter!'],
      ['Ach deir siad go mbeidh sé grianmhar amárach.', 'But they say it’ll be sunny tomorrow.'],
      [{u:'Rachaidh muid chun na trá.', c:'Rachaidh muid chun na trá.', m:'Raghaimid chun na trá.'}, 'We’ll go to the beach.'],
      ['Is breá liom an samhradh!', 'I love the summer!']],
      gloss:{inniu:'today', tá:'is', sé:'it', ag:'at; “-ing”', cur:'putting', fearthainne:'of rain (fearthainn)', báisteach:'rain', báistí:'of rain', fuacht:'cold', orm:'on me', agus:'and', mé:'I', táim:'I am', fliuch:'wet', go:'to', craiceann:'skin', ní:'not', maith:'good', liom:'with me', an:'the', geimhreadh:'winter', ach:'but', deir:'say', siad:'they', mbeidh:'will be (eclipsed after go)', grianmhar:'sunny', amárach:'tomorrow', rachaidh:'will go', raghaimid:'we will go', muid:'we', chun:'to, towards', na:'the', trá:'beach (of the beach)', is:'is', breá:'fine; is breá liom = I love', samhradh:'summer'}},
    {id:'st-caife', unit:5, ga:'Sa chaife', en:'In the café', pic:'☕', lines:[
      ['Téim go dtí an caife gach Satharn.', 'I go to the café every Saturday.'],
      ['Ba mhaith liom cupán tae agus ceapaire cáise.', 'I’d like a cup of tea and a cheese sandwich.'],
      ['Bíonn an tae te agus blasta.', 'The tea is always hot and tasty.'],
      [{u:'Íocaim cúig phunt.', c:'Íocaim cúig euro.', m:'Íocaim cúig euro.'}, {u:'I pay five pounds.', c:'I pay five euro.', m:'I pay five euro.'}],
      ['Deirim “Go raibh maith agat!”', 'I say “Thank you!”'],
      ['Is breá liom an Satharn!', 'I love Saturdays!']],
      gloss:{téim:'I go', go:'to (go dtí)', dtí:'to (go dtí)', an:'the', caife:'café, coffee', gach:'every', satharn:'Saturday', ba:'would', mhaith:'good (ba mhaith liom = I’d like)', liom:'with me', cupán:'cup', tae:'tea', agus:'and', ceapaire:'sandwich', cáise:'of cheese', bíonn:'is (usually)', te:'hot', blasta:'tasty', íocaim:'I pay', cúig:'five', phunt:'pounds (from punt)', euro:'euro', deirim:'I say', raibh:'may there be', maith:'good', agat:'at you', is:'is', breá:'fine; is breá liom = I love'}},
    {id:'st-cluiche', unit:6, ga:'An cluiche mór', en:'The big match', pic:'🏐', lines:[
      ['Is breá le Seoirse peil.', 'Seoirse loves football.'],
      ['Imríonn sé gach Satharn.', 'He plays every Saturday.'],
      ['Inniu, tá cluiche mór ann.', 'Today, there’s a big match.'],
      ['Tá a theaghlach ar fad ann.', 'His whole family is there.'],
      ['Fuair Seoirse cúl!', 'Seoirse got a goal!'],
      ['Bhuaigh siad! Bhí an chraic go hiontach.', 'They won! The craic was great.']],
      gloss:{is:'is', breá:'fine; is breá le = loves', le:'with', peil:'football', imríonn:'plays', sé:'he', gach:'every', satharn:'Saturday', inniu:'today', tá:'is, are', cluiche:'match, game', mór:'big', ann:'there (in it)', a:'his', theaghlach:'family (from teaghlach)', ar:'on', fad:'length; ar fad = all, whole', fuair:'got', cúl:'goal', bhuaigh:'won', siad:'they', bhí:'was', an:'the', chraic:'craic (from craic)', go:'(makes an adverb)', hiontach:'great (h after go)'}}
  ];
  W.storyLine = (x, d) => (x && typeof x === 'object') ? (x[d] || x.u) : x;
  // Everything to record for one dialect (used by tools/make-audio.mjs).
  W.storyAudioJobs = function(d){
    const voice = {u:'anb.piper', c:'snc.piper', m:'nnc.piper'}[d];
    return W.STORIES.flatMap(S => S.lines.map((l, i) => ({rel:S.id + '/' + (i + 1) + '.mp3', text:W.storyLine(l[0], d), voice, unit:S.id})));
  };
})();
