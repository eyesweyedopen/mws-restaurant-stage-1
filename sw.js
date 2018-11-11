let iterObj = {iter: 0};
let staticCacheName;

self.addEventListener("register", (e) => {
    iterObj.iter = 0;
    return new Response(e, {
        headers: {
            "Content-Type": "text/javascript"
        }
    });
});

self.addEventListener('install', (e) => {
    iterObj.iter++;
    staticCacheName = `SWv${iterObj.iter}`;
    console.log(staticCacheName);
    e.waitUntil(
        caches.open(staticCacheName).then((newCache) => {
            return newCache.add("img/*")
                .then((r) => console.log(r))
                .catch((err) => console.log(err));
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then( (cacheNames) => {
            return Promise.all(
                cacheNames.filter( (cacheName) => {
                    return cacheName != staticCacheName;
                }).map( (oldCacheName) => {
                    return caches.delete(oldCacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', (e) => {
    console.log(e);
    if (String(e.request).endsWith('.json')) {
        fetch(e.request).then(res => res.json()).then(json => {
            json.forEach(res => {
                caches.open(staticCacheName).then(cache => {
                    cache.add(res);
                })
            })
        })
    }

    e.respondWith(
        caches.match(e.request).then( (res) => {
            // if (res) {
            //     return res;
            // } else {
            //     caches.open(staticCacheName).then((cache) => {
            //         cache.add(e.request);
            //     })
            //     return fetch(e.request);
            // };
            return res || fetch(e.request).catch(err => console.error("Eroor: ", err));
        })
    );
});