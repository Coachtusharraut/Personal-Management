const CACHE='lifeos-shell-v1';
const SHELL=['/','/index.html','/manifest.webmanifest','/lifeos-icon.svg'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.startsWith('/__/')||url.pathname.includes('firestore')||url.pathname.includes('identitytoolkit'))return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(res=>{
   if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('/index.html',copy));}
   return res;
  }).catch(()=>caches.match('/index.html').then(hit=>hit||caches.match('/'))));
  return;
 }
 if(url.pathname.startsWith('/assets/')){
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
   if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
   return res;
  })));
 }
});
