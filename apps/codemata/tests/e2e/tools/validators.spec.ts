import { expect, test } from "@playwright/test";

/**
 * Validator Tool Tests
 * Tests URL Validator tool (one representative validator)
 * Runs on both desktop and mobile
 *
 * Per sample-based testing strategy:
 * - Tests ONE validator tool to validate server action integration
 * - Component behavior tested in tests/e2e/components/transformer-validator.spec.ts
 * - All validators use same page template, so testing one validates all
 */

test.describe("URL Validator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/validators/url-validator");
    await page.waitForLoadState("networkidle");
  });

  test("validates multiple URLs successfully", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Enter multiple valid URLs
    await inputEditor.click();
    await inputEditor.fill(`https://example.com
http://localhost:3000
https://api.github.com/users`);

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate URLs")');
    await validateButton.click();

    // Wait for success message
    const successText = page.locator("text=/All 3 URLs are valid/i");
    await expect(successText).toBeVisible({ timeout: 10000 });
  });

  test("displays errors for invalid URLs", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Enter mix of valid and invalid URLs
    await inputEditor.click();
    await inputEditor.fill(`https://example.com
example.com
not a url at all`);

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate URLs")');
    await validateButton.click();

    // Wait for error summary
    const errorSummary = page.locator("text=/2 errors found, 1 URL valid/i");
    await expect(errorSummary).toBeVisible({ timeout: 10000 });

    // Verify error messages are shown
    const errorHeading = page.locator('h3:has-text("Errors (2)")');
    await expect(errorHeading).toBeVisible();

    // Verify at least one error mentions missing protocol (use .first() to avoid strict mode)
    const errorMessage = page.locator("text=/Missing protocol/i").first();
    await expect(errorMessage).toBeVisible();
  });

  test("expands and shows URL metadata", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Enter URL with metadata
    await inputEditor.click();
    await inputEditor.fill(
      "https://example.com:8080/api/users?page=1&sort=name#results",
    );

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate URLs")');
    await validateButton.click();

    // Wait for valid URLs section
    await expect(page.locator('h3:has-text("Valid URLs (1)")')).toBeVisible({
      timeout: 10000,
    });

    // Find and click the URL card to expand
    const urlCard = page
      .locator("button")
      .filter({ hasText: "Line 1" })
      .first();
    await expect(urlCard).toBeVisible();
    await urlCard.click();

    // Verify metadata is displayed
    await expect(page.locator("text=/Protocol.*https:/i")).toBeVisible();
    await expect(page.locator("text=/Hostname.*example.com/i")).toBeVisible();
    await expect(page.locator("text=/Port.*8080/i")).toBeVisible();
    await expect(page.locator("text=/Path.*/api/users/i")).toBeVisible();
    await expect(page.locator("text=/Hash/i")).toBeVisible();
    await expect(page.locator("text=/results/i")).toBeVisible();

    // Verify query params table
    await expect(page.locator("text=/Query Parameters/i")).toBeVisible();
    await expect(page.locator("text=/page/i")).toBeVisible();
    await expect(page.locator("text=/sort/i")).toBeVisible();
  });
});
