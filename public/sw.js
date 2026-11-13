const CACHE='eagleos-shell-v1';
const FILES=['/','/index.html','/manifest.webmanifest','/eagle-icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==self.location.origin)return;
 if(u.pathname.startsWith('/__/')||u.pathname.includes('firestore')||u.pathname.includes('identitytoolkit'))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put('/index.html',c));}return res;}).catch(()=>caches.match('/index.html').then(x=>x||caches.match('/'))));return;}
 if(u.pathname.startsWith('/assets/'))e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(y=>y.put(r,c));}return res;})));
});
