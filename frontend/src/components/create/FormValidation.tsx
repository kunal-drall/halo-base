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

interface FormValidationProps {
  formData: any;
  userTrustScore?: bigint;
  userTrustTier?: number;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
  className?: string;
}

export function FormValidation({
  formData,
  userTrustScore = 0n,
  userTrustTier = 0,
  onValidationChange,
  className = ''
}: FormValidationProps) {
  const [validationResults, setValidationResults] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  }>({
    isValid: false,
    errors: [],
    warnings: [],
    suggestions: []
  });

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScoreData, trustTier: userTrustTierData, trustMetrics } = useTrustScore();

  const { 
    validateCircleForm, 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline
  } = useCircleStore();

  const { 
    validateCircleForm: validateUICircleForm, 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline
  } = useUIStore();

  useEffect(() => {
    if (formData) {
      validateForm();
    }
  }, [formData]);

  useEffect(() => {
    onValidationChange?.(validationResults.isValid, validationResults.errors);
  }, [validationResults, onValidationChange]);

  const validateForm = async () => {
    try {
      const results = await validateCircleForm(formData, {
        userTrustScore,
        userTrustTier
      });
      setValidationResults(results);
    } catch (error) {
      console.error('Validation failed:', error);
      setValidationResults({
        isValid: false,
        errors: ['Validation failed'],
        warnings: [],
        suggestions: []
      });
    }
  };

  const getValidationIcon = (type: 'error' | 'warning' | 'suggestion') => {
    switch (type) {
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'suggestion':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Check className="h-4 w-4 text-green-500" />;
    }
  };

  const getValidationBadge = (type: 'error' | 'warning' | 'suggestion') => {
    switch (type) {
      case 'error':
        return <Badge variant="error">Error</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'suggestion':
        return <Badge variant="secondary">Suggestion</Badge>;
      default:
        return <Badge variant="success">Valid</Badge>;
    }
  };

  const getValidationColor = (type: 'error' | 'warning' | 'suggestion') => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'suggestion':
        return 'text-blue-500';
      default:
        return 'text-green-500';
    }
  };

  const getValidationBackground = (type: 'error' | 'warning' | 'suggestion') => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'suggestion':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getValidationTitle = () => {
    if (validationResults.errors.length > 0) {
      return 'Validation Errors';
    } else if (validationResults.warnings.length > 0) {
      return 'Validation Warnings';
    } else if (validationResults.suggestions.length > 0) {
      return 'Validation Suggestions';
    } else {
      return 'Validation Complete';
    }
  };

  const getValidationIcon = () => {
    if (validationResults.errors.length > 0) {
      return <X className="h-5 w-5 text-red-500" />;
    } else if (validationResults.warnings.length > 0) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    } else if (validationResults.suggestions.length > 0) {
      return <Info className="h-5 w-5 text-blue-500" />;
    } else {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getValidationBadge = () => {
    if (validationResults.errors.length > 0) {
      return <Badge variant="error">{validationResults.errors.length} Errors</Badge>;
    } else if (validationResults.warnings.length > 0) {
      return <Badge variant="warning">{validationResults.warnings.length} Warnings</Badge>;
    } else if (validationResults.suggestions.length > 0) {
      return <Badge variant="secondary">{validationResults.suggestions.length} Suggestions</Badge>;
    } else {
      return <Badge variant="success">Valid</Badge>;
    }
  };

  const getValidationColor = () => {
    if (validationResults.errors.length > 0) {
      return 'text-red-500';
    } else if (validationResults.warnings.length > 0) {
      return 'text-yellow-500';
    } else if (validationResults.suggestions.length > 0) {
      return 'text-blue-500';
    } else {
      return 'text-green-500';
    }
  };

  const getValidationBackground = () => {
    if (validationResults.errors.length > 0) {
      return 'bg-red-50 border-red-200';
    } else if (validationResults.warnings.length > 0) {
      return 'bg-yellow-50 border-yellow-200';
    } else if (validationResults.suggestions.length > 0) {
      return 'bg-blue-50 border-blue-200';
    } else {
      return 'bg-green-50 border-green-200';
    }
  };

  return (
    <Card className={`${getValidationBackground()} border ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center space-x-2 ${getValidationColor()}`}>
            {getValidationIcon()}
            <span>{getValidationTitle()}</span>
          </CardTitle>
          {getValidationBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Errors */}
        {validationResults.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-500">Errors</h4>
            <div className="space-y-2">
              {validationResults.errors.map((error, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded">
                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {validationResults.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-yellow-500">Warnings</h4>
            <div className="space-y-2">
              {validationResults.warnings.map((warning, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-yellow-700">{warning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {validationResults.suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-blue-500">Suggestions</h4>
            <div className="space-y-2">
              {validationResults.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-700">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Message */}
        {validationResults.isValid && validationResults.errors.length === 0 && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-700">
              Your circle configuration is valid and ready to create!
            </span>
          </div>
        )}

        {/* Validation Summary */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Validation Status</span>
            <div className="flex items-center space-x-2">
              {validationResults.errors.length > 0 && (
                <span className="text-red-500 font-medium">
                  {validationResults.errors.length} errors
                </span>
              )}
              {validationResults.warnings.length > 0 && (
                <span className="text-yellow-500 font-medium">
                  {validationResults.warnings.length} warnings
                </span>
              )}
              {validationResults.suggestions.length > 0 && (
                <span className="text-blue-500 font-medium">
                  {validationResults.suggestions.length} suggestions
                </span>
              )}
              {validationResults.isValid && validationResults.errors.length === 0 && (
                <span className="text-green-500 font-medium">Valid</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
