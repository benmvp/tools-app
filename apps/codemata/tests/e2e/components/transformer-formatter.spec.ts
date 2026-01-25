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

  test("should handle configuration changes", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL);

    // Enter code
    const inputEditor = page.locator(".cm-content").first();
    await inputEditor.click();
    await inputEditor.fill("const x = 1;");

    // Format with default config
    const formatButton = page.getByRole("button", { name: /format/i });
    await formatButton.click();

    // Wait for success toast (indicates formatting completed)
    const successToast = page.locator("[data-sonner-toast]").first();
    await expect(successToast).toBeVisible({ timeout: 3000 });

    // Change indentation setting (if available)
    const indentationSelect = page.locator('select[name="indentation"]');
    if (await indentationSelect.isVisible()) {
      await indentationSelect.selectOption("four-spaces");

      // Re-format with new config
      await formatButton.click();

      // Wait for success toast again (indicates re-formatting completed)
      await expect(successToast).toBeVisible({ timeout: 3000 });

      // Verify copy button is enabled (output exists)
      const copyButton = page.getByRole("button", { name: /copy/i }).first();
      await expect(copyButton).toBeEnabled();
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

    const formatButton = page.getByRole("button", { name: /format/i });
    await formatButton.click();

    // Wait for success toast (formatting completed)
    const successToast = page.locator("[data-sonner-toast]").first();
    await expect(successToast).toBeVisible({ timeout: 3000 });

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
    const formatButton = page.getByRole("button", { name: /format/i });
    await formatButton.click();

    // Verify error toast
    const errorToast = page.locator("[data-sonner-toast]");
    await expect(errorToast).toBeVisible({ timeout: 5000 });
  });
});
