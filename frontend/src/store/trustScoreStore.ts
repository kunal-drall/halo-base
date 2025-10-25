import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TrustData, TrustTier, TrustScoreBreakdown, TrustScoreHistory } from '@/types';

interface TrustScoreState {
  // Trust score data
  trustData: TrustData | null;
  trustScore: number;
  trustTier: TrustTier | null;
  scoreBreakdown: TrustScoreBreakdown | null;
  history: TrustScoreHistory[];
  
  // Score components
  paymentScore: number;
  completionScore: number;
  defiScore: number;
  socialScore: number;
  
  // Historical data
  scoreHistory: Array<{
    timestamp: number;
    score: number;
    tier: TrustTier;
    reason: string;
  }>;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  isLinkingDefi: boolean;
  isAddingVerification: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  setTrustData: (trustData: TrustData) => void;
  updateTrustData: (updates: Partial<TrustData>) => void;
  setTrustScore: (score: number) => void;
  setTrustTier: (tier: TrustTier) => void;
  setScoreBreakdown: (breakdown: TrustScoreBreakdown) => void;
  setHistory: (history: TrustScoreHistory[]) => void;
  addHistoryEntry: (entry: TrustScoreHistory) => void;
  
  setScoreComponents: (components: {
    paymentScore: number;
    completionScore: number;
    defiScore: number;
    socialScore: number;
  }) => void;
  
  setScoreHistory: (history: Array<{
    timestamp: number;
    score: number;
    tier: TrustTier;
    reason: string;
  }>) => void;
  addScoreHistoryEntry: (entry: {
    timestamp: number;
    score: number;
    tier: TrustTier;
    reason: string;
  }) => void;
  
  setLoading: (loading: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setLinkingDefi: (linking: boolean) => void;
  setAddingVerification: (adding: boolean) => void;
  
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed getters
  getScoreProgress: () => number;
  getTierProgress: () => number;
  getNextTierThreshold: () => number;
  getScoreTrend: () => 'up' | 'down' | 'stable';
  getScoreChange: () => number;
  getRecommendations: () => string[];
  getScoreDistribution: () => {
    payment: number;
    completion: number;
    defi: number;
    social: number;
  };
}

export const useTrustScoreStore = create<TrustScoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      trustData: null,
      trustScore: 0,
      trustTier: null,
      scoreBreakdown: null,
      history: [],
      
      paymentScore: 0,
      completionScore: 0,
      defiScore: 0,
      socialScore: 0,
      
      scoreHistory: [],
      
      isLoading: false,
      isUpdating: false,
      isLinkingDefi: false,
      isAddingVerification: false,
      
      error: null,
      
      // Actions
      setTrustData: (trustData) => set({ trustData }),
      
      updateTrustData: (updates) => set((state) => ({
        trustData: state.trustData ? { ...state.trustData, ...updates } : null,
      })),
      
      setTrustScore: (score) => set({ trustScore: score }),
      
      setTrustTier: (tier) => set({ trustTier: tier }),
      
      setScoreBreakdown: (breakdown) => set({ scoreBreakdown: breakdown }),
      
      setHistory: (history) => set({ history }),
      
      addHistoryEntry: (entry) => set((state) => ({
        history: [entry, ...state.history],
      })),
      
      setScoreComponents: (components) => set(components),
      
      setScoreHistory: (history) => set({ scoreHistory: history }),
      
      addScoreHistoryEntry: (entry) => set((state) => ({
        scoreHistory: [entry, ...state.scoreHistory],
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setUpdating: (updating) => set({ isUpdating: updating }),
      
      setLinkingDefi: (linking) => set({ isLinkingDefi: linking }),
      
      setAddingVerification: (adding) => set({ isAddingVerification: adding }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      // Computed getters
      getScoreProgress: () => {
        const state = get();
        return Math.min((state.trustScore / 1000) * 100, 100);
      },
      
      getTierProgress: () => {
        const state = get();
        if (!state.trustTier) return 0;
        
        const tierThresholds = {
          [TrustTier.NEWCOMER]: 0,
          [TrustTier.SILVER]: 250,
          [TrustTier.GOLD]: 500,
          [TrustTier.PLATINUM]: 750,
        };
        
        const currentTierThreshold = tierThresholds[state.trustTier];
        const nextTierThreshold = state.trustTier === TrustTier.PLATINUM 
          ? 1000 
          : tierThresholds[state.trustTier + 1 as TrustTier];
        
        const progress = ((state.trustScore - currentTierThreshold) / 
                         (nextTierThreshold - currentTierThreshold)) * 100;
        
        return Math.max(0, Math.min(100, progress));
      },
      
      getNextTierThreshold: () => {
        const state = get();
        if (!state.trustTier) return 250;
        
        const tierThresholds = {
          [TrustTier.NEWCOMER]: 250,
          [TrustTier.SILVER]: 500,
          [TrustTier.GOLD]: 750,
          [TrustTier.PLATINUM]: 1000,
        };
        
        return tierThresholds[state.trustTier] || 1000;
      },
      
      getScoreTrend: () => {
        const state = get();
        if (state.scoreHistory.length < 2) return 'stable';
        
        const recent = state.scoreHistory[0];
        const previous = state.scoreHistory[1];
        
        if (recent.score > previous.score) return 'up';
        if (recent.score < previous.score) return 'down';
        return 'stable';
      },
      
      getScoreChange: () => {
        const state = get();
        if (state.scoreHistory.length < 2) return 0;
        
        const recent = state.scoreHistory[0];
        const previous = state.scoreHistory[1];
        
        return recent.score - previous.score;
      },
      
      getRecommendations: () => {
        const state = get();
        const recommendations: string[] = [];
        
        if (state.paymentScore < 800) {
          recommendations.push('Make payments on time to improve your payment score');
        }
        
        if (state.completionScore < 600) {
          recommendations.push('Complete more lending circles to boost your score');
        }
        
        if (state.defiScore < 400) {
          recommendations.push('Link your DeFi history to increase your score');
        }
        
        if (state.socialScore < 200) {
          recommendations.push('Add social verifications to enhance your reputation');
        }
        
        if (state.trustScore < 250) {
          recommendations.push('Focus on building a consistent payment history');
        }
        
        return recommendations;
      },
      
      getScoreDistribution: () => {
        const state = get();
        const total = state.paymentScore + state.completionScore + state.defiScore + state.socialScore;
        
        if (total === 0) {
          return { payment: 0, completion: 0, defi: 0, social: 0 };
        }
        
        return {
          payment: (state.paymentScore / total) * 100,
          completion: (state.completionScore / total) * 100,
          defi: (state.defiScore / total) * 100,
          social: (state.socialScore / total) * 100,
        };
      },
    }),
    {
      name: 'trust-score-store',
      partialize: (state) => ({
        trustData: state.trustData,
        trustScore: state.trustScore,
        trustTier: state.trustTier,
        scoreBreakdown: state.scoreBreakdown,
        history: state.history.slice(0, 100), // Keep only recent history
        scoreHistory: state.scoreHistory.slice(0, 50), // Keep only recent score history
      }),
    }
  )
);
