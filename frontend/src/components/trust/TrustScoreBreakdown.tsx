'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useTrustScoreStore } from '@/store';
import { formatDate } from '@/lib/utils';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Users, 
  DollarSign, 
  Activity, 
  Target, 
  Award, 
  Zap, 
  BarChart3, 
  PieChart, 
  LineChart, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  RotateCcw
} from 'lucide-react';

interface TrustScoreBreakdownProps {
  address?: string;
  showHistory?: boolean;
  showMetrics?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function TrustScoreBreakdown({
  address,
  showHistory = true,
  showMetrics = true,
  showActions = true,
  variant = 'default',
  className = ''
}: TrustScoreBreakdownProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  const {
    trustScore,
    trustTier,
    trustMetrics,
    isRegistered,
    isLoading: isLoadingTrust
  } = useTrustScore(address);

  const {
    getTrustScoreBreakdown,
    getTrustScoreHistory,
    getTrustScoreMetrics,
    refreshTrustScore
  } = useTrustScoreStore();

  useEffect(() => {
    if (isRegistered) {
      loadBreakdown();
      if (showHistory) loadHistory();
      if (showMetrics) loadMetrics();
    }
  }, [address, isRegistered, showHistory, showMetrics]);

  const loadBreakdown = async () => {
    try {
      const data = await getTrustScoreBreakdown(address);
      setBreakdown(data);
    } catch (error) {
      console.error('Failed to load trust breakdown:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await getTrustScoreHistory(address);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load trust history:', error);
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await getTrustScoreMetrics(address);
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load trust metrics:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshTrustScore(address);
      await loadBreakdown();
      if (showHistory) await loadHistory();
      if (showMetrics) await loadMetrics();
    } catch (error) {
      console.error('Failed to refresh trust data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'paymentreliability':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'socialverification':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'defiactivity':
        return <Activity className="h-4 w-4 text-purple-500" />;
      case 'communitystanding':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'onchainactivity':
        return <Target className="h-4 w-4 text-orange-500" />;
      case 'reputation':
        return <Award className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric.toLowerCase()) {
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
      case 'reputation':
        return 'Reputation';
      default:
        return metric;
    }
  };

  const getMetricDescription = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'paymentreliability':
        return 'Track record of timely payments and contributions';
      case 'socialverification':
        return 'Social media and identity verification status';
      case 'defiactivity':
        return 'Participation in DeFi protocols and yield farming';
      case 'communitystanding':
        return 'Reputation within lending circles and community';
      case 'onchainactivity':
        return 'General blockchain activity and transaction history';
      case 'reputation':
        return 'Overall reputation and trustworthiness';
      default:
        return 'Trust metric';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-blue-500 to-blue-600';
    if (score >= 40) return 'from-yellow-500 to-yellow-600';
    if (score >= 20) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  if (isLoadingTrust) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Trust Breakdown</CardTitle>
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
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>Address not registered with Trust Score Manager</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {breakdown && Object.entries(breakdown).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    {getMetricIcon(key)}
                    <span className="text-text-secondary">{getMetricLabel(key)}</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(Number(value))}`}>
                    {value}%
                  </span>
                </div>
                <ProgressBar value={Number(value)} size="sm" />
              </div>
            ))}
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
              <span>Trust Score Breakdown</span>
            </CardTitle>
            {showActions && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="text-center space-y-2">
            <div className={`text-4xl font-bold ${getScoreColor(Number(trustScore))}`}>
              {trustScore.toString()}
            </div>
            <div className="text-lg font-medium">Overall Trust Score</div>
            <ProgressBar value={Number(trustScore) / 10} size="md" />
          </div>

          {/* Breakdown */}
          {breakdown && (
            <div className="space-y-4">
              <h4 className="font-medium">Score Components</h4>
              <div className="space-y-4">
                {Object.entries(breakdown).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(key)}
                        <span className="font-medium">{getMetricLabel(key)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${getScoreColor(Number(value))}`}>
                          {value}%
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {Number(value) >= 80 ? 'Excellent' : 
                           Number(value) >= 60 ? 'Good' : 
                           Number(value) >= 40 ? 'Fair' : 
                           Number(value) >= 20 ? 'Poor' : 'Very Poor'}
                        </Badge>
                      </div>
                    </div>
                    <ProgressBar value={Number(value)} size="sm" />
                    <p className="text-xs text-text-secondary">{getMetricDescription(key)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          {showMetrics && metrics && (
            <div className="bg-surface-light rounded-lg p-4">
              <h4 className="font-medium mb-3">Detailed Metrics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-text-secondary capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="font-medium">{value.toString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {showHistory && history.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Score History</h4>
              <div className="space-y-2">
                {history.slice(0, 10).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-surface-light rounded">
                    <div className="flex items-center space-x-2">
                      {entry.change > 0 ? (
                        <ArrowUp className="h-3 w-3 text-green-500" />
                      ) : entry.change < 0 ? (
                        <ArrowDown className="h-3 w-3 text-red-500" />
                      ) : (
                        <Minus className="h-3 w-3 text-gray-500" />
                      )}
                      <span>{entry.reason}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${entry.change > 0 ? 'text-green-500' : entry.change < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {entry.change > 0 ? '+' : ''}{entry.change}
                      </div>
                      <div className="text-xs text-text-secondary">{formatDate(Number(entry.timestamp))}</div>
                    </div>
                  </div>
                ))}
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
            <span>Trust Breakdown</span>
          </CardTitle>
          {showActions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Overview */}
        <div className="text-center space-y-2">
          <div className={`text-3xl font-bold ${getScoreColor(Number(trustScore))}`}>
            {trustScore.toString()}
          </div>
          <div className="text-sm text-text-secondary">Overall Score</div>
        </div>

        {/* Breakdown Preview */}
        {breakdown && (
          <div className="space-y-3">
            {Object.entries(breakdown).slice(0, 3).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    {getMetricIcon(key)}
                    <span className="text-text-secondary">{getMetricLabel(key)}</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(Number(value))}`}>
                    {value}%
                  </span>
                </div>
                <ProgressBar value={Number(value)} size="sm" />
              </div>
            ))}
          </div>
        )}

        {/* Detailed View */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pt-4 border-t border-border"
            >
              {/* Full Breakdown */}
              {breakdown && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">All Components</h4>
                  {Object.entries(breakdown).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon(key)}
                          <span className="text-text-secondary">{getMetricLabel(key)}</span>
                        </div>
                        <span className={`font-medium ${getScoreColor(Number(value))}`}>
                          {value}%
                        </span>
                      </div>
                      <ProgressBar value={Number(value)} size="sm" />
                      <p className="text-xs text-text-secondary">{getMetricDescription(key)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* History */}
              {showHistory && history.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recent Changes</h4>
                  {history.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 bg-surface-light rounded">
                      <div className="flex items-center space-x-1">
                        {entry.change > 0 ? (
                          <ArrowUp className="h-3 w-3 text-green-500" />
                        ) : entry.change < 0 ? (
                          <ArrowDown className="h-3 w-3 text-red-500" />
                        ) : (
                          <Minus className="h-3 w-3 text-gray-500" />
                        )}
                        <span>{entry.reason}</span>
                      </div>
                      <div className={`font-medium ${entry.change > 0 ? 'text-green-500' : entry.change < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {entry.change > 0 ? '+' : ''}{entry.change}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {showActions && (
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
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
