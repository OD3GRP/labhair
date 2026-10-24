# Labhair

A personal app for learning to **speak** Ulster Irish. Short spoken lessons, a mic that checks what you said, and live role-play chats with Gráinne (powered by Claude).

It's a Progressive Web App: plain HTML, CSS and JavaScript with no build step. Host it on GitHub Pages and install it to your Android home screen from Chrome.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page shell |
| `app.js` | All app logic: lessons, mic, answer checking, chat, settings |
| `content.js` | The course: units, lessons, phrases, drills, chat scenes. **Add new units here.** |
| `styles.css` | Look and feel (light and dark) |
| `manifest.webmanifest`, `sw.js`, `icons/` | What makes it installable and work offline |

## Put it online (GitHub Pages)

1. Create the repo and push (from this folder):
   ```
   gh repo create labhair --public --source . --push
   ```
2. Turn on Pages: GitHub → the repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
3. After a minute it's live at `https://<your-username>.github.io/labhair/`.

The repo must be public for free GitHub Pages. Nothing private is in it: your API key and progress are stored only on your phone.

## Install on your Android phone

1. Open the Pages link in **Chrome**.
2. Tap **⋮ → Add to Home screen → Install**.
3. Open Labhair from your home screen, tap ⚙ **Settings**:
   - Run the **Mic test**. Allow the microphone when Chrome asks.
   - Paste your **Claude API key** (from console.anthropic.com) and tap **Save**.

## Updating

Edit files, then bump `VERSION` in `sw.js` (e.g. `labhair-v2`) and push:
```
git add -A && git commit -m "Add unit 2" && git push
```
Close and reopen the app on your phone to get the update.

## Phrase audio (ABAIR)

Every phrase and drill answer has an MP3 in `audio/<lessonId>/<n>.mp3`, made with the [ABAIR](https://abair.ie) Ulster voice. After adding or changing content:
```
node tools/make-audio.mjs
```
It only makes missing or changed files. It needs `ABAIR_API_KEY` in `.env` (gitignored). Optional: `ABAIR_VOICE`, `ABAIR_SPEED`. Run `node tools/make-audio.mjs --voices` to see the voices. Then bump `VERSION` in `sw.js`. ABAIR's terms require the credit and logo, which are on the Settings screen.

## Gráinne's voice (Azure)

Gráinne's chat replies are spoken by Azure's Irish voice (ga-IE Orla). In Settings, paste your Azure Speech key and region (portal.azure.com → your Speech resource → Keys and Endpoint), then tap **Test**. Without a key she stays silent. The free F0 tier covers 0.5 million characters a month.

## How the mic works

Chrome's built-in speech recognition, set to Irish (`ga-IE`). If it struggles, try `ga` in Settings. You can always type instead. Grading is word by word: green = right, yellow = right word but check the fada, red = missing or different.

## Cost

Gráinne uses your own Claude API key. A 10-minute lesson's chat is a few pence on Sonnet, less on Haiku.
