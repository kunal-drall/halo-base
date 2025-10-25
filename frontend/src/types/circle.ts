// Circle Types
export enum PayoutMethod {
  FIXED_ROTATION = 0,
  AUCTION = 1,
  RANDOM = 2,
  HYBRID = 3,
}

export interface CircleParams {
  contributionAmount: bigint;
  cycleDuration: bigint;
  maxMembers: bigint;
  minTrustTier: bigint;
  payoutMethod: PayoutMethod;
  insurancePercent: bigint;
  latePenaltyBps: bigint;
  gracePeriodDays: bigint;
  isPublic: boolean;
}

export interface Member {
  wallet: string;
  trustScore: bigint;
  contributionsMade: bigint;
  missedPayments: bigint;
  hasReceivedPayout: boolean;
  isActive: boolean;
  joinedAt: bigint;
  insuranceStaked: bigint;
  lastContributionTime: bigint;
}

export interface Cycle {
  cycleNumber: bigint;
  startTime: bigint;
  endTime: bigint;
  recipient: string;
  totalContributed: bigint;
  completed: boolean;
  yieldEarned: bigint;
}

export interface CircleInfo {
  circleAddress: string;
  creator: string;
  params: CircleParams;
  createdAt: bigint;
  isActive: boolean;
  memberCount: bigint;
  totalContributions: bigint;
  totalYield: bigint;
}

export interface CircleStats {
  totalMembers: bigint;
  activeMembers: bigint;
  totalContributions: bigint;
  totalYield: bigint;
  insurancePoolAmount: bigint;
}

export interface CircleFilters {
  minAmount?: bigint;
  maxAmount?: bigint;
  minDuration?: bigint;
  maxDuration?: bigint;
  minTrustTier?: bigint;
  status?: 'all' | 'forming' | 'active' | 'completed';
  payoutMethod?: PayoutMethod;
  isPublic?: boolean;
}
