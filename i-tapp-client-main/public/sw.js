// Minimal service worker for installability (Microsoft Store / PWABuilder
// packaging needs a registered SW with a fetch handler) and a bit of
// offline resilience. Deliberately simple - not a full offline-first
// cache strategy, just enough for store packaging + basic asset caching.

const CACHE_NAME = "placeit-shell-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Only cache same-origin, successful responses.
          if (response.ok && new URL(event.request.url).origin === self.location.origin) {
            cache.put(event.request, copy);
          }
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
