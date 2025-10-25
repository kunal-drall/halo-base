'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { 
  Award, 
  Star, 
  Shield, 
  Target, 
  AlertTriangle, 
  Crown, 
  Zap, 
  Flame, 
  Gem, 
  Diamond,
  Trophy,
  Medal,
  Ribbon
} from 'lucide-react';

interface TrustBadgeProps {
  tier: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'solid' | 'gradient';
  showIcon?: boolean;
  showLabel?: boolean;
  showScore?: boolean;
  score?: bigint;
  animated?: boolean;
  className?: string;
}

export function TrustBadge({
  tier,
  size = 'md',
  variant = 'default',
  showIcon = true,
  showLabel = true,
  showScore = false,
  score,
  animated = false,
  className = ''
}: TrustBadgeProps) {
  const getTierConfig = (tier: number) => {
    switch (tier) {
      case 4:
        return {
          label: 'Elite',
          icon: Crown,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          gradient: 'from-yellow-400 to-yellow-600',
          description: 'Highest trust level'
        };
      case 3:
        return {
          label: 'Gold',
          icon: Award,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          gradient: 'from-blue-400 to-blue-600',
          description: 'High trust level'
        };
      case 2:
        return {
          label: 'Silver',
          icon: Star,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          gradient: 'from-green-400 to-green-600',
          description: 'Good trust level'
        };
      case 1:
        return {
          label: 'Bronze',
          icon: Shield,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          gradient: 'from-orange-400 to-orange-600',
          description: 'Basic trust level'
        };
      default:
        return {
          label: 'Unranked',
          icon: AlertTriangle,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          gradient: 'from-red-400 to-red-600',
          description: 'No trust level'
        };
    }
  };

  const getSizeConfig = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          iconSize: 'h-3 w-3',
          textSize: 'text-xs',
          padding: 'px-2 py-1',
          spacing: 'space-x-1'
        };
      case 'lg':
        return {
          iconSize: 'h-5 w-5',
          textSize: 'text-base',
          padding: 'px-4 py-2',
          spacing: 'space-x-2'
        };
      default: // md
        return {
          iconSize: 'h-4 w-4',
          textSize: 'text-sm',
          padding: 'px-3 py-1.5',
          spacing: 'space-x-1.5'
        };
    }
  };

  const config = getTierConfig(tier);
  const sizeConfig = getSizeConfig(size);
  const Icon = config.icon;

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return `border ${config.borderColor} ${config.textColor} bg-transparent`;
      case 'solid':
        return `${config.bgColor} ${config.textColor} border ${config.borderColor}`;
      case 'gradient':
        return `bg-gradient-to-r ${config.gradient} text-white border-0`;
      default:
        return `${config.bgColor} ${config.textColor} border ${config.borderColor}`;
    }
  };

  const badgeContent = (
    <div className={`inline-flex items-center ${sizeConfig.spacing} ${sizeConfig.padding} rounded-full border ${getVariantClasses()} ${className}`}>
      {showIcon && (
        <Icon className={`${sizeConfig.iconSize} ${config.color}`} />
      )}
      {showLabel && (
        <span className={`font-medium ${sizeConfig.textSize}`}>
          {config.label}
        </span>
      )}
      {showScore && score && (
        <span className={`font-bold ${sizeConfig.textSize}`}>
          {score.toString()}
        </span>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
}

// Specialized badge components for different use cases
export function TrustTierBadge({ tier, ...props }: Omit<TrustBadgeProps, 'showLabel' | 'showIcon'>) {
  return <TrustBadge tier={tier} showLabel={true} showIcon={true} {...props} />;
}

export function TrustScoreBadge({ tier, score, ...props }: Omit<TrustBadgeProps, 'showScore'>) {
  return <TrustBadge tier={tier} score={score} showScore={true} showLabel={false} showIcon={true} {...props} />;
}

export function TrustIconBadge({ tier, ...props }: Omit<TrustBadgeProps, 'showLabel' | 'showScore'>) {
  return <TrustBadge tier={tier} showIcon={true} showLabel={false} {...props} />;
}

export function TrustLabelBadge({ tier, ...props }: Omit<TrustBadgeProps, 'showIcon' | 'showScore'>) {
  return <TrustBadge tier={tier} showLabel={true} showIcon={false} {...props} />;
}