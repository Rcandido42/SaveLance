const CACHE_NAME = 'savelance-cache-v1';
const assets = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json'
];

// Instalação do Service Worker e caching inicial de recursos essenciais
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Interceção de pedidos
self.addEventListener('fetch', (e) => {
  // Ignorar pedidos do Supabase, ligações HMR/dev ou extensões do Chrome para não quebrar a aplicação
  if (
    e.request.url.includes('supabase.co') || 
    e.request.url.includes('chrome-extension') || 
    e.request.url.includes('ws') || 
    e.request.url.includes('hot-reload')
  ) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
