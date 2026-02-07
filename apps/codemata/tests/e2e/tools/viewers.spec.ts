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

    // Wait for success toast (indicates preview completed)
    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Verify Preview tab is now active
    await expect(previewTab).toHaveAttribute("data-state", "active");

    // Verify rendered content is visible
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

  test("should prevent preview for empty input", async ({ page }) => {
    await page.goto(REPRESENTATIVE_TOOL.url);

    // Clear any default input
    const inputEditor = page.locator(".cm-content").first();
    await inputEditor.click();
    await inputEditor.clear();

    // Click Preview tab to trigger transformation
    const previewTab = page.getByRole("tab", { name: /preview/i });
    await previewTab.click();

    // Should show error message in preview panel
    const previewPanel = page
      .locator('[role="tabpanel"]')
      .filter({ hasText: /enter some markdown/i });
    await expect(previewPanel).toBeVisible();

    // Copy HTML button should be disabled (no output)
    const copyButton = page.getByRole("button", { name: /copy html/i });
    await expect(copyButton).toBeDisabled();
  });
});
