'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CreateCircleForm } from '@/components/circles/CreateCircleForm';
import { useContractIntegration } from '@/hooks/useContractIntegration';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useCircles } from '@/hooks/useCircles';
import { useCircleStore, useUserStore, useTrustScoreStore, useUIStore } from '@/store';
import { formatUSDC, formatDate, formatDuration } from '@/lib/utils';
import { PayoutMethod } from '@/types';
import { 
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

export default function CreatePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [createdCircleId, setCreatedCircleId] = useState<bigint | null>(null);

  const { isRegistered, hasBalance, trustScore } = useContractIntegration();
  const { trustScore: userTrustScore, trustTier, trustMetrics } = useTrustScore();
  const { circles, isLoading: isLoadingCircles } = useCircles();

  const { 
    createCircle, 
    getCircleDetails,
    getCircleStats,
    getCircleMembers,
    getCircleTimeline
  } = useCircleStore();

  const { 
    createCircle: createUICircle, 
    getCircleDetails: getUICircleDetails,
    getCircleStats: getUICircleStats,
    getCircleMembers: getUICircleMembers,
    getCircleTimeline: getUICircleTimeline
  } = useUIStore();

  const handleCircleCreated = async (circleId: bigint) => {
    try {
      setIsCreating(true);
      setCreatedCircleId(circleId);
      
      // Redirect to the created circle after a short delay
      setTimeout(() => {
        router.push(`/circles/${circleId}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to handle circle creation:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleViewCircle = () => {
    if (createdCircleId) {
      router.push(`/circles/${createdCircleId}`);
    }
  };

  if (isLoadingCircles) {
    return (
      <DashboardLayout>
        <div className="p-4 space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-surface rounded"></div>
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
                You need to register with the Trust Score Manager to create circles.
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

  if (!hasBalance) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Insufficient Balance</h2>
              <p className="text-text-secondary mb-4">
                You need USDC to create lending circles. Please mint some test USDC first.
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

  if (createdCircleId) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Circle Created Successfully!</h2>
              <p className="text-text-secondary mb-4">
                Your lending circle has been created and is ready for members to join.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button onClick={handleViewCircle}>
                  View Circle
                </Button>
                <Button variant="outline" onClick={handleBackToDashboard}>
                  Back to Dashboard
                </Button>
              </div>
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
            <h1 className="text-2xl font-bold">Create Circle</h1>
            <p className="text-text-secondary">Set up your lending circle with our guided wizard.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Trust Score Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Your Trust Score</span>
                </div>
                <div className="text-2xl font-bold text-green-500">
                  {trustScore?.toString() || '0'}
                </div>
                <Badge variant="success">Tier {trustTier || 0}</Badge>
              </div>
              <div className="text-sm text-text-secondary">
                Higher trust scores allow you to create circles with lower minimum trust requirements
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Circle Form */}
        <CreateCircleForm
          onSuccess={handleCircleCreated}
          onCancel={handleBackToDashboard}
          userTrustScore={trustScore || 0n}
          userTrustTier={trustTier || 0}
          isLoading={isCreating}
        />

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Creating Your First Circle?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Circle Basics</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Set a contribution amount that members can afford</li>
                  <li>• Choose a cycle duration that works for your group</li>
                  <li>• Set trust requirements to ensure reliable members</li>
                  <li>• Decide on payout method (auction, lottery, or rotation)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Best Practices</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Start with smaller amounts to build trust</li>
                  <li>• Use shorter cycles for first-time groups</li>
                  <li>• Set reasonable trust tier requirements</li>
                  <li>• Consider insurance options for protection</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}