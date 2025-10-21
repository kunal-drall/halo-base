'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCircleFactory } from '@/hooks/useCircleFactory';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useAccount } from 'wagmi';
import { Loader2, CheckCircle } from 'lucide-react';

interface CircleParams {
  contributionAmount: string;
  cycleDuration: string;
  maxMembers: string;
  minTrustScore: string;
}

export function CreateCircleForm() {
  const { address } = useAccount();
  const { integrationStatus } = useContractIntegration();
  const { createCircle } = useCircleFactory();
  const [formData, setFormData] = useState<CircleParams>({
    contributionAmount: '100',
    cycleDuration: '7',
    maxMembers: '5',
    minTrustScore: '100',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !integrationStatus.canCreateCircle) return;

    setIsSubmitting(true);
    try {
      const params = {
        contributionAmount: BigInt(parseFloat(formData.contributionAmount) * 1e6), // Convert to USDC units
        cycleDuration: BigInt(parseInt(formData.cycleDuration) * 24 * 60 * 60), // Convert days to seconds
        maxMembers: BigInt(parseInt(formData.maxMembers)),
        minTrustScore: BigInt(parseInt(formData.minTrustScore)),
        distributionType: 0, // ROTATION
        autoDeposit: false,
      };

      await createCircle(params);
      setSuccess(true);
    } catch (error) {
      console.error('Failed to create circle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CircleParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Lending Circle</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Please connect your wallet to create a circle.</p>
        </CardContent>
      </Card>
    );
  }

  if (!integrationStatus.canCreateCircle) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Lending Circle</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Please register your account and ensure you have USDC to create a circle.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Circle Created Successfully!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Your lending circle has been created and is now available for members to join.
          </p>
          <Button 
            onClick={() => setSuccess(false)}
            className="mt-4"
            variant="secondary"
          >
            Create Another Circle
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Lending Circle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Contribution Amount (USDC)
            </label>
            <input
              type="number"
              value={formData.contributionAmount}
              onChange={(e) => handleInputChange('contributionAmount', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cycle Duration (Days)
            </label>
            <input
              type="number"
              value={formData.cycleDuration}
              onChange={(e) => handleInputChange('cycleDuration', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Maximum Members
            </label>
            <input
              type="number"
              value={formData.maxMembers}
              onChange={(e) => handleInputChange('maxMembers', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              min="2"
              max="20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Trust Score
            </label>
            <input
              type="number"
              value={formData.minTrustScore}
              onChange={(e) => handleInputChange('minTrustScore', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              min="0"
              max="1000"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating Circle...
              </>
            ) : (
              'Create Circle'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
