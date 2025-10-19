# ================================================================
# L-KERN v4 - E2E Testing Guide (Playwright)
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\programming\testing-e2e.md
# Version: 1.0.0
# Created: 2025-10-19
# Updated: 2025-10-19
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Comprehensive guide for End-to-End (E2E) testing in L-KERN v4 using
#   Playwright. Covers browser automation, complete user flows, Page Object
#   Model pattern, debugging, and best practices for stable E2E tests.
# ================================================================

---

## 📋 Overview

**What is E2E Testing?**

End-to-End (E2E) testing tests **complete user journeys** from browser perspective using **real browser** and **real server**. Tests mimic actual user behavior (clicking, typing, navigating) in production-like environment.

**Key Characteristics:**
- ✅ Real browser automation (Chromium, Firefox, WebKit)
- ✅ Real server running (not mocks)
- ✅ Real database (test database, not production)
- ✅ Complete user flows (login → navigate → create → verify)
- ✅ Cross-browser testing (ensure compatibility)

**When to Use E2E Tests:**
- ✅ Critical user journeys (login, registration, checkout)
- ✅ Multi-page workflows (order creation, contact management)
- ✅ Authentication flows (login, logout, password reset)
- ✅ Search and filtering (type → results update → verify)
- ✅ Cross-browser compatibility (test on Chrome, Firefox, Safari)

**When NOT to Use E2E Tests:**
- ❌ Unit-level logic (use unit tests)
- ❌ Component rendering (use integration tests)
- ❌ API endpoint testing (use integration tests)
- ❌ Every possible edge case (too slow, use unit tests)

**E2E Tests in Testing Pyramid:**
```
         /\
        /E2E\         ← 5-10% - Critical user journeys ONLY
       /------\
      /Integr.\      ← 40-50% - Components + API stubs
     /----------\
    /   Unit     \   ← 40-50% - Business logic, utilities
   /--------------\
```

---

## ⚡ Quick Start

### Installation

**1. Install Playwright:**
```bash
cd apps/web-ui

# Install Playwright
npm install -D @playwright/test

# Install browsers (Chromium, Firefox, WebKit)
npx playwright install
```

**2. Create Playwright config:**
```bash
# Generate default config
npx playwright init
```

**3. Run tests:**
```bash
# All tests (headless)
npx playwright test

# UI mode (interactive)
npx playwright test --ui

# Debug mode (step-through)
npx playwright test --debug

# Specific file
npx playwright test tests/e2e/contacts.spec.ts

# Specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## 🔧 Playwright Configuration

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // === TEST DIRECTORY ===
  testDir: './tests/e2e',

  // === TIMEOUT CONFIGURATION ===
  timeout: 30 * 1000,  // 30s per test
  expect: {
    timeout: 5000,     // 5s for expect() assertions
  },

  // === PARALLEL EXECUTION ===
  fullyParallel: true,
  forbidOnly: !!process.env.CI,  // Fail on .only() in CI
  retries: process.env.CI ? 2 : 0,  // Retry flaky tests in CI
  workers: process.env.CI ? 1 : undefined,  // Parallel workers

  // === REPORTER ===
  reporter: [
    ['html'],              // HTML report
    ['list'],              // Console output
    ['junit', { outputFile: 'test-results/junit.xml' }],  // CI integration
  ],

  // === GLOBAL SETTINGS ===
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:5173',

    // Screenshot/video on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Trace for debugging
    trace: 'on-first-retry',

    // Browser context options
    viewport: { width: 1280, height: 720 },
    locale: 'sk-SK',
    timezoneId: 'Europe/Bratislava',
  },

  // === BROWSER PROJECTS ===
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // === WEB SERVER (start dev server automatically) ===
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,  // 2 min to start server
  },
});
```

**Key Configuration Points:**
- ✅ **baseURL** - All navigation uses relative paths (await page.goto('/contacts'))
- ✅ **webServer** - Automatically starts dev server before tests
- ✅ **trace** - Records network, console, screenshots for debugging
- ✅ **screenshot/video** - Only saved when tests fail (saves disk space)
- ✅ **projects** - Test on multiple browsers in parallel

---

## 🎯 E2E Test Examples

### Example 1: Login Flow

**Test complete authentication workflow:**

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    // === ARRANGE ===
    // Navigate to login page
    await page.goto('/login');

    // === ACT ===
    // Fill login form
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('SecurePassword123');

    // Click login button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // === ASSERT ===
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Verify welcome message
    await expect(page.getByText('Welcome back, Admin!')).toBeVisible();

    // Verify logout button is present
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('invalid credentials show error message', async ({ page }) => {
    await page.goto('/login');

    // Enter wrong credentials
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('WrongPassword');

    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify error message
    await expect(page.getByText('Invalid email or password')).toBeVisible();

    // Verify still on login page
    await expect(page).toHaveURL('/login');
  });

  test('empty form shows validation errors', async ({ page }) => {
    await page.goto('/login');

    // Click login without filling form
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('logout clears session and redirects to login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('SecurePassword123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/dashboard');

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();

    // Verify redirect to login
    await expect(page).toHaveURL('/login');

    // Verify cannot access dashboard without login
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');  // Auto-redirect
  });
});
```

**Key Points:**
- ✅ Use semantic selectors (getByRole, getByLabel)
- ✅ Test both success and error paths
- ✅ Verify redirects with toHaveURL()
- ✅ Test session persistence (logout flow)

---

### Example 2: Contact Creation Flow

**Test complete CRUD workflow:**

```typescript
// tests/e2e/contacts.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('SecurePassword123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/dashboard');

    // Navigate to contacts page
    await page.getByRole('link', { name: 'Contacts' }).click();
    await expect(page).toHaveURL('/contacts');
  });

  test('create new contact via modal', async ({ page }) => {
    // === ARRANGE ===
    // Click "New Contact" button
    await page.getByRole('button', { name: 'New Contact' }).click();

    // Verify modal opened
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Create New Contact')).toBeVisible();

    // === ACT ===
    // Fill contact form
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john.doe@example.com');
    await page.getByLabel('Phone').fill('+421 900 123 456');
    await page.getByLabel('Company').fill('ACME Corporation');

    // Submit form
    await page.getByRole('button', { name: 'Save' }).click();

    // === ASSERT ===
    // Verify modal closed
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Verify success notification
    await expect(page.getByText('Contact created successfully')).toBeVisible();

    // Verify contact appears in list
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('john.doe@example.com')).toBeVisible();
    await expect(page.getByText('ACME Corporation')).toBeVisible();
  });

  test('search filters contact list', async ({ page }) => {
    // Type in search box
    await page.getByPlaceholder('Search contacts...').fill('John');

    // Wait for results to update
    await page.waitForTimeout(500);  // Debounce delay

    // Verify filtered results
    await expect(page.getByText('John Doe')).toBeVisible();

    // Verify other contacts hidden
    await expect(page.getByText('Jane Smith')).not.toBeVisible();
  });

  test('edit existing contact', async ({ page }) => {
    // Click edit button for specific contact
    await page
      .getByRole('row', { name: /John Doe/ })
      .getByRole('button', { name: 'Edit' })
      .click();

    // Verify modal opened with existing data
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByLabel('Name')).toHaveValue('John Doe');

    // Update contact
    await page.getByLabel('Phone').fill('+421 900 999 888');
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify update
    await expect(page.getByText('Contact updated successfully')).toBeVisible();
    await expect(page.getByText('+421 900 999 888')).toBeVisible();
  });

  test('delete contact with confirmation', async ({ page }) => {
    // Click delete button
    await page
      .getByRole('row', { name: /John Doe/ })
      .getByRole('button', { name: 'Delete' })
      .click();

    // Verify confirmation dialog
    await expect(page.getByText('Are you sure?')).toBeVisible();

    // Confirm deletion
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Verify contact removed
    await expect(page.getByText('Contact deleted successfully')).toBeVisible();
    await expect(page.getByText('John Doe')).not.toBeVisible();
  });

  test('validation prevents invalid contact', async ({ page }) => {
    await page.getByRole('button', { name: 'New Contact' }).click();

    // Try to save without filling required fields
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify validation errors
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();

    // Fill invalid email
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify email validation
    await expect(page.getByText('Invalid email format')).toBeVisible();
  });
});
```

**Key Points:**
- ✅ Use beforeEach() for common setup (login, navigation)
- ✅ Test entire workflow (open modal → fill → save → verify)
- ✅ Wait for async operations (waitForTimeout for debounce)
- ✅ Use data-testid for complex selectors (if needed)

---

### Example 3: Search and Filter Workflow

**Test interactive UI updates:**

```typescript
// tests/e2e/search-filter.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Search and Filter', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to orders page
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('SecurePassword123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.getByRole('link', { name: 'Orders' }).click();
    await expect(page).toHaveURL('/orders');
  });

  test('search updates results in real-time', async ({ page }) => {
    // Verify initial state (all orders visible)
    await expect(page.getByRole('row')).toHaveCount(10);  // 9 orders + header

    // Type in search box
    await page.getByPlaceholder('Search orders...').fill('John');

    // Wait for debounce (300ms)
    await page.waitForTimeout(500);

    // Verify filtered results
    await expect(page.getByRole('row')).toHaveCount(3);  // 2 matches + header
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Johnathan Smith')).toBeVisible();

    // Clear search
    await page.getByPlaceholder('Search orders...').clear();
    await page.waitForTimeout(500);

    // Verify all orders visible again
    await expect(page.getByRole('row')).toHaveCount(10);
  });

  test('status filter updates results', async ({ page }) => {
    // Click status filter dropdown
    await page.getByRole('button', { name: 'Status' }).click();

    // Select "Pending" status
    await page.getByRole('option', { name: 'Pending' }).click();

    // Verify only pending orders visible
    await expect(page.getByText('Status: Pending')).toHaveCount(4);
    await expect(page.getByText('Status: Completed')).toHaveCount(0);

    // Select "All Statuses"
    await page.getByRole('button', { name: 'Status' }).click();
    await page.getByRole('option', { name: 'All' }).click();

    // Verify all orders visible
    await expect(page.getByRole('row')).toHaveCount(10);
  });

  test('date range filter works correctly', async ({ page }) => {
    // Open date picker
    await page.getByLabel('Start Date').click();

    // Select start date (Oct 1, 2025)
    await page.getByRole('button', { name: '1' }).first().click();

    // Select end date (Oct 15, 2025)
    await page.getByLabel('End Date').click();
    await page.getByRole('button', { name: '15' }).first().click();

    // Click "Apply Filter"
    await page.getByRole('button', { name: 'Apply Filter' }).click();

    // Verify only orders in date range visible
    await expect(page.getByRole('row')).toHaveCount(6);  // 5 orders + header

    // Verify no orders outside date range
    await expect(page.getByText('2025-09-15')).not.toBeVisible();  // Before range
    await expect(page.getByText('2025-10-20')).not.toBeVisible();  // After range
  });

  test('combine search and filters', async ({ page }) => {
    // Search by name
    await page.getByPlaceholder('Search orders...').fill('John');
    await page.waitForTimeout(500);

    // Apply status filter
    await page.getByRole('button', { name: 'Status' }).click();
    await page.getByRole('option', { name: 'Completed' }).click();

    // Verify combined results
    await expect(page.getByRole('row')).toHaveCount(2);  // 1 match + header
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Status: Completed')).toBeVisible();
  });

  test('clear all filters button resets state', async ({ page }) => {
    // Apply multiple filters
    await page.getByPlaceholder('Search orders...').fill('John');
    await page.getByRole('button', { name: 'Status' }).click();
    await page.getByRole('option', { name: 'Pending' }).click();

    // Verify filters active
    await expect(page.getByRole('row')).toHaveCount(2);  // Filtered

    // Click "Clear Filters"
    await page.getByRole('button', { name: 'Clear Filters' }).click();

    // Verify all filters cleared
    await expect(page.getByPlaceholder('Search orders...')).toHaveValue('');
    await expect(page.getByRole('row')).toHaveCount(10);  // All orders
  });
});
```

**Key Points:**
- ✅ Use waitForTimeout() for debounce delays
- ✅ Verify element counts (toHaveCount)
- ✅ Test filter combinations
- ✅ Test reset/clear functionality

---

## 🏗️ Page Object Model (POM)

**Problem:** Tests become hard to maintain when selectors change.

**Solution:** Extract page interactions into reusable Page Objects.

### Example: Login Page Object

```typescript
// tests/e2e/pages/LoginPage.ts
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  // === LOCATORS ===
  readonly emailInput = () => this.page.getByLabel('Email');
  readonly passwordInput = () => this.page.getByLabel('Password');
  readonly signInButton = () => this.page.getByRole('button', { name: 'Sign In' });
  readonly errorMessage = () => this.page.getByRole('alert');

  // === ACTIONS ===
  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.signInButton().click();
  }

  async loginAsAdmin() {
    await this.login('admin@example.com', 'SecurePassword123');
  }

  // === ASSERTIONS ===
  async expectLoginSuccess() {
    await expect(this.page).toHaveURL('/dashboard');
  }

  async expectError(message: string) {
    await expect(this.errorMessage()).toContainText(message);
  }

  async expectValidationError(field: string, message: string) {
    await expect(this.page.getByText(`${field} ${message}`)).toBeVisible();
  }
}
```

### Example: Contacts Page Object

```typescript
// tests/e2e/pages/ContactsPage.ts
import { Page, expect } from '@playwright/test';

export class ContactsPage {
  constructor(private page: Page) {}

  // === LOCATORS ===
  readonly newContactButton = () => this.page.getByRole('button', { name: 'New Contact' });
  readonly modal = () => this.page.getByRole('dialog');
  readonly searchInput = () => this.page.getByPlaceholder('Search contacts...');

  // Form fields
  readonly nameInput = () => this.page.getByLabel('Name');
  readonly emailInput = () => this.page.getByLabel('Email');
  readonly phoneInput = () => this.page.getByLabel('Phone');
  readonly companyInput = () => this.page.getByLabel('Company');
  readonly saveButton = () => this.page.getByRole('button', { name: 'Save' });

  // === ACTIONS ===
  async goto() {
    await this.page.goto('/contacts');
  }

  async openNewContactModal() {
    await this.newContactButton().click();
    await expect(this.modal()).toBeVisible();
  }

  async createContact(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  }) {
    await this.openNewContactModal();

    await this.nameInput().fill(data.name);
    await this.emailInput().fill(data.email);

    if (data.phone) await this.phoneInput().fill(data.phone);
    if (data.company) await this.companyInput().fill(data.company);

    await this.saveButton().click();
  }

  async searchContacts(query: string) {
    await this.searchInput().fill(query);
    await this.page.waitForTimeout(500);  // Debounce
  }

  async editContact(name: string, updates: { phone?: string }) {
    await this.page
      .getByRole('row', { name: new RegExp(name) })
      .getByRole('button', { name: 'Edit' })
      .click();

    await expect(this.modal()).toBeVisible();

    if (updates.phone) {
      await this.phoneInput().fill(updates.phone);
    }

    await this.saveButton().click();
  }

  async deleteContact(name: string) {
    await this.page
      .getByRole('row', { name: new RegExp(name) })
      .getByRole('button', { name: 'Delete' })
      .click();

    await this.page.getByRole('button', { name: 'Confirm' }).click();
  }

  // === ASSERTIONS ===
  async expectContactVisible(name: string) {
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async expectContactNotVisible(name: string) {
    await expect(this.page.getByText(name)).not.toBeVisible();
  }

  async expectSuccessMessage(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
```

### Using Page Objects in Tests

```typescript
// tests/e2e/contacts-with-pom.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { ContactsPage } from './pages/ContactsPage';

test.describe('Contact Management (with POM)', () => {
  let loginPage: LoginPage;
  let contactsPage: ContactsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    contactsPage = new ContactsPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginAsAdmin();
    await loginPage.expectLoginSuccess();

    // Navigate to contacts
    await contactsPage.goto();
  });

  test('create new contact', async ({ page }) => {
    await contactsPage.createContact({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+421 900 123 456',
      company: 'ACME Corporation',
    });

    await contactsPage.expectSuccessMessage('Contact created successfully');
    await contactsPage.expectContactVisible('John Doe');
    await contactsPage.expectContactVisible('john.doe@example.com');
  });

  test('search filters contacts', async ({ page }) => {
    await contactsPage.searchContacts('John');

    await contactsPage.expectContactVisible('John Doe');
    await contactsPage.expectContactNotVisible('Jane Smith');
  });

  test('edit contact updates data', async ({ page }) => {
    await contactsPage.editContact('John Doe', {
      phone: '+421 900 999 888',
    });

    await contactsPage.expectSuccessMessage('Contact updated successfully');
    await contactsPage.expectContactVisible('+421 900 999 888');
  });
});
```

**Benefits of POM:**
- ✅ Reusable code (DRY)
- ✅ Easier maintenance (selectors in one place)
- ✅ Readable tests (high-level actions)
- ✅ Type safety (TypeScript autocompletion)

---

## 🎯 Best Practices for E2E Tests

### 1. Use Stable Selectors

**Selector Priority (Best to Worst):**

```typescript
// ✅ BEST - Semantic roles (accessible)
await page.getByRole('button', { name: 'Save' });
await page.getByRole('link', { name: 'Contacts' });

// ✅ GOOD - Labels (accessible)
await page.getByLabel('Email');
await page.getByLabel('Password');

// ✅ GOOD - Placeholder
await page.getByPlaceholder('Search contacts...');

// ✅ ACCEPTABLE - Text content
await page.getByText('Welcome back, Admin!');

// ⚠️ USE SPARINGLY - data-testid (stable but non-semantic)
await page.getByTestId('contact-modal');

// ❌ AVOID - CSS selectors (brittle)
await page.locator('.modal-container > div:nth-child(2)');

// ❌ NEVER - XPath (very brittle)
await page.locator('//div[@class="modal"]/button[1]');
```

**Why?**
- Semantic selectors break less often
- Accessible selectors improve a11y
- CSS selectors break when styling changes

---

### 2. Use data-testid for Stable Selectors

**When to use data-testid:**
- ✅ No semantic role available
- ✅ Multiple identical elements (e.g., delete buttons in table rows)
- ✅ Complex UI components

**Example:**

```typescript
// Component
<div data-testid="contact-modal">
  <button data-testid="save-contact">Save</button>
</div>

// Test
await page.getByTestId('contact-modal');
await page.getByTestId('save-contact').click();
```

**L-KERN Standard:**
- ✅ Use `data-testid` for complex components
- ✅ Prefix with component name: `contact-modal`, `order-form`
- ✅ Keep testid values in constants (DRY)

---

### 3. Test Critical User Journeys Only

**DO test (5-10% of total tests):**
- ✅ Login → Dashboard (authentication flow)
- ✅ Create contact → Verify in list (CRUD workflow)
- ✅ Search → Filter → Verify results (interactive UI)
- ✅ Multi-step wizard (complex forms)

**DON'T test (use unit/integration instead):**
- ❌ Button color changes on hover (visual test or skip)
- ❌ Input validation messages (unit test)
- ❌ API response parsing (integration test)

**Why?**
- E2E tests are slow (seconds vs milliseconds)
- E2E tests are expensive (browser automation overhead)
- E2E tests are flaky (network, timing issues)

---

### 4. Avoid Hard-Coded Timeouts

**❌ WRONG - Hard-coded timeout:**
```typescript
await page.waitForTimeout(3000);  // Slow and flaky
```

**✅ CORRECT - Wait for specific condition:**
```typescript
// Wait for element
await page.waitForSelector('[data-testid="contact-list"]');

// Wait for network idle
await page.waitForLoadState('networkidle');

// Wait for URL change
await page.waitForURL('/contacts');

// Wait for function
await page.waitForFunction(() => document.querySelectorAll('.contact').length > 0);
```

**Playwright Auto-Wait:**
Most Playwright actions auto-wait (no manual waiting needed):

```typescript
// Auto-waits for button to be visible and enabled
await page.getByRole('button', { name: 'Save' }).click();

// Auto-waits for input to be editable
await page.getByLabel('Email').fill('test@example.com');
```

---

### 5. Use Test Isolation (Independent Tests)

**✅ CORRECT - Independent tests:**
```typescript
test('create contact', async ({ page }) => {
  // Test creates its own data
  await createContact({ name: 'John Doe' });
  await expect(page.getByText('John Doe')).toBeVisible();
});

test('delete contact', async ({ page }) => {
  // Test creates its own data (independent)
  await createContact({ name: 'Jane Smith' });
  await deleteContact('Jane Smith');
  await expect(page.getByText('Jane Smith')).not.toBeVisible();
});
```

**❌ WRONG - Dependent tests:**
```typescript
test('create contact', async ({ page }) => {
  await createContact({ name: 'John Doe' });
});

test('delete contact', async ({ page }) => {
  // FLAKY! Depends on previous test
  await deleteContact('John Doe');
});
```

**Why?**
- Tests run in parallel (order not guaranteed)
- Dependent tests fail unpredictably
- Isolation makes debugging easier

---

### 6. Clean Up Test Data

**Best practice: Use beforeEach/afterEach hooks:**

```typescript
test.describe('Contacts', () => {
  let testContactId: string;

  test.beforeEach(async ({ page }) => {
    // Create test data
    testContactId = await createTestContact({
      name: 'Test User',
      email: 'test@example.com',
    });
  });

  test.afterEach(async ({ page }) => {
    // Clean up test data
    await deleteTestContact(testContactId);
  });

  test('edit contact', async ({ page }) => {
    // Test uses pre-created data
    await editContact(testContactId, { phone: '+421900123456' });
  });
});
```

**Alternative: Use separate test database:**
```bash
# Reset test DB before each run
npm run db:reset:test
npx playwright test
```

---

## 🔍 Debugging E2E Tests

### Debug Mode (Step-Through)

```bash
# Run in debug mode (pauses before each action)
npx playwright test --debug

# Debug specific test
npx playwright test --debug tests/e2e/contacts.spec.ts
```

**Debug UI features:**
- ✅ Step through test line-by-line
- ✅ Inspect page DOM at each step
- ✅ View network requests
- ✅ Console output
- ✅ Screenshots at each step

---

### Trace Viewer (Post-Mortem Debugging)

**Enable trace in config:**
```typescript
use: {
  trace: 'on-first-retry',  // Record trace on failure
}
```

**View trace after test failure:**
```bash
npx playwright show-trace trace.zip
```

**Trace viewer shows:**
- ✅ Screenshots at each step
- ✅ Network requests/responses
- ✅ Console logs
- ✅ DOM snapshots
- ✅ Action timeline

---

### Screenshot on Failure

**Automatic screenshots:**
```typescript
use: {
  screenshot: 'only-on-failure',
}
```

**Manual screenshot:**
```typescript
test('my test', async ({ page }) => {
  await page.screenshot({ path: 'screenshot.png' });

  // Full page screenshot
  await page.screenshot({ path: 'full-page.png', fullPage: true });
});
```

---

### Console Logs

**Capture browser console:**
```typescript
test('capture console', async ({ page }) => {
  page.on('console', (msg) => {
    console.log('Browser console:', msg.text());
  });

  await page.goto('/contacts');
});
```

**Capture network requests:**
```typescript
test('capture network', async ({ page }) => {
  page.on('request', (request) => {
    console.log('Request:', request.url());
  });

  page.on('response', (response) => {
    console.log('Response:', response.url(), response.status());
  });

  await page.goto('/contacts');
});
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Flaky Tests (Random Failures)

**Cause:** Race conditions, timing issues

**Solutions:**

```typescript
// ❌ WRONG - Hard timeout
await page.waitForTimeout(3000);

// ✅ CORRECT - Wait for specific condition
await page.waitForSelector('[data-testid="contact-list"]');

// ✅ CORRECT - Use auto-wait
await expect(page.getByText('Loaded')).toBeVisible();

// ✅ CORRECT - Wait for network
await page.waitForLoadState('networkidle');
```

---

### Issue 2: Element Not Found

**Cause:** Element not yet rendered, wrong selector

**Solutions:**

```typescript
// ❌ WRONG - Element not yet rendered
expect(page.getByText('Loading...')).toBeVisible();

// ✅ CORRECT - Wait for element
await expect(page.getByText('Loading...')).toBeVisible();

// ✅ DEBUG - Print page content
await page.screenshot({ path: 'debug.png' });
console.log(await page.content());
```

---

### Issue 3: Timeout Errors

**Cause:** Slow network, slow server

**Solutions:**

```typescript
// Increase timeout per test
test('slow test', async ({ page }) => {
  test.setTimeout(60000);  // 60s timeout

  await page.goto('/slow-page');
});

// Increase timeout globally (playwright.config.ts)
export default defineConfig({
  timeout: 60 * 1000,  // 60s
});
```

---

### Issue 4: Authentication in Every Test

**Problem:** Slow to login before each test

**Solution: Reuse authentication state:**

```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Login once
  await page.goto('http://localhost:5173/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('SecurePassword123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Save authentication state
  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
}

export default globalSetup;

// playwright.config.ts
export default defineConfig({
  globalSetup: './global-setup.ts',

  use: {
    storageState: 'auth.json',  // Reuse auth state
  },
});

// Now all tests are pre-authenticated!
```

---

## 🚀 Running E2E Tests in CI/CD

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Start dev server
        run: npm run dev &

      - name: Wait for server
        run: npx wait-on http://localhost:5173

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-results
          path: test-results/
```

---

## 📊 E2E vs Integration vs Unit

**When to use each test type:**

| Test Type | Example | Speed | Confidence | Maintenance |
|-----------|---------|-------|------------|-------------|
| **Unit** | `validateEmail('test@example.com')` | ⚡ Fast (ms) | 🔵 Low | ✅ Easy |
| **Integration** | `ContactForm + MSW stub` | ⚡ Medium (100ms) | 🟡 Medium | ⚠️ Medium |
| **E2E** | Login → Create contact → Verify | 🐌 Slow (5s) | 🟢 High | ❌ Hard |

**Decision Tree:**

```
Is it a pure function?
├─ YES → Unit Test
└─ NO → Continue...

Does it interact with API?
├─ YES → Integration Test (with MSW)
└─ NO → Continue...

Is it a critical user journey?
├─ YES → E2E Test (Playwright)
└─ NO → Unit or Integration Test
```

---

## 📚 Summary

**E2E Testing Covers:**
- ✅ Complete user journeys (login, registration, checkout)
- ✅ Multi-page workflows (create → edit → delete)
- ✅ Authentication flows (login → logout → protected routes)
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)
- ✅ Real browser + real server (production-like environment)

**E2E Testing Does NOT Cover:**
- ❌ Unit-level logic (use unit tests)
- ❌ Component rendering (use integration tests)
- ❌ API endpoint validation (use integration tests)
- ❌ Every edge case (too slow, use unit tests)

**Key Takeaways:**
1. **Use Playwright** for cross-browser E2E testing
2. **Test critical flows only** (5-10% of total tests)
3. **Use Page Object Model** for maintainability
4. **Avoid hard-coded timeouts** (use auto-wait)
5. **Run in CI/CD** for automated regression testing

**Next Steps:**
1. Read [testing-overview.md](testing-overview.md) for testing strategy
2. Read [testing-unit.md](testing-unit.md) for unit testing patterns
3. Read [testing-integration.md](testing-integration.md) for API mocking with MSW
4. Read [testing-best-practices.md](testing-best-practices.md) for common pitfalls

---

**Last Updated:** 2025-10-19
**Maintainer:** BOSSystems s.r.o.
**Documentation Location:** `L:\system\lkern_codebase_v4_act\docs\programming\`
