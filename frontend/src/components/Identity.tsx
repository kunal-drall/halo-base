'use client';

import { useAccount } from 'wagmi';
import { formatAddress } from '@/lib/utils';

interface IdentityProps {
  showAddress?: boolean;
  showAvatar?: boolean;
  showBadge?: boolean;
  className?: string;
}

export function UserIdentity({ 
  showAddress = true, 
  showAvatar = true, 
  showBadge = true,
  className = ""
}: IdentityProps) {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showAvatar && (
        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {address?.slice(2, 4).toUpperCase()}
          </span>
        </div>
      )}
      {showAddress && (
        <span className="text-sm font-mono">
          {formatAddress(address)}
        </span>
      )}
      {showBadge && (
        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
          Connected
        </span>
      )}
    </div>
  );
}

export function AddressDisplay({ 
  address, 
  className = "" 
}: { 
  address: string; 
  className?: string; 
}) {
  return (
    <span className={`text-sm font-mono ${className}`}>
      {formatAddress(address)}
    </span>
  );
}
