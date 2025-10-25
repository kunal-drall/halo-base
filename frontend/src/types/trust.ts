// Trust Score Types
export enum TrustTier {
  NEWCOMER = 0,
  SILVER = 1,
  GOLD = 2,
  PLATINUM = 3,
}

export interface TrustData {
  paymentScore: number;
  circlesCompleted: number;
  circlesDefaulted: number;
  totalPayments: number;
  onTimePayments: number;
  latePayments: number;
  defiScore: number;
  socialVerifications: number;
  overallScore: number;
  tier: TrustTier;
  lastUpdated: number;
}

export interface TrustMetrics {
  paymentReliability: bigint;
  circleCompletions: bigint;
  defiHistory: bigint;
  socialVerification: bigint;
  lastUpdated: bigint;
}

export interface TrustScoreBreakdown {
  paymentScore: number;
  completionScore: number;
  defiScore: number;
  socialScore: number;
}

export interface TrustScoreHistory {
  timestamp: number;
  score: number;
  tier: TrustTier;
  reason: string;
}
