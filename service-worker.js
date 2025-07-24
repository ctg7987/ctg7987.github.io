const CACHE_NAME = 'calvin-portfolio-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/parallax.js',
  '/css/main.css',
  '/img/profile-pic.JPG',
  '/img/ai-hand.jpg',
  '/img/futuristic-lights.jpg',
  '/img/museum-of-the-future.jpg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Chewy&family=Fredoka:wght@400;700&family=Caveat:wght@700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        var fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            var responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});
