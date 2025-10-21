'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircleCard } from '@/components/circles/CircleCard';
import { useCircleFactory } from '@/hooks/useCircleFactory';
import { useAccount } from 'wagmi';
import { Connected } from '@coinbase/onchainkit';
import { Plus, Search, Filter } from 'lucide-react';

export default function CirclesPage() {
  const { isConnected } = useAccount();
  const { totalCircles, isLoadingTotal } = useCircleFactory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'forming' | 'active' | 'completed'>('all');

  // Generate mock circles for demonstration
  const mockCircles = Array.from({ length: Number(totalCircles || 0) }, (_, i) => BigInt(i + 1));

  const handleJoinCircle = (circleId: bigint) => {
    console.log('Join circle:', circleId);
    // TODO: Implement join circle logic
  };

  const handleViewCircle = (circleId: bigint) => {
    console.log('View circle:', circleId);
    // TODO: Navigate to circle details
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-text-secondary mb-8">
              Connect your wallet to view and join lending circles
            </p>
            <Button onClick={() => window.open('https://wallet.coinbase.com/', '_blank')}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Lending Circles</h1>
            <p className="text-text-secondary">
              Join community lending circles and build your trust score
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Circle</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search circles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-text-secondary" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'forming' | 'active' | 'completed')}
              className="px-3 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="forming">Forming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalCircles?.toString() || '0'}</div>
              <div className="text-sm text-text-secondary">Total Circles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-text-secondary">Active Circles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">$45.2K</div>
              <div className="text-sm text-text-secondary">Total Volume</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-text-secondary">Active Members</div>
            </CardContent>
          </Card>
        </div>

        {/* Circles Grid */}
        {isLoadingTotal ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-surface rounded w-3/4" />
                  <div className="h-3 bg-surface rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-surface rounded w-full" />
                    <div className="h-3 bg-surface rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : mockCircles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCircles.map((circleId) => (
              <CircleCard
                key={circleId.toString()}
                circleId={circleId}
                onJoin={handleJoinCircle}
                onView={handleViewCircle}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No Circles Found</h3>
              <p className="text-text-secondary mb-6">
                No lending circles match your current filters. Try adjusting your search or create a new circle.
              </p>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create First Circle</span>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
