'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TrustBadge } from './TrustBadge';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useTrustScoreStore } from '@/store';
import { formatDate, formatDuration } from '@/lib/utils';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  StarOff, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  Zap, 
  Target, 
  Award, 
  Activity, 
  BarChart3, 
  PieChart, 
  LineChart, 
  RefreshCw
} from 'lucide-react';

interface TrustScoreDisplayProps {
  address?: string;
  showBreakdown?: boolean;
  showHistory?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  className?: string;
}

export function TrustScoreDisplay({
  address,
  showBreakdown = true,
  showHistory = true,
  showActions = true,
  variant = 'default',
  className = ''
}: TrustScoreDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    trustScore,
    trustTier,
    trustMetrics,
    isRegistered,
    isLoading: isLoadingTrust
  } = useTrustScore(address);

  const {
    getTrustScoreHistory,
    getTrustScoreBreakdown,
    refreshTrustScore
  } = useTrustScoreStore();

  const [trustHistory, setTrustHistory] = useState<any[]>([]);
  const [trustBreakdown, setTrustBreakdown] = useState<any>(null);

  useEffect(() => {
    if (showHistory) {
      loadTrustHistory();
    }
    if (showBreakdown) {
      loadTrustBreakdown();
    }
  }, [address, showHistory, showBreakdown]);

  const loadTrustHistory = async () => {
    try {
      const history = await getTrustScoreHistory(address);
      setTrustHistory(history);
    } catch (error) {
      console.error('Failed to load trust history:', error);
    }
  };

  const loadTrustBreakdown = async () => {
    try {
      const breakdown = await getTrustScoreBreakdown(address);
      setTrustBreakdown(breakdown);
    } catch (error) {
      console.error('Failed to load trust breakdown:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshTrustScore(address);
      await loadTrustHistory();
      await loadTrustBreakdown();
    } catch (error) {
      console.error('Failed to refresh trust score:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getScoreColor = (score: bigint) => {
    const scoreNum = Number(score);
    if (scoreNum >= 800) return 'text-green-500';
    if (scoreNum >= 600) return 'text-blue-500';
    if (scoreNum >= 400) return 'text-yellow-500';
    if (scoreNum >= 200) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: bigint) => {
    const scoreNum = Number(score);
    if (scoreNum >= 800) return 'from-green-500 to-green-600';
    if (scoreNum >= 600) return 'from-blue-500 to-blue-600';
    if (scoreNum >= 400) return 'from-yellow-500 to-yellow-600';
    if (scoreNum >= 200) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreLabel = (score: bigint) => {
    const scoreNum = Number(score);
    if (scoreNum >= 800) return 'Excellent';
    if (scoreNum >= 600) return 'Good';
    if (scoreNum >= 400) return 'Fair';
    if (scoreNum >= 200) return 'Poor';
    return 'Very Poor';
  };

  const getTierIcon = (tier: number) => {
    switch (tier) {
      case 4: return <Award className="h-4 w-4 text-yellow-500" />;
      case 3: return <Star className="h-4 w-4 text-blue-500" />;
      case 2: return <Shield className="h-4 w-4 text-green-500" />;
      case 1: return <Target className="h-4 w-4 text-orange-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 4: return 'Elite';
      case 3: return 'Gold';
      case 2: return 'Silver';
      case 1: return 'Bronze';
      default: return 'Unranked';
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 4: return 'text-yellow-500';
      case 3: return 'text-blue-500';
      case 2: return 'text-green-500';
      case 1: return 'text-orange-500';
      default: return 'text-red-500';
    }
  };

  if (isLoadingTrust) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Trust Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-8 bg-surface rounded w-1/2"></div>
              <div className="h-4 bg-surface rounded w-3/4"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-surface rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isRegistered) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Not Registered</h3>
          <p className="text-text-secondary mb-4">
            This address is not registered with the Trust Score Manager.
          </p>
          {showActions && (
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`text-2xl font-bold ${getScoreColor(trustScore)}`}>
          {trustScore.toString()}
        </div>
        <TrustBadge tier={trustTier} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`text-3xl font-bold ${getScoreColor(trustScore)}`}>
                {trustScore.toString()}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">{getScoreLabel(trustScore)}</div>
                <TrustBadge tier={trustTier} />
              </div>
            </div>
            {showActions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
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
              <Shield className="h-5 w-5" />
              <span>Trust Score</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <TrustBadge tier={trustTier} />
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
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Score Display */}
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(trustScore)}`}>
              {trustScore.toString()}
            </div>
            <div className="space-y-2">
              <div className="text-xl font-medium">{getScoreLabel(trustScore)}</div>
              <div className="flex items-center justify-center space-x-2">
                {getTierIcon(trustTier)}
                <span className={`font-medium ${getTierColor(trustTier)}`}>
                  {getTierLabel(trustTier)}
                </span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          {showBreakdown && trustBreakdown && (
            <div className="space-y-4">
              <h4 className="font-medium">Score Breakdown</h4>
              <div className="space-y-3">
                {Object.entries(trustBreakdown).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <ProgressBar value={Number(value)} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust Metrics */}
          {trustMetrics && (
            <div className="bg-surface-light rounded-lg p-4">
              <h4 className="font-medium mb-3">Trust Metrics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-text-secondary">Payment Reliability</div>
                  <div className="font-medium">{trustMetrics.paymentReliability.toString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-text-secondary">Social Verification</div>
                  <div className="font-medium">{trustMetrics.socialVerification.toString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-text-secondary">DeFi Activity</div>
                  <div className="font-medium">{trustMetrics.defiActivity.toString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-text-secondary">Community Standing</div>
                  <div className="font-medium">{trustMetrics.communityStanding.toString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {showHistory && trustHistory.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Recent Changes</h4>
              <div className="space-y-2">
                {trustHistory.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-surface-light rounded">
                    <div className="flex items-center space-x-2">
                      {entry.change > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span>{entry.reason}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${entry.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
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
            <Shield className="h-5 w-5" />
            <span>Trust Score</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <TrustBadge tier={trustTier} />
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
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Score */}
        <div className="text-center space-y-2">
          <div className={`text-4xl font-bold ${getScoreColor(trustScore)}`}>
            {trustScore.toString()}
          </div>
          <div className="text-lg font-medium">{getScoreLabel(trustScore)}</div>
        </div>

        {/* Score Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Score Progress</span>
            <span className="font-medium">{Number(trustScore)}/1000</span>
          </div>
          <ProgressBar value={Number(trustScore) / 10} size="sm" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-500">{trustTier}</div>
            <div className="text-xs text-text-secondary">Tier</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-500">
              {trustMetrics ? trustMetrics.paymentReliability.toString() : '0'}
            </div>
            <div className="text-xs text-text-secondary">Reliability</div>
          </div>
        </div>

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
              {/* Breakdown */}
              {showBreakdown && trustBreakdown && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Score Breakdown</h4>
                  {Object.entries(trustBreakdown).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium">{value}%</span>
                      </div>
                      <ProgressBar value={Number(value)} size="sm" />
                    </div>
                  ))}
                </div>
              )}

              {/* History */}
              {showHistory && trustHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recent Changes</h4>
                  {trustHistory.slice(0, 3).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 bg-surface-light rounded">
                      <div className="flex items-center space-x-1">
                        {entry.change > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span>{entry.reason}</span>
                      </div>
                      <div className={`font-medium ${entry.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
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