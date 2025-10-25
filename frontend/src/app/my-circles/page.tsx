'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CircleGrid } from '@/components/circles/CircleGrid';
import { CircleFilters } from '@/components/circles/CircleFilters';
import { CircleCard } from '@/components/circles/CircleCard';
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

export default function MyCirclesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount' | 'duration' | 'status'>('newest');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCircle, setSelectedCircle] = useState<bigint | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isJoining, setIsJoining] = useState<Record<string, boolean>>({});

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScore, trustTier, trustMetrics } = useTrustScore();

  const { 
    getMyCircles, 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline,
    joinCircle,
    leaveCircle,
    contributeToCircle
  } = useCircleStore();

  const { 
    getMyCircles: getUIMyCircles, 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline,
    joinCircle: joinUICircle,
    leaveCircle: leaveUICircle,
    contributeToCircle: contributeUICircle
  } = useUIStore();

  const [myCircles, setMyCircles] = useState<any[]>([]);
  const [filteredCircles, setFilteredCircles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    minAmount: undefined as bigint | undefined,
    maxAmount: undefined as bigint | undefined,
    minDuration: undefined as bigint | undefined,
    maxDuration: undefined as bigint | undefined,
    minTrustTier: undefined as number | undefined,
    status: 'all' as 'all' | 'forming' | 'active' | 'completed',
    payoutMethod: undefined as PayoutMethod | undefined,
    isPublic: undefined as boolean | undefined
  });

  useEffect(() => {
    if (isRegistered) {
      loadMyCircles();
    }
  }, [isRegistered]);

  useEffect(() => {
    filterAndSortCircles();
  }, [myCircles, searchQuery, sortBy, sortDirection, filters]);

  const loadMyCircles = async () => {
    try {
      setIsLoading(true);
      const data = await getMyCircles();
      setMyCircles(data);
    } catch (error) {
      console.error('Failed to load my circles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortCircles = () => {
    let filtered = [...myCircles];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(circle => 
        circle.name?.toLowerCase().includes(query) ||
        circle.description?.toLowerCase().includes(query) ||
        circle.creator.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(circle => 
        circle.params.contributionAmount >= filters.minAmount!
      );
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(circle => 
        circle.params.contributionAmount <= filters.maxAmount!
      );
    }

    if (filters.minDuration !== undefined) {
      filtered = filtered.filter(circle => 
        circle.params.cycleDuration >= filters.minDuration!
      );
    }

    if (filters.maxDuration !== undefined) {
      filtered = filtered.filter(circle => 
        circle.params.cycleDuration <= filters.maxDuration!
      );
    }

    if (filters.minTrustTier !== undefined) {
      filtered = filtered.filter(circle => 
        circle.params.minTrustTier <= filters.minTrustTier!
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(circle => {
        switch (filters.status) {
          case 'forming':
            return circle.memberCount < circle.params.maxMembers;
          case 'active':
            return circle.isActive && circle.memberCount === circle.params.maxMembers;
          case 'completed':
            return !circle.isActive;
          default:
            return true;
        }
      });
    }

    if (filters.payoutMethod !== undefined) {
      filtered = filtered.filter(circle => 
        circle.params.payoutMethod === filters.payoutMethod
      );
    }

    if (filters.isPublic !== undefined) {
      filtered = filtered.filter(circle => 
        circle.params.isPublic === filters.isPublic
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'newest':
          comparison = Number(b.createdAt - a.createdAt);
          break;
        case 'oldest':
          comparison = Number(a.createdAt - b.createdAt);
          break;
        case 'amount':
          comparison = Number(a.params.contributionAmount - b.params.contributionAmount);
          break;
        case 'duration':
          comparison = Number(a.params.cycleDuration - b.params.cycleDuration);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    setFilteredCircles(filtered);
  };

  const handleJoinCircle = async (circleId: bigint) => {
    try {
      setIsJoining(prev => ({ ...prev, [circleId.toString()]: true }));
      await joinCircle(circleId);
      await loadMyCircles();
    } catch (error) {
      console.error('Failed to join circle:', error);
    } finally {
      setIsJoining(prev => ({ ...prev, [circleId.toString()]: false }));
    }
  };

  const handleLeaveCircle = async (circleId: bigint) => {
    try {
      await leaveCircle(circleId);
      await loadMyCircles();
    } catch (error) {
      console.error('Failed to leave circle:', error);
    }
  };

  const handleContribute = async (circleId: bigint, amount: bigint) => {
    try {
      await contributeToCircle(circleId, amount);
      await loadMyCircles();
    } catch (error) {
      console.error('Failed to contribute:', error);
    }
  };

  const handleViewCircle = (circleId: bigint) => {
    setSelectedCircle(circleId);
    router.push(`/circles/${circleId}`);
  };

  const handleFavorite = (circleId: bigint) => {
    const circleIdStr = circleId.toString();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(circleIdStr)) {
        newFavorites.delete(circleIdStr);
      } else {
        newFavorites.add(circleIdStr);
      }
      return newFavorites;
    });
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadMyCircles();
    } catch (error) {
      console.error('Failed to refresh circles:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  const handleClearFilters = () => {
    setFilters({
      minAmount: undefined,
      maxAmount: undefined,
      minDuration: undefined,
      maxDuration: undefined,
      minTrustTier: undefined,
      status: 'all',
      payoutMethod: undefined,
      isPublic: undefined
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== 'all'
  ) || searchQuery;

  if (isLoading || isLoadingCircles) {
    return (
      <DashboardLayout>
        <div className="p-4 space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
                You need to register with the Trust Score Manager to view your circles.
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
            <h1 className="text-2xl font-bold">My Circles</h1>
            <p className="text-text-secondary">Manage your lending circles and contributions.</p>
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
            <Button onClick={() => router.push('/create')}>
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
                  <p className="text-2xl font-bold">{myCircles.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Active Circles</p>
                  <p className="text-2xl font-bold">
                    {myCircles.filter(c => c.isActive).length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total Contributions</p>
                  <p className="text-2xl font-bold">
                    {formatUSDC(myCircles.reduce((sum, c) => sum + (c.totalContributed || 0n), 0n))}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Completed</p>
                  <p className="text-2xl font-bold">
                    {myCircles.filter(c => !c.isActive).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search my circles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2">
                {/* Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={hasActiveFilters ? 'border-primary text-primary' : ''}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {Object.values(filters).filter(v => v !== undefined && v !== 'all').length}
                    </Badge>
                  )}
                </Button>

                {/* Sort */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSortChange('newest')}
                    className={sortBy === 'newest' ? 'border-primary text-primary' : ''}
                  >
                    {sortDirection === 'asc' ? (
                      <SortAsc className="h-4 w-4 mr-1" />
                    ) : (
                      <SortDesc className="h-4 w-4 mr-1" />
                    )}
                    Newest
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSortChange('amount')}
                    className={sortBy === 'amount' ? 'border-primary text-primary' : ''}
                  >
                    Amount
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSortChange('status')}
                    className={sortBy === 'status' ? 'border-primary text-primary' : ''}
                  >
                    Status
                  </Button>
                </div>

                {/* View Toggle */}
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm text-text-secondary">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary">Search: {searchQuery}</Badge>
                )}
                {filters.minAmount && (
                  <Badge variant="secondary">Min: {formatUSDC(filters.minAmount)}</Badge>
                )}
                {filters.maxAmount && (
                  <Badge variant="secondary">Max: {formatUSDC(filters.maxAmount)}</Badge>
                )}
                {filters.minTrustTier !== undefined && (
                  <Badge variant="secondary">Tier: {filters.minTrustTier}</Badge>
                )}
                {filters.status !== 'all' && (
                  <Badge variant="secondary">Status: {filters.status}</Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CircleFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {filteredCircles.length} Circle{filteredCircles.length !== 1 ? 's' : ''} Found
            </h2>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Circles Grid */}
          {filteredCircles.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-text-secondary mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Circles Found</h3>
                <p className="text-text-secondary mb-4">
                  {hasActiveFilters 
                    ? 'Try adjusting your filters to see more results.'
                    : 'You haven\'t joined any circles yet.'
                  }
                </p>
                <Button onClick={() => router.push('/discover')}>
                  <Search className="h-4 w-4 mr-2" />
                  Discover Circles
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              <AnimatePresence mode="popLayout">
                {filteredCircles.map((circle, index) => (
                  <motion.div
                    key={circle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <CircleCard
                      circleId={circle.id}
                      circleAddress={circle.address}
                      onJoin={handleJoinCircle}
                      onLeave={handleLeaveCircle}
                      onView={handleViewCircle}
                      onFavorite={handleFavorite}
                      isFavorite={favorites.has(circle.id.toString())}
                      variant={viewMode === 'list' ? 'compact' : 'default'}
                      showActions={true}
                      showContribution={true}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
