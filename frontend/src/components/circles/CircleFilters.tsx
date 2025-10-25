'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCircleStore } from '@/store';
import { PayoutMethod } from '@/types';
import { 
  X, 
  DollarSign, 
  Clock, 
  Shield, 
  Users, 
  Globe, 
  Lock,
  RotateCcw,
  CheckCircle,
  Circle
} from 'lucide-react';

interface CircleFiltersProps {
  filters: {
    minAmount?: bigint;
    maxAmount?: bigint;
    minDuration?: bigint;
    maxDuration?: bigint;
    minTrustTier?: number;
    status?: 'all' | 'forming' | 'active' | 'completed';
    payoutMethod?: PayoutMethod;
    isPublic?: boolean;
  };
  onFiltersChange: (filters: any) => void;
  onClose?: () => void;
}

export function CircleFilters({ filters, onFiltersChange, onClose }: CircleFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      minAmount: undefined,
      maxAmount: undefined,
      minDuration: undefined,
      maxDuration: undefined,
      minTrustTier: undefined,
      status: 'all' as const,
      payoutMethod: undefined,
      isPublic: undefined,
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const getPayoutMethodLabel = (method: PayoutMethod) => {
    switch (method) {
      case PayoutMethod.FIXED_ROTATION:
        return 'Rotation';
      case PayoutMethod.AUCTION:
        return 'Auction';
      case PayoutMethod.RANDOM:
        return 'Random';
      case PayoutMethod.HYBRID:
        return 'Hybrid';
      default:
        return 'Unknown';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'forming':
        return 'Forming';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      default:
        return 'All';
    }
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== 'all'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              )}
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contribution Amount Range */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-text-secondary" />
              <span className="font-medium">Contribution Amount</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-text-secondary mb-1 block">
                  Min Amount (USDC)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={localFilters.minAmount ? Number(localFilters.minAmount) / 1e6 : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange('minAmount', value ? BigInt(Math.floor(Number(value) * 1e6)) : undefined);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1 block">
                  Max Amount (USDC)
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={localFilters.maxAmount ? Number(localFilters.maxAmount) / 1e6 : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange('maxAmount', value ? BigInt(Math.floor(Number(value) * 1e6)) : undefined);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Duration Range */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-text-secondary" />
              <span className="font-medium">Cycle Duration</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-text-secondary mb-1 block">
                  Min Duration (days)
                </label>
                <input
                  type="number"
                  placeholder="7"
                  value={localFilters.minDuration ? Number(localFilters.minDuration) / (24 * 60 * 60) : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange('minDuration', value ? BigInt(Number(value) * 24 * 60 * 60) : undefined);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1 block">
                  Max Duration (days)
                </label>
                <input
                  type="number"
                  placeholder="30"
                  value={localFilters.maxDuration ? Number(localFilters.maxDuration) / (24 * 60 * 60) : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange('maxDuration', value ? BigInt(Number(value) * 24 * 60 * 60) : undefined);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Trust Tier */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-text-secondary" />
              <span className="font-medium">Minimum Trust Tier</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((tier) => (
                <Button
                  key={tier}
                  variant={localFilters.minTrustTier === tier ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('minTrustTier', tier)}
                  className="text-xs"
                >
                  Tier {tier}
                </Button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-text-secondary" />
              <span className="font-medium">Status</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['all', 'forming', 'active', 'completed'].map((status) => (
                <Button
                  key={status}
                  variant={localFilters.status === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('status', status)}
                  className="text-xs"
                >
                  {getStatusLabel(status)}
                </Button>
              ))}
            </div>
          </div>

          {/* Payout Method */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-text-secondary" />
              <span className="font-medium">Payout Method</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PayoutMethod).map((method) => (
                <Button
                  key={method}
                  variant={localFilters.payoutMethod === method ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('payoutMethod', method)}
                  className="text-xs"
                >
                  {getPayoutMethodLabel(method)}
                </Button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-text-secondary" />
              <span className="font-medium">Visibility</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={localFilters.isPublic === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('isPublic', true)}
                className="text-xs"
              >
                <Globe className="h-3 w-3 mr-1" />
                Public
              </Button>
              <Button
                variant={localFilters.isPublic === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('isPublic', false)}
                className="text-xs"
              >
                <Lock className="h-3 w-3 mr-1" />
                Private
              </Button>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-text-secondary">Active Filters:</span>
              <div className="flex flex-wrap gap-2">
                {localFilters.minAmount && (
                  <Badge variant="secondary" className="text-xs">
                    Min: ${Number(localFilters.minAmount) / 1e6} USDC
                  </Badge>
                )}
                {localFilters.maxAmount && (
                  <Badge variant="secondary" className="text-xs">
                    Max: ${Number(localFilters.maxAmount) / 1e6} USDC
                  </Badge>
                )}
                {localFilters.minDuration && (
                  <Badge variant="secondary" className="text-xs">
                    Min: {Number(localFilters.minDuration) / (24 * 60 * 60)} days
                  </Badge>
                )}
                {localFilters.maxDuration && (
                  <Badge variant="secondary" className="text-xs">
                    Max: {Number(localFilters.maxDuration) / (24 * 60 * 60)} days
                  </Badge>
                )}
                {localFilters.minTrustTier !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    Tier: {localFilters.minTrustTier}
                  </Badge>
                )}
                {localFilters.status !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Status: {getStatusLabel(localFilters.status)}
                  </Badge>
                )}
                {localFilters.payoutMethod !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    Payout: {getPayoutMethodLabel(localFilters.payoutMethod)}
                  </Badge>
                )}
                {localFilters.isPublic !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {localFilters.isPublic ? 'Public' : 'Private'}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1"
            >
              Reset All
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
