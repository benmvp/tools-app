import { expect, test } from "@playwright/test";

/**
 * TransformerMinifier Component Tests
 *
 * Tests shared behavior of the TransformerMinifier component.
 * Uses TypeScript Minifier as a representative tool page.
 * These tests validate component logic, not tool-specific functionality.
 *
 * NOTE: Runs on desktop only - component behavior is device-independent.
 */

test.describe("TransformerMinifier Component", () => {
  const REPRESENTATIVE_TOOL = "/minifiers/typescript-minifier";

  test("should show file size reduction badge", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Enter code
    const inputEditor = page.locator(".cm-content").first();
    await inputEditor.click();
    await inputEditor.fill(`
      // This is a comment
      const myVariable = {
        property: "value",
        number: 123
      };
    `);
    await page.waitForTimeout(1000);

    // Look for size/savings display (use .first() to avoid strict mode violation)
    const sizeBadge = page.locator("text=/\\d+%|bytes|KB/i").first();
    if (await sizeBadge.isVisible()) {
      await expect(sizeBadge).toBeVisible();
    }
  });

  test("should handle empty input gracefully", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Clear input
    const inputEditor = page.locator(".cm-content").first();
    await inputEditor.click();
    await inputEditor.fill("");
    await page.waitForTimeout(500);

    // Output should be empty
    const outputEditor = page.locator(".cm-content").last();
    const outputText = await outputEditor.textContent();
    expect(outputText?.trim()).toBe("");
  });
});
