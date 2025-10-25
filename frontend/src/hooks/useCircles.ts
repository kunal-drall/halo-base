import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { CIRCLE_FACTORY_ABI } from '@/config/abis';
import { CircleParams, CircleInfo, CircleFilters, PayoutMethod } from '@/types';

export function useCircles() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  // Get total number of circles
  const { data: totalCircles, isLoading: isLoadingTotal } = useReadContract({
    address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
    abi: CIRCLE_FACTORY_ABI,
    functionName: 'getTotalCircles',
  });

  // Get all circles (would need pagination in production)
  const { data: allCircles, isLoading: isLoadingAll } = useQuery({
    queryKey: ['allCircles'],
    queryFn: async () => {
      // This would fetch from subgraph or events
      // For now, return mock data
      return [];
    },
  });

  // Get circles by status
  const getCirclesByStatus = (active: boolean) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
      abi: CIRCLE_FACTORY_ABI,
      functionName: 'getCirclesByStatus',
      args: [active],
    });
  };

  // Get public circles
  const { data: publicCircles, isLoading: isLoadingPublic } = useReadContract({
    address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
    abi: CIRCLE_FACTORY_ABI,
    functionName: 'getPublicCircles',
  });

  // Get circles by trust tier
  const getCirclesByTrustTier = (minTier: bigint) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
      abi: CIRCLE_FACTORY_ABI,
      functionName: 'getCirclesByTrustTier',
      args: [minTier],
    });
  };

  // Get circles by amount range
  const getCirclesByAmountRange = (minAmount: bigint, maxAmount: bigint) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
      abi: CIRCLE_FACTORY_ABI,
      functionName: 'getCirclesByAmountRange',
      args: [minAmount, maxAmount],
    });
  };

  // Create circle mutation
  const createCircleMutation = useMutation({
    mutationFn: async (params: CircleParams) => {
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
        abi: CIRCLE_FACTORY_ABI,
        functionName: 'createCircle',
        args: [params],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circles'] });
    },
  });

  // Join circle mutation
  const joinCircleMutation = useMutation({
    mutationFn: async (circleId: bigint) => {
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
        abi: CIRCLE_FACTORY_ABI,
        functionName: 'joinCircle',
        args: [circleId],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circles'] });
      queryClient.invalidateQueries({ queryKey: ['userCircles', address] });
    },
  });

  // Leave circle mutation
  const leaveCircleMutation = useMutation({
    mutationFn: async (circleId: bigint) => {
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
        abi: CIRCLE_FACTORY_ABI,
        functionName: 'leaveCircle',
        args: [circleId],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circles'] });
      queryClient.invalidateQueries({ queryKey: ['userCircles', address] });
    },
  });

  // Pause circle mutation
  const pauseCircleMutation = useMutation({
    mutationFn: async (circleId: bigint) => {
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
        abi: CIRCLE_FACTORY_ABI,
        functionName: 'pauseCircle',
        args: [circleId],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circles'] });
    },
  });

  // Unpause circle mutation
  const unpauseCircleMutation = useMutation({
    mutationFn: async (circleId: bigint) => {
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
        abi: CIRCLE_FACTORY_ABI,
        functionName: 'unpauseCircle',
        args: [circleId],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circles'] });
    },
  });

  return {
    // Data
    totalCircles: totalCircles as bigint | undefined,
    allCircles: allCircles as CircleInfo[] | undefined,
    publicCircles: publicCircles as bigint[] | undefined,
    
    // Loading states
    isLoading: isLoadingTotal || isLoadingAll || isLoadingPublic,
    
    // Actions
    createCircle: createCircleMutation.mutateAsync,
    joinCircle: joinCircleMutation.mutateAsync,
    leaveCircle: leaveCircleMutation.mutateAsync,
    pauseCircle: pauseCircleMutation.mutateAsync,
    unpauseCircle: unpauseCircleMutation.mutateAsync,
    
    // Query functions
    getCirclesByStatus,
    getCirclesByTrustTier,
    getCirclesByAmountRange,
    
    // Mutation states
    isCreating: createCircleMutation.isPending,
    isJoining: joinCircleMutation.isPending,
    isLeaving: leaveCircleMutation.isPending,
    isPausing: pauseCircleMutation.isPending,
    isUnpausing: unpauseCircleMutation.isPending,
  };
}

// Hook for user's circles
export function useMyCircles() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  // Get user's circles
  const { data: userCircles, isLoading: isLoadingUserCircles } = useReadContract({
    address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
    abi: CIRCLE_FACTORY_ABI,
    functionName: 'getUserCircles',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get circles by creator
  const { data: createdCircles, isLoading: isLoadingCreated } = useReadContract({
    address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
    abi: CIRCLE_FACTORY_ABI,
    functionName: 'getCirclesByCreator',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    userCircles: userCircles as bigint[] | undefined,
    createdCircles: createdCircles as bigint[] | undefined,
    isLoading: isLoadingUserCircles || isLoadingCreated,
  };
}

// Hook for circle details
export function useCircleDetails(circleId?: bigint) {
  const { data: circleInfo, isLoading: isLoadingInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
    abi: CIRCLE_FACTORY_ABI,
    functionName: 'getCircleInfo',
    args: circleId !== undefined ? [circleId] : undefined,
    query: {
      enabled: circleId !== undefined,
    },
  });

  const { data: circleAddress } = useReadContract({
    address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
    abi: CIRCLE_FACTORY_ABI,
    functionName: 'getCircleAddress',
    args: circleId !== undefined ? [circleId] : undefined,
    query: {
      enabled: circleId !== undefined,
    },
  });

  return {
    circleInfo: circleInfo as CircleInfo | undefined,
    circleAddress: circleAddress as string | undefined,
    isLoading: isLoadingInfo,
  };
}

// Hook for factory statistics
export function useFactoryStats() {
  const { data: factoryStats, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
    abi: CIRCLE_FACTORY_ABI,
    functionName: 'getFactoryStats',
  });

  return {
    factoryStats: factoryStats as {
      totalCircles: bigint;
      totalMembers: bigint;
      totalVolumeAmount: bigint;
      activeCircles: bigint;
    } | undefined,
    isLoading,
  };
}

// Alias for backward compatibility
export const useCircleFactory = useCircles;
