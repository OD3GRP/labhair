# Labhair

A personal app for learning to **speak** Irish, built around Ulster Irish with Connacht and Munster too. It has short spoken lessons, a mic that checks what you said, live role-play chats with a tutor (powered by Claude), and a kid mode for the family.

Live at **https://od3grp.github.io/labhair/**. It's a Progressive Web App: plain HTML, CSS and JavaScript with no build step, installed to an Android home screen from Chrome.

## What's in it

**For grown-ups**
- **Six units** (greetings, family, weather, numbers and time, shop and café, pastimes). Each lesson goes Abair é (say it) → Tóg é (build it) → Comhrá (chat) → Críoch (review), with a checkpoint chat per unit.
- **Three dialects:** Ulster with Gráinne, Connacht with Nóra and Munster with Máire. Each person picks their own.
- **Native audio** for every line, from ABAIR's voices. There's a 🐢 slow button, speak-along shadowing, and record-and-compare.
- **Daily review:** spaced repetition with say, build and listening questions.
- **An Spideog, the robin:** tap it for the literal meaning, why a phrase is built that way, sound changes (lenition and eclipsis), and how the other dialects say it.
- **Talk-back coach:** after each try, a voice explains in English what you got right and what to fix. "Tell me more" asks Claude for a fuller explanation.
- **Hands-free mode:** English, a pause, then the Irish twice. It works with the screen off and has lock-screen controls.
- **The tutor:** a portrait that changes expression, her own voice, a memory of what you've told her, free chat, and hands-free chat.
- **Radharcanna:** illustrated scenes to watch and then join, with tappable objects. Claude can write new ones.
- **Scéalta:** read-along stories where you tap any word for its meaning.
- **Weak words:** the words that keep tripping you up, with practice limited to them.

**For kids** (a profile per child, behind a press-and-hold grown-up lock, with no AI)
- Four animal friends (Puifín, Giorria, Madra Rua, Broc) host 12 picture topics.
- **Under 6:** listen, say it back (recorded, never scored), tap the picture.
- **6–9:** the same, plus the written word, a gentle mic check and match-pairs.
- **10–12:** short sentences, building from English, and scripted chats.
- Stickers, kids' scenes, and **Le chéile**, a family phrase of the day.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page shell |
| `app.js` | Core: profiles, lessons, mic and grading, review, chat, settings, audio |
| `content.js` | The Ulster course. **Add units here.** Phrases are `[Irish, English, sound-it-out, [teanglann words], {lit, why}]` |
| `content-c.js`, `content-m.js`, `course.js` | Connacht and Munster wording (only the lines that differ), and how they're merged in |
| `kids.js`, `kids-ui.js` | Kid mode content and screens |
| `scenes.js`, `scenes-ui.js` | Radharcanna backdrops, scripts and player |
| `stories.js`, `family.js` | Stories, and the family challenge |
| `commute.js` | Hands-free mode |
| `advisor.js` | An Spideog, the sound coach and the talk-back coach |
| `cast.js` | The characters: SVG placeholders with 11 expressions; real art drops in via `art/` |
| `art/BRIEF.md` | The brief for real character art. `node tools/check-art.mjs` lists what's there |
| `audio/` | ABAIR audio, one folder per set (see below) |
| `IRISH-CHECK.md` | Lines to check with a native speaker |
| `styles.css` | Look and feel (light and dark) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installable and offline |

## Audio (ABAIR)

All the Irish audio is made in advance with [ABAIR](https://abair.ie)'s voices. Run this after adding or changing any Irish:
```
node tools/make-audio.mjs --set u --unit u2
```
- **Sets:** `u`, `c` and `m` (the course in each dialect), `k-u`, `k-c` and `k-m` (kids), `sc-u` and so on (scenes), `st-u` and so on (stories).
- **What it makes:** only missing or changed files. Do one unit or set per run, because ABAIR asks for no bulk sweeps.
- **Setup:** it needs `ABAIR_API_KEY` in `.env`, which is gitignored. `--voices` lists the voices.
- **Afterwards:** bump `VERSION` in `sw.js`.
- **Credit:** ABAIR's terms require their credit and logo, which are on the Settings screen.

The app downloads the audio each person needs into a long-lived cache, so lessons work offline.

## Keys (all stored only on the phone)
- **Claude API key** (Settings): for the tutor chats, "Tell me more" and new scenes.
- **Azure Speech key and region** (Settings): the tutor's live voice (ga-IE Orla) and the English coach voice (en-IE Emily). Without it, those fall back to the phone's own voices, or stay silent. The free F0 tier covers 0.5 million characters a month.

## Install and update

- **Install:** open the link in Chrome, then tap **⋮ → Add to Home screen → Install**.
- **Update:** after any change, bump `VERSION` in `sw.js` and push. On the phone, close and reopen the app twice.
- **Backup:** Settings → Progress → **Back up** saves everyone's progress to a file, without keys. **Restore** loads it on a new phone.

## How the mic works

The mic uses Chrome's built-in speech recognition, set to Irish (`ga-IE`). If it struggles, try `ga` in Settings, or type instead. Grading is word by word: green means right, yellow means the right word but check the fada, and red means missing or different. "How well" is how clearly the phone understood you, not a native speaker's ear.

## Cost

- **Claude:** a 10-minute chat is a few pence on Sonnet, less on Haiku.
- **ABAIR:** free for personal and educational use.
- **Azure:** free on the F0 tier.
