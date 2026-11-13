const CACHE_NAME = 'parazyto-pwa-v21';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalacja Service Workera i zapisanie plików w pamięci podręcznej (cache)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Zapisywanie plików w cache...');
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// Aktywacja nowej wersji Service Workera i czyszczenie starych wersji cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Usuwanie starego cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Przechwytywanie zapytań sieciowych (działanie offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Jeśli brak sieci i szukany zasób to strona HTML, serwuj index.html z cache
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
