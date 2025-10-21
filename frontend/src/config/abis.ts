// Simplified ABIs for contract interactions
// These include only the functions we'll use in the frontend

export const TRUST_SCORE_MANAGER_ABI = [
  {
    type: 'function',
    name: 'registerUser',
    inputs: [
      { name: 'user', type: 'address' },
      {
        name: 'metrics',
        type: 'tuple',
        components: [
          { name: 'paymentReliability', type: 'uint256' },
          { name: 'circleCompletions', type: 'uint256' },
          { name: 'defiHistory', type: 'uint256' },
          { name: 'socialVerification', type: 'uint256' },
          { name: 'lastUpdated', type: 'uint256' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'trustScores',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserMetrics',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'paymentReliability', type: 'uint256' },
          { name: 'circleCompletions', type: 'uint256' },
          { name: 'defiHistory', type: 'uint256' },
          { name: 'socialVerification', type: 'uint256' },
          { name: 'lastUpdated', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTier',
    inputs: [{ name: 'score', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'isRegistered',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
] as const;

export const CIRCLE_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createCircle',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'contributionAmount', type: 'uint256' },
          { name: 'cycleDuration', type: 'uint256' },
          { name: 'maxMembers', type: 'uint256' },
          { name: 'minTrustScore', type: 'uint256' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getCircleAddress',
    inputs: [{ name: 'circleId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCircleInfo',
    inputs: [{ name: 'circleId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'circleAddress', type: 'address' },
          { name: 'status', type: 'uint8' },
          { name: 'memberCount', type: 'uint256' },
          { name: 'contributionAmount', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTotalCircles',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addMember',
    inputs: [
      { name: 'circleId', type: 'uint256' },
      { name: 'member', type: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const LENDING_CIRCLE_ABI = [
  {
    type: 'function',
    name: 'contribute',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getCurrentCycleInfo',
    inputs: [],
    outputs: [
      { name: 'cycleNumber', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'totalContributed', type: 'uint256' },
      { name: 'payoutDistributed', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCircleStatus',
    inputs: [],
    outputs: [
      { name: 'isActive', type: 'bool' },
      { name: 'currentCycle', type: 'uint256' },
      { name: 'totalCycles', type: 'uint256' },
      { name: 'memberCount', type: 'uint256' },
      { name: 'contributionAmount', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllMembers',
    inputs: [],
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMember',
    inputs: [{ name: 'member', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'wallet', type: 'address' },
          { name: 'trustScore', type: 'uint256' },
          { name: 'contributionsMade', type: 'uint256' },
          { name: 'missedPayments', type: 'uint256' },
          { name: 'hasReceivedPayout', type: 'bool' },
          { name: 'isActive', type: 'bool' },
          { name: 'joinedAt', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const;

export const MOCK_USDC_ABI = [
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'mint',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

