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

interface ContributionHistoryProps {
  showFilters?: boolean;
  showPagination?: boolean;
  maxItems?: number;
  className?: string;
}

export function ContributionHistory({
  showFilters = true,
  showPagination = true,
  maxItems = 20,
  className = ''
}: ContributionHistoryProps) {
  const [contributions, setContributions] = useState<any[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCircle, setFilterCircle] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScore, trustTier, trustMetrics } = useTrustScore();

  const { 
    getContributionHistory, 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline
  } = useCircleStore();

  const { 
    getContributionHistory: getUIContributionHistory, 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline
  } = useUIStore();

  useEffect(() => {
    if (isRegistered) {
      loadContributions();
    }
  }, [isRegistered]);

  useEffect(() => {
    filterContributions();
  }, [contributions, filterStatus, filterCircle]);

  const loadContributions = async () => {
    try {
      setIsLoading(true);
      const data = await getContributionHistory();
      setContributions(data);
    } catch (error) {
      console.error('Failed to load contribution history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContributions = () => {
    let filtered = [...contributions];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(contribution => contribution.status === filterStatus);
    }

    if (filterCircle !== 'all') {
      filtered = filtered.filter(contribution => contribution.circleId === filterCircle);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => Number(b.timestamp - a.timestamp));

    setFilteredContributions(filtered);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadContributions();
    } catch (error) {
      console.error('Failed to refresh contributions:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      case 'cancelled':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getContributionTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'contribution':
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'payout':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'penalty':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'bonus':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'refund':
        return <RotateCcw className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getContributionTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'contribution':
        return <Badge variant="secondary">Contribution</Badge>;
      case 'payout':
        return <Badge variant="success">Payout</Badge>;
      case 'penalty':
        return <Badge variant="error">Penalty</Badge>;
      case 'bonus':
        return <Badge variant="warning">Bonus</Badge>;
      case 'refund':
        return <Badge variant="secondary">Refund</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getContributionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'contribution':
        return 'text-blue-500';
      case 'payout':
        return 'text-green-500';
      case 'penalty':
        return 'text-red-500';
      case 'bonus':
        return 'text-yellow-500';
      case 'refund':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const getUniqueCircles = () => {
    const circleIds = new Set(contributions.map(c => c.circleId));
    return Array.from(circleIds).sort();
  };

  const getUniqueStatuses = () => {
    const statuses = new Set(contributions.map(c => c.status));
    return Array.from(statuses).sort();
  };

  const toggleContributionDetails = (contributionId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [contributionId]: !prev[contributionId]
    }));
  };

  const paginatedContributions = showPagination 
    ? filteredContributions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredContributions.slice(0, maxItems);

  const totalPages = Math.ceil(filteredContributions.length / itemsPerPage);

  if (isLoading || isLoadingCircles) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Contribution History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 p-3">
                  <div className="w-8 h-8 bg-surface rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface rounded w-3/4"></div>
                    <div className="h-3 bg-surface rounded w-1/2"></div>
                  </div>
                </div>
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
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Registration Required</h3>
          <p className="text-text-secondary">
            Please register with the Trust Score Manager to view your contribution history.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Contribution History</span>
            <Badge variant="secondary">{filteredContributions.length}</Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1 border border-border rounded text-sm"
              >
                <option value="all">All</option>
                {getUniqueStatuses().map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Circle:</label>
              <select
                value={filterCircle}
                onChange={(e) => setFilterCircle(e.target.value)}
                className="px-2 py-1 border border-border rounded text-sm"
              >
                <option value="all">All Circles</option>
                {getUniqueCircles().map(circleId => (
                  <option key={circleId} value={circleId}>
                    Circle #{circleId}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Contributions */}
        {filteredContributions.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">No contributions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {paginatedContributions.map((contribution, index) => {
                const isExpanded = showDetails[contribution.id];
                
                return (
                  <motion.div
                    key={contribution.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-light transition-colors"
                  >
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(contribution.status)}
                    </div>

                    {/* Contribution Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            Circle #{contribution.circleId}
                          </span>
                          {getStatusBadge(contribution.status)}
                          {getContributionTypeBadge(contribution.type)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            contribution.type === 'payout' ? 'text-green-500' : 
                            contribution.type === 'penalty' ? 'text-red-500' : 
                            'text-blue-500'
                          }`}>
                            {contribution.type === 'payout' ? '+' : ''}
                            {formatUSDC(contribution.amount)}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {formatDate(Number(contribution.timestamp))}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleContributionDetails(contribution.id)}
                            className="p-1"
                          >
                            {isExpanded ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-text-secondary mt-1">
                        {contribution.description || 'No description available'}
                      </div>

                      {/* Contribution Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 p-3 bg-surface-light rounded-lg"
                          >
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-text-secondary">Circle ID:</span>
                                  <span className="font-medium ml-2">#{contribution.circleId}</span>
                                </div>
                                <div>
                                  <span className="text-text-secondary">Amount:</span>
                                  <span className="font-medium ml-2">{formatUSDC(contribution.amount)}</span>
                                </div>
                                <div>
                                  <span className="text-text-secondary">Status:</span>
                                  <span className="font-medium ml-2">{contribution.status}</span>
                                </div>
                                <div>
                                  <span className="text-text-secondary">Type:</span>
                                  <span className="font-medium ml-2">{contribution.type}</span>
                                </div>
                                <div>
                                  <span className="text-text-secondary">Date:</span>
                                  <span className="font-medium ml-2">{formatDate(Number(contribution.timestamp))}</span>
                                </div>
                                <div>
                                  <span className="text-text-secondary">Transaction:</span>
                                  <span className="font-medium ml-2 font-mono text-xs">
                                    {contribution.transactionHash?.slice(0, 10)}...
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-text-secondary">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredContributions.length)} of {filteredContributions.length} contributions
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-text-secondary">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
