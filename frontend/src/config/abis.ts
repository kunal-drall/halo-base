// Import actual ABIs from deployed contracts
import TrustScoreManagerABI from './abis/TrustScoreManager.json';
import CircleFactoryABI from './abis/CircleFactory.json';
import LendingCircleABI from './abis/LendingCircle.json';
import YieldManagerABI from './abis/YieldManager.json';
import MockUSDCABI from './abis/MockUSDC.json';

// Export ABIs for use in hooks
export const TRUST_SCORE_MANAGER_ABI = TrustScoreManagerABI;
export const CIRCLE_FACTORY_ABI = CircleFactoryABI;
export const LENDING_CIRCLE_ABI = LendingCircleABI;
export const YIELD_MANAGER_ABI = YieldManagerABI;
export const MOCK_USDC_ABI = MockUSDCABI;