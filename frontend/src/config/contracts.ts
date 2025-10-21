// Contract addresses on Base Sepolia
// Deployed addresses from Base Sepolia deployment
export const CONTRACT_ADDRESSES = {
  MOCK_USDC: '0x7D9bA621fb3E336a50e91aB7B27c3FEe1d5Fb39a' as `0x${string}`,
  TRUST_SCORE_MANAGER: '0x1F08A0135B843c7f7276F7DAa70e69eD0eE7eF55' as `0x${string}`,
  CIRCLE_FACTORY: '0xe5A53477eCb384547C753A97c8cD1D23A799edB0' as `0x${string}`,
  YIELD_MANAGER: '0x3a868f8F42Bb2F7aa39cCb6ceC3c3C7148959f20' as `0x${string}`,
} as const;

// Update these addresses after contract deployment
export function updateContractAddresses(addresses: typeof CONTRACT_ADDRESSES) {
  Object.assign(CONTRACT_ADDRESSES, addresses);
}

