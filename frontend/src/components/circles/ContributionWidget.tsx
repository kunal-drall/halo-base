'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useLendingCircle } from '@/hooks/useLendingCircle';
import { useMockUSDC } from '@/hooks/useMockUSDC';
import { useCircleStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer,
  Star,
  StarOff
} from 'lucide-react';

interface ContributionWidgetProps {
  circleId: bigint;
  circleAddress?: string;
  onContribute?: (amount: bigint) => void;
  onApprove?: (amount: bigint) => void;
  onClaim?: () => void;
  onWithdraw?: () => void;
  showHistory?: boolean;
  showYield?: boolean;
  showInsurance?: boolean;
  className?: string;
}

export function ContributionWidget({
  circleId,
  circleAddress,
  onContribute,
  onApprove,
  onClaim,
  onWithdraw,
  showHistory = true,
  showYield = true,
  showInsurance = true,
  className = ''
}: ContributionWidgetProps) {
  const [contributionAmount, setContributionAmount] = useState('');
  const [isContributing, setIsContributing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    circleInfo,
    memberInfo,
    currentCycle,
    totalContributed,
    isActive,
    isLoading: isLoadingCircle
  } = useLendingCircle(circleId, circleAddress as `0x${string}`);

  const {
    balance,
    allowance,
    isLoading: isLoadingUSDC
  } = useMockUSDC();

  const { getContributionHistory, getYieldHistory, getInsuranceHistory } = useCircleStore();

  const [contributionHistory, setContributionHistory] = useState<any[]>([]);
  const [yieldHistory, setYieldHistory] = useState<any[]>([]);
  const [insuranceHistory, setInsuranceHistory] = useState<any[]>([]);

  useEffect(() => {
    if (showHistory) {
      loadContributionHistory();
    }
    if (showYield) {
      loadYieldHistory();
    }
    if (showInsurance) {
      loadInsuranceHistory();
    }
  }, [circleId, showHistory, showYield, showInsurance]);

  const loadContributionHistory = async () => {
    try {
      const history = await getContributionHistory(circleId);
      setContributionHistory(history);
    } catch (error) {
      console.error('Failed to load contribution history:', error);
    }
  };

  const loadYieldHistory = async () => {
    try {
      const history = await getYieldHistory(circleId);
      setYieldHistory(history);
    } catch (error) {
      console.error('Failed to load yield history:', error);
    }
  };

  const loadInsuranceHistory = async () => {
    try {
      const history = await getInsuranceHistory(circleId);
      setInsuranceHistory(history);
    } catch (error) {
      console.error('Failed to load insurance history:', error);
    }
  };

  const handleContribute = async () => {
    if (!contributionAmount || !circleInfo) return;
    
    try {
      setIsContributing(true);
      const amount = BigInt(Math.floor(Number(contributionAmount) * 1e6));
      
      if (amount > balance) {
        throw new Error('Insufficient balance');
      }

      if (amount > allowance) {
        throw new Error('Insufficient allowance. Please approve first.');
      }

      await onContribute?.(amount);
      setContributionAmount('');
      await loadContributionHistory();
    } catch (error) {
      console.error('Failed to contribute:', error);
    } finally {
      setIsContributing(false);
    }
  };

  const handleApprove = async () => {
    if (!contributionAmount || !circleInfo) return;
    
    try {
      setIsApproving(true);
      const amount = BigInt(Math.floor(Number(contributionAmount) * 1e6));
      await onApprove?.(amount);
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleClaim = async () => {
    try {
      setIsClaiming(true);
      await onClaim?.();
      await loadYieldHistory();
    } catch (error) {
      console.error('Failed to claim:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      await onWithdraw?.();
      await loadContributionHistory();
    } catch (error) {
      console.error('Failed to withdraw:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getContributionStatus = () => {
    if (!memberInfo) return { status: 'not_member', message: 'Not a member' };
    if (!isActive) return { status: 'inactive', message: 'Circle is inactive' };
    if (memberInfo.hasContributed) return { status: 'contributed', message: 'Already contributed' };
    if (memberInfo.needsApproval) return { status: 'needs_approval', message: 'Needs approval' };
    if (memberInfo.hasBalance) return { status: 'ready', message: 'Ready to contribute' };
    return { status: 'insufficient_balance', message: 'Insufficient balance' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'contributed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'needs_approval':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'ready':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'insufficient_balance':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'contributed':
        return <Badge variant="success">Contributed</Badge>;
      case 'needs_approval':
        return <Badge variant="warning">Needs Approval</Badge>;
      case 'ready':
        return <Badge variant="success">Ready</Badge>;
      case 'insufficient_balance':
        return <Badge variant="error">Insufficient Balance</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Not Member</Badge>;
    }
  };

  if (isLoadingCircle || isLoadingUSDC) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Contribution</CardTitle>
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

  if (!circleInfo || !memberInfo) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-text-secondary">
          Circle information not available
        </CardContent>
      </Card>
    );
  }

  const contributionStatus = getContributionStatus();
  const progress = Number(totalContributed) / Number(circleInfo.params.contributionAmount * circleInfo.params.maxMembers) * 100;
  const isDisabled = contributionStatus.status !== 'ready' && contributionStatus.status !== 'needs_approval';

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Contribution</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getStatusIcon(contributionStatus.status)}
            {getStatusBadge(contributionStatus.status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Circle Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Circle Progress</span>
            <span className="font-medium">{progress.toFixed(1)}%</span>
          </div>
          <ProgressBar value={progress} size="sm" />
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>{formatUSDC(totalContributed)} contributed</span>
            <span>{formatUSDC(circleInfo.params.contributionAmount * circleInfo.params.maxMembers)} target</span>
          </div>
        </div>

        {/* Current Cycle Info */}
        {currentCycle && (
          <div className="bg-surface-light rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Current Cycle</h4>
              <Badge variant="secondary">Cycle {currentCycle.cycleNumber.toString()}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-text-secondary">Start Date</div>
                <div className="font-medium">{formatDate(Number(currentCycle.startTime))}</div>
              </div>
              <div className="space-y-1">
                <div className="text-text-secondary">Duration</div>
                <div className="font-medium">{formatDuration(Number(circleInfo.params.cycleDuration))}</div>
              </div>
            </div>
          </div>
        )}

        {/* Contribution Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contribution Amount (USDC)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="0.00"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                disabled={isDisabled}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setContributionAmount(Number(circleInfo.params.contributionAmount) / 1e6)}
                disabled={isDisabled}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {contributionStatus.status === 'needs_approval' && (
              <Button
                onClick={handleApprove}
                disabled={!contributionAmount || isApproving}
                className="flex-1"
              >
                {isApproving ? 'Approving...' : 'Approve USDC'}
              </Button>
            )}

            {contributionStatus.status === 'ready' && (
              <Button
                onClick={handleContribute}
                disabled={!contributionAmount || isContributing}
                className="flex-1"
              >
                {isContributing ? 'Contributing...' : 'Contribute'}
              </Button>
            )}

            {contributionStatus.status === 'contributed' && (
              <div className="flex space-x-2 flex-1">
                <Button
                  variant="outline"
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="flex-1"
                >
                  {isClaiming ? 'Claiming...' : 'Claim Yield'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="flex-1"
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                </Button>
              </div>
            )}
          </div>
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
                {/* Insurance Options */}
                {showInsurance && (
                  <div className="bg-surface-light rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <h4 className="font-medium">Insurance</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Insurance Rate:</span>
                        <span className="font-medium">{(Number(circleInfo.params.insurancePercent) / 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Late Penalty:</span>
                        <span className="font-medium">{(Number(circleInfo.params.latePenaltyBps) / 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Yield Information */}
                {showYield && (
                  <div className="bg-surface-light rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <h4 className="font-medium">Yield</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Yield Earned:</span>
                        <span className="font-medium text-green-500">
                          {formatUSDC(memberInfo.yieldEarned || 0n)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">APY:</span>
                        <span className="font-medium">
                          {memberInfo.apy ? `${Number(memberInfo.apy) / 100}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History */}
        {showHistory && (
          <div className="space-y-4">
            <h4 className="font-medium">Recent Activity</h4>
            <div className="space-y-2">
              {contributionHistory.slice(0, 3).map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-surface-light rounded">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-3 w-3 text-green-500" />
                    <span>Contribution</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatUSDC(entry.amount)}</div>
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