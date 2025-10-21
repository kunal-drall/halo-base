// Contract addresses on Base Sepolia
// These will be updated after deployment
export const CONTRACT_ADDRESSES = {
  MOCK_USDC: '0x' as `0x${string}`,
  TRUST_SCORE_MANAGER: '0x' as `0x${string}`,
  CIRCLE_FACTORY: '0x' as `0x${string}`,
  YIELD_MANAGER: '0x' as `0x${string}`,
} as const;

// Update these addresses after contract deployment
export function updateContractAddresses(addresses: typeof CONTRACT_ADDRESSES) {
  Object.assign(CONTRACT_ADDRESSES, addresses);
}

