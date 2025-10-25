// Transaction Types
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  gasUsed: bigint;
  gasPrice: bigint;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  type: 'contribution' | 'payout' | 'insurance' | 'yield' | 'registration';
}

export interface ContributionTransaction extends Transaction {
  type: 'contribution';
  circleId: bigint;
  amount: bigint;
  cycle: bigint;
}

export interface PayoutTransaction extends Transaction {
  type: 'payout';
  circleId: bigint;
  amount: bigint;
  cycle: bigint;
  recipient: string;
}

export interface InsuranceTransaction extends Transaction {
  type: 'insurance';
  circleId: bigint;
  amount: bigint;
  action: 'stake' | 'claim' | 'penalty';
}

export interface YieldTransaction extends Transaction {
  type: 'yield';
  circleId: bigint;
  amount: bigint;
  apy: number;
}

export interface RegistrationTransaction extends Transaction {
  type: 'registration';
  user: string;
  initialScore: bigint;
}

export type AnyTransaction = 
  | ContributionTransaction 
  | PayoutTransaction 
  | InsuranceTransaction 
  | YieldTransaction 
  | RegistrationTransaction;
