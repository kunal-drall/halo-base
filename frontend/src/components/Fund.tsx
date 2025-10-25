'use client';

import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/Button';

interface FundButtonProps {
  amount?: string;
  currency?: string;
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function FundButton({
  amount = "10",
  currency = "USDC",
  onSuccess,
  onError,
  children = "Fund Wallet",
  className,
  disabled = false
}: FundButtonProps) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Button disabled className={className}>
        Connect Wallet First
      </Button>
    );
  }

  const handleFund = () => {
    // Open Coinbase Wallet funding flow
    window.open('https://wallet.coinbase.com/', '_blank');
  };

  return (
    <Button 
      disabled={disabled}
      className={className}
      onClick={handleFund}
    >
      {children}
    </Button>
  );
}

interface FundWrapperProps {
  amount?: string;
  currency?: string;
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

export function FundWrapper({
  amount = "10",
  currency = "USDC",
  onSuccess,
  onError,
  children
}: FundWrapperProps) {
  return <>{children}</>;
}
