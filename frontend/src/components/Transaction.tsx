'use client';

import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/Button';

interface TransactionButtonProps {
  onTransactionRequest?: () => void;
  onTransactionSuccess?: (hash: string) => void;
  onTransactionError?: (error: Error) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TransactionButton({
  onTransactionRequest,
  onTransactionSuccess,
  onTransactionError,
  children,
  className,
  disabled = false
}: TransactionButtonProps) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Button disabled className={className}>
        Connect Wallet First
      </Button>
    );
  }

  const handleClick = () => {
    if (onTransactionRequest) {
      onTransactionRequest();
    }
    // Transaction logic would go here
  };

  return (
    <Button 
      disabled={disabled}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

interface TransactionWrapperProps {
  onTransactionRequest?: () => void;
  onTransactionSuccess?: (hash: string) => void;
  onTransactionError?: (error: Error) => void;
  children: React.ReactNode;
}

export function TransactionWrapper({
  onTransactionRequest,
  onTransactionSuccess,
  onTransactionError,
  children
}: TransactionWrapperProps) {
  return <>{children}</>;
}
