'use client';

import { Connected } from '@coinbase/onchainkit';
import { Button } from '@/components/ui/Button';
import { useAccount } from 'wagmi';

interface WalletConnectProps {
  children?: React.ReactNode;
  className?: string;
  showConnectButton?: boolean;
}

export function WalletConnect({ children, className, showConnectButton = true }: WalletConnectProps) {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <>{children}</>;
  }

  if (showConnectButton) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <Connected>
          <Button variant="primary" size="lg">
            Connect Wallet
          </Button>
        </Connected>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Connect your wallet to start using Halo Protocol
        </p>
      </div>
    );
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

