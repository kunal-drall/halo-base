'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface PWAContextType {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: any;
  installApp: () => Promise<void>;
  updateApp: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
  cacheSize: number;
  clearCache: () => Promise<void>;
  isServiceWorkerSupported: boolean;
  isPushSupported: boolean;
  isBackgroundSyncSupported: boolean;
  isPeriodicSyncSupported: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

interface PWAProviderProps {
  children: ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [cacheSize, setCacheSize] = useState(0);
  const [isServiceWorkerSupported, setIsServiceWorkerSupported] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [isBackgroundSyncSupported, setIsBackgroundSyncSupported] = useState(false);
  const [isPeriodicSyncSupported, setIsPeriodicSyncSupported] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check service worker support
    if ('serviceWorker' in navigator) {
      setIsServiceWorkerSupported(true);
      registerServiceWorker();
    }

    // Check push notification support
    if ('PushManager' in window) {
      setIsPushSupported(true);
    }

    // Check background sync support
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      setIsBackgroundSyncSupported(true);
    }

    // Check periodic sync support
    if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
      setIsPeriodicSyncSupported(true);
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      toast.success('App installed successfully!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Check cache size periodically
    const checkCacheSize = async () => {
      if (navigator.serviceWorker) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration.active) {
            const messageChannel = new MessageChannel();
            const promise = new Promise<number>((resolve) => {
              messageChannel.port1.onmessage = (event) => {
                resolve(event.data.size);
              };
            });

            registration.active.postMessage(
              { type: 'GET_CACHE_SIZE' },
              [messageChannel.port2]
            );

            const size = await promise;
            setCacheSize(size);
          }
        } catch (error) {
          console.error('Failed to get cache size:', error);
        }
      }
    };

    checkCacheSize();
    const cacheSizeInterval = setInterval(checkCacheSize, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(cacheSizeInterval);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setIsUpdateAvailable(true);
              toast.info('App update available!', {
                action: {
                  label: 'Update',
                  onClick: updateApp
                }
              });
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_SIZE_UPDATE') {
          setCacheSize(event.data.size);
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const installApp = async () => {
    if (installPrompt) {
      try {
        const result = await installPrompt.prompt();
        console.log('Install prompt result:', result);
        
        if (result.outcome === 'accepted') {
          toast.success('App installation started');
        } else {
          toast.error('App installation cancelled');
        }
      } catch (error) {
        console.error('Failed to install app:', error);
        toast.error('Failed to install app');
      }
    }
  };

  const updateApp = () => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!isPushSupported) {
      toast.error('Push notifications are not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        toast.success('Notification permission granted');
        return true;
      } else {
        toast.error('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      toast.error('Failed to request notification permission');
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options
      });
    }
  };

  const clearCache = async () => {
    if (navigator.serviceWorker) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.active) {
          registration.active.postMessage({ type: 'CLEAR_CACHE' });
          toast.success('Cache cleared successfully');
        }
      } catch (error) {
        console.error('Failed to clear cache:', error);
        toast.error('Failed to clear cache');
      }
    }
  };

  const value: PWAContextType = {
    isInstalled,
    isInstallable,
    isOnline,
    isUpdateAvailable,
    installPrompt,
    installApp,
    updateApp,
    requestNotificationPermission,
    sendNotification,
    cacheSize,
    clearCache,
    isServiceWorkerSupported,
    isPushSupported,
    isBackgroundSyncSupported,
    isPeriodicSyncSupported
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}
