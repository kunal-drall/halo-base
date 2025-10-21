import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { LENDING_CIRCLE_ABI, MOCK_USDC_ABI } from '@/config/abis';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

export function useLendingCircle(circleAddress?: `0x${string}`) {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Get circle status
  const { data: circleStatus, isLoading: isLoadingStatus } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'getCircleStatus',
    query: {
      enabled: !!circleAddress,
    },
  });

  // Get current cycle info
  const { data: currentCycle, isLoading: isLoadingCycle } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'getCurrentCycleInfo',
    query: {
      enabled: !!circleAddress,
    },
  });

  // Get all members
  const { data: members, isLoading: isLoadingMembers } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'getAllMembers',
    query: {
      enabled: !!circleAddress,
    },
  });

  // Get member info
  const { data: memberInfo, isLoading: isLoadingMemberInfo } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: 'getMember',
    args: address && circleAddress ? [address] : undefined,
    query: {
      enabled: !!address && !!circleAddress,
    },
  });

  // Make contribution
  const contribute = () => {
    if (!circleAddress) return;

    return writeContract({
      address: circleAddress,
      abi: LENDING_CIRCLE_ABI,
      functionName: 'contribute',
    });
  };

  // Approve USDC spending
  const approveUSDC = (amount: bigint) => {
    if (!circleAddress) return;

    return writeContract({
      address: CONTRACT_ADDRESSES.MOCK_USDC,
      abi: MOCK_USDC_ABI,
      functionName: 'approve',
      args: [circleAddress, amount],
    });
  };

  return {
    circleStatus,
    currentCycle,
    members,
    memberInfo,
    isLoading: isLoadingStatus || isLoadingCycle || isLoadingMembers || isLoadingMemberInfo,
    contribute,
    approveUSDC,
  };
}

// Hook for USDC balance and allowance
export function useUSDC(spender?: `0x${string}`) {
  const { address } = useAccount();

  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: MOCK_USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: allowance, isLoading: isLoadingAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: MOCK_USDC_ABI,
    functionName: 'allowance',
    args: address && spender ? [address, spender] : undefined,
    query: {
      enabled: !!address && !!spender,
    },
  });

  return {
    balance,
    allowance,
    isLoading: isLoadingBalance || isLoadingAllowance,
  };
}

