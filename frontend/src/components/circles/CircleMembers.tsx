'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrustBadge } from '@/components/trust/TrustBadge';
import { AddressDisplay } from '@/components/ui/AddressDisplay';
import { useCircleStore } from '@/store';
import { formatUSDC, formatDate } from '@/lib/utils';
import { 
  Users, 
  User, 
  Shield, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Crown,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RotateCcw,
  UserPlus,
  UserMinus,
  Ban,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface CircleMember {
  address: string;
  trustScore: bigint;
  trustTier: number;
  contributionAmount: bigint;
  totalContributed: bigint;
  isActive: boolean;
  joinedAt: bigint;
  lastContributionAt?: bigint;
  isDefaulted: boolean;
  isLate: boolean;
  penaltyAmount: bigint;
  insuranceStaked: bigint;
  isCreator: boolean;
  isAdmin: boolean;
  memberIndex: number;
}

interface CircleMembersProps {
  circleId: bigint;
  circleAddress?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
  allowMemberManagement?: boolean;
  className?: string;
}

export function CircleMembers({
  circleId,
  circleAddress,
  showFilters = true,
  showSearch = true,
  showActions = true,
  allowMemberManagement = false,
  className = ''
}: CircleMembersProps) {
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<CircleMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'joined' | 'contribution' | 'trust' | 'status'>('joined');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'defaulted' | 'late'>('all');
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const { getCircleMembers, removeMember, banMember, unbanMember } = useCircleStore();

  useEffect(() => {
    loadMembers();
  }, [circleId, circleAddress]);

  useEffect(() => {
    filterAndSortMembers();
  }, [members, searchQuery, sortBy, sortDirection, filterStatus]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const circleMembers = await getCircleMembers(circleId);
      setMembers(circleMembers);
    } catch (error) {
      console.error('Failed to load circle members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMembers = () => {
    let filtered = [...members];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member => 
        member.address.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(member => {
        switch (filterStatus) {
          case 'active':
            return member.isActive && !member.isDefaulted;
          case 'defaulted':
            return member.isDefaulted;
          case 'late':
            return member.isLate;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'joined':
          comparison = Number(a.joinedAt - b.joinedAt);
          break;
        case 'contribution':
          comparison = Number(a.totalContributed - b.totalContributed);
          break;
        case 'trust':
          comparison = Number(a.trustScore - b.trustScore);
          break;
        case 'status':
          comparison = Number(a.isActive) - Number(b.isActive);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    setFilteredMembers(filtered);
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  const handleRemoveMember = async (memberAddress: string) => {
    try {
      await removeMember(circleId, memberAddress);
      await loadMembers();
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleBanMember = async (memberAddress: string) => {
    try {
      await banMember(circleId, memberAddress);
      await loadMembers();
    } catch (error) {
      console.error('Failed to ban member:', error);
    }
  };

  const handleUnbanMember = async (memberAddress: string) => {
    try {
      await unbanMember(circleId, memberAddress);
      await loadMembers();
    } catch (error) {
      console.error('Failed to unban member:', error);
    }
  };

  const toggleMemberDetails = (memberAddress: string) => {
    setShowDetails(prev => ({
      ...prev,
      [memberAddress]: !prev[memberAddress]
    }));
  };

  const getMemberStatus = (member: CircleMember) => {
    if (member.isDefaulted) return { label: 'Defaulted', variant: 'error' as const };
    if (member.isLate) return { label: 'Late', variant: 'warning' as const };
    if (member.isActive) return { label: 'Active', variant: 'success' as const };
    return { label: 'Inactive', variant: 'secondary' as const };
  };

  const getMemberIcon = (member: CircleMember) => {
    if (member.isCreator) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (member.isAdmin) return <Shield className="h-4 w-4 text-blue-500" />;
    if (member.isDefaulted) return <XCircle className="h-4 w-4 text-red-500" />;
    if (member.isLate) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    if (member.isActive) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <User className="h-4 w-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Circle Members</CardTitle>
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
            <Users className="h-5 w-5" />
            <span>Circle Members ({filteredMembers.length})</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadMembers}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          )}

          {/* Filters & Sort */}
          <div className="flex items-center space-x-2">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Members</option>
              <option value="active">Active</option>
              <option value="defaulted">Defaulted</option>
              <option value="late">Late</option>
            </select>

            {/* Sort */}
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange('joined')}
                className={sortBy === 'joined' ? 'border-primary text-primary' : ''}
              >
                {sortDirection === 'asc' ? (
                  <SortAsc className="h-3 w-3 mr-1" />
                ) : (
                  <SortDesc className="h-3 w-3 mr-1" />
                )}
                Joined
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange('contribution')}
                className={sortBy === 'contribution' ? 'border-primary text-primary' : ''}
              >
                Contribution
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange('trust')}
                className={sortBy === 'trust' ? 'border-primary text-primary' : ''}
              >
                Trust
              </Button>
            </div>
          </div>
        </div>

        {/* Members List */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">No members found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member, index) => {
                const status = getMemberStatus(member);
                const isExpanded = showDetails[member.address];
                
                return (
                  <motion.div
                    key={member.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-light transition-colors"
                  >
                    {/* Member Icon */}
                    <div className="flex-shrink-0">
                      {getMemberIcon(member)}
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AddressDisplay address={member.address} />
                          {member.isCreator && (
                            <Badge variant="warning" className="text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Creator
                            </Badge>
                          )}
                          {member.isAdmin && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          <Badge variant={status.variant} className="text-xs">
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrustBadge tier={member.trustTier} />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMemberDetails(member.address)}
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

                      {/* Member Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 p-3 bg-surface-light rounded-lg"
                          >
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-text-secondary">Trust Score:</span>
                                  <span className="font-medium">{member.trustScore.toString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-text-secondary">Contribution:</span>
                                  <span className="font-medium">{formatUSDC(member.contributionAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-text-secondary">Total Contributed:</span>
                                  <span className="font-medium">{formatUSDC(member.totalContributed)}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-text-secondary">Joined:</span>
                                  <span className="font-medium">{formatDate(Number(member.joinedAt))}</span>
                                </div>
                                {member.lastContributionAt && (
                                  <div className="flex justify-between">
                                    <span className="text-text-secondary">Last Contribution:</span>
                                    <span className="font-medium">{formatDate(Number(member.lastContributionAt))}</span>
                                  </div>
                                )}
                                {member.penaltyAmount > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-text-secondary">Penalty:</span>
                                    <span className="font-medium text-red-500">{formatUSDC(member.penaltyAmount)}</span>
                                  </div>
                                )}
                                {member.insuranceStaked > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-text-secondary">Insurance:</span>
                                    <span className="font-medium text-blue-500">{formatUSDC(member.insuranceStaked)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Actions */}
                    {showActions && allowMemberManagement && !member.isCreator && (
                      <div className="flex items-center space-x-1">
                        {member.isActive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.address)}
                            className="text-xs"
                          >
                            <UserMinus className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnbanMember(member.address)}
                            className="text-xs"
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Unban
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBanMember(member.address)}
                          className="text-xs"
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          Ban
                        </Button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
