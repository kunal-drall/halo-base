import { useAccount, useReadContract } from 'wagmi';
import { useMemo } from 'react';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { TRUST_SCORE_MANAGER_ABI, CIRCLE_FACTORY_ABI, MOCK_USDC_ABI, YIELD_MANAGER_ABI } from '@/config/abis';
import { useTrustScore } from './useTrustScore';
import { useMockUSDC } from './useMockUSDC';
import { useYieldData } from './useYieldData';

interface IntegrationStatus {
  contractsDeployed: boolean;
  userRegistered: boolean;
  hasUSDC: boolean;
  canCreateCircle: boolean;
  canJoinCircle: boolean;
  errors: string[];
  warnings: string[];
}

export function useContractIntegration() {
  const { address, isConnected } = useAccount();
  const { trustScore, isRegistered, isLoading: isLoadingTrust } = useTrustScore();
  const { balance: usdcBalance, isLoading: isLoadingUSDC } = useMockUSDC();
  const { currentAPY, isLoading: isLoadingYield } = useYieldData();

  // Test TrustScoreManager connection
  const { data: isRegisteredTest, error: trustError } = useReadContract({
    address: CONTRACT_ADDRESSES.TRUST_SCORE_MANAGER,
    abi: TRUST_SCORE_MANAGER_ABI,
    functionName: 'isRegistered',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      retry: false,
    },
  });

  // Test CircleFactory connection
  const { data: totalCircles, error: factoryError } = useReadContract({
    address: CONTRACT_ADDRESSES.CIRCLE_FACTORY,
    abi: CIRCLE_FACTORY_ABI,
    functionName: 'getTotalCircles',
    query: {
      enabled: true,
      retry: false,
    },
  });

  // Test MockUSDC connection
  const { data: usdcBalanceTest, error: usdcError } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: MOCK_USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      retry: false,
    },
  });

  // Test YieldManager connection
  const { data: yieldManagerAPY, error: yieldError } = useReadContract({
    address: CONTRACT_ADDRESSES.YIELD_MANAGER,
    abi: YIELD_MANAGER_ABI,
    functionName: 'getCurrentAPY',
    query: {
      enabled: true,
      retry: false,
    },
  });

  const integrationStatus = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for contract connection errors
    if (trustError) errors.push(`TrustScoreManager: ${trustError.message}`);
    if (factoryError) errors.push(`CircleFactory: ${factoryError.message}`);
    if (usdcError) errors.push(`MockUSDC: ${usdcError.message}`);
    if (yieldError) errors.push(`YieldManager: ${yieldError.message}`);

    // Check if contracts are deployed
    const contractsDeployed = !trustError && !factoryError && !usdcError && !yieldError;
    
    // Check user registration
    const userRegistered = !!isRegistered;
    
    // Check USDC balance
    const hasUSDC = usdcBalance ? Number(usdcBalance) > 0 : false;
    if (!hasUSDC && isConnected) {
      warnings.push('No USDC balance. Consider minting test USDC.');
    }
    
    // Check if user can create circles
    const canCreateCircle = isConnected && userRegistered;
    
    // Check if user can join circles (needs USDC and registration)
    const canJoinCircle = isConnected && userRegistered && hasUSDC;
    
    // Trust score warnings
    if (trustScore && Number(trustScore) < 250) {
      warnings.push('Low trust score. Consider improving your on-chain reputation.');
    }

    return {
      contractsDeployed,
      userRegistered,
      hasUSDC,
      canCreateCircle,
      canJoinCircle,
      errors,
      warnings,
    };
  }, [
    trustError,
    factoryError,
    usdcError,
    yieldError,
    isRegistered,
    usdcBalance,
    isConnected,
    trustScore,
  ]);

  return {
    integrationStatus,
    isRegistered,
    totalCircles,
    usdcBalance,
    currentAPY,
    isLoading: isLoadingTrust || isLoadingUSDC || isLoadingYield,
  };
}

// Hook for contract health monitoring
export function useContractHealth() {
  const { integrationStatus } = useContractIntegration();
  
  const healthScore = useMemo(() => {
    let score = 100;
    
    // Deduct points for errors
    score -= integrationStatus.errors.length * 25;
    
    // Deduct points for warnings
    score -= integrationStatus.warnings.length * 10;
    
    // Deduct points for missing requirements
    if (!integrationStatus.contractsDeployed) score -= 50;
    if (!integrationStatus.userRegistered) score -= 20;
    if (!integrationStatus.hasUSDC) score -= 15;
    
    return Math.max(0, score);
  }, [integrationStatus]);

  const healthStatus = useMemo(() => {
    if (healthScore >= 90) return 'excellent';
    if (healthScore >= 70) return 'good';
    if (healthScore >= 50) return 'fair';
    if (healthScore >= 30) return 'poor';
    return 'critical';
  }, [healthScore]);

  return {
    healthScore,
    healthStatus,
    isHealthy: healthScore >= 70,
    needsAttention: healthScore < 50,
  };
}