'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { usePWA } from './PWAProvider';
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

interface PWAInstallProps {
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
  autoShow?: boolean;
  className?: string;
}

export function PWAInstall({
  showOnMobile = true,
  showOnDesktop = true,
  autoShow = true,
  className = ''
}: PWAInstallProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    isInstalled,
    isInstallable,
    isOnline,
    isUpdateAvailable,
    installApp,
    updateApp,
    requestNotificationPermission,
    isServiceWorkerSupported,
    isPushSupported
  } = usePWA();

  useEffect(() => {
    // Check if we should show the install prompt
    const shouldShow = () => {
      if (isDismissed) return false;
      if (isInstalled) return false;
      if (!isInstallable) return false;
      if (!isOnline) return false;
      if (!isServiceWorkerSupported) return false;
      
      // Check device type
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isDesktop = !isMobile;
      
      if (isMobile && !showOnMobile) return false;
      if (isDesktop && !showOnDesktop) return false;
      
      return true;
    };

    if (shouldShow() && autoShow) {
      setIsVisible(true);
    }
  }, [isInstalled, isInstallable, isOnline, isDismissed, showOnMobile, showOnDesktop, autoShow, isServiceWorkerSupported]);

  const handleInstall = async () => {
    try {
      setIsInstalling(true);
      await installApp();
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to install app:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleUpdate = () => {
    try {
      setIsUpdating(true);
      updateApp();
    } catch (error) {
      console.error('Failed to update app:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    
    // Store dismissal in localStorage
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleRequestNotifications = async () => {
    try {
      await requestNotificationPermission();
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  // Check if user has previously dismissed the prompt
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (!isVisible && !isUpdateAvailable) {
    return null;
  }

  return (
    <AnimatePresence>
      {(isVisible || isUpdateAvailable) && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto ${className}`}
        >
          <Card className="shadow-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {isUpdateAvailable ? (
                    <RefreshCw className="h-6 w-6 text-blue-500" />
                  ) : (
                    <Download className="h-6 w-6 text-primary" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {isUpdateAvailable ? 'Update Available' : 'Install Halo Protocol'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismiss}
                      className="p-1 h-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-text-secondary mb-3">
                    {isUpdateAvailable 
                      ? 'A new version of the app is available. Update now for the latest features and improvements.'
                      : 'Install Halo Protocol on your device for a better experience with offline access and push notifications.'
                    }
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <Wifi className="h-3 w-3" />
                      <span>Offline access</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <Bell className="h-3 w-3" />
                      <span>Push notifications</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <Zap className="h-3 w-3" />
                      <span>Faster loading</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <Shield className="h-3 w-3" />
                      <span>Enhanced security</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {isUpdateAvailable ? (
                      <Button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="flex-1"
                        size="sm"
                      >
                        {isUpdating ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Update Now
                      </Button>
                    ) : (
                      <Button
                        onClick={handleInstall}
                        disabled={isInstalling}
                        className="flex-1"
                        size="sm"
                      >
                        {isInstalling ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Install
                      </Button>
                    )}
                    
                    {!isUpdateAvailable && (
                      <Button
                        variant="outline"
                        onClick={handleRequestNotifications}
                        size="sm"
                        className="px-3"
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
