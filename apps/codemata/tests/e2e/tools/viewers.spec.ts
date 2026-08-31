import { expect, test } from "@playwright/test";
import { VIEWER_TOOLS } from "../../../lib/tools-data";

/**
 * Viewer Tools - Sample-Based Integration Tests
 *
 * Tests ONE representative viewer to validate server action integration and
 * tabbed UI behavior. Component behavior (tab switching, copy button, size limits)
 * is tested via this integration test since viewers introduce a new UI pattern.
 *
 * When adding new viewers: Only add e2e tests if the tool introduces NEW behavior.
 */

test.describe("Viewer Tools - Integration", () => {
	const REPRESENTATIVE_TOOL = VIEWER_TOOLS["markdown-previewer"];

	test("should preview markdown via server action with tab switching", async ({
		page,
	}) => {
		await page.goto(REPRESENTATIVE_TOOL.url);

		// Verify page loaded
		await expect(page).toHaveTitle(/markdown.*preview/i);

		// Verify Markdown tab is active by default
		const markdownTab = page.getByRole("tab", { name: /markdown/i });
		await expect(markdownTab).toHaveAttribute("data-state", "active");

		// Enter some markdown in the input editor
		const inputEditor = page.locator(".cm-content").first();
		await inputEditor.click();
		await inputEditor.fill("# Hello World\n\n**Bold text** and *italic*");

		// Click the Preview tab (this triggers the transformation)
		const previewTab = page.getByRole("tab", { name: /preview/i });
		await previewTab.click();

		// Verify Preview tab is now active
		await expect(previewTab).toHaveAttribute("data-state", "active");

		// Wait for rendered content to appear (more stable than waiting for toast)
		const previewPanel = page.locator('[role="tabpanel"]').filter({
			has: page.locator("h1"),
		});
		await expect(previewPanel).toBeVisible();
		await expect(previewPanel).toContainText("Hello World");
		await expect(previewPanel.locator("strong")).toContainText("Bold text");
		await expect(previewPanel.locator("em")).toContainText("italic");

		// Verify Copy HTML button is enabled
		const copyButton = page.getByRole("button", {
			name: /copy html/i,
		});
		await expect(copyButton).toBeEnabled();

		// Verify can switch back to Markdown tab
		await markdownTab.click();
		await expect(markdownTab).toHaveAttribute("data-state", "active");

		// Verify editor still has content
		await expect(inputEditor).toContainText("Hello World");
	});

	test("should display size limit indicator", async ({ page }) => {
		await page.goto(REPRESENTATIVE_TOOL.url);

		// Verify size indicator is visible
		const sizeIndicator = page.locator("text=/KB \\/ \\d+KB/");
		await expect(sizeIndicator).toBeVisible();

		// Initially should show nearly 0KB
		await expect(sizeIndicator).toContainText("KB / 50KB");
	});

	test("should prevent preview for empty input", async ({ page }, testInfo) => {
		test.skip(
			Boolean(testInfo.project.use?.isMobile),
			"CodeMirror input clearing is flaky in mobile emulation for this scenario",
		);

		await page.goto(REPRESENTATIVE_TOOL.url);

		// Clear any default input using .fill("") which works for CodeMirror contenteditable
		const inputEditor = page.locator(".cm-content").first();
		await inputEditor.click();
		await inputEditor.fill(""); // Clear content

		// Verify input was actually cleared by checking the size indicator shows "0.0KB"
		await expect(page.locator("text=/0\\.0KB\\s*\\/\\s*50KB/")).toBeVisible({
			timeout: 2000,
		});

		// Click Preview tab to trigger transformation
		const previewTab = page.getByRole("tab", { name: /preview/i });
		await previewTab.click();

		// Wait for preview tab to be active (ensures tab change completed)
		await expect(previewTab).toHaveAttribute("data-state", "active");

		// Should show error message in preview panel
		// The component auto-triggers handlePreview() on tab change, which sets error state
		// Using longer timeout for async state updates on mobile devices
		const errorMessage = page.getByText(
			/please enter some markdown to preview/i,
		);
		await expect(errorMessage).toBeVisible({ timeout: 10000 });

		// Copy HTML button should be disabled (no output)
		const copyButton = page.getByRole("button", { name: /copy html/i });
		await expect(copyButton).toBeDisabled();
	});
});
