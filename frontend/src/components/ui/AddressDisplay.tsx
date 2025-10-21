'use client';

import { useBasename } from '@/hooks/useBasename';
import { formatAddressWithBasename } from '@/hooks/useBasename';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { CheckCircle, User } from 'lucide-react';

interface AddressDisplayProps {
  address: string;
  showAvatar?: boolean;
  showVerification?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AddressDisplay({ 
  address, 
  showAvatar = false, 
  showVerification = true,
  size = 'md',
  className 
}: AddressDisplayProps) {
  const { basename, isLoading } = useBasename(address);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className="h-4 w-4 animate-pulse bg-surface rounded" />
        <span className="text-text-secondary">Loading...</span>
      </div>
    );
  }

  const displayName = formatAddressWithBasename(address, basename);
  const isVerified = basename?.verified;

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {showAvatar && (
        <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center overflow-hidden">
          {basename?.avatar ? (
            <img 
              src={basename.avatar} 
              alt={basename.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-text-secondary" />
          )}
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        <span className={cn('font-medium', sizeClasses[size])}>
          {displayName}
        </span>
        
        {showVerification && isVerified && (
          <CheckCircle className="h-4 w-4 text-success" />
        )}
      </div>
      
      {basename && !isVerified && (
        <Badge variant="secondary" size="sm">
          Unverified
        </Badge>
      )}
    </div>
  );
}
