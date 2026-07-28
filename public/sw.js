const CACHE = "onesim-v2";
const URLS = ["/", "/favicon.svg", "/manifest.json", "/images/GEN3RVTO.png", "/images/AYIHA-Boost.png", "/images/Vano-Baby.png", "/images/Ubiri.png", "/images/C-DACS-ong.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(URLS))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); clients.claim(); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((res) => {
      if (res.ok && /\.(png|svg|jpg|jpeg|webp|js|css|woff2?)$/i.test(e.request.url)) {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match("/")))
  );
});
