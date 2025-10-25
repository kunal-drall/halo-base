'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CircleTimeline } from '@/components/circles/CircleTimeline';
import { CircleMembers } from '@/components/circles/CircleMembers';
import { CirclePayout } from '@/components/circles/CirclePayout';
import { ContributionWidget } from '@/components/circles/ContributionWidget';
import { useCircles } from '@/hooks/useCircles';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { PayoutMethod } from '@/types';
import { 
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
  Plus, 
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

export default function CircleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const circleId = BigInt(params.id as string);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [circle, setCircle] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isContributing, setIsContributing] = useState(false);

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScore, trustTier, trustMetrics } = useTrustScore();

  const { 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline,
    joinCircle,
    leaveCircle,
    contributeToCircle
  } = useCircleStore();

  const { 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline,
    joinCircle: joinUICircle,
    leaveCircle: leaveUICircle,
    contributeToCircle: contributeUICircle
  } = useUIStore();

  useEffect(() => {
    if (isRegistered) {
      loadCircleData();
    }
  }, [isRegistered, circleId]);

  const loadCircleData = async () => {
    try {
      setIsLoading(true);
      const [circleData, membersData, timelineData] = await Promise.all([
        getCircleDetails(circleId),
        getCircleMembers(circleId),
        getCircleTimeline(circleId)
      ]);
      
      setCircle(circleData);
      setMembers(membersData);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Failed to load circle data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCircle = async () => {
    try {
      setIsJoining(true);
      await joinCircle(circleId);
      await loadCircleData();
    } catch (error) {
      console.error('Failed to join circle:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveCircle = async () => {
    try {
      setIsLeaving(true);
      await leaveCircle(circleId);
      await loadCircleData();
    } catch (error) {
      console.error('Failed to leave circle:', error);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleContribute = async (amount: bigint) => {
    try {
      setIsContributing(true);
      await contributeToCircle(circleId, amount);
      await loadCircleData();
    } catch (error) {
      console.error('Failed to contribute:', error);
    } finally {
      setIsContributing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadCircleData();
    } catch (error) {
      console.error('Failed to refresh circle data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-500';
      case 'forming':
        return 'text-yellow-500';
      case 'completed':
        return 'text-blue-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'forming':
        return <Badge variant="warning">Forming</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'payout', label: 'Payout', icon: TrendingUp },
    { id: 'contribute', label: 'Contribute', icon: DollarSign }
  ];

  if (isLoading || isLoadingCircles) {
    return (
      <DashboardLayout>
        <div className="p-4 space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-surface rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isRegistered) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Registration Required</h2>
              <p className="text-text-secondary mb-4">
                You need to register with the Trust Score Manager to view circle details.
              </p>
              <Button onClick={() => router.push('/profile')}>
                Go to Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!circle) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Circle Not Found</h2>
              <p className="text-text-secondary mb-4">
                The circle you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{circle.name || `Circle #${circle.id}`}</h1>
              <p className="text-text-secondary">{circle.description || 'No description'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {circle.isActive && circle.memberCount < circle.params.maxMembers && (
              <Button
                onClick={handleJoinCircle}
                disabled={isJoining}
              >
                {isJoining ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Join Circle
              </Button>
            )}
          </div>
        </div>

        {/* Circle Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Status</span>
                </div>
                {getStatusBadge(circle.status)}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {circle.memberCount}/{circle.params.maxMembers}
                  </div>
                  <div className="text-sm text-text-secondary">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {formatUSDC(circle.params.contributionAmount)}
                  </div>
                  <div className="text-sm text-text-secondary">Contribution</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {formatDuration(Number(circle.params.cycleDuration))}
                  </div>
                  <div className="text-sm text-text-secondary">Duration</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-surface-light rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex-1"
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Circle Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Info className="h-5 w-5" />
                      <span>Circle Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {circle.name || `Circle #${circle.id}`}
                      </h3>
                      <p className="text-text-secondary">
                        {circle.description || 'No description available'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-text-secondary">Contribution Amount</div>
                        <div className="font-medium">{formatUSDC(circle.params.contributionAmount)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary">Maximum Members</div>
                        <div className="font-medium">{circle.params.maxMembers}</div>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary">Cycle Duration</div>
                        <div className="font-medium">{formatDuration(Number(circle.params.cycleDuration))}</div>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary">Trust Tier Required</div>
                        <div className="font-medium">{circle.params.minTrustTier}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Payout Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {getPayoutMethodIcon(circle.params.payoutMethod)}
                      <div>
                        <div className="font-medium capitalize">
                          {circle.params.payoutMethod}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {circle.params.payoutMethod === 'auction' ? 'Highest bidder wins' :
                           circle.params.payoutMethod === 'lottery' ? 'Random selection' :
                           circle.params.payoutMethod === 'rotation' ? 'Fixed order' : 'Unknown method'}
                        </div>
                      </div>
                      {getPayoutMethodBadge(circle.params.payoutMethod)}
                    </div>
                    
                    {circle.params.insuranceEnabled && (
                      <div className="p-3 bg-surface-light rounded">
                        <div className="text-sm text-text-secondary">Insurance</div>
                        <div className="font-medium">{formatUSDC(circle.params.insuranceAmount)}</div>
                      </div>
                    )}
                    
                    {circle.params.latePenaltyEnabled && (
                      <div className="p-3 bg-surface-light rounded">
                        <div className="text-sm text-text-secondary">Late Penalty</div>
                        <div className="font-medium">{formatUSDC(circle.params.latePenaltyAmount)}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Circle Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Member Progress</span>
                        <span className="text-sm text-text-secondary">
                          {circle.memberCount}/{circle.params.maxMembers}
                        </span>
                      </div>
                      <ProgressBar 
                        value={(circle.memberCount / circle.params.maxMembers) * 100} 
                        size="md" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-500">
                          {formatUSDC(circle.params.contributionAmount * BigInt(circle.memberCount))}
                        </div>
                        <div className="text-sm text-text-secondary">Total Value</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-500">
                          {circle.params.isPublic ? 'Public' : 'Private'}
                        </div>
                        <div className="text-sm text-text-secondary">Visibility</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CircleMembers
                circleId={circleId}
                members={members}
                onMemberAction={(memberId, action) => {
                  console.log('Member action:', action, memberId);
                }}
                showActions={true}
                showTrustScores={true}
                showContributionHistory={true}
              />
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CircleTimeline
                circleId={circleId}
                events={timeline}
                showFilters={true}
                showPagination={true}
                showChart={true}
              />
            </motion.div>
          )}

          {activeTab === 'payout' && (
            <motion.div
              key="payout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CirclePayout
                circleId={circleId}
                payoutMethod={circle.params.payoutMethod}
                onBid={(amount) => {
                  console.log('Bid amount:', amount);
                }}
                onClaim={() => {
                  console.log('Claim payout');
                }}
                showBidding={circle.params.payoutMethod === 'auction'}
                showClaiming={true}
                showHistory={true}
              />
            </motion.div>
          )}

          {activeTab === 'contribute' && (
            <motion.div
              key="contribute"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ContributionWidget
                circleId={circleId}
                contributionAmount={circle.params.contributionAmount}
                onContribute={handleContribute}
                isLoading={isContributing}
                showBalance={true}
                showHistory={true}
                showApproval={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
