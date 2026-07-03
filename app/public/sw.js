const CACHE_NAME = "career-guidance-v1";
const STATIC_ASSETS = [
  "/",
  "/recommendations",
  "/chatbot",
  "/formations",
  "/universities",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// Install: pre-cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Skip non-http requests
  if (!event.request.url.startsWith("http")) return;

  // Skip API routes — always go to network
  if (event.request.url.includes("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache a copy of the response
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return response;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request).then(
          (cached) => cached || caches.match("/")
        );
      })
  );
});
