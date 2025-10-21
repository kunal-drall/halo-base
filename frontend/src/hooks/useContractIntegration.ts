import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { TRUST_SCORE_MANAGER_ABI, CIRCLE_FACTORY_ABI, MOCK_USDC_ABI } from '@/config/abis';
import { useState, useEffect } from 'react';

/**
 * Comprehensive contract integration hook
 * Tests all contract connections and provides integration status
 */
export function useContractIntegration() {
  const { address, isConnected } = useAccount();
  const [integrationStatus, setIntegrationStatus] = useState({
    contractsDeployed: false,
    userRegistered: false,
    hasUSDC: false,
    canCreateCircle: false,
    errors: [] as string[],
  });

  // Test TrustScoreManager connection
  const { data: isRegistered, error: trustError } = useReadContract({
    address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
    abi: TRUST_SCORE_MANAGER_ABI,
    functionName: 'isRegistered',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      retry: false, // Don't retry on contract errors
    },
  });

  // Test CircleFactory connection
  const { data: totalCircles, error: factoryError } = useReadContract({
    address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
    abi: CIRCLE_FACTORY_ABI,
    functionName: 'getTotalCircles',
    query: {
      enabled: true,
      retry: false, // Don't retry on contract errors
    },
  });

  // Test MockUSDC connection
  const { data: usdcBalance, error: usdcError } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: MOCK_USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      retry: false, // Don't retry on contract errors
    },
  });

  // Update integration status
  useEffect(() => {
    const errors: string[] = [];
    
    if (trustError) errors.push(`TrustScoreManager: ${trustError.message}`);
    if (factoryError) errors.push(`CircleFactory: ${factoryError.message}`);
    if (usdcError) errors.push(`MockUSDC: ${usdcError.message}`);

    // Handle contract connection issues gracefully
    const hasContractErrors = trustError || factoryError || usdcError;
    
    setIntegrationStatus({
      contractsDeployed: !hasContractErrors,
      userRegistered: !!isRegistered,
      hasUSDC: usdcBalance ? Number(usdcBalance) > 0 : false,
      canCreateCircle: isConnected && !!isRegistered,
      errors,
    });
  }, [trustError, factoryError, usdcError, isRegistered, usdcBalance, isConnected]);

  return {
    integrationStatus,
    isRegistered,
    totalCircles,
    usdcBalance,
    isConnected,
  };
}

/**
 * Hook to get test USDC for testing
 */
export function useTestUSDC() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const mintTestUSDC = async (amount: bigint = BigInt(1000) * BigInt(10)**BigInt(6)) => {
    if (!address) return;

    return writeContract({
      address: CONTRACT_ADDRESSES.MOCK_USDC,
      abi: MOCK_USDC_ABI,
      functionName: 'mint',
      args: [address, amount],
    });
  };

  return { mintTestUSDC };
}

/**
 * Hook to register a new user with initial trust score
 */
export function useUserRegistration() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const registerUser = async () => {
    if (!address) return;

    // Initial metrics for new user
    const initialMetrics = {
      paymentReliability: BigInt(0),
      circleCompletions: BigInt(0),
      defiHistory: BigInt(0),
      socialVerification: BigInt(0),
      lastUpdated: BigInt(Math.floor(Date.now() / 1000)),
    };

    return writeContract({
      address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
      abi: TRUST_SCORE_MANAGER_ABI,
      functionName: 'registerUser',
      args: [address, initialMetrics],
    });
  };

  return { registerUser };
}
