'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useTrustScoreStore } from '@/store';
import { formatDate, formatDuration } from '@/lib/utils';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  RefreshCw, 
  Filter, 
  Search, 
  Calendar, 
  Activity, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Eye, 
  EyeOff, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Star, 
  Shield, 
  Award, 
  Target, 
  Zap, 
  Users, 
  DollarSign, 
  Settings
} from 'lucide-react';

interface TrustScoreHistoryProps {
  address?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  showChart?: boolean;
  maxEntries?: number;
  className?: string;
}

export function TrustScoreHistory({
  address,
  showFilters = true,
  showPagination = true,
  showChart = true,
  maxEntries = 50,
  className = ''
}: TrustScoreHistoryProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const {
    trustScore,
    trustTier,
    isRegistered,
    isLoading: isLoadingTrust
  } = useTrustScore(address);

  const {
    getTrustScoreHistory,
    refreshTrustScore
  } = useTrustScoreStore();

  useEffect(() => {
    if (isRegistered) {
      loadHistory();
    }
  }, [address, isRegistered]);

  useEffect(() => {
    filterHistory();
  }, [history, filterType, searchQuery]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getTrustScoreHistory(address);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load trust history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHistory = () => {
    let filtered = [...history];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.reason.toLowerCase().includes(query) ||
        entry.type.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(entry => entry.type === filterType);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => Number(b.timestamp - a.timestamp));

    setFilteredHistory(filtered);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    try {
      await refreshTrustScore(address);
      await loadHistory();
    } catch (error) {
      console.error('Failed to refresh trust history:', error);
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getChangeBadge = (change: number) => {
    if (change > 0) return <Badge variant="success">+{change}</Badge>;
    if (change < 0) return <Badge variant="error">{change}</Badge>;
    return <Badge variant="secondary">0</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'contribution':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'payment':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'social':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'defi':
        return <Activity className="h-4 w-4 text-orange-500" />;
      case 'community':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'penalty':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'bonus':
        return <Award className="h-4 w-4 text-green-500" />;
      case 'verification':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'contribution':
        return 'Contribution';
      case 'payment':
        return 'Payment';
      case 'social':
        return 'Social';
      case 'defi':
        return 'DeFi';
      case 'community':
        return 'Community';
      case 'penalty':
        return 'Penalty';
      case 'bonus':
        return 'Bonus';
      case 'verification':
        return 'Verification';
      default:
        return type;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'contribution':
        return <Badge variant="success">Contribution</Badge>;
      case 'payment':
        return <Badge variant="secondary">Payment</Badge>;
      case 'social':
        return <Badge variant="secondary">Social</Badge>;
      case 'defi':
        return <Badge variant="secondary">DeFi</Badge>;
      case 'community':
        return <Badge variant="secondary">Community</Badge>;
      case 'penalty':
        return <Badge variant="error">Penalty</Badge>;
      case 'bonus':
        return <Badge variant="success">Bonus</Badge>;
      case 'verification':
        return <Badge variant="secondary">Verification</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getHistoryTypes = () => {
    const types = new Set(history.map(entry => entry.type));
    return Array.from(types).sort();
  };

  const paginatedHistory = showPagination 
    ? filteredHistory.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
    : filteredHistory.slice(0, maxEntries);

  const totalPages = Math.ceil(filteredHistory.length / entriesPerPage);

  const toggleEntryDetails = (entryId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };

  if (loading || isLoadingTrust) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Trust Score History</CardTitle>
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
        <CardContent className="p-6 text-center text-text-secondary">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>Address not registered with Trust Score Manager</p>
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
            <span>Trust Score History</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
                className="text-xs"
              >
                All
              </Button>
              {getHistoryTypes().map(type => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className="text-xs"
                >
                  {getTypeLabel(type)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">No history found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {paginatedHistory.map((entry, index) => {
                const isExpanded = showDetails[entry.id];
                
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-light transition-colors"
                  >
                    {/* Change Icon */}
                    <div className="flex-shrink-0">
                      {getChangeIcon(entry.change)}
                    </div>

                    {/* Type Icon */}
                    <div className="flex-shrink-0">
                      {getTypeIcon(entry.type)}
                    </div>

                    {/* Entry Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{entry.reason}</span>
                          {getTypeBadge(entry.type)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className={`font-medium ${getChangeColor(entry.change)}`}>
                              {entry.change > 0 ? '+' : ''}{entry.change}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {formatDate(Number(entry.timestamp))}
                            </div>
                          </div>
                          {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleEntryDetails(entry.id)}
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

                      {/* Entry Details */}
                      <AnimatePresence>
                        {isExpanded && entry.metadata && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 p-3 bg-surface-light rounded-lg"
                          >
                            <div className="space-y-2">
                              {Object.entries(entry.metadata).map(([key, value]) => (
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
              Showing {((currentPage - 1) * entriesPerPage) + 1} to {Math.min(currentPage * entriesPerPage, filteredHistory.length)} of {filteredHistory.length} entries
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
