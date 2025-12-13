const CACHE_NAME = 'sema-ap-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.tsx',
  './manifest.json',
  './logo.png',
  './src/App.tsx',
  './src/types.ts',
  './src/context/AppContext.tsx',
  './src/data/infractions.ts',
  './src/components/Calculator.tsx',
  './src/components/InfractionList.tsx',
  './src/components/Report.tsx'
];

// Instalação: Cacheia os arquivos principais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Tenta cachear arquivos locais. Arquivos externos (CDN) serão cacheados dinamicamente.
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições: Estratégia Stale-While-Revalidate
// Usa o cache se disponível, mas busca na rede em background para atualizar
self.addEventListener('fetch', (event) => {
  // Apenas requisições GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Se a resposta for válida, atualiza o cache
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Se falhar (offline) e não tiver cache, não faz nada (retorna o que tem ou erro)
        });

        // Retorna o cache primeiro, ou espera a rede se não tiver cache
        return cachedResponse || fetchPromise;
      });
    })
  );
});