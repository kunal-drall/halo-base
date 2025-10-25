import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CircleInfo, CircleFilters, PayoutMethod } from '@/types';

interface CircleState {
  // Circle data
  circles: CircleInfo[];
  selectedCircle: CircleInfo | null;
  userCircles: CircleInfo[];
  createdCircles: CircleInfo[];
  
  // Filters and search
  filters: CircleFilters;
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'amount' | 'duration' | 'members';
  viewMode: 'grid' | 'list';
  
  // Pagination
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isJoining: boolean;
  isLeaving: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  setCircles: (circles: CircleInfo[]) => void;
  addCircle: (circle: CircleInfo) => void;
  updateCircle: (circleId: bigint, updates: Partial<CircleInfo>) => void;
  removeCircle: (circleId: bigint) => void;
  setSelectedCircle: (circle: CircleInfo | null) => void;
  
  setUserCircles: (circles: CircleInfo[]) => void;
  addUserCircle: (circle: CircleInfo) => void;
  removeUserCircle: (circleId: bigint) => void;
  
  setCreatedCircles: (circles: CircleInfo[]) => void;
  addCreatedCircle: (circle: CircleInfo) => void;
  updateCreatedCircle: (circleId: bigint, updates: Partial<CircleInfo>) => void;
  
  setFilters: (filters: Partial<CircleFilters>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: CircleState['sortBy']) => void;
  setViewMode: (viewMode: CircleState['viewMode']) => void;
  
  setPagination: (page: number, totalPages: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setJoining: (joining: boolean) => void;
  setLeaving: (leaving: boolean) => void;
  
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed getters
  getFilteredCircles: () => CircleInfo[];
  getPublicCircles: () => CircleInfo[];
  getActiveCircles: () => CircleInfo[];
  getCompletedCircles: () => CircleInfo[];
}

const defaultFilters: CircleFilters = {
  minAmount: undefined,
  maxAmount: undefined,
  minDuration: undefined,
  maxDuration: undefined,
  minTrustTier: undefined,
  status: 'all',
  payoutMethod: undefined,
  isPublic: undefined,
};

export const useCircleStore = create<CircleState>()(
  persist(
    (set, get) => ({
      // Initial state
      circles: [],
      selectedCircle: null,
      userCircles: [],
      createdCircles: [],
      
      filters: defaultFilters,
      searchQuery: '',
      sortBy: 'newest',
      viewMode: 'grid',
      
      currentPage: 1,
      itemsPerPage: 12,
      totalPages: 1,
      
      isLoading: false,
      isCreating: false,
      isJoining: false,
      isLeaving: false,
      
      error: null,
      
      // Actions
      setCircles: (circles) => set({ circles }),
      
      addCircle: (circle) => set((state) => ({
        circles: [...state.circles, circle],
      })),
      
      updateCircle: (circleId, updates) => set((state) => ({
        circles: state.circles.map(circle => 
          circle.circleAddress === circleId.toString() 
            ? { ...circle, ...updates }
            : circle
        ),
        userCircles: state.userCircles.map(circle => 
          circle.circleAddress === circleId.toString() 
            ? { ...circle, ...updates }
            : circle
        ),
        createdCircles: state.createdCircles.map(circle => 
          circle.circleAddress === circleId.toString() 
            ? { ...circle, ...updates }
            : circle
        ),
      })),
      
      removeCircle: (circleId) => set((state) => ({
        circles: state.circles.filter(circle => 
          circle.circleAddress !== circleId.toString()
        ),
      })),
      
      setSelectedCircle: (circle) => set({ selectedCircle: circle }),
      
      setUserCircles: (circles) => set({ userCircles: circles }),
      
      addUserCircle: (circle) => set((state) => ({
        userCircles: [...state.userCircles, circle],
      })),
      
      removeUserCircle: (circleId) => set((state) => ({
        userCircles: state.userCircles.filter(circle => 
          circle.circleAddress !== circleId.toString()
        ),
      })),
      
      setCreatedCircles: (circles) => set({ createdCircles: circles }),
      
      addCreatedCircle: (circle) => set((state) => ({
        createdCircles: [...state.createdCircles, circle],
      })),
      
      updateCreatedCircle: (circleId, updates) => set((state) => ({
        createdCircles: state.createdCircles.map(circle => 
          circle.circleAddress === circleId.toString() 
            ? { ...circle, ...updates }
            : circle
        ),
      })),
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
        currentPage: 1, // Reset to first page when filters change
      })),
      
      clearFilters: () => set({ 
        filters: defaultFilters,
        currentPage: 1,
      }),
      
      setSearchQuery: (query) => set({ 
        searchQuery: query,
        currentPage: 1, // Reset to first page when search changes
      }),
      
      setSortBy: (sortBy) => set({ sortBy }),
      
      setViewMode: (viewMode) => set({ viewMode }),
      
      setPagination: (page, totalPages) => set({ 
        currentPage: page, 
        totalPages 
      }),
      
      nextPage: () => set((state) => ({
        currentPage: Math.min(state.currentPage + 1, state.totalPages),
      })),
      
      prevPage: () => set((state) => ({
        currentPage: Math.max(state.currentPage - 1, 1),
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setCreating: (creating) => set({ isCreating: creating }),
      
      setJoining: (joining) => set({ isJoining: joining }),
      
      setLeaving: (leaving) => set({ isLeaving: leaving }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      // Computed getters
      getFilteredCircles: () => {
        const state = get();
        let filtered = [...state.circles];
        
        // Apply search filter
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(circle => 
            circle.circleAddress.toLowerCase().includes(query) ||
            circle.creator.toLowerCase().includes(query)
          );
        }
        
        // Apply filters
        if (state.filters.minAmount !== undefined) {
          filtered = filtered.filter(circle => 
            circle.params.contributionAmount >= state.filters.minAmount!
          );
        }
        
        if (state.filters.maxAmount !== undefined) {
          filtered = filtered.filter(circle => 
            circle.params.contributionAmount <= state.filters.maxAmount!
          );
        }
        
        if (state.filters.minDuration !== undefined) {
          filtered = filtered.filter(circle => 
            circle.params.cycleDuration >= state.filters.minDuration!
          );
        }
        
        if (state.filters.maxDuration !== undefined) {
          filtered = filtered.filter(circle => 
            circle.params.cycleDuration <= state.filters.maxDuration!
          );
        }
        
        if (state.filters.minTrustTier !== undefined) {
          filtered = filtered.filter(circle => 
            circle.params.minTrustTier <= state.filters.minTrustTier!
          );
        }
        
        if (state.filters.status !== 'all') {
          filtered = filtered.filter(circle => {
            switch (state.filters.status) {
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
        
        if (state.filters.payoutMethod !== undefined) {
          filtered = filtered.filter(circle => 
            circle.params.payoutMethod === state.filters.payoutMethod
          );
        }
        
        if (state.filters.isPublic !== undefined) {
          filtered = filtered.filter(circle => 
            circle.params.isPublic === state.filters.isPublic
          );
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
          switch (state.sortBy) {
            case 'newest':
              return Number(b.createdAt - a.createdAt);
            case 'oldest':
              return Number(a.createdAt - b.createdAt);
            case 'amount':
              return Number(a.params.contributionAmount - b.params.contributionAmount);
            case 'duration':
              return Number(a.params.cycleDuration - b.params.cycleDuration);
            case 'members':
              return Number(a.memberCount - b.memberCount);
            default:
              return 0;
          }
        });
        
        return filtered;
      },
      
      getPublicCircles: () => {
        return get().circles.filter(circle => circle.params.isPublic);
      },
      
      getActiveCircles: () => {
        return get().circles.filter(circle => circle.isActive);
      },
      
      getCompletedCircles: () => {
        return get().circles.filter(circle => !circle.isActive);
      },
    }),
    {
      name: 'circle-store',
      partialize: (state) => ({
        filters: state.filters,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        viewMode: state.viewMode,
        itemsPerPage: state.itemsPerPage,
      }),
    }
  )
);
