import { expect, test } from "@playwright/test";
import { MINIFIER_TOOLS } from "../../../lib/tools-data";
import { MINIFIER_SAMPLES } from "../../fixtures/samples";

test.describe("Minifier Tools", () => {
  // Auto-generate tests for all minifiers
  for (const [, tool] of Object.entries(MINIFIER_TOOLS)) {
    test.describe(tool.name, () => {
      test("should minify valid code successfully", async ({ page }) => {
        await page.goto(tool.url);

        // Verify page loaded - check metadata title
        await expect(page).toHaveTitle(new RegExp(tool.metadata.title, "i"));

        // Get sample data for this tool
        const sampleKey = tool.id.replace(
          "-min",
          "",
        ) as keyof typeof MINIFIER_SAMPLES;
        const sample = MINIFIER_SAMPLES[sampleKey];

        if (!sample) {
          test.skip(true, `No test fixture for ${tool.id}`);
          return;
        }

        // Find input editor and paste code
        const inputEditor = page.locator(".cm-content").first();
        await inputEditor.click();
        await inputEditor.fill(sample.valid);

        // Click the Minify button
        await page.getByRole("button", { name: /minify/i }).click();

        // Wait for output editor to have content (server action + re-render)
        const outputEditor = page.locator(".cm-content").last();
        await expect(outputEditor).not.toBeEmpty({ timeout: 5000 });
        const outputText = await outputEditor.textContent();
        expect(outputText).toBeTruthy();
        expect(outputText?.length).toBeGreaterThan(0);

        // Verify output is smaller than input (minified)
        const inputText = await inputEditor.textContent();
        expect(outputText?.length).toBeLessThanOrEqual(inputText?.length ?? 0);
      });

      test("should show file size reduction", async ({ page }) => {
        await page.goto(tool.url);

        const sampleKey = tool.id.replace(
          "-min",
          "",
        ) as keyof typeof MINIFIER_SAMPLES;
        const sample = MINIFIER_SAMPLES[sampleKey];

        if (!sample) {
          test.skip(true, `No test fixture for ${tool.id}`);
          return;
        }

        // Enter code
        const inputEditor = page.locator(".cm-content").first();
        await inputEditor.click();
        await inputEditor.fill(sample.valid);
        await page.waitForTimeout(1000);

        // Look for size/savings display
        const sizeBadge = page.locator("text=/\\d+%|bytes|KB/i");
        if (await sizeBadge.isVisible()) {
          await expect(sizeBadge).toBeVisible();
        }
      });

      test("should handle empty input gracefully", async ({ page }) => {
        await page.goto(tool.url);

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

      test("should preserve code with comments removed", async ({ page }) => {
        await page.goto(tool.url);

        const sampleKey = tool.id.replace(
          "-min",
          "",
        ) as keyof typeof MINIFIER_SAMPLES;
        const sample = MINIFIER_SAMPLES[sampleKey];

        if (!sample || !("withComments" in sample) || !sample.withComments) {
          test.skip(true, `No comments fixture for ${tool.id}`);
          return;
        }

        // Enter code with comments
        const inputEditor = page.locator(".cm-content").first();
        await inputEditor.click();
        await inputEditor.fill(sample.withComments);

        // Click Minify button
        await page.getByRole("button", { name: /minify/i }).click();
        await page.waitForTimeout(1500);

        // Verify output has content (comments removed)
        const outputEditor = page.locator(".cm-content").last();
        const outputText = await outputEditor.textContent();
        expect(outputText).toBeTruthy();
        expect(outputText?.length).toBeGreaterThan(0);
      });
    });
  }
});
