/* BüroBrücke Service Worker – Push Notifications für Frist-Erinnerungen */
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'BüroBrücke';
  const options = {
    body:    data.body    || 'Du hast eine Frist-Erinnerung.',
    icon:    data.icon    || '/favicon.svg',
    badge:   '/favicon.svg',
    tag:     data.tag     || 'buerbruecke-reminder',
    data:    { url: data.url || '/' },
    actions: [{ action: 'open', title: 'Brief ansehen' }],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const existing = clients.find(c => c.url.includes(self.location.origin));
      if (existing) { existing.focus(); existing.navigate(url); }
      else self.clients.openWindow(url);
    })
  );
});

/* Offline-Cache */
const CACHE = 'buerbruecke-v1';
const PRECACHE = ['/', '/demo', '/glossar', '/faq'];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE).catch(() => {}))
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
