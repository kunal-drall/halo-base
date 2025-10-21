import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface BasenameData {
  name: string;
  avatar?: string;
  verified: boolean;
}

// Mock Basename resolution - in production this would use the actual Basename API
const resolveBasename = async (address: string): Promise<BasenameData | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data for demonstration
  const mockBasenames: Record<string, BasenameData> = {
    '0x1234567890123456789012345678901234567890': {
      name: 'alice.base',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      verified: true,
    },
    '0x2345678901234567890123456789012345678901': {
      name: 'bob.base',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      verified: true,
    },
    '0x3456789012345678901234567890123456789012': {
      name: 'charlie.base',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      verified: false,
    },
  };

  return mockBasenames[address.toLowerCase()] || null;
};

export function useBasename(address?: string) {
  const [basename, setBasename] = useState<BasenameData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setBasename(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    resolveBasename(address)
      .then((result) => {
        setBasename(result);
      })
      .catch((err) => {
        setError(err.message);
        setBasename(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [address]);

  return {
    basename,
    isLoading,
    error,
    hasBasename: !!basename,
  };
}

// Hook for resolving multiple addresses at once
export function useBasenames(addresses: string[]) {
  return useQuery({
    queryKey: ['basenames', addresses],
    queryFn: async () => {
      const results = await Promise.all(
        addresses.map(async (address) => {
          const basename = await resolveBasename(address);
          return { address, basename };
        })
      );
      
      return results.reduce((acc, { address, basename }) => {
        acc[address.toLowerCase()] = basename;
        return acc;
      }, {} as Record<string, BasenameData | null>);
    },
    enabled: addresses.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Utility function to format address with Basename
export function formatAddressWithBasename(
  address: string, 
  basename?: BasenameData | null, 
  chars = 4
): string {
  if (basename) {
    return basename.verified ? basename.name : `${basename.name} (${formatAddress(address, chars)})`;
  }
  return formatAddress(address, chars);
}

// Utility function to format address (fallback)
function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
