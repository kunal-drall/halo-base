// Halo Protocol Service Worker
// Version: 1.0.0
// Last Updated: 2024-01-20

const CACHE_NAME = 'halo-protocol-v1.0.0';
const STATIC_CACHE_NAME = 'halo-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'halo-dynamic-v1.0.0';
const API_CACHE_NAME = 'halo-api-v1.0.0';

// Cache strategies
const CACHE_STRATEGIES = {
  // Static assets - cache first
  STATIC: 'cache-first',
  // API calls - network first with cache fallback
  API: 'network-first',
  // HTML pages - network first with cache fallback
  HTML: 'network-first',
  // Images - cache first with network fallback
  IMAGES: 'cache-first'
};

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/discover',
  '/create',
  '/my-circles',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/trust-score',
  '/api/circles',
  '/api/contributions',
  '/api/yield'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle different cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Determine cache strategy based on request type
  const strategy = getCacheStrategy(request);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Get cache strategy based on request
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Static assets
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return CACHE_STRATEGIES.STATIC;
  }
  
  // API calls
  if (url.pathname.startsWith('/api/')) {
    return CACHE_STRATEGIES.API;
  }
  
  // HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    return CACHE_STRATEGIES.HTML;
  }
  
  // Images
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
    return CACHE_STRATEGIES.IMAGES;
  }
  
  // Default to network first
  return CACHE_STRATEGIES.API;
}

// Handle request based on strategy
async function handleRequest(request, strategy) {
  const url = new URL(request.url);
  
  try {
    switch (strategy) {
      case CACHE_STRATEGIES.STATIC:
        return await cacheFirst(request, STATIC_CACHE_NAME);
      
      case CACHE_STRATEGIES.API:
        return await networkFirst(request, API_CACHE_NAME);
      
      case CACHE_STRATEGIES.HTML:
        return await networkFirst(request, DYNAMIC_CACHE_NAME);
      
      case CACHE_STRATEGIES.IMAGES:
        return await cacheFirst(request, DYNAMIC_CACHE_NAME);
      
      default:
        return await networkFirst(request, DYNAMIC_CACHE_NAME);
    }
  } catch (error) {
    console.error('[SW] Error handling request:', error);
    
    // Fallback to offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return await caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    // Return cached version if available
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response
    return new Response('Network error', { status: 503 });
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network error in cache first:', error);
    throw error;
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'contribution-sync') {
    event.waitUntil(syncContributions());
  } else if (event.tag === 'trust-score-sync') {
    event.waitUntil(syncTrustScore());
  }
});

// Sync contributions when back online
async function syncContributions() {
  try {
    const contributions = await getStoredContributions();
    
    for (const contribution of contributions) {
      try {
        await fetch('/api/contributions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contribution)
        });
        
        // Remove from storage after successful sync
        await removeStoredContribution(contribution.id);
      } catch (error) {
        console.error('[SW] Failed to sync contribution:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync trust score updates when back online
async function syncTrustScore() {
  try {
    const trustScoreUpdates = await getStoredTrustScoreUpdates();
    
    for (const update of trustScoreUpdates) {
      try {
        await fetch('/api/trust-score', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(update)
        });
        
        // Remove from storage after successful sync
        await removeStoredTrustScoreUpdate(update.id);
      } catch (error) {
        console.error('[SW] Failed to sync trust score update:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Trust score sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: data.tag || 'halo-notification',
      data: data.data,
      actions: data.actions || [
        {
          action: 'view',
          title: 'View',
          icon: '/icons/action-view.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/action-dismiss.png'
        }
      ],
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
      timestamp: Date.now()
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      
      case 'CACHE_URLS':
        event.waitUntil(cacheUrls(event.data.urls));
        break;
      
      case 'CLEAR_CACHE':
        event.waitUntil(clearCache(event.data.cacheName));
        break;
      
      case 'GET_CACHE_SIZE':
        event.waitUntil(getCacheSize().then(size => {
          event.ports[0].postMessage({ size });
        }));
        break;
      
      default:
        console.log('[SW] Unknown message type:', event.data.type);
    }
  }
});

// Cache specific URLs
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.error('[SW] Failed to cache URL:', url, error);
    }
  }
}

// Clear specific cache
async function clearCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  for (const key of keys) {
    await cache.delete(key);
  }
}

// Get cache size
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

// Helper functions for IndexedDB operations
async function getStoredContributions() {
  // Implementation would use IndexedDB to get stored contributions
  return [];
}

async function removeStoredContribution(id) {
  // Implementation would use IndexedDB to remove stored contribution
}

async function getStoredTrustScoreUpdates() {
  // Implementation would use IndexedDB to get stored trust score updates
  return [];
}

async function removeStoredTrustScoreUpdate(id) {
  // Implementation would use IndexedDB to remove stored trust score update
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync triggered:', event.tag);
  
  if (event.tag === 'trust-score-update') {
    event.waitUntil(updateTrustScores());
  } else if (event.tag === 'circle-sync') {
    event.waitUntil(syncCircles());
  }
});

// Update trust scores periodically
async function updateTrustScores() {
  try {
    await fetch('/api/trust-score/update', { method: 'POST' });
  } catch (error) {
    console.error('[SW] Failed to update trust scores:', error);
  }
}

// Sync circles periodically
async function syncCircles() {
  try {
    await fetch('/api/circles/sync', { method: 'POST' });
  } catch (error) {
    console.error('[SW] Failed to sync circles:', error);
  }
}

console.log('[SW] Service worker loaded successfully');
