'use client';

import { useEffect, useState } from 'react';

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticConfig {
  enabled: boolean;
  intensity: 'low' | 'medium' | 'high';
}

export function useHaptic() {
  const [isSupported, setIsSupported] = useState(false);
  const [config, setConfig] = useState<HapticConfig>({
    enabled: true,
    intensity: 'medium',
  });

  useEffect(() => {
    // Check if haptic feedback is supported
    const checkSupport = () => {
      const hasVibration = 'vibrate' in navigator;
      const hasCapacitor = !!(window as any).Capacitor?.Plugins?.Haptics;
      const hasWebkitHaptic = !!(window as any).webkit?.messageHandlers?.haptic;
      
      setIsSupported(hasVibration || hasCapacitor || hasWebkitHaptic);
    };

    checkSupport();
    
    // Listen for Capacitor ready event
    document.addEventListener('CapacitorReady', checkSupport);
    
    return () => {
      document.removeEventListener('CapacitorReady', checkSupport);
    };
  }, []);

  const trigger = (style: HapticStyle = 'light') => {
    if (!isSupported || !config.enabled) return;

    // iOS Haptic Engine (via Capacitor)
    if ((window as any).Capacitor?.Plugins?.Haptics) {
      const Haptics = (window as any).Capacitor.Plugins.Haptics;
      
      try {
        switch (style) {
          case 'light':
            Haptics.impact({ style: 'LIGHT' });
            break;
          case 'medium':
            Haptics.impact({ style: 'MEDIUM' });
            break;
          case 'heavy':
            Haptics.impact({ style: 'HEAVY' });
            break;
          case 'success':
            Haptics.notification({ type: 'SUCCESS' });
            break;
          case 'warning':
            Haptics.notification({ type: 'WARNING' });
            break;
          case 'error':
            Haptics.notification({ type: 'ERROR' });
            break;
        }
      } catch (error) {
        console.warn('Haptic feedback failed:', error);
      }
      return;
    }

    // WebKit Haptic (iOS Safari)
    if ((window as any).webkit?.messageHandlers?.haptic) {
      const haptic = (window as any).webkit.messageHandlers.haptic;
      
      try {
        switch (style) {
          case 'light':
            haptic.postMessage({ type: 'impact', style: 'light' });
            break;
          case 'medium':
            haptic.postMessage({ type: 'impact', style: 'medium' });
            break;
          case 'heavy':
            haptic.postMessage({ type: 'impact', style: 'heavy' });
            break;
          case 'success':
            haptic.postMessage({ type: 'notification', style: 'success' });
            break;
          case 'warning':
            haptic.postMessage({ type: 'notification', style: 'warning' });
            break;
          case 'error':
            haptic.postMessage({ type: 'notification', style: 'error' });
            break;
        }
      } catch (error) {
        console.warn('WebKit haptic feedback failed:', error);
      }
      return;
    }

    // Fallback to Vibration API
    if ('vibrate' in navigator) {
      const patterns: Record<HapticStyle, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 30,
        success: [10, 50, 10],
        warning: [20, 100, 20],
        error: [30, 100, 30, 100, 30],
      };
      
      try {
        navigator.vibrate(patterns[style]);
      } catch (error) {
        console.warn('Vibration API failed:', error);
      }
    }
  };

  const updateConfig = (newConfig: Partial<HapticConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const testHaptic = () => {
    trigger('medium');
  };

  return { 
    trigger, 
    isSupported, 
    config, 
    updateConfig, 
    testHaptic 
  };
}

// Haptic feedback for specific interactions
export const hapticPatterns = {
  // Button interactions
  buttonPress: 'light' as HapticStyle,
  buttonRelease: 'light' as HapticStyle,
  
  // Navigation
  tabSwitch: 'light' as HapticStyle,
  backButton: 'light' as HapticStyle,
  
  // Gestures
  swipeStart: 'light' as HapticStyle,
  swipeEnd: 'medium' as HapticStyle,
  pullToRefresh: 'medium' as HapticStyle,
  
  // Actions
  paymentSuccess: 'success' as HapticStyle,
  paymentError: 'error' as HapticStyle,
  circleJoin: 'success' as HapticStyle,
  circleLeave: 'warning' as HapticStyle,
  
  // Notifications
  newMessage: 'light' as HapticStyle,
  paymentDue: 'warning' as HapticStyle,
  circleComplete: 'success' as HapticStyle,
  
  // Errors
  networkError: 'error' as HapticStyle,
  validationError: 'warning' as HapticStyle,
  authenticationError: 'error' as HapticStyle,
};

export default useHaptic;
