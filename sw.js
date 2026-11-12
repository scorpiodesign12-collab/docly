/* Docly — офлайн-режим. Положите рядом с index.html. Работает на https (GitHub Pages и т.п.) */
const V='docly-v2',PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
const PRE=['./','index.html',PDFJS+'pdf.min.js',PDFJS+'pdf.worker.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(PRE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,res)=>{if(res&&(res.status===200||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{})}return res};
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const same=new URL(r.url).origin===location.origin;
 if(same){
  e.respondWith(fetch(r).then(res=>put(r,res)).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):Response.error()))));
 }else{
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put(r,res))));
 }
});
