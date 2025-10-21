import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { CIRCLE_FACTORY_ABI } from '@/config/abis';

export function useCircleFactory() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Get total number of circles
  const { data: totalCircles, isLoading: isLoadingTotal } = useReadContract({
    address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
    abi: CIRCLE_FACTORY_ABI,
    functionName: 'getTotalCircles',
  });

  // Create a new circle
  const createCircle = (params: {
    contributionAmount: bigint;
    cycleDuration: bigint;
    maxMembers: bigint;
    minTrustScore: bigint;
  }) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
      abi: CIRCLE_FACTORY_ABI,
      functionName: 'createCircle',
      args: [params],
    });
  };

  // Add member to a circle
  const addMember = (circleId: bigint, memberAddress: `0x${string}`) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
      abi: CIRCLE_FACTORY_ABI,
      functionName: 'addMember',
      args: [circleId, memberAddress],
    });
  };

  return {
    totalCircles,
    isLoadingTotal,
    createCircle,
    addMember,
  };
}

// Hook to get info about a specific circle
export function useCircleInfo(circleId?: bigint) {
  const { data: circleInfo, isLoading } = useReadContract({
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
    circleInfo,
    circleAddress,
    isLoading,
  };
}

