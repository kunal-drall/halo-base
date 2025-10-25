'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCircles } from '@/hooks/useCircles';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useCircleStore } from '@/store';
import { formatUSDC, formatDuration } from '@/lib/utils';
import { PayoutMethod } from '@/types';
import { 
  Plus, 
  DollarSign, 
  Clock, 
  Users, 
  Shield, 
  Settings,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Info,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Globe,
  Crown,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface CreateCircleFormProps {
  onSuccess?: (circleId: bigint) => void;
  onCancel?: () => void;
  className?: string;
}

export function CreateCircleForm({
  onSuccess,
  onCancel,
  className = ''
}: CreateCircleFormProps) {
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    isPublic: true,
    
    // Financial
    contributionAmount: '',
    maxMembers: '',
    cycleDuration: '',
    
    // Trust & Security
    minTrustTier: 0,
    insurancePercent: '',
    latePenaltyBps: '',
    
    // Payout
    payoutMethod: PayoutMethod.FIXED_ROTATION,
    
    // Advanced
    allowLateJoins: false,
    autoStart: false,
    requireApproval: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createCircle, isLoading: isLoadingFactory } = useCircleFactory();
  const { isRegistered, hasBalance, trustScore, isLoading: isLoadingIntegration } = useContractIntegration();

  const steps = [
    { id: 1, title: 'Basic Info', icon: Info },
    { id: 2, title: 'Financial', icon: DollarSign },
    { id: 3, title: 'Trust & Security', icon: Shield },
    { id: 4, title: 'Payout Method', icon: Settings },
    { id: 5, title: 'Review & Create', icon: CheckCircle }
  ];

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Circle name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        break;
      case 2:
        if (!formData.contributionAmount || Number(formData.contributionAmount) <= 0) {
          newErrors.contributionAmount = 'Contribution amount must be greater than 0';
        }
        if (!formData.maxMembers || Number(formData.maxMembers) < 2) {
          newErrors.maxMembers = 'Maximum members must be at least 2';
        }
        if (!formData.cycleDuration || Number(formData.cycleDuration) < 1) {
          newErrors.cycleDuration = 'Cycle duration must be at least 1 day';
        }
        break;
      case 3:
        if (formData.minTrustTier < 0 || formData.minTrustTier > 4) {
          newErrors.minTrustTier = 'Trust tier must be between 0 and 4';
        }
        if (!formData.insurancePercent || Number(formData.insurancePercent) < 0 || Number(formData.insurancePercent) > 100) {
          newErrors.insurancePercent = 'Insurance percentage must be between 0 and 100';
        }
        if (!formData.latePenaltyBps || Number(formData.latePenaltyBps) < 0 || Number(formData.latePenaltyBps) > 10000) {
          newErrors.latePenaltyBps = 'Late penalty must be between 0 and 10000 bps';
        }
        break;
      case 4:
        // Payout method validation
        break;
      case 5:
        // Final validation
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev => prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    try {
      setIsCreating(true);
      
      const params = {
        name: formData.name,
        description: formData.description,
        contributionAmount: BigInt(Math.floor(Number(formData.contributionAmount) * 1e6)),
        maxMembers: BigInt(Number(formData.maxMembers)),
        cycleDuration: BigInt(Number(formData.cycleDuration) * 24 * 60 * 60),
        minTrustTier: formData.minTrustTier,
        insurancePercent: BigInt(Number(formData.insurancePercent) * 100),
        latePenaltyBps: BigInt(Number(formData.latePenaltyBps)),
        payoutMethod: formData.payoutMethod,
        isPublic: formData.isPublic,
        allowLateJoins: formData.allowLateJoins,
        autoStart: formData.autoStart,
        requireApproval: formData.requireApproval
      };

      const circleId = await createCircle(params);
      onSuccess?.(circleId);
    } catch (error) {
      console.error('Failed to create circle:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getPayoutMethodLabel = (method: PayoutMethod) => {
    switch (method) {
      case PayoutMethod.FIXED_ROTATION:
        return 'Fixed Rotation';
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

  const getPayoutMethodDescription = (method: PayoutMethod) => {
    switch (method) {
      case PayoutMethod.FIXED_ROTATION:
        return 'Members receive payouts in a predetermined order';
      case PayoutMethod.AUCTION:
        return 'Members bid for the payout, highest bidder wins';
      case PayoutMethod.RANDOM:
        return 'Payout recipient is selected randomly';
      case PayoutMethod.HYBRID:
        return 'Combination of rotation and auction methods';
      default:
        return '';
    }
  };

  const getPayoutMethodIcon = (method: PayoutMethod) => {
    switch (method) {
      case PayoutMethod.FIXED_ROTATION:
        return <Users className="h-4 w-4" />;
      case PayoutMethod.AUCTION:
        return <DollarSign className="h-4 w-4" />;
      case PayoutMethod.RANDOM:
        return <Shield className="h-4 w-4" />;
      case PayoutMethod.HYBRID:
        return <Settings className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Circle Name *</label>
              <input
                type="text"
                placeholder="Enter circle name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <textarea
                placeholder="Describe your circle"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Visibility</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.isPublic}
                    onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                    className="text-primary"
                  />
                  <Globe className="h-4 w-4" />
                  <span>Public</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!formData.isPublic}
                    onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                    className="text-primary"
                  />
                  <Lock className="h-4 w-4" />
                  <span>Private</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contribution Amount (USDC) *</label>
              <input
                type="number"
                placeholder="100.00"
                value={formData.contributionAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, contributionAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.contributionAmount && <p className="text-sm text-red-500">{errors.contributionAmount}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Maximum Members *</label>
              <input
                type="number"
                placeholder="10"
                value={formData.maxMembers}
                onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.maxMembers && <p className="text-sm text-red-500">{errors.maxMembers}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cycle Duration (days) *</label>
              <input
                type="number"
                placeholder="7"
                value={formData.cycleDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, cycleDuration: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.cycleDuration && <p className="text-sm text-red-500">{errors.cycleDuration}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Trust Tier</label>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((tier) => (
                  <Button
                    key={tier}
                    variant={formData.minTrustTier === tier ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, minTrustTier: tier }))}
                    className="text-xs"
                  >
                    Tier {tier}
                  </Button>
                ))}
              </div>
              {errors.minTrustTier && <p className="text-sm text-red-500">{errors.minTrustTier}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Insurance Percentage</label>
              <input
                type="number"
                placeholder="5.0"
                value={formData.insurancePercent}
                onChange={(e) => setFormData(prev => ({ ...prev, insurancePercent: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.insurancePercent && <p className="text-sm text-red-500">{errors.insurancePercent}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Late Penalty (basis points)</label>
              <input
                type="number"
                placeholder="100"
                value={formData.latePenaltyBps}
                onChange={(e) => setFormData(prev => ({ ...prev, latePenaltyBps: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.latePenaltyBps && <p className="text-sm text-red-500">{errors.latePenaltyBps}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payout Method</label>
              <div className="grid grid-cols-1 gap-3">
                {Object.values(PayoutMethod).map((method) => (
                  <Button
                    key={method}
                    variant={formData.payoutMethod === method ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, payoutMethod: method }))}
                    className="justify-start h-auto p-4"
                  >
                    <div className="flex items-start space-x-3">
                      {getPayoutMethodIcon(method)}
                      <div className="text-left">
                        <div className="font-medium">{getPayoutMethodLabel(method)}</div>
                        <div className="text-xs text-text-secondary">{getPayoutMethodDescription(method)}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="bg-surface-light rounded-lg p-4">
              <h4 className="font-medium mb-3">Circle Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Name:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Contribution:</span>
                  <span className="font-medium">{formatUSDC(BigInt(Math.floor(Number(formData.contributionAmount) * 1e6)))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Max Members:</span>
                  <span className="font-medium">{formData.maxMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Duration:</span>
                  <span className="font-medium">{formatDuration(Number(formData.cycleDuration) * 24 * 60 * 60)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Trust Tier:</span>
                  <span className="font-medium">Tier {formData.minTrustTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Payout Method:</span>
                  <span className="font-medium">{getPayoutMethodLabel(formData.payoutMethod)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Visibility:</span>
                  <span className="font-medium">{formData.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoadingIntegration) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isRegistered) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Registration Required</h3>
          <p className="text-text-secondary mb-4">
            You need to register with the Trust Score Manager before creating a circle.
          </p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!hasBalance) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Insufficient Balance</h3>
          <p className="text-text-secondary mb-4">
            You need USDC to create a circle. Please mint some test USDC first.
          </p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Circle</span>
          </CardTitle>
          <Badge variant="secondary">Step {step} of 5</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Progress</span>
            <span className="font-medium">{Math.round((step / 5) * 100)}%</span>
          </div>
          <ProgressBar value={(step / 5) * 100} size="sm" />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isCreating}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={isCreating}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isCreating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreating ? 'Creating...' : 'Create Circle'}
              </Button>
            )}
          </div>
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isCreating}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}