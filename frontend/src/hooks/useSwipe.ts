'use client';

import { useRef, useState, useCallback } from 'react';
import { useHaptic } from './useHaptic';

interface SwipeConfig {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  enableHaptic?: boolean;
  preventDefault?: boolean;
}

interface SwipeState {
  isDragging: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

export function useSwipe(config: SwipeConfig = {}) {
  const {
    threshold = 50,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipeStart,
    onSwipeEnd,
    enableHaptic = true,
    preventDefault = true,
  } = config;

  const { trigger } = useHaptic();
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    direction: null,
    distance: 0,
    velocity: 0,
  });

  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number; time: number } | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const calculateDistance = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  };

  const calculateVelocity = (start: { x: number; y: number; time: number }, end: { x: number; y: number; time: number }) => {
    const distance = calculateDistance(start, end);
    const time = end.time - start.time;
    return time > 0 ? distance / time : 0;
  };

  const getSwipeDirection = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  };

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }

    const touch = e.targetTouches[0];
    const touchData = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    setTouchStart(touchData);
    setTouchEnd(null);
    touchStartRef.current = touchData;

    setSwipeState(prev => ({
      ...prev,
      isDragging: true,
      direction: null,
      distance: 0,
      velocity: 0,
    }));

    onSwipeStart?.();
    
    if (enableHaptic) {
      trigger('light');
    }
  }, [preventDefault, onSwipeStart, enableHaptic, trigger]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    if (preventDefault) {
      e.preventDefault();
    }

    const touch = e.targetTouches[0];
    const touchData = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    setTouchEnd(touchData);

    const distance = calculateDistance(touchStartRef.current, touchData);
    const velocity = calculateVelocity(touchStartRef.current, touchData);
    const direction = getSwipeDirection(touchStartRef.current, touchData);

    setSwipeState(prev => ({
      ...prev,
      direction,
      distance,
      velocity,
    }));
  }, [preventDefault]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) {
      setSwipeState(prev => ({ ...prev, isDragging: false }));
      return;
    }

    const distanceX = touchEnd.x - touchStart.x;
    const distanceY = touchEnd.y - touchStart.y;
    const absDistanceX = Math.abs(distanceX);
    const absDistanceY = Math.abs(distanceY);
    const isHorizontalSwipe = absDistanceX > absDistanceY;
    const isVerticalSwipe = absDistanceY > absDistanceX;

    // Determine if swipe meets threshold
    const meetsThreshold = isHorizontalSwipe ? absDistanceX > threshold : absDistanceY > threshold;

    if (meetsThreshold) {
      if (isHorizontalSwipe) {
        if (distanceX > 0) {
          onSwipeRight?.();
          if (enableHaptic) trigger('medium');
        } else {
          onSwipeLeft?.();
          if (enableHaptic) trigger('medium');
        }
      } else if (isVerticalSwipe) {
        if (distanceY > 0) {
          onSwipeDown?.();
          if (enableHaptic) trigger('medium');
        } else {
          onSwipeUp?.();
          if (enableHaptic) trigger('medium');
        }
      }
    }

    setSwipeState(prev => ({ ...prev, isDragging: false }));
    onSwipeEnd?.();
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onSwipeEnd, enableHaptic, trigger]);

  // Mouse events for desktop testing
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }

    const mouseData = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };

    setTouchStart(mouseData);
    setTouchEnd(null);
    touchStartRef.current = mouseData;

    setSwipeState(prev => ({
      ...prev,
      isDragging: true,
      direction: null,
      distance: 0,
      velocity: 0,
    }));

    onSwipeStart?.();
  }, [preventDefault, onSwipeStart]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!touchStartRef.current) return;

    if (preventDefault) {
      e.preventDefault();
    }

    const mouseData = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };

    setTouchEnd(mouseData);

    const distance = calculateDistance(touchStartRef.current, mouseData);
    const velocity = calculateVelocity(touchStartRef.current, mouseData);
    const direction = getSwipeDirection(touchStartRef.current, mouseData);

    setSwipeState(prev => ({
      ...prev,
      direction,
      distance,
      velocity,
    }));
  }, [preventDefault]);

  const onMouseUp = useCallback(() => {
    onTouchEnd();
  }, [onTouchEnd]);

  return {
    // Touch events
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    
    // Mouse events (for desktop testing)
    onMouseDown,
    onMouseMove,
    onMouseUp,
    
    // State
    swipeState,
    
    // Utilities
    isDragging: swipeState.isDragging,
    direction: swipeState.direction,
    distance: swipeState.distance,
    velocity: swipeState.velocity,
  };
}

// Preset swipe configurations for common use cases
export const swipePresets = {
  // Circle card swipe (left = dismiss, right = join)
  circleCard: {
    threshold: 100,
    onSwipeLeft: () => console.log('Circle dismissed'),
    onSwipeRight: () => console.log('Circle joined'),
    enableHaptic: true,
  },
  
  // Navigation swipe (left = back, right = forward)
  navigation: {
    threshold: 50,
    onSwipeLeft: () => window.history.back(),
    onSwipeRight: () => window.history.forward(),
    enableHaptic: true,
  },
  
  // Modal swipe (down = close)
  modal: {
    threshold: 100,
    onSwipeDown: () => console.log('Modal closed'),
    enableHaptic: true,
  },
  
  // Pull to refresh (down = refresh)
  pullToRefresh: {
    threshold: 80,
    onSwipeDown: () => console.log('Refreshing...'),
    enableHaptic: true,
  },
};

export default useSwipe;
