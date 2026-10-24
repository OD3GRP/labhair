// Makes the phrase audio with the ABAIR API (abair.ie, Trinity College Dublin). Node 18+, no packages.
//   node tools/make-audio.mjs           make any missing or out-of-date MP3s
//   node tools/make-audio.mjs --voices  list the voices your key can use
//   node tools/make-audio.mjs --unit u2 only that unit (ABAIR asks for no bulk sweeps, so go a unit at a time)
// Needs ABAIR_API_KEY in .env (gitignored). Optional: ABAIR_VOICE (a voice id, default: first Ulster voice), ABAIR_SPEED (default 0.9).
// Files: audio/<lessonId>/<n>.mp3, phrases first (1..P) then drill answers (P+1..).
// audio/index.json records the text of each file, so changed phrases get remade and the app knows what exists.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://api.abair.ie/v4';

function readEnv(){
  const f = path.join(ROOT, '.env');
  if (!fs.existsSync(f)) return {};
  return Object.fromEntries(fs.readFileSync(f, 'utf8').split(/\r?\n/)
    .map(l => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)).filter(Boolean)
    .map(m => [m[1], m[2].replace(/^(['"])(.*)\1$/, '$2')]));
}
const env = {...readEnv(), ...process.env};
if (!env.ABAIR_API_KEY){ console.error('Put ABAIR_API_KEY=... in .env first.'); process.exit(1); }
const headers = {'abair-api-key': env.ABAIR_API_KEY, 'content-type': 'application/json'};
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function call(url, opts, tries = 4){
  for (let i = 1; ; i++){
    const res = await fetch(url, {...opts, headers});
    if (res.ok) return res;
    if (res.status === 429 && i < tries){ await sleep(5000 * i); continue; }
    let msg = ''; try { msg = await res.text(); } catch(e){}
    throw new Error(res.status + ' ' + msg.slice(0, 300));
  }
}
async function voices(){ return (await call(API + '/synthesis/voices', {method:'GET'})).json(); }

async function main(){
  const list = await voices();
  if (process.argv.includes('--voices')){
    for (const v of list) console.log([v.id, v.name, v.sex, v.province, v.location].join('\t'));
    return;
  }
  const voice = env.ABAIR_VOICE || (list.find(v => /ulster|uladh/i.test(v.province || '')) || {}).id;
  if (!voice){ console.error('No Ulster voice found. Run with --voices and set ABAIR_VOICE in .env.'); process.exit(1); }
  const speed = Number(env.ABAIR_SPEED || 0.9);

  const sandbox = {window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'content.js'), 'utf8'), sandbox);
  const indexFile = path.join(ROOT, 'audio', 'index.json');
  const old = fs.existsSync(indexFile) ? JSON.parse(fs.readFileSync(indexFile, 'utf8')) : {};
  const index = {voice, files:{}};
  let made = 0, kept = 0;

  const argUnit = process.argv.includes('--unit') ? process.argv[process.argv.indexOf('--unit') + 1] : null;
  for (const U of sandbox.window.UNITS) for (const L of U.lessons){
    if (L.checkpoint) continue;
    if (argUnit && U.id !== argUnit){
      // Keep other units' entries so the index stays complete.
      const texts = L.phrases.map(p => p[0]).concat(L.drills.map(d => d[1]));
      texts.forEach((t, i) => { const rel = L.id + '/' + (i + 1) + '.mp3'; if (old.files && old.files[rel] === t && fs.existsSync(path.join(ROOT, 'audio', rel))) index.files[rel] = t; });
      continue;
    }
    const texts = L.phrases.map(p => p[0]).concat(L.drills.map(d => d[1]));
    fs.mkdirSync(path.join(ROOT, 'audio', L.id), {recursive:true});
    for (let i = 0; i < texts.length; i++){
      const rel = L.id + '/' + (i + 1) + '.mp3', file = path.join(ROOT, 'audio', rel);
      const prev = old.files && old.files[rel];
      if (prev === texts[i] && old.voice === voice && fs.existsSync(file)){ index.files[rel] = texts[i]; kept++; continue; }
      const res = await call(API + '/synthesis?outputType=JSON&audioEncoding=MP3', {method:'POST', body:JSON.stringify({input:texts[i], voice, speed})});
      const data = await res.json();
      if (!data.audioContent) throw new Error('No audio for "' + texts[i] + '"');
      fs.writeFileSync(file, Buffer.from(data.audioContent, 'base64'));
      index.files[rel] = texts[i]; made++;
      console.log('made ' + rel + '  ' + texts[i]);
      fs.writeFileSync(indexFile, JSON.stringify(index, null, 1));
      await sleep(400);
    }
  }
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 1));
  console.log('Voice ' + voice + ': made ' + made + ', kept ' + kept + '. Now bump VERSION in sw.js.');
}
main().catch(e => { console.error('Failed: ' + e.message); process.exit(1); });
