# Halo Protocol - Community Lending Circles on Base

A decentralized peer-to-peer lending platform built on Base blockchain, featuring trust-based credit scoring and community-driven lending circles.

## 🌟 Features

- **Trust-Based Credit Scoring**: Build reputation through reliable payments and DeFi activity
- **Community Lending Circles**: Join or create lending circles with transparent rules
- **Smart Wallet Integration**: Gasless transactions for better user experience
- **Basename Support**: Human-readable addresses for better UX
- **Yield Generation**: Earn yield on contributions through Aave V3 integration
- **Automated Cycles**: Time-based contribution and payout cycles

## 🏗️ Architecture

### Smart Contracts (Foundry)
- **TrustScoreManager**: Weighted trust scoring system
- **LendingCircle**: Core lending circle logic with contributions and payouts
- **CircleFactory**: Factory pattern for creating and managing circles
- **YieldManager**: Aave V3 integration for yield generation

### Frontend (Next.js 14)
- **Web3 Integration**: Wagmi + TanStack Query + OnchainKit
- **Smart Wallet**: Coinbase Smart Wallet with gasless transactions
- **Design System**: Custom Halo Protocol design system
- **Responsive UI**: Mobile-first design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Foundry (for smart contracts)
- Base Sepolia ETH for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/halo-base.git
   cd halo-base
   ```

2. **Install dependencies**
   ```bash
   # Install contract dependencies
   cd contracts
   forge install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp contracts/.env.example contracts/.env
   cp frontend/.env.local.example frontend/.env.local
   
   # Fill in your values
   # contracts/.env
   PRIVATE_KEY=your_private_key_here
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   
   # frontend/.env.local
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
   NEXT_PUBLIC_PAYMASTER_URL=your_paymaster_url
   NEXT_PUBLIC_BUNDLER_URL=your_bundler_url
   ```

### Development

1. **Start the development server**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Run contract tests**
   ```bash
   cd contracts
   forge test
   ```

3. **Deploy contracts to Base Sepolia**
   ```bash
   cd contracts
   forge script script/Deploy.s.sol:DeployScript \
     --rpc-url $BASE_SEPOLIA_RPC_URL \
     --broadcast \
     --verify
   ```

## 📁 Project Structure

```
halo-base/
├── contracts/                 # Foundry smart contracts
│   ├── src/
│   │   ├── TrustScoreManager.sol
│   │   ├── LendingCircle.sol
│   │   ├── CircleFactory.sol
│   │   └── YieldManager.sol
│   ├── test/                  # Contract tests
│   ├── script/                # Deployment scripts
│   └── foundry.toml
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities
│   │   └── config/            # Contract configs
│   └── package.json
└── README.md
```

## 🔧 Smart Contracts

### TrustScoreManager
Manages user trust scores based on weighted metrics:
- Payment Reliability (40%)
- Circle Completions (30%)
- DeFi History (20%)
- Social Verification (10%)

### LendingCircle
Core lending circle functionality:
- Member management with trust score requirements
- Contribution tracking and cycle management
- Automated payout distribution
- Integration with TrustScoreManager

### CircleFactory
Factory for creating and managing lending circles:
- Circle creation with configurable parameters
- Member addition with trust score validation
- Circle registry and status tracking

### YieldManager
Yield generation through Aave V3:
- Deposit contributions to Aave V3
- Track yield per circle
- Automated yield distribution

## 🎨 Frontend Components

### Core UI Components
- **Button**: Primary, secondary, ghost variants with loading states
- **Card**: Glassmorphism effect containers
- **Badge**: Trust tier and status indicators
- **ProgressBar**: Animated progress indicators

### Circle Components
- **CircleCard**: Main circle display with stats
- **ContributionWidget**: Make contributions with transaction flow
- **MemberList**: Display members with trust scores

### Trust Components
- **TrustScoreDisplay**: Circular progress with metrics
- **TrustBadge**: Tier badges (Newcomer to Platinum)

## 🔐 Security Features

- **Reentrancy Protection**: All contracts use ReentrancyGuard
- **Access Control**: Role-based permissions with OpenZeppelin
- **Input Validation**: Comprehensive parameter validation
- **Pausable Contracts**: Emergency stop functionality
- **Rate Limiting**: Protection against spam and abuse

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
forge test                    # Run all tests
forge test -vv               # Verbose output
forge test --gas-report      # Gas usage report
```

### Frontend Tests
```bash
cd frontend
npm run test                 # Run unit tests
npm run test:e2e            # Run E2E tests
```

## 🚀 Deployment

### Contract Deployment
1. Deploy to Base Sepolia testnet
2. Verify contracts on BaseScan
3. Update frontend contract addresses

### Frontend Deployment
1. Deploy to Vercel
2. Configure environment variables
3. Set up custom domain (optional)

## 📊 Monitoring & Analytics

- **Contract Events**: Track all contract interactions
- **User Analytics**: Trust score distribution and circle activity
- **Gas Optimization**: Monitor gas usage and optimize
- **Error Tracking**: Comprehensive error logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.haloprotocol.com](https://docs.haloprotocol.com)
- **Discord**: [discord.gg/haloprotocol](https://discord.gg/haloprotocol)
- **GitHub Issues**: [github.com/haloprotocol/issues](https://github.com/haloprotocol/issues)

## 🙏 Acknowledgments

- **Base**: For the excellent blockchain infrastructure
- **Coinbase**: For OnchainKit and Smart Wallet SDK
- **OpenZeppelin**: For secure contract libraries
- **Aave**: For DeFi yield generation
- **Community**: For feedback and contributions

---

**Built with ❤️ for the Base ecosystem**