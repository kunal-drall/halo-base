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

interface CircleActionsProps {
  circleId: bigint;
  circle: any;
  userMembership?: any;
  onAction?: (action: string, data?: any) => void;
  className?: string;
}

export function CircleActions({
  circleId,
  circle,
  userMembership,
  onAction,
  className = ''
}: CircleActionsProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [contributeAmount, setContributeAmount] = useState<bigint>(0n);
  const [bidAmount, setBidAmount] = useState<bigint>(0n);

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
    contributeToCircle,
    bidOnPayout,
    claimPayout,
    startCircle,
    endCircle
  } = useCircleStore();

  const { 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline,
    joinCircle: joinUICircle,
    leaveCircle: leaveUICircle,
    contributeToCircle: contributeUICircle,
    bidOnPayout: bidUIPayout,
    claimPayout: claimUIPayout,
    startCircle: startUICircle,
    endCircle: endUICircle
  } = useUIStore();

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await joinCircle(circleId);
      onAction?.('join');
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
      onAction?.('leave');
    } catch (error) {
      console.error('Failed to leave circle:', error);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleContribute = async () => {
    try {
      setIsContributing(true);
      await contributeToCircle(circleId, contributeAmount);
      onAction?.('contribute', { amount: contributeAmount });
      setShowContributeForm(false);
      setContributeAmount(0n);
    } catch (error) {
      console.error('Failed to contribute:', error);
    } finally {
      setIsContributing(false);
    }
  };

  const handleBid = async () => {
    try {
      setIsBidding(true);
      await bidOnPayout(circleId, bidAmount);
      onAction?.('bid', { amount: bidAmount });
      setShowBidForm(false);
      setBidAmount(0n);
    } catch (error) {
      console.error('Failed to bid:', error);
    } finally {
      setIsBidding(false);
    }
  };

  const handleClaim = async () => {
    try {
      setIsClaiming(true);
      await claimPayout(circleId);
      onAction?.('claim');
    } catch (error) {
      console.error('Failed to claim:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleStartCircle = async () => {
    try {
      await startCircle(circleId);
      onAction?.('start');
    } catch (error) {
      console.error('Failed to start circle:', error);
    }
  };

  const handleEndCircle = async () => {
    try {
      await endCircle(circleId);
      onAction?.('end');
    } catch (error) {
      console.error('Failed to end circle:', error);
    }
  };

  const canJoin = () => {
    return circle.isActive && 
           circle.memberCount < circle.params.maxMembers && 
           (userTrustTier || 0) >= circle.params.minTrustTier &&
           (userTrustScore || 0n) >= circle.params.minTrustScore;
  };

  const isMember = () => {
    return userMembership?.isMember || false;
  };

  const isCreator = () => {
    return userMembership?.isCreator || false;
  };

  const canContribute = () => {
    return isMember() && circle.isActive;
  };

  const canBid = () => {
    return isMember() && 
           circle.isActive && 
           circle.params.payoutMethod === 'auction' &&
           circle.currentCycle > 0;
  };

  const canClaim = () => {
    return isMember() && 
           circle.isActive && 
           circle.currentCycle > 0 &&
           userMembership?.canClaim;
  };

  const canStart = () => {
    return isCreator() && 
           circle.memberCount === circle.params.maxMembers &&
           !circle.isActive;
  };

  const canEnd = () => {
    return isCreator() && circle.isActive;
  };

  const getActionButtons = () => {
    const buttons = [];

    // Join/Leave buttons
    if (canJoin() && !isMember()) {
      buttons.push(
        <Button
          key="join"
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
      );
    }

    if (isMember() && !isCreator()) {
      buttons.push(
        <Button
          key="leave"
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
      );
    }

    // Contribution button
    if (canContribute()) {
      buttons.push(
        <Button
          key="contribute"
          onClick={() => setShowContributeForm(true)}
          className="flex-1"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Contribute
        </Button>
      );
    }

    // Bid button
    if (canBid()) {
      buttons.push(
        <Button
          key="bid"
          onClick={() => setShowBidForm(true)}
          className="flex-1"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Bid
        </Button>
      );
    }

    // Claim button
    if (canClaim()) {
      buttons.push(
        <Button
          key="claim"
          onClick={handleClaim}
          disabled={isClaiming}
          className="flex-1"
        >
          {isClaiming ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          Claim
        </Button>
      );
    }

    // Creator actions
    if (canStart()) {
      buttons.push(
        <Button
          key="start"
          onClick={handleStartCircle}
          className="flex-1"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Circle
        </Button>
      );
    }

    if (canEnd()) {
      buttons.push(
        <Button
          key="end"
          variant="outline"
          onClick={handleEndCircle}
          className="flex-1"
        >
          <Stop className="h-4 w-4 mr-2" />
          End Circle
        </Button>
      );
    }

    return buttons;
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
    <div className={`space-y-4 ${className}`}>
      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getActionButtons()}
          </div>
        </CardContent>
      </Card>

      {/* Contribution Form */}
      <AnimatePresence>
        {showContributeForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Contribute to Circle</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contribution Amount (USDC)
                  </label>
                  <input
                    type="number"
                    value={contributeAmount.toString()}
                    onChange={(e) => setContributeAmount(BigInt(e.target.value || 0))}
                    placeholder="Enter contribution amount"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    Required: {formatUSDC(circle.params.contributionAmount)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowContributeForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleContribute}
                      disabled={isContributing || contributeAmount <= 0n}
                    >
                      {isContributing ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <DollarSign className="h-4 w-4 mr-2" />
                      )}
                      Contribute
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bid Form */}
      <AnimatePresence>
        {showBidForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Bid on Payout</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bid Amount (USDC)
                  </label>
                  <input
                    type="number"
                    value={bidAmount.toString()}
                    onChange={(e) => setBidAmount(BigInt(e.target.value || 0))}
                    placeholder="Enter bid amount"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="p-3 bg-surface-light rounded">
                  <div className="text-sm text-text-secondary mb-1">Current Highest Bid</div>
                  <div className="font-medium">{formatUSDC(circle.currentHighestBid || 0n)}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    Minimum bid: {formatUSDC(circle.params.contributionAmount)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowBidForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleBid}
                      disabled={isBidding || bidAmount <= 0n}
                    >
                      {isBidding ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TrendingUp className="h-4 w-4 mr-2" />
                      )}
                      Place Bid
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Membership Status */}
      {userMembership && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Your Membership</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-text-secondary">Status</div>
                  <div className="font-medium">
                    {userMembership.isMember ? 'Member' : 'Not a member'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Role</div>
                  <div className="font-medium">
                    {userMembership.isCreator ? 'Creator' : 'Member'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Total Contributed</div>
                  <div className="font-medium">
                    {formatUSDC(userMembership.totalContributed || 0n)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Can Claim</div>
                  <div className="font-medium">
                    {userMembership.canClaim ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
              
              {userMembership.isMember && (
                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-text-secondary mb-2">Contribution History</div>
                  <div className="space-y-2">
                    {userMembership.contributions?.map((contribution: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-surface-light rounded">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Cycle {contribution.cycle}</span>
                        </div>
                        <div className="text-sm font-medium">
                          {formatUSDC(contribution.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
