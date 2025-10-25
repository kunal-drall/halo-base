'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AddressDisplay } from '@/components/ui/AddressDisplay';
import { useLendingCircle } from '@/hooks/useLendingCircle';
import { useCircleStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  Calendar,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Crown,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface PayoutInfo {
  cycleNumber: bigint;
  totalAmount: bigint;
  memberCount: bigint;
  payoutPerMember: bigint;
  isCompleted: boolean;
  completedAt?: bigint;
  winner?: string;
  method: string;
  bids?: Array<{
    member: string;
    amount: bigint;
    timestamp: bigint;
  }>;
}

interface CirclePayoutProps {
  circleId: bigint;
  circleAddress?: string;
  onStartPayout?: (cycleNumber: bigint) => void;
  onCompletePayout?: (cycleNumber: bigint) => void;
  onBid?: (cycleNumber: bigint, amount: bigint) => void;
  onWithdraw?: (cycleNumber: bigint) => void;
  showHistory?: boolean;
  showBidding?: boolean;
  className?: string;
}

export function CirclePayout({
  circleId,
  circleAddress,
  onStartPayout,
  onCompletePayout,
  onBid,
  onWithdraw,
  showHistory = true,
  showBidding = true,
  className = ''
}: CirclePayoutProps) {
  const [payoutInfo, setPayoutInfo] = useState<PayoutInfo | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    circleInfo,
    currentCycle,
    totalContributed,
    isActive,
    isLoading: isLoadingCircle
  } = useLendingCircle(circleId, circleAddress as `0x${string}`);

  const { getPayoutHistory, getBidHistory, getPayoutInfo } = useCircleStore();

  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
  const [bidHistory, setBidHistory] = useState<any[]>([]);

  useEffect(() => {
    if (circleInfo) {
      loadPayoutInfo();
    }
    if (showHistory) {
      loadPayoutHistory();
    }
    if (showBidding) {
      loadBidHistory();
    }
  }, [circleId, circleInfo, showHistory, showBidding]);

  const loadPayoutInfo = async () => {
    try {
      if (currentCycle) {
        const info = await getPayoutInfo(circleId, currentCycle.cycleNumber);
        setPayoutInfo(info);
      }
    } catch (error) {
      console.error('Failed to load payout info:', error);
    }
  };

  const loadPayoutHistory = async () => {
    try {
      const history = await getPayoutHistory(circleId);
      setPayoutHistory(history);
    } catch (error) {
      console.error('Failed to load payout history:', error);
    }
  };

  const loadBidHistory = async () => {
    try {
      if (currentCycle) {
        const history = await getBidHistory(circleId, currentCycle.cycleNumber);
        setBidHistory(history);
      }
    } catch (error) {
      console.error('Failed to load bid history:', error);
    }
  };

  const handleStartPayout = async () => {
    if (!currentCycle) return;
    
    try {
      setIsStarting(true);
      await onStartPayout?.(currentCycle.cycleNumber);
      await loadPayoutInfo();
    } catch (error) {
      console.error('Failed to start payout:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleCompletePayout = async () => {
    if (!currentCycle) return;
    
    try {
      setIsCompleting(true);
      await onCompletePayout?.(currentCycle.cycleNumber);
      await loadPayoutInfo();
      await loadPayoutHistory();
    } catch (error) {
      console.error('Failed to complete payout:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleBid = async () => {
    if (!currentCycle || !bidAmount) return;
    
    try {
      setIsBidding(true);
      const amount = BigInt(Math.floor(Number(bidAmount) * 1e6));
      await onBid?.(currentCycle.cycleNumber, amount);
      setBidAmount('');
      await loadBidHistory();
    } catch (error) {
      console.error('Failed to place bid:', error);
    } finally {
      setIsBidding(false);
    }
  };

  const handleWithdraw = async () => {
    if (!currentCycle) return;
    
    try {
      setIsWithdrawing(true);
      await onWithdraw?.(currentCycle.cycleNumber);
      await loadPayoutInfo();
    } catch (error) {
      console.error('Failed to withdraw:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getPayoutStatus = () => {
    if (!payoutInfo) return { status: 'not_started', message: 'Payout not started' };
    if (payoutInfo.isCompleted) return { status: 'completed', message: 'Payout completed' };
    if (payoutInfo.method === 'auction' && payoutInfo.bids && payoutInfo.bids.length > 0) {
      return { status: 'bidding', message: 'Bidding in progress' };
    }
    return { status: 'active', message: 'Payout active' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'bidding':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'active':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'not_started':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'bidding':
        return <Badge variant="secondary">Bidding</Badge>;
      case 'active':
        return <Badge variant="warning">Active</Badge>;
      case 'not_started':
        return <Badge variant="secondary">Not Started</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPayoutMethodLabel = (method: string) => {
    switch (method) {
      case 'fixed_rotation':
        return 'Fixed Rotation';
      case 'auction':
        return 'Auction';
      case 'random':
        return 'Random';
      case 'hybrid':
        return 'Hybrid';
      default:
        return 'Unknown';
    }
  };

  if (isLoadingCircle) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Payout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-surface rounded w-3/4"></div>
              <div className="h-4 bg-surface rounded w-1/2"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-10 bg-surface rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!circleInfo || !currentCycle) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-text-secondary">
          Circle information not available
        </CardContent>
      </Card>
    );
  }

  const payoutStatus = getPayoutStatus();
  const canStartPayout = payoutStatus.status === 'not_started' && isActive;
  const canCompletePayout = payoutStatus.status === 'active' || payoutStatus.status === 'bidding';
  const canBid = payoutStatus.status === 'bidding' && showBidding;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Payout</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getStatusIcon(payoutStatus.status)}
            {getStatusBadge(payoutStatus.status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payout Info */}
        {payoutInfo && (
          <div className="bg-surface-light rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Cycle {payoutInfo.cycleNumber.toString()}</h4>
              <Badge variant="secondary">{getPayoutMethodLabel(payoutInfo.method)}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-text-secondary">Total Amount</div>
                <div className="font-medium">{formatUSDC(payoutInfo.totalAmount)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-text-secondary">Payout per Member</div>
                <div className="font-medium">{formatUSDC(payoutInfo.payoutPerMember)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-text-secondary">Members</div>
                <div className="font-medium">{payoutInfo.memberCount.toString()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-text-secondary">Status</div>
                <div className="font-medium">{getStatusBadge(payoutStatus.status)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Winner Display */}
        {payoutInfo?.winner && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-green-800">Winner</span>
            </div>
            <AddressDisplay address={payoutInfo.winner} />
          </div>
        )}

        {/* Bidding Section */}
        {canBid && (
          <div className="space-y-4">
            <h4 className="font-medium">Place Bid</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bid Amount (USDC)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBidAmount(Number(payoutInfo?.payoutPerMember || 0) / 1e6)}
                  >
                    Max
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleBid}
                disabled={!bidAmount || isBidding}
                className="w-full"
              >
                {isBidding ? 'Placing Bid...' : 'Place Bid'}
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {canStartPayout && (
            <Button
              onClick={handleStartPayout}
              disabled={isStarting}
              className="flex-1"
            >
              {isStarting ? 'Starting...' : 'Start Payout'}
            </Button>
          )}

          {canCompletePayout && (
            <Button
              onClick={handleCompletePayout}
              disabled={isCompleting}
              className="flex-1"
            >
              {isCompleting ? 'Completing...' : 'Complete Payout'}
            </Button>
          )}

          {payoutStatus.status === 'completed' && (
            <Button
              variant="outline"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="flex-1"
            >
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
            </Button>
          )}
        </div>

        {/* Advanced Options */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Bidding History */}
                {showBidding && bidHistory.length > 0 && (
                  <div className="bg-surface-light rounded-lg p-4">
                    <h4 className="font-medium mb-3">Bidding History</h4>
                    <div className="space-y-2">
                      {bidHistory.slice(0, 5).map((bid, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-background rounded">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-3 w-3 text-blue-500" />
                            <AddressDisplay address={bid.member} />
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatUSDC(bid.amount)}</div>
                            <div className="text-xs text-text-secondary">{formatDate(Number(bid.timestamp))}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payout History */}
                {showHistory && payoutHistory.length > 0 && (
                  <div className="bg-surface-light rounded-lg p-4">
                    <h4 className="font-medium mb-3">Payout History</h4>
                    <div className="space-y-2">
                      {payoutHistory.slice(0, 5).map((payout, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-background rounded">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Cycle {payout.cycleNumber.toString()}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatUSDC(payout.amount)}</div>
                            <div className="text-xs text-text-secondary">{formatDate(Number(payout.timestamp))}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
