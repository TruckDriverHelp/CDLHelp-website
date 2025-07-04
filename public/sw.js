const CACHE_NAME = 'cdlhelp-cache-v1';
const STATIC_ASSETS = [
  '/css/main.css',
  '/css/bootstrap.min.css',
  '/css/fontawesome.min.css',
  '/css/remixicon.css',
  '/css/animate.min.css',
  '/css/styles.css',
  '/images/logo.png',
  // Add other static assets here
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
