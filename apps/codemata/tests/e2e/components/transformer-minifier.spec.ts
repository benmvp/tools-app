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

  test("should handle empty input gracefully", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Clear input
    const inputEditor = page.locator(".cm-content").first();
    await inputEditor.click();
    await inputEditor.press("Meta+A");
    await inputEditor.press("Backspace");

    // Verify minify button is disabled when input is empty (the actual behavior we care about)
    // Wait for React to re-render after input change (especially important in CI)
    const minifyButton = page.getByRole("button", { name: /minify/i });
    await expect(minifyButton).toBeDisabled({ timeout: 5000 });
  });
});
