'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { useLendingCircle, useUSDC } from '@/hooks/useLendingCircle';
import { formatUSDC, formatDate } from '@/lib/utils';
import { Clock, Users, DollarSign, CheckCircle } from 'lucide-react';

interface ContributionWidgetProps {
  circleAddress: `0x${string}`;
  contributionAmount: bigint;
}

export function ContributionWidget({ circleAddress, contributionAmount }: ContributionWidgetProps) {
  const { 
    currentCycle, 
    memberInfo, 
    contribute, 
    approveUSDC, 
    isLoading 
  } = useLendingCircle(circleAddress);
  
  const { balance, allowance, isLoading: isLoadingUSDC } = useUSDC(circleAddress);
  
  const [isContributing, setIsContributing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleContribute = async () => {
    if (!contribute) return;
    
    setIsContributing(true);
    try {
      await contribute();
    } catch (error) {
      console.error('Contribution failed:', error);
    } finally {
      setIsContributing(false);
    }
  };

  const handleApprove = async () => {
    if (!approveUSDC) return;
    
    setIsApproving(true);
    try {
      await approveUSDC(contributionAmount);
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading || isLoadingUSDC) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-surface rounded w-3/4" />
            <div className="h-3 bg-surface rounded w-1/2" />
            <div className="h-8 bg-surface rounded w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentCycle || !memberInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-text-secondary">Circle information not available</p>
        </CardContent>
      </Card>
    );
  }

  const hasContributed = memberInfo.contributionsMade > 0;
  const needsApproval = allowance && allowance < contributionAmount;
  const hasBalance = balance && balance >= contributionAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Make Contribution</span>
        </CardTitle>
        <CardDescription>
          Cycle #1 • {new Date(Date.now() - 86400000).toLocaleDateString()} - {new Date(Date.now() + 86400000).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cycle Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Cycle Progress</span>
            <span className="font-medium">
              {formatUSDC(BigInt(500000))} / {formatUSDC(contributionAmount * BigInt(10))}
            </span>
          </div>
          <ProgressBar 
            value={50} 
            max={100}
            size="sm"
          />
        </div>

        {/* Contribution Status */}
        {hasContributed ? (
          <div className="flex items-center space-x-2 p-3 bg-success/10 rounded-lg border border-success/20">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-success font-medium">Contribution Made</span>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Balance Check */}
            {!hasBalance && (
              <div className="p-3 bg-error/10 rounded-lg border border-error/20">
                <p className="text-error text-sm">
                  Insufficient USDC balance. You need {formatUSDC(contributionAmount)}.
                </p>
              </div>
            )}

            {/* Approval Check */}
            {needsApproval && (
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <p className="text-warning text-sm mb-2">
                  Approve USDC spending to make contributions.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApprove}
                  loading={isApproving}
                  disabled={!hasBalance}
                >
                  Approve {formatUSDC(contributionAmount)}
                </Button>
              </div>
            )}

            {/* Contribution Button */}
            <Button
              variant="primary"
              onClick={handleContribute}
              loading={isContributing}
              disabled={!hasBalance || !!needsApproval}
              className="w-full"
            >
              Contribute {formatUSDC(contributionAmount)}
            </Button>
          </div>
        )}

        {/* Member Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-text-secondary">Your Contributions</div>
            <div className="font-medium">{Number(memberInfo.contributionsMade)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-text-secondary">Missed Payments</div>
            <div className="font-medium">{Number(memberInfo.missedPayments)}</div>
          </div>
        </div>

        {/* Cycle Stats */}
        <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-border">
          <div className="space-y-1">
            <Users className="h-4 w-4 mx-auto text-text-secondary" />
            <div className="text-sm font-medium">10</div>
            <div className="text-xs text-text-secondary">Members</div>
          </div>
          <div className="space-y-1">
            <Clock className="h-4 w-4 mx-auto text-text-secondary" />
            <div className="text-sm font-medium">30d</div>
            <div className="text-xs text-text-secondary">Duration</div>
          </div>
          <div className="space-y-1">
            <DollarSign className="h-4 w-4 mx-auto text-text-secondary" />
            <div className="text-sm font-medium">{formatUSDC(contributionAmount)}</div>
            <div className="text-xs text-text-secondary">Per Cycle</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
