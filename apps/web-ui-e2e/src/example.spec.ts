/*
 * ================================================================
 * FILE: example.spec.ts
 * PATH: /apps/web-ui-e2e/src/example.spec.ts
 * DESCRIPTION: E2E tests for L-KERN v4 web-ui application
 * VERSION: v1.1.0
 * CREATED: 2025-10-13
 * UPDATED: 2025-12-16
 * ================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');

    // Expect h1 to contain the app title
    expect(await page.locator('h1').innerText()).toContain('L-KERN v4');
  });

  test('renders welcome subtitle', async ({ page }) => {
    await page.goto('/');

    // Should show welcome text (from translations)
    const subtitle = page.locator('p').first();
    await expect(subtitle).toBeVisible();
  });

  test('has theme toggle button', async ({ page }) => {
    await page.goto('/');

    // Find and verify theme toggle button exists
    const themeButton = page.getByRole('button', { name: /theme/i });
    await expect(themeButton).toBeVisible();
  });

  test('has language switch button', async ({ page }) => {
    await page.goto('/');

    // Find language toggle - shows current language (SK or EN)
    const languageButton = page.getByRole('button', { name: /SK|EN/i });
    await expect(languageButton).toBeVisible();
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/');

    // Check that navigation cards/links exist
    const cards = page.locator('[class*="card"]');
    await expect(cards.first()).toBeVisible();
  });
});
