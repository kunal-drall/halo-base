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

interface CircleOverviewProps {
  circleId: bigint;
  circle: any;
  onJoin?: () => void;
  onLeave?: () => void;
  onContribute?: (amount: bigint) => void;
  className?: string;
}

export function CircleOverview({
  circleId,
  circle,
  onJoin,
  onLeave,
  onContribute,
  className = ''
}: CircleOverviewProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScore, trustTier, trustMetrics } = useTrustScore();

  const { 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline,
    joinCircle,
    leaveCircle,
    contributeToCircle
  } = useCircleStore();

  const { 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline,
    joinCircle: joinUICircle,
    leaveCircle: leaveUICircle,
    contributeToCircle: contributeUICircle
  } = useUIStore();

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await joinCircle(circleId);
      onJoin?.();
    } catch (error) {
      console.error('Failed to join circle:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      setIsLeaving(true);
      await leaveCircle(circleId);
      onLeave?.();
    } catch (error) {
      console.error('Failed to leave circle:', error);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleContribute = async (amount: bigint) => {
    try {
      setIsContributing(true);
      await contributeToCircle(circleId, amount);
      onContribute?.(amount);
    } catch (error) {
      console.error('Failed to contribute:', error);
    } finally {
      setIsContributing(false);
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

  const getTrustTierColor = (tier: number) => {
    if (tier >= 5) return 'text-purple-500';
    if (tier >= 4) return 'text-blue-500';
    if (tier >= 3) return 'text-green-500';
    if (tier >= 2) return 'text-yellow-500';
    if (tier >= 1) return 'text-orange-500';
    return 'text-red-500';
  };

  const getTrustTierBadge = (tier: number) => {
    if (tier >= 5) return <Badge variant="secondary">Elite</Badge>;
    if (tier >= 4) return <Badge variant="secondary">Expert</Badge>;
    if (tier >= 3) return <Badge variant="success">Advanced</Badge>;
    if (tier >= 2) return <Badge variant="warning">Intermediate</Badge>;
    if (tier >= 1) return <Badge variant="error">Beginner</Badge>;
    return <Badge variant="error">New</Badge>;
  };

  const getTrustTierName = (tier: number) => {
    if (tier >= 5) return 'Elite';
    if (tier >= 4) return 'Expert';
    if (tier >= 3) return 'Advanced';
    if (tier >= 2) return 'Intermediate';
    if (tier >= 1) return 'Beginner';
    return 'New';
  };

  const calculateTotalValue = () => {
    if (!circle.params.contributionAmount || !circle.memberCount) return 0n;
    return circle.params.contributionAmount * BigInt(circle.memberCount);
  };

  const calculateProgress = () => {
    if (!circle.params.maxMembers) return 0;
    return (circle.memberCount / circle.params.maxMembers) * 100;
  };

  const canJoin = () => {
    return circle.isActive && 
           circle.memberCount < circle.params.maxMembers && 
           (userTrustTier || 0) >= circle.params.minTrustTier &&
           (userTrustScore || 0n) >= circle.params.minTrustScore;
  };

  const isMember = () => {
    // This would need to be implemented based on your membership tracking
    return false;
  };

  if (!circle) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Circle Not Found</h3>
          <p className="text-text-secondary">
            The circle you're looking for doesn't exist or has been removed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Circle Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                {circle.name || `Circle #${circle.id}`}
              </h2>
              <p className="text-text-secondary mb-4">
                {circle.description || 'No description available'}
              </p>
              <div className="flex items-center space-x-2">
                {getStatusBadge(circle.status)}
                {getPayoutMethodBadge(circle.params.payoutMethod)}
                {circle.params.isPublic ? (
                  <Badge variant="secondary">Public</Badge>
                ) : (
                  <Badge variant="secondary">Private</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {canJoin() && !isMember() && (
                <Button
                  onClick={handleJoin}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Join Circle
                </Button>
              )}
              {isMember() && (
                <Button
                  variant="outline"
                  onClick={handleLeave}
                  disabled={isLeaving}
                >
                  {isLeaving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Leave Circle
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Member Progress</span>
              <span className="text-sm text-text-secondary">
                {circle.memberCount}/{circle.params.maxMembers}
              </span>
            </div>
            <ProgressBar value={calculateProgress()} size="md" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {formatUSDC(circle.params.contributionAmount)}
              </div>
              <div className="text-sm text-text-secondary">Contribution</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {formatDuration(Number(circle.params.cycleDuration))}
              </div>
              <div className="text-sm text-text-secondary">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {formatUSDC(calculateTotalValue())}
              </div>
              <div className="text-sm text-text-secondary">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {circle.params.minTrustTier}
              </div>
              <div className="text-sm text-text-secondary">Min Trust Tier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Circle Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Circle Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-text-secondary">Contribution Amount</div>
                <div className="font-medium">{formatUSDC(circle.params.contributionAmount)}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Maximum Members</div>
                <div className="font-medium">{circle.params.maxMembers}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Cycle Duration</div>
                <div className="font-medium">{formatDuration(Number(circle.params.cycleDuration))}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Trust Tier Required</div>
                <div className="font-medium">{circle.params.minTrustTier}</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="text-sm text-text-secondary mb-2">Trust Score Required</div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{circle.params.minTrustScore.toString()}</span>
                <Shield className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Payout Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              {getPayoutMethodIcon(circle.params.payoutMethod)}
              <div>
                <div className="font-medium capitalize">
                  {circle.params.payoutMethod}
                </div>
                <div className="text-sm text-text-secondary">
                  {circle.params.payoutMethod === 'auction' ? 'Highest bidder wins' :
                   circle.params.payoutMethod === 'lottery' ? 'Random selection' :
                   circle.params.payoutMethod === 'rotation' ? 'Fixed order' : 'Unknown method'}
                </div>
              </div>
              {getPayoutMethodBadge(circle.params.payoutMethod)}
            </div>
            
            {circle.params.insuranceEnabled && (
              <div className="p-3 bg-surface-light rounded">
                <div className="text-sm text-text-secondary">Insurance</div>
                <div className="font-medium">{formatUSDC(circle.params.insuranceAmount)}</div>
              </div>
            )}
            
            {circle.params.latePenaltyEnabled && (
              <div className="p-3 bg-surface-light rounded">
                <div className="text-sm text-text-secondary">Late Penalty</div>
                <div className="font-medium">{formatUSDC(circle.params.latePenaltyAmount)}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trust Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Trust Requirements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-text-secondary mb-2">Minimum Trust Tier</div>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold ${getTrustTierColor(circle.params.minTrustTier)}`}>
                  {getTrustTierName(circle.params.minTrustTier)}
                </span>
                {getTrustTierBadge(circle.params.minTrustTier)}
              </div>
            </div>
            <div>
              <div className="text-sm text-text-secondary mb-2">Minimum Trust Score</div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-500">
                  {circle.params.minTrustScore.toString()}
                </span>
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {canJoin() && !isMember() && (
              <Button
                onClick={handleJoin}
                disabled={isJoining}
                className="flex-1"
              >
                {isJoining ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Join Circle
              </Button>
            )}
            {isMember() && (
              <Button
                variant="outline"
                onClick={handleLeave}
                disabled={isLeaving}
                className="flex-1"
              >
                {isLeaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Leave Circle
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>Detailed Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Circle Parameters</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Circle ID:</span>
                        <span className="font-medium">#{circle.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Created:</span>
                        <span className="font-medium">{formatDate(Number(circle.createdAt))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Creator:</span>
                        <span className="font-medium">{circle.creator.slice(0, 10)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Visibility:</span>
                        <span className="font-medium">{circle.params.isPublic ? 'Public' : 'Private'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Advanced Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Insurance:</span>
                        <span className="font-medium">
                          {circle.params.insuranceEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Late Penalty:</span>
                        <span className="font-medium">
                          {circle.params.latePenaltyEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Yield Generation:</span>
                        <span className="font-medium">
                          {circle.params.yieldEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Auto-start:</span>
                        <span className="font-medium">
                          {circle.params.autoStart ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
