# Halo Protocol Deployment Guide

This guide walks you through deploying the Halo Protocol contracts to Base Sepolia and running the frontend application.

## Prerequisites

### Required Tools
- **Foundry**: Smart contract development framework
- **Node.js**: v18 or higher
- **npm/yarn**: Package manager
- **Git**: Version control

### Required Accounts
- **Base Sepolia Wallet**: With some Sepolia ETH for gas
- **OnchainKit API Key**: For frontend Web3 integration
- **BaseScan API Key** (optional): For contract verification

## Step 1: Environment Setup

### Contracts Environment

Create a `.env` file in the `contracts/` directory:

\`\`\`bash
# Copy the template
cp contracts/.env.example contracts/.env
\`\`\`

Add your credentials to `contracts/.env`:

\`\`\`env
# Your deployer private key (with 0x prefix)
PRIVATE_KEY=0xyour_private_key_here

# Base Sepolia RPC URL
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# BaseScan API key for verification (optional)
BASESCAN_API_KEY=your_basescan_api_key_here
\`\`\`

### Frontend Environment

Create a `.env.local` file in the `frontend/` directory:

\`\`\`bash
# Copy the template
cp frontend/.env.local.example frontend/.env.local
\`\`\`

Add your credentials to `frontend/.env.local`:

\`\`\`env
# OnchainKit API key from Coinbase Developer Platform
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# Optional: Custom RPC endpoint
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
\`\`\`

## Step 2: Get Test Funds

### Get Base Sepolia ETH

1. Visit the Base Sepolia faucet: https://faucet.quicknode.com/base/sepolia
2. Enter your wallet address
3. Request test ETH
4. Wait for confirmation

Alternative faucets:
- https://www.alchemy.com/faucets/base-sepolia
- https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

## Step 3: Compile Contracts

Navigate to the contracts directory and compile:

\`\`\`bash
cd contracts
forge build --via-ir
\`\`\`

Expected output:
\`\`\`
[⠊] Compiling...
[⠒] Compiling 11 files with 0.8.20
[⠑] Solc 0.8.20 finished in XXXms
Compiler run successful
\`\`\`

## Step 4: Run Contract Tests

Before deploying, run the test suite to ensure everything works:

\`\`\`bash
forge test --gas-report
\`\`\`

Expected output:
\`\`\`
Running X tests for test/TrustScoreManager.t.sol
[PASS] testRegisterUser() (gas: XXXXX)
[PASS] testUpdateTrustScore() (gas: XXXXX)
...

Test result: ok. X passed; 0 failed; 0 skipped
\`\`\`

## Step 5: Deploy Contracts

Deploy all contracts to Base Sepolia:

\`\`\`bash
forge script script/Deploy.s.sol:DeployScript \\
  --rpc-url https://sepolia.base.org \\
  --broadcast \\
  --via-ir \\
  --slow
\`\`\`

If you want to verify contracts during deployment:

\`\`\`bash
forge script script/Deploy.s.sol:DeployScript \\
  --rpc-url https://sepolia.base.org \\
  --broadcast \\
  --verify \\
  --etherscan-api-key $BASESCAN_API_KEY \\
  --via-ir \\
  --slow
\`\`\`

### Save Deployment Addresses

The deployment script will output the contract addresses. Save them for frontend integration:

\`\`\`json
{
  "MockUSDC": "0x...",
  "TrustScoreManager": "0x...",
  "CircleFactory": "0x...",
  "YieldManager": "0x..."
}
\`\`\`

The addresses will also be saved to `deployments/base-sepolia.json`.

## Step 6: Verify Contracts (Optional)

If you didn't verify during deployment, you can verify manually:

\`\`\`bash
# Verify TrustScoreManager
forge verify-contract \\
  0xYourTrustScoreManagerAddress \\
  src/TrustScoreManager.sol:TrustScoreManager \\
  --chain-id 84532 \\
  --etherscan-api-key $BASESCAN_API_KEY

# Verify CircleFactory
forge verify-contract \\
  0xYourCircleFactoryAddress \\
  src/CircleFactory.sol:CircleFactory \\
  --chain-id 84532 \\
  --etherscan-api-key $BASESCAN_API_KEY \\
  --constructor-args $(cast abi-encode "constructor(address,address,address)" 0xUSDCAddress 0xTrustScoreAddress 0xYieldManagerAddress)

# Verify YieldManager
forge verify-contract \\
  0xYourYieldManagerAddress \\
  src/YieldManager.sol:YieldManager \\
  --chain-id 84532 \\
  --etherscan-api-key $BASESCAN_API_KEY \\
  --constructor-args $(cast abi-encode "constructor(address,address,address,address)" 0xUSDCAddress 0xAavePoolAddress 0xAUSDCAddress 0xDataProviderAddress)
\`\`\`

## Step 7: Update Frontend Configuration

Update the contract addresses in `frontend/src/config/contracts.ts`:

\`\`\`typescript
export const CONTRACT_ADDRESSES = {
  MOCK_USDC: '0xYourMockUSDCAddress' as \`0x\${string}\`,
  TRUST_SCORE_MANAGER: '0xYourTrustScoreManagerAddress' as \`0x\${string}\`,
  CIRCLE_FACTORY: '0xYourCircleFactoryAddress' as \`0x\${string}\`,
  YIELD_MANAGER: '0xYourYieldManagerAddress' as \`0x\${string}\`,
} as const;
\`\`\`

## Step 8: Install Frontend Dependencies

Navigate to the frontend directory and install dependencies:

\`\`\`bash
cd frontend
npm install
\`\`\`

## Step 9: Run Frontend Development Server

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

The application will be available at: http://localhost:3000

## Step 10: Test the Application

### Connect Wallet
1. Open http://localhost:3000 in your browser
2. Click "Connect Wallet"
3. Connect your Base Sepolia wallet

### Register for Trust Score
1. Navigate to the Dashboard
2. Click "Register for Trust Score"
3. Confirm the transaction
4. Wait for confirmation

### Mint Test USDC
1. On the Dashboard, click "Mint Mock USDC"
2. Confirm the transaction
3. You'll receive 1000 Mock USDC

### Create a Circle
1. Navigate to "Create Circle"
2. Fill in the circle details:
   - Name and description
   - Contribution amount
   - Maximum members
   - Cycle duration
   - Trust requirements
   - Payout method
3. Review and create
4. Confirm the transaction

### Join a Circle
1. Navigate to "Discover Circles"
2. Find a circle you want to join
3. Click "Join Circle"
4. Approve USDC spending
5. Confirm the transaction

### Make a Contribution
1. Navigate to "My Circles"
2. Select your circle
3. Click "Contribute"
4. Confirm the transaction

## Troubleshooting

### Common Issues

#### "Failed to fetch" Error
- **Cause**: Incorrect RPC URL or network configuration
- **Fix**: Check that you're connected to Base Sepolia network
- **Fix**: Verify RPC URL in `frontend/src/providers/Web3Provider.tsx`

#### Contract Returns "0x" Data
- **Cause**: Contract not deployed or incorrect address
- **Fix**: Verify contract addresses in `frontend/src/config/contracts.ts`
- **Fix**: Check that contracts are deployed on Base Sepolia

#### Wallet Connection Issues
- **Cause**: Browser wallet not installed or configured
- **Fix**: Install Coinbase Wallet or MetaMask
- **Fix**: Switch to Base Sepolia network in your wallet

#### Transaction Fails
- **Cause**: Insufficient gas or test ETH
- **Fix**: Get more test ETH from faucet
- **Fix**: Check gas price and increase if needed

#### Build Errors
- **Cause**: Missing dependencies or environment variables
- **Fix**: Run `npm install` in frontend directory
- **Fix**: Verify `.env.local` file exists and is configured

### Reset Development Environment

If you need to start fresh:

\`\`\`bash
# Clean contract artifacts
cd contracts
forge clean

# Clean frontend build
cd frontend
rm -rf .next node_modules
npm install
\`\`\`

## Production Deployment

### Deploy to Base Mainnet

1. **Get BASE ETH**: Purchase real BASE ETH for gas
2. **Update .env**: Use mainnet RPC URL and production private key
3. **Deploy contracts**: Run deployment script with mainnet RPC
4. **Verify contracts**: Verify all contracts on BaseScan
5. **Update frontend**: Point to mainnet contract addresses
6. **Deploy frontend**: Deploy to Vercel or similar platform

### Frontend Deployment (Vercel)

1. **Connect repository**: Link your GitHub repository to Vercel
2. **Configure environment**: Add environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically deploy on push to main
4. **Custom domain**: Add custom domain in Vercel settings

\`\`\`bash
# Or deploy using Vercel CLI
npm install -g vercel
cd frontend
vercel
\`\`\`

## Monitoring and Maintenance

### Contract Monitoring
- Monitor contract events using BaseScan
- Track gas usage and optimize if needed
- Monitor trust score updates
- Track circle creation and completion rates

### Frontend Monitoring
- Set up Vercel Analytics
- Monitor Web Vitals
- Track user engagement
- Monitor error rates

### Security
- Conduct regular security audits
- Monitor for unusual activity
- Keep dependencies updated
- Review and test upgrades thoroughly

## Support

For issues or questions:
- Check the README.md for general information
- Review contract documentation in source files
- Check frontend component documentation
- Consult the testing guide for test examples

## Version

**Current Version**: 1.0.0
**Last Updated**: October 24, 2025
**Network**: Base Sepolia (Testnet)
**Status**: ✅ Ready for Deployment

---

**Happy Deploying! 🚀**

