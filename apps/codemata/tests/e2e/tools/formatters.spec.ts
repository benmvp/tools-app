import { expect, test } from "@playwright/test";
import { FORMATTER_TOOLS } from "../../../lib/tools-data";
import { FORMATTER_SAMPLES } from "../../fixtures/samples";

/**
 * Formatter Tools - Sample-Based Integration Tests
 *
 * Tests ONE representative formatter to validate server action integration.
 * Component behavior (empty input, config changes, copy buttons, errors) is tested
 * separately in components/transformer.spec.ts to avoid duplication.
 *
 * When adding new formatters: Only add e2e tests if the tool introduces NEW behavior.
 */

test.describe("Formatter Tools - Integration", () => {
	const REPRESENTATIVE_TOOL = FORMATTER_TOOLS["typescript-formatter"];
	const sample = FORMATTER_SAMPLES.typescript;

	test("should format code via server action", async ({ page }) => {
		await page.goto(REPRESENTATIVE_TOOL.url);

		// Verify page loaded
		await expect(page).toHaveTitle(
			new RegExp(REPRESENTATIVE_TOOL.metadata.title, "i"),
		);

		// Find input editor and paste code
		const inputEditor = page.locator(".cm-content").first();
		await inputEditor.click();
		await inputEditor.fill(sample.valid);

		// Click the Format button
		const formatButton = page.getByRole("button", { name: /format/i });
		await formatButton.click();

		// Wait for success toast (indicates formatting completed)
		const toast = page.locator("[data-sonner-toast]").first();
		await expect(toast).toBeVisible({ timeout: 5000 });

		// Verify copy button is enabled (output exists)
		const copyButton = page.getByRole("button", { name: /copy/i }).first();
		await expect(copyButton).toBeEnabled();
	});
});
