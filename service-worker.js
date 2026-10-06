const CACHE_NAME = "xodo-stock-v5-11";
const APP_SHELL = ["./manifest.json","./api.js","./xodo-stock-icon-192.png","./xodo-stock-icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.hostname.includes("script.google.com") || u.hostname.includes("script.googleusercontent.com")) return;
  const isPage = e.request.mode === "navigate" || u.pathname.endsWith("/") || u.pathname.endsWith("/index.html");
  if (isPage) {
    e.respondWith(fetch(e.request, {cache:"no-store"}).then(r => r).catch(() => caches.match("./index.html").then(r => r || caches.match("./"))));
    return;
  }
  e.respondWith(fetch(e.request).then(r => { const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)); return r; }).catch(()=>caches.match(e.request)));
});
