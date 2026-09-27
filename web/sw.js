/* Wallet offline copy: network first (so updates arrive), saved copy when offline or the server is off */
const CACHE="wallet-offline-v2";
const PAGE=new URL("./",self.registration.scope).href;
const ASSETS=["./","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png"].map(p=>new URL(p,self.registration.scope).href);
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener("fetch",e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method!=="GET"||url.origin!==location.origin||url.searchParams.has("ping"))return;
  const key=req.mode==="navigate"?PAGE:req.url.split("?")[0];
  e.respondWith(
    fetch(req,{cache:"no-store"}).then(r=>{
      if(r&&r.status===200){const cp=r.clone();caches.open(CACHE).then(c=>c.put(key,cp));}
      return r;
    }).catch(()=>caches.match(key).then(m=>m||caches.match(PAGE)).then(m=>m||Response.error()))
  );
});
