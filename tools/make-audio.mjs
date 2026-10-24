// Makes the app's audio with the ABAIR API (abair.ie, Trinity College Dublin). Node 18+, no packages.
//   node tools/make-audio.mjs                 make any missing or out-of-date MP3s for Ulster (set u)
//   node tools/make-audio.mjs --set c         Connacht (c), Munster (m), kids' sets k-u, k-c, k-m, scenes sc-u, sc-c, sc-m, or stories st-u, st-c, st-m
//   node tools/make-audio.mjs --unit u2       only that unit (ABAIR asks for no bulk sweeps, so go a unit at a time)
//   node tools/make-audio.mjs --voices        list the voices your key can use
// Needs ABAIR_API_KEY in .env (gitignored). Optional: ABAIR_VOICE (Ulster voice id), ABAIR_VOICE_C, ABAIR_VOICE_M, ABAIR_SPEED (default 0.9).
// Course sets write audio/<set>/<lessonId>/<n>.mp3 (Ulster: audio/<lessonId>/…): phrases 1..P, then drill answers, plus opener.mp3 for the chat.
// Kids' sets come from kids.js (window.kidAudioJobs), with a voice per character.
// Each set's index.json records the text (and voice) of every file, so changed lines get remade and the app knows what exists.
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
const arg = name => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : null;

async function call(url, opts, tries = 4){
  for (let i = 1; ; i++){
    const res = await fetch(url, {...opts, headers});
    if (res.ok) return res;
    if (res.status === 429 && i < tries){ await sleep(5000 * i); continue; }
    let msg = ''; try { msg = await res.text(); } catch(e){}
    throw new Error(res.status + ' ' + msg.slice(0, 300));
  }
}

// Load the app's content files the same way the browser does.
function loadContent(){
  const sandbox = {window:{}};
  for (const f of ['content.js', 'content-c.js', 'content-m.js', 'course.js', 'kids.js', 'scenes.js', 'stories.js']){
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) vm.runInNewContext(fs.readFileSync(p, 'utf8'), sandbox);
  }
  return sandbox.window;
}

const DEFAULT_VOICES = {u: env.ABAIR_VOICE || 'anb.piper', c: env.ABAIR_VOICE_C || 'snc.piper', m: env.ABAIR_VOICE_M || 'nnc.piper'};

// Every file a set needs: [{rel, text, voice, unit}]
function jobsFor(W, set, unitFilter){
  if (set.startsWith('st-')){
    if (!W.storyAudioJobs) throw new Error('stories.js has no storyAudioJobs');
    return W.storyAudioJobs(set.slice(3)).filter(j => !unitFilter || j.unit === unitFilter);
  }
  if (set.startsWith('sc-')){
    if (!W.sceneAudioJobs) throw new Error('scenes.js has no sceneAudioJobs');
    return W.sceneAudioJobs(set.slice(3)).filter(j => !unitFilter || j.unit === unitFilter);
  }
  if (set.startsWith('k-')){
    if (!W.kidAudioJobs) throw new Error('kids.js has no kidAudioJobs');
    return W.kidAudioJobs(set.slice(2)).filter(j => !unitFilter || j.unit === unitFilter);
  }
  const voice = DEFAULT_VOICES[set];
  if (!voice) throw new Error('Unknown set ' + set);
  const jobs = [];
  for (const U of W.courseFor(set)){
    for (const L of U.lessons){
      if (!L.checkpoint){
        L.phrases.map(p => p[0]).concat(L.drills.map(d => d[1]))
          .forEach((text, i) => jobs.push({rel: L.id + '/' + (i + 1) + '.mp3', text, voice, unit: U.id}));
      }
      jobs.push({rel: L.id + '/opener.mp3', text: L.chat.opener, voice, unit: U.id});
    }
  }
  return jobs.filter(j => !unitFilter || j.unit === unitFilter);
}

async function main(){
  if (process.argv.includes('--voices')){
    const list = await (await call(API + '/synthesis/voices', {method:'GET'})).json();
    for (const v of list) console.log([v.id, v.name, v.sex, v.province, v.location].join('\t'));
    return;
  }
  const set = arg('--set') || 'u', unit = arg('--unit');
  const speed = Number(env.ABAIR_SPEED || 0.9);
  const W = loadContent();
  const dir = path.join(ROOT, 'audio', set === 'u' ? '' : set);
  const indexFile = path.join(dir, 'index.json');
  const old = fs.existsSync(indexFile) ? JSON.parse(fs.readFileSync(indexFile, 'utf8')) : {};
  const oldVoice = rel => (old.voices && old.voices[rel]) || old.voice;

  // Keep the entries we aren't touching this run (other units), if their files are still there and still current.
  const all = jobsFor(W, set, null), mine = new Set(jobsFor(W, set, unit).map(j => j.rel));
  const index = {voice: DEFAULT_VOICES[set] || '', files:{}, voices:{}};
  const write = () => {
    if (!Object.keys(index.voices).length) delete index.voices;
    fs.writeFileSync(indexFile, JSON.stringify(index, null, 1));
    if (!index.voices) index.voices = {};
  };
  let made = 0, kept = 0;
  for (const j of all){
    const file = path.join(dir, j.rel);
    const current = old.files && old.files[j.rel] === j.text && oldVoice(j.rel) === j.voice && fs.existsSync(file);
    const record = () => { index.files[j.rel] = j.text; if (j.voice !== index.voice) index.voices[j.rel] = j.voice; };
    if (current){ record(); kept++; continue; }
    if (!mine.has(j.rel)) continue;
    fs.mkdirSync(path.dirname(file), {recursive:true});
    const res = await call(API + '/synthesis?outputType=JSON&audioEncoding=MP3', {method:'POST', body:JSON.stringify({input:j.text, voice:j.voice, speed})});
    const data = await res.json();
    if (!data.audioContent) throw new Error('No audio for "' + j.text + '"');
    fs.writeFileSync(file, Buffer.from(data.audioContent, 'base64'));
    record(); made++;
    console.log('made ' + set + ' ' + j.rel + '  ' + j.text);
    write();
    await sleep(400);
  }
  fs.mkdirSync(dir, {recursive:true});
  write();
  console.log('Set ' + set + (unit ? ' ' + unit : '') + ': made ' + made + ', kept ' + kept + '. Now bump VERSION in sw.js.');
}
main().catch(e => { console.error('Failed: ' + e.message); process.exit(1); });
