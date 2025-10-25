import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up global test environment...');

  // Start browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the application to be ready
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check if the application is running
    const title = await page.title();
    if (!title.includes('Halo Protocol')) {
      throw new Error('Application not ready or not running');
    }

    console.log('✅ Application is ready for testing');
    
    // Set up test data or initial state if needed
    await setupTestData(page);
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function setupTestData(page: any) {
  console.log('📊 Setting up test data...');
  
  // Mock Web3 provider for all tests
  await page.addInitScript(() => {
    // Mock Web3 provider
    window.ethereum = {
      isMetaMask: true,
      isCoinbaseWallet: true,
      request: async (params: any) => {
        console.log('Mock Web3 request:', params);
        
        if (params.method === 'eth_requestAccounts') {
          return ['0x1234567890123456789012345678901234567890'];
        }
        if (params.method === 'eth_accounts') {
          return ['0x1234567890123456789012345678901234567890'];
        }
        if (params.method === 'eth_chainId') {
          return '0x14a34'; // Base Sepolia
        }
        if (params.method === 'eth_getBalance') {
          return '0x56bc75e2d630e0000'; // 100 ETH
        }
        if (params.method === 'eth_call') {
          // Mock contract calls
          if (params.params[0].to === '0x1F08A0135B843c7f7276F7DAa70e69eD0eE7eF55') {
            // TrustScoreManager
            if (params.params[0].data.includes('isRegistered')) {
              return '0x0000000000000000000000000000000000000000000000000000000000000001';
            }
            if (params.params[0].data.includes('getTrustScore')) {
              return '0x00000000000000000000000000000000000000000000000000000000000002ee'; // 750
            }
            if (params.params[0].data.includes('getTrustTier')) {
              return '0x0000000000000000000000000000000000000000000000000000000000000003'; // 3
            }
          }
          if (params.params[0].to === '0x3a868f8F42Bb2F7aa39cCb6ceC3c3C7148959f20') {
            // CircleFactory
            if (params.params[0].data.includes('getTotalCircles')) {
              return '0x0000000000000000000000000000000000000000000000000000000000000000';
            }
            if (params.params[0].data.includes('getCircleAddress')) {
              return '0x0000000000000000000000000000000000000000000000000000000000000000';
            }
          }
          if (params.params[0].to === '0x7D9bA621fb3E336a50e91aB7B27c3FEe1d5Fb39a') {
            // MockUSDC
            if (params.params[0].data.includes('balanceOf')) {
              return '0x0000000000000000000000000000000000000000000000000000000000000000';
            }
            if (params.params[0].data.includes('decimals')) {
              return '0x0000000000000000000000000000000000000000000000000000000000000006';
            }
          }
          if (params.params[0].to === '0xe5A53477eCb384547C753A97c8cD1D23A799edB0') {
            // YieldManager
            if (params.params[0].data.includes('getAPY')) {
              return '0x0000000000000000000000000000000000000000000000000000000000000000';
            }
          }
          return '0x';
        }
        if (params.method === 'eth_sendRawTransaction') {
          return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        }
        if (params.method === 'eth_getTransactionReceipt') {
          return {
            status: '0x1',
            transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            blockNumber: '0x1',
            gasUsed: '0x5208'
          };
        }
        return null;
      },
      on: () => {},
      removeListener: () => {},
    };
    
    // Mock localStorage
    const mockStorage = {
      getItem: (key: string) => {
        const data = {
          'wagmi.store': JSON.stringify({
            state: {
              connections: new Map(),
              current: '0x1234567890123456789012345678901234567890'
            }
          }),
          'pwa-install-dismissed': 'false'
        };
        return data[key] || null;
      },
      setItem: (key: string, value: string) => {
        // Mock implementation
      },
      removeItem: (key: string) => {
        // Mock implementation
      },
      clear: () => {
        // Mock implementation
      }
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    });
    
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: mockStorage,
      writable: true
    });
    
    // Mock fetch for API calls
    const originalFetch = window.fetch;
    window.fetch = async (url: string | URL | Request, init?: RequestInit) => {
      const urlString = url.toString();
      
      // Mock API responses
      if (urlString.includes('/api/trust-score')) {
        return new Response(JSON.stringify({
          trustScore: 750,
          trustTier: 3,
          isRegistered: true
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (urlString.includes('/api/circles')) {
        return new Response(JSON.stringify({
          circles: [],
          total: 0
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (urlString.includes('/api/contributions')) {
        return new Response(JSON.stringify({
          contributions: [],
          total: 0
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Fallback to original fetch
      return originalFetch(url, init);
    };
    
    // Mock IntersectionObserver
    class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    
    Object.defineProperty(window, 'IntersectionObserver', {
      value: MockIntersectionObserver,
      writable: true
    });
    
    // Mock ResizeObserver
    class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    
    Object.defineProperty(window, 'ResizeObserver', {
      value: MockResizeObserver,
      writable: true
    });
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: (query: string) => ({
        matches: query.includes('(max-width: 768px)') ? false : true,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {}
      }),
      writable: true
    });
  });

  console.log('✅ Test data setup completed');
}

export default globalSetup;
