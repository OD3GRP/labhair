// Labhair course content. Ulster Irish (Gaeilge Uladh), standard spelling.
// Each phrase: [Irish, English, sound-it-out, [words to hear on teanglann.ie]]
// Each drill:  [English prompt, Irish answer]
// Add new units to the end of UNITS; lesson ids must stay unique and stable (progress is keyed on them).

window.LEARNER = { ga: 'Stiofán', vocative: 'a Stiofáin', en: 'Stephen' };

window.UNITS = [
  {
    id: 'u1', num: 1, ga: 'Beannachtaí', en: 'Greetings',
    lessons: [
      { id: 'u1-l1', ga: 'Dia duit!', en: 'Hello', goal: 'Greet someone and ask how they are',
        phrases: [
          ['Dia duit.', 'Hello.', 'JEE-a gwit', ['Dia', 'duit']],
          ['Dia is Muire duit.', 'Hello (the reply).', 'JEE-a iss MWIR-a gwit', ['Muire']],
          ['Cad é mar atá tú?', 'How are you?', 'ka-JAY mar a-TAW too', ['atá']],
          ['Tá mé go maith.', 'I’m well.', 'taw may guh MAH', ['maith']],
          ['Tá mé go breá.', 'I’m grand.', 'taw may guh BRAW', ['breá']],
          ['Níl mé ró-dhona.', 'Not too bad.', 'neel may roe-GHUN-a', ['dona']],
          ['Agus tú féin?', 'And yourself?', 'AH-gus too HAYN', ['féin']]
        ],
        drills: [
          ['I’m well.', 'Tá mé go maith.'],
          ['I’m so-so.', 'Tá mé go measartha.'],
          ['How are you?', 'Cad é mar atá tú?'],
          ['And yourself?', 'Agus tú féin?']
        ],
        chat: { scene: 'You bump into Gráinne outside the shop in Gaoth Dobhair.', opener: 'Dia duit!', openerEn: 'Hello!',
          goals: [['reply', 'Return her greeting'], ['ask', 'Ask how she is'], ['answer', 'Say how you are']] }
      },
      { id: 'u1-l2', ga: 'Cad é an t-ainm atá ort?', en: 'Names', goal: 'Give your name, ask theirs, introduce a friend',
        phrases: [
          ['Cad é an t-ainm atá ort?', 'What’s your name?', 'ka-JAY an TAN-im a-TAW urt', ['ainm', 'ort']],
          ['Stiofán an t-ainm atá orm.', 'My name is Stephen.', 'STIFF-awn an TAN-im a-TAW urum', ['orm']],
          ['Is mise Stiofán.', 'I’m Stephen.', 'iss MISH-a STIFF-awn', ['mise']],
          ['Seo Gráinne.', 'This is Gráinne.', 'shuh GRAWN-ya', ['seo']],
          ['Tá áthas orm castáil leat.', 'Pleased to meet you.', 'taw AW-hus urum kas-TAWL lat', ['áthas', 'castáil']],
          ['Agus tusa?', 'And you?', 'AH-gus TUSS-a', ['tusa']]
        ],
        drills: [
          ['I’m Stephen.', 'Is mise Stiofán.'],
          ['Her name is Gráinne.', 'Gráinne an t-ainm atá uirthi.'],
          ['What’s his name?', 'Cad é an t-ainm atá air?'],
          ['Pleased to meet you.', 'Tá áthas orm castáil leat.']
        ],
        chat: { scene: 'Gráinne sits down beside you at an Irish-language night and introduces herself.', opener: 'Dia duit. Cad é an t-ainm atá ort?', openerEn: 'Hello. What’s your name?',
          goals: [['name', 'Give your name'], ['hers', 'Ask her name'], ['meet', 'Say you’re pleased to meet her']] }
      },
      { id: 'u1-l3', ga: 'Cá as tú?', en: 'Where you’re from', goal: 'Say where you’re from and where you live',
        phrases: [
          ['Cá as tú?', 'Where are you from?', 'kaw ass too', ['as']],
          ['Is as Aontroim mé.', 'I’m from Antrim.', 'iss ass AYN-trim may', ['Aontroim']],
          ['Cá bhfuil tú i do chónaí?', 'Where do you live?', 'kaw will too uh duh KHOE-nee', ['bhfuil', 'chónaí']],
          ['Tá mé i mo chónaí in Aontroim.', 'I live in Antrim.', 'taw may uh muh KHOE-nee in AYN-trim', ['chónaí']],
          ['Tá mé i mo chónaí i mBéal Feirste.', 'I live in Belfast.', '… uh MAYL FERSH-cha', ['Béal', 'Feirste']],
          ['Tá mé ag obair i nDoire.', 'I work in Derry.', 'taw may eg OB-ir uh NIR-ya', ['obair', 'Doire']]
        ],
        drills: [
          ['I live in Belfast.', 'Tá mé i mo chónaí i mBéal Feirste.'],
          ['I work in Derry.', 'Tá mé ag obair i nDoire.'],
          ['I live in Donegal.', 'Tá mé i mo chónaí i nDún na nGall.'],
          ['Where are you from?', 'Cá as tú?']
        ],
        chat: { scene: 'Gráinne is curious about where you’re from.', opener: 'Cá as tú, a Stiofáin?', openerEn: 'Where are you from, Stephen?',
          goals: [['from', 'Say where you’re from'], ['askher', 'Ask where she’s from'], ['live', 'Say where you live']] }
      },
      { id: 'u1-l4', ga: 'Ní thuigim!', en: 'Survival phrases', goal: 'Keep going in Irish when you’re lost',
        phrases: [
          ['Le do thoil.', 'Please.', 'leh duh HUL', ['thoil']],
          ['Go raibh maith agat.', 'Thank you.', 'guh rev mah AH-gut', ['raibh', 'agat']],
          ['Fáilte romhat.', 'You’re welcome.', 'FAWL-cha ROE-ut', ['fáilte', 'romhat']],
          ['Gabh mo leithscéal.', 'Excuse me / sorry.', 'go muh LESH-kayl', ['gabh', 'leithscéal']],
          ['Ní thuigim.', 'I don’t understand.', 'nee HIG-im', ['thuigim']],
          ['An dtig leat sin a rá arís?', 'Can you say that again?', 'an DIG lat shin a RAW a-REESH', ['dtig', 'arís']],
          ['Níos moille, le do thoil.', 'Slower, please.', 'nees MWIL-ya leh duh HUL', ['moille']],
          ['Tá beagán Gaeilge agam.', 'I have a little Irish.', 'taw BYUG-awn GAYL-ik-ya AH-gum', ['beagán', 'Gaeilge']]
        ],
        drills: [
          ['I don’t understand.', 'Ní thuigim.'],
          ['Slower, please.', 'Níos moille, le do thoil.'],
          ['Can you say that again?', 'An dtig leat sin a rá arís?'],
          ['I have a little Irish.', 'Tá beagán Gaeilge agam.']
        ],
        chat: { scene: 'Gráinne speaks a bit fast. Keep the chat going in Irish.', opener: 'An bhfuil tú ag foghlaim Gaeilge le fada?', openerEn: 'Have you been learning Irish long?',
          goals: [['slow', 'Ask her to repeat or slow down'], ['little', 'Say you have a little Irish'], ['thanks', 'Thank her']] }
      },
      { id: 'u1-l5', ga: 'Slán go fóill!', en: 'Goodbyes', goal: 'Close a chat warmly and arrange to meet again',
        phrases: [
          ['Slán.', 'Bye.', 'slawn', ['slán']],
          ['Slán go fóill.', 'Bye for now.', 'slawn guh FOE-il', ['fóill']],
          ['Bhí sé go deas caint leat.', 'It was nice talking to you.', 'vee shay guh JASS kanch lat', ['deas', 'caint']],
          ['Feicfidh mé ar ball thú.', 'See you later.', 'FECK-ee may er BAL hoo', ['feicfidh', 'ball']],
          ['Feicfidh mé amárach thú.', 'See you tomorrow.', 'FECK-ee may a-MAW-rakh hoo', ['amárach']],
          ['Tóg go bog é.', 'Take it easy.', 'tog guh BUG ay', ['bog']],
          ['Go n-éirí leat.', 'Good luck.', 'guh NYE-ree lat', ['éirí']],
          ['Oíche mhaith.', 'Good night.', 'EE-ha WAH', ['oíche']]
        ],
        drills: [
          ['See you tomorrow.', 'Feicfidh mé amárach thú.'],
          ['Bye for now.', 'Slán go fóill.'],
          ['It was nice talking to you.', 'Bhí sé go deas caint leat.'],
          ['Good night.', 'Oíche mhaith.']
        ],
        chat: { scene: 'Gráinne has to head off. Say goodbye properly.', opener: 'Caithfidh mé imeacht.', openerEn: 'I have to go.',
          goals: [['nice', 'Say it was nice talking'], ['when', 'Say when you’ll see her'], ['bye', 'Say goodbye']] }
      },
      { id: 'u1-cp', checkpoint: true, ga: 'Comhrá mór', en: 'Checkpoint: the big chat', goal: 'A 3-minute chat using the whole unit',
        chat: { scene: 'You walk into an Irish-language café in Belfast. Gráinne, visiting from Donegal, is at the next table.', opener: 'Dia duit! Cad é mar atá tú?', openerEn: 'Hello! How are you?',
          goals: [['greet', 'Greet her and say how you are'], ['names', 'Swap names'], ['from', 'Say where you’re from and live'], ['repeat', 'Ask her to repeat or slow down'], ['bye', 'Say goodbye and when you’ll meet again']] }
      }
    ]
  }
];
