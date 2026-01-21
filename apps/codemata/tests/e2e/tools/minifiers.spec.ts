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
});
