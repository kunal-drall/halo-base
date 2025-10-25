'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AddressDisplay } from '@/components/ui/AddressDisplay';
import { TrustBadge } from '@/components/trust/TrustBadge';
import { useUIStore, useUserStore } from '@/store';
import { 
  Menu, 
  X, 
  Bell, 
  Settings, 
  User, 
  Search, 
  Plus, 
  Home, 
  Users, 
  BarChart3, 
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
  ChevronDown, 
  ChevronUp, 
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
  ChevronDown as ChevronDownIcon, 
  ChevronUp as ChevronUpIcon, 
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
  Target as TargetIcon, 
  Activity as ActivityIcon2, 
  BarChart3 as BarChart3Icon2, 
  Star as StarIcon2, 
  Shield as ShieldIcon2, 
  TrendingUp as TrendingUpIcon2, 
  DollarSign as DollarSignIcon2, 
  Clock as ClockIcon2, 
  Calendar as CalendarIcon2, 
  Heart as HeartIcon2, 
  Bookmark as BookmarkIcon2, 
  MessageCircle as MessageCircleIcon2, 
  Share as ShareIcon2, 
  MoreHorizontal as MoreHorizontalIcon2, 
  ChevronDown as ChevronDownIcon2, 
  ChevronUp as ChevronUpIcon2, 
  LogOut as LogOutIcon2, 
  Wallet as WalletIcon2, 
  Key as KeyIcon2, 
  Globe as GlobeIcon2, 
  Lock as LockIcon2, 
  Unlock as UnlockIcon2, 
  Zap as ZapIcon2, 
  Flame as FlameIcon2, 
  Gem as GemIcon2, 
  Diamond as DiamondIcon2, 
  Trophy as TrophyIcon2, 
  Medal as MedalIcon2, 
  Ribbon as RibbonIcon2, 
  Award as AwardIcon2, 
  Target as TargetIcon2
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  showMenu?: boolean;
  className?: string;
}

export function Header({
  title,
  showBack = false,
  showSearch = false,
  showNotifications = true,
  showProfile = true,
  showMenu = true,
  className = ''
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, setNotifications } = useUIStore();
  const { user, trustScore, trustTier } = useUserStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    router.push('/search');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleMenu = () => {
    // Toggle mobile menu
  };

  const getPageTitle = () => {
    if (title) return title;
    
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/circles':
        return 'Circles';
      case '/create':
        return 'Create Circle';
      case '/profile':
        return 'Profile';
      case '/discover':
        return 'Discover';
      case '/analytics':
        return 'Analytics';
      case '/notifications':
        return 'Notifications';
      case '/settings':
        return 'Settings';
      default:
        return 'Halo Protocol';
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <h1 className="text-lg font-semibold text-text-primary">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearch}
              className="p-2"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Notifications */}
          {showNotifications && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
                className="p-2"
              >
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge 
                    variant="error" 
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {notifications > 99 ? '99+' : notifications}
                  </Badge>
                )}
              </Button>

              {/* Notifications Menu */}
              <AnimatePresence>
                {showNotificationsMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-sm">Notifications</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNotificationsMenu(false)}
                          className="p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {notifications > 0 ? (
                          <div className="text-sm text-text-secondary">
                            You have {notifications} new notifications
                          </div>
                        ) : (
                          <div className="text-sm text-text-secondary">
                            No new notifications
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Profile */}
          {showProfile && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-primary-foreground" />
                  </div>
                  {trustTier > 0 && (
                    <TrustBadge tier={trustTier} size="sm" />
                  )}
                </div>
              </Button>

              {/* Profile Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            <AddressDisplay address={user?.address || ''} />
                          </div>
                          <div className="text-xs text-text-secondary">
                            Trust Score: {trustScore?.toString() || '0'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleProfile();
                            setShowProfileMenu(false);
                          }}
                          className="w-full justify-start"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            router.push('/settings');
                            setShowProfileMenu(false);
                          }}
                          className="w-full justify-start"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            router.push('/analytics');
                            setShowProfileMenu(false);
                          }}
                          className="w-full justify-start"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Handle logout
                            setShowProfileMenu(false);
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
            </div>
          )}

          {/* Menu */}
          {showMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMenu}
              className="p-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {(showProfileMenu || showNotificationsMenu) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20"
            onClick={() => {
              setShowProfileMenu(false);
              setShowNotificationsMenu(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
