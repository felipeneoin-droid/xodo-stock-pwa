const CACHE_NAME="xodo-stock-v5-14";
self.addEventListener("install",e=>{self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;const u=new URL(e.request.url);if(u.hostname.includes("script.google.com")||u.hostname.includes("script.googleusercontent.com"))return;if(e.request.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("/index.html")){e.respondWith(fetch(e.request,{cache:"no-store"}));return;}e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
