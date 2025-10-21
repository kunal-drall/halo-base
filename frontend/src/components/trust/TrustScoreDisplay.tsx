'use client';

import { useTrustScore, useTrustTier } from '@/hooks/useTrustScore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { getTrustTierName, getTrustTierColor } from '@/lib/utils';

interface TrustScoreDisplayProps {
  address?: `0x${string}`;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TrustScoreDisplay({ 
  address, 
  showDetails = false, 
  size = 'md' 
}: TrustScoreDisplayProps) {
  const { trustScore, trustMetrics, isLoading } = useTrustScore();
  const tier = useTrustTier(trustScore);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-pulse bg-surface rounded" />
        <span className="text-text-secondary">Loading...</span>
      </div>
    );
  }

  if (!trustScore) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="secondary">Not Registered</Badge>
      </div>
    );
  }

  const score = Number(trustScore);
  const tierName = tier !== undefined ? getTrustTierName(Number(tier)) : 'Unknown';
  const tierColor = tier !== undefined ? getTrustTierColor(Number(tier)) : 'text-gray-500';

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`font-semibold ${sizeClasses[size]}`}>
            {score.toLocaleString()}
          </span>
          <Badge variant="secondary" size="sm">
            {tierName}
          </Badge>
        </div>
        <span className={`text-sm ${tierColor}`}>
          {tierName}
        </span>
      </div>
      
      <ProgressBar 
        value={score} 
        max={1000} 
        size={size === 'sm' ? 'sm' : 'md'}
        variant="default"
      />
      
      {showDetails && trustMetrics && (
        <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
          <div>Payment Reliability: {Number(trustMetrics.paymentReliability)}</div>
          <div>Circle Completions: {Number(trustMetrics.circleCompletions)}</div>
          <div>DeFi History: {Number(trustMetrics.defiHistory)}</div>
          <div>Social Verification: {Number(trustMetrics.socialVerification)}</div>
        </div>
      )}
    </div>
  );
}
