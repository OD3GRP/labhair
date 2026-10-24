// Labhair course content. Ulster Irish (Gaeilge Uladh), standard spelling.
// Each phrase: [Irish, English, sound-it-out, [words to hear on teanglann.ie], {lit, why}]
//   lit = the literal meaning, why = how or why it's built that way (shown by An Spideog, the advisor).
// Each drill:  [English prompt, Irish answer]
// Add new units to the end of UNITS; lesson ids must stay unique and stable (progress is keyed on them).
// Lines marked ⚠ in IRISH-CHECK.md are worth checking with a native speaker.

window.LEARNER = { ga: 'Stiofán', vocative: 'a Stiofáin', en: 'Stephen' };

window.UNITS = [
  {
    id: 'u1', num: 1, ga: 'Beannachtaí', en: 'Greetings',
    lessons: [
      { id: 'u1-l1', ga: 'Dia duit!', en: 'Hello', goal: 'Greet someone and ask how they are',
        phrases: [
          ['Dia duit.', 'Hello.', 'JEE-a gwit', ['Dia', 'duit'], {lit:'God to you', why:'Irish greets with a blessing. “duit” is do + tú (to you): Irish fuses little words like “to” with “you”.'}],
          ['Dia is Muire duit.', 'Hello (the reply).', 'JEE-a iss MWIR-a gwit', ['Muire'], {lit:'God and Mary to you', why:'The reply goes one better and adds Mary. “is” here is a short form of “agus” (and).'}],
          ['Cad é mar atá tú?', 'How are you?', 'ka-JAY mar a-TAW too', ['atá'], {lit:'What is it how you are?', why:'This is the Ulster “how are you”. Connacht says “Cén chaoi a bhfuil tú?”, Munster “Conas atá tú?”.'}],
          ['Tá mé go maith.', 'I’m well.', 'taw may guh MAH', ['maith'], {lit:'Am I well', why:'Irish puts the verb first: Tá (am/is) + mé (I). “go” before a describing word works like English “-ly”.'}],
          ['Tá mé go breá.', 'I’m grand.', 'taw may guh BRAW', ['breá'], {lit:'I am finely', why:'Same frame as “Tá mé go maith”: swap the last word to say how you are.'}],
          ['Níl mé ró-dhona.', 'Not too bad.', 'neel may roe-GHUN-a', ['dona'], {lit:'I am not too bad', why:'“Níl” is the “not” form of Tá. “ró” (too) softens the next word: dona → dhona. That softening, an h after the first letter, is called lenition.'}],
          ['Agus tú féin?', 'And yourself?', 'AH-gus too HAYN', ['féin'], {lit:'And you self?', why:'“féin” means “self” and adds emphasis, just like “…and yourself?” in Ulster English.'}]
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
          ['Cad é an t-ainm atá ort?', 'What’s your name?', 'ka-JAY an TAN-im a-TAW urt', ['ainm', 'ort'], {lit:'What is the name that is on you?', why:'In Irish a name is “on” you. “ort” is ar + tú (on you). A t- goes before a vowel after “an” with words like ainm.'}],
          ['Stiofán an t-ainm atá orm.', 'My name is Stephen.', 'STIFF-awn an TAN-im a-TAW urum', ['orm'], {lit:'Stephen is the name that is on me', why:'“orm” is ar + mé (on me). Your name goes first.'}],
          ['Is mise Stiofán.', 'I’m Stephen.', 'iss MISH-a STIFF-awn', ['mise'], {lit:'It is me (who is) Stephen', why:'“Is” is the verb for saying who or what something IS, separate from “Tá”. “mise” is the strong form of mé.'}],
          ['Seo Gráinne.', 'This is Gráinne.', 'shuh GRAWN-ya', ['seo'], {lit:'This, Gráinne', why:'“Seo” means this or here. No verb is needed: just Seo + the name.'}],
          ['Tá áthas orm castáil leat.', 'Pleased to meet you.', 'taw AW-hus urum kas-TAWL lat', ['áthas', 'castáil'], {lit:'There is joy on me to meet with you', why:'Feelings sit “on” you in Irish: áthas orm. “leat” is le + tú (with you).'}],
          ['Agus tusa?', 'And you?', 'AH-gus TUSS-a', ['tusa'], {lit:'And you?', why:'“tusa” is the strong form of tú. Use it when you turn a question back.'}]
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
          ['Cá as tú?', 'Where are you from?', 'kaw ass too', ['as'], {lit:'Where from you?', why:'“as” means from (out of). This short question drops the verb altogether.'}],
          ['Is as Aontroim mé.', 'I’m from Antrim.', 'iss ass AYN-trim may', ['Aontroim'], {lit:'It is from Antrim I am', why:'“Is as … mé” is a frame: swap in any place, e.g. Is as Béal Feirste mé.'}],
          ['Cá bhfuil tú i do chónaí?', 'Where do you live?', 'kaw will too uh duh KHOE-nee', ['bhfuil', 'chónaí'], {lit:'Where are you in your dwelling?', why:'“cá” changes fuil → bhfuil (eclipsis: a new sound in front). “do” (your) softens cónaí → chónaí.'}],
          ['Tá mé i mo chónaí in Aontroim.', 'I live in Antrim.', 'taw may uh muh KHOE-nee in AYN-trim', ['chónaí'], {lit:'I am in my dwelling in Antrim', why:'“mo” (my) softens cónaí → chónaí. Before a vowel “i” (in) becomes “in”.'}],
          ['Tá mé i mo chónaí i mBéal Feirste.', 'I live in Belfast.', '… uh MAYL FERSH-cha', ['Béal', 'Feirste'], {lit:'I am in my dwelling in Belfast', why:'“i” (in) eclipses the next word: Béal → mBéal. You say the m, not the b.'}],
          ['Tá mé ag obair i nDoire.', 'I work in Derry.', 'taw may eg OB-ir uh NIR-ya', ['obair', 'Doire'], {lit:'I am at work in Derry', why:'“ag” + an action word gives “-ing”: ag obair = working. “i” eclipses Doire → nDoire (say the n).'}]
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
          ['Le do thoil.', 'Please.', 'leh duh HUL', ['thoil'], {lit:'With your will', why:'“do” (your) softens toil → thoil, so the t turns into an h sound.'}],
          ['Go raibh maith agat.', 'Thank you.', 'guh rev mah AH-gut', ['raibh', 'agat'], {lit:'May there be good at you', why:'It’s a wish: “go raibh” = may there be. “agat” is ag + tú (at you).'}],
          ['Fáilte romhat.', 'You’re welcome.', 'FAWL-cha ROE-ut', ['fáilte', 'romhat'], {lit:'Welcome before you', why:'“romhat” is roimh + tú (before you): the welcome is waiting ahead of you.'}],
          ['Gabh mo leithscéal.', 'Excuse me / sorry.', 'go muh LESH-kayl', ['gabh', 'leithscéal'], {lit:'Accept my excuse', why:'You’re asking them to accept your excuse. “Gabh” = take, accept.'}],
          ['Ní thuigim.', 'I don’t understand.', 'nee HIG-im', ['thuigim'], {lit:'I don’t understand', why:'“Ní” (not) softens the verb: tuigim → thuigim. The ending -im means “I”.'}],
          ['An dtig leat sin a rá arís?', 'Can you say that again?', 'an DIG lat shin a RAW a-REESH', ['dtig', 'arís'], {lit:'Does it come with you to say that again?', why:'“An dtig leat…?” is the Ulster “can you…?”. The question word “An” eclipses tig → dtig. Elsewhere you’ll hear “An féidir leat…?”.'}],
          ['Níos moille, le do thoil.', 'Slower, please.', 'nees MWIL-ya leh duh HUL', ['moille'], {lit:'More slow, please', why:'“níos” + a describing word makes “-er”: mall (slow) → níos moille (slower).'}],
          ['Tá beagán Gaeilge agam.', 'I have a little Irish.', 'taw BYUG-awn GAYL-ik-ya AH-gum', ['beagán', 'Gaeilge'], {lit:'A little Irish is at me', why:'Irish has no verb “to have”: things are “at” you. agam = ag + mé.'}]
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
          ['Slán.', 'Bye.', 'slawn', ['slán'], {lit:'Safe', why:'Goodbye is literally “safe”, as in go safely.'}],
          ['Slán go fóill.', 'Bye for now.', 'slawn guh FOE-il', ['fóill'], {lit:'Safe for now', why:'“go fóill” = for now, yet. A very Ulster way to say bye.'}],
          ['Bhí sé go deas caint leat.', 'It was nice talking to you.', 'vee shay guh JASS kanch lat', ['deas', 'caint'], {lit:'It was nicely talking with you', why:'“Bhí” is the past of Tá. “leat” is le + tú (with you).'}],
          ['Feicfidh mé ar ball thú.', 'See you later.', 'FECK-ee may er BAL hoo', ['feicfidh', 'ball'], {lit:'I will see you in a while', why:'The ending -fidh makes the future. “thú” is tú when it’s the one being seen.'}],
          ['Feicfidh mé amárach thú.', 'See you tomorrow.', 'FECK-ee may a-MAW-rakh hoo', ['amárach'], {lit:'I will see you tomorrow', why:'A frame: Feicfidh mé … thú. Swap in amárach, ar ball, Dé Luain.'}],
          ['Tóg go bog é.', 'Take it easy.', 'tog guh BUG ay', ['bog'], {lit:'Take it softly', why:'“go bog” = softly. The “é” (it) goes to the end in Irish.'}],
          ['Go n-éirí leat.', 'Good luck.', 'guh NYE-ree lat', ['éirí'], {lit:'May it rise with you', why:'A wish for success. “Go” (may) puts n- in front of a vowel: n-éirí.'}],
          ['Oíche mhaith.', 'Good night.', 'EE-ha WAH', ['oíche'], {lit:'Night good', why:'The describing word comes after the noun. Oíche is feminine, so maith softens to mhaith.'}]
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
  },

  {
    id: 'u2', num: 2, ga: 'An Teaghlach', en: 'Family',
    lessons: [
      { id: 'u2-l1', ga: 'Seo mo mháthair', en: 'Family members', goal: 'Introduce the people in your family',
        phrases: [
          ['Cé seo?', 'Who’s this?', 'kay SHUH', ['seo'], {lit:'Who this?', why:'No verb needed: Cé (who) + seo (this).'}],
          ['Seo mo mháthair.', 'This is my mother.', 'shuh muh WAW-hir', ['máthair'], {lit:'This, my mother', why:'“mo” (my) softens the next word: máthair → mháthair. “mh” sounds like a w here.'}],
          ['Seo m’athair.', 'This is my father.', 'shuh MAH-hir', ['athair'], {lit:'This, my father', why:'Before a vowel “mo” shrinks to m’: m’athair.'}],
          ['Seo mo dheartháir.', 'This is my brother.', 'shuh muh YAR-haw-ir', ['deartháir'], {lit:'This, my brother', why:'“mo” softens deartháir → dheartháir. “dh” before e sounds like a y.'}],
          ['Seo mo dheirfiúr.', 'This is my sister.', 'shuh muh YER-uh-fyoor', ['deirfiúr'], {lit:'This, my sister', why:'Same softening after mo: deirfiúr → dheirfiúr.'}],
          ['Seo mo bhean chéile.', 'This is my wife.', 'shuh muh van HAY-la', ['bean', 'céile'], {lit:'This, my woman of partnership', why:'bean chéile = wife (céile = partner). After “mo”, bean → bhean (bh = v). Bean is feminine, so céile softens too.'}],
          ['Seo m’fhear céile.', 'This is my husband.', 'shuh mar KAY-la', ['fear', 'céile'], {lit:'This, my man of partnership', why:'fear → fhear after mo, and “fh” is silent, so mo shrinks to m’ as if before a vowel.'}],
          ['Seo mo pháistí.', 'These are my children.', 'shuh muh FAWSH-chee', ['páistí'], {lit:'This, my children', why:'“mo” softens p → ph, which sounds like f: páistí → pháistí.'}]
        ],
        drills: [
          ['This is my brother.', 'Seo mo dheartháir.'],
          ['This is my mother.', 'Seo mo mháthair.'],
          ['This is my father.', 'Seo m’athair.'],
          ['Who’s this?', 'Cé seo?']
        ],
        chat: { scene: 'Gráinne shows you photos of her family on her phone, then asks about yours.', opener: 'Seo mo mháthair agus m’athair. Agus cé seo i do ghrianghraf?', openerEn: 'This is my mother and father. And who’s this in your photo?',
          goals: [['who', 'Say who someone in your family is'], ['ask', 'Ask “Cé seo?” about one of her photos'], ['two', 'Introduce two family members']] }
      },
      { id: 'u2-l2', ga: 'Tá deartháir agam', en: 'Brothers, sisters, children', goal: 'Say who you have and don’t have',
        phrases: [
          ['Tá deartháir agam.', 'I have a brother.', 'taw JAR-haw-ir AH-gum', ['deartháir'], {lit:'A brother is at me', why:'No verb “to have” in Irish: things are “at” you. Tá … agam = I have.'}],
          ['Tá beirt deirfiúracha agam.', 'I have two sisters.', 'taw bersh JER-fyoor-a-ha AH-gum', ['beirt', 'deirfiúracha'], {lit:'Two sisters are at me', why:'“beirt” is the word for two people. It softens most words after it, but not ones starting with d, t or s.'}],
          ['Níl deartháir ar bith agam.', 'I don’t have any brothers.', 'neel JAR-haw-ir er BIH AH-gum', ['bith'], {lit:'There isn’t a brother at all at me', why:'“ar bith” = any, at all. Níl is the “not” of Tá.'}],
          ['An bhfuil páistí agat?', 'Do you have children?', 'an will PAWSH-chee AH-gut', ['páistí'], {lit:'Are children at you?', why:'“An” makes a question and eclipses fuil → bhfuil. agat = ag + tú (at you).'}],
          ['Tá, tá beirt pháistí agam.', 'Yes, I have two children.', 'taw, taw bersh FAWSH-chee AH-gum', ['beirt'], {lit:'Am, two children are at me', why:'Irish has no single word for yes. You answer with the verb: Tá (is) or Níl (isn’t). “beirt” softens páistí → pháistí.'}],
          ['Níl, níl páistí agam.', 'No, I don’t have children.', 'neel, neel PAWSH-chee AH-gum', ['níl'], {lit:'Isn’t, children aren’t at me', why:'The “no” answer repeats the negative verb: Níl.'}],
          ['Tá mé pósta.', 'I’m married.', 'taw may POE-sta', ['pósta'], {lit:'I am married', why:'Tá mé + a describing word, the same frame as Tá mé go maith (without the “go”).'}]
        ],
        drills: [
          ['I have a sister.', 'Tá deirfiúr agam.'],
          ['I have two brothers.', 'Tá beirt deartháireacha agam.'],
          ['Do you have a brother?', 'An bhfuil deartháir agat?'],
          ['I don’t have any sisters.', 'Níl deirfiúr ar bith agam.']
        ],
        chat: { scene: 'Over a cup of tea, Gráinne asks about your brothers and sisters.', opener: 'An bhfuil deartháireacha nó deirfiúracha agat?', openerEn: 'Do you have brothers or sisters?',
          goals: [['sibs', 'Say which brothers or sisters you have'], ['askher', 'Ask if she has any'], ['kids', 'Say whether you have children']] }
      },
      { id: 'u2-l3', ga: 'Cá haois atá sé?', en: 'Names and ages', goal: 'Give names and ages',
        phrases: [
          ['Cad é an t-ainm atá air?', 'What’s his name?', 'ka-JAY an TAN-im a-TAW er', ['air'], {lit:'What is the name that is on him?', why:'Names are “on” people: air = on him, uirthi = on her.'}],
          ['Seán an t-ainm atá air.', 'His name is Seán.', 'SHAWN an TAN-im a-TAW er', ['Seán'], {lit:'Seán is the name that is on him', why:'The same frame you used for your own name, with air (on him).'}],
          ['Cad é an t-ainm atá uirthi?', 'What’s her name?', 'ka-JAY an TAN-im a-TAW ER-ha', ['uirthi'], {lit:'What is the name that is on her?', why:'uirthi = ar + í (on her).'}],
          ['Cá haois atá sé?', 'How old is he?', 'kaw HEESH a-TAW shay', ['aois'], {lit:'What age is he?', why:'“Cá” puts an h in front of a vowel: aois → haois. Ulster says Cá haois; elsewhere you’ll hear Cén aois.'}],
          ['Tá sé deich mbliana d’aois.', 'He’s ten.', 'taw shay jeh MLEE-a-na DEESH', ['bliana', 'aois'], {lit:'He is ten years of age', why:'7 to 10 eclipse the next word: bliana → mbliana (say the m).'}],
          ['Tá sí sé bliana d’aois.', 'She’s six.', 'taw shee shay BLEE-a-na DEESH', ['bliana'], {lit:'She is six years of age', why:'3 to 6 take “bliana” with no change. sí = she, sé = he (and six, said the same way!).'}],
          ['Cá haois atá tú?', 'How old are you?', 'kaw HEESH a-TAW too', ['aois'], {lit:'What age are you?', why:'The same question, with tú. It’s polite to ask kids, maybe not adults!'}],
          ['Tá mé daichead bliain d’aois.', 'I’m forty.', 'taw may DAH-hud BLEE-in DEESH', ['daichead', 'bliain'], {lit:'I am forty year of age', why:'With round numbers like 20, 30 and 40, “bliain” stays singular.'}]
        ],
        drills: [
          ['Her name is Áine.', 'Áine an t-ainm atá uirthi.'],
          ['How old is she?', 'Cá haois atá sí?'],
          ['He’s eight.', 'Tá sé ocht mbliana d’aois.'],
          ['She’s five.', 'Tá sí cúig bliana d’aois.']
        ],
        chat: { scene: 'Gráinne asks about the young ones in your family.', opener: 'An bhfuil páistí i do theaghlach?', openerEn: 'Are there children in your family?',
          goals: [['name', 'Give someone’s name'], ['age', 'Say how old they are'], ['ask', 'Ask her how old someone is']] }
      },
      { id: 'u2-l4', ga: 'Tá sé ard', en: 'Describing people', goal: 'Say what people look like and what they’re like',
        phrases: [
          ['Tá sé ard.', 'He’s tall.', 'taw shay ARD', ['ard'], {lit:'He is tall', why:'Tá + sé/sí + a describing word. No “go” needed here.'}],
          ['Tá sí beag.', 'She’s small.', 'taw shee BYUG', ['beag'], {lit:'She is small', why:'Swap sé for sí to talk about a woman.'}],
          ['Tá gruaig dhonn uirthi.', 'She has brown hair.', 'taw GROO-ig GHUN ER-ha', ['gruaig', 'donn'], {lit:'Brown hair is on her', why:'Looks are “on” you. Gruaig is feminine, so donn softens to dhonn.'}],
          ['Tá féasóg air.', 'He has a beard.', 'taw FAY-sog er', ['féasóg'], {lit:'A beard is on him', why:'Same frame: Tá … air / uirthi.'}],
          ['Tá sé greannmhar.', 'He’s funny.', 'taw shay GRAN-war', ['greannmhar'], {lit:'He is funny', why:'greann = fun; -mhar makes it a describing word, like English “-ful”.'}],
          ['Tá sí cineálta.', 'She’s kind.', 'taw shee KIN-yawl-ta', ['cineálta'], {lit:'She is kind', why:'Tá sí + describing word, the same frame again.'}],
          ['Tá siad cosúil le chéile.', 'They’re alike.', 'taw SHEE-ud KUS-ool leh HAY-la', ['cosúil', 'chéile'], {lit:'They are like each other', why:'“le chéile” = with each other, together. You’ll hear it everywhere.'}]
        ],
        drills: [
          ['She’s tall.', 'Tá sí ard.'],
          ['He has brown hair.', 'Tá gruaig dhonn air.'],
          ['She’s funny.', 'Tá sí greannmhar.'],
          ['He’s kind.', 'Tá sé cineálta.']
        ],
        chat: { scene: 'Gráinne is picking your sister up off the bus and needs to know what she looks like.', opener: 'Cad é an chuma atá ar do dheirfiúr?', openerEn: 'What does your sister look like?',
          goals: [['size', 'Say if she’s tall or small'], ['hair', 'Describe her hair'], ['nature', 'Say what she’s like (funny, kind)']] }
      },
      { id: 'u2-l5', ga: 'Mo theaghlach', en: 'My family', goal: 'Talk about your own family',
        phrases: [
          ['Tá teaghlach mór agam.', 'I have a big family.', 'taw CHAH-lakh MORE AH-gum', ['teaghlach'], {lit:'A big family is at me', why:'The describing word comes after the noun: teaghlach mór.'}],
          ['Tá mo thuismitheoirí ina gcónaí i mBéal Feirste.', 'My parents live in Belfast.', 'taw muh HISH-mi-hyor-ee in-a GOE-nee uh MAYL FERSH-cha', ['tuismitheoirí'], {lit:'My parents are in their dwelling in Belfast', why:'ina gcónaí = in their living. For him it’s ina chónaí, for her ina cónaí.'}],
          ['Tá mo dheartháir ag obair i Sasana.', 'My brother works in England.', 'taw muh YAR-haw-ir eg OB-ir uh SASS-a-na', ['Sasana'], {lit:'My brother is at work in England', why:'The same “ag obair” frame from Unit 1.'}],
          ['Is breá liom mo theaghlach.', 'I love my family.', 'iss BRAW lum muh HAH-lakh', ['breá'], {lit:'My family is fine with me', why:'Liking is “with” you in Irish: Is maith liom (I like), Is breá liom (I love).'}],
          ['Feicim go minic iad.', 'I see them often.', 'FECK-im guh MIN-ik EE-ud', ['minic'], {lit:'I see often them', why:'-im on the verb = I. The “them” (iad) tends to go at the end.'}],
          ['Tá muid an-mhór le chéile.', 'We’re very close.', 'taw MWIDJ an-WORE leh HAY-la', ['mór', 'chéile'], {lit:'We are very big with each other', why:'“mór le” means friendly with. “Tá muid” (we are) is the Ulster form; you’ll also see “Táimid”.'}]
        ],
        drills: [
          ['My sister lives in Derry.', 'Tá mo dheirfiúr ina cónaí i nDoire.'],
          ['I see her often.', 'Feicim go minic í.'],
          ['I love my brother.', 'Is breá liom mo dheartháir.'],
          ['My parents live in Antrim.', 'Tá mo thuismitheoirí ina gcónaí in Aontroim.']
        ],
        chat: { scene: 'Gráinne wants to hear all about your family.', opener: 'Inis dom faoi do theaghlach.', openerEn: 'Tell me about your family.',
          goals: [['size', 'Say if your family is big or small'], ['where', 'Say where someone lives'], ['warm', 'Say something warm about them']] }
      },
      { id: 'u2-cp', checkpoint: true, ga: 'Comhrá mór', en: 'Checkpoint: the family wedding', goal: 'A 3-minute chat using the whole unit',
        chat: { scene: 'At a family wedding in Gaoth Dobhair, Gráinne sits beside you, her phone full of photos.', opener: 'Dia duit! Cé seo i do ghrianghraf?', openerEn: 'Hello! Who’s this in your photo?',
          goals: [['who', 'Say who someone is'], ['have', 'Say which brothers, sisters or children you have'], ['age', 'Give a name and an age'], ['look', 'Describe someone'], ['askher', 'Ask about her family']] }
      }
    ]
  },

  {
    id: 'u3', num: 3, ga: 'An Aimsir', en: 'The weather',
    lessons: [
      { id: 'u3-l1', ga: 'Cad é mar atá an aimsir?', en: 'Weather words', goal: 'Say what the weather’s like',
        phrases: [
          ['Cad é mar atá an aimsir?', 'What’s the weather like?', 'ka-JAY mar a-TAW an AM-shir', ['aimsir'], {lit:'What is it how the weather is?', why:'The same frame as “Cad é mar atá tú?”, with an aimsir (the weather).'}],
          ['Tá sé fuar.', 'It’s cold.', 'taw shay FOO-ur', ['fuar'], {lit:'It is cold', why:'Weather uses “sé” (it): Tá sé + a describing word.'}],
          ['Tá sé te.', 'It’s hot.', 'taw shay CHEH', ['te'], {lit:'It is hot', why:'Same frame. te sounds like “cheh”.'}],
          ['Tá sé fliuch.', 'It’s wet.', 'taw shay FLUKH', ['fliuch'], {lit:'It is wet', why:'Same frame. The “ch” is throaty, as in “loch”.'}],
          ['Tá sé tirim.', 'It’s dry.', 'taw shay CHIR-im', ['tirim'], {lit:'It is dry', why:'Same frame.'}],
          ['Tá sé grianmhar.', 'It’s sunny.', 'taw shay GREE-un-war', ['grianmhar'], {lit:'It is sunny', why:'grian = sun; -mhar makes a describing word (like grianmhar, greannmhar).'}],
          ['Tá sé gaofar.', 'It’s windy.', 'taw shay GWEE-far', ['gaofar'], {lit:'It is windy', why:'gaoth = wind; gaofar = windy.'}],
          ['Tá lá breá ann.', 'It’s a fine day.', 'taw law BRAW un', ['lá', 'breá'], {lit:'There’s a fine day in it', why:'“ann” (in it) means “there is”: Tá lá breá ann = there’s a fine day.'}]
        ],
        drills: [
          ['It’s cold.', 'Tá sé fuar.'],
          ['It’s windy.', 'Tá sé gaofar.'],
          ['It’s a fine day.', 'Tá lá breá ann.'],
          ['What’s the weather like?', 'Cad é mar atá an aimsir?']
        ],
        chat: { scene: 'You meet Gráinne on the road. Weather talk comes first, always.', opener: 'Nach breá an lá é!', openerEn: 'Isn’t it a fine day!',
          goals: [['describe', 'Say what the weather’s like'], ['ask', 'Ask her about the weather where she was'], ['fine', 'Say it’s a fine (or not so fine) day']] }
      },
      { id: 'u3-l2', ga: 'Tá sé ag cur fearthainne', en: 'Rain, wind and sun', goal: 'Say what the weather is doing',
        phrases: [
          ['Tá sé ag cur fearthainne.', 'It’s raining.', 'taw shay eg kur FAR-hin-ya', ['fearthainn'], {lit:'It is putting rain', why:'Weather “puts” rain and snow. fearthainn is the Ulster word for rain; elsewhere you’ll hear báisteach.'}],
          ['Tá sé ag cur sneachta.', 'It’s snowing.', 'taw shay eg kur SHNAKH-ta', ['sneachta'], {lit:'It is putting snow', why:'The same “ag cur” frame.'}],
          ['Tá sé ag séideadh.', 'It’s blowing a gale.', 'taw shay eg SHAY-jeh', ['séideadh'], {lit:'It is blowing', why:'ag + action word = -ing.'}],
          ['Tá ceo ann.', 'It’s foggy.', 'taw KYOH un', ['ceo'], {lit:'There is fog in it', why:'Tá … ann = there is.'}],
          ['Tá an ghrian ag taitneamh.', 'The sun is shining.', 'taw an GHREE-un eg TAT-ny-uv', ['grian', 'taitneamh'], {lit:'The sun is at shining', why:'Grian is feminine, so “an” softens it: an ghrian.'}],
          ['Tá sé ag glanadh.', 'It’s clearing up.', 'taw shay eg GLAN-oo', ['glanadh'], {lit:'It is cleaning', why:'The sky is “cleaning” itself. A lovely Ulster weather phrase.'}],
          ['Tá sé dorcha.', 'It’s dark.', 'taw shay DUR-a-ha', ['dorcha'], {lit:'It is dark', why:'Back to the Tá sé + describing word frame.'}]
        ],
        drills: [
          ['It’s snowing.', 'Tá sé ag cur sneachta.'],
          ['The sun is shining.', 'Tá an ghrian ag taitneamh.'],
          ['It’s foggy.', 'Tá ceo ann.'],
          ['It’s clearing up.', 'Tá sé ag glanadh.']
        ],
        chat: { scene: 'You and Gráinne planned a walk on Machaire Rabhartaigh beach. Look at that sky.', opener: 'Ó, tá sé ag cur fearthainne arís!', openerEn: 'Oh, it’s raining again!',
          goals: [['now', 'Say what the weather is doing'], ['clear', 'Say it’s clearing up, or the sun is shining'], ['other', 'Use another weather word (fog, wind, dark)']] }
      },
      { id: 'u3-l3', ga: 'Tá fuacht orm', en: 'Feeling the weather', goal: 'Say how the weather makes you feel, and what’s coming',
        phrases: [
          ['Tá fuacht orm.', 'I’m cold.', 'taw FOO-ukht urum', ['fuacht'], {lit:'Cold is on me', why:'Feelings sit “on” you: fuacht orm. You’ll hear “Tá mé fuar” too, but “fuacht orm” is the natural Irish.'}],
          ['Tá teas orm.', 'I’m hot.', 'taw CHASS urum', ['teas'], {lit:'Heat is on me', why:'Same frame: Tá … orm.'}],
          ['Tá mé fliuch go craiceann.', 'I’m soaked to the skin.', 'taw may FLUKH guh KRACK-un', ['craiceann'], {lit:'I am wet to the skin', why:'Just like the English.'}],
          ['Cuir ort do chóta.', 'Put on your coat.', 'kur urt duh KHO-ta', ['cóta'], {lit:'Put on you your coat', why:'Clothes go “on you”: cuir ort. do (your) softens cóta → chóta.'}],
          ['Tá scáth fearthainne agam.', 'I have an umbrella.', 'taw skaw FAR-hin-ya AH-gum', ['scáth'], {lit:'A rain shade is at me', why:'An umbrella is a “rain shade”. Tá … agam = I have.'}],
          ['Beidh sé fuar amárach.', 'It’ll be cold tomorrow.', 'beh shay FOO-ur a-MAW-rakh', ['beidh'], {lit:'It will be cold tomorrow', why:'Beidh is the future of Tá. Same frame, new time.'}],
          ['Beidh sé grianmhar ag an deireadh seachtaine.', 'It’ll be sunny at the weekend.', 'beh shay GREE-un-war eg an JER-oo SHAKH-tin-a', ['deireadh', 'seachtaine'], {lit:'It will be sunny at the end of the week', why:'deireadh seachtaine = weekend (end of week).'}]
        ],
        drills: [
          ['I’m hot.', 'Tá teas orm.'],
          ['It’ll be wet tomorrow.', 'Beidh sé fliuch amárach.'],
          ['Put on your coat.', 'Cuir ort do chóta.'],
          ['I’m cold.', 'Tá fuacht orm.']
        ],
        chat: { scene: 'Gráinne is heading out and wants your advice on the weather.', opener: 'An mbeidh sé fuar inniu, meas tú?', openerEn: 'Will it be cold today, do you think?',
          goals: [['tomorrow', 'Say what the weather will be like'], ['feel', 'Say if you’re cold or hot'], ['coat', 'Tell her to put on her coat']] }
      },
      { id: 'u3-l4', ga: 'Is maith liom an samhradh', en: 'The seasons', goal: 'Talk about the seasons and what they’re usually like',
        phrases: [
          ['Is maith liom an samhradh.', 'I like summer.', 'iss MAH lum an SOW-roo', ['samhradh'], {lit:'Summer is good with me', why:'Liking is “with” you: Is maith liom … . You’ll use this frame a lot in Unit 6.'}],
          ['Ní maith liom an geimhreadh.', 'I don’t like winter.', 'nee MAH lum an GEV-roo', ['geimhreadh'], {lit:'Winter isn’t good with me', why:'Swap Is for Ní to make it negative.'}],
          ['Bíonn sé fuar sa gheimhreadh.', 'It’s usually cold in winter.', 'BEE-un shay FOO-ur sa YEV-roo', ['bíonn'], {lit:'It is (usually) cold in the winter', why:'Bíonn is the “usually is” form of Tá. Irish has a separate verb for habits! sa softens geimhreadh → gheimhreadh.'}],
          ['Bíonn sé te sa samhradh.', 'It’s usually hot in summer.', 'BEE-un shay CHEH sa SOW-roo', ['samhradh'], {lit:'It is (usually) hot in the summer', why:'After sa, words starting with s don’t change.'}],
          ['Tá an fómhar go hálainn.', 'Autumn is lovely.', 'taw an FOH-ur guh HAW-lin', ['fómhar', 'álainn'], {lit:'The autumn is lovely', why:'“go” puts an h before a vowel: go hálainn.'}],
          ['Tosaíonn an t-earrach i mí Feabhra.', 'Spring starts in February.', 'TUSS-ee-un an CHAR-akh uh mee FOW-ra', ['earrach', 'Feabhra'], {lit:'The spring starts in the month of February', why:'In Ireland spring starts on Lá Fhéile Bríde, 1 February. “an t-earrach”: t- before a vowel again.'}]
        ],
        drills: [
          ['I like autumn.', 'Is maith liom an fómhar.'],
          ['It’s usually wet in winter.', 'Bíonn sé fliuch sa gheimhreadh.'],
          ['I don’t like summer.', 'Ní maith liom an samhradh.'],
          ['Spring is lovely.', 'Tá an t-earrach go hálainn.']
        ],
        chat: { scene: 'Sitting by the fire, Gráinne asks which time of year you like best.', opener: 'Cén séasúr is fearr leat?', openerEn: 'Which season do you like best?',
          goals: [['like', 'Say which season you like'], ['dislike', 'Say one you don’t like'], ['usually', 'Say what the weather’s usually like then']] }
      },
      { id: 'u3-l5', ga: 'Cad é mar a bheidh an aimsir?', en: 'The forecast and plans', goal: 'Talk about tomorrow’s weather and plan around it',
        phrases: [
          ['Cad é mar a bheidh an aimsir amárach?', 'What will the weather be like tomorrow?', 'ka-JAY mar a VEH an AM-shir a-MAW-rakh', ['bheidh'], {lit:'What is it how the weather will be tomorrow?', why:'“a” softens beidh → bheidh in this kind of question.'}],
          ['Deir siad go mbeidh sé fliuch.', 'They say it’ll be wet.', 'jer SHEE-ud guh MEH shay FLUKH', ['deir'], {lit:'They say that it will be wet', why:'“go” (that) eclipses beidh → mbeidh.'}],
          ['B’fhéidir go mbeidh sé grianmhar.', 'Maybe it’ll be sunny.', 'BAY-jir guh MEH shay GREE-un-war', ['b’fhéidir'], {lit:'It might be that it will be sunny', why:'B’fhéidir go … = maybe. The same eclipsis after go.'}],
          ['Má bhíonn sé tirim, rachaidh muid amach.', 'If it’s dry, we’ll go out.', 'maw VEE-un shay CHIR-im, RAKH-ee mwidj a-MAKH', ['rachaidh', 'amach'], {lit:'If it is dry, we will go out', why:'Má (if) softens bíonn → bhíonn. “rachaidh muid” is the Ulster “we’ll go”.'}],
          ['Fanfaidh muid istigh.', 'We’ll stay in.', 'FAN-ee mwidj ish-CHEE', ['fanfaidh', 'istigh'], {lit:'We will stay inside', why:'-faidh = will. istigh = inside, amuigh = outside.'}],
          ['Níl sé chomh dona sin.', 'It’s not that bad.', 'neel shay khoh DUN-a shin', ['chomh'], {lit:'It isn’t as bad as that', why:'chomh … sin = that (much). A great phrase for Irish weather.'}]
        ],
        drills: [
          ['Maybe it’ll be dry.', 'B’fhéidir go mbeidh sé tirim.'],
          ['We’ll stay in.', 'Fanfaidh muid istigh.'],
          ['They say it’ll be windy.', 'Deir siad go mbeidh sé gaofar.'],
          ['It’s not that cold.', 'Níl sé chomh fuar sin.']
        ],
        chat: { scene: 'You and Gráinne are planning tomorrow.', opener: 'Ar chuala tú cad é mar a bheidh an aimsir amárach?', openerEn: 'Did you hear what the weather will be like tomorrow?',
          goals: [['forecast', 'Say what they say the weather will be'], ['plan', 'Say what you’ll do if it’s dry or wet'], ['maybe', 'Use “B’fhéidir”']] }
      },
      { id: 'u3-cp', checkpoint: true, ga: 'Comhrá mór', en: 'Checkpoint: stuck at the bus stop', goal: 'A 3-minute chat using the whole unit',
        chat: { scene: 'The bus is late and you’re sheltering at the stop with Gráinne, in the rain.', opener: 'Á, nach fliuch an lá é!', openerEn: 'Ah, isn’t it a wet day!',
          goals: [['now', 'Say what the weather is doing'], ['feel', 'Say how you feel (cold, wet)'], ['season', 'Say which season you like'], ['tomorrow', 'Talk about tomorrow’s weather'], ['plan', 'Make a plan that depends on the weather']] }
      }
    ]
  },

  {
    id: 'u4', num: 4, ga: 'Uimhreacha agus am', en: 'Numbers and time',
    lessons: [
      { id: 'u4-l1', ga: 'A haon, a dó, a trí', en: 'Numbers 1–10', goal: 'Count and say how many',
        phrases: [
          ['A haon, a dó, a trí.', 'One, two, three.', 'a HAYN, a DOE, a TREE', ['haon', 'dó', 'trí'], {lit:'One, two, three', why:'When counting, each number gets an “a” in front. haon gets an h after a.'}],
          ['A ceathair, a cúig, a sé.', 'Four, five, six.', 'a KYAH-hir, a KOO-ig, a SHAY', ['ceathair', 'cúig'], {lit:'Four, five, six', why:'The same counting “a”.'}],
          ['A seacht, a hocht, a naoi, a deich.', 'Seven, eight, nine, ten.', 'a SHAKHT, a HUKHT, a NEE, a JEH', ['seacht', 'ocht', 'naoi', 'deich'], {lit:'Seven, eight, nine, ten', why:'hocht gets an h after a, like haon.'}],
          ['Cá mhéad atá ann?', 'How many are there?', 'kaw VAYD a-TAW un', ['méad'], {lit:'What amount is in it?', why:'Ulster says Cá mhéad; you’ll also see Cé mhéad.'}],
          ['Tá trí cinn ann.', 'There are three (of them).', 'taw TREE kin un', ['cinn'], {lit:'Three heads are in it', why:'For counting things, Irish uses cinn (heads, items) after the number.'}],
          ['Uimhir a seacht.', 'Number seven.', 'IV-ir a SHAKHT', ['uimhir'], {lit:'Number seven', why:'Numbers like bus or house numbers keep the counting “a”.'}],
          ['Cad é d’uimhir ghutháin?', 'What’s your phone number?', 'ka-JAY DIV-ir GHU-hawn', ['uimhir', 'guthán'], {lit:'What is your number of phone?', why:'do (your) becomes d’ before a vowel. “Phone number” is “number of phone” in Irish.'}]
        ],
        drills: [
          ['Four, five, six.', 'A ceathair, a cúig, a sé.'],
          ['How many are there?', 'Cá mhéad atá ann?'],
          ['There are two (of them).', 'Tá dhá cheann ann.'],
          ['Number ten.', 'Uimhir a deich.']
        ],
        chat: { scene: 'Gráinne wants to send you photos from the wedding.', opener: 'Cad é d’uimhir ghutháin? Cuirfidh mé na grianghraif chugat.', openerEn: 'What’s your phone number? I’ll send you the photos.',
          goals: [['number', 'Say some numbers (your number, or a made-up one)'], ['many', 'Ask how many photos there are'], ['count', 'Use “cinn” for how many']] }
      },
      { id: 'u4-l2', ga: 'Cad é an t-am atá sé?', en: 'Telling the time', goal: 'Ask and tell the time',
        phrases: [
          ['Cad é an t-am atá sé?', 'What time is it?', 'ka-JAY an TOWM a-TAW shay', ['am'], {lit:'What is the time it is?', why:'an t-am: t- before a vowel again.'}],
          ['Tá sé a trí a chlog.', 'It’s three o’clock.', 'taw shay a TREE a KHLUG', ['clog'], {lit:'It is three of the clock', why:'a chlog = o’clock, literally “of the clock”.'}],
          ['Tá sé leath i ndiaidh a dó.', 'It’s half past two.', 'taw shay LYAH uh NEE-ee a DOE', ['leath', 'diaidh'], {lit:'It is half after two', why:'i ndiaidh = after (past). You’ll hear tar éis in other places.'}],
          ['Tá sé ceathrú i ndiaidh a cúig.', 'It’s quarter past five.', 'taw shay KYAH-roo uh NEE-ee a KOO-ig', ['ceathrú'], {lit:'It is a quarter after five', why:'The same i ndiaidh frame.'}],
          ['Tá sé ceathrú go dtí a sé.', 'It’s quarter to six.', 'taw shay KYAH-roo guh JEE a SHAY', ['dtí'], {lit:'It is a quarter until six', why:'go dtí = until, to.'}],
          ['Ar a hocht a chlog.', 'At eight o’clock.', 'er a HUKHT a KHLUG', ['ocht'], {lit:'On eight of the clock', why:'“At” a time is “ar” (on) in Irish.'}],
          ['Tá mé mall!', 'I’m late!', 'taw may MAL', ['mall'], {lit:'I am slow', why:'mall = slow and late. Remember níos moille (slower)?'}]
        ],
        drills: [
          ['It’s one o’clock.', 'Tá sé a haon a chlog.'],
          ['It’s half past four.', 'Tá sé leath i ndiaidh a ceathair.'],
          ['At nine o’clock.', 'Ar a naoi a chlog.'],
          ['I’m late!', 'Tá mé mall!']
        ],
        chat: { scene: 'You’re meeting Gráinne for the train and she’s checking the time.', opener: 'Cad é an t-am atá sé? Tá an traein ag imeacht ar a deich.', openerEn: 'What time is it? The train leaves at ten.',
          goals: [['time', 'Tell her the time'], ['at', 'Say a time using “ar”'], ['late', 'Say someone is late']] }
      },
      { id: 'u4-l3', ga: 'Dé Luain, Dé Máirt', en: 'Days of the week', goal: 'Name the days and say when things happen',
        phrases: [
          ['Cén lá atá ann inniu?', 'What day is it today?', 'kayn LAW a-TAW un IN-yoo', ['inniu'], {lit:'What day is in it today?', why:'Tá … ann = there is. Cén = which, what.'}],
          ['Inniu an Luan.', 'Today is Monday.', 'IN-yoo an LOO-un', ['Luan'], {lit:'Today (is) the Monday', why:'To say what day it is: Inniu an Luan / an Mháirt / an Aoine.'}],
          ['Dé Luain, Dé Máirt, Dé Céadaoin.', 'Monday, Tuesday, Wednesday.', 'jay LOO-in, jay MAWRCH, jay KAY-deen', ['Céadaoin'], {lit:'On Monday, on Tuesday, on Wednesday', why:'“Dé” is used for “on (a day)”. Céadaoin means “first fast”!'}],
          ['Déardaoin, Dé hAoine.', 'Thursday, Friday.', 'JAYR-deen, jay HEEN-ya', ['Déardaoin', 'Aoine'], {lit:'Day between fasts, on Fast-day', why:'Dé puts an h before Aoine. Déardaoin is one word.'}],
          ['Dé Sathairn, Dé Domhnaigh.', 'Saturday, Sunday.', 'jay SAH-harn, jay DOH-nee', ['Sathairn', 'Domhnaigh'], {lit:'On Saturn’s day, on the Lord’s day', why:'Old names: Saturn’s day and the Lord’s day.'}],
          ['Bím ag obair Dé Luain.', 'I work on Mondays.', 'beem eg OB-ir jay LOO-in', ['bím'], {lit:'I am (usually) at work on Monday', why:'Bím is the habit form (I usually am). It turns any “ag” phrase into a routine.'}],
          ['Feicfidh mé Dé hAoine thú.', 'See you on Friday.', 'FECK-ee may jay HEEN-ya hoo', ['feicfidh'], {lit:'I will see you on Friday', why:'Your Unit 1 goodbye frame, with a day slotted in.'}]
        ],
        drills: [
          ['Today is Friday.', 'Inniu an Aoine.'],
          ['See you on Saturday.', 'Feicfidh mé Dé Sathairn thú.'],
          ['I work on Tuesdays.', 'Bím ag obair Dé Máirt.'],
          ['What day is it today?', 'Cén lá atá ann inniu?']
        ],
        chat: { scene: 'Gráinne is trying to find a day you’re both free.', opener: 'An mbeidh tú saor an tseachtain seo?', openerEn: 'Will you be free this week?',
          goals: [['day', 'Name a day'], ['work', 'Say which days you work'], ['meet', 'Say which day you’ll see her']] }
      },
      { id: 'u4-l4', ga: 'Éirím ar a seacht', en: 'Your day', goal: 'Describe your daily routine with times',
        phrases: [
          ['Éirím ar a seacht a chlog.', 'I get up at seven.', 'AY-rim er a SHAKHT a KHLUG', ['éirím'], {lit:'I rise on seven of the clock', why:'-im = I, for the present and for habits.'}],
          ['Tosaím ag obair ar a naoi.', 'I start work at nine.', 'TUSS-eem eg OB-ir er a NEE', ['tosaím'], {lit:'I start at work on nine', why:'The same -im ending.'}],
          ['Ithim mo dhinnéar ar a sé.', 'I eat my dinner at six.', 'IH-im muh YIN-yar er a SHAY', ['ithim', 'dinnéar'], {lit:'I eat my dinner on six', why:'mo softens dinnéar → dhinnéar (dh = y).'}],
          ['Téim a luí ar a haon déag.', 'I go to bed at eleven.', 'chaym a LEE er a HAYN jayg', ['téim', 'luí'], {lit:'I go to lying on eleven', why:'a luí = to lie down. 11 is “haon déag” (one-teen).'}],
          ['Gach maidin.', 'Every morning.', 'gakh MAH-jin', ['maidin'], {lit:'Every morning', why:'gach = every. Gach lá = every day, gach oíche = every night.'}],
          ['Cad é an t-am a n-éiríonn tú?', 'What time do you get up?', 'ka-JAY an TOWM a NYE-ree-un too', ['éiríonn'], {lit:'What is the time at which you rise?', why:'After “an t-am a”, the verb gets an n- here because it means “at which”.'}]
        ],
        drills: [
          ['I get up at eight.', 'Éirím ar a hocht a chlog.'],
          ['I go to bed at ten.', 'Téim a luí ar a deich.'],
          ['I start work at nine.', 'Tosaím ag obair ar a naoi.'],
          ['Every morning.', 'Gach maidin.']
        ],
        chat: { scene: 'Gráinne, an early bird, is amazed at what time other people get up.', opener: 'Éirím ar a sé gach maidin! Agus tusa?', openerEn: 'I get up at six every morning! And you?',
          goals: [['up', 'Say when you get up'], ['work', 'Say when you start work'], ['bed', 'Say when you go to bed']] }
      },
      { id: 'u4-l5', ga: 'Lá breithe sona!', en: 'Months and birthdays', goal: 'Name the months and talk about birthdays',
        phrases: [
          ['Eanáir, Feabhra, Márta, Aibreán.', 'January, February, March, April.', 'AN-awr, FOW-ra, MAWR-ta, AB-rawn', ['Eanáir', 'Aibreán'], {lit:'January, February, March, April', why:'The months, in sets of four.'}],
          ['Bealtaine, Meitheamh, Iúil, Lúnasa.', 'May, June, July, August.', 'BYAL-tin-a, MEH-hoo, OOL, LOO-na-sa', ['Bealtaine', 'Lúnasa'], {lit:'May, June, July, August', why:'Bealtaine and Lúnasa are old festival names.'}],
          ['Meán Fómhair, Deireadh Fómhair, Samhain, Nollaig.', 'September, October, November, December.', 'mawn FOH-ir, JER-oo FOH-ir, SOW-in, NUL-ig', ['Samhain', 'Nollaig'], {lit:'Middle of autumn, end of autumn, Samhain, Christmas', why:'September and October are the middle and the end of the harvest.'}],
          ['Cá huair atá do bhreithlá?', 'When is your birthday?', 'kaw HOO-ir a-TAW duh VREH-law', ['huair', 'breithlá'], {lit:'What hour is your birthday?', why:'Cá huair = when, the Ulster way. do softens breithlá → bhreithlá.'}],
          ['Tá mo bhreithlá i mí Iúil.', 'My birthday is in July.', 'taw muh VREH-law uh mee OOL', ['mí'], {lit:'My birthday is in the month of July', why:'i mí … = in the month of … .'}],
          ['Lá breithe sona duit!', 'Happy birthday!', 'law BREH-ha SUN-a dit', ['sona'], {lit:'Happy day of birth to you!', why:'duit (to you) again, as in Dia duit.'}]
        ],
        drills: [
          ['My birthday is in August.', 'Tá mo bhreithlá i mí Lúnasa.'],
          ['When is your birthday?', 'Cá huair atá do bhreithlá?'],
          ['Happy birthday!', 'Lá breithe sona duit!'],
          ['My birthday is in January.', 'Tá mo bhreithlá i mí Eanáir.']
        ],
        chat: { scene: 'It’s Gráinne’s birthday next week, and she’s dropping hints.', opener: 'An bhfuil a fhios agat cá huair atá mo bhreithlá?', openerEn: 'Do you know when my birthday is?',
          goals: [['when', 'Ask when her birthday is'], ['yours', 'Say when yours is'], ['happy', 'Wish her a happy birthday']] }
      },
      { id: 'u4-cp', checkpoint: true, ga: 'Comhrá mór', en: 'Checkpoint: planning a weekend away', goal: 'A 3-minute chat using the whole unit',
        chat: { scene: 'You’re on the phone to Gráinne arranging a weekend in Donegal: days, times and numbers.', opener: 'Haigh! Cén lá a mbeidh tú ag teacht?', openerEn: 'Hi! Which day will you be coming?',
          goals: [['day', 'Say which day you’re coming'], ['time', 'Give a time'], ['number', 'Use a number (people, bags, your phone number)'], ['routine', 'Say something about your routine'], ['bye', 'Say goodbye with a day']] }
      }
    ]
  },

  {
    id: 'u5', num: 5, ga: 'Sa Siopa · Sa Chaife', en: 'In the shop and café',
    lessons: [
      { id: 'u5-l1', ga: 'Ba mhaith liom cupán tae', en: 'Ordering', goal: 'Order a drink and a bite to eat',
        phrases: [
          ['Cad é ba mhaith leat?', 'What would you like?', 'ka-JAY ba WAH lat', ['mhaith'], {lit:'What would be good with you?', why:'ba mhaith = would be good. leat = le + tú (with you).'}],
          ['Ba mhaith liom cupán tae, le do thoil.', 'I’d like a cup of tea, please.', 'ba WAH lum KUP-awn TAY, leh duh HUL', ['cupán', 'tae'], {lit:'A cup of tea would be good with me, please', why:'Ba mhaith liom … = I’d like … . The most useful phrase in any café.'}],
          ['Ba mhaith liom caife.', 'I’d like a coffee.', 'ba WAH lum KAF-ya', ['caife'], {lit:'Coffee would be good with me', why:'Swap in whatever you want after Ba mhaith liom.'}],
          ['Bainne agus siúcra?', 'Milk and sugar?', 'BAN-ya AH-gus SHOO-kra', ['bainne', 'siúcra'], {lit:'Milk and sugar?', why:'agus = and.'}],
          ['Bainne, ach gan siúcra.', 'Milk, but no sugar.', 'BAN-ya, akh gan SHOO-kra', ['gan'], {lit:'Milk, but without sugar', why:'gan = without. Handy for allergies too.'}],
          ['Ceapaire cáise, le do thoil.', 'A cheese sandwich, please.', 'KYAP-ir-a KAW-sha, leh duh HUL', ['ceapaire', 'cáis'], {lit:'A sandwich of cheese, please', why:'“Of cheese” changes cáis → cáise (the “of” form).'}],
          ['Sin é, go raibh maith agat.', 'That’s it, thanks.', 'shin AY, guh rev mah AH-gut', ['sin'], {lit:'That is it, may there be good at you', why:'Sin é = that’s it, that’s all.'}]
        ],
        drills: [
          ['I’d like a coffee, please.', 'Ba mhaith liom caife, le do thoil.'],
          ['Milk, but no sugar.', 'Bainne, ach gan siúcra.'],
          ['What would you like?', 'Cad é ba mhaith leat?'],
          ['A ham sandwich, please.', 'Ceapaire liamháis, le do thoil.']
        ],
        chat: { scene: 'Gráinne is working behind the counter in a café in Gaoth Dobhair.', opener: 'Dia duit! Cad é ba mhaith leat?', openerEn: 'Hello! What would you like?',
          goals: [['drink', 'Order a drink'], ['food', 'Order something to eat'], ['milk', 'Say how you take it']] }
      },
      { id: 'u5-l2', ga: 'Cá mhéad atá air?', en: 'Prices and paying', goal: 'Ask prices and pay',
        phrases: [
          ['Cá mhéad atá air seo?', 'How much is this?', 'kaw VAYD a-TAW er SHUH', ['méad'], {lit:'What amount is on this?', why:'A price is “on” the thing: air seo = on this.'}],
          ['Tá sé cúig phunt.', 'It’s five pounds.', 'taw shay KOO-ig FUNT', ['punt'], {lit:'It is five pounds', why:'2 to 6 soften the next word: punt → phunt (ph = f).'}],
          ['Sin trí phunt, le do thoil.', 'That’s three pounds, please.', 'shin TREE FUNT, leh duh HUL', ['trí'], {lit:'That (is) three pounds, please', why:'The same softening after trí.'}],
          ['Tá sé ródhaor.', 'It’s too dear.', 'taw shay roe-GHEER', ['daor'], {lit:'It is too dear', why:'ró (too) softens daor → dhaor, as in ró-dhona in Unit 1.'}],
          ['Tá sé saor go leor.', 'It’s cheap enough.', 'taw shay SEER guh LYOR', ['saor', 'leor'], {lit:'It is cheap enough', why:'go leor = enough, plenty. (saor also means free!)'}],
          ['An bhfuil cárta ceart go leor?', 'Is a card OK?', 'an will KAWR-ta KYART guh LYOR', ['cárta'], {lit:'Is a card right enough?', why:'ceart go leor = OK, all right.'}],
          ['Coinnigh an tsóinseáil.', 'Keep the change.', 'KUN-ee an TOHN-shawl', ['sóinseáil'], {lit:'Keep the change', why:'With some feminine words, an puts a t in front of s: an tsóinseáil. The s goes silent.'}]
        ],
        drills: [
          ['How much is this?', 'Cá mhéad atá air seo?'],
          ['That’s two pounds.', 'Sin dhá phunt.'],
          ['It’s too dear.', 'Tá sé ródhaor.'],
          ['Keep the change.', 'Coinnigh an tsóinseáil.']
        ],
        chat: { scene: 'Gráinne is running a craft stall at the market in Bun Beag.', opener: 'Tá geansaithe deasa agam inniu!', openerEn: 'I’ve lovely jumpers today!',
          goals: [['price', 'Ask how much something is'], ['dear', 'Say it’s too dear, or cheap enough'], ['pay', 'Pay and say “keep the change”']] }
      },
      { id: 'u5-l3', ga: 'An bhfuil bainne agat?', en: 'In the shop', goal: 'Find things and ask if they have them',
        phrases: [
          ['An bhfuil bainne agat?', 'Do you have milk?', 'an will BAN-ya AH-gut', ['bainne'], {lit:'Is milk at you?', why:'The “at you” frame for having, as a question.'}],
          ['Tá, cinnte.', 'Yes, certainly.', 'taw, KIN-cha', ['cinnte'], {lit:'Is, certainly', why:'Answer yes with the verb: Tá.'}],
          ['Níl, tá brón orm.', 'No, sorry.', 'neel, taw BRONE urum', ['brón'], {lit:'Isn’t, sorrow is on me', why:'Feelings sit “on” you, just like áthas orm.'}],
          ['Cá bhfuil an t-arán?', 'Where’s the bread?', 'kaw will an TAR-awn', ['arán'], {lit:'Where is the bread?', why:'cá bhfuil = where is. t- before a vowel again: an t-arán.'}],
          ['Thall ansin.', 'Over there.', 'hal an-SHIN', ['thall', 'ansin'], {lit:'Yonder there', why:'thall = over (on the far side). ansin = there.'}],
          ['Ba mhaith liom builín aráin.', 'I’d like a loaf of bread.', 'ba WAH lum BWIL-een a-RAWN', ['builín'], {lit:'A loaf of bread would be good with me', why:'“Of bread” changes arán → aráin.'}],
          ['Mála, le do thoil.', 'A bag, please.', 'MAW-la, leh duh HUL', ['mála'], {lit:'A bag, please', why:'Short and sweet.'}]
        ],
        drills: [
          ['Do you have eggs?', 'An bhfuil uibheacha agat?'],
          ['Where’s the milk?', 'Cá bhfuil an bainne?'],
          ['Over there.', 'Thall ansin.'],
          ['I’d like a loaf of bread.', 'Ba mhaith liom builín aráin.']
        ],
        chat: { scene: 'You’re in the village shop. Gráinne is minding it for her cousin.', opener: 'Dia duit! An dtig liom cuidiú leat?', openerEn: 'Hello! Can I help you?',
          goals: [['have', 'Ask if they have something'], ['where', 'Ask where something is'], ['buy', 'Say what you’d like']] }
      },
      { id: 'u5-l4', ga: 'Tá ocras orm', en: 'Eating out', goal: 'Say you’re hungry, enjoy the food, and pay',
        phrases: [
          ['Tá ocras orm.', 'I’m hungry.', 'taw UK-rus urum', ['ocras'], {lit:'Hunger is on me', why:'Hunger and thirst sit “on” you: ocras orm, tart orm.'}],
          ['Tá tart orm.', 'I’m thirsty.', 'taw TART urum', ['tart'], {lit:'Thirst is on me', why:'Same frame.'}],
          ['Tá sé seo blasta!', 'This is tasty!', 'taw shay SHUH BLASS-ta', ['blasta'], {lit:'This is tasty', why:'sé seo = this one (masculine). sí seo for a feminine thing.'}],
          ['An dtig liom an bille a fháil?', 'Can I get the bill?', 'an DIG lum an BIL-ya a AWL', ['bille', 'fáil'], {lit:'Does it come with me to get the bill?', why:'Your Unit 1 “An dtig leat…?”, now with liom (with me).'}],
          ['Íocfaidh mise.', 'I’ll pay.', 'EE-uk-ee MISH-a', ['íocfaidh'], {lit:'I will pay', why:'mise (the strong “I”) shows you mean it!'}],
          ['Ná bac leis.', 'Don’t worry about it.', 'naw BOK lesh', ['bac'], {lit:'Don’t bother with it', why:'Ná = don’t. A friendly brush-off.'}],
          ['Bhí sé sin go hálainn.', 'That was lovely.', 'vee shay shin guh HAW-lin', ['álainn'], {lit:'That was lovely', why:'Bhí = was. go hálainn: h before a vowel after go.'}]
        ],
        drills: [
          ['I’m hungry.', 'Tá ocras orm.'],
          ['Can I get the bill?', 'An dtig liom an bille a fháil?'],
          ['I’ll pay.', 'Íocfaidh mise.'],
          ['That was lovely.', 'Bhí sé sin go hálainn.']
        ],
        chat: { scene: 'Lunch with Gráinne. The soup was good, and now there’s the bill.', opener: 'Bhuel? An maith leat an t-anraith?', openerEn: 'Well? Do you like the soup?',
          goals: [['tasty', 'Say the food is tasty or lovely'], ['bill', 'Ask for the bill'], ['pay', 'Offer to pay']] }
      },
      { id: 'u5-l5', ga: 'Níl mé ach ag amharc', en: 'Buying a present', goal: 'Shop for a present and decide',
        phrases: [
          ['Níl mé ach ag amharc.', 'I’m just looking.', 'neel may akh eg OW-urk', ['amharc'], {lit:'I am not but looking', why:'Níl … ach = only. amharc is the Ulster word for looking.'}],
          ['Tá mé ag cuartú bronntanais.', 'I’m looking for a present.', 'taw may eg KOOR-too BROWN-ta-nish', ['cuartú', 'bronntanas'], {lit:'I am searching for a present', why:'After ag + an action word, the thing changes to its “of” form: bronntanas → bronntanais.'}],
          ['Do mo mháthair.', 'For my mother.', 'duh muh WAW-hir', ['máthair'], {lit:'For my mother', why:'mo softens máthair, as in Unit 2.'}],
          ['An bhfuil sé seo agat i ndath eile?', 'Do you have this in another colour?', 'an will shay SHUH AH-gut uh NAH EL-ya', ['dath', 'eile'], {lit:'Is this at you in another colour?', why:'i eclipses dath → ndath (say the n).'}],
          ['Tá sé go hálainn.', 'It’s lovely.', 'taw shay guh HAW-lin', ['álainn'], {lit:'It is lovely', why:'go + h before a vowel.'}],
          ['Glacfaidh mé é.', 'I’ll take it.', 'GLAK-ee may AY', ['glacfaidh'], {lit:'I will take it', why:'-faidh = will, as in Feicfidh mé.'}]
        ],
        drills: [
          ['I’m just looking.', 'Níl mé ach ag amharc.'],
          ['I’ll take it.', 'Glacfaidh mé é.'],
          ['For my sister.', 'Do mo dheirfiúr.'],
          ['I’m looking for a present for my father.', 'Tá mé ag cuartú bronntanais do m’athair.']
        ],
        chat: { scene: 'Gráinne helps you choose a present in a craft shop in Donegal Town.', opener: 'Cad é atá tú a chuartú?', openerEn: 'What are you looking for?',
          goals: [['present', 'Say you’re looking for a present'], ['who', 'Say who it’s for'], ['take', 'Ask about another colour, or say you’ll take it']] }
      },
      { id: 'u5-cp', checkpoint: true, ga: 'Comhrá mór', en: 'Checkpoint: the busy café', goal: 'A 3-minute chat using the whole unit',
        chat: { scene: 'A busy café in Belfast. You’re ordering for yourself and Gráinne, then paying.', opener: 'Á, tá ocras orm! Cad é a bheas agat?', openerEn: 'Ah, I’m hungry! What will you have?',
          goals: [['order', 'Order food and drink'], ['how', 'Say how you take your tea or coffee'], ['price', 'Ask how much it is'], ['pay', 'Pay, or offer to pay'], ['lovely', 'Say the food was lovely']] }
      }
    ]
  },

  {
    id: 'u6', num: 6, ga: 'Caitheamh aimsire', en: 'Pastimes',
    lessons: [
      { id: 'u6-l1', ga: 'Is maith liom ceol', en: 'Likes and dislikes', goal: 'Say what you like, love and prefer',
        phrases: [
          ['Is maith liom ceol.', 'I like music.', 'iss MAH lum KYOLE', ['ceol'], {lit:'Music is good with me', why:'Liking is “with” you: Is maith liom.'}],
          ['Is breá liom peil.', 'I love (Gaelic) football.', 'iss BRAW lum PEL', ['peil'], {lit:'Football is fine with me', why:'Is breá liom = I love. Stronger than maith.'}],
          ['Ní maith liom an teilifís.', 'I don’t like the telly.', 'nee MAH lum an TEL-i-feesh', ['teilifís'], {lit:'The television isn’t good with me', why:'Is → Ní for the negative.'}],
          ['An maith leat leabhair?', 'Do you like books?', 'an MAH lat LYOW-ir', ['leabhair'], {lit:'Are books good with you?', why:'An makes the question. leat = with you.'}],
          ['Is maith.', 'Yes (I do).', 'iss MAH', ['maith'], {lit:'(It) is good', why:'Answer with the same words: Is maith / Ní maith.'}],
          ['Is fearr liom tae ná caife.', 'I prefer tea to coffee.', 'iss FAR lum TAY naw KAF-ya', ['fearr'], {lit:'Tea is better with me than coffee', why:'Is fearr liom = I prefer. ná = than.'}],
          ['Is cuma liom.', 'I don’t mind.', 'iss KUM-a lum', ['cuma'], {lit:'It’s all the same with me', why:'The same “with me” frame.'}]
        ],
        drills: [
          ['I like books.', 'Is maith liom leabhair.'],
          ['I don’t like coffee.', 'Ní maith liom caife.'],
          ['Do you like music?', 'An maith leat ceol?'],
          ['I prefer football.', 'Is fearr liom peil.']
        ],
        chat: { scene: 'Gráinne is trying to work out what you’d like to do on Saturday.', opener: 'An maith leat ceol?', openerEn: 'Do you like music?',
          goals: [['like', 'Say something you like'], ['dislike', 'Say something you don’t like'], ['prefer', 'Say what you prefer']] }
      },
      { id: 'u6-l2', ga: 'An imríonn tú peil?', en: 'The GAA', goal: 'Talk about sport and your county',
        phrases: [
          ['An imríonn tú peil?', 'Do you play football?', 'an IM-ree-un too PEL', ['imríonn'], {lit:'Do you play football?', why:'An + verb makes a question. imir = play (sport).'}],
          ['Imrím iománaíocht.', 'I play hurling.', 'IM-reem um-AWN-ee-ukht', ['iománaíocht'], {lit:'I play hurling', why:'-im = I. iománaíocht = hurling.'}],
          ['Cé leis a bhfuil tú?', 'Who do you support?', 'kay LESH a will too', ['leis'], {lit:'Who are you with?', why:'Supporting a team is being “with” them.'}],
          ['Tá mé le hAontroim.', 'I’m for Antrim.', 'taw may leh HAYN-trim', ['Aontroim'], {lit:'I am with Antrim', why:'le puts an h before a vowel: le hAontroim.'}],
          ['Cé a bhuaigh?', 'Who won?', 'kay a WOO-ee', ['bhuaigh'], {lit:'Who won?', why:'In the past, verbs soften: buaigh → bhuaigh.'}],
          ['Bhuaigh Dún na nGall!', 'Donegal won!', 'WOO-ee doon na NGOWL', ['Dún na nGall'], {lit:'Donegal won!', why:'Dún na nGall = fort of the foreigners.'}],
          ['Cluiche iontach a bhí ann.', 'It was a great match.', 'KLIH-ha EEN-takh a VEE un', ['cluiche', 'iontach'], {lit:'A great match is what was in it', why:'Putting cluiche iontach first gives it emphasis.'}]
        ],
        drills: [
          ['I play football.', 'Imrím peil.'],
          ['Who won?', 'Cé a bhuaigh?'],
          ['Antrim won!', 'Bhuaigh Aontroim!'],
          ['It was a great match.', 'Cluiche iontach a bhí ann.']
        ],
        chat: { scene: 'Gráinne is at the club after the match, flag still in hand.', opener: 'An raibh tú ag an chluiche?', openerEn: 'Were you at the match?',
          goals: [['support', 'Say who you support'], ['won', 'Ask who won, or say who won'], ['play', 'Say whether you play']] }
      },
      { id: 'u6-l3', ga: 'I d’am saor', en: 'Hobbies', goal: 'Say what you do in your free time',
        phrases: [
          ['Cad é a dhéanann tú i d’am saor?', 'What do you do in your free time?', 'ka-JAY a YAY-nun too uh DOWM SEER', ['déanann', 'saor'], {lit:'What is it that you do in your free time?', why:'do (your) becomes d’ before a vowel: d’am.'}],
          ['Bím ag léamh.', 'I read (a lot).', 'beem eg LAY-uv', ['léamh'], {lit:'I am (usually) at reading', why:'Bím + ag … = what you usually do.'}],
          ['Is maith liom a bheith ag siúl.', 'I like walking.', 'iss MAH lum a VEH eg SHOOL', ['siúl'], {lit:'Being at walking is good with me', why:'a bheith ag … = being … -ing. Slot in any activity.'}],
          ['Is breá liom a bheith ag snámh.', 'I love swimming.', 'iss BRAW lum a VEH eg SNAWV', ['snámh'], {lit:'Being at swimming is fine with me', why:'The same frame with breá (love).'}],
          ['Seinnim an fheadóg stáin.', 'I play the tin whistle.', 'SHEN-im an AH-dog STAWN', ['feadóg'], {lit:'I play the whistle of tin', why:'seinn = play (music). an softens feadóg → fheadóg, and the fh is silent.'}],
          ['Téim ag rith gach maidin.', 'I go running every morning.', 'chaym eg RIH gakh MAH-jin', ['rith'], {lit:'I go at running every morning', why:'téim = I go, plus ag rith (running).'}]
        ],
        drills: [
          ['I like swimming.', 'Is maith liom a bheith ag snámh.'],
          ['I play the fiddle.', 'Seinnim an fhidil.'],
          ['I go walking at the weekend.', 'Bím ag siúl ag an deireadh seachtaine.'],
          ['What do you do in your free time?', 'Cad é a dhéanann tú i d’am saor?']
        ],
        chat: { scene: 'Gráinne is filling in a form for a new Irish-language club and asks about your hobbies.', opener: 'Cad é a dhéanann tú i d’am saor?', openerEn: 'What do you do in your free time?',
          goals: [['hobby', 'Say a hobby'], ['like', 'Say you like doing something'], ['askher', 'Ask what she does']] }
      },
      { id: 'u6-l4', ga: 'Ceol agus craic', en: 'Music and the session', goal: 'Talk about music and get invited along',
        phrases: [
          ['An seinneann tú ceol?', 'Do you play music?', 'an SHEN-un too KYOLE', ['seinneann'], {lit:'Do you play music?', why:'seinn is for playing music, imir is for playing sport.'}],
          ['Is breá liom ceol traidisiúnta.', 'I love trad music.', 'iss BRAW lum KYOLE TRAJ-ish-oon-ta', ['traidisiúnta'], {lit:'Traditional music is fine with me', why:'The describing word comes after the noun.'}],
          ['An dtiocfaidh tú chuig an seisiún?', 'Will you come to the session?', 'an JUK-ee too KHIG an SESH-oon', ['tiocfaidh', 'seisiún'], {lit:'Will you come to the session?', why:'An eclipses tiocfaidh → dtiocfaidh. chuig = to (a place or event).'}],
          ['Tiocfaidh, cinnte.', 'I will, surely.', 'CHUK-ee, KIN-cha', ['cinnte'], {lit:'Will come, certainly', why:'Say yes by repeating the verb: Tiocfaidh.'}],
          ['Ní thig liom damhsa!', 'I can’t dance!', 'nee HIG lum DOW-sa', ['damhsa'], {lit:'It doesn’t come with me to dance', why:'The negative of “An dtig leat”: Ní thig liom (I can’t).'}],
          ['Amhrán eile!', 'Another song!', 'OW-rawn EL-ya', ['amhrán'], {lit:'Another song!', why:'eile = other, another. It goes after the noun.'}],
          ['Bhí an chraic go hiontach.', 'The craic was great.', 'vee an KHRAK guh HEEN-takh', ['craic'], {lit:'The craic was great', why:'craic is feminine, so an softens it: an chraic.'}]
        ],
        drills: [
          ['Will you come to the session?', 'An dtiocfaidh tú chuig an seisiún?'],
          ['I can’t sing!', 'Ní thig liom canadh!'],
          ['I love music.', 'Is breá liom ceol.'],
          ['The craic was great.', 'Bhí an chraic go hiontach.']
        ],
        chat: { scene: 'There’s a session in the pub in Gaoth Dobhair tonight, and Gráinne wants you there.', opener: 'Beidh seisiún ann anocht. An dtiocfaidh tú?', openerEn: 'There’ll be a session tonight. Will you come?',
          goals: [['yes', 'Say you’ll come (or can’t)'], ['music', 'Say something about music you like'], ['cant', 'Say something you can’t do!']] }
      },
      { id: 'u6-l5', ga: 'Ar mhaith leat dul amach?', en: 'Making plans', goal: 'Invite someone out and agree a time and place',
        phrases: [
          ['Ar mhaith leat dul amach?', 'Would you like to go out?', 'er WAH lat dul a-MAKH', ['dul', 'amach'], {lit:'Would it be good with you to go out?', why:'Ar mhaith leat … ? = Would you like … ? The question form of Ba mhaith liom.'}],
          ['Ba bhreá liom!', 'I’d love to!', 'ba VRAW lum', ['breá'], {lit:'It would be fine with me!', why:'ba softens breá → bhreá.'}],
          ['Cá háit a mbuailfidh muid le chéile?', 'Where will we meet?', 'kaw HAWCH a MOO-il-ee mwidj leh HAY-la', ['áit', 'buailfidh'], {lit:'What place will we meet each other?', why:'buail le = meet. Here it gets eclipsed: mbuailfidh.'}],
          ['Buailfidh mé leat sa chaife.', 'I’ll meet you in the café.', 'BOO-il-ee may lat sa KHAF-ya', ['caife'], {lit:'I will strike with you in the café', why:'sa softens caife → chaife.'}],
          ['Cad é faoi Dé Sathairn?', 'What about Saturday?', 'ka-JAY fwee jay SAH-harn', ['faoi'], {lit:'What is it about Saturday?', why:'Cad é faoi … ? = What about … ? A great Ulster frame.'}],
          ['Níl mé saor Dé Domhnaigh.', 'I’m not free on Sunday.', 'neel may SEER jay DOH-nee', ['saor'], {lit:'I am not free on Sunday', why:'saor = free (and cheap!).'}],
          ['Ar fheabhas!', 'Excellent!', 'er OW-us', ['feabhas'], {lit:'On excellence!', why:'ar softens feabhas → fheabhas, and the fh goes silent.'}]
        ],
        drills: [
          ['Would you like to go walking?', 'Ar mhaith leat dul ag siúl?'],
          ['I’d love to!', 'Ba bhreá liom!'],
          ['What about Friday?', 'Cad é faoi Dé hAoine?'],
          ['I’ll meet you in the café.', 'Buailfidh mé leat sa chaife.']
        ],
        chat: { scene: 'You’re making plans with Gráinne for next weekend.', opener: 'Ar mhaith leat rud éigin a dhéanamh an deireadh seachtaine seo chugainn?', openerEn: 'Would you like to do something next weekend?',
          goals: [['yes', 'Say you’d love to'], ['when', 'Suggest a day'], ['where', 'Agree where to meet']] }
      },
      { id: 'u6-cp', checkpoint: true, ga: 'Comhrá mór', en: 'Checkpoint: Gráinne in Belfast', goal: 'A 3-minute chat using the whole unit',
        chat: { scene: 'Gráinne is up in Belfast for the weekend. Find out what she likes and plan Saturday together.', opener: 'Seo mé i mBéal Feirste! Cad é a dhéanfaidh muid?', openerEn: 'Here I am in Belfast! What will we do?',
          goals: [['like', 'Say what you like and ask what she likes'], ['sport', 'Talk about sport or music'], ['hobby', 'Say what you do in your free time'], ['plan', 'Suggest a plan with a day and time'], ['meet', 'Agree where to meet']] }
      }
    ]
  }
];
