'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useTrustScoreStore } from '@/store';
import { formatDate } from '@/lib/utils';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  DollarSign, 
  Activity, 
  Star, 
  Award, 
  Target, 
  Zap, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Info, 
  Settings, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Minus, 
  X, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Globe, 
  Lock, 
  Unlock, 
  Key, 
  Fingerprint, 
  Scan, 
  QrCode, 
  Smartphone, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Image, 
  Link, 
  ExternalLink
} from 'lucide-react';

interface TrustScoreVerificationProps {
  address?: string;
  showActions?: boolean;
  showDetails?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function TrustScoreVerification({
  address,
  showActions = true,
  showDetails = true,
  variant = 'default',
  className = ''
}: TrustScoreVerificationProps) {
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [verificationHistory, setVerificationHistory] = useState<any[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    trustScore,
    trustTier,
    trustMetrics,
    isRegistered,
    isLoading: isLoadingTrust
  } = useTrustScore(address);

  const {
    getVerificationStatus,
    getVerificationHistory,
    startVerification,
    completeVerification,
    refreshVerification
  } = useTrustScoreStore();

  useEffect(() => {
    if (isRegistered) {
      loadVerificationStatus();
      loadVerificationHistory();
    }
  }, [address, isRegistered]);

  const loadVerificationStatus = async () => {
    try {
      const status = await getVerificationStatus(address);
      setVerificationStatus(status);
    } catch (error) {
      console.error('Failed to load verification status:', error);
    }
  };

  const loadVerificationHistory = async () => {
    try {
      const history = await getVerificationHistory(address);
      setVerificationHistory(history);
    } catch (error) {
      console.error('Failed to load verification history:', error);
    }
  };

  const handleStartVerification = async (type: string) => {
    try {
      setIsVerifying(true);
      await startVerification(address, type);
      await loadVerificationStatus();
    } catch (error) {
      console.error('Failed to start verification:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCompleteVerification = async (type: string) => {
    try {
      setIsVerifying(true);
      await completeVerification(address, type);
      await loadVerificationStatus();
      await loadVerificationHistory();
    } catch (error) {
      console.error('Failed to complete verification:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshVerification(address);
      await loadVerificationStatus();
      await loadVerificationHistory();
    } catch (error) {
      console.error('Failed to refresh verification:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getVerificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'identity':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'social':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'financial':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'defi':
        return <Activity className="h-4 w-4 text-orange-500" />;
      case 'community':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'onchain':
        return <Target className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVerificationLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'identity':
        return 'Identity Verification';
      case 'social':
        return 'Social Media';
      case 'financial':
        return 'Financial History';
      case 'defi':
        return 'DeFi Activity';
      case 'community':
        return 'Community Standing';
      case 'onchain':
        return 'On-Chain Activity';
      default:
        return type;
    }
  };

  const getVerificationDescription = (type: string) => {
    switch (type.toLowerCase()) {
      case 'identity':
        return 'Verify your identity through government-issued documents';
      case 'social':
        return 'Connect and verify your social media accounts';
      case 'financial':
        return 'Provide financial history and credit information';
      case 'defi':
        return 'Verify your DeFi protocol participation and yield farming';
      case 'community':
        return 'Verify your standing in lending circles and community';
      case 'onchain':
        return 'Verify your on-chain transaction history and activity';
      default:
        return 'Verification process';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      case 'expired':
        return <Badge variant="warning">Expired</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      case 'expired':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getVerificationScore = () => {
    if (!verificationStatus) return 0;
    const verified = Object.values(verificationStatus).filter((status: any) => status === 'verified').length;
    const total = Object.keys(verificationStatus).length;
    return total > 0 ? Math.round((verified / total) * 100) : 0;
  };

  if (isLoadingTrust) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-surface rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-surface rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isRegistered) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-text-secondary">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>Address not registered with Trust Score Manager</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Verification</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{getVerificationScore()}%</div>
              <div className="text-xs text-text-secondary">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Verification Status</span>
            </CardTitle>
            {showActions && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-blue-500">
              {getVerificationScore()}%
            </div>
            <div className="text-lg font-medium">Verification Complete</div>
            <ProgressBar value={getVerificationScore()} size="md" />
          </div>

          {/* Verification Items */}
          {verificationStatus && (
            <div className="space-y-4">
              <h4 className="font-medium">Verification Items</h4>
              <div className="space-y-3">
                {Object.entries(verificationStatus).map(([type, status]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getVerificationIcon(type)}
                      <div>
                        <div className="font-medium">{getVerificationLabel(type)}</div>
                        <div className="text-xs text-text-secondary">
                          {getVerificationDescription(type)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status as string)}
                      {getStatusBadge(status as string)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {showDetails && verificationHistory.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Verification History</h4>
              <div className="space-y-2">
                {verificationHistory.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-surface-light rounded">
                    <div className="flex items-center space-x-2">
                      {getVerificationIcon(entry.type)}
                      <span>{getVerificationLabel(entry.type)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(entry.status)}
                      <span className="text-xs text-text-secondary">
                        {formatDate(Number(entry.timestamp))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Verification</span>
          </CardTitle>
          {showActions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-blue-500">
            {getVerificationScore()}%
          </div>
          <div className="text-sm text-text-secondary">Verification Complete</div>
          <ProgressBar value={getVerificationScore()} size="sm" />
        </div>

        {/* Quick Status */}
        {verificationStatus && (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-500">
                {Object.values(verificationStatus).filter((status: any) => status === 'verified').length}
              </div>
              <div className="text-xs text-text-secondary">Verified</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-500">
                {Object.values(verificationStatus).filter((status: any) => status === 'pending').length}
              </div>
              <div className="text-xs text-text-secondary">Pending</div>
            </div>
          </div>
        )}

        {/* Detailed View */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pt-4 border-t border-border"
            >
              {/* Verification Items */}
              {verificationStatus && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">All Verifications</h4>
                  {Object.entries(verificationStatus).map(([type, status]) => (
                    <div key={type} className="flex items-center justify-between p-2 bg-surface-light rounded">
                      <div className="flex items-center space-x-2">
                        {getVerificationIcon(type)}
                        <span className="text-sm">{getVerificationLabel(type)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status as string)}
                        {getStatusBadge(status as string)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {showActions && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartVerification('identity')}
                      disabled={isVerifying}
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Identity
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartVerification('social')}
                      disabled={isVerifying}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Social
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartVerification('financial')}
                      disabled={isVerifying}
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      Financial
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartVerification('defi')}
                      disabled={isVerifying}
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      DeFi
                    </Button>
                  </div>
                </div>
              )}

              {/* History */}
              {showDetails && verificationHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recent Activity</h4>
                  {verificationHistory.slice(0, 3).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 bg-surface-light rounded">
                      <div className="flex items-center space-x-1">
                        {getVerificationIcon(entry.type)}
                        <span>{getVerificationLabel(entry.type)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(entry.status)}
                        <span className="text-text-secondary">
                          {formatDate(Number(entry.timestamp))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
