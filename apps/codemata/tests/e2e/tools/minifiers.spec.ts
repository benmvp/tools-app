import { expect, test } from "@playwright/test";
import { MINIFIER_TOOLS } from "../../../lib/tools-data";
import { MINIFIER_SAMPLES } from "../../fixtures/samples";

/**
 * Minifier Tools - Sample-Based Integration Tests
 *
 * Tests ONE representative minifier to validate server action integration.
 * Component behavior (empty input, size display) is tested separately in
 * components/transformer-minifier.spec.ts to avoid duplication.
 *
 * When adding new minifiers: Only add e2e tests if the tool introduces NEW behavior.
 */

test.describe("Minifier Tools - Integration", () => {
  const REPRESENTATIVE_TOOL = MINIFIER_TOOLS["typescript-minifier"];
  const sample = MINIFIER_SAMPLES.typescript;

  test("should minify code via server action", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL.url);

    // Verify page loaded (partial match to handle title variations)
    await expect(page).toHaveTitle(/minifier/i);

    // Find input editor and paste code
    const inputEditor = page.locator(".cm-content").first();
    await inputEditor.click();
    await inputEditor.fill(sample.valid);

    // Click the Minify button
    const minifyButton = page.getByRole("button", { name: /minify/i });
    await minifyButton.click();

    // Wait for success toast (indicates minification completed)
    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Verify size reduction badge appears (indicates minification worked)
    const sizeBadge = page.locator("text=/Reduced by|\\d+%/i").first();
    await expect(sizeBadge).toBeVisible({ timeout: 3000 });

    // Verify copy button is enabled (output exists)
    const copyButton = page.getByRole("button", { name: /copy/i });
    await expect(copyButton).toBeEnabled();
  });
});
