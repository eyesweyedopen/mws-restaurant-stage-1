self.addEventListener("register", (e) => {
    iterObj.iter = 0;
    return new Response(e, {
        headers: {
            "Content-Type": "text/javascript"
        }
    });
});

self.addEventListener('install', (e) => {
    staticCacheName = `SWv1`;
    e.waitUntil(
        caches.open(staticCacheName).then((newCache) => {
            return newCache.addAll("*")
                .then((r) => console.log("request: " + r))
                .catch((err) => console.log(err));
        })
    );
});

self.addEventListener('fetch', (e) => {

        // if (String(e.request).endsWith('.json')) {
        //     e.waitUntil(
        //         fetch(e.request).then(res => res.json()).then(json => {
        //             json.forEach(res => {
        //                 caches.open(staticCacheName).then(cache => {
        //                     cache.put(e.request, res);
        //                 })
        //             })
        //         })
        //     )
        // }

    e.respondWith(
        caches.open('SWv1').then((cache) => {
            return cache.match(e.request).then( (res) => {
                if (res) {
                    return res;
                }
                
                caches.open(staticCacheName).then((cache) => {
                //         cache.add(e.request);
                //     })
                //     return fetch(e.request);
                // };
                    return fetch(e.request).then((netRes) => {
                        console.log("netRes: " + netRes);
                        cache.put(e.request, netRes.clone());
                        return netRes;
                    })
                }).catch((err) => {
                    console.error('Error in fetch handler:', err);
                
                    throw err;
                });
            });
        })
    );
});