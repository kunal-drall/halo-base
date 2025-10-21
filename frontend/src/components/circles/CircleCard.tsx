'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatUSDC, formatDate } from '@/lib/utils';
import { useCircleInfo } from '@/hooks/useCircleFactory';
import { useLendingCircle } from '@/hooks/useLendingCircle';
import { Users, Clock, DollarSign } from 'lucide-react';

interface CircleCardProps {
  circleId: bigint;
  onJoin?: (circleId: bigint) => void;
  onView?: (circleId: bigint) => void;
}

export function CircleCard({ circleId, onJoin, onView }: CircleCardProps) {
  const { circleInfo, circleAddress, isLoading: isLoadingInfo } = useCircleInfo(circleId);
  const { 
    circleStatus, 
    currentCycle, 
    members, 
    isLoading: isLoadingCircle 
  } = useLendingCircle(circleAddress);

  if (isLoadingInfo || isLoadingCircle) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-surface rounded w-3/4" />
          <div className="h-3 bg-surface rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-3 bg-surface rounded w-full" />
            <div className="h-3 bg-surface rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!circleInfo || !circleStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-text-secondary">Circle not found</p>
        </CardContent>
      </Card>
    );
  }

  const contributionAmount = circleInfo.contributionAmount;
  const memberCount = 3; // Mock data for now
  const maxMembers = Number(circleInfo.contributionAmount) > 0 ? 10 : 0; // Assuming max 10 members
  const progress = (memberCount / maxMembers) * 100;

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: return <Badge variant="secondary">Forming</Badge>;
      case 1: return <Badge variant="success">Active</Badge>;
      case 2: return <Badge variant="warning">Completed</Badge>;
      case 3: return <Badge variant="error">Cancelled</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Circle #{Number(circleId)}
            </CardTitle>
            <CardDescription>
              {formatUSDC(contributionAmount)} per contribution
            </CardDescription>
          </div>
          {getStatusBadge(Number(circleInfo.status))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Member Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Members</span>
            <span className="font-medium">{memberCount}/{maxMembers}</span>
          </div>
          <ProgressBar value={progress} size="sm" />
        </div>

        {/* Circle Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <Users className="h-4 w-4 mx-auto text-text-secondary" />
            <div className="text-sm font-medium">{memberCount}</div>
            <div className="text-xs text-text-secondary">Members</div>
          </div>
          <div className="space-y-1">
            <DollarSign className="h-4 w-4 mx-auto text-text-secondary" />
            <div className="text-sm font-medium">{formatUSDC(contributionAmount)}</div>
            <div className="text-xs text-text-secondary">Per Cycle</div>
          </div>
          <div className="space-y-1">
            <Clock className="h-4 w-4 mx-auto text-text-secondary" />
            <div className="text-sm font-medium">30d</div>
            <div className="text-xs text-text-secondary">Duration</div>
          </div>
        </div>

        {/* Current Cycle Info */}
        {currentCycle && (
          <div className="bg-surface rounded-lg p-3 space-y-2">
            <div className="text-sm font-medium">Current Cycle</div>
            <div className="text-xs text-text-secondary">
              Cycle #1 • 
              {new Date(Date.now() - 86400000).toLocaleDateString()} - {new Date(Date.now() + 86400000).toLocaleDateString()}
            </div>
            <div className="text-xs">
              Contributed: {formatUSDC(BigInt(1000000))} {/* Mock data */}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            variant="primary" 
            size="sm" 
            className="flex-1"
            onClick={() => onJoin?.(circleId)}
          >
            Join Circle
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onView?.(circleId)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
