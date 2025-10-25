'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TrustScoreDisplay } from '@/components/trust/TrustScoreDisplay';
import { TrustScoreBreakdown } from '@/components/trust/TrustScoreBreakdown';
import { TrustScoreHistory } from '@/components/trust/TrustScoreHistory';
import { TrustScoreVerification } from '@/components/trust/TrustScoreVerification';
import { TrustScoreAnalytics } from '@/components/trust/TrustScoreAnalytics';
import { CircleCard } from '@/components/circles/CircleCard';
import { CircleGrid } from '@/components/circles/CircleGrid';
import { ContributionWidget } from '@/components/circles/ContributionWidget';
import { CircleTimeline } from '@/components/circles/CircleTimeline';
import { CircleMembers } from '@/components/circles/CircleMembers';
import { CirclePayout } from '@/components/circles/CirclePayout';
import { CreateCircleForm } from '@/components/circles/CreateCircleForm';
import { ContractIntegrationTest } from '@/components/ContractIntegrationTest';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useCircles } from '@/hooks/useCircles';
import { useYieldData } from '@/hooks/useYieldData';
import { useMockUSDC } from '@/hooks/useMockUSDC';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { 
  Home, 
  Users, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Star, 
  Activity, 
  Clock, 
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

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<bigint | null>(null);

  const { isRegistered, hasBalance, trustScore, isLoading: isLoadingIntegration } = useContractIntegration();
  const { trustScore: userTrustScore, trustTier, trustMetrics, isLoading: isLoadingTrust } = useTrustScore();
  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { totalYield, apy, isLoading: isLoadingYield } = useYieldData();
  const { balance, isLoading: isLoadingUSDC } = useMockUSDC();

  const { 
    getDashboardStats, 
    getPendingContributions, 
    getActivityFeed, 
    getRecentCircles,
    getTrustScoreTrends,
    getYieldHistory
  } = useCircleStore();

  const { 
    getTrustScoreBreakdown, 
    getTrustScoreHistory, 
    getTrustScoreAnalytics,
    getVerificationStatus
  } = useTrustScoreStore();

  const { 
    getDashboardStats: getUIStats, 
    getPendingContributions: getUIPending, 
    getActivityFeed: getUIActivity,
    getRecentCircles: getUIRecent,
    getTrustScoreTrends: getUITrends,
    getYieldHistory: getUIYield
  } = useUIStore();

  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [pendingContributions, setPendingContributions] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [recentCircles, setRecentCircles] = useState<any[]>([]);
  const [trustScoreTrends, setTrustScoreTrends] = useState<any[]>([]);
  const [yieldHistory, setYieldHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isRegistered) {
      loadDashboardData();
    }
  }, [isRegistered]);

  const loadDashboardData = async () => {
    try {
      const [
        stats,
        pending,
        activity,
        recent,
        trends,
        yieldData
      ] = await Promise.all([
        getDashboardStats(),
        getPendingContributions(),
        getActivityFeed(),
        getRecentCircles(),
        getTrustScoreTrends(),
        getYieldHistory()
      ]);

      setDashboardStats(stats);
      setPendingContributions(pending);
      setActivityFeed(activity);
      setRecentCircles(recent);
      setTrustScoreTrends(trends);
      setYieldHistory(yieldData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleCreateCircle = () => {
    setShowCreateForm(true);
  };

  const handleCircleCreated = (circleId: bigint) => {
    setShowCreateForm(false);
    setSelectedCircle(circleId);
    loadDashboardData();
  };

  const handleViewCircle = (circleId: bigint) => {
    setSelectedCircle(circleId);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'circles', label: 'My Circles', icon: Users },
    { id: 'trust', label: 'Trust Score', icon: Shield },
    { id: 'yield', label: 'Yield', icon: TrendingUp },
    { id: 'activity', label: 'Activity', icon: Activity }
  ];

  if (isLoadingIntegration || isLoadingTrust || isLoadingCircles) {
    return (
      <DashboardLayout>
        <div className="p-4 space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-surface rounded"></div>
              ))}
            </div>
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
                You need to register with the Trust Score Manager to access the dashboard.
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

  if (!hasBalance) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Insufficient Balance</h2>
              <p className="text-text-secondary mb-4">
                You need USDC to participate in lending circles. Please mint some test USDC first.
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

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-text-secondary">Welcome back! Here's your overview.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboardData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleCreateCircle}>
              <Plus className="h-4 w-4 mr-2" />
              Create Circle
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total Circles</p>
                  <p className="text-2xl font-bold">{circles?.length || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Trust Score</p>
                  <p className="text-2xl font-bold">{trustScore?.toString() || '0'}</p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total Yield</p>
                  <p className="text-2xl font-bold">{formatUSDC(totalYield || 0n)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">USDC Balance</p>
                  <p className="text-2xl font-bold">{formatUSDC(balance || 0n)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

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
              {/* Pending Contributions */}
              {pendingContributions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Pending Contributions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingContributions.slice(0, 3).map((contribution, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-surface-light rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <DollarSign className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">Circle #{contribution.circleId}</div>
                              <div className="text-sm text-text-secondary">
                                Due: {formatDate(Number(contribution.dueDate))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatUSDC(contribution.amount)}</div>
                            <Badge variant="warning">Pending</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Circles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Recent Circles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentCircles.slice(0, 4).map((circle) => (
                      <CircleCard
                        key={circle.id}
                        circleId={circle.id}
                        circleAddress={circle.address}
                        onView={handleViewCircle}
                        variant="compact"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityFeed.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-surface-light rounded">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-text-secondary">{activity.description}</div>
                        </div>
                        <div className="text-xs text-text-secondary">
                          {formatDate(Number(activity.timestamp))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'circles' && (
            <motion.div
              key="circles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CircleGrid
                circles={circles || []}
                onView={handleViewCircle}
                showFilters={true}
                showSearch={true}
                showSort={true}
                showViewToggle={true}
              />
            </motion.div>
          )}

          {activeTab === 'trust' && (
            <motion.div
              key="trust"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrustScoreDisplay
                  variant="detailed"
                  showBreakdown={true}
                  showHistory={true}
                  showActions={true}
                />
                <TrustScoreBreakdown
                  variant="detailed"
                  showHistory={true}
                  showMetrics={true}
                  showActions={true}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrustScoreHistory
                  showFilters={true}
                  showPagination={true}
                  showChart={true}
                />
                <TrustScoreVerification
                  showActions={true}
                  showDetails={true}
                  variant="detailed"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'yield' && (
            <motion.div
              key="yield"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Yield Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500">
                          {formatUSDC(totalYield || 0n)}
                        </div>
                        <div className="text-sm text-text-secondary">Total Yield Earned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                          {apy ? `${Number(apy) / 100}%` : '0%'}
                        </div>
                        <div className="text-sm text-text-secondary">Current APY</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Yield History</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {yieldHistory.slice(0, 5).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-surface-light rounded">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{entry.description}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-500">
                              +{formatUSDC(entry.amount)}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {formatDate(Number(entry.timestamp))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Activity Feed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityFeed.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-surface-light rounded">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-text-secondary mb-2">
                            {activity.description}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{activity.type}</Badge>
                            <span className="text-xs text-text-secondary">
                              {formatDate(Number(activity.timestamp))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Circle Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl bg-background rounded-lg shadow-lg"
              >
                <CreateCircleForm
                  onSuccess={handleCircleCreated}
                  onCancel={() => setShowCreateForm(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contract Integration Test */}
        <ContractIntegrationTest />
      </div>
    </DashboardLayout>
  );
}
