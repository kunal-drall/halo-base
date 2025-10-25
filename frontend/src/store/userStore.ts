import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TrustData, TrustTier } from '@/types';

interface UserProfile {
  address: string;
  basename?: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  preferences: {
    currency: 'USD' | 'EUR' | 'GBP';
    language: 'en' | 'es' | 'fr' | 'de';
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  onboarding: {
    completed: boolean;
    steps: {
      walletConnected: boolean;
      profileCreated: boolean;
      trustScoreRegistered: boolean;
      firstCircleJoined: boolean;
    };
  };
}

interface UserState {
  // User data
  profile: UserProfile | null;
  isConnected: boolean;
  isOnboarding: boolean;
  
  // Trust score data
  trustData: TrustData | null;
  trustTier: TrustTier | null;
  trustScore: number;
  
  // Activity data
  totalContributions: bigint;
  totalPayouts: bigint;
  totalYieldEarned: bigint;
  activeCircles: number;
  completedCircles: number;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
    action?: {
      label: string;
      url: string;
    };
  }>;
  unreadCount: number;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setConnected: (connected: boolean) => void;
  setOnboarding: (onboarding: boolean) => void;
  
  setTrustData: (trustData: TrustData) => void;
  updateTrustData: (updates: Partial<TrustData>) => void;
  setTrustTier: (tier: TrustTier) => void;
  setTrustScore: (score: number) => void;
  
  setActivity: (activity: {
    totalContributions: bigint;
    totalPayouts: bigint;
    totalYieldEarned: bigint;
    activeCircles: number;
    completedCircles: number;
  }) => void;
  
  addNotification: (notification: Omit<UserState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  setLoading: (loading: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Onboarding actions
  completeOnboardingStep: (step: keyof UserProfile['onboarding']['steps']) => void;
  isOnboardingStepCompleted: (step: keyof UserProfile['onboarding']['steps']) => boolean;
  getOnboardingProgress: () => number;
  
  // Computed getters
  getDisplayName: () => string;
  getTrustTierColor: () => string;
  getTrustTierIcon: () => string;
}

const defaultProfile: UserProfile = {
  address: '',
  preferences: {
    currency: 'USD',
    language: 'en',
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
  onboarding: {
    completed: false,
    steps: {
      walletConnected: false,
      profileCreated: false,
      trustScoreRegistered: false,
      firstCircleJoined: false,
    },
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      isConnected: false,
      isOnboarding: false,
      
      trustData: null,
      trustTier: null,
      trustScore: 0,
      
      totalContributions: BigInt(0),
      totalPayouts: BigInt(0),
      totalYieldEarned: BigInt(0),
      activeCircles: 0,
      completedCircles: 0,
      
      notifications: [],
      unreadCount: 0,
      
      isLoading: false,
      isUpdating: false,
      
      error: null,
      
      // Actions
      setProfile: (profile) => set({ profile }),
      
      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null,
      })),
      
      setConnected: (connected) => set({ isConnected: connected }),
      
      setOnboarding: (onboarding) => set({ isOnboarding: onboarding }),
      
      setTrustData: (trustData) => set({ trustData }),
      
      updateTrustData: (updates) => set((state) => ({
        trustData: state.trustData ? { ...state.trustData, ...updates } : null,
      })),
      
      setTrustTier: (tier) => set({ trustTier: tier }),
      
      setTrustScore: (score) => set({ trustScore: score }),
      
      setActivity: (activity) => set(activity),
      
      addNotification: (notification) => set((state) => {
        const newNotification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: Date.now(),
          read: false,
        };
        return {
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        };
      }),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(notification =>
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true,
        })),
        unreadCount: 0,
      })),
      
      removeNotification: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        return {
          notifications: state.notifications.filter(n => n.id !== id),
          unreadCount: notification && !notification.read 
            ? Math.max(0, state.unreadCount - 1) 
            : state.unreadCount,
        };
      }),
      
      clearNotifications: () => set({ 
        notifications: [], 
        unreadCount: 0 
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setUpdating: (updating) => set({ isUpdating: updating }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      // Onboarding actions
      completeOnboardingStep: (step) => set((state) => {
        if (!state.profile) return state;
        
        const updatedSteps = { ...state.profile.onboarding.steps, [step]: true };
        const allStepsCompleted = Object.values(updatedSteps).every(completed => completed);
        
        return {
          profile: {
            ...state.profile,
            onboarding: {
              ...state.profile.onboarding,
              steps: updatedSteps,
              completed: allStepsCompleted,
            },
          },
        };
      }),
      
      isOnboardingStepCompleted: (step) => {
        const state = get();
        return state.profile?.onboarding.steps[step] || false;
      },
      
      getOnboardingProgress: () => {
        const state = get();
        if (!state.profile) return 0;
        
        const steps = Object.values(state.profile.onboarding.steps);
        const completedSteps = steps.filter(completed => completed).length;
        return (completedSteps / steps.length) * 100;
      },
      
      // Computed getters
      getDisplayName: () => {
        const state = get();
        if (!state.profile) return 'Anonymous';
        
        return state.profile.basename || 
               state.profile.address.slice(0, 6) + '...' + state.profile.address.slice(-4);
      },
      
      getTrustTierColor: () => {
        const state = get();
        switch (state.trustTier) {
          case TrustTier.PLATINUM:
            return 'text-purple-600';
          case TrustTier.GOLD:
            return 'text-yellow-600';
          case TrustTier.SILVER:
            return 'text-gray-600';
          case TrustTier.NEWCOMER:
            return 'text-blue-600';
          default:
            return 'text-gray-400';
        }
      },
      
      getTrustTierIcon: () => {
        const state = get();
        switch (state.trustTier) {
          case TrustTier.PLATINUM:
            return '💎';
          case TrustTier.GOLD:
            return '🥇';
          case TrustTier.SILVER:
            return '🥈';
          case TrustTier.NEWCOMER:
            return '🆕';
          default:
            return '❓';
        }
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        profile: state.profile,
        preferences: state.profile?.preferences,
        onboarding: state.profile?.onboarding,
        notifications: state.notifications.slice(0, 50), // Keep only recent notifications
      }),
    }
  )
);
