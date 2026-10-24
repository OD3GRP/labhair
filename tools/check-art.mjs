// Lists the real artwork in art/ and writes art/index.json, which the app reads to swap placeholders for real images.
//   node tools/check-art.mjs
// Reports what's missing per character, and any file over 120 KB.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = {window:{}, document:{}, fetch: () => Promise.reject(), matchMedia: () => ({matches:false})};
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'cast.js'), 'utf8'), sandbox);
const {CAST, EXPRESSIONS} = sandbox.window;

const files = [];
const walk = dir => {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir, {withFileTypes:true})){
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(webp|png)$/i.test(f.name)) files.push(path.relative(ROOT, p).split(path.sep).join('/'));
  }
};
walk(path.join(ROOT, 'art'));

let missing = 0;
for (const id of Object.keys(CAST)){
  const lack = EXPRESSIONS.filter(e => !files.includes('art/cast/' + id + '/' + e + '.webp'));
  missing += lack.length;
  console.log((lack.length ? '  ' : '✓ ') + id.padEnd(10) + (lack.length === EXPRESSIONS.length ? 'placeholder only' : lack.length ? 'missing: ' + lack.join(', ') : 'complete'));
}
for (const f of files){
  const kb = fs.statSync(path.join(ROOT, f)).size / 1024;
  if (kb > 120) console.log('⚠ ' + f + ' is ' + Math.round(kb) + ' KB, aim for under 60 KB');
}
fs.writeFileSync(path.join(ROOT, 'art', 'index.json'), JSON.stringify({files}, null, 1));
console.log(files.length + ' images listed in art/index.json; ' + missing + ' expressions still use placeholders.');
