// Munster (Corca Dhuibhne) wording for the course. Only lines that differ from Ulster are here; course.js merges them in.
// Phrase and drill numbers are 1-based and match the audio numbering. All of this wants a check by a Munster speaker.
window.DIALECTS = window.DIALECTS || {};
(function(){
  const P = (ga, en, sound, words, lit, why) => [ga, en, sound, words, {lit, why}];
  window.DIALECTS.m = {
    tutor: {name:'Máire', cast:'maire', free:['Haigh! Conas atá tú inniu? Cad atá ag tarlú?', 'Hi! How are you today? What’s happening?'], place:'Baile an Fheirtéaraigh', county:'Corca Dhuibhne, Co. Kerry', dialect:'Munster Irish (Corca Dhuibhne)',
      examples:'"Conas atá tú?", "Táim", "Cad is ainm duit?", "Cathain", "An féidir leat"'},
    swap: {'Gráinne':'Máire', 'Gaoth Dobhair':'Baile an Fheirtéaraigh', 'Donegal Town':'Dingle', 'Machaire Rabhartaigh':'Ceann Trá', 'Bun Beag':'An Daingean', 'Donegal':'Kerry'},
    lessons: {
      'u1-l1': {
        phrases: {
          3: P('Conas atá tú?', 'How are you?', 'KUN-us a-TAW too', ['conas'], 'How are you?', 'The Munster “how are you”. Ulster says “Cad é mar atá tú?”, Connacht “Cén chaoi a bhfuil tú?”.'),
          4: P('Táim go maith.', 'I’m well.', 'TAW-im guh MAH', ['táim', 'maith'], 'I am well', 'Munster joins Tá + mé into one word: Táim. “go” before a describing word works like English “-ly”.'),
          5: P('Táim go breá.', 'I’m grand.', 'TAW-im guh BRAW', ['breá'], 'I am finely', 'Same frame: Táim go + describing word.'),
          6: P('Nílim ródhona.', 'Not too bad.', 'NEE-lim roe-GHUN-a', ['dona'], 'I am not too bad', 'Nílim = níl + mé in one word. “ró” (too) softens dona → dhona.')
        },
        drills: {1: ['I’m well.', 'Táim go maith.'], 2: ['I’m so-so.', 'Táim go measartha.'], 3: ['How are you?', 'Conas atá tú?']}
      },
      'u1-l2': {
        ga: 'Cad is ainm duit?',
        phrases: {
          1: P('Cad is ainm duit?', 'What’s your name?', 'kod iss AN-im dit', ['ainm', 'duit'], 'What is name to you?', 'In Munster a name is “to” you: duit = do + tú.'),
          2: P('Stiofán is ainm dom.', 'My name is Stephen.', 'STIFF-awn iss AN-im dum', ['dom'], 'Stephen is name to me', 'dom = do + mé (to me).'),
          4: P('Seo Máire.', 'This is Máire.', 'shuh MAW-rya', ['seo'], 'This, Máire', '“Seo” means this or here. No verb needed.'),
          5: P('Is deas bualadh leat.', 'Pleased to meet you.', 'iss JASS BOO-la lat', ['bualadh'], 'It is nice to meet with you', 'bualadh le = meet (literally strike against!).')
        },
        drills: {2: ['Her name is Máire.', 'Máire is ainm di.'], 3: ['What’s his name?', 'Cad is ainm dó?'], 4: ['Pleased to meet you.', 'Is deas bualadh leat.']},
        chat: {opener:'Dia duit. Cad is ainm duit?', openerEn:'Hello. What’s your name?'}
      },
      'u1-l3': {
        ga: 'Cad as duit?',
        phrases: {
          1: P('Cad as duit?', 'Where are you from?', 'kod ass dit', ['as'], 'What from to you?', 'The Munster way to ask where someone is from.'),
          3: P('Cá bhfuil cónaí ort?', 'Where do you live?', 'kaw will KOE-nee urt', ['cónaí'], 'Where is living on you?', 'In Munster your home is “on” you: cónaí ort. cá eclipses fuil → bhfuil.'),
          4: P('Tá cónaí orm in Aontroim.', 'I live in Antrim.', 'taw KOE-nee urum in AYN-trim', ['cónaí'], 'Living is on me in Antrim', 'The same “on me” frame. Before a vowel, i becomes in.'),
          5: P('Tá cónaí orm i mBéal Feirste.', 'I live in Belfast.', 'taw KOE-nee urum uh MAYL FERSH-cha', ['Béal', 'Feirste'], 'Living is on me in Belfast', '“i” (in) eclipses Béal → mBéal.'),
          6: P('Táim ag obair i nDoire.', 'I work in Derry.', 'TAW-im eg OB-ir uh NIR-ya', ['obair', 'Doire'], 'I am at work in Derry', 'Táim = I am. “i” eclipses Doire → nDoire.')
        },
        drills: {
          1: ['I live in Belfast.', 'Tá cónaí orm i mBéal Feirste.'],
          2: ['I work in Derry.', 'Táim ag obair i nDoire.'],
          3: ['I live in Donegal.', 'Tá cónaí orm i nDún na nGall.'],
          4: ['Where are you from?', 'Cad as duit?']
        },
        chat: {opener:'Cad as duit, a Stiofáin?', openerEn:'Where are you from, Stephen?'}
      },
      'u1-l4': {
        phrases: {6: P('An féidir leat é sin a rá arís?', 'Can you say that again?', 'an FAY-dir lat ay shin a RAW a-REESH', ['féidir', 'arís'], 'Is it possible with you to say that again?', '“An féidir leat…?” = can you…? Ulster says “An dtig leat…?”.')},
        drills: {3: ['Can you say that again?', 'An féidir leat é sin a rá arís?']}
      },
      'u1-cp': {chat: {opener:'Dia duit! Conas atá tú?', openerEn:'Hello! How are you?'}},
      'u2-l2': {
        phrases: {7: P('Táim pósta.', 'I’m married.', 'TAW-im POE-sta', ['pósta'], 'I am married', 'Táim = Tá + mé.')}
      },
      'u2-l3': {
        ga: 'Cén aois é?',
        phrases: {
          1: P('Cad is ainm dó?', 'What’s his name?', 'kod iss AN-im doe', ['dó'], 'What is name to him?', 'dó = to him, di = to her.'),
          2: P('Seán is ainm dó.', 'His name is Seán.', 'SHAWN iss AN-im doe', ['Seán'], 'Seán is name to him', 'The same “to him” frame.'),
          3: P('Cad is ainm di?', 'What’s her name?', 'kod iss AN-im dih', ['di'], 'What is name to her?', 'di = do + í (to her).'),
          4: P('Cén aois é?', 'How old is he?', 'kayn EESH AY', ['aois'], 'What age (is) he?', 'Short and Munster: no verb needed.'),
          7: P('Cén aois tú?', 'How old are you?', 'kayn EESH too', ['aois'], 'What age (are) you?', 'The same short frame.'),
          8: P('Táim daichead bliain d’aois.', 'I’m forty.', 'TAW-im DAH-hud BLEE-in DEESH', ['daichead'], 'I am forty year of age', 'With 20, 30, 40… “bliain” stays singular.')
        },
        drills: {1: ['Her name is Áine.', 'Áine is ainm di.'], 2: ['How old is she?', 'Cén aois í?']}
      },
      'u2-l5': {
        phrases: {6: P('Táimid an-mhór le chéile.', 'We’re very close.', 'TAW-im-ij an-WORE leh HAY-la', ['mór', 'chéile'], 'We are very big with each other', '“mór le” = friendly with. Táimid = we are, in one word.')}
      },
      'u3-l1': {
        ga: 'Conas atá an aimsir?',
        phrases: {1: P('Conas atá an aimsir?', 'What’s the weather like?', 'KUN-us a-TAW an AM-shir', ['aimsir'], 'How is the weather?', 'The same frame as “Conas atá tú?”.')},
        drills: {4: ['What’s the weather like?', 'Conas atá an aimsir?']}
      },
      'u3-l2': {
        ga: 'Tá sé ag cur báistí',
        phrases: {1: P('Tá sé ag cur báistí.', 'It’s raining.', 'taw shay eg kur BAWSH-chee', ['báisteach'], 'It is putting rain', 'Weather “puts” rain: ag cur báistí. Ulster says fearthainn.')},
        chat: {opener:'Ó, tá sé ag cur báistí arís!', openerEn:'Oh, it’s raining again!'}
      },
      'u3-l3': {
        phrases: {
          3: P('Táim fliuch go craiceann.', 'I’m soaked to the skin.', 'TAW-im FLUKH guh KRACK-un', ['craiceann'], 'I am wet to the skin', 'Just like the English.'),
          5: P('Tá scáth báistí agam.', 'I have an umbrella.', 'taw skaw BAWSH-chee AH-gum', ['scáth', 'báisteach'], 'A rain shade is at me', 'An umbrella is a “rain shade”.')
        },
        chat: {opener:'An mbeidh sé fuar inniu, an dóigh leat?', openerEn:'Will it be cold today, do you think?'}
      },
      'u3-l5': {
        ga: 'Conas a bheidh an aimsir?',
        phrases: {
          1: P('Conas a bheidh an aimsir amárach?', 'What will the weather be like tomorrow?', 'KUN-us a VEH an AM-shir a-MAW-rakh', ['bheidh'], 'How will the weather be tomorrow?', '“a” softens beidh → bheidh after conas.'),
          4: P('Má bhíonn sé tirim, raghaimid amach.', 'If it’s dry, we’ll go out.', 'maw VEE-un shay CHIR-im, RYE-im-ij a-MAKH', ['raghaimid'], 'If it is dry, we will go out', 'raghaimid = we will go, in one word.'),
          5: P('Fanfaimid istigh.', 'We’ll stay in.', 'FAN-im-ij ish-CHIG', ['fanfaimid', 'istigh'], 'We will stay inside', '-faimid = we will.')
        },
        drills: {2: ['We’ll stay in.', 'Fanfaimid istigh.']},
        chat: {opener:'Ar chuala tú conas a bheidh an aimsir amárach?', openerEn:'Did you hear what the weather will be like tomorrow?'}
      },
      'u4-l1': {
        phrases: {
          4: P('Cé mhéad atá ann?', 'How many are there?', 'kay VAYD a-TAW un', ['méad'], 'What amount is in it?', 'Cé mhéad = how many, how much.'),
          7: P('Cad í d’uimhir fóin?', 'What’s your phone number?', 'kod EE DIV-ir FONE', ['uimhir', 'fón'], 'What is it, your phone number?', 'í refers back to uimhir, a feminine word.')
        },
        drills: {2: ['How many are there?', 'Cé mhéad atá ann?']},
        chat: {opener:'Cad í d’uimhir fóin? Cuirfidh mé na grianghraif chugat.', openerEn:'What’s your phone number? I’ll send you the photos.'}
      },
      'u4-l2': {
        ga: 'Cad a chlog é?',
        phrases: {
          1: P('Cad a chlog é?', 'What time is it?', 'kod a KHLUG AY', ['clog'], 'What of the clock is it?', 'The Munster way to ask the time.'),
          3: P('Tá sé leathuair tar éis a dó.', 'It’s half past two.', 'taw shay LYAH-oor tar AYSH a DOE', ['leathuair'], 'It is a half hour after two', 'tar éis = after (past).'),
          4: P('Tá sé ceathrú tar éis a cúig.', 'It’s quarter past five.', 'taw shay KYAH-roo tar AYSH a KOO-ig', ['ceathrú'], 'It is a quarter after five', 'The same tar éis frame.'),
          5: P('Tá sé ceathrú chun a sé.', 'It’s quarter to six.', 'taw shay KYAH-roo khun a SHAY', ['chun'], 'It is a quarter towards six', 'chun = towards, to.'),
          7: P('Táim déanach!', 'I’m late!', 'TAW-im JAY-nukh', ['déanach'], 'I am late', 'déanach = late.')
        },
        drills: {2: ['It’s half past four.', 'Tá sé leathuair tar éis a ceathair.'], 4: ['I’m late!', 'Táim déanach!']},
        chat: {opener:'Cad a chlog é? Tá an traein ag imeacht ar a deich.', openerEn:'What time is it? The train leaves at ten.'}
      },
      'u4-l4': {
        phrases: {6: P('Cathain a éiríonn tú?', 'What time do you get up?', 'KA-hin a EYE-ree-un too', ['cathain'], 'When do you rise?', 'Cathain = when, the Munster word.')}
      },
      'u4-l5': {
        phrases: {4: P('Cathain atá do bhreithlá?', 'When is your birthday?', 'KA-hin a-TAW duh VREH-law', ['cathain', 'breithlá'], 'When is your birthday?', 'Cathain = when. do softens breithlá → bhreithlá.')},
        drills: {2: ['When is your birthday?', 'Cathain atá do bhreithlá?']},
        chat: {opener:'An bhfuil a fhios agat cathain atá mo bhreithlá?', openerEn:'Do you know when my birthday is?'}
      },
      'u5-l1': {
        phrases: {1: P('Cad ba mhaith leat?', 'What would you like?', 'kod ba WAH lat', ['mhaith'], 'What would be good with you?', 'Cad = what.')},
        drills: {3: ['What would you like?', 'Cad ba mhaith leat?']},
        chat: {opener:'Dia duit! Cad ba mhaith leat?', openerEn:'Hello! What would you like?'}
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
      'u5-l3': {chat: {opener:'Dia duit! An féidir liom cabhrú leat?', openerEn:'Hello! Can I help you?'}},
      'u5-l4': {
        phrases: {4: P('An féidir liom an bille a fháil?', 'Can I get the bill?', 'an FAY-dir lum an BIL-ya a AWL', ['bille', 'fáil'], 'Is it possible with me to get the bill?', '“An féidir liom…?” = can I…?')},
        drills: {2: ['Can I get the bill?', 'An féidir liom an bille a fháil?']}
      },
      'u5-l5': {
        ga: 'Nílim ach ag féachaint',
        phrases: {
          1: P('Nílim ach ag féachaint.', 'I’m just looking.', 'NEE-lim akh eg FAY-khint', ['féachaint'], 'I am not but looking', 'Nílim … ach = only. féachaint = looking.'),
          2: P('Táim ag lorg bronntanais.', 'I’m looking for a present.', 'TAW-im eg LUR-ug BROWN-ta-nish', ['lorg', 'bronntanas'], 'I am seeking a present', 'After ag lorg, the thing changes to its “of” form: bronntanas → bronntanais.')
        },
        drills: {1: ['I’m just looking.', 'Nílim ach ag féachaint.'], 4: ['I’m looking for a present for my father.', 'Táim ag lorg bronntanais do m’athair.']},
        chat: {opener:'Cad atá á lorg agat?', openerEn:'What are you looking for?'}
      },
      'u5-cp': {chat: {opener:'Á, tá ocras orm! Cad a bheidh agat?', openerEn:'Ah, I’m hungry! What will you have?'}},
      'u6-l2': {
        phrases: {
          4: P('Táim le hAontroim.', 'I’m for Antrim.', 'TAW-im leh HAYN-trim', ['Aontroim'], 'I am with Antrim', 'le puts an h before a vowel: le hAontroim.'),
          6: P('Bhuaigh Ciarraí!', 'Kerry won!', 'WOO-ee KEER-ee', ['Ciarraí'], 'Kerry won!', 'In the past, verbs soften: buaigh → bhuaigh.')
        },
        chat: {opener:'An raibh tú ag an gcluiche?', openerEn:'Were you at the match?'}
      },
      'u6-l3': {
        phrases: {1: P('Cad a dhéanann tú i d’am saor?', 'What do you do in your free time?', 'kod a YAY-nun too uh DOWM SEER', ['déanann', 'saor'], 'What is it that you do in your free time?', 'do (your) becomes d’ before a vowel: d’am.')},
        drills: {4: ['What do you do in your free time?', 'Cad a dhéanann tú i d’am saor?']},
        chat: {opener:'Cad a dhéanann tú i d’am saor?', openerEn:'What do you do in your free time?'}
      },
      'u6-l4': {
        phrases: {5: P('Ní féidir liom damhsa!', 'I can’t dance!', 'nee FAY-dir lum DOW-sa', ['damhsa'], 'It isn’t possible with me to dance', 'Ní féidir liom = I can’t.')},
        drills: {2: ['I can’t sing!', 'Ní féidir liom canadh!']}
      },
      'u6-l5': {
        phrases: {
          3: P('Cén áit a mbuailfimid le chéile?', 'Where will we meet?', 'kayn AWCH a MOO-il-im-ij leh HAY-la', ['áit', 'buail'], 'What place will we meet each other?', 'mbuailfimid = will we meet, in one word, eclipsed.'),
          5: P('Cad mar gheall ar Dé Sathairn?', 'What about Saturday?', 'kod mar YOWL er jay SAH-harn', ['gheall'], 'What concerning Saturday?', 'Cad mar gheall ar … ? = What about … ?')
        },
        drills: {3: ['What about Friday?', 'Cad mar gheall ar Dé hAoine?']}
      },
      'u6-cp': {chat: {opener:'Seo mé i mBéal Feirste! Cad a dhéanfaimid?', openerEn:'Here I am in Belfast! What will we do?'}}
    }
  };
})();
