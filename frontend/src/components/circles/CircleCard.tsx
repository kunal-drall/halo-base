'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCircleFactory } from '@/hooks/useCircleFactory';
import { useLendingCircle } from '@/hooks/useLendingCircle';
import { Users, Clock, DollarSign } from 'lucide-react';

interface CircleCardProps {
  circleId: number;
  circleAddress: string;
}

export function CircleCard({ circleId, circleAddress }: CircleCardProps) {
  // Mock loading state for now
  const isLoading = false;

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-surface rounded w-3/4"></div>
          <div className="h-3 bg-surface rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-3 bg-surface rounded"></div>
            <div className="h-3 bg-surface rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for now
  const contributionAmount = BigInt(100 * 1e6); // $100 USDC
  const memberCount = 3;
  const maxMembers = 10;
  const progress = (memberCount / maxMembers) * 100;

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: return <Badge variant="secondary">Forming</Badge>;
      case 1: return <Badge variant="success">Active</Badge>;
      case 2: return <Badge variant="success">Completed</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatUSDC = (amount: bigint) => {
    return `$${(Number(amount) / 1e6).toFixed(2)}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Lending Circle #{circleId}</CardTitle>
            <CardDescription>
              {formatUSDC(contributionAmount)} per contribution
            </CardDescription>
          </div>
          {getStatusBadge(0)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Members</span>
            <span className="font-medium">{memberCount}/{maxMembers}</span>
          </div>
          <ProgressBar value={progress} size="sm" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <Users className="h-4 w-4 mx-auto text-text-secondary" />
            <div className="text-sm font-medium">{memberCount}</div>
            <div className="text-xs text-text-secondary">Members</div>
          </div>
          <div className="space-y-1">
            <Clock className="h-4 w-4 mx-auto text-text-secondary" />
            <div className="text-sm font-medium">7d</div>
            <div className="text-xs text-text-secondary">Cycle</div>
          </div>
          <div className="space-y-1">
            <DollarSign className="h-4 w-4 mx-auto text-text-secondary" />
            <div className="text-sm font-medium">{formatUSDC(contributionAmount)}</div>
            <div className="text-xs text-text-secondary">Amount</div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="primary" className="flex-1">
            Join Circle
          </Button>
          <Button variant="secondary" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}