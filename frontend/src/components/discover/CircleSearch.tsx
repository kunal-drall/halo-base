'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCircles } from '@/hooks/useCircles';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { PayoutMethod } from '@/types';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List, 
  RefreshCw, 
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

interface CircleSearchProps {
  onCircleSelect?: (circleId: bigint) => void;
  onJoinCircle?: (circleId: bigint) => void;
  showFilters?: boolean;
  showSort?: boolean;
  showViewToggle?: boolean;
  maxResults?: number;
  className?: string;
}

export function CircleSearch({
  onCircleSelect,
  onJoinCircle,
  showFilters = true,
  showSort = true,
  showViewToggle = true,
  maxResults = 50,
  className = ''
}: CircleSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'amount' | 'members'>('relevance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { circles, isLoading: isLoadingCircles } = useCircles();
  const { isRegistered, hasBalance, trustScore } = useContractIntegration();

  const { 
    searchCircles, 
    getPublicCircles, 
    joinCircle, 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline
  } = useCircleStore();

  const { 
    searchCircles: searchUICircles, 
    getPublicCircles: getUIPublic, 
    joinCircle: joinUICircle, 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline
  } = useUIStore();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      performSearch();
    } else {
      setSearchResults([]);
      setSuggestions([]);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    try {
      setIsSearching(true);
      const results = await searchCircles(searchQuery, {
        sortBy,
        sortDirection,
        maxResults
      });
      setSearchResults(results);
      setSuggestions(results.slice(0, 5)); // Show top 5 as suggestions
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (circle: any) => {
    setSearchQuery(circle.name || `Circle #${circle.id}`);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onCircleSelect?.(circle.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleJoinCircle = async (circleId: bigint) => {
    try {
      await joinCircle(circleId);
      onJoinCircle?.(circleId);
      // Refresh search results
      await performSearch();
    } catch (error) {
      console.error('Failed to join circle:', error);
    }
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
    performSearch();
  };

  const getSortIcon = (sortType: typeof sortBy) => {
    if (sortType !== sortBy) return null;
    return sortDirection === 'asc' ? (
      <SortAsc className="h-4 w-4" />
    ) : (
      <SortDesc className="h-4 w-4" />
    );
  };

  const getCircleStatus = (circle: any) => {
    if (!circle.isActive) return 'completed';
    if (circle.memberCount < circle.params.maxMembers) return 'forming';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'forming':
        return <Badge variant="warning">Forming</Badge>;
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'forming':
        return 'text-yellow-500';
      case 'active':
        return 'text-green-500';
      case 'completed':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search circles by name, description, or creator..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(searchQuery.length >= 2)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <RefreshCw className="h-4 w-4 animate-spin text-text-secondary" />
            </div>
          )}
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {suggestions.map((circle, index) => {
                const status = getCircleStatus(circle);
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={circle.id}
                    onClick={() => handleSuggestionClick(circle)}
                    className={`w-full p-3 text-left hover:bg-surface-light transition-colors ${
                      isSelected ? 'bg-surface-light' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {circle.name || `Circle #${circle.id}`}
                        </div>
                        <div className="text-xs text-text-secondary truncate">
                          {circle.description || 'No description'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        {getStatusBadge(status)}
                        <span className="text-xs text-text-secondary">
                          {formatUSDC(circle.params.contributionAmount)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Sort Options */}
          {showSort && (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange('relevance')}
                className={sortBy === 'relevance' ? 'border-primary text-primary' : ''}
              >
                {getSortIcon('relevance')}
                <span className="ml-1">Relevance</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange('newest')}
                className={sortBy === 'newest' ? 'border-primary text-primary' : ''}
              >
                {getSortIcon('newest')}
                <span className="ml-1">Newest</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange('amount')}
                className={sortBy === 'amount' ? 'border-primary text-primary' : ''}
              >
                {getSortIcon('amount')}
                <span className="ml-1">Amount</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange('members')}
                className={sortBy === 'members' ? 'border-primary text-primary' : ''}
              >
                {getSortIcon('members')}
                <span className="ml-1">Members</span>
              </Button>
            </div>
          )}

          {/* View Toggle */}
          {showViewToggle && (
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
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-text-secondary">
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto text-text-secondary mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-text-secondary">
                  Try adjusting your search terms or filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              <AnimatePresence mode="popLayout">
                {searchResults.map((circle, index) => {
                  const status = getCircleStatus(circle);
                  
                  return (
                    <motion.div
                      key={circle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate">
                                {circle.name || `Circle #${circle.id}`}
                              </h3>
                              <p className="text-sm text-text-secondary line-clamp-2">
                                {circle.description || 'No description available'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              {getStatusBadge(status)}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-text-secondary">Contribution</div>
                              <div className="font-medium">
                                {formatUSDC(circle.params.contributionAmount)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-text-secondary">Duration</div>
                              <div className="font-medium">
                                {formatDuration(Number(circle.params.cycleDuration))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-text-secondary">Members</div>
                              <div className="font-medium">
                                {circle.memberCount}/{circle.params.maxMembers}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-text-secondary">Trust Tier</div>
                              <div className="font-medium">
                                {circle.params.minTrustTier}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-text-secondary">
                              Created {formatDate(Number(circle.createdAt))}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onCircleSelect?.(circle.id)}
                              >
                                View
                              </Button>
                              {status === 'forming' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleJoinCircle(circle.id)}
                                >
                                  Join
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
