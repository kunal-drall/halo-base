'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TrustBadge } from '@/components/trust/TrustBadge';
import { useCircleDetails } from '@/hooks/useCircles';
import { useCircleYield } from '@/hooks/useYieldData';
import { useCircleStore } from '@/store';
import { formatUSDC, formatDuration } from '@/lib/utils';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Shield, 
  TrendingUp, 
  Clock,
  ShieldCheck,
  Clock3,
  Users2,
  DollarSign as DollarIcon,
  Calendar as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  ArrowRight,
  Lock,
  Unlock,
  Star,
  StarOff
} from 'lucide-react';
import { CircleInfo, PayoutMethod } from '@/types';

interface CircleCardProps {
  circleId: bigint;
  circleAddress?: string;
  onJoin?: (circleId: bigint) => void;
  onView?: (circleId: bigint) => void;
  onFavorite?: (circleId: bigint) => void;
  isFavorite?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export function CircleCard({ 
  circleId, 
  circleAddress,
  onJoin,
  onView,
  onFavorite,
  isFavorite = false,
  showActions = true,
  variant = 'default'
}: CircleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { circleInfo, isLoading } = useCircleDetails(circleId);
  const { yieldEarned, circleYieldData, isLoading: isLoadingYield } = useCircleYield(
    circleAddress as `0x${string}`
  );
  
  const { setSelectedCircle } = useCircleStore();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-surface rounded w-3/4"></div>
          <div className="h-3 bg-surface rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-surface rounded w-full"></div>
          <div className="h-4 bg-surface rounded w-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (!circleInfo) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-text-secondary">
          Circle not found
        </CardContent>
      </Card>
    );
  }

  const {
    params,
    memberCount,
    totalContributions,
    totalYield,
    isActive,
    createdAt
  } = circleInfo;

  const progress = Number(memberCount) / Number(params.maxMembers) * 100;
  const isFull = Number(memberCount) >= Number(params.maxMembers);
  const isForming = Number(memberCount) < Number(params.maxMembers) && isActive;
  const isCompleted = !isActive;

  const getStatusBadge = () => {
    if (isCompleted) return <Badge variant="success">Completed</Badge>;
    if (isFull) return <Badge variant="warning">Full</Badge>;
    if (isForming) return <Badge variant="secondary">Forming</Badge>;
    return <Badge variant="error">Inactive</Badge>;
  };

  const getPayoutMethodIcon = (method: PayoutMethod) => {
    switch (method) {
      case PayoutMethod.FIXED_ROTATION:
        return <Users className="h-4 w-4" />;
      case PayoutMethod.AUCTION:
        return <DollarSign className="h-4 w-4" />;
      case PayoutMethod.RANDOM:
        return <Shield className="h-4 w-4" />;
      case PayoutMethod.HYBRID:
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getPayoutMethodLabel = (method: PayoutMethod) => {
    switch (method) {
      case PayoutMethod.FIXED_ROTATION:
        return 'Rotation';
      case PayoutMethod.AUCTION:
        return 'Auction';
      case PayoutMethod.RANDOM:
        return 'Random';
      case PayoutMethod.HYBRID:
        return 'Hybrid';
      default:
        return 'Unknown';
    }
  };

  const handleView = () => {
    setSelectedCircle(circleInfo);
    onView?.(circleId);
  };

  const handleJoin = () => {
    onJoin?.(circleId);
  };

  const handleFavorite = () => {
    onFavorite?.(circleId);
  };

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-sm">Circle #{circleId.toString()}</h3>
                  {getStatusBadge()}
                </div>
                <div className="flex items-center space-x-4 text-xs text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <DollarIcon className="h-3 w-3" />
                    <span>{formatUSDC(params.contributionAmount)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UsersIcon className="h-3 w-3" />
                    <span>{memberCount.toString()}/{params.maxMembers.toString()}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={handleView}>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">
                  Circle #{circleId.toString()}
                </CardTitle>
                <div className="flex items-center space-x-2 mb-3">
                  {getStatusBadge()}
                  <TrustBadge tier={Number(params.minTrustTier)} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleFavorite}
                  className="p-2"
                >
                  {isFavorite ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={handleView}>
                  View
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Contribution Amount & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-sm text-text-secondary">
                  <DollarIcon className="h-4 w-4" />
                  <span>Contribution</span>
                </div>
                <div className="font-semibold">{formatUSDC(params.contributionAmount)}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-sm text-text-secondary">
                  <ClockIcon className="h-4 w-4" />
                  <span>Duration</span>
                </div>
                <div className="font-semibold">{formatDuration(Number(params.cycleDuration))}</div>
              </div>
            </div>

            {/* Member Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Members</span>
                <span className="font-medium">{memberCount.toString()}/{params.maxMembers.toString()}</span>
              </div>
              <ProgressBar value={progress} size="sm" />
            </div>

            {/* Payout Method */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1 text-text-secondary">
                {getPayoutMethodIcon(params.payoutMethod)}
                <span>Payout:</span>
              </div>
              <span className="font-medium">{getPayoutMethodLabel(params.payoutMethod)}</span>
            </div>

            {/* Insurance & Penalties */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-text-secondary">Insurance</div>
                <div className="font-medium">{(Number(params.insurancePercent) / 100).toFixed(1)}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-text-secondary">Late Penalty</div>
                <div className="font-medium">{(Number(params.latePenaltyBps) / 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Yield Information */}
            {!isLoadingYield && circleYieldData && (
              <div className="bg-surface-light rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Yield Earned</span>
                  <span className="font-medium text-green-600">
                    {formatUSDC(circleYieldData.yieldEarned)}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-text-secondary mt-1">
                  <TrendingUpIcon className="h-3 w-3" />
                  <span>APY: {Number(yieldEarned || 0) > 0 ? 'Active' : 'Pending'}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleView}
                  className="flex-1"
                >
                  View Details
                </Button>
                {isForming && (
                  <Button
                    size="sm"
                    onClick={handleJoin}
                    className="flex-1"
                    disabled={isFull}
                  >
                    {isFull ? 'Full' : 'Join Circle'}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl">Circle #{circleId.toString()}</CardTitle>
            <div className="flex items-center space-x-2">
              {getStatusBadge()}
              <TrustBadge tier={Number(params.minTrustTier)} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleFavorite}
              className="p-2"
            >
              {isFavorite ? (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Contribution Amount */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Contribution</span>
            <span className="font-semibold">{formatUSDC(params.contributionAmount)}</span>
          </div>

          {/* Member Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-text-secondary">Members</span>
              <span className="font-medium">{memberCount.toString()}/{params.maxMembers.toString()}</span>
            </div>
            <ProgressBar value={progress} size="sm" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <Users className="h-4 w-4 mx-auto text-text-secondary" />
              <div className="text-sm font-medium">{memberCount.toString()}</div>
              <div className="text-xs text-text-secondary">Members</div>
            </div>
            <div className="space-y-1">
              <DollarSign className="h-4 w-4 mx-auto text-text-secondary" />
              <div className="text-sm font-medium">{formatUSDC(params.contributionAmount)}</div>
              <div className="text-xs text-text-secondary">Contribution</div>
            </div>
            <div className="space-y-1">
              <Calendar className="h-4 w-4 mx-auto text-text-secondary" />
              <div className="text-sm font-medium">{formatDuration(Number(params.cycleDuration))}</div>
              <div className="text-xs text-text-secondary">Duration</div>
            </div>
          </div>

          {/* Payout Method */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1 text-text-secondary">
              {getPayoutMethodIcon(params.payoutMethod)}
              <span>Payout:</span>
            </div>
            <span className="font-medium">{getPayoutMethodLabel(params.payoutMethod)}</span>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleView}
                className="flex-1"
              >
                View Details
              </Button>
              {isForming && (
                <Button
                  size="sm"
                  onClick={handleJoin}
                  className="flex-1"
                  disabled={isFull}
                >
                  {isFull ? 'Full' : 'Join Circle'}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}