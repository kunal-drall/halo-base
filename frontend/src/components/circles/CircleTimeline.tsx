'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCircleStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { 
  Circle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  StarOff,
  Eye,
  EyeOff
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'creation' | 'member_joined' | 'member_left' | 'contribution' | 'payout' | 'cycle_start' | 'cycle_end' | 'default' | 'penalty' | 'yield' | 'insurance';
  timestamp: bigint;
  user?: string;
  amount?: bigint;
  description: string;
  status?: 'pending' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

interface CircleTimelineProps {
  circleId: bigint;
  circleAddress?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  maxEvents?: number;
  className?: string;
}

export function CircleTimeline({
  circleId,
  circleAddress,
  showFilters = true,
  showPagination = true,
  maxEvents = 50,
  className = ''
}: CircleTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);
  const [filterType, setFilterType] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const { getCircleEvents } = useCircleStore();

  useEffect(() => {
    loadEvents();
  }, [circleId, circleAddress]);

  useEffect(() => {
    filterEvents();
  }, [events, filterType]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const circleEvents = await getCircleEvents(circleId);
      setEvents(circleEvents);
    } catch (error) {
      console.error('Failed to load circle events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => Number(b.timestamp - a.timestamp));

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const getEventIcon = (type: string, status?: string) => {
    const iconClass = "h-4 w-4";
    
    switch (type) {
      case 'creation':
        return <Circle className={`${iconClass} text-green-500`} />;
      case 'member_joined':
        return <Users className={`${iconClass} text-blue-500`} />;
      case 'member_left':
        return <Users className={`${iconClass} text-red-500`} />;
      case 'contribution':
        return <DollarSign className={`${iconClass} text-green-500`} />;
      case 'payout':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'cycle_start':
        return <Calendar className={`${iconClass} text-blue-500`} />;
      case 'cycle_end':
        return <Calendar className={`${iconClass} text-purple-500`} />;
      case 'default':
        return <AlertTriangle className={`${iconClass} text-red-500`} />;
      case 'penalty':
        return <AlertTriangle className={`${iconClass} text-orange-500`} />;
      case 'yield':
        return <TrendingUp className={`${iconClass} text-green-500`} />;
      case 'insurance':
        return <Shield className={`${iconClass} text-blue-500`} />;
      default:
        return <Circle className={`${iconClass} text-gray-500`} />;
    }
  };

  const getEventColor = (type: string, status?: string) => {
    if (status === 'failed') return 'text-red-500';
    if (status === 'pending') return 'text-yellow-500';
    
    switch (type) {
      case 'creation':
      case 'member_joined':
      case 'contribution':
      case 'payout':
      case 'yield':
        return 'text-green-500';
      case 'member_left':
      case 'default':
      case 'penalty':
        return 'text-red-500';
      case 'cycle_start':
      case 'cycle_end':
        return 'text-blue-500';
      case 'insurance':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getEventBadge = (type: string, status?: string) => {
    if (status === 'failed') return <Badge variant="error">Failed</Badge>;
    if (status === 'pending') return <Badge variant="warning">Pending</Badge>;
    
    switch (type) {
      case 'creation':
        return <Badge variant="success">Created</Badge>;
      case 'member_joined':
        return <Badge variant="success">Joined</Badge>;
      case 'member_left':
        return <Badge variant="error">Left</Badge>;
      case 'contribution':
        return <Badge variant="success">Contributed</Badge>;
      case 'payout':
        return <Badge variant="success">Paid Out</Badge>;
      case 'cycle_start':
        return <Badge variant="secondary">Cycle Started</Badge>;
      case 'cycle_end':
        return <Badge variant="secondary">Cycle Ended</Badge>;
      case 'default':
        return <Badge variant="error">Default</Badge>;
      case 'penalty':
        return <Badge variant="warning">Penalty</Badge>;
      case 'yield':
        return <Badge variant="success">Yield</Badge>;
      case 'insurance':
        return <Badge variant="secondary">Insurance</Badge>;
      default:
        return <Badge variant="secondary">Event</Badge>;
    }
  };

  const getEventDescription = (event: TimelineEvent) => {
    let description = event.description;
    
    if (event.amount) {
      description += ` (${formatUSDC(event.amount)})`;
    }
    
    if (event.user) {
      description += ` by ${event.user.slice(0, 6)}...${event.user.slice(-4)}`;
    }
    
    return description;
  };

  const toggleEventDetails = (eventId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const getEventTypes = () => {
    const types = new Set(events.map(event => event.type));
    return Array.from(types).sort();
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'creation':
        return 'Creation';
      case 'member_joined':
        return 'Members Joined';
      case 'member_left':
        return 'Members Left';
      case 'contribution':
        return 'Contributions';
      case 'payout':
        return 'Payouts';
      case 'cycle_start':
        return 'Cycle Start';
      case 'cycle_end':
        return 'Cycle End';
      case 'default':
        return 'Defaults';
      case 'penalty':
        return 'Penalties';
      case 'yield':
        return 'Yield';
      case 'insurance':
        return 'Insurance';
      default:
        return 'All Events';
    }
  };

  const paginatedEvents = showPagination 
    ? filteredEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage)
    : filteredEvents.slice(0, maxEvents);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Circle Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
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
          <CardTitle>Circle Timeline</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadEvents}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Refresh
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
              className="text-xs"
            >
              All Events
            </Button>
            {getEventTypes().map(type => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
                className="text-xs"
              >
                {getEventTypeLabel(type)}
              </Button>
            ))}
          </div>
        )}

        {/* Timeline */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Circle className="h-12 w-12 mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">No events found</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {paginatedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-surface-light transition-colors"
                >
                  {/* Event Icon */}
                  <div className="flex-shrink-0">
                    {getEventIcon(event.type, event.status)}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {getEventDescription(event)}
                        </span>
                        {getEventBadge(event.type, event.status)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-text-secondary">
                          {formatDate(Number(event.timestamp))}
                        </span>
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEventDetails(event.id)}
                            className="p-1"
                          >
                            {showDetails[event.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Event Details */}
                    <AnimatePresence>
                      {showDetails[event.id] && event.metadata && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 p-3 bg-surface-light rounded-lg"
                        >
                          <div className="space-y-2">
                            {Object.entries(event.metadata).map(([key, value]) => (
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
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-text-secondary">
              Showing {((currentPage - 1) * eventsPerPage) + 1} to {Math.min(currentPage * eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
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
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
