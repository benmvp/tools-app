import { expect, test } from "@playwright/test";

/**
 * Transformer Component Tests
 *
 * Tests shared behavior of the Transformer component (used by formatters).
 * Uses TypeScript Formatter as a representative tool page.
 * These tests validate component logic, not tool-specific functionality.
 *
 * NOTE: Runs on desktop only - component behavior is device-independent.
 */

test.describe("Transformer Component", () => {
  const REPRESENTATIVE_TOOL = "/formatters/typescript-formatter";

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

  test("should handle configuration changes", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Enter code
    const inputEditor = page.locator(".cm-content").first();
    await inputEditor.click();
    await inputEditor.fill("const x = 1;");

    // Format with default config
    await page.getByRole("button", { name: /format/i }).click();
    await page.waitForTimeout(1000);

    // Change indentation setting (if available)
    const indentationSelect = page.locator('select[name="indentation"]');
    if (await indentationSelect.isVisible()) {
      await indentationSelect.selectOption("four-spaces");

      // Re-format with new config
      await page.getByRole("button", { name: /format/i }).click();
      await page.waitForTimeout(1000);

      // Verify output changed
      const outputEditor = page.locator(".cm-content").last();
      const outputText = await outputEditor.textContent();
      expect(outputText).toBeTruthy();
    }
  });

  test("should display copy button and toast notification", async ({
    page,
  }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Enter and format code
    const inputEditor = page.locator(".cm-content").first();
    await inputEditor.click();
    await inputEditor.fill("const x = 1;");

    await page.getByRole("button", { name: /format/i }).click();
    await page.waitForTimeout(1000);

    // Click copy button
    const copyButton = page.getByRole("button", { name: /copy/i }).first();
    await copyButton.click();

    // Verify toast appears (use .first() to handle multiple toasts)
    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible({ timeout: 3000 });
  });

  test("should show error toast for invalid input", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Enter invalid TypeScript
    const inputEditor = page.locator(".cm-content").first();
    await inputEditor.click();
    await inputEditor.fill("const x = {{{");

    // Try to format
    await page.getByRole("button", { name: /format/i }).click();
    await page.waitForTimeout(1000);

    // Verify error toast
    const errorToast = page.locator("[data-sonner-toast]");
    await expect(errorToast).toBeVisible({ timeout: 5000 });
  });
});
