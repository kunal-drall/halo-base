'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCircles } from '@/hooks/useCircles';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { PayoutMethod } from '@/types';
import { 
  Users, 
  DollarSign, 
  Clock, 
  Shield, 
  Star, 
  TrendingUp, 
  Activity, 
  Calendar, 
  Bell, 
  Settings, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  RefreshCw, 
  Plus, 
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
  Plus as PlusIcon, 
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

interface MyCirclesStatsProps {
  className?: string;
}

export function MyCirclesStats({ className = '' }: MyCirclesStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScore, trustTier, trustMetrics } = useTrustScore();

  const { getMyCirclesStats } = useCircleStore();
  const { getMyCirclesStats: getUIStats } = useUIStore();

  useEffect(() => {
    if (isRegistered) {
      loadStats();
    }
  }, [isRegistered]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await getMyCirclesStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load my circles stats:', error);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-500';
      case 'forming':
        return 'text-yellow-500';
      case 'completed':
        return 'text-blue-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'forming':
        return <Badge variant="warning">Forming</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPayoutMethodIcon = (method: PayoutMethod) => {
    switch (method) {
      case 'auction':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'lottery':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'rotation':
        return <RotateCcw className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPayoutMethodBadge = (method: PayoutMethod) => {
    switch (method) {
      case 'auction':
        return <Badge variant="secondary">Auction</Badge>;
      case 'lottery':
        return <Badge variant="warning">Lottery</Badge>;
      case 'rotation':
        return <Badge variant="success">Rotation</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (isLoading || isLoadingCircles) {
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
      value: stats?.totalCircles || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'All circles you\'ve joined'
    },
    {
      title: 'Active Circles',
      value: stats?.activeCircles || 0,
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      description: 'Currently active circles'
    },
    {
      title: 'Total Contributions',
      value: formatUSDC(stats?.totalContributions || 0n),
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      description: 'Total amount contributed'
    },
    {
      title: 'Completed Circles',
      value: stats?.completedCircles || 0,
      icon: CheckCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'Successfully completed'
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
          {/* Circle Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Circle Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.statusBreakdown && Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium capitalize">{status}</span>
                      {getStatusBadge(status)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{count as number}</span>
                      <div className="w-20">
                        <ProgressBar 
                          value={(count as number) / (stats.totalCircles || 1) * 100} 
                          size="sm" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contribution Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Contributions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {formatUSDC(stats.totalContributions || 0n)}
                  </div>
                  <div className="text-sm text-text-secondary">Total Contributed</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-500">
                      {formatUSDC(stats.averageContribution || 0n)}
                    </div>
                    <div className="text-xs text-text-secondary">Average</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-500">
                      {formatUSDC(stats.largestContribution || 0n)}
                    </div>
                    <div className="text-xs text-text-secondary">Largest</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payout Method Breakdown */}
      {stats?.payoutMethodBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Payout Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.payoutMethodBreakdown).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between p-3 bg-surface-light rounded">
                  <div className="flex items-center space-x-3">
                    {getPayoutMethodIcon(method as PayoutMethod)}
                    <div>
                      <div className="font-medium capitalize">{method}</div>
                      <div className="text-sm text-text-secondary">
                        {method === 'auction' ? 'Highest bidder wins' :
                         method === 'lottery' ? 'Random selection' :
                         method === 'rotation' ? 'Fixed order' : 'Unknown method'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{count as number}</span>
                    {getPayoutMethodBadge(method as PayoutMethod)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust Score Impact */}
      {stats?.trustScoreImpact && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Trust Score Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  +{stats.trustScoreImpact.positive || 0}
                </div>
                <div className="text-sm text-text-secondary">Positive Impact</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-500">
                    {stats.trustScoreImpact.reliability || 0}
                  </div>
                  <div className="text-xs text-text-secondary">Reliability</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-500">
                    {stats.trustScoreImpact.consistency || 0}
                  </div>
                  <div className="text-xs text-text-secondary">Consistency</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
