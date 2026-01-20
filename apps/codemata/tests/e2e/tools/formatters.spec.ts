import { expect, test } from "@playwright/test";
import { FORMATTER_TOOLS } from "../../../lib/tools-data";
import { FORMATTER_SAMPLES } from "../../fixtures/samples";

test.describe("Formatter Tools", () => {
  // Auto-generate tests for all formatters
  for (const [, tool] of Object.entries(FORMATTER_TOOLS)) {
    // Get sample data for this tool
    const sampleKey = tool.id as keyof typeof FORMATTER_SAMPLES;
    const sample = FORMATTER_SAMPLES[sampleKey];

    // Only create test suite if fixture exists
    if (!sample) continue;

    test.describe(tool.name, () => {
      test("should format valid code successfully", async ({ page }) => {
        await page.goto(tool.url);

        // Verify page loaded - check metadata title, not display name
        await expect(page).toHaveTitle(new RegExp(tool.metadata.title, "i"));

        // Find input editor and paste code
        const inputEditor = page.locator(".cm-content").first();
        await inputEditor.click();
        await inputEditor.fill(sample.valid);

        // Click the Format button
        await page.getByRole("button", { name: /format/i }).click();

        // Wait for output editor to have content (server action + re-render)
        const outputEditor = page.locator(".cm-content").last();
        await expect(outputEditor).not.toBeEmpty({ timeout: 5000 });
        const outputText = await outputEditor.textContent();
        expect(outputText).toBeTruthy();
        expect(outputText?.length).toBeGreaterThan(0);
      });

      test("should handle configuration changes", async ({ page }) => {
        await page.goto(tool.url);

        // Enter code
        const inputEditor = page.locator(".cm-content").first();
        await inputEditor.click();
        await inputEditor.fill(sample.valid);

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

      if ("invalid" in sample && sample.invalid) {
        test("should show error for invalid code", async ({ page }) => {
          await page.goto(tool.url);

          // Enter invalid code
          const inputEditor = page.locator(".cm-content").first();
          await inputEditor.click();
          await inputEditor.fill(sample.invalid);

          // Click Format button
          await page.getByRole("button", { name: /format/i }).click();
          await page.waitForTimeout(1000);

          // Verify error toast appears (Sonner toast library)
          const errorToast = page.locator("[data-sonner-toast]");
          await expect(errorToast).toBeVisible({ timeout: 5000 });
        });
      }

      test("should handle empty input gracefully", async ({ page }) => {
        await page.goto(tool.url);

        // Clear input
        const inputEditor = page.locator(".cm-content").first();
        await inputEditor.click();
        await inputEditor.fill("");
        await page.waitForTimeout(500);

        // Output should be empty or show placeholder
        const outputEditor = page.locator(".cm-content").last();
        const outputText = await outputEditor.textContent();
        expect(outputText?.trim()).toBe("");
      });
    });
  }
});
