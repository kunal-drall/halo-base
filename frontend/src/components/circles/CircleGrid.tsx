'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCard } from './CircleCard';
import { CircleFilters } from './CircleFilters';
import { Button } from '@/components/ui/Button';
import { useCircleStore } from '@/store';
import { CircleInfo } from '@/types';
import { 
  Grid3X3, 
  List, 
  SlidersHorizontal, 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  SortAsc as SortAscIcon,
  SortDesc as SortDescIcon
} from 'lucide-react';

interface CircleGridProps {
  circles: CircleInfo[];
  onJoin?: (circleId: bigint) => void;
  onView?: (circleId: bigint) => void;
  onFavorite?: (circleId: bigint) => void;
  favorites?: Set<string>;
  showFilters?: boolean;
  showSearch?: boolean;
  showSort?: boolean;
  showViewToggle?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
}

export function CircleGrid({
  circles,
  onJoin,
  onView,
  onFavorite,
  favorites = new Set(),
  showFilters = true,
  showSearch = true,
  showSort = true,
  showViewToggle = true,
  loading = false,
  emptyMessage = 'No circles found',
  emptyAction
}: CircleGridProps) {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    currentPage,
    itemsPerPage,
    totalPages,
    nextPage,
    prevPage,
    getFilteredCircles
  } = useCircleStore();

  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort circles
  const filteredCircles = useMemo(() => {
    let filtered = [...circles];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(circle => 
        circle.circleAddress.toLowerCase().includes(query) ||
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
        case 'members':
          comparison = Number(a.memberCount - b.memberCount);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [circles, searchQuery, filters, sortBy, sortDirection]);

  // Paginate results
  const paginatedCircles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCircles.slice(startIndex, endIndex);
  }, [filteredCircles, currentPage, itemsPerPage]);

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
      isPublic: undefined,
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== 'all'
  ) || searchQuery;

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-surface rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">
            Circles ({filteredCircles.length})
          </h2>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search circles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={hasActiveFilters ? 'border-primary text-primary' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {Object.values(filters).filter(v => v !== undefined && v !== 'all').length}
                </span>
              )}
            </Button>
          )}

          {/* Sort */}
          {showSort && (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange('newest')}
                className={sortBy === 'newest' ? 'border-primary text-primary' : ''}
              >
                {sortDirection === 'asc' ? (
                  <SortAscIcon className="h-4 w-4 mr-1" />
                ) : (
                  <SortDescIcon className="h-4 w-4 mr-1" />
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
                onClick={() => handleSortChange('members')}
                className={sortBy === 'members' ? 'border-primary text-primary' : ''}
              >
                Members
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
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFiltersPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CircleFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFiltersPanel(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredCircles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">{emptyMessage}</h3>
          <p className="text-text-secondary mb-6">
            {hasActiveFilters 
              ? 'Try adjusting your filters to see more results.'
              : 'Be the first to create a lending circle!'
            }
          </p>
          {emptyAction && (
            <Button onClick={emptyAction.onClick}>
              {emptyAction.label}
            </Button>
          )}
        </div>
      )}

      {/* Circles Grid/List */}
      {filteredCircles.length > 0 && (
        <>
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            <AnimatePresence mode="popLayout">
              {paginatedCircles.map((circle) => (
                <motion.div
                  key={circle.circleAddress}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <CircleCard
                    circleId={BigInt(circle.circleAddress)}
                    circleAddress={circle.circleAddress}
                    onJoin={onJoin}
                    onView={onView}
                    onFavorite={onFavorite}
                    isFavorite={favorites.has(circle.circleAddress)}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
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
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
