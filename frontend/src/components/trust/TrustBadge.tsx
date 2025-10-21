'use client';

import { useTrustTier } from '@/hooks/useTrustScore';
import { Badge } from '@/components/ui/Badge';
import { getTrustTierName, getTrustTierColor } from '@/lib/utils';

interface TrustBadgeProps {
  score?: bigint;
  size?: 'sm' | 'md';
  showScore?: boolean;
}

export function TrustBadge({ score, size = 'md', showScore = false }: TrustBadgeProps) {
  const tier = useTrustTier(score);
  
  if (tier === undefined) {
    return <Badge variant="secondary" size={size}>Unknown</Badge>;
  }

  const tierNumber = Number(tier);
  const tierName = getTrustTierName(tierNumber);
  const tierColor = getTrustTierColor(tierNumber);

  const getVariant = (tier: number) => {
    switch (tier) {
      case 0: return 'secondary'; // Newcomer
      case 1: return 'warning';   // Bronze
      case 2: return 'default';   // Silver
      case 3: return 'success';   // Gold
      case 4: return 'default';   // Platinum
      default: return 'secondary';
    }
  };

  return (
    <Badge variant={getVariant(tierNumber)} size={size}>
      {showScore && score && `${Number(score).toLocaleString()} - `}
      {tierName}
    </Badge>
  );
}
