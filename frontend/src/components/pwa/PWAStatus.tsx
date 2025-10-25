'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { usePWA } from './PWAProvider';
import { formatBytes } from '@/lib/utils';
import { 
  Download, 
  X, 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Bell, 
  BellOff, 
  RefreshCw, 
  Settings, 
  Info, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Shield, 
  Star, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  Share, 
  MoreHorizontal, 
  LogOut, 
  Wallet, 
  Key, 
  Globe, 
  Lock, 
  Unlock, 
  Zap as ZapIcon, 
  Flame, 
  Gem, 
  Diamond, 
  Trophy, 
  Medal, 
  Ribbon, 
  Award, 
  Target, 
  Activity, 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  X as XIcon, 
  Check, 
  AlertTriangle, 
  CheckCircle as CheckCircleIcon, 
  AlertCircle as AlertCircleIcon, 
  Info as InfoIcon, 
  Heart as HeartIcon, 
  Bookmark as BookmarkIcon, 
  MessageCircle as MessageCircleIcon, 
  Share as ShareIcon, 
  MoreHorizontal as MoreHorizontalIcon, 
  LogOut as LogOutIcon, 
  Wallet as WalletIcon, 
  Key as KeyIcon, 
  Globe as GlobeIcon, 
  Lock as LockIcon, 
  Unlock as UnlockIcon
} from 'lucide-react';

interface PWAStatusProps {
  showDetails?: boolean;
  showActions?: boolean;
  className?: string;
}

export function PWAStatus({
  showDetails = true,
  showActions = true,
  className = ''
}: PWAStatusProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);

  const {
    isInstalled,
    isInstallable,
    isOnline,
    isUpdateAvailable,
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
  } = usePWA();

  const handleInstall = async () => {
    try {
      await installApp();
    } catch (error) {
      console.error('Failed to install app:', error);
    }
  };

  const handleUpdate = () => {
    try {
      updateApp();
    } catch (error) {
      console.error('Failed to update app:', error);
    }
  };

  const handleRequestNotifications = async () => {
    try {
      await requestNotificationPermission();
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  const handleTestNotification = () => {
    sendNotification('Test Notification', {
      body: 'This is a test notification from Halo Protocol',
      tag: 'test-notification'
    });
  };

  const handleClearCache = async () => {
    try {
      setIsClearingCache(true);
      await clearCache();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setIsClearingCache(false);
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean, label: string) => {
    return status ? (
      <Badge variant="success">{label}</Badge>
    ) : (
      <Badge variant="error">{label}</Badge>
    );
  };

  const getConnectionStatus = () => {
    return isOnline ? (
      <div className="flex items-center space-x-2">
        <Wifi className="h-4 w-4 text-green-500" />
        <span className="text-sm text-green-500">Online</span>
      </div>
    ) : (
      <div className="flex items-center space-x-2">
        <WifiOff className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-500">Offline</span>
      </div>
    );
  };

  const getNotificationStatus = () => {
    const permission = Notification.permission;
    
    switch (permission) {
      case 'granted':
        return (
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-500">Enabled</span>
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center space-x-2">
            <BellOff className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-500">Denied</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-500">Not Requested</span>
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>PWA Status</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <X className="h-4 w-4" />
            ) : (
              <Info className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">App Status</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(isInstalled)}
              {getStatusBadge(isInstalled, isInstalled ? 'Installed' : 'Not Installed')}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Connection</span>
            {getConnectionStatus()}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Notifications</span>
            {getNotificationStatus()}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Cache Size</span>
            <span className="text-sm font-medium">{formatBytes(cacheSize)}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2">
            {!isInstalled && isInstallable && (
              <Button
                onClick={handleInstall}
                size="sm"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}

            {isUpdateAvailable && (
              <Button
                onClick={handleUpdate}
                size="sm"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update App
              </Button>
            )}

            {Notification.permission !== 'granted' && (
              <Button
                variant="outline"
                onClick={handleRequestNotifications}
                size="sm"
                className="flex-1"
              >
                <Bell className="h-4 w-4 mr-2" />
                Enable Notifications
              </Button>
            )}

            {Notification.permission === 'granted' && (
              <Button
                variant="outline"
                onClick={handleTestNotification}
                size="sm"
                className="flex-1"
              >
                <Bell className="h-4 w-4 mr-2" />
                Test Notification
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleClearCache}
              disabled={isClearingCache}
              size="sm"
              className="flex-1"
            >
              {isClearingCache ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Clear Cache
            </Button>
          </div>
        )}

        {/* Detailed Information */}
        <AnimatePresence>
          {isExpanded && showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pt-4 border-t border-border"
            >
              <div>
                <h4 className="text-sm font-medium mb-2">Feature Support</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Service Worker</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(isServiceWorkerSupported)}
                      <span className="text-sm">{isServiceWorkerSupported ? 'Supported' : 'Not Supported'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Push Notifications</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(isPushSupported)}
                      <span className="text-sm">{isPushSupported ? 'Supported' : 'Not Supported'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Background Sync</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(isBackgroundSyncSupported)}
                      <span className="text-sm">{isBackgroundSyncSupported ? 'Supported' : 'Not Supported'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Periodic Sync</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(isPeriodicSyncSupported)}
                      <span className="text-sm">{isPeriodicSyncSupported ? 'Supported' : 'Not Supported'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Cache Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Total Cache Size</span>
                    <span className="text-sm font-medium">{formatBytes(cacheSize)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Cache Status</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">App Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Version</span>
                    <span className="text-sm font-medium">1.0.0</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Platform</span>
                    <span className="text-sm font-medium">
                      {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                        ? 'Mobile' 
                        : 'Desktop'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Display Mode</span>
                    <span className="text-sm font-medium">
                      {window.matchMedia('(display-mode: standalone)').matches 
                        ? 'Standalone' 
                        : 'Browser'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
