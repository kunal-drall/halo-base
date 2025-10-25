import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

// Test data
const TEST_USER = {
  address: '0x1234567890123456789012345678901234567890',
  privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234'
};

const TEST_CIRCLE = {
  name: 'E2E Test Circle',
  description: 'This is a test circle for E2E testing',
  contributionAmount: '1000',
  maxMembers: '4',
  cycleDuration: '7',
  minTrustTier: '2',
  minTrustScore: '500'
};

// Helper functions
async function waitForElement(page: Page, selector: string, timeout = 10000) {
  await page.waitForSelector(selector, { timeout });
}

async function clickAndWait(page: Page, selector: string) {
  await page.click(selector);
  await page.waitForLoadState('networkidle');
}

async function fillInput(page: Page, selector: string, value: string) {
  await page.fill(selector, value);
  await page.blur(selector);
}

async function mockWeb3Provider(page: Page) {
  await page.addInitScript(() => {
    // Mock Web3 provider
    window.ethereum = {
      isMetaMask: true,
      request: async (params: any) => {
        if (params.method === 'eth_requestAccounts') {
          return [TEST_USER.address];
        }
        if (params.method === 'eth_accounts') {
          return [TEST_USER.address];
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
          }
          if (params.params[0].to === '0x3a868f8F42Bb2F7aa39cCb6ceC3c3C7148959f20') {
            // CircleFactory
            if (params.params[0].data.includes('getTotalCircles')) {
              return '0x0000000000000000000000000000000000000000000000000000000000000000';
            }
          }
          if (params.params[0].to === '0x7D9bA621fb3E336a50e91aB7B27c3FEe1d5Fb39a') {
            // MockUSDC
            if (params.params[0].data.includes('balanceOf')) {
              return '0x0000000000000000000000000000000000000000000000000000000000000000';
            }
          }
          return '0x';
        }
        return null;
      },
      on: () => {},
      removeListener: () => {},
    };
  });
}

// Test suite
test.describe('Halo Protocol E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await mockWeb3Provider(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Landing Page Loads Correctly', async ({ page }) => {
    // Check if the page loads
    await expect(page).toHaveTitle(/Halo Protocol/);
    
    // Check for key elements
    await expect(page.locator('h1')).toContainText('Halo Protocol');
    await expect(page.locator('text=Community Lending Circles')).toBeVisible();
    
    // Check for connect wallet button
    await expect(page.locator('button:has-text("Connect Wallet")')).toBeVisible();
  });

  test('Wallet Connection Flow', async ({ page }) => {
    // Click connect wallet button
    await clickAndWait(page, 'button:has-text("Connect Wallet")');
    
    // Check if wallet connection modal appears
    await expect(page.locator('text=Connect Wallet')).toBeVisible();
    
    // Mock successful connection
    await page.evaluate(() => {
      window.ethereum.request({ method: 'eth_requestAccounts' });
    });
    
    // Wait for connection to complete
    await page.waitForTimeout(2000);
    
    // Check if user is connected
    await expect(page.locator('text=Connected')).toBeVisible();
  });

  test('Dashboard Navigation', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum.request({ method: 'eth_requestAccounts' });
    });
    
    await page.waitForTimeout(2000);
    
    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Check dashboard elements
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('text=Total Circles')).toBeVisible();
    await expect(page.locator('text=Active Circles')).toBeVisible();
    await expect(page.locator('text=Total Contributions')).toBeVisible();
  });

  test('Circle Discovery Flow', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum.request({ method: 'eth_requestAccounts' });
    });
    
    await page.waitForTimeout(2000);
    
    // Navigate to discover page
    await page.goto(`${BASE_URL}/discover`);
    await page.waitForLoadState('networkidle');
    
    // Check discover page elements
    await expect(page.locator('h1')).toContainText('Discover Circles');
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(page.locator('button:has-text("Filters")')).toBeVisible();
    
    // Test search functionality
    await fillInput(page, 'input[placeholder*="Search"]', 'test');
    await page.waitForTimeout(1000);
    
    // Test filters
    await clickAndWait(page, 'button:has-text("Filters")');
    await expect(page.locator('text=Contribution Amount')).toBeVisible();
    await expect(page.locator('text=Duration')).toBeVisible();
    await expect(page.locator('text=Trust Tier')).toBeVisible();
  });

  test('Create Circle Flow', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum.request({ method: 'eth_requestAccounts' });
    });
    
    await page.waitForTimeout(2000);
    
    // Navigate to create page
    await page.goto(`${BASE_URL}/create`);
    await page.waitForLoadState('networkidle');
    
    // Check create page elements
    await expect(page.locator('h1')).toContainText('Create a New Lending Circle');
    
    // Fill in circle details
    await fillInput(page, 'input[name="name"]', TEST_CIRCLE.name);
    await fillInput(page, 'textarea[name="description"]', TEST_CIRCLE.description);
    await fillInput(page, 'input[name="contributionAmount"]', TEST_CIRCLE.contributionAmount);
    await fillInput(page, 'input[name="maxMembers"]', TEST_CIRCLE.maxMembers);
    await fillInput(page, 'input[name="cycleDuration"]', TEST_CIRCLE.cycleDuration);
    
    // Select payout method
    await page.selectOption('select[name="payoutMethod"]', 'auction');
    
    // Check form validation
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
    
    // Submit form (mock the transaction)
    await page.route('**/eth_sendRawTransaction', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: '0x1234567890abcdef' })
      });
    });
    
    await clickAndWait(page, 'button[type="submit"]');
    
    // Check for success message
    await expect(page.locator('text=Circle created successfully')).toBeVisible();
  });

  test('My Circles Flow', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum.request({ method: 'eth_requestAccounts' });
    });
    
    await page.waitForTimeout(2000);
    
    // Navigate to my circles page
    await page.goto(`${BASE_URL}/my-circles`);
    await page.waitForLoadState('networkidle');
    
    // Check my circles page elements
    await expect(page.locator('h1')).toContainText('My Circles');
    await expect(page.locator('text=Total Circles')).toBeVisible();
    await expect(page.locator('text=Active Circles')).toBeVisible();
    
    // Test search functionality
    await fillInput(page, 'input[placeholder*="Search"]', 'test');
    await page.waitForTimeout(1000);
    
    // Test filters
    await clickAndWait(page, 'button:has-text("Filters")');
    await expect(page.locator('text=Status')).toBeVisible();
    await expect(page.locator('text=Payout Method')).toBeVisible();
  });

  test('Circle Detail Flow', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum.request({ method: 'eth_requestAccounts' });
    });
    
    await page.waitForTimeout(2000);
    
    // Navigate to a circle detail page
    await page.goto(`${BASE_URL}/circles/1`);
    await page.waitForLoadState('networkidle');
    
    // Check circle detail elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=Members')).toBeVisible();
    await expect(page.locator('text=Timeline')).toBeVisible();
    
    // Test tab navigation
    await clickAndWait(page, 'button:has-text("Members")');
    await expect(page.locator('text=Member List')).toBeVisible();
    
    await clickAndWait(page, 'button:has-text("Timeline")');
    await expect(page.locator('text=Activity Timeline')).toBeVisible();
  });

  test('Trust Score Flow', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum.request({ method: 'eth_requestAccounts' });
    });
    
    await page.waitForTimeout(2000);
    
    // Navigate to dashboard to see trust score
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Check trust score display
    await expect(page.locator('text=Trust Score')).toBeVisible();
    await expect(page.locator('text=750')).toBeVisible(); // Mocked score
    
    // Navigate to trust score page
    await page.goto(`${BASE_URL}/trust-score`);
    await page.waitForLoadState('networkidle');
    
    // Check trust score page elements
    await expect(page.locator('h1')).toContainText('Trust Score');
    await expect(page.locator('text=Score Breakdown')).toBeVisible();
    await expect(page.locator('text=History')).toBeVisible();
  });

  test('PWA Installation', async ({ page }) => {
    // Check if PWA install prompt appears
    await page.waitForTimeout(3000);
    
    // Check for install button
    const installButton = page.locator('button:has-text("Install")');
    if (await installButton.isVisible()) {
      await clickAndWait(page, 'button:has-text("Install")');
    }
    
    // Check for PWA status
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Check if PWA features are available
    await expect(page.locator('text=Offline')).toBeVisible();
  });

  test('Error Handling', async ({ page }) => {
    // Test network error handling
    await page.route('**/eth_call', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Network error' })
      });
    });
    
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum.request({ method: 'eth_requestAccounts' });
    });
    
    await page.waitForTimeout(2000);
    
    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Check for error handling
    await expect(page.locator('text=Error')).toBeVisible();
    await expect(page.locator('text=Failed to fetch')).toBeVisible();
  });

  test('Mobile Responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum.request({ method: 'eth_requestAccounts' });
    });
    
    await page.waitForTimeout(2000);
    
    // Test mobile navigation
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Check mobile layout
    await expect(page.locator('text=Dashboard')).toBeVisible();
    
    // Test mobile menu
    const mobileMenuButton = page.locator('button[aria-label="Menu"]');
    if (await mobileMenuButton.isVisible()) {
      await clickAndWait(page, 'button[aria-label="Menu"]');
      await expect(page.locator('text=Discover')).toBeVisible();
      await expect(page.locator('text=Create')).toBeVisible();
    }
  });

  test('Performance Metrics', async ({ page }) => {
    // Start performance monitoring
    await page.goto(BASE_URL);
    
    // Measure page load time
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Check if page loads within acceptable time
    expect(loadTime).toBeLessThan(5000); // 5 seconds
    
    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });
});

// Test cleanup
test.afterEach(async ({ page }) => {
  // Clear any stored data
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});
