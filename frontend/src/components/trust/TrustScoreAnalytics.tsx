'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useTrustScoreStore } from '@/store';
import { formatDate, formatDuration } from '@/lib/utils';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Award, 
  Shield, 
  Star, 
  Users, 
  DollarSign, 
  Clock, 
  Calendar, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Info, 
  Settings, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Plus, 
  X, 
  Check, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Flame, 
  Gem, 
  Diamond, 
  Trophy, 
  Medal, 
  Ribbon, 
  Award as AwardIcon, 
  Target as TargetIcon, 
  Activity as ActivityIcon, 
  BarChart3 as BarChart3Icon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon
} from 'lucide-react';

interface TrustScoreAnalyticsProps {
  address?: string;
  showCharts?: boolean;
  showMetrics?: boolean;
  showTrends?: boolean;
  showComparisons?: boolean;
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all';
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function TrustScoreAnalytics({
  address,
  showCharts = true,
  showMetrics = true,
  showTrends = true,
  showComparisons = true,
  timeRange = '30d',
  variant = 'default',
  className = ''
}: TrustScoreAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [comparisons, setComparisons] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('overall');

  const {
    trustScore,
    trustTier,
    trustMetrics,
    isRegistered,
    isLoading: isLoadingTrust
  } = useTrustScore(address);

  const {
    getTrustScoreAnalytics,
    getTrustScoreTrends,
    getTrustScoreComparisons,
    refreshTrustScore
  } = useTrustScoreStore();

  useEffect(() => {
    if (isRegistered) {
      loadAnalytics();
      if (showTrends) loadTrends();
      if (showComparisons) loadComparisons();
    }
  }, [address, isRegistered, timeRange, showTrends, showComparisons]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await getTrustScoreAnalytics(address, timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load trust analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrends = async () => {
    try {
      const data = await getTrustScoreTrends(address, timeRange);
      setTrends(data);
    } catch (error) {
      console.error('Failed to load trust trends:', error);
    }
  };

  const loadComparisons = async () => {
    try {
      const data = await getTrustScoreComparisons(address);
      setComparisons(data);
    } catch (error) {
      console.error('Failed to load trust comparisons:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshTrustScore(address);
      await loadAnalytics();
      if (showTrends) await loadTrends();
      if (showComparisons) await loadComparisons();
    } catch (error) {
      console.error('Failed to refresh trust analytics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'overall':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'paymentreliability':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'socialverification':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'defiactivity':
        return <Activity className="h-4 w-4 text-orange-500" />;
      case 'communitystanding':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'onchainactivity':
        return <Target className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'overall':
        return 'Overall Score';
      case 'paymentreliability':
        return 'Payment Reliability';
      case 'socialverification':
        return 'Social Verification';
      case 'defiactivity':
        return 'DeFi Activity';
      case 'communitystanding':
        return 'Community Standing';
      case 'onchainactivity':
        return 'On-Chain Activity';
      default:
        return metric;
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

  const getTrendBadge = (trend: number) => {
    if (trend > 0) return <Badge variant="success">+{trend.toFixed(1)}%</Badge>;
    if (trend < 0) return <Badge variant="error">{trend.toFixed(1)}%</Badge>;
    return <Badge variant="secondary">0%</Badge>;
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      case '1y': return 'Last Year';
      case 'all': return 'All Time';
      default: return range;
    }
  };

  if (isLoading || isLoadingTrust) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-surface rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-surface rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isRegistered) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-text-secondary">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>Address not registered with Trust Score Manager</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Analytics</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{trustScore.toString()}</div>
              <div className="text-xs text-text-secondary">Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Trust Analytics</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{getTimeRangeLabel(timeRange)}</Badge>
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
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-blue-500">
              {trustScore.toString()}
            </div>
            <div className="text-lg font-medium">Current Trust Score</div>
            <ProgressBar value={Number(trustScore) / 10} size="md" />
          </div>

          {/* Key Metrics */}
          {analytics && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-500">
                  {analytics.highestScore || 0}
                </div>
                <div className="text-sm text-text-secondary">Highest Score</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-500">
                  {analytics.averageScore || 0}
                </div>
                <div className="text-sm text-text-secondary">Average Score</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-500">
                  {analytics.improvementRate || 0}%
                </div>
                <div className="text-sm text-text-secondary">Improvement Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-500">
                  {analytics.consistencyScore || 0}%
                </div>
                <div className="text-sm text-text-secondary">Consistency</div>
              </div>
            </div>
          )}

          {/* Trends */}
          {showTrends && trends.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Score Trends</h4>
              <div className="space-y-3">
                {trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getMetricIcon(trend.metric)}
                      <div>
                        <div className="font-medium">{getMetricLabel(trend.metric)}</div>
                        <div className="text-sm text-text-secondary">
                          {trend.currentValue} (was {trend.previousValue})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(trend.change)}
                      {getTrendBadge(trend.change)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparisons */}
          {showComparisons && comparisons && (
            <div className="space-y-4">
              <h4 className="font-medium">Comparisons</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-text-secondary">vs. Average User</div>
                  <div className="text-2xl font-bold text-blue-500">
                    {comparisons.vsAverage || 0}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-text-secondary">vs. Same Tier</div>
                  <div className="text-2xl font-bold text-green-500">
                    {comparisons.vsTier || 0}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-text-secondary">vs. Top 10%</div>
                  <div className="text-2xl font-bold text-purple-500">
                    {comparisons.vsTop10 || 0}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-text-secondary">vs. Previous Period</div>
                  <div className="text-2xl font-bold text-orange-500">
                    {comparisons.vsPrevious || 0}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          {showCharts && (
            <div className="space-y-4">
              <h4 className="font-medium">Score History</h4>
              <div className="h-64 bg-surface-light rounded-lg flex items-center justify-center">
                <div className="text-center text-text-secondary">
                  <LineChart className="h-12 w-12 mx-auto mb-2" />
                  <p>Chart visualization would go here</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Analytics</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{getTimeRangeLabel(timeRange)}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-blue-500">
            {trustScore.toString()}
          </div>
          <div className="text-sm text-text-secondary">Current Score</div>
          <ProgressBar value={Number(trustScore) / 10} size="sm" />
        </div>

        {/* Key Metrics */}
        {analytics && (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-500">
                {analytics.highestScore || 0}
              </div>
              <div className="text-xs text-text-secondary">Highest</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-500">
                {analytics.averageScore || 0}
              </div>
              <div className="text-xs text-text-secondary">Average</div>
            </div>
          </div>
        )}

        {/* Detailed View */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pt-4 border-t border-border"
            >
              {/* Trends */}
              {showTrends && trends.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Recent Trends</h4>
                  {trends.slice(0, 3).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-surface-light rounded">
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(trend.metric)}
                        <span>{getMetricLabel(trend.metric)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(trend.change)}
                        <span className={getTrendColor(trend.change)}>
                          {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comparisons */}
              {showComparisons && comparisons && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Comparisons</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-surface-light rounded">
                      <div className="font-bold text-blue-500">{comparisons.vsAverage || 0}%</div>
                      <div className="text-text-secondary">vs Average</div>
                    </div>
                    <div className="text-center p-2 bg-surface-light rounded">
                      <div className="font-bold text-green-500">{comparisons.vsTier || 0}%</div>
                      <div className="text-text-secondary">vs Tier</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex-1"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
