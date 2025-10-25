import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { TRUST_SCORE_MANAGER_ABI } from '@/config/abis';
import { TrustData, TrustMetrics, TrustTier, TrustScoreBreakdown } from '@/types';

export function useTrustScore() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  // Read user's trust score (legacy)
  const { data: trustScore, isLoading: isLoadingScore } = useReadContract({
    address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
    abi: TRUST_SCORE_MANAGER_ABI,
    functionName: 'trustScores',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read user's trust data (new format)
  const { data: trustData, isLoading: isLoadingTrustData } = useReadContract({
    address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
    abi: TRUST_SCORE_MANAGER_ABI,
    functionName: 'getTrustData',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read user's trust metrics (legacy)
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

  // Get score breakdown
  const { data: scoreBreakdown, isLoading: isLoadingBreakdown } = useReadContract({
    address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
    abi: TRUST_SCORE_MANAGER_ABI,
    functionName: 'getScoreBreakdown',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!isRegistered,
    },
  });

  // Register user mutation
  const registerUserMutation = useMutation({
    mutationFn: async (metrics: TrustMetrics) => {
      if (!address) throw new Error('Wallet not connected');
      
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
        abi: TRUST_SCORE_MANAGER_ABI,
        functionName: 'registerUser',
        args: [address, metrics],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustScore', address] });
    },
  });

  // Link DeFi history mutation
  const linkDefiHistoryMutation = useMutation({
    mutationFn: async (params: {
      totalBorrowed: bigint;
      totalRepaid: bigint;
      liquidations: bigint;
    }) => {
      if (!address) throw new Error('Wallet not connected');
      
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
        abi: TRUST_SCORE_MANAGER_ABI,
        functionName: 'linkDefiHistory',
        args: [address, params.totalBorrowed, params.totalRepaid, params.liquidations],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustScore', address] });
    },
  });

  // Add social verification mutation
  const addSocialVerificationMutation = useMutation({
    mutationFn: async (verificationType: number) => {
      if (!address) throw new Error('Wallet not connected');
      
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
        abi: TRUST_SCORE_MANAGER_ABI,
        functionName: 'addSocialVerification',
        args: [address, verificationType],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trustScore', address] });
    },
  });

  return {
    // Data
    trustScore: trustScore as bigint | undefined,
    trustData: trustData as TrustData | undefined,
    trustMetrics: trustMetrics as TrustMetrics | undefined,
    isRegistered: isRegistered as boolean | undefined,
    scoreBreakdown: scoreBreakdown as TrustScoreBreakdown | undefined,
    
    // Loading states
    isLoading: isLoadingScore || isLoadingTrustData || isLoadingMetrics || isLoadingRegistered || isLoadingBreakdown,
    
    // Actions
    registerUser: registerUserMutation.mutateAsync,
    linkDefiHistory: linkDefiHistoryMutation.mutateAsync,
    addSocialVerification: addSocialVerificationMutation.mutateAsync,
    
    // Mutation states
    isRegistering: registerUserMutation.isPending,
    isLinkingDefi: linkDefiHistoryMutation.isPending,
    isAddingVerification: addSocialVerificationMutation.isPending,
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

  return tier as TrustTier | undefined;
}

// Hook for trust score history (would need events/subgraph)
export function useTrustScoreHistory() {
  const { address } = useAccount();
  
  return useQuery({
    queryKey: ['trustScoreHistory', address],
    queryFn: async () => {
      // This would fetch from subgraph or events
      // For now, return mock data
      return [];
    },
    enabled: !!address,
  });
}

// Hook to check if user meets requirements
export function useTrustRequirement(minScore: bigint) {
  const { address } = useAccount();
  
  const { data: meetsRequirement } = useReadContract({
    address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
    abi: TRUST_SCORE_MANAGER_ABI,
    functionName: 'meetsRequirement',
    args: address && minScore ? [address, minScore] : undefined,
    query: {
      enabled: !!address && !!minScore,
    },
  });

  return meetsRequirement as boolean | undefined;
}