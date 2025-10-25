'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AddressDisplay } from '@/components/ui/AddressDisplay';
import { TrustBadge } from '@/components/trust/TrustBadge';
import { useUIStore, useUserStore } from '@/store';
import { 
  Home, 
  Users, 
  Plus, 
  User, 
  Search, 
  BarChart3, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Shield, 
  Star, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Clock, 
  Calendar, 
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
  Zap, 
  Flame, 
  Gem, 
  Diamond, 
  Trophy, 
  Medal, 
  Ribbon, 
  Award, 
  Target, 
  Activity as ActivityIcon, 
  BarChart3 as BarChart3Icon, 
  Star as StarIcon, 
  Shield as ShieldIcon, 
  TrendingUp as TrendingUpIcon, 
  DollarSign as DollarSignIcon, 
  Clock as ClockIcon, 
  Calendar as CalendarIcon, 
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
  Unlock as UnlockIcon, 
  Zap as ZapIcon, 
  Flame as FlameIcon, 
  Gem as GemIcon, 
  Diamond as DiamondIcon, 
  Trophy as TrophyIcon, 
  Medal as MedalIcon, 
  Ribbon as RibbonIcon, 
  Award as AwardIcon, 
  Target as TargetIcon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function Sidebar({ isOpen, onClose, className = '' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, setNotifications } = useUIStore();
  const { user, trustScore, trustTier } = useUserStore();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const navigationItems = [
    {
      id: 'main',
      label: 'Main',
      items: [
        {
          id: 'home',
          label: 'Dashboard',
          icon: Home,
          path: '/',
          badge: null
        },
        {
          id: 'circles',
          label: 'My Circles',
          icon: Users,
          path: '/circles',
          badge: null
        },
        {
          id: 'create',
          label: 'Create Circle',
          icon: Plus,
          path: '/create',
          badge: null
        },
        {
          id: 'discover',
          label: 'Discover',
          icon: Search,
          path: '/discover',
          badge: null
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      items: [
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          path: '/analytics',
          badge: null
        },
        {
          id: 'trust',
          label: 'Trust Score',
          icon: Shield,
          path: '/trust',
          badge: null
        },
        {
          id: 'yield',
          label: 'Yield Tracking',
          icon: TrendingUp,
          path: '/yield',
          badge: null
        }
      ]
    },
    {
      id: 'account',
      label: 'Account',
      items: [
        {
          id: 'profile',
          label: 'Profile',
          icon: User,
          path: '/profile',
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
      ]
    }
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
    onClose();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border shadow-lg ${className}`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      <AddressDisplay address={user?.address || ''} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-text-secondary">
                        Score: {trustScore?.toString() || '0'}
                      </span>
                      {trustTier > 0 && (
                        <TrustBadge tier={trustTier} size="sm" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  {navigationItems.map((section) => (
                    <div key={section.id} className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(section.id)}
                        className="w-full justify-between p-2"
                      >
                        <span className="font-medium text-sm">{section.label}</span>
                        {expandedSections.includes(section.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>

                      <AnimatePresence>
                        {expandedSections.includes(section.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-1"
                          >
                            {section.items.map((item) => {
                              const Icon = item.icon;
                              const active = isActive(item.path);
                              
                              return (
                                <Button
                                  key={item.id}
                                  variant={active ? 'default' : 'ghost'}
                                  size="sm"
                                  onClick={() => handleNavClick(item.path)}
                                  className="w-full justify-start p-2"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Icon className="h-4 w-4" />
                                    <span className="text-sm">{item.label}</span>
                                    {item.badge && (
                                      <Badge 
                                        variant="error" 
                                        className="ml-auto h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                                      >
                                        {item.badge > 99 ? '99+' : item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                </Button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Handle logout
                    onClose();
                  }}
                  className="w-full justify-start text-red-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}
