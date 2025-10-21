import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { TRUST_SCORE_MANAGER_ABI } from '@/config/abis';

export function useTrustScore() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Read user's trust score
  const { data: trustScore, isLoading: isLoadingScore } = useReadContract({
    address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
    abi: TRUST_SCORE_MANAGER_ABI,
    functionName: 'trustScores',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read user's trust metrics
  const { data: trustMetrics, isLoading: isLoadingMetrics } = useReadContract({
    address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
    abi: TRUST_SCORE_MANAGER_ABI,
    functionName: 'getUserMetrics',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Check if user is registered
  const { data: isRegistered, isLoading: isLoadingRegistered } = useReadContract({
    address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
    abi: TRUST_SCORE_MANAGER_ABI,
    functionName: 'isRegistered',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Register user
  const registerUser = (metrics: {
    paymentReliability: bigint;
    circleCompletions: bigint;
    defiHistory: bigint;
    socialVerification: bigint;
    lastUpdated: bigint;
  }) => {
    if (!address) return;
    
    return writeContract({
      address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
      abi: TRUST_SCORE_MANAGER_ABI,
      functionName: 'registerUser',
      args: [address, metrics],
    });
  };

  return {
    trustScore,
    trustMetrics,
    isRegistered,
    isLoading: isLoadingScore || isLoadingMetrics || isLoadingRegistered,
    registerUser,
  };
}

// Helper hook to get trust tier from score
export function useTrustTier(score?: bigint) {
  const { data: tier } = useReadContract({
    address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
    abi: TRUST_SCORE_MANAGER_ABI,
    functionName: 'getTier',
    args: score !== undefined ? [score] : undefined,
    query: {
      enabled: score !== undefined,
    },
  });

  return tier;
}

