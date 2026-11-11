const CACHE_NAME = 'parazyto-pwa-v3';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalacja i zapisanie w pamięci
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// Aktywacja i czyszczenie starego cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Serwowanie plików z pamięci podręcznej (działanie offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Jeśli nie ma sieci, a pliku nie ma w cache, zwróć główną stronę
        return caches.match('./index.html');
      });
    })
  );
});