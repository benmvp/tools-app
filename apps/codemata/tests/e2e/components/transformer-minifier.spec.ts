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

    // Wait for size/savings display to appear (minification happens automatically)
    const sizeBadge = page.locator("text=/\\d+%|bytes|KB/i").first();
    await expect(sizeBadge).toBeVisible({ timeout: 3000 });
  });
});
