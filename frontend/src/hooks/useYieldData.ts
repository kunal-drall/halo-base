import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { YIELD_MANAGER_ABI } from '@/config/abis';
import { YieldData, GlobalYieldStats, YieldProjection } from '@/types';

export function useYieldData() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  // Get current APY
  const { data: currentAPY, isLoading: isLoadingAPY } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'getCurrentAPY',
  });

  // Get total yield earned
  const { data: totalYieldEarned, isLoading: isLoadingTotalYield } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'getTotalYieldEarned',
  });

  // Get global yield statistics
  const { data: globalStats, isLoading: isLoadingGlobalStats } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'getGlobalYieldStats',
  });

  // Get Aave balance
  const { data: aaveBalance, isLoading: isLoadingAaveBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'getAaveBalance',
  });

  // Get USDC balance
  const { data: usdcBalance, isLoading: isLoadingUSDCBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'getUSDCBalance',
  });

  // Get health factor
  const { data: healthFactor, isLoading: isLoadingHealthFactor } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'getHealthFactor',
  });

  return {
    currentAPY: currentAPY as bigint | undefined,
    totalYieldEarned: totalYieldEarned as bigint | undefined,
    globalStats: globalStats as GlobalYieldStats | undefined,
    aaveBalance: aaveBalance as bigint | undefined,
    usdcBalance: usdcBalance as bigint | undefined,
    healthFactor: healthFactor as bigint | undefined,
    isLoading: isLoadingAPY || isLoadingTotalYield || isLoadingGlobalStats || 
               isLoadingAaveBalance || isLoadingUSDCBalance || isLoadingHealthFactor,
  };
}

// Hook for circle-specific yield data
export function useCircleYield(circleAddress?: `0x${string}`) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  // Get yield earned for specific circle
  const { data: yieldEarned, isLoading: isLoadingYieldEarned } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'getYieldEarned',
    args: circleAddress ? [circleAddress] : undefined,
    query: {
      enabled: !!circleAddress,
    },
  });

  // Get circle yield data
  const { data: circleYieldData, isLoading: isLoadingCircleYieldData } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'getCircleYieldData',
    args: circleAddress ? [circleAddress] : undefined,
    query: {
      enabled: !!circleAddress,
    },
  });

  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: async (amount: bigint) => {
      if (!circleAddress) throw new Error('Circle address not provided');
      
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.YIELD_MANAGER,
        abi: YIELD_MANAGER_ABI,
        functionName: 'deposit',
        args: [circleAddress, amount],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circleYield', circleAddress] });
    },
  });

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: async (amount: bigint) => {
      if (!circleAddress) throw new Error('Circle address not provided');
      
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.YIELD_MANAGER,
        abi: YIELD_MANAGER_ABI,
        functionName: 'withdraw',
        args: [circleAddress, amount],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circleYield', circleAddress] });
    },
  });

  // Claim yield mutation
  const claimYieldMutation = useMutation({
    mutationFn: async () => {
      if (!circleAddress) throw new Error('Circle address not provided');
      
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.YIELD_MANAGER,
        abi: YIELD_MANAGER_ABI,
        functionName: 'claimYield',
        args: [circleAddress],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circleYield', circleAddress] });
    },
  });

  return {
    yieldEarned: yieldEarned as bigint | undefined,
    circleYieldData: circleYieldData as YieldData | undefined,
    isLoading: isLoadingYieldEarned || isLoadingCircleYieldData,
    deposit: depositMutation.mutateAsync,
    withdraw: withdrawMutation.mutateAsync,
    claimYield: claimYieldMutation.mutateAsync,
    isDepositing: depositMutation.isPending,
    isWithdrawing: withdrawMutation.isPending,
    isClaiming: claimYieldMutation.isPending,
  };
}

// Hook for yield projections
export function useYieldProjection(amount: bigint, timeInSeconds: bigint) {
  const { data: projectedYield, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'calculateYield',
    args: [amount, timeInSeconds],
    query: {
      enabled: !!amount && !!timeInSeconds,
    },
  });

  return {
    projectedYield: projectedYield as bigint | undefined,
    isLoading,
  };
}

// Hook for circle yield projection
export function useCircleYieldProjection(circleAddress?: `0x${string}`, timeInSeconds?: bigint) {
  const { data: projectedYield, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'getProjectedYield',
    args: circleAddress && timeInSeconds ? [circleAddress, timeInSeconds] : undefined,
    query: {
      enabled: !!circleAddress && !!timeInSeconds,
    },
  });

  return {
    projectedYield: projectedYield as bigint | undefined,
    isLoading,
  };
}
