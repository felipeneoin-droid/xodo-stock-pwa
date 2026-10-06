const CACHE_NAME="xodo-stock-v5-13";
const STATIC=["./manifest.json","./api.js","./xodo-stock-icon-192.png","./xodo-stock-icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(STATIC)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;const u=new URL(e.request.url);if(u.hostname.includes("script.google.com")||u.hostname.includes("script.googleusercontent.com"))return;const page=e.request.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("/index.html");if(page){e.respondWith(fetch(e.request,{cache:"no-store"}).catch(()=>caches.match(e.request)));return;}e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,x));return r;}).catch(()=>caches.match(e.request)));});
