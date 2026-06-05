const CACHE = "turfpro-v2";
const OFFLINE_URL = "/offline.html";
const CRITICAL_ASSETS = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", OFFLINE_URL];

// Install event — cache critical assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker");
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      console.log("[SW] Caching critical assets");
      return cache.addAll(CRITICAL_ASSETS).then(() => {
        self.skipWaiting();
      });
    })
  );
});

// Activate event — clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event — network first with fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  
  // Skip non-GET requests and external origins
  if (request.method !== "GET") return;
  
  // Different strategies for different resource types
  if (request.destination === "image" || request.destination === "font") {
    // Cache-first for images and fonts
    event.respondWith(cacheFirstStrategy(request));
  } else if (request.destination === "script" || request.destination === "style") {
    // Cache-first for JS and CSS
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // Network-first for documents and API calls
    event.respondWith(networkFirstStrategy(request));
  }
});

// Network first strategy
function networkFirstStrategy(request) {
  return fetch(request)
    .then((response) => {
      // Cache successful responses
      if (response && response.status === 200 && request.url.startsWith(self.location.origin)) {
        const responseClone = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, responseClone));
      }
      return response;
    })
    .catch(() => {
      // Fallback to cache or offline page
      return caches.match(request).then((cached) => {
        if (cached) return cached;
        if (isNavigationRequest(request)) {
          return caches.match(OFFLINE_URL);
        }
        return null;
      });
    });
}

// Cache first strategy
function cacheFirstStrategy(request) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      if (response && response.status === 200 && request.url.startsWith(self.location.origin)) {
        const responseClone = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, responseClone));
      }
      return response;
    }).catch(() => {
      // Return cached version or nothing
      return caches.match(request);
    });
  });
}

function isNavigationRequest(request) {
  return request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html");
}

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "TurfPro Update",
    body: "You have a new booking update.",
    icon: "/icon-192.png",
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: "/icon-192.png",
      tag: "turfpro-notification",
      requireInteraction: false,
    })
  );
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // If window exists, focus it
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
