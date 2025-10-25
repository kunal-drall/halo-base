'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useCircles } from '@/hooks/useCircles';
import { useYieldData } from '@/hooks/useYieldData';
import { useMockUSDC } from '@/hooks/useMockUSDC';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Star, 
  Activity, 
  Clock, 
  Calendar, 
  Bell, 
  Settings, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronDown, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Zap, 
  Flame, 
  Gem, 
  Diamond, 
  Trophy, 
  Medal, 
  Ribbon, 
  Award, 
  Target, 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown, 
  Minus, 
  Plus, 
  X, 
  Check, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Info, 
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
  Zap as ZapIcon, 
  Flame as FlameIcon, 
  Gem as GemIcon, 
  Diamond as DiamondIcon, 
  Trophy as TrophyIcon, 
  Medal as MedalIcon, 
  Ribbon as RibbonIcon, 
  Award as AwardIcon, 
  Target as TargetIcon, 
  Activity as ActivityIcon, 
  BarChart3 as BarChart3Icon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp as TrendingUpIcon2, 
  TrendingDown as TrendingDownIcon, 
  Minus as MinusIcon, 
  Plus as PlusIcon2, 
  X as XIcon, 
  Check as CheckIcon, 
  AlertTriangle as AlertTriangleIcon, 
  CheckCircle as CheckCircleIcon, 
  AlertCircle as AlertCircleIcon, 
  Info as InfoIcon, 
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
  Unlock as UnlockIcon
} from 'lucide-react';

interface DashboardStatsProps {
  className?: string;
}

export function DashboardStats({ className = '' }: DashboardStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScore, trustTier, trustMetrics } = useTrustScore();
  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { totalYield, apy, isLoading: isLoadingYield } = useYieldData();
  const { balance, isLoading: isLoadingUSDC } = useMockUSDC();

  const { getDashboardStats } = useCircleStore();
  const { getTrustScoreBreakdown, getTrustScoreHistory, getTrustScoreAnalytics } = useTrustScoreStore();
  const { getDashboardStats: getUIStats } = useUIStore();

  useEffect(() => {
    if (isRegistered) {
      loadStats();
    }
  }, [isRegistered]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadStats();
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading || isLoadingCircles || isLoadingYield || isLoadingUSDC) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-surface rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-surface rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Registration Required</h3>
          <p className="text-text-secondary">
            Please register with the Trust Score Manager to view your stats.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Total Circles',
      value: circles?.length || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Active lending circles'
    },
    {
      title: 'Trust Score',
      value: trustScore?.toString() || '0',
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      description: 'Current trust level'
    },
    {
      title: 'Total Yield',
      value: formatUSDC(totalYield || 0n),
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'Yield earned from circles'
    },
    {
      title: 'USDC Balance',
      value: formatUSDC(balance || 0n),
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      description: 'Available balance'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-text-secondary mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-text-secondary mt-1">{stat.description}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Stats */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trust Score Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Trust Score Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {trustScore?.toString() || '0'}
                  </div>
                  <div className="text-sm text-text-secondary">Current Score</div>
                </div>
                <ProgressBar value={Number(trustScore || 0) / 10} size="md" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-500">Tier {trustTier || 0}</div>
                    <div className="text-xs text-text-secondary">Trust Tier</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-500">
                      {trustMetrics ? trustMetrics.paymentReliability.toString() : '0'}
                    </div>
                    <div className="text-xs text-text-secondary">Reliability</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yield Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Yield Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {formatUSDC(totalYield || 0n)}
                  </div>
                  <div className="text-sm text-text-secondary">Total Yield Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {apy ? `${Number(apy) / 100}%` : '0%'}
                  </div>
                  <div className="text-sm text-text-secondary">Current APY</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-purple-500">
                      {formatUSDC(balance || 0n)}
                    </div>
                    <div className="text-xs text-text-secondary">Available</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-500">
                      {circles?.length || 0}
                    </div>
                    <div className="text-xs text-text-secondary">Active Circles</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Stats
        </Button>
      </div>
    </div>
  );
}
