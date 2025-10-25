'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CircleCard } from '@/components/circles/CircleCard';
import { useCircles } from '@/hooks/useCircles';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { PayoutMethod } from '@/types';
import { 
  Star, 
  TrendingUp, 
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

interface CircleRecommendationsProps {
  onCircleSelect?: (circleId: bigint) => void;
  onJoinCircle?: (circleId: bigint) => void;
  maxRecommendations?: number;
  showCategories?: boolean;
  className?: string;
}

export function CircleRecommendations({
  onCircleSelect,
  onJoinCircle,
  maxRecommendations = 6,
  showCategories = true,
  className = ''
}: CircleRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isJoining, setIsJoining] = useState<Record<string, boolean>>({});

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScore, trustTier, trustMetrics } = useTrustScore();

  const { 
    getRecommendations, 
    getPublicCircles, 
    joinCircle, 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline
  } = useCircleStore();

  const { 
    getRecommendations: getUIRecommendations, 
    getPublicCircles: getUIPublic, 
    joinCircle: joinUICircle, 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline
  } = useUIStore();

  useEffect(() => {
    if (isRegistered) {
      loadRecommendations();
    }
  }, [isRegistered, trustScore, trustTier]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      const data = await getRecommendations({
        userTrustScore: trustScore || 0n,
        userTrustTier: trustTier || 0,
        maxRecommendations,
        categories: selectedCategory === 'all' ? undefined : [selectedCategory]
      });
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCircle = async (circleId: bigint) => {
    try {
      setIsJoining(prev => ({ ...prev, [circleId.toString()]: true }));
      await joinCircle(circleId);
      onJoinCircle?.(circleId);
      await loadRecommendations();
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

  const getRecommendationCategories = () => {
    const categories = new Set<string>();
    recommendations.forEach(circle => {
      if (circle.category) {
        categories.add(circle.category);
      }
    });
    return Array.from(categories).sort();
  };

  const getFilteredRecommendations = () => {
    if (selectedCategory === 'all') {
      return recommendations;
    }
    return recommendations.filter(circle => circle.category === selectedCategory);
  };

  const getRecommendationReason = (circle: any) => {
    const reasons = [];
    
    if (circle.params.minTrustTier <= (trustTier || 0)) {
      reasons.push('Trust tier match');
    }
    
    if (circle.params.contributionAmount <= (trustScore || 0n) * 1000n) {
      reasons.push('Amount within range');
    }
    
    if (circle.memberCount < circle.params.maxMembers) {
      reasons.push('Open spots available');
    }
    
    if (circle.params.isPublic) {
      reasons.push('Public circle');
    }
    
    if (circle.params.payoutMethod === 'auction') {
      reasons.push('Auction payout');
    }
    
    return reasons.slice(0, 2); // Show max 2 reasons
  };

  const getRecommendationScore = (circle: any) => {
    let score = 0;
    
    // Trust tier match
    if (circle.params.minTrustTier <= (trustTier || 0)) {
      score += 30;
    }
    
    // Amount compatibility
    const amountRatio = Number(circle.params.contributionAmount) / Number(trustScore || 1n);
    if (amountRatio <= 0.1) score += 25;
    else if (amountRatio <= 0.2) score += 20;
    else if (amountRatio <= 0.5) score += 15;
    
    // Availability
    if (circle.memberCount < circle.params.maxMembers) {
      score += 20;
    }
    
    // Public circle
    if (circle.params.isPublic) {
      score += 15;
    }
    
    // Recent creation
    const daysSinceCreation = (Date.now() - Number(circle.createdAt)) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation <= 7) score += 10;
    
    return Math.min(score, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge variant="success">Excellent</Badge>;
    if (score >= 60) return <Badge variant="warning">Good</Badge>;
    if (score >= 40) return <Badge variant="secondary">Fair</Badge>;
    return <Badge variant="error">Poor</Badge>;
  };

  if (isLoading || isLoadingCircles) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recommended Circles</CardTitle>
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
            Please register with the Trust Score Manager to get personalized recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  const filteredRecommendations = getFilteredRecommendations();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Recommended Circles</span>
            <Badge variant="secondary">{filteredRecommendations.length}</Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadRecommendations}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Category Filters */}
        {showCategories && getRecommendationCategories().length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {getRecommendationCategories().map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-12 w-12 mx-auto text-text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recommendations</h3>
            <p className="text-text-secondary">
              We couldn't find any circles that match your preferences.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredRecommendations.map((circle, index) => {
                const score = getRecommendationScore(circle);
                const reasons = getRecommendationReason(circle);
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
                        {/* Recommendation Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">Recommended</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getScoreBadge(score)}
                            <span className={`text-sm font-medium ${getScoreColor(score)}`}>
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
                          
                          {/* Recommendation Reasons */}
                          {reasons.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {reasons.map((reason, reasonIndex) => (
                                <Badge key={reasonIndex} variant="secondary" className="text-xs">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                          )}
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
