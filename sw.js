// sw.js
const CACHE_NAME = "chamados-cache-v1";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./login.html",
  "./logout.html",
  "./css/styles.css",
  "./src/main.js",
  "./manifest.json"
];

// Instala e faz cache inicial
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  clients.claim();
});

// Intercepta requisições e serve do cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
