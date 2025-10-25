'use client';

import { Home, Search, PlusCircle, Wallet, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { usePWA } from '@/hooks/usePWA';

const navItems = [
  { 
    href: '/', 
    icon: Home, 
    label: 'Home',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  },
  { 
    href: '/discover', 
    icon: Search, 
    label: 'Discover',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  { 
    href: '/create', 
    icon: PlusCircle, 
    label: 'Create', 
    primary: true,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-purple-600 to-pink-600'
  },
  { 
    href: '/circles', 
    icon: Wallet, 
    label: 'Circles',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  { 
    href: '/profile', 
    icon: User, 
    label: 'Profile',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800'
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const { trigger } = useHaptic();
  const { isPWA } = usePWA();

  // Don't show on desktop or if not in PWA mode
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-area-inset-bottom">
      {/* Glass backdrop with blur */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800" />
      
      {/* Navigation items */}
      <div className="relative flex items-center justify-around h-20 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => trigger('light')}
              className="relative flex flex-col items-center justify-center w-16 h-16 touch-manipulation"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-2xl ${item.bgColor}`}
                  transition={{ 
                    type: 'spring', 
                    bounce: 0.2, 
                    duration: 0.6 
                  }}
                />
              )}

              {/* Icon container */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                {item.primary ? (
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center justify-center w-12 h-12 ${item.bgColor} rounded-full shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center w-10 h-10"
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isActive
                          ? item.color
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    />
                  </motion.div>
                )}
                
                {/* Label */}
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive
                      ? item.color
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {/* Ripple effect on tap */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gray-200 dark:bg-gray-700 opacity-0"
                whileTap={{ 
                  opacity: 0.3,
                  scale: 1.1 
                }}
                transition={{ duration: 0.1 }}
              />
            </Link>
          );
        })}
      </div>

      {/* PWA indicator */}
      {isPWA && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      )}
    </nav>
  );
}

// Mobile navigation hook for programmatic navigation
export function useMobileNav() {
  const { trigger } = useHaptic();

  const navigateTo = (href: string) => {
    trigger('light');
    window.location.href = href;
  };

  const goBack = () => {
    trigger('light');
    window.history.back();
  };

  const goForward = () => {
    trigger('light');
    window.history.forward();
  };

  return {
    navigateTo,
    goBack,
    goForward,
  };
}

export default BottomNav;
