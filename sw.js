// Saves the whole game (pages, scripts, all 60 paintings) on first visit, then works offline.
'use strict';
var PREFIX = 'chya-kist:' + self.registration.scope + ':';
var CACHE = PREFIX + 'v2';
var FILES = [
  './', 'index.html', 'style.css', 'collection.js', 'game.js', 'app.js', 'manifest.json',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'paintings/435868.jpg',
  'paintings/435872.jpg',
  'paintings/435876.jpg',
  'paintings/435878.jpg',
  'paintings/435882.jpg',
  'paintings/436121.jpg',
  'paintings/436139.jpg',
  'paintings/436140.jpg',
  'paintings/436174.jpg',
  'paintings/436446.jpg',
  'paintings/436449.jpg',
  'paintings/436451.jpg',
  'paintings/436528.jpg',
  'paintings/436529.jpg',
  'paintings/436532.jpg',
  'paintings/436535.jpg',
  'paintings/436541.jpg',
  'paintings/436544.jpg',
  'paintings/436545.jpg',
  'paintings/436546.jpg',
  'paintings/436570.jpg',
  'paintings/436573.jpg',
  'paintings/436574.jpg',
  'paintings/436575.jpg',
  'paintings/437122.jpg',
  'paintings/437124.jpg',
  'paintings/437127.jpg',
  'paintings/437133.jpg',
  'paintings/437135.jpg',
  'paintings/437301.jpg',
  'paintings/437307.jpg',
  'paintings/437310.jpg',
  'paintings/437312.jpg',
  'paintings/437391.jpg',
  'paintings/437394.jpg',
  'paintings/437395.jpg',
  'paintings/437397.jpg',
  'paintings/437398.jpg',
  'paintings/437430.jpg',
  'paintings/437439.jpg',
  'paintings/437526.jpg',
  'paintings/437529.jpg',
  'paintings/437530.jpg',
  'paintings/437531.jpg',
  'paintings/437532.jpg',
  'paintings/437877.jpg',
  'paintings/437878.jpg',
  'paintings/437879.jpg',
  'paintings/437880.jpg',
  'paintings/437881.jpg',
  'paintings/437980.jpg',
  'paintings/437999.jpg',
  'paintings/438014.jpg',
  'paintings/438738.jpg',
  'paintings/438815.jpg',
  'paintings/438817.jpg',
  'paintings/438821.jpg',
  'paintings/459088.jpg',
  'paintings/459090.jpg',
  'paintings/459112.jpg',
];

self.addEventListener('install', function (event) {
  // Do not activate a partly downloaded collection or mix two app versions.
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.addAll(FILES.map(function (file) { return new Request(file, { cache: 'reload' }); }));
  }).catch(function (error) {
    return caches.delete(CACHE).then(function () { throw error; });
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      return key.indexOf(PREFIX) === 0 && key !== CACHE;
    }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (event) {
  if (!event.data || event.data.type !== 'CHECK_OFFLINE' || !event.source) return;
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return Promise.all(FILES.map(function (file) { return cache.match(file); }));
  }).then(function (entries) {
    event.source.postMessage({ type: 'OFFLINE_STATUS', ready: entries.every(Boolean) });
  }));
});

self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);
  if (event.request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith(caches.open(CACHE).then(function (cache) {
    return cache.match(event.request, { ignoreSearch: true });
  }).then(function (hit) { return hit || fetch(event.request); }));
});
