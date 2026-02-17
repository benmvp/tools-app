import { expect, test } from "@playwright/test";

/**
 * GitignoreGenerator Component Tests
 *
 * Tests shared behavior of the GitignoreGenerator component.
 * Uses .gitignore Generator as the representative tool page.
 * These tests validate component logic, not tool-specific functionality.
 *
 * NOTE: Runs on desktop only - component behavior is device-independent.
 */

test.describe("GitignoreGenerator Component", () => {
	const REPRESENTATIVE_TOOL = "/generators/gitignore-generator";

	test("should enable generate button when template selected", async ({
		page,
	}) => {
		await page.goto(REPRESENTATIVE_TOOL);

		// Generate button should be disabled initially
		const generateButton = page.getByRole("button", {
			name: /generate \.gitignore/i,
		});
		await expect(generateButton).toBeDisabled();

		// Select a template (e.g., Node.js)
		const nodeButton = page.getByRole("button", { name: "Node.js" });
		await nodeButton.click();

		// Generate button should now be enabled
		await expect(generateButton).toBeEnabled();
	});

	test("should update selected count when templates toggled", async ({
		page,
	}) => {
		await page.goto(REPRESENTATIVE_TOOL);

		// Select first template
		const nodeButton = page.getByRole("button", {
			name: "Node.js",
			exact: true,
		});
		await nodeButton.click();

		// Verify selected count shows 1
		await expect(page.locator("text=/Selected \\(1\\)/i")).toBeVisible();

		// Select second template
		const pythonButton = page.getByRole("button", {
			name: "Python",
			exact: true,
		});
		await pythonButton.click();

		// Verify selected count shows 2
		await expect(page.locator("text=/Selected \\(2\\)/i")).toBeVisible();

		// Deselect first template (click the badge remove button)
		const removeNodeButton = page.getByRole("button", {
			name: "Remove Node.js",
		});
		await removeNodeButton.click();

		// Verify selected count shows 1 again
		await expect(page.locator("text=/Selected \\(1\\)/i")).toBeVisible();
	});

	test("should show output and enable copy button after generation", async ({
		page,
	}) => {
		await page.goto(REPRESENTATIVE_TOOL);

		// Select a template
		const nodeButton = page.getByRole("button", { name: "Node.js" });
		await nodeButton.click();

		// Click generate
		const generateButton = page.getByRole("button", {
			name: /generate \.gitignore/i,
		});
		await generateButton.click();

		// Wait for generation to complete (button re-enabled)
		await expect(generateButton).toBeEnabled({ timeout: 5000 });

		// Verify copy button is visible and enabled
		const copyButton = page.getByRole("button", {
			name: /copy to clipboard/i,
		});
		await expect(copyButton).toBeVisible();
		await expect(copyButton).toBeEnabled();
	});

	test("should clear output when clear button clicked", async ({ page }) => {
		await page.goto(REPRESENTATIVE_TOOL);

		// Select and generate
		const nodeButton = page.getByRole("button", { name: "Node.js" });
		await nodeButton.click();

		const generateButton = page.getByRole("button", {
			name: /generate \.gitignore/i,
		});
		await generateButton.click();

		// Wait for generation to complete (button re-enabled)
		await expect(generateButton).toBeEnabled({ timeout: 5000 });

		// Click clear button
		const clearButton = page.getByRole("button", { name: /clear/i });
		await clearButton.click();

		// Copy button should no longer be visible (no output)
		const copyButton = page.getByRole("button", {
			name: /copy to clipboard/i,
		});
		await expect(copyButton).not.toBeVisible();
	});

	test("should filter templates by search query", async ({ page }) => {
		await page.goto(REPRESENTATIVE_TOOL);

		// Search for "python"
		const searchInput = page.getByPlaceholder(
			/search for languages, frameworks/i,
		);
		await searchInput.fill("python");

		// Python button should be visible
		const pythonButton = page.getByRole("button", {
			name: "Python",
			exact: true,
		});
		await expect(pythonButton).toBeVisible();

		// Node.js button should NOT be visible
		const nodeButton = page.getByRole("button", {
			name: "Node.js",
			exact: true,
		});
		await expect(nodeButton).not.toBeVisible();
	});
});
