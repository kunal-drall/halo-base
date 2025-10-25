// Mobile-First Design Tokens for Halo Protocol
// Optimized for touch interactions and mobile UX

export const mobileTokens = {
  // Touch targets (iOS/Android guidelines)
  touchTargets: {
    min: '44px',      // Minimum touch target (iOS HIG)
    comfortable: '56px', // Comfortable touch target
    large: '64px',    // Large touch target (primary actions)
    fab: '56px',      // Floating Action Button
  },
  
  // Mobile-optimized spacing
  spacing: {
    xs: '4px',   // 0.25rem - Micro spacing
    sm: '8px',   // 0.5rem - Small spacing
    md: '16px',  // 1rem - Base spacing
    lg: '24px',  // 1.5rem - Large spacing
    xl: '32px',  // 2rem - Extra large spacing
    '2xl': '48px', // 3rem - Section spacing
    '3xl': '64px', // 4rem - Page spacing
  },
  
  // Mobile typography (optimized for readability)
  typography: {
    xs: '12px',   // Small labels, captions
    sm: '14px',   // Body text, descriptions
    base: '16px', // Primary text, buttons
    lg: '18px',   // Headings, important text
    xl: '20px',   // Large headings
    '2xl': '24px', // Hero text, titles
    '3xl': '30px', // Display text
    '4xl': '36px', // Large display
  },
  
  // Line heights for mobile readability
  lineHeight: {
    tight: '1.2',   // Headlines
    normal: '1.4',  // Body text
    relaxed: '1.6', // Long form content
  },
  
  // Mobile-specific shadows (subtle for performance)
  shadows: {
    card: '0 2px 8px rgba(0, 0, 0, 0.1)',
    modal: '0 8px 32px rgba(0, 0, 0, 0.2)',
    floating: '0 4px 16px rgba(0, 0, 0, 0.15)',
    bottom: '0 -2px 8px rgba(0, 0, 0, 0.1)',
    top: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  
  // Border radius (mobile-friendly)
  radius: {
    sm: '8px',   // Small elements
    md: '12px',  // Cards, buttons
    lg: '16px',  // Large cards
    xl: '24px',  // Modals, sheets
    full: '9999px', // Pills, avatars
  },
  
  // Z-index layers (mobile navigation)
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    bottomNav: 1080, // Bottom navigation
    floating: 1090,  // Floating elements
  },
  
  // Animation durations (mobile-optimized)
  animation: {
    fast: '150ms',    // Micro interactions
    normal: '300ms',  // Standard transitions
    slow: '500ms',    // Complex animations
    spring: '400ms',  // Spring animations
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Breakpoints (mobile-first)
  breakpoints: {
    xs: '320px',   // Small phones
    sm: '375px',   // Standard phones
    md: '414px',   // Large phones
    lg: '768px',   // Tablets
    xl: '1024px',  // Desktop
  },
  
  // Safe area insets
  safeArea: {
    top: 'env(safe-area-inset-top)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
    right: 'env(safe-area-inset-right)',
  },
};

// Mobile-specific color tokens
export const mobileColors = {
  // Primary brand colors
  primary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6', // Main purple
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  
  // Accent colors
  accent: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899', // Main pink
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },
  
  // Status colors
  success: {
    50: '#ECFDF5',
    500: '#10B981',
    600: '#059669',
  },
  
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },
  
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
  },
  
  // Neutral colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Mobile component variants
export const mobileVariants = {
  // Button sizes (touch-optimized)
  button: {
    sm: {
      height: mobileTokens.touchTargets.min,
      padding: `${mobileTokens.spacing.sm} ${mobileTokens.spacing.md}`,
      fontSize: mobileTokens.typography.sm,
    },
    md: {
      height: mobileTokens.touchTargets.comfortable,
      padding: `${mobileTokens.spacing.md} ${mobileTokens.spacing.lg}`,
      fontSize: mobileTokens.typography.base,
    },
    lg: {
      height: mobileTokens.touchTargets.large,
      padding: `${mobileTokens.spacing.lg} ${mobileTokens.spacing.xl}`,
      fontSize: mobileTokens.typography.lg,
    },
  },
  
  // Card variants
  card: {
    sm: {
      padding: mobileTokens.spacing.md,
      borderRadius: mobileTokens.radius.md,
      shadow: mobileTokens.shadows.card,
    },
    md: {
      padding: mobileTokens.spacing.lg,
      borderRadius: mobileTokens.radius.lg,
      shadow: mobileTokens.shadows.card,
    },
    lg: {
      padding: mobileTokens.spacing.xl,
      borderRadius: mobileTokens.radius.xl,
      shadow: mobileTokens.shadows.modal,
    },
  },
  
  // Input variants
  input: {
    sm: {
      height: mobileTokens.touchTargets.min,
      padding: `${mobileTokens.spacing.sm} ${mobileTokens.spacing.md}`,
      fontSize: mobileTokens.typography.sm,
    },
    md: {
      height: mobileTokens.touchTargets.comfortable,
      padding: `${mobileTokens.spacing.md} ${mobileTokens.spacing.lg}`,
      fontSize: mobileTokens.typography.base,
    },
  },
};

export default mobileTokens;
