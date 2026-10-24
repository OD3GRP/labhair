// Offline cache for Labhair. Bump VERSION whenever you change any app file so phones pick up the update.
const VERSION = 'labhair-v5';
const FILES = ['./', './index.html', './styles.css', './app.js', './content.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/abair-logo.svg'];

// Phrase audio: every file listed in audio/index.json, so lessons can be heard offline.
async function audioFiles(){
  try {
    const res = await fetch('./audio/index.json', {cache:'no-store'});
    if (!res.ok) return [];
    return ['./audio/index.json'].concat(Object.keys((await res.json()).files || {}).map(f => './audio/' + f));
  } catch(e){ return []; }
}
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(FILES);
    // One missing MP3 shouldn't stop the app installing, so add these one by one.
    await Promise.all((await audioFiles()).map(f => c.add(f).catch(() => {})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// App files: network first (so updates arrive), falling back to the cache when offline.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const save = res => { if (res.status === 200){ const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); } return res; };
  // MP3s only change when VERSION is bumped, so serve them from the cache first (also avoids partial 206 responses).
  if (url.pathname.endsWith('.mp3')){
    e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(r => r || fetch(e.request).then(save)));
    return;
  }
  e.respondWith(
    fetch(e.request).then(save)
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
