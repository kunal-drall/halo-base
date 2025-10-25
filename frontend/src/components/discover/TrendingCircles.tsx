'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CircleCard } from '@/components/circles/CircleCard';
import { useCircles } from '@/hooks/useCircles';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { PayoutMethod } from '@/types';
import { 
  TrendingUp, 
  Flame, 
  Star, 
  Users, 
  DollarSign, 
  Clock, 
  Shield, 
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

interface TrendingCirclesProps {
  onCircleSelect?: (circleId: bigint) => void;
  onJoinCircle?: (circleId: bigint) => void;
  maxTrending?: number;
  showTimeframe?: boolean;
  className?: string;
}

export function TrendingCircles({
  onCircleSelect,
  onJoinCircle,
  maxTrending = 6,
  showTimeframe = true,
  className = ''
}: TrendingCirclesProps) {
  const [trendingCircles, setTrendingCircles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isJoining, setIsJoining] = useState<Record<string, boolean>>({});

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();

  const { 
    getTrendingCircles, 
    getPublicCircles, 
    joinCircle, 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline
  } = useCircleStore();

  const { 
    getTrendingCircles: getUITrending, 
    getPublicCircles: getUIPublic, 
    joinCircle: joinUICircle, 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline
  } = useUIStore();

  useEffect(() => {
    loadTrendingCircles();
  }, [selectedTimeframe]);

  const loadTrendingCircles = async () => {
    try {
      setIsLoading(true);
      const data = await getTrendingCircles({
        timeframe: selectedTimeframe,
        maxResults: maxTrending
      });
      setTrendingCircles(data);
    } catch (error) {
      console.error('Failed to load trending circles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCircle = async (circleId: bigint) => {
    try {
      setIsJoining(prev => ({ ...prev, [circleId.toString()]: true }));
      await joinCircle(circleId);
      onJoinCircle?.(circleId);
      await loadTrendingCircles();
    } catch (error) {
      console.error('Failed to join circle:', error);
    } finally {
      setIsJoining(prev => ({ ...prev, [circleId.toString()]: false }));
    }
  };

  const handleFavorite = (circleId: bigint) => {
    const circleIdStr = circleId.toString();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(circleIdStr)) {
        newFavorites.delete(circleIdStr);
      } else {
        newFavorites.add(circleIdStr);
      }
      return newFavorites;
    });
  };

  const getTrendingIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'hot':
        return <Flame className="h-4 w-4 text-red-500" />;
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'popular':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'new':
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendingBadge = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'hot':
        return <Badge variant="error">Hot</Badge>;
      case 'rising':
        return <Badge variant="success">Rising</Badge>;
      case 'popular':
        return <Badge variant="warning">Popular</Badge>;
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      default:
        return <Badge variant="secondary">Trending</Badge>;
    }
  };

  const getTrendingColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'hot':
        return 'text-red-500';
      case 'rising':
        return 'text-green-500';
      case 'popular':
        return 'text-yellow-500';
      case 'new':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendingScore = (circle: any) => {
    let score = 0;
    
    // Member growth rate
    const memberGrowthRate = circle.memberGrowthRate || 0;
    score += memberGrowthRate * 10;
    
    // Activity score
    const activityScore = circle.activityScore || 0;
    score += activityScore * 5;
    
    // Trust score impact
    const trustScoreImpact = circle.trustScoreImpact || 0;
    score += trustScoreImpact * 3;
    
    // Recent activity
    const recentActivity = circle.recentActivity || 0;
    score += recentActivity * 2;
    
    return Math.min(score, 100);
  };

  const getTrendingRank = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getTrendingDescription = (circle: any) => {
    const descriptions = [];
    
    if (circle.memberGrowthRate > 0.5) {
      descriptions.push('Rapid member growth');
    }
    
    if (circle.activityScore > 80) {
      descriptions.push('High activity');
    }
    
    if (circle.trustScoreImpact > 50) {
      descriptions.push('Strong trust impact');
    }
    
    if (circle.recentActivity > 10) {
      descriptions.push('Recent activity');
    }
    
    return descriptions.slice(0, 2).join(' • ') || 'Trending circle';
  };

  if (isLoading || isLoadingCircles) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Trending Circles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-surface rounded"></div>
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
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Registration Required</h3>
          <p className="text-text-secondary">
            Please register with the Trust Score Manager to view trending circles.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Trending Circles</span>
            <Badge variant="secondary">{trendingCircles.length}</Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {showTimeframe && (
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant={selectedTimeframe === '24h' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedTimeframe('24h')}
                  className="rounded-r-none"
                >
                  24h
                </Button>
                <Button
                  variant={selectedTimeframe === '7d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedTimeframe('7d')}
                  className="rounded-l-none rounded-r-none"
                >
                  7d
                </Button>
                <Button
                  variant={selectedTimeframe === '30d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedTimeframe('30d')}
                  className="rounded-l-none"
                >
                  30d
                </Button>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={loadTrendingCircles}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {trendingCircles.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto text-text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Trending Circles</h3>
            <p className="text-text-secondary">
              No circles are trending in the selected timeframe.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {trendingCircles.map((circle, index) => {
                const score = getTrendingScore(circle);
                const isJoiningCircle = isJoining[circle.id.toString()];
                
                return (
                  <motion.div
                    key={circle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        {/* Trending Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">
                              {getTrendingRank(index)}
                            </span>
                            {getTrendingIcon(circle.trend)}
                            <span className="text-sm font-medium">
                              {circle.trend || 'Trending'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getTrendingBadge(circle.trend)}
                            <span className="text-sm font-medium text-green-500">
                              {score}%
                            </span>
                          </div>
                        </div>

                        {/* Circle Info */}
                        <div className="mb-4">
                          <h3 className="font-semibold text-lg mb-2">
                            {circle.name || `Circle #${circle.id}`}
                          </h3>
                          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                            {circle.description || 'No description available'}
                          </p>
                          
                          {/* Trending Description */}
                          <div className="text-xs text-text-secondary mb-3">
                            {getTrendingDescription(circle)}
                          </div>
                        </div>

                        {/* Circle Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <div className="text-xs text-text-secondary">Contribution</div>
                            <div className="font-medium text-sm">
                              {formatUSDC(circle.params.contributionAmount)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-text-secondary">Duration</div>
                            <div className="font-medium text-sm">
                              {formatDuration(Number(circle.params.cycleDuration))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-text-secondary">Members</div>
                            <div className="font-medium text-sm">
                              {circle.memberCount}/{circle.params.maxMembers}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-text-secondary">Trust Tier</div>
                            <div className="font-medium text-sm">
                              {circle.params.minTrustTier}
                            </div>
                          </div>
                        </div>

                        {/* Trending Metrics */}
                        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-surface-light rounded">
                          <div>
                            <div className="text-xs text-text-secondary">Growth Rate</div>
                            <div className="font-medium text-sm text-green-500">
                              +{((circle.memberGrowthRate || 0) * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-text-secondary">Activity</div>
                            <div className="font-medium text-sm text-blue-500">
                              {circle.activityScore || 0}%
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-text-secondary">
                            Created {formatDate(Number(circle.createdAt))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFavorite(circle.id)}
                              className={favorites.has(circle.id.toString()) ? 'text-red-500' : ''}
                            >
                              <Heart className={`h-4 w-4 ${favorites.has(circle.id.toString()) ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onCircleSelect?.(circle.id)}
                            >
                              View
                            </Button>
                            {circle.memberCount < circle.params.maxMembers && (
                              <Button
                                size="sm"
                                onClick={() => handleJoinCircle(circle.id)}
                                disabled={isJoiningCircle}
                              >
                                {isJoiningCircle ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <Plus className="h-4 w-4 mr-1" />
                                )}
                                Join
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
