'use client';

import { Connected } from '@coinbase/onchainkit';
import { Button } from '@/components/ui/Button';
import { useAccount } from 'wagmi';

interface WalletConnectProps {
  children?: React.ReactNode;
  className?: string;
}

export function WalletConnect({ children, className }: WalletConnectProps) {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <>{children}</>;
  }

  return (
    <Connected>
      <Button 
        variant="primary" 
        size="lg" 
        className={className}
      >
        Connect Wallet
      </Button>
    </Connected>
  );
}
