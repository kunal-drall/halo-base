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

interface CircleAnalyticsProps {
  circleId: bigint;
  circle: any;
  showCharts?: boolean;
  showMetrics?: boolean;
  showHistory?: boolean;
  className?: string;
}

export function CircleAnalytics({
  circleId,
  circle,
  showCharts = true,
  showMetrics = true,
  showHistory = true,
  className = ''
}: CircleAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string>('contributions');

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScore, trustTier, trustMetrics } = useTrustScore();

  const { 
    getCircleAnalytics,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline
  } = useCircleStore();

  const { 
    getCircleAnalytics: getUIAnalytics,
    getCircleStats: getUIStats,
    getCircleMembers: getUIMembers,
    getCircleTimeline: getUITimeline
  } = useUIStore();

  useEffect(() => {
    if (isRegistered) {
      loadAnalytics();
    }
  }, [isRegistered, circleId, timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await getCircleAnalytics(circleId, timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load circle analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadAnalytics();
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'contributions':
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'members':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'activity':
        return <Activity className="h-4 w-4 text-purple-500" />;
      case 'trust':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'contributions':
        return 'text-blue-500';
      case 'members':
        return 'text-green-500';
      case 'activity':
        return 'text-purple-500';
      case 'trust':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getMetricBadge = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'contributions':
        return <Badge variant="secondary">Contributions</Badge>;
      case 'members':
        return <Badge variant="success">Members</Badge>;
      case 'activity':
        return <Badge variant="warning">Activity</Badge>;
      case 'trust':
        return <Badge variant="secondary">Trust</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getTrendText = (trend: number) => {
    if (trend > 0) return `+${trend.toFixed(1)}%`;
    if (trend < 0) return `${trend.toFixed(1)}%`;
    return '0%';
  };

  if (isLoading || isLoadingCircles) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-surface rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-surface rounded w-3/4"></div>
                  <div className="h-3 bg-surface rounded w-1/2"></div>
                </div>
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
            Please register with the Trust Score Manager to view analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Analytics Available</h3>
          <p className="text-text-secondary">
            Analytics data is not available for this circle.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Circle Analytics</h2>
          <p className="text-text-secondary">Performance metrics and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.keyMetrics?.map((metric: any, index: number) => {
            const Icon = getMetricIcon(metric.name);
            
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-text-secondary mb-1">{metric.name}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                            {getTrendText(metric.trend)}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-surface-light rounded-lg flex items-center justify-center">
                        {Icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Charts */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5" />
                <span>Contribution Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-surface-light rounded">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto text-text-secondary mb-2" />
                  <p className="text-text-secondary">Chart visualization would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Member Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-surface-light rounded">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto text-text-secondary mb-2" />
                  <p className="text-text-secondary">Chart visualization would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.performanceMetrics?.map((metric: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-light rounded">
                  <div className="flex items-center space-x-3">
                    {getMetricIcon(metric.name)}
                    <div>
                      <div className="font-medium">{metric.name}</div>
                      <div className="text-sm text-text-secondary">{metric.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{metric.value}</div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                        {getTrendText(metric.trend)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust Score Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Trust Score Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.trustScoreImpact?.map((impact: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-light rounded">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-yellow-500" />
                    <div>
                      <div className="font-medium">{impact.metric}</div>
                      <div className="text-sm text-text-secondary">{impact.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{impact.value}</div>
                    <div className="text-sm text-text-secondary">{impact.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Data */}
      {showHistory && analytics.historicalData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Historical Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.historicalData.map((period: any, index: number) => (
                <div key={index} className="p-4 bg-surface-light rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{period.period}</div>
                    <div className="text-sm text-text-secondary">{period.date}</div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {period.metrics.map((metric: any, metricIndex: number) => (
                      <div key={metricIndex} className="text-center">
                        <div className="text-sm text-text-secondary">{metric.name}</div>
                        <div className="font-medium">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {analytics.insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.insights.map((insight: any, index: number) => (
                <div key={index} className="p-3 bg-surface-light rounded">
                  <div className="flex items-start space-x-3">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium">{insight.title}</div>
                      <div className="text-sm text-text-secondary">{insight.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
