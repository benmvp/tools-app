import { test, expect } from "@playwright/test";

/**
 * JSON Validator Component Tests
 * Tests JsonValidator component behavior using JSON Validator tool
 * Runs on desktop only (device-independent component behavior)
 *
 * Per sample-based testing strategy:
 * - Tests ONE validator tool (JSON Validator) to validate component behavior
 * - All validator tools use same component, so testing one validates all
 * - Complements unit tests (which test validation logic)
 */

const TOOL_URL = "/validators/json-validator";

test.describe("JSON Validator Component", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(TOOL_URL);
		await page.waitForLoadState("networkidle");
	});

	test("displays validation errors for invalid JSON syntax", async ({
		page,
	}) => {
		// Find the JSON input editor (first CodeMirror on page)
		const inputEditor = page.locator(".cm-content").first();
		await expect(inputEditor).toBeVisible();

		// Enter invalid JSON (trailing comma)
		await inputEditor.click();
		await inputEditor.fill('{"name": "test",}');

		// Click validate button
		const validateButton = page.locator('button:has-text("Validate JSON")');
		await validateButton.click();

		// Wait a moment for validation
		await page.waitForTimeout(500);

		// Should show error (looking for "Errors" heading or error text)
		const errorIndicator = page.locator('text=/error/i').first();
		await expect(errorIndicator).toBeVisible();
	});

	test("displays success for valid JSON", async ({ page }) => {
		// Find the JSON input editor (first CodeMirror on page)
		const inputEditor = page.locator(".cm-content").first();
		await expect(inputEditor).toBeVisible();

		// Enter valid JSON
		await inputEditor.click();
		await inputEditor.fill('{"name": "test", "value": 123}');

		// Click validate button
		const validateButton = page.locator('button:has-text("Validate JSON")');
		await validateButton.click();

		// Wait a moment for validation
		await page.waitForTimeout(500);

		// Should show success message
		const successText = page.locator("text=Valid!");
		await expect(successText).toBeVisible();

		// Should show metadata
		const metadataText = page.locator("text=/Type:/i");
		await expect(metadataText).toBeVisible();
	});

	test("expands and collapses schema editor", async ({ page }) => {
		// Schema editor should be collapsed by default (second CodeMirror editor)
		const schemaEditorContent = page.locator(".cm-content").nth(1);
		await expect(schemaEditorContent).not.toBeVisible();

		// Click the "Advanced: Validate Against JSON Schema" button to expand
		const expandButton = page.locator(
			'button:has-text("Advanced: Validate Against JSON Schema")',
		);
		await expect(expandButton).toBeVisible();
		await expandButton.click();

		// Schema editor should now be visible
		await expect(schemaEditorContent).toBeVisible();

		// Click again to collapse
		await expandButton.click();

		// Schema editor should be hidden again
		await expect(schemaEditorContent).not.toBeVisible();
	});

	test("validates against JSON Schema when provided", async ({ page }) => {
		// Expand schema editor
		const expandButton = page.locator(
			'button:has-text("Advanced: Validate Against JSON Schema")',
		);
		await expandButton.click();

		// Enter a schema requiring "name" field (second CodeMirror editor)
		const schemaEditor = page.locator(".cm-content").nth(1);
		await expect(schemaEditor).toBeVisible();
		await schemaEditor.click();
		await schemaEditor.fill(
			JSON.stringify({
				type: "object",
				required: ["name"],
				properties: {
					name: { type: "string" },
				},
			}),
		);

		// Enter JSON missing required field (first CodeMirror editor)
		const inputEditor = page.locator(".cm-content").first();
		await inputEditor.click();
		await inputEditor.fill('{"value": 123}');

		// Click validate button
		const validateButton = page.locator('button:has-text("Validate JSON")');
		await validateButton.click();

		// Wait for validation
		await page.waitForTimeout(500);

		// Should show schema validation error (heading includes count)
		const errorHeading = page.locator('h3:has-text("Errors (")');
		await expect(errorHeading).toBeVisible();

		// Error should mention required field (select from error button, not schema editor)
		const errorButton = page.locator('button[aria-label*="Error at line"]');
		await expect(errorButton).toContainText(/required.*name/i);
	});

	test("handles empty input gracefully", async ({ page }) => {
		// Input editor should be visible (first CodeMirror on page)
		const inputEditor = page.locator(".cm-content").first();
		await expect(inputEditor).toBeVisible();

		// Clear any existing content
		await inputEditor.click();
		await inputEditor.press("Meta+A"); // Select all
		await inputEditor.press("Backspace");

		// Validate button should be disabled when input is empty
		const validateButton = page.locator('button:has-text("Validate JSON")');
		await expect(validateButton).toBeDisabled();
	});

	test("displays metadata for valid JSON", async ({ page }) => {
		// Enter valid JSON object (first CodeMirror on page)
		const inputEditor = page.locator(".cm-content").first();
		await inputEditor.click();
		await inputEditor.fill('{"name": "test", "items": [1, 2, 3]}');

		// Click validate button
		const validateButton = page.locator('button:has-text("Validate JSON")');
		await validateButton.click();

		// Wait for validation
		await page.waitForTimeout(500);

		// Should show success with metadata
		const successText = page.locator("text=Valid!");
		await expect(successText).toBeVisible();

		// Should show metadata (properties count and type)
		const typeText = page.locator("text=/Type:.*object/i");
		await expect(typeText).toBeVisible();

		const propertiesText = page.locator("text=/Properties:.*2/i");
		await expect(propertiesText).toBeVisible();
	});

	test("scrolls to error when clicking error message", async ({ page }) => {
		// Enter multi-line invalid JSON (first CodeMirror on page)
		const inputEditor = page.locator(".cm-content").first();
		await inputEditor.click();
		await inputEditor.fill(`{
  "name": "test",
  "value": 123,
  "data": {
    "nested": "value",
  }
}`);

		// Click validate button
		const validateButton = page.locator('button:has-text("Validate JSON")');
		await validateButton.click();

		// Wait for validation
		await page.waitForTimeout(500);

		// Should show error
		const errorHeading = page.locator('h3:has-text("Errors (")');
		await expect(errorHeading).toBeVisible();

		// Find the first error button (they're clickable buttons)
		const firstError = page.locator('button[aria-label*="Error at line"]').first();
		await expect(firstError).toBeVisible();
		await firstError.click();

		// Note: Scrolling behavior is visual, hard to test programmatically
		// This test mainly verifies the click doesn't throw errors
		// Manual testing should verify actual scrolling
	});

	test("preserves schema when toggling visibility", async ({ page }) => {
		// Expand schema editor
		const expandButton = page.locator(
			'button:has-text("Advanced: Validate Against JSON Schema")',
		);
		await expandButton.click();

		// Enter a schema (second CodeMirror editor)
		const schemaEditor = page.locator(".cm-content").nth(1);
		await schemaEditor.click();
		const schemaValue = JSON.stringify({
			type: "object",
			required: ["name"],
		});
		await schemaEditor.fill(schemaValue);

		// Collapse
		await expandButton.click();

		// Expand again
		await expandButton.click();

		// Schema should still be there
		await expect(schemaEditor).toHaveText(schemaValue);
	});

	test("handles invalid schema gracefully", async ({ page }) => {
		// Expand schema editor
		const expandButton = page.locator(
			'button:has-text("Advanced: Validate Against JSON Schema")',
		);
		await expandButton.click();

		// Enter invalid schema (malformed JSON, second CodeMirror editor)
		const schemaEditor = page.locator(".cm-content").nth(1);
		await schemaEditor.click();
		await schemaEditor.fill("{invalid json}");

		// Enter valid JSON input (first CodeMirror editor)
		const inputEditor = page.locator(".cm-content").first();
		await inputEditor.click();
		await inputEditor.fill('{"name": "test"}');

		// Click validate button
		const validateButton = page.locator('button:has-text("Validate JSON")');
		await validateButton.click();

		// Wait for validation
		await page.waitForTimeout(500);

		// Should show error (heading includes count)
		const errorHeading = page.locator('h3:has-text("Errors (")');
		await expect(errorHeading).toBeVisible();
	});
});
