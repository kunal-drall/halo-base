import { useState, useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { useTrustScore } from './useTrustScore';
import { gaslessTransaction, isEligibleForGasless } from '@/lib/smartWallet';
import { formatUSDC } from '@/lib/utils';

interface GaslessTransactionOptions {
  value?: bigint;
  description?: string;
}

export function useGaslessTransaction() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { trustScore } = useTrustScore();
  const [isGasless, setIsGasless] = useState(false);
  const [gaslessError, setGaslessError] = useState<string | null>(null);

  // Check if gasless transactions are available and user is eligible
  const checkGaslessEligibility = useCallback((options: GaslessTransactionOptions = {}) => {
    if (!gaslessTransaction.isAvailable()) {
      setGaslessError('Gasless transactions not available');
      return false;
    }

    if (!address) {
      setGaslessError('Wallet not connected');
      return false;
    }

    const eligible = isEligibleForGasless(trustScore, options.value);
    if (!eligible) {
      setGaslessError(
        options.value 
          ? `Transaction value ${formatUSDC(options.value)} exceeds gasless limit`
          : 'User not eligible for gasless transactions'
      );
      return false;
    }

    setGaslessError(null);
    return true;
  }, [address, trustScore]);

  // Execute gasless transaction
  const executeGasless = useCallback(async (
    contractConfig: {
      address: `0x${string}`;
      abi: readonly unknown[];
      functionName: string;
      args: readonly unknown[];
    },
    options: GaslessTransactionOptions = {}
  ) => {
    if (!checkGaslessEligibility(options)) {
      throw new Error(gaslessError || 'Not eligible for gasless transaction');
    }

    setIsGasless(true);
    setGaslessError(null);

    try {
      // For now, we'll use regular writeContract
      // In production, this would use the smart wallet client
      const result = await writeContract({
        ...contractConfig,
        // Add gasless configuration here
        // This would be handled by the smart wallet client
      });

      return result;
    } catch (error) {
      setGaslessError(error instanceof Error ? error.message : 'Transaction failed');
      throw error;
    } finally {
      setIsGasless(false);
    }
  }, [checkGaslessEligibility, writeContract, gaslessError]);

  // Get gasless transaction info for UI
  const getGaslessInfo = useCallback((options: GaslessTransactionOptions = {}) => {
    const available = gaslessTransaction.isAvailable();
    const eligible = checkGaslessEligibility(options);
    
    return {
      available,
      eligible,
      error: gaslessError,
      isGasless,
      userTrustScore: trustScore ? Number(trustScore) : 0,
      maxValue: trustScore && trustScore >= BigInt(500) ? 1000 : 100, // $1000 or $100 USDC
    };
  }, [checkGaslessEligibility, gaslessError, isGasless, trustScore]);

  return {
    executeGasless,
    checkGaslessEligibility,
    getGaslessInfo,
    isGasless,
    gaslessError,
  };
}
