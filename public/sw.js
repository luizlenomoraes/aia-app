const CACHE_NAME = "aia-app-offline-v2"; // Incrementamos a versão para forçar atualização

// Instalação: Cacheia arquivos estáticos essenciais
self.addEventListener("install", (event) => {
  // O skipWaiting aqui faz com que o SW assuma o controle imediatamente se possível,
  // mas para apps complexos é melhor deixar o usuário controlar (via botão) ou recarregar.
  // self.skipWaiting(); 
  console.log("[Service Worker] Instalando nova versão...");
});

// Ativação: Limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de Rede
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback se necessário
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Escuta mensagem para forçar atualização (Skip Waiting)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
