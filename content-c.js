// Connacht (Conamara) wording for the course. Only lines that differ from Ulster are here; course.js merges them in.
// Phrase and drill numbers are 1-based and match the audio numbering. All of this wants a check by a Connacht speaker.
window.DIALECTS = window.DIALECTS || {};
(function(){
  const P = (ga, en, sound, words, lit, why) => [ga, en, sound, words, {lit, why}];
  window.DIALECTS.c = {
    tutor: {name:'Nóra', place:'An Cheathrú Rua', county:'Conamara, Co. Galway', dialect:'Connacht Irish (Conamara)',
      examples:'"Cén chaoi a bhfuil tú?", "Céard", "Tá mé", "An féidir leat", "báisteach"'},
    swap: {'Gráinne':'Nóra', 'Gaoth Dobhair':'An Cheathrú Rua', 'Donegal Town':'Galway', 'Machaire Rabhartaigh':'Trá an Dóilín', 'Bun Beag':'An Spidéal', 'Donegal':'Conamara'},
    lessons: {
      'u1-l1': {
        phrases: {
          3: P('Cén chaoi a bhfuil tú?', 'How are you?', 'kayn KHEE a will too', ['caoi', 'bhfuil'], 'What way are you?', 'The Connacht “how are you”. “a” eclipses fuil → bhfuil. Ulster says “Cad é mar atá tú?”, Munster “Conas atá tú?”.'),
          6: P('Níl mé ródhona.', 'Not too bad.', 'neel may roe-GHUN-a', ['dona'], 'I am not too bad', '“Níl” is the “not” form of Tá. “ró” (too) softens dona → dhona.')
        },
        drills: {3: ['How are you?', 'Cén chaoi a bhfuil tú?']}
      },
      'u1-l2': {
        ga: 'Cén t-ainm atá ort?',
        phrases: {
          1: P('Cén t-ainm atá ort?', 'What’s your name?', 'kayn TAN-im a-TAW urt', ['ainm', 'ort'], 'What name is on you?', 'Cén = what, which. A name is “on” you: ort = ar + tú.'),
          4: P('Seo Nóra.', 'This is Nóra.', 'shuh NOR-a', ['seo'], 'This, Nóra', '“Seo” means this or here. No verb needed.')
        },
        drills: {2: ['Her name is Nóra.', 'Nóra an t-ainm atá uirthi.'], 3: ['What’s his name?', 'Cén t-ainm atá air?']},
        chat: {opener:'Dia duit. Cén t-ainm atá ort?', openerEn:'Hello. What’s your name?'}
      },
      'u1-l3': {
        ga: 'Cé as thú?',
        phrases: {1: P('Cé as thú?', 'Where are you from?', 'kay ass HOO', ['as'], 'Who from you?', 'The Connacht way. “thú” is tú after the question.')},
        drills: {4: ['Where are you from?', 'Cé as thú?']},
        chat: {opener:'Cé as thú, a Stiofáin?', openerEn:'Where are you from, Stephen?'}
      },
      'u1-l4': {
        phrases: {6: P('An féidir leat é sin a rá arís?', 'Can you say that again?', 'an FAY-dir lat ay shin a RAW a-REESH', ['féidir', 'arís'], 'Is it possible with you to say that again?', '“An féidir leat…?” = can you…? Ulster says “An dtig leat…?”.')},
        drills: {3: ['Can you say that again?', 'An féidir leat é sin a rá arís?']}
      },
      'u1-cp': {chat: {opener:'Dia duit! Cén chaoi a bhfuil tú?', openerEn:'Hello! How are you?'}},
      'u2-l3': {
        ga: 'Cén aois atá sé?',
        phrases: {
          1: P('Cén t-ainm atá air?', 'What’s his name?', 'kayn TAN-im a-TAW er', ['air'], 'What name is on him?', 'Names are “on” people: air = on him, uirthi = on her.'),
          3: P('Cén t-ainm atá uirthi?', 'What’s her name?', 'kayn TAN-im a-TAW ER-hee', ['uirthi'], 'What name is on her?', 'uirthi = ar + í (on her).'),
          4: P('Cén aois atá sé?', 'How old is he?', 'kayn EESH a-TAW shay', ['aois'], 'What age is he?', 'Cén = what, which. Ulster says “Cá haois”.'),
          7: P('Cén aois thú?', 'How old are you?', 'kayn EESH HOO', ['aois'], 'What age you?', 'A short Connacht way to ask. No verb needed.')
        },
        drills: {2: ['How old is she?', 'Cén aois atá sí?']}
      },
      'u3-l1': {
        ga: 'Cén chaoi a bhfuil an aimsir?',
        phrases: {1: P('Cén chaoi a bhfuil an aimsir?', 'What’s the weather like?', 'kayn KHEE a will an AM-shir', ['aimsir'], 'What way is the weather?', 'The same frame as “Cén chaoi a bhfuil tú?”.')},
        drills: {4: ['What’s the weather like?', 'Cén chaoi a bhfuil an aimsir?']}
      },
      'u3-l2': {
        ga: 'Tá sé ag báisteach',
        phrases: {1: P('Tá sé ag báisteach.', 'It’s raining.', 'taw shay eg BAWSH-chukh', ['báisteach'], 'It is raining', 'báisteach is rain in Connacht and Munster; Ulster says fearthainn.')},
        chat: {opener:'Ó, tá sé ag báisteach arís!', openerEn:'Oh, it’s raining again!'}
      },
      'u3-l3': {
        phrases: {5: P('Tá scáth báistí agam.', 'I have an umbrella.', 'taw skaw BAWSH-chee AH-gum', ['scáth', 'báisteach'], 'A rain shade is at me', 'An umbrella is a “rain shade”. báisteach → báistí in the “of” form.')},
        chat: {opener:'An mbeidh sé fuar inniu, an dóigh leat?', openerEn:'Will it be cold today, do you think?'}
      },
      'u3-l5': {
        ga: 'Cén chaoi a mbeidh an aimsir?',
        phrases: {1: P('Cén chaoi a mbeidh an aimsir amárach?', 'What will the weather be like tomorrow?', 'kayn KHEE a MEH an AM-shir a-MAW-rakh', ['mbeidh'], 'What way will the weather be tomorrow?', '“a” eclipses beidh → mbeidh here.')},
        chat: {opener:'Ar chuala tú cén chaoi a mbeidh an aimsir amárach?', openerEn:'Did you hear what the weather will be like tomorrow?'}
      },
      'u4-l1': {
        phrases: {
          4: P('Cé mhéad atá ann?', 'How many are there?', 'kay VAYD a-TAW un', ['méad'], 'What amount is in it?', 'Cé mhéad = how many, how much.'),
          7: P('Céard í d’uimhir fóin?', 'What’s your phone number?', 'kayrd EE DIV-ir FONE', ['uimhir', 'fón'], 'What is it, your phone number?', 'Céard = what, the Connacht word. í refers back to uimhir, a feminine word.')
        },
        drills: {2: ['How many are there?', 'Cé mhéad atá ann?']},
        chat: {opener:'Céard í d’uimhir fóin? Cuirfidh mé na grianghraif chugat.', openerEn:'What’s your phone number? I’ll send you the photos.'}
      },
      'u4-l2': {
        ga: 'Cén t-am é?',
        phrases: {
          1: P('Cén t-am é?', 'What time is it?', 'kayn TOWM AY', ['am'], 'What time is it?', 'Short and sweet: Cén t-am é?'),
          3: P('Tá sé leathuair tar éis a dó.', 'It’s half past two.', 'taw shay LYAH-oor tar AYSH a DOE', ['leathuair'], 'It is a half hour after two', 'tar éis = after (past). Ulster says i ndiaidh.'),
          4: P('Tá sé ceathrú tar éis a cúig.', 'It’s quarter past five.', 'taw shay KYAH-roo tar AYSH a KOO-ig', ['ceathrú'], 'It is a quarter after five', 'The same tar éis frame.'),
          5: P('Tá sé ceathrú chun a sé.', 'It’s quarter to six.', 'taw shay KYAH-roo khun a SHAY', ['chun'], 'It is a quarter towards six', 'chun = towards, to.'),
          7: P('Tá mé deireanach!', 'I’m late!', 'taw may JER-an-akh', ['deireanach'], 'I am late', 'deireanach = late, last.')
        },
        drills: {2: ['It’s half past four.', 'Tá sé leathuair tar éis a ceathair.'], 4: ['I’m late!', 'Tá mé deireanach!']},
        chat: {opener:'Cén t-am é? Tá an traein ag imeacht ar a deich.', openerEn:'What time is it? The train leaves at ten.'}
      },
      'u4-l4': {
        phrases: {6: P('Cén t-am a n-éiríonn tú?', 'What time do you get up?', 'kayn TOWM a NYE-ree-un too', ['éiríonn'], 'What time at which you rise?', 'After “an t-am a”, the verb gets an n- because it means “at which”.')}
      },
      'u4-l5': {
        phrases: {4: P('Cén uair atá do bhreithlá?', 'When is your birthday?', 'kayn OO-ir a-TAW duh VREH-law', ['uair', 'breithlá'], 'What hour is your birthday?', 'Cén uair = when. do softens breithlá → bhreithlá.')},
        drills: {2: ['When is your birthday?', 'Cén uair atá do bhreithlá?']},
        chat: {opener:'An bhfuil a fhios agat cén uair atá mo bhreithlá?', openerEn:'Do you know when my birthday is?'}
      },
      'u5-l1': {
        phrases: {1: P('Céard ba mhaith leat?', 'What would you like?', 'kayrd ba WAH lat', ['mhaith'], 'What would be good with you?', 'Céard = what, the Connacht word.')},
        drills: {3: ['What would you like?', 'Céard ba mhaith leat?']},
        chat: {opener:'Dia duit! Céard ba mhaith leat?', openerEn:'Hello! What would you like?'}
      },
      'u5-l2': {
        ga: 'Cé mhéad atá air?',
        phrases: {
          1: P('Cé mhéad atá air seo?', 'How much is this?', 'kay VAYD a-TAW er SHUH', ['méad'], 'What amount is on this?', 'A price is “on” the thing.'),
          2: P('Tá sé cúig euro.', 'It’s five euro.', 'taw shay KOO-ig YOO-roe', ['euro'], 'It is five euro', 'euro never changes after a number.'),
          3: P('Sin trí euro, le do thoil.', 'That’s three euro, please.', 'shin TREE YOO-roe, leh duh HUL', ['trí'], 'That (is) three euro, please', 'Sin = that.')
        },
        drills: {1: ['How much is this?', 'Cé mhéad atá air seo?'], 2: ['That’s two euro.', 'Sin dhá euro.']}
      },
      'u5-l3': {chat: {opener:'Dia duit! An féidir liom cuidiú leat?', openerEn:'Hello! Can I help you?'}},
      'u5-l4': {
        phrases: {4: P('An féidir liom an bille a fháil?', 'Can I get the bill?', 'an FAY-dir lum an BIL-ya a AWL', ['bille', 'fáil'], 'Is it possible with me to get the bill?', '“An féidir liom…?” = can I…?')},
        drills: {2: ['Can I get the bill?', 'An féidir liom an bille a fháil?']}
      },
      'u5-l5': {
        ga: 'Níl mé ach ag breathnú',
        phrases: {1: P('Níl mé ach ag breathnú.', 'I’m just looking.', 'neel may akh eg BRAN-oo', ['breathnú'], 'I am not but looking', 'Níl … ach = only. breathnú is the Connacht word for looking.')},
        drills: {1: ['I’m just looking.', 'Níl mé ach ag breathnú.']},
        chat: {opener:'Céard atá tú a chuartú?', openerEn:'What are you looking for?'}
      },
      'u5-cp': {chat: {opener:'Á, tá ocras orm! Céard a bheas agat?', openerEn:'Ah, I’m hungry! What will you have?'}},
      'u6-l2': {
        phrases: {6: P('Bhuaigh Gaillimh!', 'Galway won!', 'WOO-ee GAL-iv', ['Gaillimh'], 'Galway won!', 'In the past, verbs soften: buaigh → bhuaigh.')},
        chat: {opener:'An raibh tú ag an gcluiche?', openerEn:'Were you at the match?'}
      },
      'u6-l3': {
        phrases: {1: P('Céard a dhéanann tú i d’am saor?', 'What do you do in your free time?', 'kayrd a YAY-nun too uh DOWM SEER', ['déanann', 'saor'], 'What is it that you do in your free time?', 'do (your) becomes d’ before a vowel: d’am.')},
        drills: {4: ['What do you do in your free time?', 'Céard a dhéanann tú i d’am saor?']},
        chat: {opener:'Céard a dhéanann tú i d’am saor?', openerEn:'What do you do in your free time?'}
      },
      'u6-l4': {
        phrases: {5: P('Ní féidir liom damhsa!', 'I can’t dance!', 'nee FAY-dir lum DOW-sa', ['damhsa'], 'It isn’t possible with me to dance', 'Ní féidir liom = I can’t. Ulster says Ní thig liom.')},
        drills: {2: ['I can’t sing!', 'Ní féidir liom canadh!']}
      },
      'u6-l5': {
        phrases: {
          3: P('Cén áit a mbuailfidh muid le chéile?', 'Where will we meet?', 'kayn AWCH a MOO-il-ee mwidj leh HAY-la', ['áit', 'buailfidh'], 'What place will we meet each other?', 'buail le = meet. It gets eclipsed here: mbuailfidh.'),
          5: P('Céard faoi Dé Sathairn?', 'What about Saturday?', 'kayrd fwee jay SAH-harn', ['faoi'], 'What about Saturday?', 'Céard faoi … ? = What about … ?')
        },
        drills: {3: ['What about Friday?', 'Céard faoi Dé hAoine?']}
      },
      'u6-cp': {chat: {opener:'Seo mé i mBéal Feirste! Céard a dhéanfaidh muid?', openerEn:'Here I am in Belfast! What will we do?'}}
    }
  };
})();
