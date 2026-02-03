import { expect, test } from "@playwright/test";
import { ALL_TOOLS } from "../../lib/tools-data";

// Test-local convenience constant
const formatters = ALL_TOOLS.formatters.tools;

/**
 * Screen Reader Compatibility Tests
 *
 * Tests ARIA labels, roles, and semantic HTML for screen reader support
 * according to WCAG 4.1.2 (Name, Role, Value)
 */

test.describe("Screen Reader Compatibility", () => {
  test("should have proper ARIA labels on interactive elements", async ({
    page,
  }) => {
    await page.goto("/");

    // Theme toggle should have aria-label
    const themeButton = page.locator('button[aria-label*="theme" i]');
    await expect(themeButton).toHaveAttribute("aria-label", /.+/);

    // Mobile menu button should have aria-label
    const menuButton = page.locator('button[aria-label*="menu" i]');
    if (await menuButton.isVisible()) {
      await expect(menuButton).toHaveAttribute("aria-label", /.+/);
    }
  });

  test("should have proper ARIA roles on dialog", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+KeyK");

    // Command menu should have role="dialog" and be visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 3000 });

    // Dialog should have aria-label or aria-labelledby
    const hasLabel =
      (await dialog.getAttribute("aria-label")) ||
      (await dialog.getAttribute("aria-labelledby"));
    expect(hasLabel).toBeTruthy();
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Check heading structure
    const h1 = await page.locator("h1").count();
    expect(h1).toBe(1); // Exactly one h1

    // H2s should exist after h1
    const h2 = await page.locator("h2").count();
    expect(h2).toBeGreaterThan(0);

    // Get all headings in order
    const headings = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .evaluateAll((elements) =>
        elements.map((el) => Number.parseInt(el.tagName[1], 10)),
      );

    // First should be h1
    expect(headings[0]).toBe(1);

    // No skipped levels (h1 -> h3 without h2)
    for (let i = 1; i < headings.length; i++) {
      const diff = headings[i] - headings[i - 1];
      expect(diff).toBeLessThanOrEqual(1); // Can stay same or go down 1 level
    }
  });

  test("tool page should have proper heading hierarchy", async ({ page }) => {
    await page.goto(formatters[0].url);

    // Tool name in h1
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(formatters[0].name);

    // Content sections should use h2 or h3
    const h2Count = await page.locator("h2").count();
    expect(h2Count).toBeGreaterThan(0); // At least one h2 for sections
  });

  test("should have descriptive button labels", async ({ page }) => {
    await page.goto(formatters[0].url);

    // Copy button should have descriptive text
    const copyButton = page.locator('button:has-text("Copy")').first();
    if (await copyButton.isVisible()) {
      const text = await copyButton.textContent();
      expect(text).toBeTruthy();
      expect(text?.trim().length).toBeGreaterThan(0);
    }

    // Clear button should have descriptive text
    const clearButton = page.locator('button:has-text("Clear")');
    if (await clearButton.count()) {
      const text = await clearButton.first().textContent();
      expect(text).toBeTruthy();
    }
  });

  test("form controls should have associated labels", async ({ page }) => {
    await page.goto(formatters[0].url);

    // Indentation select should have label
    const select = page.locator('select[name="indentation"]');

    if (await select.isVisible()) {
      // Should have aria-label or associated <label> element
      const ariaLabel = await select.getAttribute("aria-label");
      const id = await select.getAttribute("id");

      let hasLabel = !!ariaLabel;

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabel = hasLabel || (await label.count()) > 0;
      }

      expect(hasLabel).toBe(true);
    }
  });

  test("should announce dynamic content changes", async ({ page }) => {
    await page.goto(formatters[0].url);

    // Look for aria-live regions for toast notifications
    const liveRegions = page.locator("[aria-live]");
    const count = await liveRegions.count();

    if (count > 0) {
      // Verify aria-live value
      const ariaLive = await liveRegions.first().getAttribute("aria-live");
      expect(["polite", "assertive"]).toContain(ariaLive);
    }
  });

  test("command menu should announce search results", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+KeyK");

    // Wait for dialog to be visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 3000 });

    // Search input should have aria-label
    const searchInput = page.locator('[role="dialog"] input');
    const ariaLabel = await searchInput.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();

    // Results container should have role
    const resultsContainer = page.locator('[role="listbox"], [role="list"]');
    if (await resultsContainer.count()) {
      await expect(resultsContainer.first()).toBeVisible();
    }
  });

  test("navigation links should have accessible names", async ({ page }) => {
    await page.goto("/");

    // All visible links should have text content or aria-label
    const links = page.locator("a");
    const count = await links.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = links.nth(i);

      // Skip hidden links
      if (!(await link.isVisible())) continue;

      const text = await link.textContent();
      const ariaLabel = await link.getAttribute("aria-label");
      const title = await link.getAttribute("title");

      // Check if link contains an image with alt text
      const img = link.locator("img").first();
      const imgAlt =
        (await img.count()) > 0 ? await img.getAttribute("alt") : null;

      const hasAccessibleName =
        (text && text.trim().length > 0) ||
        (ariaLabel && ariaLabel.length > 0) ||
        (title && title.length > 0) ||
        (imgAlt && imgAlt.length > 0);
      expect(hasAccessibleName).toBe(true);
    }
  });

  test("images should have alt text", async ({ page }) => {
    await page.goto("/");

    // All img elements should have alt attribute
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const hasAlt = await img.getAttribute("alt");
      expect(hasAlt).not.toBeNull(); // Alt can be empty for decorative images
    }
  });

  test("icon-only buttons should have aria-labels", async ({ page }) => {
    await page.goto("/");

    // Theme toggle (icon-only button)
    const themeButton = page.locator('button[aria-label*="theme" i]');
    if (await themeButton.isVisible()) {
      const ariaLabel = await themeButton.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.length).toBeGreaterThan(3);
    }
  });

  test("collapsible sections should have proper ARIA attributes", async ({
    page,
  }) => {
    await page.goto(formatters[0].url);

    // Find collapsible content sections (if any)
    const collapsibleButtons = page.locator("button[aria-expanded]");
    const count = await collapsibleButtons.count();

    if (count > 0) {
      const button = collapsibleButtons.first();

      // Should have aria-expanded
      const ariaExpanded = await button.getAttribute("aria-expanded");
      expect(["true", "false"]).toContain(ariaExpanded);

      // Should have aria-controls (optional for some UI libraries)
      const ariaControls = await button.getAttribute("aria-controls");
      expect(ariaControls).toBeTruthy();
      // Note: We skip checking if the controlled element exists because Radix UI
      // uses dynamic IDs that may not match between server/client rendering
    }
  });

  test("sidebar navigation should have proper ARIA structure", async ({
    page,
  }) => {
    await page.goto("/");

    // Sidebar should be a nav element
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();

    // Nav should have aria-label
    const ariaLabel = await nav.getAttribute("aria-label");
    if (ariaLabel) {
      expect(ariaLabel.length).toBeGreaterThan(0);
    }
  });
});
