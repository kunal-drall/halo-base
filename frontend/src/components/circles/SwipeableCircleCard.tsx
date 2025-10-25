'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState } from 'react';
import { Check, X, Eye, Users, Clock, DollarSign } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';
import { useSwipe } from '@/hooks/useSwipe';

interface Circle {
  id: string;
  name?: string;
  contributionAmount: number;
  maxMembers: number;
  currentMembers: number;
  duration: number;
  apy: number;
  trustTier: string;
  status: 'ACTIVE' | 'FULL' | 'COMPLETED';
  address: string;
}

interface SwipeableCircleCardProps {
  circle: Circle;
  onSwipeLeft?: () => void;  // Dismiss
  onSwipeRight?: () => void; // Join
  onTap?: () => void;        // View details
  className?: string;
}

export function SwipeableCircleCard({
  circle,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  className = '',
}: SwipeableCircleCardProps) {
  const x = useMotionValue(0);
  const { trigger } = useHaptic();
  
  const rotateZ = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  // Swipe configuration
  const swipeConfig = {
    threshold: 100,
    onSwipeLeft: () => {
      trigger('warning');
      onSwipeLeft?.();
    },
    onSwipeRight: () => {
      trigger('success');
      onSwipeRight?.();
    },
    enableHaptic: true,
  };

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(swipeConfig);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      // Swipe right - Join
      trigger('success');
      onSwipeRight?.();
    } else if (info.offset.x < -threshold) {
      // Swipe left - Dismiss
      trigger('warning');
      onSwipeLeft?.();
    }
  };

  const handleTap = () => {
    trigger('light');
    onTap?.();
  };

  const getStatusColor = () => {
    switch (circle.status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'FULL':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'COMPLETED':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getTrustTierColor = () => {
    switch (circle.trustTier) {
      case 'Platinum':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'Gold':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Silver':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
      case 'Bronze':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotateZ, opacity, scale }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.95 }}
      onClick={handleTap}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`relative ${className}`}
    >
      {/* Swipe indicators */}
      <motion.div
        className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-2 text-red-500"
        style={{ opacity: useTransform(x, [-200, 0], [1, 0]) }}
      >
        <X className="w-8 h-8" />
        <span className="text-sm font-bold">Skip</span>
      </motion.div>

      <motion.div
        className="absolute -right-12 top-1/2 -translate-y-1/2 flex items-center gap-2 text-green-500"
        style={{ opacity: useTransform(x, [0, 200], [0, 1]) }}
      >
        <span className="text-sm font-bold">Join</span>
        <Check className="w-8 h-8" />
      </motion.div>

      {/* Circle Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 shadow-2xl">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {circle.name || `Circle #${circle.id}`}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTrustTierColor()}`}>
                  {circle.trustTier}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                  {circle.status}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                ${circle.contributionAmount}
              </div>
              <div className="text-sm text-purple-200">per month</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <StatItem
              icon={<Users className="w-4 h-4" />}
              label="Members"
              value={`${circle.currentMembers}/${circle.maxMembers}`}
            />
            <StatItem
              icon={<Clock className="w-4 h-4" />}
              label="Duration"
              value={`${circle.duration}mo`}
            />
            <StatItem
              icon={<DollarSign className="w-4 h-4" />}
              label="APY"
              value={`${circle.apy}%`}
            />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-purple-200">
              <span>Progress</span>
              <span>{Math.round((circle.currentMembers / circle.maxMembers) * 100)}%</span>
            </div>
            <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(circle.currentMembers / circle.maxMembers) * 100}%`,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-pink-500 to-purple-400"
              />
            </div>
          </div>

          {/* Swipe hint */}
          <div className="flex items-center justify-center gap-4 pt-2 text-purple-200 text-sm">
            <div className="flex items-center gap-1">
              <motion.div
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ←
              </motion.div>
              Skip
            </div>
            <div className="w-1 h-1 rounded-full bg-purple-400" />
            <div className="flex items-center gap-1">
              Join
              <motion.div
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatItem({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-1 text-purple-200">
        {icon}
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-xs text-purple-200">{label}</div>
    </div>
  );
}

// Non-swipeable version for lists
export function CircleCard({ 
  circle, 
  onTap, 
  className = '' 
}: { 
  circle: Circle; 
  onTap?: () => void; 
  className?: string; 
}) {
  const { trigger } = useHaptic();

  const handleTap = () => {
    trigger('light');
    onTap?.();
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={handleTap}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 p-4 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {circle.name || `Circle #${circle.id}`}
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
              {circle.trustTier}
            </span>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
              {circle.status}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${circle.contributionAmount}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">per month</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {circle.currentMembers}/{circle.maxMembers}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Members</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {circle.duration}mo
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {circle.apy}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">APY</div>
        </div>
      </div>

      <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          style={{ width: `${(circle.currentMembers / circle.maxMembers) * 100}%` }}
        />
      </div>
    </motion.div>
  );
}

export default SwipeableCircleCard;
