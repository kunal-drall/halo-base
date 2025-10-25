'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCircles } from '@/hooks/useCircles';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { PayoutMethod } from '@/types';
import { 
  Plus, 
  Users, 
  DollarSign, 
  Clock, 
  Shield, 
  Star, 
  TrendingUp, 
  Activity, 
  Calendar, 
  Bell, 
  Settings, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronDown, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Zap, 
  Flame, 
  Gem, 
  Diamond, 
  Trophy, 
  Medal, 
  Ribbon, 
  Award, 
  Target, 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown, 
  Minus, 
  Plus as PlusIcon, 
  X, 
  Check, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  Share, 
  MoreHorizontal, 
  LogOut, 
  Wallet, 
  Key, 
  Globe, 
  Lock, 
  Unlock, 
  Zap as ZapIcon, 
  Flame as FlameIcon, 
  Gem as GemIcon, 
  Diamond as DiamondIcon, 
  Trophy as TrophyIcon, 
  Medal as MedalIcon, 
  Ribbon as RibbonIcon, 
  Award as AwardIcon, 
  Target as TargetIcon, 
  Activity as ActivityIcon, 
  BarChart3 as BarChart3Icon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp as TrendingUpIcon2, 
  TrendingDown as TrendingDownIcon, 
  Minus as MinusIcon, 
  Plus as PlusIcon2, 
  X as XIcon, 
  Check as CheckIcon, 
  AlertTriangle as AlertTriangleIcon, 
  CheckCircle as CheckCircleIcon, 
  AlertCircle as AlertCircleIcon, 
  Info as InfoIcon, 
  Heart as HeartIcon, 
  Bookmark as BookmarkIcon, 
  MessageCircle as MessageCircleIcon, 
  Share as ShareIcon, 
  MoreHorizontal as MoreHorizontalIcon, 
  LogOut as LogOutIcon, 
  Wallet as WalletIcon, 
  Key as KeyIcon, 
  Globe as GlobeIcon, 
  Lock as LockIcon, 
  Unlock as UnlockIcon
} from 'lucide-react';

interface CreateCircleWizardProps {
  onSuccess?: (circleId: bigint) => void;
  onCancel?: () => void;
  userTrustScore?: bigint;
  userTrustTier?: number;
  isLoading?: boolean;
  className?: string;
}

export function CreateCircleWizard({
  onSuccess,
  onCancel,
  userTrustScore = 0n,
  userTrustTier = 0,
  isLoading = false,
  className = ''
}: CreateCircleWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    description: '',
    category: '',
    
    // Step 2: Circle Parameters
    contributionAmount: 0n,
    maxMembers: 4,
    cycleDuration: 0n,
    
    // Step 3: Trust & Requirements
    minTrustTier: 0,
    minTrustScore: 0n,
    isPublic: true,
    
    // Step 4: Payout & Insurance
    payoutMethod: 'auction' as PayoutMethod,
    insuranceEnabled: false,
    insuranceAmount: 0n,
    latePenaltyEnabled: false,
    latePenaltyAmount: 0n,
    
    // Step 5: Advanced Options
    yieldEnabled: false,
    yieldPercentage: 0,
    autoStart: false,
    autoStartDelay: 0n,
    notifications: true,
    reminders: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScoreData, trustTier: userTrustTierData, trustMetrics } = useTrustScore();

  const { 
    createCircle, 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline
  } = useCircleStore();

  const { 
    createCircle: createUICircle, 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline
  } = useUIStore();

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Set up your circle name and description',
      icon: Info,
      fields: ['name', 'description', 'category']
    },
    {
      id: 2,
      title: 'Circle Parameters',
      description: 'Define contribution amount and cycle duration',
      icon: DollarSign,
      fields: ['contributionAmount', 'maxMembers', 'cycleDuration']
    },
    {
      id: 3,
      title: 'Trust & Requirements',
      description: 'Set trust score and membership requirements',
      icon: Shield,
      fields: ['minTrustTier', 'minTrustScore', 'isPublic']
    },
    {
      id: 4,
      title: 'Payout & Insurance',
      description: 'Configure payout method and insurance options',
      icon: TrendingUp,
      fields: ['payoutMethod', 'insuranceEnabled', 'insuranceAmount', 'latePenaltyEnabled', 'latePenaltyAmount']
    },
    {
      id: 5,
      title: 'Advanced Options',
      description: 'Set yield generation and automation options',
      icon: Settings,
      fields: ['yieldEnabled', 'yieldPercentage', 'autoStart', 'autoStartDelay', 'notifications', 'reminders']
    }
  ];

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const stepData = steps[step - 1];
    const newErrors: Record<string, string> = {};

    stepData.fields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      
      switch (field) {
        case 'name':
          if (!value || (value as string).trim().length === 0) {
            newErrors.name = 'Circle name is required';
          } else if ((value as string).length < 3) {
            newErrors.name = 'Circle name must be at least 3 characters';
          }
          break;
          
        case 'description':
          if (!value || (value as string).trim().length === 0) {
            newErrors.description = 'Circle description is required';
          } else if ((value as string).length < 10) {
            newErrors.description = 'Circle description must be at least 10 characters';
          }
          break;
          
        case 'contributionAmount':
          if (!value || (value as bigint) <= 0n) {
            newErrors.contributionAmount = 'Contribution amount must be greater than 0';
          } else if ((value as bigint) > 1000000n * 10n ** 6n) { // 1M USDC
            newErrors.contributionAmount = 'Contribution amount too high';
          }
          break;
          
        case 'maxMembers':
          if (!value || (value as number) < 2) {
            newErrors.maxMembers = 'Maximum members must be at least 2';
          } else if ((value as number) > 20) {
            newErrors.maxMembers = 'Maximum members cannot exceed 20';
          }
          break;
          
        case 'cycleDuration':
          if (!value || (value as bigint) <= 0n) {
            newErrors.cycleDuration = 'Cycle duration must be greater than 0';
          } else if ((value as bigint) < 86400n) { // 1 day
            newErrors.cycleDuration = 'Cycle duration must be at least 1 day';
          } else if ((value as bigint) > 31536000n) { // 1 year
            newErrors.cycleDuration = 'Cycle duration cannot exceed 1 year';
          }
          break;
          
        case 'minTrustTier':
          if (value !== undefined && (value as number) < 0) {
            newErrors.minTrustTier = 'Minimum trust tier cannot be negative';
          } else if (value !== undefined && (value as number) > (userTrustTier || 0)) {
            newErrors.minTrustTier = 'Minimum trust tier cannot exceed your trust tier';
          }
          break;
          
        case 'minTrustScore':
          if (value !== undefined && (value as bigint) < 0n) {
            newErrors.minTrustScore = 'Minimum trust score cannot be negative';
          } else if (value !== undefined && (value as bigint) > (userTrustScore || 0n)) {
            newErrors.minTrustScore = 'Minimum trust score cannot exceed your trust score';
          }
          break;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setIsSubmitting(true);
      const circleId = await createCircle({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        contributionAmount: formData.contributionAmount,
        maxMembers: formData.maxMembers,
        cycleDuration: formData.cycleDuration,
        minTrustTier: formData.minTrustTier,
        minTrustScore: formData.minTrustScore,
        isPublic: formData.isPublic,
        payoutMethod: formData.payoutMethod,
        insuranceEnabled: formData.insuranceEnabled,
        insuranceAmount: formData.insuranceAmount,
        latePenaltyEnabled: formData.latePenaltyEnabled,
        latePenaltyAmount: formData.latePenaltyAmount,
        yieldEnabled: formData.yieldEnabled,
        yieldPercentage: formData.yieldPercentage,
        autoStart: formData.autoStart,
        autoStartDelay: formData.autoStartDelay,
        notifications: formData.notifications,
        reminders: formData.reminders
      });
      
      onSuccess?.(circleId);
    } catch (error) {
      console.error('Failed to create circle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Circle Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Enter circle name"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Describe your circle's purpose and goals"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select category</option>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
                <option value="community">Community</option>
                <option value="investment">Investment</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contribution Amount (USDC) *</label>
              <input
                type="number"
                value={formData.contributionAmount.toString()}
                onChange={(e) => handleFieldChange('contributionAmount', BigInt(e.target.value || 0))}
                placeholder="Enter contribution amount"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.contributionAmount && <p className="text-red-500 text-sm mt-1">{errors.contributionAmount}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Maximum Members *</label>
              <input
                type="number"
                value={formData.maxMembers}
                onChange={(e) => handleFieldChange('maxMembers', parseInt(e.target.value) || 0)}
                placeholder="Enter maximum members"
                min="2"
                max="20"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.maxMembers && <p className="text-red-500 text-sm mt-1">{errors.maxMembers}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Cycle Duration (days) *</label>
              <input
                type="number"
                value={Number(formData.cycleDuration) / 86400}
                onChange={(e) => handleFieldChange('cycleDuration', BigInt((parseInt(e.target.value) || 0) * 86400))}
                placeholder="Enter cycle duration in days"
                min="1"
                max="365"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.cycleDuration && <p className="text-red-500 text-sm mt-1">{errors.cycleDuration}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Trust Tier</label>
              <input
                type="number"
                value={formData.minTrustTier}
                onChange={(e) => handleFieldChange('minTrustTier', parseInt(e.target.value) || 0)}
                placeholder="Enter minimum trust tier"
                min="0"
                max={userTrustTier || 0}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.minTrustTier && <p className="text-red-500 text-sm mt-1">{errors.minTrustTier}</p>}
              <p className="text-xs text-text-secondary mt-1">
                Your trust tier: {userTrustTier || 0}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Trust Score</label>
              <input
                type="number"
                value={formData.minTrustScore.toString()}
                onChange={(e) => handleFieldChange('minTrustScore', BigInt(e.target.value || 0))}
                placeholder="Enter minimum trust score"
                min="0"
                max={userTrustScore.toString()}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.minTrustScore && <p className="text-red-500 text-sm mt-1">{errors.minTrustScore}</p>}
              <p className="text-xs text-text-secondary mt-1">
                Your trust score: {userTrustScore.toString()}
              </p>
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => handleFieldChange('isPublic', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">Make circle public</span>
              </label>
              <p className="text-xs text-text-secondary mt-1">
                Public circles can be discovered by other users
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payout Method *</label>
              <select
                value={formData.payoutMethod}
                onChange={(e) => handleFieldChange('payoutMethod', e.target.value as PayoutMethod)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="auction">Auction (highest bidder wins)</option>
                <option value="lottery">Lottery (random selection)</option>
                <option value="rotation">Rotation (fixed order)</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.insuranceEnabled}
                  onChange={(e) => handleFieldChange('insuranceEnabled', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">Enable insurance</span>
              </label>
              <p className="text-xs text-text-secondary mt-1">
                Insurance protects against member defaults
              </p>
            </div>
            
            {formData.insuranceEnabled && (
              <div>
                <label className="block text-sm font-medium mb-2">Insurance Amount (USDC)</label>
                <input
                  type="number"
                  value={formData.insuranceAmount.toString()}
                  onChange={(e) => handleFieldChange('insuranceAmount', BigInt(e.target.value || 0))}
                  placeholder="Enter insurance amount"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            )}
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.latePenaltyEnabled}
                  onChange={(e) => handleFieldChange('latePenaltyEnabled', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">Enable late penalties</span>
              </label>
              <p className="text-xs text-text-secondary mt-1">
                Late penalties encourage timely contributions
              </p>
            </div>
            
            {formData.latePenaltyEnabled && (
              <div>
                <label className="block text-sm font-medium mb-2">Late Penalty Amount (USDC)</label>
                <input
                  type="number"
                  value={formData.latePenaltyAmount.toString()}
                  onChange={(e) => handleFieldChange('latePenaltyAmount', BigInt(e.target.value || 0))}
                  placeholder="Enter late penalty amount"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.yieldEnabled}
                  onChange={(e) => handleFieldChange('yieldEnabled', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">Enable yield generation</span>
              </label>
              <p className="text-xs text-text-secondary mt-1">
                Generate yield on contributions using Aave V3
              </p>
            </div>
            
            {formData.yieldEnabled && (
              <div>
                <label className="block text-sm font-medium mb-2">Yield Percentage</label>
                <input
                  type="number"
                  value={formData.yieldPercentage}
                  onChange={(e) => handleFieldChange('yieldPercentage', parseInt(e.target.value) || 0)}
                  placeholder="Enter yield percentage"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            )}
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.autoStart}
                  onChange={(e) => handleFieldChange('autoStart', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">Auto-start when full</span>
              </label>
              <p className="text-xs text-text-secondary mt-1">
                Automatically start the circle when all members join
              </p>
            </div>
            
            {formData.autoStart && (
              <div>
                <label className="block text-sm font-medium mb-2">Auto-start Delay (hours)</label>
                <input
                  type="number"
                  value={Number(formData.autoStartDelay) / 3600}
                  onChange={(e) => handleFieldChange('autoStartDelay', BigInt((parseInt(e.target.value) || 0) * 3600))}
                  placeholder="Enter auto-start delay in hours"
                  min="0"
                  max="168"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            )}
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) => handleFieldChange('notifications', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">Enable notifications</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.reminders}
                  onChange={(e) => handleFieldChange('reminders', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">Enable reminders</span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Circle Wizard</span>
          </CardTitle>
          <Badge variant="secondary">Step {currentStep} of {totalSteps}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} size="md" />
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 
                    isCompleted ? 'bg-green-100 text-green-700' : 
                    'bg-surface text-text-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {steps[currentStep - 1].title}
                </h3>
                <p className="text-text-secondary">
                  {steps[currentStep - 1].description}
                </p>
              </div>
              
              {getStepContent()}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Create Circle
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
