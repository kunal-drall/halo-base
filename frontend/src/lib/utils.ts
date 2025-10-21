import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatUSDC(amount: bigint, decimals = 6): string {
  const value = Number(amount) / Math.pow(10, decimals);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getTrustTierName(tier: number): string {
  const tiers = ['Newcomer', 'Bronze', 'Silver', 'Gold', 'Platinum'];
  return tiers[tier] || 'Unknown';
}

export function getTrustTierColor(tier: number): string {
  const colors = [
    'text-gray-500', // Newcomer
    'text-amber-600', // Bronze
    'text-gray-400', // Silver
    'text-yellow-500', // Gold
    'text-purple-500', // Platinum
  ];
  return colors[tier] || 'text-gray-500';
}
