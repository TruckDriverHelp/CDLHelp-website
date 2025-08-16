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
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) protocols
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(error => {
          // Silently fail for fetch errors (offline, etc)
          // Return a basic offline response if available
          if (event.request.destination === 'document') {
            // Could return an offline page here if cached
          }
          return new Response('', { status: 503, statusText: 'Service Unavailable' });
        })
      );
    })
  );
});
