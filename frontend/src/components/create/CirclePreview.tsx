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

interface CirclePreviewProps {
  formData: any;
  userTrustScore?: bigint;
  userTrustTier?: number;
  showActions?: boolean;
  className?: string;
}

export function CirclePreview({
  formData,
  userTrustScore = 0n,
  userTrustTier = 0,
  showActions = true,
  className = ''
}: CirclePreviewProps) {
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScoreData, trustTier: userTrustTierData, trustMetrics } = useTrustScore();

  const { 
    getCirclePreview, 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline
  } = useCircleStore();

  const { 
    getCirclePreview: getUICirclePreview, 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline
  } = useUIStore();

  useEffect(() => {
    if (formData) {
      generatePreview();
    }
  }, [formData]);

  const generatePreview = async () => {
    try {
      setIsLoading(true);
      const data = await getCirclePreview(formData);
      setPreviewData(data);
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPayoutMethodIcon = (method: PayoutMethod) => {
    switch (method) {
      case 'auction':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'lottery':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'rotation':
        return <RotateCcw className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPayoutMethodBadge = (method: PayoutMethod) => {
    switch (method) {
      case 'auction':
        return <Badge variant="secondary">Auction</Badge>;
      case 'lottery':
        return <Badge variant="warning">Lottery</Badge>;
      case 'rotation':
        return <Badge variant="success">Rotation</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPayoutMethodDescription = (method: PayoutMethod) => {
    switch (method) {
      case 'auction':
        return 'Highest bidder wins the payout';
      case 'lottery':
        return 'Random selection determines winner';
      case 'rotation':
        return 'Fixed order rotation system';
      default:
        return 'Unknown payout method';
    }
  };

  const getTrustTierColor = (tier: number) => {
    if (tier >= 5) return 'text-purple-500';
    if (tier >= 4) return 'text-blue-500';
    if (tier >= 3) return 'text-green-500';
    if (tier >= 2) return 'text-yellow-500';
    if (tier >= 1) return 'text-orange-500';
    return 'text-red-500';
  };

  const getTrustTierBadge = (tier: number) => {
    if (tier >= 5) return <Badge variant="secondary">Elite</Badge>;
    if (tier >= 4) return <Badge variant="secondary">Expert</Badge>;
    if (tier >= 3) return <Badge variant="success">Advanced</Badge>;
    if (tier >= 2) return <Badge variant="warning">Intermediate</Badge>;
    if (tier >= 1) return <Badge variant="error">Beginner</Badge>;
    return <Badge variant="error">New</Badge>;
  };

  const getTrustTierName = (tier: number) => {
    if (tier >= 5) return 'Elite';
    if (tier >= 4) return 'Expert';
    if (tier >= 3) return 'Advanced';
    if (tier >= 2) return 'Intermediate';
    if (tier >= 1) return 'Beginner';
    return 'New';
  };

  const calculateTotalValue = () => {
    if (!formData.contributionAmount || !formData.maxMembers) return 0n;
    return formData.contributionAmount * BigInt(formData.maxMembers);
  };

  const calculateCycleCount = () => {
    if (!formData.maxMembers) return 0;
    return formData.maxMembers;
  };

  const calculateEstimatedDuration = () => {
    if (!formData.cycleDuration || !formData.maxMembers) return 0n;
    return formData.cycleDuration * BigInt(formData.maxMembers);
  };

  const calculateEstimatedYield = () => {
    if (!formData.yieldEnabled || !formData.yieldPercentage) return 0n;
    const totalValue = calculateTotalValue();
    const yieldAmount = (totalValue * BigInt(formData.yieldPercentage)) / 100n;
    return yieldAmount;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Circle Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-surface rounded w-3/4"></div>
            <div className="h-4 bg-surface rounded w-1/2"></div>
            <div className="h-4 bg-surface rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Circle Preview</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">
              {formData.name || 'Untitled Circle'}
            </h3>
            <p className="text-text-secondary">
              {formData.description || 'No description provided'}
            </p>
            {formData.category && (
              <Badge variant="secondary" className="mt-2">
                {formData.category}
              </Badge>
            )}
          </div>
        </div>

        {/* Circle Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Contribution Amount</span>
              <span className="font-medium">
                {formatUSDC(formData.contributionAmount || 0n)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Maximum Members</span>
              <span className="font-medium">{formData.maxMembers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Cycle Duration</span>
              <span className="font-medium">
                {formatDuration(Number(formData.cycleDuration || 0n))}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Total Value</span>
              <span className="font-medium">
                {formatUSDC(calculateTotalValue())}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Total Cycles</span>
              <span className="font-medium">{calculateCycleCount()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Estimated Duration</span>
              <span className="font-medium">
                {formatDuration(Number(calculateEstimatedDuration()))}
              </span>
            </div>
          </div>
        </div>

        {/* Trust Requirements */}
        <div className="space-y-3">
          <h4 className="font-medium">Trust Requirements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Minimum Trust Tier</span>
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${getTrustTierColor(formData.minTrustTier || 0)}`}>
                  {getTrustTierName(formData.minTrustTier || 0)}
                </span>
                {getTrustTierBadge(formData.minTrustTier || 0)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Minimum Trust Score</span>
              <span className="font-medium">
                {formData.minTrustScore?.toString() || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Payout Method */}
        <div className="space-y-3">
          <h4 className="font-medium">Payout Configuration</h4>
          <div className="flex items-center space-x-3">
            {getPayoutMethodIcon(formData.payoutMethod || 'auction')}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  {formData.payoutMethod?.charAt(0).toUpperCase() + formData.payoutMethod?.slice(1) || 'Auction'}
                </span>
                {getPayoutMethodBadge(formData.payoutMethod || 'auction')}
              </div>
              <p className="text-sm text-text-secondary">
                {getPayoutMethodDescription(formData.payoutMethod || 'auction')}
              </p>
            </div>
          </div>
        </div>

        {/* Insurance & Penalties */}
        {(formData.insuranceEnabled || formData.latePenaltyEnabled) && (
          <div className="space-y-3">
            <h4 className="font-medium">Protection & Penalties</h4>
            <div className="space-y-2">
              {formData.insuranceEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Insurance Amount</span>
                  <span className="font-medium">
                    {formatUSDC(formData.insuranceAmount || 0n)}
                  </span>
                </div>
              )}
              {formData.latePenaltyEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Late Penalty</span>
                  <span className="font-medium">
                    {formatUSDC(formData.latePenaltyAmount || 0n)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Yield Generation */}
        {formData.yieldEnabled && (
          <div className="space-y-3">
            <h4 className="font-medium">Yield Generation</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Yield Percentage</span>
                <span className="font-medium">{formData.yieldPercentage || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Estimated Yield</span>
                <span className="font-medium text-green-500">
                  {formatUSDC(calculateEstimatedYield())}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Automation */}
        <div className="space-y-3">
          <h4 className="font-medium">Automation</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Auto-start</span>
              <span className="font-medium">
                {formData.autoStart ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            {formData.autoStart && formData.autoStartDelay > 0n && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Auto-start Delay</span>
                <span className="font-medium">
                  {formatDuration(Number(formData.autoStartDelay))}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Notifications</span>
              <span className="font-medium">
                {formData.notifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Reminders</span>
              <span className="font-medium">
                {formData.reminders ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-4 bg-surface-light rounded-lg">
          <h4 className="font-medium mb-3">Circle Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-text-secondary">Total Value</div>
              <div className="font-medium text-lg">
                {formatUSDC(calculateTotalValue())}
              </div>
            </div>
            <div>
              <div className="text-text-secondary">Members</div>
              <div className="font-medium text-lg">
                {formData.maxMembers || 0}
              </div>
            </div>
            <div>
              <div className="text-text-secondary">Duration</div>
              <div className="font-medium text-lg">
                {formatDuration(Number(calculateEstimatedDuration()))}
              </div>
            </div>
            <div>
              <div className="text-text-secondary">Trust Tier</div>
              <div className="font-medium text-lg">
                {formData.minTrustTier || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-text-secondary">
              Review your circle configuration before creating
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Check className="h-4 w-4 mr-2" />
                Create Circle
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
