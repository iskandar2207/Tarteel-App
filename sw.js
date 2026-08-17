const CACHE_NAME = 'tarteel-app-v1';

// Daftar file yang akan disimpan offline di HP pengguna
const urlsToCache = ['./', './index.html', './surah.html', './privacy.html', './style.css', './script.js', './surah.js', './Tarteel-removebg-preview.png'];

// Menginstall Service Worker dan menyimpan file ke Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Menampilkan data dari Cache saat offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache, tampilkan. Jika tidak, ambil dari internet
      return response || fetch(event.request);
    }),
  );
});
