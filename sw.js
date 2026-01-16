// sw.js
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Instalado');
});

self.addEventListener('fetch', (e) => {
    // Por enquanto, apenas responde com a rede normal
    e.respondWith(fetch(e.request));
});