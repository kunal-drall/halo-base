// Yield Types
export interface YieldData {
  circleId: bigint;
  deposited: bigint;
  withdrawn: bigint;
  yieldEarned: bigint;
  yieldClaimed: bigint;
  currentBalance: bigint;
}

export interface GlobalYieldStats {
  totalDepositedAmount: bigint;
  totalWithdrawnAmount: bigint;
  totalYieldEarnedAmount: bigint;
  totalFeesCollectedAmount: bigint;
  currentAPY: bigint;
}

export interface YieldProjection {
  amount: bigint;
  timeInSeconds: bigint;
  projectedYield: bigint;
  apy: number;
}
