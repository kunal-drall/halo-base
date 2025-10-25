'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useUIStore } from '@/store';
import { 
  Home, 
  Search, 
  Plus, 
  Users, 
  User, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  ChevronUp, 
  ChevronDown,
  Circle,
  Activity,
  DollarSign,
  Shield,
  Star,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Heart,
  Bookmark,
  MessageCircle,
  Share,
  MoreHorizontal
} from 'lucide-react';

interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className = '' }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, setNotifications } = useUIStore();
  const [showMore, setShowMore] = useState(false);

  const mainNavItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
      badge: null
    },
    {
      id: 'circles',
      label: 'Circles',
      icon: Users,
      path: '/circles',
      badge: null
    },
    {
      id: 'create',
      label: 'Create',
      icon: Plus,
      path: '/create',
      badge: null
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      badge: notifications > 0 ? notifications : null
    }
  ];

  const moreNavItems = [
    {
      id: 'discover',
      label: 'Discover',
      icon: Search,
      path: '/discover',
      badge: null
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      path: '/notifications',
      badge: notifications > 0 ? notifications : null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      badge: null
    }
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Main Navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border ${className}`}
      >
        <div className="flex items-center justify-around px-4 py-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => handleNavClick(item.path)}
                className={`relative flex flex-col items-center space-y-1 p-2 h-auto ${
                  active ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && (
                    <Badge 
                      variant="error" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </Button>
            );
          })}
          
          {/* More Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center space-y-1 p-2"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs font-medium">More</span>
          </Button>
        </div>
      </motion.div>

      {/* More Menu */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 left-0 right-0 z-40 bg-background border-t border-border shadow-lg"
          >
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">More Options</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMore(false)}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <Button
                      key={item.id}
                      variant={active ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        handleNavClick(item.path);
                        setShowMore(false);
                      }}
                      className="flex items-center space-x-2 p-3 h-auto"
                    >
                      <div className="relative">
                        <Icon className="h-4 w-4" />
                        {item.badge && (
                          <Badge 
                            variant="error" 
                            className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {item.badge > 99 ? '99+' : item.badge}
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20"
            onClick={() => setShowMore(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
