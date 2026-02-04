import { expect, test } from "@playwright/test";
import { GENERATOR_TOOLS } from "../../../lib/tools-data";

/**
 * Generator Tools - Sample-Based Integration Tests
 *
 * Tests ONE representative generator to validate server action integration.
 * Component behavior (checkbox interactions, template selection, output generation)
 * is tested separately in components/gitignore-generator.spec.ts to avoid duplication.
 *
 * When adding new generators: Only add e2e tests if the tool introduces NEW behavior.
 */

test.describe("Generator Tools - Integration", () => {
  const REPRESENTATIVE_TOOL = GENERATOR_TOOLS["gitignore-generator"];

  test("should generate gitignore via server action", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL.url);

    // Verify page loaded (partial match to handle title variations)
    await expect(page).toHaveTitle(/gitignore.*generator/i);

    // Select a template (Node)
    const nodeButton = page.getByRole("button", { name: "Node", exact: true });
    await nodeButton.click();

    // Click the Generate button
    const generateButton = page.getByRole("button", {
      name: /generate \.gitignore/i,
    });
    await generateButton.click();

    // Wait for success toast (indicates generation completed)
    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Verify copy button is enabled (output exists)
    const copyButton = page.getByRole("button", {
      name: /copy to clipboard/i,
    });
    await expect(copyButton).toBeEnabled();
  });
});
