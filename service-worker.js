self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('cg-portfolio-v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/img/profile-pic.JPG',
        '/img/ai-hand.jpg',
        '/img/futuristic-lights.jpg',
        '/img/museum-of-the-future.jpg',
        '/vid/fire-works.mp4',
        '/vid/girl-talking-to-robot.mp4',
        '/vid/tech-globe-vid.mp4'
      ]);
    })
  );
});
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
