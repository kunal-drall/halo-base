'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Shield, 
  Star, 
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
  Plus, 
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

interface PendingContributionsProps {
  showActions?: boolean;
  showDetails?: boolean;
  maxItems?: number;
  className?: string;
}

export function PendingContributions({
  showActions = true,
  showDetails = true,
  maxItems = 10,
  className = ''
}: PendingContributionsProps) {
  const [contributions, setContributions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const { getPendingContributions } = useCircleStore();
  const { getPendingContributions: getUIPending } = useUIStore();

  useEffect(() => {
    loadContributions();
  }, []);

  const loadContributions = async () => {
    try {
      setIsLoading(true);
      const data = await getPendingContributions();
      setContributions(data);
    } catch (error) {
      console.error('Failed to load pending contributions:', error);
    } finally {
      setIsLoading(false);
    }
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

  const handleContribute = async (contributionId: string) => {
    try {
      // Handle contribution logic
      console.log('Contributing to:', contributionId);
    } catch (error) {
      console.error('Failed to contribute:', error);
    }
  };

  const handleApprove = async (contributionId: string) => {
    try {
      // Handle approval logic
      console.log('Approving contribution:', contributionId);
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      case 'overdue':
        return <Badge variant="error">Overdue</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-500';
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'overdue':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getDaysUntilDue = (dueDate: bigint) => {
    const now = Date.now() / 1000;
    const due = Number(dueDate);
    const days = Math.ceil((due - now) / (24 * 60 * 60));
    return days;
  };

  const getUrgencyColor = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return 'text-red-500';
    if (daysUntilDue <= 1) return 'text-orange-500';
    if (daysUntilDue <= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getUrgencyBadge = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return <Badge variant="error">Overdue</Badge>;
    if (daysUntilDue <= 1) return <Badge variant="error">Urgent</Badge>;
    if (daysUntilDue <= 3) return <Badge variant="warning">Due Soon</Badge>;
    return <Badge variant="secondary">On Time</Badge>;
  };

  const toggleContributionDetails = (contributionId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [contributionId]: !prev[contributionId]
    }));
  };

  const displayedContributions = showAll 
    ? contributions 
    : contributions.slice(0, maxItems);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Pending Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Pending Contributions</span>
            {contributions.length > 0 && (
              <Badge variant="warning">{contributions.length}</Badge>
            )}
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
        {contributions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">No pending contributions</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {displayedContributions.map((contribution, index) => {
                  const daysUntilDue = getDaysUntilDue(contribution.dueDate);
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
                            {getUrgencyBadge(daysUntilDue)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {formatUSDC(contribution.amount)}
                            </span>
                            <span className={`text-xs ${getUrgencyColor(daysUntilDue)}`}>
                              {daysUntilDue < 0 ? 'Overdue' : `${daysUntilDue} days left`}
                            </span>
                            {showDetails && (
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
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-text-secondary mt-1">
                          Due: {formatDate(Number(contribution.dueDate))}
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
                                    <span className="text-text-secondary">Due Date:</span>
                                    <span className="font-medium ml-2">{formatDate(Number(contribution.dueDate))}</span>
                                  </div>
                                  <div>
                                    <span className="text-text-secondary">Status:</span>
                                    <span className="font-medium ml-2">{contribution.status}</span>
                                  </div>
                                </div>
                                
                                {showActions && (
                                  <div className="flex space-x-2 pt-2">
                                    {contribution.status === 'pending' && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleContribute(contribution.id)}
                                        className="flex-1"
                                      >
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        Contribute
                                      </Button>
                                    )}
                                    {contribution.needsApproval && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleApprove(contribution.id)}
                                        className="flex-1"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Approve
                                      </Button>
                                    )}
                                  </div>
                                )}
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

            {/* Show More/Less Button */}
            {contributions.length > maxItems && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Show Less' : `Show All (${contributions.length})`}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
