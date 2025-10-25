'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatDate, formatDuration } from '@/lib/utils';
import { 
  Activity, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Star, 
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

interface ActivityFeedProps {
  showFilters?: boolean;
  showPagination?: boolean;
  maxItems?: number;
  className?: string;
}

export function ActivityFeed({
  showFilters = true,
  showPagination = true,
  maxItems = 20,
  className = ''
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterType, setFilterType] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const { getActivityFeed } = useCircleStore();
  const { getActivityFeed: getUIActivity } = useUIStore();

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, filterType]);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      const data = await getActivityFeed();
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activity feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];

    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => Number(b.timestamp - a.timestamp));

    setFilteredActivities(filtered);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadActivities();
    } catch (error) {
      console.error('Failed to refresh activities:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'contribution':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'payout':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'circle_created':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'circle_joined':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'trust_score':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'yield':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'penalty':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'bonus':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'verification':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'contribution':
        return 'text-green-500';
      case 'payout':
        return 'text-blue-500';
      case 'circle_created':
        return 'text-purple-500';
      case 'circle_joined':
        return 'text-blue-500';
      case 'trust_score':
        return 'text-yellow-500';
      case 'yield':
        return 'text-green-500';
      case 'penalty':
        return 'text-red-500';
      case 'bonus':
        return 'text-yellow-500';
      case 'verification':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'contribution':
        return <Badge variant="success">Contribution</Badge>;
      case 'payout':
        return <Badge variant="secondary">Payout</Badge>;
      case 'circle_created':
        return <Badge variant="secondary">Circle Created</Badge>;
      case 'circle_joined':
        return <Badge variant="secondary">Circle Joined</Badge>;
      case 'trust_score':
        return <Badge variant="warning">Trust Score</Badge>;
      case 'yield':
        return <Badge variant="success">Yield</Badge>;
      case 'penalty':
        return <Badge variant="error">Penalty</Badge>;
      case 'bonus':
        return <Badge variant="success">Bonus</Badge>;
      case 'verification':
        return <Badge variant="secondary">Verification</Badge>;
      default:
        return <Badge variant="secondary">Activity</Badge>;
    }
  };

  const getActivityTypes = () => {
    const types = new Set(activities.map(activity => activity.type));
    return Array.from(types).sort();
  };

  const paginatedActivities = showPagination 
    ? filteredActivities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredActivities.slice(0, maxItems);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const toggleActivityDetails = (activityId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
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

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Activity Feed</span>
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
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            {getActivityTypes().map(type => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        )}

        {/* Activities */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">No activities found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {paginatedActivities.map((activity, index) => {
                const isExpanded = showDetails[activity.id];
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-surface-light transition-colors"
                  >
                    {/* Activity Icon */}
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{activity.title}</span>
                          {getActivityBadge(activity.type)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-text-secondary">
                            {formatDate(Number(activity.timestamp))}
                          </span>
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleActivityDetails(activity.id)}
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

                      <p className="text-sm text-text-secondary mt-1">{activity.description}</p>

                      {/* Activity Details */}
                      <AnimatePresence>
                        {isExpanded && activity.metadata && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 p-3 bg-surface-light rounded-lg"
                          >
                            <div className="space-y-2">
                              {Object.entries(activity.metadata).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                  <span className="text-text-secondary capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                  </span>
                                  <span className="font-medium">
                                    {typeof value === 'bigint' ? value.toString() : String(value)}
                                  </span>
                                </div>
                              ))}
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of {filteredActivities.length} activities
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
