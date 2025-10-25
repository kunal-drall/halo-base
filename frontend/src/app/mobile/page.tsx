'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Award, 
  PlusCircle,
  Bell,
  Search
} from 'lucide-react';

import { BottomNav } from '@/components/mobile/BottomNav';
import { SwipeableCircleCard, CircleCard } from '@/components/circles/SwipeableCircleCard';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { useHaptic } from '@/hooks/useHaptic';
import { usePWA } from '@/hooks/usePWA';

// Mock data for demonstration
const mockCircles = [
  {
    id: '1',
    name: 'Tech Professionals Circle',
    contributionAmount: 500,
    maxMembers: 8,
    currentMembers: 5,
    duration: 6,
    apy: 8.5,
    trustTier: 'Gold',
    status: 'ACTIVE' as const,
    address: '0x123...',
  },
  {
    id: '2',
    name: 'Startup Founders',
    contributionAmount: 1000,
    maxMembers: 6,
    currentMembers: 6,
    duration: 12,
    apy: 12.0,
    trustTier: 'Platinum',
    status: 'FULL' as const,
    address: '0x456...',
  },
  {
    id: '3',
    name: 'Crypto Enthusiasts',
    contributionAmount: 250,
    maxMembers: 10,
    currentMembers: 3,
    duration: 4,
    apy: 6.0,
    trustTier: 'Silver',
    status: 'ACTIVE' as const,
    address: '0x789...',
  },
];

const mockStats = {
  activeCircles: 3,
  totalSaved: 2400,
  yieldEarned: 127,
  trustScore: 750,
  trustTier: 'Gold',
};

export default function MobileHomePage() {
  const { address, isConnected } = useAccount();
  const { trigger } = useHaptic();
  const { isPWA, sendNotification } = usePWA();
  
  const [circles, setCircles] = useState(mockCircles);
  const [currentCircleIndex, setCurrentCircleIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  // Handle circle swipe actions
  const handleSwipeLeft = (circleId: string) => {
    trigger('warning');
    console.log('Circle dismissed:', circleId);
    // Remove from recommendations
    setCurrentCircleIndex(prev => Math.min(prev + 1, circles.length - 1));
  };

  const handleSwipeRight = (circleId: string) => {
    trigger('success');
    console.log('Circle joined:', circleId);
    // Add to user's circles
    setCurrentCircleIndex(prev => Math.min(prev + 1, circles.length - 1));
  };

  const handleCircleTap = (circleId: string) => {
    trigger('light');
    console.log('View circle details:', circleId);
  };

  // PWA notification demo
  useEffect(() => {
    if (isPWA && isConnected) {
      const timer = setTimeout(() => {
        sendNotification('Welcome to Halo Protocol!', {
          body: 'Start building your trust score by joining circles.',
          tag: 'welcome',
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isPWA, isConnected, sendNotification]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Halo Protocol
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your wallet to start building trust-based lending circles
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium"
          >
            Connect Wallet
          </motion.button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="pt-safe">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Here's your circle activity
                </p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm"
                >
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Active Circles"
              value={mockStats.activeCircles.toString()}
              color="purple"
            />
            <StatCard
              icon={<DollarSign className="w-5 h-5" />}
              label="Total Saved"
              value={`$${mockStats.totalSaved}`}
              color="green"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Yield Earned"
              value={`$${mockStats.yieldEarned}`}
              color="blue"
            />
            <StatCard
              icon={<Award className="w-5 h-5" />}
              label="Trust Score"
              value={mockStats.trustScore.toString()}
              badge={mockStats.trustTier}
              color="pink"
            />
          </div>

          {/* Swipeable Circle Discovery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Discover Circles
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Swipe to explore
              </span>
            </div>

            {currentCircleIndex < circles.length && (
              <SwipeableCircleCard
                circle={circles[currentCircleIndex]}
                onSwipeLeft={() => handleSwipeLeft(circles[currentCircleIndex].id)}
                onSwipeRight={() => handleSwipeRight(circles[currentCircleIndex].id)}
                onTap={() => handleCircleTap(circles[currentCircleIndex].id)}
              />
            )}

            {currentCircleIndex >= circles.length && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  All caught up!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You've seen all available circles
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  Refresh
                </motion.button>
              </div>
            )}
          </div>

          {/* My Circles */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              My Circles
            </h2>
            
            <div className="space-y-3">
              {circles.slice(0, 2).map((circle) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  onTap={() => handleCircleTap(circle.id)}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <PlusCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Create Circle</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Start your own</div>
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Browse All</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Find circles</div>
              </div>
            </motion.button>
          </div>
        </div>
      </PullToRefresh>

      <BottomNav />
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  badge, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  badge?: string; 
  color: string; 
}) {
  const colors = {
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800"
    >
      <div className={`inline-flex p-2 rounded-xl mb-3 ${colors[color as keyof typeof colors]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {label}
      </div>
      {badge && (
        <div className="mt-2">
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
            {badge}
          </span>
        </div>
      )}
    </motion.div>
  );
}
