// Change this version after editing cached files before publishing an update.
const CACHE_NAME = 'toy-haven-v5-accessibility';
const FILES = ['./', './index.html', './products.html', './cart.html', './checkout.html', './wishlist.html', './support.html', './style.css', './data.js', './app.js', './manifest.json', './images/icon.svg', './images/icon-192.png', './images/icon-512.png', './images/figurine.svg', './images/toys.svg', './images/board.svg', './images/car.svg', './images/products/iron-man.webp', './images/products/classic-bricks.webp', './images/products/catan.webp', './images/products/tesla.webp', './images/products/batman.webp', './images/products/monopoly.webp', './images/products/astronaut.webp', './images/products/dragon.webp', './images/products/teddy.webp', './images/products/rings.webp', './images/products/train.webp', './images/products/chess.webp', './images/products/snakes-ladders.webp', './images/products/camper.webp', './images/products/racing-coupe.webp', './images/products/pickup.webp'];
self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
    self.skipWaiting();
});
self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('toy-haven-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
// Network first: fetch the latest page online, or use its saved copy offline.
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request, { ignoreSearch: true }).then(cached => cached || Response.error())));
});
