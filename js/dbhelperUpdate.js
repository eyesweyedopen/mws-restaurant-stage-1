  /**
   * Register service worker
   */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js');
  });
}

class DBHelper {
    static fetchRestaurants(c) {
        let url = new URL(window.location.href);
        fetch(`${url.origin}/data/restaurants.json`).then((res) => {
            return res.json();
        }).then((restaurants) => {
            restaurants.forEach((restaurant) => {
                fetchRestaurantById(restaurant)
            })
        })
    }
}