import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Modal {
  id: string;
  component: string;
  props?: Record<string, any>;
  onClose?: () => void;
}

interface UIState {
  // Theme and appearance
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  
  // Modals
  modals: Modal[];
  
  // Toasts
  toasts: Toast[];
  
  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Error states
  globalError: string | null;
  errorStates: Record<string, string | null>;
  
  // Success states
  successStates: Record<string, string | null>;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Modal actions
  openModal: (modal: Omit<Modal, 'id'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Toast actions
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  setLoading: (key: string, loading: boolean) => void;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
  
  // Error actions
  setGlobalError: (error: string | null) => void;
  setError: (key: string, error: string | null) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
  
  // Success actions
  setSuccess: (key: string, message: string | null) => void;
  clearSuccess: (key: string) => void;
  clearAllSuccess: () => void;
  
  // Computed getters
  hasModals: () => boolean;
  hasToasts: () => boolean;
  hasGlobalLoading: () => boolean;
  hasAnyLoading: () => boolean;
  hasGlobalError: () => boolean;
  hasAnyError: () => boolean;
  hasAnySuccess: () => boolean;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      
      modals: [],
      toasts: [],
      
      globalLoading: false,
      loadingStates: {},
      
      globalError: null,
      errorStates: {},
      
      successStates: {},
      
      // Actions
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed,
      })),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      toggleMobileMenu: () => set((state) => ({
        mobileMenuOpen: !state.mobileMenuOpen,
      })),
      
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      
      // Modal actions
      openModal: (modal) => set((state) => ({
        modals: [...state.modals, { ...modal, id: Date.now().toString() }],
      })),
      
      closeModal: (id) => set((state) => ({
        modals: state.modals.filter(modal => modal.id !== id),
      })),
      
      closeAllModals: () => set({ modals: [] }),
      
      // Toast actions
      showToast: (toast) => set((state) => {
        const newToast = {
          ...toast,
          id: Date.now().toString(),
          duration: toast.duration || 5000,
        };
        
        // Auto-hide toast after duration
        if (newToast.duration > 0) {
          setTimeout(() => {
            get().hideToast(newToast.id);
          }, newToast.duration);
        }
        
        return {
          toasts: [...state.toasts, newToast],
        };
      }),
      
      hideToast: (id) => set((state) => ({
        toasts: state.toasts.filter(toast => toast.id !== id),
      })),
      
      hideAllToasts: () => set({ toasts: [] }),
      
      // Loading actions
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      
      setLoading: (key, loading) => set((state) => ({
        loadingStates: {
          ...state.loadingStates,
          [key]: loading,
        },
      })),
      
      clearLoading: (key) => set((state) => {
        const newLoadingStates = { ...state.loadingStates };
        delete newLoadingStates[key];
        return { loadingStates: newLoadingStates };
      }),
      
      clearAllLoading: () => set({ 
        globalLoading: false, 
        loadingStates: {} 
      }),
      
      // Error actions
      setGlobalError: (error) => set({ globalError: error }),
      
      setError: (key, error) => set((state) => ({
        errorStates: {
          ...state.errorStates,
          [key]: error,
        },
      })),
      
      clearError: (key) => set((state) => {
        const newErrorStates = { ...state.errorStates };
        delete newErrorStates[key];
        return { errorStates: newErrorStates };
      }),
      
      clearAllErrors: () => set({ 
        globalError: null, 
        errorStates: {} 
      }),
      
      // Success actions
      setSuccess: (key, message) => set((state) => ({
        successStates: {
          ...state.successStates,
          [key]: message,
        },
      })),
      
      clearSuccess: (key) => set((state) => {
        const newSuccessStates = { ...state.successStates };
        delete newSuccessStates[key];
        return { successStates: newSuccessStates };
      }),
      
      clearAllSuccess: () => set({ successStates: {} }),
      
      // Computed getters
      hasModals: () => get().modals.length > 0,
      
      hasToasts: () => get().toasts.length > 0,
      
      hasGlobalLoading: () => get().globalLoading,
      
      hasAnyLoading: () => {
        const state = get();
        return state.globalLoading || Object.values(state.loadingStates).some(loading => loading);
      },
      
      hasGlobalError: () => get().globalError !== null,
      
      hasAnyError: () => {
        const state = get();
        return state.globalError !== null || Object.values(state.errorStates).some(error => error !== null);
      },
      
      hasAnySuccess: () => {
        const state = get();
        return Object.values(state.successStates).some(success => success !== null);
      },
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
