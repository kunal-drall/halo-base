import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { LENDING_CIRCLE_ABI } from '@/config/abis';
import { Member, Cycle, CircleStats, CircleParams } from '@/types';

export function useLendingCircle(circleAddress?: `0x${string}`) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  // Get circle parameters
  const { data: params, isLoading: isLoadingParams } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'params',
    query: {
      enabled: !!circleAddress,
    },
  });

  // Get current cycle
  const { data: currentCycle, isLoading: isLoadingCycle } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'getCurrentCycle',
    query: {
      enabled: !!circleAddress,
    },
  });

  // Get circle stats
  const { data: circleStats, isLoading: isLoadingStats } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'getCircleStats',
    query: {
      enabled: !!circleAddress,
    },
  });

  // Get all members
  const { data: members, isLoading: isLoadingMembers } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'getMembers',
    query: {
      enabled: !!circleAddress,
    },
  });

  // Get member data
  const getMember = (memberAddress: string) => {
    return useReadContract({
      address: circleAddress,
      abi: LENDING_CIRCLE_ABI,
      functionName: 'getMemberData',
      args: [memberAddress as `0x${string}`],
      query: {
        enabled: !!circleAddress && !!memberAddress,
      },
    });
  };

  // Check if member has contributed to current cycle
  const hasContributed = (memberAddress: string) => {
    return useReadContract({
      address: circleAddress,
      abi: LENDING_CIRCLE_ABI,
      functionName: 'hasContributed',
      args: [memberAddress as `0x${string}`],
      query: {
        enabled: !!circleAddress && !!memberAddress,
      },
    });
  };

  // Get member insurance
  const getMemberInsurance = (memberAddress: string) => {
    return useReadContract({
      address: circleAddress,
      abi: LENDING_CIRCLE_ABI,
      functionName: 'getMemberInsurance',
      args: [memberAddress as `0x${string}`],
      query: {
        enabled: !!circleAddress && !!memberAddress,
      },
    });
  };

  // Get cycle by number
  const getCycle = (cycleNumber: bigint) => {
    return useReadContract({
      address: circleAddress,
      abi: LENDING_CIRCLE_ABI,
      functionName: 'getCycle',
      args: [cycleNumber],
      query: {
        enabled: !!circleAddress,
      },
    });
  };

  // Contribute mutation
  const contributeMutation = useMutation({
    mutationFn: async () => {
      if (!circleAddress) throw new Error('Circle address not provided');
      
      return writeContractAsync({
        address: circleAddress,
        abi: LENDING_CIRCLE_ABI,
        functionName: 'contribute',
        args: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lendingCircle', circleAddress] });
    },
  });

  // Pause circle mutation
  const pauseCircleMutation = useMutation({
    mutationFn: async () => {
      if (!circleAddress) throw new Error('Circle address not provided');
      
      return writeContractAsync({
        address: circleAddress,
        abi: LENDING_CIRCLE_ABI,
        functionName: 'pauseCircle',
        args: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lendingCircle', circleAddress] });
    },
  });

  // Unpause circle mutation
  const unpauseCircleMutation = useMutation({
    mutationFn: async () => {
      if (!circleAddress) throw new Error('Circle address not provided');
      
      return writeContractAsync({
        address: circleAddress,
        abi: LENDING_CIRCLE_ABI,
        functionName: 'unpauseCircle',
        args: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lendingCircle', circleAddress] });
    },
  });

  return {
    // Data
    params: params as CircleParams | undefined,
    currentCycle: currentCycle as Cycle | undefined,
    circleStats: circleStats as CircleStats | undefined,
    members: members as string[] | undefined,
    
    // Loading states
    isLoading: isLoadingParams || isLoadingCycle || isLoadingStats || isLoadingMembers,
    
    // Actions
    contribute: contributeMutation.mutateAsync,
    pauseCircle: pauseCircleMutation.mutateAsync,
    unpauseCircle: unpauseCircleMutation.mutateAsync,
    
    // Query functions
    getMember,
    hasContributed,
    getMemberInsurance,
    getCycle,
    
    // Mutation states
    isContributing: contributeMutation.isPending,
    isPausing: pauseCircleMutation.isPending,
    isUnpausing: unpauseCircleMutation.isPending,
  };
}

// Hook for contribution management
export function useContribution(circleAddress?: `0x${string}`) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  // Check if user has contributed to current cycle
  const { data: hasContributed, isLoading: isLoadingContribution } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'hasContributed',
    args: address ? [address] : undefined,
    query: {
      enabled: !!circleAddress && !!address,
    },
  });

  // Get member data for current user
  const { data: memberData, isLoading: isLoadingMemberData } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'getMemberData',
    args: address ? [address] : undefined,
    query: {
      enabled: !!circleAddress && !!address,
    },
  });

  // Contribute mutation
  const contributeMutation = useMutation({
    mutationFn: async () => {
      if (!circleAddress) throw new Error('Circle address not provided');
      
      return writeContractAsync({
        address: circleAddress,
        abi: LENDING_CIRCLE_ABI,
        functionName: 'contribute',
        args: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contribution', circleAddress, address] });
    },
  });

  return {
    hasContributed: hasContributed as boolean | undefined,
    memberData: memberData as Member | undefined,
    isLoading: isLoadingContribution || isLoadingMemberData,
    contribute: contributeMutation.mutateAsync,
    isContributing: contributeMutation.isPending,
  };
}

// Hook for payout management
export function usePayout(circleAddress?: `0x${string}`) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  // Get current cycle to check if user is recipient
  const { data: currentCycle, isLoading: isLoadingCycle } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'getCurrentCycle',
    query: {
      enabled: !!circleAddress,
    },
  });

  // Check if user is recipient of current cycle
  const isRecipient = currentCycle?.recipient === address;

  // Get member data to check if user has received payout
  const { data: memberData, isLoading: isLoadingMemberData } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'getMemberData',
    args: address ? [address] : undefined,
    query: {
      enabled: !!circleAddress && !!address,
    },
  });

  // Claim payout mutation (this would be handled by the circle's payout logic)
  const claimPayoutMutation = useMutation({
    mutationFn: async () => {
      if (!circleAddress) throw new Error('Circle address not provided');
      
      // This would depend on the circle's payout mechanism
      // For now, we'll simulate a transaction
      return writeContractAsync({
        address: circleAddress,
        abi: LENDING_CIRCLE_ABI,
        functionName: 'contribute', // Placeholder - actual function would be different
        args: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payout', circleAddress, address] });
    },
  });

  return {
    isRecipient,
    hasReceivedPayout: memberData?.hasReceivedPayout || false,
    isLoading: isLoadingCycle || isLoadingMemberData,
    claimPayout: claimPayoutMutation.mutateAsync,
    isClaiming: claimPayoutMutation.isPending,
  };
}