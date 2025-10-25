'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useUIStore } from '@/store';
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
  Target as TargetIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  showMenu?: boolean;
  showBottomNav?: boolean;
  showSidebar?: boolean;
  showMobileNav?: boolean;
  className?: string;
}

export function Layout({
  children,
  title,
  showBack = false,
  showSearch = false,
  showNotifications = true,
  showProfile = true,
  showMenu = true,
  showBottomNav = true,
  showSidebar = false,
  showMobileNav = false,
  className = ''
}: LayoutProps) {
  const pathname = usePathname();
  const { isMobile, setIsMobile } = useUIStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  // Handle menu click
  const handleMenuClick = () => {
    if (isMobile) {
      setMobileNavOpen(true);
    } else {
      setSidebarOpen(true);
    }
  };

  // Close all menus
  const closeAllMenus = () => {
    setSidebarOpen(false);
    setMobileNavOpen(false);
  };

  // Pages that don't need bottom nav
  const noBottomNavPages = ['/create', '/profile', '/settings', '/analytics'];
  const shouldShowBottomNav = showBottomNav && !noBottomNavPages.includes(pathname);

  // Pages that need special header
  const specialHeaderPages = ['/create', '/profile', '/settings'];
  const needsSpecialHeader = specialHeaderPages.includes(pathname);

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Header */}
      <Header
        title={title}
        showBack={showBack}
        showSearch={showSearch}
        showNotifications={showNotifications}
        showProfile={showProfile}
        showMenu={showMenu}
        onMenuClick={handleMenuClick}
      />

      {/* Main Content */}
      <main className={`${shouldShowBottomNav ? 'pb-20' : ''} ${sidebarOpen ? 'lg:ml-80' : ''}`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {shouldShowBottomNav && (
        <BottomNav />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Navigation */}
      {showMobileNav && (
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />
      )}

      {/* Menu Button for Mobile */}
      {isMobile && showMenu && (
        <button
          onClick={handleMenuClick}
          className="fixed bottom-20 right-4 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

// Specialized layout components for different page types
export function DashboardLayout({ children, ...props }: Omit<LayoutProps, 'showBottomNav' | 'showMenu'>) {
  return (
    <Layout
      {...props}
      showBottomNav={true}
      showMenu={true}
    >
      {children}
    </Layout>
  );
}

export function CreateLayout({ children, ...props }: Omit<LayoutProps, 'showBottomNav' | 'showBack'>) {
  return (
    <Layout
      {...props}
      showBottomNav={false}
      showBack={true}
    >
      {children}
    </Layout>
  );
}

export function ProfileLayout({ children, ...props }: Omit<LayoutProps, 'showBottomNav' | 'showBack'>) {
  return (
    <Layout
      {...props}
      showBottomNav={false}
      showBack={true}
    >
      {children}
    </Layout>
  );
}

export function SettingsLayout({ children, ...props }: Omit<LayoutProps, 'showBottomNav' | 'showBack'>) {
  return (
    <Layout
      {...props}
      showBottomNav={false}
      showBack={true}
    >
      {children}
    </Layout>
  );
}

export function AnalyticsLayout({ children, ...props }: Omit<LayoutProps, 'showBottomNav' | 'showBack'>) {
  return (
    <Layout
      {...props}
      showBottomNav={false}
      showBack={true}
    >
      {children}
    </Layout>
  );
}
