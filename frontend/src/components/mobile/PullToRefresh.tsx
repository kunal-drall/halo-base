'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80,
  className = '',
  disabled = false 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trigger } = useHaptic();

  const rotate = useTransform(y, [0, threshold], [0, 360]);
  const opacity = useTransform(y, [0, threshold / 2, threshold], [0, 0.5, 1]);
  const scale = useTransform(y, [0, threshold], [0.8, 1]);

  const handleDragEnd = async (event: any, info: any) => {
    if (disabled || isRefreshing) return;

    if (info.offset.y > threshold) {
      setIsRefreshing(true);
      trigger('medium');
      
      try {
        await onRefresh();
        trigger('success');
      } catch (error) {
        console.error('Refresh failed:', error);
        trigger('error');
      } finally {
        setIsRefreshing(false);
        setIsPulling(false);
      }
    } else {
      setIsPulling(false);
    }
  };

  const handleDrag = (event: any, info: any) => {
    if (disabled || isRefreshing) return;
    
    if (info.offset.y > 0) {
      setIsPulling(true);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Pull indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute top-0 left-0 right-0 flex justify-center py-4 z-10"
      >
        <motion.div 
          style={{ rotate, scale }}
          className="flex flex-col items-center gap-2"
        >
          {isRefreshing ? (
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
          ) : (
            <RefreshCw className="w-6 h-6 text-purple-600" />
          )}
          <span className="text-sm text-purple-600 font-medium">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0 }}
        style={{ y }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className={isRefreshing ? 'pointer-events-none' : ''}
      >
        {children}
      </motion.div>

      {/* Loading overlay */}
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-20 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Refreshing data...
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Alternative implementation with intersection observer
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const { trigger } = useHaptic();

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    trigger('medium');
    
    try {
      await onRefresh();
      trigger('success');
    } catch (error) {
      console.error('Refresh failed:', error);
      trigger('error');
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    isPulling,
    handleRefresh,
  };
}

// Simple refresh button for desktop
export function RefreshButton({ 
  onRefresh, 
  isRefreshing = false,
  className = '' 
}: { 
  onRefresh: () => void; 
  isRefreshing?: boolean;
  className?: string;
}) {
  const { trigger } = useHaptic();

  const handleClick = () => {
    trigger('light');
    onRefresh();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={isRefreshing}
      className={`flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 ${className}`}
    >
      <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
    </motion.button>
  );
}

export default PullToRefresh;
