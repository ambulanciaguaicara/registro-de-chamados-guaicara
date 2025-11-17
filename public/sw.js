const CACHE_NAME = "ambulancia-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/css/styles.css",
  "/img/logo.png",
  "/img/fundo.jpg",
  "/icon-192.png",
  "/icon-512.png"
];

// Instala o service worker e adiciona arquivos ao cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativa e limpa caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Intercepta requisições e serve do cache quando offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
