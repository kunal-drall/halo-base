import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { MOCK_USDC_ABI } from '@/config/abis';

export function useMockUSDC() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  // Get user's USDC balance
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: MOCK_USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get allowance for a specific spender
  const getAllowance = (spender: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.MOCK_USDC,
      abi: MOCK_USDC_ABI,
      functionName: 'allowance',
      args: address && spender ? [address, spender as `0x${string}`] : undefined,
      query: {
        enabled: !!address && !!spender,
      },
    });
  };

  // Get total supply
  const { data: totalSupply, isLoading: isLoadingTotalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: MOCK_USDC_ABI,
    functionName: 'totalSupply',
  });

  // Mint USDC mutation
  const mintMutation = useMutation({
    mutationFn: async (amount: bigint) => {
      if (!address) throw new Error('Wallet not connected');
      
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.MOCK_USDC,
        abi: MOCK_USDC_ABI,
        functionName: 'mint',
        args: [address, amount],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usdcBalance', address] });
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async ({ spender, amount }: { spender: string; amount: bigint }) => {
      if (!address) throw new Error('Wallet not connected');
      
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.MOCK_USDC,
        abi: MOCK_USDC_ABI,
        functionName: 'approve',
        args: [spender as `0x${string}`, amount],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usdcAllowance', address] });
    },
  });

  // Transfer mutation
  const transferMutation = useMutation({
    mutationFn: async ({ to, amount }: { to: string; amount: bigint }) => {
      if (!address) throw new Error('Wallet not connected');
      
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.MOCK_USDC,
        abi: MOCK_USDC_ABI,
        functionName: 'transfer',
        args: [to as `0x${string}`, amount],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usdcBalance', address] });
    },
  });

  return {
    // Data
    balance: balance as bigint | undefined,
    totalSupply: totalSupply as bigint | undefined,
    
    // Loading states
    isLoading: isLoadingBalance || isLoadingTotalSupply,
    
    // Actions
    mint: mintMutation.mutateAsync,
    approve: approveMutation.mutateAsync,
    transfer: transferMutation.mutateAsync,
    
    // Query functions
    getAllowance,
    
    // Mutation states
    isMinting: mintMutation.isPending,
    isApproving: approveMutation.isPending,
    isTransferring: transferMutation.isPending,
  };
}

// Hook for USDC approval management
export function useUSDCApproval(spender: string, requiredAmount: bigint) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  // Get current allowance
  const { data: allowance, isLoading: isLoadingAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: MOCK_USDC_ABI,
    functionName: 'allowance',
    args: address && spender ? [address, spender as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!spender,
    },
  });

  // Check if approval is needed
  const needsApproval = allowance ? allowance < requiredAmount : true;

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (amount: bigint) => {
      if (!address) throw new Error('Wallet not connected');
      
      return writeContractAsync({
        address: CONTRACT_ADDRESSES.MOCK_USDC,
        abi: MOCK_USDC_ABI,
        functionName: 'approve',
        args: [spender as `0x${string}`, amount],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usdcAllowance', address, spender] });
    },
  });

  return {
    allowance: allowance as bigint | undefined,
    needsApproval,
    isLoading: isLoadingAllowance,
    approve: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
  };
}
