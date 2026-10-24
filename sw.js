// Offline cache for Labhair. Bump VERSION whenever you change any app file so phones pick up the update.
const VERSION = 'labhair-v8';
// Audio lives in its own long-lived cache (filled by the page, see warmAudio in app.js), so updates don't re-download it.
const AUDIO_CACHE = 'labhair-audio';
const FILES = ['./', './index.html', './styles.css', './app.js', './content.js', './content-c.js', './content-m.js', './course.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/abair-logo.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== AUDIO_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // MP3s: cache first. Their URLs change whenever the audio does (?h=…), so a cached copy is always current.
  if (url.pathname.endsWith('.mp3')){
    e.respondWith(caches.match(e.request.url).then(r => r || fetch(e.request.url).then(res => {
      if (res.status === 200){ const copy = res.clone(); caches.open(AUDIO_CACHE).then(c => c.put(e.request.url, copy)); }
      return res;
    })));
    return;
  }
  // Everything else: network first (so updates arrive), falling back to the cache when offline.
  e.respondWith(
    fetch(e.request).then(res => { if (res.status === 200){ const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); } return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
